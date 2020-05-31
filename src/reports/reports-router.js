const express = require('express');
const xss = require('xss');
const ReportsService = require('./reports-service');

const reportsRouter = express.Router();
const jsonParser = express.json();

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
    .route('/')
    .get(function(req, res, next) {
        const knexInstance = req.app.get('db');
        ReportsService.getAllReports(knexInstance)
            .then(reports => {
                res.json(reports.map(serializeReport))
            })
            .catch(next);
    })
    .post(jsonParser, function(req, res, next) {
        const ownerId = parseInt(req.decoded.id, 10);
        const { report_name, report_content } = req.body;
        const newReport = { report_name, report_content, ownerId};

        for (const [key, value] of Object.entries(newReport)) {
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                });
            }
        }

        ReportsService.insertReport(
            req.app.get('db'),
            newReport
        )
            .then(report => {
                res
                    .status(201)
                    .location(`/api/reports/${report.id}`)
                    .json(serializeReport(newReport))
                    .end();
            })
            .catch(next);
    });

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

module.exports = reportsRouter;