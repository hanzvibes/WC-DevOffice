"use client";
import {AdaptiveDpr,ContactShadows,Environment,OrbitControls} from "@react-three/drei";
import {Canvas,useFrame,useThree} from "@react-three/fiber";
import {Suspense,useEffect,useMemo,useRef,useState} from "react";
import * as THREE from "three";
import {OfficeWorld} from "../features/office/visuals/OfficeWorld";
import {OPS_CENTER_X,opsZoneCenter} from "../features/office/visuals/CustomerOpsWing";
import {SPOTS,stateColor,type OfficeRow,type Vec3} from "../features/office/visuals/config";
import type{OpsPayload}from"../lib/customer-ops/types";
import styles from"./office.module.css";

type Room="hq"|"dev"|"ops";
const when=(v:string|null)=>v?new Intl.DateTimeFormat("id-ID",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v)):"—";

export default function OfficeScene(){
 const[mobile,setMobile]=useState(()=>typeof window!=="undefined"&&window.matchMedia("(max-width:700px)").matches);
 const[events,setEvents]=useState<OfficeRow[]>([]),[selected,setSelected]=useState<string|null>(null),[room,setRoom]=useState<Room>("dev"),[navTick,setNavTick]=useState(0),[opsData,setOpsData]=useState<OpsPayload|null>(null),[opsUnlocked,setOpsUnlocked]=useState(false),[showBoss,setShowBoss]=useState(false),[password,setPassword]=useState(""),[opsError,setOpsError]=useState(""),[selectedCustomer,setSelectedCustomer]=useState<string|null>(null);
 useEffect(()=>{const media=window.matchMedia("(max-width:700px)");const sync=()=>setMobile(media.matches);sync();media.addEventListener("change",sync);return()=>media.removeEventListener("change",sync)},[]);
 useEffect(()=>{let live=true;const load=()=>fetch("/api/events",{cache:"no-store"}).then(r=>r.json()).then(data=>{if(live&&Array.isArray(data.events))setEvents(data.events)}).catch(()=>{});load();const id=setInterval(load,2000);return()=>{live=false;clearInterval(id)}},[]);
 const workers=useMemo(()=>{const seen=new Set<string>(),now=Date.now();return events.filter(e=>!seen.has(e.worker_id)&&!!seen.add(e.worker_id)).slice(0,mobile?6:8).map(e=>{const active=["READING","CODING","TESTING","REVIEWING"].includes(e.state),stale=now-new Date(e.created_at).getTime()>180000;return active&&stale?{...e,state:"IDLE",message:"Agent disconnected · waiting for activity"}:e})},[events,mobile]);
 useEffect(()=>{if(selected&&!workers.some(w=>w.worker_id===selected))setSelected(null)},[workers,selected]);
 const selectedRow=workers.find(w=>w.worker_id===selected)||null,selectedUser=opsData?.users.find(u=>u.id===selectedCustomer)||null;
 const counts=useMemo(()=>({active:workers.filter(w=>["READING","CODING","TESTING","REVIEWING"].includes(w.state)).length,blocked:workers.filter(w=>w.state==="BLOCKED").length,done:workers.filter(w=>w.state==="DONE").length}),[workers]);
 async function loadOps(pass=password){setOpsError("");try{const res=await fetch("/api/ops/users",{cache:"no-store",headers:{Authorization:`Basic ${btoa(`admin:${pass}`)}`}});let body:any={};try{body=await res.json()}catch{}if(res.status===401){setOpsError("Password Boss Mode salah.");return false}if(!res.ok){setOpsUnlocked(true);setRoom("ops");setNavTick(v=>v+1);setShowBoss(false);setOpsError(body.error||"Customer data source belum siap.");return false}setOpsData(body);setOpsUnlocked(true);setRoom("ops");setNavTick(v=>v+1);setShowBoss(false);return true}catch{setOpsError("Customer Ops tidak dapat dihubungi.");return false}}
 useEffect(()=>{if(!opsUnlocked||!password)return;const id=setInterval(()=>loadOps(password),15000);return()=>clearInterval(id)},[opsUnlocked,password]);
 function chooseRoom(next:Room){setRoom(next);setNavTick(v=>v+1);setSelected(null);setSelectedCustomer(null);if(next==="ops"&&!opsUnlocked)setShowBoss(true)}
 const orbitTarget:Vec3=room==="ops"?[OPS_CENTER_X,.9,0]:room==="hq"?[OPS_CENTER_X/2,.9,0]:[0,.9,0];
 return <div className="canvasWrap">
 <Canvas shadows={!mobile} dpr={mobile?[.72,1]:[1,1.3]} camera={{position:[0,12.4,14.3],fov:42}} onPointerMissed={()=>{setSelected(null);setSelectedCustomer(null)}} gl={{antialias:!mobile,powerPreference:"high-performance",stencil:false}}>
  <Suspense fallback={null}>
   <color attach="background" args={["#070a0f"]}/><fog attach="fog" args={["#070a0f",mobile?19:22,mobile?44:52]}/>
   <ambientLight intensity={mobile?.9:.75}/><hemisphereLight intensity={mobile?.62:.48} groundColor="#11141a" color="#9fb6d7"/>
   <directionalLight castShadow={!mobile} position={[7,14,9]} intensity={mobile?1.45:2.2} shadow-mapSize={mobile?[512,512]:[1536,1536]}/>
   <pointLight position={[0,5,-1]} intensity={mobile?9:15} distance={18} color="#8ca8ff"/><pointLight position={[OPS_CENTER_X,5,-1]} intensity={mobile?9:15} distance={20} color="#9f8cff"/>
   <OfficeWorld workers={workers} selected={selected} onSelect={id=>{setSelected(id);setSelectedCustomer(null);setRoom("dev");setNavTick(v=>v+1)}} opsUsers={opsData?.users||[]} opsMetrics={opsData?.metrics||null} opsUnlocked={opsUnlocked} selectedCustomer={selectedCustomer} onSelectCustomer={id=>{setSelectedCustomer(id);setSelected(null);setRoom("ops");setNavTick(v=>v+1)}} mobile={mobile}/>
   <CameraRig selected={selectedRow} room={room} navTick={navTick} opsTarget={selectedUser?opsZoneCenter(selectedUser):null}/>
   {!mobile&&<Environment preset="city"/>}{!mobile&&<ContactShadows position={[OPS_CENTER_X/2,.01,0]} opacity={.42} scale={42} blur={2.8} frames={1}/>}<AdaptiveDpr/>
   <OrbitControls enabled={!selectedRow&&!selectedUser} makeDefault target={orbitTarget} minDistance={7} maxDistance={38} minPolarAngle={.42} maxPolarAngle={Math.PI/2.08} enableDamping dampingFactor={.1} enablePan panSpeed={mobile?.9:.75} rotateSpeed={mobile?.55:.65} zoomSpeed={mobile?.85:.75} screenSpacePanning/>
  </Suspense>
 </Canvas>
 <div className={styles.floorNav}><button className={room==="hq"?styles.active:""} onClick={()=>chooseRoom("hq")}><span className={styles.long}>HQ OVERVIEW</span><span className={styles.short}>HQ</span></button><button className={room==="dev"?styles.active:""} onClick={()=>chooseRoom("dev")}><span className={styles.long}>DEV FLOOR</span><span className={styles.short}>DEV</span></button><button className={room==="ops"?styles.active:""} onClick={()=>chooseRoom("ops")}><span className={styles.long}>CUSTOMER OPS</span><span className={styles.short}>OPS</span><small>{opsUnlocked?"LIVE":"LOCKED"}</small></button></div>
 {room==="ops"&&opsData?<div className="worldStats"><span><i className="dot green"/>USERS <b>{opsData.metrics.totalUsers}</b></span><span><i className="dot violet"/>SUBSCRIBERS <b>{opsData.metrics.subscribers}</b></span><span><i className="dot red"/>PENDING <b>{opsData.metrics.payments.pending}</b></span></div>:<div className="worldStats"><span><i className="dot green"/>ACTIVE <b>{counts.active}</b></span><span><i className="dot red"/>BLOCKED <b>{counts.blocked}</b></span><span><i className="dot violet"/>SHIPPED <b>{counts.done}</b></span></div>}
 {selectedRow&&<div className="agentPanel"><button onClick={()=>setSelected(null)} aria-label="Close agent panel">×</button><small>LIVE AGENT</small><strong>{selectedRow.worker_name}</strong><span>{selectedRow.role}</span><div className="statePill" style={{borderColor:stateColor(selectedRow.state),color:stateColor(selectedRow.state)}}>{selectedRow.state}</div><p>{selectedRow.message}</p>{selectedRow.task&&<em>{selectedRow.task}</em>}<footer>Camera following agent · close for overview</footer></div>}
 {selectedUser&&<div className={styles.customerPanel}><button onClick={()=>setSelectedCustomer(null)}>×</button><small>CUSTOMER PROFILE</small><strong>{selectedUser.name}</strong><span>{selectedUser.email}</span><div className={styles.customerGrid}><i><small>PLAN</small><b>{selectedUser.plan}</b></i><i><small>PAYMENT</small><b>{selectedUser.paymentStatus}</b></i><i><small>VERIFIED</small><b>{selectedUser.verified?"YES":"NO"}</b></i><i><small>LAST SIGN IN</small><b>{when(selectedUser.lastSignInAt)}</b></i></div>{selectedUser.weddingTitle&&<p>{selectedUser.weddingTitle}</p>}</div>}
 {room==="ops"&&!opsUnlocked&&<button className={styles.unlockCard} onClick={()=>setShowBoss(true)}><b>CUSTOMER OPS LOCKED</b><span>Unlock Boss Mode to load private customer data and characters.</span></button>}
 {room==="dev"&&workers.length===0&&<div className="emptyWorld"><b>THE OFFICE IS QUIET</b><span>Agents appear automatically when Codex starts working.</span></div>}
 {opsError&&room==="ops"&&<div className={styles.opsError}>{opsError}</div>}
 <div className="worldHint">{room==="hq"?"ONE HQ · TWO WINGS":room==="ops"?"CUSTOMER OPS WING":"DEV STUDIO"}</div>
 {showBoss&&<div className={styles.scrim}><form className={styles.bossModal} onSubmit={async e=>{e.preventDefault();await loadOps(password)}}><button type="button" className={styles.close} onClick={()=>setShowBoss(false)}>×</button><small>BOSS MODE</small><h2>Unlock Customer Ops</h2><p>Data user dan subscription tetap privat. Password hanya dipakai di tab ini untuk request HTTPS ke Customer Ops API.</p><label>Username<input value="admin" disabled/></label><label>Password<input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="OPS_ADMIN_PASSWORD"/></label>{opsError&&<em>{opsError}</em>}<button className={styles.unlock} disabled={!password}>UNLOCK WING</button></form></div>}
 </div>
}

function CameraRig({selected,room,opsTarget,navTick}:{selected:OfficeRow|null;room:Room;opsTarget:Vec3|null;navTick:number}){
 const{camera,size}=useThree();
 const target=useRef(new THREE.Vector3()),look=useRef(new THREE.Vector3()),desired=useRef(new THREE.Vector3()),moving=useRef(true);
 const mobile=size.width<700;
 useEffect(()=>{const perspective=camera as THREE.PerspectiveCamera;if(typeof perspective.fov==="number"){perspective.fov=mobile?48:40;perspective.updateProjectionMatrix()}moving.current=true},[camera,mobile,room,selected?.worker_id,opsTarget?.[0],opsTarget?.[2],navTick]);
 useFrame((_,dt)=>{
  if(!moving.current)return;
  if(selected){const p=SPOTS[selected.state]||SPOTS.READING;target.current.set(p[0],.96,p[2]);desired.current.set(p[0]+(mobile?3.55:6.1),mobile?4.9:6.25,p[2]+(mobile?5.05:7))}
  else if(opsTarget){target.current.set(opsTarget[0],.92,opsTarget[2]);desired.current.set(opsTarget[0]+(mobile?3.2:5.7),mobile?4.95:6.2,opsTarget[2]+(mobile?5:6.6))}
  else if(room==="ops"){target.current.set(OPS_CENTER_X,.8,0);desired.current.set(mobile?OPS_CENTER_X:OPS_CENTER_X+8.8,mobile?13.2:10.8,mobile?16:14.5)}
  else if(room==="hq"){target.current.set(OPS_CENTER_X/2,.8,0);desired.current.set(OPS_CENTER_X/2,mobile?20:15.5,mobile?28:23)}
  else{target.current.set(0,.8,0);desired.current.set(mobile?0:9.6,mobile?12.2:9.8,mobile?14.2:12.6)}
  const moveAlpha=1-Math.exp(-dt*3.2),lookAlpha=1-Math.exp(-dt*4.2);camera.position.lerp(desired.current,moveAlpha);look.current.lerp(target.current,lookAlpha);camera.lookAt(look.current);
  if(camera.position.distanceTo(desired.current)<.05&&look.current.distanceTo(target.current)<.04)moving.current=false
 });
 return null
}
