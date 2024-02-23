import React, { useState, useEffect } from "react";

// CSS
import "src/styles/style.css";

interface ToastProps {
    message: string;
    duration?: number;
}

function Toast(props: ToastProps): React.JSX.Element {
    const [visible, setVisible] = useState(true);

    console.log("Toast message: ", props.message);
    console.log("Toast duration: ", props.duration);
    console.log("Toast visible: ", visible);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, props.duration || 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [props.duration]);

    const handleToastClick = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="toast" onClick={handleToastClick}>
            {props.message}
        </div>
    );
}

export default Toast;
