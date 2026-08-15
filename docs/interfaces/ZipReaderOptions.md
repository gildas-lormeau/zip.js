[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderOptions

# Interface: ZipReaderOptions

Defined in: [index.d.ts:1354](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1354)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md) and [FileEntry#getData](FileEntry.md#getdata).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`EntryGetDataOptions`](EntryGetDataOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

Defined in: [index.d.ts:1374](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1374)

`true` to throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the local
file header of the entry disagrees with its central directory record in a way that could make other tools
(e.g. streaming readers based on local file headers) interpret the entry differently. This detects mismatched
filenames, general purpose bit flags (encryption, data descriptor and language encoding flags), compression
methods, CRC-32 checksums and sizes. The extra fields are not compared because the zip specification allows
them to differ.

#### Default Value

```ts
false
```

***

### checkAuthenticationCode?

> `optional` **checkAuthenticationCode?**: `boolean`

Defined in: [index.d.ts:1395](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1395)

`true` to verify the authentication code of entries encrypted with AES. The verification detects encrypted
data tampered or corrupted after the encryption.

#### Default Value

```ts
true
```

***

### checkCrc32?

> `optional` **checkCrc32?**: `boolean`

Defined in: [index.d.ts:1388](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1388)

`true` to verify the CRC-32 checksum of the entry against the value stored in the zip file. The verification
is run on the decompressed data and covers the whole read pipeline. It also applies to entries encrypted with
AES in AE-1 format. It is skipped for entries in AE-2 format because they store a zeroed CRC-32 value.

#### Default Value

```ts
false
```

***

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry?**: `boolean`

Defined in: [index.d.ts:1411](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1411)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`).

#### Default Value

```ts
false
```

***

### checkOverlappingEntryOnly?

> `optional` **checkOverlappingEntryOnly?**: `boolean`

Defined in: [index.d.ts:1420](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1420)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`) without trying to read the content of the
entry.

#### Default Value

```ts
false
```

***

### checkPasswordOnly?

> `optional` **checkPasswordOnly?**: `boolean`

Defined in: [index.d.ts:1380](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1380)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

***

### ~~checkSignature?~~

> `optional` **checkSignature?**: `boolean`

Defined in: [index.d.ts:1403](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1403)

`true` to check the CRC-32 checksum of the entry.

#### Deprecated

Use [ZipReaderOptions#checkCrc32](#checkcrc32) instead.

#### Default Value

```ts
false
```

***

### passThrough?

> `optional` **passThrough?**: `boolean`

Defined in: [index.d.ts:1428](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1428)

`true` to read the data as-is without decompressing it and without decrypting it.

***

### password?

> `optional` **password?**: `string`

Defined in: [index.d.ts:1424](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1424)

The password used to decrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:1442](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1442)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1432](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1432)

The password used to encrypt the content of the entry (raw).

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [index.d.ts:1436](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1436)

The `AbortSignal` instance used to cancel the decompression.

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

Defined in: [index.d.ts:1363](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1363)

How tolerant the reader should be when the local file header of an entry disagrees with its central
directory record. `"strict"` throws an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error (equivalent to
[ZipReaderOptions#checkAmbiguity](#checkambiguity) set to `true`); `"balanced"` and `"tolerant"` trust the central
directory record.

#### Default Value

```ts
"balanced"
```
