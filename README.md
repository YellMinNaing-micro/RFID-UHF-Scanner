# 📡 React Native RFID (UHF) Scanner

This is my **first React Native CLI project** for **UHF RFID scanning, reading, and writing** on a handheld RFID scanner device.  

The project integrates the **RFID scanner device SDK** (with native `.so` libraries) through a **custom Kotlin module (`UhfModule.kt`)**, making it possible to access hardware-level RFID functions directly inside a React Native app.

---

## ✨ Features

- 🔍 Scan RFID (UHF) tags in real-time  
- 📖 Read tag data (EPC / memory banks)  
- ✍️ Write data to RFID tags  
- 📜 Display scanned tags with EPC, signal strength, and timestamp  
- 🎵 Optional beep feedback when tags are detected  
- 🔌 Supports multiple connection methods:  
  - Bluetooth  
  - USB (OTG)  
  - Built-in module on RFID devices  

---

## 🛠️ Tech Stack

- **React Native CLI** – cross-platform mobile framework  
- **Kotlin (Android Native Module)** – to bridge the SDK with React Native  
- **RFID Scanner Device SDK** – provided by hardware vendor (includes `.so` libraries for low-level access)  
- Tested on **Android-based RFID scanner devices**  

---

## ⚡ Usage Overview

- Tap **Scan** to continuously detect nearby RFID tags  
- View EPC + RSSI + timestamp in the live list  
- Use **Read / Write** functions to interact with tag memory banks  
- Optional **beep sound feedback** confirms successful scans  

---

## 🏗️ Architecture

- **Native SDK Integration**  
  - The SDK’s `.so` libraries provide access to RFID hardware features.  
- **Custom Kotlin Module (`UhfModule.kt`)**  
  - Wraps SDK methods like `startScan`, `stopScan`, `readTag`, and `writeTag`.  
  - Exposes them as callable methods in JavaScript via React Native bridge.  
- **React Native App**  
  - Provides UI for scanning, reading, writing, and displaying tag data.  

*(SDK filenames and internal implementation details are abstracted for clarity.)*

---

## 📝 Future Improvements

- [ ] iOS support (currently Android-only)  
- [ ] Export scanned tag list to CSV/Excel  
- [ ] Tag filtering, sorting, and grouping  
- [ ] Enhanced UI/UX with animations and charts  
- [ ] Battery optimization for long scanning sessions  

---

## 🤝 Contributing

This project is part of my learning journey 🚀. Suggestions, ideas, and improvements are always welcome!  

---
