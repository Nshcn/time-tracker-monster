'use strict';

var tabsFromBackground;// 弹窗页面加载时获取tabs数据
var storage = new LocalStorage();
var ui = new UI();
var totalTime, averageTime;
var tabsFromStorage;
var targetTabs;
var currentTypeOfList;
var setting_range_days;
var setting_dark_mode;
var restrictionList;


document.addEventListener('DOMContentLoaded', function () {
    // ui.setPreloader();

    storage.getValue(SETTINGS_INTERVAL_RANGE, function (item) { setting_range_days = item; });
    document.getElementById('btnHatch').addEventListener('click', function () {
        ui.setUIForHatch();
    });

    //导航栏按钮
    document.getElementById('btnStatistics').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ToDay;
        ui.showStatisticsPage();
    });
    document.getElementById('btnHatch').addEventListener('click', function () {
        ui.showHatchPage();
    });
    document.getElementById('btnBattle').addEventListener('click', function () {
        ui.showBattlePage();
    });
    document.getElementById('btnSettings').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    // 数据统计页相关的nav
    document.getElementById('btnTodayStatistics').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ToDay;
        ui.showTodayStatistic()
    });
    document.getElementById('btnAllStatistics').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.All;
        ui.showAllStatistic()
    });
});

firstInitPage();

function firstInitPage() {
    chrome.runtime.getBackgroundPage(function (bg) {
        setting_dark_mode = bg.setting_dark_mode;
        ui.setMode();

        tabsFromBackground = bg.tabs;
        currentTypeOfList = TypeListEnum.ToDay;
    });
}

window.addEventListener('click', function (e) {
    if (e.target.nodeName == 'SPAN' && e.target.className == 'span-url' && e.target.attributes.href.value != undefined){
        chrome.tabs.create({ url: e.target.attributes.href.value })
    }
});


function fillEmptyBlock() {
    ui.removePreloader();
    ui.fillEmptyBlock('chart');
}

function getTimeIntervalList() {
    storage.getValue(STORAGE_TIMEINTERVAL_LIST, drawTimeChart);
}

function getTotalTime(tabs) {
    var total;
    if (currentTypeOfList === TypeListEnum.ToDay) {
        var summaryTimeList = tabs.map(function (a) { return a.days.find(s => s.date === todayLocalDate()).summary; });
        total = summaryTimeList.reduce(function (a, b) { return a + b; })
    }
    if (currentTypeOfList === TypeListEnum.All) {
        var summaryTimeList = tabs.map(function (a) { return a.summaryTime; });
        total = summaryTimeList.reduce(function (a, b) { return a + b; })
    }
    return total;
}

function getTotalTimeForDay(day, tabs) {
    var total;
    var summaryTimeList = tabs.map(function (a) { return a.days.find(s => s.date === day).summary; });
    total = summaryTimeList.reduce(function (a, b) { return a + b; })
    return total;
}

function getPercentage(time) {
    return ((time / totalTime) * 100).toFixed(2) + ' %';
}

function getPercentageForChart(time) {
    return ((time / totalTime) * 100).toFixed(2) / 100;
}

function getCurrentTab() {
    return chrome.extension.getBackgroundPage().currentTab;
}

function addTabForChart(tabsForChart, url, time, counter) {
    tabsForChart.push({
        'url': url,
        'percentage': getPercentageForChart(time),
        'summary': time,
        'visits': counter
    });
}

function getFirstDay() {
    var array = [];
    tabsFromBackground.map(function (a) {
        return a.days.map(function (a) {
            if (array.indexOf(a.date) === -1)
                return array.push(a.date);
        });
    });

    array = array.sort(function (a, b) {
        return new Date(a) - new Date(b);
    });

    return {
        'countOfDays': array.length,
        'minDate': array[0]
    };
}



function getTabsFromStorageByDay(day, blockName) {
    targetTabs = [];

    if (tabsFromStorage === null) {
        ui.fillEmptyBlock(blockName);
        return;
    }

    targetTabs = tabsFromStorage.filter(x => x.days.find(s => s.date === day));
    if (targetTabs.length > 0) {
        targetTabs = targetTabs.sort(function (a, b) {
            return b.days.find(s => s.date === day).summary - a.days.find(s => s.date === day).summary;
        });

        totalTime = getTotalTimeForDay(day, targetTabs);
    } else {
        ui.fillEmptyBlock(blockName);
        return;
    }

    var currentTab = getCurrentTab();

    var content = document.createElement('div');
    content.classList.add('content-inner');
    content.id = blockName + '_content';
    document.getElementById(blockName).appendChild(content);
    for (var i = 0; i < targetTabs.length; i++) {
        var summaryTime, counter;
        summaryTime = targetTabs[i].days.find(x => x.date == day).summary;
        counter = targetTabs[i].days.find(x => x.date == day).counter;

        ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime, TypeListEnum.ByDays, counter, blockName + '_content');
    }
}

function fillBlockWithInActiveDay() {
    var flag = document.getElementById('statInActiveDayIcon').dataset.today;
    if (flag == 'true')
        fillValuesForBlockWithInActiveDay("statInActiveDay", stat.inActiveDayWithoutCurrentDay, stat.inActiveDayTimeWithoutCurrentDay, flag);
    else
        fillValuesForBlockWithInActiveDay("statInActiveDay", stat.inActiveDay, stat.inActiveDayTime, flag);
}

function fillBlockWithActiveDay() {
    var flag = document.getElementById('statActiveDayIcon').dataset.today;
    if (flag == 'true')
        fillValuesForBlockWithInActiveDay("statActiveDay", stat.activeDayWithoutCurrentDay, stat.activeDayTimeWithoutCurrentDay, flag);
    else
        fillValuesForBlockWithInActiveDay("statActiveDay", stat.activeDay, stat.activeDayTime, flag);
}

function fillValuesForBlockWithInActiveDay(prefix, dayValue, timeValue, flag) {
    if (flag == 'true') {
        document.getElementById(prefix).classList.add('hide');
        document.getElementById(prefix + 'Time').classList.add('hide');
        document.getElementById(prefix + 'WithoutCurrentDay').classList.remove('hide');
        document.getElementById(prefix + 'TimeWithoutCurrentDay').classList.remove('hide');

        document.getElementById(prefix + 'Title').innerHTML = 'Include the current day in the calculation of statistics';
        document.getElementById(prefix + 'Icon').dataset.today = false;
        document.getElementById(prefix + 'Icon').src = "/icons/no-today.svg";

        document.getElementById(prefix + 'WithoutCurrentDay').value = dayValue;
        document.getElementById(prefix + 'TimeWithoutCurrentDay').value = timeValue;
    }
    else {
        document.getElementById(prefix).classList.remove('hide');
        document.getElementById(prefix + 'Time').classList.remove('hide');
        document.getElementById(prefix + 'WithoutCurrentDay').classList.add('hide');
        document.getElementById(prefix + 'TimeWithoutCurrentDay').classList.add('hide');

        document.getElementById(prefix + 'Title').innerHTML = "Don't Include the current day in the calculation of statistics";
        document.getElementById(prefix + 'Icon').dataset.today = true;
        document.getElementById(prefix + 'Icon').src = "/icons/today.svg";

        document.getElementById(prefix).value = dayValue;
        document.getElementById(prefix + 'Time').value = timeValue;
    }
}