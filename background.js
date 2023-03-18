try {
    chrome.runtime.onMessage.addListener(receiver);

    function receiver(request, sender, sendResponse) {
        console.log("got a request", request.message)
        let theBody = { "document": request.message }

        //run text to plagiarism detectors
        fetch("https://api.gptzero.me/v2/predict/text", {
            "headers": {
                "accept": "*/*",
                "origin": "https://gptzero.me",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "sec-gpc": "1",
                "Referer": "https://gptzero.me/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
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