[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderConstructorOptions

# Interface: ZipReaderConstructorOptions

Defined in: [index.d.ts:916](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L916)

Represents the options passed to the constructor of [ZipReader](../classes/ZipReader.md), and `{@link ZipDirectory}#import*`.

## Extends

- [`ZipReaderOptions`](ZipReaderOptions.md).[`GetEntriesOptions`](GetEntriesOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`ZipDirectoryEntryImportHttpOptions`](ZipDirectoryEntryImportHttpOptions.md)

## Properties

### checkPasswordOnly?

> `optional` **checkPasswordOnly**: `boolean`

Defined in: [index.d.ts:972](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L972)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkPasswordOnly`](ZipReaderOptions.md#checkpasswordonly)

***

### checkSignature?

> `optional` **checkSignature**: `boolean`

Defined in: [index.d.ts:978](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L978)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkSignature`](ZipReaderOptions.md#checksignature)

***

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:952](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L952)

The encoding of the comment of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`commentEncoding`](GetEntriesOptions.md#commentencoding)

***

### extractAppendedData?

> `optional` **extractAppendedData**: `boolean`

Defined in: [index.d.ts:931](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L931)

`true` to extract the appended data into [ZipReader#appendedData](../classes/ZipReader.md#appendeddata).

#### Default Value

```ts
false
```

***

### extractPrependedData?

> `optional` **extractPrependedData**: `boolean`

Defined in: [index.d.ts:925](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L925)

`true` to extract the prepended data into [ZipReader#prependedData](../classes/ZipReader.md#prependeddata).

#### Default Value

```ts
false
```

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:948](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L948)

The encoding of the filename of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameEncoding`](GetEntriesOptions.md#filenameencoding)

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:986](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L986)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`passThrough`](ZipReaderOptions.md#passthrough)

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:982](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L982)

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`password`](ZipReaderOptions.md#password)

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1000](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1000)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`preventClose`](ZipReaderOptions.md#preventclose)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:990](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L990)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`rawPassword`](ZipReaderOptions.md#rawpassword)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:994](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L994)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`signal`](ZipReaderOptions.md#signal)

***

### transferStreams?

> `optional` **transferStreams**: `boolean`

Defined in: [index.d.ts:1006](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L1006)

`true` to transfer streams to web workers when decompressing data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`transferStreams`](ZipReaderOptions.md#transferstreams)

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:303](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L303)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

Defined in: [index.d.ts:297](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L297)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `undefined` \| `string`

Defined in: [index.d.ts:960](https://github.com/gildas-lormeau/zip.js/blob/71d0cfc32ac4da8ab21f65731cd6bc5601268bd6/index.d.ts#L960)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`undefined` \| `string`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`decodeText`](GetEntriesOptions.md#decodetext)
