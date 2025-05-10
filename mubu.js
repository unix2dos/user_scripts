// ==UserScript==
// @name         幕布网站英仓移除工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除幕布网站(mubu.com)上的英仓元素
// @author       You
// @match        https://mubu.com/app*
// @match        https://*.mubu.com/app*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // 移除特定元素
    function removeEnglishWarehouse() {
        const elements = document.querySelectorAll('.sc-jHcYrh.sc-bQCGiA.hanhiD.bEthKq');
        if (elements.length > 0) {
            console.log('找到 mubu 元素，数量:', elements.length);
            elements.forEach(element => {
                element.remove();
                console.log('已移除 mubu 元素');
            });
        }
    }
    removeEnglishWarehouse();
    setInterval(removeEnglishWarehouse, 2000);



    // 点击元素
    function clickAllDivsInRowgroup() {
        const rowgroups = document.querySelectorAll('div[role="rowgroup"]');
        if (rowgroups.length > 0) {
            console.log('找到rowgroup元素，数量:', rowgroups.length);
            rowgroups.forEach(rowgroup => {
                const divs = rowgroup.querySelectorAll('div');
                console.log(`找到${divs.length}个div子元素`);
                divs.forEach((div, index) => {
                    try {
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        div.dispatchEvent(clickEvent);
                        console.log(`已点击第${index + 1}个div子元素`);
                    } catch (error) {
                        console.error(`点击第${index + 1}个div时出错:`, error);
                    }
                });
            });
        } else {
            console.log('未找到role="rowgroup"的div元素');
        }
    }

    // 等待页面完全加载后执行
    window.addEventListener('load', function () {
        // 给页面一些时间完全渲染
        setTimeout(clickAllDivsInRowgroup, 3000);
    });

    // 添加一个按钮，允许用户手动触发点击操作
    const button = document.createElement('button');
    button.textContent = '点击所有Rowgroup中的Div';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.addEventListener('click', clickAllDivsInRowgroup);
    document.body.appendChild(button);




    console.log('幕布英仓移除脚本已加载');
})();
