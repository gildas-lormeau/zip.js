[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / getSupportedCompressionMethods

# Function: getSupportedCompressionMethods()

> **getSupportedCompressionMethods**(): [`SupportedCompressionMethod`](../interfaces/SupportedCompressionMethod.md)[]

Returns the compression methods supported in the current environment and configuration: the
built-in methods followed by the codecs registered with [registerCodec](registerCodec.md), in registration
order.

## Returns

[`SupportedCompressionMethod`](../interfaces/SupportedCompressionMethod.md)[]

The supported compression methods.

## Remarks

The support of the built-in methods is resolved against the compression streams available when
the function is called, i.e. the classes set with [configure](configure.md) and the implementations
embedded in the build. A caller can test whether an entry is readable by looking up
[EntryMetaData#compressionMethod](../interfaces/EntryMetaData.md#compressionmethod) in the result and checking
[EntryMetaData#encrypted](../interfaces/EntryMetaData.md#encrypted); `FileEntry#getData` remains the authority.
