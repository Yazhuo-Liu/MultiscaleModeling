import type {Simulation, SimulationFrame} from '../types';
import {countSteps, parameter} from './utils';

/** Gaussian trial density, a variational teaching model, not a Kohn–Sham solver. */
export function createDensitySimulation(initial: Record<string, number>): Simulation {
 let params = initial, z = 1, alpha = 0.3, iteration = 0;
 const energy = () => 1.5 * alpha - 2 * z * Math.sqrt(2 * alpha / Math.PI);
 const frame = (): SimulationFrame => ({
  time: iteration,
  curves: [{name: '径向概率 4πr²n(r)（a₀⁻¹）', points: Array.from({length: 100}, (_,i) => {const r = i * .04; return [r, 4*Math.PI*r*r*Math.pow(2*alpha/Math.PI,1.5)*Math.exp(-2*alpha*r*r)];})}],
  metrics: [{label:'变分能量',value:energy(),unit:'Ha'},{label:'高斯指数 α',value:alpha,unit:'a₀⁻²'}, {label:'迭代次数',value:iteration}, {label:'精确氢样能量（比较）',value:-z*z/2,unit:'Ha'}],
 });
 const reset = (p = params) => {params=p;z=parameter(p,'charge',1,1,3);alpha=parameter(p,'exponent',.3,.1,3);iteration=0;return frame();};
 reset();
 return {reset,step(n=1) {for(let i=0;i<countSteps(n);i++) {const derivative=1.5-z*Math.sqrt(2/Math.PI)/Math.sqrt(alpha); let rate=.08; const current=energy(); for(let k=0;k<20;k++){const proposed=Math.max(.001,alpha-rate*derivative);const proposedEnergy=1.5*proposed-2*z*Math.sqrt(2*proposed/Math.PI);if(proposedEnergy<=current+1e-14){alpha=proposed;break;}rate*=.5;}iteration++;}return frame();}};
}

/** Restricted two-site Hubbard mean field: one occupied orbital, opposite-spin interaction U. */
export function createHartreeFockSimulation(initial: Record<string, number>): Simulation {
 let params=initial, interaction=2,bias=1,nA=1,iteration=0,residual=0;
 let history:[number,number][]=[];
 const solve = () => {const a=-bias/2+interaction*nA/2,d=bias/2+interaction*(2-nA)/2;return 1-(a-d)/Math.sqrt((a-d)**2+4);};
 const frame = ():SimulationFrame => {
 const nB=2-nA, kinetic=-2*Math.sqrt(nA*nB), energy=kinetic+bias*(nB-nA)/2+interaction*(nA*nA+nB*nB)/4;
 return {time:iteration, points:[{x:-1,y:0,z:0,value:nA,radius:.12+nA*.15},{x:1,y:0,z:0,value:nB,radius:.12+nB*.15}],edges:[[0,1]],curves:[{name:'A 位点电子占据数',points:[...history]}],metrics:[{label:'A 位点占据',value:nA},{label:'B 位点占据',value:nB},{label:'平均场能量',value:energy,unit:'t'},{label:'自洽残差',value:residual}]};};
 const reset=(p=params)=>{params=p;interaction=parameter(p,'interaction',2,0,4);bias=parameter(p,'bias',1,0,3);nA=1;iteration=0;residual=Math.abs(solve()-nA);history=[[0,nA]];return frame();};reset();
 return {reset,step(n=1){for(let i=0;i<countSteps(n);i++){const target=solve();nA=.75*nA+.25*target;residual=Math.abs(solve()-nA);iteration++;history.push([iteration,nA]);if(history.length>240)history.shift();}return frame();}};
}
