[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntryImportHttpOptions

# Interface: ZipDirectoryEntryImportHttpOptions

Defined in: [index.d.ts:2142](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L2142)

Represents the options passed to [ZipDirectoryEntry#importHttpContent](../classes/ZipDirectoryEntry.md#importhttpcontent).

## Extends

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`HttpOptions`](HttpOptions.md)

## Properties

### checkPasswordOnly?

> `optional` **checkPasswordOnly**: `boolean`

Defined in: [index.d.ts:974](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L974)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkPasswordOnly`](ZipReaderConstructorOptions.md#checkpasswordonly)

***

### checkSignature?

> `optional` **checkSignature**: `boolean`

Defined in: [index.d.ts:980](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L980)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkSignature`](ZipReaderConstructorOptions.md#checksignature)

***

### combineSizeEocd?

> `optional` **combineSizeEocd**: `boolean`

Defined in: [index.d.ts:616](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L616)

`true` to use `Range: bytes=-22` on the first request and cache the EOCD, make sure beforehand that the server supports a suffix range request.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`combineSizeEocd`](HttpOptions.md#combinesizeeocd)

***

### commentEncoding?

> `optional` **commentEncoding**: `string`

Defined in: [index.d.ts:954](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L954)

The encoding of the comment of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`commentEncoding`](ZipReaderConstructorOptions.md#commentencoding)

***

### extractAppendedData?

> `optional` **extractAppendedData**: `boolean`

Defined in: [index.d.ts:933](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L933)

`true` to extract the appended data into [ZipReader#appendedData](../classes/ZipReader.md#appendeddata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`extractAppendedData`](ZipReaderConstructorOptions.md#extractappendeddata)

***

### extractPrependedData?

> `optional` **extractPrependedData**: `boolean`

Defined in: [index.d.ts:927](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L927)

`true` to extract the prepended data into [ZipReader#prependedData](../classes/ZipReader.md#prependeddata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`extractPrependedData`](ZipReaderConstructorOptions.md#extractprependeddata)

***

### filenameEncoding?

> `optional` **filenameEncoding**: `string`

Defined in: [index.d.ts:950](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L950)

The encoding of the filename of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`filenameEncoding`](ZipReaderConstructorOptions.md#filenameencoding)

***

### forceRangeRequests?

> `optional` **forceRangeRequests**: `boolean`

Defined in: [index.d.ts:603](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L603)

`true` to always use `Range` headers when fetching data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`forceRangeRequests`](HttpOptions.md#forcerangerequests)

***

### headers?

> `optional` **headers**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:632](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L632)

The HTTP headers.

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`headers`](HttpOptions.md#headers)

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:988](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L988)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`passThrough`](ZipReaderConstructorOptions.md#passthrough)

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:984](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L984)

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`password`](ZipReaderConstructorOptions.md#password)

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:1002](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1002)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`preventClose`](ZipReaderConstructorOptions.md#preventclose)

***

### preventHeadRequest?

> `optional` **preventHeadRequest**: `boolean`

Defined in: [index.d.ts:610](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L610)

`true` to prevent using `HEAD` HTTP request in order the get the size of the content.
`false` to explicitly use `HEAD`, this is useful in case of CORS where `Access-Control-Expose-Headers: Content-Range` is not returned by the server.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`preventHeadRequest`](HttpOptions.md#preventheadrequest)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:992](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L992)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`rawPassword`](ZipReaderConstructorOptions.md#rawpassword)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:996](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L996)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`signal`](ZipReaderConstructorOptions.md#signal)

***

### transferStreams?

> `optional` **transferStreams**: `boolean`

Defined in: [index.d.ts:1008](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1008)

`true` to transfer streams to web workers when decompressing data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`transferStreams`](ZipReaderConstructorOptions.md#transferstreams)

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:303](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L303)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`useCompressionStream`](ZipReaderConstructorOptions.md#usecompressionstream)

***

### useRangeHeader?

> `optional` **useRangeHeader**: `boolean`

Defined in: [index.d.ts:597](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L597)

`true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`useRangeHeader`](HttpOptions.md#userangeheader)

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

Defined in: [index.d.ts:297](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L297)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`useWebWorkers`](ZipReaderConstructorOptions.md#usewebworkers)

***

### useXHR?

> `optional` **useXHR**: `boolean`

Defined in: [index.d.ts:628](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L628)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`useXHR`](HttpOptions.md#usexhr)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `undefined` \| `string`

Defined in: [index.d.ts:962](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L962)

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

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`decodeText`](ZipReaderConstructorOptions.md#decodetext)
