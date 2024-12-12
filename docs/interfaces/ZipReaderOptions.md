[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderOptions

# Interface: ZipReaderOptions

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md) and [Entry#getData](Entry.md#getdata).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`EntryGetDataOptions`](EntryGetDataOptions.md)

## Properties

### checkPasswordOnly?

> `optional` **checkPasswordOnly**: `boolean`

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Defined in

[index.d.ts:808](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L808)

***

### checkSignature?

> `optional` **checkSignature**: `boolean`

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

#### Defined in

[index.d.ts:814](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L814)

***

### passThrough?

> `optional` **passThrough**: `boolean`

`true` to read the data as-is without decompressing it and without decrypting it.

#### Defined in

[index.d.ts:822](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L822)

***

### password?

> `optional` **password**: `string`

The password used to decrypt the content of the entry.

#### Defined in

[index.d.ts:818](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L818)

***

### preventClose?

> `optional` **preventClose**: `boolean`

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [Entry#getData](Entry.md#getdata).

#### Default Value

```ts
false
```

#### Defined in

[index.d.ts:836](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L836)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

#### Defined in

[index.d.ts:826](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L826)

***

### signal?

> `optional` **signal**: `AbortSignal`

The `AbortSignal` instance used to cancel the decompression.

#### Defined in

[index.d.ts:830](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L830)

***

### transferStreams?

> `optional` **transferStreams**: `boolean`

`true` to transfer streams to web workers when decompressing data.

#### Default Value

```ts
true
```

#### Defined in

[index.d.ts:842](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L842)
