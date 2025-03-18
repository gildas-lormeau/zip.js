[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpOptions

# Interface: HttpOptions

Defined in: [index.d.ts:428](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L428)

Represents the options passed to the constructor of [HttpReader](../classes/HttpReader.md).

## Extends

- [`HttpRangeOptions`](HttpRangeOptions.md)

## Extended by

- [`ZipDirectoryEntryImportHttpOptions`](ZipDirectoryEntryImportHttpOptions.md)

## Properties

### combineSizeEocd?

> `optional` **combineSizeEocd**: `boolean`

Defined in: [index.d.ts:453](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L453)

`true` to use `Range: bytes=-22` on the first request and cache the EOCD, make sure beforehand that the server supports a suffix range request.

#### Default Value

```ts
false
```

***

### forceRangeRequests?

> `optional` **forceRangeRequests**: `boolean`

Defined in: [index.d.ts:440](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L440)

`true` to always use `Range` headers when fetching data.

#### Default Value

```ts
false
```

***

### headers?

> `optional` **headers**: `Iterable`\<\[`string`, `string`\]\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:469](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L469)

The HTTP headers.

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`headers`](HttpRangeOptions.md#headers)

***

### preventHeadRequest?

> `optional` **preventHeadRequest**: `boolean`

Defined in: [index.d.ts:447](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L447)

`true` to prevent using `HEAD` HTTP request in order the get the size of the content.
`false` to explicitly use `HEAD`, this is useful in case of CORS where `Access-Control-Expose-Headers: Content-Range` is not returned by the server.

#### Default Value

```ts
false
```

***

### useRangeHeader?

> `optional` **useRangeHeader**: `boolean`

Defined in: [index.d.ts:434](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L434)

`true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.

#### Default Value

```ts
false
```

***

### useXHR?

> `optional` **useXHR**: `boolean`

Defined in: [index.d.ts:465](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L465)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`useXHR`](HttpRangeOptions.md#usexhr)
