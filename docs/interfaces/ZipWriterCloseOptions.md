[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterCloseOptions

# Interface: ZipWriterCloseOptions

Defined in: [index.d.ts:2206](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L2206)

Represents the options passed to  [ZipWriter#close](../classes/ZipWriter.md#close).

## Extends

- [`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:2218](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L2218)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### zip64?

> `optional` **zip64?**: `boolean`

Defined in: [index.d.ts:2212](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L2212)

`true` to use Zip64 to write the entries directory.

#### Default Value

```ts
false
```

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2545](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L2545)

The function called each time an entry is read/written.

#### Parameters

##### progress

`number`

The entry index.

##### total

`number`

The total number of entries.

##### entry

[`EntryMetaData`](EntryMetaData.md)

The entry being read/written.

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryOnprogressOptions`](EntryOnprogressOptions.md).[`onprogress`](EntryOnprogressOptions.md#onprogress)

***

### signCentralDirectory()?

> `optional` **signCentralDirectory**(`directory`): `Uint8Array`\<`ArrayBufferLike`\> \| `PromiseLike`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:2229](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L2229)

The function called for signing the central directory. The returned data (e.g. a PKCS#7 signature computed
over the central directory records) is stored in a digital signature record written between the central
directory and the end of central directory record, and exposed by [ZipReader#digitalSignature](../classes/ZipReader.md#digitalsignature) when
reading the zip file. It must not exceed 64KB, otherwise an [ERR\_INVALID\_SIGNATURE\_DATA](../variables/ERR_INVALID_SIGNATURE_DATA.md) error is
thrown. zip.js stores the data as-is and does not implement the signature computation itself.

#### Parameters

##### directory

`Uint8Array`

The raw data of the central directory records.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `PromiseLike`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The data of the digital signature record.
