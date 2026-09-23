'use client';

import React, { useMemo, useState } from 'react';
import type { LocaleCode } from '@/data/internationalSeo';
import { getEngineUi } from '@/data/engineLocalization';

const card =
  'w-full max-w-4xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5 shadow-sm';

const input =
  'w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500';

const money = (value: number) =>
  `₹${
    Number.isFinite(value)
      ? value.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
        })
      : '0'
  }`;

const numberValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const FINANCE_LABELS: Record<string, Record<string, string>> = {
  en: { investment:'Investment amount', annualReturn:'Annual return %', years:'Years', invested:'Invested', estimatedReturns:'Estimated returns', futureValue:'Future value', monthlyEmi:'Monthly EMI', totalPayment:'Total payment', totalInterest:'Total interest', amount:'Amount', gstRate:'GST rate %', gstMode:'Mode (0 = exclusive, 1 = inclusive)', baseAmount:'Base amount', gst:'GST', total:'Total', grossMonthly:'Gross monthly salary', deductions:'Deductions', estimatedInHand:'Estimated in-hand', unused:'Unused', principalDeposit:'Principal / monthly deposit', annualInterest:'Annual interest %', tenure:'Tenure (years)', principal:'Principal', interest:'Interest', maturity:'Maturity', currentNeed:'Current monthly need', inflationNeed:'Inflation-adjusted monthly need', futureSavings:'Future value of current savings', estimateNote:'Estimates only; actual bank, tax, investment, and retirement outcomes can differ.' },
  pt: { investment:'Valor do investimento', annualReturn:'Retorno anual %', years:'Anos', invested:'Investido', estimatedReturns:'Retornos estimados', futureValue:'Valor futuro', monthlyEmi:'EMI mensal', totalPayment:'Pagamento total', totalInterest:'Juros totais', amount:'Valor', gstRate:'Taxa de GST %', gstMode:'Modo (0 = exclusivo, 1 = inclusivo)', baseAmount:'Valor base', gst:'GST', total:'Total', grossMonthly:'Salário mensal bruto', deductions:'Deduções', estimatedInHand:'Valor líquido estimado', unused:'Não utilizado', principalDeposit:'Principal / depósito mensal', annualInterest:'Juros anuais %', tenure:'Prazo (anos)', principal:'Principal', interest:'Juros', maturity:'Vencimento', currentNeed:'Necessidade mensal atual', inflationNeed:'Necessidade mensal ajustada pela inflação', futureSavings:'Valor futuro da poupança atual', estimateNote:'Apenas estimativas; os resultados reais de banco, impostos, investimentos e aposentadoria podem variar.' },
  es: { investment:'Importe de inversión', annualReturn:'Rendimiento anual %', years:'Años', invested:'Invertido', estimatedReturns:'Rendimientos estimados', futureValue:'Valor futuro', monthlyEmi:'EMI mensual', totalPayment:'Pago total', totalInterest:'Interés total', amount:'Importe', gstRate:'Tasa de GST %', gstMode:'Modo (0 = exclusivo, 1 = incluido)', baseAmount:'Importe base', gst:'GST', total:'Total', grossMonthly:'Salario mensual bruto', deductions:'Deducciones', estimatedInHand:'Neto estimado', unused:'No utilizado', principalDeposit:'Principal / depósito mensual', annualInterest:'Interés anual %', tenure:'Plazo (años)', principal:'Principal', interest:'Interés', maturity:'Vencimiento', currentNeed:'Necesidad mensual actual', inflationNeed:'Necesidad mensual ajustada por inflación', futureSavings:'Valor futuro del ahorro actual', estimateNote:'Solo estimaciones; los resultados reales de bancos, impuestos, inversiones y jubilación pueden variar.' },
  de: { investment:'Anlagebetrag', annualReturn:'Jährliche Rendite %', years:'Jahre', invested:'Investiert', estimatedReturns:'Geschätzte Rendite', futureValue:'Zukünftiger Wert', monthlyEmi:'Monatliche EMI', totalPayment:'Gesamtzahlung', totalInterest:'Gesamtzinsen', amount:'Betrag', gstRate:'GST-Satz %', gstMode:'Modus (0 = exklusive, 1 = inklusive)', baseAmount:'Grundbetrag', gst:'GST', total:'Gesamt', grossMonthly:'Bruttomonatsgehalt', deductions:'Abzüge', estimatedInHand:'Geschätztes Nettogehalt', unused:'Nicht verwendet', principalDeposit:'Kapital / monatliche Einzahlung', annualInterest:'Jährlicher Zinssatz %', tenure:'Laufzeit (Jahre)', principal:'Kapital', interest:'Zinsen', maturity:'Endbetrag', currentNeed:'Aktueller monatlicher Bedarf', inflationNeed:'Inflationsbereinigter monatlicher Bedarf', futureSavings:'Zukünftiger Wert der aktuellen Ersparnisse', estimateNote:'Nur Schätzungen; tatsächliche Bank-, Steuer-, Anlage- und Ruhestandsergebnisse können abweichen.' },
  fr: { investment:'Montant investi', annualReturn:'Rendement annuel %', years:'Années', invested:'Investi', estimatedReturns:'Rendements estimés', futureValue:'Valeur future', monthlyEmi:'EMI mensuelle', totalPayment:'Paiement total', totalInterest:'Intérêts totaux', amount:'Montant', gstRate:'Taux de GST %', gstMode:'Mode (0 = hors taxe, 1 = taxe incluse)', baseAmount:'Montant de base', gst:'GST', total:'Total', grossMonthly:'Salaire mensuel brut', deductions:'Déductions', estimatedInHand:'Net estimé', unused:'Non utilisé', principalDeposit:'Capital / dépôt mensuel', annualInterest:'Taux annuel %', tenure:'Durée (années)', principal:'Capital', interest:'Intérêts', maturity:'Montant à l’échéance', currentNeed:'Besoin mensuel actuel', inflationNeed:'Besoin mensuel ajusté de l’inflation', futureSavings:'Valeur future de l’épargne actuelle', estimateNote:'Estimations uniquement ; les résultats réels bancaires, fiscaux, d’investissement et de retraite peuvent varier.' },
  it: { investment:'Importo investito', annualReturn:'Rendimento annuo %', years:'Anni', invested:'Investito', estimatedReturns:'Rendimento stimato', futureValue:'Valore futuro', monthlyEmi:'EMI mensile', totalPayment:'Pagamento totale', totalInterest:'Interessi totali', amount:'Importo', gstRate:'Aliquota GST %', gstMode:'Modalità (0 = esclusiva, 1 = inclusiva)', baseAmount:'Importo base', gst:'GST', total:'Totale', grossMonthly:'Stipendio mensile lordo', deductions:'Detrazioni', estimatedInHand:'Netto stimato', unused:'Non utilizzato', principalDeposit:'Capitale / deposito mensile', annualInterest:'Interesse annuo %', tenure:'Durata (anni)', principal:'Capitale', interest:'Interessi', maturity:'Scadenza', currentNeed:'Fabbisogno mensile attuale', inflationNeed:'Fabbisogno mensile corretto per l’inflazione', futureSavings:'Valore futuro dei risparmi attuali', estimateNote:'Solo stime; i risultati effettivi bancari, fiscali, di investimento e pensionistici possono variare.' },
  ja: { investment:'投資額', annualReturn:'年間利回り %', years:'年数', invested:'投資元本', estimatedReturns:'推定収益', futureValue:'将来価値', monthlyEmi:'月額EMI', totalPayment:'総支払額', totalInterest:'総利息', amount:'金額', gstRate:'GST率 %', gstMode:'モード（0 = 税別、1 = 税込）', baseAmount:'基準額', gst:'GST', total:'合計', grossMonthly:'月間総給与', deductions:'控除', estimatedInHand:'推定手取り', unused:'未使用', principalDeposit:'元本 / 毎月の預金', annualInterest:'年間金利 %', tenure:'期間（年）', principal:'元本', interest:'利息', maturity:'満期額', currentNeed:'現在の月間必要額', inflationNeed:'インフレ調整後の月間必要額', futureSavings:'現在の貯蓄の将来価値', estimateNote:'これは推定値です。実際の銀行、税金、投資、退職後の結果とは異なる場合があります。' },
  ko: { investment:'투자 금액', annualReturn:'연간 수익률 %', years:'년', invested:'투자 원금', estimatedReturns:'예상 수익', futureValue:'미래 가치', monthlyEmi:'월 EMI', totalPayment:'총 상환액', totalInterest:'총 이자', amount:'금액', gstRate:'GST 세율 %', gstMode:'모드 (0 = 별도, 1 = 포함)', baseAmount:'기본 금액', gst:'GST', total:'합계', grossMonthly:'월 총급여', deductions:'공제액', estimatedInHand:'예상 실수령액', unused:'사용하지 않음', principalDeposit:'원금 / 월 예치금', annualInterest:'연 이자율 %', tenure:'기간 (년)', principal:'원금', interest:'이자', maturity:'만기 금액', currentNeed:'현재 월 필요액', inflationNeed:'인플레이션 조정 월 필요액', futureSavings:'현재 저축의 미래 가치', estimateNote:'추정치일 뿐이며 실제 은행, 세금, 투자 및 은퇴 결과는 다를 수 있습니다.' },
  zh: { investment:'投资金额', annualReturn:'年收益率 %', years:'年数', invested:'已投资', estimatedReturns:'预计收益', futureValue:'未来价值', monthlyEmi:'每月EMI', totalPayment:'总还款额', totalInterest:'总利息', amount:'金额', gstRate:'GST税率 %', gstMode:'模式（0 = 未含税，1 = 含税）', baseAmount:'基础金额', gst:'GST', total:'总计', grossMonthly:'月度税前工资', deductions:'扣除额', estimatedInHand:'预计到手金额', unused:'未使用', principalDeposit:'本金 / 每月存款', annualInterest:'年利率 %', tenure:'期限（年）', principal:'本金', interest:'利息', maturity:'到期金额', currentNeed:'当前每月需求', inflationNeed:'通胀调整后的每月需求', futureSavings:'当前储蓄的未来价值', estimateNote:'仅供估算；实际银行、税务、投资和退休结果可能有所不同。' },
  ru: { investment:'Сумма инвестиции', annualReturn:'Годовая доходность %', years:'Лет', invested:'Инвестировано', estimatedReturns:'Расчётная доходность', futureValue:'Будущая стоимость', monthlyEmi:'Ежемесячный EMI', totalPayment:'Общий платёж', totalInterest:'Общие проценты', amount:'Сумма', gstRate:'Ставка GST %', gstMode:'Режим (0 = без включения, 1 = с включением)', baseAmount:'Базовая сумма', gst:'GST', total:'Итого', grossMonthly:'Месячная зарплата до вычетов', deductions:'Вычеты', estimatedInHand:'Расчётная сумма на руки', unused:'Не используется', principalDeposit:'Основная сумма / ежемесячный вклад', annualInterest:'Годовая ставка %', tenure:'Срок (лет)', principal:'Основная сумма', interest:'Проценты', maturity:'Сумма к погашению', currentNeed:'Текущая потребность в месяц', inflationNeed:'Потребность в месяц с учётом инфляции', futureSavings:'Будущая стоимость текущих сбережений', estimateNote:'Только оценка; фактические банковские, налоговые, инвестиционные и пенсионные результаты могут отличаться.' },
  ar: { investment:'مبلغ الاستثمار', annualReturn:'العائد السنوي %', years:'السنوات', invested:'المبلغ المستثمر', estimatedReturns:'العوائد المقدرة', futureValue:'القيمة المستقبلية', monthlyEmi:'القسط الشهري', totalPayment:'إجمالي المدفوع', totalInterest:'إجمالي الفائدة', amount:'المبلغ', gstRate:'نسبة GST %', gstMode:'الوضع (0 = غير شامل، 1 = شامل)', baseAmount:'المبلغ الأساسي', gst:'GST', total:'الإجمالي', grossMonthly:'الراتب الشهري الإجمالي', deductions:'الخصومات', estimatedInHand:'صافي الدخل المقدر', unused:'غير مستخدم', principalDeposit:'الأصل / الإيداع الشهري', annualInterest:'الفائدة السنوية %', tenure:'المدة (بالسنوات)', principal:'الأصل', interest:'الفائدة', maturity:'قيمة الاستحقاق', currentNeed:'الاحتياج الشهري الحالي', inflationNeed:'الاحتياج الشهري بعد التضخم', futureSavings:'القيمة المستقبلية للمدخرات الحالية', estimateNote:'هذه تقديرات فقط؛ قد تختلف النتائج الفعلية للبنوك والضرائب والاستثمارات والتقاعد.' },
  hi: { investment:'निवेश राशि', annualReturn:'वार्षिक रिटर्न %', years:'वर्ष', invested:'निवेशित राशि', estimatedReturns:'अनुमानित रिटर्न', futureValue:'भविष्य का मूल्य', monthlyEmi:'मासिक EMI', totalPayment:'कुल भुगतान', totalInterest:'कुल ब्याज', amount:'राशि', gstRate:'GST दर %', gstMode:'मोड (0 = अलग, 1 = शामिल)', baseAmount:'मूल राशि', gst:'GST', total:'कुल', grossMonthly:'सकल मासिक वेतन', deductions:'कटौतियाँ', estimatedInHand:'अनुमानित इन-हैंड', unused:'उपयोग नहीं', principalDeposit:'मूलधन / मासिक जमा', annualInterest:'वार्षिक ब्याज %', tenure:'अवधि (वर्ष)', principal:'मूलधन', interest:'ब्याज', maturity:'परिपक्वता राशि', currentNeed:'वर्तमान मासिक आवश्यकता', inflationNeed:'महंगाई-समायोजित मासिक आवश्यकता', futureSavings:'वर्तमान बचत का भविष्य मूल्य', estimateNote:'केवल अनुमान; वास्तविक बैंक, कर, निवेश और रिटायरमेंट परिणाम अलग हो सकते हैं।' },
};


type ResultRow = [string, string];

export default function FinanceEngine({
  toolSlug,
  toolName,
  locale = 'en',
}: {
  toolSlug: string;
  toolName: string;
  locale?: LocaleCode;
}) {
  const ui = getEngineUi(locale);
  const f = FINANCE_LABELS[locale] || FINANCE_LABELS.en;
  const [a, setA] = useState<string>('5000');
  const [b, setB] = useState<string>('12');
  const [c, setC] = useState<string>('10');
  const [d, setD] = useState<string>('1');

  const out = useMemo<ResultRow[]>(() => {
    const p = numberValue(a);
    const r = numberValue(b);
    const t = numberValue(c);
    const x = numberValue(d);

    try {
      if (toolSlug === 'sip-calculator') {
        const monthlyRate = r / 1200;
        const months = Math.max(
          0,
          Math.floor(t * 12)
        );

        const futureValue =
          monthlyRate === 0
            ? p * months
            : p *
              ((Math.pow(
                1 + monthlyRate,
                months
              ) -
                1) /
                monthlyRate) *
              (1 + monthlyRate);

        const invested = p * months;

        return [
          [f.invested, money(invested)],
          [
            f.estimatedReturns,
            money(futureValue - invested),
          ],
          [f.futureValue, money(futureValue)],
        ];
      }

      if (toolSlug === 'emi-calculator') {
        const months = Math.max(
          1,
          Math.floor(t * 12)
        );

        const monthlyRate = r / 1200;

        const emi =
          monthlyRate === 0
            ? p / months
            : (p *
                monthlyRate *
                Math.pow(
                  1 + monthlyRate,
                  months
                )) /
              (Math.pow(
                1 + monthlyRate,
                months
              ) -
                1);

        const totalPayment = emi * months;

        return [
          [f.monthlyEmi, money(emi)],
          [
            f.totalPayment,
            money(totalPayment),
          ],
          [
            f.totalInterest,
            money(totalPayment - p),
          ],
        ];
      }

      if (toolSlug === 'lumpsum-calculator') {
        const years = Math.max(0, t);

        const futureValue =
          p * Math.pow(1 + r / 100, years);

        return [
          [f.invested, money(p)],
          [
            f.estimatedReturns,
            money(futureValue - p),
          ],
          [f.futureValue, money(futureValue)],
        ];
      }

      if (toolSlug === 'gst-calculator') {
        const gstRate =
          Math.max(0, r) / 100;

        const modeValue =
          numberValue(c);

        const inclusive =
          Math.round(modeValue) === 1;

        const baseAmount = inclusive
          ? p / (1 + gstRate)
          : p;

        const gstAmount =
          baseAmount * gstRate;

        const totalAmount =
          baseAmount + gstAmount;

        return [
          [f.baseAmount, money(baseAmount)],
          [f.gst, money(gstAmount)],
          [f.total, money(totalAmount)],
        ];
      }

      if (toolSlug === 'salary-calculator') {
        const grossMonthly = p;

        const deductions = Math.max(
          0,
          r
        );

        const inHand = Math.max(
          0,
          grossMonthly - deductions
        );

        return [
          [
            f.grossMonthly,
            money(grossMonthly),
          ],
          [
            f.deductions,
            money(deductions),
          ],
          [
            f.estimatedInHand,
            money(inHand),
          ],
        ];
      }

      if (toolSlug === 'fd-calculator') {
        const years = Math.max(0, t);

        const maturity =
          p *
          Math.pow(
            1 + r / 400,
            4 * years
          );

        return [
          [f.principal, money(p)],
          [
            f.interest,
            money(maturity - p),
          ],
          [f.maturity, money(maturity)],
        ];
      }

      if (toolSlug === 'rd-calculator') {
        const months = Math.max(
          0,
          Math.floor(t * 12)
        );

        const monthlyDeposit = p;
        const quarterlyRate = r / 400;

        let maturity = 0;

        for (
          let month = 1;
          month <= months;
          month++
        ) {
          maturity +=
            monthlyDeposit *
            Math.pow(
              1 + quarterlyRate,
              (months - month + 1) / 3
            );
        }

        const deposits =
          monthlyDeposit * months;

        return [
          [f.invested, money(deposits)],
          [
            f.interest,
            money(maturity - deposits),
          ],
          [f.maturity, money(maturity)],
        ];
      }

      if (
        toolSlug ===
        'retirement-calculator'
      ) {
        const currentMonthlyNeed = p;
        const annualReturn = r / 100;
        const years = Math.max(1, t);
        const inflation = x / 100;

        const futureSavings =
          currentMonthlyNeed *
          Math.pow(
            1 + annualReturn,
            years
          );

        const inflationAdjustedNeed =
          currentMonthlyNeed *
          Math.pow(
            1 + inflation,
            years
          );

        return [
          [
            f.currentNeed,
            money(currentMonthlyNeed),
          ],
          [
            f.inflationNeed,
            money(
              inflationAdjustedNeed
            ),
          ],
          [
            f.futureSavings,
            money(futureSavings),
          ],
        ];
      }

      return [];
    } catch {
      return [];
    }
  }, [toolSlug, a, b, c, d]);

  const labels: string[] =
    toolSlug === 'gst-calculator'
      ? [
          f.amount,
          f.gstRate,
          f.gstMode,
        ]
      : toolSlug === 'salary-calculator'
        ? [
            f.grossMonthly,
            f.deductions,
            f.unused,
          ]
        : toolSlug === 'fd-calculator' ||
            toolSlug === 'rd-calculator'
          ? [
              f.principalDeposit,
              f.annualInterest,
              f.tenure,
            ]
          : toolSlug ===
                'retirement-calculator'
            ? [
                f.currentNeed,
                f.annualReturn,
                f.years,
                f.inflationNeed,
              ]
            : toolSlug === 'emi-calculator'
              ? [
                  f.amount,
                  f.annualInterest,
                  f.tenure,
                ]
              : [
                  f.investment,
                  f.annualReturn,
                  f.years,
                ];

  const values: string[] = [a, b, c];

  const setters: Array<
    React.Dispatch<
      React.SetStateAction<string>
    >
  > = [setA, setB, setC];

  return (
    <div className={card}>
      <h3 className="text-lg font-bold">
        {toolName}
      </h3>

      <div className="grid sm:grid-cols-2 gap-3">
        {values.map((value, index) => (
          <label
            key={index}
            className="text-xs font-semibold text-zinc-500"
          >
            {labels[index]}

            <input
              className={input + ' mt-1'}
              type="number"
              value={value}
              onChange={(event) =>
                setters[index](
                  event.target.value
                )
              }
            />
          </label>
        ))}

        {toolSlug ===
          'retirement-calculator' && (
          <label className="text-xs font-semibold text-zinc-500">
            {labels[3]}

            <input
              className={input + ' mt-1'}
              type="number"
              value={d}
              onChange={(event) =>
                setD(event.target.value)
              }
            />
          </label>
        )}
      </div>

      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-5 space-y-3">
        {out.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 text-sm"
          >
            <span className="text-zinc-500">
              {label}
            </span>

            <strong>{value}</strong>
          </div>
        ))}

        {out.length === 0 && (
          <div className="text-sm text-zinc-500">
            {ui.enterValues}
          </div>
        )}
      </div>

      <p className="text-[11px] text-zinc-400">
        {f.estimateNote}
      </p>
    </div>
  );
}
