"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type LangCode = "en" | "ps" | "fa" | "ar";

export const LANGUAGES: { code: LangCode; label: string; native: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "ps", label: "Pashto", native: "پښتو", dir: "rtl" },
  { code: "fa", label: "Dari", native: "دری", dir: "rtl" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

type Translations = Record<string, Record<LangCode, string>>;

const t: Translations = {
  signInTitle: { en: 'Sign in to Haseen Academy', ps: 'د حسین اکاډمۍ ته ننوځئ', fa: 'ورود به آکادمی حسین', ar: 'تسجيل الدخول إلى أكاديمية حسين' },
  signInSub: { en: 'Enter your credentials to continue.', ps: 'د دوام لپاره خپل معلومات ولیکئ.', fa: 'برای ادامه مشخصات خود را وارد کنید.', ar: 'أدخل بياناتك للمتابعة.' },
  signInHero: { en: 'Welcome back — continue your journey with the Quran.', ps: 'ښه راغلاست — د قرآن سره خپل سفر دوام ورکړئ.', fa: 'خوش آمدید — سفر خود را با قرآن ادامه دهید.', ar: 'أهلاً بعودتك — واصل رحلتك مع القرآن.' },
  brandTagline: { en: 'Quran · Tajweed · Hifz · Islamic studies', ps: 'قرآن · تجوید · حفظ · اسلامي زده کړې', fa: 'قرآن · تجوید · حفظ · علوم اسلامی', ar: 'القرآن · التجويد · الحفظ · العلوم الإسلامية' },
  username: { en: 'Username', ps: 'کارن نوم', fa: 'نام کاربری', ar: 'اسم المستخدم' },
  password: { en: 'Password', ps: 'پټنوم', fa: 'رمز عبور', ar: 'كلمة المرور' },
  keepSignedIn: { en: 'Keep me signed in', ps: 'ما ننوتلی وساتئ', fa: 'مرا وارد نگه دار', ar: 'أبقني مسجلاً' },
  signingIn: { en: 'Signing in…', ps: 'ننوځي…', fa: 'در حال ورود…', ar: 'جارٍ تسجيل الدخول…' },
  signIn: { en: 'Sign in', ps: 'ننوتل', fa: 'ورود', ar: 'تسجيل الدخول' },
  noAccount: { en: 'Accounts are created by the academy.', ps: 'حسابونه د اکاډمۍ لخوا جوړیږي.', fa: 'حساب\u200cها توسط آکادمی ساخته می\u200cشوند.', ar: 'يتم إنشاء الحسابات من قبل الأكاديمية.' },
  needAccess: { en: 'Need access? Send an admission enquiry', ps: 'لاسرسی غواړئ؟ د ننوتنې پوښتنه ولیږئ', fa: 'دسترسی می\u200cخواهید؟ درخواست پذیرش بفرستید', ar: 'تحتاج إلى وصول؟ أرسل طلب قبول' },
  backToSite: { en: 'Back to website', ps: 'وېبپاڼې ته بیرته', fa: 'بازگشت به وب\u200cسایت', ar: 'العودة إلى الموقع' },
  welcomeBack: { en: 'Welcome back', ps: 'ښه راغلاست', fa: 'خوش آمدید', ar: 'أهلاً بعودتك' },
  loadingDashboard: { en: 'Loading your dashboard…', ps: 'ستاسو ډشبورډ بارېږي…', fa: 'داشبورد شما در حال بارگیری است…', ar: 'جارٍ تحميل لوحتك…' },
  adminPanel: { en: 'Admin panel', ps: 'د اډمین پینل', fa: 'پنل مدیریت', ar: 'لوحة الإدارة' },
  signedInAs: { en: 'Signed in as', ps: 'ننوتلی لکه', fa: 'وارد شده به عنوان', ar: 'مسجل باسم' },
  upcomingClasses: { en: 'Upcoming classes', ps: 'راتلونکي ټولګي', fa: 'کلاس\u200cهای پیش\u200cرو', ar: 'الفصول القادمة' },
  noUpcoming: { en: 'Nothing scheduled yet.', ps: 'تر اوسه هیڅ مهالویش نشته.', fa: 'هنوز چیزی برنامه\u200cریزی نشده است.', ar: 'لا يوجد شيء مجدول بعد.' },
  pendingAdmissions: { en: 'Pending admissions', ps: 'په تمه ننوتنې', fa: 'پذیرش\u200cهای در انتظار', ar: 'طلبات قبول معلقة' },
  openQuestions: { en: 'Open questions', ps: 'پرانیستې پوښتنې', fa: 'سؤالات باز', ar: 'أسئلة مفتوحة' },
  awaitingReply: { en: 'Awaiting reply', ps: 'د ځواب په تمه', fa: 'در انتظار پاسخ', ar: 'في انتظار الرد' },
  answer: { en: 'Answer', ps: 'ځواب', fa: 'پاسخ', ar: 'الإجابة' },
  active: { en: 'Active', ps: 'فعال', fa: 'فعال', ar: 'نشط' },
  inactive: { en: 'Inactive', ps: 'غیر فعال', fa: 'غیرفعال', ar: 'غير نشط' },
  quickActions: { en: 'Quick actions', ps: 'چټکې کړنې', fa: 'اقدامات سریع', ar: 'إجراءات سريعة' },
  families: { en: 'Families', ps: 'کورنۍ', fa: 'خانواده\u200cها', ar: 'العائلات' },
  browseCourses: { en: 'Browse courses', ps: 'کورسونه وګورئ', fa: 'دوره\u200cها را ببینید', ar: 'تصفح الدورات' },
  viewWebsite: { en: 'View website', ps: 'وېبپاڼه وګورئ', fa: 'مشاهده وب\u200cسایت', ar: 'عرض الموقع' },
  academyHub: { en: 'Academy portal', ps: 'د اکاډمۍ پورټل', fa: 'پورتال آکادمی', ar: 'بوابة الأكاديمية' },
  loadFailed: { en: 'Could not load data. Please try again.', ps: 'معلومات نه شول بارېدلی. بیا هڅه وکړئ.', fa: 'بارگیری داده\u200cها ممکن نشد. دوباره تلاش کنید.', ar: 'تعذر تحميل البيانات. حاول مرة أخرى.' },
  tooManyAttempts: { en: 'Too many attempts. Please wait a few minutes.', ps: 'ډیرې هڅې. څو دقیقې انتظار وکړئ.', fa: 'تلاش\u200cهای بسیار. چند دقیقه صبر کنید.', ar: 'محاولات كثيرة. يرجى الانتظار بضع دقائق.' },
  requiredField: { en: 'This field is required.', ps: 'دا ډګر اړین دی.', fa: 'این فیلد الزامی است.', ar: 'هذا الحقل مطلوب.' },
  students_hint: { en: 'Learners in your family', ps: 'ستاسو په کورنۍ کې زده کوونکي', fa: 'دانش\u200cآموزان خانواده شما', ar: 'المتعلمون في عائلتك' },
  teacherHint: { en: 'Your teaching schedule', ps: 'ستاسو د تدریس مهالویش', fa: 'برنامه تدریس شما', ar: 'جدول تدريسك' },
  home: { en: "Home", ps: "کور", fa: "خانه", ar: "الرئيسية" },
  about: { en: "About", ps: "په اړه", fa: "درباره", ar: "من نحن" },
  courses: { en: "Courses", ps: "کورسونه", fa: "دوره‌ها", ar: "الدورات" },
  teachers: { en: "Teachers", ps: "ښوونکي", fa: "معلمان", ar: "المعلمون" },
  admission: { en: "Admission", ps: "ننوتل", fa: "پذیرش", ar: "القبول" },
  portal: { en: "Portal", ps: "پورټل", fa: "پورتال", ar: "البوابة" },
  portalLogin: { en: "Portal Login", ps: "پورټل ننوتل", fa: "ورود به پورتال", ar: "تسجيل الدخول" },
  contact: { en: "Contact", ps: "اړیکه", fa: "تماس", ar: "اتصل بنا" },
  language: { en: "Language", ps: "ژبه", fa: "زبان", ar: "اللغة" },
  teacherDashboard: { en: "Teacher dashboard", ps: "د ښوونکي ډشبورډ", fa: "داشبورد معلم", ar: "لوحة المعلم" },
  adminDashboard: { en: "Admin dashboard", ps: "د اډمین ډشبورډ", fa: "داشبورد مدیر", ar: "لوحة المدير" },
  familyDashboard: { en: "Family dashboard", ps: "د کورنۍ ډشبورډ", fa: "داشبورد خانواده", ar: "لوحة العائلة" },
  logout: { en: "Sign out", ps: "وتل", fa: "خروج", ar: "تسجيل الخروج" },
  overview: { en: "Overview", ps: "کتنه", fa: "نمای کلی", ar: "نظرة عامة" },
  students: { en: "Students", ps: "زده کوونکي", fa: "دانش‌آموزان", ar: "الطلاب" },
  classes: { en: "Classes", ps: "ټولګي", fa: "کلاس‌ها", ar: "الفصول" },
  questions: { en: "Questions", ps: "پوښتنې", fa: "سؤالات", ar: "الأسئلة" },
  admissions: { en: "Admissions", ps: "ننوتنې", fa: "پذیرش‌ها", ar: "الطلبات" },
  settings: { en: "Settings", ps: "تنظیمات", fa: "تنظیمات", ar: "الإعدادات" },
  ourTeacher: { en: "Our Teacher", ps: "زموږ ښوونکی", fa: "معلم ما", ar: "معلمنا" },
  meetTeacher: {
    en: "Meet the teacher behind Haseen Academy",
    ps: "د حسین اکاډمۍ ښوونکی وپیژنئ",
    fa: "با معلم آکادمی حسین آشنا شوید",
    ar: "تعرف على معلم أكاديمية حسين",
  },
  qualifications: { en: "Qualifications", ps: "وړتیاوې", fa: "مدارک", ar: "المؤهلات" },
  contactTeacher: { en: "Contact teacher", ps: "له ښوونکي سره اړیکه", fa: "تماس با معلم", ar: "اتصل بالمعلم" },
  whatsapp: { en: "WhatsApp", ps: "واټساپ", fa: "واتساپ", ar: "واتساب" },
  phone: { en: "Phone", ps: "تلیفون", fa: "تلفن", ar: "الهاتف" },
  beginJourney: {
    en: "Begin your learning journey",
    ps: "خپل د زده کړې سفر پیل کړئ",
    fa: "سفر یادگیری خود را آغاز کنید",
    ar: "ابدأ رحلة التعلم",
  },
  submitEnquiry: {
    en: "Submit enquiry",
    ps: "پوښتنه وسپارئ",
    fa: "ارسال درخواست",
    ar: "إرسال الاستفسار",
  },
  preferredLanguage: {
    en: "Preferred language",
    ps: "غوره ژبه",
    fa: "زبان ترجیحی",
    ar: "اللغة المفضلة",
  },
  successAdmission: {
    en: "Thank you. Your admission enquiry has been received. The academy will contact you soon.",
    ps: "مننه. ستاسو د ننوتلو پوښتنه ترلاسه شوه. اکاډمي به ژر له تاسو سره اړیکه ونیسي.",
    fa: "متشکریم. درخواست پذیرش شما دریافت شد. آکادمی به زودی با شما تماس خواهد گرفت.",
    ar: "شكرًا لك. تم استلام طلب القبول. ستتواصل الأكاديمية معك قريبًا.",
  },
};

type LangContextValue = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  dir: "ltr" | "rtl";
  tr: (key: string) => string;
};

const LanguageContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("haseen-lang") as LangCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    const meta = LANGUAGES.find((l) => l.code === lang)!;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    localStorage.setItem("haseen-lang", lang);
  }, [lang]);

  const setLang = (l: LangCode) => setLangState(l);

  const tr = (key: string) => t[key]?.[lang] ?? t[key]?.en ?? key;

  const dir = LANGUAGES.find((l) => l.code === lang)!.dir;

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
