[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Represents the metadata of an entry in a zip file (Core API).

## Extended by

- [`DirectoryEntry`](DirectoryEntry.md)
- [`FileEntry`](FileEntry.md)

## Properties

### bitFlag?

> `optional` **bitFlag?**: [`EntryBitFlag`](EntryBitFlag.md)

The general purpose bit flag.

***

### comment

> **comment**: `string`

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

The compression method.

***

### crc32?

> `optional` **crc32?**: `number`

The CRC-32 checksum of the content. It is `undefined` when the zip file does not store it, e.g. for entries
encrypted with AES in AE-2 format.

***

### creationDate?

> `optional` **creationDate?**: `Date`

The creation date.

***

### diskNumberStart

> **diskNumberStart**: `number`

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

`true` if the entry is an executable file

Always `false` when [EntryMetaData#symlink](#symlink) is `true`: the permissions of a symbolic link
are not meaningful, Unix systems store them as `0o777`.

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

The 32-bit `externalFileAttributes` field is the authoritative on-disk metadata for each entry.
- Upper 16 bits: Unix mode/type (e.g., permissions, file type)
- Low 8 bits: MS-DOS file attributes (e.g., directory, read-only)

When writing, all provided options are merged into this field. When reading, convenience fields are decoded from it.
For most use cases, prefer the high-level options and fields; only advanced users need to manipulate the raw value directly.

***

### extraField?

> `optional` **extraField?**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

The extra field.

***

### extraFieldAES?

> `optional` **extraFieldAES?**: [`EntryExtraFieldAES`](EntryExtraFieldAES.md)

The AES extra field.

***

### extraFieldExtendedTimestamp?

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraField`](EntryExtraField.md)

The extended timestamp extra field.

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraField`](EntryExtraField.md)

The Info-ZIP Unix extra field.

***

### extraFieldLength?

> `optional` **extraFieldLength?**: `number`

The length of the extra field in bytes.

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraField`](EntryExtraField.md)

The NTFS extra field.

***

### extraFieldPkwareUnix?

> `optional` **extraFieldPkwareUnix?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

The PKWARE Unix extra field (0x000d).

***

### extraFieldUnicodeComment?

> `optional` **extraFieldUnicodeComment?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

The Unicode comment extra field.

***

### extraFieldUnicodePath?

> `optional` **extraFieldUnicodePath?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

The Unicode path extra field.

***

### extraFieldUnix?

> `optional` **extraFieldUnix?**: [`EntryExtraField`](EntryExtraField.md)

The Unix extra field.

***

### extraFieldUnixType1?

> `optional` **extraFieldUnixType1?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

The Info-ZIP Unix type 1 extra field (0x5855).

***

### extraFieldUSDZ?

> `optional` **extraFieldUSDZ?**: [`EntryExtraField`](EntryExtraField.md)

The USDZ extra field.

***

### extraFieldZip64?

> `optional` **extraFieldZip64?**: [`EntryExtraField`](EntryExtraField.md)

The Zip64 extra field.

***

### filename

> **filename**: `string`

The filename of the entry.

***

### filenameLength?

> `optional` **filenameLength?**: `number`

The length of the filename in bytes.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

`true` if the filename is encoded in UTF-8.

***

### gid?

> `optional` **gid?**: `number`

Unix group id when available.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

The last modification date.

***

### localDirectory?

> `optional` **localDirectory?**: [`LocalDirectory`](LocalDirectory.md)

The local file header fields, set when the entry data has been read.

***

### msdosAttributes?

> `optional` **msdosAttributes?**: `object`

The MS-DOS attribute flags exposed as booleans.

#### archive

> **archive**: `boolean`

#### directory

> **directory**: `boolean`

#### hidden

> **hidden**: `boolean`

#### readOnly

> **readOnly**: `boolean`

#### system

> **system**: `boolean`

***

### msdosAttributesRaw?

> `optional` **msdosAttributesRaw?**: `number`

The MS-DOS attributes low byte (raw).
This is the low 8 bits of [EntryMetaData#externalFileAttributes](#externalfileattributes) when present.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

The byte offset of the entry.

***

### rawBitFlag?

> `optional` **rawBitFlag?**: `number`

The general purpose bit flag (raw).

***

### rawComment

> **rawComment**: `Uint8Array`

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate?**: `number` \| `bigint`

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate?**: `number` \| `bigint`

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

The last modification date (raw).

***

### setgid?

> `optional` **setgid?**: `boolean`

`true` if the setgid bit is set on the entry.

***

### setuid?

> `optional` **setuid?**: `boolean`

`true` if the setuid bit is set on the entry.

***

### ~~signature?~~

> `optional` **signature?**: `number`

The signature (CRC32 checksum) of the content. It is `undefined` for entries encrypted with AES returned by
[ZipWriter#add](../classes/ZipWriter.md#add).

#### Deprecated

Use [EntryMetaData#crc32](#crc32) instead.

***

### sticky?

> `optional` **sticky?**: `boolean`

`true` if the sticky bit is set on the entry.

***

### symlink

> **symlink**: `boolean`

`true` if the entry is a symbolic link, i.e. if the Unix file type stored in
[EntryMetaData#externalFileAttributes](#externalfileattributes) is `S_IFLNK` (`0o120000`).

The target of the link is the content of the entry, stored as a path with no trailing NUL
character. It is read like any other entry, e.g. with `entry.getData(new TextWriter())`.

The path is not validated: it can be absolute or escape the archive with `..` segments. It must
be checked before being used to resolve a file.

***

### uid?

> `optional` **uid?**: `number`

Unix owner id when available.

***

### uncompressedSize

> **uncompressedSize**: `number`

The size of the decompressed data in bytes.

***

### unixExternalUpper?

> `optional` **unixExternalUpper?**: `number`

The upper 16-bit portion of [EntryMetaData#externalFileAttributes](#externalfileattributes) when it represents Unix mode bits.

***

### unixMode?

> `optional` **unixMode?**: `number`

Unix mode (st_mode) when available.

***

### version

> **version**: `number`

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
