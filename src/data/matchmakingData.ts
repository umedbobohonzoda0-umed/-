export interface MatchmakingProfile {
  id: string;
  gender: 'man' | 'woman'; // 'man' refers to Шавҳар, 'woman' refers to Зан
  name: string;
  age: number;
  city: string;
  education: string;
  profession: string;
  about: string;
  expectations: string;
  hobbies: string[];
  phone: string;
  avatarEmoji: string;
  avatarColor: string;
  isVerified: boolean;
  salaryRange?: string;
  familyValues?: string;
}

export const INITIAL_PROFILES: MatchmakingProfile[] = [
  // Men (Шавҳар)
  {
    id: 'm1',
    gender: 'man',
    name: 'Баҳром',
    age: 28,
    city: 'Душанбе',
    education: 'Олӣ (Технологӣ)',
    profession: 'Муҳандиси нармафзор (IT)',
    about: 'Ман шахси ором ва ҷиддӣ ҳастам. Хоббии ман китобхонӣ ва варзиш аст. Мехоҳам оилаи устувор ва хушбахт барпо кунам.',
    expectations: 'Духтари ботарбия, боиффат, хушмуомила ва қадршинос. Оила ва арзишҳои оилавиро дар ҷойи аввал гузорад.',
    hobbies: ['Китобхонӣ', 'Футбол', 'Саёҳат', 'Кодрезӣ'],
    phone: '+992 93 501 2233',
    avatarEmoji: '👨‍💻',
    avatarColor: 'from-blue-500 to-indigo-600',
    isVerified: true,
    salaryRange: 'миёна ва боло',
  },
  {
    id: 'm2',
    gender: 'man',
    name: 'Манучеҳр',
    age: 31,
    city: 'Хуҷанд',
    education: 'Олӣ (Тиббӣ)',
    profession: 'Духтур-ҷарроҳ',
    about: 'Табиби рӯҳу тан, дӯстдори варзиш ва табиат. Кори ман масъулияти калон талаб мекунад. Вақтҳои холиро бо оила мегузаронам.',
    expectations: 'Босавод, заковатманд, аз оилаи хуб. Омодаи сохтани хонаи обод бошад ва эҳтироми волидонро бидонад.',
    hobbies: ['Варзиш', 'Табиат', 'Ронандагӣ'],
    phone: '+992 92 771 4455',
    avatarEmoji: '👨‍⚕️',
    avatarColor: 'from-teal-500 to-emerald-600',
    isVerified: true,
  },
  {
    id: 'm3',
    gender: 'man',
    name: 'Фаридун',
    age: 26,
    city: 'Душанбе',
    education: 'Олии иқтисодӣ',
    profession: 'Менеҷери фурӯш дар ширкат',
    about: 'Хушҳол ва фаъол ҳастам. Ҳамеша барои беҳбудӣ ва пешрафти зиндагӣ талош менамоям.',
    expectations: 'Духтари ҳалим, меҳрубон, хоксор ва омодаи сохтани ояндаи зебо ҳамроҳ бо ман.',
    hobbies: ['Мусиқӣ', 'Компутар', 'Теннис'],
    phone: '+992 50 110 9988',
    avatarEmoji: '👨‍💼',
    avatarColor: 'from-amber-500 to-orange-600',
    isVerified: false,
  },
  {
    id: 'm4',
    gender: 'man',
    name: 'Суҳроб',
    age: 30,
    city: 'Бохтар',
    education: 'Олӣ',
    profession: 'Муаллими забонҳои хориҷӣ',
    about: 'Ман омӯзгор ҳастам. Ба пешрафти кӯдакону наврасон шавқ дорам. Оиларо пойдевори ҷомеа меҳисобам.',
    expectations: 'Ҳалим, хушмуомила ва кордон. Шахсе ки илму тарбияи фарзандонро қадр кунад.',
    hobbies: ['Забономӯзӣ', 'Кино', 'Шоҳмот'],
    phone: '+992 90 444 3322',
    avatarEmoji: '👨‍🏫',
    avatarColor: 'from-purple-500 to-violet-600',
    isVerified: true,
  },

  // Women (Зан)
  {
    id: 'w1',
    gender: 'woman',
    name: 'Мадина',
    age: 24,
    city: 'Душанбе',
    education: 'Олӣ',
    profession: 'Тарроҳ (Designer)',
    about: 'Ман духтари эҷодкор ва ором ҳастам. Пазандагиро дӯст медорам. Мехоҳам ҳамсари содиқу меҳрубон бошам.',
    expectations: 'Марди ҷиддӣ, кордӯст ва бомасъулият. Нисбат ба оила ва тарбияи кӯдакон бепарво набошад.',
    hobbies: ['Рассомӣ', 'Пазандагӣ', 'Ороиши дохилӣ'],
    phone: '+992 98 700 8822',
    avatarEmoji: '👩‍🎨',
    avatarColor: 'from-pink-500 to-rose-600',
    isVerified: true,
  },
  {
    id: 'w2',
    gender: 'woman',
    name: 'Нигора',
    age: 26,
    city: 'Хуҷанд',
    education: 'Олии иқтисодӣ',
    profession: 'Муҳосиб (Accountant)',
    about: 'Ман духтари оиладор ва дӯстдори тозагиву тартибот. Ба оилаву наздикон ғамхорӣ карданро дӯст медорам.',
    expectations: 'Ҷавонмарди ботарбия, намозхон, босавод ва таъминкунандаи хуб барои оила ва кӯдакон.',
    hobbies: ['Хушнависӣ', 'Китобҳои психологӣ', 'Пазандагӣ'],
    phone: '+992 92 888 1112',
    avatarEmoji: '👩‍💼',
    avatarColor: 'from-violet-500 to-fuchsia-600',
    isVerified: true,
  },
  {
    id: 'w3',
    gender: 'woman',
    name: 'Аниса',
    age: 22,
    city: 'Кӯлоб',
    education: 'Миёнаи махсус (Тиббӣ)',
    profession: 'Ҳамшираи шафқат',
    about: 'Шахси ҳалим, меҳрубон ва хоксор. Бузургтарин ҳадафи ман ташкили оилаи устувор ва хушбахт аст.',
    expectations: 'Ҷавони боимон, боахлоқ, хушмуомила ва меҳнаткаш. Оиларо эҳтиром кунад.',
    hobbies: ['Гулистонӣ', 'Пазандагӣ', 'Тӯдӯзӣ'],
    phone: '+992 93 111 2233',
    avatarEmoji: '👩‍⚕️',
    avatarColor: 'from-cyan-500 to-blue-600',
    isVerified: false,
  },
  {
    id: 'w4',
    gender: 'woman',
    name: 'Рухшона',
    age: 25,
    city: 'Истаравшан',
    education: 'Олии филологӣ',
    profession: 'Муаллимаи забони тоҷикӣ',
    about: 'Ман забон ва фарҳанги миллиамонро дӯст медорам. Хонавода барои ман қудсият дорад.',
    expectations: 'Ҷавонмарди оқил, соҳиби касбу кор, эҳтиромкунандаи волидон ва дӯстдори фарҳанг.',
    hobbies: ['Шеърхонӣ', 'Боғдорӣ', 'Пазандагӣ'],
    phone: '+992 90 555 7788',
    avatarEmoji: '👩‍🏫',
    avatarColor: 'from-orange-500 to-red-600',
    isVerified: true,
  }
];
