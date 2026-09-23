'use client';

import React, { useMemo, useState } from 'react';
import { CalendarDays, Download, Printer, RefreshCw, Sparkles, Heart, Quote } from 'lucide-react';
import type { LocaleCode } from '@/data/internationalSeo';
import { getLocalizedToolName } from '@/data/internationalLocalization';
import type { ToolMeta } from '@/data/toolsRegistry';

const card='relative w-full max-w-6xl mx-auto overflow-hidden rounded-[28px] border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/90 p-5 sm:p-7 lg:p-8 space-y-6 shadow-sm';
const input='w-full rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-950/80 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10';
const button='inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-violet-500 disabled:opacity-50';
const secondary='inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-3 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all hover:border-violet-400/50';

type TTText={title:string;generate:string;reset:string;download:string;print:string;days:string;periods:string;start:string;duration:string;breakAfter:string;subjects:string;subjectsHint:string;ready:string;custom:string;empty:string;generated:string;weekday:string;period:string;break:string;tip:string;smart:string;notes:string};
const TT_UI:Record<LocaleCode,TTText>={
 en:{title:'Timetable Maker',generate:'Generate Timetable',reset:'Reset',download:'Download CSV',print:'Print Timetable',days:'School / work days',periods:'Periods per day',start:'Start time',duration:'Period minutes',breakAfter:'Break after period',subjects:'Subjects / activities',subjectsHint:'Separate subjects with commas. You can edit every cell after generating.',ready:'Ready-made formats',custom:'Custom generator',empty:'Add subjects and generate your timetable.',generated:'Generated timetable',weekday:'Day',period:'Period',break:'Break',tip:'Tip: use ready-made formats for a quick start, then edit cells for your exact schedule.',smart:'Smart generator',notes:'Browser-based generator. No external AI service is required.'},
 pt:{title:'Criador de horários',generate:'Gerar horário',reset:'Redefinir',download:'Baixar CSV',print:'Imprimir horário',days:'Dias',periods:'Períodos por dia',start:'Hora de início',duration:'Minutos por período',breakAfter:'Intervalo após o período',subjects:'Disciplinas / atividades',subjectsHint:'Separe as disciplinas por vírgulas. Você pode editar cada célula.',ready:'Modelos prontos',custom:'Gerador personalizado',empty:'Adicione disciplinas e gere seu horário.',generated:'Horário gerado',weekday:'Dia',period:'Período',break:'Intervalo',tip:'Use um modelo pronto e depois edite as células.',smart:'Gerador inteligente',notes:'Gerador no navegador. Nenhum serviço de IA externo é necessário.'},
 es:{title:'Creador de horarios',generate:'Generar horario',reset:'Restablecer',download:'Descargar CSV',print:'Imprimir horario',days:'Días',periods:'Periodos por día',start:'Hora de inicio',duration:'Minutos por periodo',breakAfter:'Descanso después del periodo',subjects:'Asignaturas / actividades',subjectsHint:'Separa las asignaturas con comas. Puedes editar cada celda.',ready:'Formatos listos',custom:'Generador personalizado',empty:'Añade asignaturas y genera tu horario.',generated:'Horario generado',weekday:'Día',period:'Periodo',break:'Descanso',tip:'Usa un formato listo y después edita las celdas.',smart:'Generador inteligente',notes:'Generador en el navegador. No requiere un servicio de IA externo.'},
 de:{title:'Stundenplan-Ersteller',generate:'Stundenplan erstellen',reset:'Zurücksetzen',download:'CSV herunterladen',print:'Stundenplan drucken',days:'Tage',periods:'Stunden pro Tag',start:'Startzeit',duration:'Minuten pro Stunde',breakAfter:'Pause nach Stunde',subjects:'Fächer / Aktivitäten',subjectsHint:'Fächer durch Kommas trennen. Jede Zelle kann danach bearbeitet werden.',ready:'Fertige Vorlagen',custom:'Eigener Generator',empty:'Fächer hinzufügen und Stundenplan erstellen.',generated:'Erstellter Stundenplan',weekday:'Tag',period:'Stunde',break:'Pause',tip:'Mit einer Vorlage starten und danach die Zellen anpassen.',smart:'Intelligenter Generator',notes:'Browserbasierter Generator. Kein externer KI-Dienst erforderlich.'},
 fr:{title:'Créateur d’emploi du temps',generate:'Générer l’emploi du temps',reset:'Réinitialiser',download:'Télécharger CSV',print:'Imprimer',days:'Jours',periods:'Périodes par jour',start:'Heure de début',duration:'Minutes par période',breakAfter:'Pause après la période',subjects:'Matières / activités',subjectsHint:'Séparez les matières par des virgules. Chaque cellule peut ensuite être modifiée.',ready:'Formats prêts',custom:'Générateur personnalisé',empty:'Ajoutez des matières puis générez votre emploi du temps.',generated:'Emploi du temps généré',weekday:'Jour',period:'Période',break:'Pause',tip:'Commencez avec un modèle puis personnalisez les cellules.',smart:'Générateur intelligent',notes:'Générateur dans le navigateur. Aucun service IA externe n’est requis.'},
 it:{title:'Creatore di orari',generate:'Genera orario',reset:'Reimposta',download:'Scarica CSV',print:'Stampa orario',days:'Giorni',periods:'Periodi al giorno',start:'Ora di inizio',duration:'Minuti per periodo',breakAfter:'Pausa dopo il periodo',subjects:'Materie / attività',subjectsHint:'Separa le materie con virgole. Puoi modificare ogni cella.',ready:'Modelli pronti',custom:'Generatore personalizzato',empty:'Aggiungi materie e genera il tuo orario.',generated:'Orario generato',weekday:'Giorno',period:'Periodo',break:'Pausa',tip:'Usa un modello pronto e poi personalizza le celle.',smart:'Generatore intelligente',notes:'Generatore nel browser. Non è richiesto alcun servizio AI esterno.'},
 ja:{title:'時間割メーカー',generate:'時間割を作成',reset:'リセット',download:'CSVをダウンロード',print:'時間割を印刷',days:'曜日数',periods:'1日のコマ数',start:'開始時刻',duration:'1コマの分数',breakAfter:'休憩の位置',subjects:'科目 / アクティビティ',subjectsHint:'科目をカンマで区切ります。生成後に各セルを編集できます。',ready:'すぐ使える形式',custom:'カスタム作成',empty:'科目を追加して時間割を作成してください。',generated:'作成した時間割',weekday:'曜日',period:'コマ',break:'休憩',tip:'テンプレートから始めてセルを自由に編集できます。',smart:'スマート生成',notes:'ブラウザで動作します。外部AIサービスは不要です。'},
 ko:{title:'시간표 만들기',generate:'시간표 생성',reset:'초기화',download:'CSV 다운로드',print:'시간표 인쇄',days:'요일 수',periods:'하루 교시 수',start:'시작 시간',duration:'교시 시간(분)',breakAfter:'쉬는 시간 위치',subjects:'과목 / 활동',subjectsHint:'과목을 쉼표로 구분하세요. 생성 후 모든 셀을 수정할 수 있습니다.',ready:'완성 템플릿',custom:'맞춤 생성기',empty:'과목을 입력하고 시간표를 생성하세요.',generated:'생성된 시간표',weekday:'요일',period:'교시',break:'쉬는 시간',tip:'템플릿으로 시작한 뒤 셀을 자유롭게 수정하세요.',smart:'스마트 생성기',notes:'브라우저에서 실행됩니다. 외부 AI 서비스가 필요하지 않습니다.'},
 zh:{title:'课程表制作器',generate:'生成课程表',reset:'重置',download:'下载 CSV',print:'打印课程表',days:'天数',periods:'每天课时',start:'开始时间',duration:'每节分钟数',breakAfter:'第几节后休息',subjects:'科目 / 活动',subjectsHint:'用逗号分隔科目。生成后可以编辑每个单元格。',ready:'现成模板',custom:'自定义生成器',empty:'添加科目并生成课程表。',generated:'生成的课程表',weekday:'星期',period:'课时',break:'休息',tip:'先使用模板，再按自己的安排编辑单元格。',smart:'智能生成器',notes:'浏览器内生成，无需外部 AI 服务。'},
 ru:{title:'Создатель расписания',generate:'Создать расписание',reset:'Сбросить',download:'Скачать CSV',print:'Печать расписания',days:'Дни',periods:'Занятий в день',start:'Время начала',duration:'Минут на занятие',breakAfter:'Перерыв после занятия',subjects:'Предметы / активности',subjectsHint:'Разделяйте предметы запятыми. После создания можно редактировать каждую ячейку.',ready:'Готовые форматы',custom:'Персональный генератор',empty:'Добавьте предметы и создайте расписание.',generated:'Созданное расписание',weekday:'День',period:'Занятие',break:'Перерыв',tip:'Начните с шаблона и настройте ячейки под себя.',smart:'Умный генератор',notes:'Генератор работает в браузере. Внешний ИИ-сервис не требуется.'},
 ar:{title:'منشئ الجدول الزمني',generate:'إنشاء الجدول',reset:'إعادة تعيين',download:'تنزيل CSV',print:'طباعة الجدول',days:'الأيام',periods:'الحصص يومياً',start:'وقت البدء',duration:'دقائق الحصة',breakAfter:'الاستراحة بعد الحصة',subjects:'المواد / الأنشطة',subjectsHint:'افصل المواد بفواصل. يمكنك تعديل كل خلية بعد الإنشاء.',ready:'قوالب جاهزة',custom:'منشئ مخصص',empty:'أضف المواد وأنشئ جدولك.',generated:'الجدول المنشأ',weekday:'اليوم',period:'الحصة',break:'استراحة',tip:'ابدأ بقالب جاهز ثم عدّل الخلايا حسب احتياجك.',smart:'منشئ ذكي',notes:'يعمل المنشئ داخل المتصفح ولا يحتاج إلى خدمة ذكاء اصطناعي خارجية.'},
 hi:{title:'टाइम टेबल मेकर',generate:'टाइम टेबल बनाएं',reset:'रीसेट',download:'CSV डाउनलोड करें',print:'टाइम टेबल प्रिंट करें',days:'दिन',periods:'प्रतिदिन पीरियड',start:'शुरू होने का समय',duration:'पीरियड मिनट',breakAfter:'किस पीरियड के बाद ब्रेक',subjects:'विषय / गतिविधियाँ',subjectsHint:'विषयों को कॉमा से अलग करें। बनाने के बाद हर सेल एडिट कर सकते हैं।',ready:'रेडी-मेड फॉर्मेट',custom:'कस्टम जनरेटर',empty:'विषय जोड़ें और टाइम टेबल बनाएं।',generated:'बना हुआ टाइम टेबल',weekday:'दिन',period:'पीरियड',break:'ब्रेक',tip:'रेडी-मेड फॉर्मेट से शुरू करें और फिर सेल अपनी जरूरत के अनुसार बदलें।',smart:'स्मार्ट जनरेटर',notes:'ब्राउज़र में चलता है। किसी बाहरी AI सेवा की जरूरत नहीं है।'},
};


const EXTRA:Record<LocaleCode,{time:string;activity:string;session:string;shift:string;meal:string;dayToday:string;title:string;note:string;notePlaceholder:string;quote:string;quotePlaceholder:string;personalize:string;weekdays:string;schoolDays:string}> = {
 en:{time:'Time',activity:'Activity',session:'Session',shift:'Shift',meal:'Meal',dayToday:'Today',title:'Schedule title',note:'Personal note',notePlaceholder:'Add a note for yourself...',quote:'Personal quote or reminder',quotePlaceholder:'Add a quote, goal, or reminder that makes this schedule yours...',personalize:'Make it personal',weekdays:'Weekdays',schoolDays:'School days'},
 pt:{time:'Hora',activity:'Atividade',session:'Sessão',shift:'Turno',meal:'Refeição',dayToday:'Hoje',title:'Título do horário',note:'Nota pessoal',notePlaceholder:'Adicione uma nota para você...',quote:'Frase ou lembrete pessoal',quotePlaceholder:'Adicione uma frase, objetivo ou lembrete...',personalize:'Personalize',weekdays:'Dias úteis',schoolDays:'Dias de escola'},
 es:{time:'Hora',activity:'Actividad',session:'Sesión',shift:'Turno',meal:'Comida',dayToday:'Hoy',title:'Título del horario',note:'Nota personal',notePlaceholder:'Añade una nota para ti...',quote:'Frase o recordatorio personal',quotePlaceholder:'Añade una frase, objetivo o recordatorio...',personalize:'Hazlo personal',weekdays:'Días laborables',schoolDays:'Días de escuela'},
 de:{time:'Uhrzeit',activity:'Aktivität',session:'Einheit',shift:'Schicht',meal:'Mahlzeit',dayToday:'Heute',title:'Titel des Plans',note:'Persönliche Notiz',notePlaceholder:'Notiz für dich hinzufügen...',quote:'Persönliches Zitat oder Erinnerung',quotePlaceholder:'Zitat, Ziel oder Erinnerung hinzufügen...',personalize:'Persönlich gestalten',weekdays:'Wochentage',schoolDays:'Schultage'},
 fr:{time:'Heure',activity:'Activité',session:'Séance',shift:'Équipe',meal:'Repas',dayToday:"Aujourd’hui",title:'Titre du planning',note:'Note personnelle',notePlaceholder:'Ajoutez une note pour vous...',quote:'Citation ou rappel personnel',quotePlaceholder:'Ajoutez une citation, un objectif ou un rappel...',personalize:'Personnaliser',weekdays:'Jours ouvrés',schoolDays:'Jours d’école'},
 it:{time:'Ora',activity:'Attività',session:'Sessione',shift:'Turno',meal:'Pasto',dayToday:'Oggi',title:'Titolo del programma',note:'Nota personale',notePlaceholder:'Aggiungi una nota per te...',quote:'Frase o promemoria personale',quotePlaceholder:'Aggiungi una frase, un obiettivo o un promemoria...',personalize:'Personalizza',weekdays:'Giorni feriali',schoolDays:'Giorni di scuola'},
 ja:{time:'時間',activity:'予定',session:'セッション',shift:'シフト',meal:'食事',dayToday:'今日',title:'スケジュールのタイトル',note:'個人メモ',notePlaceholder:'自分へのメモを追加…',quote:'好きな言葉・目標・リマインダー',quotePlaceholder:'言葉、目標、リマインダーを追加…',personalize:'自分らしく',weekdays:'平日',schoolDays:'学校の日'},
 ko:{time:'시간',activity:'활동',session:'세션',shift:'근무',meal:'식사',dayToday:'오늘',title:'일정 제목',note:'개인 메모',notePlaceholder:'나를 위한 메모를 추가하세요...',quote:'나만의 문구 또는 알림',quotePlaceholder:'문구, 목표 또는 알림을 추가하세요...',personalize:'나만의 일정 만들기',weekdays:'평일',schoolDays:'학교 수업일'},
 zh:{time:'时间',activity:'活动',session:'时段',shift:'班次',meal:'餐次',dayToday:'今天',title:'日程标题',note:'个人备注',notePlaceholder:'写下给自己的备注…',quote:'个人格言或提醒',quotePlaceholder:'添加一句话、目标或提醒，让计划更有专属感…',personalize:'个性化',weekdays:'工作日',schoolDays:'上学日'},
 ru:{time:'Время',activity:'Активность',session:'Сессия',shift:'Смена',meal:'Приём пищи',dayToday:'Сегодня',title:'Название расписания',note:'Личная заметка',notePlaceholder:'Добавьте заметку для себя...',quote:'Личная цитата или напоминание',quotePlaceholder:'Добавьте цитату, цель или напоминание...',personalize:'Сделать личным',weekdays:'Будни',schoolDays:'Учебные дни'},
 ar:{time:'الوقت',activity:'النشاط',session:'الجلسة',shift:'الوردية',meal:'الوجبة',dayToday:'اليوم',title:'عنوان الجدول',note:'ملاحظة شخصية',notePlaceholder:'أضف ملاحظة لنفسك...',quote:'اقتباس أو تذكير شخصي',quotePlaceholder:'أضف اقتباساً أو هدفاً أو تذكيراً يجعل جدولك مميزاً...',personalize:'اجعله شخصياً',weekdays:'أيام العمل',schoolDays:'أيام الدراسة'},
 hi:{time:'समय',activity:'गतिविधि',session:'सेशन',shift:'शिफ्ट',meal:'भोजन',dayToday:'आज',title:'टाइम टेबल का शीर्षक',note:'पर्सनल नोट',notePlaceholder:'अपने लिए कोई नोट लिखें...',quote:'पर्सनल कोट या रिमाइंडर',quotePlaceholder:'कोई quote, goal या reminder लिखें ताकि यह timetable आपका लगे...',personalize:'अपना बनाएं',weekdays:'वर्किंग डे',schoolDays:'स्कूल के दिन'}
};

const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_LABELS:Record<LocaleCode,string[]>={
 en:DAYS,pt:['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],es:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],de:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],fr:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],it:['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'],ja:['月','火','水','木','金','土','日'],ko:['월','화','수','목','금','토','일'],zh:['周一','周二','周三','周四','周五','周六','周日'],ru:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],ar:['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'],hi:['सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार','रविवार']
};

const PRESETS:Record<string,{days:number;periods:number;subjects:string[]}> = {
 'timetable-maker':{days:6,periods:7,subjects:['Mathematics','English','Science','Social Studies','Computer','Language','Library']},
 'cute-timetable-maker':{days:6,periods:7,subjects:['Math ✦','English ♡','Science ✿','Art ✧','Music ♪','Reading ♥','Break ☀']},
 'student-timetable-maker':{days:6,periods:7,subjects:['Mathematics','Science','English','Computer Science','Language','Social Studies','PE']},
 'school-timetable-maker':{days:6,periods:8,subjects:['Mathematics','English','Science','Social Studies','Computer','Language','PE','Art']},
 'college-timetable-maker':{days:5,periods:6,subjects:['Lecture','Lab','Tutorial','Seminar','Project','Study']},
 'university-timetable-maker':{days:5,periods:6,subjects:['Lecture','Lab','Tutorial','Seminar','Research','Study']},
 'class-timetable-generator':{days:6,periods:8,subjects:['Mathematics','English','Science','History','Geography','Computer','PE','Art']},
 'study-timetable-maker':{days:7,periods:6,subjects:['Study','Revision','Practice','Reading','Break','Mock Test']},
 'exam-timetable-maker':{days:6,periods:3,subjects:['Mathematics Exam','Science Exam','English Exam','Social Studies Exam','Computer Exam','Revision']},
 'weekly-timetable-maker':{days:7,periods:6,subjects:['Work','Study','Exercise','Family','Personal','Free Time']},
 'daily-timetable-maker':{days:1,periods:8,subjects:['Morning Routine','Study','Work','Lunch','Focus Time','Exercise','Family','Sleep']},
 'kids-timetable-maker':{days:7,periods:6,subjects:['School','Homework','Play','Reading','Art','Family']},
 'kids-daily-routine-planner':{days:1,periods:8,subjects:['Wake Up','Breakfast','School','Homework','Play Time','Reading','Dinner','Bedtime']},
 'girls-daily-routine-planner':{days:7,periods:6,subjects:['School / Work','Study','Exercise','Self Care','Family','Free Time']},
 'boys-daily-routine-planner':{days:7,periods:6,subjects:['School / Work','Study','Exercise','Hobby','Family','Free Time']},
 'employee-work-timetable':{days:5,periods:8,subjects:['Focus Work','Meetings','Email','Project Work','Lunch','Planning','Team Work','Review']},
 'work-shift-schedule-maker':{days:7,periods:3,subjects:['Morning Shift','Evening Shift','Night Shift']},
 'teacher-timetable-maker':{days:6,periods:7,subjects:['Class','Planning','Staff Meeting','Preparation','Lab','Assessment','Free Period']},
 'class-schedule-maker':{days:6,periods:7,subjects:['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7']},
 'personal-timetable-maker':{days:7,periods:6,subjects:['Work','Study','Exercise','Errands','Family','Personal']},
 'home-routine-planner':{days:7,periods:5,subjects:['Morning','Cleaning','Meals','Family','Rest']},
 'workout-timetable-maker':{days:7,periods:2,subjects:['Strength','Cardio','Mobility','Rest']},
 'meal-timetable-planner':{days:7,periods:5,subjects:['Breakfast','Snack','Lunch','Snack','Dinner']},
 'printable-timetable-maker':{days:6,periods:7,subjects:['Mathematics','English','Science','Computer','Language','Activity','Study']},
 'smart-timetable-generator':{days:6,periods:7,subjects:['Priority 1','Priority 2','Priority 3','Priority 4','Practice','Review','Break']},
};


function slugPreset(slug:string){ return PRESETS[slug] || PRESETS['timetable-maker']; }

function getMode(slug:string){
  if(['timetable-maker','student-timetable-maker','school-timetable-maker','college-timetable-maker','university-timetable-maker','class-timetable-generator','teacher-timetable-maker','printable-timetable-maker'].includes(slug)) return 'academic';
  if(['study-timetable-maker'].includes(slug)) return 'study';
  if(['exam-timetable-maker'].includes(slug)) return 'exam';
  if(['employee-work-timetable','work-shift-schedule-maker'].includes(slug)) return 'work';
  if(['kids-timetable-maker','kids-daily-routine-planner','girls-daily-routine-planner','boys-daily-routine-planner','personal-timetable-maker','home-routine-planner','weekly-timetable-maker','daily-timetable-maker'].includes(slug)) return 'routine';
  if(slug==='workout-timetable-maker') return 'workout';
  if(slug==='meal-timetable-planner') return 'meal';
  if(slug==='smart-timetable-generator') return 'smart';
  return 'general';
}

function addMinutes(time:string, minutes:number){
  const [h,m]=time.split(':').map(Number);
  const total=Math.max(0,h*60+m+minutes);
  return `${String(Math.floor(total/60)%24).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
}
function formatTime(time:string){
  const [h,m]=time.split(':').map(Number); const suffix=h>=12?'PM':'AM'; const hour=h%12||12;
  return `${hour}:${String(m).padStart(2,'0')} ${suffix}`;
}
function csvEscape(value:string){ return `"${value.replaceAll('"','""')}"`; }

type TTTheme={card:string;accent:string;badge:string;panel:string;header:string;day:string;cell:string;button:string;empty:string;icon:string};
function getTheme(slug:string):TTTheme{
  if(slug==='cute-timetable-maker') return {card:'border-rose-200/80 dark:border-rose-900/50 bg-gradient-to-br from-white via-rose-50/60 to-violet-50/60 dark:from-zinc-900 dark:via-rose-950/20 dark:to-violet-950/20 shadow-[0_20px_60px_-25px_rgba(244,63,94,.35)]',accent:'text-rose-600 dark:text-rose-300',badge:'bg-gradient-to-r from-rose-100 to-violet-100 text-rose-700 dark:from-rose-950/60 dark:to-violet-950/60 dark:text-rose-200',panel:'border-rose-200/70 bg-white/80 dark:border-rose-900/40 dark:bg-zinc-950/50',header:'bg-gradient-to-r from-rose-100/80 via-fuchsia-50/80 to-violet-100/80 dark:from-rose-950/40 dark:via-fuchsia-950/30 dark:to-violet-950/40',day:'bg-rose-50/80 dark:bg-rose-950/25',cell:'focus:bg-rose-50 dark:focus:bg-rose-950/30',button:'bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600',empty:'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10',icon:'text-rose-500'};
  if(slug==='kids-timetable-maker'||slug==='kids-daily-routine-planner') return {card:'border-sky-200/80 dark:border-sky-900/50 bg-gradient-to-br from-white via-sky-50/60 to-amber-50/60 dark:from-zinc-900 dark:via-sky-950/20 dark:to-amber-950/20 shadow-[0_20px_60px_-25px_rgba(14,165,233,.35)]',accent:'text-sky-600 dark:text-sky-300',badge:'bg-gradient-to-r from-sky-100 to-amber-100 text-sky-700 dark:from-sky-950/60 dark:to-amber-950/50 dark:text-sky-200',panel:'border-sky-200/70 bg-white/80 dark:border-sky-900/40 dark:bg-zinc-950/50',header:'bg-gradient-to-r from-sky-100/80 via-emerald-50/70 to-amber-100/80 dark:from-sky-950/40 dark:via-emerald-950/30 dark:to-amber-950/40',day:'bg-sky-50/80 dark:bg-sky-950/25',cell:'focus:bg-sky-50 dark:focus:bg-sky-950/30',button:'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600',empty:'border-sky-200 dark:border-sky-900/50 bg-sky-50/30 dark:bg-sky-950/10',icon:'text-sky-500'};
  if(slug==='girls-daily-routine-planner') return {card:'border-violet-200/80 dark:border-violet-900/50 bg-gradient-to-br from-white via-violet-50/60 to-pink-50/60 dark:from-zinc-900 dark:via-violet-950/20 dark:to-pink-950/20 shadow-[0_20px_60px_-25px_rgba(139,92,246,.35)]',accent:'text-violet-600 dark:text-violet-300',badge:'bg-gradient-to-r from-violet-100 to-pink-100 text-violet-700 dark:from-violet-950/60 dark:to-pink-950/50 dark:text-violet-200',panel:'border-violet-200/70 bg-white/80 dark:border-violet-900/40 dark:bg-zinc-950/50',header:'bg-gradient-to-r from-violet-100/80 via-fuchsia-50/70 to-pink-100/80 dark:from-violet-950/40 dark:via-fuchsia-950/30 dark:to-pink-950/40',day:'bg-violet-50/80 dark:bg-violet-950/25',cell:'focus:bg-violet-50 dark:focus:bg-violet-950/30',button:'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600',empty:'border-violet-200 dark:border-violet-900/50 bg-violet-50/30 dark:bg-violet-950/10',icon:'text-violet-500'};
  if(slug==='exam-timetable-maker') return {card:'border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/50 dark:from-zinc-900 dark:via-amber-950/15 dark:to-orange-950/15',accent:'text-amber-700 dark:text-amber-300',badge:'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',panel:'border-amber-200/70 bg-white/80 dark:border-amber-900/40 dark:bg-zinc-950/50',header:'bg-amber-100/70 dark:bg-amber-950/30',day:'bg-amber-50/80 dark:bg-amber-950/25',cell:'focus:bg-amber-50 dark:focus:bg-amber-950/30',button:'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',empty:'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/10',icon:'text-amber-500'};
  if(slug==='smart-timetable-generator') return {card:'border-cyan-200/80 dark:border-cyan-900/50 bg-gradient-to-br from-white via-cyan-50/50 to-violet-50/50 dark:from-zinc-900 dark:via-cyan-950/15 dark:to-violet-950/15',accent:'text-cyan-600 dark:text-cyan-300',badge:'bg-gradient-to-r from-cyan-100 to-violet-100 text-cyan-700 dark:from-cyan-950/60 dark:to-violet-950/50 dark:text-cyan-200',panel:'border-cyan-200/70 bg-white/80 dark:border-cyan-900/40 dark:bg-zinc-950/50',header:'bg-gradient-to-r from-cyan-100/80 to-violet-100/80 dark:from-cyan-950/40 dark:to-violet-950/40',day:'bg-cyan-50/80 dark:bg-cyan-950/25',cell:'focus:bg-cyan-50 dark:focus:bg-cyan-950/30',button:'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600',empty:'border-cyan-200 dark:border-cyan-900/50 bg-cyan-50/30 dark:bg-cyan-950/10',icon:'text-cyan-500'};
  if(slug==='employee-work-timetable'||slug==='work-shift-schedule-maker'||slug==='teacher-timetable-maker') return {card:'border-emerald-200/70 dark:border-emerald-900/50 bg-gradient-to-br from-white via-emerald-50/40 to-slate-50 dark:from-zinc-900 dark:via-emerald-950/15 dark:to-slate-950',accent:'text-emerald-600 dark:text-emerald-300',badge:'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',panel:'border-emerald-200/70 bg-white/80 dark:border-emerald-900/40 dark:bg-zinc-950/50',header:'bg-emerald-100/70 dark:bg-emerald-950/30',day:'bg-emerald-50/80 dark:bg-emerald-950/25',cell:'focus:bg-emerald-50 dark:focus:bg-emerald-950/30',button:'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',empty:'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10',icon:'text-emerald-500'};
  if(slug==='printable-timetable-maker') return {card:'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md',accent:'text-zinc-700 dark:text-zinc-200',badge:'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',panel:'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950',header:'bg-zinc-100 dark:bg-zinc-800',day:'bg-zinc-50 dark:bg-zinc-900',cell:'focus:bg-zinc-100 dark:focus:bg-zinc-800',button:'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900',empty:'border-zinc-300 dark:border-zinc-700',icon:'text-zinc-600'};
  return {card:'border-violet-200/70 dark:border-white/10 bg-white/95 dark:bg-zinc-900/90 shadow-[0_20px_60px_-35px_rgba(124,58,237,.35)]',accent:'text-violet-600 dark:text-violet-300',badge:'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300',panel:'border-violet-100/80 bg-white/80 dark:border-white/10 dark:bg-zinc-950/50',header:'bg-violet-50/80 dark:bg-violet-950/25',day:'bg-violet-50/60 dark:bg-violet-950/20',cell:'focus:bg-violet-50 dark:focus:bg-violet-950/30',button:'bg-violet-600 hover:bg-violet-500',empty:'border-violet-200 dark:border-violet-900/50',icon:'text-violet-500'};
}

export default function TimeTableEngine({tool,locale='en'}:{tool:ToolMeta;locale?:LocaleCode}){
  const ui=TT_UI[locale]||TT_UI.en; const extra=EXTRA[locale]||EXTRA.en; const preset=slugPreset(tool.slug); const theme=getTheme(tool.slug); const mode=getMode(tool.slug);
  const [dayCount,setDayCount]=useState(preset.days); const [periodCount,setPeriodCount]=useState(preset.periods); const [start,setStart]=useState('08:00'); const [duration,setDuration]=useState(50); const [breakAfter,setBreakAfter]=useState(mode==='meal'?0:4);
  const [subjects,setSubjects]=useState(preset.subjects.join(', ')); const [grid,setGrid]=useState<string[][]>([]); const [generated,setGenerated]=useState(false);
  const [scheduleTitle,setScheduleTitle]=useState(''); const [personalNote,setPersonalNote]=useState(''); const [quote,setQuote]=useState('');

  const subjectList=useMemo(()=>subjects.split(',').map(x=>x.trim()).filter(Boolean),[subjects]);
  const isOneDay=dayCount===1; const isMeal=mode==='meal'; const isWorkout=mode==='workout'; const isRoutine=['routine','work','study'].includes(mode); const isAcademic=['academic','exam'].includes(mode);
  const columnLabel=isAcademic?ui.period:isMeal?extra.meal:isWorkout?extra.session:mode==='work'?extra.shift:mode==='study'?extra.session:extra.activity;
  const timeLabels=Array.from({length:periodCount},(_,p)=>{const startTime=addMinutes(start,p*duration+(p>=breakAfter&&breakAfter>0?20:0)); const endTime=addMinutes(startTime,duration); return `${formatTime(startTime)} – ${formatTime(endTime)}`;});
  const dayLabel=(d:number)=>isOneDay?extra.dayToday:(dayCount===5?DAY_LABELS[locale][d]:DAY_LABELS[locale][d]);

  const generate=()=>{const safe=subjectList.length?subjectList:['Activity']; setGrid(Array.from({length:dayCount},(_,d)=>Array.from({length:periodCount},(_,p)=>safe[(d*periodCount+p)%safe.length]||''))); setGenerated(true);};
  const reset=()=>{setDayCount(preset.days);setPeriodCount(preset.periods);setStart('08:00');setDuration(50);setBreakAfter(mode==='meal'?0:4);setSubjects(preset.subjects.join(', '));setGrid([]);setGenerated(false);setScheduleTitle('');setPersonalNote('');setQuote('');};
  const updateCell=(d:number,p:number,value:string)=>setGrid(prev=>prev.map((row,ri)=>ri===d?row.map((cell,ci)=>ci===p?value:cell):row));
  const download=()=>{if(!grid.length)return;const headers=[...(isOneDay?[]:[ui.weekday]),...timeLabels.map((t,i)=>`${columnLabel} ${i+1} | ${t}`)];const rows=grid.map((row,d)=>[...(isOneDay?[]:[dayLabel(d)]),...row]);const csv=[[scheduleTitle||getLocalizedToolName(tool,locale)],headers,...rows,...(personalNote?[['Note',personalNote]]:[]),...(quote?[['Quote',quote]]:[])].map(r=>r.map(csvEscape).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${tool.slug}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);};

  return <div className={`${card} ${theme.card} print:shadow-none print:border-zinc-300`} data-testid="timetable-engine">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${theme.accent}`}><CalendarDays className={`h-4 w-4 ${theme.icon}`}/>{ui.title}</div><h2 className="mt-2 text-xl sm:text-2xl font-black">{getLocalizedToolName(tool,locale)}</h2><p className="mt-1 text-xs text-zinc-500">{ui.notes}</p></div>
      <div className={`rounded-2xl px-3 py-2 text-[11px] font-semibold ${theme.badge}`}><Sparkles className="inline h-3.5 w-3.5 mr-1"/>{tool.slug==='smart-timetable-generator'?ui.smart:ui.ready}</div>
    </div>

    <div className={`rounded-2xl border p-4 space-y-4 backdrop-blur-sm ${theme.panel}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <label className="text-xs font-semibold">{ui.days}<select className={input+' mt-2'} value={dayCount} onChange={e=>setDayCount(Number(e.target.value))}><option value={1}>1</option><option value={5}>5</option><option value={6}>6</option><option value={7}>7</option></select></label>
        <label className="text-xs font-semibold">{isAcademic?ui.periods:extra.activity}<select className={input+' mt-2'} value={periodCount} onChange={e=>setPeriodCount(Number(e.target.value))}>{[2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
        <label className="text-xs font-semibold">{ui.start}<input className={input+' mt-2'} type="time" value={start} onChange={e=>setStart(e.target.value)}/></label>
        <label className="text-xs font-semibold">{ui.duration}<input className={input+' mt-2'} type="number" min={15} max={180} value={duration} onChange={e=>setDuration(Math.min(180,Math.max(15,Number(e.target.value)||50)))}/></label>
        <label className="text-xs font-semibold">{ui.breakAfter}<select className={input+' mt-2'} value={breakAfter} onChange={e=>setBreakAfter(Number(e.target.value))}><option value={0}>—</option>{Array.from({length:Math.max(1,periodCount-1)},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <label className="text-xs font-semibold">{extra.title}<input className={input+' mt-2'} value={scheduleTitle} onChange={e=>setScheduleTitle(e.target.value)} placeholder={getLocalizedToolName(tool,locale)}/></label>
        <label className="text-xs font-semibold lg:col-span-2">{ui.subjects}<textarea className={input+' mt-2 min-h-20'} value={subjects} onChange={e=>setSubjects(e.target.value)} placeholder={ui.subjectsHint}/></label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <label className="text-xs font-semibold"><span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-rose-500"/>{extra.note}</span><textarea className={input+' mt-2 min-h-20'} value={personalNote} onChange={e=>setPersonalNote(e.target.value)} placeholder={extra.notePlaceholder}/></label>
        <label className="text-xs font-semibold"><span className="inline-flex items-center gap-1"><Quote className={`h-3.5 w-3.5 ${theme.icon}`}/>{extra.quote}</span><textarea className={input+' mt-2 min-h-20'} value={quote} onChange={e=>setQuote(e.target.value)} placeholder={extra.quotePlaceholder}/></label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className={`${button} ${theme.button}`} onClick={generate}><CalendarDays className="h-4 w-4"/>{ui.generate}</button>
        <button className={secondary} onClick={reset}><RefreshCw className="h-4 w-4"/>{ui.reset}</button>
        {generated&&<><button className={secondary} onClick={download}><Download className="h-4 w-4"/>{ui.download}</button><button className={secondary} onClick={()=>window.print()}><Printer className="h-4 w-4"/>{ui.print}</button></>}
      </div>
      <p className="text-[11px] text-zinc-400">{ui.tip}</p>
    </div>

    {generated&&grid.length>0 ? <div className={`overflow-x-auto rounded-2xl border ${theme.panel}`}>
      {(scheduleTitle||personalNote||quote)&&<div className="border-b border-zinc-200 dark:border-zinc-800 p-5 space-y-2"><h3 className={`text-lg font-black ${theme.accent}`}>{scheduleTitle||getLocalizedToolName(tool,locale)}</h3>{personalNote&&<p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">♥ {personalNote}</p>}{quote&&<p className="text-sm italic text-zinc-500 dark:text-zinc-400 whitespace-pre-wrap">“{quote}”</p>}</div>}
      <table className="w-full min-w-[760px] border-collapse text-xs"><thead><tr className={theme.header}>{!isOneDay&&<th className="border border-zinc-200 dark:border-zinc-700 p-3 text-left">{ui.weekday}</th>}{timeLabels.map((t,p)=><th key={p} className="border border-zinc-200 dark:border-zinc-700 p-3 text-left">{isAcademic?`${columnLabel} ${p+1}`:columnLabel}<span className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1">{t}</span></th>)}</tr></thead>
      <tbody>{grid.map((row,d)=><tr key={d}>{!isOneDay&&<th className={`border border-zinc-200 dark:border-zinc-700 p-3 text-left font-bold ${theme.day}`}>{dayLabel(d)}</th>}{row.map((cell,p)=><td key={p} className="border border-zinc-200 dark:border-zinc-700 p-1"><input aria-label={`${dayLabel(d)} ${columnLabel} ${p+1}`} className={`w-full rounded-xl bg-transparent px-2 py-3 outline-none ${theme.cell}`} value={cell} onChange={e=>updateCell(d,p,e.target.value)}/></td>)}</tr>)}</tbody></table>
    </div> : <div className={`rounded-2xl border border-dashed p-8 text-center text-sm text-zinc-500 ${theme.empty}`}>{ui.empty}</div>}

    <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 p-4 text-xs text-zinc-500"><strong className="text-zinc-700 dark:text-zinc-300">{extra.personalize}:</strong> {ui.subjectsHint}</div>
  </div>;
}
