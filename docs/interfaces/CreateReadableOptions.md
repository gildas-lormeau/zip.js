[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CreateReadableOptions

# Interface: CreateReadableOptions

Defined in: [index.d.ts:525](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L525)

Represents the options passed to [Reader#createReadable](../classes/Reader.md#createreadable).

## Properties

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [index.d.ts:540](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L540)

The size in bytes of the chunks emitted by the default implementation (the `chunkSize` value
of the global configuration by default).

***

### offset?

> `optional` **offset?**: `number`

Defined in: [index.d.ts:531](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L531)

The byte offset of the start of the range to read.

#### Default Value

```ts
0
```

***

### size?

> `optional` **size?**: `number`

Defined in: [index.d.ts:535](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L535)

The size of the range to read in bytes (until the end of the data by default).
