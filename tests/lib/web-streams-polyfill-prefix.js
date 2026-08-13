// Backup native Streams for conditional polyfills.
globalThis._ReadableStream = globalThis.ReadableStream;
globalThis._WritableStream = globalThis.WritableStream;
globalThis._TransformStream = globalThis.TransformStream;
