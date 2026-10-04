"use client";
import dynamic from "next/dynamic";
const OfficeScene=dynamic(()=>import("./OfficeScene"),{ssr:false});
export default function Home(){return <main className="game3d"><header className="topHud"><div className="brandLockup"><div className="brandMark">WC</div><div><b>DEV OFFICE</b><span>Wedding Copilot · Live Engineering World</span></div></div><div className="live"><i/>LIVE WORLD</div></header><OfficeScene/><footer className="bottomHud"><span>REAL EVENTS ONLY</span><span>Wedding Copilot Engineering Runtime</span></footer></main>}
