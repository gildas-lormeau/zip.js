[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterCloseOptions

# Interface: ZipWriterCloseOptions

Defined in: [index.d.ts:2041](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L2041)

Represents the options passed to  [ZipWriter#close](../classes/ZipWriter.md#close).

## Extends

- [`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:2053](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L2053)

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### zip64?

> `optional` **zip64?**: `boolean`

Defined in: [index.d.ts:2047](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L2047)

`true` to use Zip64 to write the entries directory.

#### Default Value

```ts
false
```

## Methods

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2367](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L2367)

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
