[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntryImportHttpOptions

# Interface: ZipDirectoryEntryImportHttpOptions

Represents the options passed to [ZipDirectoryEntry#importHttpContent](../classes/ZipDirectoryEntry.md#importhttpcontent).

## Extends

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`HttpOptions`](HttpOptions.md)

## Properties

### checkPasswordOnly?

> `optional` **checkPasswordOnly**: `boolean`

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkPasswordOnly`](ZipReaderConstructorOptions.md#checkpasswordonly)

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

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkSignature`](ZipReaderConstructorOptions.md#checksignature)

#### Defined in

[index.d.ts:814](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L814)

***

### combineSizeEocd?

> `optional` **combineSizeEocd**: `boolean`

`true` to use `Range: bytes=-22` on the first request and cache the EOCD, make sure beforehand that the server supports a suffix range request.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`combineSizeEocd`](HttpOptions.md#combinesizeeocd)

#### Defined in

[index.d.ts:453](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L453)

***

### commentEncoding?

> `optional` **commentEncoding**: `string`

The encoding of the comment of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`commentEncoding`](ZipReaderConstructorOptions.md#commentencoding)

#### Defined in

[index.d.ts:788](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L788)

***

### extractAppendedData?

> `optional` **extractAppendedData**: `boolean`

`true` to extract the appended data into [ZipReader#appendedData](../classes/ZipReader.md#appendeddata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`extractAppendedData`](ZipReaderConstructorOptions.md#extractappendeddata)

#### Defined in

[index.d.ts:768](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L768)

***

### extractPrependedData?

> `optional` **extractPrependedData**: `boolean`

`true` to extract the prepended data into [ZipReader#prependedData](../classes/ZipReader.md#prependeddata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`extractPrependedData`](ZipReaderConstructorOptions.md#extractprependeddata)

#### Defined in

[index.d.ts:762](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L762)

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

The encoding of the filename of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`filenameEncoding`](ZipReaderConstructorOptions.md#filenameencoding)

#### Defined in

[index.d.ts:784](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L784)

***

### forceRangeRequests?

> `optional` **forceRangeRequests**: `boolean`

`true` to always use `Range` headers when fetching data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`forceRangeRequests`](HttpOptions.md#forcerangerequests)

#### Defined in

[index.d.ts:440](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L440)

***

### headers?

> `optional` **headers**: `Iterable`\<[`string`, `string`], `any`, `any`\> \| `Map`\<`string`, `string`\>

The HTTP headers.

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`headers`](HttpOptions.md#headers)

#### Defined in

[index.d.ts:469](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L469)

***

### passThrough?

> `optional` **passThrough**: `boolean`

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`passThrough`](ZipReaderConstructorOptions.md#passthrough)

#### Defined in

[index.d.ts:822](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L822)

***

### password?

> `optional` **password**: `string`

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`password`](ZipReaderConstructorOptions.md#password)

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

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`preventClose`](ZipReaderConstructorOptions.md#preventclose)

#### Defined in

[index.d.ts:836](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L836)

***

### preventHeadRequest?

> `optional` **preventHeadRequest**: `boolean`

`true` to prevent using `HEAD` HTTP request in order the get the size of the content.
`false` to explicitly use `HEAD`, this is useful in case of CORS where `Access-Control-Expose-Headers: Content-Range` is not returned by the server.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`preventHeadRequest`](HttpOptions.md#preventheadrequest)

#### Defined in

[index.d.ts:447](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L447)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`rawPassword`](ZipReaderConstructorOptions.md#rawpassword)

#### Defined in

[index.d.ts:826](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L826)

***

### signal?

> `optional` **signal**: `AbortSignal`

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`signal`](ZipReaderConstructorOptions.md#signal)

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

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`transferStreams`](ZipReaderConstructorOptions.md#transferstreams)

#### Defined in

[index.d.ts:842](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L842)

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`useCompressionStream`](ZipReaderConstructorOptions.md#usecompressionstream)

#### Defined in

[index.d.ts:143](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L143)

***

### useRangeHeader?

> `optional` **useRangeHeader**: `boolean`

`true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`useRangeHeader`](HttpOptions.md#userangeheader)

#### Defined in

[index.d.ts:434](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L434)

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`useWebWorkers`](ZipReaderConstructorOptions.md#usewebworkers)

#### Defined in

[index.d.ts:137](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L137)

***

### useXHR?

> `optional` **useXHR**: `boolean`

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`useXHR`](HttpOptions.md#usexhr)

#### Defined in

[index.d.ts:465](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L465)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string`

Decodes the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`\<`ArrayBufferLike`\>

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`string`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`decodeText`](ZipReaderConstructorOptions.md#decodetext)

#### Defined in

[index.d.ts:796](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L796)
