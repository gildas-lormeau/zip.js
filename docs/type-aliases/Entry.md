[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Entry

# Type Alias: Entry

> **Entry** = [`DirectoryEntry`](../interfaces/DirectoryEntry.md) \| [`FileEntry`](../interfaces/FileEntry.md)

Defined in: [index.d.ts:1070](https://github.com/gildas-lormeau/zip.js/blob/3fe977a027ef9183833f51be22c11dda80bcb12f/index.d.ts#L1070)

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
