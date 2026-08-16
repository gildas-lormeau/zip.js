[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / DirectoryEncryptionInfo

# Interface: DirectoryEncryptionInfo

Represents the encryption metadata of an encrypted central directory (see
[GetEntriesOptions#decryptCentralDirectory](GetEntriesOptions.md#decryptcentraldirectory)), read from the version 2 Zip64 end of central directory
record.

## Properties

### bitLength?

> `optional` **bitLength?**: `number`

The key size in bits.

***

### compressedSize?

> `optional` **compressedSize?**: `number`

The size of the compressed and encrypted central directory.

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

The compression method applied to the central directory before encryption.

***

### encryptionAlgorithm?

> `optional` **encryptionAlgorithm?**: `number`

The identifier of the encryption algorithm (e.g. `0x6610` for AES-256).

***

### flags?

> `optional` **flags?**: `number`

The processing flags (e.g. `0x0001` for password-based encryption).

***

### hashAlgorithm?

> `optional` **hashAlgorithm?**: `number`

The identifier of the hash algorithm used for the password validation data.

***

### hashData?

> `optional` **hashData?**: `Uint8Array`\<`ArrayBufferLike`\>

The password validation data.

***

### rawExtensibleData

> **rawExtensibleData**: `Uint8Array`

The raw data of the extensible data sector of the record.

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

The size of the central directory once decrypted and decompressed.
