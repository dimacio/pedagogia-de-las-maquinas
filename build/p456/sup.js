const Cueva=require("/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/load.js");
const {forward,env,OBS}=require('./dqn.js');
const P=Cueva.transiciones(env,0);const {V}=Cueva.iteracionValor(env,{gamma:.95,costo:.01,iters:500});
const Qs=OBS.map((_,s)=>[0,1,2,3].map(a=>{const s2=env.move(s,a)[0];return s===env.goal?0:Cueva.recompensa(env,s2,.01)+.95*(s2===env.goal?0:V[s2])}));
console.log('V range',Math.min(...V),Math.max(...V));
// reuse MLP from dqn.js by eval hack
const src=require('fs').readFileSync('dqn.js','utf8');eval(src.match(/function MLP[^\n]*/)[0]+src.match(/function backward[^\n]*/)[0]+src.match(/function adam[^\n]*/)[0]);
for(const lr of [3e-3,1e-2])for(let sd=1;sd<=4;sd++){const R=Cueva.rng(sd);const net=MLP([6,32,32,4],R);const t0=Date.now();let ep;let ok=-1;
 for(ep=1;ep<=3000;ep++){let loss=0;for(let s=0;s<env.nS;s++){if(s===env.goal)continue;const acts=forward(net,OBS[s],true),q=acts[3],g=new Float64Array(4);for(let a=0;a<4;a++){g[a]=q[a]-Qs[s][a];loss+=g[a]*g[a]}backward(net,acts,g)}adam(net,lr,env.nS);
  if(ep%50===0&&ok<0){let s=env.start,k=0;while(s!==env.goal&&k<60){const q=forward(net,OBS[s]);let a=0;for(let j=1;j<4;j++)if(q[j]>q[a])a=j;s=env.move(s,a)[0];k++}if(k===20)ok=ep}}
 console.log(lr,sd,'solved at epoch',ok,(Date.now()-t0)+'ms/3000');}
