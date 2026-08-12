[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpRangeOptions

# Interface: HttpRangeOptions

Defined in: [index.d.ts:708](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L708)

Represents options passed to the constructor of [HttpRangeReader](../classes/HttpRangeReader.md) and [HttpReader](../classes/HttpReader.md).

## Extended by

- [`HttpOptions`](HttpOptions.md)

## Properties

### checkResourceChanges?

> `optional` **checkResourceChanges?**: `boolean`

Defined in: [index.d.ts:735](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L735)

`true` to throw an [ERR\_HTTP\_RESOURCE\_CHANGED](../variables/ERR_HTTP_RESOURCE_CHANGED.md) error when the `ETag`, `Last-Modified` or total size headers
returned by a range request differ from the ones returned by the first range request, i.e. when the resource has
been modified while being read. Headers missing from the responses are ignored, note that `Access-Control-Expose-Headers`
must include them when the resource is fetched cross-origin.

#### Default Value

```ts
true
```

***

### headers?

> `optional` **headers?**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:726](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L726)

The HTTP headers.

***

### maximumRangeSize?

> `optional` **maximumRangeSize?**: `number`

Defined in: [index.d.ts:751](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L751)

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

***

### useXHR?

> `optional` **useXHR?**: `boolean`

Defined in: [index.d.ts:714](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L714)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

## Methods

### fetch()?

> `optional` **fetch**(`input`, `init?`): `Promise`\<`Response`\>

Defined in: [index.d.ts:722](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L722)

The function used to fetch the data. It takes precedence over [HttpRangeOptions#useXHR](#usexhr)
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
