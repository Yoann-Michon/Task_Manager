import { useState, type FormEvent } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    TextField,
    Button,
    Divider,
    Typography,
    IconButton,
    InputAdornment,
    Alert
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslation } from 'react-i18next';
import { RegisterSchema, type RegisterFormData } from '../../joi/Schemas';
import { useFormValidation } from '../../joi/useFormValidation';
import { useThemeColors } from '../ThemeModeContext';
import { useSnackbar } from '../../context/SnackbarContext';
import userService from '../../services/User.service';

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const { showSuccess, showError } = useSnackbar(); // ✅ AJOUTÉ
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const initialData: RegisterFormData = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    const {
        formData,
        fieldErrors,
        isLoading,
        error,
        setError,
        setLoading,
        handleInputChange,
        validateForm,
        clearError
    } = useFormValidation({
        schema: RegisterSchema(t),
        initialData
    });

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearError();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            console.log("Tentative d'inscription avec:", {
                username: formData.username,
                email: formData.email
            });
            
            await userService.register({
                name: formData.username,
                email: formData.email,
                password: formData.password
            });

            console.log("Inscription réussie");
            
            showSuccess(t('success.registerSuccess') || 'Inscription réussie ! Connectez-vous maintenant.');
            
            setTimeout(() => {
                onSwitchToLogin();
            }, 1500);
            
        } catch (err: any) {
            console.error("Erreur d'inscription:", err);
            
            // ✅ Afficher notification d'erreur
            const errorMessage = err?.message || t('auth.register.registerError');
            showError(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { 
            id: 'username', 
            label: t('auth.register.username'), 
            type: 'text', 
            autoComplete: 'username',
            placeholder: t('auth.register.usernamePlaceholder')
        },
        { 
            id: 'email', 
            label: t('auth.email'), 
            type: 'email', 
            autoComplete: 'email',
            placeholder: t('auth.emailPlaceholder')
        },
        { 
            id: 'password', 
            label: t('auth.password'), 
            type: showPassword ? 'text' : 'password', 
            autoComplete: 'new-password',
            placeholder: t('auth.register.passwordPlaceholder')
        },
        { 
            id: 'confirmPassword', 
            label: t('auth.register.confirmPassword'), 
            type: showConfirmPassword ? 'text' : 'password', 
            autoComplete: 'new-password',
            placeholder: t('auth.register.confirmPasswordPlaceholder')
        }
    ];

    return (
        <>
            <Typography variant="h5" sx={{ 
                color: colors.text.primary, 
                mb: 3, 
                fontWeight: 'bold' 
            }}>
                {t('auth.register.title')}
            </Typography>

            {error && (
                <Alert 
                    severity="error" 
                    onClose={clearError}
                    sx={{ 
                        width: "100%", 
                        maxWidth: "350px", 
                        mb: 2,
                        backgroundColor: colors.error,
                        color: colors.text.primary,
                        '& .MuiAlert-icon': {
                            color: colors.text.primary
                        }
                    }}
                >
                    {error}
                </Alert>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: "350px" }}>
                {formFields.map(({ id, label, type, autoComplete, placeholder }) => (
                    <FormControl key={id} fullWidth sx={{ my: 1.5 }}>
                        <FormLabel htmlFor={id} sx={{ 
                            color: colors.text.primary, 
                            mb: 0.5, 
                            alignSelf: "start", 
                            fontSize: "0.9rem" 
                        }}>
                            {label}
                        </FormLabel>
                        <TextField
                            id={id}
                            name={id}
                            type={type}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            required
                            fullWidth
                            disabled={isLoading}
                            value={formData[id as keyof RegisterFormData]}
                            onChange={handleInputChange}
                            error={!!fieldErrors[id]}
                            helperText={fieldErrors[id]}
                            InputProps={{
                                sx: {
                                    borderRadius: "8px",
                                    backgroundColor: colors.background.sidebar,
                                    color: colors.text.secondary,
                                    '& fieldset': { 
                                        borderColor: fieldErrors[id] ? colors.error : colors.border
                                    },
                                    '&.Mui-focused fieldset': { 
                                        borderColor: fieldErrors[id] ? colors.error : colors.primary
                                    },
                                    '& input': {
                                        padding: "10px",
                                        fontSize: "0.87rem"
                                    },
                                },
                                ...(id === 'password' && {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton 
                                                onClick={togglePasswordVisibility} 
                                                edge="end" 
                                                sx={{ color: colors.text.secondary }}
                                                disabled={isLoading}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }),
                                ...(id === 'confirmPassword' && {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton 
                                                onClick={toggleConfirmPasswordVisibility} 
                                                edge="end" 
                                                sx={{ color: colors.text.secondary }}
                                                disabled={isLoading}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                })
                            }}
                            FormHelperTextProps={{
                                sx: { color: colors.error, fontSize: "0.75rem" }
                            }}
                        />
                    </FormControl>
                ))}

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                        color: colors.text.primary,
                        backgroundColor: colors.primary,
                        '&:hover': {
                            backgroundColor: colors.iconSelected,
                        },
                        '&:disabled': {
                            backgroundColor: colors.background.selected,
                            color: colors.text.tertiary
                        },
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        mt: 2,
                        mb: 2
                    }}
                >
                    {isLoading ? t('auth.register.registering') : t('auth.register.registerButton')}
                </Button>

                <Divider sx={{
                    my: 2,
                    width: "100%",
                    "&::before, &::after": {
                        borderColor: colors.divider,
                    },
                }}/>

                <Typography variant="body1" align="center" sx={{ 
                    color: colors.text.tertiary, 
                    fontSize: "0.7rem" 
                }}>
                    {t('auth.register.alreadyHaveAccount')}{" "}
                    <Typography 
                        component="span" 
                        onClick={onSwitchToLogin}
                        sx={{ 
                            color: colors.primary, 
                            '&:hover': { textDecoration: 'underline' }, 
                            fontSize: "0.7rem",
                            cursor: "pointer"
                        }}
                    >
                        {t('auth.login.loginButton')}
                    </Typography>
                </Typography>
            </Box>
        </>
    );
};

export default SignupForm;