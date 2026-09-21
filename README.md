# React Native RFID (UHF) Scanner

This is my **React Native CLI project** for **UHF RFID scanning, reading, and writing** on a handheld RFID scanner device.  

The project integrates an RFID scanner device SDK through a **custom Kotlin module (`UhfModule.kt`)**, making it possible to access hardware-level RFID functions directly inside a React Native app.

> [!IMPORTANT]
> This repository demonstrates the application source and React Native-to-Kotlin bridge. Proprietary vendor JAR and `.so` binaries are deliberately excluded and are not covered by this project's license.

---

## ✨ Features

- 🔍 Scan RFID (UHF) tags in real-time  
- 📖 Read tag data (EPC / memory banks)  
- ✍️ Write data to RFID tags  
- 📜 Display scanned tags with EPC, signal strength, and timestamp  
- 🎵 Optional beep feedback when tags are detected  
- 🔘 **Supports scanning via both UI button and physical hardware trigger button**  
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

## Vendor SDK setup

Obtain the correct SDK and redistribution rights directly from your hardware vendor. For the SDK version used by this example, place your locally obtained files at:

```text
android/app/libs/uhfcom13_v15.jar
android/app/libs/UHF67_v3.6.jar
android/app/src/main/jniLibs/arm64-v8a/*.so
android/app/src/main/jniLibs/armeabi-v7a/*.so
```

Exact filenames, ABI support, permissions, and serial-port configuration may differ by device model. Do not recover vendor binaries from this repository's old Git history; use a vendor-supplied or vendor-authorized package.

Without the vendor SDK, the TypeScript and Kotlin bridge can be reviewed, but the Android app will not compile because `UhfModule.kt` imports vendor classes.

---

## ⚡ Usage Overview

- Tap **Scan** in the app to continuously detect nearby RFID tags  
- Press the **physical hardware trigger button** on the device to scan tags without touching the UI  
- View EPC + RSSI + timestamp in the live list  
- Use **Read / Write** functions to interact with tag memory banks  
- Optional **beep sound feedback** confirms successful scans  

---

### 📋 Example Logs

```text
UI Scan:

D UhfModule: Scanning started (source=UI)
D UhfModule: UI scan EPC tag: E2806A96000040225CE4C20C
```

```text
Hardware Scan:

D UhfModule: Scanning started (source=HW)
D UhfModule: HW scan EPC tag: E2806A96000040225CE41A0C
```
---

## 🏗️ Architecture


```text
 ┌────────────────────────┐
 │   React Native (JS)    │
 │  UI (UhfScanner.tsx)   │
 └───────────▲────────────┘
             │
   React Native Bridge
             │
 ┌───────────▼────────────┐
 │     Kotlin Module      │
 │     (UhfModule.kt)     │
 └───────────▲────────────┘
             │
     RFID Device SDK
    (with native .so libs)
             │
 ┌───────────▼────────────┐
 │   RFID Scanner Device  │
 │   (UHF Hardware)       │
 └────────────────────────┘

```
---

## 📝 Future Improvements
 
- [ ] Export scanned tag list to CSV/Excel  
- [ ] Tag filtering, sorting, and grouping  
- [ ] Enhanced UI/UX with animations and charts  
- [ ] Battery optimization for long scanning sessions  

---

## 🤝 Contributing

This project is part of my learning journey 🚀. Suggestions, ideas, and improvements are always welcome!  

---

## License

Original source code in this repository is licensed under the [MIT License](LICENSE). Third-party packages and assets retain their own terms. Proprietary RFID SDK files are excluded from the repository and the MIT grant; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

