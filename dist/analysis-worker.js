// SPDX-License-Identifier: Apache-2.0
import{analyze,selfTest}from'./dsp.js';self.onmessage=e=>{try{if(e.data.type==='test'){postMessage({id:e.data.id,tests:selfTest()});return;}const r=e.data;postMessage({id:r.id,result:analyze(new Float32Array(r.pcm),r.sr,r.low,r.high,r.duration,r.start)});}catch(err){postMessage({id:e.data.id,error:err.message});}};
