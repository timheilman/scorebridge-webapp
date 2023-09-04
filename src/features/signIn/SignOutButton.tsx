import { useAuthenticator } from "@aws-amplify/ui-react";
import { useTranslation } from "react-i18next";

import TypesafeTranslationT from "../../scorebridge-ts-submodule/TypesafeTranslationT";

export default function SignOutButton() {
  const { signOut, authStatus } = useAuthenticator((context) => [
    context.authStatus,
    context.signOut,
  ]);
  const t = useTranslation().t as TypesafeTranslationT;

  const handleClick = () => {
    signOut();
  };

  if (authStatus === "authenticated") {
    return (
      <>
        <button onClick={handleClick}>{t("tabs.signOut")}</button>
      </>
    );
  }
  return null;
}
