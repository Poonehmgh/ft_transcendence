import React, { createContext, useState } from "react";
import { getDecodedTokenFromCookie } from "src/functions/utils";

export const AuthContext = createContext({
    validToken: false,
    userId: null,
    updateAuth: (isValid: boolean) => {},
});

/* export const AuthProvider = ({ children }) => {
    const [validToken, setValidToken] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    function updateAuth(isValid: boolean) {
        setValidToken(isValid);
        if (isValid) {
            const userIdString = getTokenFromCookie()?.id;
            const parsedUserId = userIdString ? parseInt(userIdString) : null;
            setUserId(parsedUserId);
        } else {
            setUserId(null); // Reset userId when token is not valid
        }
    }

    return (
        <AuthContext.Provider value={{ validToken, userId, updateAuth }}>
            {children}
        </AuthContext.Provider>
    );
}; */

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
