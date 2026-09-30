[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_OVERLAPPING\_ENTRY

# Variable: ERR\_OVERLAPPING\_ENTRY

> `const` **ERR\_OVERLAPPING\_ENTRY**: `string`

Overlapping entry error

## Remarks

Thrown by [FileEntry#getData](../interfaces/FileEntry.md#getdata) when [ZipReaderOptions#checkOverlappingEntry](../interfaces/ZipReaderOptions.md#checkoverlappingentry) is set and the
data of the entry overlaps the data of an entry already read. The thrown error carries the other entry in its
`overlappingEntry` property. Also thrown by [ZipWriter#appendZip](../classes/ZipWriter.md#appendzip) when the data of a copied entry runs
into the next entry or into the central directory (see [ZipWriterAppendZipOptions#filter](../interfaces/ZipWriterAppendZipOptions.md#filter)).
