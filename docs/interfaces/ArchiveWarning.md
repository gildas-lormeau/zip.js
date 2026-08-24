[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ArchiveWarning

# Interface: ArchiveWarning

Represents a non-fatal diagnostic deposited on [ZipReader#warnings](../classes/ZipReader.md#warnings) or [EntryMetaData#warnings](EntryMetaData.md#warnings).

## Properties

### filename?

> `optional` **filename?**: `string`

The filename of the first entry the warning applies to, when it applies to an entry.

***

### reason

> **reason**: `string`

The reason of the warning, one of the exported `WARNING_*` constants.
