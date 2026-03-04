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
  htb: "https://profile.hackthebox.com/profile/019c57f0-d7e4-7294-9f0a-dd5497fea982",
  cvSoc: "/Farouq_Hassan_Junior_SOC_Analyst_CV.pdf",
  cvOffensive: "/Farouq_Hassan_CV_Offensive.pdf",
  tagline: "I find what's broken\nbefore the adversary does.",
  bio: "Cybersecurity student at HTU, graduating June 2026. Currently in month 5 of an 8-month internship at SCC–Jordan Armed Forces. I work both offensive and defensive tracks simultaneously - CDSA certified, CWES at 70%, CPTS at 45%. Everything I do is documented publicly.",
  testimonial: {
    quote: "Farouq approaches security with an uncommon mix of technical depth and structured thinking. He doesn't just find the vulnerability - he maps it, documents it, and explains the blast radius. That kind of analyst is rare at any experience level.",
    author: "Supervisor, SCC–Jordan Armed Forces",
    note: "(placeholder)"
  },
  current: [
    { l:"SCC-JAF Internship", v:"Month 5 / 8" },
    { l:"HTB CWES",           v:"70%" },
    { l:"HTB CPTS",           v:"45%" },
    { l:"Detection Eng.",     v:"90-day plan" },
    { l:"HTB Writeups",       v:"Weekly" },
  ],
};

const PROJECTS = [
  { id:"animeblast",  sev:9, cat:"PENTEST",  year:2024, title:"AnimeBlast - Full-Scope Pentest",            tags:["Buffer Overflow","Metasploit","SQLi","RCE"],       summary:"Custom Python BoF (EIP@1036), DEP/ASLR/SafeSEH bypass, SOCKS pivot, UNION SQLi, PHP shell→RCE. 10 flags.", highlights:["Custom BoF - EIP @ 1036 bytes","DEP+ASLR+SafeSEH bypass","SOCKS proxy pivot","UNION SQLi → credentials","PHP shell → RCE","10 flags captured"], github:"https://github.com/farouq7assan0o/Penetration-Testing-AnimeBlast-Attack-Simulation" },
  { id:"malware",     sev:9, cat:"PENTEST",  year:2024, title:"BackdoorBeacon.exe - Malware RE",            tags:["IDA Free","x32dbg","UPX","Reverse Eng."],         summary:"UPX-packed backdoor. TLS callbacks, anti-debug NOP patch, C2 IP patched to 127.0.0.1. SYN beacon confirmed.", highlights:["UPX unpack → PE analysis","Anti-debug NOP patch","C2 → 127.0.0.1","HKCU Run persistence","SSDT/IDT clean"], github:"https://github.com/farouq7assan0o/Secure-Systems-Malware-Analysis-of-BackdoorBeacon.exe" },
  { id:"irplays",     sev:9, cat:"SOC/DFIR", year:2025, title:"IR Playbooks - 3 Scenarios",                tags:["NIST IR","D3FEND","Ransomware"],                  summary:"Clinic malware, CityWorks ransomware, Bazaarjo supply-chain. ATT&CK→D3FEND. FIDO2 MFA breaks Lumma.", highlights:["Ransomware decision tree","D3FEND: FIDO2 breaks Lumma","Exec update + advisory","Closure criteria defined"], github:"https://github.com/farouq7assan0o/Incident-Response-Planning-ATT-CK-D3FEND-Mapping" },
  { id:"fair",        sev:9, cat:"GRC",      year:2024, title:"FAIR Risk - $1.38M → $177K",                tags:["FAIR","Monte Carlo","PDPL"],                     summary:"ALE before $1.38M/yr. After MFA+SIEM+training: $177K. PDPL 72hr violation found.", highlights:["ALE before: $1.38M/year","ALE after: $177K (−$1.2M)","PDPL 72hr disclosure violated","Monte Carlo simulation"], github:"https://github.com/farouq7assan0o/Risk-Analysis" },
  { id:"pcap",        sev:8, cat:"SOC/DFIR", year:2025, title:"PCAP + Memory Forensics",                   tags:["Wireshark","Volatility 3","DNS Tunneling"],       summary:"HTTP C2 beaconing, DNS TXT Base64 exfil, fileless PowerShell loader via Volatility 3 malfind.", highlights:["HTTP C2 /v1/checkin polling","DNS TXT Base64 exfil","RWX shellcode via malfind","Network+memory correlated"], github:"https://github.com/farouq7assan0o/Network-Memory-Forensics-Investigation" },
  { id:"aptintel",    sev:8, cat:"SOC/DFIR", year:2025, title:"APT29 + Lumma Stealer Intel",              tags:["MITRE ATT&CK","OSINT","APT29"],                   summary:"ATT&CK Navigator layers for SolarWinds+USAID. Nation-state vs cybercrime.", highlights:["T1195.002 supply chain - High","LSASS+token abuse - High","Lumma T1555 cred harvest","CISA+Mandiant sourced"], github:"https://github.com/farouq7assan0o/Threat-Intelligence-Analysis-MITRE-ATT-CK-Mapping" },
  { id:"cyberblast",  sev:8, cat:"PENTEST",  year:2024, title:"CyberBlast - Ethical Hacking",              tags:["Nessus","EternalBlue","SQLmap"],                  summary:"Nessus (20 findings), EternalBlue Meterpreter, UNION SQLi, XSS session hijack.", highlights:["Nessus: 20 vulns","EternalBlue → Meterpreter","UNION SQLi + XSS + RCE","MSFvenom payload"], github:"https://github.com/farouq7assan0o/Ethical-Hacking" },
  { id:"forensics",   sev:8, cat:"SOC/DFIR", year:2024, title:"BlackEagle - Digital Forensics",            tags:["FTK Imager","HxD","Steganography"],               summary:"NTFS manual recovery, DOCX inside PNG stego, hidden message decoded. Chain of custody.", highlights:["NTFS mirror manual recovery","DOCX inside PNG stego","Hidden message decoded","Hash verified throughout"], github:"https://github.com/farouq7assan0o/Digital-Forensics-Investigation" },
  { id:"otps3",       sev:8, cat:"CLOUD",    year:2025, title:"Secure OTP S3 System",                      tags:["S3","OTP","OWASP A01/A07"],                       summary:"4 critical vulns fixed: OTP in response, no expiry, brute-force, predictable path.", highlights:["OTP removed from API response","5-min expiry+single-use","Rate limit: 5 attempts","uuid4+presigned URL"], github:"https://github.com/farouq7assan0o/Secure-OTP-Based-Historical-Data-Retrieval-System" },
  { id:"sqli",        sev:7, cat:"PENTEST",  year:2025, title:"Banking SQLi + Red Team Plan",              tags:["SQLi","Auth Bypass","Kill Chain"],                summary:"Manual SQLi, full banking ROE, complete Cyber Kill Chain OSINT→C2→exfil.", highlights:["Auth bypass via SQLi","UNION SELECT credentials","Banking ROE documented","Full Kill Chain mapped"], github:"https://github.com/farouq7assan0o/Security-Assessment-Red-Team-Take-Home-Assignment" },
  { id:"governance",  sev:7, cat:"GRC",      year:2025, title:"BazaarJo Governance Gap Assessment",        tags:["ISO 27014","PDPL","PCI DSS"],                    summary:"7 deficiencies: no SoD, no CISO accountability, no breach policy. 12-month roadmap.", highlights:["7 governance gaps","SoD: devs → prod unilateral","No PDPL breach notification","Board brief with roadmap"], github:"https://github.com/farouq7assan0o/Governance-Compliance-Breakdown-Review" },
  { id:"risk",        sev:7, cat:"GRC",      year:2025, title:"Enterprise Risk Management Plan",           tags:["ISO 27005","NIST 800-30","KRIs"],                 summary:"ISO 27005+NIST 800-30. 6 risks rated, If-Then statements, KRIs defined.", highlights:["PII: Critical H×H","If-Then: git → injection","KRIs: MFA%, deploys","Quarterly board reporting"], github:"https://github.com/farouq7assan0o/Enterprise-Risk-Management-Plan-Risk-Assessment" },
  { id:"privesc",     sev:7, cat:"PENTEST",  year:2025, title:"Linux Privilege Escalation",                tags:["LinPEAS","Kernel Exploit","Netcat"],              summary:"Kernel 2.6.32 → Exploit-DB 18411 → LPE compiled and executed on target.", highlights:["Kernel 2.6.32 confirmed","Exploit-DB 18411 LPE","BoF LPE executed","4 transfer methods"], github:"https://github.com/farouq7assan0o/File-Transfer-Techniques-Privilege-Escalation" },
  { id:"bia",         sev:6, cat:"GRC",      year:2025, title:"Business Impact Analysis",                  tags:["BIA","RTO/RPO","PCI DSS"],                       summary:"6 processes. Payment RTO 15min/RPO 0–5min. IR: RTO 15min/RPO 0.", highlights:["Payment RTO 15/RPO 0–5","IR RTO 15/RPO 0","Orders RTO 30/RPO 5","Recovery order defined"], github:"https://github.com/farouq7assan0o/Business-Impact-Analysis-BIA-" },
  { id:"isms",        sev:6, cat:"GRC",      year:2024, title:"ISMS Design - Bluefrontier Bank",           tags:["ISO 27001","COBIT 2019","BIA"],                  summary:"ISO 27001 full scope. COBIT 7-phase. BIA 6 processes. 3-stage audit. ROI.", highlights:["ISO 27001 full scope","COBIT 2019: 7-phase","BIA: 6 processes","Executive ROI quantified"], github:"https://github.com/farouq7assan0o/Information-Security-Management-System-ISMS-Design-Bluefrontier-Bank" },
  { id:"semgrep",     sev:5, cat:"PENTEST",  year:2025, title:"Semgrep SAST - 41 Findings",               tags:["Semgrep","SAST","DevSecOps"],                    summary:"41 findings across 1015 files in Juice Shop. Sequelize SQLi detected.", highlights:["41 findings, 1015 files","Sequelize SQLi detected","Push-triggered CI/CD","Parameterized query fix"], github:"https://github.com/farouq7assan0o/Integrating-Semgrep-SAST-into-GitHub-Actions-Juice-Shop-" },
  { id:"apache",      sev:5, cat:"CLOUD",    year:2025, title:"Apache + SSH Hardening (CIS)",              tags:["Apache 2.4","CIS Benchmark","SSH"],               summary:"5 Apache misconfigs fixed. SSH: key-only, no root, chacha20+aes256-gcm.", highlights:["5 CIS findings fixed","TraceEnable Off + no indexes","/server-status → 403","Key-only SSH, no root"], github:"https://github.com/farouq7assan0o/Web-Server-SSH-Hardening-CIS-Aligned-" },
  { id:"airline",     sev:5, cat:"SOC/DFIR", year:2024, title:"Secure Airline Check-in System",            tags:["Java","SHA-256","JUnit","RBAC"],                 summary:"SHA-256+salt, 3-strike lockout, RBAC 4 roles, 100k fuzz test, PMD SAST.", highlights:["SHA-256+salt","3-strike lockout","RBAC: 4 roles","100k fuzz test"], github:"https://github.com/farouq7assan0o/SecureCoding" },
  { id:"network",     sev:5, cat:"CLOUD",    year:2023, title:"Enterprise Network Security Design",        tags:["Cisco","IPsec VPN","ASA Firewall"],               summary:"5-site IPsec VPN, ASA DMZ+NAT, full-mesh OSPF, VLAN segmentation.", highlights:["IPsec VPN: AES+SHA","ASA DMZ+NAT","Full-mesh OSPF","VLAN per dept"], github:"https://github.com/farouq7assan0o/Operation-System" },
  { id:"crypto",      sev:5, cat:"GRC",      year:2024, title:"Applied Cryptography - MITM, ECB, RSA",     tags:["Python","2-DES MITM","RSA"],                    summary:"MITM on 2-DES (2¹¹²→2⁵⁷), ECB pattern leakage, hybrid RSA+DES.", highlights:["MITM: 2¹¹²→2⁵⁷","ECB leakage visualised","RSA+DES hybrid","O(log e) exponentiation"], github:"https://github.com/farouq7assan0o/Crypto-Meet-in-the-Middle-Attack-DES-Modes-Secure-Messaging-Tool" },
  { id:"ftp",         sev:5, cat:"PENTEST",  year:2025, title:"FTP Brute Force Lab",                       tags:["Hydra","FTP","Brute Force"],                     summary:"Anonymous FTP confirmed, Hydra vs 100k NCSC wordlist, zero lockout.", highlights:["Anonymous FTP confirmed","100k NCSC wordlist","Zero lockout resistance","Fail2Ban+SFTP remediation"], github:"https://github.com/farouq7assan0o/FTP-Enumeration-Brute-Force-Attack" },
  { id:"hopechain",   sev:3, cat:"OTHER",    year:2024, title:"HopeChain - Blockchain DApp",              tags:["Solidity","Ethereum"],                            summary:"Reentrancy mitigated, zkSNARK proposed, multisig+timelock governance.", highlights:["Reentrancy via transfer()","zkSNARK proposed","Multisig+timelocks","Jordan NGO compliance"], github:"https://github.com/farouq7assan0o/Blockchain-HopeChain-Decentralized-Donation-Platform-on-Ethereum" },
  { id:"spark",       sev:3, cat:"OTHER",    year:2025, title:"SPARK - Wearable INR Patch",               tags:["IoT","Biomedical","Team Lead"],                  summary:"Led 6-person team. Non-invasive INR monitoring. $1.65M SOM validated.", highlights:["Led 6-person team","$1.65M SOM in $55M market","Continuous INR monitoring","AI alerts"], github:null },
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


const SKILLS = {
  "Offensive": [
    { name:"Metasploit", level:90 },{ name:"Burp Suite", level:85 },
    { name:"Nmap / Nessus", level:90 },{ name:"SQLmap", level:85 },
    { name:"Hydra", level:80 },{ name:"MSFvenom", level:80 },
    { name:"IDA Free / x32dbg", level:75 },{ name:"Volatility 3", level:80 },
  ],
  "Defensive / SOC": [
    { name:"Splunk / SIEM", level:85 },{ name:"Wireshark", level:90 },
    { name:"MITRE ATT&CK", level:90 },{ name:"MITRE D3FEND", level:80 },
    { name:"Sigma Rules", level:75 },{ name:"NIST IR", level:85 },
    { name:"Sysmon / EID", level:80 },{ name:"FTK Imager", level:80 },
  ],
  "GRC / Governance": [
    { name:"ISO 27001/27005", level:85 },{ name:"NIST 800-30", level:85 },
    { name:"FAIR Risk Model", level:80 },{ name:"PCI DSS", level:80 },
    { name:"PDPL (Jordan)", level:85 },{ name:"ISO 27014", level:80 },
    { name:"COBIT 2019", level:75 },{ name:"BIA / RTO/RPO", level:85 },
  ],
  "Dev / Cloud": [
    { name:"Python", level:80 },{ name:"Java", level:75 },
    { name:"AWS S3 / IAM", level:75 },{ name:"Semgrep SAST", level:80 },
    { name:"GitHub Actions", level:75 },{ name:"Linux CLI", level:90 },
    { name:"Cisco / Packet Tracer", level:80 },{ name:"Solidity", level:60 },
  ],
};

const ROADMAP = [
  { phase:"Phase 1", days:"Days 1–30", title:"Detection Engineering Fundamentals", status:"active",
    goal:"Build 15–20 production-grade detections for real AD attack paths.",
    weeks:[
      { w:"Week 1", t:"Lab Foundation",             items:["DC + 2 Win10 + Kali + Splunk","Sysmon on all endpoints","PowerShell Script Block Logging","AD auditing: 4662,4742,4738,4672"], d:"Lab architecture + logging baseline" },
      { w:"Week 2", t:"Initial Access & Execution", items:["Phishing macro → PowerShell","Encoded PowerShell / IEX","Office spawning cmd/powershell"], d:"5 detection rules + MITRE mapping" },
      { w:"Week 3", t:"Privilege Escalation",       items:["UAC bypass","Scheduled tasks Event 4698","Registry run keys","Service creation"], d:"6 detection rules + alert logic" },
      { w:"Week 4", t:"Credential Access",          items:["Mimikatz+LSASS Sysmon 10","Kerberoasting 4769 RC4","Pass-the-Hash","Logon Type 9/abnormal 4672"], d:"Credential Theft Detection Pack" },
    ]},
  { phase:"Phase 2", days:"Days 31–60", title:"AD Threat Hunting", status:"upcoming",
    goal:"Build a Domain Compromise Detection Framework.",
    weeks:[
      { w:"Week 5", t:"Lateral Movement",  items:["SMB/PsExec/WMI/WinRM","ADMIN$+named pipe anomalies","Event 4624 Type 3 workstation→DC"], d:"Lateral movement detection rules" },
      { w:"Week 6", t:"DCSync & DCShadow", items:["DCSync (4662 replication GUIDs)","DCShadow (4742/4738 anomalies)","AD object modification"], d:"Domain Compromise Detection Framework" },
      { w:"Week 7", t:"Threat Hunting",    items:["Rare logon types","Rare parent-child processes","Rare LDAP burst","Baseline vs anomaly"], d:"10 threat hunting queries" },
      { w:"Week 8", t:"SIEM Engineering",  items:["Field normalization","Multi-stage correlation","Risk-based alerting+noise reduction"], d:"3 multi-stage correlation rules" },
    ]},
  { phase:"Phase 3", days:"Days 61–90", title:"Automation & Portfolio", status:"upcoming",
    goal:"SOAR pipeline, purple team simulation, public GitHub portfolio.",
    weeks:[
      { w:"Week 9",  t:"SOAR & Case Management", items:["TheHive+Shuffle","Alert→Case auto-creation","IP enrichment+MITRE tag"], d:"Working SOAR pipeline" },
      { w:"Week 10", t:"Purple Team Simulation",  items:["Day 1: Phishing","Day 2: Kerberoast","Day 3: Lateral Movement","Day 4: DCSync"], d:"Detection gap analysis report" },
      { w:"Week 11", t:"Detection Portfolio",     items:["GitHub: all rules","Write-ups per chain","Red vs Blue results"], d:"Public portfolio on GitHub" },
      { w:"Week 12", t:"Enterprise Readiness",    items:["LAPS+Credential Guard","Tiered AD/ESAE","Prevention mindset"], d:"Enterprise hardening checklist" },
    ]},
];

const WRITEUPS = [
  { title:"HTB CDSA - What It Really Takes to Pass", date:"Feb 2026", tags:["CDSA","Blue Team"], excerpt:"An honest account of what the CDSA exam demands - lab hours, mental pressure, what worked. No fluff.", url:"https://medium.com/@12farouq12/htb-cdsa-2025-what-it-really-takes-to-pass-the-certified-defensive-security-analyst-exam-5215213392cc", live:true },
  { title:"HTB Machine Writeup #1", date:"Mar 2026", tags:["HTB","Linux"], excerpt:"Full walkthrough from recon to root.", url:null, live:false },
  { title:"Detection Engineering: Writing Real Sigma Rules", date:"Coming", tags:["Detection","Sigma"], excerpt:"Production-grade detections for AD attack paths with MITRE mapping and FP tuning.", url:null, live:false },
];

// ── TOKENS ───────────────────────────────────────────────────
const T = {
  // Map Room dark base
  bg:        "#080C14",
  panel:     "#0C1220",
  panelHi:   "#111828",
  border:    "#1A2540",
  borderHi:  "#243560",
  cyanGlow:  "rgba(0,212,255,0.09)",
  cyanDim:   "rgba(0,212,255,0.16)",

  // Signal colours - Map Room
  cyan:      "#00D4FF",
  green:     "#00E676",
  amber:     "#FFB020",
  red:       "#FF3B3B",
  orange:    "#E8621A",  // editorial accent

  // Text
  text:      "#E2EAF4",
  textMid:   "#8899AA",
  textDim:   "#4A5A70",

  // Typography
  syne:      "'Syne', sans-serif",         // Map Room - hero name + section heads
  serif:     "'Playfair Display', Georgia, serif", // Editorial - subheads, body titles
  mono:      "'IBM Plex Mono', monospace",
  sans:      "'DM Sans', Helvetica, sans-serif",
};

const CAT_COL = {
  PENTEST:   "#E05555",
  "SOC/DFIR":"#22C97A",
  CLOUD:     "#4AABDF",
  GRC:       "#F0A830",
  OTHER:     "#A060F0",
};
const SEV_COL = (s) => s>=9 ? T.red : s>=7 ? T.amber : s>=5 ? T.cyan : T.textDim;

// ── HOOKS ────────────────────────────────────────────────────
function useScroll() {
  const [y,setY] = useState(0);
  useEffect(()=>{ const fn=()=>setY(window.scrollY); window.addEventListener("scroll",fn,{passive:true}); fn(); return ()=>window.removeEventListener("scroll",fn); },[]);
  return y;
}
function useInView(t=0.08) {
  const ref=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){setV(true);obs.disconnect();} },{threshold:t});
    obs.observe(el); return ()=>obs.disconnect();
  },[t]);
  return [ref,v];
}
function useCounter(target, run, ms=1400) {
  const [n,setN]=useState(0);
  useEffect(()=>{
    if(!run){ setN(0); return; }
    let s=null; let raf;
    const f=ts=>{ if(!s)s=ts; const p=Math.min((ts-s)/ms,1); setN(Math.floor((1-Math.pow(1-p,3))*target)); if(p<1) raf=requestAnimationFrame(f); };
    raf=requestAnimationFrame(f);
    return ()=>cancelAnimationFrame(raf);
  },[run,target,ms]);
  return n;
}
function Reveal({ children, delay=0 }) {
  const [r,v]=useInView();
  return <div ref={r} style={{ opacity:v?1:0, transform:v?"none":"translateY(20px)", transition:`opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>{children}</div>;
}

// ── MAP ROOM PANEL - corner brackets ─────────────────────────
function Panel({ children, style={}, glow=false }) {
  const bc = glow ? T.cyan : T.border;
  const br = { position:"absolute", width:10, height:10, borderColor:T.cyan, borderStyle:"solid", opacity:glow?0.8:0.45 };
  const [hov,setHov]=useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ position:"relative", background:T.panel, borderTop:`1px solid ${hov?T.cyan+"50":bc}`, borderRight:`1px solid ${hov?T.cyan+"50":bc}`, borderBottom:`1px solid ${hov?T.cyan+"50":bc}`, borderLeft:`1px solid ${hov?T.cyan+"50":bc}`, boxShadow:hov?`0 0 20px rgba(0,212,255,0.06)`:"none", transition:"border-color 0.25s, box-shadow 0.25s", ...style }}>
      <div style={{ ...br, top:-1, left:-1, borderWidth:"1.5px 0 0 1.5px", opacity:hov?0.9:br.opacity }} />
      <div style={{ ...br, top:-1, right:-1, borderWidth:"1.5px 1.5px 0 0", opacity:hov?0.9:br.opacity }} />
      <div style={{ ...br, bottom:-1, left:-1, borderWidth:"0 0 1.5px 1.5px", opacity:hov?0.9:br.opacity }} />
      <div style={{ ...br, bottom:-1, right:-1, borderWidth:"0 1.5px 1.5px 0", opacity:hov?0.9:br.opacity }} />
      {children}
    </div>
  );
}

// ── PULSE DOT ────────────────────────────────────────────────
function Pulse({ color=T.cyan, size=6 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:color, boxShadow:`0 0 ${size+2}px ${color}`, animation:"pulseAnim 2s ease infinite", flexShrink:0 }} />;
}

// ── CURSOR TRAIL ─────────────────────────────────────────────
function CursorTrail({ clearSignal }) {
  const [dots, setDots] = useState([]);
  const id = useRef(0);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    const onTouch = () => { isTouchDevice.current = true; setDots([]); };
    window.addEventListener("touchstart", onTouch, { once: true, passive: true });
    const move = (e) => {
      if (isTouchDevice.current) return;
      setDots(prev => [...prev.slice(-18), { id: id.current++, x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  // Clear dots on every view change
  useEffect(() => { setDots([]); }, [clearSignal]);

  if (dots.length === 0) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:999, pointerEvents:"none" }}>
      {dots.map((dot, i) => {
        const ratio = i / dots.length;
        const size = 3 + ratio * 5;
        return (
          <div key={dot.id} style={{
            position:"absolute", left:dot.x, top:dot.y,
            width:size, height:size, borderRadius:"50%",
            background: ratio > 0.6 ? T.cyan : T.orange,
            opacity: ratio * 0.5,
            transform:"translate(-50%,-50%)",
            boxShadow:`0 0 ${size*2}px ${ratio > 0.6 ? T.cyan : T.orange}`,
          }} />
        );
      })}
    </div>
  );
}
function GridBg() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      {/* Sharp square grid - Map Room */}
      <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.07 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={T.cyan} strokeWidth="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      {/* Topo curves */}
      <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.025 }}>
        <defs>
          <pattern id="topo" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M0 60 Q30 20 60 60 Q90 100 120 60" fill="none" stroke={T.cyan} strokeWidth="0.8"/>
            <path d="M0 90 Q30 50 60 90 Q90 130 120 90" fill="none" stroke={T.cyan} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo)"/>
      </svg>
      {/* Radial glows */}
      <div style={{ position:"absolute", top:"-15%", left:"-10%", width:"55vw", height:"55vw", borderRadius:"50%", background:"radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)" }} />
      <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"45vw", height:"45vw", borderRadius:"50%", background:"radial-gradient(circle, rgba(232,98,26,0.06) 0%, transparent 65%)" }} />
      {/* Animated scanline sweep */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.015) 50%, transparent 100%)", backgroundSize:"100% 200%", animation:"scanline 8s ease infinite" }} />
    </div>
  );
}

// ── SECTION HEAD - Syne headline + mono label + orange rule ──
function SectionHead({ number, label, title }) {
  const [r,v]=useInView();
  return (
    <div ref={r} style={{ opacity:v?1:0, transform:v?"none":"translateY(18px)", transition:"all 0.85s cubic-bezier(0.16,1,0.3,1)", marginBottom:"clamp(32px,5vw,56px)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
        <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.cyan, letterSpacing:"0.28em", opacity:0.7 }}>{String(number).padStart(2,"0")} ──</span>
        <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textDim, letterSpacing:"0.22em" }}>{label}</span>
      </div>
      {/* Syne for the big title - Map Room energy */}
      <h2 style={{ fontFamily:T.syne, fontSize:"clamp(2rem,6vw,4rem)", fontWeight:800, color:T.text, lineHeight:0.92, letterSpacing:"-0.02em" }}>
        {title}
      </h2>
      <div style={{ display:"flex", gap:6, marginTop:14 }}>
        <div style={{ width:36, height:2, background:T.orange }} />
        <div style={{ width:10, height:2, background:T.cyan, opacity:0.5 }} />
      </div>
    </div>
  );
}

// ── NAV ──────────────────────────────────────────────────────
function Nav({ active, setActive }) {
  const scrollY = useScroll();
  const [mob,setMob] = useState(false);
  const items = ["home","about","projects","roadmap","skills","certs","writeups","contact"];
  const atTop = scrollY < 60;
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:800, transition:"all 0.4s", background:atTop?"transparent":"rgba(8,12,20,0.92)", backdropFilter:atTop?"none":"blur(20px)", borderBottom:atTop?"none":`1px solid ${T.border}` }}>
      <div style={{ maxWidth:1240, margin:"0 auto", padding:"0 clamp(16px,5vw,60px)", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Wordmark: Syne bold + mono codename */}
        <button onClick={()=>setActive("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontFamily:T.syne, fontSize:"1.1rem", fontWeight:800, color:T.text, letterSpacing:"-0.01em" }}>FH.</span>
          <span style={{ fontFamily:T.mono, fontSize:"0.55rem", color:T.cyan, letterSpacing:"0.14em", opacity:0.7 }}>ANALYST</span>
        </button>
        {/* Desktop nav */}
        <div className="desk-nav" style={{ display:"flex", gap:1 }}>
          {items.map(s=>(
            <button key={s} onClick={()=>setActive(s)}
              style={{ padding:"5px 13px", background:active===s?T.cyanDim:"transparent", border:`1px solid ${active===s?T.cyan+"50":"transparent"}`, color:active===s?T.cyan:T.textDim, fontFamily:T.mono, fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.18s" }}
              onMouseEnter={e=>{ if(active!==s){ e.currentTarget.style.color=T.text; e.currentTarget.style.borderColor=T.border; }}}
              onMouseLeave={e=>{ if(active!==s){ e.currentTarget.style.color=T.textDim; e.currentTarget.style.borderColor="transparent"; }}}>
              {s}
            </button>
          ))}
        </div>
        {/* Mobile burger */}
        <button onClick={()=>setMob(o=>!o)} className="mob-btn"
          style={{ background:"none", border:`1px solid ${T.border}`, color:T.text, padding:"5px 11px", fontFamily:T.mono, fontSize:"0.7rem", cursor:"pointer" }}>
          {mob?"✕":"☰"}
        </button>
      </div>
      {mob&&(
        <div style={{ background:"rgba(8,12,20,0.98)", borderTop:`1px solid ${T.border}` }}>
          {items.map(s=>(
            <button key={s} onClick={()=>{ setActive(s); setMob(false); }}
              style={{ display:"block", width:"100%", textAlign:"left", padding:"13px clamp(16px,5vw,60px)", background:"none", border:"none", fontFamily:T.mono, fontSize:"0.76rem", color:active===s?T.cyan:T.textDim, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.12em" }}>
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
  const [r,v]=useInView();
  const n=useCounter(value,v);
  return (
    <div ref={r} style={{ opacity:v?1:0, transition:`opacity 0.6s ease ${delay}ms` }}>
      <Panel style={{ padding:"18px 16px" }}>
        <div style={{ fontFamily:T.syne, fontSize:"clamp(1.8rem,4vw,2.6rem)", fontWeight:800, color:T.text, lineHeight:1, letterSpacing:"-0.02em", marginBottom:5 }}>
          {n}{suffix}
        </div>
        <div style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.cyan, letterSpacing:"0.16em", marginBottom:2 }}>{label}</div>
        <div style={{ fontFamily:T.mono, fontSize:"0.52rem", color:T.textDim }}>{sub}</div>
      </Panel>
    </div>
  );
}

// ── HOME ─────────────────────────────────────────────────────
function HomeView() {
  const [phase,setPhase]=useState(0);
  const [mouse,setMouse]=useState({ x:50, y:50 });
  useEffect(()=>{ [100,400,700,1000,1300].forEach((t,i)=>setTimeout(()=>setPhase(i+1),t)); },[]);
  const a=(p)=>({ opacity:phase>=p?1:0, transform:phase>=p?"none":"translateY(16px)", transition:"opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)" });
  const onMouseMove=(e)=>{ const r=e.currentTarget.getBoundingClientRect(); setMouse({ x:((e.clientX-r.left)/r.width)*100, y:((e.clientY-r.top)/r.height)*100 }); };

  return (
    <section onMouseMove={onMouseMove} style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"100px clamp(16px,5vw,60px) 80px", position:"relative", overflow:"hidden" }}>
      {/* Mouse-tracking spotlight */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(circle 600px at ${mouse.x}% ${mouse.y}%, rgba(0,212,255,0.04) 0%, transparent 70%)`, transition:"background 0.1s ease", zIndex:1 }} />
      <div style={{ maxWidth:1240, margin:"0 auto", width:"100%", position:"relative", zIndex:2 }}>

        {/* Map Room status strip */}
        <div style={{ ...a(1), fontFamily:T.mono, fontSize:"0.58rem", color:T.textDim, letterSpacing:"0.18em", marginBottom:40, display:"flex", gap:16, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Pulse color={T.green} size={5}/>
            <span style={{ color:"rgba(0,230,118,0.75)" }}>SYSTEM ONLINE</span>
          </div>
          <span style={{ color:T.border }}>-</span>
          <span>{ME.location}</span>
          <span style={{ color:T.border }}>-</span>
          <span style={{ color:T.cyan }}>{ME.codename}</span>
          <span style={{ color:T.border }}>-</span>
          <span style={{ color:T.orange }}>AVAILABLE JUNE 2026</span>
        </div>

        {/* Hero name - Syne (Map Room) with editorial outline treatment */}
        <div style={a(2)}>
          {/* Ghost watermark */}
          <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", fontFamily:T.syne, fontSize:"clamp(60px,18vw,200px)", fontWeight:800, color:"rgba(0,212,255,0.02)", lineHeight:1, userSelect:"none", pointerEvents:"none", letterSpacing:"-0.04em" }}>
            FAROUQ
          </div>
          <h1 className="hero-name" style={{ fontFamily:T.syne, fontWeight:800, lineHeight:0.88, letterSpacing:"-0.03em", marginBottom:28, position:"relative" }}>
            {/* FAROUQ - gradient cyan → white */}
            <span style={{ display:"block", background:`linear-gradient(135deg, ${T.cyan} 0%, #FFFFFF 55%, ${T.cyan}80 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", filter:"drop-shadow(0 0 30px rgba(0,212,255,0.3))" }}>FAROUQ</span>
            {/* HASSAN - outline only, glowing cyan */}
            <span style={{ display:"block", WebkitTextStroke:`2px ${T.cyan}`, WebkitTextFillColor:"transparent", filter:`drop-shadow(0 0 12px ${T.cyan}60)` }}>HASSAN</span>
          </h1>
        </div>

        {/* Tagline - Playfair italic pull-quote */}
        <div style={{ ...a(3), maxWidth:500, marginBottom:36, borderLeft:`3px solid ${T.orange}`, paddingLeft:18 }}>
          <p style={{ fontFamily:T.serif, fontSize:"clamp(0.95rem,2.2vw,1.25rem)", fontStyle:"italic", color:T.textMid, lineHeight:1.7, whiteSpace:"pre-line" }}>"{ME.tagline}"</p>
        </div>

        {/* Role pills */}
        <div style={{ ...a(3), display:"flex", gap:8, flexWrap:"wrap", marginBottom:32 }}>
          {[["SOC Analyst",CAT_COL["SOC/DFIR"]],["Detection Engineer",T.cyan],["Penetration Tester",CAT_COL["PENTEST"]]].map(([r,c])=>(
            <span key={r} style={{ padding:"4px 13px", border:`1px solid ${c}40`, color:c, fontFamily:T.mono, fontSize:"0.64rem", letterSpacing:"0.08em", background:`${c}0D` }}>{r}</span>
          ))}
        </div>

        {/* CV buttons */}
        <div style={a(4)}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
            {[["↓ CV - SOC / Blue Team",ME.cvSoc,"CDSA · Detection · DFIR",true],["↓ CV - Pen Testing",ME.cvOffensive,"CPTS · CWES · Red Team",false]].map(([l,u,sub,p])=>(
              <a key={l} href={u} download
                style={{ display:"flex", flexDirection:"column", gap:2, padding:"8px 16px", border:`1px solid ${p?T.orange+"90":T.border}`, color:p?T.orange:T.textMid, background:p?`${T.orange}0A`:"transparent", fontFamily:T.mono, textDecoration:"none", transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=p?`${T.orange}18`:T.cyanGlow; e.currentTarget.style.color=p?"#FAF8F3":T.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=p?`${T.orange}0A`:"transparent"; e.currentTarget.style.color=p?T.orange:T.textMid; }}>
                <span style={{ fontSize:"0.68rem", fontWeight:700 }}>{l}</span>
                <span style={{ fontSize:"0.54rem", opacity:0.5 }}>{sub}</span>
              </a>
            ))}
          </div>
          <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
            {[["LinkedIn",ME.linkedin],["GitHub",ME.github],["HTB Profile",ME.htb],["Email",`mailto:${ME.email}`]].map(([l,u])=>(
              <a key={l} href={u} target="_blank" rel="noreferrer"
                style={{ fontFamily:T.mono, fontSize:"0.64rem", color:T.textDim, textDecoration:"none", letterSpacing:"0.08em", transition:"color 0.18s" }}
                onMouseEnter={e=>e.currentTarget.style.color=T.text}
                onMouseLeave={e=>e.currentTarget.style.color=T.textDim}>
                {l} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Signal status panel - desktop bottom-right / mobile inline below */}
      <div style={{ position:"absolute", bottom:40, right:"clamp(16px,5vw,60px)", zIndex:2, animation:"fadeIn 0.8s ease 1.4s both" }} className="signal-panel">
        <Panel style={{ padding:"14px 18px", minWidth:210 }} glow>
          <div style={{ fontFamily:T.mono, fontSize:"0.5rem", color:T.cyan, letterSpacing:"0.22em", marginBottom:10, opacity:0.7 }}>ACTIVE OPERATIONS</div>
          {ME.current.map(item=>(
            <div key={item.l} style={{ display:"flex", justifyContent:"space-between", gap:12, padding:"5px 0", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <Pulse color={T.green} size={4}/>
                <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.textMid }}>{item.l}</span>
              </div>
              <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.textDim }}>{item.v}</span>
            </div>
          ))}
        </Panel>
      </div>

      {/* Signal panel mobile version - inline, 2-col grid */}
      <div style={{ marginTop:28, position:"relative", zIndex:2 }} className="signal-mob">
        <Panel style={{ padding:"14px 16px" }}>
          <div style={{ fontFamily:T.mono, fontSize:"0.5rem", color:T.cyan, letterSpacing:"0.22em", marginBottom:10, opacity:0.7 }}>ACTIVE OPERATIONS</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {ME.current.map(item=>(
              <div key={item.l} style={{ display:"flex", justifyContent:"space-between", gap:6, padding:"6px 8px", background:T.cyanGlow, border:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                  <Pulse color={T.green} size={4}/>
                  <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textMid }}>{item.l}</span>
                </div>
                <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textDim, flexShrink:0 }}>{item.v}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

// ── ABOUT ────────────────────────────────────────────────────
function AboutView() {
  return (
    <section style={{ padding:"110px clamp(16px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={1} label="PERSONNEL FILE" title="About the Analyst" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:36 }} className="about-grid">
          <Reveal delay={80}>
            <p style={{ fontFamily:T.serif, fontSize:"clamp(0.9rem,2vw,1.05rem)", fontStyle:"italic", color:T.textMid, lineHeight:2, marginBottom:24 }}>"{ME.bio}"</p>
            {[["EDUCATION","B.Sc. Cybersecurity - HTU · Jun 2026"],["INTERNSHIP","SCC–Jordan Armed Forces · Oct 2025–Jun 2026"],["PLATFORM","HackTheBox - CDSA ✓ · CWES 70% · CPTS 45%"],["COMPETITION","Top 10 / 300+ - NCSCJO National Bootcamp"],["CONTACT",ME.email],["LANGUAGES","Arabic · English · German · Italian (beginner)"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", gap:14, padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.cyan, minWidth:86, letterSpacing:"0.1em", paddingTop:2, flexShrink:0, opacity:0.8 }}>{k}</div>
                <div style={{ fontFamily:T.mono, fontSize:"0.7rem", color:T.textMid, lineHeight:1.5 }}>{v}</div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={160}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
              {[["22","+","Operations","Projects executed",80],["4","","Certs Earned","Active clearances",160],["8","mo","Gov. Service","SCC–JAF internship",240],["300","+","NCSCJO","Competitors ranked",320]].map(([v,s,l,sub,d])=>(
                <StatBox key={l} value={parseInt(v)} suffix={s} label={l} sub={sub} delay={d} />
              ))}
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {[["↓ CV - SOC",ME.cvSoc,true],["↓ CV - Pentest",ME.cvOffensive,true],["→ LinkedIn",ME.linkedin,false],["→ GitHub",ME.github,false],["→ Medium",ME.medium,false]].map(([l,u,dl])=>(
                <a key={l} href={u} target={dl?"_self":"_blank"} rel="noreferrer" download={dl||undefined}
                  style={{ padding:"5px 12px", border:`1px solid ${dl?T.orange+"60":T.border}`, color:dl?T.orange:T.textDim, fontFamily:T.mono, fontSize:"0.62rem", textDecoration:"none", letterSpacing:"0.06em", transition:"all 0.18s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=dl?T.orange:T.borderHi; e.currentTarget.style.color=dl?"#FAF8F3":T.text; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=dl?T.orange+"60":T.border; e.currentTarget.style.color=dl?T.orange:T.textDim; }}>
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
function ProjectCard({ p }) {
  const [exp,setExp]=useState(false);
  const catCol=CAT_COL[p.cat]||T.textDim;
  const sevCol=SEV_COL(p.sev);
  return (
    <div style={{ marginBottom:8 }}>
      <Panel style={{ borderTop:`2px solid ${sevCol}` }}>
        <div style={{ padding:"13px 15px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:8, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ fontFamily:T.mono, fontSize:"0.5rem", padding:"2px 6px", background:`${sevCol}18`, color:sevCol, border:`1px solid ${sevCol}40`, letterSpacing:"0.1em" }}>SEV {p.sev}</span>
              <span style={{ fontFamily:T.mono, fontSize:"0.5rem", color:catCol, border:`1px solid ${catCol}30`, padding:"2px 6px", letterSpacing:"0.08em" }}>{p.cat}</span>
            </div>
            <span style={{ fontFamily:T.mono, fontSize:"0.52rem", color:T.textDim }}>{p.year}</span>
          </div>
          {/* Serif title */}
          <h3 style={{ fontFamily:T.serif, fontSize:"0.98rem", fontWeight:700, color:T.text, lineHeight:1.3, marginBottom:6, letterSpacing:"-0.01em" }}>{p.title}</h3>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:7 }}>
            {p.tags.map(t=><span key={t} style={{ fontSize:"0.5rem", padding:"2px 5px", border:`1px solid ${T.border}`, color:T.textDim, fontFamily:T.mono }}>{t}</span>)}
          </div>
          <p style={{ fontFamily:T.sans, fontSize:"0.77rem", color:T.textMid, lineHeight:1.8, marginBottom:9 }}>{p.summary}</p>
          <div style={{ overflow:"hidden", maxHeight:exp?"400px":"0", transition:"max-height 0.35s ease" }}>
            <div style={{ paddingTop:9, borderTop:`1px solid ${T.border}` }}>
              {p.highlights.map((h,i)=>(
                <div key={i} style={{ display:"flex", gap:7, fontSize:"0.66rem", color:T.textMid, fontFamily:T.mono, padding:"4px 0", borderBottom:`1px solid rgba(255,255,255,0.03)`, lineHeight:1.5 }}>
                  <span style={{ color:catCol, flexShrink:0 }}>▶</span>{h}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:6, marginTop:9 }}>
            <button onClick={()=>setExp(e=>!e)}
              style={{ padding:"4px 10px", background:"none", border:`1px solid ${T.border}`, color:T.textDim, fontFamily:T.mono, fontSize:"0.58rem", cursor:"pointer", letterSpacing:"0.08em", transition:"all 0.16s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=catCol; e.currentTarget.style.color=catCol; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textDim; }}>
              {exp?"▲ CLOSE":"▼ DETAILS"}
            </button>
            {p.github&&<a href={p.github} target="_blank" rel="noreferrer"
              style={{ padding:"4px 10px", border:`1px solid ${T.border}`, color:T.textDim, fontFamily:T.mono, fontSize:"0.58rem", textDecoration:"none", transition:"all 0.16s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.borderHi; e.currentTarget.style.color=T.text; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textDim; }}>
              ↗ GITHUB
            </a>}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ProjectsView() {
  const cats=["ALL",...new Set(PROJECTS.map(p=>p.cat))];
  const [catF,setCatF]=useState("ALL");
  const [sevF,setSevF]=useState("ALL");
  const SEV_FILTERS=[
    {label:"ALL",  test:()=>true},
    {label:"MED+", test:s=>s>=5&&s<7},
    {label:"HIGH+",test:s=>s>=7&&s<9},
    {label:"CRIT", test:s=>s>=9},
  ];
  const filtered=PROJECTS.filter(p=>{
    const catOk=catF==="ALL"||p.cat===catF;
    const sevOk=(SEV_FILTERS.find(f=>f.label===sevF)||SEV_FILTERS[0]).test(p.sev);
    return catOk&&sevOk;
  }).sort((a,b)=>b.sev-a.sev);
  return (
    <section style={{ padding:"110px clamp(16px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, marginBottom:0 }}>
          <SectionHead number={2} label="CASE FILES" title="Operations Log" />
          <Reveal><div style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.textDim, paddingBottom:56 }}>{filtered.length} / {PROJECTS.length}</div></Reveal>
        </div>
        <Reveal>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:7 }}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCatF(c)}
                style={{ padding:"4px 12px", background:catF===c?`${CAT_COL[c]||T.cyan}18`:"transparent", border:`1px solid ${catF===c?(CAT_COL[c]||T.cyan)+"60":T.border}`, color:catF===c?(CAT_COL[c]||T.cyan):T.textDim, fontFamily:T.mono, fontSize:"0.56rem", cursor:"pointer", letterSpacing:"0.08em", transition:"all 0.16s" }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:24, alignItems:"center" }}>
            <span style={{ fontFamily:T.mono, fontSize:"0.52rem", color:T.textDim, letterSpacing:"0.1em" }}>SEV:</span>
            {SEV_FILTERS.map(({label})=>(
              <button key={label} onClick={()=>setSevF(label)}
                style={{ padding:"3px 9px", background:sevF===label?"rgba(255,255,255,0.07)":"transparent", border:`1px solid ${sevF===label?T.borderHi:T.border}`, color:sevF===label?T.text:T.textDim, fontFamily:T.mono, fontSize:"0.54rem", cursor:"pointer", transition:"all 0.16s" }}>
                {label}
              </button>
            ))}
          </div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:8 }}>
          {filtered.map((p,i)=>(
            <Reveal key={p.id} delay={Math.min(i*20,300)}>
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
  const [openPh,setOpenPh]=useState("Phase 1");
  const [openW,setOpenW]=useState(null);
  return (
    <section style={{ padding:"110px clamp(16px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={3} label="90-DAY ROADMAP" title="Active Investigation" />
        <Reveal>
          <blockquote style={{ fontFamily:T.serif, fontStyle:"italic", fontSize:"clamp(0.9rem,2vw,1.05rem)", color:T.textMid, lineHeight:1.85, maxWidth:580, marginBottom:32, borderLeft:`3px solid ${T.border}`, paddingLeft:18 }}>
            "90-Day Detection Engineering - build 15–20 production-grade rules, a Domain Compromise Detection Framework, and a public GitHub portfolio."
          </blockquote>
        </Reveal>
        {ROADMAP.map((ph,pi)=>(
          <Reveal key={ph.phase} delay={pi*60}>
            <Panel style={{ marginBottom:7, borderLeft:`3px solid ${ph.status==="active"?T.green:T.border}` }}>
              <div onClick={()=>setOpenPh(openPh===ph.phase?null:ph.phase)}
                style={{ padding:"12px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                  {ph.status==="active"&&<Pulse color={T.green} size={6}/>}
                  <span style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.textDim, letterSpacing:"0.1em" }}>{ph.phase} · {ph.days}</span>
                  {/* Syne for phase title - Map Room energy */}
                  <span style={{ fontFamily:T.syne, fontSize:"0.95rem", fontWeight:700, color:ph.status==="active"?T.text:T.textMid }}>{ph.title}</span>
                </div>
                <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.textDim, flexShrink:0 }}>{openPh===ph.phase?"▲":"▼"}</span>
              </div>
              {openPh===ph.phase&&(
                <div style={{ borderTop:`1px solid ${T.border}` }}>
                  <div style={{ padding:"9px 16px 10px", fontFamily:T.sans, fontSize:"0.76rem", color:T.textDim, lineHeight:1.7, borderBottom:`1px solid ${T.border}` }}>
                    OBJECTIVE: {ph.goal}
                  </div>
                  {ph.weeks.map(w=>(
                    <div key={w.w} style={{ borderBottom:`1px solid rgba(255,255,255,0.03)` }}>
                      <div onClick={()=>setOpenW(openW===w.w?null:w.w)}
                        style={{ padding:"8px 16px 8px 26px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"background 0.15s" }}
                        onMouseEnter={e=>e.currentTarget.style.background=T.panelHi}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
                          <span style={{ fontFamily:T.mono, fontSize:"0.52rem", color:T.textDim, minWidth:48 }}>{w.w}</span>
                          <span style={{ fontFamily:T.mono, fontSize:"0.68rem", color:T.textMid }}>{w.t}</span>
                        </div>
                        <span style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.textDim }}>{openW===w.w?"▲":"▼"}</span>
                      </div>
                      {openW===w.w&&(
                        <div style={{ padding:"6px 16px 12px clamp(16px,5vw,40px)" }}>
                          {w.items.map((item,i)=>(
                            <div key={i} style={{ display:"flex", gap:7, fontFamily:T.mono, fontSize:"0.64rem", color:T.textDim, padding:"4px 0", borderBottom:`1px solid rgba(255,255,255,0.03)`, lineHeight:1.5 }}>
                              <span style={{ color:T.cyan, flexShrink:0 }}>→</span>{item}
                            </div>
                          ))}
                          <div style={{ marginTop:8, padding:"5px 10px", background:T.cyanGlow, border:`1px solid ${T.cyan}20`, fontFamily:T.mono, fontSize:"0.58rem", color:T.cyan }}>
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

// ── SKILLS ───────────────────────────────────────────────────
function SkillsView() {
  const SKILL_COLS = { "Offensive":T.red, "Defensive / SOC":T.cyan, "GRC / Governance":T.amber, "Dev / Cloud":T.green };
  return (
    <section style={{ padding:"110px clamp(16px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={4} label="CAPABILITIES" title="Arsenal" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {Object.entries(SKILLS).map(([cat, items], ci)=>(
            <Reveal key={cat} delay={ci*80}>
              <Panel style={{ padding:"18px 16px", borderTop:`2px solid ${SKILL_COLS[cat]}` }}>
                <div style={{ fontFamily:T.mono, fontSize:"0.54rem", color:SKILL_COLS[cat], letterSpacing:"0.18em", marginBottom:14 }}>{cat.toUpperCase()}</div>
                {items.map(s=>(
                  <div key={s.name} style={{ marginBottom:9 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontFamily:T.mono, fontSize:"0.64rem", color:T.textMid }}>{s.name}</span>
                      <span style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.textDim }}>{s.level}%</span>
                    </div>
                    <div style={{ height:2, background:T.border, borderRadius:1 }}>
                      <div style={{ width:`${s.level}%`, height:"100%", background:`linear-gradient(90deg,${SKILL_COLS[cat]},${SKILL_COLS[cat]}99)`, borderRadius:1, transition:"width 1s ease" }}/>
                    </div>
                  </div>
                ))}
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CERTS ────────────────────────────────────────────────────
function CertsView() {
  const STATUS_COL   = { earned:T.green, active:T.amber, queued:T.textDim };
  const STATUS_LABEL = { earned:"CLEARED", active:"IN PROGRESS", queued:"QUEUED" };
  return (
    <section style={{ padding:"110px clamp(16px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={5} label="CREDENTIALS" title="Clearance Registry" />
        {["earned","active","queued"].map(g=>(
          <Reveal key={g}>
            <div style={{ marginBottom:26 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
                <Pulse color={STATUS_COL[g]} size={6}/>
                <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:STATUS_COL[g], letterSpacing:"0.18em" }}>{STATUS_LABEL[g]}</span>
              </div>
              {CERTS.filter(c=>c.status===g).map(c=>(
                <Panel key={c.name} style={{ marginBottom:5, borderLeft:`3px solid ${STATUS_COL[g]}` }}>
                  <div onClick={()=>c.url&&window.open(c.url,"_blank")}
                    style={{ padding:"12px 16px", display:"flex", gap:14, alignItems:"center", cursor:c.url?"pointer":"default", transition:"background 0.18s" }}
                    onMouseEnter={e=>{ if(c.url) e.currentTarget.style.background=T.panelHi; }}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    {/* Syne cert abbreviation - bold, clear, Map Room */}
                    <div style={{ fontFamily:T.syne, fontSize:"0.82rem", fontWeight:800, color:STATUS_COL[g], minWidth:46, flexShrink:0 }}>{c.name}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:T.sans, fontSize:"0.74rem", color:T.text, marginBottom:2 }}>{c.full}</div>
                      <div style={{ fontFamily:T.mono, fontSize:"0.57rem", color:T.textDim, lineHeight:1.5 }}>{c.issuer} · {c.year} · {c.desc}</div>
                      {c.status==="active"&&(
                        <div style={{ marginTop:7, display:"flex", gap:8, alignItems:"center" }}>
                          <div style={{ flex:1, height:2, background:T.border }}>
                            <div style={{ width:`${c.pct}%`, height:"100%", background:`linear-gradient(90deg, ${T.amber}, ${T.cyan})` }}/>
                          </div>
                          <span style={{ fontFamily:T.mono, fontSize:"0.57rem", color:T.amber, flexShrink:0 }}>{c.pct}%</span>
                        </div>
                      )}
                    </div>
                    <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5 }}>
                      <Pulse color={STATUS_COL[g]} size={5}/>
                      {c.url&&<span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.cyan }}>↗</span>}
                    </div>
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
    <section style={{ padding:"110px clamp(16px,5vw,60px)", position:"relative" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", position:"relative", zIndex:2 }}>
        <SectionHead number={6} label="INTELLIGENCE REPORTS" title="Field Dispatches" />
        {WRITEUPS.map((w,i)=>(
          <Reveal key={w.title} delay={i*80}>
            <Panel style={{ marginBottom:8, opacity:w.live?1:0.5 }}>
              <div onClick={()=>w.live&&w.url&&window.open(w.url,"_blank")}
                style={{ padding:"20px 22px", cursor:w.live?"pointer":"default", transition:"background 0.18s" }}
                onMouseEnter={e=>{ if(w.live) e.currentTarget.style.background=T.panelHi; }}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:14, marginBottom:9, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {w.tags.map(t=><span key={t} style={{ fontFamily:T.mono, fontSize:"0.5rem", padding:"2px 7px", border:`1px solid ${T.cyan}30`, color:T.cyan }}>{t}</span>)}
                    {!w.live&&<span style={{ fontFamily:T.mono, fontSize:"0.5rem", padding:"2px 7px", border:`1px solid ${T.border}`, color:T.textDim }}>PENDING</span>}
                  </div>
                  <span style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.textDim }}>{w.date}</span>
                </div>
                {/* Serif writeup title - editorial */}
                <h3 style={{ fontFamily:T.serif, fontSize:"clamp(0.98rem,2.5vw,1.45rem)", fontWeight:700, color:T.text, marginBottom:7, lineHeight:1.25, letterSpacing:"-0.01em" }}>{w.title}</h3>
                <p style={{ fontFamily:T.sans, fontSize:"0.78rem", color:T.textMid, lineHeight:1.8 }}>{w.excerpt}</p>
                {w.live&&<div style={{ marginTop:11, fontFamily:T.mono, fontSize:"0.6rem", color:T.orange }}>READ ON MEDIUM ↗</div>}
              </div>
            </Panel>
          </Reveal>
        ))}
        <Reveal delay={280}>
          <div style={{ marginTop:18, padding:"10px 0", fontFamily:T.mono, fontSize:"0.56rem", color:T.textDim, letterSpacing:"0.12em", borderTop:`1px solid ${T.border}` }}>
            MORE REPORTS IN QUEUE - PUBLISHING REGULARLY ON MEDIUM
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── CONTACT ──────────────────────────────────────────────────
function ContactView() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(ME.email); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <section style={{ padding:"110px clamp(16px,5vw,60px)", position:"relative", minHeight:"80vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
      <div style={{ maxWidth:780, margin:"0 auto", width:"100%", position:"relative", zIndex:2 }}>
        <SectionHead number={7} label="ESTABLISH CONTACT" title="Reach Out" />

        {/* Plain-English context - HR friendly */}
        <Reveal delay={60}>
          <p style={{ fontFamily:T.sans, fontSize:"clamp(0.9rem,2vw,1.05rem)", color:T.textMid, lineHeight:1.9, marginBottom:36, borderLeft:`3px solid ${T.orange}`, paddingLeft:18 }}>
            I'm graduating in June 2026 and open to SOC analyst, detection engineering, and junior red team roles. I'm based in Amman but open to remote. If you're hiring, collaborating, or just want to talk security - I'd like to hear from you.
          </p>
        </Reveal>

        {/* Contact options */}
        <Reveal delay={120}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10, marginBottom:28 }}>
            {[
              { label:"Email", value:ME.email, action:copy, note:copied?"✓ Copied":"Click to copy", col:T.cyan },
              { label:"LinkedIn", value:"linkedin.com/in/FarouqHassan02", href:ME.linkedin, note:"Connect & message", col:T.amber },
              { label:"GitHub", value:"github.com/farouq7assan0o", href:ME.github, note:"View my work", col:T.green },
              { label:"HackTheBox", value:"HTB Profile", href:ME.htb, note:"See my lab progress", col:T.red },
            ].map(({label,value,href,action,note,col})=>(
              <Panel key={label} style={{ borderLeft:`3px solid ${col}` }}>
                <div
                  onClick={action || (href ? ()=>window.open(href,"_blank") : undefined)}
                  style={{ padding:"16px 18px", cursor:"pointer", transition:"background 0.18s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.panelHi}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{ fontFamily:T.mono, fontSize:"0.5rem", color:col, letterSpacing:"0.2em", marginBottom:5 }}>{label}</div>
                  <div style={{ fontFamily:T.sans, fontSize:"0.82rem", color:T.text, marginBottom:4, wordBreak:"break-all" }}>{value}</div>
                  <div style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.textDim }}>{note} ↗</div>
                </div>
              </Panel>
            ))}
          </div>
        </Reveal>

        {/* Testimonial */}
        <Reveal delay={200}>
          <Panel style={{ borderLeft:`3px solid ${T.border}`, marginBottom:28 }}>
            <div style={{ padding:"20px 22px" }}>
              <div style={{ fontFamily:T.mono, fontSize:"0.48rem", color:T.textDim, letterSpacing:"0.18em", marginBottom:10 }}>FIELD REFERENCE</div>
              <p style={{ fontFamily:T.serif, fontStyle:"italic", fontSize:"clamp(0.88rem,2vw,1rem)", color:T.textMid, lineHeight:1.85, marginBottom:12 }}>
                "{ME.testimonial.quote}"
              </p>
              <div style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.textDim }}>
                - {ME.testimonial.author}
                <span style={{ color:T.orange, marginLeft:8, fontSize:"0.5rem" }}>{ME.testimonial.note}</span>
              </div>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={260}>
          <div style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.textDim, letterSpacing:"0.1em", borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
            AVAILABLE JUNE 2026 · AMMAN, JO · OPEN TO REMOTE
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [active,setActive]=useState("home");
  const [fontsLoaded,setFontsLoaded]=useState(false);
  const views={ home:<HomeView/>, about:<AboutView/>, projects:<ProjectsView/>, roadmap:<RoadmapView/>, skills:<SkillsView/>, certs:<CertsView/>, writeups:<WriteupsView/>, contact:<ContactView/> };

  // Scroll to top on every view change
  useEffect(()=>{ window.scrollTo({top:0,behavior:"instant"}); },[active]);

  // Deep link: read/write URL hash so sections are shareable
  useEffect(()=>{
    const hash = window.location.hash.replace("#","");
    const valid = Object.keys(views);
    if(hash && valid.includes(hash)) setActive(hash);
  },[]);
  useEffect(()=>{
    window.history.replaceState(null,"",`#${active}`);
  },[active]);

  // Font loading state - removes flash of unstyled text
  useEffect(()=>{
    if(document.fonts){
      document.fonts.ready.then(()=>setFontsLoaded(true));
    } else { setFontsLoaded(true); }
  },[]);

  if(!fontsLoaded) return (
    <div style={{ position:"fixed", inset:0, background:"#080C14", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }}>
      <div style={{ fontFamily:"monospace", fontSize:"0.7rem", color:"#00D4FF", letterSpacing:"0.22em", animation:"pulse 1.5s ease infinite" }}>
        INITIALIZING SYSTEM
      </div>
      <div style={{ display:"flex", gap:5 }}>
        {[0,1,2,3,4].map(i=>(
          <div key={i} style={{ width:4, height:4, borderRadius:"50%", background:"#00D4FF", opacity:0.3, animation:`pulseAnim 1.4s ease ${i*0.18}s infinite` }}/>
        ))}
      </div>
      <style>{`@keyframes pulseAnim{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Playfair+Display:ital,wght@0,700;1,400&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { font-size:16px; }
        body { background:${T.bg}; color:${T.text}; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        ::selection { background:rgba(0,212,255,0.2); }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:${T.panel}; }
        ::-webkit-scrollbar-thumb { background:rgba(0,212,255,0.3); }
        @keyframes pulseAnim { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(0.82)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes viewIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes scanline { 0%{background-position:0% 0%} 50%{background-position:0% 100%} 100%{background-position:0% 0%} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.85} 94%{opacity:1} 98%{opacity:1} 99%{opacity:0.9} }
        @keyframes nameGlow { 0%,100%{text-shadow:0 0 40px rgba(0,212,255,0.12)} 50%{text-shadow:0 0 80px rgba(0,212,255,0.28), 0 0 120px rgba(0,212,255,0.1)} }
        .hero-name { animation: nameGlow 4s ease infinite; font-size: clamp(3.5rem, 11vw, 9.5rem); }

        /* CSS classes control layout - no conflicting inline display values */
        .desk-nav     { display:flex; }
        .mob-btn      { display:none; }
        .about-grid   { grid-template-columns:1fr 1fr; }
        .signal-panel { display:block; }
        .signal-mob   { display:none; }

        @media(max-width:700px) {
          .desk-nav     { display:none !important; }
          .mob-btn      { display:block !important; }
          .about-grid   { grid-template-columns:1fr !important; }
          .signal-panel { display:none !important; }
          .signal-mob   { display:block !important; }
          .hero-name    { font-size:12vw !important; letter-spacing:-0.04em !important; }
        }
      `}</style>

      <CursorTrail clearSignal={active} />
      <GridBg />
      <Nav active={active} setActive={setActive} />

      <div key={active} style={{ animation:"viewIn 0.45s cubic-bezier(0.16,1,0.3,1)", position:"relative", zIndex:2, minHeight:"100vh" }}>
        {views[active]}
      </div>

      <footer style={{ position:"relative", zIndex:2, borderTop:`1px solid ${T.border}`, padding:"22px clamp(16px,5vw,60px)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10, background:T.panel }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontFamily:T.syne, fontSize:"1rem", fontWeight:800, color:T.textMid, letterSpacing:"-0.01em" }}>FH.</span>
          <span style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.cyan, letterSpacing:"0.12em", opacity:0.6 }}>FH-02 // ANALYST</span>
        </div>
        <div style={{ fontFamily:T.mono, fontSize:"0.54rem", color:T.textDim, letterSpacing:"0.1em" }}>FAROUQHASSAN.DEV · {new Date().getFullYear()}</div>
        <div style={{ display:"flex", gap:16 }}>
          {[["LinkedIn",ME.linkedin],["GitHub",ME.github],["Medium",ME.medium]].map(([l,u])=>(
            <a key={l} href={u} target="_blank" rel="noreferrer"
              style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.textDim, textDecoration:"none", letterSpacing:"0.08em", transition:"color 0.18s" }}
              onMouseEnter={e=>e.currentTarget.style.color=T.text}
              onMouseLeave={e=>e.currentTarget.style.color=T.textDim}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}