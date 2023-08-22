import selectedLanguageReducer, {
  SelectedLanguageState,
  setLanguage,
} from "./selectedLanguageSlice";

describe("languageSelector reducer", () => {
  const initialState: SelectedLanguageState = {
    value: "en",
  };
  it("should handle initial state", () => {
    expect(selectedLanguageReducer(undefined, { type: "unknown" })).to.equal({
      value: "en",
    });
  });

  it("should handle setLanguage", () => {
    const actual = selectedLanguageReducer(initialState, setLanguage("de"));
    expect(actual.value).to.equal("de");
  });
});
