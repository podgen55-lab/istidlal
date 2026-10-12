export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  role: UserRole;
  streak: number;
  xp: number;
  level: number;
  hearts: number;
  classCode?: string;
  avatar: string;
}

export interface LessonResource {
  summary: string;
  videoUrl?: string;
  videoChapters?: { time: string; title: string }[];
  podcastUrl?: string;
  podcastDuration?: string;
  podcastTranscript?: { speaker: string; text: string }[];
  flashcards?: { id?: string; front: string; back: string; frenchTerm?: string }[];
  exercise?: {
    id?: string;
    title: string;
    description: string;
    points: number;
    modelAnswer: string;
  };
}

export interface Lesson {
  id: string;
  unitId?: string;
  domainId?: string;
  title: string;
  french?: string;
  duration?: string;
  trimester?: number | null;
  plannedWeek?: number | null;
  completed?: boolean;
  score?: number;
  resources?: LessonResource;
}

export interface Unit {
  id: string;
  domainId?: string;
  title: string;
  lessons: Lesson[];
}

export interface Domain {
  id: string;
  title: string;
  emoji: string;
  units: Unit[];
}

export interface AgentInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  role: string;
  description: string;
  isTeacherOnly?: boolean;
  samplePrompt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  frenchTerm?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  reasoningLevel: number; // 1 to 4
  verb: string;
}

export type Question = QuizQuestion;

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  avatar: string;
}

export interface QuizResult {
  score: number;
  total: number;
  xpEarned: number;
  answers: { questionId: string; selected: number; isCorrect: boolean }[];
  masteredTopics: string[];
  reviewTopics: string[];
}
