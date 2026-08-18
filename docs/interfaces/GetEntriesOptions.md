[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / GetEntriesOptions

# Interface: GetEntriesOptions

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md), [ZipReader#getEntries](../classes/ZipReader.md#getentries) and [ZipReader#getEntriesGenerator](../classes/ZipReader.md#getentriesgenerator).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`ZipReaderGetEntriesOptions`](ZipReaderGetEntriesOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

`true` to throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error when the archive could be parsed differently by other
tools. This detects data before or after the zip structure (e.g. a self-extracting archive stub or a
concatenated archive), central directory records not accounted for by the end of central directory record, an
end of central directory record disagreeing with its zip64 counterpart, and duplicate filenames. When reading
the content of an entry, it also validates the local file header against the central directory record (see
[ZipReaderOptions#checkAmbiguity](ZipReaderOptions.md#checkambiguity)).

This is the boolean form of [GetEntriesOptions#strictness](ZipReaderGetEntriesOptions.md#strictness): `true` means `"strict"` and `false` means
any value but `"strict"`. When both options are set, the value passed to [ZipReader#getEntries](../classes/ZipReader.md#getentries) takes
precedence over the value passed to the constructor of [ZipReader](../classes/ZipReader.md), and `strictness` takes precedence
over `checkAmbiguity` when both are set at the same level. `false` downgrades an inherited `"strict"` value
to `"balanced"` and leaves an inherited `"tolerant"` value unchanged.

#### Default Value

```ts
false
```

***

### commentEncoding?

> `optional` **commentEncoding?**: `string`

The encoding of the comment of the entry.

***

### filenameEncoding?

> `optional` **filenameEncoding?**: `string`

The encoding of the filename of the entry.

***

### filenameValidation?

> `optional` **filenameValidation?**: `"balanced"` \| `"strict"` \| `"tolerant"`

How strictly the filename of each entry should be validated. A rejected name throws an
[ERR\_UNSAFE\_FILENAME](../variables/ERR_UNSAFE_FILENAME.md) error carrying the offending name in its `filename` property.

- `"strict"`: reject the names rejected by `"balanced"`, plus the names that do not map cleanly to a file
path, i.e. empty names and names containing a `"."` path component or an empty one (e.g. `"a//b.txt"`).
- `"balanced"`: reject names that would escape the directory they are extracted into, i.e. names containing
a `".."` path component, and absolute names, i.e. names starting with `"/"`, with a drive letter (e.g.
`"C:/file.txt"`) or with two backslashes (UNC paths).
- `"tolerant"`: never reject a name.

A backslash is never interpreted as a path separator: it is a valid filename character on UNIX systems, and
it also occurs as the trail byte of legitimate double-byte filenames (e.g. CP932) decoded with another
charset.

Names are validated, never rewritten, so the filename reported for an entry always matches its central
directory record.

#### Default Value

The value of [GetEntriesOptions#strictness](ZipReaderGetEntriesOptions.md#strictness).

***

### maxAppendedDataSize?

> `optional` **maxAppendedDataSize?**: `number`

The maximum number of bytes tolerated after the zip structure before the archive is rejected. Defaults to
`0` when [GetEntriesOptions#strictness](ZipReaderGetEntriesOptions.md#strictness) is `"strict"`, `65535` when it is `"balanced"`, and `Infinity`
when it is `"tolerant"`.

An explicit value takes precedence over the strictness default at every level, so it can loosen `"strict"`
or reintroduce a rejection under `"tolerant"`. It also bounds how far back the end of central directory
record is searched for, so a value smaller than the amount of data actually appended surfaces an
[ERR\_EOCDR\_NOT\_FOUND](../variables/ERR_EOCDR_NOT_FOUND.md) error when the record lies beyond the searched region and an
[ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error otherwise.

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

How tolerant the reader should be when the archive can be parsed in more than one way.

- `"strict"`: reject anything another tool could interpret differently. The end of central directory
record must sit exactly at the end of the file, no data may precede the zip structure, and the local file
headers must agree with the central directory records. Equivalent to [GetEntriesOptions#checkAmbiguity](ZipReaderGetEntriesOptions.md#checkambiguity)
set to `true`.
- `"balanced"`: select the last end of central directory record whose comment reaches the end of the file
and that points to a central directory, ignore stale records left by in-place updates as well as records
forged inside a comment, and tolerate a self-extracting stub or up to
[GetEntriesOptions#maxAppendedDataSize](#maxappendeddatasize) bytes of appended data. Throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md)
error only when two or more records reach the end of the file and each points to a central directory, which
cannot be disambiguated. A record that reaches the end of the file but points to no central directory (an
empty archive) is only selected when no record points to one.
- `"tolerant"`: never reject a parseable archive, except when [GetEntriesOptions#maxAppendedDataSize](#maxappendeddatasize)
is set explicitly and exceeded; recover by selecting the last end of central directory record that reaches
the end of the file and points to a central directory (or, failing that, the last one that reaches the end
of the file).

#### Default Value

```ts
"balanced"
```

## Methods

### decodeText()?

> `optional` **decodeText**(`value`, `encoding`, `type`): `string` \| `undefined`

The function called for decoding the filename and the comment of the entry.

#### Parameters

##### value

`Uint8Array`

The raw text value.

##### encoding

`string`

The encoding of the text.

##### type

`"filename"` \| `"comment"`

The type of the decoded text, `"filename"` or `"comment"`.

#### Returns

`string` \| `undefined`

The decoded text value or `undefined` if the raw text value should be decoded by zip.js.

***

### decryptCentralDirectory()?

> `optional` **decryptCentralDirectory**(`data`, `encryptionInfo?`): `Uint8Array`\<`ArrayBufferLike`\> \| `PromiseLike`\<`Uint8Array`\<`ArrayBufferLike`\>\>

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

***

### normalizeFilename()?

> `optional` **normalizeFilename**(`filename`): `string` \| `undefined`

The function called for normalizing the filename of each entry, e.g. to repair the names rejected by
[GetEntriesOptions#filenameValidation](#filenamevalidation).

It is called with the decoded filename, after [GetEntriesOptions#decodeText](#decodetext) and before the name is
validated, so a name it fails to repair is still rejected. The returned name becomes the name of the entry:
it is used to detect directory entries by their trailing `"/"`, and to detect duplicate filenames when
[GetEntriesOptions#checkAmbiguity](ZipReaderGetEntriesOptions.md#checkambiguity) is set, so two names normalized into the same name are reported as
an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error instead of silently shadowing each other. The raw filename remains
available in [EntryMetaData#rawFilename](EntryMetaData.md#rawfilename).

#### Parameters

##### filename

`string`

The decoded filename.

#### Returns

`string` \| `undefined`

The normalized filename or `undefined` to keep the decoded filename.
