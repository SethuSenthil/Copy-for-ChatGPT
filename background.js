// Redirect to welcome page when extension is installed
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({ url: 'https://copygpt.sethusenthil.com/welcome.html' });
});

// Redirect to bye page when extension is uninstalled
chrome.runtime.setUninstallURL('https://copygpt.sethusenthil.com/bye.html');

try {
    chrome.runtime.onMessage.addListener(receiver);

    function receiver(request, sender, sendResponse) {
        //console.log("got a request", request.message)
        let theBody = { "document": request.message }

        let apiToken = null;

        // Retrieve api token from Chrome storage local
        chrome.storage.local.get(['token'], function (result) {
            apiToken = result.token;
        });

        let headers = {
            "accept": "*/*",
            "origin": "https://gptzero.me",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Brave\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-gpc": "1",
            "Referer": "https://gptzero.me/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
        }

        //if apiToken exists, add it to the headers
        if (apiToken) {
            headers['cookie', apiToken]
        }

        //run text to plagiarism detectors
        fetch("https://api.gptzero.me/v2/predict/text", {
            "headers": headers,
            "body": JSON.stringify(theBody),
            "method": "POST"
        }).then(response => response.json()).then(data => {
            console.log('data', data);
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id,
                    {
                        message: data
                    }, function (response) { })
            })
        }).catch((error) => {
            console.error('Request Error:', error);
        });

    }
} catch (err) {
    console.log(err);
}