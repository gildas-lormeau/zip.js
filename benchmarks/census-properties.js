import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { domprops } from "../node_modules/terser/tools/domprops.js";
import { collectDeclarationNames, collectWasmExportNames } from "../reserved-property-names.js";
import { WORKER_MESSAGE_PROPERTY_NAMES } from "../worker-message-property-names.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_TOKENIZED_STRING_LENGTH = 200;
const PLATFORM_CALLBACK_NAMES = new Set(["start", "pull", "transform", "flush", "cancel", "write", "close", "abort", "highWaterMark", "size", "mode", "reason"]);
const WORKER_ARTIFACTS = ["dist/zip-web-worker.js", "dist/zip-web-worker-native.js"];

const bundlePath = process.argv[2] || path.join(ROOT, "index.min.js");
const jsonPath = process.argv[3];

const bundle = { counts: new Map(), accessCounts: new Map(), quoted: new Set(), stringTokens: new Set() };
collectNames(bundlePath, bundle);
const worker = { counts: new Map(), accessCounts: new Map(), quoted: new Set(), stringTokens: new Set() };
for (const artifact of WORKER_ARTIFACTS) {
	const artifactPath = path.join(ROOT, artifact);
	if (existsSync(artifactPath)) {
		collectNames(artifactPath, worker);
	}
}
const publicNames = collectDeclarationNames(path.join(ROOT, "index.d.ts"));
const boundaryNames = new Set([...WORKER_MESSAGE_PROPERTY_NAMES, ...collectWasmExportNames()]);
const builtinNames = new Set(domprops);
const quotedSourceKeys = collectQuotedSourceKeys(path.join(ROOT, "lib"));

const classes = { public: [], builtin: [], boundary: [], quoted: [], candidate: [] };
for (const [name, count] of bundle.counts) {
	const flags = [];
	if (bundle.quoted.has(name) || bundle.stringTokens.has(name)) {
		flags.push("STRING");
	}
	if (worker.counts.has(name) || worker.quoted.has(name)) {
		flags.push("WORKER");
	}
	if (PLATFORM_CALLBACK_NAMES.has(name)) {
		flags.push("CALLBACK");
	}
	const entry = { name, count, bytes: count * (name.length - 1), flags };
	if (builtinNames.has(name)) {
		classes.builtin.push(entry);
	} else if (boundaryNames.has(name)) {
		classes.boundary.push(entry);
	} else if (publicNames.has(name)) {
		classes.public.push(entry);
	} else if (quotedSourceKeys.has(name)) {
		classes.quoted.push(entry);
	} else {
		classes.candidate.push(entry);
	}
}

for (const entries of Object.values(classes)) {
	entries.sort((first, second) => second.bytes - first.bytes);
}
const totalBytes = (entries) => entries.reduce((total, entry) => total + entry.bytes, 0);
const cleanCandidates = classes.candidate.filter((entry) => !entry.flags.length);
const flaggedCandidates = classes.candidate.filter((entry) => entry.flags.length);
console.log("bundle:", path.relative(ROOT, bundlePath));
for (const [className, entries] of Object.entries(classes)) {
	console.log(className.padEnd(10), String(entries.length).padStart(4), "names", String(totalBytes(entries)).padStart(7), "bytes");
}
console.log("candidates:", cleanCandidates.length, "clean (" + totalBytes(cleanCandidates) + " B) /", flaggedCandidates.length, "flagged (" + totalBytes(flaggedCandidates) + " B)");
console.log("\nflagged candidates (audit first):");
for (const { name, count, bytes, flags } of flaggedCandidates) {
	console.log("  " + String(count).padStart(5) + "x " + name.padEnd(32) + String(bytes).padStart(6) + " B  " + flags.join(","));
}
console.log("\ntop clean candidates:");
for (const { name, count, bytes } of cleanCandidates.slice(0, 30)) {
	console.log("  " + String(count).padStart(5) + "x " + name.padEnd(32) + String(bytes).padStart(6) + " B");
}
const hoistable = [];
for (const [className, entries] of Object.entries(classes)) {
	if (className != "candidate") {
		for (const { name } of entries) {
			const accessCount = bundle.accessCounts.get(name) || 0;
			const saving = accessCount * (name.length - 2) - name.length - 6;
			if (saving >= 30) {
				hoistable.push({ name, className, accessCount, saving });
			}
		}
	}
}
hoistable.sort((first, second) => second.saving - first.saving);
console.log("\nhoistable unmangleable names (const string + bracket access, plain accesses only):");
for (const { name, className, accessCount, saving } of hoistable.slice(0, 25)) {
	console.log("  " + String(accessCount).padStart(5) + "x " + name.padEnd(32) + "~" + String(saving).padStart(5) + " B  " + className);
}
if (jsonPath) {
	writeFileSync(jsonPath, JSON.stringify({ classes, hoistable }, null, "\t"));
	console.log("\nwritten:", jsonPath);
}

function collectNames(filePath, target) {
	const source = ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
	visit(source);

	function visit(node) {
		if (ts.isStringLiteralLike(node) || ts.isTemplateLiteralToken(node)) {
			tokenize(node.text);
		}
		if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
			count(node.name.text);
			target.accessCounts.set(node.name.text, (target.accessCounts.get(node.name.text) || 0) + 1);
		} else if (ts.isElementAccessExpression(node) && ts.isStringLiteralLike(node.argumentExpression)) {
			target.quoted.add(node.argumentExpression.text);
		} else if (ts.isBinaryExpression(node) && node.operatorToken.kind == ts.SyntaxKind.InKeyword && ts.isStringLiteralLike(node.left)) {
			target.quoted.add(node.left.text);
		} else if (isMemberDeclaration(node)) {
			if (ts.isIdentifier(node.name)) {
				count(node.name.text);
			} else if (ts.isStringLiteralLike(node.name)) {
				target.quoted.add(node.name.text);
			}
		} else if (ts.isShorthandPropertyAssignment(node)) {
			count(node.name.text);
		} else if (ts.isBindingElement(node) && node.propertyName && ts.isIdentifier(node.propertyName)) {
			count(node.propertyName.text);
		} else if (ts.isBindingElement(node) && !node.propertyName && ts.isIdentifier(node.name) && ts.isObjectBindingPattern(node.parent)) {
			count(node.name.text);
		}
		ts.forEachChild(node, visit);
	}

	function isMemberDeclaration(node) {
		return (ts.isPropertyAssignment(node) || ts.isPropertyDeclaration(node) || ts.isMethodDeclaration(node) ||
			ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)) && node.name;
	}

	function count(name) {
		target.counts.set(name, (target.counts.get(name) || 0) + 1);
	}

	function tokenize(text) {
		if (text.length <= MAX_TOKENIZED_STRING_LENGTH) {
			for (const token of text.split(/[^A-Za-z0-9_$]+/)) {
				if (token.length > 2) {
					target.stringTokens.add(token);
				}
			}
		}
	}
}

function collectQuotedSourceKeys(directory) {
	const keys = new Set();
	visitDirectory(directory);
	return keys;

	function visitDirectory(directoryPath) {
		for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
			const entryPath = path.join(directoryPath, entry.name);
			if (entry.isDirectory()) {
				visitDirectory(entryPath);
			} else if (entry.name.endsWith(".js") && !entry.name.includes("-inline") && !entry.name.endsWith(".min.js")) {
				collectFromFile(entryPath);
			}
		}
	}

	function collectFromFile(filePath) {
		const source = ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
		visit(source);

		function visit(node) {
			if (ts.isPropertyAssignment(node) && ts.isStringLiteralLike(node.name)) {
				keys.add(node.name.text);
			}
			ts.forEachChild(node, visit);
		}
	}
}

