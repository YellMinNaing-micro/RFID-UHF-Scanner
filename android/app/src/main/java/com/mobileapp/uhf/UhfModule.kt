package com.mobileapp.uhf

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.handheld.uhfr.UHFRManager
import com.uhf.api.cls.Reader.TAGINFO
import java.util.concurrent.Executors

class UhfModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val executor = Executors.newSingleThreadExecutor()
    @Volatile private var scanning = false
    private var scanSource: String = "UI"
    private var uhfManager: UHFRManager? = null
    private val scannedTags = mutableSetOf<String>()
    private var triggerReceiver: BroadcastReceiver? = null

    override fun getName(): String = "UhfModule"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun initReader(promise: Promise) {
        try {
            uhfManager = UHFRManager.getInstance()
            if (uhfManager == null) {
                promise.reject("INIT_FAILED", "UHFRManager getInstance returned null")
            } else {
                registerTriggerReceiver()
                promise.resolve(true)
            }
        } catch (e: Exception) {
            Log.e("UhfModule", "initReader failed", e)
            promise.reject("INIT_FAILED", e.message)
        }
    }

    @ReactMethod
    fun startScan(promise: Promise) {
        startScanWithSource("UI", promise)
    }

    @ReactMethod
    fun startScanWithSource(source: String, promise: Promise?) {
        if (scanning || uhfManager == null) {
            promise?.resolve(false)
            return
        }
        scanning = true
        scanSource = source
        scannedTags.clear()
        try { uhfManager?.asyncStartReading() } catch (_: Exception) {}
        executor.execute { scanningLoop(source) }
        promise?.resolve(true)
        Log.d("UhfModule", "Scanning started (source=$source)")
    }

    @ReactMethod
    fun stopScan(promise: Promise?) {
        if (!scanning) {
            promise?.resolve(false)
            return
        }
        scanning = false
        try { uhfManager?.asyncStopReading() } catch (_: Exception) {}
        promise?.resolve(true)
        Log.d("UhfModule", "Scanning stopped")
    }

    @ReactMethod
    fun closeReader(promise: Promise) {
        stopScan(null)
        try {
            uhfManager?.close()
            uhfManager = null
            scannedTags.clear()
            unregisterTriggerReceiver()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLOSE_FAILED", e.message)
        }
    }

    @ReactMethod
    fun setPower(readPower: Int, writePower: Int, promise: Promise) {
        try {
            uhfManager?.setPower(readPower, writePower)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SET_POWER_FAILED", e.message)
        }
    }

    private fun scanningLoop(source: String) {
        while (scanning) {
            val tagInfos: List<TAGINFO>? = uhfManager?.tagInventoryRealTime()
            if (!tagInfos.isNullOrEmpty()) {
                val params = Arguments.createMap()
                val tagList = Arguments.createArray()
                val sourceList = Arguments.createArray()
                tagInfos.forEach { tag ->
                    val epcBytes = tag.EpcId
                    val epcString = epcBytes?.joinToString("") { b -> "%02X".format(b) } ?: ""
                    if (epcString.isNotEmpty() && scannedTags.add(epcString)) {
                        tagList.pushString(epcString)
                        sourceList.pushString(source)
                        Log.d("UhfModule", "$source scan EPC tag: $epcString")
                    }
                }
                if (tagList.size() > 0) {
                    params.putArray("tags", tagList)
                    params.putArray("sources", sourceList)
                    sendEvent("onTagsScanned", params)
                }
            }
            Thread.sleep(200)
        }
    }

    // --------------- Hardware trigger ----------------
    private fun registerTriggerReceiver() {
        if (triggerReceiver != null) return
        val filter = IntentFilter().apply {
            addAction("android.rfid.FUN_KEY")
            addAction("android.intent.action.FUN_KEY")
            addAction("com.rfid.FUN_KEY")
        }
        triggerReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (intent == null) return
                val keyDown = intent.getBooleanExtra("keydown", false)
                if (keyDown) {
                    startScanWithSource("HW", null)
                } else {
                    stopScan(null)
                }
            }
        }
        try { reactContext.registerReceiver(triggerReceiver, filter) }
        catch (e: Exception) { Log.e("UhfModule", "register trigger failed", e) }
    }

    private fun unregisterTriggerReceiver() {
        triggerReceiver?.let {
            try { reactContext.unregisterReceiver(it) } catch (_: Exception) {}
            triggerReceiver = null
        }
    }
}
