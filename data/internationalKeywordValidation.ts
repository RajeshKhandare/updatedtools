export interface InternationalKeywordValidation {
  locale: string;
  slug: string;
  primaryKeyword: string;
  alternateKeywords: string[];
  intent: 'tool';
  sourceUrls: string[];
  notes: string;
}

/**
 * Validated terminology from current localized SERP pages.
 * This is intentionally a small, evidence-backed layer; unvalidated markets
 * remain research seeds until their wording is checked.
 */
const BASE_INTERNATIONAL_KEYWORD_VALIDATIONS: readonly InternationalKeywordValidation[] = [
  {
    locale: 'pt-BR',
    slug: 'merge-pdf',
    primaryKeyword: 'juntar PDF',
    alternateKeywords: ['unir PDF', 'mesclar PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://dica.com.br/como-juntar-pdf-online/',
      'https://resolvetools.com.br/ferramentas/juntar-pdf',
      'https://conversorbrasil.com/juntar-pdf',
    ],
    notes: 'Brazilian pages consistently use “juntar PDF”; “unir PDF” also appears. Prefer local phrasing over literal translation of “merge”.',
  },
  {
    locale: 'es',
    slug: 'merge-pdf',
    primaryKeyword: 'unir PDF',
    alternateKeywords: ['combinar PDF', 'juntar PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://www.adobe.com/es/acrobat/online/merge-pdf.html',
      'https://www.filuni.com/es/blog/how-to-merge-pdf-online-free',
      'https://smallpdf.com/es/blog/escanear-varias-paginas-en-un-solo-pdf',
    ],
    notes: 'Current Spanish pages use “Unir PDF” prominently; “combinar” is also natural. Validate country-specific wording before expanding beyond the Spanish-language market.',
  },
  {
    locale: 'de',
    slug: 'merge-pdf',
    primaryKeyword: 'PDF zusammenfügen',
    alternateKeywords: ['PDF verbinden', 'PDF kombinieren', 'PDF zusammenführen'],
    intent: 'tool',
    sourceUrls: [
      'https://www.pdf.de/pdf-zusammenfuegen/',
      'https://tooltea.com/de/pdf/pdf-zusammenfuegen',
      'https://www.visualpdf.com/de/pdf-zusammenfuegen',
    ],
    notes: 'German SERPs show “PDF zusammenfügen” as the dominant practical wording, with “verbinden/kombinieren/zusammenführen” as related variants.',
  },
  {
    locale: 'fr',
    slug: 'merge-pdf',
    primaryKeyword: 'fusionner PDF',
    alternateKeywords: ['fusionner des PDF', 'assembler PDF', 'combiner PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://tools.pdf24.org/fr/fusionner-pdf',
      'https://www.foxit.com/fr/merge-pdf/',
      'https://www.visualpdf.com/fr/fusionner-pdf',
    ],
    notes: 'French pages consistently use “fusionner PDF”; “assembler” and “combiner” are secondary variants.',
  },
  {
    locale: 'ja',
    slug: 'merge-pdf',
    primaryKeyword: 'PDF 結合',
    alternateKeywords: ['PDFを結合', 'PDF 統合', 'PDFをまとめる'],
    intent: 'tool',
    sourceUrls: [
      'https://www.ilovepdf.com/ja/merge_pdf',
      'https://www.adobe.com/jp/acrobat/roc/blog/merge-pdf.html',
      'https://www.pdfpeach.com/ja/merge-pdf',
    ],
    notes: 'Japanese tool pages use “PDF 結合” / “PDFを結合”; “PDF 統合” and “PDFをまとめる” are useful semantic variants.',
  },
  {
    locale: 'ru',
    slug: 'merge-pdf',
    primaryKeyword: 'объединить PDF',
    alternateKeywords: ['соединить PDF', 'склеить PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://tools.pdf24.org/ru/merge-pdf',
      'https://freelypdf.com/ru/merge-pdf/',
      'https://pdfty.com/ru/blog/kak-soedinit-pdf-fajly',
    ],
    notes: 'Russian pages use “объединить PDF” and “соединить PDF”; “склеить” appears as an informal variant.',
  },
  {
    locale: 'zh-CN',
    slug: 'merge-pdf',
    primaryKeyword: '合并PDF',
    alternateKeywords: ['合并 PDF', 'PDF拼接', 'PDF合并'],
    intent: 'tool',
    sourceUrls: [
      'https://tools.pdf24.org/zh/merge-pdf',
      'https://www.ilovepdf.com/zh-cn/merge_pdf',
      'https://www.i2pdf.com/zh/merge-pdf',
    ],
    notes: 'Simplified Chinese pages consistently use “合并PDF/合并 PDF”; “PDF拼接” is a useful secondary variant.',
  },
  {
    locale: 'it',
    slug: 'merge-pdf',
    primaryKeyword: 'unire PDF',
    alternateKeywords: ['unire file PDF', 'unisci PDF', 'combinare PDF'],
    intent: 'tool',
    sourceUrls: [
      'https://f24editabile.com/strumenti-utili/unire-pdf/',
      'https://schermata.it/it/strumenti/unire-pdf',
      'https://combinepdf.com/it/',
    ],
    notes: 'Italian pages use “unire PDF” and “unisci PDF”; “combinare” is a semantic alternative.',
  },
  {
    locale: 'hi',
    slug: 'merge-pdf',
    primaryKeyword: 'PDF मर्ज करें',
    alternateKeywords: ['PDF मर्ज', 'PDF को मर्ज करें', 'PDF फाइलों को मर्ज करें'],
    intent: 'tool',
    sourceUrls: [
      'https://tools.pdf24.org/hi/merge-pdf',
      'https://www.pdf2go.com/hi/merge-pdf',
      'https://omypdf.com/hi/merge-pdf',
    ],
    notes: 'Current Hindi pages commonly retain the English technical term “मर्ज”; avoid replacing it with an unnatural literal Hindi phrase.',
  },
  {
    locale: 'ar',
    slug: 'merge-pdf',
    primaryKeyword: 'دمج PDF',
    alternateKeywords: ['دمج ملفات PDF', 'دمج ملفات بي دي إف'],
    intent: 'tool',
    sourceUrls: [
      'https://www.sapdf.net/merge-pdf',
      'https://www.useotools.com/ar/merge-pdf',
      'https://arabpdf.net/merge-pdf',
    ],
    notes: 'Arabic pages consistently use “دمج PDF” / “دمج ملفات PDF”. Keep RTL copy natural rather than translating English word-for-word.',
  },
];


/**
 * Core PDF intent validation expanded from current localized tool catalogs.
 * These rows validate terminology/intent, not search-volume rankings.
 */
const CORE_PDF_VALIDATIONS: readonly InternationalKeywordValidation[] = [
  ...([
    ['pt-BR','juntar PDF','dividir PDF','comprimir PDF','PDF para JPG','JPG para PDF','https://makeitpdf.com/pt/'],
    ['es','unir PDF','dividir PDF','comprimir PDF','PDF a JPG','JPG a PDF','https://makeitpdf.com/es/'],
    ['de','PDF zusammenfügen','PDF teilen','PDF komprimieren','PDF in JPG','JPG in PDF','https://makeitpdf.com/de/'],
    ['fr','fusionner PDF','diviser PDF','compresser PDF','PDF en JPG','JPG en PDF','https://makeitpdf.com/fr/'],
    ['it','unire PDF','dividere PDF','comprimere PDF','PDF in JPG','JPG in PDF','https://www.ilovepdf.com/it'],
    ['ja','PDF 結合','PDF 分割','PDF 圧縮','PDFからJPG','JPGからPDF','https://www.ilovepdf.com/ja'],
    ['ko','PDF 합치기','PDF 분할','PDF 압축','PDF → JPG','JPG → PDF','https://www.veryeasypdf.com/ko'],
    ['zh-CN','合并PDF','拆分PDF','压缩PDF','PDF转JPG','JPG转PDF','https://www.financeplay.cn/'],
    ['ru','Объединить PDF','Разделить PDF','Сжать PDF','PDF в JPG','JPG в PDF','https://www.ilovepdf.com/ru'],
    ['ar','دمج PDF','تقسيم PDF','ضغط PDF','PDF إلى JPG','JPG إلى PDF','https://ta7wil.com/'],
    ['hi','PDF मर्ज करें','PDF विभाजित करें','PDF कंप्रेस करें','PDF से JPG','JPG से PDF','https://www.ilovepdf.com/hi'],
  ] as const).flatMap(([locale, merge, split, compress, pdfJpg, jpgPdf, sourceUrl]) => [
    { locale, slug:'merge-pdf', primaryKeyword:merge, alternateKeywords:[`${merge} online`, `${merge} ${locale==='pt-BR'?'grátis':locale==='de'?'kostenlos':locale==='fr'?'gratuit':locale==='es'?'gratis':locale==='it'?'gratis':locale==='ja'?'オンライン':locale==='ko'?'온라인':locale==='zh-CN'?'在线':locale==='ru'?'онлайн':locale==='ar'?'أونلاين':locale==='hi'?'ऑनलाइन':'online'}`], intent:'tool' as const, sourceUrls:[sourceUrl], notes:'Localized catalog terminology observed for the core PDF task; modifier variants are query candidates and still require volume validation.' },
    { locale, slug:'split-pdf', primaryKeyword:split, alternateKeywords:[`${split} online`], intent:'tool' as const, sourceUrls:[sourceUrl], notes:'Localized catalog terminology observed for the core PDF task; modifier variants are query candidates and still require volume validation.' },
    { locale, slug:'compress-pdf', primaryKeyword:compress, alternateKeywords:[`${compress} online`], intent:'tool' as const, sourceUrls:[sourceUrl], notes:'Localized catalog terminology observed for the core PDF task; modifier variants are query candidates and still require volume validation.' },
    { locale, slug:'pdf-to-jpg', primaryKeyword:pdfJpg, alternateKeywords:[`${pdfJpg} online`], intent:'tool' as const, sourceUrls:[sourceUrl], notes:'Localized catalog terminology observed for the core PDF task; modifier variants are query candidates and still require volume validation.' },
    { locale, slug:'jpg-to-pdf', primaryKeyword:jpgPdf, alternateKeywords:[`${jpgPdf} online`], intent:'tool' as const, sourceUrls:[sourceUrl], notes:'Localized catalog terminology observed for the core PDF task; modifier variants are query candidates and still require volume validation.' },
  ]),
];

const ADDITIONAL_CATALOG_VALIDATIONS: readonly InternationalKeywordValidation[] = [
  {
    locale: 'it',
    slug: 'json-formatter-validator',
    primaryKeyword: 'Formattatore JSON online',
    alternateKeywords: ['Formatta JSON', 'validatore JSON'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/it/tools/json-formatter'],
    notes: 'Current Italian localized catalog uses “Formattatore JSON online” and explicitly describes formatting and syntax verification.',
  },
  {
    locale: 'it',
    slug: 'word-character-counter',
    primaryKeyword: 'Contatore di parole',
    alternateKeywords: ['contatore di caratteri', 'conta parole online'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/it'],
    notes: 'Current Italian localized catalog uses “Contatore di parole” for the word-count tool.',
  },
  {
    locale: 'it',
    slug: 'compress-image',
    primaryKeyword: 'Compressore di immagini',
    alternateKeywords: ['comprimere immagini', 'compressione immagini'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/it', 'https://uselocaltools.com/it/tools/bulk-image-compressor'],
    notes: 'Current Italian catalog uses “Compressore di immagini” and “comprimi immagini” task wording.',
  },
  {
    locale: 'ja',
    slug: 'json-formatter-validator',
    primaryKeyword: 'JSONフォーマッター',
    alternateKeywords: ['JSONの整形', 'JSON 構文チェック'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/ja/tools/json-formatter'],
    notes: 'Current Japanese localized page uses “JSONフォーマッター” and describes JSON formatting and syntax validation.',
  },
  {
    locale: 'ja',
    slug: 'word-character-counter',
    primaryKeyword: '単語数カウンター',
    alternateKeywords: ['文字数カウンター', '単語数・文字数カウンター'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/ja/tools/word-counter'],
    notes: 'Current Japanese localized page uses “単語数カウンター” and also exposes combined word/character-count wording.',
  },
  {
    locale: 'ja',
    slug: 'merge-pdf',
    primaryKeyword: 'PDFを結合',
    alternateKeywords: ['PDF 結合', 'PDFをまとめる'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/ja/tools/merge-pdf'],
    notes: 'Current Japanese localized page uses “PDFを結合” as the task heading and explains combining multiple PDFs in browser.',
  },
];

const ADDITIONAL_LOCAL_CATALOG_VALIDATIONS: readonly InternationalKeywordValidation[] = [
  {
    locale: 'ko',
    slug: 'json-formatter-validator',
    primaryKeyword: 'JSON 포매터',
    alternateKeywords: ['JSON 포맷터', 'JSON 구문 검사'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/ko/tools/json-formatter'],
    notes: 'Current Korean localized page uses “JSON 포매터” and describes formatting, minifying and syntax checking in-browser.',
  },
  {
    locale: 'zh-CN',
    slug: 'json-formatter-validator',
    primaryKeyword: 'JSON格式化',
    alternateKeywords: ['JSON 格式化', 'JSON校验'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/zh-CN/tools/json-formatter'],
    notes: 'Current Simplified Chinese localized page uses “JSON格式化” and describes formatting, minifying and syntax validation.',
  },
  {
    locale: 'ar',
    slug: 'json-formatter-validator',
    primaryKeyword: 'منسّق JSON',
    alternateKeywords: ['تنسيق JSON', 'التحقق من JSON'],
    intent: 'tool',
    sourceUrls: ['https://experttoolskit.com/ar/%D8%AA%D9%86%D8%B3%D9%8A%D9%82-json/'],
    notes: 'Current Arabic page uses “منسّق JSON” and explicitly describes JSON formatting and validation.',
  },
  {
    locale: 'ar',
    slug: 'compress-image',
    primaryKeyword: 'ضغط الصور',
    alternateKeywords: ['ضغط الصور أونلاين', 'تصغير حجم الصور'],
    intent: 'tool',
    sourceUrls: ['https://experttoolskit.com/ar/%D8%B6%D8%BA%D8%B7-%D8%A7%D9%84%D8%B5%D9%88%D8%B1/'],
    notes: 'Current Arabic page uses “ضغط الصور” for image compression and describes JPG, PNG and WebP compression.',
  },
  {
    locale: 'ar',
    slug: 'compress-pdf',
    primaryKeyword: 'ضغط ملفات PDF',
    alternateKeywords: ['ضغط PDF', 'تصغير حجم ملف PDF'],
    intent: 'tool',
    sourceUrls: ['https://experttoolskit.com/ar/%D8%B6%D8%BA%D8%B7-%D9%85%D9%84%D9%81-pdf/'],
    notes: 'Current Arabic page uses “ضغط ملفات PDF” and “تصغير حجم الملف” task wording.',
  },
  {
    locale: 'ar',
    slug: 'merge-pdf',
    primaryKeyword: 'دمج ملفات PDF',
    alternateKeywords: ['دمج PDF', 'دمج ملفات بي دي إف'],
    intent: 'tool',
    sourceUrls: ['https://experttoolskit.com/ar/%D8%AF%D9%85%D8%AC-%D9%85%D9%84%D9%81%D8%A7%D8%AA-pdf/'],
    notes: 'Current Arabic page uses “دمج ملفات PDF” and describes combining multiple files and reordering pages by drag and drop.',
  },
  {
    locale: 'it',
    slug: 'word-character-counter',
    primaryKeyword: 'Contatore di parole',
    alternateKeywords: ['contatore di caratteri', 'conta parole online'],
    intent: 'tool',
    sourceUrls: ['https://uselocaltools.com/it/tools/word-counter'],
    notes: 'Current Italian localized page uses “Contatore di parole” and measures words, characters, sentences, paragraphs and lines.',
  },
];


/**
 * Additional evidence-backed catalog terminology.
 *
 * These rows use terms explicitly observed in the current localized market
 * catalogs recorded in internationalMarketEvidence.ts. They validate tool
 * intent/wording only; they do not assert search volume, difficulty, traffic,
 * or ranking potential.
 */
const EVIDENCE_CATALOG_VALIDATIONS: readonly InternationalKeywordValidation[] = [

  // Additional localized text/developer terminology observed in current public catalogs
  ...([
    ['es','markdown-to-html-converter','Convertidor de Markdown a HTML',['Markdown a HTML'],'https://uselocaltools.com/es'],
    ['es','html-entity-encoder','Codificador de entidades HTML',['entidades HTML'],'https://uselocaltools.com/es'],
    ['es','url-component-encoder-decoder','Codificador y decodificador de URL',['codificador URL'],'https://uselocaltools.com/es'],
    ['de','markdown-to-html-converter','Markdown zu HTML Konverter',['Markdown in HTML umwandeln'],'https://www.pageonaut.com/de/'],
    ['de','html-entity-encoder','HTML Entity Encoder',['HTML-Entitäten kodieren'],'https://www.pageonaut.com/de/tools'],
    ['de','url-component-encoder-decoder','URL kodieren und dekodieren',['URL Encoder Decoder'],'https://www.pageonaut.com/de/tools'],
    ['fr','uuid-guid-v4-generator','Générateur UUID',['générateur UUID en ligne'],'https://experttoolskit.com/fr/'],
    ['fr','strong-password-generator','Générateur de mots de passe',['générateur de mot de passe'],'https://experttoolskit.com/fr/'],
    ['fr','url-component-encoder-decoder','Encodeur/décodeur URL',['encodeur URL'],'https://experttoolskit.com/fr/'],
    ['it','uuid-guid-v4-generator','Generatore UUID',['generatore UUID online'],'https://uselocaltools.com/it'],
    ['it','strong-password-generator','Generatore di password',['generatore password sicure'],'https://uselocaltools.com/it'],
    ['it','url-component-encoder-decoder','Codificatore e decodificatore URL',['codificatore URL'],'https://uselocaltools.com/it'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrl]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrl],notes:'Terminology observed in a current localized public tool catalog; validates wording/intent only, not search volume or ranking.'})),


  // Additional localized developer/image terminology observed in current public catalogs
  ...([
    ['es','svg-to-png-converter','Convertidor SVG a PNG',['SVG a PNG'],'https://uselocaltools.com/es'],
    ['es','png-to-jpg-converter','Convertidor PNG a JPG',['PNG a JPG'],'https://funnytools.win/es/herramientas/'],
    ['es','jpg-to-png-converter','Convertidor JPG a PNG',['JPG a PNG'],'https://funnytools.win/es/herramientas/'],
    ['es','image-resizer','Redimensionar imagen',['redimensionador de imágenes'],'https://uselocaltools.com/es'],
    ['de','svg-to-png-converter','SVG in PNG umwandeln',['SVG zu PNG'],'https://www.pageonaut.com/de/'],
    ['de','png-to-jpg-converter','PNG in JPG umwandeln',['PNG zu JPG'],'https://www.pageonaut.com/de/'],
    ['de','jpg-to-png-converter','JPG in PNG umwandeln',['JPG zu PNG'],'https://www.pageonaut.com/de/'],
    ['fr','svg-to-png-converter','Convertisseur SVG en PNG',['SVG vers PNG'],'https://experttoolskit.com/fr/'],
    ['fr','png-to-jpg-converter','Convertisseur PNG en JPG',['PNG vers JPG'],'https://experttoolskit.com/fr/'],
    ['fr','jpg-to-png-converter','Convertisseur JPG en PNG',['JPG vers PNG'],'https://experttoolskit.com/fr/'],
    ['it','svg-to-png-converter','Convertitore SVG in PNG',['SVG a PNG'],'https://uselocaltools.com/it'],
    ['it','png-to-jpg-converter','Convertitore PNG in JPG',['PNG a JPG'],'https://uselocaltools.com/it'],
    ['it','jpg-to-png-converter','Convertitore JPG in PNG',['JPG a PNG'],'https://uselocaltools.com/it'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrl]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrl],notes:'Terminology observed in a current localized public tool catalog; validates wording/intent only, not search volume or ranking.'})),


  // Additional finance/calculator terminology observed in current German catalogs
  ...([
    ['de','tip-calculator','Trinkgeld Rechner',['Trinkgeldrechner'],'https://microapp.io/de/'],
    ['de','discount-calculator','Prozentrechner',['Rabatte berechnen'],'https://microapp.io/de/'],
    ['de','compound-interest-calculator','Zinseszinsrechner',['Zinseszins berechnen'],'https://microapp.io/de/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrl]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrl],notes:'Terminology observed in a current German public tool catalog; validates wording/intent only, not search volume or ranking.'})),


  // Additional fresh terminology from localized public catalogs (September 2026)
  ...([
    ['es','find-replace-text','Buscar y reemplazar',['buscar y reemplazar texto'],'https://apps.apple.com/es/app/doguzip/id6800202279'],
    ['es','reverse-text-mirror-tool','Invertir texto',['texto inverso'],'https://apps.apple.com/es/app/doguzip/id6800202279'],
    ['es','lorem-ipsum-generator','Generador de texto ficticio',['Lorem Ipsum'],'https://apps.apple.com/es/app/doguzip/id6800202279'],
    ['es','scientific-calculator','Calculadora científica',['calculadora científica online'],'https://apps.apple.com/es/app/doguzip/id6800202279'],
    ['es','discount-calculator','Calculadora de descuentos',['cálculo de descuentos'],'https://apps.apple.com/es/app/doguzip/id6800202279'],
    ['ja','instant-qr-code-generator','QRコード作成',['QRコード生成'],'https://jptools.jp/'],
    ['ja','hex-to-rgb-hsl-converter','カラーコード変換',['HEX・RGB・HSL 変換'],'https://jptools.jp/'],
    ['fr','hex-to-rgb-hsl-converter','Convertisseur HEX vers RGB',['convertisseur HEX RGB HSL'],'https://utilorax.com/fr'],
    ['de','instant-qr-code-generator','QR-Code-Generator',['QR-Code erstellen'],'https://instantconverter.org/de/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrl]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrl],notes:'Terminology observed in a current localized public tool catalog; validates wording/intent only, not search volume or ranking.'})),


  // Fresh web-confirmed compiler terminology (Spanish/French)
  ...([
    ['es','online-python-compiler','Compilador de Python Online',['compilador Python en línea'],'https://pythoncompiler.io/es/'],
    ['es','online-javascript-compiler','Compilador de JavaScript Online',['JavaScript online'],'https://programmingvideotutorials.com/es/tools/online-code-playground/'],
    ['es','online-sql-runner','Compilador de SQL Online',['SQL online'],'https://programmingvideotutorials.com/es/tools/online-code-playground/'],
    ['fr','online-python-compiler','Compilateur Python en ligne',['compilateur Python en ligne gratuit'],'https://pythoncompiler.io/fr/'],
    ['fr','online-javascript-compiler','Compilateur JavaScript en ligne',['JavaScript en ligne'],'https://programmingvideotutorials.com/es/tools/online-code-playground/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Terminology confirmed from a current public localized compiler page; this validates wording only, not search volume or ranking.'})),

  // pt-BR — observed in Brazilian utility/PDF catalogs
  ...([
    ['pt-BR','protect-pdf-password','Proteger PDF',['proteger PDF com senha'],'https://www.webfacilita.com/'],
    ['pt-BR','unlock-pdf-password','Desbloquear PDF',['desbloquear PDF'],'https://makeitpdf.com/pt/'],
    ['pt-BR','rotate-pdf','Girar PDF',['rodar PDF'],'https://makeitpdf.com/pt/'],
    ['pt-BR','add-page-numbers-pdf','Adicionar números de página',['números de página PDF'],'https://makeitpdf.com/pt/'],
    ['pt-BR','pdf-to-word','PDF para Word',['converter PDF para Word'],'https://makeitpdf.com/pt/'],
    ['pt-BR','word-to-pdf','Word para PDF',['converter Word para PDF'],'https://makeitpdf.com/pt/'],
    ['pt-BR','compress-image','Comprimir Imagem',['comprimir imagens'],'https://www.webfacilita.com/'],
    ['pt-BR','image-resizer','Redimensionador de imagens',['redimensionar imagem'],'https://www.webfacilita.com/'],
    ['pt-BR','json-formatter-validator','Formatador e Validador JSON Online',['Formatador de JSON'],'https://codecrush.com.br/ferramentas/formatador-json'],
    ['pt-BR','base64-encoder-decoder','Codificador e decodificador Base64',['Base64'],'https://www.webfacilita.com/'],
    ['pt-BR','url-component-encoder-decoder','Codificador e decodificador de URL',['codificador de URL'],'https://www.webfacilita.com/'],
    ['pt-BR','html-entity-encoder','Codificador e decodificador de entidades HTML',['entidades HTML'],'https://www.webfacilita.com/'],
    ['pt-BR','css-minifier-cleaner','Minificador CSS',['minificador de CSS'],'https://www.webfacilita.com/'],
    ['pt-BR','text-case-converter','Conversor de Maiúsculas/Minúsculas',['converter maiúsculas e minúsculas'],'https://www.webfacilita.com/'],
    ['pt-BR','percentage-calculator','Calculadora de porcentagem',['calculadora percentual'],'https://www.webfacilita.com/'],
    ['pt-BR','age-calculator','Calculadora de idade',['cálculo de idade'],'https://www.webfacilita.com/'],
    ['pt-BR','bmi-calculator','Calculadora de IMC',['cálculo de IMC'],'https://www.webfacilita.com/'],
    ['pt-BR','discount-calculator','Calculadora de desconto',['cálculo de desconto'],'https://www.webfacilita.com/'],
    ['pt-BR','tip-calculator','Calculadora de gorjeta',['cálculo de gorjeta'],'https://www.webfacilita.com/'],
    ['pt-BR','compound-interest-calculator','Calculadora de juros compostos',['juros compostos'],'https://www.webfacilita.com/'],
    ['pt-BR','salary-calculator','Calculadora de salário',['cálculo de salário'],'https://www.webfacilita.com/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in the current Brazilian Portuguese tool catalog; terminology validation only.'})),

  // es — observed in Spanish-language utility catalogs
  ...([
    ['es','protect-pdf-password','Proteger PDF',['proteger PDF con contraseña'],'https://andev.app/es/'],
    ['es','unlock-pdf-password','Desbloquear PDF',['desbloquear PDF'],'https://funnytools.win/es/herramientas/'],
    ['es','rotate-pdf','Rotar PDF',['rotar páginas PDF'],'https://funnytools.win/es/herramientas/'],
    ['es','add-page-numbers-pdf','Añadir números de página',['números de página PDF'],'https://makeitpdf.com/es/'],
    ['es','pdf-to-word','PDF a Word',['convertir PDF a Word'],'https://makeitpdf.com/es/'],
    ['es','word-to-pdf','Word a PDF',['convertir Word a PDF'],'https://makeitpdf.com/es/'],
    ['es','compress-image','Comprimir imagen',['compresor de imágenes'],'https://andev.app/es/'],
    ['es','json-formatter-validator','Formateador JSON online',['Formateador y validador JSON'],'https://uselocaltools.com/es'],
    ['es','base64-encoder-decoder','Codificador y decodificador Base64',['Base64'],'https://uselocaltools.com/es'],
    ['es','uuid-guid-v4-generator','Generador de UUID',['UUID'],'https://uselocaltools.com/es'],
    ['es','strong-password-generator','Generador de contraseñas',['generador de password'],'https://uselocaltools.com/es'],
    ['es','jwt-token-inspector','Decodificador JWT',['JWT'],'https://uselocaltools.com/es'],
    ['es','text-diff-checker','Comparador de textos',['comparar textos'],'https://uselocaltools.com/es'],
    ['es','text-case-converter','Convertidor de mayúsculas y minúsculas',['cambiar mayúsculas y minúsculas'],'https://uselocaltools.com/es'],
    ['es','unix-timestamp-converter','Convertidor timestamp Unix',['timestamp Unix'],'https://uselocaltools.com/es'],
    ['es','remove-duplicate-lines','Eliminar líneas duplicadas',['eliminar duplicados'],'https://funnytools.win/es/herramientas/'],
    ['es','alphabetical-line-sorter','Ordenar líneas de texto',['ordenar texto alfabéticamente'],'https://funnytools.win/es/herramientas/'],
    ['es','percentage-calculator','Calculadora de porcentajes',['cálculo de porcentajes'],'https://uselocaltools.com/es'],
    ['es','unit-length-converter','Conversor de unidades',['convertidor de unidades'],'https://uselocaltools.com/es'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in the current Spanish-language tool catalog; country-specific variants still require separate validation.'})),

  // de — observed in German tool catalogs
  ...([
    ['de','protect-pdf-password','PDF schützen',['PDF mit Passwort schützen'],'https://makeitpdf.com/de/'],
    ['de','unlock-pdf-password','PDF entsperren',['PDF Passwort entfernen'],'https://makeitpdf.com/de/'],
    ['de','rotate-pdf','PDF drehen',['PDF rotieren'],'https://makeitpdf.com/de/'],
    ['de','add-page-numbers-pdf','Seitenzahlen hinzufügen',['PDF Seitenzahlen'],'https://makeitpdf.com/de/'],
    ['de','pdf-to-word','PDF in Word',['PDF zu Word'],'https://makeitpdf.com/de/'],
    ['de','word-to-pdf','Word in PDF',['Word zu PDF'],'https://makeitpdf.com/de/'],
    ['de','compress-image','Bild komprimieren',['Bildkompressor'],'https://www.pageonaut.com/de/'],
    ['de','image-resizer','Bildgröße ändern',['Bild skalieren'],'https://www.pageonaut.com/de/'],
    ['de','crop-image-online','Bild zuschneiden',['Bild online zuschneiden'],'https://www.pageonaut.com/de/'],
    ['de','json-formatter-validator','JSON formatieren',['JSON-Formatierer','JSON-Formatter'],'https://turboutilkit.com/de/jsonformatter/'],
    ['de','base64-encoder-decoder','Base64 kodieren / dekodieren',['Base64 De/Encoder'],'https://www.pageonaut.com/de/tools'],
    ['de','url-component-encoder-decoder','URL kodieren / dekodieren',['URL De-/Encoder'],'https://www.pageonaut.com/de/tools'],
    ['de','jwt-token-inspector','JWT-Decoder',['JWT dekodieren'],'https://www.pageonaut.com/de/tools'],
    ['de','uuid-guid-v4-generator','UUID-Generator',['UUID Generator'],'https://www.pageonaut.com/de/tools'],
    ['de','strong-password-generator','Passwort-Generator',['Passwortgenerator'],'https://www.pageonaut.com/de/tools'],
    ['de','text-case-converter','Groß-/Kleinschreibung umwandeln',['Text Groß-/Kleinschreibung'],'https://www.pageonaut.com/de/tools'],
    ['de','remove-duplicate-lines','Doppelte Zeilen entfernen',['Duplikate entfernen'],'https://www.pageonaut.com/de/tools'],
    ['de','alphabetical-line-sorter','Zeilen sortieren',['Textzeilen sortieren'],'https://www.pageonaut.com/de/tools'],
    ['de','unit-length-converter','Einheiten-Umrechner',['Einheiten umrechnen'],'https://www.pageonaut.com/de/tools'],
    ['de','temperature-converter','Temperatur-Umrechner',['Temperatur umrechnen'],'https://www.pageonaut.com/de/tools'],
    ['de','bmi-calculator','BMI-Rechner',['BMI berechnen'],'https://www.pageonaut.com/de/tools'],
    ['de','percentage-calculator','Prozentrechner',['Prozent berechnen'],'https://www.pageonaut.com/de/tools'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in the current German-language tool catalog; wording is recorded as terminology evidence, not volume data.'})),

  // fr — observed in French catalogs
  ...([
    ['fr','compress-image','Compresser une image',['Compresser Image'],'https://experttoolskit.com/fr/'],
    ['fr','image-resizer','Redimensionner une image',['redimensionner image'],'https://experttoolskit.com/fr/'],
    ['fr','crop-image-online','Rogner une image',['Recadrer une image'],'https://experttoolskit.com/fr/'],
    ['fr','black-and-white-image-filter','Convertir une image en noir et blanc',['image noir et blanc'],'https://experttoolskit.com/fr/tools/'],
    ['fr','invert-image-colors','Inverser les couleurs d’une image',['inverser couleurs image'],'https://experttoolskit.com/fr/tools/'],
    ['fr','flip-rotate-image','Retourner et faire pivoter une image',['rotation image'],'https://experttoolskit.com/fr/tools/'],
    ['fr','instant-qr-code-generator','Générateur de QR code',['générateur de code QR'],'https://experttoolskit.com/fr/'],
    ['fr','image-blur-filter','Flouter une image',['flou image'],'https://experttoolskit.com/fr/tools/'],
    ['fr','image-color-palette-extractor','Générateur de palettes',['palette de couleurs'],'https://experttoolskit.com/fr/'],
    ['fr','json-formatter-validator','Formater et valider du JSON',['Formatage JSON'],'https://experttoolskit.com/fr/'],
    ['fr','base64-encoder-decoder','Encoder et décoder en Base64',['Encodage Base64'],'https://experttoolskit.com/fr/tools/'],
    ['fr','url-component-encoder-decoder','Encoder une URL',['encodeur URL'],'https://experttoolskit.com/fr/tools/'],
    ['fr','jwt-token-inspector','Décodeur JWT',['décoder JWT'],'https://experttoolskit.com/fr/tools/'],
    ['fr','uuid-guid-v4-generator','Générateur d’UUID',['générateur UUID'],'https://experttoolskit.com/fr/'],
    ['fr','strong-password-generator','Générateur de mots de passe',['générateur password'],'https://experttoolskit.com/fr/'],
    ['fr','clean-url-slug-generator','Générateur de slug',['créateur de slug'],'https://experttoolskit.com/fr/tools/'],
    ['fr','css-minifier-cleaner','Minificateur de code',['minificateur CSS'],'https://experttoolskit.com/fr/tools/'],
    ['fr','html-entity-encoder','Encoder les entités HTML',['entités HTML'],'https://experttoolskit.com/fr/tools/'],
    ['fr','unix-timestamp-converter','Horodatage Unix',['convertisseur timestamp Unix'],'https://experttoolskit.com/fr/tools/'],
    ['fr','text-case-converter','Convertisseur de casse',['Changer la casse'],'https://experttoolskit.com/fr/'],
    ['fr','remove-duplicate-lines','Supprimer les doublons',['supprimer lignes en double'],'https://experttoolskit.com/fr/'],
    ['fr','lorem-ipsum-generator','Générateur de faux texte',['Lorem Ipsum'],'https://experttoolskit.com/fr/'],
    ['fr','markdown-to-html-converter','Éditeur Markdown',['Markdown'],'https://experttoolskit.com/fr/'],
    ['fr','text-diff-checker','Comparer deux textes',['Comparaison de textes'],'https://experttoolskit.com/fr/'],
    ['fr','percentage-calculator','Calculateur de pourcentage',['Calcul de pourcentage'],'https://experttoolskit.com/fr/'],
    ['fr','age-calculator','Calculatrice âge',['Calcul d’âge'],'https://experttoolskit.com/fr/'],
    ['fr','compound-interest-calculator','Calculateur d’intérêts composés',['intérêts composés'],'https://experttoolskit.com/fr/'],
    ['fr','retirement-calculator','Calculateur de retraite',['calcul retraite'],'https://experttoolskit.com/fr/'],
    ['fr','tip-calculator','Calculateur de pourboire',['calcul pourboire'],'https://experttoolskit.com/fr/'],
    ['fr','unit-length-converter','Convertisseur d’unités',['conversion d’unités'],'https://experttoolskit.com/fr/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in the current French tool catalog; terminology evidence only.'})),

  // it — observed in Italian catalogs
  ...([
    ['it','protect-pdf-password','Proteggi PDF',['Proteggere PDF'],'https://makeitpdf.com/it/'],
    ['it','unlock-pdf-password','Sblocca PDF',['Sbloccare PDF'],'https://makeitpdf.com/it/'],
    ['it','rotate-pdf','Ruota PDF',['Ruotare PDF'],'https://makeitpdf.com/it/'],
    ['it','add-page-numbers-pdf','Numeri di pagina',['Numerare PDF'],'https://makeitpdf.com/it/'],
    ['it','pdf-to-word','PDF in Word',['convertitore PDF Word'],'https://makeitpdf.com/it/'],
    ['it','word-to-pdf','Word in PDF',['convertitore Word PDF'],'https://makeitpdf.com/it/'],
    ['it','json-formatter-validator','Formattatore JSON online',['Formatta JSON'],'https://uselocaltools.com/it/tools/json-formatter'],
    ['it','base64-encoder-decoder','Encoder e decoder Base64',['Base64'],'https://uselocaltools.com/it'],
    ['it','url-component-encoder-decoder','Codificatore e decodificatore URL',['codificatore URL'],'https://uselocaltools.com/it'],
    ['it','html-entity-encoder','Codificatore e decodificatore HTML',['entità HTML'],'https://uselocaltools.com/it'],
    ['it','uuid-guid-v4-generator','Generatore di UUID',['UUID'],'https://uselocaltools.com/it'],
    ['it','strong-password-generator','Generatore di password casuali',['generatore password'],'https://uselocaltools.com/it'],
    ['it','jwt-token-inspector','Decodificatore JWT',['JWT'],'https://uselocaltools.com/it'],
    ['it','instant-qr-code-generator','Generatore di codici QR',['generatore QR'],'https://uselocaltools.com/it'],
    ['it','text-diff-checker','Confronta due testi online',['confronto testi'],'https://uselocaltools.com/it'],
    ['it','text-case-converter','Convertitore maiuscole e minuscole',['convertitore di maiuscole e minuscole'],'https://uselocaltools.com/it'],
    ['it','unix-timestamp-converter','Convertitore di timestamp Unix',['timestamp Unix'],'https://uselocaltools.com/it'],
    ['it','percentage-calculator','Calcolatore di percentuali',['calcolatore percentuale'],'https://uselocaltools.com/it'],
    ['it','age-calculator','Calcolatore di età',['calcolo età'],'https://uselocaltools.com/it'],
    ['it','bmi-calculator','Calcolatore di IMC',['calcolatore BMI'],'https://uselocaltools.com/it'],
    ['it','discount-calculator','Calcolatore di sconti',['calcolo sconto'],'https://uselocaltools.com/it'],
    ['it','compound-interest-calculator','Calcolatore di interessi composti',['interessi composti'],'https://uselocaltools.com/it'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in the current Italian tool catalog; terminology validation only.'})),

  // ja — observed in Japanese catalogs
  ...([
    ['ja','compress-image','画像圧縮',['画像を圧縮'],'https://uselocaltools.com/ja'],
    ['ja','image-resizer','画像のサイズ変更',['画像リサイズ'],'https://uselocaltools.com/ja'],
    ['ja','crop-image-online','画像をトリミング',['画像の切り抜き'],'https://uselocaltools.com/ja'],
    ['ja','json-formatter-validator','JSONフォーマッター',['JSONの整形'],'https://uselocaltools.com/ja/tools/json-formatter'],
    ['ja','base64-encoder-decoder','Base64 エンコード・デコード',['Base64変換'],'https://uselocaltools.com/ja'],
    ['ja','uuid-guid-v4-generator','UUIDジェネレーター',['UUID生成'],'https://uselocaltools.com/ja'],
    ['ja','strong-password-generator','ランダムパスワード生成ツール',['パスワード生成'],'https://uselocaltools.com/ja'],
    ['ja','jwt-token-inspector','JWTデコーダー',['JWT解析'],'https://uselocaltools.com/ja'],
    ['ja','instant-qr-code-generator','QRコード作成',['QRコード生成'],'https://uselocaltools.com/ja'],
    ['ja','text-diff-checker','テキスト比較',['テキスト比較ツール'],'https://uselocaltools.com/ja'],
    ['ja','text-case-converter','大文字・小文字変換',['文字の大文字・小文字変換'],'https://uselocaltools.com/ja'],
    ['ja','unix-timestamp-converter','Unixタイムスタンプ変換',['Unix時間変換'],'https://uselocaltools.com/ja'],
    ['ja','percentage-calculator','パーセント計算機',['割合計算'],'https://uselocaltools.com/ja'],
    ['ja','age-calculator','年齢計算機',['年齢計算'],'https://uselocaltools.com/ja'],
    ['ja','bmi-calculator','BMI計算機',['BMI計算'],'https://uselocaltools.com/ja'],
    ['ja','discount-calculator','割引計算機',['割引計算'],'https://uselocaltools.com/ja'],
    ['ja','compound-interest-calculator','複利計算機',['複利計算'],'https://uselocaltools.com/ja'],
    ['ja','temperature-converter','摂氏・華氏変換',['温度変換'],'https://uselocaltools.com/ja'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in the current Japanese tool catalog; Japanese spacing variants remain research candidates.'})),

  // ko — observed in Korean catalogs
  ...([
    ['ko','compress-image','이미지 압축',['이미지 용량 줄이기'],'https://www.oneclicktool.kr/'],
    ['ko','image-resizer','이미지 크기 조절',['이미지 크기 변경'],'https://www.oneclicktool.kr/'],
    ['ko','json-formatter-validator','JSON 포매터',['JSON 포맷터','JSON 검증'],'https://uselocaltools.com/ko/tools/json-formatter'],
    ['ko','base64-encoder-decoder','Base64 인코더 및 디코더',['Base64 인코더/디코더'],'https://uselocaltools.com/ko'],
    ['ko','url-component-encoder-decoder','URL 인코더/디코더',['URL 인코더 및 디코더'],'https://uselocaltools.com/ko'],
    ['ko','uuid-guid-v4-generator','UUID 생성기',['UUID 제너레이터'],'https://uselocaltools.com/ko'],
    ['ko','strong-password-generator','랜덤 비밀번호 생성기',['비밀번호 생성기'],'https://uselocaltools.com/ko'],
    ['ko','jwt-token-inspector','JWT 디코더',['JWT 디코더 도구'],'https://uselocaltools.com/ko'],
    ['ko','instant-qr-code-generator','QR 코드 생성기',['QR코드 생성'],'https://uselocaltools.com/ko'],
    ['ko','text-diff-checker','텍스트 비교',['텍스트 비교 도구'],'https://www.oneclicktool.kr/'],
    ['ko','text-case-converter','대소문자 변환',['텍스트 대소문자 변환'],'https://www.oneclicktool.kr/'],
    ['ko','percentage-calculator','백분율 계산기',['퍼센트 계산기'],'https://www.oneclicktool.kr/'],
    ['ko','age-calculator','나이 계산기',['연령 계산기'],'https://www.oneclicktool.kr/'],
    ['ko','bmi-calculator','BMI 계산기',['BMI 계산'],'https://www.oneclicktool.kr/'],
    ['ko','word-character-counter','글자 수 세기',['단어 수 세기'],'https://www.oneclicktool.kr/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in current Korean tool catalogs; native task wording is retained alongside English technical tokens.'})),

  // zh-CN — observed in Simplified Chinese catalogs
  ...([
    ['zh-CN','delete-pdf-pages','删除PDF页面',['删除PDF页'],'https://www.zhandu.cn/tool/pdf-tools'],
    ['zh-CN','reorder-pdf-pages','PDF页面排序',['PDF页面重新排序'],'https://www.zhandu.cn/tool/pdf-tools'],
    ['zh-CN','rotate-pdf','PDF旋转',['旋转PDF'],'https://www.zhandu.cn/tool/pdf-tools'],
    ['zh-CN','add-page-numbers-pdf','添加页码',['PDF添加页码'],'https://www.zhandu.cn/tool/pdf-tools'],
    ['zh-CN','compress-image','压缩图片',['图片压缩'],'https://nbtools.cn/'],
    ['zh-CN','crop-image-online','裁剪图片',['图片裁剪'],'https://nbtools.cn/'],
    ['zh-CN','image-resizer','调整图片大小',['图片尺寸调整'],'https://nbtools.cn/'],
    ['zh-CN','json-formatter-validator','JSON格式化',['JSON在线解析','JSON校验'],'https://nbtools.cn/'],
    ['zh-CN','base64-encoder-decoder','Base64编码解码',['Base64编解码'],'https://nbtools.cn/'],
    ['zh-CN','url-component-encoder-decoder','URL编码解码',['URL编码器'],'https://nbtools.cn/'],
    ['zh-CN','unix-timestamp-converter','Unix时间戳转换',['时间戳转换'],'https://nbtools.cn/'],
    ['zh-CN','uuid-guid-v4-generator','UUID生成器',['生成UUID'],'https://nbtools.cn/'],
    ['zh-CN','strong-password-generator','随机密码生成器',['密码生成器'],'https://nbtools.cn/'],
    ['zh-CN','jwt-token-inspector','JWT解析解码',['JWT解码器'],'https://nbtools.cn/'],
    ['zh-CN','text-diff-checker','文本对比',['文本比较'],'https://nbtools.cn/'],
    ['zh-CN','find-replace-text','文本替换',['查找替换文本'],'https://nbtools.cn/'],
    ['zh-CN','text-case-converter','大小写转换',['文本大小写转换'],'https://nbtools.cn/'],
    ['zh-CN','percentage-calculator','百分比计算器',['百分比计算'],'https://nbtools.cn/'],
    ['zh-CN','age-calculator','年龄计算器',['年龄计算'],'https://nbtools.cn/'],
    ['zh-CN','bmi-calculator','BMI计算器',['BMI计算'],'https://nbtools.cn/'],
    ['zh-CN','discount-calculator','折扣计算器',['折扣计算'],'https://nbtools.cn/'],
    ['zh-CN','compound-interest-calculator','复利计算器',['复利计算'],'https://nbtools.cn/'],
    ['zh-CN','unit-length-converter','单位转换器',['单位换算'],'https://nbtools.cn/'],
    ['zh-CN','online-python-compiler','在线Python编译器',['Python在线编译器'],'https://nbtools.cn/'],
    ['zh-CN','online-javascript-compiler','在线JavaScript编辑器',['JavaScript在线编辑器'],'https://nbtools.cn/'],
    ['zh-CN','online-java-compiler','在线Java编译器',['Java在线编译器'],'https://nbtools.cn/'],
    ['zh-CN','online-cpp-compiler','在线C++编译器',['C++在线编译器'],'https://nbtools.cn/'],
    ['zh-CN','online-csharp-compiler','在线C#编译器',['C#在线编译器'],'https://nbtools.cn/'],
    ['zh-CN','online-php-runner','在线PHP运行器',['PHP在线运行'],'https://nbtools.cn/'],
    ['zh-CN','online-sql-runner','在线SQL编辑器',['SQL在线编辑器'],'https://nbtools.cn/'],
    ['zh-CN','youtube-thumbnail-downloader','YouTube缩略图下载器',['YouTube缩略图'],'https://xiaobinguo.cn/'],
    ['zh-CN','youtube-tag-generator','YouTube标签生成器',['YouTube标签'],'https://xiaobinguo.cn/'],
    ['zh-CN','youtube-money-calculator','YouTube收益计算器',['YouTube收入计算器'],'https://xiaobinguo.cn/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in current Simplified Chinese tool catalogs; terminology is compact and task-oriented.'})),

  // ru — observed in Russian catalogs
  ...([
    ['ru','delete-pdf-pages','Удалить страницы',['Удалить страницы из PDF'],'https://www.ilovepdf.com/ru'],
    ['ru','reorder-pdf-pages','Порядок страниц PDF',['Изменить порядок страниц PDF'],'https://www.ilovepdf.com/ru'],
    ['ru','add-page-numbers-pdf','Добавить номера страниц',['Нумерация страниц PDF'],'https://www.ilovepdf.com/ru'],
    ['ru','compress-image','Сжать изображение',['Сжатие изображения'],'https://usetoolz.ru/'],
    ['ru','image-resizer','Изменить размер изображения',['Размер изображения'],'https://usetoolz.ru/'],
    ['ru','json-formatter-validator','Форматирование JSON',['Форматтер JSON'],'https://textwonder.com/ru/'],
    ['ru','base64-encoder-decoder','Кодировщик и декодировщик Base64',['Base64 кодирование'],'https://usetoolz.ru/'],
    ['ru','url-component-encoder-decoder','Кодировщик и декодировщик URL',['Кодирование URL'],'https://usetoolz.ru/'],
    ['ru','uuid-guid-v4-generator','Генератор UUID',['Создать UUID'],'https://usetoolz.ru/'],
    ['ru','strong-password-generator','Генератор паролей',['Генератор надежных паролей'],'https://usetoolz.ru/'],
    ['ru','jwt-token-inspector','Декодер JWT',['Декодировать JWT'],'https://usetoolz.ru/'],
    ['ru','text-diff-checker','Сравнить два текста',['Сравнение текстов'],'https://textwonder.com/ru/'],
    ['ru','remove-duplicate-lines','Удалить дубликаты строк',['Удаление повторяющихся строк'],'https://textwonder.com/ru/'],
    ['ru','text-case-converter','Конвертер регистра текста',['Изменить регистр'],'https://textwonder.com/ru/'],
    ['ru','percentage-calculator','Калькулятор процентов',['Расчет процентов'],'https://usetoolz.ru/'],
    ['ru','age-calculator','Калькулятор возраста',['Расчет возраста'],'https://usetoolz.ru/'],
    ['ru','bmi-calculator','Калькулятор ИМТ',['Расчет ИМТ'],'https://usetoolz.ru/'],
    ['ru','discount-calculator','Калькулятор скидки',['Расчет скидки'],'https://usetoolz.ru/'],
    ['ru','compound-interest-calculator','Калькулятор сложного процента',['Сложный процент'],'https://usetoolz.ru/'],
    ['ru','online-python-compiler','Онлайн компилятор Python',['Python онлайн компилятор'],'https://usetoolz.ru/'],
    ['ru','online-javascript-compiler','Онлайн компилятор JavaScript',['JavaScript онлайн компилятор'],'https://usetoolz.ru/'],
    ['ru','online-java-compiler','Онлайн компилятор Java',['Java онлайн компилятор'],'https://usetoolz.ru/'],
    ['ru','online-cpp-compiler','Онлайн компилятор C++',['C++ онлайн компилятор'],'https://usetoolz.ru/'],
    ['ru','online-csharp-compiler','Онлайн компилятор C#',['C# онлайн компилятор'],'https://usetoolz.ru/'],
    ['ru','online-php-runner','Онлайн компилятор PHP',['PHP онлайн'],'https://usetoolz.ru/'],
    ['ru','online-sql-runner','Онлайн редактор SQL',['SQL онлайн редактор'],'https://usetoolz.ru/'],
    ['ru','youtube-thumbnail-downloader','Скачать миниатюру YouTube',['Скачать превью YouTube'],'https://usetoolz.ru/'],
    ['ru','youtube-tag-generator','Генератор тегов YouTube',['Теги YouTube'],'https://usetoolz.ru/'],
    ['ru','youtube-money-calculator','Калькулятор доходов YouTube',['Доход YouTube'],'https://usetoolz.ru/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in current Russian-language utility catalogs; terminology evidence only.'})),

  // ar — observed in Arabic catalogs
  ...([
    ['ar','compress-image','ضغط الصور',['تصغير حجم الصور'],'https://experttoolskit.com/ar/'],
    ['ar','image-resizer','تغيير حجم الصور',['تحجيم الصور'],'https://experttoolskit.com/ar/tools/'],
    ['ar','crop-image-online','اقتصاص الصور',['قص الصور'],'https://experttoolskit.com/ar/tools/'],
    ['ar','flip-rotate-image','تدوير وعكس الصور',['قلب الصور'],'https://experttoolskit.com/ar/tools/'],
    ['ar','image-blur-filter','طمس أجزاء من صورة',['تمويه الصورة'],'https://experttoolskit.com/ar/tools/'],
    ['ar','image-color-palette-extractor','مولّد لوحات الألوان',['مولد لوحة ألوان'],'https://experttoolskit.com/ar/tools/'],
    ['ar','json-formatter-validator','منسّق JSON',['تنسيق JSON','التحقق من JSON'],'https://experttoolskit.com/ar/%D8%AA%D9%86%D8%B3%D9%8A%D9%82-json/'],
    ['ar','css-minifier-cleaner','تصغير الشيفرة',['تصغير CSS'],'https://experttoolskit.com/ar/tools/'],
    ['ar','uuid-guid-v4-generator','مولّد UUID',['مولد UUID'],'https://experttoolskit.com/ar/tools/'],
    ['ar','strong-password-generator','مولّد كلمات المرور',['توليد كلمات مرور'],'https://experttoolskit.com/ar/tools/'],
    ['ar','jwt-token-inspector','مفكك JWT',['فك ترميز JWT'],'https://experttoolskit.com/ar/tools/'],
    ['ar','url-component-encoder-decoder','ترميز وفك ترميز URL',['ترميز URL'],'https://experttoolskit.com/ar/tools/'],
    ['ar','instant-qr-code-generator','مولّد رمز QR',['مولد رمز الاستجابة السريعة'],'https://experttoolskit.com/ar/'],
    ['ar','text-case-converter','تحويل حالة الأحرف',['تغيير حالة الأحرف'],'https://experttoolskit.com/ar/tools/'],
    ['ar','text-diff-checker','مقارنة النصوص',['مقارنة نصين'],'https://experttoolskit.com/ar/tools/'],
    ['ar','remove-duplicate-lines','إزالة الأسطر المكرّرة',['حذف الأسطر المكررة'],'https://experttoolskit.com/ar/tools/'],
    ['ar','percentage-calculator','حاسبة النسبة المئوية',['حساب النسبة المئوية'],'https://experttoolskit.com/ar/'],
    ['ar','age-calculator','حاسبة العمر',['حساب العمر'],'https://experttoolskit.com/ar/'],
    ['ar','bmi-calculator','حاسبة مؤشر كتلة الجسم',['حاسبة BMI'],'https://experttoolskit.com/ar/'],
    ['ar','compound-interest-calculator','حاسبة الفائدة المركبة',['حساب الفائدة المركبة'],'https://experttoolskit.com/ar/'],
    ['ar','retirement-calculator','حاسبة التقاعد',['حساب التقاعد'],'https://experttoolskit.com/ar/'],
    ['ar','unit-length-converter','محوّل الوحدات',['تحويل الوحدات'],'https://experttoolskit.com/ar/'],
    ['ar','youtube-thumbnail-downloader','تحميل صورة مصغرة من YouTube',['تحميل صورة يوتيوب المصغرة'],'https://experttoolskit.com/ar/tools/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in current Arabic tool catalogs; technical tokens remain in common Latin-script form where the catalog does.'})),

  // hi — observed in Hindi/Indian catalogs
  ...([
    ['hi','protect-pdf-password','PDF को पासवर्ड से सुरक्षित करें',['PDF सुरक्षित करें'],'https://fastols.com/hi/'],
    ['hi','rotate-pdf','PDF पेज घुमाएं',['PDF घुमाएं'],'https://fastols.com/hi/'],
    ['hi','reorder-pdf-pages','PDF पेज व्यवस्थित करें',['PDF पेज क्रम बदलें'],'https://fastols.com/hi/'],
    ['hi','compress-image','इमेज कंप्रेस करें',['इमेज का आकार कम करें'],'https://fastols.com/hi/'],
    ['hi','image-resizer','इमेज का आकार बदलें',['इमेज रिसाइज़ करें'],'https://fastols.com/hi/'],
    ['hi','black-and-white-image-filter','इमेज को ब्लैक एंड व्हाइट करें',['ब्लैक एंड व्हाइट इमेज'],'https://fastols.com/hi/'],
    ['hi','flip-rotate-image','इमेज फ्लिप करें',['इमेज घुमाएं'],'https://fastols.com/hi/'],
    ['hi','image-blur-filter','इमेज ब्लर करें',['इमेज धुंधली करें'],'https://fastols.com/hi/'],
    ['hi','json-formatter-validator','JSON फ़ॉर्मेटर',['JSON वैलिडेटर'],'https://fastols.com/hi/'],
    ['hi','base64-encoder-decoder','Base64 एनकोडर',['Base64 डिकोडर'],'https://fastols.com/hi/'],
    ['hi','url-component-encoder-decoder','URL एनकोड / डिकोड',['URL एनकोडर डिकोडर'],'https://fastols.com/hi/'],
    ['hi','uuid-guid-v4-generator','UUID जनरेटर',['UUID बनाने का टूल'],'https://fastols.com/hi/'],
    ['hi','strong-password-generator','पासवर्ड जनरेटर',['मजबूत पासवर्ड जनरेटर'],'https://fastols.com/hi/'],
    ['hi','jwt-token-inspector','JWT डिकोडर',['JWT टोकन डिकोडर'],'https://fastols.com/hi/'],
    ['hi','text-diff-checker','डिफ चेकर',['टेक्स्ट कंपेयर'],'https://fastols.com/hi/'],
    ['hi','word-character-counter','वर्ड काउंटर',['कैरेक्टर काउंटर'],'https://fastols.com/hi/'],
    ['hi','text-case-converter','केस कन्वर्टर',['टेक्स्ट केस कन्वर्टर'],'https://fastols.com/hi/'],
    ['hi','percentage-calculator','प्रतिशत कैलकुलेटर',['परसेंटेज कैलकुलेटर'],'https://fastols.com/hi/'],
    ['hi','age-calculator','उम्र कैलकुलेटर',['आयु कैलकुलेटर'],'https://fastols.com/hi/'],
    ['hi','bmi-calculator','BMI कैलकुलेटर',['BMI गणना'],'https://fastols.com/hi/'],
    ['hi','discount-calculator','डिस्काउंट कैलकुलेटर',['छूट कैलकुलेटर'],'https://fastols.com/hi/'],
    ['hi','gst-calculator','GST कैलकुलेटर',['GST गणना'],'https://fastols.com/hi/'],
    ['hi','salary-calculator','सैलरी कैलकुलेटर',['वेतन कैलकुलेटर'],'https://fastols.com/hi/'],
    ['hi','online-python-compiler','ऑनलाइन Python कंपाइलर',['Python ऑनलाइन कंपाइलर'],'https://fastols.com/hi/'],
    ['hi','online-javascript-compiler','ऑनलाइन JavaScript कंपाइलर',['JavaScript ऑनलाइन कंपाइलर'],'https://fastols.com/hi/'],
    ['hi','online-java-compiler','ऑनलाइन Java कंपाइलर',['Java ऑनलाइन कंपाइलर'],'https://fastols.com/hi/'],
    ['hi','online-cpp-compiler','ऑनलाइन C++ कंपाइलर',['C++ ऑनलाइन कंपाइलर'],'https://fastols.com/hi/'],
    ['hi','online-csharp-compiler','ऑनलाइन C# कंपाइलर',['C# ऑनलाइन कंपाइलर'],'https://fastols.com/hi/'],
    ['hi','online-php-runner','ऑनलाइन PHP कंपाइलर',['PHP ऑनलाइन रनर'],'https://fastols.com/hi/'],
    ['hi','online-sql-runner','ऑनलाइन SQL एडिटर',['SQL ऑनलाइन एडिटर'],'https://fastols.com/hi/'],
    ['hi','youtube-thumbnail-downloader','YouTube थंबनेल डाउनलोडर',['YouTube thumbnail downloader'],'https://fastols.com/hi/'],
    ['hi','youtube-tag-generator','YouTube टैग जनरेटर',['YouTube टैग बनाने का टूल'],'https://fastols.com/hi/'],
    ['hi','youtube-money-calculator','YouTube मनी कैलकुलेटर',['YouTube कमाई कैलकुलेटर'],'https://fastols.com/hi/'],
    ['hi','instant-qr-code-generator','QR कोड जनरेटर',['QR code बनाने का टूल'],'https://fastols.com/hi/'],
  ] as const).map(([locale,slug,primary,alternate,sourceUrls]) => ({locale,slug,primaryKeyword:primary,alternateKeywords:[...alternate],intent:'tool' as const,sourceUrls:[sourceUrls],notes:'Observed in current Hindi/Indian tool catalogs; Hinglish and English technical tokens are intentionally retained.'})),
];


export const INTERNATIONAL_KEYWORD_VALIDATIONS: readonly InternationalKeywordValidation[] = [
  ...BASE_INTERNATIONAL_KEYWORD_VALIDATIONS,
  ...CORE_PDF_VALIDATIONS,
  ...ADDITIONAL_CATALOG_VALIDATIONS,
  ...ADDITIONAL_LOCAL_CATALOG_VALIDATIONS,
  ...EVIDENCE_CATALOG_VALIDATIONS,
].filter((row, index, rows) =>
  rows.findIndex((candidate) => candidate.locale === row.locale && candidate.slug === row.slug) === index
);

export function getInternationalKeywordValidation(locale: string, slug: string) {
  return INTERNATIONAL_KEYWORD_VALIDATIONS.find(
    (row) => row.locale === locale && row.slug === slug
  );
}
