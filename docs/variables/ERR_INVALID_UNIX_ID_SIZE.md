[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_UNIX\_ID\_SIZE

# Variable: ERR\_INVALID\_UNIX\_ID\_SIZE

> `const` **ERR\_INVALID\_UNIX\_ID\_SIZE**: `string`

Defined in: [index.d.ts:3368](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L3368)

Invalid UNIX uid/gid size error (thrown when `uid`/`gid` exceeds 65535 with `unixExtraFieldType` set to `"unix"`; use `"infozip"` for larger ids)
