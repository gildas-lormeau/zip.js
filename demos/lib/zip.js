(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

	const { Array, Object, String, BigInt, Math, Date, Map, URL, Error, Uint8Array, Uint16Array, Uint32Array, DataView, Blob, Promise, TextEncoder, TextDecoder, FileReader, document, crypto, btoa } = globalThis;

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

	var t=t=>{if("function"==typeof URL.createObjectURL){const e=()=>URL.createObjectURL(new Blob(['const{Array:t,Object:e,Math:n,Error:r,Uint8Array:i,Uint16Array:s,Uint32Array:o,Int32Array:f,DataView:c,TextEncoder:l,crypto:u,postMessage:a}=globalThis,w=[];for(let t=0;256>t;t++){let e=t;for(let t=0;8>t;t++)1&e?e=e>>>1^3988292384:e>>>=1;w[t]=e}class h{constructor(t){this.t=t||-1}append(t){let e=0|this.t;for(let n=0,r=0|t.length;r>n;n++)e=e>>>8^w[255&(e^t[n])];this.t=e}get(){return~this.t}}const d={concat(t,e){if(0===t.length||0===e.length)return t.concat(e);const n=t[t.length-1],r=d.i(n);return 32===r?t.concat(e):d.o(e,r,0|n,t.slice(0,t.length-1))},l(t){const e=t.length;if(0===e)return 0;const n=t[e-1];return 32*(e-1)+d.i(n)},u(t,e){if(32*t.length<e)return t;const r=(t=t.slice(0,n.ceil(e/32))).length;return e&=31,r>0&&e&&(t[r-1]=d.h(e,t[r-1]&2147483648>>e-1,1)),t},h:(t,e,n)=>32===t?e:(n?0|e:e<<32-t)+1099511627776*t,i:t=>n.round(t/1099511627776)||32,o(t,e,n,r){for(void 0===r&&(r=[]);e>=32;e-=32)r.push(n),n=0;if(0===e)return r.concat(t);for(let i=0;i<t.length;i++)r.push(n|t[i]>>>e),n=t[i]<<32-e;const i=t.length?t[t.length-1]:0,s=d.i(i);return r.push(d.h(e+s&31,e+s>32?n:r.pop(),1)),r}},p={p:{k(t){const e=d.l(t)/8,n=new i(e);let r;for(let i=0;e>i;i++)0==(3&i)&&(r=t[i/4]),n[i]=r>>>24,r<<=8;return n},g(t){const e=[];let n,r=0;for(n=0;n<t.length;n++)r=r<<8|t[n],3==(3&n)&&(e.push(r),r=0);return 3&n&&e.push(d.h(8*(3&n),r)),e}}},b={v:function(t){t?(this.m=t.m.slice(0),this.S=t.S.slice(0),this._=t._):this.reset()}};b.v.prototype={blockSize:512,reset:function(){const t=this;return t.m=this.I.slice(0),t.S=[],t._=0,t},update:function(t){const e=this;"string"==typeof t&&(t=p.C.g(t));const n=e.S=d.concat(e.S,t),i=e._,s=e._=i+d.l(t);if(s>9007199254740991)throw new r("Cannot hash more than 2^53 - 1 bits");const f=new o(n);let c=0;for(let t=e.blockSize+i-(e.blockSize+i&e.blockSize-1);s>=t;t+=e.blockSize)e.A(f.subarray(16*c,16*(c+1))),c+=1;return n.splice(0,16*c),e},V:function(){const t=this;let e=t.S;const r=t.m;e=d.concat(e,[d.h(1,1)]);for(let t=e.length+2;15&t;t++)e.push(0);for(e.push(n.floor(t._/4294967296)),e.push(0|t._);e.length;)t.A(e.splice(0,16));return t.reset(),r},I:[1732584193,4023233417,2562383102,271733878,3285377520],B:[1518500249,1859775393,2400959708,3395469782],D:(t,e,n,r)=>t>19?t>39?t>59?t>79?void 0:e^n^r:e&n|e&r|n&r:e^n^r:e&n|~e&r,U:(t,e)=>e<<t|e>>>32-t,A:function(e){const r=this,i=r.m,s=t(80);for(let t=0;16>t;t++)s[t]=e[t];let o=i[0],f=i[1],c=i[2],l=i[3],u=i[4];for(let t=0;79>=t;t++){16>t||(s[t]=r.U(1,s[t-3]^s[t-8]^s[t-14]^s[t-16]));const e=r.U(5,o)+r.D(t,f,c,l)+u+s[t]+r.B[n.floor(t/20)]|0;u=l,l=c,c=r.U(30,f),f=o,o=e}i[0]=i[0]+o|0,i[1]=i[1]+f|0,i[2]=i[2]+c|0,i[3]=i[3]+l|0,i[4]=i[4]+u|0}};const y={name:"PBKDF2"},k=e.assign({hash:{name:"HMAC"}},y),g=e.assign({iterations:1e3,hash:{name:"SHA-1"}},y),v=["deriveBits"],m=[8,12,16],z=[16,24,32],S=[0,0,0,0],_=p.p,I=class{constructor(t){const e=this;e.M=[[[],[],[],[],[]],[[],[],[],[],[]]],e.M[0][0][0]||e.P();const n=e.M[0][4],i=e.M[1],s=t.length;let o,f,c,l=1;if(4!==s&&6!==s&&8!==s)throw new r("invalid aes key size");for(e.B=[f=t.slice(0),c=[]],o=s;4*s+28>o;o++){let t=f[o-1];(o%s==0||8===s&&o%s==4)&&(t=n[t>>>24]<<24^n[t>>16&255]<<16^n[t>>8&255]<<8^n[255&t],o%s==0&&(t=t<<8^t>>>24^l<<24,l=l<<1^283*(l>>7))),f[o]=f[o-s]^t}for(let t=0;o;t++,o--){const e=f[3&t?o:o-4];c[t]=4>=o||4>t?e:i[0][n[e>>>24]]^i[1][n[e>>16&255]]^i[2][n[e>>8&255]]^i[3][n[255&e]]}}encrypt(t){return this.H(t,0)}decrypt(t){return this.H(t,1)}P(){const t=this.M[0],e=this.M[1],n=t[4],r=e[4],i=[],s=[];let o,f,c,l;for(let t=0;256>t;t++)s[(i[t]=t<<1^283*(t>>7))^t]=t;for(let u=o=0;!n[u];u^=f||1,o=s[o]||1){let s=o^o<<1^o<<2^o<<3^o<<4;s=s>>8^255&s^99,n[u]=s,r[s]=u,l=i[c=i[f=i[u]]];let a=16843009*l^65537*c^257*f^16843008*u,w=257*i[s]^16843008*s;for(let n=0;4>n;n++)t[n][u]=w=w<<24^w>>>8,e[n][s]=a=a<<24^a>>>8}for(let n=0;5>n;n++)t[n]=t[n].slice(0),e[n]=e[n].slice(0)}H(t,e){if(4!==t.length)throw new r("invalid aes block size");const n=this.B[e],i=n.length/4-2,s=[0,0,0,0],o=this.M[e],f=o[0],c=o[1],l=o[2],u=o[3],a=o[4];let w,h,d,p=t[0]^n[0],b=t[e?3:1]^n[1],y=t[2]^n[2],k=t[e?1:3]^n[3],g=4;for(let t=0;i>t;t++)w=f[p>>>24]^c[b>>16&255]^l[y>>8&255]^u[255&k]^n[g],h=f[b>>>24]^c[y>>16&255]^l[k>>8&255]^u[255&p]^n[g+1],d=f[y>>>24]^c[k>>16&255]^l[p>>8&255]^u[255&b]^n[g+2],k=f[k>>>24]^c[p>>16&255]^l[b>>8&255]^u[255&y]^n[g+3],g+=4,p=w,b=h,y=d;for(let t=0;4>t;t++)s[e?3&-t:t]=a[p>>>24]<<24^a[b>>16&255]<<16^a[y>>8&255]<<8^a[255&k]^n[g++],w=p,p=b,b=y,y=k,k=w;return s}},C=class{constructor(t,e){this.L=t,this.R=e,this.T=e}reset(){this.T=this.R}update(t){return this.j(this.L,t,this.T)}F(t){if(255==(t>>24&255)){let e=t>>16&255,n=t>>8&255,r=255&t;255===e?(e=0,255===n?(n=0,255===r?r=0:++r):++n):++e,t=0,t+=e<<16,t+=n<<8,t+=r}else t+=1<<24;return t}K(t){0===(t[0]=this.F(t[0]))&&(t[1]=this.F(t[1]))}j(t,e,n){let r;if(!(r=e.length))return[];const i=d.l(e);for(let i=0;r>i;i+=4){this.K(n);const r=t.encrypt(n);e[i]^=r[0],e[i+1]^=r[1],e[i+2]^=r[2],e[i+3]^=r[3]}return d.u(e,i)}},A=class{constructor(t){const e=this,n=e.O=b.v,r=[[],[]],i=n.prototype.blockSize/32;e.W=[new n,new n],t.length>i&&(t=n.hash(t));for(let e=0;i>e;e++)r[0][e]=909522486^t[e],r[1][e]=1549556828^t[e];e.W[0].update(r[0]),e.W[1].update(r[1]),e.q=new n(e.W[0])}reset(){const t=this;t.q=new t.O(t.W[0]),t.G=!1}update(t){this.G=!0,this.q.update(t)}digest(){const t=this,e=t.q.V(),n=new t.O(t.W[1]).update(e).V();return t.reset(),n}};class V{constructor(t,n,r){e.assign(this,{password:t,signed:n,J:r-1,N:new i(0)})}async append(e){const n=this;if(n.password){const i=M(e,0,m[n.J]+2);await(async(t,e,n)=>{await D(t,n,M(e,0,m[t.J]));const i=M(e,m[t.J]),s=t.keys.passwordVerification;if(s[0]!=i[0]||s[1]!=i[1])throw new r("Invalid pasword")})(n,i,n.password),n.password=null,n.X=new C(new I(n.keys.key),t.from(S)),n.Y=new A(n.keys.Z),e=M(e,m[n.J]+2)}return B(n,e,new i(e.length-10-(e.length-10)%16),0,10,!0)}flush(){const t=this,e=t.N,n=M(e,0,e.length-10),r=M(e,e.length-10);let s=new i(0);if(n.length){const e=_.g(n);t.Y.update(e);const r=t.X.update(e);s=_.k(r)}let o=!0;if(t.signed){const e=M(_.k(t.Y.digest()),0,10);for(let t=0;10>t;t++)e[t]!=r[t]&&(o=!1)}return{valid:o,data:s}}}class E{constructor(t,n){e.assign(this,{password:t,J:n-1,N:new i(0)})}async append(e){const n=this;let r=new i(0);n.password&&(r=await(async(t,e)=>{const n=u.getRandomValues(new i(m[t.J]));return await D(t,e,n),U(n,t.keys.passwordVerification)})(n,n.password),n.password=null,n.X=new C(new I(n.keys.key),t.from(S)),n.Y=new A(n.keys.Z));const s=new i(r.length+e.length-e.length%16);return s.set(r,0),B(n,e,s,r.length,0)}flush(){const t=this;let e=new i(0);if(t.N.length){const n=t.X.update(_.g(t.N));t.Y.update(n),e=_.k(n)}const n=M(_.k(t.Y.digest()),0,10);return{data:U(e,n),signature:n}}}function B(t,e,n,r,s,o){const f=e.length-s;let c;for(t.N.length&&(e=U(t.N,e),n=((t,e)=>{if(e&&e>t.length){const n=t;(t=new i(e)).set(n,0)}return t})(n,f-f%16)),c=0;f-16>=c;c+=16){const i=_.g(M(e,c,c+16));o&&t.Y.update(i);const s=t.X.update(i);o||t.Y.update(s),n.set(_.k(s),c+r)}return t.N=M(e,c),n}async function D(t,n,r){const s=(t=>{if(void 0===l){const e=new i((t=unescape(encodeURIComponent(t))).length);for(let n=0;n<e.length;n++)e[n]=t.charCodeAt(n);return e}return(new l).encode(t)})(n),o=await u.subtle.importKey("raw",s,k,!1,v),f=await u.subtle.deriveBits(e.assign({salt:r},g),o,8*(2*z[t.J]+2)),c=new i(f);t.keys={key:_.g(M(c,0,z[t.J])),Z:_.g(M(c,z[t.J],2*z[t.J])),passwordVerification:M(c,2*z[t.J])}}function U(t,e){let n=t;return t.length+e.length&&(n=new i(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function M(t,e,n){return t.subarray(e,n)}class P{constructor(t,n){e.assign(this,{password:t,passwordVerification:n}),T(this,t)}append(t){const e=this;if(e.password){const n=L(e,t.subarray(0,12));if(e.password=null,n[11]!=e.passwordVerification)throw new r("Invalid pasword");t=t.subarray(12)}return L(e,t)}flush(){return{valid:!0,data:new i(0)}}}class H{constructor(t,n){e.assign(this,{password:t,passwordVerification:n}),T(this,t)}append(t){const e=this;let n,r;if(e.password){e.password=null;const s=u.getRandomValues(new i(12));s[11]=e.passwordVerification,n=new i(t.length+s.length),n.set(R(e,s),0),r=12}else n=new i(t.length),r=0;return n.set(R(e,t),r),n}flush(){return{data:new i(0)}}}function L(t,e){const n=new i(e.length);for(let r=0;r<e.length;r++)n[r]=x(t)^e[r],j(t,n[r]);return n}function R(t,e){const n=new i(e.length);for(let r=0;r<e.length;r++)n[r]=x(t)^e[r],j(t,e[r]);return n}function T(t,e){t.keys=[305419896,591751049,878082192],t.$=new h(t.keys[0]),t.tt=new h(t.keys[2]);for(let n=0;n<e.length;n++)j(t,e.charCodeAt(n))}function j(t,e){t.$.append([e]),t.keys[0]=~t.$.get(),t.keys[1]=K(t.keys[1]+F(t.keys[0])),t.keys[1]=K(n.imul(t.keys[1],134775813)+1),t.tt.append([t.keys[1]>>>24]),t.keys[2]=~t.tt.get()}function x(t){const e=2|t.keys[2];return F(n.imul(e,1^e)>>>8)}function F(t){return 255&t}function K(t){return 4294967295&t}class O{constructor(t,{signature:n,password:r,signed:i,compressed:s,zipCrypto:o,passwordVerification:f,encryptionStrength:c},{et:l}){const u=!!r;e.assign(this,{signature:n,encrypted:u,signed:i,compressed:s,nt:s&&new t({et:l}),rt:i&&new h,zipCrypto:o,decrypt:u&&o?new P(r,f):new V(r,i,c)})}async append(t){const e=this;return e.encrypted&&t.length&&(t=await e.decrypt.append(t)),e.compressed&&t.length&&(t=await e.nt.append(t)),(!e.encrypted||e.zipCrypto)&&e.signed&&t.length&&e.rt.append(t),t}async flush(){const t=this;let e,n=new i(0);if(t.encrypted){const e=t.decrypt.flush();if(!e.valid)throw new r("Invalid signature");n=e.data}if((!t.encrypted||t.zipCrypto)&&t.signed){const n=new c(new i(4).buffer);if(e=t.rt.get(),n.setUint32(0,e),t.signature!=n.getUint32(0,!1))throw new r("Invalid signature")}return t.compressed&&(n=await t.nt.append(n)||new i(0),await t.nt.flush()),{data:n,signature:e}}}class W{constructor(t,{encrypted:n,signed:r,compressed:i,level:s,zipCrypto:o,password:f,passwordVerification:c,encryptionStrength:l},{et:u}){e.assign(this,{encrypted:n,signed:r,compressed:i,it:i&&new t({level:s||5,et:u}),rt:r&&new h,zipCrypto:o,encrypt:n&&o?new H(f,c):new E(f,l)})}async append(t){const e=this;let n=t;return e.compressed&&t.length&&(n=await e.it.append(t)),e.encrypted&&n.length&&(n=await e.encrypt.append(n)),(!e.encrypted||e.zipCrypto)&&e.signed&&t.length&&e.rt.append(t),n}async flush(){const t=this;let e,n=new i(0);if(t.compressed&&(n=await t.it.flush()||new i(0)),t.encrypted){n=await t.encrypt.append(n);const r=t.encrypt.flush();e=r.signature;const s=new i(n.length+r.data.length);s.set(n,0),s.set(r.data,n.length),n=s}return t.encrypted&&!t.zipCrypto||!t.signed||(e=t.rt.get()),{data:n,signature:e}}}const q={init(t){t.scripts&&t.scripts.length&&importScripts.apply(void 0,t.scripts);const e=t.options;let n;self.initCodec&&self.initCodec(),e.codecType.startsWith("deflate")?n=self.Deflate:e.codecType.startsWith("inflate")&&(n=self.Inflate),G=((t,e,n)=>e.codecType.startsWith("deflate")?new W(t,e,n):e.codecType.startsWith("inflate")?new O(t,e,n):void 0)(n,e,t.config)},append:async t=>({data:await G.append(t.data)}),flush:()=>G.flush()};let G;function J(e){return N(e.map((([e,n])=>new t(e).fill(n,0,e))))}function N(e){return e.reduce(((e,n)=>e.concat(t.isArray(n)?N(n):n)),[])}addEventListener("message",(async t=>{const e=t.data,n=e.type,r=q[n];if(r)try{e.data&&(e.data=new i(e.data));const t=await r(e)||{};if(t.type=n,t.data)try{t.data=t.data.buffer,a(t,[t.data])}catch(e){a(t)}else a(t)}catch(t){a({type:n,error:{message:t.message,stack:t.stack}})}}));const Q=[0,1,2,3].concat(...J([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function X(){const t=this;function e(t,e){let n=0;do{n|=1&t,t>>>=1,n<<=1}while(--e>0);return n>>>1}t.st=r=>{const i=t.ot,s=t.ct.ft,o=t.ct.lt;let f,c,l,u=-1;for(r.ut=0,r.at=573,f=0;o>f;f++)0!==i[2*f]?(r.wt[++r.ut]=u=f,r.ht[f]=0):i[2*f+1]=0;for(;2>r.ut;)l=r.wt[++r.ut]=2>u?++u:0,i[2*l]=1,r.ht[l]=0,r.dt--,s&&(r.bt-=s[2*l+1]);for(t.yt=u,f=n.floor(r.ut/2);f>=1;f--)r.kt(i,f);l=o;do{f=r.wt[1],r.wt[1]=r.wt[r.ut--],r.kt(i,1),c=r.wt[1],r.wt[--r.at]=f,r.wt[--r.at]=c,i[2*l]=i[2*f]+i[2*c],r.ht[l]=n.max(r.ht[f],r.ht[c])+1,i[2*f+1]=i[2*c+1]=l,r.wt[1]=l++,r.kt(i,1)}while(r.ut>=2);r.wt[--r.at]=r.wt[1],(e=>{const n=t.ot,r=t.ct.ft,i=t.ct.gt,s=t.ct.vt,o=t.ct.zt;let f,c,l,u,a,w,h=0;for(u=0;15>=u;u++)e.St[u]=0;for(n[2*e.wt[e.at]+1]=0,f=e.at+1;573>f;f++)c=e.wt[f],u=n[2*n[2*c+1]+1]+1,u>o&&(u=o,h++),n[2*c+1]=u,c>t.yt||(e.St[u]++,a=0,s>c||(a=i[c-s]),w=n[2*c],e.dt+=w*(u+a),r&&(e.bt+=w*(r[2*c+1]+a)));if(0!==h){do{for(u=o-1;0===e.St[u];)u--;e.St[u]--,e.St[u+1]+=2,e.St[o]--,h-=2}while(h>0);for(u=o;0!==u;u--)for(c=e.St[u];0!==c;)l=e.wt[--f],l>t.yt||(n[2*l+1]!=u&&(e.dt+=(u-n[2*l+1])*n[2*l],n[2*l+1]=u),c--)}})(r),((t,n,r)=>{const i=[];let s,o,f,c=0;for(s=1;15>=s;s++)i[s]=c=c+r[s-1]<<1;for(o=0;n>=o;o++)f=t[2*o+1],0!==f&&(t[2*o]=e(i[f]++,f))})(i,t.yt,r.St)}}function Y(t,e,n,r,i){const s=this;s.ft=t,s.gt=e,s.vt=n,s.lt=r,s.zt=i}X._t=[0,1,2,3,4,5,6,7].concat(...J([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),X.It=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],X.Ct=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],X.At=t=>256>t?Q[t]:Q[256+(t>>>7)],X.Vt=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],X.Et=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],X.Bt=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],X.Dt=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];const Z=J([[144,8],[112,9],[24,7],[8,8]]);Y.Ut=N([12,140,76,204,44,172,108,236,28,156,92,220,60,188,124,252,2,130,66,194,34,162,98,226,18,146,82,210,50,178,114,242,10,138,74,202,42,170,106,234,26,154,90,218,58,186,122,250,6,134,70,198,38,166,102,230,22,150,86,214,54,182,118,246,14,142,78,206,46,174,110,238,30,158,94,222,62,190,126,254,1,129,65,193,33,161,97,225,17,145,81,209,49,177,113,241,9,137,73,201,41,169,105,233,25,153,89,217,57,185,121,249,5,133,69,197,37,165,101,229,21,149,85,213,53,181,117,245,13,141,77,205,45,173,109,237,29,157,93,221,61,189,125,253,19,275,147,403,83,339,211,467,51,307,179,435,115,371,243,499,11,267,139,395,75,331,203,459,43,299,171,427,107,363,235,491,27,283,155,411,91,347,219,475,59,315,187,443,123,379,251,507,7,263,135,391,71,327,199,455,39,295,167,423,103,359,231,487,23,279,151,407,87,343,215,471,55,311,183,439,119,375,247,503,15,271,143,399,79,335,207,463,47,303,175,431,111,367,239,495,31,287,159,415,95,351,223,479,63,319,191,447,127,383,255,511,0,64,32,96,16,80,48,112,8,72,40,104,24,88,56,120,4,68,36,100,20,84,52,116,3,131,67,195,35,163,99,227].map(((t,e)=>[t,Z[e]])));const $=J([[30,5]]);function tt(t,e,n,r,i){const s=this;s.Mt=t,s.Pt=e,s.Ht=n,s.Lt=r,s.Rt=i}Y.Tt=N([0,16,8,24,4,20,12,28,2,18,10,26,6,22,14,30,1,17,9,25,5,21,13,29,3,19,11,27,7,23].map(((t,e)=>[t,$[e]]))),Y.jt=new Y(Y.Ut,X.Vt,257,286,15),Y.xt=new Y(Y.Tt,X.Et,0,30,15),Y.Ft=new Y(null,X.Bt,0,19,7);const et=[new tt(0,0,0,0,0),new tt(4,4,8,4,1),new tt(4,5,16,8,1),new tt(4,6,32,32,1),new tt(4,4,16,16,2),new tt(8,16,32,32,2),new tt(8,16,128,128,2),new tt(8,32,128,256,2),new tt(32,128,258,1024,2),new tt(32,258,258,4096,2)],nt=["need dictionary","stream end","","","stream error","data error","","buffer error","",""];function rt(t,e,n,r){const i=t[2*e],s=t[2*n];return s>i||i==s&&r[e]<=r[n]}function it(){const t=this;let e,r,o,f,c,l,u,a,w,h,d,p,b,y,k,g,v,m,z,S,_,I,C,A,V,E,B,D,U,M,P,H,L;const R=new X,T=new X,j=new X;let x,F,K,O,W,q;function G(){let e;for(e=0;286>e;e++)P[2*e]=0;for(e=0;30>e;e++)H[2*e]=0;for(e=0;19>e;e++)L[2*e]=0;P[512]=1,t.dt=t.bt=0,F=K=0}function J(t,e){let n,r=-1,i=t[1],s=0,o=7,f=4;0===i&&(o=138,f=3),t[2*(e+1)+1]=65535;for(let c=0;e>=c;c++)n=i,i=t[2*(c+1)+1],++s<o&&n==i||(f>s?L[2*n]+=s:0!==n?(n!=r&&L[2*n]++,L[32]++):s>10?L[36]++:L[34]++,s=0,r=n,0===i?(o=138,f=3):n==i?(o=6,f=3):(o=7,f=4))}function N(e){t.Kt[t.pending++]=e}function Q(t){N(255&t),N(t>>>8&255)}function Z(t,e){let n;const r=e;q>16-r?(n=t,W|=n<<q&65535,Q(W),W=n>>>16-q,q+=r-16):(W|=t<<q&65535,q+=r)}function $(t,e){const n=2*t;Z(65535&e[n],65535&e[n+1])}function tt(t,e){let n,r,i=-1,s=t[1],o=0,f=7,c=4;for(0===s&&(f=138,c=3),n=0;e>=n;n++)if(r=s,s=t[2*(n+1)+1],++o>=f||r!=s){if(c>o)do{$(r,L)}while(0!=--o);else 0!==r?(r!=i&&($(r,L),o--),$(16,L),Z(o-3,2)):o>10?($(18,L),Z(o-11,7)):($(17,L),Z(o-3,3));o=0,i=r,0===s?(f=138,c=3):r==s?(f=6,c=3):(f=7,c=4)}}function it(){16==q?(Q(W),W=0,q=0):8>q||(N(255&W),W>>>=8,q-=8)}function st(e,r){let i,s,o;if(t.Ot[F]=e,t.Wt[F]=255&r,F++,0===e?P[2*r]++:(K++,e--,P[2*(X._t[r]+256+1)]++,H[2*X.At(e)]++),0==(8191&F)&&B>2){for(i=8*F,s=_-v,o=0;30>o;o++)i+=H[2*o]*(5+X.Et[o]);if(i>>>=3,K<n.floor(F/2)&&i<n.floor(s/2))return!0}return F==x-1}function ot(e,n){let r,i,s,o,f=0;if(0!==F)do{r=t.Ot[f],i=t.Wt[f],f++,0===r?$(i,e):(s=X._t[i],$(s+256+1,e),o=X.Vt[s],0!==o&&(i-=X.It[s],Z(i,o)),r--,s=X.At(r),$(s,n),o=X.Et[s],0!==o&&(r-=X.Ct[s],Z(r,o)))}while(F>f);$(256,e),O=e[513]}function ft(){q>8?Q(W):q>0&&N(255&W),W=0,q=0}function ct(e,n,r){Z(0+(r?1:0),3),((e,n)=>{ft(),O=8,Q(n),Q(~n),t.Kt.set(a.subarray(e,e+n),t.pending),t.pending+=n})(e,n)}function lt(n){((e,n,r)=>{let i,s,o=0;B>0?(R.st(t),T.st(t),o=(()=>{let e;for(J(P,R.yt),J(H,T.yt),j.st(t),e=18;e>=3&&0===L[2*X.Dt[e]+1];e--);return t.dt+=14+3*(e+1),e})(),i=t.dt+3+7>>>3,s=t.bt+3+7>>>3,s>i||(i=s)):i=s=n+5,n+4>i||-1==e?s==i?(Z(2+(r?1:0),3),ot(Y.Ut,Y.Tt)):(Z(4+(r?1:0),3),((t,e,n)=>{let r;for(Z(t-257,5),Z(e-1,5),Z(n-4,4),r=0;n>r;r++)Z(L[2*X.Dt[r]+1],3);tt(P,t-1),tt(H,e-1)})(R.yt+1,T.yt+1,o+1),ot(P,H)):ct(e,n,r),G(),r&&ft()})(0>v?-1:v,_-v,n),v=_,e.qt()}function ut(){let t,n,r,i;do{if(i=w-C-_,0===i&&0===_&&0===C)i=c;else if(-1==i)i--;else if(_>=c+c-262){a.set(a.subarray(c,c+c),0),I-=c,_-=c,v-=c,t=b,r=t;do{n=65535&d[--r],d[r]=c>n?0:n-c}while(0!=--t);t=c,r=t;do{n=65535&h[--r],h[r]=c>n?0:n-c}while(0!=--t);i+=c}if(0===e.Gt)return;t=e.Jt(a,_+C,i),C+=t,3>C||(p=255&a[_],p=(p<<g^255&a[_+1])&k)}while(262>C&&0!==e.Gt)}function at(t){let e,n,r=V,i=_,s=A;const o=_>c-262?_-(c-262):0;let f=M;const l=u,w=_+258;let d=a[i+s-1],p=a[i+s];U>A||(r>>=2),f>C&&(f=C);do{if(e=t,a[e+s]==p&&a[e+s-1]==d&&a[e]==a[i]&&a[++e]==a[i+1]){i+=2,e++;do{}while(a[++i]==a[++e]&&a[++i]==a[++e]&&a[++i]==a[++e]&&a[++i]==a[++e]&&a[++i]==a[++e]&&a[++i]==a[++e]&&a[++i]==a[++e]&&a[++i]==a[++e]&&w>i);if(n=258-(w-i),i=w-258,n>s){if(I=t,s=n,n>=f)break;d=a[i+s-1],p=a[i+s]}}}while((t=65535&h[t&l])>o&&0!=--r);return s>C?C:s}t.ht=[],t.St=[],t.wt=[],P=[],H=[],L=[],t.kt=(e,n)=>{const r=t.wt,i=r[n];let s=n<<1;for(;s<=t.ut&&(s<t.ut&&rt(e,r[s+1],r[s],t.ht)&&s++,!rt(e,i,r[s],t.ht));)r[n]=r[s],n=s,s<<=1;r[n]=i},t.Nt=(e,z,I,F,K,J)=>(F||(F=8),K||(K=8),J||(J=0),e.Qt=null,-1==z&&(z=6),1>K||K>9||8!=F||9>I||I>15||0>z||z>9||0>J||J>2?-2:(e.Xt=t,l=I,c=1<<l,u=c-1,y=K+7,b=1<<y,k=b-1,g=n.floor((y+3-1)/3),a=new i(2*c),h=[],d=[],x=1<<K+6,t.Kt=new i(4*x),o=4*x,t.Ot=new s(x),t.Wt=new i(x),B=z,D=J,(e=>(e.Yt=e.Zt=0,e.Qt=null,t.pending=0,t.$t=0,r=113,f=0,R.ot=P,R.ct=Y.jt,T.ot=H,T.ct=Y.xt,j.ot=L,j.ct=Y.Ft,W=0,q=0,O=8,G(),(()=>{w=2*c,d[b-1]=0;for(let t=0;b-1>t;t++)d[t]=0;E=et[B].Pt,U=et[B].Mt,M=et[B].Ht,V=et[B].Lt,_=0,v=0,C=0,m=A=2,S=0,p=0})(),0))(e))),t.te=()=>42!=r&&113!=r&&666!=r?-2:(t.Wt=null,t.Ot=null,t.Kt=null,d=null,h=null,a=null,t.Xt=null,113==r?-3:0),t.ee=(t,e,n)=>{let r=0;return-1==e&&(e=6),0>e||e>9||0>n||n>2?-2:(et[B].Rt!=et[e].Rt&&0!==t.Yt&&(r=t.it(1)),B!=e&&(B=e,E=et[B].Pt,U=et[B].Mt,M=et[B].Ht,V=et[B].Lt),D=n,r)},t.ne=(t,e,n)=>{let i,s=n,o=0;if(!e||42!=r)return-2;if(3>s)return 0;for(s>c-262&&(s=c-262,o=n-s),a.set(e.subarray(o,o+s),0),_=s,v=s,p=255&a[0],p=(p<<g^255&a[1])&k,i=0;s-3>=i;i++)p=(p<<g^255&a[i+2])&k,h[i&u]=d[p],d[p]=i;return 0},t.it=(n,i)=>{let s,w,y,V,U;if(i>4||0>i)return-2;if(!n.re||!n.ie&&0!==n.Gt||666==r&&4!=i)return n.Qt=nt[4],-2;if(0===n.se)return n.Qt=nt[7],-5;var M;if(e=n,V=f,f=i,42==r&&(w=8+(l-8<<4)<<8,y=(B-1&255)>>1,y>3&&(y=3),w|=y<<6,0!==_&&(w|=32),w+=31-w%31,r=113,N((M=w)>>8&255),N(255&M)),0!==t.pending){if(e.qt(),0===e.se)return f=-1,0}else if(0===e.Gt&&V>=i&&4!=i)return e.Qt=nt[7],-5;if(666==r&&0!==e.Gt)return n.Qt=nt[7],-5;if(0!==e.Gt||0!==C||0!=i&&666!=r){switch(U=-1,et[B].Rt){case 0:U=(t=>{let n,r=65535;for(r>o-5&&(r=o-5);;){if(1>=C){if(ut(),0===C&&0==t)return 0;if(0===C)break}if(_+=C,C=0,n=v+r,(0===_||_>=n)&&(C=_-n,_=n,lt(!1),0===e.se))return 0;if(_-v>=c-262&&(lt(!1),0===e.se))return 0}return lt(4==t),0===e.se?4==t?2:0:4==t?3:1})(i);break;case 1:U=(t=>{let n,r=0;for(;;){if(262>C){if(ut(),262>C&&0==t)return 0;if(0===C)break}if(3>C||(p=(p<<g^255&a[_+2])&k,r=65535&d[p],h[_&u]=d[p],d[p]=_),0===r||(_-r&65535)>c-262||2!=D&&(m=at(r)),3>m)n=st(0,255&a[_]),C--,_++;else if(n=st(_-I,m-3),C-=m,m>E||3>C)_+=m,m=0,p=255&a[_],p=(p<<g^255&a[_+1])&k;else{m--;do{_++,p=(p<<g^255&a[_+2])&k,r=65535&d[p],h[_&u]=d[p],d[p]=_}while(0!=--m);_++}if(n&&(lt(!1),0===e.se))return 0}return lt(4==t),0===e.se?4==t?2:0:4==t?3:1})(i);break;case 2:U=(t=>{let n,r,i=0;for(;;){if(262>C){if(ut(),262>C&&0==t)return 0;if(0===C)break}if(3>C||(p=(p<<g^255&a[_+2])&k,i=65535&d[p],h[_&u]=d[p],d[p]=_),A=m,z=I,m=2,0!==i&&E>A&&c-262>=(_-i&65535)&&(2!=D&&(m=at(i)),5>=m&&(1==D||3==m&&_-I>4096)&&(m=2)),3>A||m>A)if(0!==S){if(n=st(0,255&a[_-1]),n&&lt(!1),_++,C--,0===e.se)return 0}else S=1,_++,C--;else{r=_+C-3,n=st(_-1-z,A-3),C-=A-1,A-=2;do{++_>r||(p=(p<<g^255&a[_+2])&k,i=65535&d[p],h[_&u]=d[p],d[p]=_)}while(0!=--A);if(S=0,m=2,_++,n&&(lt(!1),0===e.se))return 0}}return 0!==S&&(n=st(0,255&a[_-1]),S=0),lt(4==t),0===e.se?4==t?2:0:4==t?3:1})(i)}if(2!=U&&3!=U||(r=666),0==U||2==U)return 0===e.se&&(f=-1),0;if(1==U){if(1==i)Z(2,3),$(256,Y.Ut),it(),9>1+O+10-q&&(Z(2,3),$(256,Y.Ut),it()),O=7;else if(ct(0,0,!1),3==i)for(s=0;b>s;s++)d[s]=0;if(e.qt(),0===e.se)return f=-1,0}}return 4!=i?0:1}}function st(){const t=this;t.oe=0,t.fe=0,t.Gt=0,t.Yt=0,t.se=0,t.Zt=0}function ot(t){const e=new st,s=(o=t&&t.et?t.et:65536)+5*(n.floor(o/16383)+1);var o;const f=new i(s);let c=t?t.level:-1;void 0===c&&(c=-1),e.Nt(c),e.re=f,this.append=(t,n)=>{let o,c,l=0,u=0,a=0;const w=[];if(t.length){e.oe=0,e.ie=t,e.Gt=t.length;do{if(e.fe=0,e.se=s,o=e.it(0),0!=o)throw new r("deflating: "+e.Qt);e.fe&&(e.fe==s?w.push(new i(f)):w.push(f.slice(0,e.fe))),a+=e.fe,n&&e.oe>0&&e.oe!=l&&(n(e.oe),l=e.oe)}while(e.Gt>0||0===e.se);return w.length>1?(c=new i(a),w.forEach((t=>{c.set(t,u),u+=t.length}))):c=w[0]||new i(0),c}},this.flush=()=>{let t,n,o=0,c=0;const l=[];do{if(e.fe=0,e.se=s,t=e.it(4),1!=t&&0!=t)throw new r("deflating: "+e.Qt);s-e.se>0&&l.push(f.slice(0,e.fe)),c+=e.fe}while(e.Gt>0||0===e.se);return e.te(),n=new i(c),l.forEach((t=>{n.set(t,o),o+=t.length})),n}}st.prototype={Nt:function(t,e){const n=this;return n.Xt=new it,e||(e=15),n.Xt.Nt(n,t,e)},it:function(t){const e=this;return e.Xt?e.Xt.it(e,t):-2},te:function(){const t=this;if(!t.Xt)return-2;const e=t.Xt.te();return t.Xt=null,e},ee:function(t,e){const n=this;return n.Xt?n.Xt.ee(n,t,e):-2},ne:function(t,e){const n=this;return n.Xt?n.Xt.ne(n,t,e):-2},Jt:function(t,e,n){const r=this;let i=r.Gt;return i>n&&(i=n),0===i?0:(r.Gt-=i,t.set(r.ie.subarray(r.oe,r.oe+i),e),r.oe+=i,r.Yt+=i,i)},qt:function(){const t=this;let e=t.Xt.pending;e>t.se&&(e=t.se),0!==e&&(t.re.set(t.Xt.Kt.subarray(t.Xt.$t,t.Xt.$t+e),t.fe),t.fe+=e,t.Xt.$t+=e,t.Zt+=e,t.se-=e,t.Xt.pending-=e,0===t.Xt.pending&&(t.Xt.$t=0))}};const ft=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],ct=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],lt=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],ut=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],at=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],wt=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],ht=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function dt(){let t,e,n,r,i,s;function o(t,e,o,f,c,l,u,a,w,h,d){let p,b,y,k,g,v,m,z,S,_,I,C,A,V,E;_=0,g=o;do{n[t[e+_]]++,_++,g--}while(0!==g);if(n[0]==o)return u[0]=-1,a[0]=0,0;for(z=a[0],v=1;15>=v&&0===n[v];v++);for(m=v,v>z&&(z=v),g=15;0!==g&&0===n[g];g--);for(y=g,z>g&&(z=g),a[0]=z,V=1<<v;g>v;v++,V<<=1)if(0>(V-=n[v]))return-3;if(0>(V-=n[g]))return-3;for(n[g]+=V,s[1]=v=0,_=1,A=2;0!=--g;)s[A]=v+=n[_],A++,_++;g=0,_=0;do{0!==(v=t[e+_])&&(d[s[v]++]=g),_++}while(++g<o);for(o=s[y],s[0]=g=0,_=0,k=-1,C=-z,i[0]=0,I=0,E=0;y>=m;m++)for(p=n[m];0!=p--;){for(;m>C+z;){if(k++,C+=z,E=y-C,E=E>z?z:E,(b=1<<(v=m-C))>p+1&&(b-=p+1,A=m,E>v))for(;++v<E&&(b<<=1)>n[++A];)b-=n[A];if(E=1<<v,h[0]+E>1440)return-3;i[k]=I=h[0],h[0]+=E,0!==k?(s[k]=g,r[0]=v,r[1]=z,v=g>>>C-z,r[2]=I-i[k-1]-v,w.set(r,3*(i[k-1]+v))):u[0]=I}for(r[1]=m-C,o>_?d[_]<f?(r[0]=256>d[_]?0:96,r[2]=d[_++]):(r[0]=l[d[_]-f]+16+64,r[2]=c[d[_++]-f]):r[0]=192,b=1<<m-C,v=g>>>C;E>v;v+=b)w.set(r,3*(I+v));for(v=1<<m-1;0!=(g&v);v>>>=1)g^=v;for(g^=v,S=(1<<C)-1;(g&S)!=s[k];)k--,C-=z,S=(1<<C)-1}return 0!==V&&1!=y?-5:0}function c(o){let c;for(t||(t=[],e=[],n=new f(16),r=[],i=new f(15),s=new f(16)),e.length<o&&(e=[]),c=0;o>c;c++)e[c]=0;for(c=0;16>c;c++)n[c]=0;for(c=0;3>c;c++)r[c]=0;i.set(n.subarray(0,15),0),s.set(n.subarray(0,16),0)}this.ce=(n,r,i,s,f)=>{let l;return c(19),t[0]=0,l=o(n,0,19,19,null,null,i,r,s,t,e),-3==l?f.Qt="oversubscribed dynamic bit lengths tree":-5!=l&&0!==r[0]||(f.Qt="incomplete dynamic bit lengths tree",l=-3),l},this.le=(n,r,i,s,f,l,u,a,w)=>{let h;return c(288),t[0]=0,h=o(i,0,n,257,ut,at,l,s,a,t,e),0!=h||0===s[0]?(-3==h?w.Qt="oversubscribed literal/length tree":-4!=h&&(w.Qt="incomplete literal/length tree",h=-3),h):(c(288),h=o(i,n,r,0,wt,ht,u,f,a,t,e),0!=h||0===f[0]&&n>257?(-3==h?w.Qt="oversubscribed distance tree":-5==h?(w.Qt="incomplete distance tree",h=-3):-4!=h&&(w.Qt="empty distance tree with lengths",h=-3),h):0)}}function pt(){const t=this;let e,n,r,i,s=0,o=0,f=0,c=0,l=0,u=0,a=0,w=0,h=0,d=0;function p(t,e,n,r,i,s,o,f){let c,l,u,a,w,h,d,p,b,y,k,g,v,m,z,S;d=f.oe,p=f.Gt,w=o.ue,h=o.ae,b=o.write,y=b<o.read?o.read-b-1:o.end-b,k=ft[t],g=ft[e];do{for(;20>h;)p--,w|=(255&f.we(d++))<<h,h+=8;if(c=w&k,l=n,u=r,S=3*(u+c),0!==(a=l[S]))for(;;){if(w>>=l[S+1],h-=l[S+1],0!=(16&a)){for(a&=15,v=l[S+2]+(w&ft[a]),w>>=a,h-=a;15>h;)p--,w|=(255&f.we(d++))<<h,h+=8;for(c=w&g,l=i,u=s,S=3*(u+c),a=l[S];;){if(w>>=l[S+1],h-=l[S+1],0!=(16&a)){for(a&=15;a>h;)p--,w|=(255&f.we(d++))<<h,h+=8;if(m=l[S+2]+(w&ft[a]),w>>=a,h-=a,y-=v,m>b){z=b-m;do{z+=o.end}while(0>z);if(a=o.end-z,v>a){if(v-=a,b-z>0&&a>b-z)do{o.he[b++]=o.he[z++]}while(0!=--a);else o.he.set(o.he.subarray(z,z+a),b),b+=a,z+=a,a=0;z=0}}else z=b-m,b-z>0&&2>b-z?(o.he[b++]=o.he[z++],o.he[b++]=o.he[z++],v-=2):(o.he.set(o.he.subarray(z,z+2),b),b+=2,z+=2,v-=2);if(b-z>0&&v>b-z)do{o.he[b++]=o.he[z++]}while(0!=--v);else o.he.set(o.he.subarray(z,z+v),b),b+=v,z+=v,v=0;break}if(0!=(64&a))return f.Qt="invalid distance code",v=f.Gt-p,v=v>h>>3?h>>3:v,p+=v,d-=v,h-=v<<3,o.ue=w,o.ae=h,f.Gt=p,f.Yt+=d-f.oe,f.oe=d,o.write=b,-3;c+=l[S+2],c+=w&ft[a],S=3*(u+c),a=l[S]}break}if(0!=(64&a))return 0!=(32&a)?(v=f.Gt-p,v=v>h>>3?h>>3:v,p+=v,d-=v,h-=v<<3,o.ue=w,o.ae=h,f.Gt=p,f.Yt+=d-f.oe,f.oe=d,o.write=b,1):(f.Qt="invalid literal/length code",v=f.Gt-p,v=v>h>>3?h>>3:v,p+=v,d-=v,h-=v<<3,o.ue=w,o.ae=h,f.Gt=p,f.Yt+=d-f.oe,f.oe=d,o.write=b,-3);if(c+=l[S+2],c+=w&ft[a],S=3*(u+c),0===(a=l[S])){w>>=l[S+1],h-=l[S+1],o.he[b++]=l[S+2],y--;break}}else w>>=l[S+1],h-=l[S+1],o.he[b++]=l[S+2],y--}while(y>=258&&p>=10);return v=f.Gt-p,v=v>h>>3?h>>3:v,p+=v,d-=v,h-=v<<3,o.ue=w,o.ae=h,f.Gt=p,f.Yt+=d-f.oe,f.oe=d,o.write=b,0}t.init=(t,s,o,f,c,l)=>{e=0,a=t,w=s,r=o,h=f,i=c,d=l,n=null},t.de=(t,b,y)=>{let k,g,v,m,z,S,_,I=0,C=0,A=0;for(A=b.oe,m=b.Gt,I=t.ue,C=t.ae,z=t.write,S=z<t.read?t.read-z-1:t.end-z;;)switch(e){case 0:if(S>=258&&m>=10&&(t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,y=p(a,w,r,h,i,d,t,b),A=b.oe,m=b.Gt,I=t.ue,C=t.ae,z=t.write,S=z<t.read?t.read-z-1:t.end-z,0!=y)){e=1==y?7:9;break}f=a,n=r,o=h,e=1;case 1:for(k=f;k>C;){if(0===m)return t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);y=0,m--,I|=(255&b.we(A++))<<C,C+=8}if(g=3*(o+(I&ft[k])),I>>>=n[g+1],C-=n[g+1],v=n[g],0===v){c=n[g+2],e=6;break}if(0!=(16&v)){l=15&v,s=n[g+2],e=2;break}if(0==(64&v)){f=v,o=g/3+n[g+2];break}if(0!=(32&v)){e=7;break}return e=9,b.Qt="invalid literal/length code",y=-3,t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);case 2:for(k=l;k>C;){if(0===m)return t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);y=0,m--,I|=(255&b.we(A++))<<C,C+=8}s+=I&ft[k],I>>=k,C-=k,f=w,n=i,o=d,e=3;case 3:for(k=f;k>C;){if(0===m)return t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);y=0,m--,I|=(255&b.we(A++))<<C,C+=8}if(g=3*(o+(I&ft[k])),I>>=n[g+1],C-=n[g+1],v=n[g],0!=(16&v)){l=15&v,u=n[g+2],e=4;break}if(0==(64&v)){f=v,o=g/3+n[g+2];break}return e=9,b.Qt="invalid distance code",y=-3,t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);case 4:for(k=l;k>C;){if(0===m)return t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);y=0,m--,I|=(255&b.we(A++))<<C,C+=8}u+=I&ft[k],I>>=k,C-=k,e=5;case 5:for(_=z-u;0>_;)_+=t.end;for(;0!==s;){if(0===S&&(z==t.end&&0!==t.read&&(z=0,S=z<t.read?t.read-z-1:t.end-z),0===S&&(t.write=z,y=t.pe(b,y),z=t.write,S=z<t.read?t.read-z-1:t.end-z,z==t.end&&0!==t.read&&(z=0,S=z<t.read?t.read-z-1:t.end-z),0===S)))return t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);t.he[z++]=t.he[_++],S--,_==t.end&&(_=0),s--}e=0;break;case 6:if(0===S&&(z==t.end&&0!==t.read&&(z=0,S=z<t.read?t.read-z-1:t.end-z),0===S&&(t.write=z,y=t.pe(b,y),z=t.write,S=z<t.read?t.read-z-1:t.end-z,z==t.end&&0!==t.read&&(z=0,S=z<t.read?t.read-z-1:t.end-z),0===S)))return t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);y=0,t.he[z++]=c,S--,e=0;break;case 7:if(C>7&&(C-=8,m++,A--),t.write=z,y=t.pe(b,y),z=t.write,S=z<t.read?t.read-z-1:t.end-z,t.read!=t.write)return t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);e=8;case 8:return y=1,t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);case 9:return y=-3,t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y);default:return y=-2,t.ue=I,t.ae=C,b.Gt=m,b.Yt+=A-b.oe,b.oe=A,t.write=z,t.pe(b,y)}},t.be=()=>{}}dt.ye=(t,e,n,r)=>(t[0]=9,e[0]=5,n[0]=ct,r[0]=lt,0);const bt=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function yt(t,e){const n=this;let r,s=0,o=0,c=0,l=0;const u=[0],a=[0],w=new pt;let h=0,d=new f(4320);const p=new dt;n.ae=0,n.ue=0,n.he=new i(e),n.end=e,n.read=0,n.write=0,n.reset=(t,e)=>{e&&(e[0]=0),6==s&&w.be(t),s=0,n.ae=0,n.ue=0,n.read=n.write=0},n.reset(t,null),n.pe=(t,e)=>{let r,i,s;return i=t.fe,s=n.read,r=(s>n.write?n.end:n.write)-s,r>t.se&&(r=t.se),0!==r&&-5==e&&(e=0),t.se-=r,t.Zt+=r,t.re.set(n.he.subarray(s,s+r),i),i+=r,s+=r,s==n.end&&(s=0,n.write==n.end&&(n.write=0),r=n.write-s,r>t.se&&(r=t.se),0!==r&&-5==e&&(e=0),t.se-=r,t.Zt+=r,t.re.set(n.he.subarray(s,s+r),i),i+=r,s+=r),t.fe=i,n.read=s,e},n.de=(t,e)=>{let i,f,b,y,k,g,v,m;for(y=t.oe,k=t.Gt,f=n.ue,b=n.ae,g=n.write,v=g<n.read?n.read-g-1:n.end-g;;){let z,S,_,I,C,A,V,E;switch(s){case 0:for(;3>b;){if(0===k)return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);e=0,k--,f|=(255&t.we(y++))<<b,b+=8}switch(i=7&f,h=1&i,i>>>1){case 0:f>>>=3,b-=3,i=7&b,f>>>=i,b-=i,s=1;break;case 1:z=[],S=[],_=[[]],I=[[]],dt.ye(z,S,_,I),w.init(z[0],S[0],_[0],0,I[0],0),f>>>=3,b-=3,s=6;break;case 2:f>>>=3,b-=3,s=3;break;case 3:return f>>>=3,b-=3,s=9,t.Qt="invalid block type",e=-3,n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e)}break;case 1:for(;32>b;){if(0===k)return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);e=0,k--,f|=(255&t.we(y++))<<b,b+=8}if((~f>>>16&65535)!=(65535&f))return s=9,t.Qt="invalid stored block lengths",e=-3,n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);o=65535&f,f=b=0,s=0!==o?2:0!==h?7:0;break;case 2:if(0===k)return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);if(0===v&&(g==n.end&&0!==n.read&&(g=0,v=g<n.read?n.read-g-1:n.end-g),0===v&&(n.write=g,e=n.pe(t,e),g=n.write,v=g<n.read?n.read-g-1:n.end-g,g==n.end&&0!==n.read&&(g=0,v=g<n.read?n.read-g-1:n.end-g),0===v)))return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);if(e=0,i=o,i>k&&(i=k),i>v&&(i=v),n.he.set(t.Jt(y,i),g),y+=i,k-=i,g+=i,v-=i,0!=(o-=i))break;s=0!==h?7:0;break;case 3:for(;14>b;){if(0===k)return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);e=0,k--,f|=(255&t.we(y++))<<b,b+=8}if(c=i=16383&f,(31&i)>29||(i>>5&31)>29)return s=9,t.Qt="too many length or distance symbols",e=-3,n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);if(i=258+(31&i)+(i>>5&31),!r||r.length<i)r=[];else for(m=0;i>m;m++)r[m]=0;f>>>=14,b-=14,l=0,s=4;case 4:for(;4+(c>>>10)>l;){for(;3>b;){if(0===k)return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);e=0,k--,f|=(255&t.we(y++))<<b,b+=8}r[bt[l++]]=7&f,f>>>=3,b-=3}for(;19>l;)r[bt[l++]]=0;if(u[0]=7,i=p.ce(r,u,a,d,t),0!=i)return-3==(e=i)&&(r=null,s=9),n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);l=0,s=5;case 5:for(;i=c,258+(31&i)+(i>>5&31)>l;){let o,w;for(i=u[0];i>b;){if(0===k)return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);e=0,k--,f|=(255&t.we(y++))<<b,b+=8}if(i=d[3*(a[0]+(f&ft[i]))+1],w=d[3*(a[0]+(f&ft[i]))+2],16>w)f>>>=i,b-=i,r[l++]=w;else{for(m=18==w?7:w-14,o=18==w?11:3;i+m>b;){if(0===k)return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);e=0,k--,f|=(255&t.we(y++))<<b,b+=8}if(f>>>=i,b-=i,o+=f&ft[m],f>>>=m,b-=m,m=l,i=c,m+o>258+(31&i)+(i>>5&31)||16==w&&1>m)return r=null,s=9,t.Qt="invalid bit length repeat",e=-3,n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);w=16==w?r[m-1]:0;do{r[m++]=w}while(0!=--o);l=m}}if(a[0]=-1,C=[],A=[],V=[],E=[],C[0]=9,A[0]=6,i=c,i=p.le(257+(31&i),1+(i>>5&31),r,C,A,V,E,d,t),0!=i)return-3==i&&(r=null,s=9),e=i,n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);w.init(C[0],A[0],d,V[0],d,E[0]),s=6;case 6:if(n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,1!=(e=w.de(n,t,e)))return n.pe(t,e);if(e=0,w.be(t),y=t.oe,k=t.Gt,f=n.ue,b=n.ae,g=n.write,v=g<n.read?n.read-g-1:n.end-g,0===h){s=0;break}s=7;case 7:if(n.write=g,e=n.pe(t,e),g=n.write,v=g<n.read?n.read-g-1:n.end-g,n.read!=n.write)return n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);s=8;case 8:return e=1,n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);case 9:return e=-3,n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e);default:return e=-2,n.ue=f,n.ae=b,t.Gt=k,t.Yt+=y-t.oe,t.oe=y,n.write=g,n.pe(t,e)}}},n.be=t=>{n.reset(t,null),n.he=null,d=null},n.ke=(t,e,r)=>{n.he.set(t.subarray(e,e+r),0),n.read=n.write=r},n.ge=()=>1==s?1:0}const kt=[0,0,255,255];function gt(){const t=this;function e(t){return t&&t.ve?(t.Yt=t.Zt=0,t.Qt=null,t.ve.mode=7,t.ve.me.reset(t,null),0):-2}t.mode=0,t.method=0,t.ze=[0],t.Se=0,t.marker=0,t._e=0,t.Ie=e=>(t.me&&t.me.be(e),t.me=null,0),t.Ce=(n,r)=>(n.Qt=null,t.me=null,8>r||r>15?(t.Ie(n),-2):(t._e=r,n.ve.me=new yt(n,1<<r),e(n),0)),t.nt=(t,e)=>{let n,r;if(!t||!t.ve||!t.ie)return-2;const i=t.ve;for(e=4==e?-5:0,n=-5;;)switch(i.mode){case 0:if(0===t.Gt)return n;if(n=e,t.Gt--,t.Yt++,8!=(15&(i.method=t.we(t.oe++)))){i.mode=13,t.Qt="unknown compression method",i.marker=5;break}if(8+(i.method>>4)>i._e){i.mode=13,t.Qt="invalid win size",i.marker=5;break}i.mode=1;case 1:if(0===t.Gt)return n;if(n=e,t.Gt--,t.Yt++,r=255&t.we(t.oe++),((i.method<<8)+r)%31!=0){i.mode=13,t.Qt="incorrect header check",i.marker=5;break}if(0==(32&r)){i.mode=7;break}i.mode=2;case 2:if(0===t.Gt)return n;n=e,t.Gt--,t.Yt++,i.Se=(255&t.we(t.oe++))<<24&4278190080,i.mode=3;case 3:if(0===t.Gt)return n;n=e,t.Gt--,t.Yt++,i.Se+=(255&t.we(t.oe++))<<16&16711680,i.mode=4;case 4:if(0===t.Gt)return n;n=e,t.Gt--,t.Yt++,i.Se+=(255&t.we(t.oe++))<<8&65280,i.mode=5;case 5:return 0===t.Gt?n:(n=e,t.Gt--,t.Yt++,i.Se+=255&t.we(t.oe++),i.mode=6,2);case 6:return i.mode=13,t.Qt="need dictionary",i.marker=0,-2;case 7:if(n=i.me.de(t,n),-3==n){i.mode=13,i.marker=0;break}if(0==n&&(n=e),1!=n)return n;n=e,i.me.reset(t,i.ze),i.mode=12;case 12:return t.Gt=0,1;case 13:return-3;default:return-2}},t.Ae=(t,e,n)=>{let r=0,i=n;if(!t||!t.ve||6!=t.ve.mode)return-2;const s=t.ve;return i<1<<s._e||(i=(1<<s._e)-1,r=n-i),s.me.ke(e,r,i),s.mode=7,0},t.Ve=t=>{let n,r,i,s,o;if(!t||!t.ve)return-2;const f=t.ve;if(13!=f.mode&&(f.mode=13,f.marker=0),0===(n=t.Gt))return-5;for(r=t.oe,i=f.marker;0!==n&&4>i;)t.we(r)==kt[i]?i++:i=0!==t.we(r)?0:4-i,r++,n--;return t.Yt+=r-t.oe,t.oe=r,t.Gt=n,f.marker=i,4!=i?-3:(s=t.Yt,o=t.Zt,e(t),t.Yt=s,t.Zt=o,f.mode=7,0)},t.Ee=t=>t&&t.ve&&t.ve.me?t.ve.me.ge():-2}function vt(){}function mt(t){const e=new vt,s=t&&t.et?n.floor(2*t.et):131072,o=new i(s);let f=!1;e.Ce(),e.re=o,this.append=(t,n)=>{const c=[];let l,u,a=0,w=0,h=0;if(0!==t.length){e.oe=0,e.ie=t,e.Gt=t.length;do{if(e.fe=0,e.se=s,0!==e.Gt||f||(e.oe=0,f=!0),l=e.nt(0),f&&-5===l){if(0!==e.Gt)throw new r("inflating: bad input")}else if(0!==l&&1!==l)throw new r("inflating: "+e.Qt);if((f||1===l)&&e.Gt===t.length)throw new r("inflating: bad input");e.fe&&(e.fe===s?c.push(new i(o)):c.push(o.slice(0,e.fe))),h+=e.fe,n&&e.oe>0&&e.oe!=a&&(n(e.oe),a=e.oe)}while(e.Gt>0||0===e.se);return c.length>1?(u=new i(h),c.forEach((t=>{u.set(t,w),w+=t.length}))):u=c[0]||new i(0),u}},this.flush=()=>{e.Ie()}}vt.prototype={Ce:function(t){const e=this;return e.ve=new gt,t||(t=15),e.ve.Ce(e,t)},nt:function(t){const e=this;return e.ve?e.ve.nt(e,t):-2},Ie:function(){const t=this;if(!t.ve)return-2;const e=t.ve.Ie(t);return t.ve=null,e},Ve:function(){const t=this;return t.ve?t.ve.Ve(t):-2},Ae:function(t,e){const n=this;return n.ve?n.ve.Ae(n,t,e):-2},we:function(t){return this.ie[t]},Jt:function(t,e){return this.ie.subarray(t,t+e)}},self.initCodec=()=>{self.Deflate=ot,self.Inflate=mt};\n'],{type:"text/javascript"}));t({workerScripts:{inflate:[e],deflate:[e]}});}};

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
			let url, scriptUrl;
			url = workerData.scripts[0];
			if (typeof url == "function") {
				url = url();
			}
			try {
				scriptUrl = new URL(url, baseURL);
			} catch (error) {
				scriptUrl = url;
			}
			return new Worker(scriptUrl, options);
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

	/* global Blob, FileReader, atob, btoa, XMLHttpRequest, document, fetch */

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
