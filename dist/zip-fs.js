(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

	const { Array, Object, String, Number, BigInt, Math, Date, Map, Set, Response, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream, navigator, Worker } = typeof globalThis !== 'undefined' ? globalThis : this || self;

	var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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
	const MAX_8_BITS = 0xff;
	const COMPRESSION_METHOD_DEFLATE = 0x08;
	const COMPRESSION_METHOD_DEFLATE_64 = 0x09;
	const COMPRESSION_METHOD_STORE = 0x00;
	const COMPRESSION_METHOD_AES = 0x63;

	const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
	const SPLIT_ZIP_FILE_SIGNATURE = 0x08074b50;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE = SPLIT_ZIP_FILE_SIGNATURE;
	const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
	const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
	const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;
	const END_OF_CENTRAL_DIR_LENGTH = 22;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
	const ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
	const ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;

	const DATA_DESCRIPTOR_RECORD_LENGTH = 12;
	const DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH = 20;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH = 4;

	const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
	const EXTRAFIELD_TYPE_AES = 0x9901;
	const EXTRAFIELD_TYPE_NTFS = 0x000a;
	const EXTRAFIELD_TYPE_NTFS_TAG1 = 0x0001;
	const EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 0x5455;
	const EXTRAFIELD_TYPE_UNICODE_PATH = 0x7075;
	const EXTRAFIELD_TYPE_UNICODE_COMMENT = 0x6375;
	const EXTRAFIELD_TYPE_USDZ = 0x1986;
	const EXTRAFIELD_TYPE_INFOZIP = 0x7875;
	const EXTRAFIELD_TYPE_UNIX = 0x7855;

	const BITFLAG_ENCRYPTED = 0b1;
	const BITFLAG_LEVEL = 0b0110;
	const BITFLAG_LEVEL_MAX_MASK = 0b010;
	const BITFLAG_LEVEL_FAST_MASK = 0b100;
	const BITFLAG_LEVEL_SUPER_FAST_MASK = 0b110;
	const BITFLAG_DATA_DESCRIPTOR = 0b1000;
	const BITFLAG_LANG_ENCODING_FLAG = 0b100000000000;
	const FILE_ATTR_MSDOS_DIR_MASK = 0b10000;
	const FILE_ATTR_MSDOS_READONLY_MASK = 0x01;
	const FILE_ATTR_MSDOS_HIDDEN_MASK = 0x02;
	const FILE_ATTR_MSDOS_SYSTEM_MASK = 0x04;
	const FILE_ATTR_MSDOS_ARCHIVE_MASK = 0x20;
	const FILE_ATTR_UNIX_TYPE_MASK = 0o170000;
	const FILE_ATTR_UNIX_TYPE_DIR = 0o040000;
	const FILE_ATTR_UNIX_EXECUTABLE_MASK = 0o111;
	const FILE_ATTR_UNIX_DEFAULT_MASK = 0o644;
	const FILE_ATTR_UNIX_SETUID_MASK = 0o4000;
	const FILE_ATTR_UNIX_SETGID_MASK = 0o2000;
	const FILE_ATTR_UNIX_STICKY_MASK = 0o1000;

	const VERSION_DEFLATE = 0x14;
	const VERSION_ZIP64 = 0x2D;
	const VERSION_AES = 0x33;

	const DIRECTORY_SIGNATURE = "/";

	const HEADER_SIZE = 30;
	const HEADER_OFFSET_SIGNATURE = 10;
	const HEADER_OFFSET_COMPRESSED_SIZE = 14;
	const HEADER_OFFSET_UNCOMPRESSED_SIZE = 18;

	const MAX_DATE = new Date(2107, 11, 31);
	const MIN_DATE = new Date(1980, 0, 1);

	const UNDEFINED_VALUE = undefined;
	const UNDEFINED_TYPE = "undefined";
	const FUNCTION_TYPE = "function";
	const OBJECT_TYPE = "object";

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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
	let maxWorkers = 2;
	try {
		if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {
			maxWorkers = navigator.hardwareConcurrency;
		}
	} catch {
		// ignored
	}
	const DEFAULT_CONFIGURATION = {
		workerURI: "./core/web-worker-wasm.js",
		wasmURI: "./core/streams/zlib-wasm/zlib-streams.wasm",
		chunkSize: 64 * 1024,
		maxWorkers,
		terminateWorkerTimeout: 5000,
		useWebWorkers: true,
		useCompressionStream: true,
		CompressionStream: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
		DecompressionStream: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
	};

	const config = Object.assign({}, DEFAULT_CONFIGURATION);

	function getConfiguration() {
		return config;
	}

	function getChunkSize(config) {
		return Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
	}

	function configure(configuration) {
		const {
			baseURI,
			chunkSize,
			maxWorkers,
			terminateWorkerTimeout,
			useCompressionStream,
			useWebWorkers,
			CompressionStream,
			DecompressionStream,
			CompressionStreamZlib,
			DecompressionStreamZlib,
			workerURI,
			wasmURI
		} = configuration;
		setIfDefined("baseURI", baseURI);
		setIfDefined("wasmURI", wasmURI);
		setIfDefined("workerURI", workerURI);
		setIfDefined("chunkSize", chunkSize);
		setIfDefined("maxWorkers", maxWorkers);
		setIfDefined("terminateWorkerTimeout", terminateWorkerTimeout);
		setIfDefined("useCompressionStream", useCompressionStream);
		setIfDefined("useWebWorkers", useWebWorkers);
		setIfDefined("CompressionStream", CompressionStream);
		setIfDefined("DecompressionStream", DecompressionStream);
		setIfDefined("CompressionStreamZlib", CompressionStreamZlib);
		setIfDefined("DecompressionStreamZlib", DecompressionStreamZlib);
	}

	function setIfDefined(propertyName, propertyValue) {
		if (propertyValue !== UNDEFINED_VALUE) {
			config[propertyName] = propertyValue;
		}
	}

	function t(t){let e;t({workerURI:()=>(e||(e="data:text/javascript,"+encodeURIComponent('(t=>{"function"==typeof define&&define.amd?define(t):t()})(function(){"use strict";const{Array:t,Object:e,Number:n,Math:s,Error:r,Uint8Array:o,Uint16Array:i,Uint32Array:c,Int32Array:a,Map:h,DataView:f,Promise:l,TextEncoder:u,crypto:w,postMessage:p,TransformStream:d,ReadableStream:y,WritableStream:m,CompressionStream:g,DecompressionStream:S}=self,b=void 0,v="undefined",k="function",z=[];for(let t=0;256>t;t++){let e=t;for(let t=0;8>t;t++)1&e?e=e>>>1^3988292384:e>>>=1;z[t]=e}class C{constructor(t){this.t=t||-1}append(t){let e=0|this.t;for(let n=0,s=0|t.length;s>n;n++)e=e>>>8^z[255&(e^t[n])];this.t=e}get(){return~this.t}}class A extends d{constructor(){let t;const e=new C;super({transform(t,n){e.append(t),n.enqueue(t)},flush(){const n=new o(4);new f(n.buffer).setUint32(0,e.get()),t.value=n}}),t=this}}const x={concat(t,e){if(0===t.length||0===e.length)return t.concat(e);const n=t[t.length-1],s=x.o(n);return 32===s?t.concat(e):x.i(e,s,0|n,t.slice(0,t.length-1))},h(t){const e=t.length;if(0===e)return 0;const n=t[e-1];return 32*(e-1)+x.o(n)},l(t,e){if(32*t.length<e)return t;const n=(t=t.slice(0,s.ceil(e/32))).length;return e&=31,n>0&&e&&(t[n-1]=x.u(e,t[n-1]&2147483648>>e-1,1)),t},u:(t,e,n)=>32===t?e:(n?0|e:e<<32-t)+1099511627776*t,o:t=>s.round(t/1099511627776)||32,i(t,e,n,s){for(void 0===s&&(s=[]);e>=32;e-=32)s.push(n),n=0;if(0===e)return s.concat(t);for(let r=0;r<t.length;r++)s.push(n|t[r]>>>e),n=t[r]<<32-e;const r=t.length?t[t.length-1]:0,o=x.o(r);return s.push(x.u(e+o&31,e+o>32?n:s.pop(),1)),s}},I={bytes:{p(t){const e=x.h(t)/8,n=new o(e);let s;for(let r=0;e>r;r++)3&r||(s=t[r/4]),n[r]=s>>>24,s<<=8;return n},m(t){const e=[];let n,s=0;for(n=0;n<t.length;n++)s=s<<8|t[n],3&~n||(e.push(s),s=0);return 3&n&&e.push(x.u(8*(3&n),s)),e}}},R=class{constructor(t){const e=this;e.blockSize=512,e.S=[1732584193,4023233417,2562383102,271733878,3285377520],e.v=[1518500249,1859775393,2400959708,3395469782],t?(e.k=t.k.slice(0),e.C=t.C.slice(0),e.A=t.A):e.reset()}reset(){const t=this;return t.k=t.S.slice(0),t.C=[],t.A=0,t}update(t){const e=this;"string"==typeof t&&(t=I.I.m(t));const n=e.C=x.concat(e.C,t),s=e.A,o=e.A=s+x.h(t);if(o>9007199254740991)throw new r("Cannot hash more than 2^53 - 1 bits");const i=new c(n);let a=0;for(let t=e.blockSize+s-(e.blockSize+s&e.blockSize-1);o>=t;t+=e.blockSize)e.R(i.subarray(16*a,16*(a+1))),a+=1;return n.splice(0,16*a),e}P(){const t=this;let e=t.C;const n=t.k;e=x.concat(e,[x.u(1,1)]);for(let t=e.length+2;15&t;t++)e.push(0);for(e.push(s.floor(t.A/4294967296)),e.push(0|t.A);e.length;)t.R(e.splice(0,16));return t.reset(),n}U(t,e,n,s){return t>19?t>39?t>59?t>79?void 0:e^n^s:e&n|e&s|n&s:e^n^s:e&n|~e&s}V(t,e){return e<<t|e>>>32-t}R(e){const n=this,r=n.k,o=t(80);for(let t=0;16>t;t++)o[t]=e[t];let i=r[0],c=r[1],a=r[2],h=r[3],f=r[4];for(let t=0;79>=t;t++){16>t||(o[t]=n.V(1,o[t-3]^o[t-8]^o[t-14]^o[t-16]));const e=n.V(5,i)+n.U(t,c,a,h)+f+o[t]+n.v[s.floor(t/20)]|0;f=h,h=a,a=n.V(30,c),c=i,i=e}r[0]=r[0]+i|0,r[1]=r[1]+c|0,r[2]=r[2]+a|0,r[3]=r[3]+h|0,r[4]=r[4]+f|0}},P={getRandomValues(t){const e=new c(t.buffer),n=t=>{let e=987654321;const n=4294967295;return()=>(e=36969*(65535&e)+(e>>16)&n,(((e<<16)+(t=18e3*(65535&t)+(t>>16)&n)&n)/4294967296+.5)*(s.random()>.5?1:-1))};for(let r,o=0;o<t.length;o+=4){const t=n(4294967296*(r||s.random()));r=987654071*t(),e[o/4]=4294967296*t()|0}return t}},U={importKey:t=>new U.M(I.bytes.m(t)),_(t,e,n,s){if(n=n||1e4,0>s||0>n)throw new r("invalid params to pbkdf2");const o=1+(s>>5)<<2;let i,c,a,h,l;const u=new ArrayBuffer(o),w=new f(u);let p=0;const d=x;for(e=I.bytes.m(e),l=1;(o||1)>p;l++){for(i=c=t.encrypt(d.concat(e,[l])),a=1;n>a;a++)for(c=t.encrypt(c),h=0;h<c.length;h++)i[h]^=c[h];for(a=0;(o||1)>p&&a<i.length;a++)w.setInt32(p,i[a]),p+=4}return u.slice(0,s/8)},M:class{constructor(t){const e=this,n=e.B=R,s=[[],[]];e.D=[new n,new n];const r=e.D[0].blockSize/32;t.length>r&&(t=(new n).update(t).P());for(let e=0;r>e;e++)s[0][e]=909522486^t[e],s[1][e]=1549556828^t[e];e.D[0].update(s[0]),e.D[1].update(s[1]),e.W=new n(e.D[0])}reset(){const t=this;t.W=new t.B(t.D[0]),t.K=!1}update(t){this.K=!0,this.W.update(t)}digest(){const t=this,e=t.W.P(),n=new t.B(t.D[1]).update(e).P();return t.reset(),n}encrypt(t){if(this.K)throw new r("encrypt on already updated hmac called!");return this.update(t),this.digest(t)}}},V=typeof w!=v&&typeof w.getRandomValues==k,M="Invalid password",_="Invalid signature",B="zipjs-abort-check-password";function D(t){return V?w.getRandomValues(t):P.getRandomValues(t)}const W=16,K={name:"PBKDF2"},E=e.assign({hash:{name:"HMAC"}},K),L=e.assign({iterations:1e3,hash:{name:"SHA-1"}},K),O=["deriveBits"],T=[8,12,16],j=[16,24,32],H=10,Z=[0,0,0,0],F=typeof w!=v,N=F&&w.subtle,q=F&&typeof N!=v,G=I.bytes,J=class{constructor(t){const e=this;e.L=[[[],[],[],[],[]],[[],[],[],[],[]]],e.L[0][0][0]||e.O();const n=e.L[0][4],s=e.L[1],o=t.length;let i,c,a,h=1;if(4!==o&&6!==o&&8!==o)throw new r("invalid aes key size");for(e.v=[c=t.slice(0),a=[]],i=o;4*o+28>i;i++){let t=c[i-1];(i%o===0||8===o&&i%o===4)&&(t=n[t>>>24]<<24^n[t>>16&255]<<16^n[t>>8&255]<<8^n[255&t],i%o===0&&(t=t<<8^t>>>24^h<<24,h=h<<1^283*(h>>7))),c[i]=c[i-o]^t}for(let t=0;i;t++,i--){const e=c[3&t?i:i-4];a[t]=4>=i||4>t?e:s[0][n[e>>>24]]^s[1][n[e>>16&255]]^s[2][n[e>>8&255]]^s[3][n[255&e]]}}encrypt(t){return this.T(t,0)}decrypt(t){return this.T(t,1)}O(){const t=this.L[0],e=this.L[1],n=t[4],s=e[4],r=[],o=[];let i,c,a,h;for(let t=0;256>t;t++)o[(r[t]=t<<1^283*(t>>7))^t]=t;for(let f=i=0;!n[f];f^=c||1,i=o[i]||1){let o=i^i<<1^i<<2^i<<3^i<<4;o=o>>8^255&o^99,n[f]=o,s[o]=f,h=r[a=r[c=r[f]]];let l=16843009*h^65537*a^257*c^16843008*f,u=257*r[o]^16843008*o;for(let n=0;4>n;n++)t[n][f]=u=u<<24^u>>>8,e[n][o]=l=l<<24^l>>>8}for(let n=0;5>n;n++)t[n]=t[n].slice(0),e[n]=e[n].slice(0)}T(t,e){if(4!==t.length)throw new r("invalid aes block size");const n=this.v[e],s=n.length/4-2,o=[0,0,0,0],i=this.L[e],c=i[0],a=i[1],h=i[2],f=i[3],l=i[4];let u,w,p,d=t[0]^n[0],y=t[e?3:1]^n[1],m=t[2]^n[2],g=t[e?1:3]^n[3],S=4;for(let t=0;s>t;t++)u=c[d>>>24]^a[y>>16&255]^h[m>>8&255]^f[255&g]^n[S],w=c[y>>>24]^a[m>>16&255]^h[g>>8&255]^f[255&d]^n[S+1],p=c[m>>>24]^a[g>>16&255]^h[d>>8&255]^f[255&y]^n[S+2],g=c[g>>>24]^a[d>>16&255]^h[y>>8&255]^f[255&m]^n[S+3],S+=4,d=u,y=w,m=p;for(let t=0;4>t;t++)o[e?3&-t:t]=l[d>>>24]<<24^l[y>>16&255]<<16^l[m>>8&255]<<8^l[255&g]^n[S++],u=d,d=y,y=m,m=g,g=u;return o}},Q=class{constructor(t,e){this.j=t,this.H=e,this.Z=e}reset(){this.Z=this.H}update(t){return this.F(this.j,t,this.Z)}N(t){if(255&~(t>>24))t+=1<<24;else{let e=t>>16&255,n=t>>8&255,s=255&t;255===e?(e=0,255===n?(n=0,255===s?s=0:++s):++n):++e,t=0,t+=e<<16,t+=n<<8,t+=s}return t}q(t){0===(t[0]=this.N(t[0]))&&(t[1]=this.N(t[1]))}F(t,e,n){let s;if(!(s=e.length))return[];const r=x.h(e);for(let r=0;s>r;r+=4){this.q(n);const s=t.encrypt(n);e[r]^=s[0],e[r+1]^=s[1],e[r+2]^=s[2],e[r+3]^=s[3]}return x.l(e,r)}},X=U.M;let Y=F&&q&&typeof N.importKey==k,$=F&&q&&typeof N.deriveBits==k;class tt extends d{constructor({password:t,rawPassword:n,signed:s,encryptionStrength:i,checkPasswordOnly:c}){super({start(){e.assign(this,{ready:new l(t=>this.G=t),password:rt(t,n),signed:s,J:i-1,pending:new o})},async transform(t,e){const n=this,{password:s,J:i,G:a,ready:h}=n;s?(await(async(t,e,n,s)=>{const o=await st(t,e,n,it(s,0,T[e])),i=it(s,T[e]);if(o[0]!=i[0]||o[1]!=i[1])throw new r(M)})(n,i,s,it(t,0,T[i]+2)),t=it(t,T[i]+2),c?e.error(new r(B)):a()):await h;const f=new o(t.length-H-(t.length-H)%W);e.enqueue(nt(n,t,f,0,H,!0))},async flush(t){const{signed:e,X:n,Y:s,pending:i,ready:c}=this;if(s&&n){await c;const a=it(i,0,i.length-H),h=it(i,i.length-H);let f=new o;if(a.length){const t=at(G,a);s.update(t);const e=n.update(t);f=ct(G,e)}if(e){const t=it(ct(G,s.digest()),0,H);for(let e=0;H>e;e++)if(t[e]!=h[e])throw new r(_)}t.enqueue(f)}}})}}class et extends d{constructor({password:t,rawPassword:n,encryptionStrength:s}){let r;super({start(){e.assign(this,{ready:new l(t=>this.G=t),password:rt(t,n),J:s-1,pending:new o})},async transform(t,e){const n=this,{password:s,J:r,G:i,ready:c}=n;let a=new o;s?(a=await(async(t,e,n)=>{const s=D(new o(T[e]));return ot(s,await st(t,e,n,s))})(n,r,s),i()):await c;const h=new o(a.length+t.length-t.length%W);h.set(a,0),e.enqueue(nt(n,t,h,a.length,0))},async flush(t){const{X:e,Y:n,pending:s,ready:i}=this;if(n&&e){await i;let c=new o;if(s.length){const t=e.update(at(G,s));n.update(t),c=ct(G,t)}r.signature=ct(G,n.digest()).slice(0,H),t.enqueue(ot(c,r.signature))}}}),r=this}}function nt(t,e,n,s,r,i){const{X:c,Y:a,pending:h}=t,f=e.length-r;let l;for(h.length&&(e=ot(h,e),n=((t,e)=>{if(e&&e>t.length){const n=t;(t=new o(e)).set(n,0)}return t})(n,f-f%W)),l=0;f-W>=l;l+=W){const t=at(G,it(e,l,l+W));i&&a.update(t);const r=c.update(t);i||a.update(r),n.set(ct(G,r),l+s)}return t.pending=it(e,l),n}async function st(n,s,r,i){n.password=null;const c=await(async(t,e,n,s,r)=>{if(!Y)return U.importKey(e);try{return await N.importKey("raw",e,n,!1,r)}catch{return Y=!1,U.importKey(e)}})(0,r,E,0,O),a=await(async(t,e,n)=>{if(!$)return U._(e,t.salt,L.iterations,n);try{return await N.deriveBits(t,e,n)}catch{return $=!1,U._(e,t.salt,L.iterations,n)}})(e.assign({salt:i},L),c,8*(2*j[s]+2)),h=new o(a),f=at(G,it(h,0,j[s])),l=at(G,it(h,j[s],2*j[s])),u=it(h,2*j[s]);return e.assign(n,{keys:{key:f,$:l,passwordVerification:u},X:new Q(new J(f),t.from(Z)),Y:new X(l)}),u}function rt(t,e){return e===b?(t=>{if(typeof u==v){const e=new o((t=unescape(encodeURIComponent(t))).length);for(let n=0;n<e.length;n++)e[n]=t.charCodeAt(n);return e}return(new u).encode(t)})(t):e}function ot(t,e){let n=t;return t.length+e.length&&(n=new o(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function it(t,e,n){return t.subarray(e,n)}function ct(t,e){return t.p(e)}function at(t,e){return t.m(e)}class ht extends d{constructor({password:t,passwordVerification:n,checkPasswordOnly:s}){super({start(){e.assign(this,{password:t,passwordVerification:n}),wt(this,t)},transform(t,e){const n=this;if(n.password){const e=lt(n,t.subarray(0,12));if(n.password=null,e.at(-1)!=n.passwordVerification)throw new r(M);t=t.subarray(12)}s?e.error(new r(B)):e.enqueue(lt(n,t))}})}}class ft extends d{constructor({password:t,passwordVerification:n}){super({start(){e.assign(this,{password:t,passwordVerification:n}),wt(this,t)},transform(t,e){const n=this;let s,r;if(n.password){n.password=null;const e=D(new o(12));e[11]=n.passwordVerification,s=new o(t.length+e.length),s.set(ut(n,e),0),r=12}else s=new o(t.length),r=0;s.set(ut(n,t),r),e.enqueue(s)}})}}function lt(t,e){const n=new o(e.length);for(let s=0;s<e.length;s++)n[s]=dt(t)^e[s],pt(t,n[s]);return n}function ut(t,e){const n=new o(e.length);for(let s=0;s<e.length;s++)n[s]=dt(t)^e[s],pt(t,e[s]);return n}function wt(t,n){const s=[305419896,591751049,878082192];e.assign(t,{keys:s,tt:new C(s[0]),et:new C(s[2])});for(let e=0;e<n.length;e++)pt(t,n.charCodeAt(e))}function pt(t,e){let[n,r,o]=t.keys;t.tt.append([e]),n=~t.tt.get(),r=mt(s.imul(mt(r+yt(n)),134775813)+1),t.et.append([r>>>24]),o=~t.et.get(),t.keys=[n,r,o]}function dt(t){const e=2|t.keys[2];return yt(s.imul(e,1^e)>>>8)}function yt(t){return 255&t}function mt(t){return 4294967295&t}class gt extends d{constructor(t,{chunkSize:e,nt:n,CompressionStream:s}){super({});const{compressed:r,encrypted:o,useCompressionStream:i,zipCrypto:c,signed:a,level:h}=t,l=this;let u,w,p=super.readable;o&&!c||!a||(u=new A,p=kt(p,u)),r&&(p=vt(p,i,{level:h,chunkSize:e},s,n,s)),o&&(c?p=kt(p,new ft(t)):(w=new et(t),p=kt(p,w))),bt(l,p,()=>{let t;o&&!c&&(t=w.signature),o&&!c||!a||(t=new f(u.value.buffer).getUint32(0)),l.signature=t})}}class St extends d{constructor(t,{chunkSize:e,st:n,DecompressionStream:s}){super({});const{zipCrypto:o,encrypted:i,signed:c,signature:a,compressed:h,useCompressionStream:l,rt:u}=t;let w,p,d=super.readable;i&&(o?d=kt(d,new ht(t)):(p=new tt(t),d=kt(d,p))),h&&(d=vt(d,l,{chunkSize:e,rt:u},s,n,s)),i&&!o||!c||(w=new A,d=kt(d,w)),bt(this,d,()=>{if((!i||o)&&c){const t=new f(w.value.buffer);if(a!=t.getUint32(0,!1))throw new r(_)}})}}function bt(t,n,s){n=kt(n,new d({flush:s})),e.defineProperty(t,"readable",{get:()=>n})}function vt(t,e,n,s,r,o){const i=e&&s?s:r||o,c=n.rt?"deflate64-raw":"deflate-raw";try{t=kt(t,new i(c,n))}catch(s){if(!e)throw s;if(r)t=kt(t,new r(c,n));else{if(!o)throw s;t=kt(t,new o(c,n))}}return t}function kt(t,e){return t.pipeThrough(e)}const zt="data",Ct="close";class At extends d{constructor(t,n){super({});const s=this,{codecType:o}=t;let i;o.startsWith("deflate")?i=gt:o.startsWith("inflate")&&(i=St),s.outputSize=0;let c=0;const a=new i(t,n),h=super.readable,f=new d({transform(t,e){t&&t.length&&(c+=t.length,e.enqueue(t))},flush(){e.assign(s,{inputSize:c})}}),l=new d({transform(e,n){if(e&&e.length&&(n.enqueue(e),s.outputSize+=e.length,t.outputSize!==b&&s.outputSize>t.outputSize))throw new r("Invalid uncompressed size")},flush(){const{signature:t}=a;e.assign(s,{signature:t,inputSize:c})}});e.defineProperty(s,"readable",{get:()=>h.pipeThrough(f).pipeThrough(a).pipeThrough(l)})}}class xt extends d{constructor(t){let e;super({transform:function n(s,r){if(e){const t=new o(e.length+s.length);t.set(e),t.set(s,e.length),s=t,e=null}s.length>t?(r.enqueue(s.slice(0,t)),n(s.slice(t),r)):e=s},flush(t){e&&e.length&&t.enqueue(e)}})}}const It=new h,Rt=new h;let Pt,Ut,Vt,Mt,_t,Bt=0;async function Dt(t){try{const{options:e,config:s}=t;if(!e.useCompressionStream)try{await self.initModule(t.config)}catch{e.useCompressionStream=!0}s.CompressionStream=self.CompressionStream,s.DecompressionStream=self.DecompressionStream;const r={highWaterMark:1},o=t.readable||new y({async pull(t){const e=new l(t=>It.set(Bt,t));Wt({type:"pull",messageId:Bt}),Bt=(Bt+1)%n.MAX_SAFE_INTEGER;const{value:s,done:r}=await e;t.enqueue(s),r&&t.close()}},r),i=t.writable||new m({async write(t){let e;const s=new l(t=>e=t);Rt.set(Bt,e),Wt({type:zt,value:t,messageId:Bt}),Bt=(Bt+1)%n.MAX_SAFE_INTEGER,await s}},r),c=new At(e,s);Pt=new AbortController;const{signal:a}=Pt;await o.pipeThrough(c).pipeThrough(new xt(s.chunkSize)).pipeTo(i,{signal:a,preventClose:!0,preventAbort:!0}),await i.getWriter().close();const{signature:h,inputSize:f,outputSize:u}=c;Wt({type:Ct,result:{signature:h,inputSize:f,outputSize:u}})}catch(t){t.outputSize=0,Kt(t)}}function Wt(t){let{value:e}=t;if(e)if(e.length)try{e=new o(e),t.value=e.buffer,p(t,[t.value])}catch{p(t)}else p(t);else p(t)}function Kt(t=new r("Unknown error")){const{message:e,stack:n,code:s,name:o,outputSize:i}=t;p({error:{message:e,stack:n,code:s,name:o,outputSize:i}})}function Et(t,e,n={}){const i="number"==typeof n.level?n.level:-1,c="number"==typeof n.ot?n.ot:65536,a="number"==typeof n.it?n.it:65536;return new d({start(){let n;if(this.ct=Vt(c),this.in=Vt(a),this.it=a,this.ht=new o(c),t?(this.ft=Ut.deflate_process,this.lt=Ut.deflate_last_consumed,this.ut=Ut.deflate_end,this.wt=Ut.deflate_new(),n="gzip"===e?Ut.deflate_init_gzip(this.wt,i):"deflate-raw"===e?Ut.deflate_init_raw(this.wt,i):Ut.deflate_init(this.wt,i)):"deflate64-raw"===e?(this.ft=Ut.inflate9_process,this.lt=Ut.inflate9_last_consumed,this.ut=Ut.inflate9_end,this.wt=Ut.inflate9_new(),n=Ut.inflate9_init_raw(this.wt)):(this.ft=Ut.inflate_process,this.lt=Ut.inflate_last_consumed,this.ut=Ut.inflate_end,this.wt=Ut.inflate_new(),n="deflate-raw"===e?Ut.inflate_init_raw(this.wt):"gzip"===e?Ut.inflate_init_gzip(this.wt):Ut.inflate_init(this.wt)),0!==n)throw new r("init failed:"+n)},transform(e,n){try{const i=e,a=new o(_t.buffer),h=this.ft,f=this.lt,l=this.ct,u=this.ht;let w=0;for(;w<i.length;){const e=s.min(i.length-w,32768);this.in&&this.it>=e||(this.in&&Mt&&Mt(this.in),this.in=Vt(e),this.it=e),a.set(i.subarray(w,w+e),this.in);const o=h(this.wt,this.in,e,l,c,0);if(!t&&0>o)throw new r("process error:"+o);const p=16777215&o;p&&(u.set(a.subarray(l,l+p),0),n.enqueue(u.slice(0,p)));const d=f(this.wt);if(0===d)break;w+=d}}catch(t){this.ut&&this.wt&&this.ut(this.wt),this.in&&Mt&&Mt(this.in),this.ct&&Mt&&Mt(this.ct),n.error(t)}},flush(e){try{const n=new o(_t.buffer),s=this.ft,i=this.ct,a=this.ht;for(;;){const o=s(this.wt,0,0,i,c,4);if(!t&&0>o)throw new r("process error:"+o);const h=16777215&o,f=o>>24&255;if(h&&(a.set(n.subarray(i,i+h),0),e.enqueue(a.slice(0,h))),1===f||0===h)break}}catch(t){e.error(t)}finally{if(this.ut&&this.wt){const t=this.ut(this.wt);0!==t&&e.error(new r("end error:"+t))}this.in&&Mt&&Mt(this.in),this.ct&&Mt&&Mt(this.ct)}}})}addEventListener("message",({data:t})=>{const{type:e,messageId:n,value:s,done:r}=t;try{if("start"==e&&Dt(t),e==zt){const t=It.get(n);It.delete(n),t({value:new o(s),done:r})}if("ack"==e){const t=Rt.get(n);Rt.delete(n),t()}e==Ct&&Pt.abort()}catch(t){Kt(t)}});class Lt{constructor(t="deflate",e){return Et(!0,t,e)}}class Ot{constructor(t="deflate",e){return Et(!1,t,e)}}let Tt=!1;self.initModule=async t=>{try{const e=await(async(t,{baseURI:e})=>{if(!Tt){let n,s;try{try{s=new URL(t,e)}catch{}const r=await fetch(s);n=await r.arrayBuffer()}catch(e){if(!t.startsWith("data:application/wasm;base64,"))throw e;n=(t=>{const e=t.split(",")[1],n=atob(e),s=n.length,r=new o(s);for(let t=0;s>t;++t)r[t]=n.charCodeAt(t);return r.buffer})(t)}(t=>{if(Ut=t,({malloc:Vt,free:Mt,memory:_t}=Ut),"function"!=typeof Vt||"function"!=typeof Mt||!_t)throw Ut=Vt=Mt=_t=null,new r("Invalid WASM module")})((await WebAssembly.instantiate(n)).instance.exports),Tt=!0}})(t.wasmURI,t);return t.nt=Lt,t.st=Ot,e}catch{}}});\n')),e)});}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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

	const table$1 = [];
	for (let i = 0; i < 256; i++) {
		let t = i;
		for (let j = 0; j < 8; j++) {
			if (t & 1) {
				t = (t >>> 1) ^ 0xEDB88320;
			} else {
				t = t >>> 1;
			}
		}
		table$1[i] = t;
	}

	class Crc32 {

		constructor(crc) {
			this.crc = crc || -1;
		}

		append(data) {
			let crc = this.crc | 0;
			for (let offset = 0, length = data.length | 0; offset < length; offset++) {
				crc = (crc >>> 8) ^ table$1[(crc ^ data[offset]) & 0xFF];
			}
			this.crc = crc;
		}

		get() {
			return ~this.crc;
		}
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	class Crc32Stream extends TransformStream {

		constructor() {
			// deno-lint-ignore prefer-const
			let stream;
			const crc32 = new Crc32();
			super({
				transform(chunk, controller) {
					crc32.append(chunk);
					controller.enqueue(chunk);
				},
				flush() {
					const value = new Uint8Array(4);
					const dataView = new DataView(value.buffer);
					dataView.setUint32(0, crc32.get());
					stream.value = value;
				}
			});
			stream = this;
		}
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	function encodeText(value) {
		// deno-lint-ignore valid-typeof
		if (typeof TextEncoder == UNDEFINED_TYPE) {
			value = unescape(encodeURIComponent(value));
			const result = new Uint8Array(value.length);
			for (let i = 0; i < result.length; i++) {
				result[i] = value.charCodeAt(i);
			}
			return result;
		} else {
			return new TextEncoder().encode(value);
		}
	}

	// Derived from https://github.com/xqdoo00o/jszip/blob/master/lib/sjcl.js and https://github.com/bitwiseshiftleft/sjcl

	// deno-lint-ignore-file no-this-alias

	/*
	 * SJCL is open. You can use, modify and redistribute it under a BSD
	 * license or under the GNU GPL, version 2.0.
	 */

	/** @fileOverview Javascript cryptography implementation.
	 *
	 * Crush to remove comments, shorten variable names and
	 * generally reduce transmission size.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/*jslint indent: 2, bitwise: false, nomen: false, plusplus: false, white: false, regexp: false */

	/** @fileOverview Arrays of bits, encoded as arrays of Numbers.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/**
	 * Arrays of bits, encoded as arrays of Numbers.
	 * @namespace
	 * @description
	 * <p>
	 * These objects are the currency accepted by SJCL's crypto functions.
	 * </p>
	 *
	 * <p>
	 * Most of our crypto primitives operate on arrays of 4-byte words internally,
	 * but many of them can take arguments that are not a multiple of 4 bytes.
	 * This library encodes arrays of bits (whose size need not be a multiple of 8
	 * bits) as arrays of 32-bit words.  The bits are packed, big-endian, into an
	 * array of words, 32 bits at a time.  Since the words are double-precision
	 * floating point numbers, they fit some extra data.  We use this (in a private,
	 * possibly-changing manner) to encode the number of bits actually  present
	 * in the last word of the array.
	 * </p>
	 *
	 * <p>
	 * Because bitwise ops clear this out-of-band data, these arrays can be passed
	 * to ciphers like AES which want arrays of words.
	 * </p>
	 */
	const bitArray = {
		/**
		 * Concatenate two bit arrays.
		 * @param {bitArray} a1 The first array.
		 * @param {bitArray} a2 The second array.
		 * @return {bitArray} The concatenation of a1 and a2.
		 */
		concat(a1, a2) {
			if (a1.length === 0 || a2.length === 0) {
				return a1.concat(a2);
			}

			const last = a1[a1.length - 1], shift = bitArray.getPartial(last);
			if (shift === 32) {
				return a1.concat(a2);
			} else {
				return bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
			}
		},

		/**
		 * Find the length of an array of bits.
		 * @param {bitArray} a The array.
		 * @return {Number} The length of a, in bits.
		 */
		bitLength(a) {
			const l = a.length;
			if (l === 0) {
				return 0;
			}
			const x = a[l - 1];
			return (l - 1) * 32 + bitArray.getPartial(x);
		},

		/**
		 * Truncate an array.
		 * @param {bitArray} a The array.
		 * @param {Number} len The length to truncate to, in bits.
		 * @return {bitArray} A new array, truncated to len bits.
		 */
		clamp(a, len) {
			if (a.length * 32 < len) {
				return a;
			}
			a = a.slice(0, Math.ceil(len / 32));
			const l = a.length;
			len = len & 31;
			if (l > 0 && len) {
				a[l - 1] = bitArray.partial(len, a[l - 1] & 0x80000000 >> (len - 1), 1);
			}
			return a;
		},

		/**
		 * Make a partial word for a bit array.
		 * @param {Number} len The number of bits in the word.
		 * @param {Number} x The bits.
		 * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
		 * @return {Number} The partial word.
		 */
		partial(len, x, _end) {
			if (len === 32) {
				return x;
			}
			return (_end ? x | 0 : x << (32 - len)) + len * 0x10000000000;
		},

		/**
		 * Get the number of bits used by a partial word.
		 * @param {Number} x The partial word.
		 * @return {Number} The number of bits used by the partial word.
		 */
		getPartial(x) {
			return Math.round(x / 0x10000000000) || 32;
		},

		/** Shift an array right.
		 * @param {bitArray} a The array to shift.
		 * @param {Number} shift The number of bits to shift.
		 * @param {Number} [carry=0] A byte to carry in
		 * @param {bitArray} [out=[]] An array to prepend to the output.
		 * @private
		 */
		_shiftRight(a, shift, carry, out) {
			if (out === undefined) {
				out = [];
			}

			for (; shift >= 32; shift -= 32) {
				out.push(carry);
				carry = 0;
			}
			if (shift === 0) {
				return out.concat(a);
			}

			for (let i = 0; i < a.length; i++) {
				out.push(carry | a[i] >>> shift);
				carry = a[i] << (32 - shift);
			}
			const last2 = a.length ? a[a.length - 1] : 0;
			const shift2 = bitArray.getPartial(last2);
			out.push(bitArray.partial(shift + shift2 & 31, (shift + shift2 > 32) ? carry : out.pop(), 1));
			return out;
		}
	};

	/** @fileOverview Bit array codec implementations.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/**
	 * Arrays of bytes
	 * @namespace
	 */
	const codec = {
		bytes: {
			/** Convert from a bitArray to an array of bytes. */
			fromBits(arr) {
				const bl = bitArray.bitLength(arr);
				const byteLength = bl / 8;
				const out = new Uint8Array(byteLength);
				let tmp;
				for (let i = 0; i < byteLength; i++) {
					if ((i & 3) === 0) {
						tmp = arr[i / 4];
					}
					out[i] = tmp >>> 24;
					tmp <<= 8;
				}
				return out;
			},
			/** Convert from an array of bytes to a bitArray. */
			toBits(bytes) {
				const out = [];
				let i;
				let tmp = 0;
				for (i = 0; i < bytes.length; i++) {
					tmp = tmp << 8 | bytes[i];
					if ((i & 3) === 3) {
						out.push(tmp);
						tmp = 0;
					}
				}
				if (i & 3) {
					out.push(bitArray.partial(8 * (i & 3), tmp));
				}
				return out;
			}
		}
	};

	const hash = {};

	/**
	 * Context for a SHA-1 operation in progress.
	 * @constructor
	 */
	hash.sha1 = class {
		constructor(hash) {
			const sha1 = this;
			/**
			 * The hash's block size, in bits.
			 * @constant
			 */
			sha1.blockSize = 512;
			/**
			 * The SHA-1 initialization vector.
			 * @private
			 */
			sha1._init = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
			/**
			 * The SHA-1 hash key.
			 * @private
			 */
			sha1._key = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];
			if (hash) {
				sha1._h = hash._h.slice(0);
				sha1._buffer = hash._buffer.slice(0);
				sha1._length = hash._length;
			} else {
				sha1.reset();
			}
		}

		/**
		 * Reset the hash state.
		 * @return this
		 */
		reset() {
			const sha1 = this;
			sha1._h = sha1._init.slice(0);
			sha1._buffer = [];
			sha1._length = 0;
			return sha1;
		}

		/**
		 * Input several words to the hash.
		 * @param {bitArray|String} data the data to hash.
		 * @return this
		 */
		update(data) {
			const sha1 = this;
			if (typeof data === "string") {
				data = codec.utf8String.toBits(data);
			}
			const b = sha1._buffer = bitArray.concat(sha1._buffer, data);
			const ol = sha1._length;
			const nl = sha1._length = ol + bitArray.bitLength(data);
			if (nl > 9007199254740991) {
				throw new Error("Cannot hash more than 2^53 - 1 bits");
			}
			const c = new Uint32Array(b);
			let j = 0;
			for (let i = sha1.blockSize + ol - ((sha1.blockSize + ol) & (sha1.blockSize - 1)); i <= nl;
				i += sha1.blockSize) {
				sha1._block(c.subarray(16 * j, 16 * (j + 1)));
				j += 1;
			}
			b.splice(0, 16 * j);
			return sha1;
		}

		/**
		 * Complete hashing and output the hash value.
		 * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
		 */
		finalize() {
			const sha1 = this;
			let b = sha1._buffer;
			const h = sha1._h;

			// Round out and push the buffer
			b = bitArray.concat(b, [bitArray.partial(1, 1)]);
			// Round out the buffer to a multiple of 16 words, less the 2 length words.
			for (let i = b.length + 2; i & 15; i++) {
				b.push(0);
			}

			// append the length
			b.push(Math.floor(sha1._length / 0x100000000));
			b.push(sha1._length | 0);

			while (b.length) {
				sha1._block(b.splice(0, 16));
			}

			sha1.reset();
			return h;
		}

		/**
		 * The SHA-1 logical functions f(0), f(1), ..., f(79).
		 * @private
		 */
		_f(t, b, c, d) {
			if (t <= 19) {
				return (b & c) | (~b & d);
			} else if (t <= 39) {
				return b ^ c ^ d;
			} else if (t <= 59) {
				return (b & c) | (b & d) | (c & d);
			} else if (t <= 79) {
				return b ^ c ^ d;
			}
		}

		/**
		 * Circular left-shift operator.
		 * @private
		 */
		_S(n, x) {
			return (x << n) | (x >>> 32 - n);
		}

		/**
		 * Perform one cycle of SHA-1.
		 * @param {Uint32Array|bitArray} words one block of words.
		 * @private
		 */
		_block(words) {
			const sha1 = this;
			const h = sha1._h;
			// When words is passed to _block, it has 16 elements. SHA1 _block
			// function extends words with new elements (at the end there are 80 elements). 
			// The problem is that if we use Uint32Array instead of Array, 
			// the length of Uint32Array cannot be changed. Thus, we replace words with a 
			// normal Array here.
			const w = Array(80); // do not use Uint32Array here as the instantiation is slower
			for (let j = 0; j < 16; j++) {
				w[j] = words[j];
			}

			let a = h[0];
			let b = h[1];
			let c = h[2];
			let d = h[3];
			let e = h[4];

			for (let t = 0; t <= 79; t++) {
				if (t >= 16) {
					w[t] = sha1._S(1, w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16]);
				}
				const tmp = (sha1._S(5, a) + sha1._f(t, b, c, d) + e + w[t] +
					sha1._key[Math.floor(t / 20)]) | 0;
				e = d;
				d = c;
				c = sha1._S(30, b);
				b = a;
				a = tmp;
			}

			h[0] = (h[0] + a) | 0;
			h[1] = (h[1] + b) | 0;
			h[2] = (h[2] + c) | 0;
			h[3] = (h[3] + d) | 0;
			h[4] = (h[4] + e) | 0;
		}
	};

	/** @fileOverview Low-level AES implementation.
	 *
	 * This file contains a low-level implementation of AES, optimized for
	 * size and for efficiency on several browsers.  It is based on
	 * OpenSSL's aes_core.c, a public-domain implementation by Vincent
	 * Rijmen, Antoon Bosselaers and Paulo Barreto.
	 *
	 * An older version of this implementation is available in the public
	 * domain, but this one is (c) Emily Stark, Mike Hamburg, Dan Boneh,
	 * Stanford University 2008-2010 and BSD-licensed for liability
	 * reasons.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	const cipher = {};

	/**
	 * Schedule out an AES key for both encryption and decryption.  This
	 * is a low-level class.  Use a cipher mode to do bulk encryption.
	 *
	 * @constructor
	 * @param {Array} key The key as an array of 4, 6 or 8 words.
	 */
	cipher.aes = class {
		constructor(key) {
			/**
			 * The expanded S-box and inverse S-box tables.  These will be computed
			 * on the client so that we don't have to send them down the wire.
			 *
			 * There are two tables, _tables[0] is for encryption and
			 * _tables[1] is for decryption.
			 *
			 * The first 4 sub-tables are the expanded S-box with MixColumns.  The
			 * last (_tables[01][4]) is the S-box itself.
			 *
			 * @private
			 */
			const aes = this;
			aes._tables = [[[], [], [], [], []], [[], [], [], [], []]];

			if (!aes._tables[0][0][0]) {
				aes._precompute();
			}

			const sbox = aes._tables[0][4];
			const decTable = aes._tables[1];
			const keyLen = key.length;

			let i, encKey, decKey, rcon = 1;

			if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
				throw new Error("invalid aes key size");
			}

			aes._key = [encKey = key.slice(0), decKey = []];

			// schedule encryption keys
			for (i = keyLen; i < 4 * keyLen + 28; i++) {
				let tmp = encKey[i - 1];

				// apply sbox
				if (i % keyLen === 0 || (keyLen === 8 && i % keyLen === 4)) {
					tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];

					// shift rows and add rcon
					if (i % keyLen === 0) {
						tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
						rcon = rcon << 1 ^ (rcon >> 7) * 283;
					}
				}

				encKey[i] = encKey[i - keyLen] ^ tmp;
			}

			// schedule decryption keys
			for (let j = 0; i; j++, i--) {
				const tmp = encKey[j & 3 ? i : i - 4];
				if (i <= 4 || j < 4) {
					decKey[j] = tmp;
				} else {
					decKey[j] = decTable[0][sbox[tmp >>> 24]] ^
						decTable[1][sbox[tmp >> 16 & 255]] ^
						decTable[2][sbox[tmp >> 8 & 255]] ^
						decTable[3][sbox[tmp & 255]];
				}
			}
		}
		// public
		/* Something like this might appear here eventually
		name: "AES",
		blockSize: 4,
		keySizes: [4,6,8],
		*/

		/**
		 * Encrypt an array of 4 big-endian words.
		 * @param {Array} data The plaintext.
		 * @return {Array} The ciphertext.
		 */
		encrypt(data) {
			return this._crypt(data, 0);
		}

		/**
		 * Decrypt an array of 4 big-endian words.
		 * @param {Array} data The ciphertext.
		 * @return {Array} The plaintext.
		 */
		decrypt(data) {
			return this._crypt(data, 1);
		}

		/**
		 * Expand the S-box tables.
		 *
		 * @private
		 */
		_precompute() {
			const encTable = this._tables[0];
			const decTable = this._tables[1];
			const sbox = encTable[4];
			const sboxInv = decTable[4];
			const d = [];
			const th = [];
			let xInv, x2, x4, x8;

			// Compute double and third tables
			for (let i = 0; i < 256; i++) {
				th[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
			}

			for (let x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
				// Compute sbox
				let s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
				s = s >> 8 ^ s & 255 ^ 99;
				sbox[x] = s;
				sboxInv[s] = x;

				// Compute MixColumns
				x8 = d[x4 = d[x2 = d[x]]];
				let tDec = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
				let tEnc = d[s] * 0x101 ^ s * 0x1010100;

				for (let i = 0; i < 4; i++) {
					encTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
					decTable[i][s] = tDec = tDec << 24 ^ tDec >>> 8;
				}
			}

			// Compactify.  Considerable speedup on Firefox.
			for (let i = 0; i < 5; i++) {
				encTable[i] = encTable[i].slice(0);
				decTable[i] = decTable[i].slice(0);
			}
		}

		/**
		 * Encryption and decryption core.
		 * @param {Array} input Four words to be encrypted or decrypted.
		 * @param dir The direction, 0 for encrypt and 1 for decrypt.
		 * @return {Array} The four encrypted or decrypted words.
		 * @private
		 */
		_crypt(input, dir) {
			if (input.length !== 4) {
				throw new Error("invalid aes block size");
			}

			const key = this._key[dir];

			const nInnerRounds = key.length / 4 - 2;
			const out = [0, 0, 0, 0];
			const table = this._tables[dir];

			// load up the tables
			const t0 = table[0];
			const t1 = table[1];
			const t2 = table[2];
			const t3 = table[3];
			const sbox = table[4];

			// state variables a,b,c,d are loaded with pre-whitened data
			let a = input[0] ^ key[0];
			let b = input[dir ? 3 : 1] ^ key[1];
			let c = input[2] ^ key[2];
			let d = input[dir ? 1 : 3] ^ key[3];
			let kIndex = 4;
			let a2, b2, c2;

			// Inner rounds.  Cribbed from OpenSSL.
			for (let i = 0; i < nInnerRounds; i++) {
				a2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];
				b2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
				c2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
				d = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
				kIndex += 4;
				a = a2; b = b2; c = c2;
			}

			// Last round.
			for (let i = 0; i < 4; i++) {
				out[dir ? 3 & -i : i] =
					sbox[a >>> 24] << 24 ^
					sbox[b >> 16 & 255] << 16 ^
					sbox[c >> 8 & 255] << 8 ^
					sbox[d & 255] ^
					key[kIndex++];
				a2 = a; a = b; b = c; c = d; d = a2;
			}

			return out;
		}
	};

	/**
	 * Random values
	 * @namespace
	 */
	const random = {
		/** 
		 * Generate random words with pure js, cryptographically not as strong & safe as native implementation.
		 * @param {TypedArray} typedArray The array to fill.
		 * @return {TypedArray} The random values.
		 */
		getRandomValues(typedArray) {
			const words = new Uint32Array(typedArray.buffer);
			const r = (m_w) => {
				let m_z = 0x3ade68b1;
				const mask = 0xffffffff;
				return function () {
					m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
					m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
					const result = ((((m_z << 0x10) + m_w) & mask) / 0x100000000) + .5;
					return result * (Math.random() > .5 ? 1 : -1);
				};
			};
			for (let i = 0, rcache; i < typedArray.length; i += 4) {
				const _r = r((rcache || Math.random()) * 0x100000000);
				rcache = _r() * 0x3ade67b7;
				words[i / 4] = (_r() * 0x100000000) | 0;
			}
			return typedArray;
		}
	};

	/** @fileOverview CTR mode implementation.
	 *
	 * Special thanks to Roy Nicholson for pointing out a bug in our
	 * implementation.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** Brian Gladman's CTR Mode.
	* @constructor
	* @param {Object} _prf The aes instance to generate key.
	* @param {bitArray} _iv The iv for ctr mode, it must be 128 bits.
	*/

	const mode = {};

	/**
	 * Brian Gladman's CTR Mode.
	 * @namespace
	 */
	mode.ctrGladman = class {
		constructor(prf, iv) {
			this._prf = prf;
			this._initIv = iv;
			this._iv = iv;
		}

		reset() {
			this._iv = this._initIv;
		}

		/** Input some data to calculate.
		 * @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.
		 */
		update(data) {
			return this.calculate(this._prf, data, this._iv);
		}

		incWord(word) {
			if (((word >> 24) & 0xff) === 0xff) { //overflow
				let b1 = (word >> 16) & 0xff;
				let b2 = (word >> 8) & 0xff;
				let b3 = word & 0xff;

				if (b1 === 0xff) { // overflow b1   
					b1 = 0;
					if (b2 === 0xff) {
						b2 = 0;
						if (b3 === 0xff) {
							b3 = 0;
						} else {
							++b3;
						}
					} else {
						++b2;
					}
				} else {
					++b1;
				}

				word = 0;
				word += (b1 << 16);
				word += (b2 << 8);
				word += b3;
			} else {
				word += (0x01 << 24);
			}
			return word;
		}

		incCounter(counter) {
			if ((counter[0] = this.incWord(counter[0])) === 0) {
				// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
				counter[1] = this.incWord(counter[1]);
			}
		}

		calculate(prf, data, iv) {
			let l;
			if (!(l = data.length)) {
				return [];
			}
			const bl = bitArray.bitLength(data);
			for (let i = 0; i < l; i += 4) {
				this.incCounter(iv);
				const e = prf.encrypt(iv);
				data[i] ^= e[0];
				data[i + 1] ^= e[1];
				data[i + 2] ^= e[2];
				data[i + 3] ^= e[3];
			}
			return bitArray.clamp(data, bl);
		}
	};

	const misc = {
		importKey(password) {
			return new misc.hmacSha1(codec.bytes.toBits(password));
		},
		pbkdf2(prf, salt, count, length) {
			count = count || 10000;
			if (length < 0 || count < 0) {
				throw new Error("invalid params to pbkdf2");
			}
			const byteLength = ((length >> 5) + 1) << 2;
			let u, ui, i, j, k;
			const arrayBuffer = new ArrayBuffer(byteLength);
			const out = new DataView(arrayBuffer);
			let outLength = 0;
			const b = bitArray;
			salt = codec.bytes.toBits(salt);
			for (k = 1; outLength < (byteLength || 1); k++) {
				u = ui = prf.encrypt(b.concat(salt, [k]));
				for (i = 1; i < count; i++) {
					ui = prf.encrypt(ui);
					for (j = 0; j < ui.length; j++) {
						u[j] ^= ui[j];
					}
				}
				for (i = 0; outLength < (byteLength || 1) && i < u.length; i++) {
					out.setInt32(outLength, u[i]);
					outLength += 4;
				}
			}
			return arrayBuffer.slice(0, length / 8);
		}
	};

	/** @fileOverview HMAC implementation.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** HMAC with the specified hash function.
	 * @constructor
	 * @param {bitArray} key the key for HMAC.
	 * @param {Object} [Hash=hash.sha1] The hash function to use.
	 */
	misc.hmacSha1 = class {

		constructor(key) {
			const hmac = this;
			const Hash = hmac._hash = hash.sha1;
			const exKey = [[], []];
			hmac._baseHash = [new Hash(), new Hash()];
			const bs = hmac._baseHash[0].blockSize / 32;

			if (key.length > bs) {
				key = new Hash().update(key).finalize();
			}

			for (let i = 0; i < bs; i++) {
				exKey[0][i] = key[i] ^ 0x36363636;
				exKey[1][i] = key[i] ^ 0x5C5C5C5C;
			}

			hmac._baseHash[0].update(exKey[0]);
			hmac._baseHash[1].update(exKey[1]);
			hmac._resultHash = new Hash(hmac._baseHash[0]);
		}
		reset() {
			const hmac = this;
			hmac._resultHash = new hmac._hash(hmac._baseHash[0]);
			hmac._updated = false;
		}

		update(data) {
			const hmac = this;
			hmac._updated = true;
			hmac._resultHash.update(data);
		}

		digest() {
			const hmac = this;
			const w = hmac._resultHash.finalize();
			const result = new (hmac._hash)(hmac._baseHash[1]).update(w).finalize();

			hmac.reset();

			return result;
		}

		encrypt(data) {
			if (!this._updated) {
				this.update(data);
				return this.digest(data);
			} else {
				throw new Error("encrypt on already updated hmac called!");
			}
		}
	};

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	const GET_RANDOM_VALUES_SUPPORTED = typeof crypto != UNDEFINED_TYPE && typeof crypto.getRandomValues == FUNCTION_TYPE;

	const ERR_INVALID_PASSWORD = "Invalid password";
	const ERR_INVALID_SIGNATURE = "Invalid signature";
	const ERR_ABORT_CHECK_PASSWORD = "zipjs-abort-check-password";

	function getRandomValues(array) {
		if (GET_RANDOM_VALUES_SUPPORTED) {
			return crypto.getRandomValues(array);
		} else {
			return random.getRandomValues(array);
		}
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	const BLOCK_LENGTH = 16;
	const RAW_FORMAT = "raw";
	const PBKDF2_ALGORITHM = { name: "PBKDF2" };
	const HASH_ALGORITHM = { name: "HMAC" };
	const HASH_FUNCTION = "SHA-1";
	const BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_ALGORITHM = Object.assign({ iterations: 1000, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_USAGE = ["deriveBits"];
	const SALT_LENGTH = [8, 12, 16];
	const KEY_LENGTH = [16, 24, 32];
	const SIGNATURE_LENGTH = 10;
	const COUNTER_DEFAULT_VALUE = [0, 0, 0, 0];
	// deno-lint-ignore valid-typeof
	const CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;
	const subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
	const SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE;
	const codecBytes = codec.bytes;
	const Aes = cipher.aes;
	const CtrGladman = mode.ctrGladman;
	const HmacSha1 = misc.hmacSha1;

	let IMPORT_KEY_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE;
	let DERIVE_BITS_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.deriveBits == FUNCTION_TYPE;

	class AESDecryptionStream extends TransformStream {

		constructor({ password, rawPassword, signed, encryptionStrength, checkPasswordOnly }) {
			super({
				start() {
					Object.assign(this, {
						ready: new Promise(resolve => this.resolveReady = resolve),
						password: encodePassword(password, rawPassword),
						signed,
						strength: encryptionStrength - 1,
						pending: new Uint8Array()
					});
				},
				async transform(chunk, controller) {
					const aesCrypto = this;
					const {
						password,
						strength,
						resolveReady,
						ready
					} = aesCrypto;
					if (password) {
						await createDecryptionKeys(aesCrypto, strength, password, subarray(chunk, 0, SALT_LENGTH[strength] + 2));
						chunk = subarray(chunk, SALT_LENGTH[strength] + 2);
						if (checkPasswordOnly) {
							controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
						} else {
							resolveReady();
						}
					} else {
						await ready;
					}
					const output = new Uint8Array(chunk.length - SIGNATURE_LENGTH - ((chunk.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
					controller.enqueue(append(aesCrypto, chunk, output, 0, SIGNATURE_LENGTH, true));
				},
				async flush(controller) {
					const {
						signed,
						ctr,
						hmac,
						pending,
						ready
					} = this;
					if (hmac && ctr) {
						await ready;
						const chunkToDecrypt = subarray(pending, 0, pending.length - SIGNATURE_LENGTH);
						const originalSignature = subarray(pending, pending.length - SIGNATURE_LENGTH);
						let decryptedChunkArray = new Uint8Array();
						if (chunkToDecrypt.length) {
							const encryptedChunk = toBits(codecBytes, chunkToDecrypt);
							hmac.update(encryptedChunk);
							const decryptedChunk = ctr.update(encryptedChunk);
							decryptedChunkArray = fromBits(codecBytes, decryptedChunk);
						}
						if (signed) {
							const signature = subarray(fromBits(codecBytes, hmac.digest()), 0, SIGNATURE_LENGTH);
							for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
								if (signature[indexSignature] != originalSignature[indexSignature]) {
									throw new Error(ERR_INVALID_SIGNATURE);
								}
							}
						}
						controller.enqueue(decryptedChunkArray);
					}
				}
			});
		}
	}

	class AESEncryptionStream extends TransformStream {

		constructor({ password, rawPassword, encryptionStrength }) {
			// deno-lint-ignore prefer-const
			let stream;
			super({
				start() {
					Object.assign(this, {
						ready: new Promise(resolve => this.resolveReady = resolve),
						password: encodePassword(password, rawPassword),
						strength: encryptionStrength - 1,
						pending: new Uint8Array()
					});
				},
				async transform(chunk, controller) {
					const aesCrypto = this;
					const {
						password,
						strength,
						resolveReady,
						ready
					} = aesCrypto;
					let preamble = new Uint8Array();
					if (password) {
						preamble = await createEncryptionKeys(aesCrypto, strength, password);
						resolveReady();
					} else {
						await ready;
					}
					const output = new Uint8Array(preamble.length + chunk.length - (chunk.length % BLOCK_LENGTH));
					output.set(preamble, 0);
					controller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0));
				},
				async flush(controller) {
					const {
						ctr,
						hmac,
						pending,
						ready
					} = this;
					if (hmac && ctr) {
						await ready;
						let encryptedChunkArray = new Uint8Array();
						if (pending.length) {
							const encryptedChunk = ctr.update(toBits(codecBytes, pending));
							hmac.update(encryptedChunk);
							encryptedChunkArray = fromBits(codecBytes, encryptedChunk);
						}
						stream.signature = fromBits(codecBytes, hmac.digest()).slice(0, SIGNATURE_LENGTH);
						controller.enqueue(concat(encryptedChunkArray, stream.signature));
					}
				}
			});
			stream = this;
		}
	}

	function append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
		const {
			ctr,
			hmac,
			pending
		} = aesCrypto;
		const inputLength = input.length - paddingEnd;
		if (pending.length) {
			input = concat(pending, input);
			output = expand(output, inputLength - (inputLength % BLOCK_LENGTH));
		}
		let offset;
		for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
			const inputChunk = toBits(codecBytes, subarray(input, offset, offset + BLOCK_LENGTH));
			if (verifySignature) {
				hmac.update(inputChunk);
			}
			const outputChunk = ctr.update(inputChunk);
			if (!verifySignature) {
				hmac.update(outputChunk);
			}
			output.set(fromBits(codecBytes, outputChunk), offset + paddingStart);
		}
		aesCrypto.pending = subarray(input, offset);
		return output;
	}

	async function createDecryptionKeys(decrypt, strength, password, preamble) {
		const passwordVerificationKey = await createKeys$1(decrypt, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));
		const passwordVerification = subarray(preamble, SALT_LENGTH[strength]);
		if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
			throw new Error(ERR_INVALID_PASSWORD);
		}
	}

	async function createEncryptionKeys(encrypt, strength, password) {
		const salt = getRandomValues(new Uint8Array(SALT_LENGTH[strength]));
		const passwordVerification = await createKeys$1(encrypt, strength, password, salt);
		return concat(salt, passwordVerification);
	}

	async function createKeys$1(aesCrypto, strength, password, salt) {
		aesCrypto.password = null;
		const baseKey = await importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, 8 * ((KEY_LENGTH[strength] * 2) + 2));
		const compositeKey = new Uint8Array(derivedBits);
		const key = toBits(codecBytes, subarray(compositeKey, 0, KEY_LENGTH[strength]));
		const authentication = toBits(codecBytes, subarray(compositeKey, KEY_LENGTH[strength], KEY_LENGTH[strength] * 2));
		const passwordVerification = subarray(compositeKey, KEY_LENGTH[strength] * 2);
		Object.assign(aesCrypto, {
			keys: {
				key,
				authentication,
				passwordVerification
			},
			ctr: new CtrGladman(new Aes(key), Array.from(COUNTER_DEFAULT_VALUE)),
			hmac: new HmacSha1(authentication)
		});
		return passwordVerification;
	}

	async function importKey(format, password, algorithm, extractable, keyUsages) {
		if (IMPORT_KEY_SUPPORTED) {
			try {
				return await subtle.importKey(format, password, algorithm, extractable, keyUsages);
			} catch {
				IMPORT_KEY_SUPPORTED = false;
				return misc.importKey(password);
			}
		} else {
			return misc.importKey(password);
		}
	}

	async function deriveBits(algorithm, baseKey, length) {
		if (DERIVE_BITS_SUPPORTED) {
			try {
				return await subtle.deriveBits(algorithm, baseKey, length);
			} catch {
				DERIVE_BITS_SUPPORTED = false;
				return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
			}
		} else {
			return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
		}
	}

	function encodePassword(password, rawPassword) {
		if (rawPassword === UNDEFINED_VALUE) {
			return encodeText(password);
		} else {
			return rawPassword;
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

	function subarray(array, begin, end) {
		return array.subarray(begin, end);
	}

	function fromBits(codecBytes, chunk) {
		return codecBytes.fromBits(chunk);
	}
	function toBits(codecBytes, chunk) {
		return codecBytes.toBits(chunk);
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	const HEADER_LENGTH = 12;

	class ZipCryptoDecryptionStream extends TransformStream {

		constructor({ password, passwordVerification, checkPasswordOnly }) {
			super({
				start() {
					Object.assign(this, {
						password,
						passwordVerification
					});
					createKeys(this, password);
				},
				transform(chunk, controller) {
					const zipCrypto = this;
					if (zipCrypto.password) {
						const decryptedHeader = decrypt(zipCrypto, chunk.subarray(0, HEADER_LENGTH));
						zipCrypto.password = null;
						if (decryptedHeader.at(-1) != zipCrypto.passwordVerification) {
							throw new Error(ERR_INVALID_PASSWORD);
						}
						chunk = chunk.subarray(HEADER_LENGTH);
					}
					if (checkPasswordOnly) {
						controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
					} else {
						controller.enqueue(decrypt(zipCrypto, chunk));
					}
				}
			});
		}
	}

	class ZipCryptoEncryptionStream extends TransformStream {

		constructor({ password, passwordVerification }) {
			super({
				start() {
					Object.assign(this, {
						password,
						passwordVerification
					});
					createKeys(this, password);
				},
				transform(chunk, controller) {
					const zipCrypto = this;
					let output;
					let offset;
					if (zipCrypto.password) {
						zipCrypto.password = null;
						const header = getRandomValues(new Uint8Array(HEADER_LENGTH));
						header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
						output = new Uint8Array(chunk.length + header.length);
						output.set(encrypt(zipCrypto, header), 0);
						offset = HEADER_LENGTH;
					} else {
						output = new Uint8Array(chunk.length);
						offset = 0;
					}
					output.set(encrypt(zipCrypto, chunk), offset);
					controller.enqueue(output);
				}
			});
		}
	}

	function decrypt(target, input) {
		const output = new Uint8Array(input.length);
		for (let index = 0; index < input.length; index++) {
			output[index] = getByte(target) ^ input[index];
			updateKeys(target, output[index]);
		}
		return output;
	}

	function encrypt(target, input) {
		const output = new Uint8Array(input.length);
		for (let index = 0; index < input.length; index++) {
			output[index] = getByte(target) ^ input[index];
			updateKeys(target, input[index]);
		}
		return output;
	}

	function createKeys(target, password) {
		const keys = [0x12345678, 0x23456789, 0x34567890];
		Object.assign(target, {
			keys,
			crcKey0: new Crc32(keys[0]),
			crcKey2: new Crc32(keys[2])
		});
		for (let index = 0; index < password.length; index++) {
			updateKeys(target, password.charCodeAt(index));
		}
	}

	function updateKeys(target, byte) {
		let [key0, key1, key2] = target.keys;
		target.crcKey0.append([byte]);
		key0 = ~target.crcKey0.get();
		key1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);
		target.crcKey2.append([key1 >>> 24]);
		key2 = ~target.crcKey2.get();
		target.keys = [key0, key1, key2];
	}

	function getByte(target) {
		const temp = target.keys[2] | 2;
		return getInt8(Math.imul(temp, (temp ^ 1)) >>> 8);
	}

	function getInt8(number) {
		return number & 0xFF;
	}

	function getInt32(number) {
		return number & 0xFFFFFFFF;
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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


	const ERR_INVALID_UNCOMPRESSED_SIZE = "Invalid uncompressed size";
	const FORMAT_DEFLATE_RAW = "deflate-raw";
	const FORMAT_DEFLATE64_RAW = "deflate64-raw";

	class DeflateStream extends TransformStream {

		constructor(options, { chunkSize, CompressionStreamZlib, CompressionStream }) {
			super({});
			const { compressed, encrypted, useCompressionStream, zipCrypto, signed, level } = options;
			const stream = this;
			let crc32Stream, encryptionStream;
			let readable = super.readable;
			if ((!encrypted || zipCrypto) && signed) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			if (compressed) {
				readable = pipeThroughCommpressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStream, CompressionStreamZlib, CompressionStream);
			}
			if (encrypted) {
				if (zipCrypto) {
					readable = pipeThrough(readable, new ZipCryptoEncryptionStream(options));
				} else {
					encryptionStream = new AESEncryptionStream(options);
					readable = pipeThrough(readable, encryptionStream);
				}
			}
			setReadable(stream, readable, () => {
				let signature;
				if (encrypted && !zipCrypto) {
					signature = encryptionStream.signature;
				}
				if ((!encrypted || zipCrypto) && signed) {
					signature = new DataView(crc32Stream.value.buffer).getUint32(0);
				}
				stream.signature = signature;
			});
		}
	}

	class InflateStream extends TransformStream {

		constructor(options, { chunkSize, DecompressionStreamZlib, DecompressionStream }) {
			super({});
			const { zipCrypto, encrypted, signed, signature, compressed, useCompressionStream, deflate64 } = options;
			let crc32Stream, decryptionStream;
			let readable = super.readable;
			if (encrypted) {
				if (zipCrypto) {
					readable = pipeThrough(readable, new ZipCryptoDecryptionStream(options));
				} else {
					decryptionStream = new AESDecryptionStream(options);
					readable = pipeThrough(readable, decryptionStream);
				}
			}
			if (compressed) {
				readable = pipeThroughCommpressionStream(readable, useCompressionStream, { chunkSize, deflate64 }, DecompressionStream, DecompressionStreamZlib, DecompressionStream);
			}
			if ((!encrypted || zipCrypto) && signed) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			setReadable(this, readable, () => {
				if ((!encrypted || zipCrypto) && signed) {
					const dataViewSignature = new DataView(crc32Stream.value.buffer);
					if (signature != dataViewSignature.getUint32(0, false)) {
						throw new Error(ERR_INVALID_SIGNATURE);
					}
				}
			});
		}
	}

	function setReadable(stream, readable, flush) {
		readable = pipeThrough(readable, new TransformStream({ flush }));
		Object.defineProperty(stream, "readable", {
			get() {
				return readable;
			}
		});
	}

	function pipeThroughCommpressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamZlib, CompressionStream) {
		const Stream = useCompressionStream && CompressionStreamNative ? CompressionStreamNative : CompressionStreamZlib || CompressionStream;
		const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
		try {
			readable = pipeThrough(readable, new Stream(format, options));
		} catch (error) {
			if (useCompressionStream) {
				if (CompressionStreamZlib) {
					readable = pipeThrough(readable, new CompressionStreamZlib(format, options));
				} else if (CompressionStream) {
					readable = pipeThrough(readable, new CompressionStream(format, options));
				} else {
					throw error;
				}
			} else {
				throw error;
			}
		}
		return readable;
	}

	function pipeThrough(readable, transformStream) {
		return readable.pipeThrough(transformStream);
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	const MESSAGE_EVENT_TYPE = "message";
	const MESSAGE_START = "start";
	const MESSAGE_PULL = "pull";
	const MESSAGE_DATA = "data";
	const MESSAGE_ACK_DATA = "ack";
	const MESSAGE_CLOSE = "close";
	const CODEC_DEFLATE = "deflate";
	const CODEC_INFLATE = "inflate";

	class CodecStream extends TransformStream {

		constructor(options, config) {
			super({});
			const codec = this;
			const { codecType } = options;
			let Stream;
			if (codecType.startsWith(CODEC_DEFLATE)) {
				Stream = DeflateStream;
			} else if (codecType.startsWith(CODEC_INFLATE)) {
				Stream = InflateStream;
			}
			codec.outputSize = 0;
			let inputSize = 0;
			const stream = new Stream(options, config);
			const readable = super.readable;
			const inputSizeStream = new TransformStream({
				transform(chunk, controller) {
					if (chunk && chunk.length) {
						inputSize += chunk.length;
						controller.enqueue(chunk);
					}
				},
				flush() {
					Object.assign(codec, {
						inputSize
					});
				}
			});
			const outputSizeStream = new TransformStream({
				transform(chunk, controller) {
					if (chunk && chunk.length) {
						controller.enqueue(chunk);
						codec.outputSize += chunk.length;
						if (options.outputSize !== UNDEFINED_VALUE && codec.outputSize > options.outputSize) {
							throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
						}
					}
				},
				flush() {
					const { signature } = stream;
					Object.assign(codec, {
						signature,
						inputSize
					});
				}
			});
			Object.defineProperty(codec, "readable", {
				get() {
					return readable.pipeThrough(inputSizeStream).pipeThrough(stream).pipeThrough(outputSizeStream);
				}
			});
		}
	}

	class ChunkStream extends TransformStream {

		constructor(chunkSize) {
			let pendingChunk;
			super({
				transform,
				flush(controller) {
					if (pendingChunk && pendingChunk.length) {
						controller.enqueue(pendingChunk);
					}
				}
			});

			function transform(chunk, controller) {
				if (pendingChunk) {
					const newChunk = new Uint8Array(pendingChunk.length + chunk.length);
					newChunk.set(pendingChunk);
					newChunk.set(chunk, pendingChunk.length);
					chunk = newChunk;
					pendingChunk = null;
				}
				if (chunk.length > chunkSize) {
					controller.enqueue(chunk.slice(0, chunkSize));
					transform(chunk.slice(chunkSize), controller);
				} else {
					pendingChunk = chunk;
				}
			}
		}
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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


	// deno-lint-ignore valid-typeof
	let WEB_WORKERS_SUPPORTED = typeof Worker != UNDEFINED_TYPE;
	let initModule$1 = () => { };

	function configureWorker({ initModule: initModuleFunction }) {
		initModule$1 = initModuleFunction;
	}

	class CodecWorker {

		constructor(workerData, { readable, writable }, { options, config, streamOptions, useWebWorkers, transferStreams, workerURI }, onTaskFinished) {
			const { signal } = streamOptions;
			Object.assign(workerData, {
				busy: true,
				readable: readable
					.pipeThrough(new ChunkStream(config.chunkSize))
					.pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
				writable,
				options: Object.assign({}, options),
				workerURI,
				transferStreams,
				terminate() {
					return new Promise(resolve => {
						const { worker, busy } = workerData;
						if (worker) {
							if (busy) {
								workerData.resolveTerminated = resolve;
							} else {
								worker.terminate();
								resolve();
							}
							workerData.interface = null;
						} else {
							resolve();
						}
					});
				},
				onTaskFinished() {
					const { resolveTerminated } = workerData;
					if (resolveTerminated) {
						workerData.resolveTerminated = null;
						workerData.terminated = true;
						workerData.worker.terminate();
						resolveTerminated();
					}
					workerData.busy = false;
					onTaskFinished(workerData);
				}
			});
			return (useWebWorkers && WEB_WORKERS_SUPPORTED ? createWebWorkerInterface : createWorkerInterface)(workerData, config);
		}
	}

	class ProgressWatcherStream extends TransformStream {

		constructor({ onstart, onprogress, size, onend }) {
			let chunkOffset = 0;
			super({
				async start() {
					if (onstart) {
						await callHandler(onstart, size);
					}
				},
				async transform(chunk, controller) {
					chunkOffset += chunk.length;
					if (onprogress) {
						await callHandler(onprogress, chunkOffset, size);
					}
					controller.enqueue(chunk);
				},
				async flush() {
					if (onend) {
						await callHandler(onend, chunkOffset);
					}
				}
			});
		}
	}

	async function callHandler(handler, ...parameters) {
		try {
			await handler(...parameters);
		} catch {
			// ignored
		}
	}

	function createWorkerInterface(workerData, config) {
		return {
			run: () => runWorker$1(workerData, config)
		};
	}

	function createWebWorkerInterface(workerData, config) {
		const { baseURI, chunkSize } = config;
		let { wasmURI } = config;

		if (!workerData.interface) {
			// deno-lint-ignore valid-typeof
			if (typeof wasmURI == FUNCTION_TYPE) {
				wasmURI = wasmURI();
			}
			let worker;
			try {
				worker = getWebWorker(workerData.workerURI, baseURI, workerData);
			} catch {
				WEB_WORKERS_SUPPORTED = false;
				return createWorkerInterface(workerData, config);
			}
			Object.assign(workerData, {
				worker,
				interface: {
					run: () => runWebWorker(workerData, { chunkSize, wasmURI, baseURI })
				}
			});
		}
		return workerData.interface;
	}

	async function runWorker$1({ options, readable, writable, onTaskFinished }, config) {
		let codecStream;
		try {
			if (!options.useCompressionStream) {
				try {
					await initModule$1(config);
				} catch {
					options.useCompressionStream = true;
				}
			}
			codecStream = new CodecStream(options, config);
			await readable.pipeThrough(codecStream).pipeTo(writable, { preventClose: true, preventAbort: true });
			const {
				signature,
				inputSize,
				outputSize
			} = codecStream;
			return {
				signature,
				inputSize,
				outputSize
			};
		} catch (error) {
			if (codecStream) {
				error.outputSize = codecStream.outputSize;
			}
			throw error;
		} finally {
			onTaskFinished();
		}
	}

	async function runWebWorker(workerData, config) {
		let resolveResult, rejectResult;
		const result = new Promise((resolve, reject) => {
			resolveResult = resolve;
			rejectResult = reject;
		});
		Object.assign(workerData, {
			reader: null,
			writer: null,
			resolveResult,
			rejectResult,
			result
		});
		const { readable, options } = workerData;
		const { writable, closed } = watchClosedStream(workerData.writable);
		const streamsTransferred = sendMessage({
			type: MESSAGE_START,
			options,
			config,
			readable,
			writable
		}, workerData);
		if (!streamsTransferred) {
			Object.assign(workerData, {
				reader: readable.getReader(),
				writer: writable.getWriter()
			});
		}
		const resultValue = await result;
		if (!streamsTransferred) {
			await writable.getWriter().close();
		}
		await closed;
		return resultValue;
	}

	function watchClosedStream(writableSource) {
		let resolveStreamClosed;
		const closed = new Promise(resolve => resolveStreamClosed = resolve);
		const writable = new WritableStream({
			async write(chunk) {
				const writer = writableSource.getWriter();
				await writer.ready;
				await writer.write(chunk);
				writer.releaseLock();
			},
			close() {
				resolveStreamClosed();
			},
			abort(reason) {
				const writer = writableSource.getWriter();
				return writer.abort(reason);
			}
		});
		return { writable, closed };
	}

	let transferStreamsSupported = true;

	function getWebWorker(url, baseURI, workerData) {
		const workerOptions = { type: "module" };
		let scriptUrl, worker;
		// deno-lint-ignore valid-typeof
		if (typeof url == FUNCTION_TYPE) {
			url = url();
		}
		if (url.startsWith("data:") || url.startsWith("blob:")) {
			try {
				worker = new Worker(url);
			} catch {
				worker = new Worker(url, workerOptions);
			}
		} else {
			try {
				scriptUrl = new URL(url, baseURI);
			} catch {
				scriptUrl = url;
			}
			worker = new Worker(scriptUrl, workerOptions);
		}
		worker.addEventListener(MESSAGE_EVENT_TYPE, event => onMessage(event, workerData));
		return worker;
	}

	function sendMessage(message, { worker, writer, onTaskFinished, transferStreams }) {
		try {
			const { value, readable, writable } = message;
			const transferables = [];
			if (value) {
				message.value = value;
				transferables.push(message.value.buffer);
			}
			if (transferStreams && transferStreamsSupported) {
				if (readable) {
					transferables.push(readable);
				}
				if (writable) {
					transferables.push(writable);
				}
			} else {
				message.readable = message.writable = null;
			}
			if (transferables.length) {
				try {
					worker.postMessage(message, transferables);
					return true;
				} catch {
					transferStreamsSupported = false;
					message.readable = message.writable = null;
					worker.postMessage(message);
				}
			} else {
				worker.postMessage(message);
			}
		} catch (error) {
			if (writer) {
				writer.releaseLock();
			}
			onTaskFinished();
			throw error;
		}
	}

	async function onMessage({ data }, workerData) {
		const { type, value, messageId, result, error } = data;
		const { reader, writer, resolveResult, rejectResult, onTaskFinished } = workerData;
		try {
			if (error) {
				const { message, stack, code, name, outputSize } = error;
				const responseError = new Error(message);
				Object.assign(responseError, { stack, code, name, outputSize });
				close(responseError);
			} else {
				if (type == MESSAGE_PULL) {
					const { value, done } = await reader.read();
					sendMessage({ type: MESSAGE_DATA, value, done, messageId }, workerData);
				}
				if (type == MESSAGE_DATA) {
					await writer.ready;
					await writer.write(new Uint8Array(value));
					sendMessage({ type: MESSAGE_ACK_DATA, messageId }, workerData);
				}
				if (type == MESSAGE_CLOSE) {
					close(null, result);
				}
			}
		} catch (error) {
			sendMessage({ type: MESSAGE_CLOSE, messageId }, workerData);
			close(error);
		}

		function close(error, result) {
			if (error) {
				rejectResult(error);
			} else {
				resolveResult(result);
			}
			if (writer) {
				writer.releaseLock();
			}
			onTaskFinished();
		}
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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


	let pool = [];
	const pendingRequests = [];

	let indexWorker = 0;

	async function runWorker(stream, workerOptions) {
		const { options, config } = workerOptions;
		const { transferStreams, useWebWorkers, useCompressionStream, compressed, signed, encrypted } = options;
		const { workerURI, maxWorkers } = config;
		workerOptions.transferStreams = transferStreams || transferStreams === UNDEFINED_VALUE;
		const streamCopy = !compressed && !signed && !encrypted && !workerOptions.transferStreams;
		workerOptions.useWebWorkers = !streamCopy && (useWebWorkers || (useWebWorkers === UNDEFINED_VALUE && config.useWebWorkers));
		workerOptions.workerURI = workerOptions.useWebWorkers && workerURI ? workerURI : UNDEFINED_VALUE;
		options.useCompressionStream = useCompressionStream || (useCompressionStream === UNDEFINED_VALUE && config.useCompressionStream);
		return (await getWorker()).run();

		// deno-lint-ignore require-await
		async function getWorker() {
			const workerData = pool.find(workerData => !workerData.busy);
			if (workerData) {
				clearTerminateTimeout(workerData);
				return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
			} else if (pool.length < maxWorkers) {
				const workerData = { indexWorker };
				indexWorker++;
				pool.push(workerData);
				return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
			} else {
				return new Promise(resolve => pendingRequests.push({ resolve, stream, workerOptions }));
			}
		}

		function onTaskFinished(workerData) {
			if (pendingRequests.length) {
				const [{ resolve, stream, workerOptions }] = pendingRequests.splice(0, 1);
				resolve(new CodecWorker(workerData, stream, workerOptions, onTaskFinished));
			} else if (workerData.worker) {
				clearTerminateTimeout(workerData);
				terminateWorker(workerData, workerOptions);
			} else {
				pool = pool.filter(data => data != workerData);
			}
		}
	}

	function terminateWorker(workerData, workerOptions) {
		const { config } = workerOptions;
		const { terminateWorkerTimeout } = config;
		if (Number.isFinite(terminateWorkerTimeout) && terminateWorkerTimeout >= 0) {
			if (workerData.terminated) {
				workerData.terminated = false;
			} else {
				workerData.terminateTimeout = setTimeout(async () => {
					pool = pool.filter(data => data != workerData);
					try {
						await workerData.terminate();
					} catch {
						// ignored
					}
				}, terminateWorkerTimeout);
			}
		}
	}

	function clearTerminateTimeout(workerData) {
		const { terminateTimeout } = workerData;
		if (terminateTimeout) {
			clearTimeout(terminateTimeout);
			workerData.terminateTimeout = null;
		}
	}

	async function terminateWorkers() {
		await Promise.allSettled(pool.map(workerData => {
			clearTerminateTimeout(workerData);
			return workerData.terminate();
		}));
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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
	const ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
	const ERR_WRITER_NOT_INITIALIZED = "Writer not initialized";

	const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
	const HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
	const HTTP_HEADER_CONTENT_RANGE = "Content-Range";
	const HTTP_HEADER_ACCEPT_RANGES = "Accept-Ranges";
	const HTTP_HEADER_RANGE = "Range";
	const HTTP_HEADER_CONTENT_TYPE = "Content-Type";
	const HTTP_METHOD_HEAD = "HEAD";
	const HTTP_METHOD_GET = "GET";
	const HTTP_RANGE_UNIT = "bytes";
	const DEFAULT_CHUNK_SIZE = 64 * 1024;
	const DEFAULT_BUFFER_SIZE = 256 * 1024;

	const PROPERTY_NAME_WRITABLE = "writable";

	class Stream {

		constructor() {
			this.size = 0;
		}

		init() {
			this.initialized = true;
		}
	}

	class Reader extends Stream {

		get readable() {
			const reader = this;
			const { chunkSize = DEFAULT_CHUNK_SIZE } = reader;
			const readable = new ReadableStream({
				start() {
					this.chunkOffset = 0;
				},
				async pull(controller) {
					const { offset = 0, size, diskNumberStart } = readable;
					const { chunkOffset } = this;
					const dataSize = size === UNDEFINED_VALUE ? chunkSize : Math.min(chunkSize, size - chunkOffset);
					const data = await readUint8Array(reader, offset + chunkOffset, dataSize, diskNumberStart);
					controller.enqueue(data);
					if ((chunkOffset + chunkSize > size) || (size === UNDEFINED_VALUE && !data.length && dataSize)) {
						controller.close();
					} else {
						this.chunkOffset += chunkSize;
					}
				}
			});
			return readable;
		}
	}

	class Writer extends Stream {

		constructor() {
			super();
			const writer = this;
			const writable = new WritableStream({
				write(chunk) {
					if (!writer.initialized) {
						throw new Error(ERR_WRITER_NOT_INITIALIZED);
					}
					return writer.writeUint8Array(chunk);
				}
			});
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
				get() {
					return writable;
				}
			});
		}

		writeUint8Array() {
			// abstract
		}
	}

	class Data64URIReader extends Reader {

		constructor(dataURI) {
			super();
			let dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") {
				dataEnd--;
			}
			const dataStart = dataURI.indexOf(",") + 1;
			Object.assign(this, {
				dataURI,
				dataStart,
				size: Math.floor((dataEnd - dataStart) * 0.75)
			});
		}

		readUint8Array(offset, length) {
			const {
				dataStart,
				dataURI
			} = this;
			const dataArray = new Uint8Array(length);
			const start = Math.floor(offset / 3) * 4;
			const bytes = atob(dataURI.substring(start + dataStart, Math.ceil((offset + length) / 3) * 4 + dataStart));
			const delta = offset - Math.floor(start / 4) * 3;
			let effectiveLength = 0;
			for (let indexByte = delta; indexByte < delta + length && indexByte < bytes.length; indexByte++) {
				dataArray[indexByte - delta] = bytes.charCodeAt(indexByte);
				effectiveLength++;
			}
			if (effectiveLength < dataArray.length) {
				return dataArray.subarray(0, effectiveLength);
			} else {
				return dataArray;
			}
		}
	}

	class Data64URIWriter extends Writer {

		constructor(contentType) {
			super();
			Object.assign(this, {
				data: "data:" + (contentType || "") + ";base64,",
				pending: []
			});
		}

		writeUint8Array(array) {
			const writer = this;
			let indexArray = 0;
			let dataString = writer.pending;
			const delta = writer.pending.length;
			writer.pending = "";
			for (indexArray = 0; indexArray < (Math.floor((delta + array.length) / 3) * 3) - delta; indexArray++) {
				dataString += String.fromCharCode(array[indexArray]);
			}
			for (; indexArray < array.length; indexArray++) {
				writer.pending += String.fromCharCode(array[indexArray]);
			}
			if (dataString.length) {
				if (dataString.length > 2) {
					writer.data += btoa(dataString);
				} else {
					writer.pending += dataString;
				}
			}
		}

		getData() {
			return this.data + btoa(this.pending);
		}
	}

	class BlobReader extends Reader {

		constructor(blob) {
			super();
			Object.assign(this, {
				blob,
				size: blob.size
			});
		}

		async readUint8Array(offset, length) {
			const reader = this;
			const offsetEnd = offset + length;
			const blob = offset || offsetEnd < reader.size ? reader.blob.slice(offset, offsetEnd) : reader.blob;
			let arrayBuffer = await blob.arrayBuffer();
			if (arrayBuffer.byteLength > length) {
				arrayBuffer = arrayBuffer.slice(offset, offsetEnd);
			}
			return new Uint8Array(arrayBuffer);
		}
	}

	class BlobWriter extends Stream {

		constructor(contentType) {
			super();
			const writer = this;
			const transformStream = new TransformStream();
			const headers = [];
			if (contentType) {
				headers.push([HTTP_HEADER_CONTENT_TYPE, contentType]);
			}
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
				get() {
					return transformStream.writable;
				}
			});
			writer.blob = new Response(transformStream.readable, { headers }).blob();
		}

		getData() {
			return this.blob;
		}
	}

	class TextReader extends BlobReader {

		constructor(text) {
			super(new Blob([text], { type: CONTENT_TYPE_TEXT_PLAIN }));
		}
	}

	class TextWriter extends BlobWriter {

		constructor(encoding) {
			super(encoding);
			Object.assign(this, {
				encoding,
				utf8: !encoding || encoding.toLowerCase() == "utf-8"
			});
		}

		async getData() {
			const {
				encoding,
				utf8
			} = this;
			const blob = await super.getData();
			if (blob.text && utf8) {
				return blob.text();
			} else {
				const reader = new FileReader();
				return new Promise((resolve, reject) => {
					Object.assign(reader, {
						onload: ({ target }) => resolve(target.result),
						onerror: () => reject(reader.error)
					});
					reader.readAsText(blob, encoding);
				});
			}
		}
	}

	class FetchReader extends Reader {

		constructor(url, options) {
			super();
			createHttpReader(this, url, options);
		}

		async init() {
			await initHttpReader(this, sendFetchRequest, getFetchRequestData);
			super.init();
		}

		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendFetchRequest, getFetchRequestData);
		}
	}

	class XHRReader extends Reader {

		constructor(url, options) {
			super();
			createHttpReader(this, url, options);
		}

		async init() {
			await initHttpReader(this, sendXMLHttpRequest, getXMLHttpRequestData);
			super.init();
		}

		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendXMLHttpRequest, getXMLHttpRequestData);
		}
	}

	function createHttpReader(httpReader, url, options) {
		const {
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests,
			combineSizeEocd
		} = options;
		options = Object.assign({}, options);
		delete options.preventHeadRequest;
		delete options.useRangeHeader;
		delete options.forceRangeRequests;
		delete options.combineSizeEocd;
		delete options.useXHR;
		Object.assign(httpReader, {
			url,
			options,
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests,
			combineSizeEocd
		});
	}

	async function initHttpReader(httpReader, sendRequest, getRequestData) {
		const {
			url,
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests,
			combineSizeEocd
		} = httpReader;
		if (isHttpFamily(url) && (useRangeHeader || forceRangeRequests) && (typeof preventHeadRequest == "undefined" || preventHeadRequest)) {
			const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, combineSizeEocd ? -END_OF_CENTRAL_DIR_LENGTH : undefined));
			const acceptRanges = response.headers.get(HTTP_HEADER_ACCEPT_RANGES);
			if (!forceRangeRequests && (!acceptRanges || acceptRanges.toLowerCase() != HTTP_RANGE_UNIT)) {
				throw new Error(ERR_HTTP_RANGE);
			} else {
				if (combineSizeEocd) {
					httpReader.eocdCache = new Uint8Array(await response.arrayBuffer());
				}
				let contentSize;
				const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
				if (contentRangeHeader) {
					const splitHeader = contentRangeHeader.trim().split(/\s*\/\s*/);
					if (splitHeader.length) {
						const headerValue = splitHeader[1];
						if (headerValue && headerValue != "*") {
							contentSize = Number(headerValue);
						}
					}
				}
				if (contentSize === UNDEFINED_VALUE) {
					await getContentLength(httpReader, sendRequest, getRequestData);
				} else {
					httpReader.size = contentSize;
				}
			}
		} else {
			await getContentLength(httpReader, sendRequest, getRequestData);
		}
	}

	async function readUint8ArrayHttpReader(httpReader, index, length, sendRequest, getRequestData) {
		const {
			useRangeHeader,
			forceRangeRequests,
			eocdCache,
			size,
			options
		} = httpReader;
		if (useRangeHeader || forceRangeRequests) {
			if (eocdCache && index == size - END_OF_CENTRAL_DIR_LENGTH && length == END_OF_CENTRAL_DIR_LENGTH) {
				return eocdCache;
			}
			if (index >= size) {
				return new Uint8Array();
			} else {
				if (index + length > size) {
					length = size - index;
				}
				const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));
				if (response.status != 206) {
					throw new Error(ERR_HTTP_RANGE);
				}
				return new Uint8Array(await response.arrayBuffer());
			}
		} else {
			const { data } = httpReader;
			if (!data) {
				await getRequestData(httpReader, options);
			}
			return new Uint8Array(httpReader.data.subarray(index, index + length));
		}
	}

	function getRangeHeaders(httpReader, index = 0, length = 1) {
		return Object.assign({}, getHeaders(httpReader), { [HTTP_HEADER_RANGE]: HTTP_RANGE_UNIT + "=" + (index < 0 ? index : index + "-" + (index + length - 1)) });
	}

	function getHeaders({ options }) {
		const { headers } = options;
		if (headers) {
			if (Symbol.iterator in headers) {
				return Object.fromEntries(headers);
			} else {
				return headers;
			}
		}
	}

	async function getFetchRequestData(httpReader) {
		await getRequestData(httpReader, sendFetchRequest);
	}

	async function getXMLHttpRequestData(httpReader) {
		await getRequestData(httpReader, sendXMLHttpRequest);
	}

	async function getRequestData(httpReader, sendRequest) {
		const response = await sendRequest(HTTP_METHOD_GET, httpReader, getHeaders(httpReader));
		httpReader.data = new Uint8Array(await response.arrayBuffer());
		if (!httpReader.size) {
			httpReader.size = httpReader.data.length;
		}
	}

	async function getContentLength(httpReader, sendRequest, getRequestData) {
		if (httpReader.preventHeadRequest) {
			await getRequestData(httpReader, httpReader.options);
		} else {
			const response = await sendRequest(HTTP_METHOD_HEAD, httpReader, getHeaders(httpReader));
			const contentLength = response.headers.get(HTTP_HEADER_CONTENT_LENGTH);
			if (contentLength) {
				httpReader.size = Number(contentLength);
			} else {
				await getRequestData(httpReader, httpReader.options);
			}
		}
	}

	async function sendFetchRequest(method, { options, url }, headers) {
		const response = await fetch(url, Object.assign({}, options, { method, headers }));
		if (response.status < 400) {
			return response;
		} else {
			throw response.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (response.statusText || response.status));
		}
	}

	function sendXMLHttpRequest(method, { url }, headers) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.addEventListener("load", () => {
				if (request.status < 400) {
					const headers = [];
					request.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach(header => {
						const splitHeader = header.trim().split(/\s*:\s*/);
						splitHeader[0] = splitHeader[0].trim().replace(/^[a-z]|-[a-z]/g, value => value.toUpperCase());
						headers.push(splitHeader);
					});
					resolve({
						status: request.status,
						arrayBuffer: () => request.response,
						headers: new Map(headers)
					});
				} else {
					reject(request.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (request.statusText || request.status)));
				}
			}, false);
			request.addEventListener("error", event => reject(event.detail ? event.detail.error : new Error("Network error")), false);
			request.open(method, url);
			if (headers) {
				for (const entry of Object.entries(headers)) {
					request.setRequestHeader(entry[0], entry[1]);
				}
			}
			request.responseType = "arraybuffer";
			request.send();
		});
	}

	class HttpReader extends Reader {

		constructor(url, options = {}) {
			super();
			Object.assign(this, {
				url,
				reader: options.useXHR ? new XHRReader(url, options) : new FetchReader(url, options)
			});
		}

		set size(value) {
			// ignored
		}

		get size() {
			return this.reader.size;
		}

		async init() {
			await this.reader.init();
			super.init();
		}

		readUint8Array(index, length) {
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
			array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
			Object.assign(this, {
				array,
				size: array.length
			});
		}

		readUint8Array(index, length) {
			return this.array.slice(index, index + length);
		}
	}

	class Uint8ArrayWriter extends Writer {

		constructor(defaultBufferSize) {
			super();
			this.defaultBufferSize = defaultBufferSize || DEFAULT_BUFFER_SIZE;
		}

		init(initSize = 0) {
			Object.assign(this, {
				offset: 0,
				array: new Uint8Array(initSize > 0 ? initSize : this.defaultBufferSize)
			});
			super.init();
		}

		writeUint8Array(array) {
			const writer = this;
			const requiredLength = writer.offset + array.length;
			if (requiredLength > writer.array.length) {
				let newLength = writer.array.length ? writer.array.length * 2 : writer.defaultBufferSize;
				while (newLength < requiredLength) {
					newLength *= 2;
				}
				const previousArray = writer.array;
				writer.array = new Uint8Array(newLength);
				writer.array.set(previousArray);
			}
			writer.array.set(array, writer.offset);
			writer.offset += array.length;
		}

		getData() {
			if (this.offset === this.array.length) {
				return this.array;
			} else {
				return this.array.slice(0, this.offset);
			}
		}
	}

	class SplitDataReader extends Reader {

		constructor(readers) {
			super();
			this.readers = readers;
		}

		async init() {
			const reader = this;
			const { readers } = reader;
			reader.lastDiskNumber = 0;
			reader.lastDiskOffset = 0;
			await Promise.all(readers.map(async (diskReader, indexDiskReader) => {
				await diskReader.init();
				if (indexDiskReader != readers.length - 1) {
					reader.lastDiskOffset += diskReader.size;
				}
				reader.size += diskReader.size;
			}));
			super.init();
		}

		async readUint8Array(offset, length, diskNumber = 0) {
			const reader = this;
			const { readers } = this;
			let result;
			let currentDiskNumber = diskNumber;
			if (currentDiskNumber == -1) {
				currentDiskNumber = readers.length - 1;
			}
			let currentReaderOffset = offset;
			while (readers[currentDiskNumber] && currentReaderOffset >= readers[currentDiskNumber].size) {
				currentReaderOffset -= readers[currentDiskNumber].size;
				currentDiskNumber++;
			}
			const currentReader = readers[currentDiskNumber];
			if (currentReader) {
				const currentReaderSize = currentReader.size;
				if (currentReaderOffset + length <= currentReaderSize) {
					result = await readUint8Array(currentReader, currentReaderOffset, length);
				} else {
					const chunkLength = currentReaderSize - currentReaderOffset;
					result = new Uint8Array(length);
					const firstPart = await readUint8Array(currentReader, currentReaderOffset, chunkLength);
					result.set(firstPart, 0);
					const secondPart = await reader.readUint8Array(offset + chunkLength, length - chunkLength, diskNumber);
					result.set(secondPart, chunkLength);
					if (firstPart.length + secondPart.length < length) {
						result = result.subarray(0, firstPart.length + secondPart.length);
					}
				}
			} else {
				result = new Uint8Array();
			}
			reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
			return result;
		}
	}

	class SplitDataWriter extends Stream {

		constructor(writerGenerator, maxSize = 4294967295) {
			super();
			const writer = this;
			Object.assign(writer, {
				diskNumber: 0,
				diskOffset: 0,
				size: 0,
				maxSize,
				availableSize: maxSize
			});
			let diskSourceWriter, diskWritable, diskWriter;
			const writable = new WritableStream({
				async write(chunk) {
					const { availableSize } = writer;
					if (!diskWriter) {
						const { value, done } = await writerGenerator.next();
						if (done && !value) {
							throw new Error(ERR_ITERATOR_COMPLETED_TOO_SOON);
						} else {
							diskSourceWriter = value;
							diskSourceWriter.size = 0;
							if (diskSourceWriter.maxSize) {
								writer.maxSize = diskSourceWriter.maxSize;
							}
							writer.availableSize = writer.maxSize;
							await initStream(diskSourceWriter);
							diskWritable = value.writable;
							diskWriter = diskWritable.getWriter();
						}
						await this.write(chunk);
					} else if (chunk.length >= availableSize) {
						await writeChunk(chunk.subarray(0, availableSize));
						await closeDisk();
						writer.diskOffset += diskSourceWriter.size;
						writer.diskNumber++;
						diskWriter = null;
						await this.write(chunk.subarray(availableSize));
					} else {
						await writeChunk(chunk);
					}
				},
				async close() {
					await diskWriter.ready;
					await closeDisk();
				}
			});
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
				get() {
					return writable;
				}
			});

			async function writeChunk(chunk) {
				const chunkLength = chunk.length;
				if (chunkLength) {
					await diskWriter.ready;
					await diskWriter.write(chunk);
					diskSourceWriter.size += chunkLength;
					writer.size += chunkLength;
					writer.availableSize -= chunkLength;
				}
			}

			async function closeDisk() {
				await diskWriter.close();
			}
		}
	}

	class GenericReader {

		constructor(reader) {
			if (Array.isArray(reader)) {
				reader = new SplitDataReader(reader);
			}
			if (reader instanceof ReadableStream) {
				reader = {
					readable: reader
				};
			}
			return reader;
		}
	}

	class GenericWriter {

		constructor(writer) {
			if (writer.writable === UNDEFINED_VALUE && typeof writer.next == FUNCTION_TYPE) {
				writer = new SplitDataWriter(writer);
			}
			if (writer instanceof WritableStream) {
				writer = {
					writable: writer
				};
			}
			if (writer.size === UNDEFINED_VALUE) {
				writer.size = 0;
			}
			if (!(writer instanceof SplitDataWriter)) {
				Object.assign(writer, {
					diskNumber: 0,
					diskOffset: 0,
					availableSize: Infinity,
					maxSize: Infinity
				});
			}
			return writer;
		}
	}

	function isHttpFamily(url) {
		const { baseURI } = getConfiguration();
		const { protocol } = new URL(url, baseURI);
		return protocol == "http:" || protocol == "https:";
	}

	async function initStream(stream, initSize) {
		if (stream.init && !stream.initialized) {
			await stream.init(initSize);
		} else {
			return Promise.resolve();
		}
	}

	function readUint8Array(reader, offset, size, diskNumber) {
		return reader.readUint8Array(offset, size, diskNumber);
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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

	/* global TextDecoder */

	const CP437 = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("");
	const VALID_CP437 = CP437.length == 256;

	function decodeCP437(stringValue) {
		if (VALID_CP437) {
			let result = "";
			for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
				result += CP437[stringValue[indexCharacter]];
			}
			return result;
		} else {
			return new TextDecoder().decode(stringValue);
		}
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	function decodeText(value, encoding) {
		if (encoding && encoding.trim().toLowerCase() == "cp437") {
			return decodeCP437(value);
		} else {
			return new TextDecoder(encoding).decode(value);
		}
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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

	const PROPERTY_NAME_FILENAME = "filename";
	const PROPERTY_NAME_RAW_FILENAME = "rawFilename";
	const PROPERTY_NAME_COMMENT = "comment";
	const PROPERTY_NAME_RAW_COMMENT = "rawComment";
	const PROPERTY_NAME_UNCOMPRESSED_SIZE = "uncompressedSize";
	const PROPERTY_NAME_COMPRESSED_SIZE = "compressedSize";
	const PROPERTY_NAME_OFFSET = "offset";
	const PROPERTY_NAME_DISK_NUMBER_START = "diskNumberStart";
	const PROPERTY_NAME_LAST_MODIFICATION_DATE = "lastModDate";
	const PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE = "rawLastModDate";
	const PROPERTY_NAME_LAST_ACCESS_DATE = "lastAccessDate";
	const PROPERTY_NAME_RAW_LAST_ACCESS_DATE = "rawLastAccessDate";
	const PROPERTY_NAME_CREATION_DATE = "creationDate";
	const PROPERTY_NAME_RAW_CREATION_DATE = "rawCreationDate";
	const PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES = "internalFileAttributes";
	const PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES = "externalFileAttributes";
	const PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW = "msdosAttributesRaw";
	const PROPERTY_NAME_MSDOS_ATTRIBUTES = "msdosAttributes";
	const PROPERTY_NAME_MS_DOS_COMPATIBLE = "msDosCompatible";
	const PROPERTY_NAME_ZIP64 = "zip64";
	const PROPERTY_NAME_ENCRYPTED = "encrypted";
	const PROPERTY_NAME_VERSION = "version";
	const PROPERTY_NAME_VERSION_MADE_BY = "versionMadeBy";
	const PROPERTY_NAME_ZIPCRYPTO = "zipCrypto";
	const PROPERTY_NAME_DIRECTORY = "directory";
	const PROPERTY_NAME_EXECUTABLE = "executable";
	const PROPERTY_NAME_COMPRESSION_METHOD = "compressionMethod";
	const PROPERTY_NAME_SIGNATURE = "signature";
	const PROPERTY_NAME_EXTRA_FIELD = "extraField";
	const PROPERTY_NAME_EXTRA_FIELD_INFOZIP = "extraFieldInfoZip";
	const PROPERTY_NAME_EXTRA_FIELD_UNIX = "extraFieldUnix";
	const PROPERTY_NAME_UID = "uid";
	const PROPERTY_NAME_GID = "gid";
	const PROPERTY_NAME_UNIX_MODE = "unixMode";
	const PROPERTY_NAME_SETUID = "setuid";
	const PROPERTY_NAME_SETGID = "setgid";
	const PROPERTY_NAME_STICKY = "sticky";
	const PROPERTY_NAME_BITFLAG = "bitFlag";
	const PROPERTY_NAME_FILENAME_UTF8 = "filenameUTF8";
	const PROPERTY_NAME_COMMENT_UTF8 = "commentUTF8";
	const PROPERTY_NAME_RAW_EXTRA_FIELD = "rawExtraField";
	const PROPERTY_NAME_EXTRA_FIELD_ZIP64 = "extraFieldZip64";
	const PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH = "extraFieldUnicodePath";
	const PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT = "extraFieldUnicodeComment";
	const PROPERTY_NAME_EXTRA_FIELD_AES = "extraFieldAES";
	const PROPERTY_NAME_EXTRA_FIELD_NTFS = "extraFieldNTFS";
	const PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP = "extraFieldExtendedTimestamp";

	const PROPERTY_NAMES = [
		PROPERTY_NAME_FILENAME,
		PROPERTY_NAME_RAW_FILENAME,
		PROPERTY_NAME_UNCOMPRESSED_SIZE,
		PROPERTY_NAME_COMPRESSED_SIZE,
		PROPERTY_NAME_LAST_MODIFICATION_DATE,
		PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE,
		PROPERTY_NAME_COMMENT,
		PROPERTY_NAME_RAW_COMMENT,
		PROPERTY_NAME_LAST_ACCESS_DATE,
		PROPERTY_NAME_CREATION_DATE,
		PROPERTY_NAME_RAW_CREATION_DATE,
		PROPERTY_NAME_OFFSET,
		PROPERTY_NAME_DISK_NUMBER_START,
		PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW,
		PROPERTY_NAME_MSDOS_ATTRIBUTES,
		PROPERTY_NAME_MS_DOS_COMPATIBLE,
		PROPERTY_NAME_ZIP64,
		PROPERTY_NAME_ENCRYPTED,
		PROPERTY_NAME_VERSION,
		PROPERTY_NAME_VERSION_MADE_BY,
		PROPERTY_NAME_ZIPCRYPTO,
		PROPERTY_NAME_DIRECTORY,
		PROPERTY_NAME_EXECUTABLE,
		PROPERTY_NAME_COMPRESSION_METHOD,
		PROPERTY_NAME_SIGNATURE,
		PROPERTY_NAME_EXTRA_FIELD,
		PROPERTY_NAME_EXTRA_FIELD_UNIX,
		PROPERTY_NAME_EXTRA_FIELD_INFOZIP,
		PROPERTY_NAME_UID,
		PROPERTY_NAME_GID,
		PROPERTY_NAME_UNIX_MODE,
		PROPERTY_NAME_SETUID,
		PROPERTY_NAME_SETGID,
		PROPERTY_NAME_STICKY,
		PROPERTY_NAME_BITFLAG,
		PROPERTY_NAME_FILENAME_UTF8,
		PROPERTY_NAME_COMMENT_UTF8,
		PROPERTY_NAME_RAW_EXTRA_FIELD,
		PROPERTY_NAME_EXTRA_FIELD_ZIP64,
		PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH,
		PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT,
		PROPERTY_NAME_EXTRA_FIELD_AES,
		PROPERTY_NAME_EXTRA_FIELD_NTFS,
		PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP
	];

	class Entry {

		constructor(data) {
			PROPERTY_NAMES.forEach(name => this[name] = data[name]);
		}

	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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

	const OPTION_FILENAME_ENCODING = "filenameEncoding";
	const OPTION_COMMENT_ENCODING = "commentEncoding";
	const OPTION_DECODE_TEXT = "decodeText";
	const OPTION_EXTRACT_PREPENDED_DATA = "extractPrependedData";
	const OPTION_EXTRACT_APPENDED_DATA = "extractAppendedData";
	const OPTION_PASSWORD = "password";
	const OPTION_RAW_PASSWORD = "rawPassword";
	const OPTION_PASS_THROUGH = "passThrough";
	const OPTION_SIGNAL = "signal";
	const OPTION_CHECK_PASSWORD_ONLY = "checkPasswordOnly";
	const OPTION_CHECK_OVERLAPPING_ENTRY_ONLY = "checkOverlappingEntryOnly";
	const OPTION_CHECK_OVERLAPPING_ENTRY = "checkOverlappingEntry";
	const OPTION_CHECK_SIGNATURE = "checkSignature";
	const OPTION_USE_WEB_WORKERS = "useWebWorkers";
	const OPTION_USE_COMPRESSION_STREAM = "useCompressionStream";
	const OPTION_TRANSFER_STREAMS = "transferStreams";
	const OPTION_PREVENT_CLOSE = "preventClose";
	const OPTION_ENCRYPTION_STRENGTH = "encryptionStrength";
	const OPTION_EXTENDED_TIMESTAMP = "extendedTimestamp";
	const OPTION_KEEP_ORDER = "keepOrder";
	const OPTION_LEVEL = "level";
	const OPTION_BUFFERED_WRITE = "bufferedWrite";
	const OPTION_DATA_DESCRIPTOR_SIGNATURE = "dataDescriptorSignature";
	const OPTION_USE_UNICODE_FILE_NAMES = "useUnicodeFileNames";
	const OPTION_DATA_DESCRIPTOR = "dataDescriptor";
	const OPTION_SUPPORT_ZIP64_SPLIT_FILE = "supportZip64SplitFile";
	const OPTION_ENCODE_TEXT = "encodeText";
	const OPTION_OFFSET = "offset";
	const OPTION_USDZ = "usdz";
	const OPTION_UNIX_EXTRA_FIELD_TYPE = "unixExtraFieldType";

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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
	const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
	const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
	const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
	const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
	const ERR_ENCRYPTED = "File contains encrypted entry";
	const ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const ERR_SPLIT_ZIP_FILE = "Split zip file";
	const ERR_OVERLAPPING_ENTRY = "Overlapping entry found";
	const CHARSET_UTF8 = "utf-8";
	const PROPERTY_NAME_UTF8_SUFFIX = "UTF8";
	const CHARSET_CP437 = "cp437";
	const ZIP64_PROPERTIES = [
		[PROPERTY_NAME_UNCOMPRESSED_SIZE, MAX_32_BITS],
		[PROPERTY_NAME_COMPRESSED_SIZE, MAX_32_BITS],
		[PROPERTY_NAME_OFFSET, MAX_32_BITS],
		[PROPERTY_NAME_DISK_NUMBER_START, MAX_16_BITS]
	];
	const ZIP64_EXTRACTION = {
		[MAX_16_BITS]: {
			getValue: getUint32,
			bytes: 4
		},
		[MAX_32_BITS]: {
			getValue: getBigUint64,
			bytes: 8
		}
	};

	class ZipReader {

		constructor(reader, options = {}) {
			Object.assign(this, {
				reader: new GenericReader(reader),
				options,
				config: getConfiguration(),
				readRanges: []
			});
		}

		async* getEntriesGenerator(options = {}) {
			const zipReader = this;
			let { reader } = zipReader;
			const { config } = zipReader;
			await initStream(reader);
			if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
				reader = new BlobReader(await new Response(reader.readable).blob());
				await initStream(reader);
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
				throw new Error(ERR_BAD_FORMAT);
			}
			reader.chunkSize = getChunkSize(config);
			const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, reader.size, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);
			if (!endOfDirectoryInfo) {
				const signatureArray = await readUint8Array(reader, 0, 4);
				const signatureView = getDataView$1(signatureArray);
				if (getUint32(signatureView) == SPLIT_ZIP_FILE_SIGNATURE) {
					throw new Error(ERR_SPLIT_ZIP_FILE);
				} else {
					throw new Error(ERR_EOCDR_NOT_FOUND);
				}
			}
			const endOfDirectoryView = getDataView$1(endOfDirectoryInfo);
			let directoryDataLength = getUint32(endOfDirectoryView, 12);
			let directoryDataOffset = getUint32(endOfDirectoryView, 16);
			const commentOffset = endOfDirectoryInfo.offset;
			const commentLength = getUint16(endOfDirectoryView, 20);
			const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
			let lastDiskNumber = getUint16(endOfDirectoryView, 4);
			const expectedLastDiskNumber = reader.lastDiskNumber || 0;
			let diskNumber = getUint16(endOfDirectoryView, 6);
			let filesLength = getUint16(endOfDirectoryView, 8);
			let prependedDataLength = 0;
			let startOffset = 0;
			if (directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS || diskNumber == MAX_16_BITS) {
				const endOfDirectoryLocatorArray = await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
				const endOfDirectoryLocatorView = getDataView$1(endOfDirectoryLocatorArray);
				if (getUint32(endOfDirectoryLocatorView, 0) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
					let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
					let endOfDirectoryView = getDataView$1(endOfDirectoryArray);
					const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
					if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
						const originalDirectoryDataOffset = directoryDataOffset;
						directoryDataOffset = expectedDirectoryDataOffset;
						if (directoryDataOffset > originalDirectoryDataOffset) {
							prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
						}
						endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
						endOfDirectoryView = getDataView$1(endOfDirectoryArray);
					}
					if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
						throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
					}
					if (lastDiskNumber == MAX_16_BITS) {
						lastDiskNumber = getUint32(endOfDirectoryView, 16);
					}
					if (diskNumber == MAX_16_BITS) {
						diskNumber = getUint32(endOfDirectoryView, 20);
					}
					if (filesLength == MAX_16_BITS) {
						filesLength = getBigUint64(endOfDirectoryView, 32);
					}
					if (directoryDataLength == MAX_32_BITS) {
						directoryDataLength = getBigUint64(endOfDirectoryView, 40);
					}
					directoryDataOffset -= directoryDataLength;
				}
			}
			if (directoryDataOffset >= reader.size) {
				prependedDataLength = reader.size - directoryDataOffset - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
				directoryDataOffset = reader.size - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
			}
			if (expectedLastDiskNumber != lastDiskNumber) {
				throw new Error(ERR_SPLIT_ZIP_FILE);
			}
			if (directoryDataOffset < 0) {
				throw new Error(ERR_BAD_FORMAT);
			}
			let offset = 0;
			let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
			let directoryView = getDataView$1(directoryArray);
			if (directoryDataLength) {
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					if (directoryDataOffset > originalDirectoryDataOffset) {
						prependedDataLength += directoryDataOffset - originalDirectoryDataOffset;
					}
					directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
					directoryView = getDataView$1(directoryArray);
				}
			}
			const expectedDirectoryDataLength = endOfDirectoryInfo.offset - directoryDataOffset - (reader.lastDiskOffset || 0);
			if (directoryDataLength != expectedDirectoryDataLength && expectedDirectoryDataLength >= 0) {
				directoryDataLength = expectedDirectoryDataLength;
				directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
				directoryView = getDataView$1(directoryArray);
			}
			if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const filenameEncoding = getOptionValue$1(zipReader, options, OPTION_FILENAME_ENCODING);
			const commentEncoding = getOptionValue$1(zipReader, options, OPTION_COMMENT_ENCODING);
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry$1(reader, config, zipReader.options);
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
					throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				}
				readCommonHeader(fileEntry, directoryView, offset + 6);
				const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
				const filenameOffset = offset + 46;
				const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
				const commentOffset = extraFieldOffset + fileEntry.extraFieldLength;
				const versionMadeBy = getUint16(directoryView, offset + 4);
				const msDosCompatible = versionMadeBy >> 8 == 0;
				const unixCompatible = versionMadeBy >> 8 == 3;
				const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
				const commentLength = getUint16(directoryView, offset + 32);
				const endOffset = commentOffset + commentLength;
				const rawComment = directoryArray.subarray(commentOffset, endOffset);
				const filenameUTF8 = languageEncodingFlag;
				const commentUTF8 = languageEncodingFlag;
				const externalFileAttributes = getUint32(directoryView, offset + 38);
				const msdosAttributesRaw = externalFileAttributes & MAX_8_BITS;
				const msdosAttributes = {
					readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
					hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
					system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
					directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
					archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
				};
				const offsetFileEntry = getUint32(directoryView, offset + 42) + prependedDataLength;
				const decode = getOptionValue$1(zipReader, options, OPTION_DECODE_TEXT) || decodeText;
				const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
				const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
				let filename = decode(rawFilename, rawFilenameEncoding);
				if (filename === UNDEFINED_VALUE) {
					filename = decodeText(rawFilename, rawFilenameEncoding);
				}
				let comment = decode(rawComment, rawCommentEncoding);
				if (comment === UNDEFINED_VALUE) {
					comment = decodeText(rawComment, rawCommentEncoding);
				}
				Object.assign(fileEntry, {
					versionMadeBy,
					msDosCompatible,
					compressedSize: 0,
					uncompressedSize: 0,
					commentLength,
					offset: offsetFileEntry,
					diskNumberStart: getUint16(directoryView, offset + 34),
					internalFileAttributes: getUint16(directoryView, offset + 36),
					externalFileAttributes,
					msdosAttributesRaw,
					msdosAttributes,
					rawFilename,
					filenameUTF8,
					commentUTF8,
					rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset),
					rawComment,
					filename,
					comment
				});
				startOffset = Math.max(offsetFileEntry, startOffset);
				readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
				const unixExternalUpper = (fileEntry.externalFileAttributes >> 16) & MAX_16_BITS;
				if (fileEntry.unixMode === UNDEFINED_VALUE && (unixExternalUpper & (FILE_ATTR_UNIX_DEFAULT_MASK | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_TYPE_DIR)) != 0) {
					fileEntry.unixMode = unixExternalUpper;
				}
				const setuid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETUID_MASK);
				const setgid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETGID_MASK);
				const sticky = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_STICKY_MASK);
				const executable = (fileEntry.unixMode !== UNDEFINED_VALUE)
					? ((fileEntry.unixMode & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0)
					: (unixCompatible && ((unixExternalUpper & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0));
				const modeIsDir = fileEntry.unixMode !== UNDEFINED_VALUE && ((fileEntry.unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
				const upperIsDir = ((unixExternalUpper & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR);
				Object.assign(fileEntry, {
					setuid,
					setgid,
					sticky,
					unixExternalUpper,
					internalFileAttribute: fileEntry.internalFileAttributes,
					externalFileAttribute: fileEntry.externalFileAttributes,
					executable,
					directory: modeIsDir || upperIsDir || (msDosCompatible && msdosAttributes.directory) || (filename.endsWith(DIRECTORY_SIGNATURE) && !fileEntry.uncompressedSize),
					zipCrypto: fileEntry.encrypted && !fileEntry.extraFieldAES
				});
				const entry = new Entry(fileEntry);
				entry.getData = (writer, options) => fileEntry.getData(writer, entry, zipReader.readRanges, options);
				entry.arrayBuffer = async options => {
					const writer = new TransformStream();
					const [arrayBuffer] = await Promise.all([
						new Response(writer.readable).arrayBuffer(),
						fileEntry.getData(writer, entry, zipReader.readRanges, options)]);
					return arrayBuffer;
				};
				offset = endOffset;
				const { onprogress } = options;
				if (onprogress) {
					try {
						await onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
					} catch {
						// ignored
					}
				}
				yield entry;
			}
			const extractPrependedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
			const extractAppendedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
			if (extractPrependedData) {
				zipReader.prependedData = startOffset > 0 ? await readUint8Array(reader, 0, startOffset) : new Uint8Array();
			}
			zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + END_OF_CENTRAL_DIR_LENGTH, commentLength) : new Uint8Array();
			if (extractAppendedData) {
				zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : new Uint8Array();
			}
			return true;
		}

		async getEntries(options = {}) {
			const entries = [];
			for await (const entry of this.getEntriesGenerator(options)) {
				entries.push(entry);
			}
			return entries;
		}

		async close() {
		}
	}

	class ZipReaderStream {

		constructor(options = {}) {
			const { readable, writable } = new TransformStream();
			const gen = new ZipReader(readable, options).getEntriesGenerator();
			this.readable = new ReadableStream({
				async pull(controller) {
					const { done, value } = await gen.next();
					if (done)
						return controller.close();
					const chunk = {
						...value,
						readable: (function () {
							const { readable, writable } = new TransformStream();
							if (value.getData) {
								value.getData(writable);
								return readable;
							}
						})()
					};
					delete chunk.getData;
					controller.enqueue(chunk);
				}
			});
			this.writable = writable;
		}
	}

	let ZipEntry$1 = class ZipEntry {

		constructor(reader, config, options) {
			Object.assign(this, {
				reader,
				config,
				options
			});
		}

		async getData(writer, fileEntry, readRanges, options = {}) {
			const zipEntry = this;
			const {
				reader,
				offset,
				diskNumberStart,
				extraFieldAES,
				extraFieldZip64,
				compressionMethod,
				config,
				bitFlag,
				signature,
				rawLastModDate,
				uncompressedSize,
				compressedSize
			} = zipEntry;
			const {
				dataDescriptor
			} = bitFlag;
			const localDirectory = fileEntry.localDirectory = {};
			const dataArray = await readUint8Array(reader, offset, HEADER_SIZE, diskNumberStart);
			const dataView = getDataView$1(dataArray);
			let password = getOptionValue$1(zipEntry, options, OPTION_PASSWORD);
			let rawPassword = getOptionValue$1(zipEntry, options, OPTION_RAW_PASSWORD);
			const passThrough = getOptionValue$1(zipEntry, options, OPTION_PASS_THROUGH);
			password = password && password.length && password;
			rawPassword = rawPassword && rawPassword.length && rawPassword;
			if (extraFieldAES) {
				if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION);
				}
			}
			if ((compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64) && !passThrough) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
			}
			readCommonHeader(localDirectory, dataView, 4);
			const {
				extraFieldLength,
				filenameLength,
				lastAccessDate,
				creationDate
			} = localDirectory;
			localDirectory.rawExtraField = extraFieldLength ?
				await readUint8Array(reader, offset + HEADER_SIZE + filenameLength, extraFieldLength, diskNumberStart) :
				new Uint8Array();
			readCommonFooter(zipEntry, localDirectory, dataView, 4, true);
			Object.assign(fileEntry, { lastAccessDate, creationDate });
			const encrypted = zipEntry.encrypted && localDirectory.encrypted && !passThrough;
			const zipCrypto = encrypted && !extraFieldAES;
			if (!passThrough) {
				fileEntry.zipCrypto = zipCrypto;
			}
			if (encrypted) {
				if (!zipCrypto && extraFieldAES.strength === UNDEFINED_VALUE) {
					throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
				} else if (!password && !rawPassword) {
					throw new Error(ERR_ENCRYPTED);
				}
			}
			const dataOffset = offset + HEADER_SIZE + filenameLength + extraFieldLength;
			const size = compressedSize;
			const readable = reader.readable;
			Object.assign(readable, {
				diskNumberStart,
				offset: dataOffset,
				size
			});
			const signal = getOptionValue$1(zipEntry, options, OPTION_SIGNAL);
			const checkPasswordOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
			let checkOverlappingEntry = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
			const checkOverlappingEntryOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
			if (checkOverlappingEntryOnly) {
				checkOverlappingEntry = true;
			}
			const { onstart, onprogress, onend } = options;
			const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
			let useCompressionStream = getOptionValue$1(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
			if (deflate64) {
				useCompressionStream = false;
			}
			const workerOptions = {
				options: {
					codecType: CODEC_INFLATE,
					password,
					rawPassword,
					zipCrypto,
					encryptionStrength: extraFieldAES && extraFieldAES.strength,
					signed: getOptionValue$1(zipEntry, options, OPTION_CHECK_SIGNATURE) && !passThrough,
					passwordVerification: zipCrypto && (dataDescriptor ? ((rawLastModDate >>> 8) & MAX_8_BITS) : ((signature >>> 24) & MAX_8_BITS)),
					outputSize: passThrough ? compressedSize : uncompressedSize,
					signature,
					compressed: compressionMethod != 0 && !passThrough,
					encrypted: zipEntry.encrypted && !passThrough,
					useWebWorkers: getOptionValue$1(zipEntry, options, OPTION_USE_WEB_WORKERS),
					useCompressionStream,
					transferStreams: getOptionValue$1(zipEntry, options, OPTION_TRANSFER_STREAMS),
					deflate64,
					checkPasswordOnly
				},
				config,
				streamOptions: { signal, size, onstart, onprogress, onend }
			};
			if (checkOverlappingEntry) {
				await detectOverlappingEntry({
					reader,
					fileEntry,
					offset,
					diskNumberStart,
					signature,
					compressedSize,
					uncompressedSize,
					dataOffset,
					dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
					extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
					readRanges
				});
			}
			let writable;
			try {
				if (!checkOverlappingEntryOnly) {
					if (checkPasswordOnly) {
						writer = new WritableStream();
					}
					writer = new GenericWriter(writer);
					await initStream(writer, passThrough ? compressedSize : uncompressedSize);
					({ writable } = writer);
					const { outputSize } = await runWorker({ readable, writable }, workerOptions);
					writer.size += outputSize;
					if (outputSize != (passThrough ? compressedSize : uncompressedSize)) {
						throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
					}
				}
			} catch (error) {
				if (error.outputSize !== UNDEFINED_VALUE) {
					writer.size += error.outputSize;
				}
				if (!checkPasswordOnly || error.message != ERR_ABORT_CHECK_PASSWORD) {
					throw error;
				}
			} finally {
				const preventClose = getOptionValue$1(zipEntry, options, OPTION_PREVENT_CLOSE);
				if (!preventClose && writable && !writable.locked) {
					await writable.getWriter().close();
				}
			}
			return checkPasswordOnly || checkOverlappingEntryOnly ? UNDEFINED_VALUE : writer.getData ? writer.getData() : writable;
		}
	};

	function readCommonHeader(directory, dataView, offset) {
		const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
		const encrypted = (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED;
		const rawLastModDate = getUint32(dataView, offset + 6);
		Object.assign(directory, {
			encrypted,
			version: getUint16(dataView, offset),
			bitFlag: {
				level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
				dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
				languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
			},
			rawLastModDate,
			lastModDate: getDate(rawLastModDate),
			filenameLength: getUint16(dataView, offset + 22),
			extraFieldLength: getUint16(dataView, offset + 24)
		});
	}

	function readCommonFooter(fileEntry, directory, dataView, offset, localDirectory) {
		const { rawExtraField } = directory;
		const extraField = directory.extraField = new Map();
		const rawExtraFieldView = getDataView$1(new Uint8Array(rawExtraField));
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
		} catch {
			// ignored
		}
		const compressionMethod = getUint16(dataView, offset + 4);
		Object.assign(directory, {
			signature: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
			compressedSize: getUint32(dataView, offset + HEADER_OFFSET_COMPRESSED_SIZE),
			uncompressedSize: getUint32(dataView, offset + HEADER_OFFSET_UNCOMPRESSED_SIZE)
		});
		const extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
		if (extraFieldZip64) {
			readExtraFieldZip64(extraFieldZip64, directory);
			directory.extraFieldZip64 = extraFieldZip64;
		}
		const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
		if (extraFieldUnicodePath) {
			readExtraFieldUnicode(extraFieldUnicodePath, PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, directory, fileEntry);
			directory.extraFieldUnicodePath = extraFieldUnicodePath;
		}
		const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
		if (extraFieldUnicodeComment) {
			readExtraFieldUnicode(extraFieldUnicodeComment, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT, directory, fileEntry);
			directory.extraFieldUnicodeComment = extraFieldUnicodeComment;
		}
		const extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
		if (extraFieldAES) {
			readExtraFieldAES(extraFieldAES, directory, compressionMethod);
			directory.extraFieldAES = extraFieldAES;
		} else {
			directory.compressionMethod = compressionMethod;
		}
		const extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);
		if (extraFieldNTFS) {
			readExtraFieldNTFS(extraFieldNTFS, directory);
			directory.extraFieldNTFS = extraFieldNTFS;
		}
		const extraFieldUnix = extraField.get(EXTRAFIELD_TYPE_UNIX);
		if (extraFieldUnix) {
			readExtraFieldUnix(extraFieldUnix, directory, false);
			directory.extraFieldUnix = extraFieldUnix;
		} else {
			const extraFieldInfoZip = extraField.get(EXTRAFIELD_TYPE_INFOZIP);
			if (extraFieldInfoZip) {
				readExtraFieldUnix(extraFieldInfoZip, directory, true);
				directory.extraFieldInfoZip = extraFieldInfoZip;
			}
		}
		const extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
		if (extraFieldExtendedTimestamp) {
			readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory);
			directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
		}
		const extraFieldUSDZ = extraField.get(EXTRAFIELD_TYPE_USDZ);
		if (extraFieldUSDZ) {
			directory.extraFieldUSDZ = extraFieldUSDZ;
		}
	}

	function readExtraFieldZip64(extraFieldZip64, directory) {
		directory.zip64 = true;
		const extraFieldView = getDataView$1(extraFieldZip64.data);
		const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
		for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
			const [propertyName, max] = missingProperties[indexMissingProperty];
			if (directory[propertyName] == max) {
				const extraction = ZIP64_EXTRACTION[max];
				directory[propertyName] = extraFieldZip64[propertyName] = extraction.getValue(extraFieldView, offset);
				offset += extraction.bytes;
			} else if (extraFieldZip64[propertyName]) {
				throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
			}
		}
	}

	function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
		const extraFieldView = getDataView$1(extraFieldUnicode.data);
		const crc32 = new Crc32();
		crc32.append(fileEntry[rawPropertyName]);
		const dataViewSignature = getDataView$1(new Uint8Array(4));
		dataViewSignature.setUint32(0, crc32.get(), true);
		const signature = getUint32(extraFieldView, 1);
		Object.assign(extraFieldUnicode, {
			version: getUint8(extraFieldView, 0),
			[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
			valid: !fileEntry.bitFlag.languageEncodingFlag && signature == getUint32(dataViewSignature, 0)
		});
		if (extraFieldUnicode.valid) {
			directory[propertyName] = extraFieldUnicode[propertyName];
			directory[propertyName + PROPERTY_NAME_UTF8_SUFFIX] = true;
		}
	}

	function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
		const extraFieldView = getDataView$1(extraFieldAES.data);
		const strength = getUint8(extraFieldView, 4);
		Object.assign(extraFieldAES, {
			vendorVersion: getUint8(extraFieldView, 0),
			vendorId: getUint8(extraFieldView, 2),
			strength,
			originalCompressionMethod: compressionMethod,
			compressionMethod: getUint16(extraFieldView, 5)
		});
		directory.compressionMethod = extraFieldAES.compressionMethod;
	}

	function readExtraFieldNTFS(extraFieldNTFS, directory) {
		const extraFieldView = getDataView$1(extraFieldNTFS.data);
		let offsetExtraField = 4;
		let tag1Data;
		try {
			while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
				const tagValue = getUint16(extraFieldView, offsetExtraField);
				const attributeSize = getUint16(extraFieldView, offsetExtraField + 2);
				if (tagValue == EXTRAFIELD_TYPE_NTFS_TAG1) {
					tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
				}
				offsetExtraField += 4 + attributeSize;
			}
		} catch {
			// ignored
		}
		try {
			if (tag1Data && tag1Data.length == 24) {
				const tag1View = getDataView$1(tag1Data);
				const rawLastModDate = tag1View.getBigUint64(0, true);
				const rawLastAccessDate = tag1View.getBigUint64(8, true);
				const rawCreationDate = tag1View.getBigUint64(16, true);
				Object.assign(extraFieldNTFS, {
					rawLastModDate,
					rawLastAccessDate,
					rawCreationDate
				});
				const lastModDate = getDateNTFS(rawLastModDate);
				const lastAccessDate = getDateNTFS(rawLastAccessDate);
				const creationDate = getDateNTFS(rawCreationDate);
				const extraFieldData = { lastModDate, lastAccessDate, creationDate };
				Object.assign(extraFieldNTFS, extraFieldData);
				Object.assign(directory, extraFieldData);
			}
		} catch {
			// ignored
		}
	}

	function readExtraFieldUnix(extraField, directory, isInfoZip) {
		try {
			const view = getDataView$1(new Uint8Array(extraField.data));
			let offset = 0;
			const version = getUint8(view, offset++);
			const uidSize = getUint8(view, offset++);
			const uidBytes = extraField.data.subarray(offset, offset + uidSize);
			offset += uidSize;
			const uid = unpackUnixId(uidBytes);
			const gidSize = getUint8(view, offset++);
			const gidBytes = extraField.data.subarray(offset, offset + gidSize);
			offset += gidSize;
			const gid = unpackUnixId(gidBytes);
			let unixMode = UNDEFINED_VALUE;
			if (!isInfoZip && offset + 2 <= extraField.data.length) {
				const base = extraField.data;
				const modeView = new DataView(base.buffer, base.byteOffset + offset, 2);
				unixMode = modeView.getUint16(0, true);
			}
			Object.assign(extraField, { version, uid, gid, unixMode });
			if (uid !== UNDEFINED_VALUE) {
				directory.uid = uid;
			}
			if (gid !== UNDEFINED_VALUE) {
				directory.gid = gid;
			}
			if (unixMode !== UNDEFINED_VALUE) {
				directory.unixMode = unixMode;
			}
		} catch {
			// ignored
		}
	}

	function unpackUnixId(bytes) {
		const buffer = new Uint8Array(4);
		buffer.set(bytes, 0);
		const view = new DataView(buffer.buffer, buffer.byteOffset, 4);
		return view.getUint32(0, true);
	}

	function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory) {
		const extraFieldView = getDataView$1(extraFieldExtendedTimestamp.data);
		const flags = getUint8(extraFieldView, 0);
		const timeProperties = [];
		const timeRawProperties = [];
		if (localDirectory) {
			if ((flags & 0x1) == 0x1) {
				timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
			}
			if ((flags & 0x2) == 0x2) {
				timeProperties.push(PROPERTY_NAME_LAST_ACCESS_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_LAST_ACCESS_DATE);
			}
			if ((flags & 0x4) == 0x4) {
				timeProperties.push(PROPERTY_NAME_CREATION_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_CREATION_DATE);
			}
		} else if (extraFieldExtendedTimestamp.data.length >= 5) {
			timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
		}
		let offset = 1;
		timeProperties.forEach((propertyName, indexProperty) => {
			if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
				const time = getUint32(extraFieldView, offset);
				directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = new Date(time * 1000);
				const rawPropertyName = timeRawProperties[indexProperty];
				extraFieldExtendedTimestamp[rawPropertyName] = time;
			}
			offset += 4;
		});
	}

	async function detectOverlappingEntry({
		reader,
		fileEntry,
		offset,
		diskNumberStart,
		signature,
		compressedSize,
		uncompressedSize,
		dataOffset,
		dataDescriptor,
		extraFieldZip64,
		readRanges
	}) {
		let diskOffset = 0;
		if (diskNumberStart) {
			for (let indexReader = 0; indexReader < diskNumberStart; indexReader++) {
				const diskReader = reader.readers[indexReader];
				diskOffset += diskReader.size;
			}
		}
		let dataDescriptorLength = 0;
		if (dataDescriptor) {
			if (extraFieldZip64) {
				dataDescriptorLength = DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH;
			} else {
				dataDescriptorLength = DATA_DESCRIPTOR_RECORD_LENGTH;
			}
		}
		if (dataDescriptorLength) {
			const dataDescriptorArray = await readUint8Array(reader, dataOffset + compressedSize, dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH, diskNumberStart);
			const dataDescriptorSignature = getUint32(getDataView$1(dataDescriptorArray), 0) == DATA_DESCRIPTOR_RECORD_SIGNATURE;
			if (dataDescriptorSignature) {
				const readSignature = getUint32(getDataView$1(dataDescriptorArray), 4);
				let readCompressedSize;
				let readUncompressedSize;
				if (extraFieldZip64) {
					readCompressedSize = getBigUint64(getDataView$1(dataDescriptorArray), 8);
					readUncompressedSize = getBigUint64(getDataView$1(dataDescriptorArray), 16);
				} else {
					readCompressedSize = getUint32(getDataView$1(dataDescriptorArray), 8);
					readUncompressedSize = getUint32(getDataView$1(dataDescriptorArray), 12);
				}
				const matchSignature = (fileEntry.encrypted && !fileEntry.zipCrypto) || readSignature == signature;
				if (matchSignature &&
					readCompressedSize == compressedSize &&
					readUncompressedSize == uncompressedSize) {
					dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
				}
			}
		}
		const range = {
			start: diskOffset + offset,
			end: diskOffset + dataOffset + compressedSize + dataDescriptorLength,
			fileEntry
		};
		for (const otherRange of readRanges) {
			if (otherRange.fileEntry != fileEntry && range.start >= otherRange.start && range.start < otherRange.end) {
				const error = new Error(ERR_OVERLAPPING_ENTRY);
				error.overlappingEntry = otherRange.fileEntry;
				throw error;
			}
		}
		readRanges.push(range);
	}

	async function seekSignature(reader, signature, startOffset, minimumBytes, maximumLength) {
		const signatureArray = new Uint8Array(4);
		const signatureView = getDataView$1(signatureArray);
		setUint32$1(signatureView, 0, signature);
		const maximumBytes = minimumBytes + maximumLength;
		return (await seek(minimumBytes)) || await seek(Math.min(maximumBytes, startOffset));

		async function seek(length) {
			const offset = startOffset - length;
			const bytes = await readUint8Array(reader, offset, length);
			for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
				if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] &&
					bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) {
					return {
						offset: offset + indexByte,
						buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
					};
				}
			}
		}
	}

	function getOptionValue$1(zipReader, options, name) {
		return options[name] === UNDEFINED_VALUE ? zipReader.options[name] : options[name];
	}

	function getDate(timeRaw) {
		const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & MAX_16_BITS;
		try {
			return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
		} catch {
			// ignored
		}
	}

	function getDateNTFS(timeRaw) {
		return new Date((Number((timeRaw / BigInt(10000)) - BigInt(11644473600000))));
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
		return Number(view.getBigUint64(offset, true));
	}

	function setUint32$1(view, offset, value) {
		view.setUint32(offset, value, true);
	}

	function getDataView$1(array) {
		return new DataView(array.buffer);
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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
	const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
	const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (make sure 'keepOrder' is set to 'true')";
	const ERR_UNDEFINED_UNCOMPRESSED_SIZE = "Undefined uncompressed size";
	const ERR_ZIP_NOT_EMPTY = "Zip file not empty";
	const ERR_INVALID_UID = "Invalid uid (must be integer 0..2^32-1)";
	const ERR_INVALID_GID = "Invalid gid (must be integer 0..2^32-1)";
	const ERR_INVALID_UNIX_MODE = "Invalid UNIX mode (must be integer 0..65535)";
	const ERR_INVALID_UNIX_EXTRA_FIELD_TYPE = "Invalid unixExtraFieldType (must be 'infozip' or 'unix')";
	const ERR_INVALID_MSDOS_ATTRIBUTES = "Invalid msdosAttributesRaw (must be integer 0..255)";
	const ERR_INVALID_MSDOS_DATA = "Invalid msdosAttributes (must be an object with boolean flags)";

	const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
	const INFOZIP_EXTRA_FIELD_TYPE = "infozip";
	const UNIX_EXTRA_FIELD_TYPE = "unix";

	let workers = 0;
	const pendingEntries = [];

	class ZipWriter {

		constructor(writer, options = {}) {
			writer = new GenericWriter(writer);
			const addSplitZipSignature =
				writer.availableSize !== UNDEFINED_VALUE && writer.availableSize > 0 && writer.availableSize !== Infinity &&
				writer.maxSize !== UNDEFINED_VALUE && writer.maxSize > 0 && writer.maxSize !== Infinity;
			Object.assign(this, {
				writer,
				addSplitZipSignature,
				options,
				config: getConfiguration(),
				files: new Map(),
				filenames: new Set(),
				offset: options[OPTION_OFFSET] === UNDEFINED_VALUE ? writer.size || writer.writable.size || 0 : options[OPTION_OFFSET],
				pendingEntriesSize: 0,
				pendingAddFileCalls: new Set(),
				bufferedWrites: 0
			});
		}

		async prependZip(reader) {
			if (this.filenames.size) {
				throw new Error(ERR_ZIP_NOT_EMPTY);
			}
			reader = new GenericReader(reader);
			const zipReader = new ZipReader(reader.readable);
			const entries = await zipReader.getEntries();
			await zipReader.close();
			await reader.readable.pipeTo(this.writer.writable, { preventClose: true, preventAbort: true });
			this.writer.size = this.offset = reader.size;
			this.filenames = new Set(entries.map(entry => entry.filename));
			this.files = new Map(entries.map(entry => {
				const {
					version,
					compressionMethod,
					lastModDate,
					lastAccessDate,
					creationDate,
					rawFilename,
					bitFlag,
					encrypted,
					uncompressedSize,
					compressedSize,
					diskOffset,
					diskNumber,
					zip64
				} = entry;
				let {
					rawExtraFieldZip64,
					rawExtraFieldAES,
					rawExtraFieldExtendedTimestamp,
					rawExtraFieldNTFS,
					rawExtraFieldUnix,
					rawExtraField,
				} = entry;
				const { level, languageEncodingFlag, dataDescriptor } = bitFlag;
				rawExtraFieldZip64 = rawExtraFieldZip64 || new Uint8Array();
				rawExtraFieldAES = rawExtraFieldAES || new Uint8Array();
				rawExtraFieldExtendedTimestamp = rawExtraFieldExtendedTimestamp || new Uint8Array();
				rawExtraFieldNTFS = rawExtraFieldNTFS || new Uint8Array();
				rawExtraFieldUnix = entry.rawExtraFieldUnix || new Uint8Array();
				rawExtraField = rawExtraField || new Uint8Array();
				const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
				const zip64UncompressedSize = zip64 && uncompressedSize > MAX_32_BITS;
				const zip64CompressedSize = zip64 && compressedSize > MAX_32_BITS;
				const {
					headerArray,
					headerView
				} = getHeaderArrayData({
					version,
					bitFlag: getBitFlag(level, languageEncodingFlag, dataDescriptor, encrypted, compressionMethod),
					compressionMethod,
					uncompressedSize,
					compressedSize,
					lastModDate,
					rawFilename,
					zip64CompressedSize,
					zip64UncompressedSize,
					extraFieldLength
				});
				Object.assign(entry, {
					zip64UncompressedSize,
					zip64CompressedSize,
					zip64Offset: zip64 && this.offset - diskOffset > MAX_32_BITS,
					zip64DiskNumberStart: zip64 && diskNumber > MAX_16_BITS,
					rawExtraFieldZip64,
					rawExtraFieldAES,
					rawExtraFieldExtendedTimestamp,
					rawExtraFieldNTFS,
					rawExtraFieldUnix,
					rawExtraField,
					extendedTimestamp: rawExtraFieldExtendedTimestamp.length > 0 || rawExtraFieldNTFS.length > 0,
					extraFieldExtendedTimestampFlag: 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0),
					headerArray,
					headerView
				});
				return [entry.filename, entry];
			}));
		}

		async add(name = "", reader, options = {}) {
			const zipWriter = this;
			const {
				pendingAddFileCalls,
				config
			} = zipWriter;
			if (workers < config.maxWorkers) {
				workers++;
			} else {
				await new Promise(resolve => pendingEntries.push(resolve));
			}
			let promiseAddFile;
			try {
				name = name.trim();
				if (zipWriter.filenames.has(name)) {
					throw new Error(ERR_DUPLICATED_NAME);
				}
				zipWriter.filenames.add(name);
				promiseAddFile = addFile(zipWriter, name, reader, options);
				pendingAddFileCalls.add(promiseAddFile);
				return await promiseAddFile;
			} catch (error) {
				zipWriter.filenames.delete(name);
				throw error;
			} finally {
				pendingAddFileCalls.delete(promiseAddFile);
				const pendingEntry = pendingEntries.shift();
				if (pendingEntry) {
					pendingEntry();
				} else {
					workers--;
				}
			}
		}

		remove(entry) {
			const { filenames, files } = this;
			if (typeof entry == "string") {
				entry = files.get(entry);
			}
			if (entry && entry.filename !== UNDEFINED_VALUE) {
				const { filename } = entry;
				if (filenames.has(filename) && files.has(filename)) {
					filenames.delete(filename);
					files.delete(filename);
					return true;
				}
			}
			return false;
		}

		async close(comment = new Uint8Array(), options = {}) {
			const zipWriter = this;
			const { pendingAddFileCalls, writer } = this;
			const { writable } = writer;
			while (pendingAddFileCalls.size) {
				await Promise.allSettled(Array.from(pendingAddFileCalls));
			}
			await closeFile(zipWriter, comment, options);
			const preventClose = getOptionValue(zipWriter, options, OPTION_PREVENT_CLOSE);
			if (!preventClose) {
				await writable.getWriter().close();
			}
			return writer.getData ? writer.getData() : writable;
		}
	}

	class ZipWriterStream {

		constructor(options = {}) {
			const { readable, writable } = new TransformStream();
			this.readable = readable;
			this.zipWriter = new ZipWriter(writable, options);
		}

		transform(path) {
			const { readable, writable } = new TransformStream({
				flush: () => { this.zipWriter.close(); }
			});
			this.zipWriter.add(path, readable);
			return { readable: this.readable, writable };
		}

		writable(path) {
			const { readable, writable } = new TransformStream();
			this.zipWriter.add(path, readable);
			return writable;
		}

		close(comment = UNDEFINED_VALUE, options = {}) {
			return this.zipWriter.close(comment, options);
		}
	}

	async function addFile(zipWriter, name, reader, options) {
		name = name.trim();
		let msDosCompatible = getOptionValue(zipWriter, options, PROPERTY_NAME_MS_DOS_COMPATIBLE);
		let versionMadeBy = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION_MADE_BY, msDosCompatible ? 20 : 768);
		const executable = getOptionValue(zipWriter, options, PROPERTY_NAME_EXECUTABLE);
		const uid = getOptionValue(zipWriter, options, PROPERTY_NAME_UID);
		const gid = getOptionValue(zipWriter, options, PROPERTY_NAME_GID);
		let unixMode = getOptionValue(zipWriter, options, PROPERTY_NAME_UNIX_MODE);
		const unixExtraFieldType = getOptionValue(zipWriter, options, OPTION_UNIX_EXTRA_FIELD_TYPE);
		let setuid = getOptionValue(zipWriter, options, PROPERTY_NAME_SETUID);
		let setgid = getOptionValue(zipWriter, options, PROPERTY_NAME_SETGID);
		let sticky = getOptionValue(zipWriter, options, PROPERTY_NAME_STICKY);
		if (uid !== UNDEFINED_VALUE && (uid < 0 || uid > MAX_32_BITS)) {
			throw new Error(ERR_INVALID_UID);
		}
		if (gid !== UNDEFINED_VALUE && (gid < 0 || gid > MAX_32_BITS)) {
			throw new Error(ERR_INVALID_GID);
		}
		if (unixMode !== UNDEFINED_VALUE && (unixMode < 0 || unixMode > MAX_16_BITS)) {
			throw new Error(ERR_INVALID_UNIX_MODE);
		}
		if (unixExtraFieldType !== UNDEFINED_VALUE && unixExtraFieldType !== INFOZIP_EXTRA_FIELD_TYPE && unixExtraFieldType !== UNIX_EXTRA_FIELD_TYPE) {
			throw new Error(ERR_INVALID_UNIX_EXTRA_FIELD_TYPE);
		}
		let msdosAttributesRaw = getOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW);
		let msdosAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES);
		const hasUnixMetadata = uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE || unixMode !== UNDEFINED_VALUE || unixExtraFieldType;
		const hasMsDosProvided = msdosAttributesRaw !== UNDEFINED_VALUE || msdosAttributes !== UNDEFINED_VALUE;
		if (hasUnixMetadata) {
			msDosCompatible = false;
			versionMadeBy = (versionMadeBy & MAX_16_BITS) | (3 << 8);
		} else if (hasMsDosProvided) {
			msDosCompatible = true;
			versionMadeBy = (versionMadeBy & MAX_8_BITS);
		}
		if (msdosAttributesRaw !== UNDEFINED_VALUE && (msdosAttributesRaw < 0 || msdosAttributesRaw > MAX_8_BITS)) {
			throw new Error(ERR_INVALID_MSDOS_ATTRIBUTES);
		}
		if (msdosAttributes && typeof msdosAttributes !== OBJECT_TYPE) {
			throw new Error(ERR_INVALID_MSDOS_DATA);
		}
		if (versionMadeBy > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		let externalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES, 0);
		if (!options[PROPERTY_NAME_DIRECTORY] && name.endsWith(DIRECTORY_SIGNATURE)) {
			options[PROPERTY_NAME_DIRECTORY] = true;
		}
		const directory = getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY);
		if (directory) {
			if (!name.endsWith(DIRECTORY_SIGNATURE)) {
				name += DIRECTORY_SIGNATURE;
			}
			if (externalFileAttributes === 0) {
				externalFileAttributes = FILE_ATTR_MSDOS_DIR_MASK;
				if (!msDosCompatible) {
					externalFileAttributes |= (FILE_ATTR_UNIX_TYPE_DIR | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
				}
			}
		} else if (!msDosCompatible && externalFileAttributes === 0) {
			if (executable) {
				externalFileAttributes = (FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
			} else {
				externalFileAttributes = FILE_ATTR_UNIX_DEFAULT_MASK << 16;
			}
		}
		let unixExternalUpper;
		if (!msDosCompatible) {
			unixExternalUpper = (externalFileAttributes >> 16) & MAX_16_BITS;
			unixMode = unixMode === UNDEFINED_VALUE ? unixExternalUpper : (unixMode & MAX_16_BITS);
			if (setuid) {
				unixMode |= FILE_ATTR_UNIX_SETUID_MASK;
			} else {
				setuid = Boolean(unixMode & FILE_ATTR_UNIX_SETUID_MASK);
			}
			if (setgid) {
				unixMode |= FILE_ATTR_UNIX_SETGID_MASK;
			} else {
				setgid = Boolean(unixMode & FILE_ATTR_UNIX_SETGID_MASK);
			}
			if (sticky) {
				unixMode |= FILE_ATTR_UNIX_STICKY_MASK;
			} else {
				sticky = Boolean(unixMode & FILE_ATTR_UNIX_STICKY_MASK);
			}
			if (directory) {
				unixMode |= FILE_ATTR_UNIX_TYPE_DIR;
			}
			externalFileAttributes = ((unixMode & MAX_16_BITS) << 16) | (externalFileAttributes & MAX_8_BITS);
		}
		({ msdosAttributesRaw, msdosAttributes } = normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes));
		if (hasMsDosProvided) {
			externalFileAttributes = (externalFileAttributes & MAX_32_BITS) | (msdosAttributesRaw & MAX_8_BITS);
		}
		const encode = getOptionValue(zipWriter, options, OPTION_ENCODE_TEXT, encodeText);
		let rawFilename = encode(name);
		if (rawFilename === UNDEFINED_VALUE) {
			rawFilename = encodeText(name);
		}
		if (getLength(rawFilename) > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		const comment = options[PROPERTY_NAME_COMMENT] || "";
		let rawComment = encode(comment);
		if (rawComment === UNDEFINED_VALUE) {
			rawComment = encodeText(comment);
		}
		if (getLength(rawComment) > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT);
		}
		const version = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION, VERSION_DEFLATE);
		if (version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const lastModDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, new Date());
		const lastAccessDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_ACCESS_DATE);
		const creationDate = getOptionValue(zipWriter, options, PROPERTY_NAME_CREATION_DATE);
		const internalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, 0);
		const passThrough = getOptionValue(zipWriter, options, OPTION_PASS_THROUGH);
		let password, rawPassword;
		if (!passThrough) {
			password = getOptionValue(zipWriter, options, OPTION_PASSWORD);
			rawPassword = getOptionValue(zipWriter, options, OPTION_RAW_PASSWORD);
		}
		const encryptionStrength = getOptionValue(zipWriter, options, OPTION_ENCRYPTION_STRENGTH, 3);
		const zipCrypto = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIPCRYPTO);
		const extendedTimestamp = getOptionValue(zipWriter, options, OPTION_EXTENDED_TIMESTAMP, true);
		const keepOrder = getOptionValue(zipWriter, options, OPTION_KEEP_ORDER, true);
		const useWebWorkers = getOptionValue(zipWriter, options, OPTION_USE_WEB_WORKERS);
		const bufferedWrite = getOptionValue(zipWriter, options, OPTION_BUFFERED_WRITE);
		const dataDescriptorSignature = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR_SIGNATURE, false);
		const signal = getOptionValue(zipWriter, options, OPTION_SIGNAL);
		const useUnicodeFileNames = getOptionValue(zipWriter, options, OPTION_USE_UNICODE_FILE_NAMES, true);
		const compressionMethod = getOptionValue(zipWriter, options, PROPERTY_NAME_COMPRESSION_METHOD);
		let level = getOptionValue(zipWriter, options, OPTION_LEVEL);
		let useCompressionStream = getOptionValue(zipWriter, options, OPTION_USE_COMPRESSION_STREAM);
		let dataDescriptor = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR);
		if (bufferedWrite && dataDescriptor === UNDEFINED_VALUE) {
			dataDescriptor = false;
		}
		if (dataDescriptor === UNDEFINED_VALUE || zipCrypto) {
			dataDescriptor = true;
		}
		if (level !== UNDEFINED_VALUE && level != 6) {
			useCompressionStream = false;
		}
		if (!useCompressionStream && (zipWriter.config.CompressionStream === UNDEFINED_VALUE && zipWriter.config.CompressionStreamZlib === UNDEFINED_VALUE)) {
			level = 0;
		}
		let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
		if (!zipCrypto && (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) && !(encryptionStrength >= 1 && encryptionStrength <= 3)) {
			throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
		}
		let rawExtraField = new Uint8Array();
		const extraField = options[PROPERTY_NAME_EXTRA_FIELD];
		if (extraField) {
			let extraFieldSize = 0;
			let offset = 0;
			extraField.forEach(data => extraFieldSize += 4 + getLength(data));
			rawExtraField = new Uint8Array(extraFieldSize);
			extraField.forEach((data, type) => {
				if (type > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
				}
				if (getLength(data) > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
				}
				arraySet(rawExtraField, new Uint16Array([type]), offset);
				arraySet(rawExtraField, new Uint16Array([getLength(data)]), offset + 2);
				arraySet(rawExtraField, data, offset + 4);
				offset += 4 + getLength(data);
			});
		}
		let maximumCompressedSize = 0;
		let maximumEntrySize = 0;
		let uncompressedSize = 0;
		if (passThrough) {
			uncompressedSize = options[PROPERTY_NAME_UNCOMPRESSED_SIZE];
			if (uncompressedSize === UNDEFINED_VALUE) {
				throw new Error(ERR_UNDEFINED_UNCOMPRESSED_SIZE);
			}
		}
		const zip64Enabled = zip64 === true;
		if (reader) {
			reader = new GenericReader(reader);
			await initStream(reader);
			if (!passThrough) {
				if (reader.size === UNDEFINED_VALUE) {
					dataDescriptor = true;
					if (zip64 || zip64 === UNDEFINED_VALUE) {
						zip64 = true;
						uncompressedSize = maximumCompressedSize = MAX_32_BITS + 1;
					}
				} else {
					options.uncompressedSize = uncompressedSize = reader.size;
					maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
				}
			} else {
				options.uncompressedSize = uncompressedSize;
				maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
			}
		}
		const { diskOffset, diskNumber, maxSize } = zipWriter.writer;
		const zip64UncompressedSize = zip64Enabled || uncompressedSize > MAX_32_BITS;
		const zip64CompressedSize = zip64Enabled || maximumCompressedSize > MAX_32_BITS;
		const zip64Offset = zip64Enabled || zipWriter.offset + zipWriter.pendingEntriesSize - diskOffset > MAX_32_BITS;
		const supportZip64SplitFile = getOptionValue(zipWriter, options, OPTION_SUPPORT_ZIP64_SPLIT_FILE, true);
		const zip64DiskNumberStart = (supportZip64SplitFile && zip64Enabled) || diskNumber + Math.ceil(zipWriter.pendingEntriesSize / maxSize) > MAX_16_BITS;
		if (zip64Offset || zip64UncompressedSize || zip64CompressedSize || zip64DiskNumberStart) {
			if (zip64 === false || !keepOrder) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		zip64 = zip64 || false;
		const encrypted = getOptionValue(zipWriter, options, PROPERTY_NAME_ENCRYPTED);
		options = Object.assign({}, options, {
			rawFilename,
			rawComment,
			version,
			versionMadeBy,
			lastModDate,
			lastAccessDate,
			creationDate,
			rawExtraField,
			zip64,
			zip64UncompressedSize,
			zip64CompressedSize,
			zip64Offset,
			zip64DiskNumberStart,
			password,
			rawPassword,
			level,
			useWebWorkers,
			encryptionStrength,
			extendedTimestamp,
			zipCrypto,
			bufferedWrite,
			keepOrder,
			useUnicodeFileNames,
			dataDescriptor,
			dataDescriptorSignature,
			signal,
			msDosCompatible,
			internalFileAttribute: internalFileAttributes,
			internalFileAttributes,
			externalFileAttribute: externalFileAttributes,
			externalFileAttributes,
			useCompressionStream,
			passThrough,
			encrypted: Boolean((password && getLength(password)) || (rawPassword && getLength(rawPassword))) || (passThrough && encrypted),
			signature: options[PROPERTY_NAME_SIGNATURE],
			compressionMethod,
			uncompressedSize,
			offset: zipWriter.offset - diskOffset,
			diskNumberStart: diskNumber,
			uid,
			gid,
			setuid,
			setgid,
			sticky,
			unixMode,
			msdosAttributesRaw,
			msdosAttributes,
			unixExternalUpper
		});
		const headerInfo = getHeaderInfo(options);
		const dataDescriptorInfo = getDataDescriptorInfo(options);
		const metadataSize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray);
		maximumEntrySize = metadataSize + maximumCompressedSize;
		if (zipWriter.options[OPTION_USDZ]) {
			maximumEntrySize += maximumEntrySize + 64;
		}
		zipWriter.pendingEntriesSize += maximumEntrySize;
		let fileEntry;
		try {
			fileEntry = await getFileEntry(zipWriter, name, reader, { headerInfo, dataDescriptorInfo, metadataSize }, options);
		} finally {
			zipWriter.pendingEntriesSize -= maximumEntrySize;
		}
		Object.assign(fileEntry, { name, comment, extraField });
		return new Entry(fileEntry);
	}

	async function getFileEntry(zipWriter, name, reader, entryInfo, options) {
		const {
			files,
			writer
		} = zipWriter;
		const {
			keepOrder,
			dataDescriptor,
			signal
		} = options;
		const {
			headerInfo
		} = entryInfo;
		const usdz = zipWriter.options[OPTION_USDZ];
		const previousFileEntry = Array.from(files.values()).pop();
		let fileEntry = {};
		let bufferedWrite;
		let releaseLockWriter;
		let releaseLockCurrentFileEntry;
		let writingBufferedEntryData;
		let writingEntryData;
		let fileWriter;
		let blobPromise;
		files.set(name, fileEntry);
		try {
			let lockPreviousFileEntry;
			if (keepOrder) {
				lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
				requestLockCurrentFileEntry();
			}
			if ((options.bufferedWrite || zipWriter.writerLocked || (zipWriter.bufferedWrites && keepOrder) || !dataDescriptor) && !usdz) {
				fileWriter = new TransformStream();
				fileWriter.size = 0;
				bufferedWrite = true;
				zipWriter.bufferedWrites++;
				await initStream(writer);
			} else {
				fileWriter = writer;
				await requestLockWriter();
			}
			await initStream(fileWriter);
			const { writable, diskOffset } = writer;
			if (zipWriter.addSplitZipSignature) {
				delete zipWriter.addSplitZipSignature;
				const signatureArray = new Uint8Array(4);
				const signatureArrayView = getDataView(signatureArray);
				setUint32(signatureArrayView, 0, SPLIT_ZIP_FILE_SIGNATURE);
				await writeData(writer, signatureArray);
				zipWriter.offset += 4;
			}
			if (usdz) {
				appendExtraFieldUSDZ(entryInfo, zipWriter.offset - diskOffset);
			}
			const {
				localHeaderView,
				localHeaderArray
			} = headerInfo;
			if (!bufferedWrite) {
				await lockPreviousFileEntry;
				await skipDiskIfNeeded(writable);
			}
			const { diskNumber } = writer;
			writingEntryData = true;
			fileEntry.diskNumberStart = diskNumber;
			if (bufferedWrite) {
				blobPromise = new Response(fileWriter.readable).blob();
			} else {
				await writeData(fileWriter, localHeaderArray);
			}
			fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, zipWriter.config, options);
			const { zip64 } = fileEntry;
			writingEntryData = false;
			files.set(name, fileEntry);
			fileEntry.filename = name;
			if (bufferedWrite) {
				const [blob] = await Promise.all([blobPromise, fileWriter.writable.getWriter().close(), lockPreviousFileEntry]);
				await requestLockWriter();
				writingBufferedEntryData = true;
				fileEntry.diskNumberStart = writer.diskNumber;
				fileEntry.offset = zipWriter.offset - writer.diskOffset;
				if (zip64) {
					updateZip64ExtraField(fileEntry);
				}
				updateLocalHeader(fileEntry, localHeaderView, options);
				await skipDiskIfNeeded(writable);
				await writeData(writer, localHeaderArray);
				await blob.stream().pipeTo(writable, { preventClose: true, preventAbort: true, signal });
				writer.size += fileWriter.size;
				writingBufferedEntryData = false;
			} else {
				fileEntry.offset = zipWriter.offset - diskOffset;
				if (zip64) {
					updateZip64ExtraField(fileEntry);
				}
			}
			if (fileEntry.offset > MAX_32_BITS && !zip64) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			}
			zipWriter.offset += fileEntry.size;
			return fileEntry;
		} catch (error) {
			if ((bufferedWrite && writingBufferedEntryData) || (!bufferedWrite && writingEntryData)) {
				zipWriter.hasCorruptedEntries = true;
				if (error) {
					try {
						error.corruptedEntry = true;
					} catch {
						// ignored
					}
				}
				if (bufferedWrite) {
					zipWriter.offset += fileWriter.size;
				} else {
					zipWriter.offset = fileWriter.size;
				}
			}
			files.delete(name);
			throw error;
		} finally {
			if (bufferedWrite) {
				zipWriter.bufferedWrites--;
			}
			if (releaseLockCurrentFileEntry) {
				releaseLockCurrentFileEntry();
			}
			if (releaseLockWriter) {
				releaseLockWriter();
			}
		}

		function requestLockCurrentFileEntry() {
			fileEntry.lock = new Promise(resolve => releaseLockCurrentFileEntry = resolve);
		}

		async function requestLockWriter() {
			zipWriter.writerLocked = true;
			const { lockWriter } = zipWriter;
			zipWriter.lockWriter = new Promise(resolve => releaseLockWriter = () => {
				zipWriter.writerLocked = false;
				resolve();
			});
			await lockWriter;
		}

		async function skipDiskIfNeeded(writable) {
			if (getLength(headerInfo.localHeaderArray) > writer.availableSize) {
				writer.availableSize = 0;
				await writeData(writable, new Uint8Array());
			}
		}
	}

	async function createFileEntry(reader, writer, { diskNumberStart, lock }, entryInfo, config, options) {
		const {
			headerInfo,
			dataDescriptorInfo,
			metadataSize
		} = entryInfo;
		const {
			headerArray,
			headerView,
			lastModDate,
			rawLastModDate,
			encrypted,
			compressed,
			version,
			compressionMethod,
			rawExtraFieldZip64,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			extraFieldExtendedTimestampFlag,
			rawExtraFieldNTFS,
			rawExtraFieldUnix,
			rawExtraFieldAES,
		} = headerInfo;
		const { dataDescriptorArray } = dataDescriptorInfo;
		const {
			rawFilename,
			lastAccessDate,
			creationDate,
			password,
			rawPassword,
			level,
			zip64,
			zip64UncompressedSize,
			zip64CompressedSize,
			zip64Offset,
			zip64DiskNumberStart,
			zipCrypto,
			dataDescriptor,
			directory,
			executable,
			versionMadeBy,
			rawComment,
			rawExtraField,
			useWebWorkers,
			onstart,
			onprogress,
			onend,
			signal,
			encryptionStrength,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttributes,
			externalFileAttributes,
			uid,
			gid,
			unixMode,
			setuid,
			setgid,
			sticky,
			unixExternalUpper,
			msdosAttributesRaw,
			msdosAttributes,
			useCompressionStream,
			passThrough
		} = options;
		const fileEntry = {
			lock,
			versionMadeBy,
			zip64,
			directory: Boolean(directory),
			executable: Boolean(executable),
			filenameUTF8: true,
			rawFilename,
			commentUTF8: true,
			rawComment,
			rawExtraFieldZip64,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldUnix,
			rawExtraFieldAES,
			rawExtraField,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttributes,
			externalFileAttributes,
			diskNumberStart,
			uid,
			gid,
			unixMode,
			setuid,
			setgid,
			sticky,
			unixExternalUpper,
			msdosAttributesRaw,
			msdosAttributes
		};
		let {
			signature,
			uncompressedSize
		} = options;
		let compressedSize = 0;
		if (!passThrough) {
			uncompressedSize = 0;
		}
		const { writable } = writer;
		if (reader) {
			reader.chunkSize = getChunkSize(config);
			const readable = reader.readable;
			const size = reader.size;
			const workerOptions = {
				options: {
					codecType: CODEC_DEFLATE,
					level,
					rawPassword,
					password,
					encryptionStrength,
					zipCrypto: encrypted && zipCrypto,
					passwordVerification: encrypted && zipCrypto && (rawLastModDate >> 8) & MAX_8_BITS,
					signed: !passThrough,
					compressed: compressed && !passThrough,
					encrypted: encrypted && !passThrough,
					useWebWorkers,
					useCompressionStream,
					transferStreams: false
				},
				config,
				streamOptions: { signal, size, onstart, onprogress, onend }
			};
			try {
				const result = await runWorker({ readable, writable }, workerOptions);
				compressedSize = result.outputSize;
				writer.size += compressedSize;
				if (!passThrough) {
					uncompressedSize = result.inputSize;
					signature = result.signature;
				}
			} catch (error) {
				if (error.outputSize !== UNDEFINED_VALUE) {
					writer.size += error.outputSize;
				}
				throw error;
			}

		}
		setEntryInfo({
			signature,
			compressedSize,
			uncompressedSize,
			headerInfo,
			dataDescriptorInfo
		}, options);
		if (dataDescriptor) {
			await writeData(writer, dataDescriptorArray);
		}
		Object.assign(fileEntry, {
			uncompressedSize,
			compressedSize,
			lastModDate,
			rawLastModDate,
			creationDate,
			lastAccessDate,
			encrypted,
			zipCrypto,
			size: metadataSize + compressedSize,
			compressionMethod,
			version,
			headerArray,
			headerView,
			signature,
			extraFieldExtendedTimestampFlag,
			zip64UncompressedSize,
			zip64CompressedSize,
			zip64Offset,
			zip64DiskNumberStart
		});
		return fileEntry;
	}

	function getHeaderInfo(options) {
		const {
			rawFilename,
			lastModDate,
			lastAccessDate,
			creationDate,
			level,
			zip64,
			zipCrypto,
			useUnicodeFileNames,
			dataDescriptor,
			directory,
			rawExtraField,
			encryptionStrength,
			extendedTimestamp,
			passThrough,
			encrypted,
			zip64UncompressedSize,
			zip64CompressedSize,
			zip64Offset,
			zip64DiskNumberStart,
			uncompressedSize,
			offset,
			diskNumberStart
		} = options;
		let { version, compressionMethod } = options;
		const compressed = !directory && (level > 0 || (level === UNDEFINED_VALUE && compressionMethod !== 0));
		let rawExtraFieldZip64;
		const uncompressedFile = passThrough || !compressed;
		const zip64ExtraFieldComplete = zip64 && (options.bufferedWrite || ((!zip64UncompressedSize && !zip64CompressedSize) || uncompressedFile));
		if (zip64) {
			let rawExtraFieldZip64Length = 4;
			if (zip64UncompressedSize) {
				rawExtraFieldZip64Length += 8;
			}
			if (zip64CompressedSize) {
				rawExtraFieldZip64Length += 8;
			}
			if (zip64Offset) {
				rawExtraFieldZip64Length += 8;
			}
			if (zip64DiskNumberStart) {
				rawExtraFieldZip64Length += 4;
			}
			rawExtraFieldZip64 = new Uint8Array(rawExtraFieldZip64Length);
			const rawExtraFieldZip64View = getDataView(rawExtraFieldZip64);
			setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
			setUint16(rawExtraFieldZip64View, 2, getLength(rawExtraFieldZip64) - 4);
			if (zip64ExtraFieldComplete) {
				const rawExtraFieldZip64View = getDataView(rawExtraFieldZip64);
				let rawExtraFieldZip64Offset = 4;
				if (zip64UncompressedSize) {
					setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(uncompressedSize));
					rawExtraFieldZip64Offset += 8;
				}
				if (zip64CompressedSize && uncompressedFile) {
					setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(uncompressedSize));
					rawExtraFieldZip64Offset += 8;
				}
				if (zip64Offset) {
					setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(offset));
					rawExtraFieldZip64Offset += 8;
				}
				if (zip64DiskNumberStart) {
					setUint32(rawExtraFieldZip64View, rawExtraFieldZip64Offset, diskNumberStart);
					rawExtraFieldZip64Offset += 4;
				}
			}
		} else {
			rawExtraFieldZip64 = new Uint8Array();
		}
		let rawExtraFieldAES;
		if (encrypted && !zipCrypto) {
			rawExtraFieldAES = new Uint8Array(getLength(EXTRAFIELD_DATA_AES) + 2);
			const extraFieldAESView = getDataView(rawExtraFieldAES);
			setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
			arraySet(rawExtraFieldAES, EXTRAFIELD_DATA_AES, 2);
			setUint8(extraFieldAESView, 8, encryptionStrength);
		} else {
			rawExtraFieldAES = new Uint8Array();
		}
		let rawExtraFieldNTFS;
		let rawExtraFieldExtendedTimestamp;
		let extraFieldExtendedTimestampFlag;
		if (extendedTimestamp) {
			rawExtraFieldExtendedTimestamp = new Uint8Array(9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0));
			const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
			setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
			setUint16(extraFieldExtendedTimestampView, 2, getLength(rawExtraFieldExtendedTimestamp) - 4);
			extraFieldExtendedTimestampFlag = 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0);
			setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
			let offset = 5;
			setUint32(extraFieldExtendedTimestampView, offset, Math.floor(lastModDate.getTime() / 1000));
			offset += 4;
			if (lastAccessDate) {
				setUint32(extraFieldExtendedTimestampView, offset, Math.floor(lastAccessDate.getTime() / 1000));
				offset += 4;
			}
			if (creationDate) {
				setUint32(extraFieldExtendedTimestampView, offset, Math.floor(creationDate.getTime() / 1000));
			}
			try {
				rawExtraFieldNTFS = new Uint8Array(36);
				const extraFieldNTFSView = getDataView(rawExtraFieldNTFS);
				const lastModTimeNTFS = getTimeNTFS(lastModDate);
				setUint16(extraFieldNTFSView, 0, EXTRAFIELD_TYPE_NTFS);
				setUint16(extraFieldNTFSView, 2, 32);
				setUint16(extraFieldNTFSView, 8, EXTRAFIELD_TYPE_NTFS_TAG1);
				setUint16(extraFieldNTFSView, 10, 24);
				setBigUint64(extraFieldNTFSView, 12, lastModTimeNTFS);
				setBigUint64(extraFieldNTFSView, 20, getTimeNTFS(lastAccessDate) || lastModTimeNTFS);
				setBigUint64(extraFieldNTFSView, 28, getTimeNTFS(creationDate) || lastModTimeNTFS);
			} catch {
				rawExtraFieldNTFS = new Uint8Array();
			}
		} else {
			rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array();
		}
		let rawExtraFieldUnix;
		try {
			const { uid, gid, unixMode, setuid, setgid, sticky, unixExtraFieldType } = options;
			if (unixExtraFieldType && (uid !== UNDEFINED_VALUE || gid !== UNDEFINED_VALUE || unixMode !== UNDEFINED_VALUE)) {
				const uidBytes = packUnixId(uid);
				const gidBytes = packUnixId(gid);
				let modeArray = new Uint8Array();
				if (unixExtraFieldType == UNIX_EXTRA_FIELD_TYPE && unixMode !== UNDEFINED_VALUE) {
					let modeToWrite = unixMode & MAX_16_BITS;
					if (setuid) {
						modeToWrite |= FILE_ATTR_UNIX_SETUID_MASK;
					}
					if (setgid) {
						modeToWrite |= FILE_ATTR_UNIX_SETGID_MASK;
					}
					if (sticky) {
						modeToWrite |= FILE_ATTR_UNIX_STICKY_MASK;
					}
					modeArray = new Uint8Array(2);
					const modeDataView = new DataView(modeArray.buffer);
					modeDataView.setUint16(0, modeToWrite, true);
				}
				const payloadLength = 3 + uidBytes.length + gidBytes.length + modeArray.length;
				rawExtraFieldUnix = new Uint8Array(4 + payloadLength);
				const rawExtraFieldUnixView = getDataView(rawExtraFieldUnix);
				setUint16(rawExtraFieldUnixView, 0, unixExtraFieldType == INFOZIP_EXTRA_FIELD_TYPE ? EXTRAFIELD_TYPE_INFOZIP : EXTRAFIELD_TYPE_UNIX);
				setUint16(rawExtraFieldUnixView, 2, payloadLength);
				setUint8(rawExtraFieldUnixView, 4, 1);
				setUint8(rawExtraFieldUnixView, 5, uidBytes.length);
				let offset = 6;
				arraySet(rawExtraFieldUnix, uidBytes, offset);
				offset += uidBytes.length;
				setUint8(rawExtraFieldUnixView, offset, gidBytes.length);
				offset++;
				arraySet(rawExtraFieldUnix, gidBytes, offset);
				offset += gidBytes.length;
				arraySet(rawExtraFieldUnix, modeArray, offset);
			} else {
				rawExtraFieldUnix = new Uint8Array();
			}
		} catch {
			rawExtraFieldUnix = new Uint8Array();
		}
		if (compressionMethod === UNDEFINED_VALUE) {
			compressionMethod = compressed ? COMPRESSION_METHOD_DEFLATE : COMPRESSION_METHOD_STORE;
		}
		if (zip64) {
			version = version > VERSION_ZIP64 ? version : VERSION_ZIP64;
		}
		if (encrypted && !zipCrypto) {
			version = version > VERSION_AES ? version : VERSION_AES;
			rawExtraFieldAES[9] = compressionMethod;
			compressionMethod = COMPRESSION_METHOD_AES;
		}
		const localExtraFieldZip64Length = zip64ExtraFieldComplete ? getLength(rawExtraFieldZip64) : 0;
		const extraFieldLength = localExtraFieldZip64Length + getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
		const {
			headerArray,
			headerView,
			rawLastModDate
		} = getHeaderArrayData({
			version,
			bitFlag: getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod),
			compressionMethod,
			uncompressedSize,
			lastModDate: lastModDate < MIN_DATE ? MIN_DATE : lastModDate > MAX_DATE ? MAX_DATE : lastModDate,
			rawFilename,
			zip64CompressedSize,
			zip64UncompressedSize,
			extraFieldLength
		});
		let localHeaderOffset = HEADER_SIZE;
		const localHeaderArray = new Uint8Array(localHeaderOffset + getLength(rawFilename) + extraFieldLength);
		const localHeaderView = getDataView(localHeaderArray);
		setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
		arraySet(localHeaderArray, headerArray, 4);
		arraySet(localHeaderArray, rawFilename, localHeaderOffset);
		localHeaderOffset += getLength(rawFilename);
		if (zip64ExtraFieldComplete) {
			arraySet(localHeaderArray, rawExtraFieldZip64, localHeaderOffset);
		}
		localHeaderOffset += localExtraFieldZip64Length;
		arraySet(localHeaderArray, rawExtraFieldAES, localHeaderOffset);
		localHeaderOffset += getLength(rawExtraFieldAES);
		arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, localHeaderOffset);
		localHeaderOffset += getLength(rawExtraFieldExtendedTimestamp);
		arraySet(localHeaderArray, rawExtraFieldNTFS, localHeaderOffset);
		localHeaderOffset += getLength(rawExtraFieldNTFS);
		arraySet(localHeaderArray, rawExtraFieldUnix, localHeaderOffset);
		localHeaderOffset += getLength(rawExtraFieldUnix);
		arraySet(localHeaderArray, rawExtraField, localHeaderOffset);
		if (dataDescriptor) {
			setUint32(localHeaderView, HEADER_OFFSET_COMPRESSED_SIZE + 4, 0);
			setUint32(localHeaderView, HEADER_OFFSET_UNCOMPRESSED_SIZE + 4, 0);
		}
		return {
			localHeaderArray,
			localHeaderView,
			headerArray,
			headerView,
			lastModDate,
			rawLastModDate,
			encrypted,
			compressed,
			version,
			compressionMethod,
			extraFieldExtendedTimestampFlag,
			rawExtraFieldZip64,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldUnix,
			rawExtraFieldAES,
			extraFieldLength
		};
	}

	function appendExtraFieldUSDZ(entryInfo, zipWriterOffset) {
		const { headerInfo } = entryInfo;
		let { localHeaderArray, extraFieldLength } = headerInfo;
		let localHeaderArrayView = getDataView(localHeaderArray);
		let extraBytesLength = 64 - ((zipWriterOffset + getLength(localHeaderArray)) % 64);
		if (extraBytesLength < 4) {
			extraBytesLength += 64;
		}
		const rawExtraFieldUSDZ = new Uint8Array(extraBytesLength);
		const extraFieldUSDZView = getDataView(rawExtraFieldUSDZ);
		setUint16(extraFieldUSDZView, 0, EXTRAFIELD_TYPE_USDZ);
		setUint16(extraFieldUSDZView, 2, extraBytesLength - 2);
		const previousLocalHeaderArray = localHeaderArray;
		headerInfo.localHeaderArray = localHeaderArray = new Uint8Array(getLength(previousLocalHeaderArray) + extraBytesLength);
		arraySet(localHeaderArray, previousLocalHeaderArray);
		arraySet(localHeaderArray, rawExtraFieldUSDZ, getLength(previousLocalHeaderArray));
		localHeaderArrayView = getDataView(localHeaderArray);
		setUint16(localHeaderArrayView, 28, extraFieldLength + extraBytesLength);
		entryInfo.metadataSize += extraBytesLength;
	}

	function packUnixId(id) {
		if (id === UNDEFINED_VALUE) {
			return new Uint8Array();
		} else {
			const dataArray = new Uint8Array(4);
			const dataView = getDataView(dataArray);
			dataView.setUint32(0, id, true);
			let length = 4;
			while (length > 1 && dataArray[length - 1] === 0) {
				length--;
			}
			return dataArray.subarray(0, length);
		}
	}

	function normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes) {
		if (msdosAttributesRaw !== UNDEFINED_VALUE) {
			msdosAttributesRaw = msdosAttributesRaw & MAX_8_BITS;
		} else if (msdosAttributes !== UNDEFINED_VALUE) {
			const { readOnly, hidden, system, directory: msdDir, archive } = msdosAttributes;
			let raw = 0;
			if (readOnly) raw |= FILE_ATTR_MSDOS_READONLY_MASK;
			if (hidden) raw |= FILE_ATTR_MSDOS_HIDDEN_MASK;
			if (system) raw |= FILE_ATTR_MSDOS_SYSTEM_MASK;
			if (msdDir) raw |= FILE_ATTR_MSDOS_DIR_MASK;
			if (archive) raw |= FILE_ATTR_MSDOS_ARCHIVE_MASK;
			msdosAttributesRaw = raw & MAX_8_BITS;
		}
		if (msdosAttributes === UNDEFINED_VALUE) {
			msdosAttributes = {
				readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
				hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
				system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
				directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
				archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
			};
		}
		return { msdosAttributesRaw, msdosAttributes };
	}

	function getDataDescriptorInfo({
		zip64,
		dataDescriptor,
		dataDescriptorSignature
	}) {
		let dataDescriptorArray = new Uint8Array();
		let dataDescriptorView, dataDescriptorOffset = 0;
		let dataDescriptorLength = zip64 ? DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH : DATA_DESCRIPTOR_RECORD_LENGTH;
		if (dataDescriptorSignature) {
			dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
		}
		if (dataDescriptor) {
			dataDescriptorArray = new Uint8Array(dataDescriptorLength);
			dataDescriptorView = getDataView(dataDescriptorArray);
			if (dataDescriptorSignature) {
				dataDescriptorOffset = DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
				setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
			}
		}
		return {
			dataDescriptorArray,
			dataDescriptorView,
			dataDescriptorOffset
		};
	}

	function setEntryInfo({
		signature,
		compressedSize,
		uncompressedSize,
		headerInfo,
		dataDescriptorInfo
	}, {
		zip64,
		zipCrypto,
		dataDescriptor
	}) {
		const {
			headerView,
			encrypted
		} = headerInfo;
		const {
			dataDescriptorView,
			dataDescriptorOffset
		} = dataDescriptorInfo;
		if ((!encrypted || zipCrypto) && signature !== UNDEFINED_VALUE) {
			setUint32(headerView, HEADER_OFFSET_SIGNATURE, signature);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset, signature);
			}
		}
		if (zip64) {
			if (dataDescriptor) {
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
			}
		} else {
			setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, compressedSize);
			setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, uncompressedSize);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
				setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
			}
		}
	}

	function updateLocalHeader({
		rawFilename,
		encrypted,
		zip64,
		localExtraFieldZip64Length,
		signature,
		compressedSize,
		uncompressedSize,
		offset,
		diskNumberStart,
		zip64UncompressedSize,
		zip64CompressedSize,
		zip64Offset,
		zip64DiskNumberStart
	}, localHeaderView, { dataDescriptor }) {
		if (!dataDescriptor) {
			if (!encrypted) {
				setUint32(localHeaderView, HEADER_OFFSET_SIGNATURE + 4, signature);
			}
			if (!zip64) {
				setUint32(localHeaderView, HEADER_OFFSET_COMPRESSED_SIZE + 4, compressedSize);
				setUint32(localHeaderView, HEADER_OFFSET_UNCOMPRESSED_SIZE + 4, uncompressedSize);
			}
		}
		if (zip64) {
			if (localExtraFieldZip64Length) {
				let localHeaderOffset = HEADER_SIZE + getLength(rawFilename) + 4;
				if (zip64UncompressedSize) {
					setBigUint64(localHeaderView, localHeaderOffset, BigInt(uncompressedSize));
					localHeaderOffset += 8;
				}
				if (zip64CompressedSize) {
					setBigUint64(localHeaderView, localHeaderOffset, BigInt(compressedSize));
					localHeaderOffset += 8;
				}
				if (zip64Offset) {
					setBigUint64(localHeaderView, localHeaderOffset, BigInt(offset));
					localHeaderOffset += 8;
				}
				if (zip64DiskNumberStart) {
					setUint32(localHeaderView, localHeaderOffset, diskNumberStart);
				}
			}
		}
	}

	function updateZip64ExtraField({
		compressedSize,
		uncompressedSize,
		offset,
		diskNumberStart,
		zip64UncompressedSize,
		zip64CompressedSize,
		zip64Offset,
		zip64DiskNumberStart,
		rawExtraFieldZip64
	}) {
		const rawExtraFieldZip64View = getDataView(rawExtraFieldZip64);
		let rawExtraFieldZip64Offset = 4;
		if (zip64UncompressedSize) {
			setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(uncompressedSize));
			rawExtraFieldZip64Offset += 8;
		}
		if (zip64CompressedSize) {
			setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(compressedSize));
			rawExtraFieldZip64Offset += 8;
		}
		if (zip64Offset) {
			setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(offset));
			rawExtraFieldZip64Offset += 8;
		}
		if (zip64DiskNumberStart) {
			setUint32(rawExtraFieldZip64View, rawExtraFieldZip64Offset, diskNumberStart);
		}
	}

	async function closeFile(zipWriter, comment, options) {
		const { files, writer } = zipWriter;
		const { diskOffset } = writer;
		let { diskNumber } = writer;
		let offset = 0;
		let directoryDataLength = 0;
		let directoryOffset = zipWriter.offset - diskOffset;
		let filesLength = files.size;
		for (const [, fileEntry] of files) {
			const {
				rawFilename,
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawComment,
				rawExtraFieldNTFS,
				rawExtraFieldUnix,
				rawExtraField,
				extendedTimestamp,
				extraFieldExtendedTimestampFlag,
				lastModDate
			} = fileEntry;
			let rawExtraFieldTimestamp;
			if (extendedTimestamp) {
				rawExtraFieldTimestamp = new Uint8Array(9);
				const extraFieldExtendedTimestampView = getDataView(rawExtraFieldTimestamp);
				setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				setUint16(extraFieldExtendedTimestampView, 2, 5);
				setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
				setUint32(extraFieldExtendedTimestampView, 5, Math.floor(lastModDate.getTime() / 1000));
			} else {
				rawExtraFieldTimestamp = new Uint8Array();
			}
			fileEntry.rawExtraFieldExtendedTimestamp = rawExtraFieldTimestamp;
			directoryDataLength += 46 +
				getLength(
					rawFilename,
					rawComment,
					rawExtraFieldZip64,
					rawExtraFieldAES,
					rawExtraFieldNTFS,
					rawExtraFieldUnix,
					rawExtraFieldTimestamp,
					rawExtraField);
		}
		const directoryArray = new Uint8Array(directoryDataLength);
		const directoryView = getDataView(directoryArray);
		await initStream(writer);
		let directoryDiskOffset = 0;
		for (const [indexFileEntry, fileEntry] of Array.from(files.values()).entries()) {
			const {
				offset: fileEntryOffset,
				rawFilename,
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawExtraFieldExtendedTimestamp,
				rawExtraFieldNTFS,
				rawExtraFieldUnix,
				rawExtraField,
				rawComment,
				versionMadeBy,
				headerArray,
				headerView,
				zip64,
				zip64UncompressedSize,
				zip64CompressedSize,
				zip64DiskNumberStart,
				zip64Offset,
				internalFileAttributes,
				externalFileAttributes,
				diskNumberStart,
				uncompressedSize,
				compressedSize
			} = fileEntry;
			const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
			setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
			setUint16(directoryView, offset + 4, versionMadeBy);
			if (!zip64UncompressedSize) {
				setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, uncompressedSize);
			}
			if (!zip64CompressedSize) {
				setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, compressedSize);
			}
			arraySet(directoryArray, headerArray, offset + 6);
			let directoryOffset = offset + HEADER_SIZE;
			setUint16(directoryView, directoryOffset, extraFieldLength);
			directoryOffset += 2;
			setUint16(directoryView, directoryOffset, getLength(rawComment));
			directoryOffset += 2;
			setUint16(directoryView, directoryOffset, zip64 && zip64DiskNumberStart ? MAX_16_BITS : diskNumberStart);
			directoryOffset += 2;
			setUint16(directoryView, directoryOffset, internalFileAttributes);
			directoryOffset += 2;
			if (externalFileAttributes) {
				setUint32(directoryView, directoryOffset, externalFileAttributes);
			}
			directoryOffset += 4;
			setUint32(directoryView, directoryOffset, zip64 && zip64Offset ? MAX_32_BITS : fileEntryOffset);
			directoryOffset += 4;
			arraySet(directoryArray, rawFilename, directoryOffset);
			directoryOffset += getLength(rawFilename);
			arraySet(directoryArray, rawExtraFieldZip64, directoryOffset);
			directoryOffset += getLength(rawExtraFieldZip64);
			arraySet(directoryArray, rawExtraFieldAES, directoryOffset);
			directoryOffset += getLength(rawExtraFieldAES);
			arraySet(directoryArray, rawExtraFieldExtendedTimestamp, directoryOffset);
			directoryOffset += getLength(rawExtraFieldExtendedTimestamp);
			arraySet(directoryArray, rawExtraFieldNTFS, directoryOffset);
			directoryOffset += getLength(rawExtraFieldNTFS);
			arraySet(directoryArray, rawExtraFieldUnix, directoryOffset);
			directoryOffset += getLength(rawExtraFieldUnix);
			arraySet(directoryArray, rawExtraField, directoryOffset);
			directoryOffset += getLength(rawExtraField);
			arraySet(directoryArray, rawComment, directoryOffset);
			directoryOffset += getLength(rawComment);
			if (offset - directoryDiskOffset > writer.availableSize) {
				writer.availableSize = 0;
				await writeData(writer, directoryArray.slice(directoryDiskOffset, offset));
				directoryDiskOffset = offset;
			}
			offset = directoryOffset;
			if (options.onprogress) {
				try {
					await options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
				} catch {
					// ignored
				}
			}
		}
		await writeData(writer, directoryDiskOffset ? directoryArray.slice(directoryDiskOffset) : directoryArray);
		let lastDiskNumber = writer.diskNumber;
		const { availableSize } = writer;
		if (availableSize < END_OF_CENTRAL_DIR_LENGTH) {
			lastDiskNumber++;
		}
		let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
		if (directoryOffset > MAX_32_BITS || directoryDataLength > MAX_32_BITS || filesLength > MAX_16_BITS || lastDiskNumber > MAX_16_BITS) {
			if (zip64 === false) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		const endOfdirectoryArray = new Uint8Array(zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH);
		const endOfdirectoryView = getDataView(endOfdirectoryArray);
		offset = 0;
		if (zip64) {
			setUint32(endOfdirectoryView, 0, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			setBigUint64(endOfdirectoryView, 4, BigInt(44));
			setUint16(endOfdirectoryView, 12, 45);
			setUint16(endOfdirectoryView, 14, 45);
			setUint32(endOfdirectoryView, 16, lastDiskNumber);
			setUint32(endOfdirectoryView, 20, diskNumber);
			setBigUint64(endOfdirectoryView, 24, BigInt(filesLength));
			setBigUint64(endOfdirectoryView, 32, BigInt(filesLength));
			setBigUint64(endOfdirectoryView, 40, BigInt(directoryDataLength));
			setBigUint64(endOfdirectoryView, 48, BigInt(directoryOffset));
			setUint32(endOfdirectoryView, 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			setBigUint64(endOfdirectoryView, 64, BigInt(directoryOffset) + BigInt(directoryDataLength));
			setUint32(endOfdirectoryView, 72, lastDiskNumber + 1);
			const supportZip64SplitFile = getOptionValue(zipWriter, options, OPTION_SUPPORT_ZIP64_SPLIT_FILE, true);
			if (supportZip64SplitFile) {
				lastDiskNumber = MAX_16_BITS;
				diskNumber = MAX_16_BITS;
			}
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			directoryDataLength = MAX_32_BITS;
			offset += ZIP64_END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH;
		}
		setUint32(endOfdirectoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
		setUint16(endOfdirectoryView, offset + 4, lastDiskNumber);
		setUint16(endOfdirectoryView, offset + 6, diskNumber);
		setUint16(endOfdirectoryView, offset + 8, filesLength);
		setUint16(endOfdirectoryView, offset + 10, filesLength);
		setUint32(endOfdirectoryView, offset + 12, directoryDataLength);
		setUint32(endOfdirectoryView, offset + 16, directoryOffset);
		const commentLength = getLength(comment);
		if (commentLength) {
			if (commentLength <= MAX_16_BITS) {
				setUint16(endOfdirectoryView, offset + 20, commentLength);
			} else {
				throw new Error(ERR_INVALID_COMMENT);
			}
		}
		await writeData(writer, endOfdirectoryArray);
		if (commentLength) {
			await writeData(writer, comment);
		}
	}

	async function writeData(writer, array) {
		const { writable } = writer;
		const streamWriter = writable.getWriter();
		try {
			await streamWriter.ready;
			writer.size += getLength(array);
			await streamWriter.write(array);
		} finally {
			streamWriter.releaseLock();
		}
	}

	function getTimeNTFS(date) {
		if (date) {
			return ((BigInt(date.getTime()) + BigInt(11644473600000)) * BigInt(10000));
		}
	}

	function getOptionValue(zipWriter, options, name, defaultValue) {
		const result = options[name] === UNDEFINED_VALUE ? zipWriter.options[name] : options[name];
		return result === UNDEFINED_VALUE ? defaultValue : result;
	}

	function getMaximumCompressedSize(uncompressedSize) {
		return uncompressedSize + (5 * (Math.floor(uncompressedSize / 16383) + 1));
	}

	function setUint8(view, offset, value) {
		view.setUint8(offset, value);
	}

	function setUint16(view, offset, value) {
		view.setUint16(offset, value, true);
	}

	function setUint32(view, offset, value) {
		view.setUint32(offset, value, true);
	}

	function setBigUint64(view, offset, value) {
		view.setBigUint64(offset, value, true);
	}

	function arraySet(array, typedArray, offset) {
		array.set(typedArray, offset);
	}

	function getDataView(array) {
		return new DataView(array.buffer);
	}

	function getLength(...arrayLikes) {
		let result = 0;
		arrayLikes.forEach(arrayLike => arrayLike && (result += arrayLike.length));
		return result;
	}

	function getHeaderArrayData({
		version,
		bitFlag,
		compressionMethod,
		uncompressedSize,
		compressedSize,
		lastModDate,
		rawFilename,
		zip64CompressedSize,
		zip64UncompressedSize,
		extraFieldLength
	}) {
		const headerArray = new Uint8Array(HEADER_SIZE - 4);
		const headerView = getDataView(headerArray);
		setUint16(headerView, 0, version);
		setUint16(headerView, 2, bitFlag);
		setUint16(headerView, 4, compressionMethod);
		const dateArray = new Uint32Array(1);
		const dateView = getDataView(dateArray);
		setUint16(dateView, 0, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
		setUint16(dateView, 2, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
		const rawLastModDate = dateArray[0];
		setUint32(headerView, 6, rawLastModDate);
		if (zip64CompressedSize || compressedSize !== UNDEFINED_VALUE) {
			setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, zip64CompressedSize ? MAX_32_BITS : compressedSize);
		}
		if (zip64UncompressedSize || uncompressedSize !== UNDEFINED_VALUE) {
			setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, zip64UncompressedSize ? MAX_32_BITS : uncompressedSize);
		}
		setUint16(headerView, 22, getLength(rawFilename));
		setUint16(headerView, 24, extraFieldLength);
		return {
			headerArray,
			headerView,
			rawLastModDate
		};
	}

	function getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod) {
		let bitFlag = 0;
		if (useUnicodeFileNames) {
			bitFlag = bitFlag | BITFLAG_LANG_ENCODING_FLAG;
		}
		if (dataDescriptor) {
			bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
		}
		if (compressionMethod == COMPRESSION_METHOD_DEFLATE || compressionMethod == COMPRESSION_METHOD_DEFLATE_64) {
			if (level >= 0 && level <= 3) {
				bitFlag = bitFlag | BITFLAG_LEVEL_SUPER_FAST_MASK;
			}
			if (level > 3 && level <= 5) {
				bitFlag = bitFlag | BITFLAG_LEVEL_FAST_MASK;
			}
			if (level == 9) {
				bitFlag = bitFlag | BITFLAG_LEVEL_MAX_MASK;
			}
		}
		if (encrypted) {
			bitFlag = bitFlag | BITFLAG_ENCRYPTED;
		}
		return bitFlag;
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	function getMimeType$1() {
		return "application/octet-stream";
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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


	try {
		configure({ baseURI: (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('zip-fs.js', document.baseURI).href)) });
	} catch {
		// ignored
	}

	const A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function g(g){let B;g({wasmURI:()=>(B||(B="data:application/wasm;base64,"+(g=>{g=(g=>{const B=(g=(g+"").replace(/[^A-Za-z0-9+/=]/g,"")).length,E=[];for(let I=0;B>I;I+=4){const B=A.indexOf(g[I])<<18|A.indexOf(g[I+1])<<12|(63&A.indexOf(g[I+2]))<<6|63&A.indexOf(g[I+3]);E.push(B>>16&255),"="!==g[I+2]&&E.push(B>>8&255),"="!==g[I+3]&&E.push(255&B);}return new Uint8Array(E)})(g);let B=new Uint8Array(1024),E=0;for(let A=0;A<g.length;){const C=g[A++];if(128&C){const Q=3+(127&C),Y=g[A++]<<8|g[A++],D=E-Y;I(E+Q);for(let A=0;Q>A;A++)B[E++]=B[D+A];}else {const Q=C;I(E+Q);for(let I=0;Q>I&&A<g.length;I++)B[E++]=g[A++];}}return (g=>{let B="";const E=g.length;let I=0;for(;E>I+2;I+=3){const E=g[I]<<16|g[I+1]<<8|g[I+2];B+=A[E>>18&63]+A[E>>12&63]+A[E>>6&63]+A[63&E];}const C=E-I;if(1===C){const E=g[I]<<16;B+=A[E>>18&63]+A[E>>12&63]+"==";}else if(2===C){const E=g[I]<<16|g[I+1]<<8;B+=A[E>>18&63]+A[E>>12&63]+A[E>>6&63]+"=";}return B})(new Uint8Array(B.buffer.slice(0,E)));function I(A){if(B.length<A){let g=2*B.length;for(;A>g;)g*=2;const I=new Uint8Array(g);I.set(B.subarray(0,E)),B=I;}}})("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mYAABAFZgAAEAdmAAAQBOYAABAG5gAAEAXmAAAQB+YAABAEFgAAEAYWAAAQBRYAABAHFgAAEASWAAAQBpYAABAFlgAAEAeWAAAQBFYAABAGVgAAEAVWAAAQB1YAABAE1gAAEAbWAAAQBdYAABAH1gAAEAQ2AAAQBjYAABAFNgAAEAc2AAASAETMCAK2AAAQBbYAABAHtgAAEAR2AAAQBnYAABAFdgAAEAd2AAAQBPYAABAG9gAAEAX2AAAQB/YAABAETgADCBRMBCQCTgAAIAZOAAAgBU4AACAFTgAAIAdOAAAgB04AACAEzgAAIATOAAAgBs4AACAGzgAAIAXOAAAgBc4AACAHzgAAIAfOAAAgBC4AACIAQ2oAEAoAABIAACAFLgAAIAUuAAAgBy4AACAHLgAAIASuAAAgBK4AACAGrgAAIAauAAAgBa4AACAFrgAAIAeuAAAgB64AACAEbgAAIARuAAAgBm4AACAGbgAAIAVuAAAgBW4AACAHbgAAIAduAAAgBO4AACAE7gAAIAbuAAAgBu4AACAF7gAAIAXuAAAgB+4AACAH7gAAIgQO2AQeAAAgBh4AACAGHgAAIAUeAAAgBR4AACAHHgAAIAceAAAgBJ4AACAEngAAIAaeAAAgBp4AACAFngAAIAWeAAAgB54AACAHngAAIAReAAAgBF4AACAGXgAAIAZeAAAgBV4AACAFXgAAIAdeAAAgB14AACAE3gAAIATeAAAgBt4AACAG3gAAIAXeAAAgBd4AACAH3gAAIAfeAAAgBD4AACAEPgAAIAY+AAAgBj4AACAFPgAAIAU+AAAgBz4AACAHPgAAIAS+AAAgBL4AACAGvgAAIAa+AAAgBb4AACAFvgAAIAe+AAAgB74AACAEfgAAIAR+AAAgBn4AACAGfgAAIAV+AAAgBX4AACAHfgAAIAd+AAAgBP4AACAE/gAAIAb+AAAgBv4AACAF/gAAIAX+AAAgB/4AACAH/gAAIgQQKAUCAAAQBIIAABAFggAAEARCAAAQBUIAABAEwgAAEAXCCBVYDBwBIgAAEASiAAAQBaIAABAEYgAAEAViAAAQBOIAABAF4gAAEAQSAAAQBRIAABAEkgAAEAWSAAAQBFIAABAFUgAAEATSAAAQBdIAABAEDgABCAYOAAAQBQ4AABAHDgAAEASOAAAQBo4AABAFjgAAEAeOAAASAveaAAHSBAsYBBYAAXAEFggVKARSAAAQBDIAABAEcgAAEgL34gAREAQWCBgQBGoIF6gEFgAPUAQWAA7gBBYADnIBPdoAABAERgAAEAQmAAAQBGYAABIEAAgEVgAAEAQ2AAAQBHYAABAEDgAAEAROCBkABBYACLIEFpgEFgAG0AQWAPd8DGwtNgx+5hwAEAQKMAASBB1GJAAQBBIwABAEFigAEBEGwHAuAvMWLAEuNADuFAC8BBoQABIEFiIEABIEBCoEABIEBkoEABICEcYIABAELhAAEAQyEAASABduBR3kE4B0LI4UAX4UFywIQEYAFbQYHCQYKBQuAOrgEDQIOAYAHJQSUHgtphQCQhQCIhQCAhQB4gQBogQBcgQYfARCAAAQBFIAABAEYgAAEARyAAAQBIIAABAEogAAEATCAAAQBOIAABAFAgAAEAVCAAASBBr0BcIAABAGAgAAEAaCAAAQBwIAABAHggABvAx8Lco0Ab4EAa4EAZ4EAY4EAX4EAW4EAV4EAU4EAT4EAS4EAR4EAQ4EBPAGArwBBgFHNAgttgQDHAQSAAAIBCIAABIEBM4ECSwEQgAAOgwAMgYVpgKomhAAkgQdzgQBPAQiAAAiBABiFAAyBCLeDAAwBIIEAlIAyhIEAawGAgQgvAQSDAAyAP0gKAQAQDABBkSEL/4AlHwEDgpvTBQgJCQoKgEk3gAABAQ2AAAEBDoAAAQEPgAABARCEAAEBEYQAAQEShAABAROEAAEBFIwAAQEVjAABARaMAAEBF4wAAQEYnAABARmcAAEBGpwAAQEbmwABARyBffsEBAQFBYHBkAEHgAABAQiEAAGAXSqCAAEBCowAAYAnsooAAYEBMJkAAYEBTJkAAYEBaLkAAYEBpLkAAYIDdYABzoUBvI0BqJ0BkLwBgAIbHLwAAQEdvAABgA9PgH05A9AqAQ==")),B)});}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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

	/* global TransformStream */

	let wasm, malloc, free, memory;

	function setWasmExports(wasmAPI) {
		wasm = wasmAPI;
		({ malloc, free, memory } = wasm);
		if (typeof malloc !== "function" || typeof free !== "function" || !memory) {
			wasm = malloc = free = memory = null;
			throw new Error("Invalid WASM module");
		}
	}

	function _make(isCompress, type, options = {}) {
		const level = (typeof options.level === "number") ? options.level : -1;
		const outBufferSize = (typeof options.outBuffer === "number") ? options.outBuffer : 64 * 1024;
		const inBufferSize = (typeof options.inBufferSize === "number") ? options.inBufferSize : 64 * 1024;

		return new TransformStream({
			start() {
				let result;
				this.out = malloc(outBufferSize);
				this.in = malloc(inBufferSize);
				this.inBufferSize = inBufferSize;
				this._scratch = new Uint8Array(outBufferSize);
				if (isCompress) {
					this._process = wasm.deflate_process;
					this._last_consumed = wasm.deflate_last_consumed;
					this._end = wasm.deflate_end;
					this.streamHandle = wasm.deflate_new();
					if (type === "gzip") {
						result = wasm.deflate_init_gzip(this.streamHandle, level);
					} else if (type === "deflate-raw") {
						result = wasm.deflate_init_raw(this.streamHandle, level);
					} else {
						result = wasm.deflate_init(this.streamHandle, level);
					}
				} else {
					if (type === "deflate64-raw") {
						this._process = wasm.inflate9_process;
						this._last_consumed = wasm.inflate9_last_consumed;
						this._end = wasm.inflate9_end;
						this.streamHandle = wasm.inflate9_new();
						result = wasm.inflate9_init_raw(this.streamHandle);
					} else {
						this._process = wasm.inflate_process;
						this._last_consumed = wasm.inflate_last_consumed;
						this._end = wasm.inflate_end;
						this.streamHandle = wasm.inflate_new();
						if (type === "deflate-raw") {
							result = wasm.inflate_init_raw(this.streamHandle);
						} else if (type === "gzip") {
							result = wasm.inflate_init_gzip(this.streamHandle);
						} else {
							result = wasm.inflate_init(this.streamHandle);
						}
					}
				}
				if (result !== 0) {
					throw new Error("init failed:" + result);
				}
			},
			transform(chunk, controller) {
				try {
					const buffer = chunk;
					const heap = new Uint8Array(memory.buffer);
					const process = this._process;
					const last_consumed = this._last_consumed;
					const out = this.out;
					const scratch = this._scratch;
					let offset = 0;
					while (offset < buffer.length) {
						const toRead = Math.min(buffer.length - offset, 32 * 1024);
						if (!this.in || this.inBufferSize < toRead) {
							if (this.in && free) {
								free(this.in);
							}
							this.in = malloc(toRead);
							this.inBufferSize = toRead;
						}
						heap.set(buffer.subarray(offset, offset + toRead), this.in);
						const result = process(this.streamHandle, this.in, toRead, out, outBufferSize, 0);
						if (!isCompress && result < 0) {
							throw new Error("process error:" + result);
						}
						const prod = result & 0x00ffffff;
						if (prod) {
							scratch.set(heap.subarray(out, out + prod), 0);
							controller.enqueue(scratch.slice(0, prod));
						}
						const consumed = last_consumed(this.streamHandle);
						if (consumed === 0) {
							break;
						}
						offset += consumed;
					}
				} catch (error) {
					if (this._end && this.streamHandle) {
						this._end(this.streamHandle);
					}
					if (this.in && free) {
						free(this.in);
					}
					if (this.out && free) {
						free(this.out);
					}
					controller.error(error);
				}
			},
			flush(controller) {
				try {
					const heap = new Uint8Array(memory.buffer);
					const process = this._process;
					const out = this.out;
					const scratch = this._scratch;
					while (true) {
						const result = process(this.streamHandle, 0, 0, out, outBufferSize, 4);
						if (!isCompress && result < 0) {
							throw new Error("process error:" + result);
						}
						const produced = result & 0x00ffffff;
						const code = (result >> 24) & 0xff;
						if (produced) {
							scratch.set(heap.subarray(out, out + produced), 0);
							controller.enqueue(scratch.slice(0, produced));
						}
						if (code === 1 || produced === 0) {
							break;
						}
					}
				} catch (error) {
					controller.error(error);
				} finally {
					if (this._end && this.streamHandle) {
						const result = this._end(this.streamHandle);
						if (result !== 0) {
							controller.error(new Error("end error:" + result));
						}
					}
					if (this.in && free) {
						free(this.in);
					}
					if (this.out && free) {
						free(this.out);
					}
				}
			}
		});
	}

	class CompressionStreamZlib {
		constructor(type = "deflate", options) {
			return _make(true, type, options);
		}
	}
	class DecompressionStreamZlib {
		constructor(type = "deflate", options) {
			return _make(false, type, options);
		}
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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


	let initializedModule = false;

	async function initModule(wasmURI, { baseURI }) {
		if (!initializedModule) {
			let arrayBuffer, uri;
			try {
				try {
					uri = new URL(wasmURI, baseURI);
				} catch {
					// ignored
				}
				const response = await fetch(uri);
				arrayBuffer = await response.arrayBuffer();
			} catch (error) {
				if (wasmURI.startsWith("data:application/wasm;base64,")) {
					arrayBuffer = arrayBufferFromDataURI(wasmURI);
				} else {
					throw error;
				}
			}
			const wasmInstance = await WebAssembly.instantiate(arrayBuffer);
			setWasmExports(wasmInstance.instance.exports);
			initializedModule = true;
		}
	}

	function resetWasmModule() {
		initializedModule = false;
	}

	function arrayBufferFromDataURI(dataURI) {
		const base64 = dataURI.split(",")[1];
		const binary = atob(base64);
		const len = binary.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; ++i) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes.buffer;
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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


	let modulePromise;

	g(configure);
	configureWorker({
		initModule: config => {
			if (!modulePromise) {
				let { wasmURI } = config;
				// deno-lint-ignore valid-typeof
				if (typeof wasmURI == FUNCTION_TYPE) {
					wasmURI = wasmURI();
				}
				modulePromise = initModule(wasmURI, config);

			}
			return modulePromise;
		}
	});
	configure({
		CompressionStreamZlib,
		DecompressionStreamZlib
	});

	function terminateWorkersAndModule() {
		modulePromise = null;
		terminateWorkers();
		resetWasmModule();
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	class ZipEntry {

		constructor(fs, name, params, parent) {
			const zipEntry = this;
			if (fs.root && parent && parent.getChildByName(name)) {
				throw new Error("Entry filename already exists");
			}
			if (!params) {
				params = {};
			}
			Object.assign(zipEntry, {
				fs,
				name,
				data: params.data,
				options: params.options,
				id: fs.entries.length,
				parent,
				children: [],
				uncompressedSize: params.uncompressedSize || 0,
				passThrough: params.passThrough
			});
			fs.entries.push(zipEntry);
			if (parent) {
				zipEntry.parent.children.push(zipEntry);
			}
		}

		moveTo(target) {
			// deprecated
			const zipEntry = this;
			zipEntry.fs.move(zipEntry, target);
		}

		getFullname() {
			return this.getRelativeName();
		}

		getRelativeName(ancestor = this.fs.root) {
			const zipEntry = this;
			let relativeName = zipEntry.name;
			let entry = zipEntry.parent;
			while (entry && entry != ancestor) {
				relativeName = (entry.name ? entry.name + "/" : "") + relativeName;
				entry = entry.parent;
			}
			return relativeName;
		}

		isDescendantOf(ancestor) {
			let entry = this.parent;
			while (entry && entry.id != ancestor.id) {
				entry = entry.parent;
			}
			return Boolean(entry);
		}

		rename(name) {
			const parent = this.parent;
			if (parent && parent.getChildByName(name)) {
				throw new Error("Entry filename already exists");
			} else {
				this.name = name;
			}
		}
	}

	class ZipFileEntry extends ZipEntry {

		constructor(fs, name, params, parent) {
			super(fs, name, params, parent);
			const zipEntry = this;
			zipEntry.Reader = params.Reader;
			zipEntry.Writer = params.Writer;
			if (params.getData) {
				zipEntry.getData = params.getData;
			}
		}

		clone() {
			return new ZipFileEntry(this.fs, this.name, this);
		}

		async getData(writer, options = {}) {
			const zipEntry = this;
			if (!writer || (writer.constructor == zipEntry.Writer && zipEntry.data)) {
				return zipEntry.data;
			} else {
				const reader = zipEntry.reader = new zipEntry.Reader(zipEntry.data, options);
				const uncompressedSize = zipEntry.data ? zipEntry.data.uncompressedSize : reader.size;
				await Promise.all([initStream(reader), initStream(writer, uncompressedSize)]);
				const { readable } = reader;
				zipEntry.uncompressedSize = reader.size;
				await readable.pipeTo(writer.writable);
				return writer.getData ? writer.getData() : writer.writable;
			}
		}

		isPasswordProtected() {
			return this.data.encrypted;
		}

		async checkPassword(password, options = {}) {
			const zipEntry = this;
			if (zipEntry.isPasswordProtected()) {
				options.password = password;
				options.checkPasswordOnly = true;
				try {
					await zipEntry.data.getData(null, options);
					return true;
				} catch (error) {
					if (error.message == ERR_INVALID_PASSWORD) {
						return false;
					} else {
						throw error;
					}
				}
			} else {
				return true;
			}
		}

		getText(encoding, options) {
			return this.getData(new TextWriter(encoding), options);
		}

		getBlob(mimeType, options) {
			return this.getData(new BlobWriter(mimeType), options);
		}

		getData64URI(mimeType, options) {
			return this.getData(new Data64URIWriter(mimeType), options);
		}

		getUint8Array(options) {
			return this.getData(new Uint8ArrayWriter(), options);
		}

		getWritable(writable = new WritableStream(), options) {
			return this.getData({ writable }, options);
		}

		getArrayBuffer(options) {
			return this.data.arrayBuffer(options);
		}

		replaceBlob(blob) {
			Object.assign(this, {
				data: blob,
				Reader: BlobReader,
				Writer: BlobWriter,
				reader: null
			});
		}

		replaceText(text) {
			Object.assign(this, {
				data: text,
				Reader: TextReader,
				Writer: TextWriter,
				reader: null
			});
		}

		replaceData64URI(dataURI) {
			Object.assign(this, {
				data: dataURI,
				Reader: Data64URIReader,
				Writer: Data64URIWriter,
				reader: null
			});
		}

		replaceUint8Array(array) {
			Object.assign(this, {
				data: array,
				Reader: Uint8ArrayReader,
				Writer: Uint8ArrayWriter,
				reader: null
			});
		}

		replaceReadable(readable) {
			Object.assign(this, {
				data: null,
				Reader: function () { return { readable }; },
				Writer: null,
				reader: null
			});
		}
	}

	class ZipDirectoryEntry extends ZipEntry {

		constructor(fs, name, params, parent) {
			super(fs, name, params, parent);
			this.directory = true;
		}

		clone(deepClone) {
			const zipEntry = this;
			const clonedEntry = new ZipDirectoryEntry(zipEntry.fs, zipEntry.name);
			if (deepClone) {
				clonedEntry.children = zipEntry.children.map(child => {
					const childClone = child.clone(deepClone);
					childClone.parent = clonedEntry;
					return childClone;
				});
			}
			return clonedEntry;
		}

		addDirectory(name, options) {
			return addChild(this, name, { options }, true);
		}

		addText(name, text, options = {}) {
			return addChild(this, name, {
				data: text,
				Reader: TextReader,
				Writer: TextWriter,
				options,
				uncompressedSize: text.length
			});
		}

		addBlob(name, blob, options = {}) {
			return addChild(this, name, {
				data: blob,
				Reader: BlobReader,
				Writer: BlobWriter,
				options,
				uncompressedSize: blob.size
			});
		}

		addData64URI(name, dataURI, options = {}) {
			let dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") {
				dataEnd--;
			}
			const dataStart = dataURI.indexOf(",") + 1;
			return addChild(this, name, {
				data: dataURI,
				Reader: Data64URIReader,
				Writer: Data64URIWriter,
				options,
				uncompressedSize: Math.floor((dataEnd - dataStart) * 0.75)
			});
		}

		addUint8Array(name, array, options = {}) {
			return addChild(this, name, {
				data: array,
				Reader: Uint8ArrayReader,
				Writer: Uint8ArrayWriter,
				options,
				uncompressedSize: array.length
			});
		}

		addHttpContent(name, url, options = {}) {
			return addChild(this, name, {
				data: url,
				Reader: class extends HttpReader {
					constructor(url) {
						super(url, options);
					}
				},
				options
			});
		}

		addReadable(name, readable, options = {}) {
			return addChild(this, name, {
				Reader: function () { return { readable }; },
				options
			});
		}

		addFileSystemEntry(fileSystemEntry, options = {}) {
			return addFileSystemHandle(this, fileSystemEntry, options);
		}

		addFileSystemHandle(handle, options = {}) {
			return addFileSystemHandle(this, handle, options);
		}

		addFile(file, options = {}) {
			if (!options.lastModDate) {
				options.lastModDate = new Date(file.lastModified);
			}
			return addChild(this, file.name, {
				data: file,
				Reader: function () {
					const readable = file.stream();
					const size = file.size;
					return { readable, size };
				},
				options,
				uncompressedSize: file.size
			});
		}

		addData(name, params) {
			return addChild(this, name, params);
		}

		importBlob(blob, options) {
			return this.importZip(new BlobReader(blob), options);
		}

		importData64URI(dataURI, options) {
			return this.importZip(new Data64URIReader(dataURI), options);
		}

		importUint8Array(array, options) {
			return this.importZip(new Uint8ArrayReader(array), options);
		}

		importHttpContent(url, options) {
			return this.importZip(new HttpReader(url, options), options);
		}

		importReadable(readable, options) {
			return this.importZip({ readable }, options);
		}

		exportBlob(options = {}) {
			return this.exportZip(new BlobWriter(options.mimeType || "application/zip"), options);
		}

		exportData64URI(options = {}) {
			return this.exportZip(new Data64URIWriter(options.mimeType || "application/zip"), options);
		}

		exportUint8Array(options = {}) {
			return this.exportZip(new Uint8ArrayWriter(), options);
		}

		async exportWritable(writable = new WritableStream(), options = {}) {
			await this.exportZip({ writable }, options);
			return writable;
		}

		async importZip(reader, options = {}) {
			await initStream(reader);
			const zipReader = new ZipReader(reader, options);
			const importedEntries = [];
			const entries = await zipReader.getEntries();
			for (const entry of entries) {
				let parent = this;
				try {
					const path = entry.filename.split("/");
					const name = path.pop();
					path.forEach((pathPart, pathIndex) => {
						const previousParent = parent;
						parent = parent.getChildByName(pathPart);
						if (!parent) {
							parent = new ZipDirectoryEntry(this.fs, pathPart, { data: pathIndex == path.length - 1 ? entry : null }, previousParent);
							importedEntries.push(parent);
						}
					});
					if (!entry.directory) {
						importedEntries.push(addChild(parent, name, {
							data: entry,
							Reader: getZipBlobReader(Object.assign({}, options)),
							uncompressedSize: entry.uncompressedSize,
							passThrough: options.passThrough
						}));
					}
				} catch (error) {
					try {
						error.cause = {
							entry
						};
					} catch {
						// ignored
					}
					throw error;
				}
			}
			return importedEntries;
		}

		async exportZip(writer, options) {
			const zipEntry = this;
			if (options.bufferedWrite === UNDEFINED_VALUE) {
				options.bufferedWrite = true;
			}
			await Promise.all([initReaders(zipEntry, options.readerOptions), initStream(writer)]);
			const zipWriter = new ZipWriter(writer, options);
			await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], "uncompressedSize"), options);
			await zipWriter.close();
			return writer.getData ? writer.getData() : writer.writable;
		}

		getChildByName(name) {
			const children = this.children;
			for (let childIndex = 0; childIndex < children.length; childIndex++) {
				const child = children[childIndex];
				if (child.name == name) {
					return child;
				}
			}
		}

		isPasswordProtected() {
			const children = this.children;
			for (let childIndex = 0; childIndex < children.length; childIndex++) {
				const child = children[childIndex];
				if (child.isPasswordProtected()) {
					return true;
				}
			}
			return false;
		}

		async checkPassword(password, options = {}) {
			const children = this.children;
			const result = await Promise.all(children.map(child => child.checkPassword(password, options)));
			return !result.includes(false);
		}
	}


	class FS {

		constructor() {
			resetFS(this);
		}

		get children() {
			return this.root.children;
		}

		remove(entry) {
			detach(entry);
			this.entries[entry.id] = null;
		}

		move(entry, destination) {
			if (entry == this.root) {
				throw new Error("Root directory cannot be moved");
			} else {
				if (destination.directory) {
					if (!destination.isDescendantOf(entry)) {
						if (entry != destination) {
							if (destination.getChildByName(entry.name)) {
								throw new Error("Entry filename already exists");
							}
							detach(entry);
							entry.parent = destination;
							destination.children.push(entry);
						}
					} else {
						throw new Error("Entry is a ancestor of target entry");
					}
				} else {
					throw new Error("Target entry is not a directory");
				}
			}
		}

		find(fullname) {
			const path = fullname.split("/");
			let node = this.root;
			for (let index = 0; node && index < path.length; index++) {
				node = node.getChildByName(path[index]);
			}
			return node;
		}

		getById(id) {
			return this.entries[id];
		}

		getChildByName(name) {
			return this.root.getChildByName(name);
		}

		addDirectory(name, options) {
			return this.root.addDirectory(name, options);
		}

		addText(name, text, options) {
			return this.root.addText(name, text, options);
		}

		addBlob(name, blob, options) {
			return this.root.addBlob(name, blob, options);
		}

		addData64URI(name, dataURI, options) {
			return this.root.addData64URI(name, dataURI, options);
		}

		addUint8Array(name, array, options) {
			return this.root.addUint8Array(name, array, options);
		}

		addHttpContent(name, url, options) {
			return this.root.addHttpContent(name, url, options);
		}

		addReadable(name, readable, options) {
			return this.root.addReadable(name, readable, options);
		}

		addFileSystemEntry(fileSystemEntry, options) {
			return this.root.addFileSystemEntry(fileSystemEntry, options);
		}

		addFileSystemHandle(handle, options) {
			return this.root.addFileSystemHandle(handle, options);
		}

		addFile(file, options) {
			return this.root.addFile(file, options);
		}

		addData(name, params) {
			return this.root.addData(name, params);
		}

		importBlob(blob, options) {
			resetFS(this);
			return this.root.importBlob(blob, options);
		}

		importData64URI(dataURI, options) {
			resetFS(this);
			return this.root.importData64URI(dataURI, options);
		}

		importUint8Array(array, options) {
			resetFS(this);
			return this.root.importUint8Array(array, options);
		}

		importHttpContent(url, options) {
			resetFS(this);
			return this.root.importHttpContent(url, options);
		}

		importReadable(readable, options) {
			resetFS(this);
			return this.root.importReadable(readable, options);
		}

		importZip(reader, options) {
			return this.root.importZip(reader, options);
		}

		exportBlob(options) {
			return this.root.exportBlob(options);
		}

		exportData64URI(options) {
			return this.root.exportData64URI(options);
		}

		exportUint8Array(options) {
			return this.root.exportUint8Array(options);
		}

		exportWritable(writable, options) {
			return this.root.exportWritable(writable, options);
		}

		isPasswordProtected() {
			return this.root.isPasswordProtected();
		}

		checkPassword(password, options) {
			return this.root.checkPassword(password, options);
		}
	}

	const fs = { FS, ZipDirectoryEntry, ZipFileEntry };

	function getTotalSize(entries, propertyName) {
		let size = 0;
		entries.forEach(process);
		return size;

		function process(entry) {
			size += entry[propertyName];
			if (entry.children) {
				entry.children.forEach(process);
			}
		}
	}

	function getZipBlobReader(options) {
		return class extends Reader {

			constructor(entry, options = {}) {
				super();
				this.entry = entry;
				this.options = options;
			}

			async init() {
				const zipBlobReader = this;
				zipBlobReader.size = zipBlobReader.entry.uncompressedSize;
				const data = await zipBlobReader.entry.getData(new BlobWriter(), Object.assign({}, zipBlobReader.options, options));
				zipBlobReader.data = data;
				zipBlobReader.blobReader = new BlobReader(data);
				super.init();
			}

			readUint8Array(index, length) {
				return this.blobReader.readUint8Array(index, length);
			}
		};
	}

	async function initReaders(entry, options) {
		if (entry.children.length) {
			await Promise.all(entry.children.map(async child => {
				if (child.directory) {
					await initReaders(child, options);
				} else {
					const reader = child.reader = new child.Reader(child.data, options);
					try {
						await initStream(reader);
					} catch (error) {
						try {
							error.entryId = child.id;
							error.cause = {
								entry: child
							};
						} catch {
							// ignored
						}
						throw error;
					}
					child.uncompressedSize = reader.size;
				}
			}));
		}
	}

	function detach(entry) {
		if (entry.parent) {
			const children = entry.parent.children;
			children.forEach((child, index) => {
				if (child.id == entry.id) {
					children.splice(index, 1);
				}
			});
		}
	}

	async function exportZip(zipWriter, entry, totalSize, options) {
		const selectedEntry = entry;
		const entryOffsets = new Map();
		await process(zipWriter, entry);

		async function process(zipWriter, entry) {
			await exportChild();

			async function exportChild() {
				if (options.bufferedWrite) {
					await Promise.allSettled(entry.children.map(processChild));
				} else {
					for (const child of entry.children) {
						await processChild(child);
					}
				}
			}

			async function processChild(child) {
				const name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
				const childOptions = child.options || {};
				let zipEntryOptions = {};
				if (child.data instanceof Entry) {
					const {
						externalFileAttributes,
						versionMadeBy,
						comment,
						lastModDate,
						creationDate,
						lastAccessDate,
						uncompressedSize,
						encrypted,
						zipCrypto,
						signature,
						compressionMethod,
						extraFieldAES
					} = child.data;
					zipEntryOptions = {
						externalFileAttributes,
						versionMadeBy,
						comment,
						lastModDate,
						creationDate,
						lastAccessDate
					};
					if (child.passThrough) {
						let level, encryptionStrength;
						if (compressionMethod === 0) {
							level = 0;
						}
						if (extraFieldAES) {
							encryptionStrength = extraFieldAES.strength;
						}
						zipEntryOptions = Object.assign(zipEntryOptions, {
							passThrough: true,
							encrypted,
							zipCrypto,
							signature,
							uncompressedSize,
							level,
							encryptionStrength,
							compressionMethod
						});
					}
				}
				await zipWriter.add(name, child.reader, Object.assign({}, options, zipEntryOptions, childOptions, {
					directory: child.directory,
					onprogress: async indexProgress => {
						if (options.onprogress) {
							entryOffsets.set(name, indexProgress);
							try {
								await options.onprogress(Array.from(entryOffsets.values()).reduce((previousValue, currentValue) => previousValue + currentValue), totalSize);
							} catch {
								// ignored
							}
						}
					}
				}));
				await process(zipWriter, child);
			}
		}
	}

	function addFileSystemHandle(zipEntry, handle, options) {
		return addFile(zipEntry, handle, []);

		async function addFile(parentEntry, handle, addedEntries) {
			if (handle) {
				try {
					if (handle.isFile || handle.isDirectory) {
						handle = await transformToFileSystemhandle(handle);
					}
					if (handle.kind == "file") {
						const file = await handle.getFile();
						addedEntries.push(
							parentEntry.addData(file.name, {
								Reader: function () {
									const readable = file.stream();
									const size = file.size;
									return { readable, size };
								},
								options: Object.assign({}, { lastModDate: new Date(file.lastModified) }, options),
								uncompressedSize: file.size
							})
						);
					} else if (handle.kind == "directory") {
						const directoryEntry = parentEntry.addDirectory(handle.name);
						addedEntries.push(directoryEntry);
						for await (const childHandle of handle.values()) {
							await addFile(directoryEntry, childHandle, addedEntries);
						}
					}
				} catch (error) {
					const message = error.message + (handle ? " (" + handle.name + ")" : "");
					throw new Error(message);
				}
			}
			return addedEntries;
		}
	}

	async function transformToFileSystemhandle(entry) {
		const handle = {
			name: entry.name
		};
		if (entry.isFile) {
			handle.kind = "file";
			handle.getFile = () =>
				new Promise((resolve, reject) => entry.file(resolve, reject));
		}
		if (entry.isDirectory) {
			handle.kind = "directory";
			const handles = await transformToFileSystemhandles(entry);
			handle.values = () => handles;
		}
		return handle;
	}

	async function transformToFileSystemhandles(entry) {
		const entries = [];
		function readEntries(directoryReader, resolve, reject) {
			directoryReader.readEntries(async (entriesPart) => {
				if (!entriesPart.length) {
					resolve(entries);
				} else {
					for (const entry of entriesPart) {
						entries.push(await transformToFileSystemhandle(entry));
					}
					readEntries(directoryReader, resolve, reject);
				}
			}, reject);
		}
		await new Promise((resolve, reject) =>
			readEntries(entry.createReader(), resolve, reject)
		);
		return {
			[Symbol.iterator]() {
				let entryIndex = 0;
				return {
					next() {
						const result = {
							value: entries[entryIndex],
							done: entryIndex == entries.length
						};
						entryIndex++;
						return result;
					}
				};
			}
		};
	}

	function resetFS(fs) {
		fs.entries = [];
		fs.root = new ZipDirectoryEntry(fs);
	}

	function addChild(parent, name, params, directory) {
		if (parent.directory) {
			return directory ? new ZipDirectoryEntry(parent.fs, name, params, parent) : new ZipFileEntry(parent.fs, name, params, parent);
		} else {
			throw new Error("Parent entry is not a directory");
		}
	}

	/*
	 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

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


	const table = {
		"application": {
			"andrew-inset": "ez",
			"annodex": "anx",
			"atom+xml": "atom",
			"atomcat+xml": "atomcat",
			"atomserv+xml": "atomsrv",
			"bbolin": "lin",
			"cu-seeme": "cu",
			"davmount+xml": "davmount",
			"dsptype": "tsp",
			"ecmascript": [
				"es",
				"ecma"
			],
			"futuresplash": "spl",
			"hta": "hta",
			"java-archive": "jar",
			"java-serialized-object": "ser",
			"java-vm": "class",
			"m3g": "m3g",
			"mac-binhex40": "hqx",
			"mathematica": [
				"nb",
				"ma",
				"mb"
			],
			"msaccess": "mdb",
			"msword": [
				"doc",
				"dot",
				"wiz"
			],
			"mxf": "mxf",
			"oda": "oda",
			"ogg": "ogx",
			"pdf": "pdf",
			"pgp-keys": "key",
			"pgp-signature": [
				"asc",
				"sig"
			],
			"pics-rules": "prf",
			"postscript": [
				"ps",
				"ai",
				"eps",
				"epsi",
				"epsf",
				"eps2",
				"eps3"
			],
			"rar": "rar",
			"rdf+xml": "rdf",
			"rss+xml": "rss",
			"rtf": "rtf",
			"xhtml+xml": [
				"xhtml",
				"xht"
			],
			"xml": [
				"xml",
				"xsl",
				"xsd",
				"xpdl"
			],
			"xspf+xml": "xspf",
			"zip": "zip",
			"vnd.android.package-archive": "apk",
			"vnd.cinderella": "cdy",
			"vnd.google-earth.kml+xml": "kml",
			"vnd.google-earth.kmz": "kmz",
			"vnd.mozilla.xul+xml": "xul",
			"vnd.ms-excel": [
				"xls",
				"xlb",
				"xlt",
				"xlm",
				"xla",
				"xlc",
				"xlw"
			],
			"vnd.ms-pki.seccat": "cat",
			"vnd.ms-pki.stl": "stl",
			"vnd.ms-powerpoint": [
				"ppt",
				"pps",
				"pot",
				"ppa",
				"pwz"
			],
			"vnd.oasis.opendocument.chart": "odc",
			"vnd.oasis.opendocument.database": "odb",
			"vnd.oasis.opendocument.formula": "odf",
			"vnd.oasis.opendocument.graphics": "odg",
			"vnd.oasis.opendocument.graphics-template": "otg",
			"vnd.oasis.opendocument.image": "odi",
			"vnd.oasis.opendocument.presentation": "odp",
			"vnd.oasis.opendocument.presentation-template": "otp",
			"vnd.oasis.opendocument.spreadsheet": "ods",
			"vnd.oasis.opendocument.spreadsheet-template": "ots",
			"vnd.oasis.opendocument.text": "odt",
			"vnd.oasis.opendocument.text-master": [
				"odm",
				"otm"
			],
			"vnd.oasis.opendocument.text-template": "ott",
			"vnd.oasis.opendocument.text-web": "oth",
			"vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
			"vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
			"vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
			"vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
			"vnd.openxmlformats-officedocument.presentationml.template": "potx",
			"vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
			"vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
			"vnd.smaf": "mmf",
			"vnd.stardivision.calc": "sdc",
			"vnd.stardivision.chart": "sds",
			"vnd.stardivision.draw": "sda",
			"vnd.stardivision.impress": "sdd",
			"vnd.stardivision.math": [
				"sdf",
				"smf"
			],
			"vnd.stardivision.writer": [
				"sdw",
				"vor"
			],
			"vnd.stardivision.writer-global": "sgl",
			"vnd.sun.xml.calc": "sxc",
			"vnd.sun.xml.calc.template": "stc",
			"vnd.sun.xml.draw": "sxd",
			"vnd.sun.xml.draw.template": "std",
			"vnd.sun.xml.impress": "sxi",
			"vnd.sun.xml.impress.template": "sti",
			"vnd.sun.xml.math": "sxm",
			"vnd.sun.xml.writer": "sxw",
			"vnd.sun.xml.writer.global": "sxg",
			"vnd.sun.xml.writer.template": "stw",
			"vnd.symbian.install": [
				"sis",
				"sisx"
			],
			"vnd.visio": [
				"vsd",
				"vst",
				"vss",
				"vsw",
				"vsdx",
				"vssx",
				"vstx",
				"vssm",
				"vstm"
			],
			"vnd.wap.wbxml": "wbxml",
			"vnd.wap.wmlc": "wmlc",
			"vnd.wap.wmlscriptc": "wmlsc",
			"vnd.wordperfect": "wpd",
			"vnd.wordperfect5.1": "wp5",
			"x-123": "wk",
			"x-7z-compressed": "7z",
			"x-abiword": "abw",
			"x-apple-diskimage": "dmg",
			"x-bcpio": "bcpio",
			"x-bittorrent": "torrent",
			"x-cbr": [
				"cbr",
				"cba",
				"cbt",
				"cb7"
			],
			"x-cbz": "cbz",
			"x-cdf": [
				"cdf",
				"cda"
			],
			"x-cdlink": "vcd",
			"x-chess-pgn": "pgn",
			"x-cpio": "cpio",
			"x-csh": "csh",
			"x-director": [
				"dir",
				"dxr",
				"cst",
				"cct",
				"cxt",
				"w3d",
				"fgd",
				"swa"
			],
			"x-dms": "dms",
			"x-doom": "wad",
			"x-dvi": "dvi",
			"x-httpd-eruby": "rhtml",
			"x-font": "pcf.Z",
			"x-freemind": "mm",
			"x-gnumeric": "gnumeric",
			"x-go-sgf": "sgf",
			"x-graphing-calculator": "gcf",
			"x-gtar": [
				"gtar",
				"taz"
			],
			"x-hdf": "hdf",
			"x-httpd-php": [
				"phtml",
				"pht",
				"php"
			],
			"x-httpd-php-source": "phps",
			"x-httpd-php3": "php3",
			"x-httpd-php3-preprocessed": "php3p",
			"x-httpd-php4": "php4",
			"x-httpd-php5": "php5",
			"x-ica": "ica",
			"x-info": "info",
			"x-internet-signup": [
				"ins",
				"isp"
			],
			"x-iphone": "iii",
			"x-iso9660-image": "iso",
			"x-java-jnlp-file": "jnlp",
			"x-jmol": "jmz",
			"x-killustrator": "kil",
			"x-latex": "latex",
			"x-lyx": "lyx",
			"x-lzx": "lzx",
			"x-maker": [
				"frm",
				"fb",
				"fbdoc"
			],
			"x-ms-wmd": "wmd",
			"x-msdos-program": [
				"com",
				"exe",
				"bat",
				"dll"
			],
			"x-netcdf": [
				"nc"
			],
			"x-ns-proxy-autoconfig": [
				"pac",
				"dat"
			],
			"x-nwc": "nwc",
			"x-object": "o",
			"x-oz-application": "oza",
			"x-pkcs7-certreqresp": "p7r",
			"x-python-code": [
				"pyc",
				"pyo"
			],
			"x-qgis": [
				"qgs",
				"shp",
				"shx"
			],
			"x-quicktimeplayer": "qtl",
			"x-redhat-package-manager": [
				"rpm",
				"rpa"
			],
			"x-ruby": "rb",
			"x-sh": "sh",
			"x-shar": "shar",
			"x-shockwave-flash": [
				"swf",
				"swfl"
			],
			"x-silverlight": "scr",
			"x-stuffit": "sit",
			"x-sv4cpio": "sv4cpio",
			"x-sv4crc": "sv4crc",
			"x-tar": "tar",
			"x-tex-gf": "gf",
			"x-tex-pk": "pk",
			"x-texinfo": [
				"texinfo",
				"texi"
			],
			"x-trash": [
				"~",
				"%",
				"bak",
				"old",
				"sik"
			],
			"x-ustar": "ustar",
			"x-wais-source": "src",
			"x-wingz": "wz",
			"x-x509-ca-cert": [
				"crt",
				"der",
				"cer"
			],
			"x-xcf": "xcf",
			"x-xfig": "fig",
			"x-xpinstall": "xpi",
			"applixware": "aw",
			"atomsvc+xml": "atomsvc",
			"ccxml+xml": "ccxml",
			"cdmi-capability": "cdmia",
			"cdmi-container": "cdmic",
			"cdmi-domain": "cdmid",
			"cdmi-object": "cdmio",
			"cdmi-queue": "cdmiq",
			"docbook+xml": "dbk",
			"dssc+der": "dssc",
			"dssc+xml": "xdssc",
			"emma+xml": "emma",
			"epub+zip": "epub",
			"exi": "exi",
			"font-tdpfr": "pfr",
			"gml+xml": "gml",
			"gpx+xml": "gpx",
			"gxf": "gxf",
			"hyperstudio": "stk",
			"inkml+xml": [
				"ink",
				"inkml"
			],
			"ipfix": "ipfix",
			"jsonml+json": "jsonml",
			"lost+xml": "lostxml",
			"mads+xml": "mads",
			"marc": "mrc",
			"marcxml+xml": "mrcx",
			"mathml+xml": [
				"mathml",
				"mml"
			],
			"mbox": "mbox",
			"mediaservercontrol+xml": "mscml",
			"metalink+xml": "metalink",
			"metalink4+xml": "meta4",
			"mets+xml": "mets",
			"mods+xml": "mods",
			"mp21": [
				"m21",
				"mp21"
			],
			"mp4": "mp4s",
			"oebps-package+xml": "opf",
			"omdoc+xml": "omdoc",
			"onenote": [
				"onetoc",
				"onetoc2",
				"onetmp",
				"onepkg"
			],
			"oxps": "oxps",
			"patch-ops-error+xml": "xer",
			"pgp-encrypted": "pgp",
			"pkcs10": "p10",
			"pkcs7-mime": [
				"p7m",
				"p7c"
			],
			"pkcs7-signature": "p7s",
			"pkcs8": "p8",
			"pkix-attr-cert": "ac",
			"pkix-crl": "crl",
			"pkix-pkipath": "pkipath",
			"pkixcmp": "pki",
			"pls+xml": "pls",
			"prs.cww": "cww",
			"pskc+xml": "pskcxml",
			"reginfo+xml": "rif",
			"relax-ng-compact-syntax": "rnc",
			"resource-lists+xml": "rl",
			"resource-lists-diff+xml": "rld",
			"rls-services+xml": "rs",
			"rpki-ghostbusters": "gbr",
			"rpki-manifest": "mft",
			"rpki-roa": "roa",
			"rsd+xml": "rsd",
			"sbml+xml": "sbml",
			"scvp-cv-request": "scq",
			"scvp-cv-response": "scs",
			"scvp-vp-request": "spq",
			"scvp-vp-response": "spp",
			"sdp": "sdp",
			"set-payment-initiation": "setpay",
			"set-registration-initiation": "setreg",
			"shf+xml": "shf",
			"sparql-query": "rq",
			"sparql-results+xml": "srx",
			"srgs": "gram",
			"srgs+xml": "grxml",
			"sru+xml": "sru",
			"ssdl+xml": "ssdl",
			"ssml+xml": "ssml",
			"tei+xml": [
				"tei",
				"teicorpus"
			],
			"thraud+xml": "tfi",
			"timestamped-data": "tsd",
			"vnd.3gpp.pic-bw-large": "plb",
			"vnd.3gpp.pic-bw-small": "psb",
			"vnd.3gpp.pic-bw-var": "pvb",
			"vnd.3gpp2.tcap": "tcap",
			"vnd.3m.post-it-notes": "pwn",
			"vnd.accpac.simply.aso": "aso",
			"vnd.accpac.simply.imp": "imp",
			"vnd.acucobol": "acu",
			"vnd.acucorp": [
				"atc",
				"acutc"
			],
			"vnd.adobe.air-application-installer-package+zip": "air",
			"vnd.adobe.formscentral.fcdt": "fcdt",
			"vnd.adobe.fxp": [
				"fxp",
				"fxpl"
			],
			"vnd.adobe.xdp+xml": "xdp",
			"vnd.adobe.xfdf": "xfdf",
			"vnd.ahead.space": "ahead",
			"vnd.airzip.filesecure.azf": "azf",
			"vnd.airzip.filesecure.azs": "azs",
			"vnd.amazon.ebook": "azw",
			"vnd.americandynamics.acc": "acc",
			"vnd.amiga.ami": "ami",
			"vnd.anser-web-certificate-issue-initiation": "cii",
			"vnd.anser-web-funds-transfer-initiation": "fti",
			"vnd.antix.game-component": "atx",
			"vnd.apple.installer+xml": "mpkg",
			"vnd.apple.mpegurl": "m3u8",
			"vnd.aristanetworks.swi": "swi",
			"vnd.astraea-software.iota": "iota",
			"vnd.audiograph": "aep",
			"vnd.blueice.multipass": "mpm",
			"vnd.bmi": "bmi",
			"vnd.businessobjects": "rep",
			"vnd.chemdraw+xml": "cdxml",
			"vnd.chipnuts.karaoke-mmd": "mmd",
			"vnd.claymore": "cla",
			"vnd.cloanto.rp9": "rp9",
			"vnd.clonk.c4group": [
				"c4g",
				"c4d",
				"c4f",
				"c4p",
				"c4u"
			],
			"vnd.cluetrust.cartomobile-config": "c11amc",
			"vnd.cluetrust.cartomobile-config-pkg": "c11amz",
			"vnd.commonspace": "csp",
			"vnd.contact.cmsg": "cdbcmsg",
			"vnd.cosmocaller": "cmc",
			"vnd.crick.clicker": "clkx",
			"vnd.crick.clicker.keyboard": "clkk",
			"vnd.crick.clicker.palette": "clkp",
			"vnd.crick.clicker.template": "clkt",
			"vnd.crick.clicker.wordbank": "clkw",
			"vnd.criticaltools.wbs+xml": "wbs",
			"vnd.ctc-posml": "pml",
			"vnd.cups-ppd": "ppd",
			"vnd.curl.car": "car",
			"vnd.curl.pcurl": "pcurl",
			"vnd.dart": "dart",
			"vnd.data-vision.rdz": "rdz",
			"vnd.dece.data": [
				"uvf",
				"uvvf",
				"uvd",
				"uvvd"
			],
			"vnd.dece.ttml+xml": [
				"uvt",
				"uvvt"
			],
			"vnd.dece.unspecified": [
				"uvx",
				"uvvx"
			],
			"vnd.dece.zip": [
				"uvz",
				"uvvz"
			],
			"vnd.denovo.fcselayout-link": "fe_launch",
			"vnd.dna": "dna",
			"vnd.dolby.mlp": "mlp",
			"vnd.dpgraph": "dpg",
			"vnd.dreamfactory": "dfac",
			"vnd.ds-keypoint": "kpxx",
			"vnd.dvb.ait": "ait",
			"vnd.dvb.service": "svc",
			"vnd.dynageo": "geo",
			"vnd.ecowin.chart": "mag",
			"vnd.enliven": "nml",
			"vnd.epson.esf": "esf",
			"vnd.epson.msf": "msf",
			"vnd.epson.quickanime": "qam",
			"vnd.epson.salt": "slt",
			"vnd.epson.ssf": "ssf",
			"vnd.eszigno3+xml": [
				"es3",
				"et3"
			],
			"vnd.ezpix-album": "ez2",
			"vnd.ezpix-package": "ez3",
			"vnd.fdf": "fdf",
			"vnd.fdsn.mseed": "mseed",
			"vnd.fdsn.seed": [
				"seed",
				"dataless"
			],
			"vnd.flographit": "gph",
			"vnd.fluxtime.clip": "ftc",
			"vnd.framemaker": [
				"fm",
				"frame",
				"maker",
				"book"
			],
			"vnd.frogans.fnc": "fnc",
			"vnd.frogans.ltf": "ltf",
			"vnd.fsc.weblaunch": "fsc",
			"vnd.fujitsu.oasys": "oas",
			"vnd.fujitsu.oasys2": "oa2",
			"vnd.fujitsu.oasys3": "oa3",
			"vnd.fujitsu.oasysgp": "fg5",
			"vnd.fujitsu.oasysprs": "bh2",
			"vnd.fujixerox.ddd": "ddd",
			"vnd.fujixerox.docuworks": "xdw",
			"vnd.fujixerox.docuworks.binder": "xbd",
			"vnd.fuzzysheet": "fzs",
			"vnd.genomatix.tuxedo": "txd",
			"vnd.geogebra.file": "ggb",
			"vnd.geogebra.tool": "ggt",
			"vnd.geometry-explorer": [
				"gex",
				"gre"
			],
			"vnd.geonext": "gxt",
			"vnd.geoplan": "g2w",
			"vnd.geospace": "g3w",
			"vnd.gmx": "gmx",
			"vnd.grafeq": [
				"gqf",
				"gqs"
			],
			"vnd.groove-account": "gac",
			"vnd.groove-help": "ghf",
			"vnd.groove-identity-message": "gim",
			"vnd.groove-injector": "grv",
			"vnd.groove-tool-message": "gtm",
			"vnd.groove-tool-template": "tpl",
			"vnd.groove-vcard": "vcg",
			"vnd.hal+xml": "hal",
			"vnd.handheld-entertainment+xml": "zmm",
			"vnd.hbci": "hbci",
			"vnd.hhe.lesson-player": "les",
			"vnd.hp-hpgl": "hpgl",
			"vnd.hp-hpid": "hpid",
			"vnd.hp-hps": "hps",
			"vnd.hp-jlyt": "jlt",
			"vnd.hp-pcl": "pcl",
			"vnd.hp-pclxl": "pclxl",
			"vnd.hydrostatix.sof-data": "sfd-hdstx",
			"vnd.ibm.minipay": "mpy",
			"vnd.ibm.modcap": [
				"afp",
				"listafp",
				"list3820"
			],
			"vnd.ibm.rights-management": "irm",
			"vnd.ibm.secure-container": "sc",
			"vnd.iccprofile": [
				"icc",
				"icm"
			],
			"vnd.igloader": "igl",
			"vnd.immervision-ivp": "ivp",
			"vnd.immervision-ivu": "ivu",
			"vnd.insors.igm": "igm",
			"vnd.intercon.formnet": [
				"xpw",
				"xpx"
			],
			"vnd.intergeo": "i2g",
			"vnd.intu.qbo": "qbo",
			"vnd.intu.qfx": "qfx",
			"vnd.ipunplugged.rcprofile": "rcprofile",
			"vnd.irepository.package+xml": "irp",
			"vnd.is-xpr": "xpr",
			"vnd.isac.fcs": "fcs",
			"vnd.jam": "jam",
			"vnd.jcp.javame.midlet-rms": "rms",
			"vnd.jisp": "jisp",
			"vnd.joost.joda-archive": "joda",
			"vnd.kahootz": [
				"ktz",
				"ktr"
			],
			"vnd.kde.karbon": "karbon",
			"vnd.kde.kchart": "chrt",
			"vnd.kde.kformula": "kfo",
			"vnd.kde.kivio": "flw",
			"vnd.kde.kontour": "kon",
			"vnd.kde.kpresenter": [
				"kpr",
				"kpt"
			],
			"vnd.kde.kspread": "ksp",
			"vnd.kde.kword": [
				"kwd",
				"kwt"
			],
			"vnd.kenameaapp": "htke",
			"vnd.kidspiration": "kia",
			"vnd.kinar": [
				"kne",
				"knp"
			],
			"vnd.koan": [
				"skp",
				"skd",
				"skt",
				"skm"
			],
			"vnd.kodak-descriptor": "sse",
			"vnd.las.las+xml": "lasxml",
			"vnd.llamagraphics.life-balance.desktop": "lbd",
			"vnd.llamagraphics.life-balance.exchange+xml": "lbe",
			"vnd.lotus-1-2-3": "123",
			"vnd.lotus-approach": "apr",
			"vnd.lotus-freelance": "pre",
			"vnd.lotus-notes": "nsf",
			"vnd.lotus-organizer": "org",
			"vnd.lotus-screencam": "scm",
			"vnd.lotus-wordpro": "lwp",
			"vnd.macports.portpkg": "portpkg",
			"vnd.mcd": "mcd",
			"vnd.medcalcdata": "mc1",
			"vnd.mediastation.cdkey": "cdkey",
			"vnd.mfer": "mwf",
			"vnd.mfmp": "mfm",
			"vnd.micrografx.flo": "flo",
			"vnd.micrografx.igx": "igx",
			"vnd.mif": "mif",
			"vnd.mobius.daf": "daf",
			"vnd.mobius.dis": "dis",
			"vnd.mobius.mbk": "mbk",
			"vnd.mobius.mqy": "mqy",
			"vnd.mobius.msl": "msl",
			"vnd.mobius.plc": "plc",
			"vnd.mobius.txf": "txf",
			"vnd.mophun.application": "mpn",
			"vnd.mophun.certificate": "mpc",
			"vnd.ms-artgalry": "cil",
			"vnd.ms-cab-compressed": "cab",
			"vnd.ms-excel.addin.macroenabled.12": "xlam",
			"vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
			"vnd.ms-excel.sheet.macroenabled.12": "xlsm",
			"vnd.ms-excel.template.macroenabled.12": "xltm",
			"vnd.ms-fontobject": "eot",
			"vnd.ms-htmlhelp": "chm",
			"vnd.ms-ims": "ims",
			"vnd.ms-lrm": "lrm",
			"vnd.ms-officetheme": "thmx",
			"vnd.ms-powerpoint.addin.macroenabled.12": "ppam",
			"vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
			"vnd.ms-powerpoint.slide.macroenabled.12": "sldm",
			"vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
			"vnd.ms-powerpoint.template.macroenabled.12": "potm",
			"vnd.ms-project": [
				"mpp",
				"mpt"
			],
			"vnd.ms-word.document.macroenabled.12": "docm",
			"vnd.ms-word.template.macroenabled.12": "dotm",
			"vnd.ms-works": [
				"wps",
				"wks",
				"wcm",
				"wdb"
			],
			"vnd.ms-wpl": "wpl",
			"vnd.ms-xpsdocument": "xps",
			"vnd.mseq": "mseq",
			"vnd.musician": "mus",
			"vnd.muvee.style": "msty",
			"vnd.mynfc": "taglet",
			"vnd.neurolanguage.nlu": "nlu",
			"vnd.nitf": [
				"ntf",
				"nitf"
			],
			"vnd.noblenet-directory": "nnd",
			"vnd.noblenet-sealer": "nns",
			"vnd.noblenet-web": "nnw",
			"vnd.nokia.n-gage.data": "ngdat",
			"vnd.nokia.n-gage.symbian.install": "n-gage",
			"vnd.nokia.radio-preset": "rpst",
			"vnd.nokia.radio-presets": "rpss",
			"vnd.novadigm.edm": "edm",
			"vnd.novadigm.edx": "edx",
			"vnd.novadigm.ext": "ext",
			"vnd.oasis.opendocument.chart-template": "otc",
			"vnd.oasis.opendocument.formula-template": "odft",
			"vnd.oasis.opendocument.image-template": "oti",
			"vnd.olpc-sugar": "xo",
			"vnd.oma.dd2+xml": "dd2",
			"vnd.openofficeorg.extension": "oxt",
			"vnd.openxmlformats-officedocument.presentationml.slide": "sldx",
			"vnd.osgeo.mapguide.package": "mgp",
			"vnd.osgi.dp": "dp",
			"vnd.osgi.subsystem": "esa",
			"vnd.palm": [
				"pdb",
				"pqa",
				"oprc"
			],
			"vnd.pawaafile": "paw",
			"vnd.pg.format": "str",
			"vnd.pg.osasli": "ei6",
			"vnd.picsel": "efif",
			"vnd.pmi.widget": "wg",
			"vnd.pocketlearn": "plf",
			"vnd.powerbuilder6": "pbd",
			"vnd.previewsystems.box": "box",
			"vnd.proteus.magazine": "mgz",
			"vnd.publishare-delta-tree": "qps",
			"vnd.pvi.ptid1": "ptid",
			"vnd.quark.quarkxpress": [
				"qxd",
				"qxt",
				"qwd",
				"qwt",
				"qxl",
				"qxb"
			],
			"vnd.realvnc.bed": "bed",
			"vnd.recordare.musicxml": "mxl",
			"vnd.recordare.musicxml+xml": "musicxml",
			"vnd.rig.cryptonote": "cryptonote",
			"vnd.rn-realmedia": "rm",
			"vnd.rn-realmedia-vbr": "rmvb",
			"vnd.route66.link66+xml": "link66",
			"vnd.sailingtracker.track": "st",
			"vnd.seemail": "see",
			"vnd.sema": "sema",
			"vnd.semd": "semd",
			"vnd.semf": "semf",
			"vnd.shana.informed.formdata": "ifm",
			"vnd.shana.informed.formtemplate": "itp",
			"vnd.shana.informed.interchange": "iif",
			"vnd.shana.informed.package": "ipk",
			"vnd.simtech-mindmapper": [
				"twd",
				"twds"
			],
			"vnd.smart.teacher": "teacher",
			"vnd.solent.sdkm+xml": [
				"sdkm",
				"sdkd"
			],
			"vnd.spotfire.dxp": "dxp",
			"vnd.spotfire.sfs": "sfs",
			"vnd.stepmania.package": "smzip",
			"vnd.stepmania.stepchart": "sm",
			"vnd.sus-calendar": [
				"sus",
				"susp"
			],
			"vnd.svd": "svd",
			"vnd.syncml+xml": "xsm",
			"vnd.syncml.dm+wbxml": "bdm",
			"vnd.syncml.dm+xml": "xdm",
			"vnd.tao.intent-module-archive": "tao",
			"vnd.tcpdump.pcap": [
				"pcap",
				"cap",
				"dmp"
			],
			"vnd.tmobile-livetv": "tmo",
			"vnd.trid.tpt": "tpt",
			"vnd.triscape.mxs": "mxs",
			"vnd.trueapp": "tra",
			"vnd.ufdl": [
				"ufd",
				"ufdl"
			],
			"vnd.uiq.theme": "utz",
			"vnd.umajin": "umj",
			"vnd.unity": "unityweb",
			"vnd.uoml+xml": "uoml",
			"vnd.vcx": "vcx",
			"vnd.visionary": "vis",
			"vnd.vsf": "vsf",
			"vnd.webturbo": "wtb",
			"vnd.wolfram.player": "nbp",
			"vnd.wqd": "wqd",
			"vnd.wt.stf": "stf",
			"vnd.xara": "xar",
			"vnd.xfdl": "xfdl",
			"vnd.yamaha.hv-dic": "hvd",
			"vnd.yamaha.hv-script": "hvs",
			"vnd.yamaha.hv-voice": "hvp",
			"vnd.yamaha.openscoreformat": "osf",
			"vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg",
			"vnd.yamaha.smaf-audio": "saf",
			"vnd.yamaha.smaf-phrase": "spf",
			"vnd.yellowriver-custom-menu": "cmp",
			"vnd.zul": [
				"zir",
				"zirz"
			],
			"vnd.zzazz.deck+xml": "zaz",
			"voicexml+xml": "vxml",
			"widget": "wgt",
			"winhlp": "hlp",
			"wsdl+xml": "wsdl",
			"wspolicy+xml": "wspolicy",
			"x-ace-compressed": "ace",
			"x-authorware-bin": [
				"aab",
				"x32",
				"u32",
				"vox"
			],
			"x-authorware-map": "aam",
			"x-authorware-seg": "aas",
			"x-blorb": [
				"blb",
				"blorb"
			],
			"x-bzip": "bz",
			"x-bzip2": [
				"bz2",
				"boz"
			],
			"x-cfs-compressed": "cfs",
			"x-chat": "chat",
			"x-conference": "nsc",
			"x-dgc-compressed": "dgc",
			"x-dtbncx+xml": "ncx",
			"x-dtbook+xml": "dtb",
			"x-dtbresource+xml": "res",
			"x-eva": "eva",
			"x-font-bdf": "bdf",
			"x-font-ghostscript": "gsf",
			"x-font-linux-psf": "psf",
			"x-font-pcf": "pcf",
			"x-font-snf": "snf",
			"x-font-ttf": [
				"ttf",
				"ttc"
			],
			"x-font-type1": [
				"pfa",
				"pfb",
				"pfm",
				"afm"
			],
			"x-freearc": "arc",
			"x-gca-compressed": "gca",
			"x-glulx": "ulx",
			"x-gramps-xml": "gramps",
			"x-install-instructions": "install",
			"x-lzh-compressed": [
				"lzh",
				"lha"
			],
			"x-mie": "mie",
			"x-mobipocket-ebook": [
				"prc",
				"mobi"
			],
			"x-ms-application": "application",
			"x-ms-shortcut": "lnk",
			"x-ms-xbap": "xbap",
			"x-msbinder": "obd",
			"x-mscardfile": "crd",
			"x-msclip": "clp",
			"application/x-ms-installer": "msi",
			"x-msmediaview": [
				"mvb",
				"m13",
				"m14"
			],
			"x-msmetafile": [
				"wmf",
				"wmz",
				"emf",
				"emz"
			],
			"x-msmoney": "mny",
			"x-mspublisher": "pub",
			"x-msschedule": "scd",
			"x-msterminal": "trm",
			"x-mswrite": "wri",
			"x-nzb": "nzb",
			"x-pkcs12": [
				"p12",
				"pfx"
			],
			"x-pkcs7-certificates": [
				"p7b",
				"spc"
			],
			"x-research-info-systems": "ris",
			"x-silverlight-app": "xap",
			"x-sql": "sql",
			"x-stuffitx": "sitx",
			"x-subrip": "srt",
			"x-t3vm-image": "t3",
			"x-tex-tfm": "tfm",
			"x-tgif": "obj",
			"x-xliff+xml": "xlf",
			"x-xz": "xz",
			"x-zmachine": [
				"z1",
				"z2",
				"z3",
				"z4",
				"z5",
				"z6",
				"z7",
				"z8"
			],
			"xaml+xml": "xaml",
			"xcap-diff+xml": "xdf",
			"xenc+xml": "xenc",
			"xml-dtd": "dtd",
			"xop+xml": "xop",
			"xproc+xml": "xpl",
			"xslt+xml": "xslt",
			"xv+xml": [
				"mxml",
				"xhvml",
				"xvml",
				"xvm"
			],
			"yang": "yang",
			"yin+xml": "yin",
			"envoy": "evy",
			"fractals": "fif",
			"internet-property-stream": "acx",
			"olescript": "axs",
			"vnd.ms-outlook": "msg",
			"vnd.ms-pkicertstore": "sst",
			"x-compress": "z",
			"x-perfmon": [
				"pma",
				"pmc",
				"pmr",
				"pmw"
			],
			"ynd.ms-pkipko": "pko",
			"gzip": [
				"gz",
				"tgz"
			],
			"smil+xml": [
				"smi",
				"smil"
			],
			"vnd.debian.binary-package": [
				"deb",
				"udeb"
			],
			"vnd.hzn-3d-crossword": "x3d",
			"vnd.sqlite3": [
				"db",
				"sqlite",
				"sqlite3",
				"db-wal",
				"sqlite-wal",
				"db-shm",
				"sqlite-shm"
			],
			"vnd.wap.sic": "sic",
			"vnd.wap.slc": "slc",
			"x-krita": [
				"kra",
				"krz"
			],
			"x-perl": [
				"pm",
				"pl"
			],
			"yaml": [
				"yaml",
				"yml"
			]
		},
		"audio": {
			"amr": "amr",
			"amr-wb": "awb",
			"annodex": "axa",
			"basic": [
				"au",
				"snd"
			],
			"flac": "flac",
			"midi": [
				"mid",
				"midi",
				"kar",
				"rmi"
			],
			"mpeg": [
				"mpga",
				"mpega",
				"mp3",
				"m4a",
				"mp2a",
				"m2a",
				"m3a"
			],
			"mpegurl": "m3u",
			"ogg": [
				"oga",
				"ogg",
				"spx"
			],
			"prs.sid": "sid",
			"x-aiff": "aifc",
			"x-gsm": "gsm",
			"x-ms-wma": "wma",
			"x-ms-wax": "wax",
			"x-pn-realaudio": "ram",
			"x-realaudio": "ra",
			"x-sd2": "sd2",
			"adpcm": "adp",
			"mp4": "mp4a",
			"s3m": "s3m",
			"silk": "sil",
			"vnd.dece.audio": [
				"uva",
				"uvva"
			],
			"vnd.digital-winds": "eol",
			"vnd.dra": "dra",
			"vnd.dts": "dts",
			"vnd.dts.hd": "dtshd",
			"vnd.lucent.voice": "lvp",
			"vnd.ms-playready.media.pya": "pya",
			"vnd.nuera.ecelp4800": "ecelp4800",
			"vnd.nuera.ecelp7470": "ecelp7470",
			"vnd.nuera.ecelp9600": "ecelp9600",
			"vnd.rip": "rip",
			"webm": "weba",
			"x-caf": "caf",
			"x-matroska": "mka",
			"x-pn-realaudio-plugin": "rmp",
			"xm": "xm",
			"aac": "aac",
			"aiff": [
				"aiff",
				"aif",
				"aff"
			],
			"opus": "opus",
			"wav": "wav"
		},
		"chemical": {
			"x-alchemy": "alc",
			"x-cache": [
				"cac",
				"cache"
			],
			"x-cache-csf": "csf",
			"x-cactvs-binary": [
				"cbin",
				"cascii",
				"ctab"
			],
			"x-cdx": "cdx",
			"x-chem3d": "c3d",
			"x-cif": "cif",
			"x-cmdf": "cmdf",
			"x-cml": "cml",
			"x-compass": "cpa",
			"x-crossfire": "bsd",
			"x-csml": [
				"csml",
				"csm"
			],
			"x-ctx": "ctx",
			"x-cxf": [
				"cxf",
				"cef"
			],
			"x-embl-dl-nucleotide": [
				"emb",
				"embl"
			],
			"x-gamess-input": [
				"inp",
				"gam",
				"gamin"
			],
			"x-gaussian-checkpoint": [
				"fch",
				"fchk"
			],
			"x-gaussian-cube": "cub",
			"x-gaussian-input": [
				"gau",
				"gjc",
				"gjf"
			],
			"x-gaussian-log": "gal",
			"x-gcg8-sequence": "gcg",
			"x-genbank": "gen",
			"x-hin": "hin",
			"x-isostar": [
				"istr",
				"ist"
			],
			"x-jcamp-dx": [
				"jdx",
				"dx"
			],
			"x-kinemage": "kin",
			"x-macmolecule": "mcm",
			"x-macromodel-input": "mmod",
			"x-mdl-molfile": "mol",
			"x-mdl-rdfile": "rd",
			"x-mdl-rxnfile": "rxn",
			"x-mdl-sdfile": "sd",
			"x-mdl-tgf": "tgf",
			"x-mmcif": "mcif",
			"x-mol2": "mol2",
			"x-molconn-Z": "b",
			"x-mopac-graph": "gpt",
			"x-mopac-input": [
				"mop",
				"mopcrt",
				"zmt"
			],
			"x-mopac-out": "moo",
			"x-ncbi-asn1": "asn",
			"x-ncbi-asn1-ascii": [
				"prt",
				"ent"
			],
			"x-ncbi-asn1-binary": "val",
			"x-rosdal": "ros",
			"x-swissprot": "sw",
			"x-vamas-iso14976": "vms",
			"x-vmd": "vmd",
			"x-xtel": "xtel",
			"x-xyz": "xyz"
		},
		"font": {
			"otf": "otf",
			"woff": "woff",
			"woff2": "woff2"
		},
		"image": {
			"gif": "gif",
			"ief": "ief",
			"jpeg": [
				"jpeg",
				"jpg",
				"jpe",
				"jfif",
				"jfif-tbnl",
				"jif"
			],
			"pcx": "pcx",
			"png": "png",
			"svg+xml": [
				"svg",
				"svgz"
			],
			"tiff": [
				"tiff",
				"tif"
			],
			"vnd.djvu": [
				"djvu",
				"djv"
			],
			"vnd.wap.wbmp": "wbmp",
			"x-canon-cr2": "cr2",
			"x-canon-crw": "crw",
			"x-cmu-raster": "ras",
			"x-coreldraw": "cdr",
			"x-coreldrawpattern": "pat",
			"x-coreldrawtemplate": "cdt",
			"x-corelphotopaint": "cpt",
			"x-epson-erf": "erf",
			"x-icon": "ico",
			"x-jg": "art",
			"x-jng": "jng",
			"x-nikon-nef": "nef",
			"x-olympus-orf": "orf",
			"x-portable-anymap": "pnm",
			"x-portable-bitmap": "pbm",
			"x-portable-graymap": "pgm",
			"x-portable-pixmap": "ppm",
			"x-rgb": "rgb",
			"x-xbitmap": "xbm",
			"x-xpixmap": "xpm",
			"x-xwindowdump": "xwd",
			"bmp": "bmp",
			"cgm": "cgm",
			"g3fax": "g3",
			"ktx": "ktx",
			"prs.btif": "btif",
			"sgi": "sgi",
			"vnd.dece.graphic": [
				"uvi",
				"uvvi",
				"uvg",
				"uvvg"
			],
			"vnd.dwg": "dwg",
			"vnd.dxf": "dxf",
			"vnd.fastbidsheet": "fbs",
			"vnd.fpx": "fpx",
			"vnd.fst": "fst",
			"vnd.fujixerox.edmics-mmr": "mmr",
			"vnd.fujixerox.edmics-rlc": "rlc",
			"vnd.ms-modi": "mdi",
			"vnd.ms-photo": "wdp",
			"vnd.net-fpx": "npx",
			"vnd.xiff": "xif",
			"webp": "webp",
			"x-3ds": "3ds",
			"x-cmx": "cmx",
			"x-freehand": [
				"fh",
				"fhc",
				"fh4",
				"fh5",
				"fh7"
			],
			"x-pict": [
				"pic",
				"pct"
			],
			"x-tga": "tga",
			"cis-cod": "cod",
			"avif": "avifs",
			"heic": [
				"heif",
				"heic"
			],
			"pjpeg": [
				"pjpg"
			],
			"vnd.adobe.photoshop": "psd",
			"x-adobe-dng": "dng",
			"x-fuji-raf": "raf",
			"x-icns": "icns",
			"x-kodak-dcr": "dcr",
			"x-kodak-k25": "k25",
			"x-kodak-kdc": "kdc",
			"x-minolta-mrw": "mrw",
			"x-panasonic-raw": [
				"raw",
				"rw2",
				"rwl"
			],
			"x-pentax-pef": [
				"pef",
				"ptx"
			],
			"x-sigma-x3f": "x3f",
			"x-sony-arw": "arw",
			"x-sony-sr2": "sr2",
			"x-sony-srf": "srf"
		},
		"message": {
			"rfc822": [
				"eml",
				"mime",
				"mht",
				"mhtml",
				"nws"
			]
		},
		"model": {
			"iges": [
				"igs",
				"iges"
			],
			"mesh": [
				"msh",
				"mesh",
				"silo"
			],
			"vrml": [
				"wrl",
				"vrml"
			],
			"x3d+vrml": [
				"x3dv",
				"x3dvz"
			],
			"x3d+xml": "x3dz",
			"x3d+binary": [
				"x3db",
				"x3dbz"
			],
			"vnd.collada+xml": "dae",
			"vnd.dwf": "dwf",
			"vnd.gdl": "gdl",
			"vnd.gtw": "gtw",
			"vnd.mts": "mts",
			"vnd.usdz+zip": "usdz",
			"vnd.vtu": "vtu"
		},
		"text": {
			"cache-manifest": [
				"manifest",
				"appcache"
			],
			"calendar": [
				"ics",
				"icz",
				"ifb"
			],
			"css": "css",
			"csv": "csv",
			"h323": "323",
			"html": [
				"html",
				"htm",
				"shtml",
				"stm"
			],
			"iuls": "uls",
			"plain": [
				"txt",
				"text",
				"brf",
				"conf",
				"def",
				"list",
				"log",
				"in",
				"bas",
				"diff",
				"ksh"
			],
			"richtext": "rtx",
			"scriptlet": [
				"sct",
				"wsc"
			],
			"texmacs": "tm",
			"tab-separated-values": "tsv",
			"vnd.sun.j2me.app-descriptor": "jad",
			"vnd.wap.wml": "wml",
			"vnd.wap.wmlscript": "wmls",
			"x-bibtex": "bib",
			"x-boo": "boo",
			"x-c++hdr": [
				"h++",
				"hpp",
				"hxx",
				"hh"
			],
			"x-c++src": [
				"c++",
				"cpp",
				"cxx",
				"cc"
			],
			"x-component": "htc",
			"x-dsrc": "d",
			"x-diff": "patch",
			"x-haskell": "hs",
			"x-java": "java",
			"x-literate-haskell": "lhs",
			"x-moc": "moc",
			"x-pascal": [
				"p",
				"pas",
				"pp",
				"inc"
			],
			"x-pcs-gcd": "gcd",
			"x-python": "py",
			"x-scala": "scala",
			"x-setext": "etx",
			"x-tcl": [
				"tcl",
				"tk"
			],
			"x-tex": [
				"tex",
				"ltx",
				"sty",
				"cls"
			],
			"x-vcalendar": "vcs",
			"x-vcard": "vcf",
			"n3": "n3",
			"prs.lines.tag": "dsc",
			"sgml": [
				"sgml",
				"sgm"
			],
			"troff": [
				"t",
				"tr",
				"roff",
				"man",
				"me",
				"ms"
			],
			"turtle": "ttl",
			"uri-list": [
				"uri",
				"uris",
				"urls"
			],
			"vcard": "vcard",
			"vnd.curl": "curl",
			"vnd.curl.dcurl": "dcurl",
			"vnd.curl.scurl": "scurl",
			"vnd.curl.mcurl": "mcurl",
			"vnd.dvb.subtitle": "sub",
			"vnd.fly": "fly",
			"vnd.fmi.flexstor": "flx",
			"vnd.graphviz": "gv",
			"vnd.in3d.3dml": "3dml",
			"vnd.in3d.spot": "spot",
			"x-asm": [
				"s",
				"asm"
			],
			"x-c": [
				"c",
				"h",
				"dic"
			],
			"x-fortran": [
				"f",
				"for",
				"f77",
				"f90"
			],
			"x-opml": "opml",
			"x-nfo": "nfo",
			"x-sfv": "sfv",
			"x-uuencode": "uu",
			"webviewhtml": "htt",
			"javascript": "js",
			"json": "json",
			"markdown": [
				"md",
				"markdown",
				"mdown",
				"markdn"
			],
			"vnd.wap.si": "si",
			"vnd.wap.sl": "sl"
		},
		"video": {
			"avif": "avif",
			"3gpp": "3gp",
			"annodex": "axv",
			"dl": "dl",
			"dv": [
				"dif",
				"dv"
			],
			"fli": "fli",
			"gl": "gl",
			"mpeg": [
				"mpeg",
				"mpg",
				"mpe",
				"m1v",
				"m2v",
				"mp2",
				"mpa",
				"mpv2"
			],
			"mp4": [
				"mp4",
				"mp4v",
				"mpg4"
			],
			"quicktime": [
				"qt",
				"mov"
			],
			"ogg": "ogv",
			"vnd.mpegurl": [
				"mxu",
				"m4u"
			],
			"x-flv": "flv",
			"x-la-asf": [
				"lsf",
				"lsx"
			],
			"x-mng": "mng",
			"x-ms-asf": [
				"asf",
				"asx",
				"asr"
			],
			"x-ms-wm": "wm",
			"x-ms-wmv": "wmv",
			"x-ms-wmx": "wmx",
			"x-ms-wvx": "wvx",
			"x-msvideo": "avi",
			"x-sgi-movie": "movie",
			"x-matroska": [
				"mpv",
				"mkv",
				"mk3d",
				"mks"
			],
			"3gpp2": "3g2",
			"h261": "h261",
			"h263": "h263",
			"h264": "h264",
			"jpeg": "jpgv",
			"jpm": [
				"jpm",
				"jpgm"
			],
			"mj2": [
				"mj2",
				"mjp2"
			],
			"vnd.dece.hd": [
				"uvh",
				"uvvh"
			],
			"vnd.dece.mobile": [
				"uvm",
				"uvvm"
			],
			"vnd.dece.pd": [
				"uvp",
				"uvvp"
			],
			"vnd.dece.sd": [
				"uvs",
				"uvvs"
			],
			"vnd.dece.video": [
				"uvv",
				"uvvv"
			],
			"vnd.dvb.file": "dvb",
			"vnd.fvt": "fvt",
			"vnd.ms-playready.media.pyv": "pyv",
			"vnd.uvvu.mp4": [
				"uvu",
				"uvvu"
			],
			"vnd.vivo": "viv",
			"webm": "webm",
			"x-f4v": "f4v",
			"x-m4v": "m4v",
			"x-ms-vob": "vob",
			"x-smv": "smv",
			"mp2t": "ts"
		},
		"x-conference": {
			"x-cooltalk": "ice"
		},
		"x-world": {
			"x-vrml": [
				"vrm",
				"flr",
				"wrz",
				"xaf",
				"xof"
			]
		}
	};

	const mimeTypes = (() => {
		const mimeTypes = {};
		for (const type of Object.keys(table)) {
			for (const subtype of Object.keys(table[type])) {
				const value = table[type][subtype];
				if (typeof value == "string") {
					mimeTypes[value] = type + "/" + subtype;
				} else {
					for (let indexMimeType = 0; indexMimeType < value.length; indexMimeType++) {
						mimeTypes[value[indexMimeType]] = type + "/" + subtype;
					}
				}
			}
		}
		return mimeTypes;
	})();

	function getMimeType(filename) {
		return filename && mimeTypes[filename.split(".").pop().toLowerCase()] || getMimeType$1();
	}

	/*
	 Copyright (c) 2025 Gildas Lormeau. All rights reserved.

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


	t(configure);

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
	exports.ERR_EXTRAFIELD_ZIP64_NOT_FOUND = ERR_EXTRAFIELD_ZIP64_NOT_FOUND;
	exports.ERR_HTTP_RANGE = ERR_HTTP_RANGE;
	exports.ERR_INVALID_COMMENT = ERR_INVALID_COMMENT;
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
	exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
	exports.ERR_INVALID_UNCOMPRESSED_SIZE = ERR_INVALID_UNCOMPRESSED_SIZE;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_OVERLAPPING_ENTRY = ERR_OVERLAPPING_ENTRY;
	exports.ERR_SPLIT_ZIP_FILE = ERR_SPLIT_ZIP_FILE;
	exports.ERR_UNDEFINED_UNCOMPRESSED_SIZE = ERR_UNDEFINED_UNCOMPRESSED_SIZE;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
	exports.ERR_UNSUPPORTED_FORMAT = ERR_UNSUPPORTED_FORMAT;
	exports.ERR_ZIP_NOT_EMPTY = ERR_ZIP_NOT_EMPTY;
	exports.HttpRangeReader = HttpRangeReader;
	exports.HttpReader = HttpReader;
	exports.Reader = Reader;
	exports.SplitDataReader = SplitDataReader;
	exports.SplitDataWriter = SplitDataWriter;
	exports.TextReader = TextReader;
	exports.TextWriter = TextWriter;
	exports.Uint8ArrayReader = Uint8ArrayReader;
	exports.Uint8ArrayWriter = Uint8ArrayWriter;
	exports.Writer = Writer;
	exports.ZipReader = ZipReader;
	exports.ZipReaderStream = ZipReaderStream;
	exports.ZipWriter = ZipWriter;
	exports.ZipWriterStream = ZipWriterStream;
	exports.configure = configure;
	exports.fs = fs;
	exports.getMimeType = getMimeType;
	exports.terminateWorkers = terminateWorkersAndModule;

}));
