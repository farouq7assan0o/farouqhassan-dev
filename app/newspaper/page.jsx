"use client";
import { useState, useEffect, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────
const ME = {
  name: "Farouq Hassan",
  email: "12farouq12@gmail.com",
  linkedin: "https://www.linkedin.com/in/FarouqHassan02",
  github: "https://github.com/farouq7assan0o",
  medium: "https://medium.com/@12farouq12",
  cvSoc: "/Farouq_Hassan_Junior_SOC_Analyst_CV.pdf",
  cvOffensive: "/Farouq_Hassan_CV_Offensive.pdf",
};

const TICKER_ITEMS = [
  "CDSA CERTIFIED ✦ HTB TOP ANALYST",
  "CWES 70% ✦ CPTS 45% IN PROGRESS",
  "SCC–JORDAN ARMED FORCES INTERNSHIP ✦ MONTH 5 OF 8",
  "TOP 10 / 300+ ✦ NCSCJO NATIONAL BOOTCAMP",
  "22+ SECURITY OPERATIONS DOCUMENTED",
  "APT29 MAPPED ✦ $1.38M RISK REDUCED ✦ NTFS RECOVERED",
  "AVAILABLE JUNE 2026 ✦ SOC ANALYST ✦ DETECTION ENGINEER ✦ PENTESTER",
];

const HEADLINES = [
  {
    size: "LEAD",          // spans most of the front page
    kicker: "EXCLUSIVE PROFILE",
    headline: "LOCAL ANALYST FINDS WHAT OTHERS MISS",
    deck: "Farouq Hassan, 22, has spent the last three years breaking systems on purpose — so nobody else can break them by accident. His record: 22 operations, zero ignored findings.",
    body: `Hassan works at the intersection of offense and defense. By day he runs detection engineering inside a government security commission. By night he's 45% through the hardest penetration testing certification HackTheBox offers.\n\nHe doesn't choose a side. He understands both.`,
    col: 3,
  },
  {
    size: "SECONDARY",
    kicker: "THREAT INTELLIGENCE",
    headline: "ANALYST TRACES APT29 CAMPAIGN TO SOLAR WINDS SUPPLY CHAIN",
    deck: "Full ATT&CK Navigator mapping. T1195.002 confirmed. LSASS dump and token abuse rated High impact.",
    col: 2,
  },
  {
    size: "SECONDARY",
    kicker: "INCIDENT RESPONSE",
    headline: "$1.38M ANNUAL LOSS PROJECTED — REDUCED TO $177K AFTER CONTROLS",
    deck: "FAIR Monte Carlo simulation. MFA + SIEM + tabletop drill. Jordanian PDPL 72-hour violation found.",
    col: 1,
  },
  {
    size: "BRIEF",
    kicker: "FORENSICS",
    headline: "DOCX HIDDEN INSIDE PNG — CRIMINAL MEETING EXPOSED",
    deck: "NTFS manually recovered via HxD. Steganography layer stripped. Chain of custody maintained.",
    col: 1,
  },
  {
    size: "BRIEF",
    kicker: "MALWARE",
    headline: "BACKDOOR BEACON DISSECTED — C2 IP PATCHED, BEACON SILENCED",
    deck: "UPX unpacked. TLS callbacks NOP'd. SSDT/IDT clean — no kernel hooking.",
    col: 1,
  },
];

const PROJECTS = [
  { id:"animeblast",  cat:"PENTEST",   sev:"CRITICAL", year:2024, headline:"FULL-SCOPE PENTEST: BOF EXPLOIT, PIVOT, 10 FLAGS",     deck:"Custom Python buffer overflow. EIP @ 1036 bytes. DEP+ASLR+SafeSEH bypassed. SOCKS pivot. UNION SQLi. PHP shell → RCE.", tags:["Buffer Overflow","Metasploit","SQLi","RCE","Pivoting"], highlights:["EIP controlled @ 1036 bytes","DEP + ASLR + SafeSEH bypass","SOCKS proxy pivot","UNION SELECT credential dump","PHP shell → RCE → admin","10 CTF flags captured"], github:null },
  { id:"cyberblast",  cat:"PENTEST",   sev:"HIGH",     year:2024, headline:"ETERNALBLUE EXPLOITED IN FULL-CYCLE ENGAGEMENT",        deck:"Nessus 20 findings. EternalBlue → Meterpreter → credential dump. UNION SQLi, XSS session hijack, MSFvenom payload.", tags:["Nessus","EternalBlue","SQLmap","Kill Chain"], highlights:["20 Nessus vulns: BlueKeep, TLS 1.0, PHP 5.6","EternalBlue → Meterpreter","UNION SQLi + XSS + RCE","Custom MSFvenom reverse shell"], github:null },
  { id:"malware",     cat:"PENTEST",   sev:"CRITICAL", year:2024, headline:"UPX-PACKED BACKDOOR DISSECTED — C2 IP NEUTRALISED",     deck:"Full RE lifecycle. TLS callbacks, anti-debug NOP patch. C2 IP patched to localhost. SYN beacon confirmed via Wireshark.", tags:["IDA Free","x32dbg","UPX","RE"], highlights:["UPX unpack → PE analysis","IsDebuggerPresent NOP patch","C2 → 127.0.0.1 for safe detonation","HKCU Run persistence","SSDT/IDT clean"], github:null },
  { id:"sqli",        cat:"PENTEST",   sev:"HIGH",     year:2025, headline:"BANKING RED TEAM PLAN — FULL KILL CHAIN DOCUMENTED",    deck:"Manual SQLi (auth bypass + UNION). Banking ROE. Cyber Kill Chain OSINT→weaponise→C2→exfil fully documented.", tags:["SQLi","Auth Bypass","Kill Chain","ROE"], highlights:["Auth bypass via SQL injection","UNION SELECT credential extraction","Banking ROE: scope + limits","Full Kill Chain: OSINT→C2→exfil"], github:null },
  { id:"privesc",     cat:"PENTEST",   sev:"HIGH",     year:2025, headline:"KERNEL 2.6.32 IDENTIFIED — LOCAL PRIVILEGE ESCALATION",  deck:"LinPEAS enumeration. Exploit-DB 18411. BoF LPE compiled and executed on target. Four file transfer methods.", tags:["LinPEAS","Kernel Exploit","Netcat","Searchsploit"], highlights:["Kernel 2.6.32 via uname -a","Searchsploit → Exploit-DB 18411","BoF LPE compiled + executed","4 transfer methods demonstrated"], github:null },
  { id:"semgrep",     cat:"PENTEST",   sev:"MEDIUM",   year:2025, headline:"41 FINDINGS IN CI/CD — SEQUELIZE SQLi DETECTED",        deck:"Semgrep SAST in GitHub Actions. 1015 files, 1062 rules. Direct SQL string concatenation in Sequelize queries found.", tags:["Semgrep","SAST","DevSecOps","CI/CD"], highlights:["41 findings across 1015 files","Sequelize SQLi: criteria directly concatenated","YAML triggers on every push","Parameterized query remediation"], github:null },
  { id:"pcap",        cat:"SOC/DFIR",  sev:"HIGH",     year:2025, headline:"HTTP C2 BEACONING AND DNS EXFIL UNCOVERED IN PCAP",     deck:"HTTP /v1/checkin sequential polling. DNS TXT Base64 exfil. Volatility 3: RWX shellcode via malfind. Timeline correlated.", tags:["Wireshark","Volatility 3","DNS Tunneling","Fileless"], highlights:["HTTP C2: /v1/checkin polling","DNS TXT Base64 encoded payload","RWX shellcode injection via malfind","Rogue process: parent explorer.exe","Network + memory timeline correlated"], github:null },
  { id:"aptintel",    cat:"SOC/DFIR",  sev:"HIGH",     year:2025, headline:"APT29 SOLARWINDS AND USAID CAMPAIGNS MAPPED TO ATT&CK", deck:"Navigator JSON layers. T1195.002 supply chain. LSASS + token abuse. Lumma Stealer behavioral chain. CISA + Mandiant sourced.", tags:["MITRE ATT&CK","ATT&CK Navigator","OSINT","APT29"], highlights:["APT29: T1195.002 supply chain — High","T1003.001 LSASS + T1550.001 token abuse","Lumma: T1555 credential harvesting","Navigator JSON layers built","CISA AA20-352A + Mandiant SUNBURST"], github:null },
  { id:"irplays",     cat:"SOC/DFIR",  sev:"CRITICAL", year:2025, headline:"THREE IR PLAYBOOKS — RANSOMWARE DECISION TREE BUILT",    deck:"Clinic malware, CityWorks ransomware, Bazaarjo supply-chain. ATT&CK→D3FEND. FIDO2 MFA breaks Lumma chain.", tags:["NIST IR","ATT&CK → D3FEND","Ransomware","Exec Comms"], highlights:["VLAN ACL: speed + evidence preserved","Ransomware decision tree: pre-impact vs ongoing","D3FEND: FIDO2 breaks Lumma credential chain","Exec update + staff advisory + closure criteria"], github:null },
  { id:"forensics",   cat:"SOC/DFIR",  sev:"HIGH",     year:2024, headline:"DOCX HIDDEN INSIDE PNG — CRIMINAL MEETING DATES FOUND",  deck:"NTFS mirror recovered manually via HxD. DOCX extracted from PNG steganography layer. Hash verified at every stage.", tags:["FTK Imager","HxD","NTFS Recovery","Steganography"], highlights:["NTFS manual recovery via HxD hex editor","DOCX embedded inside PNG stego","Hidden message decoded — meeting details","Hash verified before + after imaging","CCPA/GDPR compliance enforced"], github:null },
  { id:"airline",     cat:"SOC/DFIR",  sev:"MEDIUM",   year:2024, headline:"AIRLINE SYSTEM HARDENED — 100K FUZZ ATTEMPTS SURVIVED",  deck:"SHA-256+salt, 3-strike lockout, RBAC 4 roles, JUnit fuzz testing to 100k attempts, PMD SAST.", tags:["Java","SHA-256","JUnit","Fuzz Testing","RBAC"], highlights:["SHA-256 + salt hashing","Lockout after 3 failures","RBAC: 4 strictly separated roles","Fuzz tested: 1k → 10k → 100k attempts","PMD SAST integrated"], github:"https://github.com/farouq7assan0o/SecureCoding" },
  { id:"otps3",       cat:"CLOUD",     sev:"HIGH",     year:2025, headline:"FOUR CRITICAL VULNS FIXED IN OTP S3 SYSTEM",             deck:"OTP in API response removed. 5-min expiry + single-use. Rate limit: 5 attempts. uuid4 filenames + presigned URLs.", tags:["S3 Security","OTP","OWASP A01/A07","IAM"], highlights:["OTP removed from API response","5-min expiry + single-use invalidation","MAX_ATTEMPTS=5 + exponential backoff","uuid4 + private bucket + presigned URL (600s)","OWASP A01, A05, A07 mapped"], github:null },
  { id:"apache",      cat:"CLOUD",     sev:"MEDIUM",   year:2025, headline:"APACHE AND SSH HARDENED — CIS BENCHMARK APPLIED",       deck:"5 Apache misconfigs fixed. SSH: key-only, no root, chacha20-poly1305+aes256-gcm only. CIS 2.2–3.5.", tags:["Apache 2.4","CIS Benchmark","SSH","Docker"], highlights:["Apache: 5 CIS findings fixed","ServerTokens Prod + TraceEnable Off + -Indexes","/server-status → 403 externally","SSH: PermitRootLogin no + PasswordAuth no","chacha20-poly1305 + aes256-gcm only"], github:null },
  { id:"network",     cat:"CLOUD",     sev:"MEDIUM",   year:2023, headline:"FIVE-SITE NETWORK BUILT — IPSEC VPN AND ASA FIREWALL",   deck:"IPsec VPN (AES+SHA), ASA DMZ+NAT, full-mesh OSPF, VLAN segmentation, port security, AAA.", tags:["Cisco","IPsec VPN","OSPF","ASA Firewall","VLAN"], highlights:["IPsec VPN: AES + SHA + ISAKMP","ASA: DMZ + NAT + HTTPS-only","Full-mesh WAN: 5 routers","VLAN isolation per department"], github:null },
  { id:"fair",        cat:"GRC",       sev:"CRITICAL", year:2024, headline:"$1.38M ANNUAL LOSS REDUCED TO $177K AFTER CONTROLS",     deck:"FAIR Monte Carlo simulation. MFA + SIEM + exec phishing training + IR tabletop. PDPL 72hr violation found.", tags:["FAIR Model","Monte Carlo","ISO 27005","PDPL","Jordan Law"], highlights:["ALE before: $1.38M/year","ALE after: $177K — $1.2M/year reduction","PDPL: delayed disclosure violated 72hr","Controls: MFA + SIEM + exec training + IR tabletop"], github:null },
  { id:"governance",  cat:"GRC",       sev:"HIGH",     year:2025, headline:"SEVEN GOVERNANCE GAPS FOUND IN POST-BREACH ASSESSMENT",  deck:"No SoD, undefined CISO accountability, no breach notification. Devs deploying to prod unilaterally. 12-month roadmap.", tags:["ISO 27014","PDPL","PCI DSS","SoD","Board Brief"], highlights:["7 governance gaps across 3 frameworks","SoD: devs had unilateral prod deployment","No PDPL breach notification → regulatory exposure","Board brief: root causes + 3–6 month plan"], github:null },
  { id:"risk",        cat:"GRC",       sev:"HIGH",     year:2025, headline:"SIX ENTERPRISE RISKS RATED — KRIs DEFINED FOR BOARD",    deck:"ISO 27005 + NIST 800-30. If-Then statements. KRIs: MFA coverage %, unapproved deploys, revocation lag.", tags:["ISO 27005","NIST 800-30","Risk Register","KRIs"], highlights:["Customer PII: Critical (High × High impact)","If-Then: weak git controls → malicious code injection","KRIs: MFA %, unapproved deploys, time-to-revoke","Quarterly board-level risk reporting defined"], github:null },
  { id:"isms",        cat:"GRC",       sev:"HIGH",     year:2024, headline:"FULL ISMS DESIGNED FOR BLUEFRONTIER BANK",               deck:"ISO 27001 scope. COBIT 2019 7-phase. BIA 6 processes. 3-stage audit. Financial ROI quantified for board.", tags:["ISO 27001","COBIT 2019","ISO 27005","BIA","Audit"], highlights:["ISO 27001 full scope: policies, controls, audit","COBIT 2019: 7-phase gap → implement → audit","BIA: 6 processes, RTO 15–240min","Executive board brief with financial ROI"], github:null },
  { id:"bia",         cat:"GRC",       sev:"HIGH",     year:2025, headline:"PAYMENT PROCESSING: RTO 15MIN, RPO 0 — BIA COMPLETE",    deck:"6 critical processes after 2-hour outage. PCI-DSS compliant RTOs. IR monitoring: zero log loss mandated.", tags:["BIA","RTO/RPO","PCI DSS","Disaster Recovery"], highlights:["Payment: RTO 15min / RPO 0–5min (PCI-DSS)","IR Monitoring: RTO 15min / RPO 0min","Online Orders: RTO 30min / RPO 5min","Recovery order: Payments → Orders → IR → Support → Catalog"], github:null },
  { id:"crypto",      cat:"GRC",       sev:"MEDIUM",   year:2024, headline:"2-DES KEYSPACE CUT FROM 2¹¹² TO 2⁵⁷ IN MITM ATTACK",    deck:"ECB pattern leakage visualised. Hybrid RSA+DES secure messaging. SHA-1 digital signatures. Square-and-Multiply.", tags:["Python","2-DES MITM","RSA","ECB vs CBC","Digital Signatures"], highlights:["MITM: 2¹¹² → 2⁵⁷ keyspace reduction","ECB: pattern leakage on encrypted images","RSA+DES hybrid: session key + data encryption","Square-and-Multiply: O(log e) RSA exponentiation"], github:null },
  { id:"hopechain",   cat:"OTHER",     sev:"LOW",      year:2024, headline:"REENTRANCY MITIGATED IN ETHEREUM DONATION PLATFORM",     deck:"zkSNARK privacy proposed. Multisig+timelock governance. Sybil attack analysis. Jordan NGO regulatory review.", tags:["Solidity","Ethereum","Ethers.js","Smart Contract Security"], highlights:["Reentrancy mitigated via transfer() pattern","Privacy: donor addresses public → zkSNARK proposed","Jordan regulatory: NGO + crypto banking constraints","Proposed: multisig + timelocks + pausable contract"], github:null },
  { id:"spark",       cat:"OTHER",     sev:"LOW",      year:2025, headline:"LED 6-PERSON TEAM BUILDING WEARABLE INR PATCH",          deck:"$1.65M SOM validated in $55M Jordan rehab market. Non-invasive continuous INR. AI emergency alerts.", tags:["Team Leadership","Biomedical","IoT","Market Validation","HIPAA"], highlights:["Led 6-person cross-disciplinary team","$1.65M SOM validated in $55M Jordan rehab market","Non-invasive continuous INR monitoring","AI emergency alerts: patient + caregiver + doctor"], github:null },
  { id:"ftp",         cat:"PENTEST",   sev:"MEDIUM",   year:2025, headline:"ANONYMOUS FTP CONFIRMED — BRUTE FORCED IN MINUTES",      deck:"Hydra vs 100k NCSC wordlist. Zero rate limiting. Zero lockout. Remediation: Fail2Ban + disable anon + SFTP.", tags:["Hydra","FTP","Brute Force","Enumeration"], highlights:["Anonymous FTP access confirmed","Hydra + 100k NCSC wordlist","No rate limiting — zero lockout resistance","Remediation: Fail2Ban + disable anon + SFTP"], github:null },
];

const CERTS = [
  { name:"CDSA", full:"Certified Defensive Security Analyst", issuer:"Hack The Box", year:"2025", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9385aaf3-d974-43d8-8144-0dca4b70746b" },
  { name:"CWSE", full:"Certified Web Security Expert", issuer:"Hackviser", year:"2025", status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CWSE-D15I7TON" },
  { name:"CAPT", full:"Certified Associate Penetration Tester", issuer:"Hackviser", year:"2025", status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CAPT-T3O8P3JO" },
  { name:"NCA",  full:"Nutanix Certified Associate v6", issuer:"Nutanix", year:"2025", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9c45a9a4-34b0-46b8-819f-25b6b053dfdd" },
  { name:"CWES", full:"Certified Web Exploitation Specialist", issuer:"Hack The Box", year:"2026", status:"active", pct:70, url:null },
  { name:"CPTS", full:"Certified Penetration Testing Specialist", issuer:"Hack The Box", year:"2026", status:"active", pct:45, url:null },
  { name:"SEC+", full:"CompTIA Security+", issuer:"CompTIA", year:"2026", status:"queued", pct:0, url:null },
  { name:"CCNA", full:"Cisco CCNA 200-301", issuer:"Cisco", year:"2026", status:"queued", pct:0, url:null },
];

const ROADMAP = [
  { phase:"Phase 1", days:"Days 1–30", title:"Detection Engineering Fundamentals", status:"active", goal:"15–20 production-grade detections for real AD attack paths.",
    weeks:[
      { w:"Week 1", t:"Lab Foundation", items:["DC + 2 Win10 + Kali + Splunk","Sysmon on all endpoints","PowerShell Script Block Logging","AD auditing (4662,4742,4738,4672)"], d:"Lab architecture + logging baseline" },
      { w:"Week 2", t:"Initial Access & Execution", items:["Phishing macro → PowerShell","Encoded PowerShell / IEX","Office spawning cmd/powershell"], d:"5 detection rules with MITRE mapping" },
      { w:"Week 3", t:"Privilege Escalation & Persistence", items:["UAC bypass","Scheduled tasks Event 4698","Registry run keys","Service creation"], d:"6 detection rules + alert logic" },
      { w:"Week 4", t:"Credential Access", items:["Mimikatz + LSASS Sysmon 10","Kerberoasting 4769 RC4","Pass-the-Hash","Logon Type 9 / abnormal 4672"], d:"Credential Theft Detection Pack" },
    ]},
  { phase:"Phase 2", days:"Days 31–60", title:"AD Threat Hunting", status:"upcoming", goal:"Build a Domain Compromise Detection Framework.",
    weeks:[
      { w:"Week 5", t:"Lateral Movement", items:["SMB/PsExec/WMI/WinRM","ADMIN$ + named pipe anomalies","Event 4624 Type 3 workstation→DC"], d:"Lateral movement detection rules" },
      { w:"Week 6", t:"DCSync & DCShadow", items:["DCSync (4662 replication GUIDs)","DCShadow (4742/4738 anomalies)","AD object modification tracking"], d:"Domain Compromise Detection Framework" },
      { w:"Week 7", t:"Threat Hunting Framework", items:["Rare logon types","Rare parent-child processes","Rare LDAP burst activity","Baseline vs anomaly"], d:"10 threat hunting queries" },
      { w:"Week 8", t:"SIEM Engineering", items:["Field normalization","Multi-stage correlation rules","Risk-based alerting + noise reduction"], d:"3 multi-stage correlation rules" },
    ]},
  { phase:"Phase 3", days:"Days 61–90", title:"Automation & Portfolio", status:"upcoming", goal:"SOAR pipeline, purple team sim, public GitHub portfolio.",
    weeks:[
      { w:"Week 9",  t:"SOAR & Case Management",  items:["TheHive + Shuffle","Alert→Case auto-creation","IP enrichment + MITRE tag"], d:"Working SOAR pipeline" },
      { w:"Week 10", t:"Purple Team Simulation",   items:["Day 1: Phishing","Day 2: Kerberoast","Day 3: Lateral Movement","Day 4: DCSync"], d:"Detection gap analysis report" },
      { w:"Week 11", t:"Detection Portfolio",      items:["GitHub: all rules","Write-ups per chain","Red vs Blue results"], d:"Public portfolio on GitHub" },
      { w:"Week 12", t:"Enterprise Readiness",     items:["LAPS + Credential Guard","Tiered AD / ESAE","Prevention mindset"], d:"Enterprise hardening checklist" },
    ]},
];

// ── TOKENS ───────────────────────────────────────────────────
const INK   = "#0D0B08";
const PAPER = "#F5F0E8";
const AGED  = "#E8E0CC";
const RULE  = "#C8BCA0";
const RED   = "#C41E1E";
const GHOST = "rgba(13,11,8,0.06)";
const SANS  = "'DM Sans', sans-serif";
const SERIF = "'Playfair Display', serif";
const SLAB  = "'Roboto Slab', serif";
const MONO  = "'Courier Prime', monospace";

const SEV_LABEL = { CRITICAL:"■ CRITICAL", HIGH:"▲ HIGH", MEDIUM:"● MEDIUM", LOW:"○ LOW" };
const SEV_COL   = { CRITICAL:RED, HIGH:"#8B3A00", MEDIUM:"#1a1a1a", LOW:"#888" };

// ── UTILS ────────────────────────────────────────────────────
function useInView(t = 0.1) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return [ref, v];
}
function Reveal({ children, delay = 0 }) {
  const [r, v] = useInView();
  return <div ref={r} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>{children}</div>;
}

// ── TICKER ───────────────────────────────────────────────────
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ overflow: "hidden", background: INK, color: PAPER, padding: "7px 0", borderBottom: `2px solid ${INK}` }}>
      <div style={{ display: "flex", gap: "60px", animation: "tickerScroll 35s linear infinite", whiteSpace: "nowrap" }}>
        {items.map((item, i) => (
          <span key={i} style={{ fontFamily: MONO, fontSize: "0.7rem", letterSpacing: "0.12em", flexShrink: 0 }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── MASTHEAD ─────────────────────────────────────────────────
function Masthead() {
  const today = new Date().toLocaleDateString("en-GB", { weekday:"long", year:"numeric", month:"long", day:"numeric" }).toUpperCase();
  return (
    <header style={{ background: PAPER, borderBottom: `3px double ${INK}`, padding: "0 clamp(16px,4vw,48px)" }}>
      {/* Top meta strip */}
      <div style={{ borderBottom: `1px solid ${RULE}`, padding: "6px 0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: INK, opacity: 0.5, letterSpacing: "0.1em" }}>{today}</span>
        <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: INK, opacity: 0.5, letterSpacing: "0.1em" }}>AMMAN, JORDAN ✦ EST. 2002 ✦ GRADUATION JUNE 2026</span>
        <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: RED, letterSpacing: "0.1em", fontWeight: 700 }}>AVAILABLE FOR HIRE</span>
      </div>

      {/* Nameplate */}
      <div style={{ textAlign: "center", padding: "28px 0 18px", borderBottom: `1px solid ${RULE}` }}>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(3rem,11vw,8rem)", fontWeight: 900, color: INK, lineHeight: 0.88, letterSpacing: "-0.02em", marginBottom: 10 }}>
          THE FAROUQ<br />
          <span style={{ fontSize: "0.65em", fontStyle: "italic", fontWeight: 400, color: INK, opacity: 0.4 }}>HASSAN</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.3em", color: INK, opacity: 0.45, textTransform: "uppercase", marginTop: 8 }}>
          GAZETTE
        </div>
        <div style={{ height: 2, background: INK, margin: "12px auto 0", width: "100%" }} />
        <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.18em", color: INK, opacity: 0.4, padding: "6px 0", textAlign: "center" }}>
          SOC ANALYST · DETECTION ENGINEER · PENETRATION TESTER · HACK THE BOX CDSA
        </div>
      </div>

      {/* Dateline + CV strip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${RULE}`, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["↓ CV — SOC / Blue Team", ME.cvSoc], ["↓ CV — Pen Testing", ME.cvOffensive]].map(([l, u]) => (
            <a key={l} href={u} download style={{ fontFamily: MONO, fontSize: "0.68rem", color: INK, border: `1px solid ${RULE}`, padding: "4px 12px", textDecoration: "none", letterSpacing: "0.08em", transition: "all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.background = INK; e.currentTarget.style.color = PAPER; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = INK; }}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {[["LINKEDIN", ME.linkedin], ["GITHUB", ME.github], ["MEDIUM", ME.medium], [`✉ ${ME.email}`, `mailto:${ME.email}`]].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noreferrer" style={{ fontFamily: MONO, fontSize: "0.6rem", color: INK, opacity: 0.45, textDecoration: "none", letterSpacing: "0.08em", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.45"}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

// ── NAV ──────────────────────────────────────────────────────
function SectionNav({ active, setActive }) {
  const items = ["FRONT PAGE", "ALL STORIES", "ROADMAP", "CREDENTIALS", "DISPATCHES"];
  const keys  = ["front", "projects", "roadmap", "certs", "writeups"];
  return (
    <nav style={{ background: INK, padding: "0 clamp(16px,4vw,48px)", position: "sticky", top: 0, zIndex: 500, borderBottom: `2px solid ${RED}` }}>
      <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
        {items.map((item, i) => (
          <button key={item} onClick={() => setActive(keys[i])}
            style={{ padding: "11px 18px", background: active === keys[i] ? RED : "none", border: "none", color: active === keys[i] ? PAPER : "rgba(245,240,232,0.45)", fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.14em", cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap", borderRight: `1px solid rgba(255,255,255,0.08)` }}
            onMouseEnter={e => { if (active !== keys[i]) e.currentTarget.style.color = PAPER; }}
            onMouseLeave={e => { if (active !== keys[i]) e.currentTarget.style.color = "rgba(245,240,232,0.45)"; }}>
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ── COLUMN RULE ──────────────────────────────────────────────
const ColRule = () => <div style={{ width: 1, background: RULE, alignSelf: "stretch", flexShrink: 0 }} />;

// ── FRONT PAGE ───────────────────────────────────────────────
function FrontPage() {
  return (
    <main style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>

      {/* TOP: LEAD STORY + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 320px", gap: 0, borderBottom: `1px solid ${RULE}` }} className="front-top">
        {/* Lead */}
        <Reveal>
          <article style={{ padding: "28px 28px 28px 0" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: RED, letterSpacing: "0.22em", marginBottom: 10, fontWeight: 700 }}>EXCLUSIVE PROFILE ✦ GRADUATING JUNE 2026</div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem,4.5vw,3.4rem)", fontWeight: 900, color: INK, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 14 }}>
              LOCAL ANALYST FINDS<br />WHAT OTHERS MISS
            </h1>
            <div style={{ height: 2, background: INK, marginBottom: 14 }} />
            <p style={{ fontFamily: SLAB, fontSize: "clamp(0.88rem,1.8vw,1.05rem)", color: INK, lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>
              Farouq Hassan, 22, has spent the last three years breaking systems on purpose — so nobody else can break them by accident. His record: 23 operations, zero ignored findings.
            </p>
            {/* Drop cap body text — newspaper columns */}
            <div style={{ columnCount: 2, columnGap: 24, columnRule: `1px solid ${RULE}` }} className="body-cols">
              <p style={{ fontFamily: SANS, fontSize: "0.82rem", color: INK, lineHeight: 1.85, marginBottom: 12 }}>
                <span style={{ fontFamily: SERIF, fontSize: "3.2rem", fontWeight: 900, float: "left", lineHeight: 0.78, marginRight: 6, marginTop: 6, color: RED }}>H</span>
                assan works at the intersection of offense and defense. By day he validates defensive security inside a government commission. By night he is working through the hardest penetration testing certification HackTheBox offers — at 45% completion. He doesn't choose a side. He has earned credentials on both.
              </p>
              <p style={{ fontFamily: SANS, fontSize: "0.82rem", color: INK, lineHeight: 1.85, marginBottom: 12 }}>
                His internship at the Special Communications Commission – Jordan Armed Forces began in October 2025 and runs eight months. He is currently in month five. The work is classified. The skills it builds are not.
              </p>
              <p style={{ fontFamily: SANS, fontSize: "0.82rem", color: INK, lineHeight: 1.85 }}>
                "I document everything publicly," he said. "No recycled theory. Real operations, real findings, real remediation." He has 22 projects to show for it — ranging from buffer overflow exploits to enterprise ISMS design to a $1.38M FAIR risk analysis that identified a PDPL disclosure violation.
              </p>
            </div>
            <div style={{ marginTop: 20, borderTop: `1px solid ${RULE}`, paddingTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[["↓ CV — SOC / Blue Team", ME.cvSoc], ["↓ CV — Pen Testing", ME.cvOffensive]].map(([l, u]) => (
                <a key={l} href={u} download
                  style={{ padding: "8px 18px", background: INK, color: PAPER, fontFamily: MONO, fontSize: "0.7rem", letterSpacing: "0.08em", textDecoration: "none", transition: "background 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.background = RED}
                  onMouseLeave={e => e.currentTarget.style.background = INK}>
                  {l}
                </a>
              ))}
            </div>
          </article>
        </Reveal>

        <ColRule />

        {/* Right sidebar */}
        <div style={{ padding: "28px 0 28px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Stats box */}
          <Reveal delay={80}>
            <div style={{ border: `2px solid ${INK}`, padding: "16px", marginBottom: 20 }}>
              <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: RED, marginBottom: 12, fontWeight: 700 }}>BY THE NUMBERS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[["23+","Operations"],["4","Certs Earned"],["8mo","Gov. Service"],["300+","Ranked Against"],["Top 10","NCSCJO"],["$1.2M","Risk Reduced"]].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: SERIF, fontSize: "1.8rem", fontWeight: 900, color: INK, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: INK, opacity: 0.5, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Signal box */}
          <Reveal delay={130}>
            <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: INK, opacity: 0.5, marginBottom: 10 }}>ACTIVE NOW</div>
              {[["SCC-JAF Internship","Month 5 / 8"],["HTB CWES","70% complete"],["HTB CPTS","45% complete"],["Detection Eng.","90-day plan"],["Writeups","Weekly cadence"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: `1px solid ${AGED}` }}>
                  <span style={{ fontFamily: MONO, fontSize: "0.64rem", color: INK }}>{l}</span>
                  <span style={{ fontFamily: MONO, fontSize: "0.64rem", color: INK, opacity: 0.5 }}>{v}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Cert strip */}
          <Reveal delay={170}>
            <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: 14 }}>
              <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: INK, opacity: 0.5, marginBottom: 10 }}>CREDENTIALS</div>
              {CERTS.filter(c => c.status === "earned").map(c => (
                <div key={c.name} onClick={() => c.url && window.open(c.url, "_blank")}
                  style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: `1px solid ${AGED}`, cursor: c.url ? "pointer" : "default", transition: "opacity 0.18s" }}
                  onMouseEnter={e => { if (c.url) e.currentTarget.style.opacity = "0.6"; }}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <span style={{ fontFamily: SERIF, fontSize: "0.95rem", fontWeight: 700, color: INK, minWidth: 44 }}>{c.name}</span>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: "0.62rem", color: INK }}>{c.full}</div>
                    <div style={{ fontFamily: MONO, fontSize: "0.56rem", color: INK, opacity: 0.4 }}>{c.issuer} · {c.year}</div>
                  </div>
                  {c.url && <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: "0.6rem", color: RED }}>↗</span>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* SECONDARY STORIES ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1px 1fr 1px 1fr", gap: 0, borderBottom: `1px solid ${RULE}` }} className="front-mid">
        {HEADLINES.filter(h => h.size === "SECONDARY").map((h, i) => (
          <>
            {i > 0 && <ColRule key={`rule-${i}`} />}
            <Reveal key={h.headline} delay={i * 80}>
              <article style={{ padding: "22px" }}>
                <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: RED, letterSpacing: "0.2em", marginBottom: 8, fontWeight: 700 }}>{h.kicker}</div>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1rem,2.2vw,1.5rem)", fontWeight: 900, color: INK, lineHeight: 1.15, letterSpacing: "-0.015em", marginBottom: 10 }}>{h.headline}</h2>
                <div style={{ height: 1, background: RULE, marginBottom: 10 }} />
                <p style={{ fontFamily: SANS, fontSize: "0.8rem", color: INK, lineHeight: 1.8, opacity: 0.75 }}>{h.deck}</p>
              </article>
            </Reveal>
          </>
        ))}
      </div>

      {/* BRIEFS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr 1px 1fr", gap: 0 }} className="front-briefs">
        {HEADLINES.filter(h => h.size === "BRIEF").map((h, i) => (
          <>
            {i > 0 && <ColRule key={`r-${i}`} />}
            <Reveal key={h.headline} delay={i * 60}>
              <article style={{ padding: "18px" }}>
                <div style={{ fontFamily: MONO, fontSize: "0.52rem", color: RED, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>{h.kicker}</div>
                <h3 style={{ fontFamily: SERIF, fontSize: "clamp(0.82rem,1.6vw,1.05rem)", fontWeight: 900, color: INK, lineHeight: 1.2, marginBottom: 7 }}>{h.headline}</h3>
                <p style={{ fontFamily: SANS, fontSize: "0.74rem", color: INK, lineHeight: 1.75, opacity: 0.65 }}>{h.deck}</p>
              </article>
            </Reveal>
          </>
        ))}
        {/* Filler ad-like box */}
        <ColRule />
        <Reveal delay={200}>
          <div style={{ padding: 18 }}>
            <div style={{ border: `2px solid ${INK}`, padding: 14, textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: "0.9rem", fontWeight: 900, color: INK, marginBottom: 6, fontStyle: "italic" }}>Available</div>
              <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.15em", color: INK, opacity: 0.5, marginBottom: 10 }}>JUNE 2026</div>
              <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: INK, opacity: 0.5, marginBottom: 12, lineHeight: 1.7 }}>SOC Analyst<br />Detection Engineer<br />Penetration Tester</div>
              <div style={{ fontFamily: MONO, fontSize: "0.58rem", color: RED, letterSpacing: "0.1em" }}>AMMAN · JORDAN</div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

// ── ALL STORIES (PROJECTS) ───────────────────────────────────
function AllStories() {
  const cats = ["ALL", ...new Set(PROJECTS.map(p => p.cat))];
  const sevs = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
  const [catF, setCatF] = useState("ALL");
  const [sevF, setSevF] = useState("ALL");
  const [exp, setExp] = useState(null);
  const filtered = PROJECTS
    .filter(p => (catF === "ALL" || p.cat === catF) && (sevF === "ALL" || p.sev === sevF))
    .sort((a, b) => { const o = {CRITICAL:0,HIGH:1,MEDIUM:2,LOW:3}; return o[a.sev]-o[b.sev]; });

  return (
    <main style={{ maxWidth: 1160, margin: "0 auto", padding: "24px clamp(16px,4vw,48px)" }}>
      {/* Section header */}
      <Reveal>
        <div style={{ borderBottom: `3px double ${INK}`, paddingBottom: 14, marginBottom: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: RED, marginBottom: 6 }}>OPERATIONS LOG</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem,5vw,3.2rem)", fontWeight: 900, color: INK, lineHeight: 1, letterSpacing: "-0.025em" }}>
            ALL {PROJECTS.length} STORIES
          </h2>
        </div>
      </Reveal>

      {/* Filters — styled as newspaper section tabs */}
      <Reveal delay={60}>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${RULE}`, marginBottom: 20, overflowX: "auto" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCatF(c)}
              style={{ padding: "6px 14px", background: catF===c ? INK : "none", border: "none", color: catF===c ? PAPER : INK, fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em", cursor: "pointer", opacity: catF===c ? 1 : 0.45, transition: "all 0.18s", whiteSpace: "nowrap", borderRight: `1px solid ${RULE}` }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {sevs.map(s => (
            <button key={s} onClick={() => setSevF(s)}
              style={{ padding: "3px 10px", background: sevF===s ? SEV_COL[s]||INK : "none", border: `1px solid ${SEV_COL[s]||RULE}`, color: sevF===s ? PAPER : SEV_COL[s]||INK, fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.18s" }}>
              {SEV_LABEL[s]||s}
            </button>
          ))}
          <span style={{ fontFamily: MONO, fontSize: "0.58rem", color: INK, opacity: 0.4, padding: "3px 0", marginLeft: 8 }}>{filtered.length} stories</span>
        </div>
      </Reveal>

      {/* Stories grid — newspaper layout */}
      <div style={{ columns: "320px", columnGap: 0, columnRule: `1px solid ${RULE}` }}>
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i * 25, 400)}>
            <article style={{ breakInside: "avoid", padding: "18px 20px", borderBottom: `1px solid ${RULE}`, cursor: "pointer" }}
              onClick={() => setExp(exp === p.id ? null : p.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                <div style={{ fontFamily: MONO, fontSize: "0.52rem", color: SEV_COL[p.sev]||INK, letterSpacing: "0.15em", fontWeight: 700 }}>{SEV_LABEL[p.sev]} ✦ {p.cat}</div>
                <div style={{ fontFamily: MONO, fontSize: "0.52rem", color: INK, opacity: 0.35 }}>{p.year}</div>
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(0.9rem,1.8vw,1.15rem)", fontWeight: 900, color: INK, lineHeight: 1.2, marginBottom: 7, letterSpacing: "-0.01em" }}>{p.headline}</h3>
              {/* Color rule matches severity */}
              <div style={{ height: 1, background: SEV_COL[p.sev]||RULE, marginBottom: 8, opacity: 0.4 }} />
              <p style={{ fontFamily: SANS, fontSize: "0.77rem", color: INK, lineHeight: 1.8, opacity: 0.7 }}>{p.deck}</p>
              <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                {p.tags.map(t => <span key={t} style={{ fontFamily: MONO, fontSize: "0.52rem", padding: "2px 6px", border: `1px solid ${RULE}`, color: INK, opacity: 0.5 }}>{t}</span>)}
              </div>

              {/* Expand */}
              {exp === p.id && (
                <div style={{ marginTop: 12, borderTop: `1px solid ${RULE}`, paddingTop: 10 }}>
                  {p.highlights.map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontFamily: MONO, fontSize: "0.68rem", color: INK, padding: "4px 0", borderBottom: `1px solid ${AGED}`, lineHeight: 1.5, opacity: 0.7 }}>
                      <span style={{ color: SEV_COL[p.sev]||RED, flexShrink: 0 }}>→</span>{h}
                    </div>
                  ))}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      style={{ display: "inline-block", marginTop: 8, fontFamily: MONO, fontSize: "0.62rem", color: RED, textDecoration: "none" }}>
                      ↗ VIEW ON GITHUB
                    </a>
                  )}
                </div>
              )}

              <div style={{ marginTop: 8, fontFamily: MONO, fontSize: "0.6rem", color: INK, opacity: 0.35 }}>
                {exp === p.id ? "▲ COLLAPSE" : "▼ FULL STORY"}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}

// ── ROADMAP ──────────────────────────────────────────────────
function RoadmapPage() {
  const [openPhase, setOpenPhase] = useState("Phase 1");
  const [openWeek, setOpenWeek] = useState(null);
  return (
    <main style={{ maxWidth: 1160, margin: "0 auto", padding: "24px clamp(16px,4vw,48px)" }}>
      <Reveal>
        <div style={{ borderBottom: `3px double ${INK}`, paddingBottom: 14, marginBottom: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: RED, marginBottom: 6 }}>LEARNING OPERATIONS</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem,5vw,3.2rem)", fontWeight: 900, color: INK, lineHeight: 1, letterSpacing: "-0.025em" }}>90-DAY DETECTION ENGINEERING ROADMAP</h2>
          <p style={{ fontFamily: SLAB, fontStyle: "italic", fontSize: "0.9rem", color: INK, opacity: 0.6, marginTop: 10, maxWidth: 620, lineHeight: 1.7 }}>
            Become a Detection Engineer and AD Threat Hunter. Build 15–20 production-grade rules, a Domain Compromise Detection Framework, and a public GitHub portfolio.
          </p>
        </div>
      </Reveal>

      {ROADMAP.map((ph, pi) => (
        <Reveal key={ph.phase} delay={pi * 60}>
          <div style={{ borderBottom: `1px solid ${RULE}`, marginBottom: 4 }}>
            <div onClick={() => setOpenPhase(openPhase === ph.phase ? null : ph.phase)}
              style={{ padding: "14px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                {ph.status === "active" && <span style={{ fontFamily: MONO, fontSize: "0.55rem", color: PAPER, background: RED, padding: "2px 8px", letterSpacing: "0.12em" }}>ACTIVE</span>}
                <span style={{ fontFamily: MONO, fontSize: "0.58rem", color: INK, opacity: 0.4, letterSpacing: "0.1em" }}>{ph.phase} · {ph.days}</span>
                <span style={{ fontFamily: SERIF, fontSize: "clamp(0.9rem,2vw,1.2rem)", fontWeight: 900, color: INK }}>{ph.title}</span>
              </div>
              <span style={{ fontFamily: MONO, fontSize: "0.7rem", color: INK, opacity: 0.4 }}>{openPhase===ph.phase?"▲":"▼"}</span>
            </div>
            {openPhase === ph.phase && (
              <div style={{ paddingBottom: 16 }}>
                <div style={{ fontFamily: SLAB, fontStyle: "italic", fontSize: "0.82rem", color: INK, opacity: 0.55, lineHeight: 1.7, marginBottom: 14, paddingLeft: 16, borderLeft: `3px solid ${RULE}` }}>
                  OBJECTIVE: {ph.goal}
                </div>
                {ph.weeks.map(w => (
                  <div key={w.w} style={{ borderTop: `1px solid ${AGED}` }}>
                    <div onClick={() => setOpenWeek(openWeek===w.w?null:w.w)}
                      style={{ padding: "9px 0 9px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      onMouseEnter={e => e.currentTarget.style.background = GHOST}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: MONO, fontSize: "0.56rem", color: INK, opacity: 0.4, minWidth: 50 }}>{w.w}</span>
                        <span style={{ fontFamily: MONO, fontSize: "0.72rem", color: INK }}>{w.t}</span>
                      </div>
                      <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: INK, opacity: 0.3 }}>{openWeek===w.w?"▲":"▼"}</span>
                    </div>
                    {openWeek === w.w && (
                      <div style={{ paddingLeft: 66, paddingBottom: 12 }}>
                        {w.items.map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, fontFamily: MONO, fontSize: "0.68rem", color: INK, opacity: 0.6, padding: "3px 0", lineHeight: 1.5 }}>
                            <span style={{ color: RED, flexShrink: 0 }}>→</span>{item}
                          </div>
                        ))}
                        <div style={{ marginTop: 8, padding: "6px 10px", background: AGED, fontFamily: MONO, fontSize: "0.62rem", color: INK, opacity: 0.7, lineHeight: 1.5 }}>
                          DELIVERABLE: {w.d}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </main>
  );
}

// ── CREDENTIALS ──────────────────────────────────────────────
function CredsPage() {
  return (
    <main style={{ maxWidth: 1160, margin: "0 auto", padding: "24px clamp(16px,4vw,48px)" }}>
      <Reveal>
        <div style={{ borderBottom: `3px double ${INK}`, paddingBottom: 14, marginBottom: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: RED, marginBottom: 6 }}>CLEARANCE REGISTRY</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem,5vw,3.2rem)", fontWeight: 900, color: INK, lineHeight: 1, letterSpacing: "-0.025em" }}>CREDENTIALS &amp; CERTIFICATIONS</h2>
        </div>
      </Reveal>
      {[{g:"earned",l:"CLEARED"},{g:"active",l:"IN PROGRESS"},{g:"queued",l:"QUEUED"}].map(({g,l}) => (
        <Reveal key={g} delay={60}>
          <section style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.22em", color: INK, opacity: 0.4, marginBottom: 10, borderBottom:`1px solid ${RULE}`, paddingBottom: 6 }}>{l}</div>
            {CERTS.filter(c=>c.status===g).map(c=>(
              <div key={c.name} onClick={()=>c.url&&window.open(c.url,"_blank")}
                style={{ display:"flex", gap:20, padding:"13px 0", borderBottom:`1px solid ${AGED}`, cursor:c.url?"pointer":"default", transition:"opacity 0.2s", alignItems:"center" }}
                onMouseEnter={e=>{if(c.url)e.currentTarget.style.opacity="0.6";}}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <div style={{ fontFamily:SERIF, fontSize:"1.3rem", fontWeight:900, color:g==="earned"?INK:g==="active"?"#8B3A00":"#999", minWidth:56, flexShrink:0 }}>{c.name}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:MONO, fontSize:"0.74rem", color:INK, marginBottom:2 }}>{c.full}</div>
                  <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:INK, opacity:0.4 }}>{c.issuer} · {c.year}</div>
                  {c.status==="active"&&<div style={{ marginTop:8, display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ flex:1, height:2, background:AGED }}>
                      <div style={{ width:`${c.pct}%`, height:"100%", background:INK }}/>
                    </div>
                    <span style={{ fontFamily:MONO, fontSize:"0.6rem", color:INK, opacity:0.5, flexShrink:0 }}>{c.pct}%</span>
                  </div>}
                </div>
                {c.url&&<span style={{ fontFamily:MONO, fontSize:"0.65rem", color:RED, flexShrink:0 }}>VERIFY ↗</span>}
              </div>
            ))}
          </section>
        </Reveal>
      ))}
    </main>
  );
}

// ── WRITEUPS ─────────────────────────────────────────────────
function DispatchesPage() {
  const WRITEUPS = [
    { title:"HTB CDSA — What It Really Takes to Pass", date:"Feb 2026", kicker:"CERTIFICATION JOURNEY", deck:"An honest account of what the CDSA exam demands — lab hours, mental pressure, and what actually prepared me to pass. No fluff.", url:"https://medium.com/@12farouq12/htb-cdsa-2025-what-it-really-takes-to-pass-the-certified-defensive-security-analyst-exam-5215213392cc", live:true },
    { title:"HTB Machine Writeup #1", date:"Mar 2026", kicker:"HTB MACHINES", deck:"Full walkthrough from recon to root. Details pending publication.", url:null, live:false },
    { title:"Detection Engineering: Writing Real Sigma Rules", date:"Coming", kicker:"DETECTION ENGINEERING SERIES", deck:"Building production-grade detections for AD attack paths with MITRE mapping and false positive tuning.", url:null, live:false },
  ];
  return (
    <main style={{ maxWidth: 1160, margin: "0 auto", padding: "24px clamp(16px,4vw,48px)" }}>
      <Reveal>
        <div style={{ borderBottom: `3px double ${INK}`, paddingBottom: 14, marginBottom: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: RED, marginBottom: 6 }}>INTELLIGENCE REPORTS</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem,5vw,3.2rem)", fontWeight: 900, color: INK, lineHeight: 1, letterSpacing: "-0.025em" }}>DISPATCHES FROM THE FIELD</h2>
        </div>
      </Reveal>
      <div style={{ columns: "360px", columnGap: 0, columnRule: `1px solid ${RULE}` }}>
        {WRITEUPS.map((w, i) => (
          <Reveal key={w.title} delay={i * 80}>
            <article onClick={() => w.live && w.url && window.open(w.url, "_blank")}
              style={{ padding: "20px", borderBottom: `1px solid ${RULE}`, cursor: w.live ? "pointer" : "default", opacity: w.live ? 1 : 0.5, breakInside: "avoid", transition: "background 0.18s" }}
              onMouseEnter={e => { if(w.live) e.currentTarget.style.background = GHOST; }}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ fontFamily: MONO, fontSize: "0.54rem", color: RED, letterSpacing: "0.2em", marginBottom: 6, fontWeight: 700 }}>{w.kicker}</div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(1rem,2.2vw,1.4rem)", fontWeight: 900, color: INK, lineHeight: 1.18, marginBottom: 8, letterSpacing: "-0.01em" }}>{w.title}</h3>
              <div style={{ height: 1, background: RULE, marginBottom: 10 }} />
              <p style={{ fontFamily: SANS, fontSize: "0.8rem", color: INK, lineHeight: 1.8, opacity: 0.65 }}>{w.deck}</p>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: MONO, fontSize: "0.58rem", color: INK, opacity: 0.35, letterSpacing: "0.08em" }}>{w.date}</span>
                {w.live && <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: RED, letterSpacing: "0.1em" }}>READ ↗</span>}
                {!w.live && <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: INK, opacity: 0.3, letterSpacing: "0.1em" }}>IN PRESS</span>}
              </div>
            </article>
          </Reveal>
        ))}
        {/* Publishing note */}
        <div style={{ padding: 20, breakInside: "avoid" }}>
          <div style={{ border: `1px solid ${RULE}`, padding: 16, textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: "0.85rem", fontStyle: "italic", color: INK, opacity: 0.4, lineHeight: 1.8 }}>
              "More dispatches in press.<br />Publishing regularly on Medium."
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("front");
  const pages = { front: <FrontPage />, projects: <AllStories />, roadmap: <RoadmapPage />, certs: <CredsPage />, writeups: <DispatchesPage /> };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Roboto+Slab:wght@400;700&family=DM+Sans:wght@400;500&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { font-size:16px; }
        body { background:${PAPER}; color:${INK}; min-height:100vh; -webkit-font-smoothing:antialiased; }
        ::selection { background:${INK}; color:${PAPER}; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:${AGED}; }
        ::-webkit-scrollbar-thumb { background:${INK}; }
        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pageIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .front-top  { grid-template-columns:1fr 1px 300px; }
        .front-mid  { grid-template-columns:2fr 1px 1fr 1px 1fr; }
        .front-briefs { grid-template-columns:1fr 1px 1fr 1px 1fr 1px 1fr; }
        .body-cols  { column-count:2; }
        .about-grid { grid-template-columns:1fr 1fr; }
        @media(max-width:860px) {
          .front-top    { grid-template-columns:1fr !important; }
          .front-mid    { grid-template-columns:1fr !important; }
          .front-briefs { grid-template-columns:1fr 1px 1fr !important; }
          .body-cols    { column-count:1 !important; }
        }
        @media(max-width:520px) {
          .front-briefs { grid-template-columns:1fr !important; }
        }
      `}</style>

      <Ticker />
      <Masthead />
      <SectionNav active={active} setActive={setActive} />

      <div key={active} style={{ animation: "pageIn 0.4s cubic-bezier(0.16,1,0.3,1)", minHeight: "60vh", background: PAPER }}>
        {pages[active]}
      </div>

      <footer style={{ background: INK, color: PAPER, padding: "20px clamp(16px,4vw,48px)", marginTop: 40, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div style={{ fontFamily: SERIF, fontSize: "0.95rem", fontWeight: 900, fontStyle: "italic" }}>The Farouq Hassan Gazette</div>
        <div style={{ fontFamily: MONO, fontSize: "0.58rem", opacity: 0.4, letterSpacing: "0.1em" }}>FAROUQHASSAN.DEV · NEXT.JS + VERCEL · {new Date().getFullYear()}</div>
        <div style={{ display:"flex", gap:18 }}>
          {[["LinkedIn",ME.linkedin],["GitHub",ME.github],["Medium",ME.medium]].map(([l,u])=>(
            <a key={l} href={u} target="_blank" rel="noreferrer"
              style={{ fontFamily:MONO, fontSize:"0.6rem", color:"rgba(245,240,232,0.35)", textDecoration:"none", letterSpacing:"0.08em", transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color=PAPER}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(245,240,232,0.35)"}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
