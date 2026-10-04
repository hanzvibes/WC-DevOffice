import "./globals.css";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Wedding Copilot Dev Office",description:"Live development office for Wedding Copilot"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}