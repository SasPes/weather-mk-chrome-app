function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function initialize() {
    var gradId = localStorage["gradId"];
    var gradIme = localStorage["gradIme"];
    var gradIdF = localStorage["gradIdF"];
    if (typeof (gradId) === 'undefined' || gradId === null) {
        gradId = "MKXX0001";
        gradIme = "\u0421\u043A\u043E\u043F\u0458\u0435";
        gradIdF = "482940";
        localStorage["gradId"] = gradId;
        localStorage["gradIme"] = gradIme;
        localStorage["gradIdF"] = gradIdF;
    }

    var feed = httpGet("http://wxdata.weather.com/wxdata/weather/rss/local/" + gradId + "?unit=m");
    var xmlData = feed;
    var domParser = new DOMParser();
    var parsedXML = domParser.parseFromString(xmlData, 'text/xml');
    var json = window.rss2json(parsedXML);

    var contentSnippet = json.items[0].description;

    // "Mostly Cloudy, and 12 &deg; C. For more details?"
    var condition = contentSnippet.split(" &deg; C.")[0];
    var start = condition.lastIndexOf(" ");
    var weather = condition.substring(start);
    weather = weather + " \u00b0";

    var end = contentSnippet.indexOf(">");
    var imgSrc = contentSnippet.substring(0, end + 1);
    var regex = /src=\".+\.gif?/;
    imgSrc = regex.exec(imgSrc);
    imgSrc = imgSrc[0].substring(5);
    var endGif = imgSrc.lastIndexOf("/");
    imgSrc = imgSrc.substring(endGif + 1);

    chrome.browserAction.setBadgeText({text: weather});

    // http://fcgi.weather.com/web/common/wxicons/31/
    var imgExt = localStorage["imgs"];
    if (typeof (imgExt) === 'undefined' || imgExt === null) {
        imgExt = ".png";
    }

    var imgNum = imgSrc.substring(0, imgSrc.lastIndexOf("."))

    if (isNumber(imgNum)) {
        if ((imgNum >= 3 && imgNum <= 12) ||
                imgNum === 18 ||
                imgNum === 35 ||
                (imgNum >= 37 && imgNum <= 40) ||
                imgNum === 45 ||
                imgNum === 47) {
            // plava: 3-12, 18, 35, 37-40, 45, 47
            chrome.browserAction.setBadgeBackgroundColor({"color": [85, 186, 229, 255]}); // plava
        } else if (imgNum === 28 ||
                imgNum === 30 ||
                imgNum === 32 ||
                imgNum === 34 ||
                imgNum === 36) {
            // zolta: 28, 30, 32, 34, 36
            chrome.browserAction.setBadgeBackgroundColor({"color": [254, 203, 24, 255]}); // zolta
        } else if (imgNum === 27 ||
                imgNum === 29 ||
                imgNum === 31 ||
                imgNum === 33) {
            // crna: 27, 29, 31, 33
            chrome.browserAction.setBadgeBackgroundColor({"color": [0, 0, 0, 255]}); // crna
        } else {
            // siva: site ostanati
            chrome.browserAction.setBadgeBackgroundColor({"color": [210, 210, 210, 255]}); // siva
        }
    } else {
        // siva: site ostanati
        chrome.browserAction.setBadgeBackgroundColor({"color": [210, 210, 210, 255]}); // siva
    }

    chrome.browserAction.setIcon({path: 'imgs/' + imgNum + imgExt});
}

document.addEventListener('DOMContentLoaded', function () {
    var pageName = window.location.pathname;
    pageName = pageName.substring(pageName.lastIndexOf("/") + 1);

    if (pageName === "vreme-mk-conf.html") {
        document.getElementById("png").addEventListener('click', pngClickHandler);
        document.getElementById("gif").addEventListener('click', gifClickHandler);
        document.getElementById("grad").addEventListener('change', gradClickHandler);

        document.getElementById("min5").addEventListener('click', min5ClickHandler);
        document.getElementById("min15").addEventListener('click', min15ClickHandler);
        document.getElementById("min30").addEventListener('click', min30ClickHandler);
        document.getElementById("min60").addEventListener('click', min60ClickHandler);

        var imgExt = localStorage["imgs"];
        if (typeof (imgExt) === 'undefined' || imgExt === null) {
            imgExt = ".png";
        }
        if (imgExt === ".png") {
            document.getElementById("png").checked = true
        } else {
            document.getElementById("gif").checked = true
        }

        var gradId = localStorage["gradId"];
        var gradIme = localStorage["gradIme"];
        var gradIdF = localStorage["gradIdF"];
        if (typeof (gradId) === 'undefined' || gradId === null) {
            gradId = "MKXX0001";
            gradIme = "\u0421\u043A\u043E\u043F\u0458\u0435";
            gradIdF = "482940";
        }
        document.getElementById(gradId).selected = true;
        localStorage["gradId"] = gradId;
        localStorage["gradIme"] = gradIme;
        localStorage["gradIdF"] = gradIdF;

        var min = localStorage["min"];
        if (typeof (min) === 'undefined' || min === null) {
            min = "15";
        }
        if (min === "5") {
            document.getElementById("min5").checked = true;
        } else if (min === "30") {
            document.getElementById("min30").checked = true;
        } else if (min === "60") {
            document.getElementById("min60").checked = true;
        } else {
            document.getElementById("min15").checked = true;
        }
    }

    if (pageName !== "background.html") {
        weather();
    }

    initialize();
});

function pngClickHandler(e) {
    localStorage["imgs"] = ".png";

    initialize();
}

function gifClickHandler(e) {
    localStorage["imgs"] = ".gif";

    initialize();
}

function gradClickHandler(e) {
    var myselect = document.getElementById("grad");
    var options = myselect.options;
    var id = options[options.selectedIndex].id;
    localStorage["gradId"] = id;
    var text = options[options.selectedIndex].text;
    localStorage["gradIme"] = text;
    var value = options[options.selectedIndex].value;
    localStorage["gradIdF"] = value;

    initialize();

    weather();
}

function min5ClickHandler(e) {
    localStorage["min"] = 5;
}

function min15ClickHandler(e) {
    localStorage["min"] = 15;
}

function min30ClickHandler(e) {
    localStorage["min"] = 30;
}

function min60ClickHandler(e) {
    localStorage["min"] = 60;
}

function isNumber(input) {
    return !isNaN(input);
}

function weather() {
    var gradId = localStorage["gradId"];
    var gradIme = localStorage["gradIme"];
    var gradIdF = localStorage["gradIdF"];
    if (typeof (gradId) === 'undefined' || gradId === null) {
        gradId = "MKXX0001";
        gradIme = "\u0421\u043A\u043E\u043F\u0458\u0435";
        gradIdF = "482940";
        localStorage["gradId"] = gradId;
        localStorage["gradIme"] = gradIme;
        localStorage["gradIdF"] = gradIdF;
    }

    var feed = httpGet("http://wxdata.weather.com/wxdata/weather/rss/local/" + gradId + "?unit=m");
    var xmlData = feed;
    var domParser = new DOMParser();
    var parsedXML = domParser.parseFromString(xmlData, 'text/xml');
    var json = window.rss2json(parsedXML);

    var contentSnippet = json.items[0].description;

    // "Mostly Cloudy, and 12 &deg; C. For more details?"
    var condition = contentSnippet.split(" &deg; C.")[0];
    var start = condition.lastIndexOf(" ");
    var weather = condition.substring(start);
    weather = weather + " \u00b0" + "C";

    var end = contentSnippet.indexOf(">");
    var src = contentSnippet.substring(0, end + 1);
    src = src.replace("/31/", "/93/");
    var imgExt = localStorage["imgs"];
    if (typeof (imgExt) === 'undefined' || imgExt === null) {
        imgExt = ".png";
    }
    src = src.replace(".gif", imgExt);
    src = src.split("src=\"")[1];
    src = src.split("\"")[0];

    // publishedDate
    var dateP = new Date(Date.parse(json.items[0].pubDate));
    var dateDen = dateP.getDate() + "." + (dateP.getMonth() + 1) + "." + dateP.getFullYear();

    var hNula = false;
    if (dateP.getHours().toString().length === 1) {
        hNula = true;
    }

    var mNula = false;
    if (dateP.getMinutes().toString().length === 1) {
        mNula = true;
    }

    var dateVremeHours = dateP.getHours();
    var dateVremeMinutes = dateP.getMinutes();
    if (hNula) {
        dateVremeHours = "0" + dateVremeHours;
    }
    if (mNula) {
        dateVremeMinutes = "0" + dateVremeMinutes;
    }

    var dateVreme = dateVremeHours + ":" + dateVremeMinutes;

    var today = new Date();
    var todayDen = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();

    if (todayDen === dateDen) {
        dateDen = "";
    } else {
        dateDen = dateDen + " ";
    }

    dateP = dateDen + dateVreme;

    var gradIme = localStorage["gradIme"];

    var pageName = window.location.pathname;
    pageName = pageName.substring(pageName.lastIndexOf("/") + 1);

    if (pageName === "vreme-mk-conf.html") {
        var weatherPromena = document.getElementById('weatherPromena');
        weatherPromena.appendChild(document.createTextNode("&nbsp; &nbsp; &nbsp; &nbsp;Последна промена: " + dateP));
    } else {
        var weatherP = document.getElementById('weather');

        var pGrad = document.createElement("p");
        pGrad.style.cssText = "font-size: 23px";
        var bGrad = document.createElement("b");
        var tGrad = document.createTextNode(gradIme);
        bGrad.appendChild(tGrad);
        pGrad.appendChild(bGrad);
        weatherP.appendChild(pGrad);

        weatherP.appendChild(document.createElement("br"));
        weatherP.appendChild(document.createTextNode("моментална температура"));
        weatherP.appendChild(document.createElement("br"));

        var aW = document.createElement("a");
        aW.href = "http://www.weather.com/weather/today/" + gradId;
        var tImg = document.createElement("img");
        tImg.src = src;
        aW.appendChild(tImg);
        weatherP.appendChild(aW);
        weatherP.appendChild(document.createElement("br"));

        var pPP = document.createElement("p");
        pPP.style.cssText = "font-size: 26px";
        var bPP = document.createElement("b");
        var tPP = document.createTextNode(weather);
        bPP.appendChild(tPP);
        pPP.appendChild(bPP);
        weatherP.appendChild(pPP);
        weatherP.appendChild(document.createElement("br"));

        weatherP.appendChild(document.createTextNode("Последна промена: " + dateP));

        weatherForecast();
    }
}

var weatherForecastCallback = function (data) {
    data = JSON.parse(data);

    if (data.query.results === null) {
        // TODO: error
    } else {

        var forecast = data.query.results.channel.item.forecast;

        if (forecast !== null) {
            var day0 = forecast[0];
            var day1 = forecast[1];
            var day2 = forecast[2];
            var day3 = forecast[3];

            day0 = parsWeatherForecast(day0).split(";");
            day1 = parsWeatherForecast(day1).split(";");
            day2 = parsWeatherForecast(day2).split(";");
            day3 = parsWeatherForecast(day3).split(";");

            if (day0 === 'undefined' || day0 === null) {
                day0 = "\u041D\u0435\u043C\u0430 \u0438\u043D\u0444\u043E; ; ;na";
            }
            if (day1 === 'undefined' || day1 === null) {
                day1 = "\u041D\u0435\u043C\u0430 \u0438\u043D\u0444\u043E; ; ;na";
            }
            if (day2 === 'undefined' || day2 === null) {
                day2 = "\u041D\u0435\u043C\u0430 \u0438\u043D\u0444\u043E; ; ;na";
            }
            if (day3 === 'undefined' || day3 === null) {
                day3 = "\u041D\u0435\u043C\u0430 \u0438\u043D\u0444\u043E; ; ;na";
            }

            var imgExt = localStorage["imgs"];
            if (typeof (imgExt) === 'undefined' || imgExt === null) {
                imgExt = ".png";
            }

            var weatherForecast = document.getElementById('weatherForecast');

            var tWfc = document.createElement("table");
            var trWfc = document.createElement("tr");

            var days = [day0, day1, day2, day3];
            for (var i = 0 ; i < days.length ; i++) {
                var tdWfc = document.createElement("td");
                tdWfc.width = "25%";
                tdWfc.align = "center";
                tdWfc.appendChild(document.createTextNode(days[i][0]));
                tdWfc.appendChild(document.createElement("br"));
                var imgWfc = document.createElement("img");
                imgWfc.src = "imgs/" + days[i][3] + imgExt;
                tdWfc.appendChild(imgWfc);
                tdWfc.appendChild(document.createElement("br"));
                tdWfc.appendChild(document.createTextNode("мин: " + days[i][1] + "\u00b0" + "C"));
                tdWfc.appendChild(document.createElement("br"));
                tdWfc.appendChild(document.createTextNode("мах: " + days[i] [2] + "\u00b0" + "C"));
                trWfc.appendChild(tdWfc);
            }
            
            tWfc.appendChild(trWfc);
            weatherForecast.appendChild(tWfc);
        }
    }
};

function weatherForecast() {
    var gradIdF = localStorage["gradIdF"];
    if (typeof (gradIdF) === 'undefined' || gradIdF === null) {
        gradIdF = "482940";
        localStorage["gradIdF"] = gradIdF;
    }

    // https://gist.github.com/anonymous/7f79807bc6abb00024df
    // https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid=482940 and u='c'
    // https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid=482940%20and%20u=%27c%27

    var urlScript = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid=" + gradIdF + "%20and%20u=%27c%27&format=json";
    console.log(urlScript);
    httpGetAsync(urlScript, weatherForecastCallback);
}

function parsWeatherForecast(day) {
    // Mon - Thunderstorms Early. High: 26 Low: 13
    // code:"30"
    // date:"05 Jun 2016"
    // day:"Sun"
    // high:"25"
    // low:"11"
    // text:"Partly Cloudy"
    var den = day.day;

    // Mon Tue Wed Thu Fri Sat Sun
    // \u041F\u043E\u043D \u0412\u0442\u043E \u0421\u0440\u0435 \u0427\u0435\u0442 \u041F\u0435\u0442 \u0421\u0430\u0431 \u041D\u0435\u0434
    // \u041F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A
    // \u0412\u0442\u043E\u0440\u043D\u0438\u043A
    // \u0421\u0440\u0435\u0434\u0430
    // \u0427\u0435\u0442\u0432\u0440\u0442\u043E\u043A
    // \u041F\u0435\u0442\u043E\u043A
    // \u0421\u0430\u0431\u043E\u0442\u0430
    // \u041D\u0435\u0434\u0435\u043B\u0430
    if (den === "Mon") {
        den = "\u041F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A";
    } else if (den === "Tue") {
        den = "\u0412\u0442\u043E\u0440\u043D\u0438\u043A";
    } else if (den === "Wed") {
        den = "\u0421\u0440\u0435\u0434\u0430";
    } else if (den === "Thu") {
        den = "\u0427\u0435\u0442\u0432\u0440\u0442\u043E\u043A";
    } else if (den === "Fri") {
        den = "\u041F\u0435\u0442\u043E\u043A";
    } else if (den === "Sat") {
        den = "\u0421\u0430\u0431\u043E\u0442\u0430";
    } else if (den === "Sun") {
        den = "\u041D\u0435\u0434\u0435\u043B\u0430";
    } else {
        return 'undefined';
    }

    var visoka = day.high;
    var niska = day.low;

    var slika = day.text;
    var slikaNum = "na";
    if (slika === "Thunderstorms Early") {
        slikaNum = 47;
    } else if (slika === "Mostly Sunny") {
        slikaNum = 34;
    } else if (slika === "Mostly Cloudy") {
        slikaNum = 28;
    } else if (slika === "Scattered Showers" || slika === "PM Showers" || slika === "AM Showers") {
        slikaNum = 39;
    } else if (slika === "Rain") {
        slikaNum = 12;
    } else if (slika === "Showers" || slika === "Light Rain") {
        slikaNum = 11;
    } else if (slika === "Clear") {
        slikaNum = 31;
    } else if (slika === "Cloudy") {
        slikaNum = 26;
    } else if (slika === "Mostly Clear") {
        slikaNum = 33;
    } else if (slika === "Sunny") {
        slikaNum = 32;
    } else if (slika === "Partly Cloudy" || slika === "AM Clouds/PM Sun") {
        slikaNum = 30;
    } else if (slika === "Scattered T-Storms" || slika === "PM T-Storms" || slika === "Scattered Thunderstorms") {
        slikaNum = 38;
    } else if (slika === "T-Storms") {
        slikaNum = 4;
    }

    return den + ";" + niska + ";" + visoka + ";" + slikaNum;
}
