// Audits the symmetry between what the reader exposes and what the writer can produce.
//
// It compares the declarations in index.d.ts and the extra field types in lib/core/constants.js
// against the decisions recorded in decisions.js, and fails when a member has no decision, when a
// decision points at a member that no longer exists, or when the reader and the writer disagree
// about an extra field type without that being recorded.
//
// Run with: npm run test-api-symmetry

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { ENTRY_PROPERTIES, WRITER_OPTIONS, EXTRA_FIELD_TYPES } from "./decisions.js";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DECLARATIONS = ROOT + "index.d.ts";
const CONSTANTS = ROOT + "lib/core/constants.js";
const READER = ROOT + "lib/core/zip-reader.js";
const WRITER = ROOT + "lib/core/zip-writer.js";
const READ_SURFACE = "DirectoryEntry";
const WRITE_SURFACES = ["ZipWriterAddDataOptions", "ZipWriterCloseOptions"];
const CATEGORIES_ENTRY = ["options", "indirect", "argument", "computed", "derived", "deprecated", "readOnly"];
const CATEGORIES_OPTION = ["properties", "archive", "machinery", "deprecated", "writeOnly"];

const failures = [];
const program = ts.createProgram([DECLARATIONS], { strict: true, noEmit: true, skipLibCheck: true });
const checker = program.getTypeChecker();
const declarations = program.getSourceFile(DECLARATIONS);
const interfaces = new Map();
ts.forEachChild(declarations, node => {
	if (ts.isInterfaceDeclaration(node)) {
		interfaces.set(node.name.text, node);
	}
});

const entryProperties = getMembers(READ_SURFACE);
const writerOptions = new Map();
WRITE_SURFACES.forEach(name => getMembers(name).forEach((member, memberName) => writerOptions.set(memberName, member)));
const extraFieldTypes = getExtraFieldTypes();
const readerIdentifiers = getIdentifiers(READER);
const writerIdentifiers = getIdentifiers(WRITER);

report("read surface", READ_SURFACE, entryProperties, ENTRY_PROPERTIES, CATEGORIES_ENTRY);
report("write surface", WRITE_SURFACES.join(" + "), writerOptions, WRITER_OPTIONS, CATEGORIES_OPTION);
checkReferences(ENTRY_PROPERTIES, "options", writerOptions, "writer option");
checkReferences(ENTRY_PROPERTIES, "indirect", writerOptions, "writer option");
checkReferences(WRITER_OPTIONS, "properties", entryProperties, "entry property");
checkReferences(ENTRY_PROPERTIES, "derived", entryProperties, "entry property");
checkReferences(ENTRY_PROPERTIES, "deprecated", entryProperties, "entry property");
checkReferences(WRITER_OPTIONS, "deprecated", writerOptions, "writer option");
checkDeprecations(entryProperties, ENTRY_PROPERTIES, "entry property");
checkDeprecations(writerOptions, WRITER_OPTIONS, "writer option");
checkExtraFieldTypes();
summarize();

function getMembers(interfaceName) {
	const node = interfaces.get(interfaceName);
	if (!node) {
		throw new Error(`unknown interface ${interfaceName}`);
	}
	const members = new Map();
	checker.getPropertiesOfType(checker.getTypeAtLocation(node)).forEach(symbol => {
		const declaration = symbol.declarations && symbol.declarations[0];
		members.set(symbol.getName(), {
			deprecated: symbol.getJsDocTags().some(tag => tag.name == "deprecated"),
			owner: declaration && declaration.parent && declaration.parent.name ? declaration.parent.name.text : interfaceName
		});
	});
	return members;
}

function getExtraFieldTypes() {
	const types = new Map();
	const source = ts.createSourceFile(CONSTANTS, readFileSync(CONSTANTS, "utf-8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
	ts.forEachChild(source, node => {
		if (ts.isVariableStatement(node)) {
			node.declarationList.declarations.forEach(declaration => {
				const name = declaration.name.getText(source);
				if (name.startsWith("EXTRAFIELD_TYPE_") && declaration.initializer) {
					types.set(name, Number(declaration.initializer.getText(source)));
				}
			});
		}
	});
	return types;
}

function getIdentifiers(path) {
	const identifiers = new Set();
	const source = ts.createSourceFile(path, readFileSync(path, "utf-8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
	walk(source);
	return identifiers;

	function walk(node) {
		if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
			return;
		}
		if (ts.isIdentifier(node)) {
			identifiers.add(node.text);
		}
		ts.forEachChild(node, walk);
	}
}

function report(label, surface, members, decisions, categories) {
	const undecided = [...members.keys()].filter(name => !decisions[name]);
	const stale = Object.keys(decisions).filter(name => !members.has(name));
	undecided.forEach(name => failures.push(`${label}: ${surface}#${name} has no recorded decision`));
	stale.forEach(name => failures.push(`${label}: the decision recorded for ${name} refers to a member that no longer exists`));
	Object.keys(decisions).forEach(name => {
		const used = categories.filter(category => decisions[name][category] !== undefined);
		if (used.length != 1) {
			failures.push(`${label}: ${name} must use exactly one of ${categories.join(", ")}, got ${used.length ? used.join(" and ") : "none"}`);
		}
	});
	const counts = new Map();
	Object.keys(decisions).forEach(name => {
		const category = categories.find(category => decisions[name][category] !== undefined) || "?";
		counts.set(category, (counts.get(category) || 0) + 1);
	});
	console.log(`${label} (${surface}): ${members.size} members`);
	[...counts].sort().forEach(([category, count]) => console.log(`  ${category}: ${count}`));
}

function checkReferences(decisions, category, members, label) {
	Object.keys(decisions).forEach(name => {
		const value = decisions[name][category];
		if (value !== undefined) {
			const references = Array.isArray(value) ? value : [value];
			references.forEach(reference => {
				if (!members.has(reference.split(".")[0])) {
					failures.push(`${name} refers to ${reference}, which is not a ${label}`);
				}
			});
		}
	});
}

function checkDeprecations(members, decisions, label) {
	members.forEach((member, name) => {
		const decision = decisions[name];
		if (decision) {
			if (member.deprecated && decision.deprecated === undefined) {
				failures.push(`${label} ${name} is marked @deprecated but its decision does not record the replacement`);
			}
			if (!member.deprecated && decision.deprecated !== undefined) {
				failures.push(`${label} ${name} is recorded as deprecated but is not marked @deprecated`);
			}
		}
	});
}

function checkExtraFieldTypes() {
	const undecided = [...extraFieldTypes.keys()].filter(name => !EXTRA_FIELD_TYPES[name]);
	const stale = Object.keys(EXTRA_FIELD_TYPES).filter(name => !extraFieldTypes.has(name));
	undecided.forEach(name => failures.push(`extra field types: ${name} has no recorded decision`));
	stale.forEach(name => failures.push(`extra field types: the decision recorded for ${name} refers to a constant that no longer exists`));
	console.log(`extra field types (lib/core/constants.js): ${extraFieldTypes.size} types`);
	[...extraFieldTypes].forEach(([name, value]) => {
		const decision = EXTRA_FIELD_TYPES[name] || {};
		const read = readerIdentifiers.has(name);
		const written = writerIdentifiers.has(name);
		const exposed = decision.property && entryProperties.has(decision.property);
		console.log(`  0x${value.toString(16).padStart(4, "0")} ${name.slice("EXTRAFIELD_TYPE_".length).toLowerCase()}: ${read ? "read" : "----"} ${written ? "written" : "-------"} ${exposed ? decision.property : "not exposed"}`);
		if (decision.property && !entryProperties.has(decision.property)) {
			failures.push(`extra field types: ${name} refers to ${decision.property}, which is not an entry property`);
		}
		if (!read) {
			failures.push(`extra field types: ${name} is declared and the reader does not parse it`);
		}
		if (written && decision.property && ENTRY_PROPERTIES[decision.property] && ENTRY_PROPERTIES[decision.property].readOnly) {
			failures.push(`extra field types: ${name} is written and ${decision.property} is recorded as read-only`);
		}
		if (!written && decision.property && ENTRY_PROPERTIES[decision.property] && !ENTRY_PROPERTIES[decision.property].readOnly) {
			failures.push(`extra field types: ${name} is not written and ${decision.property} is not recorded as read-only`);
		}
	});
}

function summarize() {
	console.log("");
	if (failures.length) {
		failures.forEach(failure => console.log(`FAIL ${failure}`));
		console.log(`\n${failures.length} decision(s) missing or stale`);
		process.exit(1);
	}
	console.log("every member of the read and write surfaces has a recorded decision");
}
