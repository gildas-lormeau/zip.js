[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderGetEntriesOptions

# Interface: ZipReaderGetEntriesOptions

Defined in: [index.d.ts:999](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L999)

Represents the options passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extends

- [`GetEntriesOptions`](GetEntriesOptions.md).[`EntryOnprogressOptions`](EntryOnprogressOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

Defined in: [index.d.ts:1033](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1033)

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

Defined in: [index.d.ts:1014](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1014)

The encoding of the comment of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`commentEncoding`](GetEntriesOptions.md#commentencoding)

***

### filenameEncoding?

> `optional` **filenameEncoding?**: `string`

Defined in: [index.d.ts:1010](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1010)

The encoding of the filename of the entry.

#### Inherited from

[`GetEntriesOptions`](GetEntriesOptions.md).[`filenameEncoding`](GetEntriesOptions.md#filenameencoding)

***

### maxAppendedDataSize?

> `optional` **maxAppendedDataSize?**: `number`

Defined in: [index.d.ts:1067](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1067)

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

Defined in: [index.d.ts:1055](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1055)

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

Defined in: [index.d.ts:1022](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1022)

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

### onprogress()?

> `optional` **onprogress**(`progress`, `total`, `entry`): `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:2169](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L2169)

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
