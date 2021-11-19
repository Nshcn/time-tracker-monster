'use strict';

class UI {
    getTableOfSite() {
        return document.getElementById('statisticTable');
    }

    // 设置孵蛋页面
    setUIForHatch() {

    }

    clearUI() {
        document.getElementById('statisticTable').innerHTML = null;
    }

    fillEmptyBlock(elementName) {
        document.getElementById(elementName).innerHTML = '<p class="no-data">No data</p>';
    }

    addTableHeader(currentTypeOfList, counterOfSite, totalTime, totalDays) {
        function fillSummaryTime(totalTime){
            let arrayTime = getArrayTime(totalTime);
            let stringTime = '';
            if (arrayTime.days > 0) stringTime += arrayTime.days + ' days ';
            stringTime += arrayTime.hours + ' hours ';
            stringTime += arrayTime.mins + ' minutes ';
            return stringTime;
        }

        var p = document.createElement('p');
        p.classList.add('table-header');
        if (currentTypeOfList === TypeListEnum.ToDay)
            p.innerHTML = 'Today (' + counterOfSite + ' sites) <br> <strong>' + convertShortSummaryTimeToLongString(totalTime) + '</strong>';
        if (currentTypeOfList === TypeListEnum.All && totalDays !== undefined) {
            if (totalDays.countOfDays > 0) {
                p.innerHTML = '数据开始自 ' + new Date(totalDays.minDate).toLocaleDateString() + ' (' + totalDays.countOfDays + ' days) (' + counterOfSite + ' sites) <br> <strong>' + fillSummaryTime(totalTime)  + '</strong>';
            } else {
                p.innerHTML = '数据开始自 ' + new Date().toLocaleDateString() + ' (' + counterOfSite + ' sites) <br>  <strong>' + convertShortSummaryTimeToLongString(totalTime)  + '</strong>';
            }
        }

        this.getTableOfSite().appendChild(p);
    }

    addLineToTableOfSite(tab, currentTab, summaryTime, typeOfList, counter, blockName) {
        var div = document.createElement('div');
        div.addEventListener('mouseenter', function() {
            if (document.getElementById('chart-container').innerHTML !== '') {
                var item = document.getElementById(tab.url);
                if (item !== null) {
                    item.dispatchEvent(new Event('mouseenter'));
                    item.classList.add('mouse-over');
                }
            }
        });
        div.addEventListener('mouseout', function () {
            chrome.extension.getBackgroundPage().console.log('ddd')
            if (document.getElementById('chart-container').innerHTML !== '') {
                var item = document.getElementById(tab.url);
                if (item !== null) {
                    item.classList.remove('mouse-over');
                }
            }
        });
        div.classList.add('inline-flex');

        var divForImg = document.createElement('div');
        var img = document.createElement('img');
        img.setAttribute('height', 17);
        if (tab.favicon !== undefined || tab.favicon == null)
            img.setAttribute('src', tab.favicon);
        else img.setAttribute('src', '/icons/empty.png');
        divForImg.classList.add('block-img');
        divForImg.appendChild(img);

        var spanUrl = this.createElement('span', ['span-url'], tab.url);
        spanUrl.setAttribute('href', 'https://' + tab.url);

        if (tab.url == currentTab) {
            var divForImage = document.createElement('div');
            div.classList.add('span-active-url');
            var imgCurrentDomain = document.createElement('img');
            imgCurrentDomain.setAttribute('src', '/icons/eye.png');
            imgCurrentDomain.setAttribute('height', 17);
            imgCurrentDomain.classList.add('margin-left-5');
            divForImage.appendChild(imgCurrentDomain);
            var currentDomainTooltip = this.createElement('span', ['tooltiptext'], 'Current domain');
            divForImage.classList.add('tooltip', 'current-url');
            divForImage.appendChild(currentDomainTooltip);
            spanUrl.appendChild(divForImage);
        }

        if (typeOfList !== undefined && typeOfList === TypeListEnum.ToDay) {
            if (restrictionList !== undefined && restrictionList.length > 0) {
                var item = restrictionList.find(x => isDomainEquals(x.domain, tab.url));
                if (item !== undefined) {
                    var divLimit = this.createElement('div', ['tooltip', 'inline-block']);
                    var limitIcon = this.createElement('img', ['margin-left-5', 'tooltip']);
                    limitIcon.height = 15;
                    limitIcon.src = '/icons/limit.png';
                    var tooltip = this.createElement('span', ['tooltiptext'], "Daily limit is " + convertShortSummaryTimeToLongString(item.time));
                    divLimit = this.appendChild(divLimit, [limitIcon, tooltip]);
                    spanUrl.appendChild(divLimit);
                }
            }
        }

        var spanVisits = this.createElement('span', ['span-visits', 'tooltip', 'visits'], counter !== undefined ? counter : 0);
        var visitsTooltip = this.createElement('span', ['tooltiptext'], '访问次数');

        spanVisits.appendChild(visitsTooltip);
        var spanPercentage = this.createElement('span', ['span-percentage'], getPercentage(summaryTime));
        var spanTime = this.createElement('span', ['span-time']);
        this.createElementsForTotalTime(summaryTime, typeOfList, spanTime);

        div = this.appendChild(div, [divForImg, spanUrl, spanVisits, spanPercentage, spanTime]);
        if (blockName !== undefined)
            document.getElementById(blockName).appendChild(div);
        else
            this.getTableOfSite().appendChild(div);
    }

    createElementsForTotalTime(summaryTime, typeOfList, parentElement) {
        var arr = getArrayTime(summaryTime);
        var isNextPartActiv = false;
        var getCssClass = function(item) {
            if (item > 0) {
                isNextPartActiv = true;
                return ['span-active-time'];
            } else {
                if (isNextPartActiv)
                    return ['span-active-time'];
                return null;
            }
        };
        if (typeOfList === TypeListEnum.All) {
            var spanForDays = this.createElement('span', getCssClass(arr.days), arr.days + 'd ');
            this.appendChild(parentElement, [spanForDays]);
        }
        var spanForHour = this.createElement('span', getCssClass(arr.hours), arr.hours + 'h ');
        var spanForMin = this.createElement('span', getCssClass(arr.mins), arr.mins + 'm ');
        var spanForSec = this.createElement('span', getCssClass(arr.seconds), arr.seconds + 's ');
        this.appendChild(parentElement, [spanForHour, spanForMin, spanForSec]);
    }

    addExpander() {
        if (document.getElementById('expander') === null) {
            var div = this.createElement('div', ['expander'], 'Show all');
            div.id = 'expander';
            div.addEventListener('click', function() {
                ui.expand();
            });
            this.getTableOfSite().appendChild(div);
        }
    }

    expand() {
        getTabsForExpander();
        this.getTableOfSite().removeChild(document.getElementById('expander'));
    }

    createElement(type, css, innerText) {
        var element = document.createElement(type);
        if (css !== undefined && css !== null) {
            for (let i = 0; i < css.length; i++)
                element.classList.add(css[i]);
        }
        if (innerText !== undefined)
            element.innerHTML = innerText;

        return element;
    }

    appendChild(element, children) {
        for (let i = 0; i < children.length; i++)
            element.appendChild(children[i]);

        return element;
    }

    setPreloader() {
        document.getElementById('preloader').classList.add('preloader');
    }

    setMode(){
        if (setting_dark_mode)
            document.body.classList.add('night-mode');
    }

    removePreloader() {
        document.getElementById('preloader').classList.remove('preloader');
        document.getElementById('preloader').classList.add('hide');
    }

    pageArr = ['pageStatistics', 'pageHatch', 'pageBattle', 'pageSettings'];
    //显示页面
    showPage(pageType) {
        toggleActive(this.pageArr, `page${pageType}`, 'active');
    }
    showTodayStatistic() {
        currentTypeOfList = TypeListEnum.ToDay;
        let data = [];
        tabsFromBackground.forEach(item=>{
            var day = item.days.find(x => x.date == todayLocalDate());
            if (day !== undefined) {
                data.push({
                    name: item.url,
                    value:day.summary
                })
            }
        })
        this.clearUI();
        this.drawRingChart(data);
        this.showTable();
    }
    showTable() {
        let counterOfSite;
        let targetTabs = tabsFromBackground.sort(function (a, b) {
            return b.summaryTime - a.summaryTime;
        });
        if (currentTypeOfList === TypeListEnum.All) {
            counterOfSite = targetTabs.length;
            ui.addTableHeader(currentTypeOfList, counterOfSite, totalTime, getFirstDay());
            totalTime = getTotalTime(targetTabs);
        }
        
        if (currentTypeOfList === TypeListEnum.ToDay) {
            targetTabs = tabsFromBackground.filter(x => x.days.find(s => s.date === todayLocalDate()));
            targetTabs = targetTabs.sort(function (a, b) {
                return b.days.find(s => s.date === todayLocalDate()).summary - a.days.find(s => s.date === todayLocalDate()).summary;
            });
            counterOfSite = targetTabs.length;
            totalTime = getTotalTime(targetTabs);
            ui.addTableHeader(currentTypeOfList, counterOfSite, totalTime);
        }

        var currentTab = getCurrentTab();
        var tabsForChart = [];
        var summaryCounter = 0;
        for (var i = 0; i < targetTabs.length; i++) {
            var summaryTime;
            var counter;
            if (currentTypeOfList === TypeListEnum.ToDay) {
                summaryTime = targetTabs[i].days.find(x => x.date == todayLocalDate()).summary;
                let item = targetTabs[i].days.find(x => x.date == todayLocalDate());
                if (item != null) {
                    counter = item.counter;
                }
            }
            if (currentTypeOfList === TypeListEnum.All) {
                summaryTime = targetTabs[i].summaryTime;
                counter = targetTabs[i].counter;
            }
    
            summaryCounter += counter;
            if (currentTypeOfList === TypeListEnum.ToDay || (currentTypeOfList === TypeListEnum.All && i <= 30)) {
                ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime, currentTypeOfList, counter);
            }
            else {
                ui.addExpander();
            }
    
            if (i <= 8) {
                addTabForChart(tabsForChart, targetTabs[i].url, summaryTime, counter);
            } 
                
        }
    }
    showAllStatistic() {
        let data = tabsFromBackground.map(item => {
            return {
                name: item.url,
                value: item.summaryTime,
            }
        });
        this.clearUI();
        this.drawRingChart(data);
        this.showTable();
    }
    drawRingChart(data) {
        var chartDom = document.getElementById('chart-container');
        var myChart = echarts.init(chartDom);
        var option;
        let targetTabs = [];
        if (currentTypeOfList == TypeListEnum.ToDay) {
            targetTabs = tabsFromBackground.filter(x => x.days.find(s => s.date === todayLocalDate()));
        } else {
            targetTabs = tabsFromBackground;
        }
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                show: targetTabs.length<8,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                itemGap: 2,
            },
            series: [
                {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                    data
                }
            ]
        };
        option && myChart.setOption(option);
    }
}