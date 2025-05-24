// ==UserScript==
// @name         语雀
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  语雀优化
// @author       You
// @match        https://*.yuque.com/*
// @match        https://yuque.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';


    function removeNotesMenu() {
        const menuTitles = ['小记', '逛逛', 'AI 写作'];
        menuTitles.forEach(title => {
            // 查找所有匹配标题的菜单项
            const menuItems = document.querySelectorAll(`li.ant-menu-item[title="${title}"]`);

            menuItems.forEach(item => {
                item.remove();
                console.log(`已删除${title}菜单项`);
            });
        });
    }

    // 自动点击编辑按钮
    function autoClickEditButton() {
        const buttons = document.querySelectorAll('button.ant-btn.ant-btn-primary.larkui-tooltip');
        buttons.forEach(button => {
            // 检查按钮内的文本是否为"编辑"
            const spanElement = button.querySelector('span');
            if (spanElement && spanElement.textContent.trim() === '编辑') {
                // 点击按钮
                button.click();
                console.log('已自动点击编辑按钮');
            }
        });
    }




    // 初始执行
    removeNotesMenu();
    autoClickEditButton();

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeNotesMenu();
                autoClickEditButton();
            }
        });
    });
    const config = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, config);
    /*
    setInterval(() => {
        removeNotesMenu();
        autoClickEditButton();
    }, 2000);
    */
})();
