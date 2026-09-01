// src/hooks/useLanguageDirection.ts

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useLanguageDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language;

    const isRtl = lang.startsWith("fa");

    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [i18n.language]);
}
