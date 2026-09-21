import type { LocaleCode } from './internationalSeo';

export type EngineUi = {
  choosePdf: string;
  chooseImage: string;
  chooseDocx: string;
  fileSubtitle: string;
  process: string;
  processing: string;
  download: string;
  generate: string;
  copy: string;
  copied: string;
  runCode: string;
  preview: string;
  reset: string;
  result: string;
  enterValues: string;
};

const ENGINE_UI: Record<LocaleCode, EngineUi> = {
  en: { choosePdf:'Choose or Drop PDF Files', chooseImage:'Choose or Drop Image Files', chooseDocx:'Choose or Drop DOCX Files', fileSubtitle:'Direct device processing • Files stay on your device where supported', process:'Process', processing:'Processing...', download:'Download', generate:'Generate', copy:'Copy', copied:'Copied', runCode:'Run Code', preview:'Preview', reset:'Reset code', result:'Result', enterValues:'Enter values to calculate.' },
  pt: { choosePdf:'Escolha ou arraste arquivos PDF', chooseImage:'Escolha ou arraste arquivos de imagem', chooseDocx:'Escolha ou arraste arquivos DOCX', fileSubtitle:'Processamento direto no dispositivo • Os arquivos permanecem no seu dispositivo', process:'Processar', processing:'Processando...', download:'Baixar', generate:'Gerar', copy:'Copiar', copied:'Copiado', runCode:'Executar código', preview:'Pré-visualizar', reset:'Redefinir código', result:'Resultado', enterValues:'Insira os valores para calcular.' },
  es: { choosePdf:'Elige o arrastra archivos PDF', chooseImage:'Elige o arrastra archivos de imagen', chooseDocx:'Elige o arrastra archivos DOCX', fileSubtitle:'Procesamiento directo en el dispositivo • Los archivos permanecen en tu dispositivo', process:'Procesar', processing:'Procesando...', download:'Descargar', generate:'Generar', copy:'Copiar', copied:'Copiado', runCode:'Ejecutar código', preview:'Vista previa', reset:'Restablecer código', result:'Resultado', enterValues:'Introduce valores para calcular.' },
  de: { choosePdf:'PDF-Dateien auswählen oder hierher ziehen', chooseImage:'Bilddateien auswählen oder hierher ziehen', chooseDocx:'DOCX-Dateien auswählen oder hierher ziehen', fileSubtitle:'Direkte Verarbeitung auf dem Gerät • Dateien bleiben, wo unterstützt, auf deinem Gerät', process:'Verarbeiten', processing:'Wird verarbeitet...', download:'Herunterladen', generate:'Erstellen', copy:'Kopieren', copied:'Kopiert', runCode:'Code ausführen', preview:'Vorschau', reset:'Code zurücksetzen', result:'Ergebnis', enterValues:'Werte zur Berechnung eingeben.' },
  fr: { choosePdf:'Choisir ou déposer des fichiers PDF', chooseImage:'Choisir ou déposer des fichiers image', chooseDocx:'Choisir ou déposer des fichiers DOCX', fileSubtitle:'Traitement direct sur l’appareil • Les fichiers restent sur votre appareil lorsque possible', process:'Traiter', processing:'Traitement...', download:'Télécharger', generate:'Générer', copy:'Copier', copied:'Copié', runCode:'Exécuter le code', preview:'Aperçu', reset:'Réinitialiser le code', result:'Résultat', enterValues:'Saisissez les valeurs à calculer.' },
  it: { choosePdf:'Scegli o trascina i file PDF', chooseImage:'Scegli o trascina i file immagine', chooseDocx:'Scegli o trascina i file DOCX', fileSubtitle:'Elaborazione diretta sul dispositivo • I file restano sul dispositivo quando supportato', process:'Elabora', processing:'Elaborazione...', download:'Scarica', generate:'Genera', copy:'Copia', copied:'Copiato', runCode:'Esegui codice', preview:'Anteprima', reset:'Reimposta codice', result:'Risultato', enterValues:'Inserisci i valori per calcolare.' },
  ja: { choosePdf:'PDFファイルを選択またはドロップ', chooseImage:'画像ファイルを選択またはドロップ', chooseDocx:'DOCXファイルを選択またはドロップ', fileSubtitle:'端末上で直接処理 • 対応している場合、ファイルは端末から外部に送信されません', process:'処理する', processing:'処理中...', download:'ダウンロード', generate:'生成', copy:'コピー', copied:'コピーしました', runCode:'コードを実行', preview:'プレビュー', reset:'コードをリセット', result:'結果', enterValues:'計算する値を入力してください。' },
  ko: { choosePdf:'PDF 파일을 선택하거나 놓으세요', chooseImage:'이미지 파일을 선택하거나 놓으세요', chooseDocx:'DOCX 파일을 선택하거나 놓으세요', fileSubtitle:'기기에서 직접 처리 • 지원되는 경우 파일은 기기에 남습니다', process:'처리', processing:'처리 중...', download:'다운로드', generate:'생성', copy:'복사', copied:'복사됨', runCode:'코드 실행', preview:'미리보기', reset:'코드 초기화', result:'결과', enterValues:'계산할 값을 입력하세요.' },
  zh: { choosePdf:'选择或拖放 PDF 文件', chooseImage:'选择或拖放图片文件', chooseDocx:'选择或拖放 DOCX 文件', fileSubtitle:'直接在设备上处理 • 在支持的情况下文件保留在设备上', process:'处理', processing:'处理中...', download:'下载', generate:'生成', copy:'复制', copied:'已复制', runCode:'运行代码', preview:'预览', reset:'重置代码', result:'结果', enterValues:'输入数值进行计算。' },
  ru: { choosePdf:'Выберите или перетащите PDF-файлы', chooseImage:'Выберите или перетащите изображения', chooseDocx:'Выберите или перетащите DOCX-файлы', fileSubtitle:'Обработка непосредственно на устройстве • При поддержке файлы остаются на устройстве', process:'Обработать', processing:'Обработка...', download:'Скачать', generate:'Создать', copy:'Копировать', copied:'Скопировано', runCode:'Запустить код', preview:'Предпросмотр', reset:'Сбросить код', result:'Результат', enterValues:'Введите значения для расчёта.' },
  ar: { choosePdf:'اختر ملفات PDF أو اسحبها وأفلتها', chooseImage:'اختر ملفات الصور أو اسحبها وأفلتها', chooseDocx:'اختر ملفات DOCX أو اسحبها وأفلتها', fileSubtitle:'معالجة مباشرة على الجهاز • تبقى الملفات على جهازك عند دعم ذلك', process:'معالجة', processing:'جارٍ المعالجة...', download:'تنزيل', generate:'إنشاء', copy:'نسخ', copied:'تم النسخ', runCode:'تشغيل الكود', preview:'معاينة', reset:'إعادة ضبط الكود', result:'النتيجة', enterValues:'أدخل القيم لإجراء الحساب.' },
  hi: { choosePdf:'PDF फ़ाइलें चुनें या ड्रॉप करें', chooseImage:'इमेज फ़ाइलें चुनें या ड्रॉप करें', chooseDocx:'DOCX फ़ाइलें चुनें या ड्रॉप करें', fileSubtitle:'डिवाइस पर सीधे प्रोसेसिंग • जहाँ समर्थित हो, फ़ाइलें आपके डिवाइस पर रहती हैं', process:'प्रोसेस करें', processing:'प्रोसेस हो रहा है...', download:'डाउनलोड', generate:'जनरेट करें', copy:'कॉपी करें', copied:'कॉपी हो गया', runCode:'कोड चलाएँ', preview:'प्रीव्यू', reset:'कोड रीसेट करें', result:'परिणाम', enterValues:'गणना के लिए मान दर्ज करें।' },
};

export function getEngineUi(locale: LocaleCode): EngineUi {
  return ENGINE_UI[locale] || ENGINE_UI.en;
}
