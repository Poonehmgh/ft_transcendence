import React, { createContext, useState } from "react";
import { getDecodedTokenFromCookie } from "src/functions/utils";

export const AuthContext = createContext({
    validToken: false,
    userId: null,
    updateAuth: (isValid: boolean) => {},
});

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        validToken: false,
        userId: null,
    });

    function updateAuth(isValid: boolean) {
        const userId = isValid ? parseInt(getDecodedTokenFromCookie()?.id) : null;
        setAuthState({ validToken: isValid, userId: userId });
    }

    const contextValue = {
        ...authState,
        updateAuth: updateAuth,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
