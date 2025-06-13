// ==UserScript==
// @name         AutoDL页面优化
// @namespace    http://tampermonkey.net/
// @version      2025-06-13
// @description  自动为AutoDL部署列表页面添加page_size参数，并隐藏包含"测试"和"-dev"的表格行
// @author       You
// @match        https://www.autodl.com/deploy/list*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // URL参数处理
    function handleUrlParams() {
        const currentUrl = new URL(window.location.href);

        if (!currentUrl.searchParams.has('page_size')) {
            currentUrl.searchParams.set('page_size', '300');
            window.location.replace(currentUrl.toString());
            return false; // 表示需要重定向
        }
        return true; // 表示不需要重定向，继续执行
    }

    // 隐藏测试行
    function hideTestRows() {
        const tables = document.querySelectorAll('table.el-table__body');
        let hiddenCount = 0;

        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent;
                if (text && (text.includes('测试') || text.includes('-dev'))) {
                    if (row.style.display !== 'none') {
                        row.style.display = 'none';
                        hiddenCount++;
                    }
                }
            });
        });

        if (hiddenCount > 0) {
            console.log(`AutoDL优化脚本: 隐藏了 ${hiddenCount} 行测试数据`);
        }
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 初始化脚本
    function initializeScript() {
        // 处理URL参数
        if (!handleUrlParams()) {
            return; // 如果需要重定向，则停止执行
        }

        // 防抖的隐藏函数
        const debouncedHideRows = debounce(hideTestRows, 200);

        // 立即执行一次
        hideTestRows();

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是表格相关的节点
                            if (node.matches?.('table.el-table__body, tr, tbody') ||
                                node.querySelector?.('table.el-table__body, tr')) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldCheck) break;
            }

            if (shouldCheck) {
                debouncedHideRows();
            }
        });

        // 开始观察DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('AutoDL页面优化脚本已启动');
    }

    // 等待DOM准备就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        // 如果DOM已经加载完成，延迟一点执行以确保页面完全渲染
        setTimeout(initializeScript, 100);
    }

})();
