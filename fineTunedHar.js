var portObject = { proxyPort: 8082 }

var Proxy = require('browsermob-proxy').Proxy
    , webdriverjs = require("webdriverjs")
    , fs = require('fs')
    , proxy = new Proxy(portObject)
;

proxy.cbHAR({ portObject, name: 'search.yahoo.com', captureHeaders: true, captureContent: true, captureBinary: true }, doSeleniumStuff, function(err, data) {
        if (err) {
            console.error('ERR: ' + err);
        } else {
            fs.writeFileSync('stuff.har', data, 'utf8');
        }
});

function doSeleniumStuff(proxy, cb) {
    var browser = webdriverjs.remote({
        host: 'localhost'
        , port: 4444
        , desiredCapabilities: { browserName: 'firefox', seleniumProtocol: 'WebDriver', proxy: { httpProxy: proxy } }
    });

    browser
        .init()
        .url("http://search.yahoo.com")
        .setValue("#yschsp", "javascript")
        .submitForm("#sf")
        .end(cb);
}
