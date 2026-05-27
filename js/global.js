/**
 * global.js - 淡水觀光研究導航 全域元件與實時倒數計時系統
 */

document.addEventListener("DOMContentLoaded", () => {
    // 啟動全站實時倒數計時器
    initGlobalCountdowns();
});

function initGlobalCountdowns() {
    const timerElement = document.getElementById("countdown-timer");
    const displayElement = document.getElementById("countdown-display");

    // 防呆：若頁面沒有任何計時元素，則不執行
    if (!timerElement && !displayElement) return;

    // 設定目標截稿日期與時間 (2026 年 7 月 30 日 23:59:59)
    const countDownDate = new Date("2026-07-30 23:59:59").getTime();

    // 建立定時器每秒更新一次
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        // 若時間已到，停止計時並顯示提示文字
        if (distance < 0) {
            clearInterval(timer);
            if (timerElement) {
                timerElement.innerHTML = "截稿時間已到！祝您比賽順利！";
            }
            if (displayElement) {
                displayElement.innerText = "已截稿！";
            }
            return;
        }

        // 計算天、時、分、秒
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 1. 更新標準側邊欄與首頁大版面計時器 (#countdown-timer)
        if (timerElement) {
            timerElement.innerHTML = `${days} 天 ${hours} 小時 ${minutes} 分 ${seconds} 秒`;
        }

        // 2. 更新研究輔助工具的專題時程警告計時器 (#countdown-display)
        if (displayElement) {
            displayElement.innerText = `${days} 天 ${hours} 小時`;
        }
    }, 1000);
}
