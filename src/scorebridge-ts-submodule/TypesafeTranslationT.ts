// complicated types situation with react-i18next makes eslint confused about t
// use this to resolve eslint concern w/translation function "t":
// const t = useTranslation("translation").t as TypesafeTranslationT;
type TypesafeTranslationT = (s: string) => string;
export default TypesafeTranslationT;
