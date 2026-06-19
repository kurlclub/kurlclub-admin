export type FeatureAnnouncementStatus = 'draft' | 'published';

/** A single announcement slide. An announcement can bundle several of these,
 *  all sharing the same version / minimum version. */
export interface FeatureItem {
  /** Image URL shown in the announcement slide. */
  src: string;
  /** Small label shown above the title (e.g. "New"). */
  tag: string;
  title: string;
  description: string;
}

export interface FeatureAnnouncement {
  id: number;
  /** Version this announcement was introduced in (e.g. "2.4.0"). */
  version: string;
  /** Minimum app version required to use the features (e.g. "2.0.0"). */
  minimumVersion: string;
  /** One or more slides shown to users. */
  features: FeatureItem[];
  status: FeatureAnnouncementStatus;
  createdAt: string;
  updatedAt: string;
  // ── Legacy single-slide fields, kept optional so older API records still
  //    load. New records use `features` instead. See getFeatureItems().
  src?: string;
  tag?: string;
  title?: string;
  description?: string;
}

export interface FeatureAnnouncementFormData {
  version: string;
  minimumVersion: string;
  features: FeatureItem[];
  status: FeatureAnnouncementStatus;
}

/** Returns an announcement's slides, falling back to the legacy top-level
 *  fields for records created before multi-feature support. */
export const getFeatureItems = (
  feature: Pick<
    FeatureAnnouncement,
    'features' | 'src' | 'tag' | 'title' | 'description'
  >,
): FeatureItem[] => {
  if (feature.features && feature.features.length > 0) return feature.features;
  if (feature.src || feature.tag || feature.title || feature.description) {
    return [
      {
        src: feature.src ?? '',
        tag: feature.tag ?? '',
        title: feature.title ?? '',
        description: feature.description ?? '',
      },
    ];
  }
  return [];
};

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
