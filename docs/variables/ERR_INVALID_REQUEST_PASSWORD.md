[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_REQUEST\_PASSWORD

# Variable: ERR\_INVALID\_REQUEST\_PASSWORD

> `const` **ERR\_INVALID\_REQUEST\_PASSWORD**: `string`

Invalid requestPassword error (thrown by `{@link ZipDirectoryEntry}#import*()`, `{@link ZipDirectoryEntry}#export*()`,
[ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle) and `{@link ZipFileEntry}#get*()` when the
[PasswordCandidatesOptions#requestPassword](../interfaces/PasswordCandidatesOptions.md#requestpassword) option is neither a function nor unset, and when it returns a
value which is neither a string, `undefined` nor `null`)
