"use client";
import { useState, useEffect, useCallback } from "react";

// ============================================================
// SECURITY: Password is stored as a SHA-256 hash only.
// To change your password:
//   1. Go to https://emn178.github.io/online-tools/sha256.html
//   2. Type your new password → copy the hash
//   3. Replace the string below
// Current password: farouq2026
const ADMIN_HASH = "fd152270710118a207e130332d5b886aba46388627568ceee2fb38a4c63a6588";
// ↑ Replace this with your real hash. The one above is a placeholder.
// ============================================================

// ============================================================
// INITIAL DATA — seeded into React state on first load.
// The admin panel edits live state. Nothing persists across
// page refresh (no DB needed). To make changes permanent,
// edit this block and redeploy to Vercel (git push = 30s).
// ============================================================

const INIT_PROFILE = {
  name: "Farouq Hassan",
  title: "Cybersecurity Analyst",
  location: "Amman, Jordan",
  email: "12farouq12@gmail.com",
  linkedin: "https://linkedin.com/in/farouqhassan",
  github: "https://github.com/farouq7assan0o",
  medium: "https://medium.com/@farouqnader",
  bio: "Cybersecurity student at HTU, graduating June 2026. Currently 8 months into an 11-month internship at the Special Communications Commission – Jordan Armed Forces, doing real defensive validation and security assurance. Studying the offensive and defensive tracks simultaneously: CWES 70%, CPTS 45%, CDSA already done. I document everything publicly — no recycled theory, just real work.",
  current: [
    "Internship @ SCC-JAF — month 8 of 11",
    "HTB CWES — 70% complete",
    "HTB CPTS — 45% complete",
    "90-Day Detection Engineering roadmap (active)",
    "Weekly HTB writeups + LinkedIn posts",
  ],
};

const INIT_CERTS = [
  { id: "cdsa", name: "CDSA", full: "Certified Defensive Security Analyst", issuer: "Hack The Box", year: "2025", status: "earned", pct: 100, badgeUrl: "https://www.hackthebox.com/", description: "Enterprise SOC investigations, DFIR, SIEM threat hunting, Active Directory attack detection." },
  { id: "cwse", name: "CWSE", full: "Certified Web Security Expert", issuer: "Hackviser", year: "2025", status: "earned", pct: 100, badgeUrl: "https://hackviser.com/", description: "Web application security testing aligned with OWASP Top 10, bug hunting methodology." },
  { id: "capt", name: "CAPT", full: "Certified Associate Penetration Tester", issuer: "Hackviser", year: "2025", status: "earned", pct: 100, badgeUrl: "https://hackviser.com/", description: "Penetration testing fundamentals across web, network, and infrastructure environments." },
  { id: "nca", name: "NCA", full: "Nutanix Certified Associate v6", issuer: "Nutanix", year: "2025", status: "earned", pct: 100, badgeUrl: "https://www.nutanix.com/", description: "Hyperconverged infrastructure, cloud architecture, and virtualization fundamentals." },
  { id: "cwes", name: "CWES", full: "Certified Web Exploitation Specialist", issuer: "Hack The Box", year: "2026", status: "in-progress", pct: 70, badgeUrl: null, description: "Advanced web exploitation, chaining vulnerabilities, and real-world offensive attack paths." },
  { id: "cpts", name: "CPTS", full: "Certified Penetration Testing Specialist", issuer: "Hack The Box", year: "2026", status: "in-progress", pct: 45, badgeUrl: null, description: "Full-scope penetration testing, AD attacks, privilege escalation, and professional reporting." },
  { id: "secplus", name: "Sec+", full: "CompTIA Security+ SY0-701", issuer: "CompTIA", year: "2026", status: "planned", pct: 0, badgeUrl: null, description: "Industry-standard baseline for security concepts, threats, and risk management." },
  { id: "ccna", name: "CCNA", full: "Cisco CCNA 200-301", issuer: "Cisco", year: "2026", status: "planned", pct: 0, badgeUrl: null, description: "Network fundamentals, routing, switching, and enterprise infrastructure." },
];

const INIT_WRITEUPS = [
  { id: 1, title: "HTB CDSA — What It Really Takes to Pass", date: "Feb 2026", platform: "Medium", collection: "Journey", tags: ["CDSA", "Blue Team", "Journey"], excerpt: "An honest account of what the CDSA exam demands — the lab hours, the mental pressure, and what actually prepared me to pass. No fluff.", url: "https://medium.com/@farouqnader", published: true },
  { id: 2, title: "HTB Machine Writeup #1 — Coming Soon", date: "Mar 2026", platform: "HTB", collection: "HTB Machines", tags: ["HTB", "Linux", "Privilege Escalation"], excerpt: "First HTB machine writeup. Full walkthrough from recon to root.", url: null, published: false },
  { id: 3, title: "Detection Engineering: Writing Real Sigma Rules", date: "Coming", platform: "Blog", collection: "Detection Engineering Series", tags: ["Detection Engineering", "Sigma", "Blue Team"], excerpt: "Phase 1 deliverable — building real detections for AD attack paths with MITRE mapping and false positive tuning.", url: null, published: false },
];

const INIT_ROADMAPS = [
  {
    id: "rm1", name: "90-Day Detection Engineering", description: "Become a Detection Engineer + AD Threat Hunter. Build 15–20 production-grade rules, a Domain Compromise Detection Framework, and a public GitHub portfolio.",
    phases: [
      {
        id: "p1", phase: "Phase 1", days: "Days 1–30", title: "Detection Engineering Fundamentals", status: "active",
        goal: "Build high-quality detections for real AD attack paths. Deliver 15–20 production-grade rules.",
        weeks: [
          { id: "w1", week: "Week 1", title: "Lab Foundation", items: ["DC + 2 Win10 clients + Kali + Splunk", "Sysmon on all endpoints", "PowerShell Script Block + Module Logging", "Advanced AD auditing (4662, 4742, 4738, 4672)"], deliverable: "Lab architecture diagram + logging baseline", writeupUrl: null },
          { id: "w2", week: "Week 2", title: "Initial Access & Execution", items: ["Phishing macro → PowerShell", "Encoded PowerShell / IEX", "Office spawning cmd/powershell"], deliverable: "5 detection rules with MITRE mapping", writeupUrl: null },
          { id: "w3", week: "Week 3", title: "Privilege Escalation & Persistence", items: ["UAC bypass", "Scheduled tasks (Event 4698)", "Registry run keys", "Service creation"], deliverable: "6 detection rules + alert logic", writeupUrl: null },
          { id: "w4", week: "Week 4", title: "Credential Access", items: ["Mimikatz + LSASS dump (Sysmon ID 10)", "Kerberoasting (4769 w/ RC4)", "Pass-the-Hash", "Logon Type 9 / abnormal 4672"], deliverable: "Credential Theft Detection Pack", writeupUrl: null },
        ],
      },
      {
        id: "p2", phase: "Phase 2", days: "Days 31–60", title: "AD Threat Hunting", status: "upcoming",
        goal: "Build a Domain Compromise Detection Framework. Hunt for patterns, not just alerts.",
        weeks: [
          { id: "w5", week: "Week 5", title: "Lateral Movement", items: ["SMB / PsExec / WMI / WinRM detection", "ADMIN$ usage + named pipe anomalies", "Event 4624 Type 3 from workstation to DC"], deliverable: "Lateral movement detection rules", writeupUrl: null },
          { id: "w6", week: "Week 6", title: "DCSync & DCShadow", items: ["DCSync (4662 replication GUIDs)", "DCShadow (4742 / 4738 anomalies)", "AD object modification tracking"], deliverable: "Domain Compromise Detection Framework", writeupUrl: null },
          { id: "w7", week: "Week 7", title: "Threat Hunting Framework", items: ["Rare logon types", "Rare parent-child processes", "Rare LDAP burst activity", "Baseline vs anomaly docs"], deliverable: "10 threat hunting queries", writeupUrl: null },
          { id: "w8", week: "Week 8", title: "SIEM Engineering", items: ["Field normalization", "Multi-stage correlation rules", "Risk-based alerting + noise reduction"], deliverable: "3 multi-stage correlation rules", writeupUrl: null },
        ],
      },
      {
        id: "p3", phase: "Phase 3", days: "Days 61–90", title: "Automation & Portfolio", status: "upcoming",
        goal: "Build production-ready SOAR, run full purple team simulation, publish everything publicly.",
        weeks: [
          { id: "w9", week: "Week 9", title: "SOAR & Case Management", items: ["Deploy TheHive + Shuffle", "Alert → Case auto-creation", "IP enrichment + auto-tag MITRE"], deliverable: "Working SOAR pipeline", writeupUrl: null },
          { id: "w10", week: "Week 10", title: "Purple Team Simulation", items: ["Day 1: Phishing", "Day 2: Kerberoast", "Day 3: Lateral Movement", "Day 4: DCSync"], deliverable: "Detection gap analysis report", writeupUrl: null },
          { id: "w11", week: "Week 11", title: "Detection Portfolio", items: ["GitHub repo with all detection rules", "Write-ups per attack chain", "Red vs Blue test results"], deliverable: "Public portfolio on GitHub", writeupUrl: null },
          { id: "w12", week: "Week 12", title: "Enterprise Readiness", items: ["Windows hardening: LAPS, Credential Guard, Protected Users", "Tiered AD model / ESAE", "Prevention mindset framework"], deliverable: "Enterprise hardening checklist", writeupUrl: null },
        ],
      },
    ],
  },
];

const INIT_PROJECTS = [
  { id: "animeblast", title: "AnimeBlast — Full-Scope Penetration Test", category: "pentest", year: "2024", tags: ["Buffer Overflow", "Metasploit", "SQLi", "XSS", "RCE", "Pivoting"], summary: "Full-scope pentest against two virtual targets. Custom Python BoF exploit (EIP at 1036 bytes), bypassed DEP/ASLR/SafeSEH, pivoted through a compromised host via SOCKS proxy, then exploited UNION SQLi, XSS session hijack, PHP shell upload → RCE on the second target. Captured 10 CTF flags.", highlights: ["Custom BoF — EIP @ 1036 bytes", "DEP + ASLR + SafeSEH bypass", "Network pivot via Metasploit SOCKS", "UNION SQLi → admin:supersecret dumped", "PHP shell → RCE → admin user created", "10 flags captured (Base64 + RC4 decoded)"], githubUrl: null },
  { id: "cyberblast", title: "CyberBlast — Ethical Hacking Assessment", category: "pentest", year: "2024", tags: ["Nessus", "SQLmap", "Hydra", "EternalBlue", "Kill Chain"], summary: "Full-cycle ethical hacking engagement. Passive recon (WHOIS, Google Dorks, Shodan), Nessus scan (20 findings), Wireshark credential capture via plaintext Telnet, SQLmap DB dump, XSS session hijack, command injection, EternalBlue exploitation with Meterpreter post-exploitation and RDP access.", highlights: ["Nessus: 20 vulns (BlueKeep, TLS 1.0, PHP 5.6)", "Telnet credential sniff: sami:P@ss1234", "EternalBlue → Meterpreter → credential dump", "UNION SQLi + XSS + RCE + command injection", "Custom MSFvenom reverse shell payload"], githubUrl: null },
  { id: "sqli-redteam", title: "SQLi Assessment + Banking Red Team Plan", category: "pentest", year: "2025", tags: ["SQLi", "Auth Bypass", "UNION injection", "Kill Chain", "ROE"], summary: "Three parts: manual SQLi exploitation (auth bypass, category filter, UNION credential extraction), full Rules of Engagement for a banking red team, and a complete Cyber Kill Chain attack plan from OSINT through C2 and exfiltration.", highlights: ["Auth bypass: ' OR '1'='1'", "UNION SELECT → admin:supersecret", "Comment injection → hidden product disclosure", "Banking ROE: scope, social engineering limits, data handling", "Kill Chain: OSINT → weaponize → phish → persist → C2 → exfil"], githubUrl: null },
  { id: "ftp-brute", title: "FTP Enumeration & Brute Force Lab", category: "pentest", year: "2025", tags: ["Hydra", "FTP", "Brute Force", "Enumeration"], summary: "Enumerated FTP, confirmed anonymous access misconfiguration, brute-forced credentials for 'osama' using Hydra against 100k NCSC password list. Recovered password 'scorpio'. Documented hardening: Fail2Ban, SFTP migration, firewall ACLs.", highlights: ["Anonymous FTP access confirmed", "Hydra + 100k NCSC wordlist", "Credentials: osama:scorpio", "No rate limiting — zero lockout resistance", "Remediation: Fail2Ban + disable anon + SFTP"], githubUrl: null },
  { id: "privesc-lab", title: "Linux File Transfer & Privilege Escalation", category: "pentest", year: "2025", tags: ["LinPEAS", "Kernel Exploit", "Netcat", "SCP", "Searchsploit"], summary: "Demonstrated four file transfer techniques (HTTP/Python server, SCP, Netcat, Base64), enumerated with LinPEAS, identified kernel 2.6.32, found Exploit-DB 18411 (Mempodippert), compiled and executed local privilege escalation.", highlights: ["Kernel 2.6.32 identified via uname -a", "searchsploit → Exploit-DB 18411", "BoF LPE compiled + executed on target", "4 transfer methods demonstrated", "LinPEAS enumeration workflow"], githubUrl: null },
  { id: "semgrep", title: "Semgrep SAST in GitHub Actions (Juice Shop)", category: "pentest", year: "2025", tags: ["Semgrep", "SAST", "GitHub Actions", "DevSecOps", "CI/CD Security"], summary: "Integrated Semgrep into GitHub Actions CI/CD for OWASP Juice Shop. Pipeline auto-scans every push — 1015 files, 1062 rules, 41 findings. Detected direct SQL string concatenation in Sequelize queries. Documented parameterized query remediation.", highlights: ["41 findings across 1015 files", "Sequelize SQLi: criteria directly concatenated", "YAML workflow triggers on every push", "Shift-left: devs get feedback immediately", "Parameterized fix: :criteria replacement"], githubUrl: null },
  { id: "malware", title: "Malware Analysis — BackdoorBeacon.exe", category: "pentest", year: "2024", tags: ["IDA Free", "x32dbg", "OllyDbg", "Wireshark", "UPX", "Reverse Engineering"], summary: "Full lifecycle RE of a UPX-packed backdoor. Static: TLS callbacks, anti-debug checks, hardcoded C2 1.1.1.1:4444, HKCU Run persistence, sysdrvr service. Dynamic: patched IP to 127.0.0.1, confirmed SYN beaconing via Wireshark. SSDT/IDT clean — no rootkit.", highlights: ["UPX unpacking → PE section analysis", "TLS callback + IsDebuggerPresent NOP patch", "C2: 1.1.1.1:4444 → patched 127.0.0.1", "Registry persistence: HKCU\\Run\\Updater", "SSDT/IDT clean — no kernel hooking"], githubUrl: null },
  { id: "pcap-memory", title: "PCAP + Memory Forensics Investigation", category: "soc", year: "2025", tags: ["Wireshark", "Volatility 3", "DNS Tunneling", "HTTP C2", "Fileless Malware"], summary: "Two-part investigation: PCAP triage of CLN-WS-19 found HTTP C2 beaconing to 104.82.23.12 via /v1/checkin with sequential polling, plus DNS TXT exfiltration via billing-portal.care with Base64 payloads. Memory forensics (Volatility 3) found fileless PowerShell loader (RWX VADs), rogue scvhost.exe (PID 3644), active C2 to :8080.", highlights: ["HTTP C2: /v1/checkin sequential polling", "DNS TXT exfil → FLAG{DNS_DRIP_3C1} decoded", "Volatility: RWX shellcode injection via malfind", "scvhost.exe: PID 3644, parent explorer.exe", "Timeline correlated: network + memory"], githubUrl: null },
  { id: "threat-intel", title: "Threat Intelligence — APT29 & Lumma Stealer", category: "soc", year: "2025", tags: ["MITRE ATT&CK", "ATT&CK Navigator", "OSINT", "APT29 / NOBELIUM", "Lumma Stealer"], summary: "Mapped APT29 (NOBELIUM) SolarWinds and USAID campaigns to ATT&CK with impact scoring (High=90, Med=60, Low=30). Built Navigator JSON layers with OSINT-backed evidence references. Analyzed Lumma Stealer IOCs and behavioral chain. Cross-campaign comparison: nation-state espionage vs cybercrime credential theft.", highlights: ["APT29: T1195.002 supply chain scored 90", "T1003.001 LSASS dump + T1550.001 token abuse: High", "Lumma: T1555 credential harvesting (9/10)", "Full ATT&CK Navigator JSON layers built", "CISA AA20-352A + Mandiant SUNBURST sourced"], githubUrl: null },
  { id: "ir-playbooks", title: "IR Playbooks — Clinic, Ransomware, Supply Chain", category: "soc", year: "2025", tags: ["IR Planning", "ATT&CK → D3FEND", "Ransomware", "NIST IR", "Executive Comms"], summary: "Three complete IR playbooks: clinic malware (Word→PowerShell, VLAN ACL containment), CityWorks ransomware (decision tree, recovery preconditions, recovery order), and Bazaarjo supply-chain breach (NIST IR phase mapping, ATT&CK → D3FEND countermeasures). All include executive comms drafts and measurable closure criteria.", highlights: ["VLAN ACL: balanced speed + evidence preservation", "Ransomware decision tree: pre-impact vs ongoing", "D3FEND: FIDO2 MFA breaks Lumma credential chain", "Bazaarjo: token revocation + CI/CD suspension", "All playbooks: exec update + staff advisory + closure criteria"], githubUrl: null },
  { id: "forensics", title: "Digital Forensics — BlackEagle Investigation", category: "soc", year: "2024", tags: ["FTK Imager", "HxD", "NTFS Recovery", "Steganography", "Chain of Custody"], summary: "Full forensic investigation of a damaged USB and suspect PC. Manually recovered NTFS mirror via HxD, extracted a hidden DOCX inside cage3.png (steganography), decoded white-on-white text revealing a planned criminal meeting. Hash verified at every stage, McKemmish 4-step model, full chain of custody.", highlights: ["NTFS manual recovery via HxD hex editor", "Steganography: DOCX embedded inside PNG", "Hidden message: meeting June 11, 12PM, KHBP", "Hash verified before + after imaging", "Search warrant, CCPA/GDPR compliance enforced"], githubUrl: null },
  { id: "airline", title: "Secure Airline Check-in System", category: "soc", year: "2024", tags: ["Java", "SHA-256", "JUnit", "Fuzz Testing", "RBAC"], summary: "Java airline management system with security-first design: SHA-256 + salt hashing, brute-force lockout after 3 failures, RBAC (passenger/crew/agent/admin), centralized audit logger, full JUnit suite with fuzz testing up to 100k login attempts, and SAST via PMD.", highlights: ["SHA-256 + salt hashing", "Lockout after 3 failures", "RBAC: 4 strictly separated roles", "Fuzz tested: 1k → 10k → 100k attempts", "PMD SAST: findings in output.csv"], githubUrl: "https://github.com/farouq7assan0o/SecureCoding", projectUrl: null },
  { id: "otp-s3", title: "Secure OTP Data Retrieval System", category: "cloud", year: "2025", tags: ["S3 Security", "OTP Hardening", "OWASP A01/A07", "IAM", "Presigned URLs"], summary: "Security design review of an OTP-based S3 system. Found and fixed 4 critical vulns: OTP in API response (A05), no expiry (A07), no rate limiting → 6-digit brute-force possible (A07), predictable S3 path (A01). Fixed with hashed OTPs, 5-min expiry, MAX_ATTEMPTS lockout, uuid4 filenames, private bucket + presigned URL 600s TTL.", highlights: ["OTP in API → removed, send via email/SMS only", "Expiry: 5-min window + single-use invalidation", "Rate limit: MAX_ATTEMPTS=5 + exponential backoff", "S3: uuid4() + private bucket + presigned URL (600s)", "OWASP A01, A05, A07 mapped and remediated"], githubUrl: null },
  { id: "apache-ssh", title: "Apache & SSH Hardening (CIS-Aligned)", category: "cloud", year: "2025", tags: ["Apache 2.4", "CIS Benchmark", "SSH Hardening", "Docker", "Defense-in-Depth"], summary: "Two-part: Apache audit found 5 misconfigs (version disclosure in headers/errors, TRACE enabled, /server-status public, directory listing exposing passwords.txt). Applied CIS 2.2–3.5. SSH hardening: disabled root login + password auth, key-only, AllowUsers, removed weak ciphers, no forwarding, eliminated NOPASSWD sudo.", highlights: ["Apache: 5 CIS findings fixed", "ServerTokens Prod + TraceEnable Off + -Indexes", "/server-status → 403 externally", "SSH: PermitRootLogin no + PasswordAuthentication no", "Ciphers: chacha20-poly1305 + aes256-gcm only"], githubUrl: null },
  { id: "network", title: "Enterprise Network Security Design", category: "cloud", year: "2023", tags: ["Cisco", "IPsec VPN", "OSPF", "ASA Firewall", "VLAN", "ACL"], summary: "Multi-site network: Amman, Aqaba, Irbid, Saudi Arabia, Turkey. IPsec VPN (AES+SHA), ASA firewall with DMZ and NAT, full-mesh OSPF routing, VLAN segmentation, port security, AAA + SSH-only access. All connectivity, VPN tunnels, and ACLs tested and validated.", highlights: ["IPsec VPN: AES + SHA + ISAKMP", "ASA: DMZ + NAT + HTTPS-only external", "Full-mesh WAN: 5 routers", "VLAN isolation per department", "AAA + SSH hardening across all devices"], githubUrl: null },
  { id: "governance", title: "BazaarJo Governance Gap Assessment", category: "compliance", year: "2025", tags: ["ISO 27014", "PDPL", "PCI DSS", "SoD", "Board Brief"], summary: "Post-breach governance assessment. Identified 7 deficiencies: SoD absent (devs deploying to prod unilaterally), undefined CISO accountability, no breach notification policy, no board risk appetite, weak vendor oversight, missing PDPL privacy policy, no policy review cycle. Delivered 12-month remediation roadmap and executive board brief.", highlights: ["7 governance gaps across 3 frameworks", "SoD: devs had unilateral prod deployment", "No PDPL breach notification → regulatory exposure", "Top 3: SoD enforcement, breach notification, CISO mandate", "Board brief: root causes + 3–6 month plan"], githubUrl: null },
  { id: "risk-mgmt", title: "BazaarJo Enterprise Risk Management Plan", category: "compliance", year: "2025", tags: ["ISO 27005", "NIST 800-30", "Risk Register", "KRIs", "If-Then Risk Statements"], summary: "Full ISO 27005 + NIST 800-30 risk lifecycle. Identified 6 risks (PII exposure, code tampering, regulatory fines, downtime, churn, fraud), rated by likelihood × impact, produced If-Then risk statement for git repo weakness, defined KRIs (MFA coverage %, unapproved deploys, revocation lag). Weekly → monthly → quarterly board reporting cadence.", highlights: ["Customer PII: Critical (High likelihood × High impact)", "Source code tampering: Medium × High", "If-Then: weak git controls → malicious code injection", "KRIs: MFA %, unapproved deploys, time-to-revoke", "Quarterly board-level risk reporting defined"], githubUrl: null },
  { id: "bia", title: "BazaarJo Business Impact Analysis", category: "compliance", year: "2025", tags: ["BIA", "RTO/RPO", "PCI DSS", "Disaster Recovery", "Business Continuity"], summary: "Full BIA across 6 critical processes after a 2-hour outage. Payment Processing: RTO 15min/RPO 0–5min (PCI-DSS). Incident Response: RTO 15min/RPO 0 (zero log loss for forensics). Online Orders: RTO 30min/RPO 5min. Product Catalog: RTO 4hr/RPO 1hr (cache acceptable). Full recovery priority order defined.", highlights: ["Payment: RTO 15min / RPO 0–5min (PCI-DSS)", "IR Monitoring: RTO 15min / RPO 0min", "Online Orders: RTO 30min / RPO 5min", "Product Catalog: RTO 4hr / RPO 1hr", "Recovery order: Payments → Orders → IR → Support → Merchant → Catalog"], githubUrl: null },
  { id: "fair", title: "FAIR Risk Analysis — DPSR Phishing Incident", category: "compliance", year: "2024", tags: ["FAIR Model", "STRIDE/DREAD", "Monte Carlo", "ISO 27005", "PDPL", "Jordan Law"], summary: "Quantitative FAIR analysis of a spear-phishing incident (6-day dwell time). STRIDE/DREAD scoring (Info Disclosure: 7.8, Priv Esc: 7.8), Monte Carlo simulation via FAIR-U. ALE before controls: $1.38M/year. After MFA + SIEM + training + IR drill: ALE $177K. Aligned with Jordanian Law No. 16/2019 and PDPL.", highlights: ["ALE before: $1.38M/year (Monte Carlo simulation)", "ALE after: $177K → $1.2M/year reduction", "DREAD top scores: Info Disclosure + PrivEsc (7.8)", "PDPL: delayed disclosure violated 72hr requirement", "Controls: MFA + SIEM + exec phishing training + IR tabletop"], githubUrl: null },
  { id: "isms", title: "ISMS Design — Bluefrontier Bank", category: "compliance", year: "2024", tags: ["ISO 27001", "COBIT 2019", "ISO 27005", "BIA", "Audit Structure"], summary: "Complete ISMS for Bluefrontier Bank: risk register with KRIs, asset classification, BIA with RTO/RPO, incident lifecycle, 7-phase COBIT map, 3-stage audit (planning → fieldwork → reporting). Quantified financial ROI through reduced breach probability. ISO 27001 full scope, PDSA continuous improvement cycle.", highlights: ["ISO 27001 full scope: policies, controls, audit", "COBIT 2019: 7-phase gap → implement → audit", "BIA: 6 processes, RTO 15–240min", "PDSA cycle for continuous improvement", "Executive board brief with financial ROI"], githubUrl: null },
  { id: "crypto", title: "Applied Cryptography — MITM, ECB/CBC, RSA", category: "compliance", year: "2024", tags: ["Python", "2-DES MITM", "RSA", "ECB vs CBC", "Digital Signatures"], summary: "Four-part project: MITM attack on 2-DES reducing keyspace 2¹¹² → 2⁵⁷; ECB vs CBC comparison showing pattern leakage; hybrid RSA+DES secure messaging with SHA-1 digital signatures and Miller-Rabin primality; Square-and-Multiply modular exponentiation for efficient RSA.", highlights: ["MITM: 2¹¹² → 2⁵⁷ keyspace reduction", "ECB: pattern leakage visualized on encrypted images", "RSA+DES hybrid: session key + data encryption", "SHA-1 signature for integrity + non-repudiation", "Square-and-Multiply: O(log e) RSA exponentiation"], githubUrl: null },
  { id: "hopechain", title: "HopeChain — Blockchain Donation DApp", category: "other", year: "2024", tags: ["Solidity", "Ethereum", "Ethers.js", "Smart Contract Security"], summary: "Ethereum donation platform with on-chain ledger. Analyzed reentrancy (mitigated via transfer()), Sybil attacks, donor address privacy leakage. Proposed zkSNARK privacy and multisig + timelock governance. Jordan NGO regulatory analysis included.", highlights: ["Reentrancy mitigated via transfer() pattern", "Sybil: multi-wallet bypass → off-chain controls needed", "Privacy: donor addresses public → zkSNARK proposed", "Jordan regulatory: NGO + crypto banking constraints", "Proposed: multisig + timelocks + pausable contract"], githubUrl: null },
  { id: "spark", title: "SPARK — Wearable INR Monitoring Patch", category: "other", year: "2025", tags: ["Team Leadership", "Biomedical", "IoT", "Market Validation", "HIPAA"], summary: "Led 6-person cross-disciplinary team building a wearable INR monitoring patch for post-stroke patients. Electrochemical sensors + Bluetooth 5.0 + mobile app + AI-powered emergency alerts. Validated $1.65M SOM in Jordan's $55M rehabilitation device market. HIPAA-compliant architecture.", highlights: ["Led 6-person cross-disciplinary team", "$1.65M SOM validated in $55M Jordan rehab market", "Non-invasive continuous INR monitoring", "AI emergency alerts: patient + caregiver + doctor", "Targeting FDA, CE, JFDA certification"], githubUrl: null },
];

// ============================================================
// DESIGN TOKENS
// ============================================================
const C = {
  bg: "#020602", surface: "#030c03", border: "#0d1f0d",
  green: "#00ff90", greenDim: "#00ff9040", greenFaint: "#00ff9015",
  amber: "#ffaa00", red: "#ff5555", blue: "#60c8ff", purple: "#c060ff",
  text: "#c8e8c8", textDim: "#4a7a4a", textFaint: "#1a3a1a",
  mono: "'JetBrains Mono', monospace", serif: "'Lora', serif",
};

const CAT_META = {
  pentest:    { color: "#ff6060", label: "▲ Pentest / Red" },
  soc:        { color: C.green,  label: "▼ SOC / DFIR" },
  cloud:      { color: C.blue,   label: "☁ Cloud / Infra" },
  compliance: { color: C.amber,  label: "⚖ Compliance / Risk" },
  other:      { color: C.purple, label: "◆ Other" },
};

const PROJECT_CATS = [
  { key: "all", label: "All" },
  ...Object.entries(CAT_META).map(([k, v]) => ({ key: k, label: v.label })),
];

// ============================================================
// SECURITY — SHA-256 via Web Crypto API (no external lib)
// ============================================================
async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ============================================================
// SMALL SHARED COMPONENTS
// ============================================================
function Tag({ label, color }) {
  return <span style={{ fontSize: "0.57rem", padding: "2px 8px", border: `1px solid ${color || C.greenDim}`, color: color || C.green, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: C.mono, whiteSpace: "nowrap" }}>{label}</span>;
}
function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
      <div style={{ fontSize: "0.57rem", color: C.textFaint, letterSpacing: "0.25em", fontFamily: C.mono }}>{children}</div>
      <div style={{ flex: 1, height: "1px", background: C.border }} />
    </div>
  );
}
function Btn({ onClick, children, color, small, danger }) {
  const [h, setH] = useState(false);
  const c = danger ? C.red : color || C.green;
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: small ? "4px 10px" : "8px 16px", background: h ? c + "20" : "none", border: `1px solid ${h ? c + "60" : C.border}`, color: h ? c : C.textDim, fontFamily: C.mono, fontSize: small ? "0.6rem" : "0.65rem", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}
function Field({ label, value, onChange, placeholder, type = "text", rows }) {
  return (
    <div>
      <div style={{ fontSize: "0.57rem", color: C.textFaint, fontFamily: C.mono, marginBottom: "4px", letterSpacing: "0.1em" }}>{label}</div>
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          style={{ width: "100%", padding: "7px 10px", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: C.mono, fontSize: "0.7rem", outline: "none", resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", padding: "7px 10px", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: C.mono, fontSize: "0.7rem", outline: "none" }} />
      )}
    </div>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <div>
      <div style={{ fontSize: "0.57rem", color: C.textFaint, fontFamily: C.mono, marginBottom: "4px", letterSpacing: "0.1em" }}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "7px 10px", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: C.mono, fontSize: "0.7rem", outline: "none" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
function Toast({ msg, ok }) {
  return msg ? (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", padding: "10px 18px", background: C.surface, border: `1px solid ${ok ? C.green : C.red}`, color: ok ? C.green : C.red, fontFamily: C.mono, fontSize: "0.68rem", zIndex: 999, animation: "fadeUp 0.2s ease" }}>{msg}</div>
  ) : null;
}

// ============================================================
// BOOT SCREEN
// ============================================================
function BootScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const boot = [
    { text: "$ ssh farouq@farouqhassan.dev", delay: 300 },
    { text: "Connection established. Authenticating...", delay: 700 },
    { text: "$ id → SOC Analyst | Pentester | DFIR | Amman, JO", delay: 1300 },
    { text: "$ ls /certs → CDSA ✓  CWSE ✓  CAPT ✓  NCA ✓", delay: 2000 },
    { text: "$ mount /writeups /projects /roadmap → [OK]", delay: 2800 },
    { text: "$ Welcome.", delay: 3500 },
  ];
  useEffect(() => {
    boot.forEach(({ text, delay }) => setTimeout(() => setLines(p => [...p, text]), delay));
    setTimeout(onDone, 4200);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
      <div style={{ width: "min(540px, 90vw)" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: C.mono, fontSize: "0.75rem", lineHeight: 2.4, color: i === lines.length - 1 ? C.green : "#2a5a2a", animation: "fadeUp 0.3s ease" }}>{l}</div>
        ))}
        {lines.length < boot.length && <div style={{ fontFamily: C.mono, fontSize: "0.75rem", lineHeight: 2.4, color: C.green }}><span style={{ animation: "blink 1s step-end infinite" }}>▋</span></div>}
      </div>
    </div>
  );
}

// ============================================================
// PUBLIC VIEW COMPONENTS
// ============================================================
function CertCard({ cert }) {
  const [h, setH] = useState(false);
  const col = cert.status === "earned" ? C.green : cert.status === "in-progress" ? C.amber : C.textFaint;
  const clickable = cert.status === "earned" && cert.badgeUrl;
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={() => clickable && window.open(cert.badgeUrl, "_blank")}
      style={{ padding: "16px 18px", border: `1px solid ${h ? col + "40" : C.border}`, background: h ? C.surface : C.bg, transition: "all 0.2s", cursor: clickable ? "pointer" : "default", position: "relative" }}>
      {clickable && h && <div style={{ position: "absolute", top: "10px", right: "10px", fontSize: "0.6rem", color: C.green }}>↗</div>}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "0.88rem", color: col, fontWeight: 700, fontFamily: C.mono }}>{cert.name}</span>
        <span style={{ fontSize: "0.57rem", color: col, letterSpacing: "0.1em" }}>
          {cert.status === "earned" ? "✓ EARNED" : cert.status === "in-progress" ? "IN PROGRESS" : "PLANNED"}
        </span>
      </div>
      <div style={{ fontSize: "0.63rem", color: C.textDim, fontFamily: C.mono, marginBottom: "3px" }}>{cert.full}</div>
      <div style={{ fontSize: "0.58rem", color: C.textFaint, marginBottom: "8px" }}>{cert.issuer} · {cert.year}</div>
      {cert.description && <div style={{ fontSize: "0.67rem", color: "#3a6a3a", lineHeight: 1.7, fontFamily: C.serif }}>{cert.description}</div>}
      {cert.status === "in-progress" && cert.pct > 0 && (
        <div style={{ marginTop: "8px" }}>
          <div style={{ fontSize: "0.58rem", color: "#5a7a3a", fontFamily: C.mono, marginBottom: "3px" }}>{cert.pct}% complete</div>
          <div style={{ height: "2px", background: "#0a1a0a" }}><div style={{ width: `${cert.pct}%`, height: "100%", background: C.amber }} /></div>
        </div>
      )}
      {clickable && <div style={{ marginTop: "8px", fontSize: "0.58rem", color: h ? C.green : C.textFaint, fontFamily: C.mono, transition: "color 0.2s" }}>{h ? "→ view certificate" : "$ cat cert.badge"}</div>}
    </div>
  );
}

function WriteupCard({ post, compact = false }) {
  const [h, setH] = useState(false);
  const clickable = post.published && post.url;
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={() => clickable && window.open(post.url, "_blank")}
      style={{ padding: compact ? "14px 20px" : "22px 26px", border: compact ? "none" : `1px solid ${h && clickable ? "#00ff9030" : C.border}`, background: h && clickable ? C.surface : C.bg, transition: "all 0.2s", cursor: clickable ? "pointer" : "default", opacity: post.published ? 1 : 0.55, position: "relative", overflow: "hidden" }}>
      {h && clickable && <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "100%", background: C.green }} />}
      <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
        {post.tags.map(t => <Tag key={t} label={t} />)}
        {!post.published && <Tag label="COMING SOON" color="#3a3a1a" />}
      </div>
      <div style={{ fontSize: compact ? "0.82rem" : "0.9rem", color: "#e8ffe8", fontFamily: C.mono, fontWeight: 500, marginBottom: "3px" }}>{post.title}</div>
      <div style={{ fontSize: "0.63rem", color: C.textDim, fontFamily: C.mono, marginBottom: compact ? 0 : "8px" }}>{post.date} · {post.platform}</div>
      {!compact && <div style={{ fontSize: "0.75rem", color: "#4a7a4a", lineHeight: 1.8, fontFamily: C.serif }}>{post.excerpt}</div>}
      {compact && post.excerpt && <div style={{ fontSize: "0.68rem", color: "#3a6a3a", lineHeight: 1.7, fontFamily: C.serif, marginTop: "4px" }}>{post.excerpt}</div>}
      {clickable && <div style={{ marginTop: "8px", fontSize: "0.63rem", color: h ? C.green : C.textFaint, fontFamily: C.mono, transition: "color 0.2s" }}>{h ? "→ read on " + post.platform : "$ cat writeup.md"}</div>}
    </div>
  );
}

// Groups writeups by collection — collapsible on the public page
function WriteupCollection({ name, posts }) {
  const [open, setOpen] = useState(true);
  const liveCount = posts.filter(p => p.published).length;
  return (
    <div style={{ marginBottom: "16px", border: `1px solid ${C.border}` }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "12px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "0.57rem", color: C.green, letterSpacing: "0.15em", fontFamily: C.mono }}>◈ {name.toUpperCase()}</span>
          <span style={{ fontSize: "0.57rem", color: C.textFaint, fontFamily: C.mono }}>{liveCount} live · {posts.length - liveCount} coming</span>
        </div>
        <span style={{ fontSize: "0.6rem", color: C.textFaint }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {posts.map((p, i) => (
            <div key={p.id} style={{ borderBottom: i < posts.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <WriteupCard post={p} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  const [h, setH] = useState(false);
  const [exp, setExp] = useState(false);
  const col = CAT_META[project.category]?.color || C.green;
  return (
    <div style={{ border: `1px solid ${h ? col + "25" : C.border}`, background: h ? C.surface : C.bg, transition: "all 0.2s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: "0.57rem", color: col, letterSpacing: "0.12em", marginBottom: "4px" }}>{CAT_META[project.category]?.label} · {project.year}</div>
        <div style={{ fontSize: "0.86rem", color: "#e8ffe8", fontWeight: 600, fontFamily: C.mono, marginBottom: "8px" }}>{project.title}</div>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
          {project.tags.map(t => <Tag key={t} label={t} color={col + "70"} />)}
        </div>
        <div style={{ fontSize: "0.73rem", color: "#5a8a5a", lineHeight: 1.8, fontFamily: C.serif }}>{project.summary}</div>
        {exp && project.highlights?.length > 0 && (
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: "0.57rem", color: C.textFaint, letterSpacing: "0.1em", marginBottom: "6px" }}>KEY FINDINGS //</div>
            {project.highlights.map((h2, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", fontSize: "0.7rem", color: "#5a8a5a", fontFamily: C.mono, padding: "4px 0", borderBottom: i < project.highlights.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ color: col + "70" }}>→</span> {h2}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Btn small onClick={() => setExp(e => !e)}>{exp ? "▲ collapse" : "▼ details"}</Btn>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer"
              style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: C.mono, textDecoration: "none", border: `1px solid ${C.border}`, padding: "3px 10px", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = C.green; e.currentTarget.style.borderColor = C.greenDim; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderColor = C.border; }}>
              ↗ github
            </a>
          )}
          {project.projectUrl && (
            <a href={project.projectUrl} target="_blank" rel="noreferrer"
              style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: C.mono, textDecoration: "none", border: `1px solid ${C.border}`, padding: "3px 10px", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = C.blue; e.currentTarget.style.borderColor = C.blue + "40"; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderColor = C.border; }}>
              ↗ project link
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function RoadmapPhase({ phase }) {
  const [open, setOpen] = useState(phase.status === "active");
  const [openW, setOpenW] = useState({ 0: true });
  return (
    <div style={{ border: `1px solid ${phase.status === "active" ? "#00ff9018" : C.border}`, marginBottom: "6px" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: phase.status === "active" ? C.surface : C.bg }}>
        <div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "3px" }}>
            <span style={{ fontSize: "0.57rem", color: phase.status === "active" ? C.green : C.textFaint, letterSpacing: "0.12em" }}>{phase.status === "active" ? "▶ ACTIVE" : "○ UPCOMING"}</span>
            <span style={{ fontSize: "0.57rem", color: C.textFaint, fontFamily: C.mono }}>{phase.days}</span>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#e8ffe8", fontFamily: C.mono }}>{phase.phase} — {phase.title}</div>
        </div>
        <span style={{ color: C.textFaint, fontSize: "0.7rem" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, fontSize: "0.7rem", color: "#4a7a4a", fontFamily: C.serif }}>{phase.goal}</div>
          {phase.weeks.map((week, wi) => (
            <div key={wi} style={{ borderBottom: wi < phase.weeks.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div onClick={() => setOpenW(s => ({ ...s, [wi]: !s[wi] }))} style={{ padding: "10px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.58rem", color: C.textFaint, fontFamily: C.mono }}>{week.week}</span>
                  <span style={{ fontSize: "0.73rem", color: "#9aba9a", fontFamily: C.mono }}>{week.title}</span>
                  {week.writeupUrl && <a href={week.writeupUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: "0.57rem", color: C.green, fontFamily: C.mono, textDecoration: "none", border: `1px solid ${C.greenDim}`, padding: "1px 6px" }}>↗ writeup</a>}
                </div>
                <span style={{ fontSize: "0.6rem", color: C.textFaint }}>{openW[wi] ? "▲" : "▼"}</span>
              </div>
              {openW[wi] && (
                <div style={{ padding: "0 20px 12px 28px" }}>
                  {week.items.map((item, ii) => (
                    <div key={ii} style={{ fontSize: "0.68rem", color: "#4a7a4a", fontFamily: C.mono, padding: "3px 0", display: "flex", gap: "8px" }}>
                      <span style={{ color: C.greenDim }}>→</span> {item}
                    </div>
                  ))}
                  <div style={{ marginTop: "8px", padding: "6px 10px", background: "#020802", border: `1px solid ${C.border}`, fontSize: "0.63rem", color: "#3a6a3a", fontFamily: C.mono }}>
                    deliverable: {week.deliverable}{!week.writeupUrl && <span style={{ color: C.textFaint }}> · writeup coming</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADMIN PANEL — full live CRUD, SHA-256 auth, no code snippets
// ============================================================
function AdminPanel({ data, dispatch }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [tab, setTab] = useState("profile");
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const tryLogin = async () => {
    if (locked) return;
    const hash = await sha256(pw);
    if (hash === ADMIN_HASH) {
      setAuthed(true); setErr("");
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 5) { setLocked(true); setErr("Too many attempts. Reload page to try again."); }
      else setErr(`Wrong password. ${5 - next} attempt${5 - next === 1 ? "" : "s"} left.`);
      setPw("");
    }
  };

  if (!authed) {
    return (
      <div style={{ maxWidth: "380px", margin: "60px auto", padding: "32px", border: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ fontSize: "0.57rem", color: C.textFaint, letterSpacing: "0.2em", marginBottom: "6px", fontFamily: C.mono }}>ADMIN ACCESS //</div>
        <div style={{ fontSize: "0.7rem", color: C.textDim, fontFamily: C.serif, marginBottom: "20px", lineHeight: 1.7 }}>
          Password is verified client-side using SHA-256. No credentials are sent to any server.
        </div>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} disabled={locked}
          onKeyDown={e => e.key === "Enter" && tryLogin()} placeholder="password"
          style={{ width: "100%", padding: "10px 12px", background: C.bg, border: `1px solid ${err ? C.red : C.border}`, color: C.text, fontFamily: C.mono, fontSize: "0.78rem", outline: "none", marginBottom: "10px" }} />
        {err && <div style={{ fontSize: "0.63rem", color: C.red, fontFamily: C.mono, marginBottom: "10px" }}>{err}</div>}
        <Btn onClick={tryLogin} color={C.green}>→ unlock</Btn>
        <div style={{ marginTop: "14px", fontSize: "0.58rem", color: C.textFaint, fontFamily: C.mono }}>
          To change password: hash your new password with SHA-256, replace ADMIN_HASH in the source file.
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "writeups", label: "Writeups" },
    { key: "certs", label: "Certs" },
    { key: "projects", label: "Projects" },
    { key: "roadmaps", label: "Roadmaps" },
  ];

  return (
    <div>
      <Toast msg={toast?.msg} ok={toast?.ok} />
      {/* Session indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "0.6rem", color: C.green, fontFamily: C.mono }}>● admin session active</div>
        <Btn small onClick={() => setAuthed(false)} danger>✕ logout</Btn>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", marginBottom: "28px" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "8px 16px", background: tab === t.key ? C.greenFaint : C.bg, border: `1px solid ${tab === t.key ? C.greenDim : C.border}`, color: tab === t.key ? C.green : C.textDim, fontFamily: C.mono, fontSize: "0.63rem", cursor: "pointer", letterSpacing: "0.08em" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE ── */}
      {tab === "profile" && <AdminProfile profile={data.profile} dispatch={dispatch} showToast={showToast} />}
      {tab === "writeups" && <AdminWriteups writeups={data.writeups} dispatch={dispatch} showToast={showToast} />}
      {tab === "certs" && <AdminCerts certs={data.certs} dispatch={dispatch} showToast={showToast} />}
      {tab === "projects" && <AdminProjects projects={data.projects} dispatch={dispatch} showToast={showToast} />}
      {tab === "roadmaps" && <AdminRoadmaps roadmaps={data.roadmaps} dispatch={dispatch} showToast={showToast} />}
    </div>
  );
}

// ── PROFILE EDITOR ──
function AdminProfile({ profile, dispatch, showToast }) {
  const [form, setForm] = useState({ ...profile, current: profile.current.join("\n") });
  const save = () => {
    dispatch({ type: "SET_PROFILE", payload: { ...form, current: form.current.split("\n").map(s => s.trim()).filter(Boolean) } });
    showToast("Profile saved");
  };
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));
  return (
    <div>
      <SectionLabel>EDIT PROFILE //</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
        <Field label="Name" value={form.name} onChange={f("name")} />
        <Field label="Title" value={form.title} onChange={f("title")} />
        <Field label="Email" value={form.email} onChange={f("email")} />
        <Field label="Location" value={form.location} onChange={f("location")} />
        <Field label="LinkedIn URL" value={form.linkedin} onChange={f("linkedin")} />
        <Field label="GitHub URL" value={form.github} onChange={f("github")} />
        <Field label="Medium URL" value={form.medium} onChange={f("medium")} />
      </div>
      <div style={{ marginBottom: "10px" }}><Field label="Bio" value={form.bio} onChange={f("bio")} rows={3} /></div>
      <div style={{ marginBottom: "14px" }}><Field label="Current Focus (one item per line)" value={form.current} onChange={f("current")} rows={6} placeholder={"Internship @ SCC-JAF — month 8\nHTB CWES — 70%"} /></div>
      <Btn onClick={save}>→ save profile</Btn>
    </div>
  );
}

// ── WRITEUPS EDITOR ──
function AdminWriteups({ writeups, dispatch, showToast }) {
  const blank = { title: "", date: "", platform: "HTB", collection: "", tags: "", excerpt: "", url: "", published: false };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  // All unique collections already in use — for the datalist hint
  const existingCollections = [...new Set(writeups.map(w => w.collection).filter(Boolean))];

  const toObj = (f) => ({ ...f, tags: f.tags.split(",").map(s => s.trim()).filter(Boolean), id: editId || Date.now(), collection: f.collection.trim() || "Uncategorized" });
  const save = () => {
    if (!form.title.trim()) return showToast("Title required", false);
    if (editId) { dispatch({ type: "UPDATE_WRITEUP", payload: toObj(form) }); showToast("Writeup updated"); }
    else { dispatch({ type: "ADD_WRITEUP", payload: toObj(form) }); showToast("Writeup added"); }
    setForm(blank); setEditId(null);
  };
  const edit = (w) => { setForm({ ...w, tags: w.tags.join(", "), collection: w.collection || "" }); setEditId(w.id); };
  const del = (id) => { dispatch({ type: "DEL_WRITEUP", id }); showToast("Deleted"); };
  return (
    <div>
      <SectionLabel>{editId ? "EDIT WRITEUP //" : "ADD WRITEUP //"}</SectionLabel>
      <div style={{ marginBottom: "10px", padding: "12px 14px", background: C.surface, border: `1px solid #0a2a0a`, fontSize: "0.65rem", color: C.textDim, fontFamily: C.serif, lineHeight: 1.8 }}>
        <strong style={{ color: "#7ab87a" }}>Collections</strong> group your writeups on the public page — like folders. Examples: "HTB Machines", "Detection Engineering Series", "Medium Articles", "CTF Writeups". You create the collection names yourself by just typing them.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
        <Field label="Title" value={form.title} onChange={f("title")} placeholder="HTB Machine — Writeup" />
        <Field label="Date" value={form.date} onChange={f("date")} placeholder="Mar 2026" />
        <Field label="Platform (shown on card)" value={form.platform} onChange={f("platform")} placeholder="HTB / Medium / Blog" />
        <div>
          <div style={{ fontSize: "0.57rem", color: C.textFaint, fontFamily: C.mono, marginBottom: "4px", letterSpacing: "0.1em" }}>Collection (group/folder name)</div>
          <input list="collections-list" value={form.collection} onChange={e => f("collection")(e.target.value)}
            placeholder="HTB Machines / Medium Articles / ..."
            style={{ width: "100%", padding: "7px 10px", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: C.mono, fontSize: "0.7rem", outline: "none" }} />
          <datalist id="collections-list">{existingCollections.map(c => <option key={c} value={c} />)}</datalist>
        </div>
        <Field label="Tags (comma separated)" value={form.tags} onChange={f("tags")} placeholder="HTB, Linux, PrivEsc" />
        <Field label="URL (leave blank if unpublished)" value={form.url} onChange={f("url")} placeholder="https://..." />
        <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "4px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.68rem", color: C.textDim, fontFamily: C.mono, cursor: "pointer" }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} />
            Published & live
          </label>
        </div>
      </div>
      <div style={{ marginBottom: "12px" }}><Field label="Excerpt — one sentence about what this covers" value={form.excerpt} onChange={f("excerpt")} rows={2} placeholder="Full walkthrough from recon to root — kernel exploit for PrivEsc." /></div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Btn onClick={save}>{editId ? "→ update" : "→ add writeup"}</Btn>
        {editId && <Btn onClick={() => { setForm(blank); setEditId(null); }}>cancel</Btn>}
      </div>

      <div style={{ marginTop: "24px" }}>
        <SectionLabel>ALL WRITEUPS //</SectionLabel>
        {/* Group by collection in admin list too */}
        {[...new Set(writeups.map(w => w.collection || "Uncategorized"))].map(col => (
          <div key={col} style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "0.57rem", color: C.green, letterSpacing: "0.12em", marginBottom: "6px", fontFamily: C.mono }}>◈ {col.toUpperCase()}</div>
            {writeups.filter(w => (w.collection || "Uncategorized") === col).map(w => (
              <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", border: `1px solid ${C.border}`, marginBottom: "3px" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#c8e8c8", fontFamily: C.mono }}>{w.title}</div>
                  <div style={{ fontSize: "0.58rem", color: C.textDim, fontFamily: C.mono }}>{w.date} · {w.platform} · {w.published ? <span style={{ color: C.green }}>live</span> : <span style={{ color: C.textFaint }}>draft</span>}</div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <Btn small onClick={() => edit(w)}>edit</Btn>
                  <Btn small danger onClick={() => del(w.id)}>del</Btn>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CERTS EDITOR ──
const BLANK_CERT = { name: "", full: "", issuer: "", year: new Date().getFullYear().toString(), status: "planned", pct: 0, badgeUrl: "", description: "" };
function CertForm({ initial, onSave, onCancel, saveLabel }) {
  const [form, setForm] = useState({ ...initial });
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));
  return (
    <div style={{ padding: "14px", background: C.surface, border: `1px solid ${C.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        <Field label="Short name (e.g. CPTS)" value={form.name} onChange={f("name")} placeholder="CPTS" />
        <Field label="Full name" value={form.full} onChange={f("full")} placeholder="Certified Penetration Testing Specialist" />
        <Field label="Issuer" value={form.issuer} onChange={f("issuer")} placeholder="Hack The Box" />
        <Field label="Expected year" value={form.year} onChange={f("year")} placeholder="2026" />
        <Select label="Status" value={form.status} onChange={f("status")} options={[{ value: "earned", label: "✓ Earned" }, { value: "in-progress", label: "In Progress" }, { value: "planned", label: "Planned" }]} />
        <Field label="Progress % (0 if not started)" value={String(form.pct)} onChange={f("pct")} type="number" />
        <div style={{ gridColumn: "1/-1" }}><Field label="Badge / Verify URL (leave blank until earned)" value={form.badgeUrl || ""} onChange={f("badgeUrl")} placeholder="https://..." /></div>
        <div style={{ gridColumn: "1/-1" }}><Field label="Description — what this cert covers" value={form.description} onChange={f("description")} rows={2} placeholder="What you learn / what this validates" /></div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Btn onClick={() => onSave({ ...form, pct: Number(form.pct), badgeUrl: form.badgeUrl || null })}>{saveLabel}</Btn>
        {onCancel && <Btn onClick={onCancel}>cancel</Btn>}
      </div>
    </div>
  );
}
function AdminCerts({ certs, dispatch, showToast }) {
  const [editId, setEditId] = useState(null);
  const [adding, setAdding] = useState(false);
  return (
    <div>
      {/* Add new */}
      <SectionLabel>ADD NEW CERT //</SectionLabel>
      {adding ? (
        <CertForm initial={{ ...BLANK_CERT }}
          onSave={(c) => { dispatch({ type: "ADD_CERT", payload: { ...c, id: Date.now().toString() } }); showToast("Cert added"); setAdding(false); }}
          onCancel={() => setAdding(false)} saveLabel="→ add cert" />
      ) : (
        <Btn onClick={() => setAdding(true)}>+ add new certification</Btn>
      )}

      <div style={{ marginTop: "24px" }}>
        <SectionLabel>YOUR CERTIFICATIONS //</SectionLabel>
        <div style={{ marginBottom: "12px", fontSize: "0.65rem", color: C.textDim, fontFamily: C.serif, lineHeight: 1.8 }}>
          Click edit to update progress, badge URL, or flip the status to "Earned" when you pass.
        </div>
        {certs.map(c => (
          <div key={c.id} style={{ border: `1px solid ${C.border}`, marginBottom: "4px" }}>
            {editId === c.id ? (
              <CertForm initial={{ ...c, badgeUrl: c.badgeUrl || "" }}
                onSave={(updated) => { dispatch({ type: "UPDATE_CERT", payload: { ...updated, id: c.id } }); showToast("Cert updated"); setEditId(null); }}
                onCancel={() => setEditId(null)} saveLabel="→ save changes" />
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: c.status === "earned" ? C.green : c.status === "in-progress" ? C.amber : C.textFaint, fontFamily: C.mono, fontWeight: 700 }}>{c.name}</span>
                  <span style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: C.mono, marginLeft: "10px" }}>{c.full} · {c.issuer}</span>
                  <span style={{ fontSize: "0.6rem", color: c.status === "earned" ? C.green : c.status === "in-progress" ? C.amber : C.textFaint, fontFamily: C.mono, marginLeft: "10px" }}>
                    {c.status === "earned" ? "✓ earned" : c.status === "in-progress" ? `in progress (${c.pct}%)` : "planned"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <Btn small onClick={() => setEditId(c.id)}>edit</Btn>
                  <Btn small danger onClick={() => { dispatch({ type: "DEL_CERT", id: c.id }); showToast("Deleted"); }}>del</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROJECTS EDITOR ──
function AdminProjects({ projects, dispatch, showToast }) {
  const blank = { title: "", category: "pentest", year: new Date().getFullYear().toString(), tags: "", summary: "", highlights: "", githubUrl: "", projectUrl: "" };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const f = (key) => (val) => setForm(p => ({ ...p, [key]: val }));
  const toObj = () => ({
    ...form,
    id: editId || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
    highlights: form.highlights.split("\n").map(s => s.trim()).filter(Boolean),
    githubUrl: form.githubUrl || null,
    projectUrl: form.projectUrl || null,
  });
  const save = () => {
    if (!form.title.trim()) return showToast("Title required", false);
    if (editId) { dispatch({ type: "UPDATE_PROJECT", payload: toObj() }); showToast("Project updated"); }
    else { dispatch({ type: "ADD_PROJECT", payload: toObj() }); showToast("Project added"); }
    setForm(blank); setEditId(null);
  };
  const edit = (p) => {
    setForm({ ...p, tags: p.tags.join(", "), highlights: p.highlights.join("\n"), githubUrl: p.githubUrl || "", projectUrl: p.projectUrl || "" });
    setEditId(p.id);
  };
  const del = (id) => { dispatch({ type: "DEL_PROJECT", id }); showToast("Deleted"); };
  return (
    <div>
      <SectionLabel>{editId ? "EDIT PROJECT //" : "ADD PROJECT //"}</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        <Field label="Title" value={form.title} onChange={f("title")} placeholder="Project name" />
        <Field label="Year" value={form.year} onChange={f("year")} placeholder="2025" />
        <Select label="Category" value={form.category} onChange={f("category")} options={Object.entries(CAT_META).map(([k, v]) => ({ value: k, label: v.label }))} />
        <Field label="GitHub Repo URL (optional)" value={form.githubUrl} onChange={f("githubUrl")} placeholder="https://github.com/farouq7assan0o/..." />
        <Field label="Project / Demo / Report URL (optional)" value={form.projectUrl} onChange={f("projectUrl")} placeholder="https://... (PDF, demo, live site, etc.)" />
        <div style={{ gridColumn: "1/-1" }}><Field label="Tags (comma separated)" value={form.tags} onChange={f("tags")} placeholder="Tool, Framework, Technique" /></div>
        <div style={{ gridColumn: "1/-1" }}><Field label="Summary (2–3 sentences for visitors)" value={form.summary} onChange={f("summary")} rows={3} /></div>
        <div style={{ gridColumn: "1/-1" }}><Field label="Key Findings (one per line — shown in Details)" value={form.highlights} onChange={f("highlights")} rows={5} placeholder={"Finding or stat\nAnother key detail"} /></div>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        <Btn onClick={save}>{editId ? "→ update" : "→ add project"}</Btn>
        {editId && <Btn onClick={() => { setForm(blank); setEditId(null); }}>cancel</Btn>}
      </div>

      <SectionLabel>ALL PROJECTS //</SectionLabel>
      {Object.entries(CAT_META).map(([cat, meta]) => {
        const catProjects = projects.filter(p => p.category === cat);
        if (!catProjects.length) return null;
        return (
          <div key={cat} style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "0.57rem", color: meta.color, letterSpacing: "0.12em", marginBottom: "6px", fontFamily: C.mono }}>{meta.label}</div>
            {catProjects.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", border: `1px solid ${C.border}`, marginBottom: "2px" }}>
                <div style={{ fontSize: "0.7rem", color: "#c8e8c8", fontFamily: C.mono }}>{p.title} <span style={{ color: C.textFaint, fontSize: "0.6rem" }}>({p.year})</span></div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <Btn small onClick={() => edit(p)}>edit</Btn>
                  <Btn small danger onClick={() => del(p.id)}>del</Btn>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── ROADMAPS EDITOR ──
function AdminRoadmaps({ roadmaps, dispatch, showToast }) {
  const [selected, setSelected] = useState(roadmaps[0]?.id || null);
  const [newRmName, setNewRmName] = useState("");
  const [newRmDesc, setNewRmDesc] = useState("");
  const [editPhaseId, setEditPhaseId] = useState(null);
  const [editWeekKey, setEditWeekKey] = useState(null); // "phaseId:weekId"
  const [weekForm, setWeekForm] = useState(null);

  const rm = roadmaps.find(r => r.id === selected);

  const addRoadmap = () => {
    if (!newRmName.trim()) return showToast("Name required", false);
    dispatch({ type: "ADD_ROADMAP", payload: { id: Date.now().toString(), name: newRmName, description: newRmDesc, phases: [] } });
    showToast("Roadmap added"); setNewRmName(""); setNewRmDesc("");
  };
  const delRoadmap = (id) => { dispatch({ type: "DEL_ROADMAP", id }); if (selected === id) setSelected(roadmaps[0]?.id); showToast("Deleted"); };

  const addPhase = () => {
    if (!rm) return;
    const p = { id: Date.now().toString(), phase: `Phase ${rm.phases.length + 1}`, days: "Days X–Y", title: "New Phase", status: "upcoming", goal: "", weeks: [] };
    dispatch({ type: "ADD_PHASE", roadmapId: rm.id, payload: p }); showToast("Phase added");
  };
  const updatePhase = (phaseId, field, val) => dispatch({ type: "UPDATE_PHASE", roadmapId: rm.id, phaseId, field, val });
  const delPhase = (phaseId) => { dispatch({ type: "DEL_PHASE", roadmapId: rm.id, phaseId }); showToast("Phase deleted"); };

  const startEditWeek = (phase, week) => {
    setEditWeekKey(`${phase.id}:${week.id}`);
    setWeekForm({ ...week, items: week.items.join("\n") });
  };
  const saveWeek = () => {
    if (!weekForm) return;
    const [phaseId] = editWeekKey.split(":");
    dispatch({ type: "UPDATE_WEEK", roadmapId: rm.id, phaseId, payload: { ...weekForm, items: weekForm.items.split("\n").map(s => s.trim()).filter(Boolean) } });
    showToast("Week updated"); setEditWeekKey(null); setWeekForm(null);
  };
  const addWeek = (phaseId) => {
    const w = { id: Date.now().toString(), week: "Week X", title: "New Week", items: [], deliverable: "", writeupUrl: null };
    dispatch({ type: "ADD_WEEK", roadmapId: rm.id, phaseId, payload: w }); showToast("Week added");
  };
  const delWeek = (phaseId, weekId) => { dispatch({ type: "DEL_WEEK", roadmapId: rm.id, phaseId, weekId }); showToast("Week deleted"); };

  return (
    <div>
      {/* Roadmap selector */}
      <SectionLabel>YOUR ROADMAPS //</SectionLabel>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {roadmaps.map(r => (
          <div key={r.id} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <button onClick={() => setSelected(r.id)} style={{ padding: "6px 14px", background: selected === r.id ? C.greenFaint : "none", border: `1px solid ${selected === r.id ? C.greenDim : C.border}`, color: selected === r.id ? C.green : C.textDim, fontFamily: C.mono, fontSize: "0.63rem", cursor: "pointer" }}>{r.name}</button>
            {roadmaps.length > 1 && <Btn small danger onClick={() => delRoadmap(r.id)}>✕</Btn>}
          </div>
        ))}
      </div>
      {/* Add new roadmap */}
      <div style={{ padding: "14px", border: `1px dashed ${C.border}`, marginBottom: "24px" }}>
        <div style={{ fontSize: "0.57rem", color: C.textFaint, letterSpacing: "0.1em", marginBottom: "8px", fontFamily: C.mono }}>ADD NEW ROADMAP</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8px", marginBottom: "8px" }}>
          <Field label="Name" value={newRmName} onChange={setNewRmName} placeholder="e.g. CPTS Study Plan" />
          <Field label="Description" value={newRmDesc} onChange={setNewRmDesc} placeholder="What this roadmap achieves" />
        </div>
        <Btn small onClick={addRoadmap}>+ add roadmap</Btn>
      </div>

      {rm && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "0.85rem", color: "#e8ffe8", fontFamily: C.mono }}>{rm.name}</div>
            <Btn small onClick={addPhase}>+ add phase</Btn>
          </div>

          {rm.phases.map(phase => (
            <div key={phase.id} style={{ border: `1px solid ${C.border}`, marginBottom: "8px" }}>
              {/* Phase header */}
              <div style={{ padding: "12px 14px", background: C.surface, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 1fr", gap: "6px", flex: 1, marginRight: "10px" }}>
                  <Field label="Phase" value={phase.phase} onChange={v => updatePhase(phase.id, "phase", v)} placeholder="Phase 1" />
                  <Field label="Days" value={phase.days} onChange={v => updatePhase(phase.id, "days", v)} placeholder="Days 1–30" />
                  <Field label="Title" value={phase.title} onChange={v => updatePhase(phase.id, "title", v)} placeholder="Phase title" />
                  <Select label="Status" value={phase.status} onChange={v => updatePhase(phase.id, "status", v)} options={[{ value: "active", label: "Active ▶" }, { value: "upcoming", label: "Upcoming ○" }, { value: "done", label: "Done ✓" }]} />
                  <div style={{ gridColumn: "1/-1" }}><Field label="Goal" value={phase.goal} onChange={v => updatePhase(phase.id, "goal", v)} rows={1} /></div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <Btn small onClick={() => addWeek(phase.id)}>+ week</Btn>
                  <Btn small danger onClick={() => delPhase(phase.id)}>del phase</Btn>
                </div>
              </div>
              {/* Weeks */}
              {phase.weeks.map(week => (
                <div key={week.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  {editWeekKey === `${phase.id}:${week.id}` && weekForm ? (
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "6px", marginBottom: "6px" }}>
                        <Field label="Week label" value={weekForm.week} onChange={v => setWeekForm(p => ({ ...p, week: v }))} />
                        <Field label="Title" value={weekForm.title} onChange={v => setWeekForm(p => ({ ...p, title: v }))} />
                        <div style={{ gridColumn: "1/-1" }}><Field label="Tasks (one per line)" value={weekForm.items} onChange={v => setWeekForm(p => ({ ...p, items: v }))} rows={4} /></div>
                        <Field label="Deliverable" value={weekForm.deliverable} onChange={v => setWeekForm(p => ({ ...p, deliverable: v }))} />
                        <Field label="Writeup URL (when published)" value={weekForm.writeupUrl || ""} onChange={v => setWeekForm(p => ({ ...p, writeupUrl: v || null }))} placeholder="https://..." />
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}><Btn small onClick={saveWeek}>→ save week</Btn><Btn small onClick={() => { setEditWeekKey(null); setWeekForm(null); }}>cancel</Btn></div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px 8px 24px" }}>
                      <div>
                        <span style={{ fontSize: "0.63rem", color: C.textFaint, fontFamily: C.mono }}>{week.week} — </span>
                        <span style={{ fontSize: "0.7rem", color: "#9aba9a", fontFamily: C.mono }}>{week.title}</span>
                        {week.writeupUrl && <span style={{ fontSize: "0.57rem", color: C.green, fontFamily: C.mono, marginLeft: "8px" }}>↗ linked</span>}
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <Btn small onClick={() => startEditWeek(phase, week)}>edit</Btn>
                        <Btn small danger onClick={() => delWeek(phase.id, week.id)}>del</Btn>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// STATE REDUCER
// ============================================================
function reducer(state, action) {
  switch (action.type) {
    case "SET_PROFILE": return { ...state, profile: action.payload };
    case "ADD_WRITEUP": return { ...state, writeups: [action.payload, ...state.writeups] };
    case "UPDATE_WRITEUP": return { ...state, writeups: state.writeups.map(w => w.id === action.payload.id ? action.payload : w) };
    case "DEL_WRITEUP": return { ...state, writeups: state.writeups.filter(w => w.id !== action.id) };
    case "ADD_CERT": return { ...state, certs: [...state.certs, action.payload] };
    case "UPDATE_CERT": return { ...state, certs: state.certs.map(c => c.id === action.payload.id ? action.payload : c) };
    case "DEL_CERT": return { ...state, certs: state.certs.filter(c => c.id !== action.id) };
    case "ADD_PROJECT": return { ...state, projects: [action.payload, ...state.projects] };
    case "UPDATE_PROJECT": return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case "DEL_PROJECT": return { ...state, projects: state.projects.filter(p => p.id !== action.id) };
    case "ADD_ROADMAP": return { ...state, roadmaps: [...state.roadmaps, action.payload] };
    case "DEL_ROADMAP": return { ...state, roadmaps: state.roadmaps.filter(r => r.id !== action.id) };
    case "ADD_PHASE": return { ...state, roadmaps: state.roadmaps.map(r => r.id === action.roadmapId ? { ...r, phases: [...r.phases, action.payload] } : r) };
    case "UPDATE_PHASE": return { ...state, roadmaps: state.roadmaps.map(r => r.id === action.roadmapId ? { ...r, phases: r.phases.map(p => p.id === action.phaseId ? { ...p, [action.field]: action.val } : p) } : r) };
    case "DEL_PHASE": return { ...state, roadmaps: state.roadmaps.map(r => r.id === action.roadmapId ? { ...r, phases: r.phases.filter(p => p.id !== action.phaseId) } : r) };
    case "ADD_WEEK": return { ...state, roadmaps: state.roadmaps.map(r => r.id === action.roadmapId ? { ...r, phases: r.phases.map(p => p.id === action.phaseId ? { ...p, weeks: [...p.weeks, action.payload] } : p) } : r) };
    case "UPDATE_WEEK": return { ...state, roadmaps: state.roadmaps.map(r => r.id === action.roadmapId ? { ...r, phases: r.phases.map(p => p.id === action.phaseId ? { ...p, weeks: p.weeks.map(w => w.id === action.payload.id ? action.payload : w) } : p) } : r) };
    case "DEL_WEEK": return { ...state, roadmaps: state.roadmaps.map(r => r.id === action.roadmapId ? { ...r, phases: r.phases.map(p => p.id === action.phaseId ? { ...p, weeks: p.weeks.filter(w => w.id !== action.weekId) } : p) } : r) };
    default: return state;
  }
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [booted, setBooted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [section, setSection] = useState("home");
  const [catFilter, setCatFilter] = useState("all");

  const [data, dispatch] = useState(() => ({
    profile: INIT_PROFILE,
    certs: INIT_CERTS,
    writeups: INIT_WRITEUPS,
    projects: INIT_PROJECTS,
    roadmaps: INIT_ROADMAPS,
  }));

  // Wrap dispatch to use reducer
  const dispatchAction = useCallback((action) => {
    dispatch(prev => reducer(prev, action));
  }, []);

  const handleBoot = () => { setBooted(true); setTimeout(() => setVisible(true), 100); };
const nav = ["home", "writeups", "projects", "roadmap", "certs", "about"];
  const filteredProjects = catFilter === "all" ? data.projects : data.projects.filter(p => p.category === catFilter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${C.bg};color:${C.text};min-height:100vh;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#1a3a1a;}
        select option{background:#020602;}
        @keyframes blink{50%{opacity:0;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px #00ff9020;}50%{text-shadow:0 0 36px #00ff9045;}}
        @keyframes scan{0%{top:-2px;}100%{top:100vh;}}
        .section{animation:fadeUp 0.35s ease;}
        .nav-btn{background:none;border:none;font-family:'JetBrains Mono',monospace;font-size:0.63rem;letter-spacing:0.12em;text-transform:uppercase;color:${C.textFaint};cursor:pointer;padding:5px 0;transition:color 0.2s;}
        .nav-btn:hover,.nav-btn.active{color:${C.green};}
        .nav-btn.admin{color:#2a2a1a;}.nav-btn.admin:hover{color:${C.amber};}
        .g2{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:8px;}
        input::placeholder,textarea::placeholder{color:${C.textFaint};}
        input,textarea,select{caret-color:${C.green};}
      `}</style>

      {!booted && <BootScreen onDone={handleBoot} />}

      {booted && (
        <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s", maxWidth: "980px", margin: "0 auto", padding: "0 22px 100px" }}>
          {/* scanline */}
          <div style={{ position: "fixed", left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${C.greenDim},transparent)`, animation: "scan 14s linear infinite", pointerEvents: "none", zIndex: 50 }} />

          {/* HEADER */}
          <header style={{ paddingTop: "44px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "18px" }}>
              <div>
                <div style={{ fontSize: "0.55rem", color: C.textFaint, letterSpacing: "0.3em", marginBottom: "7px", fontFamily: C.mono }}>FAROUQHASSAN.DEV //</div>
                <h1 style={{ fontFamily: "'Lora',serif", fontSize: "clamp(1.7rem,4vw,2.5rem)", color: "#e8ffe8", fontWeight: 600, lineHeight: 1, animation: "glow 6s ease infinite" }}>
                  {data.profile.name}
                </h1>
                <div style={{ fontSize: "0.58rem", color: "#1a4a2a", marginTop: "7px", letterSpacing: "0.2em", fontFamily: C.mono }}>
                  SOC · PENTEST · DFIR · {data.profile.location.toUpperCase()}
                </div>
              </div>
              <nav style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {nav.map(s => <button key={s} className={`nav-btn${section === s ? " active" : ""}${s === "admin" ? " admin" : ""}`} onClick={() => setSection(s)}>{s}</button>)}
              </nav>
            </div>
          </header>

          <main style={{ paddingTop: "36px" }}>

            {/* ── HOME ── */}
            {section === "home" && (
              <div className="section">
                {/* Bio */}
                <div style={{ padding: "20px 24px", border: `1px solid #0f2a0f`, background: C.surface, marginBottom: "28px", position: "relative" }}>
                  <div style={{ position: "absolute", top: "-1px", left: "20px", background: C.green, color: C.bg, fontSize: "0.53rem", padding: "2px 8px", letterSpacing: "0.15em", fontWeight: 700 }}>ACTIVE</div>
                  <div style={{ fontSize: "0.8rem", color: "#7ab87a", lineHeight: 1.95, fontFamily: C.serif, marginTop: "4px" }}>{data.profile.bio}</div>
                </div>

                <SectionLabel>RIGHT NOW //</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "32px" }}>
                  {data.profile.current.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 16px", background: C.bg, border: `1px solid ${C.border}`, fontSize: "0.71rem", color: "#5a8a5a", fontFamily: C.mono }}>
                      <span style={{ color: C.greenDim }}>→</span> {item}
                    </div>
                  ))}
                </div>

                <SectionLabel>LATEST WRITEUP //</SectionLabel>
                {data.writeups.filter(w => w.published)[0] && <WriteupCard post={data.writeups.filter(w => w.published)[0]} />}

                <div style={{ marginTop: "32px" }}>
                  <SectionLabel>BY THE NUMBERS //</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "2px" }}>
                    {[
                      { v: data.writeups.filter(w => w.published).length, l: "published writeups" },
                      { v: data.certs.filter(c => c.status === "earned").length, l: "certs earned" },
                      { v: data.certs.filter(c => c.status === "in-progress").length, l: "in progress" },
                      { v: data.projects.length, l: "projects" },
                      { v: "8mo", l: "internship @ JAF" },
                      { v: "Top 10", l: "NCSCJO / 300" },
                    ].map(s => (
                      <div key={s.l} style={{ padding: "16px 12px", background: C.surface, border: `1px solid ${C.border}`, textAlign: "center" }}>
                        <div style={{ fontSize: "1.35rem", color: C.green, fontWeight: 700, fontFamily: C.mono }}>{s.v}</div>
                        <div style={{ fontSize: "0.56rem", color: C.textFaint, marginTop: "4px", letterSpacing: "0.05em" }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recruiter note */}
                <div style={{ marginTop: "32px", padding: "20px 24px", border: `1px solid #0a2a1a`, background: "#020a04" }}>
                  <div style={{ fontSize: "0.57rem", color: "#0a3a1a", letterSpacing: "0.2em", marginBottom: "10px", fontFamily: C.mono }}>FOR RECRUITERS //</div>
                  <div style={{ fontSize: "0.75rem", color: "#4a7a5a", lineHeight: 1.9, fontFamily: C.serif }}>
                    I'm a final-year cybersecurity student graduating June 2026, actively seeking a full-time role in <strong style={{ color: "#7ab87a" }}>SOC / Detection Engineering</strong> or <strong style={{ color: "#7ab87a" }}>Penetration Testing</strong>.
                    I have real enterprise experience from my internship at the Jordan Armed Forces (SCC-JAF), hold the <strong style={{ color: "#7ab87a" }}>HTB CDSA</strong> (defensive analyst cert), and am closing in on <strong style={{ color: "#7ab87a" }}>CWES</strong> and <strong style={{ color: "#7ab87a" }}>CPTS</strong>.
                    Every project on this site is real work — not just course content.
                  </div>
                  <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[[`→ ${data.profile.linkedin.replace("https://", "")}`, data.profile.linkedin], [`→ ${data.profile.github.replace("https://", "")}`, data.profile.github], [`→ email`, `mailto:${data.profile.email}`]].map(([label, url]) => (
                      <a key={label} href={url} target="_blank" rel="noreferrer"
                        style={{ padding: "7px 14px", border: `1px solid #1a4a2a`, color: C.green, fontSize: "0.65rem", fontFamily: C.mono, textDecoration: "none" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.surface}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{label}</a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── WRITEUPS ── */}
            {section === "writeups" && (
              <div className="section">
                <SectionLabel>WRITEUPS & ARTICLES //</SectionLabel>
                <div style={{ marginBottom: "20px", fontSize: "0.68rem", color: C.textDim, fontFamily: C.serif, lineHeight: 1.7 }}>
                  Organized by series and platform. Click any published post to read it.
                </div>
                {(() => {
                  const collections = [...new Set(data.writeups.map(w => w.collection || "Uncategorized"))];
                  return collections.map(col => {
                    const posts = data.writeups.filter(w => (w.collection || "Uncategorized") === col);
                    return <WriteupCollection key={col} name={col} posts={posts} />;
                  });
                })()}
                <div style={{ marginTop: "8px", padding: "12px", border: `1px dashed #0f2a0f`, fontSize: "0.63rem", color: C.textFaint, textAlign: "center", fontFamily: C.mono }}>
                  publishing regularly · use the admin panel to add new writeups and collections
                </div>
              </div>
            )}

            {/* ── PROJECTS ── */}
            {section === "projects" && (
              <div className="section">
                <SectionLabel>PROJECTS //</SectionLabel>
                <div style={{ fontSize: "0.68rem", color: C.textDim, fontFamily: C.serif, marginBottom: "18px", lineHeight: 1.7 }}>
                  Real work from university coursework, lab environments, and internship. Click <strong style={{ color: "#7ab87a" }}>details</strong> on any card to see specific findings, numbers, and techniques.
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {PROJECT_CATS.map(f => {
                    const col = CAT_META[f.key]?.color || C.text;
                    const count = f.key === "all" ? data.projects.length : data.projects.filter(p => p.category === f.key).length;
                    return (
                      <button key={f.key} onClick={() => setCatFilter(f.key)}
                        style={{ padding: "5px 14px", background: catFilter === f.key ? col + "15" : "none", border: `1px solid ${catFilter === f.key ? col + "40" : C.border}`, color: catFilter === f.key ? col : C.textDim, fontFamily: C.mono, fontSize: "0.63rem", cursor: "pointer", letterSpacing: "0.06em" }}>
                        {f.label} <span style={{ opacity: 0.5 }}>({count})</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
                <div style={{ marginTop: "16px", padding: "12px", border: `1px dashed #0f2a0f`, fontSize: "0.63rem", color: C.textFaint, fontFamily: C.mono, textAlign: "center" }}>
                  more on github.com/farouq7assan0o · some repos are academic / not all are public
                </div>
              </div>
            )}

            {/* ── ROADMAP ── */}
            {section === "roadmap" && (
              <div className="section">
                {data.roadmaps.map(rm => (
                  <div key={rm.id} style={{ marginBottom: "40px" }}>
                    <SectionLabel>{rm.name.toUpperCase()} //</SectionLabel>
                    <div style={{ padding: "14px 18px", border: `1px solid #0f2a0f`, background: C.surface, marginBottom: "20px", fontSize: "0.72rem", color: "#5a7a4a", fontFamily: C.serif, lineHeight: 1.9 }}>{rm.description}</div>
                    {rm.phases.map(p => <RoadmapPhase key={p.id} phase={p} />)}
                  </div>
                ))}
              </div>
            )}

            {/* ── CERTS ── */}
            {section === "certs" && (
              <div className="section">
                <SectionLabel>CERTIFICATIONS //</SectionLabel>
                <div style={{ marginBottom: "16px", fontSize: "0.65rem", color: C.textDim, fontFamily: C.serif }}>Earned certs link to the badge / verification page. Click to verify.</div>
                {[["earned", "— EARNED", C.green], ["in-progress", "— IN PROGRESS", C.amber], ["planned", "— PLANNED", C.textFaint]].map(([status, label, col]) => {
                  const group = data.certs.filter(c => c.status === status);
                  if (!group.length) return null;
                  return (
                    <div key={status} style={{ marginBottom: "22px" }}>
                      <div style={{ fontSize: "0.57rem", color: col, letterSpacing: "0.15em", marginBottom: "8px" }}>{label}</div>
                      <div className="g2">{group.map(c => <CertCard key={c.id} cert={c} />)}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── ABOUT ── */}
            {section === "about" && (
              <div className="section">
                <SectionLabel>ABOUT //</SectionLabel>
                <div style={{ padding: "22px 26px", border: `1px solid #0f2a0f`, background: C.surface, marginBottom: "16px" }}>
                  <div style={{ fontSize: "0.82rem", color: "#7ab87a", lineHeight: 2, fontFamily: C.serif }}>{data.profile.bio}</div>
                </div>
                {[
                  ["location", data.profile.location],
                  ["education", "B.Sc. Cybersecurity — HTU · Jun 2026"],
                  ["internship", "SCC – Jordan Armed Forces · Oct 2025 – Jun 2026"],
                  ["focus", "SOC / Detection Engineering + Penetration Testing"],
                  ["platform", "HackTheBox — CDSA ✓, CWES 70%, CPTS 45%"],
                  ["email", data.profile.email],
                  ["languages", "Arabic (native) · English (proficient) · German · Italian (beginner)"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: "14px", padding: "9px 16px", border: `1px solid ${C.border}`, marginBottom: "2px" }}>
                    <div style={{ fontSize: "0.63rem", color: C.textFaint, minWidth: "76px", fontFamily: C.mono, paddingTop: "1px" }}>{k}</div>
                    <div style={{ fontSize: "0.7rem", color: "#7ab87a", fontFamily: C.mono }}>{v}</div>
                  </div>
                ))}
                <div style={{ marginTop: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[["→ LinkedIn", data.profile.linkedin], ["→ GitHub", data.profile.github], ["→ Medium", data.profile.medium]].map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer"
                      style={{ padding: "8px 16px", border: `1px solid #1a4a1a`, color: C.green, fontSize: "0.68rem", fontFamily: C.mono, textDecoration: "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.surface}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{label}</a>
                  ))}
                </div>
              </div>
            )}

          </main>

          <footer style={{ marginTop: "56px", paddingTop: "16px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "0.55rem", color: C.textFaint, fontFamily: C.mono }}>farouqhassan.dev</div>
            <div style={{ fontSize: "0.55rem", color: C.textFaint, fontFamily: C.mono }}>next.js + vercel · {new Date().getFullYear()}</div>
          </footer>
        </div>
      )}
    </>
  );
}