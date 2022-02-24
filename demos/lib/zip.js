(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

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

	var t=t=>{if("function"==typeof URL.createObjectURL){const n=URL.createObjectURL(new Blob(['const t=[];for(let n=0;256>n;n++){let e=n;for(let t=0;8>t;t++)1&e?e=e>>>1^3988292384:e>>>=1;t[n]=e}class n{constructor(t){this.t=t||-1}append(n){let e=0|this.t;for(let r=0,i=0|n.length;i>r;r++)e=e>>>8^t[255&(e^n[r])];this.t=e}get(){return~this.t}}const e={concat(t,n){if(0===t.length||0===n.length)return t.concat(n);const r=t[t.length-1],i=e.i(r);return 32===i?t.concat(n):e.o(n,i,0|r,t.slice(0,t.length-1))},l(t){const n=t.length;if(0===n)return 0;const r=t[n-1];return 32*(n-1)+e.i(r)},u(t,n){if(32*t.length<n)return t;const r=(t=t.slice(0,Math.ceil(n/32))).length;return n&=31,r>0&&n&&(t[r-1]=e.h(n,t[r-1]&2147483648>>n-1,1)),t},h:(t,n,e)=>32===t?n:(e?0|n:n<<32-t)+1099511627776*t,i:t=>Math.round(t/1099511627776)||32,o(t,n,r,i){for(void 0===i&&(i=[]);n>=32;n-=32)i.push(r),r=0;if(0===n)return i.concat(t);for(let e=0;e<t.length;e++)i.push(r|t[e]>>>n),r=t[e]<<32-n;const o=t.length?t[t.length-1]:0,s=e.i(o);return i.push(e.h(n+s&31,n+s>32?r:i.pop(),1)),i}},r={p:{A(t){const n=e.l(t)/8,r=new Uint8Array(n);let i;for(let e=0;n>e;e++)0==(3&e)&&(i=t[e/4]),r[e]=i>>>24,i<<=8;return r},g(t){const n=[];let r,i=0;for(r=0;r<t.length;r++)i=i<<8|t[r],3==(3&r)&&(n.push(i),i=0);return 3&r&&n.push(e.h(8*(3&r),i)),n}}},i={k:function(t){t?(this.U=t.U.slice(0),this.v=t.v.slice(0),this.m=t.m):this.reset()}};i.k.prototype={blockSize:512,reset:function(){const t=this;return t.U=this.M.slice(0),t.v=[],t.m=0,t},update:function(t){const n=this;"string"==typeof t&&(t=r.I.g(t));const i=n.v=e.concat(n.v,t),o=n.m,s=n.m=o+e.l(t);if(s>9007199254740991)throw Error("Cannot hash more than 2^53 - 1 bits");const f=new Uint32Array(i);let c=0;for(let t=n.blockSize+o-(n.blockSize+o&n.blockSize-1);s>=t;t+=n.blockSize)n.S(f.subarray(16*c,16*(c+1))),c+=1;return i.splice(0,16*c),n},_:function(){const t=this;let n=t.v;const r=t.U;n=e.concat(n,[e.h(1,1)]);for(let t=n.length+2;15&t;t++)n.push(0);for(n.push(Math.floor(t.m/4294967296)),n.push(0|t.m);n.length;)t.S(n.splice(0,16));return t.reset(),r},M:[1732584193,4023233417,2562383102,271733878,3285377520],j:[1518500249,1859775393,2400959708,3395469782],O:(t,n,e,r)=>t>19?t>39?t>59?t>79?void 0:n^e^r:n&e|n&r|e&r:n^e^r:n&e|~n&r,C:(t,n)=>n<<t|n>>>32-t,S:function(t){const n=this,e=n.U,r=Array(80);for(let n=0;16>n;n++)r[n]=t[n];let i=e[0],o=e[1],s=e[2],f=e[3],c=e[4];for(let t=0;79>=t;t++){16>t||(r[t]=n.C(1,r[t-3]^r[t-8]^r[t-14]^r[t-16]));const e=n.C(5,i)+n.O(t,o,s,f)+c+r[t]+n.j[Math.floor(t/20)]|0;c=f,f=s,s=n.C(30,o),o=i,i=e}e[0]=e[0]+i|0,e[1]=e[1]+o|0,e[2]=e[2]+s|0,e[3]=e[3]+f|0,e[4]=e[4]+c|0}};const o={name:"PBKDF2"},s=Object.assign({hash:{name:"HMAC"}},o),f=Object.assign({iterations:1e3,hash:{name:"SHA-1"}},o),c=["deriveBits"],a=[8,12,16],l=[16,24,32],u=[0,0,0,0],h=r.p,w=class{constructor(t){const n=this;n.V=[[[],[],[],[],[]],[[],[],[],[],[]]],n.V[0][0][0]||n.B();const e=n.V[0][4],r=n.V[1],i=t.length;let o,s,f,c=1;if(4!==i&&6!==i&&8!==i)throw Error("invalid aes key size");for(n.j=[s=t.slice(0),f=[]],o=i;4*i+28>o;o++){let t=s[o-1];(o%i==0||8===i&&o%i==4)&&(t=e[t>>>24]<<24^e[t>>16&255]<<16^e[t>>8&255]<<8^e[255&t],o%i==0&&(t=t<<8^t>>>24^c<<24,c=c<<1^283*(c>>7))),s[o]=s[o-i]^t}for(let t=0;o;t++,o--){const n=s[3&t?o:o-4];f[t]=4>=o||4>t?n:r[0][e[n>>>24]]^r[1][e[n>>16&255]]^r[2][e[n>>8&255]]^r[3][e[255&n]]}}encrypt(t){return this.D(t,0)}decrypt(t){return this.D(t,1)}B(){const t=this.V[0],n=this.V[1],e=t[4],r=n[4],i=[],o=[];let s,f,c,a;for(let t=0;256>t;t++)o[(i[t]=t<<1^283*(t>>7))^t]=t;for(let l=s=0;!e[l];l^=f||1,s=o[s]||1){let o=s^s<<1^s<<2^s<<3^s<<4;o=o>>8^255&o^99,e[l]=o,r[o]=l,a=i[c=i[f=i[l]]];let u=16843009*a^65537*c^257*f^16843008*l,h=257*i[o]^16843008*o;for(let e=0;4>e;e++)t[e][l]=h=h<<24^h>>>8,n[e][o]=u=u<<24^u>>>8}for(let e=0;5>e;e++)t[e]=t[e].slice(0),n[e]=n[e].slice(0)}D(t,n){if(4!==t.length)throw Error("invalid aes block size");const e=this.j[n],r=e.length/4-2,i=[0,0,0,0],o=this.V[n],s=o[0],f=o[1],c=o[2],a=o[3],l=o[4];let u,h,w,d=t[0]^e[0],y=t[n?3:1]^e[1],p=t[2]^e[2],b=t[n?1:3]^e[3],A=4;for(let t=0;r>t;t++)u=s[d>>>24]^f[y>>16&255]^c[p>>8&255]^a[255&b]^e[A],h=s[y>>>24]^f[p>>16&255]^c[b>>8&255]^a[255&d]^e[A+1],w=s[p>>>24]^f[b>>16&255]^c[d>>8&255]^a[255&y]^e[A+2],b=s[b>>>24]^f[d>>16&255]^c[y>>8&255]^a[255&p]^e[A+3],A+=4,d=u,y=h,p=w;for(let t=0;4>t;t++)i[n?3&-t:t]=l[d>>>24]<<24^l[y>>16&255]<<16^l[p>>8&255]<<8^l[255&b]^e[A++],u=d,d=y,y=p,p=b,b=u;return i}},d=class{constructor(t,n){this.P=t,this.H=n,this.L=n}reset(){this.L=this.H}update(t){return this.R(this.P,t,this.L)}T(t){if(255==(t>>24&255)){let n=t>>16&255,e=t>>8&255,r=255&t;255===n?(n=0,255===e?(e=0,255===r?r=0:++r):++e):++n,t=0,t+=n<<16,t+=e<<8,t+=r}else t+=1<<24;return t}F(t){0===(t[0]=this.T(t[0]))&&(t[1]=this.T(t[1]))}R(t,n,r){let i;if(!(i=n.length))return[];const o=e.l(n);for(let e=0;i>e;e+=4){this.F(r);const i=t.encrypt(r);n[e]^=i[0],n[e+1]^=i[1],n[e+2]^=i[2],n[e+3]^=i[3]}return e.u(n,o)}},y=class{constructor(t){const n=this,e=n.K=i.k,r=[[],[]],o=e.prototype.blockSize/32;n.W=[new e,new e],t.length>o&&(t=e.hash(t));for(let n=0;o>n;n++)r[0][n]=909522486^t[n],r[1][n]=1549556828^t[n];n.W[0].update(r[0]),n.W[1].update(r[1]),n.q=new e(n.W[0])}reset(){const t=this;t.q=new t.K(t.W[0]),t.G=!1}update(t){this.G=!0,this.q.update(t)}digest(){const t=this,n=t.q._(),e=new t.K(t.W[1]).update(n)._();return t.reset(),e}};class p{constructor(t,n,e){Object.assign(this,{password:t,signed:n,J:e-1,N:new Uint8Array(0)})}async append(t){const n=this;if(n.password){const e=U(t,0,a[n.J]+2);await(async(t,n,e)=>{await g(t,e,U(n,0,a[t.J]));const r=U(n,a[t.J]),i=t.keys.passwordVerification;if(i[0]!=r[0]||i[1]!=r[1])throw Error("Invalid pasword")})(n,e,n.password),n.password=null,n.X=new d(new w(n.keys.key),Array.from(u)),n.Y=new y(n.keys.Z),t=U(t,a[n.J]+2)}return A(n,t,new Uint8Array(t.length-10-(t.length-10)%16),0,10,!0)}flush(){const t=this,n=t.N,e=U(n,0,n.length-10),r=U(n,n.length-10);let i=new Uint8Array(0);if(e.length){const n=h.g(e);t.Y.update(n);const r=t.X.update(n);i=h.A(r)}let o=!0;if(t.signed){const n=U(h.A(t.Y.digest()),0,10);for(let t=0;10>t;t++)n[t]!=r[t]&&(o=!1)}return{valid:o,data:i}}}class b{constructor(t,n){Object.assign(this,{password:t,J:n-1,N:new Uint8Array(0)})}async append(t){const n=this;let e=new Uint8Array(0);n.password&&(e=await(async(t,n)=>{const e=crypto.getRandomValues(new Uint8Array(a[t.J]));return await g(t,n,e),k(e,t.keys.passwordVerification)})(n,n.password),n.password=null,n.X=new d(new w(n.keys.key),Array.from(u)),n.Y=new y(n.keys.Z));const r=new Uint8Array(e.length+t.length-t.length%16);return r.set(e,0),A(n,t,r,e.length,0)}flush(){const t=this;let n=new Uint8Array(0);if(t.N.length){const e=t.X.update(h.g(t.N));t.Y.update(e),n=h.A(e)}const e=U(h.A(t.Y.digest()),0,10);return{data:k(n,e),signature:e}}}function A(t,n,e,r,i,o){const s=n.length-i;let f;for(t.N.length&&(n=k(t.N,n),e=((t,n)=>{if(n&&n>t.length){const e=t;(t=new Uint8Array(n)).set(e,0)}return t})(e,s-s%16)),f=0;s-16>=f;f+=16){const i=h.g(U(n,f,f+16));o&&t.Y.update(i);const s=t.X.update(i);o||t.Y.update(s),e.set(h.A(s),f+r)}return t.N=U(n,f),e}async function g(t,n,e){const r=(t=>{if("undefined"==typeof TextEncoder){t=unescape(encodeURIComponent(t));const n=new Uint8Array(t.length);for(let e=0;e<n.length;e++)n[e]=t.charCodeAt(e);return n}return(new TextEncoder).encode(t)})(n),i=await crypto.subtle.importKey("raw",r,s,!1,c),o=await crypto.subtle.deriveBits(Object.assign({salt:e},f),i,8*(2*l[t.J]+2)),a=new Uint8Array(o);t.keys={key:h.g(U(a,0,l[t.J])),Z:h.g(U(a,l[t.J],2*l[t.J])),passwordVerification:U(a,2*l[t.J])}}function k(t,n){let e=t;return t.length+n.length&&(e=new Uint8Array(t.length+n.length),e.set(t,0),e.set(n,t.length)),e}function U(t,n,e){return t.subarray(n,e)}class v{constructor(t,n){Object.assign(this,{password:t,passwordVerification:n}),z(this,t)}append(t){const n=this;if(n.password){const e=M(n,t.subarray(0,12));if(n.password=null,e[11]!=n.passwordVerification)throw Error("Invalid pasword");t=t.subarray(12)}return M(n,t)}flush(){return{valid:!0,data:new Uint8Array(0)}}}class m{constructor(t,n){Object.assign(this,{password:t,passwordVerification:n}),z(this,t)}append(t){const n=this;let e,r;if(n.password){n.password=null;const i=crypto.getRandomValues(new Uint8Array(12));i[11]=n.passwordVerification,e=new Uint8Array(t.length+i.length),e.set(E(n,i),0),r=12}else e=new Uint8Array(t.length),r=0;return e.set(E(n,t),r),e}flush(){return{data:new Uint8Array(0)}}}function M(t,n){const e=new Uint8Array(n.length);for(let r=0;r<n.length;r++)e[r]=S(t)^n[r],I(t,e[r]);return e}function E(t,n){const e=new Uint8Array(n.length);for(let r=0;r<n.length;r++)e[r]=S(t)^n[r],I(t,n[r]);return e}function z(t,e){t.keys=[305419896,591751049,878082192],t.$=new n(t.keys[0]),t.tt=new n(t.keys[2]);for(let n=0;n<e.length;n++)I(t,e.charCodeAt(n))}function I(t,n){t.$.append([n]),t.keys[0]=~t.$.get(),t.keys[1]=j(t.keys[1]+_(t.keys[0])),t.keys[1]=j(Math.imul(t.keys[1],134775813)+1),t.tt.append([t.keys[1]>>>24]),t.keys[2]=~t.tt.get()}function S(t){const n=2|t.keys[2];return _(Math.imul(n,1^n)>>>8)}function _(t){return 255&t}function j(t){return 4294967295&t}class O{constructor(t,{signature:e,password:r,signed:i,compressed:o,zipCrypto:s,passwordVerification:f,encryptionStrength:c},{nt:a}){const l=!!r;Object.assign(this,{signature:e,encrypted:l,signed:i,compressed:o,et:o&&new t({nt:a}),rt:i&&new n,zipCrypto:s,decrypt:l&&s?new v(r,f):new p(r,i,c)})}async append(t){const n=this;return n.encrypted&&t.length&&(t=await n.decrypt.append(t)),n.compressed&&t.length&&(t=await n.et.append(t)),(!n.encrypted||n.zipCrypto)&&n.signed&&t.length&&n.rt.append(t),t}async flush(){const t=this;let n,e=new Uint8Array(0);if(t.encrypted){const n=t.decrypt.flush();if(!n.valid)throw Error("Invalid signature");e=n.data}if((!t.encrypted||t.zipCrypto)&&t.signed){const e=new DataView(new Uint8Array(4).buffer);if(n=t.rt.get(),e.setUint32(0,n),t.signature!=e.getUint32(0,!1))throw Error("Invalid signature")}return t.compressed&&(e=await t.et.append(e)||new Uint8Array(0),await t.et.flush()),{data:e,signature:n}}}class C{constructor(t,{encrypted:e,signed:r,compressed:i,level:o,zipCrypto:s,password:f,passwordVerification:c,encryptionStrength:a},{nt:l}){Object.assign(this,{encrypted:e,signed:r,compressed:i,it:i&&new t({level:o||5,nt:l}),rt:r&&new n,zipCrypto:s,encrypt:e&&s?new m(f,c):new b(f,a)})}async append(t){const n=this;let e=t;return n.compressed&&t.length&&(e=await n.it.append(t)),n.encrypted&&e.length&&(e=await n.encrypt.append(e)),(!n.encrypted||n.zipCrypto)&&n.signed&&t.length&&n.rt.append(t),e}async flush(){const t=this;let n,e=new Uint8Array(0);if(t.compressed&&(e=await t.it.flush()||new Uint8Array(0)),t.encrypted){e=await t.encrypt.append(e);const r=t.encrypt.flush();n=r.signature;const i=new Uint8Array(e.length+r.data.length);i.set(e,0),i.set(r.data,e.length),e=i}return t.encrypted&&!t.zipCrypto||!t.signed||(n=t.rt.get()),{data:e,signature:n}}}const V={init(t){t.scripts&&t.scripts.length&&importScripts.apply(void 0,t.scripts);const n=t.options;let e;self.initCodec&&self.initCodec(),n.codecType.startsWith("deflate")?e=self.Deflate:n.codecType.startsWith("inflate")&&(e=self.Inflate),B=((t,n,e)=>n.codecType.startsWith("deflate")?new C(t,n,e):n.codecType.startsWith("inflate")?new O(t,n,e):void 0)(e,n,t.config)},append:async t=>({data:await B.append(t.data)}),flush:()=>B.flush()};let B;function D(t){return P(t.map((([t,n])=>Array(t).fill(n,0,t))))}function P(t){return t.reduce(((t,n)=>t.concat(Array.isArray(n)?P(n):n)),[])}addEventListener("message",(async t=>{const n=t.data,e=n.type,r=V[e];if(r)try{n.data&&(n.data=new Uint8Array(n.data));const t=await r(n)||{};if(t.type=e,t.data)try{t.data=t.data.buffer,postMessage(t,[t.data])}catch(n){postMessage(t)}else postMessage(t)}catch(t){postMessage({type:e,error:{message:t.message,stack:t.stack}})}}));const x=[0,1,2,3].concat(...D([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function H(){const t=this;function n(t,n){let e=0;do{e|=1&t,t>>>=1,e<<=1}while(--n>0);return e>>>1}t.ot=e=>{const r=t.st,i=t.ct.ft,o=t.ct.at;let s,f,c,a=-1;for(e.lt=0,e.ut=573,s=0;o>s;s++)0!==r[2*s]?(e.ht[++e.lt]=a=s,e.wt[s]=0):r[2*s+1]=0;for(;2>e.lt;)c=e.ht[++e.lt]=2>a?++a:0,r[2*c]=1,e.wt[c]=0,e.dt--,i&&(e.yt-=i[2*c+1]);for(t.bt=a,s=Math.floor(e.lt/2);s>=1;s--)e.At(r,s);c=o;do{s=e.ht[1],e.ht[1]=e.ht[e.lt--],e.At(r,1),f=e.ht[1],e.ht[--e.ut]=s,e.ht[--e.ut]=f,r[2*c]=r[2*s]+r[2*f],e.wt[c]=Math.max(e.wt[s],e.wt[f])+1,r[2*s+1]=r[2*f+1]=c,e.ht[1]=c++,e.At(r,1)}while(e.lt>=2);e.ht[--e.ut]=e.ht[1],(n=>{const e=t.st,r=t.ct.ft,i=t.ct.gt,o=t.ct.kt,s=t.ct.Ut;let f,c,a,l,u,h,w=0;for(l=0;15>=l;l++)n.vt[l]=0;for(e[2*n.ht[n.ut]+1]=0,f=n.ut+1;573>f;f++)c=n.ht[f],l=e[2*e[2*c+1]+1]+1,l>s&&(l=s,w++),e[2*c+1]=l,c>t.bt||(n.vt[l]++,u=0,o>c||(u=i[c-o]),h=e[2*c],n.dt+=h*(l+u),r&&(n.yt+=h*(r[2*c+1]+u)));if(0!==w){do{for(l=s-1;0===n.vt[l];)l--;n.vt[l]--,n.vt[l+1]+=2,n.vt[s]--,w-=2}while(w>0);for(l=s;0!==l;l--)for(c=n.vt[l];0!==c;)a=n.ht[--f],a>t.bt||(e[2*a+1]!=l&&(n.dt+=(l-e[2*a+1])*e[2*a],e[2*a+1]=l),c--)}})(e),((t,e,r)=>{const i=[];let o,s,f,c=0;for(o=1;15>=o;o++)i[o]=c=c+r[o-1]<<1;for(s=0;e>=s;s++)f=t[2*s+1],0!==f&&(t[2*s]=n(i[f]++,f))})(r,t.bt,e.vt)}}function L(t,n,e,r,i){const o=this;o.ft=t,o.gt=n,o.kt=e,o.at=r,o.Ut=i}function R(t,n,e,r,i){const o=this;o.Mt=t,o.Et=n,o.zt=e,o.It=r,o.St=i}H._t=[0,1,2,3,4,5,6,7].concat(...D([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),H.jt=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],H.Ot=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],H.Ct=t=>256>t?x[t]:x[256+(t>>>7)],H.Vt=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],H.Bt=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],H.Dt=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],H.Pt=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],L.xt=[12,8,140,8,76,8,204,8,44,8,172,8,108,8,236,8,28,8,156,8,92,8,220,8,60,8,188,8,124,8,252,8,2,8,130,8,66,8,194,8,34,8,162,8,98,8,226,8,18,8,146,8,82,8,210,8,50,8,178,8,114,8,242,8,10,8,138,8,74,8,202,8,42,8,170,8,106,8,234,8,26,8,154,8,90,8,218,8,58,8,186,8,122,8,250,8,6,8,134,8,70,8,198,8,38,8,166,8,102,8,230,8,22,8,150,8,86,8,214,8,54,8,182,8,118,8,246,8,14,8,142,8,78,8,206,8,46,8,174,8,110,8,238,8,30,8,158,8,94,8,222,8,62,8,190,8,126,8,254,8,1,8,129,8,65,8,193,8,33,8,161,8,97,8,225,8,17,8,145,8,81,8,209,8,49,8,177,8,113,8,241,8,9,8,137,8,73,8,201,8,41,8,169,8,105,8,233,8,25,8,153,8,89,8,217,8,57,8,185,8,121,8,249,8,5,8,133,8,69,8,197,8,37,8,165,8,101,8,229,8,21,8,149,8,85,8,213,8,53,8,181,8,117,8,245,8,13,8,141,8,77,8,205,8,45,8,173,8,109,8,237,8,29,8,157,8,93,8,221,8,61,8,189,8,125,8,253,8,19,9,275,9,147,9,403,9,83,9,339,9,211,9,467,9,51,9,307,9,179,9,435,9,115,9,371,9,243,9,499,9,11,9,267,9,139,9,395,9,75,9,331,9,203,9,459,9,43,9,299,9,171,9,427,9,107,9,363,9,235,9,491,9,27,9,283,9,155,9,411,9,91,9,347,9,219,9,475,9,59,9,315,9,187,9,443,9,123,9,379,9,251,9,507,9,7,9,263,9,135,9,391,9,71,9,327,9,199,9,455,9,39,9,295,9,167,9,423,9,103,9,359,9,231,9,487,9,23,9,279,9,151,9,407,9,87,9,343,9,215,9,471,9,55,9,311,9,183,9,439,9,119,9,375,9,247,9,503,9,15,9,271,9,143,9,399,9,79,9,335,9,207,9,463,9,47,9,303,9,175,9,431,9,111,9,367,9,239,9,495,9,31,9,287,9,159,9,415,9,95,9,351,9,223,9,479,9,63,9,319,9,191,9,447,9,127,9,383,9,255,9,511,9,0,7,64,7,32,7,96,7,16,7,80,7,48,7,112,7,8,7,72,7,40,7,104,7,24,7,88,7,56,7,120,7,4,7,68,7,36,7,100,7,20,7,84,7,52,7,116,7,3,8,131,8,67,8,195,8,35,8,163,8,99,8,227,8],L.Ht=[0,5,16,5,8,5,24,5,4,5,20,5,12,5,28,5,2,5,18,5,10,5,26,5,6,5,22,5,14,5,30,5,1,5,17,5,9,5,25,5,5,5,21,5,13,5,29,5,3,5,19,5,11,5,27,5,7,5,23,5],L.Lt=new L(L.xt,H.Vt,257,286,15),L.Rt=new L(L.Ht,H.Bt,0,30,15),L.Tt=new L(null,H.Dt,0,19,7);const T=[new R(0,0,0,0,0),new R(4,4,8,4,1),new R(4,5,16,8,1),new R(4,6,32,32,1),new R(4,4,16,16,2),new R(8,16,32,32,2),new R(8,16,128,128,2),new R(8,32,128,256,2),new R(32,128,258,1024,2),new R(32,258,258,4096,2)],F=["need dictionary","stream end","","","stream error","data error","","buffer error","",""];function K(t,n,e,r){const i=t[2*n],o=t[2*e];return o>i||i==o&&r[n]<=r[e]}function W(){const t=this;let n,e,r,i,o,s,f,c,a,l,u,h,w,d,y,p,b,A,g,k,U,v,m,M,E,z,I,S,_,j,O,C,V;const B=new H,D=new H,P=new H;let x,R,W,q,G,J;function N(){let n;for(n=0;286>n;n++)O[2*n]=0;for(n=0;30>n;n++)C[2*n]=0;for(n=0;19>n;n++)V[2*n]=0;O[512]=1,t.dt=t.yt=0,R=W=0}function Q(t,n){let e,r=-1,i=t[1],o=0,s=7,f=4;0===i&&(s=138,f=3),t[2*(n+1)+1]=65535;for(let c=0;n>=c;c++)e=i,i=t[2*(c+1)+1],++o<s&&e==i||(f>o?V[2*e]+=o:0!==e?(e!=r&&V[2*e]++,V[32]++):o>10?V[36]++:V[34]++,o=0,r=e,0===i?(s=138,f=3):e==i?(s=6,f=3):(s=7,f=4))}function X(n){t.Ft[t.pending++]=n}function Y(t){X(255&t),X(t>>>8&255)}function Z(t,n){let e;const r=n;J>16-r?(e=t,G|=e<<J&65535,Y(G),G=e>>>16-J,J+=r-16):(G|=t<<J&65535,J+=r)}function $(t,n){const e=2*t;Z(65535&n[e],65535&n[e+1])}function tt(t,n){let e,r,i=-1,o=t[1],s=0,f=7,c=4;for(0===o&&(f=138,c=3),e=0;n>=e;e++)if(r=o,o=t[2*(e+1)+1],++s>=f||r!=o){if(c>s)do{$(r,V)}while(0!=--s);else 0!==r?(r!=i&&($(r,V),s--),$(16,V),Z(s-3,2)):s>10?($(18,V),Z(s-11,7)):($(17,V),Z(s-3,3));s=0,i=r,0===o?(f=138,c=3):r==o?(f=6,c=3):(f=7,c=4)}}function nt(){16==J?(Y(G),G=0,J=0):8>J||(X(255&G),G>>>=8,J-=8)}function et(n,e){let r,i,o;if(t.Kt[R]=n,t.Wt[R]=255&e,R++,0===n?O[2*e]++:(W++,n--,O[2*(H._t[e]+256+1)]++,C[2*H.Ct(n)]++),0==(8191&R)&&I>2){for(r=8*R,i=U-b,o=0;30>o;o++)r+=C[2*o]*(5+H.Bt[o]);if(r>>>=3,Math.floor(R/2)>W&&Math.floor(i/2)>r)return!0}return R==x-1}function rt(n,e){let r,i,o,s,f=0;if(0!==R)do{r=t.Kt[f],i=t.Wt[f],f++,0===r?$(i,n):(o=H._t[i],$(o+256+1,n),s=H.Vt[o],0!==s&&(i-=H.jt[o],Z(i,s)),r--,o=H.Ct(r),$(o,e),s=H.Bt[o],0!==s&&(r-=H.Ot[o],Z(r,s)))}while(R>f);$(256,n),q=n[513]}function it(){J>8?Y(G):J>0&&X(255&G),G=0,J=0}function ot(n,e,r){Z(0+(r?1:0),3),((n,e)=>{it(),q=8,Y(e),Y(~e),t.Ft.set(c.subarray(n,n+e),t.pending),t.pending+=e})(n,e)}function st(e){((n,e,r)=>{let i,o,s=0;I>0?(B.ot(t),D.ot(t),s=(()=>{let n;for(Q(O,B.bt),Q(C,D.bt),P.ot(t),n=18;n>=3&&0===V[2*H.Pt[n]+1];n--);return t.dt+=14+3*(n+1),n})(),i=t.dt+3+7>>>3,o=t.yt+3+7>>>3,o>i||(i=o)):i=o=e+5,e+4>i||-1==n?o==i?(Z(2+(r?1:0),3),rt(L.xt,L.Ht)):(Z(4+(r?1:0),3),((t,n,e)=>{let r;for(Z(t-257,5),Z(n-1,5),Z(e-4,4),r=0;e>r;r++)Z(V[2*H.Pt[r]+1],3);tt(O,t-1),tt(C,n-1)})(B.bt+1,D.bt+1,s+1),rt(O,C)):ot(n,e,r),N(),r&&it()})(0>b?-1:b,U-b,e),b=U,n.qt()}function ft(){let t,e,r,i;do{if(i=a-m-U,0===i&&0===U&&0===m)i=o;else if(-1==i)i--;else if(U>=o+o-262){c.set(c.subarray(o,o+o),0),v-=o,U-=o,b-=o,t=w,r=t;do{e=65535&u[--r],u[r]=o>e?0:e-o}while(0!=--t);t=o,r=t;do{e=65535&l[--r],l[r]=o>e?0:e-o}while(0!=--t);i+=o}if(0===n.Gt)return;t=n.Jt(c,U+m,i),m+=t,3>m||(h=255&c[U],h=(h<<p^255&c[U+1])&y)}while(262>m&&0!==n.Gt)}function ct(t){let n,e,r=E,i=U,s=M;const a=U>o-262?U-(o-262):0;let u=j;const h=f,w=U+258;let d=c[i+s-1],y=c[i+s];_>M||(r>>=2),u>m&&(u=m);do{if(n=t,c[n+s]==y&&c[n+s-1]==d&&c[n]==c[i]&&c[++n]==c[i+1]){i+=2,n++;do{}while(c[++i]==c[++n]&&c[++i]==c[++n]&&c[++i]==c[++n]&&c[++i]==c[++n]&&c[++i]==c[++n]&&c[++i]==c[++n]&&c[++i]==c[++n]&&c[++i]==c[++n]&&w>i);if(e=258-(w-i),i=w-258,e>s){if(v=t,s=e,e>=u)break;d=c[i+s-1],y=c[i+s]}}}while((t=65535&l[t&h])>a&&0!=--r);return s>m?m:s}t.wt=[],t.vt=[],t.ht=[],O=[],C=[],V=[],t.At=(n,e)=>{const r=t.ht,i=r[e];let o=e<<1;for(;o<=t.lt&&(o<t.lt&&K(n,r[o+1],r[o],t.wt)&&o++,!K(n,i,r[o],t.wt));)r[e]=r[o],e=o,o<<=1;r[e]=i},t.Nt=(n,g,v,H,R,F)=>(H||(H=8),R||(R=8),F||(F=0),n.Qt=null,-1==g&&(g=6),1>R||R>9||8!=H||9>v||v>15||0>g||g>9||0>F||F>2?-2:(n.Xt=t,s=v,o=1<<s,f=o-1,d=R+7,w=1<<d,y=w-1,p=Math.floor((d+3-1)/3),c=new Uint8Array(2*o),l=[],u=[],x=1<<R+6,t.Ft=new Uint8Array(4*x),r=4*x,t.Kt=new Uint16Array(x),t.Wt=new Uint8Array(x),I=g,S=F,(n=>(n.Yt=n.Zt=0,n.Qt=null,t.pending=0,t.$t=0,e=113,i=0,B.st=O,B.ct=L.Lt,D.st=C,D.ct=L.Rt,P.st=V,P.ct=L.Tt,G=0,J=0,q=8,N(),(()=>{a=2*o,u[w-1]=0;for(let t=0;w-1>t;t++)u[t]=0;z=T[I].Et,_=T[I].Mt,j=T[I].zt,E=T[I].It,U=0,b=0,m=0,A=M=2,k=0,h=0})(),0))(n))),t.tn=()=>42!=e&&113!=e&&666!=e?-2:(t.Wt=null,t.Kt=null,t.Ft=null,u=null,l=null,c=null,t.Xt=null,113==e?-3:0),t.nn=(t,n,e)=>{let r=0;return-1==n&&(n=6),0>n||n>9||0>e||e>2?-2:(T[I].St!=T[n].St&&0!==t.Yt&&(r=t.it(1)),I!=n&&(I=n,z=T[I].Et,_=T[I].Mt,j=T[I].zt,E=T[I].It),S=e,r)},t.en=(t,n,r)=>{let i,s=r,a=0;if(!n||42!=e)return-2;if(3>s)return 0;for(s>o-262&&(s=o-262,a=r-s),c.set(n.subarray(a,a+s),0),U=s,b=s,h=255&c[0],h=(h<<p^255&c[1])&y,i=0;s-3>=i;i++)h=(h<<p^255&c[i+2])&y,l[i&f]=u[h],u[h]=i;return 0},t.it=(a,d)=>{let E,_,j,O,C;if(d>4||0>d)return-2;if(!a.rn||!a.on&&0!==a.Gt||666==e&&4!=d)return a.Qt=F[4],-2;if(0===a.sn)return a.Qt=F[7],-5;var V;if(n=a,O=i,i=d,42==e&&(_=8+(s-8<<4)<<8,j=(I-1&255)>>1,j>3&&(j=3),_|=j<<6,0!==U&&(_|=32),_+=31-_%31,e=113,X((V=_)>>8&255),X(255&V)),0!==t.pending){if(n.qt(),0===n.sn)return i=-1,0}else if(0===n.Gt&&O>=d&&4!=d)return n.Qt=F[7],-5;if(666==e&&0!==n.Gt)return a.Qt=F[7],-5;if(0!==n.Gt||0!==m||0!=d&&666!=e){switch(C=-1,T[I].St){case 0:C=(t=>{let e,i=65535;for(i>r-5&&(i=r-5);;){if(1>=m){if(ft(),0===m&&0==t)return 0;if(0===m)break}if(U+=m,m=0,e=b+i,(0===U||U>=e)&&(m=U-e,U=e,st(!1),0===n.sn))return 0;if(U-b>=o-262&&(st(!1),0===n.sn))return 0}return st(4==t),0===n.sn?4==t?2:0:4==t?3:1})(d);break;case 1:C=(t=>{let e,r=0;for(;;){if(262>m){if(ft(),262>m&&0==t)return 0;if(0===m)break}if(3>m||(h=(h<<p^255&c[U+2])&y,r=65535&u[h],l[U&f]=u[h],u[h]=U),0===r||(U-r&65535)>o-262||2!=S&&(A=ct(r)),3>A)e=et(0,255&c[U]),m--,U++;else if(e=et(U-v,A-3),m-=A,A>z||3>m)U+=A,A=0,h=255&c[U],h=(h<<p^255&c[U+1])&y;else{A--;do{U++,h=(h<<p^255&c[U+2])&y,r=65535&u[h],l[U&f]=u[h],u[h]=U}while(0!=--A);U++}if(e&&(st(!1),0===n.sn))return 0}return st(4==t),0===n.sn?4==t?2:0:4==t?3:1})(d);break;case 2:C=(t=>{let e,r,i=0;for(;;){if(262>m){if(ft(),262>m&&0==t)return 0;if(0===m)break}if(3>m||(h=(h<<p^255&c[U+2])&y,i=65535&u[h],l[U&f]=u[h],u[h]=U),M=A,g=v,A=2,0!==i&&z>M&&o-262>=(U-i&65535)&&(2!=S&&(A=ct(i)),5>=A&&(1==S||3==A&&U-v>4096)&&(A=2)),3>M||A>M)if(0!==k){if(e=et(0,255&c[U-1]),e&&st(!1),U++,m--,0===n.sn)return 0}else k=1,U++,m--;else{r=U+m-3,e=et(U-1-g,M-3),m-=M-1,M-=2;do{++U>r||(h=(h<<p^255&c[U+2])&y,i=65535&u[h],l[U&f]=u[h],u[h]=U)}while(0!=--M);if(k=0,A=2,U++,e&&(st(!1),0===n.sn))return 0}}return 0!==k&&(e=et(0,255&c[U-1]),k=0),st(4==t),0===n.sn?4==t?2:0:4==t?3:1})(d)}if(2!=C&&3!=C||(e=666),0==C||2==C)return 0===n.sn&&(i=-1),0;if(1==C){if(1==d)Z(2,3),$(256,L.xt),nt(),9>1+q+10-J&&(Z(2,3),$(256,L.xt),nt()),q=7;else if(ot(0,0,!1),3==d)for(E=0;w>E;E++)u[E]=0;if(n.qt(),0===n.sn)return i=-1,0}}return 4!=d?0:1}}function q(){const t=this;t.fn=0,t.cn=0,t.Gt=0,t.Yt=0,t.sn=0,t.Zt=0}function G(t){const n=new q,e=(r=t&&t.nt?t.nt:65536)+5*(Math.floor(r/16383)+1);var r;const i=new Uint8Array(e);let o=t?t.level:-1;void 0===o&&(o=-1),n.Nt(o),n.rn=i,this.append=(t,r)=>{let o,s,f=0,c=0,a=0;const l=[];if(t.length){n.fn=0,n.on=t,n.Gt=t.length;do{if(n.cn=0,n.sn=e,o=n.it(0),0!=o)throw Error("deflating: "+n.Qt);n.cn&&(n.cn==e?l.push(new Uint8Array(i)):l.push(i.slice(0,n.cn))),a+=n.cn,r&&n.fn>0&&n.fn!=f&&(r(n.fn),f=n.fn)}while(n.Gt>0||0===n.sn);return l.length>1?(s=new Uint8Array(a),l.forEach((t=>{s.set(t,c),c+=t.length}))):s=l[0]||new Uint8Array(0),s}},this.flush=()=>{let t,r,o=0,s=0;const f=[];do{if(n.cn=0,n.sn=e,t=n.it(4),1!=t&&0!=t)throw Error("deflating: "+n.Qt);e-n.sn>0&&f.push(i.slice(0,n.cn)),s+=n.cn}while(n.Gt>0||0===n.sn);return n.tn(),r=new Uint8Array(s),f.forEach((t=>{r.set(t,o),o+=t.length})),r}}q.prototype={Nt:function(t,n){const e=this;return e.Xt=new W,n||(n=15),e.Xt.Nt(e,t,n)},it:function(t){const n=this;return n.Xt?n.Xt.it(n,t):-2},tn:function(){const t=this;if(!t.Xt)return-2;const n=t.Xt.tn();return t.Xt=null,n},nn:function(t,n){const e=this;return e.Xt?e.Xt.nn(e,t,n):-2},en:function(t,n){const e=this;return e.Xt?e.Xt.en(e,t,n):-2},Jt:function(t,n,e){const r=this;let i=r.Gt;return i>e&&(i=e),0===i?0:(r.Gt-=i,t.set(r.on.subarray(r.fn,r.fn+i),n),r.fn+=i,r.Yt+=i,i)},qt:function(){const t=this;let n=t.Xt.pending;n>t.sn&&(n=t.sn),0!==n&&(t.rn.set(t.Xt.Ft.subarray(t.Xt.$t,t.Xt.$t+n),t.cn),t.cn+=n,t.Xt.$t+=n,t.Zt+=n,t.sn-=n,t.Xt.pending-=n,0===t.Xt.pending&&(t.Xt.$t=0))}};const J=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],N=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],Q=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],X=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],Y=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],Z=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],$=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function tt(){let t,n,e,r,i,o;function s(t,n,s,f,c,a,l,u,h,w,d){let y,p,b,A,g,k,U,v,m,M,E,z,I,S,_;M=0,g=s;do{e[t[n+M]]++,M++,g--}while(0!==g);if(e[0]==s)return l[0]=-1,u[0]=0,0;for(v=u[0],k=1;15>=k&&0===e[k];k++);for(U=k,k>v&&(v=k),g=15;0!==g&&0===e[g];g--);for(b=g,v>g&&(v=g),u[0]=v,S=1<<k;g>k;k++,S<<=1)if(0>(S-=e[k]))return-3;if(0>(S-=e[g]))return-3;for(e[g]+=S,o[1]=k=0,M=1,I=2;0!=--g;)o[I]=k+=e[M],I++,M++;g=0,M=0;do{0!==(k=t[n+M])&&(d[o[k]++]=g),M++}while(++g<s);for(s=o[b],o[0]=g=0,M=0,A=-1,z=-v,i[0]=0,E=0,_=0;b>=U;U++)for(y=e[U];0!=y--;){for(;U>z+v;){if(A++,z+=v,_=b-z,_=_>v?v:_,(p=1<<(k=U-z))>y+1&&(p-=y+1,I=U,_>k))for(;++k<_&&(p<<=1)>e[++I];)p-=e[I];if(_=1<<k,w[0]+_>1440)return-3;i[A]=E=w[0],w[0]+=_,0!==A?(o[A]=g,r[0]=k,r[1]=v,k=g>>>z-v,r[2]=E-i[A-1]-k,h.set(r,3*(i[A-1]+k))):l[0]=E}for(r[1]=U-z,s>M?d[M]<f?(r[0]=256>d[M]?0:96,r[2]=d[M++]):(r[0]=a[d[M]-f]+16+64,r[2]=c[d[M++]-f]):r[0]=192,p=1<<U-z,k=g>>>z;_>k;k+=p)h.set(r,3*(E+k));for(k=1<<U-1;0!=(g&k);k>>>=1)g^=k;for(g^=k,m=(1<<z)-1;(g&m)!=o[A];)A--,z-=v,m=(1<<z)-1}return 0!==S&&1!=b?-5:0}function f(s){let f;for(t||(t=[],n=[],e=new Int32Array(16),r=[],i=new Int32Array(15),o=new Int32Array(16)),n.length<s&&(n=[]),f=0;s>f;f++)n[f]=0;for(f=0;16>f;f++)e[f]=0;for(f=0;3>f;f++)r[f]=0;i.set(e.subarray(0,15),0),o.set(e.subarray(0,16),0)}this.an=(e,r,i,o,c)=>{let a;return f(19),t[0]=0,a=s(e,0,19,19,null,null,i,r,o,t,n),-3==a?c.Qt="oversubscribed dynamic bit lengths tree":-5!=a&&0!==r[0]||(c.Qt="incomplete dynamic bit lengths tree",a=-3),a},this.ln=(e,r,i,o,c,a,l,u,h)=>{let w;return f(288),t[0]=0,w=s(i,0,e,257,X,Y,a,o,u,t,n),0!=w||0===o[0]?(-3==w?h.Qt="oversubscribed literal/length tree":-4!=w&&(h.Qt="incomplete literal/length tree",w=-3),w):(f(288),w=s(i,e,r,0,Z,$,l,c,u,t,n),0!=w||0===c[0]&&e>257?(-3==w?h.Qt="oversubscribed distance tree":-5==w?(h.Qt="incomplete distance tree",w=-3):-4!=w&&(h.Qt="empty distance tree with lengths",w=-3),w):0)}}function nt(){const t=this;let n,e,r,i,o=0,s=0,f=0,c=0,a=0,l=0,u=0,h=0,w=0,d=0;function y(t,n,e,r,i,o,s,f){let c,a,l,u,h,w,d,y,p,b,A,g,k,U,v,m;d=f.fn,y=f.Gt,h=s.un,w=s.hn,p=s.write,b=p<s.read?s.read-p-1:s.end-p,A=J[t],g=J[n];do{for(;20>w;)y--,h|=(255&f.wn(d++))<<w,w+=8;if(c=h&A,a=e,l=r,m=3*(l+c),0!==(u=a[m]))for(;;){if(h>>=a[m+1],w-=a[m+1],0!=(16&u)){for(u&=15,k=a[m+2]+(h&J[u]),h>>=u,w-=u;15>w;)y--,h|=(255&f.wn(d++))<<w,w+=8;for(c=h&g,a=i,l=o,m=3*(l+c),u=a[m];;){if(h>>=a[m+1],w-=a[m+1],0!=(16&u)){for(u&=15;u>w;)y--,h|=(255&f.wn(d++))<<w,w+=8;if(U=a[m+2]+(h&J[u]),h>>=u,w-=u,b-=k,U>p){v=p-U;do{v+=s.end}while(0>v);if(u=s.end-v,k>u){if(k-=u,p-v>0&&u>p-v)do{s.window[p++]=s.window[v++]}while(0!=--u);else s.window.set(s.window.subarray(v,v+u),p),p+=u,v+=u,u=0;v=0}}else v=p-U,p-v>0&&2>p-v?(s.window[p++]=s.window[v++],s.window[p++]=s.window[v++],k-=2):(s.window.set(s.window.subarray(v,v+2),p),p+=2,v+=2,k-=2);if(p-v>0&&k>p-v)do{s.window[p++]=s.window[v++]}while(0!=--k);else s.window.set(s.window.subarray(v,v+k),p),p+=k,v+=k,k=0;break}if(0!=(64&u))return f.Qt="invalid distance code",k=f.Gt-y,k=k>w>>3?w>>3:k,y+=k,d-=k,w-=k<<3,s.un=h,s.hn=w,f.Gt=y,f.Yt+=d-f.fn,f.fn=d,s.write=p,-3;c+=a[m+2],c+=h&J[u],m=3*(l+c),u=a[m]}break}if(0!=(64&u))return 0!=(32&u)?(k=f.Gt-y,k=k>w>>3?w>>3:k,y+=k,d-=k,w-=k<<3,s.un=h,s.hn=w,f.Gt=y,f.Yt+=d-f.fn,f.fn=d,s.write=p,1):(f.Qt="invalid literal/length code",k=f.Gt-y,k=k>w>>3?w>>3:k,y+=k,d-=k,w-=k<<3,s.un=h,s.hn=w,f.Gt=y,f.Yt+=d-f.fn,f.fn=d,s.write=p,-3);if(c+=a[m+2],c+=h&J[u],m=3*(l+c),0===(u=a[m])){h>>=a[m+1],w-=a[m+1],s.window[p++]=a[m+2],b--;break}}else h>>=a[m+1],w-=a[m+1],s.window[p++]=a[m+2],b--}while(b>=258&&y>=10);return k=f.Gt-y,k=k>w>>3?w>>3:k,y+=k,d-=k,w-=k<<3,s.un=h,s.hn=w,f.Gt=y,f.Yt+=d-f.fn,f.fn=d,s.write=p,0}t.init=(t,o,s,f,c,a)=>{n=0,u=t,h=o,r=s,w=f,i=c,d=a,e=null},t.dn=(t,p,b)=>{let A,g,k,U,v,m,M,E=0,z=0,I=0;for(I=p.fn,U=p.Gt,E=t.un,z=t.hn,v=t.write,m=v<t.read?t.read-v-1:t.end-v;;)switch(n){case 0:if(m>=258&&U>=10&&(t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,b=y(u,h,r,w,i,d,t,p),I=p.fn,U=p.Gt,E=t.un,z=t.hn,v=t.write,m=v<t.read?t.read-v-1:t.end-v,0!=b)){n=1==b?7:9;break}f=u,e=r,s=w,n=1;case 1:for(A=f;A>z;){if(0===U)return t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);b=0,U--,E|=(255&p.wn(I++))<<z,z+=8}if(g=3*(s+(E&J[A])),E>>>=e[g+1],z-=e[g+1],k=e[g],0===k){c=e[g+2],n=6;break}if(0!=(16&k)){a=15&k,o=e[g+2],n=2;break}if(0==(64&k)){f=k,s=g/3+e[g+2];break}if(0!=(32&k)){n=7;break}return n=9,p.Qt="invalid literal/length code",b=-3,t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);case 2:for(A=a;A>z;){if(0===U)return t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);b=0,U--,E|=(255&p.wn(I++))<<z,z+=8}o+=E&J[A],E>>=A,z-=A,f=h,e=i,s=d,n=3;case 3:for(A=f;A>z;){if(0===U)return t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);b=0,U--,E|=(255&p.wn(I++))<<z,z+=8}if(g=3*(s+(E&J[A])),E>>=e[g+1],z-=e[g+1],k=e[g],0!=(16&k)){a=15&k,l=e[g+2],n=4;break}if(0==(64&k)){f=k,s=g/3+e[g+2];break}return n=9,p.Qt="invalid distance code",b=-3,t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);case 4:for(A=a;A>z;){if(0===U)return t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);b=0,U--,E|=(255&p.wn(I++))<<z,z+=8}l+=E&J[A],E>>=A,z-=A,n=5;case 5:for(M=v-l;0>M;)M+=t.end;for(;0!==o;){if(0===m&&(v==t.end&&0!==t.read&&(v=0,m=v<t.read?t.read-v-1:t.end-v),0===m&&(t.write=v,b=t.yn(p,b),v=t.write,m=v<t.read?t.read-v-1:t.end-v,v==t.end&&0!==t.read&&(v=0,m=v<t.read?t.read-v-1:t.end-v),0===m)))return t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);t.window[v++]=t.window[M++],m--,M==t.end&&(M=0),o--}n=0;break;case 6:if(0===m&&(v==t.end&&0!==t.read&&(v=0,m=v<t.read?t.read-v-1:t.end-v),0===m&&(t.write=v,b=t.yn(p,b),v=t.write,m=v<t.read?t.read-v-1:t.end-v,v==t.end&&0!==t.read&&(v=0,m=v<t.read?t.read-v-1:t.end-v),0===m)))return t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);b=0,t.window[v++]=c,m--,n=0;break;case 7:if(z>7&&(z-=8,U++,I--),t.write=v,b=t.yn(p,b),v=t.write,m=v<t.read?t.read-v-1:t.end-v,t.read!=t.write)return t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);n=8;case 8:return b=1,t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);case 9:return b=-3,t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b);default:return b=-2,t.un=E,t.hn=z,p.Gt=U,p.Yt+=I-p.fn,p.fn=I,t.write=v,t.yn(p,b)}},t.pn=()=>{}}tt.bn=(t,n,e,r)=>(t[0]=9,n[0]=5,e[0]=N,r[0]=Q,0);const et=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function rt(t,n){const e=this;let r,i=0,o=0,s=0,f=0;const c=[0],a=[0],l=new nt;let u=0,h=new Int32Array(4320);const w=new tt;e.hn=0,e.un=0,e.window=new Uint8Array(n),e.end=n,e.read=0,e.write=0,e.reset=(t,n)=>{n&&(n[0]=0),6==i&&l.pn(t),i=0,e.hn=0,e.un=0,e.read=e.write=0},e.reset(t,null),e.yn=(t,n)=>{let r,i,o;return i=t.cn,o=e.read,r=(o>e.write?e.end:e.write)-o,r>t.sn&&(r=t.sn),0!==r&&-5==n&&(n=0),t.sn-=r,t.Zt+=r,t.rn.set(e.window.subarray(o,o+r),i),i+=r,o+=r,o==e.end&&(o=0,e.write==e.end&&(e.write=0),r=e.write-o,r>t.sn&&(r=t.sn),0!==r&&-5==n&&(n=0),t.sn-=r,t.Zt+=r,t.rn.set(e.window.subarray(o,o+r),i),i+=r,o+=r),t.cn=i,e.read=o,n},e.dn=(t,n)=>{let d,y,p,b,A,g,k,U;for(b=t.fn,A=t.Gt,y=e.un,p=e.hn,g=e.write,k=g<e.read?e.read-g-1:e.end-g;;){let v,m,M,E,z,I,S,_;switch(i){case 0:for(;3>p;){if(0===A)return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);n=0,A--,y|=(255&t.wn(b++))<<p,p+=8}switch(d=7&y,u=1&d,d>>>1){case 0:y>>>=3,p-=3,d=7&p,y>>>=d,p-=d,i=1;break;case 1:v=[],m=[],M=[[]],E=[[]],tt.bn(v,m,M,E),l.init(v[0],m[0],M[0],0,E[0],0),y>>>=3,p-=3,i=6;break;case 2:y>>>=3,p-=3,i=3;break;case 3:return y>>>=3,p-=3,i=9,t.Qt="invalid block type",n=-3,e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n)}break;case 1:for(;32>p;){if(0===A)return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);n=0,A--,y|=(255&t.wn(b++))<<p,p+=8}if((~y>>>16&65535)!=(65535&y))return i=9,t.Qt="invalid stored block lengths",n=-3,e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);o=65535&y,y=p=0,i=0!==o?2:0!==u?7:0;break;case 2:if(0===A)return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);if(0===k&&(g==e.end&&0!==e.read&&(g=0,k=g<e.read?e.read-g-1:e.end-g),0===k&&(e.write=g,n=e.yn(t,n),g=e.write,k=g<e.read?e.read-g-1:e.end-g,g==e.end&&0!==e.read&&(g=0,k=g<e.read?e.read-g-1:e.end-g),0===k)))return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);if(n=0,d=o,d>A&&(d=A),d>k&&(d=k),e.window.set(t.Jt(b,d),g),b+=d,A-=d,g+=d,k-=d,0!=(o-=d))break;i=0!==u?7:0;break;case 3:for(;14>p;){if(0===A)return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);n=0,A--,y|=(255&t.wn(b++))<<p,p+=8}if(s=d=16383&y,(31&d)>29||(d>>5&31)>29)return i=9,t.Qt="too many length or distance symbols",n=-3,e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);if(d=258+(31&d)+(d>>5&31),!r||r.length<d)r=[];else for(U=0;d>U;U++)r[U]=0;y>>>=14,p-=14,f=0,i=4;case 4:for(;4+(s>>>10)>f;){for(;3>p;){if(0===A)return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);n=0,A--,y|=(255&t.wn(b++))<<p,p+=8}r[et[f++]]=7&y,y>>>=3,p-=3}for(;19>f;)r[et[f++]]=0;if(c[0]=7,d=w.an(r,c,a,h,t),0!=d)return-3==(n=d)&&(r=null,i=9),e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);f=0,i=5;case 5:for(;d=s,258+(31&d)+(d>>5&31)>f;){let o,l;for(d=c[0];d>p;){if(0===A)return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);n=0,A--,y|=(255&t.wn(b++))<<p,p+=8}if(d=h[3*(a[0]+(y&J[d]))+1],l=h[3*(a[0]+(y&J[d]))+2],16>l)y>>>=d,p-=d,r[f++]=l;else{for(U=18==l?7:l-14,o=18==l?11:3;d+U>p;){if(0===A)return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);n=0,A--,y|=(255&t.wn(b++))<<p,p+=8}if(y>>>=d,p-=d,o+=y&J[U],y>>>=U,p-=U,U=f,d=s,U+o>258+(31&d)+(d>>5&31)||16==l&&1>U)return r=null,i=9,t.Qt="invalid bit length repeat",n=-3,e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);l=16==l?r[U-1]:0;do{r[U++]=l}while(0!=--o);f=U}}if(a[0]=-1,z=[],I=[],S=[],_=[],z[0]=9,I[0]=6,d=s,d=w.ln(257+(31&d),1+(d>>5&31),r,z,I,S,_,h,t),0!=d)return-3==d&&(r=null,i=9),n=d,e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);l.init(z[0],I[0],h,S[0],h,_[0]),i=6;case 6:if(e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,1!=(n=l.dn(e,t,n)))return e.yn(t,n);if(n=0,l.pn(t),b=t.fn,A=t.Gt,y=e.un,p=e.hn,g=e.write,k=g<e.read?e.read-g-1:e.end-g,0===u){i=0;break}i=7;case 7:if(e.write=g,n=e.yn(t,n),g=e.write,k=g<e.read?e.read-g-1:e.end-g,e.read!=e.write)return e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);i=8;case 8:return n=1,e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);case 9:return n=-3,e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n);default:return n=-2,e.un=y,e.hn=p,t.Gt=A,t.Yt+=b-t.fn,t.fn=b,e.write=g,e.yn(t,n)}}},e.pn=t=>{e.reset(t,null),e.window=null,h=null},e.An=(t,n,r)=>{e.window.set(t.subarray(n,n+r),0),e.read=e.write=r},e.gn=()=>1==i?1:0}const it=[0,0,255,255];function ot(){const t=this;function n(t){return t&&t.kn?(t.Yt=t.Zt=0,t.Qt=null,t.kn.mode=7,t.kn.Un.reset(t,null),0):-2}t.mode=0,t.method=0,t.vn=[0],t.mn=0,t.marker=0,t.Mn=0,t.En=n=>(t.Un&&t.Un.pn(n),t.Un=null,0),t.zn=(e,r)=>(e.Qt=null,t.Un=null,8>r||r>15?(t.En(e),-2):(t.Mn=r,e.kn.Un=new rt(e,1<<r),n(e),0)),t.et=(t,n)=>{let e,r;if(!t||!t.kn||!t.on)return-2;const i=t.kn;for(n=4==n?-5:0,e=-5;;)switch(i.mode){case 0:if(0===t.Gt)return e;if(e=n,t.Gt--,t.Yt++,8!=(15&(i.method=t.wn(t.fn++)))){i.mode=13,t.Qt="unknown compression method",i.marker=5;break}if(8+(i.method>>4)>i.Mn){i.mode=13,t.Qt="invalid window size",i.marker=5;break}i.mode=1;case 1:if(0===t.Gt)return e;if(e=n,t.Gt--,t.Yt++,r=255&t.wn(t.fn++),((i.method<<8)+r)%31!=0){i.mode=13,t.Qt="incorrect header check",i.marker=5;break}if(0==(32&r)){i.mode=7;break}i.mode=2;case 2:if(0===t.Gt)return e;e=n,t.Gt--,t.Yt++,i.mn=(255&t.wn(t.fn++))<<24&4278190080,i.mode=3;case 3:if(0===t.Gt)return e;e=n,t.Gt--,t.Yt++,i.mn+=(255&t.wn(t.fn++))<<16&16711680,i.mode=4;case 4:if(0===t.Gt)return e;e=n,t.Gt--,t.Yt++,i.mn+=(255&t.wn(t.fn++))<<8&65280,i.mode=5;case 5:return 0===t.Gt?e:(e=n,t.Gt--,t.Yt++,i.mn+=255&t.wn(t.fn++),i.mode=6,2);case 6:return i.mode=13,t.Qt="need dictionary",i.marker=0,-2;case 7:if(e=i.Un.dn(t,e),-3==e){i.mode=13,i.marker=0;break}if(0==e&&(e=n),1!=e)return e;e=n,i.Un.reset(t,i.vn),i.mode=12;case 12:return 1;case 13:return-3;default:return-2}},t.In=(t,n,e)=>{let r=0,i=e;if(!t||!t.kn||6!=t.kn.mode)return-2;const o=t.kn;return i<1<<o.Mn||(i=(1<<o.Mn)-1,r=e-i),o.Un.An(n,r,i),o.mode=7,0},t.Sn=t=>{let e,r,i,o,s;if(!t||!t.kn)return-2;const f=t.kn;if(13!=f.mode&&(f.mode=13,f.marker=0),0===(e=t.Gt))return-5;for(r=t.fn,i=f.marker;0!==e&&4>i;)t.wn(r)==it[i]?i++:i=0!==t.wn(r)?0:4-i,r++,e--;return t.Yt+=r-t.fn,t.fn=r,t.Gt=e,f.marker=i,4!=i?-3:(o=t.Yt,s=t.Zt,n(t),t.Yt=o,t.Zt=s,f.mode=7,0)},t._n=t=>t&&t.kn&&t.kn.Un?t.kn.Un.gn():-2}function st(){}function ft(t){const n=new st,e=t&&t.nt?Math.floor(2*t.nt):131072,r=new Uint8Array(e);let i=!1;n.zn(),n.rn=r,this.append=(t,o)=>{const s=[];let f,c,a=0,l=0,u=0;if(0!==t.length){n.fn=0,n.on=t,n.Gt=t.length;do{if(n.cn=0,n.sn=e,0!==n.Gt||i||(n.fn=0,i=!0),f=n.et(0),i&&-5===f){if(0!==n.Gt)throw Error("inflating: bad input")}else if(0!==f&&1!==f)throw Error("inflating: "+n.Qt);if((i||1===f)&&n.Gt===t.length)throw Error("inflating: bad input");n.cn&&(n.cn===e?s.push(new Uint8Array(r)):s.push(r.slice(0,n.cn))),u+=n.cn,o&&n.fn>0&&n.fn!=a&&(o(n.fn),a=n.fn)}while(n.Gt>0||0===n.sn);return s.length>1?(c=new Uint8Array(u),s.forEach((t=>{c.set(t,l),l+=t.length}))):c=s[0]||new Uint8Array(0),c}},this.flush=()=>{n.En()}}st.prototype={zn:function(t){const n=this;return n.kn=new ot,t||(t=15),n.kn.zn(n,t)},et:function(t){const n=this;return n.kn?n.kn.et(n,t):-2},En:function(){const t=this;if(!t.kn)return-2;const n=t.kn.En(t);return t.kn=null,n},Sn:function(){const t=this;return t.kn?t.kn.Sn(t):-2},In:function(t,n){const e=this;return e.kn?e.kn.In(e,t,n):-2},wn:function(t){return this.on[t]},Jt:function(t,n){return this.on.subarray(t,t+n)}},self.initCodec=()=>{self.Deflate=G,self.Inflate=ft};\n'],{type:"text/javascript"}));t({workerScripts:{inflate:[n],deflate:[n]}});}};

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
				codecAdapter.codec = new constructor(Object.assign({}, constructorOptions, options));
				registerDataHandler(codecAdapter.codec, onData);
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

	// Derived from https://github.com/xqdoo00o/jszip/blob/master/lib/sjcl.js
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


	const misc = {};

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
	const codecBytes = codec.bytes;
	const Aes = cipher.aes;
	const CtrGladman = mode.ctrGladman;
	const HmacSha1 = misc.hmacSha1;
	class AESDecrypt {

		constructor(password, signed, strength) {
			Object.assign(this, {
				password,
				signed,
				strength: strength - 1,
				pendingInput: new Uint8Array(0)
			});
		}

		async append(input) {
			const aesCrypto = this;
			if (aesCrypto.password) {
				const preamble = subarray(input, 0, SALT_LENGTH[aesCrypto.strength] + 2);
				await createDecryptionKeys(aesCrypto, preamble, aesCrypto.password);
				aesCrypto.password = null;
				aesCrypto.aesCtrGladman = new CtrGladman(new Aes(aesCrypto.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
				aesCrypto.hmac = new HmacSha1(aesCrypto.keys.authentication);
				input = subarray(input, SALT_LENGTH[aesCrypto.strength] + 2);
			}
			const output = new Uint8Array(input.length - SIGNATURE_LENGTH - ((input.length - SIGNATURE_LENGTH) % BLOCK_LENGTH));
			return append(aesCrypto, input, output, 0, SIGNATURE_LENGTH, true);
		}

		flush() {
			const aesCrypto = this;
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
			let valid = true;
			if (aesCrypto.signed) {
				const signature = subarray(codecBytes.fromBits(aesCrypto.hmac.digest()), 0, SIGNATURE_LENGTH);
				for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
					if (signature[indexSignature] != originalSignature[indexSignature]) {
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

	class AESEncrypt {

		constructor(password, strength) {
			Object.assign(this, {
				password,
				strength: strength - 1,
				pendingInput: new Uint8Array(0)
			});
		}

		async append(input) {
			const aesCrypto = this;
			let preamble = new Uint8Array(0);
			if (aesCrypto.password) {
				preamble = await createEncryptionKeys(aesCrypto, aesCrypto.password);
				aesCrypto.password = null;
				aesCrypto.aesCtrGladman = new CtrGladman(new Aes(aesCrypto.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
				aesCrypto.hmac = new HmacSha1(aesCrypto.keys.authentication);
			}
			const output = new Uint8Array(preamble.length + input.length - (input.length % BLOCK_LENGTH));
			output.set(preamble, 0);
			return append(aesCrypto, input, output, preamble.length, 0);
		}

		flush() {
			const aesCrypto = this;
			let encryptedChunkArray = new Uint8Array(0);
			if (aesCrypto.pendingInput.length) {
				const encryptedChunk = aesCrypto.aesCtrGladman.update(codecBytes.toBits(aesCrypto.pendingInput));
				aesCrypto.hmac.update(encryptedChunk);
				encryptedChunkArray = codecBytes.fromBits(encryptedChunk);
			}
			const signature = subarray(codecBytes.fromBits(aesCrypto.hmac.digest()), 0, SIGNATURE_LENGTH);
			return {
				data: concat(encryptedChunkArray, signature),
				signature
			};
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
		const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH[encrypt.strength]));
		await createKeys$1(encrypt, password, salt);
		return concat(salt, encrypt.keys.passwordVerification);
	}

	async function createKeys$1(target, password, salt) {
		const encodedPassword = encodeText(password);
		const basekey = await crypto.subtle.importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await crypto.subtle.deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), basekey, 8 * ((KEY_LENGTH[target.strength] * 2) + 2));
		const compositeKey = new Uint8Array(derivedBits);
		target.keys = {
			key: codecBytes.toBits(subarray(compositeKey, 0, KEY_LENGTH[target.strength])),
			authentication: codecBytes.toBits(subarray(compositeKey, KEY_LENGTH[target.strength], KEY_LENGTH[target.strength] * 2)),
			passwordVerification: subarray(compositeKey, KEY_LENGTH[target.strength] * 2)
		};
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

	class ZipCryptoDecrypt {

		constructor(password, passwordVerification) {
			const zipCrypto = this;
			Object.assign(zipCrypto, {
				password,
				passwordVerification
			});
			createKeys(zipCrypto, password);
		}

		append(input) {
			const zipCrypto = this;
			if (zipCrypto.password) {
				const decryptedHeader = decrypt(zipCrypto, input.subarray(0, HEADER_LENGTH));
				zipCrypto.password = null;
				if (decryptedHeader[HEADER_LENGTH - 1] != zipCrypto.passwordVerification) {
					throw new Error(ERR_INVALID_PASSWORD);
				}
				input = input.subarray(HEADER_LENGTH);
			}
			return decrypt(zipCrypto, input);
		}

		flush() {
			return {
				valid: true,
				data: new Uint8Array(0)
			};
		}
	}

	class ZipCryptoEncrypt {

		constructor(password, passwordVerification) {
			const zipCrypto = this;
			Object.assign(zipCrypto, {
				password,
				passwordVerification
			});
			createKeys(zipCrypto, password);
		}

		append(input) {
			const zipCrypto = this;
			let output;
			let offset;
			if (zipCrypto.password) {
				zipCrypto.password = null;
				const header = crypto.getRandomValues(new Uint8Array(HEADER_LENGTH));
				header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
				output = new Uint8Array(input.length + header.length);
				output.set(encrypt(zipCrypto, header), 0);
				offset = HEADER_LENGTH;
			} else {
				output = new Uint8Array(input.length);
				offset = 0;
			}
			output.set(encrypt(zipCrypto, input), offset);
			return output;
		}

		flush() {
			return {
				data: new Uint8Array(0)
			};
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
			encryptionStrength
		}, { chunkSize }) {
			const encrypted = Boolean(password);
			Object.assign(this, {
				signature,
				encrypted,
				signed,
				compressed,
				inflate: compressed && new codecConstructor({ chunkSize }),
				crc32: signed && new Crc32(),
				zipCrypto,
				decrypt: encrypted && zipCrypto ?
					new ZipCryptoDecrypt(password, passwordVerification) :
					new AESDecrypt(password, signed, encryptionStrength)
			});
		}

		async append(data) {
			const codec = this;
			if (codec.encrypted && data.length) {
				data = await codec.decrypt.append(data);
			}
			if (codec.compressed && data.length) {
				data = await codec.inflate.append(data);
			}
			if ((!codec.encrypted || codec.zipCrypto) && codec.signed && data.length) {
				codec.crc32.append(data);
			}
			return data;
		}

		async flush() {
			const codec = this;
			let signature;
			let data = new Uint8Array(0);
			if (codec.encrypted) {
				const result = codec.decrypt.flush();
				if (!result.valid) {
					throw new Error(ERR_INVALID_SIGNATURE);
				}
				data = result.data;
			}
			if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
				const dataViewSignature = new DataView(new Uint8Array(4).buffer);
				signature = codec.crc32.get();
				dataViewSignature.setUint32(0, signature);
				if (codec.signature != dataViewSignature.getUint32(0, false)) {
					throw new Error(ERR_INVALID_SIGNATURE);
				}
			}
			if (codec.compressed) {
				data = (await codec.inflate.append(data)) || new Uint8Array(0);
				await codec.inflate.flush();
			}
			return { data, signature };
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
			encryptionStrength
		}, { chunkSize }) {
			Object.assign(this, {
				encrypted,
				signed,
				compressed,
				deflate: compressed && new codecConstructor({ level: level || 5, chunkSize }),
				crc32: signed && new Crc32(),
				zipCrypto,
				encrypt: encrypted && zipCrypto ?
					new ZipCryptoEncrypt(password, passwordVerification) :
					new AESEncrypt(password, encryptionStrength)
			});
		}

		async append(inputData) {
			const codec = this;
			let data = inputData;
			if (codec.compressed && inputData.length) {
				data = await codec.deflate.append(inputData);
			}
			if (codec.encrypted && data.length) {
				data = await codec.encrypt.append(data);
			}
			if ((!codec.encrypted || codec.zipCrypto) && codec.signed && inputData.length) {
				codec.crc32.append(inputData);
			}
			return data;
		}

		async flush() {
			const codec = this;
			let signature;
			let data = new Uint8Array(0);
			if (codec.compressed) {
				data = (await codec.deflate.flush()) || new Uint8Array(0);
			}
			if (codec.encrypted) {
				data = await codec.encrypt.append(data);
				const result = codec.encrypt.flush();
				signature = result.signature;
				const newData = new Uint8Array(data.length + result.data.length);
				newData.set(data, 0);
				newData.set(result.data, data.length);
				data = newData;
			}
			if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
				signature = codec.crc32.get();
			}
			return { data, signature };
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
			},
			abort() {
				workerData.onTaskFinished();
			}
		};
	}

	function createWebWorkerInterface(workerData, config) {
		let messageTask;
		const workerOptions = { type: "module" };
		if (!workerData.interface) {
			if (!classicWorkersSupported) {
				workerData.worker = getWorker(workerOptions, config.baseURL);
			} else {
				try {
					workerData.worker = getWorker({}, config.baseURL);
				} catch (error) {
					classicWorkersSupported = false;
					workerData.worker = getWorker(workerOptions, config.baseURL);
				}
			}
			workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
			workerData.interface = {
				append(data) {
					return initAndSendMessage({ type: MESSAGE_APPEND, data });
				},
				flush() {
					return initAndSendMessage({ type: MESSAGE_FLUSH });
				},
				abort() {
					workerData.onTaskFinished();
				}
			};
		}
		return workerData.interface;

		function getWorker(options, baseURL) {
			let url;
			try {
				url = new URL(workerData.scripts[0], baseURL);
			} catch (error) {
				url = workerData.scripts[0];
			}
			return new Worker(url, options);
		}

		async function initAndSendMessage(message) {
			if (!messageTask) {
				const options = workerData.options;
				const scripts = workerData.scripts.slice(1);
				await sendMessage({ scripts, type: MESSAGE_INIT, options, config: { chunkSize: config.chunkSize } });
			}
			return sendMessage(message);
		}

		function sendMessage(message) {
			const worker = workerData.worker;
			const result = new Promise((resolve, reject) => messageTask = { resolve, reject });
			try {
				if (message.data) {
					try {
						message.data = message.data.buffer;
						worker.postMessage(message, [message.data]);
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
	let pendingRequests = [];

	function createCodec(codecConstructor, options, config) {
		const streamCopy = !options.compressed && !options.signed && !options.encrypted;
		const webWorker = !streamCopy && (options.useWebWorkers || (options.useWebWorkers === undefined && config.useWebWorkers));
		const scripts = webWorker && config.workerScripts ? config.workerScripts[options.codecType] : [];
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

	async function processData(codec, reader, writer, offset, inputLength, config, options) {
		const chunkSize = Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
		return processChunk();

		async function processChunk(chunkOffset = 0, outputLength = 0) {
			const signal = options.signal;
			if (chunkOffset < inputLength) {
				testAborted(signal, codec);
				const inputData = await reader.readUint8Array(chunkOffset + offset, Math.min(chunkSize, inputLength - chunkOffset));
				const chunkLength = inputData.length;
				testAborted(signal, codec);
				const data = await codec.append(inputData);
				testAborted(signal, codec);
				outputLength += await writeData(writer, data);
				if (options.onprogress) {
					try {
						options.onprogress(chunkOffset + chunkLength, inputLength);
					} catch (error) {
						// ignored
					}
				}
				return processChunk(chunkOffset + chunkSize, outputLength);
			} else {
				const result = await codec.flush();
				outputLength += await writeData(writer, result.data);
				return { signature: result.signature, length: outputLength };
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

	const ERR_HTTP_STATUS = "HTTP error ";
	const ERR_HTTP_RANGE = "HTTP Range not supported";

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
			this.arrayBuffers = [];
		}

		async writeUint8Array(array) {
			super.writeUint8Array(array);
			this.arrayBuffers.push(array.buffer);
		}

		getData() {
			if (!this.blob) {
				this.blob = new Blob(this.arrayBuffers, { type: this.contentType });
			}
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
			await initHttpReader(this, sendFetchRequest, getFetchRequestData);
		}

		async readUint8Array(index, length) {
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

		async readUint8Array(index, length) {
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
		let headers = httpReader.options.headers;
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

	async function decodeText(value, encoding) {
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

		async getEntries(options = {}) {
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
			const entries = [];
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
				entries.push(entry);
				offset = endOffset;
				if (options.onprogress) {
					try {
						options.onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
					} catch (error) {
						// ignored
					}
				}
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
				useWebWorkers: getOptionValue$1(zipEntry, options, "useWebWorkers")
			}, config);
			if (!writer.initialized) {
				await writer.init();
			}
			const signal = getOptionValue$1(zipEntry, options, "signal");
			const dataOffset = offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength;
			await processData(codec, reader, writer, dataOffset, compressedSize, config, { onprogress: options.onprogress, signal });
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
		} catch (error) {
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
		} catch (error) {
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
		} catch (error) {
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
		} catch (error) {
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
				pendingEntries: []
			});
		}

		async add(name = "", reader, options = {}) {
			const zipWriter = this;
			if (workers < zipWriter.config.maxWorkers) {
				workers++;
				try {
					return await addFile(zipWriter, name, reader, options);
				} finally {
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
		if (dataDescriptor === undefined) {
			dataDescriptor = true;
		}
		if (dataDescriptor && dataDescriptorSignature === undefined) {
			dataDescriptorSignature = true;
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
			externalFileAttribute
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
			externalFileAttribute
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
			} catch (error) {
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
			uncompressedSize = fileEntry.uncompressedSize = reader.size;
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
				useWebWorkers
			}, config);
			await writer.writeUint8Array(localHeaderArray);
			fileEntry.dataWritten = true;
			result = await processData(codec, reader, writer, 0, uncompressedSize, config, { onprogress, signal });
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
				} catch (error) {
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
	t(configure);

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
	exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
	exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
	exports.ERR_UNSUPPORTED_FORMAT = ERR_UNSUPPORTED_FORMAT;
	exports.HttpRangeReader = HttpRangeReader;
	exports.HttpReader = HttpReader;
	exports.Reader = Reader;
	exports.TextReader = TextReader;
	exports.TextWriter = TextWriter;
	exports.Uint8ArrayReader = Uint8ArrayReader;
	exports.Uint8ArrayWriter = Uint8ArrayWriter;
	exports.Writer = Writer;
	exports.ZipReader = ZipReader;
	exports.ZipWriter = ZipWriter;
	exports.configure = configure;
	exports.getMimeType = getMimeType;
	exports.initShimAsyncCodec = streamCodecShim;
	exports.terminateWorkers = terminateWorkers;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
