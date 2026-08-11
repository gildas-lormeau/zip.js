[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CreateReadableOptions

# Interface: CreateReadableOptions

Defined in: [index.d.ts:596](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L596)

Represents the options passed to [Reader#createReadable](../classes/Reader.md#createreadable).

## Properties

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [index.d.ts:611](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L611)

The size in bytes of the chunks emitted by the default implementation (the `chunkSize` value
of the global configuration by default).

***

### offset?

> `optional` **offset?**: `number`

Defined in: [index.d.ts:602](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L602)

The byte offset of the start of the range to read.

#### Default Value

```ts
0
```

***

### size?

> `optional` **size?**: `number`

Defined in: [index.d.ts:606](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L606)

The size of the range to read in bytes (until the end of the data by default).
