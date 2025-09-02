package com.mobileapp.uhf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import cn.pda.serialport.SerialPort
import android.util.Log
import com.handheld.uhfr.RrReader
import com.handheld.uhfr.Reader
import java.util.concurrent.Executors

class UhfModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var serialPort: SerialPort? = null
    private var scanning = false
    private val executor = Executors.newSingleThreadExecutor()

    override fun getName(): String = "UhfModule"

    /** Initialize SerialPort and RrReader */
    @ReactMethod
    fun initReader(promise: Promise) {
        try {
            serialPort = SerialPort(0, 115200, 0)
            serialPort?.rfid_poweron()
            serialPort?.scaner_poweron()

            val result = RrReader.connect("/dev/ttyS0", 115200, 0) // <-- change to your actual port
            Log.d("UhfModule", "RrReader.connect result = $result")
            if (result != 0) {
                promise.reject("INIT_FAILED", "RrReader connect failed with code $result")
                return
            }

            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("UhfModule", "initReader failed", e)
            promise.reject("INIT_FAILED", e.message)
        }
    }

    /** Start scanning and return EPC IDs */
    @ReactMethod
    fun startScan(promise: Promise) {
        if (RrReader.rrlib == null) {
            promise.reject("SCAN_FAILED", "RrReader not connected")
            return
        }

        if (scanning) {
            promise.resolve(false) // already scanning
            return
        }

        scanning = true
        executor.execute {
            try {
                while (scanning) {
                    val result = RrReader.startRead()
                    if (result == 0) {
                        val tagInfos = RrReader.measureYueHeTemp()
                        val tagList = mutableListOf<String>()
                        tagInfos?.forEach { tag ->
                            tagList.add(bytesToHex(tag.EpcId))
                        }
                        // Send tags to JS via event or promise callback
                        Log.d("UhfModule", "Scanned tags: $tagList")
                    } else {
                        Log.e("UhfModule", "startRead failed with code $result")
                    }
                    Thread.sleep(500) // scan interval
                }
            } catch (e: Exception) {
                Log.e("UhfModule", "Scanning error", e)
            }
        }

        promise.resolve(true)
    }

    /** Stop scanning */
    @ReactMethod
    fun stopScan(promise: Promise) {
        scanning = false
        RrReader.stopRead()
        promise.resolve(true)
    }

    /** Write EPC to a tag */
    @ReactMethod
    fun writeTag(epcHex: String, promise: Promise) {
        try {
            val epcBytes = hexToBytes(epcHex)
            val fdata = byteArrayOf()
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
            scanning = false
            RrReader.stopRead()
            serialPort?.scaner_poweroff()
            serialPort?.rfid_poweroff()
            serialPort = null
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("UhfModule", "closeReader failed", e)
            promise.reject("CLOSE_FAILED", e.message)
        }
    }

    /** Utilities */
    private fun bytesToHex(bytes: ByteArray): String =
        bytes.joinToString("") { "%02X".format(it) }

    private fun hexToBytes(hex: String): ByteArray {
        val len = hex.length
        val result = ByteArray(len / 2)
        for (i in 0 until len step 2) {
            result[i / 2] = ((hex[i].digitToInt(16) shl 4) + hex[i + 1].digitToInt(16)).toByte()
        }
        return result
    }
}
