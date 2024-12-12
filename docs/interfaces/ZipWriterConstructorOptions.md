[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterConstructorOptions

# Interface: ZipWriterConstructorOptions

Represents options passed to the constructor of [ZipWriter](../classes/ZipWriter.md), [ZipWriter#add](../classes/ZipWriter.md#add) and `{@link ZipDirectoryEntry}#export*`.

## Extended by

- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite**: `boolean`

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

#### Defined in

[index.d.ts:1242](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1242)

***

### compressionMethod?

> `optional` **compressionMethod**: `number`

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

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

#### Defined in

[index.d.ts:1339](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1339)

***

### encrypted?

> `optional` **encrypted**: `boolean`

`true` to write encrypted data when `passThrough` is set to `true`.

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

#### Defined in

[index.d.ts:1234](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1234)

***

### msDosCompatible?

> `optional` **msDosCompatible**: `boolean`

`true` to write [EntryMetaData#externalFileAttribute](EntryMetaData.md#externalfileattribute) in MS-DOS format for folder entries.

#### Default Value

```ts
true
```

#### Defined in

[index.d.ts:1345](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1345)

***

### offset?

> `optional` **offset**: `number`

The offset of the first entry in the zip file.

#### Defined in

[index.d.ts:1381](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1381)

***

### passThrough?

> `optional` **passThrough**: `boolean`

`true` to write the data as-is without compressing it and without crypting it.

#### Defined in

[index.d.ts:1373](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1373)

***

### password?

> `optional` **password**: `string`

The password used to encrypt the content of the entry.

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

#### Defined in

[index.d.ts:1226](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1226)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

#### Defined in

[index.d.ts:1259](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1259)

***

### signal?

> `optional` **signal**: `AbortSignal`

The `AbortSignal` instance used to cancel the compression.

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

#### Defined in

[index.d.ts:1325](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1325)

***

### version?

> `optional` **version**: `number`

The "Version" field.

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

#### Defined in

[index.d.ts:1392](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1392)
