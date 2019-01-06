var movieOrTV = 1;// 1 movie 2 tv
var videoName = "";

$(function () {
    $("#getVideoName").click(function () {
        requestPermission(getVideoFromDS);
    });

    $("#fetchVideoInfo").click(function () {
        fetchVideoInfo();
    });

    $("#fillVideoInfo").click(function () {
        fillVideoInfo();
    });

});

function fillVideoInfo() {
    var subjectId = $("#selectSubjectId").val();
    $.ajax({
        headers: {
            "Access-Control-Allow-Origin": "chrome-extension://pehcfcdpipapbcepjldnjkpfbofbnkhk"
        },
        url: "http://127.0.0.1:3000/videoinfo/subject/" + subjectId,
        context: document.body
    }).done(function (str) {
        console.log(str);
        var videoInfo = JSON.parse(str);
        settingInfo(videoInfo);

    });
}


function settingInfo(videoInfo) {
    console.log(videoInfo);
    var summary = "[导演：" + videoInfo.director + "]" +
        "[演员：" + array2String(videoInfo.actors) + "]" +
        "[上映时间：" + videoInfo.date + "]" +
        "[摘要：" + videoInfo.summary + "]";
    var setBasicInfo = "document.getElementsByName(\"title\")[0].value='" + videoInfo.name + "';"
        + "document.getElementsByName(\"summary\")[0].value='" + summary + "';";

    var imageIndex = 6;
    if (videoInfo.type == 'tv') {
        imageIndex = 4;
    }

    var useOnlineImg = "document.querySelectorAll(\"span .x-tab-strip-text\")[1].click();"
        + "document.querySelector(\"[aria-label='输入网址']\").click();"
        + "document.querySelectorAll(\".x-form-element > input\")[" + imageIndex + "].value='" + videoInfo.image + "';"
        + "document.querySelector(\"[aria-label='原始']\").click();"
        + "document.querySelector(\"[aria-label='输入网址']\").click();";
    chrome.tabs.executeScript({
        code: setBasicInfo + useOnlineImg
    });
}

function fetchVideoInfo() {
    $.ajax({
        headers: {
            "Access-Control-Allow-Origin": "chrome-extension://pehcfcdpipapbcepjldnjkpfbofbnkhk"
        },
        url: "http://127.0.0.1:3000/videoinfo/list/" + videoName,
        context: document.body
    }).done(function (str) {
        console.log(str);
        var o = JSON.parse(str);
        if (isArrayNotEmpty(o)) {
            var selectHtml = "<select id='selectSubjectId'>"
            for (var i = 0; i < o.length; i++) {
                selectHtml = selectHtml + "<option value =\"" + o[i].id + "\" >" + o[i].name + "</option>"
            }
            selectHtml = selectHtml + "</select>";
            $("#selectVideo").html(selectHtml);
        } else {
            $("#selectVideo").html("豆瓣上搜索不到，换个关键词试试");
        }
    });
}


function getVideoFromDS() {
    chrome.tabs.executeScript({
        code: ";document.getElementsByName(\"title\")[0].value"
    }, function (object) {
        if (isArrayNotEmpty(object)) {
            movieOrTV = 1;
            videoName = object[0];
            displayById("videoName", videoName);
        }
    });
}


function requestPermission(funcIfGetPermission) {
    chrome.permissions.contains({
        permissions: ['tabs'],
        origins: ['http://192.168.31.245:5000/']
    }, function (result) {
        if (result) {
            funcIfGetPermission()
        } else {
            chrome.permissions.request({
                permissions: ['tabs'],
                origins: ['http://192.168.31.245:5000/']
            }, function (granted) {
                // The callback argument will be true if the user granted the permissions.
                if (granted) {
                    funcIfGetPermission()
                } else {
                    alert("can't get permission");
                }
            });
        }
    });
}


function isArrayNotEmpty(array) {
    if (array != null && array != undefined && array.length > 0) {
        return true;
    } else {
        return false;
    }
}


function displayById(id, content) {
    $("#" + id).html(content);
}

function array2String(array) {
    var strList = "";
    if (array != null && array != undefined && array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            if (i == 0) {
                strList = array[i];
            } else {
                strList = strList + "," + array[i].replace("'", "[sq]").trim();
            }
        }
    }
    return strList;

}