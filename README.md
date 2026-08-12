# Introduction

zip.js is a JavaScript open-source library (BSD-3-Clause license) for
compressing and decompressing zip files. It has been designed to handle large amounts
of data. It supports notably multi-core compression, native compression with
compression streams, archives larger than 4GB with Zip64, split zip files, data
encryption, incremental writing, and Deflate64 decompression.

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
  ZipWriter
} from "@zip.js/zip.js";
// "jsr:@zip-js/zip-js" for Deno

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

Run the code on JSFiddle: https://jsfiddle.net/tm9fhvab/

## Hello world with Streams

```js
import {
  BlobReader,
  ZipReader,
  ZipWriter
} from "@zip-js/zip-js";
// Prefix "@zip-js/zip-js" with "jsr:" for Deno

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

Run the code on JSFiddle: https://jsfiddle.net/aw3d6f4o/

## Adding concurrently multiple entries in a zip file

```js
import {
  BlobWriter,
  HttpReader,
  TextReader,
  ZipWriter,
} from "@zip-js/zip-js";
// Prefix "@zip-js/zip-js" with "jsr:" for Deno

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

## Using external assets

By default, zip.js embeds the code of the web worker and the WebAssembly module
in the library. The `@zip.js/zip.js/external` entry point references them as
external files instead.

```js
import * as zip from "@zip.js/zip.js/external";
```

Bundlers like webpack and Vite detect these references. They emit
`zip-web-worker.js` and `zip-module.wasm` as separate assets and remove
approximately 45KB of embedded payloads from the main bundle. The worker also
runs from a real file URL. This avoids `blob:` restrictions on pages and
browser extensions with a strict Content Security Policy.

With Vite, add `@zip.js/zip.js` to `optimizeDeps.exclude` to resolve the assets
during development. With bundlers which do not rewrite
`new URL(..., import.meta.url)` expressions, copy the two files next to the
output bundle.

The build `dist/zip-fs-external.min.js` offers the same behavior without a
bundler. It resolves `zip-web-worker.js` and `zip-module.wasm` relative to its
own location. The three files must be deployed in the same directory.

Smaller compositions of this entry point are also available.
`@zip.js/zip.js/lib/zip-fs-core-external.js` excludes the MIME type table
(approximately 23KB), `getMimeType()` then returns
`"application/octet-stream"`. `@zip.js/zip.js/lib/zip-core-external.js` also
excludes the filesystem API. Both compositions come with prebuilt bundles in
the `/dist` directory. The full table remains available from any entry point
via `@zip.js/zip.js/mime-types`:

```js
import { getMimeType } from "@zip.js/zip.js/mime-types";
```

## Tests

See https://github.com/gildas-lormeau/zip.js/tree/master/tests/all
