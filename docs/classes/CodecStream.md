[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CodecStream

# Class: CodecStream

Defined in: [index.d.ts:271](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L271)

Represents a class implementing `CompressionStream` or `DecompressionStream` interfaces.

## Extends

- `TransformStream`

## Constructors

### new CodecStream()

> **new CodecStream**(`transformer`?, `writableStrategy`?, `readableStrategy`?): [`CodecStream`](CodecStream.md)

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:23111

#### Parameters

##### transformer?

`Transformer`

##### writableStrategy?

`QueuingStrategy`

##### readableStrategy?

`QueuingStrategy`

#### Returns

[`CodecStream`](CodecStream.md)

#### Inherited from

`TransformStream.constructor`

## Properties

### readable

> `readonly` **readable**: `ReadableStream`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:23104

[MDN Reference](https://developer.mozilla.org/docs/Web/API/TransformStream/readable)

#### Inherited from

`TransformStream.readable`

***

### writable

> `readonly` **writable**: `WritableStream`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:23106

[MDN Reference](https://developer.mozilla.org/docs/Web/API/TransformStream/writable)

#### Inherited from

`TransformStream.writable`
