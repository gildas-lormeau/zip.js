[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_UNIX\_ID\_SIZE

# Variable: ERR\_INVALID\_UNIX\_ID\_SIZE

> `const` **ERR\_INVALID\_UNIX\_ID\_SIZE**: `string`

Defined in: [index.d.ts:3521](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L3521)

Invalid UNIX uid/gid size error (thrown when `uid`/`gid` exceeds 65535 with `unixExtraFieldType` set to `"unix"`; use `"infozip"` for larger ids)
