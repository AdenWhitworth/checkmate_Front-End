/**
 * Props for the LoginForm component.
 * 
 * @interface LoginFormProps
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} handleInputChange - A function to handle changes in the input fields of the form.
 * @property {(event: React.FormEvent<HTMLFormElement>) => void} handleSubmit - A function to handle the form submission.
 */
export interface LoginFormProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};