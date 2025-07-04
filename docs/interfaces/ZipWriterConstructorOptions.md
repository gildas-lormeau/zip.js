[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterConstructorOptions

# Interface: ZipWriterConstructorOptions

Defined in: [index.d.ts:1418](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1418)

Represents options passed to the constructor of [ZipWriter](../classes/ZipWriter.md), [ZipWriter#add](../classes/ZipWriter.md#add) and `{@link ZipDirectoryEntry}#export*`.

## Extended by

- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite**: `boolean`

Defined in: [index.d.ts:1448](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1448)

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

***

### compressionMethod?

> `optional` **compressionMethod**: `number`

Defined in: [index.d.ts:1594](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1594)

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1500](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1500)

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### dataDescriptor?

> `optional` **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1542](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1542)

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option  will automatically be set to `true`.

#### Default Value

```ts
true
```

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature**: `boolean`

Defined in: [index.d.ts:1548](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1548)

`true` to add the signature of the data descriptor.

#### Default Value

```ts
false
```

***

### encrypted?

> `optional` **encrypted**: `boolean`

Defined in: [index.d.ts:1586](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1586)

`true` to write encrypted data when `passThrough` is set to `true`.

***

### encryptionStrength?

> `optional` **encryptionStrength**: `2` \| `1` \| `3`

Defined in: [index.d.ts:1474](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1474)

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

Defined in: [index.d.ts:1508](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1508)

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed November 31, 2107 and the maximum accuracy is 2 seconds.

#### Default Value

```ts
true
```

***

### externalFileAttributes?

> `optional` **externalFileAttributes**: `number`

Defined in: [index.d.ts:1560](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1560)

The external file attribute.

#### Default Value

```ts
0
```

***

### internalFileAttributes?

> `optional` **internalFileAttributes**: `number`

Defined in: [index.d.ts:1566](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1566)

The internal file attribute.

#### Default Value

```ts
0
```

***

### keepOrder?

> `optional` **keepOrder**: `boolean`

Defined in: [index.d.ts:1457](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1457)

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

Defined in: [index.d.ts:1492](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1492)

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### lastModDate?

> `optional` **lastModDate**: `Date`

Defined in: [index.d.ts:1484](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1484)

The last modification date.

#### Default Value

```ts
The current date.
```

***

### level?

> `optional` **level**: `number`

Defined in: [index.d.ts:1440](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1440)

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

#### Default Value

```ts
5
```

***

### msDosCompatible?

> `optional` **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1554](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1554)

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

#### Default Value

```ts
false
```

***

### offset?

> `optional` **offset**: `number`

Defined in: [index.d.ts:1590](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1590)

The offset of the first entry in the zip file.

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:1582](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1582)

`true` to write the data as-is without compressing it and without crypting it.

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:1461](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1461)

The password used to encrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1432](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1432)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1465](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1465)

The password used to encrypt the content of the entry (raw).

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:1478](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1478)

The `AbortSignal` instance used to cancel the compression.

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile**: `boolean`

Defined in: [index.d.ts:1572](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1572)

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

***

### usdz?

> `optional` **usdz**: `boolean`

Defined in: [index.d.ts:1578](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1578)

`true`to produce zip files compatible with the USDZ specification.

#### Default Value

```ts
false
```

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames**: `boolean`

Defined in: [index.d.ts:1534](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1534)

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D - Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this does not ensure that the file names are in the correct encoding.

#### Default Value

```ts
true
```

***

### version?

> `optional` **version**: `number`

Defined in: [index.d.ts:1520](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1520)

The "Version" field.

***

### versionMadeBy?

> `optional` **versionMadeBy**: `number`

Defined in: [index.d.ts:1526](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1526)

The "Version made by" field.

#### Default Value

```ts
20
```

***

### zip64?

> `optional` **zip64**: `boolean`

Defined in: [index.d.ts:1426](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1426)

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

***

### zipCrypto?

> `optional` **zipCrypto**: `boolean`

Defined in: [index.d.ts:1516](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1516)

`true` to use the ZipCrypto algorithm to encrypt the content of the entry.

It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.

#### Default Value

```ts
false
```

## Methods

### encodeText()?

> `optional` **encodeText**(`text`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1601](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L1601)

The function called for encoding the filename and the comment of the entry.

#### Parameters

##### text

`string`

The text to encode.

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

The encoded text or `undefined` if the text should be encoded by zip.js.
