/**
 * Google Apps Script Backend for DeeeDevIOT SPA
 * 
 * วิธีการนำไปใช้งาน:
 * 1. วางโค้ดนี้ใน Extensions > Apps Script ของ Google Sheets
 * 2. เปลี่ยน SHEET_ID เป็น ID ของไฟล์ Google Sheets (เอาความยาวรหัสจาก URL)
 * 3. กดปุ่ม Deploy > New deployment
 * 4. เลือกประเภทเป็น "Web app"
 * 5. ตั้งค่า "Execute as" เป็น "Me"
 * 6. ตั้งค่า "Who has access" เป็น "Anyone" (เพื่อให้หน้าเว็บดึงข้อมูลได้)
 */

const SHEET_ID = '1rXZb4APhgkQad6UNgQ2DdwF7lo1xSHq20Y5Owmdt6aE'; 

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    const siteConfig = getSheetDataAsObject(ss, 'SiteConfig');
    const servicesData = getSheetDataAsArray(ss, 'Services');

    const result = {
      success: true,
      data: {
        // แตกกระจายข้อมูลจาก SiteConfig ไปยังกลุ่มที่เหมาะสม
        hero: filterByKeyPrefix(siteConfig, 'hero_'),
        concept: filterByKeyPrefix(siteConfig, 'concept_'),
        contact: filterByKeyPrefix(siteConfig, 'contact_'),
        nav: filterByKeyPrefix(siteConfig, 'nav_'),
        footer: filterByKeyPrefix(siteConfig, 'footer_'),
        projects: servicesData
      }
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    if(!e.postData || !e.postData.contents) {
       return ContentService.createTextOutput(JSON.stringify({ success: false, error: "No payload" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // อัปเดตข้อมูลจากหน้า CMS (Hero, Concept, Contact)
    if (payload.action === 'saveSiteData') {
      const siteData = payload.data;
      updateSiteConfig(ss, siteData);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // อัปเดตข้อมูล Portfolio (Array)
    if (payload.action === 'savePortfolio') {
      updateSheetDataAsArray(ss, 'Services', payload.data);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper: Filter object keys by prefix and remove prefix
function filterByKeyPrefix(obj, prefix) {
  let result = {};
  for (const key in obj) {
    if (key.startsWith(prefix)) {
      result[key.replace(prefix, '')] = obj[key];
    }
  }
  return result;
}

// Helper: Read Key-Value Sheet
function getSheetDataAsObject(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return {}; 
  
  const data = sheet.getDataRange().getValues();
  let obj = {};
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    if (key) obj[key] = value;
  }
  return obj;
}

// Helper: Write Flat Config from SiteData object
function updateSiteConfig(ss, siteData) {
  let sheet = ss.getSheetByName('SiteConfig');
  if (!sheet) {
    sheet = ss.insertSheet('SiteConfig');
    sheet.appendRow(["Key", "Value"]);
  }
  
  const rows = [];
  // Flatten Hero
  if(siteData.hero) Object.keys(siteData.hero).forEach(k => rows.push([`hero_${k}`, siteData.hero[k]]));
  // Flatten Concept
  if(siteData.concept) Object.keys(siteData.concept).forEach(k => rows.push([`concept_${k}`, siteData.concept[k]]));
  // Flatten Contact
  if(siteData.contact) Object.keys(siteData.contact).forEach(k => rows.push([`contact_${k}`, siteData.contact[k]]));
  
  if (rows.length > 0) {
    const lastRow = Math.max(sheet.getLastRow(), 1);
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 2).clearContent();
    }
    sheet.getRange(2, 1, rows.length, 2).setValues(rows);
  }
}

// Helper: Read Array of Objects Sheet
function getSheetDataAsArray(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return []; 
  
  const headers = data[0];
  const result = [];
  
  for (let i = 1; i < data.length; i++) {
    let rowObj = {};
    let isRowEmpty = true;
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = data[i][j];
      if (data[i][j] !== "") isRowEmpty = false;
    }
    if (!isRowEmpty) result.push(rowObj);
  }
  return result;
}

// Helper: Write Array of Objects Sheet
function updateSheetDataAsArray(ss, sheetName, dataArray) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headers = ["ID", "Title", "Description", "Icon", "ImageUrl", "DemoUrl"];
    sheet.appendRow(headers);
  }
  
  const headers = ["ID", "Title", "Description", "Icon", "ImageUrl", "DemoUrl"];
  const rows = dataArray.map(item => headers.map(h => item[h] || ""));
  
  const lastRow = Math.max(sheet.getLastRow(), 1);
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}
