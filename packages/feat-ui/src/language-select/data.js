const options = [
  {
    l_id: "0",
    language_name: "All Language",
    pid: "0",
    children: [
      {
        l_id: "6",
        unique_title: "af_ZA",
        language_name: "Afrikaans",
      },
      {
        l_id: "17",
        unique_title: "az_AZ",
        language_name: "Azərbaycan dili",
      },
      {
        l_id: "18",
        unique_title: "id_ID",
        language_name: "Bahasa Indonesia",
      },
      {
        l_id: "19",
        unique_title: "ms_MY",
        language_name: "Bahasa Melayu",
      },
      {
        l_id: "20",
        unique_title: "jv_ID",
        language_name: "Basa Jawa",
      },
      {
        l_id: "21",
        unique_title: "cx_PH",
        language_name: "Bisaya",
      },
      {
        l_id: "58",
        unique_title: "bs_BA",
        language_name: "Bosanski",
      },
      {
        l_id: "59",
        unique_title: "ca_ES",
        language_name: "Català",
      },
      {
        l_id: "49",
        unique_title: "cs_CZ",
        language_name: "Čeština",
      },
      {
        l_id: "60",
        unique_title: "cy_GB",
        language_name: "Cymraeg",
      },
      {
        l_id: "61",
        unique_title: "da_DK",
        language_name: "Dansk",
      },
      {
        l_id: "62",
        unique_title: "de_DE",
        language_name: "Deutsch",
      },
      {
        l_id: "63",
        unique_title: "et_EE",
        language_name: "Eesti",
      },
      {
        l_id: "64",
        unique_title: "en_GB",
        language_name: "English (UK)",
      },
      {
        l_id: "12",
        unique_title: "en_US",
        language_name: "English (US)",
      },
      {
        l_id: "13",
        unique_title: "es_LA",
        language_name: "Español",
      },
      {
        l_id: "65",
        unique_title: "es_ES",
        language_name: "Español (España)",
      },
      {
        l_id: "66",
        unique_title: "eu_ES",
        language_name: "Euskara",
      },
      {
        l_id: "22",
        unique_title: "tl_PH",
        language_name: "Filipino",
      },
      {
        l_id: "14",
        unique_title: "fr_CA",
        language_name: "Français (Canada)",
      },
      {
        l_id: "67",
        unique_title: "fr_FR",
        language_name: "Français (France)",
      },
      {
        l_id: "68",
        unique_title: "gl_ES",
        language_name: "Galego",
      },
      {
        l_id: "15",
        unique_title: "gn_PY",
        language_name: "Guarani",
      },
      {
        l_id: "69",
        unique_title: "hr_HR",
        language_name: "Hrvatski",
      },
      {
        l_id: "70",
        unique_title: "is_IS",
        language_name: "Íslenska",
      },
      {
        l_id: "71",
        unique_title: "it_IT",
        language_name: "Italiano",
      },
      {
        l_id: "7",
        unique_title: "sw_KE",
        language_name: "Kiswahili",
      },
      {
        l_id: "72",
        unique_title: "lv_LV",
        language_name: "Latviešu",
      },
      {
        l_id: "73",
        unique_title: "lt_LT",
        language_name: "Lietuvių",
      },
      {
        l_id: "50",
        unique_title: "hu_HU",
        language_name: "Magyar",
      },
      {
        l_id: "84",
        unique_title: "es_MX",
        language_name: "Mexico",
      },
      {
        l_id: "74",
        unique_title: "nl_NL",
        language_name: "Nederlands",
      },
      {
        l_id: "75",
        unique_title: "nb_NO",
        language_name: "Norsk (bokmål)",
      },
      {
        l_id: "76",
        unique_title: "nn_NO",
        language_name: "Norsk (nynorsk)",
      },
      {
        l_id: "23",
        unique_title: "uz_UZ",
        language_name: "O'zbek",
      },
      {
        l_id: "51",
        unique_title: "pl_PL",
        language_name: "Polski",
      },
      {
        l_id: "16",
        unique_title: "pt_BR",
        language_name: "Português (Brasil)",
      },
      {
        l_id: "77",
        unique_title: "pt_PT",
        language_name: "Português (Portugal)",
      },
      {
        l_id: "52",
        unique_title: "ro_RO",
        language_name: "Română",
      },
      {
        l_id: "78",
        unique_title: "sq_AL",
        language_name: "Shqip",
      },
      {
        l_id: "53",
        unique_title: "sk_SK",
        language_name: "Slovenčina",
      },
      {
        l_id: "54",
        unique_title: "sl_SI",
        language_name: "Slovenščina",
      },
      {
        l_id: "79",
        unique_title: "fi_FI",
        language_name: "Suomi",
      },
      {
        l_id: "80",
        unique_title: "sv_SE",
        language_name: "Svenska",
      },
      {
        l_id: "24",
        unique_title: "vi_VN",
        language_name: "Tiếng Việt",
      },
      {
        l_id: "8",
        unique_title: "tr_TR",
        language_name: "Türkçe",
      },
      {
        l_id: "81",
        unique_title: "el_GR",
        language_name: "Ελληνικά",
      },
      {
        l_id: "55",
        unique_title: "bg_BG",
        language_name: "Български",
      },
      {
        l_id: "82",
        unique_title: "mk_MK",
        language_name: "Македонски",
      },
      {
        l_id: "26",
        unique_title: "mn_MN",
        language_name: "Монгол",
      },
      {
        l_id: "56",
        unique_title: "ru_RU",
        language_name: "Русский",
      },
      {
        l_id: "83",
        unique_title: "sr_RS",
        language_name: "Српски",
      },
      {
        l_id: "27",
        unique_title: "tg_TJ",
        language_name: "Тоҷикӣ",
      },
      {
        l_id: "57",
        unique_title: "uk_UA",
        language_name: "Українська",
      },
      {
        l_id: "25",
        unique_title: "kk_KZ",
        language_name: "Қазақша",
      },
      {
        l_id: "29",
        unique_title: "hy_AM",
        language_name: "Հայերեն",
      },
      {
        l_id: "31",
        unique_title: "ne_NP",
        language_name: "नेपाली",
      },
      {
        l_id: "32",
        unique_title: "mr_IN",
        language_name: "मराठी",
      },
      {
        l_id: "33",
        unique_title: "hi_IN",
        language_name: "हिन्दी",
      },
      {
        l_id: "34",
        unique_title: "bn_IN",
        language_name: "বাংলা",
      },
      {
        l_id: "35",
        unique_title: "pa_IN",
        language_name: "ਪੰਜਾਬੀ",
      },
      {
        l_id: "36",
        unique_title: "gu_IN",
        language_name: "ગુજરાતી",
      },
      {
        l_id: "37",
        unique_title: "ta_IN",
        language_name: "தமிழ்",
      },
      {
        l_id: "38",
        unique_title: "te_IN",
        language_name: "తెలుగు",
      },
      {
        l_id: "39",
        unique_title: "kn_IN",
        language_name: "ಕನ್ನಡ",
      },
      {
        l_id: "40",
        unique_title: "ml_IN",
        language_name: "മലയാളം",
      },
      {
        l_id: "41",
        unique_title: "si_LK",
        language_name: "සිංහල",
      },
      {
        l_id: "42",
        unique_title: "th_TH",
        language_name: "ภาษาไทย",
      },
      {
        l_id: "28",
        unique_title: "ka_GE",
        language_name: "ქართული",
      },
      {
        l_id: "9",
        unique_title: "he_IL",
        language_name: "‏עברית‏",
      },
      {
        l_id: "30",
        unique_title: "ur_PK",
        language_name: "‏اردو‏",
      },
      {
        l_id: "10",
        unique_title: "ar_AR",
        language_name: "‏العربية‏",
      },
      {
        l_id: "11",
        unique_title: "fa_IR",
        language_name: "‏فارسی‏",
      },
      {
        l_id: "44",
        unique_title: "zh_TW",
        language_name: "中文(台灣)",
      },
      {
        l_id: "45",
        unique_title: "zh_CN",
        language_name: "中文(简体)",
      },
      {
        l_id: "46",
        unique_title: "zh_HK",
        language_name: "中文(香港)",
      },
      {
        l_id: "47",
        unique_title: "ja_JP",
        language_name: "日本語",
      },
      {
        l_id: "43",
        unique_title: "ko_KR",
        language_name: "한국어",
      },
    ],
  },
  {
    l_id: "1",
    unique_title: "ae",
    language_name: "Africa and Middle East",
    pid: "0",
    children: [
      {
        l_id: "6",
        unique_title: "af_ZA",
        language_name: "Afrikaans",
      },
      {
        l_id: "7",
        unique_title: "sw_KE",
        language_name: "Kiswahili",
      },
      {
        l_id: "8",
        unique_title: "tr_TR",
        language_name: "Türkçe",
      },
      {
        l_id: "9",
        unique_title: "he_IL",
        language_name: "‏עברית‏",
      },
      {
        l_id: "10",
        unique_title: "ar_AR",
        language_name: "‏العربية‏",
      },
      {
        l_id: "11",
        unique_title: "fa_IR",
        language_name: "‏فارسی‏",
      },
    ],
  },
  {
    l_id: "2",
    unique_title: "am",
    language_name: "Americas",
    pid: "0",
    children: [
      {
        l_id: "12",
        unique_title: "en_US",
        language_name: "English (US)",
      },
      {
        l_id: "13",
        unique_title: "es_LA",
        language_name: "Español",
      },
      {
        l_id: "14",
        unique_title: "fr_CA",
        language_name: "Français (Canada)",
      },
      {
        l_id: "15",
        unique_title: "gn_PY",
        language_name: "Guarani",
      },
      {
        l_id: "84",
        unique_title: "es_MX",
        language_name: "Mexico",
      },
      {
        l_id: "16",
        unique_title: "pt_BR",
        language_name: "Português (Brasil)",
      },
    ],
  },
  {
    l_id: "3",
    unique_title: "ap",
    language_name: "Asia-Pacific",
    pid: "0",
    children: [
      {
        l_id: "17",
        unique_title: "az_AZ",
        language_name: "Azərbaycan dili",
      },
      {
        l_id: "18",
        unique_title: "id_ID",
        language_name: "Bahasa Indonesia",
      },
      {
        l_id: "19",
        unique_title: "ms_MY",
        language_name: "Bahasa Melayu",
      },
      {
        l_id: "20",
        unique_title: "jv_ID",
        language_name: "Basa Jawa",
      },
      {
        l_id: "21",
        unique_title: "cx_PH",
        language_name: "Bisaya",
      },
      {
        l_id: "22",
        unique_title: "tl_PH",
        language_name: "Filipino",
      },
      {
        l_id: "23",
        unique_title: "uz_UZ",
        language_name: "O'zbek",
      },
      {
        l_id: "24",
        unique_title: "vi_VN",
        language_name: "Tiếng Việt",
      },
      {
        l_id: "26",
        unique_title: "mn_MN",
        language_name: "Монгол",
      },
      {
        l_id: "27",
        unique_title: "tg_TJ",
        language_name: "Тоҷикӣ",
      },
      {
        l_id: "25",
        unique_title: "kk_KZ",
        language_name: "Қазақша",
      },
      {
        l_id: "29",
        unique_title: "hy_AM",
        language_name: "Հայերեն",
      },
      {
        l_id: "31",
        unique_title: "ne_NP",
        language_name: "नेपाली",
      },
      {
        l_id: "32",
        unique_title: "mr_IN",
        language_name: "मराठी",
      },
      {
        l_id: "33",
        unique_title: "hi_IN",
        language_name: "हिन्दी",
      },
      {
        l_id: "34",
        unique_title: "bn_IN",
        language_name: "বাংলা",
      },
      {
        l_id: "35",
        unique_title: "pa_IN",
        language_name: "ਪੰਜਾਬੀ",
      },
      {
        l_id: "36",
        unique_title: "gu_IN",
        language_name: "ગુજરાતી",
      },
      {
        l_id: "37",
        unique_title: "ta_IN",
        language_name: "தமிழ்",
      },
      {
        l_id: "38",
        unique_title: "te_IN",
        language_name: "తెలుగు",
      },
      {
        l_id: "39",
        unique_title: "kn_IN",
        language_name: "ಕನ್ನಡ",
      },
      {
        l_id: "40",
        unique_title: "ml_IN",
        language_name: "മലയാളം",
      },
      {
        l_id: "41",
        unique_title: "si_LK",
        language_name: "සිංහල",
      },
      {
        l_id: "42",
        unique_title: "th_TH",
        language_name: "ภาษาไทย",
      },
      {
        l_id: "28",
        unique_title: "ka_GE",
        language_name: "ქართული",
      },
      {
        l_id: "30",
        unique_title: "ur_PK",
        language_name: "‏اردو‏",
      },
      {
        l_id: "44",
        unique_title: "zh_TW",
        language_name: "中文(台灣)",
      },
      {
        l_id: "45",
        unique_title: "zh_CN",
        language_name: "中文(简体)",
      },
      {
        l_id: "46",
        unique_title: "zh_HK",
        language_name: "中文(香港)",
      },
      {
        l_id: "47",
        unique_title: "ja_JP",
        language_name: "日本語",
      },
      {
        l_id: "43",
        unique_title: "ko_KR",
        language_name: "한국어",
      },
    ],
  },
  {
    l_id: "4",
    unique_title: "ee",
    language_name: "Eastern Europe",
    pid: "0",
    children: [
      {
        l_id: "17",
        unique_title: "az_AZ",
        language_name: "Azərbaycan dili",
      },
      {
        l_id: "49",
        unique_title: "cs_CZ",
        language_name: "Čeština",
      },
      {
        l_id: "50",
        unique_title: "hu_HU",
        language_name: "Magyar",
      },
      {
        l_id: "51",
        unique_title: "pl_PL",
        language_name: "Polski",
      },
      {
        l_id: "52",
        unique_title: "ro_RO",
        language_name: "Română",
      },
      {
        l_id: "53",
        unique_title: "sk_SK",
        language_name: "Slovenčina",
      },
      {
        l_id: "54",
        unique_title: "sl_SI",
        language_name: "Slovenščina",
      },
      {
        l_id: "55",
        unique_title: "bg_BG",
        language_name: "Български",
      },
      {
        l_id: "56",
        unique_title: "ru_RU",
        language_name: "Русский",
      },
      {
        l_id: "57",
        unique_title: "uk_UA",
        language_name: "Українська",
      },
      {
        l_id: "25",
        unique_title: "kk_KZ",
        language_name: "Қазақша",
      },
      {
        l_id: "29",
        unique_title: "hy_AM",
        language_name: "Հայերեն",
      },
      {
        l_id: "28",
        unique_title: "ka_GE",
        language_name: "ქართული",
      },
    ],
  },
  {
    l_id: "5",
    unique_title: "we",
    language_name: "Western Europe",
    pid: "0",
    children: [
      {
        l_id: "58",
        unique_title: "bs_BA",
        language_name: "Bosanski",
      },
      {
        l_id: "59",
        unique_title: "ca_ES",
        language_name: "Català",
      },
      {
        l_id: "60",
        unique_title: "cy_GB",
        language_name: "Cymraeg",
      },
      {
        l_id: "61",
        unique_title: "da_DK",
        language_name: "Dansk",
      },
      {
        l_id: "62",
        unique_title: "de_DE",
        language_name: "Deutsch",
      },
      {
        l_id: "63",
        unique_title: "et_EE",
        language_name: "Eesti",
      },
      {
        l_id: "64",
        unique_title: "en_GB",
        language_name: "English (UK)",
      },
      {
        l_id: "65",
        unique_title: "es_ES",
        language_name: "Español (España)",
      },
      {
        l_id: "66",
        unique_title: "eu_ES",
        language_name: "Euskara",
      },
      {
        l_id: "67",
        unique_title: "fr_FR",
        language_name: "Français (France)",
      },
      {
        l_id: "68",
        unique_title: "gl_ES",
        language_name: "Galego",
      },
      {
        l_id: "69",
        unique_title: "hr_HR",
        language_name: "Hrvatski",
      },
      {
        l_id: "70",
        unique_title: "is_IS",
        language_name: "Íslenska",
      },
      {
        l_id: "71",
        unique_title: "it_IT",
        language_name: "Italiano",
      },
      {
        l_id: "72",
        unique_title: "lv_LV",
        language_name: "Latviešu",
      },
      {
        l_id: "73",
        unique_title: "lt_LT",
        language_name: "Lietuvių",
      },
      {
        l_id: "74",
        unique_title: "nl_NL",
        language_name: "Nederlands",
      },
      {
        l_id: "75",
        unique_title: "nb_NO",
        language_name: "Norsk (bokmål)",
      },
      {
        l_id: "76",
        unique_title: "nn_NO",
        language_name: "Norsk (nynorsk)",
      },
      {
        l_id: "77",
        unique_title: "pt_PT",
        language_name: "Português (Portugal)",
      },
      {
        l_id: "78",
        unique_title: "sq_AL",
        language_name: "Shqip",
      },
      {
        l_id: "79",
        unique_title: "fi_FI",
        language_name: "Suomi",
      },
      {
        l_id: "80",
        unique_title: "sv_SE",
        language_name: "Svenska",
      },
      {
        l_id: "81",
        unique_title: "el_GR",
        language_name: "Ελληνικά",
      },
      {
        l_id: "82",
        unique_title: "mk_MK",
        language_name: "Македонски",
      },
      {
        l_id: "83",
        unique_title: "sr_RS",
        language_name: "Српски",
      },
    ],
  },
];

export default options;
