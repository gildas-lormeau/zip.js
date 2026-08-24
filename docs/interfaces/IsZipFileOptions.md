[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / IsZipFileOptions

# Interface: IsZipFileOptions

Represents the options passed to [isZipFile](../functions/isZipFile.md).

## Properties

### maxAppendedDataSize?

> `optional` **maxAppendedDataSize?**: `number`

The maximum number of bytes tolerated after the end of central directory record, overriding the default
selected by [IsZipFileOptions#strictness](#strictness), with the same semantics as
[ZipReaderConstructorOptions#maxAppendedDataSize](GetEntriesOptions.md#maxappendeddatasize).

***

### strictness?

> `optional` **strictness?**: `"balanced"` \| `"strict"` \| `"tolerant"`

The tolerance of the probe, with the same semantics and default as
[ZipReaderConstructorOptions#strictness](ZipReaderOptions.md#strictness): it selects the default amount of tolerated appended data
(0 for `"strict"`, 65536 bytes for `"balanced"`, unlimited for `"tolerant"`) and `"strict"` also returns
`false` when multiple end of central directory records reach the end of the data.

#### Default Value

```ts
"balanced"
```
