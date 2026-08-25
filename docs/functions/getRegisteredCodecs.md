[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / getRegisteredCodecs

# Function: getRegisteredCodecs()

> **getRegisteredCodecs**(): [`CodecDefinition`](../interfaces/CodecDefinition.md)[]

Returns the definitions of the codecs registered with [registerCodec](registerCodec.md), in registration
order. The returned objects are snapshots: modifying them does not alter the registered codecs.

## Returns

[`CodecDefinition`](../interfaces/CodecDefinition.md)[]

The codec definitions.

## Remarks

The `CompressionStream` and `DecompressionStream` classes of a codec registered with
[CodecDefinition#codecURI](../interfaces/CodecDefinition.md#codecuri) only appear once the module has been imported, i.e. after the
first entry using the codec has been read or written.
