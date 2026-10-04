"use client";
import {Canvas,useFrame} from "@react-three/fiber";
import {ContactShadows,Environment,Html,OrbitControls,RoundedBox} from "@react-three/drei";
import {Suspense,useEffect,useMemo,useRef,useState} from "react";
import * as THREE from "three";
type Row={id:string;worker_id:string;worker_name:string;role:string;state:string;message:string;task?:string;created_at:string};
const spots:Record<string,[number,number,number]>={
 IDLE:[0,.45,0],READING:[-1.2,.45,.2],CODING:[-3.3,.45,-1.7],TESTING:[3.2,.45,-1.7],REVIEWING:[3.2,.45,2],BLOCKED:[0,.45,2.8],DONE:[-3.3,.45,2]
};
export default function OfficeScene(){
 const [events,setEvents]=useState<Row[]>([]);
 useEffect(()=>{let live=true;const load=()=>fetch("/api/events",{cache:"no-store"}).then(r=>r.json()).then(d=>{if(live&&Array.isArray(d.events))setEvents(d.events)}).catch(()=>{});load();const id=setInterval(load,2000);return()=>{live=false;clearInterval(id)}},[]);
 const workers=useMemo(()=>{const seen=new Set<string>();return events.filter(e=>{if(seen.has(e.worker_id))return false;seen.add(e.worker_id);return true}).slice(0,8)},[events]);
 return <div className="canvasWrap"><Canvas shadows camera={{position:[9,10,11],fov:42}}><Suspense fallback={null}><color attach="background" args={["#0b0e14"]}/><ambientLight intensity={1.5}/><directionalLight castShadow position={[4,9,5]} intensity={2.2}/><Office workers={workers}/><Environment preset="city"/><ContactShadows position={[0,.02,0]} opacity={.55} scale={20} blur={2.5}/><OrbitControls makeDefault target={[0,0,0]} minDistance={8} maxDistance={20} maxPolarAngle={Math.PI/2.25}/></Suspense></Canvas>{workers.length===0&&<div className="emptyWorld"><b>OFFICE IS IDLE</b><span>Waiting for a real Codex event…</span></div>}</div>
}
function Office({workers}:{workers:Row[]}){return <group><Floor/><Zone position={[-3.3,.16,-2]} label="CODING BAY" color="#273252"/><Zone position={[3.2,.16,-2]} label="QA LAB" color="#214438"/><Zone position={[3.2,.16,2]} label="REVIEW" color="#4b3c24"/><Zone position={[-3.3,.16,2]} label="DONE / DEPLOY" color="#392c4b"/><Desk position={[-3.3,.55,-2]}/><Desk position={[3.2,.55,-2]}/><MeetingTable position={[3.2,.45,2]}/><Server position={[-3.3,.65,2]}/>{workers.map((w,i)=><Character key={w.worker_id} name={w.worker_name} role={w.role} state={w.state} message={w.message} target={spots[w.state]||spots.READING} color={["#7c8cff","#59d6a0","#e4b85c","#d77cff"][i%4]}/>)}</group>}
function Floor(){return <mesh receiveShadow position={[0,-.05,0]}><boxGeometry args={[10,.2,8]}/><meshStandardMaterial color="#151a23" roughness={.8}/></mesh>}
function Zone({position,label,color}:{position:[number,number,number],label:string,color:string}){return <group position={position}><mesh receiveShadow rotation={[-Math.PI/2,0,0]}><planeGeometry args={[4.2,3.1]}/><meshStandardMaterial color={color} roughness={.9}/></mesh><Html position={[-1.7,.05,-1.25]} transform><div className="zoneLabel">{label}</div></Html></group>}
function Desk({position}:{position:[number,number,number]}){return <group position={position}><RoundedBox castShadow args={[2,.15,.85]} radius={.08}><meshStandardMaterial color="#465064"/></RoundedBox><mesh position={[0,.55,0]} castShadow><boxGeometry args={[.9,.58,.08]}/><meshStandardMaterial color="#101722" emissive="#233654" emissiveIntensity={.6}/></mesh></group>}
function MeetingTable({position}:{position:[number,number,number]}){return <RoundedBox position={position} castShadow args={[2.4,.25,1.2]} radius={.35}><meshStandardMaterial color="#554b3d"/></RoundedBox>}
function Server({position}:{position:[number,number,number]}){return <group position={position}>{[-.55,0,.55].map(x=><RoundedBox key={x} position={[x,0,0]} castShadow args={[.45,1.3,.7]} radius={.05}><meshStandardMaterial color="#252c38" emissive="#3c2b59" emissiveIntensity={.35}/></RoundedBox>)}</group>}
function Character({name,role,state,message,target,color}:{name:string;role:string;state:string;message:string;target:[number,number,number];color:string}){
 const ref=useRef<THREE.Group>(null);const current=useRef(new THREE.Vector3(...target));
 useEffect(()=>{current.current.set(...target)},[target]);
 useFrame(({clock},delta)=>{if(!ref.current)return;ref.current.position.lerp(current.current,Math.min(1,delta*2.5));ref.current.children[0].rotation.y=Math.sin(clock.elapsedTime*4)*.05});
 return <group ref={ref} position={target}><mesh castShadow position={[0,.65,0]}><capsuleGeometry args={[.27,.55,8,16]}/><meshStandardMaterial color={state==="BLOCKED"?"#ef6666":color}/></mesh><mesh castShadow position={[0,1.2,0]}><sphereGeometry args={[.27,20,20]}/><meshStandardMaterial color="#e8b998"/></mesh><Html center position={[0,1.78,0]}><div className="agentLabel"><b>{name}</b><span>{role} · {state}</span><small>{message.slice(0,54)}</small></div></Html></group>
}