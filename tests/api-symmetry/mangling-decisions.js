// Members of the public API that are absent from index.d.ts, are not mangled, and are kept that way on
// purpose. The value is the reason. An entry that stops applying fails the audit, so this file cannot
// accumulate rows that no longer describe anything.

const ACCEPTED_UNDECLARED = {
	config: "the configuration is passed to the workers as the `config` property of a message, so the name is" +
		" reserved by worker-message-property-names.js and kept on purpose, not by collision. The instances hold" +
		" the object returned by getConfiguration(), i.e. the global configuration itself, which is why reading" +
		" it is not part of the public API."
};

export { ACCEPTED_UNDECLARED };
