# Tests

## Running the tests

- `npm test` runs the suite in Node.js, Deno and Bun, against the source and the built files. It also runs the web-streams-polyfill interop test, checks the TypeScript definitions and runs the API symmetry audit.
- `npm run test-chrome`, `npm run test-firefox` and `npm run test-safari` run the suite in a locally installed browser with selenium. Chrome and Firefox run headless unless `--headed` is passed to `node ./tests/browser-runner.js`, which also accepts `--exe-path <path>` to test a specific browser build and `--url-search <search>` to forward URL parameters. Safari always runs headed and requires enabling `safaridriver` once with `sudo safaridriver --enable`.
- `--build wasm|native|external|dist` selects the build under test: the runner serves `tests/zip-lib.js` re-exporting `index.js` (`wasm`, the default), `lib/zip-fs-native.js`, `lib/zip-fs-external.js` or `index.min.js` instead of the file on disk.
- `npm run test-all` runs the linters and all the tests.

## Running the tests in a browser manually

Run `npm run serve-tests` and open `http://localhost:8888/tests/` in the browser to test. This is the way to test browsers selenium does not cover.

The server supports HTTP range requests. With a server that does not, e.g. `python -m http.server`, the two HTTP range tests are skipped.

Optional URL parameters:

- `keepTests` keeps the passed tests displayed on the page.
- `withStreamsPolyfill` loads [web-streams-polyfill](https://github.com/MattiasBuelens/web-streams-polyfill) when `TransformStream` is unavailable, for browsers older than Firefox 102. It only polyfills the page: the web workers get their own scope, where `TransformStream` is still missing, so the worker script of zip.js throws when it is evaluated and the codecs run in the main scope instead. `test-worker-streams-polyfill.js` and `test-worker-streams-polyfill-native.js` are the tests covering the worker path on these browsers, by polyfilling the scope of the worker itself. They run one per build, since the WASM worker and the native worker bundle different codecs.
- `maxParallelTests` overrides the number of tests running concurrently, 16 by default. Chromium 87 needs a low value, e.g. 4: under higher load its streams implementation randomly loses a backpressure wakeup and a test hangs until the timeout.

Tests requiring a feature the browser does not support, e.g. `CompressionStream` or OPFS, are reported as skipped instead of failing.

## Adding a test

Create `tests/all/test-<name>.js`. It must export an async function named `test` which throws an error on failure. Register the file in `tests/tests-data.js`.

Optional fields in `tests/tests-data.js`:

- `env`: the runtimes the test runs in, among `"browser"`, `"deno"`, `"node"` and `"bun"`. It runs everywhere by default.
- `features`: the features the test requires, among `"compressionStream"`, `"structuredClone"`, `"abortReason"`, `"pipeToSignal"`, `"opfs"`, `"httpRange"`, `"moduleWorker"`, `"workerStreams"` and `"wasmBuild"`. The test is skipped when one of them is missing. `"wasmBuild"` requires the build under test, i.e. the target of `tests/zip-lib.js`, to embed the WebAssembly module. `"pipeToSignal"` is missing in Chrome 76-79, which ignore the `signal` option of `pipeTo()`.
- `sanitizeResources: false`: opts the test out of the Deno resource sanitizer, see the comment in `tests/tests-data.js`.

## Other folders

- `tests/api-symmetry`: read surface against write surface audit, see [tests/api-symmetry/README.md](api-symmetry/README.md).
- `tests/fidelity`: read, rewrite and byte-compare harness, see [tests/fidelity/README.md](fidelity/README.md).
- `tests/types`: TypeScript definitions test, run with `npm run test-types`.
- `tests/vendor`: vendored third-party code used by the tests, ignored by the linters.
- `tests/data`: fixtures, e.g. zip files, sample data and worker scripts.
