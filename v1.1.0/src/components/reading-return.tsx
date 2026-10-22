"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Localized as L } from "./preferences";
const allowed = new Set(["survival","identity","capability","us-mission","us-dome","us-finance","us-ships","china-ownership","china-governance","china-arctic","china-myanmar","china-cambodia","korea-chips","korea-platforms","korea-regulation","korea-defense","spatial-method","synthesis","integration"]);
export function ReadingReturn({ fallback }: { fallback: string }) {
 const [target,setTarget]=useState(fallback);
 useEffect(()=>{const from=new URLSearchParams(location.search).get("from");if(from&&allowed.has(from))setTarget(from);},[]);
 return <Link className="inline-link" data-return-to-essay href={`/#${target}`}><L en="Continue the main argument ↗" ko="메인의 해당 논지로 돌아가기 ↗"/></Link>;
}
