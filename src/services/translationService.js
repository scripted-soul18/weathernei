// Multilingual Translation Engine for 10 Regional Indian Languages

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", native: "English", voiceCode: "en-IN" },
  { code: "hi", name: "Hindi", native: "हिन्दी", voiceCode: "hi-IN" },
  { code: "bn", name: "Bengali", native: "বাংলা", voiceCode: "bn-IN" },
  { code: "mr", name: "Marathi", native: "मराठी", voiceCode: "mr-IN" },
  { code: "ta", name: "Tamil", native: "தமிழ்", voiceCode: "ta-IN" },
  { code: "te", name: "Telugu", native: "తెలుగు", voiceCode: "te-IN" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", voiceCode: "gu-IN" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", voiceCode: "kn-IN" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", voiceCode: "ml-IN" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", voiceCode: "pa-IN" }
];

export const UI_TRANSLATIONS = {
  en: {
    appTitle: "WeatherGPT",
    moesTitle: "Ministry of Earth Sciences (MoES) - India Meteorological Department (IMD)",
    tagline: "Conversational AI for Weather Forecasting, Early Warnings & Climate Intelligence",
    searchPlaceholder: "Search any Indian city, district, village or port...",
    askAiPlaceholder: "Ask WeatherGPT anything (e.g., 'Will it rain in Delhi today?', 'Can I spray pesticides in Ludhiana?', 'Cyclone alerts')...",
    send: "Send",
    listening: "Listening to your voice...",
    voiceInput: "Voice Query",
    speakResponse: "Read Aloud",
    stopSpeaking: "Stop Audio",
    tabs: {
      overview: "Live Overview",
      chat: "WeatherGPT AI Chat",
      gisMap: "GIS Radar Map",
      agromet: "Kisan (Agromet)",
      alerts: "Disaster Warnings",
      marine: "Fisherfolk & Marine",
      aqi: "Air Quality (AQI)",
      bulletin: "Official IMD Bulletin"
    },
    personas: {
      citizen: "Citizen",
      kisan: "Farmer (Agromet)",
      disaster: "Disaster Manager",
      marine: "Fisherfolk",
      aviation: "Logistics & Aviation"
    },
    metrics: {
      feelsLike: "Feels Like",
      humidity: "Humidity",
      wind: "Wind Speed",
      pressure: "Pressure",
      gusts: "Wind Gusts",
      uvIndex: "UV Index",
      precipitation: "Precipitation",
      cloudCover: "Cloud Cover",
      dewPoint: "Dew Point"
    },
    prompts: [
      "Will it rain today in my city? Should I carry an umbrella?",
      "Is it suitable to spray pesticide on wheat crop tomorrow?",
      "Show all active IMD Red and Orange disaster warnings in India.",
      "What is the sea condition and wave height for coastal fishermen?",
      "Explain the Air Quality Index (AQI) and health precautions for today."
    ]
  },
  hi: {
    appTitle: "वेदर जीपीटी (WeatherGPT)",
    moesTitle: "पृथ्वी विज्ञान मंत्रालय (MoES) - भारत मौसम विज्ञान विभाग (IMD)",
    tagline: "मौसम पूर्वानुमान, आपदा चेतावनी और कृषि सलाह के लिए संवादात्मक एआई",
    searchPlaceholder: "किसी भी भारतीय शहर, ज़िले या गाँव का नाम खोजें...",
    askAiPlaceholder: "वेदर जीपीटी से पूछें (उदा. 'क्या आज बारिश होगी?', 'कीटनाशक छिड़कने का सही समय?', 'चक्रवात अलर्ट')...",
    send: "पूछें",
    listening: "आपकी आवाज़ सुन रहे हैं...",
    voiceInput: "बोलकर पूछें",
    speakResponse: "आवाज़ में सुनें",
    stopSpeaking: "आवाज़ रोकें",
    tabs: {
      overview: "लाइव मौसम",
      chat: "वेदर जीपीटी चैट",
      gisMap: "जीआईएस रडार नक्शा",
      agromet: "किसान सलाह (कृषि)",
      alerts: "आपदा चेतावनी",
      marine: "मछुआरों हेतु चेतावनी",
      aqi: "वायु गुणवत्ता (AQI)",
      bulletin: "आईएमडी बुलेटिन"
    },
    personas: {
      citizen: "नागरिक",
      kisan: "किसान (कृषि मौसम)",
      disaster: "आपदा प्रबंधन",
      marine: "मछुआरों हेतु",
      aviation: "विमानन व लॉजिस्टिक्स"
    },
    metrics: {
      feelsLike: "महसूस तापमान",
      humidity: "आर्द्रता (नमी)",
      wind: "हवा की गति",
      pressure: "वायुदाब",
      gusts: "हवा के झोंके",
      uvIndex: "यूवी सूचकांक",
      precipitation: "वर्षा",
      cloudCover: "बादल",
      dewPoint: "ओस बिंदु"
    },
    prompts: [
      "क्या आज मेरे शहर में बारिश होगी? क्या छाता ले जाना चाहिए?",
      "क्या कल गेहूं/धान की फसल पर कीटनाशक छिड़कना सुरक्षित है?",
      "भारत के सभी रेड और ऑरेंज अलर्ट वाले ज़िले दिखाएं।",
      "तटीय मछुआरों के लिए समुद्र की स्थिति और लहरों की ऊंचाई क्या है?",
      "आज का वायु गुणवत्ता सूचकांक (AQI) और स्वास्थ्य सावधानियां क्या हैं?"
    ]
  },
  bn: {
    appTitle: "ওয়েদার জিপিটি (WeatherGPT)",
    moesTitle: "ভূবিজ্ঞান মন্ত্রক (MoES) - ভারত আবহাওয়া অধিদপ্তর (IMD)",
    tagline: "আবহাওয়া পূর্বাভাস, দুর্যোগ সতর্কতা এবং কৃষি পরামর্শের জন্য কৃত্রিম বুদ্ধিমত্তা",
    searchPlaceholder: "যেকোনো শহর, জেলা বা গ্রামের নাম খুঁজুন...",
    askAiPlaceholder: "ওয়েদার জিপিটিকে আবহাওয়া নিয়ে যেকোনো প্রশ্ন করুন...",
    send: "জিজ্ঞাসা করুন",
    listening: "শুনছি...",
    voiceInput: "মুখে বলুন",
    speakResponse: "পড়ে শোনান",
    stopSpeaking: "থামুন",
    tabs: {
      overview: "লাইভ আবহাওয়া",
      chat: "ওয়েদার জিপিটি চ্যাট",
      gisMap: "রাডার ম্যাপ",
      agromet: "কৃষক পরামর্শ",
      alerts: "দুর্যোগ সতর্কতা",
      marine: "মৎস্যজীবী সতর্কতা",
      aqi: "বাতাসের মান (AQI)",
      bulletin: "আইএমডি বুলেটিন"
    },
    personas: {
      citizen: "নাগরিক",
      kisan: "কৃষক",
      disaster: "দুর্যোগ ব্যবস্থাপনা",
      marine: "মৎস্যজীবী",
      aviation: "বিমান চলাচল"
    },
    metrics: {
      feelsLike: "অনুভূত তাপমাত্রা",
      humidity: "আর্দ্রতা",
      wind: "বাতাসের গতি",
      pressure: "বায়ুচাপ",
      gusts: "ঝড়ো হাওয়া",
      uvIndex: "ইউভি সূচক",
      precipitation: "বৃষ্টিপাত",
      cloudCover: "মেঘের পরিমাণ",
      dewPoint: "শিশিরাঙ্ক"
    },
    prompts: [
      "আজ কি বৃষ্টি হবে? ছাতা কি সাথে নেব?",
      "কাল কি জমিতে কীটনাশক প্রয়োগ করা ঠিক হবে?",
      "উপকূলীয় এলাকায় ঘূর্ণিঝড় বা সতর্কবার্তা কী?",
      "আজকের বাতাসের মান কেমন?"
    ]
  },
  mr: {
    appTitle: "वेदर जीपीटी (WeatherGPT)",
    moesTitle: "पृथ्वी विज्ञान मंत्रालय (MoES) - भारतीय हवामान विभाग (IMD)",
    tagline: "हवामान अंदाज, आपत्ती चेतावणी आणि शेती सल्ल्यासाठी संवादात्मक एआय",
    searchPlaceholder: "कोणतेही शहर किंवा जिल्ह्याचे नाव शोधा...",
    askAiPlaceholder: "वेदर जीपीटीला हवामानाविषयी कोणताही प्रश्न विचारा...",
    send: "विचारा",
    listening: "ऐकत आहे...",
    voiceInput: "बोला",
    speakResponse: "ऐका",
    stopSpeaking: "थांबवा",
    tabs: {
      overview: "थेट हवामान",
      chat: "वेदर जीपीटी चॅट",
      gisMap: "जीआयएस रडार नकाशा",
      agromet: "शेतकरी सल्ला (कृषी)",
      alerts: "आपत्ती इशारे",
      marine: "मासेमारी इशारे",
      aqi: "हवेची गुणवत्ता (AQI)",
      bulletin: "हवामान बुलेटिन"
    },
    personas: {
      citizen: "नागरिक",
      kisan: "शेतकरी (कृषी)",
      disaster: "आपत्ती व्यवस्थापन",
      marine: "मच्छीमार",
      aviation: "विमान वाहतूक"
    },
    metrics: {
      feelsLike: "जाणवणारे तापमान",
      humidity: "दमटपणा",
      wind: "वाऱ्याचा वेग",
      pressure: "हवेचा दाब",
      gusts: "वाऱ्याचे झोके",
      uvIndex: "यूव्ही इंडेक्स",
      precipitation: "पाऊस",
      cloudCover: "ढगाळ वातावरण",
      dewPoint: "दव बिंदू"
    },
    prompts: [
      "आज पाऊस पडेल का? छत्री सोबत घ्यावी का?",
      "उद्या पिकांवर कीटकनाशक फवारणी करावी का?",
      "महाराष्ट्रातील रेड आणि ऑरेंज अलर्ट जिल्हे दाखवा.",
      "मासेमारीसाठी समुद्रात जाणे सुरक्षित आहे का?"
    ]
  },
  ta: {
    appTitle: "வெதர் ஜிபிடி (WeatherGPT)",
    moesTitle: "புவி அறிவியல் அமைச்சகம் (MoES) - இந்திய வானிலை ஆய்வு மையம் (IMD)",
    tagline: "வானிலை முன்னறிவிப்பு மற்றும் பேரிடர் எச்சரிக்கைக்கான செயற்கை நுண்ணறிவு",
    searchPlaceholder: "நகரம் அல்லது மாவட்ட பெயரைத் தேடுங்கள்...",
    askAiPlaceholder: "வானிலை பற்றி எதுவும் கேளுங்கள்...",
    send: "கேட்க",
    listening: "கேட்கிறது...",
    voiceInput: "குரல் வழி கேள்வி",
    speakResponse: "ஒலிக்க",
    stopSpeaking: "நிறுத்து",
    tabs: {
      overview: "நேரலை வானிலை",
      chat: "வெதர் ஜிபிடி சாட்",
      gisMap: "ரேடார் வரைபடம்",
      agromet: "விவசாயிகள் ஆலோசனை",
      alerts: "பேரிடர் எச்சரிக்கைகள்",
      marine: "மீனவர்கள் எச்சரிக்கை",
      aqi: "காற்றின் தரம் (AQI)",
      bulletin: "அறிக்கை"
    },
    personas: {
      citizen: "பொதுமக்கள்",
      kisan: "விவசாயி",
      disaster: "பேரிடர் மேலாண்மை",
      marine: "மீனவர்",
      aviation: "விமான போக்குவரத்து"
    },
    metrics: {
      feelsLike: "உணரும் வெப்பநிலை",
      humidity: "ஈரப்பதம்",
      wind: "காற்றின் வேகம்",
      pressure: "காற்றழுத்தம்",
      gusts: "சூறாவளி காற்று",
      uvIndex: "புற ஊதா குறியீடு",
      precipitation: "மழைப்பொழிவு",
      cloudCover: "மேக மூட்டம்",
      dewPoint: "பனி நிலை"
    },
    prompts: [
      "இன்று மழை பெய்யுமா? குடை தேவையா?",
      "நாளை பயிர்களுக்கு பூச்சிக்கொல்லி தெளிக்கலாமா?",
      "புயல் மற்றும் கடலோர எச்சரிக்கைகள் என்ன?",
      "இன்றைய காற்றின் தரம் எவ்வாறு உள்ளது?"
    ]
  },
  te: {
    appTitle: "వెదర్ జీపీటీ (WeatherGPT)",
    moesTitle: "భూ విజ్ఞాన మంత్రిత్వ శాఖ (MoES) - భారత వాతావరణ శాఖ (IMD)",
    tagline: "వాతావరణ అంచనాలు, విపత్తు హెచ్చరికలు మరియు రైతు సలహాల కోసం AI",
    searchPlaceholder: "ఏదైనా నగరం లేదా జిల్లా పేరును శోధించండి...",
    askAiPlaceholder: "వాతావరణం గురించి ఏదైనా అడగండి...",
    send: "అడగండి",
    listening: "వింటున్నాము...",
    voiceInput: "వాయిస్ ప్రశ్న",
    speakResponse: "వినండి",
    stopSpeaking: "ఆపు",
    tabs: {
      overview: "ప్రత్యక్ష వాతావరణం",
      chat: "వెదర్ జీపీటీ చాట్",
      gisMap: "రాడార్ మ్యాప్",
      agromet: "రైతు సలహా",
      alerts: "విపత్తు హెచ్చరికలు",
      marine: "మత్స్యకారుల హెచ్చరిక",
      aqi: "గాలి నాణ్యత (AQI)",
      bulletin: "బులిటెన్"
    },
    personas: {
      citizen: "పౌరుడు",
      kisan: "రైతు",
      disaster: "విపత్తు నిర్వహణ",
      marine: "మత్స్యకారుడు",
      aviation: "విమానయానం"
    },
    metrics: {
      feelsLike: "అనిపించే ఉష్ణోగ్రత",
      humidity: "తేమ",
      wind: "గాలి వేగం",
      pressure: "పీడనం",
      gusts: "ఈదురు గాలులు",
      uvIndex: "UV సూచిక",
      precipitation: "వర్షపాతం",
      cloudCover: "మేఘావృతం",
      dewPoint: "మంచు బిందువు"
    },
    prompts: [
      "ఈరోజు వర్షం పడుతుందా? గొడుగు తీసుకెళ్లాలా?",
      "రేపు పంటలకు పురుగుమందులు చల్లవచ్చా?",
      "తీరప్రాంత తుఫాను హెచ్చరికల వివరాలు ఏమిటి?",
      "నేటి గాలి నాణ్యత ఎలా ఉంది?"
    ]
  },
  gu: {
    appTitle: "વેધર જીપીટી (WeatherGPT)",
    moesTitle: "પૃથ્વી વિજ્ઞાન મંત્રાલય (MoES) - ભારત હવામાન વિભાગ (IMD)",
    tagline: "હવામાન આગાહી, આપત્તિ ચેતવણી અને ખેડૂત સલાહ માટે આર્ટિફિશિયલ ઇન્ટેલિજન્સ",
    searchPlaceholder: "કોઈપણ શહેર અથવા ગામનું નામ શોધો...",
    askAiPlaceholder: "વેધર જીપીટીને હવામાન સંબંધિત કોઈ પણ પ્રશ્ન પૂછો...",
    send: "પૂછો",
    listening: "સાંભળી રહ્યા છીએ...",
    voiceInput: "બોલીને પૂછો",
    speakResponse: "સાંભળો",
    stopSpeaking: "બંધ કરો",
    tabs: {
      overview: "લાઇવ હવામાન",
      chat: "વેધર જીપીટી ચેટ",
      gisMap: "રડાર નકશો",
      agromet: "ખેડૂત સલાહ",
      alerts: "આપત્તિ ચેતવણી",
      marine: "માછીમારો ચેતવણી",
      aqi: "હવાની ગુણવત્તા (AQI)",
      bulletin: "હવામાન બુલેટિન"
    },
    personas: {
      citizen: "નાગરિક",
      kisan: "ખેડૂત",
      disaster: "આપત્તિ વ્યવસ્થાપન",
      marine: "માછીમાર",
      aviation: "એવિએશન"
    },
    metrics: {
      feelsLike: "અનુભવાતું તાપમાન",
      humidity: "ભેજ",
      wind: "પવનની ગતિ",
      pressure: "હવાનું દબાણ",
      gusts: "ઝાંઝવાના પવન",
      uvIndex: "યુવી ઇન્ડેક્સ",
      precipitation: "વરસાદ",
      cloudCover: "વાદળછાયું વાતાવરણ",
      dewPoint: "ઝાકળ બિંદુ"
    },
    prompts: [
      "શું આજે વરસાદ પડશે? છત્રી રાખવી?",
      "શું કાલે પાક પર જંતુનાશક દવાનો છંટકાવ કરવો યોગ્ય છે?",
      "દરિયાકાંઠાના વિસ્તારો માટે વાવાઝોડાની શું સ્થિતિ છે?"
    ]
  },
  kn: {
    appTitle: "ವೆದರ್ ಜಿಪಿಟಿ (WeatherGPT)",
    moesTitle: "ಭೂ ವಿಜ್ಞಾನ ಸಚಿವಾಲಯ (MoES) - ಭಾರತೀಯ ಹವಾಮಾನ ಇಲಾಖೆ (IMD)",
    tagline: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ವಿಪತ್ತು ಎಚ್ಚರಿಕೆಗಾಗಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ",
    searchPlaceholder: "ಯಾವುದೇ ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಹುಡುಕಿ...",
    askAiPlaceholder: "ಹವಾಮಾನದ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ...",
    send: "ಕೇಳಿ",
    listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ...",
    voiceInput: "ಧ್ವನಿ ಪ್ರಶ್ನೆ",
    speakResponse: "ಆಲಿಸಿ",
    stopSpeaking: "ನಿಲ್ಲಿಸಿ",
    tabs: {
      overview: "ನೇರ ಹವಾಮಾನ",
      chat: "ವೆದರ್ ಜಿಪಿಟಿ ಚಾಟ್",
      gisMap: "ರಾಡಾರ್ ನಕ್ಷೆ",
      agromet: "ರೈತ ಸಲಹೆ",
      alerts: "ವಿಪತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
      marine: "ಮೀನುಗಾರರ ಎಚ್ಚರಿಕೆ",
      aqi: "ವಾಯು ಗುಣಮಟ್ಟ (AQI)",
      bulletin: "ಹವಾಮಾನ ಬುಲೆಟಿನ್"
    },
    personas: {
      citizen: "ನಾಗರಿಕ",
      kisan: "ರೈತ",
      disaster: "ವಿಪತ್ತು ನಿರ್ವಹಣೆ",
      marine: "ಮೀನುಗಾರ",
      aviation: "ವಾಯುಯಾನ"
    },
    metrics: {
      feelsLike: "ಅನುಭವವಾಗುವ ತಾಪಮಾನ",
      humidity: "ಆರ್ದ್ರತೆ",
      wind: "ಗಾಳಿಯ ವೇಗ",
      pressure: "ವಾಯುಭಾರ",
      gusts: "ಬಿರುಗಾಳಿ",
      uvIndex: "ಯುವಿ ಸೂಚ್ಯಂಕ",
      precipitation: "ಮಳೆ",
      cloudCover: "ಮೋಡ ಕವಿದ ವಾತಾವರಣ",
      dewPoint: "ಇಬ್ಬನಿ ಬಿಂದು"
    },
    prompts: [
      "ಇಂದು ಮಳೆಯಾಗುವುದೇ? ಛತ್ರಿ ಕೊಂಡೊಯ್ಯಬೇಕೆ?",
      "ನಾಳೆ ಬೆಳೆಗಳಿಗೆ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬಹುದೇ?",
      "ಕರಾವಳಿ ಪ್ರದೇಶಗಳಿಗೆ ಚಂಡಮಾರುತ ಎಚ್ಚರಿಕೆಗಳೇನು?"
    ]
  },
  ml: {
    appTitle: "വെതർ ജിപിടി (WeatherGPT)",
    moesTitle: "ഭൗമശാസ്ത്ര മന്ത്രാലയം (MoES) - ഇന്ത്യൻ കാലാവസ്ഥാ വകുപ്പ് (IMD)",
    tagline: "കാലാവസ്ഥാ പ്രവചനത്തിനും ദുരന്ത മുന്നറിയിപ്പിനുമുള്ള ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ്",
    searchPlaceholder: "നഗരത്തിന്റെയോ ജില്ലയുടെയോ പേര് തിരയുക...",
    askAiPlaceholder: "കാലാവസ്ഥയെക്കുറിച്ച് എന്തും ചോദിക്കൂ...",
    send: "ചോദിക്കൂ",
    listening: "ശ്രദ്ധിക്കുന്നു...",
    voiceInput: "വോയ്സ് ചോദ്യം",
    speakResponse: "കേൾക്കൂ",
    stopSpeaking: "നിർത്തൂ",
    tabs: {
      overview: "തത്സമയ കാലാവസ്ഥ",
      chat: "വെതർ ജിപിടി ചാറ്റ്",
      gisMap: "റഡാർ ഭൂപടം",
      agromet: "കർഷക നിർദ്ദേശം",
      alerts: "ദുരന്ത മുന്നറിയിപ്പ്",
      marine: "മത്സ്യത്തൊഴിലാളി ജാഗ്രത",
      aqi: "വായു ഗുണനിലവാരം (AQI)",
      bulletin: "ഐഎംഡി ബുള്ളറ്റിൻ"
    },
    personas: {
      citizen: "സാധാരണ പൗരൻ",
      kisan: "കർഷകൻ",
      disaster: "ദുരന്ത നിവാരണം",
      marine: "മത്സ്യത്തൊഴിലാളി",
      aviation: "വ്യോമയാനം"
    },
    metrics: {
      feelsLike: "അനുഭവപ്പെടുന്ന താപനില",
      humidity: "ഈർപ്പം",
      wind: "കാറ്റിന്റെ വേഗത",
      pressure: "വായുമർദ്ദം",
      gusts: "തീവ്ര കാറ്റ്",
      uvIndex: "യുവി സൂചിക",
      precipitation: "മഴ",
      cloudCover: "മേഘാവൃതം",
      dewPoint: "ഹിമ ബിന്ദു"
    },
    prompts: [
      "ഇന്ന് മഴ പെയ്യുമോ? കുട കരുതേണ്ടതുണ്ടോ?",
      "നാളെ വിളകളിൽ മരുന്ന് തളിക്കാൻ അനുയോജ്യമാണോ?",
      "തീരദേശ കടൽക്ഷോഭ മുന്നറിയിപ്പുകൾ എന്തൊക്കെയാണ്?"
    ]
  },
  pa: {
    appTitle: "ਵੈਦਰ ਜੀਪੀਟੀ (WeatherGPT)",
    moesTitle: "ਧਰਤੀ ਵਿਗਿਆਨ ਮੰਤਰਾਲਾ (MoES) - ਭਾਰਤੀ ਮੌਸਮ ਵਿਭਾਗ (IMD)",
    tagline: "ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ, ਆਫ਼ਤ ਚੇਤਾਵਨੀ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਈ ਏ.ਆਈ.",
    searchPlaceholder: "ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ ਜਾਂ ਜ਼ਿਲ੍ਹੇ ਦਾ ਨਾਮ ਖੋਜੋ...",
    askAiPlaceholder: "ਵੈਦਰ ਜੀਪੀਟੀ ਨੂੰ ਮੌਸਮ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
    send: "ਪੁੱਛੋ",
    listening: "ਸੁਣ ਰਹੇ ਹਾਂ...",
    voiceInput: "ਬੋਲ ਕੇ ਪੁੱਛੋ",
    speakResponse: "ਸੁਣੋ",
    stopSpeaking: "ਰੋਕੋ",
    tabs: {
      overview: "ਲਾਈਵ ਮੌਸਮ",
      chat: "ਵੈਦਰ ਜੀਪੀਟੀ ਚੈਟ",
      gisMap: "ਰਾਡਾਰ ਨਕਸ਼ਾ",
      agromet: "ਕਿਸਾਨ ਸਲਾਹ (ਖੇਤੀਬਾੜੀ)",
      alerts: "ਆਫ਼ਤ ਚੇਤਾਵਨੀਆਂ",
      marine: "ਮਛੇਰੇ ਚੇਤਾਵਨੀ",
      aqi: "ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ (AQI)",
      bulletin: "ਮੌਸਮ ਬੁਲੇਟਿਨ"
    },
    personas: {
      citizen: "ਨਾਗਰਿਕ",
      kisan: "ਕਿਸਾਨ (ਖੇਤੀਬਾੜੀ)",
      disaster: "ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ",
      marine: "ਮਛੇਰੇ",
      aviation: "ਹਵਾਬਾਜ਼ੀ"
    },
    metrics: {
      feelsLike: "ਮਹਿਸੂਸ ਹੁੰਦਾ ਤਾਪਮਾਨ",
      humidity: "ਨਮੀ",
      wind: "ਹਵਾ ਦੀ ਗਤੀ",
      pressure: "ਹਵਾ ਦਾ ਦਬਾਅ",
      gusts: "ਹਵਾ ਦੇ ਝੱਖੜ",
      uvIndex: "ਯੂਵੀ ਸੂਚਕ",
      precipitation: "ਮੀਂਹ",
      cloudCover: "ਬੱਦਲਵਾਈ",
      dewPoint: "ਤ੍ਰੇਲ ਬਿੰਦੂ"
    },
    prompts: [
      "ਕੀ ਅੱਜ ਮੀਂਹ ਪਵੇਗਾ? ਕੀ ਛਤਰੀ ਲਿਜਾਣੀ ਚਾਹੀਦੀ ਹੈ?",
      "ਕੀ ਕੱਲ੍ਹ ਕਣਕ/ਝੋਨੇ 'ਤੇ ਸਪਰੇਅ ਕਰਨਾ ਠੀਕ ਰਹੇਗਾ?",
      "ਪੰਜਾਬ ਅਤੇ ਉੱਤਰੀ ਭਾਰਤ ਵਿੱਚ ਯੈਲੋ/ਓਰੈਂਜ ਅਲਰਟ ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ?"
    ]
  }
};

export const getTranslation = (langCode = "en") => {
  return UI_TRANSLATIONS[langCode] || UI_TRANSLATIONS.en;
};
