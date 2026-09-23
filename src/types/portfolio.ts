export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string; // Content link / Live demo
  manualUrl?: string; // Documentation / Manual link
  videoUrls?: string[];
  architectureDetails: string[];
  sourceType: 'portfolio' | 'service';
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  title_th?: string;
  description_th?: string;
  icon: string;
  imageUrl: string;
  demoUrl?: string;
  videoUrls?: string;
  manualUrl?: string;
}

export interface IntegrationData {
  id: string;
  title: string;
  description: string;
  title_th?: string;
  description_th?: string;
  imageUrl: string;
  tag: string;
  referenceUrl: string;
  manualUrl?: string;
}

export interface ConceptItem {
  id: string;
  title_en: string;
  title_th: string;
  desc_en: string;
  desc_th: string;
  icon: string;
}

export interface SiteConfig {
  hero_badge_en?: string;
  hero_badge_th?: string;
  hero_headline_en?: string;
  hero_headline_th?: string;
  hero_sub_en?: string;
  hero_sub_th?: string;
  hero_btn1_text_en?: string;
  hero_btn1_text_th?: string;
  hero_btn1_link?: string;
  hero_btn2_text_en?: string;
  hero_btn2_text_th?: string;
  hero_btn2_link?: string;
  why_badge_en?: string;
  why_badge_th?: string;
  why_choose_title_en?: string;
  why_choose_title_th?: string;
  why1_title_en?: string;
  why1_title_th?: string;
  why1_desc_en?: string;
  why1_desc_th?: string;
  why2_title_en?: string;
  why2_title_th?: string;
  why2_desc_en?: string;
  why2_desc_th?: string;
  why3_title_en?: string;
  why3_title_th?: string;
  why3_desc_en?: string;
  why3_desc_th?: string;
  why4_title_en?: string;
  why4_title_th?: string;
  why4_desc_en?: string;
  why4_desc_th?: string;
  svc_badge_en?: string;
  svc_badge_th?: string;
  svc_title_en?: string;
  svc_title_th?: string;
  svc_desc_en?: string;
  svc_desc_th?: string;
  solutions_title_en?: string;
  solutions_title_th?: string;
  solutions_description_en?: string;
  solutions_description_th?: string;
  int_badge_en?: string;
  int_badge_th?: string;
  int_title_en?: string;
  int_title_th?: string;
  int_desc_en?: string;
  int_desc_th?: string;
  integrations_title_en?: string;
  integrations_title_th?: string;
  port_badge_en?: string;
  port_badge_th?: string;
  port_desc_en?: string;
  port_desc_th?: string;
  cta_heading_en?: string;
  cta_heading_th?: string;
  footer_bio_en?: string;
  footer_bio_th?: string;
  facebook_url?: string;
  contact_title_en?: string;
  contact_title_th?: string;
  contact_sub_en?: string;
  contact_sub_th?: string;
  contact_description_en?: string;
  contact_description_th?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_facebook_en?: string;
  contact_facebook_th?: string;
  contact_messenger?: string;
  contact_line?: string;
  nav_item1_en?: string;
  nav_item1_th?: string;
  nav_btn_en?: string;
  nav_btn_th?: string;
  back_btn_en?: string;
  back_btn_th?: string;
  concept_title1_en?: string;
  concept_title1_th?: string;
  concept_title2_en?: string;
  concept_title2_th?: string;
  concept_description_en?: string;
  concept_description_th?: string;
  visitor_count?: string;
  [key: string]: string | undefined;
}

export interface SectionData {
  id: string;
  title_en: string;
  title_th: string;
  subtitle_en: string;
  subtitle_th: string;
  is_active: string;
}

export interface SectionItemData {
  id: string;
  section_id: string;
  title_en: string;
  title_th: string;
  desc_en: string;
  desc_th: string;
  icon: string;
  imageUrl: string;
}

export interface NavData {
  id: string;
  label_en: string;
  label_th: string;
  href: string;
}

export interface IoTDeviceState {
  id: string;
  name: string;
  locationName: string;
  hardwareModel: string;
  connectionStatus: 'Online' | 'Offline' | 'Warning';
  relayStatus: boolean;
  temperatureCelsius: number;
  humidityPercentage: number;
  wifiSignalDbm: number;
  connectionLatencyMs: number | null;
  lastSeenTimestamp: string;
  telemetryHistory: { time: string; temp: number; humidity: number; latency: number }[];
}

export interface DeviceTelemetryEvent {
  eventId: string;
  timestamp: string;
  deviceName: string;
  eventDescription: string;
  severity: 'info' | 'warning' | 'normal';
}
