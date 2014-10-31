zip.js is an open-source library (BSD license) for zipping and unzipping files.

See here for more info:
http://gildas-lormeau.github.com/zip.js/

## Work with web worker
zip.js can offload deflating/inflating to web worker, to not block UI.

### Configure worker scripts
Scripts to be run in worker should be configured like this in your code, after the `<script>`
tag of `zip.js` file:

```
zip.useWebWorkers = true; // 'true' is the default.
zip.workerScripts = { deflater: ['<zip_js_dir>/z-worker.js', 'deflate.js'],
		inflater: ['<zip_js_dir>/z-worker.js', 'inflate.js']};
```

`<zip_js_dir>/z-worker.js` is the url to `z-worker.js` file, which is the entry script of the worker,
and this url is usually relative to the html file which references the `zip.js` file.
Files `deflate.js` and `inflate.js` are the default Deflater/Inflater, and are specified as relative url to `z-worker.js` file.

The orders of scirpts listed in `zip.workerScripts.deflater|inflater` are significant:
they are executed in that order in the worker. `z-worker.js` should always be the first one.

### Prevent leak of web workers
Each ZipWriter/ZipReader instance (created by zip.createWriter() or zip.createReader()) has a web worker for
deflating/inflating. This worker is terminated by `close()` method of ZipWriter/ZipReader. Forgetting to call
`close()` will leak this worker. So when you done with a ZipWriter/ZipReader, make sure to call `close()`!

## Use other DEFLATE implementations
The default `deflate.js` and `inflate.js` have some compatibility bugs, and the performance is not the best.
Fortunately, you can use other DEFLATE implementations with zip.js.

### zlib-asm
[zlib-asm](https://github.com/ukyo/zlib-asm) is produced by compiling C code of [zlib](http://zlib.net/)
to asm.js with [Emscripten](http://kripken.github.io/emscripten-site/).
Because zlib is regarded as one of the reference implementation of DEFLATE algorithm, the compatibility
of zlib-asm should be very good. Thanks to asm.js, the performance of zlib-asm is great.

To use zlib-asm in worker, configure zip.js like this:

```
zip.workerScripts = { deflater: ['<zip_js_dir>/z-worker.js', 'zlib-asm/zlib.js', 'zlib-asm/codecs.js'],
		inflater: ['<zip_js_dir>/z-worker.js', 'zlib-asm/zlib.js', 'zlib-asm/codecs.js']};
```

Note that `zlib.js` file is a part of zlib-asm project, and is not provided by zip.js now.
You can find it [here](https://github.com/ukyo/zlib-asm/blob/master/zlib.js).

### pako
[Pako](https://github.com/nodeca/pako) is a hand-writing javascript port of zlib.
Its compatibility and performance is believed to be good. The major advantage of pako over zlib-asm
may be that its code size is much smaller (45KB vs 193KB).

To use pako in worker, configure zip.js like this:

```
zip.workerScripts = { deflater: ['<zip_js_dir>/z-worker.js', 'pako/pako.min.js', 'pako/codecs.js'],
	inflater: ['<zip_js_dir>/z-worker.js', 'pako/pako.min.js', 'pako/codecs.js']};
```
Pako also has separate js files for deflating/inflating, you can also use them instead of `pako.min.js`:

```
zip.workerScripts = { deflater: ['<zip_js_dir>/z-worker.js', 'pako/pako_deflate.min.js', 'pako/codecs.js'],
	inflater: ['<zip_js_dir>/z-worker.js', 'pako/pako_inflate.min.js', 'pako/codecs.js']};
```

Note that `pako.min.js` etc. are parts of pako project, and is not provided by zip.js now.
You can find them [here](https://github.com/nodeca/pako/tree/master/dist).

## Work without web worker
Set `zip.useWebWorkers = true` after the `<script>` tag of `zip.js` to disable web worker.
You need to reference `deflate.js` or `inflate.js` files after `zip.js` in the html to introduce the default
Deflater/Inflater.

You can also use zlib-asm or pako instead. For zlib-asm, reference `zlib-asm/zlib.js` and `zlib-asm/codecs.js`;
for pako, reference `pako/pako.min.js` and `pako/codecs.js`, both after `zip.js`.

