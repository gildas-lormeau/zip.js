declare module "zip.js" {

    export function configure(configuration: ConfigurationOptions): void;

    export class ConfigurationOptions {
        useWebWorkers?: boolean;
        maxWorkers?: number;
        workerScriptsPath?: string;
        workerScripts?: {
            deflater?: string[];
            inflater?: string[];
        };
    }

    export function getMimeType(fileExtension: string): string;

    export class Stream {
        public size: number;
        public init(): Promise<void>;
    }

    export class Reader extends Stream {
        public readUint8Array(index: number, length: number): Uint8Array;
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
        constructor(url: string);
    }

    export class HttpRangeReader extends Reader {
        constructor(url: string);
    }

    export class Writer extends Stream {
        public writeUint8Array(array: Uint8Array): void;
    }

    export class TextWriter extends Writer {
        constructor(encoding?: string);
        public getData(): Promise<string>;
    }

    export class BlobWriter extends Writer {
        constructor(mimeString?: string);
        public getData(): Promise<Blob>;
    }

    export class Data64URIWriter extends Writer {
        constructor(mimeString?: string);
        public getData(): Promise<string>;
    }

    export class Uint8ArrayWriter extends Writer {
        constructor();
        public getData(): Promise<Uint8Array>;
    }

    export class ZipReader {
        constructor(reader: Reader, options?: ZipReaderOptions);
        getEntries(): Promise<Entry[]>;
        close(): Promise<any>;
    }

    export interface ZipReaderOptions {
        checkSignature?: boolean;
        password?: string;
        filenameEncoding?: string;
        commentEncoding?: string;
    }

    export interface Entry {
        filename: string;
        rawFilename: Uint8Array;
        directory: boolean;
        encrypted: boolean;
        compressedSize: number;
        uncompressedSize: number;
        lastModDate: Date;
        rawLastModDate: number;
        comment: string;
        rawComment: Uint8Array;
        signature: Uint8Array;
        extraField: Map<number, Uint8Array>;
        rawExtraField: Uint8Array;
        getData(writer: Writer, options?: EntryGetDataOptions): Promise<any>;
    }

    export interface EntryGetDataOptions {
        onprogress?: (progress: number, total: number) => void;
        checkSignature?: boolean;
        password?: string;
    }

    export class ZipWriter {
        constructor(writer: Writer, options?: ZipWriterOptions);
        public add(name: string, reader: Reader, options?: ZipWriterAddOptions): Promise<void>;
        public close(comment?: Uint8Array): Promise<any>;
    }

    export class ZipWriterOptions {
        zip64?: boolean;
        level?: number;
        bufferedWrite?: boolean;
        version?: number;
        password?: string;
    }

    export interface ZipWriterAddOptions {
        onprogress?: (progress: number, total: number) => void;
        directory?: boolean;
        level?: number;
        bufferedWrite?: boolean;
        comment?: string;
        lastModDate?: Date;
        version?: number;
        password?: string;
        zip64?: boolean;
        extraField?: Map<number, Uint8Array>;
    }

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
    export const ERR_INVALID_PASSORD: string;
    export const ERR_DUPLICATED_NAME: string;
    export const ERR_INVALID_COMMENT: string;
    export const ERR_INVALID_ENTRY_NAME: string;
    export const ERR_INVALID_ENTRY_COMMENT: string;
    export const ERR_INVALID_VERSION: string;
    export const ERR_INVALID_EXTRAFIELD_TYPE: string;
    export const ERR_INVALID_EXTRAFIELD_DATA: string;

}