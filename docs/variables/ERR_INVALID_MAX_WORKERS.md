[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_MAX\_WORKERS

# Variable: ERR\_INVALID\_MAX\_WORKERS

> `const` **ERR\_INVALID\_MAX\_WORKERS**: `string`

Invalid maxWorkers error

## Remarks

Thrown by [configure](../functions/configure.md) when [Configuration#maxWorkers](../interfaces/Configuration.md#maxworkers) is not an integer greater than 0. A value lower than 1
used to deadlock [ZipWriter#add](../classes/ZipWriter.md#add) for ever, since no entry could start and none could release the next one. Pass
[Configuration#useWebWorkers](../interfaces/WorkerConfiguration.md#usewebworkers) set to `false` to compress and decompress data in the main thread instead.
