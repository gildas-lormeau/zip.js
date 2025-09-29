'use strict';

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

const BITFLAG_ENCRYPTED = 0b1;
const BITFLAG_LEVEL = 0b0110;
const BITFLAG_LEVEL_MAX_MASK = 0b010;
const BITFLAG_LEVEL_FAST_MASK = 0b100;
const BITFLAG_LEVEL_SUPER_FAST_MASK = 0b110;
const BITFLAG_DATA_DESCRIPTOR = 0b1000;
const BITFLAG_LANG_ENCODING_FLAG = 0b100000000000;
const FILE_ATTR_MSDOS_DIR_MASK = 0b10000;
const FILE_ATTR_UNIX_TYPE_MASK = 0o170000;
const FILE_ATTR_UNIX_TYPE_DIR = 0o040000;
const FILE_ATTR_UNIX_EXECUTABLE_MASK = 0o111;
const FILE_ATTR_UNIX_DEFAULT_MASK = 0o644;

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
	wasmURI: "./core/streams/zlib/zlib-streams.wasm",
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

function e(e){e({workerURI:()=>"data:text/javascript,"+encodeURIComponent('(e=>{"function"==typeof define&&define.amd?define(e):e()})(function(){"use strict";const{Array:e,Object:t,Number:r,Math:n,Error:i,Uint8Array:o,Uint16Array:f,Uint32Array:s,Int32Array:l,Map:c,DataView:a,Promise:u,TextEncoder:w,crypto:h,postMessage:d,TransformStream:p,ReadableStream:k,WritableStream:b,CompressionStream:y,DecompressionStream:m}=self,g=void 0,v="undefined",I="function",S=[];for(let e=0;256>e;e++){let t=e;for(let e=0;8>e;e++)1&t?t=t>>>1^3988292384:t>>>=1;S[e]=t}class z{constructor(e){this.t=e||-1}append(e){let t=0|this.t;for(let r=0,n=0|e.length;n>r;r++)t=t>>>8^S[255&(t^e[r])];this.t=t}get(){return~this.t}}class _ extends p{constructor(){let e;const t=new z;super({transform(e,r){t.append(e),r.enqueue(e)},flush(){const r=new o(4);new a(r.buffer).setUint32(0,t.get()),e.value=r}}),e=this}}const x={concat(e,t){if(0===e.length||0===t.length)return e.concat(t);const r=e[e.length-1],n=x.i(r);return 32===n?e.concat(t):x.o(t,n,0|r,e.slice(0,e.length-1))},l(e){const t=e.length;if(0===t)return 0;const r=e[t-1];return 32*(t-1)+x.i(r)},u(e,t){if(32*e.length<t)return e;const r=(e=e.slice(0,n.ceil(t/32))).length;return t&=31,r>0&&t&&(e[r-1]=x.h(t,e[r-1]&2147483648>>t-1,1)),e},h:(e,t,r)=>32===e?t:(r?0|t:t<<32-e)+1099511627776*e,i:e=>n.round(e/1099511627776)||32,o(e,t,r,n){for(void 0===n&&(n=[]);t>=32;t-=32)n.push(r),r=0;if(0===t)return n.concat(e);for(let i=0;i<e.length;i++)n.push(r|e[i]>>>t),r=e[i]<<32-t;const i=e.length?e[e.length-1]:0,o=x.i(i);return n.push(x.h(t+o&31,t+o>32?r:n.pop(),1)),n}},B={bytes:{p(e){const t=x.l(e)/8,r=new o(t);let n;for(let i=0;t>i;i++)3&i||(n=e[i/4]),r[i]=n>>>24,n<<=8;return r},k(e){const t=[];let r,n=0;for(r=0;r<e.length;r++)n=n<<8|e[r],3&~r||(t.push(n),n=0);return 3&r&&t.push(x.h(8*(3&r),n)),t}}},C=class{constructor(e){const t=this;t.blockSize=512,t.m=[1732584193,4023233417,2562383102,271733878,3285377520],t.v=[1518500249,1859775393,2400959708,3395469782],e?(t.I=e.I.slice(0),t.S=e.S.slice(0),t._=e._):t.reset()}reset(){const e=this;return e.I=e.m.slice(0),e.S=[],e._=0,e}update(e){const t=this;"string"==typeof e&&(e=B.B.k(e));const r=t.S=x.concat(t.S,e),n=t._,o=t._=n+x.l(e);if(o>9007199254740991)throw new i("Cannot hash more than 2^53 - 1 bits");const f=new s(r);let l=0;for(let e=t.blockSize+n-(t.blockSize+n&t.blockSize-1);o>=e;e+=t.blockSize)t.C(f.subarray(16*l,16*(l+1))),l+=1;return r.splice(0,16*l),t}A(){const e=this;let t=e.S;const r=e.I;t=x.concat(t,[x.h(1,1)]);for(let e=t.length+2;15&e;e++)t.push(0);for(t.push(n.floor(e._/4294967296)),t.push(0|e._);t.length;)e.C(t.splice(0,16));return e.reset(),r}L(e,t,r,n){return e>19?e>39?e>59?e>79?void 0:t^r^n:t&r|t&n|r&n:t^r^n:t&r|~t&n}H(e,t){return t<<e|t>>>32-e}C(t){const r=this,i=r.I,o=e(80);for(let e=0;16>e;e++)o[e]=t[e];let f=i[0],s=i[1],l=i[2],c=i[3],a=i[4];for(let e=0;79>=e;e++){16>e||(o[e]=r.H(1,o[e-3]^o[e-8]^o[e-14]^o[e-16]));const t=r.H(5,f)+r.L(e,s,l,c)+a+o[e]+r.v[n.floor(e/20)]|0;a=c,c=l,l=r.H(30,s),s=f,f=t}i[0]=i[0]+f|0,i[1]=i[1]+s|0,i[2]=i[2]+l|0,i[3]=i[3]+c|0,i[4]=i[4]+a|0}},A={getRandomValues(e){const t=new s(e.buffer),r=e=>{let t=987654321;const r=4294967295;return()=>(t=36969*(65535&t)+(t>>16)&r,(((t<<16)+(e=18e3*(65535&e)+(e>>16)&r)&r)/4294967296+.5)*(n.random()>.5?1:-1))};for(let i,o=0;o<e.length;o+=4){const e=r(4294967296*(i||n.random()));i=987654071*e(),t[o/4]=4294967296*e()|0}return e}},L={importKey:e=>new L.Z(B.bytes.k(e)),U(e,t,r,n){if(r=r||1e4,0>n||0>r)throw new i("invalid params to pbkdf2");const o=1+(n>>5)<<2;let f,s,l,c,u;const w=new ArrayBuffer(o),h=new a(w);let d=0;const p=x;for(t=B.bytes.k(t),u=1;(o||1)>d;u++){for(f=s=e.encrypt(p.concat(t,[u])),l=1;r>l;l++)for(s=e.encrypt(s),c=0;c<s.length;c++)f[c]^=s[c];for(l=0;(o||1)>d&&l<f.length;l++)h.setInt32(d,f[l]),d+=4}return w.slice(0,n/8)},Z:class{constructor(e){const t=this,r=t.V=C,n=[[],[]];t.M=[new r,new r];const i=t.M[0].blockSize/32;e.length>i&&(e=(new r).update(e).A());for(let t=0;i>t;t++)n[0][t]=909522486^e[t],n[1][t]=1549556828^e[t];t.M[0].update(n[0]),t.M[1].update(n[1]),t.P=new r(t.M[0])}reset(){const e=this;e.P=new e.V(e.M[0]),e.$=!1}update(e){this.$=!0,this.P.update(e)}digest(){const e=this,t=e.P.A(),r=new e.V(e.M[1]).update(t).A();return e.reset(),r}encrypt(e){if(this.$)throw new i("encrypt on already updated hmac called!");return this.update(e),this.digest(e)}}},H=typeof h!=v&&typeof h.getRandomValues==I,Z="Invalid password",U="Invalid signature",V="zipjs-abort-check-password";function E(e){return H?h.getRandomValues(e):A.getRandomValues(e)}const M=16,P={name:"PBKDF2"},$=t.assign({hash:{name:"HMAC"}},P),O=t.assign({iterations:1e3,hash:{name:"SHA-1"}},P),T=["deriveBits"],D=[8,12,16],R=[16,24,32],N=10,Q=[0,0,0,0],j=typeof h!=v,K=j&&h.subtle,q=j&&typeof K!=v,F=B.bytes,W=class{constructor(e){const t=this;t.O=[[[],[],[],[],[]],[[],[],[],[],[]]],t.O[0][0][0]||t.T();const r=t.O[0][4],n=t.O[1],o=e.length;let f,s,l,c=1;if(4!==o&&6!==o&&8!==o)throw new i("invalid aes key size");for(t.v=[s=e.slice(0),l=[]],f=o;4*o+28>f;f++){let e=s[f-1];(f%o===0||8===o&&f%o===4)&&(e=r[e>>>24]<<24^r[e>>16&255]<<16^r[e>>8&255]<<8^r[255&e],f%o===0&&(e=e<<8^e>>>24^c<<24,c=c<<1^283*(c>>7))),s[f]=s[f-o]^e}for(let e=0;f;e++,f--){const t=s[3&e?f:f-4];l[e]=4>=f||4>e?t:n[0][r[t>>>24]]^n[1][r[t>>16&255]]^n[2][r[t>>8&255]]^n[3][r[255&t]]}}encrypt(e){return this.D(e,0)}decrypt(e){return this.D(e,1)}T(){const e=this.O[0],t=this.O[1],r=e[4],n=t[4],i=[],o=[];let f,s,l,c;for(let e=0;256>e;e++)o[(i[e]=e<<1^283*(e>>7))^e]=e;for(let a=f=0;!r[a];a^=s||1,f=o[f]||1){let o=f^f<<1^f<<2^f<<3^f<<4;o=o>>8^255&o^99,r[a]=o,n[o]=a,c=i[l=i[s=i[a]]];let u=16843009*c^65537*l^257*s^16843008*a,w=257*i[o]^16843008*o;for(let r=0;4>r;r++)e[r][a]=w=w<<24^w>>>8,t[r][o]=u=u<<24^u>>>8}for(let r=0;5>r;r++)e[r]=e[r].slice(0),t[r]=t[r].slice(0)}D(e,t){if(4!==e.length)throw new i("invalid aes block size");const r=this.v[t],n=r.length/4-2,o=[0,0,0,0],f=this.O[t],s=f[0],l=f[1],c=f[2],a=f[3],u=f[4];let w,h,d,p=e[0]^r[0],k=e[t?3:1]^r[1],b=e[2]^r[2],y=e[t?1:3]^r[3],m=4;for(let e=0;n>e;e++)w=s[p>>>24]^l[k>>16&255]^c[b>>8&255]^a[255&y]^r[m],h=s[k>>>24]^l[b>>16&255]^c[y>>8&255]^a[255&p]^r[m+1],d=s[b>>>24]^l[y>>16&255]^c[p>>8&255]^a[255&k]^r[m+2],y=s[y>>>24]^l[p>>16&255]^c[k>>8&255]^a[255&b]^r[m+3],m+=4,p=w,k=h,b=d;for(let e=0;4>e;e++)o[t?3&-e:e]=u[p>>>24]<<24^u[k>>16&255]<<16^u[b>>8&255]<<8^u[255&y]^r[m++],w=p,p=k,k=b,b=y,y=w;return o}},X=class{constructor(e,t){this.R=e,this.N=t,this.j=t}reset(){this.j=this.N}update(e){return this.K(this.R,e,this.j)}q(e){if(255&~(e>>24))e+=1<<24;else{let t=e>>16&255,r=e>>8&255,n=255&e;255===t?(t=0,255===r?(r=0,255===n?n=0:++n):++r):++t,e=0,e+=t<<16,e+=r<<8,e+=n}return e}F(e){0===(e[0]=this.q(e[0]))&&(e[1]=this.q(e[1]))}K(e,t,r){let n;if(!(n=t.length))return[];const i=x.l(t);for(let i=0;n>i;i+=4){this.F(r);const n=e.encrypt(r);t[i]^=n[0],t[i+1]^=n[1],t[i+2]^=n[2],t[i+3]^=n[3]}return x.u(t,i)}},G=L.Z;let Y=j&&q&&typeof K.importKey==I,J=j&&q&&typeof K.deriveBits==I;class ee extends p{constructor({password:e,rawPassword:r,signed:n,encryptionStrength:f,checkPasswordOnly:s}){super({start(){t.assign(this,{ready:new u(e=>this.W=e),password:ie(e,r),signed:n,X:f-1,pending:new o})},async transform(e,t){const r=this,{password:n,X:f,W:l,ready:c}=r;n?(await(async(e,t,r,n)=>{const o=await ne(e,t,r,fe(n,0,D[t])),f=fe(n,D[t]);if(o[0]!=f[0]||o[1]!=f[1])throw new i(Z)})(r,f,n,fe(e,0,D[f]+2)),e=fe(e,D[f]+2),s?t.error(new i(V)):l()):await c;const a=new o(e.length-N-(e.length-N)%M);t.enqueue(re(r,e,a,0,N,!0))},async flush(e){const{signed:t,G:r,Y:n,pending:f,ready:s}=this;if(n&&r){await s;const l=fe(f,0,f.length-N),c=fe(f,f.length-N);let a=new o;if(l.length){const e=le(F,l);n.update(e);const t=r.update(e);a=se(F,t)}if(t){const e=fe(se(F,n.digest()),0,N);for(let t=0;N>t;t++)if(e[t]!=c[t])throw new i(U)}e.enqueue(a)}}})}}class te extends p{constructor({password:e,rawPassword:r,encryptionStrength:n}){let i;super({start(){t.assign(this,{ready:new u(e=>this.W=e),password:ie(e,r),X:n-1,pending:new o})},async transform(e,t){const r=this,{password:n,X:i,W:f,ready:s}=r;let l=new o;n?(l=await(async(e,t,r)=>{const n=E(new o(D[t]));return oe(n,await ne(e,t,r,n))})(r,i,n),f()):await s;const c=new o(l.length+e.length-e.length%M);c.set(l,0),t.enqueue(re(r,e,c,l.length,0))},async flush(e){const{G:t,Y:r,pending:n,ready:f}=this;if(r&&t){await f;let s=new o;if(n.length){const e=t.update(le(F,n));r.update(e),s=se(F,e)}i.signature=se(F,r.digest()).slice(0,N),e.enqueue(oe(s,i.signature))}}}),i=this}}function re(e,t,r,n,i,f){const{G:s,Y:l,pending:c}=e,a=t.length-i;let u;for(c.length&&(t=oe(c,t),r=((e,t)=>{if(t&&t>e.length){const r=e;(e=new o(t)).set(r,0)}return e})(r,a-a%M)),u=0;a-M>=u;u+=M){const e=le(F,fe(t,u,u+M));f&&l.update(e);const i=s.update(e);f||l.update(i),r.set(se(F,i),u+n)}return e.pending=fe(t,u),r}async function ne(r,n,i,f){r.password=null;const s=await(async(e,t,r,n,i)=>{if(!Y)return L.importKey(t);try{return await K.importKey("raw",t,r,!1,i)}catch{return Y=!1,L.importKey(t)}})(0,i,$,0,T),l=await(async(e,t,r)=>{if(!J)return L.U(t,e.salt,O.iterations,r);try{return await K.deriveBits(e,t,r)}catch{return J=!1,L.U(t,e.salt,O.iterations,r)}})(t.assign({salt:f},O),s,8*(2*R[n]+2)),c=new o(l),a=le(F,fe(c,0,R[n])),u=le(F,fe(c,R[n],2*R[n])),w=fe(c,2*R[n]);return t.assign(r,{keys:{key:a,J:u,passwordVerification:w},G:new X(new W(a),e.from(Q)),Y:new G(u)}),w}function ie(e,t){return t===g?(e=>{if(typeof w==v){const t=new o((e=unescape(encodeURIComponent(e))).length);for(let r=0;r<t.length;r++)t[r]=e.charCodeAt(r);return t}return(new w).encode(e)})(e):t}function oe(e,t){let r=e;return e.length+t.length&&(r=new o(e.length+t.length),r.set(e,0),r.set(t,e.length)),r}function fe(e,t,r){return e.subarray(t,r)}function se(e,t){return e.p(t)}function le(e,t){return e.k(t)}class ce extends p{constructor({password:e,passwordVerification:r,checkPasswordOnly:n}){super({start(){t.assign(this,{password:e,passwordVerification:r}),he(this,e)},transform(e,t){const r=this;if(r.password){const t=ue(r,e.subarray(0,12));if(r.password=null,t.at(-1)!=r.passwordVerification)throw new i(Z);e=e.subarray(12)}n?t.error(new i(V)):t.enqueue(ue(r,e))}})}}class ae extends p{constructor({password:e,passwordVerification:r}){super({start(){t.assign(this,{password:e,passwordVerification:r}),he(this,e)},transform(e,t){const r=this;let n,i;if(r.password){r.password=null;const t=E(new o(12));t[11]=r.passwordVerification,n=new o(e.length+t.length),n.set(we(r,t),0),i=12}else n=new o(e.length),i=0;n.set(we(r,e),i),t.enqueue(n)}})}}function ue(e,t){const r=new o(t.length);for(let n=0;n<t.length;n++)r[n]=pe(e)^t[n],de(e,r[n]);return r}function we(e,t){const r=new o(t.length);for(let n=0;n<t.length;n++)r[n]=pe(e)^t[n],de(e,t[n]);return r}function he(e,r){const n=[305419896,591751049,878082192];t.assign(e,{keys:n,ee:new z(n[0]),te:new z(n[2])});for(let t=0;t<r.length;t++)de(e,r.charCodeAt(t))}function de(e,t){let[r,i,o]=e.keys;e.ee.append([t]),r=~e.ee.get(),i=be(n.imul(be(i+ke(r)),134775813)+1),e.te.append([i>>>24]),o=~e.te.get(),e.keys=[r,i,o]}function pe(e){const t=2|e.keys[2];return ke(n.imul(t,1^t)>>>8)}function ke(e){return 255&e}function be(e){return 4294967295&e}class ye extends p{constructor(e,{chunkSize:t,re:r,CompressionStream:n}){super({});const{compressed:i,encrypted:o,useCompressionStream:f,zipCrypto:s,signed:l,level:c}=e,u=this;let w,h,d=super.readable;o&&!s||!l||(w=new _,d=Ie(d,w)),i&&(d=ve(d,f,{level:c,chunkSize:t},n,r,n)),o&&(s?d=Ie(d,new ae(e)):(h=new te(e),d=Ie(d,h))),ge(u,d,()=>{let e;o&&!s&&(e=h.signature),o&&!s||!l||(e=new a(w.value.buffer).getUint32(0)),u.signature=e})}}class me extends p{constructor(e,{chunkSize:t,ne:r,DecompressionStream:n}){super({});const{zipCrypto:o,encrypted:f,signed:s,signature:l,compressed:c,useCompressionStream:u,ie:w}=e;let h,d,p=super.readable;f&&(o?p=Ie(p,new ce(e)):(d=new ee(e),p=Ie(p,d))),c&&(p=ve(p,u,{chunkSize:t,ie:w},n,r,n)),f&&!o||!s||(h=new _,p=Ie(p,h)),ge(this,p,()=>{if((!f||o)&&s){const e=new a(h.value.buffer);if(l!=e.getUint32(0,!1))throw new i(U)}})}}function ge(e,r,n){r=Ie(r,new p({flush:n})),t.defineProperty(e,"readable",{get:()=>r})}function ve(e,t,r,n,i,o){const f=t&&n?n:i||o,s=r.ie?"deflate64-raw":"deflate-raw";try{e=Ie(e,new f(s,r))}catch(n){if(!t)throw n;if(i)e=Ie(e,new i(s,r));else{if(!o)throw n;e=Ie(e,new o(s,r))}}return e}function Ie(e,t){return e.pipeThrough(t)}const Se="data",ze="close";class _e extends p{constructor(e,r){super({});const n=this,{codecType:o}=e;let f;o.startsWith("deflate")?f=ye:o.startsWith("inflate")&&(f=me),n.outputSize=0;let s=0;const l=new f(e,r),c=super.readable,a=new p({transform(e,t){e&&e.length&&(s+=e.length,t.enqueue(e))},flush(){t.assign(n,{inputSize:s})}}),u=new p({transform(t,r){if(t&&t.length&&(r.enqueue(t),n.outputSize+=t.length,e.outputSize!==g&&n.outputSize>e.outputSize))throw new i("Invalid uncompressed size")},flush(){const{signature:e}=l;t.assign(n,{signature:e,inputSize:s})}});t.defineProperty(n,"readable",{get:()=>c.pipeThrough(a).pipeThrough(l).pipeThrough(u)})}}class xe extends p{constructor(e){let t;super({transform:function r(n,i){if(t){const e=new o(t.length+n.length);e.set(t),e.set(n,t.length),n=e,t=null}n.length>e?(i.enqueue(n.slice(0,e)),r(n.slice(e),i)):t=n},flush(e){t&&t.length&&e.enqueue(t)}})}}const Be=new c,Ce=new c;let Ae,Le=0;async function He(e){try{const{options:t,config:n}=e;if(!t.useCompressionStream)try{await self.initModule(e.config)}catch{t.useCompressionStream=!0}n.CompressionStream=self.CompressionStream,n.DecompressionStream=self.DecompressionStream;const i={highWaterMark:1},o=e.readable||new k({async pull(e){const t=new u(e=>Be.set(Le,e));Ze({type:"pull",messageId:Le}),Le=(Le+1)%r.MAX_SAFE_INTEGER;const{value:n,done:i}=await t;e.enqueue(n),i&&e.close()}},i),f=e.writable||new b({async write(e){let t;const n=new u(e=>t=e);Ce.set(Le,t),Ze({type:Se,value:e,messageId:Le}),Le=(Le+1)%r.MAX_SAFE_INTEGER,await n}},i),s=new _e(t,n);Ae=new AbortController;const{signal:l}=Ae;await o.pipeThrough(s).pipeThrough(new xe(n.chunkSize)).pipeTo(f,{signal:l,preventClose:!0,preventAbort:!0}),await f.getWriter().close();const{signature:c,inputSize:a,outputSize:w}=s;Ze({type:ze,result:{signature:c,inputSize:a,outputSize:w}})}catch(e){e.outputSize=0,Ue(e)}}function Ze(e){let{value:t}=e;if(t)if(t.length)try{t=new o(t),e.value=t.buffer,d(e,[e.value])}catch{d(e)}else d(e);else d(e)}function Ue(e=new i("Unknown error")){const{message:t,stack:r,code:n,name:o,outputSize:f}=e;d({error:{message:t,stack:r,code:n,name:o,outputSize:f}})}addEventListener("message",({data:e})=>{const{type:t,messageId:r,value:n,done:i}=e;try{if("start"==t&&He(e),t==Se){const e=Be.get(r);Be.delete(r),e({value:new o(n),done:i})}if("ack"==t){const e=Ce.get(r);Ce.delete(r),e()}t==ze&&Ae.abort()}catch(e){Ue(e)}});var{Uint8Array:Ve,Uint16Array:Ee,Int32Array:Me,TransformStream:Pe,Math:$e,Error:Oe,Array:Te}=globalThis,De=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],Re=new Ve(0),Ne=new Ee(0),Qe=class{constructor(e,t){this.oe=e,this.fe=t,this.se=0}},je=class{constructor(e,t,r,n,i){this.le=e,this.ce=t,this.ae=r,this.ue=n,this.we=i}};function Ke(e,t,r,n,i){if(0==i)return;let o=e instanceof Ve?e:new Ve(e.buffer,e.byteOffset,e.byteLength),f=r instanceof Ve?r.subarray(n,n+i):new Ve(r.buffer,r.byteOffset+n,i);o.set(f,t)}function qe(e,t,r){0!=r&&(e instanceof Ve?e:new Ve(e.buffer,e.byteOffset,e.byteLength)).fill(0,t,t+r)}function Fe(){return{he:Re,de:0,pe:0,ke:0,be:Re,ye:0,me:0,ge:0,ve:"",Ie:0,Se:0,ze:0,_e:void 0}}function We(e,t){let r=1<<t;return{xe:e,Be:new Ve(r),Ce:r,Ae:t,Le:0,He:0,Ze:0,Ue:0}}function Xe(e){return St[-6>e||e>2?9:2-e]||""}function Ge(e,t){try{e.ve=Xe(t)}catch(r){e.ve="zlib error "+t+" ("+r+")"}return t}function Ye(e,t){let r=e>>>0,n=0;for(let e=0;t>e;e++)n=n<<1|1&r,r>>>=1;return n}function Je(e,t){e.Ve[e.Ee++]=t}function et(e,t){Je(e,255&t),Je(e,t>>>8&255)}function tt(e,t,r){let n=255&r,i=65535&t,o=e.Me+e.Pe;return e.Ve[o]=255&i,e.Ve[o+1]=i>>>8&255,e.Ve[o+2]=n,e.Pe+=3,i=i-1&65535,e.Oe[Vt[n]+pt+1].$e++,e.Te[it(i)].$e++,e.Pe==e.De}function rt(e,t){let r=255&t,n=e.Me+e.Pe;return e.Ve[n]=0,e.Ve[n+1]=0,e.Ve[n+2]=r,e.Pe+=3,e.Oe[r].$e++,e.Pe==e.De}function nt(e){return e.Ce-ht}function it(e){return 256>e?Et[e]:Et[256+(e>>7)]}function ot(e){let t=at+7,r=1<<t,n=(1<<t)-1,i=$e.floor((t+ut-1)/ut),o=1<<8+at;return{...We(e,15),xe:e,Re:42,Ne:0,Qe:void 0,je:32767,Ke:t,qe:r,Fe:n,We:i,Xe:new Ee(32768),Ge:new Ee(r),Ye:o,Ve:new Ve(32768),Je:0,et:32768,Ee:0,tt:0,rt:0,nt:0,it:0,ot:0,ft:-2,st:0,lt:0,ct:0,ut:0,wt:0,ht:0,dt:0,kt:0,bt:0,yt:0,gt:0,vt:0,It:0,St:0,zt:new Me(2*kt+1),_t:new Ve(2*kt+1),xt:new Ee(gt+1),Pe:0,De:0,Bt:Re,Me:0,Ct:0,At:0,Lt:8,Ht:32768,Zt:0,Ut:0,Vt:0,Oe:new Te(mt).fill(0).map(()=>({$e:0,Et:0,Mt:0,Pt:0})),Te:new Te(2*bt+1).fill(0).map(()=>({$e:0,Et:0,Mt:0,Pt:0})),$t:new Te(2*yt+1).fill(0).map(()=>({$e:0,Et:0,Mt:0,Pt:0})),Ot:lt(),Tt:lt(),Dt:lt()}}function ft(e){let t=[];for(let r=0;r<e.length;r+=2){let n=e[r],i=e[r+1],o=st();o.Et=n,o.Pt=i,t.push(o)}return t}function st(){return{$e:0,Et:0,Mt:0,Pt:0}}function lt(){return new Qe([],new je(null,Re,0,0,0))}function ct(e){let{code:t,length:r}=(e=>{let t=$e.max(...e),r=new Te(t+1).fill(0);for(let t of e)t>0&&r[t]++;let n=new Te(e.length).fill(0),i=new Te(t+1).fill(0),o=0;for(let e=1;t>=e;e++)o=o+r[e-1]<<1,i[e]=o;for(let t=0;t<e.length;t++){let r=e[t];0!=r&&(n[t]=i[r]++)}return{code:n,length:e}})(e),n=new Te(2*e.length),i=0;for(let o=0;o<e.length;o++){let e=r[o]||0,f=t[o]||0;n[i++]=e?Ye(f,e):0,n[i++]=e}return new Me(n)}var at=8,ut=3,wt=258,ht=wt+ut+1,dt=wt,pt=256,kt=pt+1+29,bt=30,yt=19,mt=2*kt+1,gt=15,vt=256,It=-1,St=["need dictionary","stream end","","file error","stream error","data error","insufficient memory","buffer error",""],zt=new Me([0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0]),_t=new Me([0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576]),xt=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],Bt=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],Ct=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],At=((e,t)=>{let r=0;for(let n=0;n<e.length;n++){let i=t[n]?1<<t[n]:1,o=e[n]+i-1;o>r&&(r=o)}let n=new Ve(r+1);for(let i=0;r>=i;i++)for(let r=0;r<e.length;r++){let o=t[r]?1<<t[r]:1,f=e[r];if(i>=f&&f+o-1>=i){n[i]=r;break}}return n})(_t,Bt),Lt=ct((()=>{let e=new Te(288).fill(0);for(let t=0;143>=t;t++)e[t]=8;for(let t=144;255>=t;t++)e[t]=9;for(let t=256;279>=t;t++)e[t]=7;for(let t=280;287>=t;t++)e[t]=8;return e})()),Ht=ct(new Te(30).fill(5)),Zt=ft(Lt),Ut=ft(Ht),Vt=((e,t)=>{let r=0;for(let n=0;n<e.length;n++){let i=t[n]?1<<t[n]:1,o=e[n]+i-1;o>r&&(r=o)}258>r&&(r=258);let n=new Ve(r+1);for(let i=0;r>=i;i++)for(let r=0;r<e.length;r++){let o=t[r]?1<<t[r]:1,f=e[r];if(i>=f&&f+o-1>=i){n[i]=r;break}}return n})(zt,xt),Et=(e=>{let t=new Ve(512),r=e.length-1;for(let n=0;256>n;n++)t[n]=n>r?e[r]:e[n];for(let n=256;r>=n;n++){let r=n>>7;t[256+(r>255?255:r)]=e[n]}for(let e=257;512>e;e++)0==t[e]&&(t[e]=t[e-1]);return t})(At);function Mt(e){return e%65521>>>0}function Pt(e,t,r){if(void 0===t||void 0===r)return 1;let n=e>>>16&65535;if(e&=65535,1==r)return(e+=t[0])>=65521&&(e-=65521),n+=e,n>=65521&&(n-=65521),(n<<16|e)>>>0;if(16>r){for(let i=0;r>i;i++)n+=e+=t[i];return e>=65521&&(e-=65521),n=Mt(n),(n<<16|e)>>>0}for(;r>=5552;){r-=5552;let i=$e.floor(347);do{for(let r=0;16>r;r++)n+=e+=t[r];t=t.subarray(16)}while(--i);e=Mt(e),n=Mt(n)}if(r){for(;r>=16;){r-=16;for(let r=0;16>r;r++)n+=e+=t[r];t=t.subarray(16)}for(let i=0;r>i;i++)n+=e+=t[i];e=Mt(e),n=Mt(n)}return(n<<16|e)>>>0}var $t=(()=>{let e=new Te(256);for(let t=0;256>t;t++){let r=t;for(let e=0;8>e;e++)r=1&r?3988292384^r>>>1:r>>>1;e[t]=r>>>0}return e})();function Ot(e=0,t,r){if(!t)return 0;void 0===r&&(r=t.length),r=$e.min(r,t.length),e=~e>>>0;for(let n=0;r>n;n++)e=e>>>8^$t[255&(e^t[n])];return(4294967295^e)>>>0}function Tt(e){16==e.Ue?(et(e,e.Ze),e.Ze=0,e.Ue=0):e.Ue>=8&&(Je(e,e.Ze),e.Ze>>=8,e.Ue-=8)}function Dt(e){e.Ue>8?et(e,e.Ze):e.Ue>0&&Je(e,e.Ze),e.Ct=1+(e.Ue-1&7),e.Ze=0,e.Ue=0}function Rt(e,t,r){e.Ue>16-r?(e.Ze=65535&(e.Ze|t<<e.Ue),et(e,e.Ze),e.Ze=t>>16-e.Ue&65535,e.Ue+=r-16):(e.Ze=65535&(e.Ze|t<<e.Ue),e.Ue+=r)}function Nt(e){for(let t=0;t<e.Oe.length;t++)e.Oe[t].$e=0;for(let t=0;t<e.Te.length;t++)e.Te[t].$e=0;for(let t=0;t<e.$t.length;t++)e.$t[t].$e=0;e.Oe[vt].$e=1,e.rt=e.nt=0,e.Pe=e.it=0}function Qt(e,t,r){return r=e.zt[1],e.zt[1]=e.zt[e.Ut--],Kt(e,t,1),r}function jt(e,t,r,n){return e[t].$e<e[r].$e||e[t].$e==e[r].$e&&n[t]<=n[r]}function Kt(e,t,r){let n=e.zt[r],i=r<<1;for(;i<=e.Ut&&(i<e.Ut&&jt(t,e.zt[i+1],e.zt[i],e._t)&&i++,!jt(t,n,e.zt[i],e._t));)e.zt[r]=e.zt[i],r=i,i<<=1;e.zt[r]=n}function qt(e,t){let r,n,i,o=t.oe,f=t.fe.le,s=t.fe.ue,l=-1;for(e.Ut=0,e.Vt=mt,r=0;s>r;r++)0!=o[r].$e?(e.zt[++e.Ut]=l=r,e._t[r]=0):o[r].Pt=0;for(;2>e.Ut;)i=e.zt[++e.Ut]=2>l?++l:0,o[i].$e=1,e._t[i]=0,e.rt--,f&&(e.nt-=f[i].Pt);for(t.se=l,r=$e.floor(e.Ut/2);r>=1;r--)Kt(e,o,r);i=s;do{r=Qt(e,o,r),n=e.zt[1],e.zt[--e.Vt]=r,e.zt[--e.Vt]=n,o[i].$e=o[r].$e+o[n].$e,e._t[i]=(e._t[r]<e._t[n]?e._t[n]:e._t[r])+1,o[r].Mt=o[n].Mt=i,e.zt[1]=i++,Kt(e,o,1)}while(e.Ut>=2);e.zt[--e.Vt]=e.zt[1],((e,t)=>{let r,n,i,o,f,s,l=t.oe,c=t.se,a=t.fe.le,u=t.fe.ce,w=t.fe.ae,h=t.fe.we,d=0;for(o=0;gt>=o;o++)e.xt[o]=0;for(l[e.zt[e.Vt]].Pt=0,r=e.Vt+1;mt>r;r++)n=e.zt[r],o=l[l[n].Mt].Pt+1,o>h&&(o=h,d++),l[n].Pt=o,c>=n&&(e.xt[o]++,f=0,n>=w&&(f=u[n-w]),s=l[n].$e,e.rt+=s*(o+f),a&&(e.nt+=s*(a[n].Pt+f)));if(0!=d){do{for(o=h-1;0==e.xt[o];)o--;e.xt[o]--,e.xt[o+1]+=2,e.xt[h]--,d-=2}while(d>0);for(o=h;0!=o;o--)for(n=e.xt[o];0!=n;)i=e.zt[--r],c>=i&&(l[i].Pt!=o&&(e.rt+=(o-l[i].Pt)*l[i].$e,l[i].Pt=o),n--)}})(e,t),((e,t,r)=>{let n,i,o=[],f=0;for(n=1;gt>=n;n++)f=f+r[n-1]<<1,o[n]=f;for(i=0;t>=i;i++){let t=e[i].Pt;0!=t&&(e[i].Et=Ye(o[t]++,t))}})(o,t.se,e.xt)}function Ft(e,t,r){let n,i,o=-1,f=t[0].Pt,s=0,l=7,c=4;for(0==f&&(l=138,c=3),t[r+1].Pt=65535,n=0;r>=n;n++)i=f,f=t[n+1].Pt,(++s>=l||i!=f)&&(c>s?e.$t[i].$e+=s:0!=i?(i!=o&&e.$t[i].$e++,e.$t[16].$e++):s>10?e.$t[18].$e++:e.$t[17].$e++,s=0,o=i,0==f?(l=138,c=3):i==f?(l=6,c=3):(l=7,c=4))}function Wt(e,t,r){let n,i=-1,o=t[0].Pt,f=0,s=7,l=4;0==o&&(s=138,l=3);for(let c=0;r>=c;c++)if(n=o,o=t[c+1].Pt,++f>=s||n!=o){if(l>f)do{Rt(e,e.$t[n].Et,e.$t[n].Pt)}while(0!=--f);else 0!=n?(n!=i&&(Rt(e,e.$t[n].Et,e.$t[n].Pt),f--),Rt(e,e.$t[16].Et,e.$t[16].Pt),Rt(e,f-3,2)):f>10?(Rt(e,e.$t[18].Et,e.$t[18].Pt),Rt(e,f-11,7)):(Rt(e,e.$t[17].Et,e.$t[17].Pt),Rt(e,f-3,3));f=0,i=n,0==o?(s=138,l=3):n==o?(s=6,l=3):(s=7,l=4)}}function Xt(e,t,r,n,i=0){Rt(e,0+n,3),Dt(e),et(e,r),et(e,~r),r&&t&&Ke(e.Ve,e.Ee,t,i,r),e.Ee+=r}function Gt(e,t,r){let n,i,o,f,s=0;if(0!=e.Pe)do{n=255&e.Bt[s],n+=(255&e.Bt[s+1])<<8,i=e.Bt[s+2],s+=3,0==n?Rt(e,t[i].Et,t[i].Pt):(o=Vt[i],Rt(e,t[o+pt+1].Et,t[o+pt+1].Pt),f=xt[o],0!=f&&(i-=zt[o],Rt(e,i,f)),n--,o=it(n),Rt(e,r[o].Et,r[o].Pt),f=Bt[o],0!=f&&(n-=_t[o],Rt(e,n,f)))}while(s<e.Pe);Rt(e,t[vt].Et,t[vt].Pt)}var Yt=[{Rt:br,Nt:0,Qt:0,jt:0,Kt:0},{Rt:yr,Nt:4,Qt:4,jt:8,Kt:4},{Rt:yr,Nt:5,Qt:5,jt:16,Kt:8},{Rt:yr,Nt:6,Qt:16,jt:32,Kt:32},{Rt:mr,Nt:4,Qt:4,jt:16,Kt:16},{Rt:mr,Nt:16,Qt:8,jt:16,Kt:32},{Rt:mr,Nt:16,Qt:16,jt:32,Kt:128},{Rt:mr,Nt:32,Qt:32,jt:128,Kt:256},{Rt:mr,Nt:128,Qt:128,jt:256,Kt:1024},{Rt:mr,Nt:258,Qt:258,jt:258,Kt:4096}];function Jt(e){return 2*e-(e>4?9:0)}function er(e,t,r){return((t<<e.We^r)&e.Fe)>>>0}function tr(e,t){e.kt=er(e,e.kt,e.Be[t+(ut-1)]);let r=e.Xe[t&e.je]=e.Ge[e.kt];return e.Ge[e.kt]=t,r}function rr(e){e.Ge[e.qe-1]=0,qe(e.Ge,0,(e.qe-1)*e.Ge.BYTES_PER_ELEMENT)}function nr(e){let t,r,n=e.Ce;for(t=e.qe;t>0;)t--,r=e.Ge[t],e.Ge[t]=n>r?0:r-n;for(t=n;t>0;)t--,r=e.Xe[t],e.Xe[t]=n>r?0:r-n}function ir(e,t,r,n){let i=e.pe;return i>n&&(i=n),0==i?0:(e.pe-=i,Ke(t,r,e.he,e.de,i),1==e._e.Ne?e.Se=Pt(e.Se,new Ve(t.buffer,t.byteOffset+r,i),i):2==e._e.Ne&&(e.Se=Ot(e.Se,new Ve(t.buffer,t.byteOffset+r,i),i)),e.de+=i,e.ke+=i,i)}function or(e){let t,r,n=e.Ce;do{if(r=e.Ht-e.ct-e.lt,0==r&&0==e.lt&&0==e.ct?r=n:-1==r&&r--,e.lt>=n+nt(e)&&(Ke(e.Be,0,e.Be,n,n-r),e.Zt-=n,e.lt-=n,e.st-=n,e.ot>e.lt&&(e.ot=e.lt),nr(e),r+=n),0==e.xe.pe)break;if(t=ir(e.xe,e.Be,e.lt+e.ct,r),e.ct+=t,e.ct+e.ot>=ut){let t=e.lt-e.ot;for(e.kt=e.Be[t],e.kt=er(e,e.kt,e.Be[t+1]);e.ot&&(e.kt=er(e,e.kt,e.Be[t+ut-1]),e.Xe[t&e.je]=e.Ge[e.kt],e.Ge[e.kt]=t,t++,e.ot--,e.ct+e.ot>=ut););}}while(e.ct<ht&&0!=e.xe.pe);if(e.Le<e.Ht){let t,r=e.lt+e.ct;e.Le<r?(t=e.Ht-r,t>dt&&(t=dt),qe(e.Be,r,t),e.Le=r+t):e.Le<r+dt&&(t=r+dt-e.Le,t>e.Ht-e.Le&&(t=e.Ht-e.Le),qe(e.Be,e.Le,t),e.Le+=t)}}function fr(e){if(null==e)return!0;let t=e._e;return!t||t.xe!=e||42!=t.Re&&57!=t.Re&&69!=t.Re&&73!=t.Re&&91!=t.Re&&103!=t.Re&&113!=t.Re&&666!=t.Re}function sr(e,t){Je(e,t>>8),Je(e,255&t)}function lr(e){let t,r=e._e;(e=>{Tt(e)})(r),t=r.Ee,t>e.me&&(t=e.me),0!=t&&(Ke(e.be,e.ye,r.Ve,r.tt,t),e.ye+=t,r.tt+=t,e.ge+=t,e.me-=t,r.Ee-=t,0==r.Ee&&(r.tt=r.Je))}function cr(e,t){let r=e._e;r.Qe&&r.Qe.qt&&(e.Se=Ot(e.Se,new Ve(r.Ve.buffer,r.Je+t,r.Ee-t),r.Ee-t))}function ar(e,t){let r,n=e._e;if(fr(e)||t>5||0>t)return Ge(e,-2);if(!e.be||0!=e.pe&&!e.he||666==n.Re&&4!=t)return Ge(e,-2);if(0==e.me)return Ge(e,-5);if(r=n.ft,n.ft=t,0!=n.Ee){if(lr(e),0==e.me)return n.ft=It,0}else if(0==e.pe&&Jt(t)<=Jt(r)&&4!=t)return Ge(e,-5);if(666==n.Re&&0!=e.pe)return Ge(e,-5);if(42==n.Re&&0==n.Ne&&(n.Re=113),42==n.Re){let t,r=8+(n.Ae-8<<4)<<8;if(t=n.yt>=2||2>n.bt?0:6>n.bt?1:6==n.bt?2:3,r|=t<<6,0!=n.lt&&(r|=32),r+=31-r%31,sr(n,r),0!=n.lt&&(sr(n,e.Se>>16),sr(n,65535&e.Se)),e.Se=1,n.Re=113,lr(e),0!=n.Ee)return n.ft=It,0}if(57==n.Re)if(e.Se=Ot(0),Je(n,31),Je(n,139),Je(n,8),n.Qe)Je(n,(n.Qe.Ft?1:0)+(n.Qe.qt?2:0)+(null==n.Qe.Wt?0:4)+(null==n.Qe.Xt?0:8)+(null==n.Qe.Gt?0:16)),Je(n,255&n.Qe.Yt),Je(n,n.Qe.Yt>>>8&255),Je(n,n.Qe.Yt>>>16&255),Je(n,n.Qe.Yt>>>24&255),Je(n,9==n.bt?2:n.yt>=2||2>n.bt?4:0),Je(n,255&n.Qe.Jt),null!=n.Qe.Wt&&(Je(n,255&n.Qe.er),Je(n,n.Qe.er>>>8&255)),n.Qe.qt&&(e.Se=Ot(e.Se,n.Ve,n.Ee)),n.At=0,n.Re=69;else if(Je(n,0),Je(n,0),Je(n,0),Je(n,0),Je(n,0),Je(n,9==n.bt?2:n.yt>=2||2>n.bt?4:0),Je(n,255),n.Re=113,lr(e),0!=n.Ee)return n.ft=It,0;if(69==n.Re){if(n.Qe&&null!=n.Qe.Wt){let t=n.Ee,r=(65535&n.Qe.er)-n.At;for(;n.Ee+r>n.et;){let i=n.et-n.Ee;if(Ke(n.Ve,n.Ee,n.Qe.Wt,n.At,i),n.Ee=n.et,cr(e,t),n.At+=i,lr(e),0!=n.Ee)return n.ft=It,0;t=0,r-=i}Ke(n.Ve,n.Ee,n.Qe.Wt,n.At,r),n.Ee+=r,cr(e,t),n.At=0}n.Re=73}if(73==n.Re){if(n.Qe&&n.Qe.Xt&&n.Qe.Xt.length){let t,r=n.Ee;do{if(n.Ee==n.et){if(cr(e,r),lr(e),0!=n.Ee)return n.ft=It,0;r=0}t=n.Qe.Xt[n.At++],Je(n,t)}while(0!=t);cr(e,r),n.At=0}n.Re=91}if(91==n.Re){if(n.Qe&&n.Qe.Gt&&n.Qe.Gt.length){let t,r=n.Ee;do{if(n.Ee==n.et){if(cr(e,r),lr(e),0!=n.Ee)return n.ft=It,0;r=0}t=n.Qe.Gt[n.At++],Je(n,t)}while(0!=t);cr(e,r)}n.Re=103}if(103==n.Re){if(n.Qe&&n.Qe.qt){if(n.Ee+2>n.et&&(lr(e),0!=n.Ee))return n.ft=It,0;Je(n,255&e.Se),Je(n,e.Se>>>8&255),e.Se=Ot(0)}if(n.Re=113,lr(e),0!=n.Ee)return n.ft=It,0}if(0!=e.pe||0!=n.ct||0!=t&&666!=n.Re){let r=0==n.bt?br(n,t):2==n.yt?((e,t)=>{let r=!1;for(;;){if(0==e.ct&&(or(e),0==e.ct)){if(0==t)return 0;break}if(e.ut=0,r=rt(e,e.Be[e.lt]),e.ct--,e.lt++,r){let t=dr(e,!1);if(null!=t)return t}}if(e.ot=0,4==t)return dr(e,!0)??3;if(e.Pe){let t=dr(e,!1);if(null!=t)return t}return 1})(n,t):3==n.yt?((e,t)=>{let r,n,i,o;for(;;){if(e.ct<=wt){if(or(e),e.ct<=wt&&0==t)return 0;if(0==e.ct)break}if(e.ut=0,e.ct>=ut&&e.lt>0&&(i=e.lt-1,n=e.Be[i],n==++i&&n==++i&&n==++i)){o=e.lt+wt;do{}while(n==++i&&n==++i&&n==++i&&n==++i&&n==++i&&n==++i&&n==++i&&n==++i&&o>i);e.ut=wt-(o-i),e.ut>e.ct&&(e.ut=e.ct)}if(e.ut<ut?(r=rt(e,e.Be[e.lt]),e.ct--,e.lt++):(e.lt,e.lt,e.ut,r=tt(e,1,e.ut-ut),e.ct-=e.ut,e.lt+=e.ut,e.ut=0),r){let t=dr(e,!1);if(null!=t)return t}}if(e.ot=0,4==t)return dr(e,!0)??3;if(e.Pe){let t=dr(e,!1);if(null!=t)return t}return 1})(n,t):Yt[n.bt].Rt(n,t);if((2==r||3==r)&&(n.Re=666),0==r||2==r)return 0==e.me&&(n.ft=It),0;if(1==r&&(1==t?(e=>{Rt(e,2,3),Rt(e,Zt[vt].Et,Zt[vt].Pt),Tt(e)})(n):5!=t&&(Xt(n,null,0,0),3==t&&(rr(n),0==n.ct&&(n.lt=0,n.st=0,n.ot=0))),lr(e),0==e.me))return n.ft=It,0}return 4!=t?0:n.Ne>0?(2==n.Ne?(Je(n,255&e.Se),Je(n,e.Se>>>8&255),Je(n,e.Se>>>16&255),Je(n,e.Se>>>24&255),Je(n,255&e.ke),Je(n,e.ke>>>8&255),Je(n,e.ke>>>16&255),Je(n,e.ke>>>24&255)):(sr(n,e.Se>>>16&65535),sr(n,65535&e.Se)),lr(e),n.Ne>0&&(n.Ne=-n.Ne),0!=n.Ee?0:1):1}function ur(e){if(fr(e))return-2;let t=e._e,r=t.Re;return t.Be=Re,t.Xe=Ne,t.Ge=Ne,t.Ve=Re,t.Bt=Re,t.zt=new Me(0),t._t=Re,t.xt=Ne,t.Oe.length=0,t.Te.length=0,t.$t.length=0,t.Qe=void 0,t.Je=0,t.tt=0,t.Me=0,113==r?-3:0}function wr(e,t){let r,n,i=e.It,o=e.lt,f=e.wt,s=e.vt,l=e.lt>nt(e)?e.lt-nt(e):0,c=e.Xe,a=e.je,u=e.Be[o],w=e.Be[o+1],h=e.Be[o+f-1],d=e.Be[o+f];e.wt>=e.gt&&(i>>=2),s>e.ct&&(s=e.ct);do{if(r=t,e.Be[r+f]!=d||e.Be[r+f-1]!=h||e.Be[r]!=u||e.Be[r+1]!=w)continue;let i=$e.min(wt,e.ct),l=2;for(;i>l&&e.Be[o+l]==e.Be[r+l];)l++;if(n=l,n>f){if(e.Zt=t,f=n,n>=s)break;h=e.Be[o+f-1],d=e.Be[o+f]}}while((t=c[t&a])>l&&0!=--i);return f>e.ct?e.ct:f}function hr(e,t){((e,t,r,n,i=0)=>{let o,f,s=0;e.bt>0?(2==e.xe.Ie&&(e.xe.Ie=(e=>{let t,r=4093624447;for(t=0;31>=t;t++,r>>=1)if(1&r&&0!=e.Oe[t].$e)return 0;if(0!=e.Oe[9].$e||0!=e.Oe[10].$e||0!=e.Oe[13].$e)return 1;for(t=32;pt>t;t++)if(0!=e.Oe[t].$e)return 1;return 0})(e)),qt(e,e.Ot),qt(e,e.Tt),s=(e=>{let t;for(Ft(e,e.Oe,e.Ot.se),Ft(e,e.Te,e.Tt.se),qt(e,e.Dt),t=yt-1;t>=3&&0==e.$t[De[t]].Pt;t--);return e.rt+=14+3*(t+1),t})(e),o=e.rt+3+7>>3,f=e.nt+3+7>>3,(o>=f||4==e.yt)&&(o=f)):o=f=r+5,o>=r+4&&t?Xt(e,t,r,n,i):f==o?(Rt(e,2+n,3),Gt(e,Zt,Ut)):(Rt(e,4+n,3),((e,t,r,n)=>{let i;for(Rt(e,t-257,5),Rt(e,r-1,5),Rt(e,n-4,4),i=0;n>i;i++)Rt(e,e.$t[De[i]].Pt,3);Wt(e,e.Oe,t-1),Wt(e,e.Te,r-1)})(e,e.Ot.se+1,e.Tt.se+1,s+1),Gt(e,e.Oe,e.Te)),Nt(e),n&&Dt(e)})(e,e.Be,e.lt-e.st,t,e.st),e.st=e.lt,lr(e.xe)}function dr(e,t){return hr(e,t?1:0),0==e.xe.me?t?2:0:null}var pr=65535;function kr(e,t){return t>e?e:t}function br(e,t){let r,n,i,o=kr(e.et-5,e.Ce),f=0,s=e.xe.pe;do{if(r=pr,i=e.Ue+42>>3,e.xe.me<i||(i=e.xe.me-i,n=e.lt-e.st,r>n+e.xe.pe&&(r=n+e.xe.pe),r>i&&(r=i),o>r&&(0==r&&4!=t||0==t||r!=n+e.xe.pe)))break;f=4==t&&r==n+e.xe.pe?1:0,Xt(e,null,0,f),e.Ve[e.Ee-4]=r,e.Ve[e.Ee-3]=r>>8,e.Ve[e.Ee-2]=~r,e.Ve[e.Ee-1]=~r>>8,lr(e.xe),n&&(n>r&&(n=r),Ke(e.xe.be,e.xe.ye,e.Be,e.st,n),e.xe.ye+=n,e.xe.me-=n,e.xe.ge+=n,e.st+=n,r-=n),r&&(ir(e.xe,e.xe.be,e.xe.ye,r),e.xe.ye+=r,e.xe.me-=r,e.xe.ge+=r)}while(0==f);if(s-=e.xe.pe,s){if(s<e.Ce)e.Ht-e.lt<=s&&(e.lt-=e.Ce,Ke(e.Be,0,e.Be,e.Ce,e.lt),2>e.it&&e.it++,e.ot>e.lt&&(e.ot=e.lt)),Ke(e.Be,e.lt,e.xe.he,e.xe.de-s,s),e.lt+=s,e.ot+=kr(s,e.Ce-e.ot);else{e.it=2;let t=e.xe.de-e.Ce;Ke(e.Be,0,e.xe.he,t,e.Ce),e.lt=e.Ce,e.ot=e.lt}e.st=e.lt}return e.Le<e.lt&&(e.Le=e.lt),f?(e.Ct=8,3):0!=t&&4!=t&&0==e.xe.pe&&e.lt==e.st?1:(i=e.Ht-e.lt,e.xe.pe>i&&e.st>=e.Ce&&(e.st-=e.Ce,e.lt-=e.Ce,Ke(e.Be,0,e.Be,e.Ce,e.lt),2>e.it&&e.it++,i+=e.Ce,e.ot>e.lt&&(e.ot=e.lt)),i>e.xe.pe&&(i=e.xe.pe),i&&(ir(e.xe,e.Be,e.lt,i),e.lt+=i,e.ot+=kr(i,e.Ce-e.ot)),e.Le<e.lt&&(e.Le=e.lt),i=e.Ue+42>>3,i=kr(e.et-i,pr),o=kr(i,e.Ce),n=e.lt-e.st,(n>=o||(n||4==t)&&0!=t&&0==e.xe.pe&&i>=n)&&(r=kr(n,i),f=4==t&&0==e.xe.pe&&r==n?1:0,Xt(e,e.Be,r,f,e.st),e.st+=r,lr(e.xe)),f&&(e.Ct=8),f?2:0)}function yr(e,t){let r,n=!1;for(;;){if(e.ct<ht){if(or(e),e.ct<ht&&0==t)return 0;if(0==e.ct)break}if(r=0,e.ct>=ut&&(r=tr(e,e.lt)),0!=r&&e.lt-r<=nt(e)&&(e.ut=wr(e,r)),e.ut<ut)n=rt(e,e.Be[e.lt]),e.ct--,e.lt++;else if(e.lt,e.Zt,e.ut,n=tt(e,e.lt-e.Zt,e.ut-ut),e.ct-=e.ut,e.ut>e.St||e.ct<ut)e.lt+=e.ut,e.ut=0,e.kt=e.Be[e.lt],e.kt=er(e,e.kt,e.Be[e.lt+1]);else{e.ut--;do{e.lt++,r=tr(e,e.lt)}while(0!=--e.ut);e.lt++}if(n){let t=dr(e,!1);if(null!=t)return t}}if(e.ot=e.lt<ut-1?e.lt:ut-1,4==t)return dr(e,!0)??3;if(e.Pe){let t=dr(e,!1);if(null!=t)return t}return 1}function mr(e,t){let r,n=!1;for(;;){if(e.ct<ht){if(or(e),e.ct<ht&&0==t)return 0;if(0==e.ct)break}if(r=0,e.ct>=ut&&(r=tr(e,e.lt)),e.wt=e.ut,e.ht=e.Zt,e.ut=ut-1,0!=r&&e.wt<e.St&&e.lt-r<=nt(e)&&(e.ut=wr(e,r),5>=e.ut&&1==e.yt&&(e.ut=ut-1)),e.wt<ut||e.ut>e.wt)if(e.dt){if(n=rt(e,e.Be[e.lt-1]),n&&hr(e,0),e.lt++,e.ct--,0==e.xe.me)return 0}else e.dt=1,e.lt++,e.ct--;else{let t=e.lt+e.ct-ut;e.lt,e.ht,e.wt,n=tt(e,e.lt-1-e.ht,e.wt-ut),e.ct-=e.wt-1,e.wt-=2;do{++e.lt<=t&&(r=tr(e,e.lt))}while(0!=--e.wt);if(e.dt=0,e.ut=ut-1,e.lt++,n){let t=dr(e,!1);if(null!=t)return t}}}if(e.dt&&(n=rt(e,e.Be[e.lt-1]),e.dt=0),e.ot=e.lt<ut-1?e.lt:ut-1,4==t)return dr(e,!0)??3;if(e.Pe){let t=dr(e,!1);if(null!=t)return t}return 1}var gr=new Ee([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),vr=Cr([16,8,17,4,18,4,19,4,20,4,21,4,16,1,73,1,200,1]),Ir=new Ee([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),Sr=Cr([16,4,17,2,18,2,19,2,20,2,21,2,22,2,23,2,24,2,25,2,26,2,27,2,28,2,29,2,64,2]),zr=new Ee([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,3,0,0]),_r=Cr([128,8,129,4,130,4,131,4,132,4,133,4,16,1,73,1,200,1]),xr=new Ee([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,32769,49153]),Br=Cr([128,4,129,2,130,2,131,2,132,2,133,2,134,2,135,2,136,2,137,2,138,2,139,2,140,2,141,2,142,2]);function Cr(e){let t=[];for(let r=0;r<e.length;r+=2){let n=e[r],i=e[r+1];for(let e=0;i>e;e++)t.push(n)}return new Ee(t)}function Ar(e,t){let r,n=e._e,i=e.de,o=e.ye,f=e.he,s=e.be,l=n.Be,c=n.Ze>>>0,a=n.Ue>>>0,u=n.tr,w=n.rr,h=(1<<n.nr)-1,d=(1<<n.ir)-1,p=n.Ce>>>0,k=n.Le>>>0,b=n.He>>>0,y=n.sr,m=o-(t-e.me),g=o+(e.me-257),v=i+(e.pe-5),I=0,S=0,z=0,_=0;e:do{for(;15>a;){if(i>=f.length)break e;c+=f[i++]<<a,a+=8}for(r=u[c&h];;){if(z=r.lr,c>>>=z,a-=z,z=r.cr,0==z){s[o++]=r.ar;break}if(16&z){if(I=r.ar,z&=15,z){for(;z>a;){if(i>=f.length){n.ur=16200;break e}c+=f[i++]<<a,a+=8}I+=c&(1<<z)-1,c>>>=z,a-=z}for(;15>a;){if(i>=f.length){n.ur=16200;break e}c+=f[i++]<<a,a+=8}for(r=w[c&d];;){if(z=r.lr,c>>>=z,a-=z,z=r.cr,16&z){if(S=r.ar,z&=15,z){for(;z>a;){if(i>=f.length){n.ur=16200;break e}c+=f[i++]<<a,a+=8}S+=c&(1<<z)-1,c>>>=z,a-=z}let t=I,u=o-m;if(S>u){let r=S-u;if(r>k&&y){e.ve="invalid distance too far back",n.ur=16209;break e}if(0==b){if(_=p-r,r>=t){for(let e=0;t>e;++e)s[o++]=l[_++];continue e}for(let e=0;r>e;++e)s[o++]=l[_++];t-=r,_=o-S}else if(r>b){_=p+b-r;let e=r-b;if(e>=t){for(let e=0;t>e;++e)s[o++]=l[_++];continue e}for(let t=0;e>t;++t)s[o++]=l[_++];if(t-=e,_=0,t>b){for(let e=0;b>e;++e)s[o++]=l[_++];t-=b,_=o-S}}else{if(_=b-r,r>=t){for(let e=0;t>e;++e)s[o++]=l[_++];continue e}for(let e=0;r>e;++e)s[o++]=l[_++];t-=r,_=o-S}for(;t>2;)s[o++]=s[_++],s[o++]=s[_++],s[o++]=s[_++],t-=3;t&&(s[o++]=s[_++],t>1&&(s[o++]=s[_++]))}else{for(_=o-S;t>2;)s[o++]=s[_++],s[o++]=s[_++],s[o++]=s[_++],t-=3;t&&(s[o++]=s[_++],t>1&&(s[o++]=s[_++]))}break}if(64&z){e.ve="invalid distance code",n.ur=16209;break e}r=w[r.ar+(c&(1<<z)-1)]}break}if(64&z){if(32&z){n.ur=16191;break e}e.ve="invalid literal/length code",n.ur=16209;break e}r=u[r.ar+(c&(1<<z)-1)]}}while(v>i&&g>o);let x=a>>3;i-=x,a-=x<<3,c&=(1<<a)-1,e.de=i,e.ye=o,e.pe=v>i?v-i+5:5-(i-v),e.me=g>o?g-o+257:257-(o-g),n.Ze=c>>>0,n.Ue=a>>>0}function Lr(e,t){let r=[],n=t?1446:1444;return{...We(e,0),xe:e,ur:16180,wr:!1,Ne:0,hr:!1,dr:0,pr:0,kr:0,br:0,Be:Re,yr:0,mr:0,Wt:0,tr:r,rr:r,nr:0,ir:0,gr:0,vr:0,Ir:0,Sr:0,zr:r,_r:new Ee(320),Br:new Ee(288),Cr:new Te(n).fill(null).map(()=>Hr()),Ar:0,sr:!0,Lr:0,Hr:0,Zr:t}}function Hr(e=0,t=0,r=0){return{cr:e,lr:t,ar:r}}function Zr(e=1){return{cr:64,lr:e,ar:0}}function Ur(e){return(255&e)<<24|(e>>8&255)<<16|(e>>16&255)<<8|e>>24&255}var Vr={Zr:!1,Ur:gr,Vr:vr,Er:Ir,Mr:Sr,Pr:20,$r:257,Or:0,Tr:592,Dr:!1,Rr:!0},Er={Zr:!0,Ur:zr,Vr:_r,Er:xr,Mr:Br,Pr:19,$r:256,Or:-1,Tr:594,Dr:!0,Rr:!1};function Mr(e,t,r,n,i,o,f,s){let l,c,a,u,w,h,d,p,k,b,y,m,g,v,I,S,z,_,x,B=new Ee(16),C=new Ee(16),A=s?Er:Vr;for(l=0;15>=l;l++)B[l]=0;for(c=0;r>c;c++)B[t[c]]++;for(w=i.Nr,u=15;u>=1&&0==B[u];u--);if(w>u&&(w=u),0==u)return A.Rr?(I=Zr(1),n.Nr[0]=I,n.Nr[1]=I,i.Nr=1,0):-1;for(a=1;u>a&&0==B[a];a++);for(a>w&&(w=a),p=1,l=1;15>=l;l++)if(p<<=1,p-=B[l],0>p)return-1;if(p>0&&(0==e||1!=u))return-1;for(C[1]=0,l=1;15>l;l++)C[l+1]=C[l]+B[l];for(c=0;r>c;c++)0!=t[c]&&(o[C[t[c]]++]=c);switch(e){case 0:z=_=o,x=A.Pr;break;case 1:z=A.Ur,_=A.Vr,x=A.$r;break;default:z=A.Er,_=A.Mr,x=A.Or}if(b=0,c=0,l=a,S=f.Nr,h=w,d=0,g=-1,k=1<<w,v=k-1,1==e&&(A.Dr?k>=852:k>852)||2==e&&(A.Dr?k>=A.Tr:k>A.Tr))return 1;for(;;){I=Pr(o,c,l,d,e,z,_,x,A.Zr),y=1<<l-d,m=1<<h,a=m;do{m-=y;let e=(b>>d)+m;n.Nr[S+e]={...I}}while(0!=m);for(y=1<<l-1;b&y;)y>>=1;if(0!=y?(b&=y-1,b+=y):b=0,c++,0==--B[l]){if(l==u)break;l=t[o[c]]}if(l>w&&(b&v)!=g){for(0==d&&(d=w),S+=1<<h,h=l-d,p=1<<h;u>h+d&&(p-=B[h+d],p>0);)h++,p<<=1;if(k+=1<<h,1==e&&(A.Dr?k>=852:k>852)||2==e&&(A.Dr?k>=A.Tr:k>A.Tr))return 1;g=b&v,n.Nr[f.Nr+g]={cr:h,lr:w,ar:S-f.Nr}}}if(0!=b)for(I=Zr(l-d);0!=b;){for(0!=d&&(b&v)!=g&&(d=0,l=w,S=f.Nr,h=w,I.lr=l),n.Nr[S+(b>>d)]={...I},y=1<<l-1;b&y;)y>>=1;0!=y?(b&=y-1,b+=y):b=0}return f.Nr+=k,i.Nr=w,0}function Pr(e,t,r,n,i,o,f,s,l){let c;if(l?e[t]<s:e[t]+1<s)c=Hr(0,r-n,e[t]);else if(l?e[t]>s:e[t]>=s)if(l&&1==i){let i=e[t]-257;c=Hr(f[i],r-n,o[i])}else{let i=l?e[t]:e[t]-s;c=Hr(f[i],r-n,o[i])}else c=((e=0)=>({cr:96,lr:e,ar:0}))(r-n);return c}var $r,Or,Tr=new Te(544),Dr=!0;function Rr(e){let t;return!(e&&(t=e._e,!(!t||t.xe!=e||t.Zr&&(16191>t.ur||t.ur>16209)||!t.Zr&&(16180>t.ur||t.ur>16211))))}function Nr(e){let t={Nr:0};if(Dr){let r,n,i;for(r=0;144>r;)e._r[r++]=8;for(;256>r;)e._r[r++]=9;for(;280>r;)e._r[r++]=7;for(;288>r;)e._r[r++]=8;for(let e=0;544>e;e++)Tr[e]=Hr();i=Tr,$r=i,n=9;let o={Nr:i},f={Nr:n},s={Nr:0};for(Mr(1,e._r,288,o,f,e.Br,s,e.Zr),i=o.Nr,n=f.Nr,e.Ar=s.Nr,r=0;32>r;)e._r[r++]=5;n=5;let l=s.Nr,c={Nr:i},a={Nr:n};t.Nr=l,Mr(2,e._r,32,c,a,e.Br,t,e.Zr),Or=i.slice(l),Dr=!1}e.tr=$r,e.nr=9,e.rr=Or,e.ir=5,e.Ar=t.Nr}var Qr=class extends Oe{constructor(){super("Need more input")}};function jr(e,t){let r,n,i,o,f,s,l,c,a,u,w,h,d,p,k,b,y,m=new Ve(4);if(Rr(e)||!e.be||!e.he&&0!=e.pe)return-2;s=0,c=0,l=0,a=0,n=Re,i=0,o=Re,f=0,r=e._e,16191==r.ur&&(r.ur=16192),z(),u=s,w=l,y=0;try{for(;;)switch(r.ur){case 16180:if(0==r.Ne){r.ur=16192;break}if(C(16),2&r.Ne&&35615==c){0==r.Ae&&(r.Ae=15),r.kr=Ot(0),r.kr=I(r.kr,c),x(),r.ur=16181;break}if(r.Qe&&(r.Qe.Qr=-1),!(1&r.Ne)||((A(8)<<8)+(c>>8))%31){e.ve="incorrect header check",r.ur=16209;break}if(8!=A(4)){e.ve="unknown compression method",r.ur=16209;break}if(L(4),b=A(4)+8,0==r.Ae&&(r.Ae=b),b>15||b>r.Ae){e.ve="invalid window size",r.ur=16209;break}r.pr=1<<b,r.dr=0,e.Se=r.kr=Pt(0),r.ur=512&c?16189:16191,x();break;case 16181:if(C(16),r.dr=c,8!=(255&r.dr)){e.ve="unknown compression method",r.ur=16209;break}if(57344&r.dr){e.ve="unknown header flags set",r.ur=16209;break}r.Qe&&(r.Qe.Ft=c>>8&1),512&r.dr&&4&r.Ne&&(r.kr=I(r.kr,c)),x(),r.ur=16182;case 16182:C(32),r.Qe&&(r.Qe.Yt=c),512&r.dr&&4&r.Ne&&(r.kr=S(r.kr,c)),x(),r.ur=16183;case 16183:C(16),r.Qe&&(r.Qe.jr=255&c,r.Qe.Jt=c>>8),512&r.dr&&4&r.Ne&&(r.kr=I(r.kr,c)),x(),r.ur=16184;case 16184:1024&r.dr?(C(16),r.yr=c,r.Qe&&(r.Qe.er=c),512&r.dr&&4&r.Ne&&(r.kr=I(r.kr,c)),x()):r.Qe&&(r.Qe.Wt=Re),r.ur=16185;case 16185:if(1024&r.dr&&(h=r.yr,h>s&&(h=s),h&&(r.Qe&&r.Qe.Wt&&r.Qe.Kr&&(b=r.Qe.er-r.yr)<r.Qe.Kr&&Ke(r.Qe.Wt,b,n,i,h),512&r.dr&&4&r.Ne&&(r.kr=Ot(r.kr,n.subarray(i,i+h),h)),s-=h,i+=h,r.yr-=h),r.yr))return g();r.yr=0,r.ur=16186;case 16186:if(2048&r.dr){if(0==s)return g();h=0;do{b=n[i+h++],r.Qe&&r.Qe.qr&&r.yr<r.Qe.qr&&(r.Qe.Xt[r.yr++]=b)}while(b&&s>h);if(512&r.dr&&4&r.Ne&&(r.kr=Ot(r.kr,n.subarray(i,i+h),h)),s-=h,i+=h,b)return g()}else r.Qe&&(r.Qe.Xt=Re);r.yr=0,r.ur=16187;case 16187:if(4096&r.dr){if(0==s)return g();h=0;do{b=n[i+h++],r.Qe&&r.Qe.Fr&&r.yr<r.Qe.Fr&&(r.Qe.Gt[r.yr++]=b)}while(b&&s>h);if(512&r.dr&&4&r.Ne&&(r.kr=Ot(r.kr,n.subarray(i,i+h),h)),s-=h,i+=h,b)return g()}else r.Qe&&(r.Qe.Gt=Re);r.ur=16188;case 16188:if(512&r.dr){if(C(16),4&r.Ne&&c!=(65535&r.kr)){e.ve="header crc mismatch",r.ur=16209;break}x()}r.Qe&&(r.Qe.qt=r.dr>>9&1,r.Qe.Qr=1),e.Se=r.kr=Ot(0),r.ur=16191;break;case 16189:C(32),e.Se=r.kr=Ur(c),x(),r.ur=16190;case 16190:if(!r.hr)return _(),2;e.Se=r.kr=Pt(0),r.ur=16191;case 16191:if(5==t||6==t)return g();case 16192:if(r.wr){H(),r.ur=16206;break}switch(C(3),r.wr=!!A(1),L(1),A(2)){case 0:r.ur=16193;break;case 1:if(Nr(r),r.ur=16199,6==t)return L(2),g();break;case 2:r.ur=16196;break;case 3:e.ve="invalid block type",r.ur=16209}L(2);break;case 16193:if(H(),C(32),(65535&c)!=(c>>>16^65535)){e.ve="invalid stored block lengths",r.ur=16209;break}if(r.yr=65535&c,x(),r.ur=16194,6==t)return g();case 16194:r.ur=16195;case 16195:if(h=r.yr,h){if(h>s&&(h=s),h>l&&(h=l),0==h)return g();Ke(o,f,n,i,h),s-=h,i+=h,l-=h,f+=h,r.yr-=h;break}r.ur=16191;break;case 16196:if(C(14),r.vr=A(5)+257,L(5),r.Ir=A(5)+1,L(5),r.gr=A(4)+4,L(4),r.vr>286||!r.Zr&&r.Ir>30){e.ve=r.Zr?"too many length":"too many length or distance symbols",r.ur=16209;break}r.Sr=0,r.ur=16197;case 16197:for(;r.Sr<r.gr;)C(3),r._r[De[r.Sr++]]=A(3),L(3);for(;19>r.Sr;)r._r[De[r.Sr++]]=0;r.zr=r.Cr,r.tr=r.rr=r.zr,r.nr=7;let u={Nr:r.zr},m={Nr:r.nr},Z={Nr:0};if(y=Mr(0,r._r,19,u,m,r.Br,Z,r.Zr),r.zr=u.Nr,r.nr=m.Nr,y){e.ve="invalid code lengths set",r.ur=16209;break}r.Sr=0,r.ur=16198;case 16198:for(;r.Sr<r.vr+r.Ir;){for(;p=r.tr[A(r.nr)],p.lr>a;)B();if(16>p.ar)L(p.lr),r._r[r.Sr++]=p.ar;else{if(16==p.ar){if(C(p.lr+2),L(p.lr),0==r.Sr){e.ve="invalid bit length repeat",r.ur=16209;break}b=r._r[r.Sr-1],h=3+A(2),L(2)}else 17==p.ar?(C(p.lr+3),L(p.lr),b=0,h=3+A(3),L(3)):(C(p.lr+7),L(p.lr),b=0,h=11+A(7),L(7));if(r.Sr+h>r.vr+r.Ir){e.ve="invalid bit length repeat",r.ur=16209;break}for(;h--;)r._r[r.Sr++]=b}}if(16209==r.ur)break;if(0==r._r[256]){e.ve="invalid code -- missing end-of-block",r.ur=16209;break}r.zr=r.Cr,r.nr=9;let U={Nr:r.zr},V={Nr:r.nr},E={Nr:0};y=Mr(1,r._r,r.vr,U,V,r.Br,E,r.Zr),r.zr=U.Nr,r.nr=V.Nr;let M=E.Nr;if(r.tr=r.zr.slice(0,M),y){e.ve="invalid literal/lengths set",r.ur=16209;break}r.ir=6;let P=r._r.subarray(r.vr,r.vr+r.Ir),$={Nr:r.zr},O={Nr:r.ir},T={Nr:M};if(y=Mr(2,P,r.Ir,$,O,r.Br,T,r.Zr),r.zr=$.Nr,r.ir=O.Nr,r.rr=r.zr.slice(M),y){e.ve="invalid distances set",r.ur=16209;break}if(r.ur=16199,6==t)return g();case 16199:r.ur=16200;case 16200:if(!r.Zr&&s>=6&&l>=258){_(),Ar(e,w),z(),16191==r.ur&&(r.Lr=-1);break}for(r.Lr=0;p=r.tr[A(r.nr)],p.lr>a;)B();if(p.cr&&!(240&p.cr)){for(k=p;p=r.tr[k.ar+(A(k.lr+k.cr)>>k.lr)],k.lr+p.lr>a;)B();L(k.lr),r.Lr+=k.lr}if(L(p.lr),r.Lr+=p.lr,r.yr=p.ar,0==p.cr){r.ur=16205;break}if(32&p.cr){r.Lr=-1,r.ur=16191;break}if(64&p.cr){e.ve="invalid literal/length code",r.ur=16209;break}r.Wt=15&p.cr,r.ur=16201;case 16201:r.Wt&&(C(r.Wt),r.yr+=A(r.Wt),L(r.Wt),r.Lr+=r.Wt),r.Hr=r.yr,r.ur=16202;case 16202:for(;p=r.rr[A(r.ir)],p.lr>a;)B();if(!(240&p.cr)){for(k=p;p=r.rr[k.ar+(A(k.lr+k.cr)>>k.lr)],k.lr+p.lr>a;)B();L(k.lr),r.Lr+=k.lr}if(L(p.lr),r.Lr+=p.lr,64&p.cr){e.ve="invalid distance code",r.ur=16209;break}r.mr=p.ar,r.Wt=15&p.cr,r.ur=16203;case 16203:r.Wt&&(C(r.Wt),r.mr+=A(r.Wt),L(r.Wt),r.Lr+=r.Wt),r.ur=16204;case 16204:if(0==l)return g();if(h=w-l,r.mr>h){if(h=r.mr-h,h>r.Le&&r.sr){e.ve="invalid distance too far back",r.ur=16209;break}h>r.He?(h-=r.He,d=r.Ce-h):d=r.He-h,h>r.yr&&(h=r.yr),h>l&&(h=l);for(let e=0;h>e;++e)o[f]=255&r.Be[d],++f,++d}else{d=f-r.mr,h=r.yr,h>l&&(h=l);for(let e=0;h>e;++e)o[f]=o[d],++f,++d}h>l&&(h=l),l-=h,r.yr-=h,0==r.yr&&(r.ur=16200);break;case 16205:if(0==l)return g();o[f++]=r.yr,l--,r.ur=16200;break;case 16206:if(r.Ne){if(C(32),w-=l,e.ge+=w,r.br+=w,4&r.Ne&&w){let t=o.subarray(f-w,f);e.Se=r.kr=v(r.kr,t,w)}if(w=l,4&r.Ne&&(r.dr?c:Ur(c)>>>0)!=r.kr){e.ve="incorrect data check",r.ur=16209;break}x()}r.ur=16207;case 16207:if(r.Ne&&r.dr){if(C(32),4&r.Ne&&c!=(4294967295&r.br)){e.ve="incorrect length check",r.ur=16209;break}x()}r.ur=16208;case 16208:return y=1,g();case 16209:return y=-3,g();case 16210:return-4;default:return-2}}catch(e){if(e instanceof Qr)return g();throw e}function g(){if(_(),r.Ce||w!=e.me&&16209>r.ur&&(r.Zr?16208>r.ur:16206>r.ur)||4!=t){let t=w-e.me;if(((e,t,r)=>{let n=e._e;if(!(n.Be&&0!=n.Be.length||(n.Be=new Ve(1<<n.Ae),n.Be)))return 1;if(0==n.Ce&&(n.Ce=1<<n.Ae,n.He=0,n.Le=0),r<n.Ce){let e=n.Ce-n.He;e>r&&(e=r),Ke(n.Be,n.He,t,t.length-r,e),(r-=e)?(Ke(n.Be,0,t,t.length-r,r),n.He=r,n.Le=n.Ce):(n.He+=e,n.He==n.Ce&&(n.He=0),n.Le<n.Ce&&(n.Le+=e))}else Ke(n.Be,0,t,t.length-n.Ce,n.Ce),n.He=0,n.Le=n.Ce;return 0})(e,e.be.subarray(e.ye-t,e.ye),t))return r.ur=16210,-4}return u-=e.pe,w-=e.me,e.ke+=u,e.ge+=w,r.br+=w,4&r.Ne&&w&&(e.Se=r.kr=v(r.kr,e.be.subarray(e.ye-w,e.ye),w)),e.Ie=r.Ue+(r.wr?64:0)+(16191==r.ur?128:0)+(16199==r.ur||16194==r.ur?256:0),(0==u&&0==w&&0==y||4==t&&0==y)&&(y=-5),y}function v(e,t,n){return r.dr?Ot(e,t,n):Pt(e,t,n)}function I(e,t){return m[0]=255&t,m[1]=t>>>8&255,Ot(e,m,2)>>>0}function S(e,t){return m[0]=255&t,m[1]=t>>>8&255,m[2]=t>>>16&255,m[3]=t>>>24&255,Ot(e,m,4)>>>0}function z(){o=e.be,f=e.ye,l=e.me,n=e.he,i=e.de,s=e.pe,c=r.Ze,a=r.Ue}function _(){e.be=o,e.ye=f,e.me=l,e.he=n,e.de=i,e.pe=s,r.Ze=c,r.Ue=a}function x(){c=0,a=0}function B(){if(0==s)throw new Qr;s--,c+=(255&n[i])<<a,i++,c>>>=0,a+=8}function C(e){for(;e>a;)B()}function A(e){return c&(1<<e)-1}function L(e){c>>>=e,a-=e}function H(){c>>>=7&a,a-=7&a}}function Kr(e){return Rr(e)?-2:0}var qr=65536,Fr=class{constructor(e=16,t=qr){this.Wr=[],this.Xr=e;for(let r=0;r<$e.min(e,4);r++)this.Wr.push(new Ve(t))}Gr(e=qr){for(let t=this.Wr.length-1;t>=0;t--){let r=this.Wr[t];if(r.length>=e)return this.Wr.splice(t,1),r}return new Ve(e)}release(e){this.Wr.length<this.Xr&&this.Wr.push(e)}};function Wr(e){let t=new Fr(32,qr),r=null;function n(e){try{t.release(e)}catch{}}return new Pe({start(){},transform(i,o){if(!r){let t=e.Yr(),n=e.Jr(t);if(0!=n&&0!=n)throw new Oe("init failed: "+n);r={xe:t}}let f=r.xe,s=0;for(;s<i.length;){let r=$e.min(i.length-s,32768),l=i.subarray(s,s+r);for(f.he=l,f.de=0,f.pe=l.length;f.pe>0;){let r=t.Gr(),i=!1;try{f.be=r,f.ye=0,f.me=r.length;let n=e.en(f,0),s=r.length-f.me;if(s>0){let e=!1,n={tn:r.subarray(0,s),release:()=>{e||(e=!0,t.release(r))}};i=!0,o.enqueue(n)}if(0!=n&&1!=n)throw new Oe("process error: "+n)}finally{i||n(r)}}s+=r}},flush(i){if(!r)return;let o=r.xe;for(;;){let r=t.Gr(),f=!1;try{o.be=r,o.ye=0,o.me=r.length;let n=e.en(o,4),s=r.length-o.me;if(s>0){let e=!1,n={tn:r.subarray(0,s),release:()=>{e||(e=!0,t.release(r))}};f=!0,i.enqueue(n)}if(1==n)break;if(0!=n)throw new Oe("finalization error: "+n)}finally{f||n(r)}}let f=e.rn(o);if(0!=f&&0!=f)throw new Oe("end failed: "+f)}})}function Xr(){return new Pe({start(){},transform(e,t){try{t.enqueue(e.tn.slice(0))}finally{e.release()}},flush(){}})}var Gr=class{constructor(e="deflate",t){let r=function(e="deflate",t){let r="gzip"==e?31:"deflate-raw"==e?-15:15,n=t&&"number"==typeof t.level?t.level:-1;return Wr({Yr:()=>(()=>{let e=Fe();return e._e=ot(e),e})(),Jr:e=>((e,t,r=8,n=15,i=at,o=0)=>{let f=1;if(!e)return-2;if(e.ve="",-1==t&&(t=6),0>n){if(f=0,-15>n)return-2;n=-n}else n>15&&(f=2,n-=16);if(1>i||i>9||8!=r||8>n||n>15||0>t||t>9||0>o||o>4||8==n&&1!=f)return-2;8==n&&(n=9);let s=ot(e);return s?(e._e=s,s.xe=e,s.Re=42,s.Ne=f,s.Qe=void 0,s.Ae=n,s.Ce=1<<s.Ae,s.je=s.Ce-1,s.Ke=i+7,s.qe=1<<s.Ke,s.Fe=s.qe-1,s.We=(s.Ke+ut-1)/ut,s.Be=new Ve(2*s.Ce),s.Xe=new Ee(s.Ce),s.Ge=new Ee(s.qe),s.Le=0,s.Ye=1<<i+6,s.Ve=new Ve(4*s.Ye),s.et=4*s.Ye,s.Be&&s.Xe&&s.Ge&&s.Ve?(s.Bt=s.Ve.subarray(s.Ye),s.Me=s.Je+s.Ye,s.De=3*(s.Ye-1),s.bt=t,s.yt=o,s.Lt=r,(e=>{let t=(e=>{let t;return fr(e)?-2:(e.ke=e.ge=0,e.ve="",e.Ie=2,t=e._e,t.Ee=0,t.tt=t.Je,0>t.Ne&&(t.Ne=-t.Ne),t.Re=2==t.Ne?57:42,e.Se=2==t.Ne?Ot(0):Pt(0),t.ft=-2,(e=>{if(e.Oe&&e.Oe.length>=mt)for(let t=0;mt>t;t++)e.Oe[t]=st();else{e.Oe=[];for(let t=0;mt>t;t++)e.Oe.push(st())}if(e.Te&&e.Te.length>=2*bt+1)for(let t=0;2*bt+1>t;t++)e.Te[t]=st();else{e.Te=[];for(let t=0;2*bt+1>t;t++)e.Te.push(st())}if(e.$t&&e.$t.length>=2*yt+1)for(let t=0;2*yt+1>t;t++)e.$t[t]=st();else{e.$t=[];for(let t=0;2*yt+1>t;t++)e.$t.push(st())}e.Ot=new Qe(e.Oe,new je(Zt,xt,pt+1,kt,gt)),e.Tt=new Qe(e.Te,new je(Ut,Bt,0,bt,gt)),e.Dt=new Qe(e.$t,new je(null,Ct,0,yt,7)),e.Ze=0,e.Ue=0,e.Ct=0,Nt(e)})(t),0)})(e);return 0==t&&(e=>{e.Ht=2*e.Ce,rr(e),e.St=Yt[e.bt].Nt,e.gt=Yt[e.bt].Qt,e.vt=Yt[e.bt].jt,e.It=Yt[e.bt].Kt,e.lt=0,e.st=0,e.ct=0,e.ot=0,e.ut=e.wt=ut-1,e.dt=0,e.kt=0})(e._e),t})(e)):(s.Re=666,e.ve=Xe(-4),ur(e),-4)):-4})(e,n,8,r,8,0),en:ar,rn:ur})}(e,t);this.writable=r.writable,this.readable=r.readable.pipeThrough(Xr())}},Yr=class{constructor(e="deflate"){let t=((e="deflate")=>{let t="gzip"==e?31:"deflate-raw"==e?-15:15;return Wr({Yr:()=>(e=>{let t=Fe();return t._e=Lr(t,!!e),t})("deflate64-raw"==e),Jr:e=>function(e,t){let r,n;if(!e)return-2;e.ve="";let i=!!e._e.Zr;return n=Lr(e,i),i&&(t=-16),e._e=n,n.xe=e,n.ur=n.Zr?16191:16180,r=((e,t)=>{let r,n,i;if(Rr(e))return-2;if(n=e._e,n.Zr?(t=-16,i=16):i=15,0>t){if(-i>t)return-2;r=0,t=-t}else r=5+(t>>4),!n.Zr&&48>t&&(t&=15);return t&&(8>t||t>i)?-2:(n.Be.length>0&&n.Ae!=t&&(n.Be=Re),n.Ne=r,n.Ae=t,(e=>{let t;return Rr(e)?-2:(t=e._e,t.Ce=0,t.Le=0,t.He=0,(e=>{let t;return Rr(e)?-2:(t=e._e,e.ke=e.ge=t.br=0,e.ve="",t.Ne&&(e.Se=1&t.Ne),t.ur=t.Zr?16191:16180,t.wr=!1,t.hr=!1,t.dr=-1,t.pr=t.Zr?65536:32768,delete t.Qe,t.Ze=0,t.Ue=0,t.tr=t.Cr,t.rr=t.Cr,t.zr=t.Cr,t.sr=!0,t.Lr=-1,0)})(e))})(e))})(e,t),r}(e,t),en:jr,rn:Kr})})(e);this.writable=t.writable,this.readable=t.readable.pipeThrough(Xr())}};self.initModule=e=>{e.re=Gr,e.ne=Yr}});\n')});}

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
let initModule = () => { };

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
				await initModule(config);
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
			if (value.byteLength < value.buffer.byteLength) {
				message.value = value.buffer.slice(0, value.byteLength);
			}
			else {
				message.value = value.buffer;
			}
			transferables.push(message.value);
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

	init(initSize = 0) {
		Object.assign(this, {
			offset: 0,
			array: new Uint8Array(initSize)
		});
		super.init();
	}

	writeUint8Array(array) {
		const writer = this;
		if (writer.offset + array.length > writer.array.length) {
			const previousArray = writer.array;
			writer.array = new Uint8Array(previousArray.length + array.length);
			writer.array.set(previousArray);
		}
		writer.array.set(array, writer.offset);
		writer.offset += array.length;
	}

	getData() {
		return this.array;
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

const PROPERTY_NAMES = [
	PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, PROPERTY_NAME_COMPRESSED_SIZE, PROPERTY_NAME_UNCOMPRESSED_SIZE,
	PROPERTY_NAME_LAST_MODIFICATION_DATE, PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT,
	PROPERTY_NAME_LAST_ACCESS_DATE, PROPERTY_NAME_CREATION_DATE, PROPERTY_NAME_OFFSET, PROPERTY_NAME_DISK_NUMBER_START,
	PROPERTY_NAME_DISK_NUMBER_START, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES,
	PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES, PROPERTY_NAME_MS_DOS_COMPATIBLE, PROPERTY_NAME_ZIP64,
	PROPERTY_NAME_ENCRYPTED, PROPERTY_NAME_VERSION, PROPERTY_NAME_VERSION_MADE_BY, PROPERTY_NAME_ZIPCRYPTO, PROPERTY_NAME_DIRECTORY,
	PROPERTY_NAME_EXECUTABLE, PROPERTY_NAME_COMPRESSION_METHOD, PROPERTY_NAME_SIGNATURE, PROPERTY_NAME_EXTRA_FIELD,
	"bitFlag", "filenameUTF8", "commentUTF8", "rawExtraField", "extraFieldZip64", "extraFieldUnicodePath", "extraFieldUnicodeComment",
	"extraFieldAES", "extraFieldNTFS", "extraFieldExtendedTimestamp"];

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
			const directory =
				(msDosCompatible && ((getUint8(directoryView, offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK)) ||
				(unixCompatible && (((externalFileAttributes >> 16) & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR)) ||
				(rawFilename.length && rawFilename.at(-1) == DIRECTORY_SIGNATURE.charCodeAt(0));
			const executable = (unixCompatible && (((externalFileAttributes >> 16) & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0));
			const offsetFileEntry = getUint32(directoryView, offset + 42) + prependedDataLength;
			Object.assign(fileEntry, {
				versionMadeBy,
				msDosCompatible,
				compressedSize: 0,
				uncompressedSize: 0,
				commentLength,
				directory,
				offset: offsetFileEntry,
				diskNumberStart: getUint16(directoryView, offset + 34),
				internalFileAttributes: getUint16(directoryView, offset + 36),
				externalFileAttributes,
				rawFilename,
				filenameUTF8,
				commentUTF8,
				rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset),
				executable
			});
			fileEntry.internalFileAttribute = fileEntry.internalFileAttributes;
			fileEntry.externalFileAttribute = fileEntry.externalFileAttributes;
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
				rawComment,
				filename,
				comment,
				directory: directory || filename.endsWith(DIRECTORY_SIGNATURE)
			});
			startOffset = Math.max(offsetFileEntry, startOffset);
			readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
			fileEntry.zipCrypto = fileEntry.encrypted && !fileEntry.extraFieldAES;
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
				passwordVerification: zipCrypto && (dataDescriptor ? ((rawLastModDate >>> 8) & 0xFF) : ((signature >>> 24) & 0xFF)),
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
		directory[propertyName + "UTF8"] = true;
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
	const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
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

const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);

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
				rawExtraField
			} = entry;
			const { level, languageEncodingFlag, dataDescriptor } = bitFlag;
			rawExtraFieldZip64 = rawExtraFieldZip64 || new Uint8Array();
			rawExtraFieldAES = rawExtraFieldAES || new Uint8Array();
			rawExtraFieldExtendedTimestamp = rawExtraFieldExtendedTimestamp || new Uint8Array();
			rawExtraFieldNTFS = rawExtraFieldNTFS || new Uint8Array();
			rawExtraField = rawExtraField || new Uint8Array();
			const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
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
		await closeFile(this, comment, options);
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

	close(comment = undefined, options = {}) {
		return this.zipWriter.close(comment, options);
	}
}

async function addFile(zipWriter, name, reader, options) {
	name = name.trim();
	const msDosCompatible = getOptionValue(zipWriter, options, PROPERTY_NAME_MS_DOS_COMPATIBLE);
	const versionMadeBy = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION_MADE_BY, msDosCompatible ? 20 : 768);
	const executable = getOptionValue(zipWriter, options, PROPERTY_NAME_EXECUTABLE);
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
		diskNumberStart: diskNumber
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
		rawExtraFieldAES
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
		rawExtraFieldAES,
		rawExtraField,
		extendedTimestamp,
		msDosCompatible,
		internalFileAttributes,
		externalFileAttributes,
		diskNumberStart
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
				passwordVerification: encrypted && zipCrypto && (rawLastModDate >> 8) & 0xFF,
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
	const extraFieldLength = localExtraFieldZip64Length + getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
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
		const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
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
		arraySet(directoryArray, rawExtraField, directoryOffset);
		directoryOffset += getLength(rawExtraField);
		arraySet(directoryArray, rawComment, directoryOffset);
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
	configure({ baseURI: (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index-native.cjs', document.baseURI).href)) });
} catch {
	// ignored
}

var{Uint8Array:x,Uint16Array:A,Int32Array:z,TransformStream:U,Math:N,Error:C,Array:D}=globalThis,xe=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],F=new x(0),Me=new A(0),te=class{constructor(e,t){this.t=e,this.i=t,this._=0;}},ne=class{constructor(e,t,n,r,i){this.l=e,this.o=t,this.u=n,this.h=r,this.k=i;}};function M(e,t,n,r,i){if(0==i)return;let f=e instanceof x?e:new x(e.buffer,e.byteOffset,e.byteLength),_=n instanceof x?n.subarray(r,r+i):new x(n.buffer,n.byteOffset+r,i);f.set(_,t);}function Ye(e,t,n){0!=n&&(e instanceof x?e:new x(e.buffer,e.byteOffset,e.byteLength)).fill(0,t,t+n);}function We(){return {next_in:F,next_in_index:0,avail_in:0,total_in:0,next_out:F,next_out_index:0,avail_out:0,total_out:0,msg:"",m:0,v:0,p:0,A:void 0}}function Xe(e,t){let n=1<<t;return {O:e,M:new x(n),F:n,D:t,q:0,C:0,N:0,S:0}}function b_(e){return K_[e<-6||e>2?9:2-e]||""}function Se(e,t){try{e.msg=b_(t);}catch(n){e.msg="zlib error "+String(t)+" ("+n+")";}return t}function Ke(e,t){let n=e>>>0,r=0;for(let e=0;e<t;e++)r=r<<1|1&n,n>>>=1;return r}function g(e,t){e.X[e.V++]=t;}function ge(e,t){g(e,255&t),g(e,t>>>8&255);}function qe(e,t,n){let r=255&n,i=65535&t,f=e.T+e.U;return e.X[f]=255&i,e.X[f+1]=i>>>8&255,e.X[f+2]=r,e.U+=3,i=i-1&65535,e.B[je[r]+ae+1].$++,e.I[h_(i)].$++,e.U==e.Z}function Ee(e,t){let n=255&t,r=e.T+e.U;return e.X[r]=0,e.X[r+1]=0,e.X[r+2]=n,e.U+=3,e.B[n].$++,e.U==e.Z}function we(e){return e.F-re}function h_(e){return e<256?m_[e]:m_[256+(e>>7)]}function s_(e){let t=Re+7,n=1<<t,r=(1<<t)-1,i=N.floor((t+k-1)/k),f=1<<8+Re;return {...Xe(e,15),O:e,H:42,L:0,K:void 0,W:32767,J:t,R:n,Y:r,j:i,P:new A(32768),G:new A(n),ee:f,X:new x(32768),te:0,ne:32768,V:0,re:0,ie:0,fe:0,_e:0,le:0,oe:-2,ue:0,ae:0,ce:0,se:0,de:0,he:0,we:0,ke:0,ge:0,be:0,me:0,xe:0,ve:0,ye:0,pe:new z(2*pe+1),ze:new x(2*pe+1),Ae:new A(ce+1),U:0,Z:0,Oe:F,T:0,Me:0,Fe:0,De:8,qe:32768,Ce:0,Ne:0,Se:0,B:new D(oe).fill(0).map(()=>Q()),I:new D(2*ue+1).fill(0).map(()=>Q()),Xe:new D(2*ie+1).fill(0).map(()=>Q()),Ve:d_(),Te:d_(),Ue:d_()}}function x_(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1],f=Q();f.Qe=r,f.$e=i,t.push(f);}return t}function Q(){return {$:0,Qe:0,Ee:0,$e:0}}function d_(){return new te([],_n(null,F,0,0,0))}function _n(e,t,n,r,i){return new ne(e,t,n,r,i)}function q_(){let e=new D(288).fill(0);for(let t=0;t<=143;t++)e[t]=8;for(let t=144;t<=255;t++)e[t]=9;for(let t=256;t<=279;t++)e[t]=7;for(let t=280;t<=287;t++)e[t]=8;return e}function p_(e){let{code:t,length:n}=tn(e),r=new D(2*e.length),i=0;for(let f=0;f<e.length;f++){let e=n[f]||0,_=t[f]||0;r[i++]=e?Ke(_,e):0,r[i++]=e;}return new z(r)}function j_(e,t,n){let r=0;for(let n=0;n<e.length;n++){let i=t[n]?1<<t[n]:1,f=e[n]+i-1;f>r&&(r=f);}r<n&&(r=n);let i=new x(r+1);for(let n=0;n<=r;n++)for(let r=0;r<e.length;r++){let f=t[r]?1<<t[r]:1,_=e[r];if(n>=_&&n<=_+f-1){i[n]=r;break}}return i}function V_(e,t){let n=0;for(let r=0;r<e.length;r++){let i=t[r]?1<<t[r]:1,f=e[r]+i-1;f>n&&(n=f);}let r=new x(n+1);for(let i=0;i<=n;i++)for(let n=0;n<e.length;n++){let f=t[n]?1<<t[n]:1,_=e[n];if(i>=_&&i<=_+f-1){r[i]=n;break}}return r}function J_(e){let t=new x(512),n=e.length-1;for(let r=0;r<256;r++)t[r]=r<=n?e[r]:e[n];for(let r=256;r<=n;r++){let n=r>>7;t[256+(n>255?255:n)]=e[r];}for(let e=257;e<512;e++)0==t[e]&&(t[e]=t[e-1]);return t}function tn(e){let t=N.max(...e),n=new D(t+1).fill(0);for(let t of e)t>0&&n[t]++;let r=new D(e.length).fill(0),i=new D(t+1).fill(0),f=0;for(let e=1;e<=t;e++)f=f+n[e-1]<<1,i[e]=f;for(let t=0;t<e.length;t++){let n=e[t];0!=n&&(r[t]=i[n]++);}return {code:r,length:e}}var Re=8,k=3,_e=258,re=_e+k+1,ze=16,Ce=_e,nn=29,ae=256,pe=ae+1+nn,ue=30,ie=19,oe=2*pe+1,ce=15,Q_=9,$_=255,et=32,_t=4,Te=256,Ve=16,Je=17,Qe=18,tt=0,S_=1,nt=2,$=-1,K_=["need dictionary","stream end","","file error","stream error","data error","insufficient memory","buffer error",""],g_=new z([0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0]),E_=new z([0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576]),$e=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],e_=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],rt=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],rn=V_(E_,e_),an=p_(q_()),on=p_(new D(30).fill(5)),Le=x_(an),w_=x_(on),je=j_(g_,$e,_e),m_=J_(rn);function Oe(e){return e%65521>>>0}function de(e,t,n){if(void 0===t||void 0===n)return 1;let r=e>>>16&65535;if(e&=65535,1==n)return (e+=t[0])>=65521&&(e-=65521),r+=e,r>=65521&&(r-=65521),(r<<16|e)>>>0;if(n<16){for(let i=0;i<n;i++)r+=e+=t[i];return e>=65521&&(e-=65521),r=Oe(r),(r<<16|e)>>>0}for(;n>=5552;){n-=5552;let i=N.floor(347);do{for(let n=0;n<16;n++)r+=e+=t[n];t=t.subarray(16);}while(--i);e=Oe(e),r=Oe(r);}if(n){for(;n>=16;){n-=16;for(let n=0;n<16;n++)r+=e+=t[n];t=t.subarray(16);}for(let i=0;i<n;i++)r+=e+=t[i];e=Oe(e),r=Oe(r);}return (r<<16|e)>>>0}var ln=(()=>{let e=new D(256);for(let t=0;t<256;t++){let n=t;for(let e=0;e<8;e++)n=1&n?3988292384^n>>>1:n>>>1;e[t]=n>>>0;}return e})();function X(e=0,t,n){if(!t)return 0;void 0===n&&(n=t.length),n=N.min(n,t.length),e=~e>>>0;for(let r=0;r<n;r++)e=e>>>8^ln[255&(e^t[r])];return (4294967295^e)>>>0}function ct(e){16==e.S?(ge(e,e.N),e.N=0,e.S=0):e.S>=8&&(g(e,e.N),e.N>>=8,e.S-=8);}function dt(e){e.S>8?ge(e,e.N):e.S>0&&g(e,e.N),e.Me=1+(e.S-1&7),e.N=0,e.S=0;}function fn(e,t,n){let r,i,f=[],_=0;for(r=1;r<=ce;r++)_=_+n[r-1]<<1,f[r]=_;for(i=0;i<=t;i++){let t=e[i].$e;0!=t&&(e[i].Qe=Ke(f[t]++,t));}}function O(e,t,n){e.S>ze-n?(e.N=65535&(e.N|t<<e.S),ge(e,e.N),e.N=t>>ze-e.S&65535,e.S+=n-ze):(e.N=65535&(e.N|t<<e.S),e.S+=n);}function mt(e){for(let t=0;t<e.B.length;t++)e.B[t].$=0;for(let t=0;t<e.I.length;t++)e.I[t].$=0;for(let t=0;t<e.Xe.length;t++)e.Xe[t].$=0;e.B[Te].$=1,e.ie=e.fe=0,e.U=e._e=0;}function bt(e){if(e.B&&e.B.length>=oe)for(let t=0;t<oe;t++)e.B[t]=Q();else {e.B=[];for(let t=0;t<oe;t++)e.B.push(Q());}if(e.I&&e.I.length>=2*ue+1)for(let t=0;t<2*ue+1;t++)e.I[t]=Q();else {e.I=[];for(let t=0;t<2*ue+1;t++)e.I.push(Q());}if(e.Xe&&e.Xe.length>=2*ie+1)for(let t=0;t<2*ie+1;t++)e.Xe[t]=Q();else {e.Xe=[];for(let t=0;t<2*ie+1;t++)e.Xe.push(Q());}e.Ve=new te(e.B,new ne(Le,$e,ae+1,pe,ce)),e.Te=new te(e.I,new ne(w_,e_,0,ue,ce)),e.Ue=new te(e.Xe,new ne(null,rt,0,ie,7)),e.N=0,e.S=0,e.Me=0,mt(e);}var me=1;function un(e,t,n){return n=e.pe[me],e.pe[me]=e.pe[e.Ne--],T_(e,t,me),n}function ot(e,t,n,r){return e[t].$<e[n].$||e[t].$==e[n].$&&r[t]<=r[n]}function T_(e,t,n){let r=e.pe[n],i=n<<1;for(;i<=e.Ne&&(i<e.Ne&&ot(t,e.pe[i+1],e.pe[i],e.ze)&&i++,!ot(t,r,e.pe[i],e.ze));)e.pe[n]=e.pe[i],n=i,i<<=1;e.pe[n]=r;}function cn(e,t){let n,r,i,f,_,l,o=t.t,u=t._,a=t.i.l,c=t.i.o,s=t.i.u,d=t.i.k,h=0;for(f=0;f<=ce;f++)e.Ae[f]=0;for(o[e.pe[e.Se]].$e=0,n=e.Se+1;n<oe;n++)r=e.pe[n],f=o[o[r].Ee].$e+1,f>d&&(f=d,h++),o[r].$e=f,!(r>u)&&(e.Ae[f]++,_=0,r>=s&&(_=c[r-s]),l=o[r].$,e.ie+=l*(f+_),a&&(e.fe+=l*(a[r].$e+_)));if(0!=h){do{for(f=d-1;0==e.Ae[f];)f--;e.Ae[f]--,e.Ae[f+1]+=2,e.Ae[d]--,h-=2;}while(h>0);for(f=d;0!=f;f--)for(r=e.Ae[f];0!=r;)i=e.pe[--n],!(i>u)&&(o[i].$e!=f&&(e.ie+=(f-o[i].$e)*o[i].$,o[i].$e=f),r--);}}function A_(e,t){let n,r,i,f=t.t,_=t.i.l,l=t.i.h,o=-1;for(e.Ne=0,e.Se=oe,n=0;n<l;n++)0!=f[n].$?(e.pe[++e.Ne]=o=n,e.ze[n]=0):f[n].$e=0;for(;e.Ne<2;)i=e.pe[++e.Ne]=o<2?++o:0,f[i].$=1,e.ze[i]=0,e.ie--,_&&(e.fe-=_[i].$e);for(t._=o,n=N.floor(e.Ne/2);n>=1;n--)T_(e,f,n);i=l;do{n=un(e,f,n),r=e.pe[me],e.pe[--e.Se]=n,e.pe[--e.Se]=r,f[i].$=f[n].$+f[r].$,e.ze[i]=(e.ze[n]>=e.ze[r]?e.ze[n]:e.ze[r])+1,f[n].Ee=f[r].Ee=i,e.pe[me]=i++,T_(e,f,me);}while(e.Ne>=2);e.pe[--e.Se]=e.pe[me],cn(e,t),fn(f,t._,e.Ae);}function lt(e,t,n){let r,i,f=-1,_=t[0].$e,l=0,o=7,u=4;for(0==_&&(o=138,u=3),t[n+1].$e=65535,r=0;r<=n;r++)i=_,_=t[r+1].$e,!(++l<o&&i==_)&&(l<u?e.Xe[i].$+=l:0!=i?(i!=f&&e.Xe[i].$++,e.Xe[Ve].$++):l<=10?e.Xe[Je].$++:e.Xe[Qe].$++,l=0,f=i,0==_?(o=138,u=3):i==_?(o=6,u=3):(o=7,u=4));}function ft(e,t,n){let r,i=-1,f=t[0].$e,_=0,l=7,o=4;0==f&&(l=138,o=3);for(let u=0;u<=n;u++)if(r=f,f=t[u+1].$e,!(++_<l&&r==f)){if(_<o)do{O(e,e.Xe[r].Qe,e.Xe[r].$e);}while(0!=--_);else 0!=r?(r!=i&&(O(e,e.Xe[r].Qe,e.Xe[r].$e),_--),O(e,e.Xe[Ve].Qe,e.Xe[Ve].$e),O(e,_-3,2)):_<=10?(O(e,e.Xe[Je].Qe,e.Xe[Je].$e),O(e,_-3,3)):(O(e,e.Xe[Qe].Qe,e.Xe[Qe].$e),O(e,_-11,7));_=0,i=r,0==f?(l=138,o=3):r==f?(l=6,o=3):(l=7,o=4);}}function dn(e){let t;for(lt(e,e.B,e.Ve._),lt(e,e.I,e.Te._),A_(e,e.Ue),t=ie-1;t>=3&&0==e.Xe[xe[t]].$e;t--);return e.ie+=3*(t+1)+5+5+4,t}function mn(e,t,n,r){let i;for(O(e,t-257,5),O(e,n-1,5),O(e,r-4,4),i=0;i<r;i++)O(e,e.Xe[xe[i]].$e,3);ft(e,e.B,t-1),ft(e,e.I,n-1);}function He(e,t,n,r,i=0){O(e,(tt<<1)+r,3),dt(e),ge(e,n),ge(e,~n),n&&t&&M(e.X,e.V,t,i,n),e.V+=n;}function ht(e){ct(e);}function st(e){O(e,S_<<1,3),O(e,Le[Te].Qe,Le[Te].$e),ct(e);}function ut(e,t,n){let r,i,f,_,l=0;if(0!=e.U)do{r=255&e.Oe[l],r+=(255&e.Oe[l+1])<<8,i=e.Oe[l+2],l+=3,0==r?O(e,t[i].Qe,t[i].$e):(f=je[i],O(e,t[f+ae+1].Qe,t[f+ae+1].$e),_=$e[f],0!=_&&(i-=g_[f],O(e,i,_)),r--,f=h_(r),O(e,n[f].Qe,n[f].$e),_=e_[f],0!=_&&(r-=E_[f],O(e,r,_)));}while(l<e.U);O(e,t[Te].Qe,t[Te].$e);}function bn(e){let t,n=4093624447;for(t=0;t<=31;t++,n>>=1)if(1&n&&0!=e.B[t].$)return 0;if(0!=e.B[9].$||0!=e.B[10].$||0!=e.B[13].$)return 1;for(t=32;t<ae;t++)if(0!=e.B[t].$)return 1;return 0}function xt(e,t,n,r,i=0){let f,_,l=0;e.ge>0?(2==e.O.m&&(e.O.m=bn(e)),A_(e,e.Ve),A_(e,e.Te),l=dn(e),f=e.ie+3+7>>3,_=e.fe+3+7>>3,(_<=f||4==e.be)&&(f=_)):f=_=n+5,n+4<=f&&t?He(e,t,n,r,i):_==f?(O(e,(S_<<1)+r,3),ut(e,Le,w_)):(O(e,(nt<<1)+r,3),mn(e,e.Ve._+1,e.Te._+1,l+1),ut(e,e.B,e.I)),mt(e),r&&dt(e);}function Et(){let e=We();return e.A=s_(e),e}var Be=[{Be:vt,Ie:0,Ze:0,He:0,Le:0},{Be:v_,Ie:4,Ze:4,He:8,Le:4},{Be:v_,Ie:5,Ze:5,He:16,Le:8},{Be:v_,Ie:6,Ze:16,He:32,Le:32},{Be:De,Ie:4,Ze:4,He:16,Le:16},{Be:De,Ie:16,Ze:8,He:16,Le:32},{Be:De,Ie:16,Ze:16,He:32,Le:128},{Be:De,Ie:32,Ze:32,He:128,Le:256},{Be:De,Ie:128,Ze:128,He:256,Le:1024},{Be:De,Ie:258,Ze:258,He:258,Le:4096}];function pt(e){return 2*e-(e>4?9:0)}function n_(e,t,n){return ((t<<e.j^n)&e.Y)>>>0}function r_(e,t){e.ke=n_(e,e.ke,e.M[t+(k-1)]);let n=e.P[t&e.W]=e.G[e.ke];return e.G[e.ke]=t,n}function wt(e){e.G[e.R-1]=0,Ye(e.G,0,(e.R-1)*e.G.BYTES_PER_ELEMENT);}function gn(e){let t,n,r=e.F;for(t=e.R;t>0;)t--,n=e.G[t],e.G[t]=n>=r?n-r:0;for(t=r;t>0;)t--,n=e.P[t],e.P[t]=n>=r?n-r:0;}function I_(e,t,n,r){let i=e.avail_in;return i>r&&(i=r),0==i?0:(e.avail_in-=i,M(t,n,e.next_in,e.next_in_index,i),1==e.A.L?e.v=de(e.v,new x(t.buffer,t.byteOffset+n,i),i):2==e.A.L&&(e.v=X(e.v,new x(t.buffer,t.byteOffset+n,i),i)),e.next_in_index+=i,e.total_in+=i,i)}function a_(e){let t,n,r=e.F;do{if(n=e.qe-e.ce-e.ae,0==n&&0==e.ae&&0==e.ce?n=r:-1==n&&n--,e.ae>=r+we(e)&&(M(e.M,0,e.M,r,r-n),e.Ce-=r,e.ae-=r,e.ue-=r,e.le>e.ae&&(e.le=e.ae),gn(e),n+=r),0==e.O.avail_in)break;if(t=I_(e.O,e.M,e.ae+e.ce,n),e.ce+=t,e.ce+e.le>=k){let t=e.ae-e.le;for(e.ke=e.M[t],e.ke=n_(e,e.ke,e.M[t+1]);e.le&&(e.ke=n_(e,e.ke,e.M[t+k-1]),e.P[t&e.W]=e.G[e.ke],e.G[e.ke]=t,t++,e.le--,!(e.ce+e.le<k)););}}while(e.ce<re&&0!=e.O.avail_in);if(e.q<e.qe){let t,n=e.ae+e.ce;e.q<n?(t=e.qe-n,t>Ce&&(t=Ce),Ye(e.M,n,t),e.q=n+t):e.q<n+Ce&&(t=n+Ce-e.q,t>e.qe-e.q&&(t=e.qe-e.q),Ye(e.M,e.q,t),e.q+=t);}}function Tt(e,t,n=8,r=15,i=Re,f=0){let _=1;if(!e)return  -2;if(e.msg="",-1==t&&(t=6),r<0){if(_=0,r<-15)return  -2;r=-r;}else r>15&&(_=2,r-=16);if(i<1||i>Q_||8!=n||r<8||r>15||t<0||t>9||f<0||f>4||8==r&&1!=_)return  -2;8==r&&(r=9);let l=s_(e);return l?(e.A=l,l.O=e,l.H=42,l.L=_,l.K=void 0,l.D=r,l.F=1<<l.D,l.W=l.F-1,l.J=i+7,l.R=1<<l.J,l.Y=l.R-1,l.j=(l.J+k-1)/k,l.M=new x(2*l.F),l.P=new A(l.F),l.G=new A(l.R),l.q=0,l.ee=1<<i+6,l.X=new x(l.ee*_t),l.ne=4*l.ee,l.M&&l.P&&l.G&&l.X?(l.Oe=l.X.subarray(l.ee),l.T=l.te+l.ee,l.Z=3*(l.ee-1),l.ge=t,l.be=f,l.De=n,Tn(e)):(l.H=666,e.msg=b_(-4),C_(e),-4)):-4}function z_(e){if(null==e)return  true;let t=e.A;return !t||t.O!=e||42!=t.H&&57!=t.H&&69!=t.H&&73!=t.H&&91!=t.H&&103!=t.H&&113!=t.H&&666!=t.H}function En(e){let t;return z_(e)?-2:(e.total_in=e.total_out=0,e.msg="",e.m=2,t=e.A,t.V=0,t.re=t.te,t.L<0&&(t.L=-t.L),t.H=2==t.L?57:42,e.v=2==t.L?X(0):de(0),t.oe=-2,bt(t),0)}function wn(e){e.qe=2*e.F,wt(e),e.ye=Be[e.ge].Ie,e.me=Be[e.ge].Ze,e.xe=Be[e.ge].He,e.ve=Be[e.ge].Le,e.ae=0,e.ue=0,e.ce=0,e.le=0,e.se=e.de=k-1,e.we=0,e.ke=0;}function Tn(e){let t=En(e);return 0==t&&wn(e.A),t}function Ue(e,t){g(e,t>>8),g(e,255&t);}function q(e){let t,n=e.A;ht(n),t=n.V,t>e.avail_out&&(t=e.avail_out),0!=t&&(M(e.next_out,e.next_out_index,n.X,n.re,t),e.next_out_index+=t,n.re+=t,e.total_out+=t,e.avail_out-=t,n.V-=t,0==n.V&&(n.re=n.te));}function Ae(e,t){let n=e.A;n.K&&n.K.Ke&&(e.v=X(e.v,new x(n.X.buffer,n.te+t,n.V-t),n.V-t));}function At(e,t){let n,r=e.A;if(z_(e)||t>5||t<0)return Se(e,-2);if(!e.next_out||0!=e.avail_in&&!e.next_in||666==r.H&&4!=t)return Se(e,-2);if(0==e.avail_out)return Se(e,-5);if(n=r.oe,r.oe=t,0!=r.V){if(q(e),0==e.avail_out)return r.oe=$,0}else if(0==e.avail_in&&pt(t)<=pt(n)&&4!=t)return Se(e,-5);if(666==r.H&&0!=e.avail_in)return Se(e,-5);if(42==r.H&&0==r.L&&(r.H=113),42==r.H){let t,n=8+(r.D-8<<4)<<8;if(t=r.be>=2||r.ge<2?0:r.ge<6?1:6==r.ge?2:3,n|=t<<6,0!=r.ae&&(n|=et),n+=31-n%31,Ue(r,n),0!=r.ae&&(Ue(r,e.v>>16),Ue(r,65535&e.v)),e.v=1,r.H=113,q(e),0!=r.V)return r.oe=$,0}if(57==r.H)if(e.v=X(0),g(r,31),g(r,139),g(r,8),r.K)g(r,(r.K.We?1:0)+(r.K.Ke?2:0)+(null==r.K.Je?0:4)+(null==r.K.Re?0:8)+(null==r.K.Ye?0:16)),g(r,255&r.K.je),g(r,r.K.je>>>8&255),g(r,r.K.je>>>16&255),g(r,r.K.je>>>24&255),g(r,9==r.ge?2:r.be>=2||r.ge<2?4:0),g(r,255&r.K.Pe),null!=r.K.Je&&(g(r,255&r.K.Ge),g(r,r.K.Ge>>>8&255)),r.K.Ke&&(e.v=X(e.v,r.X,r.V)),r.Fe=0,r.H=69;else if(g(r,0),g(r,0),g(r,0),g(r,0),g(r,0),g(r,9==r.ge?2:r.be>=2||r.ge<2?4:0),g(r,$_),r.H=113,q(e),0!=r.V)return r.oe=$,0;if(69==r.H){if(r.K&&null!=r.K.Je){let t=r.V,n=(65535&r.K.Ge)-r.Fe;for(;r.V+n>r.ne;){let i=r.ne-r.V;if(M(r.X,r.V,r.K.Je,r.Fe,i),r.V=r.ne,Ae(e,t),r.Fe+=i,q(e),0!=r.V)return r.oe=$,0;t=0,n-=i;}M(r.X,r.V,r.K.Je,r.Fe,n),r.V+=n,Ae(e,t),r.Fe=0;}r.H=73;}if(73==r.H){if(r.K&&r.K.Re&&r.K.Re.length){let t,n=r.V;do{if(r.V==r.ne){if(Ae(e,n),q(e),0!=r.V)return r.oe=$,0;n=0;}t=r.K.Re[r.Fe++],g(r,t);}while(0!=t);Ae(e,n),r.Fe=0;}r.H=91;}if(91==r.H){if(r.K&&r.K.Ye&&r.K.Ye.length){let t,n=r.V;do{if(r.V==r.ne){if(Ae(e,n),q(e),0!=r.V)return r.oe=$,0;n=0;}t=r.K.Ye[r.Fe++],g(r,t);}while(0!=t);Ae(e,n);}r.H=103;}if(103==r.H){if(r.K&&r.K.Ke){if(r.V+2>r.ne&&(q(e),0!=r.V))return r.oe=$,0;g(r,255&e.v),g(r,e.v>>>8&255),e.v=X(0);}if(r.H=113,q(e),0!=r.V)return r.oe=$,0}if(0!=e.avail_in||0!=r.ce||0!=t&&666!=r.H){let n=0==r.ge?vt(r,t):2==r.be?yn(r,t):3==r.be?An(r,t):Be[r.ge].Be(r,t);if((2==n||3==n)&&(r.H=666),0==n||2==n)return 0==e.avail_out&&(r.oe=$),0;if(1==n&&(1==t?st(r):5!=t&&(He(r,null,0,0),3==t&&(wt(r),0==r.ce&&(r.ae=0,r.ue=0,r.le=0))),q(e),0==e.avail_out))return r.oe=$,0}return 4!=t?0:r.L<=0?1:(2==r.L?(g(r,255&e.v),g(r,e.v>>>8&255),g(r,e.v>>>16&255),g(r,e.v>>>24&255),g(r,255&e.total_in),g(r,e.total_in>>>8&255),g(r,e.total_in>>>16&255),g(r,e.total_in>>>24&255)):(Ue(r,e.v>>>16&65535),Ue(r,65535&e.v)),q(e),r.L>0&&(r.L=-r.L),0!=r.V?0:1)}function C_(e){if(z_(e))return  -2;let t=e.A,n=t.H;return t.M=F,t.P=Me,t.G=Me,t.X=F,t.Oe=F,t.pe=new z(0),t.ze=F,t.Ae=Me,t.B.length=0,t.I.length=0,t.Xe.length=0,t.K=void 0,t.te=0,t.re=0,t.T=0,113==n?-3:0}function yt(e,t){let n,r,i=e.ve,f=e.ae,_=e.de,l=e.xe,o=e.ae>we(e)?e.ae-we(e):0,u=e.P,a=e.W,c=e.M[f],s=e.M[f+1],d=e.M[f+_-1],h=e.M[f+_];e.de>=e.me&&(i>>=2),l>e.ce&&(l=e.ce);do{if(n=t,e.M[n+_]!=h||e.M[n+_-1]!=d||e.M[n]!=c||e.M[n+1]!=s)continue;let i=N.min(_e,e.ce),o=2;for(;o<i&&e.M[f+o]==e.M[n+o];)o++;if(r=o,r>_){if(e.Ce=t,_=r,r>=l)break;d=e.M[f+_-1],h=e.M[f+_];}}while((t=u[t&a])>o&&0!=--i);return _<=e.ce?_:e.ce}function Dt(e,t){xt(e,e.M,e.ae-e.ue,t,e.ue),e.ue=e.ae,q(e.O);}function V(e,t){return Dt(e,t?1:0),0==e.O.avail_out?t?2:0:null}var St=65535;function ye(e,t){return e<t?e:t}function vt(e,t){let n,r,i,f=ye(e.ne-5,e.F),_=0,l=e.O.avail_in;do{if(n=St,i=e.S+42>>3,e.O.avail_out<i||(i=e.O.avail_out-i,r=e.ae-e.ue,n>r+e.O.avail_in&&(n=r+e.O.avail_in),n>i&&(n=i),n<f&&(0==n&&4!=t||0==t||n!=r+e.O.avail_in)))break;_=4==t&&n==r+e.O.avail_in?1:0,He(e,null,0,_),e.X[e.V-4]=n,e.X[e.V-3]=n>>8,e.X[e.V-2]=~n,e.X[e.V-1]=~n>>8,q(e.O),r&&(r>n&&(r=n),M(e.O.next_out,e.O.next_out_index,e.M,e.ue,r),e.O.next_out_index+=r,e.O.avail_out-=r,e.O.total_out+=r,e.ue+=r,n-=r),n&&(I_(e.O,e.O.next_out,e.O.next_out_index,n),e.O.next_out_index+=n,e.O.avail_out-=n,e.O.total_out+=n);}while(0==_);if(l-=e.O.avail_in,l){if(l>=e.F){e._e=2;let t=e.O.next_in_index-e.F;M(e.M,0,e.O.next_in,t,e.F),e.ae=e.F,e.le=e.ae;}else e.qe-e.ae<=l&&(e.ae-=e.F,M(e.M,0,e.M,e.F,e.ae),e._e<2&&e._e++,e.le>e.ae&&(e.le=e.ae)),M(e.M,e.ae,e.O.next_in,e.O.next_in_index-l,l),e.ae+=l,e.le+=ye(l,e.F-e.le);e.ue=e.ae;}return e.q<e.ae&&(e.q=e.ae),_?(e.Me=8,3):0!=t&&4!=t&&0==e.O.avail_in&&e.ae==e.ue?1:(i=e.qe-e.ae,e.O.avail_in>i&&e.ue>=e.F&&(e.ue-=e.F,e.ae-=e.F,M(e.M,0,e.M,e.F,e.ae),e._e<2&&e._e++,i+=e.F,e.le>e.ae&&(e.le=e.ae)),i>e.O.avail_in&&(i=e.O.avail_in),i&&(I_(e.O,e.M,e.ae,i),e.ae+=i,e.le+=ye(i,e.F-e.le)),e.q<e.ae&&(e.q=e.ae),i=e.S+42>>3,i=ye(e.ne-i,St),f=ye(i,e.F),r=e.ae-e.ue,(r>=f||(r||4==t)&&0!=t&&0==e.O.avail_in&&r<=i)&&(n=ye(r,i),_=4==t&&0==e.O.avail_in&&n==r?1:0,He(e,e.M,n,_,e.ue),e.ue+=n,q(e.O)),_&&(e.Me=8),_?2:0)}function v_(e,t){let n,r=false;for(;;){if(e.ce<re){if(a_(e),e.ce<re&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=k&&(n=r_(e,e.ae)),0!=n&&e.ae-n<=we(e)&&(e.se=yt(e,n)),e.se>=k)if(e.ae,e.Ce,e.se,r=qe(e,e.ae-e.Ce,e.se-k),e.ce-=e.se,e.se<=e.ye&&e.ce>=k){e.se--;do{e.ae++,n=r_(e,e.ae);}while(0!=--e.se);e.ae++;}else e.ae+=e.se,e.se=0,e.ke=e.M[e.ae],e.ke=n_(e,e.ke,e.M[e.ae+1]);else r=Ee(e,e.M[e.ae]),e.ce--,e.ae++;if(r){let t=V(e,false);if(null!=t)return t}}if(e.le=e.ae<k-1?e.ae:k-1,4==t){return V(e,true)??3}if(e.U){let t=V(e,false);if(null!=t)return t}return 1}function De(e,t){let n,r=false;for(;;){if(e.ce<re){if(a_(e),e.ce<re&&0==t)return 0;if(0==e.ce)break}if(n=0,e.ce>=k&&(n=r_(e,e.ae)),e.de=e.se,e.he=e.Ce,e.se=k-1,0!=n&&e.de<e.ye&&e.ae-n<=we(e)&&(e.se=yt(e,n),e.se<=5&&1==e.be&&(e.se=k-1)),e.de>=k&&e.se<=e.de){let t=e.ae+e.ce-k;e.ae,e.he,e.de,r=qe(e,e.ae-1-e.he,e.de-k),e.ce-=e.de-1,e.de-=2;do{++e.ae<=t&&(n=r_(e,e.ae));}while(0!=--e.de);if(e.we=0,e.se=k-1,e.ae++,r){let t=V(e,false);if(null!=t)return t}}else if(e.we){if(r=Ee(e,e.M[e.ae-1]),r&&Dt(e,0),e.ae++,e.ce--,0==e.O.avail_out)return 0}else e.we=1,e.ae++,e.ce--;}if(e.we&&(r=Ee(e,e.M[e.ae-1]),e.we=0),e.le=e.ae<k-1?e.ae:k-1,4==t){return V(e,true)??3}if(e.U){let t=V(e,false);if(null!=t)return t}return 1}function An(e,t){let n,r,i,f;for(;;){if(e.ce<=_e){if(a_(e),e.ce<=_e&&0==t)return 0;if(0==e.ce)break}if(e.se=0,e.ce>=k&&e.ae>0&&(i=e.ae-1,r=e.M[i],r==++i&&r==++i&&r==++i)){f=e.ae+_e;do{}while(r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&r==++i&&i<f);e.se=_e-(f-i),e.se>e.ce&&(e.se=e.ce);}if(e.se>=k?(e.ae,e.ae,e.se,n=qe(e,1,e.se-k),e.ce-=e.se,e.ae+=e.se,e.se=0):(n=Ee(e,e.M[e.ae]),e.ce--,e.ae++),n){let t=V(e,false);if(null!=t)return t}}if(e.le=0,4==t){return V(e,true)??3}if(e.U){let t=V(e,false);if(null!=t)return t}return 1}function yn(e,t){let n=false;for(;;){if(0==e.ce&&(a_(e),0==e.ce)){if(0==t)return 0;break}if(e.se=0,n=Ee(e,e.M[e.ae]),e.ce--,e.ae++,n){let t=V(e,false);if(null!=t)return t}}if(e.le=0,4==t){return V(e,true)??3}if(e.U){let t=V(e,false);if(null!=t)return t}return 1}var It=new A([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),kt=i_([16,8,17,4,18,4,19,4,20,4,21,4,16,1,73,1,200,1]),Nt=new A([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),Rt=i_([16,4,17,2,18,2,19,2,20,2,21,2,22,2,23,2,24,2,25,2,26,2,27,2,28,2,29,2,64,2]),zt=new A([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,3,0,0]),Ct=i_([128,8,129,4,130,4,131,4,132,4,133,4,16,1,73,1,200,1]),Lt=new A([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,32769,49153]),Ot=i_([128,4,129,2,130,2,131,2,132,2,133,2,134,2,135,2,136,2,137,2,138,2,139,2,140,2,141,2,142,2]);function i_(e){let t=[];for(let n=0;n<e.length;n+=2){let r=e[n],i=e[n+1];for(let e=0;e<i;e++)t.push(r);}return new A(t)}function Ut(e,t){let n,r=e.A,i=e.next_in_index,f=e.next_out_index,_=e.next_in,l=e.next_out,o=r.M,u=r.N>>>0,a=r.S>>>0,c=r.et,s=r.tt,d=(1<<r.nt)-1,h=(1<<r.rt)-1,w=r.F>>>0,k=r.q>>>0,g=r.C>>>0,b=r.it,m=f-(t-e.avail_out),x=f+(e.avail_out-257),v=i+(e.avail_in-5),y=0,p=0,z=0,A=0;e:do{for(;a<15;){if(!(i<_.length))break e;u+=_[i++]<<a,a+=8;}n=c[u&d];t:for(;;){if(z=n.ft,u>>>=z,a-=z,z=n._t,0==z){l[f++]=n.lt;break}if(16&z){if(y=n.lt,z&=15,z){for(;a<z;){if(!(i<_.length)){r.ot=16200;break e}u+=_[i++]<<a,a+=8;}y+=u&(1<<z)-1,u>>>=z,a-=z;}for(;a<15;){if(!(i<_.length)){r.ot=16200;break e}u+=_[i++]<<a,a+=8;}n=s[u&h];n:for(;;){if(z=n.ft,u>>>=z,a-=z,z=n._t,16&z){if(p=n.lt,z&=15,z){for(;a<z;){if(!(i<_.length)){r.ot=16200;break e}u+=_[i++]<<a,a+=8;}p+=u&(1<<z)-1,u>>>=z,a-=z;}let t=y,c=f-m;if(p>c){let n=p-c;if(n>k&&b){e.msg="invalid distance too far back",r.ot=16209;break e}if(0==g){if(A=w-n,!(n<t)){for(let e=0;e<t;++e)l[f++]=o[A++];continue e}for(let e=0;e<n;++e)l[f++]=o[A++];t-=n,A=f-p;}else if(g<n){A=w+g-n;let e=n-g;if(!(e<t)){for(let e=0;e<t;++e)l[f++]=o[A++];continue e}for(let t=0;t<e;++t)l[f++]=o[A++];if(t-=e,A=0,g<t){for(let e=0;e<g;++e)l[f++]=o[A++];t-=g,A=f-p;}}else {if(A=g-n,!(n<t)){for(let e=0;e<t;++e)l[f++]=o[A++];continue e}for(let e=0;e<n;++e)l[f++]=o[A++];t-=n,A=f-p;}for(;t>2;)l[f++]=l[A++],l[f++]=l[A++],l[f++]=l[A++],t-=3;t&&(l[f++]=l[A++],t>1&&(l[f++]=l[A++]));}else {for(A=f-p;t>2;)l[f++]=l[A++],l[f++]=l[A++],l[f++]=l[A++],t-=3;t&&(l[f++]=l[A++],t>1&&(l[f++]=l[A++]));}break}if(64&z){e.msg="invalid distance code",r.ot=16209;break e}n=s[n.lt+(u&(1<<z)-1)];continue n}break}if(64&z){if(32&z){r.ot=16191;break e}e.msg="invalid literal/length code",r.ot=16209;break e}n=c[n.lt+(u&(1<<z)-1)];continue t}}while(i<v&&f<x);let O=a>>3;i-=O,a-=O<<3,u&=(1<<a)-1,e.next_in_index=i,e.next_out_index=f,e.avail_in=i<v?v-i+5:5-(i-v),e.avail_out=f<x?x-f+257:257-(f-x),r.N=u>>>0,r.S=a>>>0;}function H_(e,t){let n=[],r=t?1446:1444;return {...Xe(e,0),O:e,ot:16180,ut:false,L:0,ct:false,st:0,dt:0,ht:0,wt:0,M:F,kt:0,gt:0,Je:0,et:n,tt:n,nt:0,rt:0,bt:0,xt:0,vt:0,yt:0,zt:n,At:new A(320),Ot:new A(288),Mt:new D(r).fill(null).map(()=>se()),Ft:0,it:true,Dt:0,qt:0,Ct:t}}function se(e=0,t=0,n=0){return {_t:e,ft:t,lt:n}}function U_(e=1){return {_t:64,ft:e,lt:0}}function Bt(e=0){return {_t:96,ft:e,lt:0}}function B_(e){return (255&e)<<24|(e>>8&255)<<16|(e>>16&255)<<8|e>>24&255}var ke=15,vn={Ct:false,Nt:It,St:kt,Xt:Nt,Vt:Rt,Tt:20,Ut:257,Qt:0,$t:592,Et:false,Bt:true},In={Ct:true,Nt:zt,St:Ct,Xt:Lt,Vt:Ot,Tt:19,Ut:256,Qt:-1,$t:594,Et:true,Bt:false};function Ne(e,t,n,r,i,f,_,l){let o,u,a,c,s,d,h,w,k,g,b,m,x,v,y,p,z,O,M,F=new A(ke+1),D=new A(ke+1),q=l?In:vn;for(o=0;o<=ke;o++)F[o]=0;for(u=0;u<n;u++)F[t[u]]++;for(s=i.It,c=ke;c>=1&&0==F[c];c--);if(s>c&&(s=c),0==c)return q.Bt?(y=U_(1),r.It[0]=y,r.It[1]=y,i.It=1,0):-1;for(a=1;a<c&&0==F[a];a++);for(s<a&&(s=a),w=1,o=1;o<=ke;o++)if(w<<=1,w-=F[o],w<0)return  -1;if(w>0&&(0==e||1!=c))return  -1;for(D[1]=0,o=1;o<ke;o++)D[o+1]=D[o]+F[o];for(u=0;u<n;u++)0!=t[u]&&(f[D[t[u]]++]=u);switch(e){case 0:z=O=f,M=q.Tt;break;case 1:z=q.Nt,O=q.St,M=q.Ut;break;default:z=q.Xt,O=q.Vt,M=q.Qt;}if(g=0,u=0,o=a,p=_.It,d=s,h=0,x=-1,k=1<<s,v=k-1,1==e&&(q.Et?k>=852:k>852)||2==e&&(q.Et?k>=q.$t:k>q.$t))return 1;for(;;){y=kn(f,u,o,h,e,z,O,M,q.Ct),b=1<<o-h,m=1<<d,a=m;do{m-=b;let e=(g>>h)+m;r.It[p+e]={...y};}while(0!=m);for(b=1<<o-1;g&b;)b>>=1;if(0!=b?(g&=b-1,g+=b):g=0,u++,0==--F[o]){if(o==c)break;o=t[f[u]];}if(o>s&&(g&v)!=x){for(0==h&&(h=s),p+=1<<d,d=o-h,w=1<<d;d+h<c&&(w-=F[d+h],!(w<=0));)d++,w<<=1;if(k+=1<<d,1==e&&(q.Et?k>=852:k>852)||2==e&&(q.Et?k>=q.$t:k>q.$t))return 1;x=g&v,r.It[_.It+x]={_t:d,ft:s,lt:p-_.It};}}if(0!=g)for(y=U_(o-h);0!=g;){for(0!=h&&(g&v)!=x&&(h=0,o=s,p=_.It,d=s,y.ft=o),r.It[p+(g>>h)]={...y},b=1<<o-1;g&b;)b>>=1;0!=b?(g&=b-1,g+=b):g=0;}return _.It+=k,i.It=s,0}function kn(e,t,n,r,i,f,_,l,o){let u;if(o?e[t]<l:e[t]+1<l)u=se(0,n-r,e[t]);else if(o?e[t]>l:e[t]>=l)if(o&&1==i){let i=e[t]-257;u=se(_[i],n-r,f[i]);}else {let i=o?e[t]:e[t]-l;u=se(_[i],n-r,f[i]);}else u=Bt(n-r);return u}var Pt,Mt,Zt=new D(544),Ft=true;function Yt(e){let t=We();return t.A=H_(t,!!e),t}function Fe(e){let t;return !(e&&(t=e.A,!(!t||t.O!=e||t.Ct&&(t.ot<16191||t.ot>16209)||!t.Ct&&(t.ot<16180||t.ot>16211))))}function Ln(e){let t;return Fe(e)?-2:(t=e.A,e.total_in=e.total_out=t.wt=0,e.msg="",t.L&&(e.v=1&t.L),t.ot=t.Ct?16191:16180,t.ut=false,t.ct=false,t.st=-1,t.dt=t.Ct?65536:32768,delete t.K,t.N=0,t.S=0,t.et=t.Mt,t.tt=t.Mt,t.zt=t.Mt,t.it=true,t.Dt=-1,0)}function On(e){let t;return Fe(e)?-2:(t=e.A,t.F=0,t.q=0,t.C=0,Ln(e))}function Hn(e,t){let n,r,i;if(Fe(e))return  -2;if(r=e.A,r.Ct?(t=-16,i=16):i=15,t<0){if(t<-i)return  -2;n=0,t=-t;}else n=5+(t>>4),!r.Ct&&t<48&&(t&=15);return t&&(t<8||t>i)?-2:(r.M.length>0&&r.D!=t&&(r.M=F),r.L=n,r.D=t,On(e))}function Wt(e,t){let n,r;if(!e)return  -2;e.msg="";let i=!!e.A.Ct;return r=H_(e,i),i&&(t=-16),e.A=r,r.O=e,r.ot=r.Ct?16191:16180,n=Hn(e,t),n}function Un(e){let t={It:0};if(Ft){let n,r,i;for(n=0;n<144;)e.At[n++]=8;for(;n<256;)e.At[n++]=9;for(;n<280;)e.At[n++]=7;for(;n<288;)e.At[n++]=8;for(let e=0;e<544;e++)Zt[e]=se();i=Zt,Pt=i,r=9;let f={It:i},_={It:r},l={It:0};for(Ne(1,e.At,288,f,_,e.Ot,l,e.Ct),i=f.It,r=_.It,e.Ft=l.It,n=0;n<32;)e.At[n++]=5;r=5;let o=l.It,u={It:i},a={It:r};t.It=o,Ne(2,e.At,32,u,a,e.Ot,t,e.Ct),Mt=i.slice(o),Ft=false;}e.et=Pt,e.nt=9,e.tt=Mt,e.rt=5,e.Ft=t.It;}function Bn(e,t,n){let r=e.A;if(!(r.M&&0!=r.M.length||(r.M=new x(1<<r.D),r.M)))return 1;if(0==r.F&&(r.F=1<<r.D,r.C=0,r.q=0),n>=r.F)M(r.M,0,t,t.length-r.F,r.F),r.C=0,r.q=r.F;else {let e=r.F-r.C;e>n&&(e=n),M(r.M,r.C,t,t.length-n,e),(n-=e)?(M(r.M,0,t,t.length-n,n),r.C=n,r.q=r.F):(r.C+=e,r.C==r.F&&(r.C=0),r.q<r.F&&(r.q+=e));}return 0}var l_=class extends C{constructor(){super("Need more input");}};function Xt(e,t){let n,r,i,f,_,l,o,u,a,c,s,d,h,w,k,g,b,m=new x(4);if(Fe(e)||!e.next_out||!e.next_in&&0!=e.avail_in)return  -2;l=0,u=0,o=0,a=0,r=F,i=0,f=F,_=0,n=e.A,16191==n.ot&&(n.ot=16192),A(),c=l,s=o,b=0;try{for(;;)switch(n.ot){case 16180:if(0==n.L){n.ot=16192;break}if(C(16),2&n.L&&35615==u){0==n.D&&(n.D=15),n.ht=X(0),n.ht=p(n.ht,u),D(),n.ot=16181;break}if(n.K&&(n.K.Zt=-1),!(1&n.L)||((N(8)<<8)+(u>>8))%31){e.msg="incorrect header check",n.ot=16209;break}if(8!=N(4)){e.msg="unknown compression method",n.ot=16209;break}if(S(4),g=N(4)+8,0==n.D&&(n.D=g),g>15||g>n.D){e.msg="invalid window size",n.ot=16209;break}n.dt=1<<g,n.st=0,e.v=n.ht=de(0),n.ot=512&u?16189:16191,D();break;case 16181:if(C(16),n.st=u,8!=(255&n.st)){e.msg="unknown compression method",n.ot=16209;break}if(57344&n.st){e.msg="unknown header flags set",n.ot=16209;break}n.K&&(n.K.We=u>>8&1),512&n.st&&4&n.L&&(n.ht=p(n.ht,u)),D(),n.ot=16182;case 16182:C(32),n.K&&(n.K.je=u),512&n.st&&4&n.L&&(n.ht=z(n.ht,u)),D(),n.ot=16183;case 16183:C(16),n.K&&(n.K.Ht=255&u,n.K.Pe=u>>8),512&n.st&&4&n.L&&(n.ht=p(n.ht,u)),D(),n.ot=16184;case 16184:1024&n.st?(C(16),n.kt=u,n.K&&(n.K.Ge=u),512&n.st&&4&n.L&&(n.ht=p(n.ht,u)),D()):n.K&&(n.K.Je=F),n.ot=16185;case 16185:if(1024&n.st&&(d=n.kt,d>l&&(d=l),d&&(n.K&&n.K.Je&&n.K.Lt&&(g=n.K.Ge-n.kt)<n.K.Lt&&M(n.K.Je,g,r,i,d),512&n.st&&4&n.L&&(n.ht=X(n.ht,r.subarray(i,i+d),d)),l-=d,i+=d,n.kt-=d),n.kt))return v();n.kt=0,n.ot=16186;case 16186:if(2048&n.st){if(0==l)return v();d=0;do{g=r[i+d++],n.K&&n.K.Kt&&n.kt<n.K.Kt&&(n.K.Re[n.kt++]=g);}while(g&&d<l);if(512&n.st&&4&n.L&&(n.ht=X(n.ht,r.subarray(i,i+d),d)),l-=d,i+=d,g)return v()}else n.K&&(n.K.Re=F);n.kt=0,n.ot=16187;case 16187:if(4096&n.st){if(0==l)return v();d=0;do{g=r[i+d++],n.K&&n.K.Wt&&n.kt<n.K.Wt&&(n.K.Ye[n.kt++]=g);}while(g&&d<l);if(512&n.st&&4&n.L&&(n.ht=X(n.ht,r.subarray(i,i+d),d)),l-=d,i+=d,g)return v()}else n.K&&(n.K.Ye=F);n.ot=16188;case 16188:if(512&n.st){if(C(16),4&n.L&&u!=(65535&n.ht)){e.msg="header crc mismatch",n.ot=16209;break}D();}n.K&&(n.K.Ke=n.st>>9&1,n.K.Zt=1),e.v=n.ht=X(0),n.ot=16191;break;case 16189:C(32),e.v=n.ht=B_(u),D(),n.ot=16190;case 16190:if(!n.ct)return O(),2;e.v=n.ht=de(0),n.ot=16191;case 16191:if(5==t||6==t)return v();case 16192:if(n.ut){V(),n.ot=16206;break}switch(C(3),n.ut=!!N(1),S(1),N(2)){case 0:n.ot=16193;break;case 1:if(Un(n),n.ot=16199,6==t)return S(2),v();break;case 2:n.ot=16196;break;case 3:e.msg="invalid block type",n.ot=16209;}S(2);break;case 16193:if(V(),C(32),(65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",n.ot=16209;break}if(n.kt=65535&u,D(),n.ot=16194,6==t)return v();case 16194:n.ot=16195;case 16195:if(d=n.kt,d){if(d>l&&(d=l),d>o&&(d=o),0==d)return v();M(f,_,r,i,d),l-=d,i+=d,o-=d,_+=d,n.kt-=d;break}n.ot=16191;break;case 16196:if(C(14),n.xt=N(5)+257,S(5),n.vt=N(5)+1,S(5),n.bt=N(4)+4,S(4),n.xt>286||!n.Ct&&n.vt>30){e.msg=n.Ct?"too many length":"too many length or distance symbols",n.ot=16209;break}n.yt=0,n.ot=16197;case 16197:for(;n.yt<n.bt;)C(3),n.At[xe[n.yt++]]=N(3),S(3);for(;n.yt<19;)n.At[xe[n.yt++]]=0;n.zt=n.Mt,n.et=n.tt=n.zt,n.nt=7;let c={It:n.zt},m={It:n.nt},x={It:0};if(b=Ne(0,n.At,19,c,m,n.Ot,x,n.Ct),n.zt=c.It,n.nt=m.It,b){e.msg="invalid code lengths set",n.ot=16209;break}n.yt=0,n.ot=16198;case 16198:for(;n.yt<n.xt+n.vt;){for(;w=n.et[N(n.nt)],!(w.ft<=a);)q();if(w.lt<16)S(w.ft),n.At[n.yt++]=w.lt;else {if(16==w.lt){if(C(w.ft+2),S(w.ft),0==n.yt){e.msg="invalid bit length repeat",n.ot=16209;break}g=n.At[n.yt-1],d=3+N(2),S(2);}else 17==w.lt?(C(w.ft+3),S(w.ft),g=0,d=3+N(3),S(3)):(C(w.ft+7),S(w.ft),g=0,d=11+N(7),S(7));if(n.yt+d>n.xt+n.vt){e.msg="invalid bit length repeat",n.ot=16209;break}for(;d--;)n.At[n.yt++]=g;}}if(16209==n.ot)break;if(0==n.At[256]){e.msg="invalid code -- missing end-of-block",n.ot=16209;break}n.zt=n.Mt,n.nt=9;let T={It:n.zt},U={It:n.nt},Q={It:0};b=Ne(1,n.At,n.xt,T,U,n.Ot,Q,n.Ct),n.zt=T.It,n.nt=U.It;let $=Q.It;if(n.et=n.zt.slice(0,$),b){e.msg="invalid literal/lengths set",n.ot=16209;break}n.rt=6;let E=n.At.subarray(n.xt,n.xt+n.vt),B={It:n.zt},I={It:n.rt},Z={It:$};if(b=Ne(2,E,n.vt,B,I,n.Ot,Z,n.Ct),n.zt=B.It,n.rt=I.It,n.tt=n.zt.slice($),b){e.msg="invalid distances set",n.ot=16209;break}if(n.ot=16199,6==t)return v();case 16199:n.ot=16200;case 16200:if(!n.Ct&&l>=6&&o>=258){O(),Ut(e,s),A(),16191==n.ot&&(n.Dt=-1);break}for(n.Dt=0;w=n.et[N(n.nt)],!(w.ft<=a);)q();if(w._t&&!(240&w._t)){for(k=w;w=n.et[k.lt+(N(k.ft+k._t)>>k.ft)],!(k.ft+w.ft<=a);)q();S(k.ft),n.Dt+=k.ft;}if(S(w.ft),n.Dt+=w.ft,n.kt=w.lt,0==w._t){n.ot=16205;break}if(32&w._t){n.Dt=-1,n.ot=16191;break}if(64&w._t){e.msg="invalid literal/length code",n.ot=16209;break}n.Je=15&w._t,n.ot=16201;case 16201:n.Je&&(C(n.Je),n.kt+=N(n.Je),S(n.Je),n.Dt+=n.Je),n.qt=n.kt,n.ot=16202;case 16202:for(;w=n.tt[N(n.rt)],!(w.ft<=a);)q();if(!(240&w._t)){for(k=w;w=n.tt[k.lt+(N(k.ft+k._t)>>k.ft)],!(k.ft+w.ft<=a);)q();S(k.ft),n.Dt+=k.ft;}if(S(w.ft),n.Dt+=w.ft,64&w._t){e.msg="invalid distance code",n.ot=16209;break}n.gt=w.lt,n.Je=15&w._t,n.ot=16203;case 16203:n.Je&&(C(n.Je),n.gt+=N(n.Je),S(n.Je),n.Dt+=n.Je),n.ot=16204;case 16204:if(0==o)return v();if(d=s-o,n.gt>d){if(d=n.gt-d,d>n.q&&n.it){e.msg="invalid distance too far back",n.ot=16209;break}d>n.C?(d-=n.C,h=n.F-d):h=n.C-d,d>n.kt&&(d=n.kt),d>o&&(d=o);for(let e=0;e<d;++e)f[_]=255&n.M[h],++_,++h;}else {h=_-n.gt,d=n.kt,d>o&&(d=o);for(let e=0;e<d;++e)f[_]=f[h],++_,++h;}d>o&&(d=o),o-=d,n.kt-=d,0==n.kt&&(n.ot=16200);break;case 16205:if(0==o)return v();f[_++]=n.kt,o--,n.ot=16200;break;case 16206:if(n.L){if(C(32),s-=o,e.total_out+=s,n.wt+=s,4&n.L&&s){let t=f.subarray(_-s,_);e.v=n.ht=y(n.ht,t,s);}if(s=o,4&n.L&&(n.st?u:B_(u)>>>0)!=n.ht){e.msg="incorrect data check",n.ot=16209;break}D();}n.ot=16207;case 16207:if(n.L&&n.st){if(C(32),4&n.L&&u!=(4294967295&n.wt)){e.msg="incorrect length check",n.ot=16209;break}D();}n.ot=16208;case 16208:return b=1,v();case 16209:return b=-3,v();case 16210:return -4;default:return -2}}catch(e){if(e instanceof l_)return v();throw e}function v(){if(O(),n.F||s!=e.avail_out&&n.ot<16209&&(n.Ct?n.ot<16208:n.ot<16206)||4!=t){let t=s-e.avail_out;if(Bn(e,e.next_out.subarray(e.next_out_index-t,e.next_out_index),t))return n.ot=16210,-4}return c-=e.avail_in,s-=e.avail_out,e.total_in+=c,e.total_out+=s,n.wt+=s,4&n.L&&s&&(e.v=n.ht=y(n.ht,e.next_out.subarray(e.next_out_index-s,e.next_out_index),s)),e.m=n.S+(n.ut?64:0)+(16191==n.ot?128:0)+(16199==n.ot||16194==n.ot?256:0),(0==c&&0==s&&0==b||4==t&&0==b)&&(b=-5),b}function y(e,t,r){return n.st?X(e,t,r):de(e,t,r)}function p(e,t){return m[0]=255&t,m[1]=t>>>8&255,X(e,m,2)>>>0}function z(e,t){return m[0]=255&t,m[1]=t>>>8&255,m[2]=t>>>16&255,m[3]=t>>>24&255,X(e,m,4)>>>0}function A(){f=e.next_out,_=e.next_out_index,o=e.avail_out,r=e.next_in,i=e.next_in_index,l=e.avail_in,u=n.N,a=n.S;}function O(){e.next_out=f,e.next_out_index=_,e.avail_out=o,e.next_in=r,e.next_in_index=i,e.avail_in=l,n.N=u,n.S=a;}function D(){u=0,a=0;}function q(){if(0==l)throw new l_;l--,u+=(255&r[i])<<a,i++,u>>>=0,a+=8;}function C(e){for(;a<e;)q();}function N(e){return u&(1<<e)-1}function S(e){u>>>=e,a-=e;}function V(){u>>>=7&a,a-=7&a;}}function Gt(e){return Fe(e)?-2:0}var Z_=65536,Zn=32768,F_=class{constructor(e=16,t=Z_){this.Jt=[],this.Rt=e;for(let n=0;n<N.min(e,4);n++)this.Jt.push(new x(t));}acquire(e=Z_){for(let t=this.Jt.length-1;t>=0;t--){let n=this.Jt[t];if(n.length>=e)return this.Jt.splice(t,1),n}return new x(e)}release(e){this.Jt.length<this.Rt&&this.Jt.push(e);}};function Kt(e){let t=new F_(32,Z_),n=null;function r(e){try{t.release(e);}catch{}}return new U({start(){},transform(i,f){if(!n){let t=e.Yt(),r=e.jt(t);if(0!=r&&0!=r)throw new C("init failed: "+r);n={O:t};}let _=n.O,l=0;for(;l<i.length;){let n=N.min(i.length-l,Zn),o=i.subarray(l,l+n);for(_.next_in=o,_.next_in_index=0,_.avail_in=o.length;_.avail_in>0;){let n=t.acquire(),i=false;try{_.next_out=n,_.next_out_index=0,_.avail_out=n.length;let r=e.Pt(_,0),l=n.length-_.avail_out;if(l>0){let e=!1,r={Gt:n.subarray(0,l),release:()=>{e||(e=!0,t.release(n));}};i=!0,f.enqueue(r);}if(0!=r&&1!=r)throw new C("process error: "+r)}finally{i||r(n);}}l+=n;}},flush(i){if(!n)return;let f=n.O;for(;;){let n=t.acquire(),_=false;try{f.next_out=n,f.next_out_index=0,f.avail_out=n.length;let r=e.Pt(f,4),l=n.length-f.avail_out;if(l>0){let e=!1,r={Gt:n.subarray(0,l),release:()=>{e||(e=!0,t.release(n));}};_=!0,i.enqueue(r);}if(1==r)break;if(0!=r)throw new C("finalization error: "+r)}finally{_||r(n);}}let _=e.en(f);if(0!=_&&0!=_)throw new C("end failed: "+_)}})}function qt(){return new U({start(){},transform(e,t){try{t.enqueue(e.Gt.slice(0));}finally{e.release();}},flush(){}})}function Fn(e="deflate",t){let n="gzip"==e?31:"deflate-raw"==e?-15:15,r=t&&"number"==typeof t.level?t.level:-1;return Kt({Yt:()=>Et(),jt:e=>Tt(e,r,8,n,8,0),Pt:At,en:C_})}function Pn(e="deflate"){let t="gzip"==e?31:"deflate-raw"==e?-15:15;return Kt({Yt:()=>Yt("deflate64-raw"==e),jt:e=>Wt(e,t),Pt:Xt,en:Gt})}var f_=class{constructor(e="deflate",t){let n=Fn(e,t);this.writable=n.writable,this.readable=n.readable.pipeThrough(qt());}},u_=class{constructor(e="deflate"){let t=Pn(e);this.writable=t.writable,this.readable=t.readable.pipeThrough(qt());}};

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


configure({
	workerURI: "./core/web-worker-native.js",
	wasmURI: null,
	CompressionStreamZlib: f_,
	DecompressionStreamZlib: u_
});

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


e(configure);

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
exports.terminateWorkers = terminateWorkers;
