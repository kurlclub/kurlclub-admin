export type FeatureAnnouncementStatus = 'draft' | 'published';

export interface FeatureAnnouncement {
  id: number;
  /** Image URL shown in the announcement slide. */
  src: string;
  /** Small label shown above the title (e.g. "New"). */
  tag: string;
  title: string;
  description: string;
  status: FeatureAnnouncementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureAnnouncementFormData {
  src: string;
  tag: string;
  title: string;
  description: string;
  status: FeatureAnnouncementStatus;
}

export type FeatureAnnouncementUpdateData =
  Partial<FeatureAnnouncementFormData>;

export interface FeatureAnnouncementListMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface FeatureAnnouncementListResult {
  features: FeatureAnnouncement[];
  meta: FeatureAnnouncementListMeta;
}

export type FeatureAnnouncementListStatus = FeatureAnnouncementStatus | 'all';

export interface FeatureAnnouncementListParams {
  limit?: number;
  page?: number;
  status?: FeatureAnnouncementListStatus;
}
