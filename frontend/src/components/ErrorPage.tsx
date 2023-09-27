import Header from "./Header";
import React from "react";

function ErrorPage() {
    return (
        <div className="sections-container">
          <Header />
            <div className="section left-bar">Left Bar</div>
            <div className="section center">
                <div>Error 404: Page not found</div>
            </div>
            <div className="section right-bar">Right Bar</div>
            <div className="section footer">Footer</div>
        </div>
    );
}

export default ErrorPage;