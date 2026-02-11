[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterConstructorOptions

# Interface: ZipWriterConstructorOptions

Defined in: [index.d.ts:1410](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1410)

Represents options passed to the constructor of [ZipWriter](../classes/ZipWriter.md), [ZipWriter#add](../classes/ZipWriter.md#add) and `{@link ZipDirectoryEntry}#export*`.

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite**: `boolean`

Defined in: [index.d.ts:1440](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1440)

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

***

### compressionMethod?

> `optional` **compressionMethod**: `number`

Defined in: [index.d.ts:1641](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1641)

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

***

### createTempStream()?

> `optional` **createTempStream**: () => `Promise`\<\{ `readable`: `ReadableStream`; `writable`: `WritableStream`; \}\>

Defined in: [index.d.ts:1447](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1447)

An async factory function that returns a `TransformStream`-like object (`{ writable, readable }`) used as a temporary buffer when entries are written in parallel.

When provided, this replaces the default in-memory `TransformStream` buffer, allowing data to be stored externally (e.g. filesystem, OPFS, network).
The `writable` side receives compressed entry data. The `readable` side is consumed when the entry is replayed into the final zip stream.

#### Returns

`Promise`\<\{ `readable`: `ReadableStream`; `writable`: `WritableStream`; \}\>

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1499](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1499)

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### dataDescriptor?

> `optional` **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1544](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1544)

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option will automatically be
set to `true`. It will be automatically set to `false` when it is `undefined` and the
[ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option is set to `true`, or when the
[ZipWriterConstructorOptions#zipCrypto](#zipcrypto) option is set to `true`. Otherwise, the default value is `true`.

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature**: `boolean`

Defined in: [index.d.ts:1550](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1550)

`true` to add the signature of the data descriptor.

#### Default Value

```ts
false
```

***

### encrypted?

> `optional` **encrypted**: `boolean`

Defined in: [index.d.ts:1633](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1633)

`true` to write encrypted data when `passThrough` is set to `true`.

***

### encryptionStrength?

> `optional` **encryptionStrength**: `2` \| `1` \| `3`

Defined in: [index.d.ts:1473](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1473)

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

> `optional` **extendedTimestamp**: `boolean`

Defined in: [index.d.ts:1507](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1507)

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed November 31, 2107 and the maximum accuracy is 2 seconds.

#### Default Value

```ts
true
```

***

### externalFileAttributes?

> `optional` **externalFileAttributes**: `number`

Defined in: [index.d.ts:1562](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1562)

The external file attribute.

#### Default Value

```ts
0
```

***

### gid?

> `optional` **gid**: `number`

Defined in: [index.d.ts:1570](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1570)

The Unix group id to write in the Unix extra field or as part of the external attributes.

***

### internalFileAttributes?

> `optional` **internalFileAttributes**: `number`

Defined in: [index.d.ts:1598](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1598)

The internal file attribute.

#### Default Value

```ts
0
```

***

### keepOrder?

> `optional` **keepOrder**: `boolean`

Defined in: [index.d.ts:1456](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1456)

`true` to keep the order of the entry physically in the zip file.

When set to `true`, the use of web workers will be improved. However, it also prevents files larger than 4GB from being created without setting the `zip64` option to `true` explicitly.
Another solution to improve the use of web workers is to add entries from smallest to largest in uncompressed size.

#### Default Value

```ts
true
```

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:1491](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1491)

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### lastModDate?

> `optional` **lastModDate**: `Date`

Defined in: [index.d.ts:1483](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1483)

The last modification date.

#### Default Value

```ts
The current date.
```

***

### level?

> `optional` **level**: `number`

Defined in: [index.d.ts:1432](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1432)

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

#### Default Value

```ts
6
```

***

### msdosAttributes?

> `optional` **msdosAttributes**: `object`

Defined in: [index.d.ts:1607](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1607)

When provided, MS-DOS attribute flags (boolean object) to write into external file attributes low byte.

#### archive?

> `optional` **archive**: `boolean`

#### directory?

> `optional` **directory**: `boolean`

#### hidden?

> `optional` **hidden**: `boolean`

#### readOnly?

> `optional` **readOnly**: `boolean`

#### system?

> `optional` **system**: `boolean`

***

### msdosAttributesRaw?

> `optional` **msdosAttributesRaw**: `number`

Defined in: [index.d.ts:1603](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1603)

When provided, the low 8-bit MS-DOS attributes to write into external file attributes.
Must be an integer between 0 and 255.

***

### msDosCompatible?

> `optional` **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1556](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1556)

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

#### Default Value

```ts
false
```

***

### offset?

> `optional` **offset**: `number`

Defined in: [index.d.ts:1637](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1637)

The offset of the first entry in the zip file.

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:1629](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1629)

`true` to write the data as-is without compressing it and without crypting it.

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:1460](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1460)

The password used to encrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1424](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1424)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1464](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1464)

The password used to encrypt the content of the entry (raw).

***

### setgid?

> `optional` **setgid**: `boolean`

Defined in: [index.d.ts:1582](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1582)

`true` to set the setgid bit when writing the Unix mode.

***

### setuid?

> `optional` **setuid**: `boolean`

Defined in: [index.d.ts:1578](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1578)

`true` to set the setuid bit when writing the Unix mode.

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:1477](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1477)

The `AbortSignal` instance used to cancel the compression.

***

### sticky?

> `optional` **sticky**: `boolean`

Defined in: [index.d.ts:1586](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1586)

`true` to set the sticky bit when writing the Unix mode.

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile**: `boolean`

Defined in: [index.d.ts:1619](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1619)

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

***

### transferStreams?

> `optional` **transferStreams**: `boolean`

Defined in: [index.d.ts:301](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L301)

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`transferStreams`](WorkerConfiguration.md#transferstreams)

***

### uid?

> `optional` **uid**: `number`

Defined in: [index.d.ts:1566](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1566)

The Unix owner id to write in the Unix extra field or as part of the external attributes.

***

### unixExtraFieldType?

> `optional` **unixExtraFieldType**: `"infozip"` \| `"unix"`

Defined in: [index.d.ts:1592](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1592)

Which Unix extra field format to write when creating entries that include Unix metadata.
- "infozip": use Info-ZIP New Unix extra field
- "unix": use the traditional Unix extra field format

***

### unixMode?

> `optional` **unixMode**: `number`

Defined in: [index.d.ts:1574](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1574)

The Unix mode (st_mode bits) to use when writing external attributes.

***

### usdz?

> `optional` **usdz**: `boolean`

Defined in: [index.d.ts:1625](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1625)

`true`to produce zip files compatible with the USDZ specification.

#### Default Value

```ts
false
```

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:295](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L295)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames**: `boolean`

Defined in: [index.d.ts:1535](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1535)

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D -
Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this does not ensure that the file names are in the correct encoding.

#### Default Value

```ts
true
```

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

Defined in: [index.d.ts:289](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L289)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

***

### version?

> `optional` **version**: `number`

Defined in: [index.d.ts:1520](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1520)

The "Version" field.

***

### versionMadeBy?

> `optional` **versionMadeBy**: `number`

Defined in: [index.d.ts:1526](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1526)

The "Version made by" field.

#### Default Value

```ts
20
```

***

### zip64?

> `optional` **zip64**: `boolean`

Defined in: [index.d.ts:1418](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1418)

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

***

### zipCrypto?

> `optional` **zipCrypto**: `boolean`

Defined in: [index.d.ts:1516](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1516)

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

Defined in: [index.d.ts:1648](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1648)

The function called for encoding the filename and the comment of the entry.

#### Parameters

##### text

`string`

The text to encode.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

The encoded text or `undefined` if the text should be encoded by zip.js.
