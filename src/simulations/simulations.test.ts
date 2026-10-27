import test from 'node:test';
import assert from 'node:assert/strict';
import {createSimulation,simulationDefinitions} from './index';
import {solveAxialBar,heatStep} from './continuum';
import type {MethodId,SimulationFrame} from '../types';
const metric=(frame:SimulationFrame,label:string)=>{const item=frame.metrics.find(m=>m.label===label);assert.ok(item,`missing metric: ${label}`);return item.value;};
const close=(actual:number,expected:number,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} != ${expected}`);
function assertFinite(value:unknown):void {if(typeof value==='number'){assert.ok(Number.isFinite(value),`nonfinite value ${value}`);}else if(value&&typeof value==='object'){for(const item of Object.values(value))assertFinite(item);}}
for(const id of Object.keys(simulationDefinitions) as MethodId[]){
 test(`${id}: deterministic reset and finite states at all control corners`,()=>{
 const definition=simulationDefinitions[id];
 const sim=createSimulation(id);const initial=sim.reset();sim.step(8);assert.deepEqual(sim.reset(),initial);
 for(let mask=0;mask<(1<<definition.controls.length);mask++){
 const parameters=Object.fromEntries(definition.controls.map((c,i)=>[c.key,(mask>>i)&1?c.max:c.min]));
 const model=createSimulation(id,parameters);assertFinite(model.reset());for(let batch=0;batch<5;batch++)assertFinite(model.step(30));
 }
 });
}
test('Gaussian density: variational energy descends to analytic Gaussian minimum above exact hydrogen energy',()=>{
 for(const charge of [1,2,3]){const sim=createSimulation('dft',{charge,exponent:.1});let previous=metric(sim.reset(),'变分能量');for(let i=0;i<100;i++){const frame=sim.step(5),energy=metric(frame,'变分能量');assert.ok(energy<=previous+1e-12);assert.ok(energy>=-charge*charge/2);previous=energy;}close(previous,-4*charge*charge/(3*Math.PI),1e-7);}
});
test('two-site restricted HF: occupations conserve two electrons and SCF converges',()=>{
 for(const interaction of [0,2,4])for(const bias of [0,1,3]){const sim=createSimulation('hf',{interaction,bias});const frame=sim.step(100);close(metric(frame,'A 位点占据')+metric(frame,'B 位点占据'),2);assert.ok(metric(frame,'自洽残差')<1e-7);if(bias===0)close(metric(frame,'A 位点占据'),1);}
});
test('Lennard–Jones velocity Verlet approximately conserves energy and particle count',()=>{
 const sim=createSimulation('md');const first=sim.reset(),energy=metric(first,'总能量 / 粒子');let last=first;for(let i=0;i<10;i++)last=sim.step(100);assert.equal(last.points?.length,36);assert.ok(Math.abs(metric(last,'总能量 / 粒子')-energy)<.005);assert.ok(metric(last,'约化温度')>0);
});
test('Ising: positive field orders a cold lattice; spins remain ±1',()=>{
 const sim=createSimulation('mc',{temperature:.5,field:1});const frame=sim.step(100);assert.ok(metric(frame,'平均磁化强度')>.95);assert.ok(frame.grid?.values.every(x=>Math.abs(x)===1));
});
test('pinned line: endpoints fixed and bowing approaches line-tension equilibrium',()=>{
 const sim=createSimulation('dd',{stress:1,tension:1});let frame=sim.reset();for(let k=0;k<20;k++)frame=sim.step(100);assert.equal(frame.points?.[0].y,0);assert.equal(frame.points?.at(-1)?.y,0);close(metric(frame,'最大弓出量'),.125,1e-8);
});
test('KMC: hotter temperature advances the same deterministic hops in less physical time',()=>{
 const cold=createSimulation('kmc',{temperature:300}).step(100),hot=createSimulation('kmc',{temperature:1200}).step(100);assert.ok(cold.time>hot.time);assert.ok(hot.time>0);assert.equal(metric(cold,'空位跳跃数'),100);assert.equal(metric(cold,'单轨迹位移平方'),metric(hot,'单轨迹位移平方'));
});
test('Allen–Cahn: discrete free energy decreases for stable Euler stepping',()=>{
 const sim=createSimulation('phase-field');let previous=metric(sim.reset(),'平均自由能');for(let i=0;i<100;i++){const frame=sim.step(5),energy=metric(frame,'平均自由能');assert.ok(energy<=previous+1e-10);assert.ok(frame.grid?.values.every(v=>v>=-1&&v<=1));previous=energy;}
});
test('Schmid factors: no activation below threshold and partial activation at 120 MPa',()=>{
 const low=createSimulation('crystal-plasticity',{stress:10,strength:40}).step(50);assert.equal(metric(low,'达到滑移阈值的晶粒'),0);const high=createSimulation('crystal-plasticity',{stress:120,strength:40}).step(50);const active=metric(high,'达到滑移阈值的晶粒');assert.ok(active>0&&active<36);
});
test('Maxwell stress falls to 1/e after one relaxation time',()=>{
 const sim=createSimulation('constitutive',{modulus:100,relaxation:2});const initial=metric(sim.reset(),'应力 σ');const frame=sim.step(50);close(metric(frame,'应力 σ'),initial/Math.E);
});
test('assembled FEM reproduces analytical axial bar displacement for multiple meshes and parameters',()=>{
 for(const elements of [2,5,20])for(const force of [0,50,100])for(const modulus of [50e9,100e9,250e9]){const u=solveAxialBar(force,modulus,elements);u.forEach((value,i)=>close(value,force*(i/elements)/(modulus*1e-4),1e-14));}
});
test('heat equation obeys maximum principle, zero boundary, and loses heat through boundary',()=>{
 for(const diffusivity of [.1,.5,1]){const sim=createSimulation('fdm',{diffusivity});const first=sim.reset();let max=metric(first,'最高温度 T*'),heat=metric(first,'总热量 ∫T* dA*');for(let i=0;i<30;i++){const frame=sim.step(40);assert.ok(frame.grid?.values.every(x=>x>=0&&x<=max+1e-12));max=metric(frame,'最高温度 T*');const next=metric(frame,'总热量 ∫T* dA*');assert.ok(next<=heat+1e-12);heat=next;assert.equal(frame.grid?.values[0],0);}}
 assert.throws(()=>heatStep(Array(16).fill(1),4,.3),RangeError);
});
