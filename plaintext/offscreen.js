chrome.runtime.onMessage.addListener(message => {
    const text = document.getElementById("text");
    text.value = message;
    text.select();
    document.execCommand("copy");
});
