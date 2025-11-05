package com.example.codenebula;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

public class AlertWindow {
    private WindowManager windowManager;
    private View overlayView;
    private Context context;
    private ProgressBar progressBar;
    private TextView progressText;
    private LinearLayout buttonContainer;
    private Button continueButton;
    private Button goBackButton;
    private Handler handler;
    private boolean isShowing = false;
    protected String redirectUrl ; // Default URL, you can change this

    public interface OnActionListener {
        void onContinueClicked();
        void onGoBackClicked();
    }

    private OnActionListener actionListener;

    public AlertWindow(Context context) {
        this.context = context;
        this.windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        this.handler = new Handler(Looper.getMainLooper());
    }

    public void setOnActionListener(OnActionListener listener) {
        this.actionListener = listener;
    }

    public void setRedirectUrl(String url) {
        this.redirectUrl = url;
    }

    public void showProgressWindow(String s) {
        if (isShowing || overlayView != null) {
            return; // Already showing
        }
        redirectUrl = s;
        handler.post(() -> {
            try {
                // Create the overlay layout
                overlayView = createOverlayView();

                // Set up window parameters
                WindowManager.LayoutParams params = new WindowManager.LayoutParams();

                // For Android 8.0+ use TYPE_APPLICATION_OVERLAY, for older versions use TYPE_SYSTEM_ALERT
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    params.type = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
                } else {
                    params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
                }

                // Make it click-through initially
                params.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                        WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                        WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH;

                params.format = PixelFormat.TRANSLUCENT;
                params.gravity = Gravity.CENTER;
                params.width = dpToPx(320);
                params.height = WindowManager.LayoutParams.WRAP_CONTENT;

                // Add the view to window manager
                windowManager.addView(overlayView, params);
                isShowing = true;

            } catch (Exception e) {
                e.printStackTrace();
                android.util.Log.e("AlertWindow", "Error showing overlay: " + e.getMessage());
            }
        });
    }

    private View createOverlayView() {
        // Create main container
        LinearLayout container = new LinearLayout(context);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setGravity(Gravity.CENTER);
        container.setPadding(dpToPx(24), dpToPx(24), dpToPx(24), dpToPx(24));

        // Set beautiful background
        container.setBackground(createMainBackground());

        // Title text
        TextView titleText = new TextView(context);
        titleText.setText("Security Check");
        titleText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        titleText.setTextColor(Color.parseColor("#2C3E50"));
        titleText.setTypeface(null, Typeface.BOLD);
        titleText.setGravity(Gravity.CENTER);

        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.setMargins(0, 0, 0, dpToPx(16));
        container.addView(titleText, titleParams);

        // Progress text
        progressText = new TextView(context);
        progressText.setText("Analyzing content... 0%");
        progressText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        progressText.setTextColor(Color.parseColor("#34495E"));
        progressText.setGravity(Gravity.CENTER);

        LinearLayout.LayoutParams progressTextParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        progressTextParams.setMargins(0, 0, 0, dpToPx(12));
        container.addView(progressText, progressTextParams);

        // Progress bar container for better styling
        LinearLayout progressContainer = new LinearLayout(context);
        progressContainer.setOrientation(LinearLayout.VERTICAL);
        progressContainer.setPadding(dpToPx(8), dpToPx(8), dpToPx(8), dpToPx(8));
        progressContainer.setBackground(createProgressBackground());

        // Styled progress bar
        progressBar = new ProgressBar(context, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setProgress(0);

        // Style the progress bar
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            progressBar.setProgressTintList(android.content.res.ColorStateList.valueOf(Color.parseColor("#3498DB")));
            progressBar.setProgressBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.parseColor("#ECF0F1")));
        }

        LinearLayout.LayoutParams progressParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dpToPx(8)
        );
        progressBar.setLayoutParams(progressParams);

        progressContainer.addView(progressBar);

        LinearLayout.LayoutParams progressContainerParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        progressContainerParams.setMargins(0, 0, 0, dpToPx(20));
        container.addView(progressContainer, progressContainerParams);

        // Button container (initially hidden)
        buttonContainer = new LinearLayout(context);
        buttonContainer.setOrientation(LinearLayout.VERTICAL);
        buttonContainer.setGravity(Gravity.CENTER);
        buttonContainer.setVisibility(View.GONE);
        buttonContainer.setPadding(0, dpToPx(8), 0, 0);

        // Continue button (styled as primary)
        continueButton = createStyledButton("Continue Anyway", "#E74C3C", "#FFFFFF");
        continueButton.setOnClickListener(v -> {
            if (actionListener != null) {
                actionListener.onContinueClicked();
            }
            openUrlInChrome();
            dismiss();
        });

        // Go back button (styled as secondary)
        goBackButton = createStyledButton("Go Back", "#95A5A6", "#FFFFFF");
        goBackButton.setOnClickListener(v -> {
            if (actionListener != null) {
                actionListener.onGoBackClicked();
            }
            dismiss();
        });

        // Add buttons with proper spacing
        LinearLayout.LayoutParams buttonParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        buttonParams.setMargins(0, dpToPx(6), 0, dpToPx(6));

        buttonContainer.addView(continueButton, buttonParams);
        buttonContainer.addView(goBackButton, buttonParams);

        container.addView(buttonContainer);

        return container;
    }

    private Button createStyledButton(String text, String bgColor, String textColor) {
        Button button = new Button(context);
        button.setText(text);
        button.setTextColor(Color.parseColor(textColor));
        button.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        button.setTypeface(null, Typeface.BOLD);
        button.setPadding(dpToPx(16), dpToPx(12), dpToPx(16), dpToPx(12));
        button.setBackground(createButtonBackground(bgColor));
        button.setAllCaps(false);

        // Add elevation effect for newer versions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            button.setElevation(dpToPx(2));
            button.setStateListAnimator(null); // Remove default animation
        }

        return button;
    }

    private GradientDrawable createMainBackground() {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(Color.parseColor("#FFFFFF"));
        drawable.setCornerRadius(dpToPx(16));
        drawable.setStroke(dpToPx(1), Color.parseColor("#BDC3C7"));

        // Add shadow effect
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            // Shadow will be handled by elevation in the container
        }

        return drawable;
    }

    private GradientDrawable createProgressBackground() {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(Color.parseColor("#F8F9FA"));
        drawable.setCornerRadius(dpToPx(8));
        drawable.setStroke(dpToPx(1), Color.parseColor("#E9ECEF"));
        return drawable;
    }

    private GradientDrawable createButtonBackground(String color) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(Color.parseColor(color));
        drawable.setCornerRadius(dpToPx(8));

        // Add subtle border
        if (color.equals("#E74C3C")) {
            drawable.setStroke(dpToPx(1), Color.parseColor("#C0392B"));
        } else {
            drawable.setStroke(dpToPx(1), Color.parseColor("#7F8C8D"));
        }

        return drawable;
    }

    private int dpToPx(int dp) {
        float density = context.getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    private void openUrlInChrome() {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(redirectUrl));
            intent.setPackage("com.android.chrome"); // Try Chrome first
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        } catch (Exception e) {
            // If Chrome is not available, use default browser
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(redirectUrl));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            } catch (Exception ex) {
                android.util.Log.e("AlertWindow", "Cannot open URL: " + ex.getMessage());
            }
        }
    }

    public void updateProgress(int progress) {
        if (progressBar != null && progressText != null && isShowing) {
            handler.post(() -> {
                try {
                    progressBar.setProgress(progress);
                    progressText.setText("Analyzing content... " + progress + "%");

                    if (progress >= 100) {
                        showButtons();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }

    private void showButtons() {
        if (buttonContainer != null && overlayView != null && isShowing) {
            handler.post(() -> {
                try {
                    progressText.setText("⚠️ Potentially harmful content detected!");
                    progressText.setTextColor(Color.parseColor("#E74C3C"));
                    progressText.setTypeface(null, Typeface.BOLD);

                    buttonContainer.setVisibility(View.VISIBLE);

                    // Make window interactive now
                    WindowManager.LayoutParams params = (WindowManager.LayoutParams) overlayView.getLayoutParams();
                    params.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
                    windowManager.updateViewLayout(overlayView, params);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }

    public void dismiss() {
        handler.post(() -> {
            if (overlayView != null && windowManager != null && isShowing) {
                try {
                    windowManager.removeView(overlayView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            overlayView = null;
            isShowing = false;
        });
        Intent intent = new Intent(context, LinkDetectorService.class);
        context.stopService(intent);
    }

    public boolean isShowing() {
        return isShowing && overlayView != null;
    }
}