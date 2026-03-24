const { getConfig, updateConfig } = require('./src/lib/google');

async function sync() {
  try {
    const current = await getConfig();
    const updates = {
      ...current,
      "solutions_title_th": "บริการ",
      "solutions_title_en": "Services",
      "hero_headline_th": "ยกระดับธุรกิจของคุณ <br /> ด้วยโซลูชัน WEB APP & IOT อัจฉริยะ",
      "hero_btn1_text_en": "Consult our Expert",
      "hero_btn1_text_th": "ปรึกษาผู้เชี่ยวชาญ",
      "hero_btn1_link_en": "#contact",
      "hero_btn1_link_th": "#contact",
      "hero_btn2_text_en": "See Our Portfolio",
      "hero_btn2_text_th": "ดูผลงานของเรา",
      "hero_btn2_link_en": "#services",
      "hero_btn2_link_th": "#services",
    };
    
    // Ensure all bilingual keys are correctly handled
    const bilingualKeys = [
      'hero_badge', 'hero_headline', 'hero_sub', 'hero_btn1_text', 'hero_btn2_text',
      'why_badge', 'why_choose_title', 'why1_title', 'why1_desc', 'why2_title', 'why2_desc',
      'why3_title', 'why3_desc', 'why4_title', 'why4_desc', 'svc_badge', 'solutions_title',
      'port_badge', 'integrations_title', 'port_desc', 'cta_heading', 'footer_bio',
      'nav_item1', 'nav_btn',
      'concept_title1', 'concept_title2', 'concept_description', 
      'concept_c1t', 'concept_c1d', 'concept_c2t', 'concept_c2d', 'concept_c3t', 'concept_c3d',
      'contact_title', 'contact_description', 'contact_facebook'
    ];

    // For any keys that are currently missing TH values in the sheet, 
    // we use the English value as the default if it matches the key name.
    
    await updateConfig(updates);
    console.log("Sync complete!");
  } catch (err) {
    console.error("Sync failed:", err);
    process.exit(1);
  }
}

sync();
