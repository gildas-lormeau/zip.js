[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / DirectoryEncryptionInfo

# Interface: DirectoryEncryptionInfo

Defined in: [index.d.ts:1314](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1314)

Represents the encryption metadata of an encrypted central directory (see
[GetEntriesOptions#decryptCentralDirectory](GetEntriesOptions.md#decryptcentraldirectory)), read from the version 2 Zip64 end of central directory
record.

## Properties

### bitLength?

> `optional` **bitLength?**: `number`

Defined in: [index.d.ts:1338](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1338)

The key size in bits.

***

### compressedSize?

> `optional` **compressedSize?**: `number`

Defined in: [index.d.ts:1326](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1326)

The size of the compressed and encrypted central directory.

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

Defined in: [index.d.ts:1322](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1322)

The compression method applied to the central directory before encryption.

***

### encryptionAlgorithm?

> `optional` **encryptionAlgorithm?**: `number`

Defined in: [index.d.ts:1334](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1334)

The identifier of the encryption algorithm (e.g. `0x6610` for AES-256).

***

### flags?

> `optional` **flags?**: `number`

Defined in: [index.d.ts:1342](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1342)

The processing flags (e.g. `0x0001` for password-based encryption).

***

### hashAlgorithm?

> `optional` **hashAlgorithm?**: `number`

Defined in: [index.d.ts:1346](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1346)

The identifier of the hash algorithm used for the password validation data.

***

### hashData?

> `optional` **hashData?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1350](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1350)

The password validation data.

***

### rawExtensibleData

> **rawExtensibleData**: `Uint8Array`

Defined in: [index.d.ts:1318](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1318)

The raw data of the extensible data sector of the record.

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

Defined in: [index.d.ts:1330](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1330)

The size of the central directory once decrypted and decompressed.
