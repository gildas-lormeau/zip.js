/* global WebAssembly */

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { domprops } from "./node_modules/terser/tools/domprops.js";
import { WORKER_MESSAGE_PROPERTY_NAMES } from "./worker-message-property-names.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const TYPESCRIPT_LIBRARY_PATH = path.join(ROOT, "node_modules", "typescript", "lib");
const HOST_DECLARATION_FILE_NAME = /^lib\.(dom|webworker)\..*d\.ts$/;
const WASM_MODULE_PATH = path.join(ROOT, "lib", "core", "streams", "zlib-wasm", "zlib-streams.wasm");

const ZLIB_STREAM_OPTION_PROPERTY_NAMES = ["inBufferSize", "outBuffer"];

const AUDITED_KEEP_PROPERTY_NAMES = ["instance", "zip"];

export {
	ZLIB_STREAM_OPTION_PROPERTY_NAMES,
	AUDITED_KEEP_PROPERTY_NAMES,
	collectDeclarationNames,
	collectHostMemberNames,
	collectWasmExportNames,
	getReservedPropertyNames
};

function getReservedPropertyNames() {
	const names = collectDeclarationNames(path.join(ROOT, "index.d.ts"));
	const groups = [
		collectHostMemberNames(),
		collectWasmExportNames(),
		WORKER_MESSAGE_PROPERTY_NAMES,
		ZLIB_STREAM_OPTION_PROPERTY_NAMES,
		AUDITED_KEEP_PROPERTY_NAMES,
		domprops
	];
	for (const group of groups) {
		for (const name of group) {
			names.add(name);
		}
	}
	return [...names];
}

function collectHostMemberNames() {
	const names = new Set();
	for (const fileName of readdirSync(TYPESCRIPT_LIBRARY_PATH)) {
		if (HOST_DECLARATION_FILE_NAME.test(fileName)) {
			for (const name of collectDeclarationNames(path.join(TYPESCRIPT_LIBRARY_PATH, fileName), true)) {
				names.add(name);
			}
		}
	}
	return names;
}

function collectWasmExportNames() {
	const module = new WebAssembly.Module(readFileSync(WASM_MODULE_PATH));
	return WebAssembly.Module.exports(module).map(({ name }) => name);
}

function collectDeclarationNames(filePath, membersOnly) {
	const names = new Set();
	const source = ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
	visit(source);
	return names;

	function visit(node) {
		if (isNamedDeclaration(node) && node.name && (ts.isIdentifier(node.name) || ts.isStringLiteralLike(node.name))) {
			names.add(node.name.text);
		}
		ts.forEachChild(node, visit);
	}

	function isNamedDeclaration(node) {
		return isMemberDeclaration(node) || (!membersOnly && isTypeDeclaration(node));
	}

	function isMemberDeclaration(node) {
		return ts.isPropertySignature(node) || ts.isMethodSignature(node) || ts.isPropertyDeclaration(node) ||
			ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node) ||
			ts.isEnumMember(node);
	}

	function isTypeDeclaration(node) {
		return ts.isParameter(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) ||
			ts.isFunctionDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isVariableDeclaration(node);
	}
}
