[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_PREPENDED\_CENTRAL\_DIRECTORY

# Variable: WARNING\_PREPENDED\_CENTRAL\_DIRECTORY

> `const` **WARNING\_PREPENDED\_CENTRAL\_DIRECTORY**: `string`

Warning reason: the data prepended before the zip file holds a central directory of its own, i.e. the zip file
is preceded by another archive rather than by an arbitrary prefix such as a self-extracting stub
(see [ZipReader#warnings](../classes/ZipReader.md#warnings))

## Remarks

Readers disagree on such files: zip.js reads the last archive, as Info-ZIP `unzip` and Python's `zipfile` do,
whereas 7-Zip reads the first one and reports the rest as data after the end of the archive. The archive is
therefore ambiguous, and the entries reported here may not be the entries another tool reports. It is always
accompanied by [WARNING\_PREPENDED\_DATA](WARNING_PREPENDED_DATA.md), which alone does not distinguish this case from a benign prefix.
Use `strictness: "strict"` to reject these archives instead, at the cost of also rejecting benign prefixes.
