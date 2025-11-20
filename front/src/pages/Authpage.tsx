import { useState } from 'react';
import { Stack, Card, Box } from "@mui/material";
import { useThemeColors } from '../components/ThemeModeContext';
import SigninForm from '../components/signForm/SignIn';
import SignupForm from '../components/signForm/SignUp';

const AuthPage = () => {
    const colors = useThemeColors();
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    const switchToLogin = () => setAuthMode('login');
    const switchToRegister = () => setAuthMode('register');

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
                minHeight: "100vh",
                backgroundColor: colors.background.default,
            }}
        >
            <Card
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "center",
                    width: { xs: "95%", sm: "80%", md: "70%" },
                    height: "auto",
                    minHeight: { md: "550px" },
                    maxWidth: "1000px",
                    borderRadius: "50px",
                    overflow: "hidden",
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.3)",
                    backgroundColor: colors.background.paper,
                }}
            >
                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        backgroundColor: "transparent",
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    {authMode === 'login' ? (
                        <SigninForm onSwitchToRegister={switchToRegister} />
                    ) : (
                        <SignupForm onSwitchToLogin={switchToLogin} />
                    )}
                </Box>
            </Card>
        </Stack>
    );
};

export default AuthPage;