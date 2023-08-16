import { AmplifyUser } from "@aws-amplify/ui";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import SignOutButton from "./features/authAuth/SignOutButton";
import SelectedLanguage from "./features/selectedLanguage/SelectedLanguage";
import TypesafeTranslationT from "./TypesafeTranslationT";

function maybeAdminSuperNavLink(user: AmplifyUser) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const groups = user.getSignInUserSession()?.getIdToken().payload[
    "cognito:groups"
  ];
  console.log(`Groups: ${JSON.stringify(groups)}`);
  if (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    groups?.includes("adminSuper")
  ) {
    console.log("returning adminSuper pane");
    return (
      <NavLink
        to="/admin_super"
        className="button rounded"
        data-test-id="signUpTab"
      >
        SignUp
      </NavLink>
    );
  } else {
    console.log("returning no pane");
    return null;
  }
}
export function SessionfulRouterHeader() {
  const t = useTranslation().t as TypesafeTranslationT;
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <header className="sticky">
      <NavLink to="/table_tablets" className="button rounded">
        {t("tableTablets")}
      </NavLink>
      <NavLink to="/projects" className="button rounded">
        {t("projects")}
      </NavLink>
      <NavLink to="/helloworld" className="button rounded">
        Hello World Hands-On-React Examples
      </NavLink>
      <NavLink to="/counter" className="button rounded">
        Redux repo example counter-ts
      </NavLink>
      {maybeAdminSuperNavLink(user)}
      <SelectedLanguage />
      <SignOutButton />
    </header>
  );
}
