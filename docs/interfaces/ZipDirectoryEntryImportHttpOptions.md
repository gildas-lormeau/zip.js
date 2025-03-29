[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntryImportHttpOptions

# Interface: ZipDirectoryEntryImportHttpOptions

Defined in: [index.d.ts:1905](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L1905)

Represents the options passed to [ZipDirectoryEntry#importHttpContent](../classes/ZipDirectoryEntry.md#importhttpcontent).

## Extends

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`HttpOptions`](HttpOptions.md)

## Properties

### checkPasswordOnly?

> `optional` **checkPasswordOnly**: `boolean`

Defined in: [index.d.ts:803](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L803)

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

Defined in: [index.d.ts:809](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L809)

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

Defined in: [index.d.ts:448](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L448)

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

Defined in: [index.d.ts:783](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L783)

The encoding of the comment of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`commentEncoding`](ZipReaderConstructorOptions.md#commentencoding)

***

### extractAppendedData?

> `optional` **extractAppendedData**: `boolean`

Defined in: [index.d.ts:763](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L763)

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

Defined in: [index.d.ts:757](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L757)

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

Defined in: [index.d.ts:779](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L779)

The encoding of the filename of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`filenameEncoding`](ZipReaderConstructorOptions.md#filenameencoding)

***

### forceRangeRequests?

> `optional` **forceRangeRequests**: `boolean`

Defined in: [index.d.ts:435](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L435)

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

Defined in: [index.d.ts:464](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L464)

The HTTP headers.

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`headers`](HttpOptions.md#headers)

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:817](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L817)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`passThrough`](ZipReaderConstructorOptions.md#passthrough)

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:813](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L813)

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`password`](ZipReaderConstructorOptions.md#password)

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:831](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L831)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [Entry#getData](Entry.md#getdata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`preventClose`](ZipReaderConstructorOptions.md#preventclose)

***

### preventHeadRequest?

> `optional` **preventHeadRequest**: `boolean`

Defined in: [index.d.ts:442](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L442)

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

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:821](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L821)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`rawPassword`](ZipReaderConstructorOptions.md#rawpassword)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:825](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L825)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`signal`](ZipReaderConstructorOptions.md#signal)

***

### transferStreams?

> `optional` **transferStreams**: `boolean`

Defined in: [index.d.ts:837](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L837)

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

Defined in: [index.d.ts:143](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L143)

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

Defined in: [index.d.ts:429](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L429)

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

Defined in: [index.d.ts:137](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L137)

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

Defined in: [index.d.ts:460](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L460)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`useXHR`](HttpOptions.md#usexhr)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string`

Defined in: [index.d.ts:791](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L791)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`\<`ArrayBuffer`\>

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`string`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`decodeText`](ZipReaderConstructorOptions.md#decodetext)
