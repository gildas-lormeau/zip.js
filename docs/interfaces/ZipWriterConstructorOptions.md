[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterConstructorOptions

# Interface: ZipWriterConstructorOptions

Defined in: [index.d.ts:1410](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1410)

Represents options passed to the constructor of [ZipWriter](../classes/ZipWriter.md), [ZipWriter#add](../classes/ZipWriter.md#add) and `{@link ZipDirectoryEntry}#export*`.

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite?**: `boolean`

Defined in: [index.d.ts:1440](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1440)

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

Defined in: [index.d.ts:1640](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1640)

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

***

### createTempStream?

> `optional` **createTempStream?**: () => `Promise`\<\{ `readable`: `ReadableStream`; `writable`: `WritableStream`; \}\>

Defined in: [index.d.ts:1447](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1447)

An async factory function that returns a `TransformStream`-like object (`{ writable, readable }`) used as a temporary buffer when entries are written in parallel.

When provided, this replaces the default in-memory `TransformStream` buffer, allowing data to be stored externally (e.g. filesystem, OPFS, network).
The `writable` side receives compressed entry data. The `readable` side is consumed when the entry is replayed into the final zip stream.

#### Returns

`Promise`\<\{ `readable`: `ReadableStream`; `writable`: `WritableStream`; \}\>

***

### creationDate?

> `optional` **creationDate?**: `Date`

Defined in: [index.d.ts:1498](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1498)

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### dataDescriptor?

> `optional` **dataDescriptor?**: `boolean`

Defined in: [index.d.ts:1543](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1543)

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option will automatically be
set to `true`. It will be automatically set to `false` when it is `undefined` and the
[ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option is set to `true`, or when the
[ZipWriterConstructorOptions#zipCrypto](#zipcrypto) option is set to `true`. Otherwise, the default value is `true`.

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature?**: `boolean`

Defined in: [index.d.ts:1549](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1549)

`true` to add the signature of the data descriptor.

#### Default Value

```ts
false
```

***

### encrypted?

> `optional` **encrypted?**: `boolean`

Defined in: [index.d.ts:1632](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1632)

`true` to write encrypted data when `passThrough` is set to `true`.

***

### encryptionStrength?

> `optional` **encryptionStrength?**: `2` \| `1` \| `3`

Defined in: [index.d.ts:1472](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1472)

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

Defined in: [index.d.ts:1506](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1506)

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed November 31, 2107 and the maximum accuracy is 2 seconds.

#### Default Value

```ts
true
```

***

### externalFileAttributes?

> `optional` **externalFileAttributes?**: `number`

Defined in: [index.d.ts:1561](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1561)

The external file attribute.

#### Default Value

```ts
0
```

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1569](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1569)

The Unix group id to write in the Unix extra field or as part of the external attributes.

***

### internalFileAttributes?

> `optional` **internalFileAttributes?**: `number`

Defined in: [index.d.ts:1597](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1597)

The internal file attribute.

#### Default Value

```ts
0
```

***

### keepOrder?

> `optional` **keepOrder?**: `boolean`

Defined in: [index.d.ts:1455](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1455)

`true` to keep the order of the entry physically in the zip file.

When set to `true`, the use of web workers will be improved.

#### Default Value

```ts
true
```

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1490](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1490)

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

Defined in: [index.d.ts:1482](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1482)

The last modification date.

#### Default Value

```ts
The current date.
```

***

### level?

> `optional` **level?**: `number`

Defined in: [index.d.ts:1432](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1432)

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

#### Default Value

```ts
6
```

***

### msdosAttributes?

> `optional` **msdosAttributes?**: `object`

Defined in: [index.d.ts:1606](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1606)

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

Defined in: [index.d.ts:1602](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1602)

When provided, the low 8-bit MS-DOS attributes to write into external file attributes.
Must be an integer between 0 and 255.

***

### msDosCompatible?

> `optional` **msDosCompatible?**: `boolean`

Defined in: [index.d.ts:1555](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1555)

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

#### Default Value

```ts
false
```

***

### offset?

> `optional` **offset?**: `number`

Defined in: [index.d.ts:1636](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1636)

The offset of the first entry in the zip file.

***

### passThrough?

> `optional` **passThrough?**: `boolean`

Defined in: [index.d.ts:1628](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1628)

`true` to write the data as-is without compressing it and without crypting it.

***

### password?

> `optional` **password?**: `string`

Defined in: [index.d.ts:1459](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1459)

The password used to encrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:1424](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1424)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1463](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1463)

The password used to encrypt the content of the entry (raw).

***

### setgid?

> `optional` **setgid?**: `boolean`

Defined in: [index.d.ts:1581](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1581)

`true` to set the setgid bit when writing the Unix mode.

***

### setuid?

> `optional` **setuid?**: `boolean`

Defined in: [index.d.ts:1577](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1577)

`true` to set the setuid bit when writing the Unix mode.

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [index.d.ts:1476](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1476)

The `AbortSignal` instance used to cancel the compression.

***

### sticky?

> `optional` **sticky?**: `boolean`

Defined in: [index.d.ts:1585](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1585)

`true` to set the sticky bit when writing the Unix mode.

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile?**: `boolean`

Defined in: [index.d.ts:1618](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1618)

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

Defined in: [index.d.ts:301](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L301)

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

Defined in: [index.d.ts:1565](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1565)

The Unix owner id to write in the Unix extra field or as part of the external attributes.

***

### unixExtraFieldType?

> `optional` **unixExtraFieldType?**: `"infozip"` \| `"unix"`

Defined in: [index.d.ts:1591](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1591)

Which Unix extra field format to write when creating entries that include Unix metadata.
- "infozip": use Info-ZIP New Unix extra field
- "unix": use the traditional Unix extra field format

***

### unixMode?

> `optional` **unixMode?**: `number`

Defined in: [index.d.ts:1573](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1573)

The Unix mode (st_mode bits) to use when writing external attributes.

***

### usdz?

> `optional` **usdz?**: `boolean`

Defined in: [index.d.ts:1624](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1624)

`true`to produce zip files compatible with the USDZ specification.

#### Default Value

```ts
false
```

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

Defined in: [index.d.ts:295](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L295)

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

Defined in: [index.d.ts:1534](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1534)

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

Defined in: [index.d.ts:289](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L289)

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

Defined in: [index.d.ts:1519](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1519)

The "Version" field.

***

### versionMadeBy?

> `optional` **versionMadeBy?**: `number`

Defined in: [index.d.ts:1525](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1525)

The "Version made by" field.

#### Default Value

```ts
20
```

***

### zip64?

> `optional` **zip64?**: `boolean`

Defined in: [index.d.ts:1418](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1418)

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

***

### zipCrypto?

> `optional` **zipCrypto?**: `boolean`

Defined in: [index.d.ts:1515](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1515)

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

Defined in: [index.d.ts:1647](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L1647)

The function called for encoding the filename and the comment of the entry.

#### Parameters

##### text

`string`

The text to encode.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

The encoded text or `undefined` if the text should be encoded by zip.js.
