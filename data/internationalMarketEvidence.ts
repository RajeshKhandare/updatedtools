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
    sourceUrls: ['https://www.webfacilita.com/', 'https://andev.app/pt/', 'https://makeitpdf.com/pt/', 'https://uselocaltools.com/pt-BR', 'https://codecrush.com.br/ferramentas/formatador-json', 'https://iotools.cloud/pt/'],
    observedTerms: ['Juntar PDF', 'Comprimir Imagem', 'Contador de Palavras', 'Gerador de QR Code', 'Formatador de JSON', 'Dividir PDF', 'Comprimir PDF', 'PDF para Word', 'PDF para JPG', 'JPG para PDF', 'Proteger PDF', 'Desbloquear PDF', 'Girar PDF', 'Adicionar números de página', 'Calculadora de porcentagem', 'Calculadora de idade', 'Calculadora de IMC', 'Calculadora de desconto', 'Calculadora de gorjeta', 'Calculadora de juros compostos', 'Calculadora de salário', 'Formatador e Validador JSON Online', 'Codificador e decodificador Base64', 'Codificador de URL e decodificador', 'Codificador e decodificador de entidades HTML', 'Minificador CSS', 'Conversor de Maiúsculas/Minúsculas', 'Redimensionador de imagens', 'Otimizador de Imagem', 'Gerador de Paleta de Cores'],
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
    sourceUrls: ['https://www.pageonaut.com/de/', 'https://www.pageonaut.com/de/tools', 'https://makeitpdf.com/de/', 'https://onejobkit.com/de', 'https://de.vivoldi.com/tools/', 'https://turboutilkit.com/de/jsonformatter/'],
    observedTerms: ['PDF zusammenfügen', 'Bild komprimieren', 'Wörterzähler', 'QR-Code-Generator', 'JSON formatieren', 'Prozentrechner', 'PDF teilen', 'PDF komprimieren', 'PDF in Word', 'PDF in JPG', 'JPG in PDF', 'PDF schützen', 'PDF entsperren', 'PDF drehen', 'Seitenzahlen hinzufügen', 'Bildgröße ändern', 'Bild zuschneiden', 'JSON-Formatierer', 'Base64 kodieren / dekodieren', 'URL kodieren / dekodieren', 'JWT-Decoder', 'UUID-Generator', 'Passwort-Generator', 'Groß-/Kleinschreibung umwandeln', 'Wörter und Zeichen zählen', 'Doppelte Zeilen entfernen', 'Zeilen sortieren', 'Slug erzeugen', 'Einheiten-Umrechner', 'Temperatur-Umrechner', 'BMI-Rechner', 'YouTube-Thumbnail', 'JSON-Formatter', 'URL De-/Encoder', 'Base64 De/Encoder', 'User Agent Check', 'Zeichenzähler', 'WebP-Konverter', 'Bildgröße ändern'],
    notes: 'German catalogs favor compact native compounds and action phrases rather than literal English translations.',
  },
  {
    locale: 'fr',
    market: 'France / Francophone markets',
    sourceUrls: ['https://experttoolskit.com/fr/', 'https://www.llamapdf.com/fr', 'https://outily.fr/', 'https://makeitpdf.com/fr/', 'https://experttoolskit.com/fr/tools/'],
    observedTerms: ['Compteur de mots', 'Compresser une image', 'Fusionner des PDF', 'Formater du JSON', 'Calcul de l’IMC', 'Fusionner PDF', 'Diviser PDF', 'Compresser PDF', 'PDF en Word', 'PDF en JPG', 'JPG en PDF', 'Protéger PDF', 'Déverrouiller PDF', 'Rotation PDF', 'Numéros de pages', 'Formatage JSON', 'Encodage Base64', 'Convertisseur de casse', 'Comptage de mots', 'Compresser Image', 'Redimensionner une image', 'Rogner une image', 'Comparaison de textes', 'Calculatrice âge', 'Calculatrice de pourcentage', 'Générateur de mots de passe', 'Générateur d’UUID', 'Décodeur JWT', 'Générateur de slug', 'Minificateur de code', 'Encoder les entités HTML', 'Générateur d’UUID', 'Générateur de mots de passe', 'Encoder une URL', 'Horodatage Unix', 'Convertisseur de couleurs', 'Convertir une image', 'SVG en PNG', 'Flouter une image', 'Générateur de palettes', 'Générateur de QR code', 'Changer la casse', 'Supprimer les doublons', 'Générateur de faux texte', 'Éditeur Markdown', 'Comparer deux textes', 'Compresser un PDF', 'Diviser un PDF', 'PDF en JPG', 'JPG en PDF', 'Supprimer des pages PDF', 'Miniature YouTube', 'Convertisseur d’unités', 'Calcul de pourcentage', 'Calcul d’âge', 'Calculateur d’intérêts composés', 'Calculateur de retraite', 'Calculateur de pourboire'],
    notes: 'French catalogs consistently use task-oriented noun/verb phrases; France-specific wording should be retained for the first rollout.',
  },
  {
    locale: 'it',
    market: 'Italy',
    sourceUrls: ['https://www.ilovepdf.com/it', 'https://www.ilovepdf.com/it/aiuto/documentazione', 'https://makeitpdf.com/it/', 'https://quaestio.app/it/', 'https://vai.la/it/tools', 'https://uselocaltools.com/it'],
    observedTerms: ['Unisci PDF', 'Dividi PDF', 'Dividere PDF', 'Comprimi PDF', 'Comprimere PDF', 'PDF in Word', 'PDF in JPG', 'JPG in PDF', 'Word in PDF', 'Proteggi PDF', 'Proteggere PDF', 'Sblocca PDF', 'Sbloccare PDF', 'Ruota PDF', 'Ruotare PDF', 'Numerare PDF', 'Formatta JSON', 'Formattatore JSON online', 'Encoder e decoder Base64', 'Codificatore e decodificatore URL', 'Codificatore e decodificatore HTML', 'Generatore di UUID', 'Generatore di password casuali', 'Decodificatore JWT', 'Generatore di codici QR', 'Contatore di parole', 'Confronta due testi online', 'Convertitore maiuscole e minuscole', 'Convertitore di timestamp Unix', 'Calcolatore di percentuali', 'Compressore di immagini', 'Ridimensionatore di immagini', 'Calcolatore di età', 'Calcolatore di IMC', 'Calcolatore di sconti', 'Calcolatore di interessi composti'],
    notes: 'Italian PDF terminology uses “unisci/unire”, “dividere”, “comprimi/comprimere” and common format names.',
  },
  {
    locale: 'ja',
    market: 'Japan',
    sourceUrls: ['https://uselocaltools.com/ja', 'https://uselocaltools.com/ja/tools/json-formatter', 'https://uselocaltools.com/ja/tools/word-counter', 'https://uselocaltools.com/ja/tools/merge-pdf', 'https://www.ilovepdf.com/ja'],
    observedTerms: ['JSONの整形', 'JSONフォーマッター', '文字数カウント', '単語数カウンター', 'テキスト比較', '大文字・小文字変換', '単位変換', '摂氏・華氏変換', '画像圧縮', '画像のサイズ変更', '画像をトリミング', 'PDF結合', 'PDFを結合', 'PDFを分割', 'PDF圧縮', 'PDFからWord', 'PDFからJPG', 'JPGからPDF', 'PDF保護', 'PDFロック解除', 'PDF回転', 'ページ番号', 'Base64 エンコード・デコード', 'UUIDジェネレーター', 'ランダムパスワード生成ツール', 'JWTデコーダー', 'QRコード作成', 'パーセント計算機', '年齢計算機', 'BMI計算機', '割引計算機', '複利計算機', 'Unixタイムスタンプ変換'],
    notes: 'Japanese tool catalogs commonly use compact task phrases and omit spaces in Japanese queries; spacing variants should be tested.',
  },
  {
    locale: 'ko',
    market: 'South Korea',
    sourceUrls: ['https://www.oneclicktool.kr/', 'https://veryeasypdf.com/ko', 'https://dikr.co.kr/tools/'],
    observedTerms: ['이미지 용량 줄이기', 'PDF 합치기', 'PDF 병합', '글자 수 세기', '단어 수 세기', '이미지 크기 조절', 'JSON 포맷터', 'JSON 검증', 'QR 코드 생성기', 'PDF 분할', 'PDF 압축', 'PDF 이미지 변환', 'PDF Word 변환', '이미지 PDF 변환', 'Base64 인코더/디코더', 'URL 인코더/디코더', 'UUID 생성기', '비밀번호 생성기', 'JWT 디코더', '텍스트 비교', '대소문자 변환', '이미지 압축', '백분율 계산기', '나이 계산기', 'BMI 계산기'],
    notes: 'Korean catalogs show native task phrases alongside English technical labels such as JSON; both forms should be considered.',
  },
  {
    locale: 'zh-CN',
    market: 'Simplified Chinese',
    sourceUrls: ['https://www.ilovepdf.com/zh-cn', 'https://www.ilovepdf.com/zh-cn/help/documentation', 'https://www.zhandu.cn/', 'https://www.zhandu.cn/tool/pdf-tools', 'https://nbtools.cn/', 'https://xiaobinguo.cn/'],
    observedTerms: ['合并PDF', 'PDF合并', 'PDF拆分', '拆分PDF', '压缩PDF', 'PDF转JPG', 'PDF转图片', '图片转换至PDF文件', '图片转PDF', '添加页码', 'PDF转Word', 'Word转PDF', 'JPG转PDF', 'PDF页面排序', '删除PDF页面', 'PDF旋转', '压缩图片', '图片压缩', '裁剪图片', '调整图片大小', 'JSON格式化', 'JSON在线解析', 'Base64编码解码', 'Base64编解码', 'URL编码解码', 'Unix时间戳转换', 'UUID生成器', '随机密码生成器', 'JWT解析解码', 'JWT解码器', '字数统计', '文本对比', '文本替换', '大小写转换', '百分比计算器', '年龄计算器', 'BMI计算器', '折扣计算器', '复利计算器', '单位转换器', '在线Python编译器', '在线JavaScript编辑器', '在线Java编译器', '在线C++编译器', '在线C#编译器', '在线PHP运行器', '在线SQL编辑器', 'YouTube缩略图下载器', 'YouTube标签生成器', 'YouTube收益计算器', '二维码生成'],
    notes: 'Simplified Chinese PDF terminology is compact and task-oriented; PDF/format tokens remain in Latin script.',
  },
  {
    locale: 'ru',
    market: 'Russian-speaking markets',
    sourceUrls: ['https://textwonder.com/ru/', 'https://usetoolz.ru/', 'https://www.ilovepdf.com/ru', 'https://utilora.ru/'],
    observedTerms: ['Счётчик слов', 'Счётчик символов', 'Сравнить два текста', 'Удалить дубликаты строк', 'Нижний регистр', 'Объединить PDF', 'Разделить PDF', 'Сжать PDF', 'PDF в JPG', 'PDF в Word', 'Word в PDF', 'JPG в PDF', 'Удалить страницы', 'Повернуть PDF', 'Добавить номера страниц', 'Сжать изображение', 'Изменить размер изображения', 'Конвертировать изображение', 'Форматирование JSON', 'Генератор паролей', 'Калькулятор процентов', 'Калькулятор возраста', 'Калькулятор ИМТ', 'Калькулятор скидки', 'Калькулятор сложного процента', 'Онлайн компилятор Python', 'Онлайн компилятор JavaScript', 'Онлайн компилятор Java', 'Онлайн компилятор C++', 'Онлайн компилятор C#', 'Онлайн компилятор PHP', 'Онлайн редактор SQL', 'Скачать миниатюру YouTube', 'Генератор тегов YouTube', 'Калькулятор доходов YouTube'],
    notes: 'Russian catalogs use native Cyrillic task phrases while technical formats such as JSON and PDF remain unchanged.',
  },
  {
    locale: 'ar',
    market: 'Arabic-speaking markets',
    sourceUrls: ['https://adawix.com/', 'https://experttoolskit.com/ar/', 'https://experttoolskit.com/ar/tools/', 'https://experttoolskit.com/ar/%D8%AA%D9%86%D8%B3%D9%8A%D9%82-json/', 'https://experttoolskit.com/ar/%D8%AF%D9%85%D8%AC-%D9%85%D9%84%D9%81%D8%A7%D8%AA-pdf/', 'https://www.ilovepdf.com/ar'],
    observedTerms: ['عداد الكلمات والحروف', 'تحويل حالة الأحرف', 'مقارنة النصوص', 'إزالة الأسطر المكرّرة', 'ضغط الصور', 'تغيير حجم الصور', 'تحويل صيغ الصور', 'اقتصاص الصور', 'SVG إلى PNG', 'طمس أجزاء من صورة', 'دمج ملفات PDF', 'تقسيم ملفات PDF', 'ضغط ملفات PDF', 'تحويل PDF إلى صور', 'تحويل الصور إلى PDF', 'تدوير صفحات PDF', 'حذف صفحات من PDF', 'ترتيب صفحات PDF', 'ترقيم صفحات PDF', 'PDF إلى نص', 'منسّق JSON', 'تصغير الشيفرة', 'مولّد UUID', 'مولّد كلمات المرور', 'مفكك JWT', 'ترميز وفك ترميز URL', 'مولّد رمز QR', 'حاسبة النسبة المئوية', 'حاسبة العمر', 'حاسبة مؤشر كتلة الجسم', 'حاسبة الفائدة المركبة', 'حاسبة التقاعد', 'محوّل الوحدات', 'تحميل صورة مصغرة من YouTube'],
    notes: 'Arabic catalogs use native task wording and retain technical tokens such as PDF, JSON and QR; country-specific variants remain a separate validation step.',
  },
  {
    locale: 'hi',
    market: 'India',
    sourceUrls: ['https://fastols.com/hi/', 'https://www.ilovepdf.com/hi', 'https://convertforever.com/hi/', 'https://hoomaninfotech.com/hi/tools', 'https://utilokit.com/hi'],
    observedTerms: ['PDF फ़ाइलें मर्ज करें', 'PDF कंप्रेस करें', 'इमेज कंप्रेस करें', 'इमेज का आकार बदलें', 'JSON फ़ॉर्मेटर', 'वर्ड काउंटर', 'प्रतिशत कैलकुलेटर', 'उम्र कैलकुलेटर', 'BMI कैलकुलेटर', 'डिस्काउंट कैलकुलेटर', 'GST कैलकुलेटर', 'सैलरी कैलकुलेटर', 'ऑनलाइन Python कंपाइलर', 'ऑनलाइन JavaScript कंपाइलर', 'ऑनलाइन Java कंपाइलर', 'ऑनलाइन C++ कंपाइलर', 'ऑनलाइन C# कंपाइलर', 'ऑनलाइन PHP कंपाइलर', 'ऑनलाइन SQL एडिटर', 'YouTube थंबनेल डाउनलोडर', 'YouTube टैग जनरेटर', 'YouTube मनी कैलकुलेटर', 'PDF मर्ज करें', 'PDF विभाजित करें', 'PDF से JPG', 'PDF से Word', 'Word से PDF', 'JPG से PDF', 'PDF को सुरक्षित करें', 'PDF अनलॉक करें', 'PDF घुमाएँ', 'QR कोड जनरेटर', 'Base64 एनकोडर', 'UUID जनरेटर', 'पासवर्ड जनरेटर', 'JWT डिकोडर', 'डिफ चेकर', 'केस कन्वर्टर', 'लोन कैलकुलेटर', 'इमेज क्रॉप करें', 'इमेज फ़ॉर्मेट बदलें', 'इमेज ब्लर करें', 'इमेज फ्लिप करें'],
    notes: 'Hindi tool catalogs frequently mix Hindi grammar with English technical terms; Hinglish and English-token variants should be retained in query candidates.',
  },
];
