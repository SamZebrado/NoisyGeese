import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {SpectrogramHistory,playbackPosition} from './dist/spectrogram-history.js';
const elements=new Map();function $(id){if(!elements.has(id))elements.set(id,{dataset:{},textContent:'',checked:id==='replayLoop',hidden:true,value:0,classList:{add(){},toggle(){}},scrollIntoView(){}});return elements.get(id);}
const contexts=[];
class FakeAudioContext {
 constructor({sampleRate}={}){this.sampleRate=sampleRate||48000;this.currentTime=0;this.sources=[];this.destination={};this.closed=false;contexts.push(this);}
 createBuffer(channels,length,sr){return{length,sampleRate:sr,copyToChannel(pcm){assert.equal(pcm.length,length);}};}
 createAnalyser(){return{connect(){},disconnect(){},frequencyBinCount:4096};}
 createGain(){return{gain:{value:0},connect(){},disconnect(){}};}
 createBufferSource(){const s={connect(){},disconnect(){},start(_,offset){this.offset=offset;this.active=true;},stop(){this.active=false;}};this.sources.push(s);return s;}
 resume(){return Promise.resolve();}close(){this.closed=true;return Promise.resolve();}
}
const state={playing:null,mic:null,analyser:null,demo:false,recording:null};let notices=[];
const env={tonePlayer:{async stop(){}},window:{AudioContext:FakeAudioContext},state,$,SpectrogramHistory,playbackPosition,Float32Array,tr:(zh,en)=>zh,notice:t=>notices.push(t),drawSpectrum(){},paintWaterfall(){},renderRecords(){},queueColorFit(){},requestAnimationFrame(){return 1;},console};
vm.createContext(env);const app=readFileSync('dist/app.js','utf8');const a=app.indexOf('function replayText('),b=app.indexOf('async function compare()',a);
vm.runInContext('let freqData=null,colorFit=null,frameId=0,lastDraw=0;function drawLive(){};'+app.slice(a,b)+'\nthis.playRecord=playRecord;this.stopPlayback=stopPlayback;',env);
const rec=id=>({id,label:id,sampleRate:48000,pcm:new Float32Array(480000).buffer});
await env.playRecord(rec('a'));const p=state.playing;assert.equal(p.gain.gain.value,0);assert(p.loop);assert(p.source.active);assert(!p.paused);
p.context.currentTime=3;await $('replayPause').onclick();assert(p.paused);assert.equal(p.offset,3);assert(!p.source.active);
p.context.currentTime=8;await $('replayPause').onclick();assert(!p.paused);assert.equal(p.source.offset,3);assert.equal(p.context.sources.filter(s=>s.active).length,1);
p.context.currentTime=10;$('replayLoop').onchange({target:{checked:false}});assert(!p.loop);assert.equal(p.offset,5);assert(!p.source.loop);
const old=p.source;await env.playRecord(rec('b'),true);assert(p.context.closed);assert.equal(state.playing.id,'b');assert.equal(state.playing.gain.gain.value,1);old.onended();assert.equal(state.playing.id,'b');
const q=state.playing;$('replaySound').onchange({target:{checked:false}});assert.equal(q.gain.gain.value,0);
$('replayPause').onclick();$('replaySeek').oninput({target:{value:'7'}});assert(q.paused);assert.equal(q.offset,7);assert.equal(q.history.frames.length,0);
await $('replayPause').onclick();assert.equal(q.source.offset,7);$('replayRestart').onclick();assert.equal(q.source.offset,0);assert.equal(q.context.sources.filter(s=>s.active).length,1);
state.recording={};await env.playRecord(rec('c'));assert.equal(state.playing.id,'b');assert(notices.at(-1).includes('先结束录制'));state.recording=null;
env.stopPlayback();assert.equal(state.playing,null);assert(q.context.closed);assert($('replayPanel').hidden);assert(contexts.every(c=>c.closed));
// Natural non-looping completion preserves the final graph and permits restart.
$('replayLoop').checked=false;await env.playRecord(rec('d'));const d=state.playing;d.source.active=false;d.source.onended();assert(d.paused);assert.equal(d.offset,10);assert.equal(state.playing.id,'d');await $('replayPause').onclick();assert.equal(d.source.offset,0);env.stopPlayback();
console.log('PASS: isolated replay context, muted default, pause/resume offsets, one live source, loop toggle, stale ended guard, seek/restart, recording lock, natural completion, and cleanup.');
