"use client";
import dynamic from"next/dynamic";
import{useEffect,useMemo,useState}from"react";
import Link from"next/link";
import type{OpsPayload,OpsUser}from"../../lib/customer-ops/types";
import styles from"./ops.module.css";
const OpsScene=dynamic(()=>import("./OpsScene"),{ssr:false});
const money=(n:number)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const when=(v:string|null)=>v?new Intl.DateTimeFormat("id-ID",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v)):"—";

export default function CustomerOps(){
 const[data,setData]=useState<OpsPayload|null>(null),[error,setError]=useState(""),[loading,setLoading]=useState(true),[selectedId,setSelectedId]=useState<string|null>(null),[roster,setRoster]=useState(false),[query,setQuery]=useState("");
 useEffect(()=>{let live=true;const load=()=>fetch("/api/ops/users",{cache:"no-store"}).then(async res=>{const body=await res.json();if(!live)return;if(!res.ok){setError(body.error||"Customer Ops unavailable");setLoading(false);return}setData(body);setError("");setLoading(false)}).catch(()=>{if(live){setError("Customer Ops unavailable");setLoading(false)}});load();const timer=setInterval(load,15000);return()=>{live=false;clearInterval(timer)}},[]);
 const selected=useMemo(()=>data?.users.find(u=>u.id===selectedId)||null,[data,selectedId]);
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return(data?.users||[]).filter(u=>!q||`${u.name} ${u.email} ${u.plan} ${u.paymentStatus}`.toLowerCase().includes(q))},[data,query]);
 if(loading)return<main className={styles.shell}><div className={styles.loading}>BOOTING CUSTOMER OPS FLOOR…</div></main>;
 if(error)return<main className={styles.shell}><header className={styles.topbar}><Link href="/">WC HQ</Link></header><section className={styles.setup}><span>PRIVATE DATA SOURCE</span><h1>Customer Ops world is ready.</h1><p>{error}</p><code>CUSTOMER_OPS_DATABASE_URL</code><p>Pasang credential database read-only yang sudah dirotasi. Credential lama dari DashboardWedding tetap tidak dipakai.</p></section></main>;
 const m=data!.metrics;
 return<main className={styles.worldShell}>
  <OpsScene users={data!.users} metrics={m} selectedId={selectedId} onSelect={setSelectedId}/>
  <header className={styles.topbar}><div><Link href="/">WC // HQ</Link><span>CUSTOMER OPS FLOOR · BOSS MODE</span></div><div className={styles.topActions}><span className={styles.liveDot}>PRIVATE LIVE</span><button className={styles.rosterButton} onClick={()=>setRoster(v=>!v)}>CUSTOMERS</button></div></header>
  <div className={styles.worldMetrics}><Chip label="REGISTERED" value={m.totalUsers}/><Chip label="SUBSCRIBERS" value={m.subscribers}/><Chip label="NO PLAN" value={m.unsubscribed}/><Chip label="PENDING" value={m.payments.pending}/><Chip label="FAILED" value={m.payments.failed}/></div>
  <div className={styles.legend}><span><i className={styles.blue}/>REGISTERED</span><span><i className={styles.gray}/>NO SUBSCRIPTION</span><span><i className={styles.gold}/>CHECKOUT</span><span><i className={styles.violet}/>SUBSCRIBER</span><span><i className={styles.red}/>ATTENTION</span></div>
  {selected&&<CustomerCard user={selected} onClose={()=>setSelectedId(null)}/>} 
  {roster&&<aside className={styles.roster}><header><div><small>LIVE CUSTOMER ROSTER</small><b>{filtered.length} users</b></div><button onClick={()=>setRoster(false)}>×</button></header><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search customer…"/><div className={styles.rosterList}>{filtered.slice(0,60).map(u=><button key={u.id} onClick={()=>{setSelectedId(u.id);setRoster(false)}}><span><b>{u.name}</b><small>{u.email}</small></span><em className={styles[`status_${u.paymentStatus}`]||""}>{u.paymentStatus==="paid"?u.plan:u.paymentStatus}</em></button>)}</div></aside>}
  <footer className={styles.bottomBar}><span>REAL CUSTOMER DATA · CHARACTERS REPRESENT ACCOUNTS</span><span>{money(m.revenueIdr)} REVENUE · {m.conversionRate}% CONVERSION</span></footer>
 </main>
}
function Chip({label,value}:{label:string;value:number}){return<div className={styles.chip}><span>{label}</span><b>{value.toLocaleString("id-ID")}</b></div>}
function CustomerCard({user,onClose}:{user:OpsUser;onClose:()=>void}){return<section className={styles.customerCard}><button className={styles.cardClose} onClick={onClose}>×</button><small>SELECTED CUSTOMER</small><h2>{user.name}</h2><p>{user.email}</p><div className={styles.cardGrid}><D label="Plan" value={user.plan}/><D label="Payment" value={user.paymentStatus}/><D label="Verified" value={user.verified?"Yes":"No"}/><D label="Last sign in" value={when(user.lastSignInAt)}/></div><div className={styles.cardSection}><span>WEDDING</span><b>{user.weddingTitle||"No wedding profile"}</b><small>{user.weddingDate?when(user.weddingDate):"Wedding date not set"}</small></div>{user.amountPaidIdr!=null&&<div className={styles.cardSection}><span>SUBSCRIPTION VALUE</span><strong>{money(user.amountPaidIdr)}</strong><small>Purchased {when(user.purchasedAt)}</small></div>}</section>}
function D({label,value}:{label:string;value:string}){return<div><span>{label}</span><b>{value}</b></div>}
