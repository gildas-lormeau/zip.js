[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterConstructorOptions

# Interface: ZipWriterConstructorOptions

Represents options passed to the constructor of [ZipWriter](../classes/ZipWriter.md), [ZipWriter#add](../classes/ZipWriter.md#add) and `{@link ZipDirectoryEntry}#export*`.

## Extends

- [`WorkerConfiguration`](WorkerConfiguration.md)

## Extended by

- [`ZipWriterAddDataOptions`](ZipWriterAddDataOptions.md)
- [`ZipDirectoryEntryExportOptions`](ZipDirectoryEntryExportOptions.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite?**: `boolean`

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

***

### createTempStream?

> `optional` **createTempStream?**: () => [`TempStream`](TempStream.md) \| `Promise`\<[`TempStream`](TempStream.md)\>

An async factory function that returns a `TransformStream`-like object (`{ writable, readable }`) used as a temporary buffer when entries are written in parallel.

When provided, this replaces the default in-memory `TransformStream` buffer, allowing data to be stored externally (e.g. filesystem, OPFS, network).
The `writable` side receives compressed entry data. The `readable` side is consumed when the entry is replayed into the final zip stream.
The optional `dispose` method is called once the entry has been processed (on success, error, or abort) so a resource-backed buffer can release its resource.

See [createOPFSTempStream](../functions/createOPFSTempStream.md) for a ready-made OPFS-backed implementation, [createSyncAccessHandleTempStream](../functions/createSyncAccessHandleTempStream.md) for a faster worker-only variant, and [createBlobTempStream](../functions/createBlobTempStream.md) for a `Blob`-backed one.

#### Returns

[`TempStream`](TempStream.md) \| `Promise`\<[`TempStream`](TempStream.md)\>

#### Remarks

The `readable` side is consumed only once the `writable` side has been closed, since the local
header written before it holds the size and the CRC-32 of the entry. The object must therefore be able to
hold a whole entry, either by buffering it like the default
`new TransformStream(undefined, undefined, { highWaterMark: Infinity })` does, or by draining it like the
three implementations above do. A factory returning `new TransformStream()` deadlocks instead, its default
queuing strategy holding a single chunk.

***

### creationDate?

> `optional` **creationDate?**: `Date`

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

Unlike [ZipWriterConstructorOptions#lastModDate](#lastmoddate), it has no default: the date is written only when the
option is set, so that the entries do not carry a meaningless creation time.

***

### dataDescriptor?

> `optional` **dataDescriptor?**: `boolean`

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option will automatically be
set to `true`. It will be automatically set to `false` when it is `undefined` and the
[ZipWriterConstructorOptions#bufferedWrite](#bufferedwrite) option is set to `true`, or when the entry is a folder
or an empty entry stored without compression or encryption, since the header can then carry the sizes and
the CRC-32 directly. It will be automatically set to `true` when the
[ZipWriterConstructorOptions#zipCrypto](#zipcrypto) option is set to `true`. Otherwise, the default value is `true`.

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature?**: `boolean`

`true` to add the signature of the data descriptor.

#### Default Value

```ts
true
```

***

### encrypted?

> `optional` **encrypted?**: `boolean`

`true` to write encrypted data when `passThrough` is set to `true`.

***

### encryptionStrength?

> `optional` **encryptionStrength?**: `2` \| `1` \| `3`

The encryption strength (AES):
- 1: 128-bit encryption key
- 2: 192-bit encryption key
- 3: 256-bit encryption key

#### Default Value

```ts
3
```

***

### extendedTimestamp?

> `optional` **extendedTimestamp?**: `boolean`

`true` to store extended timestamp extra fields.

When set to `false`, the maximum last modification date cannot exceed December 31, 2107 and the maximum accuracy is 2 seconds, dates being truncated to the whole second and odd seconds rounded up to the next even second.

#### Default Value

```ts
true
```

***

### ~~externalFileAttribute?~~

> `optional` **externalFileAttribute?**: `number`

The external file attribute.

#### Deprecated

Use [ZipWriterConstructorOptions#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes?

> `optional` **externalFileAttributes?**: `number`

The external file attribute.

When set explicitly, the value is written verbatim (including `0`), unless `unixMode`, `setuid`, `setgid`
or `sticky` is also set, in which case these options override the upper 16 bits while the lower 16 bits
are preserved. When omitted, the value is derived from the other options (e.g. the MS-DOS directory
attribute for folder entries, Unix default permissions when `msDosCompatible` is `false`).

***

### gid?

> `optional` **gid?**: `number`

The Unix group id to write in the Unix extra field or as part of the external attributes.

***

### ~~internalFileAttribute?~~

> `optional` **internalFileAttribute?**: `number`

The internal file attribute.

#### Deprecated

Use [ZipWriterConstructorOptions#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes?

> `optional` **internalFileAttributes?**: `number`

The internal file attribute.

#### Default Value

```ts
0
```

***

### keepOrder?

> `optional` **keepOrder?**: `boolean`

`true` to keep the order of the entry physically in the zip file.

When set to `true`, the use of web workers will be improved.

#### Default Value

```ts
true
```

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

Unlike [ZipWriterConstructorOptions#lastModDate](#lastmoddate), it has no default: the date is written only when the
option is set, so that the entries do not carry a meaningless access time.

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

The last modification date.

#### Remarks

This option and the two below must be `Date` instances: a timestamp expressed in milliseconds, e.g.
[File#lastModified](https://developer.mozilla.org/en-US/docs/Web/API/File/lastModified), and an invalid `Date` are both rejected with [ERR\_INVALID\_DATE](../variables/ERR_INVALID_DATE.md). An
invalid `Date` used to be written as an entry carrying no timestamp at all.

#### Default Value

```ts
The current date.
```

***

### level?

> `optional` **level?**: `number`

The level of compression.

The minimum value is 0 and means that no compression is applied. The maximum value is 9.

The native API `CompressionStream` does not support compression levels. Any value other than 6,
its de facto level, disables `useCompressionStream` and compresses the data with the embedded
implementation instead. Note that the compressed data produced at a given level can still vary
between platforms. Set `useCompressionStream` to `false` to get deterministic output across
platforms.

#### Default Value

```ts
6
```

***

### msdosAttributes?

> `optional` **msdosAttributes?**: `object`

When provided, MS-DOS attribute flags (boolean object) to write into external file attributes low byte.

#### archive?

> `optional` **archive?**: `boolean`

#### directory?

> `optional` **directory?**: `boolean`

#### hidden?

> `optional` **hidden?**: `boolean`

#### readOnly?

> `optional` **readOnly?**: `boolean`

#### system?

> `optional` **system?**: `boolean`

#### Remarks

See [ZipWriterConstructorOptions#msdosAttributesRaw](#msdosattributesraw) for the platform this option selects and for
the Unix metadata it leaves out of the entry.

***

### msdosAttributesRaw?

> `optional` **msdosAttributesRaw?**: `number`

When provided, the low 8-bit MS-DOS attributes to write into external file attributes.
Must be an integer between 0 and 255.

#### Remarks

Setting this option or [ZipWriterConstructorOptions#msdosAttributes](#msdosattributes) selects the MS-DOS platform for
the entry exactly as [ZipWriterConstructorOptions#msDosCompatible](#msdoscompatible) does, and overrides that option
when it is explicitly set to `false`. [EntryMetaData#versionMadeBy](EntryMetaData.md#versionmadeby) then loses its Unix upper byte
and no Unix mode is written, so the `0o100644` of a file entry and the `0o040755` of a folder entry are
lost. What counts is that the option is provided, not its value: `0` and `{}` trigger it too.

Setting any Unix metadata option, i.e. [ZipWriterConstructorOptions#uid](#uid),
[ZipWriterConstructorOptions#gid](#gid), [ZipWriterConstructorOptions#unixMode](#unixmode),
[ZipWriterConstructorOptions#unixExtraFieldType](#unixextrafieldtype) or [ZipWriterAddDataOptions#executable](ZipWriterAddDataOptions.md#executable),
takes precedence and keeps the Unix attributes, with the MS-DOS attributes written into the low byte.
[ZipWriterConstructorOptions#externalFileAttributes](#externalfileattributes) is preserved as well, although the entry still
declares the MS-DOS platform.

***

### msDosCompatible?

> `optional` **msDosCompatible?**: `boolean`

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

It also selects the MS-DOS platform for [ZipWriterConstructorOptions#versionMadeBy](#versionmadeby) and leaves the Unix
attributes out of the entries. Setting any Unix metadata option, e.g.
[ZipWriterConstructorOptions#unixMode](#unixmode) or [ZipWriterAddDataOptions#executable](ZipWriterAddDataOptions.md#executable), turns it back off, and setting
[ZipWriterConstructorOptions#msdosAttributesRaw](#msdosattributesraw) or [ZipWriterConstructorOptions#msdosAttributes](#msdosattributes)
turns it on, overriding an explicit `false`.

MS-DOS era extractors, e.g. PKUNZIP 2.04g, only honor the directory attribute of entries declaring the
MS-DOS platform. Without this option, they extract folder entries as zero-length files, which can then
prevent extracting the files stored below the folders.

#### Default Value

```ts
false
```

***

### ntfsTimestamp?

> `optional` **ntfsTimestamp?**: `boolean`

`true` to always store the NTFS extra field, `false` to never store it.

By default, the NTFS extra field is stored only when it preserves information the extended timestamp extra field cannot
represent: a last modification date outside its supported range, or explicit [ZipWriterConstructorOptions#lastAccessDate](#lastaccessdate)
or [ZipWriterConstructorOptions#creationDate](#creationdate) values.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](#extendedtimestamp) option is set to `false`.

***

### offset?

> `optional` **offset?**: `number`

The offset of the first entry in the zip file.

#### Remarks

When the option is undefined, the offset is the number of bytes already written into the
destination, read from its `size` property, see [WritableWriter#size](WritableWriter.md#size). A `size` property
set on a `WritableStream` instance passed directly to the [ZipWriter](../classes/ZipWriter.md) constructor is
also read, for backward compatibility. When the option is set, the bytes between the size of
the destination and the offset are assumed to exist in the final zip file without being
written, e.g. when writing one part of a zip file assembled by the caller.

The option is only read when the [ZipWriter](../classes/ZipWriter.md) is created, e.g. by
[ZipDirectoryEntry#exportZip](../classes/ZipDirectoryEntry.md#exportzip); a value passed to [ZipWriter#add](../classes/ZipWriter.md#add) is ignored.

***

### passThrough?

> `optional` **passThrough?**: `boolean`

`true` to write the data as-is without compressing it and without crypting it.

#### Remarks

The data is never compressed, so the [ZipWriterConstructorOptions#level](#level) option does not apply and is
ignored. The [ZipWriterAddDataOptions#compressionMethod](#compressionmethod) option selects no codec either, it declares
how the data is already compressed and is written as-is in the entry headers. It must be set, otherwise an
[ERR\_UNDEFINED\_COMPRESSION\_METHOD](../variables/ERR_UNDEFINED_COMPRESSION_METHOD.md) error is thrown. The entries with no content, e.g. the
directories, ignore this option entirely. Setting the [ZipWriterConstructorOptions#password](#password) or the
[ZipWriterConstructorOptions#rawPassword](#rawpassword) option throws an
[ERR\_UNSUPPORTED\_ENCRYPTION\_PASS\_THROUGH](../variables/ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH.md) error, unless the
[ZipWriterConstructorOptions#encrypted](#encrypted) option is set to `true` to declare that the data is already
encrypted. In that case the password encrypts the other entries only, and the data written as-is keeps the
password it was encrypted with, which is not verified.

When the data was encrypted with ZipCrypto, the verification byte stored in the encrypted data depends on
the last modification date of the source entry if the data descriptor is used. The
[ZipWriterConstructorOptions#dataDescriptor](#datadescriptor) and [ZipWriterConstructorOptions#rawLastModDate](#rawlastmoddate)
values of the source entry must then be forwarded, otherwise reading the copied entry fails with an
[ERR\_INVALID\_PASSWORD](../variables/ERR_INVALID_PASSWORD.md) error. The filesystem API forwards them when exporting entries and throws an
[ERR\_ZIP\_CRYPTO\_LAST\_MOD\_DATE](../variables/ERR_ZIP_CRYPTO_LAST_MOD_DATE.md) error if the date is overridden.

***

### password?

> `optional` **password?**: `string`

The password used to encrypt the content of the entry.

#### Remarks

When a password is set and the [ZipWriterConstructorOptions#zipCrypto](#zipcrypto) option is not set to `true`, the
entry is encrypted in AES AE-2 format: the CRC-32 checksum of the content is stored as `0` so that the zip
file reveals no information about the encrypted content. A stored checksum would allow an attacker to verify
guessed content without knowing the password. The integrity of the data is guaranteed by the authentication
code instead.

***

### preventClose?

> `optional` **preventClose?**: `boolean`

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

***

### rawLastModDate?

> `optional` **rawLastModDate?**: `number`

The last modification date, as its raw 32-bit MS-DOS date and time value.

#### Remarks

The value is written verbatim into the local and central directory headers and takes precedence over
[ZipWriterConstructorOptions#lastModDate](#lastmoddate), which still fills the extended timestamp and NTFS extra
fields. The filesystem API sets it when exporting entries with [ZipReaderOptions#passThrough](ZipReaderOptions.md#passthrough) set in
[ZipDirectoryEntryExportOptions#readerOptions](ZipDirectoryEntryExportOptions.md#readeroptions), so that the entries copied as-is keep the exact date
and time of the source zip file.

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

***

### setgid?

> `optional` **setgid?**: `boolean`

`true` to set the setgid bit when writing the Unix mode.

***

### setuid?

> `optional` **setuid?**: `boolean`

`true` to set the setuid bit when writing the Unix mode.

***

### signal?

> `optional` **signal?**: `AbortSignal`

The `AbortSignal` instance used to cancel the compression.

***

### sticky?

> `optional` **sticky?**: `boolean`

`true` to set the sticky bit when writing the Unix mode.

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile?**: `boolean`

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`transferStreams`](WorkerConfiguration.md#transferstreams)

***

### uid?

> `optional` **uid?**: `number`

The Unix owner id to write in the Unix extra field or as part of the external attributes.

***

### unixExtraFieldType?

> `optional` **unixExtraFieldType?**: `"infozip"` \| `"unix"`

Which Unix extra field format to write when creating entries that include Unix metadata.
- "infozip": Info-ZIP New Unix extra field (0x7875), storing variable-length uid/gid up to 32 bits.
- "unix": Info-ZIP Unix extra field type 2 (0x7855), storing fixed 2-byte uid/gid (0..65535); a
  larger uid or gid is rejected. The Unix mode is not part of this field; it is written to the
  external file attributes.

When [ZipFS](../classes/ZipFS.md) exports imported entries, their uid/gid are re-emitted as "infozip" regardless
of the field type found in the imported zip file, unless this option is set explicitly.

***

### unixMode?

> `optional` **unixMode?**: `number`

The Unix mode (st_mode bits) to use when writing external attributes.

The value includes the Unix file type, so it is also how a symbolic link is written: pass
`0o120777` and use the path of the link target as the content of the entry. Extractors that
support symbolic links, e.g. Info-ZIP `unzip`, then restore the entry as a link.

A folder entry is always written with `S_IFDIR` (`0o040000`), replacing any file type carried by the
value, so the same mode can be set once on the writer and reused for every entry. Any other entry keeps
the file type it is given, and is written with `S_IFREG` (`0o100000`) when the value carries none. Set
[ZipWriterConstructorOptions#externalFileAttributes](#externalfileattributes) instead to write a mode with no
file type.

***

### usdz?

> `optional` **usdz?**: `boolean`

`true`to produce zip files compatible with the USDZ specification: the data of the entries is aligned on 64-byte
boundaries and stored uncompressed unless the [ZipWriterConstructorOptions#level](#level) or
[ZipWriterAddDataOptions#compressionMethod](#compressionmethod) options are set explicitly. Setting the
[ZipWriterConstructorOptions#password](#password) option throws an [ERR\_UNSUPPORTED\_ENCRYPTION\_USDZ](../variables/ERR_UNSUPPORTED_ENCRYPTION_USDZ.md) error.

These constraints apply to the entries written with [ZipWriter#add](../classes/ZipWriter.md#add) only. The entries copied with
[ZipWriter#appendZip](../classes/ZipWriter.md#appendzip) keep the layout of the source zip file and are not checked, so appending a
zip file that does not comply with the USDZ specification, or appending it when the size of the output
is not a multiple of 64 bytes, silently produces a non-compliant file.

The option is only read when the [ZipWriter](../classes/ZipWriter.md) is created; a value passed to
[ZipWriter#add](../classes/ZipWriter.md#add) is ignored.

#### Default Value

```ts
false
```

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

When compressing, the native API is only used when `level` is undefined or equal to 6, see [ZipWriterConstructorOptions#level](#level).

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useCompressionStream`](WorkerConfiguration.md#usecompressionstream)

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames?**: `boolean`

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D -
Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this option only sets the flag, it does not ensure that the file names are in the correct
encoding: when it is set to `false`, the names are still encoded in UTF-8 unless the
[ZipWriterConstructorOptions#encodeText](#encodetext) option is also set to encode them in the intended code page.
Setting it to `false` alone therefore produces an archive whose file names are mislabeled, holding UTF-8
bytes announced as Code Page 437: the names holding characters outside of ASCII are decoded incorrectly
by the readers honoring the flag, including [ZipReader](../classes/ZipReader.md) unless
[GetEntriesOptions#filenameEncoding](GetEntriesOptions.md#filenameencoding) is set to `"utf-8"`.

#### Default Value

```ts
true
```

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`WorkerConfiguration`](WorkerConfiguration.md).[`useWebWorkers`](WorkerConfiguration.md#usewebworkers)

***

### version?

> `optional` **version?**: `number`

The "Version" field, i.e. the minimum version needed to extract the entry.

#### Default Value

```ts
the minimum version required by the features of the entry: 10 for entries stored without
compression or encryption, 20 for deflated, folder or ZipCrypto-encrypted entries, raised to 45 for Zip64
entries and 51 for AES-encrypted entries.
```

***

### versionMadeBy?

> `optional` **versionMadeBy?**: `number`

The "Version made by" field, whose upper byte is the platform and lower byte the version of the
specification.

The platform is not taken from the value passed here. It is forced to Unix (`3`) when the entry carries Unix
metadata, i.e. when [ZipWriterConstructorOptions#uid](#uid), [ZipWriterConstructorOptions#gid](#gid),
[ZipWriterConstructorOptions#unixMode](#unixmode) or [ZipWriterConstructorOptions#unixExtraFieldType](#unixextrafieldtype) is set,
since Unix mode bits stored under another platform are ignored by the extractors. It is forced to MS-DOS (`0`)
when [ZipWriterConstructorOptions#msdosAttributes](#msdosattributes) or
[ZipWriterConstructorOptions#msdosAttributesRaw](#msdosattributesraw) is set. Only the lower byte of the value survives in
both cases.

#### Default Value

768, i.e. `3 << 8`, or 20 when [ZipWriterConstructorOptions#msDosCompatible](#msdoscompatible) is set to `true`

***

### zip64?

> `optional` **zip64?**: `boolean`

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

***

### zipCrypto?

> `optional` **zipCrypto?**: `boolean`

`true` to use the ZipCrypto algorithm to encrypt the content of the entry. Setting it to `true` will also
set the [ZipWriterConstructorOptions#dataDescriptor](#datadescriptor) to `true`.

It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.

#### Default Value

```ts
false
```

## Methods

### encodeText()?

> `optional` **encodeText**(`text`, `type`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

The function called for encoding the filename and the comment of the entry.

zip.js encodes them in UTF-8 when the option is not set, so it must be set to write them in another
code page, together with [ZipWriterConstructorOptions#useUnicodeFileNames](#useunicodefilenames) set to `false` to
announce them as Code Page 437 instead of UTF-8.

#### Parameters

##### text

`string`

The text to encode.

##### type

`"filename"` \| `"comment"`

The type of the encoded text, `"filename"` or `"comment"`.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

The encoded text or `undefined` if the text should be encoded by zip.js.
