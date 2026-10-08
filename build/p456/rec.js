const m=require("./dqn.js");const {env,OBS}=m;
// re-run seed 2 with recording: monkeypatch by copying dqn with hook
const src=require('fs').readFileSync('dqn.js','utf8');
let code=src.split('module.exports')[0].replace(/^const Cueva[^\n]*\n/,'').replace(/^const env[^\n]*\n/m,'').replace(/^function obs[^\n]*\n/m,'').replace(/^const OBS[^\n]*\n/m,'');
code=code.replace('largos.push(t);break}','largos.push(t);REC.push(OBS.map(o=>{const q=forward(net,o);let a=0;for(let k=1;k<4;k++)if(q[k]>q[a])a=k;return [Math.round(Math.max(...q)*1000)/1000,a]}));break}');
const Cueva=require("/tmp/claude-0/-home-claude/c0892404-b462-53b0-ae0f-c95d40b227f9/scratchpad/load.js");
const REC=[];eval(code+';globalThis.dqn2=dqn');
const r=dqn2(2);
const out={largos:r.largos,V:REC.map(e=>e.map(x=>x[0])),pol:REC.map(e=>e.map(x=>x[1]).join('')),N:Array.from(r.N),pasos:r.paso};
require('fs').writeFileSync('dqn_rec.json',JSON.stringify(out));console.log(r.paso,r.largos.slice(-5),JSON.stringify(out).length);
