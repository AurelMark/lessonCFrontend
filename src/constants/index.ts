export const DEFAULT_LANG = 'ro';
export const LANG_TYPE = ['ro', 'ru', 'en'];
export const BASE_URL = "https://phonetics.md";
export const SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5566";

export const DURATION_UNIT = {
    "durationUnit": {
        "en": {
            "minute": "Minute",
            "hour": "Hour",
            "day": "Day"
        },
        "ru": {
            "minute": "Минута",
            "hour": "Час",
            "day": "День"
        },
        "ro": {
            "minute": "Minută",
            "hour": "Oră",
            "day": "Zi"
        }
    }
}

export const LEVEL_SKILLS = {
    "level": {
        "en": {
            "beginner": "Beginner",
            "elementary": "Elementary",
            "pre_intermediate": "Pre-intermediate",
            "intermediate": "Intermediate",
            "upper_intermediate": "Upper-intermediate",
            "advanced": "Advanced",
            "proficient": "Proficient",
            "all_levels": "All levels"
        },
        "ru": {
            "beginner": "Начальный",
            "elementary": "Элементарный",
            "pre_intermediate": "Ниже среднего",
            "intermediate": "Средний",
            "upper_intermediate": "Выше среднего",
            "advanced": "Продвинутый",
            "proficient": "Профессиональный",
            "all_levels": "Все уровни"
        },
        "ro": {
            "beginner": "Începător",
            "elementary": "Elementar",
            "pre_intermediate": "Pre-intermediar",
            "intermediate": "Intermediar",
            "upper_intermediate": "Superior intermediar",
            "advanced": "Avansat",
            "proficient": "Proficient",
            "all_levels": "Toate nivelurile"
        }
    }
}

export const LANGUAGES_TYPE = {
    "language": {
        "en": {
            "en": "English",
            "ru": "Russian",
            "ro": "Romanian",
            "fr": "French",
            "de": "German",
            "it": "Italian",
            "es": "Spanish",
            "tr": "Turkish",
            "uk": "Ukrainian",
            "zh": "Chinese",
            "ja": "Japanese",
            "ar": "Arabic",
            "pt": "Portuguese",
            "pl": "Polish"
        },
        "ru": {
            "en": "Английский",
            "ru": "Русский",
            "ro": "Румынский",
            "fr": "Французский",
            "de": "Немецкий",
            "it": "Итальянский",
            "es": "Испанский",
            "tr": "Турецкий",
            "uk": "Украинский",
            "zh": "Китайский",
            "ja": "Японский",
            "ar": "Арабский",
            "pt": "Португальский",
            "pl": "Польский"
        },
        "ro": {
            "en": "Engleză",
            "ru": "Rusă",
            "ro": "Română",
            "fr": "Franceză",
            "de": "Germană",
            "it": "Italiană",
            "es": "Spaniolă",
            "tr": "Turcă",
            "uk": "Ucraineană",
            "zh": "Chineză",
            "ja": "Japoneză",
            "ar": "Arabă",
            "pt": "Portugheză",
            "pl": "Poloneză"
        }
    }
}

export const ALERT_TYPES = [
    { value: "info", label: "Info", color: "bg-gray-100 border-gray-300 text-gray-800" },
    { value: "success", label: "Success", color: "bg-green-100 border-green-400 text-green-800" },
    { value: "warning", label: "Warning", color: "bg-yellow-100 border-yellow-400 text-yellow-800" },
    { value: "destruction", label: "Destruction", color: "bg-red-100 border-red-400 text-red-800" },
    { value: "primary", label: "Primary", color: "bg-blue-100 border-blue-400 text-blue-800" },
    { value: "secondary", label: "Secondary", color: "bg-indigo-100 border-indigo-400 text-indigo-800" },
    { value: "accent", label: "Accent", color: "bg-purple-100 border-purple-400 text-purple-800" },
    { value: "pink", label: "Pink", color: "bg-pink-100 border-pink-400 text-pink-800" },
    { value: "orange", label: "Orange", color: "bg-orange-100 border-orange-400 text-orange-800" },
    { value: "lime", label: "Lime", color: "bg-lime-100 border-lime-400 text-lime-800" },
    { value: "emerald", label: "Emerald", color: "bg-emerald-100 border-emerald-400 text-emerald-800" },
    { value: "teal", label: "Teal", color: "bg-teal-100 border-teal-400 text-teal-800" },
    { value: "cyan", label: "Cyan", color: "bg-cyan-100 border-cyan-400 text-cyan-800" },
    { value: "sky", label: "Sky", color: "bg-sky-100 border-sky-400 text-sky-800" },
    { value: "amber", label: "Amber", color: "bg-amber-100 border-amber-400 text-amber-800" },
    { value: "violet", label: "Violet", color: "bg-violet-100 border-violet-400 text-violet-800" },
    { value: "fuchsia", label: "Fuchsia", color: "bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800" },
    { value: "rose", label: "Rose", color: "bg-rose-100 border-rose-400 text-rose-800" },
    { value: "neutral", label: "Neutral", color: "bg-neutral-100 border-neutral-400 text-neutral-800" }
];

export const ROLES = ['user', 'client', 'teacher', 'journalist', 'assistant', 'admin']

export const TIME = "dd.MM.yyyy HH:mm"