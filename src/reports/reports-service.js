const ReportsService = {
    getAllReports(knex) {
        return knex
            .select('*')
            .from('reports');
    },
    getReportsByOwnerId(knex, reportId) {
        return knex
            .select('*')
            .from('reports')
            .where({'report_id': reportId});
    },
    // UPDATE FIELDS FOR THIS
    insertReport(knex, newReport) {
        return knex
            .insert({
                'report_first':`${newReport.report_first}`,
                'report_last':`${newReport.report_last}`,
                'report_email':`${newReport.report_email}`,
                'report_phone':`${newReport.report_phone}`,
                'report_lat':`${newReport.report_lat}`,
                'report_lng':`${newReport.report_lng}`,
                'report_date':`${newReport.report_date}`,
                'report_type':`${newReport.report_type}`,
                'report_time':`${newReport.report_time}`,
                'report_waterbody':`${newReport.report_waterbody}`,
                'report_other':`${newReport.report_other}`,
                'report_details':`${newReport.report_details}`,
            })
            .into('reports')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    getById(knex, id) {
        return knex
            .from('reports')
            .select('*')
            .where({'id': id})
            .first();
    },
    deleteReport(knex, id) {
        return knex('reports')
            .where({id})
            .delete();
    }
};

module.exports = ReportsService;