import selectedLanguageReducer, {
  SelectedLanguageState,
  setLanguage,
} from "./selectedLanguageSlice";

describe("selectedLanguage reducer", () => {
  const initialState: SelectedLanguageState = {
    value: "en",
  };
  it("should handle initial state", () => {
    expect(selectedLanguageReducer(undefined, { type: "unknown" })).toEqual({
      value: "en",
    });
  });

  it("should handle setLanguage", () => {
    const actual = selectedLanguageReducer(initialState, setLanguage("de"));
    expect(actual.value).toEqual("de");
  });
});
