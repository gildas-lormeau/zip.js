# Introduction

zip.js is an open-source library (BSD-3-Clause license) implemented in
JavaScript to compress and decompress zip files. It has been designed to handle
large amounts of data and notably supports multi-core compression, compression
streams, Zip64 and encryption.

# Documentation

See here for more info: https://gildas-lormeau.github.io/zip.js/

# Examples

## Hello world

```js
import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter,
} from "https://deno.land/x/zipjs/index.js";

// ----
// Write the zip file
// ----

// Creates a BlobWriter object where the zip content will be written.
const zipFileWriter = new BlobWriter();
// Creates a TextReader object storing the text of the entry to add in the zip
// (i.e. "Hello world!").
const helloWorldReader = new TextReader("Hello world!");

// Creates a ZipWriter object writing data via `zipFileWriter`, adds the entry
// "hello.txt" containing the text "Hello world!" via `helloWorldReader`, and
// closes the writer.
const zipWriter = new ZipWriter(zipFileWriter);
await zipWriter.add("hello.txt", helloWorldReader);
await zipWriter.close();

// Retrieves the Blob object containing the zip content into `zipFileBlob`. It
// is also returned by zipWriter.close() for more convenience.
const zipFileBlob = await zipFileWriter.getData();

// ----
// Read the zip file
// ----

// Creates a BlobReader object used to read `zipFileBlob`.
const zipFileReader = new BlobReader(zipFileBlob);
// Creates a TextWriter object where the content of the first entry in the zip
// will be written.
const helloWorldWriter = new TextWriter();

// Creates a ZipReader object reading the zip content via `zipFileReader`,
// retrieves metadata (name, dates, etc.) of the first entry, retrieves its
// content via `helloWorldWriter`, and closes the reader.
const zipReader = new ZipReader(zipFileReader);
const firstEntry = (await zipReader.getEntries()).shift();
const helloWorldText = await firstEntry.getData(helloWorldWriter);
await zipReader.close();

// Displays "Hello world!".
console.log(helloWorldText);
```
Run the code on JSFiddle: https://jsfiddle.net/dns7pkxt/

## Hello world with Streams

```js
import {
  BlobReader,
  ZipReader,
  ZipWriter,
} from "https://deno.land/x/zipjs/index.js";

// ----
// Write the zip file
// ----

// Creates a TransformStream object, the zip content will be written in the
// `writable` property.
const zipFileWriter = new TransformStream();
// Creates a Promise object resolved to the zip content returned as a Blob
// object via the `readable` property of `zipFileWriter`.
const zipFileBlobPromise = new Response(zipFileWriter.readable).blob();
// Creates a Reader object containing a `readable` property. This property is
// set to a ReadableStream object storing the text of the entry to add in the
// zip (i.e. "Hello world!").
const helloWorldReader = { readable: new Blob(["Hello world!"]).stream() };

// Creates a ZipWriter object writing data via `zipFileWriter`, adds the entry
// "hello.txt" containing the text "Hello world!" via `helloWorldReader`, and
// closes the writer.
const zipWriter = new ZipWriter(zipFileWriter);
await zipWriter.add("hello.txt", helloWorldReader);
await zipWriter.close();

// Retrieves the Blob object containing the zip content into `zipFileBlob`.
const zipFileBlob = await zipFileBlobPromise;

// ----
// Read the zip file
// ----

// Creates a BlobReader object used to read `zipFileBlob`.
const zipFileReader = new BlobReader(zipFileBlob);
// Creates a TransformStream object, the content of the first entry in the zip
// will be written in the `writable` property.
const helloWorldWriter = new TransformStream();
// Creates a Promise object resolved to the content of the first entry returned
// as text via the `readable` property of `helloWorldWriter`.
const helloWorldTextPromise = new Response(helloWorldWriter.readable).text();

// Creates a ZipReader object reading the zip content via `zipFileReader`,
// retrieves metadata (name, dates, etc.) of the first entry, retrieves its
// content via `helloWorldWriter`, and closes the reader.
const zipReader = new ZipReader(zipFileReader);
const firstEntry = (await zipReader.getEntries()).shift();
await firstEntry.getData(helloWorldWriter);
await zipReader.close();

// Displays "Hello world!".
const helloWorldText = await helloWorldTextPromise;
console.log(helloWorldText);
```
Run the code on JSFiddle: https://jsfiddle.net/m8q1u0ox/

See here for more examples:
https://github.com/gildas-lormeau/zip.js/tree/master/tests/all
