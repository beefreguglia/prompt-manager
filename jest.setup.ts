/** biome-ignore-all lint/suspicious/noExplicitAny: <using polyfill> */
import '@testing-library/jest-dom';

import { webcrypto } from 'node:crypto';
import { TextDecoder, TextEncoder } from 'node:util';

(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = webcrypto;
}

expect.extend({});
