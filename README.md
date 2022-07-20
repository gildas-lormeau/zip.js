zip.js is an open-source library (BSD-3-Clause license) for zipping and unzipping files in the browser and Deno.

See here for more info:
https://gildas-lormeau.github.io/zip.js/

```js
// Hello world with zip.js (and Streams)

import { ZipWriter, ZipReader, BlobReader } from "https://deno.land/x/zipjs/index.js";

// Creates a TransformStream object where the zip file will be written
const zipStream = new TransformStream();
// Creates a Promise object resolved to the zip file returned as a Blob object 
const promiseZipBlob = new Response(zipStream.readable).blob();
// Creates a ReadableStream object containing the text of the file to compress
const helloWorldReadable = new Blob(["Hello world!"], { type: "text/plain" }).stream();

// Creates a ZipWriter object writing data via zipStream
const zipWriter = new ZipWriter(zipStream);
// Adds the file "hello.txt" in the zip and closes the writer
await zipWriter.add("hello.txt", { readable: helloWorldReadable });
await zipWriter.close();

// Retrieves the Blob object containing the zip file
const zipBlob = await promiseZipBlob;

// Reads zipBlob with a BlobReader object
// Note: it is not possible to use a ReadableStream object to read a zip because random access 
// to data is required
const zipReader = new ZipReader(new BlobReader(zipBlob));

// Retrieves metadata of the first entry in the zip file
const firstEntry = (await zipReader.getEntries()).shift();

// Creates a TransformStream object where the entry content will be written
const dataStream = new TransformStream();
// Creates a Promise object resolved to the entry content returned as text 
const promiseTextData = new Response(dataStream.readable).text();

// Retrieves the entry content via dataStream and closes the reader
await firstEntry.getData(dataStream);
await zipReader.close();

// Displays "Hello world!"
console.log(await promiseTextData);
```
