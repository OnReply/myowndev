/* global FB */

import {
  unloadFacebookSDK,
  loadFBsdk,
} from '../../../../../shared/helpers/facebookInitializer';

export const refreshToken = async selectedChat => {
  if (Object.keys(selectedChat).length === 0) return;
  if (!selectedChat.meta.hasOwnProperty('access_token')) return;
  if (!selectedChat.meta.refresh_token) return;
  loadFBsdk();
  if (window.fbSDKLoaded === undefined) {
    window.fbAsyncInit = () => {
      FB.init({
        appId: window.chatwootConfig.fbAppId,
        xfbml: true,
        version: window.chatwootConfig.fbApiVersion,
        status: true,
        accessToken: selectedChat.meta.access_token,
      });
      window.fbSDKLoaded = true;
      FB.api(`/me?access_token=${selectedChat.meta.access_token}`);
      unloadFacebookSDK();
    };
  }
  // FB.api('/me',{accessToken: selectedChat.meta.accessToken})
};
