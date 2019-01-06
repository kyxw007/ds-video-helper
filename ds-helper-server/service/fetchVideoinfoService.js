const https = require('https');
var request = require('request');
const phantom = require('phantom');

module.exports = {
    fetchSubjectListByVideoName: async function (videoName, response) {

        const instance = await
            phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
        const page = await instance.createPage();
        // await page.on('onResourceRequested', function (requestData) {
        //     console.info('Requesting', requestData.url);
        // });

        const status = await page.open('https://movie.douban.com/subject_search?search_text=' + encodeURI(videoName));
        console.log("status:" + status);
        const content = await page.property('content');
        // console.log(content);

        await instance.exit();
        var subjects = [];
        var subjectIds = matchList(/subject_id:'([0-9]+?)',from:'mv_subject_search'/g, content);
        var subjectNames = matchList(/'mv\_subject\_search',is\_tv:'\d'}\)&quot;"\sclass\=\"title\-text\"\>(.+?)\<\/a>/g, content);
        if (subjectIds.length == subjectNames.length) {
            for (var i = 0; i < subjectIds.length; i++) {
                subjects.push({
                    id: subjectIds[i],
                    name: subjectNames[i]
                })
            }
        }
        response.send(JSON.stringify(subjects));
    },
    fetchOneSubject: async function (subjectId, response) {

        const instance = await
            phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
        const page = await instance.createPage();
        // await page.on('onResourceRequested', function (requestData) {
        //     console.info('Requesting', requestData.url);
        // });

        const status = await page.open('https://movie.douban.com/subject/' + subjectId);
        console.log("status:" + status);
        const content = await page.property('content');
        // console.log(content);
        var movieOrTVName = matchOne(/property="v:itemreviewed">(.+?)</g, content);
        var movieOrTVYear = matchOne(/class="year">(.+?)</g, content);
        var dretorList = matchList(/rel\=\"v:directedBy\"\>(.+?)\<\/a\>/g, content);
        var actorList = matchList(/rel\=\"v:starring\"\>(.+?)\<\/a\>/g, content);
        var date = matchOne(/property="v:initialReleaseDate"\scontent="(.+?)"/g, content);
        var summary = matchOne(/property="v:summary" class=".*?">([\S\s]+?)</g, content);
        var image = matchOne(/src="(.+?)"\stitle=".*?"\salt=".*?"\srel="v:image"/g, content);
        var type = matchOne(/TYPE:\s'(.+?)'/g, content);
        var videoInfo = JSON.stringify({
            name: removeSingleQuote(movieOrTVName + movieOrTVYear),
            director: dretorList,
            actors: actorList,
            date: removeSingleQuote(date),
            summary: removeSingleQuote(summary),
            image: image,
            type: removeSingleQuote(type)
        });
        console.log(videoInfo);
        response.send(videoInfo);
    }
}

function matchOne(pattern, content) {
    if (res = pattern.exec(content)) {
        return res[1];
    }
    return "";
}


function matchList(pattern, content) {
    var list = [];
    while (result = pattern.exec(content)) {
        if (list.indexOf(result[1]) < 0) {
            list.push(result[1]);
        }
    }
    return list;
}

function removeSingleQuote(str) {
    if (str != null && str != undefined) {
        return str.replace("'", "[sq]").trim();
    } else {
        return "";
    }
}