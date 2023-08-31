import selectedLanguageReducer, {
  SelectedLanguageState,
  setLanguage,
} from "./selectedLanguageSlice";

describe("languageSelector reducer", () => {
  const initialState: SelectedLanguageState = {
    value: "en",
  };
  it("should handle initial state", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    expect(selectedLanguageReducer(undefined, { type: "unknown" })).to.equal({
      value: "en",
    });
  });

  it("should handle setLanguage", () => {
    const actual = selectedLanguageReducer(initialState, setLanguage("de"));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    expect(actual.value).to.equal("de");
  });
});
