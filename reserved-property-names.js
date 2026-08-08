import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { domprops } from "./node_modules/terser/tools/domprops.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

const WORKER_BOUNDARY_PROPERTY_NAMES = ["codecType", "config", "options", "type", "value", "done", "result", "error", "message", "stack", "code", "name", "readable", "writable", "baseURI", "salt", "iterations", "keys", "password", "rawPassword", "encryptionStrength", "encrypted", "signed", "signature", "compressed", "level", "zipCrypto", "passwordVerification", "deflate64", "pull", "enqueue", "close", "messageId", "chunkSize", "useCompressionStream", "transferStreams", "useWebWorkers", "preventAbort", "preventClose", "checkPasswordOnly", "inputSize", "outputSize", "inBufferSize", "outBuffer", "wasmURI", "malloc", "free", "memory", "inflate_new", "inflate_init_raw", "inflate_init_gzip", "inflate_init", "inflate_process", "inflate_last_consumed", "inflate_end", "inflate9_new", "inflate9_init_raw", "inflate9_process", "inflate9_last_consumed", "inflate9_end", "deflate_new", "deflate_init_raw", "deflate_init_gzip", "deflate_init", "deflate_process", "deflate_last_consumed", "deflate_end"];

const AUDITED_KEEP_PROPERTY_NAMES = ["instance", "zip"];

const HOST_API_PROPERTY_NAMES_MISSING_FROM_DOMPROPS = ["createSyncAccessHandle"];

export {
	WORKER_BOUNDARY_PROPERTY_NAMES,
	AUDITED_KEEP_PROPERTY_NAMES,
	HOST_API_PROPERTY_NAMES_MISSING_FROM_DOMPROPS,
	collectDeclarationNames,
	getReservedPropertyNames
};

function getReservedPropertyNames() {
	const names = collectDeclarationNames(path.join(ROOT, "index.d.ts"));
	for (const name of WORKER_BOUNDARY_PROPERTY_NAMES) {
		names.add(name);
	}
	for (const name of AUDITED_KEEP_PROPERTY_NAMES) {
		names.add(name);
	}
	for (const name of HOST_API_PROPERTY_NAMES_MISSING_FROM_DOMPROPS) {
		names.add(name);
	}
	for (const name of domprops) {
		names.add(name);
	}
	return [...names];
}

function collectDeclarationNames(filePath) {
	const names = new Set();
	const source = ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
	visit(source);
	return names;

	function visit(node) {
		if ((ts.isPropertySignature(node) || ts.isMethodSignature(node) || ts.isPropertyDeclaration(node) ||
			ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node) ||
			ts.isEnumMember(node) || ts.isParameter(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) ||
			ts.isFunctionDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isVariableDeclaration(node)) &&
			node.name && (ts.isIdentifier(node.name) || ts.isStringLiteralLike(node.name))) {
			names.add(node.name.text);
		}
		ts.forEachChild(node, visit);
	}
}
