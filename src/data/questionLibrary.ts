import { Question, ConversationMode, QuestionCategory } from '../types';

export interface ModeInfo {
  id: ConversationMode;
  name: string;
  tagline: string;
  description: string;
  pastelBg: string;
  pastelBorder: string;
  accentColor: string;
  iconName: string;
}

export interface CategoryInfo {
  id: QuestionCategory;
  name: string;
  pastelColor: string;
  textColor: string;
  emoji: string;
}

export const MODES: ModeInfo[] = [
  {
    id: 'same_question',
    name: 'Same Question, Different Generations',
    tagline: 'Equal voices, contrasting life stages',
    description: 'Everyone answers the exact same question. See how your age, era, and life experiences shape what matters most.',
    pastelBg: '#F3E8FF', // pastel lavender
    pastelBorder: '#D8B4FE',
    accentColor: '#9333EA',
    iconName: 'MessageSquareHeart',
  },
  {
    id: 'then_vs_now',
    name: 'Then vs. Now',
    tagline: 'How everyday life transformed over time',
    description: 'Compare childhood games, music, school days, and gadgets across decades with curiosity, not comparison.',
    pastelBg: '#FEF3C7', // pastel warm butter
    pastelBorder: '#FCD34D',
    accentColor: '#D97706',
    iconName: 'Hourglass',
  },
  {
    id: 'walk_in_shoes',
    name: 'Walk in My Shoes',
    tagline: 'Fictional scenarios to practice empathy',
    description: 'Step into a fictional person’s situation from another generation. What are they feeling? What do they wish people understood?',
    pastelBg: '#E0F2FE', // pastel sky blue
    pastelBorder: '#BAE6FD',
    accentColor: '#0284C7',
    iconName: 'Footprints',
  },
  {
    id: 'untold_stories',
    name: 'Untold Stories',
    tagline: 'Memories, wisdom, and quiet moments',
    description: 'Optional personal stories about lessons learned, childhood adventures, or traditions you hope continue.',
    pastelBg: '#DCFCE7', // pastel mint/sage
    pastelBorder: '#BBF7D0',
    accentColor: '#16A34A',
    iconName: 'Sparkles',
  },
];

export const CATEGORIES: CategoryInfo[] = [
  { id: 'childhood', name: 'Childhood & Memories', pastelColor: '#FFE4E6', textColor: '#BE123C', emoji: '🧸' },
  { id: 'values', name: 'Values & Beliefs', pastelColor: '#F3E8FF', textColor: '#7E22CE', emoji: '🌱' },
  { id: 'friendship', name: 'Friendship & Belonging', pastelColor: '#E0F2FE', textColor: '#0369A1', emoji: '🤝' },
  { id: 'school_work', name: 'School & Growing Up', pastelColor: '#FEF3C7', textColor: '#B45309', emoji: '🎒' },
  { id: 'technology', name: 'Technology & Modern Life', pastelColor: '#CFFAFE', textColor: '#0E7490', emoji: '📱' },
  { id: 'dreams', name: 'Dreams & Aspirations', pastelColor: '#EDE9FE', textColor: '#6D28D9', emoji: '✨' },
  { id: 'traditions', name: 'Family Traditions', pastelColor: '#FFEDD5', textColor: '#C2410C', emoji: '🍲' },
  { id: 'gratitude', name: 'Gratitude & Appreciation', pastelColor: '#DCFCE7', textColor: '#15803D', emoji: '💌' },
  { id: 'misunderstandings', name: 'Everyday Misunderstandings', pastelColor: '#FEE2E2', textColor: '#B91C1C', emoji: '💡' },
];

export const CURATED_QUESTIONS: Question[] = [
  // MODE 1: Same Question, Different Generations
  {
    id: 'sq-1',
    mode: 'same_question',
    category: 'friendship',
    title: 'Qualities of a True Friend',
    prompt: 'What makes someone a truly good friend to you at this point in your life?',
    followUpPrompt: 'Has what you need from a friend changed as you got older?',
    estimatedMinutes: 4,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'sq-2',
    mode: 'same_question',
    category: 'childhood',
    title: 'Pure Free-Time Joy',
    prompt: 'When you were 10 or 12 years old, what was your favorite thing to do on a Saturday morning with no school?',
    followUpPrompt: 'Who was usually with you, and what smells or sounds do you remember?',
    estimatedMinutes: 5,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'sq-3',
    mode: 'same_question',
    category: 'gratitude',
    title: 'Feeling Appreciated',
    prompt: 'What is a small, quiet gesture that makes you feel appreciated by family members?',
    followUpPrompt: 'Is it something said, a helping hand, spending time, or giving you space?',
    estimatedMinutes: 4,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'sq-4',
    mode: 'same_question',
    category: 'values',
    title: 'A Meaningful Life',
    prompt: 'Without comparing to anyone else, what does having a "successful and happy day" feel like to you?',
    followUpPrompt: 'Does peace of mind, accomplishment, or human connection matter most?',
    estimatedMinutes: 5,
    ageAppropriateness: 'Ages 10+',
  },
  {
    id: 'sq-5',
    mode: 'same_question',
    category: 'technology',
    title: 'Unplugged Peace',
    prompt: 'When you want to truly relax and recharge, what activity helps you feel calm without staring at a screen?',
    followUpPrompt: 'How easy or hard is it for you to step away from devices right now?',
    estimatedMinutes: 4,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'sq-6',
    mode: 'same_question',
    category: 'misunderstandings',
    title: 'What Others Might Not Guess',
    prompt: 'What is something about your daily schedule or thoughts that you think other generations might misunderstand?',
    followUpPrompt: 'What do you wish they knew before making assumptions?',
    estimatedMinutes: 5,
    ageAppropriateness: 'Ages 10+',
  },
  {
    id: 'sq-7',
    mode: 'same_question',
    category: 'dreams',
    title: 'Curiosity & Next Horizons',
    prompt: 'If you had one free year to learn any skill, art, or language purely for fun, what would you choose?',
    followUpPrompt: 'What draws you to this specific hobby or skill?',
    estimatedMinutes: 4,
    ageAppropriateness: 'All Ages',
  },

  // MODE 2: Then vs. Now
  {
    id: 'tvn-1',
    mode: 'then_vs_now',
    category: 'childhood',
    title: 'Neighborhood & Play',
    prompt: 'How did children spend summer afternoons when you were growing up vs. how young people spend them today?',
    eraHint: 'Think about street games, meeting up with neighborhood kids, and checking in with parents.',
    followUpPrompt: 'What was wonderful about your era, and what looks fun about today’s world?',
    estimatedMinutes: 5,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'tvn-2',
    mode: 'then_vs_now',
    category: 'technology',
    title: 'Staying in Touch',
    prompt: 'How did you reach out to friends when you were in school? How does that compare to group chats and social media now?',
    eraHint: 'Landlines with curly cords, passing paper notes in hallways, payphones vs. instant messaging.',
    followUpPrompt: 'Do you feel people were more or less connected back then?',
    estimatedMinutes: 4,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'tvn-3',
    mode: 'then_vs_now',
    category: 'school_work',
    title: 'Homework & Finding Answers',
    prompt: 'When you had a tough homework question or needed to research something, how did you find the answer?',
    eraHint: 'Physical encyclopedias, library card catalogs vs. search engines and AI.',
    followUpPrompt: 'What are the blessings and the drawbacks of having answers in seconds?',
    estimatedMinutes: 5,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'tvn-4',
    mode: 'then_vs_now',
    category: 'traditions',
    title: 'Family Dinners & Gatherings',
    prompt: 'What were family dinners like in your childhood home compared to today’s busy dinner times?',
    eraHint: 'Set meal times, television trays, eating together at a table vs. flexible eating schedules.',
    followUpPrompt: 'Which parts of mealtime would you love to preserve for future generations?',
    estimatedMinutes: 5,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'tvn-5',
    mode: 'then_vs_now',
    category: 'friendship',
    title: 'Music & Cultural Discoveries',
    prompt: 'How did you discover new music, bands, or favorite stories growing up compared to algorithmic playlists today?',
    eraHint: 'Cassette mixtapes, radio stations, borrowing vinyl or CDs vs. streaming.',
    followUpPrompt: 'Does listening to a full album hold a special magic, or do you prefer instant access?',
    estimatedMinutes: 4,
    ageAppropriateness: 'All Ages',
  },

  // MODE 3: Walk in My Shoes (Fictional, clearly labeled)
  {
    id: 'wms-1',
    mode: 'walk_in_shoes',
    category: 'school_work',
    title: 'Late Night Study vs. Parental Worry',
    prompt: 'In this fictional scenario: A 15-year-old student is up past midnight trying to finish a project, feeling anxious about high expectations. Meanwhile, their parent is knocking on the door, worried about their health and sleep.',
    fictionalScenario: 'Fictional Scenario: Both want the student to thrive, but their immediate priorities are clashing in the hallway.',
    followUpPrompt: 'What is the teenager feeling deep down? What is the parent feeling deep down? Where is their shared love?',
    estimatedMinutes: 6,
    ageAppropriateness: 'Ages 10+',
  },
  {
    id: 'wms-2',
    mode: 'walk_in_shoes',
    category: 'technology',
    title: 'The Silent Dinner Table',
    prompt: 'In this fictional scenario: An older grandparent visits for a holiday meal, but notices younger family members glancing down at their phones during pauses in conversation.',
    fictionalScenario: 'Fictional Scenario: The youth are sharing a funny video between siblings; the grandparent wonders if they are boring everyone.',
    followUpPrompt: 'How could each person gently express what they need without anyone feeling guilty or rejected?',
    estimatedMinutes: 5,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'wms-3',
    mode: 'walk_in_shoes',
    category: 'dreams',
    title: 'Choosing a Life Path',
    prompt: 'In this fictional scenario: A young adult wants to pursue digital game art and freelancing, while their grandparents encourage a traditional, stable office career because of economic hardships they lived through.',
    fictionalScenario: 'Fictional Scenario: One is seeking creative fulfillment in a new economy; the other is protective of financial security.',
    followUpPrompt: 'How can both generations see the good intentions behind each other’s advice?',
    estimatedMinutes: 6,
    ageAppropriateness: 'Teens & Adults',
  },
  {
    id: 'wms-4',
    mode: 'walk_in_shoes',
    category: 'misunderstandings',
    title: 'Asking for Help with Tech',
    prompt: 'In this fictional scenario: An older relative feels embarrassed asking for help with a new smart TV remote, while the younger relative quickly presses buttons without explaining what they are doing.',
    fictionalScenario: 'Fictional Scenario: One wants to maintain independence; the other is trying to solve the problem quickly so they can all enjoy the show.',
    followUpPrompt: 'How can patience and teaching turn this into a bonding moment rather than a frustration?',
    estimatedMinutes: 5,
    ageAppropriateness: 'All Ages',
  },

  // MODE 4: Untold Stories
  {
    id: 'uts-1',
    mode: 'untold_stories',
    category: 'childhood',
    title: 'A Little Adventure or Mischief',
    prompt: 'Tell a story about a harmless adventure, secret fort, or funny mistake you made when you were young that you still smile about.',
    followUpPrompt: 'Did you ever get caught, or did you keep it to yourself until now?',
    estimatedMinutes: 5,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'uts-2',
    mode: 'untold_stories',
    category: 'values',
    title: 'A Lesson from an Unexpected Teacher',
    prompt: 'Can you share a time someone (a stranger, a teacher, a friend, or family member) showed you kindness or taught you a lesson that stayed with you forever?',
    followUpPrompt: 'How did that shape how you treat others today?',
    estimatedMinutes: 6,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'uts-3',
    mode: 'untold_stories',
    category: 'traditions',
    title: 'A Tradition to Keep Alive',
    prompt: 'Is there a family recipe, funny holiday ritual, or habit you hope our family never stops doing, even 30 years from now?',
    followUpPrompt: 'What makes this specific tradition feel like home?',
    estimatedMinutes: 5,
    ageAppropriateness: 'All Ages',
  },
  {
    id: 'uts-4',
    mode: 'untold_stories',
    category: 'gratitude',
    title: 'A Time Someone Helped You Through',
    prompt: 'Think of a moment when you felt a bit lost, nervous, or overwhelmed, and someone quietly stepped in to encourage you.',
    followUpPrompt: 'What words or quiet support made the biggest difference?',
    estimatedMinutes: 5,
    ageAppropriateness: 'Ages 10+',
  },
  {
    id: 'uts-5',
    mode: 'untold_stories',
    category: 'misunderstandings',
    title: 'Something I Wish People Understood',
    prompt: 'Is there something about what it feels like to be your age right now that you wish people around you understood a bit better?',
    followUpPrompt: 'Remember: This is a safe space with no judgment, and skipping is completely fine.',
    estimatedMinutes: 6,
    ageAppropriateness: 'All Ages',
  },
];

// Pre-seeded demo session for instant live competition walkthrough
export const DEMO_PRESET_SESSION = {
  participants: [
    {
      id: 'demo-p1',
      name: 'Grandma Eleanor',
      ageGroup: 'senior' as const,
      generationLabel: 'Grandparent (72)',
      avatarColor: '#FDE68A', // pastel yellow
      emoji: '👵'
    },
    {
      id: 'demo-p2',
      name: 'Dad Marcus',
      ageGroup: 'adult' as const,
      generationLabel: 'Parent (44)',
      avatarColor: '#BFDBFE', // pastel blue
      emoji: '👨'
    },
    {
      id: 'demo-p3',
      name: 'Maya',
      ageGroup: 'teen' as const,
      generationLabel: 'Teenager (15)',
      avatarColor: '#FBCFE8', // pastel pink
      emoji: '👧'
    }
  ],
  sampleQuestion: CURATED_QUESTIONS[0], // "Qualities of a True Friend"
  sampleAnswers: [
    {
      participantId: 'demo-p1',
      participantName: 'Grandma Eleanor',
      answerText: 'Someone who remembers your life story, picks up right where you left off even after months apart, and sits with you in quiet without needing constant entertainment.',
      isAloud: false,
      passed: false,
      submittedAt: 'Just now'
    },
    {
      participantId: 'demo-p2',
      participantName: 'Dad Marcus',
      answerText: 'Someone you can call at 2:00 AM if your car breaks down, who gives you honest constructive feedback without sugarcoating, but always has your back.',
      isAloud: false,
      passed: false,
      submittedAt: 'Just now'
    },
    {
      participantId: 'demo-p3',
      participantName: 'Maya',
      answerText: 'Someone who listens without judging your feelings, sends you memes when you are having a rough day, and lets you be your weird authentic self without pretending.',
      isAloud: false,
      passed: false,
      submittedAt: 'Just now'
    }
  ],
  sampleAiHighlights: {
    sharedValues: [
      'Unconditional loyalty & being there in vulnerable moments',
      'The desire for authenticity: no need to pretend or put on a mask',
      'Trust that endures across time and distance'
    ],
    differentInterpretations: [
      'Communication style: quiet presence (Eleanor) vs. practical reliability (Marcus) vs. daily digital warmth & humor (Maya)',
      'How closeness is maintained through life stages'
    ],
    surprisingSimilarities: [
      'All three generations prioritize psychological safety over superficial popularity',
      'Everyone cherishes having at least one person who accepts them completely'
    ],
    discussionSpark: 'What is one way we can show this kind of friendship to each other inside our own family this week?'
  }
};
