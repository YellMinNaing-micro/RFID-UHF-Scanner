package com.mobileapp.uhf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import cn.pda.serialport.SerialPort
import android.util.Log
import com.handheld.uhfr.RrReader
import com.handheld.uhfr.Reader

class UhfModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var serialPort: SerialPort? = null

    override fun getName(): String {
        return "UhfModule"
    }

    /** Initialize SerialPort and RrReader */
  @ReactMethod
  fun initReader(promise: Promise) {
      try {
          serialPort = SerialPort(0, 115200, 0)
          serialPort?.rfid_poweron()
          serialPort?.scaner_poweron()

          val result = RrReader.connect("/dev/ttyS0", 115200, 0) // Use your correct port
          if (result != 0) {
              promise.reject("INIT_FAILED", "RrReader connect failed with code $result")
              return
          }

          promise.resolve(true)
      } catch (e: Exception) {
          promise.reject("INIT_FAILED", e.message)
      }
  }

  @ReactMethod
  fun readAllTags(promise: Promise) {
      if (RrReader.rrlib == null) {
          promise.reject("READ_FAILED", "RrReader not connected")
          return
      }

      try {
          val readResult = RrReader.startRead()
          if (readResult != 0) {
              promise.reject("READ_FAILED", "startRead failed with code $readResult")
              return
          }

          val tagInfos = RrReader.measureYueHeTemp()
          val tagList = mutableListOf<String>()
          tagInfos?.forEach { tag -> tagList.add(bytesToHex(tag.EpcId)) }

          promise.resolve(tagList.toTypedArray())
      } catch (e: Exception) {
          promise.reject("READ_FAILED", e.message)
      }
  }


    /** Write EPC to a tag */
    @ReactMethod
    fun writeTag(epcHex: String, promise: Promise) {
        try {
            val epcBytes = hexToBytes(epcHex)
            val fdata = byteArrayOf() // optional mask/filter
            val fbank = 1
            val fstartaddr = 2
            val matching = false
            val timeout: Short = 100

            val result = RrReader.writeTagEpc(epcBytes, byteArrayOf(), timeout, fdata, fbank, fstartaddr, matching)
            promise.resolve(result == 0)
        } catch (e: Exception) {
            Log.e("UhfModule", "writeTag failed", e)
            promise.reject("WRITE_FAILED", e.message)
        }
    }

    /** Close reader and release SerialPort */
    @ReactMethod
    fun closeReader(promise: Promise) {
        try {
            serialPort?.scaner_poweroff()
            serialPort?.rfid_poweroff()
            serialPort = null
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("UhfModule", "closeReader failed", e)
            promise.reject("CLOSE_FAILED", e.message)
        }
    }

    /** Utility: convert byte array to hex string */
    private fun bytesToHex(bytes: ByteArray): String {
        return bytes.joinToString("") { "%02X".format(it) }
    }

    /** Utility: convert hex string to byte array */
    private fun hexToBytes(hex: String): ByteArray {
        val len = hex.length
        val result = ByteArray(len / 2)
        for (i in 0 until len step 2) {
            result[i / 2] = ((hex[i].digitToInt(16) shl 4) + hex[i + 1].digitToInt(16)).toByte()
        }
        return result
    }
}
