/* global WebAssembly */

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { domprops } from "./node_modules/terser/tools/domprops.js";
import { WORKER_MESSAGE_PROPERTY_NAMES } from "./worker-message-property-names.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const TYPESCRIPT_LIBRARY_PATH = path.join(ROOT, "node_modules", "typescript", "lib");
const HOST_DECLARATION_FILE_NAME = /^lib\.(dom|webworker)\..*d\.ts$/;
const LIBRARY_PATH = path.join(ROOT, "lib");
const GENERATED_LIBRARY_FILE_NAME = /-inline(-[a-z]+)?\.js$|\.min\.js$/;
const LOGICAL_ASSIGNMENT_OPERATORS = [ts.SyntaxKind.BarBarEqualsToken, ts.SyntaxKind.AmpersandAmpersandEqualsToken, ts.SyntaxKind.QuestionQuestionEqualsToken];
const INCREMENT_OPERATORS = [ts.SyntaxKind.PlusPlusToken, ts.SyntaxKind.MinusMinusToken];
const WASM_MODULE_PATH = path.join(ROOT, "lib", "core", "streams", "zlib-wasm", "zlib-streams.wasm");

const ZLIB_STREAM_OPTION_PROPERTY_NAMES = ["inBufferSize", "outBuffer"];

// "return" is the method of the async generators returned by getEntriesGenerator(), declared in
// lib.es2018.asyncgenerator.d.ts rather than in the DOM and web worker declarations collected below.
const AUDITED_KEEP_PROPERTY_NAMES = ["instance", "return", "zip"];

export {
	ZLIB_STREAM_OPTION_PROPERTY_NAMES,
	AUDITED_KEEP_PROPERTY_NAMES,
	collectDeclarationNames,
	collectHostMemberNames,
	collectWasmExportNames,
	collectAssignedPropertyNames,
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

function collectAssignedPropertyNames() {
	const names = new Map();
	visitDirectory(LIBRARY_PATH);
	return names;

	function visitDirectory(directoryPath) {
		for (const fileName of readdirSync(directoryPath)) {
			const filePath = path.join(directoryPath, fileName);
			if (statSync(filePath).isDirectory()) {
				visitDirectory(filePath);
			} else if (fileName.endsWith(".js") && !GENERATED_LIBRARY_FILE_NAME.test(fileName)) {
				visitFile(filePath);
			}
		}
	}

	function visitFile(filePath) {
		const source = ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
		visit(source);

		function visit(node) {
			const target = getAssignmentTarget(node);
			if (target && ts.isPropertyAccessExpression(target)) {
				const name = target.name.text;
				if (!names.has(name)) {
					names.set(name, new Set());
				}
				names.get(name).add(path.relative(ROOT, filePath));
			}
			ts.forEachChild(node, visit);
		}
	}
}

function getAssignmentTarget(node) {
	if (ts.isBinaryExpression(node) && isAssignmentOperator(node.operatorToken.kind)) {
		return node.left;
	}
	if ((ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) && INCREMENT_OPERATORS.includes(node.operator)) {
		return node.operand;
	}
}

function isAssignmentOperator(kind) {
	return (kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment) || LOGICAL_ASSIGNMENT_OPERATORS.includes(kind);
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
		return ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) ||
			ts.isFunctionDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isVariableDeclaration(node);
	}
}
