import { ChangeEvent, FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLanguage, setLanguage } from "./selectedLanguageSlice";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
}

const SelectedLanguage: FC<SelectProps> = ({ options }) => {
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
    <select value={selectedLanguage} onChange={handleSelectChange}>
      {maybeAddSelectLanguage()}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectedLanguage;
