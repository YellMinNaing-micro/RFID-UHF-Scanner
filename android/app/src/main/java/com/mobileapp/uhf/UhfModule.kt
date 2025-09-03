package com.mobileapp.uhf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

import com.handheld.uhfr.UHFRManager
import com.uhf.api.cls.Reader.TAGINFO
import com.uhf.api.cls.Reader.READER_ERR
import com.uhf.api.cls.Reader.Lock_Obj
import com.uhf.api.cls.Reader.Lock_Type

import android.util.Log
import java.util.concurrent.Executors

class UhfModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val executor = Executors.newSingleThreadExecutor()
    private var scanning = false
    private var uhfManager: UHFRManager? = null

    override fun getName(): String = "UhfModule"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    // Initialize reader
    @ReactMethod
    fun initReader(promise: Promise) {
        try {
            uhfManager = UHFRManager.getInstance()
            Log.d("UhfModule", "UHFRManager.getInstance() result=$uhfManager")
            if (uhfManager == null) {
                promise.reject("INIT_FAILED", "UHFRManager getInstance returned null")
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            Log.e("UhfModule", "initReader failed", e)
            promise.reject("INIT_FAILED", e.message)
        }
    }

    // Start scanning loop
 @ReactMethod
 fun startScan(promise: Promise) {
     if (scanning) {
         promise.resolve(false)
         return
     }

     if (uhfManager == null) {
         promise.reject("SCAN_FAILED", "UHF Manager is not initialized")
         return
     }

     scanning = true
     Log.d("UhfModule", "Scanning started (async mode)")

     // Start async inventory
     uhfManager?.asyncStartReading()

     // Background loop to fetch tags continuously
     executor.execute {
         try {
             while (scanning) {
                 val tagInfos: List<TAGINFO>? = uhfManager?.tagInventoryByTimer(50) // try with timer
                 if (!tagInfos.isNullOrEmpty()) {
                     Log.d("UhfModule", "Tags found: ${tagInfos.size}")
                     val params = Arguments.createMap()
                     val tagList = Arguments.createArray()

                     tagInfos.forEach { tag ->
                         val epcBytes: ByteArray? = tag.EpcId
                         val epcString = epcBytes?.joinToString("") { b -> "%02X".format(b) } ?: ""
                         Log.d("UhfModule", "Tag EPC: $epcString")
                         if (epcString.isNotEmpty()) {
                             tagList.pushString(epcString)
                         }
                     }

                     params.putArray("tags", tagList)
                     sendEvent("onTagsScanned", params)
                 }
                 Thread.sleep(200)
             }
         } catch (e: Exception) {
             Log.e("UhfModule", "scan error", e)
         }
     }

     promise.resolve(true)
 }


    // Stop scanning
    @ReactMethod
    fun stopScan(promise: Promise) {
        scanning = false
        Log.d("UhfModule", "Scanning stopped")
        promise.resolve(true)
    }

    // Close reader
    @ReactMethod
    fun closeReader(promise: Promise) {
        scanning = false
        try {
            uhfManager?.close()
            uhfManager = null
            Log.d("UhfModule", "Reader closed")
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLOSE_FAILED", e.message)
        }
    }

    // Optional: set power (read/write)
    @ReactMethod
    fun setPower(readPower: Int, writePower: Int, promise: Promise) {
        try {
            uhfManager?.setPower(readPower, writePower)
            Log.d("UhfModule", "Power set: read=$readPower, write=$writePower")
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SET_POWER_FAILED", e.message)
        }
    }
}

