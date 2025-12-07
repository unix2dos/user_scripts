// ==UserScript==
// @name         微信读书侧边进度显示 (V2.0 定制版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动在右侧显示微信读书的实时阅读进度百分比 (适配目录结构)
// @author       BotGem
// @match        https://weread.qq.com/web/reader/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const DISPLAY_BOX_ID = 'botgem-weread-progress-box';

    // 1. 创建显示框
    function createDisplayBox() {
        if (document.getElementById(DISPLAY_BOX_ID)) return;

        const div = document.createElement('div');
        div.id = DISPLAY_BOX_ID;

        // --- 样式设置 ---
        div.style.position = 'fixed';
        div.style.bottom = '120px';
        div.style.right = '20px';
        div.style.zIndex = '9999';
        div.style.padding = '8px 12px';
        div.style.background = 'rgba(255, 255, 255, 0.95)';
        div.style.color = '#333';
        div.style.fontSize = '16px'; // 稍微调大字体
        div.style.fontWeight = 'bold';
        div.style.borderRadius = '8px';
        div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        div.style.border = '1px solid #ddd';
        div.style.textAlign = 'center';
        div.style.cursor = 'default';
        div.style.minWidth = '60px';

        div.innerText = '等待...';
        document.body.appendChild(div);
    }

    // 2. 提取进度的核心函数
    function getProgressText() {
        // 查找 class 为 readerCatalog_list_item_meta_progress 的元素下的 div
        const catalogEl = document.querySelector('.readerCatalog_list_item_meta_progress > div');
        if (catalogEl) {
            return catalogEl.innerText; // 应返回 "当前读到 50%"
        }
        return null;
    }

    // 3. 更新显示逻辑
    function updateProgress() {
        const displayBox = document.getElementById(DISPLAY_BOX_ID);
        if (!displayBox) return;

        const rawText = getProgressText();

        if (rawText) {
            // 使用正则表达式提取百分比 (无论原本文字是 "12%" 还是 "当前读到 12%")
            // 匹配数字后跟一个百分号
            const match = rawText.match(/(\d+(\.\d+)?%)/);

            if (match && match[0]) {
                displayBox.innerText = match[0]; // 显示 "50%"
                displayBox.style.color = '#333'; // 正常颜色
            }
        } else {
            // 如果实在找不到，可能是目录还没加载，或者DOM结构变了
            // 保持原样或显示提示，这里选择不频繁闪烁，不做操作
            // console.log('BotGem: 暂未找到进度元素');
        }
    }

    // 4. 定时器与监听
    function init() {
        createDisplayBox();

        // 立即尝试一次
        updateProgress();

        // 监听滚动 (微信读书主要靠滚动更新数据)
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateProgress);
        });

        // 额外设置一个高频定时器
        // 因为 "readerCatalog" 那个元素可能是动态生成的，滚动时可能有一瞬间不存在
        setInterval(updateProgress, 1000);
    }

    window.addEventListener('load', init);

})();
