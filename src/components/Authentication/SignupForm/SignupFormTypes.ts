/**
 * Interface defining the props for the SignupForm component.
 * 
 * @interface SignupFormProps
 * @property {function} handleInputChange - Callback function to handle changes in the input fields. It receives an event of type React.ChangeEvent<HTMLInputElement>.
 * @property {function} handleSubmit - Callback function to handle the form submission. It receives an event of type React.FormEvent<HTMLFormElement>.
 */
export interface SignupFormProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};