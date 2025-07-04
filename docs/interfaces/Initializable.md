[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Initializable

# Interface: Initializable

Defined in: [index.d.ts:447](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L447)

Represents an instance used to read or write unknown type of data.

zip.js can handle multiple types of data thanks to a generic API. This feature is based on 2 abstract constructors: [Reader](../classes/Reader.md) and [Writer](../classes/Writer.md).
The classes inheriting from [Reader](../classes/Reader.md) help to read data from a source of data. The classes inheriting from [Writer](../classes/Writer.md) help to write data into a destination.

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:451](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L451)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>
