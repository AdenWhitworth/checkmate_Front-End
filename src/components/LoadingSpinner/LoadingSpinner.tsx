import React from "react";
import "./LoadingSpinner.css";

/**
 * LoadingSpinner Component displays a loading spinner to indicate ongoing processes or data loading.
 * @component
 * @returns {JSX.Element} The rendered loading spinner component.
 */

export default function LoadingSpinner(): JSX.Element {
    return (
        <div className="loading-container" data-testid="loading-spinner">
            <div className="loader" data-testid="loader"></div>
        </div>
    );
}