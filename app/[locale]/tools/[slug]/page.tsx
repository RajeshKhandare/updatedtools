import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { TOOLS_REGISTRY } from '@/data/toolsRegistry';
import { LOCALES, getLocale, localizedToolPath } from '@/data/internationalSeo';
import { getLocalizedToolName, getLocalizedUi, getLocalizedCategoryLabel } from '@/data/internationalLocalization';
import { getLocalizedToolSeoContent, getToolSeoContent } from '@/data/toolSeo';
import ToolEngineRunner from '@/components/ToolEngineRunner';
import ToolSeoContent from '@/components/ToolSeoContent';
import FestivalAffiliateLinks from '@/components/FestivalAffiliateLinks';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.code !== 'en').flatMap((locale) =>
    TOOLS_REGISTRY.filter((tool) => tool.category !== 'Festival' || locale.code === 'hi').map((tool) => ({ locale: locale.code, slug: tool.slug }))
  );
}

export default async function LocalizedToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeCode, slug } = await params;
  const locale = getLocale(localeCode);
  const tool = TOOLS_REGISTRY.find((x) => x.slug === slug);
  if (!locale || !tool || locale.code === 'en') notFound();
  if (tool.category === 'Festival' && locale.code !== 'hi') notFound();

  const ui = getLocalizedUi(locale.code);
  const isMergePdf = tool.slug === 'merge-pdf';
  const mergePdfCopy: Record<string, { title: string; description: string }> = {
    pt: { title: 'Juntar ficheiros PDF online grátis', description: 'Combine vários ficheiros PDF num único documento pela ordem escolhida. Junte relatórios, páginas digitalizadas, faturas ou documentos de candidatura e reveja o PDF final antes de o descarregar.' },
    es: { title: 'Unir archivos PDF online gratis', description: 'Combina varios archivos PDF en un solo documento en el orden que elijas. Une informes, páginas escaneadas, facturas o documentos de solicitud y revisa el PDF final antes de descargarlo.' },
    de: { title: 'PDF-Dateien kostenlos online zusammenfügen', description: 'Füge mehrere PDF-Dateien in der gewünschten Reihenfolge zu einem Dokument zusammen. Kombiniere Berichte, Scans, Rechnungen oder Bewerbungsunterlagen und prüfe die fertige PDF-Datei vor dem Download.' },
    fr: { title: 'Fusionner des fichiers PDF gratuitement en ligne', description: 'Regroupez plusieurs fichiers PDF en un seul document dans l’ordre souhaité. Assemblez des rapports, des pages numérisées, des factures ou des dossiers de candidature, puis vérifiez le PDF final avant de le télécharger.' },
    it: { title: 'Unire file PDF online gratis', description: 'Unisci più file PDF in un unico documento nell’ordine che preferisci. Combina report, pagine scansionate, fatture o documenti per candidature e controlla il PDF finale prima di scaricarlo.' },
    ja: { title: 'PDFファイルを無料でオンライン結合', description: '複数のPDFファイルを好きな順番で1つの文書にまとめます。レポート、スキャンしたページ、請求書、応募書類などを結合し、ダウンロード前に完成したPDFを確認できます。' },
    ko: { title: 'PDF 파일 온라인 무료로 합치기', description: '여러 PDF 파일을 원하는 순서대로 하나의 문서로 합치세요. 보고서, 스캔 페이지, 청구서 또는 지원 서류를 결합한 뒤 다운로드 전에 완성된 PDF를 확인할 수 있습니다.' },
    zh: { title: '免费在线合并 PDF 文件', description: '按所需顺序将多个 PDF 文件合并为一个文档。合并报告、扫描页面、发票或申请材料，并在下载前检查最终 PDF。' },
    ru: { title: 'Бесплатно объединить PDF-файлы онлайн', description: 'Объедините несколько PDF-файлов в один документ в нужном порядке. Соединяйте отчёты, отсканированные страницы, счета или документы для заявлений и проверьте итоговый PDF перед скачиванием.' },
    ar: { title: 'دمج ملفات PDF مجانًا عبر الإنترنت', description: 'اجمع عدة ملفات PDF في مستند واحد بالترتيب الذي تختاره. ادمج التقارير والصفحات الممسوحة ضوئيًا والفواتير أو مستندات التقديم، ثم راجع ملف PDF النهائي قبل تنزيله.' },
    hi: { title: 'PDF फ़ाइलें ऑनलाइन मुफ़्त में मर्ज करें', description: 'कई PDF फ़ाइलों को अपनी पसंद के क्रम में एक दस्तावेज़ में जोड़ें। रिपोर्ट, स्कैन किए गए पेज, इनवॉइस या आवेदन के दस्तावेज़ मर्ज करें और डाउनलोड करने से पहले अंतिम PDF जाँचें।' },
  };
  const name = isMergePdf ? (mergePdfCopy[locale.code]?.title || 'Merge PDF Files Online Free') : getLocalizedToolName(tool, locale.code);
  const pageDescription = isMergePdf
    ? (mergePdfCopy[locale.code]?.description || getLocalizedToolSeoContent(tool, locale.code).heroIntro || getLocalizedToolSeoContent(tool, locale.code).intro)
    : getLocalizedToolSeoContent(tool, locale.code).heroIntro || getLocalizedToolSeoContent(tool, locale.code).intro;
  const categoryLabel = getLocalizedCategoryLabel(tool.category, locale.code);
  const isFestival = tool.category === 'Festival';

  const companionTools = TOOLS_REGISTRY
    .filter((candidate) => candidate.category === tool.category && candidate.slug !== tool.slug)
    .map((candidate) => {
      const sourceTerms = new Set((tool.targetKeyword || tool.name).toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 2));
      const candidateTerms = (candidate.targetKeyword || candidate.name).toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 2);
      const overlap = candidateTerms.filter((term) => sourceTerms.has(term)).length;
      return { candidate, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, 4)
    .map(({ candidate }) => candidate);

  return (
    <div lang={locale.code} dir={locale.code === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className={isFestival ? 'relative overflow-hidden border-b border-amber-200/80 dark:border-white/10 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/70 dark:from-zinc-950 dark:via-zinc-950 dark:to-amber-950/10' : 'relative overflow-hidden border-b border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-950'}>
          <div className="absolute inset-0 tool-premium-grid opacity-70 dark:opacity-40" />
          <div className={`absolute -top-24 right-10 h-56 w-56 rounded-full blur-3xl ${isFestival ? 'bg-amber-500/15' : 'bg-violet-500/10'}`} />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 dark:border-violet-400/20 bg-violet-50/80 dark:bg-violet-950/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(124,58,237,.7)]" />
              {isFestival ? `🪔 ${categoryLabel}` : categoryLabel}
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-zinc-950 dark:text-white">
              {name}
            </h1>
            {isFestival && <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700/80 dark:text-amber-300/80">{tool.slug === 'navratri-colors-2026' ? '🌸 Celebrate • Pray • Prepare' : '🪔 Celebrate • Light • Prepare • 🎆'}</p>}
            <p className="mt-3 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-3xl leading-7">
              {pageDescription}
            </p>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <ToolEngineRunner tool={tool} locale={locale.code} />
          {isFestival && tool.slug !== 'navratri-colors-2026' && <FestivalAffiliateLinks tool={tool} locale={locale.code} />}
          <ToolSeoContent tool={tool} locale={locale.code} />

          <div className="mt-14">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                {ui.relatedLabel} {categoryLabel} {ui.toolsLabel}
              </h2>
              <Link
                href={'/' + locale.code + '/tools?category=' + encodeURIComponent(tool.category)}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                {ui.viewAllLabel} {categoryLabel} {ui.toolsLabel} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {companionTools.map((comp) => (
                <Link
                  key={comp.slug}
                  href={localizedToolPath(locale.code, comp.slug)}
                  className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 hover:border-violet-500 dark:hover:border-violet-400 transition-all hover:-translate-y-0.5 group shadow-sm"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                    {getLocalizedToolName(comp, locale.code)}
                  </p>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                    {getLocalizedToolSeoContent(comp, locale.code).intro}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
