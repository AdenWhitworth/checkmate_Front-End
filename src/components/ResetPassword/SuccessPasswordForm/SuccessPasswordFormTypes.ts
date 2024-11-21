/**
 * Props for the SuccessPasswordForm component.
 * 
 * @interface SuccessPasswordFormProps
 * @property {(event: React.FormEvent<HTMLFormElement>) => void} handleSubmit - A function to handle the form submission.
 */
export interface SuccessPasswordFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};