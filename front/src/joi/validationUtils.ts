import type { ObjectSchema, ValidationResult } from 'joi';

export type FieldErrors = { [key: string]: string };

/**
 * Valide un champ individuel du formulaire
 */
export const validateField = <T extends Record<string, any>>(
    schema: ObjectSchema<T>,
    fieldName: keyof T,
    value: any,
    currentData?: T
): string => {
    try {
        const fieldSchema = schema.extract(fieldName as string);
        if (!fieldSchema) return '';

        const dataToValidate = currentData ? { ...currentData, [fieldName]: value } : { [fieldName]: value };
        
        let validationResult: ValidationResult;
        
        if (fieldName === 'confirmPassword' && currentData) {
            validationResult = schema.validate(dataToValidate, { 
                abortEarly: false,
                context: { password: currentData.password }
            });
        } else {
            const singleFieldSchema = schema.extract(fieldName as string);
            validationResult = singleFieldSchema.validate(value);
        }
        
        const { error } = validationResult;
        const fieldError = error?.details.find(detail => detail.path[0] === fieldName);
        
        return fieldError ? fieldError.message : '';
    } catch (err) {
        console.error(`Erreur lors de la validation du champ ${String(fieldName)}:`, err);
        return '';
    }
};

/**
 * Valide l'ensemble du formulaire
 */
export const validateForm = <T extends Record<string, any>>(
    schema: ObjectSchema<T>,
    formData: T
): { isValid: boolean; errors: FieldErrors } => {
    const { error } = schema.validate(formData, { abortEarly: false });
    
    if (error) {
        const errors: FieldErrors = {};
        error.details.forEach(detail => {
            if (detail.path[0]) {
                errors[detail.path[0] as string] = detail.message;
            }
        });
        return { isValid: false, errors };
    }
    
    return { isValid: true, errors: {} };
};

/**
 * Hook personnalisé pour la gestion des erreurs de champs
 */
export class ValidationManager<T extends Record<string, any>> {
    private schema: ObjectSchema<T>;
    private setFieldErrors: (errors: FieldErrors | ((prev: FieldErrors) => FieldErrors)) => void;

    constructor(
        schema: ObjectSchema<T>, 
        setFieldErrorsCallback: (errors: FieldErrors | ((prev: FieldErrors) => FieldErrors)) => void
    ) {
        this.schema = schema;
        this.setFieldErrors = setFieldErrorsCallback;
    }

    /**
     * Valide un champ et met à jour les erreurs
     */
    validateField = (fieldName: keyof T, value: any, currentData?: T): void => {
        const errorMessage = validateField(this.schema, fieldName, value, currentData);
        
        this.setFieldErrors(prev => ({
            ...prev,
            [fieldName as string]: errorMessage
        }));
    };

    /**
     * Efface l'erreur d'un champ
     */
    clearFieldError = (fieldName: keyof T): void => {
        this.setFieldErrors(prev => ({
            ...prev,
            [fieldName as string]: ''
        }));
    };

    /**
     * Valide tout le formulaire
     */
    validateForm = (formData: T): boolean => {
        const { isValid, errors } = validateForm(this.schema, formData);
        this.setFieldErrors(errors);
        return isValid;
    };

    /**
     * Efface toutes les erreurs
     */
    clearAllErrors = (): void => {
        this.setFieldErrors({});
    };
}