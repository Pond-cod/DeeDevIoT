import { google } from 'googleapis';

// สร้าง Helper Function เพื่อใช้งาน Auth และ Sheets ร่วมกัน
function getGoogleAuth() {
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
  // แทนที่ \n ที่เป็นตัวอักษรด้วย Newline จริงๆ เพื่อไม่ให้คีย์พัง
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    throw new Error('Missing Google Sheets credentials in Environment Variables');
  }

  // สร้าง GoogleAuth Instance โดยใช้ scope ที่ให้สิทธิ์ทั้งอ่านและเขียน
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], 
  });

  // สร้าง Client สำหรับเชื่อมต่อ Sheets API v4
  const sheets = google.sheets({ version: 'v4', auth });

  return { sheets, GOOGLE_SHEET_ID };
}

export async function getSheetValues(range: string) {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();

    // ดึงข้อมูลจาก spreadsheetId และช่วงข้อมูล (range) ที่ระบุ
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
    });

    // Return ค่า data.values กลับไปตามสเปคที่ต้องการ
    return response.data.values || [];
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}

export async function appendSheetValues(range: string, values: any[][]) {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();

    // เขียนข้อมูลต่อท้ายใน Document ด้วย append
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending Google Sheets data:', error);
    throw error;
  }
}

export async function updateSheetRow(id: string, values: any[]) {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();

    const currentData = await getSheetValues('Services!A2:H');
    const rowIndex = currentData.findIndex((row) => row[0] === id);

    if (rowIndex !== -1) {
      const rowNumber = rowIndex + 2;
      const range = `Services!A${rowNumber}:H${rowNumber}`;

      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [values] },
      });

      return response.data;
    } else {
      throw new Error(`Row with ID ${id} not found in Services.`);
    }
  } catch (error) {
    console.error('Error updating Google Sheets data:', error);
    throw error;
  }
}

// ----------------------
// CONFIG INTEGRATION
// ----------------------

export async function getConfig() {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();
    let rows;
    
    try {
      rows = await getSheetValues('SiteConfig!A2:C');
    } catch (e: any) {
      if (e.message && e.message.includes('Unable to parse range')) rows = [];
      else throw e;
    }

    if (!rows || rows.length === 0) {
      // Auto-Seed Data
      const headers = ['Key', 'Value', 'ThaiValue'];
      const defaultData = [
        ['hero_badge', 'Professional Technology Solutions', 'พรีเมียมเทคโนโลยีโซลูชัน'],
        ['hero_headline', 'Transform Your Business with \nIntelligent Web & IoT Solutions', 'ยกระดับธุรกิจของคุณด้วย โซลูชัน Web App & IoT อัจฉริยะ'],
        ['hero_sub', 'Bridging the gap between digital platforms and physical hardware. We deliver seamless integration from web-based management software to smart hardware automation.', 'จากซอฟต์แวร์จัดการบนเว็บ สู่การควบคุมบอร์ด Arduino/ESP32 ไร้รอยต่อ'],
        ['hero_btn1_text', 'Explore Solutions', 'ดูโซลูชันของเรา'],
        ['hero_btn1_link', '#services', '#services'],
        ['hero_btn2_text', 'Get a Quote', 'ขอใบเสนอราคา'],
        ['hero_btn2_link', '#contact', '#contact'],
        ['why_badge', 'WHY CHOOSE US', 'ทำไมถึงต้องเลือกเรา'],
        ['why_choose_title', 'What Makes Us Different', 'ความแตกต่างที่ทำให้เราโดดเด่น'],
        ['why1_title', 'Domain Expertise', 'ความเชี่ยวชาญเฉพาะด้าน'],
        ['why1_desc', 'Specialized professionals in full-stack web development and IoT hardware engineering.', 'ทีมงานมืออาชีพที่มีความเชี่ยวชาญทั้งด้าน Web Development และ IoT Hardware'],
        ['why2_title', 'Agile Delivery', 'การส่งมอบที่รวดเร็ว'],
        ['why2_desc', 'Rapid deployment with flexible, on-the-fly adaptations to meet your strict deadlines.', 'พัฒนาและส่งมอบงานได้อย่างรวดเร็ว พร้อมยืดหยุ่นปรับเปลี่ยนตามความต้องการ'],
        ['why3_title', 'Cost-Effective', 'คุ้มค่าการลงทุน'],
        ['why3_desc', 'Transparent pricing with high ROI on every digital innovation you receive.', 'ราคาโปร่งใส ให้ผลตอบแทนคุ้มค่าในทุกนวัตกรรมดิจิทัลที่คุณได้รับ'],
        ['why4_title', 'Premium Support', 'บริการดูแลหลังการขาย'],
        ['why4_desc', 'Dedicated system maintenance and highly responsive technical consulting.', 'ดูแลรักษาระบบอย่างใกล้ชิด พร้อมให้คำปรึกษาทางเทคนิคอย่างรวดเร็ว'],
        ['svc_badge', 'OUR SOLUTIONS', 'โซลูชันของเรา'],
        ['solutions_title', 'Tailored Services for Your Business', 'บริการที่ออกแบบมาเพื่อธุรกิจคุณโดยเฉพาะ'],
        ['port_badge', 'INTEGRATIONS', 'ผลงานของเรา'],
        ['integrations_title', 'Seamless Ecosystem Connectivity', 'ทำงานร่วมกับแพลตฟอร์มอื่นอย่างไร้รอยต่อ'],
        ['port_desc', 'Enhance your workflow flawlessly by connecting our custom-built platforms with the everyday tools you already trust.', 'เพิ่มประสิทธิภาพการทำงานด้วยการเชื่อมต่อแพลตฟอร์มของเรากับเครื่องมือที่คุณคุ้นเคย'],
        ['cta_heading', 'Ready to Start Your Next Big Project?', 'พร้อมเริ่มพัฒนาโปรเจกต์ของคุณแล้วหรือยัง?'],
        ['footer_bio', 'Your trusted tech partner in turning innovative ideas into powerful, real-world Web & Hardware platforms.', 'พาร์ทเนอร์ที่พร้อมสานต่อไอเดียของคุณให้กลายเป็นแพลตฟอร์มที่ใช้งานได้จริง'],
        ['facebook_url', 'https://facebook.com/deedeviot', ''],
        ['nav_item1', 'Concept', 'แนวคิด'],
        ['nav_btn', 'Contact Us', 'ติดต่อเรา'],
        ['concept_title1', 'SMART', 'สมาร์ท'],
        ['concept_title2', 'GEARING', 'เกียร์ริ่ง'],
        ['concept_description', 'Our systems work in harmony like precision-engineered gears.', 'ระบบของเราทำงานร่วมกันอย่างสมบูรณ์แบบ เหมือนฟันเฟืองที่ผ่านการวิศวกรรมมาอย่างแม่นยำ'],
        ['concept_c1t', 'Precision Eng.', 'ความแม่นยำสูง'],
        ['concept_c1d', 'Every line of code and IoT component is designed for perfect harmony.', 'ทุกบรรทัดของโค้ดและส่วนประกอบ IoT ถูกออกแบบมาเพื่อความสอดคล้องที่ลงตัว'],
        ['concept_c2t', 'High Velocity', 'ความเร็วสูงสุด'],
        ['concept_c2d', 'Accelerate your business with high-performance systems.', 'เร่งสปีดธุรกิจของคุณด้วยระบบที่มีประสิทธิภาพและรวดเร็ว'],
        ['concept_c3t', 'Steady Growth', 'การเติบโตที่มั่นคง'],
        ['concept_c3d', 'Reliable tech that ensures your business thrives consistently.', 'เทคโนโลยีที่เชื่อถือได้ เพื่อให้มั่นใจว่าธุรกิจของคุณจะเติบโตอย่างต่อเนื่อง'],
        ['contact_title', 'READY TO POWER UP?', 'พร้อมที่จะขับเคลื่อนไปข้างหน้าหรือยัง?'],
        ['contact_description', 'Our gears are ready. Let us power your success.', 'ฟันเฟืองของเราพร้อมแล้ว ให้เราเป็นส่วนหนึ่งในความสำเร็จของคุณ'],
        ['contact_email', 'hello@deedeviot.com', 'hello@deedeviot.com'],
        ['contact_phone', '02-123-4567', '02-123-4567'],
        ['contact_facebook', 'DeeDevIOT Page', 'เพจ DeeDevIOT'],
        ['contact_line', '@DEEDEVIOT', '@DEEDEVIOT']
      ];
      
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SHEET_ID,
          range: 'SiteConfig!A1:C1',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [headers] },
        });
        await appendSheetValues('SiteConfig!A2:C', defaultData);
        rows = defaultData;
      } catch (seedErr) {
        console.error('Auto-seed failed:', seedErr);
        rows = defaultData;
      }
    }
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
    const configObj: Record<string, string> = {};
    for (const row of rows) {
      if (row[0]) {
        if (bilingualKeys.includes(row[0])) {
          configObj[`${row[0]}_en`] = row[1] || '';
          configObj[`${row[0]}_th`] = (row[2] !== undefined) ? row[2] : '';
        } else {
          configObj[row[0]] = row[1] || '';
        }
      }
    }
    return configObj;
  } catch (error) {
    console.error('Error getting config:', error);
    return {};
  }
}

export async function updateConfig(configObj: Record<string, string>) {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();
    
    // Convert flat dictionary back to 3-column rows
    const rowMap: Record<string, [string, string, string]> = {};
    for (const [key, value] of Object.entries(configObj)) {
      if (key.endsWith('_en')) {
        const baseKey = key.replace('_en', '');
        if (!rowMap[baseKey]) rowMap[baseKey] = [baseKey, '', ''];
        rowMap[baseKey][1] = value;
      } else if (key.endsWith('_th')) {
        const baseKey = key.replace('_th', '');
        if (!rowMap[baseKey]) rowMap[baseKey] = [baseKey, '', ''];
        rowMap[baseKey][2] = value;
      } else {
        // Flat keys map explicitly to EN (Value Column)
        if (!rowMap[key]) rowMap[key] = [key, '', ''];
        rowMap[key][1] = value;
      }
    }
    
    const values = Object.values(rowMap);
    const range = `SiteConfig!A2:C${values.length + 1}`;

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
}

// ----------------------
// INTEGRATIONS
// ----------------------

export async function updateIntegrationRow(id: string, values: any[]) {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();

    const currentData = await getSheetValues('Integrations!A2:H');
    const rowIndex = currentData.findIndex((row) => row[0] === id);

    if (rowIndex !== -1) {
      const rowNumber = rowIndex + 2;
      const range = `Integrations!A${rowNumber}:H${rowNumber}`;

      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [values] },
      });

      return response.data;
    } else {
      throw new Error(`Row with ID ${id} not found in Integrations.`);
    }
  } catch (error) {
    console.error('Error updating Integration row:', error);
    throw error;
  }
}
