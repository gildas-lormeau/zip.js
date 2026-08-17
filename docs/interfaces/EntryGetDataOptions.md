[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryGetDataOptions

# Interface: EntryGetDataOptions

Represents the options passed to [FileEntry#getData](FileEntry.md#getdata) and `{@link ZipFileEntry}.get*`.

## Extends

- [`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`ZipReaderOptions`](ZipReaderOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`EntryGetDataCheckPasswordOptions`](EntryGetDataCheckPasswordOptions.md)
- [`ZipDirectoryEntryExportFileSystemHandleOptions`](ZipDirectoryEntryExportFileSystemHandleOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

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

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onend`](EntryDataOnprogressOptions.md#onend)

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

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onprogress`](EntryDataOnprogressOptions.md#onprogress)

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

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onstart`](EntryDataOnprogressOptions.md#onstart)
