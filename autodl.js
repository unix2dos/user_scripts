// ==UserScript==
// @name         AutoDL页面优化
// @namespace    http://tampermonkey.net/
// @version      2025-06-13
// @description  自动为AutoDL部署列表页面添加page_size参数，隐藏包含"测试"和"-dev"的表格行，并按实时费用排序
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

    // 提取费用数值
    function extractPrice(text) {
        if (!text) return 0;
        // 匹配 ￥ 数字.数字/时 的格式
        const match = text.match(/￥\s*(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    // 查找费用列的索引
    function findPriceColumnIndex(table) {
        const headerRow = table.closest('.el-table').querySelector('.el-table__header-wrapper th');
        if (!headerRow) return -1;

        const headers = table.closest('.el-table').querySelectorAll('.el-table__header-wrapper th');
        for (let i = 0; i < headers.length; i++) {
            const headerText = headers[i].textContent.trim();
            if (headerText.includes('费用') || headerText.includes('价格') || headerText.includes('实时')) {
                return i;
            }
        }
        return -1;
    }

    // 按费用排序表格行
    function sortRowsByPrice() {
        const tables = document.querySelectorAll('table.el-table__body');

        tables.forEach(table => {
            const tbody = table.querySelector('tbody') || table;
            const rows = Array.from(tbody.querySelectorAll('tr'));

            if (rows.length === 0) return;

            // 查找费用列的索引
            const priceColumnIndex = findPriceColumnIndex(table);

            // 如果找不到费用列，尝试通过内容查找
            let actualPriceColumnIndex = priceColumnIndex;
            if (priceColumnIndex === -1) {
                // 检查第一行的每一列，找到包含￥符号的列
                const firstRow = rows[0];
                const cells = firstRow.querySelectorAll('td');
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].textContent.includes('￥')) {
                        actualPriceColumnIndex = i;
                        break;
                    }
                }
            }

            if (actualPriceColumnIndex === -1) {
                console.log('AutoDL优化脚本: 未找到费用列');
                return;
            }

            // 过滤出可见的行并提取费用信息
            const rowsWithPrice = rows
                .filter(row => row.style.display !== 'none')
                .map(row => {
                    const cells = row.querySelectorAll('td');
                    const priceCell = cells[actualPriceColumnIndex];
                    const priceText = priceCell ? priceCell.textContent : '';
                    const price = extractPrice(priceText);
                    return { row, price, priceText };
                })
                .filter(item => item.price > 0); // 只保留有有效价格的行

            // 按价格降序排序（费用高的在前）
            rowsWithPrice.sort((a, b) => b.price - a.price);

            // 重新排列DOM中的行
            const fragment = document.createDocumentFragment();
            rowsWithPrice.forEach(item => {
                fragment.appendChild(item.row);
            });

            // 添加没有价格信息的行到最后
            rows.forEach(row => {
                if (!rowsWithPrice.find(item => item.row === row) && row.style.display !== 'none') {
                    fragment.appendChild(row);
                }
            });

            tbody.appendChild(fragment);

            if (rowsWithPrice.length > 0) {
                console.log(`AutoDL优化脚本: 已按费用排序 ${rowsWithPrice.length} 行数据`);
                console.log(`费用范围: ￥${rowsWithPrice[rowsWithPrice.length-1].price}/时 - ￥${rowsWithPrice[0].price}/时`);
            }
        });
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

    // 主处理函数
    function processTable() {
        hideTestRows();
        // 延迟一点执行排序，确保隐藏操作完成
        setTimeout(sortRowsByPrice, 50);
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

        // 防抖的处理函数
        const debouncedProcess = debounce(processTable, 300);

        // 立即执行一次
        setTimeout(processTable, 500); // 给页面更多时间加载

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
                debouncedProcess();
            }
        });

        // 开始观察DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('AutoDL页面优化脚本已启动（包含费用排序功能）');
    }

    // 等待DOM准备就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        // 如果DOM已经加载完成，延迟一点执行以确保页面完全渲染
        setTimeout(initializeScript, 100);
    }

})();
