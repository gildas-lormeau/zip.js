# Tests

## Running the tests

- `npm test` runs the suite in Node.js, Deno and Bun, against the source and the built files. It also runs the web-streams-polyfill interop test and checks the TypeScript definitions.
- `npm run test-chrome`, `npm run test-firefox` and `npm run test-webkit` run the suite in a headless browser with playwright. Add `--headful` to `node ./tests/browser-runner.js chrome` to see the browser.
- `npm run test-all` runs the linters and all the tests.

## Running the tests in a browser manually

Run `npm run serve-tests` and open `http://localhost:8888/tests/` in the browser to test. This is the way to test browsers playwright does not cover, e.g. older versions.

The server supports HTTP range requests. With a server that does not, e.g. `python -m http.server`, the two HTTP range tests are skipped.

Optional URL parameters:

- `keepTests` keeps the passed tests displayed on the page.
- `withStreamsPolyfill` loads [web-streams-polyfill](https://github.com/MattiasBuelens/web-streams-polyfill) when `TransformStream` is unavailable, for browsers older than Firefox 102.

Tests requiring a feature the browser does not support, e.g. `CompressionStream` or OPFS, are reported as skipped instead of failing.

## Adding a test

Create `tests/all/test-<name>.js`. It must export an async function named `test` which throws an error on failure. Register the file in `tests/tests-data.js`.

Optional fields in `tests/tests-data.js`:

- `env`: the runtimes the test runs in, among `"browser"`, `"deno"`, `"node"` and `"bun"`. It runs everywhere by default.
- `features`: the browser features the test requires, among `"compressionStream"`, `"structuredClone"`, `"opfs"`, `"httpRange"`, `"moduleWorker"` and `"workerDynamicImport"`. The test is skipped in browsers missing one of them.
- `sanitizeResources: false`: opts the test out of the Deno resource sanitizer, see the comment in `tests/tests-data.js`.

## Other folders

- `tests/fidelity`: read, rewrite and byte-compare harness, see [tests/fidelity/README.md](fidelity/README.md).
- `tests/types`: TypeScript definitions test, run with `npm run test-types`.
- `tests/vendor`: vendored third-party code used by the tests, ignored by the linters.
- `tests/data`: zip files used as fixtures.
