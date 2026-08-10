# Fidelity round-trip harness

Reads zip files with `ZipReader`, rewrites them with `ZipWriter`, and compares the result
byte-by-byte against the original file. The original bytes are the oracle, so the harness
tests reader and writer fidelity jointly. Two legs per file:

- `codec`: entries are extracted, then re-added through the normal write path; a replay
  `CompressionStream` (injected via `configure({ CompressionStreamZlib })`) discards its
  input and emits the original compressed bytes, so CRC computation, size accounting and
  header decisions all run for real while the payload stays byte-identical. Encrypted
  entries fall back to `passThrough` (re-encryption can never be byte-identical).
- `passthrough`: entries are copied as raw payload slices with `passThrough: true`,
  exercising the copy path used by archive-editing code.

Files:

- `parse.js`: record-level tokenizer (local headers, payloads, data descriptors, central
  directory, EOCD, gaps), independent of the zip.js reader.
- `diff.js`: record-aligned structural differ; reports field-level diffs instead of byte
  offsets.
- `rewrite.js`: maps raw entry state back to `ZipWriter` options and throws
  `UnreproducibleError` when the writer cannot express a state.
- `matrix.js` + `run.js`: self round-trip matrix; every zip.js-written file must rewrite
  byte-identically on both legs, with no allowlist. Run with `deno run -A run.js`.
- `generate.js` + `corpus-run.js`: cross-writer corpus built from locally installed tools
  (Info-ZIP, ditto, 7zz, jar, Python zipfile) and swept with the same rewrite. Run with
  `deno run -A generate.js`, then `deno run -A corpus-run.js`.

Zip64 and split archives are out of scope for now and reported as unreproducible.

Coverage: `deno test -A --coverage=.cov coverage.js && deno coverage .cov` runs the matrix
and the corpus sweep under coverage. The uncovered writer code is dominated by
out-of-scope paths (zip64, split archives, usdz alignment), alternate APIs
(`prependZip`, `ZipWriterStream`, `remove`) and error branches, which are the standard
test suite's job; the serialization paths the harness targets sit at ~86% branch
coverage in zip-writer.js.

## Cross-writer status (2026-08-11)

The input tree covers regular and empty files, an executable, a symlink, unicode and
space-containing names, a subdirectory, and a file with an odd-second mtime. Verified
byte-identical: all Python zipfile archives (including entry/archive comments and the
empty archive), all jar archives (including `cf` with manifest), and Info-ZIP archives —
including `-y` symlinks, `-z` archive comments and ZipCrypto payload copies — except for
entries hit by the classes below. The uid/gid fallback passes non-minimally encoded
0x7875 fields through `extraField` instead of the `uid`/`gid` options.

Known unreproducible classes, i.e. states the writer cannot express:

1. Extra fields with different payloads in the local header and the central directory:
   ditto writes 0x5855 with 12 bytes locally and 8 in the central directory; 7-Zip writes
   the NTFS field in the central directory only (and orders it before the AES field).
   zip.js always mirrors extra fields.
2. Compression level bit flags (bits 1-2) on stored entries: Info-ZIP `-9` keeps the flags
   when it falls back to store; zip.js only sets them for deflate.
3. DOS times rounded up: Info-ZIP rounds the mtime up to the next 2-second boundary
   (including fractional seconds) while the extended timestamp keeps the floored value;
   zip.js derives both fields from `lastModDate` by truncation. Only observable when a
   0x5455/NTFS field exposes the exact mtime.
4. Populated local CRC/sizes together with bit 3: Info-ZIP fills the local header even
   when it writes a data descriptor; zip.js zeroes those fields per APPNOTE 4.4.4.
5. ZipCrypto without a data descriptor (7-Zip): zip.js always sets bit 3 for ZipCrypto
   because its password verification byte is derived from the DOS time.
6. Compression methods without a registered codec: bzip2 (12) and LZMA (14) from Python.
   Closable with `registerCodec` replay codecs if ever needed.
7. Non-UTF-8 (cp437/ANSI) filenames: the writer always encodes names as UTF-8; no local
   generator produces such archives, so this class is latent until wild files are added.
