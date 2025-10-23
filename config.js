// config.js
// --- Тек сен өзгертесің ---
// Жоба авторы (сен)
// ФАЙЛДЫ GitHub-та ЖАШАП, клиенттерге тек дайын сілтемені бересің.

window.toiConfig = {
  siteTitle: "Тойға шақырамыз",               // Браузерде шығатын атау
  names: "Айжан & Нұрсұлтан",                 // Той иелерінің аты
  dateReadable: "5 қараша, 2025 — 18:00",     // Көрнекі дата
  dateISO: "2025-11-05T18:00:00",             // ISO формат (қажет болса)
  music: "assets/toi-music.mp3",              // музыка файлы жолы
  musicAutoplay: true,                        // автоматты ойнату (браузер шектеуі мүмкін)
  whatsappNumber: "+77011234567",             // сенің WhatsApp нөмірің (теңше)
  whatsappMessageWhenComing: "Сәлем! Мен келемін — [Аты-жөнім]",      // келемін хабарламасы (қонақ өзі аты қосады)
  whatsappMessageWhenNotComing: "Сәлем! Өкінішке орай, келе алмаймын.", // келмейді хабарламасы
  mapIframeSrc: "https://2gis.kz/almaty/firm/70000001040617275?m=76.938284%2C43.238949%2F16",
  // Егер Google Apps Script немесе басқа webhook орнатсаң, осы endpoint-ке POST жіберіледі
  rsvpEndpoint: "", // мысалы: "https://script.google.com/macros/s/XXX/exec" (қоймасаң — POST болмайды)
  // Егер rsvpEndpoint бар болса, script.js автоматты түрде қонақтың аты мен статусын соған жібереді.
};
