package com.example.codenebula;

import static androidx.fragment.app.FragmentManager.TAG;

import android.annotation.SuppressLint;
import android.util.Log;
import android.widget.Toast;

import io.flutter.plugin.common.MethodChannel;

public class FlutterChannelHelper
{
    public static MethodChannel methodChannel;

    public static void setMethodChannel(MethodChannel mc){
        methodChannel = mc;
    }

    @SuppressLint("RestrictedApi")
    public static void sendLinkToFlutter(String url) {
        Log.d(TAG,"sendLinkToFlutter: inside the method");
        if(methodChannel!=null){
            Log.d(TAG, "sendLinkToFlutter: inside if statemnt ");
            methodChannel.invokeMethod("onLinkReceived",url);
        }
    }

}
