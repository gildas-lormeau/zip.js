[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / OPFSTempStreamOptions

# Interface: OPFSTempStreamOptions

Defined in: [index.d.ts:517](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L517)

Options for [createOPFSTempStream](../functions/createOPFSTempStream.md).

## Properties

### directoryName?

> `optional` **directoryName?**: `string`

Defined in: [index.d.ts:529](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L529)

Name of the OPFS sub-directory holding the temporary files.

#### Default Value

```ts
".zip.js-temp"
```

***

### getDirectory?

> `optional` **getDirectory?**: () => `FileSystemDirectoryHandle` \| `Promise`\<`FileSystemDirectoryHandle`\>

Defined in: [index.d.ts:535](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L535)

Returns (or resolves to) the root `FileSystemDirectoryHandle`. Defaults to `navigator.storage.getDirectory()`.

Provide it to run inside a worker with a pre-obtained handle, or to test against a mock.

#### Returns

`FileSystemDirectoryHandle` \| `Promise`\<`FileSystemDirectoryHandle`\>

***

### thresholdBytes?

> `optional` **thresholdBytes?**: `number`

Defined in: [index.d.ts:523](https://github.com/gildas-lormeau/zip.js/blob/d1931525d0589064f02a9e88299b9c35f6f8f656/index.d.ts#L523)

Spill a buffered entry to a file once its buffered data exceeds this size, in bytes. Smaller entries stay in memory.

#### Default Value

```ts
1048576
```
