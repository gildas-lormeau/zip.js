[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / registerCodec

# Function: registerCodec()

> **registerCodec**(`codec`): `void`

Registers a codec for a custom compression method (e.g. Zstandard, method 93). Entries using a
registered method can then be written with `ZipWriter#add` and read with `FileEntry#getData`.

Codecs registered with `CompressionStream`/`DecompressionStream` classes run on the main thread.
Codecs registered with a `codecURI` module URL also run in web workers: the module is imported
dynamically on both sides of the worker boundary.

## Parameters

### codec

[`CodecDefinition`](../interfaces/CodecDefinition.md)

The codec definition.

## Returns

`void`
