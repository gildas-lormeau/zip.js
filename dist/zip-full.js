(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
}(this, (function (exports) { 'use strict';

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	// Global

	const MAX_BITS = 15;
	const D_CODES = 30;
	const BL_CODES = 19;

	const LENGTH_CODES = 29;
	const LITERALS = 256;
	const L_CODES = (LITERALS + 1 + LENGTH_CODES);
	const HEAP_SIZE = (2 * L_CODES + 1);

	const END_BLOCK = 256;

	// Bit length codes must not exceed MAX_BL_BITS bits
	const MAX_BL_BITS = 7;

	// repeat previous bit length 3-6 times (2 bits of repeat count)
	const REP_3_6 = 16;

	// repeat a zero length 3-10 times (3 bits of repeat count)
	const REPZ_3_10 = 17;

	// repeat a zero length 11-138 times (7 bits of repeat count)
	const REPZ_11_138 = 18;

	// The lengths of the bit length codes are sent in order of decreasing
	// probability, to avoid transmitting the lengths for unused bit
	// length codes.

	const Buf_size = 8 * 2;

	// JZlib version : "1.0.2"
	const Z_DEFAULT_COMPRESSION = -1;

	// compression strategy
	const Z_FILTERED = 1;
	const Z_HUFFMAN_ONLY = 2;
	const Z_DEFAULT_STRATEGY = 0;

	const Z_NO_FLUSH = 0;
	const Z_PARTIAL_FLUSH = 1;
	const Z_FULL_FLUSH = 3;
	const Z_FINISH = 4;

	const Z_OK = 0;
	const Z_STREAM_END = 1;
	const Z_NEED_DICT = 2;
	const Z_STREAM_ERROR = -2;
	const Z_DATA_ERROR = -3;
	const Z_BUF_ERROR = -5;

	// Tree

	function extractArray(array) {
		return array.map(([length, value]) => (new Array(length)).fill(value, 0, length)).flat();
	}

	// see definition of array dist_code below
	const _dist_code = [0, 1, 2, 3].concat(...extractArray([
		[2, 4], [2, 5], [4, 6], [4, 7], [8, 8], [8, 9], [16, 10], [16, 11], [32, 12], [32, 13], [64, 14], [64, 15], [2, 0], [1, 16],
		[1, 17], [2, 18], [2, 19], [4, 20], [4, 21], [8, 22], [8, 23], [16, 24], [16, 25], [32, 26], [32, 27], [64, 28], [64, 29]
	]));

	function Tree() {
		const that = this;

		// dyn_tree; // the dynamic tree
		// max_code; // largest code with non zero frequency
		// stat_desc; // the corresponding static tree

		// Compute the optimal bit lengths for a tree and update the total bit
		// length
		// for the current block.
		// IN assertion: the fields freq and dad are set, heap[heap_max] and
		// above are the tree nodes sorted by increasing frequency.
		// OUT assertions: the field len is set to the optimal bit length, the
		// array bl_count contains the frequencies for each bit length.
		// The length opt_len is updated; static_len is also updated if stree is
		// not null.
		function gen_bitlen(s) {
			const tree = that.dyn_tree;
			const stree = that.stat_desc.static_tree;
			const extra = that.stat_desc.extra_bits;
			const base = that.stat_desc.extra_base;
			const max_length = that.stat_desc.max_length;
			let h; // heap index
			let n, m; // iterate over the tree elements
			let bits; // bit length
			let xbits; // extra bits
			let f; // frequency
			let overflow = 0; // number of elements with bit length too large

			for (bits = 0; bits <= MAX_BITS; bits++)
				s.bl_count[bits] = 0;

			// In a first pass, compute the optimal bit lengths (which may
			// overflow in the case of the bit length tree).
			tree[s.heap[s.heap_max] * 2 + 1] = 0; // root of the heap

			for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
				n = s.heap[h];
				bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
				if (bits > max_length) {
					bits = max_length;
					overflow++;
				}
				tree[n * 2 + 1] = bits;
				// We overwrite tree[n*2+1] which is no longer needed

				if (n > that.max_code)
					continue; // not a leaf node

				s.bl_count[bits]++;
				xbits = 0;
				if (n >= base)
					xbits = extra[n - base];
				f = tree[n * 2];
				s.opt_len += f * (bits + xbits);
				if (stree)
					s.static_len += f * (stree[n * 2 + 1] + xbits);
			}
			if (overflow === 0)
				return;

			// This happens for example on obj2 and pic of the Calgary corpus
			// Find the first bit length which could increase:
			do {
				bits = max_length - 1;
				while (s.bl_count[bits] === 0)
					bits--;
				s.bl_count[bits]--; // move one leaf down the tree
				s.bl_count[bits + 1] += 2; // move one overflow item as its brother
				s.bl_count[max_length]--;
				// The brother of the overflow item also moves one step up,
				// but this does not affect bl_count[max_length]
				overflow -= 2;
			} while (overflow > 0);

			for (bits = max_length; bits !== 0; bits--) {
				n = s.bl_count[bits];
				while (n !== 0) {
					m = s.heap[--h];
					if (m > that.max_code)
						continue;
					if (tree[m * 2 + 1] != bits) {
						s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
						tree[m * 2 + 1] = bits;
					}
					n--;
				}
			}
		}

		// Reverse the first len bits of a code, using straightforward code (a
		// faster
		// method would use a table)
		// IN assertion: 1 <= len <= 15
		function bi_reverse(code, // the value to invert
			len // its bit length
		) {
			let res = 0;
			do {
				res |= code & 1;
				code >>>= 1;
				res <<= 1;
			} while (--len > 0);
			return res >>> 1;
		}

		// Generate the codes for a given tree and bit counts (which need not be
		// optimal).
		// IN assertion: the array bl_count contains the bit length statistics for
		// the given tree and the field len is set for all tree elements.
		// OUT assertion: the field code is set for all tree elements of non
		// zero code length.
		function gen_codes(tree, // the tree to decorate
			max_code, // largest code with non zero frequency
			bl_count // number of codes at each bit length
		) {
			const next_code = []; // next code value for each
			// bit length
			let code = 0; // running code value
			let bits; // bit index
			let n; // code index
			let len;

			// The distribution counts are first used to generate the code values
			// without bit reversal.
			for (bits = 1; bits <= MAX_BITS; bits++) {
				next_code[bits] = code = ((code + bl_count[bits - 1]) << 1);
			}

			// Check that the bit counts in bl_count are consistent. The last code
			// must be all ones.
			// Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
			// "inconsistent bit counts");
			// Tracev((stderr,"gen_codes: max_code %d ", max_code));

			for (n = 0; n <= max_code; n++) {
				len = tree[n * 2 + 1];
				if (len === 0)
					continue;
				// Now reverse the bits
				tree[n * 2] = bi_reverse(next_code[len]++, len);
			}
		}

		// Construct one Huffman tree and assigns the code bit strings and lengths.
		// Update the total bit length for the current block.
		// IN assertion: the field freq is set for all tree elements.
		// OUT assertions: the fields len and code are set to the optimal bit length
		// and corresponding code. The length opt_len is updated; static_len is
		// also updated if stree is not null. The field max_code is set.
		that.build_tree = function (s) {
			const tree = that.dyn_tree;
			const stree = that.stat_desc.static_tree;
			const elems = that.stat_desc.elems;
			let n, m; // iterate over heap elements
			let max_code = -1; // largest code with non zero frequency
			let node; // new node being created

			// Construct the initial heap, with least frequent element in
			// heap[1]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
			// heap[0] is not used.
			s.heap_len = 0;
			s.heap_max = HEAP_SIZE;

			for (n = 0; n < elems; n++) {
				if (tree[n * 2] !== 0) {
					s.heap[++s.heap_len] = max_code = n;
					s.depth[n] = 0;
				} else {
					tree[n * 2 + 1] = 0;
				}
			}

			// The pkzip format requires that at least one distance code exists,
			// and that at least one bit should be sent even if there is only one
			// possible code. So to avoid special checks later on we force at least
			// two codes of non zero frequency.
			while (s.heap_len < 2) {
				node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
				tree[node * 2] = 1;
				s.depth[node] = 0;
				s.opt_len--;
				if (stree)
					s.static_len -= stree[node * 2 + 1];
				// node is 0 or 1 so it does not have extra bits
			}
			that.max_code = max_code;

			// The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
			// establish sub-heaps of increasing lengths:

			for (n = Math.floor(s.heap_len / 2); n >= 1; n--)
				s.pqdownheap(tree, n);

			// Construct the Huffman tree by repeatedly combining the least two
			// frequent nodes.

			node = elems; // next internal node of the tree
			do {
				// n = node of least frequency
				n = s.heap[1];
				s.heap[1] = s.heap[s.heap_len--];
				s.pqdownheap(tree, 1);
				m = s.heap[1]; // m = node of next least frequency

				s.heap[--s.heap_max] = n; // keep the nodes sorted by frequency
				s.heap[--s.heap_max] = m;

				// Create a new node father of n and m
				tree[node * 2] = (tree[n * 2] + tree[m * 2]);
				s.depth[node] = Math.max(s.depth[n], s.depth[m]) + 1;
				tree[n * 2 + 1] = tree[m * 2 + 1] = node;

				// and insert the new node in the heap
				s.heap[1] = node++;
				s.pqdownheap(tree, 1);
			} while (s.heap_len >= 2);

			s.heap[--s.heap_max] = s.heap[1];

			// At this point, the fields freq and dad are set. We can now
			// generate the bit lengths.

			gen_bitlen(s);

			// The field len is now set, we can generate the bit codes
			gen_codes(tree, that.max_code, s.bl_count);
		};

	}

	Tree._length_code = [0, 1, 2, 3, 4, 5, 6, 7].concat(...extractArray([
		[2, 8], [2, 9], [2, 10], [2, 11], [4, 12], [4, 13], [4, 14], [4, 15], [8, 16], [8, 17], [8, 18], [8, 19],
		[16, 20], [16, 21], [16, 22], [16, 23], [32, 24], [32, 25], [32, 26], [31, 27], [1, 28]]));

	Tree.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0];

	Tree.base_dist = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384,
		24576];

	// Mapping from a distance to a distance code. dist is the distance - 1 and
	// must not have side effects. _dist_code[256] and _dist_code[257] are never
	// used.
	Tree.d_code = function (dist) {
		return ((dist) < 256 ? _dist_code[dist] : _dist_code[256 + ((dist) >>> 7)]);
	};

	// extra bits for each length code
	Tree.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

	// extra bits for each distance code
	Tree.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

	// extra bits for each bit length code
	Tree.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];

	Tree.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

	// StaticTree

	function StaticTree(static_tree, extra_bits, extra_base, elems, max_length) {
		const that = this;
		that.static_tree = static_tree;
		that.extra_bits = extra_bits;
		that.extra_base = extra_base;
		that.elems = elems;
		that.max_length = max_length;
	}

	StaticTree.static_ltree = [12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8,
		130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42,
		8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8,
		22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8,
		222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113,
		8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8,
		69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8,
		173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9,
		51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9,
		427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379,
		9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23,
		9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9,
		399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9,
		223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7,
		40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8,
		99, 8, 227, 8];

	StaticTree.static_dtree = [0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5,
		25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5];

	StaticTree.static_l_desc = new StaticTree(StaticTree.static_ltree, Tree.extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);

	StaticTree.static_d_desc = new StaticTree(StaticTree.static_dtree, Tree.extra_dbits, 0, D_CODES, MAX_BITS);

	StaticTree.static_bl_desc = new StaticTree(null, Tree.extra_blbits, 0, BL_CODES, MAX_BL_BITS);

	// Deflate

	const MAX_MEM_LEVEL = 9;
	const DEF_MEM_LEVEL = 8;

	function Config(good_length, max_lazy, nice_length, max_chain, func) {
		const that = this;
		that.good_length = good_length;
		that.max_lazy = max_lazy;
		that.nice_length = nice_length;
		that.max_chain = max_chain;
		that.func = func;
	}

	const STORED = 0;
	const FAST = 1;
	const SLOW = 2;
	const config_table = [
		new Config(0, 0, 0, 0, STORED),
		new Config(4, 4, 8, 4, FAST),
		new Config(4, 5, 16, 8, FAST),
		new Config(4, 6, 32, 32, FAST),
		new Config(4, 4, 16, 16, SLOW),
		new Config(8, 16, 32, 32, SLOW),
		new Config(8, 16, 128, 128, SLOW),
		new Config(8, 32, 128, 256, SLOW),
		new Config(32, 128, 258, 1024, SLOW),
		new Config(32, 258, 258, 4096, SLOW)
	];

	const z_errmsg = ["need dictionary", // Z_NEED_DICT
		// 2
		"stream end", // Z_STREAM_END 1
		"", // Z_OK 0
		"", // Z_ERRNO (-1)
		"stream error", // Z_STREAM_ERROR (-2)
		"data error", // Z_DATA_ERROR (-3)
		"", // Z_MEM_ERROR (-4)
		"buffer error", // Z_BUF_ERROR (-5)
		"",// Z_VERSION_ERROR (-6)
		""];

	// block not completed, need more input or more output
	const NeedMore = 0;

	// block flush performed
	const BlockDone = 1;

	// finish started, need only more output at next deflate
	const FinishStarted = 2;

	// finish done, accept no more input or output
	const FinishDone = 3;

	// preset dictionary flag in zlib header
	const PRESET_DICT = 0x20;

	const INIT_STATE = 42;
	const BUSY_STATE = 113;
	const FINISH_STATE = 666;

	// The deflate compression method
	const Z_DEFLATED = 8;

	const STORED_BLOCK = 0;
	const STATIC_TREES = 1;
	const DYN_TREES = 2;

	const MIN_MATCH = 3;
	const MAX_MATCH = 258;
	const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

	function smaller(tree, n, m, depth) {
		const tn2 = tree[n * 2];
		const tm2 = tree[m * 2];
		return (tn2 < tm2 || (tn2 == tm2 && depth[n] <= depth[m]));
	}

	function Deflate() {

		const that = this;
		let strm; // pointer back to this zlib stream
		let status; // as the name implies
		// pending_buf; // output still pending
		let pending_buf_size; // size of pending_buf
		// pending_out; // next pending byte to output to the stream
		// pending; // nb of bytes in the pending buffer
		let last_flush; // value of flush param for previous deflate call

		let w_size; // LZ77 window size (32K by default)
		let w_bits; // log2(w_size) (8..16)
		let w_mask; // w_size - 1

		let window;
		// Sliding window. Input bytes are read into the second half of the window,
		// and move to the first half later to keep a dictionary of at least wSize
		// bytes. With this organization, matches are limited to a distance of
		// wSize-MAX_MATCH bytes, but this ensures that IO is always
		// performed with a length multiple of the block size. Also, it limits
		// the window size to 64K, which is quite useful on MSDOS.
		// To do: use the user input buffer as sliding window.

		let window_size;
		// Actual size of window: 2*wSize, except when the user input buffer
		// is directly used as sliding window.

		let prev;
		// Link to older string with same hash index. To limit the size of this
		// array to 64K, this link is maintained only for the last 32K strings.
		// An index in this array is thus a window index modulo 32K.

		let head; // Heads of the hash chains or NIL.

		let ins_h; // hash index of string to be inserted
		let hash_size; // number of elements in hash table
		let hash_bits; // log2(hash_size)
		let hash_mask; // hash_size-1

		// Number of bits by which ins_h must be shifted at each input
		// step. It must be such that after MIN_MATCH steps, the oldest
		// byte no longer takes part in the hash key, that is:
		// hash_shift * MIN_MATCH >= hash_bits
		let hash_shift;

		// Window position at the beginning of the current output block. Gets
		// negative when the window is moved backwards.

		let block_start;

		let match_length; // length of best match
		let prev_match; // previous match
		let match_available; // set if previous match exists
		let strstart; // start of string to insert
		let match_start; // start of matching string
		let lookahead; // number of valid bytes ahead in window

		// Length of the best match at previous step. Matches not greater than this
		// are discarded. This is used in the lazy match evaluation.
		let prev_length;

		// To speed up deflation, hash chains are never searched beyond this
		// length. A higher limit improves compression ratio but degrades the speed.
		let max_chain_length;

		// Attempt to find a better match only when the current match is strictly
		// smaller than this value. This mechanism is used only for compression
		// levels >= 4.
		let max_lazy_match;

		// Insert new strings in the hash table only if the match length is not
		// greater than this length. This saves time but degrades compression.
		// max_insert_length is used only for compression levels <= 3.

		let level; // compression level (1..9)
		let strategy; // favor or force Huffman coding

		// Use a faster search when the previous match is longer than this
		let good_match;

		// Stop searching when current match exceeds this
		let nice_match;

		let dyn_ltree; // literal and length tree
		let dyn_dtree; // distance tree
		let bl_tree; // Huffman tree for bit lengths

		const l_desc = new Tree(); // desc for literal tree
		const d_desc = new Tree(); // desc for distance tree
		const bl_desc = new Tree(); // desc for bit length tree

		// that.heap_len; // number of elements in the heap
		// that.heap_max; // element of largest frequency
		// The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
		// The same heap array is used to build all trees.

		// Depth of each subtree used as tie breaker for trees of equal frequency
		that.depth = [];

		let l_buf; // index for literals or lengths */

		// Size of match buffer for literals/lengths. There are 4 reasons for
		// limiting lit_bufsize to 64K:
		// - frequencies can be kept in 16 bit counters
		// - if compression is not successful for the first block, all input
		// data is still in the window so we can still emit a stored block even
		// when input comes from standard input. (This can also be done for
		// all blocks if lit_bufsize is not greater than 32K.)
		// - if compression is not successful for a file smaller than 64K, we can
		// even emit a stored file instead of a stored block (saving 5 bytes).
		// This is applicable only for zip (not gzip or zlib).
		// - creating new Huffman trees less frequently may not provide fast
		// adaptation to changes in the input data statistics. (Take for
		// example a binary file with poorly compressible code followed by
		// a highly compressible string table.) Smaller buffer sizes give
		// fast adaptation but have of course the overhead of transmitting
		// trees more frequently.
		// - I can't count above 4
		let lit_bufsize;

		let last_lit; // running index in l_buf

		// Buffer for distances. To simplify the code, d_buf and l_buf have
		// the same number of elements. To use different lengths, an extra flag
		// array would be necessary.

		let d_buf; // index of pendig_buf

		// that.opt_len; // bit length of current block with optimal trees
		// that.static_len; // bit length of current block with static trees
		let matches; // number of string matches in current block
		let last_eob_len; // bit length of EOB code for last block

		// Output buffer. bits are inserted starting at the bottom (least
		// significant bits).
		let bi_buf;

		// Number of valid bits in bi_buf. All bits above the last valid bit
		// are always zero.
		let bi_valid;

		// number of codes at each bit length for an optimal tree
		that.bl_count = [];

		// heap used to build the Huffman trees
		that.heap = [];

		dyn_ltree = [];
		dyn_dtree = [];
		bl_tree = [];

		function lm_init() {
			window_size = 2 * w_size;

			head[hash_size - 1] = 0;
			for (let i = 0; i < hash_size - 1; i++) {
				head[i] = 0;
			}

			// Set the default configuration parameters:
			max_lazy_match = config_table[level].max_lazy;
			good_match = config_table[level].good_length;
			nice_match = config_table[level].nice_length;
			max_chain_length = config_table[level].max_chain;

			strstart = 0;
			block_start = 0;
			lookahead = 0;
			match_length = prev_length = MIN_MATCH - 1;
			match_available = 0;
			ins_h = 0;
		}

		function init_block() {
			let i;
			// Initialize the trees.
			for (i = 0; i < L_CODES; i++)
				dyn_ltree[i * 2] = 0;
			for (i = 0; i < D_CODES; i++)
				dyn_dtree[i * 2] = 0;
			for (i = 0; i < BL_CODES; i++)
				bl_tree[i * 2] = 0;

			dyn_ltree[END_BLOCK * 2] = 1;
			that.opt_len = that.static_len = 0;
			last_lit = matches = 0;
		}

		// Initialize the tree data structures for a new zlib stream.
		function tr_init() {

			l_desc.dyn_tree = dyn_ltree;
			l_desc.stat_desc = StaticTree.static_l_desc;

			d_desc.dyn_tree = dyn_dtree;
			d_desc.stat_desc = StaticTree.static_d_desc;

			bl_desc.dyn_tree = bl_tree;
			bl_desc.stat_desc = StaticTree.static_bl_desc;

			bi_buf = 0;
			bi_valid = 0;
			last_eob_len = 8; // enough lookahead for inflate

			// Initialize the first block of the first file:
			init_block();
		}

		// Restore the heap property by moving down the tree starting at node k,
		// exchanging a node with the smallest of its two sons if necessary,
		// stopping
		// when the heap property is re-established (each father smaller than its
		// two sons).
		that.pqdownheap = function (tree, // the tree to restore
			k // node to move down
		) {
			const heap = that.heap;
			const v = heap[k];
			let j = k << 1; // left son of k
			while (j <= that.heap_len) {
				// Set j to the smallest of the two sons:
				if (j < that.heap_len && smaller(tree, heap[j + 1], heap[j], that.depth)) {
					j++;
				}
				// Exit if v is smaller than both sons
				if (smaller(tree, v, heap[j], that.depth))
					break;

				// Exchange v with the smallest son
				heap[k] = heap[j];
				k = j;
				// And continue down the tree, setting j to the left son of k
				j <<= 1;
			}
			heap[k] = v;
		};

		// Scan a literal or distance tree to determine the frequencies of the codes
		// in the bit length tree.
		function scan_tree(tree,// the tree to be scanned
			max_code // and its largest code of non zero frequency
		) {
			let prevlen = -1; // last emitted length
			let curlen; // length of current code
			let nextlen = tree[0 * 2 + 1]; // length of next code
			let count = 0; // repeat count of the current code
			let max_count = 7; // max repeat count
			let min_count = 4; // min repeat count

			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			}
			tree[(max_code + 1) * 2 + 1] = 0xffff; // guard

			for (let n = 0; n <= max_code; n++) {
				curlen = nextlen;
				nextlen = tree[(n + 1) * 2 + 1];
				if (++count < max_count && curlen == nextlen) {
					continue;
				} else if (count < min_count) {
					bl_tree[curlen * 2] += count;
				} else if (curlen !== 0) {
					if (curlen != prevlen)
						bl_tree[curlen * 2]++;
					bl_tree[REP_3_6 * 2]++;
				} else if (count <= 10) {
					bl_tree[REPZ_3_10 * 2]++;
				} else {
					bl_tree[REPZ_11_138 * 2]++;
				}
				count = 0;
				prevlen = curlen;
				if (nextlen === 0) {
					max_count = 138;
					min_count = 3;
				} else if (curlen == nextlen) {
					max_count = 6;
					min_count = 3;
				} else {
					max_count = 7;
					min_count = 4;
				}
			}
		}

		// Construct the Huffman tree for the bit lengths and return the index in
		// bl_order of the last bit length code to send.
		function build_bl_tree() {
			let max_blindex; // index of last bit length code of non zero freq

			// Determine the bit length frequencies for literal and distance trees
			scan_tree(dyn_ltree, l_desc.max_code);
			scan_tree(dyn_dtree, d_desc.max_code);

			// Build the bit length tree:
			bl_desc.build_tree(that);
			// opt_len now includes the length of the tree representations, except
			// the lengths of the bit lengths codes and the 5+5+4 bits for the
			// counts.

			// Determine the number of bit length codes to send. The pkzip format
			// requires that at least 4 bit length codes be sent. (appnote.txt says
			// 3 but the actual value used is 4.)
			for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
				if (bl_tree[Tree.bl_order[max_blindex] * 2 + 1] !== 0)
					break;
			}
			// Update opt_len to include the bit length tree and counts
			that.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;

			return max_blindex;
		}

		// Output a byte on the stream.
		// IN assertion: there is enough room in pending_buf.
		function put_byte(p) {
			that.pending_buf[that.pending++] = p;
		}

		function put_short(w) {
			put_byte(w & 0xff);
			put_byte((w >>> 8) & 0xff);
		}

		function putShortMSB(b) {
			put_byte((b >> 8) & 0xff);
			put_byte((b & 0xff) & 0xff);
		}

		function send_bits(value, length) {
			let val;
			const len = length;
			if (bi_valid > Buf_size - len) {
				val = value;
				// bi_buf |= (val << bi_valid);
				bi_buf |= ((val << bi_valid) & 0xffff);
				put_short(bi_buf);
				bi_buf = val >>> (Buf_size - bi_valid);
				bi_valid += len - Buf_size;
			} else {
				// bi_buf |= (value) << bi_valid;
				bi_buf |= (((value) << bi_valid) & 0xffff);
				bi_valid += len;
			}
		}

		function send_code(c, tree) {
			const c2 = c * 2;
			send_bits(tree[c2] & 0xffff, tree[c2 + 1] & 0xffff);
		}

		// Send a literal or distance tree in compressed form, using the codes in
		// bl_tree.
		function send_tree(tree,// the tree to be sent
			max_code // and its largest code of non zero frequency
		) {
			let n; // iterates over all tree elements
			let prevlen = -1; // last emitted length
			let curlen; // length of current code
			let nextlen = tree[0 * 2 + 1]; // length of next code
			let count = 0; // repeat count of the current code
			let max_count = 7; // max repeat count
			let min_count = 4; // min repeat count

			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			}

			for (n = 0; n <= max_code; n++) {
				curlen = nextlen;
				nextlen = tree[(n + 1) * 2 + 1];
				if (++count < max_count && curlen == nextlen) {
					continue;
				} else if (count < min_count) {
					do {
						send_code(curlen, bl_tree);
					} while (--count !== 0);
				} else if (curlen !== 0) {
					if (curlen != prevlen) {
						send_code(curlen, bl_tree);
						count--;
					}
					send_code(REP_3_6, bl_tree);
					send_bits(count - 3, 2);
				} else if (count <= 10) {
					send_code(REPZ_3_10, bl_tree);
					send_bits(count - 3, 3);
				} else {
					send_code(REPZ_11_138, bl_tree);
					send_bits(count - 11, 7);
				}
				count = 0;
				prevlen = curlen;
				if (nextlen === 0) {
					max_count = 138;
					min_count = 3;
				} else if (curlen == nextlen) {
					max_count = 6;
					min_count = 3;
				} else {
					max_count = 7;
					min_count = 4;
				}
			}
		}

		// Send the header for a block using dynamic Huffman trees: the counts, the
		// lengths of the bit length codes, the literal tree and the distance tree.
		// IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
		function send_all_trees(lcodes, dcodes, blcodes) {
			let rank; // index in bl_order

			send_bits(lcodes - 257, 5); // not +255 as stated in appnote.txt
			send_bits(dcodes - 1, 5);
			send_bits(blcodes - 4, 4); // not -3 as stated in appnote.txt
			for (rank = 0; rank < blcodes; rank++) {
				send_bits(bl_tree[Tree.bl_order[rank] * 2 + 1], 3);
			}
			send_tree(dyn_ltree, lcodes - 1); // literal tree
			send_tree(dyn_dtree, dcodes - 1); // distance tree
		}

		// Flush the bit buffer, keeping at most 7 bits in it.
		function bi_flush() {
			if (bi_valid == 16) {
				put_short(bi_buf);
				bi_buf = 0;
				bi_valid = 0;
			} else if (bi_valid >= 8) {
				put_byte(bi_buf & 0xff);
				bi_buf >>>= 8;
				bi_valid -= 8;
			}
		}

		// Send one empty static block to give enough lookahead for inflate.
		// This takes 10 bits, of which 7 may remain in the bit buffer.
		// The current inflate code requires 9 bits of lookahead. If the
		// last two codes for the previous block (real code plus EOB) were coded
		// on 5 bits or less, inflate may have only 5+3 bits of lookahead to decode
		// the last real code. In this case we send two empty static blocks instead
		// of one. (There are no problems if the previous block is stored or fixed.)
		// To simplify the code, we assume the worst case of last real code encoded
		// on one bit only.
		function _tr_align() {
			send_bits(STATIC_TREES << 1, 3);
			send_code(END_BLOCK, StaticTree.static_ltree);

			bi_flush();

			// Of the 10 bits for the empty block, we have already sent
			// (10 - bi_valid) bits. The lookahead for the last real code (before
			// the EOB of the previous block) was thus at least one plus the length
			// of the EOB plus what we have just sent of the empty static block.
			if (1 + last_eob_len + 10 - bi_valid < 9) {
				send_bits(STATIC_TREES << 1, 3);
				send_code(END_BLOCK, StaticTree.static_ltree);
				bi_flush();
			}
			last_eob_len = 7;
		}

		// Save the match info and tally the frequency counts. Return true if
		// the current block must be flushed.
		function _tr_tally(dist, // distance of matched string
			lc // match length-MIN_MATCH or unmatched char (if dist==0)
		) {
			let out_length, in_length, dcode;
			that.pending_buf[d_buf + last_lit * 2] = (dist >>> 8) & 0xff;
			that.pending_buf[d_buf + last_lit * 2 + 1] = dist & 0xff;

			that.pending_buf[l_buf + last_lit] = lc & 0xff;
			last_lit++;

			if (dist === 0) {
				// lc is the unmatched char
				dyn_ltree[lc * 2]++;
			} else {
				matches++;
				// Here, lc is the match length - MIN_MATCH
				dist--; // dist = match distance - 1
				dyn_ltree[(Tree._length_code[lc] + LITERALS + 1) * 2]++;
				dyn_dtree[Tree.d_code(dist) * 2]++;
			}

			if ((last_lit & 0x1fff) === 0 && level > 2) {
				// Compute an upper bound for the compressed length
				out_length = last_lit * 8;
				in_length = strstart - block_start;
				for (dcode = 0; dcode < D_CODES; dcode++) {
					out_length += dyn_dtree[dcode * 2] * (5 + Tree.extra_dbits[dcode]);
				}
				out_length >>>= 3;
				if ((matches < Math.floor(last_lit / 2)) && out_length < Math.floor(in_length / 2))
					return true;
			}

			return (last_lit == lit_bufsize - 1);
			// We avoid equality with lit_bufsize because of wraparound at 64K
			// on 16 bit machines and because stored blocks are restricted to
			// 64K-1 bytes.
		}

		// Send the block data compressed using the given Huffman trees
		function compress_block(ltree, dtree) {
			let dist; // distance of matched string
			let lc; // match length or unmatched char (if dist === 0)
			let lx = 0; // running index in l_buf
			let code; // the code to send
			let extra; // number of extra bits to send

			if (last_lit !== 0) {
				do {
					dist = ((that.pending_buf[d_buf + lx * 2] << 8) & 0xff00) | (that.pending_buf[d_buf + lx * 2 + 1] & 0xff);
					lc = (that.pending_buf[l_buf + lx]) & 0xff;
					lx++;

					if (dist === 0) {
						send_code(lc, ltree); // send a literal byte
					} else {
						// Here, lc is the match length - MIN_MATCH
						code = Tree._length_code[lc];

						send_code(code + LITERALS + 1, ltree); // send the length
						// code
						extra = Tree.extra_lbits[code];
						if (extra !== 0) {
							lc -= Tree.base_length[code];
							send_bits(lc, extra); // send the extra length bits
						}
						dist--; // dist is now the match distance - 1
						code = Tree.d_code(dist);

						send_code(code, dtree); // send the distance code
						extra = Tree.extra_dbits[code];
						if (extra !== 0) {
							dist -= Tree.base_dist[code];
							send_bits(dist, extra); // send the extra distance bits
						}
					} // literal or match pair ?

					// Check that the overlay between pending_buf and d_buf+l_buf is
					// ok:
				} while (lx < last_lit);
			}

			send_code(END_BLOCK, ltree);
			last_eob_len = ltree[END_BLOCK * 2 + 1];
		}

		// Flush the bit buffer and align the output on a byte boundary
		function bi_windup() {
			if (bi_valid > 8) {
				put_short(bi_buf);
			} else if (bi_valid > 0) {
				put_byte(bi_buf & 0xff);
			}
			bi_buf = 0;
			bi_valid = 0;
		}

		// Copy a stored block, storing first the length and its
		// one's complement if requested.
		function copy_block(buf, // the input data
			len, // its length
			header // true if block header must be written
		) {
			bi_windup(); // align on byte boundary
			last_eob_len = 8; // enough lookahead for inflate

			if (header) {
				put_short(len);
				put_short(~len);
			}

			that.pending_buf.set(window.subarray(buf, buf + len), that.pending);
			that.pending += len;
		}

		// Send a stored block
		function _tr_stored_block(buf, // input block
			stored_len, // length of input block
			eof // true if this is the last block for a file
		) {
			send_bits((STORED_BLOCK << 1) + (eof ? 1 : 0), 3); // send block type
			copy_block(buf, stored_len, true); // with header
		}

		// Determine the best encoding for the current block: dynamic trees, static
		// trees or store, and output the encoded block to the zip file.
		function _tr_flush_block(buf, // input block, or NULL if too old
			stored_len, // length of input block
			eof // true if this is the last block for a file
		) {
			let opt_lenb, static_lenb;// opt_len and static_len in bytes
			let max_blindex = 0; // index of last bit length code of non zero freq

			// Build the Huffman trees unless a stored block is forced
			if (level > 0) {
				// Construct the literal and distance trees
				l_desc.build_tree(that);

				d_desc.build_tree(that);

				// At this point, opt_len and static_len are the total bit lengths
				// of
				// the compressed block data, excluding the tree representations.

				// Build the bit length tree for the above two trees, and get the
				// index
				// in bl_order of the last bit length code to send.
				max_blindex = build_bl_tree();

				// Determine the best encoding. Compute first the block length in
				// bytes
				opt_lenb = (that.opt_len + 3 + 7) >>> 3;
				static_lenb = (that.static_len + 3 + 7) >>> 3;

				if (static_lenb <= opt_lenb)
					opt_lenb = static_lenb;
			} else {
				opt_lenb = static_lenb = stored_len + 5; // force a stored block
			}

			if ((stored_len + 4 <= opt_lenb) && buf != -1) {
				// 4: two words for the lengths
				// The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
				// Otherwise we can't have processed more than WSIZE input bytes
				// since
				// the last block flush, because compression would have been
				// successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
				// transform a block into a stored block.
				_tr_stored_block(buf, stored_len, eof);
			} else if (static_lenb == opt_lenb) {
				send_bits((STATIC_TREES << 1) + (eof ? 1 : 0), 3);
				compress_block(StaticTree.static_ltree, StaticTree.static_dtree);
			} else {
				send_bits((DYN_TREES << 1) + (eof ? 1 : 0), 3);
				send_all_trees(l_desc.max_code + 1, d_desc.max_code + 1, max_blindex + 1);
				compress_block(dyn_ltree, dyn_dtree);
			}

			// The above check is made mod 2^32, for files larger than 512 MB
			// and uLong implemented on 32 bits.

			init_block();

			if (eof) {
				bi_windup();
			}
		}

		function flush_block_only(eof) {
			_tr_flush_block(block_start >= 0 ? block_start : -1, strstart - block_start, eof);
			block_start = strstart;
			strm.flush_pending();
		}

		// Fill the window when the lookahead becomes insufficient.
		// Updates strstart and lookahead.
		//
		// IN assertion: lookahead < MIN_LOOKAHEAD
		// OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
		// At least one byte has been read, or avail_in === 0; reads are
		// performed for at least two bytes (required for the zip translate_eol
		// option -- not supported here).
		function fill_window() {
			let n, m;
			let p;
			let more; // Amount of free space at the end of the window.

			do {
				more = (window_size - lookahead - strstart);

				// Deal with !@#$% 64K limit:
				if (more === 0 && strstart === 0 && lookahead === 0) {
					more = w_size;
				} else if (more == -1) {
					// Very unlikely, but possible on 16 bit machine if strstart ==
					// 0
					// and lookahead == 1 (input done one byte at time)
					more--;

					// If the window is almost full and there is insufficient
					// lookahead,
					// move the upper half to the lower one to make room in the
					// upper half.
				} else if (strstart >= w_size + w_size - MIN_LOOKAHEAD) {
					window.set(window.subarray(w_size, w_size + w_size), 0);

					match_start -= w_size;
					strstart -= w_size; // we now have strstart >= MAX_DIST
					block_start -= w_size;

					// Slide the hash table (could be avoided with 32 bit values
					// at the expense of memory usage). We slide even when level ==
					// 0
					// to keep the hash table consistent if we switch back to level
					// > 0
					// later. (Using level 0 permanently is not an optimal usage of
					// zlib, so we don't care about this pathological case.)

					n = hash_size;
					p = n;
					do {
						m = (head[--p] & 0xffff);
						head[p] = (m >= w_size ? m - w_size : 0);
					} while (--n !== 0);

					n = w_size;
					p = n;
					do {
						m = (prev[--p] & 0xffff);
						prev[p] = (m >= w_size ? m - w_size : 0);
						// If n is not on any hash chain, prev[n] is garbage but
						// its value will never be used.
					} while (--n !== 0);
					more += w_size;
				}

				if (strm.avail_in === 0)
					return;

				// If there was no sliding:
				// strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
				// more == window_size - lookahead - strstart
				// => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
				// => more >= window_size - 2*WSIZE + 2
				// In the BIG_MEM or MMAP case (not yet supported),
				// window_size == input_size + MIN_LOOKAHEAD &&
				// strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
				// Otherwise, window_size == 2*WSIZE so more >= 2.
				// If there was sliding, more >= WSIZE. So in all cases, more >= 2.

				n = strm.read_buf(window, strstart + lookahead, more);
				lookahead += n;

				// Initialize the hash value now that we have some input:
				if (lookahead >= MIN_MATCH) {
					ins_h = window[strstart] & 0xff;
					ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
				}
				// If the whole input has less than MIN_MATCH bytes, ins_h is
				// garbage,
				// but this is not important since only literal bytes will be
				// emitted.
			} while (lookahead < MIN_LOOKAHEAD && strm.avail_in !== 0);
		}

		// Copy without compression as much as possible from the input stream,
		// return
		// the current block state.
		// This function does not insert new strings in the dictionary since
		// uncompressible data is probably not useful. This function is used
		// only for the level=0 compression option.
		// NOTE: this function should be optimized to avoid extra copying from
		// window to pending_buf.
		function deflate_stored(flush) {
			// Stored blocks are limited to 0xffff bytes, pending_buf is limited
			// to pending_buf_size, and each stored block has a 5 byte header:

			let max_block_size = 0xffff;
			let max_start;

			if (max_block_size > pending_buf_size - 5) {
				max_block_size = pending_buf_size - 5;
			}

			// Copy as much as possible from input to output:
			// eslint-disable-next-line no-constant-condition
			while (true) {
				// Fill the window as much as possible:
				if (lookahead <= 1) {
					fill_window();
					if (lookahead === 0 && flush == Z_NO_FLUSH)
						return NeedMore;
					if (lookahead === 0)
						break; // flush the current block
				}

				strstart += lookahead;
				lookahead = 0;

				// Emit a stored block if pending_buf will be full:
				max_start = block_start + max_block_size;
				if (strstart === 0 || strstart >= max_start) {
					// strstart === 0 is possible when wraparound on 16-bit machine
					lookahead = (strstart - max_start);
					strstart = max_start;

					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;

				}

				// Flush if we may have to slide, otherwise block_start may become
				// negative and the data will be gone:
				if (strstart - block_start >= w_size - MIN_LOOKAHEAD) {
					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;
				}
			}

			flush_block_only(flush == Z_FINISH);
			if (strm.avail_out === 0)
				return (flush == Z_FINISH) ? FinishStarted : NeedMore;

			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		function longest_match(cur_match) {
			let chain_length = max_chain_length; // max hash chain length
			let scan = strstart; // current string
			let match; // matched string
			let len; // length of current match
			let best_len = prev_length; // best match length so far
			const limit = strstart > (w_size - MIN_LOOKAHEAD) ? strstart - (w_size - MIN_LOOKAHEAD) : 0;
			let _nice_match = nice_match;

			// Stop when cur_match becomes <= limit. To simplify the code,
			// we prevent matches with the string of window index 0.

			const wmask = w_mask;

			const strend = strstart + MAX_MATCH;
			let scan_end1 = window[scan + best_len - 1];
			let scan_end = window[scan + best_len];

			// The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of
			// 16.
			// It is easy to get rid of this optimization if necessary.

			// Do not waste too much time if we already have a good match:
			if (prev_length >= good_match) {
				chain_length >>= 2;
			}

			// Do not look for matches beyond the end of the input. This is
			// necessary
			// to make deflate deterministic.
			if (_nice_match > lookahead)
				_nice_match = lookahead;

			do {
				match = cur_match;

				// Skip to next match if the match length cannot increase
				// or if the match length is less than 2:
				if (window[match + best_len] != scan_end || window[match + best_len - 1] != scan_end1 || window[match] != window[scan]
					|| window[++match] != window[scan + 1])
					continue;

				// The check at best_len-1 can be removed because it will be made
				// again later. (This heuristic is not always a win.)
				// It is not necessary to compare scan[2] and match[2] since they
				// are always equal when the other bytes match, given that
				// the hash keys are equal and that HASH_BITS >= 8.
				scan += 2;
				match++;

				// We check for insufficient lookahead only every 8th comparison;
				// the 256th check will be made at strstart+258.
				// eslint-disable-next-line no-empty
				do {
				} while (window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
				&& window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
				&& window[++scan] == window[++match] && window[++scan] == window[++match] && scan < strend);

				len = MAX_MATCH - (strend - scan);
				scan = strend - MAX_MATCH;

				if (len > best_len) {
					match_start = cur_match;
					best_len = len;
					if (len >= _nice_match)
						break;
					scan_end1 = window[scan + best_len - 1];
					scan_end = window[scan + best_len];
				}

			} while ((cur_match = (prev[cur_match & wmask] & 0xffff)) > limit && --chain_length !== 0);

			if (best_len <= lookahead)
				return best_len;
			return lookahead;
		}

		// Compress as much as possible from the input stream, return the current
		// block state.
		// This function does not perform lazy evaluation of matches and inserts
		// new strings in the dictionary only for unmatched strings or for short
		// matches. It is used only for the fast compression options.
		function deflate_fast(flush) {
			// short hash_head = 0; // head of the hash chain
			let hash_head = 0; // head of the hash chain
			let bflush; // set if current block must be flushed

			// eslint-disable-next-line no-constant-condition
			while (true) {
				// Make sure that we always have enough lookahead, except
				// at the end of the input file. We need MAX_MATCH bytes
				// for the next match, plus MIN_MATCH bytes to insert the
				// string following the next match.
				if (lookahead < MIN_LOOKAHEAD) {
					fill_window();
					if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
						return NeedMore;
					}
					if (lookahead === 0)
						break; // flush the current block
				}

				// Insert the string window[strstart .. strstart+2] in the
				// dictionary, and set hash_head to the head of the hash chain:
				if (lookahead >= MIN_MATCH) {
					ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;

					// prev[strstart&w_mask]=hash_head=head[ins_h];
					hash_head = (head[ins_h] & 0xffff);
					prev[strstart & w_mask] = head[ins_h];
					head[ins_h] = strstart;
				}

				// Find the longest match, discarding those <= prev_length.
				// At this point we have always match_length < MIN_MATCH

				if (hash_head !== 0 && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
					// To simplify the code, we prevent matches with the string
					// of window index 0 (in particular we have to avoid a match
					// of the string with itself at the start of the input file).
					if (strategy != Z_HUFFMAN_ONLY) {
						match_length = longest_match(hash_head);
					}
					// longest_match() sets match_start
				}
				if (match_length >= MIN_MATCH) {
					// check_match(strstart, match_start, match_length);

					bflush = _tr_tally(strstart - match_start, match_length - MIN_MATCH);

					lookahead -= match_length;

					// Insert new strings in the hash table only if the match length
					// is not too large. This saves time but degrades compression.
					if (match_length <= max_lazy_match && lookahead >= MIN_MATCH) {
						match_length--; // string at strstart already in hash table
						do {
							strstart++;

							ins_h = ((ins_h << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
							// prev[strstart&w_mask]=hash_head=head[ins_h];
							hash_head = (head[ins_h] & 0xffff);
							prev[strstart & w_mask] = head[ins_h];
							head[ins_h] = strstart;

							// strstart never exceeds WSIZE-MAX_MATCH, so there are
							// always MIN_MATCH bytes ahead.
						} while (--match_length !== 0);
						strstart++;
					} else {
						strstart += match_length;
						match_length = 0;
						ins_h = window[strstart] & 0xff;

						ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
						// If lookahead < MIN_MATCH, ins_h is garbage, but it does
						// not
						// matter since it will be recomputed at next deflate call.
					}
				} else {
					// No match, output a literal byte

					bflush = _tr_tally(0, window[strstart] & 0xff);
					lookahead--;
					strstart++;
				}
				if (bflush) {

					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;
				}
			}

			flush_block_only(flush == Z_FINISH);
			if (strm.avail_out === 0) {
				if (flush == Z_FINISH)
					return FinishStarted;
				else
					return NeedMore;
			}
			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		// Same as above, but achieves better compression. We use a lazy
		// evaluation for matches: a match is finally adopted only if there is
		// no better match at the next window position.
		function deflate_slow(flush) {
			// short hash_head = 0; // head of hash chain
			let hash_head = 0; // head of hash chain
			let bflush; // set if current block must be flushed
			let max_insert;

			// Process the input block.
			// eslint-disable-next-line no-constant-condition
			while (true) {
				// Make sure that we always have enough lookahead, except
				// at the end of the input file. We need MAX_MATCH bytes
				// for the next match, plus MIN_MATCH bytes to insert the
				// string following the next match.

				if (lookahead < MIN_LOOKAHEAD) {
					fill_window();
					if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
						return NeedMore;
					}
					if (lookahead === 0)
						break; // flush the current block
				}

				// Insert the string window[strstart .. strstart+2] in the
				// dictionary, and set hash_head to the head of the hash chain:

				if (lookahead >= MIN_MATCH) {
					ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
					// prev[strstart&w_mask]=hash_head=head[ins_h];
					hash_head = (head[ins_h] & 0xffff);
					prev[strstart & w_mask] = head[ins_h];
					head[ins_h] = strstart;
				}

				// Find the longest match, discarding those <= prev_length.
				prev_length = match_length;
				prev_match = match_start;
				match_length = MIN_MATCH - 1;

				if (hash_head !== 0 && prev_length < max_lazy_match && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
					// To simplify the code, we prevent matches with the string
					// of window index 0 (in particular we have to avoid a match
					// of the string with itself at the start of the input file).

					if (strategy != Z_HUFFMAN_ONLY) {
						match_length = longest_match(hash_head);
					}
					// longest_match() sets match_start

					if (match_length <= 5 && (strategy == Z_FILTERED || (match_length == MIN_MATCH && strstart - match_start > 4096))) {

						// If prev_match is also MIN_MATCH, match_start is garbage
						// but we will ignore the current match anyway.
						match_length = MIN_MATCH - 1;
					}
				}

				// If there was a match at the previous step and the current
				// match is not better, output the previous match:
				if (prev_length >= MIN_MATCH && match_length <= prev_length) {
					max_insert = strstart + lookahead - MIN_MATCH;
					// Do not insert strings in hash table beyond this.

					// check_match(strstart-1, prev_match, prev_length);

					bflush = _tr_tally(strstart - 1 - prev_match, prev_length - MIN_MATCH);

					// Insert in hash table all strings up to the end of the match.
					// strstart-1 and strstart are already inserted. If there is not
					// enough lookahead, the last two strings are not inserted in
					// the hash table.
					lookahead -= prev_length - 1;
					prev_length -= 2;
					do {
						if (++strstart <= max_insert) {
							ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
							// prev[strstart&w_mask]=hash_head=head[ins_h];
							hash_head = (head[ins_h] & 0xffff);
							prev[strstart & w_mask] = head[ins_h];
							head[ins_h] = strstart;
						}
					} while (--prev_length !== 0);
					match_available = 0;
					match_length = MIN_MATCH - 1;
					strstart++;

					if (bflush) {
						flush_block_only(false);
						if (strm.avail_out === 0)
							return NeedMore;
					}
				} else if (match_available !== 0) {

					// If there was no match at the previous position, output a
					// single literal. If there was a match but the current match
					// is longer, truncate the previous match to a single literal.

					bflush = _tr_tally(0, window[strstart - 1] & 0xff);

					if (bflush) {
						flush_block_only(false);
					}
					strstart++;
					lookahead--;
					if (strm.avail_out === 0)
						return NeedMore;
				} else {
					// There is no previous match to compare with, wait for
					// the next step to decide.

					match_available = 1;
					strstart++;
					lookahead--;
				}
			}

			if (match_available !== 0) {
				bflush = _tr_tally(0, window[strstart - 1] & 0xff);
				match_available = 0;
			}
			flush_block_only(flush == Z_FINISH);

			if (strm.avail_out === 0) {
				if (flush == Z_FINISH)
					return FinishStarted;
				else
					return NeedMore;
			}

			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		function deflateReset(strm) {
			strm.total_in = strm.total_out = 0;
			strm.msg = null; //

			that.pending = 0;
			that.pending_out = 0;

			status = BUSY_STATE;

			last_flush = Z_NO_FLUSH;

			tr_init();
			lm_init();
			return Z_OK;
		}

		that.deflateInit = function (strm, _level, bits, _method, memLevel, _strategy) {
			if (!_method)
				_method = Z_DEFLATED;
			if (!memLevel)
				memLevel = DEF_MEM_LEVEL;
			if (!_strategy)
				_strategy = Z_DEFAULT_STRATEGY;

			// byte[] my_version=ZLIB_VERSION;

			//
			// if (!version || version[0] != my_version[0]
			// || stream_size != sizeof(z_stream)) {
			// return Z_VERSION_ERROR;
			// }

			strm.msg = null;

			if (_level == Z_DEFAULT_COMPRESSION)
				_level = 6;

			if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || _method != Z_DEFLATED || bits < 9 || bits > 15 || _level < 0 || _level > 9 || _strategy < 0
				|| _strategy > Z_HUFFMAN_ONLY) {
				return Z_STREAM_ERROR;
			}

			strm.dstate = that;

			w_bits = bits;
			w_size = 1 << w_bits;
			w_mask = w_size - 1;

			hash_bits = memLevel + 7;
			hash_size = 1 << hash_bits;
			hash_mask = hash_size - 1;
			hash_shift = Math.floor((hash_bits + MIN_MATCH - 1) / MIN_MATCH);

			window = new Uint8Array(w_size * 2);
			prev = [];
			head = [];

			lit_bufsize = 1 << (memLevel + 6); // 16K elements by default

			// We overlay pending_buf and d_buf+l_buf. This works since the average
			// output size for (length,distance) codes is <= 24 bits.
			that.pending_buf = new Uint8Array(lit_bufsize * 4);
			pending_buf_size = lit_bufsize * 4;

			d_buf = Math.floor(lit_bufsize / 2);
			l_buf = (1 + 2) * lit_bufsize;

			level = _level;

			strategy = _strategy;

			return deflateReset(strm);
		};

		that.deflateEnd = function () {
			if (status != INIT_STATE && status != BUSY_STATE && status != FINISH_STATE) {
				return Z_STREAM_ERROR;
			}
			// Deallocate in reverse order of allocations:
			that.pending_buf = null;
			head = null;
			prev = null;
			window = null;
			// free
			that.dstate = null;
			return status == BUSY_STATE ? Z_DATA_ERROR : Z_OK;
		};

		that.deflateParams = function (strm, _level, _strategy) {
			let err = Z_OK;

			if (_level == Z_DEFAULT_COMPRESSION) {
				_level = 6;
			}
			if (_level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
				return Z_STREAM_ERROR;
			}

			if (config_table[level].func != config_table[_level].func && strm.total_in !== 0) {
				// Flush the last buffer:
				err = strm.deflate(Z_PARTIAL_FLUSH);
			}

			if (level != _level) {
				level = _level;
				max_lazy_match = config_table[level].max_lazy;
				good_match = config_table[level].good_length;
				nice_match = config_table[level].nice_length;
				max_chain_length = config_table[level].max_chain;
			}
			strategy = _strategy;
			return err;
		};

		that.deflateSetDictionary = function (strm, dictionary, dictLength) {
			let length = dictLength;
			let n, index = 0;

			if (!dictionary || status != INIT_STATE)
				return Z_STREAM_ERROR;

			if (length < MIN_MATCH)
				return Z_OK;
			if (length > w_size - MIN_LOOKAHEAD) {
				length = w_size - MIN_LOOKAHEAD;
				index = dictLength - length; // use the tail of the dictionary
			}
			window.set(dictionary.subarray(index, index + length), 0);

			strstart = length;
			block_start = length;

			// Insert all strings in the hash table (except for the last two bytes).
			// s->lookahead stays null, so s->ins_h will be recomputed at the next
			// call of fill_window.

			ins_h = window[0] & 0xff;
			ins_h = (((ins_h) << hash_shift) ^ (window[1] & 0xff)) & hash_mask;

			for (n = 0; n <= length - MIN_MATCH; n++) {
				ins_h = (((ins_h) << hash_shift) ^ (window[(n) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
				prev[n & w_mask] = head[ins_h];
				head[ins_h] = n;
			}
			return Z_OK;
		};

		that.deflate = function (_strm, flush) {
			let i, header, level_flags, old_flush, bstate;

			if (flush > Z_FINISH || flush < 0) {
				return Z_STREAM_ERROR;
			}

			if (!_strm.next_out || (!_strm.next_in && _strm.avail_in !== 0) || (status == FINISH_STATE && flush != Z_FINISH)) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_STREAM_ERROR)];
				return Z_STREAM_ERROR;
			}
			if (_strm.avail_out === 0) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			strm = _strm; // just in case
			old_flush = last_flush;
			last_flush = flush;

			// Write the zlib header
			if (status == INIT_STATE) {
				header = (Z_DEFLATED + ((w_bits - 8) << 4)) << 8;
				level_flags = ((level - 1) & 0xff) >> 1;

				if (level_flags > 3)
					level_flags = 3;
				header |= (level_flags << 6);
				if (strstart !== 0)
					header |= PRESET_DICT;
				header += 31 - (header % 31);

				status = BUSY_STATE;
				putShortMSB(header);
			}

			// Flush as much pending output as possible
			if (that.pending !== 0) {
				strm.flush_pending();
				if (strm.avail_out === 0) {
					// console.log(" avail_out==0");
					// Since avail_out is 0, deflate will be called again with
					// more output space, but possibly with both pending and
					// avail_in equal to zero. There won't be anything to do,
					// but this is not an error situation so make sure we
					// return OK instead of BUF_ERROR at next call of deflate:
					last_flush = -1;
					return Z_OK;
				}

				// Make sure there is something to do and avoid duplicate
				// consecutive
				// flushes. For repeated and useless calls with Z_FINISH, we keep
				// returning Z_STREAM_END instead of Z_BUFF_ERROR.
			} else if (strm.avail_in === 0 && flush <= old_flush && flush != Z_FINISH) {
				strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			// User must not provide more input after the first FINISH:
			if (status == FINISH_STATE && strm.avail_in !== 0) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			// Start a new block or continue the current one.
			if (strm.avail_in !== 0 || lookahead !== 0 || (flush != Z_NO_FLUSH && status != FINISH_STATE)) {
				bstate = -1;
				switch (config_table[level].func) {
					case STORED:
						bstate = deflate_stored(flush);
						break;
					case FAST:
						bstate = deflate_fast(flush);
						break;
					case SLOW:
						bstate = deflate_slow(flush);
						break;
				}

				if (bstate == FinishStarted || bstate == FinishDone) {
					status = FINISH_STATE;
				}
				if (bstate == NeedMore || bstate == FinishStarted) {
					if (strm.avail_out === 0) {
						last_flush = -1; // avoid BUF_ERROR next call, see above
					}
					return Z_OK;
					// If flush != Z_NO_FLUSH && avail_out === 0, the next call
					// of deflate should use the same flush parameter to make sure
					// that the flush is complete. So we don't have to output an
					// empty block here, this will be done at next call. This also
					// ensures that for a very small output buffer, we emit at most
					// one empty block.
				}

				if (bstate == BlockDone) {
					if (flush == Z_PARTIAL_FLUSH) {
						_tr_align();
					} else { // FULL_FLUSH or SYNC_FLUSH
						_tr_stored_block(0, 0, false);
						// For a full flush, this empty block will be recognized
						// as a special marker by inflate_sync().
						if (flush == Z_FULL_FLUSH) {
							// state.head[s.hash_size-1]=0;
							for (i = 0; i < hash_size/*-1*/; i++)
								// forget history
								head[i] = 0;
						}
					}
					strm.flush_pending();
					if (strm.avail_out === 0) {
						last_flush = -1; // avoid BUF_ERROR at next call, see above
						return Z_OK;
					}
				}
			}

			if (flush != Z_FINISH)
				return Z_OK;
			return Z_STREAM_END;
		};
	}

	// ZStream

	function ZStream() {
		const that = this;
		that.next_in_index = 0;
		that.next_out_index = 0;
		// that.next_in; // next input byte
		that.avail_in = 0; // number of bytes available at next_in
		that.total_in = 0; // total nb of input bytes read so far
		// that.next_out; // next output byte should be put there
		that.avail_out = 0; // remaining free space at next_out
		that.total_out = 0; // total nb of bytes output so far
		// that.msg;
		// that.dstate;
	}

	ZStream.prototype = {
		deflateInit: function (level, bits) {
			const that = this;
			that.dstate = new Deflate();
			if (!bits)
				bits = MAX_BITS;
			return that.dstate.deflateInit(that, level, bits);
		},

		deflate: function (flush) {
			const that = this;
			if (!that.dstate) {
				return Z_STREAM_ERROR;
			}
			return that.dstate.deflate(that, flush);
		},

		deflateEnd: function () {
			const that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			const ret = that.dstate.deflateEnd();
			that.dstate = null;
			return ret;
		},

		deflateParams: function (level, strategy) {
			const that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			return that.dstate.deflateParams(that, level, strategy);
		},

		deflateSetDictionary: function (dictionary, dictLength) {
			const that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			return that.dstate.deflateSetDictionary(that, dictionary, dictLength);
		},

		// Read a new buffer from the current input stream, update the
		// total number of bytes read. All deflate() input goes through
		// this function so some applications may wish to modify it to avoid
		// allocating a large strm->next_in buffer and copying from it.
		// (See also flush_pending()).
		read_buf: function (buf, start, size) {
			const that = this;
			let len = that.avail_in;
			if (len > size)
				len = size;
			if (len === 0)
				return 0;
			that.avail_in -= len;
			buf.set(that.next_in.subarray(that.next_in_index, that.next_in_index + len), start);
			that.next_in_index += len;
			that.total_in += len;
			return len;
		},

		// Flush as much pending output as possible. All deflate() output goes
		// through this function so some applications may wish to modify it
		// to avoid allocating a large strm->next_out buffer and copying into it.
		// (See also read_buf()).
		flush_pending: function () {
			const that = this;
			let len = that.dstate.pending;

			if (len > that.avail_out)
				len = that.avail_out;
			if (len === 0)
				return;

			// if (that.dstate.pending_buf.length <= that.dstate.pending_out || that.next_out.length <= that.next_out_index
			// || that.dstate.pending_buf.length < (that.dstate.pending_out + len) || that.next_out.length < (that.next_out_index +
			// len)) {
			// console.log(that.dstate.pending_buf.length + ", " + that.dstate.pending_out + ", " + that.next_out.length + ", " +
			// that.next_out_index + ", " + len);
			// console.log("avail_out=" + that.avail_out);
			// }

			that.next_out.set(that.dstate.pending_buf.subarray(that.dstate.pending_out, that.dstate.pending_out + len), that.next_out_index);

			that.next_out_index += len;
			that.dstate.pending_out += len;
			that.total_out += len;
			that.avail_out -= len;
			that.dstate.pending -= len;
			if (that.dstate.pending === 0) {
				that.dstate.pending_out = 0;
			}
		}
	};

	// Deflate

	function ZipDeflate(options) {
		const that = this;
		const z = new ZStream();
		const bufsize = 512;
		const flush = Z_NO_FLUSH;
		const buf = new Uint8Array(bufsize);
		let level = options ? options.level : Z_DEFAULT_COMPRESSION;
		if (typeof level == "undefined")
			level = Z_DEFAULT_COMPRESSION;
		z.deflateInit(level);
		z.next_out = buf;

		that.append = function (data, onprogress) {
			let err, array, lastIndex = 0, bufferIndex = 0, bufferSize = 0;
			const buffers = [];
			if (!data.length)
				return;
			z.next_in_index = 0;
			z.next_in = data;
			z.avail_in = data.length;
			do {
				z.next_out_index = 0;
				z.avail_out = bufsize;
				err = z.deflate(flush);
				if (err != Z_OK)
					throw new Error("deflating: " + z.msg);
				if (z.next_out_index)
					if (z.next_out_index == bufsize)
						buffers.push(new Uint8Array(buf));
					else
						buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
				bufferSize += z.next_out_index;
				if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
					onprogress(z.next_in_index);
					lastIndex = z.next_in_index;
				}
			} while (z.avail_in > 0 || z.avail_out === 0);
			array = new Uint8Array(bufferSize);
			buffers.forEach(function (chunk) {
				array.set(chunk, bufferIndex);
				bufferIndex += chunk.length;
			});
			return array;
		};
		that.flush = function () {
			let err, array, bufferIndex = 0, bufferSize = 0;
			const buffers = [];
			do {
				z.next_out_index = 0;
				z.avail_out = bufsize;
				err = z.deflate(Z_FINISH);
				if (err != Z_STREAM_END && err != Z_OK)
					throw new Error("deflating: " + z.msg);
				if (bufsize - z.avail_out > 0)
					buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
				bufferSize += z.next_out_index;
			} while (z.avail_in > 0 || z.avail_out === 0);
			z.deflateEnd();
			array = new Uint8Array(bufferSize);
			buffers.forEach(function (chunk) {
				array.set(chunk, bufferIndex);
				bufferIndex += chunk.length;
			});
			return array;
		};
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	// Global
	const MAX_BITS$1 = 15;

	const Z_OK$1 = 0;
	const Z_STREAM_END$1 = 1;
	const Z_NEED_DICT$1 = 2;
	const Z_STREAM_ERROR$1 = -2;
	const Z_DATA_ERROR$1 = -3;
	const Z_MEM_ERROR = -4;
	const Z_BUF_ERROR$1 = -5;

	const inflate_mask = [0x00000000, 0x00000001, 0x00000003, 0x00000007, 0x0000000f, 0x0000001f, 0x0000003f, 0x0000007f, 0x000000ff, 0x000001ff, 0x000003ff,
		0x000007ff, 0x00000fff, 0x00001fff, 0x00003fff, 0x00007fff, 0x0000ffff];

	const MANY = 1440;

	// JZlib version : "1.0.2"
	const Z_NO_FLUSH$1 = 0;
	const Z_FINISH$1 = 4;

	// InfTree
	const fixed_bl = 9;
	const fixed_bd = 5;

	const fixed_tl = [96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 192, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 160, 0, 8, 0,
		0, 8, 128, 0, 8, 64, 0, 9, 224, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 144, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 208, 81, 7, 17, 0, 8, 104, 0, 8, 40,
		0, 9, 176, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 240, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 200, 81, 7, 13,
		0, 8, 100, 0, 8, 36, 0, 9, 168, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 232, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 152, 84, 7, 83, 0, 8, 124, 0, 8, 60,
		0, 9, 216, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 184, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 248, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7,
		35, 0, 8, 114, 0, 8, 50, 0, 9, 196, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 164, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 228, 80, 7, 7, 0, 8, 90, 0, 8,
		26, 0, 9, 148, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 212, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 180, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 244, 80,
		7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 204, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 172, 0, 8, 6, 0, 8, 134, 0,
		8, 70, 0, 9, 236, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 156, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 220, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 188, 0,
		8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 252, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 194, 80, 7, 10, 0, 8, 97,
		0, 8, 33, 0, 9, 162, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 226, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 146, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 210,
		81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 178, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 242, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117,
		0, 8, 53, 0, 9, 202, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 170, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 234, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 154,
		84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 218, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 186, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 250, 80, 7, 3, 0, 8, 83,
		0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 198, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 166, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 230,
		80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 150, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 214, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 182, 0, 8, 11, 0, 8, 139,
		0, 8, 75, 0, 9, 246, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 206, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 174,
		0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 238, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 158, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 222, 82, 7, 27, 0, 8, 111,
		0, 8, 47, 0, 9, 190, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 254, 96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9,
		193, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 161, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 225, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 145, 83, 7, 59, 0, 8,
		120, 0, 8, 56, 0, 9, 209, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 177, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 241, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8,
		227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 201, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 169, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 233, 80, 7, 8, 0, 8,
		92, 0, 8, 28, 0, 9, 153, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 217, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 185, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9,
		249, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 197, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 165, 0, 8, 2, 0, 8,
		130, 0, 8, 66, 0, 9, 229, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 149, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 213, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9,
		181, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 245, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 205, 81, 7, 15, 0, 8,
		102, 0, 8, 38, 0, 9, 173, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 237, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 157, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9,
		221, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 189, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 253, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0,
		8, 113, 0, 8, 49, 0, 9, 195, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 163, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 227, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9,
		147, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 211, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 179, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 243, 80, 7, 4, 0, 8,
		85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 203, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 171, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9,
		235, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 155, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 219, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 187, 0, 8, 13, 0, 8,
		141, 0, 8, 77, 0, 9, 251, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 199, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9,
		167, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 231, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 151, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 215, 82, 7, 19, 0, 8,
		107, 0, 8, 43, 0, 9, 183, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 247, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9,
		207, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 175, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 239, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 159, 84, 7, 99, 0, 8,
		127, 0, 8, 63, 0, 9, 223, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 191, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 255];
	const fixed_td = [80, 5, 1, 87, 5, 257, 83, 5, 17, 91, 5, 4097, 81, 5, 5, 89, 5, 1025, 85, 5, 65, 93, 5, 16385, 80, 5, 3, 88, 5, 513, 84, 5, 33, 92, 5,
		8193, 82, 5, 9, 90, 5, 2049, 86, 5, 129, 192, 5, 24577, 80, 5, 2, 87, 5, 385, 83, 5, 25, 91, 5, 6145, 81, 5, 7, 89, 5, 1537, 85, 5, 97, 93, 5,
		24577, 80, 5, 4, 88, 5, 769, 84, 5, 49, 92, 5, 12289, 82, 5, 13, 90, 5, 3073, 86, 5, 193, 192, 5, 24577];

	// Tables for deflate from PKZIP's appnote.txt.
	const cplens = [ // Copy lengths for literal codes 257..285
		3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];

	// see note #13 above about 258
	const cplext = [ // Extra bits for literal codes 257..285
		0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 112, 112 // 112==invalid
	];

	const cpdist = [ // Copy offsets for distance codes 0..29
		1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];

	const cpdext = [ // Extra bits for distance codes
		0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

	// If BMAX needs to be larger than 16, then h and x[] should be uLong.
	const BMAX = 15; // maximum bit length of any code

	function InfTree() {
		const that = this;

		let hn; // hufts used in space
		let v; // work area for huft_build
		let c; // bit length count table
		let r; // table entry for structure assignment
		let u; // table stack
		let x; // bit offsets, then code stack

		function huft_build(b, // code lengths in bits (all assumed <=
			// BMAX)
			bindex, n, // number of codes (assumed <= 288)
			s, // number of simple-valued codes (0..s-1)
			d, // list of base values for non-simple codes
			e, // list of extra bits for non-simple codes
			t, // result: starting table
			m, // maximum lookup bits, returns actual
			hp,// space for trees
			hn,// hufts used in space
			v // working area: values in order of bit length
		) {
			// Given a list of code lengths and a maximum table size, make a set of
			// tables to decode that set of codes. Return Z_OK on success,
			// Z_BUF_ERROR
			// if the given code set is incomplete (the tables are still built in
			// this
			// case), Z_DATA_ERROR if the input is invalid (an over-subscribed set
			// of
			// lengths), or Z_MEM_ERROR if not enough memory.

			let a; // counter for codes of length k
			let f; // i repeats in table every f entries
			let g; // maximum code length
			let h; // table level
			let i; // counter, current code
			let j; // counter
			let k; // number of bits in current code
			let l; // bits per table (returned in m)
			let mask; // (1 << w) - 1, to avoid cc -O bug on HP
			let p; // pointer into c[], b[], or v[]
			let q; // points to current table
			let w; // bits before this table == (l * h)
			let xp; // pointer into x
			let y; // number of dummy codes added
			let z; // number of entries in current table

			// Generate counts for each bit length

			p = 0;
			i = n;
			do {
				c[b[bindex + p]]++;
				p++;
				i--; // assume all entries <= BMAX
			} while (i !== 0);

			if (c[0] == n) { // null input--all zero length codes
				t[0] = -1;
				m[0] = 0;
				return Z_OK$1;
			}

			// Find minimum and maximum length, bound *m by those
			l = m[0];
			for (j = 1; j <= BMAX; j++)
				if (c[j] !== 0)
					break;
			k = j; // minimum code length
			if (l < j) {
				l = j;
			}
			for (i = BMAX; i !== 0; i--) {
				if (c[i] !== 0)
					break;
			}
			g = i; // maximum code length
			if (l > i) {
				l = i;
			}
			m[0] = l;

			// Adjust last length count to fill out codes, if needed
			for (y = 1 << j; j < i; j++, y <<= 1) {
				if ((y -= c[j]) < 0) {
					return Z_DATA_ERROR$1;
				}
			}
			if ((y -= c[i]) < 0) {
				return Z_DATA_ERROR$1;
			}
			c[i] += y;

			// Generate starting offsets into the value table for each length
			x[1] = j = 0;
			p = 1;
			xp = 2;
			while (--i !== 0) { // note that i == g from above
				x[xp] = (j += c[p]);
				xp++;
				p++;
			}

			// Make a table of values in order of bit lengths
			i = 0;
			p = 0;
			do {
				if ((j = b[bindex + p]) !== 0) {
					v[x[j]++] = i;
				}
				p++;
			} while (++i < n);
			n = x[g]; // set n to length of v

			// Generate the Huffman codes and for each, make the table entries
			x[0] = i = 0; // first Huffman code is zero
			p = 0; // grab values in bit order
			h = -1; // no tables yet--level -1
			w = -l; // bits decoded == (l * h)
			u[0] = 0; // just to keep compilers happy
			q = 0; // ditto
			z = 0; // ditto

			// go through the bit lengths (k already is bits in shortest code)
			for (; k <= g; k++) {
				a = c[k];
				while (a-- !== 0) {
					// here i is the Huffman code of length k bits for value *p
					// make tables up to required level
					while (k > w + l) {
						h++;
						w += l; // previous table always l bits
						// compute minimum size table less than or equal to l bits
						z = g - w;
						z = (z > l) ? l : z; // table size upper limit
						if ((f = 1 << (j = k - w)) > a + 1) { // try a k-w bit table
							// too few codes for
							// k-w bit table
							f -= a + 1; // deduct codes from patterns left
							xp = k;
							if (j < z) {
								while (++j < z) { // try smaller tables up to z bits
									if ((f <<= 1) <= c[++xp])
										break; // enough codes to use up j bits
									f -= c[xp]; // else deduct codes from patterns
								}
							}
						}
						z = 1 << j; // table entries for j-bit table

						// allocate new table
						if (hn[0] + z > MANY) { // (note: doesn't matter for fixed)
							return Z_DATA_ERROR$1; // overflow of MANY
						}
						u[h] = q = /* hp+ */hn[0]; // DEBUG
						hn[0] += z;

						// connect to last table, if there is one
						if (h !== 0) {
							x[h] = i; // save pattern for backing up
							r[0] = /* (byte) */j; // bits in this table
							r[1] = /* (byte) */l; // bits to dump before this table
							j = i >>> (w - l);
							r[2] = /* (int) */(q - u[h - 1] - j); // offset to this table
							hp.set(r, (u[h - 1] + j) * 3);
							// to
							// last
							// table
						} else {
							t[0] = q; // first table is returned result
						}
					}

					// set up table entry in r
					r[1] = /* (byte) */(k - w);
					if (p >= n) {
						r[0] = 128 + 64; // out of values--invalid code
					} else if (v[p] < s) {
						r[0] = /* (byte) */(v[p] < 256 ? 0 : 32 + 64); // 256 is
						// end-of-block
						r[2] = v[p++]; // simple code is just the value
					} else {
						r[0] = /* (byte) */(e[v[p] - s] + 16 + 64); // non-simple--look
						// up in lists
						r[2] = d[v[p++] - s];
					}

					// fill code-like entries with r
					f = 1 << (k - w);
					for (j = i >>> w; j < z; j += f) {
						hp.set(r, (q + j) * 3);
					}

					// backwards increment the k-bit code i
					for (j = 1 << (k - 1); (i & j) !== 0; j >>>= 1) {
						i ^= j;
					}
					i ^= j;

					// backup over finished tables
					mask = (1 << w) - 1; // needed on HP, cc -O bug
					while ((i & mask) != x[h]) {
						h--; // don't need to update q
						w -= l;
						mask = (1 << w) - 1;
					}
				}
			}
			// Return Z_BUF_ERROR if we were given an incomplete table
			return y !== 0 && g != 1 ? Z_BUF_ERROR$1 : Z_OK$1;
		}

		function initWorkArea(vsize) {
			let i;
			if (!hn) {
				hn = []; // []; //new Array(1);
				v = []; // new Array(vsize);
				c = new Int32Array(BMAX + 1); // new Array(BMAX + 1);
				r = []; // new Array(3);
				u = new Int32Array(BMAX); // new Array(BMAX);
				x = new Int32Array(BMAX + 1); // new Array(BMAX + 1);
			}
			if (v.length < vsize) {
				v = []; // new Array(vsize);
			}
			for (i = 0; i < vsize; i++) {
				v[i] = 0;
			}
			for (i = 0; i < BMAX + 1; i++) {
				c[i] = 0;
			}
			for (i = 0; i < 3; i++) {
				r[i] = 0;
			}
			// for(int i=0; i<BMAX; i++){u[i]=0;}
			u.set(c.subarray(0, BMAX), 0);
			// for(int i=0; i<BMAX+1; i++){x[i]=0;}
			x.set(c.subarray(0, BMAX + 1), 0);
		}

		that.inflate_trees_bits = function (c, // 19 code lengths
			bb, // bits tree desired/actual depth
			tb, // bits tree result
			hp, // space for trees
			z // for messages
		) {
			let result;
			initWorkArea(19);
			hn[0] = 0;
			result = huft_build(c, 0, 19, 19, null, null, tb, bb, hp, hn, v);

			if (result == Z_DATA_ERROR$1) {
				z.msg = "oversubscribed dynamic bit lengths tree";
			} else if (result == Z_BUF_ERROR$1 || bb[0] === 0) {
				z.msg = "incomplete dynamic bit lengths tree";
				result = Z_DATA_ERROR$1;
			}
			return result;
		};

		that.inflate_trees_dynamic = function (nl, // number of literal/length codes
			nd, // number of distance codes
			c, // that many (total) code lengths
			bl, // literal desired/actual bit depth
			bd, // distance desired/actual bit depth
			tl, // literal/length tree result
			td, // distance tree result
			hp, // space for trees
			z // for messages
		) {
			let result;

			// build literal/length tree
			initWorkArea(288);
			hn[0] = 0;
			result = huft_build(c, 0, nl, 257, cplens, cplext, tl, bl, hp, hn, v);
			if (result != Z_OK$1 || bl[0] === 0) {
				if (result == Z_DATA_ERROR$1) {
					z.msg = "oversubscribed literal/length tree";
				} else if (result != Z_MEM_ERROR) {
					z.msg = "incomplete literal/length tree";
					result = Z_DATA_ERROR$1;
				}
				return result;
			}

			// build distance tree
			initWorkArea(288);
			result = huft_build(c, nl, nd, 0, cpdist, cpdext, td, bd, hp, hn, v);

			if (result != Z_OK$1 || (bd[0] === 0 && nl > 257)) {
				if (result == Z_DATA_ERROR$1) {
					z.msg = "oversubscribed distance tree";
				} else if (result == Z_BUF_ERROR$1) {
					z.msg = "incomplete distance tree";
					result = Z_DATA_ERROR$1;
				} else if (result != Z_MEM_ERROR) {
					z.msg = "empty distance tree with lengths";
					result = Z_DATA_ERROR$1;
				}
				return result;
			}

			return Z_OK$1;
		};

	}

	InfTree.inflate_trees_fixed = function (bl, // literal desired/actual bit depth
		bd, // distance desired/actual bit depth
		tl,// literal/length tree result
		td// distance tree result
	) {
		bl[0] = fixed_bl;
		bd[0] = fixed_bd;
		tl[0] = fixed_tl;
		td[0] = fixed_td;
		return Z_OK$1;
	};

	// InfCodes

	// waiting for "i:"=input,
	// "o:"=output,
	// "x:"=nothing
	const START = 0; // x: set up for LEN
	const LEN = 1; // i: get length/literal/eob next
	const LENEXT = 2; // i: getting length extra (have base)
	const DIST = 3; // i: get distance next
	const DISTEXT = 4;// i: getting distance extra
	const COPY = 5; // o: copying bytes in window, waiting
	// for space
	const LIT = 6; // o: got literal, waiting for output
	// space
	const WASH = 7; // o: got eob, possibly still output
	// waiting
	const END = 8; // x: got eob and all data flushed
	const BADCODE = 9;// x: got error

	function InfCodes() {
		const that = this;

		let mode; // current inflate_codes mode

		// mode dependent information
		let len = 0;

		let tree; // pointer into tree
		let tree_index = 0;
		let need = 0; // bits needed

		let lit = 0;

		// if EXT or COPY, where and how much
		let get = 0; // bits to get for extra
		let dist = 0; // distance back to copy from

		let lbits = 0; // ltree bits decoded per branch
		let dbits = 0; // dtree bits decoder per branch
		let ltree; // literal/length/eob tree
		let ltree_index = 0; // literal/length/eob tree
		let dtree; // distance tree
		let dtree_index = 0; // distance tree

		// Called with number of bytes left to write in window at least 258
		// (the maximum string length) and number of input bytes available
		// at least ten. The ten bytes are six bytes for the longest length/
		// distance pair plus four bytes for overloading the bit buffer.

		function inflate_fast(bl, bd, tl, tl_index, td, td_index, s, z) {
			let t; // temporary pointer
			let tp; // temporary pointer
			let tp_index; // temporary pointer
			let e; // extra bits or operation
			let b; // bit buffer
			let k; // bits in bit buffer
			let p; // input data pointer
			let n; // bytes available there
			let q; // output window write pointer
			let m; // bytes to end of window or read pointer
			let ml; // mask for literal/length tree
			let md; // mask for distance tree
			let c; // bytes to copy
			let d; // distance back to copy from
			let r; // copy source pointer

			let tp_index_t_3; // (tp_index+t)*3

			// load input, output, bit values
			p = z.next_in_index;
			n = z.avail_in;
			b = s.bitb;
			k = s.bitk;
			q = s.write;
			m = q < s.read ? s.read - q - 1 : s.end - q;

			// initialize masks
			ml = inflate_mask[bl];
			md = inflate_mask[bd];

			// do until not enough input or output space for fast loop
			do { // assume called with m >= 258 && n >= 10
				// get literal/length code
				while (k < (20)) { // max bits for literal/length code
					n--;
					b |= (z.read_byte(p++) & 0xff) << k;
					k += 8;
				}

				t = b & ml;
				tp = tl;
				tp_index = tl_index;
				tp_index_t_3 = (tp_index + t) * 3;
				if ((e = tp[tp_index_t_3]) === 0) {
					b >>= (tp[tp_index_t_3 + 1]);
					k -= (tp[tp_index_t_3 + 1]);

					s.window[q++] = /* (byte) */tp[tp_index_t_3 + 2];
					m--;
					continue;
				}
				do {

					b >>= (tp[tp_index_t_3 + 1]);
					k -= (tp[tp_index_t_3 + 1]);

					if ((e & 16) !== 0) {
						e &= 15;
						c = tp[tp_index_t_3 + 2] + (/* (int) */b & inflate_mask[e]);

						b >>= e;
						k -= e;

						// decode distance base of block to copy
						while (k < (15)) { // max bits for distance code
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						t = b & md;
						tp = td;
						tp_index = td_index;
						tp_index_t_3 = (tp_index + t) * 3;
						e = tp[tp_index_t_3];

						do {

							b >>= (tp[tp_index_t_3 + 1]);
							k -= (tp[tp_index_t_3 + 1]);

							if ((e & 16) !== 0) {
								// get extra bits to add to distance base
								e &= 15;
								while (k < (e)) { // get extra bits (up to 13)
									n--;
									b |= (z.read_byte(p++) & 0xff) << k;
									k += 8;
								}

								d = tp[tp_index_t_3 + 2] + (b & inflate_mask[e]);

								b >>= (e);
								k -= (e);

								// do the copy
								m -= c;
								if (q >= d) { // offset before dest
									// just copy
									r = q - d;
									if (q - r > 0 && 2 > (q - r)) {
										s.window[q++] = s.window[r++]; // minimum
										// count is
										// three,
										s.window[q++] = s.window[r++]; // so unroll
										// loop a
										// little
										c -= 2;
									} else {
										s.window.set(s.window.subarray(r, r + 2), q);
										q += 2;
										r += 2;
										c -= 2;
									}
								} else { // else offset after destination
									r = q - d;
									do {
										r += s.end; // force pointer in window
									} while (r < 0); // covers invalid distances
									e = s.end - r;
									if (c > e) { // if source crosses,
										c -= e; // wrapped copy
										if (q - r > 0 && e > (q - r)) {
											do {
												s.window[q++] = s.window[r++];
											} while (--e !== 0);
										} else {
											s.window.set(s.window.subarray(r, r + e), q);
											q += e;
											r += e;
											e = 0;
										}
										r = 0; // copy rest from start of window
									}

								}

								// copy all or what's left
								if (q - r > 0 && c > (q - r)) {
									do {
										s.window[q++] = s.window[r++];
									} while (--c !== 0);
								} else {
									s.window.set(s.window.subarray(r, r + c), q);
									q += c;
									r += c;
									c = 0;
								}
								break;
							} else if ((e & 64) === 0) {
								t += tp[tp_index_t_3 + 2];
								t += (b & inflate_mask[e]);
								tp_index_t_3 = (tp_index + t) * 3;
								e = tp[tp_index_t_3];
							} else {
								z.msg = "invalid distance code";

								c = z.avail_in - n;
								c = (k >> 3) < c ? k >> 3 : c;
								n += c;
								p -= c;
								k -= c << 3;

								s.bitb = b;
								s.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								s.write = q;

								return Z_DATA_ERROR$1;
							}
							// eslint-disable-next-line no-constant-condition
						} while (true);
						break;
					}

					if ((e & 64) === 0) {
						t += tp[tp_index_t_3 + 2];
						t += (b & inflate_mask[e]);
						tp_index_t_3 = (tp_index + t) * 3;
						if ((e = tp[tp_index_t_3]) === 0) {

							b >>= (tp[tp_index_t_3 + 1]);
							k -= (tp[tp_index_t_3 + 1]);

							s.window[q++] = /* (byte) */tp[tp_index_t_3 + 2];
							m--;
							break;
						}
					} else if ((e & 32) !== 0) {

						c = z.avail_in - n;
						c = (k >> 3) < c ? k >> 3 : c;
						n += c;
						p -= c;
						k -= c << 3;

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;

						return Z_STREAM_END$1;
					} else {
						z.msg = "invalid literal/length code";

						c = z.avail_in - n;
						c = (k >> 3) < c ? k >> 3 : c;
						n += c;
						p -= c;
						k -= c << 3;

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;

						return Z_DATA_ERROR$1;
					}
					// eslint-disable-next-line no-constant-condition
				} while (true);
			} while (m >= 258 && n >= 10);

			// not enough input or output--restore pointers and return
			c = z.avail_in - n;
			c = (k >> 3) < c ? k >> 3 : c;
			n += c;
			p -= c;
			k -= c << 3;

			s.bitb = b;
			s.bitk = k;
			z.avail_in = n;
			z.total_in += p - z.next_in_index;
			z.next_in_index = p;
			s.write = q;

			return Z_OK$1;
		}

		that.init = function (bl, bd, tl, tl_index, td, td_index) {
			mode = START;
			lbits = /* (byte) */bl;
			dbits = /* (byte) */bd;
			ltree = tl;
			ltree_index = tl_index;
			dtree = td;
			dtree_index = td_index;
			tree = null;
		};

		that.proc = function (s, z, r) {
			let j; // temporary storage
			let tindex; // temporary pointer
			let e; // extra bits or operation
			let b = 0; // bit buffer
			let k = 0; // bits in bit buffer
			let p = 0; // input data pointer
			let n; // bytes available there
			let q; // output window write pointer
			let m; // bytes to end of window or read pointer
			let f; // pointer to copy strings from

			// copy input/output information to locals (UPDATE macro restores)
			p = z.next_in_index;
			n = z.avail_in;
			b = s.bitb;
			k = s.bitk;
			q = s.write;
			m = q < s.read ? s.read - q - 1 : s.end - q;

			// process input and output based on current state
			// eslint-disable-next-line no-constant-condition
			while (true) {
				switch (mode) {
					// waiting for "i:"=input, "o:"=output, "x:"=nothing
					case START: // x: set up for LEN
						if (m >= 258 && n >= 10) {

							s.bitb = b;
							s.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							s.write = q;
							r = inflate_fast(lbits, dbits, ltree, ltree_index, dtree, dtree_index, s, z);

							p = z.next_in_index;
							n = z.avail_in;
							b = s.bitb;
							k = s.bitk;
							q = s.write;
							m = q < s.read ? s.read - q - 1 : s.end - q;

							if (r != Z_OK$1) {
								mode = r == Z_STREAM_END$1 ? WASH : BADCODE;
								break;
							}
						}
						need = lbits;
						tree = ltree;
						tree_index = ltree_index;

						mode = LEN;
					/* falls through */
					case LEN: // i: get length/literal/eob next
						j = need;

						while (k < (j)) {
							if (n !== 0)
								r = Z_OK$1;
							else {

								s.bitb = b;
								s.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								s.write = q;
								return s.inflate_flush(z, r);
							}
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						tindex = (tree_index + (b & inflate_mask[j])) * 3;

						b >>>= (tree[tindex + 1]);
						k -= (tree[tindex + 1]);

						e = tree[tindex];

						if (e === 0) { // literal
							lit = tree[tindex + 2];
							mode = LIT;
							break;
						}
						if ((e & 16) !== 0) { // length
							get = e & 15;
							len = tree[tindex + 2];
							mode = LENEXT;
							break;
						}
						if ((e & 64) === 0) { // next table
							need = e;
							tree_index = tindex / 3 + tree[tindex + 2];
							break;
						}
						if ((e & 32) !== 0) { // end of block
							mode = WASH;
							break;
						}
						mode = BADCODE; // invalid code
						z.msg = "invalid literal/length code";
						r = Z_DATA_ERROR$1;

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;
						return s.inflate_flush(z, r);

					case LENEXT: // i: getting length extra (have base)
						j = get;

						while (k < (j)) {
							if (n !== 0)
								r = Z_OK$1;
							else {

								s.bitb = b;
								s.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								s.write = q;
								return s.inflate_flush(z, r);
							}
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						len += (b & inflate_mask[j]);

						b >>= j;
						k -= j;

						need = dbits;
						tree = dtree;
						tree_index = dtree_index;
						mode = DIST;
					/* falls through */
					case DIST: // i: get distance next
						j = need;

						while (k < (j)) {
							if (n !== 0)
								r = Z_OK$1;
							else {

								s.bitb = b;
								s.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								s.write = q;
								return s.inflate_flush(z, r);
							}
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						tindex = (tree_index + (b & inflate_mask[j])) * 3;

						b >>= tree[tindex + 1];
						k -= tree[tindex + 1];

						e = (tree[tindex]);
						if ((e & 16) !== 0) { // distance
							get = e & 15;
							dist = tree[tindex + 2];
							mode = DISTEXT;
							break;
						}
						if ((e & 64) === 0) { // next table
							need = e;
							tree_index = tindex / 3 + tree[tindex + 2];
							break;
						}
						mode = BADCODE; // invalid code
						z.msg = "invalid distance code";
						r = Z_DATA_ERROR$1;

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;
						return s.inflate_flush(z, r);

					case DISTEXT: // i: getting distance extra
						j = get;

						while (k < (j)) {
							if (n !== 0)
								r = Z_OK$1;
							else {

								s.bitb = b;
								s.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								s.write = q;
								return s.inflate_flush(z, r);
							}
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						dist += (b & inflate_mask[j]);

						b >>= j;
						k -= j;

						mode = COPY;
					/* falls through */
					case COPY: // o: copying bytes in window, waiting for space
						f = q - dist;
						while (f < 0) { // modulo window size-"while" instead
							f += s.end; // of "if" handles invalid distances
						}
						while (len !== 0) {

							if (m === 0) {
								if (q == s.end && s.read !== 0) {
									q = 0;
									m = q < s.read ? s.read - q - 1 : s.end - q;
								}
								if (m === 0) {
									s.write = q;
									r = s.inflate_flush(z, r);
									q = s.write;
									m = q < s.read ? s.read - q - 1 : s.end - q;

									if (q == s.end && s.read !== 0) {
										q = 0;
										m = q < s.read ? s.read - q - 1 : s.end - q;
									}

									if (m === 0) {
										s.bitb = b;
										s.bitk = k;
										z.avail_in = n;
										z.total_in += p - z.next_in_index;
										z.next_in_index = p;
										s.write = q;
										return s.inflate_flush(z, r);
									}
								}
							}

							s.window[q++] = s.window[f++];
							m--;

							if (f == s.end)
								f = 0;
							len--;
						}
						mode = START;
						break;
					case LIT: // o: got literal, waiting for output space
						if (m === 0) {
							if (q == s.end && s.read !== 0) {
								q = 0;
								m = q < s.read ? s.read - q - 1 : s.end - q;
							}
							if (m === 0) {
								s.write = q;
								r = s.inflate_flush(z, r);
								q = s.write;
								m = q < s.read ? s.read - q - 1 : s.end - q;

								if (q == s.end && s.read !== 0) {
									q = 0;
									m = q < s.read ? s.read - q - 1 : s.end - q;
								}
								if (m === 0) {
									s.bitb = b;
									s.bitk = k;
									z.avail_in = n;
									z.total_in += p - z.next_in_index;
									z.next_in_index = p;
									s.write = q;
									return s.inflate_flush(z, r);
								}
							}
						}
						r = Z_OK$1;

						s.window[q++] = /* (byte) */lit;
						m--;

						mode = START;
						break;
					case WASH: // o: got eob, possibly more output
						if (k > 7) { // return unused byte, if any
							k -= 8;
							n++;
							p--; // can always return one
						}

						s.write = q;
						r = s.inflate_flush(z, r);
						q = s.write;
						m = q < s.read ? s.read - q - 1 : s.end - q;

						if (s.read != s.write) {
							s.bitb = b;
							s.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							s.write = q;
							return s.inflate_flush(z, r);
						}
						mode = END;
					/* falls through */
					case END:
						r = Z_STREAM_END$1;
						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;
						return s.inflate_flush(z, r);

					case BADCODE: // x: got error

						r = Z_DATA_ERROR$1;

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;
						return s.inflate_flush(z, r);

					default:
						r = Z_STREAM_ERROR$1;

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;
						return s.inflate_flush(z, r);
				}
			}
		};

		that.free = function () {
			// ZFREE(z, c);
		};

	}

	// InfBlocks

	// Table for deflate from PKZIP's appnote.txt.
	const border = [ // Order of the bit length code lengths
		16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

	const TYPE = 0; // get type bits (3, including end bit)
	const LENS = 1; // get lengths for stored
	const STORED$1 = 2;// processing stored block
	const TABLE = 3; // get table lengths
	const BTREE = 4; // get bit lengths tree for a dynamic
	// block
	const DTREE = 5; // get length, distance trees for a
	// dynamic block
	const CODES = 6; // processing fixed or dynamic block
	const DRY = 7; // output remaining window bytes
	const DONELOCKS = 8; // finished last block, done
	const BADBLOCKS = 9; // ot a data error--stuck here

	function InfBlocks(z, w) {
		const that = this;

		let mode = TYPE; // current inflate_block mode

		let left = 0; // if STORED, bytes left to copy

		let table = 0; // table lengths (14 bits)
		let index = 0; // index into blens (or border)
		let blens; // bit lengths of codes
		const bb = [0]; // bit length tree depth
		const tb = [0]; // bit length decoding tree

		const codes = new InfCodes(); // if CODES, current state

		let last = 0; // true if this block is the last block

		let hufts = new Int32Array(MANY * 3); // single malloc for tree space
		const check = 0; // check on output
		const inftree = new InfTree();

		that.bitk = 0; // bits in bit buffer
		that.bitb = 0; // bit buffer
		that.window = new Uint8Array(w); // sliding window
		that.end = w; // one byte after sliding window
		that.read = 0; // window read pointer
		that.write = 0; // window write pointer

		that.reset = function (z, c) {
			if (c)
				c[0] = check;
			// if (mode == BTREE || mode == DTREE) {
			// }
			if (mode == CODES) {
				codes.free(z);
			}
			mode = TYPE;
			that.bitk = 0;
			that.bitb = 0;
			that.read = that.write = 0;
		};

		that.reset(z, null);

		// copy as much as possible from the sliding window to the output area
		that.inflate_flush = function (z, r) {
			let n;
			let p;
			let q;

			// local copies of source and destination pointers
			p = z.next_out_index;
			q = that.read;

			// compute number of bytes to copy as far as end of window
			n = /* (int) */((q <= that.write ? that.write : that.end) - q);
			if (n > z.avail_out)
				n = z.avail_out;
			if (n !== 0 && r == Z_BUF_ERROR$1)
				r = Z_OK$1;

			// update counters
			z.avail_out -= n;
			z.total_out += n;

			// copy as far as end of window
			z.next_out.set(that.window.subarray(q, q + n), p);
			p += n;
			q += n;

			// see if more to copy at beginning of window
			if (q == that.end) {
				// wrap pointers
				q = 0;
				if (that.write == that.end)
					that.write = 0;

				// compute bytes to copy
				n = that.write - q;
				if (n > z.avail_out)
					n = z.avail_out;
				if (n !== 0 && r == Z_BUF_ERROR$1)
					r = Z_OK$1;

				// update counters
				z.avail_out -= n;
				z.total_out += n;

				// copy
				z.next_out.set(that.window.subarray(q, q + n), p);
				p += n;
				q += n;
			}

			// update pointers
			z.next_out_index = p;
			that.read = q;

			// done
			return r;
		};

		that.proc = function (z, r) {
			let t; // temporary storage
			let b; // bit buffer
			let k; // bits in bit buffer
			let p; // input data pointer
			let n; // bytes available there
			let q; // output window write pointer
			let m; // bytes to end of window or read pointer

			let i;

			// copy input/output information to locals (UPDATE macro restores)
			// {
			p = z.next_in_index;
			n = z.avail_in;
			b = that.bitb;
			k = that.bitk;
			// }
			// {
			q = that.write;
			m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
			// }

			// process input based on current state
			// DEBUG dtree
			// eslint-disable-next-line no-constant-condition
			while (true) {
				let bl, bd, tl, td, bl_, bd_, tl_, td_;
				switch (mode) {
					case TYPE:

						while (k < (3)) {
							if (n !== 0) {
								r = Z_OK$1;
							} else {
								that.bitb = b;
								that.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								that.write = q;
								return that.inflate_flush(z, r);
							}
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}
						t = /* (int) */(b & 7);
						last = t & 1;

						switch (t >>> 1) {
							case 0: // stored
								// {
								b >>>= (3);
								k -= (3);
								// }
								t = k & 7; // go to byte boundary

								// {
								b >>>= (t);
								k -= (t);
								// }
								mode = LENS; // get length of stored block
								break;
							case 1: // fixed
								// {
								bl = []; // new Array(1);
								bd = []; // new Array(1);
								tl = [[]]; // new Array(1);
								td = [[]]; // new Array(1);

								InfTree.inflate_trees_fixed(bl, bd, tl, td);
								codes.init(bl[0], bd[0], tl[0], 0, td[0], 0);
								// }

								// {
								b >>>= (3);
								k -= (3);
								// }

								mode = CODES;
								break;
							case 2: // dynamic

								// {
								b >>>= (3);
								k -= (3);
								// }

								mode = TABLE;
								break;
							case 3: // illegal

								// {
								b >>>= (3);
								k -= (3);
								// }
								mode = BADBLOCKS;
								z.msg = "invalid block type";
								r = Z_DATA_ERROR$1;

								that.bitb = b;
								that.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								that.write = q;
								return that.inflate_flush(z, r);
						}
						break;
					case LENS:

						while (k < (32)) {
							if (n !== 0) {
								r = Z_OK$1;
							} else {
								that.bitb = b;
								that.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								that.write = q;
								return that.inflate_flush(z, r);
							}
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						if ((((~b) >>> 16) & 0xffff) != (b & 0xffff)) {
							mode = BADBLOCKS;
							z.msg = "invalid stored block lengths";
							r = Z_DATA_ERROR$1;

							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}
						left = (b & 0xffff);
						b = k = 0; // dump bits
						mode = left !== 0 ? STORED$1 : (last !== 0 ? DRY : TYPE);
						break;
					case STORED$1:
						if (n === 0) {
							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}

						if (m === 0) {
							if (q == that.end && that.read !== 0) {
								q = 0;
								m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
							}
							if (m === 0) {
								that.write = q;
								r = that.inflate_flush(z, r);
								q = that.write;
								m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
								if (q == that.end && that.read !== 0) {
									q = 0;
									m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
								}
								if (m === 0) {
									that.bitb = b;
									that.bitk = k;
									z.avail_in = n;
									z.total_in += p - z.next_in_index;
									z.next_in_index = p;
									that.write = q;
									return that.inflate_flush(z, r);
								}
							}
						}
						r = Z_OK$1;

						t = left;
						if (t > n)
							t = n;
						if (t > m)
							t = m;
						that.window.set(z.read_buf(p, t), q);
						p += t;
						n -= t;
						q += t;
						m -= t;
						if ((left -= t) !== 0)
							break;
						mode = last !== 0 ? DRY : TYPE;
						break;
					case TABLE:

						while (k < (14)) {
							if (n !== 0) {
								r = Z_OK$1;
							} else {
								that.bitb = b;
								that.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								that.write = q;
								return that.inflate_flush(z, r);
							}

							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						table = t = (b & 0x3fff);
						if ((t & 0x1f) > 29 || ((t >> 5) & 0x1f) > 29) {
							mode = BADBLOCKS;
							z.msg = "too many length or distance symbols";
							r = Z_DATA_ERROR$1;

							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}
						t = 258 + (t & 0x1f) + ((t >> 5) & 0x1f);
						if (!blens || blens.length < t) {
							blens = []; // new Array(t);
						} else {
							for (i = 0; i < t; i++) {
								blens[i] = 0;
							}
						}

						// {
						b >>>= (14);
						k -= (14);
						// }

						index = 0;
						mode = BTREE;
					/* falls through */
					case BTREE:
						while (index < 4 + (table >>> 10)) {
							while (k < (3)) {
								if (n !== 0) {
									r = Z_OK$1;
								} else {
									that.bitb = b;
									that.bitk = k;
									z.avail_in = n;
									z.total_in += p - z.next_in_index;
									z.next_in_index = p;
									that.write = q;
									return that.inflate_flush(z, r);
								}
								n--;
								b |= (z.read_byte(p++) & 0xff) << k;
								k += 8;
							}

							blens[border[index++]] = b & 7;

							// {
							b >>>= (3);
							k -= (3);
							// }
						}

						while (index < 19) {
							blens[border[index++]] = 0;
						}

						bb[0] = 7;
						t = inftree.inflate_trees_bits(blens, bb, tb, hufts, z);
						if (t != Z_OK$1) {
							r = t;
							if (r == Z_DATA_ERROR$1) {
								blens = null;
								mode = BADBLOCKS;
							}

							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}

						index = 0;
						mode = DTREE;
					/* falls through */
					case DTREE:
						// eslint-disable-next-line no-constant-condition
						while (true) {
							t = table;
							if (index >= 258 + (t & 0x1f) + ((t >> 5) & 0x1f)) {
								break;
							}

							let j, c;

							t = bb[0];

							while (k < (t)) {
								if (n !== 0) {
									r = Z_OK$1;
								} else {
									that.bitb = b;
									that.bitk = k;
									z.avail_in = n;
									z.total_in += p - z.next_in_index;
									z.next_in_index = p;
									that.write = q;
									return that.inflate_flush(z, r);
								}
								n--;
								b |= (z.read_byte(p++) & 0xff) << k;
								k += 8;
							}

							// if (tb[0] == -1) {
							// System.err.println("null...");
							// }

							t = hufts[(tb[0] + (b & inflate_mask[t])) * 3 + 1];
							c = hufts[(tb[0] + (b & inflate_mask[t])) * 3 + 2];

							if (c < 16) {
								b >>>= (t);
								k -= (t);
								blens[index++] = c;
							} else { // c == 16..18
								i = c == 18 ? 7 : c - 14;
								j = c == 18 ? 11 : 3;

								while (k < (t + i)) {
									if (n !== 0) {
										r = Z_OK$1;
									} else {
										that.bitb = b;
										that.bitk = k;
										z.avail_in = n;
										z.total_in += p - z.next_in_index;
										z.next_in_index = p;
										that.write = q;
										return that.inflate_flush(z, r);
									}
									n--;
									b |= (z.read_byte(p++) & 0xff) << k;
									k += 8;
								}

								b >>>= (t);
								k -= (t);

								j += (b & inflate_mask[i]);

								b >>>= (i);
								k -= (i);

								i = index;
								t = table;
								if (i + j > 258 + (t & 0x1f) + ((t >> 5) & 0x1f) || (c == 16 && i < 1)) {
									blens = null;
									mode = BADBLOCKS;
									z.msg = "invalid bit length repeat";
									r = Z_DATA_ERROR$1;

									that.bitb = b;
									that.bitk = k;
									z.avail_in = n;
									z.total_in += p - z.next_in_index;
									z.next_in_index = p;
									that.write = q;
									return that.inflate_flush(z, r);
								}

								c = c == 16 ? blens[i - 1] : 0;
								do {
									blens[i++] = c;
								} while (--j !== 0);
								index = i;
							}
						}

						tb[0] = -1;
						// {
						bl_ = []; // new Array(1);
						bd_ = []; // new Array(1);
						tl_ = []; // new Array(1);
						td_ = []; // new Array(1);
						bl_[0] = 9; // must be <= 9 for lookahead assumptions
						bd_[0] = 6; // must be <= 9 for lookahead assumptions

						t = table;
						t = inftree.inflate_trees_dynamic(257 + (t & 0x1f), 1 + ((t >> 5) & 0x1f), blens, bl_, bd_, tl_, td_, hufts, z);

						if (t != Z_OK$1) {
							if (t == Z_DATA_ERROR$1) {
								blens = null;
								mode = BADBLOCKS;
							}
							r = t;

							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}
						codes.init(bl_[0], bd_[0], hufts, tl_[0], hufts, td_[0]);
						// }
						mode = CODES;
					/* falls through */
					case CODES:
						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;

						if ((r = codes.proc(that, z, r)) != Z_STREAM_END$1) {
							return that.inflate_flush(z, r);
						}
						r = Z_OK$1;
						codes.free(z);

						p = z.next_in_index;
						n = z.avail_in;
						b = that.bitb;
						k = that.bitk;
						q = that.write;
						m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);

						if (last === 0) {
							mode = TYPE;
							break;
						}
						mode = DRY;
					/* falls through */
					case DRY:
						that.write = q;
						r = that.inflate_flush(z, r);
						q = that.write;
						m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
						if (that.read != that.write) {
							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}
						mode = DONELOCKS;
					/* falls through */
					case DONELOCKS:
						r = Z_STREAM_END$1;

						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
					case BADBLOCKS:
						r = Z_DATA_ERROR$1;

						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);

					default:
						r = Z_STREAM_ERROR$1;

						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
				}
			}
		};

		that.free = function (z) {
			that.reset(z, null);
			that.window = null;
			hufts = null;
			// ZFREE(z, s);
		};

		that.set_dictionary = function (d, start, n) {
			that.window.set(d.subarray(start, start + n), 0);
			that.read = that.write = n;
		};

		// Returns true if inflate is currently at the end of a block generated
		// by Z_SYNC_FLUSH or Z_FULL_FLUSH.
		that.sync_point = function () {
			return mode == LENS ? 1 : 0;
		};

	}

	// Inflate

	// preset dictionary flag in zlib header
	const PRESET_DICT$1 = 0x20;

	const Z_DEFLATED$1 = 8;

	const METHOD = 0; // waiting for method byte
	const FLAG = 1; // waiting for flag byte
	const DICT4 = 2; // four dictionary check bytes to go
	const DICT3 = 3; // three dictionary check bytes to go
	const DICT2 = 4; // two dictionary check bytes to go
	const DICT1 = 5; // one dictionary check byte to go
	const DICT0 = 6; // waiting for inflateSetDictionary
	const BLOCKS = 7; // decompressing blocks
	const DONE = 12; // finished check, done
	const BAD = 13; // got an error--stay here

	const mark = [0, 0, 0xff, 0xff];

	function Inflate() {
		const that = this;

		that.mode = 0; // current inflate mode

		// mode dependent information
		that.method = 0; // if FLAGS, method byte

		// if CHECK, check values to compare
		that.was = [0]; // new Array(1); // computed check value
		that.need = 0; // stream check value

		// if BAD, inflateSync's marker bytes count
		that.marker = 0;

		// mode independent information
		that.wbits = 0; // log2(window size) (8..15, defaults to 15)

		// this.blocks; // current inflate_blocks state

		function inflateReset(z) {
			if (!z || !z.istate)
				return Z_STREAM_ERROR$1;

			z.total_in = z.total_out = 0;
			z.msg = null;
			z.istate.mode = BLOCKS;
			z.istate.blocks.reset(z, null);
			return Z_OK$1;
		}

		that.inflateEnd = function (z) {
			if (that.blocks)
				that.blocks.free(z);
			that.blocks = null;
			// ZFREE(z, z->state);
			return Z_OK$1;
		};

		that.inflateInit = function (z, w) {
			z.msg = null;
			that.blocks = null;

			// set window size
			if (w < 8 || w > 15) {
				that.inflateEnd(z);
				return Z_STREAM_ERROR$1;
			}
			that.wbits = w;

			z.istate.blocks = new InfBlocks(z, 1 << w);

			// reset state
			inflateReset(z);
			return Z_OK$1;
		};

		that.inflate = function (z, f) {
			let r;
			let b;

			if (!z || !z.istate || !z.next_in)
				return Z_STREAM_ERROR$1;
			const istate = z.istate;
			f = f == Z_FINISH$1 ? Z_BUF_ERROR$1 : Z_OK$1;
			r = Z_BUF_ERROR$1;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				switch (istate.mode) {
					case METHOD:

						if (z.avail_in === 0)
							return r;
						r = f;

						z.avail_in--;
						z.total_in++;
						if (((istate.method = z.read_byte(z.next_in_index++)) & 0xf) != Z_DEFLATED$1) {
							istate.mode = BAD;
							z.msg = "unknown compression method";
							istate.marker = 5; // can't try inflateSync
							break;
						}
						if ((istate.method >> 4) + 8 > istate.wbits) {
							istate.mode = BAD;
							z.msg = "invalid window size";
							istate.marker = 5; // can't try inflateSync
							break;
						}
						istate.mode = FLAG;
					/* falls through */
					case FLAG:

						if (z.avail_in === 0)
							return r;
						r = f;

						z.avail_in--;
						z.total_in++;
						b = (z.read_byte(z.next_in_index++)) & 0xff;

						if ((((istate.method << 8) + b) % 31) !== 0) {
							istate.mode = BAD;
							z.msg = "incorrect header check";
							istate.marker = 5; // can't try inflateSync
							break;
						}

						if ((b & PRESET_DICT$1) === 0) {
							istate.mode = BLOCKS;
							break;
						}
						istate.mode = DICT4;
					/* falls through */
					case DICT4:

						if (z.avail_in === 0)
							return r;
						r = f;

						z.avail_in--;
						z.total_in++;
						istate.need = ((z.read_byte(z.next_in_index++) & 0xff) << 24) & 0xff000000;
						istate.mode = DICT3;
					/* falls through */
					case DICT3:

						if (z.avail_in === 0)
							return r;
						r = f;

						z.avail_in--;
						z.total_in++;
						istate.need += ((z.read_byte(z.next_in_index++) & 0xff) << 16) & 0xff0000;
						istate.mode = DICT2;
					/* falls through */
					case DICT2:

						if (z.avail_in === 0)
							return r;
						r = f;

						z.avail_in--;
						z.total_in++;
						istate.need += ((z.read_byte(z.next_in_index++) & 0xff) << 8) & 0xff00;
						istate.mode = DICT1;
					/* falls through */
					case DICT1:

						if (z.avail_in === 0)
							return r;
						r = f;

						z.avail_in--;
						z.total_in++;
						istate.need += (z.read_byte(z.next_in_index++) & 0xff);
						istate.mode = DICT0;
						return Z_NEED_DICT$1;
					case DICT0:
						istate.mode = BAD;
						z.msg = "need dictionary";
						istate.marker = 0; // can try inflateSync
						return Z_STREAM_ERROR$1;
					case BLOCKS:

						r = istate.blocks.proc(z, r);
						if (r == Z_DATA_ERROR$1) {
							istate.mode = BAD;
							istate.marker = 0; // can try inflateSync
							break;
						}
						if (r == Z_OK$1) {
							r = f;
						}
						if (r != Z_STREAM_END$1) {
							return r;
						}
						r = f;
						istate.blocks.reset(z, istate.was);
						istate.mode = DONE;
					/* falls through */
					case DONE:
						return Z_STREAM_END$1;
					case BAD:
						return Z_DATA_ERROR$1;
					default:
						return Z_STREAM_ERROR$1;
				}
			}
		};

		that.inflateSetDictionary = function (z, dictionary, dictLength) {
			let index = 0, length = dictLength;
			if (!z || !z.istate || z.istate.mode != DICT0)
				return Z_STREAM_ERROR$1;
			const istate = z.istate;
			if (length >= (1 << istate.wbits)) {
				length = (1 << istate.wbits) - 1;
				index = dictLength - length;
			}
			istate.blocks.set_dictionary(dictionary, index, length);
			istate.mode = BLOCKS;
			return Z_OK$1;
		};

		that.inflateSync = function (z) {
			let n; // number of bytes to look at
			let p; // pointer to bytes
			let m; // number of marker bytes found in a row
			let r, w; // temporaries to save total_in and total_out

			// set up
			if (!z || !z.istate)
				return Z_STREAM_ERROR$1;
			const istate = z.istate;
			if (istate.mode != BAD) {
				istate.mode = BAD;
				istate.marker = 0;
			}
			if ((n = z.avail_in) === 0)
				return Z_BUF_ERROR$1;
			p = z.next_in_index;
			m = istate.marker;

			// search
			while (n !== 0 && m < 4) {
				if (z.read_byte(p) == mark[m]) {
					m++;
				} else if (z.read_byte(p) !== 0) {
					m = 0;
				} else {
					m = 4 - m;
				}
				p++;
				n--;
			}

			// restore
			z.total_in += p - z.next_in_index;
			z.next_in_index = p;
			z.avail_in = n;
			istate.marker = m;

			// return no joy or set up to restart on a new block
			if (m != 4) {
				return Z_DATA_ERROR$1;
			}
			r = z.total_in;
			w = z.total_out;
			inflateReset(z);
			z.total_in = r;
			z.total_out = w;
			istate.mode = BLOCKS;
			return Z_OK$1;
		};

		// Returns true if inflate is currently at the end of a block generated
		// by Z_SYNC_FLUSH or Z_FULL_FLUSH. This function is used by one PPP
		// implementation to provide an additional safety check. PPP uses
		// Z_SYNC_FLUSH
		// but removes the length bytes of the resulting empty stored block. When
		// decompressing, PPP checks that at the end of input packet, inflate is
		// waiting for these length bytes.
		that.inflateSyncPoint = function (z) {
			if (!z || !z.istate || !z.istate.blocks)
				return Z_STREAM_ERROR$1;
			return z.istate.blocks.sync_point();
		};
	}

	// ZStream

	function ZStream$1() {
	}

	ZStream$1.prototype = {
		inflateInit: function (bits) {
			const that = this;
			that.istate = new Inflate();
			if (!bits)
				bits = MAX_BITS$1;
			return that.istate.inflateInit(that, bits);
		},

		inflate: function (f) {
			const that = this;
			if (!that.istate)
				return Z_STREAM_ERROR$1;
			return that.istate.inflate(that, f);
		},

		inflateEnd: function () {
			const that = this;
			if (!that.istate)
				return Z_STREAM_ERROR$1;
			const ret = that.istate.inflateEnd(that);
			that.istate = null;
			return ret;
		},

		inflateSync: function () {
			const that = this;
			if (!that.istate)
				return Z_STREAM_ERROR$1;
			return that.istate.inflateSync(that);
		},
		inflateSetDictionary: function (dictionary, dictLength) {
			const that = this;
			if (!that.istate)
				return Z_STREAM_ERROR$1;
			return that.istate.inflateSetDictionary(that, dictionary, dictLength);
		},
		read_byte: function (start) {
			const that = this;
			return that.next_in.subarray(start, start + 1)[0];
		},
		read_buf: function (start, size) {
			const that = this;
			return that.next_in.subarray(start, start + size);
		}
	};

	// Inflater

	function ZipInflate() {
		const that = this;
		const z = new ZStream$1();
		const bufsize = 512;
		const flush = Z_NO_FLUSH$1;
		const buf = new Uint8Array(bufsize);
		let nomoreinput = false;

		z.inflateInit();
		z.next_out = buf;

		that.append = function (data, onprogress) {
			const buffers = [];
			let err, array, lastIndex = 0, bufferIndex = 0, bufferSize = 0;
			if (data.length === 0)
				return;
			z.next_in_index = 0;
			z.next_in = data;
			z.avail_in = data.length;
			do {
				z.next_out_index = 0;
				z.avail_out = bufsize;
				if ((z.avail_in === 0) && (!nomoreinput)) { // if buffer is empty and more input is available, refill it
					z.next_in_index = 0;
					nomoreinput = true;
				}
				err = z.inflate(flush);
				if (nomoreinput && (err === Z_BUF_ERROR$1)) {
					if (z.avail_in !== 0)
						throw new Error("inflating: bad input");
				} else if (err !== Z_OK$1 && err !== Z_STREAM_END$1)
					throw new Error("inflating: " + z.msg);
				if ((nomoreinput || err === Z_STREAM_END$1) && (z.avail_in === data.length))
					throw new Error("inflating: bad input");
				if (z.next_out_index)
					if (z.next_out_index === bufsize)
						buffers.push(new Uint8Array(buf));
					else
						buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
				bufferSize += z.next_out_index;
				if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
					onprogress(z.next_in_index);
					lastIndex = z.next_in_index;
				}
			} while (z.avail_in > 0 || z.avail_out === 0);
			array = new Uint8Array(bufferSize);
			buffers.forEach(function (chunk) {
				array.set(chunk, bufferIndex);
				bufferIndex += chunk.length;
			});
			return array;
		};
		that.flush = function () {
			z.inflateEnd();
		};
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const DEFAULT_CONFIGURATION = {
		chunkSize: 512 * 1024,
		maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2,
		useWebWorkers: true,
		workerScripts: undefined
	};

	let config = Object.assign({}, DEFAULT_CONFIGURATION);

	function getConfiguration() {
		return config;
	}

	function configure(configuration) {
		if (configuration.chunkSize !== undefined) {
			config.chunkSize = configuration.chunkSize;
		}
		if (configuration.maxWorkers !== undefined) {
			config.maxWorkers = configuration.maxWorkers;
		}
		if (configuration.useWebWorkers !== undefined) {
			config.useWebWorkers = configuration.useWebWorkers;
		}
		if (configuration.Deflate !== undefined) {
			config.Deflate = configuration.Deflate;
		}
		if (configuration.Inflate !== undefined) {
			config.Inflate = configuration.Inflate;
		}
		if (configuration.workerScripts !== undefined) {
			if (configuration.workerScripts.deflate) {
				if (!Array.isArray(configuration.workerScripts.deflate)) {
					throw new Error("workerScripts.deflate must be an array");
				}
				if (!config.workerScripts) {
					config.workerScripts = {};
				}
				config.workerScripts.deflate = configuration.workerScripts.deflate;
			}
			if (configuration.workerScripts.inflate) {
				if (!Array.isArray(configuration.workerScripts.inflate)) {
					throw new Error("workerScripts.inflate must be an array");
				}
				if (!config.workerScripts) {
					config.workerScripts = {};
				}
				config.workerScripts.inflate = configuration.workerScripts.inflate;
			}
		}
	}

	var configureWebWorker = ()=>{if("function"==typeof URL.createObjectURL){const e=(()=>{const t=[];for(let e=0;e<256;e++){let n=e;for(let t=0;t<8;t++)1&n?n=n>>>1^3988292384:n>>>=1;t[e]=n;}class e{constructor(){this.crc=-1;}append(e){let n=0|this.crc;for(let i=0,a=0|e.length;i<a;i++)n=n>>>8^t[255&(n^e[i])];this.crc=n;}get(){return ~this.crc}}const n={name:"PBKDF2"},i={name:"HMAC"},a={name:"AES-CTR"},r=Object.assign({hash:i},n),s=Object.assign({iterations:1e3,hash:{name:"SHA-1"}},n),o=Object.assign({hash:"SHA-1"},i),l=Object.assign({length:16},a),_=["deriveBits"],d=["sign"],u=[8,12,16],f=[16,24,32],c=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],h=crypto.subtle;class b{constructor(t,e,n){this.password=t,this.signed=e,this.strength=n-1,this.input=e&&new Uint8Array(0),this.pendingInput=new Uint8Array(0);}async append(t){const e=async(a=0)=>{if(a+16<=i.length-10){const t=i.subarray(a,a+16),r=await h.decrypt(Object.assign({counter:this.counter},l),this.keys.key,t);return p(this.counter),n.set(new Uint8Array(r),a),e(a+16)}return this.pendingInput=i.subarray(a),this.signed&&(this.input=g(this.input,t)),n};if(this.password){const e=t.subarray(0,u[this.strength]+2);await async function(t,e,n){await x(t,n,e.subarray(0,u[t.strength]),["decrypt"]);const i=e.subarray(u[t.strength]),a=t.keys.passwordVerification;if(a[0]!=i[0]||a[1]!=i[1])throw new Error("Invalid pasword")}(this,e,this.password),this.password=null,t=t.subarray(u[this.strength]+2);}let n=new Uint8Array(t.length-10-(t.length-10)%16),i=t;return this.pendingInput.length&&(i=g(this.pendingInput,t),n=y(n,i.length-10-(i.length-10)%16)),e()}async flush(){const t=this.pendingInput,e=this.keys,n=t.subarray(0,t.length-10),a=t.subarray(t.length-10);let r=new Uint8Array(0);if(n.length){const t=await h.decrypt(Object.assign({counter:this.counter},l),e.key,n);r=new Uint8Array(t);}let s=!0;if(this.signed){const t=await h.sign(i,e.authentication,this.input.subarray(0,this.input.length-10)),n=new Uint8Array(t);this.input=null;for(let t=0;t<10;t++)n[t]!=a[t]&&(s=!1);}return {valid:s,data:r}}}class w{constructor(t,e){this.password=t,this.strength=e-1,this.output=new Uint8Array(0),this.pendingInput=new Uint8Array(0);}async append(t){const e=async(a=0)=>{if(a+16<=t.length){const r=t.subarray(a,a+16),s=await h.encrypt(Object.assign({counter:this.counter},l),this.keys.key,r);return p(this.counter),i.set(new Uint8Array(s),a+n.length),e(a+16)}return this.pendingInput=t.subarray(a),this.output=g(this.output,i),i};let n=new Uint8Array(0);this.password&&(n=await async function(t,e){const n=crypto.getRandomValues(new Uint8Array(u[t.strength]));return await x(t,e,n,["encrypt"]),g(n,t.keys.passwordVerification)}(this,this.password),this.password=null);let i=new Uint8Array(n.length+t.length-t.length%16);return i.set(n,0),this.pendingInput.length&&(t=g(this.pendingInput,t),i=y(i,t.length-t.length%16)),e()}async flush(){let t=new Uint8Array(0);if(this.pendingInput.length){const e=await h.encrypt(Object.assign({counter:this.counter},l),this.keys.key,this.pendingInput);t=new Uint8Array(e),this.output=g(this.output,t);}const e=await h.sign(i,this.keys.authentication,this.output.subarray(u[this.strength]+2));this.output=null;const n=new Uint8Array(e).subarray(0,10);return {data:g(t,n),signature:n}}}async function x(t,e,n,i){t.counter=new Uint8Array(c);const l=(new TextEncoder).encode(e),u=await h.importKey("raw",l,r,!1,_),b=await h.deriveBits(Object.assign({salt:n},s),u,8*(2*f[t.strength]+2)),w=new Uint8Array(b);t.keys={key:await h.importKey("raw",w.subarray(0,f[t.strength]),a,!0,i),authentication:await h.importKey("raw",w.subarray(f[t.strength],2*f[t.strength]),o,!1,d),passwordVerification:w.subarray(2*f[t.strength])};}function p(t){for(let e=0;e<16;e++){if(255!=t[e]){t[e]++;break}t[e]=0;}}function g(t,e){let n=t;return t.length+e.length&&(n=new Uint8Array(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function y(t,e){if(e&&e>t.length){const n=t;(t=new Uint8Array(e)).set(n,0);}return t}class v{constructor(t){this.signature=t.inputSignature,this.encrypted=Boolean(t.inputPassword),this.signed=t.inputSigned,this.compressed=t.inputCompressed,this.inflate=t.inputCompressed&&new t.codecConstructor,this.crc32=t.inputSigned&&new e,this.decrypt=this.encrypted&&new b(t.inputPassword,t.inputSigned,t.inputEncryptionStrength);}async append(t){return this.encrypted&&(t=await this.decrypt.append(t)),this.compressed&&t.length&&(t=await this.inflate.append(t)),!this.encrypted&&this.signed&&this.crc32.append(t),t}async flush(){let t,e=new Uint8Array(0);if(this.encrypted){const t=await this.decrypt.flush();if(!t.valid)throw new Error("Invalid signature");e=t.data;}else if(this.signed){const e=new DataView(new Uint8Array(4).buffer);if(t=this.crc32.get(),e.setUint32(0,t),this.signature!=e.getUint32(0,!1))throw new Error("Invalid signature")}return this.compressed&&(e=await this.inflate.append(e)||new Uint8Array(0),await this.inflate.flush()),{data:e,signature:t}}}class m{constructor(t){this.encrypted=t.outputEncrypted,this.signed=t.outputSigned,this.compressed=t.outputCompressed,this.deflate=t.outputCompressed&&new t.codecConstructor({level:t.level||5}),this.crc32=t.outputSigned&&new e,this.encrypt=this.encrypted&&new w(t.outputPassword,t.outputEncryptionStrength);}async append(t){let e=t;return this.compressed&&t.length&&(e=await this.deflate.append(t)),this.encrypted?e=await this.encrypt.append(e):this.signed&&this.crc32.append(t),e}async flush(){let t,e=new Uint8Array(0);if(this.compressed&&(e=await this.deflate.flush()||new Uint8Array(0)),this.encrypted){e=await this.encrypt.append(e);const n=await this.encrypt.flush();t=n.signature;const i=new Uint8Array(e.length+n.data.length);i.set(e,0),i.set(n.data,e.length),e=i;}else this.signed&&(t=this.crc32.get());return {data:e,signature:t}}}const k={init(t){t.scripts&&t.scripts.length&&importScripts.apply(void 0,t.scripts);const e=t.options;self.initCodec&&self.initCodec(),e.codecType.startsWith("deflate")?e.codecConstructor=self.Deflate:e.codecType.startsWith("inflate")&&(e.codecConstructor=self.Inflate),A=function(t){return t.codecType.startsWith("deflate")?new m(t):t.codecType.startsWith("inflate")?new v(t):void 0}(e);},append:async t=>({data:await A.append(t.data)}),flush:()=>A.flush()};let A;function U(t){return t.map((([t,e])=>new Array(t).fill(e,0,t))).flat()}addEventListener("message",(async t=>{const e=t.data,n=e.type,i=k[n];if(i)try{const t=await i(e)||{};if(t.type=n,t.data)try{postMessage(t,[t.data.buffer]);}catch(e){postMessage(t);}else postMessage(t);}catch(t){postMessage({type:n,error:{message:t.message,stack:t.stack}});}}));const I=[0,1,2,3].concat(...U([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function E(){const t=this;function e(t,e){let n=0;do{n|=1&t,t>>>=1,n<<=1;}while(--e>0);return n>>>1}t.build_tree=function(n){const i=t.dyn_tree,a=t.stat_desc.static_tree,r=t.stat_desc.elems;let s,o,l,_=-1;for(n.heap_len=0,n.heap_max=573,s=0;s<r;s++)0!==i[2*s]?(n.heap[++n.heap_len]=_=s,n.depth[s]=0):i[2*s+1]=0;for(;n.heap_len<2;)l=n.heap[++n.heap_len]=_<2?++_:0,i[2*l]=1,n.depth[l]=0,n.opt_len--,a&&(n.static_len-=a[2*l+1]);for(t.max_code=_,s=Math.floor(n.heap_len/2);s>=1;s--)n.pqdownheap(i,s);l=r;do{s=n.heap[1],n.heap[1]=n.heap[n.heap_len--],n.pqdownheap(i,1),o=n.heap[1],n.heap[--n.heap_max]=s,n.heap[--n.heap_max]=o,i[2*l]=i[2*s]+i[2*o],n.depth[l]=Math.max(n.depth[s],n.depth[o])+1,i[2*s+1]=i[2*o+1]=l,n.heap[1]=l++,n.pqdownheap(i,1);}while(n.heap_len>=2);n.heap[--n.heap_max]=n.heap[1],function(e){const n=t.dyn_tree,i=t.stat_desc.static_tree,a=t.stat_desc.extra_bits,r=t.stat_desc.extra_base,s=t.stat_desc.max_length;let o,l,_,d,u,f,c=0;for(d=0;d<=15;d++)e.bl_count[d]=0;for(n[2*e.heap[e.heap_max]+1]=0,o=e.heap_max+1;o<573;o++)l=e.heap[o],d=n[2*n[2*l+1]+1]+1,d>s&&(d=s,c++),n[2*l+1]=d,l>t.max_code||(e.bl_count[d]++,u=0,l>=r&&(u=a[l-r]),f=n[2*l],e.opt_len+=f*(d+u),i&&(e.static_len+=f*(i[2*l+1]+u)));if(0!==c){do{for(d=s-1;0===e.bl_count[d];)d--;e.bl_count[d]--,e.bl_count[d+1]+=2,e.bl_count[s]--,c-=2;}while(c>0);for(d=s;0!==d;d--)for(l=e.bl_count[d];0!==l;)_=e.heap[--o],_>t.max_code||(n[2*_+1]!=d&&(e.opt_len+=(d-n[2*_+1])*n[2*_],n[2*_+1]=d),l--);}}(n),function(t,n,i){const a=[];let r,s,o,l=0;for(r=1;r<=15;r++)a[r]=l=l+i[r-1]<<1;for(s=0;s<=n;s++)o=t[2*s+1],0!==o&&(t[2*s]=e(a[o]++,o));}(i,t.max_code,n.bl_count);};}function S(t,e,n,i,a){const r=this;r.static_tree=t,r.extra_bits=e,r.extra_base=n,r.elems=i,r.max_length=a;}function j(t,e,n,i,a){const r=this;r.good_length=t,r.max_lazy=e,r.nice_length=n,r.max_chain=i,r.func=a;}E._length_code=[0,1,2,3,4,5,6,7].concat(...U([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),E.base_length=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],E.base_dist=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],E.d_code=function(t){return t<256?I[t]:I[256+(t>>>7)]},E.extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],E.extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],E.extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],E.bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],S.static_ltree=[12,8,140,8,76,8,204,8,44,8,172,8,108,8,236,8,28,8,156,8,92,8,220,8,60,8,188,8,124,8,252,8,2,8,130,8,66,8,194,8,34,8,162,8,98,8,226,8,18,8,146,8,82,8,210,8,50,8,178,8,114,8,242,8,10,8,138,8,74,8,202,8,42,8,170,8,106,8,234,8,26,8,154,8,90,8,218,8,58,8,186,8,122,8,250,8,6,8,134,8,70,8,198,8,38,8,166,8,102,8,230,8,22,8,150,8,86,8,214,8,54,8,182,8,118,8,246,8,14,8,142,8,78,8,206,8,46,8,174,8,110,8,238,8,30,8,158,8,94,8,222,8,62,8,190,8,126,8,254,8,1,8,129,8,65,8,193,8,33,8,161,8,97,8,225,8,17,8,145,8,81,8,209,8,49,8,177,8,113,8,241,8,9,8,137,8,73,8,201,8,41,8,169,8,105,8,233,8,25,8,153,8,89,8,217,8,57,8,185,8,121,8,249,8,5,8,133,8,69,8,197,8,37,8,165,8,101,8,229,8,21,8,149,8,85,8,213,8,53,8,181,8,117,8,245,8,13,8,141,8,77,8,205,8,45,8,173,8,109,8,237,8,29,8,157,8,93,8,221,8,61,8,189,8,125,8,253,8,19,9,275,9,147,9,403,9,83,9,339,9,211,9,467,9,51,9,307,9,179,9,435,9,115,9,371,9,243,9,499,9,11,9,267,9,139,9,395,9,75,9,331,9,203,9,459,9,43,9,299,9,171,9,427,9,107,9,363,9,235,9,491,9,27,9,283,9,155,9,411,9,91,9,347,9,219,9,475,9,59,9,315,9,187,9,443,9,123,9,379,9,251,9,507,9,7,9,263,9,135,9,391,9,71,9,327,9,199,9,455,9,39,9,295,9,167,9,423,9,103,9,359,9,231,9,487,9,23,9,279,9,151,9,407,9,87,9,343,9,215,9,471,9,55,9,311,9,183,9,439,9,119,9,375,9,247,9,503,9,15,9,271,9,143,9,399,9,79,9,335,9,207,9,463,9,47,9,303,9,175,9,431,9,111,9,367,9,239,9,495,9,31,9,287,9,159,9,415,9,95,9,351,9,223,9,479,9,63,9,319,9,191,9,447,9,127,9,383,9,255,9,511,9,0,7,64,7,32,7,96,7,16,7,80,7,48,7,112,7,8,7,72,7,40,7,104,7,24,7,88,7,56,7,120,7,4,7,68,7,36,7,100,7,20,7,84,7,52,7,116,7,3,8,131,8,67,8,195,8,35,8,163,8,99,8,227,8],S.static_dtree=[0,5,16,5,8,5,24,5,4,5,20,5,12,5,28,5,2,5,18,5,10,5,26,5,6,5,22,5,14,5,30,5,1,5,17,5,9,5,25,5,5,5,21,5,13,5,29,5,3,5,19,5,11,5,27,5,7,5,23,5],S.static_l_desc=new S(S.static_ltree,E.extra_lbits,257,286,15),S.static_d_desc=new S(S.static_dtree,E.extra_dbits,0,30,15),S.static_bl_desc=new S(null,E.extra_blbits,0,19,7);const C=[new j(0,0,0,0,0),new j(4,4,8,4,1),new j(4,5,16,8,1),new j(4,6,32,32,1),new j(4,4,16,16,2),new j(8,16,32,32,2),new j(8,16,128,128,2),new j(8,32,128,256,2),new j(32,128,258,1024,2),new j(32,258,258,4096,2)],M=["need dictionary","stream end","","","stream error","data error","","buffer error","",""];function O(t,e,n,i){const a=t[2*e],r=t[2*n];return a<r||a==r&&i[e]<=i[n]}function D(){const t=this;let e,n,i,a,r,s,o,l,_,d,u,f,c,h,b,w,x,p,g,y,v,m,k,A,U,I,j,D,P,R,T,B,L;const V=new E,q=new E,z=new E;let K,W,H,F,G,J,N,Q;function X(){let e;for(e=0;e<286;e++)T[2*e]=0;for(e=0;e<30;e++)B[2*e]=0;for(e=0;e<19;e++)L[2*e]=0;T[512]=1,t.opt_len=t.static_len=0,H=G=0;}function Y(t,e){let n,i=-1,a=t[1],r=0,s=7,o=4;0===a&&(s=138,o=3),t[2*(e+1)+1]=65535;for(let l=0;l<=e;l++)n=a,a=t[2*(l+1)+1],++r<s&&n==a||(r<o?L[2*n]+=r:0!==n?(n!=i&&L[2*n]++,L[32]++):r<=10?L[34]++:L[36]++,r=0,i=n,0===a?(s=138,o=3):n==a?(s=6,o=3):(s=7,o=4));}function Z(e){t.pending_buf[t.pending++]=e;}function $(t){Z(255&t),Z(t>>>8&255);}function tt(t,e){let n;const i=e;Q>16-i?(n=t,N|=n<<Q&65535,$(N),N=n>>>16-Q,Q+=i-16):(N|=t<<Q&65535,Q+=i);}function et(t,e){const n=2*t;tt(65535&e[n],65535&e[n+1]);}function nt(t,e){let n,i,a=-1,r=t[1],s=0,o=7,l=4;for(0===r&&(o=138,l=3),n=0;n<=e;n++)if(i=r,r=t[2*(n+1)+1],!(++s<o&&i==r)){if(s<l)do{et(i,L);}while(0!=--s);else 0!==i?(i!=a&&(et(i,L),s--),et(16,L),tt(s-3,2)):s<=10?(et(17,L),tt(s-3,3)):(et(18,L),tt(s-11,7));s=0,a=i,0===r?(o=138,l=3):i==r?(o=6,l=3):(o=7,l=4);}}function it(){16==Q?($(N),N=0,Q=0):Q>=8&&(Z(255&N),N>>>=8,Q-=8);}function at(e,n){let i,a,r;if(t.pending_buf[F+2*H]=e>>>8&255,t.pending_buf[F+2*H+1]=255&e,t.pending_buf[K+H]=255&n,H++,0===e?T[2*n]++:(G++,e--,T[2*(E._length_code[n]+256+1)]++,B[2*E.d_code(e)]++),0==(8191&H)&&j>2){for(i=8*H,a=v-x,r=0;r<30;r++)i+=B[2*r]*(5+E.extra_dbits[r]);if(i>>>=3,G<Math.floor(H/2)&&i<Math.floor(a/2))return !0}return H==W-1}function rt(e,n){let i,a,r,s,o=0;if(0!==H)do{i=t.pending_buf[F+2*o]<<8&65280|255&t.pending_buf[F+2*o+1],a=255&t.pending_buf[K+o],o++,0===i?et(a,e):(r=E._length_code[a],et(r+256+1,e),s=E.extra_lbits[r],0!==s&&(a-=E.base_length[r],tt(a,s)),i--,r=E.d_code(i),et(r,n),s=E.extra_dbits[r],0!==s&&(i-=E.base_dist[r],tt(i,s)));}while(o<H);et(256,e),J=e[513];}function st(){Q>8?$(N):Q>0&&Z(255&N),N=0,Q=0;}function ot(e,n,i){tt(0+(i?1:0),3),function(e,n,i){st(),J=8,$(n),$(~n),t.pending_buf.set(l.subarray(e,e+n),t.pending),t.pending+=n;}(e,n);}function lt(e,n,i){let a,r,s=0;j>0?(V.build_tree(t),q.build_tree(t),s=function(){let e;for(Y(T,V.max_code),Y(B,q.max_code),z.build_tree(t),e=18;e>=3&&0===L[2*E.bl_order[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(),a=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,r<=a&&(a=r)):a=r=n+5,n+4<=a&&-1!=e?ot(e,n,i):r==a?(tt(2+(i?1:0),3),rt(S.static_ltree,S.static_dtree)):(tt(4+(i?1:0),3),function(t,e,n){let i;for(tt(t-257,5),tt(e-1,5),tt(n-4,4),i=0;i<n;i++)tt(L[2*E.bl_order[i]+1],3);nt(T,t-1),nt(B,e-1);}(V.max_code+1,q.max_code+1,s+1),rt(T,B)),X(),i&&st();}function _t(t){lt(x>=0?x:-1,v-x,t),x=v,e.flush_pending();}function dt(){let t,n,i,a;do{if(a=_-k-v,0===a&&0===v&&0===k)a=r;else if(-1==a)a--;else if(v>=r+r-262){l.set(l.subarray(r,r+r),0),m-=r,v-=r,x-=r,t=c,i=t;do{n=65535&u[--i],u[i]=n>=r?n-r:0;}while(0!=--t);t=r,i=t;do{n=65535&d[--i],d[i]=n>=r?n-r:0;}while(0!=--t);a+=r;}if(0===e.avail_in)return;t=e.read_buf(l,v+k,a),k+=t,k>=3&&(f=255&l[v],f=(f<<w^255&l[v+1])&b);}while(k<262&&0!==e.avail_in)}function ut(t){let e,n,i=U,a=v,s=A;const _=v>r-262?v-(r-262):0;let u=R;const f=o,c=v+258;let h=l[a+s-1],b=l[a+s];A>=P&&(i>>=2),u>k&&(u=k);do{if(e=t,l[e+s]==b&&l[e+s-1]==h&&l[e]==l[a]&&l[++e]==l[a+1]){a+=2,e++;do{}while(l[++a]==l[++e]&&l[++a]==l[++e]&&l[++a]==l[++e]&&l[++a]==l[++e]&&l[++a]==l[++e]&&l[++a]==l[++e]&&l[++a]==l[++e]&&l[++a]==l[++e]&&a<c);if(n=258-(c-a),a=c-258,n>s){if(m=t,s=n,n>=u)break;h=l[a+s-1],b=l[a+s];}}}while((t=65535&d[t&f])>_&&0!=--i);return s<=k?s:k}function ft(e){return e.total_in=e.total_out=0,e.msg=null,t.pending=0,t.pending_out=0,n=113,a=0,V.dyn_tree=T,V.stat_desc=S.static_l_desc,q.dyn_tree=B,q.stat_desc=S.static_d_desc,z.dyn_tree=L,z.stat_desc=S.static_bl_desc,N=0,Q=0,J=8,X(),function(){_=2*r,u[c-1]=0;for(let t=0;t<c-1;t++)u[t]=0;I=C[j].max_lazy,P=C[j].good_length,R=C[j].nice_length,U=C[j].max_chain,v=0,x=0,k=0,p=A=2,y=0,f=0;}(),0}t.depth=[],t.bl_count=[],t.heap=[],T=[],B=[],L=[],t.pqdownheap=function(e,n){const i=t.heap,a=i[n];let r=n<<1;for(;r<=t.heap_len&&(r<t.heap_len&&O(e,i[r+1],i[r],t.depth)&&r++,!O(e,a,i[r],t.depth));)i[n]=i[r],n=r,r<<=1;i[n]=a;},t.deflateInit=function(e,n,a,_,f,x){return _||(_=8),f||(f=8),x||(x=0),e.msg=null,-1==n&&(n=6),f<1||f>9||8!=_||a<9||a>15||n<0||n>9||x<0||x>2?-2:(e.dstate=t,s=a,r=1<<s,o=r-1,h=f+7,c=1<<h,b=c-1,w=Math.floor((h+3-1)/3),l=new Uint8Array(2*r),d=[],u=[],W=1<<f+6,t.pending_buf=new Uint8Array(4*W),i=4*W,F=Math.floor(W/2),K=3*W,j=n,D=x,ft(e))},t.deflateEnd=function(){return 42!=n&&113!=n&&666!=n?-2:(t.pending_buf=null,u=null,d=null,l=null,t.dstate=null,113==n?-3:0)},t.deflateParams=function(t,e,n){let i=0;return -1==e&&(e=6),e<0||e>9||n<0||n>2?-2:(C[j].func!=C[e].func&&0!==t.total_in&&(i=t.deflate(1)),j!=e&&(j=e,I=C[j].max_lazy,P=C[j].good_length,R=C[j].nice_length,U=C[j].max_chain),D=n,i)},t.deflateSetDictionary=function(t,e,i){let a,s=i,_=0;if(!e||42!=n)return -2;if(s<3)return 0;for(s>r-262&&(s=r-262,_=i-s),l.set(e.subarray(_,_+s),0),v=s,x=s,f=255&l[0],f=(f<<w^255&l[1])&b,a=0;a<=s-3;a++)f=(f<<w^255&l[a+2])&b,d[a&o]=u[f],u[f]=a;return 0},t.deflate=function(_,h){let U,E,O,P,R;if(h>4||h<0)return -2;if(!_.next_out||!_.next_in&&0!==_.avail_in||666==n&&4!=h)return _.msg=M[4],-2;if(0===_.avail_out)return _.msg=M[7],-5;var T;if(e=_,P=a,a=h,42==n&&(E=8+(s-8<<4)<<8,O=(j-1&255)>>1,O>3&&(O=3),E|=O<<6,0!==v&&(E|=32),E+=31-E%31,n=113,Z((T=E)>>8&255),Z(255&T)),0!==t.pending){if(e.flush_pending(),0===e.avail_out)return a=-1,0}else if(0===e.avail_in&&h<=P&&4!=h)return e.msg=M[7],-5;if(666==n&&0!==e.avail_in)return _.msg=M[7],-5;if(0!==e.avail_in||0!==k||0!=h&&666!=n){switch(R=-1,C[j].func){case 0:R=function(t){let n,a=65535;for(a>i-5&&(a=i-5);;){if(k<=1){if(dt(),0===k&&0==t)return 0;if(0===k)break}if(v+=k,k=0,n=x+a,(0===v||v>=n)&&(k=v-n,v=n,_t(!1),0===e.avail_out))return 0;if(v-x>=r-262&&(_t(!1),0===e.avail_out))return 0}return _t(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(h);break;case 1:R=function(t){let n,i=0;for(;;){if(k<262){if(dt(),k<262&&0==t)return 0;if(0===k)break}if(k>=3&&(f=(f<<w^255&l[v+2])&b,i=65535&u[f],d[v&o]=u[f],u[f]=v),0!==i&&(v-i&65535)<=r-262&&2!=D&&(p=ut(i)),p>=3)if(n=at(v-m,p-3),k-=p,p<=I&&k>=3){p--;do{v++,f=(f<<w^255&l[v+2])&b,i=65535&u[f],d[v&o]=u[f],u[f]=v;}while(0!=--p);v++;}else v+=p,p=0,f=255&l[v],f=(f<<w^255&l[v+1])&b;else n=at(0,255&l[v]),k--,v++;if(n&&(_t(!1),0===e.avail_out))return 0}return _t(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(h);break;case 2:R=function(t){let n,i,a=0;for(;;){if(k<262){if(dt(),k<262&&0==t)return 0;if(0===k)break}if(k>=3&&(f=(f<<w^255&l[v+2])&b,a=65535&u[f],d[v&o]=u[f],u[f]=v),A=p,g=m,p=2,0!==a&&A<I&&(v-a&65535)<=r-262&&(2!=D&&(p=ut(a)),p<=5&&(1==D||3==p&&v-m>4096)&&(p=2)),A>=3&&p<=A){i=v+k-3,n=at(v-1-g,A-3),k-=A-1,A-=2;do{++v<=i&&(f=(f<<w^255&l[v+2])&b,a=65535&u[f],d[v&o]=u[f],u[f]=v);}while(0!=--A);if(y=0,p=2,v++,n&&(_t(!1),0===e.avail_out))return 0}else if(0!==y){if(n=at(0,255&l[v-1]),n&&_t(!1),v++,k--,0===e.avail_out)return 0}else y=1,v++,k--;}return 0!==y&&(n=at(0,255&l[v-1]),y=0),_t(4==t),0===e.avail_out?4==t?2:0:4==t?3:1}(h);}if(2!=R&&3!=R||(n=666),0==R||2==R)return 0===e.avail_out&&(a=-1),0;if(1==R){if(1==h)tt(2,3),et(256,S.static_ltree),it(),1+J+10-Q<9&&(tt(2,3),et(256,S.static_ltree),it()),J=7;else if(ot(0,0,!1),3==h)for(U=0;U<c;U++)u[U]=0;if(e.flush_pending(),0===e.avail_out)return a=-1,0}}return 4!=h?0:1};}function P(){const t=this;t.next_in_index=0,t.next_out_index=0,t.avail_in=0,t.total_in=0,t.avail_out=0,t.total_out=0;}function R(t){const e=new P,n=512,i=new Uint8Array(n);let a=t?t.level:-1;void 0===a&&(a=-1),e.deflateInit(a),e.next_out=i,this.append=function(t,a){let r,s,o=0,l=0,_=0;const d=[];if(t.length){e.next_in_index=0,e.next_in=t,e.avail_in=t.length;do{if(e.next_out_index=0,e.avail_out=n,r=e.deflate(0),0!=r)throw new Error("deflating: "+e.msg);e.next_out_index&&(e.next_out_index==n?d.push(new Uint8Array(i)):d.push(new Uint8Array(i.subarray(0,e.next_out_index)))),_+=e.next_out_index,a&&e.next_in_index>0&&e.next_in_index!=o&&(a(e.next_in_index),o=e.next_in_index);}while(e.avail_in>0||0===e.avail_out);return s=new Uint8Array(_),d.forEach((function(t){s.set(t,l),l+=t.length;})),s}},this.flush=function(){let t,a,r=0,s=0;const o=[];do{if(e.next_out_index=0,e.avail_out=n,t=e.deflate(4),1!=t&&0!=t)throw new Error("deflating: "+e.msg);n-e.avail_out>0&&o.push(new Uint8Array(i.subarray(0,e.next_out_index))),s+=e.next_out_index;}while(e.avail_in>0||0===e.avail_out);return e.deflateEnd(),a=new Uint8Array(s),o.forEach((function(t){a.set(t,r),r+=t.length;})),a};}P.prototype={deflateInit:function(t,e){const n=this;return n.dstate=new D,e||(e=15),n.dstate.deflateInit(n,t,e)},deflate:function(t){const e=this;return e.dstate?e.dstate.deflate(e,t):-2},deflateEnd:function(){const t=this;if(!t.dstate)return -2;const e=t.dstate.deflateEnd();return t.dstate=null,e},deflateParams:function(t,e){const n=this;return n.dstate?n.dstate.deflateParams(n,t,e):-2},deflateSetDictionary:function(t,e){const n=this;return n.dstate?n.dstate.deflateSetDictionary(n,t,e):-2},read_buf:function(t,e,n){const i=this;let a=i.avail_in;return a>n&&(a=n),0===a?0:(i.avail_in-=a,t.set(i.next_in.subarray(i.next_in_index,i.next_in_index+a),e),i.next_in_index+=a,i.total_in+=a,a)},flush_pending:function(){const t=this;let e=t.dstate.pending;e>t.avail_out&&(e=t.avail_out),0!==e&&(t.next_out.set(t.dstate.pending_buf.subarray(t.dstate.pending_out,t.dstate.pending_out+e),t.next_out_index),t.next_out_index+=e,t.dstate.pending_out+=e,t.total_out+=e,t.avail_out-=e,t.dstate.pending-=e,0===t.dstate.pending&&(t.dstate.pending_out=0));}};const T=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],B=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],L=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],V=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],q=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],z=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],K=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function W(){let t,e,n,i,a,r;function s(t,e,s,o,l,_,d,u,f,c,h){let b,w,x,p,g,y,v,m,k,A,U,I,E,S,j;A=0,g=s;do{n[t[e+A]]++,A++,g--;}while(0!==g);if(n[0]==s)return d[0]=-1,u[0]=0,0;for(m=u[0],y=1;y<=15&&0===n[y];y++);for(v=y,m<y&&(m=y),g=15;0!==g&&0===n[g];g--);for(x=g,m>g&&(m=g),u[0]=m,S=1<<y;y<g;y++,S<<=1)if((S-=n[y])<0)return -3;if((S-=n[g])<0)return -3;for(n[g]+=S,r[1]=y=0,A=1,E=2;0!=--g;)r[E]=y+=n[A],E++,A++;g=0,A=0;do{0!==(y=t[e+A])&&(h[r[y]++]=g),A++;}while(++g<s);for(s=r[x],r[0]=g=0,A=0,p=-1,I=-m,a[0]=0,U=0,j=0;v<=x;v++)for(b=n[v];0!=b--;){for(;v>I+m;){if(p++,I+=m,j=x-I,j=j>m?m:j,(w=1<<(y=v-I))>b+1&&(w-=b+1,E=v,y<j))for(;++y<j&&!((w<<=1)<=n[++E]);)w-=n[E];if(j=1<<y,c[0]+j>1440)return -3;a[p]=U=c[0],c[0]+=j,0!==p?(r[p]=g,i[0]=y,i[1]=m,y=g>>>I-m,i[2]=U-a[p-1]-y,f.set(i,3*(a[p-1]+y))):d[0]=U;}for(i[1]=v-I,A>=s?i[0]=192:h[A]<o?(i[0]=h[A]<256?0:96,i[2]=h[A++]):(i[0]=_[h[A]-o]+16+64,i[2]=l[h[A++]-o]),w=1<<v-I,y=g>>>I;y<j;y+=w)f.set(i,3*(U+y));for(y=1<<v-1;0!=(g&y);y>>>=1)g^=y;for(g^=y,k=(1<<I)-1;(g&k)!=r[p];)p--,I-=m,k=(1<<I)-1;}return 0!==S&&1!=x?-5:0}function o(s){let o;for(t||(t=[],e=[],n=new Int32Array(16),i=[],a=new Int32Array(15),r=new Int32Array(16)),e.length<s&&(e=[]),o=0;o<s;o++)e[o]=0;for(o=0;o<16;o++)n[o]=0;for(o=0;o<3;o++)i[o]=0;a.set(n.subarray(0,15),0),r.set(n.subarray(0,16),0);}this.inflate_trees_bits=function(n,i,a,r,l){let _;return o(19),t[0]=0,_=s(n,0,19,19,null,null,a,i,r,t,e),-3==_?l.msg="oversubscribed dynamic bit lengths tree":-5!=_&&0!==i[0]||(l.msg="incomplete dynamic bit lengths tree",_=-3),_},this.inflate_trees_dynamic=function(n,i,a,r,l,_,d,u,f){let c;return o(288),t[0]=0,c=s(a,0,n,257,V,q,_,r,u,t,e),0!=c||0===r[0]?(-3==c?f.msg="oversubscribed literal/length tree":-4!=c&&(f.msg="incomplete literal/length tree",c=-3),c):(o(288),c=s(a,n,i,0,z,K,d,l,u,t,e),0!=c||0===l[0]&&n>257?(-3==c?f.msg="oversubscribed distance tree":-5==c?(f.msg="incomplete distance tree",c=-3):-4!=c&&(f.msg="empty distance tree with lengths",c=-3),c):0)};}function H(){const t=this;let e,n,i,a,r=0,s=0,o=0,l=0,_=0,d=0,u=0,f=0,c=0,h=0;function b(t,e,n,i,a,r,s,o){let l,_,d,u,f,c,h,b,w,x,p,g,y,v,m,k;h=o.next_in_index,b=o.avail_in,f=s.bitb,c=s.bitk,w=s.write,x=w<s.read?s.read-w-1:s.end-w,p=T[t],g=T[e];do{for(;c<20;)b--,f|=(255&o.read_byte(h++))<<c,c+=8;if(l=f&p,_=n,d=i,k=3*(d+l),0!==(u=_[k]))for(;;){if(f>>=_[k+1],c-=_[k+1],0!=(16&u)){for(u&=15,y=_[k+2]+(f&T[u]),f>>=u,c-=u;c<15;)b--,f|=(255&o.read_byte(h++))<<c,c+=8;for(l=f&g,_=a,d=r,k=3*(d+l),u=_[k];;){if(f>>=_[k+1],c-=_[k+1],0!=(16&u)){for(u&=15;c<u;)b--,f|=(255&o.read_byte(h++))<<c,c+=8;if(v=_[k+2]+(f&T[u]),f>>=u,c-=u,x-=y,w>=v)m=w-v,w-m>0&&2>w-m?(s.window[w++]=s.window[m++],s.window[w++]=s.window[m++],y-=2):(s.window.set(s.window.subarray(m,m+2),w),w+=2,m+=2,y-=2);else {m=w-v;do{m+=s.end;}while(m<0);if(u=s.end-m,y>u){if(y-=u,w-m>0&&u>w-m)do{s.window[w++]=s.window[m++];}while(0!=--u);else s.window.set(s.window.subarray(m,m+u),w),w+=u,m+=u,u=0;m=0;}}if(w-m>0&&y>w-m)do{s.window[w++]=s.window[m++];}while(0!=--y);else s.window.set(s.window.subarray(m,m+y),w),w+=y,m+=y,y=0;break}if(0!=(64&u))return o.msg="invalid distance code",y=o.avail_in-b,y=c>>3<y?c>>3:y,b+=y,h-=y,c-=y<<3,s.bitb=f,s.bitk=c,o.avail_in=b,o.total_in+=h-o.next_in_index,o.next_in_index=h,s.write=w,-3;l+=_[k+2],l+=f&T[u],k=3*(d+l),u=_[k];}break}if(0!=(64&u))return 0!=(32&u)?(y=o.avail_in-b,y=c>>3<y?c>>3:y,b+=y,h-=y,c-=y<<3,s.bitb=f,s.bitk=c,o.avail_in=b,o.total_in+=h-o.next_in_index,o.next_in_index=h,s.write=w,1):(o.msg="invalid literal/length code",y=o.avail_in-b,y=c>>3<y?c>>3:y,b+=y,h-=y,c-=y<<3,s.bitb=f,s.bitk=c,o.avail_in=b,o.total_in+=h-o.next_in_index,o.next_in_index=h,s.write=w,-3);if(l+=_[k+2],l+=f&T[u],k=3*(d+l),0===(u=_[k])){f>>=_[k+1],c-=_[k+1],s.window[w++]=_[k+2],x--;break}}else f>>=_[k+1],c-=_[k+1],s.window[w++]=_[k+2],x--;}while(x>=258&&b>=10);return y=o.avail_in-b,y=c>>3<y?c>>3:y,b+=y,h-=y,c-=y<<3,s.bitb=f,s.bitk=c,o.avail_in=b,o.total_in+=h-o.next_in_index,o.next_in_index=h,s.write=w,0}t.init=function(t,r,s,o,l,_){e=0,u=t,f=r,i=s,c=o,a=l,h=_,n=null;},t.proc=function(t,w,x){let p,g,y,v,m,k,A,U=0,I=0,E=0;for(E=w.next_in_index,v=w.avail_in,U=t.bitb,I=t.bitk,m=t.write,k=m<t.read?t.read-m-1:t.end-m;;)switch(e){case 0:if(k>=258&&v>=10&&(t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,x=b(u,f,i,c,a,h,t,w),E=w.next_in_index,v=w.avail_in,U=t.bitb,I=t.bitk,m=t.write,k=m<t.read?t.read-m-1:t.end-m,0!=x)){e=1==x?7:9;break}o=u,n=i,s=c,e=1;case 1:for(p=o;I<p;){if(0===v)return t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);x=0,v--,U|=(255&w.read_byte(E++))<<I,I+=8;}if(g=3*(s+(U&T[p])),U>>>=n[g+1],I-=n[g+1],y=n[g],0===y){l=n[g+2],e=6;break}if(0!=(16&y)){_=15&y,r=n[g+2],e=2;break}if(0==(64&y)){o=y,s=g/3+n[g+2];break}if(0!=(32&y)){e=7;break}return e=9,w.msg="invalid literal/length code",x=-3,t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);case 2:for(p=_;I<p;){if(0===v)return t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);x=0,v--,U|=(255&w.read_byte(E++))<<I,I+=8;}r+=U&T[p],U>>=p,I-=p,o=f,n=a,s=h,e=3;case 3:for(p=o;I<p;){if(0===v)return t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);x=0,v--,U|=(255&w.read_byte(E++))<<I,I+=8;}if(g=3*(s+(U&T[p])),U>>=n[g+1],I-=n[g+1],y=n[g],0!=(16&y)){_=15&y,d=n[g+2],e=4;break}if(0==(64&y)){o=y,s=g/3+n[g+2];break}return e=9,w.msg="invalid distance code",x=-3,t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);case 4:for(p=_;I<p;){if(0===v)return t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);x=0,v--,U|=(255&w.read_byte(E++))<<I,I+=8;}d+=U&T[p],U>>=p,I-=p,e=5;case 5:for(A=m-d;A<0;)A+=t.end;for(;0!==r;){if(0===k&&(m==t.end&&0!==t.read&&(m=0,k=m<t.read?t.read-m-1:t.end-m),0===k&&(t.write=m,x=t.inflate_flush(w,x),m=t.write,k=m<t.read?t.read-m-1:t.end-m,m==t.end&&0!==t.read&&(m=0,k=m<t.read?t.read-m-1:t.end-m),0===k)))return t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);t.window[m++]=t.window[A++],k--,A==t.end&&(A=0),r--;}e=0;break;case 6:if(0===k&&(m==t.end&&0!==t.read&&(m=0,k=m<t.read?t.read-m-1:t.end-m),0===k&&(t.write=m,x=t.inflate_flush(w,x),m=t.write,k=m<t.read?t.read-m-1:t.end-m,m==t.end&&0!==t.read&&(m=0,k=m<t.read?t.read-m-1:t.end-m),0===k)))return t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);x=0,t.window[m++]=l,k--,e=0;break;case 7:if(I>7&&(I-=8,v++,E--),t.write=m,x=t.inflate_flush(w,x),m=t.write,k=m<t.read?t.read-m-1:t.end-m,t.read!=t.write)return t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);e=8;case 8:return x=1,t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);case 9:return x=-3,t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x);default:return x=-2,t.bitb=U,t.bitk=I,w.avail_in=v,w.total_in+=E-w.next_in_index,w.next_in_index=E,t.write=m,t.inflate_flush(w,x)}},t.free=function(){};}W.inflate_trees_fixed=function(t,e,n,i){return t[0]=9,e[0]=5,n[0]=B,i[0]=L,0};const F=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function G(t,e){const n=this;let i,a=0,r=0,s=0,o=0;const l=[0],_=[0],d=new H;let u=0,f=new Int32Array(4320);const c=new W;n.bitk=0,n.bitb=0,n.window=new Uint8Array(e),n.end=e,n.read=0,n.write=0,n.reset=function(t,e){e&&(e[0]=0),6==a&&d.free(t),a=0,n.bitk=0,n.bitb=0,n.read=n.write=0;},n.reset(t,null),n.inflate_flush=function(t,e){let i,a,r;return a=t.next_out_index,r=n.read,i=(r<=n.write?n.write:n.end)-r,i>t.avail_out&&(i=t.avail_out),0!==i&&-5==e&&(e=0),t.avail_out-=i,t.total_out+=i,t.next_out.set(n.window.subarray(r,r+i),a),a+=i,r+=i,r==n.end&&(r=0,n.write==n.end&&(n.write=0),i=n.write-r,i>t.avail_out&&(i=t.avail_out),0!==i&&-5==e&&(e=0),t.avail_out-=i,t.total_out+=i,t.next_out.set(n.window.subarray(r,r+i),a),a+=i,r+=i),t.next_out_index=a,n.read=r,e},n.proc=function(t,e){let h,b,w,x,p,g,y,v;for(x=t.next_in_index,p=t.avail_in,b=n.bitb,w=n.bitk,g=n.write,y=g<n.read?n.read-g-1:n.end-g;;){let m,k,A,U,I,E,S,j;switch(a){case 0:for(;w<3;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}switch(h=7&b,u=1&h,h>>>1){case 0:b>>>=3,w-=3,h=7&w,b>>>=h,w-=h,a=1;break;case 1:m=[],k=[],A=[[]],U=[[]],W.inflate_trees_fixed(m,k,A,U),d.init(m[0],k[0],A[0],0,U[0],0),b>>>=3,w-=3,a=6;break;case 2:b>>>=3,w-=3,a=3;break;case 3:return b>>>=3,w-=3,a=9,t.msg="invalid block type",e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e)}break;case 1:for(;w<32;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}if((~b>>>16&65535)!=(65535&b))return a=9,t.msg="invalid stored block lengths",e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);r=65535&b,b=w=0,a=0!==r?2:0!==u?7:0;break;case 2:if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);if(0===y&&(g==n.end&&0!==n.read&&(g=0,y=g<n.read?n.read-g-1:n.end-g),0===y&&(n.write=g,e=n.inflate_flush(t,e),g=n.write,y=g<n.read?n.read-g-1:n.end-g,g==n.end&&0!==n.read&&(g=0,y=g<n.read?n.read-g-1:n.end-g),0===y)))return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);if(e=0,h=r,h>p&&(h=p),h>y&&(h=y),n.window.set(t.read_buf(x,h),g),x+=h,p-=h,g+=h,y-=h,0!=(r-=h))break;a=0!==u?7:0;break;case 3:for(;w<14;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}if(s=h=16383&b,(31&h)>29||(h>>5&31)>29)return a=9,t.msg="too many length or distance symbols",e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);if(h=258+(31&h)+(h>>5&31),!i||i.length<h)i=[];else for(v=0;v<h;v++)i[v]=0;b>>>=14,w-=14,o=0,a=4;case 4:for(;o<4+(s>>>10);){for(;w<3;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}i[F[o++]]=7&b,b>>>=3,w-=3;}for(;o<19;)i[F[o++]]=0;if(l[0]=7,h=c.inflate_trees_bits(i,l,_,f,t),0!=h)return -3==(e=h)&&(i=null,a=9),n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);o=0,a=5;case 5:for(;h=s,!(o>=258+(31&h)+(h>>5&31));){let r,d;for(h=l[0];w<h;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}if(h=f[3*(_[0]+(b&T[h]))+1],d=f[3*(_[0]+(b&T[h]))+2],d<16)b>>>=h,w-=h,i[o++]=d;else {for(v=18==d?7:d-14,r=18==d?11:3;w<h+v;){if(0===p)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);e=0,p--,b|=(255&t.read_byte(x++))<<w,w+=8;}if(b>>>=h,w-=h,r+=b&T[v],b>>>=v,w-=v,v=o,h=s,v+r>258+(31&h)+(h>>5&31)||16==d&&v<1)return i=null,a=9,t.msg="invalid bit length repeat",e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);d=16==d?i[v-1]:0;do{i[v++]=d;}while(0!=--r);o=v;}}if(_[0]=-1,I=[],E=[],S=[],j=[],I[0]=9,E[0]=6,h=s,h=c.inflate_trees_dynamic(257+(31&h),1+(h>>5&31),i,I,E,S,j,f,t),0!=h)return -3==h&&(i=null,a=9),e=h,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);d.init(I[0],E[0],f,S[0],f,j[0]),a=6;case 6:if(n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,1!=(e=d.proc(n,t,e)))return n.inflate_flush(t,e);if(e=0,d.free(t),x=t.next_in_index,p=t.avail_in,b=n.bitb,w=n.bitk,g=n.write,y=g<n.read?n.read-g-1:n.end-g,0===u){a=0;break}a=7;case 7:if(n.write=g,e=n.inflate_flush(t,e),g=n.write,y=g<n.read?n.read-g-1:n.end-g,n.read!=n.write)return n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);a=8;case 8:return e=1,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);case 9:return e=-3,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e);default:return e=-2,n.bitb=b,n.bitk=w,t.avail_in=p,t.total_in+=x-t.next_in_index,t.next_in_index=x,n.write=g,n.inflate_flush(t,e)}}},n.free=function(t){n.reset(t,null),n.window=null,f=null;},n.set_dictionary=function(t,e,i){n.window.set(t.subarray(e,e+i),0),n.read=n.write=i;},n.sync_point=function(){return 1==a?1:0};}const J=[0,0,255,255];function N(){const t=this;function e(t){return t&&t.istate?(t.total_in=t.total_out=0,t.msg=null,t.istate.mode=7,t.istate.blocks.reset(t,null),0):-2}t.mode=0,t.method=0,t.was=[0],t.need=0,t.marker=0,t.wbits=0,t.inflateEnd=function(e){return t.blocks&&t.blocks.free(e),t.blocks=null,0},t.inflateInit=function(n,i){return n.msg=null,t.blocks=null,i<8||i>15?(t.inflateEnd(n),-2):(t.wbits=i,n.istate.blocks=new G(n,1<<i),e(n),0)},t.inflate=function(t,e){let n,i;if(!t||!t.istate||!t.next_in)return -2;const a=t.istate;for(e=4==e?-5:0,n=-5;;)switch(a.mode){case 0:if(0===t.avail_in)return n;if(n=e,t.avail_in--,t.total_in++,8!=(15&(a.method=t.read_byte(t.next_in_index++)))){a.mode=13,t.msg="unknown compression method",a.marker=5;break}if(8+(a.method>>4)>a.wbits){a.mode=13,t.msg="invalid window size",a.marker=5;break}a.mode=1;case 1:if(0===t.avail_in)return n;if(n=e,t.avail_in--,t.total_in++,i=255&t.read_byte(t.next_in_index++),((a.method<<8)+i)%31!=0){a.mode=13,t.msg="incorrect header check",a.marker=5;break}if(0==(32&i)){a.mode=7;break}a.mode=2;case 2:if(0===t.avail_in)return n;n=e,t.avail_in--,t.total_in++,a.need=(255&t.read_byte(t.next_in_index++))<<24&4278190080,a.mode=3;case 3:if(0===t.avail_in)return n;n=e,t.avail_in--,t.total_in++,a.need+=(255&t.read_byte(t.next_in_index++))<<16&16711680,a.mode=4;case 4:if(0===t.avail_in)return n;n=e,t.avail_in--,t.total_in++,a.need+=(255&t.read_byte(t.next_in_index++))<<8&65280,a.mode=5;case 5:return 0===t.avail_in?n:(n=e,t.avail_in--,t.total_in++,a.need+=255&t.read_byte(t.next_in_index++),a.mode=6,2);case 6:return a.mode=13,t.msg="need dictionary",a.marker=0,-2;case 7:if(n=a.blocks.proc(t,n),-3==n){a.mode=13,a.marker=0;break}if(0==n&&(n=e),1!=n)return n;n=e,a.blocks.reset(t,a.was),a.mode=12;case 12:return 1;case 13:return -3;default:return -2}},t.inflateSetDictionary=function(t,e,n){let i=0,a=n;if(!t||!t.istate||6!=t.istate.mode)return -2;const r=t.istate;return a>=1<<r.wbits&&(a=(1<<r.wbits)-1,i=n-a),r.blocks.set_dictionary(e,i,a),r.mode=7,0},t.inflateSync=function(t){let n,i,a,r,s;if(!t||!t.istate)return -2;const o=t.istate;if(13!=o.mode&&(o.mode=13,o.marker=0),0===(n=t.avail_in))return -5;for(i=t.next_in_index,a=o.marker;0!==n&&a<4;)t.read_byte(i)==J[a]?a++:a=0!==t.read_byte(i)?0:4-a,i++,n--;return t.total_in+=i-t.next_in_index,t.next_in_index=i,t.avail_in=n,o.marker=a,4!=a?-3:(r=t.total_in,s=t.total_out,e(t),t.total_in=r,t.total_out=s,o.mode=7,0)},t.inflateSyncPoint=function(t){return t&&t.istate&&t.istate.blocks?t.istate.blocks.sync_point():-2};}function Q(){}function X(){const t=new Q,e=new Uint8Array(512);let n=!1;t.inflateInit(),t.next_out=e,this.append=function(i,a){const r=[];let s,o,l=0,_=0,d=0;if(0!==i.length){t.next_in_index=0,t.next_in=i,t.avail_in=i.length;do{if(t.next_out_index=0,t.avail_out=512,0!==t.avail_in||n||(t.next_in_index=0,n=!0),s=t.inflate(0),n&&-5===s){if(0!==t.avail_in)throw new Error("inflating: bad input")}else if(0!==s&&1!==s)throw new Error("inflating: "+t.msg);if((n||1===s)&&t.avail_in===i.length)throw new Error("inflating: bad input");t.next_out_index&&(512===t.next_out_index?r.push(new Uint8Array(e)):r.push(new Uint8Array(e.subarray(0,t.next_out_index)))),d+=t.next_out_index,a&&t.next_in_index>0&&t.next_in_index!=l&&(a(t.next_in_index),l=t.next_in_index);}while(t.avail_in>0||0===t.avail_out);return o=new Uint8Array(d),r.forEach((function(t){o.set(t,_),_+=t.length;})),o}},this.flush=function(){t.inflateEnd();};}Q.prototype={inflateInit:function(t){const e=this;return e.istate=new N,t||(t=15),e.istate.inflateInit(e,t)},inflate:function(t){const e=this;return e.istate?e.istate.inflate(e,t):-2},inflateEnd:function(){const t=this;if(!t.istate)return -2;const e=t.istate.inflateEnd(t);return t.istate=null,e},inflateSync:function(){const t=this;return t.istate?t.istate.inflateSync(t):-2},inflateSetDictionary:function(t,e){const n=this;return n.istate?n.istate.inflateSetDictionary(n,t,e):-2},read_byte:function(t){return this.next_in.subarray(t,t+1)[0]},read_buf:function(t,e){return this.next_in.subarray(t,t+e)}},self.initCodec=()=>{self.Deflate=R,self.Inflate=X;};}).toString(),n=URL.createObjectURL(new Blob(["("+e+")()"],{type:"text/javascript"}));configure({workerScripts:{inflate:[n],deflate:[n]}});}};

	const FUNCTION_TYPE = "function";

	var streamCodecShim = (library, options = {}) => {
		return {
			Deflate: createCodecClass(library.Deflate, options.deflate),
			Inflate: createCodecClass(library.Inflate, options.inflate)
		};
	};

	function createCodecClass(constructor, constructorOptions) {
		return class {

			constructor(options) {
				const onData = data => {
					if (this.pendingData) {
						const pendingData = this.pendingData;
						this.pendingData = new Uint8Array(pendingData.length + data.length);
						this.pendingData.set(pendingData, 0);
						this.pendingData.set(data, pendingData.length);
					} else {
						this.pendingData = new Uint8Array(data);
					}
				};
				this.codec = new constructor(Object.assign({}, constructorOptions, options));
				if (typeof this.codec.onData == FUNCTION_TYPE) {
					this.codec.onData = onData;
				} else if (typeof this.codec.on == FUNCTION_TYPE) {
					this.codec.on("data", onData);
				} else {
					throw new Error("Cannot register the callback function");
				}
			}
			async append(data) {
				this.codec.push(data);
				return getResponse(this);
			}
			async flush() {
				this.codec.push(new Uint8Array(0), true);
				return getResponse(this);
			}
		};

		function getResponse(codec) {
			if (codec.pendingData) {
				const output = codec.pendingData;
				codec.pendingData = null;
				return output;
			} else {
				return new Uint8Array(0);
			}
		}
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const ERR_HTTP_STATUS = "HTTP error ";
	const ERR_HTTP_RANGE = "HTTP Range not supported";

	const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
	const HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
	const HTTP_HEADER_ACCEPT_RANGES = "Accept-Ranges";
	const HTTP_HEADER_RANGE = "Range";
	const HTTP_METHOD_HEAD = "HEAD";
	const HTTP_METHOD_GET = "GET";
	const HTTP_RANGE_UNIT = "bytes";

	class Stream {

		constructor() {
			this.size = 0;
		}

		init() {
			this.initialized = true;
		}
	}
	class Reader extends Stream {
	}

	class Writer extends Stream {

		writeUint8Array(array) {
			this.size += array.length;
		}
	}

	class TextReader extends Reader {

		constructor(text) {
			super();
			this.blobReader = new BlobReader(new Blob([text], { type: CONTENT_TYPE_TEXT_PLAIN }));
		}

		async init() {
			super.init();
			this.blobReader.init();
			this.size = this.blobReader.size;
		}

		async readUint8Array(offset, length) {
			return this.blobReader.readUint8Array(offset, length);
		}
	}

	class TextWriter extends Writer {

		constructor(encoding) {
			super();
			this.encoding = encoding;
			this.blob = new Blob([], { type: CONTENT_TYPE_TEXT_PLAIN });
		}

		async writeUint8Array(array) {
			super.writeUint8Array(array);
			this.blob = new Blob([this.blob, array.buffer], { type: CONTENT_TYPE_TEXT_PLAIN });
		}

		getData() {
			const reader = new FileReader();
			return new Promise((resolve, reject) => {
				reader.onload = event => resolve(event.target.result);
				reader.onerror = reject;
				reader.readAsText(this.blob, this.encoding);
			});
		}
	}

	class Data64URIReader extends Reader {

		constructor(dataURI) {
			super();
			this.dataURI = dataURI;
			let dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") {
				dataEnd--;
			}
			this.dataStart = dataURI.indexOf(",") + 1;
			this.size = Math.floor((dataEnd - this.dataStart) * 0.75);
		}

		async readUint8Array(offset, length) {
			const dataArray = new Uint8Array(length);
			const start = Math.floor(offset / 3) * 4;
			const bytes = atob(this.dataURI.substring(start + this.dataStart, Math.ceil((offset + length) / 3) * 4 + this.dataStart));
			const delta = offset - Math.floor(start / 4) * 3;
			for (let indexByte = delta; indexByte < delta + length; indexByte++) {
				dataArray[indexByte - delta] = bytes.charCodeAt(indexByte);
			}
			return dataArray;
		}
	}

	class Data64URIWriter extends Writer {

		constructor(contentType) {
			super();
			this.data = "data:" + (contentType || "") + ";base64,";
			this.pending = [];
		}

		async writeUint8Array(array) {
			super.writeUint8Array(array);
			let indexArray = 0, dataString = this.pending;
			const delta = this.pending.length;
			this.pending = "";
			for (indexArray = 0; indexArray < (Math.floor((delta + array.length) / 3) * 3) - delta; indexArray++) {
				dataString += String.fromCharCode(array[indexArray]);
			}
			for (; indexArray < array.length; indexArray++) {
				this.pending += String.fromCharCode(array[indexArray]);
			}
			if (dataString.length > 2) {
				this.data += btoa(dataString);
			} else {
				this.pending = dataString;
			}
		}

		getData() {
			return this.data + btoa(this.pending);
		}
	}

	class BlobReader extends Reader {

		constructor(blob) {
			super();
			this.blob = blob;
			this.size = blob.size;
		}

		async readUint8Array(offset, length) {
			const reader = new FileReader();
			return new Promise((resolve, reject) => {
				reader.onload = event => resolve(new Uint8Array(event.target.result));
				reader.onerror = reject;
				reader.readAsArrayBuffer(this.blob.slice(offset, offset + length));
			});
		}
	}

	class BlobWriter extends Writer {

		constructor(contentType) {
			super();
			this.offset = 0;
			this.contentType = contentType;
			this.blob = new Blob([], { type: contentType });
		}

		async writeUint8Array(array) {
			super.writeUint8Array(array);
			this.blob = new Blob([this.blob, array.buffer], { type: this.contentType });
			this.offset = this.blob.size;
		}

		getData() {
			return this.blob;
		}
	}

	class FetchReader extends Reader {

		constructor(url, options) {
			super();
			this.url = url;
			this.preventHeadRequest = options.preventHeadRequest;
			this.useRangeHeader = options.useRangeHeader;
			this.forceRangeRequests = options.forceRangeRequests;
			this.options = Object.assign({}, options);
			delete this.options.preventHeadRequest;
			delete this.options.useRangeHeader;
			delete this.options.forceRangeRequests;
			delete this.options.useXHR;
		}

		async init() {
			super.init();
			if (isHttpFamily(this.url) && !this.preventHeadRequest) {
				const response = await sendFetchRequest(HTTP_METHOD_HEAD, this.url, this.options);
				this.size = Number(response.headers.get(HTTP_HEADER_CONTENT_LENGTH));
				if (!this.forceRangeRequests && this.useRangeHeader && response.headers.get(HTTP_HEADER_ACCEPT_RANGES) != HTTP_RANGE_UNIT) {
					throw new Error(ERR_HTTP_RANGE);
				} else if (this.size === undefined) {
					await getFetchData(this, this.options);
				}
			} else {
				await getFetchData(this, this.options);
			}
		}

		async readUint8Array(index, length) {
			if (this.useRangeHeader) {
				const response = await sendFetchRequest(HTTP_METHOD_GET, this.url, this.options, Object.assign({}, this.options.headers,
					{ HEADER_RANGE: HTTP_RANGE_UNIT + "=" + index + "-" + (index + length - 1) }));
				if (response.status != 206) {
					throw new Error(ERR_HTTP_RANGE);
				}
				return new Uint8Array(await response.arrayBuffer());
			} else {
				if (!this.data) {
					await getFetchData(this, this.options);
				}
				return new Uint8Array(this.data.subarray(index, index + length));
			}
		}
	}

	async function getFetchData(httpReader, options) {
		const response = await sendFetchRequest(HTTP_METHOD_GET, httpReader.url, options);
		httpReader.data = new Uint8Array(await response.arrayBuffer());
		if (!httpReader.size) {
			httpReader.size = httpReader.data.length;
		}
	}

	async function sendFetchRequest(method, url, options, headers) {
		headers = Object.assign({}, options.headers, headers);
		const response = await fetch(url, Object.assign({}, options, { method, headers }));
		if (response.status < 400) {
			return response;
		} else {
			throw new Error(ERR_HTTP_STATUS + (response.statusText || response.status));
		}
	}

	class XHRReader extends Reader {

		constructor(url, options) {
			super();
			this.url = url;
			this.preventHeadRequest = options.preventHeadRequest;
			this.useRangeHeader = options.useRangeHeader;
			this.forceRangeRequests = options.forceRangeRequests;
		}

		async init() {
			super.init();
			if (isHttpFamily(this.url) && !this.preventHeadRequest) {
				return new Promise((resolve, reject) => sendXHR(HTTP_METHOD_HEAD, this.url, request => {
					this.size = Number(request.getResponseHeader(HTTP_HEADER_CONTENT_LENGTH));
					if (this.useRangeHeader) {
						if (this.forceRangeRequests || request.getResponseHeader(HTTP_HEADER_ACCEPT_RANGES) == HTTP_RANGE_UNIT) {
							resolve();
						} else {
							reject(new Error(ERR_HTTP_RANGE));
						}
					} else if (this.size === undefined) {
						getXHRData(this, this.url).then(() => resolve()).catch(reject);
					} else {
						resolve();
					}
				}, reject));
			} else {
				await getXHRData(this, this.url);
			}
		}

		async readUint8Array(index, length) {
			if (this.useRangeHeader) {
				const request = await new Promise((resolve, reject) => sendXHR(HTTP_METHOD_GET, this.url, request => resolve(new Uint8Array(request.response)), reject,
					[[HTTP_HEADER_RANGE, HTTP_RANGE_UNIT + "=" + index + "-" + (index + length - 1)]]));
				if (request.status != 206) {
					throw new Error(ERR_HTTP_RANGE);
				}
			} else {
				if (!this.data) {
					await getXHRData(this, this.url);
				}
				return new Uint8Array(this.data.subarray(index, index + length));
			}
		}
	}

	function getXHRData(httpReader, url) {
		return new Promise((resolve, reject) => sendXHR(HTTP_METHOD_GET, url, request => {
			httpReader.data = new Uint8Array(request.response);
			if (!httpReader.size) {
				httpReader.size = httpReader.data.length;
			}
			resolve();
		}, reject));
	}

	function sendXHR(method, url, onload, onerror, headers = []) {
		const request = new XMLHttpRequest();
		request.addEventListener("load", () => {
			if (request.status < 400) {
				onload(request);
			} else {
				onerror(ERR_HTTP_STATUS + (request.statusText || request.status));
			}
		}, false);
		request.addEventListener("error", onerror, false);
		request.open(method, url);
		headers.forEach(header => request.setRequestHeader(header[0], header[1]));
		request.responseType = "arraybuffer";
		request.send();
		return request;
	}

	class HttpReader extends Reader {

		constructor(url, options = {}) {
			super();
			this.url = url;
			if (options.useXHR) {
				this.reader = new XHRReader(url, options);
			} else {
				this.reader = new FetchReader(url, options);
			}
		}

		set size(value) {
			// ignored
		}

		get size() {
			return this.reader.size;
		}

		async init() {
			super.init();
			await this.reader.init();
		}

		async readUint8Array(index, length) {
			return this.reader.readUint8Array(index, length);
		}
	}

	class HttpRangeReader extends HttpReader {

		constructor(url, options = {}) {
			options.useRangeHeader = true;
			super(url, options);
		}
	}


	class Uint8ArrayReader extends Reader {

		constructor(array) {
			super();
			this.array = array;
			this.size = array.length;
		}

		async readUint8Array(index, length) {
			return this.array.slice(index, index + length);
		}
	}

	class Uint8ArrayWriter extends Writer {

		constructor() {
			super();
			this.array = new Uint8Array(0);
		}

		async writeUint8Array(array) {
			super.writeUint8Array(array);
			const previousArray = this.array;
			this.array = new Uint8Array(previousArray.length + array.length);
			this.array.set(previousArray);
			this.array.set(array, previousArray.length);
		}

		getData() {
			return this.array;
		}
	}

	function isHttpFamily(url) {
		if (typeof document != "undefined") {
			const anchor = document.createElement("a");
			anchor.href = url;
			return anchor.protocol == "http:" || anchor.protocol == "https:";
		} else {
			return /^https?:\/\//i.test(url);
		}
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const MAX_32_BITS = 0xffffffff;
	const MAX_16_BITS = 0xffff;
	const COMPRESSION_METHOD_DEFLATE = 0x08;
	const COMPRESSION_METHOD_STORE = 0x00;
	const COMPRESSION_METHOD_AES = 0x63;

	const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE = 0x08074b50;
	const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
	const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
	const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;
	const END_OF_CENTRAL_DIR_LENGTH = 22;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
	const ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
	const ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;

	const ZIP64_TOTAL_NUMBER_OF_DISKS = 1;

	const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
	const EXTRAFIELD_TYPE_AES = 0x9901;
	const EXTRAFIELD_TYPE_UNICODE_PATH = 0x7075;
	const EXTRAFIELD_TYPE_UNICODE_COMMENT = 0x6375;

	const BITFLAG_ENCRYPTED = 0x01;
	const BITFLAG_LEVEL = 0x06;
	const BITFLAG_DATA_DESCRIPTOR = 0x0008;
	const BITFLAG_ENHANCED_DEFLATING = 0x0010;
	const BITFLAG_LANG_ENCODING_FLAG = 0x0800;
	const FILE_ATTR_MSDOS_DIR_MASK = 0x10;

	const VERSION_DEFLATE = 0x14;
	const VERSION_ZIP64 = 0x2D;
	const VERSION_AES = 0x33;

	const DIRECTORY_SIGNATURE = "/";

	const MAX_DATE = new Date(2107, 11, 31);
	const MIN_DATE = new Date(1980, 0, 1);

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const CP437 = [
		"\0", "☺", "☻", "♥", "♦", "♣", "♠", "•", "◘", "○", "◙", "♂", "♀", "♪", "♫", "☼", "►", "◄", "↕", "‼", "¶", "§", "▬", "↨", "↑", "↓", "→", "←", "∟", "↔", "▲", "▼",
		" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
		"@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
		"`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",
		"Ç", "ü", "é", "â", "ä", "à", "å", "ç", "ê", "ë", "è", "ï", "î", "ì", "Ä", "Å", "É", "æ", "Æ", "ô", "ö", "ò", "û", "ù", "ÿ", "Ö", "Ü", "¢", "£", "¥", "₧", "ƒ",
		"á", "í", "ó", "ú", "ñ", "Ñ", "ª", "º", "¿", "⌐", "¬", "½", "¼", "¡", "«", "»", "░", "▒", "▓", "│", "┤", "╡", "╢", "╖", "╕", "╣", "║", "╗", "╝", "╜", "╛", "┐",
		"└", "┴", "┬", "├", "─", "┼", "╞", "╟", "╚", "╔", "╩", "╦", "╠", "═", "╬", "╧", "╨", "╤", "╥", "╙", "╘", "╒", "╓", "╫", "╪", "┘", "┌", "█", "▄", "▌", "▐", "▀",
		"α", "ß", "Γ", "π", "Σ", "σ", "µ", "τ", "Φ", "Θ", "Ω", "δ", "∞", "φ", "ε", "∩", "≡", "±", "≥", "≤", "⌠", "⌡", "÷", "≈", "°", "∙", "·", "√", "ⁿ", "²", "■", " "];


	var decodeCP437 = stringValue => {
		let result = "";
		for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
			result += CP437[stringValue[indexCharacter]];
		}
		return result;
	};

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const table = [];
	for (let i = 0; i < 256; i++) {
		let t = i;
		for (let j = 0; j < 8; j++) {
			if (t & 1) {
				t = (t >>> 1) ^ 0xEDB88320;
			} else {
				t = t >>> 1;
			}
		}
		table[i] = t;
	}

	class Crc32 {

		constructor() {
			this.crc = -1;
		}

		append(data) {
			let crc = this.crc | 0;
			for (let offset = 0, length = data.length | 0; offset < length; offset++) {
				crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xFF];
			}
			this.crc = crc;
		}

		get() {
			return ~this.crc;
		}
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const ERR_INVALID_PASSWORD = "Invalid pasword";
	const BLOCK_LENGTH = 16;
	const RAW_FORMAT = "raw";
	const PBKDF2_ALGORITHM = { name: "PBKDF2" };
	const SIGNATURE_ALGORITHM = { name: "HMAC" };
	const HASH_FUNCTION = "SHA-1";
	const CRYPTO_KEY_ALGORITHM = { name: "AES-CTR" };
	const BASE_KEY_ALGORITHM = Object.assign({ hash: SIGNATURE_ALGORITHM }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_ALGORITHM = Object.assign({ iterations: 1000, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
	const AUTHENTICATION_ALGORITHM = Object.assign({ hash: HASH_FUNCTION }, SIGNATURE_ALGORITHM);
	const CRYPTO_ALGORITHM = Object.assign({ length: BLOCK_LENGTH }, CRYPTO_KEY_ALGORITHM);
	const DERIVED_BITS_USAGE = ["deriveBits"];
	const SIGN_USAGE = ["sign"];
	const SALT_LENGTH = [8, 12, 16];
	const KEY_LENGTH = [16, 24, 32];
	const SIGNATURE_LENGTH = 10;
	const COUNTER_DEFAULT_VALUE = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	const subtle = crypto.subtle;

	class Decrypt {

		constructor(password, signed, strength) {
			this.password = password;
			this.signed = signed;
			this.strength = strength - 1;
			this.input = signed && new Uint8Array(0);
			this.pendingInput = new Uint8Array(0);
		}

		async append(input) {
			const decrypt = async (offset = 0) => {
				if (offset + BLOCK_LENGTH <= bufferedInput.length - SIGNATURE_LENGTH) {
					const chunkToDecrypt = bufferedInput.subarray(offset, offset + BLOCK_LENGTH);
					const outputChunk = await subtle.decrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.key, chunkToDecrypt);
					incrementCounter(this.counter);
					output.set(new Uint8Array(outputChunk), offset);
					return decrypt(offset + BLOCK_LENGTH);
				} else {
					this.pendingInput = bufferedInput.subarray(offset);
					if (this.signed) {
						this.input = concat(this.input, input);
					}
					return output;
				}
			};

			if (this.password) {
				const preambule = input.subarray(0, SALT_LENGTH[this.strength] + 2);
				await createDecryptionKeys(this, preambule, this.password);
				this.password = null;
				input = input.subarray(SALT_LENGTH[this.strength] + 2);
			}
			let output = new Uint8Array(input.length - SIGNATURE_LENGTH - ((input.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
			let bufferedInput = input;
			if (this.pendingInput.length) {
				bufferedInput = concat(this.pendingInput, input);
				output = expand(output, bufferedInput.length - SIGNATURE_LENGTH - ((bufferedInput.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
			}
			return decrypt();
		}

		async flush() {
			const pendingInput = this.pendingInput;
			const keys = this.keys;
			const chunkToDecrypt = pendingInput.subarray(0, pendingInput.length - SIGNATURE_LENGTH);
			const originalSignatureArray = pendingInput.subarray(pendingInput.length - SIGNATURE_LENGTH);
			let decryptedChunkArray = new Uint8Array(0);
			if (chunkToDecrypt.length) {
				const decryptedChunk = await subtle.decrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), keys.key, chunkToDecrypt);
				decryptedChunkArray = new Uint8Array(decryptedChunk);
			}
			let valid = true;
			if (this.signed) {
				const signature = await subtle.sign(SIGNATURE_ALGORITHM, keys.authentication, this.input.subarray(0, this.input.length - SIGNATURE_LENGTH));
				const signatureArray = new Uint8Array(signature);
				this.input = null;
				for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
					if (signatureArray[indexSignature] != originalSignatureArray[indexSignature]) {
						valid = false;
					}
				}
			}
			return {
				valid,
				data: decryptedChunkArray
			};
		}

	}

	class Encrypt {

		constructor(password, strength) {
			this.password = password;
			this.strength = strength - 1;
			this.output = new Uint8Array(0);
			this.pendingInput = new Uint8Array(0);
		}

		async append(input) {
			const encrypt = async (offset = 0) => {
				if (offset + BLOCK_LENGTH <= input.length) {
					const chunkToEncrypt = input.subarray(offset, offset + BLOCK_LENGTH);
					const outputChunk = await subtle.encrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.key, chunkToEncrypt);
					incrementCounter(this.counter);
					output.set(new Uint8Array(outputChunk), offset + preambule.length);
					return encrypt(offset + BLOCK_LENGTH);
				} else {
					this.pendingInput = input.subarray(offset);
					this.output = concat(this.output, output);
					return output;
				}
			};

			let preambule = new Uint8Array(0);
			if (this.password) {
				preambule = await createEncryptionKeys(this, this.password);
				this.password = null;
			}
			let output = new Uint8Array(preambule.length + input.length - (input.length % BLOCK_LENGTH));
			output.set(preambule, 0);
			if (this.pendingInput.length) {
				input = concat(this.pendingInput, input);
				output = expand(output, input.length - (input.length % BLOCK_LENGTH));
			}
			return encrypt();
		}

		async flush() {
			let encryptedChunkArray = new Uint8Array(0);
			if (this.pendingInput.length) {
				const encryptedChunk = await subtle.encrypt(Object.assign({ counter: this.counter }, CRYPTO_ALGORITHM), this.keys.key, this.pendingInput);
				encryptedChunkArray = new Uint8Array(encryptedChunk);
				this.output = concat(this.output, encryptedChunkArray);
			}
			const signature = await subtle.sign(SIGNATURE_ALGORITHM, this.keys.authentication, this.output.subarray(SALT_LENGTH[this.strength] + 2));
			this.output = null;
			const signatureArray = new Uint8Array(signature).subarray(0, SIGNATURE_LENGTH);
			return {
				data: concat(encryptedChunkArray, signatureArray),
				signature: signatureArray
			};
		}
	}

	async function createDecryptionKeys(decrypt, preambuleArray, password) {
		await createKeys(decrypt, password, preambuleArray.subarray(0, SALT_LENGTH[decrypt.strength]), ["decrypt"]);
		const passwordVerification = preambuleArray.subarray(SALT_LENGTH[decrypt.strength]);
		const passwordVerificationKey = decrypt.keys.passwordVerification;
		if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
			throw new Error(ERR_INVALID_PASSWORD);
		}
	}

	async function createEncryptionKeys(encrypt, password) {
		const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH[encrypt.strength]));
		await createKeys(encrypt, password, salt, ["encrypt"]);
		return concat(salt, encrypt.keys.passwordVerification);
	}

	async function createKeys(target, password, salt, keyUsage) {
		target.counter = new Uint8Array(COUNTER_DEFAULT_VALUE);
		const encodedPassword = (new TextEncoder()).encode(password);
		const basekey = await subtle.importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), basekey, 8 * ((KEY_LENGTH[target.strength] * 2) + 2));
		const compositeKey = new Uint8Array(derivedBits);
		target.keys = {
			key: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(0, KEY_LENGTH[target.strength]), CRYPTO_KEY_ALGORITHM, true, keyUsage),
			authentication: await subtle.importKey(RAW_FORMAT, compositeKey.subarray(KEY_LENGTH[target.strength], KEY_LENGTH[target.strength] * 2), AUTHENTICATION_ALGORITHM, false, SIGN_USAGE),
			passwordVerification: compositeKey.subarray(KEY_LENGTH[target.strength] * 2)
		};
	}

	function incrementCounter(counter) {
		for (let indexCounter = 0; indexCounter < 16; indexCounter++) {
			if (counter[indexCounter] == 255) {
				counter[indexCounter] = 0;
			} else {
				counter[indexCounter]++;
				break;
			}
		}
	}

	function concat(leftArray, rightArray) {
		let array = leftArray;
		if (leftArray.length + rightArray.length) {
			array = new Uint8Array(leftArray.length + rightArray.length);
			array.set(leftArray, 0);
			array.set(rightArray, leftArray.length);
		}
		return array;
	}

	function expand(inputArray, length) {
		if (length && length > inputArray.length) {
			const array = inputArray;
			inputArray = new Uint8Array(length);
			inputArray.set(array, 0);
		}
		return inputArray;
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const CODEC_DEFLATE = "deflate";
	const CODEC_INFLATE = "inflate";
	const ERR_INVALID_SIGNATURE = "Invalid signature";

	class Inflate$1 {

		constructor(options) {
			this.signature = options.inputSignature;
			this.encrypted = Boolean(options.inputPassword);
			this.signed = options.inputSigned;
			this.compressed = options.inputCompressed;
			this.inflate = options.inputCompressed && new options.codecConstructor();
			this.crc32 = options.inputSigned && new Crc32();
			this.decrypt = this.encrypted && new Decrypt(options.inputPassword, options.inputSigned, options.inputEncryptionStrength);
		}

		async append(data) {
			if (this.encrypted) {
				data = await this.decrypt.append(data);
			}
			if (this.compressed && data.length) {
				data = await this.inflate.append(data);
			}
			if (!this.encrypted && this.signed) {
				this.crc32.append(data);
			}
			return data;
		}

		async flush() {
			let signature, data = new Uint8Array(0);
			if (this.encrypted) {
				const result = await this.decrypt.flush();
				if (!result.valid) {
					throw new Error(ERR_INVALID_SIGNATURE);
				}
				data = result.data;
			} else if (this.signed) {
				const dataViewSignature = new DataView(new Uint8Array(4).buffer);
				signature = this.crc32.get();
				dataViewSignature.setUint32(0, signature);
				if (this.signature != dataViewSignature.getUint32(0, false)) {
					throw new Error(ERR_INVALID_SIGNATURE);
				}
			}
			if (this.compressed) {
				data = (await this.inflate.append(data)) || new Uint8Array(0);
				await this.inflate.flush();
			}
			return { data, signature };
		}
	}

	class Deflate$1 {

		constructor(options) {
			this.encrypted = options.outputEncrypted;
			this.signed = options.outputSigned;
			this.compressed = options.outputCompressed;
			this.deflate = options.outputCompressed && new options.codecConstructor({ level: options.level || 5 });
			this.crc32 = options.outputSigned && new Crc32();
			this.encrypt = this.encrypted && new Encrypt(options.outputPassword, options.outputEncryptionStrength);
		}

		async append(inputData) {
			let data = inputData;
			if (this.compressed && inputData.length) {
				data = await this.deflate.append(inputData);
			}
			if (this.encrypted) {
				data = await this.encrypt.append(data);
			} else if (this.signed) {
				this.crc32.append(inputData);
			}
			return data;
		}

		async flush() {
			let data = new Uint8Array(0), signature;
			if (this.compressed) {
				data = (await this.deflate.flush()) || new Uint8Array(0);
			}
			if (this.encrypted) {
				data = await this.encrypt.append(data);
				const result = await this.encrypt.flush();
				signature = result.signature;
				const newData = new Uint8Array(data.length + result.data.length);
				newData.set(data, 0);
				newData.set(result.data, data.length);
				data = newData;
			} else if (this.signed) {
				signature = this.crc32.get();
			}
			return { data, signature };
		}
	}

	function createCodec(options) {
		if (options.codecType.startsWith(CODEC_DEFLATE)) {
			return new Deflate$1(options);
		} else if (options.codecType.startsWith(CODEC_INFLATE)) {
			return new Inflate$1(options);
		}
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const MESSAGE_INIT = "init";
	const MESSAGE_APPEND = "append";
	const MESSAGE_FLUSH = "flush";
	const MESSAGE_EVENT_TYPE = "message";

	var getWorker = (workerData, options, onTaskFinished, webWorker, scripts) => {
		workerData.busy = true;
		workerData.options = options;
		workerData.scripts = scripts;
		workerData.webWorker = webWorker;
		workerData.onTaskFinished = () => {
			workerData.busy = false;
			const terminateWorker = onTaskFinished(workerData);
			if (terminateWorker && workerData.worker) {
				workerData.worker.terminate();
			}
		};
		return webWorker ? createWebWorkerInterface(workerData) : createWorkerInterface(workerData);
	};

	function createWorkerInterface(workerData) {
		const interfaceCodec = createCodec(workerData.options);
		return {
			async append(data) {
				try {
					return await interfaceCodec.append(data);
				} catch (error) {
					workerData.onTaskFinished();
					throw error;
				}
			},
			async flush() {
				try {
					return await interfaceCodec.flush();
				} finally {
					workerData.onTaskFinished();
				}
			}
		};
	}

	function createWebWorkerInterface(workerData) {
		let messageTask;
		if (!workerData.interface) {
			workerData.worker = new Worker(new URL(workerData.scripts[0], (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('zip-full.js', document.baseURI).href))));
			workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
			workerData.interface = {
				append(data) {
					return initAndSendMessage({ type: MESSAGE_APPEND, data });
				},
				flush() {
					return initAndSendMessage({ type: MESSAGE_FLUSH });
				}
			};
		}
		return workerData.interface;

		async function initAndSendMessage(message) {
			if (!messageTask) {
				const options = workerData.options;
				const scripts = workerData.scripts.slice(1);
				await sendMessage(Object.assign({
					scripts,
					type: MESSAGE_INIT, options: {
						codecType: options.codecType,
						inputPassword: options.inputPassword,
						inputEncryptionStrength: options.inputEncryptionStrength,
						inputSigned: options.inputSigned,
						inputSignature: options.signature,
						inputCompressed: options.inputCompressed,
						inputEncrypted: options.inputEncrypted,
						level: options.level,
						outputPassword: options.outputPassword,
						outputEncryptionStrength: options.outputEncryptionStrength,
						outputSigned: options.outputSigned,
						outputCompressed: options.outputCompressed,
						outputEncrypted: options.outputEncrypted
					}
				}));
			}
			return sendMessage(message);
		}

		function sendMessage(message) {
			const worker = workerData.worker;
			const result = new Promise((resolve, reject) => messageTask = { resolve, reject });
			try {
				if (message.data) {
					try {
						worker.postMessage(message, [message.data.buffer]);
					} catch (error) {
						worker.postMessage(message);
					}
				} else {
					worker.postMessage(message);
				}
			} catch (error) {
				messageTask.reject(error);
				messageTask = null;
				workerData.onTaskFinished();
			}
			return result;
		}

		function onMessage(event) {
			const message = event.data;
			if (messageTask) {
				const reponseError = message.error;
				const type = message.type;
				if (reponseError) {
					const error = new Error(reponseError.message);
					error.stack = reponseError.stack;
					messageTask.reject(error);
					messageTask = null;
					workerData.onTaskFinished();
				} else if (type == MESSAGE_INIT || type == MESSAGE_FLUSH || type == MESSAGE_APPEND) {
					const data = message.data;
					if (type == MESSAGE_FLUSH) {
						messageTask.resolve({ data: new Uint8Array(data), signature: message.signature });
						messageTask = null;
						workerData.onTaskFinished();
					} else {
						messageTask.resolve(data && new Uint8Array(data));
					}
				}
			}
		}
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	let pool = [], pendingRequests = [];

	function createCodec$1(options, config) {
		const streamCopy =
			!options.inputCompressed && !options.inputSigned && !options.inputEncrypted &&
			!options.outputCompressed && !options.outputSigned && !options.outputEncrypted;
		const webWorker = !streamCopy && (options.useWebWorkers || (options.useWebWorkers === undefined && config.useWebWorkers));
		const scripts = webWorker && config.workerScripts ? config.workerScripts[options.codecType] : [];
		if (pool.length < config.maxWorkers) {
			const workerData = {};
			pool.push(workerData);
			return getWorker(workerData, options, onTaskFinished, webWorker, scripts);
		} else {
			const workerData = pool.find(workerData => !workerData.busy);
			if (workerData) {
				return getWorker(workerData, options, onTaskFinished, webWorker, scripts);
			} else {
				return new Promise(resolve => pendingRequests.push({ resolve, options, webWorker, scripts }));
			}
		}
	}

	function onTaskFinished(workerData) {
		const finished = !pendingRequests.length;
		if (finished) {
			pool = pool.filter(data => data != workerData);
		} else {
			const [{ resolve, options, webWorker, scripts }] = pendingRequests.splice(0, 1);
			resolve(getWorker(workerData, options, onTaskFinished, webWorker, scripts));
		}
		return finished;
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const MINIMUM_CHUNK_SIZE = 64;

	async function processData(codec, reader, writer, offset, inputLength, config, options) {
		const chunkSize = Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
		return processChunk();

		async function processChunk(chunkOffset = 0, outputLength = 0) {
			if (chunkOffset < inputLength) {
				const inputData = await reader.readUint8Array(chunkOffset + offset, Math.min(chunkSize, inputLength - chunkOffset));
				const chunkLength = inputData.length;
				const data = await codec.append(inputData);
				outputLength += await writeData(writer, data);
				if (options.onprogress) {
					options.onprogress(chunkOffset + chunkLength, inputLength);
				}
				return processChunk(chunkOffset + chunkSize, outputLength);
			} else {
				const result = await codec.flush();
				outputLength += await writeData(writer, result.data);
				return { signature: result.signature, length: outputLength };
			}
		}
	}

	async function writeData(writer, data) {
		if (data.length) {
			await writer.writeUint8Array(data);
		}
		return data.length;
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const PROPERTY_NAMES = [
		"filename", "rawFilename", "directory", "encrypted", "compressedSize", "uncompressedSize",
		"lastModDate", "rawLastModDate", "comment", "rawComment", "signature", "extraField",
		"rawExtraField", "bitFlag", "extraFieldZip64", "extraFieldUnicodePath", "extraFieldUnicodeComment",
		"extraFieldAES", "filenameUTF8", "commentUTF8", "offset", "zip64"];

	class Entry {

		constructor(data) {
			PROPERTY_NAMES.forEach(name => this[name] = data[name]);
		}

	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const ERR_BAD_FORMAT = "File format is not recognized";
	const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
	const ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
	const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
	const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
	const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
	const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
	const ERR_ENCRYPTED = "File contains encrypted entry";
	const ERR_USUPPORTED_ENCRYPTION = "Encryption method not supported";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const CHARSET_UTF8 = "utf-8";
	const ZIP64_PROPERTIES = ["uncompressedSize", "compressedSize", "offset"];

	class ZipReader {

		constructor(reader, options = {}, config = {}) {
			this.reader = reader;
			this.options = options;
			this.config = config;
		}

		async getEntries(options = {}) {
			const reader = this.reader;
			if (!reader.initialized) {
				await reader.init();
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);
			if (!endOfDirectoryInfo) {
				throw new Error(ERR_EOCDR_NOT_FOUND);
			}
			const endOfDirectoryView = new DataView(endOfDirectoryInfo.buffer);
			let zip64;
			let directoryDataLength = getUint32(endOfDirectoryView, 12);
			let directoryDataOffset = getUint32(endOfDirectoryView, 16);
			let filesLength = getUint16(endOfDirectoryView, 8), prependedBytesLength = 0;
			if (directoryDataOffset == MAX_32_BITS || filesLength == MAX_16_BITS) {
				zip64 = true;
				const endOfDirectoryLocatorArray = await reader.readUint8Array(endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
				const endOfDirectoryLocatorView = new DataView(endOfDirectoryLocatorArray.buffer);
				if (Number(getUint32(endOfDirectoryLocatorView, 0)) != ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);
				}
				directoryDataOffset = Number(getBigUint64(endOfDirectoryLocatorView, 8));
				let endOfDirectoryArray = await reader.readUint8Array(directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
				let endOfDirectoryView = new DataView(endOfDirectoryArray.buffer);
				if (Number(getUint32(endOfDirectoryView, 0)) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE &&
					directoryDataOffset != endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
					prependedBytesLength = directoryDataOffset - originalDirectoryDataOffset;
					endOfDirectoryArray = await reader.readUint8Array(directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
					endOfDirectoryView = new DataView(endOfDirectoryArray.buffer);
				}
				if (Number(getUint32(endOfDirectoryView, 0)) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
					throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
				}
				filesLength = Number(getBigUint64(endOfDirectoryView, 24));
				directoryDataLength = Number(getBigUint64(endOfDirectoryLocatorView, 4));
				directoryDataOffset -= Number(getBigUint64(endOfDirectoryView, 40));
			}
			if (directoryDataOffset < 0 || (!zip64 && (directoryDataOffset >= reader.size || filesLength >= MAX_16_BITS))) {
				throw new Error(ERR_BAD_FORMAT);
			}
			let offset = 0;
			let directoryArray = await reader.readUint8Array(directoryDataOffset, reader.size - directoryDataOffset);
			let directoryView = new DataView(directoryArray.buffer);
			if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE &&
				directoryDataOffset != endOfDirectoryInfo.offset - directoryDataLength) {
				const originalDirectoryDataOffset = directoryDataOffset;
				directoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
				prependedBytesLength = directoryDataOffset - originalDirectoryDataOffset;
				directoryArray = await reader.readUint8Array(directoryDataOffset, reader.size - directoryDataOffset);
				directoryView = new DataView(directoryArray.buffer);
			}
			if (directoryDataOffset < 0) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const entries = [];
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry(this.reader, this.config, this.options);
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
					throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				}
				fileEntry.compressedSize = 0;
				fileEntry.uncompressedSize = 0;
				readCommonHeader(fileEntry, directoryView, offset + 6);
				fileEntry.commentLength = getUint16(directoryView, offset + 32);
				fileEntry.directory = (getUint8(directoryView, offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK;
				fileEntry.offset = getUint32(directoryView, offset + 42) + prependedBytesLength;
				fileEntry.rawFilename = directoryArray.subarray(offset + 46, offset + 46 + fileEntry.filenameLength);
				const filenameEncoding = getOptionValue(this, options, "filenameEncoding");
				fileEntry.filenameUTF8 = fileEntry.commentUTF8 = Boolean(fileEntry.bitFlag.languageEncodingFlag);
				fileEntry.filename = decodeString(fileEntry.rawFilename, fileEntry.filenameUTF8 ? CHARSET_UTF8 : filenameEncoding);
				if (!fileEntry.directory && fileEntry.filename.endsWith(DIRECTORY_SIGNATURE)) {
					fileEntry.directory = true;
				}
				fileEntry.rawExtraField = directoryArray.subarray(offset + 46 + fileEntry.filenameLength, offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength);
				fileEntry.rawComment = directoryArray.subarray(offset + 46 + fileEntry.filenameLength + fileEntry.extraFieldLength, offset + 46
					+ fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength);
				const commentEncoding = getOptionValue(this, options, "commentEncoding");
				fileEntry.comment = decodeString(fileEntry.rawComment, fileEntry.commentUTF8 ? CHARSET_UTF8 : commentEncoding);
				readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
				const entry = new Entry(fileEntry);
				entry.getData = (writer, options) => fileEntry.getData(writer, options);
				entries.push(entry);
				offset += 46 + fileEntry.filenameLength + fileEntry.extraFieldLength + fileEntry.commentLength;
			}
			return entries;
		}

		async close() {
		}
	}

	class ZipEntry {

		constructor(reader, config, options) {
			this.reader = reader;
			this.config = config;
			this.options = options;
		}

		async getData(writer, options = {}) {
			const reader = this.reader;
			if (!reader.initialized) {
				await reader.init();
			}
			const dataArray = await reader.readUint8Array(this.offset, 30);
			const dataView = new DataView(dataArray.buffer);
			const password = getOptionValue(this, options, "password");
			const inputPassword = password && password.length && password;
			if (this.extraFieldAES) {
				if (this.extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION);
				}
			}
			if (this.compressionMethod != COMPRESSION_METHOD_STORE && this.compressionMethod != COMPRESSION_METHOD_DEFLATE) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
			}
			const localDirectory = this.localDirectory = {};
			readCommonHeader(localDirectory, dataView, 4);
			localDirectory.rawExtraField = dataArray.subarray(this.offset + 30 + localDirectory.filenameLength, this.offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength);
			readCommonFooter(this, localDirectory, dataView, 4);
			let dataOffset = this.offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength;
			const inputEncrypted = this.bitFlag.encrypted && localDirectory.bitFlag.encrypted;
			const inputEncryptionStrength = this.extraFieldAES && this.extraFieldAES.strength;
			if (inputEncrypted) {
				if (inputEncryptionStrength === undefined) {
					throw new Error(ERR_USUPPORTED_ENCRYPTION);
				} else if (!inputPassword) {
					throw new Error(ERR_ENCRYPTED);
				}
			}
			const codec = await createCodec$1({
				codecType: CODEC_INFLATE,
				codecConstructor: this.config.Inflate,
				inputPassword,
				inputEncryptionStrength,
				inputSigned: getOptionValue(this, options, "checkSignature"),
				inputSignature: this.signature,
				inputCompressed: this.compressionMethod != 0,
				inputEncrypted,
				useWebWorkers: getOptionValue(this, options, "useWebWorkers")
			}, this.config);
			if (!writer.initialized) {
				await writer.init();
			}
			await processData(codec, reader, writer, dataOffset, this.compressedSize, this.config, { onprogress: options.onprogress });
			return writer.getData();
		}
	}

	function readCommonHeader(directory, dataView, offset) {
		directory.version = getUint16(dataView, offset);
		const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
		directory.bitFlag = {
			encrypted: (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED,
			level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
			dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
			languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
		};
		directory.encrypted = directory.bitFlag.encrypted;
		directory.rawLastModDate = getUint32(dataView, offset + 6);
		directory.lastModDate = getDate(directory.rawLastModDate);
		directory.filenameLength = getUint16(dataView, offset + 22);
		directory.extraFieldLength = getUint16(dataView, offset + 24);
	}

	function readCommonFooter(fileEntry, directory, dataView, offset) {
		const rawExtraField = directory.rawExtraField;
		const extraField = directory.extraField = new Map();
		const rawExtraFieldView = new DataView(new Uint8Array(rawExtraField).buffer);
		let offsetExtraField = 0;
		try {
			while (offsetExtraField < rawExtraField.length) {
				const type = getUint16(rawExtraFieldView, offsetExtraField);
				const size = getUint16(rawExtraFieldView, offsetExtraField + 2);
				extraField.set(type, {
					type,
					data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
				});
				offsetExtraField += 4 + size;
			}
		} catch (error) {
			// ignored
		}
		const compressionMethod = getUint16(dataView, offset + 4);
		directory.signature = getUint32(dataView, offset + 10);
		directory.uncompressedSize = getUint32(dataView, offset + 18);
		directory.compressedSize = getUint32(dataView, offset + 14);
		const extraFieldZip64 = directory.extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
		if (extraFieldZip64) {
			readExtraFieldZip64(extraFieldZip64, directory);
		}
		const extraFieldUnicodePath = directory.extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
		if (extraFieldUnicodePath) {
			readExtraFieldUnicode(extraFieldUnicodePath, "filename", "rawFilename", directory, fileEntry);
		}
		let extraFieldUnicodeComment = directory.extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
		if (extraFieldUnicodeComment) {
			readExtraFieldUnicode(extraFieldUnicodeComment, "comment", "rawComment", directory, fileEntry);
		}
		const extraFieldAES = directory.extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
		if (extraFieldAES) {
			readExtraFieldAES(extraFieldAES, directory, compressionMethod);
		} else {
			directory.compressionMethod = compressionMethod;
		}
		if (directory.compressionMethod == COMPRESSION_METHOD_DEFLATE) {
			directory.bitFlag.enhancedDeflating = (directory.rawBitFlag & BITFLAG_ENHANCED_DEFLATING) != BITFLAG_ENHANCED_DEFLATING;
		}
	}

	function readExtraFieldZip64(extraFieldZip64, directory) {
		directory.zip64 = true;
		const extraFieldView = new DataView(extraFieldZip64.data.buffer);
		extraFieldZip64.values = [];
		for (let indexValue = 0; indexValue < Math.floor(extraFieldZip64.data.length / 8); indexValue++) {
			extraFieldZip64.values.push(Number(getBigUint64(extraFieldView, 0 + indexValue * 8)));
		}
		const missingProperties = ZIP64_PROPERTIES.filter(propertyName => directory[propertyName] == MAX_32_BITS);
		for (let indexMissingProperty = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
			extraFieldZip64[missingProperties[indexMissingProperty]] = extraFieldZip64.values[indexMissingProperty];
		}
		ZIP64_PROPERTIES.forEach(propertyName => {
			if (directory[propertyName] == MAX_32_BITS) {
				if (extraFieldZip64 && extraFieldZip64[propertyName] !== undefined) {
					directory[propertyName] = extraFieldZip64[propertyName];
				} else {
					throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
				}
			}
		});
	}

	function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
		const extraFieldView = new DataView(extraFieldUnicode.data.buffer);
		extraFieldUnicode.version = getUint8(extraFieldView, 0);
		extraFieldUnicode.signature = getUint32(extraFieldView, 1);
		const crc32 = new Crc32();
		crc32.append(fileEntry[rawPropertyName]);
		const dataViewSignature = new DataView(new Uint8Array(4).buffer);
		dataViewSignature.setUint32(0, crc32.get(), true);
		extraFieldUnicode[propertyName] = (new TextDecoder()).decode(extraFieldUnicode.data.subarray(5));
		extraFieldUnicode.valid = !fileEntry.bitFlag.languageEncodingFlag && extraFieldUnicode.signature == getUint32(dataViewSignature, 0);
		if (extraFieldUnicode.valid) {
			directory[propertyName] = extraFieldUnicode[propertyName];
			directory[propertyName + "UTF8"] = true;
		}
	}

	function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
		if (extraFieldAES) {
			const extraFieldView = new DataView(extraFieldAES.data.buffer);
			extraFieldAES.vendorVersion = getUint8(extraFieldView, 0);
			extraFieldAES.vendorId = getUint8(extraFieldView, 2);
			const strength = getUint8(extraFieldView, 4);
			extraFieldAES.strength = strength;
			extraFieldAES.originalCompressionMethod = compressionMethod;
			directory.compressionMethod = extraFieldAES.compressionMethod = getUint16(extraFieldView, 5);
		} else {
			directory.compressionMethod = compressionMethod;
		}
	}

	async function seekSignature(reader, signature, minimumBytes, maximumLength) {
		const signatureArray = new Uint8Array(4);
		const signatureView = new DataView(signatureArray.buffer);
		setUint32(signatureView, 0, signature);
		const maximumBytes = minimumBytes + maximumLength;
		let offset = minimumBytes;
		let dataInfo = await seek(offset);
		if (!dataInfo) {
			dataInfo = await seek(Math.min(maximumBytes, reader.size));
		}
		return dataInfo;

		async function seek(length) {
			const offset = reader.size - length;
			const bytes = await reader.readUint8Array(offset, length);
			for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
				if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] &&
					bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) {
					return {
						offset,
						buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
					};
				}
			}
		}
	}

	function getOptionValue(zipReader, options, name) {
		return options[name] === undefined ? zipReader.options[name] : options[name];
	}

	function decodeString(value, encoding) {
		if (!encoding || encoding.trim().toLowerCase() == "cp437") {
			return decodeCP437(value);
		} else {
			return (new TextDecoder(encoding)).decode(value);
		}
	}

	function getDate(timeRaw) {
		const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
		try {
			return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
		} catch (error) {
			// ignored
		}
	}

	function getUint8(view, offset) {
		return view.getUint8(offset);
	}

	function getUint16(view, offset) {
		return view.getUint16(offset, true);
	}

	function getUint32(view, offset) {
		return view.getUint32(offset, true);
	}

	function getBigUint64(view, offset) {
		return view.getBigUint64(offset, true);
	}

	function setUint32(view, offset, value) {
		view.setUint32(offset, value, true);
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	class ZipReader$1 extends ZipReader {

		constructor(reader, options) {
			super(reader, options, getConfiguration());
		}
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	const ERR_DUPLICATED_NAME = "File already exists";
	const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
	const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
	const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
	const ERR_INVALID_VERSION = "Version exceeds 65535";
	const ERR_INVALID_DATE = "The modification date must be between 1/1/1980 and 12/31/2107";
	const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";

	const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
	const EXTRAFIELD_LENGTH_ZIP64 = 24;

	class ZipWriter {

		constructor(writer, options = {}, config = {}) {
			this.writer = writer;
			this.options = options;
			this.config = config;
			this.files = new Map();
			this.offset = writer.size;
		}

		async add(name = "", reader, options = {}) {
			name = name.trim();
			if (options.directory && (!name.endsWith(DIRECTORY_SIGNATURE))) {
				name += DIRECTORY_SIGNATURE;
			} else {
				options.directory = name.endsWith(DIRECTORY_SIGNATURE);
			}
			if (this.files.has(name)) {
				throw new Error(ERR_DUPLICATED_NAME);
			}
			const rawFilename = (new TextEncoder()).encode(name);
			if (rawFilename.length > MAX_16_BITS) {
				throw new Error(ERR_INVALID_ENTRY_NAME);
			}
			const comment = options.comment || "";
			const rawComment = (new TextEncoder()).encode(comment);
			if (rawComment.length > MAX_16_BITS) {
				throw new Error(ERR_INVALID_ENTRY_COMMENT);
			}
			const version = this.options.version || options.version || 0;
			if (version > MAX_16_BITS) {
				throw new Error(ERR_INVALID_VERSION);
			}
			const lastModDate = options.lastModDate || new Date();
			if (lastModDate < MIN_DATE || lastModDate > MAX_DATE) {
				throw new Error(ERR_INVALID_DATE);
			}
			const password = getOptionValue$1(this, options, "password");
			const encryptionStrength = getOptionValue$1(this, options, "encryptionStrength") || 3;
			if (password !== undefined && encryptionStrength !== undefined && (encryptionStrength < 1 || encryptionStrength > 3)) {
				throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
			}
			if (reader && !reader.initialized) {
				await reader.init();
			}
			let rawExtraField = new Uint8Array(0);
			const extraField = options.extraField;
			if (extraField) {
				let extraFieldSize = 4, offset = 0;
				extraField.forEach(data => extraFieldSize += data.length);
				rawExtraField = new Uint8Array(extraFieldSize);
				extraField.forEach((data, type) => {
					if (type > MAX_16_BITS) {
						throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
					}
					if (data.length > MAX_16_BITS) {
						throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
					}
					rawExtraField.set(new Uint16Array([type]), offset);
					rawExtraField.set(new Uint16Array([data.length]), offset + 2);
					rawExtraField.set(data, offset + 4);
					offset += 4 + data.length;
				});
			}
			const zip64 = options.zip64 || this.options.zip64 || this.offset >= MAX_32_BITS || (reader && (reader.size >= MAX_32_BITS || this.offset + reader.size >= MAX_32_BITS));
			const level = getOptionValue$1(this, options, "level");
			const useWebWorkers = getOptionValue$1(this, options, "useWebWorkers");
			const bufferedWrite = getOptionValue$1(this, options, "bufferedWrite");
			const keepOrder = getOptionValue$1(this, options, "keepOrder");
			const fileEntry = await addFile(this, name, reader, Object.assign({}, options,
				{ rawFilename, rawComment, version, lastModDate, rawExtraField, zip64, password, level, useWebWorkers, encryptionStrength, bufferedWrite, keepOrder }));
			fileEntry.filename = name;
			fileEntry.comment = comment;
			fileEntry.extraField = extraField;
			return new Entry(fileEntry);
		}

		async close(comment = new Uint8Array(0)) {
			const writer = this.writer;
			const files = this.files;
			let offset = 0, directoryDataLength = 0, directoryOffset = this.offset, filesLength = files.size;
			for (const [, fileEntry] of files) {
				directoryDataLength += 46 + fileEntry.rawFilename.length + fileEntry.rawComment.length + fileEntry.rawExtraFieldZip64.length + fileEntry.rawExtraFieldAES.length + fileEntry.rawExtraField.length;
			}
			const zip64 = this.options.zip64 || directoryOffset + directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS;
			const directoryArray = new Uint8Array(directoryDataLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
			const directoryView = new DataView(directoryArray.buffer);
			if (comment.length) {
				if (comment.length <= MAX_16_BITS) {
					setUint16(directoryView, offset + 20, comment.length);
				} else {
					throw new Error(ERR_INVALID_COMMENT);
				}
			}
			for (const [, fileEntry] of files) {
				const rawFilename = fileEntry.rawFilename;
				const rawExtraFieldZip64 = fileEntry.rawExtraFieldZip64;
				const rawExtraFieldAES = fileEntry.rawExtraFieldAES;
				const extraFieldLength = rawExtraFieldZip64.length + rawExtraFieldAES.length + fileEntry.rawExtraField.length;
				setUint32$1(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
				setUint16(directoryView, offset + 4, fileEntry.version);
				directoryArray.set(fileEntry.headerArray, offset + 6);
				setUint16(directoryView, offset + 30, extraFieldLength);
				setUint16(directoryView, offset + 32, fileEntry.rawComment.length);
				if (fileEntry.directory) {
					setUint8(directoryView, offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
				}
				if (fileEntry.zip64) {
					setUint32$1(directoryView, offset + 42, MAX_32_BITS);
				} else {
					setUint32$1(directoryView, offset + 42, fileEntry.offset);
				}
				directoryArray.set(rawFilename, offset + 46);
				directoryArray.set(rawExtraFieldZip64, offset + 46 + rawFilename.length);
				directoryArray.set(rawExtraFieldAES, offset + 46 + rawFilename.length + rawExtraFieldZip64.length);
				directoryArray.set(fileEntry.rawExtraField, 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length);
				directoryArray.set(fileEntry.rawComment, offset + 46 + rawFilename.length + extraFieldLength);
				offset += 46 + rawFilename.length + extraFieldLength + fileEntry.rawComment.length;
			}
			if (zip64) {
				setUint32$1(directoryView, offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
				setBigUint64(directoryView, offset + 4, BigInt(44));
				setUint16(directoryView, offset + 12, 45);
				setUint16(directoryView, offset + 14, 45);
				setBigUint64(directoryView, offset + 24, BigInt(filesLength));
				setBigUint64(directoryView, offset + 32, BigInt(filesLength));
				setBigUint64(directoryView, offset + 40, BigInt(directoryDataLength));
				setBigUint64(directoryView, offset + 48, BigInt(directoryOffset));
				setUint32$1(directoryView, offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
				setBigUint64(directoryView, offset + 64, BigInt(directoryOffset + directoryDataLength));
				setUint32$1(directoryView, offset + 72, ZIP64_TOTAL_NUMBER_OF_DISKS);
				filesLength = MAX_16_BITS;
				directoryOffset = MAX_32_BITS;
				offset += 76;
			}
			setUint32$1(directoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
			setUint16(directoryView, offset + 8, filesLength);
			setUint16(directoryView, offset + 10, filesLength);
			setUint32$1(directoryView, offset + 12, directoryDataLength);
			setUint32$1(directoryView, offset + 16, directoryOffset);
			await writer.writeUint8Array(directoryArray);
			if (comment.length) {
				await writer.writeUint8Array(comment);
			}
			return writer.getData();
		}
	}

	async function addFile(zipWriter, name, reader, options) {
		const files = zipWriter.files, writer = zipWriter.writer;
		files.set(name, null);
		let resolveLockWrite, lockPreviousFile, resolveLockPreviousFile;
		try {
			let fileWriter, fileEntry;
			try {
				if (options.keepOrder) {
					lockPreviousFile = zipWriter.lockPreviousFile;
					zipWriter.lockPreviousFile = new Promise(resolve => resolveLockPreviousFile = resolve);
				}
				if (options.bufferedWrite || zipWriter.lockWrite) {
					fileWriter = new Uint8ArrayWriter();
					await fileWriter.init();
				} else {
					zipWriter.lockWrite = new Promise(resolve => resolveLockWrite = resolve);
					if (!writer.initialized) {
						await writer.init();
					}
					fileWriter = writer;
				}
				fileEntry = await createFileEntry(reader, fileWriter, zipWriter.config, options);
			} catch (error) {
				files.delete(name);
				throw error;
			}
			files.set(name, fileEntry);
			if (fileWriter != writer) {
				if (zipWriter.lockWrite) {
					await zipWriter.lockWrite;
				}
				if (lockPreviousFile) {
					await lockPreviousFile;
				}
				await writer.writeUint8Array(fileWriter.getData());
			}
			fileEntry.offset = zipWriter.offset;
			if (fileEntry.zip64) {
				const rawExtraFieldZip64View = new DataView(fileEntry.rawExtraFieldZip64.buffer);
				setBigUint64(rawExtraFieldZip64View, 20, BigInt(fileEntry.offset));
			}
			zipWriter.offset += fileEntry.length;
			return fileEntry;
		} finally {
			if (resolveLockPreviousFile) {
				resolveLockPreviousFile();
			}
			if (resolveLockWrite) {
				zipWriter.lockWrite = null;
				resolveLockWrite();
			}
		}
	}

	async function createFileEntry(reader, writer, config, options) {
		const rawFilename = options.rawFilename;
		const lastModDate = options.lastModDate;
		const outputPassword = options.password;
		const outputEncrypted = Boolean(outputPassword && outputPassword.length);
		const level = options.level;
		const outputCompressed = level !== 0 && !options.directory;
		const zip64 = options.zip64;
		let rawExtraFieldAES, outputEncryptionStrength;
		if (outputEncrypted) {
			rawExtraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
			const extraFieldAESView = new DataView(rawExtraFieldAES.buffer);
			setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
			rawExtraFieldAES.set(EXTRAFIELD_DATA_AES, 2);
			outputEncryptionStrength = options.encryptionStrength;
			setUint8(extraFieldAESView, 8, outputEncryptionStrength);
		} else {
			rawExtraFieldAES = new Uint8Array(0);
		}
		const fileEntry = {
			version: options.version || VERSION_DEFLATE,
			zip64,
			directory: Boolean(options.directory),
			filenameUTF8: true,
			rawFilename,
			commentUTF8: true,
			rawComment: options.rawComment,
			rawExtraFieldZip64: zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array(0),
			rawExtraFieldAES: rawExtraFieldAES,
			rawExtraField: options.rawExtraField
		};
		let bitFlag = BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING_FLAG;
		let compressionMethod = COMPRESSION_METHOD_STORE;
		if (outputCompressed) {
			compressionMethod = COMPRESSION_METHOD_DEFLATE;
		}
		if (zip64) {
			fileEntry.version = fileEntry.version > VERSION_ZIP64 ? fileEntry.version : VERSION_ZIP64;
		}
		if (outputEncrypted) {
			fileEntry.version = fileEntry.version > VERSION_AES ? fileEntry.version : VERSION_AES;
			bitFlag = bitFlag | BITFLAG_ENCRYPTED;
			compressionMethod = COMPRESSION_METHOD_AES;
			if (outputCompressed) {
				fileEntry.rawExtraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
			}
		}
		const headerArray = fileEntry.headerArray = new Uint8Array(26);
		const headerView = new DataView(headerArray.buffer);
		setUint16(headerView, 0, fileEntry.version);
		setUint16(headerView, 2, bitFlag);
		setUint16(headerView, 4, compressionMethod);
		setUint16(headerView, 6, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
		setUint16(headerView, 8, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
		setUint16(headerView, 22, rawFilename.length);
		setUint16(headerView, 24, 0);
		const rawLastModDate = headerView.getUint32(6, true);
		const fileDataArray = new Uint8Array(30 + rawFilename.length);
		const fileDataView = new DataView(fileDataArray.buffer);
		setUint32$1(fileDataView, 0, LOCAL_FILE_HEADER_SIGNATURE);
		fileDataArray.set(headerArray, 4);
		fileDataArray.set(rawFilename, 30);
		let result, uncompressedSize = 0, compressedSize = 0;
		if (reader) {
			uncompressedSize = reader.size;
			const codec = await createCodec$1({
				codecType: CODEC_DEFLATE,
				codecConstructor: config.Deflate,
				level,
				outputPassword,
				outputEncryptionStrength,
				outputSigned: true,
				outputCompressed,
				outputEncrypted,
				useWebWorkers: options.useWebWorkers
			}, config);
			await writer.writeUint8Array(fileDataArray);
			result = await processData(codec, reader, writer, 0, uncompressedSize, config, { onprogress: options.onprogress });
			compressedSize = result.length;
		} else {
			await writer.writeUint8Array(fileDataArray);
		}
		const footerArray = new Uint8Array(zip64 ? 24 : 16);
		const footerView = new DataView(footerArray.buffer);
		setUint32$1(footerView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
		if (reader) {
			if (!outputEncrypted && result.signature !== undefined) {
				setUint32$1(headerView, 10, result.signature);
				setUint32$1(footerView, 4, result.signature);
				fileEntry.signature = result.signature;
			}
			if (zip64) {
				const rawExtraFieldZip64View = new DataView(fileEntry.rawExtraFieldZip64.buffer);
				setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
				setUint16(rawExtraFieldZip64View, 2, EXTRAFIELD_LENGTH_ZIP64);
				setUint32$1(headerView, 14, MAX_32_BITS);
				setBigUint64(footerView, 8, BigInt(compressedSize));
				setBigUint64(rawExtraFieldZip64View, 12, BigInt(compressedSize));
				setUint32$1(headerView, 18, MAX_32_BITS);
				setBigUint64(footerView, 16, BigInt(uncompressedSize));
				setBigUint64(rawExtraFieldZip64View, 4, BigInt(uncompressedSize));
			} else {
				setUint32$1(headerView, 14, compressedSize);
				setUint32$1(footerView, 8, compressedSize);
				setUint32$1(headerView, 18, uncompressedSize);
				setUint32$1(footerView, 12, uncompressedSize);
			}
		}
		await writer.writeUint8Array(footerArray);
		fileEntry.compressedSize = compressedSize;
		fileEntry.uncompressedSize = uncompressedSize;
		fileEntry.lastModDate = lastModDate;
		fileEntry.rawLastModDate = rawLastModDate;
		fileEntry.encrypted = outputEncrypted;
		fileEntry.length = fileDataArray.length + (result ? result.length : 0) + footerArray.length;
		return fileEntry;
	}

	function getOptionValue$1(zipWriter, options, name) {
		return options[name] === undefined ? zipWriter.options[name] : options[name];
	}

	function setUint8(view, offset, value) {
		view.setUint8(offset, value);
	}

	function setUint16(view, offset, value) {
		view.setUint16(offset, value, true);
	}

	function setUint32$1(view, offset, value) {
		view.setUint32(offset, value, true);
	}

	function setBigUint64(view, offset, value) {
		view.setBigUint64(offset, value, true);
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	class ZipWriter$1 extends ZipWriter {

		constructor(writer, options) {
			super(writer, options, getConfiguration());
		}
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	function getMimeType() {
		return "application/octet-stream";
	}

	/*
	 Copyright (c) 2021 Gildas Lormeau. All rights reserved.

	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 1. Redistributions of source code must retain the above copyright notice,
	 this list of conditions and the following disclaimer.

	 2. Redistributions in binary form must reproduce the above copyright 
	 notice, this list of conditions and the following disclaimer in 
	 the documentation and/or other materials provided with the distribution.

	 3. The names of the authors may not be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	configureWebWorker();
	configure({ Deflate: ZipDeflate, Inflate: ZipInflate });

	exports.BlobReader = BlobReader;
	exports.BlobWriter = BlobWriter;
	exports.Data64URIReader = Data64URIReader;
	exports.Data64URIWriter = Data64URIWriter;
	exports.ERR_BAD_FORMAT = ERR_BAD_FORMAT;
	exports.ERR_CENTRAL_DIRECTORY_NOT_FOUND = ERR_CENTRAL_DIRECTORY_NOT_FOUND;
	exports.ERR_DUPLICATED_NAME = ERR_DUPLICATED_NAME;
	exports.ERR_ENCRYPTED = ERR_ENCRYPTED;
	exports.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND;
	exports.ERR_EOCDR_NOT_FOUND = ERR_EOCDR_NOT_FOUND;
	exports.ERR_EOCDR_ZIP64_NOT_FOUND = ERR_EOCDR_ZIP64_NOT_FOUND;
	exports.ERR_EXTRAFIELD_ZIP64_NOT_FOUND = ERR_EXTRAFIELD_ZIP64_NOT_FOUND;
	exports.ERR_HTTP_RANGE = ERR_HTTP_RANGE;
	exports.ERR_INVALID_COMMENT = ERR_INVALID_COMMENT;
	exports.ERR_INVALID_DATE = ERR_INVALID_DATE;
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
	exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
	exports.ERR_USUPPORTED_ENCRYPTION = ERR_USUPPORTED_ENCRYPTION;
	exports.HttpRangeReader = HttpRangeReader;
	exports.HttpReader = HttpReader;
	exports.Reader = Reader;
	exports.TextReader = TextReader;
	exports.TextWriter = TextWriter;
	exports.Uint8ArrayReader = Uint8ArrayReader;
	exports.Uint8ArrayWriter = Uint8ArrayWriter;
	exports.Writer = Writer;
	exports.ZipReader = ZipReader$1;
	exports.ZipWriter = ZipWriter$1;
	exports.configure = configure;
	exports.getMimeType = getMimeType;
	exports.initShimAsyncCodec = streamCodecShim;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
