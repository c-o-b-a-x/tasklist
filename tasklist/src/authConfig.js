export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_APP_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_DIRECT_ID}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
};
