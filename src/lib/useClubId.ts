import { useAuthenticator } from "@aws-amplify/ui-react";

export const useClubId = () => {
  const { user } = useAuthenticator();
  if (!user.attributes || !user.attributes["custom:tenantId"]) {
    throw new Error(
      "Security violation: no multitenancy token, tenantId, found in user attributes.",
    );
  }
  return user.attributes["custom:tenantId"];
};
