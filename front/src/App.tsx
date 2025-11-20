import { useEffect, useState, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./components/layer/Layout";
import userService from "./services/User.service";
import { UserProvider } from "./context/userContext";

const Login = lazy(() => import("./pages/Authpage"));
const Home = lazy(() => import("./pages/Home"));
//const Account = lazy(() => import("./pages/Account"));
//const Settings = lazy(() => import("./pages/Settings"));

const PrivateRoute = () => {
  const [authChecked, setAuthChecked] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    userService
      .checkAuth()
      .then((isAuth) => {
        if (mounted) setAuthChecked(isAuth);
      })
      .catch(() => {
        if (mounted) setAuthChecked(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (authChecked === null) return null;

  return authChecked ? <Outlet /> : <Navigate to="/auth/login" />;
};

function App() {

  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              {/*    <Route path="/account" element={<Account />} />*/}
              {/*    <Route path="/settings" element={<Settings />} />*/}
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
