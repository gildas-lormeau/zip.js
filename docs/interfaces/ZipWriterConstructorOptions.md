[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterConstructorOptions

# Interface: ZipWriterConstructorOptions

Defined in: [index.d.ts:1458](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1458)

Represents options passed to the constructor of [ZipWriter](../classes/ZipWriter.md), [ZipWriter#add](../classes/ZipWriter.md#add) and `{@link ZipDirectoryEntry}#export*`.

## Extended by

- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite**: `boolean`

Defined in: [index.d.ts:1488](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1488)

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

***

### compressionMethod?

> `optional` **compressionMethod**: `number`

Defined in: [index.d.ts:1637](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1637)

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1540](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1540)

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### dataDescriptor?

> `optional` **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1585](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1585)

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option  will automatically be
set to `true`. It will be automatically set to `false` when it is `undefined` and the
[ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option is set to `true`, or ` when the
{@link ZipWriterConstructorOptions#zipCrypto} option is set to `true`. Otherwise, the default value is `true`.

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature**: `boolean`

Defined in: [index.d.ts:1591](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1591)

`true` to add the signature of the data descriptor.

#### Default Value

```ts
false
```

***

### encrypted?

> `optional` **encrypted**: `boolean`

Defined in: [index.d.ts:1629](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1629)

`true` to write encrypted data when `passThrough` is set to `true`.

***

### encryptionStrength?

> `optional` **encryptionStrength**: `2` \| `1` \| `3`

Defined in: [index.d.ts:1514](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1514)

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

Defined in: [index.d.ts:1548](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1548)

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed November 31, 2107 and the maximum accuracy is 2 seconds.

#### Default Value

```ts
true
```

***

### externalFileAttributes?

> `optional` **externalFileAttributes**: `number`

Defined in: [index.d.ts:1603](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1603)

The external file attribute.

#### Default Value

```ts
0
```

***

### internalFileAttributes?

> `optional` **internalFileAttributes**: `number`

Defined in: [index.d.ts:1609](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1609)

The internal file attribute.

#### Default Value

```ts
0
```

***

### keepOrder?

> `optional` **keepOrder**: `boolean`

Defined in: [index.d.ts:1497](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1497)

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

Defined in: [index.d.ts:1532](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1532)

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### lastModDate?

> `optional` **lastModDate**: `Date`

Defined in: [index.d.ts:1524](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1524)

The last modification date.

#### Default Value

```ts
The current date.
```

***

### level?

> `optional` **level**: `number`

Defined in: [index.d.ts:1480](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1480)

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

#### Default Value

```ts
5
```

***

### msDosCompatible?

> `optional` **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1597](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1597)

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

#### Default Value

```ts
false
```

***

### offset?

> `optional` **offset**: `number`

Defined in: [index.d.ts:1633](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1633)

The offset of the first entry in the zip file.

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:1625](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1625)

`true` to write the data as-is without compressing it and without crypting it.

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:1501](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1501)

The password used to encrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1472](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1472)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1505](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1505)

The password used to encrypt the content of the entry (raw).

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:1518](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1518)

The `AbortSignal` instance used to cancel the compression.

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile**: `boolean`

Defined in: [index.d.ts:1615](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1615)

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

***

### usdz?

> `optional` **usdz**: `boolean`

Defined in: [index.d.ts:1621](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1621)

`true`to produce zip files compatible with the USDZ specification.

#### Default Value

```ts
false
```

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames**: `boolean`

Defined in: [index.d.ts:1576](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1576)

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D -
Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this does not ensure that the file names are in the correct encoding.

#### Default Value

```ts
true
```

***

### version?

> `optional` **version**: `number`

Defined in: [index.d.ts:1561](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1561)

The "Version" field.

***

### versionMadeBy?

> `optional` **versionMadeBy**: `number`

Defined in: [index.d.ts:1567](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1567)

The "Version made by" field.

#### Default Value

```ts
20
```

***

### zip64?

> `optional` **zip64**: `boolean`

Defined in: [index.d.ts:1466](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1466)

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

***

### zipCrypto?

> `optional` **zipCrypto**: `boolean`

Defined in: [index.d.ts:1557](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1557)

`true` to use the ZipCrypto algorithm to encrypt the content of the entry. Setting it to `true` will also
set the [ZipWriterConstructorOptions#dataDescriptor](#datadescriptor) to `true`.

It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.

#### Default Value

```ts
false
```

## Methods

### encodeText()?

> `optional` **encodeText**(`text`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1644](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1644)

The function called for encoding the filename and the comment of the entry.

#### Parameters

##### text

`string`

The text to encode.

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

The encoded text or `undefined` if the text should be encoded by zip.js.
