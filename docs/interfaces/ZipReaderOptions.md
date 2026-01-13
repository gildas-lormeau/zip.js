[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderOptions

# Interface: ZipReaderOptions

Defined in: [index.d.ts:836](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L836)

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md) and [FileEntry#getData](FileEntry.md#getdata).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`EntryGetDataOptions`](EntryGetDataOptions.md)

## Properties

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry**: `boolean`

Defined in: [index.d.ts:856](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L856)

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

Defined in: [index.d.ts:865](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L865)

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

Defined in: [index.d.ts:842](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L842)

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

***

### checkSignature?

> `optional` **checkSignature**: `boolean`

Defined in: [index.d.ts:848](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L848)

`true` to check the signature of the entry.

#### Default Value

```ts
false
```

***

### passThrough?

> `optional` **passThrough**: `boolean`

Defined in: [index.d.ts:873](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L873)

`true` to read the data as-is without decompressing it and without decrypting it.

***

### password?

> `optional` **password**: `string`

Defined in: [index.d.ts:869](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L869)

The password used to decrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose**: `boolean`

Defined in: [index.d.ts:887](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L887)

`true` to prevent closing of [Writer#writable](../classes/Writer.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [index.d.ts:877](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L877)

The password used to encrypt the content of the entry (raw).

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [index.d.ts:881](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L881)

The `AbortSignal` instance used to cancel the decompression.

***

### transferStreams?

> `optional` **transferStreams**: `boolean`

Defined in: [index.d.ts:893](https://github.com/gildas-lormeau/zip.js/blob/b0d2edeb9f9c810cf7711e73ade564e6a0c204f6/index.d.ts#L893)

`true` to transfer streams to web workers when decompressing data.

#### Default Value

```ts
true
```
