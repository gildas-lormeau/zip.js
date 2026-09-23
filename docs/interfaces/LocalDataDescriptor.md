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

***

### zip64

> **zip64**: `boolean`

`true` if the sizes are stored as 8-byte values.

Neither record tells the width reliably: the local file header is written before a streaming writer knows the
sizes, and the Zip64 extra field of the central directory record, written last, describes that record, not the
descriptor, so e.g. an entry placed past 4 GB can carry a Zip64 extra field in its central directory record for
its offset alone and a descriptor with 4-byte sizes. The record is therefore read with the layout, among the two
widths with and without the signature, whose values agree with the central directory; when none does, the width
announced by the Zip64 extra field of the local file header or of the central directory record is used, without
the signature.
