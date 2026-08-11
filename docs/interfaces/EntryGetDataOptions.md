[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryGetDataOptions

# Interface: EntryGetDataOptions

Defined in: [index.d.ts:1698](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1698)

Represents the options passed to [FileEntry#getData](FileEntry.md#getdata) and `{@link ZipFileEntry}.get*`.

## Extends

- [`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`ZipReaderOptions`](ZipReaderOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`EntryGetDataCheckPasswordOptions`](EntryGetDataCheckPasswordOptions.md)
- [`ZipDirectoryEntryExportFileSystemHandleOptions`](ZipDirectoryEntryExportFileSystemHandleOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

Defined in: [index.d.ts:1163](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1163)

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

Defined in: [index.d.ts:1183](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1183)

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

Defined in: [index.d.ts:1192](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1192)

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

Defined in: [index.d.ts:1169](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1169)

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

Defined in: [index.d.ts:1175](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1175)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkSignature`](ZipReaderOptions.md#checksignature)

***

### passThrough?

> `optional` **passThrough?**: `boolean`

Defined in: [index.d.ts:1200](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1200)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`passThrough`](ZipReaderOptions.md#passthrough)

***

### password?

> `optional` **password?**: `string`

Defined in: [index.d.ts:1196](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1196)

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`password`](ZipReaderOptions.md#password)

***

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:1214](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1214)

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

Defined in: [index.d.ts:1204](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1204)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`rawPassword`](ZipReaderOptions.md#rawpassword)

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [index.d.ts:1208](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1208)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`signal`](ZipReaderOptions.md#signal)

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

Defined in: [index.d.ts:1152](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1152)

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

Defined in: [index.d.ts:376](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L376)

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

Defined in: [index.d.ts:370](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L370)

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

Defined in: [index.d.ts:364](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L364)

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

Defined in: [index.d.ts:2242](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L2242)

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

Defined in: [index.d.ts:2235](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L2235)

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

Defined in: [index.d.ts:2227](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L2227)

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
