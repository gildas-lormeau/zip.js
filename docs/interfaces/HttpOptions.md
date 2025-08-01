[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpOptions

# Interface: HttpOptions

Defined in: [index.d.ts:591](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L591)

Represents the options passed to the constructor of [HttpReader](../classes/HttpReader.md).

## Extends

- [`HttpRangeOptions`](HttpRangeOptions.md)

## Extended by

- [`ZipDirectoryEntryImportHttpOptions`](ZipDirectoryEntryImportHttpOptions.md)

## Properties

### combineSizeEocd?

> `optional` **combineSizeEocd**: `boolean`

Defined in: [index.d.ts:616](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L616)

`true` to use `Range: bytes=-22` on the first request and cache the EOCD, make sure beforehand that the server supports a suffix range request.

#### Default Value

```ts
false
```

***

### forceRangeRequests?

> `optional` **forceRangeRequests**: `boolean`

Defined in: [index.d.ts:603](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L603)

`true` to always use `Range` headers when fetching data.

#### Default Value

```ts
false
```

***

### headers?

> `optional` **headers**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:632](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L632)

The HTTP headers.

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`headers`](HttpRangeOptions.md#headers)

***

### preventHeadRequest?

> `optional` **preventHeadRequest**: `boolean`

Defined in: [index.d.ts:610](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L610)

`true` to prevent using `HEAD` HTTP request in order the get the size of the content.
`false` to explicitly use `HEAD`, this is useful in case of CORS where `Access-Control-Expose-Headers: Content-Range` is not returned by the server.

#### Default Value

```ts
false
```

***

### useRangeHeader?

> `optional` **useRangeHeader**: `boolean`

Defined in: [index.d.ts:597](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L597)

`true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.

#### Default Value

```ts
false
```

***

### useXHR?

> `optional` **useXHR**: `boolean`

Defined in: [index.d.ts:628](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L628)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`useXHR`](HttpRangeOptions.md#usexhr)
