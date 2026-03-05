"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const PROFILE = {
  name: "Farouq Hassan",
  codename: "FH-02 // ANALYST",
  location: "AMM · JO · 31.9539° N, 35.9106° E",
  email: "12farouq12@gmail.com",
  linkedin: "https://www.linkedin.com/in/FarouqHassan02",
  github: "https://github.com/farouq7assan0o",
  medium: "https://medium.com/@12farouq12",
  cvSoc: "/Farouq_Hassan_Junior_SOC_Analyst_CV.pdf",
  cvOffensive: "/Farouq_Hassan_CV_Offensive.pdf",
  tagline: "I find what's broken before the adversary does.",
  bio: "Cybersecurity student at HTU, graduating June 2026. 8-month internship at SCC–Jordan Armed Forces. Offensive + defensive tracks simultaneously. CWES 70%, CPTS 45%, CDSA done. Everything documented publicly.",
  current: [
    { label: "SCC-JAF Internship", value: "Month 5 / 8", status: "ACTIVE" },
    { label: "HTB CWES", value: "70% complete", status: "IN PROGRESS" },
    { label: "HTB CPTS", value: "45% complete", status: "IN PROGRESS" },
    { label: "Detection Eng. Roadmap", value: "90-day plan", status: "ACTIVE" },
    { label: "HTB Writeups", value: "Weekly cadence", status: "ACTIVE" },
  ],
};

const STATS = [
  { value: 22, suffix: "+", label: "OPERATIONS", sub: "Projects executed" },
  { value: 4,  suffix: "",  label: "CLEARANCES", sub: "Certs earned" },
  { value: 8,  suffix: "MO", label: "DEPLOYMENT", sub: "Gov. internship" },
  { value: 300, suffix: "+", label: "RANKED AGAINST", sub: "NCSCJO competitors" },
];

const CERTS = [
  { id:"cdsa", name:"CDSA", full:"Certified Defensive Security Analyst", issuer:"Hack The Box", year:"2025", status:"earned", pct:100, badgeUrl:"https://www.credly.com/earner/earned/badge/9385aaf3-d974-43d8-8144-0dca4b70746b", desc:"SOC · DFIR · SIEM threat hunting · AD attack detection" },
  { id:"cwse", name:"CWSE", full:"Certified Web Security Expert", issuer:"Hackviser", year:"2025", status:"earned", pct:100, badgeUrl:"https://hackviser.com/verify?id=HV-CWSE-D15I7TON", desc:"OWASP Top 10 · Web app security testing · Bug hunting" },
  { id:"capt", name:"CAPT", full:"Certified Associate Penetration Tester", issuer:"Hackviser", year:"2025", status:"earned", pct:100, badgeUrl:"https://hackviser.com/verify?id=HV-CAPT-T3O8P3JO", desc:"Web · Network · Infrastructure penetration testing" },
  { id:"nca",  name:"NCA",  full:"Nutanix Certified Associate v6", issuer:"Nutanix", year:"2025", status:"earned", pct:100, badgeUrl:"https://www.credly.com/earner/earned/badge/9c45a9a4-34b0-46b8-819f-25b6b053dfdd", desc:"HCI · Cloud architecture · Virtualization" },
  { id:"cwes", name:"CWES", full:"Certified Web Exploitation Specialist", issuer:"Hack The Box", year:"2026", status:"active", pct:70, badgeUrl:null, desc:"Advanced web exploitation · Vulnerability chaining" },
  { id:"cpts", name:"CPTS", full:"Certified Penetration Testing Specialist", issuer:"Hack The Box", year:"2026", status:"active", pct:45, badgeUrl:null, desc:"Full-scope pentest · AD attacks · Professional reporting" },
  { id:"secplus", name:"SEC+", full:"CompTIA Security+ SY0-701", issuer:"CompTIA", year:"2026", status:"queued", pct:0, badgeUrl:null, desc:"Security concepts · Threats · Risk management" },
  { id:"ccna", name:"CCNA", full:"Cisco CCNA 200-301", issuer:"Cisco", year:"2026", status:"queued", pct:0, badgeUrl:null, desc:"Network fundamentals · Routing · Switching" },
];

const WRITEUPS = [
  { id:1, title:"HTB CDSA — What It Really Takes to Pass", date:"FEB 2026", platform:"Medium", collection:"Journey", tags:["CDSA","Blue Team"], excerpt:"An honest account of what the CDSA exam demands — lab hours, mental pressure, and what actually prepared me to pass. No fluff.", url:"https://medium.com/@12farouq12/htb-cdsa-2025-what-it-really-takes-to-pass-the-certified-defensive-security-analyst-exam-5215213392cc", published:true },
  { id:2, title:"HTB Machine Writeup #1", date:"MAR 2026", platform:"HTB", collection:"HTB Machines", tags:["HTB","Linux"], excerpt:"Full walkthrough from recon to root.", url:null, published:false },
  { id:3, title:"Detection Engineering: Writing Real Sigma Rules", date:"COMING", platform:"Blog", collection:"Detection Engineering", tags:["Detection","Sigma"], excerpt:"Building production-grade detections for AD attack paths with MITRE mapping and FP tuning.", url:null, published:false },
];

const ROADMAPS = [
  {
    id:"rm1", name:"90-Day Detection Engineering",
    desc:"Become a Detection Engineer + AD Threat Hunter. Build 15–20 production-grade rules, a Domain Compromise Detection Framework, and a public GitHub portfolio.",
    phases:[
      { id:"p1", phase:"Phase 1", days:"Days 1–30", title:"Detection Engineering Fundamentals", status:"active",
        goal:"Build high-quality detections for real AD attack paths. Deliver 15–20 production-grade rules.",
        weeks:[
          { id:"w1", week:"Week 1", title:"Lab Foundation", items:["DC + 2 Win10 clients + Kali + Splunk","Sysmon on all endpoints","PowerShell Script Block + Module Logging","Advanced AD auditing (4662, 4742, 4738, 4672)"], deliverable:"Lab architecture diagram + logging baseline" },
          { id:"w2", week:"Week 2", title:"Initial Access & Execution", items:["Phishing macro → PowerShell","Encoded PowerShell / IEX","Office spawning cmd/powershell"], deliverable:"5 detection rules with MITRE mapping" },
          { id:"w3", week:"Week 3", title:"Privilege Escalation & Persistence", items:["UAC bypass","Scheduled tasks (Event 4698)","Registry run keys","Service creation"], deliverable:"6 detection rules + alert logic" },
          { id:"w4", week:"Week 4", title:"Credential Access", items:["Mimikatz + LSASS dump (Sysmon ID 10)","Kerberoasting (4769 w/ RC4)","Pass-the-Hash","Logon Type 9 / abnormal 4672"], deliverable:"Credential Theft Detection Pack" },
        ],
      },
      { id:"p2", phase:"Phase 2", days:"Days 31–60", title:"AD Threat Hunting", status:"upcoming",
        goal:"Build a Domain Compromise Detection Framework. Hunt for patterns, not just alerts.",
        weeks:[
          { id:"w5", week:"Week 5", title:"Lateral Movement", items:["SMB / PsExec / WMI / WinRM detection","ADMIN$ + named pipe anomalies","Event 4624 Type 3 from workstation to DC"], deliverable:"Lateral movement detection rules" },
          { id:"w6", week:"Week 6", title:"DCSync & DCShadow", items:["DCSync (4662 replication GUIDs)","DCShadow (4742 / 4738 anomalies)","AD object modification tracking"], deliverable:"Domain Compromise Detection Framework" },
          { id:"w7", week:"Week 7", title:"Threat Hunting Framework", items:["Rare logon types","Rare parent-child processes","Rare LDAP burst activity","Baseline vs anomaly docs"], deliverable:"10 threat hunting queries" },
          { id:"w8", week:"Week 8", title:"SIEM Engineering", items:["Field normalization","Multi-stage correlation rules","Risk-based alerting + noise reduction"], deliverable:"3 multi-stage correlation rules" },
        ],
      },
      { id:"p3", phase:"Phase 3", days:"Days 61–90", title:"Automation & Portfolio", status:"upcoming",
        goal:"Build production-ready SOAR, run full purple team simulation, publish everything publicly.",
        weeks:[
          { id:"w9",  week:"Week 9",  title:"SOAR & Case Management", items:["Deploy TheHive + Shuffle","Alert → Case auto-creation","IP enrichment + auto-tag MITRE"], deliverable:"Working SOAR pipeline" },
          { id:"w10", week:"Week 10", title:"Purple Team Simulation", items:["Day 1: Phishing","Day 2: Kerberoast","Day 3: Lateral Movement","Day 4: DCSync"], deliverable:"Detection gap analysis report" },
          { id:"w11", week:"Week 11", title:"Detection Portfolio", items:["GitHub repo with all detection rules","Write-ups per attack chain","Red vs Blue test results"], deliverable:"Public portfolio on GitHub" },
          { id:"w12", week:"Week 12", title:"Enterprise Readiness", items:["LAPS, Credential Guard, Protected Users","Tiered AD model / ESAE","Prevention mindset framework"], deliverable:"Enterprise hardening checklist" },
        ],
      },
    ],
  },
];

const PROJECTS = [
  { id:"animeblast",   sev:"CRITICAL", title:"AnimeBlast — Full-Scope Pentest",             cat:"PENTEST",    year:"2024", tags:["Buffer Overflow","Metasploit","SQLi","XSS","RCE"], summary:"Custom Python BoF (EIP@1036), DEP/ASLR/SafeSEH bypass, SOCKS pivot, UNION SQLi, PHP shell→RCE. 10 flags.", highlights:["Custom BoF — EIP @ 1036 bytes","DEP + ASLR + SafeSEH bypass","Network pivot via SOCKS","UNION SQLi → credentials","PHP shell → RCE → admin","10 flags captured"], github:null },
  { id:"cyberblast",   sev:"HIGH",     title:"CyberBlast — Ethical Hacking Assessment",     cat:"PENTEST",    year:"2024", tags:["Nessus","EternalBlue","SQLmap","Kill Chain"], summary:"Nessus (20 findings), EternalBlue Meterpreter, UNION SQLi, XSS session hijack, command injection, RDP.", highlights:["Nessus: 20 vulns — BlueKeep, TLS 1.0","EternalBlue → credential dump","UNION SQLi + XSS + RCE","MSFvenom reverse shell"], github:null },
  { id:"sqli",         sev:"HIGH",     title:"SQLi Assessment + Banking Red Team Plan",      cat:"PENTEST",    year:"2025", tags:["SQLi","Auth Bypass","Kill Chain","ROE"], summary:"Manual SQLi exploitation, full banking red team ROE, and complete Cyber Kill Chain plan OSINT→C2→exfil.", highlights:["Auth bypass via SQL injection","UNION SELECT credential extraction","Banking ROE with scope + limits","Full Kill Chain documented"], github:null },
  { id:"ftp",          sev:"MEDIUM",   title:"FTP Enumeration & Brute Force Lab",             cat:"PENTEST",    year:"2025", tags:["Hydra","FTP","Brute Force"], summary:"Anonymous FTP misconfiguration confirmed, Hydra brute-force vs 100k NCSC wordlist, hardening docs.", highlights:["Anonymous FTP access confirmed","Hydra + 100k NCSC wordlist","Zero lockout resistance","Remediation: Fail2Ban + SFTP"], github:null },
  { id:"privesc",      sev:"HIGH",     title:"Linux LFT & Privilege Escalation",             cat:"PENTEST",    year:"2025", tags:["LinPEAS","Kernel Exploit","Netcat"], summary:"Kernel 2.6.32 → Exploit-DB 18411 → LPE. Four file transfer methods demonstrated.", highlights:["Kernel 2.6.32 via uname -a","Searchsploit → Exploit-DB 18411","BoF LPE compiled + executed","4 transfer methods"], github:null },
  { id:"semgrep",      sev:"MEDIUM",   title:"Semgrep SAST in GitHub Actions",               cat:"PENTEST",    year:"2025", tags:["Semgrep","SAST","DevSecOps","CI/CD"], summary:"41 findings across 1015 files in Juice Shop. Sequelize SQLi in Sequelize query string concat.", highlights:["41 findings, 1015 files","Sequelize SQLi detected","YAML workflow on every push","Parameterized query fix"], github:null },
  { id:"malware",      sev:"CRITICAL", title:"Malware Analysis — BackdoorBeacon.exe",        cat:"PENTEST",    year:"2024", tags:["IDA Free","x32dbg","UPX","Reverse Eng."], summary:"UPX-packed backdoor RE. TLS callbacks, anti-debug patch, C2 IP patched, SYN beacon confirmed.", highlights:["UPX unpack → PE analysis","TLS callback NOP patch","C2 IP → 127.0.0.1","HKCU\\Run persistence","SSDT/IDT clean"], github:null },
  { id:"pcap",         sev:"HIGH",     title:"PCAP + Memory Forensics",                      cat:"SOC/DFIR",   year:"2025", tags:["Wireshark","Volatility 3","DNS Tunneling"], summary:"HTTP C2 beaconing, DNS TXT Base64 exfil, fileless PowerShell loader via Volatility 3 malfind.", highlights:["HTTP C2 /v1/checkin polling","DNS TXT Base64 exfil","Volatility: RWX shellcode","Rogue process: parent explorer.exe","Network + memory timeline correlated"], github:null },
  { id:"threatintel",  sev:"HIGH",     title:"APT29 & Lumma Stealer Intel",                  cat:"SOC/DFIR",   year:"2025", tags:["MITRE ATT&CK","OSINT","APT29"], summary:"ATT&CK Navigator layers for SolarWinds + USAID. Lumma Stealer behavioral chain. Nation-state vs cybercrime.", highlights:["APT29: T1195.002 supply chain","LSASS dump + token abuse: High","Lumma: T1555 credential harvest","CISA + Mandiant sourced"], github:null },
  { id:"irplays",      sev:"CRITICAL", title:"IR Playbooks — 3 Scenarios",                   cat:"SOC/DFIR",   year:"2025", tags:["NIST IR","D3FEND","Ransomware"], summary:"Clinic malware, CityWorks ransomware, Bazaarjo supply-chain. ATT&CK→D3FEND. Exec comms included.", highlights:["Ransomware decision tree","D3FEND: FIDO2 breaks Lumma chain","Exec update + staff advisory","All: closure criteria defined"], github:null },
  { id:"forensics",    sev:"HIGH",     title:"Digital Forensics — BlackEagle",               cat:"SOC/DFIR",   year:"2024", tags:["FTK Imager","HxD","Steganography"], summary:"NTFS manual recovery via HxD, DOCX inside PNG (stego), hidden message decoded. Hash verified throughout.", highlights:["NTFS mirror manual recovery","DOCX inside PNG stego","Hidden message decoded","Chain of custody maintained"], github:null },
  { id:"airline",      sev:"MEDIUM",   title:"Secure Airline Check-in System",               cat:"SOC/DFIR",   year:"2024", tags:["Java","SHA-256","JUnit","RBAC"], summary:"SHA-256+salt hashing, brute-force lockout, RBAC 4 roles, fuzz-tested to 100k attempts, PMD SAST.", highlights:["SHA-256 + salt","3-strike lockout","RBAC: 4 roles","100k fuzz test","PMD SAST"], github:"https://github.com/farouq7assan0o/SecureCoding" },
  { id:"otps3",        sev:"HIGH",     title:"Secure OTP S3 System",                         cat:"CLOUD/INFRA", year:"2025", tags:["S3","OTP","OWASP A01/A07","IAM"], summary:"4 critical vulns fixed: OTP in response, no expiry, brute-force, predictable path. uuid4 + presigned URLs.", highlights:["OTP removed from API response","5-min expiry + single-use","Rate limit: 5 attempts","uuid4 + presigned URL (600s)"], github:null },
  { id:"apachessh",    sev:"MEDIUM",   title:"Apache & SSH Hardening (CIS)",                 cat:"CLOUD/INFRA", year:"2025", tags:["Apache 2.4","CIS Benchmark","SSH"], summary:"5 Apache misconfigs fixed. SSH: key-only, no root, chacha20+aes256-gcm only. CIS 2.2–3.5 aligned.", highlights:["5 CIS findings fixed","TraceEnable Off + no indexes","/server-status → 403","Key-only SSH, no root login"], github:null },
  { id:"network",      sev:"MEDIUM",   title:"Enterprise Network Security Design",           cat:"CLOUD/INFRA", year:"2023", tags:["Cisco","IPsec VPN","ASA Firewall","OSPF"], summary:"5-site network: IPsec VPN, ASA DMZ+NAT, full-mesh OSPF, VLAN segmentation, port security, AAA.", highlights:["IPsec VPN: AES+SHA","ASA: DMZ + NAT","Full-mesh OSPF WAN","VLAN per department"], github:null },
  { id:"governance",   sev:"HIGH",     title:"BazaarJo Governance Gap Assessment",           cat:"GRC",         year:"2025", tags:["ISO 27014","PDPL","PCI DSS","SoD"], summary:"7 deficiencies: no SoD, undefined CISO accountability, no breach policy. 12-month remediation roadmap.", highlights:["7 governance gaps","SoD: devs → unilateral prod deploy","No PDPL breach notification","Board brief with 3–6mo plan"], github:null },
  { id:"risk",         sev:"HIGH",     title:"BazaarJo Enterprise Risk Management",          cat:"GRC",         year:"2025", tags:["ISO 27005","NIST 800-30","KRIs"], summary:"ISO 27005 + NIST 800-30 lifecycle. 6 risks rated, If-Then statements, KRIs defined. Board reporting cadence.", highlights:["PII risk: Critical (H×H)","If-Then: git → malicious injection","KRIs: MFA%, unapproved deploys","Quarterly board reporting"], github:null },
  { id:"bia",          sev:"HIGH",     title:"BazaarJo Business Impact Analysis",            cat:"GRC",         year:"2025", tags:["BIA","RTO/RPO","PCI DSS","DR"], summary:"BIA across 6 processes. Payment: RTO 15min/RPO 0–5min. IR: RTO 15min/RPO 0 (zero log loss).", highlights:["Payment: RTO 15 / RPO 0–5min","IR: RTO 15 / RPO 0","Orders: RTO 30 / RPO 5min","Recovery order documented"], github:null },
  { id:"fair",         sev:"CRITICAL", title:"FAIR Risk Analysis — Phishing Incident",       cat:"GRC",         year:"2024", tags:["FAIR","Monte Carlo","ISO 27005","PDPL"], summary:"ALE before controls: $1.38M/yr. After MFA+SIEM+training: $177K. Jordanian PDPL + Law 16/2019 mapped.", highlights:["ALE before: $1.38M/year","ALE after: $177K (−$1.2M)","PDPL: 72hr disclosure violated","Monte Carlo via FAIR-U"], github:null },
  { id:"isms",         sev:"HIGH",     title:"ISMS Design — Bluefrontier Bank",             cat:"GRC",         year:"2024", tags:["ISO 27001","COBIT 2019","BIA","Audit"], summary:"Complete ISMS: risk register, KRIs, BIA, incident lifecycle, 7-phase COBIT map, 3-stage audit, ROI.", highlights:["ISO 27001 full scope","COBIT 2019: 7-phase","BIA: 6 processes","Executive ROI quantified"], github:null },
  { id:"crypto",       sev:"MEDIUM",   title:"Applied Cryptography — MITM, ECB/CBC, RSA",   cat:"GRC",         year:"2024", tags:["Python","2-DES MITM","RSA","Digital Sig"], summary:"MITM on 2-DES (2¹¹²→2⁵⁷), ECB pattern leakage, hybrid RSA+DES messaging, Square-and-Multiply.", highlights:["MITM: 2¹¹² → 2⁵⁷","ECB leakage visualized","RSA+DES hybrid session","O(log e) exponentiation"], github:null },
  { id:"hopechain",    sev:"LOW",      title:"HopeChain — Blockchain Donation DApp",         cat:"OTHER",       year:"2024", tags:["Solidity","Ethereum","Smart Contract Sec"], summary:"Reentrancy mitigated, zkSNARK privacy proposed, multisig+timelock governance. Jordan NGO reg. included.", highlights:["Reentrancy via transfer()","zkSNARK privacy proposed","Multisig + timelocks","Jordan NGO compliance"], github:null },
  { id:"spark",        sev:"LOW",      title:"SPARK — Wearable INR Monitoring Patch",        cat:"OTHER",       year:"2025", tags:["IoT","Biomedical","Team Lead","HIPAA"], summary:"Led 6-person team. Non-invasive INR monitoring. AI emergency alerts. $1.65M SOM in $55M Jordan market.", highlights:["Led 6-person team","$1.65M SOM validated","Continuous INR monitoring","AI alerts: patient+caregiver"], github:null },
];

// ─────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────
const C = {
  bg:       "#080C14",
  panel:    "#0C1220",
  panelHi:  "#101828",
  border:   "#1A2540",
  borderHi: "#243560",
  cyan:     "#00D4FF",
  cyanDim:  "rgba(0,212,255,0.15)",
  cyanGlow: "rgba(0,212,255,0.06)",
  red:      "#FF3B3B",
  redDim:   "rgba(255,59,59,0.15)",
  amber:    "#FFB020",
  amberDim: "rgba(255,176,32,0.15)",
  green:    "#00E676",
  greenDim: "rgba(0,230,118,0.15)",
  text:     "#E2EAF4",
  textMid:  "#8899AA",
  textDim:  "#4A5A70",
  mono:     "'IBM Plex Mono', monospace",
  head:     "'Syne', sans-serif",
  body:     "'DM Sans', sans-serif",
};

const SEV_COLOR = { CRITICAL: C.red, HIGH: C.amber, MEDIUM: C.cyan, LOW: C.textMid };
const SEV_BG    = { CRITICAL: C.redDim, HIGH: C.amberDim, MEDIUM: C.cyanDim, LOW: "rgba(136,153,170,0.1)" };
const CAT_COLOR = { "PENTEST": C.red, "SOC/DFIR": C.cyan, "CLOUD/INFRA": "#7EB8FF", "GRC": C.amber, "OTHER": C.textMid };

// ─────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, run, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let s = null;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / ms, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [run, target, ms]);
  return n;
}

// ─────────────────────────────────────────────────────────────
// GRID BACKGROUND
// ─────────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Topographic grid */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.035 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.cyan} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Radial glow top-left */}
      <div style={{ position: "absolute", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)` }} />
      {/* Radial glow bottom-right */}
      <div style={{ position: "absolute", bottom: -300, right: -200, width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%)` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PULSE DOT
// ─────────────────────────────────────────────────────────────
function Pulse({ color = C.cyan, size = 8 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "pulseRing 2s ease infinite" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCAN LINE LABEL
// ─────────────────────────────────────────────────────────────
function Label({ children, color = C.cyan }) {
  return (
    <div style={{ fontSize: "0.6rem", fontFamily: C.mono, color, letterSpacing: "0.2em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: 14, height: "1px", background: color }} />
      {children}
      <div style={{ flex: 1, height: "1px", background: color + "30" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PANEL WRAPPER
// ─────────────────────────────────────────────────────────────
function Panel({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: C.panel,
      border: `1px solid ${C.border}`,
      position: "relative",
      overflow: "hidden",
      boxShadow: glow ? `0 0 40px rgba(0,212,255,0.04), inset 0 1px 0 rgba(0,212,255,0.06)` : `inset 0 1px 0 rgba(255,255,255,0.03)`,
      ...style
    }}>
      {/* Corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 12, height: 12, borderTop: `1px solid ${C.cyan}`, borderLeft: `1px solid ${C.cyan}` }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 12, height: 12, borderTop: `1px solid ${C.cyan}`, borderRight: `1px solid ${C.cyan}` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 12, height: 12, borderBottom: `1px solid ${C.cyan}`, borderLeft: `1px solid ${C.cyan}` }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderBottom: `1px solid ${C.cyan}`, borderRight: `1px solid ${C.cyan}` }} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAT COUNTER
// ─────────────────────────────────────────────────────────────
function StatBox({ value, suffix, label, sub, delay }) {
  const [ref, inView] = useInView();
  const n = useCounter(value, inView);
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ease ${delay}ms` }}>
      <Panel style={{ padding: "20px 24px" }}>
        <Label color={C.cyan}>{label}</Label>
        <div style={{ marginTop: "14px", fontFamily: C.head, fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 800, color: C.text, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {n}{suffix}
        </div>
        <div style={{ marginTop: "6px", fontFamily: C.mono, fontSize: "0.65rem", color: C.textDim, letterSpacing: "0.1em" }}>{sub}</div>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────
function Nav({ active, setActive }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = ["home", "about", "projects", "roadmap", "certs", "writeups"];
  const go = (s) => { setActive(s); setMobileOpen(false); window.scrollTo({ top: 0 }); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, background: "rgba(8,12,20,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(16px,4vw,48px)", height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Wordmark */}
        <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`, animation: "pulseRing 2s ease infinite" }} />
          <span style={{ fontFamily: C.head, fontSize: "0.95rem", fontWeight: 800, color: C.text, letterSpacing: "0.08em" }}>FH-02</span>
          <span style={{ fontFamily: C.mono, fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.12em" }}>// ANALYST</span>
        </button>

        {/* Desktop nav */}
        <div className="desk-nav" style={{ display: "flex", gap: "4px" }}>
          {items.map(s => (
            <button key={s} onClick={() => go(s)}
              style={{ padding: "6px 14px", background: active === s ? C.cyanDim : "none", border: `1px solid ${active === s ? C.cyan + "60" : "transparent"}`, color: active === s ? C.cyan : C.textMid, fontFamily: C.mono, fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.18s" }}
              onMouseEnter={e => { if (active !== s) { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.border; } }}
              onMouseLeave={e => { if (active !== s) { e.currentTarget.style.color = C.textMid; e.currentTarget.style.borderColor = "transparent"; } }}>
              {s}
            </button>
          ))}
        </div>

        <button onClick={() => setMobileOpen(o => !o)} className="mob-btn"
          style={{ display: "none", background: "none", border: `1px solid ${C.border}`, color: C.text, padding: "7px 13px", fontFamily: C.mono, fontSize: "0.75rem", cursor: "pointer" }}>
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
      {mobileOpen && (
        <div style={{ background: C.panel, borderTop: `1px solid ${C.border}` }}>
          {items.map(s => (
            <button key={s} onClick={() => go(s)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "14px clamp(16px,4vw,48px)", background: active === s ? C.cyanDim : "none", border: "none", fontFamily: C.mono, fontSize: "0.78rem", color: active === s ? C.cyan : C.textMid, cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// REVEAL
// ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
function HomeSection({ setActive }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const show = (p) => ({ opacity: phase >= p ? 1 : 0, transform: phase >= p ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px clamp(16px,4vw,48px) 60px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

        {/* Top metadata strip */}
        <div style={{ ...show(1), display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "48px", fontFamily: C.mono, fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.12em" }}>
          <span>SYS · FAROUQHASSAN.DEV</span>
          <span style={{ color: C.border }}>|</span>
          <span>{PROFILE.location}</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ color: C.cyan }}>STATUS: AVAILABLE JUN 2026</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ color: C.green }}>● ONLINE</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "48px", alignItems: "end" }} className="hero-grid">
          <div>
            {/* Big name */}
            <div style={{ ...show(2), fontFamily: C.head, fontWeight: 800, color: C.text, lineHeight: 0.88, letterSpacing: "-0.03em", marginBottom: "32px" }} className="hero-name">
              <span style={{ display: "block" }}>FAROUQ</span>
              <span style={{ display: "block", WebkitTextStroke: `1px ${C.cyan}`, color: "transparent" }}>HASSAN</span>
            </div>

            {/* Roles */}
            <div style={{ ...show(3), display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
              {["SOC Analyst", "Detection Engineer", "Penetration Tester"].map((r, i) => (
                <div key={r} style={{ padding: "6px 16px", border: `1px solid ${i === 0 ? C.cyan : C.border}`, color: i === 0 ? C.cyan : C.textMid, fontFamily: C.mono, fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                  {i === 0 && <span style={{ color: C.cyan, marginRight: "6px" }}>▶</span>}{r}
                </div>
              ))}
            </div>

            {/* Tagline */}
            <div style={{ ...show(3), maxWidth: "540px", marginBottom: "40px", padding: "14px 18px", borderLeft: `2px solid ${C.cyan}`, background: C.cyanGlow }}>
              <span style={{ fontFamily: C.mono, fontSize: "0.88rem", color: C.textMid, fontStyle: "italic" }}>"{PROFILE.tagline}"</span>
            </div>

            {/* CV buttons */}
            <div style={{ ...show(3), display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              {[{ label: "↓ CV — SOC / Blue Team", url: PROFILE.cvSoc, hint: "CDSA · Detection · DFIR", primary: true }, { label: "↓ CV — Pen Testing", url: PROFILE.cvOffensive, hint: "CPTS · CWES · Red Team", primary: false }].map(({ label, url, hint, primary }) => (
                <a key={label} href={url} download
                  style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "10px 20px", background: primary ? C.cyanDim : "transparent", border: `1px solid ${primary ? C.cyan + "80" : C.border}`, color: primary ? C.cyan : C.textMid, textDecoration: "none", fontFamily: C.mono, transition: "all 0.2s", minWidth: "180px" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.cyanDim; e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
                  onMouseLeave={e => { e.currentTarget.style.background = primary ? C.cyanDim : "transparent"; e.currentTarget.style.borderColor = primary ? C.cyan + "80" : C.border; e.currentTarget.style.color = primary ? C.cyan : C.textMid; }}>
                  <span style={{ fontSize: "0.76rem", fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>{hint}</span>
                </a>
              ))}
            </div>
            <div style={{ ...show(3), display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[["LinkedIn", PROFILE.linkedin], ["GitHub", PROFILE.github], ["Email", `mailto:${PROFILE.email}`]].map(([l, u]) => (
                <a key={l} href={u} target="_blank" rel="noreferrer"
                  style={{ fontFamily: C.mono, fontSize: "0.72rem", color: C.textDim, textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.color = C.cyan}
                  onMouseLeave={e => e.currentTarget.style.color = C.textDim}>
                  {l} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Signal panel — desktop only (hidden on mobile, shown below instead) */}
          <div style={{ ...show(3), minWidth: "220px" }} className="signal-panel">
            <Panel style={{ padding: "20px" }}>
              <Label>Signal Status</Label>
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {[["HTU Degree", "Jun 2026", C.amber], ["SCC-JAF", "Month 5/8", C.cyan], ["CDSA", "Earned", C.green], ["CWES", "70%", C.amber], ["CPTS", "45%", C.amber], ["NCSCJO", "Top 10/300+", C.cyan]].map(([k, v, col]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center" }}>
                    <span style={{ fontFamily: C.mono, fontSize: "0.65rem", color: C.textDim }}>{k}</span>
                    <span style={{ fontFamily: C.mono, fontSize: "0.65rem", color: col, display: "flex", alignItems: "center", gap: "5px" }}>
                      <Pulse color={col} size={5} />{v}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* Signal panel — mobile only, shown inline after hero */}
        <div style={{ ...show(3), marginTop: "28px" }} className="signal-panel-mob">
          <Panel style={{ padding: "16px 18px" }}>
            <Label>Signal Status</Label>
            <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[["HTU Degree", "Jun 2026", C.amber], ["SCC-JAF", "Month 5/8", C.cyan], ["CDSA", "Earned", C.green], ["CWES", "70%", C.amber], ["CPTS", "45%", C.amber], ["NCSCJO", "Top 10/300+", C.cyan]].map(([k, v, col]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", padding: "6px 10px", background: C.cyanGlow, border: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.textDim }}>{k}</span>
                  <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: col, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Pulse color={col} size={4} />{v}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Stats row */}
        <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "10px" }}>
          {STATS.map((s, i) => <StatBox key={s.label} {...s} delay={i * 100} />)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <div style={{ padding: "100px clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal><Label>Personnel File</Label></Reveal>
        <Reveal delay={60}>
          <h2 style={{ fontFamily: C.head, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: C.text, margin: "20px 0 48px", letterSpacing: "-0.02em" }}>
            ABOUT <span style={{ WebkitTextStroke: `1px ${C.cyan}`, color: "transparent" }}>THE ANALYST</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="about-grid">
          <Reveal delay={120}>
            <Panel style={{ padding: "28px" }} glow>
              <Label>Bio</Label>
              <p style={{ marginTop: "16px", fontFamily: C.body, fontSize: "0.95rem", color: C.textMid, lineHeight: 1.9 }}>{PROFILE.bio}</p>
              <div style={{ marginTop: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[["↓ CV — SOC / Blue Team", PROFILE.cvSoc, true], ["↓ CV — Pen Testing", PROFILE.cvOffensive, true], ["→ LinkedIn", PROFILE.linkedin, false], ["→ GitHub", PROFILE.github, false], ["→ Medium", PROFILE.medium, false]].map(([label, url, dl]) => (
                  <a key={label} href={url} target={dl ? "_self" : "_blank"} rel="noreferrer" download={dl || undefined}
                    style={{ padding: "6px 14px", border: `1px solid ${C.border}`, color: C.textMid, fontFamily: C.mono, fontSize: "0.68rem", textDecoration: "none", letterSpacing: "0.08em", transition: "all 0.18s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMid; }}>
                    {label}
                  </a>
                ))}
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={180}>
            <Panel style={{ padding: "28px" }}>
              <Label>Field Data</Label>
              <div style={{ marginTop: "16px" }}>
                {[["EDUCATION","B.Sc. Cybersecurity — HTU · Jun 2026"],["DEPLOYMENT","SCC – Jordan Armed Forces · Oct 2025 – Jun 2026"],["FOCUS","SOC / Detection Engineering + Penetration Testing"],["PLATFORM","HackTheBox — CDSA ✓ · CWES 70% · CPTS 45%"],["COMPETITION","Top 10 / 300+ — NCSCJO National Bootcamp"],["CONTACT",PROFILE.email],["LANGUAGES","Arabic · English · German · Italian (beginner)"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: "16px", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.cyan, minWidth: "100px", letterSpacing: "0.1em", paddingTop: "2px", flexShrink: 0 }}>{k}</div>
                    <div style={{ fontFamily: C.mono, fontSize: "0.76rem", color: C.textMid, lineHeight: 1.5 }}>{v}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </Reveal>
        </div>

        {/* Active ops */}
        <Reveal delay={240}>
          <div style={{ marginTop: "20px" }}>
            <Panel style={{ padding: "24px 28px" }}>
              <Label>Active Operations</Label>
              <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "10px" }}>
                {PROFILE.current.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: C.cyanGlow, border: `1px solid ${C.border}` }}>
                    <Pulse color={item.status === "ACTIVE" ? C.cyan : C.amber} size={7} />
                    <div>
                      <div style={{ fontFamily: C.mono, fontSize: "0.7rem", color: C.text }}>{item.label}</div>
                      <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.textDim, marginTop: "2px" }}>{item.value}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: "0.55rem", fontFamily: C.mono, color: item.status === "ACTIVE" ? C.cyan : C.amber, letterSpacing: "0.1em" }}>{item.status}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROJECT CARD
// ─────────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const [exp, setExp] = useState(false);
  const sevCol = SEV_COLOR[project.sev] || C.textMid;
  const catCol = CAT_COLOR[project.cat] || C.textMid;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderTop: `2px solid ${sevCol}`, transition: "border-color 0.2s", breakInside: "avoid", marginBottom: "10px" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = sevCol + "80"}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
      <div style={{ padding: "16px 18px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.55rem", padding: "2px 8px", background: SEV_BG[project.sev], color: sevCol, fontFamily: C.mono, letterSpacing: "0.1em", border: `1px solid ${sevCol}40` }}>{project.sev}</span>
            <span style={{ fontSize: "0.55rem", padding: "2px 8px", color: catCol, fontFamily: C.mono, letterSpacing: "0.1em", border: `1px solid ${catCol}40` }}>{project.cat}</span>
          </div>
          <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.textDim }}>{project.year}</span>
        </div>
        <h3 style={{ fontFamily: C.head, fontSize: "0.95rem", fontWeight: 700, color: C.text, marginBottom: "8px", lineHeight: 1.3 }}>{project.title}</h3>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
          {project.tags.map(t => <span key={t} style={{ fontSize: "0.58rem", padding: "2px 7px", border: `1px solid ${C.border}`, color: C.textDim, fontFamily: C.mono }}>{t}</span>)}
        </div>
        <p style={{ fontFamily: C.body, fontSize: "0.8rem", color: C.textMid, lineHeight: 1.75 }}>{project.summary}</p>

        {/* Expandable */}
        <div style={{ overflow: "hidden", maxHeight: exp ? "500px" : "0", transition: "max-height 0.35s ease" }}>
          <div style={{ paddingTop: "12px", borderTop: `1px solid ${C.border}`, marginTop: "12px" }}>
            {project.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", fontSize: "0.72rem", color: C.textMid, fontFamily: C.mono, padding: "4px 0", borderBottom: i < project.highlights.length - 1 ? `1px solid ${C.border}` : "none", lineHeight: 1.5 }}>
                <span style={{ color: sevCol, flexShrink: 0 }}>▶</span>{h}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <button onClick={() => setExp(e => !e)}
            style={{ padding: "4px 12px", background: "none", border: `1px solid ${C.border}`, color: C.textDim, fontFamily: C.mono, fontSize: "0.65rem", cursor: "pointer", transition: "all 0.18s", letterSpacing: "0.08em" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = sevCol; e.currentTarget.style.color = sevCol; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}>
            {exp ? "▲ CLOSE" : "▼ DETAILS"}
          </button>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer"
              style={{ padding: "4px 12px", border: `1px solid ${C.border}`, color: C.textDim, fontFamily: C.mono, fontSize: "0.65rem", textDecoration: "none", transition: "all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}>
              ↗ GITHUB
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const cats = ["ALL", ...new Set(PROJECTS.map(p => p.cat))];
  const sevs = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
  const [catF, setCatF] = useState("ALL");
  const [sevF, setSevF] = useState("ALL");
  const filtered = PROJECTS.filter(p => (catF === "ALL" || p.cat === catF) && (sevF === "ALL" || p.sev === sevF));

  return (
    <div style={{ padding: "100px clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal><Label>Operations Log</Label></Reveal>
        <Reveal delay={60}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", margin: "20px 0 32px" }}>
            <h2 style={{ fontFamily: C.head, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
              PROJECTS <span style={{ WebkitTextStroke: `1px ${C.cyan}`, color: "transparent" }}>/ {filtered.length}</span>
            </h2>
            <div style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.textDim }}>
              {PROJECTS.filter(p=>p.sev==="CRITICAL").length} CRITICAL · {PROJECTS.filter(p=>p.sev==="HIGH").length} HIGH · {PROJECTS.filter(p=>p.sev==="MEDIUM").length} MEDIUM
            </div>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={100}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCatF(c)}
                style={{ padding: "4px 12px", background: catF === c ? (CAT_COLOR[c] || C.cyan) + "20" : "none", border: `1px solid ${catF === c ? (CAT_COLOR[c] || C.cyan) + "80" : C.border}`, color: catF === c ? (CAT_COLOR[c] || C.cyan) : C.textDim, fontFamily: C.mono, fontSize: "0.62rem", cursor: "pointer", transition: "all 0.18s", letterSpacing: "0.08em" }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "28px" }}>
            {sevs.map(s => (
              <button key={s} onClick={() => setSevF(s)}
                style={{ padding: "4px 12px", background: sevF === s ? (SEV_BG[s] || C.cyanDim) : "none", border: `1px solid ${sevF === s ? (SEV_COLOR[s] || C.cyan) + "60" : C.border}`, color: sevF === s ? (SEV_COLOR[s] || C.cyan) : C.textDim, fontFamily: C.mono, fontSize: "0.62rem", cursor: "pointer", transition: "all 0.18s", letterSpacing: "0.08em" }}>
                {s}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="proj-cols" style={{ columns: "320px", columnGap: "10px" }}>
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={i * 35}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROADMAP
// ─────────────────────────────────────────────────────────────
function RoadmapSection() {
  return (
    <div style={{ padding: "100px clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal><Label>Learning Operations</Label></Reveal>
        <Reveal delay={60}>
          <h2 style={{ fontFamily: C.head, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: C.text, margin: "20px 0 48px", letterSpacing: "-0.02em" }}>
            ROADMAP
          </h2>
        </Reveal>
        {ROADMAPS.map(rm => (
          <div key={rm.id}>
            <Reveal>
              <Panel style={{ padding: "20px 24px", marginBottom: "12px" }} glow>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
                  <Pulse color={C.cyan} size={8} />
                  <span style={{ fontFamily: C.head, fontSize: "1.2rem", fontWeight: 800, color: C.text }}>{rm.name}</span>
                  <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.cyan, border: `1px solid ${C.cyan}40`, padding: "2px 8px" }}>ACTIVE</span>
                </div>
                <p style={{ fontFamily: C.body, fontSize: "0.84rem", color: C.textMid, lineHeight: 1.8, paddingLeft: "20px", borderLeft: `2px solid ${C.cyan}30` }}>{rm.desc}</p>
              </Panel>
            </Reveal>
            {rm.phases.map((ph, pi) => <PhaseBlock key={ph.id} phase={ph} delay={pi * 60} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseBlock({ phase, delay }) {
  const [open, setOpen] = useState(phase.status === "active");
  const isActive = phase.status === "active";
  const col = isActive ? C.cyan : C.textDim;
  return (
    <Reveal delay={delay}>
      <div style={{ marginBottom: "8px", border: `1px solid ${isActive ? C.cyan + "40" : C.border}` }}>
        <div onClick={() => setOpen(o => !o)}
          style={{ padding: "14px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: isActive ? C.cyanGlow : "transparent", userSelect: "none" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {isActive && <Pulse color={C.cyan} size={7} />}
            <span style={{ fontFamily: C.mono, fontSize: "0.62rem", color: col, letterSpacing: "0.1em" }}>{phase.phase} · {phase.days}</span>
            <span style={{ fontFamily: C.head, fontSize: "0.95rem", fontWeight: 700, color: isActive ? C.text : C.textMid }}>{phase.title}</span>
          </div>
          <span style={{ fontFamily: C.mono, fontSize: "0.65rem", color: col }}>{open ? "▲" : "▼"}</span>
        </div>
        {open && (
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, fontFamily: C.mono, fontSize: "0.72rem", color: C.textDim, lineHeight: 1.7 }}>
              OBJECTIVE // {phase.goal}
            </div>
            {phase.weeks.map(w => <WeekRow key={w.id} week={w} col={col} />)}
          </div>
        )}
      </div>
    </Reveal>
  );
}

function WeekRow({ week, col }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "10px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        onMouseEnter={e => e.currentTarget.style.background = C.cyanGlow}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.textDim, minWidth: "55px" }}>{week.week}</span>
          <span style={{ fontFamily: C.mono, fontSize: "0.76rem", color: C.textMid }}>{week.title}</span>
        </div>
        <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.textDim }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "8px 16px 14px clamp(20px,6vw,44px)" }}>
          {week.items.map((item, i) => (
            <div key={i} style={{ fontFamily: C.mono, fontSize: "0.7rem", color: C.textDim, padding: "4px 0", display: "flex", gap: "8px", lineHeight: 1.5 }}>
              <span style={{ color: col, flexShrink: 0 }}>→</span>{item}
            </div>
          ))}
          <div style={{ marginTop: "10px", padding: "7px 12px", background: C.cyanGlow, border: `1px solid ${C.cyan}20`, fontFamily: C.mono, fontSize: "0.65rem", color: C.textMid, lineHeight: 1.5 }}>
            DELIVERABLE: {week.deliverable}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CERTS
// ─────────────────────────────────────────────────────────────
function CertsSection() {
  const STATUS_COL   = { earned: C.green, active: C.amber, queued: C.textDim };
  const STATUS_LABEL = { earned: "CLEARED", active: "IN PROGRESS", queued: "QUEUED" };

  return (
    <div style={{ padding: "100px clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal><Label>Clearance Registry</Label></Reveal>
        <Reveal delay={60}>
          <h2 style={{ fontFamily: C.head, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: C.text, margin: "20px 0 48px", letterSpacing: "-0.02em" }}>
            CERTIFICATIONS
          </h2>
        </Reveal>

        {["earned", "active", "queued"].map(g => (
          <Reveal key={g} delay={120}>
            <div style={{ marginBottom: "28px" }}>

              {/* Group label */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Pulse color={STATUS_COL[g]} size={6} />
                <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: STATUS_COL[g], letterSpacing: "0.18em" }}>{STATUS_LABEL[g]}</span>
              </div>

              {/* One panel per cert — exactly like merged */}
              {CERTS.filter(c => c.status === g).map(c => {
                const col = STATUS_COL[g];
                return (
                  <Panel key={c.id} style={{ marginBottom: "6px", borderLeft: `3px solid ${col}` }}>
                    <div onClick={() => c.badgeUrl && window.open(c.badgeUrl, "_blank")}
                      style={{ padding: "13px 16px", display: "flex", gap: "14px", alignItems: "center", cursor: c.badgeUrl ? "pointer" : "default", transition: "background 0.18s" }}
                      onMouseEnter={e => { if (c.badgeUrl) e.currentTarget.style.background = C.panelHi; }}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      {/* Cert abbreviation */}
                      <div style={{ fontFamily: C.head, fontSize: "1.1rem", fontWeight: 800, color: col, minWidth: "52px", flexShrink: 0 }}>{c.name}</div>
                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: C.mono, fontSize: "0.74rem", color: C.text, marginBottom: "3px" }}>{c.full}</div>
                        <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.textDim, lineHeight: 1.5 }}>{c.issuer} · {c.year} · {c.desc}</div>
                        {c.status === "active" && (
                          <div style={{ marginTop: "8px", display: "flex", gap: "10px", alignItems: "center" }}>
                            <div style={{ flex: 1, height: "3px", background: C.border }}>
                              <div style={{ width: `${c.pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.amber}, ${C.cyan})` }} />
                            </div>
                            <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.amber, flexShrink: 0 }}>{c.pct}%</span>
                          </div>
                        )}
                      </div>
                      {/* Right side: verify arrow or pulse */}
                      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                        <Pulse color={col} size={5} />
                        {c.badgeUrl && <span style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.cyan }}>↗</span>}
                      </div>
                    </div>
                  </Panel>
                );
              })}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WRITEUPS
// ─────────────────────────────────────────────────────────────
function WriteupsSection() {
  const collections = [...new Set(WRITEUPS.map(w => w.collection))];
  return (
    <div style={{ padding: "100px clamp(16px,4vw,48px) 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal><Label>Intelligence Reports</Label></Reveal>
        <Reveal delay={60}>
          <h2 style={{ fontFamily: C.head, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: C.text, margin: "20px 0 48px", letterSpacing: "-0.02em" }}>
            WRITEUPS
          </h2>
        </Reveal>

        {collections.map((col, ci) => {
          const posts = WRITEUPS.filter(w => w.collection === col);
          return (
            <Reveal key={col} delay={ci * 60}>
              <Panel style={{ marginBottom: "10px", overflow: "hidden" }}>
                <div style={{ padding: "10px 20px", borderBottom: `1px solid ${C.border}`, background: C.cyanGlow, fontFamily: C.mono, fontSize: "0.65rem", color: C.cyan, letterSpacing: "0.12em" }}>
                  COLLECTION // {col.toUpperCase()}
                </div>
                {posts.map((post, i) => (
                  <div key={post.id} onClick={() => post.published && post.url && window.open(post.url, "_blank")}
                    style={{ padding: "18px 20px", borderBottom: i < posts.length - 1 ? `1px solid ${C.border}` : "none", cursor: post.published ? "pointer" : "default", opacity: post.published ? 1 : 0.5, transition: "background 0.18s" }}
                    onMouseEnter={e => { if (post.published) e.currentTarget.style.background = C.cyanGlow; }}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                      {post.tags.map(t => <span key={t} style={{ fontSize: "0.58rem", padding: "2px 8px", border: `1px solid ${C.cyan}30`, color: C.cyan, fontFamily: C.mono }}>{t}</span>)}
                      {!post.published && <span style={{ fontSize: "0.58rem", padding: "2px 8px", border: `1px solid ${C.border}`, color: C.textDim, fontFamily: C.mono }}>PENDING</span>}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: C.head, fontSize: "1rem", fontWeight: 700, color: C.text, marginBottom: "4px", wordBreak: "break-word" }}>{post.title}</div>
                        <div style={{ fontFamily: C.body, fontSize: "0.8rem", color: C.textMid, lineHeight: 1.7 }}>{post.excerpt}</div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: "right", minWidth: "60px" }}>
                        <div style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.textDim }}>{post.date}</div>
                        <div style={{ fontFamily: C.mono, fontSize: "0.62rem", color: C.textDim }}>{post.platform}</div>
                        {post.published && <div style={{ fontFamily: C.mono, fontSize: "0.7rem", color: C.cyan, marginTop: "6px" }}>↗ READ</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </Panel>
            </Reveal>
          );
        })}

        <Reveal delay={200}>
          <div style={{ marginTop: "24px", padding: "16px 20px", border: `1px dashed ${C.border}`, fontFamily: C.mono, fontSize: "0.68rem", color: C.textDim, textAlign: "center", letterSpacing: "0.08em" }}>
            TRANSMISSION ONGOING · PUBLISHING REGULARLY ON MEDIUM · MORE REPORTS IN QUEUE
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`, animation: "pulseRing 2s ease infinite" }} />
          <span style={{ fontFamily: C.head, fontSize: "0.85rem", fontWeight: 800, color: C.text, letterSpacing: "0.08em" }}>FH-02 // FAROUQHASSAN.DEV</span>
        </div>
        <div style={{ fontFamily: C.mono, fontSize: "0.6rem", color: C.textDim }}>NEXT.JS + VERCEL · {new Date().getFullYear()}</div>
        <div style={{ display: "flex", gap: "18px" }}>
          {[["LinkedIn", PROFILE.linkedin], ["GitHub", PROFILE.github], ["Medium", PROFILE.medium]].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noreferrer"
              style={{ fontFamily: C.mono, fontSize: "0.65rem", color: C.textDim, textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.cyan}
              onMouseLeave={e => e.currentTarget.style.color = C.textDim}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("home");

  const sections = {
    home:     <HomeSection setActive={setActive} />,
    about:    <AboutSection />,
    projects: <ProjectsSection />,
    roadmap:  <RoadmapSection />,
    certs:    <CertsSection />,
    writeups: <WriteupsSection />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; scroll-behavior: smooth; }
        body { background: ${C.bg}; color: ${C.text}; min-height: 100vh; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.panel}; }
        ::-webkit-scrollbar-thumb { background: ${C.cyan}; }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
          70% { box-shadow: 0 0 0 6px transparent; opacity: 0.8; }
          100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
        }
        @keyframes sectionIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .desk-nav { display: flex !important; }
        .mob-btn  { display: none  !important; }
        .hero-grid { grid-template-columns: 1fr auto; }
        .about-grid { grid-template-columns: 1fr 1fr; }
        .proj-cols { columns: 320px; }
        .signal-panel     { display: block !important; }
        .signal-panel-mob { display: none  !important; }
        .hero-name { font-size: clamp(3.5rem, 11vw, 9.5rem); }
        @media (max-width: 720px) {
          .desk-nav  { display: none  !important; }
          .mob-btn    { display: block !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .signal-panel     { display: none  !important; }
          .signal-panel-mob { display: block !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .proj-cols  { columns: 1 !important; }
          .hero-name  { font-size: 14vw !important; letter-spacing: -0.04em !important; }
        }
      `}</style>

      <GridBg />
      <Nav active={active} setActive={setActive} />

      <div key={active} style={{ position: "relative", zIndex: 1, animation: "sectionIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
        {sections[active]}
      </div>

      <Footer />
    </>
  );
}
