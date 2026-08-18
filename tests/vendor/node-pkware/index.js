// package/dist/constants.js
var LONGEST_ALLOWED_REPETITION = 516;
var LITERAL_END_STREAM = 773;
var DistCode = [
  3,
  13,
  5,
  25,
  9,
  17,
  1,
  62,
  30,
  46,
  14,
  54,
  22,
  38,
  6,
  58,
  26,
  42,
  10,
  50,
  18,
  34,
  66,
  2,
  124,
  60,
  92,
  28,
  108,
  44,
  76,
  12,
  116,
  52,
  84,
  20,
  100,
  36,
  68,
  4,
  120,
  56,
  88,
  24,
  104,
  40,
  72,
  8,
  240,
  112,
  176,
  48,
  208,
  80,
  144,
  16,
  224,
  96,
  160,
  32,
  192,
  64,
  128,
  0
];
var DistBits = [
  2,
  4,
  4,
  5,
  5,
  5,
  5,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8
];
var LenBits = [
  3,
  2,
  3,
  3,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  6,
  6,
  6,
  7,
  7
];
var LenCode = [
  5,
  3,
  1,
  6,
  10,
  2,
  12,
  20,
  4,
  24,
  8,
  48,
  16,
  32,
  64,
  0
];
var ExLenBits = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8
];
var LenBase = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  10,
  14,
  22,
  38,
  70,
  134,
  262
];
var ChBitsAsc = [
  11,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  8,
  7,
  12,
  12,
  7,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  13,
  12,
  12,
  12,
  12,
  12,
  4,
  10,
  8,
  12,
  10,
  12,
  10,
  8,
  7,
  7,
  8,
  9,
  7,
  6,
  7,
  8,
  7,
  6,
  7,
  7,
  7,
  7,
  8,
  7,
  7,
  8,
  8,
  12,
  11,
  7,
  9,
  11,
  12,
  6,
  7,
  6,
  6,
  5,
  7,
  8,
  8,
  6,
  11,
  9,
  6,
  7,
  6,
  6,
  7,
  11,
  6,
  6,
  6,
  7,
  9,
  8,
  9,
  9,
  11,
  8,
  11,
  9,
  12,
  8,
  12,
  5,
  6,
  6,
  6,
  5,
  6,
  6,
  6,
  5,
  11,
  7,
  5,
  6,
  5,
  5,
  6,
  10,
  5,
  5,
  5,
  5,
  8,
  7,
  8,
  8,
  10,
  11,
  11,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  12,
  13,
  12,
  13,
  13,
  13,
  12,
  13,
  13,
  13,
  12,
  13,
  13,
  13,
  13,
  12,
  13,
  13,
  13,
  12,
  12,
  12,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13,
  13
];
var ChCodeAsc = [
  1168,
  4064,
  2016,
  3040,
  992,
  3552,
  1504,
  2528,
  480,
  184,
  98,
  3808,
  1760,
  34,
  2784,
  736,
  3296,
  1248,
  2272,
  224,
  3936,
  1888,
  2912,
  864,
  3424,
  1376,
  4672,
  2400,
  352,
  3680,
  1632,
  2656,
  15,
  592,
  56,
  608,
  80,
  3168,
  912,
  216,
  66,
  2,
  88,
  432,
  124,
  41,
  60,
  152,
  92,
  9,
  28,
  108,
  44,
  76,
  24,
  12,
  116,
  232,
  104,
  1120,
  144,
  52,
  176,
  1808,
  2144,
  49,
  84,
  17,
  33,
  23,
  20,
  168,
  40,
  1,
  784,
  304,
  62,
  100,
  30,
  46,
  36,
  1296,
  14,
  54,
  22,
  68,
  48,
  200,
  464,
  208,
  272,
  72,
  1552,
  336,
  96,
  136,
  4e3,
  7,
  38,
  6,
  58,
  27,
  26,
  42,
  10,
  11,
  528,
  4,
  19,
  50,
  3,
  29,
  18,
  400,
  13,
  21,
  5,
  25,
  8,
  120,
  240,
  112,
  656,
  1040,
  16,
  1952,
  2976,
  928,
  576,
  7232,
  3136,
  5184,
  1088,
  6208,
  2112,
  4160,
  64,
  8064,
  3968,
  6016,
  1920,
  7040,
  2944,
  4992,
  896,
  7552,
  3456,
  5504,
  1408,
  6528,
  2432,
  4480,
  384,
  7808,
  3712,
  5760,
  1664,
  6784,
  2688,
  4736,
  640,
  7296,
  3200,
  5248,
  1152,
  6272,
  2176,
  4224,
  128,
  7936,
  3840,
  5888,
  1792,
  6912,
  2816,
  4864,
  3488,
  1440,
  2464,
  416,
  3744,
  1696,
  2720,
  672,
  3232,
  1184,
  2208,
  160,
  3872,
  1824,
  2848,
  800,
  3360,
  1312,
  2336,
  288,
  3616,
  1568,
  2592,
  544,
  3104,
  1056,
  2080,
  32,
  4032,
  1984,
  3008,
  960,
  3520,
  1472,
  2496,
  448,
  3776,
  1728,
  2752,
  704,
  3264,
  1216,
  2240,
  192,
  3904,
  1856,
  2880,
  832,
  768,
  3392,
  7424,
  3328,
  5376,
  1344,
  1280,
  6400,
  2304,
  2368,
  4352,
  256,
  7680,
  3584,
  320,
  5632,
  1536,
  6656,
  3648,
  1600,
  2624,
  2560,
  4608,
  512,
  7168,
  3072,
  5120,
  1024,
  6144,
  2048,
  4096,
  0
];
var EMPTY_BUFFER = new ArrayBuffer(0);

// package/dist/errors.js
var InvalidDictionarySizeError = class extends Error {
  constructor() {
    super("Invalid dictionary size");
    this.name = "InvalidDictionarySizeError";
  }
};
var InvalidCompressionTypeError = class extends Error {
  constructor() {
    super("Invalid compression type");
    this.name = "InvalidCompressionTypeError";
  }
};
var AbortedError = class extends Error {
  constructor() {
    super("Aborted");
    this.name = "AbortedError";
  }
};

// package/dist/functions.js
function repeat(value, repetitions) {
  const values = [];
  for (let i = 0; i < repetitions; i++) {
    values.push(value);
  }
  return values;
}
function clamp(n, min, max) {
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
}
function nBitsOfOnes(numberOfBits) {
  if (!Number.isInteger(numberOfBits) || numberOfBits < 0) {
    return 0;
  }
  return (1 << numberOfBits) - 1;
}
function getLowestNBitsOf(number, numberOfBits) {
  return number & nBitsOfOnes(numberOfBits);
}
function mergeSparseArrays(a, b) {
  let result;
  if (b.length < a.length) {
    result = [...b, ...repeat(void 0, a.length - b.length)];
  } else {
    result = [...b];
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== void 0) {
      result[i] = a[i];
    }
  }
  return result;
}
function unfold(fn, seed) {
  let pair = fn(seed);
  const result = [];
  while (pair !== false && pair.length > 0) {
    result[result.length] = pair[0];
    pair = fn(pair[1]);
  }
  return result;
}
function isArrayBufferLike(buffer) {
  if (buffer instanceof ArrayBuffer) {
    return true;
  }
  if (typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer) {
    return true;
  }
  return false;
}
function concatArrayBuffersAndLengthedDatas(buffers, totalLength) {
  if (buffers.length === 1 && "byteLength" in buffers[0]) {
    return buffers[0];
  }
  if (totalLength === void 0) {
    totalLength = 0;
    for (const buffer of buffers) {
      totalLength = totalLength + buffer.byteLength;
    }
  }
  const combinedBuffer = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers) {
    if (isArrayBufferLike(buffer)) {
      const view = new Uint8Array(buffer);
      combinedBuffer.set(view, offset);
    } else {
      combinedBuffer.set(buffer.data, offset);
    }
    offset = offset + buffer.byteLength;
  }
  return combinedBuffer.buffer;
}
function sliceArrayBufferAt(buffer, at) {
  const view = new Uint8Array(buffer);
  const left = view.slice(0, at).buffer;
  const right = view.slice(at).buffer;
  return [left, right];
}
function uint8ArrayToArray(view, from, length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(view[from + i]);
  }
  return arr;
}

// package/dist/simple/Explode.js
function generateDecodeTables(startIndexes, lengthBits) {
  const codes = repeat(0, 256);
  lengthBits.forEach((lengthBit, i) => {
    for (let index = startIndexes[i]; index < 256; index = index + (1 << lengthBit)) {
      codes[index] = i;
    }
  });
  return codes;
}
function createPATIterator(limit, stepper) {
  return function(n) {
    if (n >= limit) {
      return false;
    }
    return [n, n + (1 << stepper)];
  };
}
function populateAsciiTable(value, index, bits, limit) {
  const iterator = createPATIterator(limit, value - bits);
  const seed = ChCodeAsc[index] >> bits;
  const indices = unfold(iterator, seed);
  const table = [];
  indices.forEach((idx) => {
    table[idx] = index;
  });
  return table;
}
var Explode = class {
  inputBuffer;
  /**
   * Used for accessing the data within inputBuffer
   */
  inputBufferView;
  /**
   * Used for caching inputBuffer.byteLength as that getter is doing some uncached computation to measure the length of
   * inputBuffer
   */
  inputBufferSize;
  /**
   * The explode algorithm works by trimming off the beginning of inputBuffer byte by byte. Instead of actually
   * adjusting the inputBuffer every time a byte is handled we store the beginning of the unhandled section and use it
   * when indexing data that is being read.
   */
  inputBufferStartIndex;
  outputBuffer;
  outputBufferView;
  outputBufferSize;
  needMoreInput;
  extraBits;
  bitBuffer;
  lengthCodes;
  distPosCodes;
  compressionType;
  dictionarySize;
  dictionarySizeMask;
  chBitsAsc;
  /**
   * the naming comes from stormlib, the 2C34 refers to the table's position in memory
   */
  asciiTable2C34;
  /**
   * the naming comes from stormlib, the 2D34 refers to the table's position in memory
   */
  asciiTable2D34;
  /**
   * the naming comes from stormlib, the 2E34 refers to the table's position in memory
   */
  asciiTable2E34;
  /**
   * the naming comes from stormlib, the 2EB4 refers to the table's position in memory
   */
  asciiTable2EB4;
  constructor(input) {
    this.needMoreInput = true;
    this.extraBits = 0;
    this.bitBuffer = 0;
    this.lengthCodes = generateDecodeTables(LenCode, LenBits);
    this.distPosCodes = generateDecodeTables(DistCode, DistBits);
    this.inputBuffer = input;
    this.inputBufferView = new Uint8Array(this.inputBuffer);
    this.inputBufferSize = this.inputBuffer.byteLength;
    this.inputBufferStartIndex = 0;
    this.outputBuffer = EMPTY_BUFFER;
    this.outputBufferView = new Uint8Array(this.outputBuffer);
    this.outputBufferSize = 0;
    this.compressionType = "unknown";
    this.dictionarySize = "unknown";
    this.dictionarySizeMask = 0;
    this.chBitsAsc = repeat(0, 256);
    this.asciiTable2C34 = repeat(0, 256);
    this.asciiTable2D34 = repeat(0, 256);
    this.asciiTable2E34 = repeat(0, 128);
    this.asciiTable2EB4 = repeat(0, 256);
    this.processInput();
    if (this.needMoreInput) {
      throw new AbortedError();
    }
  }
  /**
   * @throws `InvalidCompressionTypeError`
   * @throws `InvalidDictionarySizeError`
   * @throws `AbortedError`
   */
  getResult() {
    return this.outputBuffer.slice(0, this.outputBufferSize);
  }
  generateAsciiTables() {
    this.chBitsAsc = ChBitsAsc.map((value, index) => {
      if (value <= 8) {
        this.asciiTable2C34 = mergeSparseArrays(populateAsciiTable(value, index, 0, 256), this.asciiTable2C34);
        return value - 0;
      }
      const acc = getLowestNBitsOf(ChCodeAsc[index], 8);
      if (acc === 0) {
        this.asciiTable2EB4 = mergeSparseArrays(populateAsciiTable(value, index, 8, 256), this.asciiTable2EB4);
        return value - 8;
      }
      this.asciiTable2C34[acc] = 255;
      if (getLowestNBitsOf(acc, 6) === 0) {
        this.asciiTable2E34 = mergeSparseArrays(populateAsciiTable(value, index, 6, 128), this.asciiTable2E34);
        return value - 6;
      }
      this.asciiTable2D34 = mergeSparseArrays(populateAsciiTable(value, index, 4, 256), this.asciiTable2D34);
      return value - 4;
    });
  }
  /**
   * @throws `AbortedError` when there isn't enough data to be wasted
   */
  wasteBits(numberOfBits) {
    if (numberOfBits > this.extraBits && this.inputBufferSize - this.inputBufferStartIndex === 0) {
      throw new AbortedError();
    }
    if (numberOfBits <= this.extraBits) {
      this.bitBuffer = this.bitBuffer >> numberOfBits;
      this.extraBits = this.extraBits - numberOfBits;
      return;
    }
    const nextByte = this.inputBufferView[this.inputBufferStartIndex];
    this.inputBufferStartIndex = this.inputBufferStartIndex + 1;
    this.bitBuffer = (this.bitBuffer >> this.extraBits | nextByte << 8) >> numberOfBits - this.extraBits;
    this.extraBits = this.extraBits + 8 - numberOfBits;
  }
  /**
   * @throws `AbortedError`
   */
  decodeNextLiteral() {
    const lastBit = getLowestNBitsOf(this.bitBuffer, 1);
    this.wasteBits(1);
    if (lastBit) {
      let lengthCode = this.lengthCodes[getLowestNBitsOf(this.bitBuffer, 8)];
      this.wasteBits(LenBits[lengthCode]);
      const extraLenghtBits = ExLenBits[lengthCode];
      if (extraLenghtBits !== 0) {
        const extraLength = getLowestNBitsOf(this.bitBuffer, extraLenghtBits);
        try {
          this.wasteBits(extraLenghtBits);
        } catch {
          if (lengthCode + extraLength !== 270) {
            throw new AbortedError();
          }
        }
        lengthCode = LenBase[lengthCode] + extraLength;
      }
      return lengthCode + 256;
    }
    const lastByte = getLowestNBitsOf(this.bitBuffer, 8);
    if (this.compressionType === "binary") {
      this.wasteBits(8);
      return lastByte;
    }
    let value;
    if (lastByte > 0) {
      value = this.asciiTable2C34[lastByte];
      if (value === 255) {
        if (getLowestNBitsOf(this.bitBuffer, 6)) {
          this.wasteBits(4);
          value = this.asciiTable2D34[getLowestNBitsOf(this.bitBuffer, 8)];
        } else {
          this.wasteBits(6);
          value = this.asciiTable2E34[getLowestNBitsOf(this.bitBuffer, 7)];
        }
      }
    } else {
      this.wasteBits(8);
      value = this.asciiTable2EB4[getLowestNBitsOf(this.bitBuffer, 8)];
    }
    this.wasteBits(this.chBitsAsc[value]);
    return value;
  }
  /**
   * @throws `AbortedError`
   */
  decodeDistance(repeatLength) {
    const distPosCode = this.distPosCodes[getLowestNBitsOf(this.bitBuffer, 8)];
    const distPosBits = DistBits[distPosCode];
    this.wasteBits(distPosBits);
    let distance;
    let bitsToWaste;
    if (repeatLength === 2) {
      distance = distPosCode << 2 | getLowestNBitsOf(this.bitBuffer, 2);
      bitsToWaste = 2;
    } else {
      switch (this.dictionarySize) {
        case "small": {
          distance = distPosCode << 4 | this.bitBuffer & this.dictionarySizeMask;
          bitsToWaste = 4;
          break;
        }
        case "medium": {
          distance = distPosCode << 5 | this.bitBuffer & this.dictionarySizeMask;
          bitsToWaste = 5;
          break;
        }
        case "large": {
          distance = distPosCode << 6 | this.bitBuffer & this.dictionarySizeMask;
          bitsToWaste = 6;
          break;
        }
      }
    }
    this.wasteBits(bitsToWaste);
    return distance + 1;
  }
  processInput() {
    const headerParsedSuccessfully = this.parseInitialData();
    if (!headerParsedSuccessfully || this.inputBufferSize - this.inputBufferStartIndex === 0) {
      return;
    }
    this.needMoreInput = false;
    const additions = [];
    let additionsByteSum = 0;
    const finalizedChunks = [];
    const blockSize = 4096;
    try {
      let nextLiteral = this.decodeNextLiteral();
      while (nextLiteral !== LITERAL_END_STREAM) {
        if (nextLiteral < 256) {
          additions.push({ data: [nextLiteral], byteLength: 1 });
          additionsByteSum = additionsByteSum + 1;
          nextLiteral = this.decodeNextLiteral();
          continue;
        }
        const repeatLength = nextLiteral - 254;
        const minusDistance = this.decodeDistance(repeatLength);
        if (this.outputBufferSize + additionsByteSum > blockSize * 2) {
          this.outputBufferSize = this.outputBufferSize + additionsByteSum;
          this.outputBuffer = concatArrayBuffersAndLengthedDatas([this.outputBuffer, ...additions], this.outputBufferSize);
          this.outputBufferView = new Uint8Array(this.outputBuffer);
          additions.length = 0;
          additionsByteSum = 0;
          const [a, b] = sliceArrayBufferAt(this.outputBuffer, blockSize);
          finalizedChunks.push(a);
          this.outputBuffer = b;
          this.outputBufferView = new Uint8Array(this.outputBuffer);
          this.outputBufferSize = this.outputBufferSize - blockSize;
        }
        const start = this.outputBufferSize + additionsByteSum - minusDistance;
        if (this.outputBufferSize < start + repeatLength) {
          this.outputBufferSize = this.outputBufferSize + additionsByteSum;
          this.outputBuffer = concatArrayBuffersAndLengthedDatas([this.outputBuffer, ...additions], this.outputBufferSize);
          this.outputBufferView = new Uint8Array(this.outputBuffer);
          additions.length = 0;
          additionsByteSum = 0;
        }
        const availableDataLength = Math.min(start + repeatLength, this.outputBufferSize) - start;
        const availableData = {
          data: uint8ArrayToArray(this.outputBufferView, start, availableDataLength),
          byteLength: availableDataLength
        };
        if (repeatLength > minusDistance) {
          const repeats = Math.ceil(repeatLength / availableData.byteLength);
          const multipliedData = repeat(availableData, repeats);
          const addition = concatArrayBuffersAndLengthedDatas(multipliedData, repeatLength * repeats).slice(0, repeatLength);
          additions.push(addition);
          additionsByteSum = additionsByteSum + repeatLength;
        } else {
          additions.push(availableData);
          additionsByteSum = additionsByteSum + availableData.byteLength;
        }
        nextLiteral = this.decodeNextLiteral();
      }
    } catch {
      this.needMoreInput = true;
    }
    this.outputBufferSize = finalizedChunks.length * blockSize + this.outputBufferSize + additionsByteSum;
    this.outputBuffer = concatArrayBuffersAndLengthedDatas([...finalizedChunks, this.outputBuffer, ...additions], this.outputBufferSize);
    this.outputBufferView = new Uint8Array(this.outputBuffer);
  }
  parseInitialData() {
    if (this.inputBufferSize < 4) {
      return false;
    }
    const { compressionType, dictionarySize } = this.readHeader();
    this.compressionType = compressionType;
    this.dictionarySize = dictionarySize;
    this.bitBuffer = this.inputBufferView[this.inputBufferStartIndex + 2];
    this.inputBufferStartIndex = this.inputBufferStartIndex + 3;
    switch (dictionarySize) {
      case "small": {
        this.dictionarySizeMask = nBitsOfOnes(4);
        break;
      }
      case "medium": {
        this.dictionarySizeMask = nBitsOfOnes(5);
        break;
      }
      case "large": {
        this.dictionarySizeMask = nBitsOfOnes(6);
        break;
      }
    }
    if (this.compressionType === "ascii") {
      this.generateAsciiTables();
    }
    return true;
  }
  /**
   * This function assumes there are at least 2 bytes of data in the buffer
   *
   * @throws `InvalidCompressionTypeError`
   * @throws `InvalidDictionarySizeError`
   */
  readHeader() {
    let compressionType;
    switch (this.inputBufferView[0]) {
      case 0: {
        compressionType = "binary";
        break;
      }
      case 1: {
        compressionType = "ascii";
        break;
      }
      default: {
        throw new InvalidCompressionTypeError();
      }
    }
    let dictionarySize;
    switch (this.inputBufferView[1]) {
      case 4: {
        dictionarySize = "small";
        break;
      }
      case 5: {
        dictionarySize = "medium";
        break;
      }
      case 6: {
        dictionarySize = "large";
        break;
      }
      default: {
        throw new InvalidDictionarySizeError();
      }
    }
    return {
      compressionType,
      dictionarySize
    };
  }
};

// package/dist/simple/Implode.js
var SIZE_OF_HEADER = 3;
var MAX_SIZE_OF_TERMINATION_LITERAL = 2;
var lastOccurrences;
function getSizeOfMatching(view, a, b) {
  const limit = clamp(b - a, 2, LONGEST_ALLOWED_REPETITION);
  for (let i = 2; i <= limit; i++) {
    if (view[a + i] !== view[b + i]) {
      return i;
    }
  }
  return limit;
}
function readUint16(view, at) {
  const highByte = view[at];
  const lowByte = view[at + 1];
  return highByte << 8 | lowByte;
}
function findRepetitions(view, inputBytesLength, cursor) {
  const notEnoughBytes = cursor + 2 > inputBytesLength;
  const tooClose = cursor < 2;
  if (notEnoughBytes || tooClose) {
    return { size: 0, distance: 0 };
  }
  const needle = readUint16(view, cursor);
  const matchedAt = lastOccurrences[needle] ?? -1;
  lastOccurrences[needle] = cursor;
  if (matchedAt === -1) {
    return { size: 0, distance: 0 };
  }
  if (matchedAt === cursor - 2) {
    return { distance: 1, size: 2 };
  }
  return {
    distance: cursor - matchedAt - 1,
    size: getSizeOfMatching(view, matchedAt, cursor)
  };
}
var Implode = class {
  inputBuffer;
  /**
   * Used for accessing the data within inputBuffer
   */
  inputBufferView;
  /**
   * Used for caching inputBuffer.byteLength as that getter is doing some uncached computation to measure the length of
   * inputBuffer
   */
  inputBufferSize;
  /**
   * The implode algorithm works by trimming off the beginning of inputBuffer byte by byte. Instead of actually
   * adjusting the inputBuffer every time a byte is handled we store the beginning of the unhandled section and use it
   * when indexing data that is being read.
   */
  inputBufferStartIndex;
  outputBuffer;
  outputBufferView;
  outputBufferSize;
  dictionarySizeMask;
  distCodes;
  distBits;
  outBits;
  nChBits;
  nChCodes;
  constructor(input, compressionType, dictionarySize) {
    this.dictionarySizeMask = 0;
    this.distCodes = structuredClone(DistCode);
    this.distBits = structuredClone(DistBits);
    this.outBits = 0;
    this.nChBits = repeat(0, 774);
    this.nChCodes = repeat(0, 774);
    this.setupTables(compressionType, dictionarySize);
    this.inputBuffer = input;
    this.inputBufferView = new Uint8Array(this.inputBuffer);
    this.inputBufferSize = this.inputBuffer.byteLength;
    this.inputBufferStartIndex = 0;
    this.outputBuffer = new ArrayBuffer(this.inputBufferSize + SIZE_OF_HEADER + MAX_SIZE_OF_TERMINATION_LITERAL);
    this.outputBufferView = new Uint8Array(this.outputBuffer);
    this.outputBufferSize = 0;
    this.outputHeader(compressionType, dictionarySize);
    this.processInput(dictionarySize);
    this.writeTerminationLiteral();
  }
  getResult() {
    return this.outputBuffer.slice(0, this.outputBufferSize);
  }
  setupTables(compressionType, dictionarySize) {
    switch (compressionType) {
      case "ascii": {
        for (let nCount2 = 0; nCount2 < 256; nCount2++) {
          this.nChBits[nCount2] = ChBitsAsc[nCount2] + 1;
          this.nChCodes[nCount2] = ChCodeAsc[nCount2] * 2;
        }
        break;
      }
      case "binary": {
        let nChCode = 0;
        for (let nCount2 = 0; nCount2 < 256; nCount2++) {
          this.nChBits[nCount2] = 9;
          this.nChCodes[nCount2] = nChCode;
          nChCode = getLowestNBitsOf(nChCode, 16) + 2;
        }
        break;
      }
    }
    switch (dictionarySize) {
      case "small": {
        this.dictionarySizeMask = nBitsOfOnes(4);
        break;
      }
      case "medium": {
        this.dictionarySizeMask = nBitsOfOnes(5);
        break;
      }
      case "large": {
        this.dictionarySizeMask = nBitsOfOnes(6);
        break;
      }
    }
    let nCount = 256;
    for (let i = 0; i < 16; i++) {
      for (let nCount2 = 0; nCount2 < 1 << ExLenBits[i]; nCount2++) {
        this.nChBits[nCount] = ExLenBits[i] + LenBits[i] + 1;
        this.nChCodes[nCount] = nCount2 << LenBits[i] + 1 | LenCode[i] * 2 | 1;
        nCount = nCount + 1;
      }
    }
  }
  outputHeader(compressionType, dictionarySize) {
    switch (compressionType) {
      case "ascii": {
        this.outputBufferView[0] = 1;
        break;
      }
      case "binary": {
        this.outputBufferView[0] = 0;
        break;
      }
    }
    switch (dictionarySize) {
      case "small": {
        this.outputBufferView[1] = 4;
        break;
      }
      case "medium": {
        this.outputBufferView[1] = 5;
        break;
      }
      case "large": {
        this.outputBufferView[1] = 6;
        break;
      }
    }
    this.outputBufferView[2] = 0;
    this.outputBufferSize = 3;
  }
  processInput(dictionarySize) {
    lastOccurrences = {};
    if (this.inputBufferSize === 0) {
      return;
    }
    if (this.inputBufferSize <= 2) {
      this.skipFirstTwoBytes();
      return;
    }
    this.skipFirstTwoBytes();
    while (this.inputBufferSize > this.inputBufferStartIndex) {
      const { size, distance } = findRepetitions(this.inputBufferView, this.inputBufferSize, this.inputBufferStartIndex);
      const isFlushable = this.isRepetitionFlushable(size, distance);
      if (isFlushable === false) {
        const byte = this.inputBufferView[this.inputBufferStartIndex];
        this.outputBits(this.nChBits[byte], this.nChCodes[byte]);
        this.inputBufferStartIndex = this.inputBufferStartIndex + 1;
      } else {
        const byte = size + 254;
        this.outputBits(this.nChBits[byte], this.nChCodes[byte]);
        if (size === 2) {
          const byte2 = distance >> 2;
          this.outputBits(this.distBits[byte2], this.distCodes[byte2]);
          this.outputBits(2, distance & 3);
        } else {
          switch (dictionarySize) {
            case "small": {
              const byte2 = distance >> 4;
              this.outputBits(this.distBits[byte2], this.distCodes[byte2]);
              this.outputBits(4, this.dictionarySizeMask & distance);
              break;
            }
            case "medium": {
              const byte2 = distance >> 5;
              this.outputBits(this.distBits[byte2], this.distCodes[byte2]);
              this.outputBits(5, this.dictionarySizeMask & distance);
              break;
            }
            case "large": {
              const byte2 = distance >> 6;
              this.outputBits(this.distBits[byte2], this.distCodes[byte2]);
              this.outputBits(6, this.dictionarySizeMask & distance);
              break;
            }
          }
        }
        this.inputBufferStartIndex = this.inputBufferStartIndex + size;
      }
      let blockSize;
      switch (dictionarySize) {
        case "small": {
          blockSize = 1024;
          break;
        }
        case "medium": {
          blockSize = 2048;
          break;
        }
        case "large": {
          blockSize = 4096;
          break;
        }
      }
      if (this.inputBufferStartIndex >= blockSize) {
        this.inputBuffer = this.inputBuffer.slice(blockSize);
        this.inputBufferView = new Uint8Array(this.inputBuffer);
        this.inputBufferSize = this.inputBufferSize - blockSize;
        this.inputBufferStartIndex = this.inputBufferStartIndex - blockSize;
        lastOccurrences = {};
      }
    }
  }
  writeTerminationLiteral() {
    this.outputBits(this.nChBits.at(-1), this.nChCodes.at(-1));
  }
  /**
   * @returns false - non flushable
   * @returns true - flushable
   * @returns null - flushable, but there might be a better repetition
   */
  isRepetitionFlushable(size, distance) {
    if (size === 0) {
      return false;
    }
    if (size === 2 && distance >= 256) {
      return false;
    }
    if (size >= 8 || this.inputBufferSize - this.inputBufferStartIndex < 2) {
      return true;
    }
    return null;
  }
  /**
   * repetitions are at least 2 bytes long,
   * so the initial 2 bytes can be moved to the output as is
   */
  skipFirstTwoBytes() {
    const [byte1, byte2] = this.inputBufferView;
    this.outputBits(this.nChBits[byte1], this.nChCodes[byte1]);
    this.outputBits(this.nChBits[byte2], this.nChCodes[byte2]);
    this.inputBufferStartIndex = this.inputBufferStartIndex + 2;
  }
  outputBits(numberOfBits, bitBuffer) {
    if (numberOfBits > 8) {
      this.outputBits(8, bitBuffer);
      bitBuffer = bitBuffer >> 8;
      numberOfBits = numberOfBits - 8;
    }
    const oldOutBits = this.outBits;
    this.outputBufferView[this.outputBufferSize - 1] = this.outputBufferView[this.outputBufferSize - 1] | getLowestNBitsOf(bitBuffer << oldOutBits, 8);
    this.outBits = this.outBits + numberOfBits;
    if (this.outBits > 8) {
      this.outBits = getLowestNBitsOf(this.outBits, 3);
      bitBuffer = bitBuffer >> 8 - oldOutBits;
      this.outputBufferView[this.outputBufferSize] = getLowestNBitsOf(bitBuffer, 8);
      this.outputBufferSize = this.outputBufferSize + 1;
    } else {
      this.outBits = getLowestNBitsOf(this.outBits, 3);
      if (this.outBits === 0) {
        this.outputBufferView[this.outputBufferSize] = 0;
        this.outputBufferSize = this.outputBufferSize + 1;
      }
    }
  }
};

// package/dist/simple/index.js
function explode(input) {
  const instance = new Explode(input);
  return instance.getResult();
}
function implode(input, compressionType, dictionarySize) {
  const instance = new Implode(input, compressionType, dictionarySize);
  return instance.getResult();
}
export {
  implode as compress,
  concatArrayBuffersAndLengthedDatas as concatArrayBuffers,
  explode as decompress,
  explode,
  implode,
  sliceArrayBufferAt
};
