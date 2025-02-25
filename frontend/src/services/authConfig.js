export const msalConfig = {
    auth: {
        clientId: "23463c14-688d-4e8d-b3a5-13c421e276dd",
        authority: "https://login.microsoftonline.com/410adee4-b811-40a9-8a94-49b729819135",
        redirectUri: "http://localhost:3000/"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        allowNativeBroker:false	
    }
};


export const loginRequest = {
    scopes: ["User.Read"],
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
