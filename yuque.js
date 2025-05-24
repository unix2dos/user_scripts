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

    // 移除无用元素
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


    function addHoverClassToHeadings() {
        const engineBoxes = document.querySelectorAll('.ne-engine-box');
        engineBoxes.forEach(engineBox => {
            // 查找所有以 ne-h 开头的标题元素（ne-h1, ne-h2, ne-h3, ne-h4, ne-h5, ne-h6）
            const headings = engineBox.querySelectorAll('ne-h1, ne-h2, ne-h3, ne-h4, ne-h5, ne-h6');
            headings.forEach(heading => {
                // 直接添加 hovered class
                if (!heading.classList.contains('hovered')) {
                    heading.classList.add('hovered');
                }

                // 监听 class 变化，如果 hovered 被移除就立即加回来
                if (!heading.hasAttribute('data-force-hover')) { // 避免重复添加监听器
                    const observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                if (!heading.classList.contains('hovered')) {
                                    heading.classList.add('hovered');
                                }
                            }
                        });
                    });
                    observer.observe(heading, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                    heading.setAttribute('data-force-hover', 'true');
                }

            });
        });
    }




    // 初始执行
    removeNotesMenu();
    autoClickEditButton();
    addHoverClassToHeadings();

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeNotesMenu();
                autoClickEditButton();
                addHoverClassToHeadings();
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
        addHoverClassToHeadings();
    }, 2000);
    */
})();
