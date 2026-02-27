// ==UserScript==
// @name         微信读书 - 双栏阅读模式强制单页
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
        /* 1. 确保文字层跟随扩展 */
        .readerChapterContent {
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            margin-top: 0px !important;
        }

        /* 2. 隐藏顶部的工具栏 */
        // .readerTopBar {
        //     display: none !important;
        //     height: 0 !important;
        //     opacity: 0 !important;
        //     pointer-events: none !important;
        // }

        /* 3. 强制修正控制栏位置 */
        .readerControls {
         right: 0 !important;       /* 核心：把 -80px 覆盖为 0，拉回屏幕内 */
         /*  opacity: 1 !important;    核心：把透明度改回 1，让它可见 */
        }

        /* 4. 隐藏脚注 */
        .reader_footer_note.js_readerFooterNote.wr_absolute {
            display: none !important;
        }
    `
    // app > routerView > wr_horizontalReader > wr_horizontalReader_app_content > wr_various_font_provider_wrapper
    //    > readerChapterContent_container > readerChapterContent fontLevel1 > preRenderContainer
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
})();
