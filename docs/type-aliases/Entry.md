[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Entry

# Type Alias: Entry

> **Entry** = [`DirectoryEntry`](../interfaces/DirectoryEntry.md) \| [`FileEntry`](../interfaces/FileEntry.md)

Defined in: [index.d.ts:1219](https://github.com/gildas-lormeau/zip.js/blob/347f13e008678d1fc6f83418c2c38f7e3569d2a4/index.d.ts#L1219)

Represents an entry with its data and metadata in a zip file (Core API).
This is a union type of [DirectoryEntry](../interfaces/DirectoryEntry.md) and [FileEntry](../interfaces/FileEntry.md).

Before using getData, you should check if the entry is a file.

## Example

```ts
for await (const entry of reader.getEntriesGenerator()) {
  if (entry.directory) continue;

  // entry is a FileEntry
  const plainTextData = await entry.getData(new TextWriter());

  // Do something with the plainTextData
}
```
