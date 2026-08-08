[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryError

# Interface: EntryError

Defined in: [index.d.ts:1299](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1299)

Represents an error raised while processing an entry, decorated with entry context.

## Extends

- `Error`

## Properties

### corruptedEntry?

> `optional` **corruptedEntry?**: `boolean`

Defined in: [index.d.ts:1303](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1303)

`true` if the zip file is corrupted because the entry data could not be written entirely.

***

### entryId?

> `optional` **entryId?**: `number`

Defined in: [index.d.ts:1307](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1307)

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
