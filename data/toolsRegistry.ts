export interface ToolMeta {
  name: string;
  slug: string;
  category: string;
  description: string;
  targetKeyword?: string;
}

export const CATEGORIES = [
  'All',
  'PDF',
  'Image',
  'Compiler',
  'Finance',
  'Developer',
  'Text',
  'Converters',
  'Calculators',
  'YouTube',
] as const;

export const TOOLS_REGISTRY: ToolMeta[] = [
  // ==========================================
  // 1. PDF TOOLS (14 Complete Tools)
  // ==========================================
  {
    name: 'Merge PDF',
    slug: 'merge-pdf',
    category: 'PDF',
    description: 'Combine multiple PDF files into one clean document in your chosen order.',
    targetKeyword: 'Merge PDF',
  },
  {
    name: 'Split PDF',
    slug: 'split-pdf',
    category: 'PDF',
    description: 'Separate individual pages or extract specific page ranges from PDF files.',
    targetKeyword: 'Split PDF',
  },
  {
    name: 'PDF to JPG Converter',
    slug: 'pdf-to-jpg',
    category: 'PDF',
    description: 'Extract pages from your PDF document and export them as high-quality JPG images.',
    targetKeyword: 'PDF to JPG Converter',
  },
  {
    name: 'JPG to PDF Converter',
    slug: 'jpg-to-pdf',
    category: 'PDF',
    description: 'Convert JPG, JPEG, and PNG images into a clean standardized PDF file.',
    targetKeyword: 'JPG to PDF Converter',
  },
  {
    name: 'Protect PDF with Password',
    slug: 'protect-pdf-password',
    category: 'PDF',
    description: 'Add secure password protection and encryption to your private PDF documents.',
    targetKeyword: 'Protect PDF with Password',
  },
  {
    name: 'Unlock PDF',
    slug: 'unlock-pdf-password',
    category: 'PDF',
    description: 'Remove passwords and permissions from encrypted PDF documents locally.',
    targetKeyword: 'Unlock PDF',
  },
  {
    name: 'Rotate PDF',
    slug: 'rotate-pdf',
    category: 'PDF',
    description: 'Rotate individual or all pages inside a PDF document 90, 180, or 270 degrees.',
    targetKeyword: 'Rotate PDF',
  },
  {
    name: 'Compress PDF',
    slug: 'compress-pdf',
    category: 'PDF',
    description: 'Reduce PDF document file footprint while maintaining clean text resolution.',
    targetKeyword: 'Compress PDF',
  },
  {
    name: 'Add Page Numbers to PDF',
    slug: 'add-page-numbers-pdf',
    category: 'PDF',
    description: 'Insert header or footer page numbers across your entire PDF file.',
    targetKeyword: 'Add Page Numbers to PDF',
  },
  {
    name: 'PDF to Word Converter',
    slug: 'pdf-to-word',
    category: 'PDF',
    description: 'Convert PDF files into editable DOCX Word format without losing text structure.',
    targetKeyword: 'PDF to Word Converter',
  },
  {
    name: 'Word to PDF Converter',
    slug: 'word-to-pdf',
    category: 'PDF',
    description: 'Convert Microsoft Word documents (DOCX, DOC) into standard PDF files.',
    targetKeyword: 'Word to PDF Converter',
  },
  {
    name: 'Delete Pages from PDF',
    slug: 'delete-pdf-pages',
    category: 'PDF',
    description: 'Select and remove unwanted pages from any PDF file with instant download.',
    targetKeyword: 'Delete Pages from PDF',
  },
  {
    name: 'Reorder PDF Pages',
    slug: 'reorder-pdf-pages',
    category: 'PDF',
    description: 'Drag, drop, and rearrange the page sequence of your PDF document.',
    targetKeyword: 'Reorder PDF Pages',
  },
  {
    name: 'PDF to Grayscale Converter',
    slug: 'pdf-grayscale-converter',
    category: 'PDF',
    description: 'Convert colored PDF documents into monochrome black and white for cheap printing.',
    targetKeyword: 'PDF to Grayscale Converter',
  },

  // ==========================================
  // 2. IMAGE TOOLS (12 Complete Tools)
  // ==========================================
  {
    name: 'Compress Image Online',
    slug: 'compress-image',
    category: 'Image',
    description: 'Compress PNG, JPEG, and WebP files down to target KB size with zero quality loss.',
    targetKeyword: 'Compress Image Online',
  },
  {
    name: 'Crop Image Online',
    slug: 'crop-image-online',
    category: 'Image',
    description: 'Crop images with preset aspect ratios (16:9, 1:1, 4:3) or freeform box selection.',
    targetKeyword: 'Crop Image Online',
  },
  {
    name: 'Resize Image Online',
    slug: 'image-resizer',
    category: 'Image',
    description: 'Resize image dimensions by custom width, height, or percentages in pixels and cm.',
    targetKeyword: 'Resize Image Online',
  },
  {
    name: 'WebP to PNG Converter',
    slug: 'webp-to-png-converter',
    category: 'Image',
    description: 'Convert modern WebP images into transparent lossless PNG graphics in browser memory.',
    targetKeyword: 'WebP to PNG Converter',
  },
  {
    name: 'WebP to JPG Converter',
    slug: 'webp-to-jpg-converter',
    category: 'Image',
    description: 'Convert modern WebP images into standard JPG format in high quality.',
    targetKeyword: 'WebP to JPG Converter',
  },
  {
    name: 'PNG to JPG Converter',
    slug: 'png-to-jpg-converter',
    category: 'Image',
    description: 'Quickly convert large PNG images into lightweight JPG pictures.',
    targetKeyword: 'PNG to JPG Converter',
  },
  {
    name: 'JPG to PNG Converter',
    slug: 'jpg-to-png-converter',
    category: 'Image',
    description: 'Convert JPEG/JPG pictures to lossless PNG image format with zero compression artifacts.',
    targetKeyword: 'JPG to PNG Converter',
  },
  {
    name: 'SVG to PNG Converter',
    slug: 'svg-to-png-converter',
    category: 'Image',
    description: 'Rasterize vector SVG files into crisp, high-resolution raster graphics.',
    targetKeyword: 'SVG to PNG Converter',
  },
  {
    name: 'Black and White Image Converter',
    slug: 'black-and-white-image-filter',
    category: 'Image',
    description: 'Convert colored photographs into black and white monochrome representations.',
    targetKeyword: 'Black and White Image Converter',
  },
  {
    name: 'Invert Image Colors',
    slug: 'invert-image-colors',
    category: 'Image',
    description: 'Invert RGB pixel values to generate negative color effects on photos.',
    targetKeyword: 'Invert Image Colors',
  },
  {
    name: 'Flip and Rotate Image',
    slug: 'flip-rotate-image',
    category: 'Image',
    description: 'Flip images horizontally, vertically, or rotate 90 degrees with instant canvas preview.',
    targetKeyword: 'Flip and Rotate Image',
  },
  {
    name: 'QR Code Generator',
    slug: 'instant-qr-code-generator',
    category: 'Image',
    description: 'Generate scannable high-resolution QR codes from text, links, or contact cards.',
    targetKeyword: 'QR Code Generator',
  },
  {
    name: 'Blur Image Online',
    slug: 'image-blur-filter',
    category: 'Image',
    description: 'Apply Gaussian blur effects to hide faces, plates, or private details.',
    targetKeyword: 'Blur Image Online',
  },
  {
    name: 'Image Color Palette Generator',
    slug: 'image-color-palette-extractor',
    category: 'Image',
    description: 'Extract dominant HEX and RGB color schemes directly from any photo.',
    targetKeyword: 'Image Color Palette Generator',
  },

  // ==========================================
  // 3. COMPILERS & RUNNERS (8 Complete Tools)
  // ==========================================
  {
    name: 'Online Python Compiler',
    slug: 'online-python-compiler',
    category: 'Compiler',
    description: 'Run Python 3 scripts in browser sandbox with real-time terminal output.',
    targetKeyword: 'Online Python Compiler',
  },
  {
    name: 'Online JavaScript Compiler',
    slug: 'online-javascript-compiler',
    category: 'Compiler',
    description: 'Execute modern ES6+ JavaScript code snippets in browser environment.',
    targetKeyword: 'Online JavaScript Compiler',
  },
  {
    name: 'Online HTML Editor',
    slug: 'online-html-editor',
    category: 'Compiler',
    description: 'Live interactive HTML, CSS, and JavaScript editor with split-screen DOM preview.',
    targetKeyword: 'Online HTML Editor',
  },
  {
    name: 'Online C++ Compiler',
    slug: 'online-cpp-compiler',
    category: 'Compiler',
    description: 'Compile and test C++ programs online in browser memory with instant console logs.',
    targetKeyword: 'Online C++ Compiler',
  },
  {
    name: 'Online Java Compiler',
    slug: 'online-java-compiler',
    category: 'Compiler',
    description: 'Write, debug, and run standard Java code snippets directly in your web browser.',
    targetKeyword: 'Online Java Compiler',
  },
  {
    name: 'Online C# Compiler',
    slug: 'online-csharp-compiler',
    category: 'Compiler',
    description: 'Run C# code scripts in client sandbox with immediate standard output display.',
    targetKeyword: 'Online C# Compiler',
  },
  {
    name: 'Online PHP Compiler',
    slug: 'online-php-runner',
    category: 'Compiler',
    description: 'Test PHP code syntax and algorithms directly inside browser memory.',
    targetKeyword: 'Online PHP Compiler',
  },
  {
    name: 'Online SQL Editor',
    slug: 'online-sql-runner',
    category: 'Compiler',
    description: 'Execute SQL queries, test database tables, and verify relational commands.',
    targetKeyword: 'Online SQL Editor',
  },

  // ==========================================
  // 4. DEVELOPER UTILITIES (12 Complete Tools)
  // ==========================================
  {
    name: 'JSON Formatter and Validator',
    slug: 'json-formatter-validator',
    category: 'Developer',
    description: 'Prettify, format, validate, and minify messy JSON data strings with syntax highlighting.',
    targetKeyword: 'JSON Formatter and Validator',
  },
  {
    name: 'Base64 Encoder Decoder',
    slug: 'base64-encoder-decoder',
    category: 'Developer',
    description: 'Encode and decode UTF-8 plain text or binary assets to and from Base64.',
    targetKeyword: 'Base64 Encoder Decoder',
  },
  {
    name: 'URL Slug Generator',
    slug: 'clean-url-slug-generator',
    category: 'Developer',
    description: 'Convert article titles and raw strings into SEO-friendly URL slugs.',
    targetKeyword: 'URL Slug Generator',
  },
  {
    name: 'HTML Entity Encoder',
    slug: 'html-entity-encoder',
    category: 'Developer',
    description: 'Convert special symbols and characters into secure HTML entities.',
    targetKeyword: 'HTML Entity Encoder',
  },
  {
    name: 'CSS Minifier',
    slug: 'css-minifier-cleaner',
    category: 'Developer',
    description: 'Compress stylesheet rules by stripping whitespace and comments.',
    targetKeyword: 'CSS Minifier',
  },
  {
    name: 'Unix Timestamp Converter',
    slug: 'unix-timestamp-converter',
    category: 'Developer',
    description: 'Convert Epoch timestamps to human-readable dates and back.',
    targetKeyword: 'Unix Timestamp Converter',
  },
  {
    name: 'HEX to RGB Converter',
    slug: 'hex-to-rgb-hsl-converter',
    category: 'Developer',
    description: 'Convert HEX color codes into CSS RGB, RGBA, and HSL formats.',
    targetKeyword: 'HEX to RGB Converter',
  },
  {
    name: 'URL Encoder Decoder',
    slug: 'url-component-encoder-decoder',
    category: 'Developer',
    description: 'Safely encode or decode URL query strings and URI parameters.',
    targetKeyword: 'URL Encoder Decoder',
  },
  {
    name: 'JWT Decoder',
    slug: 'jwt-token-inspector',
    category: 'Developer',
    description: 'Decode JSON Web Tokens and view payload claims locally.',
    targetKeyword: 'JWT Decoder',
  },
  {
    name: 'UUID Generator',
    slug: 'uuid-guid-v4-generator',
    category: 'Developer',
    description: 'Generate cryptographically secure v4 random UUIDs in bulk.',
    targetKeyword: 'UUID Generator',
  },
  {
    name: 'Password Generator',
    slug: 'strong-password-generator',
    category: 'Developer',
    description: 'Generate customizable, high-entropy random passwords.',
    targetKeyword: 'Password Generator',
  },
  {
    name: 'User Agent Parser',
    slug: 'user-agent-string-parser',
    category: 'Developer',
    description: 'Parse browser client strings to detect OS, engine, and device models.',
    targetKeyword: 'User Agent Parser',
  },

  // ==========================================
  // 5. TEXT TOOLS (10 Complete Tools)
  // ==========================================
  {
    name: 'Word Counter',
    slug: 'word-character-counter',
    category: 'Text',
    description: 'Count real-time words, characters, sentences, paragraphs, and reading duration.',
    targetKeyword: 'Word Counter',
  },
  {
    name: 'Text Case Converter',
    slug: 'text-case-converter',
    category: 'Text',
    description: 'Instantly transform text into UPPERCASE, lowercase, Title Case, and camelCase.',
    targetKeyword: 'Text Case Converter',
  },
  {
    name: 'Remove Duplicate Lines',
    slug: 'remove-duplicate-lines',
    category: 'Text',
    description: 'Clean lists and data arrays by removing repetitive text lines instantly.',
    targetKeyword: 'Remove Duplicate Lines',
  },
  {
    name: 'Lorem Ipsum Generator',
    slug: 'lorem-ipsum-generator',
    category: 'Text',
    description: 'Generate customizable placeholder text paragraphs and sentences for mockups.',
    targetKeyword: 'Lorem Ipsum Generator',
  },
  {
    name: 'Markdown to HTML Converter',
    slug: 'markdown-to-html-converter',
    category: 'Text',
    description: 'Write Markdown syntax and preview sanitized HTML output in real time.',
    targetKeyword: 'Markdown to HTML Converter',
  },
  {
    name: 'Reverse Text Generator',
    slug: 'reverse-text-mirror-tool',
    category: 'Text',
    description: 'Reverse string characters or word order with backwards text effects.',
    targetKeyword: 'Reverse Text Generator',
  },
  {
    name: 'Text Diff Checker',
    slug: 'text-diff-checker',
    category: 'Text',
    description: 'Compare two text blocks side-by-side to highlight added and removed text.',
    targetKeyword: 'Text Diff Checker',
  },
  {
    name: 'Alphabetical Order Tool',
    slug: 'alphabetical-line-sorter',
    category: 'Text',
    description: 'Sort lists and lines alphabetically (A-Z, Z-A) or by string length.',
    targetKeyword: 'Alphabetical Order Tool',
  },
  {
    name: 'Remove HTML Tags',
    slug: 'strip-html-tags',
    category: 'Text',
    description: 'Clean raw HTML source code down to plain legible text strings.',
    targetKeyword: 'Remove HTML Tags',
  },
  {
    name: 'Find and Replace Text',
    slug: 'find-replace-text',
    category: 'Text',
    description: 'Search and replace words or patterns across long text documents.',
    targetKeyword: 'Find and Replace Text',
  },

  // ==========================================
  // 6. CONVERTERS (10 Complete Tools)
  // ==========================================
  {
    name: 'Length Converter',
    slug: 'unit-length-converter',
    category: 'Converters',
    description: 'Convert between Meters, Kilometers, Miles, Feet, Inches, and Yards.',
    targetKeyword: 'Length Converter',
  },
  {
    name: 'Weight Converter',
    slug: 'weight-mass-converter',
    category: 'Converters',
    description: 'Convert Kilograms, Grams, Pounds (lbs), Ounces, and Metric Tons.',
    targetKeyword: 'Weight Converter',
  },
  {
    name: 'Temperature Converter',
    slug: 'temperature-converter',
    category: 'Converters',
    description: 'Instantly convert between Celsius (°C), Fahrenheit (°F), and Kelvin (K).',
    targetKeyword: 'Temperature Converter',
  },
  {
    name: 'Data Size Converter',
    slug: 'data-size-converter',
    category: 'Converters',
    description: 'Calculate digital binary and decimal bytes (KB, MB, GB, TB, PB).',
    targetKeyword: 'Data Size Converter',
  },
  {
    name: 'Speed Converter',
    slug: 'speed-velocity-converter',
    category: 'Converters',
    description: 'Convert km/h, mph, meters per second, knots, and Mach speeds.',
    targetKeyword: 'Speed Converter',
  },
  {
    name: 'Time Converter',
    slug: 'time-duration-converter',
    category: 'Converters',
    description: 'Convert seconds, minutes, hours, days, weeks, months, and years.',
    targetKeyword: 'Time Converter',
  },
  {
    name: 'Area Converter',
    slug: 'area-land-converter',
    category: 'Converters',
    description: 'Convert Square Feet, Square Meters, Acres, Hectares, and Bigha.',
    targetKeyword: 'Area Converter',
  },
  {
    name: 'Pressure Converter',
    slug: 'pressure-unit-converter',
    category: 'Converters',
    description: 'Convert Pascal (Pa), Bar, PSI, and Atmosphere units.',
    targetKeyword: 'Pressure Converter',
  },
  {
    name: 'Energy Converter',
    slug: 'energy-work-converter',
    category: 'Converters',
    description: 'Convert Joules, Kilojoules, Calories, Kilocalories, and Kilowatt-hours.',
    targetKeyword: 'Energy Converter',
  },
  {
    name: 'Power Converter',
    slug: 'power-wattage-converter',
    category: 'Converters',
    description: 'Convert Watts, Kilowatts (kW), Megawatts, and Mechanical Horsepower.',
    targetKeyword: 'Power Converter',
  },

  // ==========================================
  // 7. FINANCIAL UTILITIES (8 Complete Tools)
  // ==========================================
  {
    name: 'SIP Calculator',
    slug: 'sip-wealth-calculator',
    category: 'Calculators',
    description: 'Compute compound interest returns and estimated future maturity on mutual fund SIPs.',
    targetKeyword: 'SIP Calculator',
  },
  {
    name: 'EMI Calculator',
    slug: 'emi-calculator',
    category: 'Finance',
    description: 'Calculate monthly loan installments, total interest costs, and amortization schedules.',
    targetKeyword: 'EMI Calculator',
  },
  {
    name: 'Lumpsum Calculator',
    slug: 'lumpsum-calculator',
    category: 'Finance',
    description: 'Estimate total maturity returns on one-time lumpsum mutual fund investments.',
    targetKeyword: 'Lumpsum Calculator',
  },
  {
    name: 'GST Calculator',
    slug: 'gst-calculator',
    category: 'Finance',
    description: 'Calculate inclusive and exclusive Goods and Services Tax (GST) for invoices.',
    targetKeyword: 'GST Calculator',
  },
  {
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    category: 'Finance',
    description: 'Calculate monthly in-hand take-home salary after taxes and deductions.',
    targetKeyword: 'Salary Calculator',
  },
  {
    name: 'FD Calculator',
    slug: 'fd-calculator',
    category: 'Finance',
    description: 'Calculate fixed deposit interest payout and total maturity sum over tenure.',
    targetKeyword: 'FD Calculator',
  },
  {
    name: 'RD Calculator',
    slug: 'rd-calculator',
    category: 'Finance',
    description: 'Estimate compounded interest gains on recurring monthly bank deposits.',
    targetKeyword: 'RD Calculator',
  },
  {
    name: 'Retirement Calculator',
    slug: 'retirement-calculator',
    category: 'Finance',
    description: 'Calculate future living expenses and target retirement savings funds.',
    targetKeyword: 'Retirement Calculator',
  },

  // ==========================================
  // 8. CALCULATORS (8 Complete Tools)
  // ==========================================
  {
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    category: 'Calculators',
    description: 'Calculate annual, monthly, and daily compound interest growth on savings.',
    targetKeyword: 'Compound Interest Calculator',
  },
  {
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    category: 'Calculators',
    description: 'Calculate basic simple interest accrued on principal amounts with fixed rates.',
    targetKeyword: 'Simple Interest Calculator',
  },
  {
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'Calculators',
    description: 'Calculate percentage increase, percentage decrease, and fraction differences instantly.',
    targetKeyword: 'Percentage Calculator',
  },
  {
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'Calculators',
    description: 'Calculate exact chronological age in years, months, weeks, and days.',
    targetKeyword: 'Age Calculator',
  },
  {
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    category: 'Calculators',
    description: 'Calculate BMI metric score and healthy weight categories based on height.',
    targetKeyword: 'BMI Calculator',
  },
  {
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    category: 'Calculators',
    description: 'Perform advanced trigonometry, logarithms, exponentials, and algebra expressions.',
    targetKeyword: 'Scientific Calculator',
  },
  {
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    category: 'Calculators',
    description: 'Calculate final prices after store coupon discounts and applicable sales taxes.',
    targetKeyword: 'Discount Calculator',
  },
  {
    name: 'Tip Calculator',
    slug: 'tip-calculator',
    category: 'Calculators',
    description: 'Split restaurant dinner bills and calculate service tip percentages evenly.',
    targetKeyword: 'Tip Calculator',
  },

  // ==========================================
  // 9. YOUTUBE TOOLS (4 Complete Tools)
  // ==========================================
  {
    name: 'YouTube Thumbnail Downloader',
    slug: 'youtube-thumbnail-downloader',
    category: 'YouTube',
    description: 'Grab full-resolution HD, 1080p, and 4K cover thumbnails from any public YouTube video.',
    targetKeyword: 'YouTube Thumbnail Downloader',
  },
  {
    name: 'YouTube Tag Generator',
    slug: 'youtube-tag-generator',
    category: 'YouTube',
    description: 'Generate high-ranking viral SEO tags and keywords for your YouTube video uploads.',
    targetKeyword: 'YouTube Tag Generator',
  },
  {
    name: 'YouTube Title Generator',
    slug: 'youtube-title-generator',
    category: 'YouTube',
    description: 'Create high-CTR click-worthy titles for YouTube video content and shorts.',
    targetKeyword: 'YouTube Title Generator',
  },
  {
    name: 'YouTube Money Calculator',
    slug: 'youtube-money-calculator',
    category: 'YouTube',
    description: 'Estimate estimated ad revenue and RPM earnings based on monthly channel views.',
    targetKeyword: 'YouTube Money Calculator',
  },
];
