[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_UNIX\_ID\_SIZE

# Variable: ERR\_INVALID\_UNIX\_ID\_SIZE

> `const` **ERR\_INVALID\_UNIX\_ID\_SIZE**: `string`

Defined in: [index.d.ts:3513](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L3513)

Invalid UNIX uid/gid size error (thrown when `uid`/`gid` exceeds 65535 with `unixExtraFieldType` set to `"unix"`; use `"infozip"` for larger ids)
