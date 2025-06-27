import MetaMaskSDK from '@metamask/sdk';
import { Link } from '@react-navigation/native';
import { Linking } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

export const MMSDK = new MetaMaskSDK({
    openDeeplink: (link) => {
        Linking.openURL(link);
    },
    timer: BackgroundTimer,
    dappMetadata: {
        name: 'My App',
        url: 'https://myapp.com',
    },
});