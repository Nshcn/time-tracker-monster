document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settings').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
    document.getElementById("egg").addEventListener('click' ,function(){
        document.getElementById("main").src = "./pages/eggPage/index.html"
    })
    document.getElementById("fight").addEventListener('click' ,function(){
        document.getElementById("main").src = "./pages/fight/index.html"
    })
})