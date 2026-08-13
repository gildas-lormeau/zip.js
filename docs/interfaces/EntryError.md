[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryError

# Interface: EntryError

Defined in: [index.d.ts:1532](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L1532)

Represents an error raised while processing an entry, decorated with entry context.

## Extends

- `Error`

## Properties

### corruptedEntry?

> `optional` **corruptedEntry?**: `boolean`

Defined in: [index.d.ts:1536](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L1536)

`true` if the zip file is corrupted because the entry data could not be written entirely.

***

### entryId?

> `optional` **entryId?**: `number`

Defined in: [index.d.ts:1540](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L1540)

The id of the related [ZipEntry](../classes/ZipEntry.md) (filesystem API).

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1074

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`
