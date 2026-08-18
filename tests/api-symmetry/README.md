# API symmetry audit

`npm run test-api-symmetry` checks that the read surface and the write surface of the library still
line up: every entry property the reader exposes must have a recorded way of being written, and every
writer option must have a recorded way of being observed.

It reads three sources:

- the `DirectoryEntry` interface of `index.d.ts`, i.e. the metadata of an entry,
- the `ZipWriterAddDataOptions` and `ZipWriterCloseOptions` interfaces of `index.d.ts`, including the
  interfaces they extend,
- the `EXTRAFIELD_TYPE_*` constants of `lib/core/constants.js`, and whether `lib/core/zip-reader.js`
  and `lib/core/zip-writer.js` reference them.

It compares them against [decisions.js](decisions.js) and fails when:

- a member has no recorded decision,
- a decision refers to a member that no longer exists,
- a decision refers to an option or a property that does not exist, e.g. after a rename,
- a member is marked `@deprecated` and its decision does not record the replacement, or the reverse,
- an extra field type is declared and the reader does not parse it,
- an extra field type is written and the property exposing it is recorded as read-only, or the
  reverse.

The audit reports nothing about the quality of the API. Its only claim is that no member was added
without deciding what its counterpart is.

## What to do when it fails

Add or update the entry in [decisions.js](decisions.js). Each member takes exactly one category.

For an entry property:

| Category | Meaning |
| --- | --- |
| `options` | the writer options that set it, at least one of them named for it |
| `indirect` | no option is named for it, the listed options reach it through their values |
| `argument` | it is set by an argument of the API rather than by an option |
| `computed` | the writer computes it, it is not an input |
| `derived` | the reader decodes it from another property |
| `deprecated` | an alias kept for compatibility, the value names the replacement |
| `readOnly` | the reader exposes it and the writer does not produce it, deliberately |

`options` and `indirect` are the distinction worth keeping honest. `unixMode` sets `unixMode`, so
`unixMode` is `options`. Nothing is named `symlink`, and an entry becomes one because of the value
`unixMode` is given, so `symlink` is `indirect`. Recording it as `options` would hide the fact that
there is no `symlink` option to find.

For a writer option:

| Category | Meaning |
| --- | --- |
| `properties` | the entry properties that expose its effect |
| `archive` | it acts on the whole archive rather than on an entry |
| `machinery` | it changes how the data is produced, not what the headers record |
| `deprecated` | an alias kept for compatibility, the value names the replacement |
| `writeOnly` | the writer produces it and the reader does not expose it |

`indirect`, `readOnly` and `writeOnly` are the asymmetries. Their value is the reason, and writing
that reason is the point: an asymmetry nobody can justify is a gap, one with a reason is a decision.

## Current asymmetries

| Member | Direction | Reason |
| --- | --- | --- |
| `symlink` | no option named for it | stamping the S_IFLNK file type, e.g. `unixMode` `0o120777`, already writes a link every tool resolves, so a dedicated option would only spare the caller a constant |
| `extraFieldUnixType1` (0x5855) | read only | the obsolete Info-ZIP type 1 field, superseded by the type 2 (0x7855) and new (0x7875) fields the writer emits |
| `extraFieldPkwareUnix` (0x000d) | read only | the PKWARE Unix field, written by no current tool and superseded by the Info-ZIP fields the writer emits |
| `extraFieldUnicodePath` (0x7075) | read only | the writer marks UTF-8 filenames with the language encoding flag, which every current reader honors |
| `extraFieldUnicodeComment` (0x6375) | read only | the writer marks UTF-8 comments with the language encoding flag, which every current reader honors |
| `dataDescriptorSignature` | write only | the reader detects the signature to size the data descriptor and does not report whether it was present |

The four extra fields can still be written with the `extraField` and `localExtraField` options, which
take the raw bytes of any type.

## What the audit does not see

It walks the extra field types zip.js already declares, so it cannot report a type nobody has
implemented. The types found in real archives and parsed by no one, e.g. 0x4453 Windows NT security
descriptors and 0x0017 strong encryption headers, are visible to the corpus runner instead.
