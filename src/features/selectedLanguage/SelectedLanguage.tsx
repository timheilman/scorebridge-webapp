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
      i18n.changeLanguage(selectedLanguage).then(
        () => console.log(`change good to ${selectedLanguage}`),
        (r) => console.error(`change bad to ${selectedLanguage}`, r),
      );
    } else {
      console.log(`falsy selectedLanguage`);
    }
  }, [selectedLanguage, i18n]);
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    dispatch(setLanguage(newValue));
  };

  return (
    <select value={selectedLanguage} onChange={handleSelectChange}>
      <option value="">Select a language</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectedLanguage;
