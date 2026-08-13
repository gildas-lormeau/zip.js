[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpOptions

# Interface: HttpOptions

Defined in: [index.d.ts:767](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L767)

Represents the options passed to the constructor of [HttpReader](../classes/HttpReader.md).

## Extends

- [`HttpRangeOptions`](HttpRangeOptions.md)

## Extended by

- [`ZipDirectoryEntryImportHttpOptions`](ZipDirectoryEntryImportHttpOptions.md)

## Properties

### checkResourceChanges?

> `optional` **checkResourceChanges?**: `boolean`

Defined in: [index.d.ts:825](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L825)

`true` to throw an [ERR\_HTTP\_RESOURCE\_CHANGED](../variables/ERR_HTTP_RESOURCE_CHANGED.md) error when the `ETag`, `Last-Modified` or total size headers
returned by a range request differ from the ones returned by the first range request, i.e. when the resource has
been modified while being read. Headers missing from the responses are ignored, note that `Access-Control-Expose-Headers`
must include them when the resource is fetched cross-origin.

#### Default Value

```ts
true
```

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`checkResourceChanges`](HttpRangeOptions.md#checkresourcechanges)

***

### combineSizeEocd?

> `optional` **combineSizeEocd?**: `boolean`

Defined in: [index.d.ts:792](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L792)

`true` to use `Range: bytes=-22` on the first request and cache the EOCD, make sure beforehand that the server supports a suffix range request.

#### Default Value

```ts
false
```

***

### forceRangeRequests?

> `optional` **forceRangeRequests?**: `boolean`

Defined in: [index.d.ts:779](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L779)

`true` to always use `Range` headers when fetching data.

#### Default Value

```ts
false
```

***

### headers?

> `optional` **headers?**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:816](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L816)

The HTTP headers.

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`headers`](HttpRangeOptions.md#headers)

***

### maximumRangeSize?

> `optional` **maximumRangeSize?**: `number`

Defined in: [index.d.ts:841](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L841)

The maximum size in bytes of the range requests sent to read the data of an entry. The data is
read with as many range requests as necessary, each response body being streamed, so that the
size of a request never depends on the size of the entry.

#### Remarks

Because response bodies are streamed with backpressure, this value does not bound how much data
is buffered in memory; it bounds the byte span, and therefore the lifetime, of each individual
range request. Smaller windows keep each request short-lived, which avoids the idle or duration
timeouts enforced by servers, CDNs and proxies when a slow consumer holds a connection open, and
avoids relying on the server honoring very large ranges. Set it to `Infinity` to disable windowing
and read each entry with a single range request covering its whole remaining length.

#### Default Value

```ts
16777216
```

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`maximumRangeSize`](HttpRangeOptions.md#maximumrangesize)

***

### preventHeadRequest?

> `optional` **preventHeadRequest?**: `boolean`

Defined in: [index.d.ts:786](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L786)

`true` to prevent using `HEAD` HTTP request in order the get the size of the content.
`false` to explicitly use `HEAD`, this is useful in case of CORS where `Access-Control-Expose-Headers: Content-Range` is not returned by the server.

#### Default Value

```ts
false
```

***

### useRangeHeader?

> `optional` **useRangeHeader?**: `boolean`

Defined in: [index.d.ts:773](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L773)

`true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.

#### Default Value

```ts
false
```

***

### useXHR?

> `optional` **useXHR?**: `boolean`

Defined in: [index.d.ts:804](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L804)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`useXHR`](HttpRangeOptions.md#usexhr)

## Methods

### fetch()?

> `optional` **fetch**(`input`, `init?`): `Promise`\<`Response`\>

Defined in: [index.d.ts:812](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L812)

The function used to fetch the data. It takes precedence over [HttpRangeOptions#useXHR](HttpRangeOptions.md#usexhr)
when set. The returned object must expose the `status`, `statusText` and `headers` properties,
and the `arrayBuffer()` method of the `Response` class.

#### Parameters

##### input

`string`

##### init?

`RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Default Value

`fetch`

#### Inherited from

[`HttpRangeOptions`](HttpRangeOptions.md).[`fetch`](HttpRangeOptions.md#fetch)
