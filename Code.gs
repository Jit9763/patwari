/**
 * Patwari Inspection Portal - Backend (Code.gs)
 * Saves, retrieves, and processes inspection data.
 */

const SHEET_PATWARI = 'PatwariReports';
const SHEET_SDM = 'SdmReports';
const SECURITY_PASSWORD = '1520';

/**
 * Serves the HTML Web Form.
 */
function doGet(e) {
  initSpreadsheet();
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('पटवारी निरीक्षण पोर्टल - Patwari Inspection Portal')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

/**
 * Handles CORS POST requests from local testing or external hosting.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    let result = { status: 'error', message: 'अवैध एक्शन' };
    
    if (data.action === 'getPatwariReport') {
      result = getPatwariReportByMobile(data.mobile_no);
    } else if (data.action === 'getPendingReports') {
      if (data.password !== SECURITY_PASSWORD) {
        result = { status: 'error', message: 'गलत पासवर्ड' };
      } else {
        result = getPendingPatwariReports();
      }
    } else if (data.action === 'savePatwari') {
      result = savePatwariReport(data.payload);
    } else if (data.action === 'saveSdm') {
      if (data.password !== SECURITY_PASSWORD) {
        result = { status: 'error', message: 'गलत पासवर्ड' };
      } else {
        result = saveSdmReport(data.payload);
      }
    } else if (data.action === 'getAdminData') {
      if (data.password !== SECURITY_PASSWORD) {
        result = { status: 'error', message: 'गलत पासवर्ड' };
      } else {
        result = getAdminDashboardData();
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'सर्वर एरर: ' + err.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Initializes the Google Spreadsheet with sheets and headers if they do not exist.
 */
function initSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const patwariHeaders = [
    'Report ID', 'Timestamp', 'Mobile Number', 'Patwari Name', 'Patwar Mandal', 'ILR Circle', 
    'Tehsil', 'District', 'Inspection Date', 'DOB', 'Hometown', 'Qualification', 
    'First Appointment Date', 'Current Joining Date', 'Basic Salary', 'Permanent Status', 
    'Trained Status', 'Exam Passed Status', 'Patwar HQ', 'Residence Type', 'Residence Details', 
    'Show Cause Details', 'Pending Disciplinary Details', 'Decided Disciplinary Details', 
    'Village Stats JSON', 'Inspections JSON', 'Rule 55 JSON', 'Map Khasras JSON', 
    'Monthly Summary JSON', 'Kanungo JSON', 'Girdawari JSON', 'Encroachments JSON', 
    'Mutations JSON', 'Court Cases JSON', 'Other Admin JSON',
    'Rule 89 JSON', 'Rule 91 JSON', 'Jinswar JSON', 'Dhal Banch JSON', 'Recovery JSON',
    'Treasury Deposits JSON', 'Copying Fee JSON', 'Store Inventory JSON', 'Passbooks JSON',
    'Non Khatedari JSON', 'Conversion Violations JSON', 'Conversion Compliance JSON',
    'Conversion Mutations JSON', 'Allotment Compliance JSON', 'Govt Allotment JSON',
    'Court Cases Compliance JSON', 'Court By Sections JSON', 'Jamabandi Errors JSON',
    'Seeding Draft JSON', 'Disasters Relief JSON', 'Beneficiary Seeding JSON',
    'Patwari Signature', 'Overall Remarks', 'Prefilled SDM Name'
  ];

  let patwariSheet = ss.getSheetByName(SHEET_PATWARI);
  if (!patwariSheet) {
    patwariSheet = ss.insertSheet(SHEET_PATWARI);
    patwariSheet.appendRow(patwariHeaders);
    patwariSheet.getRange(1, 1, 1, patwariHeaders.length).setFontWeight('bold').setBackground('#e2e8f0');
    patwariSheet.setFrozenRows(1);
  } else {
    ensureHeaders(patwariSheet, patwariHeaders);
  }

  const sdmHeaders = [
    'SDM Report ID', 'Patwari Report ID', 'SDM Timestamp', 'SDM Name', 'SDM Designation', 
    'SDM Comments', 'SDM Signature',
    'Mobile Number', 'Patwari Name', 'Patwar Mandal', 'ILR Circle', 'Tehsil', 'District', 'Inspection Date', 
    'DOB', 'Hometown', 'Qualification', 'First Appointment Date', 'Current Joining Date', 
    'Basic Salary', 'Permanent Status', 'Trained Status', 'Exam Passed Status', 'Patwar HQ', 
    'Residence Type', 'Residence Details', 'Show Cause Details', 'Pending Disciplinary Details', 
    'Decided Disciplinary Details', 'Village Stats JSON', 'Inspections JSON', 'Rule 55 JSON', 
    'Map Khasras JSON', 'Monthly Summary JSON', 'Kanungo JSON', 'Girdawari JSON', 
    'Encroachments JSON', 'Mutations JSON', 'Court Cases JSON', 'Other Admin JSON',
    'Rule 89 JSON', 'Rule 91 JSON', 'Jinswar JSON', 'Dhal Banch JSON', 'Recovery JSON',
    'Treasury Deposits JSON', 'Copying Fee JSON', 'Store Inventory JSON', 'Passbooks JSON',
    'Non Khatedari JSON', 'Conversion Violations JSON', 'Conversion Compliance JSON',
    'Conversion Mutations JSON', 'Allotment Compliance JSON', 'Govt Allotment JSON',
    'Court Cases Compliance JSON', 'Court By Sections JSON', 'Jamabandi Errors JSON',
    'Seeding Draft JSON', 'Disasters Relief JSON', 'Beneficiary Seeding JSON',
    'Patwari Signature', 'Overall Remarks', 'Prefilled SDM Name'
  ];

  let sdmSheet = ss.getSheetByName(SHEET_SDM);
  if (!sdmSheet) {
    sdmSheet = ss.insertSheet(SHEET_SDM);
    sdmSheet.appendRow(sdmHeaders);
    sdmSheet.getRange(1, 1, 1, sdmHeaders.length).setFontWeight('bold').setBackground('#cbd5e1');
    sdmSheet.setFrozenRows(1);
  } else {
    ensureHeaders(sdmSheet, sdmHeaders);
  }
}

function ensureHeaders(sheet, expectedHeaders) {
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) {
    sheet.appendRow(expectedHeaders);
    sheet.getRange(1, 1, 1, expectedHeaders.length).setFontWeight('bold').setBackground('#cbd5e1');
    return;
  }
  const actualHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
  expectedHeaders.forEach(header => {
    if (actualHeaders.indexOf(header) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header).setFontWeight('bold').setBackground('#cbd5e1');
    }
  });
}

/**
 * Searches and returns the latest Patwari report by mobile number for pre-filling.
 */
function getPatwariReportByMobile(mobile) {
  try {
    initSpreadsheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_PATWARI);
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { status: 'not_found', message: 'कोई डेटा नहीं मिला।' };
    }
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim());
    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    const formulas = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getFormulas();
    
    const mobileColIdx = headers.indexOf('Mobile Number');
    if (mobileColIdx === -1) {
      return { status: 'not_found', message: 'मोबाइल नंबर का कॉलम नहीं मिला।' };
    }

    // Find the latest record matching the mobile number (searching backwards)
    let foundRow = null;
    let foundFormulas = null;
    const targetMobile = String(mobile).trim();
    
    if (targetMobile !== '') {
      for (let i = data.length - 1; i >= 0; i--) {
        const rowMobile = String(data[i][mobileColIdx]).trim();
        if (rowMobile === targetMobile) {
          foundRow = data[i];
          foundFormulas = formulas[i];
          break;
        }
      }
    }
    
    if (!foundRow) {
      return { status: 'not_found', message: 'इस मोबाइल नंबर के लिए कोई पुराना डेटा नहीं मिला।' };
    }
    
    // Map row to keys
    const report = {};
    const headerKeys = getHeaderKeysMap();
    for (let j = 0; j < headers.length; j++) {
      const key = headerKeys[headers[j]] || headers[j];
      let val = foundRow[j];
      const formula = foundFormulas ? foundFormulas[j] : '';
      if (formula && formula.indexOf('=IMAGE') === 0) {
        val = formula;
      }
      if (val instanceof Date) {
        val = Utilities.formatDate(val, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
      }
      report[key] = val;
    }
    
    return { status: 'success', data: report };
  } catch (e) {
    return { status: 'error', message: 'डेटा खोजने में त्रुटि: ' + e.toString() };
  }
}

/**
 * Returns a list of all Patwari submissions that are pending SDM approval.
 */
function getPendingPatwariReports() {
  try {
    initSpreadsheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const patwariSheet = ss.getSheetByName(SHEET_PATWARI);
    const sdmSheet = ss.getSheetByName(SHEET_SDM);
    
    const pLastRow = patwariSheet.getLastRow();
    if (pLastRow <= 1) {
      return { status: 'success', reports: [] };
    }
    
    // Get all approved Patwari Report IDs from SDM reports
    const approvedIds = new Set();
    const sLastRow = sdmSheet.getLastRow();
    if (sLastRow > 1) {
      const sdmReportIds = sdmSheet.getRange(2, 2, sLastRow - 1, 1).getValues();
      for (let i = 0; i < sdmReportIds.length; i++) {
        approvedIds.add(String(sdmReportIds[i][0]).trim());
      }
    }
    
    const pHeaders = patwariSheet.getRange(1, 1, 1, patwariSheet.getLastColumn()).getValues()[0];
    const pData = patwariSheet.getRange(2, 1, pLastRow - 1, patwariSheet.getLastColumn()).getValues();
    const pFormulas = patwariSheet.getRange(2, 1, pLastRow - 1, patwariSheet.getLastColumn()).getFormulas();
    const headerKeys = getHeaderKeysMap();
    
    // Filter to keep only the latest patwari report for each unique report_id to avoid duplicates
    const uniquePatwariMap = {};
    for (let i = 0; i < pData.length; i++) {
      const reportId = String(pData[i][0]).trim();
      const report = {};
      for (let j = 0; j < pHeaders.length; j++) {
        const key = headerKeys[pHeaders[j]] || pHeaders[j];
        let val = pData[i][j];
        const formula = pFormulas[i] ? pFormulas[i][j] : '';
        if (formula && formula.indexOf('=IMAGE') === 0) {
          val = formula;
        }
        if (val instanceof Date) {
          val = Utilities.formatDate(val, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
        }
        report[key] = val;
      }
      uniquePatwariMap[reportId] = report;
    }

    const pendingReports = [];
    Object.keys(uniquePatwariMap).forEach(reportId => {
      if (!approvedIds.has(reportId)) {
        pendingReports.push(uniquePatwariMap[reportId]);
      }
    });
    
    return { status: 'success', reports: pendingReports };
  } catch (e) {
    return { status: 'error', message: 'लंबित रिपोर्ट प्राप्त करने में त्रुटि: ' + e.toString() };
  }
}

/**
 * Saves a Patwari inspection report.
 */
function savePatwariReport(data) {
  try {
    initSpreadsheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_PATWARI);
    
    // Process signature
    let sigCellVal = '';
    if (data.signature_base64 && data.signature_base64.indexOf('data:image/png;base64,') === 0) {
      sigCellVal = uploadSignatureToDrive(data.signature_base64, 'Patwari', data.patwari_name || 'NoName');
    }
    
    const reportId = data.report_id || ('REP-' + Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000));
    
    // De-approve: Delete any existing SDM reports for this report ID to make it pending again
    try {
      const sdmSheet = ss.getSheetByName(SHEET_SDM);
      const sLastRow = sdmSheet.getLastRow();
      if (sLastRow > 1) {
        const sdmData = sdmSheet.getRange(2, 2, sLastRow - 1, 1).getValues(); // Column 2 is Patwari Report ID
        for (let i = sdmData.length - 1; i >= 0; i--) {
          if (String(sdmData[i][0]).trim() === String(reportId).trim()) {
            sdmSheet.deleteRow(i + 2);
          }
        }
      }
    } catch (sdmErr) {
      console.warn("Could not delete old SDM verification row: " + sdmErr.toString());
    }
    
    const rowData = [
      reportId,
      new Date(),
      data.mobile_no || '',
      data.patwari_name || '-',
      data.patwar_mandal || '-',
      data.ilr_circle || '-',
      data.tehsil || '-',
      data.district || '-',
      data.inspection_date || '',
      data.dob || '',
      data.hometown || '-',
      data.qualification || '-',
      data.first_appointment_date || '',
      data.current_joining_date || '',
      Number(data.basic_salary) || 0,
      data.permanent_status || '-',
      data.trained_status || '-',
      data.exam_passed_status || '-',
      data.patwar_hq || '-',
      data.residence_type || '-',
      data.residence_details || '-',
      data.show_cause_details || '-',
      data.pending_disciplinary_details || '-',
      data.decided_disciplinary_details || '-',
      data.village_stats_json || '[]',
      data.inspections_json || '[]',
      data.rule55_json || '{}',
      data.map_khasras_json || '[]',
      data.monthly_summary_json || '{}',
      data.kanungo_json || '{}',
      data.girdawari_json || '[]',
      data.encroachments_json || '[]',
      data.mutations_json || '[]',
      data.court_cases_json || '[]',
      data.other_admin_json || '{}',
      // New columns:
      data.rule89_json || '[]',
      data.rule91_json || '[]',
      data.jinswar_json || '[]',
      data.dhal_banch_json || '[]',
      data.recovery_json || '[]',
      data.treasury_deposits_json || '[]',
      data.copying_fee_json || '[]',
      data.store_inventory_json || '[]',
      data.passbooks_json || '[]',
      data.non_khatedari_json || '[]',
      data.conversion_violations_json || '[]',
      data.conversion_compliance_json || '[]',
      data.conversion_mutations_json || '[]',
      data.allotment_compliance_json || '[]',
      data.govt_allotment_json || '[]',
      data.court_cases_compliance_json || '[]',
      data.court_by_sections_json || '[]',
      data.jamabandi_errors_json || '[]',
      data.seeding_draft_json || '[]',
      data.disasters_relief_json || '[]',
      data.beneficiary_seeding_json || '[]',
      // Signatures
      sigCellVal || data.signature_base64 || '',
      data.overall_remarks || '-',
      data.prefilled_sdm_name || '-'
    ];
    
    // Check if report with same reportId already exists to prevent duplicates
    const lastRow = sheet.getLastRow();
    let rowToUpdate = -1;
    if (lastRow > 1) {
      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === String(reportId).trim()) {
          rowToUpdate = i + 2;
          break;
        }
      }
    }

    if (rowToUpdate > -1) {
      // Update existing row
      sheet.getRange(rowToUpdate, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // Append new row
      sheet.appendRow(rowData);
    }
    
    return {
      status: 'success',
      message: 'पटवारी रिपोर्ट सफलतापूर्वक सेव हो गई है।',
      report_id: reportId
    };
  } catch (e) {
    return { status: 'error', message: 'रिपोर्ट सेव करने में त्रुटि: ' + e.toString() };
  }
}

/**
 * Saves an SDM approved inspection report.
 */
function saveSdmReport(data) {
  try {
    initSpreadsheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_SDM);
    
    // Process SDM signature
    let sdmSigCellVal = '';
    if (data.sdm_signature_base64 && data.sdm_signature_base64.indexOf('data:image/png;base64,') === 0) {
      sdmSigCellVal = uploadSignatureToDrive(data.sdm_signature_base64, 'SDM', data.sdm_name || 'NoName');
    }
    
    const sdmReportId = data.sdm_report_id || ('SDM-' + Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000));
    
    const rowData = [
      sdmReportId,
      data.patwari_report_id || '',
      new Date(),
      data.sdm_name || '-',
      data.sdm_designation || 'Sub Divisional Magistrate',
      data.sdm_comments || '-',
      sdmSigCellVal || data.sdm_signature_base64 || '',
      
      // Fields copied from Patwari and potentially edited by SDM
      data.mobile_no || '',
      data.patwari_name || '-',
      data.patwar_mandal || '-',
      data.ilr_circle || '-',
      data.tehsil || '-',
      data.district || '-',
      data.inspection_date || '',
      data.dob || '',
      data.hometown || '-',
      data.qualification || '-',
      data.first_appointment_date || '',
      data.current_joining_date || '',
      Number(data.basic_salary) || 0,
      data.permanent_status || '-',
      data.trained_status || '-',
      data.exam_passed_status || '-',
      data.patwar_hq || '-',
      data.residence_type || '-',
      data.residence_details || '-',
      data.show_cause_details || '-',
      data.pending_disciplinary_details || '-',
      data.decided_disciplinary_details || '-',
      data.village_stats_json || '[]',
      data.inspections_json || '[]',
      data.rule55_json || '{}',
      data.map_khasras_json || '[]',
      data.monthly_summary_json || '{}',
      data.kanungo_json || '{}',
      data.girdawari_json || '[]',
      data.encroachments_json || '[]',
      data.mutations_json || '[]',
      data.court_cases_json || '[]',
      data.other_admin_json || '{}',
      // New columns:
      data.rule89_json || '[]',
      data.rule91_json || '[]',
      data.jinswar_json || '[]',
      data.dhal_banch_json || '[]',
      data.recovery_json || '[]',
      data.treasury_deposits_json || '[]',
      data.copying_fee_json || '[]',
      data.store_inventory_json || '[]',
      data.passbooks_json || '[]',
      data.non_khatedari_json || '[]',
      data.conversion_violations_json || '[]',
      data.conversion_compliance_json || '[]',
      data.conversion_mutations_json || '[]',
      data.allotment_compliance_json || '[]',
      data.govt_allotment_json || '[]',
      data.court_cases_compliance_json || '[]',
      data.court_by_sections_json || '[]',
      data.jamabandi_errors_json || '[]',
      data.seeding_draft_json || '[]',
      data.disasters_relief_json || '[]',
      data.beneficiary_seeding_json || '[]',
      // Patwari Signature and remarks
      data.patwari_signature || '', 
      data.overall_remarks || '-',
      data.prefilled_sdm_name || '-'
    ];
    
    // Check if report with same sdmReportId already exists to prevent duplicates
    const lastRow = sheet.getLastRow();
    let rowToUpdate = -1;
    if (lastRow > 1) {
      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === String(sdmReportId).trim()) {
          rowToUpdate = i + 2;
          break;
        }
      }
    }

    if (rowToUpdate > -1) {
      // Update existing row
      sheet.getRange(rowToUpdate, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // Append new row
      sheet.appendRow(rowData);
    }
    
    return {
      status: 'success',
      message: 'एसडीएम निरीक्षण रिपोर्ट सफलतापूर्वक सुरक्षित कर दी गई है।',
      sdm_report_id: sdmReportId
    };
  } catch (e) {
    return { status: 'error', message: 'एसडीएम रिपोर्ट सुरक्षित करने में त्रुटि: ' + e.toString() };
  }
}

/**
 * Gathers statistical reports for the Admin panel.
 */
function getAdminDashboardData() {
  try {
    initSpreadsheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const patwariSheet = ss.getSheetByName(SHEET_PATWARI);
    const sdmSheet = ss.getSheetByName(SHEET_SDM);
    
    const pLastRow = patwariSheet.getLastRow();
    const sLastRow = sdmSheet.getLastRow();
    
    let patwariReports = [];
    if (pLastRow > 1) {
      const pHeaders = patwariSheet.getRange(1, 1, 1, patwariSheet.getLastColumn()).getValues()[0];
      const pData = patwariSheet.getRange(2, 1, pLastRow - 1, patwariSheet.getLastColumn()).getValues();
      const pFormulas = patwariSheet.getRange(2, 1, pLastRow - 1, patwariSheet.getLastColumn()).getFormulas();
      const pKeysMap = getHeaderKeysMap();
      
      patwariReports = pData.map((row, i) => {
        const obj = {};
        for (let j = 0; j < pHeaders.length; j++) {
          const key = pKeysMap[pHeaders[j]] || pHeaders[j];
          let val = row[j];
          const formula = pFormulas[i] ? pFormulas[i][j] : '';
          if (formula && formula.indexOf('=IMAGE') === 0) {
            val = formula;
          }
          if (val instanceof Date) {
            val = Utilities.formatDate(val, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
          }
          obj[key] = val;
        }
        return obj;
      });
      
      // Filter out duplicate entries in patwari_reports, keeping only the latest one for each report_id
      const uniquePatwariMap = {};
      patwariReports.forEach(r => {
        const id = r.report_id || r.mobile_no || 'UNKNOWN';
        uniquePatwariMap[id] = r;
      });
      patwariReports = Object.keys(uniquePatwariMap).map(key => uniquePatwariMap[key]);
    }
    
    let sdmReports = [];
    if (sLastRow > 1) {
      const sHeaders = sdmSheet.getRange(1, 1, 1, sdmSheet.getLastColumn()).getValues()[0];
      const sData = sdmSheet.getRange(2, 1, sLastRow - 1, sdmSheet.getLastColumn()).getValues();
      const sFormulas = sdmSheet.getRange(2, 1, sLastRow - 1, sdmSheet.getLastColumn()).getFormulas();
      const sKeysMap = getHeaderKeysMap();
      
      sdmReports = sData.map((row, i) => {
        const obj = {};
        for (let j = 0; j < sHeaders.length; j++) {
          const key = sKeysMap[sHeaders[j]] || sHeaders[j];
          let val = row[j];
          const formula = sFormulas[i] ? sFormulas[i][j] : '';
          if (formula && formula.indexOf('=IMAGE') === 0) {
            val = formula;
          }
          if (val instanceof Date) {
            val = Utilities.formatDate(val, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
          }
          obj[key] = val;
        }
        return obj;
      });
      
      // Filter out duplicate entries in sdm_reports, keeping only the latest one for each patwari_report_id
      const uniqueSdmMap = {};
      sdmReports.forEach(r => {
        const id = r.patwari_report_id || r.sdm_report_id || 'UNKNOWN';
        uniqueSdmMap[id] = r;
      });
      sdmReports = Object.keys(uniqueSdmMap).map(key => uniqueSdmMap[key]);
    }
    
    const totalPatwari = patwariReports.length;
    const totalSdm = sdmReports.length;
    const totalPending = Math.max(0, totalPatwari - totalSdm);
    
    return {
      status: 'success',
      summary: {
        total_patwari_reports: totalPatwari,
        total_sdm_reports: totalSdm,
        total_pending_approvals: totalPending
      },
      patwari_reports: patwariReports,
      sdm_reports: sdmReports
    };
  } catch (e) {
    return { status: 'error', message: 'डैशबोर्ड डेटा प्राप्त करने में त्रुटि: ' + e.toString() };
  }
}

/**
 * Uploads a base64 signature to Google Drive and returns a spreadsheet `=IMAGE()` formula.
 */
function uploadSignatureToDrive(base64Data, role, name) {
  try {
    const rawData = base64Data.split(',')[1];
    const decoded = Utilities.base64Decode(rawData);
    const timestamp = new Date().getTime();
    const filename = 'Signature_' + role + '_' + name.replace(/[^a-zA-Z0-9]/g, '_') + '_' + timestamp + '.png';
    const blob = Utilities.newBlob(decoded, 'image/png', filename);
    
    let folder = null;
    try {
      const fileId = SpreadsheetApp.getActiveSpreadsheet().getId();
      const file = DriveApp.getFileById(fileId);
      const folders = file.getParents();
      if (folders.hasNext()) {
        folder = folders.next();
      }
    } catch(e) {
      // Fallback if unable to access parent folder
    }
    
    const sigFile = folder ? folder.createFile(blob) : DriveApp.createFile(blob);
    sigFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const fileId = sigFile.getId();
    
    return `=IMAGE("https://drive.google.com/uc?export=view&id=${fileId}")`;
  } catch (e) {
    // Fallback: Return raw base64 if Drive API permissions fail
    return base64Data;
  }
}

/**
 * Map header string values to keys.
 */
function getHeaderKeysMap() {
  return {
    'Report ID': 'report_id',
    'SDM Report ID': 'sdm_report_id',
    'Patwari Report ID': 'patwari_report_id',
    'Timestamp': 'timestamp',
    'SDM Timestamp': 'sdm_timestamp',
    'SDM Name': 'sdm_name',
    'SDM Designation': 'sdm_designation',
    'SDM Comments': 'sdm_comments',
    'SDM Signature': 'sdm_signature',
    'Mobile Number': 'mobile_no',
    'Patwari Name': 'patwari_name',
    'Patwar Mandal': 'patwar_mandal',
    'ILR Circle': 'ilr_circle',
    'Tehsil': 'tehsil',
    'District': 'district',
    'Inspection Date': 'inspection_date',
    'DOB': 'dob',
    'Hometown': 'hometown',
    'Qualification': 'qualification',
    'First Appointment Date': 'first_appointment_date',
    'Current Joining Date': 'current_joining_date',
    'Basic Salary': 'basic_salary',
    'Permanent Status': 'permanent_status',
    'Trained Status': 'trained_status',
    'Exam Passed Status': 'exam_passed_status',
    'Patwar HQ': 'patwar_hq',
    'Residence Type': 'residence_type',
    'Residence Details': 'residence_details',
    'Show Cause Details': 'show_cause_details',
    'Pending Disciplinary Details': 'pending_disciplinary_details',
    'Decided Disciplinary Details': 'decided_disciplinary_details',
    'Village Stats JSON': 'village_stats_json',
    'Inspections JSON': 'inspections_json',
    'Rule 55 JSON': 'rule55_json',
    'Map Khasras JSON': 'map_khasras_json',
    'Monthly Summary JSON': 'monthly_summary_json',
    'Kanungo JSON': 'kanungo_json',
    'Girdawari JSON': 'girdawari_json',
    'Encroachments JSON': 'encroachments_json',
    'Mutations JSON': 'mutations_json',
    'Court Cases JSON': 'court_cases_json',
    'Other Admin JSON': 'other_admin_json',
    
    // New JSON expansions
    'Rule 89 JSON': 'rule89_json',
    'Rule 91 JSON': 'rule91_json',
    'Jinswar JSON': 'jinswar_json',
    'Dhal Banch JSON': 'dhal_banch_json',
    'Recovery JSON': 'recovery_json',
    'Treasury Deposits JSON': 'treasury_deposits_json',
    'Copying Fee JSON': 'copying_fee_json',
    'Store Inventory JSON': 'store_inventory_json',
    'Passbooks JSON': 'passbooks_json',
    'Non Khatedari JSON': 'non_khatedari_json',
    'Conversion Violations JSON': 'conversion_violations_json',
    'Conversion Compliance JSON': 'conversion_compliance_json',
    'Conversion Mutations JSON': 'conversion_mutations_json',
    'Allotment Compliance JSON': 'allotment_compliance_json',
    'Govt Allotment JSON': 'govt_allotment_json',
    'Court Cases Compliance JSON': 'court_cases_compliance_json',
    'Court By Sections JSON': 'court_by_sections_json',
    'Jamabandi Errors JSON': 'jamabandi_errors_json',
    'Seeding Draft JSON': 'seeding_draft_json',
    'Disasters Relief JSON': 'disasters_relief_json',
    'Beneficiary Seeding JSON': 'beneficiary_seeding_json',
    
    'Patwari Signature': 'patwari_signature',
    'Overall Remarks': 'overall_remarks',
    'Prefilled SDM Name': 'prefilled_sdm_name'
  };
}
