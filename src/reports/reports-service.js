const ReportsService = {
    getAllReports(knex) {
        return knex
            .select('*')
            .from('reports');
    },
    getReportsByOwnerId(knex, ownerId) {
        return knex
            .select('*')
            .from('reports')
            .where({'report_owner': ownerId});
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
    getById(knex, id, ownerId) {
        return knex
            .from('reports')
            .select('*')
            .where({'id': id, 'report_owner': ownerId})
            .first();
    },
    deleteReport(knex, id) {
        return knex('reports')
            .where({id})
            .delete();
    }
};

module.exports = ReportsService;