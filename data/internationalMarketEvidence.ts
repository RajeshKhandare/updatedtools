export interface InternationalMarketEvidence {
  locale: string;
  market: string;
  sourceUrls: string[];
  observedTerms: string[];
  notes: string;
}

/**
 * Current localized tool catalogs used to validate market-level search vocabulary.
 * These sources establish observed terminology and tool intent, not search volume.
 */
export const INTERNATIONAL_MARKET_EVIDENCE: readonly InternationalMarketEvidence[] = [
  {
    locale: 'pt-BR',
    market: 'Brazil',
    sourceUrls: ['https://www.webfacilita.com/', 'https://andev.app/pt/'],
    observedTerms: ['Juntar PDF', 'Comprimir Imagem', 'Contador de Palavras', 'Gerador de QR Code', 'Formatador de JSON'],
    notes: 'Brazilian Portuguese catalogs use natural task wording such as “juntar”, and also explicitly frame tools as online/free.',
  },
  {
    locale: 'es',
    market: 'Spanish-speaking markets',
    sourceUrls: ['https://andev.app/es/', 'https://toolanchor.com/es'],
    observedTerms: ['Unir PDF', 'Comprimir imagen', 'Contador de palabras', 'Generador de códigos QR', 'Formateador de JSON'],
    notes: 'Spanish catalogs use task-oriented local wording; country-specific Spanish should still be validated before regional expansion.',
  },
  {
    locale: 'de',
    market: 'Germany / DACH',
    sourceUrls: ['https://www.pageonaut.com/de/', 'https://www.pageonaut.com/de/tools'],
    observedTerms: ['PDF zusammenfügen', 'Bild komprimieren', 'Wörterzähler', 'QR-Code-Generator', 'JSON formatieren', 'Prozentrechner'],
    notes: 'German catalogs favor compact native compounds and action phrases rather than literal English translations.',
  },
  {
    locale: 'fr',
    market: 'France / Francophone markets',
    sourceUrls: ['https://experttoolskit.com/fr/', 'https://www.llamapdf.com/fr', 'https://outily.fr/'],
    observedTerms: ['Compteur de mots', 'Compresser une image', 'Fusionner des PDF', 'Formater du JSON', 'Calcul de l’IMC'],
    notes: 'French catalogs consistently use task-oriented noun/verb phrases; France-specific wording should be retained for the first rollout.',
  },
  {
    locale: 'it',
    market: 'Italy',
    sourceUrls: ['https://www.ilovepdf.com/it', 'https://www.ilovepdf.com/it/aiuto/documentazione'],
    observedTerms: ['Unisci PDF', 'Dividere PDF', 'Comprimi PDF', 'PDF in Word', 'JPG a PDF'],
    notes: 'Italian PDF terminology uses “unisci/unire”, “dividere”, “comprimi/comprimere” and common format names.',
  },
  {
    locale: 'ja',
    market: 'Japan',
    sourceUrls: ['https://uselocaltools.com/ja'],
    observedTerms: ['JSONの整形', '文字数カウント', 'テキスト比較', '単位変換', '画像圧縮', 'PDF結合'],
    notes: 'Japanese tool catalogs commonly use compact task phrases and omit spaces in Japanese queries; spacing variants should be tested.',
  },
  {
    locale: 'ko',
    market: 'South Korea',
    sourceUrls: ['https://www.oneclicktool.kr/'],
    observedTerms: ['이미지 용량 줄이기', 'PDF 합치기', '글자 수 세기', '이미지 크기 조절', 'JSON 포맷터', 'QR 코드 생성기'],
    notes: 'Korean catalogs show native task phrases alongside English technical labels such as JSON; both forms should be considered.',
  },
  {
    locale: 'zh-CN',
    market: 'Simplified Chinese',
    sourceUrls: ['https://www.ilovepdf.com/zh-cn', 'https://www.ilovepdf.com/zh-cn/help/documentation'],
    observedTerms: ['合并PDF', '拆分PDF', '压缩PDF', 'PDF转JPG', '图片转换至PDF文件', '添加页码'],
    notes: 'Simplified Chinese PDF terminology is compact and task-oriented; PDF/format tokens remain in Latin script.',
  },
  {
    locale: 'ru',
    market: 'Russian-speaking markets',
    sourceUrls: ['https://textwonder.com/ru/', 'https://usetoolz.ru/'],
    observedTerms: ['Счётчик слов', 'Объединить PDF', 'Сжать изображение', 'Форматирование JSON', 'Калькулятор ИМТ', 'Калькулятор возраста'],
    notes: 'Russian catalogs use native Cyrillic task phrases while technical formats such as JSON and PDF remain unchanged.',
  },
  {
    locale: 'ar',
    market: 'Arabic-speaking markets',
    sourceUrls: ['https://adawix.com/', 'https://experttoolskit.com/ar/'],
    observedTerms: ['عداد الكلمات', 'ضغط الصور', 'دمج PDF', 'منسق JSON', 'مولد رمز QR', 'حاسبة مؤشر كتلة الجسم'],
    notes: 'Arabic catalogs use native task wording and retain technical tokens such as PDF, JSON and QR; country-specific variants remain a separate validation step.',
  },
  {
    locale: 'hi',
    market: 'India',
    sourceUrls: ['https://fastols.com/hi/'],
    observedTerms: ['PDF फ़ाइलें मर्ज करें', 'PDF कंप्रेस करें', 'इमेज कंप्रेस करें', 'इमेज का आकार बदलें', 'JSON फ़ॉर्मेटर', 'वर्ड काउंटर', 'BMI कैलकुलेटर'],
    notes: 'Hindi tool catalogs frequently mix Hindi grammar with English technical terms; Hinglish and English-token variants should be retained in query candidates.',
  },
];
