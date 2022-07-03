export function configure(configuration: ConfigurationOptions): void;

declare global {
    // deno-lint-ignore no-empty-interface
    interface FileSystemEntry { }
}

interface ConfigurationOptions {
    useWebWorkers?: boolean;
    maxWorkers?: number;
    terminateWorkerTimeout?: number;
    workerScripts?: {
        deflate?: string[];
        inflate?: string[];
    };
    chunkSize?: number;
    Deflate?: Codec;
    Inflate?: Codec;
}

export function initShimAsyncCodec(library: ZipLibrary, constructorOptions?: ConstructorOptions): { Deflate: Codec, Inflate: Codec };

export function terminateWorkers(): void;

interface ZipLibrary {
    Deflate: ZipDeflate["constructor"],
    Inflate: ZipInflate["constructor"]
}

interface ZipDeflate {
    append(): Uint8Array,
    flush(): Uint8Array
}

interface ZipInflate {
    append(): Uint8Array,
    flush(): void
}

interface ConstructorOptions {
    chunkSize?: number,
    level?: number
}

export interface Codec {
    append(data: Uint8Array): Promise<Uint8Array>;
    flush(): Promise<Uint8Array>;
}

export function getMimeType(fileExtension: string): string;

export class Stream {
    public size: number;
    public init(): Promise<void>;
}

export class Reader<Type> extends Stream {
    constructor(value: Type);
    public readUint8Array(index: number, length: number): Promise<Uint8Array>;
}

export class TextReader extends Reader<string> {
}

export class BlobReader extends Reader<Blob> {
}

export class Data64URIReader extends Reader<string> {
}

export class Uint8ArrayReader extends Reader<Uint8Array> {
}

export class HttpReader<Type extends string> extends Reader<Type> {
    constructor(url: Type, options?: HttpOptions);
}

export class HttpRangeReader<Type extends string> extends Reader<Type> {
    constructor(url: Type, options?: HttpRangeOptions);
}

interface HttpOptions extends HttpRangeOptions {
    useRangeHeader?: boolean;
    preventHeadRequest?: boolean;
}

interface HttpRangeOptions {
    forceRangeRequests?: boolean;
    useXHR?: boolean;
    headers?: Iterable<[string, string]> | Map<string, string>;
}

export class ReadableStreamReader {
    constructor(readableStream: ReadableStream);
    public readUint8Array(_index: number, length: number): Promise<Uint8Array>;
}

export class Writer<Type> extends Stream {
    public writeUint8Array(array: Uint8Array): Promise<void>;
    public getData(): Promise<Type>;
}

export class TextWriter extends Writer<string> {
    constructor(encoding?: string);
}

export class BlobWriter extends Writer<Blob> {
    constructor(mimeString?: string);
}

export class Data64URIWriter extends Writer<string> {
    constructor(mimeString?: string);
}

export class Uint8ArrayWriter extends Writer<Uint8Array> {
    constructor();
}

export class WritableStreamWriter<Type extends WritableStream> extends Writer<Type> {
    constructor(writableStream: Type);
}

export class ZipReader<Type> {
    constructor(reader: Reader<Type>, options?: ZipReaderConstructorOptions);
    getEntries(options?: ZipReaderGetEntriesOptions): Promise<Entry[]>;
    getEntriesGenerator(options?: ZipReaderGetEntriesOptions): AsyncGenerator<Entry, boolean>;
    close(): Promise<void>;
}

type ZipReaderConstructorOptions = ZipReaderOptions & GetEntriesOptions;

type ZipReaderGetEntriesOptions = EntryOnprogressOption & GetEntriesOptions;

interface ZipReaderOptions {
    checkSignature?: boolean;
    password?: string;
    useWebWorkers?: boolean;
    signal?: AbortSignal;
}

interface GetEntriesOptions {
    filenameEncoding?: string;
    commentEncoding?: string;
}

export interface Entry {
    offset?: number;
    filename: string;
    rawFilename: Uint8Array;
    filenameUTF8: boolean;
    directory: boolean;
    encrypted: boolean;
    compressedSize: number;
    uncompressedSize: number;
    lastModDate: Date;
    lastAccessDate?: Date;
    creationDate?: Date;
    rawLastModDate: number;
    rawLastAccessDate?: Date;
    rawCreationDate?: Date;
    comment: string;
    rawComment: Uint8Array;
    commentUTF8: boolean;
    signature: Uint8Array;
    extraField?: Map<number, Uint8Array>;
    rawExtraField: Uint8Array;
    zip64: boolean;
    version: number;
    versionMadeBy: number;
    msDosCompatible: boolean;
    internalFileAttribute: number;
    externalFileAttribute: number;
    getData?<Type>(writer: Writer<Type>, options?: EntryGetDataOptions): Promise<Type>;
}

type EntryGetDataOptions = EntryDataOnprogressOption & ZipReaderOptions;

export class ZipWriter<Type> {
    readonly hasCorruptedEntries?: boolean;
    constructor(writer: Writer<Type>, options?: ZipWriterConstructorOptions);
    public add<ReaderType>(name: string, reader: Reader<ReaderType> | ReadableStreamReader | null, options?: ZipWriterAddDataOptions): Promise<Entry>;
    public close(comment?: Uint8Array, options?: ZipWriterCloseOptions): Promise<Type>;
}

type ZipWriterAddDataOptions = EntryDataOnprogressOption & AddDataOptions & ZipWriterConstructorOptions;

type ZipWriterCloseOptions = EntryOnprogressOption & CloseOptions;

interface ZipWriterConstructorOptions {
    zip64?: boolean;
    level?: number;
    bufferedWrite?: boolean;
    keepOrder?: boolean;
    version?: number;
    password?: string;
    encryptionStrength?: number;
    zipCrypto?: boolean;
    useWebWorkers?: boolean;
    dataDescriptor?: boolean;
    dataDescriptorSignature?: boolean;
    signal?: AbortSignal;
    lastModDate?: Date;
    lastAccessDate?: Date;
    creationDate?: Date;
    extendedTimestamp?: boolean;
    msDosCompatible?: boolean;
    internalFileAttribute?: number;
    externalFileAttribute?: number;
}

interface AddDataOptions {
    directory?: boolean;
    comment?: string;
    extraField?: Map<number, Uint8Array>;
}

interface CloseOptions {
    zip64?: boolean;
}

interface EntryDataOnprogressOption {
    onprogress?: (progress: number, total: number) => void;
}

interface EntryOnprogressOption {
    onprogress?: (progress: number, total: number, entry: Entry) => void;
}

interface ZipEntryConstructorParams {
    data: Entry;
}

export class ZipEntry {
    constructor(fs: FS, name: string, params: ZipEntryConstructorParams, parent: ZipDirectoryEntry);
    name: string;
    data?: Entry;
    id: number;
    parent?: ZipEntry;
    children: ZipEntry[];
    uncompressedSize: number;
    getFullname(): string;
    getRelativeName(ancestor: ZipDirectoryEntry): string;
    isDescendantOf(ancestor: ZipDirectoryEntry): boolean;
}

interface ZipFileEntryConstructorParams<ReaderType, WriterType> extends ZipEntryConstructorParams {
    reader: Reader<ReaderType>;
    writer: Writer<WriterType>;
    getData?(writer: Writer<WriterType>, options?: EntryGetDataOptions): Promise<WriterType>;
}

export class ZipFileEntry<ReaderType, WriterType> extends ZipEntry {
    constructor(fs: FS, name: string, params: ZipFileEntryConstructorParams<ReaderType, WriterType>, parent: ZipDirectoryEntry);
    reader: Reader<ReaderType>;
    writer: Writer<WriterType>;
    getText(encoding?: string, options?: EntryGetDataOptions): Promise<string>;
    getBlob(mimeType?: string, options?: EntryGetDataOptions): Promise<Blob>;
    getData64URI(mimeType?: string, options?: EntryGetDataOptions): Promise<string>;
    getUint8Array(options?: EntryGetDataOptions): Promise<Uint8Array>;
    getData(writer: Writer<WriterType>, options?: EntryGetDataOptions): Promise<WriterType>;
    replaceBlob(blob: Blob): void;
    replaceText(text: string): void;
    replaceData64URI(dataURI: string): void;
    replaceUint8Array(array: Uint8Array): void;
}

interface ExportOptions {
    relativePath?: boolean;
}

export class ZipDirectoryEntry extends ZipEntry {
    constructor(fs: FS, name: string, params: ZipEntryConstructorParams, parent: ZipDirectoryEntry);
    getChildByName(name: string): ZipEntry;
    addDirectory(name: string): ZipDirectoryEntry;
    addText(name: string, text: string): ZipFileEntry<string, string>;
    addBlob(name: string, blob: Blob): ZipFileEntry<Blob, Blob>;
    addData64URI(name: string, dataURI: string): ZipFileEntry<string, string>;
    addUint8Array(name: string, array: Uint8Array): ZipFileEntry<Uint8Array, Uint8Array>;
    addHttpContent(name: string, url: string, options?: HttpOptions): ZipFileEntry<string, string>;
    addFileSystemEntry(fileSystemEntry: FileSystemEntry): Promise<ZipEntry>;
    importBlob(blob: Blob, options?: ZipReaderConstructorOptions): Promise<void>;
    importData64URI(dataURI: string, options?: ZipReaderConstructorOptions): Promise<void>;
    importUint8Array(array: Uint8Array, options?: ZipReaderConstructorOptions): Promise<void>;
    importHttpContent(url: string, options?: ZipDirectoryEntryImportHttpOptions): Promise<void>;
    exportBlob(options?: ZipDirectoryEntryExportOptions): Promise<Blob>;
    exportData64URI(options?: ZipDirectoryEntryExportOptions): Promise<string>;
    exportUint8Array(options?: ZipDirectoryEntryExportOptions): Promise<Uint8Array>;
}

type ZipDirectoryEntryImportHttpOptions = ZipReaderConstructorOptions & HttpOptions;

type ZipDirectoryEntryExportOptions = EntryDataOnprogressOption & ExportOptions & ZipWriterConstructorOptions;

export class FS extends ZipDirectoryEntry {
    constructor();
    root: ZipDirectoryEntry;
    remove(entry: ZipEntry): void;
    move(entry: ZipEntry, destination: ZipDirectoryEntry): void;
    find(fullname: string): ZipEntry;
    getById(id: number): ZipEntry;
}

export const fs: { FS: typeof FS, ZipDirectoryEntry: typeof ZipDirectoryEntry, ZipFileEntry: typeof ZipFileEntry };
export const ERR_HTTP_RANGE: string;
export const ERR_BAD_FORMAT: string;
export const ERR_EOCDR_NOT_FOUND: string;
export const ERR_EOCDR_ZIP64_NOT_FOUND: string;
export const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: string;
export const ERR_CENTRAL_DIRECTORY_NOT_FOUND: string;
export const ERR_LOCAL_FILE_HEADER_NOT_FOUND: string;
export const ERR_EXTRAFIELD_ZIP64_NOT_FOUND: string;
export const ERR_ENCRYPTED: string;
export const ERR_UNSUPPORTED_ENCRYPTION: string;
export const ERR_UNSUPPORTED_COMPRESSION: string;
export const ERR_INVALID_SIGNATURE: string;
export const ERR_INVALID_PASSWORD: string;
export const ERR_DUPLICATED_NAME: string;
export const ERR_INVALID_COMMENT: string;
export const ERR_INVALID_ENTRY_NAME: string;
export const ERR_INVALID_ENTRY_COMMENT: string;
export const ERR_INVALID_VERSION: string;
export const ERR_INVALID_EXTRAFIELD_TYPE: string;
export const ERR_INVALID_EXTRAFIELD_DATA: string;
export const ERR_INVALID_ENCRYPTION_STRENGTH: string;
export const ERR_UNSUPPORTED_FORMAT: string;
export const ERR_ABORT: string;
export const ERR_NOT_SEEKABLE_READER: string