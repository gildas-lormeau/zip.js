[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterAddDataOptions

# Interface: ZipWriterAddDataOptions

Defined in: [index.d.ts:1355](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1355)

Represents the options passed to [ZipWriter#add](../classes/ZipWriter.md#add).

## Extends

- [`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite**: `boolean`

Defined in: [index.d.ts:1440](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1440)

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`bufferedWrite`](ZipWriterConstructorOptions.md#bufferedwrite)

***

### comment?

> `optional` **comment**: `string`

Defined in: [index.d.ts:1374](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1374)

The comment of the entry.

***

### compressionMethod?

> `optional` **compressionMethod**: `number`

Defined in: [index.d.ts:1634](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1634)

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`compressionMethod`](ZipWriterConstructorOptions.md#compressionmethod)

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1492](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1492)

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`creationDate`](ZipWriterConstructorOptions.md#creationdate)

***

### dataDescriptor?

> `optional` **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1537](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1537)

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](ZipWriterConstructorOptions.md#bufferedwrite) option  will automatically be
set to `true`. It will be automatically set to `false` when it is `undefined` and the
[ZipWriterConstructorOptions#bufferedWrite](ZipWriterConstructorOptions.md#bufferedwrite) option is set to `true`, or ` when the
{@link ZipWriterConstructorOptions#zipCrypto} option is set to `true`. Otherwise, the default value is `true`.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`dataDescriptor`](ZipWriterConstructorOptions.md#datadescriptor)

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature**: `boolean`

Defined in: [index.d.ts:1543](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1543)

`true` to add the signature of the data descriptor.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`dataDescriptorSignature`](ZipWriterConstructorOptions.md#datadescriptorsignature)

***

### directory?

> `optional` **directory**: `boolean`

Defined in: [index.d.ts:1364](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1364)

`true` if the entry is a directory.

#### Default Value

```ts
false
```

***

### encrypted?

> `optional` **encrypted**: `boolean`

Defined in: [index.d.ts:1626](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1626)

`true` to write encrypted data when `passThrough` is set to `true`.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encrypted`](ZipWriterConstructorOptions.md#encrypted)

***

### encryptionStrength?

> `optional` **encryptionStrength**: `2` \| `1` \| `3`

Defined in: [index.d.ts:1466](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1466)

The encryption strength (AES):
- 1: 128-bit encryption key
- 2: 192-bit encryption key
- 3: 256-bit encryption key

#### Default Value

```ts
3
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encryptionStrength`](ZipWriterConstructorOptions.md#encryptionstrength)

***

### executable?

> `optional` **executable**: `boolean`

Defined in: [index.d.ts:1370](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1370)

`true` if the entry is an executable file.

#### Default Value

```ts
false
```

***

### extendedTimestamp?

> `optional` **extendedTimestamp**: `boolean`

Defined in: [index.d.ts:1500](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1500)

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed November 31, 2107 and the maximum accuracy is 2 seconds.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`extendedTimestamp`](ZipWriterConstructorOptions.md#extendedtimestamp)

***

### externalFileAttributes?

> `optional` **externalFileAttributes**: `number`

Defined in: [index.d.ts:1555](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1555)

The external file attribute.

#### Default Value

```ts
0
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`externalFileAttributes`](ZipWriterConstructorOptions.md#externalfileattributes)

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:1378](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1378)

The extra field of the entry.

***

### gid?

> `optional` **gid**: `number`

Defined in: [index.d.ts:1563](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1563)

The Unix group id to write in the Unix extra field or as part of the external attributes.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`gid`](ZipWriterConstructorOptions.md#gid)

***

### internalFileAttributes?

> `optional` **internalFileAttributes**: `number`

Defined in: [index.d.ts:1591](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1591)

The internal file attribute.

#### Default Value

```ts
0
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`internalFileAttributes`](ZipWriterConstructorOptions.md#internalfileattributes)

***

### keepOrder?

> `optional` **keepOrder**: `boolean`

Defined in: [index.d.ts:1449](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1449)

`true` to keep the order of the entry physically in the zip file.

When set to `true`, the use of web workers will be improved. However, it also prevents files larger than 4GB from being created without setting the `zip64` option to `true` explicitly.
Another solution to improve the use of web workers is to add entries from smallest to largest in uncompressed size.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`keepOrder`](ZipWriterConstructorOptions.md#keeporder)

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:1484](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1484)

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`lastAccessDate`](ZipWriterConstructorOptions.md#lastaccessdate)

***

### lastModDate?

> `optional` **lastModDate**: `Date`

Defined in: [index.d.ts:1476](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1476)

The last modification date.

#### Default Value

```ts
The current date.
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`lastModDate`](ZipWriterConstructorOptions.md#lastmoddate)

***

### level?

> `optional` **level**: `number`

Defined in: [index.d.ts:1432](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1432)

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

#### Default Value

```ts
6
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`level`](ZipWriterConstructorOptions.md#level)

***

### msdosAttributes?

> `optional` **msdosAttributes**: `object`

Defined in: [index.d.ts:1600](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1600)

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

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`msdosAttributes`](ZipWriterConstructorOptions.md#msdosattributes)

***

### msdosAttributesRaw?

> `optional` **msdosAttributesRaw**: `number`

Defined in: [index.d.ts:1596](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1596)

When provided, the low 8-bit MS-DOS attributes to write into external file attributes.
Must be an integer between 0 and 255.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`msdosAttributesRaw`](ZipWriterConstructorOptions.md#msdosattributesraw)

***

### msDosCompatible?

> `optional` **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1549](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1549)

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`msDosCompatible`](ZipWriterConstructorOptions.md#msdoscompatible)

***

### offset?

> `optional` **offset**: `number`

Defined in: [index.d.ts:1630](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1630)

The offset of the first entry in the zip file.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`offset`](ZipWriterConstructorOptions.md#offset)

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:1622](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1622)

`true` to write the data as-is without compressing it and without crypting it.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`passThrough`](ZipWriterConstructorOptions.md#passthrough)

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:1453](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1453)

The password used to encrypt the content of the entry.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`password`](ZipWriterConstructorOptions.md#password)

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1424](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1424)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`preventClose`](ZipWriterConstructorOptions.md#preventclose)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1457](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1457)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`rawPassword`](ZipWriterConstructorOptions.md#rawpassword)

***

### setgid?

> `optional` **setgid**: `boolean`

Defined in: [index.d.ts:1575](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1575)

`true` to set the setgid bit when writing the Unix mode.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`setgid`](ZipWriterConstructorOptions.md#setgid)

***

### setuid?

> `optional` **setuid**: `boolean`

Defined in: [index.d.ts:1571](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1571)

`true` to set the setuid bit when writing the Unix mode.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`setuid`](ZipWriterConstructorOptions.md#setuid)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:1470](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1470)

The `AbortSignal` instance used to cancel the compression.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`signal`](ZipWriterConstructorOptions.md#signal)

***

### signature?

> `optional` **signature**: `number`

Defined in: [index.d.ts:1386](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1386)

The signature (CRC32 checksum) of the content. This option is ignored if the [ZipWriterConstructorOptions#passThrough](ZipWriterConstructorOptions.md#passthrough) option is not set to `true`.

***

### sticky?

> `optional` **sticky**: `boolean`

Defined in: [index.d.ts:1579](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1579)

`true` to set the sticky bit when writing the Unix mode.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`sticky`](ZipWriterConstructorOptions.md#sticky)

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile**: `boolean`

Defined in: [index.d.ts:1612](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1612)

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`supportZip64SplitFile`](ZipWriterConstructorOptions.md#supportzip64splitfile)

***

### uid?

> `optional` **uid**: `number`

Defined in: [index.d.ts:1559](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1559)

The Unix owner id to write in the Unix extra field or as part of the external attributes.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`uid`](ZipWriterConstructorOptions.md#uid)

***

### uncompressedSize?

> `optional` **uncompressedSize**: `number`

Defined in: [index.d.ts:1382](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1382)

The uncompressed size of the entry. This option is ignored if the [ZipWriterConstructorOptions#passThrough](ZipWriterConstructorOptions.md#passthrough) option is not set to `true`.

***

### unixExtraFieldType?

> `optional` **unixExtraFieldType**: `"infozip"` \| `"unix"`

Defined in: [index.d.ts:1585](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1585)

Which Unix extra field format to write when creating entries that include Unix metadata.
- "infozip": use Info-ZIP New Unix extra field
- "unix": use the traditional Unix extra field format

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`unixExtraFieldType`](ZipWriterConstructorOptions.md#unixextrafieldtype)

***

### unixMode?

> `optional` **unixMode**: `number`

Defined in: [index.d.ts:1567](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1567)

The Unix mode (st_mode bits) to use when writing external attributes.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`unixMode`](ZipWriterConstructorOptions.md#unixmode)

***

### usdz?

> `optional` **usdz**: `boolean`

Defined in: [index.d.ts:1618](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1618)

`true`to produce zip files compatible with the USDZ specification.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`usdz`](ZipWriterConstructorOptions.md#usdz)

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:295](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L295)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`useCompressionStream`](ZipWriterConstructorOptions.md#usecompressionstream)

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames**: `boolean`

Defined in: [index.d.ts:1528](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1528)

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D -
Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this does not ensure that the file names are in the correct encoding.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`useUnicodeFileNames`](ZipWriterConstructorOptions.md#useunicodefilenames)

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

Defined in: [index.d.ts:289](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L289)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`useWebWorkers`](ZipWriterConstructorOptions.md#usewebworkers)

***

### version?

> `optional` **version**: `number`

Defined in: [index.d.ts:1513](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1513)

The "Version" field.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`version`](ZipWriterConstructorOptions.md#version)

***

### versionMadeBy?

> `optional` **versionMadeBy**: `number`

Defined in: [index.d.ts:1519](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1519)

The "Version made by" field.

#### Default Value

```ts
20
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`versionMadeBy`](ZipWriterConstructorOptions.md#versionmadeby)

***

### zip64?

> `optional` **zip64**: `boolean`

Defined in: [index.d.ts:1418](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1418)

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`zip64`](ZipWriterConstructorOptions.md#zip64)

***

### zipCrypto?

> `optional` **zipCrypto**: `boolean`

Defined in: [index.d.ts:1509](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1509)

`true` to use the ZipCrypto algorithm to encrypt the content of the entry. Setting it to `true` will also
set the [ZipWriterConstructorOptions#dataDescriptor](ZipWriterConstructorOptions.md#datadescriptor) to `true`.

It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`zipCrypto`](ZipWriterConstructorOptions.md#zipcrypto)

## Methods

### encodeText()?

> `optional` **encodeText**(`text`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [index.d.ts:1641](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1641)

The function called for encoding the filename and the comment of the entry.

#### Parameters

##### text

`string`

The text to encode.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

The encoded text or `undefined` if the text should be encoded by zip.js.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encodeText`](ZipWriterConstructorOptions.md#encodetext)

***

### onend()?

> `optional` **onend**(`computedSize`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1669](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1669)

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onend`](EntryDataOnprogressOptions.md#onend)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1662](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1662)

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onprogress`](EntryDataOnprogressOptions.md#onprogress)

***

### onstart()?

> `optional` **onstart**(`total`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1654](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1654)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onstart`](EntryDataOnprogressOptions.md#onstart)
