[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderConstructorOptions

# Interface: ZipReaderConstructorOptions

Represents the options passed to the constructor of [ZipReader](../classes/ZipReader.md), and `{@link ZipDirectory}#import*`.

## Extends

- [`ZipReaderOptions`](ZipReaderOptions.md).[`GetEntriesOptions`](GetEntriesOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`ZipDirectoryEntryImportHttpOptions`](ZipDirectoryEntryImportHttpOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

`true` to throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the local
file header of the entry disagrees with its central directory record in a way that could make other tools
(e.g. streaming readers based on local file headers) interpret the entry differently. This detects mismatched
filenames, general purpose bit flags (encryption, data descriptor and language encoding flags), compression
methods, CRC-32 checksums and sizes. The extra fields are not compared because the zip specification allows
them to differ.

This is the boolean form of [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness): `true` means `"strict"` and `false` means
any value but `"strict"`. When both options are set, the value passed to [FileEntry#getData](FileEntry.md#getdata) takes
precedence over the value passed to the constructor of [ZipReader](../classes/ZipReader.md), and `strictness` takes precedence
over `checkAmbiguity` when both are set at the same level. `false` downgrades an inherited `"strict"` value
to `"balanced"` and leaves an inherited `"tolerant"` value unchanged.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkAmbiguity`](ZipReaderOptions.md#checkambiguity)

***

### checkAuthenticationCode?

> `optional` **checkAuthenticationCode?**: `boolean`

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

### checkLocalDirectory?

> `optional` **checkLocalDirectory?**: `boolean`

`true` to validate the local file header of the entry against its central directory record when calling
[FileEntry#getData](FileEntry.md#getdata), `false` to skip that validation. This is the entry-level half of
[ZipReaderOptions#checkAmbiguity](ZipReaderOptions.md#checkambiguity), exposed on its own so it can be enabled without the archive-level
checks and disabled without giving up the rest of [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness). It is the only way to
validate the local file headers of a self-extracting archive, since
[GetEntriesOptions#checkAmbiguity](ZipReaderGetEntriesOptions.md#checkambiguity) rejects prepended data outright.

`true` compares the filename as well, like [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness) set to `"strict"`; `false`
compares nothing, like `"tolerant"`. An explicit value takes precedence over the strictness default at
every level.

#### Default Value

`true` when [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness) is `"strict"` or `"balanced"`, `false` when
it is `"tolerant"`.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkLocalDirectory`](ZipReaderOptions.md#checklocaldirectory)

***

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry?**: `boolean`

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

The encoding of the comment of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`commentEncoding`](GetEntriesOptions.md#commentencoding)

***

### extractAppendedData?

> `optional` **extractAppendedData?**: `boolean`

`true` to extract the appended data into [ZipReader#appendedData](../classes/ZipReader.md#appendeddata).

#### Default Value

```ts
false
```

***

### extractPrependedData?

> `optional` **extractPrependedData?**: `boolean`

`true` to extract the prepended data into [ZipReader#prependedData](../classes/ZipReader.md#prependeddata).

#### Default Value

```ts
false
```

***

### filenameEncoding?

> `optional` **filenameEncoding?**: `string`

The encoding of the filename of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameEncoding`](GetEntriesOptions.md#filenameencoding)

***

### filenameValidation?

> `optional` **filenameValidation?**: `"balanced"` \| `"strict"` \| `"tolerant"`

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

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`passThrough`](ZipReaderOptions.md#passthrough)

***

### password?

> `optional` **password?**: `string`

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`password`](ZipReaderOptions.md#password)

***

### preventClose?

> `optional` **preventClose?**: `boolean`

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Remarks

It only applies to the writable owned by the caller. It is ignored by the [Writer](../classes/Writer.md) instances
returning the written data, such as [BlobWriter](../classes/BlobWriter.md) or [TextWriter](../classes/TextWriter.md), whose writable is
created internally and must be closed for [Writer#getData](../classes/Writer.md#getdata) to resolve.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`preventClose`](ZipReaderOptions.md#preventclose)

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`rawPassword`](ZipReaderOptions.md#rawpassword)

***

### signal?

> `optional` **signal?**: `AbortSignal`

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`signal`](ZipReaderOptions.md#signal)

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

How tolerant the reader should be when the local file header of an entry disagrees with its central
directory record. Any difference throws an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error.

- `"strict"`: compare the filename, the general purpose bit flag, the compression method, the CRC-32
checksum and the sizes.
- `"balanced"`: compare everything except the filename.
- `"tolerant"`: compare nothing and trust the central directory record.

Every field except the filename is read from the local file header anyway, to locate the entry data, so
the comparison `"balanced"` performs reads no additional bytes. Comparing the filename reads the filename
bytes as well, which costs one extra read per entry whenever the local file header carries no extra field
— the common case in practice. Use [ZipReaderOptions#checkLocalDirectory](ZipReaderOptions.md#checklocaldirectory) to request or suppress the
whole comparison explicitly.

#### Default Value

```ts
"balanced"
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`strictness`](ZipReaderOptions.md#strictness)

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

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

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

When compressing, the native API is only used when `level` is undefined or equal to 6, see [ZipWriterConstructorOptions#level](ZipWriterConstructorOptions.md#level).

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

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
