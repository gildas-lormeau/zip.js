zip.js is an open-source library (BSD-3-Clause license) for zipping and unzipping files in the browser and Deno.

See here for more info:
https://gildas-lormeau.github.io/zip.js/

```js
// Hello world with zip.js (and Streams)

import { ZipWriter, ZipReader, BlobReader } from "https://deno.land/x/zipjs/index.js";

// ----
// Write the zip file
// ----

// Creates a TransformStream object where the zip content will be written.
const zipStream = new TransformStream();
// Creates a Promise object resolved to the zip content returned as a Blob object.
const promiseZipBlob = new Response(zipStream.readable).blob();
// Creates a ReadableStream object containing the text of the file to compress.
const helloWorldReadable = new Blob(["Hello world!"], { type: "text/plain" }).stream();

// Creates a ZipWriter object writing data via zipStream, adds the file "hello.txt" containing
// the text "Hello world!" in the zip, and closes the writer.
const zipWriter = new ZipWriter(zipStream);
await zipWriter.add("hello.txt", { readable: helloWorldReadable });
await zipWriter.close();

// Retrieves the Blob object containing the zip file.
const zipBlob = await promiseZipBlob;

// ----
// Read the zip file
// ----

// Creates a TransformStream object where the content of the first entry will be written.
const dataStream = new TransformStream();
// Creates a Promise object resolved to the first entry content returned as text.
const promiseTextData = new Response(dataStream.readable).text();

// Reads zipBlob with a BlobReader object, retrieves metadata (name, date, etc.) of the first entry 
// in the zip file, retrieves its content via dataStream, and closes the reader.
// Note: it is *not* possible to use a ReadableStream object to read a zip because random access 
// to data is required to fetch entries reliably.
const zipReader = new ZipReader(new BlobReader(zipBlob));
const firstEntry = (await zipReader.getEntries()).shift();
await firstEntry.getData(dataStream);
await zipReader.close();

// Displays "Hello world!".
console.log(await promiseTextData);
```
See here for more examples: https://github.com/gildas-lormeau/zip.js/tree/master/tests/all
