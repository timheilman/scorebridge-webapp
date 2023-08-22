import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate, Route, Routes } from "react-router-dom";

import SuperChickenMode from ".././superChickenMode/SuperChickenMode";
import ClubDevicesPage from "../clubDevices/ClubDevicesPage";
import PlayersPage from "../players/PlayersPage";
import RotationPage from "../rotation/RotationPage";
import ScoreBridgeAuthenticator from "../signIn/ScoreBridgeAuthenticator";
import ForgetMeForm from "../signUp/ForgetMeForm";
import SignUpForm from "../signUp/SignUpForm";
import UnexpectedError from "../unexpectedError/UnexpectedError";

export default function ScoreBridgeRoutes() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          authStatus === "authenticated" ? (
            <Navigate to="/club_devices" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route path="/signin" element={<ScoreBridgeAuthenticator />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/forget_me" element={<ForgetMeForm />} />
      {/*<Route path="/projects/:id" element={<ProjectPage />} />*/}
      <Route path="/club_devices" element={<ClubDevicesPage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/rotation" element={<RotationPage />} />
      <Route path="/unexpected_error" element={<UnexpectedError />} />
      <Route path="/super_chicken_mode" element={<SuperChickenMode />} />
    </Routes>
  );
}
