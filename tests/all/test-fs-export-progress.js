// Locks the aggregated progress of the exports writing a zip file. `onstart`, `onprogress` and
// `onend` are documented together, so they must all report the archive as a whole: one `onstart`
// with the total size of the entries, one monotonic series of progress events covering all of them,
// and one `onend`, whatever the number of entries and whether they are imported from a zip file.
// `onentryprogress` is the entry counterpart: one event per written entry, directories included,
// counting up to the number of entries the export writes. It only follows the order of the entries
// in the zip file when the entries are written one after another, since `bufferedWrite` writes them
// concurrently.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const LARGE_CONTENT = new Uint8Array(256 * 1024).fill(65);
const SMALL_CONTENT = new Uint8Array(1024).fill(66);
const EXPECTED_SIZE = LARGE_CONTENT.length + SMALL_CONTENT.length * 2 + TEXT_CONTENT.length;
const EXPECTED_ENTRY_NAMES = ["docs/", "docs/empty/", "docs/readme.txt", "docs/small.bin", "empty.bin", "large.bin", "last.bin"];
const WRITE_ORDER_ENTRY_NAMES = ["large.bin", "docs/", "empty.bin", "last.bin", "docs/readme.txt", "docs/small.bin", "docs/empty/"];

export { test };

async function test() {
	try {
		for (const options of [
			{ level: 0 },
			{ level: 9 },
			{ level: 0, bufferedWrite: false },
			{ level: 0, keepOrder: false },
			{ level: 0, password: "password" }
		]) {
			await testProgress(options);
		}
		await testImportedProgress();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testProgress(options) {
	const orderedNames = options.bufferedWrite === false ? WRITE_ORDER_ENTRY_NAMES : null;
	const watcher = createProgressWatcher(JSON.stringify(options), orderedNames);
	await createTree().exportUint8Array(Object.assign({}, options, watcher.options));
	watcher.assertCompleted(7);
}

async function testImportedProgress() {
	const data = await createTree().exportUint8Array({ level: 9 });
	const zipFs = new zip.fs.FS();
	await zipFs.importUint8Array(data);
	const watcher = createProgressWatcher("imported");
	await zipFs.exportUint8Array(watcher.options);
	watcher.assertCompleted(4);
}

function createTree() {
	const zipFs = new zip.fs.FS();
	zipFs.root.addUint8Array("large.bin", LARGE_CONTENT);
	const directory = zipFs.root.addDirectory("docs");
	directory.addText("readme.txt", TEXT_CONTENT);
	directory.addUint8Array("small.bin", SMALL_CONTENT);
	directory.addDirectory("empty");
	zipFs.root.addUint8Array("empty.bin", new Uint8Array(0));
	zipFs.root.addUint8Array("last.bin", SMALL_CONTENT);
	return zipFs;
}

function createProgressWatcher(label, orderedNames) {
	const starts = [];
	const ends = [];
	const totalSizes = new Set();
	const entryProgresses = [];
	const entryNames = [];
	const totalEntries = new Set();
	let previousProgress = 0;
	let lastProgress = 0;
	let progressCount = 0;
	return {
		options: {
			onstart: total => starts.push(total),
			onentryprogress: (progress, total, entry) => {
				entryProgresses.push(progress);
				totalEntries.add(total);
				entryNames.push(entry.filename);
			},
			onprogress: (progress, totalSize) => {
				if (!starts.length) {
					throw new Error("progress reported before onstart (" + label + ")");
				}
				if (progress < previousProgress || progress > totalSize) {
					throw new Error("inconsistent progress " + progress + "/" + totalSize + " (" + label + ")");
				}
				previousProgress = progress;
				lastProgress = progress;
				totalSizes.add(totalSize);
				progressCount++;
			},
			onend: computedSize => ends.push(computedSize)
		},
		assertCompleted(minimumProgressCount) {
			if (progressCount < minimumProgressCount || totalSizes.size != 1 || !totalSizes.has(EXPECTED_SIZE) || lastProgress != EXPECTED_SIZE) {
				throw new Error("progress stopped at " + lastProgress + " of " + [...totalSizes] +
					" after " + progressCount + " events, expected " + EXPECTED_SIZE + " (" + label + ")");
			}
			assertSingleEvent(starts, "onstart", label);
			assertSingleEvent(ends, "onend", label);
			assertEntryProgress(label);
		}
	};

	function assertEntryProgress(label) {
		const expectedProgresses = EXPECTED_ENTRY_NAMES.map((name, index) => index + 1);
		if (entryProgresses.join() != expectedProgresses.join()) {
			throw new Error("expected onentryprogress to count [" + expectedProgresses + "], got [" + entryProgresses + "] (" + label + ")");
		}
		if (totalEntries.size != 1 || !totalEntries.has(EXPECTED_ENTRY_NAMES.length)) {
			throw new Error("expected onentryprogress to report " + EXPECTED_ENTRY_NAMES.length + " entries, got [" + [...totalEntries] + "] (" + label + ")");
		}
		const sortedNames = Array.from(entryNames).sort();
		if (sortedNames.join() != EXPECTED_ENTRY_NAMES.join()) {
			throw new Error("expected onentryprogress to report [" + EXPECTED_ENTRY_NAMES + "], got [" + sortedNames + "] (" + label + ")");
		}
		if (orderedNames && entryNames.join() != orderedNames.join()) {
			throw new Error("expected onentryprogress to follow the write order [" + orderedNames + "], got [" + entryNames + "] (" + label + ")");
		}
	}
}

function assertSingleEvent(sizes, name, label) {
	if (sizes.length != 1 || sizes[0] != EXPECTED_SIZE) {
		throw new Error("expected one " + name + " with " + EXPECTED_SIZE + ", got [" + sizes + "] (" + label + ")");
	}
}
