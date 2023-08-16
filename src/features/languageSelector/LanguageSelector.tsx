import { SelectProps } from "@aws-amplify/ui-react/dist/types/primitives/types/select";
import { getLangCodeList, getLangNameFromCode } from "language-name-map";
import { ChangeEvent, FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLanguage, setLanguage } from "./selectedLanguageSlice";

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
      label: getLangNameFromCode(amplifyUiReactXlationLangCode)
        ?.native as string,
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
      console.log(
        `truthy selectedLanguage so setting i18n to it ${selectedLanguage}; redux caused this event`,
      );
      i18n.changeLanguage(selectedLanguage).then(
        () => console.log(`change good to ${selectedLanguage}`),
        (r) => console.error(`change bad to ${selectedLanguage}`, r),
      );
      console.log(`i18n setting dispatched...`);
    } else if (i18n.resolvedLanguage) {
      console.log(
        `falsy selectedLanguage, truthy i18next-resolved language so setting redux to resolved ${i18n.resolvedLanguage}`,
      );
      dispatch(setLanguage(i18n.resolvedLanguage));
      console.log(
        `redux setting dispatched, should rerun this useEffect w/truthy selectedLanguage...`,
      );
    } else {
      console.log(
        `falsy selectedLanguage, falsy resolved language; simply leaving unset`,
      );
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
    return "";
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
