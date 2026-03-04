"use client";
import { useState, useEffect, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────
const PROFILE = {
  name: "Farouq Hassan",
  location: "Amman, Jordan",
  email: "12farouq12@gmail.com",
  linkedin: "https://www.linkedin.com/in/FarouqHassan02",
  github: "https://github.com/farouq7assan0o",
  medium: "https://medium.com/@12farouq12",
  htb: "https://app.hackthebox.com/users/farouq7assan0o",
  cvSoc: "/Farouq_Hassan_Junior_SOC_Analyst_CV.pdf",
  cvOffensive: "/Farouq_Hassan_CV_Offensive.pdf",
  tagline: "I find what's broken before the adversary does.",
  bio: "Cybersecurity student at HTU, graduating June 2026. Currently 5 months into an 8-month internship at the Special Communications Commission – Jordan Armed Forces, doing real defensive validation and security assurance. Studying the offensive and defensive tracks simultaneously: CWES 70%, CPTS 45%, CDSA already done. I document everything publicly — no recycled theory, just real work.",
  current: [
    "Internship @ SCC-JAF — month 5 of 8",
    "HTB CWES — 70% complete",
    "HTB CPTS — 45% complete",
    "90-Day Detection Engineering roadmap (active)",
    "Weekly HTB writeups + LinkedIn posts",
  ],
  testimonial: {
    quote: "Farouq approaches security with an uncommon mix of technical depth and structured thinking. He doesn't just find the vulnerability — he maps it, documents it, and explains the blast radius. That kind of analyst is rare at any experience level.",
    author: "Supervisor, SCC–Jordan Armed Forces",
    note: "(placeholder — update with real quote)",
  },
};

const STATS = [
  { value: 22, suffix: "+", label: "Projects completed" },
  { value: 4,  suffix: "",  label: "Certifications earned" },
  { value: 8,  suffix: "mo", label: "Gov. internship" },
  { value: 300, suffix: "+", label: "NCSCJO competitors" },
];

const SKILLS = {
  "Offensive": [
    { name:"Metasploit",        level:90 }, { name:"Burp Suite",       level:85 },
    { name:"Nmap / Nessus",     level:90 }, { name:"SQLmap",           level:85 },
    { name:"Hydra",             level:80 }, { name:"MSFvenom",         level:80 },
    { name:"IDA Free / x32dbg", level:75 }, { name:"Volatility 3",    level:80 },
  ],
  "Defensive / SOC": [
    { name:"Splunk / SIEM",   level:85 }, { name:"Wireshark",        level:90 },
    { name:"MITRE ATT&CK",    level:90 }, { name:"MITRE D3FEND",     level:80 },
    { name:"Sigma Rules",     level:75 }, { name:"NIST IR",          level:85 },
    { name:"Sysmon / EID",    level:80 }, { name:"FTK Imager",       level:80 },
  ],
  "GRC / Governance": [
    { name:"ISO 27001/27005",  level:85 }, { name:"NIST 800-30",     level:85 },
    { name:"FAIR Risk Model",  level:80 }, { name:"PCI DSS",         level:80 },
    { name:"PDPL (Jordan)",    level:85 }, { name:"ISO 27014",       level:80 },
    { name:"COBIT 2019",       level:75 }, { name:"BIA / RTO/RPO",   level:85 },
  ],
  "Dev / Cloud": [
    { name:"Python",               level:80 }, { name:"Java",             level:75 },
    { name:"AWS S3 / IAM",         level:75 }, { name:"Semgrep SAST",     level:80 },
    { name:"GitHub Actions",       level:75 }, { name:"Linux CLI",        level:90 },
    { name:"Cisco / Packet Tracer",level:80 }, { name:"Solidity",         level:60 },
  ],
};

const SKILL_COLORS = {
  "Offensive":        "#E05555",
  "Defensive / SOC":  "#22C97A",
  "GRC / Governance": "#F0A830",
  "Dev / Cloud":      "#4AABDF",
};

const CERTS = [
  { id:"cdsa",    name:"CDSA",  full:"Certified Defensive Security Analyst",    issuer:"Hack The Box", year:"2025", status:"earned",      pct:100, badgeUrl:"https://www.credly.com/earner/earned/badge/9385aaf3-d974-43d8-8144-0dca4b70746b", description:"Enterprise SOC investigations, DFIR, SIEM threat hunting, Active Directory attack detection." },
  { id:"cwse",    name:"CWSE",  full:"Certified Web Security Expert",           issuer:"Hackviser",    year:"2025", status:"earned",      pct:100, badgeUrl:"https://hackviser.com/verify?id=HV-CWSE-D15I7TON",              description:"Web application security testing aligned with OWASP Top 10, bug hunting methodology." },
  { id:"capt",    name:"CAPT",  full:"Certified Associate Penetration Tester",  issuer:"Hackviser",    year:"2025", status:"earned",      pct:100, badgeUrl:"https://hackviser.com/verify?id=HV-CAPT-T3O8P3JO",            description:"Penetration testing fundamentals across web, network, and infrastructure environments." },
  { id:"nca",     name:"NCA",   full:"Nutanix Certified Associate v6",          issuer:"Nutanix",      year:"2025", status:"earned",      pct:100, badgeUrl:"https://www.credly.com/earner/earned/badge/9c45a9a4-34b0-46b8-819f-25b6b053dfdd", description:"Hyperconverged infrastructure, cloud architecture, and virtualization fundamentals." },
  { id:"cwes",    name:"CWES",  full:"Certified Web Exploitation Specialist",   issuer:"Hack The Box", year:"2026", status:"in-progress", pct:70,  badgeUrl:null, description:"Advanced web exploitation, chaining vulnerabilities, and real-world offensive attack paths." },
  { id:"cpts",    name:"CPTS",  full:"Certified Penetration Testing Specialist",issuer:"Hack The Box", year:"2026", status:"in-progress", pct:45,  badgeUrl:null, description:"Full-scope penetration testing, AD attacks, privilege escalation, and professional reporting." },
  { id:"secplus", name:"Sec+",  full:"CompTIA Security+ SY0-701",               issuer:"CompTIA",      year:"2026", status:"planned",     pct:0,   badgeUrl:null, description:"Industry-standard baseline for security concepts, threats, and risk management." },
  { id:"ccna",    name:"CCNA",  full:"Cisco CCNA 200-301",                      issuer:"Cisco",        year:"2026", status:"planned",     pct:0,   badgeUrl:null, description:"Network fundamentals, routing, switching, and enterprise infrastructure." },
];

const WRITEUPS = [
  { id:1, title:"HTB CDSA — What It Really Takes to Pass", date:"Feb 2026", platform:"Medium", collection:"Journey", tags:["CDSA","Blue Team","Journey"], excerpt:"An honest account of what the CDSA exam demands — the lab hours, the mental pressure, and what actually prepared me to pass. No fluff.", url:"https://medium.com/@12farouq12/htb-cdsa-2025-what-it-really-takes-to-pass-the-certified-defensive-security-analyst-exam-5215213392cc", published:true },
  { id:2, title:"HTB Machine Writeup #1 — Coming Soon", date:"Mar 2026", platform:"HTB", collection:"HTB Machines", tags:["HTB","Linux","Privilege Escalation"], excerpt:"First HTB machine writeup. Full walkthrough from recon to root.", url:null, published:false },
  { id:3, title:"Detection Engineering: Writing Real Sigma Rules", date:"Coming", platform:"Blog", collection:"Detection Engineering Series", tags:["Detection Engineering","Sigma","Blue Team"], excerpt:"Phase 1 deliverable — building real detections for AD attack paths with MITRE mapping and false positive tuning.", url:null, published:false },
];

const ROADMAPS = [
  {
    id:"rm1", name:"90-Day Detection Engineering",
    description:"Become a Detection Engineer + AD Threat Hunter. Build 15–20 production-grade rules, a Domain Compromise Detection Framework, and a public GitHub portfolio.",
    phases:[
      { id:"p1", phase:"Phase 1", days:"Days 1–30", title:"Detection Engineering Fundamentals", status:"active",
        goal:"Build high-quality detections for real AD attack paths. Deliver 15–20 production-grade rules.",
        weeks:[
          { id:"w1", week:"Week 1", title:"Lab Foundation", items:["DC + 2 Win10 clients + Kali + Splunk","Sysmon on all endpoints","PowerShell Script Block + Module Logging","Advanced AD auditing (4662, 4742, 4738, 4672)"], deliverable:"Lab architecture diagram + logging baseline", writeupUrl:null },
          { id:"w2", week:"Week 2", title:"Initial Access & Execution", items:["Phishing macro → PowerShell","Encoded PowerShell / IEX","Office spawning cmd/powershell"], deliverable:"5 detection rules with MITRE mapping", writeupUrl:null },
          { id:"w3", week:"Week 3", title:"Privilege Escalation & Persistence", items:["UAC bypass","Scheduled tasks (Event 4698)","Registry run keys","Service creation"], deliverable:"6 detection rules + alert logic", writeupUrl:null },
          { id:"w4", week:"Week 4", title:"Credential Access", items:["Mimikatz + LSASS dump (Sysmon ID 10)","Kerberoasting (4769 w/ RC4)","Pass-the-Hash","Logon Type 9 / abnormal 4672"], deliverable:"Credential Theft Detection Pack", writeupUrl:null },
        ],
      },
      { id:"p2", phase:"Phase 2", days:"Days 31–60", title:"AD Threat Hunting", status:"upcoming",
        goal:"Build a Domain Compromise Detection Framework. Hunt for patterns, not just alerts.",
        weeks:[
          { id:"w5", week:"Week 5", title:"Lateral Movement", items:["SMB / PsExec / WMI / WinRM detection","ADMIN$ usage + named pipe anomalies","Event 4624 Type 3 from workstation to DC"], deliverable:"Lateral movement detection rules", writeupUrl:null },
          { id:"w6", week:"Week 6", title:"DCSync & DCShadow", items:["DCSync (4662 replication GUIDs)","DCShadow (4742 / 4738 anomalies)","AD object modification tracking"], deliverable:"Domain Compromise Detection Framework", writeupUrl:null },
          { id:"w7", week:"Week 7", title:"Threat Hunting Framework", items:["Rare logon types","Rare parent-child processes","Rare LDAP burst activity","Baseline vs anomaly docs"], deliverable:"10 threat hunting queries", writeupUrl:null },
          { id:"w8", week:"Week 8", title:"SIEM Engineering", items:["Field normalization","Multi-stage correlation rules","Risk-based alerting + noise reduction"], deliverable:"3 multi-stage correlation rules", writeupUrl:null },
        ],
      },
      { id:"p3", phase:"Phase 3", days:"Days 61–90", title:"Automation & Portfolio", status:"upcoming",
        goal:"Build production-ready SOAR, run full purple team simulation, publish everything publicly.",
        weeks:[
          { id:"w9",  week:"Week 9",  title:"SOAR & Case Management", items:["Deploy TheHive + Shuffle","Alert → Case auto-creation","IP enrichment + auto-tag MITRE"], deliverable:"Working SOAR pipeline", writeupUrl:null },
          { id:"w10", week:"Week 10", title:"Purple Team Simulation", items:["Day 1: Phishing","Day 2: Kerberoast","Day 3: Lateral Movement","Day 4: DCSync"], deliverable:"Detection gap analysis report", writeupUrl:null },
          { id:"w11", week:"Week 11", title:"Detection Portfolio", items:["GitHub repo with all detection rules","Write-ups per attack chain","Red vs Blue test results"], deliverable:"Public portfolio on GitHub", writeupUrl:null },
          { id:"w12", week:"Week 12", title:"Enterprise Readiness", items:["Windows hardening: LAPS, Credential Guard, Protected Users","Tiered AD model / ESAE","Prevention mindset framework"], deliverable:"Enterprise hardening checklist", writeupUrl:null },
        ],
      },
    ],
  },
];

const PROJECTS = [
  { id:"animeblast",   title:"AnimeBlast — Full-Scope Penetration Test",            category:"pentest",    year:"2024", tags:["Buffer Overflow","Metasploit","SQLi","XSS","RCE","Pivoting"],                     summary:"Full-scope pentest against two virtual targets. Custom Python BoF exploit (EIP at 1036 bytes), bypassed DEP/ASLR/SafeSEH, pivoted through a compromised host via SOCKS proxy, then exploited UNION SQLi, XSS session hijack, PHP shell upload → RCE. 10 flags.",          highlights:["Custom BoF — EIP @ 1036 bytes","DEP + ASLR + SafeSEH bypass","Network pivot via Metasploit SOCKS","UNION SQLi → credentials dumped","PHP shell → RCE → admin user created","10 flags captured"],  githubUrl:"https://github.com/farouq7assan0o/Penetration-Testing-AnimeBlast-Attack-Simulation" },
  { id:"cyberblast",   title:"CyberBlast — Ethical Hacking Assessment",             category:"pentest",    year:"2024", tags:["Nessus","SQLmap","Hydra","EternalBlue","Kill Chain"],                           summary:"Full-cycle ethical hacking engagement. Nessus scan (20 findings), Wireshark credential capture, SQLmap DB dump, XSS session hijack, command injection, EternalBlue exploitation with Meterpreter post-exploitation.",                                                          highlights:["Nessus: 20 vulns (BlueKeep, TLS 1.0, PHP 5.6)","EternalBlue → Meterpreter → credential dump","UNION SQLi + XSS + RCE + command injection","Custom MSFvenom reverse shell payload"],          githubUrl:"https://github.com/farouq7assan0o/Ethical-Hacking" },
  { id:"sqli-redteam", title:"SQLi Assessment + Banking Red Team Plan",             category:"pentest",    year:"2025", tags:["SQLi","Auth Bypass","UNION injection","Kill Chain","ROE"],                      summary:"Manual SQLi exploitation (auth bypass, UNION credential extraction), full Rules of Engagement for a banking red team, and a complete Cyber Kill Chain attack plan from OSINT through C2 and exfiltration.",                                                                    highlights:["Auth bypass via SQL injection","UNION SELECT credential extraction","Banking ROE: scope, social engineering limits","Kill Chain: OSINT → weaponize → phish → persist → C2 → exfil"],              githubUrl:"https://github.com/farouq7assan0o/Security-Assessment-Red-Team-Take-Home-Assignment" },
  { id:"ftp-brute",    title:"FTP Enumeration & Brute Force Lab",                   category:"pentest",    year:"2025", tags:["Hydra","FTP","Brute Force","Enumeration"],                                       summary:"Enumerated FTP, confirmed anonymous access misconfiguration, brute-forced credentials using Hydra against 100k NCSC password list. Documented hardening: Fail2Ban, SFTP migration, firewall ACLs.",              highlights:["Anonymous FTP access confirmed","Hydra + 100k NCSC wordlist","No rate limiting — zero lockout resistance","Remediation: Fail2Ban + disable anon + SFTP"],                                           githubUrl:"https://github.com/farouq7assan0o/FTP-Enumeration-Brute-Force-Attack" },
  { id:"privesc-lab",  title:"Linux File Transfer & Privilege Escalation",          category:"pentest",    year:"2025", tags:["LinPEAS","Kernel Exploit","Netcat","SCP","Searchsploit"],                        summary:"Demonstrated four file transfer techniques, enumerated with LinPEAS, identified kernel 2.6.32, found Exploit-DB 18411, compiled and executed local privilege escalation.",                                          highlights:["Kernel 2.6.32 identified via uname -a","searchsploit → Exploit-DB 18411","BoF LPE compiled + executed on target","4 transfer methods demonstrated"],                                               githubUrl:"https://github.com/farouq7assan0o/File-Transfer-Techniques-Privilege-Escalation" },
  { id:"semgrep",      title:"Semgrep SAST in GitHub Actions (Juice Shop)",         category:"pentest",    year:"2025", tags:["Semgrep","SAST","GitHub Actions","DevSecOps","CI/CD Security"],                 summary:"Integrated Semgrep into GitHub Actions CI/CD for OWASP Juice Shop. Pipeline auto-scans every push — 1015 files, 1062 rules, 41 findings. Detected direct SQL string concatenation in Sequelize queries.",    highlights:["41 findings across 1015 files","Sequelize SQLi: criteria directly concatenated","YAML workflow triggers on every push","Parameterized query remediation documented"],                             githubUrl:"https://github.com/farouq7assan0o/Integrating-Semgrep-SAST-into-GitHub-Actions-Juice-Shop-" },
  { id:"malware",      title:"Malware Analysis — BackdoorBeacon.exe",               category:"pentest",    year:"2024", tags:["IDA Free","x32dbg","Wireshark","UPX","Reverse Engineering"],                   summary:"Full lifecycle RE of a UPX-packed backdoor. Static: TLS callbacks, anti-debug checks, hardcoded C2 IP, HKCU Run persistence. Dynamic: patched C2 IP, confirmed SYN beaconing. SSDT/IDT clean.",               highlights:["UPX unpacking → PE section analysis","TLS callback + IsDebuggerPresent NOP patch","C2 IP patched to 127.0.0.1","Registry persistence: HKCU\\Run\\Updater","SSDT/IDT clean — no kernel hooking"],   githubUrl:"https://github.com/farouq7assan0o/Secure-Systems-Malware-Analysis-of-BackdoorBeacon.exe" },
  { id:"pcap-memory",  title:"PCAP + Memory Forensics Investigation",               category:"soc",        year:"2025", tags:["Wireshark","Volatility 3","DNS Tunneling","HTTP C2","Fileless Malware"],         summary:"PCAP triage: HTTP C2 beaconing via /v1/checkin, DNS TXT exfiltration with Base64. Memory forensics (Volatility 3): fileless PowerShell loader, rogue process, active C2 connection.",                          highlights:["HTTP C2: /v1/checkin sequential polling","DNS TXT exfil with Base64 encoded payload","Volatility: RWX shellcode injection via malfind","Timeline correlated: network + memory"],                    githubUrl:"https://github.com/farouq7assan0o/Network-Memory-Forensics-Investigation" },
  { id:"threat-intel", title:"Threat Intelligence — APT29 & Lumma Stealer",        category:"soc",        year:"2025", tags:["MITRE ATT&CK","ATT&CK Navigator","OSINT","APT29 / NOBELIUM","Lumma Stealer"],   summary:"Mapped APT29 SolarWinds and USAID campaigns to ATT&CK with impact scoring. Built Navigator JSON layers. Analyzed Lumma Stealer IOCs. Cross-campaign comparison: nation-state espionage vs cybercrime.",         highlights:["APT29: T1195.002 supply chain — High impact","T1003.001 LSASS dump + T1550.001 token abuse: High","Lumma: T1555 credential harvesting","CISA AA20-352A + Mandiant SUNBURST sourced"],            githubUrl:"https://github.com/farouq7assan0o/Threat-Intelligence-Analysis-MITRE-ATT-CK-Mapping" },
  { id:"ir-playbooks", title:"IR Playbooks — Clinic, Ransomware, Supply Chain",    category:"soc",        year:"2025", tags:["IR Planning","ATT&CK → D3FEND","Ransomware","NIST IR","Executive Comms"],       summary:"Three complete IR playbooks: clinic malware, CityWorks ransomware (decision tree), and Bazaarjo supply-chain breach. NIST IR mapping, ATT&CK → D3FEND. All include exec comms and closure criteria.",           highlights:["VLAN ACL: balanced speed + evidence preservation","Ransomware decision tree: pre-impact vs ongoing","D3FEND: FIDO2 MFA breaks Lumma credential chain","All playbooks: exec update + closure criteria"], githubUrl:"https://github.com/farouq7assan0o/Incident-Response-Planning-ATT-CK-D3FEND-Mapping" },
  { id:"forensics",    title:"Digital Forensics — BlackEagle Investigation",        category:"soc",        year:"2024", tags:["FTK Imager","HxD","NTFS Recovery","Steganography","Chain of Custody"],          summary:"Full forensic investigation of a damaged USB and suspect PC. Manually recovered NTFS mirror via HxD, extracted hidden DOCX inside PNG (steganography), decoded concealed text. Hash verified at every stage.",    highlights:["NTFS manual recovery via HxD hex editor","Steganography: DOCX embedded inside PNG","Hidden message decoded — planned meeting details","Hash verified before + after imaging"],                      githubUrl:"https://github.com/farouq7assan0o/Digital-Forensics-Investigation" },
  { id:"airline",      title:"Secure Airline Check-in System",                      category:"soc",        year:"2024", tags:["Java","SHA-256","JUnit","Fuzz Testing","RBAC"],                                 summary:"Java airline management system: SHA-256 + salt hashing, brute-force lockout after 3 failures, RBAC with 4 roles, centralized audit logger, JUnit suite with fuzz testing up to 100k attempts, PMD SAST.",       highlights:["SHA-256 + salt hashing","Lockout after 3 failures","RBAC: 4 strictly separated roles","Fuzz tested: 1k → 10k → 100k attempts","PMD SAST integrated"],                                              githubUrl:"https://github.com/farouq7assan0o/SecureCoding" },
  { id:"otp-s3",       title:"Secure OTP Data Retrieval System",                    category:"cloud",      year:"2025", tags:["S3 Security","OTP Hardening","OWASP A01/A07","IAM","Presigned URLs"],           summary:"Security design review of an OTP-based S3 system. Found and fixed 4 critical vulns: OTP in API response, no expiry, no rate limiting, predictable S3 path.",                                                   highlights:["OTP in API response → removed","Expiry: 5-min window + single-use","Rate limit: MAX_ATTEMPTS=5","S3: uuid4() + private bucket + presigned URL (600s)"],                                           githubUrl:"https://github.com/farouq7assan0o/Secure-OTP-Based-Historical-Data-Retrieval-System" },
  { id:"apache-ssh",   title:"Apache & SSH Hardening (CIS-Aligned)",                category:"cloud",      year:"2025", tags:["Apache 2.4","CIS Benchmark","SSH Hardening","Docker","Defense-in-Depth"],       summary:"Apache audit: 5 misconfigs (version disclosure, TRACE, /server-status public, directory listing). CIS 2.2–3.5 applied. SSH: disabled root login + password auth, key-only, removed weak ciphers.",            highlights:["Apache: 5 CIS findings fixed","ServerTokens Prod + TraceEnable Off","/server-status → 403 externally","SSH: key-only, no root, chacha20+aes256-gcm only"],                                         githubUrl:"https://github.com/farouq7assan0o/Web-Server-SSH-Hardening-CIS-Aligned-" },
  { id:"network",      title:"Enterprise Network Security Design",                   category:"cloud",      year:"2023", tags:["Cisco","IPsec VPN","OSPF","ASA Firewall","VLAN","ACL"],                          summary:"Multi-site network across 5 locations. IPsec VPN (AES+SHA), ASA firewall with DMZ and NAT, full-mesh OSPF routing, VLAN segmentation, port security, AAA + SSH-only access.",                                  highlights:["IPsec VPN: AES + SHA + ISAKMP","ASA: DMZ + NAT + HTTPS-only external","Full-mesh WAN: 5 routers","VLAN isolation per department"],                                                               githubUrl:"https://github.com/farouq7assan0o/Operation-System" },
  { id:"governance",   title:"BazaarJo Governance Gap Assessment",                   category:"compliance", year:"2025", tags:["ISO 27014","PDPL","PCI DSS","SoD","Board Brief"],                               summary:"Post-breach governance assessment. 7 deficiencies: absent SoD, undefined CISO accountability, no breach notification, missing PDPL compliance. 12-month roadmap + board brief.",                               highlights:["7 governance gaps across 3 frameworks","SoD: devs had unilateral prod deployment","No PDPL breach notification → regulatory exposure","Board brief: root causes + 3–6 month plan"],                 githubUrl:"https://github.com/farouq7assan0o/Governance-Compliance-Breakdown-Review" },
  { id:"risk-mgmt",    title:"BazaarJo Enterprise Risk Management Plan",             category:"compliance", year:"2025", tags:["ISO 27005","NIST 800-30","Risk Register","KRIs","If-Then Risk Statements"],    summary:"Full ISO 27005 + NIST 800-30 risk lifecycle. 6 risks rated by likelihood × impact, If-Then risk statements, KRIs defined. Weekly → monthly → quarterly board reporting.",                                       highlights:["Customer PII: Critical (High × High)","If-Then: weak git controls → code injection","KRIs: MFA %, unapproved deploys, time-to-revoke","Quarterly board-level reporting defined"],                  githubUrl:"https://github.com/farouq7assan0o/Enterprise-Risk-Management-Plan-Risk-Assessment" },
  { id:"bia",          title:"BazaarJo Business Impact Analysis",                    category:"compliance", year:"2025", tags:["BIA","RTO/RPO","PCI DSS","Disaster Recovery","Business Continuity"],           summary:"Full BIA across 6 critical processes. Payment Processing: RTO 15min/RPO 0–5min (PCI-DSS). Incident Response: RTO 15min/RPO 0. Online Orders: RTO 30min/RPO 5min.",                                            highlights:["Payment: RTO 15min / RPO 0–5min (PCI-DSS)","IR Monitoring: RTO 15min / RPO 0","Online Orders: RTO 30min / RPO 5min","Recovery order: Payments → Orders → IR → Support"],                          githubUrl:"https://github.com/farouq7assan0o/Business-Impact-Analysis-BIA-" },
  { id:"fair",         title:"FAIR Risk Analysis — DPSR Phishing Incident",         category:"compliance", year:"2024", tags:["FAIR Model","Monte Carlo","ISO 27005","PDPL","Jordan Law"],                     summary:"Quantitative FAIR analysis of a spear-phishing incident. Monte Carlo simulation. ALE before controls: $1.38M/year. After MFA + SIEM + training: ALE $177K. PDPL alignment included.",                           highlights:["ALE before: $1.38M/year (Monte Carlo)","ALE after: $177K — $1.2M/year reduction","PDPL: delayed disclosure violated 72hr requirement","Controls: MFA + SIEM + exec phishing training + IR tabletop"], githubUrl:"https://github.com/farouq7assan0o/Risk-Analysis" },
  { id:"isms",         title:"ISMS Design — Bluefrontier Bank",                      category:"compliance", year:"2024", tags:["ISO 27001","COBIT 2019","ISO 27005","BIA","Audit Structure"],                   summary:"Complete ISMS for Bluefrontier Bank: risk register, asset classification, BIA with RTO/RPO, incident lifecycle, 7-phase COBIT map, 3-stage audit. Quantified financial ROI.",                                   highlights:["ISO 27001 full scope: policies, controls, audit","COBIT 2019: 7-phase gap → implement → audit","BIA: 6 processes, RTO 15–240min","Executive board brief with financial ROI"],                      githubUrl:"https://github.com/farouq7assan0o/Information-Security-Management-System-ISMS-Design-Bluefrontier-Bank" },
  { id:"crypto",       title:"Applied Cryptography — MITM, ECB/CBC, RSA",           category:"compliance", year:"2024", tags:["Python","2-DES MITM","RSA","ECB vs CBC","Digital Signatures"],                  summary:"Four-part project: MITM attack on 2-DES reducing keyspace 2^112 → 2^57; ECB vs CBC pattern leakage; hybrid RSA+DES secure messaging; Square-and-Multiply modular exponentiation.",                             highlights:["MITM: 2^112 → 2^57 keyspace reduction","ECB: pattern leakage visualized on encrypted images","RSA+DES hybrid: session key + data encryption","Square-and-Multiply: O(log e) RSA exponentiation"],   githubUrl:"https://github.com/farouq7assan0o/Crypto-Meet-in-the-Middle-Attack-DES-Modes-Secure-Messaging-Tool" },
  { id:"hopechain",    title:"HopeChain — Blockchain Donation DApp",                 category:"other",      year:"2024", tags:["Solidity","Ethereum","Ethers.js","Smart Contract Security"],                   summary:"Ethereum donation platform. Analyzed reentrancy, Sybil attacks, donor address privacy leakage. Proposed zkSNARK privacy and multisig + timelock governance. Jordan NGO compliance.",                              highlights:["Reentrancy mitigated via transfer() pattern","Privacy: donor addresses public → zkSNARK proposed","Jordan regulatory: NGO + crypto banking constraints","Proposed: multisig + timelocks + pausable"], githubUrl:"https://github.com/farouq7assan0o/Blockchain-HopeChain-Decentralized-Donation-Platform-on-Ethereum" },
  { id:"spark",        title:"SPARK — Wearable INR Monitoring Patch",                category:"other",      year:"2025", tags:["Team Leadership","Biomedical","IoT","Market Validation","HIPAA"],              summary:"Led 6-person team building a wearable INR monitoring patch for post-stroke patients. Electrochemical sensors + Bluetooth 5.0 + AI alerts. $1.65M SOM in Jordan's $55M rehab market.",                           highlights:["Led 6-person cross-disciplinary team","$1.65M SOM validated in $55M Jordan rehab market","Non-invasive continuous INR monitoring","AI emergency alerts: patient + caregiver + doctor"],             githubUrl:null },
];

// ── DESIGN TOKENS ─────────────────────────────────────────────
const T = {
  cream: "#FAF8F3", creamDark: "#EDE9DF", creamMid: "#F3F0E8",
  navy: "#0A0F1E", navyMid: "#111827", navyLight: "#1A2535",
  orange: "#E8621A", orangeHover: "#C8511A",
  slate: "#7A8FA6", slateLight: "#B0BEC8",
  white: "#FFFFFF",
  pentest: "#E05555", soc: "#22C97A", cloud: "#4AABDF", compliance: "#F0A830", other: "#A060F0",
  display: "'Playfair Display', serif",
  body: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

const CAT_META = {
  pentest:    { color: T.pentest,    label: "Pentest / Red Team" },
  soc:        { color: T.soc,        label: "SOC / DFIR" },
  cloud:      { color: T.cloud,      label: "Cloud / Infra" },
  compliance: { color: T.compliance, label: "Compliance / Risk" },
  other:      { color: T.other,      label: "Other" },
};

// ── HOOKS ─────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
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

function useCounter(target, inView, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

// ── SHARED UI ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 32 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : `translateY(${y}px)`, transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function SectionEyebrow({ children }) {
  return <div style={{ fontSize: "0.7rem", fontFamily: T.body, color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "18px", fontWeight: 600 }}>{children}</div>;
}

function SectionHeading({ children, light = false }) {
  return <h2 style={{ fontFamily: T.display, fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 700, color: light ? T.white : T.navy, letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: "52px" }}>{children}</h2>;
}

function Tag({ label, color, dark = false }) {
  return (
    <span style={{ fontSize: "0.62rem", padding: "3px 10px", border: `1px solid ${color ? color + "55" : dark ? "rgba(255,255,255,0.14)" : T.creamDark}`, color: color || (dark ? T.slateLight : T.slate), fontFamily: T.mono, letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

// ── CURSOR ────────────────────────────────────────────────────
function Cursor() {
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef(null);
  const dot = useRef(null);
  const big = useRef(false);
  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const over = (e) => { big.current = !!e.target.closest("a,button,[data-hover]"); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    let raf;
    const tick = () => {
      if (dot.current) {
        dot.current.style.left = pos.current.x - 5 + "px";
        dot.current.style.top = pos.current.y - 5 + "px";
        dot.current.style.transform = big.current ? "scale(0)" : "scale(1)";
      }
      if (ring.current) {
        ring.current.style.left = pos.current.x - 22 + "px";
        ring.current.style.top = pos.current.y - 22 + "px";
        ring.current.style.transform = big.current ? "scale(2.2)" : "scale(1)";
        ring.current.style.opacity = big.current ? "0.5" : "0.9";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={dot} style={{ position: "fixed", width: 10, height: 10, borderRadius: "50%", background: "#ffffff", pointerEvents: "none", zIndex: 9999, transition: "transform 0.1s", mixBlendMode: "difference" }} />
      <div ref={ring} style={{ position: "fixed", width: 44, height: 44, borderRadius: "50%", border: "2px solid #ffffff", pointerEvents: "none", zIndex: 9998, transition: "transform 0.2s ease, opacity 0.2s ease", mixBlendMode: "difference" }} />
    </>
  );
}

// ── NAV ───────────────────────────────────────────────────────
function Nav({ active, setActive, darkBg }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = ["home", "about", "projects", "roadmap", "skills", "certs", "writeups", "contact"];
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (s) => { setActive(s); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const bg = scrolled ? "rgba(250,248,243,0.94)" : "transparent";
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, background: bg, backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? `1px solid ${T.creamDark}` : "none", transition: "all 0.35s ease", padding: "0 clamp(18px,5vw,60px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", height: "66px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => go("home")} data-hover style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.display, fontSize: "1.15rem", fontWeight: 700, color: scrolled ? T.navy : (darkBg ? T.white : T.navy), letterSpacing: "-0.01em", transition: "color 0.3s" }}>
          FH<span style={{ color: T.orange }}>.</span>
        </button>
        <div className="desk-nav" style={{ display: "flex", gap: "28px" }}>
          {items.map(s => (
            <button key={s} onClick={() => go(s)} data-hover
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.body, fontSize: "0.76rem", fontWeight: active === s ? 600 : 400, color: active === s ? (scrolled ? T.navy : (darkBg ? T.white : T.navy)) : (scrolled ? T.slate : (darkBg ? "rgba(255,255,255,0.6)" : T.slate)), letterSpacing: "0.06em", textTransform: "uppercase", position: "relative", padding: "4px 0", transition: "color 0.3s" }}>
              {s}
              {active === s && <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: "2px", background: T.orange }} />}
            </button>
          ))}
        </div>
        <button onClick={() => setMobileOpen(o => !o)} className="mob-btn"
          style={{ display: "none", background: "none", border: `1px solid ${T.creamDark}`, color: T.navy, padding: "8px 14px", fontFamily: T.body, fontSize: "0.82rem", cursor: "pointer" }}>
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
      {mobileOpen && (
        <div style={{ background: T.cream, borderTop: `1px solid ${T.creamDark}` }}>
          {items.map(s => (
            <button key={s} onClick={() => go(s)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "14px clamp(18px,5vw,60px)", background: active === s ? T.creamDark : "none", border: "none", fontFamily: T.body, fontSize: "0.9rem", fontWeight: active === s ? 600 : 400, color: active === s ? T.orange : T.navy, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────
function StatCard({ value, suffix, label, delay }) {
  const [ref, inView] = useInView();
  const count = useCounter(value, inView);
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `all 0.7s ease ${delay}ms` }}>
      <div style={{ fontFamily: T.display, fontSize: "clamp(2.4rem, 5.5vw, 4rem)", fontWeight: 700, color: T.white, lineHeight: 1, letterSpacing: "-0.02em" }}>{count}{suffix}</div>
      <div style={{ fontFamily: T.body, fontSize: "0.8rem", color: T.slateLight, marginTop: "6px", letterSpacing: "0.03em" }}>{label}</div>
    </div>
  );
}

// ── TILT CARD ─────────────────────────────────────────────────
function TiltCard({ children, style = {}, dark = false, onClick }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(4px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} data-hover
      style={{ transition: "transform 0.35s ease", willChange: "transform", background: dark ? T.navyLight : T.white, border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : T.creamDark}`, cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────
function HomeSection({ setActive }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);
  const anim = (delay) => ({ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(32px)", transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms` });

  return (
    <>
      {/* HERO */}
      <section style={{ background: T.cream, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px clamp(18px,5vw,60px) 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-3vw", top: "50%", transform: "translateY(-50%)", fontFamily: T.display, fontSize: "clamp(120px,20vw,260px)", fontWeight: 700, color: T.creamDark, lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em" }}>01</div>
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", position: "relative" }}>
          <div style={{ ...anim(80), display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", border: `1px solid ${T.orange}45`, marginBottom: "32px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: T.orange, animation: "breathe 2s ease infinite" }} />
            <span style={{ fontFamily: T.body, fontSize: "0.73rem", color: T.orange, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500 }}>Available June 2026</span>
          </div>
          <h1 style={{ ...anim(200), fontFamily: T.display, fontSize: "clamp(3rem, 9.5vw, 8.5rem)", fontWeight: 700, color: T.navy, lineHeight: 0.9, letterSpacing: "-0.03em", marginBottom: "30px" }}>
            Farouq<br /><span style={{ color: T.orange }}>Hassan</span>
          </h1>
          <div style={{ ...anim(380), maxWidth: "560px", marginBottom: "44px" }}>
            <p style={{ fontFamily: T.display, fontStyle: "italic", fontSize: "clamp(1.05rem, 2.4vw, 1.45rem)", color: T.navyMid, lineHeight: 1.55, borderLeft: `3px solid ${T.orange}`, paddingLeft: "18px" }}>
              "{PROFILE.tagline}"
            </p>
          </div>
          <div style={{ ...anim(480), display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "44px" }}>
            {["SOC Analyst", "Detection Engineer", "Penetration Tester"].map((r, i) => (
              <div key={r} style={{ padding: "8px 20px", background: i === 0 ? T.navy : "transparent", color: i === 0 ? T.white : T.navy, border: `1.5px solid ${T.navy}`, fontFamily: T.body, fontSize: "0.8rem", fontWeight: 500 }}>{r}</div>
            ))}
          </div>
          <div style={anim(580)}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
              {[{ label: "↓ CV — SOC / Blue Team", url: PROFILE.cvSoc, hint: "CDSA · Detection · DFIR", primary: true }, { label: "↓ CV — Penetration Testing", url: PROFILE.cvOffensive, hint: "CPTS · CWES · Red Team", primary: false }].map(({ label, url, hint, primary }) => (
                <a key={label} href={url} download data-hover
                  style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "11px 20px", background: primary ? T.navy : "transparent", color: primary ? T.white : T.navy, border: `1.5px solid ${T.navy}`, textDecoration: "none", fontFamily: T.body, transition: "all 0.18s", minWidth: "185px" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.orange; e.currentTarget.style.borderColor = T.orange; e.currentTarget.style.color = T.white; }}
                  onMouseLeave={e => { e.currentTarget.style.background = primary ? T.navy : "transparent"; e.currentTarget.style.borderColor = T.navy; e.currentTarget.style.color = primary ? T.white : T.navy; }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: "0.63rem", opacity: 0.6, letterSpacing: "0.04em" }}>{hint}</span>
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
              {[["LinkedIn", PROFILE.linkedin], ["GitHub", PROFILE.github], ["HTB", PROFILE.htb], ["Email", `mailto:${PROFILE.email}`]].map(([l, u]) => (
                <a key={l} href={u} target="_blank" rel="noreferrer" data-hover
                  style={{ fontFamily: T.body, fontSize: "0.82rem", color: T.slate, textDecoration: "none", borderBottom: "1px solid transparent", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = T.orange; e.currentTarget.style.borderBottomColor = T.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.color = T.slate; e.currentTarget.style.borderBottomColor = "transparent"; }}>
                  {l} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: loaded ? 0.7 : 0, transition: "opacity 1s ease 1.2s" }}>
          <div style={{ fontSize: "0.58rem", fontFamily: T.body, color: T.slate, letterSpacing: "0.15em", textTransform: "uppercase" }}>scroll</div>
          <div style={{ width: "1px", height: "38px", background: `linear-gradient(${T.slate}, transparent)`, animation: "scrollLine 2s ease infinite" }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: T.navy, padding: "80px clamp(18px,5vw,60px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "48px" }}>
          {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 110} />)}
        </div>
      </section>

      {/* RIGHT NOW */}
      <section style={{ background: T.cream, padding: "80px clamp(18px,5vw,60px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal><SectionEyebrow>Currently</SectionEyebrow></Reveal>
          <Reveal delay={80}><h2 style={{ fontFamily: T.display, fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 700, color: T.navy, marginBottom: "36px", letterSpacing: "-0.02em" }}>Right now</h2></Reveal>
          {PROFILE.current.map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "16px 0", borderBottom: `1px solid ${T.creamDark}`, transition: "padding 0.22s ease", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = "10px"}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.orange, flexShrink: 0 }} />
                <span style={{ fontFamily: T.body, fontSize: "clamp(0.88rem,2vw,1rem)", color: T.navyMid }}>{item}</span>
                <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: T.slate, fontFamily: T.mono }}>active</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LATEST WRITEUP */}
      {WRITEUPS.filter(w => w.published)[0] && (
        <section style={{ background: T.orange, padding: "80px clamp(18px,5vw,60px)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal>
              <div style={{ fontSize: "0.7rem", fontFamily: T.body, color: "rgba(255,255,255,0.7)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>Latest writeup</div>
              <h3 style={{ fontFamily: T.display, fontSize: "clamp(1.5rem,4vw,2.8rem)", fontWeight: 700, color: T.white, lineHeight: 1.2, marginBottom: "16px", maxWidth: "700px", letterSpacing: "-0.02em" }}>{WRITEUPS.filter(w => w.published)[0].title}</h3>
              <p style={{ fontFamily: T.body, fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, maxWidth: "540px", marginBottom: "30px" }}>{WRITEUPS.filter(w => w.published)[0].excerpt}</p>
              <a href={WRITEUPS.filter(w => w.published)[0].url} target="_blank" rel="noreferrer" data-hover
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 26px", background: T.white, color: T.orange, fontFamily: T.body, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = T.navy; e.currentTarget.style.color = T.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.color = T.orange; }}>
                Read on Medium ↗
              </a>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section style={{ background: T.cream, padding: "120px clamp(18px,5vw,60px) 80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal><SectionEyebrow>About</SectionEyebrow></Reveal>
        <Reveal delay={80}><h2 style={{ fontFamily: T.display, fontSize: "clamp(2rem,5vw,3.6rem)", fontWeight: 700, color: T.navy, letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: "52px" }}>The work is <em style={{ color: T.orange }}>real.</em></h2></Reveal>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
          <Reveal delay={140}>
            <p style={{ fontFamily: T.body, fontSize: "clamp(0.92rem,2vw,1.05rem)", color: T.navyMid, lineHeight: 1.95, marginBottom: "28px" }}>{PROFILE.bio}</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[["↓ CV — SOC / Blue Team", PROFILE.cvSoc, true], ["↓ CV — Pen Testing", PROFILE.cvOffensive, true], ["→ LinkedIn", PROFILE.linkedin, false], ["→ GitHub", PROFILE.github, false], ["→ Medium", PROFILE.medium, false]].map(([label, url, dl]) => (
                <a key={label} href={url} target={dl ? "_self" : "_blank"} rel="noreferrer" download={dl || undefined} data-hover
                  style={{ padding: "8px 16px", border: `1.5px solid ${T.navy}`, color: T.navy, fontFamily: T.body, fontSize: "0.77rem", fontWeight: 500, textDecoration: "none", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.navy; e.currentTarget.style.color = T.white; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.navy; }}>
                  {label}
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={220}>
            {[["Education","B.Sc. Cybersecurity — HTU · Jun 2026"],["Internship","SCC – Jordan Armed Forces · Oct 2025 – Jun 2026 (8 months)"],["Focus","SOC / Detection Engineering + Penetration Testing"],["Platform","HackTheBox — CDSA ✓, CWES 70%, CPTS 45%"],["Competition","Top 10 / 300+ — NCSCJO National Cybersecurity Bootcamp"],["Email",PROFILE.email],["Languages","Arabic (native) · English (proficient) · German · Italian (beginner)"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "18px", padding: "13px 0", borderBottom: `1px solid ${T.creamDark}` }}>
                <div style={{ fontFamily: T.body, fontSize: "0.7rem", color: T.slate, minWidth: "92px", textTransform: "uppercase", letterSpacing: "0.06em", paddingTop: "2px", flexShrink: 0 }}>{k}</div>
                <div style={{ fontFamily: T.body, fontSize: "0.85rem", color: T.navyMid, lineHeight: 1.5 }}>{v}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── PROJECT CARD ──────────────────────────────────────────────
function ProjectCard({ project }) {
  const [exp, setExp] = useState(false);
  const col = CAT_META[project.category]?.color || T.orange;
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(3px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "none"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ background: T.navyLight, border: `1px solid rgba(255,255,255,0.07)`, padding: "24px 26px", transition: "transform 0.35s ease, border-color 0.2s", willChange: "transform", borderLeft: `3px solid ${col}` }}
      onMouseEnter={e => e.currentTarget.style.borderColor = col + "60"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "10px" }}>
        <div style={{ display: "inline-block", fontSize: "0.6rem", fontFamily: T.mono, color: col, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 8px", border: `1px solid ${col}40`, background: col + "12" }}>{CAT_META[project.category]?.label}</div>
        <div style={{ fontSize: "0.63rem", fontFamily: T.mono, color: T.slate, flexShrink: 0 }}>{project.year}</div>
      </div>
      <h3 style={{ fontFamily: T.display, fontSize: "1.08rem", fontWeight: 700, color: T.white, marginBottom: "10px", lineHeight: 1.3 }}>{project.title}</h3>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "12px" }}>
        {project.tags.map(t => <Tag key={t} label={t} color={col} dark />)}
      </div>
      <p style={{ fontFamily: T.body, fontSize: "0.82rem", color: T.slateLight, lineHeight: 1.8, marginBottom: "14px" }}>{project.summary}</p>
      <div style={{ overflow: "hidden", maxHeight: exp ? "600px" : "0", transition: "max-height 0.35s ease", marginBottom: exp ? "14px" : "0" }}>
        {project.highlights?.length > 0 && (
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: "12px" }}>
            <div style={{ fontSize: "0.62rem", color: T.slate, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px", fontFamily: T.body }}>Key findings</div>
            {project.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", fontSize: "0.78rem", color: T.slateLight, fontFamily: T.mono, padding: "5px 0", borderBottom: i < project.highlights.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", lineHeight: 1.5 }}>
                <span style={{ color: col, flexShrink: 0 }}>→</span> {h}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setExp(e => !e)} data-hover
          style={{ padding: "5px 14px", background: "none", border: `1px solid rgba(255,255,255,0.14)`, color: T.slateLight, fontFamily: T.body, fontSize: "0.74rem", cursor: "pointer", transition: "all 0.18s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.color = col; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = T.slateLight; }}>
          {exp ? "▲ collapse" : "▼ details"}
        </button>
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" data-hover
            style={{ padding: "5px 14px", border: `1px solid rgba(255,255,255,0.14)`, color: T.slateLight, fontFamily: T.body, fontSize: "0.74rem", textDecoration: "none", transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.orange; e.currentTarget.style.color = T.orange; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = T.slateLight; }}>
            ↗ GitHub
          </a>
        )}
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [filter, setFilter] = useState("all");
  const cats = [{ key: "all", label: "All" }, ...Object.entries(CAT_META).map(([k, v]) => ({ key: k, label: v.label, color: v.color }))];
  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  return (
    <section style={{ background: T.navy, padding: "120px clamp(18px,5vw,60px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal><SectionEyebrow>Selected work</SectionEyebrow></Reveal>
        <Reveal delay={80}><SectionHeading light>Projects</SectionHeading></Reveal>
        <Reveal delay={140}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "36px" }}>
            {cats.map(c => {
              const count = c.key === "all" ? PROJECTS.length : PROJECTS.filter(p => p.category === c.key).length;
              const isActive = filter === c.key;
              return (
                <button key={c.key} onClick={() => setFilter(c.key)} data-hover
                  style={{ padding: "7px 16px", background: isActive ? (c.color || T.orange) : "transparent", border: `1.5px solid ${isActive ? (c.color || T.orange) : "rgba(255,255,255,0.14)"}`, color: isActive ? T.navy : T.slateLight, fontFamily: T.body, fontSize: "0.76rem", fontWeight: isActive ? 600 : 400, cursor: "pointer", transition: "all 0.18s" }}>
                  {c.label} <span style={{ opacity: 0.6 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </Reveal>
        <div className="proj-cols" style={{ columns: "320px", columnGap: "14px" }}>
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={i * 45}>
              <div style={{ breakInside: "avoid", marginBottom: "14px" }}>
                <ProjectCard project={p} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ROADMAP ───────────────────────────────────────────────────
function WeekRow({ week }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
      <div onClick={() => setOpen(o => !o)} data-hover
        style={{ padding: "11px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none", transition: "background 0.18s" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.mono, fontSize: "0.65rem", color: T.slate }}>{week.week}</span>
          <span style={{ fontFamily: T.body, fontSize: "0.82rem", color: T.slateLight, fontWeight: 500 }}>{week.title}</span>
          {week.writeupUrl && (
            <a href={week.writeupUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} data-hover
              style={{ fontSize: "0.63rem", color: T.orange, fontFamily: T.mono, textDecoration: "none", border: `1px solid ${T.orange}45`, padding: "2px 8px" }}>↗ writeup</a>
          )}
        </div>
        <span style={{ fontSize: "0.68rem", color: T.slate, marginLeft: "10px", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 20px 14px 32px" }}>
          {week.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", fontSize: "0.78rem", color: T.slate, fontFamily: T.mono, padding: "4px 0", lineHeight: 1.5 }}>
              <span style={{ color: T.orange, flexShrink: 0 }}>→</span> {item}
            </div>
          ))}
          <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(232,98,26,0.07)", border: `1px solid ${T.orange}25`, fontSize: "0.72rem", color: T.slateLight, fontFamily: T.mono, lineHeight: 1.5 }}>
            deliverable: {week.deliverable}{!week.writeupUrl && <span style={{ color: T.slate }}> · writeup coming</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseBlock({ phase }) {
  const [open, setOpen] = useState(phase.status === "active");
  const isActive = phase.status === "active";
  return (
    <div style={{ border: `1px solid ${isActive ? T.orange + "30" : "rgba(255,255,255,0.07)"}`, marginBottom: "8px" }}>
      <div onClick={() => setOpen(o => !o)} data-hover
        style={{ padding: "18px 22px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: isActive ? "rgba(232,98,26,0.05)" : "rgba(255,255,255,0.02)", userSelect: "none" }}>
        <div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "5px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.65rem", color: isActive ? T.orange : T.slate, letterSpacing: "0.12em", fontFamily: T.mono, textTransform: "uppercase" }}>{isActive ? "▶ Active" : "○ Upcoming"}</span>
            <span style={{ fontSize: "0.65rem", color: T.slate, fontFamily: T.mono }}>{phase.days}</span>
          </div>
          <div style={{ fontFamily: T.display, fontSize: "clamp(0.95rem,2vw,1.15rem)", fontWeight: 700, color: T.white, lineHeight: 1.25 }}>{phase.phase} — {phase.title}</div>
        </div>
        <span style={{ color: T.slate, fontSize: "0.75rem", marginLeft: "14px", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          <div style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.06)`, fontFamily: T.body, fontSize: "0.82rem", color: T.slateLight, lineHeight: 1.8, fontStyle: "italic" }}>{phase.goal}</div>
          {phase.weeks.map(w => <WeekRow key={w.id} week={w} />)}
        </div>
      )}
    </div>
  );
}

function RoadmapSection() {
  return (
    <section style={{ background: T.navyMid, padding: "120px clamp(18px,5vw,60px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal><SectionEyebrow>Learning plan</SectionEyebrow></Reveal>
        <Reveal delay={80}><SectionHeading light>Roadmap</SectionHeading></Reveal>
        {ROADMAPS.map(rm => (
          <div key={rm.id}>
            <Reveal>
              <div style={{ fontFamily: T.display, fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 700, color: T.white, marginBottom: "12px" }}>{rm.name}</div>
              <div style={{ fontFamily: T.body, fontSize: "0.88rem", color: T.slateLight, lineHeight: 1.85, marginBottom: "28px", maxWidth: "680px", padding: "16px 20px", border: `1px solid rgba(232,98,26,0.2)`, borderLeft: `3px solid ${T.orange}` }}>{rm.description}</div>
            </Reveal>
            {rm.phases.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}><PhaseBlock phase={p} /></Reveal>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── SKILLS ────────────────────────────────────────────────────
function SkillsSection() {
  return (
    <section style={{ background: T.cream, padding: "120px clamp(18px,5vw,60px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal><SectionEyebrow>Capabilities</SectionEyebrow></Reveal>
        <Reveal delay={80}><SectionHeading>Arsenal</SectionHeading></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "12px" }}>
          {Object.entries(SKILLS).map(([cat, items], ci) => {
            const col = SKILL_COLORS[cat] || T.orange;
            return (
              <Reveal key={cat} delay={ci * 80}>
                <div style={{ background: T.white, border: `1px solid ${T.creamDark}`, borderTop: `3px solid ${col}`, padding: "22px 24px" }}>
                  <div style={{ fontFamily: T.body, fontSize: "0.68rem", color: col, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginBottom: "18px" }}>{cat}</div>
                  {items.map(s => (
                    <div key={s.name} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontFamily: T.body, fontSize: "0.78rem", color: T.navyMid, fontWeight: 500 }}>{s.name}</span>
                        <span style={{ fontFamily: T.mono, fontSize: "0.66rem", color: T.slate }}>{s.level}%</span>
                      </div>
                      <div style={{ height: "3px", background: T.creamDark, borderRadius: "2px" }}>
                        <div style={{ width: `${s.level}%`, height: "100%", background: `linear-gradient(90deg, ${col}, ${col}BB)`, borderRadius: "2px", transition: "width 1.2s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── CERTS ─────────────────────────────────────────────────────
function CertsSection() {
  const earned = CERTS.filter(c => c.status === "earned");
  const inprog = CERTS.filter(c => c.status === "in-progress");
  const planned = CERTS.filter(c => c.status === "planned");
  return (
    <section style={{ background: T.cream, padding: "120px clamp(18px,5vw,60px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal><SectionEyebrow>Credentials</SectionEyebrow></Reveal>
        <Reveal delay={80}><SectionHeading>Certifications</SectionHeading></Reveal>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px" }}>
            <span style={{ fontFamily: T.body, fontSize: "0.68rem", color: T.slate, letterSpacing: "0.12em", textTransform: "uppercase" }}>Earned</span>
            <div style={{ flex: 1, height: "1px", background: T.creamDark }} />
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "10px", marginBottom: "44px" }}>
          {earned.map((c, i) => (
            <Reveal key={c.id} delay={i * 70}>
              <TiltCard style={{ padding: "22px 24px", cursor: c.badgeUrl ? "pointer" : "default", borderLeft: `3px solid #22C97A`, borderTop: `1px solid ${T.creamDark}`, borderRight: `1px solid ${T.creamDark}`, borderBottom: `1px solid ${T.creamDark}` }} onClick={() => c.badgeUrl && window.open(c.badgeUrl, "_blank")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "8px" }}>
                  <span style={{ fontFamily: T.display, fontSize: "1.5rem", fontWeight: 700, color: T.navy }}>{c.name}</span>
                  <span style={{ fontSize: "0.58rem", fontFamily: T.mono, color: "#22C97A", background: "#22C97A18", border: "1px solid #22C97A60", padding: "3px 9px", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>✓ EARNED</span>
                </div>
                <div style={{ fontFamily: T.body, fontSize: "0.75rem", color: T.slate, marginBottom: "3px", lineHeight: 1.4 }}>{c.full}</div>
                <div style={{ fontFamily: T.body, fontSize: "0.7rem", color: T.slate, marginBottom: "10px" }}>{c.issuer} · {c.year}</div>
                {c.description && <div style={{ fontFamily: T.body, fontSize: "0.76rem", color: T.navyMid, lineHeight: 1.65 }}>{c.description}</div>}
                {c.badgeUrl && <div style={{ marginTop: "12px", fontFamily: T.mono, fontSize: "0.65rem", color: "#22C97A" }}>verify badge ↗</div>}
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px" }}>
            <span style={{ fontFamily: T.body, fontSize: "0.68rem", color: T.slate, letterSpacing: "0.12em", textTransform: "uppercase" }}>In progress</span>
            <div style={{ flex: 1, height: "1px", background: T.creamDark }} />
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "10px", marginBottom: "44px" }}>
          {inprog.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <div style={{ padding: "22px 24px", background: T.white, borderLeft: `3px solid #F0A830`, borderTop: `1px solid ${T.creamDark}`, borderRight: `1px solid ${T.creamDark}`, borderBottom: `1px solid ${T.creamDark}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", gap: "8px" }}>
                  <span style={{ fontFamily: T.display, fontSize: "1.3rem", fontWeight: 700, color: T.navy }}>{c.name}</span>
                  <span style={{ fontSize: "0.58rem", fontFamily: T.mono, color: "#F0A830", background: "#F0A83018", border: "1px solid #F0A83060", padding: "3px 9px", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>IN PROGRESS</span>
                </div>
                <div style={{ fontFamily: T.body, fontSize: "0.75rem", color: T.slate, marginBottom: "12px" }}>{c.full} · {c.issuer}</div>
                {c.description && <div style={{ fontFamily: T.body, fontSize: "0.76rem", color: T.navyMid, lineHeight: 1.65, marginBottom: "14px" }}>{c.description}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontFamily: T.mono, fontSize: "0.68rem", color: T.slate }}>Progress</span>
                  <span style={{ fontFamily: T.mono, fontSize: "0.72rem", color: "#F0A830", fontWeight: 600 }}>{c.pct}%</span>
                </div>
                <div style={{ height: "4px", background: T.creamDark, borderRadius: "2px" }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: "linear-gradient(90deg, #F0A830, #E8621A)", borderRadius: "2px", transition: "width 1.2s ease" }} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
            <span style={{ fontFamily: T.body, fontSize: "0.68rem", color: T.slate, letterSpacing: "0.12em", textTransform: "uppercase" }}>Planned</span>
            <div style={{ flex: 1, height: "1px", background: T.creamDark }} />
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {planned.map(c => (
              <div key={c.id} style={{ padding: "10px 20px", border: `1px solid ${T.creamDark}`, fontFamily: T.body, fontSize: "0.8rem", color: T.slate }}>
                {c.name} <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>— {c.full}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── WRITEUPS ──────────────────────────────────────────────────
function WriteupRow({ post }) {
  const [h, setH] = useState(false);
  const clickable = post.published && post.url;
  return (
    <div onClick={() => clickable && window.open(post.url, "_blank")}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: "20px 22px", cursor: clickable ? "pointer" : "default", background: h && clickable ? "rgba(232,98,26,0.06)" : "transparent", transition: "all 0.2s", opacity: post.published ? 1 : 0.55, position: "relative" }}>
      {h && clickable && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: T.orange }} />}
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
        {post.tags.map(t => <Tag key={t} label={t} dark />)}
        {!post.published && <Tag label="Coming soon" dark />}
      </div>
      <div style={{ fontFamily: T.display, fontSize: "clamp(0.95rem,2vw,1.1rem)", fontWeight: 700, color: T.white, marginBottom: "5px", lineHeight: 1.3 }}>{post.title}</div>
      <div style={{ fontFamily: T.mono, fontSize: "0.68rem", color: T.slate, marginBottom: "8px" }}>{post.date} · {post.platform}</div>
      <div style={{ fontFamily: T.body, fontSize: "0.82rem", color: T.slateLight, lineHeight: 1.75 }}>{post.excerpt}</div>
      {clickable && <div style={{ marginTop: "10px", fontFamily: T.mono, fontSize: "0.7rem", color: h ? T.orange : T.slate, transition: "color 0.18s" }}>{h ? `→ read on ${post.platform}` : "$ cat writeup.md"}</div>}
    </div>
  );
}

function CollectionBlock({ name, posts }) {
  const [open, setOpen] = useState(true);
  const live = posts.filter(p => p.published).length;
  return (
    <div style={{ marginBottom: "14px", border: `1px solid rgba(255,255,255,0.07)` }}>
      <div onClick={() => setOpen(o => !o)} data-hover
        style={{ padding: "14px 22px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", userSelect: "none" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.body, fontSize: "0.78rem", color: T.white, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>◈ {name}</span>
          <span style={{ fontFamily: T.mono, fontSize: "0.65rem", color: T.slate }}>{live} live · {posts.length - live} coming</span>
        </div>
        <span style={{ color: T.slate, fontSize: "0.7rem", marginLeft: "10px" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          {posts.map((post, i) => (
            <div key={post.id} style={{ borderBottom: i < posts.length - 1 ? `1px solid rgba(255,255,255,0.05)` : "none" }}>
              <WriteupRow post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WriteupsSection() {
  const collections = [...new Set(WRITEUPS.map(w => w.collection || "Other"))];
  return (
    <section style={{ background: T.navy, padding: "120px clamp(18px,5vw,60px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal><SectionEyebrow>Writing</SectionEyebrow></Reveal>
        <Reveal delay={80}><SectionHeading light>Writeups</SectionHeading></Reveal>
        {collections.map((col, ci) => {
          const posts = WRITEUPS.filter(w => (w.collection || "Other") === col);
          return (
            <Reveal key={col} delay={ci * 60}>
              <CollectionBlock name={col} posts={posts} />
            </Reveal>
          );
        })}
        <Reveal delay={200}>
          <div style={{ marginTop: "36px", padding: "22px", border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center", fontFamily: T.body, fontSize: "0.8rem", color: T.slate }}>
            Publishing regularly on Medium · more writeups coming as the roadmap progresses
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────
function ContactSection() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(PROFILE.email); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <section style={{ background: T.navyMid, padding: "120px clamp(18px,5vw,60px)", minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto", width: "100%" }}>
        <Reveal><SectionEyebrow>Get in touch</SectionEyebrow></Reveal>
        <Reveal delay={80}><SectionHeading light>Let's talk.</SectionHeading></Reveal>

        <Reveal delay={120}>
          <p style={{ fontFamily: T.body, fontSize: "clamp(0.95rem,2vw,1.08rem)", color: T.slateLight, lineHeight: 1.9, marginBottom: "44px", borderLeft: `3px solid ${T.orange}`, paddingLeft: "18px" }}>
            I'm graduating June 2026 and open to SOC analyst, detection engineering, and junior red team roles. Based in Amman — open to remote. If you're hiring, collaborating, or just want to talk security, reach out.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "44px" }}>
            {[
              { label: "Email",      value: PROFILE.email,                     note: copied ? "Copied!" : "Click to copy",  col: "#22C97A", action: copy },
              { label: "LinkedIn",   value: "linkedin.com/in/FarouqHassan02",   note: "Connect & message",                   col: T.orange,  href: PROFILE.linkedin },
              { label: "GitHub",     value: "github.com/farouq7assan0o",        note: "View my repositories",                col: "#4AABDF", href: PROFILE.github },
              { label: "HackTheBox", value: "HTB Profile",                      note: "See my lab progress",                 col: "#9FEF00", href: PROFILE.htb },
            ].map(({ label, value, note, col, action, href }) => (
              <div key={label}
                onClick={action || (href ? () => window.open(href, "_blank") : undefined)}
                data-hover
                style={{ padding: "20px 22px", background: T.navyLight, border: `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid ${col}`, cursor: "pointer", transition: "background 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = T.navyLight}>
                <div style={{ fontFamily: T.body, fontSize: "0.62rem", color: col, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>{label}</div>
                <div style={{ fontFamily: T.body, fontSize: "0.85rem", color: T.white, marginBottom: "4px", wordBreak: "break-all" }}>{value}</div>
                <div style={{ fontFamily: T.mono, fontSize: "0.62rem", color: T.slate }}>{note} ↗</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div style={{ padding: "24px 26px", background: T.navyLight, border: `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid rgba(255,255,255,0.15)`, marginBottom: "32px" }}>
            <div style={{ fontFamily: T.body, fontSize: "0.62rem", color: T.slate, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "12px" }}>Field Reference</div>
            <p style={{ fontFamily: T.display, fontStyle: "italic", fontSize: "clamp(0.9rem,2vw,1.02rem)", color: T.slateLight, lineHeight: 1.85, marginBottom: "14px" }}>
              "{PROFILE.testimonial.quote}"
            </p>
            <div style={{ fontFamily: T.mono, fontSize: "0.65rem", color: T.slate }}>
              — {PROFILE.testimonial.author}
              <span style={{ color: T.orange, marginLeft: "10px", fontSize: "0.58rem" }}>{PROFILE.testimonial.note}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div style={{ fontFamily: T.mono, fontSize: "0.58rem", color: T.slate, letterSpacing: "0.1em", borderTop: `1px solid rgba(255,255,255,0.07)`, paddingTop: "16px" }}>
            AVAILABLE JUNE 2026 · AMMAN, JO · OPEN TO REMOTE
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: T.navyMid, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px clamp(18px,5vw,60px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ fontFamily: T.display, fontSize: "1.05rem", fontWeight: 700, color: T.white }}>FH<span style={{ color: T.orange }}>.</span></div>
        <div style={{ fontFamily: T.body, fontSize: "0.72rem", color: T.slate }}>farouqhassan.dev · next.js + vercel · {new Date().getFullYear()}</div>
        <div style={{ display: "flex", gap: "22px" }}>
          {[["LinkedIn", PROFILE.linkedin], ["GitHub", PROFILE.github], ["Medium", PROFILE.medium], ["HTB", PROFILE.htb]].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noreferrer" data-hover
              style={{ fontFamily: T.body, fontSize: "0.75rem", color: T.slate, textDecoration: "none", transition: "color 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.color = T.orange}
              onMouseLeave={e => e.currentTarget.style.color = T.slate}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("home");

  const sections = {
    home:     <HomeSection setActive={setActive} />,
    about:    <AboutSection />,
    projects: <ProjectsSection />,
    roadmap:  <RoadmapSection />,
    skills:   <SkillsSection />,
    certs:    <CertsSection />,
    writeups: <WriteupsSection />,
    contact:  <ContactSection />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { background: ${T.cream}; color: ${T.navy}; min-height: 100vh; cursor: none; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.navy}; }
        ::-webkit-scrollbar-thumb { background: ${T.orange}; border-radius: 2px; }
        @keyframes breathe { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.75);} }
        @keyframes scrollLine { 0%,100%{opacity:0.5;}50%{opacity:1;} }
        @keyframes sectionIn { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
        .desk-nav { display: flex !important; }
        .mob-btn  { display: none  !important; }
        .about-grid { grid-template-columns: 1fr 1fr; }
        @media(max-width:700px) {
          .desk-nav   { display: none  !important; }
          .mob-btn    { display: block !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .proj-cols  { columns: 1 !important; }
          body { cursor: auto; }
        }
        @media(hover:none) { body { cursor: auto; } }
      `}</style>

      <Cursor />
      <Nav active={active} setActive={setActive} darkBg={["projects","roadmap","writeups","contact"].includes(active)} />

      <div key={active} style={{ animation: "sectionIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
        {sections[active]}
      </div>

      <Footer />
    </>
  );
}
