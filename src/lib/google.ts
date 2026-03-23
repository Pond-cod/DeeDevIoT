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

    const currentData = await getSheetValues('Services!A2:F');
    const rowIndex = currentData.findIndex((row) => row[0] === id);

    if (rowIndex !== -1) {
      const rowNumber = rowIndex + 2;
      const range = `Services!A${rowNumber}:F${rowNumber}`;

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
    const rows = await getSheetValues('SiteConfig!A2:B');
    const configObj: Record<string, string> = {};
    for (const row of rows) {
      if (row[0]) configObj[row[0]] = row[1] || '';
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
    
    // Convert object to array of arrays
    const values = Object.entries(configObj);
    
    // Clear and update might be safer, but an update starting from A2 is usually fine
    // Assuming A1, B1 are headers (Key, Value)
    const range = `SiteConfig!A2:B${values.length + 1}`;

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

    const currentData = await getSheetValues('Integrations!A2:F');
    const rowIndex = currentData.findIndex((row) => row[0] === id);

    if (rowIndex !== -1) {
      const rowNumber = rowIndex + 2;
      const range = `Integrations!A${rowNumber}:F${rowNumber}`;

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
