[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterCloseOptions

# Interface: ZipWriterCloseOptions

Defined in: [index.d.ts:1866](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1866)

Represents the options passed to  [ZipWriter#close](../classes/ZipWriter.md#close).

## Extends

- [`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:1878](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1878)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### zip64?

> `optional` **zip64?**: `boolean`

Defined in: [index.d.ts:1872](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1872)

`true` to use Zip64 to write the entries directory.

#### Default Value

```ts
false
```

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2169](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2169)

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
