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
                registerTriggerReceiver() // HW trigger listener
                promise.resolve(true)
            }
        } catch (e: Exception) {
            Log.e("UhfModule", "initReader failed", e)
            promise.reject("INIT_FAILED", e.message)
        }
    }

    @ReactMethod
    fun startScan(promise: Promise) {
        if (!scanning) startScanningLoop()
        promise.resolve(scanning)
    }

    @ReactMethod
    fun stopScan(promise: Promise) {
        if (scanning) stopScanningLoop()
        promise.resolve(!scanning)
    }

    @ReactMethod
    fun closeReader(promise: Promise) {
        try {
            stopScanningLoop()
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

    // ---------------- Scanning loop ----------------
    private fun startScanningLoop() {
        if (scanning || uhfManager == null) return
        scanning = true
        try { uhfManager?.asyncStartReading() } catch (_: Exception) {}
        executor.execute {
            try {
                while (scanning) {
                    val tagInfos: List<TAGINFO>? = uhfManager?.tagInventoryRealTime()
                    if (!tagInfos.isNullOrEmpty()) {
                        val params = Arguments.createMap()
                        val tagList = Arguments.createArray()
                        tagInfos.forEach { tag ->
                            val epcBytes = tag.EpcId
                            val epcString = epcBytes?.joinToString("") { b -> "%02X".format(b) } ?: ""
                            if (epcString.isNotEmpty() && scannedTags.add(epcString)) tagList.pushString(epcString)
                        }
                        if (tagList.size() > 0) {
                            params.putArray("tags", tagList)
                            sendEvent("onTagsScanned", params)
                        }
                    }
                    Thread.sleep(200)
                }
            } catch (e: Exception) { Log.e("UhfModule", "scan loop error", e) }
        }
    }

    private fun stopScanningLoop() {
        if (!scanning) return
        scanning = false
        try { uhfManager?.asyncStopReading() } catch (_: Exception) {}
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
                val keyCode = intent.getIntExtra("keyCode", intent.getIntExtra("keycode", 0))
                val keyDown = intent.getBooleanExtra("keydown", false)

                if (keyDown) startScanningLoop() else stopScanningLoop()

                // Optional: notify JS UI of trigger state
                val params = Arguments.createMap()
                params.putString("key", "TRIGGER")
                params.putString("state", if (keyDown) "down" else "up")
                sendEvent("onHardwareTrigger", params)
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
