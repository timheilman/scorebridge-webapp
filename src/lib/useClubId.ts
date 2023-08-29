import { useAuthenticator } from "@aws-amplify/ui-react";

export const useClubId = () => {
  const { user } = useAuthenticator();
  if (!user.attributes || !user.attributes["custom:tenantId"]) {
    return null;
  }
  return user.attributes["custom:tenantId"];
};
