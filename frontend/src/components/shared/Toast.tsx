import React, { useState, useEffect } from "react";

// CSS
import "src/styles/style.css";

interface ToastProps {
    message: string;
}

function Toast(props: ToastProps): React.JSX.Element {
    const [visible, setVisible] = useState(true);

	console.log("entering Taost component");
	

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("setting visible to false in setTimeout");
			setVisible(false);

        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={`toast ${visible ? 'show' : 'hide'}`}>
            {props.message}
        </div>
    );
}

export default Toast;
