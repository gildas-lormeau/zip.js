[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_TRAILING\_CENTRAL\_DIRECTORY\_DATA

# Variable: WARNING\_TRAILING\_CENTRAL\_DIRECTORY\_DATA

> `const` **WARNING\_TRAILING\_CENTRAL\_DIRECTORY\_DATA**: `string`

Warning reason: data lies between the end of the central directory records and the end of central directory
record, either inside the declared central directory length or beyond it (see [ZipReader#warnings](../classes/ZipReader.md#warnings));
the reason of [ERR\_AMBIGUOUS\_ARCHIVE](ERR_AMBIGUOUS_ARCHIVE.md) under `strictness: "strict"`
