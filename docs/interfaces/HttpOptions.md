[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpOptions

# Interface: HttpOptions

Defined in: [index.d.ts:588](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L588)

Represents the options passed to the constructor of [HttpReader](../classes/HttpReader.md).

## Extends

- [`HttpRangeOptions`](HttpRangeOptions.md)

## Extended by

- [`ZipDirectoryEntryImportHttpOptions`](ZipDirectoryEntryImportHttpOptions.md)

## Properties

### combineSizeEocd?

> `optional` **combineSizeEocd**: `boolean`

Defined in: [index.d.ts:613](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L613)

`true` to use `Range: bytes=-22` on the first request and cache the EOCD, make sure beforehand that the server supports a suffix range request.

#### Default Value

```ts
false
```

***

### forceRangeRequests?

> `optional` **forceRangeRequests**: `boolean`

Defined in: [index.d.ts:600](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L600)

`true` to always use `Range` headers when fetching data.

#### Default Value

```ts
false
```

***

### headers?

> `optional` **headers**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:629](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L629)

The HTTP headers.

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`headers`](HttpRangeOptions.md#headers)

***

### preventHeadRequest?

> `optional` **preventHeadRequest**: `boolean`

Defined in: [index.d.ts:607](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L607)

`true` to prevent using `HEAD` HTTP request in order the get the size of the content.
`false` to explicitly use `HEAD`, this is useful in case of CORS where `Access-Control-Expose-Headers: Content-Range` is not returned by the server.

#### Default Value

```ts
false
```

***

### useRangeHeader?

> `optional` **useRangeHeader**: `boolean`

Defined in: [index.d.ts:594](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L594)

`true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.

#### Default Value

```ts
false
```

***

### useXHR?

> `optional` **useXHR**: `boolean`

Defined in: [index.d.ts:625](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L625)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`useXHR`](HttpRangeOptions.md#usexhr)
