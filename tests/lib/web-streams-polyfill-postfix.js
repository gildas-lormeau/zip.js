// Use native Streams if they already have required features.
if (globalThis._TransformStream) {
  globalThis.ReadableStream = globalThis._ReadableStream;
  globalThis.WritableStream = globalThis._WritableStream;
  globalThis.TransformStream = globalThis._TransformStream;
}

delete globalThis._ReadableStream;
delete globalThis._WritableStream;
delete globalThis._TransformStream;
