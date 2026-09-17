/**
 * =====================================================================
 * EDUBEACON CONFERENCE ATTENDEE REGISTRATION - GOOGLE APPS SCRIPT
 * =====================================================================
 * Target Spreadsheet: EduBeacon Conference Attendee Registration
 * Sheet ID: 19hSvVoE5Om9rCjRfDW_pcrZMfKOanjInfegc6Ib1gqo
 * Link: https://docs.google.com/spreadsheets/d/19hSvVoE5Om9rCjRfDW_pcrZMfKOanjInfegc6Ib1gqo/edit
 * =====================================================================
 */

const TARGET_SPREADSHEET_ID = "19hSvVoE5Om9rCjRfDW_pcrZMfKOanjInfegc6Ib1gqo";
const SHEET_NAME = "Attendee Registrations";

// Expected columns in order
const HEADERS = [
  "Timestamp",
  "Full Name",
  "Role / Designation",
  "School / Institution Name",
  "School Address",
  "City",
  "State",
  "Phone Number",
  "WhatsApp Number",
  "Association / Sahodaya",
  "Teaching Experience",
  "Classes Handled",
  "Subjects Taught",
  "Uses AI in Work",
  "AI Tools Used"
];

/**
 * Handle incoming POST requests from the EduBeacon website
 */
function doPost(e) {
  try {
    let data = {};
    
    // Parse JSON body or form parameters
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Get spreadsheet
    const ss = TARGET_SPREADSHEET_ID 
      ? SpreadsheetApp.openById(TARGET_SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it or use first active sheet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Initialize headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      // Style headers
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground("#0E733B");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(10);
      sheet.setFrozenRows(1);
    }

    // Format IST Timestamp
    const now = new Date();
    const formattedTimestamp = data.timestamp || Utilities.formatDate(now, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");

    // Construct row data matching headers
    const row = [
      formattedTimestamp,
      data.name || "",
      data.role || "",
      data.school || "",
      data.address || "",
      data.city || "",
      data.state || "",
      data.phone ? "'" + data.phone : "",
      data.whatsapp ? "'" + data.whatsapp : "",
      data.associationName || "",
      data.teachingExperience || "",
      data.classesTaught || "",
      data.subjectsTaught || "",
      data.usesAiInWork || "",
      data.aiTools || ""
    ];

    sheet.appendRow(row);

    // Auto-fit column widths
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Attendee registration recorded successfully!",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Health check GET request
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    name: "EduBeacon Conference Attendee Registration API",
    sheetId: TARGET_SPREADSHEET_ID,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this function once manually in Apps Script to setup headers instantly
 */
function setupSheetHeaders() {
  const ss = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#0E733B");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}
