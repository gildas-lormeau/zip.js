[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CodecStream

# Class: CodecStream

Defined in: [index.d.ts:312](https://github.com/gildas-lormeau/zip.js/blob/5484569bd1fe28423166efd99cd7ee7147ada8d8/index.d.ts#L312)

Represents a class implementing `CompressionStream` or `DecompressionStream` interfaces.

## Extends

- `TransformStream`

## Constructors

### Constructor

> **new CodecStream**(`transformer?`, `writableStrategy?`, `readableStrategy?`): `CodecStream`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:37120

#### Parameters

##### transformer?

`Transformer`\<`any`, `any`\>

##### writableStrategy?

`QueuingStrategy`\<`any`\>

##### readableStrategy?

`QueuingStrategy`\<`any`\>

#### Returns

`CodecStream`

#### Inherited from

`TransformStream.constructor`

## Properties

### readable

> `readonly` **readable**: `ReadableStream`\<`any`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:37109

The **`readable`** read-only property of the TransformStream interface returns the ReadableStream instance controlled by this TransformStream. This stream emits the transformed output data.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/TransformStream/readable)

#### Inherited from

`TransformStream.readable`

***

### writable

> `readonly` **writable**: `WritableStream`\<`any`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:37115

The **`writable`** read-only property of the TransformStream interface returns the WritableStream instance controlled by this TransformStream. This stream accepts input data that will be transformed and emitted to the readable stream.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/TransformStream/writable)

#### Inherited from

`TransformStream.writable`
