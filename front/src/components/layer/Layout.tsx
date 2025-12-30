import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useThemeColors } from "../ThemeModeContext";

const Layout = () => {
  const colors = useThemeColors();

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
        <Box
          sx={{
            flexGrow: 1,
            height: "calc(100vh - 50px)",
            overflow: "auto",
            justifyContent: "center"
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;