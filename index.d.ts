/**
 * zip.js is a JavaScript open-source library (BSD-3-Clause license) for
 * compressing and decompressing zip files. It has been designed to handle large amounts
 * of data. It supports notably multi-core compression, native compression with
 * compression streams, archives larger than 4GB with Zip64, split zip files and data
 * encryption.
 *
 * @author Gildas Lormeau
 * @license BSD-3-Clause
 *  
 * @example
 * Hello world
 * ```js
 * import {
 *   BlobReader,
 *   BlobWriter,
 *   TextReader,
 *   TextWriter,
 *   ZipReader,
 *   ZipWriter,
 * } from from "@zip-js/zip-js";
 * 
 * // ----
 * // Write the zip file
 * // ----
 * 
 * // Creates a BlobWriter object where the zip content will be written.
 * const zipFileWriter = new BlobWriter();
 * 
 * // Creates a TextReader object storing the text of the entry to add in the zip
 * // (i.e. "Hello world!").
 * const helloWorldReader = new TextReader("Hello world!");
 * 
 * // Creates a ZipWriter object writing data via `zipFileWriter`, adds the entry
 * // "hello.txt" containing the text "Hello world!" via `helloWorldReader`, and
 * // closes the writer.
 * const zipWriter = new ZipWriter(zipFileWriter);
 * await zipWriter.add("hello.txt", helloWorldReader);
 * await zipWriter.close();
 * 
 * // Retrieves the Blob object containing the zip content into `zipFileBlob`. It
 * // is also returned by zipWriter.close() for more convenience.
 * const zipFileBlob = await zipFileWriter.getData();
 * 
 * // ----
 * // Read the zip file
 * // ----
 * 
 * // Creates a BlobReader object used to read `zipFileBlob`.
 * const zipFileReader = new BlobReader(zipFileBlob);
 * // Creates a TextWriter object where the content of the first entry in the zip
 * // will be written.
 * const helloWorldWriter = new TextWriter();
 * 
 * // Creates a ZipReader object reading the zip content via `zipFileReader`,
 * // retrieves metadata (name, dates, etc.) of the first entry, retrieves its
 * // content via `helloWorldWriter`, and closes the reader.
 * const zipReader = new ZipReader(zipFileReader);
 * const firstEntry = (await zipReader.getEntries()).shift();
 * const helloWorldText = await firstEntry.getData(helloWorldWriter);
 * await zipReader.close();
 * 
 * // Displays "Hello world!".
 * console.log(helloWorldText);
 * ```
 * 
 * @example
 * Hello world with Streams
 * ```js
 * import {
 *   BlobReader,
 *   ZipReader,
 *   ZipWriter,
 * } from "@zip-js/zip-js";
 * 
 * // ----
 * // Write the zip file
 * // ----
 * 
 * // Creates a TransformStream object, the zip content will be written in the
 * // `writable` property.
 * const zipFileStream = new TransformStream();
 * // Creates a Promise object resolved to the zip content returned as a Blob
 * // object retrieved from `zipFileStream.readable`.
 * const zipFileBlobPromise = new Response(zipFileStream.readable).blob();
 * // Creates a ReadableStream object storing the text of the entry to add in the
 * // zip (i.e. "Hello world!").
 * const helloWorldReadable = new Blob(["Hello world!"]).stream();
 * 
 * // Creates a ZipWriter object writing data into `zipFileStream.writable`, adds
 * // the entry "hello.txt" containing the text "Hello world!" retrieved from
 * // `helloWorldReadable`, and closes the writer.
 * const zipWriter = new ZipWriter(zipFileStream.writable);
 * await zipWriter.add("hello.txt", helloWorldReadable);
 * await zipWriter.close();
 * 
 * // Retrieves the Blob object containing the zip content into `zipFileBlob`.
 * const zipFileBlob = await zipFileBlobPromise;
 * 
 * // ----
 * // Read the zip file
 * // ----
 * 
 * // Creates a BlobReader object used to read `zipFileBlob`.
 * const zipFileReader = new BlobReader(zipFileBlob);
 * // Creates a TransformStream object, the content of the first entry in the zip
 * // will be written in the `writable` property.
 * const helloWorldStream = new TransformStream();
 * // Creates a Promise object resolved to the content of the first entry returned
 * // as text from `helloWorldStream.readable`.
 * const helloWorldTextPromise = new Response(helloWorldStream.readable).text();
 * 
 * // Creates a ZipReader object reading the zip content via `zipFileReader`,
 * // retrieves metadata (name, dates, etc.) of the first entry, retrieves its
 * // content into `helloWorldStream.writable`, and closes the reader.
 * const zipReader = new ZipReader(zipFileReader);
 * const firstEntry = (await zipReader.getEntries()).shift();
 * await firstEntry.getData(helloWorldStream.writable);
 * await zipReader.close();
 * 
 * // Displays "Hello world!".
 * const helloWorldText = await helloWorldTextPromise;
 * console.log(helloWorldText);
 * ```
 * 
 * @example
 * Adding concurrently multiple entries in a zip file
 * ```js
 * import {
 *   BlobWriter,
 *   HttpReader,
 *   TextReader,
 *   ZipWriter,
 * } from "@zip-js/zip-js";
 * 
 * const README_URL = "https://unpkg.com/@zip.js/zip.js/README.md";
 * getZipFileBlob()
 *   .then(downloadFile);
 * 
 * async function getZipFileBlob() {
 *   const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
 *   await Promise.all([
 *     zipWriter.add("hello.txt", new TextReader("Hello world!")),
 *     zipWriter.add("README.md", new HttpReader(README_URL)),
 *   ]);
 *   return zipWriter.close();
 * }
 * 
 * function downloadFile(blob) {
 *   document.body.appendChild(Object.assign(document.createElement("a"), {
 *     download: "hello.zip",
 *     href: URL.createObjectURL(blob),
 *     textContent: "Download zip file",
 *   }));
 * }
 * ```
 * 
 * @module
*/

/**
 * Represents the `FileSystemEntry` class.
 *
 * @see {@link https://wicg.github.io/entries-api/#api-entry|specification}
 */
// deno-lint-ignore no-empty-interface
interface FileSystemEntryLike { }

/**
 * Represents the `FileSystemHandle` class.
 *
 * @see {@link https://fs.spec.whatwg.org/#api-filesystemhandle}
 */
// deno-lint-ignore no-empty-interface
interface FileSystemHandleLike { }

/**
 * Represents a generic `TransformStream` class.
 *
 * @see {@link https://streams.spec.whatwg.org/#generictransformstream|specification}
 */
declare class TransformStreamLike {
  /**
   * The readable stream.
   */
  readable: ReadableStream;
  /**
   * The writable stream.
   */
  writable: WritableStream;
}

/**
 * Configures zip.js
 *
 * @param configuration The configuration.
 */
export function configure(configuration: Configuration): void;

/**
 * Represents the configuration passed to {@link configure}.
 */
export interface Configuration extends WorkerConfiguration {
  /**
   * The maximum number of web workers used to compress/decompress data simultaneously.
   *
   * @defaultValue `navigator.hardwareConcurrency`
   */
  maxWorkers?: number;
  /**
   * The delay in milliseconds before idle web workers are automatically terminated. You can call `terminateWorkers()` to terminate idle workers.
   *
   * @defaultValue 5000
   */
  terminateWorkerTimeout?: number;
  /**
   * The URIs of the compression/decompression scripts run in web workers.
   *
   * It allows using alternative deflate implementations or specifying a URL to the worker script if the CSP of the page blocks scripts imported from a Blob URI.
   * The properties `deflate` and `inflate` must specify arrays of URLs to import the deflate/inflate web workers, respectively.
   * The first URL is relative to the base URI of the document. The other URLs are relative to the URL of the first script. Scripts in the array are executed in order.
   * If you only use deflation or inflation, the unused `deflate`/`inflate` property can be omitted.
   *
   * Here is an example:
   * ```
   * configure({
   *   workerScripts: {
   *     deflate: ["library_path/custom-worker.js", "./custom-deflate.js"],
   *     inflate: ["library_path/custom-worker.js", "./custom-inflate.js"]
   *   }
   * });
   * ```
   *
   * If the CSP of the page blocks scripts imported from a Blob URI you can use `z-worker.js` from https://github.com/gildas-lormeau/zip.js/tree/master/dist and specify the URL where it can be found.
   *
   * Here is an example:
   * ```
   * configure({
   *   workerScripts: {
   *     deflate: ["library_path/z-worker.js"],
   *     inflate: ["library_path/z-worker.js"]
   *   }
   * });
   * ```
   */
  workerScripts?: {
    /**
     * The URIs of the scripts implementing used for compression.
     */
    deflate?: string[];
    /**
     * The URIs of the scripts implementing used for decompression.
     */
    inflate?: string[];
  };
  /**
   * The size of the chunks in bytes during data compression/decompression.
   *
   * @defaultValue 524288
   */
  chunkSize?: number;
  /**
   * The codec implementation used to compress data.
   *
   * @defaultValue {@link ZipDeflate}
   */
  Deflate?: typeof ZipDeflate;
  /**
   * The codec implementation used to decompress data.
   *
   * @defaultValue {@link ZipInflate}
   */
  Inflate?: typeof ZipInflate;
  /**
   * The stream implementation used to compress data when `useCompressionStream` is set to `false`.
   *
   * @defaultValue {@link CodecStream}
   */
  CompressionStream?: typeof TransformStreamLike;
  /**
   * The stream implementation used to decompress data when `useCompressionStream` is set to `false`.
   *
   * @defaultValue {@link CodecStream}
   */
  DecompressionStream?: typeof TransformStreamLike;
}

/**
 * Represents configuration passed to {@link configure}, the constructor of {@link ZipReader}, {@link Entry#getData}, the constructor of {@link ZipWriter}, and {@link ZipWriter#add}.
 */
export interface WorkerConfiguration {
  /**
   * `true` to use web workers to compress/decompress data in non-blocking background processes.
   *
   * @defaultValue true
   */
  useWebWorkers?: boolean;
  /**
   * `true` to use the native API `CompressionStream`/`DecompressionStream` to compress/decompress data.
   *
   * @defaultValue true
   */
  useCompressionStream?: boolean;
}

/**
 * Transforms event-based third-party codec implementations into implementations compatible with zip.js
 *
 * @param library The third-party codec implementations.
 * @param constructorOptions The options passed to the third-party implementations when building instances.
 * @param registerDataHandler The function called to handle the `data` events triggered by a third-party codec implementation.
 * @returns An instance containing classes compatible with {@link ZipDeflate} and {@link ZipInflate}.
 */
export function initShimAsyncCodec(
  library: EventBasedZipLibrary,
  constructorOptions: unknown | null,
  registerDataHandler: registerDataHandler,
): ZipLibrary;

/**
 * Represents the callback function used to register the `data` event handler.
 */
export interface registerDataHandler {
  /**
   * @param codec The third-party codec instance.
   * @param onData The `data` event handler.
   */
  (codec: EventBasedCodec, onData: dataHandler): void;
}

/**
 * Represents the callback function used to handle `data` events.
 */
export interface dataHandler {
  /**
   * @param data The processed chunk of data.
   */
  (data: Uint8Array): void;
}

/**
 * Terminates all the web workers
 */
export function terminateWorkers(): Promise<void>;

/**
 * Represents event-based implementations used to compress/decompress data.
 */
export interface EventBasedZipLibrary {
  /**
   * The class used to compress data.
   */
  Deflate: typeof EventBasedCodec;
  /**
   * The class used to decompress data.
   */
  Inflate: typeof EventBasedCodec;
}

/**
 * Represents an event-based implementation of a third-party codec.
 */
declare class EventBasedCodec {
  /**
   * Appends a chunk of data to compress/decompress
   *
   * @param data The chunk of data to append.
   */
  push(data: Uint8Array): void;
  /**
   * The function called when a chunk of data has been compressed/decompressed.
   *
   * @param data The chunk of compressed/decompressed data.
   */
  ondata(data?: Uint8Array): void;
}

/**
 * Represents the implementations zip.js uses to compress/decompress data.
 */
export interface ZipLibrary {
  /**
   * The class used to compress data.
   *
   * @defaultValue {@link ZipDeflate}
   */
  Deflate: typeof ZipDeflate;
  /**
   * The class used to decompress data.
   *
   * @defaultValue {@link ZipInflate}
   */
  Inflate: typeof ZipInflate;
}

declare class SyncCodec {
  /**
   * Appends a chunk of decompressed data to compress
   *
   * @param data The chunk of decompressed data to append.
   * @returns A chunk of compressed data.
   */
  append(data: Uint8Array): Uint8Array;
}

/**
 * Represents an instance used to compress data.
 */
declare class ZipDeflate extends SyncCodec {
  /**
   * Flushes the data
   *
   * @returns A chunk of compressed data.
   */
  flush(): Uint8Array;
}

/**
 * Represents a codec used to decompress data.
 */
declare class ZipInflate extends SyncCodec {
  /**
   * Flushes the data
   */
  flush(): void;
}

/**
 * Represents a class implementing `CompressionStream` or `DecompressionStream` interfaces.
 */
declare class CodecStream extends TransformStream { }

/**
 * Returns the MIME type corresponding to a filename extension.
 *
 * @param fileExtension the extension of the filename.
 * @returns The corresponding MIME type.
 */
export function getMimeType(fileExtension: string): string;

/**
 * Represents an instance used to read or write unknown type of data.
 *
 * zip.js can handle multiple types of data thanks to a generic API. This feature is based on 2 abstract constructors: {@link Reader} and {@link Writer}.
 * The classes inheriting from {@link Reader} help to read data from a source of data. The classes inheriting from {@link Writer} help to write data into a destination.
 */
export interface Initializable {
  /**
   * Initializes the instance asynchronously
   */
  init?(): Promise<void>;
}

/**
 * Represents an instance used to read data from a `ReadableStream` instance.
 */
export interface ReadableReader {
  /**
   * The `ReadableStream` instance.
   */
  readable: ReadableStream;
}

/**
 * Represents an instance used to read unknown type of data.
 *
 * @example
 * Here is an example of custom {@link Reader} class used to read binary strings:
 * ```
 * class BinaryStringReader extends Reader {
 *
 *   constructor(binaryString) {
 *     super();
 *     this.binaryString = binaryString;
 *   }
 *
 *   init() {
 *     super.init();
 *     this.size = this.binaryString.length;
 *   }
 *
 *   readCompatibleUint8Array(offset, length) {
 *     const result = new Uint8Array(length);
 *     for (let indexCharacter = 0; indexCharacter < length; indexCharacter++) {
 *       result[indexCharacter] = this.binaryString.charCodeAt(indexCharacter + offset) & 0xFF;
 *     }
 *     return result;
 *   }
 * }
 * ```
 */
export class Reader<Type> implements Initializable, ReadableReader {
  /**
   * Creates the {@link Reader} instance
   *
   * @param value The data to read.
   */
  constructor(value: Type);
  /**
   * The `ReadableStream` instance.
   */
  readable: ReadableStream;
  /**
   * The total size of the data in bytes.
   */
  size: number;
  /**
   * Initializes the instance asynchronously
   */
  init?(): Promise<void>;
  /**
   * Reads a chunk of data
   *
   * @param index The byte index of the data to read.
   * @param length The length of the data to read in bytes.
   * @returns A promise resolving to a chunk of data.
   */
  readCompatibleUint8Array(index: number, length: number): Promise<Uint8Array>;
}

/**
 * Represents a {@link Reader} instance used to read data provided as a `string`.
 */
export class TextReader extends Reader<string> { }

/**
 * Represents a {@link Reader} instance used to read data provided as a `Blob` instance.
 */
export class BlobReader extends Reader<Blob> { }

/**
 * Represents a {@link Reader} instance used to read data provided as a Data URI `string` encoded in Base64.
 */
export class Data64URIReader extends Reader<string> { }

/**
 * Represents a {@link Reader} instance used to read data provided as a `Uint8Array` instance.
 */
export class CompatibleUint8ArrayReader extends Reader<Uint8Array> { }

/**
 * Represents a {@link Reader} instance used to read data provided as an array of {@link ReadableReader} instances (e.g. split zip files).
 *
 * @deprecated Use {@link SplitDataReader} instead.
 */
export class SplitZipReader extends SplitDataReader { }

/**
 * Represents a {@link Reader} instance used to read data provided as an array of {@link ReadableReader} instances (e.g. split zip files).
 */
export class SplitDataReader
  extends Reader<Reader<unknown>[] | ReadableReader[] | ReadableStream[]> { }

/**
 * Represents a URL stored into a `string`.
 */
interface URLString extends String { }

/**
 * Represents a {@link Reader} instance used to fetch data from a URL.
 */
export class HttpReader extends Reader<URLString> {
  /**
   * Creates the {@link HttpReader} instance
   *
   * @param url The URL of the data.
   * @param options The options.
   */
  constructor(url: URLString | URL, options?: HttpOptions);
}

/**
 * Represents a {@link Reader} instance used to fetch data from servers returning `Accept-Ranges` headers.
 */
export class HttpRangeReader extends HttpReader {
  /**
   * Creates the {@link HttpRangeReader} instance
   *
   * @param url The URL of the data.
   * @param options The options.
   */
  constructor(url: URLString | URL, options?: HttpRangeOptions);
}

/**
 * Represents the options passed to the constructor of {@link HttpReader}.
 */
export interface HttpOptions extends HttpRangeOptions {
  /**
   * `true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.
   *
   * @defaultValue false
   */
  useRangeHeader?: boolean;
  /**
   * `true` to always use `Range` headers when fetching data.
   *
   * @defaultValue false
   */
  forceRangeRequests?: boolean;
  /**
   * `true` to prevent using `HEAD` HTTP request in order the get the size of the content.
   * `false` to explicitly use `HEAD`, this is useful in case of CORS where `Access-Control-Expose-Headers: Content-Range` is not returned by the server.
   *
   * @defaultValue false
   */
  preventHeadRequest?: boolean;
  /**
   * `true` to use `Range: bytes=-22` on the first request and cache the EOCD, make sure beforehand that the server supports a suffix range request.
   *
   * @defaultValue false
   */
  combineSizeEocd?: boolean;
}

/**
 * Represents options passed to the constructor of {@link HttpRangeReader} and {@link HttpReader}.
 */
export interface HttpRangeOptions {
  /**
   * `true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.
   *
   * @defaultValue false
   */
  useXHR?: boolean;
  /**
   * The HTTP headers.
   */
  headers?: Iterable<[string, string]> | Map<string, string>;
}

/**
 * Represents an instance used to write data into a `WritableStream` instance.
 */
export interface WritableWriter {
  /**
   * The `WritableStream` instance.
   */
  writable: WritableStream;
  /**
   * The maximum size of split data when creating a {@link ZipWriter} instance or when calling {@link Entry#getData} with a generator of {@link WritableWriter} instances.
   */
  maxSize?: number;
}

/**
 * Represents an instance used to write unknown type of data.
 *
 * @example
 * Here is an example of custom {@link Writer} class used to write binary strings:
 * ```
 * class BinaryStringWriter extends Writer {
 *
 *   constructor() {
 *     super();
 *     this.binaryString = "";
 *   }
 *
 *   writeCompatibleUint8Array(array) {
 *     for (let indexCharacter = 0; indexCharacter < array.length; indexCharacter++) {
 *       this.binaryString += String.fromCharCode(array[indexCharacter]);
 *     }
 *   }
 *
 *   getData() {
 *     return this.binaryString;
 *   }
 * }
 * ```
 */
export class Writer<Type> implements Initializable, WritableWriter {
  /**
   * The `WritableStream` instance.
   */
  writable: WritableStream;
  /**
   * Initializes the instance asynchronously
   *
   * @param size the total size of the written data in bytes.
   */
  init?(size?: number): Promise<void>;
  /**
   * Appends a chunk of data
   *
   * @param array The chunk data to append.
   *
   * @virtual
   */
  writeCompatibleUint8Array(array: Uint8Array): Promise<void>;
  /**
   * Retrieves all the written data
   *
   * @returns A promise resolving to the written data.
   */
  getData(): Promise<Type>;
}

/**
 * Represents a {@link Writer} instance used to retrieve the written data as a `string`.
 */
export class TextWriter extends Writer<string> {
  /**
   * Creates the {@link TextWriter} instance
   *
   * @param encoding The encoding of the text.
   */
  constructor(encoding?: string);
}

/**
 * Represents a {@link WritableWriter} instance used to retrieve the written data as a `Blob` instance.
 */
export class BlobWriter implements Initializable, WritableWriter {
  /**
   * The `WritableStream` instance.
   */
  writable: WritableStream;
  /**
   * Initializes the instance asynchronously
   */
  init(): Promise<void>;
  /**
   * Creates the {@link BlobWriter} instance
   *
   * @param mimeString The MIME type of the content.
   */
  constructor(mimeString?: string);
  /**
   * Retrieves all the written data
   *
   * @returns A promise resolving to the written data.
   */
  getData(): Promise<Blob>;
}

/**
 * Represents a {@link Writer} instance used to retrieve the written data as a Data URI `string` encoded in Base64.
 */
export class Data64URIWriter extends Writer<string> {
  /**
   * Creates the {@link Data64URIWriter} instance
   *
   * @param mimeString The MIME type of the content.
   */
  constructor(mimeString?: string);
}

/**
 * Represents a {@link Writer} instance used to retrieve the written data from a generator of {@link WritableWriter} instances  (i.e. split zip files).
 *
 * @deprecated Use {@link SplitDataWriter} instead.
 */
export class SplitZipWriter extends SplitDataWriter { }

/**
 * Represents a {@link Writer}  instance used to retrieve the written data from a generator of {@link WritableWriter}  instances  (i.e. split zip files).
 */
export class SplitDataWriter implements Initializable, WritableWriter {
  /**
   * The `WritableStream` instance.
   */
  writable: WritableStream;
  /**
   * Initializes the instance asynchronously
   */
  init(): Promise<void>;
  /**
   * Creates the {@link SplitDataWriter} instance
   *
   * @param writerGenerator A generator of Writer instances.
   * @param maxSize The maximum size of the data written into {@link Writer} instances (default: 4GB).
   */
  constructor(
    writerGenerator: AsyncGenerator<
      Writer<unknown> | WritableWriter | WritableStream,
      boolean
    >,
    maxSize?: number,
  );
}

/**
 * Represents a {@link Writer}  instance used to retrieve the written data as a `Uint8Array` instance.
 */
export class CompatibleUint8ArrayWriter extends Writer<Uint8Array> { }

/**
 * Represents an instance used to create an unzipped stream.
 *
 * @example
 * This example will take a zip file, decompress it and then save its files and directories to disk.
 * ```
 * import {resolve} from "https://deno.land/std/path/mod.ts";
 * import {ensureDir, ensureFile} from "https://deno.land/std/fs/mod.ts";
 *
 * for await (const entry of (await fetch(urlToZippedFile)).body.pipeThrough(new ZipReaderStream())) {
 *   const fullPath = resolve(destination, entry.filename);
 *   if (entry.directory) {
 *     await ensureDir(fullPath);
 *     continue;
 *   }
 *
 *   await ensureFile(fullPath);
 *   await entry.readable?.pipeTo((await Deno.create(fullPath)).writable);
 * }
 * ```
 */
export class ZipReaderStream<T> {
  /**
   * Creates the stream.
   *
   * @param options The options.
   */
  constructor(options?: ZipReaderConstructorOptions);

  /**
   * The readable stream.
   */
  readable: ReadableStream<
    Omit<Entry, "getData"> & { readable?: ReadableStream<Uint8Array> }
  >;

  /**
   * The writable stream.
   */
  writable: WritableStream<T>;
}

/**
 * Represents an instance used to read a zip file.
 *
 * @example
 * Here is an example showing how to read the text data of the first entry from a zip file:
 * ```
 * // create a BlobReader to read with a ZipReader the zip from a Blob object
 * const reader = new zip.ZipReader(new zip.BlobReader(blob));
 *
 * // get all entries from the zip
 * const entries = await reader.getEntries();
 * if (entries.length) {
 *
 *   // get first entry content as text by using a TextWriter
 *   const text = await entries[0].getData(
 *     // writer
 *     new zip.TextWriter(),
 *     // options
 *     {
 *       onprogress: (index, max) => {
 *         // onprogress callback
 *       }
 *     }
 *   );
 *   // text contains the entry data as a String
 *   console.log(text);
 * }
 *
 * // close the ZipReader
 * await reader.close();
 * ```
 */
export class ZipReader<Type> {
  /**
   * Creates the instance
   *
   * @param reader The {@link Reader} instance used to read data.
   * @param options The options.
   */
  constructor(
    reader:
      | Reader<Type>
      | ReadableReader
      | ReadableStream
      | Reader<unknown>[]
      | ReadableReader[]
      | ReadableStream[],
    options?: ZipReaderConstructorOptions,
  );
  /**
   * The global comment of the zip file.
   */
  comment: Uint8Array;
  /**
   * The data prepended before the zip file.
   */
  prependedData?: Uint8Array;
  /**
   * The data appended after the zip file.
   */
  appendedData?: Uint8Array;
  /**
   * Returns all the entries in the zip file
   *
   * @param options The options.
   * @returns A promise resolving to an `array` of {@link Entry} instances.
   */
  getEntries(options?: ZipReaderGetEntriesOptions): Promise<Entry[]>;
  /**
   * Returns a generator used to iterate on all the entries in the zip file
   *
   * @param options The options.
   * @returns An asynchronous generator of {@link Entry} instances.
   */
  getEntriesGenerator(
    options?: ZipReaderGetEntriesOptions,
  ): AsyncGenerator<Entry, boolean>;
  /**
   * Closes the zip file
   */
  close(): Promise<void>;
}

/**
 * Represents the options passed to the constructor of {@link ZipReader}, and `{@link ZipDirectory}#import*`.
 */
export interface ZipReaderConstructorOptions
  extends ZipReaderOptions, GetEntriesOptions, WorkerConfiguration {
  /**
   * `true` to extract the prepended data into {@link ZipReader#prependedData}.
   *
   * @defaultValue false
   */
  extractPrependedData?: boolean;
  /**
   * `true` to extract the appended data into {@link ZipReader#appendedData}.
   *
   * @defaultValue false
   */
  extractAppendedData?: boolean;
}

/**
 * Represents the options passed to {@link ZipReader#getEntries} and {@link ZipReader#getEntriesGenerator}.
 */
export interface ZipReaderGetEntriesOptions
  extends GetEntriesOptions, EntryOnprogressOptions { }

/**
 * Represents options passed to the constructor of {@link ZipReader}, {@link ZipReader#getEntries} and {@link ZipReader#getEntriesGenerator}.
 */
export interface GetEntriesOptions {
  /**
   * The encoding of the filename of the entry.
   */
  filenameEncoding?: string;
  /**
   * The encoding of the comment of the entry.
   */
  commentEncoding?: string;
  /**
   * The function called for decoding the filename and the comment of the entry.
   * 
   * @param value The raw text value.
   * @param encoding The encoding of the text.
   * @returns The decoded text value or `undefined` if the raw text value should be decoded by zip.js.
   */
  decodeText?(value: Uint8Array, encoding: string): string | undefined;
}

/**
 * Represents options passed to the constructor of {@link ZipReader} and {@link Entry#getData}.
 */
export interface ZipReaderOptions {
  /**
   * `true` to check only if the password is valid.
   *
   * @defaultValue false
   */
  checkPasswordOnly?: boolean;
  /**
   * `true` to check the signature of the entry.
   *
   * @defaultValue false
   */
  checkSignature?: boolean;
  /**
   * The password used to decrypt the content of the entry.
   */
  password?: string;
  /**
   * `true` to read the data as-is without decompressing it and without decrypting it.
   */
  passThrough?: boolean;
  /**
   * The password used to encrypt the content of the entry (raw).
   */
  rawPassword?: Uint8Array;
  /**
   * The `AbortSignal` instance used to cancel the decompression.
   */
  signal?: AbortSignal;
  /**
   * `true` to prevent closing of {@link Writer#writable} when calling {@link Entry#getData}.
   *
   * @defaultValue false
   */
  preventClose?: boolean;
  /**
   * `true` to transfer streams to web workers when decompressing data.
   *
   * @defaultValue true
   */
  transferStreams?: boolean;
}

/**
 * Represents the metadata of an entry in a zip file (Core API).
 */
export interface EntryMetaData {
  /**
   * The byte offset of the entry.
   */
  offset: number;
  /**
   * The filename of the entry.
   */
  filename: string;
  /**
   * The filename of the entry (raw).
   */
  rawFilename: Uint8Array;
  /**
   * `true` if the filename is encoded in UTF-8.
   */
  filenameUTF8: boolean;
  /**
   * `true` if the entry is a directory.
   */
  directory: boolean;
  /**
   * `true` if the entry is an executable file
   */
  executable: boolean;
  /**
   * `true` if the content of the entry is encrypted.
   */
  encrypted: boolean;
  /**
   * `true` if the content of the entry is encrypted with the ZipCrypto algorithm.
   */
  zipCrypto: boolean;
  /**
   * The size of the compressed data in bytes.
   */
  compressedSize: number;
  /**
   * The size of the decompressed data in bytes.
   */
  uncompressedSize: number;
  /**
   * The last modification date.
   */
  lastModDate: Date;
  /**
   * The last access date.
   */
  lastAccessDate?: Date;
  /**
   * The creation date.
   */
  creationDate?: Date;
  /**
   * The last modification date (raw).
   */
  rawLastModDate: number | bigint;
  /**
   * The last access date (raw).
   */
  rawLastAccessDate?: number | bigint;
  /**
   * The creation date (raw).
   */
  rawCreationDate?: number | bigint;
  /**
   * The comment of the entry.
   */
  comment: string;
  /**
   * The comment of the entry (raw).
   */
  rawComment: Uint8Array;
  /**
   * `true` if the comment is encoded in UTF-8.
   */
  commentUTF8: boolean;
  /**
   * The signature (CRC32 checksum) of the content.
   */
  signature: number;
  /**
   * The extra field.
   */
  extraField?: Map<number, { type: number, data: Uint8Array }>;
  /**
   * The extra field (raw).
   */
  rawExtraField: Uint8Array;
  /**
   * `true` if the entry is using Zip64.
   */
  zip64: boolean;
  /**
   * The "Version" field.
   */
  version: number;
  /**
   * The "Version made by" field.
   */
  versionMadeBy: number;
  /**
   * `true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.
   */
  msDosCompatible: boolean;
  /**
   * The internal file attributes (raw).
   */
  internalFileAttributes: number;
  /**
   * The external file attributes (raw).
   */
  externalFileAttributes: number;
  /**
   * The number of the disk where the entry data starts.
   */
  /**
   * The internal file attribute (raw).
   * @deprecated Use {@link EntryMetaData#internalFileAttributes} instead.
   */
  internalFileAttribute: number;
  /**
   * The external file attribute (raw).
   * @deprecated Use {@link EntryMetaData#externalFileAttributes} instead.
   */
  externalFileAttribute: number;
  /**
   * The number of the disk where the entry data starts.
   */
  diskNumberStart: number;
  /**
   * The compression method.
   */
  compressionMethod: number;
}

/**
 * Represents an entry with its data and metadata in a zip file (Core API).
 */
export interface Entry extends EntryMetaData {
  /**
   * Returns the content of the entry
   *
   * @param writer The {@link Writer} instance used to write the content of the entry.
   * @param options The options.
   * @returns A promise resolving to the type to data associated to `writer`.
   */
  getData?<Type>(
    writer:
      | Writer<Type>
      | WritableWriter
      | WritableStream
      | AsyncGenerator<
        Writer<unknown> | WritableWriter | WritableStream,
        boolean
      >,
    options?: EntryGetDataCheckPasswordOptions
  ): Promise<Type>;
}

/**
 * Represents the options passed to {@link Entry#getData} and `{@link ZipFileEntry}.get*`.
 */
export interface EntryGetDataOptions
  extends EntryDataOnprogressOptions, ZipReaderOptions, WorkerConfiguration { }

/**
 * Represents the options passed to {@link Entry#getData} and `{@link ZipFileEntry}.get*`.
 */
export interface EntryGetDataCheckPasswordOptions
  extends EntryGetDataOptions { }

/**
 * Represents an instance used to create a zipped stream.
 *
 * @example
 * This example creates a zipped file called numbers.txt.zip containing the numbers 0 - 1000 each on their own line.
 * ```
 * const readable = ReadableStream.from((function* () {
 *   for (let i = 0; i < 1000; ++i)
 *     yield i + '\n'
 * })())
 *
 * readable
 *   .pipeThrough(new ZipWriterStream().transform('numbers.txt'))
 *   .pipeTo((await Deno.create('numbers.txt.zip')).writable)
 * ```
 *
 * @example
 * This example creates a zipped file called Archive.zip containing two files called numbers.txt and letters.txt
 * ```
 * const readable1 = ReadableStream.from((function* () {
 *   for (let i = 0; i < 1000; ++i)
 *     yield i + '\n'
 * })())
 * const readable2 = ReadableStream.from((function* () {
 *   const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
 *   while (letters.length)
 *     yield letters.shift() + '\n'
 * })())
 *
 * const zipper = new ZipWriterStream()
 * zipper.readable.pipeTo((await Deno.create('Archive.zip')).writable)
 * readable1.pipeTo(zipper.writable('numbers.txt'))
 * readable2.pipeTo(zipper.writable('letters.txt'))
 * zipper.close()
 * ```
 */
export class ZipWriterStream {
  /**
   * Creates the stream.
   *
   * @param options The options.
   */
  constructor(options?: ZipWriterConstructorOptions);

  /**
   * The readable stream.
   */
  readable: ReadableStream<Uint8Array>;

  /**
   * The ZipWriter property.
   */
  zipWriter: ZipWriter<unknown>;

  /**
   * Returns an object containing a readable and writable property for the .pipeThrough method
   *
   * @param path The name of the stream when unzipped.
   * @returns An object containing readable and writable properties
   */
  transform<T>(
    path: string,
  ): { readable: ReadableStream<T>; writable: WritableStream<T> };

  /**
   * Returns a WritableStream for the .pipeTo method
   *
   * @param path The directory path of where the stream should exist in the zipped stream.
   * @returns A WritableStream.
   */
  writable<T>(path: string): WritableStream<T>;

  /**
   * Writes the entries directory, writes the global comment, and returns the content of the zipped file.
   *
   * @param comment The global comment of the zip file.
   * @param options The options.
   * @returns The content of the zip file.
   */
  close(
    comment?: Uint8Array,
    options?: ZipWriterCloseOptions,
  ): Promise<unknown>;
}

/**
 * Represents an instance used to create a zip file.
 *
 * @example
 * Here is an example showing how to create a zip file containing a compressed text file:
 * ```
 * // use a BlobWriter to store with a ZipWriter the zip into a Blob object
 * const blobWriter = new zip.BlobWriter("application/zip");
 * const writer = new zip.ZipWriter(blobWriter);
 *
 * // use a TextReader to read the String to add
 * await writer.add("filename.txt", new zip.TextReader("test!"));
 *
 * // close the ZipReader
 * await writer.close();
 *
 * // get the zip file as a Blob
 * const blob = await blobWriter.getData();
 * ```
 */
export class ZipWriter<Type> {
  /**
   * Creates the {@link ZipWriter} instance
   *
   * @param writer The {@link Writer} instance where the zip content will be written.
   * @param options The options.
   */
  constructor(
    writer:
      | Writer<Type>
      | WritableWriter
      | WritableStream
      | AsyncGenerator<
        Writer<unknown> | WritableWriter | WritableStream,
        boolean
      >,
    options?: ZipWriterConstructorOptions,
  );
  /**
   * `true` if the zip contains at least one entry that has been partially written.
   */
  readonly hasCorruptedEntries?: boolean;
  /**
   * Adds an entry into the zip file
   *
   * @param filename The filename of the entry.
   * @param reader The  {@link Reader} instance used to read the content of the entry.
   * @param options The options.
   * @returns A promise resolving to an {@link EntryMetaData} instance.
   */
  add<ReaderType>(
    filename: string,
    reader?:
      | Reader<ReaderType>
      | ReadableReader
      | ReadableStream
      | Reader<unknown>[]
      | ReadableReader[]
      | ReadableStream[],
    options?: ZipWriterAddDataOptions,
  ): Promise<EntryMetaData>;
  /**
   * Writes the entries directory, writes the global comment, and returns the content of the zip file
   *
   * @param comment The global comment of the zip file.
   * @param options The options.
   * @returns The content of the zip file.
   */
  close(comment?: Uint8Array, options?: ZipWriterCloseOptions): Promise<Type>;
}

/**
 * Represents the options passed to {@link ZipWriter#add}.
 */
export interface ZipWriterAddDataOptions
  extends
  ZipWriterConstructorOptions,
  EntryDataOnprogressOptions,
  WorkerConfiguration {
  /**
   * `true` if the entry is a directory.
   *
   * @defaultValue false
   */
  directory?: boolean;
  /**
   * `true` if the entry is an executable file.
   *
   * @defaultValue false
   */
  executable?: boolean;
  /**
   * The comment of the entry.
   */
  comment?: string;
  /**
   * The extra field of the entry.
   */
  extraField?: Map<number, Uint8Array>;
  /**
   * The uncompressed size of the entry. This option is ignored if the {@link ZipWriterConstructorOptions#passThrough} option is not set to `true`.
   */
  uncompressedSize?: number;
  /**
   * The signature (CRC32 checksum) of the content. This option is ignored if the {@link ZipWriterConstructorOptions#passThrough} option is not set to `true`.
   */
  signature?: number;
}

/**
 * Represents the options passed to  {@link ZipWriter#close}.
 */
export interface ZipWriterCloseOptions extends EntryOnprogressOptions {
  /**
   * `true` to use Zip64 to write the entries directory.
   *
   * @defaultValue false
   */
  zip64?: boolean;
  /**
   * `true` to prevent closing of {@link WritableWriter#writable}.
   *
   * @defaultValue false
   */
  preventClose?: boolean;
}

/**
 * Represents options passed to the constructor of {@link ZipWriter}, {@link ZipWriter#add} and `{@link ZipDirectoryEntry}#export*`.
 */
export interface ZipWriterConstructorOptions {
  /**
   * `true` to use Zip64 to store the entry.
   *
   * `zip64` is automatically set to `true` when necessary (e.g. compressed data larger than 4GB or with unknown size).
   *
   * @defaultValue false
   */
  zip64?: boolean;
  /**
   * `true` to prevent closing of {@link WritableWriter#writable}.
   *
   * @defaultValue false
   */
  preventClose?: boolean;
  /**
   * The level of compression.
   *
   * The minimum value is 0 and means that no compression is applied. The maximum value is 9.
   *
   * @defaultValue 5
   */
  level?: number;
  /**
   * `true` to write entry data in a buffer before appending it to the zip file.
   *
   * `bufferedWrite` is automatically set to `true` when compressing more than one entry in parallel.
   *
   * @defaultValue false
   */
  bufferedWrite?: boolean;
  /**
   * `true` to keep the order of the entry physically in the zip file.
   *
   * When set to `true`, the use of web workers will be improved. However, it also prevents files larger than 4GB from being created without setting the `zip64` option to `true` explicitly.
   * Another solution to improve the use of web workers is to add entries from smallest to largest in uncompressed size.
   *
   * @defaultValue true
   */
  keepOrder?: boolean;
  /**
   * The password used to encrypt the content of the entry.
   */
  password?: string;
  /**
   * The password used to encrypt the content of the entry (raw).
   */
  rawPassword?: Uint8Array;
  /**
   * The encryption strength (AES):
   * - 1: 128-bit encryption key
   * - 2: 192-bit encryption key
   * - 3: 256-bit encryption key
   *
   * @defaultValue 3
   */
  encryptionStrength?: 1 | 2 | 3;
  /**
   * The `AbortSignal` instance used to cancel the compression.
   */
  signal?: AbortSignal;
  /**
   * The last modification date.
   *
   * @defaultValue The current date.
   */
  lastModDate?: Date;
  /**
   * The last access date.
   *
   * This option is ignored if the {@link ZipWriterConstructorOptions#extendedTimestamp} option is set to `false`.
   *
   * @defaultValue The current date.
   */
  lastAccessDate?: Date;
  /**
   * The creation date.
   *
   * This option is ignored if the {@link ZipWriterConstructorOptions#extendedTimestamp} option is set to `false`.
   *
   * @defaultValue The current date.
   */
  creationDate?: Date;
  /**
   * `true` to store extended timestamp extra fields.
   *
   * When set to `false`, the maximum last modification date cannot exceed November 31, 2107 and the maximum accuracy is 2 seconds.
   *
   * @defaultValue true
   */
  extendedTimestamp?: boolean;
  /**
   * `true` to use the ZipCrypto algorithm to encrypt the content of the entry.
   *
   * It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.
   *
   * @defaultValue false
   */
  zipCrypto?: boolean;
  /**
   * The "Version" field.
   */
  version?: number;
  /**
   * The "Version made by" field.
   *
   * @defaultValue 20
   */
  versionMadeBy?: number;
  /**
   * `true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D - Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.
   * 
   * Note that this does not ensure that the file names are in the correct encoding.
   *
   * @defaultValue true
   */
  useUnicodeFileNames?: boolean;
  /**
   * `true` to add a data descriptor.
   *
   * When set to `false`, the {@link ZipWriterConstructorOptions#bufferedWrite} option  will automatically be set to `true`.
   *
   * @defaultValue true
   */
  dataDescriptor?: boolean;
  /**
   * `true` to add the signature of the data descriptor.
   *
   * @defaultValue false
   */
  dataDescriptorSignature?: boolean;
  /**
   * `true` to write {@link EntryMetaData#externalFileAttributes} in MS-DOS format for folder entries.
   *
   * @defaultValue false
   */
  msDosCompatible?: boolean;
  /**
   * The external file attribute.
   *
   * @defaultValue 0
   */
  externalFileAttributes?: number;
  /**
   * The internal file attribute.
   *
   * @defaultValue 0
   */
  internalFileAttributes?: number;
  /**
   * `false` to never write disk numbers in zip64 data.
   *
   * @defaultValue true
   */
  supportZip64SplitFile?: boolean;
  /**
   * `true`to produce zip files compatible with the USDZ specification.
   *
   * @defaultValue false
   */
  usdz?: boolean;
  /**
   * `true` to write the data as-is without compressing it and without crypting it.
   */
  passThrough?: boolean;
  /**
   * `true` to write encrypted data when `passThrough` is set to `true`.
   */
  encrypted?: boolean;
  /**
   * The offset of the first entry in the zip file.
   */
  offset?: number;
  /**
   * The compression method (e.g. 8 for DEFLATE, 0 for STORE).
   */
  compressionMethod?: number
  /**
   * The function called for encoding the filename and the comment of the entry.
   * 
   * @param text The text to encode.
   * @returns The encoded text or `undefined` if the text should be encoded by zip.js.
   */
  encodeText?(text: string): Uint8Array | undefined;
}

/**
 * Represents options passed to {@link Entry#getData}, {@link ZipWriter.add} and `{@link ZipDirectory}.export*`.
 */
export interface EntryDataOnprogressOptions {
  /**
   * The function called when starting compression/decompression.
   *
   * @param total The total number of bytes.
   * @returns An empty promise or `undefined`.
   */
  onstart?(total: number): Promise<void> | undefined;
  /**
   * The function called during compression/decompression.
   *
   * @param progress The current progress in bytes.
   * @param total The total number of bytes.
   * @returns An empty promise or `undefined`.
   */
  onprogress?(progress: number, total: number): Promise<void> | undefined;
  /**
   * The function called when ending compression/decompression.
   *
   * @param computedSize The total number of bytes (computed).
   * @returns An empty promise or `undefined`.
   */
  onend?(computedSize: number): Promise<void> | undefined;
}

/**
 * Represents options passed to {@link ZipReader#getEntries}, {@link ZipReader#getEntriesGenerator}, and {@link ZipWriter#close}.
 */
export interface EntryOnprogressOptions {
  /**
   * The function called each time an entry is read/written.
   *
   * @param progress The entry index.
   * @param total The total number of entries.
   * @param entry The entry being read/written.
   * @returns An empty promise or `undefined`.
   */
  onprogress?(
    progress: number,
    total: number,
    entry: EntryMetaData,
  ): Promise<void> | undefined;
}

/**
 * Represents an entry in a zip file (Filesystem API).
 */
declare class ZipEntry {
  /**
   * The relative filename of the entry.
   */
  name: string;
  /**
   * The underlying {@link EntryMetaData} instance.
   */
  data?: EntryMetaData;
  /**
   * The ID of the instance.
   */
  id: number;
  /**
   * The parent directory of the entry.
   */
  parent?: ZipEntry;
  /**
   * The uncompressed size of the content.
   */
  uncompressedSize: number;
  /**
   * The children of the entry.
   */
  children: ZipEntry[];
  /**
   * Clones the entry
   *
   * @param deepClone `true` to clone all the descendants.
   */
  clone(deepClone?: boolean): ZipEntry;
  /**
   * Returns the full filename of the entry
   */
  getFullname(): string;
  /**
   * Returns the filename of the entry relative to a parent directory
   */
  getRelativeName(ancestor: ZipDirectoryEntry): string;
  /**
   * Tests if a {@link ZipDirectoryEntry} instance is an ancestor of the entry
   *
   * @param ancestor The {@link ZipDirectoryEntry} instance.
   */
  isDescendantOf(ancestor: ZipDirectoryEntry): boolean;
  /**
   * Tests if the entry or any of its children is password protected
   */
  isPasswordProtected(): boolean;
  /**
   * Tests the password on the entry and all children if any, returns `true` if the entry is not password protected
   */
  checkPassword(
    password: string,
    options?: EntryGetDataOptions,
  ): Promise<boolean>;
  /**
   * Set the name of the entry
   *
   * @param name The new name of the entry.
   */
  rename(name: string): void;
}

/**
 * Represents a file entry in the zip (Filesystem API).
 */
export class ZipFileEntry<ReaderType, WriterType> extends ZipEntry {
  /**
   * `void` for {@link ZipFileEntry} instances.
   */
  directory: void;
  /**
   * The {@link Reader} instance used to read the content of the entry.
   */
  reader:
    | Reader<ReaderType>
    | ReadableReader
    | ReadableStream
    | Reader<unknown>[]
    | ReadableReader[]
    | ReadableStream[];
  /**
   * The {@link Writer} instance used to write the content of the entry.
   */
  writer:
    | Writer<WriterType>
    | WritableWriter
    | WritableStream
    | AsyncGenerator<Writer<unknown> | WritableWriter | WritableStream>;
  /**
   * Retrieves the text content of the entry as a `string`
   *
   * @param encoding The encoding of the text.
   * @param options The options.
   * @returns A promise resolving to a `string`.
   */
  getText(encoding?: string, options?: EntryGetDataOptions): Promise<string>;
  /**
   * Retrieves the content of the entry as a `Blob` instance
   *
   * @param mimeType The MIME type of the content.
   * @param options The options.
   * @returns A promise resolving to a `Blob` instance.
   */
  getBlob(mimeType?: string, options?: EntryGetDataOptions): Promise<Blob>;
  /**
   * Retrieves the content of the entry as as a Data URI `string` encoded in Base64
   *
   * @param mimeType The MIME type of the content.
   * @param options The options.
   * @returns A promise resolving to a Data URI `string` encoded in Base64.
   */
  getData64URI(
    mimeType?: string,
    options?: EntryGetDataOptions,
  ): Promise<string>;
  /**
   * Retrieves the content of the entry as a `Uint8Array` instance
   *
   * @param options The options.
   * @returns A promise resolving to a `Uint8Array` instance.
   */
  getCompatibleUint8Array(options?: EntryGetDataOptions): Promise<Uint8Array>;
  /**
   * Retrieves the content of the entry via a `WritableStream` instance
   *
   * @param writable The `WritableStream` instance.
   * @param options The options.
   * @returns A promise resolving to the `WritableStream` instance.
   */
  getWritable(
    writable?: WritableStream,
    options?: EntryGetDataOptions,
  ): Promise<WritableStream>;
  /**
   * Retrieves the content of the entry via a {@link Writer} instance
   *
   * @param writer The {@link Writer} instance.
   * @param options The options.
   * @returns A promise resolving to data associated to the {@link Writer} instance.
   */
  getData(
    writer:
      | Writer<unknown>
      | WritableWriter
      | WritableStream
      | AsyncGenerator<Writer<unknown> | WritableWriter | WritableStream>,
    options?: EntryGetDataOptions,
  ): Promise<unknown>;
  /**
   * Replaces the content of the entry with a `Blob` instance
   *
   * @param blob The `Blob` instance.
   */
  replaceBlob(blob: Blob): void;
  /**
   * Replaces the content of the entry with a `string`
   *
   * @param text The `string`.
   */
  replaceText(text: string): void;
  /**
   * Replaces the content of the entry with a Data URI `string` encoded in Base64
   *
   * @param dataURI The Data URI `string` encoded in Base64.
   */
  replaceData64URI(dataURI: string): void;
  /**
   * Replaces the content of the entry with a `Uint8Array` instance
   *
   * @param array The `Uint8Array` instance.
   */
  replaceCompatibleUint8Array(array: Uint8Array): void;
  /**
   * Replaces the content of the entry with a `ReadableStream` instance
   *
   * @param readable The `ReadableStream` instance.
   */
  replaceReadable(readable: ReadableStream): void;
}

/**
 * Represents a directory entry in the zip (Filesystem API).
 */
export class ZipDirectoryEntry extends ZipEntry {
  /**
   * `true` for  {@link ZipDirectoryEntry} instances.
   */
  directory: true;
  /**
   * Gets a {@link ZipEntry} child instance from its relative filename
   *
   * @param name The relative filename.
   * @returns A {@link ZipFileEntry} or a {@link ZipDirectoryEntry} instance (use the {@link ZipFileEntry#directory} and {@link ZipDirectoryEntry#directory} properties to differentiate entries).
   */
  getChildByName(name: string): ZipEntry | undefined;
  /**
   * Adds a directory
   *
   * @param name The relative filename of the directory.
   * @param options The options.
   * @returns A {@link ZipDirectoryEntry} instance.
   */
  addDirectory(
    name: string,
    options?: ZipWriterAddDataOptions,
  ): ZipDirectoryEntry;
  /**
   * Adds an entry with content provided as text
   *
   * @param name The relative filename of the entry.
   * @param text The text.
   * @param options The options.
   * @returns A {@link ZipFileEntry} instance.
   */
  addText(
    name: string,
    text: string,
    options?: ZipWriterAddDataOptions,
  ): ZipFileEntry<string, string>;
  /**
   * Adds a entry entry with content provided as a `Blob` instance
   *
   * @param name The relative filename of the entry.
   * @param blob The `Blob` instance.
   * @param options The options.
   * @returns A {@link ZipFileEntry} instance.
   */
  addBlob(
    name: string,
    blob: Blob,
    options?: ZipWriterAddDataOptions,
  ): ZipFileEntry<Blob, Blob>;
  /**
   * Adds a entry entry with content provided as a Data URI `string` encoded in Base64
   *
   * @param name The relative filename of the entry.
   * @param dataURI The Data URI `string` encoded in Base64.
   * @param options The options.
   * @returns A {@link ZipFileEntry} instance.
   */
  addData64URI(
    name: string,
    dataURI: string,
    options?: ZipWriterAddDataOptions,
  ): ZipFileEntry<string, string>;
  /**
   * Adds an entry with content provided as a `Uint8Array` instance
   *
   * @param name The relative filename of the entry.
   * @param array The `Uint8Array` instance.
   * @param options The options.
   * @returns A {@link ZipFileEntry} instance.
   */
  addCompatibleUint8Array(
    name: string,
    array: Uint8Array,
    options?: ZipWriterAddDataOptions,
  ): ZipFileEntry<Uint8Array, Uint8Array>;
  /**
   * Adds an entry with content fetched from a URL
   *
   * @param name The relative filename of the entry.
   * @param url The URL.
   * @param options The options.
   * @returns A {@link ZipFileEntry} instance.
   */
  addHttpContent(
    name: string,
    url: string,
    options?: HttpOptions & ZipWriterAddDataOptions,
  ): ZipFileEntry<string, void>;
  /**
   * Adds a entry entry with content provided via a `ReadableStream` instance
   *
   * @param name The relative filename of the entry.
   * @param readable The `ReadableStream` instance.
   * @param options The options.
   * @returns A {@link ZipFileEntry} instance.
   */
  addReadable(
    name: string,
    readable: ReadableStream,
    options?: ZipWriterAddDataOptions,
  ): ZipFileEntry<ReadableStream, void>;
  /**
   * Adds an entry with content provided via a `File` instance
   *
   * @param file The `File` instance.
   * @param options The options.
   * @returns A promise resolving to a {@link ZipFileEntry} or a {@link ZipDirectoryEntry} instance.
   */
  addFile(
    file: File,
    options?: ZipWriterAddDataOptions,
  ): Promise<ZipEntry>;
  /**
   * Adds an entry with content provided via a `FileSystemEntry` instance
   *
   * @param fileSystemEntry The `FileSystemEntry` instance.
   * @param options The options.
   * @returns A promise resolving to an array of {@link ZipFileEntry} or a {@link ZipDirectoryEntry} instances.
   */
  addFileSystemEntry(
    fileSystemEntry: FileSystemEntryLike,
    options?: ZipWriterAddDataOptions,
  ): Promise<ZipEntry[]>;
  /**
   * Adds an entry with content provided via a `FileSystemHandle` instance
   *
   * @param fileSystemHandle The `fileSystemHandle` instance.
   * @param options The options.
   * @returns A promise resolving to an array of {@link ZipFileEntry} or a {@link ZipDirectoryEntry} instances.
   */
  addFileSystemHandle(
    fileSystemHandle: FileSystemHandleLike,
    options?: ZipWriterAddDataOptions,
  ): Promise<ZipEntry[]>;
  /**
   * Extracts a zip file provided as a `Blob` instance into the entry
   *
   * @param blob The `Blob` instance.
   * @param options  The options.
   */
  importBlob(
    blob: Blob,
    options?: ZipReaderConstructorOptions,
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file provided as a Data URI `string` encoded in Base64 into the entry
   *
   * @param dataURI The Data URI `string` encoded in Base64.
   * @param options  The options.
   */
  importData64URI(
    dataURI: string,
    options?: ZipReaderConstructorOptions,
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file provided as a `Uint8Array` instance into the entry
   *
   * @param array The `Uint8Array` instance.
   * @param options  The options.
   */
  importCompatibleUint8Array(
    array: Uint8Array,
    options?: ZipReaderConstructorOptions,
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file fetched from a URL into the entry
   *
   * @param url The URL.
   * @param options  The options.
   */
  importHttpContent(
    url: string,
    options?: ZipDirectoryEntryImportHttpOptions,
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file provided via a `ReadableStream` instance into the entry
   *
   * @param readable The `ReadableStream` instance.
   * @param options  The options.
   */
  importReadable(
    readable: ReadableStream,
    options?: ZipReaderConstructorOptions,
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file provided via a custom {@link Reader} instance into the entry
   *
   * @param reader The {@link Reader} instance.
   * @param options  The options.
   */
  importZip(
    reader:
      | Reader<unknown>
      | ReadableReader
      | ReadableStream
      | Reader<unknown>[]
      | ReadableReader[]
      | ReadableStream[],
    options?: ZipReaderConstructorOptions,
  ): Promise<[ZipEntry]>;
  /**
   * Returns a `Blob` instance containing a zip file of the entry and its descendants
   *
   * @param options  The options.
   * @returns A promise resolving to the `Blob` instance.
   */
  exportBlob(options?: ZipDirectoryEntryExportOptions): Promise<Blob>;
  /**
   * Returns a Data URI `string` encoded in Base64 containing a zip file of the entry and its descendants
   *
   * @param options  The options.
   * @returns A promise resolving to the Data URI `string` encoded in Base64.
   */
  exportData64URI(options?: ZipDirectoryEntryExportOptions): Promise<string>;
  /**
   * Returns a `Uint8Array` instance containing a zip file of the entry and its descendants
   *
   * @param options  The options.
   * @returns A promise resolving to the `Uint8Array` instance.
   */
  exportCompatibleUint8Array(
    options?: ZipDirectoryEntryExportOptions,
  ): Promise<Uint8Array>;
  /**
   * Creates a zip file via a `WritableStream` instance containing the entry and its descendants
   *
   * @param writable The `WritableStream` instance.
   * @param options  The options.
   * @returns A promise resolving to the `Uint8Array` instance.
   */
  exportWritable(
    writable?: WritableStream,
    options?: ZipDirectoryEntryExportOptions,
  ): Promise<WritableStream>;
  /**
   * Creates a zip file via a custom {@link Writer} instance containing the entry and its descendants
   *
   * @param writer The {@link Writer} instance.
   * @param options  The options.
   * @returns A promise resolving to the data.
   */
  exportZip(
    writer:
      | Writer<unknown>
      | WritableWriter
      | WritableStream
      | AsyncGenerator<Writer<unknown> | WritableWriter | WritableStream>,
    options?: ZipDirectoryEntryExportOptions,
  ): Promise<unknown>;
}

/**
 * Represents the options passed to {@link ZipDirectoryEntry#importHttpContent}.
 */
export interface ZipDirectoryEntryImportHttpOptions
  extends ZipReaderConstructorOptions, HttpOptions { }

/**
 * Represents the options passed to `{@link ZipDirectoryEntry}#export*()`.
 */
export interface ZipDirectoryEntryExportOptions
  extends ZipWriterConstructorOptions, EntryDataOnprogressOptions {
  /**
   * `true` to use filenames relative to the entry instead of full filenames.
   */
  relativePath?: boolean;
  /**
   * The MIME type of the exported data when relevant.
   */
  mimeType?: string;
  /**
   * The options passed to the Reader instances
   */
  readerOptions?: ZipReaderConstructorOptions;
}

/**
 * Represents a Filesystem instance.
 *
 * @example
 * Here is an example showing how to create and read a zip file containing a compressed text file:
 * ```
 * const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
 * const FILENAME = "lorem.txt";
 * const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });
 * let zipFs = new zip.fs.FS();
 * zipFs.addBlob("lorem.txt", BLOB);
 * const zippedBlob = await zipFs.exportBlob();
 * zipFs = new zip.fs.FS();
 * await zipFs.importBlob(zippedBlob);
 * const firstEntry = zipFs.children[0];
 * const unzippedBlob = await firstEntry.getBlob(zip.getMimeType(firstEntry.name));
 * ```
 */
export class FS extends ZipDirectoryEntry {
  /**
   * The root directory.
   */
  root: ZipDirectoryEntry;
  /**
   * Removes a {@link ZipEntry} instance and its children
   *
   * @param entry The {@link ZipEntry} instance to remove.
   */
  remove(entry: ZipEntry): void;
  /**
   * Moves a {@link ZipEntry} instance and its children into a {@link ZipDirectoryEntry} instance
   *
   * @param entry The {@link ZipEntry} instance to move.
   * @param destination The {@link ZipDirectoryEntry} instance.
   */
  move(entry: ZipEntry, destination: ZipDirectoryEntry): void;
  /**
   * Returns a {@link ZipEntry} instance from its full filename
   *
   * @param fullname The full filename.
   * @returns The {@link ZipEntry} instance.
   */
  find(fullname: string): ZipEntry | undefined;
  /**
   * Returns a {@link ZipEntry} instance from the value of {@link ZipEntry#id}
   *
   * @param id The id of the {@link ZipEntry} instance.
   * @returns The {@link ZipEntry} instance.
   */
  getById(id: number): ZipEntry | undefined;
}

/**
 * The Filesystem API.
 */
export const fs: {
  /**
   * The Filesystem constructor.
   *
   * @defaultValue {@link FS}
   */
  FS: typeof FS;
  /**
   * The {@link ZipDirectoryEntry} constructor.
   *
   * @defaultValue {@link ZipDirectoryEntry}
   */
  ZipDirectoryEntry: typeof ZipDirectoryEntry;
  /**
   * The {@link ZipFileEntry} constructor.
   *
   * @defaultValue {@link ZipFileEntry}
   */
  ZipFileEntry: typeof ZipFileEntry;
};

// The error messages.
/**
 * HTTP range error
 */
export const ERR_HTTP_RANGE: string;
/**
 * Zip format error
 */
export const ERR_BAD_FORMAT: string;
/**
 * End of Central Directory Record not found error
 */
export const ERR_EOCDR_NOT_FOUND: string;
/**
 * Zip64 End of Central Directory Locator not found error
 */
export const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: string;
/**
 * Central Directory not found error
 */
export const ERR_CENTRAL_DIRECTORY_NOT_FOUND: string;
/**
 * Local file header not found error
 */
export const ERR_LOCAL_FILE_HEADER_NOT_FOUND: string;
/**
 * Extra field Zip64 not found error
 */
export const ERR_EXTRAFIELD_ZIP64_NOT_FOUND: string;
/**
 * Encrypted entry error
 */
export const ERR_ENCRYPTED: string;
/**
 * Unsupported encryption error
 */
export const ERR_UNSUPPORTED_ENCRYPTION: string;
/**
 * Unsupported compression error
 */
export const ERR_UNSUPPORTED_COMPRESSION: string;
/**
 * Invalid signature error
 */
export const ERR_INVALID_SIGNATURE: string;
/**
 * Invalid password error
 */
export const ERR_INVALID_PASSWORD: string;
/**
 * Duplicate entry error
 */
export const ERR_DUPLICATED_NAME: string;
/**
 * Invalid comment error
 */
export const ERR_INVALID_COMMENT: string;
/**
 * Invalid entry name error
 */
export const ERR_INVALID_ENTRY_NAME: string;
/**
 * Invalid entry comment error
 */
export const ERR_INVALID_ENTRY_COMMENT: string;
/**
 * Invalid version error
 */
export const ERR_INVALID_VERSION: string;
/**
 * Invalid extra field type error
 */
export const ERR_INVALID_EXTRAFIELD_TYPE: string;
/**
 * Invalid extra field data error
 */
export const ERR_INVALID_EXTRAFIELD_DATA: string;
/**
 * Invalid encryption strength error
 */
export const ERR_INVALID_ENCRYPTION_STRENGTH: string;
/**
 * Invalid format error
 */
export const ERR_UNSUPPORTED_FORMAT: string;
/**
 * Split zip file error
 */
export const ERR_SPLIT_ZIP_FILE: string;
/**
 * Iteration completed too soon error
 */
export const ERR_ITERATOR_COMPLETED_TOO_SOON: string;
/**
 * Undefined uncompressed size error
 */
export const ERR_UNDEFINED_UNCOMPRESSED_SIZE: string
/**
 * Writer not initialized error
 */
export const ERR_WRITER_NOT_INITIALIZED: string;
