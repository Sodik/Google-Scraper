var request = require('request')
,async = require('async')
,cheerio = require('cheerio');


/*
*PARAMETERS : {keyword : '', language : '', results : ''}
*/
function GoogleScraper(options){
};
exports.GoogleScraper = GoogleScraper;

GoogleScraper.prototype.getGoogleLinks = function(options, callback){
  var self = this
  ,html;

  async.series([
    function(callback) {
      self._getHtml(options, function(data){
        html=data;
        callback();
      })
    },
    function(callback) {
      self._extractLink(html,function(){
        callback();
      })
    }
    ], function(err) {
      if (err) return next(err);
      callback(self.arrayLinks);
    });
}

/*
 * INTERNAL UTILITY FUNCTIONS
 */
 //TODO : EXCEPTION HANDLING
 GoogleScraper.prototype._getHtml = function(options, callback){
   request('http://www.google.fr/search?hl='+options.language+'&num='+this.results+'&q='+options.keyword, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    }
  })
 }

 GoogleScraper.prototype._extractLink = function(html, callback){
  var self = this;
  var $ = cheerio.load(html);
  var links = $('h3.r a');
  this.arrayLinks = [];
  $(links).each(function(i, link){
    var linkClean = $(link).attr('href').match("(?=http).*(?=&sa)");
    if(linkClean !== null){
      self.arrayLinks.push(linkClean[0]);
    }
  })
  callback();
}