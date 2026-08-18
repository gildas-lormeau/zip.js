// Type-level test: the parsed extra field records must expose the members they have at runtime.
// Every access below goes through the declared property, so widening one of them back to
// EntryExtraField is a compile error rather than a silently accepted assignment.
// Compile with: npm run test-types
import type { EntryMetaData, LocalDirectory } from "../../index.js";

declare const entry: EntryMetaData;
declare const localDirectory: LocalDirectory;

const zip64Sizes: (number | undefined)[] = [
	entry.extraFieldZip64?.uncompressedSize,
	entry.extraFieldZip64?.compressedSize,
	entry.extraFieldZip64?.offset,
	entry.extraFieldZip64?.diskNumberStart,
	localDirectory.extraFieldZip64?.uncompressedSize
];
const ntfsDates: (Date | undefined)[] = [
	entry.extraFieldNTFS?.lastModDate,
	entry.extraFieldNTFS?.lastAccessDate,
	entry.extraFieldNTFS?.creationDate,
	localDirectory.extraFieldNTFS?.creationDate
];
const ntfsRawDates: (bigint | undefined)[] = [
	entry.extraFieldNTFS?.rawLastModDate,
	entry.extraFieldNTFS?.rawLastAccessDate,
	entry.extraFieldNTFS?.rawCreationDate
];
const timestampDates: (Date | undefined)[] = [
	entry.extraFieldExtendedTimestamp?.lastModDate,
	entry.extraFieldExtendedTimestamp?.lastAccessDate,
	entry.extraFieldExtendedTimestamp?.creationDate,
	localDirectory.extraFieldExtendedTimestamp?.lastAccessDate
];
const timestampRawDates: (number | undefined)[] = [
	entry.extraFieldExtendedTimestamp?.rawLastModDate,
	entry.extraFieldExtendedTimestamp?.rawLastAccessDate,
	entry.extraFieldExtendedTimestamp?.rawCreationDate
];
const unixIds: (number | undefined)[] = [
	entry.extraFieldUnix?.uid,
	entry.extraFieldUnix?.gid,
	entry.extraFieldInfoZip?.version,
	entry.extraFieldInfoZip?.uid,
	entry.extraFieldUnixType1?.uid,
	entry.extraFieldPkwareUnix?.gid,
	localDirectory.extraFieldUnix?.uid
];
const unicodeVersion: number | undefined = entry.extraFieldUnicodePath?.version;
const unicodeFilename: string | undefined = entry.extraFieldUnicodePath?.filename;
const unicodeComment: string | undefined = entry.extraFieldUnicodeComment?.comment;
const unicodeValid: boolean | undefined = entry.extraFieldUnicodePath?.valid;
const aesMethods: (number | undefined)[] = [
	entry.extraFieldAES?.originalCompressionMethod,
	entry.extraFieldAES?.compressionMethod,
	entry.extraFieldAES?.strength,
	entry.extraFieldAES?.vendorVersion,
	entry.extraFieldAES?.vendorId
];

// every parsed record must still expose the base extra field members
const types: (number | undefined)[] = [
	entry.extraFieldZip64?.type,
	entry.extraFieldNTFS?.type,
	entry.extraFieldExtendedTimestamp?.type,
	entry.extraFieldUnix?.type,
	entry.extraFieldUnicodePath?.type,
	entry.extraFieldAES?.type,
	entry.extraFieldUSDZ?.type
];
const data: (Uint8Array | undefined)[] = [
	entry.extraFieldNTFS?.data,
	entry.extraFieldUnix?.data,
	entry.extraFieldUSDZ?.data
];

// the raw NTFS dates reach the entry as well
const entryRawDates: (number | bigint | undefined)[] = [entry.rawLastModDate, entry.rawLastAccessDate, entry.rawCreationDate];

// the local file header reports the values it had to read
const dataDescriptorSignature: boolean | undefined = localDirectory.dataDescriptor?.signature;
const dataDescriptorValues: (number | undefined)[] = [
	localDirectory.dataDescriptor?.crc32,
	localDirectory.dataDescriptor?.compressedSize,
	localDirectory.dataDescriptor?.uncompressedSize
];
const localRawFilename: Uint8Array | undefined = localDirectory.rawFilename;

export {
	zip64Sizes, ntfsDates, ntfsRawDates, timestampDates, timestampRawDates, unixIds,
	unicodeVersion, unicodeFilename, unicodeComment, unicodeValid, aesMethods, types, data, entryRawDates,
	dataDescriptorSignature, dataDescriptorValues, localRawFilename
};
