[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / OPFSTempStreamOptions

# Interface: OPFSTempStreamOptions

Options for [createOPFSTempStream](../functions/createOPFSTempStream.md).

## Properties

### directoryName?

> `optional` **directoryName?**: `string`

Name of the OPFS sub-directory holding the temporary files.

#### Default Value

```ts
".zip.js-temp"
```

***

### getDirectory?

> `optional` **getDirectory?**: () => `FileSystemDirectoryHandle` \| `Promise`\<`FileSystemDirectoryHandle`\>

Returns (or resolves to) the root `FileSystemDirectoryHandle`. Defaults to `navigator.storage.getDirectory()`.

Provide it to run inside a worker with a pre-obtained handle, or to test against a mock.

#### Returns

`FileSystemDirectoryHandle` \| `Promise`\<`FileSystemDirectoryHandle`\>

***

### thresholdBytes?

> `optional` **thresholdBytes?**: `number`

Spill a buffered entry to a file once its buffered data exceeds this size, in bytes. Smaller entries stay in memory.

#### Default Value

```ts
1048576
```
