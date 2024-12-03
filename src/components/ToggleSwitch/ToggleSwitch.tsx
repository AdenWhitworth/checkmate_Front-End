import React from "react";
import "./ToggleSwitch.css";
import { ToggleSwitchArgs } from "./ToggleSwitchTypes";

/**
 * ToggleSwitch component.
 *
 * A UI component that renders a toggle switch with customizable icons for active and inactive states.
 *
 * @param {ToggleSwitchArgs} props - The properties for the ToggleSwitch component.
 * @param {string} props.leftImgSrcActive - The source URL of the active image on the left side.
 * @param {string} props.leftImgSrcInActive - The source URL of the inactive image on the left side.
 * @param {string} props.rightImgSrcActive - The source URL of the active image on the right side.
 * @param {string} props.rightImgSrcInActive - The source URL of the inactive image on the right side.
 * @param {boolean} props.isToggle - The current state of the toggle (true for left active, false for right active).
 * @param {(prev: boolean) => void} props.setIsToggle - The function to update the toggle state.
 * 
 * @returns {JSX.Element} The rendered ToggleSwitch component.
 */
export default function ToggleSwitch({
  leftImgSrcActive,
  leftImgSrcInActive,
  rightImgSrcActive,
  rightImgSrcInActive,
  isToggle,
  setIsToggle,
}: ToggleSwitchArgs): JSX.Element {
    
    /**
     * Toggle between left and right switch states
     */
    const toggleSwitch = () => {
        setIsToggle((prev) => !prev);
    };

    return (
        <div className="toggle-container" onClick={toggleSwitch}>
            <div className={`toggle-circle ${isToggle ? "toggle-left" : "toggle-right"}`}>
                <img
                    src={isToggle ? leftImgSrcActive : rightImgSrcActive}
                    alt="Active toggle icon"
                />
            </div>
            <div className="toggle-icons">
                <img
                    src={leftImgSrcInActive}
                    alt="Left inactive icon"
                    className={`icon-left ${isToggle ? "hidden-icon" : "visible-icon"}`}
                />
                <img
                    src={rightImgSrcInActive}
                    alt="Right inactive icon"
                    className={`icon-right ${!isToggle ? "hidden-icon" : "visible-icon"}`}
                />
            </div>
        </div>
    );
}