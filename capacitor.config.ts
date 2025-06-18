import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.charcoal.snuggle',
  appName: 'snuggle',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['snuggle.onrender.com'],
    hostname: 'localhost'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
      launchAutoHide: true,
      launchFadeOutDuration: 5000,
      backgroundColor: "#000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  },
};

export default config;
