import { SelectProps } from "@aws-amplify/ui-react/dist/types/primitives/types/select";
import { getLangCodeList, getLangNameFromCode } from "language-name-map";
import { ChangeEvent, FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logFn } from "../../lib/logging";
import { selectLanguage, setLanguage } from "./selectedLanguageSlice";

const log = logFn("src.features.languageSelector");

interface Option {
  value: string;
  label: string;
}

const langCodeList = getLangCodeList();
const options: Option[] = ["en", "fr", "zh", "he"]
  .filter((langCode) => langCodeList.includes(langCode)) // should be all true; just for safety
  .map((amplifyUiReactXlationLangCode) => {
    return {
      value: amplifyUiReactXlationLangCode,
      // type safety of this cast is ostensibly guaranteed by the filter and the library

      label: `${
        getLangNameFromCode(amplifyUiReactXlationLangCode)?.native as string
      }`,
    };
  })
  .sort((vl1, vl2) =>
    vl1.label < vl2.label ? -1 : vl1.label === vl2.label ? 0 : 1,
  );

const LanguageSelector: FC<SelectProps> = () => {
  const selectedLanguage = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  useEffect(() => {
    if (selectedLanguage) {
      log("useEffect.selectedLanguage.true", "debug", { selectedLanguage });
      i18n.changeLanguage(selectedLanguage).then(
        () =>
          log(
            "useEffect.selectedLanguage.true.i18n.changeLanguage.success",
            "debug",
            { selectedLanguage },
          ),
        (r) =>
          log(
            "useEffect.selectedLanguage.true.i18n.changeLanguage.error",
            "error",
            r,
          ),
      );
      log("useEffect.selectedLanguage.true.i18n.changeLanguage.start", "debug");
    } else if (i18n.resolvedLanguage) {
      log(
        "useEffect.resolvedLanguage.true.dispatchSetLanguage.start",
        "debug",
        { i18nResolvedLanguage: i18n.resolvedLanguage },
      );
      dispatch(setLanguage(i18n.resolvedLanguage));
      log(
        "useEffect.resolvedLanguage.true.dispatchSetLanguage.waiting",
        "debug",
      );
    } else {
      log("useEffect.resolvedLanguage.false.leavingUnset", "debug");
    }
  }, [selectedLanguage, i18n, dispatch]);
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    dispatch(setLanguage(newValue));
  };

  const maybeAddSelectLanguage = () => {
    if (!selectedLanguage) {
      return <option value="">Select a language</option>;
    }
  };
  return (
    <select
      value={selectedLanguage}
      onChange={handleSelectChange}
      data-test-id="languageSelectorDropdown"
    >
      {maybeAddSelectLanguage()}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
