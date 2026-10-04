import "./globals.css";
import "./hq.css";
import type {Metadata} from "next";
export const metadata:Metadata={title:"Wedding Copilot HQ",description:"Live engineering and customer operations for Wedding Copilot"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}
