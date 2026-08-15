[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntryGetChildrenOptions

# Interface: ZipDirectoryEntryGetChildrenOptions

Defined in: [index.d.ts:3123](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L3123)

Represents the options passed to [ZipDirectoryEntry#getChildren](../classes/ZipDirectoryEntry.md#getchildren) and [FS#getChildren](../classes/FS.md#getchildren).

## Properties

### recursive?

> `optional` **recursive?**: `boolean`

Defined in: [index.d.ts:3129](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L3129)

`true` to return all the descendants of the directory instead of its direct children only.

#### Default Value

```ts
false
```
