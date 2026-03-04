"use client";
import { useState, useEffect, useRef, useMemo } from "react";

// ─── DATA ────────────────────────────────────────────────────
const ME = {
  name:"Farouq Hassan", email:"12farouq12@gmail.com",
  linkedin:"https://www.linkedin.com/in/FarouqHassan02",
  github:"https://github.com/farouq7assan0o",
  medium:"https://medium.com/@12farouq12",
  cvSoc:"/Farouq_Hassan_Junior_SOC_Analyst_CV.pdf",
  cvOffensive:"/Farouq_Hassan_CV_Offensive.pdf",
  tagline:"I find what's broken\nbefore the adversary does.",
  bio:"Cybersecurity student at HTU, graduating June 2026. 8-month internship at the Special Communications Commission – Jordan Armed Forces. Studying offensive and defensive tracks simultaneously. CWES 70%, CPTS 45%, CDSA done. Everything documented publicly.",
};

const CERTS = [
  { name:"CDSA",  full:"Certified Defensive Security Analyst",   issuer:"Hack The Box", year:"2025", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9385aaf3-d974-43d8-8144-0dca4b70746b", desc:"SOC · DFIR · SIEM threat hunting · AD attack detection" },
  { name:"CWSE",  full:"Certified Web Security Expert",          issuer:"Hackviser",    year:"2025", status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CWSE-D15I7TON", desc:"OWASP Top 10 · Web app security testing · Bug hunting" },
  { name:"CAPT",  full:"Certified Associate Penetration Tester", issuer:"Hackviser",    year:"2025", status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CAPT-T3O8P3JO", desc:"Web · Network · Infrastructure penetration testing" },
  { name:"NCA",   full:"Nutanix Certified Associate v6",         issuer:"Nutanix",      year:"2025", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9c45a9a4-34b0-46b8-819f-25b6b053dfdd", desc:"HCI · Cloud architecture · Virtualization" },
  { name:"CWES",  full:"Certified Web Exploitation Specialist",  issuer:"Hack The Box", year:"2026", status:"active", pct:70,  url:null, desc:"Advanced web exploitation · Vulnerability chaining" },
  { name:"CPTS",  full:"Certified Penetration Testing Specialist",issuer:"Hack The Box",year:"2026", status:"active", pct:45,  url:null, desc:"Full-scope pentest · AD attacks · Professional reporting" },
  { name:"SEC+",  full:"CompTIA Security+ SY0-701",              issuer:"CompTIA",      year:"2026", status:"queued", pct:0,   url:null, desc:"Security concepts · Threats · Risk management" },
  { name:"CCNA",  full:"Cisco CCNA 200-301",                     issuer:"Cisco",        year:"2026", status:"queued", pct:0,   url:null, desc:"Network fundamentals · Routing · Switching" },
];

const WRITEUPS = [
  { title:"HTB CDSA — What It Really Takes to Pass", date:"Feb 2026", tags:["CDSA","Blue Team"], blurb:"An honest account of what the CDSA exam demands — lab hours, mental pressure, and what actually prepared me to pass.", url:"https://medium.com/@12farouq12/htb-cdsa-2025-what-it-really-takes-to-pass-the-certified-defensive-security-analyst-exam-5215213392cc", live:true },
  { title:"HTB Machine Writeup #1", date:"Mar 2026", tags:["HTB","Linux"], blurb:"Full walkthrough from recon to root.", url:null, live:false },
  { title:"Detection Engineering: Real Sigma Rules", date:"Coming", tags:["Detection","Sigma"], blurb:"Production-grade detections for AD attack paths with MITRE mapping and FP tuning.", url:null, live:false },
];

const ROADMAP_PHASES = [
  { phase:"Phase 1", days:"Days 1–30", title:"Detection Engineering Fundamentals", status:"active",
    goal:"Build 15–20 production-grade detections for real AD attack paths.",
    weeks:[
      { week:"Week 1", title:"Lab Foundation", items:["DC + 2 Win10 + Kali + Splunk","Sysmon all endpoints","PowerShell Script Block Logging","AD auditing (4662,4742,4738,4672)"], deliverable:"Lab architecture + logging baseline" },
      { week:"Week 2", title:"Initial Access & Execution", items:["Phishing macro → PowerShell","Encoded PowerShell / IEX","Office spawning cmd/powershell"], deliverable:"5 detection rules with MITRE mapping" },
      { week:"Week 3", title:"Privilege Escalation & Persistence", items:["UAC bypass","Scheduled tasks Event 4698","Registry run keys","Service creation"], deliverable:"6 detection rules + alert logic" },
      { week:"Week 4", title:"Credential Access", items:["Mimikatz + LSASS Sysmon 10","Kerberoasting 4769 RC4","Pass-the-Hash","Logon Type 9 / abnormal 4672"], deliverable:"Credential Theft Detection Pack" },
    ]},
  { phase:"Phase 2", days:"Days 31–60", title:"AD Threat Hunting", status:"upcoming",
    goal:"Build a Domain Compromise Detection Framework.",
    weeks:[
      { week:"Week 5", title:"Lateral Movement", items:["SMB/PsExec/WMI/WinRM","ADMIN$ + named pipe anomalies","Event 4624 Type 3 workstation→DC"], deliverable:"Lateral movement detection rules" },
      { week:"Week 6", title:"DCSync & DCShadow", items:["DCSync (4662 replication GUIDs)","DCShadow (4742/4738 anomalies)","AD object modification tracking"], deliverable:"Domain Compromise Detection Framework" },
      { week:"Week 7", title:"Threat Hunting Framework", items:["Rare logon types","Rare parent-child processes","Rare LDAP burst activity","Baseline vs anomaly"], deliverable:"10 threat hunting queries" },
      { week:"Week 8", title:"SIEM Engineering", items:["Field normalization","Multi-stage correlation rules","Risk-based alerting + noise reduction"], deliverable:"3 multi-stage correlation rules" },
    ]},
  { phase:"Phase 3", days:"Days 61–90", title:"Automation & Portfolio", status:"upcoming",
    goal:"SOAR pipeline, purple team sim, public GitHub portfolio.",
    weeks:[
      { week:"Week 9",  title:"SOAR & Case Management",  items:["TheHive + Shuffle","Alert→Case auto-creation","IP enrichment + MITRE tagging"], deliverable:"Working SOAR pipeline" },
      { week:"Week 10", title:"Purple Team Simulation",   items:["Day 1: Phishing","Day 2: Kerberoast","Day 3: Lateral Movement","Day 4: DCSync"], deliverable:"Detection gap analysis report" },
      { week:"Week 11", title:"Detection Portfolio",      items:["GitHub: all detection rules","Write-ups per attack chain","Red vs Blue results"], deliverable:"Public portfolio on GitHub" },
      { week:"Week 12", title:"Enterprise Readiness",     items:["LAPS + Credential Guard","Tiered AD / ESAE","Prevention mindset framework"], deliverable:"Enterprise hardening checklist" },
    ]},
];

const PROJECTS = [
  { id:"animeblast", sev:9, cat:"PENTEST",    year:2024, num:"$1.38M", title:"AnimeBlast — Full-Scope Pentest",            tags:["Buffer Overflow","Metasploit","SQLi","RCE"], blurb:"Custom Python BoF (EIP@1036), DEP/ASLR/SafeSEH bypass, SOCKS pivot, UNION SQLi, PHP shell→RCE. 10 flags.", hl:["EIP @ 1036 bytes","DEP+ASLR+SafeSEH bypass","SOCKS pivot","UNION SQLi → creds","PHP shell → RCE","10 flags"], github:null },
  { id:"cyberblast", sev:8, cat:"PENTEST",    year:2024, num:"20",     title:"CyberBlast — Ethical Hacking",               tags:["Nessus","EternalBlue","SQLmap"], blurb:"EternalBlue Meterpreter, 20 Nessus findings, SQLmap DB dump, XSS session hijack.", hl:["Nessus: 20 vulns","EternalBlue → Meterpreter","UNION SQLi + XSS + RCE","MSFvenom payload"], github:null },
  { id:"malware",    sev:9, cat:"PENTEST",    year:2024, num:"UPX",    title:"Malware Analysis — BackdoorBeacon.exe",       tags:["IDA Free","x32dbg","UPX","RE"], blurb:"UPX-packed backdoor RE. TLS callbacks, anti-debug NOP patch, C2 IP patched, SYN beacon confirmed.", hl:["UPX unpack → PE analysis","Anti-debug NOP patch","C2 → 127.0.0.1","HKCU Run persistence","SSDT/IDT clean"], github:null },
  { id:"sqli",       sev:7, cat:"PENTEST",    year:2025, num:"3",      title:"SQLi + Banking Red Team Plan",                tags:["SQLi","Auth Bypass","Kill Chain"], blurb:"Manual SQLi exploitation, full banking ROE, complete Cyber Kill Chain OSINT→C2→exfil.", hl:["Auth bypass via SQLi","UNION SELECT creds","Banking ROE documented","Full Kill Chain"], github:null },
  { id:"privesc",    sev:7, cat:"PENTEST",    year:2025, num:"18411",  title:"Linux File Transfer & Privilege Escalation",  tags:["LinPEAS","Kernel Exploit","Netcat"], blurb:"Kernel 2.6.32 → Exploit-DB 18411 → LPE compiled and executed on target.", hl:["Kernel 2.6.32 identified","Exploit-DB 18411","BoF LPE executed","4 transfer methods"], github:null },
  { id:"semgrep",    sev:5, cat:"PENTEST",    year:2025, num:"41",     title:"Semgrep SAST in GitHub Actions",              tags:["Semgrep","SAST","DevSecOps"], blurb:"41 findings across 1015 files in Juice Shop. Sequelize SQLi detected and fixed.", hl:["41 findings, 1015 files","Sequelize SQLi detected","Push-triggered CI/CD","Parameterized query fix"], github:null },
  { id:"ftp",        sev:5, cat:"PENTEST",    year:2025, num:"100k",   title:"FTP Enumeration & Brute Force Lab",           tags:["Hydra","FTP","Brute Force"], blurb:"Anonymous FTP misconfiguration confirmed, Hydra vs 100k NCSC wordlist.", hl:["Anonymous FTP confirmed","100k NCSC wordlist","Zero lockout resistance","Remediation documented"], github:null },
  { id:"pcap",       sev:8, cat:"SOC/DFIR",   year:2025, num:"C2",     title:"PCAP + Memory Forensics",                     tags:["Wireshark","Volatility 3","DNS Tunneling"], blurb:"HTTP C2 beaconing, DNS TXT Base64 exfil, fileless PowerShell loader via Volatility 3.", hl:["HTTP C2 /v1/checkin","DNS TXT Base64 exfil","RWX shellcode malfind","Network+memory correlated"], github:null },
  { id:"aptintel",   sev:8, cat:"SOC/DFIR",   year:2025, num:"APT29",  title:"APT29 & Lumma Stealer Intel",                 tags:["MITRE ATT&CK","OSINT","APT29"], blurb:"ATT&CK Navigator layers for SolarWinds + USAID campaigns. Nation-state vs cybercrime.", hl:["T1195.002 supply chain","LSASS+token abuse: High","Lumma T1555 cred harvest","CISA+Mandiant sourced"], github:null },
  { id:"irplays",    sev:9, cat:"SOC/DFIR",   year:2025, num:"3",      title:"IR Playbooks — Clinic, Ransomware, Supply Chain",tags:["NIST IR","D3FEND","Ransomware"], blurb:"Three complete IR playbooks with ATT&CK→D3FEND countermeasures and exec comms.", hl:["Ransomware decision tree","D3FEND: FIDO2 breaks Lumma","Exec update + advisory","Closure criteria all"], github:null },
  { id:"forensics",  sev:7, cat:"SOC/DFIR",   year:2024, num:"PNG",    title:"Digital Forensics — BlackEagle",              tags:["FTK Imager","HxD","Steganography"], blurb:"NTFS manual recovery via HxD, DOCX inside PNG (stego), hidden message decoded.", hl:["NTFS mirror recovery","DOCX inside PNG","Hidden message decoded","Chain of custody"], github:null },
  { id:"airline",    sev:5, cat:"SOC/DFIR",   year:2024, num:"100k",   title:"Secure Airline Check-in System",              tags:["Java","SHA-256","JUnit","RBAC"], blurb:"SHA-256+salt hashing, 3-strike lockout, RBAC 4 roles, fuzz-tested to 100k attempts.", hl:["SHA-256 + salt","3-strike lockout","RBAC 4 roles","100k fuzz test"], github:"https://github.com/farouq7assan0o/SecureCoding" },
  { id:"otps3",      sev:8, cat:"CLOUD",      year:2025, num:"4",      title:"Secure OTP S3 System",                        tags:["S3","OTP","OWASP A01/A07"], blurb:"4 critical vulns fixed: OTP in response, no expiry, brute-force, predictable S3 path.", hl:["OTP removed from response","5-min expiry+single-use","Rate limit: 5 attempts","uuid4+presigned URL"], github:null },
  { id:"apache",     sev:5, cat:"CLOUD",      year:2025, num:"CIS",    title:"Apache & SSH Hardening",                      tags:["Apache 2.4","CIS Benchmark","SSH"], blurb:"5 Apache misconfigs fixed. SSH key-only, no root, chacha20+aes256-gcm only.", hl:["5 CIS findings fixed","TraceEnable Off","/server-status → 403","Key-only SSH"], github:null },
  { id:"network",    sev:5, cat:"CLOUD",      year:2023, num:"5",      title:"Enterprise Network Security Design",          tags:["Cisco","IPsec VPN","ASA Firewall"], blurb:"5-site network: IPsec VPN, ASA DMZ+NAT, full-mesh OSPF, VLAN segmentation.", hl:["IPsec VPN AES+SHA","ASA DMZ+NAT","Full-mesh OSPF","VLAN per dept"], github:null },
  { id:"fair",       sev:9, cat:"GRC",        year:2024, num:"$1.38M", title:"FAIR Risk — Phishing Incident",               tags:["FAIR","Monte Carlo","PDPL"], blurb:"ALE before $1.38M/yr. After MFA+SIEM+training: $177K. Jordanian PDPL mapped.", hl:["ALE before: $1.38M/yr","ALE after: $177K","PDPL 72hr violation","Monte Carlo sim"], github:null },
  { id:"governance", sev:7, cat:"GRC",        year:2025, num:"7",      title:"BazaarJo Governance Gap Assessment",          tags:["ISO 27014","PDPL","PCI DSS"], blurb:"7 deficiencies found: no SoD, no CISO accountability, no breach notification.", hl:["7 governance gaps","SoD: devs → prod","No PDPL notification","Board brief"], github:null },
  { id:"risk",       sev:7, cat:"GRC",        year:2025, num:"6",      title:"Enterprise Risk Management Plan",             tags:["ISO 27005","NIST 800-30","KRIs"], blurb:"ISO 27005 + NIST 800-30. 6 risks rated, If-Then statements, KRIs defined.", hl:["PII: Critical H×H","If-Then: git → injection","KRIs: MFA%,deploys","Quarterly board"], github:null },
  { id:"bia",        sev:6, cat:"GRC",        year:2025, num:"15min",  title:"Business Impact Analysis",                   tags:["BIA","RTO/RPO","PCI DSS"], blurb:"6 processes. Payment: RTO 15min/RPO 0–5min. IR: RTO 15min/RPO 0.", hl:["Payment RTO 15/RPO 0–5","IR RTO 15/RPO 0","Orders RTO 30/RPO 5","Recovery order"], github:null },
  { id:"isms",       sev:6, cat:"GRC",        year:2024, num:"27001",  title:"ISMS Design — Bluefrontier Bank",             tags:["ISO 27001","COBIT 2019","BIA"], blurb:"Complete ISMS: risk register, KRIs, BIA, COBIT map, 3-stage audit, financial ROI.", hl:["ISO 27001 full scope","COBIT 2019: 7-phase","BIA: 6 processes","Executive ROI"], github:null },
  { id:"crypto",     sev:5, cat:"GRC",        year:2024, num:"2⁵⁷",   title:"Applied Cryptography — MITM, ECB/CBC, RSA",   tags:["Python","2-DES MITM","RSA"], blurb:"MITM on 2-DES (2¹¹²→2⁵⁷), ECB pattern leakage, hybrid RSA+DES, Square-and-Multiply.", hl:["MITM: 2¹¹² → 2⁵⁷","ECB leakage visualized","RSA+DES hybrid","O(log e) exponent"], github:null },
  { id:"hopechain",  sev:3, cat:"OTHER",      year:2024, num:"ETH",    title:"HopeChain — Blockchain DApp",                 tags:["Solidity","Ethereum"], blurb:"Reentrancy mitigated, zkSNARK privacy proposed, multisig+timelock governance.", hl:["Reentrancy via transfer()","zkSNARK proposed","Multisig + timelocks","Jordan NGO compliance"], github:null },
  { id:"spark",      sev:3, cat:"OTHER",      year:2025, num:"$1.65M", title:"SPARK — Wearable INR Monitoring",             tags:["IoT","Biomedical","Team Lead"], blurb:"Led 6-person team. Wearable INR patch. AI emergency alerts. $1.65M SOM validated.", hl:["Led 6-person team","$1.65M SOM","Continuous INR","AI alerts: patient+caregiver"], github:null },
];

// ─── BG GRADIENT STOPS (one per chapter) ────────────────────
// As you scroll through each chapter the whole page background
// morphs between these colors. Pure CSS-in-JS lerp.
const BG_STOPS = [
  { r:6,  g:6,  b:14  },  // hero    → near black / deep indigo
  { r:8,  g:14, b:10  },  // about   → very dark forest
  { r:14, g:6,  b:6   },  // projects→ very dark crimson
  { r:6,  g:10, b:18  },  // roadmap → deep navy
  { r:14, g:10, b:4   },  // certs   → very dark amber
  { r:4,  g:12, b:14  },  // writeups→ deep teal
];

function lerpBg(t) {
  // t: 0–1 across all chapters
  const total = BG_STOPS.length - 1;
  const seg = Math.min(Math.floor(t * total), total - 1);
  const f = (t * total) - seg;
  const a = BG_STOPS[seg], b = BG_STOPS[seg + 1] || BG_STOPS[total];
  const r = Math.round(a.r + (b.r - a.r) * f);
  const g = Math.round(a.g + (b.g - a.g) * f);
  const bv = Math.round(a.b + (b.b - a.b) * f);
  return `rgb(${r},${g},${bv})`;
}

// ─── HOOKS ───────────────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive:true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

function useDocHeight() {
  const [h, setH] = useState(1);
  useEffect(() => {
    const fn = () => setH(document.documentElement.scrollHeight - window.innerHeight);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return h;
}

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function useCounter(target, run, ms = 1500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let s = null;
    const f = ts => { if (!s) s = ts; const p = Math.min((ts-s)/ms, 1); setN(Math.floor((1-Math.pow(1-p,3))*target)); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }, [run, target]);
  return n;
}

// ─── PINNED VERTICAL NAME ────────────────────────────────────
function PinnedName({ scrollProgress }) {
  // Rotates slightly as you scroll — feels alive
  const rot = scrollProgress * -12;
  return (
    <div style={{ position:"fixed", left:"clamp(12px,2.5vw,32px)", top:"50%", transform:`translateY(-50%) rotate(${rot}deg)`, zIndex:400, transformOrigin:"center center", transition:"transform 0.1s linear", pointerEvents:"none" }} className="pinned-name">
      <div style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"clamp(0.55rem,1.1vw,0.85rem)", fontWeight:700, color:"rgba(255,255,255,0.12)", letterSpacing:"0.25em", textTransform:"uppercase", writingMode:"vertical-rl", textOrientation:"mixed", userSelect:"none" }}>
        FAROUQ HASSAN
      </div>
    </div>
  );
}

// ─── PROGRESS RAIL ───────────────────────────────────────────
function ProgressRail({ progress, sections, activeSection }) {
  return (
    <div style={{ position:"fixed", right:"clamp(12px,2.5vw,28px)", top:"50%", transform:"translateY(-50%)", zIndex:400, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }} className="progress-rail">
      {/* Rail line */}
      <div style={{ position:"relative", width:1, height:120, background:"rgba(255,255,255,0.08)" }}>
        <div style={{ position:"absolute", top:0, left:0, width:"100%", background:"rgba(255,255,255,0.55)", height:`${progress*100}%`, transition:"height 0.15s linear" }} />
      </div>
      {/* Section dots */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {sections.map((s, i) => (
          <div key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior:"smooth" })}
            title={s.label}
            style={{ width:5, height:5, borderRadius:"50%", background: activeSection===i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)", transition:"all 0.3s", cursor:"pointer", transform: activeSection===i ? "scale(1.6)" : "scale(1)" }} />
        ))}
      </div>
    </div>
  );
}

// ─── CHAPTER HEADING ─────────────────────────────────────────
function ChapterHead({ number, title, sub }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ marginBottom:"clamp(48px,6vw,80px)", opacity: vis?1:0, transform: vis?"none":"translateY(30px)", transition:"all 1s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.2)", letterSpacing:"0.25em", marginBottom:16, display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"4rem", fontWeight:700, color:"rgba(255,255,255,0.04)", lineHeight:1, marginRight:4 }}>{String(number).padStart(2,"0")}</span>
        <div>
          <div style={{ color:"rgba(255,255,255,0.2)", letterSpacing:"0.25em", fontSize:"0.58rem" }}>{sub}</div>
          <h2 style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"clamp(2.2rem,6vw,5.5rem)", fontWeight:700, color:"#fff", lineHeight:0.92, letterSpacing:"-0.03em", marginTop:4 }}>
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

// ─── REVEAL ──────────────────────────────────────────────────
function Reveal({ children, delay=0, y=28 }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transform:vis?"none":`translateY(${y}px)`, transition:`opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── BIG WATERMARK NUMBER ────────────────────────────────────
function Watermark({ children, align="right" }) {
  return (
    <div style={{ position:"absolute", [align==="right"?"right":"left"]:-20, top:"50%", transform:"translateY(-50%)", fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"clamp(80px,14vw,180px)", fontWeight:700, color:"rgba(255,255,255,0.025)", lineHeight:1, userSelect:"none", pointerEvents:"none", letterSpacing:"-0.04em", zIndex:0 }}>
      {children}
    </div>
  );
}

// ─── STAT COUNTER ────────────────────────────────────────────
function Stat({ value, suffix, label, delay }) {
  const [ref, vis] = useInView();
  const n = useCounter(value, vis);
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transition:`opacity 0.6s ease ${delay}ms` }}>
      <div style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"clamp(2.8rem,6vw,5rem)", fontWeight:700, color:"#fff", lineHeight:1, letterSpacing:"-0.03em" }}>{n}{suffix}</div>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.62rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.14em", textTransform:"uppercase", marginTop:8 }}>{label}</div>
    </div>
  );
}

// ─── PROJECT CARD ────────────────────────────────────────────
const SEV_COL = s => s>=9?"#FF3838":s>=7?"#FF9000":s>=5?"#38C4FF":"#666";

function ProjectCard({ p }) {
  const [exp, setExp] = useState(false);
  const col = SEV_COL(p.sev);
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transition:"opacity 0.6s ease", breakInside:"avoid", marginBottom:8 }}>
      <div style={{ borderTop:`2px solid ${col}`, border:`1px solid rgba(255,255,255,0.07)`, borderTop:`2px solid ${col}`, background:"rgba(255,255,255,0.025)", backdropFilter:"blur(4px)", transition:"background 0.2s" }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.045)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.025)"}>
        <div style={{ padding:"14px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:8, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              <span style={{ fontSize:"0.54rem", padding:"2px 7px", background:`${col}18`, color:col, fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.1em", border:`1px solid ${col}40` }}>SEV {p.sev}</span>
              <span style={{ fontSize:"0.54rem", padding:"2px 7px", color:"rgba(255,255,255,0.35)", fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.1em", border:"1px solid rgba(255,255,255,0.1)" }}>{p.cat}</span>
            </div>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.56rem", color:"rgba(255,255,255,0.2)" }}>{p.year}</span>
          </div>
          <h3 style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"0.92rem", fontWeight:700, color:"#fff", marginBottom:7, lineHeight:1.25 }}>{p.title}</h3>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
            {p.tags.map(t=><span key={t} style={{ fontSize:"0.54rem", padding:"2px 6px", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.25)", fontFamily:"'IBM Plex Mono',monospace" }}>{t}</span>)}
          </div>
          <p style={{ fontFamily:"'DM Sans','Helvetica',sans-serif", fontSize:"0.79rem", color:"rgba(255,255,255,0.45)", lineHeight:1.75 }}>{p.blurb}</p>
          <div style={{ overflow:"hidden", maxHeight:exp?"400px":"0", transition:"max-height 0.35s ease" }}>
            <div style={{ paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:10 }}>
              {p.hl.map((h,i)=>(
                <div key={i} style={{ display:"flex", gap:8, fontSize:"0.69rem", color:"rgba(255,255,255,0.38)", fontFamily:"'IBM Plex Mono',monospace", padding:"3px 0", borderBottom:i<p.hl.length-1?"1px solid rgba(255,255,255,0.04)":"none", lineHeight:1.5 }}>
                  <span style={{ color:col, flexShrink:0 }}>▶</span>{h}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:6, marginTop:10 }}>
            <button onClick={()=>setExp(e=>!e)}
              style={{ padding:"3px 10px", background:"none", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.3)", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", cursor:"pointer", letterSpacing:"0.08em", transition:"all 0.18s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=col;e.currentTarget.style.color=col;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.3)";}}>
              {exp?"▲ CLOSE":"▼ DETAILS"}
            </button>
            {p.github&&<a href={p.github} target="_blank" rel="noreferrer" style={{ padding:"3px 10px", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.3)", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", textDecoration:"none", transition:"all 0.18s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.6)";e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.3)";}}>↗ GITHUB</a>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CERT ROW ────────────────────────────────────────────────
function CertRow({ cert }) {
  const col = cert.status==="earned"?"rgba(0,230,118,0.85)":cert.status==="active"?"rgba(255,176,32,0.85)":"rgba(255,255,255,0.2)";
  return (
    <div onClick={()=>cert.url&&window.open(cert.url,"_blank")}
      style={{ padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:20, alignItems:"center", cursor:cert.url?"pointer":"default", transition:"opacity 0.2s" }}
      onMouseEnter={e=>{if(cert.url)e.currentTarget.style.opacity="0.75";}}
      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
      <div style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"1.1rem", fontWeight:700, color:col, minWidth:60, flexShrink:0 }}>{cert.name}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.72rem", color:"rgba(255,255,255,0.7)", marginBottom:3 }}>{cert.full}</div>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.25)" }}>{cert.issuer} · {cert.year} · {cert.desc}</div>
        {cert.status==="active"&&<div style={{ marginTop:8, display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ flex:1, height:2, background:"rgba(255,255,255,0.08)" }}>
            <div style={{ width:`${cert.pct}%`, height:"100%", background:`linear-gradient(90deg,rgba(255,176,32,0.8),rgba(56,196,255,0.8))` }}/>
          </div>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", color:"rgba(255,176,32,0.8)", flexShrink:0 }}>{cert.pct}%</span>
        </div>}
      </div>
      <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
        <div style={{ width:5,height:5,borderRadius:"50%",background:col }} />
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.56rem", color:col, letterSpacing:"0.1em" }}>
          {cert.status==="earned"?"CLEARED":cert.status==="active"?"ACTIVE":"QUEUED"}
        </span>
        {cert.url&&<span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.7rem" }}>↗</span>}
      </div>
    </div>
  );
}

// ─── ROADMAP WEEK ────────────────────────────────────────────
function RoadWeek({ w }) {
  const [open,setOpen] = useState(false);
  return (
    <div style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <div onClick={()=>setOpen(o=>!o)}
        style={{ padding:"10px 0", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"opacity 0.15s" }}
        onMouseEnter={e=>e.currentTarget.style.opacity="0.7"}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
        <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.58rem", color:"rgba(255,255,255,0.2)", minWidth:52 }}>{w.week}</span>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.74rem", color:"rgba(255,255,255,0.55)" }}>{w.title}</span>
        </div>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.58rem", color:"rgba(255,255,255,0.2)" }}>{open?"▲":"▼"}</span>
      </div>
      {open&&<div style={{ paddingLeft:68, paddingBottom:12 }}>
        {w.items.map((item,i)=>(
          <div key={i} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.68rem", color:"rgba(255,255,255,0.28)", padding:"3px 0", display:"flex", gap:8, lineHeight:1.5 }}>
            <span style={{ color:"rgba(56,196,255,0.5)", flexShrink:0 }}>→</span>{item}
          </div>
        ))}
        <div style={{ marginTop:8, padding:"6px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.28)" }}>
          DELIVERABLE: {w.deliverable}
        </div>
      </div>}
    </div>
  );
}

function RoadPhase({ ph, idx }) {
  const [open,setOpen] = useState(ph.status==="active");
  const isActive = ph.status==="active";
  return (
    <Reveal delay={idx*60}>
      <div style={{ marginBottom:6, border:`1px solid ${isActive?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.04)"}` }}>
        <div onClick={()=>setOpen(o=>!o)}
          style={{ padding:"14px 20px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", background:isActive?"rgba(255,255,255,0.025)":"transparent", userSelect:"none" }}>
          <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
            {isActive&&<div style={{ width:6,height:6,borderRadius:"50%",background:"rgba(0,230,118,0.8)" }}/>}
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.58rem", color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em" }}>{ph.phase} · {ph.days}</span>
            <span style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"0.95rem", fontWeight:700, color:isActive?"#fff":"rgba(255,255,255,0.45)" }}>{ph.title}</span>
          </div>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.62rem", color:"rgba(255,255,255,0.2)" }}>{open?"▲":"▼"}</span>
        </div>
        {open&&<div style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ padding:"10px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.68rem", color:"rgba(255,255,255,0.28)", lineHeight:1.6 }}>
            OBJECTIVE: {ph.goal}
          </div>
          <div style={{ padding:"4px 20px" }}>
            {ph.weeks.map(w=><RoadWeek key={w.week} w={w} />)}
          </div>
        </div>}
      </div>
    </Reveal>
  );
}

// ─── NAV ─────────────────────────────────────────────────────
function Nav({ activeSection, sections }) {
  const scrollY = useScrollY();
  const [mob, setMob] = useState(false);
  const atTop = scrollY < 80;

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:800, transition:"all 0.4s", background:atTop?"transparent":"rgba(0,0,0,0.75)", backdropFilter:atTop?"none":"blur(20px)", borderBottom:atTop?"none":"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 clamp(48px,6vw,80px)", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={()=>document.getElementById("hero")?.scrollIntoView({behavior:"smooth"})}
          style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"1rem", fontWeight:700, color:"#fff", letterSpacing:"0.04em" }}>
          FH<span style={{ opacity:0.3 }}>.</span>
        </button>
        <div className="desk-nav" style={{ display:"flex", gap:4 }}>
          {sections.map((s,i)=>(
            <button key={s.id}
              onClick={()=>document.getElementById(s.id)?.scrollIntoView({behavior:"smooth"})}
              style={{ padding:"5px 12px", background:activeSection===i?"rgba(255,255,255,0.07)":"none", border:"none", color:activeSection===i?"#fff":"rgba(255,255,255,0.38)", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"}
              onMouseLeave={e=>{if(activeSection!==i)e.currentTarget.style.color="rgba(255,255,255,0.38)";}}>
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={()=>setMob(o=>!o)} className="mob-btn"
          style={{ display:"none", background:"none", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", padding:"6px 12px", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.72rem", cursor:"pointer" }}>
          {mob?"✕":"☰"}
        </button>
      </div>
      {mob&&<div style={{ background:"rgba(0,0,0,0.96)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        {sections.map((s,i)=>(
          <button key={s.id}
            onClick={()=>{document.getElementById(s.id)?.scrollIntoView({behavior:"smooth"});setMob(false);}}
            style={{ display:"block", width:"100%", textAlign:"left", padding:"13px clamp(48px,6vw,80px)", background:"none", border:"none", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.78rem", color:activeSection===i?"#fff":"rgba(255,255,255,0.38)", cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.1em" }}>
            {s.label}
          </button>
        ))}
      </div>}
    </nav>
  );
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const scrollY = useScrollY();
  const docH = useDocHeight();
  const progress = docH > 0 ? Math.min(scrollY / docH, 1) : 0;
  const bgColor = lerpBg(progress);

  const sections = [
    { id:"hero",     label:"Home" },
    { id:"about",    label:"About" },
    { id:"projects", label:"Projects" },
    { id:"roadmap",  label:"Roadmap" },
    { id:"certs",    label:"Certs" },
    { id:"writeups", label:"Writeups" },
  ];

  // Determine active section from scroll position
  const [activeSection, setActiveSection] = useState(0);
  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id));
    const active = els.reduce((best, el, i) => {
      if (!el) return best;
      const top = el.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.5 && top > -el.offsetHeight * 0.5) return i;
      return best;
    }, 0);
    setActiveSection(active);
  }, [scrollY]);

  // Project filter state
  const [catF, setCatF] = useState("ALL");
  const cats = ["ALL", ...new Set(PROJECTS.map(p => p.cat))];
  const filtered = PROJECTS.filter(p => catF === "ALL" || p.cat === catF).sort((a,b) => b.sev - a.sev);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { font-size:16px; scroll-behavior:smooth; }
        body { background:#06060e; color:#fff; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        ::selection { background:rgba(255,255,255,0.12); }
        ::-webkit-scrollbar { width:2px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.2); }
        .desk-nav { display:flex !important; }
        .mob-btn  { display:none  !important; }
        .pinned-name { display:block; }
        .progress-rail { display:flex; }
        @media(max-width:700px) {
          .desk-nav { display:none !important; }
          .mob-btn  { display:block !important; }
          .pinned-name { display:none !important; }
          .progress-rail { display:none !important; }
          .about-grid { grid-template-columns:1fr !important; }
          .proj-cols  { columns:1 !important; }
        }
        @keyframes heroSlide { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
        @keyframes pulseDot  { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* THE KEY TRICK: the entire page background transitions as you scroll */}
      <div style={{ position:"fixed", inset:0, background:bgColor, zIndex:-1, transition:"background 0.08s linear" }} />

      <PinnedName scrollProgress={progress} />
      <ProgressRail progress={progress} sections={sections} activeSection={activeSection} />
      <Nav activeSection={activeSection} sections={sections} />

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"100px clamp(48px,7vw,120px) 80px", position:"relative", overflow:"hidden" }}>
        {/* Huge ghost name behind */}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", pointerEvents:"none" }}>
          <div style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"clamp(80px,20vw,260px)", fontWeight:700, color:"rgba(255,255,255,0.022)", lineHeight:1, letterSpacing:"-0.05em", userSelect:"none", whiteSpace:"nowrap" }}>FAROUQ</div>
        </div>

        <div style={{ maxWidth:1000, position:"relative", zIndex:2 }}>
          {/* Top bar */}
          <div style={{ animation:"heroSlide 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.25)", letterSpacing:"0.2em", marginBottom:48, display:"flex", gap:20, flexWrap:"wrap" }}>
            <span>AMMAN · JO</span><span style={{ opacity:0.3 }}>—</span>
            <span style={{ color:"rgba(255,255,255,0.5)" }}>AVAILABLE JUNE 2026</span><span style={{ opacity:0.3 }}>—</span>
            <span style={{ color:"rgba(0,230,118,0.7)", display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:"rgba(0,230,118,0.8)", display:"inline-block", animation:"pulseDot 2s ease infinite" }}/>ONLINE
            </span>
          </div>

          {/* Name — the two-layer trick */}
          <div style={{ animation:"heroSlide 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
            <h1 style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"clamp(3.8rem,12vw,10rem)", fontWeight:700, lineHeight:0.88, letterSpacing:"-0.04em", marginBottom:36 }}>
              <span style={{ display:"block", color:"#fff" }}>FAROUQ</span>
              <span style={{ display:"block", WebkitTextStroke:"1.5px rgba(255,255,255,0.55)", color:"transparent" }}>HASSAN</span>
            </h1>
          </div>

          {/* Tagline — Instrument Serif italic */}
          <div style={{ animation:"heroSlide 0.9s cubic-bezier(0.16,1,0.3,1) 0.38s both", maxWidth:520, marginBottom:44 }}>
            <p style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(1.1rem,2.8vw,1.55rem)", fontStyle:"italic", color:"rgba(255,255,255,0.55)", lineHeight:1.6, whiteSpace:"pre-line" }}>{ME.tagline}</p>
          </div>

          {/* Roles */}
          <div style={{ animation:"heroSlide 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both", display:"flex", gap:8, flexWrap:"wrap", marginBottom:40 }}>
            {["SOC Analyst","Detection Engineer","Penetration Tester"].map((r,i)=>(
              <span key={r} style={{ padding:"6px 16px", border:`1px solid ${i===0?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.14)"}`, color:i===0?"#fff":"rgba(255,255,255,0.45)", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.08em" }}>{r}</span>
            ))}
          </div>

          {/* CV buttons + socials */}
          <div style={{ animation:"heroSlide 0.9s cubic-bezier(0.16,1,0.3,1) 0.62s both" }}>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20 }}>
              {[{l:"↓ CV — SOC / Blue Team", u:ME.cvSoc, h:"CDSA · Detection · DFIR", p:true},{l:"↓ CV — Pen Testing", u:ME.cvOffensive, h:"CPTS · CWES · Red Team", p:false}].map(({l,u,h,p})=>(
                <a key={l} href={u} download
                  style={{ display:"flex", flexDirection:"column", gap:2, padding:"10px 20px", border:`1.5px solid ${p?"rgba(255,255,255,0.75)":"rgba(255,255,255,0.2)"}`, color:p?"#fff":"rgba(255,255,255,0.6)", background:p?"rgba(255,255,255,0.06)":"transparent", fontFamily:"'IBM Plex Mono',monospace", textDecoration:"none", transition:"all 0.2s", minWidth:180 }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.borderColor="rgba(255,255,255,0.9)";e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=p?"rgba(255,255,255,0.06)":"transparent";e.currentTarget.style.borderColor=p?"rgba(255,255,255,0.75)":"rgba(255,255,255,0.2)";e.currentTarget.style.color=p?"#fff":"rgba(255,255,255,0.6)";}}>
                  <span style={{ fontSize:"0.74rem", fontWeight:600 }}>{l}</span>
                  <span style={{ fontSize:"0.58rem", opacity:0.5 }}>{h}</span>
                </a>
              ))}
            </div>
            <div style={{ display:"flex", gap:22, flexWrap:"wrap" }}>
              {[["LinkedIn",ME.linkedin],["GitHub",ME.github],["Email",`mailto:${ME.email}`]].map(([l,u])=>(
                <a key={l} href={u} target="_blank" rel="noreferrer"
                  style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.7rem", color:"rgba(255,255,255,0.3)", textDecoration:"none", letterSpacing:"0.08em", transition:"color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>
                  {l} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll nudge */}
        <div style={{ position:"absolute", bottom:36, left:"clamp(48px,7vw,120px)", display:"flex", alignItems:"center", gap:12, animation:"heroSlide 0.8s ease 1.1s both" }}>
          <div style={{ width:32, height:1, background:"rgba(255,255,255,0.2)" }}/>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.55rem", color:"rgba(255,255,255,0.2)", letterSpacing:"0.2em" }}>SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding:"80px clamp(48px,7vw,120px)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:48, maxWidth:900 }}>
          {[["22","+","Projects Completed",80],["4","","Certs Earned",160],["8","mo","Gov. Internship",240],["300","+","NCSCJO Ranked Against",320]].map(([v,s,l,d])=>(
            <Stat key={l} value={parseInt(v)} suffix={s} label={l} delay={d} />
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding:"120px clamp(48px,7vw,120px)", position:"relative", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <Watermark>BIO</Watermark>
        <div style={{ maxWidth:1000, position:"relative", zIndex:1 }}>
          <ChapterHead number={1} title="ABOUT" sub="PERSONNEL FILE" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56 }} className="about-grid">
            <Reveal delay={80}>
              <p style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(1rem,2vw,1.2rem)", fontStyle:"italic", color:"rgba(255,255,255,0.6)", lineHeight:1.95, marginBottom:32 }}>"{ME.bio}"</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {[["↓ CV — SOC",ME.cvSoc,true],["↓ CV — Pen Test",ME.cvOffensive,true],["→ LinkedIn",ME.linkedin,false],["→ GitHub",ME.github,false],["→ Medium",ME.medium,false]].map(([l,u,dl])=>(
                  <a key={l} href={u} target={dl?"_self":"_blank"} rel="noreferrer" download={dl||undefined}
                    style={{ padding:"6px 14px", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.5)", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.66rem", textDecoration:"none", letterSpacing:"0.06em", transition:"all 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.7)";e.currentTarget.style.color="#fff";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
                    {l}
                  </a>
                ))}
              </div>
            </Reveal>
            <Reveal delay={160}>
              {[["EDUCATION","B.Sc. Cybersecurity — HTU · Jun 2026"],["INTERNSHIP","SCC – Jordan Armed Forces · Oct 2025 – Jun 2026"],["FOCUS","SOC / Detection Engineering + Penetration Testing"],["PLATFORM","HackTheBox — CDSA ✓ · CWES 70% · CPTS 45%"],["COMPETITION","Top 10 / 300+ — NCSCJO National Bootcamp"],["CONTACT",ME.email],["LANGUAGES","Arabic · English · German · Italian (beginner)"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", gap:18, padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.56rem", color:"rgba(255,255,255,0.22)", minWidth:90, letterSpacing:"0.1em", paddingTop:2, flexShrink:0 }}>{k}</div>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.74rem", color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>{v}</div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Active now */}
          <Reveal delay={240}>
            <div style={{ marginTop:48 }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.58rem", color:"rgba(255,255,255,0.2)", letterSpacing:"0.2em", marginBottom:16 }}>ACTIVE NOW</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {[{l:"SCC-JAF",v:"Month 5/8"},{l:"HTB CWES",v:"70%"},{l:"HTB CPTS",v:"45%"},{l:"Detection Eng.",v:"90-day"},{l:"Writeups",v:"Weekly"}].map((item,i)=>(
                  <div key={item.l} style={{ padding:"8px 16px", border:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ width:4,height:4,borderRadius:"50%",background:"rgba(0,230,118,0.7)",animation:`pulseDot 2s ease ${i*0.3}s infinite` }}/>
                    <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.66rem", color:"rgba(255,255,255,0.5)" }}>{item.l}</span>
                    <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.66rem", color:"rgba(255,255,255,0.22)" }}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding:"120px clamp(48px,7vw,120px)", position:"relative", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <Watermark align="left">{PROJECTS.filter(p=>p.sev>=9).length}</Watermark>
        <div style={{ maxWidth:1000, position:"relative", zIndex:1 }}>
          <ChapterHead number={2} title="PROJECTS" sub="OPERATIONS LOG" />

          {/* Filter */}
          <Reveal>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:28 }}>
              {cats.map(c=>(
                <button key={c} onClick={()=>setCatF(c)}
                  style={{ padding:"4px 12px", background:catF===c?"rgba(255,255,255,0.08)":"none", border:`1px solid ${catF===c?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.08)"}`, color:catF===c?"#fff":"rgba(255,255,255,0.3)", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", cursor:"pointer", transition:"all 0.18s", letterSpacing:"0.08em" }}>
                  {c} {catF===c&&`(${filtered.length})`}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="proj-cols" style={{ columns:"300px", columnGap:8 }}>
            {filtered.map(p=><ProjectCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap" style={{ padding:"120px clamp(48px,7vw,120px)", position:"relative", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <Watermark>90</Watermark>
        <div style={{ maxWidth:1000, position:"relative", zIndex:1 }}>
          <ChapterHead number={3} title="ROADMAP" sub="LEARNING OPS" />
          <Reveal>
            <p style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:"clamp(0.95rem,2vw,1.15rem)", fontStyle:"italic", color:"rgba(255,255,255,0.38)", lineHeight:1.85, maxWidth:600, marginBottom:40, borderLeft:"2px solid rgba(255,255,255,0.07)", paddingLeft:18 }}>
              90-Day Detection Engineering — become a Detection Engineer + AD Threat Hunter. 15–20 production-grade rules, Domain Compromise Framework, public GitHub portfolio.
            </p>
          </Reveal>
          {ROADMAP_PHASES.map((ph,i)=><RoadPhase key={ph.phase} ph={ph} idx={i} />)}
        </div>
      </section>

      {/* ── CERTS ── */}
      <section id="certs" style={{ padding:"120px clamp(48px,7vw,120px)", position:"relative", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <Watermark align="left">4</Watermark>
        <div style={{ maxWidth:1000, position:"relative", zIndex:1 }}>
          <ChapterHead number={4} title="CERTS" sub="CLEARANCE REGISTRY" />
          {[{g:"earned",label:"CLEARED"},{g:"active",label:"IN PROGRESS"},{g:"queued",label:"QUEUED"}].map(({g,label})=>(
            <Reveal key={g}>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.58rem", color:"rgba(255,255,255,0.2)", letterSpacing:"0.2em", marginBottom:8 }}>{label}</div>
                {CERTS.filter(c=>c.status===g).map(c=><CertRow key={c.name} cert={c} />)}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WRITEUPS ── */}
      <section id="writeups" style={{ padding:"120px clamp(48px,7vw,120px)", position:"relative", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <Watermark>{WRITEUPS.length}</Watermark>
        <div style={{ maxWidth:1000, position:"relative", zIndex:1 }}>
          <ChapterHead number={5} title="WRITEUPS" sub="INTELLIGENCE REPORTS" />
          {WRITEUPS.map((w,i)=>(
            <Reveal key={w.title} delay={i*70}>
              <div onClick={()=>w.live&&w.url&&window.open(w.url,"_blank")}
                style={{ padding:"28px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:w.live?"pointer":"default", opacity:w.live?1:0.45, display:"flex", gap:28, alignItems:"flex-start", transition:"padding 0.25s ease" }}
                onMouseEnter={e=>{if(w.live)e.currentTarget.style.paddingLeft="12px";}}
                onMouseLeave={e=>e.currentTarget.style.paddingLeft="0"}>
                <div style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"clamp(2rem,4.5vw,4rem)", fontWeight:700, color:"rgba(255,255,255,0.05)", lineHeight:1, flexShrink:0 }}>0{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                    {w.tags.map(t=><span key={t} style={{ fontSize:"0.56rem", padding:"2px 8px", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(255,255,255,0.3)", fontFamily:"'IBM Plex Mono',monospace" }}>{t}</span>)}
                    {!w.live&&<span style={{ fontSize:"0.56rem", padding:"2px 8px", border:"1px solid rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.18)", fontFamily:"'IBM Plex Mono',monospace" }}>PENDING</span>}
                  </div>
                  <h3 style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"clamp(1rem,2.5vw,1.7rem)", fontWeight:700, color:"#fff", marginBottom:6, lineHeight:1.2, letterSpacing:"-0.01em" }}>{w.title}</h3>
                  <p style={{ fontFamily:"'DM Sans','Helvetica',sans-serif", fontSize:"0.82rem", color:"rgba(255,255,255,0.38)", lineHeight:1.75 }}>{w.blurb}</p>
                  <div style={{ marginTop:10, fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.6rem", color:"rgba(255,255,255,0.18)" }}>{w.date}</div>
                </div>
                {w.live&&<div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.8rem", color:"rgba(255,255,255,0.2)", flexShrink:0, paddingTop:4 }}>↗</div>}
              </div>
            </Reveal>
          ))}
          <Reveal delay={300}>
            <div style={{ marginTop:28, padding:"14px 0", fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.62rem", color:"rgba(255,255,255,0.14)", letterSpacing:"0.1em", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              MORE REPORTS IN QUEUE — PUBLISHING REGULARLY ON MEDIUM
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"32px clamp(48px,7vw,120px)", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div style={{ fontFamily:"'Clash Display','Syne',sans-serif", fontSize:"0.9rem", fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.04em" }}>FH.</div>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.58rem", color:"rgba(255,255,255,0.18)", letterSpacing:"0.1em" }}>FAROUQHASSAN.DEV · NEXT.JS + VERCEL · {new Date().getFullYear()}</div>
        <div style={{ display:"flex", gap:20 }}>
          {[["LinkedIn",ME.linkedin],["GitHub",ME.github],["Medium",ME.medium]].map(([l,u])=>(
            <a key={l} href={u} target="_blank" rel="noreferrer"
              style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.62rem", color:"rgba(255,255,255,0.22)", textDecoration:"none", letterSpacing:"0.08em", transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.22)"}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
