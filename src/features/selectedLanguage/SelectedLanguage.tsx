import { ChangeEvent, FC } from "react";

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

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    dispatch(setLanguage(newValue));
  };

  return (
    <div>
      <select value={selectedLanguage} onChange={handleSelectChange}>
        <option value="">Select a language</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p>Selected language: {selectedLanguage}</p>
    </div>
  );
};

export default SelectedLanguage;
