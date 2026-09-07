/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const lastModDate = new Date(2021, 0, 1, 0, 0, 1);
	const testDisabled = await testLastModDate(false, lastModDate);
	if (testDisabled || !await testLastModDate(true, lastModDate)) {
		throw new Error();
	}
	await headersAgreeAcrossTheDateBranches();
}

// The local header and the central directory each carry their own 0x5455 record, built by different
// functions from different values, and they have to describe the same thing. The interesting dates are the
// ones the two ranges disagree about: the extended timestamp holds a signed 32-bit unix time, so it stops
// at 1901 and 2038, while the MS-DOS date the writer falls back to spans 1980 to 2107. Clamping a date
// below the unix floor therefore lands it back INSIDE the unix range, which is how the central directory
// once grew a record the local header did not have.
async function headersAgreeAcrossTheDateBranches() {
	for (const { label, lastModDate, options } of [
		{ label: "before the unix floor, no NTFS fallback", lastModDate: new Date(Date.UTC(1850, 0, 1)), options: { ntfsTimestamp: false } },
		{ label: "before the unix floor", lastModDate: new Date(Date.UTC(1850, 0, 1)), options: {} },
		{ label: "in range", lastModDate: new Date(Date.UTC(2021, 0, 1)), options: {} },
		{ label: "after the unix ceiling, no NTFS fallback", lastModDate: new Date(Date.UTC(2200, 0, 1)), options: { ntfsTimestamp: false } },
		{ label: "after the unix ceiling", lastModDate: new Date(Date.UTC(2200, 0, 1)), options: {} },
		{ label: "extended timestamps off", lastModDate: new Date(Date.UTC(2021, 0, 1)), options: { extendedTimestamp: false } }
	]) {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
		await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT),
			Object.assign({ lastModDate, extendedTimestamp: true }, options));
		const data = await zipWriter.close();
		const local = readTimestampField(data, 30 + getUint16(data, 26), getUint16(data, 28));
		const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
		const [entry] = await zipReader.getEntries();
		await zipReader.close();
		const central = readTimestampField(entry.rawExtraField, 0, entry.rawExtraField.length);
		if (local != central) {
			throw new Error("the two headers disagree on the extended timestamp for the date " + label +
				" (local " + local + ", central " + central + ")");
		}
	}
}

// the record as the two headers describe it, or "none": the flag byte and the modification time, which are
// the whole payload of the central version and the first two values of the local one
function readTimestampField(data, offset, length) {
	for (let position = offset; position + 4 <= offset + length;) {
		const type = getUint16(data, position);
		const size = getUint16(data, position + 2);
		if (type == 0x5455) {
			return "flag " + data[position + 4] + " time " + (getUint16(data, position + 5) + getUint16(data, position + 7) * 0x10000);
		}
		position += 4 + size;
	}
	return "none";
}

function getUint16(data, offset) {
	return data[offset] + data[offset + 1] * 0x100;
}

async function testLastModDate(extendedTimestamp, lastModDate) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB), { extendedTimestamp, lastModDate });
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	await zip.terminateWorkers();
	return entries[0].lastModDate.getTime() == lastModDate.getTime();
}