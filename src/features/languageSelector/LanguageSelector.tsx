import { SelectProps } from "@aws-amplify/ui-react/dist/types/primitives/types/select";
import { getLangCodeList, getLangNameFromCode } from "language-name-map";
import { ChangeEvent, FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logFn } from "../../lib/logging";
import { errorSwallowingLogCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import {
  selectLanguage,
  setLanguage,
  setLanguageResolved,
} from "./selectedLanguageSlice";

const log = logFn("src.features.languageSelector.");

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
      label: `${
        getLangNameFromCode(amplifyUiReactXlationLangCode)?.native ??
        "langNameNotFound"
      }`,
    };
  })
  .sort((vl1, vl2) =>
    vl1.label < vl2.label ? -1 : vl1.label === vl2.label ? 0 : 1,
  );

const lcd = errorSwallowingLogCompletionDecoratorFactory(log);
const LanguageSelector: FC<SelectProps> = () => {
  const selectedLanguage = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  useEffect(() => {
    if (selectedLanguage) {
      void lcd(
        i18n.changeLanguage(selectedLanguage),
        "i18n.selectedLanguage.changeLanguage",
      ).then(() => {
        log("i18n.resolvedLanguage.setLanguageResolved", "debug");
        dispatch(setLanguageResolved(true));
      });
    } else if (i18n.resolvedLanguage) {
      log("i18n.resolvedLanguage.dispatchSetLanguage", "debug", {
        i18nResolvedLanguage: i18n.resolvedLanguage,
      });
      dispatch(setLanguage(i18n.resolvedLanguage));
    } else {
      log("i18n.resolvedLanguage.leavingUnset", "debug");
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
