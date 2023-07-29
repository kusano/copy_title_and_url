// https://developer.chrome.com/docs/extensions/reference/offscreen/#example-maintaining-the-lifecycle-of-an-offscreen-document
let creating;
async function setup(path) {
    const url = chrome.runtime.getURL(path);
    /*
    // for Chrome 116 or above.
    const contexts = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [url],
    });
    if (contexts.length>0) {
        return;
    }
    */
    for (const client of await clients.matchAll()) {
        if (client.url===url) {
            return;
        }
    }

    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: path,
            reasons: ["CLIPBOARD"],
            justification: "for clipboard",
        });
        await creating;
        creating = null;
    }
}

function escape(original) {
    escaped = "";
    for (const c of original) {
        if (
            c=="[" ||
            c=="]" ||
            c==")" ||
            c=="(" ||
            c==">" ||
            c=="<" ||
            c==" " ||
            c=="\\"
        ) {
            escaped += "\\";
        }
        escaped += c;
    }
    return escaped;
}

chrome.action.onClicked.addListener(async tab => {
    title = tab.title || "";
    url = tab.url || "";

    data = `[${escape(title)}](${escape(url)})`;

    await setup("offscreen.html");
    await chrome.runtime.sendMessage(data);
});
