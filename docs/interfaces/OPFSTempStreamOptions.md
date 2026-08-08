[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / OPFSTempStreamOptions

# Interface: OPFSTempStreamOptions

Defined in: [index.d.ts:356](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L356)

Options for [createOPFSTempStream](../functions/createOPFSTempStream.md).

## Properties

### directoryName?

> `optional` **directoryName?**: `string`

Defined in: [index.d.ts:368](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L368)

Name of the OPFS sub-directory holding the temporary files.

#### Default Value

```ts
".zip.js-temp"
```

***

### getDirectory?

> `optional` **getDirectory?**: () => `FileSystemDirectoryHandle` \| `Promise`\<`FileSystemDirectoryHandle`\>

Defined in: [index.d.ts:374](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L374)

Returns (or resolves to) the root `FileSystemDirectoryHandle`. Defaults to `navigator.storage.getDirectory()`.

Provide it to run inside a worker with a pre-obtained handle, or to test against a mock.

#### Returns

`FileSystemDirectoryHandle` \| `Promise`\<`FileSystemDirectoryHandle`\>

***

### thresholdBytes?

> `optional` **thresholdBytes?**: `number`

Defined in: [index.d.ts:362](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L362)

Spill a buffered entry to a file once its buffered data exceeds this size, in bytes. Smaller entries stay in memory.

#### Default Value

```ts
1048576
```
