const Cueva=require("/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/load.js");
const env=Cueva.makeEnv(Cueva.MAPS.chica);
function obs(s){const [r,c]=env.free[s];const o=[r/(env.H-1),c/(env.W-1)];for(let a=0;a<4;a++)o.push(env.isWall(r+Cueva.DR[a][0],c+Cueva.DR[a][1])?1:0);return o;}
const OBS=Array.from({length:env.nS},(_,s)=>Float64Array.from(obs(s)));
function MLP(sizes,R){const L=[];for(let i=0;i<sizes.length-1;i++){const n=sizes[i],m=sizes[i+1],W=new Float64Array(n*m),b=new Float64Array(m),lim=1/Math.sqrt(n);for(let k=0;k<W.length;k++)W[k]=(R()*2-1)*lim;for(let k=0;k<m;k++)b[k]=(R()*2-1)*lim;L.push({n,m,W,b,gW:new Float64Array(n*m),gb:new Float64Array(m),mW:new Float64Array(n*m),vW:new Float64Array(n*m),mb:new Float64Array(m),vb:new Float64Array(m)})}return {L,t:0};}
function forward(net,x,keep){let a=x;const acts=[x];for(let i=0;i<net.L.length;i++){const l=net.L[i],z=new Float64Array(l.m);for(let j=0;j<l.m;j++){let s=l.b[j];for(let k=0;k<l.n;k++)s+=l.W[j*l.n+k]*a[k];z[j]=(i<net.L.length-1&&s<0)?0:s}a=z;acts.push(a)}return keep?acts:a;}
function backward(net,acts,gout){let g=gout;for(let i=net.L.length-1;i>=0;i--){const l=net.L[i],x=acts[i],gin=new Float64Array(l.n);for(let j=0;j<l.m;j++){const gj=g[j];if(gj===0)continue;l.gb[j]+=gj;for(let k=0;k<l.n;k++){l.gW[j*l.n+k]+=gj*x[k];gin[k]+=gj*l.W[j*l.n+k]}}if(i>0){for(let k=0;k<l.n;k++)if(x[k]<=0)gin[k]=0}g=gin}}
function adam(net,lr,bs){net.t++;const b1=.9,b2=.999,c1=1-Math.pow(b1,net.t),c2=1-Math.pow(b2,net.t);for(const l of net.L){for(const [p,gr,m,v] of [[l.W,l.gW,l.mW,l.vW],[l.b,l.gb,l.mb,l.vb]]){for(let k=0;k<p.length;k++){const g=gr[k]/bs;m[k]=b1*m[k]+(1-b1)*g;v[k]=b2*v[k]+(1-b2)*g*g;p[k]-=lr*(m[k]/c1)/(Math.sqrt(v[k]/c2)+1e-8);gr[k]=0}}}}
function copy(a,b){a.L.forEach((l,i)=>{b.L[i].W.set(l.W);b.L[i].b.set(l.b)})}
let LR=+(process.env.LR||1e-3),CP=+(process.env.CP||50);
function dqn(seed,{eps=150,hid=32}={}){const R=Cueva.rng(seed*9973+1);const net=MLP([6,hid,hid,4],R),tgt=MLP([6,hid,hid,4],R);copy(net,tgt);
 const cap=10000,S=new Int32Array(cap),A=new Int32Array(cap),Rw=new Float64Array(cap),S2=new Int32Array(cap),T=new Uint8Array(cap);let n=0,paso=0;const largos=[];const N=new Float64Array(env.nS);
 for(let ep=0;ep<eps;ep++){let s=env.start,t=0;while(true){const e=Math.max(.05,1-.95*paso/4000);let a;if(R()<e)a=Math.floor(R()*4);else{const q=forward(net,OBS[s]);a=0;for(let k=1;k<4;k++)if(q[k]>q[a])a=k}
  const [s2]=env.move(s,a);N[s2]++;const fin=s2===env.goal;const r=fin?1:-0.01;const i=n%cap;S[i]=s;A[i]=a;Rw[i]=r;S2[i]=s2;T[i]=fin?1:0;n++;paso++;t++;
  if(n>=500){for(let b=0;b<64;b++){const j=Math.floor(R()*Math.min(n,cap));const q2=forward(tgt,OBS[S2[j]]);const y=Rw[j]+(T[j]?0:.95*Math.max(...q2));const acts=forward(net,OBS[S[j]],true);const q=acts[acts.length-1];const d=q[A[j]]-y;const g=new Float64Array(4);g[A[j]]=Math.max(-1,Math.min(1,d));backward(net,acts,g)}adam(net,LR,64);if(paso%CP===0)copy(net,tgt)}
  s=s2;if(fin||t>=100){largos.push(t);break}}}
 return {net,largos,N,paso};}
module.exports={dqn,forward,env,OBS};
if(require.main===module){for(let sd=1;sd<=6;sd++){const t0=Date.now();const r=dqn(sd);const V=OBS.map(o=>Math.max(...forward(r.net,o)));
 // greedy path
 let s=env.start,k=0;while(s!==env.goal&&k<100){const q=forward(r.net,OBS[s]);let a=0;for(let j=1;j<4;j++)if(q[j]>q[a])a=j;s=env.move(s,a)[0];k++}
 console.log(sd,(Date.now()-t0)+'ms',r.paso,'last10',r.largos.slice(-10).join(','),'greedy',k)}}
