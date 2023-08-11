import { fromSSO } from "@aws-sdk/credential-providers";

export default (profile: string) => {
  return fromSSO({ profile });
};
