// ==UserScript==
// @name         微信读书 - 强制伪装单页模式 (全链路居中 v10)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从 .app 根节点开始强制接管布局，实现 1059px 完美居中
// @author       levonfly
// @match        https://weread.qq.com/web/reader/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // === 配置 ===
    const FAKE_WIDTH = 1059;

    // === 步骤一：欺骗 JS，让它吐出单页布局 ===
    Object.defineProperty(window, 'innerWidth', { get: () => FAKE_WIDTH });
    Object.defineProperty(document.documentElement, 'clientWidth', { get: () => FAKE_WIDTH });
    window.dispatchEvent(new Event('resize'));

    // === 步骤二：CSS 全链路锁定 ===
    const css = `
        /* 0. 基础环境清理 */
        html, body {
            width: 100vw !important;
            overflow-x: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 1. 处理顶级容器 .app */
        /* 作用：确保地基铺满全屏，且让内部元素居中对齐 */
        .app {
            width: 100% !important;
            min-height: 100vh !important;
            display: flex !important;        /* 开启 Flex 布局 */
            justify-content: center !important; /* 水平居中 */
            align-items: flex-start !important; /* 顶部对齐 */
            position: relative !important;
            left: 0 !important;
        }

        /* 2. 处理路由视图层 .routerView */
        /* 作用：承上启下，继续维持宽度的全屏，并强制其子元素居中 */
        .routerView {
            width: 100% !important;
            display: flex !important;
            justify-content: center !important; /* 再次确认居中 */
        }

        /* 3. 处理核心内容容器 .review_editor_container */
        /* 作用：这就是你的“纸张”，我们强制锁死它的宽度 */
        .review_editor_container {
            width: ${FAKE_WIDTH}px !important;
            min-width: ${FAKE_WIDTH}px !important;
            max-width: ${FAKE_WIDTH}px !important;

            /* 确保它在 Flex 容器中不被挤压 */
            flex-shrink: 0 !important;
        }

        /* 4. 内容层微调 */
        .app_content {
            width: 100% !important;
        }
    `;
    // app > routerView > review_editor_container > app_content
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
})();
