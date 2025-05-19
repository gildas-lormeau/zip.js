[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryGetDataOptions

# Interface: EntryGetDataOptions

Defined in: [index.d.ts:1171](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1171)

Represents the options passed to [Entry#getData](Entry.md#getdata) and `{@link ZipFileEntry}.get*`.

## Extends

- [`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`ZipReaderOptions`](ZipReaderOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`EntryGetDataCheckPasswordOptions`](EntryGetDataCheckPasswordOptions.md)

## Properties

### checkPasswordOnly?

> `optional` **checkPasswordOnly**: `boolean`

Defined in: [index.d.ts:968](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L968)

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

Defined in: [index.d.ts:974](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L974)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`checkSignature`](ZipReaderOptions.md#checksignature)

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:982](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L982)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`passThrough`](ZipReaderOptions.md#passthrough)

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:978](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L978)

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`password`](ZipReaderOptions.md#password)

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:996](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L996)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [Entry#getData](Entry.md#getdata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`preventClose`](ZipReaderOptions.md#preventclose)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`

Defined in: [index.d.ts:986](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L986)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`rawPassword`](ZipReaderOptions.md#rawpassword)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:990](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L990)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderOptions`](ZipReaderOptions.md).[`signal`](ZipReaderOptions.md#signal)

***

### transferStreams?

> `optional` **transferStreams**: `boolean`

Defined in: [index.d.ts:1002](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1002)

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

Defined in: [index.d.ts:303](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L303)

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

Defined in: [index.d.ts:297](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L297)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `Promise`\<`void`\>

Defined in: [index.d.ts:1606](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1606)

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onend`](EntryDataOnprogressOptions.md#onend)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `Promise`\<`void`\>

Defined in: [index.d.ts:1599](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1599)

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onprogress`](EntryDataOnprogressOptions.md#onprogress)

***

### onstart()?

> `optional` **onstart**(`total`): `Promise`\<`void`\>

Defined in: [index.d.ts:1591](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L1591)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onstart`](EntryDataOnprogressOptions.md#onstart)
