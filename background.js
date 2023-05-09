// Redirect to welcome page when extension is installed
chrome.runtime.onInstalled.addListener(async function () {
    let welcomed = await chrome.storage.local.get('installed');
    welcomed = welcomed.installed ?? false;

    if (welcomed !== true) {
        chrome.storage.local.set({ installed: true }, function () {
            // show welcome page
            chrome.tabs.create({ url: 'https://copygpt.sethusenthil.com/welcome.html' });
        });
    }
});

// Redirect to bye page when extension is uninstalled
chrome.runtime.setUninstallURL('https://copygpt.sethusenthil.com/bye.html');

try {
    chrome.runtime.onMessage.addListener(receiver);

    function receiver(request, sender, sendResponse) {
        //console.log("got a request", request.message)

        let headers = {
            "accept": "text/plain, */*; q=0.01",
            "accept-language": "en-US,en;q=0.8",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://writer.com/ai-content-detector/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }

        const formData = new FormData();
        formData.append("input", request.message);


        const data = new URLSearchParams(formData);

        //console.log('sending data', data.toString());

        //run text to plagiarism detectors

        const apiUrl = "https://writer.com/wp-admin/admin-ajax.php";

        const dataChunks = chunkString(data.toString(), 1500); // split the data string into 1500 character chunks

        let responses = []; // array to store the responses

        Promise.all(dataChunks.map((chunk) => {
            return fetch(apiUrl, {
                headers,
                body: `action=ai_content_detector_recaptcha&inputs=${encodeURIComponent(chunk)}&token=`,
                method: "POST"
            })
                .then(response => response.json())
                .then(data => {
                    responses.push(data); // add response to the array
                })
                .catch(error => console.error('Request Error:', error));
        }))
            .then(() => {
                //console.log("All chunks processed", responses);
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id,
                        {
                            message: responses
                        }, function (response) { })
                })
            })
            .catch(error => console.error('Promise Error:', error));

        // function to split a string into chunks of a specified size
        function chunkString(str, size) {
            const numChunks = Math.ceil(str.length / size);
            const chunks = new Array(numChunks);
            for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
                chunks[i] = str.substr(o, size);
            }
            return chunks;
        }



    }
} catch (err) {
    console.log(err);
}