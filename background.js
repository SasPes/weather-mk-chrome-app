google.load("feeds", "1");

function initialize() {
	var gradId = localStorage["gradId"];
	var gradIme = localStorage["gradIme"];
	if(typeof (gradId) == 'undefined' || gradId == null){
		gradId = "MKXX0001";
		var gradIme = "\u0421\u043A\u043E\u043F\u0458\u0435";
		localStorage["gradId"] = gradId;
		localStorage["gradIme"] = gradIme;
	}
    var feed = new google.feeds.Feed("http://wxdata.weather.com/wxdata/weather/rss/local/" + gradId + "?unit=m");
    feed.setNumEntries(1);

    feed.load(function(result) {
        if (!result.error) {
            var entry = result.feed.entries[0];

            // "Mostly Cloudy, and 12 &deg; C. For more details?"
            var contentSnippet = entry.contentSnippet;
            var condition = contentSnippet.split(" &deg; C.")[0];
            var start = condition.lastIndexOf(" ");
            var weather = condition.substring(start);
            weather = weather + " \u00b0";
            
            var content = entry.content;
            var end = content.indexOf(">");
            var imgSrc = content.substring(0, end+1);
			var regex = /src=\".+\.gif?/;
            imgSrc = regex.exec(imgSrc);
			imgSrc = imgSrc[0].substring(5);
			var endGif = imgSrc.lastIndexOf("/");
			imgSrc = imgSrc.substring(endGif+1);
			
            chrome.browserAction.setBadgeText({text: weather});
			
			// http://fcgi.weather.com/web/common/wxicons/31/
			var imgExt = localStorage["imgs"];
			if(typeof (imgExt) == 'undefined' || imgExt == null){
				imgExt = ".png";
			}
			
			var imgNum = imgSrc.substring(0, imgSrc.lastIndexOf("."))
			
			if(isNumber(imgNum)) {
				if( (imgNum >= 3 && imgNum <= 12) || 
					imgNum == 18 || 
					imgNum == 35 || 
					(imgNum >= 37 && imgNum <= 40) || 
					imgNum == 45 || 
					imgNum == 47 ){
					// plava: 3-12, 18, 35, 37-40, 45, 47
					chrome.browserAction.setBadgeBackgroundColor({"color": [85, 186, 229, 255]}); // plava
				} else if( imgNum == 28 || 
					imgNum == 30 || 
					imgNum == 32 || 
					imgNum == 34 ||
					imgNum == 36 ){
					// zolta: 28, 30, 32, 34, 36
					chrome.browserAction.setBadgeBackgroundColor({"color": [254, 203, 24, 255]}); // zolta
				} else if( imgNum == 27 || 
					imgNum == 29 || 
					imgNum == 31 || 
					imgNum == 33 ){
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
    });
}
google.setOnLoadCallback(initialize);

function isNumber( input ) {
    return !isNaN( input );
}

var min = localStorage["min"];

window.setInterval(function() {
	if(typeof (gradId) == 'undefined' || gradId == null){
		min = 15;
		localStorage["min"] = min;
	}
    google.load("feeds", "1");
    initialize();
    google.setOnLoadCallback(initialize);
}, 1000 * 60 * min); // 15 min