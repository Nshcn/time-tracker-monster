'use strict';
var tabs;
var timeIntervalList;

var currentTab;
var isNeedDeleteTimeIntervalFromTabs = false;
var activity = new Activity();
var storage = new LocalStorage();
var deferredRestrictionsList;

var setting_black_list;
var setting_restriction_list;
var setting_interval_save;
var setting_interval_inactivity;
var setting_view_in_badge;
var setting_block_deferral;
var setting_dark_mode;
var setting_notification_list;
var setting_notification_message;

var isHasPermissioForNotification;

var coin=10;
var good_list=['element.eleme.cn'];
var bad_list=['www.yuque.com' ];

function updateSummaryTime() {
    setInterval(backgroundCheck, SETTINGS_INTERVAL_CHECK_DEFAULT);
}

function updateStorage() {
    setInterval(backgroundUpdateStorage, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
}

function backgroundCheck() {
    chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
        if (currentWindow.focused) {
            var activeTab = currentWindow.tabs.find(t => t.active === true);
            if (activeTab !== undefined && activity.isValidPage(activeTab)) {
                var activeUrl = extractHostname(activeTab.url);
                var tab = activity.getTab(activeUrl);
                if (tab === undefined) {
                    activity.addTab(activeTab);
                }
                if (activity.isInGoodList(activeUrl)) {
                    storage.getValue('coin', function (item) {
                        coin=item+1;
                    });
                    chrome.extension.getBackgroundPage().console.log('好网站，coin+1',coin);
                }else if(activity.isInBadList(activeUrl)) {
                    storage.getValue('coin', function (item) {
                        if (item > 0) {
                            coin=item-1;
                        } else {
                            chrome.extension.getBackgroundPage().console.log('你一个硬币都没有了！！！');
                        }
                    });
                    chrome.extension.getBackgroundPage().console.log('坏网站，coin-1',coin);
                }

                if (activity.isInBlackList(activeUrl)) {
                    chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
                    chrome.browserAction.setBadgeText({
                        tabId: activeTab.id,
                        text: 'n/a'
                    });
                } else {
                    if (tab !== undefined) {
                        if (currentTab !== tab.url) {
                            activity.setCurrentActiveTab(tab.url);
                        }
                        chrome.idle.queryState(parseInt(setting_interval_inactivity), function(state) {
                            if (state === 'active') {
                                mainTRacker(activeUrl, tab, activeTab);
                            } else checkDOM(state, activeUrl, tab, activeTab);
                        });
                    }
                }
            }
        } else activity.closeIntervalForCurrentTab();
    });
}

function mainTRacker(activeUrl, tab, activeTab) {
    if (!activity.isInBlackList(activeUrl)) {
        tab.incSummaryTime();
    }
    if (setting_view_in_badge === true) {
        chrome.browserAction.setBadgeBackgroundColor({ color: '#1aa1434d' })
        var summary = tab.days.find(s => s.date === todayLocalDate()).summary;
        chrome.browserAction.setBadgeText({
            tabId: activeTab.id,
            text: String(convertSummaryTimeToBadgeString(summary))
        });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] })
        chrome.browserAction.setBadgeText({
            tabId: activeTab.id,
            text: ''
        });
    }
}


function checkDOM(state, activeUrl, tab, activeTab) {
        activity.closeIntervalForCurrentTab();
}

function backgroundUpdateStorage() {
    if (tabs != undefined && tabs.length > 0)
        storage.saveTabs(tabs);
    if (timeIntervalList != undefined && timeIntervalList.length > 0) {
        storage.saveValue(STORAGE_TIMEINTERVAL_LIST, timeIntervalList);
    }
    storage.saveValue('coin', coin);
    localStorage.setItem('coin',coin)
}

function setDefaultSettings() {
    storage.saveValue(SETTINGS_INTERVAL_INACTIVITY, SETTINGS_INTERVAL_INACTIVITY_DEFAULT);
    storage.saveValue(SETTINGS_INTERVAL_RANGE, SETTINGS_INTERVAL_RANGE_DEFAULT);
    storage.saveValue(SETTINGS_VIEW_TIME_IN_BADGE, SETTINGS_VIEW_TIME_IN_BADGE_DEFAULT);
    storage.saveValue(SETTINGS_BLOCK_DEFERRAL, SETTINGS_BLOCK_DEFERRAL_DEFAULT);
    storage.saveValue(SETTINGS_DARK_MODE, SETTINGS_DARK_MODE_DEFAULT);
    storage.saveValue(SETTINGS_INTERVAL_SAVE_STORAGE, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
    storage.saveValue(STORAGE_NOTIFICATION_MESSAGE, STORAGE_NOTIFICATION_MESSAGE_DEFAULT);
    storage.saveValue('coin', 10);
    storage.saveValue('good_list', good_list);
    storage.saveValue('bad_list', []);
}

function checkSettingsImEmpty() {
    chrome.storage.local.getBytesInUse(['inactivity_interval'], function(item) {
        if (item == 0) {
            setDefaultSettings();
        }
    });
}

function setDefaultValueForNewSettings() {
    loadNotificationMessage();
}

function addListener() {
    chrome.tabs.onActivated.addListener(function(info) {
        chrome.tabs.get(info.tabId, function(tab) {
            activity.addTab(tab);
        });
    });

    chrome.webNavigation.onCompleted.addListener(function(details) {
        chrome.tabs.get(details.tabId, function(tab) {
            activity.updateFavicon(tab);
        });
    });
    chrome.runtime.onInstalled.addListener(function(details) {
        if (details.reason == 'install') {
            storage.saveValue(SETTINGS_SHOW_HINT, SETTINGS_SHOW_HINT_DEFAULT);
            setDefaultSettings();
        }
        if (details.reason == 'update') {
            storage.saveValue(SETTINGS_SHOW_HINT, SETTINGS_SHOW_HINT_DEFAULT);
            checkSettingsImEmpty();
            setDefaultValueForNewSettings();
            isNeedDeleteTimeIntervalFromTabs = true;
        }
    });
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            if (key === STORAGE_BLACK_LIST) {
                loadBlackList();
            }
            if (key === 'good_list') {
                loadGoodList();
            }
            if (key === 'bad_list') {
                loadBadList();
            }
            if (key === STORAGE_RESTRICTION_LIST) {
                loadRestrictionList();
            }
            if (key === STORAGE_NOTIFICATION_LIST) {
                loadNotificationList();
            }
            if (key === STORAGE_NOTIFICATION_MESSAGE) {
                loadNotificationMessage();
            }
            if (key === SETTINGS_INTERVAL_INACTIVITY) {
                storage.getValue(SETTINGS_INTERVAL_INACTIVITY, function(item) { setting_interval_inactivity = item; });
            }
            if (key === SETTINGS_VIEW_TIME_IN_BADGE) {
                storage.getValue(SETTINGS_VIEW_TIME_IN_BADGE, function(item) { setting_view_in_badge = item; });
            }
            if (key === SETTINGS_BLOCK_DEFERRAL) {
                storage.getValue(SETTINGS_BLOCK_DEFERRAL, function(item) { setting_block_deferral = item; });
            }
            if (key === SETTINGS_DARK_MODE) {
                storage.getValue(SETTINGS_DARK_MODE, function(item) { setting_dark_mode = item; });
            }
        }
    });

    chrome.runtime.setUninstallURL("https://www.baidu.com/");
}

function loadTabs() {
    storage.loadTabs(STORAGE_TABS, function(items) {
        tabs = [];
        if (items != undefined) {
            for (var i = 0; i < items.length; i++) {
                tabs.push(new Tab(items[i].url, items[i].favicon, items[i].days, items[i].summaryTime, items[i].counter));
            }
            if (isNeedDeleteTimeIntervalFromTabs)
                deleteTimeIntervalFromTabs();
        }
    });
}

// 获取硬币数量
function loadCoin() {
    storage.getValue('coin', function (items) {
        if (items != undefined) {
            coin = items;
        } else {
            coin = 10;
        }
    })
}

function deleteTimeIntervalFromTabs() {
    tabs.forEach(function(item) {
        item.days.forEach(function(day) {
            if (day.time != undefined)
                day.time = [];
        })
    })
}

function deleteYesterdayTimeInterval() {
    timeIntervalList = timeIntervalList.filter(x => x.day == todayLocalDate());
}

function loadBlackList() {
    storage.getValue(STORAGE_BLACK_LIST, function(items) {
        setting_black_list = items;
    })
}
function loadGoodList() {
    storage.getValue('good_list', function(items) {
        good_list = items;
    })
}
function loadBadList() {
    storage.getValue('bad_list', function(items) {
        bad_list = items;
    })
}

function loadTimeIntervals() {
    storage.getValue(STORAGE_TIMEINTERVAL_LIST, function(items) {
        timeIntervalList = [];
        if (items != undefined) {
            for (var i = 0; i < items.length; i++) {
                timeIntervalList.push(new TimeInterval(items[i].day, items[i].domain, items[i].intervals));
            }
            deleteYesterdayTimeInterval();
        }
    });
}

function loadRestrictionList() {
    storage.getValue(STORAGE_RESTRICTION_LIST, function(items) {
        setting_restriction_list = items;
    })
}

function loadNotificationList() {
    storage.getValue(STORAGE_NOTIFICATION_LIST, function(items) {
        setting_notification_list = items;
    });
}

function loadNotificationMessage() {
    storage.getValue(STORAGE_NOTIFICATION_MESSAGE, function(item) {
        setting_notification_message = item;
        if (isEmpty(setting_notification_message)) {
            storage.saveValue(STORAGE_NOTIFICATION_MESSAGE, STORAGE_NOTIFICATION_MESSAGE_DEFAULT);
            setting_notification_message = STORAGE_NOTIFICATION_MESSAGE_DEFAULT;
        }
    });
}

function loadSettings() {
    storage.getValue(SETTINGS_INTERVAL_INACTIVITY, function(item) { setting_interval_inactivity = item; });
    storage.getValue(SETTINGS_VIEW_TIME_IN_BADGE, function(item) { setting_view_in_badge = item; });
    storage.getValue(SETTINGS_BLOCK_DEFERRAL, function(item) { setting_block_deferral = item; });
    storage.getValue(SETTINGS_DARK_MODE, function (item) { setting_dark_mode = item; });
}

function loadAddDataFromStorage() {
    loadTabs();
    loadTimeIntervals();
    loadBlackList();
    loadGoodList();
    loadBadList();
    loadCoin();
    loadRestrictionList();
    loadNotificationList();
    loadNotificationMessage();
    loadSettings();
}

addListener();
loadAddDataFromStorage();
updateSummaryTime();
updateStorage();