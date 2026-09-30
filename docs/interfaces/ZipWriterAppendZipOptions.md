[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterAppendZipOptions

# Interface: ZipWriterAppendZipOptions

Represents the options passed to [ZipWriter#appendZip](../classes/ZipWriter.md#appendzip).

## Properties

### filter?

> `optional` **filter?**: (`entry`) => `boolean` \| `Promise`\<`boolean`\>

Selects the entries of the zip file to copy: the function is called once per entry, in the order of the
central directory, and the entry is copied when it returns (or resolves to) `true`.

#### Parameters

##### entry

[`Entry`](../type-aliases/Entry.md)

The entry read from the zip file.

#### Returns

`boolean` \| `Promise`\<`boolean`\>

`true` to copy the entry.

#### Remarks

When the option is set, the data of the zip file is copied entry by entry and the entries left out leave no
bytes behind in the output, unlike [ZipWriter#remove](../classes/ZipWriter.md#remove), which drops an entry from the central directory
after its data has been written. The bytes of the zip file outside its entries, e.g. a self-extracting stub
before the first entry, are not copied either. Without the option, the data of the zip file is copied as a
whole. The duplicate filename check applies to the entries kept only, so an entry can be replaced by
leaving it out and adding its replacement with [ZipWriter#add](../classes/ZipWriter.md#add).
