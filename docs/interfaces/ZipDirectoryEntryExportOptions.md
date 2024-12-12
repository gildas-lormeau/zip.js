[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntryExportOptions

# Interface: ZipDirectoryEntryExportOptions

Represents the options passed to `{@link ZipDirectoryEntry}#export*()`.

## Extends

- [`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite**: `boolean`

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`bufferedWrite`](ZipWriterConstructorOptions.md#bufferedwrite)

#### Defined in

[index.d.ts:1242](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1242)

***

### compressionMethod?

> `optional` **compressionMethod**: `number`

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`compressionMethod`](ZipWriterConstructorOptions.md#compressionmethod)

#### Defined in

[index.d.ts:1385](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1385)

***

### creationDate?

> `optional` **creationDate**: `Date`

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`creationDate`](ZipWriterConstructorOptions.md#creationdate)

#### Defined in

[index.d.ts:1291](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1291)

***

### dataDescriptor?

> `optional` **dataDescriptor**: `boolean`

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](ZipWriterConstructorOptions.md#bufferedwrite) option  will automatically be set to `true`.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`dataDescriptor`](ZipWriterConstructorOptions.md#datadescriptor)

#### Defined in

[index.d.ts:1333](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1333)

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature**: `boolean`

`true` to add the signature of the data descriptor.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`dataDescriptorSignature`](ZipWriterConstructorOptions.md#datadescriptorsignature)

#### Defined in

[index.d.ts:1339](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1339)

***

### encrypted?

> `optional` **encrypted**: `boolean`

`true` to write encrypted data when `passThrough` is set to `true`.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encrypted`](ZipWriterConstructorOptions.md#encrypted)

#### Defined in

[index.d.ts:1377](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1377)

***

### encryptionStrength?

> `optional` **encryptionStrength**: `1` \| `2` \| `3`

The encryption strength (AES).

#### Default Value

```ts
3
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encryptionStrength`](ZipWriterConstructorOptions.md#encryptionstrength)

#### Defined in

[index.d.ts:1265](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1265)

***

### extendedTimestamp?

> `optional` **extendedTimestamp**: `boolean`

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed November 31, 2107 and the maximum accuracy is 2 seconds.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`extendedTimestamp`](ZipWriterConstructorOptions.md#extendedtimestamp)

#### Defined in

[index.d.ts:1299](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1299)

***

### externalFileAttribute?

> `optional` **externalFileAttribute**: `number`

The external file attribute.

#### Default Value

```ts
0
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`externalFileAttribute`](ZipWriterConstructorOptions.md#externalfileattribute)

#### Defined in

[index.d.ts:1351](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1351)

***

### internalFileAttribute?

> `optional` **internalFileAttribute**: `number`

The internal file attribute.

#### Default Value

```ts
0
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`internalFileAttribute`](ZipWriterConstructorOptions.md#internalfileattribute)

#### Defined in

[index.d.ts:1357](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1357)

***

### keepOrder?

> `optional` **keepOrder**: `boolean`

`true` to keep the order of the entry physically in the zip file.

When set to `true`, the use of web workers will be improved. However, it also prevents files larger than 4GB from being created without setting the `zip64` option to `true` explicitly.
Another solution to improve the use of web workers is to add entries from smallest to largest in uncompressed size.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`keepOrder`](ZipWriterConstructorOptions.md#keeporder)

#### Defined in

[index.d.ts:1251](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1251)

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`lastAccessDate`](ZipWriterConstructorOptions.md#lastaccessdate)

#### Defined in

[index.d.ts:1283](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1283)

***

### lastModDate?

> `optional` **lastModDate**: `Date`

The last modification date.

#### Default Value

```ts
The current date.
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`lastModDate`](ZipWriterConstructorOptions.md#lastmoddate)

#### Defined in

[index.d.ts:1275](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1275)

***

### level?

> `optional` **level**: `number`

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

#### Default Value

```ts
5
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`level`](ZipWriterConstructorOptions.md#level)

#### Defined in

[index.d.ts:1234](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1234)

***

### mimeType?

> `optional` **mimeType**: `string`

The MIME type of the exported data when relevant.

#### Defined in

[index.d.ts:1899](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1899)

***

### msDosCompatible?

> `optional` **msDosCompatible**: `boolean`

`true` to write [EntryMetaData#externalFileAttribute](EntryMetaData.md#externalfileattribute) in MS-DOS format for folder entries.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`msDosCompatible`](ZipWriterConstructorOptions.md#msdoscompatible)

#### Defined in

[index.d.ts:1345](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1345)

***

### offset?

> `optional` **offset**: `number`

The offset of the first entry in the zip file.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`offset`](ZipWriterConstructorOptions.md#offset)

#### Defined in

[index.d.ts:1381](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1381)

***

### passThrough?

> `optional` **passThrough**: `boolean`

`true` to write the data as-is without compressing it and without crypting it.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`passThrough`](ZipWriterConstructorOptions.md#passthrough)

#### Defined in

[index.d.ts:1373](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1373)

***

### password?

> `optional` **password**: `string`

The password used to encrypt the content of the entry.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`password`](ZipWriterConstructorOptions.md#password)

#### Defined in

[index.d.ts:1255](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1255)

***

### preventClose?

> `optional` **preventClose**: `boolean`

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`preventClose`](ZipWriterConstructorOptions.md#preventclose)

#### Defined in

[index.d.ts:1226](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1226)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`rawPassword`](ZipWriterConstructorOptions.md#rawpassword)

#### Defined in

[index.d.ts:1259](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1259)

***

### readerOptions?

> `optional` **readerOptions**: [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)

The options passed to the Reader instances

#### Defined in

[index.d.ts:1903](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1903)

***

### relativePath?

> `optional` **relativePath**: `boolean`

`true` to use filenames relative to the entry instead of full filenames.

#### Defined in

[index.d.ts:1895](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1895)

***

### signal?

> `optional` **signal**: `AbortSignal`

The `AbortSignal` instance used to cancel the compression.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`signal`](ZipWriterConstructorOptions.md#signal)

#### Defined in

[index.d.ts:1269](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1269)

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile**: `boolean`

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`supportZip64SplitFile`](ZipWriterConstructorOptions.md#supportzip64splitfile)

#### Defined in

[index.d.ts:1363](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1363)

***

### usdz?

> `optional` **usdz**: `boolean`

`true`to produce zip files compatible with the USDZ specification.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`usdz`](ZipWriterConstructorOptions.md#usdz)

#### Defined in

[index.d.ts:1369](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1369)

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames**: `boolean`

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D - Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this does not ensure that the file names are in the correct encoding.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`useUnicodeFileNames`](ZipWriterConstructorOptions.md#useunicodefilenames)

#### Defined in

[index.d.ts:1325](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1325)

***

### version?

> `optional` **version**: `number`

The "Version" field.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`version`](ZipWriterConstructorOptions.md#version)

#### Defined in

[index.d.ts:1311](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1311)

***

### versionMadeBy?

> `optional` **versionMadeBy**: `number`

The "Version made by" field.

#### Default Value

```ts
20
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`versionMadeBy`](ZipWriterConstructorOptions.md#versionmadeby)

#### Defined in

[index.d.ts:1317](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1317)

***

### zip64?

> `optional` **zip64**: `boolean`

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`zip64`](ZipWriterConstructorOptions.md#zip64)

#### Defined in

[index.d.ts:1220](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1220)

***

### zipCrypto?

> `optional` **zipCrypto**: `boolean`

`true` to use the ZipCrypto algorithm to encrypt the content of the entry.

It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`zipCrypto`](ZipWriterConstructorOptions.md#zipcrypto)

#### Defined in

[index.d.ts:1307](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1307)

## Methods

### encodeText()?

> `optional` **encodeText**(`text`): `Uint8Array`\<`ArrayBufferLike`\>

Encode the filename and the comment of the entry.

#### Parameters

##### text

`string`

The text to encode.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

The encoded text or `undefined` if the text should be encoded by zip.js.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encodeText`](ZipWriterConstructorOptions.md#encodetext)

#### Defined in

[index.d.ts:1392](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1392)

***

### onend()?

> `optional` **onend**(`computedSize`): `Promise`\<`void`\>

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onend`](EntryDataOnprogressOptions.md#onend)

#### Defined in

[index.d.ts:1420](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1420)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `Promise`\<`void`\>

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onprogress`](EntryDataOnprogressOptions.md#onprogress)

#### Defined in

[index.d.ts:1413](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1413)

***

### onstart()?

> `optional` **onstart**(`total`): `Promise`\<`void`\>

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onstart`](EntryDataOnprogressOptions.md#onstart)

#### Defined in

[index.d.ts:1405](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1405)
