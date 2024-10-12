export interface LoginFormProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};