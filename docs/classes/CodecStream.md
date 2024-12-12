[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CodecStream

# Class: CodecStream

Represents a class implementing `CompressionStream` or `DecompressionStream` interfaces.

## Extends

- `TransformStream`

## Constructors

### new CodecStream()

> **new CodecStream**(`transformer`?, `writableStrategy`?, `readableStrategy`?): [`CodecStream`](CodecStream.md)

#### Parameters

##### transformer?

`Transformer`\<`any`, `any`\>

##### writableStrategy?

`QueuingStrategy`\<`any`\>

##### readableStrategy?

`QueuingStrategy`\<`any`\>

#### Returns

[`CodecStream`](CodecStream.md)

#### Inherited from

`TransformStream.constructor`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23111

## Properties

### readable

> `readonly` **readable**: `ReadableStream`\<`any`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/TransformStream/readable)

#### Inherited from

`TransformStream.readable`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23104

***

### writable

> `readonly` **writable**: `WritableStream`\<`any`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/TransformStream/writable)

#### Inherited from

`TransformStream.writable`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23106
