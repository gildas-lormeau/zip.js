[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / PasswordCandidatesOptions

# Interface: PasswordCandidatesOptions

Represents the options supplying several passwords to the entries imported from a zip file, tried in
order when an entry is read.

## Remarks

The core API takes one password per reader or per call. The filesystem API adds a list of
candidates and a function asked for a password when the candidates fail, because it reads each
entry into memory before using it and can therefore try again. The candidates are tried in this
order: the [ZipReaderOptions#password](ZipReaderOptions.md#password) or [ZipReaderOptions#rawPassword](ZipReaderOptions.md#rawpassword) option,
then the passwords that already decrypted an entry of the same imported zip file, most recent first,
then the [PasswordCandidatesOptions#passwords](#passwords) option. Each candidate is tried once per entry,
and the entries of a zip file overwhelmingly share one password, so an archive costs one extra
attempt per wrong candidate ahead of the right one, and not one per entry.

A candidate is rejected when the entry raises an [ERR\_INVALID\_PASSWORD](../variables/ERR_INVALID_PASSWORD.md) error, which both
encryption methods do on the first bytes of the entry, before any content is produced. An entry
encrypted with ZipCrypto verifies the password on a single byte, so one wrong password in 256 passes
that check and fails while reading the content instead: for such entries the password is first
verified alone, the CRC32 of the content is then checked whatever the [ZipReaderOptions#checkCrc32](ZipReaderOptions.md#checkcrc32)
option says, and a read failing with an [ERR\_INVALID\_CRC32](../variables/ERR_INVALID_CRC32.md), [ERR\_INVALID\_COMPRESSED\_DATA](../variables/ERR_INVALID_COMPRESSED_DATA.md)
or [ERR\_INVALID\_UNCOMPRESSED\_SIZE](../variables/ERR_INVALID_UNCOMPRESSED_SIZE.md) error is treated as a wrong password and the next candidate is
tried. Any other failure, e.g. a failure of the reader or an [ERR\_CODEC\_OUT\_OF\_MEMORY](../variables/ERR_CODEC_OUT_OF_MEMORY.md) error, is
reported as-is. A corrupted entry read with the right password is reported as a wrong password too,
since nothing tells it from a wrong password passing the check. An entry encrypted with AES verifies
the password on two bytes, so a failure of the read that follows is reported as-is, e.g. as an
[ERR\_INVALID\_AUTHENTICATION\_CODE](../variables/ERR_INVALID_AUTHENTICATION_CODE.md) error.

The options are set when importing the zip file, in the [ZipDirectoryEntryExportOptions#readerOptions](ZipDirectoryEntryExportOptions.md#readeroptions)
option of an export, and when reading one entry with `{@link ZipFileEntry}#get*()`. They apply to the
entries imported from a zip file only, and never to the entries read as-is with the
[ZipReaderOptions#passThrough](ZipReaderOptions.md#passthrough) option, which are not decrypted.

## Extended by

- [`ZipFileEntryGetDataOptions`](ZipFileEntryGetDataOptions.md)
- [`ZipDirectoryEntryImportOptions`](ZipDirectoryEntryImportOptions.md)
- [`ZipDirectoryEntryExportFileSystemHandleOptions`](ZipDirectoryEntryExportFileSystemHandleOptions.md)

## Properties

### passwords?

> `optional` **passwords?**: `string`[]

The passwords tried in order, after the [ZipReaderOptions#password](ZipReaderOptions.md#password) option and the
passwords already accepted by another entry of the same imported zip file. An empty string is
ignored.

When every candidate fails, the entry raises an [ERR\_INVALID\_PASSWORD](../variables/ERR_INVALID_PASSWORD.md) error whose `cause` is
the error raised by the last candidate, unless the [PasswordCandidatesOptions#requestPassword](#requestpassword)
option is set.

A value which is neither an array of strings nor unset throws an [ERR\_INVALID\_PASSWORDS](../variables/ERR_INVALID_PASSWORDS.md)
error.

## Methods

### requestPassword()?

> `optional` **requestPassword**(`entry`, `error?`): `string` \| `Promise`\<`string` \| `null` \| `undefined`\> \| `null` \| `undefined`

The function asked for a password when every candidate has failed, or when there is none. It is
called with the entry being read and with the error raised by the last candidate, which is
`undefined` when no candidate was tried, and it can return a promise, e.g. when it prompts the user.

A string is tried on the entry, and the function is called again when it fails, with the
[ERR\_INVALID\_PASSWORD](../variables/ERR_INVALID_PASSWORD.md) error. `undefined` or `null` gives up: the entry raises an
[ERR\_INVALID\_PASSWORD](../variables/ERR_INVALID_PASSWORD.md) error whose `cause` is the error raised by the last candidate, or an
[ERR\_ENCRYPTED](../variables/ERR_ENCRYPTED.md) error when no candidate was tried. A value of another type throws an
[ERR\_INVALID\_REQUEST\_PASSWORD](../variables/ERR_INVALID_REQUEST_PASSWORD.md) error. The
function is not called for the entries whose password is already known.

When several entries are read concurrently, e.g. by `{@link ZipDirectoryEntry}#export*()` with the
[ZipWriterConstructorOptions#bufferedWrite](ZipWriterConstructorOptions.md#bufferedwrite) option, only one call is pending at a time: the
other entries wait for its answer and try it before asking themselves. Cancelling the whole
operation from the function is done with the [ZipReaderOptions#signal](ZipReaderOptions.md#signal) option, since giving
up fails the entry being read only.

A value which is neither a function nor unset throws an [ERR\_INVALID\_REQUEST\_PASSWORD](../variables/ERR_INVALID_REQUEST_PASSWORD.md)
error.

#### Parameters

##### entry

[`FileEntry`](FileEntry.md)

The entry being read.

##### error?

`Error`

The error raised by the last candidate, `undefined` when no candidate was tried.

#### Returns

`string` \| `Promise`\<`string` \| `null` \| `undefined`\> \| `null` \| `undefined`

The password to try, or `undefined` to give up.
