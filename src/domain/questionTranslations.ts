import type { Question } from './types';

/**
 * Languages available for the question copy. The rest of the product remains
 * in English; these labels are intentionally written in each language's own
 * script so the picker is easy to recognize.
 */
export const QUESTION_LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'zh', label: '中文' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'ar', label: 'العربية' },
  { value: 'pt', label: 'Português' },
  { value: 'it', label: 'Italiano' },
  { value: 'fr', label: 'Français' },
  { value: 'ru', label: 'Русский' },
  { value: 'ja', label: '日本語' },
  { value: 'fa', label: 'فارسی' },
] as const;

export type QuestionLanguage = (typeof QUESTION_LANGUAGE_OPTIONS)[number]['value'];

export interface QuestionTranslation {
  prompt: string;
  choices: {
    A: string;
    B: string;
  };
}

type TranslationTuple = [prompt: string, choiceA: string, choiceB: string];

const toQuestionTranslations = (
  entries: Record<string, TranslationTuple>,
): Record<string, QuestionTranslation> => {
  return Object.fromEntries(
    Object.entries(entries).map(([questionId, [prompt, choiceA, choiceB]]) => [
      questionId,
      { prompt, choices: { A: choiceA, B: choiceB } },
    ]),
  );
};

/**
 * Authored copy for the questions currently shown in the quiz. Optional bank
 * questions fall back to their English source until they are part of the
 * presented flow.
 */
export const QUESTION_TRANSLATIONS: Partial<
  Record<QuestionLanguage, Record<string, QuestionTranslation>>
> = {
  es: toQuestionTranslations({
    M1: [
      'La vivienda se ha vuelto demasiado cara para muchas personas en tu ciudad. ¿Cuál es la mejor solución?',
      'Quitar trabas y normas de construcción para que las empresas privadas hagan más casas rápidamente.',
      'Usar dinero público para construir viviendas accesibles para quienes más las necesitan.',
    ],
    M2: [
      'Los trenes de cercanías siempre van con retraso y van llenos a reventar. ¿Cómo deberían gestionarse?',
      'Que una empresa pública gestione todos los trenes para rendir cuentas a los ciudadanos.',
      'Permitir que varias empresas privadas compitan para bajar precios y mejorar el servicio.',
    ],
    M3: [
      'El internet en tu zona es muy caro y se corta a cada rato. ¿Qué se debería hacer?',
      'Tratar el internet como el agua o la luz, y crear una red pública municipal para todos.',
      'Reducir normas y tarifas para que más empresas privadas compitan y bajen los precios.',
    ],
    A1: [
      'Una manifestación pacífica corta una autopista principal en plena hora punta de la mañana.',
      'Despejar la carretera rápido para que pasen los coches y las ambulancias de emergencia.',
      'Dejar que la marcha siga, porque para que una protesta se escuche tiene que llamar la atención.',
    ],
    A2: [
      'Un centro cultural público programa a un artista cuya actuación ofende profundamente a mucha gente del barrio.',
      'Dejar que actúe, porque los artistas deben ser libres para expresarse aunque a algunos les moleste.',
      'Cancelar el espectáculo, porque el dinero de los impuestos no debe pagar actos ofensivos.',
    ],
    A3: [
      'El ayuntamiento quiere poner cámaras de reconocimiento facial en plazas concurridas para buscar a sospechosos.',
      'Prohibir o limitar las cámaras para que no se vigile a la gente corriente a todas horas.',
      'Instalar las cámaras para ayudar a la policía a evitar delitos y atrapar a delincuentes peligrosos.',
    ],
    I1: [
      'La agencia oficial de salud asegura que un ingrediente es seguro, pero varios expertos dudan.',
      'Confiar en la decisión oficial de la agencia y en los controles de sus científicos.',
      'Esperar a que científicos independientes fuera del gobierno lo analicen y confirmen que no hace daño.',
    ],
    I2: [
      'Dos candidatos prometen arreglar la gestión del ayuntamiento. ¿Por quién votarías?',
      'Por alguien de fuera del sistema que no tenga compromisos y se atreva a desafiar a los funcionarios.',
      'Por un administrador con experiencia que conozca bien cómo funciona la administración por dentro.',
    ],
    I3: [
      'Una agencia de obras públicas nunca termina sus proyectos a tiempo. ¿Qué debería cambiarse?',
      'Contratar gestores profesionales con experiencia dirigiendo organismos públicos.',
      'Dejar el control en manos de vecinos del barrio para que las obras respondan a lo que de verdad hace falta.',
    ],
    G1: [
      'Una empresa tiene un puesto de trabajo libre y dos candidatos igual de buenos: uno del país y otro extranjero.',
      'Contratar primero a la persona del país para apoyar a los trabajadores locales.',
      'Contratar a quien tenga mejor perfil, porque la nacionalidad no debería importar para trabajar.',
    ],
    G2: [
      'Durante una epidemia mundial, un medicamento vital está muy escaso en todas partes.',
      'Enviar suministros a los países más golpeados donde muere más gente, sin importar las fronteras.',
      'Asegurar las medicinas para los ciudadanos de nuestro propio país antes de mandarlas fuera.',
    ],
    G3: [
      'Un tratado climático mundial exige reducir la contaminación, pero aumentará los gastos de las fábricas del país.',
      'Firmar el tratado, porque frenar la contaminación del planeta exige que todos los países colaboren.',
      'Rechazar el tratado para proteger el empleo del país y mantener el control sobre nuestras normas.',
    ],
    E1: [
      'Una persona adinerada muere y deja millones en dinero y propiedades a sus hijos.',
      'Cobrar un impuesto de sucesiones alto para financiar escuelas, hospitales y servicios públicos.',
      'Permitir que los hijos hereden casi todo, porque los padres tienen derecho a dejar sus ahorros a su familia.',
    ],
    E2: [
      'Un equipo termina un proyecto muy difícil. Todos colaboraron, pero dos personas hicieron la mayor parte del trabajo pesado.',
      'Repartir el dinero del bono a partes iguales para premiar el trabajo de todo el equipo.',
      'Dar la mayor parte del bono a los dos que sacaron adelante casi todo el proyecto.',
    ],
    E3: [
      'Una universidad importante ofrece unas pocas becas completas gratuitas.',
      'Dárselas a los estudiantes con las notas más altas y los mejores resultados de examen.',
      'Dárselas a estudiantes inteligentes de familias humildes que no pueden pagar la carrera.',
    ],
    T1: [
      'Los coches sin conductor funcionan bien en circuitos cerrados, pero apenas se han probado con tráfico real.',
      'Empezar a probarlos ya en las calles para que la tecnología avance más rápido.',
      'Seguir probándolos en circuitos cerrados hasta que su seguridad esté demostrada al cien por cien.',
    ],
    T2: [
      'Un programa de inteligencia artificial ayuda a sacar mejores notas, pero se ignora si perjudica el hábito de estudio a largo plazo.',
      'Esperar a ver los resultados de estudios a largo plazo antes de meterlo en las aulas.',
      'Llevarlo ya a los colegios para que los alumnos aprovechen sus ventajas de inmediato.',
    ],
    T3: [
      'La carne cultivada en laboratorio supera los controles básicos de sanidad. ¿Debería venderse en supermercados?',
      'Sí, que se venda con una etiqueta clara y que cada cliente decida si quiere comprarla.',
      'No, hay que esperar a estudios de varios años que demuestren que no tiene riesgos a largo plazo.',
    ],
  }),

  zh: toQuestionTranslations({
    M1: [
      '你所在的城市房价太高，很多人都住不起了。最好的解决办法是什么？',
      '放宽建房审批和限制，让私营开发商尽快多建住房。',
      '由政府出钱多建保障房和廉租房，提供给有需要的人。',
    ],
    M2: [
      '当地的火车和城轨总是晚点而且非常拥挤。应该如何运营？',
      '由统一的公共交通部门管理，向公众和乘客负责。',
      '让多家私营公司参与竞争，通过市场竞争来降低票价、改善服务。',
    ],
    M3: [
      '你所在地区的宽带网络收费高且经常断线。应该怎么办？',
      '把网络当成水和电一样的公共设施，由政府建设覆盖全体居民的市政网络。',
      '减少政策门槛和收费，让更多民营企业进入竞争，把价格打下来。',
    ],
    A1: [
      '一场和平抗议游行在早高峰期间堵住了城市主干道。',
      '迅速疏导并清理道路，保障交通通行和应急救援车辆通过。',
      '允许游行继续，因为抗议活动往往需要制造一定的阻碍才能引起重视。',
    ],
    A2: [
      '一家公立文化中心邀请了一位演出者，但其演出引发了许多当地居民的强烈反感。',
      '让演出照常进行，因为艺术创作应当享有表达自由，哪怕有人感到不适。',
      '取消演出，因为纳税人的公款不应该用来资助具有冒犯性的内容。',
    ],
    A3: [
      '市政府打算在人流密集的热闹广场安装人脸识别摄像头来追踪嫌疑人。',
      '禁止或严格限制此类摄像头，避免普通居民在日常生活中时刻被监视。',
      '安装这些摄像头，帮助警方预防犯罪并尽快抓捕危险犯罪分子。',
    ],
    I1: [
      '国家卫生部门宣布一种食品成分是安全的，但有专家提出了质疑。',
      '相信官方部门的结论，信赖国家科学标准和正规审查流程。',
      '先持保留态度，等政府之外的独立科研人员重复检验并确认安全再说。',
    ],
    I2: [
      '两位候选人都承诺改善政府市政管理。你更信任哪一位？',
      '一位体制外的独立人士，没有官场包袱，敢于打破陈规挑战官僚体制。',
      '一位经验丰富的体制内管理者，熟悉政府运作规律，知道如何把事情办成。',
    ],
    I3: [
      '一个负责公共建设的市政部门经常无法按时完成工程。应该如何改变？',
      '聘请有多年公共管理经验的专业高管来重新整顿运营。',
      '将监督权交给本地居民代表委员会，让项目真正符合街坊邻里的需求。',
    ],
    G1: [
      '一家公司有一个职位空缺，两位候选人能力不相上下：一个是本国公民，一个是外国人。',
      '优先录用本国公民，以支持本国就业和本土社群。',
      '完全凭个人能力录用，国籍不应该成为应聘岗位的考虑因素。',
    ],
    G2: [
      '在一场全球流行病暴发期间，一种救命药品的供应严重短缺。',
      '根据各地疫情严重程度将药品运往全球最需要的地方，不分国界。',
      '优先保证本国公民的用药需求，政府的首要责任是保护本国国民。',
    ],
    G3: [
      '一项国际环保协议要求削减排污，但这会增加本国工厂的生产成本。',
      '签署协议，因为应对全球环境危机需要所有国家共同承担责任。',
      '拒绝签署，以保护本国制造业竞争力和就业，保留自主决策权。',
    ],
    E1: [
      '一位富商去世，给子女留下了数百万甚至数千万的巨额遗产。',
      '征收高额遗产税，将这笔资金投入公立学校、公园和公共服务。',
      '允许子女继承大部分财产，父母有权把自己打拼赚来的钱留给家人。',
    ],
    E2: [
      '团队完成了一项艰巨的任务。大家都有付出，但有两个人承担了绝大部分重活。',
      '把团队奖金平分给所有人，以增强团队协作和集体凝聚力。',
      '把大头奖金发给出力最多的那两个人，认可他们的突出贡献。',
    ],
    E3: [
      '一所重点大学有名额有限的全额免费奖学金。',
      '完全按考试成绩和学业优劣评定，奖给最优秀拔尖的学生。',
      '发给成绩优良但家庭贫困的学生，帮助他们改变命运。',
    ],
    T1: [
      '自动驾驶汽车在封闭测试场表现良好，但在真实的城市繁忙路况中测试还很少。',
      '尽快在城市街道展开实测，加速新技术的实际应用和发展。',
      '继续在封闭测试场检验，直到完全证实安全无虞后再上路。',
    ],
    T2: [
      '一款AI学习辅导软件能提高学生的考试成绩，但它对长期学习习惯的影响尚未可知。',
      '先暂缓引入日常课堂，等待长期追踪研究评估其潜在不良影响。',
      '立即引入课堂使用，让学生马上享受到成绩提升的好处。',
    ],
    T3: [
      '实验室培育肉通过了基础安全检验。是否应该允许在超市上架销售？',
      '允许销售并贴上清晰标识，让消费者自己决定买不买。',
      '暂不上架，直到有多年的健康营养研究证实其长期食用完全无害。',
    ],
  }),

  hi: toQuestionTranslations({
    M1: [
      'आपके शहर में घर इतने महंगे हो गए हैं कि आम लोगों के लिए रहना मुश्किल हो गया है। सबसे अच्छा समाधान क्या है?',
      'निर्माण के नियम आसान किए जाएं ताकि निजी बिल्डर तेजी से ज्यादा मकान बना सकें।',
      'सरकारी पैसे से जरूरतमंद लोगों के लिए सस्ते और किफायती घर बनाए जाएं।',
    ],
    M2: [
      'आपके इलाके की ट्रेनें हमेशा लेट रहती हैं और उनमें भारी भीड़ होती है। उन्हें कैसे चलाया जाना चाहिए?',
      'एक ही सरकारी संस्था सभी ट्रेनें चलाए ताकि वह जनता के प्रति जवाबदेह रहे।',
      'निजी कंपनियों को ट्रेन चलाने की छूट मिले ताकि होड़ से टिकट सस्ते हों और सुविधा सुधरे।',
    ],
    M3: [
      'आपके क्षेत्र में इंटरनेट बहुत महंगा है और बार-बार कट जाता है। क्या किया जाना चाहिए?',
      'इंटरनेट को पानी या बिजली जैसी बुनियादी सुविधा माना जाए और नगर पालिका का सस्ता नेटवर्क बने।',
      'नियम और टैक्स कम किए जाएं ताकि निजी कंपनियां आपस में मुकाबला करके दाम घटाएं।',
    ],
    A1: [
      'सुबह के समय एक शांतिपूर्ण विरोध प्रदर्शन ने शहर का मुख्य हाईवे जाम कर दिया है।',
      'सड़क तुरंत खाली कराई जाए ताकि लोग काम पर जा सकें और एम्बुलेंस निकल सके।',
      'प्रदर्शन जारी रहने दिया जाए, क्योंकि ध्यान खींचने के लिए विरोध में थोड़ी रुकावट जरूरी होती है।',
    ],
    A2: [
      'एक सरकारी सांस्कृतिक केंद्र ने ऐसे कलाकार का शो रखा है जिससे इलाके के कई लोग आहत हैं।',
      'शो चलने दिया जाए, क्योंकि कलाकारों को अपनी बात कहने की आजादी होनी चाहिए भले ही कुछ लोग नाराज हों।',
      'शो रद्द किया जाए, क्योंकि जनता के टैक्स के पैसे से आपत्तिजनक चीजें नहीं दिखाई जानी चाहिए।',
    ],
    A3: [
      'नगर निगम संदिग्धों को पकड़ने के लिए भीड़भाड़ वाले चौराहों पर चेहरा पहचानने वाले कैमरे लगाना चाहता है।',
      'ऐसे कैमरों पर रोक लगे ताकि आम नागरिकों पर हर जगह चौबीसों घंटे नजर न रखी जाए।',
      'कैमरे लगाए जाएं ताकि पुलिस को अपराध रोकने और खतरनाक अपराधियों को पकड़ने में मदद मिले।',
    ],
    I1: [
      'सरकारी स्वास्थ्य विभाग ने एक खाद्य पदार्थ को सुरक्षित बताया है, लेकिन कुछ लोग सवाल उठा रहे हैं।',
      'सरकारी विभाग के फैसले और आधिकारिक वैज्ञानिकों की जांच पर भरोसा किया जाए।',
      'जब तक सरकार से बाहर के स्वतंत्र वैज्ञानिक जांच करके पुष्टि न करें, तब तक इंतजार किया जाए।',
    ],
    I2: [
      'दो उम्मीदवार शहर का कामकाज सुधारने का वादा कर रहे हैं। आप किस पर ज्यादा भरोसा करेंगे?',
      'एक बाहरी व्यक्ति पर जो पुरानी व्यवस्था से न बंधा हो और अफसरों की मनमानी को चुनौती दे सके।',
      'एक अनुभवी प्रशासक पर जो सरकारी तंत्र की बारीकियों को समझता हो और काम कराना जानता हो।',
    ],
    I3: [
      'विकास से जुड़ी एक सरकारी एजेंसी बार-बार अपने प्रोजेक्ट समय पर पूरा करने में नाकाम रहती है। क्या बदलाव होना चाहिए?',
      'सरकारी महकमों को चलाने का लंबा अनुभव रखने वाले पेशेवर अधिकारियों को जिम्मेदारी दी जाए।',
      'निगरानी का काम स्थानीय लोगों की समिति को सौंपा जाए ताकि काम पड़ोस की असली जरूरत के मुताबिक हो।',
    ],
    G1: [
      'एक कंपनी में एक पद खाली है और दो बराबर योग्य उम्मीदवार हैं: एक अपने देश का नागरिक और दूसरा विदेशी।',
      'अपने देश के नागरिक को प्राथमिकता दी जाए ताकि स्थानीय लोगों को रोजगार मिले।',
      'सिर्फ काबिलियत देखकर चुना जाए, नौकरी के लिए किसी की राष्ट्रीयता मायने नहीं रखनी चाहिए।',
    ],
    G2: [
      'दुनिया भर में महामारी के दौरान एक जीवनरक्षक दवा की भारी कमी हो गई है।',
      'दवा उन देशों में भेजी जाए जहां बीमारी से सबसे ज्यादा मौतें हो रही हैं, चाहे देश कोई भी हो।',
      'बाहर भेजने से पहले अपने देश के नागरिकों के लिए दवा सुरक्षित रखी जाए।',
    ],
    G3: [
      'एक अंतरराष्ट्रीय पर्यावरण समझौते के तहत प्रदूषण घटाना जरूरी है, लेकिन इससे स्थानीय कारखानों का खर्च बढ़ जाएगा।',
      'समझौते पर दस्तखत किए जाएं, क्योंकि दुनिया का प्रदूषण रोकने के लिए सभी देशों को मिलकर चलना होगा।',
      'दस्तखत करने से इनकार किया जाए ताकि देश में नौकरियां बची रहें और अपने नियमों पर खुद का फैसला रहे।',
    ],
    E1: [
      'एक अमीर व्यक्ति की मृत्यु के बाद उसके बच्चों को करोड़ों की संपत्ति और दौलत विरासत में मिलती है।',
      'विरासत पर बड़ा टैक्स लगाया जाए ताकि उस पैसे से सरकारी स्कूल, अस्पताल और पार्क बनाए जा सकें।',
      'बच्चों को लगभग पूरी दौलत रखने दी जाए, क्योंकि माता-पिता को अपनी गाढ़ी कमाई परिवार को सौंपने का हक है।',
    ],
    E2: [
      'एक टीम ने एक कठिन प्रोजेक्ट पूरा किया। मदद सबने की, लेकिन दो लोगों ने सबसे ज्यादा मेहनत की।',
      'बोनस का पैसा सभी सदस्यों में बराबर बांटा जाए ताकि टीम भावना बनी रहे।',
      'बोनस का बड़ा हिस्सा उन दो लोगों को दिया जाए जिन्होंने सबसे भारी काम किया।',
    ],
    E3: [
      'एक बड़े विश्वविद्यालय के पास कुछ पूरी तरह मुफ्त छात्रवृत्तियां देने के लिए हैं।',
      'वे सिर्फ सबसे ज्यादा नंबर और टॉप रैंक लाने वाले विद्यार्थियों को दी जाएं।',
      'वे गरीब परिवारों के होनहार विद्यार्थियों को दी जाएं जो कॉलेज की फीस नहीं भर सकते।',
    ],
    T1: [
      'ड्राइवरलेस कारें टेस्टिंग ट्रैक पर तो सही चल रही हैं, लेकिन शहर के भारी ट्रैफिक में उनकी जांच कम हुई है।',
      'शहर की सड़कों पर अभी ट्रायल शुरू किए जाएं ताकि नई तकनीक तेजी से विकसित हो सके।',
      'जब तक उनकी सुरक्षा सौ फीसदी साबित न हो जाए, तब तक उन्हें टेस्टिंग ट्रैक तक ही सीमित रखा जाए।',
    ],
    T2: [
      'एआई ट्यूटर छात्रों के नंबर सुधारने में मदद कर रहा है, लेकिन दिमाग पर उसके लंबे असर की जानकारी नहीं है।',
      'स्कूलों में लाने से पहले कई सालों के रिसर्च और नतीजों का इंतजार किया जाए।',
      'इसे तुरंत कक्षाओं में इस्तेमाल किया जाए ताकि बच्चों को पढ़ाई में फौरन फायदा मिल सके।',
    ],
    T3: [
      'लैब में बना मांस बुनियादी सरकारी सुरक्षा मानकों पर खरा उतरा है। क्या इसे दुकानों पर बिकने देना चाहिए?',
      'हां, साफ लेबल लगाकर बिकने दिया जाए ताकि ग्राहक खुद तय कर सकें कि उन्हें खरीदना है या नहीं।',
      'नहीं, जब तक कई सालों के अध्ययन यह साबित न कर दें कि इसका कोई बुरा असर नहीं होगा, तब तक रोक लगाई जाए।',
    ],
  }),

  ar: toQuestionTranslations({
    M1: [
      'أصبح السكن مكلفاً جداً لكثير من الناس في مدينتك. ما أفضل طريقة لحل المشكلة؟',
      'تخفيف شروط وتراخيص البناء حتى تتمكن الشركات الخاصة من بناء المزيد من المنازل بسرعة.',
      'استخدام أموال الدولة لبناء مساكن ميسورة التكلفة لمن يحتاجون إليها.',
    ],
    M2: [
      'قطارات مدينتك تتأخر باستمرار وتعاني من زحام خانق. كيف ينبغي تشغيلها؟',
      'إسناد تشغيل القطارات لجهة حكومية واحدة تكون مسؤولة أمام الناس مباشرة.',
      'السماح لشركات خاصة بالمنافسة لخفض الأسعار ورفع مستوى الخدمة.',
    ],
    M3: [
      'خدمة الإنترنت السريع في منطقتك باهظة الثمن وتنقطع باستمرار. ما الحل الأنسب؟',
      'اعتبار الإنترنت خدمة أساسية كالماء والكهرباء وبناء شبكة عامة تملكها المدينة للجميع.',
      'تقليل الشروط والرسوم لتتمكن الشركات الخاصة من التنافس وتقديم أسعار أرخص.',
    ],
    A1: [
      'مظاهرة سلمية تغلق طريقاً سريعاً رئيسياً خلال ساعة الذروة الصباحية.',
      'فتح الطريق بسرعة لتمكين الناس من الوصول لأعمالهم ومرور سيارات الإسعاف.',
      'السماح للمظاهرة بالاستمرار، لأن الاحتجاجات لا يُسمع صوتها إلا إذا أحدثت بعض الإرباك.',
    ],
    A2: [
      'مركز ثقافي عام ينظم عرضاً لفنان يثير استياءً وغضباً واسعاً بين سكان المنطقة.',
      'السماح بالعرض لأن للفنانين حرية التعبير حتى وإن تسبب عملهم في إزعاج البعض.',
      'إلغاء العرض لأن أموال الضرائب العامة لا ينبغي أن تدفع مقابل أعمال مسيئة.',
    ],
    A3: [
      'تريد بلدية المدينة وضع كاميرات للتعرف على الوجوه في الساحات المزدحمة لتعقب المشتبه بهم.',
      'منع هذه الكاميرات أو تقييدها حتى لا تتم مراقبة الناس العاديين طوال الوقت في الأماكن العامة.',
      'تركيب الكاميرات لمساعدة الشرطة في منع الجرائم والقبض على المجرمين الخطرين.',
    ],
    I1: [
      'تؤكد الهيئة الصحية الحكومية أن مادة غذائية آمنة، لكن خبراء مستقلين يشككون في ذلك.',
      'الوثوق بقرار الهيئة والاعتماد على العلماء الرسميين وفحوصات السلامة الحكومية.',
      'التمهل حتى يقوم علماء مستقلون من خارج الحكومة بفحصها والتأكد من سلامتها.',
    ],
    I2: [
      'مرشحان يعدان بإصلاح إدارة البلدية. لمن ستصوت؟',
      'لشخص من خارج الجهاز الحكومي لا يخضع لعلاقات سابقة ولا يتردد في مواجهة الروتين والبيروقراطية.',
      'لمسؤول متمرس يعرف دهاليز الإدارة الحكومية وكيفية إنجاز المعاملات.',
    ],
    I3: [
      'مؤسسة خدمات بلدية تفشل باستمرار في إنهاء مشاريعها في الوقت المحدد. ما التغيير المطلوب؟',
      'تعيين مديرين محترفين يملكون سنوات طويلة من الخبرة في إدارة الدوائر العامة.',
      'تسليم إدارة الإشراف لمجلس من سكان الحي لتكون المشاريع ملبية لاحتياجاتهم الحقيقية.',
    ],
    G1: [
      'أمام شركة وظيفة شاغرة ومتقدمان متساويان تماماً في الكفاءة: مواطن وشخص أجنبي.',
      'توظيف المواطن أولاً لدعم العمالة الوطنية في بلدك.',
      'اختيار الأفضل بناءً على الجدارة وحدها دون أن تكون الجنسية معياراً للتوظيف.',
    ],
    G2: [
      'أثناء تفشي وباء عالمي، أصبح دواء منقذ للحياة نادراً جداً في كل مكان.',
      'إرسال الدواء للبلدان الأكثر تضرراً التي يموت فيها الناس، بصرف النظر عن الحدود.',
      'تأمين الدواء لمواطني بلدك أولاً قبل إرسال أي كمية للخارج.',
    ],
    G3: [
      'اتفاقية مناخ دولية تفرض تقليل التلوث، لكنها ستزيد من تكاليف المصانع المحلية.',
      'توقيع الاتفاقية، لأن مواجهة التلوث العالمي تتطلب تعاون وتكاتف جميع الدول.',
      'رفض التوقيع لحماية الوظائف المحلية والاحتفاظ بالسيادة الكاملة على قوانين بلدك.',
    ],
    E1: [
      'توفي رجل ثري وترك ملايين الدولارات من أملاك وأموال لأولاده.',
      'فرض ضريبة تركات مرتفعة لتمويل المدارس العامة والحدائق والمستشفيات.',
      'ترك معظم المال للأولاد، لأن من حق الآباء توريث ما جمعوه في حياتهم لأسرهم.',
    ],
    E2: [
      'أنجز فريق مشروعاً شاقاً بنجاح. ساهم الجميع، لكن شخصين تحملا معظم الجهد والعبء الأكبر.',
      'توزيع المكافأة المالية بالتساوي على الجميع تقديراً لروح العمل الجماعي.',
      'منح الحصة الكبرى من المكافأة للاثنين اللذين قاما بأثقل الأعمال.',
    ],
    E3: [
      'جامعة كبرى تخصص عدداً محدوداً من المنح الدراسية المجانية بالكامل.',
      'منحها للطلاب الحاصلين على أعلى الدرجات وأفضل النتائج في الاختبارات.',
      'منحها للطلاب الأذكياء من أسر فقيرة لا تملك القدرة على دفع الرسوم الجامعية.',
    ],
    T1: [
      'السيارات ذاتية القيادة تعمل جيداً في ساحات الاختبار، لكن تجاربها في زحام الشوارع الحقيقية قليلة.',
      'بدء اختبارها في شوارع المدينة الآن لتسريع تطور التكنولوجيا الجديدة.',
      'إبقاؤها في حلبات الاختبار المغلقة حتى يتم إثبات أمانها بالكامل.',
    ],
    T2: [
      'يساعد برنامج ذكاء اصطناعي الطلاب على رفع درجاتهم، لكن لا أحد يعلم أثره طويل المدى على رغبتهم في التفكير والتعلم.',
      'الانتظار لسنوات حتى تكشف الدراسات آثاره قبل إدخاله للفصول الدراسية.',
      'استخدامه في المدارس فوراً ليستفيد الطلاب من نتائجه الإيجابية الآن.',
    ],
    T3: [
      'لحم منتج في المختبر اجتاز فحوصات السلامة الأساسية. هل ينبغي بيعه في المتاجر؟',
      'نعم، بيعه مع كتابة ملصق واضح ليقرر المستهلك بنفسه.',
      'لا، التريث حتى تؤكد أبحاث لعدة سنوات أنه آمن تماماً ولا يسبب أضراراً طويلة المدى.',
    ],
  }),

  pt: toQuestionTranslations({
    M1: [
      'A moradia ficou cara demais para muitas pessoas na sua cidade. Qual é o melhor caminho?',
      'Facilitar as regras de construção para que construtoras privadas façam mais casas depressa.',
      'Usar dinheiro público para construir casas populares e acessíveis para quem precisa.',
    ],
    M2: [
      'Os trens da sua região vivem atrasados e superlotados. Como deveriam ser administrados?',
      'Deixar tudo nas mãos de uma empresa pública para prestar contas à população.',
      'Deixar empresas privadas competirem para baixar os preços e melhorar o serviço.',
    ],
    M3: [
      'A internet banda larga na sua área é cara e cai o tempo todo. O que deveria ser feito?',
      'Tratar a internet como água ou luz e criar uma rede pública municipal para todos.',
      'Cortar burocracias e taxas para que empresas privadas disputem clientes e baixem os preços.',
    ],
    A1: [
      'Um protesto pacífico fecha uma grande avenida bem na hora do rush matutino.',
      'Liberar a pista rapidamente para o trânsito fluir e as ambulâncias conseguirem passar.',
      'Deixar a manifestação continuar, porque um protesto precisa incomodar para ser ouvido.',
    ],
    A2: [
      'Um centro cultural público convida um artista cuja apresentação ofende profundamente parte da comunidade.',
      'Permitir a apresentação, pois artistas devem ter liberdade para se expressar mesmo que alguns se ofendam.',
      'Cancelar o show, porque dinheiro dos impostos não deve bancar apresentações ofensivas.',
    ],
    A3: [
      'A prefeitura quer instalar câmeras de reconhecimento facial em praças movimentadas para procurar suspeitos.',
      'Proibir ou limitar essas câmeras para que cidadãos comuns não sejam vigiados o tempo todo.',
      'Instalar as câmeras para ajudar a polícia a evitar crimes e prender bandidos perigosos.',
    ],
    I1: [
      'O órgão oficial de saúde diz que um ingrediente de comida é seguro, mas críticos contestam.',
      'Confiar na decisão do órgão oficial e nas análises de cientistas do governo.',
      'Esperar até que cientistas independentes de fora do governo testem e confirmem que é seguro.',
    ],
    I2: [
      'Dois candidatos prometem melhorar a administração da prefeitura. Em quem você votaria?',
      'Em alguém de fora da política tradicional, que não tenha rabo preso e encare os burocratas.',
      'Em um administrador experiente, que conheça a máquina pública por dentro e saiba fazer as coisas andarem.',
    ],
    I3: [
      'Um órgão público de obras atrasa constantemente as entregas de projetos. O que deve mudar?',
      'Contratar gestores profissionais com anos de bagagem na administração pública.',
      'Passar o controle para uma comissão de moradores do bairro para que as obras atendam às necessidades reais.',
    ],
    G1: [
      'Uma empresa tem uma vaga aberta e dois candidatos igualmente bons: um cidadão do país e um estrangeiro.',
      'Contratar o cidadão do país primeiro para priorizar o emprego dos trabalhadores locais.',
      'Contratar o melhor candidato, pois nacionalidade não deveria fazer diferença em uma vaga de trabalho.',
    ],
    G2: [
      'Durante uma pandemia global, um remédio que salva vidas está com estoque muito baixo.',
      'Mandar remédios para onde a doença está matando mais gente, independentemente de fronteiras.',
      'Garantir o remédio primeiro para os cidadãos do próprio país antes de enviar para fora.',
    ],
    G3: [
      'Um acordo internacional sobre o clima exige cortar a poluição, mas vai encarecer a produção das fábricas locais.',
      'Assinar o acordo, pois combater a poluição do planeta exige a união de todos os países.',
      'Recusar o acordo para proteger os empregos locais e manter o controle sobre nossas próprias leis.',
    ],
    E1: [
      'Uma pessoa muito rica morre e deixa uma fortuna milionária de herança para os filhos.',
      'Cobrar um imposto alto sobre a herança para investir em escolas públicas, parques e serviços.',
      'Deixar quase tudo com a família, pois os pais têm o direito de passar o que conquistaram para os filhos.',
    ],
    E2: [
      'Uma equipe conclui um projeto difícil. Todos colaboraram, mas duas pessoas carregaram quase todo o trabalho.',
      'Dividir o bônus em partes iguais para valorizar a união da equipe.',
      'Dar a maior parte do bônus aos dois profissionais que mais se desdobraram.',
    ],
    E3: [
      'Uma faculdade de ponta tem poucas bolsas integrais gratuitas para novos alunos.',
      'Dar as bolsas para os alunos com as maiores notas nas provas e no vestibular.',
      'Dar as bolsas para jovens talentosos de famílias pobres que não têm como pagar a faculdade.',
    ],
    T1: [
      'Carros autônomos funcionam bem em pistas de teste, mas quase não foram testados no trânsito pesado da cidade.',
      'Começar a testar nas ruas agora para acelerar o desenvolvimento dessa nova tecnologia.',
      'Manter os testes em pistas fechadas até que a segurança esteja cem por cento garantida.',
    ],
    T2: [
      'Um tutor de inteligência artificial ajuda estudantes a tirarem notas melhores, mas ninguém sabe se prejudica os hábitos de estudo a longo prazo.',
      'Aguardar anos de pesquisas antes de autorizar o uso em salas de aula.',
      'Adotar logo nas escolas para que os alunos aproveitem as vantagens no aprendizado agora.',
    ],
    T3: [
      'A carne feita em laboratório passou nos testes básicos de vigilância sanitária. Deveria ir para as prateleiras?',
      'Sim, permitir a venda com rótulo claro e deixar os consumidores decidirem se querem comprar.',
      'Não, esperar estudos de vários anos que comprovem que ela não faz mal à saúde no longo prazo.',
    ],
  }),

  it: toQuestionTranslations({
    M1: [
      'Nella tua città le case sono diventate troppo care per molte persone. Qual è la soluzione migliore?',
      'Tagliare i vincoli edilizi così le imprese private possono costruire più case in fretta.',
      'Usare fondi pubblici per costruire case popolari accessibili a chi ne ha bisogno.',
    ],
    M2: [
      'I treni della tua zona sono sempre in ritardo e strapieni. Come dovrebbero essere gestiti?',
      'Affidare tutti i treni a un unico ente pubblico che risponda direttamente ai cittadini.',
      'Permettere a compagnie private di farsi concorrenza per abbassare i prezzi e migliorare il servizio.',
    ],
    M3: [
      'La connessione internet nella tua zona costa troppo e si disconnette spesso. Cosa bisognerebbe fare?',
      'Considerare internet come l’acqua o la luce e creare una rete pubblica comunale per tutti.',
      'Rimuovere vincoli e tasse per far entrare sul mercato aziende private in concorrenza sui prezzi.',
    ],
    A1: [
      'Un corteo di protesta pacifica blocca una strada principale durante l’ora di punta mattutina.',
      'Sgomberare subito la strada per permettere il transito delle auto e dei mezzi di soccorso.',
      'Lasciare che la manifestazione prosegua, perché una vera protesta deve farsi notare per farsi ascoltare.',
    ],
    A2: [
      'Un centro culturale comunale organizza lo spettacolo di un artista che offende profondamente molti residenti.',
      'Far andare avanti lo spettacolo, perché la libertà artistica va tutelata anche se a molti dà fastidio.',
      'Annullare lo spettacolo, perché i soldi delle tasse non devono essere usati per finanziare contenuti offensivi.',
    ],
    A3: [
      'Il comune vuole installare telecamere con riconoscimento facciale nelle piazze affollate per cercare sospetti.',
      'Vietare o limitare queste telecamere per evitare che i cittadini siano continuamente sorvegliati in pubblico.',
      'Installarle per aiutare le forze dell’ordine a prevenire reati e catturare criminali pericolosi.',
    ],
    I1: [
      'L’agenzia sanitaria statale dichiara sicuro un alimento, ma diversi critici hanno dei dubbi.',
      'Fidarsi del parere dell’agenzia e fare affidamento sui controlli e sugli scienziati ufficiali.',
      'Sospendere il giudizio finché scienziati indipendenti fuori dallo Stato non confermeranno la sicurezza.',
    ],
    I2: [
      'Due candidati promettono di sistemare il funzionamento del comune. Di chi ti fideresti di più?',
      'Di un outsider slegato dal sistema che non ha paura di sfidare gli impiegati comunali.',
      'Di un amministratore esperto che conosce a fondo i meccanismi del governo e sa come far funzionare le cose.',
    ],
    I3: [
      'Un’azienda pubblica per le opere comunali non riesce mai a finire i lavori in tempo. Come bisogna intervenire?',
      'Assumere dirigenti professionisti con anni di esperienza nella gestione della cosa pubblica.',
      'Affidare la supervisione a un consiglio di residenti del quartiere affinché i lavori rispondano ai bisogni reali.',
    ],
    G1: [
      'Un’azienda ha un posto vacante e due candidati bravi allo stesso modo: un cittadino del posto e un lavoratore straniero.',
      'Assumere prima il cittadino locale per dare priorità all’occupazione del proprio paese.',
      'Scegliere la persona più in gamba, perché la nazionalità non dovrebbe contare per un lavoro.',
    ],
    G2: [
      'Durante un’epidemia globale, un farmaco salvavita scarseggia in tutto il mondo.',
      'Inviare le scorte nei paesi più colpiti dove muoiono più persone, al di là dei confini nazionali.',
      'Garantire prima le cure ai cittadini del proprio paese prima di inviare medicine all’estero.',
    ],
    G3: [
      'Un accordo internazionale sul clima impone di tagliare l’inquinamento, ma farà salire i costi per le fabbriche del paese.',
      'Firmare il trattato, perché per fermare l’inquinamento globale tutti gli Stati devono collaborare.',
      'Rifiutarsi di firmare per tutelare i posti di lavoro locali e mantenere piena autonomia sulle nostre leggi.',
    ],
    E1: [
      'Una persona facoltosa scompare e lascia in eredità milioni di euro e proprietà ai propri figli.',
      'Applicare un’alta tassa di successione per usare quei fondi a favore di scuole, ospedali e servizi pubblici.',
      'Lasciare quasi tutto l’asse ai figli, perché i genitori hanno il diritto di tramandare i propri risparmi alla famiglia.',
    ],
    E2: [
      'Un gruppo di lavoro porta a termine un progetto tosto. Tutti hanno dato una mano, ma due persone hanno fatto il lavoro più pesante.',
      'Dividere il premio in denaro in parti uguali per premiare la collaborazione del gruppo.',
      'Destinare la quota maggiore del premio ai due colleghi che hanno tirato la carretta.',
    ],
    E3: [
      'Una prestigiosa università mette a disposizione poche borse di studio a copertura totale.',
      'Assegnarle agli studenti con i voti più alti e i punteggi migliori agli esami.',
      'Assegnarle a studenti capaci ma di famiglie povere che altrimenti non potrebbero permettersi di studiare.',
    ],
    T1: [
      'Le auto a guida autonoma vanno bene su piste di prova, ma sono state poco testate nel traffico cittadino reale.',
      'Avviare subito le prove per strada per accelerare lo sviluppo di questa nuova tecnologia.',
      'Continuare i test solo su piste chiuse finché la sicurezza non sarà provata al cento per cento.',
    ],
    T2: [
      'Un tutor dotato di intelligenza artificiale migliora i voti degli alunni, ma non si conoscono gli effetti a lungo termine sullo studio.',
      'Aspettare studi pluriennali prima di introdurlo stabilmente nelle aule scolastiche.',
      'Introdurlo subito nelle classi per consentire agli studenti di ottenere subito voti migliori.',
    ],
    T3: [
      'La carne coltivata in laboratorio ha superato i requisiti minimi di legge. Dovrebbe essere messa in vendita nei supermercati?',
      'Sì, autorizzare la vendita con un’etichetta trasparente e lasciare libera scelta ai clienti.',
      'No, aspettare studi sanitari di vari anni che certifichino l’assenza di controindicazioni a lungo termine.',
    ],
  }),

  fr: toQuestionTranslations({
    M1: [
      'Le logement est devenu trop cher pour beaucoup de monde dans votre ville. Quelle est la meilleure solution ?',
      'Assouplir les règles de construction pour que les entreprises privées bâtissent plus vite.',
      'Utiliser l’argent public pour construire des logements sociaux pour ceux qui en ont besoin.',
    ],
    M2: [
      'Les trains de votre région sont constamment en retard et bondés. Comment devraient-ils être gérés ?',
      'Confier tous les trains à un organisme public pour rendre des comptes aux usagers.',
      'Laisser des entreprises privées se faire concurrence pour baisser les prix et améliorer le service.',
    ],
    M3: [
      'Dans votre quartier, internet coûte cher et coupe tout le temps. Que faut-il faire ?',
      'Traiter internet comme l’eau ou l’électricité et créer un réseau public géré par la ville.',
      'Alléger les règles et les taxes pour que les opérateurs privés se fassent concurrence et baissent les prix.',
    ],
    A1: [
      'Une manifestation pacifique bloque une autoroute principale à l’heure de pointe du matin.',
      'Dégager rapidement la route pour laisser passer les secours et permettre aux gens d’aller travailler.',
      'Laisser le défilé continuer, car pour se faire entendre, une vraie manifestation doit déranger.',
    ],
    A2: [
      'Un centre culturel public invite un artiste dont le spectacle choque profondément beaucoup d’habitants.',
      'Maintenir le spectacle, car les artistes doivent être libres d’agir même si cela déplaît.',
      'Annuler le spectacle, car l’argent des contribuables ne doit pas financer des contenus choquants.',
    ],
    A3: [
      'La mairie veut installer des caméras à reconnaissance faciale sur les places très fréquentées pour repérer les suspects.',
      'Interdire ou limiter ces caméras pour éviter que les citoyens soient épiés en permanence dans la rue.',
      'Installer ces caméras pour aider la police à prévenir les délits et arrêter les criminels dangereux.',
    ],
    I1: [
      'L’agence nationale de santé déclare un aliment sans danger, mais des voix critiques s’élèvent.',
      'Faire confiance à l’avis de l’agence et se fier aux scientifiques officiels et aux contrôles.',
      'Attendre que des scientifiques indépendants hors du gouvernement mènent leurs propres tests.',
    ],
    I2: [
      'Deux candidats s’engagent à moderniser la mairie. À qui feriez-vous le plus confiance ?',
      'À une personnalité extérieure au système qui n’a pas peur de bousculer les habitudes des fonctionnaires.',
      'À un gestionnaire expérimenté qui connaît parfaitement les rouages de l’administration.',
    ],
    I3: [
      'Une agence publique n’arrive jamais à terminer ses chantiers à temps. Que faut-il changer ?',
      'Nommer des directeurs professionnels qui ont de longues années d’expérience dans les services publics.',
      'Confier la direction à un comité d’habitants du quartier pour que les projets répondent aux vrais besoins.',
    ],
    G1: [
      'Une entreprise a un poste à pourvoir et deux candidats tout aussi qualifiés : un citoyen du pays et un étranger.',
      'Embaucher le citoyen du pays en priorité pour soutenir l’emploi local.',
      'Choisir le meilleur candidat sans tenir compte de sa nationalité.',
    ],
    G2: [
      'Lors d’une épidémie mondiale, un médicament vital se trouve en quantité très limitée.',
      'Envoyer le médicament dans les pays les plus durement touchés où des gens meurent, sans regarder les frontières.',
      'Garder d’abord les doses nécessaires pour les citoyens de son propre pays avant d’en envoyer ailleurs.',
    ],
    G3: [
      'Un accord mondial sur le climat impose de réduire la pollution, mais il va alourdir les coûts des usines locales.',
      'Signer l’accord, car pour lutter contre la pollution mondiale, tous les pays doivent s’entraider.',
      'Refuser de signer afin de protéger les emplois du pays et rester maître de ses propres lois.',
    ],
    E1: [
      'Une personne très riche décède et laisse une fortune de plusieurs millions à ses enfants.',
      'Prélever un impôt sur l’héritage important pour financer les écoles publiques, les hôpitaux et les parcs.',
      'Laisser la famille garder la quasi-totalité de l’argent, car les parents ont le droit de transmettre leurs biens.',
    ],
    E2: [
      'Une équipe termine un projet difficile. Tout le monde a aidé, mais deux personnes ont fait le gros du travail.',
      'Partager la prime équitablement entre tous les membres pour valoriser l’esprit d’équipe.',
      'Donner la plus grosse partie de la prime aux deux personnes qui ont porté le projet.',
    ],
    E3: [
      'Une grande université dispose de quelques bourses d’études entièrement gratuites.',
      'Les attribuer aux étudiants ayant obtenu les meilleures notes et les scores les plus élevés.',
      'Les accorder à des étudiants brillants issus de familles modestes qui n’ont pas les moyens d’étudier.',
    ],
    T1: [
      'Les voitures sans chauffeur marchent bien sur circuit fermé, mais ont peu roulé dans les embouteillages d’une vraie ville.',
      'Lancer des essais en ville dès maintenant pour accélérer le progrès technique.',
      'Poursuivre les essais sur circuit fermé jusqu’à ce que leur sécurité soit totalement prouvée.',
    ],
    T2: [
      'Un tuteur informatique doté d’intelligence artificielle améliore les notes, mais on ignore ses effets à long terme sur l’apprentissage.',
      'Attendre plusieurs années d’études avant de l’introduire dans les salles de classe.',
      'L’utiliser immédiatement à l’école pour que les élèves en profitent dès maintenant.',
    ],
    T3: [
      'La viande cultivée en laboratoire a obtenu les autorisations de base. Faut-il autoriser sa vente en supermarché ?',
      'Oui, la vendre avec un étiquetage très clair et laisser les clients choisir librement.',
      'Non, attendre que des études sur plusieurs années confirment l’absence d’effets secondaires.',
    ],
  }),

  ru: toQuestionTranslations({
    M1: [
      'Жилье в вашем городе стало слишком дорогим для многих людей. Как лучше всего решить эту проблему?',
      'Упростить строительные правила, чтобы частные компании быстрее строили больше домов.',
      'Выделить бюджетные деньги на строительство доступного жилья для тех, кто в нем нуждается.',
    ],
    M2: [
      'Пригородные поезда постоянно опаздывают и переполнены. Как нужно наладить их работу?',
      'Передать все поезда единой государственной компании, которая будет отвечать перед гражданами.',
      'Разрешить конкурировать частным компаниям, чтобы снизить цены и улучшить обслуживание.',
    ],
    M3: [
      'Скоростной интернет в вашем районе стоит дорого и часто обрывается. Что нужно сделать?',
      'Считать интернет базовой коммунальной услугой, как воду или свет, и создать городскую общественную сеть.',
      'Снизить налоги и ограничения, чтобы частные провайдеры конкурировали и сбивали цены.',
    ],
    A1: [
      'Мирная акция протеста перекрыла главное шоссе в утренний час пик.',
      'Быстро освободить дорогу, чтобы люди могли проехать на работу, а скорая помощь — к больным.',
      'Дать людям продолжить марш: чтобы протест услышали, он должен привлекать внимание.',
    ],
    A2: [
      'Городской дом культуры организует выступление артиста, чей номер глубоко задевает многих жителей.',
      'Не отменять выступление: творчество должно оставаться свободным, даже если кому-то оно не нравится.',
      'Отменить выступление: деньги налогоплательщиков не должны идти на оскорбительные шоу.',
    ],
    A3: [
      'Мэрия хочет поставить камеры с распознаванием лиц на оживленных площадях для поиска подозреваемых.',
      'Запретить или ограничить такие камеры, чтобы за обычными людьми не следили на каждом шагу.',
      'Установить камеры, чтобы помочь полиции предотвращать преступления и ловить опасных нарушителей.',
    ],
    I1: [
      'Государственная служба здравоохранения назвала пищевую добавку безопасной, но критики не согласны.',
      'Довериться решению ведомства и положиться на официальных ученых и государственные проверки.',
      'Подождать, пока независимые ученые вне госслужбы не проведут свои тесты и не подтвердят безопасность.',
    ],
    I2: [
      'Два кандидата обещают навести порядок в работе мэрии. За кого бы вы проголосовали?',
      'За человека со стороны, не связанного с системой и готового бросить вызов чиновникам.',
      'За опытного управленца, который знает государственную систему изнутри и умеет добиваться результата.',
    ],
    I3: [
      'Городское ведомство благоустройства постоянно срывает сроки строительства. Что нужно сделать?',
      'Нанять профессиональных директоров с многолетним стажем управления госучреждениями.',
      'Передать контроль совету местных жителей, чтобы проекты строились под реальные нужды людей.',
    ],
    G1: [
      'В компании открыта вакансия, и есть два одинаково сильных кандидата: местный гражданин и иностранец.',
      'Взять на работу своего гражданина, чтобы поддержать рынок труда в родной стране.',
      'Выбрать лучшего кандидата по навыкам: национальность не должна влиять на прием на работу.',
    ],
    G2: [
      'Во время мировой эпидемии жизненно важное лекарство оказалось в остром дефиците.',
      'Отправлять лекарство в самые пострадавшие страны, где умирают люди, невзирая на границы.',
      'Сначала обеспечить лекарством жителей своей страны, и лишь затем отправлять его за рубеж.',
    ],
    G3: [
      'Международное соглашение по климату требует снизить выбросы, но это повысит расходы местных фабрик.',
      'Подписать договор: борьба с загрязнением планеты требует совместных усилий всех стран.',
      'Отказаться от подписания, чтобы защитить рабочие места в стране и не отдавать право решать свои законы.',
    ],
    E1: [
      'Богатый человек умирает и оставляет детям состояние в миллионы долларов.',
      'Ввести солидный налог на наследство, чтобы на эти деньги строить школы, больницы и парки.',
      'Оставить почти все деньги семье: родители имеют право передавать заработанное своим детям.',
    ],
    E2: [
      'Рабочая группа успешно завершила сложный проект. Участвовали все, но двое тянули на себе основную нагрузку.',
      'Поделить премию поровну между всеми участниками, чтобы поддержать командный дух.',
      'Отдать большую часть премии тем двоим сотрудникам, которые сделали почти всю работу.',
    ],
    E3: [
      'Ведущий университет выделил несколько бесплатных стипендий для новых студентов.',
      'Отдать их студентам с самыми высокими баллами за экзамены и отличными оценками.',
      'Отдать их способным студентам из малоимущих семей, у которых нет денег на оплату учебы.',
    ],
    T1: [
      'Беспилотные машины отлично ездят на полигонах, но мало тестировались в реальных пробках.',
      'Начать тестировать их на улицах города уже сейчас, чтобы новая технология быстрее развивалась.',
      'Держать их на закрытых полигонах до тех пор, пока безопасность не будет доказана на все сто процентов.',
    ],
    T2: [
      'Программа с искусственным интеллектом помогает школьникам учиться лучше, но ее влияние на привычку мыслить еще не изучено.',
      'Подождать результатов многолетних исследований, прежде чем внедрять ее в школьные классы.',
      'Внедрить программу в школы прямо сейчас, чтобы дети получали пользу в учебе уже сегодня.',
    ],
    T3: [
      'Искусственное мясо из лаборатории прошло базовые проверки на безопасность. Стоит ли пускать его в магазины?',
      'Да, разрешить продажу с понятной маркировкой, пусть покупатели сами решают, брать его или нет.',
      'Нет, подождать результатов многолетних медицинских исследований, доказывающих отсутствие побочных эффектов.',
    ],
  }),

  ja: toQuestionTranslations({
    M1: [
      'あなたの街で住宅の価格が高騰し、多くの人が住まいを持てなくなっています。どう対策すべきですか？',
      '建築規制を緩和して、民間業者が素早く住宅をたくさん建てられるようにする。',
      '税金を投入して、困っている人のために手頃な家賃の公営住宅を整備する。',
    ],
    M2: [
      '地域の鉄道で遅延が日常茶飯事になり、車内も混雑しすぎています。どのように運営すべきですか？',
      '公共機関が一括して運行を管理し、利用者の声に責任を持って応える体制にする。',
      '民間企業を競わせることで、運賃の引き下げやサービスの改善を促す。',
    ],
    M3: [
      'お住まいの地域で高速ネット回線の料金が高く、接続も途切れがちです。どうすべきですか？',
      'ネット回線を水道や電気と同じ公共インフラと位置づけ、自治体が公営回線を整備する。',
      '参入規制や手続きを簡素化し、民間企業が価格競争して料金が下がるようにする。',
    ],
    A1: [
      '平穏な抗議デモの行進により、朝の通勤ラッシュ時に主要な幹線道路がふさがれました。',
      '通勤者や救急車が通れるよう、速やかに道路の封鎖を解除させる。',
      '抗議の声を社会に届けるには一定の混乱もやむを得ないため、行進の継続を認める。',
    ],
    A2: [
      '公立の文化施設が、地域住民の多くから強い批判を浴びているパフォーマーの公演を予定しています。',
      '不快に感じる人がいても表現の自由を守るため、予定通り公演を行わせる。',
      '公金を使って不快な表現を後押しすべきではないため、公演を中止する。',
    ],
    A3: [
      '市が容疑者の追跡のため、人通りの多い広場に顔認識カメラを設置しようとしています。',
      '一般市民が街中で常時監視されるのを防ぐため、カメラの設置を禁止または制限する。',
      '犯罪を未然に防ぎ危険な犯人を捕まえるため、警察の捜査に役立つカメラを導入する。',
    ],
    I1: [
      '国の保健当局がある食品成分を「安全」と発表しましたが、一部の専門家が疑問を呈しています。',
      '国の公的な審査機関や科学者の判断を信じて、当局の見解を受け入れる。',
      '政府から独立した民間の研究機関が安全性について再検証するまで、判断を保留する。',
    ],
    I2: [
      '二人の候補者が市政の改善を訴えています。あなたはどちらのタイプを信頼しますか？',
      'しがらみがなく、お役所仕事や官僚主義を恐れずに打ち破ってくれる外部出身者。',
      '行政の仕組みを熟知しており、役所の組織を動かして確実に仕事を前に進められる経験者。',
    ],
    I3: [
      '市の事業を担当する公的機関が、計画の遅れを何度も繰り返しています。どう組織を改めるべきですか？',
      '行政マネジメントの経験が豊富な専門家をトップに据え、業務体制を立て直す。',
      '地元住民でつくる委員会に監督権限を渡し、地域の生の声に合った事業計画に変えさせる。',
    ],
    G1: [
      'ある会社が一人を採用しようとしており、同等に優秀な自国民と外国人の二人が残っています。',
      '自国の雇用を守り地域社会を支えるため、自国の市民を優先して採用する。',
      '国籍は仕事に関係ないため、個人の能力や実績だけを見て判断する。',
    ],
    G2: [
      '世界的な感染症の流行により、命を救う医薬品の供給が極度に不足しています。',
      '国境に関係なく、感染率が高く命の危険が差し迫っている国へ優先して医薬品を配分する。',
      '政府の第一の責任は自国民を守ることなので、まず自国分の医薬品を確保する。',
    ],
    G3: [
      '国際的な環境条約で排出削減が義務づけられ、国内工場の負担が増えることになりました。',
      '地球規模の環境問題は各国の協力が不可欠なので、条約に署名して責任を果たす。',
      '国内の雇用を守り国の主権を保つため、義務を伴う条約への署名は見送る。',
    ],
    E1: [
      'ある富豪が亡くなり、子どもたちに巨額の遺産と不動産が遺されました。',
      '高額の相続税を課し、その税金を公立学校や公園、公共サービスの充実に充てる。',
      '親が汗水流して稼いだ財産を家族に残す権利を守るため、税金を抑えて大半を相続させる。',
    ],
    E2: [
      'チームが大変な仕事を成功させました。全員が協力しましたが、特に二人が大半の重責を担いました。',
      'チームワークと連帯感を大事にするため、報奨金は全員に均等に分配する。',
      '特に重い役割を果たした二人の労力に報いるため、報奨金の大半をその二人に配分する。',
    ],
    E3: [
      '有名大学が、学費が全額免除になる奨学金をわずかな人数分だけ用意しました。',
      '学力や試験の成績が最も優秀だったトップの学生たちに授与する。',
      '経済的に苦しく自力では進学できない、優秀で貧しい家庭の学生たちに授与する。',
    ],
    T1: [
      '自動運転車はテストコースでは順調ですが、実際の街中の渋滞での走行データはまだ十分ではありません。',
      '技術の開発を急ぐため、監視体制を敷いた上で今すぐ公道での実証実験を始める。',
      '安全性が完全に証明されるまでは、一般の公道に出さず閉鎖コースで検証を続ける。',
    ],
    T2: [
      'AI学習ツールが生徒のテストの点数を伸ばしていますが、長年の学習習慣に与える影響はわかっていません。',
      '長期的な影響が研究で明らかになるまでは、教室への本格導入を見送る。',
      '目に見える学習成果が出ているのだから、今すぐ学校の授業に取り入れる。',
    ],
    T3: [
      '人工培養肉が国の基本的な安全基準をクリアしました。一般のスーパーで販売すべきですか？',
      '表示をわかりやすく明記した上で販売を許可し、買うかどうかは消費者の判断に任せる。',
      '長期的な健康への影響について数年間の追跡調査で無害と確認されるまで、販売は見送る。',
    ],
  }),

  fa: toQuestionTranslations({
    M1: [
      'هزینه مسکن در شهر شما خیلی بالا رفته و بسیاری از مردم توان پرداخت آن را ندارند. بهترین راهکار چیست؟',
      'قوانین و مجوزهای ساخت‌وساز را آسان‌تر کنید تا شرکت‌های خصوصی سریع‌تر خانه بسازند.',
      'با بودجه دولتی، خانه‌های ارزان‌قیمت برای افراد نیازمند ساخته شود.',
    ],
    M2: [
      'قطارهای شهری مدام تأخیر دارند و بیش از حد شلوغ هستند. چگونه باید اداره شوند؟',
      'یک سازمان دولتی واحد قطارها را اداره کند تا در برابر مردم پاسخگو باشد.',
      'به شرکت‌های خصوصی اجازه رقابت بدهید تا قیمت‌ها پایین بیاید و کیفیت خدمات بهتر شود.',
    ],
    M3: [
      'اینترنت پرسرعت در منطقه شما گران است و مدام قطع و وصل می‌شود. چاره چیست؟',
      'اینترنت مثل آب و برق یک نیاز عمومی است و شهرداری باید شبکه اینترنت ارزان برای همه بسازد.',
      'قوانین و عوارض را کم کنید تا شرکت‌های خصوصی بتوانند با هم رقابت کنند و قیمت را کاهش دهند.',
    ],
    A1: [
      'یک راهپیمایی اعتراضی و مسالمت‌آمیز، اتوبان اصلی شهر را در ساعات شلوغ صبح بسته است.',
      'جاده را سریع باز کنید تا مسیر رفت‌وآمد مردم و خودروهای امدادی باز شود.',
      'بگذارید اعتراض ادامه پیدا کند، چون اعتراض واقعی تا اختلال ایجاد نکند صدایش شنیده نمی‌شود.',
    ],
    A2: [
      'یک فرهنگسرای دولتی، برنامه‌ای از هنرمندی دارد که اجرای او باعث رنجش و اعتراض خیلی از مردم محله شده است.',
      'برنامه برگزار شود؛ هنرمندان باید آزاد باشند حتی اگر عده‌ای از اثرشان ناراحت شوند.',
      'برنامه لغو شود؛ پول بیت‌المال و مالیات مردم نباید خرج برنامه‌های توهین‌آمیز شود.',
    ],
    A3: [
      'شهرداری می‌خواهد در میدان‌های شلوغ شهر دوربین‌های تشخیص چهره نصب کند تا مظنونان را ردگیری کند.',
      'این دوربین‌ها ممنوع یا محدود شوند تا مردم عادی مدام در فضای عمومی زیر نظر نباشند.',
      'دوربین‌ها نصب شوند تا به پلیس در جلوگیری از جرم و دستگیری مجرمان خطرناک کمک کنند.',
    ],
    I1: [
      'اداره بهداشت رسمی می‌گوید یک ماده غذایی کاملاً سالم است، اما منتقدان شک دارند.',
      'به تصمیم اداره بهداشت اعتماد کنید و به دانشمندان رسمی و بازرسی‌های قانونی تکیه کنید.',
      'دست نگه دارید تا دانشمندان مستقل بیرون از دولت هم سلامت آن را آزمایش و تأیید کنند.',
    ],
    I2: [
      'دو داوطلب قول داده‌اند اداره شهر را متحول کنند. به کدام‌یک بیشتر اعتماد دارید؟',
      'یک چهره مستقل بیرون از گود که به روابط قبلی وابسته نیست و ترسی از برهم‌زدن روال‌ها ندارد.',
      'یک مدیر باسابقه و باتجربه که سازوکار سیستم را می‌شناسد و می‌داند چگونه کارها را پیش ببرد.',
    ],
    I3: [
      'یکی از سازمان‌های عمرانی شهر مدام پروژه‌ها را با تأخیر و ناموفق تحویل می‌دهد. چه تغییری لازم است؟',
      'مدیران حرفه‌ای با سال‌ها سابقه مدیریت دولتی برای اداره سازمان استخدام شوند.',
      'اداره امور به شورایی از اهالی محل سپرده شود تا طرح‌ها طبق نیاز واقعی مردم اجرا شوند.',
    ],
    G1: [
      'یک شرکت برای یک فرصت شغلی، دو داوطلب با تخصص کاملاً برابر دارد: یکی هم‌وطن و دیگری خارجی.',
      'اولویت با هم‌وطن است تا از اشتغال کارگران و جوانان کشور حمایت شود.',
      'بهترین و شایسته‌ترین فرد انتخاب شود؛ در استخدام، ملیت نباید ملاک باشد.',
    ],
    G2: [
      'در زمان شیوع یک بیماری جهانی، دارویی نجات‌بخش با کمبود شدید مواجه شده است.',
      'دارو بدون توجه به مرزها، به کشورهایی فرستاده شود که بیماری در آن‌ها شدیدتر است و مردم تلف می‌شوند.',
      'ابتدا داروی کافی برای مردم کشور خودمان ذخیره شود، بعد در صورت امکان به بقیه کمک شود.',
    ],
    G3: [
      'یک پیمان بین‌المللی برای محیط‌زیست همه کشورها را ملزم به کاهش آلودگی می‌کند، اما این کار هزینه کارخانه‌های داخلی را بالا می‌برد.',
      'پیمان را امضا کنید؛ مهار بحران‌های محیط‌زیستی نیازمند همکاری و فداکاری همه کشورهاست.',
      'آن را امضا نکنید تا شغل‌های داخلی از بین نروند و کشور اختیار قوانین خودش را حفظ کند.',
    ],
    E1: [
      'فردی ثروتمند فوت کرده و میلیون‌ها دلار پول و ملک برای فرزندانش باقی گذاشته است.',
      'مالیات بر ارث سنگینی گرفته شود تا این پول خرج مدارس دولتی، بیمارستان‌ها و خدمات عمومی شود.',
      'بگذارید تقریباً همه ارث به فرزندان برسد، چون والدین حق دارند حاصل زحمت خود را به خانواده‌شان بدهند.',
    ],
    E2: [
      'یک تیم کاری، پروژه‌ای سخت را به پایان رسانده است. همه کمک کردند، اما دو نفر بیشتر زحمت کشیدند.',
      'پاداش به طور کاملاً مساوی بین همه تقسیم شود تا کار تیمی تقویت شود.',
      'بخش عمده پاداش به همان دو نفری داده شود که بیشترین بار پروژه را به دوش کشیدند.',
    ],
    E3: [
      'یک دانشگاه معتبر چند بورسیه تحصیلی رایگان برای ورودی‌های جدید دارد.',
      'بورسیه‌ها فقط به داوطلبانی با بالاترین نمره‌ها و رتبه‌های درسی داده شود.',
      'بورسیه‌ها به دانش‌آموزان بااستعدادی از خانواده‌های کم‌درآمد داده شود که توان پرداخت هزینه تحصیل ندارند.',
    ],
    T1: [
      'خودروهای بدون راننده در پیست‌های آزمایشی خوب کار کرده‌اند، اما در ترافیک شهری کمتر آزمایش شده‌اند.',
      'آزمایش آن‌ها در خیابان‌های شهر شروع شود تا فناوری زودتر پیشرفت کند.',
      'تا وقتی ایمنی آن‌ها در پیست‌های بسته ۱۰۰٪ ثابت نشده، وارد خیابان نشوند.',
    ],
    T2: [
      'یک معلم هوش مصنوعی باعث افزایش نمرات دانش‌آموزان شده، اما معلوم نیست در درازمدت چه اثری روی عادت یادگیری دارد.',
      'تا زمانی که نتایج پژوهش‌های بلندمدت روشن نشده، وارد کلاس‌های درس نشود.',
      'فوراً وارد کلاس‌ها شود تا دانش‌آموزان همین حالا از مزایای تحصیلی آن بهره‌مند شوند.',
    ],
    T3: [
      'گوشت تولیدشده در آزمایشگاه استانداردهای اولیه سلامت را گرفته است. آیا باید در فروشگاه‌ها فروخته شود؟',
      'بله، با برچسب مشخص به فروش برسد و اجازه دهیم خود خریداران تصمیم بگیرند.',
      'خیر، تا وقتی پژوهش‌های چندساله نشان نداده‌اند که در بلندمدت هیچ عارضه‌ای ندارد، نباید فروخته شود.',
    ],
  }),
};

export function getQuestionCopy(
  question: Question,
  language: QuestionLanguage,
): QuestionTranslation {
  return QUESTION_TRANSLATIONS[language]?.[question.id] ?? {
    prompt: question.prompt,
    choices: question.choices,
  };
}

export function isQuestionLanguageRtl(language: QuestionLanguage): boolean {
  return language === 'ar' || language === 'fa';
}
