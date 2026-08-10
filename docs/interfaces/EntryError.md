[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryError

# Interface: EntryError

Defined in: [index.d.ts:1361](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L1361)

Represents an error raised while processing an entry, decorated with entry context.

## Extends

- `Error`

## Properties

### corruptedEntry?

> `optional` **corruptedEntry?**: `boolean`

Defined in: [index.d.ts:1365](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L1365)

`true` if the zip file is corrupted because the entry data could not be written entirely.

***

### entryId?

> `optional` **entryId?**: `number`

Defined in: [index.d.ts:1369](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L1369)

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
