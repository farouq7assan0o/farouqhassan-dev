"use client";
import { useState, useEffect, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────
const ME = {
  name: "Farouq Hassan",
  codename: "FH-02 // ANALYST",
  location: "AMM · JO · 31.9539°N",
  email: "12farouq12@gmail.com",
  linkedin: "https://www.linkedin.com/in/FarouqHassan02",
  github: "https://github.com/farouq7assan0o",
  medium: "https://medium.com/@12farouq12",
  cvSoc: "/Farouq_Hassan_Junior_SOC_Analyst_CV.pdf",
  cvOffensive: "/Farouq_Hassan_CV_Offensive.pdf",
  tagline: "I find what's broken\nbefore the adversary does.",
  bio: "Cybersecurity student at HTU, graduating June 2026. 8-month internship at SCC–Jordan Armed Forces (month 5/8). Offensive and defensive tracks simultaneously. CWES 70%, CPTS 45%, CDSA done. Everything documented publicly.",
  current: [
    { l:"SCC-JAF Internship", v:"Month 5 / 8" },
    { l:"HTB CWES",           v:"70%" },
    { l:"HTB CPTS",           v:"45%" },
    { l:"Detection Eng.",     v:"90-day plan" },
    { l:"HTB Writeups",       v:"Weekly" },
  ],
};

const PROJECTS = [
  { id:"animeblast",  sev:9, cat:"PENTEST",    year:2024, title:"AnimeBlast — Full-Scope Pentest",             tags:["Buffer Overflow","Metasploit","SQLi","RCE"],        summary:"Custom Python BoF (EIP@1036), DEP/ASLR/SafeSEH bypass, SOCKS pivot, UNION SQLi, PHP shell→RCE. 10 flags.", highlights:["Custom BoF — EIP @ 1036 bytes","DEP+ASLR+SafeSEH bypass","SOCKS proxy pivot","UNION SQLi → credentials","PHP shell → RCE","10 flags captured"], github:null },
  { id:"malware",     sev:9, cat:"PENTEST",    year:2024, title:"BackdoorBeacon.exe — Malware RE",             tags:["IDA Free","x32dbg","UPX","Reverse Eng."],          summary:"UPX-packed backdoor. TLS callbacks, anti-debug NOP patch, C2 IP patched to 127.0.0.1. SYN beacon confirmed.", highlights:["UPX unpack → PE analysis","Anti-debug NOP patch","C2 → 127.0.0.1","HKCU Run persistence","SSDT/IDT clean"], github:null },
  { id:"irplays",     sev:9, cat:"SOC/DFIR",   year:2025, title:"IR Playbooks — 3 Scenarios",                 tags:["NIST IR","D3FEND","Ransomware"],                   summary:"Clinic malware, CityWorks ransomware, Bazaarjo supply-chain. ATT&CK→D3FEND. FIDO2 MFA breaks Lumma.", highlights:["Ransomware decision tree","D3FEND: FIDO2 breaks Lumma","Exec update + advisory","Closure criteria all defined"], github:null },
  { id:"fair",        sev:9, cat:"GRC",        year:2024, title:"FAIR Risk — $1.38M → $177K",                 tags:["FAIR","Monte Carlo","PDPL"],                      summary:"ALE before $1.38M/yr. After MFA+SIEM+training: $177K. PDPL 72hr violation found.", highlights:["ALE before: $1.38M/year","ALE after: $177K (−$1.2M)","PDPL 72hr disclosure violated","Monte Carlo simulation"], github:null },
  { id:"pcap",        sev:8, cat:"SOC/DFIR",   year:2025, title:"PCAP + Memory Forensics",                    tags:["Wireshark","Volatility 3","DNS Tunneling"],        summary:"HTTP C2 beaconing, DNS TXT Base64 exfil, fileless PowerShell loader via Volatility 3 malfind.", highlights:["HTTP C2 /v1/checkin polling","DNS TXT Base64 exfil","RWX shellcode via malfind","Network+memory correlated"], github:null },
  { id:"aptintel",    sev:8, cat:"SOC/DFIR",   year:2025, title:"APT29 + Lumma Stealer Intel",               tags:["MITRE ATT&CK","OSINT","APT29"],                    summary:"ATT&CK Navigator layers for SolarWinds+USAID. Nation-state vs cybercrime.", highlights:["T1195.002 supply chain — High","LSASS+token abuse — High","Lumma T1555 cred harvest","CISA+Mandiant sourced"], github:null },
  { id:"cyberblast",  sev:8, cat:"PENTEST",    year:2024, title:"CyberBlast — Ethical Hacking",               tags:["Nessus","EternalBlue","SQLmap"],                   summary:"Nessus (20 findings), EternalBlue Meterpreter, UNION SQLi, XSS session hijack.", highlights:["Nessus: 20 vulns","EternalBlue → Meterpreter","UNION SQLi + XSS + RCE","MSFvenom payload"], github:null },
  { id:"forensics",   sev:8, cat:"SOC/DFIR",   year:2024, title:"BlackEagle — Digital Forensics",             tags:["FTK Imager","HxD","Steganography"],                summary:"NTFS manual recovery, DOCX inside PNG stego, hidden message decoded. Chain of custody.", highlights:["NTFS mirror manual recovery","DOCX inside PNG stego","Hidden message decoded","Hash verified throughout"], github:null },
  { id:"otps3",       sev:8, cat:"CLOUD",      year:2025, title:"Secure OTP S3 System",                       tags:["S3","OTP","OWASP A01/A07"],                        summary:"4 critical vulns fixed: OTP in response, no expiry, brute-force, predictable path.", highlights:["OTP removed from API response","5-min expiry+single-use","Rate limit: 5 attempts","uuid4+presigned URL"], github:null },
  { id:"sqli",        sev:7, cat:"PENTEST",    year:2025, title:"Banking SQLi + Red Team Plan",               tags:["SQLi","Auth Bypass","Kill Chain"],                 summary:"Manual SQLi, full banking ROE, complete Cyber Kill Chain OSINT→C2→exfil.", highlights:["Auth bypass via SQLi","UNION SELECT credentials","Banking ROE documented","Full Kill Chain mapped"], github:null },
  { id:"governance",  sev:7, cat:"GRC",        year:2025, title:"BazaarJo Governance Gap Assessment",         tags:["ISO 27014","PDPL","PCI DSS"],                     summary:"7 deficiencies: no SoD, no CISO accountability, no breach policy. 12-month roadmap.", highlights:["7 governance gaps","SoD: devs → prod unilateral","No PDPL breach notification","Board brief with roadmap"], github:null },
  { id:"risk",        sev:7, cat:"GRC",        year:2025, title:"Enterprise Risk Management Plan",            tags:["ISO 27005","NIST 800-30","KRIs"],                  summary:"ISO 27005+NIST 800-30. 6 risks rated, If-Then statements, KRIs defined.", highlights:["PII: Critical H×H","If-Then: git → injection","KRIs: MFA%, deploys","Quarterly board reporting"], github:null },
  { id:"privesc",     sev:7, cat:"PENTEST",    year:2025, title:"Linux Privilege Escalation",                 tags:["LinPEAS","Kernel Exploit","Netcat"],               summary:"Kernel 2.6.32 → Exploit-DB 18411 → LPE compiled and executed on target.", highlights:["Kernel 2.6.32 confirmed","Exploit-DB 18411 LPE","BoF LPE executed","4 transfer methods"], github:null },
  { id:"bia",         sev:6, cat:"GRC",        year:2025, title:"Business Impact Analysis",                   tags:["BIA","RTO/RPO","PCI DSS"],                        summary:"6 processes. Payment RTO 15min/RPO 0–5min. IR: RTO 15min/RPO 0.", highlights:["Payment RTO 15/RPO 0–5","IR RTO 15/RPO 0","Orders RTO 30/RPO 5","Recovery order defined"], github:null },
  { id:"isms",        sev:6, cat:"GRC",        year:2024, title:"ISMS Design — Bluefrontier Bank",            tags:["ISO 27001","COBIT 2019","BIA"],                   summary:"ISO 27001 full scope. COBIT 7-phase. BIA 6 processes. 3-stage audit. ROI.", highlights:["ISO 27001 full scope","COBIT 2019: 7-phase","BIA: 6 processes","Executive ROI quantified"], github:null },
  { id:"semgrep",     sev:5, cat:"PENTEST",    year:2025, title:"Semgrep SAST — 41 Findings",                tags:["Semgrep","SAST","DevSecOps"],                      summary:"41 findings across 1015 files in Juice Shop. Sequelize SQLi detected.", highlights:["41 findings, 1015 files","Sequelize SQLi detected","Push-triggered CI/CD","Parameterized query fix"], github:null },
  { id:"apache",      sev:5, cat:"CLOUD",      year:2025, title:"Apache + SSH Hardening (CIS)",               tags:["Apache 2.4","CIS Benchmark","SSH"],                summary:"5 Apache misconfigs fixed. SSH: key-only, no root, chacha20+aes256-gcm.", highlights:["5 CIS findings fixed","TraceEnable Off + no indexes","/server-status → 403","Key-only SSH, no root"], github:null },
  { id:"airline",     sev:5, cat:"SOC/DFIR",   year:2024, title:"Secure Airline Check-in System",             tags:["Java","SHA-256","JUnit","RBAC"],                   summary:"SHA-256+salt, 3-strike lockout, RBAC 4 roles, 100k fuzz test, PMD SAST.", highlights:["SHA-256+salt","3-strike lockout","RBAC: 4 roles","100k fuzz test"], github:"https://github.com/farouq7assan0o/SecureCoding" },
  { id:"network",     sev:5, cat:"CLOUD",      year:2023, title:"Enterprise Network Security Design",         tags:["Cisco","IPsec VPN","ASA Firewall"],                summary:"5-site IPsec VPN, ASA DMZ+NAT, full-mesh OSPF, VLAN segmentation.", highlights:["IPsec VPN: AES+SHA","ASA DMZ+NAT","Full-mesh OSPF","VLAN per dept"], github:null },
  { id:"crypto",      sev:5, cat:"GRC",        year:2024, title:"Applied Cryptography — MITM, ECB, RSA",      tags:["Python","2-DES MITM","RSA"],                      summary:"MITM on 2-DES (2¹¹²→2⁵⁷), ECB pattern leakage, hybrid RSA+DES.", highlights:["MITM: 2¹¹²→2⁵⁷","ECB leakage visualised","RSA+DES hybrid","O(log e) exponentiation"], github:null },
  { id:"ftp",         sev:5, cat:"PENTEST",    year:2025, title:"FTP Brute Force Lab",                        tags:["Hydra","FTP","Brute Force"],                       summary:"Anonymous FTP confirmed, Hydra vs 100k NCSC wordlist, zero lockout.", highlights:["Anonymous FTP confirmed","100k NCSC wordlist","Zero lockout resistance","Fail2Ban+SFTP remediation"], github:null },
  { id:"hopechain",   sev:3, cat:"OTHER",      year:2024, title:"HopeChain — Blockchain DApp",               tags:["Solidity","Ethereum"],                             summary:"Reentrancy mitigated, zkSNARK proposed, multisig+timelock governance.", highlights:["Reentrancy via transfer()","zkSNARK proposed","Multisig+timelocks","Jordan NGO compliance"], github:null },
  { id:"spark",       sev:3, cat:"OTHER",      year:2025, title:"SPARK — Wearable INR Patch",                tags:["IoT","Biomedical","Team Lead"],                    summary:"Led 6-person team. Non-invasive INR monitoring. $1.65M SOM validated.", highlights:["Led 6-person team","$1.65M SOM in $55M market","Continuous INR monitoring","AI alerts"], github:null },
];

const CERTS = [
  { name:"CDSA", full:"Certified Defensive Security Analyst",    issuer:"Hack The Box", year:"2025", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9385aaf3-d974-43d8-8144-0dca4b70746b", desc:"SOC · DFIR · SIEM · AD attack detection" },
  { name:"CWSE", full:"Certified Web Security Expert",           issuer:"Hackviser",    year:"2025", status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CWSE-D15I7TON",              desc:"OWASP Top 10 · Web app security" },
  { name:"CAPT", full:"Certified Associate Penetration Tester",  issuer:"Hackviser",    year:"2025", status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CAPT-T3O8P3JO",            desc:"Web · Network · Infrastructure pentest" },
  { name:"NCA",  full:"Nutanix Certified Associate v6",          issuer:"Nutanix",      year:"2025", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9c45a9a4-34b0-46b8-819f-25b6b053dfdd", desc:"HCI · Cloud · Virtualization" },
  { name:"CWES", full:"Certified Web Exploitation Specialist",   issuer:"Hack The Box", year:"2026", status:"active", pct:70,  url:null, desc:"Advanced web exploitation" },
  { name:"CPTS", full:"Certified Penetration Testing Specialist",issuer:"Hack The Box", year:"2026", status:"active", pct:45,  url:null, desc:"Full-scope pentest · AD attacks" },
  { name:"SEC+", full:"CompTIA Security+ SY0-701",               issuer:"CompTIA",      year:"2026", status:"queued", pct:0,   url:null, desc:"Security concepts · Risk management" },
  { name:"CCNA", full:"Cisco CCNA 200-301",                      issuer:"Cisco",        year:"2026", status:"queued", pct:0,   url:null, desc:"Network fundamentals · Routing" },
];

const ROADMAP = [
  { phase:"Phase 1", days:"Days 1–30", title:"Detection Engineering Fundamentals", status:"active",
    goal:"Build 15–20 production-grade detections for real AD attack paths.",
    weeks:[
      { w:"Week 1", t:"Lab Foundation",               items:["DC + 2 Win10 + Kali + Splunk","Sysmon on all endpoints","PowerShell Script Block Logging","AD auditing: 4662,4742,4738,4672"], d:"Lab architecture + logging baseline" },
      { w:"Week 2", t:"Initial Access & Execution",   items:["Phishing macro → PowerShell","Encoded PowerShell / IEX","Office spawning cmd/powershell"], d:"5 detection rules + MITRE mapping" },
      { w:"Week 3", t:"Privilege Escalation",         items:["UAC bypass","Scheduled tasks Event 4698","Registry run keys","Service creation"], d:"6 detection rules + alert logic" },
      { w:"Week 4", t:"Credential Access",            items:["Mimikatz+LSASS Sysmon 10","Kerberoasting 4769 RC4","Pass-the-Hash","Logon Type 9/abnormal 4672"], d:"Credential Theft Detection Pack" },
    ]},
  { phase:"Phase 2", days:"Days 31–60", title:"AD Threat Hunting", status:"upcoming",
    goal:"Build a Domain Compromise Detection Framework.",
    weeks:[
      { w:"Week 5", t:"Lateral Movement",    items:["SMB/PsExec/WMI/WinRM","ADMIN$+named pipe anomalies","Event 4624 Type 3 workstation→DC"], d:"Lateral movement detection rules" },
      { w:"Week 6", t:"DCSync & DCShadow",   items:["DCSync (4662 replication GUIDs)","DCShadow (4742/4738 anomalies)","AD object modification"], d:"Domain Compromise Detection Framework" },
      { w:"Week 7", t:"Threat Hunting",      items:["Rare logon types","Rare parent-child processes","Rare LDAP burst","Baseline vs anomaly"], d:"10 threat hunting queries" },
      { w:"Week 8", t:"SIEM Engineering",    items:["Field normalization","Multi-stage correlation","Risk-based alerting+noise reduction"], d:"3 multi-stage correlation rules" },
    ]},
  { phase:"Phase 3", days:"Days 61–90", title:"Automation & Portfolio", status:"upcoming",
    goal:"SOAR pipeline, purple team simulation, public GitHub portfolio.",
    weeks:[
      { w:"Week 9",  t:"SOAR & Case Management",  items:["TheHive+Shuffle","Alert→Case auto-creation","IP enrichment+MITRE tag"], d:"Working SOAR pipeline" },
      { w:"Week 10", t:"Purple Team Simulation",   items:["Day 1: Phishing","Day 2: Kerberoast","Day 3: Lateral Movement","Day 4: DCSync"], d:"Detection gap analysis report" },
      { w:"Week 11", t:"Detection Portfolio",      items:["GitHub: all rules","Write-ups per chain","Red vs Blue results"], d:"Public portfolio on GitHub" },
      { w:"Week 12", t:"Enterprise Readiness",     items:["LAPS+Credential Guard","Tiered AD/ESAE","Prevention mindset"], d:"Enterprise hardening checklist" },
    ]},
];

const WRITEUPS = [
  { title:"HTB CDSA — What It Really Takes to Pass", date:"Feb 2026", tags:["CDSA","Blue Team"], excerpt:"An honest account of what the CDSA exam demands — lab hours, mental pressure, what worked. No fluff.", url:"https://medium.com/@12farouq12/htb-cdsa-2025-what-it-really-takes-to-pass-the-certified-defensive-security-analyst-exam-5215213392cc", live:true },
  { title:"HTB Machine Writeup #1", date:"Mar 2026", tags:["HTB","Linux"], excerpt:"Full walkthrough from recon to root.", url:null, live:false },
  { title:"Detection Engineering: Writing Real Sigma Rules", date:"Coming", tags:["Detection","Sigma"], excerpt:"Production-grade detections for AD attack paths with MITRE mapping and FP tuning.", url:null, live:false },
];

// ── DESIGN — MAP ROOM atmosphere, EDITORIAL typography ───────
const T = {
  // Map Room foundations
  bg:       "#080C14",
  panel:    "#0D1220",
  panelHi:  "#111828",
  border:   "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.14)",

  // Editorial typography palette
  cream:    "#FAF8F3",   // editorial light sections → used for text
  navy:     "#0A0F1E",   // editorial dark
  orange:   "#E8621A",   // editorial accent

  // Map Room signal colours
  cyan:     "#00D4FF",
  green:    "#00E676",
  red:      "#FF3B3B",
  amber:    "#FFB020",

  // Text
  text:     "#F0EDE6",   // warm cream — editorial feel on dark bg
  textDim:  "#8A9AAC",
  textFaint:"#4A5868",

  // Typography — EDITORIAL
  serif:    "'Playfair Display', Georgia, serif",
  mono:     "'IBM Plex Mono', monospace",
  sans:     "'DM Sans', Helvetica, sans-serif",
};

// Category → editorial colour (from editorial design)
const CAT_COL = {
  PENTEST:   "#E05555",
  "SOC/DFIR":"#22C97A",
  CLOUD:     "#4AABDF",
  GRC:       "#F0A830",
  OTHER:     "#A060F0",
};

const SEV_COL = (s) => s >= 9 ? T.red : s >= 7 ? T.amber : s >= 5 ? T.cyan : T.textFaint;

// ── HOOKS ────────────────────────────────────────────────────
function useScroll() {
  const [y, setY] = useState(0);
  useEffect(() => { const fn = () => setY(window.scrollY); window.addEventListener("scroll", fn, { passive:true }); fn(); return () => window.removeEventListener("scroll", fn); }, []);
  return y;
}
function useInView(t=0.1) {
  const ref = useRef(null); const [v,setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold:t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return [ref, v];
}
function useCounter(target, run, ms=1500) {
  const [n,setN] = useState(0);
  useEffect(() => {
    if (!run) return; let s=null;
    const f = ts => { if(!s)s=ts; const p=Math.min((ts-s)/ms,1); setN(Math.floor((1-Math.pow(1-p,3))*target)); if(p<1)requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }, [run,target]);
  return n;
}
function Reveal({ children, delay=0 }) {
  const [r,v] = useInView();
  return <div ref={r} style={{ opacity:v?1:0, transform:v?"none":"translateY(22px)", transition:`opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>{children}</div>;
}

// ── MAP ROOM PANEL — with corner brackets ────────────────────
function Panel({ children, style={}, glow=false }) {
  const bCol = glow ? T.cyan : T.border;
  const bracket = { position:"absolute", width:12, height:12, borderColor:T.cyan, borderStyle:"solid", opacity: glow?0.7:0.35 };
  return (
    <div style={{ position:"relative", background:T.panel, border:`1px solid ${bCol}`, ...style }}>
      {/* corner brackets */}
      <div style={{ ...bracket, top:-1, left:-1, borderWidth:"1.5px 0 0 1.5px" }} />
      <div style={{ ...bracket, top:-1, right:-1, borderWidth:"1.5px 1.5px 0 0" }} />
      <div style={{ ...bracket, bottom:-1, left:-1, borderWidth:"0 0 1.5px 1.5px" }} />
      <div style={{ ...bracket, bottom:-1, right:-1, borderWidth:"0 1.5px 1.5px 0" }} />
      {children}
    </div>
  );
}

// ── PULSE DOT ────────────────────────────────────────────────
function Pulse({ color=T.cyan, size=6 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:color, boxShadow:`0 0 ${size+2}px ${color}`, animation:"pulse 2s ease infinite", flexShrink:0 }} />;
}

// ── EDITORIAL SECTION LABEL ──────────────────────────────────
// From editorial: small label + thick serif heading
function SectionHead({ number, label, title, light=false }) {
  const [r,v] = useInView();
  return (
    <div ref={r} style={{ opacity:v?1:0, transform:v?"none":"translateY(20px)", transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)", marginBottom:"clamp(36px,5vw,60px)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
        <div style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.cyan, letterSpacing:"0.28em", opacity:0.7 }}>
          {String(number).padStart(2,"0")} ──
        </div>
        <div style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.textFaint, letterSpacing:"0.22em" }}>{label}</div>
      </div>
      <h2 style={{ fontFamily:T.serif, fontSize:"clamp(2rem,6vw,4.5rem)", fontWeight:700, color: light?T.cream:T.text, lineHeight:0.92, letterSpacing:"-0.025em" }}>
        {title}
      </h2>
      {/* Editorial underline rule */}
      <div style={{ display:"flex", gap:6, marginTop:16 }}>
        <div style={{ width:40, height:2, background:T.orange }} />
        <div style={{ width:12, height:2, background:T.cyan, opacity:0.5 }} />
      </div>
    </div>
  );
}

// ── TOPOGRAPHIC GRID BACKGROUND ─────────────────────────────
function TopoGrid() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.022 }}>
        <defs>
          <pattern id="topo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30 Q15 10 30 30 Q45 50 60 30" fill="none" stroke={T.cyan} strokeWidth="0.8"/>
            <path d="M0 45 Q15 25 30 45 Q45 65 60 45" fill="none" stroke={T.cyan} strokeWidth="0.5"/>
            <path d="M0 15 Q15 -5 30 15 Q45 35 60 15" fill="none" stroke={T.cyan} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo)"/>
      </svg>
      {/* Radial glows */}
      <div style={{ position:"absolute", top:"-10%", left:"-5%", width:"50vw", height:"50vw", borderRadius:"50%", background:`radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 65%)` }} />
      <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"45vw", height:"45vw", borderRadius:"50%", background:`radial-gradient(circle, rgba(232,98,26,0.04) 0%, transparent 65%)` }} />
    </div>
  );
}

// ── NAV ──────────────────────────────────────────────────────
function Nav({ active, setActive }) {
  const scrollY = useScroll();
  const [mob, setMob] = useState(false);
  const items = ["home","about","projects","roadmap","certs","writeups"];
  const atTop = scrollY < 60;

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:800, transition:"all 0.4s", background: atTop?"transparent":"rgba(8,12,20,0.9)", backdropFilter: atTop?"none":"blur(20px)", borderBottom: atTop?"none":`1px solid ${T.border}` }}>
      <div style={{ maxWidth:1240, margin:"0 auto", padding:"0 clamp(20px,5vw,60px)", height:58, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* EDITORIAL-style wordmark */}
        <button onClick={()=>setActive("home")}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"baseline", gap:6 }}>
          <span style={{ fontFamily:T.serif, fontSize:"1.2rem", fontWeight:700, color:T.text, fontStyle:"italic" }}>Farouq</span>
          <span style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.cyan, letterSpacing:"0.15em" }}>FH-02</span>
        </button>

        {/* Map Room style nav buttons */}
        <div className="desk-nav" style={{ display:"flex", gap:2 }}>
          {items.map(s => (
            <button key={s} onClick={()=>setActive(s)}
              style={{ padding:"5px 14px", background: active===s?`${T.cyan}15`:"none", border: active===s?`1px solid ${T.cyan}40`:"1px solid transparent", color: active===s?T.cyan:T.textFaint, fontFamily:T.mono, fontSize:"0.62rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e=>{if(active!==s){e.currentTarget.style.color=T.text;e.currentTarget.style.borderColor=T.border;}}}
              onMouseLeave={e=>{if(active!==s){e.currentTarget.style.color=T.textFaint;e.currentTarget.style.borderColor="transparent";}}}>
              {s}
            </button>
          ))}
        </div>

        <button onClick={()=>setMob(o=>!o)} className="mob-btn"
          style={{ display:"none", background:"none", border:`1px solid ${T.border}`, color:T.text, padding:"6px 12px", fontFamily:T.mono, fontSize:"0.72rem", cursor:"pointer" }}>
          {mob?"✕":"☰"}
        </button>
      </div>
      {mob && (
        <div style={{ background:"rgba(8,12,20,0.98)", borderTop:`1px solid ${T.border}` }}>
          {items.map(s => (
            <button key={s} onClick={()=>{setActive(s);setMob(false);}}
              style={{ display:"block", width:"100%", textAlign:"left", padding:"13px clamp(20px,5vw,60px)", background:"none", border:"none", fontFamily:T.mono, fontSize:"0.76rem", color: active===s?T.cyan:T.textFaint, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.12em" }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── STAT BOX ─────────────────────────────────────────────────
function StatBox({ value, suffix, label, sub, delay }) {
  const [r,v] = useInView();
  const n = useCounter(value, v);
  return (
    <div ref={r} style={{ opacity:v?1:0, transition:`opacity 0.6s ease ${delay}ms` }}>
      {/* Map Room panel with editorial number typography */}
      <Panel style={{ padding:"20px" }}>
        <div style={{ fontFamily:T.serif, fontSize:"clamp(2.2rem,4vw,3rem)", fontWeight:700, color:T.text, lineHeight:1, letterSpacing:"-0.02em", marginBottom:6 }}>
          {n}{suffix}
        </div>
        <div style={{ fontFamily:T.mono, fontSize:"0.62rem", color:T.cyan, letterSpacing:"0.16em", marginBottom:2 }}>{label}</div>
        <div style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textFaint }}>{sub}</div>
      </Panel>
    </div>
  );
}

// ── HOME ─────────────────────────────────────────────────────
function HomeView() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    [100,400,700,1000,1300].forEach((t,i) => setTimeout(()=>setPhase(i+1), t));
  }, []);
  const a = (p) => ({ opacity:phase>=p?1:0, transform:phase>=p?"none":"translateY(18px)", transition:"opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)" });

  return (
    <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"100px clamp(20px,5vw,60px) 80px", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", width:"100%", position:"relative", zIndex:2 }}>

        {/* Map Room metadata strip */}
        <div style={{ ...a(1), fontFamily:T.mono, fontSize:"0.6rem", color:T.textFaint, letterSpacing:"0.2em", marginBottom:44, display:"flex", gap:18, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}><Pulse color={T.green} size={5}/><span style={{ color:"rgba(0,230,118,0.7)" }}>SYSTEM ONLINE</span></div>
          <span style={{ opacity:0.3 }}>—</span>
          <span>{ME.location}</span>
          <span style={{ opacity:0.3 }}>—</span>
          <span style={{ color:T.cyan }}>{ME.codename}</span>
          <span style={{ opacity:0.3 }}>—</span>
          <span style={{ color:T.orange }}>AVAILABLE JUNE 2026</span>
        </div>

        {/* EDITORIAL headline treatment */}
        <div style={a(2)}>
          {/* Ghost watermark behind name */}
          <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", fontFamily:T.serif, fontSize:"clamp(80px,18vw,220px)", fontWeight:700, color:"rgba(0,212,255,0.025)", lineHeight:1, userSelect:"none", pointerEvents:"none", letterSpacing:"-0.05em", whiteSpace:"nowrap" }}>
            FAROUQ
          </div>
          <h1 style={{ fontFamily:T.serif, fontSize:"clamp(3.5rem,11vw,9.5rem)", fontWeight:700, color:T.text, lineHeight:0.88, letterSpacing:"-0.04em", marginBottom:28, position:"relative" }}>
            FAROUQ<br/>
            {/* Editorial: second word gets outline treatment */}
            <span style={{ WebkitTextStroke:`1.5px ${T.text}`, color:"transparent" }}>HASSAN</span>
          </h1>
        </div>

        {/* Editorial pull-quote style tagline */}
        <div style={{ ...a(3), maxWidth:520, marginBottom:40, borderLeft:`3px solid ${T.orange}`, paddingLeft:20 }}>
          <p style={{ fontFamily:T.serif, fontSize:"clamp(1rem,2.5vw,1.4rem)", fontStyle:"italic", color:T.textDim, lineHeight:1.65, whiteSpace:"pre-line" }}>"{ME.tagline}"</p>
        </div>

        {/* Role pills — editorial category colours */}
        <div style={{ ...a(3), display:"flex", gap:8, flexWrap:"wrap", marginBottom:36 }}>
          {[["SOC Analyst",CAT_COL["SOC/DFIR"]],["Detection Engineer",T.cyan],["Penetration Tester",CAT_COL["PENTEST"]]].map(([r,c])=>(
            <span key={r} style={{ padding:"5px 14px", border:`1px solid ${c}40`, color:c, fontFamily:T.mono, fontSize:"0.66rem", letterSpacing:"0.08em", background:`${c}10` }}>
              {r}
            </span>
          ))}
        </div>

        {/* CV + links */}
        <div style={a(4)}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
            {[["↓ CV — SOC / Blue Team",ME.cvSoc,"CDSA · Detection · DFIR",true],["↓ CV — Pen Testing",ME.cvOffensive,"CPTS · CWES · Red Team",false]].map(([l,u,sub,p])=>(
              <a key={l} href={u} download
                style={{ display:"flex", flexDirection:"column", gap:3, padding:"9px 18px", border:`1px solid ${p?T.orange+"90":T.border}`, color:p?T.orange:T.textDim, background:p?`${T.orange}08`:"transparent", fontFamily:T.mono, textDecoration:"none", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=p?`${T.orange}18`:`${T.border}`;e.currentTarget.style.color=p?T.cream:T.text;}}
                onMouseLeave={e=>{e.currentTarget.style.background=p?`${T.orange}08`:"transparent";e.currentTarget.style.color=p?T.orange:T.textDim;}}>
                <span style={{ fontSize:"0.7rem", fontWeight:600 }}>{l}</span>
                <span style={{ fontSize:"0.56rem", opacity:0.55 }}>{sub}</span>
              </a>
            ))}
          </div>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            {[["LinkedIn",ME.linkedin],["GitHub",ME.github],["Email",`mailto:${ME.email}`]].map(([l,u])=>(
              <a key={l} href={u} target="_blank" rel="noreferrer"
                style={{ fontFamily:T.mono, fontSize:"0.66rem", color:T.textFaint, textDecoration:"none", letterSpacing:"0.08em", transition:"color 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.color=T.text}
                onMouseLeave={e=>e.currentTarget.style.color=T.textFaint}>
                {l} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Map Room: signal status panel — bottom right */}
      <div style={{ position:"absolute", bottom:40, right:"clamp(20px,5vw,60px)", zIndex:2, animation:"fadeIn 0.8s ease 1.5s both" }} className="signal-panel">
        <Panel style={{ padding:"14px 18px", minWidth:220 }}>
          <div style={{ fontFamily:T.mono, fontSize:"0.52rem", color:T.cyan, letterSpacing:"0.2em", marginBottom:10, opacity:0.7 }}>ACTIVE OPERATIONS</div>
          {ME.current.map((item,i)=>(
            <div key={item.l} style={{ display:"flex", justifyContent:"space-between", gap:14, padding:"5px 0", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                <Pulse color={T.green} size={4}/>
                <span style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.textDim }}>{item.l}</span>
              </div>
              <span style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.textFaint }}>{item.v}</span>
            </div>
          ))}
        </Panel>
      </div>
    </section>
  );
}

// ── ABOUT ────────────────────────────────────────────────────
function AboutView() {
  return (
    <section style={{ padding:"120px clamp(20px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={1} title="About the Analyst" label="PERSONNEL FILE" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }} className="about-grid">
          <Reveal delay={80}>
            {/* Editorial italic bio */}
            <p style={{ fontFamily:T.serif, fontSize:"clamp(0.95rem,2vw,1.1rem)", fontStyle:"italic", color:T.textDim, lineHeight:1.95, marginBottom:28 }}>
              "{ME.bio}"
            </p>
            {/* Map Room info rows */}
            {[["EDUCATION","B.Sc. Cybersecurity — HTU · Jun 2026"],["INTERNSHIP","SCC–Jordan Armed Forces · Oct 2025–Jun 2026"],["PLATFORM","HackTheBox — CDSA ✓ · CWES 70% · CPTS 45%"],["COMPETITION","Top 10 / 300+ — NCSCJO National Bootcamp"],["CONTACT",ME.email],["LANGUAGES","Arabic · English · German · Italian (beginner)"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", gap:16, padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.cyan, minWidth:90, letterSpacing:"0.1em", paddingTop:2, flexShrink:0, opacity:0.8 }}>{k}</div>
                <div style={{ fontFamily:T.mono, fontSize:"0.72rem", color:T.textDim, lineHeight:1.5 }}>{v}</div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={160}>
            {/* Stats in Map Room panels */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[["22","+","Operations","Projects executed",80],["4","","Certs Earned","Active clearances",160],["8","mo","Gov. Service","SCC–JAF internship",240],["300","+","NCSCJO","Competitors ranked against",320]].map(([v,s,l,sub,d])=>(
                <StatBox key={l} value={parseInt(v)} suffix={s} label={l} sub={sub} delay={d} />
              ))}
            </div>
            {/* Links */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[["↓ CV — SOC",ME.cvSoc,true],["↓ CV — Pentest",ME.cvOffensive,true],["→ LinkedIn",ME.linkedin,false],["→ GitHub",ME.github,false],["→ Medium",ME.medium,false]].map(([l,u,dl])=>(
                <a key={l} href={u} target={dl?"_self":"_blank"} rel="noreferrer" download={dl||undefined}
                  style={{ padding:"6px 13px", border:`1px solid ${dl?T.orange+"60":T.border}`, color:dl?T.orange:T.textFaint, fontFamily:T.mono, fontSize:"0.64rem", textDecoration:"none", letterSpacing:"0.06em", transition:"all 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=dl?T.orange:T.borderHi;e.currentTarget.style.color=dl?T.cream:T.text;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=dl?T.orange+"60":T.border;e.currentTarget.style.color=dl?T.orange:T.textFaint;}}>
                  {l}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── PROJECT CARD ─────────────────────────────────────────────
// Map Room panel structure + Editorial category colours + serif title
function ProjectCard({ p }) {
  const [exp, setExp] = useState(false);
  const catCol = CAT_COL[p.cat] || T.textDim;
  const sevCol = SEV_COL(p.sev);
  return (
    <div style={{ breakInside:"avoid", marginBottom:10 }}>
      <Panel style={{ borderTop:`2px solid ${sevCol}` }}>
        <div style={{ padding:"14px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:9, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ fontFamily:T.mono, fontSize:"0.52rem", padding:"2px 7px", background:`${sevCol}18`, color:sevCol, border:`1px solid ${sevCol}40`, letterSpacing:"0.1em" }}>SEV {p.sev}</span>
              <span style={{ fontFamily:T.mono, fontSize:"0.52rem", color:catCol, border:`1px solid ${catCol}30`, padding:"2px 7px", letterSpacing:"0.08em" }}>{p.cat}</span>
            </div>
            <span style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.textFaint }}>{p.year}</span>
          </div>

          {/* Editorial serif title */}
          <h3 style={{ fontFamily:T.serif, fontSize:"1rem", fontWeight:700, color:T.text, lineHeight:1.3, marginBottom:7, letterSpacing:"-0.01em" }}>{p.title}</h3>

          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
            {p.tags.map(t=><span key={t} style={{ fontSize:"0.52rem", padding:"2px 6px", border:`1px solid ${T.border}`, color:T.textFaint, fontFamily:T.mono }}>{t}</span>)}
          </div>

          {/* DM Sans body — editorial */}
          <p style={{ fontFamily:T.sans, fontSize:"0.78rem", color:T.textDim, lineHeight:1.8, marginBottom:10 }}>{p.summary}</p>

          {/* Expandable findings */}
          <div style={{ overflow:"hidden", maxHeight:exp?"400px":"0", transition:"max-height 0.35s ease" }}>
            <div style={{ paddingTop:10, borderTop:`1px solid ${T.border}` }}>
              {p.highlights.map((h,i)=>(
                <div key={i} style={{ display:"flex", gap:8, fontSize:"0.68rem", color:T.textDim, fontFamily:T.mono, padding:"4px 0", borderBottom:`1px solid rgba(255,255,255,0.04)`, lineHeight:1.5 }}>
                  <span style={{ color:catCol, flexShrink:0 }}>▶</span>{h}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", gap:7, marginTop:10 }}>
            <button onClick={()=>setExp(e=>!e)}
              style={{ padding:"4px 11px", background:"none", border:`1px solid ${T.border}`, color:T.textFaint, fontFamily:T.mono, fontSize:"0.6rem", cursor:"pointer", letterSpacing:"0.08em", transition:"all 0.18s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=catCol;e.currentTarget.style.color=catCol;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textFaint;}}>
              {exp?"▲ CLOSE":"▼ DETAILS"}
            </button>
            {p.github&&<a href={p.github} target="_blank" rel="noreferrer"
              style={{ padding:"4px 11px", border:`1px solid ${T.border}`, color:T.textFaint, fontFamily:T.mono, fontSize:"0.6rem", textDecoration:"none", transition:"all 0.18s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderHi;e.currentTarget.style.color=T.text;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textFaint;}}>
              ↗ GITHUB
            </a>}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ProjectsView() {
  const cats = ["ALL",...new Set(PROJECTS.map(p=>p.cat))];
  const [catF,setCatF] = useState("ALL");
  const [minSev,setMinSev] = useState(0);
  const filtered = PROJECTS.filter(p=>(catF==="ALL"||p.cat===catF)&&p.sev>=minSev).sort((a,b)=>b.sev-a.sev);

  return (
    <section style={{ padding:"120px clamp(20px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16, marginBottom:0 }}>
          <SectionHead number={2} title="Operations Log" label="CASE FILES" />
          <Reveal><div style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.textFaint, paddingBottom:60 }}>{filtered.length} / {PROJECTS.length} SHOWN</div></Reveal>
        </div>

        {/* Category filter — editorial tab style */}
        <Reveal>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCatF(c)}
                style={{ padding:"4px 13px", background: catF===c?`${CAT_COL[c]||T.cyan}18`:"transparent", border:`1px solid ${catF===c?(CAT_COL[c]||T.cyan)+"60":T.border}`, color: catF===c?(CAT_COL[c]||T.cyan):T.textFaint, fontFamily:T.mono, fontSize:"0.58rem", cursor:"pointer", letterSpacing:"0.08em", transition:"all 0.18s" }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:28, alignItems:"center" }}>
            <span style={{ fontFamily:T.mono, fontSize:"0.55rem", color:T.textFaint, letterSpacing:"0.1em" }}>MIN SEV:</span>
            {[[0,"ALL"],[5,"MED+"],[7,"HIGH+"],[9,"CRIT"]].map(([s,l])=>(
              <button key={s} onClick={()=>setMinSev(s)}
                style={{ padding:"3px 10px", background: minSev===s?"rgba(255,255,255,0.07)":"transparent", border:`1px solid ${minSev===s?T.borderHi:T.border}`, color: minSev===s?T.text:T.textFaint, fontFamily:T.mono, fontSize:"0.56rem", cursor:"pointer", transition:"all 0.18s" }}>
                {l}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Masonry — from editorial */}
        <div className="proj-cols" style={{ columns:"300px", columnGap:10 }}>
          {filtered.map((p,i)=>(
            <Reveal key={p.id} delay={Math.min(i*25,350)}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ROADMAP ──────────────────────────────────────────────────
function RoadmapView() {
  const [openPh, setOpenPh] = useState("Phase 1");
  const [openW, setOpenW] = useState(null);
  return (
    <section style={{ padding:"120px clamp(20px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={3} title="Active Investigation" label="90-DAY ROADMAP" />
        <Reveal>
          <blockquote style={{ fontFamily:T.serif, fontStyle:"italic", fontSize:"clamp(0.92rem,2vw,1.1rem)", color:T.textDim, lineHeight:1.85, maxWidth:600, marginBottom:36, borderLeft:`3px solid ${T.border}`, paddingLeft:20 }}>
            "90-Day Detection Engineering — build 15–20 production-grade rules, a Domain Compromise Detection Framework, and a public GitHub portfolio."
          </blockquote>
        </Reveal>

        {ROADMAP.map((ph,pi)=>(
          <Reveal key={ph.phase} delay={pi*60}>
            {/* Map Room panel for each phase */}
            <Panel style={{ marginBottom:8, borderLeft:`3px solid ${ph.status==="active"?T.green:T.border}` }}>
              <div onClick={()=>setOpenPh(openPh===ph.phase?null:ph.phase)}
                style={{ padding:"13px 18px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
                  {ph.status==="active"&&<Pulse color={T.green} size={6}/>}
                  <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textFaint, letterSpacing:"0.1em" }}>{ph.phase} · {ph.days}</span>
                  {/* Editorial serif phase title */}
                  <span style={{ fontFamily:T.serif, fontSize:"1rem", fontWeight:700, color:ph.status==="active"?T.text:T.textDim }}>{ph.title}</span>
                </div>
                <span style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.textFaint }}>{openPh===ph.phase?"▲":"▼"}</span>
              </div>

              {openPh===ph.phase&&(
                <div style={{ borderTop:`1px solid ${T.border}` }}>
                  <div style={{ padding:"10px 18px 12px", fontFamily:T.sans, fontSize:"0.78rem", color:T.textFaint, lineHeight:1.7, borderBottom:`1px solid ${T.border}` }}>
                    OBJECTIVE: {ph.goal}
                  </div>
                  {ph.weeks.map(w=>(
                    <div key={w.w} style={{ borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                      <div onClick={()=>setOpenW(openW===w.w?null:w.w)}
                        style={{ padding:"9px 18px 9px 28px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"background 0.15s" }}
                        onMouseEnter={e=>e.currentTarget.style.background=T.panelHi}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                          <span style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.textFaint, minWidth:50 }}>{w.w}</span>
                          <span style={{ fontFamily:T.mono, fontSize:"0.7rem", color:T.textDim }}>{w.t}</span>
                        </div>
                        <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textFaint }}>{openW===w.w?"▲":"▼"}</span>
                      </div>
                      {openW===w.w&&(
                        <div style={{ padding:"6px 18px 12px 44px" }}>
                          {w.items.map((item,i)=>(
                            <div key={i} style={{ display:"flex", gap:8, fontFamily:T.mono, fontSize:"0.66rem", color:T.textFaint, padding:"4px 0", borderBottom:`1px solid rgba(255,255,255,0.03)`, lineHeight:1.5 }}>
                              <span style={{ color:T.cyan, flexShrink:0 }}>→</span>{item}
                            </div>
                          ))}
                          <div style={{ marginTop:8, padding:"6px 12px", background:`${T.cyan}08`, border:`1px solid ${T.cyan}20`, fontFamily:T.mono, fontSize:"0.6rem", color:T.cyan }}>
                            DELIVERABLE: {w.d}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── CERTS ────────────────────────────────────────────────────
function CertsView() {
  const STATUS_COL = { earned:T.green, active:T.amber, queued:T.textFaint };
  const STATUS_LABEL = { earned:"CLEARED", active:"IN PROGRESS", queued:"QUEUED" };

  return (
    <section style={{ padding:"120px clamp(20px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={4} title="Clearance Registry" label="CREDENTIALS" />

        {["earned","active","queued"].map(g=>(
          <Reveal key={g}>
            <div style={{ marginBottom:28 }}>
              {/* Editorial section sub-label */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <Pulse color={STATUS_COL[g]} size={6}/>
                <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:STATUS_COL[g], letterSpacing:"0.18em" }}>{STATUS_LABEL[g]}</span>
              </div>

              {CERTS.filter(c=>c.status===g).map(c=>(
                <Panel key={c.name} style={{ marginBottom:6, borderLeft:`3px solid ${STATUS_COL[g]}` }}>
                  <div onClick={()=>c.url&&window.open(c.url,"_blank")}
                    style={{ padding:"13px 18px", display:"flex", gap:18, alignItems:"center", cursor:c.url?"pointer":"default", transition:"background 0.18s" }}
                    onMouseEnter={e=>{if(c.url)e.currentTarget.style.background=T.panelHi;}}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    {/* Editorial serif cert name */}
                    <div style={{ fontFamily:T.serif, fontSize:"1.2rem", fontWeight:700, color:STATUS_COL[g], minWidth:56, flexShrink:0 }}>{c.name}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:T.sans, fontSize:"0.76rem", color:T.text, marginBottom:2 }}>{c.full}</div>
                      <div style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.textFaint }}>{c.issuer} · {c.year} · {c.desc}</div>
                      {c.status==="active"&&(
                        <div style={{ marginTop:8, display:"flex", gap:10, alignItems:"center" }}>
                          <div style={{ flex:1, height:2, background:T.border }}>
                            <div style={{ width:`${c.pct}%`, height:"100%", background:`linear-gradient(90deg, ${T.amber}, ${T.cyan})` }}/>
                          </div>
                          <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.amber, flexShrink:0 }}>{c.pct}%</span>
                        </div>
                      )}
                    </div>
                    {c.url&&<span style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.cyan, flexShrink:0 }}>↗</span>}
                  </div>
                </Panel>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── WRITEUPS ─────────────────────────────────────────────────
function WriteupsView() {
  return (
    <section style={{ padding:"120px clamp(20px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={5} title="Field Dispatches" label="INTELLIGENCE REPORTS" />

        {WRITEUPS.map((w,i)=>(
          <Reveal key={w.title} delay={i*80}>
            <Panel style={{ marginBottom:10, opacity:w.live?1:0.5 }}>
              <div onClick={()=>w.live&&w.url&&window.open(w.url,"_blank")}
                style={{ padding:"22px 24px", cursor:w.live?"pointer":"default", transition:"background 0.2s" }}
                onMouseEnter={e=>{if(w.live)e.currentTarget.style.background=T.panelHi;}}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:16, marginBottom:10, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {w.tags.map(t=><span key={t} style={{ fontFamily:T.mono, fontSize:"0.52rem", padding:"2px 8px", border:`1px solid ${T.cyan}30`, color:T.cyan }}>{t}</span>)}
                    {!w.live&&<span style={{ fontFamily:T.mono, fontSize:"0.52rem", padding:"2px 8px", border:`1px solid ${T.border}`, color:T.textFaint }}>PENDING</span>}
                  </div>
                  <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textFaint }}>{w.date}</span>
                </div>
                {/* Editorial serif writeup title */}
                <h3 style={{ fontFamily:T.serif, fontSize:"clamp(1rem,2.5vw,1.5rem)", fontWeight:700, color:T.text, marginBottom:8, lineHeight:1.25, letterSpacing:"-0.01em" }}>{w.title}</h3>
                <p style={{ fontFamily:T.sans, fontSize:"0.8rem", color:T.textDim, lineHeight:1.8 }}>{w.excerpt}</p>
                {w.live&&<div style={{ marginTop:12, fontFamily:T.mono, fontSize:"0.62rem", color:T.orange }}>READ ON MEDIUM ↗</div>}
              </div>
            </Panel>
          </Reveal>
        ))}

        <Reveal delay={300}>
          <div style={{ marginTop:20, padding:"12px 0", fontFamily:T.mono, fontSize:"0.58rem", color:T.textFaint, letterSpacing:"0.12em", borderTop:`1px solid ${T.border}` }}>
            MORE REPORTS IN QUEUE — PUBLISHING REGULARLY ON MEDIUM
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("home");
  const views = { home:<HomeView/>, about:<AboutView/>, projects:<ProjectsView/>, roadmap:<RoadmapView/>, certs:<CertsView/>, writeups:<WriteupsView/> };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { font-size:16px; }
        body { background:${T.bg}; color:${T.text}; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        ::selection { background:rgba(0,212,255,0.2); }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:${T.panel}; }
        ::-webkit-scrollbar-thumb { background:rgba(0,212,255,0.25); }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes viewIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        .desk-nav { display:flex !important; }
        .mob-btn  { display:none  !important; }
        .about-grid { grid-template-columns:1fr 1fr !important; }
        .signal-panel { display:block !important; }
        .proj-cols { columns:300px; }
        @media(max-width:700px) {
          .desk-nav   { display:none  !important; }
          .mob-btn    { display:block !important; }
          .about-grid { grid-template-columns:1fr !important; }
          .signal-panel { display:none !important; }
          .proj-cols  { columns:1 !important; }
        }
      `}</style>

      <TopoGrid />
      <Nav active={active} setActive={setActive} />

      <div key={active} style={{ animation:"viewIn 0.5s cubic-bezier(0.16,1,0.3,1)", position:"relative", zIndex:2, minHeight:"100vh" }}>
        {views[active]}
      </div>

      <footer style={{ position:"relative", zIndex:2, borderTop:`1px solid ${T.border}`, padding:"24px clamp(20px,5vw,60px)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, background:T.panel }}>
        {/* Footer: editorial wordmark + Map Room metadata */}
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontFamily:T.serif, fontSize:"1rem", fontWeight:700, color:T.textDim, fontStyle:"italic" }}>Farouq Hassan</span>
          <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.cyan, letterSpacing:"0.1em", opacity:0.6 }}>FH-02 // ANALYST</span>
        </div>
        <div style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textFaint, letterSpacing:"0.1em" }}>FAROUQHASSAN.DEV · {new Date().getFullYear()}</div>
        <div style={{ display:"flex", gap:18 }}>
          {[["LinkedIn",ME.linkedin],["GitHub",ME.github],["Medium",ME.medium]].map(([l,u])=>(
            <a key={l} href={u} target="_blank" rel="noreferrer"
              style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.textFaint, textDecoration:"none", letterSpacing:"0.08em", transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color=T.text}
              onMouseLeave={e=>e.currentTarget.style.color=T.textFaint}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
