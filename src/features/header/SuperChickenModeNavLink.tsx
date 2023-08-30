import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import TypesafeTranslationT from "../../TypesafeTranslationT";
import { selectSuperChickenMode } from "../superChickenMode/superChickenModeSlice";

export default function SuperChickenModeNavLink() {
  const t = useTranslation().t as TypesafeTranslationT;

  const superChickenMode = useAppSelector(selectSuperChickenMode);

  if (!superChickenMode) {
    return null;
  }
  return (
    <NavLink
      to="super_chicken_mode"
      className="button rounded"
      data-test-id="superChickenModeTab"
    >
      {t("tabs.superChickenMode")}
    </NavLink>
  );
}
