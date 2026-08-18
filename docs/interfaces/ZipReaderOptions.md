[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipReaderOptions

# Interface: ZipReaderOptions

Represents options passed to the constructor of [ZipReader](../classes/ZipReader.md) and [FileEntry#getData](FileEntry.md#getdata).

## Extended by

- [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)
- [`EntryGetDataOptions`](EntryGetDataOptions.md)

## Properties

### checkAmbiguity?

> `optional` **checkAmbiguity?**: `boolean`

`true` to throw an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the local
file header of the entry disagrees with its central directory record in a way that could make other tools
(e.g. streaming readers based on local file headers) interpret the entry differently. This detects mismatched
filenames, general purpose bit flags (encryption, data descriptor and language encoding flags), compression
methods, CRC-32 checksums and sizes. The extra fields are not compared because the zip specification allows
them to differ.

This is the boolean form of [ZipReaderOptions#strictness](#strictness): `true` means `"strict"` and `false` means
any value but `"strict"`. When both options are set, the value passed to [FileEntry#getData](FileEntry.md#getdata) takes
precedence over the value passed to the constructor of [ZipReader](../classes/ZipReader.md), and `strictness` takes precedence
over `checkAmbiguity` when both are set at the same level. `false` downgrades an inherited `"strict"` value
to `"balanced"` and leaves an inherited `"tolerant"` value unchanged.

#### Default Value

```ts
false
```

***

### checkAuthenticationCode?

> `optional` **checkAuthenticationCode?**: `boolean`

`true` to verify the authentication code of entries encrypted with AES. The verification detects encrypted
data tampered or corrupted after the encryption.

#### Default Value

```ts
true
```

***

### checkCrc32?

> `optional` **checkCrc32?**: `boolean`

`true` to verify the CRC-32 checksum of the entry against the value stored in the zip file. The verification
is run on the decompressed data and covers the whole read pipeline. It also applies to entries encrypted with
AES in AE-1 format. It is skipped for entries in AE-2 format because they store a zeroed CRC-32 value.

#### Default Value

```ts
false
```

***

### checkLocalDirectory?

> `optional` **checkLocalDirectory?**: `boolean`

`true` to validate the local file header of the entry against its central directory record when calling
[FileEntry#getData](FileEntry.md#getdata), `false` to skip that validation. This is the entry-level half of
[ZipReaderOptions#checkAmbiguity](#checkambiguity), exposed on its own so it can be enabled without the archive-level
checks and disabled without giving up the rest of [ZipReaderOptions#strictness](#strictness). It is the only way to
validate the local file headers of a self-extracting archive, since
[GetEntriesOptions#checkAmbiguity](ZipReaderGetEntriesOptions.md#checkambiguity) rejects prepended data outright.

`true` compares the filename as well, like [ZipReaderOptions#strictness](#strictness) set to `"strict"`; `false`
compares nothing, like `"tolerant"`. An explicit value takes precedence over the strictness default at
every level.

#### Default Value

`true` when [ZipReaderOptions#strictness](#strictness) is `"strict"` or `"balanced"`, `false` when
it is `"tolerant"`.

***

### checkOverlappingEntry?

> `optional` **checkOverlappingEntry?**: `boolean`

`true` to throw an [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) error when calling [FileEntry#getData](FileEntry.md#getdata) if the entry
 overlaps with another entry on which [FileEntry#getData](FileEntry.md#getdata) has already been called (with the option
`checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`).

#### Default Value

```ts
false
```

***

### checkOverlappingEntryOnly?

> `optional` **checkOverlappingEntryOnly?**: `boolean`

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

> `optional` **checkPasswordOnly?**: `boolean`

`true` to check only if the password is valid.

#### Default Value

```ts
false
```

***

### ~~checkSignature?~~

> `optional` **checkSignature?**: `boolean`

`true` to check the CRC-32 checksum of the entry.

#### Deprecated

Use [ZipReaderOptions#checkCrc32](#checkcrc32) instead.

#### Default Value

```ts
false
```

***

### passThrough?

> `optional` **passThrough?**: `boolean`

`true` to read the data as-is without decompressing it and without decrypting it.

***

### password?

> `optional` **password?**: `string`

The password used to decrypt the content of the entry.

***

### preventClose?

> `optional` **preventClose?**: `boolean`

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable) when calling [FileEntry#getData](FileEntry.md#getdata).

#### Remarks

It only applies to the writable owned by the caller. It is ignored by the [Writer](../classes/Writer.md) instances
returning the written data, such as [BlobWriter](../classes/BlobWriter.md) or [TextWriter](../classes/TextWriter.md), whose writable is
created internally and must be closed for [Writer#getData](../classes/Writer.md#getdata) to resolve.

#### Default Value

```ts
false
```

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

***

### signal?

> `optional` **signal?**: `AbortSignal`

The `AbortSignal` instance used to cancel the decompression.

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

How tolerant the reader should be when the local file header of an entry disagrees with its central
directory record. Any difference throws an [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error.

- `"strict"`: compare the filename, the general purpose bit flag, the compression method, the CRC-32
checksum and the sizes.
- `"balanced"`: compare everything except the filename.
- `"tolerant"`: compare nothing and trust the central directory record.

Every field except the filename is read from the local file header anyway, to locate the entry data, so
the comparison `"balanced"` performs reads no additional bytes. Comparing the filename reads the filename
bytes as well, which costs one extra read per entry whenever the local file header carries no extra field
— the common case in practice. Use [ZipReaderOptions#checkLocalDirectory](#checklocaldirectory) to request or suppress the
whole comparison explicitly.

#### Default Value

```ts
"balanced"
```
