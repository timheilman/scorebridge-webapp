import requiredEnvVar from "./requiredEnvVar";

export default function requiredReactAppEnvVar(key: string): string {
  return requiredEnvVar(`REACT_APP_${key}`);
}
