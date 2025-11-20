import { useState, type FormEvent } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    TextField,
    FormControlLabel,
    Checkbox,
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
import { useNavigate } from 'react-router-dom'; // ✅ AJOUTÉ
import { LoginSchema, type LoginFormData } from '../../joi/Schemas';
import { useFormValidation } from '../../joi/useFormValidation';
import { useThemeColors } from '../ThemeModeContext';
import { useSnackbar } from '../../context/SnackbarContext'; // ✅ AJOUTÉ
import userService from '../../services/User.service';

interface SigninFormProps {
    onSwitchToRegister: () => void;
}

const SigninForm = ({ onSwitchToRegister }: SigninFormProps) => {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const navigate = useNavigate(); // ✅ AJOUTÉ
    const { showSuccess, showError } = useSnackbar(); // ✅ AJOUTÉ
    const [showPassword, setShowPassword] = useState(false);

    const initialData: LoginFormData = {
        email: '',
        password: ''
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
        schema: LoginSchema(t),
        initialData
    });

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearError();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            console.log("Tentative de connexion avec:", formData);
            
            await userService.login({
                email: formData.email,
                password: formData.password
            });

            console.log("Connexion réussie");
            
            showSuccess(t('success.loginSuccess'));
            
            setTimeout(() => {
                navigate('/home');
            }, 1000);
            
        } catch (err: any) {
            console.error("Erreur de connexion:", err);
            
            const errorMessage = err?.message || t('auth.login.loginError');
            showError(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Typography variant="h5" sx={{ 
                color: colors.text.primary, 
                mb: 3, 
                fontWeight: 'bold' 
            }}>
                {t('auth.login.title')}
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
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <FormLabel htmlFor="email" sx={{ 
                        color: colors.text.primary, 
                        mb: 0.5, 
                        alignSelf: "start", 
                        fontSize: "0.9rem" 
                    }}>
                        {t('auth.email')}
                    </FormLabel>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        placeholder={t('auth.emailPlaceholder')}
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        disabled={isLoading}
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!fieldErrors.email}
                        helperText={fieldErrors.email}
                        InputProps={{
                            sx: {
                                borderRadius: "8px",
                                backgroundColor: colors.background.sidebar,
                                color: colors.text.secondary,
                                '& fieldset': {
                                    borderColor: fieldErrors.email ? colors.error : colors.border,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: fieldErrors.email ? colors.error : colors.primary,
                                }, 
                                '& input': {
                                    padding: "10px",
                                    fontSize: "0.87rem"
                                },
                            }
                        }}
                        FormHelperTextProps={{
                            sx: { color: colors.error, fontSize: "0.75rem" }
                        }}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ my: 2 }}>
                    <FormLabel htmlFor="password" sx={{ 
                        color: colors.text.primary, 
                        mb: 0.5, 
                        alignSelf: "start", 
                        fontSize: "0.9rem" 
                    }}>
                        {t('auth.password')}
                    </FormLabel>
                    <TextField
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        fullWidth
                        disabled={isLoading}
                        placeholder={t('auth.passwordPlaceholder')}
                        value={formData.password}
                        onChange={handleInputChange}
                        error={!!fieldErrors.password}
                        helperText={fieldErrors.password}
                        InputProps={{
                            sx: {
                                borderRadius: "8px",
                                backgroundColor: colors.background.sidebar,
                                color: colors.text.secondary,
                                '& fieldset': { 
                                    borderColor: fieldErrors.password ? colors.error : colors.border
                                },
                                '&.Mui-focused fieldset': { 
                                    borderColor: fieldErrors.password ? colors.error : colors.primary
                                },
                                '& input': {
                                    padding: "10px",
                                    fontSize: "0.87rem"
                                },
                            },
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
                        }}
                        FormHelperTextProps={{
                            sx: { color: colors.error, fontSize: "0.75rem" }
                        }}
                    />
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                        control={<Checkbox sx={{
                            color: colors.text.tertiary,
                            '& .MuiSvgIcon-root': {
                                fontSize: 20,
                            }
                        }} disabled={isLoading} />}
                        label={<Typography variant="body2" sx={{ 
                            color: colors.text.tertiary, 
                            fontSize: "0.8rem" 
                        }}>
                            {t('auth.login.rememberMe')}
                        </Typography>}
                    />
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: colors.primary, 
                            '&:hover': { textDecoration: 'underline' }, 
                            fontSize: "0.8rem",
                            cursor: "pointer"
                        }}
                    >
                        {t('auth.login.forgotPassword')}
                    </Typography>
                </Box>

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
                        mb: 2
                    }}
                >
                    {isLoading ? t('auth.login.loggingIn') : t('auth.login.loginButton')}
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
                    {t('auth.login.noAccount')}{" "}
                    <Typography 
                        component="span" 
                        onClick={onSwitchToRegister}
                        sx={{ 
                            color: colors.primary, 
                            '&:hover': { textDecoration: 'underline' }, 
                            fontSize: "0.7rem",
                            cursor: "pointer"
                        }}
                    >
                        {t('auth.register.registerButton')}
                    </Typography>
                </Typography>
            </Box>
        </>
    );
};

export default SigninForm;