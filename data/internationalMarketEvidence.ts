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
    observedTerms: ['Juntar PDF', 'Comprimir Imagem', 'Contador de Palavras', 'Gerador de QR Code', 'Formatador de JSON', 'Dividir PDF', 'Comprimir PDF', 'PDF para Word', 'PDF para JPG', 'JPG para PDF', 'Proteger PDF', 'Desbloquear PDF', 'Girar PDF', 'Adicionar números de página', 'Calculadora de porcentagem'],
    notes: 'Brazilian Portuguese catalogs use natural task wording such as “juntar”, and also explicitly frame tools as online/free.',
  },
  {
    locale: 'es',
    market: 'Spanish-speaking markets',
    sourceUrls: ['https://andev.app/es/', 'https://toolanchor.com/es'],
    observedTerms: ['Unir PDF', 'Comprimir imagen', 'Contador de palabras', 'Generador de códigos QR', 'Formateador de JSON', 'Dividir PDF', 'Comprimir PDF', 'PDF a Word', 'PDF a JPG', 'JPG a PDF', 'Proteger PDF', 'Desbloquear PDF', 'Rotar PDF', 'Añadir números de página'],
    notes: 'Spanish catalogs use task-oriented local wording; country-specific Spanish should still be validated before regional expansion.',
  },
  {
    locale: 'de',
    market: 'Germany / DACH',
    sourceUrls: ['https://www.pageonaut.com/de/', 'https://www.pageonaut.com/de/tools'],
    observedTerms: ['PDF zusammenfügen', 'Bild komprimieren', 'Wörterzähler', 'QR-Code-Generator', 'JSON formatieren', 'Prozentrechner', 'PDF teilen', 'PDF komprimieren', 'PDF in Word', 'PDF in JPG', 'JPG in PDF', 'PDF schützen', 'PDF entsperren', 'PDF drehen', 'Seitenzahlen hinzufügen', 'Bildgröße ändern', 'Bild zuschneiden'],
    notes: 'German catalogs favor compact native compounds and action phrases rather than literal English translations.',
  },
  {
    locale: 'fr',
    market: 'France / Francophone markets',
    sourceUrls: ['https://experttoolskit.com/fr/', 'https://www.llamapdf.com/fr', 'https://outily.fr/'],
    observedTerms: ['Compteur de mots', 'Compresser une image', 'Fusionner des PDF', 'Formater du JSON', 'Calcul de l’IMC', 'Fusionner PDF', 'Diviser PDF', 'Compresser PDF', 'PDF en Word', 'PDF en JPG', 'JPG en PDF', 'Protéger PDF', 'Déverrouiller PDF', 'Rotation PDF', 'Numéros de pages'],
    notes: 'French catalogs consistently use task-oriented noun/verb phrases; France-specific wording should be retained for the first rollout.',
  },
  {
    locale: 'it',
    market: 'Italy',
    sourceUrls: ['https://www.ilovepdf.com/it', 'https://www.ilovepdf.com/it/aiuto/documentazione'],
    observedTerms: ['Unisci PDF', 'Dividere PDF', 'Comprimi PDF', 'PDF in Word', 'JPG a PDF', 'Unire PDF', 'Comprimere PDF', 'PDF in JPG', 'JPG in PDF', 'Proteggere PDF', 'Sbloccare PDF', 'Ruotare PDF', 'Numerare PDF'],
    notes: 'Italian PDF terminology uses “unisci/unire”, “dividere”, “comprimi/comprimere” and common format names.',
  },
  {
    locale: 'ja',
    market: 'Japan',
    sourceUrls: ['https://uselocaltools.com/ja'],
    observedTerms: ['JSONの整形', '文字数カウント', 'テキスト比較', '単位変換', '画像圧縮', 'PDF結合', 'PDFを結合', 'PDFを分割', 'PDF圧縮', 'PDFからWord', 'PDFからJPG', 'JPGからPDF', 'PDF保護', 'PDFロック解除', 'PDF回転', 'ページ番号', 'JSONフォーマッター', 'Base64 エンコード・デコード', 'UUIDジェネレーター', 'ランダムパスワード生成ツール'],
    notes: 'Japanese tool catalogs commonly use compact task phrases and omit spaces in Japanese queries; spacing variants should be tested.',
  },
  {
    locale: 'ko',
    market: 'South Korea',
    sourceUrls: ['https://www.oneclicktool.kr/'],
    observedTerms: ['이미지 용량 줄이기', 'PDF 합치기', '글자 수 세기', '이미지 크기 조절', 'JSON 포맷터', 'QR 코드 생성기', 'PDF 분할', 'PDF 압축', 'PDF 이미지 변환', 'PDF Word 변환'],
    notes: 'Korean catalogs show native task phrases alongside English technical labels such as JSON; both forms should be considered.',
  },
  {
    locale: 'zh-CN',
    market: 'Simplified Chinese',
    sourceUrls: ['https://www.ilovepdf.com/zh-cn', 'https://www.ilovepdf.com/zh-cn/help/documentation'],
    observedTerms: ['合并PDF', '拆分PDF', '压缩PDF', 'PDF转JPG', '图片转换至PDF文件', '添加页码', 'PDF转Word', 'Word转PDF', 'JPG转PDF', 'PDF页面排序', '删除PDF页面', 'PDF旋转', '压缩图片', '裁剪图片', '调整图片大小'],
    notes: 'Simplified Chinese PDF terminology is compact and task-oriented; PDF/format tokens remain in Latin script.',
  },
  {
    locale: 'ru',
    market: 'Russian-speaking markets',
    sourceUrls: ['https://textwonder.com/ru/', 'https://usetoolz.ru/'],
    observedTerms: ['Счётчик слов', 'Объединить PDF', 'Сжать изображение', 'Форматирование JSON', 'Калькулятор ИМТ', 'Калькулятор возраста', 'Разделить PDF', 'Сжать PDF', 'PDF в JPG', 'PDF в Word', 'Word в PDF', 'JPG в PDF', 'Удалить страницы', 'Повернуть PDF', 'Добавить номера страниц', 'Изменить размер изображения'],
    notes: 'Russian catalogs use native Cyrillic task phrases while technical formats such as JSON and PDF remain unchanged.',
  },
  {
    locale: 'ar',
    market: 'Arabic-speaking markets',
    sourceUrls: ['https://adawix.com/', 'https://experttoolskit.com/ar/'],
    observedTerms: ['عداد الكلمات', 'ضغط الصور', 'دمج PDF', 'منسق JSON', 'مولد رمز QR', 'حاسبة مؤشر كتلة الجسم', 'تقسيم PDF', 'ضغط PDF', 'PDF إلى Word', 'PDF إلى JPG', 'Word إلى PDF', 'JPG إلى PDF', 'حماية PDF', 'فك حماية PDF', 'تدوير PDF', 'تغيير حجم الصورة'],
    notes: 'Arabic catalogs use native task wording and retain technical tokens such as PDF, JSON and QR; country-specific variants remain a separate validation step.',
  },
  {
    locale: 'hi',
    market: 'India',
    sourceUrls: ['https://fastols.com/hi/'],
    observedTerms: ['PDF फ़ाइलें मर्ज करें', 'PDF कंप्रेस करें', 'इमेज कंप्रेस करें', 'इमेज का आकार बदलें', 'JSON फ़ॉर्मेटर', 'वर्ड काउंटर', 'BMI कैलकुलेटर', 'PDF मर्ज करें', 'PDF विभाजित करें', 'PDF से JPG', 'PDF से Word', 'Word से PDF', 'JPG से PDF', 'PDF को सुरक्षित करें', 'PDF अनलॉक करें', 'PDF घुमाएँ', 'QR कोड जनरेटर'],
    notes: 'Hindi tool catalogs frequently mix Hindi grammar with English technical terms; Hinglish and English-token variants should be retained in query candidates.',
  },
];
