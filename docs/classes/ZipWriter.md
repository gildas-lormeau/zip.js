[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipWriter

# Class: ZipWriter\<Type\>

Defined in: [index.d.ts:1273](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1273)

Represents an instance used to create a zip file.

## Example

Here is an example showing how to create a zip file containing a compressed text file:
```
// use a BlobWriter to store with a ZipWriter the zip into a Blob object
const blobWriter = new zip.BlobWriter("application/zip");
const writer = new zip.ZipWriter(blobWriter);

// use a TextReader to read the String to add
await writer.add("filename.txt", new zip.TextReader("test!"));

// close the ZipReader
await writer.close();

// get the zip file as a Blob
const blob = await blobWriter.getData();
```

## Type Parameters

### Type

`Type`

## Constructors

### Constructor

> **new ZipWriter**\<`Type`\>(`writer`, `options?`): `ZipWriter`\<`Type`\>

Defined in: [index.d.ts:1280](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1280)

Creates the ZipWriter instance

#### Parameters

##### writer

The [Writer](Writer.md) instance where the zip content will be written.

`WritableStream`\<`any`\> | [`WritableWriter`](../interfaces/WritableWriter.md) | `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`, `any`\> | [`Writer`](Writer.md)\<`Type`\>

##### options?

[`ZipWriterConstructorOptions`](../interfaces/ZipWriterConstructorOptions.md)

The options.

#### Returns

`ZipWriter`\<`Type`\>

## Properties

### hasCorruptedEntries?

> `readonly` `optional` **hasCorruptedEntries**: `boolean`

Defined in: [index.d.ts:1294](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1294)

`true` if the zip contains at least one entry that has been partially written.

## Methods

### add()

> **add**\<`ReaderType`\>(`filename`, `reader?`, `options?`): `Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

Defined in: [index.d.ts:1321](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1321)

Adds an entry into the zip file

#### Type Parameters

##### ReaderType

`ReaderType`

#### Parameters

##### filename

`string`

The filename of the entry.

##### reader?

The  [Reader](Reader.md) instance used to read the content of the entry.

`ReadableStream`\<`any`\> | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[] | [`Reader`](Reader.md)\<`ReaderType`\>

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`EntryMetaData`](../interfaces/EntryMetaData.md)\>

A promise resolving to an [EntryMetaData](../interfaces/EntryMetaData.md) instance.

***

### close()

> **close**(`comment?`, `options?`): `Promise`\<`Type`\>

Defined in: [index.d.ts:1349](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1349)

Writes the entries directory, writes the global comment, and returns the content of the zip file

#### Parameters

##### comment?

`Uint8Array`\<`ArrayBufferLike`\>

The global comment of the zip file.

##### options?

[`ZipWriterCloseOptions`](../interfaces/ZipWriterCloseOptions.md)

The options.

#### Returns

`Promise`\<`Type`\>

The content of the zip file.

***

### prependZip()

> **prependZip**\<`ReaderType`\>(`reader`): `Promise`\<`void`\>

Defined in: [index.d.ts:1303](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1303)

Adds an existing zip file at the beginning of the current zip. This method
cannot be called after the first call to [ZipWriter#add](#add).

#### Type Parameters

##### ReaderType

`ReaderType`

#### Parameters

##### reader

The [Reader](Reader.md) instance used to read the content of the zip file.

`ReadableStream`\<`any`\> | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[] | [`Reader`](Reader.md)\<`ReaderType`\>

#### Returns

`Promise`\<`void`\>

A promise resolving when the zip file has been added.

***

### remove()

> **remove**(`entry`): `boolean`

Defined in: [index.d.ts:1340](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1340)

Removes an entry from the central directory that will be written for the zip file. The entry
data itself cannot be removed because it has already been streamed to the output.

#### Parameters

##### entry

The entry to remove. This can be an [Entry](../type-aliases/Entry.md) instance or the filename of the entry.

`string` | [`Entry`](../type-aliases/Entry.md)

#### Returns

`boolean`

`true` if the entry has been removed, `false` otherwise.

***

### updateEntry()

> **updateEntry**(`entry`, `metadata`): `boolean`

Updates the metadata of an existing entry without rewriting the entry data.

This method allows you to modify certain metadata fields of an entry that was imported
via [`openExisting()`](#openexisting). It operates in-place when possible, making it efficient
for metadata-only updates.

#### Parameters

##### entry

`string` | [`Entry`](../type-aliases/Entry.md)

The entry to update. This can be an [Entry](../type-aliases/Entry.md) instance or the filename of the entry.

##### metadata

[`EntryMetadataUpdate`](../interfaces/EntryMetadataUpdate.md)

The metadata fields to update.

#### Returns

`boolean`

`true` if the entry was successfully updated, `false` if the entry was not found
or if the comment update failed due to length constraints.

#### Updatable Fields

- `lastModDate` - The last modification date
- `lastAccessDate` - The last access date
- `creationDate` - The creation date
- `externalFileAttributes` - The external file attributes (raw)
- `internalFileAttributes` - The internal file attributes (raw)
- `comment` - The entry comment (new comment must be equal to or shorter than the existing comment)

#### Example

```js
// Open an existing archive
const writer = new zip.Uint8ArraySeekableWriter(4096);
// ... assume writer contains an existing archive
await writer.seek(0);
const zipWriter = await zip.ZipWriter.openExisting(writer);

// Update the last modification date
const updated = zipWriter.updateEntry("file.txt", {
  lastModDate: new Date("2025-06-15T12:00:00Z")
});

if (updated) {
  console.log("Entry metadata updated successfully");
} else {
  console.log("Entry not found or update failed");
}

await zipWriter.close();
```

***

### compact()

> **compact**(`options?`): `Promise`\<[`CompactResult`](../interfaces/CompactResult.md)\>

Compacts the zip archive by removing gaps left by deleted entries.

This method requires a [`SeekableWriter`](SeekableWriter.md) and will move entry data to eliminate
fragmentation in the archive. After entries are removed using [`remove()`](#remove), their data
remains in the file until `compact()` is called to reclaim the space.

#### Parameters

##### options?

[`CompactOptions`](../interfaces/CompactOptions.md)

The options.

#### Returns

`Promise`\<[`CompactResult`](../interfaces/CompactResult.md)\>

A promise resolving to a [`CompactResult`](../interfaces/CompactResult.md) with:
- `reclaimedBytes` - The total number of bytes reclaimed
- `entriesMoved` - The number of entries that were moved to fill gaps

#### Performance Considerations

- The compact operation reads and rewrites entry data to fill gaps, which can be I/O intensive for large archives
- Use the `dryRun` option to preview space savings without modifying the archive
- Consider batching multiple removals before a single compact operation
- The `onProgress` callback can be used to track progress for large archives

#### Example

```js
// Create archive with multiple files
const writer = new zip.Uint8ArraySeekableWriter(16384);
await writer.init();
const zipWriter = new zip.ZipWriter(writer, { level: 0 });
await zipWriter.add("file1.txt", new zip.TextReader("Content 1"));
await zipWriter.add("file2.txt", new zip.TextReader("Content 2"));
await zipWriter.add("file3.txt", new zip.TextReader("Content 3"));
await zipWriter.close();

// Reopen, remove middle file, and compact
await writer.seek(0);
const zipWriter2 = await zip.ZipWriter.openExisting(writer);
zipWriter2.remove("file2.txt");

// Preview space savings with dryRun
const preview = await zipWriter2.compact({ dryRun: true });
console.log(`Would reclaim ${preview.reclaimedBytes} bytes`);

// Actually compact the archive
const result = await zipWriter2.compact();
console.log(`Reclaimed ${result.reclaimedBytes} bytes, moved ${result.entriesMoved} entries`);

await zipWriter2.close();
```

## Static Methods

### openExisting()

> `static` **openExisting**\<`WriterType`\>(`writer`, `options?`): `Promise`\<`ZipWriter`\<`WriterType`\>\>

Opens an existing zip archive for incremental updates.

This static factory method reads an existing zip file and creates a [`ZipWriter`](ZipWriter.md)
positioned to append new entries while preserving all existing entries. It enables efficient
incremental updates to zip archives without rewriting the entire file.

#### Type Parameters

##### WriterType

`WriterType`

#### Parameters

##### writer

[`SeekableWriter`](SeekableWriter.md)\<`WriterType`\>

A [`SeekableWriter`](SeekableWriter.md) instance containing the existing zip archive.

##### options?

[`ZipWriterConstructorOptions`](../interfaces/ZipWriterConstructorOptions.md)

The options.

#### Returns

`Promise`\<`ZipWriter`\<`WriterType`\>\>

A promise resolving to a [`ZipWriter`](ZipWriter.md) instance ready for incremental updates.

#### Requirements

- The writer must implement the [`SeekableWriter`](SeekableWriter.md) interface
- The writer must contain a valid zip archive (can be empty)
- The writer should be seeked to position 0 before calling this method

#### Capabilities

After opening an existing archive, you can:
- Add new entries using [`add()`](#add)
- Remove entries using [`remove()`](#remove)
- Update entry metadata using [`updateEntry()`](#updateentry)
- Reclaim space from removed entries using [`compact()`](#compact)

#### Example

```js
// Create an initial archive
const writer = new zip.Uint8ArraySeekableWriter(4096);
await writer.init();
const zipWriter1 = new zip.ZipWriter(writer);
await zipWriter1.add("file1.txt", new zip.TextReader("Hello World"));
await zipWriter1.close();

// Reopen and add another file
await writer.seek(0); // Reset position for reading
const zipWriter2 = await zip.ZipWriter.openExisting(writer);
await zipWriter2.add("file2.txt", new zip.TextReader("Second file"));
await zipWriter2.close();

// Verify both files exist
const data = writer.getData();
const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
const entries = await zipReader.getEntries();
console.log(entries.length); // 2
await zipReader.close();
```

#### Advanced Example: Remove and Compact

```js
// Open archive, remove an entry, and reclaim space
await writer.seek(0);
const zipWriter = await zip.ZipWriter.openExisting(writer);

// Remove an entry (marks it for removal but doesn't reclaim space yet)
zipWriter.remove("obsolete-file.txt");

// Compact to actually reclaim the space
const result = await zipWriter.compact();
console.log(`Reclaimed ${result.reclaimedBytes} bytes`);

await zipWriter.close();
```

---

## SeekableWriter Interface

The incremental update APIs require a writer that supports random-access operations. The [`SeekableWriter`](SeekableWriter.md) class extends [`Writer`](Writer.md) with the following capabilities:

### Properties

- `position` (readonly) - The current write position in bytes
- `size` - The total size of the written data in bytes
- `isSeekable` (readonly) - Always `true` for seekable writers

### Methods

- `seek(offset)` - Moves the write position to a specific offset
- `truncate()` - Truncates the data at the current position
- `readAt(offset, length)` - Reads data from a specific position without changing the write position

### Uint8ArraySeekableWriter

The library provides [`Uint8ArraySeekableWriter`](Uint8ArraySeekableWriter.md), an in-memory implementation of [`SeekableWriter`](SeekableWriter.md) that stores data as a `Uint8Array`. This is useful for testing and scenarios where the archive fits in memory.

#### Example

```js
// Create an in-memory seekable writer with initial 1KB buffer
const writer = new zip.Uint8ArraySeekableWriter(1024);
await writer.init();

// Use with ZipWriter for creating archives
const zipWriter = new zip.ZipWriter(writer);
await zipWriter.add("test.txt", new zip.TextReader("Hello"));
await zipWriter.close();

// Get the resulting data
const data = writer.getData();

// The writer can be reused with openExisting for incremental updates
await writer.seek(0);
const zipWriter2 = await zip.ZipWriter.openExisting(writer);
// ... add more files
await zipWriter2.close();
```

#### SeekableWriter Operations

```js
const writer = new zip.Uint8ArraySeekableWriter(1024);
await writer.init();

// Write some data
await writer.writeUint8Array(new Uint8Array([1, 2, 3, 4]));
console.log(writer.position); // 4

// Seek to a specific position
await writer.seek(2);
console.log(writer.position); // 2

// Overwrite data at current position
await writer.writeUint8Array(new Uint8Array([10, 11]));

// Read data from a specific position (without moving write position)
const data = await writer.readAt(0, 4);
console.log(data); // Uint8Array [1, 2, 10, 11]

// Truncate at current position
await writer.seek(2);
await writer.truncate();
console.log(writer.size); // 2
```

### FileSystemAccessSeekableWriter (Browser)

The library provides [`FileSystemAccessSeekableWriter`](FileSystemAccessSeekableWriter.md), a browser implementation of [`SeekableWriter`](SeekableWriter.md) that uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) (Chrome/Edge). This enables in-place modification of real files in the browser.

#### Example

```js
// Get a file handle from the user (browser-only)
const fileHandle = await window.showSaveFilePicker({
  suggestedName: 'archive.zip',
  types: [{ description: 'ZIP files', accept: { 'application/zip': ['.zip'] } }]
});

// Create writable stream
const writableStream = await fileHandle.createWritable();

// Create writer (pass fileHandle for readAt support in openExisting)
const writer = new zip.FileSystemAccessSeekableWriter(writableStream, fileHandle);
await writer.init();

// Create a new archive
const zipWriter = new zip.ZipWriter(writer);
await zipWriter.add("file.txt", new zip.TextReader("Hello World"));
await zipWriter.close();

// Close the writable stream
await writer.close();
```

#### Opening an Existing File

```js
// Let user pick an existing file
const [fileHandle] = await window.showOpenFilePicker({
  types: [{ description: 'ZIP files', accept: { 'application/zip': ['.zip'] } }]
});

// Create writable stream (keeps existing content)
const writableStream = await fileHandle.createWritable({ keepExistingData: true });

// Create writer - size is auto-detected when fileHandle is provided
const writer = new zip.FileSystemAccessSeekableWriter(writableStream, fileHandle);
await writer.init();

// Open existing archive
await writer.seek(0);
const zipWriter = await zip.ZipWriter.openExisting(writer);

// Add new files to existing archive
await zipWriter.add("new-file.txt", new zip.TextReader("New content"));
await zipWriter.close();

await writer.close();
```

#### Requirements

- Browser must support the File System Access API (Chrome 86+, Edge 86+, Opera 72+)
- Not available in Firefox or Safari as of 2025
- Requires secure context (HTTPS or localhost)
- User must grant permission via file picker dialog
