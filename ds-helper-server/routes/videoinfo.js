var express = require('express');
var router = express.Router();
var fetchVideoinfoService = require("../service/fetchVideoinfoService");

/* GET home page. */
router.get('/list/:videoName', function (req, res, next) {
    var videoName = req.params.videoName;
    fetchVideoinfoService.fetchSubjectListByVideoName(videoName, res);
});

router.get('/subject/:subjectId', function (req, res, next) {
    var subjectId = req.params.subjectId;
    fetchVideoinfoService.fetchOneSubject(subjectId, res);
});

module.exports = router;
