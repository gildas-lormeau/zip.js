[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderOptions

# Interface: ZipReaderOptions

Defined in: [index.d.ts:842](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L842)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md) and [FileEntry#getData](FileEntry.md#getdata).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`EntryGetDataOptions`](EntryGetDataOptions.md)

## Properties

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry**: `boolean`

Defined in: [index.d.ts:862](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L862)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`).

#### Default Value

```ts
false
```

***

### checkOverlappingEntryOnly?

> `optional` **checkOverlappingEntryOnly**: `boolean`

Defined in: [index.d.ts:871](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L871)

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`) without trying to read the content of the
entry.

#### Default Value

```ts
false
```

***

### checkPasswordOnly?

> `optional` **checkPasswordOnly**: `boolean`

Defined in: [index.d.ts:848](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L848)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

***

### checkSignature?

> `optional` **checkSignature**: `boolean`

Defined in: [index.d.ts:854](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L854)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:879](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L879)

`true` to read the data as-is without decompressing it and without decrypting it.

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:875](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L875)

The password used to decrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:893](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L893)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:883](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L883)

The password used to encrypt the content of the entry (raw).

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:887](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L887)

The `AbortSignal` instance used to cancel the decompression.
