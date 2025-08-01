[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Defined in: [index.d.ts:1031](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1031)

Represents the metadata of an entry in a zip file (Core API).

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:1099](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1099)

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:1107](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1107)

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:1067](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1067)

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1164](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1164)

The compression method.

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1083](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1083)

The creation date.

***

### directory

> **directory**: `boolean`

Defined in: [index.d.ts:1051](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1051)

`true` if the entry is a directory.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1160](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1160)

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1059](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1059)

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:1055](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1055)

`true` if the entry is an executable file

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1156](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1156)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1143](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1143)

The external file attributes (raw).

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:1115](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1115)

The extra field.

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:1039](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1039)

The filename of the entry.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:1047](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1047)

`true` if the filename is encoded in UTF-8.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1151](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1151)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1139](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1139)

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:1079](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1079)

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1075](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1075)

The last modification date.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1135](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1135)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:1035](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1035)

The byte offset of the entry.

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:1103](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1103)

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:1095](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1095)

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1119](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1119)

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:1043](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1043)

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:1091](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1091)

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:1087](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1087)

The last modification date (raw).

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:1111](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1111)

The signature (CRC32 checksum) of the content.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1071](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1071)

The size of the decompressed data in bytes.

***

### version

> **version**: `number`

Defined in: [index.d.ts:1127](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1127)

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:1131](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1131)

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:1123](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1123)

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:1063](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L1063)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
