[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterCloseOptions

# Interface: ZipWriterCloseOptions

Defined in: [index.d.ts:1440](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1440)

Represents the options passed to  [ZipWriter#close](../classes/ZipWriter.md#close).

## Extends

- [`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1452](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1452)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### zip64?

> `optional` **zip64**: `boolean`

Defined in: [index.d.ts:1446](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1446)

`true` to use Zip64 to write the entries directory.

#### Default Value

```ts
false
```

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1687](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1687)

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

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryOnprogressOptions`](EntryOnprogressOptions.md).[`onprogress`](EntryOnprogressOptions.md#onprogress)
