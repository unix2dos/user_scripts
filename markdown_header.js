// ==UserScript==
// @name         markdown标题快捷键
// @namespace    http://tampermonkey.net/
// @version      20250527
// @description  统一网站标题快捷键为 Cmd/Ctrl+数字
// @match        https://*.mubu.com/*
// @match        https://mubu.com/*
// @match        https://*.yuque.com/*
// @match        https://yuque.com/*
// @match        https://*.feishu.cn/*
// @match        https://feishu.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;
    const isMubu = hostname.includes('mubu.com');
    const isYuque = hostname.includes('yuque.com');
    const isFeishu = hostname.includes('feishu.cn');

    // 监听 keydown 事件
    document.addEventListener('keydown', function(e) {
        // 检测是否按下了 Cmd+数字(1-6) (Mac) 或 Ctrl+数字(1-6) (Windows/Linux)
        if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '6' && !e.altKey) {
            // 阻止默认行为（Chrome 的标签切换）
            e.preventDefault();
            e.stopPropagation();

            // 获取按下的数字
            const digit = e.key;
            const keyCode = 48 + parseInt(digit); // 数字1-6的 keyCode 是 49-54

            let newEvent;

            if (isMubu) {
                // Mubu: Cmd+数字 → Option+数字
                newEvent = new KeyboardEvent('keydown', {
                    key: digit,
                    code: 'Digit' + digit,
                    keyCode: keyCode,
                    which: keyCode,
                    altKey: true,      // Option 键
                    ctrlKey: false,
                    metaKey: false,    // 不要 Cmd 键
                    shiftKey: false,
                    bubbles: true,
                    cancelable: true
                });
                console.log(`Mubu: 转换 Cmd+${digit} → Option+${digit}`);
            } else if (isYuque || isFeishu) {
                // Yuque: Cmd+数字 → Option+Cmd+数字
                newEvent = new KeyboardEvent('keydown', {
                    key: digit,
                    code: 'Digit' + digit,
                    keyCode: keyCode,
                    which: keyCode,
                    altKey: true,      // Option 键
                    ctrlKey: false,
                    metaKey: true,     // Cmd 键
                    shiftKey: false,
                    bubbles: true,
                    cancelable: true
                });
                console.log(`Yuque: 转换 Cmd+${digit} → Option+Cmd+${digit}`);
            }

            // 触发新事件
            if (newEvent) {
                e.target.dispatchEvent(newEvent);

                // 同时触发 keyup 事件
                const keyupEvent = new KeyboardEvent('keyup', {
                    key: digit,
                    code: 'Digit' + digit,
                    keyCode: keyCode,
                    which: keyCode,
                    altKey: isMubu || isYuque,
                    ctrlKey: false,
                    metaKey: isYuque,
                    shiftKey: false,
                    bubbles: true,
                    cancelable: true
                });

                setTimeout(() => {
                    e.target.dispatchEvent(keyupEvent);
                }, 50);
            }
        }
    }, true); // 使用捕获阶段以确保优先处理

    // 备用方案：同时监听 keypress 事件
    document.addEventListener('keypress', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '6' && !e.altKey) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // 额外保险：监听 keyup 事件
    document.addEventListener('keyup', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '6' && !e.altKey) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // 显示加载信息
    if (isMubu) {
        console.log('Mubu 快捷键转换已加载：Cmd+数字(1-6) → Option+数字(1-6)');
    } else if (isYuque) {
        console.log('Yuque 快捷键转换已加载：Cmd+数字(1-6) → Option+Cmd+数字(1-6)');
    }

})();
