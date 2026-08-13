[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderGetEntriesOptions

# Interface: ZipReaderGetEntriesOptions

Defined in: [index.d.ts:1183](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1183)

Represents the options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extends

- [`GetEntriesOptions`](GetEntriesOptions.md).[`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

Defined in: [index.d.ts:1217](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1217)

`true` to throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error when the archive could be parsed differently by other
tools. This detects data before or after the zip structure (e.g. a self-extracting archive stub or a
concatenated archive), central directory records not accounted for by the end of central directory record, an
end of central directory record disagreeing with its zip64 counterpart, and duplicate filenames. When reading
the content of an entry, it also validates the local file header against the central directory record (see
[ZipReaderOptions#checkAmbiguity](ZipReaderOptions.md#checkambiguity)).

#### Default Value

```ts
false
```

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`checkAmbiguity`](GetEntriesOptions.md#checkambiguity)

***

### commentEncoding?

> `optional` **commentEncoding?**: `string`

Defined in: [index.d.ts:1198](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1198)

The encoding of the comment of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`commentEncoding`](GetEntriesOptions.md#commentencoding)

***

### filenameEncoding?

> `optional` **filenameEncoding?**: `string`

Defined in: [index.d.ts:1194](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1194)

The encoding of the filename of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameEncoding`](GetEntriesOptions.md#filenameencoding)

***

### maxAppendedDataSize?

> `optional` **maxAppendedDataSize?**: `number`

Defined in: [index.d.ts:1251](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1251)

The maximum number of bytes tolerated after the zip structure before the archive is rejected. Defaults to
`0` when [GetEntriesOptions#strictness](#strictness) is `"strict"`, `65535` when it is `"balanced"`, and `Infinity`
when it is `"tolerant"`.

An explicit value takes precedence over the strictness default at every level, so it can loosen `"strict"`
or reintroduce a rejection under `"tolerant"`. It also bounds how far back the end of central directory
record is searched for, so a value smaller than the amount of data actually appended surfaces an
[ERR\_EOCDR\_NOT\_FOUND](../variables/ERR_EOCDR_NOT_FOUND.md) error when the record lies beyond the searched region and an
[ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error otherwise.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`maxAppendedDataSize`](GetEntriesOptions.md#maxappendeddatasize)

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

Defined in: [index.d.ts:1239](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1239)

How tolerant the reader should be when the archive can be parsed in more than one way.

- `"strict"`: reject anything another tool could interpret differently. The end of central directory
record must sit exactly at the end of the file, no data may precede the zip structure, and the local file
headers must agree with the central directory records. Equivalent to [GetEntriesOptions#checkAmbiguity](#checkambiguity)
set to `true`.
- `"balanced"`: select the last end of central directory record whose comment reaches the end of the file
and that points to a central directory, ignore stale records left by in-place updates as well as records
forged inside a comment, and tolerate a self-extracting stub or up to
[GetEntriesOptions#maxAppendedDataSize](GetEntriesOptions.md#maxappendeddatasize) bytes of appended data. Throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md)
error only when two or more records reach the end of the file and each points to a central directory, which
cannot be disambiguated. A record that reaches the end of the file but points to no central directory (an
empty archive) is only selected when no record points to one.
- `"tolerant"`: never reject a parseable archive, except when [GetEntriesOptions#maxAppendedDataSize](GetEntriesOptions.md#maxappendeddatasize)
is set explicitly and exceeded; recover by selecting the last end of central directory record that reaches
the end of the file and points to a central directory (or, failing that, the last one that reaches the end
of the file).

#### Default Value

```ts
"balanced"
```

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`strictness`](GetEntriesOptions.md#strictness)

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`): `string` \| `undefined`

Defined in: [index.d.ts:1206](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1206)

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

[`GetEntriesOptions`](GetEntriesOptions.md).[`decodeText`](GetEntriesOptions.md#decodetext)

***

### decryptCentralDirectory()?

> `optional` **decryptCentralDirectory**(`data`, `encryptionInfo?`): `Uint8Array`\<`ArrayBufferLike`\> \| `PromiseLike`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:1264](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1264)

The function called for decrypting the central directory when it is encrypted (see the Strong Encryption
Specification in the ZIP format specification). Without this function, reading such an archive throws an
[ERR\_ENCRYPTED\_CENTRAL\_DIRECTORY](../variables/ERR_ENCRYPTED_CENTRAL_DIRECTORY.md) error. zip.js provides the encrypted data and the related metadata
but does not implement the decryption itself.

#### Parameters

##### data

`Uint8Array`

The raw data stored in place of the central directory, i.e. the decryption header followed by
the encrypted (and possibly compressed) central directory, as stored in the zip file.

##### encryptionInfo?

[`DirectoryEncryptionInfo`](DirectoryEncryptionInfo.md)

The encryption metadata read from the Zip64 end of central directory record, or
`undefined` if the zip file does not contain a version 2 record.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `PromiseLike`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The decrypted and decompressed central directory records.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`decryptCentralDirectory`](GetEntriesOptions.md#decryptcentraldirectory)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2545](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L2545)

The function called each time an entry is read/written.

#### Parameters

##### progress

`number`

The entry index.

##### total

`number`

The total number of entries.

##### entry

[`EntryMetaData`](EntryMetaData.md)

The entry being read/written.

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryOnprogressOptions`](EntryOnprogressOptions.md).[`onprogress`](EntryOnprogressOptions.md#onprogress)
