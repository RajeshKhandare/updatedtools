import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const chapters = [
  {
    title: '1. What is a paste image to download tool?',
    paragraphs: [
      'A paste image to download tool gives you a simple route from an image that is already on your clipboard to a file you can keep on your device. Instead of opening a large editor, creating a blank document, or taking extra screenshots, you can copy an image, return to this page, paste it, inspect the preview, choose an output format, and download it. This is useful for screenshots, copied graphics, reference images, diagrams, and visual material that you are allowed to save.',
      'The key distinction is that pasting and downloading are different actions. Copying places image data on the clipboard; pasting makes that data available to a browser page; downloading creates a named file in your browser’s download flow. A reliable workflow makes each step clear and gives you a chance to check the preview before saving. This tool is designed for that focused workflow rather than for full photo editing, cloud storage, or image hosting.',
      'A browser-based tool can be convenient because it is available on a supported desktop browser without installing a separate application. The actual clipboard behavior still depends on your operating system, browser, permissions, and the kind of content that was copied. If a source application copies an image as text, a link, or a proprietary clipboard format rather than as image data, an image paste action may not receive a usable image. In that case, saving the source image first and choosing the file is a dependable alternative.'
    ]
  },
  {
    title: '2. How to paste an image with Ctrl+V',
    paragraphs: [
      'First, copy an image from a source that supports copying image pixels. Depending on the application, this may mean right-clicking an image and choosing Copy image, using a screenshot utility and copying its result, or using an application’s Copy command while an image is selected. Then return to the paste tool page and press Ctrl+V on Windows or Linux. On macOS, use Command+V. If image data is present on the clipboard and the browser exposes it to the page, the preview should appear.',
      'If nothing happens, check the source before repeatedly pressing the shortcut. Some websites copy an image address instead of image pixels. Some remote desktop tools place screenshots on a clipboard that the local browser cannot access. A browser may also limit clipboard access in certain contexts. Try pasting into a graphics application to confirm that the clipboard actually contains image data, or use the file picker to select an image saved locally.',
      'For privacy and control, review the preview before downloading. Make sure it is the intended image, and check that the dimensions look plausible. If the preview is blank, distorted, or not the expected content, clear it and try another source or use a local file. Avoid pasting confidential screenshots on a shared or public computer, even when a tool is designed to process data locally.'
    ]
  },
  {
    title: '3. Using the file picker and drag and drop',
    paragraphs: [
      'Clipboard paste is fast, but it is not the only way to use the tool. Choose an image opens the browser’s file picker, where you can select a supported image from your device. Drag and drop can be convenient when the image is already visible in a desktop folder. Both methods are useful when a browser does not receive clipboard image data or when the original image is already saved.',
      'Choose the original file whenever quality matters. Repeatedly taking screenshots of an image can reduce sharpness, add unwanted interface elements, or change the dimensions. If you have the original file, use it rather than a screenshot of the image displayed on screen. The tool checks that the selected file has an image MIME type and is no larger than the stated 25 MB limit. A browser’s file type information is not a complete security guarantee, so only use files from sources you trust.',
      'If a drag-and-drop operation fails, drop the file directly from a normal file manager rather than from a website preview or another browser tab. Some web pages expose a link or URL rather than the actual image file when dragged. In that situation, save the image first and select the saved file. On mobile devices, file selection may be more reliable than desktop-style dragging.'
    ]
  },
  {
    title: '4. PNG, JPG and WebP explained',
    paragraphs: [
      'PNG is a lossless image format that is especially useful for screenshots, interface captures, diagrams, text-heavy graphics, and images with transparency. Lossless encoding preserves pixel values rather than discarding detail to reduce file size. PNG files can be larger than a comparable JPEG, particularly for photographs, but they are often a sensible default when crisp text or transparent areas matter.',
      'JPG, commonly called JPEG, is a lossy format designed to store photographic images efficiently. It can create much smaller files than PNG for many photos, which is helpful for sharing and uploading. However, saving a JPEG introduces compression and may soften fine details or create artifacts around text and sharp edges. JPEG does not preserve transparency; transparent areas are filled with a solid background during conversion. This tool uses white as the background when producing a JPEG so transparent pixels do not turn into an unexpected black area.',
      'WebP supports lossy and lossless compression and can preserve transparency. It often provides a useful balance between quality and file size for websites and modern image workflows. Compatibility is broad in current browsers and applications, but a recipient’s older software may not support it. If a file must open in the widest possible range of older tools, PNG or JPEG may be a safer choice. The best format depends on the content and where the image will be used; there is no single format that is always smallest and highest quality.'
    ]
  },
  {
    title: '5. How to choose the right format',
    paragraphs: [
      'Choose PNG when the image contains small text, line art, UI elements, charts, or transparency that you want to preserve. Choose JPG when the image is mainly a photograph and a smaller file is more important than perfect pixel preservation. Choose WebP when you want efficient web delivery and the receiving platform supports it. If you are unsure, keep a PNG copy of a screenshot or graphic before creating a compressed version for sharing.',
      'Format conversion does not create detail that was absent from the source. Converting a blurry JPEG to PNG does not restore the original quality; it simply stores the existing pixels in a different format. Similarly, converting a small image to a larger canvas does not add genuine detail. Keep the original source when it may be needed later, and treat each converted file as a convenient output copy.',
      'A conversion can also change file size in surprising ways. A photograph saved as PNG may become much larger, while a screenshot with flat colors may compress very well as PNG. WebP results vary according to image content and encoder settings. Compare the downloaded file against your needs rather than assuming that one extension guarantees a particular file size or quality.'
    ]
  },
  {
    title: '6. What happens when you download?',
    paragraphs: [
      'After you select a format and choose Download image, the browser loads the preview image, draws it to a canvas, and asks the browser to encode the canvas in the requested MIME type. The resulting file is offered as a download with a descriptive filename. Canvas-based conversion is supported in modern browsers, but exact encoding behavior and output size can vary between browsers and operating systems.',
      'A browser may ask where to save downloads, save directly to the default Downloads folder, or show the download in its toolbar. If you cannot find the file, open your browser’s downloads list and use its show-in-folder or reveal option. The file name includes a tool-specific suffix to help distinguish the converted output from the source. You can rename it after saving.',
      'If the browser does not support the requested output type, encoding may fail or the browser may return an unexpected format. Try PNG as a fallback, or use a current version of a mainstream browser. A download that starts successfully is not the same as a guarantee that every third-party application can open the resulting file; test the file in the destination application if it is part of an important workflow.'
    ]
  },
  {
    title: '7. Privacy and local processing',
    paragraphs: [
      'The tool is intended to process the selected image in your browser rather than upload the image to an image-conversion server. Local processing reduces the need to send image content over the network and can be useful for ordinary screenshots and reference images. The image is represented in the page by a temporary browser object URL, and the conversion uses browser APIs. Clearing the image or leaving the page releases the object URL used by the preview.',
      'Local processing is a useful privacy property, but it should not be interpreted as a universal security guarantee for every device or browser extension. Your device, operating system, browser, extensions, clipboard manager, screen-recording software, and download settings remain outside the tool’s control. If an image contains passwords, payment details, private records, confidential work, or personal information, use an appropriate trusted device and follow your organization’s rules.',
      'A privacy-conscious workflow includes copying only the content you intend to save, checking the preview, clearing the image when finished, and removing the downloaded file if it was saved to a shared device by mistake. On a public computer, remember that the Downloads folder and clipboard history may be accessible to other users. For sensitive work, a managed device and approved software may be more appropriate than any public website.'
    ]
  },
  {
    title: '8. Supported file sizes and performance',
    paragraphs: [
      'The tool accepts image files up to 25 MB. This is a file-size limit, not a promise that every image under that limit will convert instantly on every device. Large dimensions can require significant memory because the browser may decode the image into pixels and allocate a canvas of similar dimensions. A very large image can therefore use much more memory than its compressed file size suggests.',
      'If a conversion takes a long time, close unnecessary tabs and try a smaller source image if that is acceptable for your task. Avoid repeatedly clicking Download while the browser is still processing. On older devices, large images may cause a tab to become temporarily unresponsive. If a file is unusually large in pixel dimensions, use an image editor or trusted resizing tool to create a suitable copy before conversion.',
      'The 25 MB limit helps keep the workflow practical, but it is not a substitute for sensible file handling. If you are preparing images for a website, consider the actual display dimensions and the file-size budget for that page. If you are archiving an original, keep the original separately rather than relying only on a compressed export.'
    ]
  },
  {
    title: '9. Troubleshooting: paste does not work',
    paragraphs: [
      'Start by confirming that the clipboard contains an image rather than text or a web address. Copy the image itself from the source application, return to the tool, and use the correct shortcut for your operating system. If you copied a screenshot, make sure the screenshot utility has completed and placed the result on the clipboard. Some utilities save a file without copying it, so file selection may be the correct next step.',
      'If the shortcut is intercepted by another application or browser extension, click an empty part of the page and try again. Clipboard behavior differs across applications, and a page cannot force every source application to expose its image data. Try another browser or save the image locally and use Choose an image. Do not disable security protections or grant broad permissions merely to make one paste operation work.',
      'If the image still does not appear, refresh the page and try with a simple test image that contains no sensitive content. If the test image works, the issue may be related to the original application or clipboard format. If no image works, check whether browser extensions or device policies restrict clipboard events. A saved file is the most reliable fallback.'
    ]
  },
  {
    title: '10. Troubleshooting: download or conversion fails',
    paragraphs: [
      'First confirm that the preview is visible and that a format is selected. If conversion reports an unsupported format, try PNG. If the image preview never finishes loading, choose the source file again or try a smaller copy. If the browser blocks a download, check the browser’s download notification and site settings rather than repeatedly pressing the button.',
      'If the file downloads but will not open, check its extension and open it with a current image viewer. A mismatch between a file extension and its actual encoded content can cause some programs to reject it. Try downloading again in PNG or JPEG, and avoid renaming the extension alone as a way to convert the file. Changing a filename suffix does not change the underlying image encoding.',
      'When working with a deadline, retain the source file and verify the converted image in the application where it will be used. Different apps may apply their own color management, transparency handling, or preview scaling. For critical publishing or print work, use a dedicated image editor and check the exported result before delivery.'
    ]
  },
  {
    title: '11. Image dimensions, aspect ratio and quality',
    paragraphs: [
      'Pixel dimensions describe the width and height of an image in pixels. A 1920 × 1080 image contains a different amount of pixel data from a 600 × 400 image, and both may be displayed at many different sizes depending on the screen and layout. The preview reports the natural pixel dimensions so you can confirm that the selected image is the one you expect.',
      'Aspect ratio is the relationship between width and height. This tool preserves the source image’s dimensions during format conversion; it is not intended to crop, resize, or stretch the image. If you need a square avatar, a fixed social-media dimension, or a print layout, use a tool designed for cropping or resizing and check the platform’s current requirements.',
      'Perceived quality depends on source resolution, compression, image content, display size, and the software used to view it. Sharp text and thin lines are especially sensitive to lossy compression. Photographs can often tolerate some compression without an obvious difference at normal viewing sizes. Always inspect the output at the size that matters for your use case.'
    ]
  },
  {
    title: '12. Screenshots, diagrams and copied graphics',
    paragraphs: [
      'Screenshots often contain text, icons, menus, and flat-color regions. PNG is usually a good first choice because lossless compression can preserve these details without the ringing or block artifacts associated with lossy compression. If the screenshot is being uploaded to a service that has a strict file-size limit, compare a WebP version while keeping the original available.',
      'Diagrams and charts may contain small labels that become difficult to read when compressed too aggressively. Before sharing a converted diagram, zoom in and confirm that labels, axes, and symbols remain legible. If the chart will be used in a report, prefer the original exported graphic from the source application over a screenshot whenever possible.',
      'Copied graphics can include transparency. PNG and WebP can preserve it, while JPEG cannot. If a transparent logo is converted to JPEG, the transparent region must become a solid color. A white background is common for documents, but it may not match a dark website or colored slide. Choose a format that matches the destination and verify the background before sharing.'
    ]
  },
  {
    title: '13. Using images on websites and blogs',
    paragraphs: [
      'For web publishing, image format is only one part of performance. Choose dimensions close to the size at which the image will actually be displayed, avoid uploading unnecessarily huge originals, and provide meaningful alternative text when an image communicates information. Decorative images may need empty alternative text depending on how they are implemented. A file converter cannot decide the correct alt text because that depends on the image’s purpose in the surrounding page.',
      'WebP can reduce transfer size for many common images, but confirm that your content management system and publishing pipeline support it. Some platforms reprocess uploads or create responsive variants automatically. If you are preparing an image for a site, test the final page and verify that the image loads at the intended size on both desktop and mobile.',
      'Do not use conversion as a way to remove licensing obligations. Before publishing, confirm that you have permission to use the image and that any required attribution is retained. Also check whether the image contains private information, personal data, or content that should not be published publicly.'
    ]
  },
  {
    title: '14. Images for documents, email and presentations',
    paragraphs: [
      'For documents and presentations, PNG is often helpful for screenshots, charts, logos, and diagrams with small text. JPEG is often suitable for photographic images when file size matters. When placing images into a document, keep a copy of the source and verify that the final document still displays the image correctly after it is saved or exported.',
      'Email providers and office applications may impose attachment limits or re-encode images. If an image is too large, WebP or JPEG may reduce file size, but check that the recipient can open the chosen format. When compatibility is uncertain, JPEG for photos and PNG for screenshots are familiar choices. Do not compress a diagram so much that important labels become unreadable.',
      'For slides, use an image with enough pixels for the presentation size and avoid enlarging tiny screenshots. Keep the image’s aspect ratio intact unless you intentionally crop it. If the presentation will be shared widely, test it on another device or export a PDF copy to make sure the graphics appear as intended.'
    ]
  },
  {
    title: '15. Accessibility and keyboard-friendly use',
    paragraphs: [
      'A useful image tool should provide clear labels, visible keyboard focus, status messages, and controls that can be reached without a mouse. Clipboard paste is convenient for keyboard users, while a clearly labeled file picker provides an alternative path. Status text should explain whether an image is ready, whether conversion is in progress, and what to try when an operation fails.',
      'Keyboard shortcuts can differ by operating system and application. Ctrl+V is common on Windows and Linux, while Command+V is common on macOS. On mobile devices, system clipboard behavior may be different, and selecting a saved image may be easier. If you use assistive technology, the file picker and preview are alternative ways to complete the task without relying on drag and drop.',
      'When sharing an image with other people, consider whether its information is also available as text. A screenshot of instructions or a chart may not be accessible to someone using a screen reader. Add an explanation, caption, or data table where appropriate. Conversion changes the file format, not the accessibility of the information inside the image.'
    ]
  },
  {
    title: '16. Mobile and tablet considerations',
    paragraphs: [
      'On phones and tablets, clipboard support varies by operating system, browser, and the application from which the image was copied. Some mobile apps offer Copy image, while others expose only a link or a share action. If paste does not work, save the image to your device and use the file picker. The file picker may show recent images, downloads, cloud files, or other locations depending on your device.',
      'Large images can take longer to process on mobile hardware because memory and processing resources may be more limited than on a desktop computer. Keep the browser tab open while the download is prepared, and avoid switching repeatedly between heavy applications during conversion. If the page becomes unresponsive, reopen it and try a smaller image.',
      'Mobile download behavior also differs. The browser may save the file to Downloads, open a share sheet, or ask where to store it. Check the browser’s download list or the device’s Files app. If you need the image in a particular photo library, follow the device’s normal import or save-to-photos workflow after downloading.'
    ]
  },
  {
    title: '17. Browser compatibility and recommended workflow',
    paragraphs: [
      'Current versions of Chrome, Edge, Firefox, and Safari generally provide the browser APIs needed for image preview and canvas conversion, but implementation details can vary. Keeping your browser updated helps with compatibility, security, and performance. Managed workplace browsers may have policies or extensions that change clipboard and download behavior.',
      'A good troubleshooting sequence is simple: try paste once; if it fails, choose a local file; confirm the preview and dimensions; choose the required format; download; then open the downloaded file to verify it. This sequence separates clipboard problems from file-loading problems and format-encoding problems, making it easier to identify where something went wrong.',
      'If your work depends on a specialized format, color profile, animation, metadata, or transparency behavior, verify the output carefully. A canvas conversion workflow is designed for ordinary still images and may not preserve every piece of source metadata or animated frames. For professional imaging tasks, use a dedicated application that explicitly supports the feature you need.'
    ]
  },
  {
    title: '18. What this tool does not do',
    paragraphs: [
      'This tool focuses on receiving an image, showing a preview, and downloading a PNG, JPG, or WebP copy. It is not an image host, a public sharing gallery, a cloud backup service, a photo editor, or a metadata management application. It does not replace a workflow that requires cropping, layers, retouching, batch conversion, color-profile control, or animation editing.',
      'Converting a file does not prove ownership, remove copyright restrictions, or make private information safe to publish. It also does not guarantee a smaller file in every case. Output dimensions follow the source image, and image quality is constrained by the source and the selected format. If you need resizing or compression controls, use a tool specifically built for those tasks.',
      'The tool also cannot recover an image that is no longer available on your clipboard or that the source application never copied as image data. It cannot bypass operating-system permissions or browser security rules. If clipboard paste is unavailable, the local file picker is the practical alternative.'
    ]
  },
  {
    title: '19. Responsible use and copyright',
    paragraphs: [
      'Only download and reuse images that you own, have permission to use, or are otherwise permitted to use under the applicable license or law. An image being visible on a website does not automatically mean that it is free to reuse. For commercial use, check the license terms, attribution requirements, and any restrictions on redistribution or modification.',
      'Screenshots can contain names, email addresses, account details, internal dashboards, private messages, or other sensitive material. Before sharing a screenshot, inspect the whole image, including corners and background areas, and redact sensitive content using an appropriate editing tool. Simply changing the file format does not remove visible information.',
      'When working in an organization, follow internal rules about confidential data, approved software, and retention. A browser-side workflow can reduce data transfer, but it cannot override company policies or eliminate risks from a compromised device. Use the tool for appropriate content and verify the final output before distributing it.'
    ]
  },
  {
    title: '20. Frequently asked questions',
    paragraphs: [
      'Can I paste a screenshot? Yes, if the screenshot tool places image data on the clipboard. Copy the screenshot, return to this page, and use Ctrl+V or Command+V. If it does not appear, save the screenshot as an image file and select it instead.',
      'Is the tool free? The tool is designed as a free browser-based utility and does not require an account. Normal internet access and a supported browser are needed to open the page, while image conversion itself is performed in the browser.',
      'Are my images uploaded? The conversion workflow is designed to process the image locally in your browser. The image is not intentionally uploaded to a conversion server by the tool. Your device, browser extensions, and network environment remain separate considerations.',
      'Which format should I choose? Use PNG for screenshots and graphics where sharp edges or transparency matter, JPG for photos when smaller file sizes are useful, and WebP for efficient modern web use when supported by the destination.',
      'Why is my image too large? Files over 25 MB are rejected. Reduce the source file size or use a smaller copy, but keep the original if quality matters. Very large pixel dimensions can also require substantial browser memory.',
      'Does conversion improve quality? No. Conversion changes encoding, not the information present in the source. Saving a compressed image as PNG will not restore details lost in an earlier JPEG export.',
      'Can I convert a transparent image to JPG? Yes, but JPEG does not support transparency. Transparent areas are filled with white during this tool’s JPEG conversion. Use PNG or WebP if transparency must remain.',
      'Why did my file extension change? The output extension reflects the selected format. JPEG downloads use the .jpg extension; PNG and WebP use .png and .webp. The extension alone does not convert a file, so use the format selector to encode the output.',
      'Can I use it on mobile? You can try it in a current mobile browser, but clipboard paste support differs. Saving the image and selecting it from the device’s file picker is a practical fallback.',
      'Can it process animated images? This canvas-based workflow is intended for ordinary still-image conversion and may not preserve animation. Use a dedicated tool when retaining animated frames is important.'
    ]
  }
];

export default function ImageGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="paste-guide" aria-labelledby="paste-guide-title">
      <div className="paste-guide-teaser">
        <div className="paste-guide-icon"><BookOpen size={20} /></div>
        <div>
          <p className="paste-guide-kicker">THE COMPLETE GUIDE</p>
          <h2 id="paste-guide-title">Everything to know about pasting and downloading images</h2>
          <p>Format comparisons, clipboard help, privacy notes, quality tips and practical troubleshooting.</p>
        </div>
        <button
          className="paste-guide-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="paste-guide-panel"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Close guide' : 'Read guide'}
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {isOpen && (
        <div className="paste-guide-panel" id="paste-guide-panel">
          <p className="paste-guide-lead">Use this practical reference to choose a format, solve common paste problems, and understand what happens to your image during conversion. The instructions below focus on common still-image workflows; exact behavior can vary by browser and device.</p>
          <nav className="paste-guide-toc" aria-label="Guide contents">
            <strong>In this guide</strong>
            <div>{chapters.map((chapter, index) => <a key={chapter.title} href={`#paste-guide-chapter-${index + 1}`}>{chapter.title.replace(/^\d+\. /, '')}</a>)}</div>
          </nav>
          {chapters.map((chapter, index) => (
            <article className="paste-guide-chapter" id={`paste-guide-chapter-${index + 1}`} key={chapter.title}>
              <h3>{chapter.title}</h3>
              {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </article>
          ))}
          <p className="paste-guide-disclaimer">This guide is general educational information. Browser features, operating-system behavior, and supported image formats may change over time. For important work, verify the downloaded file in the application where you plan to use it.</p>
        </div>
      )}
    </section>
  );
}
