[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterConstructorOptions

# Interface: ZipWriterConstructorOptions

Defined in: [index.d.ts:1235](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1235)

Represents options passed to the constructor of [ZipWriter](../classes/ZipWriter.md), [ZipWriter#add](../classes/ZipWriter.md#add) and `{@link ZipDirectoryEntry}#export*`.

## Extended by

- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite**: `boolean`

Defined in: [index.d.ts:1265](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1265)

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

***

### compressionMethod?

> `optional` **compressionMethod**: `number`

Defined in: [index.d.ts:1411](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1411)

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1317](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1317)

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### dataDescriptor?

> `optional` **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1359](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1359)

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](ZipWriterConstructorOptions.md#bufferedwrite) option  will automatically be set to `true`.

#### Default Value

```ts
true
```

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature**: `boolean`

Defined in: [index.d.ts:1365](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1365)

`true` to add the signature of the data descriptor.

#### Default Value

```ts
false
```

***

### encrypted?

> `optional` **encrypted**: `boolean`

Defined in: [index.d.ts:1403](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1403)

`true` to write encrypted data when `passThrough` is set to `true`.

***

### encryptionStrength?

> `optional` **encryptionStrength**: `1` \| `2` \| `3`

Defined in: [index.d.ts:1291](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1291)

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

Defined in: [index.d.ts:1325](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1325)

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed November 31, 2107 and the maximum accuracy is 2 seconds.

#### Default Value

```ts
true
```

***

### externalFileAttributes?

> `optional` **externalFileAttributes**: `number`

Defined in: [index.d.ts:1377](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1377)

The external file attribute.

#### Default Value

```ts
0
```

***

### internalFileAttributes?

> `optional` **internalFileAttributes**: `number`

Defined in: [index.d.ts:1383](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1383)

The internal file attribute.

#### Default Value

```ts
0
```

***

### keepOrder?

> `optional` **keepOrder**: `boolean`

Defined in: [index.d.ts:1274](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1274)

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

Defined in: [index.d.ts:1309](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1309)

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

#### Default Value

```ts
The current date.
```

***

### lastModDate?

> `optional` **lastModDate**: `Date`

Defined in: [index.d.ts:1301](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1301)

The last modification date.

#### Default Value

```ts
The current date.
```

***

### level?

> `optional` **level**: `number`

Defined in: [index.d.ts:1257](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1257)

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

#### Default Value

```ts
5
```

***

### msDosCompatible?

> `optional` **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1371](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1371)

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

#### Default Value

```ts
false
```

***

### offset?

> `optional` **offset**: `number`

Defined in: [index.d.ts:1407](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1407)

The offset of the first entry in the zip file.

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:1399](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1399)

`true` to write the data as-is without compressing it and without crypting it.

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:1278](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1278)

The password used to encrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1249](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1249)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`

Defined in: [index.d.ts:1282](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1282)

The password used to encrypt the content of the entry (raw).

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:1295](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1295)

The `AbortSignal` instance used to cancel the compression.

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile**: `boolean`

Defined in: [index.d.ts:1389](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1389)

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

***

### usdz?

> `optional` **usdz**: `boolean`

Defined in: [index.d.ts:1395](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1395)

`true`to produce zip files compatible with the USDZ specification.

#### Default Value

```ts
false
```

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames**: `boolean`

Defined in: [index.d.ts:1351](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1351)

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D - Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this does not ensure that the file names are in the correct encoding.

#### Default Value

```ts
true
```

***

### version?

> `optional` **version**: `number`

Defined in: [index.d.ts:1337](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1337)

The "Version" field.

***

### versionMadeBy?

> `optional` **versionMadeBy**: `number`

Defined in: [index.d.ts:1343](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1343)

The "Version made by" field.

#### Default Value

```ts
20
```

***

### zip64?

> `optional` **zip64**: `boolean`

Defined in: [index.d.ts:1243](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1243)

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

***

### zipCrypto?

> `optional` **zipCrypto**: `boolean`

Defined in: [index.d.ts:1333](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1333)

`true` to use the ZipCrypto algorithm to encrypt the content of the entry.

It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.

#### Default Value

```ts
false
```

## Methods

### encodeText()?

> `optional` **encodeText**(`text`): `Uint8Array`

Defined in: [index.d.ts:1418](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L1418)

The function called for encoding the filename and the comment of the entry.

#### Parameters

##### text

`string`

The text to encode.

#### Returns

`Uint8Array`

The encoded text or `undefined` if the text should be encoded by zip.js.
