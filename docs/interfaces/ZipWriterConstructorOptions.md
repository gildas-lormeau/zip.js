[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterConstructorOptions

# Interface: ZipWriterConstructorOptions

Defined in: [index.d.ts:2149](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2149)

Represents options passed to the constructor of [ZipWriter](../classes/ZipWriter.md), [ZipWriter#add](../classes/ZipWriter.md#add) and `{@link ZipDirectoryEntry}#export*`.

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite?**: `boolean`

Defined in: [index.d.ts:2179](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2179)

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

Defined in: [index.d.ts:2407](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2407)

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

***

### createTempStream?

> `optional` **createTempStream?**: () => [`TempStream`](TempStream.md) \| `Promise`\<[`TempStream`](TempStream.md)\>

Defined in: [index.d.ts:2189](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2189)

An async factory function that returns a `TransformStream`-like object (`{ writable, readable }`) used as a temporary buffer when entries are written in parallel.

When provided, this replaces the default in-memory `TransformStream` buffer, allowing data to be stored externally (e.g. filesystem, OPFS, network).
The `writable` side receives compressed entry data. The `readable` side is consumed when the entry is replayed into the final zip stream.
The optional `dispose` method is called once the entry has been processed (on success, error, or abort) so a resource-backed buffer can release its resource.

See [createOPFSTempStream](../functions/createOPFSTempStream.md) for a ready-made OPFS-backed implementation, [createSyncAccessHandleTempStream](../functions/createSyncAccessHandleTempStream.md) for a faster worker-only variant, and [createBlobTempStream](../functions/createBlobTempStream.md) for a `Blob`-backed one.

#### Returns

[`TempStream`](TempStream.md) \| `Promise`\<[`TempStream`](TempStream.md)\>

***

### creationDate?

> `optional` **creationDate?**: `Date`

Defined in: [index.d.ts:2247](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2247)

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### dataDescriptor?

> `optional` **dataDescriptor?**: `boolean`

Defined in: [index.d.ts:2302](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2302)

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option will automatically be
set to `true`. It will be automatically set to `false` when it is `undefined` and the
[ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option is set to `true`, or when the
[ZipWriterConstructorOptions#zipCrypto](#zipcrypto) option is set to `true`. Otherwise, the default value is `true`.

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature?**: `boolean`

Defined in: [index.d.ts:2308](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2308)

`true` to add the signature of the data descriptor.

#### Default Value

```ts
true
```

***

### encrypted?

> `optional` **encrypted?**: `boolean`

Defined in: [index.d.ts:2399](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2399)

`true` to write encrypted data when `passThrough` is set to `true`.

***

### encryptionStrength?

> `optional` **encryptionStrength?**: `2` \| `1` \| `3`

Defined in: [index.d.ts:2221](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2221)

The encryption strength (AES):
- 1: 128-bit encryption key
- 2: 192-bit encryption key
- 3: 256-bit encryption key

#### Default Value

```ts
3
```

***

### extendedTimestamp?

> `optional` **extendedTimestamp?**: `boolean`

Defined in: [index.d.ts:2255](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2255)

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed December 31, 2107 and the maximum accuracy is 2 seconds, dates being truncated to the whole second and odd seconds rounded up to the next even second.

#### Default Value

```ts
true
```

***

### externalFileAttributes?

> `optional` **externalFileAttributes?**: `number`

Defined in: [index.d.ts:2323](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2323)

The external file attribute.

When set explicitly, the value is written verbatim (including `0`), unless `unixMode`, `setuid`, `setgid`
or `sticky` is also set, in which case these options override the upper 16 bits while the lower 16 bits
are preserved. When omitted, the value is derived from the other options (e.g. the MS-DOS directory
attribute for folder entries, Unix default permissions when `msDosCompatible` is `false`).

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:2331](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2331)

The Unix group id to write in the Unix extra field or as part of the external attributes.

***

### internalFileAttributes?

> `optional` **internalFileAttributes?**: `number`

Defined in: [index.d.ts:2361](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2361)

The internal file attribute.

#### Default Value

```ts
0
```

***

### keepOrder?

> `optional` **keepOrder?**: `boolean`

Defined in: [index.d.ts:2197](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2197)

`true` to keep the order of the entry physically in the zip file.

When set to `true`, the use of web workers will be improved.

#### Default Value

```ts
true
```

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:2239](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2239)

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

Defined in: [index.d.ts:2231](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2231)

The last modification date.

#### Default Value

```ts
The current date.
```

***

### level?

> `optional` **level?**: `number`

Defined in: [index.d.ts:2171](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2171)

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

#### Default Value

```ts
6
```

***

### msdosAttributes?

> `optional` **msdosAttributes?**: `object`

Defined in: [index.d.ts:2370](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2370)

When provided, MS-DOS attribute flags (boolean object) to write into external file attributes low byte.

#### archive?

> `optional` **archive?**: `boolean`

#### directory?

> `optional` **directory?**: `boolean`

#### hidden?

> `optional` **hidden?**: `boolean`

#### readOnly?

> `optional` **readOnly?**: `boolean`

#### system?

> `optional` **system?**: `boolean`

***

### msdosAttributesRaw?

> `optional` **msdosAttributesRaw?**: `number`

Defined in: [index.d.ts:2366](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2366)

When provided, the low 8-bit MS-DOS attributes to write into external file attributes.
Must be an integer between 0 and 255.

***

### msDosCompatible?

> `optional` **msDosCompatible?**: `boolean`

Defined in: [index.d.ts:2314](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2314)

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

#### Default Value

```ts
false
```

***

### ntfsTimestamp?

> `optional` **ntfsTimestamp?**: `boolean`

Defined in: [index.d.ts:2265](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2265)

`true` to always store the NTFS extra field, `false` to never store it.

By default, the NTFS extra field is stored only when it preserves information the extended timestamp extra field cannot
represent: a last modification date outside its supported range, or explicit [ZipWriterConstructorOptions#lastAccessDate](#lastaccessdate)
or [ZipWriterConstructorOptions#creationDate](#creationdate) values.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

***

### offset?

> `optional` **offset?**: `number`

Defined in: [index.d.ts:2403](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2403)

The offset of the first entry in the zip file.

***

### passThrough?

> `optional` **passThrough?**: `boolean`

Defined in: [index.d.ts:2395](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2395)

`true` to write the data as-is without compressing it and without crypting it.

***

### password?

> `optional` **password?**: `string`

Defined in: [index.d.ts:2208](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2208)

The password used to encrypt the content of the entry.

#### Remarks

When a password is set and the [ZipWriterConstructorOptions#zipCrypto](#zipcrypto) option is not set to `true`, the
entry is encrypted in AES AE-2 format: the CRC-32 checksum of the content is stored as `0` so that the zip
file reveals no information about the encrypted content. A stored checksum would allow an attacker to verify
guessed content without knowing the password. The integrity of the data is guaranteed by the authentication
code instead.

***

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:2163](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2163)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:2212](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2212)

The password used to encrypt the content of the entry (raw).

***

### setgid?

> `optional` **setgid?**: `boolean`

Defined in: [index.d.ts:2343](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2343)

`true` to set the setgid bit when writing the Unix mode.

***

### setuid?

> `optional` **setuid?**: `boolean`

Defined in: [index.d.ts:2339](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2339)

`true` to set the setuid bit when writing the Unix mode.

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [index.d.ts:2225](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2225)

The `AbortSignal` instance used to cancel the compression.

***

### sticky?

> `optional` **sticky?**: `boolean`

Defined in: [index.d.ts:2347](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2347)

`true` to set the sticky bit when writing the Unix mode.

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile?**: `boolean`

Defined in: [index.d.ts:2382](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2382)

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

Defined in: [index.d.ts:406](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L406)

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`transferStreams`](WorkerConfiguration.md#transferstreams)

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:2327](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2327)

The Unix owner id to write in the Unix extra field or as part of the external attributes.

***

### unixExtraFieldType?

> `optional` **unixExtraFieldType?**: `"infozip"` \| `"unix"`

Defined in: [index.d.ts:2355](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2355)

Which Unix extra field format to write when creating entries that include Unix metadata.
- "infozip": Info-ZIP New Unix extra field (0x7875), storing variable-length uid/gid up to 32 bits.
- "unix": Info-ZIP Unix extra field type 2 (0x7855), storing fixed 2-byte uid/gid (0..65535); a
  larger uid or gid is rejected. The Unix mode is not part of this field; it is written to the
  external file attributes.

***

### unixMode?

> `optional` **unixMode?**: `number`

Defined in: [index.d.ts:2335](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2335)

The Unix mode (st_mode bits) to use when writing external attributes.

***

### usdz?

> `optional` **usdz?**: `boolean`

Defined in: [index.d.ts:2391](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2391)

`true`to produce zip files compatible with the USDZ specification: the data of the entries is aligned on 64-byte
boundaries and stored uncompressed unless the [ZipWriterConstructorOptions#level](#level) or
[ZipWriterAddDataOptions#compressionMethod](#compressionmethod) options are set explicitly. Setting the
[ZipWriterConstructorOptions#password](#password) option throws an [ERR\_UNSUPPORTED\_ENCRYPTION\_USDZ](../variables/ERR_UNSUPPORTED_ENCRYPTION_USDZ.md) error.

#### Default Value

```ts
false
```

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

Defined in: [index.d.ts:400](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L400)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames?**: `boolean`

Defined in: [index.d.ts:2293](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2293)

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D -
Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this does not ensure that the file names are in the correct encoding.

#### Default Value

```ts
true
```

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

Defined in: [index.d.ts:394](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L394)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

***

### version?

> `optional` **version?**: `number`

Defined in: [index.d.ts:2278](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2278)

The "Version" field.

***

### versionMadeBy?

> `optional` **versionMadeBy?**: `number`

Defined in: [index.d.ts:2284](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2284)

The "Version made by" field.

#### Default Value

```ts
20
```

***

### zip64?

> `optional` **zip64?**: `boolean`

Defined in: [index.d.ts:2157](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2157)

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

***

### zipCrypto?

> `optional` **zipCrypto?**: `boolean`

Defined in: [index.d.ts:2274](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2274)

`true` to use the ZipCrypto algorithm to encrypt the content of the entry. Setting it to `true` will also
set the [ZipWriterConstructorOptions#dataDescriptor](#datadescriptor) to `true`.

It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.

#### Default Value

```ts
false
```

## Methods

### encodeText()?

> `optional` **encodeText**(`text`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [index.d.ts:2414](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L2414)

The function called for encoding the filename and the comment of the entry.

#### Parameters

##### text

`string`

The text to encode.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

The encoded text or `undefined` if the text should be encoded by zip.js.
