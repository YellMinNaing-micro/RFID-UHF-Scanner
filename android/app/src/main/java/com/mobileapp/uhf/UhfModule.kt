package com.mobileapp.uhf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.handheld.uhfr.Reader

class UhfModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Correctly declare the reader using the 'Reader' class
    private var reader: Reader? = null

    override fun getName(): String = "UhfModule"

    init {
        try {
            // Use the correct static initialization method.
            // This is a common pattern for these SDKs.
            reader = Reader.get
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun readTag(promise: Promise) {
        try {
            // Use the correct method to perform an inventory.
            // This typically returns a list of tags. We'll grab the first one.
            val inventoryData = reader?.inventorySingleTag()
            if (inventoryData != null && inventoryData.isNotEmpty()) {
                val tagId = inventoryData[0].epc.toString()
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
        // Method name is a guess, you may need to consult the documentation
        // for the correct method signature and parameters.
        try {
            val success = reader?.writeTag(data) ?: false
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
            // The correct method to close the connection.
            reader?.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
