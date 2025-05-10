// ==UserScript==
// @name         幕布网站增强工具
// @namespace    http://tampermonkey.net/
// @version      20250510
// @description  幕布增强
// @author       levonfly
// @match        https://mubu.com/app*
// @match        https://*.mubu.com/app*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // 监听页面
    const observer = new MutationObserver(function (mutations) {
        removeEnglishWarehouse();
        if (!document.getElementById('expand-node-button')) {
            addExpandButton();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 优化元素
    function removeEnglishWarehouse() {
        const sidebarList = document.getElementById('sidebar-list');
        const divChildren = sidebarList.querySelectorAll(':scope > div');
        const targetDivs = Array.from(divChildren).filter(div => {
            return div.textContent.includes('模板中心') || div.textContent.includes('导入') || div.textContent.includes('与我协作') || div.textContent.includes('幕布精选') || div.textContent.includes('回收站');
        });
        if (targetDivs.length > 0) {
            console.log('找到 mubu 元素，数量:', targetDivs.length);
            targetDivs.forEach(element => {
                element.remove();
                console.log('已移除 mubu 元素');
            });
        }
        const tree = document.getElementById('js-documents-tree-scroll-view');
        tree.style.height = '100%';
    }
    removeEnglishWarehouse();
    setInterval(removeEnglishWarehouse, 2000);

    // 添加按钮
    function addExpandButton() {
        if (document.getElementById('expand-node-button')) {
            return;
        }
        const button = document.createElement('button');
        button.id = 'expand-node-button';
        button.textContent = '展开一级节点';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 8px 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        button.onmouseover = function () {
            this.style.backgroundColor = '#45a049';
        };
        button.onmouseout = function () {
            this.style.backgroundColor = '#4CAF50';
        };
        button.addEventListener('click', function () {
            clickAllDivsInRowgroup();
        });
        document.body.appendChild(button);
    }

    // 点击元素
    function clickAllDivsInRowgroup() {
        const rowgroups = document.querySelectorAll('#sidebar-list div[role="rowgroup"]');
        if (rowgroups.length > 0) {
            console.log('找到rowgroup元素，数量:', rowgroups.length);
            rowgroups.forEach(rowgroup => {
                const divs = rowgroup.querySelectorAll('div');
                /*
                const targetDivs = Array.from(divs).filter(div => {
                    console.log("div title", div.title)
                    const childDivs = div.querySelectorAll(':scope > div[data-cancombine="true"]');
                    return childDivs.length > 0; // 如果有符合条件的子div，则保留该div
                });
                console.log('找到 targetDivs 元素，数量:',divs.length, targetDivs.length);
                */
                divs.forEach((div, index) => {
                    try {
                        // 创建并触发点击事件
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

    console.log('幕布脚本已加载');
})();