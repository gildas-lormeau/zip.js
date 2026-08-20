// Audits the members of the public API against the two lists that decide whether minification keeps them.
//
// terser mangles every property name except those on the reserved list built by reserved-property-names.js,
// whose first and largest source is index.d.ts. A member of a public class therefore has exactly two correct
// states: declared in index.d.ts, so the minified builds keep it on purpose, or absent from index.d.ts and
// present in mangled-property-names.js, so the minified builds rename it on purpose.
//
// A member in neither list is the failure this audit exists for: it is undeclared, so nothing in the build
// intends to keep it, yet it survives anyway because its name happens to collide with a name terser protects
// on its own, i.e. a DOM property or a member of lib.dom/lib.webworker. It works today and disappears the day
// terser updates that list. ZipEntry#moveTo lived in that state for five weeks before being removed.
//
// The reverse, a member declared in index.d.ts and mangled, cannot happen while the reserved list is built
// from the declarations, so it is asserted rather than reported: it would mean the two files disagree.
//
// The audit reads the source build, where nothing is mangled, because that is the only build in which an
// internal member is still visible under its real name.
//
// Run with: npm run test-api-mangling

import { fileURLToPath, pathToFileURL } from "node:url";
import { collectDeclarationNames } from "../../reserved-property-names.js";
import { MANGLED_PROPERTY_NAMES } from "../../mangled-property-names.js";
import { ACCEPTED_UNDECLARED } from "./mangling-decisions.js";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const PASSWORD = "secret";
const IGNORED_MEMBERS = ["constructor", "length", "name", "prototype", "caller", "arguments"];

const zip = await import(pathToFileURL(ROOT + "index.js"));
const declared = collectDeclarationNames(ROOT + "index.d.ts");
const mangled = new Set(MANGLED_PROPERTY_NAMES);
const members = new Map();
const failures = [];
const usedExceptions = new Set();

zip.configure({ useWebWorkers: false });

collectClasses();
await collectInstances();
await zip.terminateWorkers();
classify();
checkExceptions();
summarize();

function collectClasses() {
	Object.entries(zip).forEach(([name, value]) => {
		if (name == "fs") {
			Object.entries(value).forEach(([fsName, fsValue]) => collectPrototype(fsValue, "zip.fs." + fsName));
		} else {
			collectPrototype(value, "zip." + name);
		}
	});
}

function collectPrototype(value, label) {
	if (typeof value != "function" || !value.prototype) {
		return;
	}
	let prototype = value.prototype;
	while (prototype && prototype != Object.prototype) {
		Object.getOwnPropertyNames(prototype).forEach(name => record(name, label + "#" + name));
		prototype = Object.getPrototypeOf(prototype);
	}
	Object.getOwnPropertyNames(value).forEach(name => record(name, label + "." + name));
}

function collectInstance(value, label) {
	if (value && typeof value == "object") {
		Object.getOwnPropertyNames(value).forEach(name => record(name, label + "." + name));
	}
}

function record(name, origin) {
	if (!IGNORED_MEMBERS.includes(name)) {
		if (!members.has(name)) {
			members.set(name, new Set());
		}
		members.get(name).add(origin);
	}
}

async function collectInstances() {
	const options = {
		comment: "entry comment",
		lastAccessDate: new Date(),
		creationDate: new Date(),
		extendedTimestamp: true,
		unixMode: 0o100755,
		uid: 501,
		gid: 20,
		extraField: new Map([[0x1234, new Uint8Array([1, 2])]]),
		localExtraField: new Map([[0x1235, new Uint8Array([3])]]),
		password: PASSWORD,
		zip64: true
	};
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 0, keepOrder: true });
	collectInstance(writer, "ZipWriter");
	collectInstance(await writer.add("file.txt", new zip.TextReader("content"), options), "ZipWriter#add");
	await writer.add("folder/", undefined, Object.assign({}, options, { directory: true }));
	await writer.add("plain.txt", new zip.TextReader("content"), { dataDescriptor: false });
	await writer.add("link", new zip.TextReader("plain.txt"), { unixMode: 0o120777 });
	const data = await writer.close(new TextEncoder().encode("archive comment"));
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { password: PASSWORD, checkLocalFilename: true });
	collectInstance(reader, "ZipReader");
	const entries = await reader.getEntries();
	entries.forEach(entry => {
		collectInstance(entry, "Entry");
		collectInstance(entry.localDirectory, "Entry.localDirectory");
	});
	await entries.find(entry => entry.filename == "file.txt").getData(new zip.TextWriter());
	await reader.close();
	const filesystem = new zip.fs.FS();
	collectInstance(filesystem, "zip.fs.FS");
	collectInstance(filesystem.addText("added.txt", "content"), "zip.fs.FS#addText");
	collectInstance(filesystem.addDirectory("added"), "zip.fs.FS#addDirectory");
	await filesystem.importUint8Array(data, { password: PASSWORD });
	filesystem.entries.forEach(entry => collectInstance(entry, "zip.fs entry"));
	collectInstance(new zip.Uint8ArrayReader(data), "Uint8ArrayReader");
	collectInstance(new zip.Uint8ArrayWriter(), "Uint8ArrayWriter");
	collectInstance(new zip.SplitDataWriter(() => new zip.Uint8ArrayWriter()), "SplitDataWriter");
}

function classify() {
	const counts = { declared: 0, mangled: 0, accepted: 0 };
	[...members.keys()].sort().forEach(name => {
		const origins = [...members.get(name)].sort().join(", ");
		if (declared.has(name)) {
			counts.declared++;
			if (mangled.has(name)) {
				failures.push(`${name} is declared in index.d.ts and listed in mangled-property-names.js (${origins})`);
			}
		} else if (mangled.has(name)) {
			counts.mangled++;
		} else if (isAccepted(name)) {
			counts.accepted++;
		} else {
			failures.push(`${name} is undeclared and unmangled, so it survives minification only by name collision (${origins})`);
		}
	});
	console.log(`${members.size} members reached: ${counts.declared} declared, ${counts.mangled} mangled, ${counts.accepted} accepted`);
}

function isAccepted(name) {
	if (ACCEPTED_UNDECLARED[name] !== undefined) {
		usedExceptions.add(name);
		return true;
	}
	return false;
}

function checkExceptions() {
	Object.keys(ACCEPTED_UNDECLARED).forEach(name => {
		if (!usedExceptions.has(name)) {
			failures.push(`the exception recorded for ${name} no longer applies`);
		}
	});
}

function summarize() {
	if (failures.length) {
		failures.forEach(failure => console.log(`FAIL ${failure}`));
		console.log(`\n${failures.length} member(s) whose survival in the minified builds is undecided`);
		process.exit(1);
	}
	console.log("every member of the public API is either declared in index.d.ts or mangled on purpose");
}
