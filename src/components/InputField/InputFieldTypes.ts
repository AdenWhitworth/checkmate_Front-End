export interface InputFieldProps {
    label: string;
    name?: string;
    type?: string;
    id?: string
    value?: string;
    isRequired: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isSpellCheck: boolean;
    isDisabled?: boolean;
    'data-testid'?: string;
}