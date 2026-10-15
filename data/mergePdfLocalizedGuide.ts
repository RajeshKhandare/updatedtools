import type { ToolMeta } from './toolsRegistry';
import type { ToolSeoContent } from './toolSeo';

type LocalizedGuide = {
  intro: string;
  why: string;
  headings: [string, string, string, string, string, string];
  paragraphs: [string, string, string, string, string, string];
  bullets: [string[], string[], string[], string[], string[], string[]];
};

const GUIDES: Record<string, LocalizedGuide> = {
  pt: {
    intro: 'Junte vários ficheiros PDF num único documento, na ordem pretendida. Prepare relatórios, páginas digitalizadas, faturas, formulários ou documentos de candidatura e confirme o resultado antes de o partilhar.',
    why: 'A junção de PDFs reúne documentos relacionados num ficheiro mais fácil de consultar, enviar, arquivar ou imprimir. O ficheiro combinado é uma nova cópia; mantenha os originais até verificar o resultado.',
    headings: ['O que significa juntar ficheiros PDF?', 'Como juntar PDFs passo a passo', 'Quando utilizar um PDF combinado', 'Verificações de ordem e qualidade', 'Resolver problemas comuns', 'Privacidade, limites e verificação final'],
    paragraphs: [
      'Juntar PDFs significa combinar páginas de dois ou mais ficheiros PDF existentes num único documento. A operação não corrige erros nos originais nem transforma automaticamente imagens digitalizadas em texto pesquisável.',
      'Selecione os ficheiros, organize-os na ordem de leitura, execute a junção e descarregue o novo documento. Abra o resultado e confirme as páginas antes de o utilizar.',
      'Um único PDF pode ser útil para candidaturas, trabalhos académicos, relatórios, faturas, recibos, formulários e conjuntos de páginas digitalizadas, desde que o destinatário aceite um único ficheiro.',
      'Verifique a sequência, a contagem de páginas, a orientação e a legibilidade. Documentos com tamanhos diferentes podem coexistir no mesmo PDF; reveja-os especialmente antes de imprimir.',
      'Se um ficheiro falhar, confirme se abre corretamente e se o descarregamento terminou. Ficheiros protegidos, danificados ou muito grandes podem exigir uma ferramenta compatível ou processamento em partes.',
      'Mantenha os originais, trate documentos confidenciais apenas através de fluxos autorizados e verifique os limites de tamanho e as instruções do destinatário antes de enviar o PDF final.'
    ],
    bullets: [
      ['Combine apenas os PDFs necessários e mantenha uma cópia dos originais.', 'A junção não é o mesmo que converter imagens ou reconhecer texto por OCR.'],
      ['Escolha todos os ficheiros necessários.', 'Coloque-os na ordem pretendida antes de iniciar.', 'Descarregue e abra o resultado para o verificar.'],
      ['Reúna currículo, carta e certificados quando for pedido um único anexo.', 'Combine relatórios, faturas ou páginas de um trabalho.', 'Organize digitalizações em sequência.'],
      ['Confirme a primeira e a última página de cada documento de origem.', 'Procure páginas em falta, duplicadas, rodadas ou cortadas.'],
      ['Teste cada PDF de origem separadamente.', 'Se o ficheiro for demasiado grande, considere comprimi-lo como etapa separada.', 'Use OCR separadamente se precisar de texto pesquisável.'],
      ['Partilhe apenas documentos que tem autorização para tratar.', 'Confirme o destinatário e o limite de carregamento.', 'Guarde os originais até a cópia combinada estar validada.']
    ]
  },
  es: {
    intro: 'Combina varios archivos PDF en un solo documento y en el orden que elijas. Reúne informes, páginas escaneadas, facturas, formularios o documentos de solicitud y revisa el resultado antes de compartirlo.',
    why: 'Unir PDF reúne documentos relacionados en un archivo más fácil de consultar, enviar, archivar o imprimir. El archivo combinado es una copia nueva; conserva los originales hasta comprobar el resultado.',
    headings: ['¿Qué significa unir archivos PDF?', 'Cómo combinar PDF paso a paso', 'Cuándo usar un PDF combinado', 'Comprobaciones de orden y calidad', 'Solución de problemas frecuentes', 'Privacidad, límites y revisión final'],
    paragraphs: [
      'Unir PDF significa combinar páginas de dos o más archivos PDF existentes en un único documento. La operación no corrige errores de los originales ni convierte automáticamente imágenes escaneadas en texto que se pueda buscar.',
      'Selecciona los archivos, ordénalos según la lectura, ejecuta la combinación y descarga el nuevo documento. Abre el resultado y revisa las páginas antes de utilizarlo.',
      'Un solo PDF puede servir para solicitudes de empleo, trabajos académicos, informes, facturas, recibos, formularios y lotes de páginas escaneadas, siempre que el destinatario acepte un único archivo.',
      'Comprueba el orden, el número de páginas, la orientación y la legibilidad. Un PDF puede contener páginas de distintos tamaños; revísalas especialmente antes de imprimir.',
      'Si falla un archivo, comprueba que se abre correctamente y que la descarga está completa. Los archivos protegidos, dañados o muy grandes pueden requerir otra herramienta compatible o procesarse por partes.',
      'Conserva los originales, trata los documentos confidenciales solo mediante flujos autorizados y comprueba el límite de tamaño y las instrucciones del destinatario antes de enviar el PDF final.'
    ],
    bullets: [
      ['Combina solo los PDF necesarios y conserva los originales.', 'Unir no equivale a convertir imágenes ni a reconocer texto mediante OCR.'],
      ['Selecciona todos los archivos necesarios.', 'Ordénalos antes de iniciar la combinación.', 'Descarga y abre el resultado para revisarlo.'],
      ['Reúne currículum, carta y certificados cuando se solicite un solo adjunto.', 'Combina informes, facturas o páginas de un trabajo.', 'Organiza documentos escaneados en secuencia.'],
      ['Revisa la primera y la última página de cada archivo de origen.', 'Busca páginas ausentes, duplicadas, giradas o recortadas.'],
      ['Prueba cada PDF por separado.', 'Si el archivo pesa demasiado, considera comprimirlo en un paso aparte.', 'Usa OCR por separado si necesitas texto buscable.'],
      ['Comparte solo documentos que estés autorizado a tratar.', 'Confirma el destinatario y el límite de carga.', 'Guarda los originales hasta validar el archivo combinado.']
    ]
  },
  de: {
    intro: 'Füge mehrere PDF-Dateien in der gewünschten Reihenfolge zu einem Dokument zusammen. Kombiniere Berichte, Scans, Rechnungen, Formulare oder Bewerbungsunterlagen und prüfe das Ergebnis vor dem Teilen.',
    why: 'Beim Zusammenfügen werden zusammengehörige Dokumente in einer Datei gebündelt, die sich leichter prüfen, versenden, archivieren oder drucken lässt. Die kombinierte Datei ist eine neue Kopie; bewahre die Originale bis zur Prüfung auf.',
    headings: ['Was bedeutet PDF-Dateien zusammenzufügen?', 'PDF-Dateien Schritt für Schritt verbinden', 'Wann ist ein zusammengeführtes PDF sinnvoll?', 'Reihenfolge und Qualität prüfen', 'Häufige Probleme beheben', 'Datenschutz, Grenzen und Abschlussprüfung'],
    paragraphs: [
      'PDFs zusammenzufügen bedeutet, Seiten aus zwei oder mehr vorhandenen PDF-Dateien in einem Dokument zu kombinieren. Dabei werden Fehler in den Quelldateien nicht automatisch behoben und Scans nicht automatisch in durchsuchbaren Text umgewandelt.',
      'Wähle die Dateien aus, sortiere sie in der gewünschten Lesereihenfolge, starte das Zusammenfügen und lade das neue Dokument herunter. Öffne die Ausgabe und kontrolliere die Seiten.',
      'Eine gemeinsame PDF-Datei eignet sich beispielsweise für Bewerbungen, Studienarbeiten, Berichte, Rechnungen, Belege, Formulare und zusammengehörige Scans – sofern der Empfänger eine einzelne Datei akzeptiert.',
      'Prüfe Reihenfolge, Seitenzahl, Ausrichtung und Lesbarkeit. Unterschiedliche Seitengrößen können in einer PDF-Datei vorkommen; kontrolliere sie besonders vor dem Drucken.',
      'Wenn eine Datei nicht verarbeitet wird, prüfe, ob sie sich öffnen lässt und vollständig heruntergeladen wurde. Geschützte, beschädigte oder sehr große Dateien benötigen möglicherweise ein anderes kompatibles Werkzeug oder eine Verarbeitung in mehreren Teilen.',
      'Bewahre Originale auf, verarbeite vertrauliche Dokumente nur über zugelassene Abläufe und prüfe Größenlimits sowie Vorgaben des Empfängers, bevor du die fertige PDF-Datei versendest.'
    ],
    bullets: [
      ['Füge nur benötigte PDFs zusammen und behalte die Originale.', 'Zusammenfügen ist nicht dasselbe wie Bildkonvertierung oder Texterkennung per OCR.'],
      ['Wähle alle benötigten Dateien aus.', 'Ordne sie vor dem Start in der richtigen Reihenfolge.', 'Lade das Ergebnis herunter und prüfe es.'],
      ['Fasse Lebenslauf, Anschreiben und Zeugnisse zusammen, wenn eine einzelne Anlage verlangt wird.', 'Kombiniere Berichte, Rechnungen oder Projektseiten.', 'Ordne gescannte Dokumente.'],
      ['Prüfe die erste und letzte Seite jeder Quelldatei.', 'Achte auf fehlende, doppelte, gedrehte oder abgeschnittene Seiten.'],
      ['Teste jede Quelldatei einzeln.', 'Bei zu großen Dateien kann eine separate Komprimierung helfen.', 'Nutze OCR separat, wenn durchsuchbarer Text benötigt wird.'],
      ['Verarbeite nur Dokumente, zu deren Nutzung du berechtigt bist.', 'Prüfe Empfänger und Upload-Limit.', 'Bewahre die Originale bis zur erfolgreichen Kontrolle auf.']
    ]
  },
  fr: {
    intro: 'Regroupez plusieurs fichiers PDF dans un seul document, dans l’ordre souhaité. Assemblez des rapports, des pages numérisées, des factures, des formulaires ou un dossier de candidature, puis vérifiez le résultat avant de le partager.',
    why: 'La fusion rassemble des documents liés dans un fichier plus facile à consulter, envoyer, archiver ou imprimer. Le fichier fusionné est une nouvelle copie : conservez les originaux jusqu’à la vérification.',
    headings: ['Que signifie fusionner des fichiers PDF ?', 'Fusionner des PDF étape par étape', 'Quand utiliser un PDF fusionné', 'Vérifier l’ordre et la qualité', 'Résoudre les problèmes courants', 'Confidentialité, limites et vérification finale'],
    paragraphs: [
      'Fusionner des PDF consiste à réunir les pages de deux fichiers PDF ou plus dans un seul document. Cette opération ne corrige pas les erreurs des fichiers sources et ne transforme pas automatiquement les scans en texte consultable.',
      'Sélectionnez les fichiers, classez-les dans l’ordre de lecture souhaité, lancez la fusion puis téléchargez le nouveau document. Ouvrez le résultat et vérifiez les pages avant de l’utiliser.',
      'Un PDF unique peut servir pour des candidatures, des devoirs, des rapports, des factures, des reçus, des formulaires et des lots de pages numérisées, si le destinataire accepte un seul fichier.',
      'Vérifiez l’ordre, le nombre de pages, l’orientation et la lisibilité. Un même PDF peut contenir différentes tailles de page ; contrôlez-les particulièrement avant l’impression.',
      'Si un fichier échoue, vérifiez qu’il s’ouvre correctement et que son téléchargement est complet. Les fichiers protégés, endommagés ou très volumineux peuvent nécessiter un outil compatible ou un traitement en plusieurs étapes.',
      'Conservez les originaux, traitez les documents confidentiels uniquement avec des outils autorisés et vérifiez les limites de taille ainsi que les consignes du destinataire avant l’envoi.'
    ],
    bullets: [
      ['Fusionnez uniquement les PDF nécessaires et gardez les originaux.', 'La fusion ne remplace ni la conversion d’images ni la reconnaissance de texte OCR.'],
      ['Sélectionnez tous les fichiers requis.', 'Placez-les dans le bon ordre avant de lancer la fusion.', 'Téléchargez puis ouvrez le résultat pour le vérifier.'],
      ['Réunissez CV, lettre et certificats si une seule pièce jointe est demandée.', 'Assemblez rapports, factures ou pages d’un dossier.', 'Organisez des documents numérisés.'],
      ['Vérifiez la première et la dernière page de chaque fichier source.', 'Repérez les pages manquantes, dupliquées, tournées ou rognées.'],
      ['Testez chaque PDF source séparément.', 'Si le fichier est trop volumineux, envisagez une compression distincte.', 'Utilisez l’OCR séparément si le texte doit être consultable.'],
      ['Ne traitez que les documents que vous êtes autorisé à utiliser.', 'Vérifiez le destinataire et la limite de téléversement.', 'Gardez les originaux jusqu’à validation du document fusionné.']
    ]
  },
  it: {
    intro: 'Unisci più file PDF in un unico documento nell’ordine desiderato. Combina report, pagine scansionate, fatture, moduli o documenti per candidature e controlla il risultato prima di condividerlo.',
    why: 'L’unione raccoglie documenti correlati in un file più semplice da consultare, inviare, archiviare o stampare. Il file unito è una nuova copia: conserva gli originali finché non hai verificato il risultato.',
    headings: ['Cosa significa unire file PDF?', 'Come unire PDF passo dopo passo', 'Quando usare un PDF unito', 'Controllare ordine e qualità', 'Risolvere i problemi comuni', 'Privacy, limiti e controllo finale'],
    paragraphs: [
      'Unire PDF significa combinare le pagine di due o più file PDF esistenti in un unico documento. L’operazione non corregge gli errori nei file originali e non trasforma automaticamente le scansioni in testo ricercabile.',
      'Seleziona i file, disponili nell’ordine di lettura desiderato, avvia l’unione e scarica il nuovo documento. Apri il risultato e controlla le pagine prima di usarlo.',
      'Un singolo PDF può essere utile per candidature, compiti, relazioni, fatture, ricevute, moduli e gruppi di pagine scansionate, se il destinatario accetta un solo file.',
      'Controlla sequenza, numero di pagine, orientamento e leggibilità. Un PDF può contenere pagine di dimensioni diverse; verificane l’aspetto soprattutto prima della stampa.',
      'Se un file non viene elaborato, verifica che si apra correttamente e che il download sia completo. File protetti, danneggiati o molto grandi potrebbero richiedere uno strumento compatibile o un’elaborazione separata.',
      'Conserva gli originali, tratta documenti riservati solo tramite procedure autorizzate e verifica i limiti di dimensione e le istruzioni del destinatario prima di inviare il PDF finale.'
    ],
    bullets: [
      ['Unisci solo i PDF necessari e conserva gli originali.', 'L’unione non equivale a convertire immagini o riconoscere il testo con OCR.'],
      ['Seleziona tutti i file necessari.', 'Disponili nell’ordine corretto prima di iniziare.', 'Scarica e apri il risultato per controllarlo.'],
      ['Riunisci curriculum, lettera e certificati se è richiesto un solo allegato.', 'Combina relazioni, fatture o pagine di un progetto.', 'Organizza documenti scansionati.'],
      ['Controlla la prima e l’ultima pagina di ogni file sorgente.', 'Cerca pagine mancanti, duplicate, ruotate o tagliate.'],
      ['Prova separatamente ogni PDF sorgente.', 'Se il file è troppo grande, valuta una compressione separata.', 'Usa OCR separatamente se serve testo ricercabile.'],
      ['Elabora solo documenti che sei autorizzato a gestire.', 'Verifica destinatario e limite di caricamento.', 'Conserva gli originali finché il PDF unito non è stato verificato.']
    ]
  },
  ja: {
    intro: '複数のPDFファイルを希望する順序で1つの文書にまとめます。レポート、スキャンしたページ、請求書、フォーム、応募書類などを結合し、共有前に結果を確認できます。',
    why: 'PDFの結合は、関連する文書を確認・送信・保管・印刷しやすい1つのファイルにまとめる作業です。結合後のファイルは新しいコピーなので、結果を確認するまで元のファイルを保管してください。',
    headings: ['PDFファイルの結合とは？', 'PDFを結合する手順', '結合PDFが役立つ場面', '順序と品質の確認', 'よくある問題の解決', 'プライバシー・制限・最終確認'],
    paragraphs: [
      'PDFの結合とは、2つ以上の既存PDFのページを1つの文書にまとめることです。元ファイルの誤りを修正したり、スキャン画像を自動的に検索可能なテキストに変換したりする機能ではありません。',
      'ファイルを選び、読みたい順番に並べて結合を実行し、新しい文書をダウンロードします。利用する前にファイルを開いて各ページを確認してください。',
      '提出書類、学校の課題、レポート、請求書、領収書、フォーム、スキャンしたページなどを1つにまとめると便利です。ただし、提出先が単一ファイルを受け付けることを確認してください。',
      'ページ順、ページ数、向き、読みやすさを確認します。異なるサイズのページが同じPDFに含まれる場合があるため、印刷前には特に確認してください。',
      '処理に失敗した場合は、元ファイルが正常に開けることとダウンロードが完了していることを確認します。保護されたファイル、破損ファイル、大きなファイルでは別の対応が必要な場合があります。',
      '元ファイルを保管し、機密文書は許可された手順でのみ扱ってください。送信前にファイルサイズの上限と提出先の指示を確認しましょう。'
    ],
    bullets: [
      ['必要なPDFだけを結合し、元ファイルを残してください。', '結合は画像変換やOCRによる文字認識とは異なります。'],
      ['必要なPDFをすべて選択します。', '実行前に希望の順番に並べます。', 'ダウンロードしたファイルを開いて確認します。'],
      ['1つの添付ファイルが必要な場合、履歴書・送付状・証明書をまとめます。', 'レポートや請求書を結合します。', 'スキャン文書を順番に整理します。'],
      ['各元ファイルの最初と最後のページを確認します。', '欠落、重複、回転、切り抜きの問題を探します。'],
      ['元PDFを1つずつ開いて確認します。', 'ファイルが大きすぎる場合は、別途圧縮を検討します。', '検索可能な文字が必要ならOCRを別途実行します。'],
      ['扱う権限のある文書だけを処理します。', '送信先とアップロード上限を確認します。', '結合結果を確認するまで元ファイルを保管します。']
    ]
  },
  ko: {
    intro: '여러 PDF 파일을 원하는 순서대로 하나의 문서로 합치세요. 보고서, 스캔 페이지, 청구서, 양식 또는 지원 서류를 결합한 뒤 공유하기 전에 결과를 확인할 수 있습니다.',
    why: 'PDF 합치기는 관련 문서를 확인, 전송, 보관 또는 인쇄하기 쉬운 하나의 파일로 모으는 작업입니다. 합쳐진 파일은 새 사본이므로 결과를 확인할 때까지 원본을 보관하세요.',
    headings: ['PDF 파일 합치기란?', 'PDF를 단계별로 합치는 방법', '합친 PDF를 활용하는 경우', '순서와 품질 확인', '일반적인 문제 해결', '개인정보, 제한 사항 및 최종 확인'],
    paragraphs: [
      'PDF 합치기는 두 개 이상의 기존 PDF 페이지를 하나의 문서로 결합하는 것입니다. 원본의 오류를 자동으로 수정하거나 스캔 이미지를 검색 가능한 텍스트로 자동 변환하지는 않습니다.',
      '파일을 선택하고 읽을 순서대로 정렬한 다음 합치기를 실행하고 새 문서를 다운로드하세요. 사용하기 전에 결과를 열어 페이지를 확인하세요.',
      '입사 지원 서류, 과제, 보고서, 청구서, 영수증, 양식, 스캔 페이지 등을 하나의 파일로 정리할 때 유용합니다. 단, 받는 곳에서 단일 파일을 허용하는지 확인하세요.',
      '페이지 순서, 페이지 수, 방향, 가독성을 확인하세요. 하나의 PDF에 서로 다른 페이지 크기가 포함될 수 있으므로 인쇄 전에는 특히 검토해야 합니다.',
      '파일 처리에 실패하면 원본이 정상적으로 열리는지, 다운로드가 완료되었는지 확인하세요. 암호화되거나 손상된 파일 또는 매우 큰 파일은 별도의 호환 도구가 필요할 수 있습니다.',
      '원본을 보관하고 기밀 문서는 승인된 절차로만 처리하세요. 최종 PDF를 보내기 전에 파일 크기 제한과 제출처 지침을 확인하세요.'
    ],
    bullets: [
      ['필요한 PDF만 합치고 원본을 보관하세요.', '합치기는 이미지 변환이나 OCR 텍스트 인식과 다릅니다.'],
      ['필요한 파일을 모두 선택합니다.', '실행 전에 원하는 순서로 정렬합니다.', '다운로드한 결과를 열어 확인합니다.'],
      ['단일 첨부가 필요하면 이력서, 자기소개서, 증명서를 합칩니다.', '보고서나 청구서를 결합합니다.', '스캔 문서를 순서대로 정리합니다.'],
      ['각 원본 파일의 첫 페이지와 마지막 페이지를 확인합니다.', '누락, 중복, 회전 또는 잘린 페이지가 있는지 살펴봅니다.'],
      ['원본 PDF를 각각 테스트합니다.', '파일이 너무 크면 별도로 압축하는 방법을 고려합니다.', '검색 가능한 텍스트가 필요하면 OCR을 별도로 사용합니다.'],
      ['처리 권한이 있는 문서만 사용하세요.', '수신자와 업로드 용량 제한을 확인합니다.', '결과를 검증할 때까지 원본을 보관하세요.']
    ]
  },
  zh: {
    intro: '按所需顺序将多个 PDF 文件合并为一个文档。合并报告、扫描页面、发票、表格或申请材料，并在分享前检查最终文件。',
    why: '合并 PDF 可以把相关文件整理成更便于查看、发送、归档或打印的单个文件。合并后的文件是一个新副本；确认结果之前，请保留原始文件。',
    headings: ['什么是合并 PDF 文件？', '如何逐步合并 PDF', '合并 PDF 的常见用途', '检查顺序与质量', '解决常见问题', '隐私、限制与最终检查'],
    paragraphs: [
      '合并 PDF 是指把两个或多个现有 PDF 的页面组合成一个文档。它不会自动修复源文件中的错误，也不会自动把扫描图像转换为可搜索文本。',
      '选择文件，按阅读顺序排列，执行合并并下载新文档。使用前请打开结果文件并检查页面。',
      '当需要整理求职材料、作业、报告、发票、收据、表格或扫描页面时，单个 PDF 很方便；但请先确认接收方接受单个文件。',
      '检查页面顺序、页数、方向和清晰度。一个 PDF 中可能包含不同尺寸的页面，打印前尤其需要检查。',
      '如果处理失败，请确认源文件能够正常打开且下载完整。受保护、损坏或体积很大的文件可能需要兼容的工具或分批处理。',
      '请保留原始文件，只通过获准的流程处理机密文档，并在发送前确认文件大小限制和接收方的具体要求。'
    ],
    bullets: [
      ['只合并需要的 PDF，并保留原始文件。', '合并不同于图像转 PDF 或 OCR 文字识别。'],
      ['选择所有需要的文件。', '开始前按正确顺序排列。', '下载并打开结果进行检查。'],
      ['需要单个附件时，可合并简历、求职信和证书。', '合并报告或发票。', '按顺序整理扫描文档。'],
      ['检查每个源文件的第一页和最后一页。', '留意缺页、重复页、旋转或裁切问题。'],
      ['分别测试每个源 PDF。', '文件过大时，可考虑单独压缩。', '需要可搜索文本时，请另行使用 OCR。'],
      ['只处理你获准使用的文档。', '确认接收方和上传大小限制。', '验证合并结果后再决定如何处理原件。']
    ]
  },
  ru: {
    intro: 'Объедините несколько PDF-файлов в один документ в нужном порядке. Соберите отчёты, отсканированные страницы, счета, формы или документы для заявления и проверьте результат перед отправкой.',
    why: 'Объединение PDF собирает связанные документы в один файл, который удобнее просматривать, отправлять, архивировать или печатать. Итоговый файл — новая копия; сохраняйте оригиналы до проверки.',
    headings: ['Что значит объединить PDF-файлы?', 'Как объединить PDF по шагам', 'Когда полезен объединённый PDF', 'Проверка порядка и качества', 'Решение распространённых проблем', 'Конфиденциальность, ограничения и итоговая проверка'],
    paragraphs: [
      'Объединить PDF означает собрать страницы из двух или более существующих PDF-документов в один файл. Эта операция не исправляет ошибки исходников и не превращает отсканированные изображения в доступный для поиска текст автоматически.',
      'Выберите файлы, расположите их в нужном порядке чтения, запустите объединение и скачайте новый документ. Откройте результат и проверьте страницы перед использованием.',
      'Один PDF удобен для документов о приёме на работу, учебных заданий, отчётов, счетов, квитанций, форм и наборов сканов, если получатель принимает один файл.',
      'Проверьте порядок, число страниц, ориентацию и читаемость. В одном PDF могут быть страницы разных размеров; особенно внимательно проверьте их перед печатью.',
      'Если файл не обрабатывается, убедитесь, что он открывается и полностью скачан. Защищённые, повреждённые или очень большие документы могут потребовать совместимого инструмента или обработки по частям.',
      'Сохраняйте оригиналы, обрабатывайте конфиденциальные документы только разрешённым способом и проверьте ограничения размера и требования получателя перед отправкой.'
    ],
    bullets: [
      ['Объединяйте только нужные PDF и сохраняйте оригиналы.', 'Объединение не заменяет конвертацию изображений или распознавание текста OCR.'],
      ['Выберите все нужные файлы.', 'До запуска расположите их в правильном порядке.', 'Скачайте результат и откройте его для проверки.'],
      ['Объедините резюме, письмо и сертификаты, если требуется одно вложение.', 'Соберите отчёты или счета.', 'Упорядочьте отсканированные документы.'],
      ['Проверьте первую и последнюю страницу каждого исходного файла.', 'Ищите пропущенные, повторяющиеся, повёрнутые или обрезанные страницы.'],
      ['Проверьте каждый исходный PDF отдельно.', 'Если файл слишком велик, рассмотрите отдельное сжатие.', 'Для поиска по тексту используйте OCR отдельно.'],
      ['Обрабатывайте только документы, с которыми вам разрешено работать.', 'Проверьте получателя и лимит загрузки.', 'Храните оригиналы до проверки объединённого файла.']
    ]
  },
  ar: {
    intro: 'اجمع عدة ملفات PDF في مستند واحد بالترتيب الذي تختاره. ادمج التقارير والصفحات الممسوحة ضوئيًا والفواتير والنماذج أو مستندات التقديم، ثم راجع الملف قبل مشاركته.',
    why: 'يساعد دمج PDF على جمع المستندات المرتبطة في ملف واحد يسهل مراجعته وإرساله وأرشفته أو طباعته. الملف الناتج نسخة جديدة؛ احتفظ بالملفات الأصلية حتى تتحقق من النتيجة.',
    headings: ['ما المقصود بدمج ملفات PDF؟', 'كيفية دمج ملفات PDF خطوة بخطوة', 'متى يفيد ملف PDF المدمج؟', 'التحقق من الترتيب والجودة', 'حل المشكلات الشائعة', 'الخصوصية والقيود والمراجعة النهائية'],
    paragraphs: [
      'يعني دمج PDF جمع صفحات ملفين أو أكثر من ملفات PDF الموجودة في مستند واحد. لا تصلح العملية الأخطاء في الملفات الأصلية تلقائيًا، ولا تحول الصور الممسوحة إلى نص قابل للبحث من تلقاء نفسها.',
      'حدد الملفات ورتبها حسب تسلسل القراءة المطلوب، ثم نفذ الدمج ونزّل المستند الجديد. افتح الناتج وتحقق من الصفحات قبل استخدامه.',
      'يفيد ملف PDF واحد في طلبات التوظيف والواجبات والتقارير والفواتير والإيصالات والنماذج ومجموعات الصفحات الممسوحة، إذا كان المستلم يقبل ملفًا واحدًا.',
      'تحقق من ترتيب الصفحات وعددها واتجاهها ووضوحها. قد يحتوي الملف الواحد على صفحات بأحجام مختلفة؛ راجعها جيدًا قبل الطباعة.',
      'إذا تعذرت معالجة ملف، فتأكد من أنه يفتح بشكل صحيح وأن تنزيله اكتمل. قد تحتاج الملفات المحمية أو التالفة أو الكبيرة جدًا إلى أداة متوافقة أو معالجة على أجزاء.',
      'احتفظ بالملفات الأصلية، ولا تعالج المستندات السرية إلا عبر إجراءات مصرح بها، وتحقق من حد الحجم ومتطلبات المستلم قبل إرسال ملف PDF النهائي.'
    ],
    bullets: [
      ['ادمج ملفات PDF المطلوبة فقط واحتفظ بالأصول.', 'الدمج يختلف عن تحويل الصور أو التعرف الضوئي على الحروف OCR.'],
      ['حدد جميع الملفات المطلوبة.', 'رتبها قبل بدء الدمج.', 'نزّل الناتج وافتحه للتحقق منه.'],
      ['اجمع السيرة الذاتية وخطاب التقديم والشهادات إذا طُلب مرفق واحد.', 'اجمع التقارير أو الفواتير.', 'رتب المستندات الممسوحة ضوئيًا.'],
      ['راجع الصفحة الأولى والأخيرة من كل ملف مصدر.', 'ابحث عن الصفحات المفقودة أو المكررة أو المقلوبة أو المقتطعة.'],
      ['اختبر كل ملف PDF على حدة.', 'إذا كان الملف كبيرًا جدًا، ففكر في ضغطه كخطوة منفصلة.', 'استخدم OCR بشكل منفصل إذا احتجت إلى نص قابل للبحث.'],
      ['عالج المستندات التي تملك صلاحية استخدامها فقط.', 'تحقق من المستلم وحد الرفع.', 'احتفظ بالأصول حتى تتأكد من الملف المدمج.']
    ]
  },
  hi: {
    intro: 'कई PDF फ़ाइलों को अपनी पसंद के क्रम में एक दस्तावेज़ में जोड़ें। रिपोर्ट, स्कैन किए गए पेज, इनवॉइस, फ़ॉर्म या आवेदन के दस्तावेज़ मर्ज करें और साझा करने से पहले अंतिम PDF जाँचें।',
    why: 'PDF मर्ज करने से संबंधित दस्तावेज़ एक ऐसी फ़ाइल में व्यवस्थित हो जाते हैं जिसे पढ़ना, भेजना, संग्रहित करना या प्रिंट करना आसान होता है। मर्ज की गई फ़ाइल नई कॉपी होती है; जाँच पूरी होने तक मूल फ़ाइलें सुरक्षित रखें।',
    headings: ['PDF फ़ाइलें मर्ज करने का क्या मतलब है?', 'PDF फ़ाइलें मर्ज करने के चरण', 'मर्ज की गई PDF कब उपयोगी है?', 'क्रम और गुणवत्ता की जाँच', 'आम समस्याओं का समाधान', 'गोपनीयता, सीमाएँ और अंतिम जाँच'],
    paragraphs: [
      'PDF मर्ज करने का अर्थ है दो या अधिक मौजूदा PDF दस्तावेज़ों के पेजों को एक फ़ाइल में जोड़ना। इससे मूल फ़ाइलों की गलतियाँ अपने आप ठीक नहीं होतीं और स्कैन की गई तस्वीरें अपने आप खोजने योग्य टेक्स्ट में नहीं बदलतीं।',
      'फ़ाइलें चुनें, उन्हें पढ़ने के सही क्रम में रखें, मर्ज चलाएँ और नई फ़ाइल डाउनलोड करें। इस्तेमाल करने से पहले PDF खोलकर पेजों की जाँच करें।',
      'एक PDF में नौकरी के आवेदन, कॉलेज असाइनमेंट, रिपोर्ट, बिल, रसीदें, फ़ॉर्म और स्कैन किए गए पेज रखे जा सकते हैं—बशर्ते प्राप्तकर्ता एक ही फ़ाइल स्वीकार करता हो।',
      'पेजों का क्रम, कुल संख्या, दिशा और स्पष्टता जाँचें। एक PDF में अलग-अलग आकार के पेज हो सकते हैं; प्रिंट करने से पहले उन्हें ध्यान से देखें।',
      'यदि कोई फ़ाइल प्रोसेस नहीं होती, तो जाँचें कि वह सही से खुलती है और पूरी डाउनलोड हुई है। पासवर्ड-सुरक्षित, खराब या बहुत बड़ी फ़ाइलों के लिए संगत टूल या अलग-अलग चरणों में प्रोसेसिंग की ज़रूरत हो सकती है।',
      'मूल फ़ाइलें सुरक्षित रखें, गोपनीय दस्तावेज़ केवल अधिकृत प्रक्रिया से प्रोसेस करें और अंतिम PDF भेजने से पहले फ़ाइल आकार की सीमा तथा प्राप्तकर्ता के निर्देश जाँचें।'
    ],
    bullets: [
      ['केवल ज़रूरी PDF मर्ज करें और मूल फ़ाइलें रखें।', 'मर्ज करना इमेज कन्वर्ज़न या OCR टेक्स्ट पहचान से अलग है।'],
      ['सभी ज़रूरी PDF चुनें।', 'मर्ज शुरू करने से पहले सही क्रम में लगाएँ।', 'डाउनलोड की गई फ़ाइल खोलकर जाँचें।'],
      ['एक ही अटैचमेंट माँगा गया हो तो रिज़्यूमे, कवर लेटर और प्रमाणपत्र जोड़ें।', 'रिपोर्ट या इनवॉइस एक साथ रखें।', 'स्कैन किए गए दस्तावेज़ क्रम में व्यवस्थित करें।'],
      ['हर मूल PDF के पहले और आख़िरी पेज की जाँच करें।', 'गायब, दोहराए गए, घूमे हुए या कटे हुए पेज देखें।'],
      ['हर मूल PDF को अलग से खोलकर जाँचें।', 'फ़ाइल बहुत बड़ी हो तो अलग से compress करने पर विचार करें।', 'खोजने योग्य टेक्स्ट चाहिए तो OCR अलग से इस्तेमाल करें।'],
      ['केवल वही दस्तावेज़ प्रोसेस करें जिन्हें इस्तेमाल करने की अनुमति है।', 'प्राप्तकर्ता और अपलोड सीमा जाँचें।', 'मर्ज की गई PDF सत्यापित होने तक मूल फ़ाइलें रखें।']
    ]
  }
};

export function getMergePdfLocalizedSeoContent(tool: ToolMeta, locale: string): ToolSeoContent | null {
  const guide = GUIDES[locale];
  if (!guide) return null;
  const articleSections = guide.headings.map((heading, index) => ({
    heading,
    paragraphs: [guide.paragraphs[index]],
    bullets: guide.bullets[index],
  }));
  return {
    heroIntro: guide.intro,
    intro: guide.intro + ' ' + guide.why,
    why: guide.why,
    steps: guide.bullets[1],
    useCases: guide.bullets[2],
    tips: guide.bullets[3],
    limitations: guide.bullets[5],
    faq: [
      { q: guide.headings[0], a: guide.paragraphs[0] },
      { q: guide.headings[1], a: guide.paragraphs[1] },
      { q: guide.headings[2], a: guide.paragraphs[2] },
      { q: guide.headings[3], a: guide.paragraphs[3] },
      { q: guide.headings[4], a: guide.paragraphs[4] },
      { q: guide.headings[5], a: guide.paragraphs[5] },
    ],
    visual: 'workflow',
    articleSections,
  };
}
