[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_UNIX\_ID\_SIZE

# Variable: ERR\_INVALID\_UNIX\_ID\_SIZE

> `const` **ERR\_INVALID\_UNIX\_ID\_SIZE**: `string`

Invalid UNIX uid/gid size error (thrown when `uid`/`gid` exceeds 65535 with `unixExtraFieldType` set to `"unix"`; use `"infozip"` for larger ids)
