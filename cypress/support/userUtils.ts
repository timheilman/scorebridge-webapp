import { TempEmailAccount } from "../tasks/createTempEmailAccount";
import { envTask } from "./envTask";

export function expectBackendDetails(
  user: { userId: string; clubId: string },
  tempAcct: TempEmailAccount,
  expectedClubName: string,
) {
  if (!user) {
    throw new Error(`No user found for email ${tempAcct.user}`);
  }
  expectCognitoDetails(user);
  expectDdbDetails(user, tempAcct, expectedClubName);
}

function expectCognitoDetails(user: { userId: string; clubId: string }) {
  envTask<string[]>("fetchGroupsForUser", {
    userId: user.userId,
  }).then((groupNames) => {
    expect(groupNames).to.contain("adminClub");
  });
}

export function expectDdbDetails(
  user: {
    userId: string;
    clubId: string;
  },
  tempAcct: TempEmailAccount,
  expectedClubName: string,
) {
  envTask("expectDdbUserDetails", {
    userId: user.userId,
    expectedUserDetails: {
      email: tempAcct.user,
    },
  });
  envTask("expectClubDetails", {
    clubId: user.clubId,
    expectedClubDetails: { name: expectedClubName },
  });
}
