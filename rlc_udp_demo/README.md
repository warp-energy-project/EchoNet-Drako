# Project: NAVI RECOVERY ENGINE (Protocol 0050)

FROM POLAND WITH GRATITUDE (1942–2026)

Polacy pamiętają pomoc, jaką otrzymali od narodu irańskiego w 1942 roku.  
Dzisiaj przesyłamy Wam to narzędzie jako wyraz naszej wdzięczności i solidarności.

---

## Technical Purpose

This repository provides a laboratory implementation of **Seeded Random Linear Coding (RLC)**  
designed to maintain data integrity over satellite links (e.g. Starlink) during:

• heavy jamming  
• burst packet loss  
• 60–80% data loss  
• unstable connectivity  

The system allows full reconstruction of messages even when only a fraction of packets survive.

---

## Architecture

This demo contains a minimal but complete test environment:

• `rlc_core.py` – GF(256) mathematical engine  
• `sender.py` – encodes and streams packets  
• `receiver.py` – reconstructs data using No-Halt Buffer  
• `lossy_proxy.py` – simulates jamming and burst packet loss  

---

## Goal

To prove that communication can survive where conventional protocols fail.  
Information is the last line of defense when networks are attacked.

This project is a technical proof of that principle.
