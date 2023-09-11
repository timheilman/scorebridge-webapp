export function regTokenPublicPart(regToken: string) {
  if (regToken.length < 16) {
    throw new Error("reg tokens should be 16 chars for now");
  }
  return regToken.slice(0, 8);
}

export function regTokenSecretPart(regToken: string) {
  if (regToken.length < 16) {
    throw new Error("reg tokens should be 16 chars for now");
  }
  return regToken.slice(8);
}

export function regTokenToEmail(regToken: string, stage: string) {
  return `scorebridge8+${stage}-clubDevice-${regTokenPublicPart(
    regToken,
  )}@gmail.com`;
}
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function randomRegToken() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    .map(() => {
      return characters.charAt(Math.floor(Math.random() * characters.length));
    })
    .join("");
}
