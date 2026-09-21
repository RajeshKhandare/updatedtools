import { TOOLS_REGISTRY, type ToolMeta } from './toolsRegistry';
import { LOCALES, type LocaleCode } from './internationalSeo';
import { getInternationalKeywordValidation } from './internationalKeywordValidation';

export interface LocalizationCoverageRow {
  locale: LocaleCode;
  slug: string;
  toolName: string;
  status: 'source' | 'planned-localization';
}

export const INTERNATIONAL_LOCALIZATION_COVERAGE: readonly LocalizationCoverageRow[] =
  LOCALES.flatMap((locale) =>
    TOOLS_REGISTRY.map((tool) => ({
      locale: locale.code,
      slug: tool.slug,
      toolName: tool.name,
      status: locale.code === 'en' ? 'source' as const : 'planned-localization' as const,
    }))
  );

export const INTERNATIONAL_LOCALIZATION_COVERAGE_SIZE =
  INTERNATIONAL_LOCALIZATION_COVERAGE.length;

export function getLocalizationCoverage(locale: LocaleCode, slug: string) {
  return INTERNATIONAL_LOCALIZATION_COVERAGE.find(
    (row) => row.locale === locale && row.slug === slug
  );
}

export type LocalizedUi = {
  toolLabel: string;
  freeLabel: string;
  browserLabel: string;
  guideLabel: string;
  description: string;
  relatedLabel: string;
};

export const LOCALIZED_UI: Record<LocaleCode, LocalizedUi> = {
  en: { toolLabel: 'Tool', freeLabel: 'Free online tool', browserLabel: 'Works in your browser', guideLabel: 'Tool guide', description: 'Use this browser-based utility without installing a separate desktop application.', relatedLabel: 'Related tools' },
  pt: { toolLabel: 'Ferramenta', freeLabel: 'Ferramenta online gratuita', browserLabel: 'Funciona no navegador', guideLabel: 'Guia da ferramenta', description: 'Use esta ferramenta no navegador sem instalar um aplicativo separado.', relatedLabel: 'Ferramentas relacionadas' },
  es: { toolLabel: 'Herramienta', freeLabel: 'Herramienta online gratuita', browserLabel: 'Funciona en tu navegador', guideLabel: 'Guía de la herramienta', description: 'Usa esta herramienta en el navegador sin instalar una aplicación independiente.', relatedLabel: 'Herramientas relacionadas' },
  de: { toolLabel: 'Tool', freeLabel: 'Kostenloses Online-Tool', browserLabel: 'Funktioniert im Browser', guideLabel: 'Tool-Anleitung', description: 'Nutze dieses browserbasierte Tool ohne eine separate Desktop-Anwendung zu installieren.', relatedLabel: 'Ähnliche Tools' },
  fr: { toolLabel: 'Outil', freeLabel: 'Outil en ligne gratuit', browserLabel: 'Fonctionne dans le navigateur', guideLabel: 'Guide de l’outil', description: 'Utilisez cet outil dans votre navigateur sans installer une application de bureau séparée.', relatedLabel: 'Outils associés' },
  it: { toolLabel: 'Strumento', freeLabel: 'Strumento online gratuito', browserLabel: 'Funziona nel browser', guideLabel: 'Guida dello strumento', description: 'Usa questo strumento nel browser senza installare un’applicazione desktop separata.', relatedLabel: 'Strumenti correlati' },
  ja: { toolLabel: 'ツール', freeLabel: '無料オンラインツール', browserLabel: 'ブラウザで利用できます', guideLabel: 'ツールガイド', description: '別のデスクトップアプリをインストールせず、ブラウザでこのツールを利用できます。', relatedLabel: '関連ツール' },
  ko: { toolLabel: '도구', freeLabel: '무료 온라인 도구', browserLabel: '브라우저에서 실행', guideLabel: '도구 가이드', description: '별도의 데스크톱 애플리케이션을 설치하지 않고 브라우저에서 사용할 수 있습니다.', relatedLabel: '관련 도구' },
  zh: { toolLabel: '工具', freeLabel: '免费在线工具', browserLabel: '可在浏览器中使用', guideLabel: '工具指南', description: '无需安装独立桌面应用，即可在浏览器中使用此工具。', relatedLabel: '相关工具' },
  ru: { toolLabel: 'Инструмент', freeLabel: 'Бесплатный онлайн-инструмент', browserLabel: 'Работает в браузере', guideLabel: 'Руководство по инструменту', description: 'Используйте этот инструмент в браузере без установки отдельного приложения.', relatedLabel: 'Похожие инструменты' },
  ar: { toolLabel: 'أداة', freeLabel: 'أداة مجانية عبر الإنترنت', browserLabel: 'تعمل في المتصفح', guideLabel: 'دليل الأداة', description: 'استخدم هذه الأداة في المتصفح دون تثبيت تطبيق منفصل على سطح المكتب.', relatedLabel: 'أدوات ذات صلة' },
  hi: { toolLabel: 'टूल', freeLabel: 'मुफ्त ऑनलाइन टूल', browserLabel: 'ब्राउज़र में काम करता है', guideLabel: 'टूल गाइड', description: 'अलग डेस्कटॉप ऐप इंस्टॉल किए बिना इस टूल का उपयोग ब्राउज़र में करें।', relatedLabel: 'संबंधित टूल' },
};

const NAME_PHRASES: Record<string, Partial<Record<LocaleCode, string>>> = {
  'Merge PDF': { pt: 'Juntar PDF', es: 'Unir PDF', de: 'PDF zusammenfügen', fr: 'Fusionner PDF', it: 'Unire PDF', ja: 'PDF 結合', ko: 'PDF 합치기', zh: '合并PDF', ru: 'Объединить PDF', ar: 'دمج PDF', hi: 'PDF मर्ज करें' },
  'Split PDF': { pt: 'Dividir PDF', es: 'Dividir PDF', de: 'PDF teilen', fr: 'Diviser PDF', it: 'Dividere PDF', ja: 'PDF 分割', ko: 'PDF 분할', zh: '拆分PDF', ru: 'Разделить PDF', ar: 'تقسيم PDF', hi: 'PDF विभाजित करें' },
  'Compress PDF': { pt: 'Comprimir PDF', es: 'Comprimir PDF', de: 'PDF komprimieren', fr: 'Compresser PDF', it: 'Comprimere PDF', ja: 'PDF 圧縮', ko: 'PDF 압축', zh: '压缩PDF', ru: 'Сжать PDF', ar: 'ضغط PDF', hi: 'PDF कंप्रेस करें' },
  'PDF to JPG Converter': { pt: 'Conversor de PDF para JPG', es: 'Convertidor de PDF a JPG', de: 'PDF-zu-JPG-Konverter', fr: 'Convertisseur PDF en JPG', it: 'Convertitore PDF in JPG', ja: 'PDFからJPGへの変換', ko: 'PDF를 JPG로 변환', zh: 'PDF转JPG转换器', ru: 'Конвертер PDF в JPG', ar: 'محول PDF إلى JPG', hi: 'PDF से JPG कन्वर्टर' },
  'JPG to PDF Converter': { pt: 'Conversor de JPG para PDF', es: 'Convertidor de JPG a PDF', de: 'JPG-zu-PDF-Konverter', fr: 'Convertisseur JPG en PDF', it: 'Convertitore JPG in PDF', ja: 'JPGからPDFへの変換', ko: 'JPG를 PDF로 변환', zh: 'JPG转PDF转换器', ru: 'Конвертер JPG в PDF', ar: 'محول JPG إلى PDF', hi: 'JPG से PDF कन्वर्टर' },
  'Compress Image Online': { pt: 'Comprimir imagem online', es: 'Comprimir imagen online', de: 'Bild online komprimieren', fr: 'Compresser une image en ligne', it: 'Comprimere immagini online', ja: '画像をオンラインで圧縮', ko: '온라인 이미지 압축', zh: '在线压缩图片', ru: 'Сжать изображение онлайн', ar: 'ضغط الصور عبر الإنترنت', hi: 'इमेज ऑनलाइन कंप्रेस करें' },
  'Crop Image Online': { pt: 'Cortar imagem online', es: 'Recortar imagen online', de: 'Bild online zuschneiden', fr: 'Recadrer une image en ligne', it: 'Ritagliare immagini online', ja: '画像をオンラインでトリミング', ko: '온라인 이미지 자르기', zh: '在线裁剪图片', ru: 'Обрезать изображение онлайн', ar: 'قص الصورة عبر الإنترنت', hi: 'इमेज ऑनलाइन क्रॉप करें' },
  'Resize Image Online': { pt: 'Redimensionar imagem online', es: 'Cambiar tamaño de imagen online', de: 'Bild online skalieren', fr: 'Redimensionner une image en ligne', it: 'Ridimensionare immagini online', ja: '画像をオンラインでリサイズ', ko: '온라인 이미지 크기 조정', zh: '在线调整图片大小', ru: 'Изменить размер изображения онлайн', ar: 'تغيير حجم الصورة عبر الإنترنت', hi: 'इमेज ऑनलाइन रिसाइज़ करें' },
  'Word Counter': { pt: 'Contador de palavras', es: 'Contador de palabras', de: 'Wörterzähler', fr: 'Compteur de mots', it: 'Contatore di parole', ja: '文字数・単語数カウンター', ko: '단어 수 세기', zh: '字数统计', ru: 'Счетчик слов', ar: 'عداد الكلمات', hi: 'वर्ड काउंटर' },
  'Text Case Converter': { pt: 'Conversor de maiúsculas e minúsculas', es: 'Convertidor de mayúsculas y minúsculas', de: 'Text-Groß-/Kleinschreibungs-Konverter', fr: 'Convertisseur de casse', it: 'Convertitore maiuscole/minuscole', ja: '文字の大文字・小文字変換', ko: '텍스트 대소문자 변환기', zh: '文本大小写转换器', ru: 'Конвертер регистра текста', ar: 'محول حالة النص', hi: 'टेक्स्ट केस कन्वर्टर' },
  'Percentage Calculator': { pt: 'Calculadora de porcentagem', es: 'Calculadora de porcentajes', de: 'Prozentrechner', fr: 'Calculateur de pourcentage', it: 'Calcolatore percentuale', ja: 'パーセント計算機', ko: '백분율 계산기', zh: '百分比计算器', ru: 'Калькулятор процентов', ar: 'حاسبة النسبة المئوية', hi: 'प्रतिशत कैलकुलेटर' },
  'Age Calculator': { pt: 'Calculadora de idade', es: 'Calculadora de edad', de: 'Altersrechner', fr: 'Calculateur d’âge', it: 'Calcolatore dell’età', ja: '年齢計算機', ko: '나이 계산기', zh: '年龄计算器', ru: 'Калькулятор возраста', ar: 'حاسبة العمر', hi: 'उम्र कैलकुलेटर' },
  'BMI Calculator': { pt: 'Calculadora de IMC', es: 'Calculadora de IMC', de: 'BMI-Rechner', fr: 'Calculateur d’IMC', it: 'Calcolatore BMI', ja: 'BMI計算機', ko: 'BMI 계산기', zh: 'BMI计算器', ru: 'Калькулятор ИМТ', ar: 'حاسبة مؤشر كتلة الجسم', hi: 'BMI कैलकुलेटर' },
  'Scientific Calculator': { pt: 'Calculadora científica', es: 'Calculadora científica', de: 'Wissenschaftlicher Rechner', fr: 'Calculatrice scientifique', it: 'Calcolatrice scientifica', ja: '関数電卓', ko: '공학용 계산기', zh: '科学计算器', ru: 'Инженерный калькулятор', ar: 'حاسبة علمية', hi: 'साइंटिफिक कैलकुलेटर' },
  'Discount Calculator': { pt: 'Calculadora de desconto', es: 'Calculadora de descuentos', de: 'Rabattrechner', fr: 'Calculateur de remise', it: 'Calcolatore di sconti', ja: '割引計算機', ko: '할인 계산기', zh: '折扣计算器', ru: 'Калькулятор скидки', ar: 'حاسبة الخصم', hi: 'डिस्काउंट कैलकुलेटर' },
  'Tip Calculator': { pt: 'Calculadora de gorjeta', es: 'Calculadora de propinas', de: 'Trinkgeldrechner', fr: 'Calculateur de pourboire', it: 'Calcolatore della mancia', ja: 'チップ計算機', ko: '팁 계산기', zh: '小费计算器', ru: 'Калькулятор чаевых', ar: 'حاسبة البقشيش', hi: 'टिप कैलकुलेटर' },

  'Protect PDF': { pt: 'Proteger PDF', es: 'Proteger PDF', de: 'PDF schützen', fr: 'Protéger PDF', it: 'Proteggere PDF', ja: 'PDF保護', ko: 'PDF 보호', zh: '保护PDF', ru: 'Защитить PDF', ar: 'حماية PDF', hi: 'PDF को सुरक्षित करें' },
  'Unlock PDF': { pt: 'Desbloquear PDF', es: 'Desbloquear PDF', de: 'PDF entsperren', fr: 'Déverrouiller PDF', it: 'Sbloccare PDF', ja: 'PDFロック解除', ko: 'PDF 잠금 해제', zh: '解锁PDF', ru: 'Разблокировать PDF', ar: 'فك حماية PDF', hi: 'PDF अनलॉक करें' },
  'Rotate PDF': { pt: 'Girar PDF', es: 'Rotar PDF', de: 'PDF drehen', fr: 'Faire pivoter un PDF', it: 'Ruotare PDF', ja: 'PDF回転', ko: 'PDF 회전', zh: '旋转PDF', ru: 'Повернуть PDF', ar: 'تدوير PDF', hi: 'PDF घुमाएँ' },
  'PDF to Word Converter': { pt: 'Conversor de PDF para Word', es: 'Convertidor de PDF a Word', de: 'PDF-zu-Word-Konverter', fr: 'Convertisseur PDF en Word', it: 'Convertitore PDF in Word', ja: 'PDFからWordへの変換', ko: 'PDF를 Word로 변환', zh: 'PDF转Word转换器', ru: 'Конвертер PDF в Word', ar: 'محول PDF إلى Word', hi: 'PDF से Word कन्वर्टर' },
  'Word to PDF Converter': { pt: 'Conversor de Word para PDF', es: 'Convertidor de Word a PDF', de: 'Word-zu-PDF-Konverter', fr: 'Convertisseur Word en PDF', it: 'Convertitore Word in PDF', ja: 'WordからPDFへの変換', ko: 'Word를 PDF로 변환', zh: 'Word转PDF转换器', ru: 'Конвертер Word в PDF', ar: 'محول Word إلى PDF', hi: 'Word से PDF कन्वर्टर' },
  'JSON Formatter and Validator': { pt: 'Formatador e validador JSON', es: 'Formateador y validador JSON', de: 'JSON-Formatter und Validator', fr: 'Formater et valider du JSON', it: 'Formattatore e validatore JSON', ja: 'JSONフォーマッター・バリデーター', ko: 'JSON 포맷터 및 검증기', zh: 'JSON格式化与验证', ru: 'Форматтер и валидатор JSON', ar: 'منسق ومدقق JSON', hi: 'JSON फ़ॉर्मेटर और वैलिडेटर' },
  'Base64 Encoder Decoder': { pt: 'Codificador e decodificador Base64', es: 'Codificador y decodificador Base64', de: 'Base64 kodieren und dekodieren', fr: 'Encoder et décoder en Base64', it: 'Codificatore e decodificatore Base64', ja: 'Base64 エンコード・デコード', ko: 'Base64 인코더/디코더', zh: 'Base64编解码', ru: 'Кодировщик и декодировщик Base64', ar: 'ترميز وفك ترميز Base64', hi: 'Base64 एनकोडर और डिकोडर' },
  'URL Encoder Decoder': { pt: 'Codificador e decodificador de URL', es: 'Codificador y decodificador de URL', de: 'URL kodieren und dekodieren', fr: 'Encoder une URL', it: 'Codificatore e decodificatore URL', ja: 'URLエンコード・デコード', ko: 'URL 인코더/디코더', zh: 'URL编码解码', ru: 'Кодировщик и декодировщик URL', ar: 'ترميز وفك ترميز URL', hi: 'URL एनकोडर और डिकोडर' },
  'UUID Generator': { pt: 'Gerador de UUID', es: 'Generador de UUID', de: 'UUID-Generator', fr: 'Générateur d’UUID', it: 'Generatore UUID', ja: 'UUIDジェネレーター', ko: 'UUID 생성기', zh: 'UUID生成器', ru: 'Генератор UUID', ar: 'مولد UUID', hi: 'UUID जनरेटर' },
  'Password Generator': { pt: 'Gerador de senhas', es: 'Generador de contraseñas', de: 'Passwort-Generator', fr: 'Générateur de mots de passe', it: 'Generatore di password', ja: 'ランダムパスワード生成ツール', ko: '비밀번호 생성기', zh: '随机密码生成器', ru: 'Генератор паролей', ar: 'مولد كلمات المرور', hi: 'पासवर्ड जनरेटर' },
  'QR Code Generator': { pt: 'Gerador de QR Code', es: 'Generador de códigos QR', de: 'QR-Code-Generator', fr: 'Générateur de QR code', it: 'Generatore di codici QR', ja: 'QRコードジェネレーター', ko: 'QR 코드 생성기', zh: '二维码生成器', ru: 'Генератор QR-кодов', ar: 'مولد رمز QR', hi: 'QR कोड जनरेटर' },
};

export function getLocalizedToolName(tool: ToolMeta, locale: LocaleCode): string {
  if (locale === 'en') return tool.name;
  const explicitName = NAME_PHRASES[tool.name]?.[locale];
  if (explicitName) return explicitName;

  // When an evidence-backed market keyword exists, use its native task
  // wording as the localized display name. This expands localization
  // coverage without treating unvalidated literal translations as SEO terms.
  const localeCode = locale === 'pt' ? 'pt-BR' : locale === 'zh' ? 'zh-CN' : locale;
  const evidence = getInternationalKeywordValidation(localeCode, tool.slug);
  return evidence?.primaryKeyword || tool.name;
}

export const SEARCH_QUERY_MODIFIERS: Record<LocaleCode, string[]> = {
  en: ['online', 'free', 'free online'],
  pt: ['online', 'grátis', 'gratuito', 'grátis online'],
  es: ['online', 'gratis', 'gratuito', 'gratis online'],
  de: ['online', 'kostenlos', 'kostenlos online'],
  fr: ['en ligne', 'gratuit', 'gratuite', 'gratuit en ligne'],
  it: ['online', 'gratis', 'gratuito', 'gratis online'],
  ja: ['オンライン', '無料', '無料オンライン'],
  ko: ['온라인', '무료', '무료 온라인'],
  zh: ['在线', '免费', '免费在线'],
  ru: ['онлайн', 'бесплатно', 'бесплатный', 'бесплатно онлайн'],
  ar: ['أونلاين', 'عبر الإنترنت', 'مجاني', 'مجانا أونلاين'],
  hi: ['ऑनलाइन', 'मुफ्त', 'फ्री', 'मुफ्त ऑनलाइन'],
};

/**
 * Long-tail intent patterns. These are research candidates, not claims about
 * search volume. They combine localized tool phrases with common task,
 * problem, device, and file-format intents so lower-competition queries
 * are considered alongside head terms.
 */
export const LONG_TAIL_QUERY_PATTERNS: Record<LocaleCode, string[]> = {
  en: ['how to use', 'how to', 'without installing', 'on mobile', 'for beginners', 'step by step', 'with no signup'],
  pt: ['como usar', 'como fazer', 'sem instalar', 'no celular', 'passo a passo', 'sem cadastro'],
  es: ['cómo usar', 'cómo hacer', 'sin instalar', 'en el móvil', 'paso a paso', 'sin registro'],
  de: ['wie man', 'ohne Installation', 'auf dem Handy', 'Schritt für Schritt', 'ohne Anmeldung'],
  fr: ['comment utiliser', 'comment faire', 'sans installer', 'sur mobile', 'étape par étape', 'sans inscription'],
  it: ['come usare', 'come fare', 'senza installare', 'su mobile', 'passo passo', 'senza registrazione'],
  ja: ['使い方', 'やり方', 'インストール不要', 'スマホで', '初心者向け', '登録不要'],
  ko: ['사용 방법', '하는 방법', '설치 없이', '모바일에서', '초보자용', '회원가입 없이'],
  zh: ['怎么用', '使用方法', '无需安装', '手机上', '新手', '无需注册'],
  ru: ['как использовать', 'как сделать', 'без установки', 'на телефоне', 'пошагово', 'без регистрации'],
  ar: ['كيفية الاستخدام', 'كيفية', 'بدون تثبيت', 'على الهاتف', 'خطوة بخطوة', 'بدون تسجيل'],
  hi: ['कैसे इस्तेमाल करें', 'कैसे करें', 'इंस्टॉल किए बिना', 'मोबाइल पर', 'स्टेप बाय स्टेप', 'बिना साइन अप'],
};


/**
 * Category-specific long-tail suffixes are localized as query candidates.
 * They are intentionally not treated as validated keywords until market/SERP
 * evidence confirms the phrasing.
 */
const CATEGORY_LONG_TAIL_PATTERNS: Record<LocaleCode, Partial<Record<string, string[]>>> = {
  en: {
    PDF: ['with multiple files', 'for documents', 'for printing'],
    Image: ['for photos', 'for social media', 'without losing quality'],
    Compiler: ['in browser', 'for beginners', 'with example code'],
    Developer: ['for developers', 'with example', 'for API development'],
    Text: ['for essays', 'for documents', 'for students'],
    Converters: ['with formula', 'with examples', 'between units'],
    Finance: ['with formula', 'with examples', 'monthly calculation'],
    Calculators: ['with formula', 'with examples', 'step by step'],
    YouTube: ['for creators', 'for videos', 'with YouTube URL'],
  },
  pt: {
    PDF: ['com vários arquivos', 'para documentos', 'para impressão'],
    Image: ['para fotos', 'para redes sociais', 'sem perder qualidade'],
    Compiler: ['no navegador', 'para iniciantes', 'com exemplo de código'],
    Developer: ['para desenvolvedores', 'com exemplo', 'para desenvolvimento de API'],
    Text: ['para redações', 'para documentos', 'para estudantes'],
    Converters: ['com fórmula', 'com exemplos', 'entre unidades'],
    Finance: ['com fórmula', 'com exemplos', 'cálculo mensal'],
    Calculators: ['com fórmula', 'com exemplos', 'passo a passo'],
    YouTube: ['para criadores', 'para vídeos', 'com URL do YouTube'],
  },
  es: {
    PDF: ['con varios archivos', 'para documentos', 'para imprimir'],
    Image: ['para fotos', 'para redes sociales', 'sin perder calidad'],
    Compiler: ['en el navegador', 'para principiantes', 'con ejemplo de código'],
    Developer: ['para desarrolladores', 'con ejemplo', 'para desarrollo de API'],
    Text: ['para ensayos', 'para documentos', 'para estudiantes'],
    Converters: ['con fórmula', 'con ejemplos', 'entre unidades'],
    Finance: ['con fórmula', 'con ejemplos', 'cálculo mensual'],
    Calculators: ['con fórmula', 'con ejemplos', 'paso a paso'],
    YouTube: ['para creadores', 'para vídeos', 'con URL de YouTube'],
  },
  de: {
    PDF: ['mit mehreren Dateien', 'für Dokumente', 'zum Drucken'],
    Image: ['für Fotos', 'für soziale Medien', 'ohne Qualitätsverlust'],
    Compiler: ['im Browser', 'für Anfänger', 'mit Codebeispiel'],
    Developer: ['für Entwickler', 'mit Beispiel', 'für API-Entwicklung'],
    Text: ['für Aufsätze', 'für Dokumente', 'für Schüler'],
    Converters: ['mit Formel', 'mit Beispielen', 'zwischen Einheiten'],
    Finance: ['mit Formel', 'mit Beispielen', 'monatliche Berechnung'],
    Calculators: ['mit Formel', 'mit Beispielen', 'Schritt für Schritt'],
    YouTube: ['für Creator', 'für Videos', 'mit YouTube-URL'],
  },
  fr: {
    PDF: ['avec plusieurs fichiers', 'pour les documents', 'pour imprimer'],
    Image: ['pour les photos', 'pour les réseaux sociaux', 'sans perdre en qualité'],
    Compiler: ['dans le navigateur', 'pour débutants', 'avec exemple de code'],
    Developer: ['pour développeurs', 'avec exemple', 'pour développement API'],
    Text: ['pour les dissertations', 'pour les documents', 'pour les étudiants'],
    Converters: ['avec formule', 'avec exemples', 'entre unités'],
    Finance: ['avec formule', 'avec exemples', 'calcul mensuel'],
    Calculators: ['avec formule', 'avec exemples', 'étape par étape'],
    YouTube: ['pour créateurs', 'pour vidéos', 'avec URL YouTube'],
  },
  it: {
    PDF: ['con più file', 'per documenti', 'per la stampa'],
    Image: ['per foto', 'per i social', 'senza perdere qualità'],
    Compiler: ['nel browser', 'per principianti', 'con esempio di codice'],
    Developer: ['per sviluppatori', 'con esempio', 'per sviluppo API'],
    Text: ['per temi', 'per documenti', 'per studenti'],
    Converters: ['con formula', 'con esempi', 'tra unità'],
    Finance: ['con formula', 'con esempi', 'calcolo mensile'],
    Calculators: ['con formula', 'con esempi', 'passo passo'],
    YouTube: ['per creator', 'per video', 'con URL YouTube'],
  },
  ja: {
    PDF: ['複数ファイルで', '文書用', '印刷用'],
    Image: ['写真用', 'SNS用', '画質を落とさず'],
    Compiler: ['ブラウザで', '初心者向け', 'コード例付き'],
    Developer: ['開発者向け', '例付き', 'API開発向け'],
    Text: ['作文用', '文書用', '学生向け'],
    Converters: ['計算式付き', '例付き', '単位間で'],
    Finance: ['計算式付き', '例付き', '月額計算'],
    Calculators: ['計算式付き', '例付き', 'ステップごと'],
    YouTube: ['クリエイター向け', '動画用', 'YouTube URLで'],
  },
  ko: {
    PDF: ['여러 파일로', '문서용', '인쇄용'],
    Image: ['사진용', '소셜 미디어용', '화질 저하 없이'],
    Compiler: ['브라우저에서', '초보자용', '예제 코드 포함'],
    Developer: ['개발자용', '예제 포함', 'API 개발용'],
    Text: ['에세이용', '문서용', '학생용'],
    Converters: ['공식 포함', '예제 포함', '단위 간 변환'],
    Finance: ['공식 포함', '예제 포함', '월별 계산'],
    Calculators: ['공식 포함', '예제 포함', '단계별'],
    YouTube: ['크리에이터용', '동영상용', 'YouTube URL로'],
  },
  zh: {
    PDF: ['多个文件', '文档用', '打印用'],
    Image: ['照片用', '社交媒体用', '不降低画质'],
    Compiler: ['浏览器在线', '新手用', '带代码示例'],
    Developer: ['开发者用', '带示例', 'API开发用'],
    Text: ['作文用', '文档用', '学生用'],
    Converters: ['带公式', '带示例', '单位之间'],
    Finance: ['带公式', '带示例', '月度计算'],
    Calculators: ['带公式', '带示例', '分步骤'],
    YouTube: ['创作者用', '视频用', '使用YouTube链接'],
  },
  ru: {
    PDF: ['для нескольких файлов', 'для документов', 'для печати'],
    Image: ['для фотографий', 'для соцсетей', 'без потери качества'],
    Compiler: ['в браузере', 'для начинающих', 'с примером кода'],
    Developer: ['для разработчиков', 'с примером', 'для разработки API'],
    Text: ['для сочинений', 'для документов', 'для студентов'],
    Converters: ['с формулой', 'с примерами', 'между единицами'],
    Finance: ['с формулой', 'с примерами', 'расчет за месяц'],
    Calculators: ['с формулой', 'с примерами', 'пошагово'],
    YouTube: ['для авторов', 'для видео', 'с URL YouTube'],
  },
  ar: {
    PDF: ['مع عدة ملفات', 'للمستندات', 'للطباعة'],
    Image: ['للصور', 'لوسائل التواصل الاجتماعي', 'بدون فقدان الجودة'],
    Compiler: ['في المتصفح', 'للمبتدئين', 'مع مثال برمجي'],
    Developer: ['للمطورين', 'مع مثال', 'لتطوير API'],
    Text: ['للمقالات', 'للمستندات', 'للطلاب'],
    Converters: ['مع الصيغة', 'مع أمثلة', 'بين الوحدات'],
    Finance: ['مع الصيغة', 'مع أمثلة', 'حساب شهري'],
    Calculators: ['مع الصيغة', 'مع أمثلة', 'خطوة بخطوة'],
    YouTube: ['لمنشئي المحتوى', 'للفيديوهات', 'باستخدام رابط YouTube'],
  },
  hi: {
    PDF: ['कई फाइलों के साथ', 'डॉक्यूमेंट के लिए', 'प्रिंट करने के लिए'],
    Image: ['फोटो के लिए', 'सोशल मीडिया के लिए', 'क्वालिटी कम किए बिना'],
    Compiler: ['ब्राउज़र में', 'शुरुआती लोगों के लिए', 'कोड उदाहरण के साथ'],
    Developer: ['डेवलपर्स के लिए', 'उदाहरण के साथ', 'API डेवलपमेंट के लिए'],
    Text: ['निबंध के लिए', 'डॉक्यूमेंट के लिए', 'स्टूडेंट्स के लिए'],
    Converters: ['फॉर्मूला के साथ', 'उदाहरण के साथ', 'यूनिट के बीच'],
    Finance: ['फॉर्मूला के साथ', 'उदाहरण के साथ', 'मासिक गणना'],
    Calculators: ['फॉर्मूला के साथ', 'उदाहरण के साथ', 'स्टेप बाय स्टेप'],
    YouTube: ['क्रिएटर्स के लिए', 'वीडियो के लिए', 'YouTube URL के साथ'],
  },
};

export function getLongTailQueryCandidates(tool: ToolMeta, locale: LocaleCode): string[] {
  const localName = getLocalizedToolName(tool, locale);
  const englishName = tool.targetKeyword || tool.name;
  const bases = Array.from(new Set([localName, englishName]));
  const patterns = LONG_TAIL_QUERY_PATTERNS[locale];
  const modifierTail = SEARCH_QUERY_MODIFIERS[locale].filter((m) => m !== 'online' && m !== 'free online');
  const category = tool.category;

  const relevantPatterns = Array.from(new Set([
    ...patterns,
    ...(CATEGORY_LONG_TAIL_PATTERNS[locale][category] || []),
  ]));
  const formatPatterns = category === 'PDF' || category === 'Image' ? ['PDF', 'JPG', 'PNG'] : [];

  return Array.from(new Set([
    ...bases.flatMap((base) => relevantPatterns.map((pattern) => `${base} ${pattern}`)),
    ...bases.flatMap((base) => modifierTail.map((modifier) => `${base} ${modifier} online`)),
    ...bases.flatMap((base) => formatPatterns.map((format) => `${base} ${format}`)),
  ]));
}
export function getLocalizedUi(locale: LocaleCode): LocalizedUi {
  return LOCALIZED_UI[locale];
}

/**
 * Builds search-query candidates rather than assuming a literal translation
 * is the term users actually search. Candidates deliberately include local
 * language, English technical wording, and local "online/free" modifiers.
 * These must be validated against SERPs/keyword data before becoming primary.
 */
export function getSearchQueryCandidates(tool: ToolMeta, locale: LocaleCode): string[] {
  const localName = getLocalizedToolName(tool, locale);
  const baseTerms = Array.from(new Set([localName, tool.targetKeyword || tool.name]));
  const modifiers = SEARCH_QUERY_MODIFIERS[locale];
  return Array.from(new Set([
    ...baseTerms,
    ...baseTerms.flatMap((term) => modifiers.map((modifier) => `${term} ${modifier}`)),
    ...modifiers.map((modifier) => `${modifier} ${localName}`),
  ]));
}
