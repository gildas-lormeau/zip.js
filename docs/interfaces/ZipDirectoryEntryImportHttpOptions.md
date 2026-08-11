[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntryImportHttpOptions

# Interface: ZipDirectoryEntryImportHttpOptions

Defined in: [index.d.ts:2721](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L2721)

Represents the options passed to [ZipDirectoryEntry#importHttpContent](../classes/ZipDirectoryEntry.md#importhttpcontent).

## Extends

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`HttpOptions`](HttpOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

Defined in: [index.d.ts:1163](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1163)

`true` to throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the local
file header of the entry disagrees with its central directory record in a way that could make other tools
(e.g. streaming readers based on local file headers) interpret the entry differently. This detects mismatched
filenames, general purpose bit flags (encryption, data descriptor and language encoding flags), compression
methods, signatures and sizes. The extra fields are not compared because the zip specification allows them
to differ.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkAmbiguity`](ZipReaderConstructorOptions.md#checkambiguity)

***

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry?**: `boolean`

Defined in: [index.d.ts:1183](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1183)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkOverlappingEntry`](ZipReaderConstructorOptions.md#checkoverlappingentry)

***

### checkOverlappingEntryOnly?

> `optional` **checkOverlappingEntryOnly?**: `boolean`

Defined in: [index.d.ts:1192](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1192)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`) without trying to read the content of the
entry.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkOverlappingEntryOnly`](ZipReaderConstructorOptions.md#checkoverlappingentryonly)

***

### checkPasswordOnly?

> `optional` **checkPasswordOnly?**: `boolean`

Defined in: [index.d.ts:1169](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1169)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkPasswordOnly`](ZipReaderConstructorOptions.md#checkpasswordonly)

***

### checkResourceChanges?

> `optional` **checkResourceChanges?**: `boolean`

Defined in: [index.d.ts:726](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L726)

`true` to throw an [ERR\_HTTP\_RESOURCE\_CHANGED](../variables/ERR_HTTP_RESOURCE_CHANGED.md) error when the `ETag`, `Last-Modified` or total size headers
returned by a range request differ from the ones returned by the first range request, i.e. when the resource has
been modified while being read. Headers missing from the responses are ignored, note that `Access-Control-Expose-Headers`
must include them when the resource is fetched cross-origin.

#### Default Value

```ts
true
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`checkResourceChanges`](HttpOptions.md#checkresourcechanges)

***

### checkSignature?

> `optional` **checkSignature?**: `boolean`

Defined in: [index.d.ts:1175](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1175)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`checkSignature`](ZipReaderConstructorOptions.md#checksignature)

***

### combineSizeEocd?

> `optional` **combineSizeEocd?**: `boolean`

Defined in: [index.d.ts:693](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L693)

`true` to use `Range: bytes=-22` on the first request and cache the EOCD, make sure beforehand that the server supports a suffix range request.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`combineSizeEocd`](HttpOptions.md#combinesizeeocd)

***

### commentEncoding?

> `optional` **commentEncoding?**: `string`

Defined in: [index.d.ts:1084](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1084)

The encoding of the comment of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`commentEncoding`](ZipReaderConstructorOptions.md#commentencoding)

***

### extractAppendedData?

> `optional` **extractAppendedData?**: `boolean`

Defined in: [index.d.ts:1063](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1063)

`true` to extract the appended data into [ZipReader#appendedData](../classes/ZipReader.md#appendeddata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`extractAppendedData`](ZipReaderConstructorOptions.md#extractappendeddata)

***

### extractPrependedData?

> `optional` **extractPrependedData?**: `boolean`

Defined in: [index.d.ts:1057](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1057)

`true` to extract the prepended data into [ZipReader#prependedData](../classes/ZipReader.md#prependeddata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`extractPrependedData`](ZipReaderConstructorOptions.md#extractprependeddata)

***

### filenameEncoding?

> `optional` **filenameEncoding?**: `string`

Defined in: [index.d.ts:1080](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1080)

The encoding of the filename of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`filenameEncoding`](ZipReaderConstructorOptions.md#filenameencoding)

***

### forceRangeRequests?

> `optional` **forceRangeRequests?**: `boolean`

Defined in: [index.d.ts:680](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L680)

`true` to always use `Range` headers when fetching data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`forceRangeRequests`](HttpOptions.md#forcerangerequests)

***

### headers?

> `optional` **headers?**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:717](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L717)

The HTTP headers.

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`headers`](HttpOptions.md#headers)

***

### maxAppendedDataSize?

> `optional` **maxAppendedDataSize?**: `number`

Defined in: [index.d.ts:1137](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1137)

The maximum number of bytes tolerated after the zip structure before the archive is rejected. Defaults to
`0` when [GetEntriesOptions#strictness](ZipReaderGetEntriesOptions.md#strictness) is `"strict"`, `65535` when it is `"balanced"`, and `Infinity`
when it is `"tolerant"`.

An explicit value takes precedence over the strictness default at every level, so it can loosen `"strict"`
or reintroduce a rejection under `"tolerant"`. It also bounds how far back the end of central directory
record is searched for, so a value smaller than the amount of data actually appended surfaces an
[ERR\_EOCDR\_NOT\_FOUND](../variables/ERR_EOCDR_NOT_FOUND.md) error when the record lies beyond the searched region and an
[ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error otherwise.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`maxAppendedDataSize`](ZipReaderConstructorOptions.md#maxappendeddatasize)

***

### maximumRangeSize?

> `optional` **maximumRangeSize?**: `number`

Defined in: [index.d.ts:742](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L742)

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

[`HttpOptions`](HttpOptions.md).[`maximumRangeSize`](HttpOptions.md#maximumrangesize)

***

### passThrough?

> `optional` **passThrough?**: `boolean`

Defined in: [index.d.ts:1200](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1200)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`passThrough`](ZipReaderConstructorOptions.md#passthrough)

***

### password?

> `optional` **password?**: `string`

Defined in: [index.d.ts:1196](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1196)

The password used to decrypt the content of the entry.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`password`](ZipReaderConstructorOptions.md#password)

***

### preventClose?

> `optional` **preventClose?**: `boolean`

Defined in: [index.d.ts:1214](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1214)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`preventClose`](ZipReaderConstructorOptions.md#preventclose)

***

### preventHeadRequest?

> `optional` **preventHeadRequest?**: `boolean`

Defined in: [index.d.ts:687](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L687)

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

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:1204](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1204)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`rawPassword`](ZipReaderConstructorOptions.md#rawpassword)

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [index.d.ts:1208](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1208)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`signal`](ZipReaderConstructorOptions.md#signal)

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

Defined in: [index.d.ts:1152](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1152)

How tolerant the reader should be when the local file header of an entry disagrees with its central
directory record. `"strict"` throws an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error (equivalent to
[ZipReaderOptions#checkAmbiguity](ZipReaderOptions.md#checkambiguity) set to `true`); `"balanced"` and `"tolerant"` trust the central
directory record.

#### Default Value

```ts
"balanced"
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`strictness`](ZipReaderConstructorOptions.md#strictness)

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

Defined in: [index.d.ts:376](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L376)

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`transferStreams`](ZipReaderConstructorOptions.md#transferstreams)

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

Defined in: [index.d.ts:370](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L370)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`useCompressionStream`](ZipReaderConstructorOptions.md#usecompressionstream)

***

### useRangeHeader?

> `optional` **useRangeHeader?**: `boolean`

Defined in: [index.d.ts:674](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L674)

`true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`useRangeHeader`](HttpOptions.md#userangeheader)

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

Defined in: [index.d.ts:364](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L364)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`useWebWorkers`](ZipReaderConstructorOptions.md#usewebworkers)

***

### useXHR?

> `optional` **useXHR?**: `boolean`

Defined in: [index.d.ts:705](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L705)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```

#### Inherited from

[`HttpOptions`](HttpOptions.md).[`useXHR`](HttpOptions.md#usexhr)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string` \| `undefined`

Defined in: [index.d.ts:1092](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1092)

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`

The raw text value.

##### encoding

`string`

The encoding of the text.

#### Returns

`string` \| `undefined`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.

#### Inherited from

[`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md).[`decodeText`](ZipReaderConstructorOptions.md#decodetext)

***

### fetch()?

> `optional` **fetch**(`input`, `init?`): `Promise`\<`Response`\>

Defined in: [index.d.ts:713](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L713)

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

[`HttpOptions`](HttpOptions.md).[`fetch`](HttpOptions.md#fetch)
