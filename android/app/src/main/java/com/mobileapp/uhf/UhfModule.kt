package com.mobileapp.uhf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

// Import the correct classes
import com.handheld.uhfr.UHFRManager
import com.handheld.uhfr.Reader

class UhfModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Correctly declare the reader using the 'Reader' class
    private var reader: Reader? = null

    override fun getName(): String = "UhfModule"

    init {
        try {
            // Initialize the reader using the correct class
            // This assumes a simple constructor. You may need a different
            // initialization method based on the SDK's documentation.
            reader = Reader()
            reader?.init()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun readTag(promise: Promise) {
        try {
            // Use the correct method. The method names you used may be correct,
            // but you should verify them in the SDK documentation.
            val tagId: String? = reader?.ReadSingleTag()
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
            reader?.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
