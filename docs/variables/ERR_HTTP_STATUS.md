[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_HTTP\_STATUS

# Variable: ERR\_HTTP\_STATUS

> `const` **ERR\_HTTP\_STATUS**: `string`

HTTP status error (thrown by [HttpReader](../classes/HttpReader.md) when the server answers with a status other than 2xx, except
416, which throws [ERR\_HTTP\_RANGE](ERR_HTTP_RANGE.md) instead)

## Remarks

This message is a prefix: the status text, or the status code when the server sends none, is
appended to it, so it is matched with `String#startsWith` rather than with an equality test.
