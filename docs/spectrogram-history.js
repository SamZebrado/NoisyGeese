// SPDX-License-Identifier: Apache-2.0
import {pixelPeak,displayLevel} from './display-scale.js';

// Keep intensity data, not only canvas pixels. Resizes and color changes can
// repaint the same history without clearing or starting a new sweep.
export class SpectrogramHistory {
  constructor({seconds=12,columns=240,rows=256}={}) {
    this.seconds=seconds;this.columns=columns;this.rows=rows;this.frames=[];this.time=0;
  }
  append(data,sampleRate,fftSize,dt=.05) {
    this.time+=Math.max(0,Number.isFinite(dt)?dt:.05);
    const values=new Float32Array(this.rows);
    for(let y=0;y<this.rows;y++) values[y]=pixelPeak(data,sampleRate,fftSize,20*1000**(1-(y+1)/this.rows),20*1000**(1-y/this.rows));
    this.frames.push({time:this.time,values});
    while(this.frames.length>1&&this.frames[1].time<=this.time-this.seconds)this.frames.shift();
    // Also bound memory if an unusual animation clock produces tiny intervals.
    if(this.frames.length>600)this.frames.splice(0,this.frames.length-600);
  }
  pixels(min,max) {
    const out=new Uint8ClampedArray(this.columns*this.rows*4);
    const stops=[[11,27,23],[28,73,56],[73,137,96],[176,206,139],[255,212,139]];
    const palette=Array.from({length:256},(_,i)=>{const q=i/255*4,k=Math.min(3,Math.floor(q)),t=q-k;return stops[k].map((v,j)=>Math.round(v+(stops[k+1][j]-v)*t));});
    for(let p=0;p<out.length;p+=4){out[p]=11;out[p+1]=27;out[p+2]=23;out[p+3]=255;}
    const start=this.time-this.seconds;
    for(let i=0;i<this.frames.length;i++) {
      const frame=this.frames[i],previous=i?this.frames[i-1].time:frame.time-.05;
      // A throttled/background tab has no FFT frames for the missing time.
      // Leave that gap blank instead of stretching the last observed signal.
      const left=frame.time-previous>.15?frame.time-.05:previous;
      const x1=Math.max(0,Math.floor((left-start)/this.seconds*this.columns));
      const x2=Math.min(this.columns,Math.ceil((frame.time-start)/this.seconds*this.columns));
      for(let y=0;y<this.rows;y++) {
        const rgb=palette[Math.round(displayLevel(frame.values[y],min,max)*255)];
        for(let x=x1;x<x2;x++){const p=(y*this.columns+x)*4;out[p]=rgb[0];out[p+1]=rgb[1];out[p+2]=rgb[2];}
      }
    }
    return out;
  }
}

export function playbackPosition(playback,now) {
  const elapsed=playback.offset+(playback.paused?0:Math.max(0,now-playback.startedAt));
  return playback.loop?elapsed%playback.duration:Math.min(playback.duration,elapsed);
}
