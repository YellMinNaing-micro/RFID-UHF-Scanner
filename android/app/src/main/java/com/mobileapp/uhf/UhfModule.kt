package com.mobileapp.uhf

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.android.hdhe.uhf.reader.UhfReader
import com.android.hdhe.uhf.readerInterface.TagModel
import cn.pda.serialport.Tools
import java.util.concurrent.Executors

class UhfModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var manager: UhfReader? = null
    private var scanning = false
    private val executor = Executors.newSingleThreadExecutor()
    private val seenTags = mutableSetOf<String>() // <-- track duplicates

    override fun getName(): String = "UhfModule"

    // --- React Native Exposed Methods ---
    @ReactMethod
    fun initUhf(promise: Promise) {
        try {
            manager = UhfReader.getInstance()
            if (manager == null) {
                promise.reject("INIT_FAIL", "UHF init failed")
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.reject("INIT_EXCEPTION", e.message)
        }
    }

    @ReactMethod
    fun startScan() {
        if (manager == null || scanning) return
        scanning = true
        executor.execute {
            while (scanning) {
                try {
                    val tags: List<TagModel>? = manager?.inventoryRealTime()
                    tags?.forEach { tag ->
                        val epcBytes = try {
                            tag.getmEpcBytes()
                        } catch (ex: Exception) {
                            null
                        }
                        epcBytes?.let {
                            val epcStr = Tools.Bytes2HexString(it, it.size)
                            if (!seenTags.contains(epcStr)) {  // <-- only new tags
                                seenTags.add(epcStr)
                                sendEpcToJs(epcStr)
                            }
                        }
                    }
                    Thread.sleep(50)
                } catch (ex: Exception) {
                    Log.e("UhfModule", "Error during scan: ${ex.message}")
                }
            }
        }
    }

    @ReactMethod
    fun stopScan() {
        scanning = false
    }

    @ReactMethod
    fun clearScan() {
        seenTags.clear() // <-- reset duplicate tracking
        sendEpcToJs("")  // emit empty to JS
    }

    // --- Helper ---
    private fun sendEpcToJs(epc: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("UHF_SCAN", epc)
    }
}
