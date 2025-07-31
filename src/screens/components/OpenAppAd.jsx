// OpenAppAdManager.js
import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

let appOpenAd = null;

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx';

export const loadOpenAppAd = () => {
    appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    appOpenAd.load();

    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Open App Ad Loaded');
    });

    appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log('Ad load error', error);
    });
};

export const showOpenAppAd = () => {
    if (appOpenAd && appOpenAd.loaded) {
        appOpenAd.show();
    }
};
