/**
 * zip.js is a JavaScript open-source library (BSD-3-Clause license) for
 * compressing and decompressing zip files. It has been designed to handle large amounts
 * of data. It supports notably multi-core compression, native compression with
 * compression streams, archives larger than 4GB with Zip64, split zip files, data
 * encryption, and Deflate64 decompression.
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
interface FileSystemEntryLike {}

/**
 * Represents the `FileSystemHandle` class.
 *
 * @see {@link https://fs.spec.whatwg.org/#api-filesystemhandle}
 */
// deno-lint-ignore no-empty-interface
interface FileSystemHandleLike {}

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
 * Represents a generic class compressing data, e.g. the native `CompressionStream` class.
 */
declare class CompressionStreamLike extends TransformStreamLike {
  /**
   * Creates the stream
   *
   * @param format The compression format.
   * @param options The options.
   */
  constructor(format: string, options?: CompressionStreamOptions);
}

/**
 * Represents a generic class decompressing data, e.g. the native `DecompressionStream` class.
 */
declare class DecompressionStreamLike extends TransformStreamLike {
  /**
   * Creates the stream
   *
   * @param format The decompression format.
   * @param options The options.
   */
  constructor(format: string, options?: DecompressionStreamOptions);
}

/**
 * The version of zip.js (e.g. `"2.8.59"`), i.e. the `version` declared in the `package.json` file
 * of the library.
 */
export const VERSION: string;

/**
 * Configures zip.js
 *
 * @param configuration The configuration.
 */
export function configure(configuration: Configuration): void;

/**
 * Restores the default configuration of zip.js
 */
export function resetConfiguration(): void;

/**
 * Registers a codec for a custom compression method (e.g. Zstandard, method 93). Entries using a
 * registered method can then be written with `ZipWriter#add` and read with `FileEntry#getData`.
 *
 * Codecs registered with `CompressionStream`/`DecompressionStream` classes run on the main thread.
 * Codecs registered with a `codecURI` module URL also run in web workers: the module is imported
 * dynamically on both sides of the worker boundary.
 *
 * @param codec The codec definition.
 */
export function registerCodec(codec: CodecDefinition): void;

/**
 * Unregisters a codec previously registered with {@link registerCodec}.
 *
 * @param compressionMethod The compression method of the codec.
 */
export function unregisterCodec(compressionMethod: number): void;

/**
 * Returns the definitions of the codecs registered with {@link registerCodec}, in registration
 * order. The returned objects are snapshots: modifying them does not alter the registered codecs.
 *
 * @remarks
 * The `CompressionStream` and `DecompressionStream` classes of a codec registered with
 * {@link CodecDefinition#codecURI} only appear once the module has been imported, i.e. after the
 * first entry using the codec has been read or written.
 *
 * @returns The codec definitions.
 */
export function getRegisteredCodecs(): CodecDefinition[];

/**
 * Returns the compression methods supported in the current environment and configuration: the
 * built-in methods followed by the codecs registered with {@link registerCodec}, in registration
 * order.
 *
 * @remarks
 * The support of the built-in methods is resolved against the compression streams available when
 * the function is called, i.e. the classes set with {@link configure} and the implementations
 * embedded in the build. A caller can test whether an entry is readable by looking up
 * {@link EntryMetaData#compressionMethod} in the result and checking
 * {@link EntryMetaData#encrypted}; `FileEntry#getData` remains the authority.
 *
 * @returns The supported compression methods.
 */
export function getSupportedCompressionMethods(): SupportedCompressionMethod[];

/**
 * Represents the support of a compression method, see {@link getSupportedCompressionMethods}.
 */
export interface SupportedCompressionMethod {
  /**
   * The compression method stored in zip entry headers (e.g. `8` for Deflate).
   */
  compressionMethod: number;
  /**
   * `true` if entries can be compressed with the method. It is `undefined` when the support is
   * unknown, i.e. for a codec registered with {@link CodecDefinition#codecURI} whose module has not
   * been imported yet.
   */
  compression?: boolean;
  /**
   * `true` if entries can be decompressed with the method. It is `undefined` when the support is
   * unknown, i.e. for a codec registered with {@link CodecDefinition#codecURI} whose module has not
   * been imported yet.
   */
  decompression?: boolean;
  /**
   * `true` if the method comes from a codec registered with {@link registerCodec}.
   */
  registered: boolean;
}

/**
 * Represents a codec definition passed to {@link registerCodec}.
 */
export interface CodecDefinition {
  /**
   * The compression method stored in zip entry headers (e.g. `93` for Zstandard). The values `0`
   * (store), `8` (deflate), `9` (deflate64) and `99` (AES) are reserved.
   */
  compressionMethod: number;
  /**
   * The format name identifying the codec (e.g. `"zstd"`). It is passed as the first argument to
   * the constructors of `CompressionStream` and `DecompressionStream`.
   */
  format: string;
  /**
   * The URL of a module exporting the `CompressionStream` and/or `DecompressionStream` classes of
   * the codec. Relative URLs are resolved against {@link Configuration#baseURI}; passing an absolute
   * URL (e.g. via `import.meta.resolve()`) is recommended.
   *
   * @remarks
   * The module is imported dynamically at runtime. Bundlers and single-file builds (e.g.
   * `deno compile`) cannot follow this import, so the module must be included explicitly
   * (e.g. with `deno compile --include` or the equivalent option of the bundler).
   */
  codecURI?: string;
  /**
   * The stream implementation used to compress data, constructed with `(format, options)`, see
   * {@link CompressionStreamOptions}.
   */
  CompressionStream?: typeof CompressionStreamLike;
  /**
   * The stream implementation used to decompress data, constructed with `(format, options)`, see
   * {@link DecompressionStreamOptions}.
   */
  DecompressionStream?: typeof DecompressionStreamLike;
  /**
   * The minimum "version needed to extract" value written in zip entry headers (e.g. `63` for
   * Zstandard).
   */
  versionNeeded?: number;
}

/**
 * Represents the options passed as the second argument to the constructor of the classes
 * compressing data, i.e. {@link CodecDefinition#CompressionStream},
 * {@link Configuration#CompressionStream} and {@link Configuration#CompressionStreamFallback}.
 */
export interface CompressionStreamOptions {
  /**
   * The compression level, see {@link ZipWriterConstructorOptions#level}.
   */
  level?: number;
  /**
   * The size of the chunks in bytes, see {@link Configuration#chunkSize}.
   */
  chunkSize?: number;
  /**
   * The compression method of the entry. It allows codecs registered for several methods sharing
   * the same format to distinguish them (e.g. Reduce, methods 2 to 5).
   *
   * It is only set for the codecs registered with {@link registerCodec}.
   */
  compressionMethod?: number;
  /**
   * The uncompressed size of the entry, undefined when the size is unknown.
   * It allows codecs such as Zstandard to include the content size in the compressed frame.
   *
   * It is only set for the codecs registered with {@link registerCodec}.
   */
  uncompressedSize?: number;
}

/**
 * Represents the options passed as the second argument to the constructor of the classes
 * decompressing data, i.e. {@link CodecDefinition#DecompressionStream},
 * {@link Configuration#DecompressionStream} and {@link Configuration#DecompressionStreamFallback}.
 */
export interface DecompressionStreamOptions {
  /**
   * The size of the chunks in bytes, see {@link Configuration#chunkSize}.
   */
  chunkSize?: number;
  /**
   * `true` when the data is compressed with the Deflate64 method, the format passed as the first
   * argument being `"deflate64-raw"` instead of `"deflate-raw"`.
   *
   * It is only set for the classes decompressing the deflate methods, i.e.
   * {@link Configuration#DecompressionStream} and {@link Configuration#DecompressionStreamFallback}.
   */
  deflate64?: boolean;
  /**
   * The compression method of the entry. It allows codecs registered for several methods sharing
   * the same format to distinguish them (e.g. Reduce, methods 2 to 5).
   *
   * It is only set for the codecs registered with {@link registerCodec}.
   */
  compressionMethod?: number;
  /**
   * The general purpose bit flag of the entry, which some methods need to decode the data (e.g. the
   * dictionary size and the number of trees of Implode, or the presence of the end-of-stream marker
   * of LZMA).
   *
   * It is only set for the codecs registered with {@link registerCodec}.
   */
  rawBitFlag?: number;
  /**
   * The uncompressed size of the entry declared in its header, undefined when the size is unknown.
   * It allows size-driven decoders (e.g. Shrink, Reduce, Implode, LZMA without end-of-stream
   * marker) to stop at the exact output size instead of decoding trailing padding bits.
   *
   * It is only set for the codecs registered with {@link registerCodec}.
   */
  uncompressedSize?: number;
}

/**
 * Represents the configuration passed to {@link configure}.
 */
export interface Configuration extends WorkerConfiguration {
  /**
   * The maximum number of web workers used to compress/decompress data simultaneously.
   *
   * It must be an integer greater than 0, see {@link ERR_INVALID_MAX_WORKERS}.
   *
   * @defaultValue `navigator.hardwareConcurrency`, or 2 when the environment does not provide it
   */
  maxWorkers?: number;
  /**
   * The delay in milliseconds before idle web workers are automatically terminated. You can call `terminateWorkers()` to terminate idle workers.
   *
   * @defaultValue 5000
   */
  terminateWorkerTimeout?: number;
  /**
   * The delay in milliseconds after which the oldest pending compression/decompression task is run without a web worker when no task completes.
   *
   * It prevents deadlocks when entries read from a `ZipReader` are added concurrently into a `ZipWriter` and all the web workers are waiting for data.
   *
   * @defaultValue 5000
   */
  workerStarvationTimeout?: number;
  /**
   * The delay in milliseconds before a newly created web worker which has not sent any message is considered dead, terminated, and replaced with inline processing.
   *
   * It allows recovering from environments where web workers fail silently, e.g. extension pages blocking worker scripts via their Content Security Policy.
   *
   * @defaultValue 5000
   */
  workerStartupTimeout?: number;
  /**
   * The base URL against which the relative URIs are resolved, i.e. {@link Configuration#workerURI},
   * {@link Configuration#wasmURI} and {@link CodecDefinition#codecURI}.
   *
   * @defaultValue the URL of the module of zip.js
   */
  baseURI?: string;
  /**
   * The URI of the web worker.
   *
   * It allows using alternative deflate implementations or specifying a URL to the worker script if the CSP of the page blocks scripts imported from a Data URI.
   *
   * Here is an example to import the worker module as a URL (see `?url`) and avoid CSP issues:
   * ```
   * import workerURI from "@zip.js/zip.js/dist/zip-web-worker.js?url";
   *
   * configure({
   *   workerURI
   * });
   * ```
   *
   * The worker is created as a module worker, unless the URI is a Data URI or a Blob URI, in which case it is created as a classic
   * worker. See {@link Configuration#createWorker} for an example of classic worker script installing a polyfill of the Streams API.
   *
   * @defaultValue "./core/web-worker-wasm.js", or "./core/web-worker-native.js" for the builds using the native implementations
   */
  workerURI?: string;
  /**
   * The function used to create the web workers, taking precedence over `workerURI`.
   *
   * It lets bundlers detect the worker script statically and compile it with its imports, e.g. a custom worker script embedding alternative compression streams.
   *
   * Here is an example with a custom worker script (see {@link initWorker} for the content of the script):
   * ```
   * configure({
   *   createWorker: () => new Worker(new URL("./zip-worker.js", import.meta.url), { type: "module" })
   * });
   * ```
   *
   * It is also the way to run the web workers on engines where `TransformStream` is missing from the scope of the workers, e.g. Firefox
   * before version 102. There, the worker script of zip.js throws when it is evaluated and the data is silently compressed/decompressed
   * in the main scope instead. A polyfill imported by the page does not help, because the worker reads the globals of the Streams API
   * from its own scope, so it has to be installed by the worker itself before the worker script of zip.js runs. These engines predate
   * the support of module workers, hence the classic worker script below:
   * ```
   * // zip-worker-with-polyfill.js
   * importScripts("./web-streams-polyfill.js", "./zip-web-worker.js");
   * ```
   * ```
   * configure({
   *   createWorker: () => new Worker("./zip-worker-with-polyfill.js")
   * });
   * ```
   */
  createWorker?: () => Worker;
  /**
   * The URI of the WebAssembly module used by default implementations to compress/decompress data. It is ignored if `useCompressionStream` is set to `true` and `CompressionStream`/`DecompressionStream` are supported by the environment.
   *
   * Here is an example to import the WASM module as a URL (see `?url`) and avoid CSP issues:
   * ```
   * import wasmURI from "@zip.js/zip.js/dist/zip-module.wasm?url";
   *
   * configure({
   *   wasmURI
   * });
   * ```
   *
   * @defaultValue "./core/streams/zlib-wasm/zlib-streams.wasm"
   */
  wasmURI?: string;
  /**
   * The size of the chunks in bytes during data compression/decompression.
   *
   * Values lower than 64 are raised to 64, and a value that is not an integer greater than 0 is replaced with the default
   * value.
   *
   * @defaultValue 65536
   */
  chunkSize?: number;
  /**
   * The stream implementation used to compress data when `useCompressionStream` is set to `true`.
   *
   * @defaultValue the global `CompressionStream`, or `false` when the environment does not provide it
   */
  CompressionStream?: typeof CompressionStreamLike;
  /**
   * The stream implementation used to decompress data when `useCompressionStream` is set to `true`.
   *
   * @defaultValue the global `DecompressionStream`, or `false` when the environment does not provide it
   */
  DecompressionStream?: typeof DecompressionStreamLike;
  /**
   * The stream implementation used to compress data when `useCompressionStream` is set to `false`.
   *
   * @defaultValue the implementation embedded in the entry point that was imported, e.g. the WebAssembly one
   */
  CompressionStreamFallback?: typeof CompressionStreamLike;
  /**
   * The stream implementation used to decompress data when `useCompressionStream` is set to `false`.
   *
   * @defaultValue the implementation embedded in the entry point that was imported, e.g. the WebAssembly one
   */
  DecompressionStreamFallback?: typeof DecompressionStreamLike;
  /**
   * @deprecated Use {@link Configuration#CompressionStreamFallback} instead.
   */
  CompressionStreamZlib?: typeof CompressionStreamLike;
  /**
   * @deprecated Use {@link Configuration#DecompressionStreamFallback} instead.
   */
  DecompressionStreamZlib?: typeof DecompressionStreamLike;
}

/**
 * Represents configuration passed to {@link configure}, the constructor of {@link ZipReader}, {@link FileEntry#getData}, the constructor of {@link ZipWriter}, and {@link ZipWriter#add}.
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
   * When compressing, the native API is only used when `level` is undefined or equal to 6, see {@link ZipWriterConstructorOptions#level}.
   *
   * @defaultValue true
   */
  useCompressionStream?: boolean;
  /**
   * `true` to transfer stream ownership to web workers.
   *
   * @defaultValue true
   */
  transferStreams?: boolean;
}

/**
 * Terminates all the web workers
 */
export function terminateWorkers(): Promise<void>;

/**
 * Initializes a custom web worker script. This function is exposed by the `@zip.js/zip.js/worker` entry point and must be called
 * in the worker script created by {@link Configuration#createWorker} or referenced by {@link Configuration#workerURI}.
 *
 * Here is a complete example of a worker script using fflate as the compression engine, e.g. to reduce the bundle size:
 * ```
 * import { initWorker } from "@zip.js/zip.js/worker";
 * import { Deflate, Inflate } from "fflate";
 *
 * const FORMAT_DEFLATE_RAW = "deflate-raw";
 *
 * class FflateStream extends TransformStream {
 *   constructor(codec) {
 *     super({
 *       start(controller) {
 *         codec.ondata = chunk => {
 *           if (chunk.length) {
 *             controller.enqueue(chunk);
 *           }
 *         };
 *       },
 *       transform(chunk) {
 *         codec.push(chunk);
 *       },
 *       flush() {
 *         codec.push(new Uint8Array(0), true);
 *       }
 *     });
 *   }
 * }
 *
 * class CompressionStreamFallback extends FflateStream {
 *   constructor(format, { level } = {}) {
 *     checkFormat(format);
 *     super(new Deflate(level === undefined ? {} : { level }));
 *   }
 * }
 *
 * class DecompressionStreamFallback extends FflateStream {
 *   constructor(format) {
 *     checkFormat(format);
 *     super(new Inflate());
 *   }
 * }
 *
 * function checkFormat(format) {
 *   if (format != FORMAT_DEFLATE_RAW) {
 *     throw new TypeError("Unsupported compression format: " + format);
 *   }
 * }
 *
 * initWorker({ CompressionStreamFallback, DecompressionStreamFallback });
 * ```
 */
export function initWorker(options?: {
  /**
   * The stream implementation used to compress data when `useCompressionStream` is set to `false` or when `CompressionStream` is unsupported.
   */
  CompressionStreamFallback?: typeof CompressionStreamLike;
  /**
   * The stream implementation used to decompress data when `useCompressionStream` is set to `false` or when `DecompressionStream` is unsupported.
   */
  DecompressionStreamFallback?: typeof DecompressionStreamLike;
  /**
   * The function called before resolving the stream implementations, e.g. to load a WebAssembly module.
   */
  init?(config: Configuration): Promise<unknown> | unknown;
}): void;

/**
 * Returns the MIME type corresponding to a filename extension.
 *
 * @param fileExtension the extension of the filename.
 * @returns The corresponding MIME type.
 */
export function getMimeType(fileExtension: string): string;

/**
 * A `TransformStream`-like temporary buffer returned by a {@link ZipWriterConstructorOptions.createTempStream} factory.
 */
export interface TempStream {
  /**
   * The writable side, receiving the compressed data of a buffered entry.
   */
  writable: WritableStream;
  /**
   * The readable side, replayed into the final zip stream once the entry is ready.
   */
  readable: ReadableStream;
  /**
   * Optional cleanup, called once the entry has been processed (on success, error, or abort) to release any backing resource.
   */
  dispose?: () => void | Promise<void>;
}

/**
 * Options for {@link createOPFSTempStream}.
 */
export interface OPFSTempStreamOptions {
  /**
   * Spill a buffered entry to a file once its buffered data exceeds this size, in bytes. Smaller entries stay in memory.
   *
   * @defaultValue 1048576
   */
  thresholdBytes?: number;
  /**
   * Name of the OPFS sub-directory holding the temporary files.
   *
   * @defaultValue ".zip.js-temp"
   */
  directoryName?: string;
  /**
   * Returns (or resolves to) the root `FileSystemDirectoryHandle`. Defaults to `navigator.storage.getDirectory()`.
   *
   * Provide it to run inside a worker with a pre-obtained handle, or to test against a mock.
   */
  getDirectory?: () => FileSystemDirectoryHandle | Promise<FileSystemDirectoryHandle>;
}

/**
 * Builds a {@link ZipWriterConstructorOptions.createTempStream} factory that spills the data of buffered entries to the Origin Private File System (OPFS) instead of keeping it in memory.
 *
 * An entry stays in memory until it exceeds `thresholdBytes`, then spills to a temporary OPFS file that is streamed back and deleted afterwards, so peak memory stays bounded on large buffered entries.
 *
 * OPFS is a browser/worker feature; feature-detect `navigator.storage.getDirectory` (or pass `getDirectory`) before using it, and let the writer use its in-memory default elsewhere.
 *
 * @param options The options.
 * @returns A factory suitable for {@link ZipWriterConstructorOptions.createTempStream}.
 */
export function createOPFSTempStream(options?: OPFSTempStreamOptions): () => Promise<TempStream>;

/**
 * Options for {@link createBlobTempStream}.
 */
export interface BlobTempStreamOptions {
  /**
   * Spill a buffered entry to a `Blob` once its buffered data exceeds this size, in bytes. Smaller entries stay in memory.
   *
   * @defaultValue 1048576
   */
  thresholdBytes?: number;
}

/**
 * Builds a {@link ZipWriterConstructorOptions.createTempStream} factory that spills the data of buffered entries into a `Blob` instead of keeping it in memory.
 *
 * An entry stays in memory until it exceeds `thresholdBytes`, then its data is transferred incrementally into a `Blob` built with `new Response(stream).blob()` and streamed back afterwards.
 * In Chromium-based browsers, `Blob` data is managed outside the page and paged to disk under memory pressure, so peak memory stays bounded on large buffered entries without any storage permission or cleanup obligation.
 * In Firefox, the `Blob` stays in memory but the helper still reduces peak memory usage moderately (roughly 30% on large entries) by releasing staged chunks earlier.
 * In Safari, building the `Blob` retains several copies of the staged data (roughly 4 times the entry size at peak); do not use this helper there.
 * In non-browser runtimes, the helper stays functional but roughly doubles peak memory usage (staged bytes plus their `Blob` copy).
 * Outside Chromium-based browsers, prefer {@link createOPFSTempStream} or a file-backed implementation.
 *
 * @param options The options.
 * @returns A factory suitable for {@link ZipWriterConstructorOptions.createTempStream}.
 */
export function createBlobTempStream(options?: BlobTempStreamOptions): () => TempStream;

/**
 * Builds a {@link ZipWriterConstructorOptions.createTempStream} factory that spills the data of buffered entries to the Origin Private File System (OPFS) via `FileSystemSyncAccessHandle` instead of keeping it in memory.
 *
 * This is the fastest disk-backed temporary storage on the web platform: it behaves like {@link createOPFSTempStream} (same options, same bounded-memory profile) but writes roughly 2.5 times faster in Chromium and Firefox and reads back several times faster in Firefox and Safari, making disk-backed staging nearly as fast as the in-memory default.
 *
 * `FileSystemSyncAccessHandle` is only exposed in dedicated workers, so this helper requires running the {@link ZipWriter} inside a worker; it throws when created in an unsupported context unless `getDirectory` is provided.
 *
 * @param options The options.
 * @returns A factory suitable for {@link ZipWriterConstructorOptions.createTempStream}.
 */
export function createSyncAccessHandleTempStream(options?: OPFSTempStreamOptions): () => TempStream;

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
  /**
   * `true` if the instance is initialized.
   */
  initialized?: boolean;
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
 *   readUint8Array(offset, length) {
 *     const result = new Uint8Array(length);
 *     for (let indexCharacter = 0; indexCharacter < length; indexCharacter++) {
 *       result[indexCharacter] = this.binaryString.charCodeAt(indexCharacter + offset) & 0xFF;
 *     }
 *     return result;
 *   }
 * }
 * ```
 *
 * @example
 * Reading a file on the filesystem with random access does not always require a custom {@link Reader}:
 * on runtimes exposing files as lazily-read `Blob` instances, the `Blob` returned by
 * `await fs.openAsBlob(path)` on Node.js or `Bun.file(path)` on Bun can be passed directly to
 * {@link ZipReader}. Deno has no equivalent API yet, see https://github.com/denoland/deno/issues/32316.
 * The class below reads a
 * `Deno.FsFile` with random access instead of buffering it entirely in memory. The `seek()` and `read()`
 * calls are serialized in a queue because zip.js can read multiple byte ranges concurrently:
 * ```
 * class FsFileReader extends Reader {
 *
 *   constructor(file) {
 *     super();
 *     this.file = file;
 *     this.queue = Promise.resolve();
 *   }
 *
 *   async init() {
 *     super.init();
 *     this.size = (await this.file.stat()).size;
 *   }
 *
 *   readUint8Array(offset, length) {
 *     const result = this.queue.then(async () => {
 *       await this.file.seek(offset, Deno.SeekMode.Start);
 *       const data = new Uint8Array(length);
 *       let bytesRead = 0;
 *       while (bytesRead < length) {
 *         const count = await this.file.read(data.subarray(bytesRead));
 *         if (count === null) {
 *           return data.subarray(0, bytesRead);
 *         }
 *         bytesRead += count;
 *       }
 *       return data;
 *     });
 *     this.queue = result.catch(() => undefined);
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
   * Creates a `ReadableStream` of the data, optionally restricted to a byte range.
   *
   * The default implementation reads the data with {@link Reader#readUint8Array}. Custom readers can
   * override this method to return a stream provided natively by the underlying data source.
   *
   * @param options The options.
   * @returns The `ReadableStream` instance.
   */
  createReadable(options?: CreateReadableOptions): ReadableStream<Uint8Array>;
  /**
   * Reads a chunk of data
   *
   * @param index The byte index of the data to read.
   * @param length The length of the data to read in bytes.
   * @returns A promise resolving to a chunk of data. The data must be trucated to the remaining size if the requested length is larger than the remaining size.
   */
  readUint8Array(index: number, length: number): Promise<Uint8Array>;
}

/**
 * Represents the options passed to {@link Reader#createReadable}.
 */
export interface CreateReadableOptions {
  /**
   * The byte offset of the start of the range to read.
   *
   * @defaultValue 0
   */
  offset?: number;
  /**
   * The size of the range to read in bytes (until the end of the data by default).
   */
  size?: number;
  /**
   * The size in bytes of the chunks emitted by the default implementation (the `chunkSize` value
   * of the global configuration by default).
   *
   * It is normalized like {@link Configuration#chunkSize}.
   */
  chunkSize?: number;
}

/**
 * Represents a {@link Reader} instance used to read data provided as a `string`.
 */
export class TextReader extends Reader<string> {}

/**
 * Represents a {@link Reader} instance used to read data provided as a `Blob` instance.
 */
export class BlobReader extends Reader<Blob> {}

/**
 * Represents a {@link Reader} instance used to read data provided as a Data URI `string` encoded in Base64.
 */
export class Data64URIReader extends Reader<string> {}

/**
 * Represents a {@link Reader} instance used to read data provided as a `Uint8Array` instance.
 */
export class Uint8ArrayReader extends Reader<Uint8Array> {}

/**
 * Represents a {@link Reader} instance used to read data provided as an array of {@link Reader} instances,
 * {@link ReadableReader} instances or `ReadableStream` instances (e.g. split zip files).
 *
 * @remarks Elements that only provide a `ReadableStream` are buffered when the reader is initialized, since
 * mapping a global offset onto a disk requires the size of every disk.
 */
export class SplitDataReader extends Reader<
  Reader<unknown>[] | ReadableReader[] | ReadableStream[]
> {}

/**
 * Represents a URL stored into a `string`.
 */
type URLString = string;

/**
 * Represents a {@link Reader} instance used to fetch data from a URL.
 */
export class HttpReader extends Reader<URLString> {
  /**
   * The URL of the data, as passed to the constructor.
   */
  url: URLString | URL;
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
   * Creates the {@link HttpRangeReader} instance.  It is particularly useful for reading ZIP files via HTTP.
   * If you just want to add content retrieved via HTTP to a ZIP file, you can simply use
   * `Response#body` {@link https://developer.mozilla.org/en-US/docs/Web/API/Response/body} instead.
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
   * Leaving it unset is not the same as setting it to `false` when {@link HttpOptions#useRangeHeader} or
   * {@link HttpOptions#forceRangeRequests} is set: the size is then read from a ranged `GET` request instead, and
   * only an explicit `false` restores the `HEAD` request.
   *
   * @defaultValue false, and `true` when {@link HttpOptions#useRangeHeader} or {@link HttpOptions#forceRangeRequests} is set
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
   * The function used to fetch the data. It takes precedence over {@link HttpRangeOptions#useXHR}
   * when set. The returned object must expose the `status`, `statusText` and `headers` properties,
   * and the `arrayBuffer()` method of the `Response` class.
   *
   * @defaultValue `fetch`
   */
  fetch?(input: string, init?: RequestInit): Promise<Response>;
  /**
   * The HTTP headers.
   */
  headers?: Iterable<[string, string]> | Map<string, string>;
  /**
   * `true` to throw an {@link ERR_HTTP_RESOURCE_CHANGED} error when the `ETag`, `Last-Modified` or total size headers
   * returned by a range request differ from the ones returned by the first range request, i.e. when the resource has
   * been modified while being read. Headers missing from the responses are ignored, note that `Access-Control-Expose-Headers`
   * must include them when the resource is fetched cross-origin.
   *
   * @defaultValue true
   */
  checkResourceChanges?: boolean;
  /**
   * The maximum size in bytes of the range requests sent to read the data of an entry. The data is
   * read with as many range requests as necessary, each response body being streamed, so that the
   * size of a request never depends on the size of the entry.
   *
   * @remarks
   * Because response bodies are streamed with backpressure, this value does not bound how much data
   * is buffered in memory; it bounds the byte span, and therefore the lifetime, of each individual
   * range request. Smaller windows keep each request short-lived, which avoids the idle or duration
   * timeouts enforced by servers, CDNs and proxies when a slow consumer holds a connection open, and
   * avoids relying on the server honoring very large ranges. Set it to `Infinity` to disable windowing
   * and read each entry with a single range request covering its whole remaining length.
   *
   * @defaultValue 16777216
   */
  maximumRangeSize?: number;
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
   * The number of bytes written into the instance. It is set to 0 before the first write and
   * updated as the data is written, so a writer needing the value (e.g. to compute the offset of a
   * disk) can read it. A value set before the first write is kept and used as the starting offset
   * instead of being reset to 0.
   */
  size?: number;
  /**
   * The maximum size of split data when creating a {@link ZipWriter} instance or when calling {@link FileEntry#getData} with a generator of {@link WritableWriter} instances.
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
 *   writeUint8Array(array) {
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
   * The number of bytes written into the instance.
   */
  size: number;
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
  writeUint8Array(array: Uint8Array): Promise<void>;
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
export class TextWriter implements Initializable, WritableWriter {
  /**
   * The `WritableStream` instance.
   */
  writable: WritableStream;
  /**
   * The number of bytes written into the instance.
   */
  size: number;
  /**
   * The encoding of the text returned by {@link TextWriter#getData}.
   */
  encoding?: string;
  /**
   * Initializes the instance asynchronously
   */
  init(): Promise<void>;
  /**
   * Creates the {@link TextWriter} instance
   *
   * @param encoding The encoding of the text.
   */
  constructor(encoding?: string);
  /**
   * Retrieves all the written data
   *
   * @returns A promise resolving to the written data.
   */
  getData(): Promise<string>;
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
   * The number of bytes written into the instance.
   */
  size: number;
  /**
   * The MIME type of the content, i.e. the type of the `Blob` instance returned by
   * {@link BlobWriter#getData}.
   */
  contentType?: string;
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
   * The MIME type of the content, i.e. the type declared by the Data URI returned by
   * {@link Data64URIWriter#getData}.
   */
  contentType?: string;
  /**
   * Creates the {@link Data64URIWriter} instance
   *
   * @param mimeString The MIME type of the content.
   */
  constructor(mimeString?: string);
}

/**
 * Represents a {@link Writer}  instance used to retrieve the written data from a generator of {@link WritableWriter}  instances  (i.e. split zip files).
 */
export class SplitDataWriter implements Initializable, WritableWriter {
  /**
   * The `WritableStream` instance.
   */
  writable: WritableStream;
  /**
   * The number of bytes written into the instance.
   */
  size: number;
  /**
   * The number of the disk being written.
   */
  diskNumber: number;
  /**
   * The byte offset of the disk being written.
   */
  diskOffset: number;
  /**
   * The maximum size of each disk in bytes.
   */
  maxSize: number;
  /**
   * The number of bytes still available on the disk being written.
   */
  availableSize: number;
  /**
   * Initializes the instance asynchronously
   */
  init(): Promise<void>;
  /**
   * Closes the disk being written, the next disk being opened when more data is written
   */
  closeDisk(): Promise<void>;
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
    maxSize?: number
  );
}

/**
 * Represents a {@link Writer} instance used to retrieve the written data as a `Uint8Array` instance.
 */
export class Uint8ArrayWriter extends Writer<Uint8Array<ArrayBuffer>> {
  /**
   * Creates the {@link Uint8ArrayWriter} instance
   *
   * @param defaultBufferSize The initial size of the internal buffer (default: 256KB).
   */
  constructor(defaultBufferSize?: number);
}

/**
 * Represents an instance used to create an unzipped stream.
 *
 * @remarks
 * The input is entirely read into a `Blob` before the first entry is emitted, because a zip file stores its
 * central directory at the end. This class is a convenience wrapper around {@link ZipReader} for stream
 * sources, it does not extract entries while the data is still arriving.
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
   * @remarks
   * Reading a zip file requires random access because the central directory located at the end of the
   * file is read first. A `ReadableStream` instance, or an object providing only a `readable` property
   * (e.g. a file handle), is therefore buffered entirely in memory when the instance is initialized. To
   * read a large seekable resource without buffering it, pass a custom {@link Reader} implementation
   * that reads the requested byte ranges directly, or a lazily-read `Blob` instance when the runtime
   * provides one, e.g. `await fs.openAsBlob(path)` on Node.js or `Bun.file(path)` on Bun. See
   * {@link Reader} for an example reading a `Deno.FsFile` with random access.
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
    options?: ZipReaderConstructorOptions
  );
  /**
   * The global comment of the zip file.
   *
   * @remarks
   * Unlike {@link EntryMetaData#comment}, it is exposed as raw bytes because the zip format defines no
   * way to record its encoding: section 4.4.26 of the zip specification says nothing about it, and the
   * end of central directory record has neither a general purpose bit flag nor an extra field, so the
   * language encoding flag (see Appendix D - Language Encoding (EFS)) cannot apply to it. Decode it with
   * the encoding agreed with the producer of the zip file.
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
   * The data of the digital signature record of the central directory (see
   * {@link ZipWriterCloseOptions#signCentralDirectory}), if the zip file contains one.
   *
   * @remarks
   * zip.js does not verify signatures. The signed data is the central directory records, read at
   * {@link ZipReader#directoryOffset}, and it never includes the digital signature record itself. Some writers
   * (e.g. SecureZIP) store that record inside {@link ZipReader#directoryLength}, so verifying the whole declared
   * range would always fail.
   */
  digitalSignature?: Uint8Array;
  /**
   * The offset of the central directory in the zip file.
   */
  directoryOffset?: number;
  /**
   * The length in bytes of the central directory as declared in the end of central directory record. Some
   * writers (e.g. SecureZIP) include the digital signature record in that length, so subtract
   * `6 + digitalSignature.length` from it when the record is stored inside the declared range.
   */
  directoryLength?: number;
  /**
   * The non-fatal diagnostics deposited while reading the entries, replaced every time
   * {@link ZipReader#getEntries} or {@link ZipReader#getEntriesGenerator} runs.
   *
   * @remarks
   * A warning reports a characteristic of the zip file observed in data the parse had already read: depositing
   * one never costs additional I/O, and a well-formed zip file deposits none. Each
   * {@link ArchiveWarning#reason} value is deposited at most once per call, with
   * {@link ArchiveWarning#filename} naming the first entry it applies to when it applies to an entry.
   *
   * Two kinds of reasons are deposited. Observations are always non-fatal: {@link WARNING_UNSORTED_CENTRAL_DIRECTORY},
   * {@link WARNING_UNKNOWN_VERSION} (the low byte of the "version needed to extract" field exceeds the highest
   * known zip specification version; the high byte is ignored because some writers store a host identifier in it),
   * {@link WARNING_COMPRESSED_PATCHED_DATA} (bit 5 of the general purpose bit flag),
   * {@link WARNING_MALFORMED_EXTRA_FIELD}, {@link WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA} and
   * {@link WARNING_WRAPPED_ENTRIES_COUNT}. The other reasons are the checks that
   * `strictness: "strict"` rejects with {@link ERR_AMBIGUOUS_ARCHIVE}: when the effective strictness tolerates
   * one of them and the evidence is already in hand, the same reason string is deposited as a warning instead —
   * {@link WARNING_APPENDED_DATA}, {@link WARNING_PREPENDED_DATA}, {@link WARNING_TRAILING_CENTRAL_DIRECTORY_DATA},
   * {@link WARNING_DUPLICATE_FILENAME} and {@link WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY}.
   *
   * The warnings related to the local file header of an entry are deposited on
   * {@link EntryMetaData#warnings} when its data is read, not here.
   */
  warnings?: ArchiveWarning[];
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
    options?: ZipReaderGetEntriesOptions
  ): AsyncGenerator<Entry, boolean>;
  /**
   * Closes the zip file
   *
   * @remarks It cancels the `ReadableStream` instance passed to the constructor when nothing has been read
   * from it, which is the only resource a {@link ZipReader} instance can hold. It does nothing otherwise: the
   * stream is already consumed once {@link ZipReader#getEntries} has read the entries into memory, and the
   * {@link Reader} instances are never closed, they belong to the caller. The entries returned by
   * {@link ZipReader#getEntries} can therefore still be read after calling it.
   */
  close(): Promise<void>;
}

/**
 * Returns `true` if the data looks like a zip file, i.e. if {@link ZipReader#getEntries} called on the same
 * data with the same options would locate the archive structure instead of throwing
 * {@link ERR_EOCDR_NOT_FOUND} or the {@link ERR_AMBIGUOUS_ARCHIVE} error caused by appended data.
 *
 * @remarks
 * The probe runs the same search as {@link ZipReader}: it locates the end of central directory record with
 * the end-anchored backward scan and verifies that a central directory record is stored where it points,
 * without parsing the entries. `true` therefore means the data is a plausible zip container, not that every
 * entry can be read: a truncated or otherwise damaged central directory is only detected by calling
 * {@link ZipReader#getEntries}. Formats built on zip, e.g. office documents or Java archives, return `true`.
 *
 * Like the {@link ZipReader} constructor, a `ReadableStream` or an object providing only a `readable`
 * property is buffered entirely in memory before probing, which defeats the purpose of a cheap probe; prefer
 * a seekable {@link Reader} input.
 *
 * @param reader The {@link Reader} instance used to read data.
 * @param options The options.
 * @returns A promise resolving to `true` if the data looks like a zip file.
 */
export function isZipFile(
  reader:
    | Reader<unknown>
    | ReadableReader
    | ReadableStream
    | Reader<unknown>[]
    | ReadableReader[]
    | ReadableStream[],
  options?: IsZipFileOptions
): Promise<boolean>;

/**
 * Represents the options passed to {@link isZipFile}.
 */
export interface IsZipFileOptions {
  /**
   * The tolerance of the probe, with the same semantics and default as
   * {@link ZipReaderConstructorOptions#strictness}: it selects the default amount of tolerated appended data
   * (0 for `"strict"`, 65536 bytes for `"balanced"`, unlimited for `"tolerant"`) and `"strict"` also returns
   * `false` when multiple end of central directory records reach the end of the data.
   *
   * @defaultValue "balanced"
   */
  strictness?: "strict" | "balanced" | "tolerant";
  /**
   * The maximum number of bytes tolerated after the end of central directory record, overriding the default
   * selected by {@link IsZipFileOptions#strictness}, with the same semantics as
   * {@link ZipReaderConstructorOptions#maxAppendedDataSize}.
   */
  maxAppendedDataSize?: number;
}

/**
 * Represents the options passed to the constructor of {@link ZipReader}, and `{@link ZipDirectory}#import*`.
 */
export interface ZipReaderConstructorOptions
  extends ZipReaderOptions,
    GetEntriesOptions,
    WorkerConfiguration {
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
  extends GetEntriesOptions,
    EntryOnprogressOptions {}

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
   * @param type The type of the decoded text, `"filename"` or `"comment"`.
   * @returns The decoded text value or `undefined` if the raw text value should be decoded by zip.js.
   */
  decodeText?(value: Uint8Array, encoding: string, type: "filename" | "comment"): string | undefined;
  /**
   * `true` to throw an {@link ERR_AMBIGUOUS_ARCHIVE} error when the archive could be parsed differently by other
   * tools. This detects data before or after the zip structure (e.g. a self-extracting archive stub or a
   * concatenated archive), central directory records not accounted for by the end of central directory record, an
   * end of central directory record disagreeing with its zip64 counterpart, and duplicate filenames. When reading
   * the content of an entry, it also validates the local file header against the central directory record (see
   * {@link ZipReaderOptions#checkAmbiguity}).
   *
   * This is the boolean form of {@link GetEntriesOptions#strictness}: `true` means `"strict"` and `false` means
   * any value but `"strict"`. When both options are set, the value passed to {@link ZipReader#getEntries} takes
   * precedence over the value passed to the constructor of {@link ZipReader}, and `strictness` takes precedence
   * over `checkAmbiguity` when both are set at the same level. `false` downgrades an inherited `"strict"` value
   * to `"balanced"` and leaves an inherited `"tolerant"` value unchanged.
   *
   * @defaultValue false
   */
  checkAmbiguity?: boolean;
  /**
   * How tolerant the reader should be when the archive can be parsed in more than one way.
   *
   * - `"strict"`: reject anything another tool could interpret differently. The end of central directory
   * record must sit exactly at the end of the file, no data may precede the zip structure, and the local file
   * headers must agree with the central directory records. Equivalent to {@link GetEntriesOptions#checkAmbiguity}
   * set to `true`.
   * - `"balanced"`: select the last end of central directory record whose comment reaches the end of the file
   * and that points to a central directory, ignore stale records left by in-place updates as well as records
   * forged inside a comment, and tolerate a self-extracting stub or up to
   * {@link GetEntriesOptions#maxAppendedDataSize} bytes of appended data. Throw an {@link ERR_AMBIGUOUS_ARCHIVE}
   * error only when two or more records reach the end of the file and each points to a central directory, which
   * cannot be disambiguated. A record that reaches the end of the file but points to no central directory (an
   * empty archive) is only selected when no record points to one.
   * - `"tolerant"`: never reject a parseable archive, except when {@link GetEntriesOptions#maxAppendedDataSize}
   * is set explicitly and exceeded; recover by selecting the last end of central directory record that reaches
   * the end of the file and points to a central directory (or, failing that, the last one that reaches the end
   * of the file).
   *
   * @defaultValue "balanced"
   */
  strictness?: "strict" | "balanced" | "tolerant";
  /**
   * How strictly the filename of each entry should be validated. A rejected name throws an
   * {@link ERR_UNSAFE_FILENAME} error carrying the offending name in its `filename` property.
   *
   * - `"strict"`: reject the names rejected by `"balanced"`, plus the names that do not map cleanly to a file
   * path, i.e. empty names and names containing a `"."` path component or an empty one (e.g. `"a//b.txt"`).
   * - `"balanced"`: reject names that would escape the directory they are extracted into, i.e. names containing
   * a `".."` path component, and absolute names, i.e. names starting with `"/"`, with a drive letter (e.g.
   * `"C:/file.txt"`) or with two backslashes (UNC paths).
   * - `"tolerant"`: never reject a name.
   *
   * A backslash is never interpreted as a path separator: it is a valid filename character on UNIX systems, and
   * it also occurs as the trail byte of legitimate double-byte filenames (e.g. CP932) decoded with another
   * charset.
   *
   * Names are validated, never rewritten, so the filename reported for an entry always matches its central
   * directory record.
   *
   * @defaultValue The value of {@link GetEntriesOptions#strictness}.
   */
  filenameValidation?: "strict" | "balanced" | "tolerant";
  /**
   * The function called for normalizing the filename of each entry, e.g. to repair the names rejected by
   * {@link GetEntriesOptions#filenameValidation}.
   *
   * It is called with the decoded filename, after {@link GetEntriesOptions#decodeText} and before the name is
   * validated, so a name it fails to repair is still rejected. The returned name becomes the name of the entry:
   * it is used to detect directory entries by their trailing `"/"`, and to detect duplicate filenames when
   * {@link GetEntriesOptions#checkAmbiguity} is set, so two names normalized into the same name are reported as
   * an {@link ERR_AMBIGUOUS_ARCHIVE} error instead of silently shadowing each other. The raw filename remains
   * available in {@link EntryMetaData#rawFilename}.
   *
   * @param filename The decoded filename.
   * @returns The normalized filename or `undefined` to keep the decoded filename.
   */
  normalizeFilename?(filename: string): string | undefined;
  /**
   * The maximum number of bytes tolerated after the zip structure before the archive is rejected. Defaults to
   * `0` when {@link GetEntriesOptions#strictness} is `"strict"`, `65535` when it is `"balanced"`, and `Infinity`
   * when it is `"tolerant"`.
   *
   * An explicit value takes precedence over the strictness default at every level, so it can loosen `"strict"`
   * or reintroduce a rejection under `"tolerant"`. It also bounds how far back the end of central directory
   * record is searched for, so a value smaller than the amount of data actually appended surfaces an
   * {@link ERR_EOCDR_NOT_FOUND} error when the record lies beyond the searched region and an
   * {@link ERR_AMBIGUOUS_ARCHIVE} error otherwise.
   */
  maxAppendedDataSize?: number;
  /**
   * The function called for decrypting the central directory when it is encrypted (see the Strong Encryption
   * Specification in the ZIP format specification). Without this function, reading such an archive throws an
   * {@link ERR_ENCRYPTED_CENTRAL_DIRECTORY} error. zip.js provides the encrypted data and the related metadata
   * but does not implement the decryption itself.
   *
   * @param data The raw data stored in place of the central directory, i.e. the decryption header followed by
   * the encrypted (and possibly compressed) central directory, as stored in the zip file.
   * @param encryptionInfo The encryption metadata read from the Zip64 end of central directory record, or
   * `undefined` if the zip file does not contain a version 2 record.
   * @returns The decrypted and decompressed central directory records.
   */
  decryptCentralDirectory?(
    data: Uint8Array,
    encryptionInfo?: DirectoryEncryptionInfo
  ): Uint8Array | PromiseLike<Uint8Array>;
}

/**
 * Represents the encryption metadata of an encrypted central directory (see
 * {@link GetEntriesOptions#decryptCentralDirectory}), read from the version 2 Zip64 end of central directory
 * record.
 */
export interface DirectoryEncryptionInfo {
  /**
   * The raw data of the extensible data sector of the record.
   */
  rawExtensibleData: Uint8Array;
  /**
   * The compression method applied to the central directory before encryption.
   */
  compressionMethod?: number;
  /**
   * The size of the compressed and encrypted central directory.
   */
  compressedSize?: number;
  /**
   * The size of the central directory once decrypted and decompressed.
   */
  uncompressedSize?: number;
  /**
   * The identifier of the encryption algorithm (e.g. `0x6610` for AES-256).
   */
  encryptionAlgorithm?: number;
  /**
   * The key size in bits.
   */
  bitLength?: number;
  /**
   * The processing flags (e.g. `0x0001` for password-based encryption).
   */
  flags?: number;
  /**
   * The identifier of the hash algorithm used for the password validation data.
   */
  hashAlgorithm?: number;
  /**
   * The password validation data.
   */
  hashData?: Uint8Array;
}

/**
 * Represents options passed to the constructor of {@link ZipReader} and {@link FileEntry#getData}.
 */
export interface ZipReaderOptions {
  /**
   * How tolerant the reader should be when the local file header of an entry disagrees with its central
   * directory record. Any difference throws an {@link ERR_AMBIGUOUS_ARCHIVE} error.
   *
   * - `"strict"`: compare the filename, the general purpose bit flag, the compression method, the CRC-32
   * checksum and the sizes.
   * - `"balanced"`: compare everything except the filename.
   * - `"tolerant"`: compare nothing and trust the central directory record.
   *
   * Every field except the filename is read from the local file header anyway, to locate the entry data, so
   * the comparison `"balanced"` performs reads no additional bytes. Comparing the filename reads the filename
   * bytes as well, which costs one extra read per entry whenever the local file header carries no extra field
   * — the common case in practice. Use {@link ZipReaderOptions#checkLocalDirectory} to request or suppress the
   * whole comparison explicitly.
   *
   * @defaultValue "balanced"
   */
  strictness?: "strict" | "balanced" | "tolerant";
  /**
   * `true` to throw an {@link ERR_AMBIGUOUS_ARCHIVE} error when calling {@link FileEntry#getData} if the local
   * file header of the entry disagrees with its central directory record in a way that could make other tools
   * (e.g. streaming readers based on local file headers) interpret the entry differently. This detects mismatched
   * filenames, general purpose bit flags (encryption, data descriptor and language encoding flags), compression
   * methods, CRC-32 checksums and sizes. The extra fields are not compared because the zip specification allows
   * them to differ.
   *
   * This is the boolean form of {@link ZipReaderOptions#strictness}: `true` means `"strict"` and `false` means
   * any value but `"strict"`. When both options are set, the value passed to {@link FileEntry#getData} takes
   * precedence over the value passed to the constructor of {@link ZipReader}, and `strictness` takes precedence
   * over `checkAmbiguity` when both are set at the same level. `false` downgrades an inherited `"strict"` value
   * to `"balanced"` and leaves an inherited `"tolerant"` value unchanged.
   *
   * @defaultValue false
   */
  checkAmbiguity?: boolean;
  /**
   * `true` to validate the local file header of the entry against its central directory record when calling
   * {@link FileEntry#getData}, `false` to skip that validation. This is the entry-level half of
   * {@link ZipReaderOptions#checkAmbiguity}, exposed on its own so it can be enabled without the archive-level
   * checks and disabled without giving up the rest of {@link ZipReaderOptions#strictness}. It is the only way to
   * validate the local file headers of a self-extracting archive, since
   * {@link GetEntriesOptions#checkAmbiguity} rejects prepended data outright.
   *
   * `true` compares the filename as well, like {@link ZipReaderOptions#strictness} set to `"strict"`; `false`
   * compares nothing, like `"tolerant"`. An explicit value takes precedence over the strictness default at
   * every level.
   *
   * @defaultValue `true` when {@link ZipReaderOptions#strictness} is `"strict"` or `"balanced"`, `false` when
   * it is `"tolerant"`.
   */
  checkLocalDirectory?: boolean;
  /**
   * `true` to check only if the password is valid.
   *
   * @defaultValue false
   */
  checkPasswordOnly?: boolean;
  /**
   * `true` to verify the CRC-32 checksum of the entry against the value stored in the zip file. The verification
   * is run on the decompressed data and covers the whole read pipeline. It also applies to entries encrypted with
   * AES in AE-1 format. It is skipped for entries in AE-2 format because they store a zeroed CRC-32 value.
   *
   * @defaultValue false
   */
  checkCrc32?: boolean;
  /**
   * `true` to verify the authentication code of entries encrypted with AES. The verification detects encrypted
   * data tampered or corrupted after the encryption.
   *
   * @defaultValue true
   */
  checkAuthenticationCode?: boolean;
  /**
   * `true` to check the CRC-32 checksum of the entry.
   *
   * @deprecated Use {@link ZipReaderOptions#checkCrc32} instead.
   *
   * @defaultValue false
   */
  checkSignature?: boolean;
  /**
   * `true` to throw an {@link ERR_OVERLAPPING_ENTRY} error when calling {@link FileEntry#getData} if the entry
   *  overlaps with another entry on which {@link FileEntry#getData} has already been called (with the option
   * `checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`).
   *
   * @defaultValue false
   */
  checkOverlappingEntry?: boolean;
  /**
   * `true` to throw an {@link ERR_OVERLAPPING_ENTRY} error when calling {@link FileEntry#getData} if the entry
   *  overlaps with another entry on which {@link FileEntry#getData} has already been called (with the option
   * `checkOverlappingEntry` or  `checkOverlappingEntryOnly` set to `true`) without trying to read the content of the
   * entry.
   *
   * @defaultValue false
   */
  checkOverlappingEntryOnly?: boolean;
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
   * `true` to prevent closing of {@link WritableWriter#writable} when calling {@link FileEntry#getData}.
   *
   * @remarks
   * It only applies to the writable owned by the caller. It is ignored by the {@link Writer} instances
   * returning the written data, such as {@link BlobWriter} or {@link TextWriter}, whose writable is
   * created internally and must be closed for {@link Writer#getData} to resolve.
   *
   * @defaultValue false
   */
  preventClose?: boolean;
}

/**
 * Represents the parsed general purpose bit flag of an entry.
 */
export interface EntryBitFlag {
  /**
   * The compression option bits.
   */
  level: number;
  /**
   * `true` if the entry data is followed by a data descriptor.
   */
  dataDescriptor: boolean;
  /**
   * `true` if the filename and the comment are encoded in UTF-8 (EFS).
   */
  languageEncodingFlag: boolean;
}
/**
 * Represents an extra field record of an entry.
 */
export interface EntryExtraField {
  /**
   * The type (header id) of the extra field.
   */
  type: number;
  /**
   * The data of the extra field.
   */
  data: Uint8Array;
}
/**
 * Represents the AES extra field record of an entry.
 */
export interface EntryExtraFieldAES extends EntryExtraField {
  /**
   * The encryption strength (1, 2 or 3).
   */
  strength?: number;
  /**
   * The vendor version (1 for AE-1, 2 for AE-2). Entries in AE-1 format store the CRC-32 checksum of the content,
   * entries in AE-2 format store a zeroed value.
   */
  vendorVersion?: number;
  /**
   * The vendor identifier.
   */
  vendorId?: number;
  /**
   * The compression method stored in the header of the entry, i.e. `99` for a WinZip AES entry.
   */
  originalCompressionMethod?: number;
  /**
   * The real compression method of the entry, stored in the AES extra field because the header carries `99`
   * instead. This is the value reported by {@link EntryMetaData#compressionMethod}.
   */
  compressionMethod?: number;
}
/**
 * Represents a Unix extra field record storing timestamps: the Info-ZIP Unix type 1 extra field (0x5855),
 * written notably by macOS Archive Utility and `ditto`, or the PKWARE Unix extra field (0x000d). Both store
 * the last access/modification dates as 32-bit Unix times, followed by the optional uid/gid in the local
 * file header.
 */
export interface EntryExtraFieldUnixDates extends EntryExtraField {
  /**
   * The last access date.
   */
  lastAccessDate?: Date;
  /**
   * The last modification date.
   */
  lastModDate?: Date;
  /**
   * The Unix user id.
   */
  uid?: number;
  /**
   * The Unix group id.
   */
  gid?: number;
}
/**
 * Represents a Unicode path or comment extra field record of an entry.
 */
export interface EntryExtraFieldUnicode extends EntryExtraField {
  /**
   * `true` if the extra field is consistent with the entry metadata.
   */
  valid?: boolean;
  /**
   * The version of the extra field.
   */
  version?: number;
  /**
   * The filename stored in the extra field, when it is a Unicode path extra field (0x7075).
   */
  filename?: string;
  /**
   * The comment stored in the extra field, when it is a Unicode comment extra field (0x6375).
   */
  comment?: string;
}
/**
 * Represents the Zip64 extra field record of an entry. Each property is only defined when the matching field
 * of the header was set to its maximum value, i.e. when the real value had to be stored in the extra field.
 */
export interface EntryExtraFieldZip64 extends EntryExtraField {
  /**
   * The uncompressed size of the entry.
   */
  uncompressedSize?: number;
  /**
   * The compressed size of the entry.
   */
  compressedSize?: number;
  /**
   * The offset of the local file header of the entry.
   */
  offset?: number;
  /**
   * The number of the disk where the entry data starts.
   */
  diskNumberStart?: number;
}
/**
 * Represents the NTFS extra field record of an entry (0x000a), storing the dates as Windows `FILETIME` values.
 */
export interface EntryExtraFieldNTFS extends EntryExtraField {
  /**
   * The last modification date.
   */
  lastModDate?: Date;
  /**
   * The last access date.
   */
  lastAccessDate?: Date;
  /**
   * The creation date.
   */
  creationDate?: Date;
  /**
   * The last modification date (raw), as a Windows `FILETIME` value.
   */
  rawLastModDate?: bigint;
  /**
   * The last access date (raw), as a Windows `FILETIME` value.
   */
  rawLastAccessDate?: bigint;
  /**
   * The creation date (raw), as a Windows `FILETIME` value.
   */
  rawCreationDate?: bigint;
}
/**
 * Represents the extended timestamp extra field record of an entry (0x5455), storing the dates as 32-bit Unix
 * times. The central directory record only carries the last modification date, the local file header carries
 * the dates selected by the flags of the extra field.
 */
export interface EntryExtraFieldExtendedTimestamp extends EntryExtraField {
  /**
   * The last modification date.
   */
  lastModDate?: Date;
  /**
   * The last access date.
   */
  lastAccessDate?: Date;
  /**
   * The creation date.
   */
  creationDate?: Date;
  /**
   * The last modification date (raw), as a 32-bit Unix time.
   */
  rawLastModDate?: number;
  /**
   * The last access date (raw), as a 32-bit Unix time.
   */
  rawLastAccessDate?: number;
  /**
   * The creation date (raw), as a 32-bit Unix time.
   */
  rawCreationDate?: number;
}
/**
 * Represents a Unix extra field record storing ownership: the Info-ZIP "new" Unix extra field (0x7875), read
 * into {@link EntryMetaData#extraFieldInfoZip}, or the Info-ZIP "old" Unix extra field (0x7855), read into
 * {@link EntryMetaData#extraFieldUnix}.
 */
export interface EntryExtraFieldUnix extends EntryExtraField {
  /**
   * The version of the extra field, only defined for the Info-ZIP "new" Unix extra field (0x7875).
   */
  version?: number;
  /**
   * The Unix user id.
   */
  uid?: number;
  /**
   * The Unix group id.
   */
  gid?: number;
}
/**
 * Represents the data descriptor record written after the content of an entry, when
 * {@link EntryBitFlag#dataDescriptor} is set.
 */
export interface LocalDataDescriptor {
  /**
   * `true` if the record is preceded by its optional signature.
   *
   * The signature is not part of the original format, it is a later convention writers are free to follow. It is
   * reported as absent when the values following it disagree with the central directory, since the record is then
   * read as starting at the first byte.
   */
  signature: boolean;
  /**
   * The CRC-32 checksum stored in the record, which is allowed to differ from {@link EntryMetaData#crc32}.
   */
  crc32: number;
  /**
   * The compressed size stored in the record, which is allowed to differ from
   * {@link EntryMetaData#compressedSize}.
   */
  compressedSize: number;
  /**
   * The uncompressed size stored in the record, which is allowed to differ from
   * {@link EntryMetaData#uncompressedSize}.
   */
  uncompressedSize: number;
}

/**
 * Represents the local file header fields of an entry, read when getting the entry data.
 */
export interface LocalDirectory {
  /**
   * The "Version" field.
   */
  version: number;
  /**
   * `true` if the entry is encrypted.
   */
  encrypted: boolean;
  /**
   * The general purpose bit flag (raw).
   */
  rawBitFlag: number;
  /**
   * The general purpose bit flag.
   */
  bitFlag: EntryBitFlag;
  /**
   * The last modification date (raw).
   */
  rawLastModDate: number;
  /**
   * The last modification date.
   */
  lastModDate: Date;
  /**
   * The length of the filename in bytes.
   */
  filenameLength: number;
  /**
   * The length of the extra field in bytes.
   */
  extraFieldLength: number;
  /**
   * The byte offset of the entry data, i.e. {@link EntryMetaData#offset} plus the size of the local file header,
   * of the filename and of the extra field. It can be used with {@link Reader#createReadable} to read the stored
   * data directly, e.g. to serve ranged requests into an entry compressed with the `"store"` method.
   */
  dataOffset: number;
  /**
   * The extra field (raw).
   */
  rawExtraField: Uint8Array;
  /**
   * The extra field.
   */
  extraField?: Map<number, EntryExtraField>;
  /**
   * The filename of the entry stored in the local file header (raw), which is allowed to differ from
   * {@link EntryMetaData#rawFilename}.
   *
   * Only defined when the local filename has been read, i.e. when the {@link ZipReaderOptions#strictness} option
   * is set to `"strict"` or when the {@link ZipReaderOptions#checkLocalDirectory} option is set to `true`, since
   * reading it costs one read the central directory does not need.
   */
  rawFilename?: Uint8Array;
  /**
   * The data descriptor record written after the content, when the entry has one.
   *
   * Only defined when the record has been read, i.e. when the {@link ZipReaderOptions#checkOverlappingEntry} or
   * the {@link ZipReaderOptions#checkOverlappingEntryOnly} option is set to `true`, since the sizes stored in the
   * central directory make it unnecessary to read it otherwise.
   */
  dataDescriptor?: LocalDataDescriptor;
  /**
   * The CRC-32 checksum of the content.
   */
  crc32?: number;
  /**
   * The signature (CRC32 checksum) of the content.
   *
   * @deprecated Use {@link LocalDirectory#crc32} instead.
   */
  signature?: number;
  /**
   * The compressed size of the content.
   */
  compressedSize?: number;
  /**
   * The uncompressed size of the content.
   */
  uncompressedSize?: number;
  /**
   * The compression method.
   */
  compressionMethod?: number;
  /**
   * The Zip64 extra field.
   */
  extraFieldZip64?: EntryExtraFieldZip64;
  /**
   * The AES extra field.
   */
  extraFieldAES?: EntryExtraFieldAES;
  /**
   * The NTFS extra field.
   */
  extraFieldNTFS?: EntryExtraFieldNTFS;
  /**
   * The Info-ZIP Unix type 2 extra field (0x7855). Its uid/gid are stored in the local file header only, the
   * central directory version carries no data and merely flags their presence.
   */
  extraFieldUnix?: EntryExtraFieldUnix;
  /**
   * The Info-ZIP New Unix extra field (0x7875), storing variable-length uid/gid in both headers. It is read
   * whenever the type 2 extra field (0x7855) is absent or carries no ids, which is its usual state in the
   * central directory.
   */
  extraFieldInfoZip?: EntryExtraFieldUnix;
  /**
   * The Info-ZIP Unix type 1 extra field (0x5855).
   */
  extraFieldUnixType1?: EntryExtraFieldUnixDates;
  /**
   * The PKWARE Unix extra field (0x000d).
   */
  extraFieldPkwareUnix?: EntryExtraFieldUnixDates;
  /**
   * The extended timestamp extra field.
   */
  extraFieldExtendedTimestamp?: EntryExtraFieldExtendedTimestamp;
  /**
   * The Unicode path extra field.
   */
  extraFieldUnicodePath?: EntryExtraFieldUnicode;
  /**
   * The Unicode comment extra field.
   */
  extraFieldUnicodeComment?: EntryExtraFieldUnicode;
  /**
   * The USDZ extra field.
   */
  extraFieldUSDZ?: EntryExtraField;
}
/**
 * Represents an error raised while processing an archive or one of its entries, decorated with context.
 */
export interface EntryError extends Error {
  /**
   * `true` if the zip file is corrupted because the entry data could not be written entirely.
   */
  corruptedEntry?: boolean;
  /**
   * The entry whose data overlaps the data of the entry being read, set on the
   * {@link ERR_OVERLAPPING_ENTRY} error raised by {@link ZipReaderOptions#checkOverlappingEntry}.
   * It is the only way to identify the other entry of the pair.
   */
  overlappingEntry?: Entry;
  /**
   * The ambiguity that was detected, set on the {@link ERR_AMBIGUOUS_ARCHIVE} error raised by
   * {@link GetEntriesOptions#strictness}. See {@link ERR_AMBIGUOUS_ARCHIVE} for the values it takes.
   */
  reason?: string;
  /**
   * The id of the related {@link ZipEntry} (filesystem API).
   */
  entryId?: number;
  /**
   * The name of the related {@link ZipEntry}, or of the related `FileSystemHandle` when importing
   * one (filesystem API). Set by {@link ZipDirectoryEntry#addFileSystemHandle} and
   * {@link ZipDirectoryEntry#exportFileSystemHandle}, which rethrow the original error rather than
   * wrapping it, so its `message` stays comparable to the exported `ERR_*` constants.
   */
  entryName?: string;
  /**
   * The other entries that also failed, when {@link ZipDirectoryEntry#exportFileSystemHandle} runs
   * with `concurrent` set to `true` and more than one entry fails (filesystem API). The error it is
   * set on is not repeated in the list, and failures raised deeper in the tree are flattened into
   * it, so the list holds every failure of the export except this one.
   */
  entryErrors?: EntryError[];
  /**
   * The names of the files {@link ZipDirectoryEntry#exportFileSystemHandle} finished writing before
   * it failed, relative to the exported entry (filesystem API). Directories are not listed. Every
   * other file of the export is either missing or empty, so this is the only way to tell a file the
   * export completed from one it created but never filled.
   */
  exportedEntryNames?: string[];
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
   * `true` if the entry is an executable file
   *
   * Always `false` when {@link EntryMetaData#symlink} is `true`: the permissions of a symbolic link
   * are not meaningful, Unix systems store them as `0o777`.
   */
  executable: boolean;
  /**
   * `true` if the entry is a symbolic link, i.e. if the Unix file type stored in
   * {@link EntryMetaData#externalFileAttributes} is `S_IFLNK` (`0o120000`).
   *
   * The target of the link is the content of the entry, stored as a path with no trailing NUL
   * character. It is read like any other entry, e.g. with `entry.getData(new TextWriter())`.
   *
   * The path is not validated: it can be absolute or escape the archive with `..` segments. It must
   * be checked before being used to resolve a file.
   *
   * There is no option to write a symbolic link. Set the file type in
   * {@link ZipWriterConstructorOptions#unixMode} instead, i.e. pass `0o120777` with the path of the
   * target as the content of the entry.
   */
  symlink: boolean;
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
   * The last modification date (raw), as the MS-DOS date and time stored in the header. Unlike
   * {@link EntryMetaData#lastModDate}, it is not replaced by the value of the NTFS extra field when that field
   * is present; read {@link EntryMetaData#extraFieldNTFS} for the raw NTFS value.
   */
  rawLastModDate: number | bigint;
  /**
   * The last access date (raw), as the Windows `FILETIME` value stored in the NTFS extra field. Only defined
   * when that extra field is present.
   */
  rawLastAccessDate?: number | bigint;
  /**
   * The creation date (raw), as the Windows `FILETIME` value stored in the NTFS extra field. Only defined when
   * that extra field is present.
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
   * The CRC-32 checksum of the content. It is `undefined` when the zip file does not store it, e.g. for entries
   * encrypted with AES in AE-2 format.
   */
  crc32?: number;
  /**
   * The signature (CRC32 checksum) of the content. It is `undefined` for entries encrypted with AES returned by
   * {@link ZipWriter#add}.
   *
   * @deprecated Use {@link EntryMetaData#crc32} instead.
   */
  signature?: number;
  /**
   * The extra field.
   */
  extraField?: Map<number, { type: number; data: Uint8Array }>;
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
   * Note (MS-DOS / Unix attributes):
   *
   * - The single source of truth for on-disk metadata is the 32-bit `externalFileAttributes` value stored in
   *   the ZIP headers. The upper 16 bits are commonly used for Unix `st_mode` (type/permissions/special bits)
   *   and the low 8 bits for MS-DOS attribute flags.
   *
   * - Writer vs Reader:
   *   - The writer composes `externalFileAttributes` from the provided options (`externalFileAttributes`,
   *     `unixMode`/special flags, `msdosAttributesRaw`/`msdosAttributes`). An explicitly provided
   *     `externalFileAttributes` value is written verbatim (including `0`) unless mode-affecting options
   *     are also set.
   *   - The reader decodes the stored `externalFileAttributes` and exposes convenience fields such as
   *     `msdosAttributesRaw`, `msdosAttributes`, `unixExternalUpper`, and `unixMode`.
   *
   * - Practical rule: treat `externalFileAttributes` as authoritative; other fields are conveniences derived
   *   from it. If you need a specific on-disk value, set `externalFileAttributes` explicitly.
   */
  /**
   * The MS-DOS attributes low byte (raw).
   * This is the low 8 bits of {@link EntryMetaData#externalFileAttributes} when present.
   */
  msdosAttributesRaw?: number;
  /**
   * The MS-DOS attribute flags exposed as booleans.
   */
  msdosAttributes?: {
    readOnly: boolean;
    hidden: boolean;
    system: boolean;
    directory: boolean;
    archive: boolean;
  };
  /**
   * Unix owner id when available.
   *
   * The value is read from the central directory. The Info-ZIP Unix extra fields type 1 (0x5855) and type 2
   * (0x7855) store the ids in the local file header only, so entries carrying just these fields leave the
   * property undefined until the data has been read, at which point it is filled in from
   * {@link EntryMetaData#localDirectory}. The Info-ZIP New Unix extra field (0x7875) and the PKWARE Unix
   * extra field (0x000d) store the ids in both headers and are unaffected.
   *
   * @remarks A value read from the central directory is never overwritten by the local file header, since the
   * type 2 field truncates the ids to 16 bits while the New Unix field does not.
   */
  uid?: number;
  /**
   * Unix group id when available.
   *
   * See {@link EntryMetaData#uid} for the fields storing the ids in the local file header only.
   */
  gid?: number;
  /**
   * Unix mode (st_mode) when available.
   */
  unixMode?: number;
  /**
   * `true` if the setuid bit is set on the entry.
   */
  setuid?: boolean;
  /**
   * `true` if the setgid bit is set on the entry.
   */
  setgid?: boolean;
  /**
   * `true` if the sticky bit is set on the entry.
   */
  sticky?: boolean;
  /**
   * The internal file attributes (raw).
   */
  internalFileAttributes: number;
  /**
   * The 32-bit `externalFileAttributes` field is the authoritative on-disk metadata for each entry.
   * - Upper 16 bits: Unix mode/type (e.g., permissions, file type)
   * - Low 8 bits: MS-DOS file attributes (e.g., directory, read-only)
   *
   * When writing, all provided options are merged into this field. When reading, convenience fields are decoded from it.
   * For most use cases, prefer the high-level options and fields; only advanced users need to manipulate the raw value directly.
   */
  externalFileAttributes: number;
  /**
   * The upper 16-bit portion of {@link EntryMetaData#externalFileAttributes} when it represents Unix mode bits.
   */
  unixExternalUpper?: number;
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
  /**
   * The general purpose bit flag (raw).
   */
  rawBitFlag?: number;
  /**
   * The general purpose bit flag.
   */
  bitFlag?: EntryBitFlag;
  /**
   * The length of the filename in bytes.
   */
  filenameLength?: number;
  /**
   * The length of the extra field in bytes.
   */
  extraFieldLength?: number;
  /**
   * The Zip64 extra field.
   */
  extraFieldZip64?: EntryExtraFieldZip64;
  /**
   * The AES extra field.
   */
  extraFieldAES?: EntryExtraFieldAES;
  /**
   * The NTFS extra field.
   */
  extraFieldNTFS?: EntryExtraFieldNTFS;
  /**
   * The Info-ZIP Unix type 2 extra field (0x7855). Its uid/gid are stored in the local file header only, the
   * central directory version carries no data and merely flags their presence.
   */
  extraFieldUnix?: EntryExtraFieldUnix;
  /**
   * The Info-ZIP New Unix extra field (0x7875), storing variable-length uid/gid in both headers. It is read
   * whenever the type 2 extra field (0x7855) is absent or carries no ids, which is its usual state in the
   * central directory.
   */
  extraFieldInfoZip?: EntryExtraFieldUnix;
  /**
   * The Info-ZIP Unix type 1 extra field (0x5855).
   */
  extraFieldUnixType1?: EntryExtraFieldUnixDates;
  /**
   * The PKWARE Unix extra field (0x000d).
   */
  extraFieldPkwareUnix?: EntryExtraFieldUnixDates;
  /**
   * The extended timestamp extra field.
   */
  extraFieldExtendedTimestamp?: EntryExtraFieldExtendedTimestamp;
  /**
   * The Unicode path extra field.
   */
  extraFieldUnicodePath?: EntryExtraFieldUnicode;
  /**
   * The Unicode comment extra field.
   */
  extraFieldUnicodeComment?: EntryExtraFieldUnicode;
  /**
   * The USDZ extra field.
   */
  extraFieldUSDZ?: EntryExtraField;
  /**
   * The local file header fields, set when the entry data has been read.
   *
   * The local file header is the only place where the Info-ZIP Unix extra fields type 1 (0x5855) and type 2
   * (0x7855) store the uid/gid, so this is where they are read for entries carrying just these fields, e.g.
   * with `entry.localDirectory.extraFieldUnixType1.uid`. The values are not merged into
   * {@link EntryMetaData#uid} and {@link EntryMetaData#gid}, which are read from the central directory.
   */
  localDirectory?: LocalDirectory;
  /**
   * The non-fatal diagnostics deposited while reading the entry data, replaced every time the data is read.
   *
   * @remarks
   * The reasons deposited here relate to the local file header: {@link WARNING_MALFORMED_EXTRA_FIELD} when its
   * extra field data cannot be fully parsed, and — only when {@link ZipReaderOptions#checkLocalDirectory} is
   * disabled, e.g. with `strictness: "tolerant"` — the local file header mismatches the enabled check rejects
   * with {@link ERR_AMBIGUOUS_ARCHIVE}: {@link WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG},
   * {@link WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD} and
   * {@link WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES}. The archive-level warnings are deposited on
   * {@link ZipReader#warnings} instead.
   */
  warnings?: ArchiveWarning[];
}

/**
 * Represents a non-fatal diagnostic deposited on {@link ZipReader#warnings} or {@link EntryMetaData#warnings}.
 */
export interface ArchiveWarning {
  /**
   * The reason of the warning, one of the exported `WARNING_*` constants.
   */
  reason: string;
  /**
   * The filename of the first entry the warning applies to, when it applies to an entry.
   */
  filename?: string;
}

export interface DirectoryEntry extends EntryMetaData {
  /**
   * `true` if the entry is a directory.
   */
  directory: true;
}

export interface FileEntry extends EntryMetaData {
  /**
   * `false` if the entry is a file.
   */
  directory: false;
  /**
   * Returns the content of the entry
   *
   * @param writer The {@link Writer} instance used to write the content of the entry.
   * @param options The options.
   * @returns A promise resolving to the type to data associated to `writer`.
   */
  getData<Type>(
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
  /**
   * Retrieves the content of the entry as an `ArrayBuffer` instance
   *
   * @param options The options.
   * @returns A promise resolving to an `ArrayBuffer` instance.
   */
  arrayBuffer(options?: EntryGetDataOptions): Promise<ArrayBuffer>;
}

/**
 * Represents an entry with its data and metadata in a zip file (Core API).
 * This is a union type of {@link DirectoryEntry} and {@link FileEntry}.
 *
 * Before using getData, you should check if the entry is a file.
 *
 * @example
 *
 * ```ts
 * for await (const entry of reader.getEntriesGenerator()) {
 *   if (entry.directory) continue;
 *
 *   // entry is a FileEntry
 *   const plainTextData = await entry.getData(new TextWriter());
 *
 *   // Do something with the plainTextData
 * }
 * ```
 */
export type Entry = DirectoryEntry | FileEntry;

/**
 * Represents the options passed to {@link FileEntry#getData} and `{@link ZipFileEntry}.get*`.
 */
export interface EntryGetDataOptions
  extends EntryDataOnprogressOptions,
    ZipReaderOptions,
    WorkerConfiguration {}

/**
 * Represents the options passed to {@link FileEntry#getData} and `{@link ZipFileEntry}.get*`.
 */
export interface EntryGetDataCheckPasswordOptions extends EntryGetDataOptions {}

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
   * @param path The name of the stream when unzipped. Paths must use forward slashes ("/") as
   * separator (see {@link ZipWriter#add}).
   * @returns An object containing readable and writable properties
   */
  transform<T>(path: string): {
    readable: ReadableStream<T>;
    writable: WritableStream<T>;
  };

  /**
   * Returns a WritableStream for the .pipeTo method
   *
   * @param path The directory path of where the stream should exist in the zipped stream. Paths
   * must use forward slashes ("/") as separator (see {@link ZipWriter#add}).
   * @returns A WritableStream.
   */
  writable<T>(path: string): WritableStream<T>;

  /**
   * Writes the entries directory, writes the global comment, and returns the content of the zipped file.
   *
   * @remarks
   * If an entry could not be written, this method aborts the zipped stream with the error — the
   * readable side of the stream fails instead of ending — and throws it. The `entryErrors` property
   * of the thrown error contains the errors of all the failed entries.
   *
   * @param comment The global comment of the zip file.
   * @param options The options.
   * @returns The content of the zip file.
   */
  close(
    comment?: Uint8Array,
    options?: ZipWriterCloseOptions
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
    options?: ZipWriterConstructorOptions
  );
  /**
   * `true` if the zip contains at least one entry that has been partially written.
   */
  readonly hasCorruptedEntries?: boolean;

  /**
   * Adds the entries of an existing zip file into the current zip. This method can be called at any
   * time, including between calls to {@link ZipWriter#add} and repeatedly to merge several zip files.
   *
   * @remarks
   * The data of the zip file is copied, its central directory is rebuilt and its entries are relocated to
   * the positions they get in the output. The disks of a split zip file passed as input are therefore unrelated to
   * the disks of the output, which is a single zip file unless the writer is a split zip file writer. The data of
   * the entries is copied as-is; in particular, the constraints set by {@link ZipWriterConstructorOptions#usdz}
   * are not applied to the copied entries.
   *
   * Pending {@link ZipWriter#add} calls are completed before the data is copied, and add() calls made
   * while the copy is in progress are written after it. If an entry of the zip file has the same
   * filename as an entry of the current zip, the method throws with the `ERR_DUPLICATED_NAME` error
   * message and leaves the current zip unchanged; call {@link ZipWriter#remove} beforehand to resolve
   * the conflicts.
   *
   * The returned promise can safely be left un-awaited: {@link ZipWriter#close} waits for the copy
   * and throws its error if it was not caught.
   *
   * @param reader The {@link Reader} instance used to read the content of the zip file.
   * @returns A promise resolving when the zip file has been added.
   */
  appendZip<ReaderType>(
    reader:
      | Reader<ReaderType>
      | ReadableReader
      | ReadableStream
      | Reader<unknown>[]
      | ReadableReader[]
      | ReadableStream[]
  ): Promise<void>;

  /**
   * Adds an existing zip file at the beginning of the current zip. This method
   * cannot be called after the first call to {@link ZipWriter#add}.
   *
   * @deprecated Use {@link ZipWriter#appendZip} instead, which is equivalent when the zip file is
   * empty and can also be called after entries have been added.
   *
   * @param reader The {@link Reader} instance used to read the content of the zip file.
   * @returns A promise resolving when the zip file has been added.
   */
  prependZip<ReaderType>(
    reader:
      | Reader<ReaderType>
      | ReadableReader
      | ReadableStream
      | Reader<unknown>[]
      | ReadableReader[]
      | ReadableStream[]
  ): Promise<void>;

  /**
   * Adds an entry into the zip file
   *
   * @remarks
   * The returned promise can safely be left un-awaited: {@link ZipWriter#close} waits for the entry
   * and throws its error if it was not caught.
   *
   * @param filename The filename of the entry. Paths must use forward slashes ("/") as separator,
   * as required by section 4.4.17.1 of the zip specification. The value is stored as-is; in
   * particular, Windows path separators ("\\") are not converted and become part of the filename,
   * which is interpreted inconsistently by zip tools, and leading or trailing whitespace is
   * preserved, which Windows filesystems cannot represent at the end of a name.
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
    options?: ZipWriterAddDataOptions
  ): Promise<EntryMetaData>;

  /**
   * Removes an entry from the central directory that will be written for the zip file. The entry
   * data itself cannot be removed because it has already been streamed to the output.
   *
   * @param entry The entry to remove. This can be an {@link Entry} instance or the filename of the entry.
   * @returns `true` if the entry has been removed, `false` otherwise.
   */
  remove(entry: Entry | string): boolean;

  /**
   * Writes the entries directory, writes the global comment, and returns the content of the zip file
   *
   * @remarks
   * The global comment is passed as raw bytes and the comment of an entry
   * ({@link ZipWriterAddDataOptions#comment}) as a string on purpose, see {@link ZipReader#comment}.
   *
   * If {@link ZipWriter#add} or {@link ZipWriter#appendZip} calls failed and their rejection was
   * never handled — e.g. the returned promise was not awaited — this method throws the first of
   * these errors instead of finalizing the zip file. The `entryErrors` property of the thrown error
   * contains all of them. Errors already caught by the caller do not resurface here, so entries can
   * still be skipped by awaiting {@link ZipWriter#add} and catching the error. Throwing the errors
   * counts as reporting them: catching the error of this method and calling it again finalizes the
   * zip file without the failed entries.
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
  extends ZipWriterConstructorOptions,
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
   *
   * @remarks
   * It is a string, unlike the global comment passed to {@link ZipWriter#close}, because the encoding of
   * the comment of an entry is recorded in the header by the general purpose bit 11 (see Appendix D -
   * Language Encoding (EFS)), set by {@link ZipWriterConstructorOptions#useUnicodeFileNames}. Passing raw
   * bytes here throws {@link ERR_INVALID_ENTRY_COMMENT_TYPE} instead of writing their textual
   * representation.
   */
  comment?: string;
  /**
   * The extra field of the entry, written in the local file header and the central directory.
   */
  extraField?: Map<number, Uint8Array>;
  /**
   * The extra field of the entry written only in the local file header.
   */
  localExtraField?: Map<number, Uint8Array>;
  /**
   * The extra field of the entry written only in the central directory record.
   */
  centralExtraField?: Map<number, Uint8Array>;
  /**
   * The uncompressed size of the entry. This option is ignored if the {@link ZipWriterConstructorOptions#passThrough} option is not set to `true`.
   */
  uncompressedSize?: number;
  /**
   * The CRC-32 checksum of the content. This option is ignored if the {@link ZipWriterConstructorOptions#passThrough} option is not set to `true`.
   *
   * When the entry is AES-encrypted (see {@link ZipWriterConstructorOptions#encrypted}), setting this option marks the entry as AE-1
   * and stores the checksum in the entry headers, e.g. when copying an AE-1 entry read with the
   * {@link ZipReaderOptions#passThrough} option. Otherwise, the entry is marked as AE-2 and the checksum fields are set to 0.
   */
  crc32?: number;
  /**
   * The signature (CRC32 checksum) of the content. This option is ignored if the {@link ZipWriterConstructorOptions#passThrough} option is not set to `true`.
   *
   * @deprecated Use {@link ZipWriterAddDataOptions#crc32} instead.
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
  /**
   * The function called for signing the central directory. The returned data (e.g. a PKCS#7 signature computed
   * over the central directory records) is stored in a digital signature record written between the central
   * directory and the end of central directory record, and exposed by {@link ZipReader#digitalSignature} when
   * reading the zip file. It must not exceed 64KB, otherwise an {@link ERR_INVALID_SIGNATURE_DATA} error is
   * thrown. zip.js stores the data as-is and does not implement the signature computation itself.
   *
   * @param directory The raw data of the central directory records.
   * @returns The data of the digital signature record.
   */
  signCentralDirectory?(
    directory: Uint8Array
  ): Uint8Array | PromiseLike<Uint8Array>;
}

/**
 * Represents options passed to the constructor of {@link ZipWriter}, {@link ZipWriter#add} and `{@link ZipDirectoryEntry}#export*`.
 */
export interface ZipWriterConstructorOptions extends WorkerConfiguration {
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
   * The native API `CompressionStream` does not support compression levels. Any value other than 6,
   * its de facto level, disables `useCompressionStream` and compresses the data with the embedded
   * implementation instead. Note that the compressed data produced at a given level can still vary
   * between platforms. Set `useCompressionStream` to `false` to get deterministic output across
   * platforms.
   *
   * @defaultValue 6
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
   * An async factory function that returns a `TransformStream`-like object (`{ writable, readable }`) used as a temporary buffer when entries are written in parallel.
   *
   * When provided, this replaces the default in-memory `TransformStream` buffer, allowing data to be stored externally (e.g. filesystem, OPFS, network).
   * The `writable` side receives compressed entry data. The `readable` side is consumed when the entry is replayed into the final zip stream.
   * The optional `dispose` method is called once the entry has been processed (on success, error, or abort) so a resource-backed buffer can release its resource.
   *
   * See {@link createOPFSTempStream} for a ready-made OPFS-backed implementation, {@link createSyncAccessHandleTempStream} for a faster worker-only variant, and {@link createBlobTempStream} for a `Blob`-backed one.
   *
   * @remarks The `readable` side is consumed only once the `writable` side has been closed, since the local
   * header written before it holds the size and the CRC-32 of the entry. The object must therefore be able to
   * hold a whole entry, either by buffering it like the default
   * `new TransformStream(undefined, undefined, { highWaterMark: Infinity })` does, or by draining it like the
   * three implementations above do. A factory returning `new TransformStream()` deadlocks instead, its default
   * queuing strategy holding a single chunk.
   */
  createTempStream?: () => TempStream | Promise<TempStream>;
  /**
   * `true` to keep the order of the entry physically in the zip file.
   *
   * When set to `true`, the use of web workers will be improved.
   *
   * @defaultValue true
   */
  keepOrder?: boolean;
  /**
   * The password used to encrypt the content of the entry.
   *
   * @remarks
   * When a password is set and the {@link ZipWriterConstructorOptions#zipCrypto} option is not set to `true`, the
   * entry is encrypted in AES AE-2 format: the CRC-32 checksum of the content is stored as `0` so that the zip
   * file reveals no information about the encrypted content. A stored checksum would allow an attacker to verify
   * guessed content without knowing the password. The integrity of the data is guaranteed by the authentication
   * code instead.
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
   * @remarks
   * This option and the two below must be `Date` instances: a timestamp expressed in milliseconds, e.g.
   * {@link File#lastModified}, and an invalid `Date` are both rejected with {@link ERR_INVALID_DATE}. An
   * invalid `Date` used to be written as an entry carrying no timestamp at all.
   *
   * @defaultValue The current date.
   */
  lastModDate?: Date;
  /**
   * The last modification date, as its raw 32-bit MS-DOS date and time value.
   *
   * @remarks
   * The value is written verbatim into the local and central directory headers and takes precedence over
   * {@link ZipWriterConstructorOptions#lastModDate}, which still fills the extended timestamp and NTFS extra
   * fields. The filesystem API sets it when exporting entries with {@link ZipReaderOptions#passThrough} set in
   * {@link ZipDirectoryEntryExportOptions#readerOptions}, so that the entries copied as-is keep the exact date
   * and time of the source zip file.
   */
  rawLastModDate?: number;
  /**
   * The last access date.
   *
   * This option is ignored if the {@link ZipWriterConstructorOptions#extendedTimestamp} option is set to `false`.
   *
   * Unlike {@link ZipWriterConstructorOptions#lastModDate}, it has no default: the date is written only when the
   * option is set, so that the entries do not carry a meaningless access time.
   */
  lastAccessDate?: Date;
  /**
   * The creation date.
   *
   * This option is ignored if the {@link ZipWriterConstructorOptions#extendedTimestamp} option is set to `false`.
   *
   * Unlike {@link ZipWriterConstructorOptions#lastModDate}, it has no default: the date is written only when the
   * option is set, so that the entries do not carry a meaningless creation time.
   */
  creationDate?: Date;
  /**
   * `true` to store extended timestamp extra fields.
   *
   * When set to `false`, the maximum last modification date cannot exceed December 31, 2107 and the maximum accuracy is 2 seconds, dates being truncated to the whole second and odd seconds rounded up to the next even second.
   *
   * @defaultValue true
   */
  extendedTimestamp?: boolean;
  /**
   * `true` to always store the NTFS extra field, `false` to never store it.
   *
   * By default, the NTFS extra field is stored only when it preserves information the extended timestamp extra field cannot
   * represent: a last modification date outside its supported range, or explicit {@link ZipWriterConstructorOptions#lastAccessDate}
   * or {@link ZipWriterConstructorOptions#creationDate} values.
   *
   * This option is ignored if the {@link ZipWriterConstructorOptions#extendedTimestamp} option is set to `false`.
   */
  ntfsTimestamp?: boolean;
  /**
   * `true` to use the ZipCrypto algorithm to encrypt the content of the entry. Setting it to `true` will also
   * set the {@link ZipWriterConstructorOptions#dataDescriptor} to `true`.
   *
   * It is not recommended to set `zipCrypto` to `true` because the ZipCrypto encryption can be easily broken.
   *
   * @defaultValue false
   */
  zipCrypto?: boolean;
  /**
   * The "Version" field, i.e. the minimum version needed to extract the entry.
   *
   * @defaultValue the minimum version required by the features of the entry: 10 for entries stored without
   * compression or encryption, 20 for deflated, folder or ZipCrypto-encrypted entries, raised to 45 for Zip64
   * entries and 51 for AES-encrypted entries.
   */
  version?: number;
  /**
   * The "Version made by" field, whose upper byte is the platform and lower byte the version of the
   * specification.
   *
   * The platform is not taken from the value passed here. It is forced to Unix (`3`) when the entry carries Unix
   * metadata, i.e. when {@link ZipWriterConstructorOptions#uid}, {@link ZipWriterConstructorOptions#gid},
   * {@link ZipWriterConstructorOptions#unixMode} or {@link ZipWriterConstructorOptions#unixExtraFieldType} is set,
   * since Unix mode bits stored under another platform are ignored by the extractors. It is forced to MS-DOS (`0`)
   * when {@link ZipWriterConstructorOptions#msdosAttributes} or
   * {@link ZipWriterConstructorOptions#msdosAttributesRaw} is set. Only the lower byte of the value survives in
   * both cases.
   *
   * @defaultValue 768, i.e. `3 << 8`, or 20 when {@link ZipWriterConstructorOptions#msDosCompatible} is set to `true`
   */
  versionMadeBy?: number;
  /**
   * `true` to mark the file names as UTF-8 setting the general purpose bit 11 in the header (see Appendix D -
   * Language Encoding (EFS)), `false` to mark the names as compliant with the original IBM Code Page 437.
   *
   * Note that this option only sets the flag, it does not ensure that the file names are in the correct
   * encoding: when it is set to `false`, the names are still encoded in UTF-8 unless the
   * {@link ZipWriterConstructorOptions#encodeText} option is also set to encode them in the intended code page.
   *
   * @defaultValue true
   */
  useUnicodeFileNames?: boolean;
  /**
   * `true` to add a data descriptor.
   *
   * When set to `false`, the {@link ZipWriterConstructorOptions#bufferedWrite} option will automatically be
   * set to `true`. It will be automatically set to `false` when it is `undefined` and the
   * {@link ZipWriterConstructorOptions#bufferedWrite} option is set to `true`, or when the entry is a folder
   * or an empty entry stored without compression or encryption, since the header can then carry the sizes and
   * the CRC-32 directly. It will be automatically set to `true` when the
   * {@link ZipWriterConstructorOptions#zipCrypto} option is set to `true`. Otherwise, the default value is `true`.
   */
  dataDescriptor?: boolean;
  /**
   * `true` to add the signature of the data descriptor.
   *
   * @defaultValue true
   */
  dataDescriptorSignature?: boolean;
  /**
   * `true` to write {@link EntryMetaData#externalFileAttributes} in MS-DOS format for folder entries.
   *
   * It also selects the MS-DOS platform for {@link ZipWriterConstructorOptions#versionMadeBy} and leaves the Unix
   * attributes out of the entries. Setting any Unix metadata option, e.g.
   * {@link ZipWriterConstructorOptions#unixMode} or {@link ZipWriterAddDataOptions#executable}, turns it back off, and setting
   * {@link ZipWriterConstructorOptions#msdosAttributesRaw} or {@link ZipWriterConstructorOptions#msdosAttributes}
   * turns it on, overriding an explicit `false`.
   *
   * MS-DOS era extractors, e.g. PKUNZIP 2.04g, only honor the directory attribute of entries declaring the
   * MS-DOS platform. Without this option, they extract folder entries as zero-length files, which can then
   * prevent extracting the files stored below the folders.
   *
   * @defaultValue false
   */
  msDosCompatible?: boolean;
  /**
   * The external file attribute.
   *
   * When set explicitly, the value is written verbatim (including `0`), unless `unixMode`, `setuid`, `setgid`
   * or `sticky` is also set, in which case these options override the upper 16 bits while the lower 16 bits
   * are preserved. When omitted, the value is derived from the other options (e.g. the MS-DOS directory
   * attribute for folder entries, Unix default permissions when `msDosCompatible` is `false`).
   */
  externalFileAttributes?: number;
  /**
   * The external file attribute.
   *
   * @deprecated Use {@link ZipWriterConstructorOptions#externalFileAttributes} instead.
   */
  externalFileAttribute?: number;
  /**
   * The Unix owner id to write in the Unix extra field or as part of the external attributes.
   */
  uid?: number;
  /**
   * The Unix group id to write in the Unix extra field or as part of the external attributes.
   */
  gid?: number;
  /**
   * The Unix mode (st_mode bits) to use when writing external attributes.
   *
   * The value includes the Unix file type, so it is also how a symbolic link is written: pass
   * `0o120777` and use the path of the link target as the content of the entry. Extractors that
   * support symbolic links, e.g. Info-ZIP `unzip`, then restore the entry as a link.
   *
   * A folder entry is always written with `S_IFDIR` (`0o040000`), replacing any file type carried by the
   * value, so the same mode can be set once on the writer and reused for every entry. Any other entry keeps
   * the file type it is given, and is written with `S_IFREG` (`0o100000`) when the value carries none. Set
   * {@link ZipWriterConstructorOptions#externalFileAttributes} instead to write a mode with no
   * file type.
   */
  unixMode?: number;
  /**
   * `true` to set the setuid bit when writing the Unix mode.
   */
  setuid?: boolean;
  /**
   * `true` to set the setgid bit when writing the Unix mode.
   */
  setgid?: boolean;
  /**
   * `true` to set the sticky bit when writing the Unix mode.
   */
  sticky?: boolean;
  /**
   * Which Unix extra field format to write when creating entries that include Unix metadata.
   * - "infozip": Info-ZIP New Unix extra field (0x7875), storing variable-length uid/gid up to 32 bits.
   * - "unix": Info-ZIP Unix extra field type 2 (0x7855), storing fixed 2-byte uid/gid (0..65535); a
   *   larger uid or gid is rejected. The Unix mode is not part of this field; it is written to the
   *   external file attributes.
   *
   * When {@link ZipFS} exports imported entries, their uid/gid are re-emitted as "infozip" regardless
   * of the field type found in the imported zip file, unless this option is set explicitly.
   */
  unixExtraFieldType?: "infozip" | "unix";
  /**
   * The internal file attribute.
   *
   * @defaultValue 0
   */
  internalFileAttributes?: number;
  /**
   * The internal file attribute.
   *
   * @deprecated Use {@link ZipWriterConstructorOptions#internalFileAttributes} instead.
   */
  internalFileAttribute?: number;
  /**
   * When provided, the low 8-bit MS-DOS attributes to write into external file attributes.
   * Must be an integer between 0 and 255.
   *
   * @remarks
   * Setting this option or {@link ZipWriterConstructorOptions#msdosAttributes} selects the MS-DOS platform for
   * the entry exactly as {@link ZipWriterConstructorOptions#msDosCompatible} does, and overrides that option
   * when it is explicitly set to `false`. {@link EntryMetaData#versionMadeBy} then loses its Unix upper byte
   * and no Unix mode is written, so the `0o100644` of a file entry and the `0o040755` of a folder entry are
   * lost. What counts is that the option is provided, not its value: `0` and `{}` trigger it too.
   *
   * Setting any Unix metadata option, i.e. {@link ZipWriterConstructorOptions#uid},
   * {@link ZipWriterConstructorOptions#gid}, {@link ZipWriterConstructorOptions#unixMode},
   * {@link ZipWriterConstructorOptions#unixExtraFieldType} or {@link ZipWriterAddDataOptions#executable},
   * takes precedence and keeps the Unix attributes, with the MS-DOS attributes written into the low byte.
   * {@link ZipWriterConstructorOptions#externalFileAttributes} is preserved as well, although the entry still
   * declares the MS-DOS platform.
   */
  msdosAttributesRaw?: number;
  /**
   * When provided, MS-DOS attribute flags (boolean object) to write into external file attributes low byte.
   *
   * @remarks
   * See {@link ZipWriterConstructorOptions#msdosAttributesRaw} for the platform this option selects and for
   * the Unix metadata it leaves out of the entry.
   */
  msdosAttributes?: {
    readOnly?: boolean;
    hidden?: boolean;
    system?: boolean;
    directory?: boolean;
    archive?: boolean;
  };
  /**
   * `false` to never write disk numbers in zip64 data.
   *
   * @defaultValue true
   */
  supportZip64SplitFile?: boolean;
  /**
   * `true`to produce zip files compatible with the USDZ specification: the data of the entries is aligned on 64-byte
   * boundaries and stored uncompressed unless the {@link ZipWriterConstructorOptions#level} or
   * {@link ZipWriterAddDataOptions#compressionMethod} options are set explicitly. Setting the
   * {@link ZipWriterConstructorOptions#password} option throws an {@link ERR_UNSUPPORTED_ENCRYPTION_USDZ} error.
   *
   * These constraints apply to the entries written with {@link ZipWriter#add} only. The entries copied with
   * {@link ZipWriter#appendZip} keep the layout of the source zip file and are not checked, so appending a
   * zip file that does not comply with the USDZ specification, or appending it when the size of the output
   * is not a multiple of 64 bytes, silently produces a non-compliant file.
   *
   * The option is only read when the {@link ZipWriter} is created; a value passed to
   * {@link ZipWriter#add} is ignored.
   *
   * @defaultValue false
   */
  usdz?: boolean;
  /**
   * `true` to write the data as-is without compressing it and without crypting it.
   *
   * @remarks
   * The data is never compressed, so the {@link ZipWriterConstructorOptions#level} option does not apply and is
   * ignored. The {@link ZipWriterAddDataOptions#compressionMethod} option selects no codec either, it declares
   * how the data is already compressed and is written as-is in the entry headers. It must be set, otherwise an
   * {@link ERR_UNDEFINED_COMPRESSION_METHOD} error is thrown. The entries with no content, e.g. the
   * directories, ignore this option entirely. Setting the {@link ZipWriterConstructorOptions#password} or the
   * {@link ZipWriterConstructorOptions#rawPassword} option throws an
   * {@link ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH} error, unless the
   * {@link ZipWriterConstructorOptions#encrypted} option is set to `true` to declare that the data is already
   * encrypted. In that case the password encrypts the other entries only, and the data written as-is keeps the
   * password it was encrypted with, which is not verified.
   *
   * When the data was encrypted with ZipCrypto, the verification byte stored in the encrypted data depends on
   * the last modification date of the source entry if the data descriptor is used. The
   * {@link ZipWriterConstructorOptions#dataDescriptor} and {@link ZipWriterConstructorOptions#rawLastModDate}
   * values of the source entry must then be forwarded, otherwise reading the copied entry fails with an
   * {@link ERR_INVALID_PASSWORD} error. The filesystem API forwards them when exporting entries and throws an
   * {@link ERR_ZIP_CRYPTO_LAST_MOD_DATE} error if the date is overridden.
   */
  passThrough?: boolean;
  /**
   * `true` to write encrypted data when `passThrough` is set to `true`.
   */
  encrypted?: boolean;
  /**
   * The offset of the first entry in the zip file.
   *
   * @remarks
   * When the option is undefined, the offset is the number of bytes already written into the
   * destination, read from its `size` property, see {@link WritableWriter#size}. A `size` property
   * set on a `WritableStream` instance passed directly to the {@link ZipWriter} constructor is
   * also read, for backward compatibility. When the option is set, the bytes between the size of
   * the destination and the offset are assumed to exist in the final zip file without being
   * written, e.g. when writing one part of a zip file assembled by the caller.
   *
   * The option is only read when the {@link ZipWriter} is created, e.g. by
   * {@link ZipDirectoryEntry#exportZip}; a value passed to {@link ZipWriter#add} is ignored.
   */
  offset?: number;
  /**
   * The compression method (e.g. 8 for DEFLATE, 0 for STORE).
   */
  compressionMethod?: number;
  /**
   * The function called for encoding the filename and the comment of the entry.
   *
   * @param text The text to encode.
   * @param type The type of the encoded text, `"filename"` or `"comment"`.
   * @returns The encoded text or `undefined` if the text should be encoded by zip.js.
   */
  encodeText?(text: string, type: "filename" | "comment"): Uint8Array | undefined;
}

/**
 * Represents options passed to {@link FileEntry#getData}, {@link ZipWriter.add} and `{@link ZipDirectory}.export*`.
 *
 * @remarks
 * When passed to `{@link ZipDirectory}.export*`, these functions report the progress of the whole archive instead
 * of the progress of each entry: {@link EntryDataOnprogressOptions#onstart} and
 * {@link EntryDataOnprogressOptions#onend} are called once, and the total number of bytes is the sum of the sizes
 * of all the entries. Use {@link ZipDirectoryEntryExportOptions#onentryprogress} to be notified when each entry
 * is written.
 */
export interface EntryDataOnprogressOptions {
  /**
   * The function called when starting compression/decompression.
   *
   * @param total The total number of bytes.
   * @returns An empty promise or `undefined`.
   */
  onstart?(total: number): Promise<void> | void;
  /**
   * The function called during compression/decompression.
   *
   * @param progress The current progress in bytes.
   * @param total The total number of bytes.
   * @returns An empty promise or `undefined`.
   */
  onprogress?(progress: number, total: number): Promise<void> | void;
  /**
   * The function called when ending compression/decompression.
   *
   * @param computedSize The total number of bytes (computed).
   * @returns An empty promise or `undefined`.
   */
  onend?(computedSize: number): Promise<void> | void;
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
    entry: EntryMetaData
  ): Promise<void> | void;
}

/**
 * Represents an entry in a zip file (Filesystem API).
 */
export class ZipEntry {
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
   *
   * @remarks It is the size of the raw compressed content when the entry has been imported with the
   * `passThrough` option set to `true`, since the entry holds the compressed data in that case. The
   * uncompressed size of the original entry remains available in {@link ZipEntry#data}.
   */
  uncompressedSize: number;
  /**
   * The children of the entry.
   */
  children: ZipEntry[];
  /**
   * The options applied to the entry when the zip file is exported.
   *
   * @remarks
   * These are the options passed when the entry was added to the filesystem, updated by
   * {@link ZipEntry#setOptions}. An entry imported from a zip file has none until
   * {@link ZipEntry#setOptions} is called.
   */
  readonly options?: ZipWriterAddDataOptions;
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
    options?: EntryGetDataOptions
  ): Promise<boolean>;
  /**
   * Set the name of the entry
   *
   * @param name The new name of the entry.
   */
  rename(name: string): void;
  /**
   * Sets the options applied to the entry when the zip file is exported
   *
   * @remarks
   * The options are merged into {@link ZipEntry#options}, and an option set to `undefined` is removed
   * from it instead of being stored. They take precedence over the options passed to
   * `{@link ZipDirectoryEntry}#export*()` and over the metadata of the entry they were imported from,
   * exactly like the options passed when adding an entry to the filesystem.
   *
   * The options describing the data of an entry exported as-is, e.g.
   * {@link ZipWriterConstructorOptions#compressionMethod} and
   * {@link ZipWriterAddDataOptions#uncompressedSize}, are ignored: they are always the ones of the
   * original entry. The {@link ZipWriterAddDataOptions#directory} option and the progress callbacks
   * are ignored as well. Invalid option values are reported when the zip file is exported.
   *
   * @param options The options.
   */
  setOptions(options: ZipWriterAddDataOptions): void;
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
    options?: EntryGetDataOptions
  ): Promise<string>;
  /**
   * Retrieves the content of the entry as a `Uint8Array` instance
   *
   * @param options The options.
   * @returns A promise resolving to a `Uint8Array` instance.
   */
  getUint8Array(options?: EntryGetDataOptions): Promise<Uint8Array>;
  /**
   * Retrieves the content of the entry via a `WritableStream` instance
   *
   * @param writable The `WritableStream` instance.
   * @param options The options.
   * @returns A promise resolving to the `WritableStream` instance.
   */
  getWritable(
    writable?: WritableStream,
    options?: EntryGetDataOptions
  ): Promise<WritableStream>;
  /**
   * Retrieves the content of the entry via a {@link Writer} instance
   *
   * @param writer The {@link Writer} instance.
   * @param options The options.
   * @returns A promise resolving to data associated to the {@link Writer} instance.
   */
  getData<Type>(
    writer:
      | Writer<unknown>
      | WritableWriter
      | WritableStream
      | AsyncGenerator<Writer<unknown> | WritableWriter | WritableStream>,
    options?: EntryGetDataOptions
  ): Promise<Type>;
  /**
   * Retrieves the content of the entry as an `ArrayBuffer` instance
   *
   * @param options The options.
   * @returns A promise resolving to an `ArrayBuffer` instance.
   */
  getArrayBuffer(options?: EntryGetDataOptions): Promise<ArrayBuffer>;
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
  replaceUint8Array(array: Uint8Array): void;
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
   * Gets the children of the directory
   *
   * @remarks The returned array is a snapshot taken when the method is called: entries added or removed
   * afterwards are not reflected, and an entry removed while the array is being iterated is still present
   * but detached from the filesystem.
   *
   * With `recursive`, the descendants are ordered level by level, i.e. the children of a directory come
   * before the children of its subdirectories, like the result of `readdir(path, { recursive: true })` in
   * Node.js. This is also the order in which `{@link ZipDirectoryEntry}#export*()` writes them.
   *
   * Unlike {@link ZipFS#entries}, the directory itself is not included and removed entries leave no empty slot.
   *
   * @param options The options.
   * @returns The array of {@link ZipEntry} instances.
   */
  getChildren(options?: ZipDirectoryEntryGetChildrenOptions): ZipEntry[];
  /**
   * Adds a directory
   *
   * @param name The relative filename of the directory.
   * @param options The options.
   * @returns A {@link ZipDirectoryEntry} instance.
   */
  addDirectory(
    name: string,
    options?: ZipWriterAddDataOptions
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
    options?: ZipWriterAddDataOptions
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
    options?: ZipWriterAddDataOptions
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
    options?: ZipWriterAddDataOptions
  ): ZipFileEntry<string, string>;
  /**
   * Adds an entry with content provided as a `Uint8Array` instance
   *
   * @param name The relative filename of the entry.
   * @param array The `Uint8Array` instance.
   * @param options The options.
   * @returns A {@link ZipFileEntry} instance.
   */
  addUint8Array(
    name: string,
    array: Uint8Array,
    options?: ZipWriterAddDataOptions
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
    options?: HttpOptions & ZipWriterAddDataOptions
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
    options?: ZipWriterAddDataOptions
  ): ZipFileEntry<ReadableStream, void>;
  /**
   * Adds an entry with content provided via a `File` instance
   *
   * @param file The `File` instance.
   * @param options The options.
   * @returns A promise resolving to a {@link ZipFileEntry} or a {@link ZipDirectoryEntry} instance.
   */
  addFile(file: File, options?: ZipWriterAddDataOptions): Promise<ZipEntry>;
  /**
   * Adds an entry with content provided via a `FileSystemEntry` instance
   *
   * The options apply to every entry added, including the directories. The
   * {@link ZipWriterConstructorOptions#lastModDate} option replaces the last modification date of the
   * files, which is otherwise taken from each `FileSystemEntry` instance.
   *
   * @param fileSystemEntry The `FileSystemEntry` instance.
   * @param options The options.
   * @returns A promise resolving to an array of {@link ZipFileEntry} or a {@link ZipDirectoryEntry} instances.
   */
  addFileSystemEntry(
    fileSystemEntry: FileSystemEntryLike,
    options?: ZipWriterAddDataOptions
  ): Promise<ZipEntry[]>;
  /**
   * Adds an entry with content provided via a `FileSystemHandle` instance
   *
   * If a handle cannot be read, the original error is rethrown unmodified as an {@link EntryError},
   * whose {@link EntryError#entryName} is the path of the handle that failed, relative to the parent
   * of `fileSystemHandle`.
   *
   * The options apply to every entry added, including the directories. The
   * {@link ZipWriterConstructorOptions#lastModDate} option replaces the last modification date of the
   * files, which is otherwise taken from each `FileSystemHandle` instance.
   *
   * @param fileSystemHandle The `fileSystemHandle` instance.
   * @param options The options.
   * @returns A promise resolving to an array of {@link ZipFileEntry} or a {@link ZipDirectoryEntry} instances.
   */
  addFileSystemHandle(
    fileSystemHandle: FileSystemHandleLike,
    options?: ZipWriterAddDataOptions
  ): Promise<ZipEntry[]>;
  /**
   * Extracts a zip file provided as a `Blob` instance into the entry
   *
   * @param blob The `Blob` instance.
   * @param options  The options.
   *
   * @remarks Use {@link ZipDirectoryEntry#importZip} with a {@link ZipReader} instance to read the data of the
   * zip file itself, e.g. its {@link ZipReader#prependedData} or its {@link ZipReader#comment} property.
   */
  importBlob(
    blob: Blob,
    options?: ZipReaderConstructorOptions
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file provided as a Data URI `string` encoded in Base64 into the entry
   *
   * @param dataURI The Data URI `string` encoded in Base64.
   * @param options  The options.
   *
   * @remarks Use {@link ZipDirectoryEntry#importZip} with a {@link ZipReader} instance to read the data of the
   * zip file itself, e.g. its {@link ZipReader#prependedData} or its {@link ZipReader#comment} property.
   */
  importData64URI(
    dataURI: string,
    options?: ZipReaderConstructorOptions
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file provided as a `Uint8Array` instance into the entry
   *
   * @param array The `Uint8Array` instance.
   * @param options  The options.
   *
   * @remarks Use {@link ZipDirectoryEntry#importZip} with a {@link ZipReader} instance to read the data of the
   * zip file itself, e.g. its {@link ZipReader#prependedData} or its {@link ZipReader#comment} property.
   */
  importUint8Array(
    array: Uint8Array,
    options?: ZipReaderConstructorOptions
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file fetched from a URL into the entry
   *
   * @param url The URL.
   * @param options  The options.
   *
   * @remarks Use {@link ZipDirectoryEntry#importZip} with a {@link ZipReader} instance to read the data of the
   * zip file itself, e.g. its {@link ZipReader#prependedData} or its {@link ZipReader#comment} property.
   */
  importHttpContent(
    url: string,
    options?: ZipDirectoryEntryImportHttpOptions
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file provided via a `ReadableStream` instance into the entry
   *
   * @param readable The `ReadableStream` instance.
   * @param options  The options.
   *
   * @remarks Use {@link ZipDirectoryEntry#importZip} with a {@link ZipReader} instance to read the data of the
   * zip file itself, e.g. its {@link ZipReader#prependedData} or its {@link ZipReader#comment} property.
   *
   * The stream is buffered entirely in memory, because reading a zip file requires random access. To import
   * a large file without buffering it, use {@link ZipDirectoryEntry#importZip} with a seekable input, see
   * the {@link ZipReader} constructor remarks and the {@link Reader} examples.
   */
  importReadable(
    readable: ReadableStream,
    options?: ZipReaderConstructorOptions
  ): Promise<[ZipEntry]>;
  /**
   * Extracts a zip file provided via a custom {@link Reader} instance or a {@link ZipReader} instance into
   * the entry
   *
   * @param reader The {@link Reader} instance or the {@link ZipReader} instance.
   * @param options  The options.
   *
   * @remarks The filename of each entry is split into path components to build the tree of entries. Empty
   * components and `"."` components are ignored, so `"a//b.txt"`, `"./a/b.txt"` and `"a/./b.txt"` all produce
   * the same `"a/b.txt"` entry. Filenames are normalized and validated beforehand, see
   * {@link GetEntriesOptions#normalizeFilename} and {@link GetEntriesOptions#filenameValidation}.
   *
   * The directories created that way are navigable like any other entry but are not written back when the
   * tree is exported: only the directories carried by the source zip file and the ones created with
   * {@link ZipDirectoryEntry#addDirectory} are written. A zip file storing no directory entry therefore
   * round-trips to a zip file storing no directory entry, instead of gaining one entry per path component.
   *
   * Passing a {@link ZipReader} instance is the way to read the data of the zip file itself, e.g. its
   * {@link ZipReader#prependedData} or its {@link ZipReader#comment} property, since the instance created
   * otherwise is not exposed. Its options are used as defaults for the options passed here, and it must not
   * have read its entries yet when it is created over a `ReadableStream` instance, which can only be read once.
   *
   * Like the {@link ZipReader} constructor, a `ReadableStream` input is buffered entirely in memory, see
   * its remarks and the {@link Reader} examples for reading large seekable resources with random access.
   */
  importZip(
    reader:
      | Reader<unknown>
      | ReadableReader
      | ReadableStream
      | Reader<unknown>[]
      | ReadableReader[]
      | ReadableStream[]
      | ZipReader<unknown>,
    options?: ZipReaderConstructorOptions
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
  exportUint8Array(
    options?: ZipDirectoryEntryExportOptions
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
    options?: ZipDirectoryEntryExportOptions
  ): Promise<WritableStream>;
  /**
   * Writes the entry and its descendants into a directory as files and sub-directories via the File System Access API (e.g. the Origin Private File System). Files are streamed and directories are merged into the target; colliding files are overwritten. This is the inverse of {@link ZipDirectoryEntry#addFileSystemHandle}.
   *
   * If an entry cannot be written, the original error is rethrown unmodified as an {@link EntryError},
   * whose {@link EntryError#entryName} is the name of the entry that failed, relative to this entry.
   *
   * The export is not atomic and nothing is rolled back, because the target is merged into rather
   * than replaced: a file that already existed cannot be restored once overwritten. On failure the
   * target is left as follows, and {@link EntryError#exportedEntryNames} lists the files that
   * completed:
   * - files written before the failure are left in place, complete and valid;
   * - a file whose write started but did not finish is left empty, because it is created before its
   *   content is streamed; this includes the entry that failed and, with `concurrent`, every entry
   *   cancelled alongside it;
   * - files that already existed in the target keep their previous content unless they were
   *   overwritten in full;
   * - entries not started yet are missing, as are the directories that would have held them.
   *
   * Running the same export again is the supported way to recover, since directories are merged and
   * files are overwritten.
   *
   * @remarks An entry flagged as a symbolic link by {@link EntryMetaData#symlink} is written
   * as a regular file whose content is the path of the link target, because the File System Access API cannot
   * create symbolic links.
   *
   * @param directoryHandle The target `FileSystemDirectoryHandle` instance.
   * @param options The options.
   * @returns A promise resolving to the target `FileSystemDirectoryHandle` instance.
   */
  exportFileSystemHandle(
    directoryHandle: FileSystemDirectoryHandle,
    options?: ZipDirectoryEntryExportFileSystemHandleOptions
  ): Promise<FileSystemDirectoryHandle>;
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
    options?: ZipDirectoryEntryExportOptions
  ): Promise<unknown>;
  /**
   * Computes the exact size in bytes of the zip file that `export*()` would produce for the entry
   * and its descendants, without reading or compressing any data.
   *
   * Pass the same options object that will be passed to the export method, otherwise the result
   * will not match. The size is only determinable when every descendant is stored (i.e. `level` is
   * set to 0) or passed through, and has a known size; {@link ERR_UNDETERMINED_SIZE} is thrown
   * otherwise. Encryption does not prevent it, the overhead of ZipCrypto and AES being fixed.
   *
   * The intended use is setting the `Content-Length` header of a zip file streamed over HTTP.
   *
   * @remarks Entries added with {@link ZipDirectoryEntry#addReadable} never have a known size, and
   * entries added with {@link ZipDirectoryEntry#addHttpContent} only get one once their content has
   * been read. The returned size assumes a single output file, it does not apply to split zip files.
   *
   * {@link ERR_UNDETERMINED_SIZE} is also thrown when the size depends on the order in which the
   * entries are physically written, which the buffered write path only determines at write time.
   * This happens when `usdz` is set, since the alignment padding depends on the offset of each
   * entry, and when the archive exceeds 4GB, since the offsets recorded in the central directory
   * are then extended to 64 bits. Passing `bufferedWrite: false` makes both determinable again,
   * as does exporting a directory whose children are all files. It is thrown as well when
   * `signCentralDirectory` is set, the length of the signature being unknown until it is computed.
   *
   * @param options The options.
   * @returns A promise resolving to the size in bytes.
   * @throws {@link ERR_UNDETERMINED_SIZE} if the size cannot be determined.
   */
  getExportedSize(options?: ZipDirectoryEntryExportOptions): Promise<number>;
}

/**
 * Represents the options passed to {@link ZipDirectoryEntry#importHttpContent}.
 */
export interface ZipDirectoryEntryImportHttpOptions
  extends ZipReaderConstructorOptions,
    HttpOptions {}

/**
 * Represents the options passed to {@link ZipDirectoryEntry#getChildren} and {@link ZipFS#getChildren}.
 */
export interface ZipDirectoryEntryGetChildrenOptions {
  /**
   * `true` to return all the descendants of the directory instead of its direct children only.
   *
   * @defaultValue false
   */
  recursive?: boolean;
}

/**
 * Represents the options passed to `{@link ZipDirectoryEntry}#export*()`.
 *
 * @remarks
 * The options set here apply to every entry of the exported zip file, including the entries imported
 * from a zip file: such an entry keeps the metadata of the entry it was imported from, e.g. its
 * {@link ZipWriterConstructorOptions#lastModDate} option, only when the option is not set here. The
 * options passed when adding an entry to the filesystem take precedence over the options set here, and
 * the options describing the data of the entries exported as-is, e.g.
 * {@link ZipWriterConstructorOptions#compressionMethod} and
 * {@link ZipWriterAddDataOptions#uncompressedSize}, are always the ones of the original entries.
 *
 * The {@link ZipWriterConstructorOptions#password} option encrypts the exported zip file. It never
 * decrypts the entries being exported: the password of an entry imported from an encrypted zip file
 * must be passed in the {@link ZipDirectoryEntryExportOptions#readerOptions} option instead.
 *
 * Likewise, the {@link ZipWriterConstructorOptions#passThrough} option describes the data returned
 * by the Reader instances. Exporting entries imported from a zip file as-is is done with the
 * {@link ZipReaderOptions#passThrough} option in the
 * {@link ZipDirectoryEntryExportOptions#readerOptions} option instead. Setting it here throws an
 * {@link ERR_INVALID_PASS_THROUGH} error, unless the {@link ZipWriterAddDataOptions#uncompressedSize}
 * option of every entry holding content is known.
 *
 * Exporting entries as-is and setting the {@link ZipWriterConstructorOptions#password} option throws an
 * {@link ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH} error, since the data of these entries is copied
 * verbatim and cannot be encrypted. Entries imported from an encrypted zip file are an exception: they
 * are exported as-is without error, and keep the password they were encrypted with.
 *
 * The {@link ZipWriterConstructorOptions#preventClose} option only applies when the caller owns the
 * writable, i.e. when a {@link WritableWriter} instance is passed to
 * {@link ZipDirectoryEntry#exportZip} or {@link ZipDirectoryEntry#exportWritable}. It is ignored by the
 * other `{@link ZipDirectoryEntry}#export*()` methods, whose Writer instance can only return its data
 * once its writable is closed.
 *
 * An entry added without a {@link ZipWriterAddDataOptions#lastModDate} option is dated with the moment
 * it was added, so exporting an unchanged tree twice produces the same bytes. That date is the weakest
 * one: it is replaced by the date of the entry the tree was imported from, which is itself replaced by
 * the {@link ZipWriterConstructorOptions#lastModDate} option passed here, which pins every date of the
 * exported zip file. Only a {@link ZipWriterAddDataOptions#lastModDate} option passed when the entry
 * was added takes precedence over all of them.
 */
export interface ZipDirectoryEntryExportOptions
  extends ZipWriterConstructorOptions,
    EntryDataOnprogressOptions {
  /**
   * `true` to use filenames relative to the entry instead of full filenames.
   */
  relativePath?: boolean;
  /**
   * The MIME type of the exported data when relevant.
   */
  mimeType?: string;
  /**
   * The function called each time an entry is written.
   *
   * @remarks
   * This function reports the entries whereas {@link EntryDataOnprogressOptions#onprogress} reports the
   * bytes. It is called once per entry, after the entry has been written, so `progress` reaches `total`
   * when the last entry is written.
   *
   * When {@link ZipWriterConstructorOptions#bufferedWrite} is enabled, the entries are written
   * concurrently: `progress` counts the entries written instead of giving the position of the entry in
   * the zip file.
   *
   * @param progress The number of entries written.
   * @param total The total number of entries.
   * @param entry The entry written.
   * @returns An empty promise or `undefined`.
   */
  onentryprogress?(
    progress: number,
    total: number,
    entry: EntryMetaData
  ): Promise<void> | void;
  /**
   * The global comment of the zip file, see {@link ZipWriter#close}.
   *
   * @remarks
   * The {@link ZipWriterAddDataOptions#comment} option is the comment of an entry: setting it here
   * comments every entry of the exported zip file instead of the zip file itself.
   */
  globalComment?: Uint8Array;
  /**
   * The function called for signing the central directory, see
   * {@link ZipWriterCloseOptions#signCentralDirectory}.
   *
   * @param directory The raw data of the central directory records.
   * @returns The data of the digital signature record.
   */
  signCentralDirectory?(
    directory: Uint8Array
  ): Uint8Array | PromiseLike<Uint8Array>;
  /**
   * The options passed to the Reader instances.
   *
   * @remarks
   * The {@link ZipReaderOptions#password} option must be set here to export entries imported from an
   * encrypted zip file, since the {@link ZipDirectoryEntryExportOptions#password} option sets the
   * password used to encrypt the exported zip file instead.
   *
   * The {@link ZipReaderOptions#passThrough} option set here exports the entries imported from a zip
   * file as-is, without decompressing and decrypting them, exactly as importing them with this option
   * does. It is ignored by the entries added to the filesystem, which are compressed as usual.
   *
   * A value which is neither an object nor unset throws an {@link ERR_INVALID_READER_OPTIONS} error.
   */
  readerOptions?: ZipReaderConstructorOptions;
}

/**
 * Represents the options passed to {@link ZipDirectoryEntry#exportFileSystemHandle} and {@link ZipFS#exportFileSystemHandle}.
 *
 * @remarks
 * The {@link ZipReaderOptions#preventClose} option is ignored: the export owns the writable of each
 * file it creates and must close it for the data to be written.
 */
export interface ZipDirectoryEntryExportFileSystemHandleOptions
  extends EntryGetDataOptions {
  /**
   * `true` to write independent files concurrently instead of one after another.
   *
   * When an entry fails, the entries still in flight are cancelled and the ones not started yet are
   * skipped, so a failed export stops as early as it does when writing one file after another. An
   * entry whose write has already been requested may still be created, because the File System
   * Access API cannot cancel a pending `getFileHandle` or `getDirectoryHandle` call.
   *
   * @defaultValue false
   */
  concurrent?: boolean;
  /**
   * The options passed to the Reader instances.
   *
   * @remarks
   * These options override the ones passed at the top level. The {@link ZipReaderOptions#password}
   * option can be set here or at the top level, unlike {@link ZipDirectoryEntryExportOptions} where
   * the top-level password encrypts the exported zip file instead.
   *
   * A value which is neither an object nor unset throws an {@link ERR_INVALID_READER_OPTIONS} error.
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
 * let zipFs = new zip.ZipFS();
 * zipFs.addBlob("lorem.txt", BLOB);
 * const zippedBlob = await zipFs.exportBlob();
 * zipFs = new zip.ZipFS();
 * await zipFs.importBlob(zippedBlob);
 * const firstEntry = zipFs.children[0];
 * const unzippedBlob = await firstEntry.getBlob(zip.getMimeType(firstEntry.name));
 * ```
 */
export interface ZipFS
  extends Pick<
    ZipDirectoryEntry,
    | "getChildByName"
    | "getChildren"
    | "addDirectory"
    | "addText"
    | "addBlob"
    | "addData64URI"
    | "addUint8Array"
    | "addHttpContent"
    | "addReadable"
    | "addFile"
    | "addFileSystemEntry"
    | "addFileSystemHandle"
    | "importBlob"
    | "importData64URI"
    | "importUint8Array"
    | "importHttpContent"
    | "importReadable"
    | "importZip"
    | "exportBlob"
    | "exportData64URI"
    | "exportUint8Array"
    | "exportWritable"
    | "exportFileSystemHandle"
    | "exportZip"
    | "getExportedSize"
    | "isPasswordProtected"
    | "checkPassword"
  > {}

export class ZipFS {
  /**
   * The root directory.
   */
  root: ZipDirectoryEntry;
  /**
   * The array of all the {@link ZipEntry} instances indexed by {@link ZipEntry#id}.
   */
  entries: (ZipEntry | null)[];
  /**
   * The children of the root directory.
   */
  readonly children: ZipEntry[];
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
 * The type of the filesystem.
 *
 * @deprecated Use {@link ZipFS} instead.
 */
export type FS = ZipFS;

/**
 * The Filesystem API.
 *
 * @deprecated Use the {@link ZipFS}, {@link ZipDirectoryEntry} and {@link ZipFileEntry} exports instead.
 */
export const fs: {
  /**
   * The Filesystem constructor.
   *
   * @deprecated Use {@link ZipFS} instead.
   */
  FS: typeof ZipFS;
  /**
   * The {@link ZipDirectoryEntry} constructor.
   *
   * @deprecated Use the {@link ZipDirectoryEntry} export instead.
   */
  ZipDirectoryEntry: typeof ZipDirectoryEntry;
  /**
   * The {@link ZipFileEntry} constructor.
   *
   * @deprecated Use the {@link ZipFileEntry} export instead.
   */
  ZipFileEntry: typeof ZipFileEntry;
};

// The error messages.
/**
 * HTTP range error
 */
export const ERR_HTTP_RANGE: string;
/**
 * HTTP resource changed while being read error
 */
export const ERR_HTTP_RESOURCE_CHANGED: string;
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
 * Invalid codec definition error
 */
export const ERR_INVALID_CODEC_DEFINITION: string;
/**
 * Reserved compression method error
 */
export const ERR_RESERVED_COMPRESSION_METHOD: string;
/**
 * Invalid codec module error
 */
export const ERR_INVALID_CODEC_MODULE: string;
/**
 * Invalid CRC-32 checksum error, thrown when the {@link ZipReaderOptions#checkCrc32} option is set and the CRC-32
 * checksum of an entry does not match the value stored in the zip file.
 *
 * @remarks
 * This constant and {@link ERR_INVALID_AUTHENTICATION_CODE} share the same value as {@link ERR_INVALID_SIGNATURE}
 * for backward compatibility. They will become distinct strings in the next minor version.
 */
export const ERR_INVALID_CRC32: string;
/**
 * Invalid authentication code error, thrown when the authentication code of an entry encrypted with AES does not
 * match the encrypted data, e.g. when the data was tampered or corrupted after the encryption.
 *
 * @remarks
 * This constant and {@link ERR_INVALID_CRC32} share the same value as {@link ERR_INVALID_SIGNATURE} for backward
 * compatibility. They will become distinct strings in the next minor version.
 */
export const ERR_INVALID_AUTHENTICATION_CODE: string;
/**
 * Invalid signature error
 *
 * @deprecated Use {@link ERR_INVALID_CRC32} or {@link ERR_INVALID_AUTHENTICATION_CODE} instead.
 */
export const ERR_INVALID_SIGNATURE: string;
/**
 * Invalid uncompressed size error
 */
export const ERR_INVALID_UNCOMPRESSED_SIZE: string;
/**
 * Invalid compressed data error
 *
 * @remarks
 * The way malformed compressed data is reported is not uniform across codec
 * backends. Bytes trailing a complete DEFLATE stream (e.g. a wrong
 * `compressedSize`) are tolerated by the bundled WASM and pure-JS codecs, which
 * decompress the valid data and ignore the extra bytes, but are rejected by the
 * native `DecompressionStream` with its own `TypeError` (on Node,
 * `ERR_TRAILING_JUNK_AFTER_STREAM_END`) rather than this error. Any data that is
 * returned is always validated against the entry's uncompressed size (and CRC
 * when `checkCrc32` is set), so it is never silently truncated; the backends
 * differ only in whether trailing bytes are ignored or raised as an error.
 */
export const ERR_INVALID_COMPRESSED_DATA: string;
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
 * Invalid comment type error
 */
export const ERR_INVALID_COMMENT_TYPE: string;
/**
 * Invalid entry name error
 */
export const ERR_INVALID_ENTRY_NAME: string;
/**
 * Invalid entry comment error
 */
export const ERR_INVALID_ENTRY_COMMENT: string;
/**
 * Invalid entry comment type error
 */
export const ERR_INVALID_ENTRY_COMMENT_TYPE: string;
/**
 * Invalid date error
 */
export const ERR_INVALID_DATE: string;
/**
 * Invalid function option error
 *
 * @remarks
 * Thrown when an option expecting a function is given a value of another type: {@link ZipWriterConstructorOptions#encodeText},
 * {@link GetEntriesOptions#decodeText}, {@link ZipWriterConstructorOptions#createTempStream},
 * {@link ZipWriterCloseOptions#signCentralDirectory} and {@link GetEntriesOptions#decryptCentralDirectory}. It is also
 * thrown by {@link configure} for {@link Configuration#createWorker}, {@link Configuration#CompressionStream},
 * {@link Configuration#DecompressionStream}, {@link Configuration#CompressionStreamFallback} and
 * {@link Configuration#DecompressionStreamFallback}. A falsy value keeps meaning "use the default".
 */
export const ERR_INVALID_FUNCTION_OPTION: string;
/**
 * Invalid signal error
 *
 * @remarks
 * Thrown when the `signal` option is not an `AbortSignal`. Any object exposing `addEventListener()` and a boolean `aborted`
 * property is accepted, so a signal coming from another realm keeps working.
 */
export const ERR_INVALID_SIGNAL: string;
/**
 * Invalid maxWorkers error
 *
 * @remarks
 * Thrown by {@link configure} when {@link Configuration#maxWorkers} is not an integer greater than 0. A value lower than 1
 * used to deadlock {@link ZipWriter#add} for ever, since no entry could start and none could release the next one. Pass
 * {@link Configuration#useWebWorkers} set to `false` to compress and decompress data in the main thread instead.
 */
export const ERR_INVALID_MAX_WORKERS: string;
/**
 * Invalid version error
 */
export const ERR_INVALID_VERSION: string;
/**
 * Invalid extra field error
 */
export const ERR_INVALID_EXTRAFIELD: string;
/**
 * Invalid extra field type error
 */
export const ERR_INVALID_EXTRAFIELD_TYPE: string;
/**
 * Invalid extra field data type error
 */
export const ERR_INVALID_EXTRAFIELD_DATA_TYPE: string;
/**
 * Invalid extra field data error
 */
export const ERR_INVALID_EXTRAFIELD_DATA: string;
/**
 * Invalid encryption strength error
 */
export const ERR_INVALID_ENCRYPTION_STRENGTH: string;
/**
 * Unsupported encryption in USDZ files error
 */
export const ERR_UNSUPPORTED_ENCRYPTION_USDZ: string;
/**
 * Unsupported encryption in pass-through entries error
 */
export const ERR_UNSUPPORTED_ENCRYPTION_PASS_THROUGH: string;
/**
 * Invalid format error
 */
export const ERR_UNSUPPORTED_FORMAT: string;
/**
 * Split zip file error
 */
export const ERR_SPLIT_ZIP_FILE: string;
/**
 * Overlapping entry error
 *
 * @remarks Thrown by {@link FileEntry#getData} when {@link ZipReaderOptions#checkOverlappingEntry} is set and the
 * data of the entry overlaps the data of an entry already read. The thrown error carries the other entry in its
 * `overlappingEntry` property.
 */
export const ERR_OVERLAPPING_ENTRY: string;
/**
 * Entry data out of bounds error
 *
 * @remarks Thrown by {@link FileEntry#getData} when the declared extent of the entry data (i.e. its offset plus its compressed size) ends past the end of the zip file.
 */
export const ERR_ENTRY_DATA_OUT_OF_BOUNDS: string;
/**
 * Ambiguous archive error
 *
 * @remarks The thrown error carries a `reason` property describing the ambiguity: `"appended data"`,
 * `"prepended data"`, `"trailing central directory data"`, `"multiple end of central directory records"`,
 * `"mismatched zip64 end of central directory record"`, `"duplicate filename"`, or, when
 * {@link ZipReaderOptions#checkLocalDirectory} compares the local header of an entry with its central
 * directory record, `"mismatched local file header (filename)"`,
 * `"mismatched local file header (general purpose bit flag)"`,
 * `"mismatched local file header (compression method)"` or
 * `"mismatched local file header (crc32 or sizes)"`.
 */
export const ERR_AMBIGUOUS_ARCHIVE: string;
/**
 * Encrypted central directory error
 *
 * @remarks Thrown when reading an archive using the Central Directory Encryption feature of the PKWARE Strong
 * Encryption Specification, which is not supported.
 */
export const ERR_ENCRYPTED_CENTRAL_DIRECTORY: string;
/**
 * Unsafe filename error
 *
 * @remarks Thrown when reading an archive containing an entry whose filename is rejected by
 * {@link GetEntriesOptions#filenameValidation}. The thrown error carries the offending name in its `filename`
 * property.
 */
export const ERR_UNSAFE_FILENAME: string;
/**
 * Invalid strictness error (thrown when the `strictness` option is not `"strict"`, `"balanced"` or `"tolerant"`)
 */
export const ERR_INVALID_STRICTNESS: string;
/**
 * Invalid filenameValidation error (thrown when the `filenameValidation` option is not `"strict"`, `"balanced"` or `"tolerant"`)
 */
export const ERR_INVALID_FILENAME_VALIDATION: string;
/**
 * Invalid maxAppendedDataSize error (thrown when the `maxAppendedDataSize` option is not a number greater than or equal to 0)
 */
export const ERR_INVALID_MAX_APPENDED_DATA_SIZE: string;
/**
 * Unsupported 64-bit value error
 *
 * @remarks Thrown when a 64-bit size, offset, or entry count read from a zip file exceeds `Number.MAX_SAFE_INTEGER`,
 * instead of processing the value with a loss of precision.
 */
export const ERR_UNSUPPORTED_UINT64: string;
/**
 * Iteration completed too soon error
 */
export const ERR_ITERATOR_COMPLETED_TOO_SOON: string;
/**
 * Undefined uncompressed size error
 */
export const ERR_UNDEFINED_UNCOMPRESSED_SIZE: string;
/**
 * Undefined compression method error
 */
export const ERR_UNDEFINED_COMPRESSION_METHOD: string;
export const ERR_UNDETERMINED_SIZE: string;
/**
 * Undefined reader error
 *
 * @remarks Thrown when adding an entry with the {@link ZipWriterConstructorOptions#passThrough} option set to `true`
 * and no Reader instance: the headers of such an entry describe its content verbatim and would declare content that
 * is not there. Directory entries are exempt, they have no content to write as-is.
 */
export const ERR_UNDEFINED_READER: string;
/**
 * Writer not initialized error
 */
export const ERR_WRITER_NOT_INITIALIZED: string;
/**
 * Zip file not empty error
 */
export const ERR_ZIP_NOT_EMPTY: string;
/**
 * Signature data exceeding 64KB error (see {@link ZipWriterCloseOptions#signCentralDirectory})
 */
export const ERR_INVALID_SIGNATURE_DATA: string;
/**
 * Invalid uid error (thrown when the `uid` option is not an integer in the range 0..2^32-1)
 */
export const ERR_INVALID_UID: string;
/**
 * Invalid gid error (thrown when the `gid` option is not an integer in the range 0..2^32-1)
 */
export const ERR_INVALID_GID: string;
/**
 * Invalid UNIX mode error (thrown when the `unixMode` option is not an integer in the range 0..65535)
 */
export const ERR_INVALID_UNIX_MODE: string;
/**
 * Invalid unixExtraFieldType error (thrown when the `unixExtraFieldType` option is not `"infozip"` or `"unix"`)
 */
export const ERR_INVALID_UNIX_EXTRA_FIELD_TYPE: string;
/**
 * Invalid UNIX uid/gid size error (thrown when `uid`/`gid` exceeds 65535 with `unixExtraFieldType` set to `"unix"`; use `"infozip"` for larger ids)
 */
export const ERR_INVALID_UNIX_ID_SIZE: string;
/**
 * Invalid msdosAttributesRaw error (thrown when the `msdosAttributesRaw` option is not an integer in the range 0..255)
 */
export const ERR_INVALID_MSDOS_ATTRIBUTES: string;
/**
 * Invalid msdosAttributes error (thrown when the `msdosAttributes` option is not an object with boolean flags)
 */
export const ERR_INVALID_MSDOS_DATA: string;
/**
 * Invalid level error (thrown when the `level` option is not an integer in the range 0..9)
 */
export const ERR_INVALID_LEVEL: string;
/**
 * Invalid password error (thrown when the `password` option is not a string, or the `rawPassword` option is not a `Uint8Array`)
 *
 * @remarks A value of another type would silently produce an unencrypted archive, and a `rawPassword` passed as a string
 * would produce an archive that cannot be opened with the equivalent {@link ZipWriterConstructorOptions#password}. The
 * reader applies the same check, where a value of another type used to fail with the unrelated {@link ERR_ENCRYPTED} or
 * {@link ERR_INVALID_PASSWORD}.
 */
export const ERR_INVALID_PASSWORD_TYPE: string;
/**
 * Invalid passThrough option error (thrown by `{@link ZipDirectoryEntry}#export*()` and
 * {@link ZipDirectoryEntry#getExportedSize} when an entry would be written as-is without a known uncompressed size)
 *
 * @remarks The {@link ZipWriterConstructorOptions#passThrough} option describes the data returned by the Reader
 * instances, which the filesystem API creates itself. Use the {@link ZipReaderOptions#passThrough} option in the
 * {@link ZipDirectoryEntryExportOptions#readerOptions} option to export the entries imported from a zip file as-is,
 * or set the {@link ZipWriterAddDataOptions#uncompressedSize} option of each entry holding compressed data.
 */
export const ERR_INVALID_PASS_THROUGH: string;
/**
 * Invalid readerOptions error (thrown by `{@link ZipDirectoryEntry}#export*()`,
 * {@link ZipDirectoryEntry#getExportedSize} and {@link ZipDirectoryEntry#exportFileSystemHandle} when the
 * {@link ZipDirectoryEntryExportOptions#readerOptions} option is neither an object nor unset)
 *
 * @remarks A value of another type was silently ignored: a password passed as a string instead of an object failed
 * with the unrelated {@link ERR_ENCRYPTED}, while the other options were dropped without any error. Note that an
 * unknown property of a `readerOptions` object is still ignored, as everywhere else in the API.
 */
export const ERR_INVALID_READER_OPTIONS: string;
/**
 * Locked last modification date error (thrown by `{@link ZipDirectoryEntry}#export*()` and
 * {@link ZipDirectoryEntry#getExportedSize} when the date of an entry encrypted with ZipCrypto and exported with
 * {@link ZipReaderOptions#passThrough} set in {@link ZipDirectoryEntryExportOptions#readerOptions} is changed)
 *
 * @remarks The ZipCrypto encryption header embeds a password verification byte derived from the time of the
 * entry: the encrypted data, copied as-is, only decrypts when the time in the rewritten headers still matches.
 * The error is thrown when the new date would prevent the entry from being decrypted; changes which keep the
 * verification byte intact, e.g. a change of the day only, are written normally.
 */
export const ERR_ZIP_CRYPTO_LAST_MOD_DATE: string;
/**
 * Entry already exists error (thrown by the filesystem API when adding an entry whose filename already exists)
 */
export const ERR_ENTRY_EXISTS: string;
/**
 * Readable stream already consumed error (thrown by the filesystem API when a readable stream is read more than once)
 */
export const ERR_READABLE_CONSUMED: string;
/**
 * Aborted operation error (thrown by {@link ZipDirectoryEntry#exportFileSystemHandle} when it is aborted via
 * {@link ZipReaderOptions#signal} on platforms which do not support the `reason` argument of
 * `AbortController#abort()`)
 *
 * @remarks The reason passed by the caller is discarded by these platforms and cannot be recovered, so a
 * `DOMException` named `AbortError` carrying this message is thrown in its place.
 */
export const ERR_ABORTED: string;
/**
 * Unsupported context error (thrown when {@link createSyncAccessHandleTempStream} is used outside a dedicated worker)
 */
export const ERR_UNSUPPORTED_CONTEXT: string;
/**
 * Unsupported Crypto API error (thrown when writing encrypted entries while `crypto.getRandomValues` is unavailable)
 */
export const ERR_UNSUPPORTED_CRYPTO_API: string;
/**
 * Web worker startup timeout error (thrown when a web worker does not start in time, e.g. in browser extensions
 * disallowing workers; set `useWebWorkers` to `false` in {@link configure} to work around it)
 */
export const ERR_WORKER_STARTUP_TIMEOUT: string;
/**
 * Warning reason: the central directory records are not ordered by entry data position (see {@link ZipReader#warnings})
 */
export const WARNING_UNSORTED_CENTRAL_DIRECTORY: string;
/**
 * Warning reason: the low byte of the "version needed to extract" field of an entry exceeds the highest known
 * zip specification version (see {@link ZipReader#warnings})
 */
export const WARNING_UNKNOWN_VERSION: string;
/**
 * Warning reason: an entry has bit 5 of the general purpose bit flag set, i.e. declares compressed patched data
 * (see {@link ZipReader#warnings})
 */
export const WARNING_COMPRESSED_PATCHED_DATA: string;
/**
 * Warning reason: the extra field data of a record cannot be fully parsed; the raw bytes stay available in
 * `rawExtraField` (see {@link ZipReader#warnings} and {@link EntryMetaData#warnings})
 */
export const WARNING_MALFORMED_EXTRA_FIELD: string;
/**
 * Warning reason: the Zip64 end of central directory record carries extensible data the zip file does not use
 * (see {@link ZipReader#warnings})
 */
export const WARNING_UNKNOWN_ZIP64_EXTENSIBLE_DATA: string;
/**
 * Warning reason: the zip file contains more than 65535 entries without Zip64, recovered from the 16-bit entry
 * count wrapped modulo 65536 (see {@link ZipReader#warnings})
 */
export const WARNING_WRAPPED_ENTRIES_COUNT: string;
/**
 * Warning reason: data is appended after the end of the zip file (see {@link ZipReader#warnings}); the reason of
 * {@link ERR_AMBIGUOUS_ARCHIVE} when the appended data exceeds {@link GetEntriesOptions#maxAppendedDataSize}
 */
export const WARNING_APPENDED_DATA: string;
/**
 * Warning reason: data is prepended before the zip file (see {@link ZipReader#warnings}); the reason of
 * {@link ERR_AMBIGUOUS_ARCHIVE} under `strictness: "strict"`
 */
export const WARNING_PREPENDED_DATA: string;
/**
 * Warning reason: data lies between the end of the central directory records and the end of central directory
 * record, either inside the declared central directory length or beyond it (see {@link ZipReader#warnings});
 * the reason of {@link ERR_AMBIGUOUS_ARCHIVE} under `strictness: "strict"`
 */
export const WARNING_TRAILING_CENTRAL_DIRECTORY_DATA: string;
/**
 * Warning reason: several entries share the same filename (see {@link ZipReader#warnings}); the reason of
 * {@link ERR_AMBIGUOUS_ARCHIVE} under `strictness: "strict"`
 */
export const WARNING_DUPLICATE_FILENAME: string;
/**
 * Warning reason: the end of central directory record and its Zip64 counterpart disagree on a field stored in
 * both (see {@link ZipReader#warnings}); the reason of {@link ERR_AMBIGUOUS_ARCHIVE} under `strictness: "strict"`
 */
export const WARNING_MISMATCHED_ZIP64_END_OF_CENTRAL_DIRECTORY: string;
/**
 * Warning reason: the general purpose bit flag of the local file header contradicts the central directory
 * (see {@link EntryMetaData#warnings}); the reason of {@link ERR_AMBIGUOUS_ARCHIVE} when
 * {@link ZipReaderOptions#checkLocalDirectory} is enabled
 */
export const WARNING_MISMATCHED_LOCAL_FILE_HEADER_BIT_FLAG: string;
/**
 * Warning reason: the compression method of the local file header contradicts the central directory
 * (see {@link EntryMetaData#warnings}); the reason of {@link ERR_AMBIGUOUS_ARCHIVE} when
 * {@link ZipReaderOptions#checkLocalDirectory} is enabled
 */
export const WARNING_MISMATCHED_LOCAL_FILE_HEADER_COMPRESSION_METHOD: string;
/**
 * Warning reason: the crc32 or the sizes of the local file header contradict the central directory
 * (see {@link EntryMetaData#warnings}); the reason of {@link ERR_AMBIGUOUS_ARCHIVE} when
 * {@link ZipReaderOptions#checkLocalDirectory} is enabled
 */
export const WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES: string;
