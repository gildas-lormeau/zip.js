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

The four extra fields can still be written with the `extraField` and `localExtraField` options, which
take the raw bytes of any type.

Nothing is currently `writeOnly`. `dataDescriptorSignature` was, until the audit surfaced it and the
reader started reporting the data descriptor it had already read.

## Shape audit

`npm run test-api-shape` runs [shape.js](shape.js), which answers a different question: not whether a
member has a counterpart, but whether the objects the library builds match what `index.d.ts` says
about them. It reads the interfaces, produces real entries through the public API, then checks that
every non-optional member is defined and that every defined member holds a value of the declared
type, recursing into the nested interfaces.

The assertions are generated from the declarations, never from the observed values, so a declaration
that promises what the library does not deliver fails here. A probe written the other way round, i.e.
asserting the value it just read, always passes and proves nothing.

A member legitimately absent on a given specimen goes in [shape-decisions.js](shape-decisions.js),
keyed by specimen label and member path. An exception that stops firing fails too, so the file cannot
accumulate rows that no longer describe anything.

It also prints the declared members no specimen ever produced. That list is informative rather than a
failure: it is where a member declared but unreachable would show up, and it grows shorter as the
specimens get richer.

## Mangling audit

`npm run test-api-mangling` runs [mangling.js](mangling.js), which answers a third question: whether
the minified builds keep each member of the public API on purpose.

terser mangles every property name except those on the reserved list built by
[reserved-property-names.js](../../reserved-property-names.js), whose first and largest source is
`index.d.ts`. A member of a public class therefore has exactly two correct states:

- declared in `index.d.ts`, so the minified builds keep it deliberately,
- absent from `index.d.ts` and present in [mangled-property-names.js](../../mangled-property-names.js),
  so the minified builds rename it deliberately.

A member in neither list is the failure this audit exists for. It is undeclared, so nothing in the
build intends to keep it, yet it survives anyway because its name collides with one terser protects on
its own, i.e. a DOM property or a member of `lib.dom`/`lib.webworker`. It works until terser updates
that list, then it disappears from every minified build with no test failing in between. `moveTo` was
in that state, and `ZipWriter#files` was too: an internal map exposed under a readable name only
because `files` is a DOM property, while its sibling `filenames` was mangled like the internal field
it is. It is now `fileEntries`, which nothing protects.

The audit reads the source build, where nothing is mangled, because that is the only build in which
an internal member is still visible under its real name. A member that must stay undeclared and
unmangled goes in [mangling-decisions.js](mangling-decisions.js) with its reason, and an entry that
stops applying fails too.

The reverse failure, a member declared in `index.d.ts` and mangled anyway, cannot happen while the
reserved list is built from the declarations, so it is asserted rather than reported.

## Exports audit

`npm run test-api-exports` runs [exports.js](exports.js), which answers a fourth question: whether each
build exports what the shared `index.d.ts` promises on its behalf.

One `index.d.ts` serves every entry point, since `package.json` maps the same file to all of them, so a
declaration is a promise made by twelve export paths at once while the value behind it is exported by
whichever module happens to re-export it. `ERR_ABORTED` is the case that motivated the audit: it is
defined in `lib/core/options.js` and thrown by `throwIfAborted()`, which both `ZipReader#getData` and
`ZipWriter#add` call, yet only `lib/core/zip-fs.js` re-exported it. A core-build user got an error whose
constant the same package's types promised and the bundle did not provide.

The rule is the one that case violated: **a build must export every public error constant its own code
can throw**. Public means exported by at least one entry point, so a constant that is deliberately
internal, e.g. the `zipjs-abort-export` sentinel `zip-fs.js` throws at itself, is not dragged into the
public surface by being reachable. Reachability is read from the module graph rather than from a list, so
a constant moving between modules re-decides which builds owe it with nothing to update by hand.

It also checks that every name a build exports is declared in `index.d.ts`, that every error constant
declared there is exported by some entry point, and that each built file exposes exactly what its source
entry point does, which catches an export that did not survive bundling.

`lib/zip-core-reader.js` and `lib/zip-core-writer.js` are exempt from the reachability rule. They are
halves meant to be composed, `lib/zip-core-base.js` re-exports both, and no build ships one without the
other. Their exports still have to be declared.

## What the audits do not see

The symmetry audit walks the extra field types zip.js already declares, so it cannot report a type
nobody has implemented. The types found in real archives and parsed by no one, e.g. 0x4453 Windows NT
security descriptors and 0x0017 strong encryption headers, are visible to the corpus runner instead.

The shape audit compares each object against its declaration, never two objects against each other,
so it does not see the reader and the writer disagreeing about a value they both define.

The mangling audit only reaches members that exist on the objects it builds, so a member reachable
only under a configuration it does not exercise is invisible to it, exactly as it is to the shape
audit. It also says nothing about whether a declared member is one the API should have.

The exports audit reads reachability from the module graph, not from the call graph, so it asks whether
the code that defines a constant is bundled, never whether the path throwing it can be taken. It also
says nothing about a message that has no constant at all: an error thrown with a string literal, or with
a constant no entry point exports, is invisible to it exactly because it is not public.
