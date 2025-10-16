[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Defined in: [index.d.ts:888](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L888)

Represents the metadata of an entry in a zip file (Core API).

## Extended by

- [`DirectoryEntry`](DirectoryEntry.md)
- [`FileEntry`](FileEntry.md)

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:952](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L952)

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:960](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L960)

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:920](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L920)

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1081](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1081)

The compression method.

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:936](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L936)

The creation date.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1077](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1077)

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:912](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L912)

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:908](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L908)

`true` if the entry is an executable file

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1073](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1073)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1056](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1056)

The 32-bit `externalFileAttributes` field is the authoritative on-disk metadata for each entry.
- Upper 16 bits: Unix mode/type (e.g., permissions, file type)
- Low 8 bits: MS-DOS file attributes (e.g., directory, read-only)

When writing, all provided options are merged into this field. When reading, convenience fields are decoded from it.
For most use cases, prefer the high-level options and fields; only advanced users need to manipulate the raw value directly.

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:968](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L968)

The extra field.

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:896](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L896)

The filename of the entry.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:904](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L904)

`true` if the filename is encoded in UTF-8.

***

### gid?

> `optional` **gid**: `number`

Defined in: [index.d.ts:1027](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1027)

Unix group id when available.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1068](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1068)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1047](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1047)

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:932](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L932)

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:928](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L928)

The last modification date.

***

### msdosAttributes?

> `optional` **msdosAttributes**: `object`

Defined in: [index.d.ts:1013](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1013)

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

> `optional` **msdosAttributesRaw**: `number`

Defined in: [index.d.ts:1009](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1009)

The MS-DOS attributes low byte (raw).
This is the low 8 bits of [EntryMetaData#externalFileAttributes](#externalfileattributes) when present.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:988](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L988)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:892](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L892)

The byte offset of the entry.

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:956](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L956)

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:948](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L948)

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:972](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L972)

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:900](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L900)

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:944](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L944)

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:940](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L940)

The last modification date (raw).

***

### setgid?

> `optional` **setgid**: `boolean`

Defined in: [index.d.ts:1039](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1039)

`true` if the setgid bit is set on the entry.

***

### setuid?

> `optional` **setuid**: `boolean`

Defined in: [index.d.ts:1035](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1035)

`true` if the setuid bit is set on the entry.

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:964](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L964)

The signature (CRC32 checksum) of the content.

***

### sticky?

> `optional` **sticky**: `boolean`

Defined in: [index.d.ts:1043](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1043)

`true` if the sticky bit is set on the entry.

***

### uid?

> `optional` **uid**: `number`

Defined in: [index.d.ts:1023](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1023)

Unix owner id when available.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:924](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L924)

The size of the decompressed data in bytes.

***

### unixExternalUpper?

> `optional` **unixExternalUpper**: `number`

Defined in: [index.d.ts:1060](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1060)

The upper 16-bit portion of [EntryMetaData#externalFileAttributes](#externalfileattributes) when it represents Unix mode bits.

***

### unixMode?

> `optional` **unixMode**: `number`

Defined in: [index.d.ts:1031](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1031)

Unix mode (st_mode) when available.

***

### version

> **version**: `number`

Defined in: [index.d.ts:980](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L980)

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:984](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L984)

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:976](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L976)

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:916](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L916)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
