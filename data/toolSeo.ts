import { ToolMeta } from '@/data/toolsRegistry';

export type ToolFaq = { q: string; a: string };
export type ToolSeoContent = {
  intro: string;
  why: string;
  steps: string[];
  useCases: string[];
  tips: string[];
  limitations: string[];
  faq: ToolFaq[];
  visual: 'workflow' | 'finance' | 'formats' | 'code' | 'text' | 'youtube' | 'converter';
  formula?: string;
};

const makeFaqs = (tool: ToolMeta, extras: ToolFaq[]): ToolFaq[] => [
  {
    q: 'What is ' + tool.name + ' used for?',
    a: tool.description + ' It is designed for a focused workflow so you can complete the task without installing a separate desktop utility. The exact output depends on the values, files, or code you provide.',
  },
  {
    q: 'How does ' + tool.name + ' work?',
    a: 'Enter the required input in the workspace, review the available options, run the operation, and inspect the result. Where browser-side processing is supported, the work is performed in the browser; execution or external-runtime requirements are indicated by the tool.',
  },
  ...extras,
  {
    q: 'Is ' + tool.name + ' free to use?',
    a: 'Yes. The tool is available without a paid account. Practical limits can come from browser memory, device performance, input size, or any third-party execution service used by a particular workflow.',
  },
];

const financeDetails: Record<string, { formula: string; why: string; tips: string[] }> = {
  'sip-wealth-calculator': {
    formula: 'Future value ≈ P × [((1 + r)^n − 1) / r] × (1 + r), where P is the periodic contribution, r is the periodic assumed return, and n is the number of contributions.',
    why: 'A SIP calculator separates the amount you contribute from the estimated growth of those contributions. This makes it easier to see how contribution size, time, and an assumed return rate affect a projected future value.',
    tips: ['Compare several contribution amounts.', 'Test conservative and optimistic return assumptions.', 'Treat the result as an estimate rather than a guaranteed investment outcome.'],
  },
  'emi-calculator': {
    formula: 'EMI = P × r × (1 + r)^n / [(1 + r)^n − 1], where P is principal, r is monthly interest rate, and n is the number of monthly payments.',
    why: 'An EMI calculator separates the effects of principal, interest rate, and tenure so loan scenarios can be compared before borrowing.',
    tips: ['Compare total interest, not only monthly EMI.', 'Test a shorter tenure to understand the interest trade-off.', 'Use the lender quote for the final payable amount and charges.'],
  },
  'lumpsum-calculator': {
    formula: 'Future value = P × (1 + r)^n for a simplified annual-compounding model.',
    why: 'A lumpsum calculator illustrates how a one-time investment can change over time under an assumed return and compounding model.',
    tips: ['Change the investment horizon.', 'Compare several assumed return rates.', 'Do not treat an assumed return as guaranteed.'],
  },
  'gst-calculator': {
    formula: 'GST amount = taxable value × GST rate. For an inclusive price, the tax component can be derived as inclusive price × rate / (100 + rate).',
    why: 'A GST calculator makes invoice arithmetic easier by showing the tax component and resulting inclusive or exclusive amount.',
    tips: ['Confirm the applicable GST rate.', 'Keep original invoice values for records.', 'Use the calculator for arithmetic; it does not determine legal tax applicability.'],
  },
  'salary-calculator': {
    formula: 'Estimated take-home = gross pay − the deductions entered. Actual payroll can include employer-specific taxes, benefits, reimbursements, and statutory deductions.',
    why: 'A salary calculator translates gross compensation into a planning estimate of monthly take-home pay.',
    tips: ['Enter only deductions that actually apply.', 'Check whether annual figures include variable pay or employer contributions.', 'Use the final payslip as the authoritative amount.'],
  },
  'fd-calculator': {
    formula: 'For a simplified compound model, maturity ≈ P × (1 + r/m)^(m×t), where P is principal, r is annual rate, m is compounding frequency, and t is years.',
    why: 'An FD calculator helps compare deposit amount, tenure, rate, and compounding assumptions before choosing a fixed-deposit scenario.',
    tips: ['Verify the bank’s actual compounding frequency.', 'Check tax and premature-withdrawal terms.', 'Compare maturity value and liquidity, not just the quoted rate.'],
  },
  'rd-calculator': {
    formula: 'Recurring-deposit maturity depends on the periodic deposit, rate, tenure, and the institution’s compounding convention.',
    why: 'An RD calculator estimates how regular deposits can accumulate over a chosen period.',
    tips: ['Confirm the bank’s exact calculation method.', 'Check missed-installment and premature-closure rules.', 'Verify the estimate against the bank’s terms.'],
  },
  'retirement-calculator': {
    formula: 'Retirement projections combine current spending, inflation, investment return, retirement age, and expected retirement duration to estimate a future funding requirement.',
    why: 'Retirement planning is sensitive to assumptions. A calculator helps test scenarios rather than relying on one target number.',
    tips: ['Run several inflation and return scenarios.', 'Include healthcare and irregular expenses where appropriate.', 'Revisit the projection when income, savings, or timing changes.'],
  },
  'compound-interest-calculator': {
    formula: 'A = P × (1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding periods per year, and t is years.',
    why: 'Compound interest calculations show how previously earned interest can participate in future growth.',
    tips: ['Compare compounding frequencies.', 'Keep rate and time units consistent.', 'Use scenario comparisons instead of treating one projection as a promise.'],
  },
  'simple-interest-calculator': {
    formula: 'Simple interest = P × R × T / 100.',
    why: 'Simple interest is a model where interest is calculated on the original principal rather than repeatedly added to the principal.',
    tips: ['Keep time units consistent with the annual rate.', 'Check whether the real product uses simple interest.', 'Use the result as an arithmetic calculation.'],
  },
  'percentage-calculator': {
    formula: 'Percentage = (part ÷ whole) × 100. Percentage change = ((new − old) ÷ old) × 100.',
    why: 'Percentage calculations are useful for discounts, changes, margins, growth rates, and proportions.',
    tips: ['Distinguish percentage points from percentage change.', 'Check which value is the baseline.', 'Keep both values in compatible units.'],
  },
  'age-calculator': {
    formula: 'Age is derived from the calendar-aware difference between a birth date and a selected reference date.',
    why: 'An age calculator is useful when an exact calendar age is needed rather than an approximate year difference.',
    tips: ['Verify the entered date.', 'For legal eligibility, follow the relevant institution’s rules.', 'Choose the intended reference date.'],
  },
  'bmi-calculator': {
    formula: 'BMI = weight in kilograms ÷ (height in metres)^2.',
    why: 'BMI is a simple screening measure based on height and weight. It does not by itself describe body composition or individual health.',
    tips: ['Enter height and weight using the correct units.', 'Use an appropriate reference population.', 'Do not treat a calculator result as a diagnosis.'],
  },
  'scientific-calculator': {
    formula: 'Expressions may combine arithmetic, powers, roots, trigonometric functions, logarithms, and other supported operations according to the calculator syntax.',
    why: 'A scientific calculator helps with repeatable calculations involving advanced mathematical functions.',
    tips: ['Use parentheses to make precedence explicit.', 'Check the intended trigonometric angle mode.', 'Validate important results independently.'],
  },
  'discount-calculator': {
    formula: 'Discount amount = original price × discount rate / 100; final price = original price − discount amount.',
    why: 'A discount calculator separates the advertised percentage from the amount saved and final price.',
    tips: ['Check whether multiple discounts are sequential.', 'Include taxes or fees separately.', 'Do not confuse percentage discount with percentage-point change.'],
  },
  'tip-calculator': {
    formula: 'Tip = bill amount × tip rate / 100; total = bill amount + tip.',
    why: 'A tip calculator simplifies service-charge arithmetic and can divide a final amount across people.',
    tips: ['Decide whether tip is calculated before or after tax.', 'Check rounding when splitting a bill.', 'Treat local service-charge rules separately from voluntary tips.'],
  },
};

const categoryProfiles: Record<string, { why: string; visual: ToolSeoContent['visual']; tips: string[]; limitations: string[] }> = {
  PDF: {
    why: 'This PDF workflow is designed around a focused document task: prepare the source, apply the operation, review the output, and keep the result only if it meets your requirement.',
    visual: 'workflow',
    tips: ['Keep an original copy before destructive edits.', 'Review page order, orientation, filenames, and output quality.', 'For confidential files, prefer browser-side processing where explicitly supported and never enter unnecessary secrets.'],
    limitations: ['Very large or complex documents can be limited by browser memory.', 'PDF encryption, fonts, annotations, and embedded objects can vary between PDF engines.', 'Inspect generated files before using them as official documents.'],
  },
  Image: {
    why: 'This image workflow focuses on one transformation so a quick task can be completed without a full graphics editor. It is useful for web, document, social, development, and everyday image work.',
    visual: 'formats',
    tips: ['Keep the original image when quality matters.', 'Choose output format based on transparency, compression, compatibility, and intended use.', 'Preview the result at its actual display size.'],
    limitations: ['Browser memory affects very large images.', 'Lossy formats can reduce quality after repeated encoding.', 'Color profiles, metadata, animation, and unusual image features may not survive every transformation.'],
  },
  Compiler: {
    why: 'This coding workspace is useful for learning, debugging, syntax checks, and small reproducible examples. The execution model varies by language, so it should be treated as a development sandbox rather than a production environment.',
    visual: 'code',
    tips: ['Start with a small reproducible example.', 'Read the first compiler or runtime error carefully.', 'Never paste API keys, passwords, private tokens, or production credentials.'],
    limitations: ['A sandbox does not reproduce every production dependency or operating-system feature.', 'Execution time, memory, packages, and language versions can affect results.', 'Test working code again in its intended deployment environment.'],
  },
  Developer: {
    why: 'This developer utility targets a repeatable workflow that commonly appears during API work, debugging, frontend or backend development, testing, and data preparation.',
    visual: 'code',
    tips: ['Validate transformed data before committing it.', 'Include edge cases and malformed input during testing.', 'Never paste production secrets or private customer data.'],
    limitations: ['Output follows the syntax and rules supported by the tool.', 'Special encodings or implementation-specific extensions can differ in production.', 'Security-sensitive output should be verified with trusted project tooling.'],
  },
  Text: {
    why: 'This text utility is intended for repetitive cleanup, comparison, transformation, or generation tasks where manual editing is slower or more error-prone.',
    visual: 'text',
    tips: ['Keep source text before destructive transformations.', 'Check whitespace, punctuation, Unicode characters, and line endings.', 'Proofread publishing output instead of relying only on automation.'],
    limitations: ['Very large inputs can be constrained by browser memory.', 'Automated text transformation does not understand every semantic context.', 'Rich-text formatting may not survive plain-text workflows.'],
  },
  Converters: {
    why: 'This conversion workflow provides a direct relationship between defined units and is useful for study, travel, engineering, shopping, science, fitness, and everyday planning.',
    visual: 'converter',
    tips: ['Confirm source and target units.', 'Use significant figures appropriate to the source precision.', 'For regulated or engineering work, verify the required standard.'],
    limitations: ['Accuracy depends on the implemented unit definitions.', 'Some units have context-specific conventions.', 'A correct conversion does not automatically make a value suitable for a technical application.'],
  },
  YouTube: {
    why: 'This creator workflow supports public YouTube information, content planning, or estimation. It is designed to make repetitive creator tasks faster while keeping assumptions visible.',
    visual: 'youtube',
    tips: ['Use results as planning aids rather than performance guarantees.', 'Check public video details before publishing decisions.', 'Never enter private account credentials.'],
    limitations: ['Public video information and platform behavior can change.', 'Revenue estimates vary with audience, geography, monetization, ad inventory, and other factors.', 'No tool can guarantee rankings, views, revenue, or channel growth.'],
  },
};

export function getToolSeoContent(tool: ToolMeta): ToolSeoContent {
  const detail = financeDetails[tool.slug];
  if (detail) {
    return {
      intro: tool.description + ' This page combines the interactive calculator with a practical explanation of inputs, formulas, assumptions, and common mistakes so the result can be interpreted correctly.',
      why: detail.why,
      formula: detail.formula,
      steps: ['Enter the values requested by the calculator.', 'Review assumptions and units before calculating.', 'Run the calculation and compare at least one alternative scenario.', 'Use the result as an estimate and verify important decisions against official records or terms.'],
      useCases: ['Compare different ' + tool.name.toLowerCase() + ' scenarios.', 'Build a quick planning estimate before using a spreadsheet or official statement.', 'Understand which input has the largest effect on the result.', 'Record the assumptions so the calculation can be repeated later.'],
      tips: detail.tips,
      limitations: ['Results depend on the assumptions and inputs.', 'Rounding can create small differences from official calculators or statements.', 'Financial and health-related outputs are informational calculations, not professional advice or guarantees.'],
      faq: makeFaqs(tool, [
        { q: 'What inputs does ' + tool.name + ' need?', a: 'The workspace requests the values relevant to this calculation. Enter them using the displayed units and review assumptions before calculating.' },
        { q: 'Can I use ' + tool.name + ' for an exact real-world result?', a: 'Use it for planning and scenario analysis. Official statements, lender quotes, payroll records, product terms, or other authoritative sources may include rules and charges that a general calculator cannot know.' },
      ]),
      visual: 'finance',
    };
  }

  const profile = categoryProfiles[tool.category] || categoryProfiles.Developer;
  return {
    intro: tool.description + ' This guide explains what the tool does, when it is useful, how to use it effectively, and the practical limitations that matter in real-world workflows.',
    why: profile.why,
    steps: [
      'Open ' + tool.name + ' and identify the required input format or values.',
      'Enter or select the input and review every available option before running the operation.',
      'Run the tool and inspect the result rather than assuming the first output is correct.',
      'Download, copy, or reuse the result only after checking it against your original requirement.',
    ],
    useCases: [
      'Quick one-off ' + tool.name.toLowerCase() + ' tasks without installing a separate utility.',
      'Repeatable preparation work for documents, media, text, code, data, or creator workflows.',
      'Checking an intermediate result during a larger project.',
      'Preparing an output for another application or workflow.',
    ],
    tips: profile.tips,
    limitations: profile.limitations,
    faq: makeFaqs(tool, [
      { q: 'What can I use ' + tool.name + ' for?', a: 'Common uses include the workflow described above, quick one-off tasks, repeatable preparation work, and checking an output before moving it into another application. Clean input and a final review usually produce the most reliable result.' },
      { q: 'Does ' + tool.name + ' require an account or installation?', a: 'The page is designed to be usable directly in a modern browser without a separate desktop installation. No account is required for the core workflow. Browser capabilities, input size, device resources, and any external runtime can still affect individual operations.' },
      { q: 'What should I check before using the output from ' + tool.name + '?', a: 'Check the output against the original input, confirm that the intended transformation occurred, and verify important details before publishing, submitting, sending, or using the result in a production workflow.' },
    ]),
    visual: profile.visual,
  };
}
