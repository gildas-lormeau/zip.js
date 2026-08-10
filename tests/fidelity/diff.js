export { diffZip, formatDiffs, firstMismatch };

const EOCD_FIELDS = ["diskNumber", "directoryDiskNumber", "diskEntries", "totalEntries", "directorySize", "directoryOffset"];
const LOCAL_FIELDS = ["versionNeeded", "bitFlag", "compressionMethod", "rawLastModDate", "crc32", "compressedSize", "uncompressedSize"];
const CD_FIELDS = ["versionMadeBy", ...LOCAL_FIELDS, "diskNumberStart", "internalFileAttributes", "externalFileAttributes"];
const DATA_DESCRIPTOR_FIELDS = ["signaturePresent", "crc32", "compressedSize", "uncompressedSize"];
const HEX_FIELDS = new Set(["bitFlag", "rawLastModDate", "crc32", "internalFileAttributes", "externalFileAttributes", "versionMadeBy"]);

function diffZip(expected, actual) {
	const diffs = [];
	const addDiff = (path, expectedValue, actualValue) => diffs.push({ path, expected: expectedValue, actual: actualValue });
	compareScalar(addDiff, "entryCount", expected.entries.length, actual.entries.length);
	compareScalar(addDiff, "zip64", expected.zip64, actual.zip64);
	for (const field of EOCD_FIELDS) {
		compareScalar(addDiff, `eocd.${field}`, expected.eocd[field], actual.eocd[field], HEX_FIELDS.has(field));
	}
	compareBytes(addDiff, "eocd.comment", expected.eocd.commentBytes, actual.eocd.commentBytes);
	compareScalar(addDiff, "gaps", formatGaps(expected.gaps), formatGaps(actual.gaps));
	const entryCount = Math.min(expected.entries.length, actual.entries.length);
	for (let indexEntry = 0; indexEntry < entryCount; indexEntry++) {
		diffEntry(addDiff, expected, actual, expected.entries[indexEntry], actual.entries[indexEntry], `entry[${indexEntry}]`);
	}
	return diffs;
}

function diffEntry(addDiff, expectedRoot, actualRoot, expected, actual, basePath) {
	compareBytes(addDiff, `${basePath}.local.filename`, expected.local.filenameBytes, actual.local.filenameBytes);
	compareBytes(addDiff, `${basePath}.cd.filename`, expected.cd.filenameBytes, actual.cd.filenameBytes);
	for (const field of LOCAL_FIELDS) {
		compareScalar(addDiff, `${basePath}.local.${field}`, expected.local[field], actual.local[field], HEX_FIELDS.has(field));
	}
	for (const field of CD_FIELDS) {
		compareScalar(addDiff, `${basePath}.cd.${field}`, expected.cd[field], actual.cd[field], HEX_FIELDS.has(field));
	}
	compareExtraFields(addDiff, `${basePath}.local.extraField`, expected.local, actual.local);
	compareExtraFields(addDiff, `${basePath}.cd.extraField`, expected.cd, actual.cd);
	compareBytes(addDiff, `${basePath}.cd.comment`, expected.cd.commentBytes, actual.cd.commentBytes);
	compareScalar(addDiff, `${basePath}.offset`, expected.startOffset, actual.startOffset);
	comparePayload(addDiff, `${basePath}.payload`, expectedRoot, actualRoot, expected, actual);
	if (Boolean(expected.dataDescriptor) != Boolean(actual.dataDescriptor)) {
		addDiff(`${basePath}.dataDescriptor`, formatPresence(expected.dataDescriptor), formatPresence(actual.dataDescriptor));
	} else if (expected.dataDescriptor) {
		for (const field of DATA_DESCRIPTOR_FIELDS) {
			compareScalar(addDiff, `${basePath}.dataDescriptor.${field}`, expected.dataDescriptor[field], actual.dataDescriptor[field], field == "crc32");
		}
	}
}

function compareExtraFields(addDiff, basePath, expected, actual) {
	if (!bytesEqual(expected.extraFieldBytes, actual.extraFieldBytes)) {
		const expectedTypes = expected.extraFields.map(field => formatType(field.type)).join(",");
		const actualTypes = actual.extraFields.map(field => formatType(field.type)).join(",");
		if (expectedTypes != actualTypes) {
			addDiff(`${basePath}.types`, expectedTypes || "(none)", actualTypes || "(none)");
		}
		const fieldCount = Math.min(expected.extraFields.length, actual.extraFields.length);
		for (let indexField = 0; indexField < fieldCount; indexField++) {
			const expectedField = expected.extraFields[indexField];
			const actualField = actual.extraFields[indexField];
			if (expectedField.type == actualField.type && !bytesEqual(expectedField.data, actualField.data)) {
				addDiff(`${basePath}[${formatType(expectedField.type)}]`, formatBytes(expectedField.data), formatBytes(actualField.data));
			}
		}
	}
}

function comparePayload(addDiff, path, expectedRoot, actualRoot, expected, actual) {
	const expectedPayload = expectedRoot.data.subarray(expected.payload.start, expected.payload.end);
	const actualPayload = actualRoot.data.subarray(actual.payload.start, actual.payload.end);
	const mismatchOffset = firstMismatch(expectedPayload, actualPayload);
	if (mismatchOffset != -1) {
		addDiff(path, `${expectedPayload.length} bytes`, `${actualPayload.length} bytes, first mismatch at ${mismatchOffset}`);
	}
}

function compareScalar(addDiff, path, expected, actual, hex) {
	if (expected !== actual) {
		addDiff(path, formatScalar(expected, hex), formatScalar(actual, hex));
	}
}

function compareBytes(addDiff, path, expected, actual) {
	if (!bytesEqual(expected, actual)) {
		addDiff(path, formatBytes(expected), formatBytes(actual));
	}
}

function bytesEqual(bytesA, bytesB) {
	return firstMismatch(bytesA, bytesB) == -1;
}

function firstMismatch(bytesA, bytesB) {
	const length = Math.min(bytesA.length, bytesB.length);
	for (let indexByte = 0; indexByte < length; indexByte++) {
		if (bytesA[indexByte] != bytesB[indexByte]) {
			return indexByte;
		}
	}
	return bytesA.length == bytesB.length ? -1 : length;
}

function formatScalar(value, hex) {
	if (typeof value == "number" && hex) {
		return `${value} (0x${value.toString(16)})`;
	}
	return String(value);
}

function formatBytes(bytes) {
	const preview = Array.from(bytes.slice(0, 32)).map(value => value.toString(16).padStart(2, "0")).join(" ");
	return `${bytes.length} bytes [${preview}${bytes.length > 32 ? " …" : ""}]`;
}

function formatType(type) {
	return type === null ? "malformed" : `0x${type.toString(16).padStart(4, "0")}`;
}

function formatPresence(value) {
	return value ? "present" : "absent";
}

function formatGaps(gaps) {
	return gaps.map(gap => `${gap.start}-${gap.end}`).join(",") || "none";
}

function formatDiffs(diffs) {
	return diffs.map(diff => `  ${diff.path}: expected ${diff.expected}, got ${diff.actual}`).join("\n");
}
