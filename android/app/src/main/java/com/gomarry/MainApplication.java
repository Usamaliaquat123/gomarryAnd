package com.gomarry;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.swmansion.reanimated.ReanimatedPackage;
import com.wenkesj.voice.VoicePackage;
import de.innfactory.apiai.RNApiAiPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.vinzscam.rntusclient.RNTusClientPackage;
import com.rnfs.RNFSPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;

import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import io.invertase.firebase.RNFirebasePackage;

import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(), new ReanimatedPackage(), new VoicePackage(),
          new RNApiAiPackage(), new RNDeviceInfo(), new RNCWebViewPackage(), // <-- Add
                                                                                                              // this
                                                                                                              // line
          new RNFirebasePackage(), new RNTusClientPackage(), new RNFSPackage(), new ReactVideoPackage(),
          new VectorIconsPackage(), new LinearGradientPackage(), new PickerPackage(), new RNGestureHandlerPackage(),
          new ReactNativeConfigPackage(), new LottiePackage(), new AsyncStoragePackage(),
          new RNFirebaseMessagingPackage(), new RNFirebaseNotificationsPackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
