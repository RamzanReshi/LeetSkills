import type { Locale } from "./dictionaries";

export type ScenarioContent = {
  title: string;
  path_title: string;
  scenario_type: string;
  estimated_time: string;
  prompt_text: string;
  expected_learner_output: string;
};

export type PathContent = {
  title: string;
  description: string;
};

type PerLocale<T> = Partial<Record<Locale, T>>;

export const PATH_CONTENT: Record<string, PerLocale<PathContent>> = {
  "software-engineering-problem-solving": {
    ar: {
      title: "حل مشكلات هندسة البرمجيات",
      description: "تدرب على التفكير التقني المنظم لمقابلات البرمجة وأعمال الهندسة وتفكير الأنظمة.",
    },
    tr: {
      title: "Yazılım Mühendisliği Problem Çözme",
      description: "Kodlama mülakatları, mühendislik çalışmaları ve sistem düşüncesi için yapılandırılmış teknik akıl yürütme pratiği yapın.",
    },
  },
  "debugging-testing-quality": {
    ar: {
      title: "التصحيح والاختبار والجودة",
      description: "شخّص المشكلات، اختبر الافتراضات، امنع الانحدارات، وأوصل قضايا الجودة بوضوح.",
    },
    tr: {
      title: "Hata Ayıklama, Test ve Kalite",
      description: "Sorunları teşhis edin, varsayımları test edin, regresyonları önleyin ve kalite sorunlarını net iletin.",
    },
  },
  "professional-communication": {
    ar: {
      title: "التواصل المهني",
      description: "تواصل بوضوح واحترام وفعالية في البيئات المهنية الكتابية والشفهية.",
    },
    tr: {
      title: "Profesyonel İletişim",
      description: "Yazılı ve sözlü profesyonel ortamlarda net, saygılı ve etkili iletişim kurun.",
    },
  },
  "teamwork-conflict-resolution": {
    ar: {
      title: "العمل الجماعي وحل النزاعات",
      description: "تعاون بشكل أفضل، تعامل مع التوترات، أصلح سوء الفهم، وحرّك الفرق نحو نتائج مشتركة.",
    },
    tr: {
      title: "Takım Çalışması ve Çatışma Çözümü",
      description: "Daha iyi işbirliği yapın, gerilimi yönetin, yanlış anlamaları onarın ve takımları ortak sonuçlara taşıyın.",
    },
  },
  "product-thinking": {
    ar: {
      title: "التفكير في المنتج",
      description: "افهم احتياجات المستخدم، حدد الميزات القيّمة، رتب الأولويات، واربط القرارات بالنتائج.",
    },
    tr: {
      title: "Ürün Düşüncesi",
      description: "Kullanıcı ihtiyaçlarını anlayın, değerli özellikler tanımlayın, işi önceliklendirin ve kararları sonuçlara bağlayın.",
    },
  },
  "ai-literacy-responsible-use": {
    ar: {
      title: "محو الأمية بالذكاء الاصطناعي والاستخدام المسؤول",
      description: "استخدم أدوات الذكاء الاصطناعي بفعالية وأمان وأمانة ونقد عبر الدراسة والعمل.",
    },
    tr: {
      title: "Yapay Zeka Okuryazarlığı ve Sorumlu Kullanım",
      description: "Okul ve işte AI araçlarını etkili, güvenli, dürüst ve eleştirel şekilde kullanın.",
    },
  },
};

const ar = {
  "SE-01": {
    title: "أعد صياغة وحلل مشكلة برمجية",
    path_title: "حل مشكلات هندسة البرمجيات",
    scenario_type: "تفكير مكتوب",
    estimated_time: "6-8 دقائق",
    prompt_text: "لديك مشكلة برمجية: \"بمعطى قائمة أرقام، أعد الرقمين اللذين مجموعهما يساوي قيمة هدف.\" قبل كتابة الكود، اشرح كيف ستفهم المشكلة وتقسمها.",
    expected_learner_output: "شرح منظم للمدخلات والمخرجات والقيود والنهج المحتمل وحالات الحافة الأساسية.",
  },
  "SE-02": {
    title: "اختر بين القوة الغاشمة وخريطة الهاش",
    path_title: "حل مشكلات هندسة البرمجيات",
    scenario_type: "موازنة تقنية",
    estimated_time: "8-10 دقائق",
    prompt_text: "زميل يقترح حل الحلقات المتداخلة لمشكلة مجموع رقمين. زميل آخر يقترح حل خريطة الهاش. قارن النهجين وأوصِ بأحدهما.",
    expected_learner_output: "مقارنة للصحة، التعقيد الزمني، التعقيد المكاني، القراءة، ومتى يكون كل نهج مقبولاً.",
  },
  "SE-03": {
    title: "صحّح خطة حل معيبة",
    path_title: "حل مشكلات هندسة البرمجيات",
    scenario_type: "تفكير برمجي بدون تنفيذ كامل",
    estimated_time: "10-12 دقيقة",
    prompt_text: "كتب متعلم هذه الخطة لإيجاد القيم المكررة في مصفوفة: \"رتّب المصفوفة، ثم قارن كل عنصر بالعنصر الذي يبعد موقعين أمامه.\" اشرح ما إذا كان هذا يعمل، وما هو الخلل، وكيف ستصلحه.",
    expected_learner_output: "نقد مدروس يحدد مشكلة المقارنة المنطقية ويقترح مقارنة القيم المتجاورة بعد الترتيب أو استخدام مجموعة.",
  },
  "SE-04": {
    title: "اختر هيكل بيانات لأحداث حديثة",
    path_title: "حل مشكلات هندسة البرمجيات",
    scenario_type: "تفكير تصميمي",
    estimated_time: "10-12 دقيقة",
    prompt_text: "تبني ميزة تخزّن آخر 100 إجراء للمستخدم لعرضها بترتيب زمني عكسي. ما هيكل البيانات الذي ستستخدمه ولماذا؟",
    expected_learner_output: "توصية مثل طابور أو deque أو حلقة عازلة مع شرح واضح لإضافة الإجراءات الجديدة وإزالة القديمة وقراءة الأخيرة.",
  },
  "SE-05": {
    title: "فكر في قيد التوسع",
    path_title: "حل مشكلات هندسة البرمجيات",
    scenario_type: "حكم أداء",
    estimated_time: "12-15 دقيقة",
    prompt_text: "حلك يعمل لـ 1,000 سجل لكنه يتجاوز الوقت لـ 1,000,000 سجل. اشرح كيف ستحقق وتحسن الحل.",
    expected_learner_output: "نهج منظم يغطي القياس، تحليل التعقيد، تحديد عنق الزجاجة، تغييرات هيكل البيانات أو الخوارزمية، والتحقق.",
  },
  "SE-06": {
    title: "اشرح حلاً تقنياً لمعني غير تقني",
    path_title: "حل مشكلات هندسة البرمجيات",
    scenario_type: "تواصل + تفكير تقني",
    estimated_time: "12-15 دقيقة",
    prompt_text: "حسّنت ميزة بحث بطيئة بتغيير طريقة البحث عن السجلات. اشرح التحسين لمدير منتج غير تقني في 5-7 جمل.",
    expected_learner_output: "شرح بلغة بسيطة للمشكلة والتغيير والفائدة المتوقعة والمقايضات وكيفية قياس النجاح.",
  },
  "DQ-01": {
    title: "اكتب تقرير خطأ مفيداً",
    path_title: "التصحيح والاختبار والجودة",
    scenario_type: "تواصل كتابي",
    estimated_time: "6-8 دقائق",
    prompt_text: "يقول مستخدم: \"التطبيق معطل عند محاولة رفع صورة الملف الشخصي.\" اكتب تقرير خطأ يساعد مهندساً على التحقيق.",
    expected_learner_output: "تقرير خطأ منظم يحتوي على عنوان وخطوات إعادة الإنتاج والنتيجة المتوقعة والفعلية والبيئة والأدلة والأثر.",
  },
  "DQ-02": {
    title: "اختر اختبارات لنموذج تسجيل دخول",
    path_title: "التصحيح والاختبار والجودة",
    scenario_type: "تصميم اختبار",
    estimated_time: "8-10 دقائق",
    prompt_text: "تختبر نموذج تسجيل دخول بحقلي البريد الإلكتروني وكلمة المرور. اذكر أهم حالات الاختبار التي ستضمنها واشرح لماذا.",
    expected_learner_output: "مجموعة من حالات الاختبار العادية وغير الصالحة والأمنية والحدية وتجربة المستخدم.",
  },
  "DQ-03": {
    title: "حقق في ارتفاع أخطاء الإنتاج",
    path_title: "التصحيح والاختبار والجودة",
    scenario_type: "تفكير حادث",
    estimated_time: "10-12 دقيقة",
    prompt_text: "بعد إصدار جديد، ترتفع معدلات الأخطاء من 1% إلى 8%. يبلغ المستخدمون أن الدفع يفشل أحياناً. اشرح كيف ستحقق.",
    expected_learner_output: "خطة تحقيق حادث خطوة بخطوة تتضمن السجلات والمقاييس ومقارنة الإصدار وإعادة الإنتاج والتراجع والتواصل.",
  },
  "DQ-04": {
    title: "امنع الانحدار",
    path_title: "التصحيح والاختبار والجودة",
    scenario_type: "تخطيط وقائي",
    estimated_time: "10-12 دقيقة",
    prompt_text: "تم إصلاح خطأ الشهر الماضي، لكنه عاد بعد شحن ميزة جديدة. ماذا ستفعل لمنع هذا النوع من الانحدار مستقبلاً؟",
    expected_learner_output: "خطة وقاية تشمل اختبارات الانحدار وقائمة مراجعة الكود والملكية الواضحة والمراقبة والتوثيق.",
  },
  "DQ-05": {
    title: "فرز الأخطاء قبل الإصدار",
    path_title: "التصحيح والاختبار والجودة",
    scenario_type: "ترتيب أولويات",
    estimated_time: "12-15 دقيقة",
    prompt_text: "أمام فريقك يوم واحد قبل الإصدار وثلاثة أخطاء مفتوحة: مشكلة تخطيط مرئية نادرة، فشل دفع يؤثر على 3% من المستخدمين، وخطأ مطبعي في صفحة الإعدادات. قرر ماذا تصلح أولاً واشرح سبب اختيارك.",
    expected_learner_output: "قرار مرتب يعتبر الشدة والأثر على المستخدم والأعمال والمخاطر ووقت الإصلاح والحلول الممكنة.",
  },
  "PC-01": {
    title: "أعد كتابة رسالة غامضة",
    path_title: "التواصل المهني",
    scenario_type: "إعادة كتابة",
    estimated_time: "5-7 دقائق",
    prompt_text: "أعد كتابة هذه الرسالة لتكون أوضح وأكثر احترافية: \"مرحباً، لا أفهم ماذا تريد. هل يمكنك الشرح مرة أخرى؟\"",
    expected_learner_output: "رسالة محترمة تطلب التوضيح وتحتوي على أسئلة محددة.",
  },
  "PC-02": {
    title: "اكتب تحديث حالة",
    path_title: "التواصل المهني",
    scenario_type: "تحديث في مكان العمل",
    estimated_time: "7-9 دقائق",
    prompt_text: "تعمل على مهمة تستغرق وقتاً أطول من المتوقع. اكتب تحديث حالة قصيراً لفريقك.",
    expected_learner_output: "تحديث موجز يشرح التقدم والعائق والأثر والخطوة التالية وما إذا كنت بحاجة لمساعدة.",
  },
  "PC-03": {
    title: "استجب لانتقاد",
    path_title: "التواصل المهني",
    scenario_type: "صياغة رد",
    estimated_time: "8-10 دقائق",
    prompt_text: "يقول زميل أن توثيقك كان مربكاً وجعله ينفذ الشيء الخاطئ. اكتب رداً يبقي المحادثة مثمرة.",
    expected_learner_output: "رد يقر بالمشكلة، يتجنب الدفاع، يسأل عن التفاصيل، ويقترح إصلاحاً.",
  },
  "PC-04": {
    title: "اشرح تأخيراً لمعني",
    path_title: "التواصل المهني",
    scenario_type: "تواصل مع المعنيين",
    estimated_time: "10-12 دقيقة",
    prompt_text: "ستتأخر ميزة ثلاثة أيام لأن الاختبار وجد مشكلة جدية. اكتب رسالة لمدير منتج تشرح التأخير.",
    expected_learner_output: "شرح واضح للسبب والأثر والجدول المعدل والتخفيف والتحديث التالي.",
  },
  "PC-05": {
    title: "حوّل اجتماعاً فوضوياً إلى بنود عمل",
    path_title: "التواصل المهني",
    scenario_type: "تلخيص ومتابعة",
    estimated_time: "12-15 دقيقة",
    prompt_text: "بعد اجتماع فوضوي، ناقش الناس أفكاراً كثيرة لكنهم غادروا بدون ملكية واضحة. اكتب رسالة متابعة تلخص القرار والأسئلة المفتوحة والمسؤولين والخطوات التالية.",
    expected_learner_output: "متابعة منظمة بالقرارات والمسؤولين والمواعيد والأسئلة غير المحلولة وطلب تأكيد.",
  },
  "TC-01": {
    title: "وضّح الأدوار في مشروع جماعي",
    path_title: "العمل الجماعي وحل النزاعات",
    scenario_type: "تخطيط تعاوني",
    estimated_time: "6-8 دقائق",
    prompt_text: "مشروعكم الجماعي متأخر لأن لا أحد متأكد من مالك كل مهمة. اكتب رسالة لتوضيح الأدوار دون لوم أحد.",
    expected_learner_output: "رسالة محايدة تقترح ملكية المهام والمواعيد ومناقشة محاذاة سريعة.",
  },
  "TC-02": {
    title: "استجب لزميل فاته موعد نهائي",
    path_title: "العمل الجماعي وحل النزاعات",
    scenario_type: "استجابة لنزاع",
    estimated_time: "7-9 دقائق",
    prompt_text: "زميل فاته موعد نهائي ولم يحذر الفريق. اكتب رداً يعالج المشكلة مع الحفاظ على العلاقة.",
    expected_learner_output: "رسالة تسمي الأثر وتسأل ما حدث وتعيد تحديد التوقعات وتركز على الخطوات التالية.",
  },
  "TC-03": {
    title: "اختلف مع قرار تقني",
    path_title: "العمل الجماعي وحل النزاعات",
    scenario_type: "نقاش فريق",
    estimated_time: "9-11 دقيقة",
    prompt_text: "زميلك يريد شحن حل سريع تعتقد أنه قد يسبب مشاكل صيانة طويلة الأمد. اكتب كيف ستثير قلقك.",
    expected_learner_output: "اختلاف محترم يشرح المخاطر ويقدم الأدلة ويقر بالاستعجال ويقترح خيارات.",
  },
  "TC-04": {
    title: "خفّض حدة محادثة فريق متوترة",
    path_title: "العمل الجماعي وحل النزاعات",
    scenario_type: "تهدئة",
    estimated_time: "10-12 دقيقة",
    prompt_text: "زميلان يتجادلان في محادثة جماعية. أحدهما يقول إن الآخر \"لا يسمع أبداً\". الآخر يقول إنه \"تعب من إصلاح أخطاء الجميع\". ماذا ستقول لتهدئة الموقف ودفع الفريق للأمام؟",
    expected_learner_output: "رد يبطئ المحادثة، يقر بالعاطفة، يعيد التوجيه للحقائق، يقترح مناقشة خاصة، ويحدد الهدف المشترك.",
  },
  "TC-05": {
    title: "حل أولويات متعارضة بين فرق",
    path_title: "العمل الجماعي وحل النزاعات",
    scenario_type: "اتخاذ قرار متعدد الوظائف",
    estimated_time: "12-15 دقيقة",
    prompt_text: "الهندسة تريد تأجيل الإطلاق لتحسين الجودة. المبيعات تريد الإطلاق الآن بسبب عرض عميل مجدول. المنتج متردد. اقترح طريقة لمساعدة المجموعة على اتخاذ قرار.",
    expected_learner_output: "عملية قرار تحدد الأهداف والمخاطر والخيارات والأثر والمسؤول وخطة التواصل.",
  },
  "PT-01": {
    title: "اكتشف الحاجة الحقيقية للمستخدم",
    path_title: "التفكير في المنتج",
    scenario_type: "تفكير منتج",
    estimated_time: "7-9 دقائق",
    prompt_text: "يطلب مستخدم زراً لتصدير كل بيانات لوحة التحكم إلى جدول بيانات. قبل بنائه، ما الأسئلة التي ستطرحها لفهم الحاجة الحقيقية؟",
    expected_learner_output: "مجموعة أسئلة حول هدف المستخدم والتكرار والجمهور والتنسيق وسير العمل والبدائل ومعايير النجاح.",
  },
  "PT-02": {
    title: "حدد مقاييس نجاح لميزة",
    path_title: "التفكير في المنتج",
    scenario_type: "تصميم مقاييس",
    estimated_time: "8-10 دقائق",
    prompt_text: "فريقك يضيف ميزة تتابع تعلم لتشجيع المستخدمين على التدرب أكثر. ما المقاييس التي ستتعقبها لمعرفة ما إذا كانت تعمل؟",
    expected_learner_output: "مجموعة صغيرة من مقاييس النجاح والحماية والسلوك.",
  },
  "PT-03": {
    title: "رتب الميزات تحت قيود",
    path_title: "التفكير في المنتج",
    scenario_type: "ترتيب أولويات",
    estimated_time: "10-12 دقيقة",
    prompt_text: "يمكن لفريقك بناء واحدة فقط من هذه السبرنت: تأهيل أفضل، لوحة متصدرين، تقييم محسّن، أو الوضع الداكن. اختر واحدة واشرح سبب اختيارك.",
    expected_learner_output: "ترتيب أولويات منظم باستخدام الأثر والجهد وحاجة المستخدم وقيمة التعلم في MVP والمخاطر.",
  },
  "PT-04": {
    title: "صمم تجربة صغيرة",
    path_title: "التفكير في المنتج",
    scenario_type: "تخطيط تجربة",
    estimated_time: "10-12 دقيقة",
    prompt_text: "تعتقد أن المستخدمين سيكملون سيناريوهات أكثر إذا كانت التغذية الراجعة أقصر وأكثر قابلية للتنفيذ. صمم تجربة صغيرة لاختبار ذلك.",
    expected_learner_output: "خطة تجربة بفرضية وقطاع مستخدمين ومتغيرات ومقياس ومدة وحراس وقاعدة قرار.",
  },
  "PT-05": {
    title: "وازن طلبات المستخدمين مع تركيز المنتج",
    path_title: "التفكير في المنتج",
    scenario_type: "حكم استراتيجية منتج",
    estimated_time: "12-15 دقيقة",
    prompt_text: "يطلب بعض المستخدمين مسارات جديدة غير مرتبطة: المال، اللياقة، التحدث العام، تعلم اللغات، استراتيجية الألعاب. فريقك ما زال يحاول إثبات المنتج الأساسي. كيف يجب أن ترد وتقرر ماذا تبني؟",
    expected_learner_output: "رد يقدر الطلبات، يجمعها حسب الحاجة الأساسية، يتحقق من التماشي مع استراتيجية المنتج، يستخدم الأدلة، ويتجنب التوسع العشوائي.",
  },
  "AI-01": {
    title: "حسّن مطالبة ضعيفة",
    path_title: "محو الأمية بالذكاء الاصطناعي والاستخدام المسؤول",
    scenario_type: "إعادة كتابة مطالبة",
    estimated_time: "6-8 دقائق",
    prompt_text: "حسّن هذه المطالبة: \"ساعدني في مشروعي.\" المستخدم يبني تطبيق تتبع عادات بسيط ويحتاج مساعدة في تخطيط جداول قاعدة البيانات.",
    expected_learner_output: "مطالبة أوضح بالسياق والهدف والقيود والمخرجات المطلوبة والافتراضات وأمثلة إن لزم.",
  },
  "AI-02": {
    title: "تحقق من إجابة ذكاء اصطناعي قبل استخدامها",
    path_title: "محو الأمية بالذكاء الاصطناعي والاستخدام المسؤول",
    scenario_type: "تقييم",
    estimated_time: "9-11 دقيقة",
    prompt_text: "يعطيك ذكاء اصطناعي إجابة واثقة حول موضوع تقني لا تفهمه بالكامل. ما الخطوات التي يجب اتخاذها قبل استخدام تلك الإجابة في مشروعك؟",
    expected_learner_output: "خطة تحقق تشمل مراجعة الوثائق واختبار الإجابة وطلب التعليل ومقارنة البدائل وفهم المخاطر.",
  },
  "AI-03": {
    title: "قرر ما إذا كان يجب الإفصاح عن استخدام الذكاء الاصطناعي",
    path_title: "محو الأمية بالذكاء الاصطناعي والاستخدام المسؤول",
    scenario_type: "تفكير أخلاقي وسياسي",
    estimated_time: "10-12 دقيقة",
    prompt_text: "استخدمت الذكاء الاصطناعي لصياغة جزء من واجب أو وثيقة عمل، ثم حررته بنفسك بشدة. كيف ستقرر ما إذا كنت ستفصح عن مساعدة الذكاء الاصطناعي؟",
    expected_learner_output: "رد يعتبر القواعد والتوقعات والملكية ودرجة المساعدة والشفافية.",
  },
  "AI-04": {
    title: "احم المعلومات الخاصة عند استخدام الذكاء الاصطناعي",
    path_title: "محو الأمية بالذكاء الاصطناعي والاستخدام المسؤول",
    scenario_type: "حكم مخاطر",
    estimated_time: "12-15 دقيقة",
    prompt_text: "يريد زميلك لصق نص دعم عميل في أداة ذكاء اصطناعي لتلخيص شكوى المستخدم. النص يحتوي على أسماء وبريد إلكتروني ومعرفات طلبات وتفاصيل حساب خاصة. ماذا يجب أن تفعل؟",
    expected_learner_output: "رد يحمي المعلومات الحساسة، يقترح التنقيح أو الأدوات المعتمدة، يتحقق من السياسة، ويقترح سير عمل أأمن.",
  },
} satisfies Record<string, ScenarioContent>;

const tr = {
  "SE-01": {
    title: "Bir Kodlama Problemini Yeniden İfade Et ve Parçala",
    path_title: "Yazılım Mühendisliği Problem Çözme",
    scenario_type: "Yazılı akıl yürütme",
    estimated_time: "6-8 dakika",
    prompt_text: "Bir kodlama problemi verildi: \"Bir sayı listesi verildiğinde, toplamı hedef değere eşit olan iki sayıyı döndürün.\" Kod yazmadan önce problemi nasıl anlayıp parçalayacağınızı açıklayın.",
    expected_learner_output: "Girdiler, çıktılar, kısıtlamalar, olası yaklaşım ve temel kenar durumlarının yapılandırılmış bir açıklaması.",
  },
  "SE-02": {
    title: "Kaba Kuvvet ve Hash Map Arasında Seç",
    path_title: "Yazılım Mühendisliği Problem Çözme",
    scenario_type: "Teknik denge",
    estimated_time: "8-10 dakika",
    prompt_text: "Bir takım arkadaşı two-sum problemi için iç içe döngü çözümü öneriyor. Diğer takım arkadaşı hash map çözümü öneriyor. İki yaklaşımı karşılaştırın ve birini önerin.",
    expected_learner_output: "Doğruluk, zaman karmaşıklığı, alan karmaşıklığı, okunabilirlik ve her yaklaşımın ne zaman kabul edilebilir olduğunun karşılaştırması.",
  },
  "SE-03": {
    title: "Hatalı Bir Çözüm Planını Ayıkla",
    path_title: "Yazılım Mühendisliği Problem Çözme",
    scenario_type: "Tam uygulama olmadan kod akıl yürütme",
    estimated_time: "10-12 dakika",
    prompt_text: "Bir öğrenci bir dizide yinelenen değerleri bulmak için şu planı yazıyor: \"Diziyi sıralayın, sonra her öğeyi iki konum ileri öğeyle karşılaştırın.\" Bunun işe yarayıp yaramadığını, hangi hata veya zayıflığın var olduğunu ve nasıl düzelteceğinizi açıklayın.",
    expected_learner_output: "Mantık karşılaştırma sorununu tanımlayan ve sıralamadan sonra bitişik değerleri karşılaştırmayı veya bir set kullanmayı öneren gerekçeli bir eleştiri.",
  },
  "SE-04": {
    title: "Son Olaylar İçin Veri Yapısı Seç",
    path_title: "Yazılım Mühendisliği Problem Çözme",
    scenario_type: "Tasarım akıl yürütme",
    estimated_time: "10-12 dakika",
    prompt_text: "Kullanıcının son 100 eylemini ters kronolojik sırada gösterilebilecek şekilde depolayan bir özellik geliştiriyorsunuz. Hangi veri yapısını kullanırdınız ve neden?",
    expected_learner_output: "Yeni eylemler ekleme, eski eylemleri kaldırma ve son eylemleri okumanın açıklamasıyla kuyruk/deque/halka tampon/liste gibi bir öneri.",
  },
  "SE-05": {
    title: "Bir Ölçekleme Kısıtlaması Üzerine Düşün",
    path_title: "Yazılım Mühendisliği Problem Çözme",
    scenario_type: "Performans yargısı",
    estimated_time: "12-15 dakika",
    prompt_text: "Çözümünüz 1.000 kayıt için çalışıyor ancak 1.000.000 kayıt için zaman aşımına uğruyor. Çözümü nasıl araştırıp iyileştireceğinizi açıklayın.",
    expected_learner_output: "Ölçüm, karmaşıklık analizi, darboğaz tanımlama, veri yapısı veya algoritma değişiklikleri ve doğrulama kapsayan yapılandırılmış bir yaklaşım.",
  },
  "SE-06": {
    title: "Teknik Olmayan Bir Paydaşa Teknik Çözümü Açıkla",
    path_title: "Yazılım Mühendisliği Problem Çözme",
    scenario_type: "İletişim + teknik akıl yürütme",
    estimated_time: "12-15 dakika",
    prompt_text: "Kayıtların aranma şeklini değiştirerek yavaş bir arama özelliğini iyileştirdiniz. İyileştirmeyi teknik olmayan bir ürün yöneticisine 5-7 cümlede açıklayın.",
    expected_learner_output: "Problemin, değişikliğin, beklenen faydanın, dengelerin ve başarının nasıl ölçüleceğinin sade dilde açıklaması.",
  },
  "DQ-01": {
    title: "Yararlı Bir Hata Raporu Yaz",
    path_title: "Hata Ayıklama, Test ve Kalite",
    scenario_type: "Yazılı iletişim",
    estimated_time: "6-8 dakika",
    prompt_text: "Bir kullanıcı şöyle diyor: \"Profil resmimi yüklemeye çalıştığımda uygulama bozuluyor.\" Bir mühendisin sorunu araştırmasına yardımcı olacak bir hata raporu yazın.",
    expected_learner_output: "Başlık, yeniden üretme adımları, beklenen sonuç, gerçek sonuç, ortam, kanıt ve etki içeren yapılandırılmış bir hata raporu.",
  },
  "DQ-02": {
    title: "Bir Giriş Formu İçin Test Seç",
    path_title: "Hata Ayıklama, Test ve Kalite",
    scenario_type: "Test tasarımı",
    estimated_time: "8-10 dakika",
    prompt_text: "E-posta ve parola alanlarıyla bir giriş formunu test ediyorsunuz. Dahil edeceğiniz en önemli test durumlarını listeleyin ve nedenini açıklayın.",
    expected_learner_output: "Normal, geçersiz, güvenlik, kenar ve kullanıcı deneyimi test durumlarından oluşan bir set.",
  },
  "DQ-03": {
    title: "Bir Üretim Hata Sıçramasını Araştır",
    path_title: "Hata Ayıklama, Test ve Kalite",
    scenario_type: "Olay akıl yürütme",
    estimated_time: "10-12 dakika",
    prompt_text: "Yeni bir sürümden sonra hata oranları %1'den %8'e yükseliyor. Kullanıcılar ödemenin bazen başarısız olduğunu bildiriyor. Nasıl araştıracağınızı açıklayın.",
    expected_learner_output: "Loglar, metrikler, sürüm karşılaştırması, yeniden üretme, geri alma değerlendirmesi ve iletişim dahil adım adım bir olay araştırma planı.",
  },
  "DQ-04": {
    title: "Bir Regresyonu Önle",
    path_title: "Hata Ayıklama, Test ve Kalite",
    scenario_type: "Önleme planlaması",
    estimated_time: "10-12 dakika",
    prompt_text: "Geçen ay bir hata düzeltildi, ancak yeni bir özellik sevk edildikten sonra aynı hata geri döndü. Bu tür bir regresyonu gelecekte önlemek için ne yapardınız?",
    expected_learner_output: "Regresyon testleri, kod inceleme kontrol listesi, daha net sahiplik, izleme ve dokümantasyon içeren bir önleme planı.",
  },
  "DQ-05": {
    title: "Sürümden Önce Çoklu Hata Önceliklendirme",
    path_title: "Hata Ayıklama, Test ve Kalite",
    scenario_type: "Önceliklendirme",
    estimated_time: "12-15 dakika",
    prompt_text: "Ekibinizin sürümden önce bir günü ve üç açık hatası var: nadir bir görsel düzen sorunu, kullanıcıların %3'ünü etkileyen bir ödeme arızası ve ayarlar sayfasında bir yazım hatası. Önce neyi düzelteceğinize karar verin ve gerekçenizi açıklayın.",
    expected_learner_output: "Önem derecesi, kullanıcı etkisi, iş etkisi, risk, düzeltme süresi ve olası geçici çözümleri dikkate alan önceliklendirilmiş bir karar.",
  },
  "PC-01": {
    title: "Belirsiz Bir Mesajı Yeniden Yaz",
    path_title: "Profesyonel İletişim",
    scenario_type: "Yeniden yazma",
    estimated_time: "5-7 dakika",
    prompt_text: "Bu mesajı daha net ve profesyonel olacak şekilde yeniden yazın: \"Hey, ne istediğini anlamıyorum. Tekrar açıklayabilir misin?\"",
    expected_learner_output: "Açıklama isteyen ve belirli sorular içeren saygılı bir mesaj.",
  },
  "PC-02": {
    title: "Durum Güncellemesi Yaz",
    path_title: "Profesyonel İletişim",
    scenario_type: "İşyeri güncellemesi",
    estimated_time: "7-9 dakika",
    prompt_text: "Beklenenden uzun süren bir görev üzerinde çalışıyorsunuz. Ekibinize kısa bir durum güncellemesi yazın.",
    expected_learner_output: "İlerleme, engelleyici, etki, sonraki adım ve yardım gerekip gerekmediğini açıklayan kısa bir güncelleme.",
  },
  "PC-03": {
    title: "Eleştirel Geri Bildirime Yanıt Ver",
    path_title: "Profesyonel İletişim",
    scenario_type: "Yanıt taslağı",
    estimated_time: "8-10 dakika",
    prompt_text: "Bir takım arkadaşı dokümantasyonunuzun kafa karıştırıcı olduğunu ve yanlış şeyi uygulamasına neden olduğunu söylüyor. Konuşmayı verimli tutan bir yanıt yazın.",
    expected_learner_output: "Sorunu kabul eden, savunmacı olmaktan kaçınan, ayrıntıları soran ve bir düzeltme öneren bir yanıt.",
  },
  "PC-04": {
    title: "Bir Paydaşa Gecikmeyi Açıkla",
    path_title: "Profesyonel İletişim",
    scenario_type: "Paydaş iletişimi",
    estimated_time: "10-12 dakika",
    prompt_text: "Test ciddi bir sorun bulduğu için bir özellik üç gün gecikecek. Gecikmeyi açıklayan bir ürün yöneticisine mesaj yazın.",
    expected_learner_output: "Neden, etki, revize edilmiş zaman çizelgesi, hafifletme ve bir sonraki güncellemenin net bir açıklaması.",
  },
  "PC-05": {
    title: "Dağınık Bir Toplantıyı Eylem Maddelerine Dönüştür",
    path_title: "Profesyonel İletişim",
    scenario_type: "Özetleme ve takip",
    estimated_time: "12-15 dakika",
    prompt_text: "Dağınık bir toplantıdan sonra insanlar birçok fikri tartıştı ancak net bir sahiplik olmadan ayrıldı. Kararı, açık soruları, sahipleri ve sonraki adımları özetleyen bir takip mesajı yazın.",
    expected_learner_output: "Kararlar, sahipler, son tarihler, çözülmemiş sorular ve onay isteği içeren yapılandırılmış bir takip.",
  },
  "TC-01": {
    title: "Bir Grup Projesinde Rolleri Netleştir",
    path_title: "Takım Çalışması ve Çatışma Çözümü",
    scenario_type: "İşbirliği planlaması",
    estimated_time: "6-8 dakika",
    prompt_text: "Grup projeniz hangi görevin kime ait olduğundan kimsenin emin olmadığı için geride kalıyor. Kimseyi suçlamadan rolleri netleştirmek için bir mesaj yazın.",
    expected_learner_output: "Görev sahipliği, son tarihler ve hızlı bir hizalama tartışması öneren tarafsız bir mesaj.",
  },
  "TC-02": {
    title: "Son Tarihi Kaçıran Takım Arkadaşına Yanıt Ver",
    path_title: "Takım Çalışması ve Çatışma Çözümü",
    scenario_type: "Çatışma yanıtı",
    estimated_time: "7-9 dakika",
    prompt_text: "Bir takım arkadaşı son tarihi kaçırdı ve grubu uyarmadı. İlişkiyi sürdürürken sorunu ele alan bir yanıt yazın.",
    expected_learner_output: "Etkiyi adlandıran, ne olduğunu soran, beklentileri sıfırlayan ve sonraki adımlara odaklanan bir mesaj.",
  },
  "TC-03": {
    title: "Bir Teknik Karara Karşı Çık",
    path_title: "Takım Çalışması ve Çatışma Çözümü",
    scenario_type: "Takım tartışması",
    estimated_time: "9-11 dakika",
    prompt_text: "Takım arkadaşınız uzun vadeli bakım sorunları yaratabilecek hızlı bir çözüm göndermek istiyor. Endişenizi nasıl dile getireceğinizi yazın.",
    expected_learner_output: "Riski açıklayan, kanıt sunan, aciliyeti kabul eden ve seçenekler öneren saygılı bir anlaşmazlık.",
  },
  "TC-04": {
    title: "Gergin Bir Takım Sohbetini Yumuşat",
    path_title: "Takım Çalışması ve Çatışma Çözümü",
    scenario_type: "Yumuşatma",
    estimated_time: "10-12 dakika",
    prompt_text: "İki takım arkadaşı bir grup sohbetinde tartışıyor. Biri diğerinin \"asla dinlemediğini\" söylüyor. Diğeri \"herkesin hatalarını düzeltmekten yorulduğunu\" söylüyor. Yumuşatmak ve takımı ileri taşımak için ne söylersiniz?",
    expected_learner_output: "Konuşmayı yavaşlatan, duyguyu kabul eden, gerçeklere yönlendiren, özel bir tartışma öneren ve ortak hedefi belirleyen bir yanıt.",
  },
  "TC-05": {
    title: "Takımlar Arası Çelişen Öncelikleri Çöz",
    path_title: "Takım Çalışması ve Çatışma Çözümü",
    scenario_type: "Fonksiyonlar arası karar verme",
    estimated_time: "12-15 dakika",
    prompt_text: "Mühendislik kaliteyi iyileştirmek için lansmanı ertelemek istiyor. Satış, planlanmış bir müşteri demosu nedeniyle şimdi lansmanı istiyor. Ürün kararsız. Grubun karar vermesine yardımcı olacak bir yol önerin.",
    expected_learner_output: "Hedefleri, riskleri, seçenekleri, etkiyi, sahibi ve iletişim planını belirleyen bir karar süreci.",
  },
  "PT-01": {
    title: "Gerçek Kullanıcı İhtiyacını Bul",
    path_title: "Ürün Düşüncesi",
    scenario_type: "Ürün akıl yürütme",
    estimated_time: "7-9 dakika",
    prompt_text: "Bir kullanıcı tüm pano verilerini bir elektronik tabloya aktaran bir düğme istiyor. Onu oluşturmadan önce, gerçek ihtiyacı anlamak için hangi soruları sorardınız?",
    expected_learner_output: "Kullanıcı hedefi, sıklık, hedef kitle, format, iş akışı, alternatifler ve başarı kriterleri hakkında bir dizi soru.",
  },
  "PT-02": {
    title: "Bir Özellik İçin Başarı Metriklerini Tanımla",
    path_title: "Ürün Düşüncesi",
    scenario_type: "Metrik tasarımı",
    estimated_time: "8-10 dakika",
    prompt_text: "Ekibiniz kullanıcıların daha sık pratik yapmasını teşvik etmek için bir öğrenme serisi özelliği ekliyor. İşe yarayıp yaramadığını anlamak için hangi metrikleri takip ederdiniz?",
    expected_learner_output: "Küçük bir başarı, koruma ve davranış metrikleri seti.",
  },
  "PT-03": {
    title: "Kısıtlamalar Altında Özellikleri Önceliklendir",
    path_title: "Ürün Düşüncesi",
    scenario_type: "Önceliklendirme",
    estimated_time: "10-12 dakika",
    prompt_text: "Ekibiniz bu sprintte yalnızca bunlardan birini oluşturabilir: daha iyi bir onboarding, yeni bir liderlik tablosu, gelişmiş senaryo geri bildirimi veya karanlık mod. Birini seçin ve gerekçenizi açıklayın.",
    expected_learner_output: "Etki, çaba, kullanıcı ihtiyacı, MVP öğrenme değeri ve risk kullanan yapılandırılmış bir önceliklendirme.",
  },
  "PT-04": {
    title: "Küçük Bir Deney Tasarla",
    path_title: "Ürün Düşüncesi",
    scenario_type: "Deney planlaması",
    estimated_time: "10-12 dakika",
    prompt_text: "Geri bildirim daha kısa ve eyleme dönüştürülebilir olursa kullanıcıların daha fazla senaryo tamamlayacağına inanıyorsunuz. Bunu test etmek için küçük bir deney tasarlayın.",
    expected_learner_output: "Hipotez, kullanıcı segmenti, varyantlar, metrik, süre, korumalar ve karar kuralı içeren bir deney planı.",
  },
  "PT-05": {
    title: "Kullanıcı İsteklerini Ürün Odağıyla Dengele",
    path_title: "Ürün Düşüncesi",
    scenario_type: "Ürün stratejisi yargısı",
    estimated_time: "12-15 dakika",
    prompt_text: "Birkaç kullanıcı birçok ilgisiz yeni yol istiyor: finans, fitness, topluluk önünde konuşma, dil öğrenme ve oyun stratejisi. Ekibiniz hâlâ çekirdek ürünü kanıtlamaya çalışıyor. Nasıl yanıt verir ve ne oluşturacağınıza nasıl karar verirsiniz?",
    expected_learner_output: "İstekleri doğrulayan, altındaki ihtiyaca göre gruplandıran, ürün stratejisiyle uyumu kontrol eden, kanıt kullanan ve rastgele genişlemeyi önleyen bir yanıt.",
  },
  "AI-01": {
    title: "Zayıf Bir Komutu İyileştir",
    path_title: "Yapay Zeka Okuryazarlığı ve Sorumlu Kullanım",
    scenario_type: "Komut yeniden yazma",
    estimated_time: "6-8 dakika",
    prompt_text: "Bu komutu iyileştirin: \"Projeme yardım et.\" Kullanıcı basit bir alışkanlık takip uygulaması geliştiriyor ve veritabanı tablolarını planlamak için yardıma ihtiyacı var.",
    expected_learner_output: "Bağlam, hedef, kısıtlamalar, istenen çıktı, varsayımlar ve gerekirse örneklerle daha net bir komut.",
  },
  "AI-02": {
    title: "Kullanmadan Önce Bir AI Cevabını Kontrol Et",
    path_title: "Yapay Zeka Okuryazarlığı ve Sorumlu Kullanım",
    scenario_type: "Değerlendirme",
    estimated_time: "9-11 dakika",
    prompt_text: "AI size tam olarak anlamadığınız teknik bir konuda emin bir cevap veriyor. Bu cevabı projenizde kullanmadan önce hangi adımları atmalısınız?",
    expected_learner_output: "Dokümantasyon kontrolü, cevabın test edilmesi, gerekçe istenmesi, alternatiflerin karşılaştırılması ve risklerin anlaşılmasını içeren bir doğrulama planı.",
  },
  "AI-03": {
    title: "AI Kullanımının Açıklanıp Açıklanmayacağına Karar Ver",
    path_title: "Yapay Zeka Okuryazarlığı ve Sorumlu Kullanım",
    scenario_type: "Etik ve politika akıl yürütme",
    estimated_time: "10-12 dakika",
    prompt_text: "Bir sınıf ödevinin veya iş belgesinin bir kısmını AI ile taslakladınız, sonra ağır şekilde kendiniz düzenlediniz. AI yardımını açıklayıp açıklamayacağınıza nasıl karar verirsiniz?",
    expected_learner_output: "Kuralları, beklentileri, sahipliği, yardım derecesini ve şeffaflığı dikkate alan bir yanıt.",
  },
  "AI-04": {
    title: "AI Kullanırken Özel Bilgileri Koru",
    path_title: "Yapay Zeka Okuryazarlığı ve Sorumlu Kullanım",
    scenario_type: "Risk yargısı",
    estimated_time: "12-15 dakika",
    prompt_text: "Takım arkadaşınız müşteri şikayetini özetlemek için bir müşteri destek transkriptini bir AI aracına yapıştırmak istiyor. Transkript isimler, e-posta adresleri, sipariş kimlikleri ve özel hesap ayrıntıları içeriyor. Ne yapmalısınız?",
    expected_learner_output: "Hassas bilgileri koruyan, gizleme veya onaylanmış araçlar öneren, politikayı kontrol eden ve daha güvenli bir iş akışı öneren bir yanıt.",
  },
} satisfies Record<string, ScenarioContent>;

export const SCENARIO_CONTENT: Record<string, PerLocale<ScenarioContent>> = Object.fromEntries(
  Object.keys(ar).map((id) => [
    id,
    {
      ar: (ar as Record<string, ScenarioContent>)[id],
      tr: (tr as Record<string, ScenarioContent>)[id],
    },
  ]),
);

// Skill display labels (English skill ID -> localized label)
export const SKILL_LABELS: Record<string, PerLocale<string>> = {
  "Problem Understanding": { ar: "فهم المشكلة", tr: "Problem Anlama" },
  "Decomposition": { ar: "التحليل والتقسيم", tr: "Ayrıştırma" },
  "Algorithmic Pattern Recognition": { ar: "التعرف على الأنماط الخوارزمية", tr: "Algoritmik Örüntü Tanıma" },
  "Data Structure Selection": { ar: "اختيار هيكل البيانات", tr: "Veri Yapısı Seçimi" },
  "Complexity Awareness": { ar: "الوعي بالتعقيد", tr: "Karmaşıklık Farkındalığı" },
  "Edge Case Handling": { ar: "معالجة الحالات الحدية", tr: "Kenar Durum İşleme" },
  "Implementation Accuracy": { ar: "دقة التنفيذ", tr: "Uygulama Doğruluğu" },
  "Technical Explanation": { ar: "الشرح التقني", tr: "Teknik Açıklama" },
  "Judgment & Tradeoff Awareness": { ar: "الحكم والوعي بالمقايضات", tr: "Yargı ve Denge Farkındalığı" },
  "Bug Reproduction": { ar: "إعادة إنتاج الخطأ", tr: "Hata Yeniden Üretimi" },
  "Root Cause Analysis": { ar: "تحليل السبب الجذري", tr: "Kök Neden Analizi" },
  "Test Design": { ar: "تصميم الاختبار", tr: "Test Tasarımı" },
  "Regression Prevention": { ar: "منع الانحدار", tr: "Regresyon Önleme" },
  "Quality Prioritization": { ar: "ترتيب أولوية الجودة", tr: "Kalite Önceliklendirme" },
  "Observability Thinking": { ar: "تفكير القابلية للملاحظة", tr: "Gözlemlenebilirlik Düşüncesi" },
  "Clear Bug Communication": { ar: "تواصل واضح للأخطاء", tr: "Net Hata İletişimi" },
  "Communication Clarity": { ar: "وضوح التواصل", tr: "İletişim Netliği" },
  "Stakeholder Alignment": { ar: "محاذاة المعنيين", tr: "Paydaş Hizalaması" },
  "Written Clarity": { ar: "الوضوح الكتابي", tr: "Yazılı Netlik" },
  "Message Structure": { ar: "بنية الرسالة", tr: "Mesaj Yapısı" },
  "Audience Awareness": { ar: "الوعي بالجمهور", tr: "Hedef Kitle Farkındalığı" },
  "Respectful Tone": { ar: "نبرة محترمة", tr: "Saygılı Üslup" },
  "Conciseness": { ar: "الإيجاز", tr: "Özlü Olma" },
  "Follow-Up Quality": { ar: "جودة المتابعة", tr: "Takip Kalitesi" },
  "Active Listening": { ar: "الإصغاء النشط", tr: "Aktif Dinleme" },
  "Verbal Explanation": { ar: "الشرح الشفهي", tr: "Sözlü Açıklama" },
  "Role Clarity": { ar: "وضوح الأدوار", tr: "Rol Netliği" },
  "Shared Decision-Making": { ar: "اتخاذ القرار المشترك", tr: "Ortak Karar Verme" },
  "Constructive Disagreement": { ar: "الخلاف البنّاء", tr: "Yapıcı Anlaşmazlık" },
  "Repair Attempts": { ar: "محاولات الإصلاح", tr: "Onarım Girişimleri" },
  "Perspective Taking": { ar: "تقمص المنظور", tr: "Bakış Açısı Alma" },
  "Conflict Diagnosis": { ar: "تشخيص النزاع", tr: "Çatışma Teşhisi" },
  "User Need Identification": { ar: "تحديد حاجة المستخدم", tr: "Kullanıcı İhtiyacı Belirleme" },
  "Customer Empathy": { ar: "التعاطف مع العميل", tr: "Müşteri Empatisi" },
  "Problem Framing": { ar: "تأطير المشكلة", tr: "Problem Çerçeveleme" },
  "Success Metric Design": { ar: "تصميم مقاييس النجاح", tr: "Başarı Metriği Tasarımı" },
  "Feature Prioritization": { ar: "ترتيب أولوية الميزات", tr: "Özellik Önceliklendirme" },
  "Experiment Thinking": { ar: "تفكير تجريبي", tr: "Deney Düşüncesi" },
  "Product Focus": { ar: "تركيز المنتج", tr: "Ürün Odağı" },
  "Prompt Clarity": { ar: "وضوح المطالبة", tr: "Komut Netliği" },
  "Workflow Design": { ar: "تصميم سير العمل", tr: "İş Akışı Tasarımı" },
  "Output Evaluation": { ar: "تقييم المخرجات", tr: "Çıktı Değerlendirme" },
  "Human-in-the-Loop Judgment": { ar: "حكم الإنسان في الحلقة", tr: "Döngüdeki İnsan Yargısı" },
  "Privacy Awareness": { ar: "الوعي بالخصوصية", tr: "Gizlilik Farkındalığı" },
  "Responsible Disclosure": { ar: "الإفصاح المسؤول", tr: "Sorumlu Açıklama" },
  "Academic & Professional Integrity": { ar: "النزاهة الأكاديمية والمهنية", tr: "Akademik ve Mesleki Dürüstlük" },
};

export const DIMENSION_DESCRIPTIONS: Record<string, PerLocale<string>> = {
  "Decomposition": {
    ar: "تقسيم المشكلات إلى أجزاء مفيدة",
    tr: "Problemleri faydalı parçalara ayırır",
  },
  "Pattern Recognition": {
    ar: "التعرف على الأنماط المفيدة والأسباب المحتملة",
    tr: "Yararlı örüntüleri ve olası nedenleri tanır",
  },
  "Execution Quality": {
    ar: "تحويل الخطط إلى تنفيذ موثوق",
    tr: "Planları güvenilir eyleme dönüştürür",
  },
  "Communication": {
    ar: "الشرح بوضوح للجمهور",
    tr: "Hedef kitle için net açıklar",
  },
  "Judgment": {
    ar: "اتخاذ مقايضات عملية تحت القيود",
    tr: "Kısıtlamalar altında pratik dengeler kurar",
  },
  "Adaptability": {
    ar: "التعاون والتكيف تحت الغموض",
    tr: "Belirsizlik altında işbirliği yapar ve uyum sağlar",
  },
};

// Dashboard dimension display labels
export const DIMENSION_LABELS: Record<string, PerLocale<string>> = {
  "Decomposition": { ar: "التحليل والتقسيم", tr: "Ayrıştırma" },
  "Pattern Recognition": { ar: "التعرف على الأنماط", tr: "Örüntü Tanıma" },
  "Execution Quality": { ar: "جودة التنفيذ", tr: "Yürütme Kalitesi" },
  "Communication": { ar: "التواصل", tr: "İletişim" },
  "Judgment": { ar: "الحكم", tr: "Yargı" },
  "Adaptability": { ar: "القدرة على التكيف", tr: "Uyum Yeteneği" },
};

// Difficulty display
export const DIFFICULTY_LABELS: Record<string, PerLocale<string>> = {
  "Easy": { ar: "سهل", tr: "Kolay" },
  "Medium": { ar: "متوسط", tr: "Orta" },
  "Hard": { ar: "صعب", tr: "Zor" },
  "Easy to Hard": { ar: "من سهل إلى صعب", tr: "Kolaydan Zora" },
};

// Common path-level "difficulty range" label too - reuse DIFFICULTY_LABELS.
// Language name used in AI prompt
export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "Arabic",
  tr: "Turkish",
};
