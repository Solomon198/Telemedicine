package com.ash_magic_app;
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }
}
