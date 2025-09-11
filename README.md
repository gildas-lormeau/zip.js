# Introduction

zip.js is a JavaScript open-source library (BSD-3-Clause license) for
compressing and decompressing zip files. It has been designed to handle large amounts
of data. It supports notably multi-core compression, native compression with
compression streams, archives larger than 4GB with Zip64, split zip files, data
encryption, and Deflate64 decompression.

# Demo

See https://gildas-lormeau.github.io/zip-manager

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
const zipFileStream = new TransformStream();
// Creates a Promise object resolved to the zip content returned as a Blob
// object retrieved from `zipFileStream.readable`.
const zipFileBlobPromise = new Response(zipFileStream.readable).blob();
// Creates a ReadableStream object storing the text of the entry to add in the
// zip (i.e. "Hello world!").
const helloWorldReadable = new Blob(["Hello world!"]).stream();

// Creates a ZipWriter object writing data into `zipFileStream.writable`, adds
// the entry "hello.txt" containing the text "Hello world!" retrieved from
// `helloWorldReadable`, and closes the writer.
const zipWriter = new ZipWriter(zipFileStream.writable);
await zipWriter.add("hello.txt", helloWorldReadable);
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
const helloWorldStream = new TransformStream();
// Creates a Promise object resolved to the content of the first entry returned
// as text from `helloWorldStream.readable`.
const helloWorldTextPromise = new Response(helloWorldStream.readable).text();

// Creates a ZipReader object reading the zip content via `zipFileReader`,
// retrieves metadata (name, dates, etc.) of the first entry, retrieves its
// content into `helloWorldStream.writable`, and closes the reader.
const zipReader = new ZipReader(zipFileReader);
const firstEntry = (await zipReader.getEntries()).shift();
await firstEntry.getData(helloWorldStream.writable);
await zipReader.close();

// Displays "Hello world!".
const helloWorldText = await helloWorldTextPromise;
console.log(helloWorldText);
```

Run the code on JSFiddle: https://jsfiddle.net/exnyq1ft/

## Adding concurrently multiple entries in a zip file

```js
import {
  BlobWriter,
  HttpReader,
  TextReader,
  ZipWriter,
} from "https://unpkg.com/@zip.js/zip.js/index.js";

const README_URL = "https://unpkg.com/@zip.js/zip.js/README.md";
getZipFileBlob()
  .then(downloadFile);

async function getZipFileBlob() {
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await Promise.all([
    zipWriter.add("hello.txt", new TextReader("Hello world!")),
    zipWriter.add("README.md", new HttpReader(README_URL)),
  ]);
  return zipWriter.close();
}

function downloadFile(blob) {
  document.body.appendChild(Object.assign(document.createElement("a"), {
    download: "hello.zip",
    href: URL.createObjectURL(blob),
    textContent: "Download zip file",
  }));
}
```

Run the code on Plunker: https://plnkr.co/edit/4sVljNIpqSUE9HCA?preview

## Tests

See https://github.com/gildas-lormeau/zip.js/tree/master/tests/all
