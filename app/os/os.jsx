"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ── DATA ─────────────────────────────────────────────────────
const ME = {
  email: "12farouq12@gmail.com",
  linkedin: "https://www.linkedin.com/in/FarouqHassan02",
  github: "https://github.com/farouq7assan0o",
  medium: "https://medium.com/@12farouq12",
  cvSoc: "/Farouq_Hassan_Junior_SOC_Analyst_CV.pdf",
  cvOffensive: "/Farouq_Hassan_CV_Offensive.pdf",
};

const PROJECTS = [
  { id:"animeblast", sev:"CRIT", cat:"PENTEST", year:2024, title:"AnimeBlast — Full-Scope Pentest", summary:"Custom Python BoF (EIP@1036), DEP/ASLR/SafeSEH bypass, SOCKS pivot, UNION SQLi, PHP shell→RCE. 10 flags captured.", findings:["EIP controlled @ 1036 bytes","DEP+ASLR+SafeSEH bypassed","SOCKS proxy pivot","UNION SELECT credential dump","PHP shell → RCE","10 flags captured"], github:null },
  { id:"malware",    sev:"CRIT", cat:"PENTEST", year:2024, title:"BackdoorBeacon.exe — Malware RE", summary:"UPX-packed backdoor full lifecycle. TLS callbacks, anti-debug NOP patch, C2 IP patched to 127.0.0.1. SYN beacon confirmed.", findings:["UPX unpack → PE analysis","IsDebuggerPresent NOP'd","C2 → 127.0.0.1","HKCU Run persistence","SSDT/IDT clean"], github:null },
  { id:"irplays",    sev:"CRIT", cat:"SOC",     year:2025, title:"IR Playbooks — 3 Scenarios",      summary:"Clinic malware, CityWorks ransomware, Bazaarjo supply-chain. ATT&CK→D3FEND. FIDO2 MFA breaks Lumma chain. Exec comms.", findings:["Ransomware decision tree","D3FEND: FIDO2 breaks Lumma","Exec update + advisory","Closure criteria all defined"], github:null },
  { id:"fair",       sev:"CRIT", cat:"GRC",     year:2024, title:"FAIR Risk — $1.38M → $177K",      summary:"Monte Carlo simulation. ALE before $1.38M/yr. After MFA+SIEM+training+IR tabletop: $177K. PDPL 72hr violation found.", findings:["ALE before: $1.38M/year","ALE after: $177K (−$1.2M)","PDPL 72hr disclosure violated","Monte Carlo via FAIR-U"], github:null },
  { id:"pcap",       sev:"HIGH", cat:"SOC",     year:2025, title:"PCAP + Memory Forensics",         summary:"HTTP C2 beaconing, DNS TXT Base64 exfil, fileless PowerShell loader uncovered via Volatility 3 malfind.", findings:["HTTP C2 /v1/checkin polling","DNS TXT Base64 exfil","RWX shellcode via malfind","Network+memory timeline correlated"], github:null },
  { id:"aptintel",   sev:"HIGH", cat:"SOC",     year:2025, title:"APT29 + Lumma Stealer Intel",     summary:"ATT&CK Navigator layers for SolarWinds+USAID. Lumma behavioral chain. Nation-state vs cybercrime.", findings:["T1195.002 supply chain — High","LSASS+token abuse — High","Lumma T1555 cred harvest","CISA+Mandiant sourced"], github:null },
  { id:"cyberblast", sev:"HIGH", cat:"PENTEST", year:2024, title:"CyberBlast — Ethical Hacking",    summary:"Nessus (20 findings), EternalBlue Meterpreter, UNION SQLi, XSS session hijack, MSFvenom payload.", findings:["Nessus: 20 vulns","EternalBlue → Meterpreter","UNION SQLi + XSS + RCE","MSFvenom reverse shell"], github:null },
  { id:"forensics",  sev:"HIGH", cat:"SOC",     year:2024, title:"BlackEagle — Digital Forensics",  summary:"NTFS manual recovery via HxD, DOCX hidden inside PNG (steganography), hidden message decoded. Chain of custody.", findings:["NTFS mirror manual recovery","DOCX inside PNG stego","Hidden message decoded","Hash verified at every step"], github:null },
  { id:"otps3",      sev:"HIGH", cat:"CLOUD",   year:2025, title:"Secure OTP S3 System",            summary:"4 critical vulns fixed: OTP in response, no expiry, brute-force, predictable S3 path. uuid4+presigned URLs.", findings:["OTP removed from API response","5-min expiry+single-use","Rate limit: 5 attempts","uuid4+presigned URL 600s"], github:null },
  { id:"sqli",       sev:"HIGH", cat:"PENTEST", year:2025, title:"SQLi + Banking Red Team Plan",    summary:"Manual SQLi (auth bypass+UNION). Full banking ROE. Cyber Kill Chain OSINT→C2→exfil documented.", findings:["Auth bypass via SQLi","UNION SELECT creds","Banking ROE documented","Full Kill Chain mapped"], github:null },
  { id:"governance", sev:"HIGH", cat:"GRC",     year:2025, title:"BazaarJo Governance Assessment",  summary:"7 deficiencies: no SoD, no CISO accountability, no breach policy. Devs deploying to prod unilaterally.", findings:["7 governance gaps","No SoD: devs → prod","No PDPL breach notification","Board brief with 12mo roadmap"], github:null },
  { id:"semgrep",    sev:"MED",  cat:"PENTEST", year:2025, title:"Semgrep SAST — GitHub Actions",   summary:"41 findings across 1015 files in Juice Shop. Sequelize SQLi detected, parameterized query fix documented.", findings:["41 findings, 1015 files","Sequelize SQLi detected","Push-triggered CI/CD pipeline","Parameterized query fix"], github:null },
  { id:"privesc",    sev:"MED",  cat:"PENTEST", year:2025, title:"Linux LFT & Privilege Escalation",summary:"Kernel 2.6.32 → Exploit-DB 18411 → LPE compiled and executed. Four file transfer methods.", findings:["Kernel 2.6.32 identified","Exploit-DB 18411 LPE","BoF compiled + executed","4 transfer methods"], github:null },
  { id:"airline",    sev:"MED",  cat:"SOC",     year:2024, title:"Secure Airline Check-in System",  summary:"SHA-256+salt, 3-strike lockout, RBAC 4 roles, fuzz-tested 100k attempts, PMD SAST.", findings:["SHA-256+salt hashing","3-strike lockout","RBAC 4 roles","100k fuzz test"], github:"https://github.com/farouq7assan0o/SecureCoding" },
  { id:"apache",     sev:"MED",  cat:"CLOUD",   year:2025, title:"Apache + SSH Hardening (CIS)",    summary:"5 Apache misconfigs fixed. SSH: key-only, no root, chacha20+aes256-gcm only. CIS 2.2–3.5.", findings:["5 CIS findings fixed","TraceEnable Off + no indexes","/server-status → 403","Key-only SSH, no root"], github:null },
  { id:"risk",       sev:"MED",  cat:"GRC",     year:2025, title:"Enterprise Risk Management Plan", summary:"ISO 27005+NIST 800-30. 6 risks rated, If-Then statements, KRIs defined. Board reporting cadence.", findings:["PII: Critical H×H","If-Then: git → injection","KRIs: MFA%, deploys","Quarterly board reporting"], github:null },
  { id:"bia",        sev:"MED",  cat:"GRC",     year:2025, title:"Business Impact Analysis",        summary:"6 processes. Payment: RTO 15min/RPO 0–5min. IR: RTO 15min/RPO 0. Recovery order documented.", findings:["Payment RTO 15/RPO 0–5","IR RTO 15/RPO 0","Orders RTO 30/RPO 5","Recovery order defined"], github:null },
  { id:"isms",       sev:"MED",  cat:"GRC",     year:2024, title:"ISMS Design — Bluefrontier Bank", summary:"ISO 27001 full scope. COBIT 2019 7-phase. BIA, risk register, 3-stage audit. Financial ROI.", findings:["ISO 27001 full scope","COBIT 2019: 7-phase","BIA: 6 processes","Executive ROI quantified"], github:null },
  { id:"network",    sev:"MED",  cat:"CLOUD",   year:2023, title:"Enterprise Network Security",     summary:"5-site IPsec VPN, ASA DMZ+NAT, full-mesh OSPF, VLAN segmentation, port security, AAA.", findings:["IPsec VPN: AES+SHA","ASA DMZ+NAT","Full-mesh OSPF WAN","VLAN per department"], github:null },
  { id:"crypto",     sev:"MED",  cat:"GRC",     year:2024, title:"Applied Cryptography",            summary:"MITM on 2-DES (2¹¹²→2⁵⁷), ECB pattern leakage, hybrid RSA+DES, Square-and-Multiply.", findings:["MITM: 2¹¹²→2⁵⁷","ECB leakage visualised","RSA+DES hybrid","O(log e) exponentiation"], github:null },
  { id:"ftp",        sev:"MED",  cat:"PENTEST", year:2025, title:"FTP Brute Force Lab",             summary:"Anonymous FTP confirmed, Hydra vs 100k NCSC wordlist, no lockout resistance. Hardening documented.", findings:["Anonymous FTP confirmed","100k NCSC wordlist","Zero lockout resistance","Fail2Ban+SFTP remediation"], github:null },
  { id:"hopechain",  sev:"LOW",  cat:"OTHER",   year:2024, title:"HopeChain — Blockchain DApp",     summary:"Reentrancy mitigated, zkSNARK privacy proposed, multisig+timelock. Jordan NGO compliance.", findings:["Reentrancy via transfer()","zkSNARK proposed","Multisig+timelocks","Jordan NGO compliance"], github:null },
  { id:"spark",      sev:"LOW",  cat:"OTHER",   year:2025, title:"SPARK — Wearable INR Patch",      summary:"Led 6-person team. Non-invasive INR monitoring. AI emergency alerts. $1.65M SOM validated.", findings:["Led 6-person team","$1.65M SOM in $55M market","Continuous INR monitoring","AI alerts: patient+caregiver"], github:null },
];

const CERTS = [
  { id:"cdsa", name:"CDSA", full:"Certified Defensive Security Analyst", issuer:"Hack The Box", year:"2025", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9385aaf3-d974-43d8-8144-0dca4b70746b" },
  { id:"cwse", name:"CWSE", full:"Certified Web Security Expert",        issuer:"Hackviser",    year:"2025", status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CWSE-D15I7TON" },
  { id:"capt", name:"CAPT", full:"Certified Associate Pen Tester",      issuer:"Hackviser",    year:"2025", status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CAPT-T3O8P3JO" },
  { id:"nca",  name:"NCA",  full:"Nutanix Certified Associate v6",      issuer:"Nutanix",      year:"2025", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9c45a9a4-34b0-46b8-819f-25b6b053dfdd" },
  { id:"cwes", name:"CWES", full:"Certified Web Exploitation Specialist",issuer:"Hack The Box", year:"2026", status:"active", pct:70,  url:null },
  { id:"cpts", name:"CPTS", full:"Certified Penetration Testing Specialist",issuer:"Hack The Box",year:"2026",status:"active",pct:45, url:null },
  { id:"sec",  name:"SEC+", full:"CompTIA Security+ SY0-701",           issuer:"CompTIA",      year:"2026", status:"queued", pct:0,   url:null },
  { id:"ccna", name:"CCNA", full:"Cisco CCNA 200-301",                  issuer:"Cisco",        year:"2026", status:"queued", pct:0,   url:null },
];

const ROADMAP = [
  { phase:"Phase 1", days:"Days 1–30", title:"Detection Engineering Fundamentals", status:"active",
    goal:"15–20 production-grade detections for real AD attack paths.",
    weeks:[
      { w:"Week 1", t:"Lab Foundation",                  items:["DC+2 Win10+Kali+Splunk","Sysmon all endpoints","PowerShell Script Block Logging","AD auditing: 4662,4742,4738,4672"], d:"Lab architecture + logging baseline" },
      { w:"Week 2", t:"Initial Access & Execution",      items:["Phishing macro→PowerShell","Encoded PowerShell/IEX","Office spawning cmd/powershell"], d:"5 detection rules + MITRE mapping" },
      { w:"Week 3", t:"Privilege Escalation",            items:["UAC bypass","Scheduled tasks Event 4698","Registry run keys","Service creation"], d:"6 detection rules + alert logic" },
      { w:"Week 4", t:"Credential Access",               items:["Mimikatz+LSASS Sysmon 10","Kerberoasting 4769 RC4","Pass-the-Hash","Logon Type 9/abnormal 4672"], d:"Credential Theft Detection Pack" },
    ]},
  { phase:"Phase 2", days:"Days 31–60", title:"AD Threat Hunting", status:"upcoming",
    goal:"Domain Compromise Detection Framework.",
    weeks:[
      { w:"Week 5", t:"Lateral Movement",    items:["SMB/PsExec/WMI/WinRM","ADMIN$+named pipe anomalies","Event 4624 Type 3 workstation→DC"], d:"Lateral movement detection rules" },
      { w:"Week 6", t:"DCSync & DCShadow",   items:["DCSync (4662 replication GUIDs)","DCShadow (4742/4738 anomalies)","AD object modification tracking"], d:"Domain Compromise Detection Framework" },
      { w:"Week 7", t:"Threat Hunting",      items:["Rare logon types","Rare parent-child processes","Rare LDAP burst","Baseline vs anomaly"], d:"10 threat hunting queries" },
      { w:"Week 8", t:"SIEM Engineering",    items:["Field normalization","Multi-stage correlation","Risk-based alerting+noise reduction"], d:"3 multi-stage correlation rules" },
    ]},
  { phase:"Phase 3", days:"Days 61–90", title:"Automation & Portfolio", status:"upcoming",
    goal:"SOAR pipeline, purple team, public GitHub.",
    weeks:[
      { w:"Week 9",  t:"SOAR & Case Mgmt",    items:["TheHive+Shuffle","Alert→Case auto-creation","IP enrichment+MITRE tag"], d:"Working SOAR pipeline" },
      { w:"Week 10", t:"Purple Team Sim",      items:["Day 1: Phishing","Day 2: Kerberoast","Day 3: Lateral Movement","Day 4: DCSync"], d:"Detection gap analysis report" },
      { w:"Week 11", t:"Detection Portfolio",  items:["GitHub: all rules","Write-ups per chain","Red vs Blue results"], d:"Public portfolio on GitHub" },
      { w:"Week 12", t:"Enterprise Readiness", items:["LAPS+Credential Guard","Tiered AD/ESAE","Prevention mindset"], d:"Enterprise hardening checklist" },
    ]},
];

// ── OS TOKENS ────────────────────────────────────────────────
const OS = {
  wallpaper: "linear-gradient(135deg, #0d1b2a 0%, #1a1040 40%, #0a1628 70%, #162032 100%)",
  taskbar:   "rgba(15,15,25,0.92)",
  winBg:     "rgba(20,22,35,0.97)",
  winBar:    "rgba(30,32,50,0.98)",
  winBorder: "rgba(255,255,255,0.1)",
  accent:    "#5B8DEF",
  accentHi:  "#7EB3FF",
  text:      "#E4E8F0",
  textDim:   "#8892A4",
  textFaint: "#4A5468",
  mono:      "'JetBrains Mono','Fira Code',monospace",
  sans:      "'Inter','DM Sans',sans-serif",
  green:     "#4ADE80",
  red:       "#F87171",
  amber:     "#FBBF24",
  purple:    "#C084FC",
};

const SEV_COL = { CRIT: OS.red, HIGH: OS.amber, MED: OS.accent, LOW: OS.textFaint };
const CAT_COL = { PENTEST: OS.red, SOC: OS.accent, CLOUD: "#38BDF8", GRC: OS.amber, OTHER: OS.purple };
const CAT_ICON = { PENTEST:"⚔", SOC:"🛡", CLOUD:"☁", GRC:"📋", OTHER:"⬡" };

// ── DRAG HOOK ────────────────────────────────────────────────
function useDrag(initialPos) {
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (e.target.closest("[data-no-drag]")) return;
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - 100)),
        y: Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - 100)),
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  return [pos, onMouseDown, setPos];
}

// ── WINDOW CHROME ────────────────────────────────────────────
let globalZ = 100;
function Window({ id, title, icon, children, initialPos, initialSize, onClose, onFocus, zIndex, minimized }) {
  const [pos, onDragStart] = useDrag(initialPos);
  const winRef = useRef(null);

  if (minimized) return null;

  return (
    <div ref={winRef}
      onMouseDown={onFocus}
      style={{
        position: "fixed", left: pos.x, top: pos.y, zIndex,
        width: initialSize?.w || "clamp(340px,55vw,680px)",
        maxHeight: initialSize?.h || "clamp(300px,70vh,600px)",
        background: OS.winBg,
        border: `1px solid ${OS.winBorder}`,
        borderRadius: 10,
        boxShadow: `0 24px 64px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.06)`,
        display: "flex", flexDirection: "column",
        backdropFilter: "blur(20px)",
        overflow: "hidden",
        userSelect: "none",
      }}>
      {/* Title bar */}
      <div onMouseDown={onDragStart}
        style={{ background: OS.winBar, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, borderBottom: `1px solid rgba(255,255,255,0.06)`, cursor: "move" }}>
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6 }} data-no-drag>
          {[OS.red, OS.amber, OS.green].map((c, i) => (
            <div key={i} onClick={i === 0 ? onClose : undefined}
              style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.9, cursor: i === 0 ? "pointer" : "default", transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.9"} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: "center", fontFamily: OS.sans, fontSize: "0.72rem", color: OS.textDim, letterSpacing: "0.04em", marginLeft: -52 }}>
          {icon && <span style={{ marginRight: 6 }}>{icon}</span>}{title}
        </div>
      </div>
      {/* Content */}
      <div data-no-drag style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

// ── TERMINAL BOOT ────────────────────────────────────────────
function TerminalWindow({ onClose, onFocus, zIndex, minimized }) {
  const [lines, setLines] = useState([]);
  const endRef = useRef(null);
  const BOOT = [
    { t: 100,  txt: "FH-OS v2026.06 — Initializing...", col: OS.green },
    { t: 400,  txt: "Loading kernel modules...", col: OS.textDim },
    { t: 700,  txt: "[  OK  ] Loaded: soc-engine.ko", col: OS.green },
    { t: 900,  txt: "[  OK  ] Loaded: pentest-suite.ko", col: OS.green },
    { t: 1100, txt: "[  OK  ] Loaded: detection-framework.ko", col: OS.green },
    { t: 1400, txt: "Mounting credentials...", col: OS.textDim },
    { t: 1650, txt: "[  OK  ] CDSA — verified", col: OS.green },
    { t: 1850, txt: "[  OK  ] CWSE — verified", col: OS.green },
    { t: 2050, txt: "[  OK  ] CAPT — verified", col: OS.green },
    { t: 2250, txt: "[  OK  ] NCA  — verified", col: OS.green },
    { t: 2500, txt: "Starting internship daemon...", col: OS.textDim },
    { t: 2750, txt: "[  OK  ] scc-jaf.service — active (Month 5/8)", col: OS.accent },
    { t: 3000, txt: "Loading threat database...", col: OS.textDim },
    { t: 3200, txt: "[  OK  ] 23 operations indexed", col: OS.green },
    { t: 3400, txt: "[  OK  ] APT29 / Lumma profiles loaded", col: OS.green },
    { t: 3700, txt: "Checking active operations...", col: OS.textDim },
    { t: 3900, txt: "[ RUN  ] cwes.service — 70% complete", col: OS.amber },
    { t: 4100, txt: "[ RUN  ] cpts.service — 45% complete", col: OS.amber },
    { t: 4300, txt: "[ RUN  ] detection-roadmap.service — active", col: OS.amber },
    { t: 4600, txt: "────────────────────────────────────────", col: OS.textFaint },
    { t: 4800, txt: "FH-OS ready. Welcome, Farouq Hassan.", col: OS.accentHi },
    { t: 5100, txt: "Available for hire — June 2026", col: OS.purple },
    { t: 5300, txt: "farouq@fh-os:~$ _", col: OS.green, blink: true },
  ];
  useEffect(() => {
    BOOT.forEach(({ t, txt, col, blink }) => {
      setTimeout(() => setLines(l => [...l, { txt, col, blink }]), t);
    });
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  return (
    <Window id="terminal" title="terminal — farouq@fh-os" icon=">" onClose={onClose} onFocus={onFocus} zIndex={zIndex} minimized={minimized} initialPos={{ x: 60, y: 80 }} initialSize={{ w: 560, h: 420 }}>
      <div style={{ padding: "14px 18px", fontFamily: OS.mono, fontSize: "0.75rem", lineHeight: 1.9, background: "#0a0c12" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.col, animation: l.blink ? "blink 1s step-end infinite" : "none" }}>{l.txt}</div>
        ))}
        <div ref={endRef} />
      </div>
    </Window>
  );
}

// ── ABOUT WINDOW ─────────────────────────────────────────────
function AboutWindow({ onClose, onFocus, zIndex, minimized }) {
  return (
    <Window id="about" title="about_me.txt" icon="👤" onClose={onClose} onFocus={onFocus} zIndex={zIndex} minimized={minimized} initialPos={{ x: 140, y: 120 }} initialSize={{ w: 580, h: 500 }}>
      <div style={{ padding: 24 }}>
        {/* Header card */}
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 22, padding: 16, background: "rgba(91,141,239,0.08)", border: `1px solid rgba(91,141,239,0.2)`, borderRadius: 8 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: `linear-gradient(135deg, ${OS.accent}, ${OS.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>🛡</div>
          <div>
            <div style={{ fontFamily: OS.sans, fontSize: "1.1rem", fontWeight: 700, color: OS.text, marginBottom: 2 }}>Farouq Hassan</div>
            <div style={{ fontFamily: OS.mono, fontSize: "0.68rem", color: OS.accent }}>SOC Analyst · Detection Engineer · Penetration Tester</div>
            <div style={{ fontFamily: OS.mono, fontSize: "0.62rem", color: OS.textFaint, marginTop: 4 }}>Amman, Jordan · Available June 2026</div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ fontFamily: OS.sans, fontSize: "0.82rem", color: OS.textDim, lineHeight: 1.85, marginBottom: 20, padding: "0 2px" }}>
          Cybersecurity student at HTU, graduating June 2026. 8-month internship at SCC–Jordan Armed Forces (month 5/8). Studying offensive and defensive tracks simultaneously — CWES 70%, CPTS 45%, CDSA done. Top 10 out of 300+ at NCSCJO national bootcamp. Everything documented publicly.
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {[["23+","Operations"],["4","Certs Earned"],["8mo","Gov. Internship"],["300+","Competition"],["Top 10","NCSCJO"],["$1.2M","Risk Reduced"]].map(([v, l]) => (
            <div key={l} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 6, textAlign: "center" }}>
              <div style={{ fontFamily: OS.mono, fontSize: "1rem", fontWeight: 700, color: OS.text }}>{v}</div>
              <div style={{ fontFamily: OS.mono, fontSize: "0.56rem", color: OS.textFaint, marginTop: 2, letterSpacing: "0.08em" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Field data */}
        {[["EDUCATION","B.Sc. Cybersecurity — HTU · Jun 2026"],["INTERNSHIP","SCC–Jordan Armed Forces · Oct 2025–Jun 2026"],["PLATFORM","HackTheBox — CDSA ✓ · CWES 70% · CPTS 45%"],["CONTACT",ME.email],["LANGUAGES","Arabic · English · German · Italian (beginner)"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 14, padding: "8px 0", borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
            <div style={{ fontFamily: OS.mono, fontSize: "0.58rem", color: OS.accent, minWidth: 90, letterSpacing: "0.1em", paddingTop: 1, flexShrink: 0 }}>{k}</div>
            <div style={{ fontFamily: OS.mono, fontSize: "0.72rem", color: OS.textDim }}>{v}</div>
          </div>
        ))}

        {/* Links */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
          {[["↓ CV — SOC",ME.cvSoc,true],["↓ CV — Pentest",ME.cvOffensive,true],["LinkedIn ↗",ME.linkedin,false],["GitHub ↗",ME.github,false],["Medium ↗",ME.medium,false]].map(([l,u,dl])=>(
            <a key={l} href={u} target={dl?"_self":"_blank"} rel="noreferrer" download={dl||undefined}
              style={{ padding:"5px 13px", border:`1px solid ${dl?"rgba(91,141,239,0.5)":"rgba(255,255,255,0.1)"}`, color: dl?OS.accent:OS.textDim, fontFamily:OS.mono, fontSize:"0.65rem", textDecoration:"none", borderRadius:4, transition:"all 0.18s", background: dl?"rgba(91,141,239,0.08)":"transparent" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=OS.accent;e.currentTarget.style.color=OS.accentHi;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=dl?"rgba(91,141,239,0.5)":"rgba(255,255,255,0.1)";e.currentTarget.style.color=dl?OS.accent:OS.textDim;}}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </Window>
  );
}

// ── PROJECTS WINDOW ──────────────────────────────────────────
function ProjectsWindow({ onClose, onFocus, zIndex, minimized }) {
  const [selected, setSelected] = useState(PROJECTS[0]);
  const [catF, setCatF] = useState("ALL");
  const cats = ["ALL","PENTEST","SOC","CLOUD","GRC","OTHER"];
  const filtered = PROJECTS.filter(p => catF === "ALL" || p.cat === catF);

  return (
    <Window id="projects" title="operations_log.db" icon="⚙" onClose={onClose} onFocus={onFocus} zIndex={zIndex} minimized={minimized} initialPos={{ x: 200, y: 60 }} initialSize={{ w: 720, h: 560 }}>
      <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid rgba(255,255,255,0.06)`, display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.2)" }}>
          {/* Cat filter */}
          <div style={{ padding: "10px 8px", borderBottom: `1px solid rgba(255,255,255,0.06)`, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCatF(c)}
                style={{ padding: "2px 7px", background: catF===c?(CAT_COL[c]||OS.accent)+"22":"none", border:`1px solid ${catF===c?(CAT_COL[c]||OS.accent)+"60":"rgba(255,255,255,0.08)"}`, color:catF===c?(CAT_COL[c]||OS.accentHi):OS.textFaint, fontFamily:OS.mono, fontSize:"0.56rem", cursor:"pointer", borderRadius:3, transition:"all 0.15s" }}>
                {c==="ALL"?"ALL":CAT_ICON[c]}
              </button>
            ))}
          </div>
          {/* File list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => setSelected(p)}
                style={{ padding: "8px 12px", cursor: "pointer", background: selected?.id===p.id?"rgba(91,141,239,0.12)":"transparent", borderLeft: `2px solid ${selected?.id===p.id?(CAT_COL[p.cat]||OS.accent):"transparent"}`, transition: "all 0.15s" }}
                onMouseEnter={e => { if(selected?.id!==p.id) e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if(selected?.id!==p.id) e.currentTarget.style.background="transparent"; }}>
                <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:2 }}>
                  <span style={{ fontSize:"0.65rem" }}>{CAT_ICON[p.cat]}</span>
                  <span style={{ fontFamily:OS.mono, fontSize:"0.58rem", color:SEV_COL[p.sev], letterSpacing:"0.06em" }}>{p.sev}</span>
                  <span style={{ fontFamily:OS.mono, fontSize:"0.52rem", color:OS.textFaint, marginLeft:"auto" }}>{p.year}</span>
                </div>
                <div style={{ fontFamily:OS.sans, fontSize:"0.71rem", color: selected?.id===p.id?OS.text:OS.textDim, lineHeight:1.3, fontWeight: selected?.id===p.id?600:400 }}>
                  {p.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail pane */}
        {selected && (
          <div style={{ flex:1, padding:20, overflowY:"auto" }}>
            <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
              <span style={{ fontFamily:OS.mono, fontSize:"0.58rem", padding:"3px 9px", background:SEV_COL[selected.sev]+"20", color:SEV_COL[selected.sev], border:`1px solid ${SEV_COL[selected.sev]}40`, borderRadius:3 }}>{selected.sev}</span>
              <span style={{ fontFamily:OS.mono, fontSize:"0.58rem", padding:"3px 9px", background:(CAT_COL[selected.cat]||OS.accent)+"20", color:CAT_COL[selected.cat]||OS.accent, border:`1px solid ${CAT_COL[selected.cat]||OS.accent}40`, borderRadius:3 }}>{selected.cat}</span>
              <span style={{ fontFamily:OS.mono, fontSize:"0.58rem", color:OS.textFaint, marginLeft:"auto" }}>{selected.year}</span>
            </div>
            <h2 style={{ fontFamily:OS.sans, fontSize:"1.05rem", fontWeight:700, color:OS.text, marginBottom:12, lineHeight:1.3 }}>{selected.title}</h2>
            <p style={{ fontFamily:OS.sans, fontSize:"0.8rem", color:OS.textDim, lineHeight:1.85, marginBottom:18 }}>{selected.summary}</p>
            <div style={{ fontFamily:OS.mono, fontSize:"0.6rem", color:OS.textFaint, letterSpacing:"0.14em", marginBottom:10 }}>KEY FINDINGS</div>
            {selected.findings.map((f,i)=>(
              <div key={i} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom:`1px solid rgba(255,255,255,0.04)`, fontFamily:OS.mono, fontSize:"0.7rem", color:OS.textDim, lineHeight:1.5 }}>
                <span style={{ color:SEV_COL[selected.sev], flexShrink:0 }}>▶</span>{f}
              </div>
            ))}
            {selected.github&&(
              <a href={selected.github} target="_blank" rel="noreferrer"
                style={{ display:"inline-block", marginTop:14, fontFamily:OS.mono, fontSize:"0.65rem", color:OS.accent, textDecoration:"none", padding:"5px 12px", border:`1px solid ${OS.accent}40`, borderRadius:4, transition:"all 0.18s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=OS.accent+"20";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                ↗ View on GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </Window>
  );
}

// ── CERTS WINDOW ─────────────────────────────────────────────
function CertsWindow({ onClose, onFocus, zIndex, minimized }) {
  return (
    <Window id="certs" title="credentials.vault" icon="🔐" onClose={onClose} onFocus={onFocus} zIndex={zIndex} minimized={minimized} initialPos={{ x: 300, y: 140 }} initialSize={{ w: 540, h: 480 }}>
      <div style={{ padding: 20 }}>
        {[{g:"earned",l:"CLEARED",col:OS.green},{g:"active",l:"IN PROGRESS",col:OS.amber},{g:"queued",l:"QUEUED",col:OS.textFaint}].map(({g,l,col})=>(
          <div key={g} style={{ marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:col, boxShadow:`0 0 6px ${col}` }} />
              <span style={{ fontFamily:OS.mono, fontSize:"0.6rem", color:col, letterSpacing:"0.15em" }}>{l}</span>
            </div>
            {CERTS.filter(c=>c.status===g).map(c=>(
              <div key={c.id} onClick={()=>c.url&&window.open(c.url,"_blank")}
                style={{ display:"flex", gap:14, alignItems:"center", padding:"10px 12px", marginBottom:4, background:"rgba(255,255,255,0.03)", border:`1px solid ${g==="earned"?OS.green+"20":"rgba(255,255,255,0.06)"}`, borderRadius:6, cursor:c.url?"pointer":"default", transition:"all 0.18s", borderLeft:`3px solid ${col}` }}
                onMouseEnter={e=>{if(c.url){e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderLeftColor=col;}}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderLeftColor=col;}}>
                <div style={{ fontFamily:OS.mono, fontSize:"0.95rem", fontWeight:700, color:col, minWidth:48, flexShrink:0 }}>{c.name}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:OS.sans, fontSize:"0.72rem", color:OS.text, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.full}</div>
                  <div style={{ fontFamily:OS.mono, fontSize:"0.58rem", color:OS.textFaint }}>{c.issuer} · {c.year}</div>
                  {c.status==="active"&&<div style={{ marginTop:6, display:"flex", gap:8, alignItems:"center" }}>
                    <div style={{ flex:1, height:2, background:"rgba(255,255,255,0.08)", borderRadius:1 }}>
                      <div style={{ width:`${c.pct}%`, height:"100%", background:`linear-gradient(90deg,${OS.amber},${OS.accentHi})`, borderRadius:1 }} />
                    </div>
                    <span style={{ fontFamily:OS.mono, fontSize:"0.6rem", color:OS.amber, flexShrink:0 }}>{c.pct}%</span>
                  </div>}
                </div>
                {c.url&&<span style={{ fontFamily:OS.mono, fontSize:"0.6rem", color:OS.accent, flexShrink:0 }}>↗</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Window>
  );
}

// ── ROADMAP WINDOW ───────────────────────────────────────────
function RoadmapWindow({ onClose, onFocus, zIndex, minimized }) {
  const [openPh, setOpenPh] = useState("Phase 1");
  const [openW, setOpenW] = useState(null);
  return (
    <Window id="roadmap" title="90day_roadmap.md" icon="🗺" onClose={onClose} onFocus={onFocus} zIndex={zIndex} minimized={minimized} initialPos={{ x: 120, y: 100 }} initialSize={{ w: 600, h: 520 }}>
      <div style={{ padding:20 }}>
        <div style={{ fontFamily:OS.sans, fontSize:"0.78rem", color:OS.textDim, lineHeight:1.8, marginBottom:20, padding:"10px 14px", background:"rgba(91,141,239,0.06)", border:`1px solid rgba(91,141,239,0.15)`, borderRadius:6 }}>
          90-Day Detection Engineering — build 15–20 production-grade rules, a Domain Compromise Detection Framework, and a public GitHub portfolio.
        </div>
        {ROADMAP.map((ph,pi)=>(
          <div key={ph.phase} style={{ marginBottom:6, border:`1px solid ${ph.status==="active"?"rgba(74,222,128,0.2)":"rgba(255,255,255,0.06)"}`, borderRadius:6, overflow:"hidden" }}>
            <div onClick={()=>setOpenPh(openPh===ph.phase?null:ph.phase)}
              style={{ padding:"11px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", background:ph.status==="active"?"rgba(74,222,128,0.05)":"rgba(255,255,255,0.02)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                {ph.status==="active"&&<div style={{ width:6,height:6,borderRadius:"50%",background:OS.green,boxShadow:`0 0 6px ${OS.green}` }} />}
                <span style={{ fontFamily:OS.mono, fontSize:"0.58rem", color:OS.textFaint, letterSpacing:"0.1em" }}>{ph.phase} · {ph.days}</span>
                <span style={{ fontFamily:OS.sans, fontSize:"0.82rem", fontWeight:600, color:ph.status==="active"?OS.text:OS.textDim }}>{ph.title}</span>
              </div>
              <span style={{ fontFamily:OS.mono, fontSize:"0.6rem", color:OS.textFaint }}>{openPh===ph.phase?"▲":"▼"}</span>
            </div>
            {openPh===ph.phase&&(
              <div style={{ borderTop:`1px solid rgba(255,255,255,0.05)` }}>
                <div style={{ padding:"8px 14px 10px", fontFamily:OS.mono, fontSize:"0.65rem", color:OS.textFaint, borderBottom:`1px solid rgba(255,255,255,0.04)` }}>OBJECTIVE: {ph.goal}</div>
                {ph.weeks.map(w=>(
                  <div key={w.w} style={{ borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                    <div onClick={()=>setOpenW(openW===w.w?null:w.w)}
                      style={{ padding:"8px 14px 8px 24px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{ display:"flex", gap:14 }}>
                        <span style={{ fontFamily:OS.mono, fontSize:"0.56rem", color:OS.textFaint, minWidth:50 }}>{w.w}</span>
                        <span style={{ fontFamily:OS.mono, fontSize:"0.7rem", color:OS.textDim }}>{w.t}</span>
                      </div>
                      <span style={{ fontFamily:OS.mono, fontSize:"0.58rem", color:OS.textFaint }}>{openW===w.w?"▲":"▼"}</span>
                    </div>
                    {openW===w.w&&(
                      <div style={{ padding:"6px 14px 12px 50px" }}>
                        {w.items.map((item,i)=>(
                          <div key={i} style={{ fontFamily:OS.mono, fontSize:"0.66rem", color:OS.textFaint, padding:"3px 0", display:"flex", gap:8, lineHeight:1.5 }}>
                            <span style={{ color:OS.accent, flexShrink:0 }}>›</span>{item}
                          </div>
                        ))}
                        <div style={{ marginTop:8, padding:"5px 10px", background:"rgba(91,141,239,0.08)", border:`1px solid rgba(91,141,239,0.15)`, borderRadius:4, fontFamily:OS.mono, fontSize:"0.62rem", color:OS.accent }}>
                          ↳ {w.d}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Window>
  );
}

// ── WRITEUPS WINDOW ──────────────────────────────────────────
const WRITEUPS = [
  { title:"HTB CDSA — What It Really Takes to Pass", date:"Feb 2026", tags:["CDSA","Blue Team"], blurb:"Honest account of CDSA exam demands — lab hours, pressure, what worked. No fluff.", url:"https://medium.com/@12farouq12/htb-cdsa-2025-what-it-really-takes-to-pass-the-certified-defensive-security-analyst-exam-5215213392cc", live:true },
  { title:"HTB Machine Writeup #1", date:"Mar 2026", tags:["HTB","Linux"], blurb:"Full walkthrough recon to root.", url:null, live:false },
  { title:"Detection Engineering: Writing Real Sigma Rules", date:"Coming", tags:["Detection","Sigma"], blurb:"Production-grade detections for AD attack paths with MITRE mapping and FP tuning.", url:null, live:false },
];

function WriteupsWindow({ onClose, onFocus, zIndex, minimized }) {
  return (
    <Window id="writeups" title="dispatches/" icon="📝" onClose={onClose} onFocus={onFocus} zIndex={zIndex} minimized={minimized} initialPos={{ x: 250, y: 120 }} initialSize={{ w: 520, h: 420 }}>
      <div style={{ padding:20 }}>
        {WRITEUPS.map((w,i)=>(
          <div key={w.title} onClick={()=>w.live&&w.url&&window.open(w.url,"_blank")}
            style={{ padding:"14px", marginBottom:8, background:"rgba(255,255,255,0.03)", border:`1px solid rgba(255,255,255,0.07)`, borderRadius:6, cursor:w.live?"pointer":"default", opacity:w.live?1:0.5, transition:"all 0.18s" }}
            onMouseEnter={e=>{if(w.live)e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
            <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
              {w.tags.map(t=><span key={t} style={{ fontFamily:OS.mono, fontSize:"0.54rem", padding:"2px 7px", border:`1px solid rgba(91,141,239,0.3)`, color:OS.accent, borderRadius:3 }}>{t}</span>)}
              {!w.live&&<span style={{ fontFamily:OS.mono, fontSize:"0.54rem", padding:"2px 7px", border:"1px solid rgba(255,255,255,0.1)", color:OS.textFaint, borderRadius:3 }}>PENDING</span>}
            </div>
            <div style={{ fontFamily:OS.sans, fontSize:"0.88rem", fontWeight:600, color:OS.text, marginBottom:5, lineHeight:1.3 }}>{w.title}</div>
            <div style={{ fontFamily:OS.sans, fontSize:"0.76rem", color:OS.textDim, lineHeight:1.7, marginBottom:8 }}>{w.blurb}</div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:OS.mono, fontSize:"0.58rem", color:OS.textFaint }}>{w.date}</span>
              {w.live&&<span style={{ fontFamily:OS.mono, fontSize:"0.6rem", color:OS.accent }}>READ ↗</span>}
            </div>
          </div>
        ))}
      </div>
    </Window>
  );
}

// ── DESKTOP ICONS ────────────────────────────────────────────
function DesktopIcon({ icon, label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"8px 6px", borderRadius:8, background: hover?"rgba(255,255,255,0.08)":"transparent", cursor:"pointer", transition:"background 0.15s", width:80, userSelect:"none" }}>
      <div style={{ fontSize:"2.2rem", filter: hover?"drop-shadow(0 0 8px rgba(91,141,239,0.6))":"none", transition:"filter 0.2s" }}>{icon}</div>
      <span style={{ fontFamily:OS.sans, fontSize:"0.65rem", color:OS.text, textAlign:"center", lineHeight:1.3, textShadow:"0 1px 3px rgba(0,0,0,0.8)" }}>{label}</span>
    </div>
  );
}

// ── CLOCK ────────────────────────────────────────────────────
function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <div style={{ textAlign:"right" }}>
      <div style={{ fontFamily:OS.mono, fontSize:"0.72rem", color:OS.text, fontWeight:500 }}>
        {time.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
      </div>
      <div style={{ fontFamily:OS.mono, fontSize:"0.56rem", color:OS.textFaint }}>
        {time.toLocaleDateString([], { weekday:"short", month:"short", day:"numeric" })}
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────
const APPS = ["terminal","about","projects","certs","roadmap","writeups"];
const APP_META = {
  terminal: { icon:">_",  label:"Terminal" },
  about:    { icon:"👤",  label:"About Me" },
  projects: { icon:"⚙",   label:"Projects" },
  certs:    { icon:"🔐",  label:"Certs" },
  roadmap:  { icon:"🗺",  label:"Roadmap" },
  writeups: { icon:"📝",  label:"Writeups" },
};

export default function App() {
  const [open, setOpen] = useState({ terminal:true, about:false, projects:false, certs:false, roadmap:false, writeups:false });
  const [minimized, setMinimized] = useState({});
  const [zOrders, setZOrders] = useState(() => Object.fromEntries(APPS.map((a,i) => [a, 100+i])));
  const [booted, setBooted] = useState(false);

  useEffect(() => { setTimeout(() => setBooted(true), 200); }, []);

  const focusApp = useCallback((id) => {
    setZOrders(z => { const max = Math.max(...Object.values(z)); return { ...z, [id]: max + 1 }; });
    setMinimized(m => ({ ...m, [id]: false }));
  }, []);

  const openApp = useCallback((id) => {
    setOpen(o => ({ ...o, [id]: true }));
    setMinimized(m => ({ ...m, [id]: false }));
    focusApp(id);
  }, [focusApp]);

  const closeApp = useCallback((id) => {
    setOpen(o => ({ ...o, [id]: false }));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100%; height:100%; overflow:hidden; font-size:16px; -webkit-font-smoothing:antialiased; }
        body { background: #0d1b2a; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:2px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bootFade { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:none} }
        @keyframes desktopIn { from{opacity:0} to{opacity:1} }
      `}</style>

      {/* WALLPAPER */}
      <div style={{ position:"fixed", inset:0, background:OS.wallpaper, zIndex:0 }}>
        {/* Subtle grid */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.04 }}>
          <defs>
            <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>
        {/* Glow orbs */}
        <div style={{ position:"absolute", top:"15%", left:"25%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(91,141,239,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"20%", right:"20%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(192,132,252,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />
      </div>

      {/* DESKTOP ICONS — top left */}
      <div style={{ position:"fixed", top:80, left:20, zIndex:50, display:"grid", gridTemplateColumns:"80px", gap:6, animation:"desktopIn 0.8s ease 0.3s both" }}>
        {APPS.filter(a => a !== "terminal").map(a => (
          <DesktopIcon key={a} icon={APP_META[a].icon} label={APP_META[a].label}
            onClick={() => openApp(a)} />
        ))}
      </div>

      {/* WINDOWS */}
      <div style={{ position:"fixed", inset:0, zIndex:100, pointerEvents:"none" }}>
        <div style={{ pointerEvents:"auto" }}>
          {open.terminal && <TerminalWindow onClose={()=>closeApp("terminal")} onFocus={()=>focusApp("terminal")} zIndex={zOrders.terminal} minimized={minimized.terminal} />}
          {open.about    && <AboutWindow    onClose={()=>closeApp("about")}    onFocus={()=>focusApp("about")}    zIndex={zOrders.about}    minimized={minimized.about} />}
          {open.projects && <ProjectsWindow onClose={()=>closeApp("projects")} onFocus={()=>focusApp("projects")} zIndex={zOrders.projects} minimized={minimized.projects} />}
          {open.certs    && <CertsWindow    onClose={()=>closeApp("certs")}    onFocus={()=>focusApp("certs")}    zIndex={zOrders.certs}    minimized={minimized.certs} />}
          {open.roadmap  && <RoadmapWindow  onClose={()=>closeApp("roadmap")}  onFocus={()=>focusApp("roadmap")}  zIndex={zOrders.roadmap}  minimized={minimized.roadmap} />}
          {open.writeups && <WriteupsWindow onClose={()=>closeApp("writeups")} onFocus={()=>focusApp("writeups")} zIndex={zOrders.writeups} minimized={minimized.writeups} />}
        </div>
      </div>

      {/* TASKBAR */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:600, height:52, background:OS.taskbar, backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", padding:"0 16px", gap:4 }}>
        {/* App launcher dot */}
        <div style={{ width:8, height:8, borderRadius:"50%", background:OS.accent, boxShadow:`0 0 8px ${OS.accent}`, marginRight:8 }} />

        {/* Running apps */}
        {APPS.map(a => (
          <button key={a} onClick={() => open[a] ? focusApp(a) : openApp(a)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", background: open[a]?"rgba(255,255,255,0.08)":"transparent", border:"none", borderRadius:6, cursor:"pointer", transition:"all 0.15s", position:"relative" }}>
            <span style={{ fontSize:"1rem" }}>{APP_META[a].icon === ">_" ? "⬛" : APP_META[a].icon}</span>
            <span style={{ fontFamily:OS.sans, fontSize:"0.65rem", color: open[a]?OS.text:OS.textFaint, fontWeight: open[a]?500:400 }}>{APP_META[a].label}</span>
            {open[a] && <div style={{ position:"absolute", bottom:2, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background:OS.accent }} />}
          </button>
        ))}

        {/* Right: clock + status */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:OS.green, boxShadow:`0 0 5px ${OS.green}` }} />
            <span style={{ fontFamily:OS.mono, fontSize:"0.6rem", color:OS.textDim }}>AVAILABLE JUN 2026</span>
          </div>
          <Clock />
        </div>
      </div>

      {/* BOOT splash */}
      {!booted && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"2rem", fontWeight:700, color:OS.accent, marginBottom:8, letterSpacing:"0.1em" }}>FH-OS</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.7rem", color:OS.textFaint, letterSpacing:"0.2em" }}>LOADING...</div>
          </div>
        </div>
      )}
    </>
  );
}
