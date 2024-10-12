export interface SignupFormProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};