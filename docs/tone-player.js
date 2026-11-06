// SPDX-License-Identifier: Apache-2.0
export const toneFrequency=(value,sampleRate=48000)=>Math.max(20,Math.min(20000,sampleRate/2-1,Math.round(Number(value)||5413)));
export const toneLevel=value=>Math.max(-60,Math.min(-18,Number.isFinite(Number(value))?Number(value):-36));

// A low-level sine tone with ramped gain and an audio-clock stop. No recording,
// network, device-permission or persistent-storage access is used here.
export class TonePlayer {
  constructor(Context,onChange=()=>{}){this.Context=Context;this.onChange=onChange;this.session=null;this.stopping=null;this.stoppingSession=null;}
  get active(){return !!(this.session||this.stopping);}
  setFrequency(value){const s=this.session;if(!s)return toneFrequency(value);const f=toneFrequency(value,s.context.sampleRate);s.osc.frequency.setTargetAtTime(f,s.context.currentTime,.025);return f;}
  setLevel(value){const level=toneLevel(value),s=this.session;if(!s)return level;s.level=level;if(!s.started)return level;const now=s.context.currentTime,param=s.gain.gain,target=10**(level/20);param.cancelScheduledValues(now);param.setValueAtTime(param.value,now);if(now>=s.endAt-.08){param.linearRampToValueAtTime(0,Math.max(now+.005,s.endAt));return level;}param.linearRampToValueAtTime(target,Math.min(now+.06,s.endAt-.08));if(now<s.endAt-.08)param.setValueAtTime(target,s.endAt-.08);param.linearRampToValueAtTime(0,s.endAt);return level;}
  async start(frequency,level=-36){
    if(this.active)return;
    const context=new this.Context(),osc=context.createOscillator(),gain=context.createGain();
    const s={context,osc,gain,started:false,timer:null,endAt:Infinity};this.session=s;
    osc.type='sine';osc.frequency.value=toneFrequency(frequency,context.sampleRate);gain.gain.value=0;osc.connect(gain);gain.connect(context.destination);
    osc.onended=()=>this.finish(s);
    try{await context.resume();if(this.session!==s)return;const now=context.currentTime;s.started=true;s.endAt=now+15;osc.start(now);this.setLevel(s.level??level);osc.stop(s.endAt);s.timer=setTimeout(()=>this.stop(),15100);this.onChange(true);return osc.frequency.value;}
    catch(error){const current=this.session===s;this.finish(s);if(current)throw error;}
  }
  finish(s){if(s.finished)return;s.finished=true;if(s.timer)clearTimeout(s.timer);s.osc.disconnect();s.gain.disconnect();s.context.close().catch(()=>{});if(this.session===s){this.session=null;this.onChange(false);}}
  async stop(immediate=false){
    if(this.stopping){if(immediate&&this.stoppingSession)this.finish(this.stoppingSession);return this.stopping;}
    const s=this.session;if(!s)return;this.session=null;this.stoppingSession=s;if(s.timer)clearTimeout(s.timer);
    this.stopping=(async()=>{
      if(s.started&&!immediate){const now=s.context.currentTime,end=Math.min(s.endAt,now+.06);s.gain.gain.cancelScheduledValues(now);s.gain.gain.setValueAtTime(s.gain.gain.value,now);s.gain.gain.linearRampToValueAtTime(0,Math.max(now,end));try{s.osc.stop(Math.min(s.endAt,now+.065));}catch{}await new Promise(resolve=>setTimeout(resolve,80));}
      this.finish(s);
    })();
    try{await this.stopping;}finally{this.stopping=null;this.stoppingSession=null;this.onChange(this.active);}
  }
}
