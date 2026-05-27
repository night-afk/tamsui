
// 3. Tab 切換邏輯
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    const tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// 確保網頁的 HTML 元素都載入完成後，才啟動計時器
document.addEventListener("DOMContentLoaded", function() {
    initLucideIcons();
    initMobileNav();
    initCharts();
    initStrategiesTabs();
    initPoll();
    initCommentBoard();
});

// 0. 初始化手機版導覽列切換
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 點擊連結時自動關閉選單
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 1. 初始化 Lucide 圖標
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// 2. 初始化 Chart.js 統計圖表
function initCharts() {
    const visitorCanvas = document.getElementById('visitorChart');
    const activityCanvas = document.getElementById('activityChart');
    
    if (visitorCanvas && typeof Chart !== 'undefined') {
        new Chart(visitorCanvas, {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025 (估)'],
                datasets: [{
                    label: '年造訪旅客 (萬人次)',
                    data: [750, 780, 420, 450, 680, 810, 840, 860],
                    borderColor: '#E67E22', // Twilight orange
                    backgroundColor: 'rgba(11, 60, 93, 0.08)', // Harbor blue gradient fill
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#E67E22',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(11, 60, 93, 0.95)',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        padding: 10
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#718096',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(11, 60, 93, 0.05)'
                        },
                        ticks: {
                            color: '#718096',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }
    
    if (activityCanvas && typeof Chart !== 'undefined') {
        new Chart(activityCanvas, {
            type: 'doughnut',
            data: {
                labels: ['美食老街小吃', '古蹟歷史參訪', '淡水夕照海景', '伴手禮購物', '綠色輕軌體驗'],
                datasets: [{
                    data: [42, 25, 18, 10, 5],
                    backgroundColor: [
                        '#0B3C5D', // Harbor blue
                        '#E67E22', // Twilight orange
                        '#3182CE', // Soft blue
                        '#D69E2E', // Soft gold
                        '#38A169'  // Soft green
                    ],
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            color: '#4A5568',
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(11, 60, 93, 0.95)',
                        padding: 10
                    }
                },
                cutout: '60%'
            }
        });
    }
}

// 3. 永續對策頁籤切換
function initStrategiesTabs() {
    const tabButtons = document.querySelectorAll('.strategy-tabs .tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.currentTarget.getAttribute('data-tab');
            
            // 移除所有按鈕的 active 狀態
            tabButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // 隱藏所有頁籤內容
            const contents = document.querySelectorAll('.tab-content');
            contents.forEach(content => content.classList.remove('active'));
            
            // 顯示當前點擊的頁籤內容
            const target = document.getElementById(`tab-${tabId}`);
            if (target) {
                target.classList.add('active');
            }
        });
    });
}

// 4. 基於 LocalStorage 的互動投票功能
function initPoll() {
    const pollOptions = document.querySelectorAll('.poll-option');
    if (pollOptions.length === 0) return;
    
    const defaultVotes = { traffic: 142, waste: 88, prices: 65, commercial: 115 };
    let votes = JSON.parse(localStorage.getItem('tamsui_poll_votes')) || defaultVotes;
    let hasVoted = localStorage.getItem('tamsui_poll_has_voted');
    let userSelection = localStorage.getItem('tamsui_poll_selection');
    
    function calculateAndShowResults(selectedOptionId) {
        const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
        
        pollOptions.forEach(option => {
            const optionId = option.getAttribute('data-option');
            const voteCount = votes[optionId];
            const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
            
            // 更新百分比文字
            option.querySelector('.poll-percent').textContent = `${percentage}%`;
            
            // 更新進度條寬度
            const progressBar = option.querySelector('.poll-progress-bar');
            progressBar.style.width = `${percentage}%`;
            
            // 禁用投票互動
            option.classList.add('disabled');
            
            // 標記選中的選項
            if (optionId === selectedOptionId) {
                option.classList.add('selected');
            }
        });
    }
    
    if (hasVoted === 'true' && userSelection) {
        calculateAndShowResults(userSelection);
    } else {
        pollOptions.forEach(option => {
            // 清理可能殘留的狀態
            option.classList.remove('disabled', 'selected');
            option.querySelector('.poll-percent').textContent = '0%';
            option.querySelector('.poll-progress-bar').style.width = '0';
            
            option.addEventListener('click', function handleVote() {
                const selectedId = option.getAttribute('data-option');
                
                // 防呆：如果已經投票過就直接返回
                if (localStorage.getItem('tamsui_poll_has_voted') === 'true') return;
                
                votes[selectedId]++;
                localStorage.setItem('tamsui_poll_votes', JSON.stringify(votes));
                localStorage.setItem('tamsui_poll_has_voted', 'true');
                localStorage.setItem('tamsui_poll_selection', selectedId);
                
                // 計算結果並呈現動畫
                calculateAndShowResults(selectedId);
            });
        });
    }
    
    const resetBtn = document.getElementById('reset-poll-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            localStorage.removeItem('tamsui_poll_has_voted');
            localStorage.removeItem('tamsui_poll_selection');
            localStorage.setItem('tamsui_poll_votes', JSON.stringify(defaultVotes));
            window.location.reload(); // 重整頁面以重置狀態
        });
    }
}

// 5. 基於 LocalStorage 的留言板系統
function initCommentBoard() {
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    if (!commentList) return;
    
    const defaultComments = [
        {
            name: "陳明勳",
            identity: "在地居民",
            text: "每到假日老街周圍塞車塞得太嚴重，居民出門都很困難。真的急需推廣 YouBike 和輕軌等綠色交通分流，也希望能增加人行專用步道。",
            time: "2026-05-25 15:30"
        },
        {
            name: "李教授",
            identity: "學者/專家",
            text: "淡水有極佳的文化歷史資源，過度商業化只會殺雞取卵。推廣重建街與清水老街的歷史導覽，將遊客引流至山城，才是長遠之計。",
            time: "2026-05-25 12:15"
        },
        {
            name: "張阿姨",
            identity: "在地店家",
            text: "現在老街賣的伴手禮很多都是批發的，全台灣老街都一樣，久了遊客就膩了。我們商家自己也應該多提升商品在地特色！",
            time: "2026-05-24 18:45"
        }
    ];
    
    let comments = JSON.parse(localStorage.getItem('tamsui_comments')) || defaultComments;
    
    function getIdentityClass(identity) {
        switch(identity) {
            case '遊客': return 'tourist';
            case '在地居民': return 'resident';
            case '業者': return 'merchant';
            case '學者/專家': return 'scholar';
            default: return 'tourist';
        }
    }
    
    function renderComments() {
        commentList.innerHTML = '';
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';
            
            const badgeClass = getIdentityClass(comment.identity);
            
            commentDiv.innerHTML = `
                <div class="comment-header">
                    <div class="comment-user">
                        <span class="comment-name">${escapeHTML(comment.name)}</span>
                        <span class="comment-badge ${badgeClass}">${escapeHTML(comment.identity)}</span>
                    </div>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <p class="comment-body">${escapeHTML(comment.text)}</p>
            `;
            commentList.appendChild(commentDiv);
        });
    }
    
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('comment-name');
            const identitySelect = document.getElementById('comment-identity');
            const textInput = document.getElementById('comment-text');
            
            if (!nameInput || !identitySelect || !textInput) return;
            
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const timeStr = `${year}-${month}-${day} ${hours}:${minutes}`;
            
            const newComment = {
                name: nameInput.value.trim(),
                identity: identitySelect.value,
                text: textInput.value.trim(),
                time: timeStr
            };
            
            comments.unshift(newComment); // 新增在最前面
            localStorage.setItem('tamsui_comments', JSON.stringify(comments));
            
            renderComments();
            commentForm.reset();
        });
    }
    
    renderComments();
}