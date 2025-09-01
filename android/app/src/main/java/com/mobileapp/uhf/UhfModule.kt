package com.mobileapp.uhf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

// Import WUYUAN SDK classes
import com.wyuan.uhf.UhfReader  // Adjust based on your .jar SDK package
import com.wyuan.uhf.UhfException

class UhfModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var reader: UhfReader? = null

    override fun getName(): String = "UhfModule"

    init {
        try {
            reader = UhfReader()  // Initialize SDK reader
            reader?.init()        // Open connection, if SDK requires it
        } catch (e: UhfException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun readTag(promise: Promise) {
        try {
            val tagId: String? = reader?.readSingleTag()  // SDK method to read one tag
            if (tagId != null && tagId.isNotEmpty()) {
                promise.resolve(tagId)
            } else {
                promise.reject("NO_TAG", "No UHF tag found")
            }
        } catch (e: Exception) {
            promise.reject("READ_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun writeTag(data: String, promise: Promise) {
        try {
            val success = reader?.writeTag(data) ?: false  // SDK method to write tag
            if (success) {
                promise.resolve("WRITE_SUCCESS")
            } else {
                promise.reject("WRITE_FAIL", "Failed to write tag")
            }
        } catch (e: Exception) {
            promise.reject("WRITE_ERROR", e.message, e)
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            reader?.close()  // Close SDK connection
        } catch (e: UhfException) {
            e.printStackTrace()
        }
    }
}
