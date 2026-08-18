[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / LocalDataDescriptor

# Interface: LocalDataDescriptor

Represents the data descriptor record written after the content of an entry, when
[EntryBitFlag#dataDescriptor](EntryBitFlag.md#datadescriptor) is set.

## Properties

### compressedSize

> **compressedSize**: `number`

The compressed size stored in the record, which is allowed to differ from
[EntryMetaData#compressedSize](EntryMetaData.md#compressedsize).

***

### crc32

> **crc32**: `number`

The CRC-32 checksum stored in the record, which is allowed to differ from [EntryMetaData#crc32](EntryMetaData.md#crc32).

***

### signature

> **signature**: `boolean`

`true` if the record is preceded by its optional signature.

The signature is not part of the original format, it is a later convention writers are free to follow. It is
reported as absent when the values following it disagree with the central directory, since the record is then
read as starting at the first byte.

***

### uncompressedSize

> **uncompressedSize**: `number`

The uncompressed size stored in the record, which is allowed to differ from
[EntryMetaData#uncompressedSize](EntryMetaData.md#uncompressedsize).
