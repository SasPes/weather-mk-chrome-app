/*
* Example Usage: 
* 
*   $.get('http://cors.io/sprunge.us/ILRc', function(data) {
*     window.xmlData = data;
*     window.domParser = new DOMParser();
*     window.parsedXML = domParser.parseFromString(window.xmlData, 'text/xml');
*     window.jsonFeed = rss2json(parsedXML);
*   });
* 
*/

window.rss2json = function(feed) {
  String.prototype.c = function() {
        var newStr = this.replace("<![CDATA[", "").replace("]]>", "");
        return newStr;
  };
  var json = {
      title: feed.querySelector('title').innerHTML.c(),
      description: feed.querySelector('description').innerHTML.c(),
      link: feed.querySelector('link').innerHTML.c(),
      image: {
          url: feed.querySelector('image url').innerHTML.c(),
          title: feed.querySelector('image title').innerHTML.c(),
          link: feed.querySelector('image link').innerHTML.c()
      },
//      author: feed.querySelector('author').innerHTML.c(),
      items: []
  };
  for(i=0; i<feed.querySelectorAll('item').length; i++) {
      itm = feed.querySelectorAll('item')[i];
      json.items[i] = {
          title: itm.querySelector('title').innerHTML.c(),
          description: itm.querySelector('description').innerHTML.c(),
          link: itm.querySelector('link').innerHTML.c(),
          pubDate: itm.querySelector('pubDate').innerHTML.c()
      };
  }
  return json;
};