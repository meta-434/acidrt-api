const express = require("express");
const xss = require('xss');
const ReportsService = require('./reports-service');

const reportsRouter = express.Router();

const serializeReport = report => (
    {
        id: report.id,
        report_first: xss(report.report_first),
        report_last: xss(report.report_last),
        report_email: xss(report.report_email),
        report_phone: xss(report.report_phone),
        report_lat: report.report_lat,
        report_lng: report.report_lng,
        report_date: report.report_date,
        report_time: report.report_time,
        report_type: xss(report.report_type),
        report_waterbody: xss(report.report_waterbody),
        report_other: xss(report.report_other),
        report_details: xss(report.report_details),
    }
);

reportsRouter
    .route('/:report_id')
    .all(function(req, res, next) {
        ReportsService.getById(
            req.app.get('db'),
            req.params.report_id,
            req.decoded.id
        )
            .then(report => {
                if (!report) {
                    return res.status(404).json({
                        error: { message: `report doesn't exist`}
                    });
                }
                res.report = report;
                next();
            })
            .catch(next)
    })
    .get(function(req, res, next) {
        res.json(serializeReport(res.report));
    })
    .delete(function(req, res, next) {
        ReportsService.deleteReport(
            req.app.get('db'),
            req.params.report_id
        )
            .then(numRowsAffected => {
                res
                    .status(204)
                    .end();
            })
            .catch(next);
    });

reportsRouter
    .route('/')
    .get(function(req, res, next) {
        const knexInstance = req.app.get('db');
        return ReportsService.getAllReports(knexInstance)
            .then(reports => {
                res.json(reports.map(serializeReport))
            })
            .catch(next);
    });



module.exports = reportsRouter;