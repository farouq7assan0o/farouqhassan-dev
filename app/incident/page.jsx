"use client";
import { useState, useEffect, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────
const ME = {
  name: "FAROUQ HASSAN",
  codename: "ANALYST-02",
  clearance: "SECRET // CYBERSECURITY",
  unit: "Special Communications Commission — Jordan Armed Forces",
  location: "AMMAN, HASHEMITE KINGDOM OF JORDAN",
  email: "12farouq12@gmail.com",
  linkedin: "https://www.linkedin.com/in/FarouqHassan02",
  github: "https://github.com/farouq7assan0o",
  medium: "https://medium.com/@12farouq12",
  cvSoc: "/Farouq_Hassan_Junior_SOC_Analyst_CV.pdf",
  cvOffensive: "/Farouq_Hassan_CV_Offensive.pdf",
  caseRef: "FH-2026-JO-CLASSIFIED",
  compiled: "MARCH 2026",
  status: "AVAILABLE FOR DEPLOYMENT — JUNE 2026",
};

const CASE_FILES = [
  {
    id:"CF-001", sev:"CRITICAL", cat:"OFFENSIVE OPERATIONS", year:2024,
    title:"ANIMEBLAST — FULL-SCOPE NETWORK PENETRATION",
    classification:"SECRET",
    synopsis:"Analyst conducted full-scope penetration test. Custom buffer overflow exploit developed in Python. EIP controlled at offset 1036. DEP, ASLR, and SafeSEH protections bypassed. Network pivot established via SOCKS proxy. SQL injection used to extract credentials. PHP shell uploaded resulting in remote code execution. Ten capture-the-flag objectives secured.",
    findings:["Custom BoF — EIP controlled @ 1036 bytes","DEP + ASLR + SafeSEH bypassed via ROP chain","SOCKS pivot through compromised host","UNION SELECT credential extraction","PHP shell → RCE → administrative access","10/10 objectives captured"],
    ttps:["T1203 — Exploitation","T1055 — Process Injection","T1090 — Proxy","T1190 — Exploit Public-Facing App"],
    github:null,
  },
  {
    id:"CF-002", sev:"CRITICAL", cat:"MALWARE ANALYSIS", year:2024,
    title:"BACKDOORBEACON.EXE — REVERSE ENGINEERING OPERATION",
    classification:"SECRET // NOFORN",
    synopsis:"UPX-packed backdoor submitted for analysis. Full reverse engineering lifecycle conducted using IDA Free and x32dbg. TLS callback anti-analysis routines identified and NOP-patched. C2 communication IP address patched to loopback. SYN beacon transmission confirmed via Wireshark. Kernel structure integrity confirmed — no SSDT or IDT hooking detected.",
    findings:["UPX unpacked — PE headers analyzed","IsDebuggerPresent anti-debug NOP-patched","TLS callback routine neutralized","C2 IP → 127.0.0.1 (safe detonation)","HKCU\\Run persistence mechanism","SSDT/IDT — CLEAN"],
    ttps:["T1027 — Obfuscated Files","T1055 — Process Injection","T1547 — Boot/Logon Autostart","T1071 — C2 over standard protocol"],
    github:null,
  },
  {
    id:"CF-003", sev:"CRITICAL", cat:"INCIDENT RESPONSE", year:2025,
    title:"PLAYBOOK SERIES — RANSOMWARE, SUPPLY CHAIN, CLINIC MALWARE",
    classification:"SECRET",
    synopsis:"Three incident response playbooks developed under NIST IR framework. Scenarios: clinic malware infection, CityWorks ransomware deployment, and Bazaarjo supply-chain compromise. ATT&CK techniques mapped to D3FEND countermeasures throughout. FIDO2 MFA identified as chain-breaking control against Lumma Stealer credential harvesting. Executive communications, staff advisories, and closure criteria documented for each scenario.",
    findings:["VLAN ACL applied — speed and evidence preserved","Ransomware decision tree constructed","D3FEND: FIDO2 MFA breaks Lumma Stealer chain","Executive update + staff advisory drafted","Closure criteria defined for all three scenarios"],
    ttps:["T1486 — Data Encrypted for Impact","T1195 — Supply Chain Compromise","T1555 — Credentials from Password Stores"],
    github:null,
  },
  {
    id:"CF-004", sev:"CRITICAL", cat:"RISK QUANTIFICATION", year:2024,
    title:"PHISHING INCIDENT — FAIR RISK ANALYSIS",
    classification:"CONFIDENTIAL",
    synopsis:"FAIR model applied to quantify annualized financial exposure from phishing campaign. Monte Carlo simulation executed via FAIR-U. Pre-control ALE calculated at $1,380,000 per annum. Jordanian PDPL 72-hour disclosure obligation identified as violated. Post-control ALE after MFA deployment, SIEM integration, executive phishing training, and IR tabletop exercise: $177,000. Net annual risk reduction: $1,203,000.",
    findings:["ALE (before controls): $1,380,000/year","ALE (after controls): $177,000/year","Net risk reduction: $1,203,000/year","PDPL Article — 72hr disclosure obligation violated","Controls: MFA + SIEM + exec training + IR tabletop"],
    ttps:["T1566 — Phishing","T1078 — Valid Accounts","T1020 — Automated Exfiltration"],
    github:null,
  },
  {
    id:"CF-005", sev:"HIGH", cat:"DIGITAL FORENSICS", year:2025,
    title:"PCAP + MEMORY FORENSICS — HTTP C2 AND DNS EXFILTRATION",
    classification:"SECRET",
    synopsis:"Network packet capture and memory image analyzed. HTTP-based C2 beaconing identified via sequential polling of /v1/checkin endpoint. DNS TXT record Base64-encoded exfiltration channel confirmed. Volatility 3 malfind module identified RWX shellcode injected into legitimate process. Parent process: explorer.exe. Network and memory timelines correlated.",
    findings:["HTTP C2: sequential /v1/checkin polling identified","DNS TXT: Base64 payload exfiltration confirmed","RWX shellcode injected — Volatility malfind","Rogue process parent: explorer.exe","Network + memory timelines correlated"],
    ttps:["T1071.001 — Web Protocols C2","T1048.003 — DNS Exfiltration","T1055 — Process Injection"],
    github:null,
  },
  {
    id:"CF-006", sev:"HIGH", cat:"THREAT INTELLIGENCE", year:2025,
    title:"APT29 + LUMMA STEALER — ATT&CK INTELLIGENCE REPORT",
    classification:"SECRET // ORCON",
    synopsis:"Full ATT&CK Navigator layer constructed for APT29 SolarWinds supply chain compromise and USAID spear-phishing campaign. T1195.002 confirmed as primary initial access vector. LSASS memory access and token abuse rated High impact. Lumma Stealer behavioral chain mapped separately. Sources: CISA Advisory AA20-352A and Mandiant SUNBURST report.",
    findings:["APT29 T1195.002 — supply chain compromise: High","T1003.001 LSASS dump + T1550 token abuse: High","Lumma Stealer T1555 — credential stores: High","Navigator JSON layers constructed","CISA AA20-352A + Mandiant SUNBURST cross-referenced"],
    ttps:["T1195.002 — Supply Chain Compromise","T1003.001 — LSASS Memory","T1555 — Credential Access"],
    github:null,
  },
  {
    id:"CF-007", sev:"HIGH", cat:"OFFENSIVE OPERATIONS", year:2024,
    title:"CYBERBLAST — ETHICAL HACKING ASSESSMENT",
    classification:"CONFIDENTIAL",
    synopsis:"Full-cycle ethical hacking engagement. Nessus vulnerability scan produced 20 findings including BlueKeep, TLS 1.0 exposure, and PHP 5.6. EternalBlue exploited via Metasploit resulting in Meterpreter session and credential dump. UNION-based SQL injection and XSS session hijacking demonstrated. Custom MSFvenom reverse shell payload generated.",
    findings:["Nessus: 20 findings — BlueKeep, TLS 1.0, PHP 5.6","EternalBlue → Meterpreter → credential dump","UNION SQLi + reflected XSS + RCE","Custom MSFvenom reverse shell delivered"],
    ttps:["T1190 — Exploit Public-Facing Application","T1059 — Command Scripting","T1189 — Drive-by Compromise"],
    github:null,
  },
  {
    id:"CF-008", sev:"HIGH", cat:"DIGITAL FORENSICS", year:2024,
    title:"OPERATION BLACKEAGLE — STEGANOGRAPHIC EVIDENCE RECOVERY",
    classification:"SECRET",
    synopsis:"NTFS partition recovery conducted manually via HxD hex editor using mirror table. DOCX file identified concealed within PNG image through steganographic analysis. Hidden message extracted and decoded. Content revealed criminal meeting dates and locations. SHA-256 hash integrity verification maintained throughout entire chain of custody.",
    findings:["NTFS mirror table — manual hex recovery","DOCX embedded inside PNG — steganography layer","Hidden message decoded — criminal intelligence","SHA-256 hash verified at each custody transfer"],
    ttps:["T1027 — Obfuscated/Encoded Files","T1564 — Hidden Artifacts"],
    github:null,
  },
  {
    id:"CF-009", sev:"HIGH", cat:"CLOUD SECURITY", year:2025,
    title:"OTP S3 SYSTEM — FOUR CRITICAL VULNERABILITIES REMEDIATED",
    classification:"CONFIDENTIAL",
    synopsis:"Security assessment of OTP-protected S3 file access system. Four critical vulnerabilities identified and remediated: OTP value returned in API response, no expiry enforcement, no brute-force protection, predictable S3 object paths. Post-remediation: uuid4 filenames, private bucket with presigned URLs (600s TTL), 5-attempt rate limit with exponential backoff.",
    findings:["VULN-1: OTP in API response — REMEDIATED","VULN-2: No expiry — 5-min TTL applied","VULN-3: No rate limit — MAX_ATTEMPTS=5 enforced","VULN-4: Predictable path — uuid4 + presigned URL"],
    ttps:["OWASP A01 — Broken Access Control","OWASP A07 — Authentication Failures"],
    github:null,
  },
  {
    id:"CF-010", sev:"HIGH", cat:"GOVERNANCE & RISK", year:2025,
    title:"BAZAARJO — GOVERNANCE GAP ASSESSMENT",
    classification:"CONFIDENTIAL",
    synopsis:"Post-breach governance assessment. Seven governance deficiencies identified across ISO 27014, PDPL, and PCI DSS frameworks. Critical finding: developers exercising unilateral production deployment authority — absence of segregation of duties. CISO accountability undefined in organizational chart. No PDPL breach notification procedure exists. 12-month remediation roadmap with board briefing delivered.",
    findings:["7 governance deficiencies identified","SoD violation: devs — unilateral prod deployment","CISO accountability undefined","No PDPL breach notification procedure","Board brief with 3–6 month remediation roadmap"],
    ttps:["ISO 27014 — Governance","PDPL — Breach Notification","PCI DSS — Access Control"],
    github:null,
  },
  {
    id:"CF-011", sev:"MEDIUM", cat:"OFFENSIVE OPERATIONS", year:2025,
    title:"LINUX PRIVILEGE ESCALATION — KERNEL 2.6.32 EXPLOIT",
    classification:"CONFIDENTIAL",
    synopsis:"LinPEAS enumeration identified kernel version 2.6.32. Searchsploit query returned Exploit-DB reference 18411. Buffer overflow local privilege escalation exploit compiled and executed on target system. Root shell obtained. Four distinct file transfer methodologies demonstrated.",
    findings:["Kernel 2.6.32 confirmed via uname -a","Exploit-DB 18411 — BoF LPE identified","Exploit compiled and executed — root obtained","4 file transfer methods documented"],
    ttps:["T1068 — Exploitation for Privilege Escalation","T1105 — Ingress Tool Transfer"],
    github:null,
  },
  {
    id:"CF-012", sev:"MEDIUM", cat:"DEVSECOPS", year:2025,
    title:"SEMGREP SAST — 41 FINDINGS IN CI/CD PIPELINE",
    classification:"UNCLASSIFIED",
    synopsis:"Semgrep SAST integrated into GitHub Actions CI/CD pipeline triggered on every push. Analysis of Juice Shop application: 41 findings across 1,015 files using 1,062 rules. Critical finding: Sequelize ORM query string direct concatenation enabling SQL injection. Parameterized query remediation documented.",
    findings:["41 findings across 1,015 files","Critical: Sequelize SQLi — direct query concatenation","Pipeline: YAML trigger on every push","Remediation: parameterized queries enforced"],
    ttps:["T1190 — Exploit Public-Facing App","CWE-89 — SQL Injection"],
    github:null,
  },
  {
    id:"CF-013", sev:"MEDIUM", cat:"CLOUD SECURITY", year:2025,
    title:"APACHE + SSH HARDENING — CIS BENCHMARK COMPLIANCE",
    classification:"UNCLASSIFIED",
    synopsis:"Five Apache 2.4 misconfigurations identified and remediated per CIS benchmark sections 2.2–3.5. ServerTokens set to Prod, TraceEnable disabled, directory indexing removed, /server-status restricted to 403 externally. SSH hardened: password authentication disabled, root login prohibited, cipher suite restricted to chacha20-poly1305 and aes256-gcm.",
    findings:["5 CIS findings remediated (sections 2.2–3.5)","ServerTokens Prod + TraceEnable Off","/server-status → 403 external","PasswordAuth disabled + PermitRootLogin no","chacha20-poly1305 + aes256-gcm only"],
    ttps:["CIS Apache Benchmark","CIS SSH Benchmark"],
    github:null,
  },
  {
    id:"CF-014", sev:"MEDIUM", cat:"GOVERNANCE & RISK", year:2025,
    title:"ENTERPRISE RISK REGISTER — ISO 27005 + NIST 800-30",
    classification:"CONFIDENTIAL",
    synopsis:"Risk management lifecycle applied using ISO 27005 and NIST 800-30 frameworks. Six risks identified, rated, and treated. If-Then risk statements drafted. Key Risk Indicators defined: MFA coverage percentage, unapproved deployments, privilege revocation lag. Quarterly board-level risk reporting cadence established.",
    findings:["6 risks — Customer PII rated Critical (H×H)","If-Then: weak git controls → code injection","KRIs: MFA%, unapproved deploys, revocation lag","Quarterly board risk reporting defined"],
    ttps:["ISO 27005 — Risk Management","NIST 800-30 — Risk Assessment"],
    github:null,
  },
  {
    id:"CF-015", sev:"MEDIUM", cat:"GOVERNANCE & RISK", year:2024,
    title:"ISMS DESIGN — BLUEFRONTIER BANK",
    classification:"CONFIDENTIAL",
    synopsis:"Complete Information Security Management System designed for banking institution. ISO 27001 full scope applied. COBIT 2019 seven-phase implementation roadmap. Business Impact Analysis across six processes. Three-stage internal audit structure. Financial ROI quantified and presented to executive board.",
    findings:["ISO 27001 full scope — policies, controls, audit","COBIT 2019: 7-phase gap→implement→audit","BIA: 6 processes, RTO range 15–240min","3-stage audit: planning, execution, reporting","Financial ROI — board presentation delivered"],
    ttps:["ISO 27001","COBIT 2019","ISO 27005"],
    github:null,
  },
  {
    id:"CF-016", sev:"MEDIUM", cat:"GOVERNANCE & RISK", year:2025,
    title:"BUSINESS IMPACT ANALYSIS — PAYMENT RTO 15MIN",
    classification:"CONFIDENTIAL",
    synopsis:"Business Impact Analysis conducted across six critical processes following simulated two-hour outage. Payment processing classified as Priority 1: RTO 15 minutes, RPO 0–5 minutes, PCI-DSS compliant. IR monitoring: RTO 15 minutes, RPO zero — no log loss tolerated. Recovery sequence documented.",
    findings:["Payment: RTO 15min / RPO 0–5min (PCI-DSS)","IR Monitoring: RTO 15min / RPO 0","Online Orders: RTO 30min / RPO 5min","Recovery order: Payments→Orders→IR→Support→Catalog"],
    ttps:["PCI DSS — Availability","ISO 22301 — Business Continuity"],
    github:null,
  },
  {
    id:"CF-017", sev:"MEDIUM", cat:"OFFENSIVE OPERATIONS", year:2025,
    title:"BANKING RED TEAM PLAN — CYBER KILL CHAIN",
    classification:"SECRET",
    synopsis:"Manual SQL injection exploitation for authentication bypass. UNION SELECT credential extraction confirmed. Full banking sector rules of engagement drafted: scope, limitations, emergency contacts. Complete Cyber Kill Chain documented from OSINT through weaponisation, delivery, exploitation, C2, and exfiltration.",
    findings:["Authentication bypass via SQL injection","UNION SELECT — credential extraction confirmed","Banking ROE: scope, limits, emergency contacts","Full Kill Chain: OSINT→weaponise→C2→exfil"],
    ttps:["T1566 — Phishing (delivery)","T1190 — Exploit Public-Facing Application","T1041 — Exfiltration Over C2 Channel"],
    github:null,
  },
  {
    id:"CF-018", sev:"MEDIUM", cat:"CLOUD SECURITY", year:2023,
    title:"ENTERPRISE NETWORK SECURITY DESIGN — FIVE SITES",
    classification:"UNCLASSIFIED",
    synopsis:"Five-site enterprise network designed with full security stack. IPsec VPN using AES encryption and SHA authentication between all sites. Cisco ASA firewall with DMZ zone and NAT configuration. Full-mesh OSPF routing across WAN. VLAN segmentation per department. Port security, 802.1X, and AAA authentication implemented.",
    findings:["IPsec VPN: AES + SHA — all inter-site links","ASA: DMZ zone + NAT + HTTPS-only management","Full-mesh OSPF: 5 routers","VLAN isolation: per department","802.1X + AAA authentication"],
    ttps:["CIS Network Controls","NIST 800-41 — Firewall Guidelines"],
    github:null,
  },
  {
    id:"CF-019", sev:"MEDIUM", cat:"CRYPTOGRAPHY", year:2024,
    title:"2-DES MITM — KEYSPACE REDUCED FROM 2¹¹² TO 2⁵⁷",
    classification:"UNCLASSIFIED",
    synopsis:"Meet-in-the-middle attack demonstrated against double-DES reducing effective keyspace from 2¹¹² to 2⁵⁷. ECB mode pattern leakage visualised on encrypted image data. Hybrid RSA+DES secure messaging system implemented with session key encryption. Square-and-Multiply exponentiation in O(log e) complexity demonstrated.",
    findings:["MITM attack: 2¹¹² → 2⁵⁷ keyspace reduction","ECB leakage: pattern visible in encrypted image","RSA+DES hybrid: session key + data encryption","Square-and-Multiply: O(log e) RSA exponentiation"],
    ttps:["CWE-326 — Inadequate Encryption","CWE-327 — Broken Crypto Algorithm"],
    github:null,
  },
  {
    id:"CF-020", sev:"MEDIUM", cat:"OFFENSIVE OPERATIONS", year:2025,
    title:"FTP BRUTE FORCE — ANONYMOUS ACCESS CONFIRMED",
    classification:"UNCLASSIFIED",
    synopsis:"Anonymous FTP access confirmed on target host. Hydra brute-force tool deployed against 100,000-entry NCSC wordlist. No rate limiting or lockout mechanism detected. Zero resistance to brute-force attack. Remediation documented: Fail2Ban deployment, anonymous access disabled, migration to SFTP.",
    findings:["Anonymous FTP access confirmed","Hydra + 100k NCSC wordlist — no resistance","Zero rate limiting — zero lockout mechanism","Remediation: Fail2Ban + disable anon + SFTP"],
    ttps:["T1110 — Brute Force","T1021.002 — Remote Services: SMB/FTP"],
    github:null,
  },
  {
    id:"CF-021", sev:"MEDIUM", cat:"SECURE DEVELOPMENT", year:2024,
    title:"SECURE AIRLINE CHECK-IN SYSTEM — 100K FUZZ TEST",
    classification:"UNCLASSIFIED",
    synopsis:"Secure check-in system implemented in Java with full security controls. SHA-256 with salt for password storage. Three-strike lockout mechanism. Role-based access control across four strictly separated roles. JUnit fuzz testing escalated: 1,000 → 10,000 → 100,000 attempts — all handled correctly. PMD SAST integrated.",
    findings:["SHA-256 + salt — no plaintext storage","3-strike lockout enforced","RBAC: 4 strictly separated roles","100,000 fuzz attempts — all handled","PMD SAST — no critical findings"],
    ttps:["OWASP A07 — Authentication Failures","CWE-521 — Weak Password Requirements"],
    github:"https://github.com/farouq7assan0o/SecureCoding",
  },
  {
    id:"CF-022", sev:"LOW", cat:"BLOCKCHAIN SECURITY", year:2024,
    title:"HOPECHAIN — SMART CONTRACT SECURITY REVIEW",
    classification:"UNCLASSIFIED",
    synopsis:"Security review of Ethereum-based charitable donation platform. Reentrancy vulnerability mitigated via transfer() pattern. Donor privacy gap identified — zkSNARK zero-knowledge proof implementation proposed. Governance hardened with multisig wallet and timelock mechanisms. Jordan NGO regulatory and cryptocurrency banking constraints reviewed.",
    findings:["Reentrancy mitigated via transfer() pattern","Privacy: zkSNARK donor anonymisation proposed","Governance: multisig + timelock deployed","Sybil attack vector documented","Jordan NGO + crypto banking compliance reviewed"],
    ttps:["SWC-107 — Reentrancy","SWC-105 — Unprotected Selfdestruct"],
    github:null,
  },
  {
    id:"CF-023", sev:"LOW", cat:"RESEARCH & DEVELOPMENT", year:2025,
    title:"SPARK — WEARABLE INR MONITORING PATCH",
    classification:"UNCLASSIFIED",
    synopsis:"Led six-person cross-disciplinary team in development of non-invasive wearable INR monitoring patch. Market validation confirmed $1.65M serviceable obtainable market within $55M Jordan rehabilitation market. AI-powered emergency alert system designed for simultaneous notification of patient, caregiver, and physician. HIPAA privacy considerations documented.",
    findings:["Team leadership: 6-person cross-disciplinary","$1.65M SOM validated in $55M Jordan market","Continuous non-invasive INR monitoring","AI alerts: patient + caregiver + physician","HIPAA privacy framework applied"],
    ttps:["HIPAA Security Rule","IEC 62443 — Medical Device Security"],
    github:null,
  },
];

const CERTS = [
  { id:"CDSA",  full:"Certified Defensive Security Analyst",   issuer:"Hack The Box",  year:"2025", clearance:"OPERATIVE — SOC/DFIR", status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9385aaf3-d974-43d8-8144-0dca4b70746b" },
  { id:"CWSE",  full:"Certified Web Security Expert",          issuer:"Hackviser",     year:"2025", clearance:"OPERATIVE — WEB OFFENSE",status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CWSE-D15I7TON" },
  { id:"CAPT",  full:"Certified Associate Penetration Tester", issuer:"Hackviser",     year:"2025", clearance:"OPERATIVE — PENTEST",   status:"earned", pct:100, url:"https://hackviser.com/verify?id=HV-CAPT-T3O8P3JO" },
  { id:"NCA",   full:"Nutanix Certified Associate v6",         issuer:"Nutanix",       year:"2025", clearance:"OPERATIVE — CLOUD",     status:"earned", pct:100, url:"https://www.credly.com/earner/earned/badge/9c45a9a4-34b0-46b8-819f-25b6b053dfdd" },
  { id:"CWES",  full:"Certified Web Exploitation Specialist",  issuer:"Hack The Box",  year:"2026", clearance:"PENDING — 70% COMPLETE",status:"active", pct:70,  url:null },
  { id:"CPTS",  full:"Certified Penetration Testing Specialist",issuer:"Hack The Box", year:"2026", clearance:"PENDING — 45% COMPLETE",status:"active", pct:45,  url:null },
  { id:"SEC+",  full:"CompTIA Security+ SY0-701",              issuer:"CompTIA",       year:"2026", clearance:"SCHEDULED",             status:"queued", pct:0,   url:null },
  { id:"CCNA",  full:"Cisco CCNA 200-301",                     issuer:"Cisco",         year:"2026", clearance:"SCHEDULED",             status:"queued", pct:0,   url:null },
];

const ROADMAP = [
  { ref:"OPR-001", phase:"Phase 1", days:"Days 1–30", title:"Detection Engineering Fundamentals", status:"ACTIVE — IN PROGRESS",
    objective:"Construct 15–20 production-grade detection rules for documented Active Directory attack paths.",
    weeks:[
      { w:"Week 1", t:"Lab Infrastructure", items:["Deploy: DC + 2x Win10 workstations + Kali + Splunk","Configure: Sysmon on all endpoints","Enable: PowerShell Script Block and Module Logging","Audit: 4662, 4742, 4738, 4672 AD events"], deliverable:"Lab architecture diagram + logging baseline document" },
      { w:"Week 2", t:"Initial Access & Execution", items:["Simulate: phishing macro → PowerShell execution","Test: encoded PowerShell / IEX patterns","Test: Office applications spawning cmd/powershell"], deliverable:"5 detection rules with full MITRE ATT&CK mapping" },
      { w:"Week 3", t:"Privilege Escalation & Persistence", items:["Simulate: UAC bypass techniques","Test: scheduled task creation (Event 4698)","Test: registry run key persistence","Test: malicious service creation"], deliverable:"6 detection rules + alert logic documentation" },
      { w:"Week 4", t:"Credential Access", items:["Simulate: Mimikatz LSASS dump (Sysmon Event 10)","Test: Kerberoasting (Event 4769 with RC4 encryption)","Test: Pass-the-Hash attack patterns","Monitor: Logon Type 9 and abnormal Event 4672"], deliverable:"Credential Theft Detection Pack — production ready" },
    ]},
  { ref:"OPR-002", phase:"Phase 2", days:"Days 31–60", title:"Active Directory Threat Hunting", status:"SCHEDULED — NOT COMMENCED",
    objective:"Develop Domain Compromise Detection Framework. Hunt for attack patterns, not individual alerts.",
    weeks:[
      { w:"Week 5", t:"Lateral Movement Detection", items:["Detect: SMB, PsExec, WMI, WinRM movement","Identify: ADMIN$ + named pipe anomalies","Correlate: Event 4624 Type 3 — workstation to DC"], deliverable:"Lateral movement detection rule set" },
      { w:"Week 6", t:"DCSync & DCShadow", items:["Detect: DCSync — Event 4662 replication GUIDs","Detect: DCShadow — Event 4742/4738 anomalies","Track: unauthorized AD object modification"], deliverable:"Domain Compromise Detection Framework" },
      { w:"Week 7", t:"Threat Hunting Framework", items:["Hunt: rare logon types baseline deviation","Hunt: rare parent-child process relationships","Hunt: LDAP burst activity anomalies","Document: behavioral baseline vs anomaly criteria"], deliverable:"10 production threat hunting queries" },
      { w:"Week 8", t:"SIEM Engineering", items:["Build: field normalization across log sources","Construct: multi-stage correlation rules","Implement: risk-based alerting with noise reduction"], deliverable:"3 multi-stage correlation rules — peer reviewed" },
    ]},
  { ref:"OPR-003", phase:"Phase 3", days:"Days 61–90", title:"Automation, Purple Team & Portfolio", status:"SCHEDULED — NOT COMMENCED",
    objective:"Deploy production SOAR, execute full purple team simulation, publish complete public portfolio.",
    weeks:[
      { w:"Week 9",  t:"SOAR & Case Management",  items:["Deploy: TheHive + Shuffle SOAR platform","Automate: Alert → Case creation pipeline","Integrate: IP enrichment + MITRE auto-tagging"], deliverable:"Fully operational SOAR pipeline" },
      { w:"Week 10", t:"Purple Team Simulation",  items:["Day 1: Phishing campaign simulation","Day 2: Kerberoasting under detection","Day 3: Lateral movement with logging","Day 4: DCSync operation observed"], deliverable:"Detection gap analysis report — formal document" },
      { w:"Week 11", t:"Public Detection Portfolio", items:["Publish: all detection rules on GitHub","Write: technical article per attack chain","Compare: red team execution vs blue detection"], deliverable:"Public GitHub portfolio — ready for review" },
      { w:"Week 12", t:"Enterprise Hardening", items:["Implement: LAPS + Credential Guard recommendations","Design: tiered AD model / ESAE principles","Draft: enterprise prevention mindset framework"], deliverable:"Enterprise hardening checklist — board level" },
    ]},
];

const WRITEUPS = [
  { ref:"DISP-001", title:"HTB CDSA — What It Really Takes to Pass", date:"FEB 2026", classification:"UNCLASSIFIED", tags:["CDSA","Blue Team"], synopsis:"An honest field account of CDSA examination demands — laboratory hours, examination pressure, and preparation methodology. No embellishment.", url:"https://medium.com/@12farouq12/htb-cdsa-2025-what-it-really-takes-to-pass-the-certified-defensive-security-analyst-exam-5215213392cc", status:"PUBLISHED" },
  { ref:"DISP-002", title:"HTB Machine Writeup — Series Entry #1", date:"MAR 2026", classification:"UNCLASSIFIED", tags:["HTB","Linux Exploitation"], synopsis:"Full walkthrough from initial reconnaissance to root shell acquisition.", url:null, status:"IN PREPARATION" },
  { ref:"DISP-003", title:"Detection Engineering: Writing Real Sigma Rules", date:"PENDING", classification:"UNCLASSIFIED", tags:["Detection Engineering","Sigma Rules"], synopsis:"Production-grade detection construction for documented AD attack paths. MITRE mapping, false positive tuning, and deployment validation.", url:null, status:"IN PREPARATION" },
];

// ── DESIGN TOKENS ────────────────────────────────────────────
const T = {
  paper:     "#F2EDE4",
  paperDark: "#E8E0D0",
  ink:       "#1A1612",
  inkFaint:  "#3D3530",
  inkGhost:  "rgba(26,22,18,0.35)",
  red:       "#8B1A1A",
  redBright: "#C41E1E",
  stamp:     "rgba(139,26,26,0.08)",
  rule:      "rgba(26,22,18,0.18)",
  ruleFaint: "rgba(26,22,18,0.08)",
  serif:     "'Libre Baskerville', Georgia, serif",
  mono:      "'Courier Prime', 'Courier New', monospace",
  sans:      "'DM Sans', sans-serif",
};

const SEV_COL = { CRITICAL: T.redBright, HIGH: "#7A4500", MEDIUM: T.inkFaint, LOW: "#666" };
const SEV_STAMP = { CRITICAL:"TOP SECRET", HIGH:"SECRET", MEDIUM:"CONFIDENTIAL", LOW:"UNCLASSIFIED" };

// ── UTILS ────────────────────────────────────────────────────
function useInView(t = 0.08) {
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
  return (
    <div ref={r} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(16px)", transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── CLASSIFIED STAMP ─────────────────────────────────────────
function Stamp({ label, rotate = -8, opacity = 0.12, size = "1rem" }) {
  return (
    <div style={{
      display: "inline-block",
      border: `3px solid ${T.redBright}`,
      color: T.redBright,
      fontFamily: T.mono,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: "0.22em",
      padding: "4px 14px",
      opacity,
      transform: `rotate(${rotate}deg)`,
      pointerEvents: "none",
      userSelect: "none",
      whiteSpace: "nowrap",
    }}>
      {label}
    </div>
  );
}

// ── PAGE SECTION DIVIDER ─────────────────────────────────────
function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "40px 0 28px" }}>
      <div style={{ flex: 1, height: 1, background: T.rule }} />
      <span style={{ fontFamily: T.mono, fontSize: "0.6rem", color: T.inkGhost, letterSpacing: "0.28em" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: T.rule }} />
    </div>
  );
}

// ── COVER PAGE ───────────────────────────────────────────────
function Cover({ setTab }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(32px,6vw,80px)", position: "relative" }}>
      {/* Top-right stamp */}
      <div style={{ position: "absolute", top: 40, right: 48, transform: "rotate(12deg)" }}>
        <Stamp label="CLASSIFIED" rotate={0} opacity={0.13} size="1.1rem" />
      </div>

      <div>
        {/* Org header */}
        <Reveal>
          <div style={{ fontFamily: T.mono, fontSize: "0.65rem", color: T.inkGhost, letterSpacing: "0.24em", marginBottom: 6 }}>
            SPECIAL COMMUNICATIONS COMMISSION — JORDAN ARMED FORCES
          </div>
          <div style={{ fontFamily: T.mono, fontSize: "0.65rem", color: T.inkGhost, letterSpacing: "0.24em", marginBottom: 40 }}>
            HASHEMITE UNIVERSITY — DEPARTMENT OF CYBERSECURITY
          </div>
        </Reveal>

        {/* Triple rule */}
        <Reveal delay={100}>
          <div style={{ borderTop: `3px solid ${T.ink}`, borderBottom: `1px solid ${T.ink}`, padding: "6px 0 4px", marginBottom: 48 }}>
            <div style={{ fontFamily: T.mono, fontSize: "0.56rem", letterSpacing: "0.28em", color: T.inkFaint, textAlign: "center" }}>
              SECURITY BRIEFING DOCUMENT — HANDLE VIA CLEARED CHANNELS ONLY
            </div>
          </div>
        </Reveal>

        {/* Main title block */}
        <Reveal delay={160}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: T.mono, fontSize: "0.6rem", color: T.inkGhost, letterSpacing: "0.28em", marginBottom: 20 }}>
              SUBJECT DOSSIER — ANALYST PROFILE AND OPERATIONAL RECORD
            </div>
            <h1 style={{ fontFamily: T.serif, fontSize: "clamp(3rem,9vw,7.5rem)", fontWeight: 700, color: T.ink, lineHeight: 0.88, letterSpacing: "-0.03em", marginBottom: 24 }}>
              FAROUQ<br />
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>HASSAN</span>
            </h1>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 24 }}>
              <div style={{ width: 40, height: 2, background: T.redBright }} />
              <div style={{ fontFamily: T.mono, fontSize: "0.7rem", color: T.redBright, letterSpacing: "0.2em", fontWeight: 700 }}>
                AVAILABLE FOR DEPLOYMENT — JUNE 2026
              </div>
            </div>
          </div>
        </Reveal>

        {/* Classification metadata grid */}
        <Reveal delay={220}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 0, border: `1px solid ${T.rule}`, marginBottom: 32 }}>
            {[
              ["CASE REFERENCE", ME.caseRef],
              ["CLEARANCE LEVEL", ME.clearance],
              ["OPERATIONAL STATUS", "ACTIVE — INTERNSHIP MONTH 5/8"],
              ["COMPILED", ME.compiled],
              ["ANALYST DESIGNATION", ME.codename],
              ["UNIT", "SCC–JAF"],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "12px 16px", borderRight: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}` }}>
                <div style={{ fontFamily: T.mono, fontSize: "0.52rem", color: T.inkGhost, letterSpacing: "0.2em", marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: T.mono, fontSize: "0.72rem", color: T.ink }}>{v}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Summary */}
        <Reveal delay={280}>
          <div style={{ maxWidth: 680, marginBottom: 32 }}>
            <p style={{ fontFamily: T.serif, fontSize: "clamp(0.92rem,2vw,1.1rem)", color: T.inkFaint, lineHeight: 1.9, fontStyle: "italic" }}>
              "This dossier documents the complete operational record of Analyst Farouq Hassan — 23 security operations spanning offensive penetration testing, defensive incident response, digital forensics, cloud security, governance and risk, and applied cryptography. Credentials, active operations, and deployment availability are detailed herein."
            </p>
          </div>
        </Reveal>

        {/* CV downloads — styled as document requests */}
        <Reveal delay={320}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {[["REQUEST FORM — SOC/BLUE TEAM", ME.cvSoc,"CDSA · DETECTION · DFIR"],["REQUEST FORM — OFFENSIVE SECURITY", ME.cvOffensive,"CPTS · CWES · RED TEAM"]].map(([l,u,sub])=>(
              <a key={l} href={u} download
                style={{ display:"flex", flexDirection:"column", gap:3, padding:"10px 18px", border:`1px solid ${T.ink}`, color:T.ink, background:"transparent", fontFamily:T.mono, textDecoration:"none", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=T.ink;e.currentTarget.style.color=T.paper;}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.ink;}}>
                <span style={{ fontSize:"0.66rem", fontWeight:700, letterSpacing:"0.1em" }}>{l}</span>
                <span style={{ fontSize:"0.56rem", opacity:0.5 }}>{sub}</span>
              </a>
            ))}
          </div>
          <div style={{ display:"flex", gap:22, flexWrap:"wrap" }}>
            {[["LINKEDIN",ME.linkedin],["GITHUB",ME.github],["MEDIUM",ME.medium],[`CONTACT: ${ME.email}`,`mailto:${ME.email}`]].map(([l,u])=>(
              <a key={l} href={u} target="_blank" rel="noreferrer"
                style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.inkGhost, textDecoration:"none", letterSpacing:"0.1em", transition:"color 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.color=T.ink}
                onMouseLeave={e=>e.currentTarget.style.color=T.inkGhost}>
                {l} ↗
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Navigate prompt */}
      <Reveal delay={400}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 40, borderTop: `1px solid ${T.rule}` }}>
          <div style={{ fontFamily: T.mono, fontSize: "0.58rem", color: T.inkGhost, letterSpacing: "0.18em" }}>
            CONTENTS: CASE FILES · ACTIVE OPERATIONS · CREDENTIALS · DISPATCHES
          </div>
          <button onClick={() => setTab("files")}
            style={{ marginLeft:"auto", padding:"8px 20px", background:T.ink, color:T.paper, border:"none", fontFamily:T.mono, fontSize:"0.65rem", letterSpacing:"0.14em", cursor:"pointer", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background=T.redBright}
            onMouseLeave={e=>e.currentTarget.style.background=T.ink}>
            OPEN DOSSIER →
          </button>
        </div>
      </Reveal>
    </div>
  );
}

// ── CASE FILE CARD ───────────────────────────────────────────
function CaseCard({ cf }) {
  const [open, setOpen] = useState(false);
  const col = SEV_COL[cf.sev] || T.inkFaint;
  return (
    <div style={{ border: `1px solid ${T.rule}`, borderTop: `3px solid ${col}`, marginBottom: 12, background: T.paper, position: "relative", overflow: "hidden" }}>
      {/* Faint classification watermark */}
      <div style={{ position:"absolute", top:"50%", right:16, transform:"translateY(-50%) rotate(-30deg)", fontFamily:T.mono, fontSize:"1.4rem", fontWeight:700, color:col, opacity:0.04, letterSpacing:"0.2em", pointerEvents:"none", userSelect:"none", whiteSpace:"nowrap" }}>
        {SEV_STAMP[cf.sev]}
      </div>

      <div style={{ padding: "16px 20px", cursor:"pointer" }} onClick={() => setOpen(o => !o)}>
        {/* Header row */}
        <div style={{ display:"flex", justifyContent:"space-between", gap:12, marginBottom:10, flexWrap:"wrap" }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.inkGhost, letterSpacing:"0.1em" }}>{cf.id}</span>
            <span style={{ fontFamily:T.mono, fontSize:"0.55rem", padding:"2px 8px", border:`1px solid ${col}`, color:col, letterSpacing:"0.12em" }}>{SEV_STAMP[cf.sev]}</span>
            <span style={{ fontFamily:T.mono, fontSize:"0.55rem", color:T.inkGhost, letterSpacing:"0.1em" }}>{cf.cat}</span>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.inkGhost }}>{cf.year}</span>
            <span style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.inkGhost }}>{open?"▲":"▼"}</span>
          </div>
        </div>

        <h3 style={{ fontFamily:T.serif, fontSize:"clamp(0.92rem,2vw,1.15rem)", fontWeight:700, color:T.ink, lineHeight:1.25, marginBottom: open?10:0 }}>
          {cf.title}
        </h3>

        {open && (
          <div>
            {/* Synopsis */}
            <div style={{ borderTop:`1px solid ${T.ruleFaint}`, paddingTop:12, marginTop:4 }}>
              <div style={{ fontFamily:T.mono, fontSize:"0.55rem", color:T.inkGhost, letterSpacing:"0.2em", marginBottom:8 }}>SYNOPSIS</div>
              <p style={{ fontFamily:T.sans, fontSize:"0.8rem", color:T.inkFaint, lineHeight:1.85, marginBottom:14 }}>{cf.synopsis}</p>
            </div>

            {/* Two columns: findings + TTPs */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1px 1fr", gap:0, borderTop:`1px solid ${T.ruleFaint}`, paddingTop:12 }} className="cf-cols">
              <div>
                <div style={{ fontFamily:T.mono, fontSize:"0.52rem", color:T.inkGhost, letterSpacing:"0.2em", marginBottom:8 }}>DOCUMENTED FINDINGS</div>
                {cf.findings.map((f,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, fontFamily:T.mono, fontSize:"0.68rem", color:T.inkFaint, padding:"4px 0", borderBottom:`1px solid ${T.ruleFaint}`, lineHeight:1.5 }}>
                    <span style={{ color:col, flexShrink:0 }}>▶</span>{f}
                  </div>
                ))}
              </div>
              <div style={{ width:1, background:T.rule, margin:"0 16px" }} />
              <div>
                <div style={{ fontFamily:T.mono, fontSize:"0.52rem", color:T.inkGhost, letterSpacing:"0.2em", marginBottom:8 }}>ATT&CK / FRAMEWORK REF</div>
                {cf.ttps.map((t,i)=>(
                  <div key={i} style={{ fontFamily:T.mono, fontSize:"0.65rem", color:T.inkFaint, padding:"4px 0", borderBottom:`1px solid ${T.ruleFaint}`, lineHeight:1.5 }}>{t}</div>
                ))}
                {cf.github && (
                  <a href={cf.github} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                    style={{ display:"inline-block", marginTop:10, fontFamily:T.mono, fontSize:"0.62rem", color:T.redBright, textDecoration:"none", borderBottom:`1px solid ${T.redBright}` }}>
                    ↗ SOURCE CODE
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── NAV TABS ─────────────────────────────────────────────────
function NavTabs({ active, setTab }) {
  const tabs = [
    { id:"cover",    label:"COVER" },
    { id:"files",    label:"CASE FILES" },
    { id:"roadmap",  label:"ACTIVE OPERATIONS" },
    { id:"certs",    label:"CLEARANCES" },
    { id:"dispatch", label:"DISPATCHES" },
  ];
  return (
    <div style={{ position:"sticky", top:0, zIndex:500, background:T.paperDark, borderBottom:`2px solid ${T.ink}`, display:"flex", overflowX:"auto" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)}
          style={{ padding:"12px 20px", background: active===t.id ? T.ink : "transparent", border:"none", color: active===t.id ? T.paper : T.inkGhost, fontFamily:T.mono, fontSize:"0.6rem", letterSpacing:"0.18em", cursor:"pointer", transition:"all 0.18s", whiteSpace:"nowrap", borderRight:`1px solid ${T.rule}` }}
          onMouseEnter={e=>{ if(active!==t.id){ e.currentTarget.style.background=T.ruleFaint; e.currentTarget.style.color=T.ink; }}}
          onMouseLeave={e=>{ if(active!==t.id){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.inkGhost; }}}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── CASE FILES PAGE ──────────────────────────────────────────
function CaseFilesPage() {
  const sevs = ["ALL","CRITICAL","HIGH","MEDIUM","LOW"];
  const cats = ["ALL",...new Set(CASE_FILES.map(c=>c.cat))];
  const [sevF, setSevF] = useState("ALL");
  const [catF, setCatF] = useState("ALL");
  const filtered = CASE_FILES.filter(c => (sevF==="ALL"||c.sev===sevF) && (catF==="ALL"||c.cat===catF));

  return (
    <div style={{ padding:"clamp(24px,4vw,56px)" }}>
      <Reveal>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16, marginBottom:28, paddingBottom:20, borderBottom:`1px solid ${T.rule}` }}>
          <div>
            <div style={{ fontFamily:T.mono, fontSize:"0.55rem", color:T.inkGhost, letterSpacing:"0.25em", marginBottom:10 }}>SECTION II — OPERATIONAL CASE FILES</div>
            <h2 style={{ fontFamily:T.serif, fontSize:"clamp(1.8rem,5vw,3.5rem)", fontWeight:700, color:T.ink, letterSpacing:"-0.025em", lineHeight:1 }}>
              {filtered.length} CASE{filtered.length!==1?"S":""} ON RECORD
            </h2>
          </div>
          <div style={{ position:"relative", opacity:0.07 }}>
            <Stamp label="CLASSIFIED" rotate={-6} opacity={1} size="2rem" />
          </div>
        </div>
      </Reveal>

      {/* Filters */}
      <Reveal delay={60}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
          {sevs.map(s=>(
            <button key={s} onClick={()=>setSevF(s)}
              style={{ padding:"3px 12px", background: sevF===s?(SEV_COL[s]||T.ink):"transparent", border:`1px solid ${sevF===s?(SEV_COL[s]||T.ink):T.rule}`, color: sevF===s?T.paper:(SEV_COL[s]||T.inkFaint), fontFamily:T.mono, fontSize:"0.56rem", letterSpacing:"0.1em", cursor:"pointer", transition:"all 0.18s" }}>
              {s==="ALL"?"ALL CLASSIFICATIONS":SEV_STAMP[s]||s}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:28 }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCatF(c)}
              style={{ padding:"3px 10px", background: catF===c?T.ink:"transparent", border:`1px solid ${catF===c?T.ink:T.rule}`, color: catF===c?T.paper:T.inkGhost, fontFamily:T.mono, fontSize:"0.54rem", letterSpacing:"0.08em", cursor:"pointer", transition:"all 0.18s" }}>
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      {filtered.map((cf, i) => (
        <Reveal key={cf.id} delay={Math.min(i*20,300)}>
          <CaseCard cf={cf} />
        </Reveal>
      ))}
    </div>
  );
}

// ── ROADMAP PAGE ─────────────────────────────────────────────
function RoadmapPage() {
  const [openPhase, setOpenPhase] = useState("Phase 1");
  const [openWeek, setOpenWeek] = useState(null);
  return (
    <div style={{ padding:"clamp(24px,4vw,56px)" }}>
      <Reveal>
        <div style={{ marginBottom:32, paddingBottom:20, borderBottom:`1px solid ${T.rule}` }}>
          <div style={{ fontFamily:T.mono, fontSize:"0.55rem", color:T.inkGhost, letterSpacing:"0.25em", marginBottom:10 }}>SECTION III — ACTIVE INVESTIGATION ROADMAP</div>
          <h2 style={{ fontFamily:T.serif, fontSize:"clamp(1.8rem,5vw,3.5rem)", fontWeight:700, color:T.ink, letterSpacing:"-0.025em", lineHeight:1, marginBottom:16 }}>
            90-DAY DETECTION<br />ENGINEERING OPERATION
          </h2>
          <p style={{ fontFamily:T.serif, fontSize:"0.95rem", fontStyle:"italic", color:T.inkFaint, lineHeight:1.9, maxWidth:620, borderLeft:`3px solid ${T.rule}`, paddingLeft:18 }}>
            Objective: Become a Detection Engineer and Active Directory Threat Hunter. Construct 15–20 production-grade detection rules, a Domain Compromise Detection Framework, and a fully documented public GitHub portfolio within 90 days.
          </p>
        </div>
      </Reveal>

      {ROADMAP.map((ph, pi) => (
        <Reveal key={ph.phase} delay={pi*60}>
          <div style={{ border:`1px solid ${ph.status.includes("ACTIVE")?T.ink:T.rule}`, marginBottom:8, background: ph.status.includes("ACTIVE")?"rgba(26,22,18,0.02)":T.paper }}>
            <div onClick={()=>setOpenPhase(openPhase===ph.phase?null:ph.phase)}
              style={{ padding:"14px 20px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
                {ph.status.includes("ACTIVE") && (
                  <div style={{ padding:"2px 8px", background:T.ink, color:T.paper, fontFamily:T.mono, fontSize:"0.52rem", letterSpacing:"0.14em" }}>ACTIVE</div>
                )}
                <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.inkGhost, letterSpacing:"0.1em" }}>{ph.ref} · {ph.days}</span>
                <span style={{ fontFamily:T.serif, fontSize:"clamp(0.85rem,1.8vw,1.1rem)", fontWeight:700, color:T.ink }}>{ph.title}</span>
              </div>
              <span style={{ fontFamily:T.mono, fontSize:"0.65rem", color:T.inkGhost }}>{openPhase===ph.phase?"▲":"▼"}</span>
            </div>

            {openPhase===ph.phase&&(
              <div style={{ borderTop:`1px solid ${T.rule}` }}>
                <div style={{ padding:"10px 20px 14px", borderBottom:`1px solid ${T.ruleFaint}`, fontFamily:T.serif, fontStyle:"italic", fontSize:"0.82rem", color:T.inkFaint, lineHeight:1.7 }}>
                  OBJECTIVE: {ph.objective}
                </div>
                {ph.weeks.map(w=>(
                  <div key={w.w} style={{ borderBottom:`1px solid ${T.ruleFaint}` }}>
                    <div onClick={()=>setOpenWeek(openWeek===w.w?null:w.w)}
                      style={{ padding:"9px 20px 9px 32px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"background 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(26,22,18,0.03)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                        <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.inkGhost, minWidth:52 }}>{w.w}</span>
                        <span style={{ fontFamily:T.mono, fontSize:"0.72rem", color:T.inkFaint }}>{w.t}</span>
                      </div>
                      <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.inkGhost }}>{openWeek===w.w?"▲":"▼"}</span>
                    </div>
                    {openWeek===w.w&&(
                      <div style={{ padding:"8px 20px 14px 52px" }}>
                        {w.items.map((item,i)=>(
                          <div key={i} style={{ display:"flex", gap:10, fontFamily:T.mono, fontSize:"0.68rem", color:T.inkFaint, padding:"4px 0", borderBottom:`1px solid ${T.ruleFaint}`, lineHeight:1.5 }}>
                            <span style={{ color:T.redBright, flexShrink:0 }}>→</span>{item}
                          </div>
                        ))}
                        <div style={{ marginTop:10, padding:"8px 12px", background:T.paperDark, border:`1px solid ${T.rule}`, fontFamily:T.mono, fontSize:"0.62rem", color:T.inkFaint, lineHeight:1.5 }}>
                          DELIVERABLE: {w.deliverable}
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
    </div>
  );
}

// ── CLEARANCES PAGE ──────────────────────────────────────────
function ClearancesPage() {
  return (
    <div style={{ padding:"clamp(24px,4vw,56px)" }}>
      <Reveal>
        <div style={{ marginBottom:32, paddingBottom:20, borderBottom:`1px solid ${T.rule}`, display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontFamily:T.mono, fontSize:"0.55rem", color:T.inkGhost, letterSpacing:"0.25em", marginBottom:10 }}>SECTION IV — CREDENTIALS & CLEARANCE REGISTRY</div>
            <h2 style={{ fontFamily:T.serif, fontSize:"clamp(1.8rem,5vw,3.5rem)", fontWeight:700, color:T.ink, letterSpacing:"-0.025em", lineHeight:1 }}>
              VERIFIED<br />CLEARANCES
            </h2>
          </div>
          <div style={{ opacity:0.07 }}>
            <Stamp label="VERIFIED" rotate={6} opacity={1} size="2rem" />
          </div>
        </div>
      </Reveal>

      {[{g:"earned",l:"SECTION A — ACTIVE CLEARANCES"},{g:"active",l:"SECTION B — CLEARANCES UNDER ACQUISITION"},{g:"queued",l:"SECTION C — SCHEDULED ACQUISITIONS"}].map(({g,l})=>(
        <Reveal key={g}>
          <section style={{ marginBottom:36 }}>
            <div style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.inkGhost, letterSpacing:"0.22em", marginBottom:12, paddingBottom:6, borderBottom:`1px solid ${T.rule}` }}>{l}</div>
            {CERTS.filter(c=>c.status===g).map(c=>(
              <div key={c.id} onClick={()=>c.url&&window.open(c.url,"_blank")}
                style={{ display:"flex", gap:18, padding:"14px 16px", marginBottom:6, border:`1px solid ${T.rule}`, borderLeft:`3px solid ${g==="earned"?T.ink:g==="active"?"#7A4500":T.rule}`, cursor:c.url?"pointer":"default", transition:"background 0.18s", background:T.paper }}
                onMouseEnter={e=>{if(c.url){e.currentTarget.style.background=T.paperDark;}}}
                onMouseLeave={e=>e.currentTarget.style.background=T.paper}>
                <div style={{ fontFamily:T.serif, fontSize:"1.2rem", fontWeight:700, color:g==="earned"?T.ink:g==="active"?"#7A4500":"#999", minWidth:56, flexShrink:0, lineHeight:1 }}>{c.id}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:T.mono, fontSize:"0.72rem", color:T.ink, marginBottom:3 }}>{c.full}</div>
                  <div style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.inkGhost, marginBottom: c.status==="active"?6:0 }}>{c.issuer} · {c.year}</div>
                  {c.status==="active"&&<div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ flex:1, height:2, background:T.rule }}>
                      <div style={{ width:`${c.pct}%`, height:"100%", background:T.inkFaint }} />
                    </div>
                    <span style={{ fontFamily:T.mono, fontSize:"0.6rem", color:T.inkFaint, flexShrink:0 }}>{c.pct}% COMPLETE</span>
                  </div>}
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.inkGhost, letterSpacing:"0.1em", marginBottom:3 }}>{c.clearance}</div>
                  {c.url&&<span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.redBright }}>VERIFY ↗</span>}
                </div>
              </div>
            ))}
          </section>
        </Reveal>
      ))}
    </div>
  );
}

// ── DISPATCHES PAGE ──────────────────────────────────────────
function DispatchesPage() {
  return (
    <div style={{ padding:"clamp(24px,4vw,56px)" }}>
      <Reveal>
        <div style={{ marginBottom:32, paddingBottom:20, borderBottom:`1px solid ${T.rule}` }}>
          <div style={{ fontFamily:T.mono, fontSize:"0.55rem", color:T.inkGhost, letterSpacing:"0.25em", marginBottom:10 }}>SECTION V — FIELD DISPATCHES & INTELLIGENCE REPORTS</div>
          <h2 style={{ fontFamily:T.serif, fontSize:"clamp(1.8rem,5vw,3.5rem)", fontWeight:700, color:T.ink, letterSpacing:"-0.025em", lineHeight:1 }}>
            PUBLISHED<br />DISPATCHES
          </h2>
        </div>
      </Reveal>

      {WRITEUPS.map((w,i)=>(
        <Reveal key={w.ref} delay={i*70}>
          <div onClick={()=>w.status==="PUBLISHED"&&w.url&&window.open(w.url,"_blank")}
            style={{ padding:"22px 24px", border:`1px solid ${T.rule}`, marginBottom:10, opacity:w.status==="PUBLISHED"?1:0.5, cursor:w.status==="PUBLISHED"?"pointer":"default", transition:"background 0.18s", background:T.paper, position:"relative" }}
            onMouseEnter={e=>{if(w.status==="PUBLISHED")e.currentTarget.style.background=T.paperDark;}}
            onMouseLeave={e=>e.currentTarget.style.background=T.paper}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:16, marginBottom:10, flexWrap:"wrap" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.inkGhost, letterSpacing:"0.1em" }}>{w.ref}</span>
                {w.tags.map(t=><span key={t} style={{ fontFamily:T.mono, fontSize:"0.54rem", padding:"2px 8px", border:`1px solid ${T.rule}`, color:T.inkGhost }}>{t}</span>)}
                <span style={{ fontFamily:T.mono, fontSize:"0.54rem", padding:"2px 8px", background: w.status==="PUBLISHED"?T.ink:T.ruleFaint, color: w.status==="PUBLISHED"?T.paper:T.inkGhost, letterSpacing:"0.1em" }}>{w.status}</span>
              </div>
              <span style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.inkGhost }}>{w.date}</span>
            </div>
            <h3 style={{ fontFamily:T.serif, fontSize:"clamp(1rem,2.5vw,1.4rem)", fontWeight:700, color:T.ink, lineHeight:1.2, marginBottom:8 }}>{w.title}</h3>
            <p style={{ fontFamily:T.sans, fontSize:"0.8rem", color:T.inkFaint, lineHeight:1.8 }}>{w.synopsis}</p>
            {w.status==="PUBLISHED"&&<div style={{ marginTop:12, fontFamily:T.mono, fontSize:"0.6rem", color:T.redBright }}>READ DISPATCH ↗</div>}
          </div>
        </Reveal>
      ))}

      {/* Closing annotation */}
      <Reveal delay={300}>
        <div style={{ marginTop:32, padding:"18px 20px", border:`1px solid ${T.ruleFaint}`, textAlign:"center" }}>
          <div style={{ fontFamily:T.mono, fontSize:"0.58rem", color:T.inkGhost, letterSpacing:"0.15em", lineHeight:1.9 }}>
            ADDITIONAL DISPATCHES IN PREPARATION<br />
            PUBLISHED REGULARLY VIA MEDIUM PLATFORM<br />
            <a href={ME.medium} target="_blank" rel="noreferrer" style={{ color:T.redBright, textDecoration:"none" }}>{ME.medium} ↗</a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("cover");
  const pages = { cover:<Cover setTab={setTab} />, files:<CaseFilesPage />, roadmap:<RoadmapPage />, certs:<ClearancesPage />, dispatch:<DispatchesPage /> };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { font-size:16px; }
        body { background:${T.paper}; color:${T.ink}; min-height:100vh; -webkit-font-smoothing:antialiased; }
        ::selection { background:${T.ink}; color:${T.paper}; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:${T.paperDark}; }
        ::-webkit-scrollbar-thumb { background:${T.inkGhost}; }
        @keyframes pageIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .cf-cols { grid-template-columns:1fr 1px 1fr; }
        @media(max-width:600px) { .cf-cols { grid-template-columns:1fr !important; } }
      `}</style>

      {/* Paper texture overlay */}
      <div style={{ position:"fixed", inset:0, background:`repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(26,22,18,0.018) 28px, rgba(26,22,18,0.018) 29px)`, pointerEvents:"none", zIndex:1 }} />

      <div style={{ position:"relative", zIndex:2, maxWidth:960, margin:"0 auto" }}>
        {tab !== "cover" && <NavTabs active={tab} setTab={setTab} />}

        <div key={tab} style={{ animation:"pageIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
          {pages[tab]}
        </div>

        {/* Document footer */}
        <div style={{ borderTop:`1px solid ${T.rule}`, padding:"20px clamp(24px,4vw,56px)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.inkGhost, letterSpacing:"0.15em" }}>{ME.caseRef} · PAGE {tab.toUpperCase()}</div>
          <div style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.inkGhost, letterSpacing:"0.15em" }}>FAROUQHASSAN.DEV · {new Date().getFullYear()}</div>
          <div style={{ display:"flex", gap:16 }}>
            {[["LINKEDIN",ME.linkedin],["GITHUB",ME.github],["MEDIUM",ME.medium]].map(([l,u])=>(
              <a key={l} href={u} target="_blank" rel="noreferrer"
                style={{ fontFamily:T.mono, fontSize:"0.56rem", color:T.inkGhost, textDecoration:"none", letterSpacing:"0.1em", transition:"color 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.color=T.ink}
                onMouseLeave={e=>e.currentTarget.style.color=T.inkGhost}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
