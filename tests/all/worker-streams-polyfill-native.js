/* global self, importScripts */

self.TransformStream = self.WritableStream = self.CompressionStream = self.DecompressionStream = undefined;

importScripts("../vendor/web-streams-polyfill.js", "../../dist/zip-web-worker-native.js");
