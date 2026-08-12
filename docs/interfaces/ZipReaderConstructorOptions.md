[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderConstructorOptions

# Interface: ZipReaderConstructorOptions

Defined in: [index.d.ts:1057](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1057)

Represents the options passed to the constructor of [ZipReader](../classes/ZipReader.md), and `{@link ZipDirectory}#import*`.

## Extends

- [`ZipReaderOptions`](ZipReaderOptions.md).[`GetEntriesOptions`](GetEntriesOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`ZipDirectoryEntryImportHttpOptions`](ZipDirectoryEntryImportHttpOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

Defined in: [index.d.ts:1172](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1172)

`true` to throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the local
file header of the entry disagrees with its central directory record in a way that could make other tools
(e.g. streaming readers based on local file headers) interpret the entry differently. This detects mismatched
filenames, general purpose bit flags (encryption, data descriptor and language encoding flags), compression
methods, signatures and sizes. The extra fields are not compared because the zip specification allows them
to differ.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkAmbiguity`](ZipReaderOptions.md#checkambiguity)

***

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry?**: `boolean`

Defined in: [index.d.ts:1192](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1192)

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

Defined in: [index.d.ts:1201](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1201)

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

Defined in: [index.d.ts:1178](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1178)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkPasswordOnly`](ZipReaderOptions.md#checkpasswordonly)

***

### checkSignature?

> `optional` **checkSignature?**: `boolean`

Defined in: [index.d.ts:1184](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1184)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkSignature`](ZipReaderOptions.md#checksignature)

***

### commentEncoding?

> `optional` **commentEncoding?**: `string`

Defined in: [index.d.ts:1093](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1093)

The encoding of the comment of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`commentEncoding`](GetEntriesOptions.md#commentencoding)

***

### extractAppendedData?

> `optional` **extractAppendedData?**: `boolean`

Defined in: [index.d.ts:1072](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1072)

`true` to extract the appended data into [ZipReader#appendedData](../classes/ZipReader.md#appendeddata).

#### Default Value

```ts
false
```

***

### extractPrependedData?

> `optional` **extractPrependedData?**: `boolean`

Defined in: [index.d.ts:1066](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1066)

`true` to extract the prepended data into [ZipReader#prependedData](../classes/ZipReader.md#prependeddata).

#### Default Value

```ts
false
```

***

### filenameEncoding?

> `optional` **filenameEncoding?**: `string`

Defined in: [index.d.ts:1089](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1089)

The encoding of the filename of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameEncoding`](GetEntriesOptions.md#filenameencoding)

***

### maxAppendedDataSize?

> `optional` **maxAppendedDataSize?**: `number`

Defined in: [index.d.ts:1146](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1146)

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

Defined in: [index.d.ts:1209](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1209)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`passThrough`](ZipReaderOptions.md#passthrough)

***

### password?

> `optional` **password?**: `string`

Defined in: [index.d.ts:1205](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1205)

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`password`](ZipReaderOptions.md#password)

***

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:1223](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1223)

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

Defined in: [index.d.ts:1213](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1213)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`rawPassword`](ZipReaderOptions.md#rawpassword)

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [index.d.ts:1217](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1217)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`signal`](ZipReaderOptions.md#signal)

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

Defined in: [index.d.ts:1161](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1161)

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

Defined in: [index.d.ts:385](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L385)

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

Defined in: [index.d.ts:379](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L379)

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

Defined in: [index.d.ts:373](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L373)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string` \| `undefined`

Defined in: [index.d.ts:1101](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1101)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`string` \| `undefined`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`decodeText`](GetEntriesOptions.md#decodetext)
