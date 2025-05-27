// ==UserScript==
// @name         时光序
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  时光序优化
// @author       levonfly
// @match        https://web.shiguangxu.com/*
// @match        https://shiguangxu.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏主菜单
    const menuItemsToHide = ['备忘录', '日记', '番茄专注'];
    function hideMenuItems() {
        const menuItems = document.querySelectorAll('.ant-menu-submenu');
        menuItems.forEach(item => {

            const titleElement = item.querySelector('.sideBar_subMenuTitle__5ECMl');
            if (titleElement && menuItemsToHide.includes(titleElement.textContent.trim())) {
                item.style.display = 'none';
            }
        });
    }
    // 等待页面加载完成后执行
    function waitForMenu() {
        const checkInterval = setInterval(() => {
            const menu = document.querySelector('.ant-menu');
            if (menu) {
                clearInterval(checkInterval);
                hideMenuItems();

                // 监听DOM变化，以防菜单动态加载
                const observer = new MutationObserver(() => {
                    hideMenuItems();
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 100);

        // 10秒后停止检查
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 10000);
    }
    waitForMenu();



    // 隐藏的子菜单文本
    const subMenuItemsToHide = ['全部', '日程', '重复'];
    function customizeMatterMenu() {
        const matterSubMenu = document.querySelector('#matter\\$Menu');
        if (!matterSubMenu) return;
        const menuItems = matterSubMenu.querySelectorAll('.ant-menu-item');
        menuItems.forEach(item => {
            const titleElement = item.querySelector('.sideBar_subMenuTitle__5ECMl');
            if (titleElement) {
                const menuText = titleElement.textContent.trim();
                if (subMenuItemsToHide.includes(menuText)) {
                    item.style.display = 'none';
                }
                // 将"清单"改为"未分配时间"
                if (menuText === '清单') {
                    titleElement.textContent = '未分配时间';
                }
            }
        });

        // 隐藏分割线（如果需要）
        const dividers = matterSubMenu.querySelectorAll('.sideBar_divider__MP1mm');
        dividers.forEach(divider => {
            // 检查分割线前面是否有可见的菜单项
            const prevSibling = divider.previousElementSibling;
            if (prevSibling && prevSibling.style.display === 'none') {
                divider.style.display = 'none';
            }
        });
    }

    // 等待页面加载并处理菜单
    function waitAndProcess() {
        let attempts = 0;
        const maxAttempts = 100; // 最多尝试10秒

        const checkInterval = setInterval(() => {
            attempts++;

            // 查找事项菜单
            const matterMenu = document.querySelector('#matter\\$Menu');
            if (matterMenu) {
                customizeMatterMenu();

                // 设置MutationObserver监听DOM变化
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            customizeMatterMenu();
                        }
                    });
                });

                // 监听整个菜单容器
                const menuContainer = document.querySelector('.ant-menu');
                if (menuContainer) {
                    observer.observe(menuContainer, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['style', 'class']
                    });
                }

                clearInterval(checkInterval);
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
            }
        }, 100);
    }

    // 开始执行
    waitAndProcess();

    // 额外的保险：页面加载完成后再执行一次
    window.addEventListener('load', () => {
        setTimeout(customizeMatterMenu, 1000);
    });
})();
