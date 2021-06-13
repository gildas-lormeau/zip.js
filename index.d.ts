declare module "@zip.js/zip.js" {

    export function configure(configuration: ConfigurationOptions): void;

    global {
        interface FileSystemEntry { }
    }

    export interface ConfigurationOptions {
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

    export function initShimAsyncCodec(constructor: object, constructorOptions?: any): { Deflate: Codec, Inflate: Codec };

    export function terminateWorkers(): void;

    export interface Codec {
        append(data: Uint8Array): Promise<Uint8Array>;
        flush(): Promise<Uint8Array>;
    }

    export function getMimeType(fileExtension: string): string;

    export class Stream {
        public size: number;
        public init(): Promise<void>;
    }

    export class Reader extends Stream {
        public readUint8Array(index: number, length: number): Promise<Uint8Array>;
    }

    export class TextReader extends Reader {
        constructor(text: string);
    }

    export class BlobReader extends Reader {
        constructor(blob: Blob);
    }

    export class Data64URIReader extends Reader {
        constructor(dataURI: string);
    }

    export class Uint8ArrayReader extends Reader {
        constructor(array: Uint8Array);
    }

    export class HttpReader extends Reader {
        constructor(url: string, options: HttpOptions);
    }

    export class HttpRangeReader extends Reader {
        constructor(url: string, options: HttpRangeOptions);
    }

    export interface HttpOptions extends HttpRangeOptions {
        useRangeHeader?: boolean;
        preventHeadRequest?: boolean;
    }

    export interface HttpRangeOptions {
        forceRangeRequests?: boolean;
        useXHR?: boolean;
    }

    export class Writer extends Stream {
        public writeUint8Array(array: Uint8Array): Promise<void>;
    }

    export class TextWriter extends Writer {
        constructor(encoding?: string);
        public getData(): string;
    }

    export class BlobWriter extends Writer {
        constructor(mimeString?: string);
        public getData(): Blob;
    }

    export class Data64URIWriter extends Writer {
        constructor(mimeString?: string);
        public getData(): string;
    }

    export class Uint8ArrayWriter extends Writer {
        constructor();
        public getData(): Uint8Array;
    }

    export class ZipReader {
        constructor(reader: Reader, options?: ZipReaderOptions | GetEntriesOptions);
        getEntries(options?: OnprogressEntryOption | GetEntriesOptions): Promise<Entry[]>;
        close(): Promise<any>;
    }

    export interface ZipReaderOptions {
        checkSignature?: boolean;
        password?: string;
        useWebWorkers?: boolean;
        signal?: AbortSignal;
    }

    export interface GetEntriesOptions {
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
        msDosCompatible: boolean;
        internalFileAttribute: number;
        externalFileAttribute: number;
        getData?(writer: Writer, options?: OnprogressEntryDataOption | ZipReaderOptions): Promise<any>;
    }

    export class ZipWriter {
        readonly hasCorruptedEntries?: boolean;
        constructor(writer: Writer, options?: ZipWriterOptions);
        public add(name: string, reader: Reader, options?: OnprogressEntryDataOption | AddDataOptions | ZipWriterOptions): Promise<Entry>;
        public close(comment?: Uint8Array, options?: OnprogressEntryOption | CloseOptions): Promise<any>;
    }

    export interface ZipWriterOptions {
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
        signal?: AbortSignal;
        lastModDate?: Date;
        lastAccessDate?: Date;
        creationDate?: Date;
        extendedTimestamp?: boolean;
    }

    export interface AddDataOptions {
        directory?: boolean;
        comment?: string;
        extraField?: Map<number, Uint8Array>;
    }

    export interface CloseOptions {
        zip64?: boolean;
    }

    export interface OnprogressEntryDataOption {
        onprogress?: (progress: number, total: number) => void;
    }

    export interface OnprogressEntryOption {
        onprogress?: (progress: number, total: number, entry: Entry) => void;
    }

    export interface ZipEntry {
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

    export interface ZipFileEntry extends ZipEntry {
        reader: Reader;
        writer: Writer;
        getText(encoding?: string, options?: OnprogressEntryDataOption | ZipReaderOptions): Promise<string>;
        getBlob(mimeType?: string, options?: OnprogressEntryDataOption | ZipReaderOptions): Promise<Blob>;
        getData64URI(mimeType?: string, options?: OnprogressEntryDataOption | ZipReaderOptions): Promise<string>;
        getUint8Array(options?: OnprogressEntryDataOption | ZipReaderOptions): Promise<Uint8Array>;
        getData(writer: Writer, options?: OnprogressEntryDataOption | ZipReaderOptions): Promise<any>;
        replaceBlob(blob: Blob): void;
        replaceText(text: String): void;
        replaceData64URI(dataURI: String): void;
        replaceUint8Array(array: Uint8Array): void;
    }

    interface ExportOptions {
        relativePath?: boolean;
    }

    export interface ZipDirectoryEntry extends ZipEntry {
        getChildByName(name: string): ZipEntry;
        addDirectory(name: string): ZipDirectoryEntry;
        addText(name: string, text: string): ZipFileEntry;
        addBlob(name: string, blob: Blob): ZipFileEntry;
        addData64URI(name: string, dataURI: string): ZipFileEntry;
        addUint8Array(name: string, array: Uint8Array): ZipFileEntry;
        addHttpContent(name: string, url: string, options?: HttpOptions): ZipFileEntry;
        addFileSystemEntry(fileSystemEntry: FileSystemEntry): Promise<ZipEntry>;
        importBlob(blob: Blob, options?: ZipReaderOptions | GetEntriesOptions): Promise<void>;
        importData64URI(dataURI: string, options?: ZipReaderOptions | GetEntriesOptions): Promise<void>;
        importUint8Array(array: Uint8Array, options?: ZipReaderOptions | GetEntriesOptions): Promise<void>;
        importHttpContent(url: string, options?: ZipReaderOptions | GetEntriesOptions | HttpOptions): Promise<void>;
        exportBlob(options?: ZipWriterOptions | ExportOptions): Promise<Blob>;
        exportData64URI(options?: ZipWriterOptions | ExportOptions): Promise<string>;
        exportUint8Array(options?: ZipWriterOptions | ExportOptions): Promise<Uint8Array>;
    }
    export interface FS extends ZipDirectoryEntry {
        root: ZipDirectoryEntry;
        remove(entry: ZipEntry): void;
        move(entry: ZipEntry, destination: ZipDirectoryEntry): void;
        find(fullname: string): ZipEntry;
        getById(id: number): ZipEntry;
    }

    export const fs: { FS: FS, ZipDirectoryEntry: ZipDirectoryEntry, ZipFileEntry: ZipFileEntry };
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

}
