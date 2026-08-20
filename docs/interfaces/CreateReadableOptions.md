[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CreateReadableOptions

# Interface: CreateReadableOptions

Represents the options passed to [Reader#createReadable](../classes/Reader.md#createreadable).

## Properties

### chunkSize?

> `optional` **chunkSize?**: `number`

The size in bytes of the chunks emitted by the default implementation (the `chunkSize` value
of the global configuration by default).

It is normalized like [Configuration#chunkSize](Configuration.md#chunksize).

***

### offset?

> `optional` **offset?**: `number`

The byte offset of the start of the range to read.

#### Default Value

```ts
0
```

***

### size?

> `optional` **size?**: `number`

The size of the range to read in bytes (until the end of the data by default).
