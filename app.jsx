
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import "./css/theme.css";

import Landpage from "./page/landing-page";
import Login from "./page/Login";
import Work from "./page/Workspace";
import Register from "./page/Register";
import NewBlueprint from "./page/new-blueprint";
import NewBlueprint2 from "./page/newblueprint2";
import DualWorkspace from "./page/DualWorkspace";
import ForgotPassword from "./page/ForgotPassword";
import VerifyEmail from "./page/VerifyEmail";
import ResetPassword from "./page/ResetPassword";
import Resources from "./page/Resources";
import BlueprintsAdmen from "./page/BlueprintsAdmen";
import Logs from "./page/Logs";
import SystemState from "./page/SystemState";
import Settings from "./page/Settings";
import Users from "./page/Users";
import Overview from "./page/Overview";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LANDING ================= */}

        <Route
  path="/"
  element={
    <Landpage
      dark={dark}
      setDark={setDark}
    />
  }
/>
        {/* ================= AUTH ================= */}

        <Route
          path="/login"
          element={
            <Login
              dark={dark}
              setDark={setDark}
            />
          }
        />

        <Route
          path="/Register"
          element={
            <Register
              dark={dark}
              setDark={setDark}
            />
          }
        />

        <Route
          path="/ForgotPassword"
          element={
            <ForgotPassword
              dark={dark}
              setDark={setDark}
            />
          }
        />

        <Route
          path="/VerifyEmail"
          element={
            <VerifyEmail
              dark={dark}
              setDark={setDark}
            />
          }
        />

        <Route
          path="/ResetPassword"
          element={
            <ResetPassword
              dark={dark}
              setDark={setDark}
            />
          }
        />

        {/* ================= WORKSPACE ================= */}

        <Route
          path="/Work"
          element={
            <Work
              dark={dark}
              setDark={setDark}
            />
          }
        />

        <Route
          path="/Resources"
          element={
            <Resources
              dark={dark}
              setDark={setDark}
            />
          }
        />

        <Route
          path="/new-blueprint"
          element={
            <NewBlueprint
              dark={dark}
              setDark={setDark}
            />
          }
        />

        <Route
          path="/newblueprint2"
          element={
            <NewBlueprint2
              dark={dark}
              setDark={setDark}
            />
          }
        />

        <Route
          path="/DualWorkspace"
          element={<DualWorkspace />}
        />

{/* ================= ADMIN ================= */}

<Route
  path="/Overview"
  element={
    <Overview
      dark={dark}
      setDark={setDark}
    />
  }
/>

<Route
  path="/Users"
  element={
    <Users
      dark={dark}
      setDark={setDark}
    />
  }
/>

<Route
  path="/BlueprintsAdmen"
  element={
    <BlueprintsAdmen
      dark={dark}
      setDark={setDark}
    />
  }
/>

<Route
  path="/Logs"
  element={
    <Logs
      dark={dark}
      setDark={setDark}
    />
  }
/>

<Route
  path="/SystemState"
  element={
    <SystemState
      dark={dark}
      setDark={setDark}
    />
  }
/>

<Route
  path="/Settings"
  element={
    <Settings
      dark={dark}
      setDark={setDark}
    />
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

