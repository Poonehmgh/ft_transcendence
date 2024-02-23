import React, { createContext, useState } from "react";
import Toast from "src/components/shared/Toast";

export const ToastContext = createContext(null);

export function ToastProvider ({ children }) {
	const [toastMessage, setToastMessage] = useState('');
    const [key, setKey] = useState(0);

    function showToast(message: string)  {
        setToastMessage(message);
        setKey((prevKey) => prevKey + 1);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toastMessage && <Toast key={key} message={toastMessage} />}
        </ToastContext.Provider>
    );
};
