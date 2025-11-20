import { Box, Snackbar, Alert } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useThemeColors } from "../ThemeModeContext";
import { useSnackbar } from "../../context/SnackbarContext"; 

const Layout = () => {
  const colors = useThemeColors();
  const { open, snackbarData, closeSnackbar } = useSnackbar(); 

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    closeSnackbar();
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row",
        backgroundColor: colors.background.default,
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          backgroundColor: colors.background.default,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Header />
        <Box sx={{ flexGrow: 1, height: "calc(100vh - 50px)", overflow: "auto", justifyContent: "center" }}>
          <Outlet />
        </Box>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={snackbarData.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 7 }} 
      >
        <Alert
          onClose={handleClose}
          severity={snackbarData.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: 3,
          }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;