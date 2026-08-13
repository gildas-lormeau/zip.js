[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_UNIX\_ID\_SIZE

# Variable: ERR\_INVALID\_UNIX\_ID\_SIZE

> `const` **ERR\_INVALID\_UNIX\_ID\_SIZE**: `string`

Defined in: [index.d.ts:3368](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L3368)

Invalid UNIX uid/gid size error (thrown when `uid`/`gid` exceeds 65535 with `unixExtraFieldType` set to `"unix"`; use `"infozip"` for larger ids)
