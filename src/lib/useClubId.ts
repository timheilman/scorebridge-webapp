import { useAuthenticator } from "@aws-amplify/ui-react";

export const useClubId = () => {
  const { user } = useAuthenticator();
  if (!user || !user.attributes || !user.attributes["custom:tenantId"]) {
    return;
  }
  return user.attributes["custom:tenantId"];
};
