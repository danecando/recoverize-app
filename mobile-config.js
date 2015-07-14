App.info({
    name: 'Recoverize',
    description: 'The social 12 step recovery app',
    author: 'Dane Grant',
    email: 'app@recoverize.com',
    website: 'http://recoverize.com',
    version: '0.1.0'
});

App.icons({
    // Android
    'android_ldpi': 'resources/icons/icon-36x36.png',
    'android_mdpi': 'resources/icons/icon-48x48.png',
    'android_hdpi': 'resources/icons/icon-72x72.png',
    'android_xhdpi': 'resources/icons/icon-96x96.png'
});

App.accessRule('*');

App.launchScreens({

    // Android
    'android_ldpi_portrait': 'resources/splash/drawable-port-ldpi-screen.png',
    'android_ldpi_landscape': 'resources/splash/drawable-land-ldpi-screen.png',
    'android_mdpi_portrait': 'resources/splash/drawable-port-mdpi-screen.png',
    'android_mdpi_landscape': 'resources/splash/drawable-land-mdpi-screen.png',
    'android_hdpi_portrait': 'resources/splash/drawable-port-hdpi-screen.png',
    'android_hdpi_landscape': 'resources/splash/drawable-land-hdpi-screen.png',
    'android_xhdpi_portrait': 'resources/splash/drawable-port-xhdpi-screen.png',
    'android_xhdpi_landscape': 'resources/splash/drawable-land-xhdpi-screen.png'
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#123865');

