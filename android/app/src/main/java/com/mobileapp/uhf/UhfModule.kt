package com.mobileapp.uhf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.uhf.api.cls.Reader

class UhfModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var reader: Reader? = null

    override fun getName(): String = "UhfModule"

    init {
        try {
            reader = Reader()
            reader?.InitReader_Notype("", Reader.MAXANTCNT)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun readAllTags(promise: Promise) {
        try {
            val antCounts = IntArray(Reader.MAXANTCNT)
            val tagCount = IntArray(1)

            val tagInfos: Array<Reader.TAGINFO?> = Array(Reader.MAXINVPOTLSCNT) { null }

            val result: Int? = reader?.TagInventory(antCounts, antCounts.size, 1, tagInfos, tagCount)

            if (result == 0) { // 0 = success
                promise.resolve(arrayOf<String>()) // empty array for now
            } else {
                promise.reject("READ_ERROR", "Reader error: $result")
            }
        } catch (e: Exception) {
            promise.reject("READ_EXCEPTION", e.message, e)
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            reader?.CloseReader()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
