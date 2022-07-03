(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

	const { Array, Object, String, BigInt, Math, Date, Map, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, FileReader, document, crypto, btoa, TransformStream, ReadableStream, WritableStream, CompressionStream, DecompressionStream } = globalThis;

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

	/* global navigator */

	const DEFAULT_CONFIGURATION = {
		chunkSize: 512 * 1024,
		maxWorkers: (typeof navigator != "undefined" && navigator.hardwareConcurrency) || 2,
		terminateWorkerTimeout: 5000,
		useWebWorkers: true,
		workerScripts: undefined
	};

	const config = Object.assign({}, DEFAULT_CONFIGURATION);

	function getConfiguration() {
		return config;
	}

	function configure(configuration) {
		if (configuration.baseURL !== undefined) {
			config.baseURL = configuration.baseURL;
		}
		if (configuration.chunkSize !== undefined) {
			config.chunkSize = configuration.chunkSize;
		}
		if (configuration.maxWorkers !== undefined) {
			config.maxWorkers = configuration.maxWorkers;
		}
		if (configuration.terminateWorkerTimeout !== undefined) {
			config.terminateWorkerTimeout = configuration.terminateWorkerTimeout;
		}
		if (configuration.useWebWorkers !== undefined) {
			config.useWebWorkers = configuration.useWebWorkers;
		}
		if (configuration.useCompressionStream !== undefined) {
			config.useCompressionStream = configuration.useCompressionStream;
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

	var e=e=>{if("function"==typeof URL.createObjectURL){const t=()=>URL.createObjectURL(new Blob(['const{Array:t,Object:e,Math:n,Error:r,Uint8Array:i,Uint16Array:s,Uint32Array:o,Int32Array:f,DataView:c,TextEncoder:a,crypto:l,postMessage:u,TransformStream:h,ReadableStream:w,WritableStream:d,CompressionStream:p,DecompressionStream:y}=globalThis,b=[];for(let t=0;256>t;t++){let e=t;for(let t=0;8>t;t++)1&e?e=e>>>1^3988292384:e>>>=1;b[t]=e}class m{constructor(t){this.t=t||-1}append(t){let e=0|this.t;for(let n=0,r=0|t.length;r>n;n++)e=e>>>8^b[255&(e^t[n])];this.t=e}get(){return~this.t}}class k extends h{constructor(t){super({start(){this.i=new m(t)},transform(t){t&&this.i.append(t)},flush(t){const e=new i(4);new c(e.buffer).setUint32(0,this.i.get()),t.enqueue(e)}})}}const g={concat(t,e){if(0===t.length||0===e.length)return t.concat(e);const n=t[t.length-1],r=g.o(n);return 32===r?t.concat(e):g.l(e,r,0|n,t.slice(0,t.length-1))},u(t){const e=t.length;if(0===e)return 0;const n=t[e-1];return 32*(e-1)+g.o(n)},h(t,e){if(32*t.length<e)return t;const r=(t=t.slice(0,n.ceil(e/32))).length;return e&=31,r>0&&e&&(t[r-1]=g.p(e,t[r-1]&2147483648>>e-1,1)),t},p:(t,e,n)=>32===t?e:(n?0|e:e<<32-t)+1099511627776*t,o:t=>n.round(t/1099511627776)||32,l(t,e,n,r){for(void 0===r&&(r=[]);e>=32;e-=32)r.push(n),n=0;if(0===e)return r.concat(t);for(let i=0;i<t.length;i++)r.push(n|t[i]>>>e),n=t[i]<<32-e;const i=t.length?t[t.length-1]:0,s=g.o(i);return r.push(g.p(e+s&31,e+s>32?n:r.pop(),1)),r}},v={m:{k(t){const e=g.u(t)/8,n=new i(e);let r;for(let i=0;e>i;i++)0==(3&i)&&(r=t[i/4]),n[i]=r>>>24,r<<=8;return n},g(t){const e=[];let n,r=0;for(n=0;n<t.length;n++)r=r<<8|t[n],3==(3&n)&&(e.push(r),r=0);return 3&n&&e.push(g.p(8*(3&n),r)),e}}},S={v:function(t){t?(this.S=t.S.slice(0),this._=t._.slice(0),this.C=t.C):this.reset()}};S.v.prototype={blockSize:512,reset:function(){const t=this;return t.S=this.I.slice(0),t._=[],t.C=0,t},update:function(t){const e=this;"string"==typeof t&&(t=v.A.g(t));const n=e._=g.concat(e._,t),i=e.C,s=e.C=i+g.u(t);if(s>9007199254740991)throw new r("Cannot hash more than 2^53 - 1 bits");const f=new o(n);let c=0;for(let t=e.blockSize+i-(e.blockSize+i&e.blockSize-1);s>=t;t+=e.blockSize)e.V(f.subarray(16*c,16*(c+1))),c+=1;return n.splice(0,16*c),e},B:function(){const t=this;let e=t._;const r=t.S;e=g.concat(e,[g.p(1,1)]);for(let t=e.length+2;15&t;t++)e.push(0);for(e.push(n.floor(t.C/4294967296)),e.push(0|t.C);e.length;)t.V(e.splice(0,16));return t.reset(),r},I:[1732584193,4023233417,2562383102,271733878,3285377520],D:[1518500249,1859775393,2400959708,3395469782],P:(t,e,n,r)=>t>19?t>39?t>59?t>79?void 0:e^n^r:e&n|e&r|n&r:e^n^r:e&n|~e&r,R:(t,e)=>e<<t|e>>>32-t,V:function(e){const r=this,i=r.S,s=t(80);for(let t=0;16>t;t++)s[t]=e[t];let o=i[0],f=i[1],c=i[2],a=i[3],l=i[4];for(let t=0;79>=t;t++){16>t||(s[t]=r.R(1,s[t-3]^s[t-8]^s[t-14]^s[t-16]));const e=r.R(5,o)+r.P(t,f,c,a)+l+s[t]+r.D[n.floor(t/20)]|0;l=a,a=c,c=r.R(30,f),f=o,o=e}i[0]=i[0]+o|0,i[1]=i[1]+f|0,i[2]=i[2]+c|0,i[3]=i[3]+a|0,i[4]=i[4]+l|0}};const z={getRandomValues(t){const e=new o(t.buffer),r=t=>{let e=987654321;const r=4294967295;return()=>(e=36969*(65535&e)+(e>>16)&r,(((e<<16)+(t=18e3*(65535&t)+(t>>16)&r)&r)/4294967296+.5)*(n.random()>.5?1:-1))};for(let i,s=0;s<t.length;s+=4){const t=r(4294967296*(i||n.random()));i=987654071*t(),e[s/4]=4294967296*t()|0}return t}},_={importKey:t=>new _.U(v.m.g(t)),M(t,e,n,i){if(n=n||1e4,0>i||0>n)throw new r("invalid params to pbkdf2");const s=1+(i>>5)<<2;let o,f,a,l,u;const h=new ArrayBuffer(s),w=new c(h);let d=0;const p=g;for(e=v.m.g(e),u=1;(s||1)>d;u++){for(o=f=t.encrypt(p.concat(e,[u])),a=1;n>a;a++)for(f=t.encrypt(f),l=0;l<f.length;l++)o[l]^=f[l];for(a=0;(s||1)>d&&a<o.length;a++)w.setInt32(d,o[a]),d+=4}return h.slice(0,i/8)},U:class{constructor(t){const e=this,n=e.T=S.v,r=[[],[]],i=n.prototype.blockSize/32;e.H=[new n,new n],t.length>i&&(t=n.hash(t));for(let e=0;i>e;e++)r[0][e]=909522486^t[e],r[1][e]=1549556828^t[e];e.H[0].update(r[0]),e.H[1].update(r[1]),e.K=new n(e.H[0])}reset(){const t=this;t.K=new t.T(t.H[0]),t.L=!1}update(t){this.L=!0,this.K.update(t)}digest(){const t=this,e=t.K.B(),n=new t.T(t.H[1]).update(e).B();return t.reset(),n}encrypt(t){if(this.L)throw new r("encrypt on already updated hmac called!");return this.update(t),this.digest(t)}}},C={name:"PBKDF2"},I=e.assign({hash:{name:"HMAC"}},C),A=e.assign({iterations:1e3,hash:{name:"SHA-1"}},C),x=["deriveBits"],V=[8,12,16],B=[16,24,32],D=[0,0,0,0],E=void 0!==l,P=E&&void 0!==l.subtle,R=v.m,U=class{constructor(t){const e=this;e.W=[[[],[],[],[],[]],[[],[],[],[],[]]],e.W[0][0][0]||e.j();const n=e.W[0][4],i=e.W[1],s=t.length;let o,f,c,a=1;if(4!==s&&6!==s&&8!==s)throw new r("invalid aes key size");for(e.D=[f=t.slice(0),c=[]],o=s;4*s+28>o;o++){let t=f[o-1];(o%s==0||8===s&&o%s==4)&&(t=n[t>>>24]<<24^n[t>>16&255]<<16^n[t>>8&255]<<8^n[255&t],o%s==0&&(t=t<<8^t>>>24^a<<24,a=a<<1^283*(a>>7))),f[o]=f[o-s]^t}for(let t=0;o;t++,o--){const e=f[3&t?o:o-4];c[t]=4>=o||4>t?e:i[0][n[e>>>24]]^i[1][n[e>>16&255]]^i[2][n[e>>8&255]]^i[3][n[255&e]]}}encrypt(t){return this.F(t,0)}decrypt(t){return this.F(t,1)}j(){const t=this.W[0],e=this.W[1],n=t[4],r=e[4],i=[],s=[];let o,f,c,a;for(let t=0;256>t;t++)s[(i[t]=t<<1^283*(t>>7))^t]=t;for(let l=o=0;!n[l];l^=f||1,o=s[o]||1){let s=o^o<<1^o<<2^o<<3^o<<4;s=s>>8^255&s^99,n[l]=s,r[s]=l,a=i[c=i[f=i[l]]];let u=16843009*a^65537*c^257*f^16843008*l,h=257*i[s]^16843008*s;for(let n=0;4>n;n++)t[n][l]=h=h<<24^h>>>8,e[n][s]=u=u<<24^u>>>8}for(let n=0;5>n;n++)t[n]=t[n].slice(0),e[n]=e[n].slice(0)}F(t,e){if(4!==t.length)throw new r("invalid aes block size");const n=this.D[e],i=n.length/4-2,s=[0,0,0,0],o=this.W[e],f=o[0],c=o[1],a=o[2],l=o[3],u=o[4];let h,w,d,p=t[0]^n[0],y=t[e?3:1]^n[1],b=t[2]^n[2],m=t[e?1:3]^n[3],k=4;for(let t=0;i>t;t++)h=f[p>>>24]^c[y>>16&255]^a[b>>8&255]^l[255&m]^n[k],w=f[y>>>24]^c[b>>16&255]^a[m>>8&255]^l[255&p]^n[k+1],d=f[b>>>24]^c[m>>16&255]^a[p>>8&255]^l[255&y]^n[k+2],m=f[m>>>24]^c[p>>16&255]^a[y>>8&255]^l[255&b]^n[k+3],k+=4,p=h,y=w,b=d;for(let t=0;4>t;t++)s[e?3&-t:t]=u[p>>>24]<<24^u[y>>16&255]<<16^u[b>>8&255]<<8^u[255&m]^n[k++],h=p,p=y,y=b,b=m,m=h;return s}},M=class{constructor(t,e){this.O=t,this.q=e,this.G=e}reset(){this.G=this.q}update(t){return this.J(this.O,t,this.G)}N(t){if(255==(t>>24&255)){let e=t>>16&255,n=t>>8&255,r=255&t;255===e?(e=0,255===n?(n=0,255===r?r=0:++r):++n):++e,t=0,t+=e<<16,t+=n<<8,t+=r}else t+=1<<24;return t}X(t){0===(t[0]=this.N(t[0]))&&(t[1]=this.N(t[1]))}J(t,e,n){let r;if(!(r=e.length))return[];const i=g.u(e);for(let i=0;r>i;i+=4){this.X(n);const r=t.encrypt(n);e[i]^=r[0],e[i+1]^=r[1],e[i+2]^=r[2],e[i+3]^=r[3]}return g.h(e,i)}},T=_.U;class H extends h{constructor(n,s,o){let f;super({start(){e.assign(this,{ready:new Promise((t=>this.Y=t)),password:n,signed:s,Z:o-1,$:new i(0)})},async transform(e,n){if(e&&e.length){const s=this;if(s.password){const n=s.password;s.password=null;const i=F(e,0,V[s.Z]+2);await(async(t,e,n)=>{await W(t,n,F(e,0,V[t.Z]));const i=F(e,V[t.Z]),s=t.keys.passwordVerification;if(s[0]!=i[0]||s[1]!=i[1])throw new r("Invalid pasword")})(s,i,n),s.tt=new M(new U(s.keys.key),t.from(D)),s.et=new T(s.keys.nt),e=F(e,V[s.Z]+2),s.Y()}else await s.ready;const o=new i(e.length-10-(e.length-10)%16);n.enqueue(L(s,e,o,0,10,!0))}},async flush(t){const e=this;await e.ready;const n=e.$,r=F(n,0,n.length-10),s=F(n,n.length-10);let o=new i(0);if(r.length){const t=R.g(r);e.et.update(t);const n=e.tt.update(t);o=R.k(n)}if(f.valid=!0,e.signed){const t=F(R.k(e.et.digest()),0,10);for(let e=0;10>e;e++)t[e]!=s[e]&&(f.valid=!1)}t.enqueue(o)}}),f=this}}class K extends h{constructor(n,r){let s;super({start(){e.assign(this,{ready:new Promise((t=>this.Y=t)),password:n,Z:r-1,$:new i(0)})},async transform(e,n){if(e&&e.length){const r=this;let s=new i(0);if(r.password){const e=r.password;r.password=null,s=await(async(t,e)=>{const n=(r=new i(V[t.Z]),E&&"function"==typeof l.getRandomValues?l.getRandomValues(r):z.getRandomValues(r));var r;return await W(t,e,n),j(n,t.keys.passwordVerification)})(r,e),r.tt=new M(new U(r.keys.key),t.from(D)),r.et=new T(r.keys.nt),r.Y()}else await r.ready;const o=new i(s.length+e.length-e.length%16);o.set(s,0),n.enqueue(L(r,e,o,s.length,0))}},async flush(t){const e=this;await e.ready;let n=new i(0);if(e.$.length){const t=e.tt.update(R.g(e.$));e.et.update(t),n=R.k(t)}s.signature=F(R.k(e.et.digest()),0,10),t.enqueue(j(n,s.signature))}}),s=this}}function L(t,e,n,r,s,o){const f=e.length-s;let c;for(t.$.length&&(e=j(t.$,e),n=((t,e)=>{if(e&&e>t.length){const n=t;(t=new i(e)).set(n,0)}return t})(n,f-f%16)),c=0;f-16>=c;c+=16){const i=R.g(F(e,c,c+16));o&&t.et.update(i);const s=t.tt.update(i);o||t.et.update(s),n.set(R.k(s),c+r)}return t.$=F(e,c),n}async function W(t,n,r){const s=(t=>{if(void 0===a){const e=new i((t=unescape(encodeURIComponent(t))).length);for(let n=0;n<e.length;n++)e[n]=t.charCodeAt(n);return e}return(new a).encode(t)})(n),o=await((t,e,n,r,i)=>E&&P&&"function"==typeof l.subtle.importKey?l.subtle.importKey("raw",e,n,!1,i):_.importKey(e))(0,s,I,0,x),f=await(async(t,e,n)=>E&&P&&"function"==typeof l.subtle.deriveBits?await l.subtle.deriveBits(t,e,n):_.M(e,t.salt,A.iterations,n))(e.assign({salt:r},A),o,8*(2*B[t.Z]+2)),c=new i(f);t.keys={key:R.g(F(c,0,B[t.Z])),nt:R.g(F(c,B[t.Z],2*B[t.Z])),passwordVerification:F(c,2*B[t.Z])}}function j(t,e){let n=t;return t.length+e.length&&(n=new i(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function F(t,e,n){return t.subarray(e,n)}class O extends h{constructor(t,n){let i;super({start(){e.assign(this,{password:t,passwordVerification:n}),N(this,t)},transform(t,e){if(this.password){const e=G(this,t.subarray(0,12));if(this.password=null,e[11]!=this.passwordVerification)throw new r("Invalid pasword");t=t.subarray(12)}e.enqueue(G(this,t))},flush(){i.valid=!0}}),i=this}}class q extends h{constructor(t,n){super({start(){e.assign(this,{password:t,passwordVerification:n}),N(this,t)},transform(t,e){if(t){let n,r;if(this.password){this.password=null;const e=l.getRandomValues(new i(12));e[11]=this.passwordVerification,n=new i(t.length+e.length),n.set(J(this,e),0),r=12}else n=new i(t.length),r=0;n.set(J(this,t),r),e.enqueue(n)}},flush(){}})}}function G(t,e){const n=new i(e.length);for(let r=0;r<e.length;r++)n[r]=X(t)^e[r],Q(t,n[r]);return n}function J(t,e){const n=new i(e.length);for(let r=0;r<e.length;r++)n[r]=X(t)^e[r],Q(t,e[r]);return n}function N(t,e){t.keys=[305419896,591751049,878082192],t.rt=new m(t.keys[0]),t.it=new m(t.keys[2]);for(let n=0;n<e.length;n++)Q(t,e.charCodeAt(n))}function Q(t,e){t.rt.append([e]),t.keys[0]=~t.rt.get(),t.keys[1]=Z(t.keys[1]+Y(t.keys[0])),t.keys[1]=Z(n.imul(t.keys[1],134775813)+1),t.it.append([t.keys[1]>>>24]),t.keys[2]=~t.it.get()}function X(t){const e=2|t.keys[2];return Y(n.imul(e,1^e)>>>8)}function Y(t){return 255&t}function Z(t){return 4294967295&t}class $ extends h{constructor(t,e){super({start(){this.st=new t(e)},transform(t,e){(t=this.st.append(t))&&e.enqueue(t)},flush(t){const e=this.st.flush();e&&t.enqueue(e)}})}}class tt{constructor(t,{signature:n,password:r,signed:i,compressed:s,zipCrypto:o,passwordVerification:f,encryptionStrength:c,ot:a},{ft:l}){const u=!!r,h=this;if(e.assign(h,{signature:n,encrypted:u,signed:i,compressed:s,zipCrypto:o,stream:new w({start(t){h.controller=t}})}),u&&(o?h.stream=h.stream.pipeThrough(new O(r,f)):(h.ct=new H(r,i,c),h.stream=h.stream.pipeThrough(h.ct))),s&&(h.stream=void 0!==a&&!a||void 0===y?h.stream.pipeThrough(new $(t,{ft:l})):h.stream.pipeThrough(new y("deflate-raw"))),(!u||o)&&i){const t=h.stream.tee();h.stream=t[0],h.lt=t[1].pipeThrough(new k)}h.ut=h.stream.getReader()}async append(t){const e=this;e.error||(e.controller.enqueue(t),e.read().catch((t=>{e.error=t,e.onerror(t)})))}async flush(){const t=this;if(!t.error){for(t.controller.close();!await t.read(););let e;if(t.encrypted&&!t.zipCrypto&&!t.ct.valid)throw new r("Invalid signature");if((!t.encrypted||t.zipCrypto)&&t.signed){e=await t.lt.getReader().read();const n=new c(e.value.buffer);if(t.signature!=n.getUint32(0,!1))throw new r("Invalid signature")}t.ht({value:{signature:e},done:!0})}}async read(){const{value:t,done:e}=await this.ut.read();return t&&t.length&&this.ht({value:{data:new i(t)}}),e}}class et{constructor(t,{encrypted:n,signed:r,compressed:i,level:s,zipCrypto:o,password:f,passwordVerification:c,encryptionStrength:a,ot:l},{ft:u}){const h=this;if(e.assign(this,{encrypted:n,signed:r,compressed:i,zipCrypto:o,stream:new w({start(t){h.controller=t}})}),(!n||o)&&r){const t=h.stream.tee();h.stream=t[0],h.lt=t[1].pipeThrough(new k)}i&&(h.stream=void 0!==l&&!l||void 0===p?h.stream.pipeThrough(new $(t,{ft:u,level:s})):h.stream.pipeThrough(new p("deflate-raw"))),n&&(o?h.stream=h.stream.pipeThrough(new q(f,c)):(h.wt=new K(f,a),h.stream=h.stream.pipeThrough(h.wt))),h.ut=h.stream.getReader()}async append(t){const e=this;e.error||(e.controller.enqueue(t),e.read().catch((t=>{e.onerror(t),e.error=t})))}async flush(){const t=this;if(!t.error){for(t.controller.close();!await t.read(););let e;t.encrypted&&!t.zipCrypto&&(e=t.wt.signature),t.encrypted&&!t.zipCrypto||!t.signed||(e=await t.lt.getReader().read(),e=new c(e.value.buffer).getUint32(0)),t.ht({value:{signature:e},done:!0})}}async read(){const{value:t,done:e}=await this.ut.read();return t&&t.length&&this.ht({value:{data:new i(t)}}),e}}let nt;function rt(e){return it(e.map((([e,n])=>new t(e).fill(n,0,e))))}function it(e){return e.reduce(((e,n)=>e.concat(t.isArray(n)?it(n):n)),[])}addEventListener("message",(async t=>{const e=t.data,n=e.type;try{"init"==n?(t=>{t.scripts&&t.scripts.length&&importScripts.apply(void 0,t.scripts);const e=t.options;let n;self.initCodec&&self.initCodec(),e.codecType.startsWith("deflate")?n=self.Deflate:e.codecType.startsWith("inflate")&&(n=self.Inflate),nt=((t,e,n)=>e.codecType.startsWith("deflate")?new et(t,e,n):e.codecType.startsWith("inflate")?new tt(t,e,n):void 0)(n,e,t.config),nt.onerror=t=>u({error:{message:t.message,stack:t.stack}}),nt.ht=t=>{const e={type:"data",data:t};if((t=e.data.value.data)&&t.length)try{e.data.value.data=t.buffer,u(e,[t])}catch(t){u(e)}else u(e)}})(e):(e.data&&(e.data=new i(e.data)),await nt[n](e.data))}catch(t){u({error:{message:t.message,stack:t.stack}})}}));const st=[0,1,2,3].concat(...rt([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function ot(){const t=this;function e(t,e){let n=0;do{n|=1&t,t>>>=1,n<<=1}while(--e>0);return n>>>1}t.dt=r=>{const i=t.yt,s=t.kt.bt,o=t.kt.gt;let f,c,a,l=-1;for(r.vt=0,r.St=573,f=0;o>f;f++)0!==i[2*f]?(r.zt[++r.vt]=l=f,r._t[f]=0):i[2*f+1]=0;for(;2>r.vt;)a=r.zt[++r.vt]=2>l?++l:0,i[2*a]=1,r._t[a]=0,r.Ct--,s&&(r.It-=s[2*a+1]);for(t.At=l,f=n.floor(r.vt/2);f>=1;f--)r.xt(i,f);a=o;do{f=r.zt[1],r.zt[1]=r.zt[r.vt--],r.xt(i,1),c=r.zt[1],r.zt[--r.St]=f,r.zt[--r.St]=c,i[2*a]=i[2*f]+i[2*c],r._t[a]=n.max(r._t[f],r._t[c])+1,i[2*f+1]=i[2*c+1]=a,r.zt[1]=a++,r.xt(i,1)}while(r.vt>=2);r.zt[--r.St]=r.zt[1],(e=>{const n=t.yt,r=t.kt.bt,i=t.kt.Vt,s=t.kt.Bt,o=t.kt.Dt;let f,c,a,l,u,h,w=0;for(l=0;15>=l;l++)e.Et[l]=0;for(n[2*e.zt[e.St]+1]=0,f=e.St+1;573>f;f++)c=e.zt[f],l=n[2*n[2*c+1]+1]+1,l>o&&(l=o,w++),n[2*c+1]=l,c>t.At||(e.Et[l]++,u=0,s>c||(u=i[c-s]),h=n[2*c],e.Ct+=h*(l+u),r&&(e.It+=h*(r[2*c+1]+u)));if(0!==w){do{for(l=o-1;0===e.Et[l];)l--;e.Et[l]--,e.Et[l+1]+=2,e.Et[o]--,w-=2}while(w>0);for(l=o;0!==l;l--)for(c=e.Et[l];0!==c;)a=e.zt[--f],a>t.At||(n[2*a+1]!=l&&(e.Ct+=(l-n[2*a+1])*n[2*a],n[2*a+1]=l),c--)}})(r),((t,n,r)=>{const i=[];let s,o,f,c=0;for(s=1;15>=s;s++)i[s]=c=c+r[s-1]<<1;for(o=0;n>=o;o++)f=t[2*o+1],0!==f&&(t[2*o]=e(i[f]++,f))})(i,t.At,r.Et)}}function ft(t,e,n,r,i){const s=this;s.bt=t,s.Vt=e,s.Bt=n,s.gt=r,s.Dt=i}ot.Pt=[0,1,2,3,4,5,6,7].concat(...rt([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),ot.Rt=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],ot.Ut=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],ot.Mt=t=>256>t?st[t]:st[256+(t>>>7)],ot.Tt=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ot.Ht=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],ot.Kt=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],ot.Lt=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];const ct=rt([[144,8],[112,9],[24,7],[8,8]]);ft.Wt=it([12,140,76,204,44,172,108,236,28,156,92,220,60,188,124,252,2,130,66,194,34,162,98,226,18,146,82,210,50,178,114,242,10,138,74,202,42,170,106,234,26,154,90,218,58,186,122,250,6,134,70,198,38,166,102,230,22,150,86,214,54,182,118,246,14,142,78,206,46,174,110,238,30,158,94,222,62,190,126,254,1,129,65,193,33,161,97,225,17,145,81,209,49,177,113,241,9,137,73,201,41,169,105,233,25,153,89,217,57,185,121,249,5,133,69,197,37,165,101,229,21,149,85,213,53,181,117,245,13,141,77,205,45,173,109,237,29,157,93,221,61,189,125,253,19,275,147,403,83,339,211,467,51,307,179,435,115,371,243,499,11,267,139,395,75,331,203,459,43,299,171,427,107,363,235,491,27,283,155,411,91,347,219,475,59,315,187,443,123,379,251,507,7,263,135,391,71,327,199,455,39,295,167,423,103,359,231,487,23,279,151,407,87,343,215,471,55,311,183,439,119,375,247,503,15,271,143,399,79,335,207,463,47,303,175,431,111,367,239,495,31,287,159,415,95,351,223,479,63,319,191,447,127,383,255,511,0,64,32,96,16,80,48,112,8,72,40,104,24,88,56,120,4,68,36,100,20,84,52,116,3,131,67,195,35,163,99,227].map(((t,e)=>[t,ct[e]])));const at=rt([[30,5]]);function lt(t,e,n,r,i){const s=this;s.jt=t,s.Ft=e,s.Ot=n,s.qt=r,s.Gt=i}ft.Jt=it([0,16,8,24,4,20,12,28,2,18,10,26,6,22,14,30,1,17,9,25,5,21,13,29,3,19,11,27,7,23].map(((t,e)=>[t,at[e]]))),ft.Nt=new ft(ft.Wt,ot.Tt,257,286,15),ft.Qt=new ft(ft.Jt,ot.Ht,0,30,15),ft.Xt=new ft(null,ot.Kt,0,19,7);const ut=[new lt(0,0,0,0,0),new lt(4,4,8,4,1),new lt(4,5,16,8,1),new lt(4,6,32,32,1),new lt(4,4,16,16,2),new lt(8,16,32,32,2),new lt(8,16,128,128,2),new lt(8,32,128,256,2),new lt(32,128,258,1024,2),new lt(32,258,258,4096,2)],ht=["need dictionary","stream end","","","stream error","data error","","buffer error","",""];function wt(t,e,n,r){const i=t[2*e],s=t[2*n];return s>i||i==s&&r[e]<=r[n]}function dt(){const t=this;let e,r,o,f,c,a,l,u,h,w,d,p,y,b,m,k,g,v,S,z,_,C,I,A,x,V,B,D,E,P,R,U,M;const T=new ot,H=new ot,K=new ot;let L,W,j,F,O,q;function G(){let e;for(e=0;286>e;e++)R[2*e]=0;for(e=0;30>e;e++)U[2*e]=0;for(e=0;19>e;e++)M[2*e]=0;R[512]=1,t.Ct=t.It=0,W=j=0}function J(t,e){let n,r=-1,i=t[1],s=0,o=7,f=4;0===i&&(o=138,f=3),t[2*(e+1)+1]=65535;for(let c=0;e>=c;c++)n=i,i=t[2*(c+1)+1],++s<o&&n==i||(f>s?M[2*n]+=s:0!==n?(n!=r&&M[2*n]++,M[32]++):s>10?M[36]++:M[34]++,s=0,r=n,0===i?(o=138,f=3):n==i?(o=6,f=3):(o=7,f=4))}function N(e){t.Yt[t.pending++]=e}function Q(t){N(255&t),N(t>>>8&255)}function X(t,e){let n;const r=e;q>16-r?(n=t,O|=n<<q&65535,Q(O),O=n>>>16-q,q+=r-16):(O|=t<<q&65535,q+=r)}function Y(t,e){const n=2*t;X(65535&e[n],65535&e[n+1])}function Z(t,e){let n,r,i=-1,s=t[1],o=0,f=7,c=4;for(0===s&&(f=138,c=3),n=0;e>=n;n++)if(r=s,s=t[2*(n+1)+1],++o>=f||r!=s){if(c>o)do{Y(r,M)}while(0!=--o);else 0!==r?(r!=i&&(Y(r,M),o--),Y(16,M),X(o-3,2)):o>10?(Y(18,M),X(o-11,7)):(Y(17,M),X(o-3,3));o=0,i=r,0===s?(f=138,c=3):r==s?(f=6,c=3):(f=7,c=4)}}function $(){16==q?(Q(O),O=0,q=0):8>q||(N(255&O),O>>>=8,q-=8)}function tt(e,r){let i,s,o;if(t.Zt[W]=e,t.$t[W]=255&r,W++,0===e?R[2*r]++:(j++,e--,R[2*(ot.Pt[r]+256+1)]++,U[2*ot.Mt(e)]++),0==(8191&W)&&B>2){for(i=8*W,s=_-g,o=0;30>o;o++)i+=U[2*o]*(5+ot.Ht[o]);if(i>>>=3,j<n.floor(W/2)&&i<n.floor(s/2))return!0}return W==L-1}function et(e,n){let r,i,s,o,f=0;if(0!==W)do{r=t.Zt[f],i=t.$t[f],f++,0===r?Y(i,e):(s=ot.Pt[i],Y(s+256+1,e),o=ot.Tt[s],0!==o&&(i-=ot.Rt[s],X(i,o)),r--,s=ot.Mt(r),Y(s,n),o=ot.Ht[s],0!==o&&(r-=ot.Ut[s],X(r,o)))}while(W>f);Y(256,e),F=e[513]}function nt(){q>8?Q(O):q>0&&N(255&O),O=0,q=0}function rt(e,n,r){X(0+(r?1:0),3),((e,n)=>{nt(),F=8,Q(n),Q(~n),t.Yt.set(u.subarray(e,e+n),t.pending),t.pending+=n})(e,n)}function it(n){((e,n,r)=>{let i,s,o=0;B>0?(T.dt(t),H.dt(t),o=(()=>{let e;for(J(R,T.At),J(U,H.At),K.dt(t),e=18;e>=3&&0===M[2*ot.Lt[e]+1];e--);return t.Ct+=14+3*(e+1),e})(),i=t.Ct+3+7>>>3,s=t.It+3+7>>>3,s>i||(i=s)):i=s=n+5,n+4>i||-1==e?s==i?(X(2+(r?1:0),3),et(ft.Wt,ft.Jt)):(X(4+(r?1:0),3),((t,e,n)=>{let r;for(X(t-257,5),X(e-1,5),X(n-4,4),r=0;n>r;r++)X(M[2*ot.Lt[r]+1],3);Z(R,t-1),Z(U,e-1)})(T.At+1,H.At+1,o+1),et(R,U)):rt(e,n,r),G(),r&&nt()})(0>g?-1:g,_-g,n),g=_,e.te()}function st(){let t,n,r,i;do{if(i=h-I-_,0===i&&0===_&&0===I)i=c;else if(-1==i)i--;else if(_>=c+c-262){u.set(u.subarray(c,c+c),0),C-=c,_-=c,g-=c,t=y,r=t;do{n=65535&d[--r],d[r]=c>n?0:n-c}while(0!=--t);t=c,r=t;do{n=65535&w[--r],w[r]=c>n?0:n-c}while(0!=--t);i+=c}if(0===e.ee)return;t=e.ne(u,_+I,i),I+=t,3>I||(p=255&u[_],p=(p<<k^255&u[_+1])&m)}while(262>I&&0!==e.ee)}function ct(t){let e,n,r=x,i=_,s=A;const o=_>c-262?_-(c-262):0;let f=P;const a=l,h=_+258;let d=u[i+s-1],p=u[i+s];E>A||(r>>=2),f>I&&(f=I);do{if(e=t,u[e+s]==p&&u[e+s-1]==d&&u[e]==u[i]&&u[++e]==u[i+1]){i+=2,e++;do{}while(u[++i]==u[++e]&&u[++i]==u[++e]&&u[++i]==u[++e]&&u[++i]==u[++e]&&u[++i]==u[++e]&&u[++i]==u[++e]&&u[++i]==u[++e]&&u[++i]==u[++e]&&h>i);if(n=258-(h-i),i=h-258,n>s){if(C=t,s=n,n>=f)break;d=u[i+s-1],p=u[i+s]}}}while((t=65535&w[t&a])>o&&0!=--r);return s>I?I:s}t._t=[],t.Et=[],t.zt=[],R=[],U=[],M=[],t.xt=(e,n)=>{const r=t.zt,i=r[n];let s=n<<1;for(;s<=t.vt&&(s<t.vt&&wt(e,r[s+1],r[s],t._t)&&s++,!wt(e,i,r[s],t._t));)r[n]=r[s],n=s,s<<=1;r[n]=i},t.re=(e,S,C,W,j,J)=>(W||(W=8),j||(j=8),J||(J=0),e.ie=null,-1==S&&(S=6),1>j||j>9||8!=W||9>C||C>15||0>S||S>9||0>J||J>2?-2:(e.se=t,a=C,c=1<<a,l=c-1,b=j+7,y=1<<b,m=y-1,k=n.floor((b+3-1)/3),u=new i(2*c),w=[],d=[],L=1<<j+6,t.Yt=new i(4*L),o=4*L,t.Zt=new s(L),t.$t=new i(L),B=S,D=J,(e=>(e.oe=e.fe=0,e.ie=null,t.pending=0,t.ce=0,r=113,f=0,T.yt=R,T.kt=ft.Nt,H.yt=U,H.kt=ft.Qt,K.yt=M,K.kt=ft.Xt,O=0,q=0,F=8,G(),(()=>{h=2*c,d[y-1]=0;for(let t=0;y-1>t;t++)d[t]=0;V=ut[B].Ft,E=ut[B].jt,P=ut[B].Ot,x=ut[B].qt,_=0,g=0,I=0,v=A=2,z=0,p=0})(),0))(e))),t.ae=()=>42!=r&&113!=r&&666!=r?-2:(t.$t=null,t.Zt=null,t.Yt=null,d=null,w=null,u=null,t.se=null,113==r?-3:0),t.le=(t,e,n)=>{let r=0;return-1==e&&(e=6),0>e||e>9||0>n||n>2?-2:(ut[B].Gt!=ut[e].Gt&&0!==t.oe&&(r=t.ue(1)),B!=e&&(B=e,V=ut[B].Ft,E=ut[B].jt,P=ut[B].Ot,x=ut[B].qt),D=n,r)},t.he=(t,e,n)=>{let i,s=n,o=0;if(!e||42!=r)return-2;if(3>s)return 0;for(s>c-262&&(s=c-262,o=n-s),u.set(e.subarray(o,o+s),0),_=s,g=s,p=255&u[0],p=(p<<k^255&u[1])&m,i=0;s-3>=i;i++)p=(p<<k^255&u[i+2])&m,w[i&l]=d[p],d[p]=i;return 0},t.ue=(n,i)=>{let s,h,b,x,E;if(i>4||0>i)return-2;if(!n.we||!n.de&&0!==n.ee||666==r&&4!=i)return n.ie=ht[4],-2;if(0===n.pe)return n.ie=ht[7],-5;var P;if(e=n,x=f,f=i,42==r&&(h=8+(a-8<<4)<<8,b=(B-1&255)>>1,b>3&&(b=3),h|=b<<6,0!==_&&(h|=32),h+=31-h%31,r=113,N((P=h)>>8&255),N(255&P)),0!==t.pending){if(e.te(),0===e.pe)return f=-1,0}else if(0===e.ee&&x>=i&&4!=i)return e.ie=ht[7],-5;if(666==r&&0!==e.ee)return n.ie=ht[7],-5;if(0!==e.ee||0!==I||0!=i&&666!=r){switch(E=-1,ut[B].Gt){case 0:E=(t=>{let n,r=65535;for(r>o-5&&(r=o-5);;){if(1>=I){if(st(),0===I&&0==t)return 0;if(0===I)break}if(_+=I,I=0,n=g+r,(0===_||_>=n)&&(I=_-n,_=n,it(!1),0===e.pe))return 0;if(_-g>=c-262&&(it(!1),0===e.pe))return 0}return it(4==t),0===e.pe?4==t?2:0:4==t?3:1})(i);break;case 1:E=(t=>{let n,r=0;for(;;){if(262>I){if(st(),262>I&&0==t)return 0;if(0===I)break}if(3>I||(p=(p<<k^255&u[_+2])&m,r=65535&d[p],w[_&l]=d[p],d[p]=_),0===r||(_-r&65535)>c-262||2!=D&&(v=ct(r)),3>v)n=tt(0,255&u[_]),I--,_++;else if(n=tt(_-C,v-3),I-=v,v>V||3>I)_+=v,v=0,p=255&u[_],p=(p<<k^255&u[_+1])&m;else{v--;do{_++,p=(p<<k^255&u[_+2])&m,r=65535&d[p],w[_&l]=d[p],d[p]=_}while(0!=--v);_++}if(n&&(it(!1),0===e.pe))return 0}return it(4==t),0===e.pe?4==t?2:0:4==t?3:1})(i);break;case 2:E=(t=>{let n,r,i=0;for(;;){if(262>I){if(st(),262>I&&0==t)return 0;if(0===I)break}if(3>I||(p=(p<<k^255&u[_+2])&m,i=65535&d[p],w[_&l]=d[p],d[p]=_),A=v,S=C,v=2,0!==i&&V>A&&c-262>=(_-i&65535)&&(2!=D&&(v=ct(i)),5>=v&&(1==D||3==v&&_-C>4096)&&(v=2)),3>A||v>A)if(0!==z){if(n=tt(0,255&u[_-1]),n&&it(!1),_++,I--,0===e.pe)return 0}else z=1,_++,I--;else{r=_+I-3,n=tt(_-1-S,A-3),I-=A-1,A-=2;do{++_>r||(p=(p<<k^255&u[_+2])&m,i=65535&d[p],w[_&l]=d[p],d[p]=_)}while(0!=--A);if(z=0,v=2,_++,n&&(it(!1),0===e.pe))return 0}}return 0!==z&&(n=tt(0,255&u[_-1]),z=0),it(4==t),0===e.pe?4==t?2:0:4==t?3:1})(i)}if(2!=E&&3!=E||(r=666),0==E||2==E)return 0===e.pe&&(f=-1),0;if(1==E){if(1==i)X(2,3),Y(256,ft.Wt),$(),9>1+F+10-q&&(X(2,3),Y(256,ft.Wt),$()),F=7;else if(rt(0,0,!1),3==i)for(s=0;y>s;s++)d[s]=0;if(e.te(),0===e.pe)return f=-1,0}}return 4!=i?0:1}}function pt(){const t=this;t.ye=0,t.be=0,t.ee=0,t.oe=0,t.pe=0,t.fe=0}function yt(t){const e=new pt,s=(o=t&&t.ft?t.ft:65536)+5*(n.floor(o/16383)+1);var o;const f=new i(s);let c=t?t.level:-1;void 0===c&&(c=-1),e.re(c),e.we=f,this.append=(t,n)=>{let o,c,a=0,l=0,u=0;const h=[];if(t.length){e.ye=0,e.de=t,e.ee=t.length;do{if(e.be=0,e.pe=s,o=e.ue(0),0!=o)throw new r("deflating: "+e.ie);e.be&&(e.be==s?h.push(new i(f)):h.push(f.slice(0,e.be))),u+=e.be,n&&e.ye>0&&e.ye!=a&&(n(e.ye),a=e.ye)}while(e.ee>0||0===e.pe);return h.length>1?(c=new i(u),h.forEach((t=>{c.set(t,l),l+=t.length}))):c=h[0]||new i(0),c}},this.flush=()=>{let t,n,o=0,c=0;const a=[];do{if(e.be=0,e.pe=s,t=e.ue(4),1!=t&&0!=t)throw new r("deflating: "+e.ie);s-e.pe>0&&a.push(f.slice(0,e.be)),c+=e.be}while(e.ee>0||0===e.pe);return e.ae(),n=new i(c),a.forEach((t=>{n.set(t,o),o+=t.length})),n}}pt.prototype={re:function(t,e){const n=this;return n.se=new dt,e||(e=15),n.se.re(n,t,e)},ue:function(t){const e=this;return e.se?e.se.ue(e,t):-2},ae:function(){const t=this;if(!t.se)return-2;const e=t.se.ae();return t.se=null,e},le:function(t,e){const n=this;return n.se?n.se.le(n,t,e):-2},he:function(t,e){const n=this;return n.se?n.se.he(n,t,e):-2},ne:function(t,e,n){const r=this;let i=r.ee;return i>n&&(i=n),0===i?0:(r.ee-=i,t.set(r.de.subarray(r.ye,r.ye+i),e),r.ye+=i,r.oe+=i,i)},te:function(){const t=this;let e=t.se.pending;e>t.pe&&(e=t.pe),0!==e&&(t.we.set(t.se.Yt.subarray(t.se.ce,t.se.ce+e),t.be),t.be+=e,t.se.ce+=e,t.fe+=e,t.pe-=e,t.se.pending-=e,0===t.se.pending&&(t.se.ce=0))}};const bt=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],mt=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],kt=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],gt=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],vt=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],St=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],zt=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function _t(){let t,e,n,r,i,s;function o(t,e,o,f,c,a,l,u,h,w,d){let p,y,b,m,k,g,v,S,z,_,C,I,A,x,V;_=0,k=o;do{n[t[e+_]]++,_++,k--}while(0!==k);if(n[0]==o)return l[0]=-1,u[0]=0,0;for(S=u[0],g=1;15>=g&&0===n[g];g++);for(v=g,g>S&&(S=g),k=15;0!==k&&0===n[k];k--);for(b=k,S>k&&(S=k),u[0]=S,x=1<<g;k>g;g++,x<<=1)if(0>(x-=n[g]))return-3;if(0>(x-=n[k]))return-3;for(n[k]+=x,s[1]=g=0,_=1,A=2;0!=--k;)s[A]=g+=n[_],A++,_++;k=0,_=0;do{0!==(g=t[e+_])&&(d[s[g]++]=k),_++}while(++k<o);for(o=s[b],s[0]=k=0,_=0,m=-1,I=-S,i[0]=0,C=0,V=0;b>=v;v++)for(p=n[v];0!=p--;){for(;v>I+S;){if(m++,I+=S,V=b-I,V=V>S?S:V,(y=1<<(g=v-I))>p+1&&(y-=p+1,A=v,V>g))for(;++g<V&&(y<<=1)>n[++A];)y-=n[A];if(V=1<<g,w[0]+V>1440)return-3;i[m]=C=w[0],w[0]+=V,0!==m?(s[m]=k,r[0]=g,r[1]=S,g=k>>>I-S,r[2]=C-i[m-1]-g,h.set(r,3*(i[m-1]+g))):l[0]=C}for(r[1]=v-I,o>_?d[_]<f?(r[0]=256>d[_]?0:96,r[2]=d[_++]):(r[0]=a[d[_]-f]+16+64,r[2]=c[d[_++]-f]):r[0]=192,y=1<<v-I,g=k>>>I;V>g;g+=y)h.set(r,3*(C+g));for(g=1<<v-1;0!=(k&g);g>>>=1)k^=g;for(k^=g,z=(1<<I)-1;(k&z)!=s[m];)m--,I-=S,z=(1<<I)-1}return 0!==x&&1!=b?-5:0}function c(o){let c;for(t||(t=[],e=[],n=new f(16),r=[],i=new f(15),s=new f(16)),e.length<o&&(e=[]),c=0;o>c;c++)e[c]=0;for(c=0;16>c;c++)n[c]=0;for(c=0;3>c;c++)r[c]=0;i.set(n.subarray(0,15),0),s.set(n.subarray(0,16),0)}this.me=(n,r,i,s,f)=>{let a;return c(19),t[0]=0,a=o(n,0,19,19,null,null,i,r,s,t,e),-3==a?f.ie="oversubscribed dynamic bit lengths tree":-5!=a&&0!==r[0]||(f.ie="incomplete dynamic bit lengths tree",a=-3),a},this.ke=(n,r,i,s,f,a,l,u,h)=>{let w;return c(288),t[0]=0,w=o(i,0,n,257,gt,vt,a,s,u,t,e),0!=w||0===s[0]?(-3==w?h.ie="oversubscribed literal/length tree":-4!=w&&(h.ie="incomplete literal/length tree",w=-3),w):(c(288),w=o(i,n,r,0,St,zt,l,f,u,t,e),0!=w||0===f[0]&&n>257?(-3==w?h.ie="oversubscribed distance tree":-5==w?(h.ie="incomplete distance tree",w=-3):-4!=w&&(h.ie="empty distance tree with lengths",w=-3),w):0)}}function Ct(){const t=this;let e,n,r,i,s=0,o=0,f=0,c=0,a=0,l=0,u=0,h=0,w=0,d=0;function p(t,e,n,r,i,s,o,f){let c,a,l,u,h,w,d,p,y,b,m,k,g,v,S,z;d=f.ye,p=f.ee,h=o.ge,w=o.ve,y=o.write,b=y<o.read?o.read-y-1:o.end-y,m=bt[t],k=bt[e];do{for(;20>w;)p--,h|=(255&f.Se(d++))<<w,w+=8;if(c=h&m,a=n,l=r,z=3*(l+c),0!==(u=a[z]))for(;;){if(h>>=a[z+1],w-=a[z+1],0!=(16&u)){for(u&=15,g=a[z+2]+(h&bt[u]),h>>=u,w-=u;15>w;)p--,h|=(255&f.Se(d++))<<w,w+=8;for(c=h&k,a=i,l=s,z=3*(l+c),u=a[z];;){if(h>>=a[z+1],w-=a[z+1],0!=(16&u)){for(u&=15;u>w;)p--,h|=(255&f.Se(d++))<<w,w+=8;if(v=a[z+2]+(h&bt[u]),h>>=u,w-=u,b-=g,v>y){S=y-v;do{S+=o.end}while(0>S);if(u=o.end-S,g>u){if(g-=u,y-S>0&&u>y-S)do{o.ze[y++]=o.ze[S++]}while(0!=--u);else o.ze.set(o.ze.subarray(S,S+u),y),y+=u,S+=u,u=0;S=0}}else S=y-v,y-S>0&&2>y-S?(o.ze[y++]=o.ze[S++],o.ze[y++]=o.ze[S++],g-=2):(o.ze.set(o.ze.subarray(S,S+2),y),y+=2,S+=2,g-=2);if(y-S>0&&g>y-S)do{o.ze[y++]=o.ze[S++]}while(0!=--g);else o.ze.set(o.ze.subarray(S,S+g),y),y+=g,S+=g,g=0;break}if(0!=(64&u))return f.ie="invalid distance code",g=f.ee-p,g=g>w>>3?w>>3:g,p+=g,d-=g,w-=g<<3,o.ge=h,o.ve=w,f.ee=p,f.oe+=d-f.ye,f.ye=d,o.write=y,-3;c+=a[z+2],c+=h&bt[u],z=3*(l+c),u=a[z]}break}if(0!=(64&u))return 0!=(32&u)?(g=f.ee-p,g=g>w>>3?w>>3:g,p+=g,d-=g,w-=g<<3,o.ge=h,o.ve=w,f.ee=p,f.oe+=d-f.ye,f.ye=d,o.write=y,1):(f.ie="invalid literal/length code",g=f.ee-p,g=g>w>>3?w>>3:g,p+=g,d-=g,w-=g<<3,o.ge=h,o.ve=w,f.ee=p,f.oe+=d-f.ye,f.ye=d,o.write=y,-3);if(c+=a[z+2],c+=h&bt[u],z=3*(l+c),0===(u=a[z])){h>>=a[z+1],w-=a[z+1],o.ze[y++]=a[z+2],b--;break}}else h>>=a[z+1],w-=a[z+1],o.ze[y++]=a[z+2],b--}while(b>=258&&p>=10);return g=f.ee-p,g=g>w>>3?w>>3:g,p+=g,d-=g,w-=g<<3,o.ge=h,o.ve=w,f.ee=p,f.oe+=d-f.ye,f.ye=d,o.write=y,0}t.init=(t,s,o,f,c,a)=>{e=0,u=t,h=s,r=o,w=f,i=c,d=a,n=null},t._e=(t,y,b)=>{let m,k,g,v,S,z,_,C=0,I=0,A=0;for(A=y.ye,v=y.ee,C=t.ge,I=t.ve,S=t.write,z=S<t.read?t.read-S-1:t.end-S;;)switch(e){case 0:if(z>=258&&v>=10&&(t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,b=p(u,h,r,w,i,d,t,y),A=y.ye,v=y.ee,C=t.ge,I=t.ve,S=t.write,z=S<t.read?t.read-S-1:t.end-S,0!=b)){e=1==b?7:9;break}f=u,n=r,o=w,e=1;case 1:for(m=f;m>I;){if(0===v)return t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);b=0,v--,C|=(255&y.Se(A++))<<I,I+=8}if(k=3*(o+(C&bt[m])),C>>>=n[k+1],I-=n[k+1],g=n[k],0===g){c=n[k+2],e=6;break}if(0!=(16&g)){a=15&g,s=n[k+2],e=2;break}if(0==(64&g)){f=g,o=k/3+n[k+2];break}if(0!=(32&g)){e=7;break}return e=9,y.ie="invalid literal/length code",b=-3,t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);case 2:for(m=a;m>I;){if(0===v)return t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);b=0,v--,C|=(255&y.Se(A++))<<I,I+=8}s+=C&bt[m],C>>=m,I-=m,f=h,n=i,o=d,e=3;case 3:for(m=f;m>I;){if(0===v)return t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);b=0,v--,C|=(255&y.Se(A++))<<I,I+=8}if(k=3*(o+(C&bt[m])),C>>=n[k+1],I-=n[k+1],g=n[k],0!=(16&g)){a=15&g,l=n[k+2],e=4;break}if(0==(64&g)){f=g,o=k/3+n[k+2];break}return e=9,y.ie="invalid distance code",b=-3,t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);case 4:for(m=a;m>I;){if(0===v)return t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);b=0,v--,C|=(255&y.Se(A++))<<I,I+=8}l+=C&bt[m],C>>=m,I-=m,e=5;case 5:for(_=S-l;0>_;)_+=t.end;for(;0!==s;){if(0===z&&(S==t.end&&0!==t.read&&(S=0,z=S<t.read?t.read-S-1:t.end-S),0===z&&(t.write=S,b=t.Ce(y,b),S=t.write,z=S<t.read?t.read-S-1:t.end-S,S==t.end&&0!==t.read&&(S=0,z=S<t.read?t.read-S-1:t.end-S),0===z)))return t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);t.ze[S++]=t.ze[_++],z--,_==t.end&&(_=0),s--}e=0;break;case 6:if(0===z&&(S==t.end&&0!==t.read&&(S=0,z=S<t.read?t.read-S-1:t.end-S),0===z&&(t.write=S,b=t.Ce(y,b),S=t.write,z=S<t.read?t.read-S-1:t.end-S,S==t.end&&0!==t.read&&(S=0,z=S<t.read?t.read-S-1:t.end-S),0===z)))return t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);b=0,t.ze[S++]=c,z--,e=0;break;case 7:if(I>7&&(I-=8,v++,A--),t.write=S,b=t.Ce(y,b),S=t.write,z=S<t.read?t.read-S-1:t.end-S,t.read!=t.write)return t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);e=8;case 8:return b=1,t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);case 9:return b=-3,t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b);default:return b=-2,t.ge=C,t.ve=I,y.ee=v,y.oe+=A-y.ye,y.ye=A,t.write=S,t.Ce(y,b)}},t.Ie=()=>{}}_t.Ae=(t,e,n,r)=>(t[0]=9,e[0]=5,n[0]=mt,r[0]=kt,0);const It=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function At(t,e){const n=this;let r,s=0,o=0,c=0,a=0;const l=[0],u=[0],h=new Ct;let w=0,d=new f(4320);const p=new _t;n.ve=0,n.ge=0,n.ze=new i(e),n.end=e,n.read=0,n.write=0,n.reset=(t,e)=>{e&&(e[0]=0),6==s&&h.Ie(t),s=0,n.ve=0,n.ge=0,n.read=n.write=0},n.reset(t,null),n.Ce=(t,e)=>{let r,i,s;return i=t.be,s=n.read,r=(s>n.write?n.end:n.write)-s,r>t.pe&&(r=t.pe),0!==r&&-5==e&&(e=0),t.pe-=r,t.fe+=r,t.we.set(n.ze.subarray(s,s+r),i),i+=r,s+=r,s==n.end&&(s=0,n.write==n.end&&(n.write=0),r=n.write-s,r>t.pe&&(r=t.pe),0!==r&&-5==e&&(e=0),t.pe-=r,t.fe+=r,t.we.set(n.ze.subarray(s,s+r),i),i+=r,s+=r),t.be=i,n.read=s,e},n._e=(t,e)=>{let i,f,y,b,m,k,g,v;for(b=t.ye,m=t.ee,f=n.ge,y=n.ve,k=n.write,g=k<n.read?n.read-k-1:n.end-k;;){let S,z,_,C,I,A,x,V;switch(s){case 0:for(;3>y;){if(0===m)return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);e=0,m--,f|=(255&t.Se(b++))<<y,y+=8}switch(i=7&f,w=1&i,i>>>1){case 0:f>>>=3,y-=3,i=7&y,f>>>=i,y-=i,s=1;break;case 1:S=[],z=[],_=[[]],C=[[]],_t.Ae(S,z,_,C),h.init(S[0],z[0],_[0],0,C[0],0),f>>>=3,y-=3,s=6;break;case 2:f>>>=3,y-=3,s=3;break;case 3:return f>>>=3,y-=3,s=9,t.ie="invalid block type",e=-3,n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e)}break;case 1:for(;32>y;){if(0===m)return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);e=0,m--,f|=(255&t.Se(b++))<<y,y+=8}if((~f>>>16&65535)!=(65535&f))return s=9,t.ie="invalid stored block lengths",e=-3,n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);o=65535&f,f=y=0,s=0!==o?2:0!==w?7:0;break;case 2:if(0===m)return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);if(0===g&&(k==n.end&&0!==n.read&&(k=0,g=k<n.read?n.read-k-1:n.end-k),0===g&&(n.write=k,e=n.Ce(t,e),k=n.write,g=k<n.read?n.read-k-1:n.end-k,k==n.end&&0!==n.read&&(k=0,g=k<n.read?n.read-k-1:n.end-k),0===g)))return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);if(e=0,i=o,i>m&&(i=m),i>g&&(i=g),n.ze.set(t.ne(b,i),k),b+=i,m-=i,k+=i,g-=i,0!=(o-=i))break;s=0!==w?7:0;break;case 3:for(;14>y;){if(0===m)return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);e=0,m--,f|=(255&t.Se(b++))<<y,y+=8}if(c=i=16383&f,(31&i)>29||(i>>5&31)>29)return s=9,t.ie="too many length or distance symbols",e=-3,n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);if(i=258+(31&i)+(i>>5&31),!r||r.length<i)r=[];else for(v=0;i>v;v++)r[v]=0;f>>>=14,y-=14,a=0,s=4;case 4:for(;4+(c>>>10)>a;){for(;3>y;){if(0===m)return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);e=0,m--,f|=(255&t.Se(b++))<<y,y+=8}r[It[a++]]=7&f,f>>>=3,y-=3}for(;19>a;)r[It[a++]]=0;if(l[0]=7,i=p.me(r,l,u,d,t),0!=i)return-3==(e=i)&&(r=null,s=9),n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);a=0,s=5;case 5:for(;i=c,258+(31&i)+(i>>5&31)>a;){let o,h;for(i=l[0];i>y;){if(0===m)return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);e=0,m--,f|=(255&t.Se(b++))<<y,y+=8}if(i=d[3*(u[0]+(f&bt[i]))+1],h=d[3*(u[0]+(f&bt[i]))+2],16>h)f>>>=i,y-=i,r[a++]=h;else{for(v=18==h?7:h-14,o=18==h?11:3;i+v>y;){if(0===m)return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);e=0,m--,f|=(255&t.Se(b++))<<y,y+=8}if(f>>>=i,y-=i,o+=f&bt[v],f>>>=v,y-=v,v=a,i=c,v+o>258+(31&i)+(i>>5&31)||16==h&&1>v)return r=null,s=9,t.ie="invalid bit length repeat",e=-3,n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);h=16==h?r[v-1]:0;do{r[v++]=h}while(0!=--o);a=v}}if(u[0]=-1,I=[],A=[],x=[],V=[],I[0]=9,A[0]=6,i=c,i=p.ke(257+(31&i),1+(i>>5&31),r,I,A,x,V,d,t),0!=i)return-3==i&&(r=null,s=9),e=i,n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);h.init(I[0],A[0],d,x[0],d,V[0]),s=6;case 6:if(n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,1!=(e=h._e(n,t,e)))return n.Ce(t,e);if(e=0,h.Ie(t),b=t.ye,m=t.ee,f=n.ge,y=n.ve,k=n.write,g=k<n.read?n.read-k-1:n.end-k,0===w){s=0;break}s=7;case 7:if(n.write=k,e=n.Ce(t,e),k=n.write,g=k<n.read?n.read-k-1:n.end-k,n.read!=n.write)return n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);s=8;case 8:return e=1,n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);case 9:return e=-3,n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e);default:return e=-2,n.ge=f,n.ve=y,t.ee=m,t.oe+=b-t.ye,t.ye=b,n.write=k,n.Ce(t,e)}}},n.Ie=t=>{n.reset(t,null),n.ze=null,d=null},n.xe=(t,e,r)=>{n.ze.set(t.subarray(e,e+r),0),n.read=n.write=r},n.Ve=()=>1==s?1:0}const xt=[0,0,255,255];function Vt(){const t=this;function e(t){return t&&t.Be?(t.oe=t.fe=0,t.ie=null,t.Be.mode=7,t.Be.De.reset(t,null),0):-2}t.mode=0,t.method=0,t.Ee=[0],t.Pe=0,t.marker=0,t.Re=0,t.Ue=e=>(t.De&&t.De.Ie(e),t.De=null,0),t.Me=(n,r)=>(n.ie=null,t.De=null,8>r||r>15?(t.Ue(n),-2):(t.Re=r,n.Be.De=new At(n,1<<r),e(n),0)),t.Te=(t,e)=>{let n,r;if(!t||!t.Be||!t.de)return-2;const i=t.Be;for(e=4==e?-5:0,n=-5;;)switch(i.mode){case 0:if(0===t.ee)return n;if(n=e,t.ee--,t.oe++,8!=(15&(i.method=t.Se(t.ye++)))){i.mode=13,t.ie="unknown compression method",i.marker=5;break}if(8+(i.method>>4)>i.Re){i.mode=13,t.ie="invalid win size",i.marker=5;break}i.mode=1;case 1:if(0===t.ee)return n;if(n=e,t.ee--,t.oe++,r=255&t.Se(t.ye++),((i.method<<8)+r)%31!=0){i.mode=13,t.ie="incorrect header check",i.marker=5;break}if(0==(32&r)){i.mode=7;break}i.mode=2;case 2:if(0===t.ee)return n;n=e,t.ee--,t.oe++,i.Pe=(255&t.Se(t.ye++))<<24&4278190080,i.mode=3;case 3:if(0===t.ee)return n;n=e,t.ee--,t.oe++,i.Pe+=(255&t.Se(t.ye++))<<16&16711680,i.mode=4;case 4:if(0===t.ee)return n;n=e,t.ee--,t.oe++,i.Pe+=(255&t.Se(t.ye++))<<8&65280,i.mode=5;case 5:return 0===t.ee?n:(n=e,t.ee--,t.oe++,i.Pe+=255&t.Se(t.ye++),i.mode=6,2);case 6:return i.mode=13,t.ie="need dictionary",i.marker=0,-2;case 7:if(n=i.De._e(t,n),-3==n){i.mode=13,i.marker=0;break}if(0==n&&(n=e),1!=n)return n;n=e,i.De.reset(t,i.Ee),i.mode=12;case 12:return t.ee=0,1;case 13:return-3;default:return-2}},t.He=(t,e,n)=>{let r=0,i=n;if(!t||!t.Be||6!=t.Be.mode)return-2;const s=t.Be;return i<1<<s.Re||(i=(1<<s.Re)-1,r=n-i),s.De.xe(e,r,i),s.mode=7,0},t.Ke=t=>{let n,r,i,s,o;if(!t||!t.Be)return-2;const f=t.Be;if(13!=f.mode&&(f.mode=13,f.marker=0),0===(n=t.ee))return-5;for(r=t.ye,i=f.marker;0!==n&&4>i;)t.Se(r)==xt[i]?i++:i=0!==t.Se(r)?0:4-i,r++,n--;return t.oe+=r-t.ye,t.ye=r,t.ee=n,f.marker=i,4!=i?-3:(s=t.oe,o=t.fe,e(t),t.oe=s,t.fe=o,f.mode=7,0)},t.Le=t=>t&&t.Be&&t.Be.De?t.Be.De.Ve():-2}function Bt(){}function Dt(t){const e=new Bt,s=t&&t.ft?n.floor(2*t.ft):131072,o=new i(s);let f=!1;e.Me(),e.we=o,this.append=(t,n)=>{const c=[];let a,l,u=0,h=0,w=0;if(0!==t.length){e.ye=0,e.de=t,e.ee=t.length;do{if(e.be=0,e.pe=s,0!==e.ee||f||(e.ye=0,f=!0),a=e.Te(0),f&&-5===a){if(0!==e.ee)throw new r("inflating: bad input")}else if(0!==a&&1!==a)throw new r("inflating: "+e.ie);if((f||1===a)&&e.ee===t.length)throw new r("inflating: bad input");e.be&&(e.be===s?c.push(new i(o)):c.push(o.slice(0,e.be))),w+=e.be,n&&e.ye>0&&e.ye!=u&&(n(e.ye),u=e.ye)}while(e.ee>0||0===e.pe);return c.length>1?(l=new i(w),c.forEach((t=>{l.set(t,h),h+=t.length}))):l=c[0]||new i(0),l}},this.flush=()=>{e.Ue()}}Bt.prototype={Me:function(t){const e=this;return e.Be=new Vt,t||(t=15),e.Be.Me(e,t)},Te:function(t){const e=this;return e.Be?e.Be.Te(e,t):-2},Ue:function(){const t=this;if(!t.Be)return-2;const e=t.Be.Ue(t);return t.Be=null,e},Ke:function(){const t=this;return t.Be?t.Be.Ke(t):-2},He:function(t,e){const n=this;return n.Be?n.Be.He(n,t,e):-2},Se:function(t){return this.de[t]},ne:function(t,e){return this.de.subarray(t,t+e)}},self.initCodec=()=>{self.Deflate=yt,self.Inflate=Dt};\n'],{type:"text/javascript"}));e({workerScripts:{inflate:[t],deflate:[t]}});}};

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

	function getMimeType() {
		return "application/octet-stream";
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

	var streamCodecShim = (library, options = {}, registerDataHandler) => {
		return {
			Deflate: createCodecClass(library.Deflate, options.deflate, registerDataHandler),
			Inflate: createCodecClass(library.Inflate, options.inflate, registerDataHandler)
		};
	};

	function createCodecClass(constructor, constructorOptions, registerDataHandler) {
		return class {

			constructor(options) {
				const codecAdapter = this;
				const onData = data => {
					if (codecAdapter.pendingData) {
						const pendingData = codecAdapter.pendingData;
						codecAdapter.pendingData = new Uint8Array(pendingData.length + data.length);
						codecAdapter.pendingData.set(pendingData, 0);
						codecAdapter.pendingData.set(data, pendingData.length);
					} else {
						codecAdapter.pendingData = new Uint8Array(data);
					}
				};
				// eslint-disable-next-line no-prototype-builtins
				if (options.hasOwnProperty("level") && options.level === undefined) {
					delete options.level;
				}
				codecAdapter.codec = new constructor(Object.assign({}, constructorOptions, options));
				registerDataHandler(codecAdapter.codec, onData);
			}
			append(data) {
				this.codec.push(data);
				return getResponse(this);
			}
			flush() {
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

		constructor(crc) {
			this.crc = crc || -1;
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
		constructor(crc) {
			super({
				start() {
					this.crc32 = new Crc32(crc);
				},
				transform(chunk) {
					if (chunk) {
						this.crc32.append(chunk);
					}
				},
				flush(controller) {
					const value = new Uint8Array(4);
					const dataView = new DataView(value.buffer);
					dataView.setUint32(0, this.crc32.get());
					controller.enqueue(value);
				}
			});
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
		if (typeof TextEncoder == "undefined") {
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

	/*// deno-lint-ignore-file no-this-alias *

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
	hash.sha1 = function (hash) {
		if (hash) {
			this._h = hash._h.slice(0);
			this._buffer = hash._buffer.slice(0);
			this._length = hash._length;
		} else {
			this.reset();
		}
	};

	hash.sha1.prototype = {
		/**
		 * The hash's block size, in bits.
		 * @constant
		 */
		blockSize: 512,

		/**
		 * Reset the hash state.
		 * @return this
		 */
		reset: function () {
			const sha1 = this;
			sha1._h = this._init.slice(0);
			sha1._buffer = [];
			sha1._length = 0;
			return sha1;
		},

		/**
		 * Input several words to the hash.
		 * @param {bitArray|String} data the data to hash.
		 * @return this
		 */
		update: function (data) {
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
		},

		/**
		 * Complete hashing and output the hash value.
		 * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
		 */
		finalize: function () {
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
		},

		/**
		 * The SHA-1 initialization vector.
		 * @private
		 */
		_init: [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],

		/**
		 * The SHA-1 hash key.
		 * @private
		 */
		_key: [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],

		/**
		 * The SHA-1 logical functions f(0), f(1), ..., f(79).
		 * @private
		 */
		_f: function (t, b, c, d) {
			if (t <= 19) {
				return (b & c) | (~b & d);
			} else if (t <= 39) {
				return b ^ c ^ d;
			} else if (t <= 59) {
				return (b & c) | (b & d) | (c & d);
			} else if (t <= 79) {
				return b ^ c ^ d;
			}
		},

		/**
		 * Circular left-shift operator.
		 * @private
		 */
		_S: function (n, x) {
			return (x << n) | (x >>> 32 - n);
		},

		/**
		 * Perform one cycle of SHA-1.
		 * @param {Uint32Array|bitArray} words one block of words.
		 * @private
		 */
		_block: function (words) {
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
			const bs = Hash.prototype.blockSize / 32;
			hmac._baseHash = [new Hash(), new Hash()];

			if (key.length > bs) {
				key = Hash.hash(key);
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

	const ERR_INVALID_PASSWORD = "Invalid pasword";
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
	const CRYPTO_API_SUPPORTED = typeof crypto != "undefined";
	const SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof crypto.subtle != "undefined";
	const codecBytes = codec.bytes;
	const Aes = cipher.aes;
	const CtrGladman = mode.ctrGladman;
	const HmacSha1 = misc.hmacSha1;

	class AESDecryptStream extends TransformStream {

		constructor(password, signed, strength) {
			let stream;
			super({
				start() {
					Object.assign(this, {
						ready: new Promise(resolve => this.resolveReady = resolve),
						password,
						signed,
						strength: strength - 1,
						pendingInput: new Uint8Array(0)
					});
				},
				async transform(chunk, controller) {
					if (chunk && chunk.length) {
						const aesCrypto = this;
						if (aesCrypto.password) {
							const password = aesCrypto.password;
							aesCrypto.password = null;
							const preamble = subarray(chunk, 0, SALT_LENGTH[aesCrypto.strength] + 2);
							await createDecryptionKeys(aesCrypto, preamble, password);
							aesCrypto.aesCtrGladman = new CtrGladman(new Aes(aesCrypto.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
							aesCrypto.hmac = new HmacSha1(aesCrypto.keys.authentication);
							chunk = subarray(chunk, SALT_LENGTH[aesCrypto.strength] + 2);
							aesCrypto.resolveReady();
						} else {
							await aesCrypto.ready;
						}
						const output = new Uint8Array(chunk.length - SIGNATURE_LENGTH - ((chunk.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
						controller.enqueue(append(aesCrypto, chunk, output, 0, SIGNATURE_LENGTH, true));
					}
				},
				async flush(controller) {
					const aesCrypto = this;
					await aesCrypto.ready;
					const pendingInput = aesCrypto.pendingInput;
					const chunkToDecrypt = subarray(pendingInput, 0, pendingInput.length - SIGNATURE_LENGTH);
					const originalSignature = subarray(pendingInput, pendingInput.length - SIGNATURE_LENGTH);
					let decryptedChunkArray = new Uint8Array(0);
					if (chunkToDecrypt.length) {
						const encryptedChunk = codecBytes.toBits(chunkToDecrypt);
						aesCrypto.hmac.update(encryptedChunk);
						const decryptedChunk = aesCrypto.aesCtrGladman.update(encryptedChunk);
						decryptedChunkArray = codecBytes.fromBits(decryptedChunk);
					}
					stream.valid = true;
					if (aesCrypto.signed) {
						const signature = subarray(codecBytes.fromBits(aesCrypto.hmac.digest()), 0, SIGNATURE_LENGTH);
						for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
							if (signature[indexSignature] != originalSignature[indexSignature]) {
								stream.valid = false;
							}
						}
					}
					controller.enqueue(decryptedChunkArray);
				}
			});
			stream = this;
		}
	}

	class AESEncryptStream extends TransformStream {

		constructor(password, strength) {
			let stream;
			super({
				start() {
					Object.assign(this, {
						ready: new Promise(resolve => this.resolveReady = resolve),
						password,
						strength: strength - 1,
						pendingInput: new Uint8Array(0)
					});
				},
				async transform(chunk, controller) {
					if (chunk && chunk.length) {
						const aesCrypto = this;
						let preamble = new Uint8Array(0);
						if (aesCrypto.password) {
							const password = aesCrypto.password;
							aesCrypto.password = null;
							preamble = await createEncryptionKeys(aesCrypto, password);
							aesCrypto.aesCtrGladman = new CtrGladman(new Aes(aesCrypto.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
							aesCrypto.hmac = new HmacSha1(aesCrypto.keys.authentication);
							aesCrypto.resolveReady();
						} else {
							await aesCrypto.ready;
						}
						const output = new Uint8Array(preamble.length + chunk.length - (chunk.length % BLOCK_LENGTH));
						output.set(preamble, 0);
						controller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0));
					}
				},
				async flush(controller) {
					const aesCrypto = this;
					await aesCrypto.ready;
					let encryptedChunkArray = new Uint8Array(0);
					if (aesCrypto.pendingInput.length) {
						const encryptedChunk = aesCrypto.aesCtrGladman.update(codecBytes.toBits(aesCrypto.pendingInput));
						aesCrypto.hmac.update(encryptedChunk);
						encryptedChunkArray = codecBytes.fromBits(encryptedChunk);
					}
					stream.signature = subarray(codecBytes.fromBits(aesCrypto.hmac.digest()), 0, SIGNATURE_LENGTH);
					controller.enqueue(concat(encryptedChunkArray, stream.signature));
				}
			});
			stream = this;
		}
	}

	function append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
		const inputLength = input.length - paddingEnd;
		if (aesCrypto.pendingInput.length) {
			input = concat(aesCrypto.pendingInput, input);
			output = expand(output, inputLength - (inputLength % BLOCK_LENGTH));
		}
		let offset;
		for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
			const inputChunk = codecBytes.toBits(subarray(input, offset, offset + BLOCK_LENGTH));
			if (verifySignature) {
				aesCrypto.hmac.update(inputChunk);
			}
			const outputChunk = aesCrypto.aesCtrGladman.update(inputChunk);
			if (!verifySignature) {
				aesCrypto.hmac.update(outputChunk);
			}
			output.set(codecBytes.fromBits(outputChunk), offset + paddingStart);
		}
		aesCrypto.pendingInput = subarray(input, offset);
		return output;
	}

	async function createDecryptionKeys(decrypt, preambleArray, password) {
		await createKeys$1(decrypt, password, subarray(preambleArray, 0, SALT_LENGTH[decrypt.strength]));
		const passwordVerification = subarray(preambleArray, SALT_LENGTH[decrypt.strength]);
		const passwordVerificationKey = decrypt.keys.passwordVerification;
		if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
			throw new Error(ERR_INVALID_PASSWORD);
		}
	}

	async function createEncryptionKeys(encrypt, password) {
		const salt = getRandomValues(new Uint8Array(SALT_LENGTH[encrypt.strength]));
		await createKeys$1(encrypt, password, salt);
		return concat(salt, encrypt.keys.passwordVerification);
	}

	async function createKeys$1(target, password, salt) {
		const encodedPassword = encodeText(password);
		const basekey = await importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), basekey, 8 * ((KEY_LENGTH[target.strength] * 2) + 2));
		const compositeKey = new Uint8Array(derivedBits);
		target.keys = {
			key: codecBytes.toBits(subarray(compositeKey, 0, KEY_LENGTH[target.strength])),
			authentication: codecBytes.toBits(subarray(compositeKey, KEY_LENGTH[target.strength], KEY_LENGTH[target.strength] * 2)),
			passwordVerification: subarray(compositeKey, KEY_LENGTH[target.strength] * 2)
		};
	}

	function getRandomValues(array) {
		if (CRYPTO_API_SUPPORTED && typeof crypto.getRandomValues == "function") {
			return crypto.getRandomValues(array);
		} else {
			return random.getRandomValues(array);
		}
	}

	function importKey(format, password, algorithm, extractable, keyUsages) {
		if (CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof crypto.subtle.importKey == "function") {
			return crypto.subtle.importKey(format, password, algorithm, extractable, keyUsages);
		} else {
			return misc.importKey(password);
		}
	}

	async function deriveBits(algorithm, baseKey, length) {
		if (CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof crypto.subtle.deriveBits == "function") {
			return await crypto.subtle.deriveBits(algorithm, baseKey, length);
		} else {
			return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
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

	class ZipCryptoDecryptStream extends TransformStream {

		constructor(password, passwordVerification) {
			let zipCrypto;
			super({
				start() {
					Object.assign(this, {
						password,
						passwordVerification
					});
					createKeys(this, password);
				},
				transform(chunk, controller) {
					if (this.password) {
						const decryptedHeader = decrypt(this, chunk.subarray(0, HEADER_LENGTH));
						this.password = null;
						if (decryptedHeader[HEADER_LENGTH - 1] != this.passwordVerification) {
							throw new Error(ERR_INVALID_PASSWORD);
						}
						chunk = chunk.subarray(HEADER_LENGTH);
					}
					controller.enqueue(decrypt(this, chunk));
				},
				flush() {
					zipCrypto.valid = true;
				}
			});
			zipCrypto = this;
		}
	}

	class ZipCryptoEncryptStream extends TransformStream {

		constructor(password, passwordVerification) {
			super({
				start() {
					Object.assign(this, {
						password,
						passwordVerification
					});
					createKeys(this, password);
				},
				transform(chunk, controller) {
					if (chunk) {
						let output;
						let offset;
						if (this.password) {
							this.password = null;
							const header = crypto.getRandomValues(new Uint8Array(HEADER_LENGTH));
							header[HEADER_LENGTH - 1] = this.passwordVerification;
							output = new Uint8Array(chunk.length + header.length);
							output.set(encrypt(this, header), 0);
							offset = HEADER_LENGTH;
						} else {
							output = new Uint8Array(chunk.length);
							offset = 0;
						}
						output.set(encrypt(this, chunk), offset);
						controller.enqueue(output);
					}
				},
				flush() {
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
		target.keys = [0x12345678, 0x23456789, 0x34567890];
		target.crcKey0 = new Crc32(target.keys[0]);
		target.crcKey2 = new Crc32(target.keys[2]);
		for (let index = 0; index < password.length; index++) {
			updateKeys(target, password.charCodeAt(index));
		}
	}

	function updateKeys(target, byte) {
		target.crcKey0.append([byte]);
		target.keys[0] = ~target.crcKey0.get();
		target.keys[1] = getInt32(target.keys[1] + getInt8(target.keys[0]));
		target.keys[1] = getInt32(Math.imul(target.keys[1], 134775813) + 1);
		target.crcKey2.append([target.keys[1] >>> 24]);
		target.keys[2] = ~target.crcKey2.get();
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

	/*
	 * This program is based on JZlib 1.0.2 ymnk, JCraft,Inc.
	 * JZlib is based on zlib-1.1.3, so all credit should go authors
	 * Jean-loup Gailly(jloup@gzip.org) and Mark Adler(madler@alumni.caltech.edu)
	 * and contributors of zlib.
	 */

	/* global TransformStream */

	class CodecStream extends TransformStream {
		constructor(Codec, options) {
			super({
				start() {
					this.codec = new Codec(options);
				},
				transform(chunk, controller) {
					chunk = this.codec.append(chunk);
					if (chunk) {
						controller.enqueue(chunk);
					}
				},
				flush(controller) {
					const chunk = this.codec.flush();
					if (chunk) {
						controller.enqueue(chunk);
					}
				}
			});
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

	const CODEC_DEFLATE = "deflate";
	const CODEC_INFLATE = "inflate";
	const ERR_INVALID_SIGNATURE = "Invalid signature";

	class Inflate {

		constructor(codecConstructor, {
			signature,
			password,
			signed,
			compressed,
			zipCrypto,
			passwordVerification,
			encryptionStrength,
			useCompressionStream
		}, { chunkSize }) {
			const encrypted = Boolean(password);
			const codec = this;
			Object.assign(codec, {
				signature,
				encrypted,
				signed,
				compressed,
				zipCrypto,
				stream: new ReadableStream({
					start(controller) {
						codec.controller = controller;
					}
				})
			});
			if (encrypted) {
				if (zipCrypto) {
					codec.stream = codec.stream.pipeThrough(new ZipCryptoDecryptStream(password, passwordVerification));
				} else {
					codec.decryptStream = new AESDecryptStream(password, signed, encryptionStrength);
					codec.stream = codec.stream.pipeThrough(codec.decryptStream);
				}
			}
			if (compressed) {
				if ((useCompressionStream !== undefined && !useCompressionStream) || typeof DecompressionStream == "undefined") {
					codec.stream = codec.stream.pipeThrough(new CodecStream(codecConstructor, { chunkSize }));
				} else {
					codec.stream = codec.stream.pipeThrough(new DecompressionStream("deflate-raw"));
				}
			}
			if ((!encrypted || zipCrypto) && signed) {
				const tee = codec.stream.tee();
				codec.stream = tee[0];
				codec.crc32Stream = tee[1].pipeThrough(new Crc32Stream());
			}
			codec.reader = codec.stream.getReader();
		}

		async append(data) {
			const codec = this;
			if (!codec.error) {
				codec.controller.enqueue(data);
				codec.read().catch(error => {
					codec.error = error;
					codec.onerror(error);
				});
			}
		}

		async flush() {
			const codec = this;
			if (!codec.error) {
				codec.controller.close();
				while (!(await codec.read())) { /* empty block */ }
				let signature;
				if (codec.encrypted && !codec.zipCrypto) {
					if (!codec.decryptStream.valid) {
						throw new Error(ERR_INVALID_SIGNATURE);
					}
				}
				if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
					signature = await codec.crc32Stream.getReader().read();
					const dataViewSignature = new DataView(signature.value.buffer);
					if (codec.signature != dataViewSignature.getUint32(0, false)) {
						throw new Error(ERR_INVALID_SIGNATURE);
					}
				}
				codec.ondata({ value: { signature }, done: true });
			}
		}

		async read() {
			const codec = this;
			const { value, done } = await codec.reader.read();
			if (value && value.length) {
				codec.ondata({ value: { data: new Uint8Array(value) } });
			}
			return done;
		}
	}

	class Deflate {

		constructor(codecConstructor, {
			encrypted,
			signed,
			compressed,
			level,
			zipCrypto,
			password,
			passwordVerification,
			encryptionStrength,
			useCompressionStream
		}, { chunkSize }) {
			const codec = this;
			Object.assign(this, {
				encrypted,
				signed,
				compressed,
				zipCrypto,
				stream: new ReadableStream({
					start(controller) {
						codec.controller = controller;
					}
				})
			});
			if ((!encrypted || zipCrypto) && signed) {
				const tee = codec.stream.tee();
				codec.stream = tee[0];
				codec.crc32Stream = tee[1].pipeThrough(new Crc32Stream());
			}
			if (compressed) {
				if ((useCompressionStream !== undefined && !useCompressionStream) || typeof CompressionStream == "undefined") {
					codec.stream = codec.stream.pipeThrough(new CodecStream(codecConstructor, { chunkSize, level }));
				} else {
					codec.stream = codec.stream.pipeThrough(new CompressionStream("deflate-raw"));
				}
			}
			if (encrypted) {
				if (zipCrypto) {
					codec.stream = codec.stream.pipeThrough(new ZipCryptoEncryptStream(password, passwordVerification));
				} else {
					codec.encryptStream = new AESEncryptStream(password, encryptionStrength);
					codec.stream = codec.stream.pipeThrough(codec.encryptStream);
				}
			}
			codec.reader = codec.stream.getReader();
		}

		async append(data) {
			const codec = this;
			if (!codec.error) {
				codec.controller.enqueue(data);
				codec.read().catch(error => {
					codec.onerror(error);
					codec.error = error;
				});
			}
		}

		async flush() {
			const codec = this;
			if (!codec.error) {
				codec.controller.close();
				while (!(await codec.read())) { /* empty block */ }
				let signature;
				if (codec.encrypted && !codec.zipCrypto) {
					signature = codec.encryptStream.signature;
				}
				if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
					signature = await codec.crc32Stream.getReader().read();
					signature = new DataView(signature.value.buffer).getUint32(0);
				}
				codec.ondata({ value: { signature }, done: true });
			}
		}

		async read() {
			const codec = this;
			const { value, done } = await codec.reader.read();
			if (value && value.length) {
				codec.ondata({ value: { data: new Uint8Array(value) } });
			}
			return done;
		}
	}

	function createCodec$1(codecConstructor, options, config) {
		if (options.codecType.startsWith(CODEC_DEFLATE)) {
			return new Deflate(codecConstructor, options, config);
		} else if (options.codecType.startsWith(CODEC_INFLATE)) {
			return new Inflate(codecConstructor, options, config);
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

	const MESSAGE_INIT = "init";
	const MESSAGE_APPEND = "append";
	const MESSAGE_FLUSH = "flush";
	const MESSAGE_EVENT_TYPE = "message";

	let classicWorkersSupported = true;

	var getWorker = (workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts) => {
		Object.assign(workerData, {
			busy: true,
			codecConstructor,
			options: Object.assign({}, options),
			scripts,
			terminate() {
				if (workerData.worker && !workerData.busy) {
					workerData.worker.terminate();
					workerData.interface = null;
				}
			},
			onTaskFinished() {
				workerData.busy = false;
				onTaskFinished(workerData);
			}
		});
		return webWorker ? createWebWorkerInterface(workerData, config) : createWorkerInterface(workerData, config);
	};

	function createWorkerInterface(workerData, config) {
		const interfaceCodec = createCodec$1(workerData.codecConstructor, workerData.options, config);
		const codec = {
			async append(data) {
				try {
					await interfaceCodec.append(data);
				} catch (error) {
					workerData.onTaskFinished();
					throw error;
				}
			},
			async flush() {
				try {
					await interfaceCodec.flush();
				} finally {
					workerData.onTaskFinished();
				}
			},
			abort() {
				workerData.onTaskFinished();
			}
		};
		interfaceCodec.ondata = data => codec.ondata(data);
		interfaceCodec.onerror = error => codec.onerror(error);
		return codec;
	}

	function createWebWorkerInterface(workerData, config) {
		let initialized;
		const workerOptions = { type: "module" };
		if (!workerData.interface) {
			if (!classicWorkersSupported) {
				workerData.worker = getWorker(workerOptions, config.baseURL);
			} else {
				try {
					workerData.worker = getWorker({}, config.baseURL);
				} catch (_error) {
					classicWorkersSupported = false;
					workerData.worker = getWorker(workerOptions, config.baseURL);
				}
			}
			workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
			workerData.interface = {
				append(data) {
					initAndSendMessage({ type: MESSAGE_APPEND, data });
				},
				flush() {
					initAndSendMessage({ type: MESSAGE_FLUSH });
				},
				abort() {
					workerData.onTaskFinished();
				}
			};
		}
		return workerData.interface;

		function getWorker(options, baseURL) {
			let url, scriptUrl;
			url = workerData.scripts[0];
			if (typeof url == "function") {
				url = url();
			}
			try {
				scriptUrl = new URL(url, baseURL);
			} catch (_error) {
				scriptUrl = url;
			}
			return new Worker(scriptUrl, options);
		}

		function initAndSendMessage(message) {
			if (!initialized) {
				initialized = true;
				const options = workerData.options;
				const scripts = workerData.scripts.slice(1);
				sendMessage({ scripts, type: MESSAGE_INIT, options, config: { chunkSize: config.chunkSize } });
			}
			sendMessage(message);
		}

		function sendMessage(message) {
			const worker = workerData.worker;
			try {
				if (message.data) {
					try {
						message.data = message.data.buffer;
						worker.postMessage(message, [message.data]);
					} catch (_error) {
						worker.postMessage(message);
					}
				} else {
					worker.postMessage(message);
				}
			} catch (error) {
				initialized = false;
				workerData.onTaskFinished();
				throw error;
			}
		}

		function onMessage(event) {
			const message = event.data;
			const reponseError = message.error;
			const codec = workerData.interface;
			if (reponseError) {
				const error = new Error(reponseError.message);
				error.stack = reponseError.stack;
				initialized = false;
				codec.onerror(error);
				workerData.onTaskFinished();
			} else {
				const { value, done } = message.data;
				if (done) {
					initialized = false;
					codec.ondata({ value: { data: new Uint8Array(value.data), signature: value.signature }, done: true });
					workerData.onTaskFinished();
				} else if (value.data) {
					codec.ondata({ value: { data: new Uint8Array(value.data) } });
				}
			}
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

	let pool = [];
	const pendingRequests = [];

	function createCodec(codecConstructor, options, config) {
		const streamCopy = !options.compressed && !options.signed && !options.encrypted;
		const webWorker = !streamCopy && (options.useWebWorkers || (options.useWebWorkers === undefined && config.useWebWorkers));
		const scripts = webWorker && config.workerScripts ? config.workerScripts[options.codecType] : [];
		options.useCompressionStream = options.useCompressionStream === undefined ? config.useCompressionStream : options.useCompressionStream;
		if (pool.length < config.maxWorkers) {
			const workerData = {};
			pool.push(workerData);
			return getWorker(workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts);
		} else {
			const workerData = pool.find(workerData => !workerData.busy);
			if (workerData) {
				clearTerminateTimeout(workerData);
				return getWorker(workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts);
			} else {
				return new Promise(resolve => pendingRequests.push({ resolve, codecConstructor, options, webWorker, scripts }));
			}
		}

		function onTaskFinished(workerData) {
			if (pendingRequests.length) {
				const [{ resolve, codecConstructor, options, webWorker, scripts }] = pendingRequests.splice(0, 1);
				resolve(getWorker(workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts));
			} else if (workerData.worker) {
				clearTerminateTimeout(workerData);
				if (Number.isFinite(config.terminateWorkerTimeout) && config.terminateWorkerTimeout >= 0) {
					workerData.terminateTimeout = setTimeout(() => {
						pool = pool.filter(data => data != workerData);
						workerData.terminate();
					}, config.terminateWorkerTimeout);
				}
			} else {
				pool = pool.filter(data => data != workerData);
			}
		}
	}

	function clearTerminateTimeout(workerData) {
		if (workerData.terminateTimeout) {
			clearTimeout(workerData.terminateTimeout);
			workerData.terminateTimeout = null;
		}
	}

	function terminateWorkers() {
		pool.forEach(workerData => {
			clearTerminateTimeout(workerData);
			workerData.terminate();
		});
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

	const MINIMUM_CHUNK_SIZE = 64;
	const ERR_ABORT = "Abort error";

	async function processData(codec, reader, writer, offset, inputLengthGetter, config, options) {
		const chunkSize = Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
		const signal = options.signal;
		let length = 0;

		return new Promise((resolve, reject) => {
			codec.onerror = error => reject(error);
			codec.ondata = async ({ value, done }) => {
				try {
					testAborted(signal, codec);
					const { data, signature } = value;
					if (data && data.length) {
						length += await writeData(writer, data);
					}
					if (done) {
						resolve({ signature, length });
					}
				} catch (error) {
					reject(error);
				}
			};
			processChunk().catch(reject);
		});

		async function processChunk(chunkOffset = 0) {
			const inputLength = inputLengthGetter();
			if (chunkOffset < inputLength) {
				testAborted(signal, codec);
				const data = await reader.readUint8Array(chunkOffset + offset, Math.min(chunkSize, inputLength - chunkOffset));
				const chunkLength = data.length;
				testAborted(signal, codec);
				await codec.append(data);
				testAborted(signal, codec);
				if (options.onprogress) {
					try {
						options.onprogress(chunkOffset + chunkLength, inputLength);
					} catch (error) {
						// ignored
					}
				}
				return processChunk(chunkOffset + chunkSize);
			} else {
				await codec.flush();
			}
		}
	}

	function testAborted(signal, codec) {
		if (signal && signal.aborted) {
			codec.abort();
			throw new Error(ERR_ABORT);
		}
	}

	async function writeData(writer, data) {
		if (data.length) {
			await writer.writeUint8Array(data);
		}
		return data.length;
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

	/* global Blob, FileReader, atob, btoa, XMLHttpRequest, document, fetch */

	const ERR_HTTP_STATUS = "HTTP error ";
	const ERR_HTTP_RANGE = "HTTP Range not supported";
	const ERR_NOT_SEEKABLE_READER = "Reader is not seekable";

	const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
	const HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
	const HTTP_HEADER_CONTENT_RANGE = "Content-Range";
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

		init() {
			super.init();
			this.blobReader.init();
			this.size = this.blobReader.size;
		}

		readUint8Array(offset, length) {
			return this.blobReader.readUint8Array(offset, length);
		}
	}

	class TextWriter extends Writer {

		constructor(encoding) {
			super();
			this.encoding = encoding;
			this.blob = new Blob([], { type: CONTENT_TYPE_TEXT_PLAIN });
		}

		writeUint8Array(array) {
			super.writeUint8Array(array);
			this.blob = new Blob([this.blob, array.buffer], { type: CONTENT_TYPE_TEXT_PLAIN });
		}

		getData() {
			if (this.blob.text) {
				return this.blob.text();
			} else {
				const reader = new FileReader();
				return new Promise((resolve, reject) => {
					reader.onload = event => resolve(event.target.result);
					reader.onerror = () => reject(reader.error);
					reader.readAsText(this.blob, this.encoding);
				});
			}
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

		readUint8Array(offset, length) {
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

		writeUint8Array(array) {
			super.writeUint8Array(array);
			let indexArray = 0;
			let dataString = this.pending;
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
			if (this.blob.arrayBuffer) {
				return new Uint8Array(await this.blob.slice(offset, offset + length).arrayBuffer());
			} else {
				const reader = new FileReader();
				return new Promise((resolve, reject) => {
					reader.onload = event => resolve(new Uint8Array(event.target.result));
					reader.onerror = () => reject(reader.error);
					reader.readAsArrayBuffer(this.blob.slice(offset, offset + length));
				});
			}
		}
	}

	class BlobWriter extends Writer {

		constructor(contentType) {
			super();
			this.contentType = contentType;
			this.arrayBuffersMaxlength = 8;
			initArrayBuffers(this);
		}

		writeUint8Array(array) {
			super.writeUint8Array(array);
			if (this.arrayBuffers.length == this.arrayBuffersMaxlength) {
				flushArrayBuffers(this);
			}
			this.arrayBuffers.push(array.buffer);
		}

		getData() {
			if (!this.blob) {
				if (this.arrayBuffers.length) {
					flushArrayBuffers(this);
				}
				this.blob = this.pendingBlob;
				initArrayBuffers(this);
			}
			return this.blob;
		}
	}

	function initArrayBuffers(blobWriter) {
		blobWriter.pendingBlob = new Blob([], { type: blobWriter.contentType });
		blobWriter.arrayBuffers = [];
	}

	function flushArrayBuffers(blobWriter) {
		blobWriter.pendingBlob = new Blob([blobWriter.pendingBlob, ...blobWriter.arrayBuffers], { type: blobWriter.contentType });
		blobWriter.arrayBuffers = [];
	}

	class ReadableStreamReader {

		constructor(readableStream) {
			this.readableStream = readableStream;
			this.reader = readableStream.getReader();
			this.size = Infinity;
			this.index = 0;
			this.currentSize = 0;
			this.pendingValue = new Uint8Array();
		}

		init() {
			this.initialized = true;
		}

		async readUint8Array(index, length) {
			if (this.index != index) {
				throw new Error(ERR_NOT_SEEKABLE_READER);
			}
			let data = new Uint8Array(length);
			let size = 0, done;
			do {
				const result = await this.reader.read();
				let { value } = result;
				done = result.done;
				if (value) {
					this.currentSize += value.length;
				} else {
					value = this.pendingValue;
					this.pendingValue = new Uint8Array();
				}
				if (this.pendingValue.length) {
					const newValue = new Uint8Array(this.pendingValue.length + value.length);
					newValue.set(this.pendingValue);
					newValue.set(value, this.pendingValue.length);
					this.pendingValue = new Uint8Array();
					value = newValue;
				}
				if (size + value.length > length) {
					data.set(value.subarray(0, length), size);
					this.pendingValue = value.subarray(length);
					size += length;
				} else {
					data.set(value, size);
					size += value.length;
				}
			} while (size < length && !done);
			if (done && this.size == Infinity) {
				this.size = this.currentSize;
			}
			if (this.size < length) {
				data = data.slice(0, this.size);
				length = this.size;
			}
			this.index += length;
			return data;
		}
	}

	class WritableStreamWriter extends Writer {

		constructor(writableStream) {
			super();
			this.writableStream = writableStream;
			this.writer = writableStream.getWriter();
		}

		async writeUint8Array(array) {
			await this.writer.ready;
			return this.writer.write(array);
		}

		async getData() {
			await this.writer.ready;
			await this.writer.close();
			return this.writableStream;
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
			await initHttpReader(this, sendFetchRequest, getFetchRequestData);
		}

		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendFetchRequest, getFetchRequestData);
		}
	}

	class XHRReader extends Reader {

		constructor(url, options) {
			super();
			this.url = url;
			this.preventHeadRequest = options.preventHeadRequest;
			this.useRangeHeader = options.useRangeHeader;
			this.forceRangeRequests = options.forceRangeRequests;
			this.options = options;
		}

		async init() {
			super.init();
			await initHttpReader(this, sendXMLHttpRequest, getXMLHttpRequestData);
		}

		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendXMLHttpRequest, getXMLHttpRequestData);
		}
	}

	async function initHttpReader(httpReader, sendRequest, getRequestData) {
		if (isHttpFamily(httpReader.url) && (httpReader.useRangeHeader || httpReader.forceRangeRequests)) {
			const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader));
			if (!httpReader.forceRangeRequests && response.headers.get(HTTP_HEADER_ACCEPT_RANGES) != HTTP_RANGE_UNIT) {
				throw new Error(ERR_HTTP_RANGE);
			} else {
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
				if (contentSize === undefined) {
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
		if (httpReader.useRangeHeader || httpReader.forceRangeRequests) {
			const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));
			if (response.status != 206) {
				throw new Error(ERR_HTTP_RANGE);
			}
			return new Uint8Array(await response.arrayBuffer());
		} else {
			if (!httpReader.data) {
				await getRequestData(httpReader, httpReader.options);
			}
			return new Uint8Array(httpReader.data.subarray(index, index + length));
		}
	}

	function getRangeHeaders(httpReader, index = 0, length = 1) {
		return Object.assign({}, getHeaders(httpReader), { [HTTP_HEADER_RANGE]: HTTP_RANGE_UNIT + "=" + index + "-" + (index + length - 1) });
	}

	function getHeaders(httpReader) {
		const headers = httpReader.options.headers;
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
			throw new Error(ERR_HTTP_STATUS + (response.statusText || response.status));
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
					reject(new Error(ERR_HTTP_STATUS + (request.statusText || request.status)));
				}
			}, false);
			request.addEventListener("error", event => reject(event.detail.error), false);
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
			this.array = array;
			this.size = array.length;
		}

		readUint8Array(index, length) {
			return this.array.slice(index, index + length);
		}
	}

	class Uint8ArrayWriter extends Writer {

		constructor() {
			super();
			this.array = new Uint8Array(0);
		}

		writeUint8Array(array) {
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
	const EXTRAFIELD_TYPE_NTFS = 0x000a;
	const EXTRAFIELD_TYPE_NTFS_TAG1 = 0x0001;
	const EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 0x5455;
	const EXTRAFIELD_TYPE_UNICODE_PATH = 0x7075;
	const EXTRAFIELD_TYPE_UNICODE_COMMENT = 0x6375;

	const BITFLAG_ENCRYPTED = 0x01;
	const BITFLAG_LEVEL = 0x06;
	const BITFLAG_DATA_DESCRIPTOR = 0x0008;
	const BITFLAG_LANG_ENCODING_FLAG = 0x0800;
	const FILE_ATTR_MSDOS_DIR_MASK = 0x10;

	const VERSION_DEFLATE = 0x14;
	const VERSION_ZIP64 = 0x2D;
	const VERSION_AES = 0x33;

	const DIRECTORY_SIGNATURE = "/";

	const MAX_DATE = new Date(2107, 11, 31);
	const MIN_DATE = new Date(1980, 0, 1);

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

	const CP437 = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("");

	var decodeCP437 = stringValue => {
		let result = "";
		for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
			result += CP437[stringValue[indexCharacter]];
		}
		return result;
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

	function decodeText(value, encoding) {
		if (encoding && encoding.trim().toLowerCase() == "cp437") {
			return decodeCP437(value);
		} else if (typeof TextDecoder == "undefined") {
			const fileReader = new FileReader();
			return new Promise((resolve, reject) => {
				fileReader.onload = event => resolve(event.target.result);
				fileReader.onerror = () => reject(fileReader.error);
				fileReader.readAsText(new Blob([value]));
			});
		} else {
			return new TextDecoder(encoding).decode(value);
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

	const PROPERTY_NAMES = [
		"filename", "rawFilename", "directory", "encrypted", "compressedSize", "uncompressedSize",
		"lastModDate", "rawLastModDate", "comment", "rawComment", "signature", "extraField",
		"rawExtraField", "bitFlag", "extraFieldZip64", "extraFieldUnicodePath", "extraFieldUnicodeComment",
		"extraFieldAES", "filenameUTF8", "commentUTF8", "offset", "zip64", "compressionMethod",
		"extraFieldNTFS", "lastAccessDate", "creationDate", "extraFieldExtendedTimestamp",
		"version", "versionMadeBy", "msDosCompatible", "internalFileAttribute", "externalFileAttribute"];

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

	const ERR_BAD_FORMAT = "File format is not recognized";
	const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
	const ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
	const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
	const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
	const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
	const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
	const ERR_ENCRYPTED = "File contains encrypted entry";
	const ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const CHARSET_UTF8 = "utf-8";
	const CHARSET_CP437 = "cp437";
	const ZIP64_PROPERTIES = ["uncompressedSize", "compressedSize", "offset"];

	class ZipReader {

		constructor(reader, options = {}) {
			Object.assign(this, {
				reader,
				options,
				config: getConfiguration()
			});
		}

		async* getEntriesGenerator(options = {}) {
			const zipReader = this;
			const reader = zipReader.reader;
			if (!reader.initialized) {
				await reader.init();
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
				throw new Error(ERR_BAD_FORMAT);
			}
			const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, reader.size, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);
			if (!endOfDirectoryInfo) {
				throw new Error(ERR_EOCDR_NOT_FOUND);
			}
			const endOfDirectoryView = getDataView$1(endOfDirectoryInfo);
			let directoryDataLength = getUint32(endOfDirectoryView, 12);
			let directoryDataOffset = getUint32(endOfDirectoryView, 16);
			let filesLength = getUint16(endOfDirectoryView, 8);
			let prependedDataLength = 0;
			if (directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS) {
				const endOfDirectoryLocatorArray = await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
				const endOfDirectoryLocatorView = getDataView$1(endOfDirectoryLocatorArray);
				if (getUint32(endOfDirectoryLocatorView, 0) != ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);
				}
				directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
				let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
				let endOfDirectoryView = getDataView$1(endOfDirectoryArray);
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
				if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
					endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);
					endOfDirectoryView = getDataView$1(endOfDirectoryArray);
				}
				if (getUint32(endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
					throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
				}
				filesLength = getBigUint64(endOfDirectoryView, 32);
				directoryDataLength = getBigUint64(endOfDirectoryView, 40);
				directoryDataOffset -= directoryDataLength;
			}
			if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
				throw new Error(ERR_BAD_FORMAT);
			}
			let offset = 0;
			let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
			let directoryView = getDataView$1(directoryArray);
			if (directoryDataLength) {
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
					directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength);
					directoryView = getDataView$1(directoryArray);
				}
			}
			if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
				throw new Error(ERR_BAD_FORMAT);
			}
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry(reader, zipReader.config, zipReader.options);
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
					throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				}
				readCommonHeader(fileEntry, directoryView, offset + 6);
				const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
				const filenameOffset = offset + 46;
				const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
				const commentOffset = extraFieldOffset + fileEntry.extraFieldLength;
				const versionMadeBy = getUint16(directoryView, offset + 4);
				const msDosCompatible = (versionMadeBy & 0) == 0;
				Object.assign(fileEntry, {
					versionMadeBy,
					msDosCompatible,
					compressedSize: 0,
					uncompressedSize: 0,
					commentLength: getUint16(directoryView, offset + 32),
					directory: msDosCompatible && ((getUint8(directoryView, offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK),
					offset: getUint32(directoryView, offset + 42) + prependedDataLength,
					internalFileAttribute: getUint32(directoryView, offset + 34),
					externalFileAttribute: getUint32(directoryView, offset + 38),
					rawFilename: directoryArray.subarray(filenameOffset, extraFieldOffset),
					filenameUTF8: languageEncodingFlag,
					commentUTF8: languageEncodingFlag,
					rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset)
				});
				const endOffset = commentOffset + fileEntry.commentLength;
				fileEntry.rawComment = directoryArray.subarray(commentOffset, endOffset);
				const filenameEncoding = getOptionValue$1(zipReader, options, "filenameEncoding");
				const commentEncoding = getOptionValue$1(zipReader, options, "commentEncoding");
				const [filename, comment] = await Promise.all([
					decodeText(fileEntry.rawFilename, fileEntry.filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437),
					decodeText(fileEntry.rawComment, fileEntry.commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437)
				]);
				fileEntry.filename = filename;
				fileEntry.comment = comment;
				if (!fileEntry.directory && fileEntry.filename.endsWith(DIRECTORY_SIGNATURE)) {
					fileEntry.directory = true;
				}
				await readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
				const entry = new Entry(fileEntry);
				entry.getData = (writer, options) => fileEntry.getData(writer, entry, options);
				offset = endOffset;
				if (options.onprogress) {
					try {
						options.onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
					} catch (_error) {
						// ignored
					}
				}
				yield entry;
			}
			return true;
		}

		async getEntries(options = {}) {
			const entries = [];
			const iter = this.getEntriesGenerator(options);
			let curr = iter.next();
			while (!(await curr).done) {
				entries.push((await curr).value);
				curr = iter.next();
			}
			return entries;
		}

		async close() {
		}
	}

	class ZipEntry {

		constructor(reader, config, options) {
			Object.assign(this, {
				reader,
				config,
				options
			});
		}

		async getData(writer, fileEntry, options = {}) {
			const zipEntry = this;
			const {
				reader,
				offset,
				extraFieldAES,
				compressionMethod,
				config,
				bitFlag,
				signature,
				rawLastModDate,
				compressedSize
			} = zipEntry;
			const localDirectory = zipEntry.localDirectory = {};
			if (!reader.initialized) {
				await reader.init();
			}
			let dataArray = await readUint8Array(reader, offset, 30);
			const dataView = getDataView$1(dataArray);
			let password = getOptionValue$1(zipEntry, options, "password");
			password = password && password.length && password;
			if (extraFieldAES) {
				if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
					throw new Error(ERR_UNSUPPORTED_COMPRESSION);
				}
			}
			if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE) {
				throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
				throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
			}
			readCommonHeader(localDirectory, dataView, 4);
			dataArray = await readUint8Array(reader, offset, 30 + localDirectory.filenameLength + localDirectory.extraFieldLength);
			localDirectory.rawExtraField = dataArray.subarray(30 + localDirectory.filenameLength);
			await readCommonFooter(zipEntry, localDirectory, dataView, 4);
			fileEntry.lastAccessDate = localDirectory.lastAccessDate;
			fileEntry.creationDate = localDirectory.creationDate;
			const encrypted = zipEntry.encrypted && localDirectory.encrypted;
			const zipCrypto = encrypted && !extraFieldAES;
			if (encrypted) {
				if (!zipCrypto && extraFieldAES.strength === undefined) {
					throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
				} else if (!password) {
					throw new Error(ERR_ENCRYPTED);
				}
			}
			const codec = await createCodec(config.Inflate, {
				codecType: CODEC_INFLATE,
				password,
				zipCrypto,
				encryptionStrength: extraFieldAES && extraFieldAES.strength,
				signed: getOptionValue$1(zipEntry, options, "checkSignature"),
				passwordVerification: zipCrypto && (bitFlag.dataDescriptor ? ((rawLastModDate >>> 8) & 0xFF) : ((signature >>> 24) & 0xFF)),
				signature,
				compressed: compressionMethod != 0,
				encrypted,
				useWebWorkers: getOptionValue$1(zipEntry, options, "useWebWorkers"),
				useCompressionStream: getOptionValue$1(zipEntry, options, "useCompressionStream")
			}, config);
			if (!writer.initialized) {
				await writer.init();
			}
			const signal = getOptionValue$1(zipEntry, options, "signal");
			const dataOffset = offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength;
			await processData(codec, reader, writer, dataOffset, () => compressedSize, config, { onprogress: options.onprogress, signal });
			return writer.getData();
		}
	}

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

	async function readCommonFooter(fileEntry, directory, dataView, offset) {
		const rawExtraField = directory.rawExtraField;
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
		} catch (_error) {
			// ignored
		}
		const compressionMethod = getUint16(dataView, offset + 4);
		directory.signature = getUint32(dataView, offset + 10);
		directory.uncompressedSize = getUint32(dataView, offset + 18);
		directory.compressedSize = getUint32(dataView, offset + 14);
		const extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
		if (extraFieldZip64) {
			readExtraFieldZip64(extraFieldZip64, directory);
			directory.extraFieldZip64 = extraFieldZip64;
		}
		const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
		if (extraFieldUnicodePath) {
			await readExtraFieldUnicode(extraFieldUnicodePath, "filename", "rawFilename", directory, fileEntry);
			directory.extraFieldUnicodePath = extraFieldUnicodePath;
		}
		const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
		if (extraFieldUnicodeComment) {
			await readExtraFieldUnicode(extraFieldUnicodeComment, "comment", "rawComment", directory, fileEntry);
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
			readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory);
			directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
		}
	}

	function readExtraFieldZip64(extraFieldZip64, directory) {
		directory.zip64 = true;
		const extraFieldView = getDataView$1(extraFieldZip64.data);
		extraFieldZip64.values = [];
		for (let indexValue = 0; indexValue < Math.floor(extraFieldZip64.data.length / 8); indexValue++) {
			extraFieldZip64.values.push(getBigUint64(extraFieldView, 0 + indexValue * 8));
		}
		const missingProperties = ZIP64_PROPERTIES.filter(propertyName => directory[propertyName] == MAX_32_BITS);
		for (let indexMissingProperty = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
			extraFieldZip64[missingProperties[indexMissingProperty]] = extraFieldZip64.values[indexMissingProperty];
		}
		ZIP64_PROPERTIES.forEach(propertyName => {
			if (directory[propertyName] == MAX_32_BITS) {
				if (extraFieldZip64[propertyName] !== undefined) {
					directory[propertyName] = extraFieldZip64[propertyName];
				} else {
					throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
				}
			}
		});
	}

	async function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
		const extraFieldView = getDataView$1(extraFieldUnicode.data);
		extraFieldUnicode.version = getUint8(extraFieldView, 0);
		extraFieldUnicode.signature = getUint32(extraFieldView, 1);
		const crc32 = new Crc32();
		crc32.append(fileEntry[rawPropertyName]);
		const dataViewSignature = getDataView$1(new Uint8Array(4));
		dataViewSignature.setUint32(0, crc32.get(), true);
		extraFieldUnicode[propertyName] = await decodeText(extraFieldUnicode.data.subarray(5));
		extraFieldUnicode.valid = !fileEntry.bitFlag.languageEncodingFlag && extraFieldUnicode.signature == getUint32(dataViewSignature, 0);
		if (extraFieldUnicode.valid) {
			directory[propertyName] = extraFieldUnicode[propertyName];
			directory[propertyName + "UTF8"] = true;
		}
	}

	function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
		const extraFieldView = getDataView$1(extraFieldAES.data);
		extraFieldAES.vendorVersion = getUint8(extraFieldView, 0);
		extraFieldAES.vendorId = getUint8(extraFieldView, 2);
		const strength = getUint8(extraFieldView, 4);
		extraFieldAES.strength = strength;
		extraFieldAES.originalCompressionMethod = compressionMethod;
		directory.compressionMethod = extraFieldAES.compressionMethod = getUint16(extraFieldView, 5);
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
		} catch (_error) {
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
		} catch (_error) {
			// ignored
		}
	}

	function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory) {
		const extraFieldView = getDataView$1(extraFieldExtendedTimestamp.data);
		const flags = getUint8(extraFieldView, 0);
		const timeProperties = [];
		const timeRawProperties = [];
		if ((flags & 0x1) == 0x1) {
			timeProperties.push("lastModDate");
			timeRawProperties.push("rawLastModDate");
		}
		if ((flags & 0x2) == 0x2) {
			timeProperties.push("lastAccessDate");
			timeRawProperties.push("rawLastAccessDate");
		}
		if ((flags & 0x4) == 0x4) {
			timeProperties.push("creationDate");
			timeRawProperties.push("rawCreationDate");
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
		return options[name] === undefined ? zipReader.options[name] : options[name];
	}

	function getDate(timeRaw) {
		const date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
		try {
			return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
		} catch (_error) {
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

	function readUint8Array(reader, offset, size) {
		return reader.readUint8Array(offset, size);
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

	const ERR_DUPLICATED_NAME = "File already exists";
	const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
	const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
	const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
	const ERR_INVALID_VERSION = "Version exceeds 65535";
	const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
	const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported";

	const EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
	const EXTRAFIELD_LENGTH_ZIP64 = 24;

	let workers = 0;

	class ZipWriter {

		constructor(writer, options = {}) {
			Object.assign(this, {
				writer,
				options,
				config: getConfiguration(),
				files: new Map(),
				offset: writer.size,
				pendingCompressedSize: 0,
				pendingEntries: [],
				pendingAddFileCalls: new Set()
			});
		}

		async add(name = "", reader, options = {}) {
			const zipWriter = this;
			if (workers < zipWriter.config.maxWorkers) {
				workers++;
				let promiseAddFile;
				try {
					promiseAddFile = addFile(zipWriter, name, reader, options);
					this.pendingAddFileCalls.add(promiseAddFile);
					return await promiseAddFile;
				} finally {
					this.pendingAddFileCalls.delete(promiseAddFile);
					workers--;
					const pendingEntry = zipWriter.pendingEntries.shift();
					if (pendingEntry) {
						zipWriter.add(pendingEntry.name, pendingEntry.reader, pendingEntry.options)
							.then(pendingEntry.resolve)
							.catch(pendingEntry.reject);
					}
				}
			} else {
				return new Promise((resolve, reject) => zipWriter.pendingEntries.push({ name, reader, options, resolve, reject }));
			}
		}

		async close(comment = new Uint8Array(0), options = {}) {
			while (this.pendingAddFileCalls.size) {
				await Promise.all(Array.from(this.pendingAddFileCalls));
			}
			await closeFile(this, comment, options);
			return this.writer.getData();
		}
	}

	async function addFile(zipWriter, name, reader, options) {
		name = name.trim();
		if (options.directory && (!name.endsWith(DIRECTORY_SIGNATURE))) {
			name += DIRECTORY_SIGNATURE;
		} else {
			options.directory = name.endsWith(DIRECTORY_SIGNATURE);
		}
		if (zipWriter.files.has(name)) {
			throw new Error(ERR_DUPLICATED_NAME);
		}
		const rawFilename = encodeText(name);
		if (rawFilename.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_NAME);
		}
		const comment = options.comment || "";
		const rawComment = encodeText(comment);
		if (rawComment.length > MAX_16_BITS) {
			throw new Error(ERR_INVALID_ENTRY_COMMENT);
		}
		const version = zipWriter.options.version || options.version || 0;
		if (version > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const versionMadeBy = zipWriter.options.versionMadeBy || options.versionMadeBy || 20;
		if (versionMadeBy > MAX_16_BITS) {
			throw new Error(ERR_INVALID_VERSION);
		}
		const lastModDate = getOptionValue(zipWriter, options, "lastModDate") || new Date();
		const lastAccessDate = getOptionValue(zipWriter, options, "lastAccessDate");
		const creationDate = getOptionValue(zipWriter, options, "creationDate");
		const password = getOptionValue(zipWriter, options, "password");
		const encryptionStrength = getOptionValue(zipWriter, options, "encryptionStrength") || 3;
		const zipCrypto = getOptionValue(zipWriter, options, "zipCrypto");
		if (password !== undefined && encryptionStrength !== undefined && (encryptionStrength < 1 || encryptionStrength > 3)) {
			throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
		}
		let rawExtraField = new Uint8Array(0);
		const extraField = options.extraField;
		if (extraField) {
			let extraFieldSize = 0;
			let offset = 0;
			extraField.forEach(data => extraFieldSize += 4 + data.length);
			rawExtraField = new Uint8Array(extraFieldSize);
			extraField.forEach((data, type) => {
				if (type > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
				}
				if (data.length > MAX_16_BITS) {
					throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
				}
				arraySet(rawExtraField, new Uint16Array([type]), offset);
				arraySet(rawExtraField, new Uint16Array([data.length]), offset + 2);
				arraySet(rawExtraField, data, offset + 4);
				offset += 4 + data.length;
			});
		}
		let extendedTimestamp = getOptionValue(zipWriter, options, "extendedTimestamp");
		if (extendedTimestamp === undefined) {
			extendedTimestamp = true;
		}
		let maximumCompressedSize = 0;
		let keepOrder = getOptionValue(zipWriter, options, "keepOrder");
		if (keepOrder === undefined) {
			keepOrder = true;
		}
		let uncompressedSize = 0;
		let msDosCompatible = getOptionValue(zipWriter, options, "msDosCompatible");
		if (msDosCompatible === undefined) {
			msDosCompatible = true;
		}
		const internalFileAttribute = getOptionValue(zipWriter, options, "internalFileAttribute") || 0;
		const externalFileAttribute = getOptionValue(zipWriter, options, "externalFileAttribute") || 0;
		if (reader) {
			if (!reader.initialized) {
				await reader.init();
			}
			uncompressedSize = reader.size;
			maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
		}
		let zip64 = options.zip64 || zipWriter.options.zip64 || false;
		if (zipWriter.offset + zipWriter.pendingCompressedSize >= MAX_32_BITS ||
			uncompressedSize >= MAX_32_BITS ||
			maximumCompressedSize >= MAX_32_BITS) {
			if (options.zip64 === false || zipWriter.options.zip64 === false || !keepOrder) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		zipWriter.pendingCompressedSize += maximumCompressedSize;
		await Promise.resolve();
		const level = getOptionValue(zipWriter, options, "level");
		const useWebWorkers = getOptionValue(zipWriter, options, "useWebWorkers");
		const bufferedWrite = getOptionValue(zipWriter, options, "bufferedWrite");
		let dataDescriptor = getOptionValue(zipWriter, options, "dataDescriptor");
		let dataDescriptorSignature = getOptionValue(zipWriter, options, "dataDescriptorSignature");
		const signal = getOptionValue(zipWriter, options, "signal");
		const useCompressionStream = getOptionValue(zipWriter, options, "useCompressionStream");
		if (dataDescriptor === undefined) {
			dataDescriptor = true;
		}
		if (dataDescriptor && dataDescriptorSignature === undefined) {
			dataDescriptorSignature = false;
		}
		const fileEntry = await getFileEntry(zipWriter, name, reader, Object.assign({}, options, {
			rawFilename,
			rawComment,
			version,
			versionMadeBy,
			lastModDate,
			lastAccessDate,
			creationDate,
			rawExtraField,
			zip64,
			password,
			level,
			useWebWorkers,
			encryptionStrength,
			extendedTimestamp,
			zipCrypto,
			bufferedWrite,
			keepOrder,
			dataDescriptor,
			dataDescriptorSignature,
			signal,
			msDosCompatible,
			internalFileAttribute,
			externalFileAttribute,
			useCompressionStream
		}));
		if (maximumCompressedSize) {
			zipWriter.pendingCompressedSize -= maximumCompressedSize;
		}
		Object.assign(fileEntry, { name, comment, extraField });
		return new Entry(fileEntry);
	}

	async function getFileEntry(zipWriter, name, reader, options) {
		const files = zipWriter.files;
		const writer = zipWriter.writer;
		const previousFileEntry = Array.from(files.values()).pop();
		let fileEntry = {};
		let bufferedWrite;
		let resolveLockUnbufferedWrite;
		let resolveLockCurrentFileEntry;
		files.set(name, fileEntry);
		try {
			let lockPreviousFileEntry;
			let fileWriter;
			let lockCurrentFileEntry;
			if (options.keepOrder) {
				lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
			}
			fileEntry.lock = lockCurrentFileEntry = new Promise(resolve => resolveLockCurrentFileEntry = resolve);
			if (options.bufferedWrite || zipWriter.lockWrite || !options.dataDescriptor) {
				fileWriter = new BlobWriter();
				fileWriter.init();
				bufferedWrite = true;
			} else {
				zipWriter.lockWrite = new Promise(resolve => resolveLockUnbufferedWrite = resolve);
				if (!writer.initialized) {
					await writer.init();
				}
				fileWriter = writer;
			}
			fileEntry = await createFileEntry(reader, fileWriter, zipWriter.config, options);
			fileEntry.lock = lockCurrentFileEntry;
			files.set(name, fileEntry);
			fileEntry.filename = name;
			if (bufferedWrite) {
				let indexWrittenData = 0;
				const blob = fileWriter.getData();
				await Promise.all([zipWriter.lockWrite, lockPreviousFileEntry]);
				let pendingFileEntry;
				do {
					pendingFileEntry = Array.from(files.values()).find(fileEntry => fileEntry.writingBufferedData);
					if (pendingFileEntry) {
						await pendingFileEntry.lock;
					}
				} while (pendingFileEntry && pendingFileEntry.lock);
				fileEntry.writingBufferedData = true;
				if (!options.dataDescriptor) {
					const headerLength = 26;
					const arrayBuffer = await sliceAsArrayBuffer(blob, 0, headerLength);
					const arrayBufferView = new DataView(arrayBuffer);
					if (!fileEntry.encrypted || options.zipCrypto) {
						setUint32(arrayBufferView, 14, fileEntry.signature);
					}
					if (fileEntry.zip64) {
						setUint32(arrayBufferView, 18, MAX_32_BITS);
						setUint32(arrayBufferView, 22, MAX_32_BITS);
					} else {
						setUint32(arrayBufferView, 18, fileEntry.compressedSize);
						setUint32(arrayBufferView, 22, fileEntry.uncompressedSize);
					}
					await writer.writeUint8Array(new Uint8Array(arrayBuffer));
					indexWrittenData = headerLength;
				}
				await writeBlob(writer, blob, indexWrittenData);
				delete fileEntry.writingBufferedData;
			}
			fileEntry.offset = zipWriter.offset;
			if (fileEntry.zip64) {
				const rawExtraFieldZip64View = getDataView(fileEntry.rawExtraFieldZip64);
				setBigUint64(rawExtraFieldZip64View, 20, BigInt(fileEntry.offset));
			} else if (fileEntry.offset >= MAX_32_BITS) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			}
			zipWriter.offset += fileEntry.length;
			return fileEntry;
		} catch (error) {
			if ((bufferedWrite && fileEntry.writingBufferedData) || (!bufferedWrite && fileEntry.dataWritten)) {
				error.corruptedEntry = zipWriter.hasCorruptedEntries = true;
				if (fileEntry.uncompressedSize) {
					zipWriter.offset += fileEntry.uncompressedSize;
				}
			}
			files.delete(name);
			throw error;
		} finally {
			resolveLockCurrentFileEntry();
			if (resolveLockUnbufferedWrite) {
				resolveLockUnbufferedWrite();
			}
		}
	}

	async function createFileEntry(reader, writer, config, options) {
		const {
			rawFilename,
			lastAccessDate,
			creationDate,
			password,
			level,
			zip64,
			zipCrypto,
			dataDescriptor,
			dataDescriptorSignature,
			directory,
			version,
			versionMadeBy,
			rawComment,
			rawExtraField,
			useWebWorkers,
			onprogress,
			signal,
			encryptionStrength,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttribute,
			externalFileAttribute,
			useCompressionStream
		} = options;
		const encrypted = Boolean(password && password.length);
		const compressed = level !== 0 && !directory;
		let rawExtraFieldAES;
		if (encrypted && !zipCrypto) {
			rawExtraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
			const extraFieldAESView = getDataView(rawExtraFieldAES);
			setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
			arraySet(rawExtraFieldAES, EXTRAFIELD_DATA_AES, 2);
			setUint8(extraFieldAESView, 8, encryptionStrength);
		} else {
			rawExtraFieldAES = new Uint8Array(0);
		}
		let rawExtraFieldNTFS;
		let rawExtraFieldExtendedTimestamp;
		if (extendedTimestamp) {
			rawExtraFieldExtendedTimestamp = new Uint8Array(9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0));
			const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
			setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
			setUint16(extraFieldExtendedTimestampView, 2, rawExtraFieldExtendedTimestamp.length - 4);
			const extraFieldExtendedTimestampFlag = 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0);
			setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
			setUint32(extraFieldExtendedTimestampView, 5, Math.floor(options.lastModDate.getTime() / 1000));
			if (lastAccessDate) {
				setUint32(extraFieldExtendedTimestampView, 9, Math.floor(lastAccessDate.getTime() / 1000));
			}
			if (creationDate) {
				setUint32(extraFieldExtendedTimestampView, 13, Math.floor(creationDate.getTime() / 1000));
			}
			try {
				rawExtraFieldNTFS = new Uint8Array(36);
				const extraFieldNTFSView = getDataView(rawExtraFieldNTFS);
				const lastModTimeNTFS = getTimeNTFS(options.lastModDate);
				setUint16(extraFieldNTFSView, 0, EXTRAFIELD_TYPE_NTFS);
				setUint16(extraFieldNTFSView, 2, 32);
				setUint16(extraFieldNTFSView, 8, EXTRAFIELD_TYPE_NTFS_TAG1);
				setUint16(extraFieldNTFSView, 10, 24);
				setBigUint64(extraFieldNTFSView, 12, lastModTimeNTFS);
				setBigUint64(extraFieldNTFSView, 20, getTimeNTFS(lastAccessDate) || lastModTimeNTFS);
				setBigUint64(extraFieldNTFSView, 28, getTimeNTFS(creationDate) || lastModTimeNTFS);
			} catch (_error) {
				rawExtraFieldNTFS = new Uint8Array(0);
			}
		} else {
			rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array(0);
		}
		const fileEntry = {
			version: version || VERSION_DEFLATE,
			versionMadeBy,
			zip64,
			directory: Boolean(directory),
			filenameUTF8: true,
			rawFilename,
			commentUTF8: true,
			rawComment,
			rawExtraFieldZip64: zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array(0),
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldAES,
			rawExtraField,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttribute,
			externalFileAttribute
		};
		let uncompressedSize = fileEntry.uncompressedSize = 0;
		let bitFlag = BITFLAG_LANG_ENCODING_FLAG;
		if (dataDescriptor) {
			bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
		}
		let compressionMethod = COMPRESSION_METHOD_STORE;
		if (compressed) {
			compressionMethod = COMPRESSION_METHOD_DEFLATE;
		}
		if (zip64) {
			fileEntry.version = fileEntry.version > VERSION_ZIP64 ? fileEntry.version : VERSION_ZIP64;
		}
		if (encrypted) {
			bitFlag = bitFlag | BITFLAG_ENCRYPTED;
			if (!zipCrypto) {
				fileEntry.version = fileEntry.version > VERSION_AES ? fileEntry.version : VERSION_AES;
				compressionMethod = COMPRESSION_METHOD_AES;
				if (compressed) {
					fileEntry.rawExtraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
				}
			}
		}
		fileEntry.compressionMethod = compressionMethod;
		const headerArray = fileEntry.headerArray = new Uint8Array(26);
		const headerView = getDataView(headerArray);
		setUint16(headerView, 0, fileEntry.version);
		setUint16(headerView, 2, bitFlag);
		setUint16(headerView, 4, compressionMethod);
		const dateArray = new Uint32Array(1);
		const dateView = getDataView(dateArray);
		let lastModDate;
		if (options.lastModDate < MIN_DATE) {
			lastModDate = MIN_DATE;
		} else if (options.lastModDate > MAX_DATE) {
			lastModDate = MAX_DATE;
		} else {
			lastModDate = options.lastModDate;
		}
		setUint16(dateView, 0, (((lastModDate.getHours() << 6) | lastModDate.getMinutes()) << 5) | lastModDate.getSeconds() / 2);
		setUint16(dateView, 2, ((((lastModDate.getFullYear() - 1980) << 4) | (lastModDate.getMonth() + 1)) << 5) | lastModDate.getDate());
		const rawLastModDate = dateArray[0];
		setUint32(headerView, 6, rawLastModDate);
		setUint16(headerView, 22, rawFilename.length);
		const extraFieldLength = rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length + fileEntry.rawExtraField.length;
		setUint16(headerView, 24, extraFieldLength);
		const localHeaderArray = new Uint8Array(30 + rawFilename.length + extraFieldLength);
		const localHeaderView = getDataView(localHeaderArray);
		setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
		arraySet(localHeaderArray, headerArray, 4);
		arraySet(localHeaderArray, rawFilename, 30);
		arraySet(localHeaderArray, rawExtraFieldAES, 30 + rawFilename.length);
		arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, 30 + rawFilename.length + rawExtraFieldAES.length);
		arraySet(localHeaderArray, rawExtraFieldNTFS, 30 + rawFilename.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length);
		arraySet(localHeaderArray, fileEntry.rawExtraField, 30 + rawFilename.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length);
		let result;
		let compressedSize = 0;
		if (reader) {
			const codec = await createCodec(config.Deflate, {
				codecType: CODEC_DEFLATE,
				level,
				password,
				encryptionStrength,
				zipCrypto: encrypted && zipCrypto,
				passwordVerification: encrypted && zipCrypto && (rawLastModDate >> 8) & 0xFF,
				signed: true,
				compressed,
				encrypted,
				useWebWorkers,
				useCompressionStream
			}, config);
			await writer.writeUint8Array(localHeaderArray);
			fileEntry.dataWritten = true;
			result = await processData(codec, reader, writer, 0, () => reader.size, config, { onprogress, signal });
			uncompressedSize = fileEntry.uncompressedSize = reader.size;
			compressedSize = result.length;
		} else {
			await writer.writeUint8Array(localHeaderArray);
			fileEntry.dataWritten = true;
		}
		let dataDescriptorArray = new Uint8Array(0);
		let dataDescriptorView, dataDescriptorOffset = 0;
		if (dataDescriptor) {
			dataDescriptorArray = new Uint8Array(zip64 ? (dataDescriptorSignature ? 24 : 20) : (dataDescriptorSignature ? 16 : 12));
			dataDescriptorView = getDataView(dataDescriptorArray);
			if (dataDescriptorSignature) {
				dataDescriptorOffset = 4;
				setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
			}
		}
		if (reader) {
			const signature = result.signature;
			if ((!encrypted || zipCrypto) && signature !== undefined) {
				setUint32(headerView, 10, signature);
				fileEntry.signature = signature;
				if (dataDescriptor) {
					setUint32(dataDescriptorView, dataDescriptorOffset, signature);
				}
			}
			if (zip64) {
				const rawExtraFieldZip64View = getDataView(fileEntry.rawExtraFieldZip64);
				setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
				setUint16(rawExtraFieldZip64View, 2, EXTRAFIELD_LENGTH_ZIP64);
				setUint32(headerView, 14, MAX_32_BITS);
				setBigUint64(rawExtraFieldZip64View, 12, BigInt(compressedSize));
				setUint32(headerView, 18, MAX_32_BITS);
				setBigUint64(rawExtraFieldZip64View, 4, BigInt(uncompressedSize));
				if (dataDescriptor) {
					setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
					setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
				}
			} else {
				setUint32(headerView, 14, compressedSize);
				setUint32(headerView, 18, uncompressedSize);
				if (dataDescriptor) {
					setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
					setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
				}
			}
		}
		if (dataDescriptor) {
			await writer.writeUint8Array(dataDescriptorArray);
		}
		const length = localHeaderArray.length + compressedSize + dataDescriptorArray.length;
		Object.assign(fileEntry, { compressedSize, lastModDate, rawLastModDate, creationDate, lastAccessDate, encrypted, length });
		return fileEntry;
	}

	async function closeFile(zipWriter, comment, options) {
		const writer = zipWriter.writer;
		const files = zipWriter.files;
		let offset = 0;
		let directoryDataLength = 0;
		let directoryOffset = zipWriter.offset;
		let filesLength = files.size;
		for (const [, fileEntry] of files) {
			directoryDataLength += 46 +
				fileEntry.rawFilename.length +
				fileEntry.rawComment.length +
				fileEntry.rawExtraFieldZip64.length +
				fileEntry.rawExtraFieldAES.length +
				fileEntry.rawExtraFieldExtendedTimestamp.length +
				fileEntry.rawExtraFieldNTFS.length +
				fileEntry.rawExtraField.length;
		}
		let zip64 = options.zip64 || zipWriter.options.zip64 || false;
		if (directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS) {
			if (options.zip64 === false || zipWriter.options.zip64 === false) {
				throw new Error(ERR_UNSUPPORTED_FORMAT);
			} else {
				zip64 = true;
			}
		}
		const directoryArray = new Uint8Array(directoryDataLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
		const directoryView = getDataView(directoryArray);
		if (comment && comment.length) {
			if (comment.length <= MAX_16_BITS) {
				setUint16(directoryView, offset + 20, comment.length);
			} else {
				throw new Error(ERR_INVALID_COMMENT);
			}
		}
		for (const [indexFileEntry, fileEntry] of Array.from(files.values()).entries()) {
			const {
				rawFilename,
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawExtraField,
				rawComment,
				versionMadeBy,
				headerArray,
				directory,
				zip64,
				msDosCompatible,
				internalFileAttribute,
				externalFileAttribute
			} = fileEntry;
			let rawExtraFieldExtendedTimestamp;
			let rawExtraFieldNTFS;
			if (fileEntry.extendedTimestamp) {
				rawExtraFieldNTFS = fileEntry.rawExtraFieldNTFS;
				rawExtraFieldExtendedTimestamp = new Uint8Array(9);
				const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
				setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				setUint16(extraFieldExtendedTimestampView, 2, rawExtraFieldExtendedTimestamp.length - 4);
				setUint8(extraFieldExtendedTimestampView, 4, 0x1);
				setUint32(extraFieldExtendedTimestampView, 5, Math.floor(fileEntry.lastModDate.getTime() / 1000));
			} else {
				rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array(0);
			}
			const extraFieldLength = rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length + rawExtraField.length;
			setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
			setUint16(directoryView, offset + 4, versionMadeBy);
			arraySet(directoryArray, headerArray, offset + 6);
			setUint16(directoryView, offset + 30, extraFieldLength);
			setUint16(directoryView, offset + 32, rawComment.length);
			setUint32(directoryView, offset + 34, internalFileAttribute);
			if (externalFileAttribute) {
				setUint32(directoryView, offset + 38, externalFileAttribute);
			} else if (directory && msDosCompatible) {
				setUint8(directoryView, offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
			}
			if (zip64) {
				setUint32(directoryView, offset + 42, MAX_32_BITS);
			} else {
				setUint32(directoryView, offset + 42, fileEntry.offset);
			}
			arraySet(directoryArray, rawFilename, offset + 46);
			arraySet(directoryArray, rawExtraFieldZip64, offset + 46 + rawFilename.length);
			arraySet(directoryArray, rawExtraFieldAES, offset + 46 + rawFilename.length + rawExtraFieldZip64.length);
			arraySet(directoryArray, rawExtraFieldExtendedTimestamp, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length);
			arraySet(directoryArray, rawExtraFieldNTFS, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length);
			arraySet(directoryArray, rawExtraField, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length);
			arraySet(directoryArray, rawComment, offset + 46 + rawFilename.length + extraFieldLength);
			offset += 46 + rawFilename.length + extraFieldLength + rawComment.length;
			if (options.onprogress) {
				try {
					options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
				} catch (_error) {
					// ignored
				}
			}
		}
		if (zip64) {
			setUint32(directoryView, offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			setBigUint64(directoryView, offset + 4, BigInt(44));
			setUint16(directoryView, offset + 12, 45);
			setUint16(directoryView, offset + 14, 45);
			setBigUint64(directoryView, offset + 24, BigInt(filesLength));
			setBigUint64(directoryView, offset + 32, BigInt(filesLength));
			setBigUint64(directoryView, offset + 40, BigInt(directoryDataLength));
			setBigUint64(directoryView, offset + 48, BigInt(directoryOffset));
			setUint32(directoryView, offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			setBigUint64(directoryView, offset + 64, BigInt(directoryOffset) + BigInt(directoryDataLength));
			setUint32(directoryView, offset + 72, ZIP64_TOTAL_NUMBER_OF_DISKS);
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			directoryDataLength = MAX_32_BITS;
			offset += 76;
		}
		setUint32(directoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
		setUint16(directoryView, offset + 8, filesLength);
		setUint16(directoryView, offset + 10, filesLength);
		setUint32(directoryView, offset + 12, directoryDataLength);
		setUint32(directoryView, offset + 16, directoryOffset);
		await writer.writeUint8Array(directoryArray);
		if (comment && comment.length) {
			await writer.writeUint8Array(comment);
		}
	}

	function sliceAsArrayBuffer(blob, start, end) {
		if (blob.arrayBuffer) {
			if (start || end) {
				return blob.slice(start, end).arrayBuffer();
			} else {
				return blob.arrayBuffer();
			}
		} else {
			const fileReader = new FileReader();
			return new Promise((resolve, reject) => {
				fileReader.onload = event => resolve(event.target.result);
				fileReader.onerror = () => reject(fileReader.error);
				fileReader.readAsArrayBuffer(start || end ? blob.slice(start, end) : blob);
			});
		}
	}

	async function writeBlob(writer, blob, start = 0) {
		const blockSize = 512 * 1024 * 1024;
		await writeSlice();

		async function writeSlice() {
			if (start < blob.size) {
				const arrayBuffer = await sliceAsArrayBuffer(blob, start, start + blockSize);
				await writer.writeUint8Array(new Uint8Array(arrayBuffer));
				start += blockSize;
				await writeSlice();
			}
		}
	}

	function getTimeNTFS(date) {
		if (date) {
			return ((BigInt(date.getTime()) + BigInt(11644473600000)) * BigInt(10000));
		}
	}

	function getOptionValue(zipWriter, options, name) {
		return options[name] === undefined ? zipWriter.options[name] : options[name];
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

	let baseURL;
	try {
		baseURL = (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('zip.js', document.baseURI).href));
	} catch (error) {
		// ignored
	}
	configure({ baseURL });
	e(configure);

	exports.BlobReader = BlobReader;
	exports.BlobWriter = BlobWriter;
	exports.Data64URIReader = Data64URIReader;
	exports.Data64URIWriter = Data64URIWriter;
	exports.ERR_ABORT = ERR_ABORT;
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
	exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
	exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
	exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
	exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
	exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
	exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
	exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
	exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
	exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
	exports.ERR_NOT_SEEKABLE_READER = ERR_NOT_SEEKABLE_READER;
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
	exports.ERR_UNSUPPORTED_FORMAT = ERR_UNSUPPORTED_FORMAT;
	exports.HttpRangeReader = HttpRangeReader;
	exports.HttpReader = HttpReader;
	exports.ReadableStreamReader = ReadableStreamReader;
	exports.Reader = Reader;
	exports.TextReader = TextReader;
	exports.TextWriter = TextWriter;
	exports.Uint8ArrayReader = Uint8ArrayReader;
	exports.Uint8ArrayWriter = Uint8ArrayWriter;
	exports.WritableStreamWriter = WritableStreamWriter;
	exports.Writer = Writer;
	exports.ZipReader = ZipReader;
	exports.ZipWriter = ZipWriter;
	exports.configure = configure;
	exports.getMimeType = getMimeType;
	exports.initShimAsyncCodec = streamCodecShim;
	exports.terminateWorkers = terminateWorkers;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
