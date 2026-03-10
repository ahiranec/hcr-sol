import { 
  getHomeBranding,
  updateHomeBranding,
  getHomeHero,
  updateHomeHeroHeadline,
  addHeroImage,
  removeHeroImage,
  reorderHeroImages,
  getCarouselDev,
  reorderCarouselDev,
  getCarouselDone,
  reorderCarouselDone,
  getProjectDetail,
  updateProjectDetailBlocks,
  type MockHomeBranding,
  type MockHomeHero,
  type MockHeroImage,
  type MockCarouselProject,
  type MockProjectDetail,
  type MockProjectDetailBlock
} from '../mocks';

export const homeRepo = {
  async getHomeBranding(): Promise<MockHomeBranding> { return getHomeBranding(); },
  async updateHomeBranding(updates: Partial<MockHomeBranding>): Promise<void> { updateHomeBranding(updates); },
  async getHomeHero(): Promise<MockHomeHero> { return getHomeHero(); },
  async updateHomeHeroHeadline(headline: string): Promise<void> { updateHomeHeroHeadline(headline); },
  async addHeroImage(image_url: string): Promise<void> { addHeroImage(image_url); },
  async removeHeroImage(imageId: string): Promise<void> { removeHeroImage(imageId); },
  async reorderHeroImages(images: MockHeroImage[]): Promise<void> { reorderHeroImages(images); },
  async getCarouselDev(): Promise<MockCarouselProject[]> { return getCarouselDev(); },
  async reorderCarouselDev(projects: MockCarouselProject[]): Promise<void> { reorderCarouselDev(projects); },
  async getCarouselDone(): Promise<MockCarouselProject[]> { return getCarouselDone(); },
  async reorderCarouselDone(projects: MockCarouselProject[]): Promise<void> { reorderCarouselDone(projects); },
  async getProjectDetail(projectSlug: string): Promise<MockProjectDetail | null> { return getProjectDetail(projectSlug); },
  async updateProjectDetailBlocks(projectSlug: string, blocks: MockProjectDetailBlock[]): Promise<void> { updateProjectDetailBlocks(projectSlug, blocks); },

  // Sync fallbacks for UI
  getHomeBrandingSync(): MockHomeBranding { return getHomeBranding(); },
  getHomeHeroSync(): MockHomeHero { return getHomeHero(); },
  getCarouselDevSync(): MockCarouselProject[] { return getCarouselDev(); },
  getCarouselDoneSync(): MockCarouselProject[] { return getCarouselDone(); },
  getProjectDetailSync(projectSlug: string): MockProjectDetail | null { return getProjectDetail(projectSlug); }
};

export type { 
  MockHomeBranding,
  MockHomeHero,
  MockHeroImage,
  MockCarouselProject,
  MockProjectDetail,
  MockProjectDetailBlock
};
