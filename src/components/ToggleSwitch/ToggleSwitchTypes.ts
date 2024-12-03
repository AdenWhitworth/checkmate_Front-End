/**
 * Interface defining the properties for the `ToggleSwitch` component.
 *
 * @interface ToggleSwitchArgs
 * @property {string} leftImgSrcActive - The source URL of the active image on the left side of the toggle.
 * @property {string} leftImgSrcInActive - The source URL of the inactive image on the left side of the toggle.
 * @property {string} rightImgSrcActive - The source URL of the active image on the right side of the toggle.
 * @property {string} rightImgSrcInActive - The source URL of the inactive image on the right side of the toggle.
 * @property {boolean} isToggle - The current state of the toggle; `true` if the left side is active, `false` if the right side is active.
 * @property {(isToggle: boolean | ((prev: boolean) => boolean)) => void} setIsToggle - A function to update the toggle state. Accepts a boolean or a function that returns a boolean based on the previous state.
 */
export interface ToggleSwitchArgs {
    leftImgSrcActive: string;
    leftImgSrcInActive: string;
    rightImgSrcActive: string;
    rightImgSrcInActive: string;
    isToggle: boolean;
    setIsToggle: (isToggle: boolean | ((prev: boolean) => boolean)) => void;
}