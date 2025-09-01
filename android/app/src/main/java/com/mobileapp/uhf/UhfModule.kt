package com.yourapp.uhf

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

// Replace these imports with the vendor’s classes from the SDK
// import com.vendor.uhf.Reader
// import com.vendor.uhf.Tag
// import com.vendor.uhf.Result

class UhfModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  // lateinit var reader: Reader
  override fun getName() = "Uhf"

  @ReactMethod
  fun open(promise: Promise) {
    try {
      // reader = Reader.getInstance(reactContext)
      // val ok = reader.open()
      val ok = true // TODO call real SDK
      if (ok) promise.resolve(true) else promise.reject("OPEN_FAIL", "Reader open failed")
    } catch (e: Exception) {
      promise.reject("OPEN_ERR", e)
    }
  }

  @ReactMethod
  fun close(promise: Promise) {
    try {
      // reader.close()
      promise.resolve(true)
    } catch (e: Exception) { promise.reject("CLOSE_ERR", e) }
  }

  @ReactMethod
  fun startInventory(intervalMs: Int, promise: Promise) {
    try {
      // reader.startInventory { tag: Tag ->
      //   sendEvent("UHF_TAG", Arguments.createMap().apply {
      //     putString("epc", tag.epc)
      //     putInt("rssi", tag.rssi)
      //   })
      // }
      promise.resolve(true)
    } catch (e: Exception) { promise.reject("INV_START_ERR", e) }
  }

  @ReactMethod
  fun stopInventory(promise: Promise) {
    try {
      // reader.stopInventory()
      promise.resolve(true)
    } catch (e: Exception) { promise.reject("INV_STOP_ERR", e) }
  }

  @ReactMethod
  fun read(
    bank: String, // "EPC" | "TID" | "USER" | "RESERVED"
    startWord: Int,
    wordCount: Int,
    accessPwdHex: String?,
    promise: Promise
  ) {
    try {
      // val data = reader.read(bank, startWord, wordCount, accessPwdHex)
      val data = "0000" // hex
      promise.resolve(data)
    } catch (e: Exception) { promise.reject("READ_ERR", e) }
  }

  @ReactMethod
  fun write(
    bank: String,
    startWord: Int,
    dataHex: String,
    accessPwdHex: String?,
    promise: Promise
  ) {
    try {
      // val ok = reader.write(bank, startWord, dataHex, accessPwdHex)
      val ok = true
      if (ok) promise.resolve(true) else promise.reject("WRITE_FAIL", "Write failed")
    } catch (e: Exception) { promise.reject("WRITE_ERR", e) }
  }

  private fun sendEvent(event: String, params: WritableMap) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(event, params)
  }
}
