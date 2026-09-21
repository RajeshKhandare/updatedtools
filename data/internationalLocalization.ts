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
  toolsLabel: string;
  freeLabel: string;
  browserLabel: string;
  guideLabel: string;
  guideDescription: string;
  openEnglish: string;
  relatedLabel: string;
  categoriesLabel: string;
  popularToolsLabel: string;
  platformLabel: string;
  viewAllLabel: string;
  aboutLabel: string;
  contactLabel: string;
  privacyLabel: string;
  termsLabel: string;
  operationalLabel: string;
  footerDescription: string;
  craftedLabel: string;
  description: string;
};

export const LOCALIZED_UI: Record<LocaleCode, LocalizedUi> = {
  en: { toolLabel: 'Tool', toolsLabel: 'Tools', freeLabel: 'Free online tool', browserLabel: 'Works in your browser', guideLabel: 'Tool guide', guideDescription: 'This localized route is part of Toolployee international coverage. Full tool guides, FAQs, examples, and keyword targeting are localized separately.', openEnglish: 'Open English version', relatedLabel: 'Related tools', categoriesLabel: 'Categories', popularToolsLabel: 'Popular tools', platformLabel: 'Platform', viewAllLabel: 'View all', aboutLabel: 'About Us', contactLabel: 'Contact Support', privacyLabel: 'Privacy Policy', termsLabel: 'Terms of Service', operationalLabel: '87 tools operational · Free to use', footerDescription: 'Free, fast, and accessible digital utilities built for creators, students, and developers. Edit, calculate, and convert directly in your browser.', craftedLabel: 'Crafted for speed and privacy', description: 'Use this browser-based utility without installing a separate desktop application.' },
  pt: { toolLabel: 'Ferramenta', toolsLabel: 'Ferramentas', freeLabel: 'Ferramenta online gratuita', browserLabel: 'Funciona no navegador', guideLabel: 'Guia da ferramenta', guideDescription: 'Esta rota localizada faz parte da cobertura internacional do Toolployee. Guias, perguntas frequentes, exemplos e palavras-chave são localizados e revisados separadamente.', openEnglish: 'Abrir versão em inglês', relatedLabel: 'Ferramentas relacionadas', categoriesLabel: 'Categorias', popularToolsLabel: 'Ferramentas populares', platformLabel: 'Plataforma', viewAllLabel: 'Ver tudo', aboutLabel: 'Sobre nós', contactLabel: 'Suporte', privacyLabel: 'Política de privacidade', termsLabel: 'Termos de serviço', operationalLabel: '87 ferramentas disponíveis · Grátis', footerDescription: 'Ferramentas digitais gratuitas, rápidas e acessíveis para criadores, estudantes e desenvolvedores. Edite, calcule e converta diretamente no navegador.', craftedLabel: 'Feito para velocidade e privacidade', description: 'Use esta ferramenta no navegador sem instalar um aplicativo separado.' },
  es: { toolLabel: 'Herramienta', toolsLabel: 'Herramientas', freeLabel: 'Herramienta online gratuita', browserLabel: 'Funciona en tu navegador', guideLabel: 'Guía de la herramienta', guideDescription: 'Esta ruta localizada forma parte de la cobertura internacional de Toolployee. Las guías, preguntas frecuentes, ejemplos y palabras clave se localizan y revisan por separado.', openEnglish: 'Abrir versión en inglés', relatedLabel: 'Herramientas relacionadas', categoriesLabel: 'Categorías', popularToolsLabel: 'Herramientas populares', platformLabel: 'Plataforma', viewAllLabel: 'Ver todo', aboutLabel: 'Sobre nosotros', contactLabel: 'Soporte', privacyLabel: 'Política de privacidad', termsLabel: 'Términos del servicio', operationalLabel: '87 herramientas operativas · Gratis', footerDescription: 'Herramientas digitales gratuitas, rápidas y accesibles para creadores, estudiantes y desarrolladores. Edita, calcula y convierte directamente en tu navegador.', craftedLabel: 'Diseñado para velocidad y privacidad', description: 'Usa esta herramienta en el navegador sin instalar una aplicación independiente.' },
  de: { toolLabel: 'Tool', toolsLabel: 'Tools', freeLabel: 'Kostenloses Online-Tool', browserLabel: 'Funktioniert im Browser', guideLabel: 'Tool-Anleitung', guideDescription: 'Diese lokalisierte Route ist Teil der internationalen Abdeckung von Toolployee. Anleitungen, FAQs, Beispiele und Keywords werden separat lokalisiert und geprüft.', openEnglish: 'Englische Version öffnen', relatedLabel: 'Ähnliche Tools', categoriesLabel: 'Kategorien', popularToolsLabel: 'Beliebte Tools', platformLabel: 'Plattform', viewAllLabel: 'Alle anzeigen', aboutLabel: 'Über uns', contactLabel: 'Support', privacyLabel: 'Datenschutz', termsLabel: 'Nutzungsbedingungen', operationalLabel: '87 Tools verfügbar · Kostenlos', footerDescription: 'Kostenlose, schnelle und zugängliche digitale Tools für Creator, Studierende und Entwickler. Direkt im Browser bearbeiten, berechnen und konvertieren.', craftedLabel: 'Für Geschwindigkeit und Datenschutz entwickelt', description: 'Nutze dieses browserbasierte Tool ohne eine separate Desktop-Anwendung zu installieren.' },
  fr: { toolLabel: 'Outil', toolsLabel: 'Outils', freeLabel: 'Outil en ligne gratuit', browserLabel: 'Fonctionne dans le navigateur', guideLabel: 'Guide de l’outil', guideDescription: 'Cette route localisée fait partie de la couverture internationale de Toolployee. Les guides, FAQ, exemples et mots-clés sont localisés et révisés séparément.', openEnglish: 'Ouvrir la version anglaise', relatedLabel: 'Outils associés', categoriesLabel: 'Catégories', popularToolsLabel: 'Outils populaires', platformLabel: 'Plateforme', viewAllLabel: 'Tout voir', aboutLabel: 'À propos', contactLabel: 'Assistance', privacyLabel: 'Politique de confidentialité', termsLabel: 'Conditions d’utilisation', operationalLabel: '87 outils opérationnels · Gratuits', footerDescription: 'Des outils numériques gratuits, rapides et accessibles pour les créateurs, étudiants et développeurs. Modifiez, calculez et convertissez directement dans votre navigateur.', craftedLabel: 'Conçu pour la rapidité et la confidentialité', description: 'Utilisez cet outil dans votre navigateur sans installer une application de bureau séparée.' },
  it: { toolLabel: 'Strumento', toolsLabel: 'Strumenti', freeLabel: 'Strumento online gratuito', browserLabel: 'Funziona nel browser', guideLabel: 'Guida dello strumento', guideDescription: 'Questa rotta localizzata fa parte della copertura internazionale di Toolployee. Guide, FAQ, esempi e parole chiave vengono localizzati e revisionati separatamente.', openEnglish: 'Apri la versione inglese', relatedLabel: 'Strumenti correlati', categoriesLabel: 'Categorie', popularToolsLabel: 'Strumenti popolari', platformLabel: 'Piattaforma', viewAllLabel: 'Vedi tutto', aboutLabel: 'Chi siamo', contactLabel: 'Assistenza', privacyLabel: 'Privacy', termsLabel: 'Termini di servizio', operationalLabel: '87 strumenti operativi · Gratis', footerDescription: 'Strumenti digitali gratuiti, veloci e accessibili per creator, studenti e sviluppatori. Modifica, calcola e converti direttamente nel browser.', craftedLabel: 'Progettato per velocità e privacy', description: 'Usa questo strumento nel browser senza installare un’applicazione desktop separata.' },
  ja: { toolLabel: 'ツール', toolsLabel: 'ツール', freeLabel: '無料オンラインツール', browserLabel: 'ブラウザで利用できます', guideLabel: 'ツールガイド', guideDescription: 'このローカライズされたルートはToolployeeの国際対応の一部です。ガイド、FAQ、例、キーワードは個別にローカライズして確認します。', openEnglish: '英語版を開く', relatedLabel: '関連ツール', categoriesLabel: 'カテゴリー', popularToolsLabel: '人気のツール', platformLabel: 'プラットフォーム', viewAllLabel: 'すべて表示', aboutLabel: '概要', contactLabel: 'サポート', privacyLabel: 'プライバシーポリシー', termsLabel: '利用規約', operationalLabel: '87個のツール · 無料', footerDescription: 'クリエイター、学生、開発者向けの無料で高速なデジタルツール。ブラウザで直接編集、計算、変換できます。', craftedLabel: '高速・プライバシー重視', description: '別のデスクトップアプリをインストールせず、ブラウザでこのツールを利用できます。' },
  ko: { toolLabel: '도구', toolsLabel: '도구', freeLabel: '무료 온라인 도구', browserLabel: '브라우저에서 실행', guideLabel: '도구 가이드', guideDescription: '이 현지화 경로는 Toolployee의 국제 지원 범위에 포함됩니다. 가이드, FAQ, 예시와 키워드는 별도로 현지화하고 검토합니다.', openEnglish: '영어 버전 열기', relatedLabel: '관련 도구', categoriesLabel: '카테고리', popularToolsLabel: '인기 도구', platformLabel: '플랫폼', viewAllLabel: '모두 보기', aboutLabel: '소개', contactLabel: '지원', privacyLabel: '개인정보처리방침', termsLabel: '서비스 약관', operationalLabel: '87개 도구 운영 · 무료', footerDescription: '크리에이터, 학생, 개발자를 위한 빠르고 접근성 높은 무료 디지털 도구입니다. 브라우저에서 바로 편집, 계산, 변환할 수 있습니다.', craftedLabel: '속도와 개인정보 보호를 위해 제작', description: '별도의 데스크톱 애플리케이션을 설치하지 않고 브라우저에서 사용할 수 있습니다.' },
  zh: { toolLabel: '工具', toolsLabel: '工具', freeLabel: '免费在线工具', browserLabel: '可在浏览器中使用', guideLabel: '工具指南', guideDescription: '此本地化路线属于 Toolployee 国际化覆盖范围。工具指南、常见问题、示例和关键词会单独进行本地化和审核。', openEnglish: '打开英文版本', relatedLabel: '相关工具', categoriesLabel: '分类', popularToolsLabel: '热门工具', platformLabel: '平台', viewAllLabel: '查看全部', aboutLabel: '关于我们', contactLabel: '联系支持', privacyLabel: '隐私政策', termsLabel: '服务条款', operationalLabel: '87 个工具 · 免费使用', footerDescription: '为创作者、学生和开发者提供免费、快速且易用的数字工具，可直接在浏览器中编辑、计算和转换。', craftedLabel: '为速度和隐私而打造', description: '无需安装独立桌面应用，即可在浏览器中使用此工具。' },
  ru: { toolLabel: 'Инструмент', toolsLabel: 'Инструменты', freeLabel: 'Бесплатный онлайн-инструмент', browserLabel: 'Работает в браузере', guideLabel: 'Руководство по инструменту', guideDescription: 'Этот локализованный маршрут входит в международное покрытие Toolployee. Руководства, FAQ, примеры и ключевые слова локализуются и проверяются отдельно.', openEnglish: 'Открыть английскую версию', relatedLabel: 'Похожие инструменты', categoriesLabel: 'Категории', popularToolsLabel: 'Популярные инструменты', platformLabel: 'Платформа', viewAllLabel: 'Показать все', aboutLabel: 'О нас', contactLabel: 'Поддержка', privacyLabel: 'Политика конфиденциальности', termsLabel: 'Условия использования', operationalLabel: '87 инструментов · Бесплатно', footerDescription: 'Бесплатные, быстрые и доступные цифровые инструменты для создателей, студентов и разработчиков. Редактируйте, считайте и конвертируйте прямо в браузере.', craftedLabel: 'Создано для скорости и конфиденциальности', description: 'Используйте этот инструмент в браузере без установки отдельного приложения.' },
  ar: { toolLabel: 'أداة', toolsLabel: 'أدوات', freeLabel: 'أداة مجانية عبر الإنترنت', browserLabel: 'تعمل في المتصفح', guideLabel: 'دليل الأداة', guideDescription: 'هذا المسار المترجم جزء من التغطية الدولية لـ Toolployee. تتم ترجمة الأدلة والأسئلة الشائعة والأمثلة والكلمات المفتاحية ومراجعتها بشكل منفصل.', openEnglish: 'فتح النسخة الإنجليزية', relatedLabel: 'أدوات ذات صلة', categoriesLabel: 'الفئات', popularToolsLabel: 'أدوات شائعة', platformLabel: 'المنصة', viewAllLabel: 'عرض الكل', aboutLabel: 'من نحن', contactLabel: 'الدعم', privacyLabel: 'سياسة الخصوصية', termsLabel: 'شروط الخدمة', operationalLabel: '87 أداة · مجانية', footerDescription: 'أدوات رقمية مجانية وسريعة وسهلة الاستخدام للمبدعين والطلاب والمطورين. حرر واحسب وحوّل مباشرة في المتصفح.', craftedLabel: 'مصممة للسرعة والخصوصية', description: 'استخدم هذه الأداة في المتصفح دون تثبيت تطبيق منفصل على سطح المكتب.' },
  hi: { toolLabel: 'टूल', toolsLabel: 'टूल्स', freeLabel: 'मुफ्त ऑनलाइन टूल', browserLabel: 'ब्राउज़र में काम करता है', guideLabel: 'टूल गाइड', guideDescription: 'यह लोकलाइज़्ड रूट Toolployee की अंतरराष्ट्रीय कवरेज का हिस्सा है। गाइड, FAQ, उदाहरण और कीवर्ड अलग से लोकलाइज़ और रिव्यू किए जाते हैं।', openEnglish: 'अंग्रेज़ी संस्करण खोलें', relatedLabel: 'संबंधित टूल्स', categoriesLabel: 'श्रेणियाँ', popularToolsLabel: 'लोकप्रिय टूल्स', platformLabel: 'प्लेटफ़ॉर्म', viewAllLabel: 'सभी देखें', aboutLabel: 'हमारे बारे में', contactLabel: 'सपोर्ट', privacyLabel: 'प्राइवेसी पॉलिसी', termsLabel: 'सेवा की शर्तें', operationalLabel: '87 टूल्स उपलब्ध · मुफ्त', footerDescription: 'क्रिएटर्स, छात्रों और डेवलपर्स के लिए मुफ्त, तेज़ और आसान डिजिटल टूल्स। ब्राउज़र में सीधे एडिट, कैलकुलेट और कन्वर्ट करें।', craftedLabel: 'स्पीड और प्राइवेसी के लिए बनाया गया', description: 'अलग डेस्कटॉप ऐप इंस्टॉल किए बिना इस टूल का उपयोग ब्राउज़र में करें।' },
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


const CATEGORY_LABELS: Record<LocaleCode, Record<string, string>> = {
  en: { PDF: 'PDF Tools', Image: 'Image Tools', Compiler: 'Compilers & Code', Finance: 'Finance Calculators', Developer: 'Developer Tools', Text: 'Text Tools', Converters: 'Converters', Calculators: 'Calculators', YouTube: 'YouTube Tools' },
  pt: { PDF: 'Ferramentas PDF', Image: 'Ferramentas de imagem', Compiler: 'Compiladores e código', Finance: 'Calculadoras financeiras', Developer: 'Ferramentas para desenvolvedores', Text: 'Ferramentas de texto', Converters: 'Conversores', Calculators: 'Calculadoras', YouTube: 'Ferramentas do YouTube' },
  es: { PDF: 'Herramientas PDF', Image: 'Herramientas de imagen', Compiler: 'Compiladores y código', Finance: 'Calculadoras financieras', Developer: 'Herramientas para desarrolladores', Text: 'Herramientas de texto', Converters: 'Convertidores', Calculators: 'Calculadoras', YouTube: 'Herramientas de YouTube' },
  de: { PDF: 'PDF-Tools', Image: 'Bildtools', Compiler: 'Compiler & Code', Finance: 'Finanzrechner', Developer: 'Entwicklertools', Text: 'Texttools', Converters: 'Konverter', Calculators: 'Rechner', YouTube: 'YouTube-Tools' },
  fr: { PDF: 'Outils PDF', Image: 'Outils image', Compiler: 'Compilateurs et code', Finance: 'Calculateurs financiers', Developer: 'Outils pour développeurs', Text: 'Outils de texte', Converters: 'Convertisseurs', Calculators: 'Calculatrices', YouTube: 'Outils YouTube' },
  it: { PDF: 'Strumenti PDF', Image: 'Strumenti immagine', Compiler: 'Compilatori e codice', Finance: 'Calcolatori finanziari', Developer: 'Strumenti per sviluppatori', Text: 'Strumenti di testo', Converters: 'Convertitori', Calculators: 'Calcolatori', YouTube: 'Strumenti YouTube' },
  ja: { PDF: 'PDFツール', Image: '画像ツール', Compiler: 'コンパイラとコード', Finance: '金融計算機', Developer: '開発者ツール', Text: 'テキストツール', Converters: '変換ツール', Calculators: '計算機', YouTube: 'YouTubeツール' },
  ko: { PDF: 'PDF 도구', Image: '이미지 도구', Compiler: '컴파일러 및 코드', Finance: '금융 계산기', Developer: '개발자 도구', Text: '텍스트 도구', Converters: '변환 도구', Calculators: '계산기', YouTube: 'YouTube 도구' },
  zh: { PDF: 'PDF工具', Image: '图片工具', Compiler: '编译器与代码', Finance: '财务计算器', Developer: '开发者工具', Text: '文本工具', Converters: '转换工具', Calculators: '计算器', YouTube: 'YouTube工具' },
  ru: { PDF: 'PDF-инструменты', Image: 'Инструменты изображений', Compiler: 'Компиляторы и код', Finance: 'Финансовые калькуляторы', Developer: 'Инструменты разработчика', Text: 'Текстовые инструменты', Converters: 'Конвертеры', Calculators: 'Калькуляторы', YouTube: 'Инструменты YouTube' },
  ar: { PDF: 'أدوات PDF', Image: 'أدوات الصور', Compiler: 'المترجمات والبرمجة', Finance: 'حاسبات مالية', Developer: 'أدوات المطورين', Text: 'أدوات النصوص', Converters: 'المحوّلات', Calculators: 'الحاسبات', YouTube: 'أدوات YouTube' },
  hi: { PDF: 'PDF टूल्स', Image: 'इमेज टूल्स', Compiler: 'कंपाइलर और कोड', Finance: 'वित्तीय कैलकुलेटर', Developer: 'डेवलपर टूल्स', Text: 'टेक्स्ट टूल्स', Converters: 'कन्वर्टर्स', Calculators: 'कैलकुलेटर', YouTube: 'YouTube टूल्स' },
};

export function getLocalizedCategoryLabel(category: string, locale: LocaleCode): string {
  return CATEGORY_LABELS[locale]?.[category] || CATEGORY_LABELS.en[category] || category;
}
const GENERATED_NAME_TERMS: Record<Exclude<LocaleCode, 'en'>, Record<string, string>> = {
  pt: { 'Add Page Numbers to PDF':'Adicionar números de página ao PDF','Delete Pages from PDF':'Excluir páginas do PDF','Reorder PDF Pages':'Reordenar páginas do PDF','PDF to Grayscale Converter':'Conversor de PDF para escala de cinza','Black and White Image Converter':'Conversor de imagem para preto e branco','Invert Image Colors':'Inverter cores da imagem','Flip and Rotate Image':'Virar e girar imagem','Blur Image Online':'Desfocar imagem online','Image Color Palette Generator':'Gerador de paleta de cores de imagem','User Agent Parser':'Analisador de User Agent','Remove Duplicate Lines':'Remover linhas duplicadas','Lorem Ipsum Generator':'Gerador de Lorem Ipsum','Reverse Text Generator':'Gerador de texto reverso','Text Diff Checker':'Comparador de diferenças de texto','Alphabetical Order Tool':'Ferramenta de ordem alfabética','Remove HTML Tags':'Remover tags HTML','Find and Replace Text':'Localizar e substituir texto','Length':'Comprimento','Weight':'Peso','Temperature':'Temperatura','Data Size':'Tamanho de dados','Speed':'Velocidade','Time':'Tempo','Area':'Área','Pressure':'Pressão','Energy':'Energia','Power':'Potência','Salary':'Salário','Retirement':'Aposentadoria','Compound Interest':'Juros compostos','Simple Interest':'Juros simples','Percentage':'Porcentagem','Age':'Idade','Scientific':'Científica','Discount':'Desconto','Tip':'Gorjeta','Thumbnail Downloader':'Baixador de miniaturas','Tag Generator':'Gerador de tags','Money Calculator':'Calculadora de ganhos' },
  es: { 'Add Page Numbers to PDF':'Añadir números de página al PDF','Delete Pages from PDF':'Eliminar páginas del PDF','Reorder PDF Pages':'Reordenar páginas del PDF','PDF to Grayscale Converter':'Convertidor de PDF a escala de grises','Black and White Image Converter':'Convertidor de imagen a blanco y negro','Invert Image Colors':'Invertir colores de imagen','Flip and Rotate Image':'Voltear y rotar imagen','Blur Image Online':'Desenfocar imagen online','Image Color Palette Generator':'Generador de paleta de colores de imagen','User Agent Parser':'Analizador de User Agent','Remove Duplicate Lines':'Eliminar líneas duplicadas','Lorem Ipsum Generator':'Generador de Lorem Ipsum','Reverse Text Generator':'Generador de texto inverso','Text Diff Checker':'Comparador de diferencias de texto','Alphabetical Order Tool':'Herramienta de orden alfabético','Remove HTML Tags':'Eliminar etiquetas HTML','Find and Replace Text':'Buscar y reemplazar texto','Length':'Longitud','Weight':'Peso','Temperature':'Temperatura','Data Size':'Tamaño de datos','Speed':'Velocidad','Time':'Tiempo','Area':'Área','Pressure':'Presión','Energy':'Energía','Power':'Potencia','Salary':'Salario','Retirement':'Jubilación','Compound Interest':'Interés compuesto','Simple Interest':'Interés simple','Percentage':'Porcentaje','Age':'Edad','Scientific':'Científica','Discount':'Descuento','Tip':'Propina','Thumbnail Downloader':'Descargador de miniaturas','Tag Generator':'Generador de etiquetas','Money Calculator':'Calculadora de ganancias' },
  de: { 'Add Page Numbers to PDF':'Seitenzahlen zu PDF hinzufügen','Delete Pages from PDF':'PDF-Seiten löschen','Reorder PDF Pages':'PDF-Seiten neu anordnen','PDF to Grayscale Converter':'PDF-zu-Graustufen-Konverter','Black and White Image Converter':'Schwarz-Weiß-Bildkonverter','Invert Image Colors':'Bildfarben invertieren','Flip and Rotate Image':'Bild spiegeln und drehen','Blur Image Online':'Bild online weichzeichnen','Image Color Palette Generator':'Farbpaletten-Generator für Bilder','User Agent Parser':'User-Agent-Parser','Remove Duplicate Lines':'Doppelte Zeilen entfernen','Lorem Ipsum Generator':'Lorem-Ipsum-Generator','Reverse Text Generator':'Text umkehren','Text Diff Checker':'Text-Diff-Prüfer','Alphabetical Order Tool':'Alphabetische Sortierung','Remove HTML Tags':'HTML-Tags entfernen','Find and Replace Text':'Suchen und Ersetzen','Length':'Länge','Weight':'Gewicht','Temperature':'Temperatur','Data Size':'Datengröße','Speed':'Geschwindigkeit','Time':'Zeit','Area':'Fläche','Pressure':'Druck','Energy':'Energie','Power':'Leistung','Salary':'Gehalt','Retirement':'Rente','Compound Interest':'Zinseszins','Simple Interest':'Zins','Percentage':'Prozent','Age':'Alter','Scientific':'Wissenschaftlicher','Discount':'Rabatt','Tip':'Trinkgeld','Thumbnail Downloader':'Miniaturbild-Downloader','Tag Generator':'Tag-Generator','Money Calculator':'Einnahmen-Rechner' },
  fr: { 'Add Page Numbers to PDF':'Ajouter des numéros de page au PDF','Delete Pages from PDF':'Supprimer des pages d’un PDF','Reorder PDF Pages':'Réorganiser les pages d’un PDF','PDF to Grayscale Converter':'Convertisseur PDF en niveaux de gris','Black and White Image Converter':'Convertisseur d’image en noir et blanc','Invert Image Colors':'Inverser les couleurs d’une image','Flip and Rotate Image':'Retourner et faire pivoter une image','Blur Image Online':'Flouter une image en ligne','Image Color Palette Generator':'Générateur de palette de couleurs d’image','User Agent Parser':'Analyseur User Agent','Remove Duplicate Lines':'Supprimer les lignes en double','Lorem Ipsum Generator':'Générateur de Lorem Ipsum','Reverse Text Generator':'Générateur de texte inversé','Text Diff Checker':'Comparateur de texte','Alphabetical Order Tool':'Outil de tri alphabétique','Remove HTML Tags':'Supprimer les balises HTML','Find and Replace Text':'Rechercher et remplacer du texte','Length':'Longueur','Weight':'Poids','Temperature':'Température','Data Size':'Taille des données','Speed':'Vitesse','Time':'Temps','Area':'Surface','Pressure':'Pression','Energy':'Énergie','Power':'Puissance','Salary':'Salaire','Retirement':'Retraite','Compound Interest':'Intérêts composés','Simple Interest':'Intérêts simples','Percentage':'Pourcentage','Age':'Âge','Scientific':'Scientifique','Discount':'Remise','Tip':'Pourboire','Thumbnail Downloader':'Téléchargeur de miniatures','Tag Generator':'Générateur de tags','Money Calculator':'Calculateur de revenus' },
  it: { 'Add Page Numbers to PDF':'Aggiungi numeri di pagina al PDF','Delete Pages from PDF':'Elimina pagine dal PDF','Reorder PDF Pages':'Riordina le pagine del PDF','PDF to Grayscale Converter':'Convertitore PDF in scala di grigi','Black and White Image Converter':'Convertitore di immagini in bianco e nero','Invert Image Colors':'Inverti i colori dell’immagine','Flip and Rotate Image':'Capovolgi e ruota immagine','Blur Image Online':'Sfoca immagini online','Image Color Palette Generator':'Generatore di palette di colori da immagine','User Agent Parser':'Parser User Agent','Remove Duplicate Lines':'Rimuovi righe duplicate','Lorem Ipsum Generator':'Generatore Lorem Ipsum','Reverse Text Generator':'Generatore di testo inverso','Text Diff Checker':'Controllo differenze di testo','Alphabetical Order Tool':'Strumento ordine alfabetico','Remove HTML Tags':'Rimuovi tag HTML','Find and Replace Text':'Trova e sostituisci testo','Length':'Lunghezza','Weight':'Peso','Temperature':'Temperatura','Data Size':'Dimensione dati','Speed':'Velocità','Time':'Tempo','Area':'Area','Pressure':'Pressione','Energy':'Energia','Power':'Potenza','Salary':'Stipendio','Retirement':'Pensione','Compound Interest':'Interesse composto','Simple Interest':'Interesse semplice','Percentage':'Percentuale','Age':'Età','Scientific':'Scientifica','Discount':'Sconto','Tip':'Mancia','Thumbnail Downloader':'Downloader di miniature','Tag Generator':'Generatore di tag','Money Calculator':'Calcolatore guadagni' },
  ja: { 'Add Page Numbers to PDF':'PDFにページ番号を追加','Delete Pages from PDF':'PDFのページを削除','Reorder PDF Pages':'PDFのページを並べ替え','PDF to Grayscale Converter':'PDFをグレースケールに変換','Black and White Image Converter':'画像を白黒に変換','Invert Image Colors':'画像の色を反転','Flip and Rotate Image':'画像を反転・回転','Blur Image Online':'画像をオンラインでぼかす','Image Color Palette Generator':'画像カラーパレット生成','User Agent Parser':'User Agent解析','Remove Duplicate Lines':'重複行を削除','Lorem Ipsum Generator':'Lorem Ipsum生成','Reverse Text Generator':'テキスト反転生成','Text Diff Checker':'テキスト差分チェッカー','Alphabetical Order Tool':'アルファベット順ツール','Remove HTML Tags':'HTMLタグを削除','Find and Replace Text':'検索と置換','Length':'長さ','Weight':'重量','Temperature':'温度','Data Size':'データサイズ','Speed':'速度','Time':'時間','Area':'面積','Pressure':'圧力','Energy':'エネルギー','Power':'電力','Salary':'給与','Retirement':'退職','Compound Interest':'複利','Simple Interest':'単利','Percentage':'パーセント','Age':'年齢','Scientific':'関数','Discount':'割引','Tip':'チップ','Thumbnail Downloader':'サムネイルダウンローダー','Tag Generator':'タグ生成ツール','Money Calculator':'収益計算機' },
  ko: { 'Add Page Numbers to PDF':'PDF에 페이지 번호 추가','Delete Pages from PDF':'PDF 페이지 삭제','Reorder PDF Pages':'PDF 페이지 순서 변경','PDF to Grayscale Converter':'PDF 그레이스케일 변환','Black and White Image Converter':'흑백 이미지 변환','Invert Image Colors':'이미지 색상 반전','Flip and Rotate Image':'이미지 뒤집기 및 회전','Blur Image Online':'온라인 이미지 블러','Image Color Palette Generator':'이미지 색상 팔레트 생성기','User Agent Parser':'User Agent 파서','Remove Duplicate Lines':'중복 줄 제거','Lorem Ipsum Generator':'Lorem Ipsum 생성기','Reverse Text Generator':'텍스트 뒤집기 생성기','Text Diff Checker':'텍스트 차이 비교기','Alphabetical Order Tool':'알파벳 순서 도구','Remove HTML Tags':'HTML 태그 제거','Find and Replace Text':'찾기 및 바꾸기','Length':'길이','Weight':'무게','Temperature':'온도','Data Size':'데이터 크기','Speed':'속도','Time':'시간','Area':'면적','Pressure':'압력','Energy':'에너지','Power':'전력','Salary':'급여','Retirement':'은퇴','Compound Interest':'복리','Simple Interest':'단리','Percentage':'백분율','Age':'나이','Scientific':'공학용','Discount':'할인','Tip':'팁','Thumbnail Downloader':'썸네일 다운로더','Tag Generator':'태그 생성기','Money Calculator':'수익 계산기' },
  zh: { 'Add Page Numbers to PDF':'为PDF添加页码','Delete Pages from PDF':'删除PDF页面','Reorder PDF Pages':'重新排列PDF页面','PDF to Grayscale Converter':'PDF转灰度转换器','Black and White Image Converter':'黑白图片转换器','Invert Image Colors':'反转图片颜色','Flip and Rotate Image':'翻转和旋转图片','Blur Image Online':'在线图片模糊','Image Color Palette Generator':'图片调色板生成器','User Agent Parser':'User Agent解析器','Remove Duplicate Lines':'删除重复行','Lorem Ipsum Generator':'Lorem Ipsum生成器','Reverse Text Generator':'文本反转生成器','Text Diff Checker':'文本差异检查器','Alphabetical Order Tool':'字母排序工具','Remove HTML Tags':'删除HTML标签','Find and Replace Text':'查找和替换文本','Length':'长度','Weight':'重量','Temperature':'温度','Data Size':'数据大小','Speed':'速度','Time':'时间','Area':'面积','Pressure':'压力','Energy':'能量','Power':'功率','Salary':'工资','Retirement':'退休','Compound Interest':'复利','Simple Interest':'单利','Percentage':'百分比','Age':'年龄','Scientific':'科学','Discount':'折扣','Tip':'小费','Thumbnail Downloader':'缩略图下载器','Tag Generator':'标签生成器','Money Calculator':'收益计算器' },
  ru: { 'Add Page Numbers to PDF':'Добавить номера страниц в PDF','Delete Pages from PDF':'Удалить страницы из PDF','Reorder PDF Pages':'Изменить порядок страниц PDF','PDF to Grayscale Converter':'Конвертер PDF в оттенки серого','Black and White Image Converter':'Конвертер изображения в чёрно-белое','Invert Image Colors':'Инвертировать цвета изображения','Flip and Rotate Image':'Отразить и повернуть изображение','Blur Image Online':'Размыть изображение онлайн','Image Color Palette Generator':'Генератор цветовой палитры изображения','User Agent Parser':'Парсер User Agent','Remove Duplicate Lines':'Удалить дублирующиеся строки','Lorem Ipsum Generator':'Генератор Lorem Ipsum','Reverse Text Generator':'Генератор обратного текста','Text Diff Checker':'Проверка различий текста','Alphabetical Order Tool':'Инструмент сортировки по алфавиту','Remove HTML Tags':'Удалить HTML-теги','Find and Replace Text':'Поиск и замена текста','Length':'Длина','Weight':'Вес','Temperature':'Температура','Data Size':'Размер данных','Speed':'Скорость','Time':'Время','Area':'Площадь','Pressure':'Давление','Energy':'Энергия','Power':'Мощность','Salary':'Зарплата','Retirement':'Пенсия','Compound Interest':'Сложный процент','Simple Interest':'Простой процент','Percentage':'Процент','Age':'Возраст','Scientific':'Инженерный','Discount':'Скидка','Tip':'Чаевые','Thumbnail Downloader':'Загрузчик миниатюр','Tag Generator':'Генератор тегов','Money Calculator':'Калькулятор дохода' },
  ar: { 'Add Page Numbers to PDF':'إضافة أرقام الصفحات إلى PDF','Delete Pages from PDF':'حذف صفحات من PDF','Reorder PDF Pages':'إعادة ترتيب صفحات PDF','PDF to Grayscale Converter':'محول PDF إلى تدرج الرمادي','Black and White Image Converter':'محول الصور إلى أبيض وأسود','Invert Image Colors':'عكس ألوان الصورة','Flip and Rotate Image':'قلب الصورة وتدويرها','Blur Image Online':'طمس الصورة عبر الإنترنت','Image Color Palette Generator':'مولد لوحة ألوان الصورة','User Agent Parser':'محلل User Agent','Remove Duplicate Lines':'إزالة الأسطر المكررة','Lorem Ipsum Generator':'مولد Lorem Ipsum','Reverse Text Generator':'مولد النص المعكوس','Text Diff Checker':'مدقق اختلاف النصوص','Alphabetical Order Tool':'أداة الترتيب الأبجدي','Remove HTML Tags':'إزالة علامات HTML','Find and Replace Text':'بحث واستبدال النص','Length':'الطول','Weight':'الوزن','Temperature':'درجة الحرارة','Data Size':'حجم البيانات','Speed':'السرعة','Time':'الوقت','Area':'المساحة','Pressure':'الضغط','Energy':'الطاقة','Power':'القدرة','Salary':'الراتب','Retirement':'التقاعد','Compound Interest':'الفائدة المركبة','Simple Interest':'الفائدة البسيطة','Percentage':'النسبة المئوية','Age':'العمر','Scientific':'علمية','Discount':'الخصم','Tip':'البقشيش','Thumbnail Downloader':'منزل المصغرات','Tag Generator':'مولد العلامات','Money Calculator':'حاسبة الأرباح' },
  hi: { 'Add Page Numbers to PDF':'PDF में पेज नंबर जोड़ें','Delete Pages from PDF':'PDF से पेज हटाएँ','Reorder PDF Pages':'PDF पेजों का क्रम बदलें','PDF to Grayscale Converter':'PDF ग्रेस्केल कन्वर्टर','Black and White Image Converter':'ब्लैक एंड व्हाइट इमेज कन्वर्टर','Invert Image Colors':'इमेज के रंग उलटें','Flip and Rotate Image':'इमेज फ्लिप और रोटेट करें','Blur Image Online':'इमेज ऑनलाइन ब्लर करें','Image Color Palette Generator':'इमेज कलर पैलेट जनरेटर','User Agent Parser':'User Agent पार्सर','Remove Duplicate Lines':'डुप्लिकेट लाइन हटाएँ','Lorem Ipsum Generator':'Lorem Ipsum जनरेटर','Reverse Text Generator':'रिवर्स टेक्स्ट जनरेटर','Text Diff Checker':'टेक्स्ट डिफ चेकर','Alphabetical Order Tool':'अल्फाबेटिकल ऑर्डर टूल','Remove HTML Tags':'HTML टैग हटाएँ','Find and Replace Text':'टेक्स्ट खोजें और बदलें','Length':'लंबाई','Weight':'वज़न','Temperature':'तापमान','Data Size':'डेटा साइज़','Speed':'स्पीड','Time':'समय','Area':'क्षेत्रफल','Pressure':'प्रेशर','Energy':'ऊर्जा','Power':'पावर','Salary':'सैलरी','Retirement':'रिटायरमेंट','Compound Interest':'चक्रवृद्धि ब्याज','Simple Interest':'साधारण ब्याज','Percentage':'प्रतिशत','Age':'उम्र','Scientific':'साइंटिफिक','Discount':'डिस्काउंट','Tip':'टिप','Thumbnail Downloader':'थंबनेल डाउनलोडर','Tag Generator':'टैग जनरेटर','Money Calculator':'कमाई कैलकुलेटर' },
};

function generateLocalizedName(tool: ToolMeta, locale: Exclude<LocaleCode, 'en'>): string {
  const terms = GENERATED_NAME_TERMS[locale];
  const exact = terms[tool.name];
  if (exact) return exact;

  const converter = tool.name.match(/^(.+) to (.+) Converter$/);
  if (converter) {
    const from = converter[1], to = converter[2];
    const templates: Record<string, string> = {
      pt: `Conversor de ${from} para ${to}`, es: `Convertidor de ${from} a ${to}`,
      de: `${from}-zu-${to}-Konverter`, fr: `Convertisseur ${from} en ${to}`,
      it: `Convertitore da ${from} a ${to}`, ja: `${from}から${to}への変換`,
      ko: `${from}를 ${to}로 변환`, zh: `${from}转${to}转换器`,
      ru: `Конвертер ${from} в ${to}`, ar: `محول ${from} إلى ${to}`,
      hi: `${from} से ${to} कन्वर्टर`,
    };
    return templates[locale];
  }

  const onlineCompiler = tool.name.match(/^Online (.+) Compiler$/);
  if (onlineCompiler) {
    const language = onlineCompiler[1];
    const templates: Record<string,string> = {
      pt:`Compilador ${language} online`, es:`Compilador de ${language} online`, de:`Online-${language}-Compiler`, fr:`Compilateur ${language} en ligne`, it:`Compilatore ${language} online`, ja:`オンライン${language}コンパイラ`, ko:`온라인 ${language} 컴파일러`, zh:`在线${language}编译器`, ru:`Онлайн-компилятор ${language}`, ar:`مترجم ${language} عبر الإنترنت`, hi:`ऑनलाइन ${language} कंपाइलर`,
    };
    return templates[locale];
  }

  const onlineEditor = tool.name.match(/^Online (.+) Editor$/);
  if (onlineEditor) {
    const subject=onlineEditor[1];
    const templates: Record<string,string> = {
      pt:`Editor ${subject} online`, es:`Editor ${subject} online`, de:`Online-${subject}-Editor`, fr:`Éditeur ${subject} en ligne`, it:`Editor ${subject} online`, ja:`オンライン${subject}エディタ`, ko:`온라인 ${subject} 편집기`, zh:`在线${subject}编辑器`, ru:`Онлайн-редактор ${subject}`, ar:`محرر ${subject} عبر الإنترنت`, hi:`ऑनलाइन ${subject} एडिटर`,
    };
    return templates[locale];
  }

  const calc = tool.name.match(/^(.+) Calculator$/);
  if (calc) {
    const subject=terms[calc[1]] || calc[1];
    const templates: Record<string,string> = {
      pt:`Calculadora de ${subject}`, es:`Calculadora de ${subject}`, de:`${subject}-Rechner`, fr:`Calculateur de ${subject}`, it:`Calcolatore ${subject}`, ja:`${subject}計算機`, ko:`${subject} 계산기`, zh:`${subject}计算器`, ru:`Калькулятор ${subject}`, ar:`حاسبة ${subject}`, hi:`${subject} कैलकुलेटर`,
    };
    return templates[locale];
  }

  const generator = tool.name.match(/^(.+) Generator$/);
  if (generator) {
    const subject=terms[generator[1]] || generator[1];
    const templates: Record<string,string> = {
      pt:`Gerador de ${subject}`, es:`Generador de ${subject}`, de:`${subject}-Generator`, fr:`Générateur de ${subject}`, it:`Generatore ${subject}`, ja:`${subject}生成`, ko:`${subject} 생성기`, zh:`${subject}生成器`, ru:`Генератор ${subject}`, ar:`مولد ${subject}`, hi:`${subject} जनरेटर`,
    };
    return templates[locale];
  }

  let value = tool.name;
  const replacements: Record<string,string> = {
    'Online':'online','Converter':'','Calculator':'','Generator':'','Downloader':'','Tool':'',
    'Length':terms.Length || 'Length','Weight':terms.Weight || 'Weight','Temperature':terms.Temperature || 'Temperature',
    'Data Size':terms['Data Size'] || 'Data Size','Speed':terms.Speed || 'Speed','Time':terms.Time || 'Time',
    'Area':terms.Area || 'Area','Pressure':terms.Pressure || 'Pressure','Energy':terms.Energy || 'Energy','Power':terms.Power || 'Power',
  };
  for (const [from,to] of Object.entries(replacements)) value=value.replaceAll(from,to);
  const suffix: Record<string,string>={pt:'online',es:'online',de:'online',fr:'en ligne',it:'online',ja:'オンライン',ko:'온라인',zh:'在线',ru:'онлайн',ar:'عبر الإنترنت',hi:'ऑनलाइन'};
  return value.replace(/\s+/g,' ').trim() + (tool.name.includes('Online') ? ` ${suffix[locale]}` : '');
}

export function getLocalizedToolName(tool: ToolMeta, locale: LocaleCode): string {
  if (locale === 'en') return tool.name;
  const localeCode = locale as Exclude<LocaleCode, 'en'>;
  const generated = generateLocalizedName(tool, localeCode);
  if (generated && generated !== tool.name) return generated;

  const explicitName = NAME_PHRASES[tool.name]?.[locale];
  if (explicitName) return explicitName;
  const validationLocale = locale === 'pt' ? 'pt-BR' : locale === 'zh' ? 'zh-CN' : locale;
  const evidence = getInternationalKeywordValidation(validationLocale, tool.slug);
  return evidence?.primaryKeyword || generated || tool.name;
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
