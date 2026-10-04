"use client";
import {useEffect,useState} from "react";
type Agent={id:string;name:string;role:string;state:string;x:number;y:number;emoji:string};
const agents:Agent[]=[
{id:"front",name:"Niko",role:"Frontend",state:"CODING",x:24,y:33,emoji:"🧑‍💻"},
{id:"qa",name:"Mira",role:"QA",state:"TESTING",x:73,y:31,emoji:"🧪"},
{id:"review",name:"Ari",role:"Reviewer",state:"REVIEWING",x:72,y:70,emoji:"🧑‍🔬"}
];
export default function Home(){
 const [tick,setTick]=useState(0);
 useEffect(()=>{const i=setInterval(()=>setTick(v=>v+1),1800);return()=>clearInterval(i)},[]);
 return <main className="game">
  <header className="gamebar"><div><span className="brand">WC // DEV OFFICE</span><span className="online">● LIVE</span></div><div className="quest">QUEST: <b>Ship Wedding Copilot</b></div></header>
  <section className="world">
   <div className="floor-grid"/>
   <Room cls="frontend" title="FRONTEND BAY" icon="⌨️"><Desk/><Desk/></Room>
   <Room cls="qa" title="QA LAB" icon="🧪"><Lab/></Room>
   <Room cls="review" title="REVIEW ROOM" icon="🔎"><Table/></Room>
   <Room cls="deploy" title="DEPLOY DOCK" icon="▲"><Server/></Room>
   <div className="lounge"><span>☕ BREAK ZONE</span><i>🛋️</i><i>🌿</i></div>
   {agents.map((a,i)=><div key={a.id} className={"character c"+i} style={{left:a.x+"%",top:a.y+"%"}}>
     <div className="bubble">{a.state==="CODING"?"Editing GuestCard…":a.state==="TESTING"?"Running RSVP tests…":"Reviewing changes…"}</div>
     <div className={"sprite "+(tick%2?"step":"")}>{a.emoji}</div>
     <div className="tag"><b>{a.name}</b><small>{a.role} · {a.state}</small></div>
   </div>)}
   <div className="bot buildbot"><div className="sprite">🤖</div><small>BUILD BOT<br/><b>IDLE</b></small></div>
  </section>
  <aside className="hud">
   <div className="hudtitle">LIVE ACTIVITY</div>
   <p><b>Niko</b><span>coding</span></p><p><b>Mira</b><span>testing</span></p><p><b>Ari</b><span>reviewing</span></p>
   <div className="progress"><i/><span>MVP OFFICE WORLD</span></div>
  </aside>
  <footer className="status"><span>● 3 AGENTS ONLINE</span><span>Wedding Copilot / main</span><span>SYNC READY</span></footer>
 </main>
}
function Room({cls,title,icon,children}:{cls:string,title:string,icon:string,children:React.ReactNode}){return <div className={"room "+cls}><label>{icon} {title}</label>{children}</div>}
function Desk(){return <div className="desk"><span>🖥️</span><i>⌨</i></div>}
function Lab(){return <div className="labgear"><span>🖥️</span><span>📱</span><span>✓</span></div>}
function Table(){return <div className="table"><span>💻</span><span>📋</span></div>}
function Server(){return <div className="server"><span>▥</span><span>▥</span><b>▲</b></div>}
