import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.charcoal.snuggle',
  appName: 'snuggle',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['snuggle.onrender.com'],
    hostname: 'localhost'
  }
};

export default config;
