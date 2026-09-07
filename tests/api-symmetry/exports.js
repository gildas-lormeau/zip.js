// Audits what each build exports against what index.d.ts declares and what the build's own code can throw.
//
// One index.d.ts serves every entry point: package.json maps the same "./index.d.ts" to all of them, so a
// declaration is a promise made by twelve export paths at once, while the value behind it is exported by
// whichever module happens to re-export it. Nothing kept the two in agreement.
//
// ERR_ABORTED was the case that motivated this audit. It is defined in lib/core/options.js and thrown by
// throwIfAborted(), which ZipReader#getData and ZipWriter#add both call, yet only lib/core/zip-fs.js
// re-exported it. A core-build user therefore got an error whose constant the same package's types promised
// and the bundle did not provide, with nothing failing in between.
//
// The rule the audit enforces is the one that case violated: a build must export every public error constant
// its own code can throw. "Public" means exported by at least one entry point, so a constant that is
// deliberately internal, e.g. the zipjs-abort-export sentinel zip-fs.js throws at itself, is not dragged into
// the public surface by being reachable. Reachability is read from the module graph rather than from a list,
// so a constant moving between modules re-decides which builds owe it with no list to update.
//
// The reader and writer fragments, i.e. lib/zip-core-reader.js and lib/zip-core-writer.js, are exempt from
// that rule. They are halves meant to be composed, lib/zip-core-base.js re-exports both plus the io and
// options constants, and no build ships one without the other. Their exports are still required to be
// declared.
//
// The builds are compared against their own source entry point too. The lint job already fails on a dist/
// that does not match the sources, so this is not a staleness check: it catches a build in which an export
// present in the source did not survive bundling.
//
// The "./worker" entry point, i.e. lib/core/web-worker-base.js, is the one surface left out. It registers its
// message listener as it is imported, so reading its exports needs a worker scope rather than this one, and
// tests/types/test-codec-types.ts is what covers the single function it exports.
//
// Run with: npm run test-api-exports

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

// each row is one surface: the source entry point whose module graph decides what it owes, and the built
// files that must expose exactly what it exposes. A row with no build is an entry point package.json maps
// straight to its source.
const ENTRY_POINTS = [
	{ source: "lib/zip-wasm.js", builds: ["dist/zip.js", "dist/zip.min.js"] },
	{ source: "lib/zip-native.js", builds: ["dist/zip-native.js", "dist/zip-native.min.js"] },
	{ source: "lib/zip-legacy.js", builds: ["dist/zip-legacy.js", "dist/zip-legacy.min.js"] },
	{ source: "lib/zip-core.js", builds: ["dist/zip-core.js", "dist/zip-core.min.js"] },
	{ source: "lib/zip-fs-core.js", builds: ["dist/zip-fs-core.js", "dist/zip-fs-core.min.js"] },
	{ source: "lib/zip-fs-wasm.js", builds: ["dist/zip-fs.js", "dist/zip-fs.min.js", "index.js", "index.cjs", "index.min.js"] },
	{ source: "lib/zip-fs-native.js", builds: ["dist/zip-fs-native.js", "dist/zip-fs-native.min.js", "index-native.js", "index-native.cjs", "index-native.min.js"] },
	{ source: "lib/zip-core-external.js", builds: ["dist/zip-core-external.js", "dist/zip-core-external.min.js"] },
	{ source: "lib/zip-fs-external.js", builds: ["dist/zip-fs-external.js", "dist/zip-fs-external.min.js"] },
	{ source: "lib/zip-fs-core-external.js", builds: ["dist/zip-fs-core-external.js", "dist/zip-fs-core-external.min.js"] },
	{ source: "lib/zip-core-wasm.js", builds: [] },
	{ source: "lib/zip-core-native.js", builds: [] },
	{ source: "lib/zip-core-custom.js", builds: [] },
	{ source: "lib/zip-fs-core-wasm.js", builds: [] },
	{ source: "lib/zip-fs-core-native.js", builds: [] }
];
const FRAGMENTS = [
	"lib/zip-core-reader.js",
	"lib/zip-core-writer.js",
	"lib/zip-mime-types.js"
];
const CONSTANT_NAME = /^(?:ERR|WARNING)_[A-Z0-9_]+$/;

const failures = [];
const declared = collectDeclarations();
const exportedNames = new Map();
for (const file of [...ENTRY_POINTS.flatMap(({ source, builds }) => [source, ...builds]), ...FRAGMENTS]) {
	exportedNames.set(file, await collectExports(file));
}
const definitions = collectConstantDefinitions();
const publicConstants = new Set([...exportedNames.values()].flatMap(names => [...names]).filter(name => CONSTANT_NAME.test(name)));

checkDeclared();
checkReachableConstants();
checkBuildsMatchTheirSource();
checkDeclaredConstantsAreExported();
summarize();

function collectDeclarations() {
	const source = readFileSync(ROOT + "index.d.ts", "utf8");
	return new Set([...source.matchAll(/^export (?:declare )?(?:const|class|function|let|var) ([A-Za-z_$][\w$]*)/gm)].map(([, name]) => name));
}

// the ESM builds are read by importing them, the UMD and CommonJS ones by running them as a CommonJS module,
// which is the shape their own preamble takes when neither define() nor an ESM loader is present
async function collectExports(file) {
	const names = new Set(Object.keys(await import(pathToFileURL(ROOT + file).href)));
	names.delete("default");
	// node puts "module.exports" on the namespace of a CommonJS module, next to the names it detected
	names.delete("module.exports");
	if (names.size) {
		return names;
	}
	const moduleExports = {};
	new Function("exports", "module", "define", "require", readFileSync(ROOT + file, "utf8"))(moduleExports, { exports: moduleExports }, undefined, undefined);
	return new Set(Object.keys(moduleExports));
}

function collectConstantDefinitions() {
	const definitions = new Map();
	for (const file of new Set([...ENTRY_POINTS, ...FRAGMENTS.map(source => ({ source }))].flatMap(({ source }) => [...moduleGraph(source)])) ) {
		for (const [, name] of readFileSync(ROOT + file, "utf8").matchAll(/^const ((?:ERR|WARNING)_[A-Z0-9_]+) = /gm)) {
			definitions.set(name, file);
		}
	}
	return definitions;
}

function moduleGraph(entryPoint) {
	const visited = new Set();
	visit(entryPoint);
	return visited;

	function visit(file) {
		if (visited.has(file)) {
			return;
		}
		visited.add(file);
		const source = readFileSync(ROOT + file, "utf8");
		for (const [, specifier] of source.matchAll(/(?:^|[\s;}])(?:import|export)[\s\S]*?["']([^"']+)["']/gm)) {
			if (specifier.startsWith(".") && specifier.endsWith(".js")) {
				const resolved = resolve(dirname(ROOT + file), specifier).slice(ROOT.length);
				if (existsSync(ROOT + resolved)) {
					visit(resolved);
				}
			}
		}
	}
}

function checkDeclared() {
	exportedNames.forEach((names, file) => {
		names.forEach(name => {
			if (!declared.has(name)) {
				failures.push(`${file} exports ${name}, which index.d.ts does not declare`);
			}
		});
	});
}

function checkReachableConstants() {
	ENTRY_POINTS.forEach(({ source }) => {
		const graph = moduleGraph(source);
		const exported = exportedNames.get(source);
		publicConstants.forEach(name => {
			if (graph.has(definitions.get(name)) && !exported.has(name)) {
				failures.push(`${source} can throw ${name}, defined in ${definitions.get(name)}, and does not export it`);
			}
		});
	});
}

function checkBuildsMatchTheirSource() {
	ENTRY_POINTS.forEach(({ source, builds }) => {
		const expected = exportedNames.get(source);
		builds.forEach(build => {
			const exported = exportedNames.get(build);
			[...expected].filter(name => !exported.has(name)).forEach(name =>
				failures.push(`${build} does not expose ${name}, which its source ${source} exports`));
			[...exported].filter(name => !expected.has(name)).forEach(name =>
				failures.push(`${build} exposes ${name}, which its source ${source} does not export`));
		});
	});
}

function checkDeclaredConstantsAreExported() {
	declared.forEach(name => {
		if (CONSTANT_NAME.test(name) && !publicConstants.has(name)) {
			failures.push(`index.d.ts declares ${name} and no entry point exports it`);
		}
	});
}

function summarize() {
	if (failures.length) {
		failures.forEach(failure => console.log(`FAIL ${failure}`));
		console.log(`\n${failures.length} problem(s) in what the builds export`);
		process.exit(1);
	}
	console.log(`${exportedNames.size} builds export only what index.d.ts declares, and every public error constant they can throw`);
}
