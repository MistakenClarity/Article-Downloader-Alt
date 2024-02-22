function listenForClicks() {
    const locIdEl = document.getElementById('siteName');
    const submitButton = document.getElementById("Submit");

    submitButton.addEventListener("click", (e) => {
        function startDownload(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "download",
                siteName: locIdEl.value,
            });
        }

        function reportError(error) {
            console.error(`Could not download: ${error}`);
        }

        browser.tabs
            .query({ active: true, currentWindow: true })
            .then(startDownload)
            .catch(reportError);

    });
}

function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute downloader content script: ${error.message}`);
}

browser.tabs
    .executeScript({ file: "/content_scripts/downloader.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
