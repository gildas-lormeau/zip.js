// Audits the agreement between the shapes declared in index.d.ts and the objects the library builds.
//
// It reads the interfaces from index.d.ts, produces real instances through the public API, then checks
// that every non-optional member is defined and that every defined member holds a value of the declared
// type, recursing into the nested interfaces. A member that is legitimately absent on a given specimen
// must be recorded in shape-decisions.js, and a recorded exception that no longer fires is a failure too.
//
// The assertions come from the declarations, never from the observed values, so a declaration that
// promises what the library does not deliver fails here.
//
// Run with: npm run test-api-shape

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { EXPECTED_ABSENT } from "./shape-decisions.js";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DECLARATIONS = ROOT + "index.d.ts";
const PASSWORD = "secret";

const zip = await import(pathToFileURL(ROOT + "index.js"));
const failures = [];
const usedExceptions = new Set();
const observed = new Map();
const interfaces = getInterfaces();

zip.configure({ useWebWorkers: false });

const specimens = await getSpecimens();
specimens.forEach(({ label, type, value }) => check(label, type, value, "", new Set()));
checkExceptions();
summarize();

function getInterfaces() {
	const source = ts.createSourceFile(DECLARATIONS, readFileSync(DECLARATIONS, "utf-8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const declarations = new Map();
	ts.forEachChild(source, node => {
		if (ts.isInterfaceDeclaration(node)) {
			declarations.set(node.name.text, node);
		}
	});
	const result = new Map();
	declarations.forEach((node, name) => result.set(name, getMembers(name, new Set())));
	return result;

	function getMembers(name, seen) {
		const members = new Map();
		const node = declarations.get(name);
		if (!node || seen.has(name)) {
			return members;
		}
		seen.add(name);
		if (node.heritageClauses) {
			node.heritageClauses.forEach(clause => clause.types.forEach(parent =>
				getMembers(parent.expression.getText(source), seen).forEach((member, memberName) => members.set(memberName, member))));
		}
		node.members.forEach(member => {
			if (member.name && (ts.isPropertySignature(member) || ts.isMethodSignature(member))) {
				members.set(member.name.getText(source), {
					optional: Boolean(member.questionToken),
					type: ts.isMethodSignature(member) ? "=>" : member.type ? member.type.getText(source) : "unknown"
				});
			}
		});
		return members;
	}
}

async function getSpecimens() {
	const options = {
		comment: "entry comment",
		lastAccessDate: new Date(),
		creationDate: new Date(),
		extendedTimestamp: true,
		unixMode: 0o100755,
		uid: 501,
		gid: 20,
		extraField: new Map([[0x1234, new Uint8Array([1, 2])]]),
		password: PASSWORD,
		zip64: true
	};
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 0 });
	const addedFile = await writer.add("file.txt", new zip.TextReader("content"), options);
	const addedDirectory = await writer.add("folder/", undefined, Object.assign({}, options, { directory: true }));
	const addedPlainFile = await writer.add("plain.txt", new zip.TextReader("content"));
	const addedSymlink = await writer.add("link", new zip.TextReader("plain.txt"), { unixMode: 0o120777 });
	const data = await writer.close(new TextEncoder().encode("archive comment"));
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data), {
		password: PASSWORD,
		checkLocalFilename: true,
		checkOverlappingEntry: true
	});
	const entries = await reader.getEntries();
	await entries[0].getData(new zip.TextWriter());
	await reader.close();
	const filesystem = new zip.fs.FS();
	await filesystem.importUint8Array(data, { password: PASSWORD });
	await zip.terminateWorkers();
	return [
		{ label: "ZipReader#getEntries (file)", type: "FileEntry", value: entries.find(entry => entry.filename == "file.txt") },
		{ label: "ZipReader#getEntries (directory)", type: "DirectoryEntry", value: entries.find(entry => entry.directory) },
		{ label: "ZipReader#getEntries (plain file)", type: "FileEntry", value: entries.find(entry => entry.filename == "plain.txt") },
		{ label: "ZipReader#getEntries (symlink)", type: "FileEntry", value: entries.find(entry => entry.symlink) },
		{ label: "ZipWriter#add (file)", type: "EntryMetaData", value: addedFile },
		{ label: "ZipWriter#add (directory)", type: "EntryMetaData", value: addedDirectory },
		{ label: "ZipWriter#add (plain file)", type: "EntryMetaData", value: addedPlainFile },
		{ label: "ZipWriter#add (symlink)", type: "EntryMetaData", value: addedSymlink },
		{ label: "fs ZipEntry#data", type: "EntryMetaData", value: filesystem.find("file.txt").data }
	];
}

function check(label, typeName, value, path, seen) {
	if (value === undefined || value === null || seen.has(value)) {
		return;
	}
	seen.add(value);
	const members = interfaces.get(typeName);
	members.forEach((member, name) => {
		const memberPath = path ? `${path}.${name}` : name;
		const memberValue = value[name];
		observe(typeName, name, memberValue !== undefined);
		if (memberValue === undefined) {
			if (!member.optional && !isExpectedAbsent(label, memberPath)) {
				failures.push(`${label}: ${memberPath} is declared as required and is undefined`);
			}
		} else {
			if (member.optional && isExpectedAbsent(label, memberPath)) {
				failures.push(`${label}: ${memberPath} is recorded as absent and is defined`);
			}
			if (!matchesType(member.type, memberValue)) {
				failures.push(`${label}: ${memberPath} is declared as ${member.type} and holds ${describe(memberValue)}`);
			}
			getInterfaceTypes(member.type).forEach(nested => check(label, nested, memberValue, memberPath, seen));
		}
	});
}

function getUnionMembers(type) {
	const members = [];
	let depth = 0;
	let current = "";
	[...type].forEach(character => {
		if (character == "<" || character == "(" || character == "[") {
			depth++;
		}
		if (character == ">" || character == ")" || character == "]") {
			depth--;
		}
		if (character == "|" && !depth) {
			members.push(current.trim());
			current = "";
		} else {
			current += character;
		}
	});
	members.push(current.trim());
	return members.filter(member => member.length);
}

function getInterfaceTypes(type) {
	return getUnionMembers(type).filter(member => interfaces.has(member));
}

function matchesType(type, value) {
	return getUnionMembers(type).some(member => matches(member, value));

	function matches(member, value) {
		if (member.includes("=>")) {
			return typeof value == "function";
		}
		if (member.endsWith("[]") || member.startsWith("Array<") || member.startsWith("ReadonlyArray<")) {
			return Array.isArray(value);
		}
		if (member.startsWith("Map<")) {
			return value instanceof Map;
		}
		if (member.startsWith("Record<") || member.startsWith("{")) {
			return typeof value == "object";
		}
		if (member == "true" || member == "false") {
			return value === (member == "true");
		}
		if (member == "number" || member == "string" || member == "boolean" || member == "bigint" || member == "function" || member == "symbol") {
			return typeof value == member;
		}
		if (member == "any" || member == "unknown" || member == "unknown_type") {
			return true;
		}
		if (member.startsWith("\"") || member.startsWith("'")) {
			return value === member.slice(1, -1);
		}
		if (interfaces.has(member)) {
			return typeof value == "object";
		}
		const global = globalThis[member];
		if (typeof global == "function") {
			return value instanceof global;
		}
		return true;
	}
}

function describe(value) {
	if (value instanceof Map) {
		return "a Map";
	}
	if (Array.isArray(value)) {
		return "an array";
	}
	if (value && value.constructor && value.constructor.name != "Object") {
		return `a ${value.constructor.name}`;
	}
	return `a ${typeof value} (${String(value).slice(0, 24)})`;
}

function observe(typeName, name, defined) {
	const key = `${typeName}#${name}`;
	observed.set(key, observed.get(key) || defined);
}

function isExpectedAbsent(label, path) {
	const exceptions = EXPECTED_ABSENT[label];
	if (exceptions && exceptions[path] !== undefined) {
		usedExceptions.add(`${label}:${path}`);
		return true;
	}
	return false;
}

function checkExceptions() {
	Object.keys(EXPECTED_ABSENT).forEach(label => {
		if (!specimens.some(specimen => specimen.label == label)) {
			failures.push(`the exceptions recorded for ${label} refer to a specimen that no longer exists`);
		}
		Object.keys(EXPECTED_ABSENT[label]).forEach(path => {
			if (!usedExceptions.has(`${label}:${path}`)) {
				failures.push(`${label}: the exception recorded for ${path} no longer applies`);
			}
		});
	});
}

function summarize() {
	specimens.forEach(({ label, type }) => console.log(`${label}: checked against ${type}`));
	const never = [...observed].filter(([, defined]) => !defined).map(([key]) => key);
	console.log(`\n${observed.size} declared members reached, ${never.length} never observed with a value:`);
	never.forEach(key => console.log(`  ${key}`));
	console.log("");
	if (failures.length) {
		failures.forEach(failure => console.log(`FAIL ${failure}`));
		console.log(`\n${failures.length} shape mismatch(es)`);
		process.exit(1);
	}
	console.log("every declared member holds a value of the declared type on every specimen");
}
