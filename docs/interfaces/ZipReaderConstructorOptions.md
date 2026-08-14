[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderConstructorOptions

# Interface: ZipReaderConstructorOptions

Defined in: [index.d.ts:1162](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1162)

Represents the options passed to the constructor of [ZipReader](../classes/ZipReader.md), and `{@link ZipDirectory}#import*`.

## Extends

- [`ZipReaderOptions`](ZipReaderOptions.md).[`GetEntriesOptions`](GetEntriesOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`ZipDirectoryEntryImportHttpOptions`](ZipDirectoryEntryImportHttpOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

Defined in: [index.d.ts:1374](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1374)

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

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkAmbiguity`](ZipReaderOptions.md#checkambiguity)

***

### checkAuthenticationCode?

> `optional` **checkAuthenticationCode?**: `boolean`

Defined in: [index.d.ts:1395](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1395)

`true` to verify the authentication code of entries encrypted with AES. The verification detects encrypted
data tampered or corrupted after the encryption.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkAuthenticationCode`](ZipReaderOptions.md#checkauthenticationcode)

***

### checkCrc32?

> `optional` **checkCrc32?**: `boolean`

Defined in: [index.d.ts:1388](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1388)

`true` to verify the CRC-32 checksum of the entry against the value stored in the zip file. The verification
is run on the decompressed data and covers the whole read pipeline. It also applies to entries encrypted with
AES in AE-1 format. It is skipped for entries in AE-2 format because they store a zeroed CRC-32 value.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkCrc32`](ZipReaderOptions.md#checkcrc32)

***

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry?**: `boolean`

Defined in: [index.d.ts:1411](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1411)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkOverlappingEntry`](ZipReaderOptions.md#checkoverlappingentry)

***

### checkOverlappingEntryOnly?

> `optional` **checkOverlappingEntryOnly?**: `boolean`

Defined in: [index.d.ts:1420](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1420)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`) without trying to read the content of the
entry.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkOverlappingEntryOnly`](ZipReaderOptions.md#checkoverlappingentryonly)

***

### checkPasswordOnly?

> `optional` **checkPasswordOnly?**: `boolean`

Defined in: [index.d.ts:1380](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1380)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkPasswordOnly`](ZipReaderOptions.md#checkpasswordonly)

***

### ~~checkSignature?~~

> `optional` **checkSignature?**: `boolean`

Defined in: [index.d.ts:1403](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1403)

`true` to check the CRC-32 checksum of the entry.

#### Deprecated

Use [ZipReaderOptions#checkCrc32](ZipReaderOptions.md#checkcrc32) instead.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkSignature`](ZipReaderOptions.md#checksignature)

***

### commentEncoding?

> `optional` **commentEncoding?**: `string`

Defined in: [index.d.ts:1198](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1198)

The encoding of the comment of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`commentEncoding`](GetEntriesOptions.md#commentencoding)

***

### extractAppendedData?

> `optional` **extractAppendedData?**: `boolean`

Defined in: [index.d.ts:1177](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1177)

`true` to extract the appended data into [ZipReader#appendedData](../classes/ZipReader.md#appendeddata).

#### Default Value

```ts
false
```

***

### extractPrependedData?

> `optional` **extractPrependedData?**: `boolean`

Defined in: [index.d.ts:1171](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1171)

`true` to extract the prepended data into [ZipReader#prependedData](../classes/ZipReader.md#prependeddata).

#### Default Value

```ts
false
```

***

### filenameEncoding?

> `optional` **filenameEncoding?**: `string`

Defined in: [index.d.ts:1194](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1194)

The encoding of the filename of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameEncoding`](GetEntriesOptions.md#filenameencoding)

***

### filenameValidation?

> `optional` **filenameValidation?**: `"balanced"` \| `"strict"` \| `"tolerant"`

Defined in: [index.d.ts:1261](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1261)

How strictly the filename of each entry should be validated. A rejected name throws an
[ERR\_UNSAFE\_FILENAME](../variables/ERR_UNSAFE_FILENAME.md) error carrying the offending name in its `filename` property.

- `"strict"`: reject the names rejected by `"balanced"`, plus the names that do not map cleanly to a file
path, i.e. empty names and names containing a `"."` path component or an empty one (e.g. `"a//b.txt"`).
- `"balanced"`: reject names that would escape the directory they are extracted into, i.e. names containing
a `".."` path component, and absolute names, i.e. names starting with `"/"`, with a drive letter (e.g.
`"C:/file.txt"`) or with two backslashes (UNC paths).
- `"tolerant"`: never reject a name.

A backslash is never interpreted as a path separator: it is a valid filename character on UNIX systems, and
it also occurs as the trail byte of legitimate double-byte filenames (e.g. CP932) decoded with another
charset.

Names are validated, never rewritten, so the filename reported for an entry always matches its central
directory record.

#### Default Value

The value of [GetEntriesOptions#strictness](ZipReaderGetEntriesOptions.md#strictness).

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameValidation`](GetEntriesOptions.md#filenamevalidation)

***

### maxAppendedDataSize?

> `optional` **maxAppendedDataSize?**: `number`

Defined in: [index.d.ts:1288](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1288)

The maximum number of bytes tolerated after the zip structure before the archive is rejected. Defaults to
`0` when [GetEntriesOptions#strictness](ZipReaderGetEntriesOptions.md#strictness) is `"strict"`, `65535` when it is `"balanced"`, and `Infinity`
when it is `"tolerant"`.

An explicit value takes precedence over the strictness default at every level, so it can loosen `"strict"`
or reintroduce a rejection under `"tolerant"`. It also bounds how far back the end of central directory
record is searched for, so a value smaller than the amount of data actually appended surfaces an
[ERR\_EOCDR\_NOT\_FOUND](../variables/ERR_EOCDR_NOT_FOUND.md) error when the record lies beyond the searched region and an
[ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error otherwise.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`maxAppendedDataSize`](GetEntriesOptions.md#maxappendeddatasize)

***

### passThrough?

> `optional` **passThrough?**: `boolean`

Defined in: [index.d.ts:1428](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1428)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`passThrough`](ZipReaderOptions.md#passthrough)

***

### password?

> `optional` **password?**: `string`

Defined in: [index.d.ts:1424](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1424)

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`password`](ZipReaderOptions.md#password)

***

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:1442](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1442)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`preventClose`](ZipReaderOptions.md#preventclose)

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1432](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1432)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`rawPassword`](ZipReaderOptions.md#rawpassword)

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [index.d.ts:1436](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1436)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`signal`](ZipReaderOptions.md#signal)

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

Defined in: [index.d.ts:1363](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1363)

How tolerant the reader should be when the local file header of an entry disagrees with its central
directory record. `"strict"` throws an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error (equivalent to
[ZipReaderOptions#checkAmbiguity](ZipReaderOptions.md#checkambiguity) set to `true`); `"balanced"` and `"tolerant"` trust the central
directory record.

#### Default Value

```ts
"balanced"
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`strictness`](ZipReaderOptions.md#strictness)

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

Defined in: [index.d.ts:406](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L406)

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`transferStreams`](WorkerConfiguration.md#transferstreams)

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

Defined in: [index.d.ts:400](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L400)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

Defined in: [index.d.ts:394](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L394)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`, `type`): `string` \| `undefined`

Defined in: [index.d.ts:1207](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1207)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`

The raw text value.

##### encoding

`string`

The encoding of the text.

##### type

`"filename"` \| `"comment"`

The type of the decoded text, `"filename"` or `"comment"`.

#### Returns

`string` \| `undefined`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`decodeText`](GetEntriesOptions.md#decodetext)

***

### decryptCentralDirectory()?

> `optional` **decryptCentralDirectory**(`data`, `encryptionInfo?`): `Uint8Array`\<`ArrayBufferLike`\> \| `PromiseLike`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:1301](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1301)

The function called for decrypting the central directory when it is encrypted (see the Strong Encryption
Specification in the ZIP format specification). Without this function, reading such an archive throws an
[ERR\_ENCRYPTED\_CENTRAL\_DIRECTORY](../variables/ERR_ENCRYPTED_CENTRAL_DIRECTORY.md) error. zip.js provides the encrypted data and the related metadata
but does not implement the decryption itself.

#### Parameters

##### data

`Uint8Array`

The raw data stored in place of the central directory, i.e. the decryption header followed by
the encrypted (and possibly compressed) central directory, as stored in the zip file.

##### encryptionInfo?

[`DirectoryEncryptionInfo`](DirectoryEncryptionInfo.md)

The encryption metadata read from the Zip64 end of central directory record, or
`undefined` if the zip file does not contain a version 2 record.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `PromiseLike`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The decrypted and decompressed central directory records.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`decryptCentralDirectory`](GetEntriesOptions.md#decryptcentraldirectory)

***

### normalizeFilename()?

> `optional` **normalizeFilename**(`filename`): `string` \| `undefined`

Defined in: [index.d.ts:1276](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1276)

The function called for normalizing the filename of each entry, e.g. to repair the names rejected by
[GetEntriesOptions#filenameValidation](GetEntriesOptions.md#filenamevalidation).

It is called with the decoded filename, after [GetEntriesOptions#decodeText](GetEntriesOptions.md#decodetext) and before the name is
validated, so a name it fails to repair is still rejected. The returned name becomes the name of the entry:
it is used to detect directory entries by their trailing `"/"`, and to detect duplicate filenames when
[GetEntriesOptions#checkAmbiguity](ZipReaderGetEntriesOptions.md#checkambiguity) is set, so two names normalized into the same name are reported as
an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error instead of silently shadowing each other. The raw filename remains
available in [EntryMetaData#rawFilename](EntryMetaData.md#rawfilename).

#### Parameters

##### filename

`string`

The decoded filename.

#### Returns

`string` \| `undefined`

The normalized filename or `undefined` to keep the decoded filename.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`normalizeFilename`](GetEntriesOptions.md#normalizefilename)
