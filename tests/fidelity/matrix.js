export { cases };

const BASE_DATE = new Date(2023, 4, 15, 10, 20, 30);
const ACCESS_DATE = new Date(2023, 4, 16, 8, 0, 2);
const CREATION_DATE = new Date(2023, 4, 10, 9, 30, 4);
const OUT_OF_RANGE_DATE = new Date(2110, 0, 1, 12, 0, 0);
const WORDS = ["central", "directory", "record", "deflate", "stored", "entry", "archive", "stream", "payload", "header"];

const cases = [
	{ name: "basic-deflate", entries: textEntries(3, 1) },
	{ name: "basic-deflate-wasm", writerOptions: { useCompressionStream: false }, entries: textEntries(3, 2) },
	{ name: "store", writerOptions: { level: 0 }, entries: textEntries(2, 3) },
	{ name: "level-9", writerOptions: { level: 9, useCompressionStream: false }, entries: textEntries(2, 4) },
	{ name: "level-5", writerOptions: { level: 5, useCompressionStream: false }, entries: textEntries(2, 5) },
	{ name: "level-3", writerOptions: { level: 3, useCompressionStream: false }, entries: textEntries(2, 6) },
	{ name: "no-data-descriptor", writerOptions: { dataDescriptor: false, useCompressionStream: false }, entries: textEntries(2, 7) },
	{ name: "dd-without-signature", writerOptions: { dataDescriptorSignature: false, useCompressionStream: false }, entries: textEntries(2, 8) },
	{ name: "no-extended-timestamp", writerOptions: { extendedTimestamp: false, useCompressionStream: false }, entries: textEntries(2, 9) },
	{ name: "ntfs-forced", writerOptions: { ntfsTimestamp: true, useCompressionStream: false }, entries: textEntries(2, 10) },
	{
		name: "access-creation-dates", writerOptions: { useCompressionStream: false },
		entries: [textEntry("dates.txt", 11, { lastAccessDate: ACCESS_DATE, creationDate: CREATION_DATE })]
	},
	{
		name: "out-of-range-date", writerOptions: { useCompressionStream: false },
		entries: [textEntry("future.txt", 12, { lastModDate: OUT_OF_RANGE_DATE })]
	},
	{
		name: "comments", writerOptions: { useCompressionStream: false }, comment: "archive level comment",
		entries: [textEntry("commented.txt", 13, { comment: "entry level comment" })]
	},
	{ name: "unicode-name", writerOptions: { useCompressionStream: false }, entries: [textEntry("héllo wörld ✓.txt", 14)] },
	{ name: "ascii-flag-off", writerOptions: { useUnicodeFileNames: false, useCompressionStream: false }, entries: textEntries(2, 15) },
	{ name: "empty-deflate", writerOptions: { level: 9, useCompressionStream: false }, entries: [{ name: "empty.bin", data: new Uint8Array(0) }] },
	{ name: "empty-store", writerOptions: { level: 0 }, entries: [{ name: "empty.bin", data: new Uint8Array(0) }] },
	{
		name: "directories", writerOptions: { useCompressionStream: false },
		entries: [{ name: "folder/" }, textEntry("folder/nested.txt", 16), { name: "folder/sub/" }]
	},
	{
		name: "user-extra-field", writerOptions: { useCompressionStream: false },
		entries: [textEntry("custom.txt", 17, { extraField: new Map([[0x6666, new Uint8Array([1, 2, 3, 4])], [0x7777, new Uint8Array([5, 6])]]) })]
	},
	{ name: "uid-gid-infozip", writerOptions: { useCompressionStream: false }, entries: [textEntry("owned.txt", 18, { uid: 501, gid: 20 })] },
	{
		name: "uid-gid-unix", writerOptions: { useCompressionStream: false },
		entries: [textEntry("owned.txt", 19, { uid: 501, gid: 20, unixExtraFieldType: "unix" })]
	},
	{
		name: "msdos-attributes", writerOptions: { useCompressionStream: false },
		entries: [textEntry("readonly.txt", 20, { msdosAttributes: { readOnly: true, hidden: true } })]
	},
	{ name: "executable", writerOptions: { useCompressionStream: false }, entries: [textEntry("run.sh", 21, { executable: true })] },
	{
		name: "mixed", writerOptions: { useCompressionStream: false }, comment: "mixed archive",
		entries: [
			textEntry("first.txt", 22),
			{ name: "empty.bin", data: new Uint8Array(0) },
			{ name: "assets/" },
			textEntry("assets/stored.bin", 23, { level: 0 }),
			textEntry("assets/best.txt", 24, { level: 9 }),
			textEntry("noted.txt", 25, { comment: "note" }),
			textEntry("dated.txt", 26, { lastAccessDate: ACCESS_DATE }),
			textEntry("plain.txt", 27, { extendedTimestamp: false })
		]
	},
	{ name: "aes", writerOptions: { password: "correct horse", useCompressionStream: false }, entries: textEntries(2, 28) },
	{ name: "aes-strength-1", writerOptions: { password: "correct horse", encryptionStrength: 1, useCompressionStream: false }, entries: textEntries(2, 29) },
	{ name: "aes-store", writerOptions: { password: "correct horse", level: 0 }, entries: textEntries(2, 30) },
	{ name: "zipcrypto", writerOptions: { password: "correct horse", zipCrypto: true, useCompressionStream: false }, entries: textEntries(2, 31) }
];

for (const testCase of cases) {
	testCase.build = zip => buildZip(zip, testCase);
}

async function buildZip(zip, { writerOptions = {}, entries, comment }) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), {
		useWebWorkers: false,
		lastModDate: BASE_DATE,
		...writerOptions
	});
	for (const entry of entries) {
		const reader = entry.data === undefined ? undefined : new zip.Uint8ArrayReader(entry.data);
		await zipWriter.add(entry.name, reader, entry.options || {});
	}
	return zipWriter.close(comment === undefined ? undefined : new TextEncoder().encode(comment));
}

function textEntries(count, seed) {
	return Array.from({ length: count }, (unused, indexEntry) => textEntry(`file-${indexEntry}.txt`, seed * 100 + indexEntry));
}

function textEntry(name, seed, options) {
	return { name, data: pseudoText(seed), options };
}

function pseudoText(seed) {
	const random = mulberry32(seed);
	const length = 200 + Math.floor(random() * 2000);
	const parts = [];
	let currentLength = 0;
	while (currentLength < length) {
		const word = WORDS[Math.floor(random() * WORDS.length)];
		parts.push(word);
		currentLength += word.length + 1;
	}
	return new TextEncoder().encode(parts.join(" "));
}

function mulberry32(seed) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}
