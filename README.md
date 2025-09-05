# 📡 React Native RFID (UHF) Scanner

This is my **first React Native CLI project** built for **UHF RFID scanning, reading, and writing** on a handheld RFID scanner device.  

The project integrates the **RFID scanner device SDK** (with native `.so` libraries) into React Native by creating a **custom Kotlin module**, which provides scanning, reading, and writing capabilities directly inside the React Native app. The application, built with React Native, communicates with the scanner via Bluetooth, USB, or a built-in module.  

---

## ✨ Features

- 🔍 Scan RFID (UHF) tags in real-time  
- 📖 Read tag data (EPC / memory banks)  
- ✍️ Write data to tags  
- 📜 Display scanned tags in a list with details  
- 🎵 Optional beep sound feedback when tags are scanned  

---

## 🛠️ Tech Stack

- [React Native CLI](https://reactnative.dev/)  
- [Android Native Module](https://reactnative.dev/docs/native-modules-intro) (Kotlin)  
- RFID Scanner Device SDK (with `.so` libraries)  
- Tested on **Android-based RFID scanner device**  

---

## ⚡ Usage

- Tap Scan button to start scanning UHF RFID tags
- View EPC + signal strength + timestamp in the tag list
- Use Read / Write features for tag memory banks

## 📦 Dependencies

- "react-native": "^0.xx.x"
- "@react-native-community/cli": "^x.x.x"
- Native integration is handled by the RFID scanner device SDK with Kotlin bindings in UhfModule.kt.

## 📝 Future Improvements

- Add iOS support (currently Android only)
- Export scanned tag list to CSV/Excel
- Tag filtering, sorting, and last scan time
- Improved UI and animations

## 🤝 Contributing

This is my learning project 🚀 but suggestions and contributions are always welcome!
