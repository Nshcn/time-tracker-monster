var storage = new LocalStorage();
var blackList = [];
var goodList = [];
var badList = [];
var restrictionList = [];
var notifyList = [];
var blockBtnList = ['settingsBtn', 'petsBtn', 'aboutBtn', 'donateBtn'];
var blockList = ['settingsBlock', 'petsBlock', 'aboutBlock', 'donateBlock'];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settingsBtn').addEventListener('click', function () {
        setBlockEvent('settingsBtn', 'settingsBlock');
    });
    document.getElementById('aboutBtn').addEventListener('click', function () {
        setBlockEvent('aboutBtn', 'aboutBlock');
        loadVersion();
    });
    document.getElementById('donateBtn').addEventListener('click', function () {
        setBlockEvent('donateBtn', 'donateBlock');
    });
    //宠物按钮
    document.getElementById('petsBtn').addEventListener('click', function () {
        setBlockEvent('petsBtn', 'petsBlock');
    });
    document.getElementById('addBlackSiteBtn').addEventListener('click', function () {
        addNewSiteClickHandler('addBlackSiteLbl', null, actionAddBlackSiteToList, 'notifyForBlackList');
    });
    // 添加好坏网站
    document.getElementById('addGoodSiteBtn').addEventListener('click', function () {
        addNewSiteClickHandler('addGoodSiteLbl', null, actionAddGoodSiteToList, 'notifyForBlackList');
    });
    document.getElementById('addBadSiteBtn').addEventListener('click', function () {
        addNewSiteClickHandler('addBadSiteLbl', null, actionAddBadSiteToList, 'notifyForBlackList');
    });
    $('.clockpicker').clockpicker();
    loadSettings();
    updatePetsList();
});

function setBlockEvent(btnName, blockName) {
    blockBtnList.forEach(element => {
        if (element === btnName) {
            document.getElementById(btnName).classList.add('active');
        }
        else document.getElementById(element).classList.remove('active');
    });

    blockList.forEach(element => {
        if (element === blockName) {
            document.getElementById(blockName).hidden = false;
        } else {
            chrome.extension.getBackgroundPage().console.log(element);
            document.getElementById(element).hidden = true;
        }
    });
}

function loadSettings() {
    storage.getValue(STORAGE_TABS, function (item) {
        let s = item;
    });
    storage.getValue(STORAGE_BLACK_LIST, function (items) {
        if (items !== undefined)
            blackList = items;
        else blackList = [];
        viewList(items, blackList, 'blackList');
    });
    storage.getValue('good_list', function (items) {
        if (items !== undefined)
            goodList = items;
        else badList = [];
        viewList(items, goodList, 'goodList');
    });
    storage.getValue('bad_list', function (items) {
        if (items !== undefined)
            badList = items;
        else badList = [];
        viewList(items, badList, 'badList');
    });
    storage.getValue(STORAGE_RESTRICTION_LIST, function (items) {
        restrictionList = items;
        if (restrictionList === undefined)
            restrictionList = [];
        viewRestrictionList(items);
    });
    storage.getValue(STORAGE_NOTIFICATION_LIST, function (items) {
        notifyList = items;
        if (notifyList === undefined)
            notifyList = [];
        viewNotificationList(items);
    });
}


function loadVersion() {
    var version = chrome.runtime.getManifest().version;
    document.getElementById('version').innerText = 'v' + version;
}

function viewList(items, list, listType) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToListBox(items[i], list, listType);
        }
    }
}

function addDomainToListBox(domain, list, listType) {
    var li = document.createElement('li');
    li.innerText = domain;
    var del = document.createElement('img');
    del.height = 12;
    del.src = '/icons/delete.png';
    del.addEventListener('click', function (e) {
        deleteSite(e, list, listType);
    });
    document.getElementById(listType).appendChild(li).appendChild(del);
}

function deleteSite(e, list, listType) {
    var targetElement = e.path[1];
    list.splice(list.indexOf(targetElement.innerText), 1);
    document.getElementById(listType).removeChild(targetElement);
    updateList(listType);
}

function grantPermissionForNotifications() {
    chrome.permissions.request({
        permissions: ["notifications"]
    }, function (granted) {
        // The callback argument will be true if the user granted the permissions.
        if (granted) {
            setUIForAnyPermissionForNotifications();
        }
    });
}

function setUIForAnyPermissionForNotifications() {
    document.getElementById('permissionSuccessedBlockForNotifications').hidden = false;
    document.getElementById('permissionSuccessedBlockForNotifications').classList.add('inline-block');
    document.getElementById('grantPermissionForNotifications').hidden = true;
}

function viewNotificationList(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToEditableListBox(items[i], 'notifyList', actionEditSite, deleteNotificationSite, updateItemFromNotifyList, updateNotificationList);
        }
    }
}

function viewRestrictionList(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToEditableListBox(items[i], 'restrictionsList', actionEditSite, deleteRestrictionSite, updateItemFromResctrictoinList, updateRestrictionList);
        }
    }
}

function exportToCSV() {
    storage.getValue(STORAGE_TABS, function (item) {
        toCsv(item);
    });
}

function backup() {
    storage.getValue(STORAGE_TABS, function (item) {
        let tabs = JSON.stringify(item);
        createFile(tabs, "application/json", 'backup.json');
        viewNotify('notify-backup');
    });
}

function restoreDataClick() {
    document.getElementById('file-input-backup').click();
}

function restore(e) {
    let file = e.target.files[0];
    if (file.type === "application/json") {
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = readerEvent => {
            let content = readerEvent.target.result;
            let tabs = JSON.parse(content);
            chrome.extension.getBackgroundPage().tabs = tabs;
            storage.saveTabs(tabs, allDataDeletedSuccess);
            viewNotify('notify-restore');
        }
    } else {
        viewNotify('notify-restore-failed');
    }
}

function toCsv(tabsData) {
    var str = 'domain,date,time(sec)\r\n';
    for (var i = 0; i < tabsData.length; i++) {
        for (var y = 0; y < tabsData[i].days.length; y++) {
            var line = tabsData[i].url + ',' + new Date(tabsData[i].days[y].date).toLocaleDateString() + ',' + tabsData[i].days[y].summary;
            str += line + '\r\n';
        }
    }

    createFile(str, "text/csv", 'domains.csv');
}

function createFile(data, type, fileName) {
    var file = new Blob([data], { type: type });
    var downloadLink;
    downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function clearAllData() {
    var tabs = [];
    chrome.extension.getBackgroundPage().tabs = tabs;
    storage.saveTabs(tabs, allDataDeletedSuccess);
}

function allDataDeletedSuccess() {
    viewNotify('notify');
}

function viewNotify(elementName) {
    document.getElementById(elementName).hidden = false;
    setTimeout(function () { document.getElementById(elementName).hidden = true; }, 3000);
}



function actionAddBlackSiteToList(newSite) {
    if (!isContainsSite(newSite, blackList)) {
        addDomainToListBox(newSite, blackList, 'blackList');
        if (blackList === undefined)
            blackList = [];
        blackList.push(newSite);
        document.getElementById('addBlackSiteLbl').value = '';
        updateList('blackList');
        return true;
    } else return false;
}
function actionAddGoodSiteToList(newSite) {
    if (!isContainsSite(newSite, goodList)) {
        addDomainToListBox(newSite, goodList, 'goodList');
        if (goodList === undefined) {
            goodList = [];
        }
        goodList.push(newSite);
        document.getElementById('addGoodSiteLbl').value = '';

        updateList('goodList');

        return true;
    } else return false;
}
function actionAddBadSiteToList(newSite) {
    if (!isContainsSite(newSite, badList)) {
        addDomainToListBox(newSite, badList, 'badList');
        if (badList === undefined) {
            badList = [];
        }
        badList.push(newSite);
        document.getElementById('addBadSiteLbl').value = '';

        updateList('badList');

        return true;
    } else return false;
}

function actionAddNotifyToList(newSite, newTime) {
    if (!isContainsNotificationSite(newSite)) {
        var notify = new Notification(newSite, newTime);
        addDomainToEditableListBox(notify, 'notifyList', actionEditSite, deleteNotificationSite, updateItemFromNotifyList, updateNotificationList);
        if (notifyList === undefined)
            notifyList = [];
        notifyList.push(notify);
        document.getElementById('addNotifySiteLbl').value = '';
        document.getElementById('addNotifyTimeLbl').value = '';

        updateNotificationList();

        return true;
    } else return false;
}

function addNewSiteClickHandler(lblName, timeName, actionCheck, notifyBlock) {
    chrome.extension.getBackgroundPage().console.log('add new site click handler');
    var newSite = document.getElementById(lblName).value;
    var newTime;
    if (timeName != null)
        newTime = document.getElementById(timeName).value;
    if (newSite !== '' && (newTime === undefined || (newTime !== undefined && newTime !== ''))) {
        if (!actionCheck(newSite, newTime))
            viewNotify(notifyBlock);
    }
}



function addDomainToEditableListBox(entity, elementId, actionEdit, actionDelete, actionUpdateTimeFromList, actionUpdateList) {
    var li = document.createElement('li');

    var domainLbl = document.createElement('input');
    domainLbl.type = 'text';
    domainLbl.classList.add('readonly-input', 'inline-block', 'element-item');
    domainLbl.value = entity.domain;
    domainLbl.readOnly = true;
    domainLbl.setAttribute('name', 'domain');

    var edit = document.createElement('img');
    edit.setAttribute('name', 'editCmd');
    edit.height = 14;
    edit.src = '/icons/edit.png';
    edit.addEventListener('click', function (e) {
        actionEdit(e, actionUpdateTimeFromList, actionUpdateList);
    });

    var del = document.createElement('img');
    del.height = 12;
    del.src = '/icons/delete.png';
    del.classList.add('margin-left-5');
    del.addEventListener('click', function (e) {
        actionDelete(e, actionUpdateTimeFromList, actionUpdateList);
    });

    var bloc = document.createElement('div');
    bloc.classList.add('clockpicker');
    bloc.setAttribute('data-placement', 'left');
    bloc.setAttribute('data-align', 'top');
    bloc.setAttribute('data-autoclose', 'true');
    var timeInput = document.createElement('input');
    timeInput.type = 'text';
    timeInput.classList.add('clock', 'clock-li-readonly');
    timeInput.setAttribute('readonly', true);
    timeInput.setAttribute('name', 'time');
    timeInput.value = convertShortSummaryTimeToString(entity.time);
    bloc.appendChild(timeInput);

    var hr = document.createElement('hr');
    var li = document.getElementById(elementId).appendChild(li);
    li.appendChild(domainLbl);
    li.appendChild(del);
    li.appendChild(edit);
    li.appendChild(bloc);
    li.appendChild(hr);
}



function deleteRestrictionSite(e) {
    var targetElement = e.path[1];
    var itemValue = targetElement.querySelector("[name='domain']").value;
    var item = restrictionList.find(x => x.domain == itemValue);
    restrictionList.splice(restrictionList.indexOf(item), 1);
    document.getElementById('restrictionsList').removeChild(targetElement);
    updateRestrictionList();
}

function deleteNotificationSite(e) {
    var targetElement = e.path[1];
    var itemValue = targetElement.querySelector("[name='domain']").value;
    var item = notifyList.find(x => x.domain == itemValue);
    notifyList.splice(notifyList.indexOf(item), 1);
    document.getElementById('notifyList').removeChild(targetElement);
    updateNotificationList();
}

function actionEditSite(e, actionUpdateTimeFromList, actionUpdateList) {
    var targetElement = e.path[1];
    var domainElement = targetElement.querySelector('[name="domain"]');
    var timeElement = targetElement.querySelector('[name="time"]');
    if (timeElement.classList.contains('clock-li-readonly')) {
        timeElement.classList.remove('clock-li-readonly');
        var hour = timeElement.value.split(':')[0].slice(0, 2);
        var min = timeElement.value.split(':')[1].slice(1, 3);
        timeElement.value = hour + ':' + min;
        var editCmd = targetElement.querySelector('[name="editCmd"]');
        editCmd.src = '/icons/success.png';
        $('.clockpicker').clockpicker();
    }
    else {
        var domain = domainElement.value;
        var time = timeElement.value;
        if (domain !== '' && time !== '') {
            var editCmd = targetElement.querySelector('[name="editCmd"]');
            editCmd.src = '/icons/edit.png';
            timeElement.classList.add('clock-li-readonly');
            var resultTime = convertShortSummaryTimeToString(convertTimeToSummaryTime(time));
            timeElement.value = resultTime;

            actionUpdateTimeFromList(domain, time);
            actionUpdateList();
        }
    }
}

function isContainsRestrictionSite(domain) {
    return restrictionList.find(x => x.domain == domain) != undefined;
}

function isContainsNotificationSite(domain) {
    return notifyList.find(x => x.domain == domain) != undefined;
}

function isContainsSite(domain, list) {
    return list.find(x => x == domain) != undefined;
}

function updateItemFromResctrictoinList(domain, time) {
    restrictionList.find(x => x.domain === domain).time = convertTimeToSummaryTime(time);
}

function updateItemFromNotifyList(domain, time) {
    notifyList.find(x => x.domain === domain).time = convertTimeToSummaryTime(time);
}


function updateList(listType) {
    switch (listType) {
        case 'blackList':
            storage.saveValue('black_list', blackList);
            break;
        case 'goodList':
            storage.saveValue('good_list', goodList);
            break;
        case 'badList':
            storage.saveValue('bad_list', badList);
            break;
    }
}

function updateRestrictionList() {
    storage.saveValue(STORAGE_RESTRICTION_LIST, restrictionList);
}

function updateNotificationList() {
    storage.saveValue(STORAGE_NOTIFICATION_LIST, notifyList);
}

function updateNotificationMessage() {
    storage.saveValue(STORAGE_NOTIFICATION_MESSAGE, document.getElementById('notifyMessage').value);
}
// function updatePetsList() {
//     let activeID = localStorage.getItem("activeID");
//     let petsContainer = document.getElementById("petsContainer");
//     let pets = JSON.parse(localStorage.getItem('pets'));
//     petsContainer.addEventListener('click', setActiveID);
//     for (let petID in pets) {
//         let pet = pets[petID]
//         let petDiv = document.createElement("div");
//         petDiv.className = "pet-box";
//         let petImage = document.createElement("img");
//         petImage.src = pet.dataURL;
//         let petName = document.createElement("b");
//         petName.innerText = pet.name || "your pet";
//         let petGoButton = document.createElement("button");
//         petGoButton.innerText = petID === activeID ? "已上场" : "上场";
//         petGoButton.disabled = petID === activeID;
//         petGoButton.id = petID;
//         petGoButton.className = 'petGoBtn';
//         for (let item of [petImage, petName, petGoButton]) {
//             petDiv.appendChild(item);
//         }
//         petsContainer.appendChild(petDiv);
//     }
// }
function updatePetsList() {
    let activeID = localStorage.getItem("activeID");
    let petsContainer = document.getElementById("petsContainer");
    let pets = JSON.parse(localStorage.getItem('pets'));
    petsContainer.addEventListener("click",changGoPet)
    for(let petID in  pets){
        let pet = pets[petID];
        let petbox = document.createElement("pet-box");
        let petGoButton = petbox.shadowRoot.querySelector("#petBtn");
        let petImg = petbox.shadowRoot.querySelector("#petimg");
        let petName = petbox.shadowRoot.querySelector("#petname");
        petGoButton.innerText = petID === activeID ? "已上场" : "上场";
        petGoButton.disabled = petID === activeID ;
        petImg.src = pet.dataURL;
        petGoButton.dataid = petID;
        petName.innerHTML = pet.name||"your pet";
        petsContainer.append(petbox);
    }
    
}
class petElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const template = document.getElementById("pet-tpl");
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
customElements.define("pet-box", petElement);

function changGoPet(e){
    if(e.path[0].id !== 'petBtn')
    return;
    let petsContainer = document.getElementById("petsContainer");
    let boxes = petsContainer.getElementsByTagName("pet-box");
    for(let box of boxes){
        box.shadowRoot.querySelector("#petBtn").innerHTML = "上场";
        box.shadowRoot.querySelector("#petBtn").disabled = false;
    }
    e.target.shadowRoot.querySelector("#petBtn").innerHTML = "已上场";
    e.target.shadowRoot.querySelector("#petBtn").disabled = true;
    localStorage.setItem("activeID",e.target.shadowRoot.querySelector("#petBtn").dataid);
}