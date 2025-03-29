[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CodecStream

# Class: CodecStream

Defined in: [index.d.ts:271](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L271)

Represents a class implementing `CompressionStream` or `DecompressionStream` interfaces.

## Extends

- `TransformStream`

## Constructors

### Constructor

> **new CodecStream**(`transformer`?, `writableStrategy`?, `readableStrategy`?): `CodecStream`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:23731

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

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:23724

[MDN Reference](https://developer.mozilla.org/docs/Web/API/TransformStream/readable)

#### Inherited from

`TransformStream.readable`

***

### writable

> `readonly` **writable**: `WritableStream`\<`any`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:23726

[MDN Reference](https://developer.mozilla.org/docs/Web/API/TransformStream/writable)

#### Inherited from

`TransformStream.writable`
