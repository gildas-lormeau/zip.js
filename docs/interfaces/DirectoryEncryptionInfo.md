[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / DirectoryEncryptionInfo

# Interface: DirectoryEncryptionInfo

Defined in: [index.d.ts:1312](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1312)

Represents the encryption metadata of an encrypted central directory (see
[GetEntriesOptions#decryptCentralDirectory](GetEntriesOptions.md#decryptcentraldirectory)), read from the version 2 Zip64 end of central directory
record.

## Properties

### bitLength?

> `optional` **bitLength?**: `number`

Defined in: [index.d.ts:1336](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1336)

The key size in bits.

***

### compressedSize?

> `optional` **compressedSize?**: `number`

Defined in: [index.d.ts:1324](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1324)

The size of the compressed and encrypted central directory.

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

Defined in: [index.d.ts:1320](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1320)

The compression method applied to the central directory before encryption.

***

### encryptionAlgorithm?

> `optional` **encryptionAlgorithm?**: `number`

Defined in: [index.d.ts:1332](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1332)

The identifier of the encryption algorithm (e.g. `0x6610` for AES-256).

***

### flags?

> `optional` **flags?**: `number`

Defined in: [index.d.ts:1340](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1340)

The processing flags (e.g. `0x0001` for password-based encryption).

***

### hashAlgorithm?

> `optional` **hashAlgorithm?**: `number`

Defined in: [index.d.ts:1344](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1344)

The identifier of the hash algorithm used for the password validation data.

***

### hashData?

> `optional` **hashData?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1348](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1348)

The password validation data.

***

### rawExtensibleData

> **rawExtensibleData**: `Uint8Array`

Defined in: [index.d.ts:1316](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1316)

The raw data of the extensible data sector of the record.

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

Defined in: [index.d.ts:1328](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1328)

The size of the central directory once decrypted and decompressed.
