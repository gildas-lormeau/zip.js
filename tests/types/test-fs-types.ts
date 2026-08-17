// Type-level test: the FS class must expose only the members it has at runtime.
// Compile with: npm run test-types
import { fs as zipFs } from "../../index.js";
import type { ZipEntry, ZipDirectoryEntry, ZipFileEntry } from "../../index.js";

const fs = new zipFs.FS();

// real members must type-check
const root: ZipDirectoryEntry = fs.root;
const entries: (ZipEntry | null)[] = fs.entries;
const children: ZipEntry[] = fs.children;
const byName: ZipEntry | undefined = fs.getChildByName("name");
const byId: ZipEntry | undefined = fs.getById(0);
const found: ZipEntry | undefined = fs.find("dir/file.txt");
const directory: ZipDirectoryEntry = fs.addDirectory("dir");
const textEntry: ZipFileEntry<string, string> = fs.addText("file.txt", "content");
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

// silence unused-variable diagnostics
void [root, entries, children, byName, byId, found, directory, textEntry,
	importPromise, exportBlobPromise, importZipPromise, exportZipPromise,
	protectedFlag, passwordPromise, readerPasswordPromise, exportHandlePromise,
	signedExportPromise];

// members that do NOT exist on FS at runtime must NOT type-check
// @ts-expect-error FS is not a file entry
fs.getData();
// @ts-expect-error FS has no name in the tree
fs.getFullname();
// @ts-expect-error FS has no relative name
fs.getRelativeName(root);
// @ts-expect-error FS cannot be renamed
fs.rename("name");
// @ts-expect-error FS is not a descendant of anything
fs.isDescendantOf(root);
// @ts-expect-error FS cannot be cloned as an entry
fs.clone();
// @ts-expect-error FS has no directory marker property
fs.directory;
// @ts-expect-error FS has no name property
fs.name;
// @ts-expect-error FS has no id property
fs.id;
// @ts-expect-error FS has no parent property
fs.parent;
