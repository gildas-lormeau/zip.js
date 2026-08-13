[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / DirectoryEncryptionInfo

# Interface: DirectoryEncryptionInfo

Defined in: [index.d.ts:1275](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1275)

Represents the encryption metadata of an encrypted central directory (see
[GetEntriesOptions#decryptCentralDirectory](GetEntriesOptions.md#decryptcentraldirectory)), read from the version 2 Zip64 end of central directory
record.

## Properties

### bitLength?

> `optional` **bitLength?**: `number`

Defined in: [index.d.ts:1299](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1299)

The key size in bits.

***

### compressedSize?

> `optional` **compressedSize?**: `number`

Defined in: [index.d.ts:1287](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1287)

The size of the compressed and encrypted central directory.

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

Defined in: [index.d.ts:1283](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1283)

The compression method applied to the central directory before encryption.

***

### encryptionAlgorithm?

> `optional` **encryptionAlgorithm?**: `number`

Defined in: [index.d.ts:1295](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1295)

The identifier of the encryption algorithm (e.g. `0x6610` for AES-256).

***

### flags?

> `optional` **flags?**: `number`

Defined in: [index.d.ts:1303](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1303)

The processing flags (e.g. `0x0001` for password-based encryption).

***

### hashAlgorithm?

> `optional` **hashAlgorithm?**: `number`

Defined in: [index.d.ts:1307](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1307)

The identifier of the hash algorithm used for the password validation data.

***

### hashData?

> `optional` **hashData?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1311](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1311)

The password validation data.

***

### rawExtensibleData

> **rawExtensibleData**: `Uint8Array`

Defined in: [index.d.ts:1279](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1279)

The raw data of the extensible data sector of the record.

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

Defined in: [index.d.ts:1291](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L1291)

The size of the central directory once decrypted and decompressed.
