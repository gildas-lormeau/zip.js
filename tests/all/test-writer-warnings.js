import * as zip from "../zip-lib.js";

const { WARNING_COMPRESSION_UNAVAILABLE, WARNING_CLAMPED_LAST_MODIFICATION_DATE } = zip;
const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(64);
// the two bounds of the MS-DOS date field, which stores a year from 1980 to 2107
const BEFORE_MSDOS_RANGE = new Date("1970-01-01T00:00:00Z");
const AFTER_MSDOS_RANGE = new Date("2200-01-01T00:00:00Z");
const NO_DEFLATE = { CompressionStream: null, CompressionStreamFallback: null, useCompressionStream: false };

export { test };

async function test() {
	try {
		await testNothingIsReportedByDefault();
		await testCompressionUnavailable();
		await testClampedLastModificationDate();
		await testEachReasonIsReportedOnce();
	} finally {
		zip.resetConfiguration();
		await zip.terminateWorkers();
	}
}

// a warning reports an adjustment the writer made silently, so an ordinary archive must produce none: a channel
// that cries wolf is worse than no channel. The date of an ordinary entry is truncated to the two-second
// resolution of the MS-DOS field, and that truncation is the format, not an adjustment worth reporting
async function testNothingIsReportedByDefault() {
	const { warnings } = await writeEntry();
	assert(!warnings.length, "an ordinary archive must produce no warning, got " + JSON.stringify(warnings));
}

// the fallback #508 introduced: with no deflate implementation reachable the entry is stored rather than the
// call failing, which produced an all-STORE archive twice in SingleFile with nothing to notice it by
async function testCompressionUnavailable() {
	const { warnings, entry } = await writeEntry({ configuration: NO_DEFLATE });
	assertReason(warnings, WARNING_COMPRESSION_UNAVAILABLE);
	assert(entry.compressionMethod === 0, "the entry must be stored, got compressionMethod " + entry.compressionMethod);
}

// the clamp only loses the date when no extra field carries it, so the warning must follow that condition rather
// than the date being out of range: extendedTimestamp is enabled by default and preserves the original value
async function testClampedLastModificationDate() {
	for (const lastModDate of [BEFORE_MSDOS_RANGE, AFTER_MSDOS_RANGE]) {
		const preserved = await writeEntry({ entryOptions: { lastModDate } });
		assert(!preserved.warnings.length,
			"an out of range date preserved by the extended timestamp must produce no warning, got " + JSON.stringify(preserved.warnings));
		assert(preserved.entry.lastModDate.getTime() == lastModDate.getTime(),
			"the extended timestamp must preserve " + lastModDate.toISOString() + ", got " + preserved.entry.lastModDate.toISOString());
		const clamped = await writeEntry({
			writerOptions: { extendedTimestamp: false, ntfsTimestamp: false },
			entryOptions: { lastModDate }
		});
		assertReason(clamped.warnings, WARNING_CLAMPED_LAST_MODIFICATION_DATE);
		assert(clamped.entry.lastModDate.getTime() != lastModDate.getTime(),
			"the date must be clamped when no extra field carries it, got " + clamped.entry.lastModDate.toISOString());
	}
}

// the reason is deposited once with the filename of the first entry it applied to, so an archive whose entries
// are all affected reports one warning instead of one per entry
async function testEachReasonIsReportedOnce() {
	zip.resetConfiguration();
	zip.configure(Object.assign({ useWebWorkers: false }, NO_DEFLATE));
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	for (let indexEntry = 0; indexEntry < 4; indexEntry++) {
		await zipWriter.add("entry-" + indexEntry + ".txt", new zip.TextReader(TEXT_CONTENT));
	}
	const { warnings } = zipWriter;
	await zipWriter.close();
	assert(warnings.length == 1, "4 stored entries must report 1 warning, got " + warnings.length);
	assert(warnings[0].filename == "entry-0.txt",
		"the warning must name the first entry it applied to, got " + warnings[0].filename);
}

async function writeEntry({ configuration = {}, writerOptions = {}, entryOptions = {} } = {}) {
	zip.resetConfiguration();
	zip.configure(Object.assign({ useWebWorkers: false }, configuration));
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter(), writerOptions);
	const entry = await zipWriter.add("entry.txt", new zip.TextReader(TEXT_CONTENT), entryOptions);
	const { warnings } = zipWriter;
	await zipWriter.close();
	return { warnings, entry };
}

function assertReason(warnings, reason) {
	assert(warnings.some(warning => warning.reason == reason),
		"the warnings must report " + JSON.stringify(reason) + ", got " + JSON.stringify(warnings));
	assert(warnings.every(warning => warning.filename == "entry.txt"),
		"the warning must name the entry it applied to, got " + JSON.stringify(warnings));
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}
