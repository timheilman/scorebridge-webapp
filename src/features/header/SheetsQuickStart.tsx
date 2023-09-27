import { useState } from "react";

import { logFn } from "../../lib/logging";
const log = logFn("src.features.header.SheetsQuickStart");
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/ban-ts-comment */
export default function SheetsQuickStart() {
  // // TODO(developer): Set to client ID and API key from the Developer Console
  // const CLIENT_ID =
  //   "197224543742-1fu9arngc27f3mm84k72vl0acqr46o7o.apps.googleusercontent.com";
  // const API_KEY = "";

  // const [gapiInited, setGapiInited] = useState(false);
  // const [gisInited, setGisInited] = useState(false);
  const [contentError, setContentError] = useState("");
  const [content, setContent] = useState("");
  const [tokenClientCallbackReceived, setTokenClientCallbackReceived] =
    useState(false);
  // // Discovery doc URL for APIs used by the quickstart
  // const DISCOVERY_DOC =
  //   "https://sheets.googleapis.com/$discovery/rest?version=v4";

  // // Authorization scopes required by the API; multiple scopes can be
  // // included, separated by spaces.
  // const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

  let tokenClient: any;

  // /**
  //  * Callback after api.js is loaded.
  //  */
  // function gapiLoaded() {
  //   log("gapiLoaded", "debug");
  //   // @ts-ignore
  //   gapi.load("client", initializeGapiClient);
  // }

  // /**
  //  * Callback after the API client is loaded. Loads the
  //  * discovery doc to initialize the API.
  //  */
  // async function initializeGapiClient() {
  //   // @ts-ignore
  //   await gapi.client.init({
  //     apiKey: API_KEY,
  //     discoveryDocs: [DISCOVERY_DOC],
  //   });
  //   setGapiInited(true);
  // }

  // /**
  //  * Callback after Google Identity Services are loaded.
  //  */
  // function gisLoaded() {
  //   // @ts-ignore
  //   tokenClient = google.accounts.oauth2.initTokenClient({
  //     client_id: CLIENT_ID,
  //     scope: SCOPES,
  //     callback: "", // defined later
  //   });
  //   setGisInited(true);
  // }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick() {
    log("handleAuthClick.begin", "debug");
    tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      setTokenClientCallbackReceived(true);
      await listMajors();
    };

    // @ts-ignore
    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick() {
    // @ts-ignore
    const token = gapi.client.getToken();
    if (token !== null) {
      // @ts-ignore
      google.accounts.oauth2.revoke(token.access_token);
      // @ts-ignore
      gapi.client.setToken("");
      setTokenClientCallbackReceived(false);
      setContent("");
    }
  }

  /**
   * Print the names and majors of students in a sample spreadsheet:
   * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  async function listMajors() {
    let response;
    try {
      // @ts-ignore
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        range: "Class Data!A2:E",
      });
    } catch (err: any) {
      setContentError(err.message);
      return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
      setContent("No values found.");
      return;
    }
    // Flatten to string to display
    const output = range.values.reduce(
      (str: any, row: any) => `${str}${row[0]}, ${row[4]}\n`,
      "Name, Major:\n",
    );
    setContent(output);
  }
  return (
    <>
      <div>
        <p>Sheets API Quickstart</p>
        <button
          id="authorize_button"
          onClick={handleAuthClick}
          // style={
          //   !(gapiInited && gisInited)
          //     ? { visibility: "hidden" }
          //     : { visibility: "visible" }
          // }
        >
          {tokenClientCallbackReceived ? "Refresh" : "Authorize"}
        </button>
        <button
          id="signout_button"
          onClick={handleSignoutClick}
          style={
            !tokenClientCallbackReceived
              ? { visibility: "hidden" }
              : { visibility: "visible" }
          }
        >
          Sign Out
        </button>
        <pre id="content">{content}</pre>
        {contentError ? (
          <p>
            Error: <pre id="contentError">{contentError}</pre>
          </p>
        ) : (
          ""
        )}
      </div>
      {/*<script*/}
      {/*  async*/}
      {/*  defer*/}
      {/*  src="https://apis.google.com/js/api.js"*/}
      {/*  onLoad={gapiLoaded}*/}
      {/*></script>*/}
      {/*<script*/}
      {/*  async*/}
      {/*  defer*/}
      {/*  src="https://accounts.google.com/gsi/client"*/}
      {/*  onLoad={gisLoaded}*/}
      {/*></script>*/}
    </>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/ban-ts-comment */
