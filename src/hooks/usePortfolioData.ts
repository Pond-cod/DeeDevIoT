"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  ProjectItem, ServiceData, IntegrationData, 
  ConceptItem, SiteConfig, SectionData, SectionItemData, NavData 
} from '../types/portfolio';

export const DEFAULT_CONCEPTS: ConceptItem[] = [
  {
    id: 'stability',
    title_th: 'Industrial Stability',
    title_en: 'Industrial Grade Stability',
    desc_th: 'ออกแบบฮาร์ดแวร์และเฟิร์มแวร์เน้นความทนทาน ทำงานต่อเนื่อง 24/7 พร้อมระบบ Watchdog ป้องกันค้าง',
    desc_en: 'Built with hardware watchdog timers, isolated power relays, and noise immunity for 24/7 non-stop operations.',
    icon: 'ShieldCheck'
  },
  {
    id: 'cloud',
    title_th: 'Sub-second Cloud Sync',
    title_en: 'Real-time Telemetry Delivery',
    desc_th: 'ส่งข้อมูลสดสู่ Cloud Platform ด้วยโปรโตคอล MQTT / WebSockets ตอบสนองทันทีแบบ Real-time',
    desc_en: 'Real-time telemetry and command delivery using lightweight, ultra-low-latency protocols.',
    icon: 'Zap'
  },
  {
    id: 'security',
    title_th: 'Enterprise Security',
    title_en: 'Data Security & Privacy',
    desc_th: 'เข้ารหัสข้อมูลตั้งแต่ระดับ Microcontroller ป้องกันการดักจับ และจัดเก็บฐานข้อมูลแยกเป็นสัดส่วน',
    desc_en: 'End-to-end payload encryption and secure token authentication at every network layer.',
    icon: 'Lock'
  },
  {
    id: 'custom',
    title_th: '100% Tailor-made',
    title_en: 'Customized to Your Business',
    desc_th: 'พัฒนาตามขั้นตอนธุรกิจจริงของท่าน ไม่ยึดติดกับแพ็กเกจสำเร็จรูป พร้อมต่อยอดสู่ LINE OA และ ERP',
    desc_en: 'Fully adapted to your business SOP, seamless integration with LINE OA, Google Sheets, or internal ERP.',
    icon: 'Cpu'
  }
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  hero_headline_th: 'วิศวกรรม IoT และแพลตฟอร์มระบบ สำหรับธุรกิจยุคใหม่',
  hero_headline_en: 'Industrial IoT & Production-Ready Web Engineering',
  hero_sub_th: 'ออกแบบฮาร์ดแวร์ บอร์ดคอนโทรล ระบบอัตโนมัติ และเว็บแอปพลิเคชันสำหรับภาคธุรกิจแบบครบวงจร',
  hero_sub_en: 'Custom hardware design, embedded firmware, and real-time cloud web applications.',
  contact_facebook_th: 'DeeDevIOT',
  contact_facebook_en: 'DeeDevIOT',
  contact_messenger: 'https://m.me/DeeDevIOT',
  contact_email: 'hello@deedeviot.com',
  contact_phone: '02-xxx-xxxx'
};

// Global in-memory cache across navigation
let globalCache: {
  services: ServiceData[];
  integrations: IntegrationData[];
  config: SiteConfig;
  concepts: ConceptItem[];
  sections: SectionData[];
  sectionItems: SectionItemData[];
  navLinks: NavData[];
  lastFetched: number;
} | null = null;

const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

export function usePortfolioData() {
  const [services, setServices] = useState<ServiceData[]>(globalCache?.services || []);
  const [integrations, setIntegrations] = useState<IntegrationData[]>(globalCache?.integrations || []);
  const [config, setConfig] = useState<SiteConfig>(globalCache?.config || DEFAULT_SITE_CONFIG);
  const [concepts, setConcepts] = useState<ConceptItem[]>(globalCache?.concepts || DEFAULT_CONCEPTS);
  const [sections, setSections] = useState<SectionData[]>(globalCache?.sections || []);
  const [sectionItems, setSectionItems] = useState<SectionItemData[]>(globalCache?.sectionItems || []);
  const [navLinks, setNavLinks] = useState<NavData[]>(globalCache?.navLinks || []);
  const [isLoading, setIsLoading] = useState<boolean>(!globalCache);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && globalCache && now - globalCache.lastFetched < CACHE_TTL_MS) {
      setServices(globalCache.services);
      setIntegrations(globalCache.integrations);
      setConfig(globalCache.config);
      setConcepts(globalCache.concepts);
      setSections(globalCache.sections);
      setSectionItems(globalCache.sectionItems);
      setNavLinks(globalCache.navLinks);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [svcRes, intRes, cfgRes, cptRes, secRes, itmRes, navRes] = await Promise.all([
        fetch('/api/services', { cache: 'no-store' }),
        fetch('/api/integrations', { cache: 'no-store' }),
        fetch('/api/config', { cache: 'no-store' }),
        fetch('/api/concept', { cache: 'no-store' }),
        fetch('/api/sections', { cache: 'no-store' }),
        fetch('/api/section-items', { cache: 'no-store' }),
        fetch('/api/nav', { cache: 'no-store' })
      ]);

      const [svcJson, intJson, cfgJson, cptJson, secJson, itmJson, navJson] = await Promise.all([
        svcRes.json().catch(() => ({ success: false, data: [] })),
        intRes.json().catch(() => ({ success: false, data: [] })),
        cfgRes.json().catch(() => ({ success: false, data: {} })),
        cptRes.json().catch(() => ({ success: false, data: [] })),
        secRes.json().catch(() => ({ success: false, data: [] })),
        itmRes.json().catch(() => ({ success: false, data: [] })),
        navRes.json().catch(() => ({ success: false, data: [] }))
      ]);

      const newServices = svcJson.success && Array.isArray(svcJson.data) ? svcJson.data : [];
      const newIntegrations = intJson.success && Array.isArray(intJson.data) ? intJson.data : [];
      const newConfig = cfgJson.success && cfgJson.data ? { ...DEFAULT_SITE_CONFIG, ...cfgJson.data } : DEFAULT_SITE_CONFIG;
      const newConcepts = cptJson.success && Array.isArray(cptJson.data) && cptJson.data.length > 0 ? cptJson.data : DEFAULT_CONCEPTS;
      const newSections = secJson.success && Array.isArray(secJson.data) ? secJson.data : [];
      const newItems = itmJson.success && Array.isArray(itmJson.data) ? itmJson.data : [];
      const newNav = navJson.success && Array.isArray(navJson.data) ? navJson.data : [];

      globalCache = {
        services: newServices,
        integrations: newIntegrations,
        config: newConfig,
        concepts: newConcepts,
        sections: newSections,
        sectionItems: newItems,
        navLinks: newNav,
        lastFetched: now
      };

      setServices(newServices);
      setIntegrations(newIntegrations);
      setConfig(newConfig);
      setConcepts(newConcepts);
      setSections(newSections);
      setSectionItems(newItems);
      setNavLinks(newNav);
    } catch (err: any) {
      console.error('Error loading portfolio data:', err);
      setError(err?.message || 'Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transformed projects (combines integrations + services into unified project items)
  const allProjects: ProjectItem[] = [
    ...integrations.map((item, idx) => ({
      id: item.id || `portfolio-${idx}`,
      name: item.title_th || item.title || 'โปรเจกต์ระบบ',
      category: item.tag || 'Portfolio',
      categoryKey: (item.tag || 'portfolio').trim().toLowerCase(),
      description: item.description_th || item.description || 'ระบบเชื่อมต่อและพัฒนาเฉพาะทางสำหรับธุรกิจ',
      technologies: item.tag ? [item.tag, 'System Architecture', 'Integration'] : ['Full-Stack Solution'],
      imageUrl: item.imageUrl || '',
      demoUrl: item.referenceUrl || undefined,
      manualUrl: item.manualUrl || undefined,
      architectureDetails: [
        'ออกแบบสถาปัตยกรรมระบบตามข้อกำหนดของธุรกิจ',
        'โครงสร้างระบบปลอดภัย รองรับการขยายและเชื่อมต่อ API'
      ],
      sourceType: 'portfolio' as const
    })),
    ...services.map((cmsItem, idx) => ({
      id: cmsItem.id || `service-${idx}`,
      name: cmsItem.title_th || cmsItem.title || 'บริการโซลูชัน',
      category: cmsItem.icon || 'Service Solution',
      categoryKey: (cmsItem.icon || 'service').trim().toLowerCase(),
      description: cmsItem.description_th || cmsItem.description || '',
      technologies: ['Custom Solution', 'Production Architecture', 'Integration'],
      imageUrl: cmsItem.imageUrl || '',
      demoUrl: cmsItem.demoUrl || undefined,
      manualUrl: cmsItem.manualUrl || undefined,
      videoUrls: cmsItem.videoUrls ? cmsItem.videoUrls.split(',').map((v: string) => v.trim()).filter(Boolean) : undefined,
      architectureDetails: ['ออกแบบและพัฒนาเฉพาะสำหรับโจทย์ทางธุรกิจและองค์กร'],
      sourceType: 'service' as const
    }))
  ];

  const categories = Array.from(new Set(allProjects.map(p => p.category).filter(Boolean)));

  return {
    services,
    integrations,
    config,
    concepts,
    sections,
    sectionItems,
    navLinks,
    allProjects,
    categories,
    isLoading,
    error,
    refreshData: () => fetchData(true)
  };
}
