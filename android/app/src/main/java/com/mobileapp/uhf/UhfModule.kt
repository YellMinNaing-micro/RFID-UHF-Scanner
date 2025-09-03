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

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun initReader(promise: Promise) {
        try {
            uhfManager = UHFRManager.getInstance()
            Log.d("UhfModule", "UHFRManager.getInstance() result=$uhfManager")
            if (uhfManager == null) {
                promise.reject("INIT_FAILED", "UHFRManager getInstance failed")
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            Log.e("UhfModule", "initReader failed", e)
            promise.reject("INIT_FAILED", e.message)
        }
    }

    @ReactMethod
    fun startScan(promise: Promise) {
        if (scanning) {
            promise.resolve(false)
            return
        }

        scanning = true
        uhfManager?.asyncStartReading()
        executor.execute {
            try {
                while (scanning) {
                    val tagInfos: List<TAGINFO>? = uhfManager?.tagInventoryRealTime()
                    if (!tagInfos.isNullOrEmpty()) {
                        val params = Arguments.createMap()
                        val tagList = Arguments.createArray()
                            tagInfos.forEach { tag: TAGINFO ->
                           val epcArray = tag.javaClass.getField("EPC").get(tag) as? ByteArray
                           val epcString = epcArray?.joinToString("") { b -> "%02X".format(b) } ?: ""
                           tagList.pushString(epcString)
                            }
                        params.putArray("tags", tagList)
                        sendEvent(reactApplicationContext, "onTagsScanned", params)
                    }
                    Thread.sleep(500)
                }
            } catch (e: Exception) {
                Log.e("UhfModule", "scan error", e)
            }
        }
        promise.resolve(true)
    }


    @ReactMethod
    fun stopScan(promise: Promise) {
        scanning = false
        uhfManager?.asyncStopReading()
        promise.resolve(true)
    }

    @ReactMethod
    fun closeReader(promise: Promise) {
        scanning = false
        uhfManager?.asyncStopReading()
        uhfManager?.close()
        uhfManager = null
        promise.resolve(true)
    }
}
