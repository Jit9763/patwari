function compileFormData() {
      const data = {};
      data.mobile_no = document.getElementById('mobile_no').value;
      data.patwari_name = document.getElementById('patwari_name').value;
      data.ilr_circle = document.getElementById('ilr_circle').value;
      data.tehsil = document.getElementById('tehsil').value;
      data.district = document.getElementById('district').value;
      data.inspection_date = document.getElementById('inspection_date').value;
      data.dob = document.getElementById('dob').value;
      data.hometown = document.getElementById('hometown').value;
      data.qualification = document.getElementById('qualification').value;
      data.first_appointment_date = document.getElementById('first_appointment_date').value;
      data.current_joining_date = document.getElementById('current_joining_date').value;
      data.basic_salary = document.getElementById('basic_salary').value;
      data.permanent_status = document.getElementById('permanent_status').value;
      data.trained_status = document.getElementById('trained_status').value;
      data.exam_passed_status = document.getElementById('exam_passed_status').value;
      data.patwar_hq = document.getElementById('patwar_hq').value;
      data.residence_type = document.getElementById('residence_type').value;
      data.residence_details = document.getElementById('residence_details').value;
      data.show_cause_details = document.getElementById('show_cause_details').value;
      data.pending_disciplinary_details = document.getElementById('pending_disciplinary_details').value;
      data.decided_disciplinary_details = document.getElementById('decided_disciplinary_details').value;
      data.overall_remarks = document.getElementById('overall_remarks').value;

      // Rule 116 / 117
      data.rule116_status = document.getElementById('rule116_status').value;
      data.rule116_sign = document.getElementById('rule116_sign').value;
      data.rule117_egras = document.getElementById('rule117_egras').value;

      // Pending mutations
      data.m_pending_patwari = document.getElementById('m_pending_patwari').value;
      data.m_pending_lrc = document.getElementById('m_pending_lrc').value;
      data.m_pending_ilr = document.getElementById('m_pending_ilr').value;
      data.m_pending_officer = document.getElementById('m_pending_officer').value;
      data.m_pending_panchayat = document.getElementById('m_pending_panchayat').value;
      data.m_pending_stay = document.getElementById('m_pending_stay').value;

      // Village Stats
      data.village_stats_json = JSON.stringify(getTableData('villageStatsBody', ['v_name', 'v_khata', 'v_khasra', 'v_area', 'v_lagan', 'v_cultivable', 'v_sivaychak', 'v_pasture']));
      data.past_inspections_remarks = document.getElementById('past_inspections_remarks').value;
      data.inspections_json = JSON.stringify({
        list: getTableData('pastInspectionsBody', ['ins_officer', 'ins_date', 'ins_receive_date', 'ins_compliance_date']),
        remarks: data.past_inspections_remarks
      });

      // Rule 55
      data.rule55_json = JSON.stringify({
        diary_pages: document.getElementById('diary_pages').value,
        diary_blank_pages: document.getElementById('diary_blank_pages').value,
        diary_certified: document.getElementById('diary_certified').value,
        diary_period: document.getElementById('diary_period').value,
        diary_extraordinary: document.getElementById('diary_extraordinary').value,
        diary_govt_work: document.getElementById('diary_govt_work').value,
        diary_recovery: document.getElementById('diary_recovery').value,
        diary_annual_reg: document.getElementById('diary_annual_reg').value
      });

      // Synced tables
      data.map_khasras_json = JSON.stringify({
        list: getTableData('mapKhasrasBody', ['map_jamabandi', 'map_sheet1', 'map_sheet2', 'map_diff_reason']),
        remarks: document.getElementById('map_khasras_remarks').value
      });
      data.girdawari_json = JSON.stringify({
        list: getTableData('girdawariBody', ['g_samvat', 'g_rotation', 'g_crop', 'g_goswara', 'g_kharaba', 'g_trees', 'g_encroach', 'g_zero']),
        remarks: document.getElementById('girdawari_remarks_select').value
      });
      data.rule89_json = JSON.stringify(getTableData('rule89Body', ['r89_1', 'r89_2', 'r89_3', 'r89_4', 'r89_5', 'r89_6']));
      data.encroachments_json = JSON.stringify(getTableData('encroachmentsBody', ['e_sivay_count', 'e_past_count', 'e_sivay_check', 'e_past_check', 'e_sivay_enc', 'e_past_enc', 'e_report_time', 'e_report_delay']));
      data.p14_json = JSON.stringify(getTableData('p14CasesBody', ['p14_count', 'p14_orders', 'p14_eviction']));
      data.rule91_json = JSON.stringify(getTableData('rule91Body', ['r91_status', 'r91_complete', 'r91_jinswar_detail', 'r91_remarks']));
      data.jinswar_json = JSON.stringify(getTableData('jinswarBody', ['j_p16', 'j_p17', 'j_p18', 'j_p19', 'j_p19extra']));
      // Mutations JSON compilation (including static levels, types, and details)
      data.mutations_json = JSON.stringify({
        village_table: getTableData('mutationsBody', ['mu_filed', 'mu_decided', 'mu_pending', 'mu_decision_sheet', 'mu_execution', 'mu_period', 'mu_reason']),
        levels_table: getTableDataStatic('mutationLevelsTable', ['ml_level_name', 'ml_prev_pending', 'ml_filed', 'ml_total', 'ml_computerized', 'ml_pending', 'ml_pending_period', 'ml_pending_reason']),
        types_table: getTableDataStatic('mutationTypesTable', ['mtype_village', 'mtype_name', 'mtype_doc_status', 'mtype_remarks']),
        sec_12_4: {
          mut_illegal: document.getElementById('mut_illegal').value,
          mut_duplicate: document.getElementById('mut_duplicate').value,
          mut_reference: document.getElementById('mut_reference').value,
          mut_blank: document.getElementById('mut_blank').value,
          mut_glmac: document.getElementById('mut_glmac').value
        }
      });
      data.rule166_json = JSON.stringify(getTableData('shuddhipatrasBody', ['sh_decided', 'sh_docs', 'sh_remarks']));

      // Dhal Banch JSON compilation including Rule 107 remarks and pending cases summary
      data.dhal_banch_json = JSON.stringify({
        tableA: getTableData('dhalBanchABody', ['db_khata', 'db_write', 'db_check', 'db_tra', 'db_pending']),
        tableB: getTableData('dhalBanchBBody', ['db_b_khata', 'db_b_level', 'db_b_reason']),
        rule107_remarks: document.getElementById('rule107_remarks').value,
        pending_cases: getTableData('pendingCasesBody', ['pc_total_apps', 'pc_disposed_apps', 'pc_pending_apps', 'pc_patwari_pending', 'pc_tehsildar_pending', 'pc_30days_pending'])
      });

      data.recovery_json = JSON.stringify(getTableData('recoveryBody', ['rec_head', 'rec_demand', 'rec_collection', 'rec_status', 'rec_challan', 'rec_outstanding', 'rec_chaspa', 'rec_match']));
      data.treasury_deposits_json = JSON.stringify(getTableData('treasuryDepositsBody', ['tr_period', 'tr_head', 'tr_recovery', 'tr_amount_date', 'tr_timeliness', 'tr_tehsil_date', 'tr_diary']));

      // Copy Register fee split compilation
      data.copying_fee_json = JSON.stringify({
        copy_reg_status: document.getElementById('copy_reg_status').value,
        copy_total_issued: document.getElementById('copy_total_issued').value,
        copy_pending_apps: document.getElementById('copy_pending_apps').value,
        copy_fee_deposited: document.getElementById('copy_fee_deposited').value,
        copy_serial_order: document.getElementById('copy_serial_order').value,
        copy_fee_serial: document.getElementById('copy_fee_serial').value,
        copy_fee_amount: document.getElementById('copy_fee_amount').value,
        copy_fee_words: document.getElementById('copy_fee_words').value,
        copy_monthly_meeting_deposit: document.getElementById('copy_monthly_meeting_deposit').value
      });

      // Store & P37
      data.store_inventory_json = JSON.stringify({
        store_reg_status: document.getElementById('store_reg_status').value,
        store_verification_date: document.getElementById('store_verification_date').value,
        store_items_status: document.getElementById('store_items_status').value,
        p37: {
          p37_reg_status: document.getElementById('p37_reg_status').value,
          p37_unavailable_samvat: document.getElementById('p37_unavailable_samvat').value,
          p37_submitted_upto: document.getElementById('p37_submitted_upto').value,
          p37_pending_samvat: document.getElementById('p37_pending_samvat').value
        }
      });

      // Passbooks
      data.passbooks_json = JSON.stringify({
        passbook_total_dist: document.getElementById('passbook_total_dist').value,
        passbook_pending: document.getElementById('passbook_pending').value,
        passbook_fee_status: document.getElementById('passbook_fee_status').value
      });

      data.non_khatedari_json = JSON.stringify(getTableData('nonKhatedariBody', ['nk_details', 'nk_instructions']));
      data.conversion_violations_json = JSON.stringify(getTableData('conversionViolationsBody', ['cv_khasra', 'cv_purpose', 'cv_action', 'cv_order']));
      data.conversion_compliance_json = JSON.stringify(getTableData('conversionComplianceBody', ['cc_order_date', 'cc_purpose', 'cc_actual', 'cc_action', 'cc_order']));
      data.conversion_mutations_json = JSON.stringify(getTableData('conversionMutationsBody', ['cm_order_date', 'cm_entry', 'cm_sale', 'cm_mutation', 'cm_others']));
      data.allotment_compliance_json = JSON.stringify(getTableData('allotmentComplianceBody', ['al_order_date', 'al_purpose', 'al_actual', 'al_action', 'al_order']));
      data.govt_allotment_json = JSON.stringify(getTableData('govtAllotmentBody', ['ga_offices', 'ga_cases', 'ga_pending', 'ga_private', 'ga_diff']));

      // Static court cases compilation including summary recovery counts
      const courtCasesList = [];
      document.querySelectorAll('#courtCasesStaticTable tbody tr').forEach(tr => {
        courtCasesList.push({
          type: tr.dataset.type,
          notice_date: tr.querySelector('.cc_notice_date').value,
          served_date: tr.querySelector('.cc_served_date').value,
          report_date: tr.querySelector('.cc_report_date').value,
          kurki_date: tr.querySelector('.cc_kurki_date').value,
          compliance_date: tr.querySelector('.cc_compliance_date').value,
          auction_date: tr.querySelector('.cc_auction_date').value,
          conclusion: tr.querySelector('.cc_conclusion').value
        });
      });

      data.court_cases_json = JSON.stringify({
        summary: {
          mact: document.getElementById('recovery_count_mact').value,
          lr: document.getElementById('recovery_count_lr').value,
          pdr: document.getElementById('recovery_count_pdr').value,
          irr: document.getElementById('recovery_count_irr').value,
          audit: document.getElementById('recovery_count_audit').value
        },
        cases: courtCasesList
      });

      // Court pending/decisions tables
      data.court_by_sections_json = JSON.stringify({
        pending: getTableDataStatic('courtPendingSectionsTable', ['p_sec_name', 'p_sec_count', 'p_sec_period']),
        decided: getTableDataStatic('courtDecisionsSectionsTable', ['d_sec_name', 'd_sec_count', 'd_sec_period'])
      });

      // Seeding & Draft
      data.seeding_draft_json = JSON.stringify({
        seeding: getTableData('seedingDraftBody', ['sd_ver_pending', 'sd_land', 'sd_aadhaar']),
        znms: getTableData('znmsBody', ['zn_draft', 'zn_ver', 'zn_znms'])
      });

      // Disasters Relief
      data.disasters_relief_json = JSON.stringify({
        relief: getTableData('disastersReliefBody', ['di_fire', 'di_flood', 'di_house', 'di_lightning', 'di_others']),
        accidents: getTableData('accidentsBody', ['ac_accident', 'ac_drown', 'ac_elec', 'ac_collapse'])
      });

      data.beneficiary_seeding_json = JSON.stringify(getTableData('beneficiarySeedingBody', ['bs_total', 'bs_bank', 'bs_aadhaar', 'bs_errors']));

      // Monthly Summaries
      const monthly = {
        remarks: document.getElementById('monthly_summary_remarks').value,
        status: document.getElementById('monthly_summary_status').value
      };
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      months.forEach(m => {
        const el = document.getElementById('m_' + m + '_date');
        monthly[m] = el ? el.value : '';
      });
      data.monthly_summary_json = JSON.stringify(monthly);

      // Circulars / Kanungo
      data.kanungo_json = JSON.stringify({
        circ_1: document.getElementById('circ_1').value,
        circ_2: document.getElementById('circ_2').value,
        circ_3: document.getElementById('circ_3').value,
        circ_4: document.getElementById('circ_4').value,
        circ_5: document.getElementById('circ_5').value,
        circ_status: document.getElementById('circ_status').value,
        circ_order_no: document.getElementById('circ_order_no').value,
        circ_order_date: document.getElementById('circ_order_date').value,
        circ_order_subject: document.getElementById('circ_order_subject').value,
        remarks: document.getElementById('circulars_file_remarks').value
      });

      // Other Admin Work (combines rule 116/117, etc.)
      const admin = {
        rule116_status: data.rule116_status,
        rule116_sign: data.rule116_sign,
        rule117_egras: data.rule117_egras,
        copy_reg_status: document.getElementById('copy_reg_status').value,
        store_reg_status: document.getElementById('store_reg_status').value,
        store_items_status: document.getElementById('store_items_status').value,
        p37_reg_status: document.getElementById('p37_reg_status').value,
        passbook_total_dist: document.getElementById('passbook_total_dist').value,
        seeding_remarks: document.getElementById('seeding_remarks').value
      };
      data.other_admin_json = JSON.stringify(admin);

      // Jamabandi Errors JSON Compile
      const jeData = [];
      const villages = getEnteredVillages();
      villages.forEach(vName => {
        const card = document.getElementById(`card-${vName}`);
        if (card) {
          const rowVals = { v_name: vName };
          Object.keys(JAMABANDI_ERROR_LABELS).forEach(key => {
            const elId = `je_${vName}_${key}`;
            const el = document.getElementById(elId);
            rowVals[key] = el ? (parseInt(el.value) || 0) : 0;
          });
          jeData.push(rowVals);
        }
      });
      data.jamabandi_errors_json = JSON.stringify(jeData);

      return data;
    }

================================================================================

function prefillFormWithData(data) {
      // General Details
      document.getElementById('patwari_name').value = data.patwari_name || '';
      document.getElementById('ilr_circle').value = data.ilr_circle || '';
      document.getElementById('tehsil').value = data.tehsil || '';
      document.getElementById('district').value = data.district || '';
      document.getElementById('inspection_date').value = data.inspection_date || '';
      document.getElementById('dob').value = data.dob || '';
      document.getElementById('hometown').value = data.hometown || '';
      document.getElementById('qualification').value = data.qualification || '';
      document.getElementById('first_appointment_date').value = data.first_appointment_date || '';
      document.getElementById('current_joining_date').value = data.current_joining_date || '';
      document.getElementById('basic_salary').value = data.basic_salary || '';
      document.getElementById('permanent_status').value = data.permanent_status || '';
      document.getElementById('trained_status').value = data.trained_status || '';
      document.getElementById('exam_passed_status').value = data.exam_passed_status || '';
      document.getElementById('patwar_hq').value = data.patwar_hq || '';
      document.getElementById('residence_type').value = data.residence_type || '';
      toggleResidenceDetails(data.residence_type);
      document.getElementById('residence_details').value = data.residence_details || '';
      document.getElementById('show_cause_details').value = data.show_cause_details || '';
      document.getElementById('pending_disciplinary_details').value = data.pending_disciplinary_details || '';
      document.getElementById('decided_disciplinary_details').value = data.decided_disciplinary_details || '';
      document.getElementById('overall_remarks').value = data.overall_remarks || '';

      // Populate tables from JSON
      try {
        const stats = JSON.parse(data.village_stats_json || '[]');
        if (stats.length > 0) {
          document.getElementById('villageStatsBody').innerHTML = '';
          stats.forEach(row => addVillageRow(row));
        }
      } catch (e) { console.error('Stats prefill error:', e); }

      try {
        let ins = [];
        let remarks = '';
        if (data.inspections_json) {
          const parsed = JSON.parse(data.inspections_json);
          if (Array.isArray(parsed)) {
            ins = parsed;
          } else if (parsed && Array.isArray(parsed.list)) {
            ins = parsed.list;
            remarks = parsed.remarks || '';
          }
        }
        if (ins.length > 0) {
          document.getElementById('pastInspectionsBody').innerHTML = '';
          ins.forEach(row => addInspectionRow(row));
        }
        document.getElementById('past_inspections_remarks').value = remarks || data.past_inspections_remarks || '';
      } catch (e) { console.error('Inspections prefill error:', e); }

      try {
        const rule55 = JSON.parse(data.rule55_json || '{}');
        document.getElementById('diary_pages').value = rule55.diary_pages || '';
        document.getElementById('diary_blank_pages').value = rule55.diary_blank_pages || '';
        document.getElementById('diary_certified').value = rule55.diary_certified || '';
        document.getElementById('diary_period').value = rule55.diary_period || '';
        document.getElementById('diary_extraordinary').value = rule55.diary_extraordinary || '';
        if (rule55.diary_govt_work) document.getElementById('diary_govt_work').value = rule55.diary_govt_work;
        if (rule55.diary_recovery) document.getElementById('diary_recovery').value = rule55.diary_recovery;
        if (rule55.diary_annual_reg) document.getElementById('diary_annual_reg').value = rule55.diary_annual_reg;
      } catch (e) { console.error('Rule 55 prefill error:', e); }

      // Rebuild and synchronize villages first
      syncVillagesToAllTables();

      // Prefill synced village tables
      prefillSyncTable('mapKhasrasBody', data.map_khasras_json);
      prefillSyncTable('girdawariBody', data.girdawari_json);
      prefillSyncTable('rule89Body', data.rule89_json);
      prefillSyncTable('encroachmentsBody', data.encroachments_json);
      prefillSyncTable('p14CasesBody', data.p14_json || data.p14CasesBody); // Support potential old structures
      prefillSyncTable('rule91Body', data.rule91_json);
      prefillSyncTable('jinswarBody', data.jinswar_json);
      prefillSyncTable('mutationsBody', data.mutations_json);
      prefillSyncTable('shuddhipatrasBody', data.rule166_json || data.shuddhipatrasBody);
      prefillSyncTable('dhalBanchABody', data.dhal_banch_json ? JSON.parse(data.dhal_banch_json).tableA : null);
      prefillSyncTable('dhalBanchBBody', data.dhal_banch_json ? JSON.parse(data.dhal_banch_json).tableB : null);
      prefillSyncTable('recoveryBody', data.recovery_json);
      prefillSyncTable('treasuryDepositsBody', data.treasury_deposits_json);
      prefillSyncTable('nonKhatedariBody', data.non_khatedari_json);
      prefillSyncTable('conversionViolationsBody', data.conversion_violations_json);
      prefillSyncTable('conversionComplianceBody', data.conversion_compliance_json);
      prefillSyncTable('conversionMutationsBody', data.conversion_mutations_json);
      prefillSyncTable('allotmentComplianceBody', data.allotment_compliance_json);
      prefillSyncTable('govtAllotmentBody', data.govt_allotment_json);
      prefillSyncTable('courtCasesBody', data.court_cases_json);
      prefillSyncTable('seedingDraftBody', data.seeding_draft_json);
      prefillSyncTable('znmsBody', data.seeding_draft_json ? JSON.parse(data.seeding_draft_json).znms : null);
      prefillSyncTable('disastersReliefBody', data.disasters_relief_json);
      prefillSyncTable('accidentsBody', data.disasters_relief_json ? JSON.parse(data.disasters_relief_json).accidents : null);
      prefillSyncTable('beneficiarySeedingBody', data.beneficiary_seeding_json);

      // Rule 121
      try {
        const mutations = JSON.parse(data.mutations_json || '[]');
        // LRC etc.
        if (data.m_pending_patwari) document.getElementById('m_pending_patwari').value = data.m_pending_patwari;
        if (data.m_pending_lrc) document.getElementById('m_pending_lrc').value = data.m_pending_lrc;
        if (data.m_pending_ilr) document.getElementById('m_pending_ilr').value = data.m_pending_ilr;
        if (data.m_pending_officer) document.getElementById('m_pending_officer').value = data.m_pending_officer;
        if (data.m_pending_panchayat) document.getElementById('m_pending_panchayat').value = data.m_pending_panchayat;
        if (data.m_pending_stay) document.getElementById('m_pending_stay').value = data.m_pending_stay;

        if (data.rule121_register) document.getElementById('rule121_register').value = data.rule121_register;
        if (data.rule121_entry_date) document.getElementById('rule121_entry_date').value = data.rule121_entry_date;
      } catch (e) { }

      // Copy register
      try {
        const copyFee = JSON.parse(data.copying_fee_json || '{}');
        document.getElementById('copy_reg_status').value = copyFee.copy_reg_status || 'हाँ';
        document.getElementById('copy_total_issued').value = copyFee.copy_total_issued || 0;
        document.getElementById('copy_pending_apps').value = copyFee.copy_pending_apps || 0;
        document.getElementById('copy_fee_deposited').value = copyFee.copy_fee_deposited || 'हाँ';
        document.getElementById('copy_serial_order').value = copyFee.copy_serial_order || 'हाँ';
        document.getElementById('copy_fee_detail').value = copyFee.copy_fee_detail || '';
        document.getElementById('copy_monthly_meeting_deposit').value = copyFee.copy_monthly_meeting_deposit || 'हाँ';
      } catch (e) { }

      // Store Inventory
      try {
        const store = JSON.parse(data.store_inventory_json || '{}');
        document.getElementById('store_reg_status').value = store.store_reg_status || 'हाँ';
        document.getElementById('store_verification_date').value = store.store_verification_date || '';
        document.getElementById('store_items_status').value = store.store_items_status || 'पूर्ण';
      } catch (e) { }

      // Record Room
      try {
        const p37 = JSON.parse(data.store_inventory_json || '{}').p37 || {}; // Fallback storage structure
        document.getElementById('p37_reg_status').value = p37.p37_reg_status || 'हाँ';
        document.getElementById('p37_unavailable_samvat').value = p37.p37_unavailable_samvat || '';
        document.getElementById('p37_submitted_upto').value = p37.p37_submitted_upto || '';
        document.getElementById('p37_pending_samvat').value = p37.p37_pending_samvat || '';
      } catch (e) { }

      // Passbooks
      try {
        const pb = JSON.parse(data.passbooks_json || '{}');
        document.getElementById('passbook_total_dist').value = pb.passbook_total_dist || '';
        document.getElementById('passbook_pending').value = pb.passbook_pending || '';
        document.getElementById('passbook_fee_status').value = pb.passbook_fee_status || 'हाँ';
      } catch (e) { }

      // Rule 116 / 117
      if (data.rule116_status) document.getElementById('rule116_status').value = data.rule116_status;
      if (data.rule116_sign) document.getElementById('rule116_sign').value = data.rule116_sign;
      if (data.rule117_egras) document.getElementById('rule117_egras').value = data.rule117_egras;

      // Jamabandi Errors Prefill
      try {
        const jeData = JSON.parse(data.jamabandi_errors_json || '[]');
        jeData.forEach(item => {
          const vName = item.v_name;
          Object.keys(item).forEach(k => {
            if (k !== 'v_name') {
              const elId = `je_${vName}_${k}`;
              const el = document.getElementById(elId);
              if (el) el.value = item[k];
            }
          });
        });
      } catch (e) { }

      // Prefill monthly summaries
      try {
        const monthly = JSON.parse(data.monthly_summary_json || '{}');
        document.getElementById('monthly_summary_remarks').value = monthly.remarks || '';
        if (monthly.status) document.getElementById('monthly_summary_status').value = monthly.status;
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        months.forEach(m => {
          const el = document.getElementById('m_' + m + '_date');
          if (el) el.value = monthly[m] || '';
        });
      } catch (e) { console.error('Monthly prefill error:', e); }

      // Prefill circulars / Kanungo
      try {
        const kanungo = JSON.parse(data.kanungo_json || '{}');
        if (kanungo.circ_1) document.getElementById('circ_1').value = kanungo.circ_1;
        if (kanungo.circ_2) document.getElementById('circ_2').value = kanungo.circ_2;
        if (kanungo.circ_3) document.getElementById('circ_3').value = kanungo.circ_3;
        if (kanungo.circ_4) document.getElementById('circ_4').value = kanungo.circ_4;
        if (kanungo.circ_5) document.getElementById('circ_5').value = kanungo.circ_5;
        if (kanungo.circ_status) document.getElementById('circ_status').value = kanungo.circ_status;
        if (kanungo.circ_order_no) document.getElementById('circ_order_no').value = kanungo.circ_order_no;
        if (kanungo.circ_order_date) document.getElementById('circ_order_date').value = kanungo.circ_order_date;
        if (kanungo.circ_order_subject) document.getElementById('circ_order_subject').value = kanungo.circ_order_subject;
        if (kanungo.remarks) document.getElementById('circulars_file_remarks').value = kanungo.remarks;
      } catch (e) { console.error('Kanungo prefill error:', e); }

      // Update Step 3 live previews after prefill
      updateStep3Preview();
    }

================================================================================

function renderFormReview() {
      const container = document.getElementById('formReviewContainer');
      const data = compileFormData();

      let html = `
        <div class="review-section">
          <div class="review-section-title">1. सामान्य जानकारी</div>
          <div class="review-grid">
            <div class="review-item"><strong>पटवारी का नाम:</strong> ${data.patwari_name}</div>
            <div class="review-item"><strong>मोबाइल नंबर:</strong> ${data.mobile_no}</div>
            <div class="review-item"><strong>ILR वृत्त:</strong> ${data.ilr_circle}</div>
            <div class="review-item"><strong>तहसील (जिला):</strong> ${data.tehsil} (${data.district})</div>
            <div class="review-item"><strong>निरीक्षण दिनांक:</strong> ${data.inspection_date}</div>
            <div class="review-item"><strong>मूल वेतन:</strong> ₹${data.basic_salary}</div>
            <div class="review-item"><strong>स्थिति:</strong> ${data.permanent_status} / ${data.trained_status}</div>
            <div class="review-item"><strong>मुख्यालय निवास:</strong> ${data.residence_type}</div>
          </div>
        </div>
      `;

      // Village Stats
      const stats = JSON.parse(data.village_stats_json);
      if (stats.length > 0) {
        html += `
          <div class="review-section">
            <div class="review-section-title">2. पटवार मुख्यालय एवं कार्यक्षेत्र:-</div>
            <table class="table-dynamic" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th>ग्राम</th>
                  <th>खाते</th>
                  <th>खसरा</th>
                  <th>क्षेत्रफल</th>
                  <th>लगान</th>
                </tr>
              </thead>
              <tbody>
                ${stats.map(row => `
                  <tr>
                    <td>${row.v_name}</td>
                    <td>${row.v_khata}</td>
                    <td>${row.v_khasra}</td>
                    <td>${row.v_area || '-'}</td>
                    <td>₹${row.v_lagan || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }

      // Past Inspections
      let insList = [];
      let insRemarks = '';
      try {
        if (data.inspections_json) {
          const parsed = JSON.parse(data.inspections_json);
          if (Array.isArray(parsed)) {
            insList = parsed;
          } else if (parsed && Array.isArray(parsed.list)) {
            insList = parsed.list;
            insRemarks = parsed.remarks || '';
          }
        }
      } catch (e) { }

      if (insList.length > 0 || insRemarks) {
        html += `
          <div class="review-section">
            <div class="review-section-title">3. गत निरीक्षण:-</div>
            <p style="font-size: 0.8rem; margin-bottom: 5px;">गत एक वर्ष में इस पटवार मण्डल का विभिन्न अधिकारियों द्वारा किये गये निरीक्षणों तथा पालना से शेष अन्य समस्त निरीक्षणों का विवरण निम्नानुसार है:-</p>
            ${insList.length > 0 ? `
            <table class="table-dynamic" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th>क्र.सं.</th>
                  <th>निरीक्षणकर्ता अधिकारी</th>
                  <th>निरीक्षण दिनांक</th>
                  <th>प्राप्ति दिनांक</th>
                  <th>अनुपालना दिनांक</th>
                </tr>
              </thead>
              <tbody>
                ${insList.map((row, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${row.ins_officer || ''}</td>
                    <td>${row.ins_date || ''}</td>
                    <td>${row.ins_receive_date || ''}</td>
                    <td>${row.ins_compliance_date || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            ` : ''}
            ${insRemarks ? `<p style="font-size: 0.8rem; margin-top: 5px;"><strong>गत निरीक्षण टिप्पणी/कमी:</strong> ${insRemarks}</p>` : ''}
          </div>
        `;
      }

      container.innerHTML = html;
    }