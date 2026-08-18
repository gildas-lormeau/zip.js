import * as zip from "../zip-lib.js";

const FILENAME = "lorem.txt";
const TEXT_CONTENT = "Lorem ipsum dolor sit amet";
const PLATFORM_MSDOS = 0;
const PLATFORM_UNIX = 3;
const PLATFORM_MACINTOSH = 7;
const SPEC_VERSION = 0x14;

const CASES = [
	{ name: "default", options: {}, platform: PLATFORM_UNIX, specVersion: 0 },
	{ name: "msDosCompatible", options: { msDosCompatible: true }, platform: PLATFORM_MSDOS, specVersion: SPEC_VERSION },
	{ name: "explicit value", options: { versionMadeBy: (PLATFORM_MACINTOSH << 8) | SPEC_VERSION }, platform: PLATFORM_MACINTOSH, specVersion: SPEC_VERSION },
	{ name: "unixMode", options: { unixMode: 0o100644 }, platform: PLATFORM_UNIX, specVersion: 0 },
	{ name: "uid", options: { uid: 1000 }, platform: PLATFORM_UNIX, specVersion: 0 },
	{ name: "gid", options: { gid: 1000 }, platform: PLATFORM_UNIX, specVersion: 0 },
	{ name: "unixExtraFieldType", options: { unixExtraFieldType: "infozip" }, platform: PLATFORM_UNIX, specVersion: 0 },
	{ name: "msdosAttributesRaw", options: { msdosAttributesRaw: 0x20 }, platform: PLATFORM_MSDOS, specVersion: 0 },
	{ name: "msdosAttributes", options: { msdosAttributes: { archive: true } }, platform: PLATFORM_MSDOS, specVersion: 0 },
	// the platform of an explicit value must be replaced, not merged into: ORing 3 into platform 7
	// used to produce platform 7, and into platform 10 platform 11
	{
		name: "unixMode over a macintosh platform",
		options: { unixMode: 0o100644, versionMadeBy: (PLATFORM_MACINTOSH << 8) | SPEC_VERSION },
		platform: PLATFORM_UNIX, specVersion: SPEC_VERSION
	},
	{
		name: "unixMode over an msdos platform",
		options: { unixMode: 0o100644, versionMadeBy: (PLATFORM_MSDOS << 8) | SPEC_VERSION },
		platform: PLATFORM_UNIX, specVersion: SPEC_VERSION
	},
	{
		name: "msdosAttributesRaw over a macintosh platform",
		options: { msdosAttributesRaw: 0x20, versionMadeBy: (PLATFORM_MACINTOSH << 8) | SPEC_VERSION },
		platform: PLATFORM_MSDOS, specVersion: SPEC_VERSION
	}
];

export { test };

async function test() {
	try {
		await checkVersionMadeBy();
	} finally {
		await zip.terminateWorkers();
	}
}

async function checkVersionMadeBy() {
	for (const { name, options, platform, specVersion } of CASES) {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { bufferedWrite: false });
		await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), options);
		const data = await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		const [entry] = await zipReader.getEntries();
		await zipReader.close();
		if ((entry.versionMadeBy >> 8) != platform) {
			throw new Error(`${name}: expected platform ${platform}, got ${entry.versionMadeBy >> 8}`);
		}
		if ((entry.versionMadeBy & 0xff) != specVersion) {
			throw new Error(`${name}: expected specification version ${specVersion}, got ${entry.versionMadeBy & 0xff}`);
		}
	}
}
