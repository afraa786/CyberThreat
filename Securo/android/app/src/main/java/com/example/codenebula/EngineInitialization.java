package com.example.codenebula;

import static androidx.fragment.app.FragmentManager.TAG;

import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.WindowManager;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;

import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.embedding.engine.dart.DartExecutor;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;

public class EngineInitialization extends Application {
    public static MethodChannel methodChannel;
    public static FlutterEngine flutterEngine;
    private AlertWindow alertWindow;
    private Handler handler = new Handler(Looper.getMainLooper());

    @SuppressLint("RestrictedApi")
    @Override
    public void onCreate() {
        super.onCreate();

        // Initialize Flutter Engine
        flutterEngine = new FlutterEngine(this);
        flutterEngine.getDartExecutor().executeDartEntrypoint(
                DartExecutor.DartEntrypoint.createDefault()
        );

        // Set up method channel
         methodChannel = new MethodChannel(
                flutterEngine.getDartExecutor().getBinaryMessenger(),
                "my_channel"
        );
        FlutterChannelHelper.setMethodChannel(methodChannel);

        // Initialize the alert window
        initializeAlertWindow();

        methodChannel.setMethodCallHandler(
                (call, result) -> {
                    switch (call.method) {
                        case "showDialog":
                            String url = call.argument("URL");
                            Log.d(TAG, "inside the main thing - showing alert window");
                            showAlertWindow(url);
                            startDemoProgress();
                            result.success("Alert window shown");
                            break;

                        case "validated":
                            Log.d(TAG, "inside case validated");
                            Boolean b = call.argument("isphishy");
                            if (Boolean.TRUE.equals(b)) {
                                Log.d(TAG, "onCreate: HOGAYAAAAAAA - Validation complete");
                                // Update progress to 100% to show the buttons
                                updateAlertProgress(100);
                            }
                            result.success("Validated");
                            break;

                        case "invalidated":
                            Log.d(TAG, "inside case invalidated");
                            Boolean b3 = call.argument("isphishy");
                            if (Boolean.TRUE.equals(b3)) {
                                Log.d(TAG, "onCreate: HOGAYAAAAAAA - Invalidation complete");
                                // Update progress to 100% to show the buttons
                                updateAlertProgress(100);
                            }
                            result.success("Invalidated");
                            break;

                        case "updateProgress":
                            // Allow Flutter to manually update progress
                            Integer progress = call.argument("progress");
                            if (progress != null) {
                                updateAlertProgress(progress);
                                Log.d(TAG, "Progress updated to: " + progress);
                            }
                            result.success("Progress updated");
                            break;

                        case "dismissAlert":
                            // Allow Flutter to dismiss the alert
                            dismissAlertWindow();
                            result.success("Alert dismissed");
                            break;

                        default:
                            result.notImplemented();
                            break;
                    }
                }
        );
    }

    @SuppressLint("RestrictedApi")
    private void initializeAlertWindow() {
        // Check if we have overlay permission
        if (!hasOverlayPermission()) {
            Log.w(TAG, "Overlay permission not granted. Alert window may not work properly.");
            // In a real app, you might want to request permission here
            // or show a notification to the user about enabling the permission
        }

        // Initialize the alert window
        alertWindow = new AlertWindow(this);

        // Set up callbacks for user actions
        alertWindow.setOnActionListener(new AlertWindow.OnActionListener() {
            @Override
            public void onContinueClicked() {
                Log.d(TAG, "User clicked 'Continue Anyway'");

                // Notify Flutter about the user's choice
                if (methodChannel != null) {
                    handler.post(() -> {
                        FlutterChannelHelper.methodChannel.invokeMethod("userChoice", "continue");
                    });
                }

                // You can also perform direct Java actions here
                handleContinueAction();
            }

            @Override
            public void onGoBackClicked() {
                Log.d(TAG, "User clicked 'Go Back'");

                // Notify Flutter about the user's choice
                if (methodChannel != null) {
                    handler.post(() -> {
                        FlutterChannelHelper.methodChannel.invokeMethod("userChoice", "goback");
                    });
                }

                // You can also perform direct Java actions here
                handleGoBackAction();
            }
        });
    }
    @SuppressLint("RestrictedApi")

    private void showAlertWindow(String s) {
        if (alertWindow != null) {
            if (hasOverlayPermission()) {
                alertWindow.showProgressWindow(s);

                // Optional: Start a demo progress if you want to test
                // startDemoProgress();
            } else {
                Log.e(TAG, "Cannot show alert window - overlay permission not granted");
                // You could show a Toast or regular dialog instead
                showPermissionRequiredMessage();
            }
        } else {
            Log.e(TAG, "Alert window is null");
        }
    }
    @SuppressLint("RestrictedApi")

    private void updateAlertProgress(int progress) {
        if (alertWindow != null && alertWindow.isShowing()) {
            alertWindow.updateProgress(progress);
            Log.d(TAG, "Alert progress updated to: " + progress + "%");
        } else {
            Log.w(TAG, "Cannot update progress - alert window not showing");
        }
    }
    @SuppressLint("RestrictedApi")

    private void dismissAlertWindow() {
        if (alertWindow != null) {
            alertWindow.dismiss();
            Log.d(TAG, "Alert window dismissed");
        }
    }
    @SuppressLint("RestrictedApi")

    private void handleContinueAction() {
        // Perform any Java-side actions when user clicks continue
        Log.d(TAG, "Handling continue action in Java");

        // Example: You might want to start your Flutter UI, continue background work, etc.
        // startFlutterActivity();
        // continueBackgroundProcessing();
    }
    @SuppressLint("RestrictedApi")

    private void handleGoBackAction() {
        // Perform any Java-side actions when user clicks go back
        Log.d(TAG, "Handling go back action in Java");

        // Example: You might want to stop background work, reset state, etc.
        // stopBackgroundProcessing();
        // resetApplicationState();
    }
    @SuppressLint("RestrictedApi")

    private boolean hasOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(this);
        }
        return true; // Permission not required for older versions
    }

    private void showPermissionRequiredMessage() {
        // Since we can't show system alert without permission,
        // you could show a regular toast or notification instead
        handler.post(() -> {
            Toast.makeText(this,
                    "Overlay permission required to show progress window",
                    Toast.LENGTH_LONG).show();
        });
    }

    // Optional: Demo progress for testing
    private void startDemoProgress() {
        new Thread(() -> {
            for (int i = 0; i <= 100; i += 5) {
                final int progress = i;
                handler.post(() -> updateAlertProgress(progress));

                try {
                    Thread.sleep(200); // Simulate work
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}

// Helper class to manage the method channel reference