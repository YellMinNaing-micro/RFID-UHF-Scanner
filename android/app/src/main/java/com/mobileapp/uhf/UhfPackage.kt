package com.mobileapp.uhf
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager
import android.app.Application

class UhfPackage : ReactPackage {
  override fun createNativeModules(reactContext: com.facebook.react.bridge.ReactApplicationContext)
    : List<NativeModule> = listOf(UhfModule(reactContext))
  override fun createViewManagers(reactContext: com.facebook.react.bridge.ReactApplicationContext)
    : List<ViewManager<*, *>> = emptyList()
}
