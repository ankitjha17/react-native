/**
 * CMS Types
 * Type definitions for CMS/Strapi data
 */

export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: {
    large?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiOnboardingScreenStep {
  id: number;
  Title: string;
  SubTitle: string;
  Duration: string;
  ImageUrl: StrapiImage;
}

export interface StrapiLoginScreen {
  id: number;
  Title: string;
  SubTitle: string;
  Description: string;
  FormText: string;
  BtnText: string;
  Logo: StrapiImage | null;
  Flag: StrapiImage | null;
}

export interface StrapiValidationScreen {
  id: number;
  Title: string;
  Description: string;
  Text: string;
  BtnText: string;
  Resend?: string;
  Logo: StrapiImage | null;
}

export interface CMSResponse {
  data: CMSItem[];
  meta: StrapiPaginationMeta;
}

export interface CMSItem {
  id: number;
  documentId: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  LoginScreen: StrapiLoginScreen | null;
  ValidationScreen: StrapiValidationScreen | null;
  Onboarding: {
    id: number;
    Icon: StrapiImage | null;
    OnboardingScreen: StrapiOnboardingScreenStep[];
  } | null;
}

export interface StrapiPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  duration: number; // milliseconds
}

export interface LoginScreenData {
  title: string;
  subtitle: string;
  description: string;
  formText: string;
  btnText: string;
  logoUrl: string | null;
  flagUrl: string | null;
}

export interface ValidationScreenData {
  title: string;
  description: string;
  text: string;
  btnText: string;
  resend: string;
  logoUrl: string | null;
}

export interface CMSData {
  onboarding: {
    logoUrl: string | null;
    steps: OnboardingStep[];
  };
  loginScreen: LoginScreenData | null;
  validationScreen: ValidationScreenData | null;
}

export interface GetCMSDataParams {
  pLevel?: string;
}
