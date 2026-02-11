[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Initializable

# Interface: Initializable

Defined in: [index.d.ts:328](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L328)

Represents an instance used to read or write unknown type of data.

zip.js can handle multiple types of data thanks to a generic API. This feature is based on 2 abstract constructors: [Reader](../classes/Reader.md) and [Writer](../classes/Writer.md).
The classes inheriting from [Reader](../classes/Reader.md) help to read data from a source of data. The classes inheriting from [Writer](../classes/Writer.md) help to write data into a destination.

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:332](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L332)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>
