[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / isZipFile

# Function: isZipFile()

> **isZipFile**(`reader`, `options?`): `Promise`\<`boolean`\>

Returns `true` if the data looks like a zip file, i.e. if [ZipReader#getEntries](../classes/ZipReader.md#getentries) called on the same
data with the same options would locate the archive structure instead of throwing
[ERR\_EOCDR\_NOT\_FOUND](../variables/ERR_EOCDR_NOT_FOUND.md) or the [ERR\_AMBIGUOUS\_ARCHIVE](../variables/ERR_AMBIGUOUS_ARCHIVE.md) error caused by appended data.

## Parameters

### reader

`ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](../classes/Reader.md)\<`unknown`\> \| [`Reader`](../classes/Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[]

The [Reader](../classes/Reader.md) instance used to read data.

### options?

[`IsZipFileOptions`](../interfaces/IsZipFileOptions.md)

The options.

## Returns

`Promise`\<`boolean`\>

A promise resolving to `true` if the data looks like a zip file.

## Remarks

The probe runs the same search as [ZipReader](../classes/ZipReader.md): it locates the end of central directory record with
the end-anchored backward scan and verifies that a central directory record is stored where it points,
without parsing the entries. `true` therefore means the data is a plausible zip container, not that every
entry can be read: a truncated or otherwise damaged central directory is only detected by calling
[ZipReader#getEntries](../classes/ZipReader.md#getentries). Formats built on zip, e.g. office documents or Java archives, return `true`.

Like the [ZipReader](../classes/ZipReader.md) constructor, a `ReadableStream` or an object providing only a `readable`
property is buffered entirely in memory before probing, which defeats the purpose of a cheap probe; prefer
a seekable [Reader](../classes/Reader.md) input.
