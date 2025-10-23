import { DURATION_UNIT } from "../constants";
import { LANG_TYPE } from "../types";

// Склонения для "минута", "час", "день"
const RU_ENDINGS = {
    minute: ["минута", "минуты", "минут"],
    hour: ["час", "часа", "часов"],
    day: ["день", "дня", "дней"],
};

type DurationUnitKey = "minute" | "hour" | "day";

function getRuLabel(value: string, unit: keyof typeof RU_ENDINGS): string {
    const n = Math.abs(Number(value));
    const endings = RU_ENDINGS[unit];
    if (!endings) return "";
    if (n % 10 === 1 && n % 100 !== 11) return endings[0];
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return endings[1];
    return endings[2];
}

// Склонения для "Minută", "Oră", "Zi"
const RO_ENDINGS = {
    minute: ["Minută", "Minute"],
    hour: ["Oră", "Ore"],
    day: ["Zi", "Zile"],
};

function getRoLabel(value: string, unit: keyof typeof RO_ENDINGS): string {
    const endings = RO_ENDINGS[unit];
    if (!endings) return "";
    return Number(value) === 1 ? endings[0] : endings[1];
}

export function getDurationLabel(value: string, unit: string, locale: string): string {
    if (locale === "en") {
        // Простое добавление s
        const label = DURATION_UNIT.durationUnit[locale][unit as DurationUnitKey];
        return Number(value) === 1 ? label : label + "s";
    }
    if (locale === "ru") {
        return getRuLabel(value, unit as keyof typeof RU_ENDINGS);
    }
    if (locale === "ro") {
        return getRoLabel(value, unit as keyof typeof RO_ENDINGS);
    }
    // fallback
    return DURATION_UNIT.durationUnit[locale as LANG_TYPE]?.[unit as DurationUnitKey] ?? "";
}

