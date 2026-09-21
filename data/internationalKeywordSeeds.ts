export interface InternationalKeywordSeed {
  locale: string;
  market: string;
  language: string;
  primaryPatterns: string[];
  secondaryPatterns: string[];
  researchNotes: string[];
}

/** Research seeds only — not search-volume or difficulty claims. */
export const INTERNATIONAL_KEYWORD_SEEDS: readonly InternationalKeywordSeed[] = [
  { locale:'pt-BR', market:'Brazil', language:'Portuguese', primaryPatterns:['ferramenta online','ferramenta grátis','conversor online','editor online'], secondaryPatterns:['converter PDF','compressor de imagem','calculadora online'], researchNotes:['Validate Brazilian Portuguese wording and SERP intent.'] },
  { locale:'es', market:'Spanish-speaking markets', language:'Spanish', primaryPatterns:['herramienta online','herramienta gratis','convertidor online','editor online'], secondaryPatterns:['convertir PDF','comprimir imagen','calculadora online','contador de palabras'], researchNotes:['Validate country-specific Spanish vocabulary.'] },
  { locale:'de', market:'Germany / DACH', language:'German', primaryPatterns:['Online Tool','kostenloses Online-Tool','Online-Konverter','Online-Rechner'], secondaryPatterns:['PDF zusammenfügen','PDF teilen','Bild komprimieren','Wörter zählen'], researchNotes:['Validate German compound nouns and local SERP terminology.'] },
  { locale:'fr', market:'France / Francophone markets', language:'French', primaryPatterns:['outil en ligne','outil gratuit','convertisseur en ligne','calculateur en ligne'], secondaryPatterns:['fusionner PDF','compresser une image','compteur de mots','convertir PDF'], researchNotes:['Validate France-specific terminology before broader Francophone rollout.'] },
  { locale:'it', market:'Italy', language:'Italian', primaryPatterns:['strumento online','strumento gratuito','convertitore online','calcolatrice online'], secondaryPatterns:['unire PDF','dividere PDF','comprimere immagini','contatore parole'], researchNotes:['Validate natural Italian search phrasing against current SERPs.'] },
  { locale:'ja', market:'Japan', language:'Japanese', primaryPatterns:['オンラインツール','無料オンラインツール','オンライン変換','オンライン計算機'], secondaryPatterns:['PDF 結合','PDF 分割','画像 圧縮','文字数 カウント'], researchNotes:['Validate Japanese spacing, script choice, and query intent.'] },
  { locale:'ko', market:'South Korea', language:'Korean', primaryPatterns:['온라인 도구','무료 온라인 도구','온라인 변환기','온라인 계산기'], secondaryPatterns:['PDF 합치기','PDF 분할','이미지 압축','글자 수 세기'], researchNotes:['Validate Korean terminology and spacing against current Korean SERPs.'] },
  { locale:'zh-CN', market:'Simplified Chinese', language:'Simplified Chinese', primaryPatterns:['在线工具','免费在线工具','在线转换器','在线计算器'], secondaryPatterns:['合并PDF','拆分PDF','压缩图片','字数统计'], researchNotes:['Validate target market separately; language alone does not define geography.'] },
  { locale:'ru', market:'Russian-speaking markets', language:'Russian', primaryPatterns:['онлайн инструмент','бесплатный онлайн инструмент','онлайн конвертер','онлайн калькулятор'], secondaryPatterns:['объединить PDF','разделить PDF','сжать изображение','счетчик слов'], researchNotes:['Validate target countries separately.'] },
  { locale:'ar', market:'Arabic-speaking markets', language:'Arabic', primaryPatterns:['أداة عبر الإنترنت','أداة مجانية','محول عبر الإنترنت','حاسبة عبر الإنترنت'], secondaryPatterns:['دمج ملفات PDF','تقسيم PDF','ضغط الصور','عداد الكلمات'], researchNotes:['Validate RTL UI and country-specific Arabic terminology.'] },
  { locale:'hi', market:'India', language:'Hindi', primaryPatterns:['ऑनलाइन टूल','मुफ्त ऑनलाइन टूल','ऑनलाइन कन्वर्टर','ऑनलाइन कैलकुलेटर'], secondaryPatterns:['PDF जोड़ें','PDF विभाजित करें','इमेज कंप्रेस करें','वर्ड काउंटर'], researchNotes:['Validate Hindi versus Hinglish search behavior per tool.'] },
];
