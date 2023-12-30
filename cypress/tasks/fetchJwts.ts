import { Amplify } from "aws-amplify";
import { fetchAuthSession, signIn } from "aws-amplify/auth";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.VITE_COGNITO_USER_POOL_CLIENT_ID_WEB,
      // worrisome: in v5 we had to specify region here; in v6 there is no way to...
    },
  },
});

export const fetchJwts = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const signInResult = await signIn({
    username,
    password,
    options: { authFlowType: "USER_PASSWORD_AUTH" },
  });
  const authSession = await fetchAuthSession();
  // looks like v6, via inspection of browser, looks like this:
  // CognitoIdentityServiceProvider.etv2dlgtm1g11sq20iok9rg9u.dba06503-f488-4317-9f74-8ba5c0d7197c.idToken	eyJraWQiOiI5ZTkrOEdpU0dCYlFLa1BRbEVJYWFRNlZmU1wvY1RtQ2MwR2FcL296UFg1cDA9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJkYmEwNjUwMy1mNDg4LTQzMTctOWY3NC04YmE1YzBkNzE5N2MiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbkNsdWIiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX2FDeDJqdmdaUCIsImNvZ25pdG86dXNlcm5hbWUiOiJkYmEwNjUwMy1mNDg4LTQzMTctOWY3NC04YmE1YzBkNzE5N2MiLCJvcmlnaW5fanRpIjoiYTg2YjExNjYtMjcyYi00MWU5LWI0NmEtNDVjYjQ5ZWIxZWJkIiwiY3VzdG9tOnRlbmFudElkIjoiMDFIOFo0WTVHRjVEQURXU0M0NDlQWUZXQzIiLCJhdWQiOiJldHYyZGxndG0xZzExc3EyMGlvazlyZzl1IiwiZXZlbnRfaWQiOiJlMjFmZGNlZi02N2RkLTRkYmMtYTFmYi0yZGYwYjRkZTcxYTQiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcwMzc5ODIyMSwiZXhwIjoxNzAzOTc4ODk3LCJpYXQiOjE3MDM5NzUyOTcsImp0aSI6IjYwNGU3YWFiLTBiODYtNGRhZC04MThjLTZmMmY2YmM1OWRiMyIsImVtYWlsIjoidGRoK3Njb3JlYnJpZGdlLWRldi1tYW51YWwtc2lnbnVwLWZvcm0tdGVzdC0wM0BzdGFuZm9yZGFsdW1uaS5vcmcifQ.ugrQILkxfKgMg8H7RKsPbKzkLXC5mT2mNC0ZBP-gtEpcM91M2zIOoxcHW-L-r-gKiPODTfY-ecJyD4l6_biSf5auh…
  // CognitoIdentityServiceProvider.etv2dlgtm1g11sq20iok9rg9u.dba06503-f488-4317-9f74-8ba5c0d7197c.clockDrift	-629
  // CognitoIdentityServiceProvider.etv2dlgtm1g11sq20iok9rg9u.dba06503-f488-4317-9f74-8ba5c0d7197c.accessToken	eyJraWQiOiJ2a1RIY2NrdlhLUWtZbUZUWDY4UGVGU0ZcL3pJZ3VuNE1wOHFibVE1bkx2az0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkYmEwNjUwMy1mNDg4LTQzMTctOWY3NC04YmE1YzBkNzE5N2MiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbkNsdWIiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfYUN4Mmp2Z1pQIiwiY2xpZW50X2lkIjoiZXR2MmRsZ3RtMWcxMXNxMjBpb2s5cmc5dSIsIm9yaWdpbl9qdGkiOiJhODZiMTE2Ni0yNzJiLTQxZTktYjQ2YS00NWNiNDllYjFlYmQiLCJldmVudF9pZCI6ImUyMWZkY2VmLTY3ZGQtNGRiYy1hMWZiLTJkZjBiNGRlNzFhNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MDM3OTgyMjEsImV4cCI6MTcwMzk3ODg5NywiaWF0IjoxNzAzOTc1Mjk3LCJqdGkiOiIxMGYxMjdjMS1hMjEwLTRmNDUtYjEzNy01ZjI1NzM3NzMyYjEiLCJ1c2VybmFtZSI6ImRiYTA2NTAzLWY0ODgtNDMxNy05Zjc0LThiYTVjMGQ3MTk3YyJ9.pcpeIF0xBmUNGVym1zcbhhwn8oBSDRRTxQFwpC2RHzIqez0H1bZ8vw9g0Pm8VL5U3fNXuXWTMFGNl_7drM4WFa3nFrlFrPubISSsSVj3L36At7vXTNPqor8z5NvsTylPeP5mbOke3GmCjMSr_ciIL3DxwEeCmVdtbmB5C3QtOzpuDl0V8q05RM1hoQMS2mAOKFTozO3ZahGGGEL9naEXGq7MwEx1Hno4oiydB…
  // CognitoIdentityServiceProvider.etv2dlgtm1g11sq20iok9rg9u.dba06503-f488-4317-9f74-8ba5c0d7197c.refreshToken	eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.mG5a24d2tOO0SomNuMHVQy7PjXCG7rrzNx6vejTwmBhFzXEAwpGlRAmYrw2ynHSe6CWRrAhPnPTsB5s1NsWOVPEt2fEQAoohxrQoyJC2XhBNlEIgPW3bdcmhdP4MaYlUN0_qGhPccL4tgjV4LJMm1oxNDljn3CP2mAygs5HUgVyjAu2KoXmOAEzbEckNPmm5KI8R71U-8rLwr4nIZBI_Si8F9mGHjHQRB_feARM5n7eQ97UjLY2Po8WW4iGE7ZGwzLRedVrXcTsLJ7RqdHYj8t5YajGvofNe-RLkj0HqYNtka3_1B9Ul80aCqTOuTss8Ic2aO9Gw9KzcmFXNb5TZBw.mAn0rgF9xoqfOqiu.luTV-qm4c7a4qeI5KPBQUOm5WbrmnT10ZvCozUfTsQmmBZXHwHF4j17T-BcJfcTjxyKq7HulbPx4sSrvyvyWkBdkvPMFZYX3Sh9j4EAyWepqkksmxP_ziu0FJ_WaspCDG6ZFlKP7HpAlGIMJjX5SiHk4LTs_3IB7JemaYeDmIdnE3Ut6a2BmqiBEvhLwlqlNxrr-WCynFqjAcFK0z77ZlIhtRTNRGewfLkOKYNrbTPl9Foo-iIopBqmw3q9gJP4Hx_x6daxRHlwXw2dilUEPHbPFsV-UZZSsLd3v2futkpI_0tBm5O-LB6B0LEadzDbIeUvoQYqOPVR4ESlB0kHD3haK2p5TBSv6TqZl8l42EqwYoPUfK3KvFmrdrH5mnY1Yt-P_TL22-ZomXGe39x2LuZmSXI2hZ8snNB3nV1ISE9Spb32np9zfMcRwD3Om8Q8sFXPrYVCVRktwca6Wx60O9EYSKauwK73HjalDdCVOuFINmSplsbpI_cbsndmdWXYpo9zbpcpTf376zYzWkUlsfviCO-G4SaMkn1jhJSWQudlEAeVcFJxNVRdKI_iaF-_z…
  // CognitoIdentityServiceProvider.etv2dlgtm1g11sq20iok9rg9u.LastAuthUser	dba06503-f488-4317-9f74-8ba5c0d7197c
  // that's very similar, but fetchAuthSession is only going to give us
  // the idToken and accessToken.  We can generate LastAuthUser no problem;
  // the main issue will be with clockDrift and refreshToken.  Maybe they won't
  // be necessary at all?

  // return authSession;

  const tokens = authSession.tokens!;
  const idToken = tokens.idToken!;
  const idTokenStr = idToken.toString();
  const accessToken = tokens.accessToken;
  const accessTokenStr = accessToken.toString();
  return {
    idToken: idTokenStr,
    accessToken: accessTokenStr,
    userSub: authSession.userSub,
  };
};
