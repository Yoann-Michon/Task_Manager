import { useState, useCallback, useMemo, type Dispatch, type SetStateAction, type ChangeEvent } from 'react';
import type { ObjectSchema } from 'joi';
import { ValidationManager, type FieldErrors } from './validationUtils';

interface UseFormValidationProps<T extends Record<string, any>> {
    schema: ObjectSchema<T>;
    initialData: T;
}

interface UseFormValidationReturn<T extends Record<string, any>> {
    formData: T;
    fieldErrors: FieldErrors;
    isLoading: boolean;
    error: string;

    setFormData: Dispatch<SetStateAction<T>>;
    setError: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<boolean>>;

    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    validateForm: () => boolean;
    clearError: () => void;
    clearFieldError: (fieldName: keyof T) => void;
    clearAllErrors: () => void;

    validationManager: ValidationManager<T>;
}

/**
 * Hook personnalisé pour gérer la validation des formulaires avec Joi
 */
export const useFormValidation = <T extends Record<string, any>>({
    schema,
    initialData
}: UseFormValidationProps<T>): UseFormValidationReturn<T> => {
    const [formData, setFormData] = useState<T>(initialData);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [error, setError] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);

    const validationManager = useMemo(
        () => new ValidationManager(schema, setFieldErrors),
        [schema]
    );

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            if (value) {
                validationManager.validateField(name as keyof T, value, newData);
            } else {
                validationManager.clearFieldError(name as keyof T);
            }

            if (name === 'password' && prev.confirmPassword) {
                setTimeout(() => {
                    validationManager.validateField('confirmPassword' as keyof T, prev.confirmPassword, newData);
                }, 0);
            }

            return newData;
        });
    }, [validationManager]);

    const validateForm = useCallback((): boolean => {
        return validationManager.validateForm(formData);
    }, [validationManager, formData]);

    const clearError = useCallback(() => setError(""), []);
    const clearFieldError = useCallback((fieldName: keyof T) => {
        validationManager.clearFieldError(fieldName);
    }, [validationManager]);
    const clearAllErrors = useCallback(() => {
        validationManager.clearAllErrors();
    }, [validationManager]);

    return {
        formData,
        fieldErrors,
        isLoading,
        error,

        setFormData,
        setError,
        setLoading,

        handleInputChange,
        validateForm,
        clearError,
        clearFieldError,
        clearAllErrors,

        validationManager
    };
};