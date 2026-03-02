document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const sourceArea = document.getElementById('sourceArea');
    const buttons = document.querySelectorAll('button[data-command]');
    const fontSizeSelect = document.getElementById('fontSize');
    const foreColorPicker = document.getElementById('foreColor');
    const undoBtn = document.getElementById('undo');
    const redoBtn = document.getElementById('redo');
    const insertImageBtn = document.getElementById('insertImage');
    const imageInput = document.getElementById('imageInput');
    const insertTableBtn = document.getElementById('insertTable');
    const insertScrapBtn = document.getElementById('insertScrap');
    const insertYoutubeBtn = document.getElementById('insertYoutube');
    const aiEditBtn = document.getElementById('aiEditBtn');
    const aiMenu = document.getElementById('aiMenu');
    const tablePicker = document.getElementById('tablePicker');
    const tableGrid = document.getElementById('tableGrid');
    const tableStatus = document.getElementById('tableStatus');
    const tabBtns = document.querySelectorAll('.tab-btn');

    let isSourceMode = false;

    // 0. Load from LocalStorage
    const savedContent = localStorage.getItem('web-editor-content');
    if (savedContent) {
        editor.innerHTML = savedContent;
    }

    // 1. 기본 서식 버튼
    buttons.forEach(button => {
        button.addEventListener('mousedown', (e) => e.preventDefault());
        button.addEventListener('click', () => {
            if (isSourceMode) return;
            const command = button.getAttribute('data-command');
            document.execCommand(command, false, null);
            editor.focus();
            autoSave();
        });
    });

    // 2. 폰트/색상
    fontSizeSelect.addEventListener('change', () => {
        if (isSourceMode) return;
        if (fontSizeSelect.value) {
            document.execCommand('fontSize', false, fontSizeSelect.value);
            editor.focus();
            fontSizeSelect.value = '';
            autoSave();
        }
    });

    foreColorPicker.addEventListener('input', () => {
        if (isSourceMode) return;
        document.execCommand('foreColor', false, foreColorPicker.value);
        editor.focus();
        autoSave();
    });

    // 3. Undo / Redo
    undoBtn.addEventListener('click', () => {
        if (isSourceMode) return;
        document.execCommand('undo', false, null);
        editor.focus();
        autoSave();
    });

    redoBtn.addEventListener('click', () => {
        if (isSourceMode) return;
        document.execCommand('redo', false, null);
        editor.focus();
        autoSave();
    });

    // 4. Tab Switching Logic
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-tab');
            switchTab(mode);
        });
    });

    function switchTab(mode) {
        if (mode === 'source') {
            sourceArea.value = editor.innerHTML;
            document.getElementById('editor-view').style.display = 'none';
            document.getElementById('source-view').style.display = 'block';
            tabBtns[0].classList.remove('active');
            tabBtns[1].classList.add('active');
            isSourceMode = true;
            disableToolbarButtons(true);
        } else {
            editor.innerHTML = sourceArea.value;
            document.getElementById('source-view').style.display = 'none';
            document.getElementById('editor-view').style.display = 'block';
            tabBtns[1].classList.remove('active');
            tabBtns[0].classList.add('active');
            isSourceMode = false;
            disableToolbarButtons(false);
            editor.focus();
            autoSave();
        }
    }

    function disableToolbarButtons(disabled) {
        buttons.forEach(btn => btn.disabled = disabled);
        fontSizeSelect.disabled = disabled;
        foreColorPicker.disabled = disabled;
        undoBtn.disabled = disabled;
        redoBtn.disabled = disabled;
        insertImageBtn.disabled = disabled;
        insertTableBtn.disabled = disabled;
        insertScrapBtn.disabled = disabled;
        insertYoutubeBtn.disabled = disabled;
    }

    // 5. 이미지 업로드
    insertImageBtn.addEventListener('click', () => {
        if (isSourceMode) return;
        imageInput.click();
    });

    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const originalIcon = insertImageBtn.innerHTML;
            insertImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            insertImageBtn.disabled = true;

            try {
                const mockUrl = await simulateImageUpload(file);
                document.execCommand('insertImage', false, mockUrl);
                
                setTimeout(() => {
                    const images = editor.querySelectorAll('img');
                    images.forEach(img => {
                        if (!img.style.maxWidth) {
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                            img.style.borderRadius = '12px';
                            img.style.display = 'block';
                            img.style.margin = '24px 0';
                            img.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }
                    });
                    autoSave();
                }, 100);
            } finally {
                insertImageBtn.innerHTML = originalIcon;
                insertImageBtn.disabled = false;
                imageInput.value = '';
                editor.focus();
            }
        }
    });

    // 6. 표 삽입 (그리드 셀렉터)
    for (let r = 1; r <= 10; r++) {
        for (let c = 1; c <= 10; c++) {
            const cell = document.createElement('div');
            cell.className = 'table-cell';
            cell.dataset.row = r; cell.dataset.col = c;
            tableGrid.appendChild(cell);
            cell.addEventListener('mouseover', () => updateGridHighlight(r, c));
            cell.addEventListener('click', () => insertTable(r, c));
        }
    }

    insertTableBtn.addEventListener('click', (e) => {
        if (isSourceMode) return;
        e.stopPropagation();
        tablePicker.classList.toggle('active');
    });

    document.addEventListener('click', () => tablePicker.classList.remove('active'));

    function updateGridHighlight(row, col) {
        const cells = tableGrid.querySelectorAll('.table-cell');
        cells.forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            cell.classList.toggle('selected', r <= row && c <= col);
        });
        tableStatus.innerText = `${row} x ${col}`;
    }

    function insertTable(rows, cols) {
        let table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                let cell = document.createElement(i === 0 ? 'th' : 'td');
                cell.innerHTML = i === 0 ? 'Header' : 'Cell';
                tr.appendChild(cell);
            }
            table.appendChild(tr);
        }
        insertNode(table);
        tablePicker.classList.remove('active');
    }

    // 7. 링크 스크랩 및 유튜브 (Paste)
    editor.addEventListener('paste', async (e) => {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text').trim();
        const youtubeId = extractYoutubeId(pastedText);
        
        if (youtubeId) {
            e.preventDefault();
            await insertYoutubeVideo(youtubeId, pastedText);
            return;
        }

        const urlRegex = /^(https?:\/\/[^\s]+)$/i;
        if (urlRegex.test(pastedText)) {
            e.preventDefault();
            await createLinkScrap(pastedText);
        }
    });

    insertScrapBtn.addEventListener('click', async () => {
        if (isSourceMode) return;
        const url = prompt('스크랩할 URL을 입력하세요:', 'https://v.daum.net/v/20260302155737320');
        if (!url) return;
        await createLinkScrap(url);
    });

    async function createLinkScrap(url) {
        const linkId = 'link-' + Date.now();
        const initialHtml = `<a href="${url}" target="_blank" class="scrap_link_text" id="${linkId}">${url}</a>`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = initialHtml;
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) fragment.appendChild(tempDiv.firstChild);
        insertNode(fragment);

        try {
            const scrapData = await fetchMockScrapData(url);
            const insertedLink = editor.querySelector(`#${linkId}`);
            if (insertedLink) {
                const scrapHtml = `
                    <div class="scrap_bx_container" contenteditable="false">
                        <div class="scrap_del_btn" title="삭제"><i class="fas fa-times"></i></div>
                        <a class="scrap_bx_href" href="${scrapData.url}" target="_blank">
                            <div class="scrap_bx">
                                <span class="scrap_img" style="background-image: url(${scrapData.image});"></span>
                                <ul>
                                    <li><strong>${scrapData.title}</strong></li>
                                    <li><small>${scrapData.description}</small></li>
                                </ul>
                            </div>
                        </a>
                    </div>
                `;
                const scrapDiv = document.createElement('div');
                scrapDiv.innerHTML = scrapHtml;
                insertedLink.parentNode.insertBefore(scrapDiv.firstElementChild, insertedLink);
                const delBtn = editor.querySelector('.scrap_del_btn');
                delBtn.addEventListener('click', (e) => {
                    const container = e.target.closest('.scrap_bx_container');
                    if (confirm('삭제하시겠습니까?')) {
                        container.nextElementSibling.remove(); // link
                        container.remove(); // card
                        autoSave();
                    }
                });
                insertedLink.removeAttribute('id');
            }
        } catch (error) { console.error(error); } finally { autoSave(); }
    }

    // 9. YouTube 비디오 삽입 기능
    insertYoutubeBtn.addEventListener('mousedown', (e) => e.preventDefault());
    insertYoutubeBtn.addEventListener('click', async () => {
        if (isSourceMode) return;
        const selection = window.getSelection();
        const savedRange = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
        const input = prompt('YouTube URL 또는 임베드 코드를 입력하세요:', 'https://www.youtube.com/watch?v=Jw8F2akj_T0');
        if (!input) return;

        const videoId = extractYoutubeId(input.trim());
        if (videoId) {
            if (savedRange) { selection.removeAllRanges(); selection.addRange(savedRange); }
            const originalIcon = insertYoutubeBtn.innerHTML;
            insertYoutubeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            insertYoutubeBtn.disabled = true;
            try { await insertYoutubeVideo(videoId, input.trim()); } 
            finally { insertYoutubeBtn.innerHTML = originalIcon; insertYoutubeBtn.disabled = false; }
        } else { alert('올바른 YouTube URL이 아닙니다.'); }
    });

    async function insertYoutubeVideo(videoId, urlOrCode) {
        const metaData = await fetchMockScrapData(urlOrCode);
        const title = (metaData.title || "YouTube video player").replace(/"/g, '&quot;');
        const videoHtml = `
            <div class="video-container" contenteditable="false">
                <iframe width="865" height="487" 
                        src="https://www.youtube-nocookie.com/embed/${videoId.trim()}?rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}" 
                        title="${title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen></iframe>
            </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = videoHtml;
        const fragment = document.createDocumentFragment();
        while (div.firstChild) fragment.appendChild(div.firstChild);
        insertNode(fragment);
    }

    function extractYoutubeId(text) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
        const match = text.match(regex);
        return match ? match[1] : false;
    }

    async function fetchMockScrapData(url) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    resolve({ url, title: "다항함수를 보는 눈이 완전히 바뀔 겁니다.", description: "YouTube 비디오 콘텐츠", image: "https://img.youtube.com/vi/Jw8F2akj_T0/maxresdefault.jpg" });
                } else if (url.includes('daum.net')) {
                    resolve({ url, title: "휴장에 소나기 피한 코스피…아시아 증시 '패닉'은 없었다", description: "중동발 지정학적 리스크 관련 뉴스", image: "https://img1.daumcdn.net/thumb/S1200x630/?fname=https://t1.daumcdn.net/news/202603/02/NEWS1/20260302155737944wuoe.jpg" });
                } else {
                    resolve({ url, title: "링크 미리보기", description: "설명 문구입니다.", image: "https://picsum.photos/400/300" });
                }
            }, 1000);
        });
    }

    function insertNode(node) {
        const selection = window.getSelection();
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (editor.contains(range.commonAncestorContainer)) {
                range.deleteContents();
                const lastChild = node.lastChild;
                range.insertNode(node);
                if (lastChild) lastChild.parentNode.insertBefore(p, lastChild.nextSibling);
                else editor.appendChild(p);
            } else { editor.appendChild(node); editor.appendChild(p); }
        } else { editor.appendChild(node); editor.appendChild(p); }
        const newRange = document.createRange();
        newRange.setStart(p, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        editor.focus();
        autoSave();
    }

    // 8. AI 편집 기능 (Mock AI)
    aiEditBtn.addEventListener('click', (e) => {
        if (isSourceMode) return;
        e.stopPropagation();
        aiMenu.classList.toggle('active');
    });
    document.addEventListener('click', () => aiMenu.classList.remove('active'));
    aiMenu.querySelectorAll('button[data-ai]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const command = btn.dataset.ai;
            aiMenu.classList.remove('active');
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            if (!selectedText) { alert('텍스트를 선택해 주세요.'); return; }
            const originalIcon = aiEditBtn.innerHTML;
            aiEditBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            aiEditBtn.disabled = true;
            try {
                const resultText = await processAiCommand(command, selectedText);
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(resultText));
            } finally { aiEditBtn.innerHTML = originalIcon; aiEditBtn.disabled = false; editor.focus(); autoSave(); }
        });
    });

    async function processAiCommand(command, text) {
        return new Promise((resolve) => {
            setTimeout(() => {
                switch(command) {
                    case 'summarize': resolve(`[AI 요약] ${text.substring(0, 50)}...`); break;
                    case 'fix': resolve(`[AI 교정] ${text}`); break;
                    case 'professional': resolve(`${text} (Professional)`); break;
                    case 'casual': resolve(`${text} (Casual) 😊`); break;
                    default: resolve(text);
                }
            }, 1500);
        });
    }

    // 10. 자동 저장 및 초기화
    editor.addEventListener('input', autoSave);
    function autoSave() { localStorage.setItem('web-editor-content', editor.innerHTML); }
    editor.addEventListener('focus', () => {
        if (editor.innerText.trim() === "" && editor.querySelectorAll('img, table, .scrap_bx, .video-container').length === 0) {
            editor.innerHTML = "";
        }
    });

    function simulateImageUpload(file) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const randomId = Math.floor(Math.random() * 1000);
                resolve(`https://picsum.photos/id/${randomId}/800/600`);
            }, 1000);
        });
    }
    editor.focus();
});
