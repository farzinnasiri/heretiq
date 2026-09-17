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
      'Los costos de la vivienda se han vuelto inasequibles para muchos residentes de tu ciudad. ¿Qué enfoque debería ser prioritario?',
      'Relajar las restricciones de zonificación para que los constructores privados amplíen la oferta de vivienda.',
      'Invertir fondos públicos en desarrollar viviendas sociales y municipales sin fines de lucro.',
    ],
    M2: [
      'La red ferroviaria regional sufre retrasos persistentes y problemas de capacidad. ¿Cómo debería gestionarse?',
      'Una autoridad unificada de transporte público que coordine el servicio y mantenga la rendición de cuentas pública.',
      'Operadores privados en competencia para impulsar la eficiencia y dar a los pasajeros opciones como consumidores.',
    ],
    M3: [
      'El internet de alta velocidad en tu zona es caro y el servicio es irregular. ¿Cuál es la mejor solución?',
      'Tratar el acceso a internet como un servicio público y construir una red municipal para todos los residentes.',
      'Reducir las barreras regulatorias para que proveedores privados entren al mercado y compitan en precio.',
    ],
    A1: [
      'Una marcha pacífica de protesta bloquea una autopista importante durante el trayecto matutino.',
      'Despejar la vía rápidamente para restablecer el transporte público y el acceso de emergencia.',
      'Permitir que continúe la manifestación, reconociendo que una protesta eficaz suele causar interrupciones.',
    ],
    A2: [
      'Un centro cultural financiado con fondos públicos programa a un artista cuya rutina provoca una fuerte protesta comunitaria.',
      'Permitir que el espectáculo siga adelante, protegiendo la libertad artística de vetos públicos.',
      'Cancelar el espectáculo para garantizar que los recursos públicos no se usen para promover contenido ofensivo.',
    ],
    A3: [
      'Las autoridades municipales proponen instalar cámaras automatizadas de reconocimiento facial en plazas concurridas para rastrear sospechosos.',
      'Restringir la tecnología para proteger a la ciudadanía de una vigilancia constante en la vida cotidiana.',
      'Implementar la tecnología para ayudar a la policía a prevenir delitos y localizar a delincuentes peligrosos.',
    ],
    I1: [
      'Un regulador nacional de salud declara seguro un ingrediente, pero sus críticos plantean dudas.',
      'Aceptar las conclusiones del regulador y confiar en los estándares científicos establecidos y la revisión institucional.',
      'No respaldarlo hasta que investigadores independientes fuera de la agencia repitan y confirmen la seguridad.',
    ],
    I2: [
      'Dos candidatos proponen reformas similares para mejorar la administración pública. ¿Qué enfoque prefieres?',
      'Una persona independiente y externa, sin las limitaciones de las rutinas establecidas y dispuesta a desafiar la burocracia.',
      'Un administrador con experiencia y conocimiento institucional, que sepa desenvolverse en los procesos gubernamentales.',
    ],
    I3: [
      'Una agencia pública de desarrollo incumple repetidamente sus objetivos de proyectos. ¿Cómo debería reestructurarse su dirección?',
      'Nombrar administradores de carrera expertos en gestión pública para reorganizar las operaciones.',
      'Transferir la supervisión a un consejo de residentes locales para ajustar las decisiones a sus necesidades.',
    ],
    G1: [
      'Un empleador tiene un puesto vacante con dos finalistas igualmente cualificados: una persona ciudadana y otra extranjera.',
      'Dar prioridad a la persona ciudadana para apoyar el empleo nacional y las comunidades locales.',
      'Elegir únicamente según las cualificaciones individuales y considerar irrelevante la nacionalidad para el puesto.',
    ],
    G2: [
      'Un tratamiento médico esencial está muy limitado durante un brote internacional. ¿Cómo deberían distribuirse los suministros?',
      'Distribuirlos internacionalmente según dónde sean más graves las necesidades sanitarias y las tasas de infección.',
      'Abastecer primero a la población nacional, cumpliendo el deber principal del gobierno hacia sus ciudadanos.',
    ],
    G3: [
      'Un acuerdo ambiental internacional exige reducir emisiones, lo que aumentará los costos de los fabricantes nacionales.',
      'Comprometerse con el tratado, reconociendo que los problemas ambientales globales requieren obligaciones compartidas.',
      'Rechazar compromisos vinculantes para proteger la competitividad industrial nacional y conservar la autonomía del país.',
    ],
    E1: [
      'Un empresario adinerado muere y deja un patrimonio considerable a sus hijos.',
      'Aplicar un impuesto sucesorio importante para reducir la concentración de riqueza e invertir en oportunidades públicas.',
      'Permitir que la familia herede el patrimonio con impuestos mínimos, protegiendo la propiedad privada y el sustento familiar.',
    ],
    E2: [
      'Un equipo completa con éxito un proyecto exigente. Todos contribuyeron, pero algunas personas asumieron mucha más responsabilidad.',
      'Repartir el fondo de bonificaciones por igual para reforzar la colaboración y la responsabilidad compartida.',
      'Asignar la mayor parte de la bonificación a quienes lideraron para reconocer su esfuerzo extraordinario.',
    ],
    E3: [
      'Una universidad importante dispone de un número limitado de becas que cubren toda la matrícula.',
      'Concederlas estrictamente por logros académicos y resultados de exámenes para reconocer la excelencia intelectual.',
      'Concederlas a estudiantes con talento y menos recursos para impulsar la movilidad socioeconómica.',
    ],
    T1: [
      'Los vehículos autónomos de pasajeros funcionan de forma fiable en pruebas cerradas, pero hay pocos datos en el tráfico urbano real.',
      'Lanzar un programa piloto supervisado en calles públicas para acelerar las pruebas y el despliegue reales.',
      'Seguir probando en entornos controlados hasta verificar los niveles de seguridad antes de usar las calles públicas.',
    ],
    T2: [
      'Un asistente educativo de IA mejora los resultados de los exámenes, pero no se ha estudiado su impacto a largo plazo en los hábitos de aprendizaje.',
      'Esperar a adoptar la herramienta en clase hasta que estudios a largo plazo evalúen posibles efectos no deseados.',
      'Integrarla ya en las aulas para aprovechar las mejoras inmediatas y seguir el progreso del alumnado.',
    ],
    T3: [
      'La carne cultivada en laboratorio cumple los requisitos regulatorios básicos. ¿Cuándo debería estar disponible para consumidores?',
      'Aprobar su venta comercial con un etiquetado claro para que cada consumidor decida por sí mismo.',
      'No aprobarla hasta que estudios nutricionales y sanitarios de varios años confirmen su seguridad a largo plazo.',
    ],
  }),

  zh: toQuestionTranslations({
    M1: [
      '你所在城市的住房成本已让许多居民难以负担。哪种做法应优先？',
      '放宽分区限制，让私人开发商扩大住房供应。',
      '投入公共资金建设社会住房和非营利性市政住房。',
    ],
    M2: [
      '区域铁路网络长期延误且运力不足。应如何管理？',
      '建立统一的公共交通机构来协调服务并接受公众问责。',
      '让私营运营商相互竞争，以提高效率并给乘客更多选择。',
    ],
    M3: [
      '你所在地区的高速网络价格高且服务不稳定。最佳解决办法是什么？',
      '把网络接入视为公共事业，为所有居民建设市政网络。',
      '降低监管门槛，让私营供应商进入市场并以价格竞争。',
    ],
    A1: [
      '一场和平的抗议游行在早高峰期间堵住了主要高速公路。',
      '迅速清理道路，恢复公共交通和紧急通行。',
      '允许示威继续，因为有效的抗议往往会造成干扰。',
    ],
    A2: [
      '一家由公共资金支持的文化中心安排了一位表演者，其节目引发社区强烈抗议。',
      '允许演出继续，保护艺术自由不受公众否决。',
      '取消演出，确保公共资源不被用于推广冒犯性内容。',
    ],
    A3: [
      '市政府提议在繁忙的公共广场安装自动面部识别摄像头来追踪嫌疑人。',
      '限制这项技术，保护公民免受日常生活中的全面监控。',
      '部署这项技术，帮助执法部门预防犯罪并找到危险罪犯。',
    ],
    I1: [
      '国家卫生监管机构宣布一种成分安全，但批评者提出了疑问。',
      '接受监管机构的结论，相信既定的科学标准和机构审查。',
      '在机构外的独立研究人员重复并确认安全之前，不予支持。',
    ],
    I2: [
      '两位候选人提出相似的改革来改善公共管理。你更倾向哪种做法？',
      '选择不受既有惯例约束、愿意挑战官僚体系的独立外部人士。',
      '选择了解机构运作、熟悉政府流程的有经验管理者。',
    ],
    I3: [
      '一家公共发展机构屡次未能完成项目目标。应如何重组其领导层？',
      '任命精通公共管理的职业行政人员来重组运作。',
      '把监督权交给当地居民委员会，让决定符合居民需要。',
    ],
    G1: [
      '一名雇主有一个职位，两位候选人资历相同：一位本国公民和一位外国申请者。',
      '优先考虑本国公民，以支持国内就业和当地社区。',
      '完全依据个人资历选择，认为国籍与职位无关。',
    ],
    G2: [
      '国际疫情暴发期间，一种关键医疗疗法供应极其有限。应如何分配？',
      '按照各地的医疗需求和感染率严重程度，在国际间分配供应。',
      '先满足本国人口，履行政府对本国公民的首要责任。',
    ],
    G3: [
      '一项国际环境协议要求减排，这会提高本国制造商的成本。',
      '加入协议，因为全球环境挑战需要各国共同承担义务。',
      '拒绝有约束力的承诺，以保护国内工业竞争力并保留国家自主权。',
    ],
    E1: [
      '一位富有的企业主去世，把一大笔遗产留给了子女。',
      '征收较高的遗产税，减少财富集中并投资公共机会。',
      '让家人以最低税负继承遗产，保护私有财产和家庭保障。',
    ],
    E2: [
      '一个团队成功完成了艰巨项目。所有成员都做出了贡献，但少数人承担了大得多的责任。',
      '平均分配团队奖金，以加强协作和共同归属感。',
      '把最大份额给主要贡献者，以认可其超出常规的努力。',
    ],
    E3: [
      '一所重点大学只有少量全额学费奖学金。',
      '严格按学业成绩和考试表现颁发，以奖励学术优秀。',
      '颁发给来自低收入家庭的优秀学生，促进社会经济流动。',
    ],
    T1: [
      '自动驾驶接驳车在封闭测试中表现可靠，但在真实城市交通中的数据有限。',
      '在公共道路上启动受监控的试点，加快真实环境测试和部署。',
      '继续在受控环境中测试，确认安全指标后再上公共道路。',
    ],
    T2: [
      '互动式人工智能学习助手提高了学生考试成绩，但其对长期学习习惯的影响尚未研究。',
      '等长期教育研究评估潜在的意外影响后，再用于课堂。',
      '现在就融入课堂，获取即时收益并跟踪学生进步。',
    ],
    T3: [
      '实验室培育的肉达到基本监管标准。应何时向消费者提供？',
      '在清晰标注的前提下批准商业销售，让消费者自行选择。',
      '等多年的营养和健康研究确认长期安全后再批准上市。',
    ],
  }),

  hi: toQuestionTranslations({
    M1: [
      'आपके शहर में आवास की लागत बहुत से निवासियों की पहुंच से बाहर हो गई है। किस उपाय को प्राथमिकता मिलनी चाहिए?',
      'ज़ोनिंग प्रतिबंधों में ढील देकर निजी निर्माताओं को आवास की आपूर्ति बढ़ाने देना।',
      'सामाजिक और गैर-लाभकारी नगर आवास बनाने में सार्वजनिक धन लगाना।',
    ],
    M2: [
      'क्षेत्रीय रेल नेटवर्क में लगातार देरी और क्षमता की समस्याएं हैं। इसका प्रबंधन कैसे होना चाहिए?',
      'सेवा का समन्वय और सार्वजनिक जवाबदेही बनाए रखने वाला एकीकृत सार्वजनिक परिवहन प्राधिकरण।',
      'दक्षता बढ़ाने और यात्रियों को विकल्प देने वाले प्रतिस्पर्धी निजी संचालक।',
    ],
    M3: [
      'आपके क्षेत्र में तेज़ इंटरनेट महंगा है और सेवा असंगत है। सबसे अच्छा उपाय क्या है?',
      'इंटरनेट पहुंच को सार्वजनिक सुविधा मानकर सभी निवासियों के लिए नगर नेटवर्क बनाना।',
      'नियामक बाधाएं घटाकर निजी प्रदाताओं को बाजार में आने और कीमत पर प्रतिस्पर्धा करने देना।',
    ],
    A1: [
      'सुबह के आवागमन के दौरान शांतिपूर्ण विरोध मार्च एक प्रमुख राजमार्ग को रोक देता है।',
      'सार्वजनिक परिवहन और आपातकालीन पहुंच बहाल करने के लिए सड़क तुरंत खाली कराना।',
      'प्रदर्शन जारी रहने देना, क्योंकि प्रभावी विरोध अक्सर व्यवधान पैदा करता है।',
    ],
    A2: [
      'सार्वजनिक धन से चलने वाला सांस्कृतिक केंद्र ऐसे कलाकार का कार्यक्रम रखता है जिसके प्रदर्शन पर समुदाय का तीखा विरोध है।',
      'कार्यक्रम होने देना और कला की स्वतंत्रता को सार्वजनिक वीटो से बचाना।',
      'कार्यक्रम रद्द करना ताकि सार्वजनिक संसाधनों से आपत्तिजनक सामग्री को बढ़ावा न मिले।',
    ],
    A3: [
      'शहर के अधिकारी संदिग्धों पर नज़र रखने के लिए व्यस्त सार्वजनिक चौकों में स्वचालित चेहरा-पहचान कैमरे लगाने का प्रस्ताव देते हैं।',
      'रोज़मर्रा की व्यापक निगरानी से नागरिकों की रक्षा करने के लिए तकनीक सीमित करना।',
      'अपराध रोकने और खतरनाक अपराधियों को ढूंढने में कानून प्रवर्तन की मदद के लिए तकनीक लगाना।',
    ],
    I1: [
      'राष्ट्रीय स्वास्थ्य नियामक किसी घटक को सुरक्षित घोषित करता है, लेकिन आलोचक सवाल उठाते हैं।',
      'नियामक के निष्कर्ष स्वीकार करना और स्थापित वैज्ञानिक मानकों व संस्थागत समीक्षा पर भरोसा करना।',
      'एजेंसी से बाहर के स्वतंत्र शोधकर्ता सुरक्षा की दोबारा पुष्टि करें, तब तक समर्थन रोकना।',
    ],
    I2: [
      'सार्वजनिक प्रशासन सुधारने के लिए दो उम्मीदवार समान सुधार प्रस्तावित करते हैं। आप किस दृष्टिकोण को पसंद करेंगे?',
      'ऐसा स्वतंत्र बाहरी व्यक्ति जो स्थापित तरीकों से बंधा न हो और नौकरशाही को चुनौती दे।',
      'ऐसा अनुभवी प्रशासक जो संस्थागत ज्ञान रखता हो और सरकारी प्रक्रियाओं को समझता हो।',
    ],
    I3: [
      'एक सार्वजनिक विकास एजेंसी बार-बार अपने परियोजना लक्ष्य पूरे नहीं कर पाती। उसके नेतृत्व का पुनर्गठन कैसे होना चाहिए?',
      'संचालन व्यवस्थित करने के लिए सार्वजनिक प्रबंधन के विशेषज्ञ करियर प्रशासक नियुक्त करना।',
      'निवासियों की जरूरतों के अनुरूप निर्णय लेने के लिए निगरानी स्थानीय समुदाय परिषद को देना।',
    ],
    G1: [
      'एक नियोक्ता के पास दो समान रूप से योग्य अंतिम उम्मीदवार हैं: एक देश का नागरिक और एक विदेशी आवेदक।',
      'राष्ट्रीय रोजगार और स्थानीय समुदायों के समर्थन के लिए देश के नागरिक को प्राथमिकता देना।',
      'केवल व्यक्तिगत योग्यता के आधार पर चुनना और राष्ट्रीयता को पद के लिए अप्रासंगिक मानना।',
    ],
    G2: [
      'अंतरराष्ट्रीय प्रकोप के दौरान एक महत्वपूर्ण चिकित्सा उपचार की आपूर्ति बहुत सीमित है। इसे कैसे बांटना चाहिए?',
      'जहां स्वास्थ्य जरूरतें और संक्रमण दर सबसे गंभीर हों, वहां के आधार पर देशों में आपूर्ति बांटना।',
      'पहले देश की आबादी को आपूर्ति देना, नागरिकों के प्रति सरकार का प्राथमिक कर्तव्य निभाना।',
    ],
    G3: [
      'एक अंतरराष्ट्रीय पर्यावरण समझौता उत्सर्जन घटाने को कहता है, जिससे घरेलू निर्माताओं की लागत बढ़ेगी।',
      'समझौते के लिए प्रतिबद्ध होना, क्योंकि वैश्विक पर्यावरणीय चुनौतियों के लिए साझा अंतरराष्ट्रीय दायित्व चाहिए।',
      'घरेलू औद्योगिक प्रतिस्पर्धा बचाने और राष्ट्रीय निर्णयाधिकार बनाए रखने के लिए बाध्यकारी प्रतिबद्धता ठुकराना।',
    ],
    E1: [
      'एक धनी व्यवसायी की मृत्यु हो जाती है और वह अपने बच्चों के लिए बड़ी संपत्ति छोड़ता है।',
      'धन के केंद्रीकरण को घटाने और सार्वजनिक अवसरों में निवेश करने के लिए बड़ा विरासत कर लगाना।',
      'न्यूनतम कर के साथ परिवार को संपत्ति विरासत में लेने देना और निजी संपत्ति व पारिवारिक सुरक्षा बचाना।',
    ],
    E2: [
      'एक टीम कठिन परियोजना सफलतापूर्वक पूरी करती है। सभी ने योगदान दिया, लेकिन कुछ लोगों ने बहुत अधिक जिम्मेदारी उठाई।',
      'सहयोग और साझा स्वामित्व मजबूत करने के लिए टीम बोनस बराबर बांटना।',
      'असाधारण प्रयास को पहचानने के लिए बोनस का सबसे बड़ा हिस्सा प्रमुख योगदानकर्ताओं को देना।',
    ],
    E3: [
      'एक बड़े विश्वविद्यालय के पास पूरी फीस वाली छात्रवृत्तियों की संख्या सीमित है।',
      'बौद्धिक उत्कृष्टता को पहचानने के लिए उन्हें केवल शैक्षणिक उपलब्धि और परीक्षा प्रदर्शन पर देना।',
      'सामाजिक-आर्थिक उन्नति बढ़ाने के लिए कम आय वाले परिवारों के प्रतिभाशाली छात्रों को देना।',
    ],
    T1: [
      'स्वचालित यात्री शटल बंद परीक्षण में भरोसेमंद हैं, लेकिन वास्तविक शहरी यातायात में उनका डेटा सीमित है।',
      'वास्तविक परीक्षण और तैनाती तेज करने के लिए सार्वजनिक सड़कों पर निगरानी वाला पायलट शुरू करना।',
      'सार्वजनिक सड़क पर चलाने से पहले सुरक्षा मानक सत्यापित होने तक नियंत्रित परिस्थितियों में परीक्षण जारी रखना।',
    ],
    T2: [
      'एक इंटरैक्टिव एआई शिक्षण सहायक छात्रों के परीक्षा परिणाम सुधारता है, लेकिन सीखने की आदतों पर उसका दीर्घकालिक प्रभाव अज्ञात है।',
      'संभावित अनपेक्षित प्रभावों का अध्ययन होने तक कक्षा में अपनाने से रुकना।',
      'तत्काल शैक्षिक लाभ लेने और छात्रों की प्रगति पर नज़र रखने के लिए इसे अभी कक्षा में शामिल करना।',
    ],
    T3: [
      'प्रयोगशाला में उगाया गया मांस बुनियादी नियामक मानकों पर खरा उतरता है। इसे उपभोक्ताओं के लिए कब उपलब्ध करना चाहिए?',
      'स्पष्ट लेबल के साथ व्यावसायिक बिक्री की मंजूरी देना और उपभोक्ताओं को खुद चुनने देना।',
      'दीर्घकालिक सुरक्षा की पुष्टि करने वाले कई वर्षों के पोषण और स्वास्थ्य अध्ययन तक बाजार मंजूरी रोकना।',
    ],
  }),

  ar: toQuestionTranslations({
    M1: [
      'أصبحت تكاليف السكن في مدينتك باهظة بالنسبة إلى كثير من السكان. ما النهج الذي ينبغي أن يحظى بالأولوية؟',
      'تخفيف قيود تقسيم المناطق كي يوسّع بناة المنازل الخاصون المعروض السكني.',
      'استثمار أموال عامة في تطوير مساكن اجتماعية وبلدية غير ربحية.',
    ],
    M2: [
      'تواجه شبكة السكك الحديدية الإقليمية تأخيرات مستمرة ومشكلات في السعة. كيف ينبغي إدارتها؟',
      'هيئة نقل عام موحّدة تنسّق الخدمة وتحافظ على المساءلة العامة.',
      'مشغّلون خاصون متنافسون لرفع الكفاءة ومنح الركاب خيارات استهلاكية.',
    ],
    M3: [
      'الإنترنت عالي السرعة في منطقتك مكلف والخدمة غير مستقرة. ما أفضل علاج؟',
      'اعتبار الوصول إلى الإنترنت مرفقًا عامًا وبناء شبكة بلدية لجميع السكان.',
      'خفض الحواجز التنظيمية للسماح لمزوّدي الخدمة الخاصين بدخول السوق والتنافس على السعر.',
    ],
    A1: [
      'مسيرة احتجاج سلمية تغلق طريقًا سريعًا رئيسيًا خلال رحلة الصباح إلى العمل.',
      'إخلاء الطريق سريعًا لاستعادة النقل العام ووصول خدمات الطوارئ.',
      'السماح باستمرار المظاهرة، مع الاعتراف بأن الاحتجاج الفعّال يسبب اضطرابًا غالبًا.',
    ],
    A2: [
      'ينظّم مركز ثقافي ممول من المال العام عرضًا لفنان يثير برنامجه احتجاجًا مجتمعيًا شديدًا.',
      'السماح بإقامة العرض وحماية الحرية الفنية من حق النقض العام.',
      'إلغاء العرض لضمان عدم استخدام الموارد العامة للترويج لمحتوى مسيء.',
    ],
    A3: [
      'تقترح سلطات المدينة تركيب كاميرات آلية للتعرّف على الوجوه في الساحات العامة المزدحمة لتعقّب المشتبه بهم.',
      'تقييد التقنية لحماية المواطنين من المراقبة الشاملة في حياتهم اليومية.',
      'نشر التقنية لمساعدة إنفاذ القانون على منع الجريمة والعثور على المجرمين الخطرين.',
    ],
    I1: [
      'تعلن هيئة صحية وطنية أن أحد المكونات آمن، لكن منتقدين يثيرون أسئلة.',
      'قبول نتائج الهيئة والثقة بالمعايير العلمية الراسخة والمراجعة المؤسسية.',
      'حجب التأييد حتى يكرّر باحثون مستقلون خارج الهيئة الاختبارات ويؤكدوا السلامة.',
    ],
    I2: [
      'يقترح مرشحان إصلاحات متشابهة لتحسين الإدارة العامة. أي نهج تفضّل؟',
      'شخص مستقل من خارج المؤسسة غير مقيّد بالروتين ومستعد لتحدّي البيروقراطية.',
      'إداري متمرّس يملك معرفة مؤسسية ويعرف كيفية التعامل مع الإجراءات الحكومية.',
    ],
    I3: [
      'تخفق وكالة تنمية عامة مرارًا في تحقيق أهداف مشاريعها. كيف ينبغي إعادة هيكلة قيادتها؟',
      'تعيين إداريين محترفين خبراء في الإدارة العامة لإعادة تنظيم العمليات.',
      'نقل الإشراف إلى مجلس من أفراد المجتمع المحلي لمواءمة القرارات مع احتياجات السكان.',
    ],
    G1: [
      'لدى صاحب عمل وظيفة شاغرة ومرشحان نهائيان متساويا الكفاءة: مواطن محلي ومتقدّم أجنبي.',
      'إعطاء الأولوية للمواطن المحلي لدعم العمالة الوطنية والمجتمعات المحلية.',
      'الاختيار بناءً على المؤهلات الفردية فقط واعتبار الجنسية غير ذات صلة بالوظيفة.',
    ],
    G2: [
      'إمداد علاج طبي أساسي محدود جدًا أثناء تفشٍ دولي. كيف ينبغي توزيع الإمدادات؟',
      'توزيعها دوليًا بحسب الأماكن التي تكون فيها الاحتياجات الصحية ومعدلات العدوى أشد.',
      'إعطاء الأولوية للسكان المحليين أولًا، تنفيذًا لواجب الحكومة الأساسي تجاه مواطنيها.',
    ],
    G3: [
      'تُلزم اتفاقية بيئية دولية بخفض الانبعاثات، ما سيرفع تكاليف المصنّعين المحليين.',
      'الالتزام بالمعاهدة، لأن التحديات البيئية العالمية تتطلب واجبات دولية مشتركة.',
      'رفض الالتزامات الملزمة لحماية القدرة التنافسية للصناعة المحلية والحفاظ على القرار الوطني.',
    ],
    E1: [
      'يتوفى صاحب عمل ثري ويترك تركة كبيرة لأبنائه.',
      'فرض ضريبة ميراث كبيرة للحد من تركّز الثروة والاستثمار في الفرص العامة.',
      'السماح للعائلة بوراثة التركة بضريبة ضئيلة لحماية الملكية الخاصة وإعالة الأسرة.',
    ],
    E2: [
      'ينجز فريق مشروعًا صعبًا بنجاح. ساهم الجميع، لكن قلة تحملت مسؤولية أكبر بكثير.',
      'توزيع مكافأة الفريق بالتساوي لتعزيز العمل التعاوني والملكية المشتركة.',
      'تخصيص الحصة الأكبر للمساهمين الرئيسيين تقديرًا لجهدهم الاستثنائي.',
    ],
    E3: [
      'لدى جامعة كبرى عدد محدود من المنح الدراسية التي تغطي الرسوم كاملة.',
      'منحها حصريًا بحسب التحصيل الأكاديمي ونتائج الاختبارات تقديرًا للتميّز الفكري.',
      'منحها لطلاب موهوبين من أسر منخفضة الدخل لتعزيز الحراك الاجتماعي الاقتصادي.',
    ],
    T1: [
      'تعمل حافلات الركاب ذاتية القيادة بموثوقية في الاختبارات المغلقة، لكن بياناتها في حركة المرور الحضرية الحقيقية محدودة.',
      'إطلاق تجربة تجريبية مراقبة في الشوارع العامة لتسريع الاختبار والنشر في الواقع.',
      'مواصلة الاختبار في ظروف مضبوطة حتى التحقق من معايير السلامة قبل استخدام الشوارع العامة.',
    ],
    T2: [
      'يحسّن مساعد تعلّم تفاعلي بالذكاء الاصطناعي نتائج الطلاب، لكن أثره الطويل في عادات التعلّم غير مدروس.',
      'تأجيل اعتماده في الصف حتى تقيّم دراسات طويلة الأمد آثاره غير المقصودة المحتملة.',
      'دمجه في الصفوف الآن للاستفادة من المكاسب الفورية مع متابعة تقدّم الطلاب.',
    ],
    T3: [
      'تستوفي اللحوم المزروعة في المختبر المعايير التنظيمية الأساسية. متى ينبغي إتاحتها للمستهلكين؟',
      'الموافقة على بيعها تجاريًا مع وسم واضح وترك القرار للمستهلكين.',
      'حجب الموافقة السوقية حتى تؤكد دراسات تغذية وصحة متعددة السنوات سلامتها الطويلة الأمد.',
    ],
  }),

  pt: toQuestionTranslations({
    M1: [
      'Os custos de moradia ficaram inacessíveis para muitos moradores da sua cidade. Qual abordagem deve ter prioridade?',
      'Flexibilizar as regras de zoneamento para que construtoras privadas ampliem a oferta de moradias.',
      'Investir recursos públicos no desenvolvimento de moradias sociais e municipais sem fins lucrativos.',
    ],
    M2: [
      'A rede ferroviária regional enfrenta atrasos constantes e problemas de capacidade. Como deve ser administrada?',
      'Uma autoridade única de transporte público para coordenar o serviço e manter a prestação de contas pública.',
      'Operadores privados concorrentes para aumentar a eficiência e oferecer escolha aos passageiros.',
    ],
    M3: [
      'A internet de alta velocidade na sua região é cara e o serviço é instável. Qual é o melhor remédio?',
      'Tratar o acesso à internet como serviço público e construir uma rede municipal para todos os moradores.',
      'Reduzir barreiras regulatórias para que provedores privados entrem no mercado e concorram pelo preço.',
    ],
    A1: [
      'Uma marcha pacífica de protesto bloqueia uma grande rodovia durante o trajeto da manhã.',
      'Liberar a via rapidamente para restaurar o transporte público e o acesso de emergência.',
      'Permitir que a manifestação continue, reconhecendo que protestos eficazes costumam causar transtornos.',
    ],
    A2: [
      'Um centro cultural financiado pelo poder público agenda um artista cujo número provoca forte protesto da comunidade.',
      'Permitir a apresentação, protegendo a liberdade artística de vetos públicos.',
      'Cancelar a apresentação para garantir que recursos públicos não promovam conteúdo ofensivo.',
    ],
    A3: [
      'As autoridades propõem instalar câmeras automáticas de reconhecimento facial em praças movimentadas para rastrear suspeitos.',
      'Restringir a tecnologia para proteger cidadãos da vigilância constante no cotidiano.',
      'Implantar a tecnologia para ajudar a polícia a prevenir crimes e localizar criminosos perigosos.',
    ],
    I1: [
      'Um órgão nacional de saúde declara um ingrediente seguro, mas críticos levantam dúvidas.',
      'Aceitar as conclusões do órgão e confiar nos padrões científicos estabelecidos e na revisão institucional.',
      'Adiar o apoio até que pesquisadores independentes, fora do órgão, repitam e confirmem a segurança.',
    ],
    I2: [
      'Dois candidatos propõem reformas semelhantes para melhorar a administração pública. Qual abordagem você prefere?',
      'Uma pessoa independente, de fora, sem as limitações das rotinas estabelecidas e disposta a desafiar a burocracia.',
      'Um administrador experiente, com conhecimento institucional e domínio dos processos do governo.',
    ],
    I3: [
      'Uma agência pública de desenvolvimento descumpre repetidamente suas metas. Como sua liderança deve ser reestruturada?',
      'Nomear administradores de carreira especialistas em gestão pública para reorganizar as operações.',
      'Transferir a supervisão para um conselho de moradores locais, alinhando decisões às necessidades da comunidade.',
    ],
    G1: [
      'Um empregador tem uma vaga e dois finalistas igualmente qualificados: um cidadão do país e um candidato estrangeiro.',
      'Priorizar o cidadão do país para apoiar o emprego nacional e as comunidades locais.',
      'Escolher apenas pelas qualificações individuais, considerando a nacionalidade irrelevante para a função.',
    ],
    G2: [
      'Um tratamento médico essencial é extremamente escasso durante um surto internacional. Como os suprimentos devem ser distribuídos?',
      'Distribuí-los internacionalmente conforme as necessidades de saúde e as taxas de infecção mais graves.',
      'Priorizar primeiro a população nacional, cumprindo o dever principal do governo com seus cidadãos.',
    ],
    G3: [
      'Um acordo ambiental internacional exige reduzir emissões, aumentando os custos dos fabricantes nacionais.',
      'Assumir o compromisso, pois desafios ambientais globais exigem obrigações internacionais compartilhadas.',
      'Recusar compromissos vinculantes para proteger a indústria nacional e preservar a autonomia do país.',
    ],
    E1: [
      'Um empresário rico morre e deixa um grande patrimônio para os filhos.',
      'Cobrar um imposto sucessório substancial para reduzir a concentração de riqueza e investir em oportunidades públicas.',
      'Permitir que a família herde o patrimônio com imposto mínimo, protegendo a propriedade privada e o sustento familiar.',
    ],
    E2: [
      'Uma equipe conclui com sucesso um projeto exigente. Todos contribuíram, mas alguns assumiram muito mais responsabilidade.',
      'Dividir o bônus igualmente para reforçar a colaboração e o senso de responsabilidade compartilhada.',
      'Dar a maior parte do bônus aos principais contribuintes para reconhecer o esforço extraordinário.',
    ],
    E3: [
      'Uma grande universidade tem poucas bolsas que cobrem integralmente as mensalidades.',
      'Concedê-las estritamente por desempenho acadêmico e resultados de provas, reconhecendo a excelência intelectual.',
      'Concedê-las a estudantes talentosos de baixa renda para promover mobilidade socioeconômica.',
    ],
    T1: [
      'Shuttles autônomos de passageiros funcionam bem em testes fechados, mas têm poucos dados no trânsito urbano real.',
      'Lançar um piloto monitorado em ruas públicas para acelerar os testes e a implantação no mundo real.',
      'Continuar em condições controladas até verificar os parâmetros de segurança antes de usar as ruas públicas.',
    ],
    T2: [
      'Um assistente de aprendizagem interativo com IA melhora as notas dos alunos, mas seu impacto de longo prazo nos hábitos de estudo não foi pesquisado.',
      'Adiar o uso em sala até estudos de longo prazo avaliarem possíveis efeitos indesejados.',
      'Integrá-lo às aulas agora para obter ganhos imediatos e acompanhar o progresso dos alunos.',
    ],
    T3: [
      'A carne cultivada em laboratório atende aos padrões regulatórios básicos. Quando deve ser oferecida aos consumidores?',
      'Aprovar a venda comercial com rotulagem clara, deixando os consumidores escolherem.',
      'Aguardar estudos nutricionais e de saúde de vários anos confirmarem a segurança de longo prazo.',
    ],
  }),

  it: toQuestionTranslations({
    M1: [
      'I costi delle abitazioni sono diventati insostenibili per molti residenti della tua città. Quale approccio dovrebbe avere la priorità?',
      "Allentare i vincoli urbanistici affinché i costruttori privati possano aumentare l'offerta abitativa.",
      'Investire fondi pubblici nello sviluppo di edilizia sociale e di alloggi comunali senza scopo di lucro.',
    ],
    M2: [
      'La rete ferroviaria regionale subisce ritardi persistenti e problemi di capacità. Come dovrebbe essere gestita?',
      "Un'autorità unica del trasporto pubblico che coordini il servizio e garantisca la responsabilità pubblica.",
      'Operatori privati in concorrenza per aumentare l’efficienza e offrire ai passeggeri più scelta.',
    ],
    M3: [
      'La connessione internet ad alta velocità nella tua zona è costosa e il servizio è incostante. Qual è il rimedio migliore?',
      "Considerare l'accesso a internet un servizio pubblico e costruire una rete comunale per tutti i residenti.",
      'Ridurre gli ostacoli normativi affinché i fornitori privati entrino nel mercato e competano sul prezzo.',
    ],
    A1: [
      'Una marcia di protesta pacifica blocca una grande autostrada durante il tragitto mattutino.',
      'Sgomberare rapidamente la strada per ripristinare il trasporto pubblico e l’accesso dei mezzi di soccorso.',
      'Permettere che la manifestazione continui, riconoscendo che una protesta efficace spesso crea disagi.',
    ],
    A2: [
      'Un centro culturale finanziato con fondi pubblici programma un artista il cui spettacolo suscita forti proteste nella comunità.',
      'Permettere lo spettacolo, proteggendo la libertà artistica dai veti del pubblico.',
      'Annullare lo spettacolo, assicurando che le risorse pubbliche non promuovano contenuti offensivi.',
    ],
    A3: [
      'Le autorità cittadine propongono di installare telecamere automatiche per il riconoscimento facciale nelle piazze affollate per rintracciare i sospetti.',
      'Limitare la tecnologia per proteggere i cittadini dalla sorveglianza pervasiva nella vita quotidiana.',
      'Introdurre la tecnologia per aiutare le forze dell’ordine a prevenire i reati e trovare criminali pericolosi.',
    ],
    I1: [
      "Un'autorità sanitaria nazionale dichiara sicuro un ingrediente, ma i critici sollevano dubbi.",
      "Accettare le conclusioni dell'autorità, fidandosi degli standard scientifici consolidati e della revisione istituzionale.",
      "Sospendere il sostegno finché ricercatori indipendenti esterni all'agenzia non replichino e confermino la sicurezza.",
    ],
    I2: [
      'Due candidati propongono riforme simili per migliorare la pubblica amministrazione. Quale approccio preferisci?',
      'Una persona indipendente esterna, non vincolata dalle routine esistenti e disposta a sfidare la burocrazia.',
      'Un amministratore esperto con conoscenze istituzionali, capace di orientarsi nei processi di governo.',
    ],
    I3: [
      "Un'agenzia pubblica per lo sviluppo non raggiunge ripetutamente gli obiettivi dei suoi progetti. Come dovrebbe essere ristrutturata la sua dirigenza?",
      'Nominare amministratori di carriera esperti di gestione pubblica per riorganizzare le attività.',
      'Trasferire la supervisione a un consiglio di membri della comunità locale per allineare le decisioni alle esigenze dei residenti.',
    ],
    G1: [
      'Un datore di lavoro ha un posto vacante e due finalisti con qualifiche equivalenti: un cittadino del Paese e un candidato straniero.',
      'Dare priorità al cittadino nazionale per sostenere l’occupazione e le comunità locali.',
      'Scegliere esclusivamente in base alle qualifiche individuali, considerando la nazionalità irrilevante per il ruolo.',
    ],
    G2: [
      "Durante un'epidemia internazionale, una terapia medica essenziale è estremamente scarsa. Come dovrebbero essere distribuite le forniture?",
      'Distribuirle a livello internazionale in base ai luoghi con i bisogni sanitari e i tassi di infezione più gravi.',
      'Dare prima la priorità alla popolazione nazionale, rispettando il dovere principale del governo verso i propri cittadini.',
    ],
    G3: [
      'Un accordo ambientale internazionale impone riduzioni delle emissioni, aumentando i costi per i produttori nazionali.',
      'Rispettare il trattato, riconoscendo che le sfide ambientali globali richiedono obblighi internazionali condivisi.',
      'Rifiutare impegni vincolanti per proteggere la competitività dell’industria nazionale e mantenere l’autonomia del Paese.',
    ],
    E1: [
      'Un ricco imprenditore muore e lascia un grande patrimonio ai propri figli.',
      'Applicare una consistente imposta di successione per ridurre la concentrazione della ricchezza e investire nelle opportunità pubbliche.',
      "Permettere alla famiglia di ereditare il patrimonio con un'imposta minima, proteggendo la proprietà privata e il sostegno familiare.",
    ],
    E2: [
      'Una squadra completa con successo un progetto impegnativo. Tutti hanno contribuito, ma alcuni hanno assunto responsabilità molto maggiori.',
      'Distribuire il premio della squadra in parti uguali per rafforzare la collaborazione e la responsabilità condivisa.',
      'Assegnare la quota maggiore del premio ai principali contributori per riconoscere il loro impegno straordinario.',
    ],
    E3: [
      'Una grande università dispone di un numero limitato di borse di studio che coprono interamente le tasse.',
      "Assegnarle esclusivamente in base ai risultati accademici e ai test per riconoscere l'eccellenza intellettuale.",
      'Assegnarle a studenti di talento provenienti da famiglie a basso reddito per promuovere la mobilità socioeconomica.',
    ],
    T1: [
      'Le navette passeggeri a guida autonoma funzionano in modo affidabile nei test chiusi, ma i dati nel traffico urbano reale sono limitati.',
      'Avviare un progetto pilota monitorato sulle strade pubbliche per accelerare i test e l’implementazione nel mondo reale.',
      'Continuare i test in condizioni controllate finché i parametri di sicurezza non saranno verificati prima dell’uso sulle strade pubbliche.',
    ],
    T2: [
      "Un assistente interattivo di apprendimento basato sull'IA migliora i risultati degli studenti, ma il suo impatto a lungo termine sulle abitudini di studio non è stato studiato.",
      "Rimandare l'adozione in classe finché studi a lungo termine non valutino i possibili effetti indesiderati.",
      'Integrarlo subito nelle classi per cogliere i benefici immediati monitorando i progressi degli studenti.',
    ],
    T3: [
      'La carne coltivata in laboratorio soddisfa gli standard normativi di base. Quando dovrebbe essere resa disponibile ai consumatori?',
      "Autorizzarne la vendita commerciale con un'etichettatura chiara, lasciando scegliere i consumatori.",
      'Rinviare l’approvazione finché studi nutrizionali e sanitari pluriennali non confermino la sicurezza a lungo termine.',
    ],
  }),

  fr: toQuestionTranslations({
    M1: [
      "Le coût du logement est devenu inabordable pour de nombreux habitants de votre ville. Quelle approche doit être prioritaire ?",
      "Assouplir les règles de zonage afin que les promoteurs privés augmentent l'offre de logements.",
      'Investir des fonds publics dans des logements sociaux et municipaux à but non lucratif.',
    ],
    M2: [
      'Le réseau ferroviaire régional connaît des retards persistants et des problèmes de capacité. Comment doit-il être géré ?',
      'Une autorité unique des transports publics pour coordonner le service et garantir la responsabilité publique.',
      'Des opérateurs privés en concurrence pour améliorer l’efficacité et offrir un choix aux passagers.',
    ],
    M3: [
      'Internet haut débit est cher dans votre région et le service est irrégulier. Quel est le meilleur remède ?',
      'Considérer l’accès à internet comme un service public et construire un réseau municipal pour tous.',
      'Réduire les barrières réglementaires afin que les fournisseurs privés entrent sur le marché et se concurrencent sur les prix.',
    ],
    A1: [
      'Une marche de protestation pacifique bloque une grande autoroute pendant le trajet du matin.',
      'Dégager rapidement la chaussée pour rétablir les transports publics et l’accès des secours.',
      'Laisser la manifestation se poursuivre, en reconnaissant qu’une protestation efficace provoque souvent des perturbations.',
    ],
    A2: [
      'Un centre culturel financé par des fonds publics programme un artiste dont le spectacle suscite une vive protestation locale.',
      'Maintenir le spectacle et protéger la liberté artistique contre les veto publics.',
      'Annuler le spectacle afin que les ressources publiques ne servent pas à promouvoir un contenu offensant.',
    ],
    A3: [
      'Les autorités proposent d’installer des caméras automatiques de reconnaissance faciale dans des places très fréquentées pour suivre des suspects.',
      'Limiter cette technologie pour protéger les citoyens d’une surveillance omniprésente au quotidien.',
      'Déployer cette technologie pour aider les forces de l’ordre à prévenir les crimes et retrouver les délinquants dangereux.',
    ],
    I1: [
      'Une autorité sanitaire nationale déclare un ingrédient sûr, mais des critiques soulèvent des questions.',
      'Accepter les conclusions de l’autorité et faire confiance aux normes scientifiques établies et à l’examen institutionnel.',
      'Suspendre son approbation jusqu’à ce que des chercheurs indépendants reproduisent et confirment les résultats.',
    ],
    I2: [
      'Deux candidats proposent des réformes similaires pour améliorer l’administration publique. Quelle approche préférez-vous ?',
      'Une personne indépendante venue de l’extérieur, libre des habitudes établies et prête à contester la bureaucratie.',
      'Un administrateur expérimenté qui connaît les institutions et sait naviguer dans les procédures publiques.',
    ],
    I3: [
      'Une agence publique de développement manque régulièrement ses objectifs. Comment sa direction doit-elle être restructurée ?',
      'Nommer des administrateurs de carrière experts en gestion publique pour réorganiser les opérations.',
      'Confier la supervision à un conseil de résidents locaux afin d’aligner les décisions sur leurs besoins.',
    ],
    G1: [
      'Un employeur a un poste et deux finalistes aux qualifications égales : un citoyen du pays et un candidat étranger.',
      'Donner la priorité au citoyen pour soutenir l’emploi national et les communautés locales.',
      'Choisir uniquement selon les qualifications individuelles, la nationalité étant sans rapport avec le poste.',
    ],
    G2: [
      'Un traitement médical essentiel est très rare pendant une épidémie internationale. Comment répartir les stocks ?',
      'Les distribuer selon les endroits où les besoins sanitaires et les taux d’infection sont les plus graves.',
      'Approvisionner d’abord la population nationale, conformément au devoir premier du gouvernement envers ses citoyens.',
    ],
    G3: [
      'Un accord environnemental international impose de réduire les émissions, ce qui augmentera les coûts des fabricants nationaux.',
      'Respecter le traité, car les défis environnementaux mondiaux exigent des obligations internationales partagées.',
      'Refuser les engagements contraignants pour protéger la compétitivité industrielle nationale et garder sa liberté de décision.',
    ],
    E1: [
      'Un riche chef d’entreprise meurt et laisse une importante succession à ses enfants.',
      'Prélever un impôt successoral élevé pour réduire la concentration des richesses et financer des opportunités publiques.',
      'Laisser la famille hériter avec un impôt minimal afin de protéger la propriété privée et la sécurité familiale.',
    ],
    E2: [
      'Une équipe termine avec succès un projet exigeant. Tous ont contribué, mais quelques-uns ont assumé bien plus de responsabilités.',
      'Répartir la prime à parts égales pour renforcer la collaboration et la responsabilité collective.',
      'Accorder la plus grande part aux principaux contributeurs pour reconnaître leur effort exceptionnel.',
    ],
    E3: [
      'Une grande université dispose d’un nombre limité de bourses couvrant tous les frais de scolarité.',
      'Les attribuer uniquement selon les résultats scolaires et aux examens pour récompenser l’excellence intellectuelle.',
      'Les attribuer à des étudiants talentueux issus de milieux modestes pour favoriser la mobilité sociale.',
    ],
    T1: [
      'Des navettes autonomes sont fiables en essais fermés, mais les données en circulation urbaine réelle restent limitées.',
      'Lancer un projet pilote surveillé dans les rues publiques pour accélérer les essais et le déploiement réels.',
      'Poursuivre les essais en conditions contrôlées jusqu’à vérifier les seuils de sécurité avant la voie publique.',
    ],
    T2: [
      'Un assistant d’apprentissage interactif par IA améliore les résultats, mais son effet à long terme sur les habitudes d’étude est inconnu.',
      'Attendre des études de long terme avant de l’adopter en classe, afin d’évaluer les effets indésirables possibles.',
      'L’intégrer dès maintenant pour profiter des gains immédiats tout en suivant les progrès des élèves.',
    ],
    T3: [
      'La viande cultivée en laboratoire respecte les normes réglementaires de base. Quand doit-elle être proposée aux consommateurs ?',
      'Autoriser sa vente avec un étiquetage clair et laisser les consommateurs décider.',
      'Attendre plusieurs années d’études nutritionnelles et sanitaires confirmant sa sécurité à long terme.',
    ],
  }),

  ru: toQuestionTranslations({
    M1: [
      'Жильё в вашем городе стало недоступным для многих жителей. Какой подход должен быть приоритетным?',
      'Смягчить правила зонирования, чтобы частные застройщики увеличили предложение жилья.',
      'Вложить государственные средства в социальное и муниципальное некоммерческое жильё.',
    ],
    M2: [
      'Региональная железнодорожная сеть постоянно задерживается и сталкивается с нехваткой пропускной способности. Как ею управлять?',
      'Единое государственное транспортное ведомство, координирующее работу и подотчётное обществу.',
      'Конкурирующие частные операторы для повышения эффективности и выбора пассажиров.',
    ],
    M3: [
      'Высокоскоростной интернет в вашем районе дорог и работает нестабильно. Какое решение лучше?',
      'Считать доступ к интернету общественной услугой и построить муниципальную сеть для всех жителей.',
      'Снизить регуляторные барьеры, чтобы частные провайдеры вошли на рынок и конкурировали ценой.',
    ],
    A1: [
      'Мирный протестный марш перекрывает крупную автомагистраль во время утреннего часа пик.',
      'Быстро освободить дорогу, восстановив общественный транспорт и проезд экстренных служб.',
      'Разрешить продолжение демонстрации, признавая, что действенный протест часто нарушает привычный порядок.',
    ],
    A2: [
      'В культурном центре на государственном финансировании выступает артист, чья программа вызвала сильный протест жителей.',
      'Разрешить выступление, защищая свободу искусства от общественного вето.',
      'Отменить выступление, чтобы государственные ресурсы не продвигали оскорбительный контент.',
    ],
    A3: [
      'Городские власти предлагают установить автоматические камеры распознавания лиц на людных площадях для поиска подозреваемых.',
      'Ограничить технологию, защищая граждан от повседневного тотального наблюдения.',
      'Внедрить технологию, чтобы помогать правоохранителям предотвращать преступления и находить опасных преступников.',
    ],
    I1: [
      'Национальный санитарный регулятор объявляет ингредиент безопасным, но критики задают вопросы.',
      'Принять выводы регулятора и доверять установленным научным стандартам и институциональной проверке.',
      'Не поддерживать вывод до тех пор, пока независимые исследователи вне ведомства не повторят и не подтвердят безопасность.',
    ],
    I2: [
      'Два кандидата предлагают похожие реформы для улучшения государственного управления. Чей подход вы предпочитаете?',
      'Независимый человек со стороны, не связанный устоявшимися правилами и готовый бросить вызов бюрократии.',
      'Опытный администратор, знающий институты и умеющий работать с государственными процедурами.',
    ],
    I3: [
      'Государственное агентство развития постоянно не достигает целей проектов. Как перестроить его руководство?',
      'Назначить профессиональных администраторов, разбирающихся в государственном управлении, для реорганизации работы.',
      'Передать надзор совету местных жителей, чтобы решения соответствовали их потребностям.',
    ],
    G1: [
      'У работодателя есть вакансия и два одинаково квалифицированных финалиста: гражданин страны и иностранный кандидат.',
      'Отдать приоритет гражданину, поддерживая национальную занятость и местные сообщества.',
      'Выбирать только по личным квалификациям, считая гражданство не относящимся к работе.',
    ],
    G2: [
      'Во время международной вспышки критически важное лечение находится в остром дефиците. Как распределить запасы?',
      'Распределять их между странами там, где медицинские потребности и уровень заражения наиболее высоки.',
      'Сначала снабдить собственное население, выполняя первейший долг правительства перед гражданами.',
    ],
    G3: [
      'Международное экологическое соглашение требует сократить выбросы, что повысит расходы отечественных производителей.',
      'Выполнить условия договора: глобальные экологические проблемы требуют общих международных обязательств.',
      'Отказаться от обязательств, чтобы защитить национальную промышленность и сохранить самостоятельность решений.',
    ],
    E1: [
      'Состоятельный владелец бизнеса умирает и оставляет детям большое наследство.',
      'Ввести высокий налог на наследство, чтобы уменьшить концентрацию богатства и вложиться в общественные возможности.',
      'Разрешить семье получить наследство с минимальным налогом, защищая частную собственность и семейное обеспечение.',
    ],
    E2: [
      'Команда успешно завершает сложный проект. Все внесли вклад, но несколько человек взяли на себя гораздо больше ответственности.',
      'Разделить премию поровну, укрепляя совместную работу и общее чувство ответственности.',
      'Отдать большую долю ведущим участникам, признав их необычайные усилия.',
    ],
    E3: [
      'В крупном университете есть лишь несколько стипендий, полностью покрывающих обучение.',
      'Выдать их строго за академические достижения и результаты тестов, отмечая интеллектуальное превосходство.',
      'Выдать их талантливым студентам из семей с низким доходом, поддерживая социальную мобильность.',
    ],
    T1: [
      'Беспилотные пассажирские шаттлы надёжны в закрытых испытаниях, но данных о реальном городском движении мало.',
      'Запустить контролируемый пилот на общественных улицах, ускорив испытания и внедрение в реальных условиях.',
      'Продолжать испытания в контролируемых условиях, пока показатели безопасности не будут подтверждены до выхода на улицы.',
    ],
    T2: [
      'Интерактивный ИИ-помощник улучшает результаты тестов, но его долгосрочное влияние на учебные привычки не изучено.',
      'Отложить внедрение в классах до долгосрочных исследований возможных непредвиденных последствий.',
      'Внедрить его сейчас, получая немедленные образовательные преимущества и отслеживая прогресс учеников.',
    ],
    T3: [
      'Мясо, выращенное в лаборатории, соответствует базовым нормам. Когда его следует сделать доступным потребителям?',
      'Разрешить продажу с понятной маркировкой, оставив выбор потребителям.',
      'Отложить допуск на рынок до многолетних исследований питания и здоровья, подтверждающих долгосрочную безопасность.',
    ],
  }),

  ja: toQuestionTranslations({
    M1: [
      'あなたの街では住宅費が高騰し、多くの住民にとって手が届かなくなっています。どの取り組みを優先すべきでしょうか？',
      '用途地域の規制を緩和し、民間の住宅建設業者が供給を増やせるようにする。',
      '公的資金を社会住宅や非営利の自治体住宅の整備に投じる。',
    ],
    M2: [
      '地域鉄道では遅延が続き、輸送力にも問題があります。どのように運営すべきでしょうか？',
      'サービスを調整し、公共への説明責任を保つ統一された公営交通機関。',
      '効率を高め、乗客に選択肢を与える民間事業者同士の競争。',
    ],
    M3: [
      '地域の高速インターネットは高価で、サービスも安定しません。最善の対策は何でしょうか？',
      'インターネットを公共サービスとみなし、全住民向けの自治体ネットワークを整備する。',
      '規制上の参入障壁を下げ、民間事業者が市場に入り価格で競争できるようにする。',
    ],
    A1: [
      '平和的な抗議行進が、朝の通勤時間に主要高速道路を封鎖しています。',
      '公共交通と緊急車両の通行を回復するため、速やかに道路を開ける。',
      '効果的な抗議は混乱を伴うことが多いと認め、デモを続けさせる。',
    ],
    A2: [
      '公的資金で運営される文化センターが、地域から強い抗議を受ける演者の公演を予定しています。',
      '公演を実施し、公共の拒否権から芸術の自由を守る。',
      '公的資源で不快な内容を広めないよう、公演を中止する。',
    ],
    A3: [
      '市当局は、容疑者を追跡するため、混雑した公共広場に自動顔認識カメラを設置する案を示しています。',
      '日常生活での広範な監視から市民を守るため、技術を制限する。',
      '犯罪の防止や危険な犯人の発見を支援するため、技術を導入する。',
    ],
    I1: [
      '国の保健規制当局がある成分を安全と判断しましたが、批判する人々は疑問を呈しています。',
      '当局の判断を受け入れ、確立された科学基準と制度的な審査を信頼する。',
      '当局外の独立研究者が再現し安全性を確認するまで、支持を保留する。',
    ],
    I2: [
      '公共行政を改善するため、2人の候補者が似た改革を提案しています。どちらを好みますか？',
      '既存の慣行に縛られず、官僚制度に挑戦する独立した外部の人物。',
      '制度に詳しく、政府の手続きを進める方法を知る経験豊かな行政官。',
    ],
    I3: [
      '公的な開発機関が何度も事業目標を達成できていません。指導部をどう再編すべきでしょうか？',
      '公共経営に詳しい職業行政官を任命し、業務を立て直す。',
      '住民のニーズに沿うよう、地域住民の評議会へ監督を移す。',
    ],
    G1: [
      '雇用主に、同じ資格を持つ最終候補者が2人います。国内の市民と外国人の応募者です。',
      '国内雇用と地域社会を支えるため、国内の市民を優先する。',
      '国籍は職務と無関係と考え、個人の資格だけで選ぶ。',
    ],
    G2: [
      '国際的な感染症の流行中、重要な治療薬の供給が極めて限られています。どう配分すべきでしょうか？',
      '健康上の必要性と感染率が最も深刻な場所を基準に、国際的に配分する。',
      '政府が自国民に負う第一の責任を果たすため、まず国内住民を優先する。',
    ],
    G3: [
      '国際環境協定が排出削減を義務づけ、国内メーカーのコストが上がることになります。',
      '地球規模の環境問題には国際的な責任の共有が必要だとして、条約を守る。',
      '国内産業の競争力を守り、国の裁量を保つため、拘束力のある約束を拒む。',
    ],
    E1: [
      '裕福な事業主が亡くなり、子どもたちに大きな遺産を残しました。',
      '富の集中を抑え公共の機会に投資するため、相続税を大幅に課す。',
      '私有財産と家族の生活保障を守るため、最小限の税で相続させる。',
    ],
    E2: [
      'チームが難しいプロジェクトを成功させました。全員が貢献しましたが、数人は大幅に多くの責任を担いました。',
      '協力と共有された責任を強めるため、チームの賞与を均等に分ける。',
      '並外れた努力を認めるため、中心的な貢献者に賞与の大部分を配分する。',
    ],
    E3: [
      '有名大学には、授業料を全額まかなう奨学金が限られた数しかありません。',
      '知的な優秀さを評価するため、学業成績と試験結果だけで決める。',
      '社会経済的な移動を促すため、低所得家庭の優秀な学生に与える。',
    ],
    T1: [
      '自動運転の乗客シャトルは閉鎖された試験では安定していますが、実際の都市交通のデータは限られています。',
      '現実の試験と導入を早めるため、監視付きの公道パイロットを始める。',
      '公道で使う前に安全基準を確認できるまで、管理された環境で試験を続ける。',
    ],
    T2: [
      '対話型AI学習支援は生徒のテスト結果を改善しますが、学習習慣への長期的な影響は未研究です。',
      '長期研究で予期しない影響を評価するまで、教室での導入を見送る。',
      '生徒の進歩を追跡しながら、すぐに教室へ導入して教育上の利益を得る。',
    ],
    T3: [
      '培養肉は基本的な規制基準を満たしています。いつ消費者に提供すべきでしょうか？',
      '明確な表示を付けて販売を認め、消費者が自分で選べるようにする。',
      '数年にわたる栄養・健康研究で長期的な安全性が確認されるまで、市場承認を見送る。',
    ],
  }),

  fa: toQuestionTranslations({
    M1: [
      'هزینه مسکن در شهر شما برای بسیاری از ساکنان غیرقابل‌پرداخت شده است. کدام رویکرد باید در اولویت باشد؟',
      'محدودیت‌های منطقه‌بندی را کاهش دهید تا سازندگان خصوصی بتوانند عرضه مسکن را افزایش دهند.',
      'بودجه عمومی را برای ساخت مسکن اجتماعی و شهریِ غیرانتفاعی سرمایه‌گذاری کنید.',
    ],
    M2: [
      'شبکه قطار منطقه‌ای با تأخیرهای مداوم و مشکل ظرفیت روبه‌روست. چگونه باید اداره شود؟',
      'یک نهاد یکپارچه حمل‌ونقل عمومی که خدمات را هماهنگ کند و پاسخ‌گویی عمومی را حفظ کند.',
      'اپراتورهای خصوصی رقیب برای افزایش کارایی و دادن حق انتخاب به مسافران.',
    ],
    M3: [
      'اینترنت پرسرعت در منطقه شما گران و خدمات آن ناپایدار است. بهترین راه‌حل چیست؟',
      'دسترسی به اینترنت را یک خدمت عمومی بدانید و برای همه ساکنان شبکه شهری بسازید.',
      'موانع مقرراتی را کاهش دهید تا ارائه‌دهندگان خصوصی وارد بازار شوند و بر سر قیمت رقابت کنند.',
    ],
    A1: [
      'یک راهپیمایی اعتراضی مسالمت‌آمیز در ساعات رفت‌وآمد صبحگاهی بزرگراه اصلی را مسدود می‌کند.',
      'خیابان را سریع باز کنید تا حمل‌ونقل عمومی و دسترسی امدادی برقرار شود.',
      'اجازه دهید تظاهرات ادامه پیدا کند؛ اعتراض مؤثر اغلب باعث اختلال می‌شود.',
    ],
    A2: [
      'یک مرکز فرهنگی با بودجه عمومی برنامه هنرمندی را برگزار می‌کند که اجرای او با اعتراض شدید جامعه روبه‌رو شده است.',
      'اجرا را برگزار کنید و از آزادی هنری در برابر وتوی عمومی محافظت کنید.',
      'اجرا را لغو کنید تا منابع عمومی برای ترویج محتوای توهین‌آمیز استفاده نشود.',
    ],
    A3: [
      'مقام‌های شهری پیشنهاد نصب دوربین‌های خودکار تشخیص چهره در میدان‌های شلوغ را برای ردیابی مظنونان داده‌اند.',
      'فناوری را محدود کنید تا شهروندان از نظارت فراگیر در زندگی روزمره در امان بمانند.',
      'فناوری را به کار بگیرید تا به پلیس در پیشگیری از جرم و یافتن مجرمان خطرناک کمک کند.',
    ],
    I1: [
      'نهاد ملی سلامت ماده‌ای را ایمن اعلام کرده است، اما منتقدان پرسش‌هایی مطرح می‌کنند.',
      'یافته‌های نهاد را بپذیرید و به استانداردهای علمی تثبیت‌شده و بررسی نهادی اعتماد کنید.',
      'تا زمانی که پژوهشگران مستقل خارج از نهاد ایمنی را تکرار و تأیید نکرده‌اند، از تأیید خودداری کنید.',
    ],
    I2: [
      'دو نامزد برای بهبود اداره عمومی اصلاحات مشابهی پیشنهاد می‌کنند. کدام رویکرد را ترجیح می‌دهید؟',
      'یک فرد مستقل و بیرونی که مقید به روال‌های موجود نباشد و بوروکراسی را به چالش بکشد.',
      'یک مدیر باتجربه با دانش نهادی که بداند چگونه در فرایندهای دولتی پیش برود.',
    ],
    I3: [
      'یک سازمان توسعه عمومی بارها اهداف پروژه‌هایش را محقق نکرده است. رهبری آن چگونه باید بازسازی شود؟',
      'مدیران حرفه‌ای متخصص مدیریت دولتی را برای سازمان‌دهی دوباره عملیات منصوب کنید.',
      'نظارت را به شورایی از اعضای جامعه محلی منتقل کنید تا تصمیم‌ها با نیاز ساکنان هماهنگ شود.',
    ],
    G1: [
      'کارفرمایی یک جایگاه خالی و دو نامزد نهایی با صلاحیت برابر دارد: یک شهروند داخلی و یک متقاضی خارجی.',
      'برای حمایت از اشتغال ملی و جوامع محلی، شهروند داخلی را در اولویت قرار دهید.',
      'فقط بر اساس صلاحیت فردی انتخاب کنید و ملیت را برای این شغل بی‌اهمیت بدانید.',
    ],
    G2: [
      'در جریان یک شیوع بین‌المللی، ذخیره یک درمان پزشکی حیاتی بسیار محدود است. منابع چگونه باید توزیع شوند؟',
      'منابع را بر اساس جایی که نیازهای بهداشتی و نرخ عفونت شدیدتر است، در سطح بین‌المللی توزیع کنید.',
      'ابتدا جمعیت داخلی را در اولویت بگذارید و وظیفه اصلی دولت در برابر شهروندانش را انجام دهید.',
    ],
    G3: [
      'یک توافق زیست‌محیطی بین‌المللی کاهش انتشار گازها را الزامی می‌کند و هزینه تولیدکنندگان داخلی را بالا می‌برد.',
      'به پیمان متعهد شوید؛ چالش‌های جهانی محیط‌زیست به مسئولیت‌های مشترک بین‌المللی نیاز دارند.',
      'برای حفاظت از رقابت‌پذیری صنعت داخلی و حفظ اختیار ملی، تعهدات الزام‌آور را نپذیرید.',
    ],
    E1: [
      'یک صاحب کسب‌وکار ثروتمند می‌میرد و دارایی بزرگی برای فرزندانش به جا می‌گذارد.',
      'برای کاهش تمرکز ثروت و سرمایه‌گذاری در فرصت‌های عمومی، مالیات ارث قابل‌توجهی وضع کنید.',
      'اجازه دهید خانواده با حداقل مالیات ارث ببرد تا از مالکیت خصوصی و تأمین خانواده محافظت شود.',
    ],
    E2: [
      'یک تیم پروژه‌ای دشوار را با موفقیت تمام می‌کند. همه مشارکت داشتند، اما چند نفر مسئولیت بسیار بیشتری پذیرفتند.',
      'پاداش تیم را برابر تقسیم کنید تا همکاری و حس مالکیت مشترک تقویت شود.',
      'بیشترین سهم پاداش را به مشارکت‌کنندگان اصلی بدهید تا تلاش فوق‌العاده‌شان به رسمیت شناخته شود.',
    ],
    E3: [
      'یک دانشگاه بزرگ تعداد محدودی بورسیه با پوشش کامل شهریه دارد.',
      'بورسیه‌ها را فقط بر اساس موفقیت تحصیلی و نتیجه آزمون بدهید تا برتری علمی سنجیده شود.',
      'آن‌ها را به دانشجویان مستعد از خانواده‌های کم‌درآمد بدهید تا تحرک اجتماعی و اقتصادی افزایش یابد.',
    ],
    T1: [
      'شاتل‌های مسافربری خودران در آزمایش بسته قابل‌اعتمادند، اما داده آن‌ها در ترافیک واقعی شهر محدود است.',
      'برای سرعت‌دادن به آزمایش و استقرار واقعی، یک طرح آزمایشیِ تحت نظارت در خیابان‌های عمومی اجرا کنید.',
      'تا تأیید معیارهای ایمنی، آزمایش را در شرایط کنترل‌شده ادامه دهید و سپس وارد خیابان عمومی شوید.',
    ],
    T2: [
      'یک دستیار تعاملی یادگیریِ هوش مصنوعی نتیجه آزمون دانش‌آموزان را بهتر می‌کند، اما اثر بلندمدتش بر عادت‌های یادگیری بررسی نشده است.',
      'تا پژوهش‌های بلندمدت اثرهای ناخواسته احتمالی را بسنجند، استفاده در کلاس را به تعویق بیندازید.',
      'همین حالا آن را وارد کلاس کنید تا از سود فوری آموزشی بهره ببرید و پیشرفت دانش‌آموزان را پیگیری کنید.',
    ],
    T3: [
      'گوشت کشت‌شده در آزمایشگاه استانداردهای پایه مقرراتی را دارد. چه زمانی باید در اختیار مصرف‌کنندگان قرار بگیرد؟',
      'فروش تجاری را با برچسب‌گذاری روشن تأیید کنید و انتخاب را به مصرف‌کنندگان بسپارید.',
      'تا زمانی که پژوهش‌های چندساله تغذیه و سلامت ایمنی بلندمدت را تأیید کنند، مجوز بازار ندهید.',
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
