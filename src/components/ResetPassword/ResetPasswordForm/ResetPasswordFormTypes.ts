/**
 * Props for the ResetPasswordForm component.
 * 
 * @interface ResetPasswordFormProps
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} handleInputChange - A function to handle changes in the input fields of the form.
 * @property {(event: React.FormEvent<HTMLFormElement>) => void} handleSubmit - A function to handle the form submission.
 */
export interface ResetPasswordFormProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};