zip.js is an open-source library (BSD-3-Clause license) for zipping and unzipping files in the browser and Deno.

See here for more info:
https://gildas-lormeau.github.io/zip.js/

```js
// Hello world with zip.js (and Streams).

import { ZipWriter, ZipReader, BlobReader } from "https://deno.land/x/zipjs/index.js";

// Creates a TransformStream object where the zip file will be written
const zipStream = createTransformStream(); 
// Creates a ReadableStream containing the text of the file to compress
const helloWorldReadable = new Blob(["Hello world!"], { type: "text/plain" }).stream();

const zipWriter = new ZipWriter(zipStream);
// Adds the file "hello.txt" in the zip
await zipWriter.add("hello.txt", { readable: helloWorldReadable });
await zipWriter.close();

// Retrieves the zip as a Blob object
const zipBlob = await new Response(zipStream.readable).blob();

// Reads the Blob object with a BlobReader object
const zipReader = new ZipReader(new BlobReader(zipBlob));
// Retrieves data of the first entry in the zip file
const firstEntry = (await zipReader.getEntries())[0];
// Creates a TransformStream object where the text data will be written
const dataStream = createTransformStream();
await firstEntry.getData(dataStream);

// Displays "Hello world!"
console.log(await new Response(dataStream.readable).text());

function createTransformStream() {
    return new TransformStream({}, null, { highWaterMark: Infinity });
}
```
