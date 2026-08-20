// Type-level test: the ZipFS class must expose only the members it has at runtime.
// Compile with: npm run test-types
import { ZipFS } from "../../index.js";
import { ZipReader } from "../../index.js";
import type { ZipEntry, ZipDirectoryEntry, ZipFileEntry, EntryMetaData, ZipWriterAddDataOptions } from "../../index.js";

const fs = new ZipFS();

// real members must type-check
const root: ZipDirectoryEntry = fs.root;
const entries: (ZipEntry | null)[] = fs.entries;
const children: ZipEntry[] = fs.children;
const byName: ZipEntry | undefined = fs.getChildByName("name");
const byId: ZipEntry | undefined = fs.getById(0);
const found: ZipEntry | undefined = fs.find("dir/file.txt");
const directory: ZipDirectoryEntry = fs.addDirectory("dir");
const textEntry: ZipFileEntry<string, string> = fs.addText("file.txt", "content");
textEntry.setOptions({ comment: "comment", level: 0 });
const entryOptions: ZipWriterAddDataOptions | undefined = textEntry.options;
fs.remove(textEntry);
fs.move(textEntry, root);
const importPromise: Promise<ZipEntry[]> = fs.importBlob(new Blob());
const exportBlobPromise: Promise<Blob> = fs.exportBlob();
const importZipPromise: Promise<[ZipEntry]> = fs.importZip(new Blob().stream());
const exportZipPromise: Promise<unknown> = fs.exportZip(new Blob() as never);
const protectedFlag: boolean = fs.isPasswordProtected();
const passwordPromise: Promise<boolean> = fs.checkPassword("password");
const readerPasswordPromise: Promise<Blob> = fs.exportBlob({ readerOptions: { password: "password" } });
const exportHandlePromise: Promise<unknown> = fs.exportFileSystemHandle(new Object() as never, { readerOptions: { password: "password" } });
const signedExportPromise: Promise<Uint8Array> = fs.exportUint8Array({ signCentralDirectory: () => new Uint8Array(8) });
const commentedExportPromise: Promise<Uint8Array> = fs.exportUint8Array({ globalComment: new Uint8Array(4) });
const importZipReaderPromise: Promise<[ZipEntry]> = fs.importZip(new ZipReader(new Blob().stream(), { extractPrependedData: true }));
const entryProgressExportPromise: Promise<Uint8Array> = fs.exportUint8Array({
	onentryprogress: (progress: number, total: number, entry: EntryMetaData) => void [progress, total, entry.filename]
});

// silence unused-variable diagnostics
void [root, entries, children, byName, byId, found, directory, textEntry, entryOptions,
	importPromise, exportBlobPromise, importZipPromise, exportZipPromise,
	protectedFlag, passwordPromise, readerPasswordPromise, exportHandlePromise,
	signedExportPromise, commentedExportPromise, importZipReaderPromise,
	entryProgressExportPromise];

// members that do NOT exist on ZipFS at runtime must NOT type-check
// @ts-expect-error ZipFS is not a file entry
fs.getData();
// @ts-expect-error ZipFS has no name in the tree
fs.getFullname();
// @ts-expect-error ZipFS has no relative name
fs.getRelativeName(root);
// @ts-expect-error ZipFS cannot be renamed
fs.rename("name");
// @ts-expect-error ZipFS has no entry options
fs.setOptions({});
// @ts-expect-error the options of an entry are set with setOptions
textEntry.options = { comment: "comment" };
// @ts-expect-error ZipFS is not a descendant of anything
fs.isDescendantOf(root);
// @ts-expect-error ZipFS cannot be cloned as an entry
fs.clone();
// @ts-expect-error ZipFS has no directory marker property
fs.directory;
// @ts-expect-error ZipFS has no name property
fs.name;
// @ts-expect-error ZipFS has no id property
fs.id;
// @ts-expect-error ZipFS has no parent property
fs.parent;
