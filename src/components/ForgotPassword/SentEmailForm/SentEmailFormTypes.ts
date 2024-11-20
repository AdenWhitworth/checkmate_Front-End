/**
 * Props for the SentEmailForm component.
 * 
 * @interface SentEmailFormProps
 * @property {(event: React.FormEvent<HTMLFormElement>) => void} handleSubmit - A function to handle the form submission.
 */
export interface SentEmailFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};