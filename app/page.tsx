"use client";
import dynamic from "next/dynamic";
const OfficeScene=dynamic(()=>import("./OfficeScene"),{ssr:false});
export default function Home(){return <main className="game3d"><header className="topHud"><div className="brandLockup"><div className="brandMark">WC</div><div><b>WEDDING COPILOT HQ</b><span>Engineering + Customer Ops · one live world</span></div></div><div className="topActions"><div className="live"><i/>LIVE WORLD</div></div></header><OfficeScene/><footer className="bottomHud"><span>ONE HQ · REAL EVENTS ONLY</span><span>Engineering Runtime + Private Customer Ops</span></footer></main>}
