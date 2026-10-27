import type {Simulation,SimulationFrame,Point3} from '../types';
import {countSteps,parameter,randomGenerator} from './utils';
export function createMolecularDynamics(initial:Record<string,number>):Simulation {
 const N=36,dt=.002, cutoff=2.5, cutoffEnergy=4*((1/cutoff)**12-(1/cutoff)**6);
 let params=initial,box=8,time=0,positions:Point3[]=[],velocities:number[][]=[],forces:number[][]=[],potential=0;
 const calculateForces=()=>{forces=Array.from({length:N},()=>[0,0]);potential=0;
 for(let i=0;i<N;i++)for(let j=i+1;j<N;j++) {let dx=positions[j].x-positions[i].x,dy=positions[j].y-positions[i].y;dx-=box*Math.round(dx/box);dy-=box*Math.round(dy/box);const r2=dx*dx+dy*dy;if(r2>=cutoff*cutoff)continue;const inverse=1/Math.max(r2,1e-8),r6=inverse**3;const force=-24*inverse*(2*r6*r6-r6);forces[i][0]+=force*dx;forces[i][1]+=force*dy;forces[j][0]-=force*dx;forces[j][1]-=force*dy;potential+=4*(r6*r6-r6)-cutoffEnergy;
 }};
 const kinetic=()=>velocities.reduce((sum,v)=>sum+(v[0]*v[0]+v[1]*v[1])/2,0);
 const frame=():SimulationFrame=>({time,points:positions.map(p=>({...p,radius:.23})),metrics:[{label:'约化温度',value:kinetic()/(N-1),unit:'ε/kB'},{label:'总能量 / 粒子',value:(kinetic()+potential)/N,unit:'ε'},{label:'粒子数',value:N},{label:'模拟时间',value:time,unit:'τLJ'}]});
 const reset=(p=params)=>{params=p;time=0;const density=parameter(p,'density',.6,.3,.8),temperature=parameter(p,'temperature',.5,.1,1.5);box=Math.sqrt(N/density);const rng=randomGenerator();positions=Array.from({length:N},(_,i)=>({x:((i%6)+.5)*box/6-box/2,y:(Math.floor(i/6)+.5)*box/6-box/2,z:0}));velocities=Array.from({length:N},()=>[(rng()-.5),(rng()-.5)]);for(let d=0;d<2;d++){const mean=velocities.reduce((s,v)=>s+v[d],0)/N;velocities.forEach(v=>v[d]-=mean);}const scale=Math.sqrt((N-1)*temperature/kinetic());velocities.forEach(v=>{v[0]*=scale;v[1]*=scale;});calculateForces();return frame();};reset();
 return {reset,step(n=1){for(let k=0;k<countSteps(n);k++){for(let i=0;i<N;i++){velocities[i][0]+=.5*dt*forces[i][0];velocities[i][1]+=.5*dt*forces[i][1];positions[i].x+=dt*velocities[i][0];positions[i].y+=dt*velocities[i][1];positions[i].x-=box*Math.floor((positions[i].x+box/2)/box);positions[i].y-=box*Math.floor((positions[i].y+box/2)/box);}calculateForces();for(let i=0;i<N;i++){velocities[i][0]+=.5*dt*forces[i][0];velocities[i][1]+=.5*dt*forces[i][1];}time+=dt;}return frame();}};
}
export function createMonteCarlo(initial:Record<string,number>):Simulation {
 const size=32,N=size*size;let params=initial,temperature=2.2,field=0,spins:number[]=[],sweeps=0,accepted=0,rng=randomGenerator();
 const neighbors=(i:number)=>spins[(i+size)%N]+spins[(i-size+N)%N]+spins[Math.floor(i/size)*size+(i+1)%size]+spins[Math.floor(i/size)*size+(i+size-1)%size];
 const frame=():SimulationFrame=>({time:sweeps,grid:{width:size,height:size,values:[...spins]},metrics:[{label:'平均磁化强度',value:spins.reduce((a,b)=>a+b,0)/N},{label:'能量 / 自旋',value:spins.reduce((s,x,i)=>s-x*neighbors(i)/2-field*x,0)/N,unit:'J'},{label:'蒙特卡洛扫描',value:sweeps},{label:'接受比例',value:accepted}]});
 const reset=(p=params)=>{params=p;temperature=parameter(p,'temperature',2.2,.5,4);field=parameter(p,'field',0,-1,1);sweeps=0;accepted=0;rng=randomGenerator();spins=Array.from({length:N},()=>rng()<.5?-1:1);return frame();};reset();
 return {reset,step(n=1){for(let k=0;k<countSteps(n);k++){let accept=0;for(let j=0;j<N;j++){const i=Math.floor(rng()*N),delta=2*spins[i]*(neighbors(i)+field);if(delta<=0||rng()<Math.exp(-delta/temperature)){spins[i]*=-1;accept++;}}accepted=accept/N;sweeps++;}return frame();}};
}
