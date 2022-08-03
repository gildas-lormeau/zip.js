zip.js is an open-source library (BSD-3-Clause license) to zip and unzip files
supporting multi-core compression, compression streams, Zip64 and encryption.

See here for more info: https://gildas-lormeau.github.io/zip.js/

```js
// ----
// Hello world with zip.js (and Streams)
// ----

import {
  BlobReader,
  ZipReader,
  ZipWriter,
} from "https://deno.land/x/zipjs/index.js";

// ----
// Write the zip file
// ----

// Creates a TransformStream object where the zip content will be written in
// the `writable` property.
const zipFileWriter = new TransformStream();
// Creates a Promise object resolved to the zip content returned as a Blob
// object via the `readable` property of `zipFileWriter`.
const zipFileBlobPromise = new Response(zipFileWriter.readable).blob();
// Creates a Reader object containing a `readable` property. This property is
// set to a ReadableStream object storing the text of the entry to add in the
// zip (i.e. "Hello world!").
const helloWorldReader = { readable: new Blob(["Hello world!"]).stream() };

// Creates a ZipWriter object writing data via `zipFileWriter`, adds the entry
// "hello.txt" containing the text "Hello world!" via `helloWorldReader` in the
// zip, and closes the writer.
const zipWriter = new ZipWriter(zipFileWriter);
await zipWriter.add("hello.txt", helloWorldReader);
await zipWriter.close();

// Retrieves the Blob object containing the zip content into `zipFileBlob`.
const zipFileBlob = await zipFileBlobPromise;

// Uncomment the following code to download the zip file (in a browser)
//
// const anchorElement = document.createElement("a");
// anchorElement.href = URL.createObjectURL(zipFileBlob);
// anchorElement.download = "hello.zip";
// anchorElement.click();
//

// ----
// Read the zip file
// ----

// Creates a BlobReader object used to read `zipFileBlob`.
const zipFileReader = new BlobReader(zipFileBlob);
// Creates a TransformStream object where the content of the first entry in the
// zip will be written in the `writable` property.
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

See here for more examples:
https://github.com/gildas-lormeau/zip.js/tree/master/tests/all
