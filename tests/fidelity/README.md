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

## Cross-writer status (2026-08-11)

Byte-identical: all Python zipfile archives, all Info-ZIP archives except `-9`
(the uid/gid fallback passes non-minimally encoded 0x7875 fields through `extraField`
instead of the `uid`/`gid` options).

Known unreproducible classes, i.e. states the writer cannot express:

1. Extra fields with different payloads in the local header and the central directory:
   ditto writes 0x5855 with 12 bytes locally and 8 in the central directory; 7-Zip writes
   the NTFS field in the central directory only. zip.js always mirrors extra fields.
2. Compression level bit flags (bits 1-2) on stored entries: Info-ZIP `-9` keeps the flags
   when it falls back to store; zip.js only sets them for deflate.
3. `externalFileAttributes` equal to 0 on directory entries (jar): the writer treats 0 as
   unset and substitutes the MS-DOS directory attribute.
