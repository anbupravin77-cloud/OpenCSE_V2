export type Subject = {
  id: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  department: string;
  credits: number;
  academic_year: string;
  cover_image?: string;
  prerequisites?: string;
  objectives?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CO = {
  id: string;
  subject_id: string;
  code: string;
  name: string;
  description: string;
  display_order: number;
};

export type Topic = {
  id: string;
  subject_id: string;
  co_id: string;
  title: string;
  description: string;
  content: string; // Rich text HTML
  display_order: number;
};

export type Resource = {
  id: string;
  subject_id: string;
  topic_id: string;
  title: string;
  description?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  display_order: number;
  created_at?: string;
};

export type AcademicResource = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string; // Rich text HTML
  reading_time_minutes: number;
  related_subject_id?: string;
  related_topic_id?: string;
  status: 'DRAFT' | 'PUBLISHED';
  created_at?: string;
  updated_at?: string;
};

export type DB = {
  subjects: Subject[];
  cos: CO[];
  topics: Topic[];
  resources: Resource[];
  academic_resources: AcademicResource[];
};

export type YearType = '1st' | '2nd' | '3rd' | '4th';

// Joined types for easy frontend usage
export type FullTopic = Topic & { resources: Resource[] };
export type FullCO = CO & { topics: FullTopic[] };
export type FullSubject = Subject & { cos: FullCO[] };

// --- 54-Point Diagnostic Audit Engine Types ---
export type AuditStatus = 'PASS' | 'WARNING' | 'FAIL' | 'NOT_VERIFIED' | 'NOT_APPLICABLE';

export type AuditCategory = 'technical' | 'content' | 'legal' | 'seo' | 'ux';

export interface AuditCheckpoint {
  id: string;
  pointNumber: number;
  category: AuditCategory;
  title: string;
  status: AuditStatus;
  evidence: string;
  whyItMatters: string;
  whatWeDetected: string;
  recommendation: string;
  scoreWeight: number; // 1 to 3
  isCriticalRoadblock?: boolean;
}

export interface ContentMetrics {
  homepageWordCount: number;
  indexablePagesCount: number;
  totalMeaningfulWords: number;
  averageArticleDepth: number;
  legalPageWordCount: number;
  thinPagesCount: number;
}

export interface InternalLinkStats {
  totalLinksFound: number;
  uniqueDestinations: number;
  brokenLinks: number;
  internalList: string[];
}

export interface AuditReport {
  url: string;
  timestamp: string;
  readinessScore: number; // 0 - 100%
  categoryScores: {
    technical: number;
    content: number;
    legal: number;
    seo: number;
    ux: number;
  };
  summary: {
    totalPoints: number;
    passedPoints: number;
    warningPoints: number;
    failedPoints: number;
    notVerifiedPoints: number;
    criticalRoadblocks: number;
  };
  contentMetrics: ContentMetrics;
  linkStats: InternalLinkStats;
  checkpoints: AuditCheckpoint[];
  disclaimer: string;
}
