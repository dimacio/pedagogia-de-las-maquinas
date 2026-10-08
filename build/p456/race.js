const Cueva=require("/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/load.js");
const env=Cueva.makeEnv(Cueva.MAPS.grande);
function explorador(tipo, seed){
  const R=Cueva.rng(seed*7919+13), nS=env.nS, beta=tipo==="conteo"?0.1:0, q0=tipo==="opt"?1:0;
  const Q=new Float64Array(nS*4).fill(q0); for(let a=0;a<4;a++)Q[env.goal*4+a]=0;
  const N=new Float64Array(nS); const X={Q,N,s:env.start,t:0,pasos:0,hallado:null,exitos:0,ep:0};
  N[env.start]++;
  X.paso=()=>{const s=X.s;let a;
    if(R()<0.1)a=Math.floor(R()*4); else {let m=-Infinity,b=[];for(let k=0;k<4;k++){const q=Q[s*4+k];if(q>m+1e-12){m=q;b=[k]}else if(Math.abs(q-m)<=1e-12)b.push(k)} a=b[Math.floor(R()*b.length)];}
    const [s2]=env.move(s,a); N[s2]++; X.pasos++; X.t++;
    const fin=s2===env.goal; let r=(fin?1:0)+(beta?beta/Math.sqrt(N[s2]):0);
    let mx=-Infinity; for(let k=0;k<4;k++)mx=Math.max(mx,Q[s2*4+k]);
    Q[s*4+a]+=0.5*(r+(fin?0:0.9*mx)-Q[s*4+a]); X.s=s2;
    if(fin){X.exitos++; if(X.hallado===null)X.hallado=X.pasos;}
    if(fin||X.t>=300){X.s=env.start;X.t=0;N[env.start]++;X.ep++;}
  };
  return X;
}
for(const tipo of ["eps","conteo","opt"]){const out=[];for(let sd=1;sd<=8;sd++){const X=explorador(tipo,sd);for(let i=0;i<60000;i++)X.paso();out.push(X.hallado)}console.log(tipo,out.join(" "))}
