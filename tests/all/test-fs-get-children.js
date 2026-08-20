// Checks getChildren() on the filesystem API: shallow by default, all descendants with `recursive`, in the
// order exportZip writes them. The returned array is a snapshot, so mutating the tree while iterating it is
// safe and the removed entries are still yielded, detached from the filesystem.

import * as zip from "../zip-lib.js";

export { test };

async function test() {
	await shallowByDefault();
	await recursiveWalksDescendants();
	await recursiveIsOrderedLevelByLevel();
	await exportOrderDoesNotDependOnBufferedWrite();
	await snapshotSurvivesMutation();
	await comparedToEntriesArray();
	await zip.terminateWorkers();
}

function buildTree() {
	const fs = new zip.ZipFS();
	const first = fs.addDirectory("a");
	first.addText("a1.txt", "a1");
	first.addDirectory("deep").addText("d1.txt", "d1");
	fs.addText("b.txt", "b");
	return fs;
}

async function shallowByDefault() {
	const fs = buildTree();
	assertNames(fs.getChildren(), "a,b.txt", "shallow from the filesystem");
	assertNames(fs.root.getChildByName("a").getChildren(), "a1.txt,deep", "shallow from a directory");
	assertNames(fs.getChildren({ recursive: false }), "a,b.txt", "shallow with an explicit option");
}

async function recursiveWalksDescendants() {
	const fs = buildTree();
	assertNames(fs.getChildren({ recursive: true }), "a,b.txt,a1.txt,deep,d1.txt", "recursive from the filesystem");
	assertNames(fs.root.getChildByName("a").getChildren({ recursive: true }), "a1.txt,deep,d1.txt", "recursive from a directory");
	const files = fs.getChildren({ recursive: true }).filter(entry => !entry.directory);
	assertNames(files, "b.txt,a1.txt,d1.txt", "filtered to files");
}

// Level by level rather than branch by branch, i.e. what readdir(path, { recursive: true }) returns in
// Node.js. The two orders only differ once a branch is deeper than its sibling, hence the lopsided tree.
async function recursiveIsOrderedLevelByLevel() {
	const fs = new zip.ZipFS();
	const first = fs.addDirectory("A");
	first.addDirectory("A1").addDirectory("A1a").addText("leaf.txt", "leaf");
	fs.addDirectory("B").addDirectory("B1").addText("b1.txt", "b1");
	const walked = fs.getChildren({ recursive: true }).map(entry => entry.getFullname()).join(",");
	const expected = "A,B,A/A1,B/B1,A/A1/A1a,B/B1/b1.txt,A/A1/A1a/leaf.txt";
	if (walked != expected) {
		throw new Error("level order: expected \"" + expected + "\" got \"" + walked + "\"");
	}
}

// bufferedWrite selects a write strategy, so it must not decide the order of the entries in the archive.
// A lopsided tree is needed: the two strategies used to agree on a balanced one.
async function exportOrderDoesNotDependOnBufferedWrite() {
	const orders = [];
	for (const bufferedWrite of [true, false]) {
		const fs = new zip.ZipFS();
		const first = fs.addDirectory("A");
		first.addDirectory("A1").addDirectory("A1a").addText("leaf.txt", "leaf");
		fs.addDirectory("B").addDirectory("B1").addText("b1.txt", "b1");
		const walked = fs.getChildren({ recursive: true }).map(entry => entry.getFullname()).join(",");
		const data = await fs.exportUint8Array({ bufferedWrite });
		const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		const exported = (await reader.getEntries()).map(entry => entry.filename.replace(/\/$/, "")).join(",");
		await reader.close();
		if (exported != walked) {
			throw new Error("export order (bufferedWrite=" + bufferedWrite + "): expected \"" + walked + "\" got \"" + exported + "\"");
		}
		orders.push(exported);
	}
	if (orders[0] != orders[1]) {
		throw new Error("export order: bufferedWrite changed it from \"" + orders[0] + "\" to \"" + orders[1] + "\"");
	}
}

async function snapshotSurvivesMutation() {
	const fs = buildTree();
	const children = fs.getChildren({ recursive: true });
	const visited = [];
	for (const child of children) {
		visited.push(child.name);
		if (child.name == "a1.txt") {
			fs.remove(fs.root.getChildByName("a").getChildByName("deep"));
			fs.addText("late.txt", "late");
		}
	}
	if (visited.join(",") != "a,b.txt,a1.txt,deep,d1.txt") {
		throw new Error("snapshot: expected the initial entries, got \"" + visited.join(",") + "\"");
	}
	const removed = children.find(child => child.name == "deep");
	if (removed.parent !== undefined) {
		throw new Error("snapshot: the removed entry is still attached");
	}
	assertNames(fs.getChildren({ recursive: true }), "a,b.txt,late.txt,a1.txt", "after the mutations");
}

// The differences with fs.entries that motivate the method.
async function comparedToEntriesArray() {
	const fs = buildTree();
	fs.remove(fs.root.getChildByName("b.txt"));
	const children = fs.getChildren({ recursive: true });
	if (children.includes(fs.root)) {
		throw new Error("entries comparison: the root is included");
	}
	if (children.some(child => child === null)) {
		throw new Error("entries comparison: a removed entry left an empty slot");
	}
	if (!fs.entries.includes(fs.root) || !fs.entries.includes(null)) {
		throw new Error("entries comparison: fs.entries no longer has a root and an empty slot to differ from");
	}
}

function assertNames(children, expected, label) {
	const names = children.map(child => child.name).join(",");
	if (names != expected) {
		throw new Error(label + ": expected \"" + expected + "\" got \"" + names + "\"");
	}
}
