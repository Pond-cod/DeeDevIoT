import { google } from 'googleapis';

// Singleton cache for Google Auth & Sheet IDs (BUG-14)
let cachedAuth: { sheets: ReturnType<typeof google.sheets>; GOOGLE_SHEET_ID: string } | null = null;
const cachedSheetIds: Record<string, number> = {};

// Helper Function ใช้งาน Auth และ Sheets ร่วมกัน (Singleton Pattern)
function getGoogleAuth() {
  if (cachedAuth) return cachedAuth;

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
  cachedAuth = { sheets, GOOGLE_SHEET_ID };
  return cachedAuth;
}

async function getSheetId(tabName: string): Promise<number> {
  const normalized = tabName.toLowerCase();
  if (cachedSheetIds[normalized] !== undefined) {
    return cachedSheetIds[normalized];
  }

  const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: GOOGLE_SHEET_ID,
  });

  if (spreadsheet.data.sheets) {
    for (const s of spreadsheet.data.sheets) {
      if (s.properties?.title && s.properties.sheetId !== undefined && s.properties.sheetId !== null) {
        cachedSheetIds[s.properties.title.toLowerCase()] = s.properties.sheetId;
      }
    }
  }

  if (cachedSheetIds[normalized] === undefined) {
    throw new Error(`Sheet with title ${tabName} not found`);
  }
  return cachedSheetIds[normalized];
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

export async function updateSheetRow(tabName: string, id: string, values: any[], columnRange: string = 'A:Z') {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();

    const rangeFetch = `${tabName}!${columnRange}`;
    const currentData = await getSheetValues(rangeFetch);
    const normalizedId = String(id || '').trim().toLowerCase();
    
    // Find index, skipping header at index 0
    const rowIndex = currentData.findIndex((row, index) => 
      index > 0 && String(row[0] || '').trim().toLowerCase() === normalizedId
    );

    if (rowIndex !== -1) {
      // currentData[0] is Row 1 (Header), so currentData[rowIndex] is Sheet Row (rowIndex + 1)
      const rowNumber = rowIndex + 1;
      const startCol = columnRange.split(':')[0].replace(/[0-9]/g, '');
      const endCol = columnRange.split(':')[1].replace(/[0-9]/g, '');
      const range = `${tabName}!${startCol}${rowNumber}:${endCol}${rowNumber}`;

      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [values] },
      });

      return response.data;
    } else {
      throw new Error(`Row with ID ${id} not found in ${tabName}.`);
    }
  } catch (error) {
    console.error(`Error updating Google Sheets data in ${tabName}:`, error);
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
        ['hero_headline', 'Transform Your Business with \nIntelligent Web & IoT Solutions', 'ยกระดับธุรกิจของคุณ <br /> ด้วยโซลูชัน WEB APP & IOT อัจฉริยะ'],
        ['hero_sub', 'Bridging the gap between digital platforms and physical hardware. We deliver seamless integration from web-based management software to smart hardware automation.', 'จากซอฟต์แวร์จัดการบนเว็บ สู่การควบคุมบอร์ด Arduino/ESP32 ไร้รอยต่อ'],
        ['hero_btn1_text', 'Consult our Expert', 'ปรึกษาผู้เชี่ยวชาญ'],
        ['hero_btn2_text', 'See Our Portfolio', 'ดูผลงานของเรา'],
        ['hero_btn1_link', '#contact', '#contact'],
        ['hero_btn2_link', '#services', '#services'],
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
        ['solutions_title', 'Services', 'บริการ'],
        ['port_badge', 'INTEGRATIONS', 'ผลงานของเรา'],
        ['integrations_title', 'Seamless Ecosystem Connectivity', 'ทำงานร่วมกับแพลตฟอร์มอื่นอย่างไร้รอยต่อ'],
        ['port_desc', 'Enhance your workflow flawlessly by connecting our custom-built platforms with the everyday tools you already trust.', 'เพิ่มประสิทธิภาพการทำงานด้วยการเชื่อมต่อแพลตฟอร์มของเรากับเครื่องมือที่คุณคุ้นเคย'],
        ['cta_heading', 'Ready to Start Your Next Big Project?', 'พร้อมเริ่มพัฒนาโปรเจกต์ของคุณแล้วหรือยัง?'],
        ['footer_bio', 'Your trusted tech partner in turning innovative ideas into powerful, real-world Web & Hardware platforms.', 'พาร์ทเนอร์ที่พร้อมสานต่อไอเดียของคุณให้กลายเป็นแพลตฟอร์มที่ใช้งานได้จริง'],
        ['facebook_url', 'https://www.facebook.com/DeeDevIOT', ''],
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
        ['contact_messenger', 'https://m.me/DeeDevIOT', 'https://m.me/DeeDevIOT'],
        ['contact_line', '', '']
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
      'why3_title', 'why3_desc', 'why4_title', 'why4_desc', 'svc_badge', 'solutions_title', 'solutions_description',
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

    // Bidirectional sync for key aliases between SiteConfig and Sheets (BUG-09)
    if (configObj.solutions_title_en && !configObj.svc_title_en) configObj.svc_title_en = configObj.solutions_title_en;
    if (configObj.solutions_title_th && !configObj.svc_title_th) configObj.svc_title_th = configObj.solutions_title_th;
    if (configObj.svc_title_en && !configObj.solutions_title_en) configObj.solutions_title_en = configObj.svc_title_en;
    if (configObj.svc_title_th && !configObj.solutions_title_th) configObj.solutions_title_th = configObj.svc_title_th;

    if (configObj.solutions_description_en && !configObj.svc_desc_en) configObj.svc_desc_en = configObj.solutions_description_en;
    if (configObj.solutions_description_th && !configObj.svc_desc_th) configObj.svc_desc_th = configObj.solutions_description_th;
    if (configObj.svc_desc_en && !configObj.solutions_description_en) configObj.solutions_description_en = configObj.svc_desc_en;
    if (configObj.svc_desc_th && !configObj.solutions_description_th) configObj.solutions_description_th = configObj.svc_desc_th;

    if (configObj.integrations_title_en && !configObj.int_title_en) configObj.int_title_en = configObj.integrations_title_en;
    if (configObj.integrations_title_th && !configObj.int_title_th) configObj.int_title_th = configObj.integrations_title_th;
    if (configObj.int_title_en && !configObj.integrations_title_en) configObj.integrations_title_en = configObj.int_title_en;
    if (configObj.int_title_th && !configObj.integrations_title_th) configObj.integrations_title_th = configObj.int_title_th;

    if (configObj.port_desc_en && !configObj.int_desc_en) configObj.int_desc_en = configObj.port_desc_en;
    if (configObj.port_desc_th && !configObj.int_desc_th) configObj.int_desc_th = configObj.port_desc_th;
    if (configObj.int_desc_en && !configObj.port_desc_en) configObj.port_desc_en = configObj.int_desc_en;
    if (configObj.int_desc_th && !configObj.port_desc_th) configObj.port_desc_th = configObj.int_desc_th;

    return configObj;
  } catch (error) {
    console.error('Error getting config:', error);
    return {};
  }
}

export async function updateConfig(configObj: Record<string, string>) {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();
    
    // Fetch existing rows to preserve row order and custom keys
    let existingRows: any[][] = [];
    try {
      existingRows = await getSheetValues('SiteConfig!A2:C');
    } catch {
      existingRows = [];
    }

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
    
    // Merge with existing rows to preserve order in the sheet
    const finalRows: [string, string, string][] = [];
    const processedKeys = new Set<string>();

    for (const row of existingRows) {
      const k = row[0];
      if (!k) continue;
      if (rowMap[k]) {
        finalRows.push(rowMap[k]);
        processedKeys.add(k);
      } else {
        finalRows.push([k, row[1] || '', row[2] || '']);
      }
    }

    // Add any remaining keys from rowMap that were not in existingRows
    for (const [k, v] of Object.entries(rowMap)) {
      if (!processedKeys.has(k)) {
        finalRows.push(v);
      }
    }

    const range = `SiteConfig!A2:C${finalRows.length + 1}`;

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: finalRows },
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


export async function deleteSheetRow(tabName: string, id: string) {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();

    // Fetch the IDs to find the row index (from A2 downwards)
    const range = `${tabName}!A2:A`;
    const rows = await getSheetValues(range);
    const normalizedId = String(id || '').trim().toLowerCase();
    const rowIndex = rows.findIndex((row) => String(row[0] || '').trim().toLowerCase() === normalizedId);

    if (rowIndex !== -1) {
      const sheetId = await getSheetId(tabName);
      // Row 2 in sheet is index 0 in our data array (from A2:A)
      // Spreadsheet Row 2 is 0-indexed index 1.
      const startIndex = rowIndex + 1; 

      const response = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId,
                  dimension: 'ROWS',
                  startIndex: startIndex,
                  endIndex: startIndex + 1,
                },
              },
            },
          ],
        },
      });

      return response.data;
    } else {
      throw new Error(`Row with ID ${id} not found in ${tabName}.`);
    }
  } catch (error) {
    console.error(`Error deleting row from ${tabName}:`, error);
    throw error;
  }
}

/**
 * Cascade deletion helper: deletes all rows in tabName where column[columnIndex] equals targetValue.
 * Deletions are executed in reverse row order to maintain stable indices.
 */
export async function deleteSheetRowsByColumn(tabName: string, columnIndex: number, targetValue: string) {
  try {
    const { sheets, GOOGLE_SHEET_ID } = getGoogleAuth();
    const rows = await getSheetValues(`${tabName}!A2:Z`);
    const normalizedTarget = String(targetValue || '').trim().toLowerCase();

    // Find all matching row indices (0-indexed in A2:Z array -> sheet row (index + 2) -> 0-indexed in API is index + 1)
    const matchingIndices: number[] = [];
    rows.forEach((row, index) => {
      const colVal = String(row[columnIndex] || '').trim().toLowerCase();
      if (colVal === normalizedTarget) {
        matchingIndices.push(index + 1);
      }
    });

    if (matchingIndices.length === 0) {
      return { deletedCount: 0 };
    }

    const sheetId = await getSheetId(tabName);

    // Sort descending so deleting higher indices does not affect lower indices
    matchingIndices.sort((a, b) => b - a);

    const requests = matchingIndices.map((startIndex) => ({
      deleteDimension: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: startIndex,
          endIndex: startIndex + 1,
        },
      },
    }));

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: GOOGLE_SHEET_ID,
      requestBody: { requests },
    });

    return { deletedCount: matchingIndices.length, response: response.data };
  } catch (error) {
    console.error(`Error deleting rows by column from ${tabName}:`, error);
    throw error;
  }
}

