// Members of the public API that are absent from index.d.ts, are not mangled, and are kept that way on
// purpose. The value is the reason. An entry that stops applying fails the audit, so this file cannot
// accumulate rows that no longer describe anything.

const ACCEPTED_UNDECLARED = {};

export { ACCEPTED_UNDECLARED };
