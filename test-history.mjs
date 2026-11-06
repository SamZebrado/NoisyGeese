import assert from 'node:assert/strict';
import {SpectrogramHistory,playbackPosition} from './dist/spectrogram-history.js';
const history=new SpectrogramHistory(),data=new Float32Array(4096).fill(-100);data[27]=-30;
for(let i=0;i<900;i++)history.append(data,48000,8192,.05);
assert(history.time>44.9);assert(history.frames.length>=239&&history.frames.length<=242);
const before=history.frames.map(f=>({time:f.time,values:f.values.slice()}));
const defaultPixels=history.pixels(-100,-25),fitted=history.pixels(-110,-40);
assert.notDeepEqual(defaultPixels,fitted);assert.deepEqual(history.frames,before);
assert.equal(defaultPixels.length,240*256*4);assert(defaultPixels.some((v,i)=>i%4!==3&&v>30));
for(let y=0;y<256;y++)assert.equal(defaultPixels[(y*240+239)*4+3],255);
assert.deepEqual(data,new Float32Array(4096).fill(-100).map((v,i)=>i===27?-30:v));
const rawFrame=history.frames.at(-1).values.slice();history.pixels(-160,0);history.pixels(-100,-25);assert.deepEqual(history.frames.at(-1).values,rawFrame);
const p={offset:2,startedAt:10,duration:5,loop:true,paused:false};
assert.equal(playbackPosition(p,13),0);assert.equal(playbackPosition(p,24),1);assert.equal(playbackPosition({...p,paused:true},24),2);assert.equal(playbackPosition({...p,loop:false},24),5);
const single=new SpectrogramHistory();single.append(data,44100,8192,.05);assert(single.pixels(-100,-25).some((v,i)=>i%4!==3&&v>30));
const silent=new SpectrogramHistory();silent.append(new Float32Array(4096).fill(-Infinity),48000,8192);assert.deepEqual(silent.pixels(-100,-25).slice(-4),new Uint8ClampedArray([11,27,23,255]));
console.log('PASS: 45-second rolling history, bounded memory, recoloring without resets, PCM immutability, transparent-free raster, 44.1 kHz input, silence, looping/pause/end clocks.');

const gap=new SpectrogramHistory();for(let i=0;i<60;i++)gap.append(data,48000,8192,.05);const gapStart=gap.time;gap.append(data,48000,8192,4);assert.equal(gap.time,gapStart+4);const gapPixels=gap.pixels(-100,-25);for(let y=0;y<256;y++)assert.deepEqual(gapPixels.slice((y*240+200)*4,(y*240+200)*4+4),new Uint8ClampedArray([11,27,23,255]));console.log('PASS: a four-second background gap advances the real timeline without inventing FFT frames.');
