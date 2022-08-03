/**
 * The global object.
 */
declare global {
    /**
     * Represents the `FileSystemEntry` class.
     * 
     * @see {@link https://wicg.github.io/entries-api/#api-entry|specification}
     */
    interface FileSystemEntry { }
}

/**
 * Configures zip.js
 * 
 * @param configuration The configuration. 
 */
export function configure(configuration: Configuration): void

/**
 * Represents the configuration passed to `configure()`.
 */
interface Configuration extends WorkerConfiguration {
    /**
     * The maximum number of web workers used to compress/decompress data simultaneously.
     * 
     * @defaultValue `navigator.hardwareConcurrency`
     */
    maxWorkers?: number
    /**
     * The delay in milliseconds before idle web workers are automatically terminated. You can call `terminateWorkers()` to terminate idle workers.
     * 
     * @defaultValue 5000
     */
    terminateWorkerTimeout?: number
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
        deflate?: string[]
        /**
         * The URIs of the scripts implementing used for decompression.
         */
        inflate?: string[]
    }
    /**
     * The size of the chunks in bytes during data compression/decopression.
     * 
     * @defaultValue 524288
     */
    chunkSize?: number
    /**
     * The implementation used to compress data when `useWebWorkers` is set to `false`.
     * 
     * @defaultValue `ZipDeflate`
     */
    Deflate?: typeof ZipDeflate
    /**
     * The implementation used to decompress data when `useWebWorkers` is set to `false`.
     * 
     * @defaultValue `ZipInflate`
     */
    Inflate?: typeof ZipInflate
}

/**
 * Represents configuration passed to `configure()`, the constructor of `ZipReader`, `ZipReader#getData()`, the constructor of `ZipWriter`, and `ZipWriter#add()`.
 */
interface WorkerConfiguration {
    /**
     * `true` to use web workers to compress/decompress data in non-blocking background processes.
     * 
     * @defaultValue true
     */
    useWebWorkers?: boolean
    /**
     * `true` to use the API `CompressionStream`/`DecompressionStream` to compress/decompress data.
     * 
     * @defaultValue true
     */
    useCompressionStream?: boolean
}

/**
 * Transforms event-based third-party codec implementations into implementations compatible with zip.js
 * 
 * @param library The third-party codec implementations.
 * @param constructorOptions The options passed to the third-party implementations when building instances.
 * @returns An instance containing classes compatible with `ZipDeflate` and `ZipInflate`.
 */
export function initShimAsyncCodec(library: EventBasedZipLibrary, constructorOptions?: any): ZipLibrary

/**
 * Terminates all the idle web workers.
 */
export function terminateWorkers(): void

/**
 * Represents event-based implementations used to compress/decompress data.
 */
interface EventBasedZipLibrary {
    /**
     * The class used to compress data.
     */
    Deflate: typeof EventBasedCodec
    /**
     * The class used to decompress data.
     */
    Inflate: typeof EventBasedCodec
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
    push(data: Uint8Array): void
    /**
     * The function called when a chunk of data has been compressed/decompressed.
     * 
     * @param data The chunk of compressed/decompressed data.
     */
    ondata(data?: Uint8Array): void
}

/**
 * Represents the implementations zip.js uses to compress/decompress data.
 */
interface ZipLibrary {
    /**
     * The class used to compress data.
     * 
     * @defaultValue `ZipDeflate`
     */
    Deflate: typeof ZipDeflate
    /**
     * The class used to decompress data.
     * 
     * @defaultValue `ZipInflate`
     */
    Inflate: typeof ZipInflate
}

/**
 * Represents an intance used to compress data.
 */
declare class ZipDeflate {
    /**
     * Appends a chunk of decompressed data to compress
     * 
     * @param data The chunk of decompressed data to append.
     * @returns A chunk of compressed data.
     */
    append(data: Uint8Array): Uint8Array
    /**
     * Flushes the data
     * 
     * @returns A chunk of compressed data.
     */
    flush(): Uint8Array
}

/**
 * Represents a codec used to decompress data.
 */
declare class ZipInflate {
    /**
     * Appends a chunk of compressed data to decompress
     * 
     * @param data The chunk of compressed data to append.
     * @returns A chunk of decompressed data.
     */
    append(data: Uint8Array): Uint8Array
    /**
     * Flushes the data
     */
    flush(): void
}

/**
 * Returns the MIME type corresponding to a filename extension.
 * 
 * @param fileExtension the extension of the filename.
 * @returns The corresponding MIME type. 
 */
export function getMimeType(fileExtension: string): string

/**
 * Represents an instance used to read or write any type of data.
 * 
 * zip.js can handle multiple types of data thanks to a generic API. This feature is based on 2 abstract constructors: `Reader` and `Writer`. 
 * The classes inheriting from `Reader` help to read data from a source of data. The classes inheriting from `Writer` help to write data into a destination.
 */
interface DataProcessor {
    /**
     * The total size of the read/written data in bytes.
     */
    size: number
    /**
     * Initializes the instance asynchronously
     * 
     */
    init?(): Promise<void>
}

/**
 * Represents an instance used to read data from a `ReadableStream` instance.
 */
interface ReadableReader {
    /**
     * The `ReadableStream` instance.
     */
    readable: ReadableStream
}

/**
 * Represents a `Reader` instance used to read any type of data.
 */
export class Reader<Type> implements ReadableReader, DataProcessor {
    /**
     * Creates the `Reader` instance
     * 
     * @param value The data to read.
     */
    constructor(value: Type)
    /**
     * The `ReadableStream` instance.
     */
    readable: ReadableStream
    /**
     * The total size of the data in bytes.
     */
    size: number
    /**
     * Initializes the instance asynchronously
     * 
     */
    init?(): Promise<void>
    /**
     * Reads a chunk of data
     * 
     * @param index The byte index of the data to read.
     * @param length The length of the data to read in bytes.
     * @returns A promise resolving to a chunk of data.
     */
    readUint8Array(index: number, length: number): Promise<Uint8Array>
}

/**
 * Represents a `Reader` instance used to read data provided as a `string`.
 */
export class TextReader extends Reader<string> { }

/**
 * Represents a `Reader` instance used to read data provided as a `Blob` instance.
 */
export class BlobReader extends Reader<Blob> { }

/**
 * Represents a `Reader` instance used to read data provided as a Data URI `string` encoded in Base64.
 */
export class Data64URIReader extends Reader<string> { }

/**
 * Represents a `Reader` instance used to read data provided as a `Uint8Array` instance.
 */
export class Uint8ArrayReader extends Reader<Uint8Array> { }

/** 
 * Represents a URL stored into a `string`.
 */
interface URLString extends String { }

/**
 * Represents a `Reader` instance used to fetch data from a URL.
 */
export class HttpReader extends Reader<URLString> {
    /**
     * Creates the `HttpReader` instance
     * 
     * @param url The URL of the data.
     * @param options The options.
     */
    constructor(url: URLString, options?: HttpOptions)
}

/**
 * Represents a `Reader` instance used to fetch data from servers returning `Accept-Ranges` headers.
 */
export class HttpRangeReader extends HttpReader {
    /**
     * Creates the `HttpRangeReader` instance
     * 
     * @param url The URL of the data.
     * @param options The options.
     */
    constructor(url: URLString, options?: HttpRangeOptions)
}

/**
 * Represents the options passed to the constructor of `HttpReader`.
 */
interface HttpOptions extends HttpRangeOptions {
    /**
     * `true` to use `Range` headers when fetching data from servers returning `Accept-Ranges` headers.
     * 
     * @defaultValue false
     */
    useRangeHeader?: boolean
    /**
     * `true` to always use `Range` headers when fetching data.
     * 
     * @defaultValue false
     */
    forceRangeRequests?: boolean
    /**
     * `true` to prevent using `HEAD` HTTP request in order the get the size of the content.
     * 
     * @defaultValue false
     */
    preventHeadRequest?: boolean
}

/**
 * Represents options passed to the constructor of `HttpRangeReader` and `HttpReader`.
 */
interface HttpRangeOptions {
    /**
     * `true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.
     * 
     * @defaultValue false
     */
    useXHR?: boolean
    /**
     * The HTTP headers.
     */
    headers?: Iterable<[string, string]> | Map<string, string>
}

/**
 * Represents an instance used to write data into a `WritableStream` instance.
 */
interface WritableWriter {
    /**
     * The `WritableStream` instance.
     */
    writable: WritableStream
}

/**
 * Represents a `Writer` instance used to write any type of data.
 */
export class Writer<Type> implements DataProcessor, WritableWriter {
    /**
     * The `WritableStream` instance.
     */
    writable: WritableStream
    /**
     * The total size of the data in bytes.
     */
    size: number
    /**
     * Initializes the instance asynchronously
     * 
     */
    init?(): Promise<void>
    /**
     * Appends a chunk of data
     * 
     * @param array The chunk data to append.
     */
    writeUint8Array(array: Uint8Array): Promise<void>
    /**
     * Retrieves all the written data
     * 
     * @returns A promise resolving to the written data.
     */
    getData(): Promise<Type>
}

/**
 * Represents a `Writer` instance used to retrieve the written data as a `string`.
 */
export class TextWriter extends Writer<string> {
    /**
     * Creates the `TextWriter` instance
     * 
     * @param encoding The encoding of the text.
     */
    constructor(encoding?: string)
}

/**
 * Represents a `Writer` instance used to retrieve the written data as a `Blob` instance.
 */
export class BlobWriter extends Writer<Blob> {
    /**
     * Creates the `BlobWriter` instance
     * 
     * @param mimeString The MIME type of the content.
     */
    constructor(mimeString?: string)
}

/**
 * Represents a `Writer` instance used to retrieve the written data as a Data URI `string` encoded in Base64.
 */
export class Data64URIWriter extends Writer<string> {
    /**
     * Creates the `Data64URIWriter` instance
     * 
     * @param mimeString The MIME type of the content.
     */
    constructor(mimeString?: string)
}

/**
 * Represents a `Writer` instance used to retrieve the written data as a `Uint8Array` instance.
 */
export class Uint8ArrayWriter extends Writer<Uint8Array> { }

/**
 * Represents a `ZipReader` instance used to read a zip file.
 * 
 * Example:
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
     * Creates the `ZipReader` instance
     * 
     * @param reader The `Reader` instance used to read data.
     * @param options The options.
     */
    constructor(reader: Reader<Type> | ReadableReader, options?: ZipReaderConstructorOptions)
    /**
     * The global comment of the zip file.
     */
    comment: Uint8Array
    /**
     * The data prepended before the zip file.
     */
    prependedData?: Uint8Array
    /**
     * The data appended after the zip file.
     */
    appendedData?: Uint8Array
    /**
     * Returns all the entries in the zip file
     * 
     * @param options The options.
     * @returns A promise resolving to an `array` of `Entry` instances.
     */
    getEntries(options?: ZipReaderGetEntriesOptions): Promise<Entry[]>
    /**
     * Returns a generator used to iterate on all the entries in the zip file
     * 
     * @param options The options.
     * @returns An asynchrounous generator of `Entry` instances.
     */
    getEntriesGenerator(options?: ZipReaderGetEntriesOptions): AsyncGenerator<Entry, boolean>
    /**
     * Closes the zip file
     */
    close(): Promise<void>
}

/**
 * Represents the options passed to the constructor of `ZipReader`, and `ZipDirectoryEntry#import*()`.
 */
interface ZipReaderConstructorOptions extends ZipReaderOptions, GetEntriesOptions, WorkerConfiguration {
    /**
     * `true` to extract the prepended data into `ZipReader#prependedData`.
     * 
     * @defaultValue false
     */
    extractPrependedData?: boolean
    /**
     * `true` to extract the appended data into `ZipReader#appendedData`.
     * 
     * @defaultValue false
     */
    extractAppendedData?: boolean
}

/**
 * Represents the options passed to `ZipReader#getEntries()` and `ZipReader#getEntriesGenerator()`.
 */
interface ZipReaderGetEntriesOptions extends GetEntriesOptions, EntryOnprogressOptions { }

/**
 * Represents options passed to the constructor of `ZipReader`, `ZipReader#getEntries()` and `ZipReader#getEntriesGenerator()`.
 */
interface GetEntriesOptions {
    /**
     * The encoding of the filename of the entry.
     */
    filenameEncoding?: string
    /**
     * The encoding of the comment of the entry.
     */
    commentEncoding?: string
}

/**
 * Represents options passed to the constructor of `ZipReader` and `Entry#getData()`.
 */
interface ZipReaderOptions {
    /**
     * `true` to check the signature of the entry.
     * 
     * @defaultValue false
     */
    checkSignature?: boolean
    /**
     * The password used to decrypt the content of the entry.
     */
    password?: string
    /**
     * The `AbortSignal` instance used to cancel the decompression.
     */
    signal?: AbortSignal
}

/**
 * Represents an entry in a zip file (Core API).
 */
export interface Entry {
    /**
     * The byte offset of the entry.
     */
    offset: number
    /**
     * The filename of the entry.
     */
    filename: string
    /**
     * The filename of the entry (raw).
     */
    rawFilename: Uint8Array
    /**
     * `true` if the filename is encoded in UTF-8.
     */
    filenameUTF8: boolean
    /**
     * `true` if the entry is a directory.
     */
    directory: boolean
    /**
     * `true` if the content of the entry is encrypted.
     */
    encrypted: boolean
    /**
     * The size of the compressed data in bytes.
     */
    compressedSize: number
    /**
     * The size of the decompressed data in bytes.
     */
    uncompressedSize: number
    /**
     * The last modification date.
     */
    lastModDate: Date
    /**
     * The last access date.
     */
    lastAccessDate?: Date
    /**
     * The creation date.
     */
    creationDate?: Date
    /**
     * The last modification date (raw).
     */
    rawLastModDate: number | bigint
    /**
     * The last access date (raw).
     */
    rawLastAccessDate?: number | bigint
    /**
     * The creation date (raw).
     */
    rawCreationDate?: number | bigint
    /**
     * The comment of the entry.
     */
    comment: string
    /**
     * The comment of the entry (raw).
     */
    rawComment: Uint8Array
    /**
     * `true` if the comment is encoded in UTF-8.
     */
    commentUTF8: boolean
    /**
     * The signature (CRC32 checksum) of the content.
     */
    signature: number
    /**
     * The extra field.
     */
    extraField?: Map<number, Uint8Array>
    /**
     * The extra field (raw).
     */
    rawExtraField: Uint8Array
    /**
     * `true` if the entry is using Zip64.
     */
    zip64: boolean
    /**
     * The "Version" field.
     */
    version: number
    /**
     * The "Version made by" field.
     */
    versionMadeBy: number
    /**
     * `true` if "Version made by" equals to 0.
     */
    msDosCompatible: boolean
    /**
     * The internal file attribute (raw).
     */
    internalFileAttribute: number
    /**
     * The external file attribute (raw).
     */
    externalFileAttribute: number
    /**
     * Returns the content of the entry
     * 
     * @param writer The `Writer` instance used to write the content of the entry.
     * @param options The options.
     * @returns A promise resolving to the type to data associated to `writer`.
     */
    getData?<Type>(writer: Writer<Type> | WritableWriter, options?: EntryGetDataOptions): Promise<Type>
}

/**
 * Represents the options passed to `Entry#getData()` and `ZipFileEntry.get*()`.
 */
interface EntryGetDataOptions extends EntryDataOnprogressOptions, ZipReaderOptions, WorkerConfiguration { }

/**
 * Represents a `ZipWriter` instance used to create a zip file.
 * 
 * Example:
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
 * const blob = blobWriter.getData();
 * ```
 */
export class ZipWriter<Type> {
    /**
     * Creates the `ZipWriter` instance
     * 
     * @param writer The `Writer` instance where the zip content will be written.
     * @param options The options.
     */
    constructor(writer: Writer<Type> | WritableWriter, options?: ZipWriterConstructorOptions)
    /**
     * `true` if the zip contains at least one entry that has been partially written.
     */
    readonly hasCorruptedEntries?: boolean
    /**
     * Adds an entry into the zip file
     * 
     * @param filename The filename of the entry.
     * @param reader The `Reader` instance used to read the content of the entry.
     * @param options The options.
     * @returns A promise resolving to an `Entry` instance.
     */
    add<ReaderType>(filename: string, reader: Reader<ReaderType> | ReadableReader | void, options?: ZipWriterAddDataOptions): Promise<Entry>
    /**
     * Writes the entries directory, writes the global comment, and returns the content of the zip file
     * 
     * @param comment The global comment of the zip file.
     * @param options The options.
     * @returns The content of the zip file.
     */
    close(comment: Uint8Array | void, options?: ZipWriterCloseOptions): Promise<Type>
}

/**
 * Represents the options passed to `ZipWriter#add()`.
 */
interface ZipWriterAddDataOptions extends ZipWriterConstructorOptions, EntryDataOnprogressOptions, WorkerConfiguration {
    /**
     * `true` if the entry is a directory.
     * 
     * @defaultValue false
     */
    directory?: boolean
    /**
     * The comment of the entry.
     */
    comment?: string
    /**
     * The extra field of the entry.
     */
    extraField?: Map<number, Uint8Array>
}

/**
 * Represents the options passed to `ZipWriter#close()`.
 */
interface ZipWriterCloseOptions extends EntryOnprogressOptions {
    /**
     * `true` to use Zip64 to write the entries directory.
     * 
     * @defaultValue false
     */
    zip64?: boolean
    /**
     * `true` to prevent closing of `Writer#writable`.
     * 
     * @defaultValue false
     */
    preventClose?: boolean
}

/**
 * Represents options passed to the constructor of `ZipWriter`, `ZipWriter#add()` and `ZipDirectoryEntry#export*()`.
 */
interface ZipWriterConstructorOptions {
    /**
     * `true` to use Zip64 to store the entry.
     * 
     * @defaultValue false
     */
    zip64?: boolean
    /**
     * The level of compression.
     * 
     * @defaultValue 5
     */
    level?: number
    /**
     * `true` to write entry data in a buffer before appending it to the zip file.
     * 
     * @defaultValue false
     */
    bufferedWrite?: boolean
    /**
     * `true` to keep the order of the entry physically in the zip file.
     * 
     * @defaultValue true
     */
    keepOrder?: boolean
    /**
     * The "Version" field.
     */
    version?: number
    /**
     * The password used to encrypt the content of the entry.
     */
    password?: string
    /**
     * The encryption strength (AES).
     * 
     * @defaultValue 3
     */
    encryptionStrength?: 1 | 2 | 3
    /**
     * `true` to use the ZipCrypto algorithm to encrypt the content of the entry.
     * 
     * @defaultValue false
     */
    zipCrypto?: boolean
    /**
     * `true` to to add a data descriptor.
     * 
     * @defaultValue true
     */
    dataDescriptor?: boolean
    /**
     * `true` to add the signature of the data descriptor.
     * 
     * @defaultValue false
     */
    dataDescriptorSignature?: boolean
    /**
     * The `AbortSignal` instance used to cancel the compression.
     */
    signal?: AbortSignal
    /**
     * The last modification date.
     * 
     * @defaultValue The current date.
     */
    lastModDate?: Date
    /**
     * The last access date.
     * 
     * @defaultValue The current date.
     */
    lastAccessDate?: Date
    /**
     * The creation date.
     * 
     * @defaultValue The current date.
     */
    creationDate?: Date
    /**
     * `true` to store extended timestamp extra fields.
     * 
     * @defaultValue true
     */
    extendedTimestamp?: boolean
    /**
     * `true` to write `internalFileAttribute` and `externalFileAttribute` in MS-DOS format.
     * 
     * @defaultValue true
     */
    msDosCompatible?: boolean
    /**
     * The internal file attribute.
     * 
     * @defaultValue 0
     */
    internalFileAttribute?: number
    /**
     * The external file attribute.
     * 
     * @defaultValue 0
     */
    externalFileAttribute?: number
}

/**
 * Represents options passed to `Entry#getData`, `ZipWriter.add()` and `ZipDirectory.export*()`.
 */
interface EntryDataOnprogressOptions {
    /**
     * The function called when starting compression/decompression.
     * 
     * @param total The total number of bytes.
     * @returns An empty promise or `undefined`.
     */
    onstart?(total: number): Promise<void> | undefined
    /**
     * The function called during compression/decompression.
     * 
     * @param progress The current progress in bytes.
     * @param total The total number of bytes.
     * @returns An empty promise or `undefined`.
     */
    onprogress?(progress: number, total: number): Promise<void> | undefined
    /**
     * The function called when ending compression/decompression.
     * 
     * @param computedSize The total number of bytes (computed).
     * @returns An empty promise or `undefined`.
     */
    onend?(computedSize: number): Promise<void> | undefined
}

/**
 * Represents options passed to `ZipReader#getEntries()`, `ZipReader#getEntriesGenerator()`, and `ZipWriter#close()`.
 */
interface EntryOnprogressOptions {
    /**
     * The function called each time an entry is read/written.
     * 
     * @param progress The entry index.
     * @param total The total number of entries.
     * @param entry The entry being read/written.
     * @returns An empty promise or `undefined`.
     */
    onprogress?(progress: number, total: number, entry: Entry): Promise<void> | undefined
}

/**
 * Represents an entry in a zip file (Filesystem API).
 */
declare class ZipEntry {
    /**
     * The relative filename of the entry.
     */
    name: string
    /**
     * The underlying `Entry` instance.
     */
    data?: Entry
    /**
     * The ID of the instance.
     */
    id: number
    /**
     * The parent directory of the entry.
     */
    parent?: ZipEntry
    /**
     * The uncompressed size of the content.
     */
    uncompressedSize: number
    /**
     * The children of the entry.
     */
    children: ZipEntry[]
    /**
     * Returns the full filename of the entry
     */
    getFullname(): string
    /**
     * Returns the filename of the entry relative to a parent directory
     */
    getRelativeName(ancestor: ZipDirectoryEntry): string
    /**
     * Tests if a `ZipDirectoryEntry` instance is an ancestor of the entry
     * 
     * @param ancestor The `ZipDirectoryEntry` instance.
     */
    isDescendantOf(ancestor: ZipDirectoryEntry): boolean
}

/**
 * Represents a file entry in the zip (Filesystem API).
 */
declare class ZipFileEntry<ReaderType, WriterType> extends ZipEntry {
    /**
     * `void` for `ZipFileEntry` instances.
     */
    directory: void
    /**
     * The `Reader` instance used to read the content of the entry.
     */
    reader: Reader<ReaderType> | ReadableReader
    /**
     * The `Writer` instance used to write the content of the entry.
     */
    writer: Writer<WriterType> | WritableWriter
    /**
     * Retrieves the text content of the entry as a `string`
     * 
     * @param encoding The encoding of the text.
     * @param options The options.
     * @returns A promise resolving to a `string`.
     */
    getText(encoding: string | void, options?: EntryGetDataOptions): Promise<string>
    /**
     * Retrieves the content of the entry as a `Blob` instance
     * 
     * @param mimeType The MIME type of the content.
     * @param options The options.
     * @returns A promise resolving to a `Blob` instance.
     */
    getBlob(mimeType: string | void, options?: EntryGetDataOptions): Promise<Blob>
    /**
     * Retrieves the content of the entry as as a Data URI `string` encoded in Base64
     * 
     * @param mimeType The MIME type of the content.
     * @param options The options.
     * @returns A promise resolving to a Data URI `string` encoded in Base64.
     */
    getData64URI(mimeType: string | void, options?: EntryGetDataOptions): Promise<string>
    /**
     * Retrieves the content of the entry as a `Uint8Array` instance
     * 
     * @param options The options.
     * @returns A promise resolving to a `Uint8Array` instance.
     */
    getUint8Array(options?: EntryGetDataOptions): Promise<Uint8Array>
    /**
     * Retrieves the content of the entry via a `WritableStream` instance
     * 
     * @param writable The `WritableStream` instance.
     * @param options The options.
     * @returns A promise resolving to the `WritableStream` instance.
     */
    getWritable(writable: WritableStream | void, options?: EntryGetDataOptions): Promise<WritableStream>
    /**
     * Retrieves the content of the entry via a `Writer` instance
     * 
     * @param writer The `Writer` instance.
     * @param options The options.
     * @returns A promise resolving to data associated to the `Writer` instance.
     */
    getData(writer: Writer<WriterType>, options?: EntryGetDataOptions): Promise<WriterType>
    /**
     * Replaces the content of the entry with a `Blob` instance
     * 
     * @param blob The `Blob` instance.
     */
    replaceBlob(blob: Blob): void
    /**
     * Replaces the content of the entry with a `string`
     * 
     * @param text The `string`.
     */
    replaceText(text: string): void
    /**
     * Replaces the content of the entry with a Data URI `string` encoded in Base64
     * 
     * @param dataURI The Data URI `string` encoded in Base64.
     */
    replaceData64URI(dataURI: string): void
    /**
     * Replaces the content of the entry with a `Uint8Array` instance
     * 
     * @param array The `Uint8Array` instance.
     */
    replaceUint8Array(array: Uint8Array): void
    /**
     * Replaces the content of the entry with a `ReadableStream` instance
     * 
     * @param readable The `ReadableStream` instance.
     */
    replaceReadable(readable: ReadableStream): void
}

/**
 * Represents a directory entry in the zip (Filesystem API).
 */
declare class ZipDirectoryEntry extends ZipEntry {
    /**
     * `true` for `ZipDirectoryEntry` instances.
     */
    directory: true
    /**
     * Gets a `ZipEntry` child instance from its relative filename
     * 
     * @param name The relative filename.
     * @returns A `ZipFileEntry` or a `ZipDirectoryEntry` instance (use the `directory` property to differentiate entries).
     */
    getChildByName(name: string): ZipEntry | undefined
    /**
     * Adds a directory
     * 
     * @param name The relative filename of the directory
     * @returns A `ZipDirectoryEntry` instance.
     */
    addDirectory(name: string): ZipDirectoryEntry
    /**
     * Adds an entry with content provided as text
     * 
     * @param name The relative filename of the entry.
     * @param text The text. 
     * @returns A `ZipFileEntry` instance.
     */
    addText(name: string, text: string): ZipFileEntry<string, string>
    /**
     * Adds aentry entry with content provided as a `Blob` instance
     * 
     * @param name The relative filename of the entry.
     * @param blob The `Blob` instance. 
     * @returns A `ZipFileEntry` instance.
     */
    addBlob(name: string, blob: Blob): ZipFileEntry<Blob, Blob>
    /**
     * Adds aentry entry with content provided as a Data URI `string` encoded in Base64
     * 
     * @param name The relative filename of the entry.
     * @param dataURI The Data URI `string` encoded in Base64.
     * @returns A `ZipFileEntry` instance.
     */
    addData64URI(name: string, dataURI: string): ZipFileEntry<string, string>
    /**
     * Adds an entry with content provided as a `Uint8Array` instance
     * 
     * @param name The relative filename of the entry.
     * @param array The `Uint8Array` instance. 
     * @returns A `ZipFileEntry` instance.
     */
    addUint8Array(name: string, array: Uint8Array): ZipFileEntry<Uint8Array, Uint8Array>
    /**
     * Adds an entry with content fetched from a URL
     * 
     * @param name The relative filename of the entry.
     * @param url The URL.
     * @param options The options. 
     * @returns A `ZipFileEntry` instance.
     */
    addHttpContent(name: string, url: string, options?: HttpOptions): ZipFileEntry<string, void>
    /**
     * Adds aentry entry with content provided via a `ReadableStream` instance
     * 
     * @param name The relative filename of the entry.
     * @param readable The `ReadableStream` instance. 
     * @returns A `ZipFileEntry` instance.
     */
    addReadable(name: string, readable: ReadableStream): ZipFileEntry<ReadableStream, void>
    /**
     * Adds an entry with content provided via a `FileSystemEntry` instance
     * 
     * @param fileSystemEntry The `FileSystemEntry` instance. 
     * @returns A promise resolving to a `ZipFileEntry` or a `ZipDirectoryEntry` instance.
     */
    addFileSystemEntry(fileSystemEntry: FileSystemEntry): Promise<ZipEntry>
    /**
     * Extracts a zip file provided as a `Blob` instance into the entry
     * 
     * @param blob The `Blob` instance.
     * @param options  The options.
     */
    importBlob(blob: Blob, options?: ZipReaderConstructorOptions): Promise<void>
    /**
     * Extracts a zip file provided as a Data URI `string` encoded in Base64 into the entry
     * 
     * @param dataURI The Data URI `string` encoded in Base64.
     * @param options  The options.
     */
    importData64URI(dataURI: string, options?: ZipReaderConstructorOptions): Promise<void>
    /**
     * Extracts a zip file provided as a `Uint8Array` instance into the entry
     * 
     * @param array The `Uint8Array` instance.
     * @param options  The options.
     */
    importUint8Array(array: Uint8Array, options?: ZipReaderConstructorOptions): Promise<void>
    /**
     * Extracts a zip file fetched from a URL into the entry
     * 
     * @param url The URL.
     * @param options  The options.
     */
    importHttpContent(url: string, options?: ZipDirectoryEntryImportHttpOptions): Promise<void>
    /**
     * Extracts a zip file provided via a `ReadableStream` instance into the entry
     * 
     * @param readable The `ReadableStream` instance.
     * @param options  The options.
     */
    importReadable(readable: ReadableStream, options?: ZipReaderConstructorOptions): Promise<void>
    /**
     * Returns a `Blob` instance containing a zip file of the entry and its descendants, if any
     * 
     * @param options  The options.
     * @returns A promise resolving to the `Blob` instance.
     */
    exportBlob(options?: ZipDirectoryEntryExportOptions): Promise<Blob>
    /**
     * Returns a Data URI `string` encoded in Base64 containing a zip file of the entry and its descendants, if any
     * 
     * @param options  The options.
     * @returns A promise resolving to the Data URI `string` encoded in Base64.
     */
    exportData64URI(options?: ZipDirectoryEntryExportOptions): Promise<string>
    /**
     * Returns a `Uint8Array` instance containing a zip file of the entry and its descendants, if any
     * 
     * @param options  The options.
     * @returns A promise resolving to the `Uint8Array` instance.
     */
    exportUint8Array(options?: ZipDirectoryEntryExportOptions): Promise<Uint8Array>
    /**
     * Creates a zip file via a `WritableStream` instance containing the entry and its descendants, if any
     * 
     * @param writable The `WritableStream` instance.
     * @param options  The options.
     * @returns A promise resolving to the `Uint8Array` instance.
     */
    exportWritable(writable: WritableStream | void, options?: ZipDirectoryEntryExportOptions): Promise<WritableStream>
}

/**
 * Represents the options passed to `ZipDirectoryEntry#importHttpContent()`.
 */
interface ZipDirectoryEntryImportHttpOptions extends ZipReaderConstructorOptions, HttpOptions { }

/**
 * Represents the options passed to `ZipDirectoryEntry#export*()`.
 */
interface ZipDirectoryEntryExportOptions extends ZipWriterConstructorOptions, EntryDataOnprogressOptions {
    /**
    * `true` to use filenames relative to the entry instead of full filenames.
    */
    relativePath?: boolean
}

/**
 * Represents a Filesystem instance.
 * 
 * Example:
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
declare class FS extends ZipDirectoryEntry {
    /**
     * The root directory.
     */
    root: ZipDirectoryEntry
    /**
     * Removes a `ZipEntry` instance and its children
     * 
     * @param entry The `ZipEntry` instance to remove.
     */
    remove(entry: ZipEntry): void
    /**
     * Moves a `ZipEntry` instance and its children into a `ZipDirectoryEntry` instance
     * 
     * @param entry The `ZipEntry` instance to move.
     * @param destination The `ZipDirectoryEntry` instance.
     */
    move(entry: ZipEntry, destination: ZipDirectoryEntry): void
    /**
     * Returns a `ZipEntry` instance from its full filename
     * 
     * @param fullname The full filename.
     * @returns The `ZipEntry` instance.
     */
    find(fullname: string): ZipEntry | undefined
    /**
     * Returns a `ZipEntry` instance from the value of `ZipEntry#id`
     * 
     * @param id The id of the `ZipEntry` instance.
     * @returns The `ZipEntry` instance.
     */
    getById(id: number): ZipEntry | undefined
}

/**
 * The Filesystem API.
 */
export const fs: {
    /**
     * The Filesystem constructor.
     * 
     * @defaultValue `FS`
     */
    FS: typeof FS
    /**
     * The `ZipDirectoryEntry` constructor.
     * 
     * @defaultValue `ZipDirectoryEntry`
     */
    ZipDirectoryEntry: typeof ZipDirectoryEntry
    /**
     * The `ZipFileEntry` constructor.
     * 
     * @defaultValue `ZipFileEntry`
     */
    ZipFileEntry: typeof ZipFileEntry
}

// The error messages.
export const ERR_HTTP_RANGE: string
export const ERR_BAD_FORMAT: string
export const ERR_EOCDR_NOT_FOUND: string
export const ERR_EOCDR_ZIP64_NOT_FOUND: string
export const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: string
export const ERR_CENTRAL_DIRECTORY_NOT_FOUND: string
export const ERR_LOCAL_FILE_HEADER_NOT_FOUND: string
export const ERR_EXTRAFIELD_ZIP64_NOT_FOUND: string
export const ERR_ENCRYPTED: string
export const ERR_UNSUPPORTED_ENCRYPTION: string
export const ERR_UNSUPPORTED_COMPRESSION: string
export const ERR_INVALID_SIGNATURE: string
export const ERR_INVALID_PASSWORD: string
export const ERR_DUPLICATED_NAME: string
export const ERR_INVALID_COMMENT: string
export const ERR_INVALID_ENTRY_NAME: string
export const ERR_INVALID_ENTRY_COMMENT: string
export const ERR_INVALID_VERSION: string
export const ERR_INVALID_EXTRAFIELD_TYPE: string
export const ERR_INVALID_EXTRAFIELD_DATA: string
export const ERR_INVALID_ENCRYPTION_STRENGTH: string
export const ERR_UNSUPPORTED_FORMAT: string