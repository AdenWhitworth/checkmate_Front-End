/**
 * Props for the ForgotPasswordForm component.
 * 
 * @interface ForgotPasswordFormProps
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} handleInputChange - A function to handle changes in the input fields of the form.
 * @property {(event: React.FormEvent<HTMLFormElement>) => void} handleSubmit - A function to handle the form submission.
 */
export interface ForgotPasswordFormProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};