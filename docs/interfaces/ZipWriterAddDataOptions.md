[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterAddDataOptions

# Interface: ZipWriterAddDataOptions

Represents the options passed to [ZipWriter#add](../classes/ZipWriter.md#add).

## Extends

- [`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`WorkerConfiguration`](WorkerConfiguration.md)

## Properties

### bufferedWrite?

> `optional` **bufferedWrite?**: `boolean`

`true` to write entry data in a buffer before appending it to the zip file.

`bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`bufferedWrite`](ZipWriterConstructorOptions.md#bufferedwrite)

***

### comment?

> `optional` **comment?**: `string`

The comment of the entry.

#### Remarks

It is a string, unlike the global comment passed to [ZipWriter#close](../classes/ZipWriter.md#close), because the encoding of
the comment of an entry is recorded in the header by the general purpose bit 11 (see Appendix D -
Language Encoding (EFS)), set by [ZipWriterConstructorOptions#useUnicodeFileNames](ZipWriterConstructorOptions.md#useunicodefilenames). Passing raw
bytes here throws [ERR\_INVALID\_ENTRY\_COMMENT\_TYPE](../variables/ERR_INVALID_ENTRY_COMMENT_TYPE.md) instead of writing their textual
representation.

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

The compression method (e.g. 8 for DEFLATE, 0 for STORE).

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`compressionMethod`](ZipWriterConstructorOptions.md#compressionmethod)

***

### crc32?

> `optional` **crc32?**: `number`

The CRC-32 checksum of the content. This option is ignored if the [ZipWriterConstructorOptions#passThrough](ZipWriterConstructorOptions.md#passthrough) option is not set to `true`.

When the entry is AES-encrypted (see [ZipWriterConstructorOptions#encrypted](ZipWriterConstructorOptions.md#encrypted)), setting this option marks the entry as AE-1
and stores the checksum in the entry headers, e.g. when copying an AE-1 entry read with the
[ZipReaderOptions#passThrough](ZipReaderOptions.md#passthrough) option. Otherwise, the entry is marked as AE-2 and the checksum fields are set to 0.

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

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`createTempStream`](ZipWriterConstructorOptions.md#createtempstream)

***

### creationDate?

> `optional` **creationDate?**: `Date`

The creation date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

Unlike [ZipWriterConstructorOptions#lastModDate](ZipWriterConstructorOptions.md#lastmoddate), it has no default: the date is written only when the
option is set, so that the entries do not carry a meaningless creation time.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`creationDate`](ZipWriterConstructorOptions.md#creationdate)

***

### dataDescriptor?

> `optional` **dataDescriptor?**: `boolean`

`true` to add a data descriptor.

When set to `false`, the [ZipWriterConstructorOptions#bufferedWrite](ZipWriterConstructorOptions.md#bufferedwrite) option will automatically be
set to `true`. It will be automatically set to `false` when it is `undefined` and the
[ZipWriterConstructorOptions#bufferedWrite](ZipWriterConstructorOptions.md#bufferedwrite) option is set to `true`, or when the
[ZipWriterConstructorOptions#zipCrypto](ZipWriterConstructorOptions.md#zipcrypto) option is set to `true`. Otherwise, the default value is `true`.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`dataDescriptor`](ZipWriterConstructorOptions.md#datadescriptor)

***

### dataDescriptorSignature?

> `optional` **dataDescriptorSignature?**: `boolean`

`true` to add the signature of the data descriptor.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`dataDescriptorSignature`](ZipWriterConstructorOptions.md#datadescriptorsignature)

***

### directory?

> `optional` **directory?**: `boolean`

`true` if the entry is a directory.

#### Default Value

```ts
false
```

***

### encrypted?

> `optional` **encrypted?**: `boolean`

`true` to write encrypted data when `passThrough` is set to `true`.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encrypted`](ZipWriterConstructorOptions.md#encrypted)

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

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encryptionStrength`](ZipWriterConstructorOptions.md#encryptionstrength)

***

### executable?

> `optional` **executable?**: `boolean`

`true` if the entry is an executable file.

#### Default Value

```ts
false
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

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`extendedTimestamp`](ZipWriterConstructorOptions.md#extendedtimestamp)

***

### ~~externalFileAttribute?~~

> `optional` **externalFileAttribute?**: `number`

The external file attribute.

#### Deprecated

Use [ZipWriterConstructorOptions#externalFileAttributes](ZipWriterConstructorOptions.md#externalfileattributes) instead.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`externalFileAttribute`](ZipWriterConstructorOptions.md#externalfileattribute)

***

### externalFileAttributes?

> `optional` **externalFileAttributes?**: `number`

The external file attribute.

When set explicitly, the value is written verbatim (including `0`), unless `unixMode`, `setuid`, `setgid`
or `sticky` is also set, in which case these options override the upper 16 bits while the lower 16 bits
are preserved. When omitted, the value is derived from the other options (e.g. the MS-DOS directory
attribute for folder entries, Unix default permissions when `msDosCompatible` is `false`).

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`externalFileAttributes`](ZipWriterConstructorOptions.md#externalfileattributes)

***

### extraField?

> `optional` **extraField?**: `Map`\<`number`, `Uint8Array`\<`ArrayBufferLike`\>\>

The extra field of the entry, written in the local file header and the central directory.

***

### gid?

> `optional` **gid?**: `number`

The Unix group id to write in the Unix extra field or as part of the external attributes.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`gid`](ZipWriterConstructorOptions.md#gid)

***

### ~~internalFileAttribute?~~

> `optional` **internalFileAttribute?**: `number`

The internal file attribute.

#### Deprecated

Use [ZipWriterConstructorOptions#internalFileAttributes](ZipWriterConstructorOptions.md#internalfileattributes) instead.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`internalFileAttribute`](ZipWriterConstructorOptions.md#internalfileattribute)

***

### internalFileAttributes?

> `optional` **internalFileAttributes?**: `number`

The internal file attribute.

#### Default Value

```ts
0
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`internalFileAttributes`](ZipWriterConstructorOptions.md#internalfileattributes)

***

### keepOrder?

> `optional` **keepOrder?**: `boolean`

`true` to keep the order of the entry physically in the zip file.

When set to `true`, the use of web workers will be improved.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`keepOrder`](ZipWriterConstructorOptions.md#keeporder)

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

The last access date.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

Unlike [ZipWriterConstructorOptions#lastModDate](ZipWriterConstructorOptions.md#lastmoddate), it has no default: the date is written only when the
option is set, so that the entries do not carry a meaningless access time.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`lastAccessDate`](ZipWriterConstructorOptions.md#lastaccessdate)

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

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`lastModDate`](ZipWriterConstructorOptions.md#lastmoddate)

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

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`level`](ZipWriterConstructorOptions.md#level)

***

### localExtraField?

> `optional` **localExtraField?**: `Map`\<`number`, `Uint8Array`\<`ArrayBufferLike`\>\>

The extra field of the entry written only in the local file header.

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

See [ZipWriterConstructorOptions#msdosAttributesRaw](ZipWriterConstructorOptions.md#msdosattributesraw) for the platform this option selects and for
the Unix metadata it leaves out of the entry.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`msdosAttributes`](ZipWriterConstructorOptions.md#msdosattributes)

***

### msdosAttributesRaw?

> `optional` **msdosAttributesRaw?**: `number`

When provided, the low 8-bit MS-DOS attributes to write into external file attributes.
Must be an integer between 0 and 255.

#### Remarks

Setting this option or [ZipWriterConstructorOptions#msdosAttributes](ZipWriterConstructorOptions.md#msdosattributes) selects the MS-DOS platform for
the entry exactly as [ZipWriterConstructorOptions#msDosCompatible](ZipWriterConstructorOptions.md#msdoscompatible) does, and overrides that option
when it is explicitly set to `false`. [EntryMetaData#versionMadeBy](EntryMetaData.md#versionmadeby) then loses its Unix upper byte
and no Unix mode is written, so the `0o100644` of a file entry and the `0o040755` of a folder entry are
lost. What counts is that the option is provided, not its value: `0` and `{}` trigger it too.

Setting any Unix metadata option, i.e. [ZipWriterConstructorOptions#uid](ZipWriterConstructorOptions.md#uid),
[ZipWriterConstructorOptions#gid](ZipWriterConstructorOptions.md#gid), [ZipWriterConstructorOptions#unixMode](ZipWriterConstructorOptions.md#unixmode) or
[ZipWriterConstructorOptions#unixExtraFieldType](ZipWriterConstructorOptions.md#unixextrafieldtype), takes precedence and keeps the Unix attributes,
with the MS-DOS attributes written into the low byte.
[ZipWriterConstructorOptions#externalFileAttributes](ZipWriterConstructorOptions.md#externalfileattributes) is preserved as well, although the entry still
declares the MS-DOS platform. [ZipWriterAddDataOptions#executable](#executable) does not count as Unix metadata
here and is dropped.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`msdosAttributesRaw`](ZipWriterConstructorOptions.md#msdosattributesraw)

***

### msDosCompatible?

> `optional` **msDosCompatible?**: `boolean`

`true` to write [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) in MS-DOS format for folder entries.

It also selects the MS-DOS platform for [ZipWriterConstructorOptions#versionMadeBy](ZipWriterConstructorOptions.md#versionmadeby) and leaves the Unix
attributes out of the entries. Setting any Unix metadata option, e.g.
[ZipWriterConstructorOptions#unixMode](ZipWriterConstructorOptions.md#unixmode), turns it back off, and setting
[ZipWriterConstructorOptions#msdosAttributesRaw](ZipWriterConstructorOptions.md#msdosattributesraw) or [ZipWriterConstructorOptions#msdosAttributes](ZipWriterConstructorOptions.md#msdosattributes)
turns it on, overriding an explicit `false`.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`msDosCompatible`](ZipWriterConstructorOptions.md#msdoscompatible)

***

### ntfsTimestamp?

> `optional` **ntfsTimestamp?**: `boolean`

`true` to always store the NTFS extra field, `false` to never store it.

By default, the NTFS extra field is stored only when it preserves information the extended timestamp extra field cannot
represent: a last modification date outside its supported range, or explicit [ZipWriterConstructorOptions#lastAccessDate](ZipWriterConstructorOptions.md#lastaccessdate)
or [ZipWriterConstructorOptions#creationDate](ZipWriterConstructorOptions.md#creationdate) values.

This option is ignored if the [ZipWriterConstructorOptions#extendedTimestamp](ZipWriterConstructorOptions.md#extendedtimestamp) option is set to `false`.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`ntfsTimestamp`](ZipWriterConstructorOptions.md#ntfstimestamp)

***

### offset?

> `optional` **offset?**: `number`

The offset of the first entry in the zip file.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`offset`](ZipWriterConstructorOptions.md#offset)

***

### passThrough?

> `optional` **passThrough?**: `boolean`

`true` to write the data as-is without compressing it and without crypting it.

#### Remarks

The [ZipWriterConstructorOptions#level](ZipWriterConstructorOptions.md#level) and [ZipWriterAddDataOptions#compressionMethod](ZipWriterConstructorOptions.md#compressionmethod) options
do not apply to data written as-is, and the entries with no content, e.g. the directories, ignore this
option entirely. Setting the [ZipWriterConstructorOptions#password](ZipWriterConstructorOptions.md#password) or the
[ZipWriterConstructorOptions#rawPassword](ZipWriterConstructorOptions.md#rawpassword) option throws an
[ERR\_UNSUPPORTED\_ENCRYPTION\_PASS\_THROUGH](../variables/ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH.md) error, unless the
[ZipWriterConstructorOptions#encrypted](ZipWriterConstructorOptions.md#encrypted) option is set to `true` to declare that the data is already
encrypted. In that case the password encrypts the other entries only, and the data written as-is keeps the
password it was encrypted with, which is not verified.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`passThrough`](ZipWriterConstructorOptions.md#passthrough)

***

### password?

> `optional` **password?**: `string`

The password used to encrypt the content of the entry.

#### Remarks

When a password is set and the [ZipWriterConstructorOptions#zipCrypto](ZipWriterConstructorOptions.md#zipcrypto) option is not set to `true`, the
entry is encrypted in AES AE-2 format: the CRC-32 checksum of the content is stored as `0` so that the zip
file reveals no information about the encrypted content. A stored checksum would allow an attacker to verify
guessed content without knowing the password. The integrity of the data is guaranteed by the authentication
code instead.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`password`](ZipWriterConstructorOptions.md#password)

***

### preventClose?

> `optional` **preventClose?**: `boolean`

`true` to prevent closing of [WritableWriter#writable](WritableWriter.md#writable).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`preventClose`](ZipWriterConstructorOptions.md#preventclose)

***

### rawPassword?

> `optional` **rawPassword?**: `Uint8Array`\<`ArrayBufferLike`\>

The password used to encrypt the content of the entry (raw).

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`rawPassword`](ZipWriterConstructorOptions.md#rawpassword)

***

### setgid?

> `optional` **setgid?**: `boolean`

`true` to set the setgid bit when writing the Unix mode.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`setgid`](ZipWriterConstructorOptions.md#setgid)

***

### setuid?

> `optional` **setuid?**: `boolean`

`true` to set the setuid bit when writing the Unix mode.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`setuid`](ZipWriterConstructorOptions.md#setuid)

***

### signal?

> `optional` **signal?**: `AbortSignal`

The `AbortSignal` instance used to cancel the compression.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`signal`](ZipWriterConstructorOptions.md#signal)

***

### ~~signature?~~

> `optional` **signature?**: `number`

The signature (CRC32 checksum) of the content. This option is ignored if the [ZipWriterConstructorOptions#passThrough](ZipWriterConstructorOptions.md#passthrough) option is not set to `true`.

#### Deprecated

Use [ZipWriterAddDataOptions#crc32](#crc32) instead.

***

### sticky?

> `optional` **sticky?**: `boolean`

`true` to set the sticky bit when writing the Unix mode.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`sticky`](ZipWriterConstructorOptions.md#sticky)

***

### supportZip64SplitFile?

> `optional` **supportZip64SplitFile?**: `boolean`

`false` to never write disk numbers in zip64 data.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`supportZip64SplitFile`](ZipWriterConstructorOptions.md#supportzip64splitfile)

***

### transferStreams?

> `optional` **transferStreams?**: `boolean`

`true` to transfer stream ownership to web workers.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`transferStreams`](ZipWriterConstructorOptions.md#transferstreams)

***

### uid?

> `optional` **uid?**: `number`

The Unix owner id to write in the Unix extra field or as part of the external attributes.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`uid`](ZipWriterConstructorOptions.md#uid)

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

The uncompressed size of the entry. This option is ignored if the [ZipWriterConstructorOptions#passThrough](ZipWriterConstructorOptions.md#passthrough) option is not set to `true`.

***

### unixExtraFieldType?

> `optional` **unixExtraFieldType?**: `"infozip"` \| `"unix"`

Which Unix extra field format to write when creating entries that include Unix metadata.
- "infozip": Info-ZIP New Unix extra field (0x7875), storing variable-length uid/gid up to 32 bits.
- "unix": Info-ZIP Unix extra field type 2 (0x7855), storing fixed 2-byte uid/gid (0..65535); a
  larger uid or gid is rejected. The Unix mode is not part of this field; it is written to the
  external file attributes.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`unixExtraFieldType`](ZipWriterConstructorOptions.md#unixextrafieldtype)

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
[ZipWriterConstructorOptions#externalFileAttributes](ZipWriterConstructorOptions.md#externalfileattributes) instead to write a mode with no
file type.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`unixMode`](ZipWriterConstructorOptions.md#unixmode)

***

### usdz?

> `optional` **usdz?**: `boolean`

`true`to produce zip files compatible with the USDZ specification: the data of the entries is aligned on 64-byte
boundaries and stored uncompressed unless the [ZipWriterConstructorOptions#level](ZipWriterConstructorOptions.md#level) or
[ZipWriterAddDataOptions#compressionMethod](ZipWriterConstructorOptions.md#compressionmethod) options are set explicitly. Setting the
[ZipWriterConstructorOptions#password](ZipWriterConstructorOptions.md#password) option throws an [ERR\_UNSUPPORTED\_ENCRYPTION\_USDZ](../variables/ERR_UNSUPPORTED_ENCRYPTION_USDZ.md) error.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`usdz`](ZipWriterConstructorOptions.md#usdz)

***

### useCompressionStream?

> `optional` **useCompressionStream?**: `boolean`

`true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.

When compressing, the native API is only used when `level` is undefined or equal to 6, see [ZipWriterConstructorOptions#level](ZipWriterConstructorOptions.md#level).

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`useCompressionStream`](ZipWriterConstructorOptions.md#usecompressionstream)

***

### useUnicodeFileNames?

> `optional` **useUnicodeFileNames?**: `boolean`

`true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D -
Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.

Note that this does not ensure that the file names are in the correct encoding.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`useUnicodeFileNames`](ZipWriterConstructorOptions.md#useunicodefilenames)

***

### useWebWorkers?

> `optional` **useWebWorkers?**: `boolean`

`true` to use web workers to compress/decompress data in non-blocking background processes.

#### Default Value

```ts
true
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`useWebWorkers`](ZipWriterConstructorOptions.md#usewebworkers)

***

### version?

> `optional` **version?**: `number`

The "Version" field.

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`version`](ZipWriterConstructorOptions.md#version)

***

### versionMadeBy?

> `optional` **versionMadeBy?**: `number`

The "Version made by" field, whose upper byte is the platform and lower byte the version of the
specification.

The platform is not taken from the value passed here. It is forced to Unix (`3`) when the entry carries Unix
metadata, i.e. when [ZipWriterConstructorOptions#uid](ZipWriterConstructorOptions.md#uid), [ZipWriterConstructorOptions#gid](ZipWriterConstructorOptions.md#gid),
[ZipWriterConstructorOptions#unixMode](ZipWriterConstructorOptions.md#unixmode) or [ZipWriterConstructorOptions#unixExtraFieldType](ZipWriterConstructorOptions.md#unixextrafieldtype) is set,
since Unix mode bits stored under another platform are ignored by the extractors. It is forced to MS-DOS (`0`)
when [ZipWriterConstructorOptions#msdosAttributes](ZipWriterConstructorOptions.md#msdosattributes) or
[ZipWriterConstructorOptions#msdosAttributesRaw](ZipWriterConstructorOptions.md#msdosattributesraw) is set. Only the lower byte of the value survives in
both cases.

#### Default Value

768, i.e. `3 << 8`, or 20 when [ZipWriterConstructorOptions#msDosCompatible](ZipWriterConstructorOptions.md#msdoscompatible) is set to `true`

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`versionMadeBy`](ZipWriterConstructorOptions.md#versionmadeby)

***

### zip64?

> `optional` **zip64?**: `boolean`

`true` to use Zip64 to store the entry.

`zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`zip64`](ZipWriterConstructorOptions.md#zip64)

***

### zipCrypto?

> `optional` **zipCrypto?**: `boolean`

`true` to use the ZipCrypto algorithm to encrypt the content of the entry. Setting it to `true` will also
set the [ZipWriterConstructorOptions#dataDescriptor](ZipWriterConstructorOptions.md#datadescriptor) to `true`.

It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.

#### Default Value

```ts
false
```

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`zipCrypto`](ZipWriterConstructorOptions.md#zipcrypto)

## Methods

### encodeText()?

> `optional` **encodeText**(`text`, `type`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

The function called for encoding the filename and the comment of the entry.

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

#### Inherited from

[`ZipWriterConstructorOptions`](ZipWriterConstructorOptions.md).[`encodeText`](ZipWriterConstructorOptions.md#encodetext)

***

### onend()?

> `optional` **onend**(`computedSize`): `void` \| `Promise`\<`void`\>

The function called when ending compression/decompression.

#### Parameters

##### computedSize

`number`

The total number of bytes (computed).

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onend`](EntryDataOnprogressOptions.md#onend)

***

### onprogress()?

> `optional` **onprogress**(`progress`, `total`): `void` \| `Promise`\<`void`\>

The function called during compression/decompression.

#### Parameters

##### progress

`number`

The current progress in bytes.

##### total

`number`

The total number of bytes.

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onprogress`](EntryDataOnprogressOptions.md#onprogress)

***

### onstart()?

> `optional` **onstart**(`total`): `void` \| `Promise`\<`void`\>

The function called when starting compression/decompression.

#### Parameters

##### total

`number`

The total number of bytes.

#### Returns

`void` \| `Promise`\<`void`\>

An empty promise or `undefined`.

#### Inherited from

[`EntryDataOnprogressOptions`](EntryDataOnprogressOptions.md).[`onstart`](EntryDataOnprogressOptions.md#onstart)
