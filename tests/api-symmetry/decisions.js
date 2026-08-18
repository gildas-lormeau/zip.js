// The decisions taken about the symmetry between the read surface and the write surface.
//
// Every member of the audited interfaces must appear here with exactly one category. A member with
// no entry fails the audit: the point of this table is that a new property or a new option cannot be
// added without deciding what its counterpart is, or recording why it has none.
//
// Entry property categories:
//   options    - the writer options that set it, at least one of them named for it
//   indirect   - no option is named for it, the listed options reach it through their values
//   argument   - it is set by an argument of the API rather than by an option
//   computed   - the writer computes it, it is not an input
//   derived    - the reader decodes it from another property
//   deprecated - an alias kept for compatibility
//   readOnly   - the reader exposes it and the writer does not produce it, deliberately
//
// Writer option categories:
//   properties - the entry properties that expose its effect
//   archive    - it acts on the whole archive rather than on an entry
//   machinery  - it changes how the data is produced, not what the headers record
//   deprecated - an alias kept for compatibility
//   writeOnly  - the writer produces it and the reader does not expose it

const ENTRY_PROPERTIES = {
	offset: { computed: "the position of the entry, assigned as it is written" },
	filename: { argument: "the first argument of ZipWriter#add" },
	rawFilename: { options: ["encodeText"], note: "the encoded filename" },
	filenameUTF8: { options: ["useUnicodeFileNames"] },
	executable: { options: ["executable"] },
	symlink: {
		indirect: ["unixMode", "externalFileAttributes"],
		note: "stamping the S_IFLNK file type, e.g. unixMode 0o120777, already writes a link every tool resolves, so a dedicated option would only spare the caller a constant"
	},
	encrypted: { options: ["password", "rawPassword", "encrypted"] },
	zipCrypto: { options: ["zipCrypto"] },
	compressedSize: { computed: "the size of the data the writer produced" },
	uncompressedSize: { options: ["uncompressedSize"], note: "an option with the passThrough option only, computed otherwise" },
	lastModDate: { options: ["lastModDate"] },
	lastAccessDate: { options: ["lastAccessDate"] },
	creationDate: { options: ["creationDate"] },
	rawLastModDate: { options: ["lastModDate"], note: "the MS-DOS encoding of the date" },
	rawLastAccessDate: { options: ["lastAccessDate", "ntfsTimestamp"], note: "the FILETIME encoding of the date" },
	rawCreationDate: { options: ["creationDate", "ntfsTimestamp"], note: "the FILETIME encoding of the date" },
	comment: { options: ["comment"] },
	rawComment: { options: ["comment", "encodeText"], note: "the encoded comment" },
	commentUTF8: { options: ["useUnicodeFileNames"] },
	crc32: { options: ["crc32"], note: "an option with the passThrough option only, computed otherwise" },
	signature: { deprecated: "crc32" },
	extraField: { options: ["extraField"] },
	rawExtraField: { options: ["extraField"], note: "the encoded extra field, including the fields the writer generates" },
	zip64: { options: ["zip64"] },
	version: { options: ["version"] },
	versionMadeBy: { options: ["versionMadeBy"] },
	msDosCompatible: { options: ["msDosCompatible"] },
	msdosAttributesRaw: { options: ["msdosAttributesRaw", "msdosAttributes"] },
	msdosAttributes: { options: ["msdosAttributes", "msdosAttributesRaw"] },
	uid: { options: ["uid"] },
	gid: { options: ["gid"] },
	unixMode: { options: ["unixMode"] },
	setuid: { options: ["setuid"] },
	setgid: { options: ["setgid"] },
	sticky: { options: ["sticky"] },
	internalFileAttributes: { options: ["internalFileAttributes"] },
	externalFileAttributes: { options: ["externalFileAttributes", "unixMode", "msdosAttributes"] },
	unixExternalUpper: { derived: "externalFileAttributes", note: "its upper half, when it holds Unix mode bits" },
	internalFileAttribute: { deprecated: "internalFileAttributes" },
	externalFileAttribute: { deprecated: "externalFileAttributes" },
	diskNumberStart: { computed: "the disk the entry was written on" },
	compressionMethod: { options: ["compressionMethod", "level", "usdz"] },
	rawBitFlag: { computed: "the flags the writer set for the entry" },
	bitFlag: { derived: "rawBitFlag" },
	filenameLength: { computed: "the length of the encoded filename" },
	extraFieldLength: { computed: "the length of the encoded extra field" },
	extraFieldZip64: { options: ["zip64", "supportZip64SplitFile"] },
	extraFieldAES: { options: ["password", "rawPassword", "encryptionStrength"] },
	extraFieldNTFS: { options: ["ntfsTimestamp"] },
	extraFieldUnix: { options: ["unixExtraFieldType", "uid", "gid"] },
	extraFieldInfoZip: { options: ["unixExtraFieldType", "uid", "gid"] },
	extraFieldUnixType1: {
		readOnly: "the obsolete Info-ZIP type 1 field, superseded by the type 2 (0x7855) and new (0x7875) fields the writer emits"
	},
	extraFieldPkwareUnix: {
		readOnly: "the PKWARE Unix field, written by no current tool and superseded by the Info-ZIP fields the writer emits"
	},
	extraFieldExtendedTimestamp: { options: ["extendedTimestamp"] },
	extraFieldUnicodePath: {
		readOnly: "the writer marks UTF-8 filenames with the language encoding flag, which every current reader honors"
	},
	extraFieldUnicodeComment: {
		readOnly: "the writer marks UTF-8 comments with the language encoding flag, which every current reader honors"
	},
	extraFieldUSDZ: { options: ["usdz"] },
	localDirectory: { computed: "the fields of the local file header, which the writer produces alongside the central directory" },
	directory: { options: ["directory"] }
};

const WRITER_OPTIONS = {
	directory: { properties: ["directory"] },
	executable: { properties: ["executable"] },
	comment: { properties: ["comment", "rawComment"] },
	extraField: { properties: ["extraField", "rawExtraField"] },
	localExtraField: { properties: ["localDirectory.extraField"] },
	uncompressedSize: { properties: ["uncompressedSize"] },
	crc32: { properties: ["crc32"] },
	signature: { deprecated: "crc32" },
	zip64: { properties: ["zip64", "extraFieldZip64"] },
	preventClose: { machinery: "leaves the writable stream open" },
	level: { machinery: "changes the compressed data, not the headers" },
	bufferedWrite: { machinery: "buffers the data before appending it" },
	createTempStream: { machinery: "chooses where the buffered data is held" },
	keepOrder: { machinery: "orders the entries, does not change their content" },
	password: { properties: ["encrypted", "extraFieldAES"] },
	rawPassword: { properties: ["encrypted", "extraFieldAES"] },
	encryptionStrength: { properties: ["extraFieldAES.strength"] },
	signal: { machinery: "aborts the operation" },
	lastModDate: { properties: ["lastModDate", "rawLastModDate"] },
	lastAccessDate: { properties: ["lastAccessDate", "rawLastAccessDate"] },
	creationDate: { properties: ["creationDate", "rawCreationDate"] },
	extendedTimestamp: { properties: ["extraFieldExtendedTimestamp"] },
	ntfsTimestamp: { properties: ["extraFieldNTFS"] },
	zipCrypto: { properties: ["zipCrypto"] },
	version: { properties: ["version"] },
	versionMadeBy: { properties: ["versionMadeBy"] },
	useUnicodeFileNames: { properties: ["filenameUTF8", "commentUTF8"] },
	dataDescriptor: { properties: ["bitFlag.dataDescriptor"] },
	dataDescriptorSignature: {
		writeOnly: "the reader locates the end of the data descriptor from the central directory sizes, so it never has to read the signature, and reporting it would cost a read after the data of every entry for a value only a byte-level rewriter acts on"
	},
	msDosCompatible: { properties: ["msDosCompatible"] },
	externalFileAttributes: { properties: ["externalFileAttributes"] },
	externalFileAttribute: { deprecated: "externalFileAttributes" },
	uid: { properties: ["uid", "extraFieldUnix", "extraFieldInfoZip"] },
	gid: { properties: ["gid", "extraFieldUnix", "extraFieldInfoZip"] },
	unixMode: { properties: ["unixMode", "externalFileAttributes"] },
	setuid: { properties: ["setuid"] },
	setgid: { properties: ["setgid"] },
	sticky: { properties: ["sticky"] },
	unixExtraFieldType: { properties: ["extraFieldUnix", "extraFieldInfoZip"] },
	internalFileAttributes: { properties: ["internalFileAttributes"] },
	internalFileAttribute: { deprecated: "internalFileAttributes" },
	msdosAttributesRaw: { properties: ["msdosAttributesRaw", "msdosAttributes"] },
	msdosAttributes: { properties: ["msdosAttributes", "msdosAttributesRaw"] },
	supportZip64SplitFile: { properties: ["extraFieldZip64.diskNumberStart"] },
	usdz: { properties: ["extraFieldUSDZ", "compressionMethod"] },
	passThrough: { machinery: "writes the data as-is, the headers describe it as the options say" },
	encrypted: { properties: ["encrypted"] },
	offset: { archive: "the offset of the first entry, shifting every entry offset" },
	compressionMethod: { properties: ["compressionMethod"] },
	encodeText: { properties: ["rawFilename", "rawComment"] },
	signCentralDirectory: { archive: "the digital signature record, read with ZipReader#digitalSignature" },
	useWebWorkers: { machinery: "chooses where the codec runs" },
	useCompressionStream: { machinery: "chooses which codec implementation runs" },
	transferStreams: { machinery: "chooses how the data reaches the worker" },
	onstart: { machinery: "reports progress" },
	onprogress: { machinery: "reports progress" },
	onend: { machinery: "reports progress" }
};

// The extra field types the reader knows about, and what the writer does with them. A type the
// reader parses and the writer never emits must say why here.
const EXTRA_FIELD_TYPES = {
	EXTRAFIELD_TYPE_ZIP64: { property: "extraFieldZip64" },
	EXTRAFIELD_TYPE_AES: { property: "extraFieldAES" },
	EXTRAFIELD_TYPE_NTFS: { property: "extraFieldNTFS" },
	EXTRAFIELD_TYPE_NTFS_TAG1: { property: "extraFieldNTFS", note: "the tag holding the dates inside the NTFS field" },
	EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP: { property: "extraFieldExtendedTimestamp" },
	EXTRAFIELD_TYPE_UNICODE_PATH: { property: "extraFieldUnicodePath" },
	EXTRAFIELD_TYPE_UNICODE_COMMENT: { property: "extraFieldUnicodeComment" },
	EXTRAFIELD_TYPE_USDZ: { property: "extraFieldUSDZ" },
	EXTRAFIELD_TYPE_INFOZIP: { property: "extraFieldInfoZip" },
	EXTRAFIELD_TYPE_UNIX: { property: "extraFieldUnix" },
	EXTRAFIELD_TYPE_UNIX_TYPE1: { property: "extraFieldUnixType1" },
	EXTRAFIELD_TYPE_PKWARE_UNIX: { property: "extraFieldPkwareUnix" }
};

export { ENTRY_PROPERTIES, WRITER_OPTIONS, EXTRA_FIELD_TYPES };
