const Cueva=require("/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/load.js");
const env=Cueva.makeEnv(Cueva.MAPS.grande);
function goExplore(seed,k=30){const R=Cueva.rng(seed*104729+7);const arch=new Map([[env.start,{tray:[env.start],vistas:1,nacio:0}]]);let it=0,pasos=0,hall=null;
 function iter(){it++;const cs=[...arch.keys()];const w=cs.map(c=>1/Math.sqrt(arch.get(c).vistas+1));let tot=w.reduce((a,b)=>a+b),u=R()*tot,i=0;while(u>w[i]&&i<cs.length-1){u-=w[i];i++}
  const c=cs[i];const tray=arch.get(c).tray.slice();let s=c;
  for(let j=0;j<k;j++){const [s2]=env.move(s,Math.floor(R()*4));pasos++;tray.push(s2);s=s2;
   const e=arch.get(s2); if(e){e.vistas++; if(tray.length<e.tray.length)e.tray=tray.slice();} else arch.set(s2,{tray:tray.slice(),vistas:1,nacio:it});
   if(s2===env.goal){if(!hall)hall={it,pasos};break;}}}
 while(!hall&&it<1000)iter(); return [hall.it,hall.pasos,arch.size];}
for(let s=1;s<=8;s++)console.log(goExplore(s));
