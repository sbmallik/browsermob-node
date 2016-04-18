var webdriverjs = require("webdriverjs")
    , Proxy = require('browsermob-proxy').Proxy
    , fs = require('fs')
    , proxyHost = 'localhost'
    ;

    var proxy = new Proxy( { host: proxyHost });
    proxy.start(function(err, data) {
                if (!err) {
                    // SET AND OVERRIDE HTTP REQUEST HEADERS IF YOU WANT TO
                    var headersToSet = {
                        'User-Agent': 'Bananabot/1.0',
                        'custom-header1': 'custom-header1-value',
                        'custom-header2': 'custom-header2-value'
                    }
                    proxy.addHeader(data.port, headersToSet, function (err,resp) {
                        if(!err) {
                            proxy.startHAR(data.port, 'http://localhost:8004', true, true, true, function (err, resp) {
                                if (!err) {
                                    // DO WHATEVER WEB INTERACTION YOU WANT USING THE PROXY
                                    doSeleniumStuff(proxyHost + ':' +  data.port, function () {
                                        proxy.getHAR(data.port, function(err, resp) {
                                            if (!err) {
                                                console.log(resp);
                                                fs.writeFileSync('output.har', resp, 'utf8');
                                            } else {
                                                console.err('Error getting HAR file: ' + err);
                                            }
                                            proxy.stop(data.port, function() {});
                                        });
                                    });
                                } else {
                                    console.error('Error starting HAR: ' + err);
                                    proxy.stop(data.port, function () {
                                    });
                                }
                            });
                        } else {
                             console.error('Error setting the custom headers');
                             proxy.stop(data.port, function () {
                           });
                        }
                    });
                } else {
                    console.error('Error starting proxy: ' + err);
                }
            });


function doSeleniumStuff(proxy, cb) {
    var browser = webdriverjs.remote({
        host: 'localhost'
        , port: 4444
        , desiredCapabilities: { browserName: 'firefox', seleniumProtocol: 'WebDriver', proxy: { httpProxy: proxy } }
    });

    browser
//        .testMode()
        .init()
        .url("http://search.yahoo.com")
        .setValue("#yschsp", "javascript")
        .submitForm("#sf")
//        .assert.visible('#resultCount', true, 'Got result count')
        .saveScreenshot('results.png')
        .end(cb);
}
