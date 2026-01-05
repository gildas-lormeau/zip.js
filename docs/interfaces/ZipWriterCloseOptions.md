[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterCloseOptions

# Interface: ZipWriterCloseOptions

Defined in: [index.d.ts:1392](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1392)

Represents the options passed to  [ZipWriter#close](../classes/ZipWriter.md#close).

## Extends

- [`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1404](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1404)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### zip64?

> `optional` **zip64**: `boolean`

Defined in: [index.d.ts:1398](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1398)

`true` to use Zip64 to write the entries directory.

#### Default Value

```ts
false
```

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `Promise`\<`void`\> \| `undefined`

Defined in: [index.d.ts:1684](https://github.com/gildas-lormeau/zip.js/blob/98f8d515ae0bf6bf692d46661fe7ba617166246c/index.d.ts#L1684)

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

`Promise`\<`void`\> \| `undefined`

An empty promise or `undefined`.

#### Inherited from

[`EntryOnprogressOptions`](EntryOnprogressOptions.md).[`onprogress`](EntryOnprogressOptions.md#onprogress)
