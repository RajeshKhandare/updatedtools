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
          ['Invested', money(invested)],
          [
            'Estimated returns',
            money(futureValue - invested),
          ],
          ['Future value', money(futureValue)],
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
          ['Monthly EMI', money(emi)],
          [
            'Total payment',
            money(totalPayment),
          ],
          [
            'Total interest',
            money(totalPayment - p),
          ],
        ];
      }

      if (toolSlug === 'lumpsum-calculator') {
        const years = Math.max(0, t);

        const futureValue =
          p * Math.pow(1 + r / 100, years);

        return [
          ['Invested', money(p)],
          [
            'Estimated returns',
            money(futureValue - p),
          ],
          ['Future value', money(futureValue)],
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
          ['Base amount', money(baseAmount)],
          ['GST', money(gstAmount)],
          ['Total', money(totalAmount)],
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
            'Gross monthly',
            money(grossMonthly),
          ],
          [
            'Deductions',
            money(deductions),
          ],
          [
            'Estimated in-hand',
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
          ['Principal', money(p)],
          [
            'Interest',
            money(maturity - p),
          ],
          ['Maturity', money(maturity)],
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
          ['Deposits', money(deposits)],
          [
            'Interest',
            money(maturity - deposits),
          ],
          ['Maturity', money(maturity)],
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
            'Current monthly need',
            money(currentMonthlyNeed),
          ],
          [
            'Inflation-adjusted monthly need',
            money(
              inflationAdjustedNeed
            ),
          ],
          [
            'Future value of current savings',
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
          'Amount',
          'GST rate %',
          'Mode (0 = exclusive, 1 = inclusive)',
        ]
      : toolSlug === 'salary-calculator'
        ? [
            'Gross monthly salary',
            'Deductions',
            'Unused',
          ]
        : toolSlug === 'fd-calculator' ||
            toolSlug === 'rd-calculator'
          ? [
              'Principal / monthly deposit',
              'Annual interest %',
              'Tenure (years)',
            ]
          : toolSlug ===
                'retirement-calculator'
            ? [
                'Current monthly need',
                'Annual return %',
                'Years',
                'Inflation %',
              ]
            : toolSlug === 'emi-calculator'
              ? [
                  'Loan amount',
                  'Annual interest %',
                  'Tenure (years)',
                ]
              : [
                  'Investment amount',
                  'Annual return %',
                  'Years',
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
        Estimates only; actual bank, tax,
        investment, and retirement outcomes
        can differ.
      </p>
    </div>
  );
}
