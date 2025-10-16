[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryGetDataCheckPasswordOptions

# Interface: EntryGetDataCheckPasswordOptions

Defined in: [index.d.ts:1154](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1154)

Represents the options passed to [FileEntry#getData](FileEntry.md#getdata) and `{@link ZipFileEntry}.get*`.

## Extends

- [`EntryGetDataOptions`](EntryGetDataOptions.md)

## Properties

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry**: `boolean`

Defined in: [index.d.ts:845](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L845)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`).

#### Default Value

```ts
false
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkOverlappingEntry`](EntryGetDataOptions.md#checkoverlappingentry)

***

### checkOverlappingEntryOnly?

> `optional` **checkOverlappingEntryOnly**: `boolean`

Defined in: [index.d.ts:854](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L854)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`) without trying to read the content of the
entry.

#### Default Value

```ts
false
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkOverlappingEntryOnly`](EntryGetDataOptions.md#checkoverlappingentryonly)

***

### checkPasswordOnly?

> `optional` **checkPasswordOnly**: `boolean`

Defined in: [index.d.ts:831](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L831)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkPasswordOnly`](EntryGetDataOptions.md#checkpasswordonly)

***

### checkSignature?

> `optional` **checkSignature**: `boolean`

Defined in: [index.d.ts:837](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L837)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`checkSignature`](EntryGetDataOptions.md#checksignature)

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:862](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L862)

`true` to read the data as-is without decompressing it and without decrypting it.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`passThrough`](EntryGetDataOptions.md#passthrough)

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:858](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L858)

The password used to decrypt the content of the entry.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`password`](EntryGetDataOptions.md#password)

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:876](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L876)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Default Value

```ts
false
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`preventClose`](EntryGetDataOptions.md#preventclose)

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:866](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L866)

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`rawPassword`](EntryGetDataOptions.md#rawpassword)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:870](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L870)

The `AbortSignal` instance used to cancel the decompression.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`signal`](EntryGetDataOptions.md#signal)

***

### transferStreams?

> `optional` **transferStreams**: `boolean`

Defined in: [index.d.ts:882](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L882)

`true` to transfer streams to web workers when decompressing data.

#### Default Value

```ts
true
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`transferStreams`](EntryGetDataOptions.md#transferstreams)

***

### useCompressionStream?

> `optional` **useCompressionStream**: `boolean`

Defined in: [index.d.ts:284](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L284)

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

#### Default Value

```ts
true
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`useCompressionStream`](EntryGetDataOptions.md#usecompressionstream)

***

### useWebWorkers?

> `optional` **useWebWorkers**: `boolean`

Defined in: [index.d.ts:278](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L278)

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`useWebWorkers`](EntryGetDataOptions.md#usewebworkers)

## Methods

### onend()?

> `optional` **onend**(`computedSize`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1658](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1658)

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`onend`](EntryGetDataOptions.md#onend)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1651](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1651)

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`onprogress`](EntryGetDataOptions.md#onprogress)

***

### onstart()?

> `optional` **onstart**(`total`): `undefined` \| `Promise`\<`void`\>

Defined in: [index.d.ts:1643](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1643)

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`undefined` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryGetDataOptions`](EntryGetDataOptions.md).[`onstart`](EntryGetDataOptions.md#onstart)
