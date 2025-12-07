// ==UserScript==
// @name         微信读书 - 强制伪装单页模式
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
            min-width: 100vw !important;
            overflow-x: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 1. 处理顶级容器 .app */
        .app {
            width: 100% !important;
            min-height: 100vh !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
            position: relative !important;
            left: 0 !important;
            padding-top: 0 !important;
        }

        /* 2. 处理路由视图层 .routerView */
        .routerView {
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
        }


        /* 3. 解除中间所有包裹层的宽度限制 */
        /* 对应层级: wr_horizontalReader > wr_horizontalReader_app_content > wr_various... */
        .wr_horizontalReader,
        .wr_horizontalReader_app_content,
        .wr_various_font_provider_wrapper {
            width: 100% !important;
            max-width: 100% !important;
            flex-basis: auto !important;
            display: flex !important;
            justify-content: center !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
        }

        /* 4. 核心内容容器 - 控制阅读宽度的部分 */
        /* 这是限制宽度的罪魁祸首，通常有内联样式 width: xxx px */
        .readerChapterContent_container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            margin-top: 10px !important;
        }

        /* 5. 确保文字层跟随扩展 */
        .readerChapterContent {
            width: 100% !important;
            max-width: none !important;
        }

        /* 6. 隐藏顶部的工具栏或者让它也被居中/全屏，看你需要 */
        .readerTopBar {
            display: none !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `
    // app > routerView > review_editor_container > app_content
    // app > routerView > wr_horizontalReader > wr_horizontalReader_app_content > wr_various_font_provider_wrapper
    //    > readerChapterContent_container > readerChapterContent fontLevel1 > preRenderContainer
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
})();
