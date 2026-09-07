[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntryExportFileSystemHandleOptions

# Interface: ZipDirectoryEntryExportFileSystemHandleOptions

Represents the options passed to [ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle) and [ZipFS#exportFileSystemHandle](../classes/ZipFS.md#exportfilesystemhandle).

## Remarks

The [ZipReaderOptions#preventClose](ZipReaderOptions.md#preventclose) option is ignored: the export owns the writable of each
file it creates and must close it for the data to be written.

## Extends

- [`EntryGetDataOptions`](EntryGetDataOptions.md)

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

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkAmbiguity`](EntryGetDataOptions.md#checkambiguity)

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

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkAuthenticationCode`](EntryGetDataOptions.md#checkauthenticationcode)

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

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkCrc32`](EntryGetDataOptions.md#checkcrc32)

***

### checkLocalDirectory?

> `optional` **checkLocalDirectory?**: `boolean`

`true` to reject the entry with an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error when its local file header
disagrees with its central directory record while calling [FileEntry#getData](FileEntry.md#getdata), `false` to deposit
the differences on [EntryMetaData#warnings](EntryMetaData.md#warnings) instead. This is the entry-level half of
[ZipReaderOptions#checkAmbiguity](ZipReaderOptions.md#checkambiguity), exposed on its own so it can be enabled without the archive-level
checks and disabled without giving up the rest of [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness). It is the only way to
validate the local file headers of a self-extracting archive, since
[GetEntriesOptions#checkAmbiguity](ZipReaderGetEntriesOptions.md#checkambiguity) rejects prepended data outright.

`true` compares the filename as well, like [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness) set to `"strict"`; `false`
compares everything except the filename, like `"tolerant"`. Set
[ZipReaderOptions#checkLocalFilename](ZipReaderOptions.md#checklocalfilename) to control the filename comparison on its own. An explicit
value takes precedence over the strictness default at every level.

#### Default Value

`true` when [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness) is `"strict"` or `"balanced"`, `false` when
it is `"tolerant"`.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkLocalDirectory`](EntryGetDataOptions.md#checklocaldirectory)

***

### checkLocalFilename?

> `optional` **checkLocalFilename?**: `boolean`

`true` to compare the filename of the local file header with the one of the central directory record when
calling [FileEntry#getData](FileEntry.md#getdata), `false` to leave the filename out of that comparison.

Comparing the filename costs one extra read per entry whenever the local file header carries no extra
field, which is why it is left out below [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness) set to `"strict"`. This option
selects what is compared without changing whether a difference throws or warns, which
[ZipReaderOptions#checkLocalDirectory](ZipReaderOptions.md#checklocaldirectory) decides. It is therefore the only way to obtain
[WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_FILENAME](../variables/WARNING_MISMATCHED_LOCAL_FILE_HEADER_FILENAME.md) as a warning, with
`{ checkLocalFilename: true, checkLocalDirectory: false }`, and the only way to keep every other check of
`"strict"` without paying the extra read, with `{ checkLocalFilename: false, strictness: "strict" }`.

#### Default Value

the value of [ZipReaderOptions#checkLocalDirectory](ZipReaderOptions.md#checklocaldirectory) when it is set, otherwise `true`
when [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness) is `"strict"` and `false` when it is `"balanced"` or
`"tolerant"`.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkLocalFilename`](EntryGetDataOptions.md#checklocalfilename)

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

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkOverlappingEntry`](EntryGetDataOptions.md#checkoverlappingentry)

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

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkOverlappingEntryOnly`](EntryGetDataOptions.md#checkoverlappingentryonly)

***

### checkPasswordOnly?

> `optional` **checkPasswordOnly?**: `boolean`

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkPasswordOnly`](EntryGetDataOptions.md#checkpasswordonly)

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

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkSignature`](EntryGetDataOptions.md#checksignature)

***

### concurrent?

> `optional` **concurrent?**: `boolean`

`true` to write independent files concurrently instead of one after another.

When an entry fails, the entries still in flight are cancelled and the ones not started yet are
skipped, so a failed export stops as early as it does when writing one file after another. An
entry whose write has already been requested may still be created, because the File System
Access API cannot cancel a pending `getFileHandle` or `getDirectoryHandle` call.

#### Default Value

```ts
false
```

***

### passThrough?

> `optional` **passThrough?**: `boolean` \| `"compressed"`

`true` to read the data as-is without decompressing it and without decrypting it, `"compressed"` to decrypt
it without decompressing it.

#### Remarks

The codecs run in a fixed order, the data is decrypted and then decompressed, so this option selects how
many of these two stages are skipped rather than which one. `"compressed"` therefore returns the data of the
entry still compressed but no longer encrypted, and it is the only way to obtain it: the value `true` returns
the stored bytes, which are still encrypted, and an unset value returns the content itself. Reading an entry
which is not encrypted gives the same result with `true` and with `"compressed"`.

Since the encryption is undone, `"compressed"` needs the [ZipReaderOptions#password](ZipReaderOptions.md#password) option and
throws an [ERR\_INVALID\_PASSWORD](../variables/ERR_INVALID_PASSWORD.md) error when it is wrong, whereas `true` never looks at the password.
The [ZipReaderOptions#checkAuthenticationCode](ZipReaderOptions.md#checkauthenticationcode) option applies as well. The
[ZipReaderOptions#checkCrc32](ZipReaderOptions.md#checkcrc32) option does not, since the CRC32 of the entry describes its
content and the content is not decompressed.

Two entries holding the same content encrypted with two different passwords have no bytes in common when
they are read with `true`, because the salt is drawn per entry. Read with `"compressed"` they are identical,
which is what makes it possible to compare the content of encrypted entries without decompressing them.

A value which is neither a boolean, `"compressed"` nor unset throws an [ERR\_INVALID\_PASS\_THROUGH\_VALUE](../variables/ERR_INVALID_PASS_THROUGH_VALUE.md)
error. The filesystem API copies entries verbatim and only accepts a boolean, see
[ERR\_UNSUPPORTED\_PASS\_THROUGH\_VALUE](../variables/ERR_UNSUPPORTED_PASS_THROUGH_VALUE.md).

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`passThrough`](EntryGetDataOptions.md#passthrough)

***

### password?

> `optional` **password?**: `string`

The password used to decrypt the content of the entry.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`password`](EntryGetDataOptions.md#password)

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

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`preventClose`](EntryGetDataOptions.md#preventclose)

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`rawPassword`](EntryGetDataOptions.md#rawpassword)

***

### readerOptions?

> `optional` **readerOptions?**: [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)

The options passed to the Reader instances.

#### Remarks

These options override the ones passed at the top level. The [ZipReaderOptions#password](ZipReaderOptions.md#password)
option can be set here or at the top level, unlike [ZipDirectoryEntryExportOptions](ZipDirectoryEntryExportOptions.md) where
the top-level password encrypts the exported zip file instead.

A value which is neither an object nor unset throws an [ERR\_INVALID\_READER\_OPTIONS](../variables/ERR_INVALID_READER_OPTIONS.md) error.

***

### signal?

> `optional` **signal?**: `AbortSignal`

The `AbortSignal` instance used to cancel the decompression.

A signal already aborted when the operation starts rejects it with [ERR\_ABORTED](../variables/ERR_ABORTED.md) as the
reason of the `AbortError`, or with `signal.reason` when it is set, without relying on the
`signal` option of `pipeTo` that the oldest supported engines ignore.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`signal`](EntryGetDataOptions.md#signal)

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

How tolerant the reader should be when the local file header of an entry disagrees with its central
directory record.

- `"strict"`: compare the filename, the general purpose bit flag, the compression method, the CRC-32
checksum and the sizes, and throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error on any difference.
- `"balanced"`: compare everything except the filename, and throw on any difference.
- `"tolerant"`: compare everything except the filename, and deposit the differences on
[EntryMetaData#warnings](EntryMetaData.md#warnings) instead of throwing.

Every field except the filename is read from the local file header anyway, to locate the entry data, so
the comparison `"balanced"` performs reads no additional bytes. Comparing the filename reads the filename
bytes as well, which costs one extra read per entry whenever the local file header carries no extra field
— the common case in practice, and the reason the filename is left out below `"strict"`. Use
[ZipReaderOptions#checkLocalDirectory](ZipReaderOptions.md#checklocaldirectory) to request or suppress the whole comparison explicitly, and
[ZipReaderOptions#checkLocalFilename](ZipReaderOptions.md#checklocalfilename) to include or exclude the filename on its own.

#### Default Value

```ts
"balanced"
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`strictness`](EntryGetDataOptions.md#strictness)

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`transferStreams`](EntryGetDataOptions.md#transferstreams)

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

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`useCompressionStream`](EntryGetDataOptions.md#usecompressionstream)

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`useWebWorkers`](EntryGetDataOptions.md#usewebworkers)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `void` \| `Promise`\<`void`\>

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`onend`](EntryGetDataOptions.md#onend)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `void` \| `Promise`\<`void`\>

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`onprogress`](EntryGetDataOptions.md#onprogress)

***

### onstart()?

> `optional` **onstart**(`total`): `void` \| `Promise`\<`void`\>

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`onstart`](EntryGetDataOptions.md#onstart)
