import Joi from 'joi';
import type { TFunction } from 'i18next';


export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const LoginSchema = (t: TFunction) => {
    return Joi.object<LoginFormData>({
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                'string.email': t('auth.login.invalidEmail'),
                'string.empty': t('auth.login.emailRequired'),
                'any.required': t('auth.login.emailRequired')
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.min': t('auth.login.passwordTooShort'),
                'string.empty': t('auth.login.passwordRequired'),
                'any.required': t('auth.login.passwordRequired')
            })
    });
};

export const RegisterSchema = (t: TFunction) => {
    return Joi.object<RegisterFormData>({
        username: Joi.string()
            .min(3)
            .max(30)
            .alphanum()
            .required()
            .messages({
                'string.min': t('auth.register.usernameTooShort'),
                'string.max': t('auth.register.usernameTooLong'),
                'string.alphanum': t('auth.register.usernameInvalid'),
                'string.empty': t('auth.register.usernameRequired'),
                'any.required': t('auth.register.usernameRequired')
            }),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                'string.email': t('auth.register.invalidEmail'),
                'string.empty': t('auth.register.emailRequired'),
                'any.required': t('auth.register.emailRequired')
            }),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .required()
            .messages({
                'string.min': t('auth.register.passwordTooShort'),
                'string.pattern.base': t('auth.register.passwordWeak'),
                'string.empty': t('auth.register.passwordRequired'),
                'any.required': t('auth.register.passwordRequired')
            }),
        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': t('auth.register.passwordMismatch'),
                'string.empty': t('auth.register.confirmPasswordRequired'),
                'any.required': t('auth.register.confirmPasswordRequired')
            })
    });
};