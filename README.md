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
const zipBlobWriter = new TransformStream();
// Creates a Promise object resolved to the zip content returned as a Blob object.
const zipBlobPromise = new Response(zipBlobWriter.readable).blob();
// Creates a Reader object containing a readable property. This property is a ReadableStream object 
// storing the text of the entry to add in the zip (i.e. "Hello world!").
const helloWorldReader = { readable: new Blob(["Hello world!"]).stream() };


// Creates a ZipWriter object writing data via zipBlobWriter, adds the file "hello.txt" containing
// the text "Hello world!" via helloWorldReader in the zip, and closes the writer.
const zipWriter = new ZipWriter(zipBlobWriter);
await zipWriter.add("hello.txt", helloWorldReader);
await zipWriter.close();


// Retrieves the Blob object containing the zip content.
const zipBlob = await zipBlobPromise;

// Uncomment the following code to download the zip file (in a browser)
// 
// const anchorElement = document.createElement("a");
// anchorElement.href = URL.createObjectURL(zipBlob);
// anchorElement.download = "hello.zip";
// anchorElement.click();
// 


// ----
// Read the zip file
// ----

// Creates a BlobReader object used to read zipBlob.
const zipBlobReader = new BlobReader(zipBlob);
// Creates a TransformStream object where the content of the first entry in the zip will be written.
const helloWorldWriter = new TransformStream();
// Creates a Promise object resolved to the first entry content returned as text.
const helloWorldTextPromise = new Response(helloWorldWriter.readable).text();


// Reads zipBlob via zipBlobReader, retrieves metadata (name, dates, etc.) of the first entry, 
// retrieves its content via helloWorldWriter, and closes the reader.
const zipReader = new ZipReader(zipBlobReader);
const firstEntry = (await zipReader.getEntries()).shift();
await firstEntry.getData(helloWorldWriter);
await zipReader.close();


// Displays "Hello world!".
const helloWorldText = await helloWorldTextPromise;
console.log(helloWorldText);
```
See here for more examples: https://github.com/gildas-lormeau/zip.js/tree/master/tests/all
