[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriterAppendZipOptions

# Interface: ZipWriterAppendZipOptions

Represents the options passed to [ZipWriter#appendZip](../classes/ZipWriter.md#appendzip).

## Properties

### filter?

> `optional` **filter?**: (`entry`, `existingEntry?`) => `boolean` \| `Promise`\<`boolean`\>

Selects the entries of the zip file to copy: the function is called once per entry, in the order of the
central directory, and the entry is copied when it returns (or resolves to) `true`. The function can read
the data of the entry with Entry#getData to decide: every call completes before any data is copied.

The second argument is the entry of the current zip which has the same filename, as [ZipWriter#add](../classes/ZipWriter.md#add)
or a previous call to [ZipWriter#appendZip](../classes/ZipWriter.md#appendzip) left it, or `undefined` when there is none. It is the way to
apply a duplicate filename policy, since keeping both entries throws `ERR_DUPLICATED_NAME`: return
`!existingEntry` to keep the entry of the current zip, call [ZipWriter#remove](../classes/ZipWriter.md#remove) with `existingEntry` and
return `true` to replace it, or compare `crc32`, `uncompressedSize` or `lastModDate` to decide. An entry
being added concurrently by a pending [ZipWriter#add](../classes/ZipWriter.md#add) call is not passed.

#### Parameters

##### entry

[`Entry`](../type-aliases/Entry.md)

The entry read from the zip file.

##### existingEntry?

[`EntryMetaData`](EntryMetaData.md)

The entry of the current zip with the same filename, if any.

#### Returns

`boolean` \| `Promise`\<`boolean`\>

`true` to copy the entry.

#### Remarks

When the option is set, the data of the zip file is copied entry by entry and the entries left out leave no
bytes behind in the output, unlike [ZipWriter#remove](../classes/ZipWriter.md#remove), which drops an entry from the central directory
after its data has been written. The bytes of the zip file outside the entries kept are not copied either:
a self-extracting stub, the data of entries removed earlier and the padding between entries, so a zip file
aligned with [ZipWriterConstructorOptions#usdz](ZipWriterConstructorOptions.md#usdz) is not aligned any more once filtered. Without the
option, the data of the zip file is copied as a whole. The duplicate filename check applies to the entries
kept only, so an entry can be replaced by leaving it out and adding its replacement with [ZipWriter#add](../classes/ZipWriter.md#add).

An entry is copied from its local file header to the end of its data or, when it has one, of its data
descriptor, whose layout is read back from the zip file; when no layout matches, the entry is copied up to
the next entry or to the central directory. Before anything is written, each kept entry is checked to start
with a local file header and to end before the next entry or the central directory; otherwise the method
throws [ERR\_LOCAL\_FILE\_HEADER\_NOT\_FOUND](../variables/ERR_LOCAL_FILE_HEADER_NOT_FOUND.md) or [ERR\_OVERLAPPING\_ENTRY](../variables/ERR_OVERLAPPING_ENTRY.md) and leaves the current zip
unchanged. The same checks apply when the output is a split zip file, whose entries are copied one by one
as well.

***

### readerOptions?

> `optional` **readerOptions?**: [`ZipReaderConstructorOptions`](ZipReaderConstructorOptions.md)

The options of the [ZipReader](../classes/ZipReader.md) which reads the zip file.

#### Remarks

The zip file is read with the default options otherwise, so a zip file which a `ZipReader` rejects by default
cannot be appended as-is: set [ZipReaderConstructorOptions#filenameValidation](GetEntriesOptions.md#filenamevalidation) or
[ZipReaderConstructorOptions#strictness](ZipReaderOptions.md#strictness) here to copy the entries of a zip file holding unsafe or
unusual filenames, [ZipReaderConstructorOptions#filenameEncoding](GetEntriesOptions.md#filenameencoding) to decode the filenames the
duplicate check and the `filter` option see, and [ZipReaderConstructorOptions#password](ZipReaderOptions.md#password) to let
`filter` read the data of encrypted entries with Entry#getData. The bytes of the entries are copied
as-is whatever the options are.

A value which is neither an object nor unset throws an [ERR\_INVALID\_READER\_OPTIONS](../variables/ERR_INVALID_READER_OPTIONS.md) error.
