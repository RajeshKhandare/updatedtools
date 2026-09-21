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
    sourceUrls: ['https://www.webfacilita.com/', 'https://andev.app/pt/', 'https://makeitpdf.com/pt/', 'https://uselocaltools.com/pt-BR'],
    observedTerms: ['Juntar PDF', 'Comprimir Imagem', 'Contador de Palavras', 'Gerador de QR Code', 'Formatador de JSON', 'Dividir PDF', 'Comprimir PDF', 'PDF para Word', 'PDF para JPG', 'JPG para PDF', 'Proteger PDF', 'Desbloquear PDF', 'Girar PDF', 'Adicionar números de página', 'Calculadora de porcentagem', 'Calculadora de idade', 'Calculadora de IMC', 'Calculadora de desconto', 'Calculadora de gorjeta', 'Calculadora de juros compostos', 'Calculadora de salário',
    notes: 'Brazilian Portuguese catalogs use natural task wording such as “juntar”, and also explicitly frame tools as online/free.',
  },
  {
    locale: 'es',
    market: 'Spanish-speaking markets',
    sourceUrls: ['https://andev.app/es/', 'https://toolanchor.com/es', 'https://uselocaltools.com/es', 'https://makeitpdf.com/es/', 'https://littletoolbox.online/es/', 'https://funnytools.win/es/herramientas/', 'https://fahaq.com/es', 'https://tulzy.net/es'],
    observedTerms: ['Unir PDF', 'Comprimir imagen', 'Contador de palabras', 'Generador de códigos QR', 'Formateador de JSON', 'Dividir PDF', 'Comprimir PDF', 'PDF a Word', 'PDF a JPG', 'JPG a PDF', 'Proteger PDF', 'Desbloquear PDF', 'Rotar PDF', 'Añadir números de página', 'Formateador JSON online', 'Codificador y decodificador Base64', 'Generador de UUID', 'Generador de contraseñas', 'Decodificador JWT', 'Comparador de textos', 'Convertidor de mayúsculas y minúsculas', 'Convertidor timestamp Unix', 'Calculadora de porcentajes', 'Conversor de unidades', 'Comprimir imagen', 'Unir PDF', 'Invertir texto', 'Eliminar líneas duplicadas', 'Ordenar líneas de texto'],
    notes: 'Spanish catalogs use task-oriented local wording; country-specific Spanish should still be validated before regional expansion.',
  },
  {
    locale: 'de',
    market: 'Germany / DACH',
    sourceUrls: ['https://www.pageonaut.com/de/', 'https://www.pageonaut.com/de/tools', 'https://makeitpdf.com/de/', 'https://onejobkit.com/de'],
    observedTerms: ['PDF zusammenfügen', 'Bild komprimieren', 'Wörterzähler', 'QR-Code-Generator', 'JSON formatieren', 'Prozentrechner', 'PDF teilen', 'PDF komprimieren', 'PDF in Word', 'PDF in JPG', 'JPG in PDF', 'PDF schützen', 'PDF entsperren', 'PDF drehen', 'Seitenzahlen hinzufügen', 'Bildgröße ändern', 'Bild zuschneiden', 'JSON-Formatierer', 'Base64 kodieren / dekodieren', 'URL kodieren / dekodieren', 'JWT-Decoder', 'UUID-Generator', 'Passwort-Generator', 'Groß-/Kleinschreibung umwandeln', 'Wörter und Zeichen zählen', 'Doppelte Zeilen entfernen', 'Zeilen sortieren', 'Slug erzeugen', 'Einheiten-Umrechner', 'Temperatur-Umrechner', 'BMI-Rechner'],
    notes: 'German catalogs favor compact native compounds and action phrases rather than literal English translations.',
  },
  {
    locale: 'fr',
    market: 'France / Francophone markets',
    sourceUrls: ['https://experttoolskit.com/fr/', 'https://www.llamapdf.com/fr', 'https://outily.fr/', 'https://makeitpdf.com/fr/'],
    observedTerms: ['Compteur de mots', 'Compresser une image', 'Fusionner des PDF', 'Formater du JSON', 'Calcul de l’IMC', 'Fusionner PDF', 'Diviser PDF', 'Compresser PDF', 'PDF en Word', 'PDF en JPG', 'JPG en PDF', 'Protéger PDF', 'Déverrouiller PDF', 'Rotation PDF', 'Numéros de pages', 'Formatage JSON', 'Encodage Base64', 'Convertisseur de casse', 'Comptage de mots', 'Compresser Image', 'Redimensionner une image', 'Rogner une image', 'Comparaison de textes', 'Calculatrice âge', 'Calculatrice de pourcentage', 'Générateur de mots de passe', 'Générateur d’UUID', 'Décodeur JWT'],
    notes: 'French catalogs consistently use task-oriented noun/verb phrases; France-specific wording should be retained for the first rollout.',
  },
  {
    locale: 'it',
    market: 'Italy',
    sourceUrls: ['https://www.ilovepdf.com/it', 'https://www.ilovepdf.com/it/aiuto/documentazione', 'https://makeitpdf.com/it/', 'https://quaestio.app/it/', 'https://vai.la/it/tools'],
    observedTerms: ['Unisci PDF', 'Dividere PDF', 'Comprimi PDF', 'PDF in Word', 'JPG a PDF', 'Unire PDF', 'Comprimere PDF', 'PDF in JPG', 'JPG in PDF', 'Proteggere PDF', 'Sbloccare PDF', 'Ruotare PDF', 'Numerare PDF'],
    notes: 'Italian PDF terminology uses “unisci/unire”, “dividere”, “comprimi/comprimere” and common format names.',
  },
  {
    locale: 'ja',
    market: 'Japan',
    sourceUrls: ['https://uselocaltools.com/ja', 'https://www.ilovepdf.com/ja'],
    observedTerms: ['JSONの整形', '文字数カウント', 'テキスト比較', '単位変換', '画像圧縮', 'PDF結合', 'PDFを結合', 'PDFを分割', 'PDF圧縮', 'PDFからWord', 'PDFからJPG', 'JPGからPDF', 'PDF保護', 'PDFロック解除', 'PDF回転', 'ページ番号', 'JSONフォーマッター', 'Base64 エンコード・デコード', 'UUIDジェネレーター', 'ランダムパスワード生成ツール'],
    notes: 'Japanese tool catalogs commonly use compact task phrases and omit spaces in Japanese queries; spacing variants should be tested.',
  },
  {
    locale: 'ko',
    market: 'South Korea',
    sourceUrls: ['https://www.oneclicktool.kr/', 'https://veryeasypdf.com/ko', 'https://dikr.co.kr/tools/'],
    observedTerms: ['이미지 용량 줄이기', 'PDF 합치기', '글자 수 세기', '이미지 크기 조절', 'JSON 포맷터', 'QR 코드 생성기', 'PDF 분할', 'PDF 압축', 'PDF 이미지 변환', 'PDF Word 변환', 'JSON 포맷터', 'Base64 인코더/디코더', 'URL 인코더/디코더', 'UUID 생성기', '비밀번호 생성기', 'JWT 디코더', '단어 수 세기', '텍스트 비교', '대소문자 변환', '이미지 압축', '이미지 크기 조절', '백분율 계산기', '나이 계산기', 'BMI 계산기'],
    notes: 'Korean catalogs show native task phrases alongside English technical labels such as JSON; both forms should be considered.',
  },
  {
    locale: 'zh-CN',
    market: 'Simplified Chinese',
    sourceUrls: ['https://www.ilovepdf.com/zh-cn', 'https://www.ilovepdf.com/zh-cn/help/documentation', 'https://www.zhandu.cn/', 'https://nbtools.cn/', 'https://xiaobinguo.cn/'],
    observedTerms: ['合并PDF', '拆分PDF', '压缩PDF', 'PDF转JPG', '图片转换至PDF文件', '添加页码', 'PDF转Word', 'Word转PDF', 'JPG转PDF', 'PDF页面排序', '删除PDF页面', 'PDF旋转', '压缩图片', '裁剪图片', '调整图片大小', 'JSON格式化', 'Base64编解码', 'UUID生成器', '随机密码生成器', 'JWT解码器', '字数统计', '百分比计算器', '年龄计算器', 'BMI计算器', '折扣计算器', '复利计算器', '单位转换器', '文本/代码对比', '大小写转换', '时间戳转换', '图片压缩', '二维码生成', '百分比计算'],
    notes: 'Simplified Chinese PDF terminology is compact and task-oriented; PDF/format tokens remain in Latin script.',
  },
  {
    locale: 'ru',
    market: 'Russian-speaking markets',
    sourceUrls: ['https://textwonder.com/ru/', 'https://usetoolz.ru/', 'https://www.ilovepdf.com/ru', 'https://utilora.ru/'],
    observedTerms: ['Счётчик слов', 'Калькулятор процентов', 'Калькулятор возраста', 'Калькулятор ИМТ', 'Калькулятор скидки', 'Калькулятор сложного процента', 'Объединить PDF', 'Сжать изображение', 'Форматирование JSON', 'Калькулятор ИМТ', 'Калькулятор возраста', 'Разделить PDF', 'JSON Formatter', 'Base64 Кодер / Декодер', 'Генератор UUID', 'Генератор паролей', 'Счётчик символов', 'Конвертер регистра', 'Удаление дубликатов', 'Сжатие фотографий', 'Изменение разрешения'], 'Сжать PDF', 'PDF в JPG', 'PDF в Word', 'Word в PDF', 'JPG в PDF', 'Удалить страницы', 'Повернуть PDF', 'Добавить номера страниц', 'Изменить размер изображения', 'Нижний регистр', 'Счётчик символов', 'Сравнить два текста', 'Форматирование JSON', 'Генератор паролей', 'Конвертировать изображение', 'Калькулятор процентов'],
    notes: 'Russian catalogs use native Cyrillic task phrases while technical formats such as JSON and PDF remain unchanged.',
  },
  {
    locale: 'ar',
    market: 'Arabic-speaking markets',
    sourceUrls: ['https://adawix.com/', 'https://experttoolskit.com/ar/', 'https://www.ilovepdf.com/ar', 'https://logicutil.com/ar/', 'https://www.muhawil.com/', 'https://arabtoolbox.com/tools'],
    observedTerms: ['عداد الكلمات', 'ضغط الصور', 'دمج PDF', 'منسق JSON', 'مولد رمز QR', 'حاسبة مؤشر كتلة الجسم', 'تقسيم PDF', 'ضغط PDF', 'PDF إلى Word', 'PDF إلى JPG', 'Word إلى PDF', 'JPG إلى PDF', 'حماية PDF', 'فك حماية PDF', 'تدوير PDF', 'تغيير حجم الصورة'],
    notes: 'Arabic catalogs use native task wording and retain technical tokens such as PDF, JSON and QR; country-specific variants remain a separate validation step.',
  },
  {
    locale: 'hi',
    market: 'India',
    sourceUrls: ['https://fastols.com/hi/', 'https://www.ilovepdf.com/hi', 'https://convertforever.com/hi/', 'https://hoomaninfotech.com/hi/tools', 'https://utilokit.com/hi'],
    observedTerms: ['PDF फ़ाइलें मर्ज करें', 'PDF कंप्रेस करें', 'इमेज कंप्रेस करें', 'इमेज का आकार बदलें', 'JSON फ़ॉर्मेटर', 'वर्ड काउंटर', 'प्रतिशत कैलकुलेटर', 'उम्र कैलकुलेटर', 'BMI कैलकुलेटर', 'डिस्काउंट कैलकुलेटर', 'GST कैलकुलेटर', 'सैलरी कैलकुलेटर', 'BMI कैलकुलेटर', 'PDF मर्ज करें', 'PDF विभाजित करें', 'PDF से JPG', 'PDF से Word', 'Word से PDF', 'JPG से PDF', 'PDF को सुरक्षित करें', 'PDF अनलॉक करें', 'PDF घुमाएँ', 'QR कोड जनरेटर', 'JSON फ़ॉर्मेटर', 'Base64 एनकोडर', 'UUID जनरेटर', 'पासवर्ड जनरेटर', 'JWT डिकोडर', 'डिफ चेकर', 'केस कन्वर्टर', 'लोन कैलकुलेटर', 'प्रतिशत कैलकुलेटर', 'आयु कैलकुलेटर', 'वर्ड काउंटर', 'इमेज क्रॉप करें', 'इमेज फ़ॉर्मेट बदलें', 'इमेज ब्लर करें', 'इमेज फ्लिप करें'],
    notes: 'Hindi tool catalogs frequently mix Hindi grammar with English technical terms; Hinglish and English-token variants should be retained in query candidates.',
  },
];
