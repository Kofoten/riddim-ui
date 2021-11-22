import React, { FC } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { Token } from '../common/token';

const googleLoginSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const googleLoginResponse = response as GoogleLoginResponse;
    if (googleLoginResponse.tokenObj) {

        var tokenCacheItem: Token = {
            expiresAt: googleLoginResponse.tokenObj.expires_at,
            idToken: googleLoginResponse.tokenObj.id_token
        };

        window.sessionStorage.setItem("riddim_token", JSON.stringify(tokenCacheItem));
    }
}

const googleLoginError = (error: any) => {
    console.error(error);
}

const Login: FC = () => {
    return (
        <GoogleLogin
            clientId="clientId"
            buttonText="Login"
            onSuccess={googleLoginSuccess}
            onFailure={googleLoginError}
            cookiePolicy={'single_host_origin'}
        />);
};

export default Login;