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
                'report_name':`${newReport.report_name}`,
                'report_content':`${newReport.report_content}`,
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