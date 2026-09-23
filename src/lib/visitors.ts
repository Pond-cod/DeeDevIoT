import { getSheetValues, appendSheetValues } from './google';
import { google } from 'googleapis';

// In-memory cache for speed & reducing Google Sheets API quota
let cachedCount: number | null = null;
let lastSyncedCount: number | null = null;
let syncTimeout: NodeJS.Timeout | null = null;
let isSyncing = false;

// Initial default count if sheet doesn't have one yet
const DEFAULT_INITIAL_COUNT = 1280;

function getSheetsClient() {
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, GOOGLE_SHEET_ID };
}

/**
 * Fetch visitor count from Google Sheet (SiteConfig sheet, key: 'visitor_count')
 */
export async function getVisitorCount(): Promise<number> {
  if (cachedCount !== null) {
    return cachedCount;
  }

  try {
    const rows = await getSheetValues('SiteConfig!A2:C');
    if (rows && rows.length > 0) {
      const visitorRow = rows.find(r => r[0] === 'visitor_count');
      if (visitorRow && visitorRow[1]) {
        const parsed = parseInt(visitorRow[1].replace(/,/g, ''), 10);
        if (!isNaN(parsed)) {
          cachedCount = parsed;
          lastSyncedCount = parsed;
          return cachedCount;
        }
      }
    }

    // If key not found in sheet, seed it with default count
    cachedCount = DEFAULT_INITIAL_COUNT;
    lastSyncedCount = DEFAULT_INITIAL_COUNT;
    await appendSheetValues('SiteConfig!A:C', [['visitor_count', String(DEFAULT_INITIAL_COUNT), 'ยอดผู้เข้าชม']]);
    return cachedCount;
  } catch (error) {
    console.error('Error fetching visitor count from Google Sheets, using fallback:', error);
    if (cachedCount === null) {
      cachedCount = DEFAULT_INITIAL_COUNT;
    }
    return cachedCount;
  }
}

/**
 * Schedule a background sync to Google Sheets
 */
function scheduleSyncToSheet() {
  if (syncTimeout) return;

  syncTimeout = setTimeout(async () => {
    syncTimeout = null;
    if (isSyncing || cachedCount === null || cachedCount === lastSyncedCount) return;

    isSyncing = true;
    const countToSync = cachedCount;

    try {
      const client = getSheetsClient();
      if (!client) return;

      const { sheets, GOOGLE_SHEET_ID } = client;
      const rows = await getSheetValues('SiteConfig!A:A');
      const rowIndex = rows.findIndex(r => r[0] === 'visitor_count');

      if (rowIndex !== -1) {
        // Row in sheet is 1-indexed (index + 1)
        const rowNum = rowIndex + 1;
        await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SHEET_ID,
          range: `SiteConfig!B${rowNum}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [[String(countToSync)]] },
        });
      } else {
        await appendSheetValues('SiteConfig!A:C', [['visitor_count', String(countToSync), 'ยอดผู้เข้าชม']]);
      }
      lastSyncedCount = countToSync;
    } catch (err) {
      console.error('Error syncing visitor count to Google Sheets:', err);
    } finally {
      isSyncing = false;
      // If count changed while syncing, schedule another sync
      if (cachedCount !== null && cachedCount !== lastSyncedCount) {
        scheduleSyncToSheet();
      }
    }
  }, 2000); // 2 second batching/debounce
}

/**
 * Increment visitor count (non-blocking sync to Google Sheets)
 */
export async function incrementVisitorCount(): Promise<number> {
  if (cachedCount === null) {
    await getVisitorCount();
  }

  cachedCount = (cachedCount ?? DEFAULT_INITIAL_COUNT) + 1;
  scheduleSyncToSheet();
  return cachedCount;
}

/**
 * Manually update visitor count (e.g. from admin panel)
 */
export async function setVisitorCount(newCount: number): Promise<void> {
  cachedCount = newCount;
  scheduleSyncToSheet();
}
