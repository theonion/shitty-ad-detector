var webpage = require('webpage');
var system = require('system');


if (system.args.length === 1) {
  console.log('Usage: tester.js <URL> [<URL>...]');
  phantom.exit();
}

global.requestCount = 0;

var userAgents = [
  'Mozilla/5.0 (iPhone; U; CPU iPhone OS 6_0 like Mac OS X; en_US) AppleWebKit (KHTML, like Gecko) Mobile [FBAN/FBForIPhone;FBAV/4.1.1;FBBV/4110.0;FBDV/iPhone4,1;FBMD/iPhone;FBSN/iPhone OS;FBSV/6.0;FBSS/2; FBCR/3SE;FBID/phone;FBLC/en_US;FBSF/2.0]',
  'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
];

function onResourceRequested(requestData, request) {
  var allowedSchemes = ["http", "https", "data"];
  var funky = true;
  for (var i=0;i < allowedSchemes.length;i++){
    if (requestData.url.indexOf(allowedSchemes[i]) == 0 ) {
      funky = false;
      break;
    }
  }
  funky |= requestData.url.search('.nl/') != -1;
  if (funky){
    console.log(requestData.url);
  }
}

function requestComplete(status) {
  if (status !== 'success') {
    console.log(status);
  }
  global.requestCount++;
  var totalRequests = (system.args.length - 1) * userAgents.length;
  if (global.requestCount == totalRequests) {
    setTimeout(phantom.exit, 5000)
  }
}

for (var i=1; i < system.args.length; i++){
  for (var j in userAgents){
    var page = webpage.create();
    page.settings.userAgent = userAgents[j];
    page.onResourceRequested = onResourceRequested;
    page.onError = function(resourceError) {};
    page.onResourceError = function(resourceError) {};
    page.open(system.args[i], requestComplete)
  }
}