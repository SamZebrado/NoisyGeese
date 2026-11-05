// SPDX-License-Identifier: Apache-2.0
// Display-only helpers. Never modify the FFT input, PCM, or comparison values.
export function bandValues(data,sr,fftSize,low,high){
  const step=sr/fftSize,first=Math.max(0,Math.ceil(low/step)),last=Math.min(data.length-1,Math.floor(high/step));
  const values=[];for(let k=first;k<=last;k++)if(Number.isFinite(data[k]))values.push(data[k]);return values;
}
export function fitColorRange(values){
  const finite=values.filter(Number.isFinite).sort((a,b)=>a-b);if(!finite.length)return null;
  const peak=finite.at(-1),floor=finite[Math.floor((finite.length-1)*.1)];
  const max=Math.max(-130,Math.min(0,Math.ceil((peak+3)/5)*5));
  const min=Math.max(-160,Math.min(max-20,Math.max(max-80,Math.floor((floor-3)/5)*5)));
  return{min,max};
}
export function displayLevel(value,min,max){return Number.isFinite(value)?Math.max(0,Math.min(1,(value-min)/(max-min))):0;}
export function pixelPeak(data,sr,fftSize,low,high){
  // A logarithmic display pixel may span many FFT bins. Preserve narrow peaks
  // instead of sampling one bin and silently skipping high-frequency tones.
  const step=sr/fftSize;if(low>sr/2||high<0)return-Infinity;
  const first=Math.max(0,Math.ceil(low/step)),last=Math.min(data.length-1,Math.floor(high/step));
  if(first>last){const k=Math.min(data.length-1,Math.max(0,Math.round((low+high)/2/step)));return data[k]??-Infinity;}
  let peak=-Infinity;for(let k=first;k<=last;k++)if(data[k]>peak)peak=data[k];return peak;
}
