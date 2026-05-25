import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
    document.documentElement.lang = value;
  };

  return (
    <Select value={i18n.language} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-[130px] text-xs bg-transparent border-0 hover:bg-slate-100 rounded-xl gap-1 px-2">
        <Globe size={14} className="text-slate-500 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="text-xs">
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
