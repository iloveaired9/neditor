/**
 * YoutubePlugin.js
 */
import { ApiMocks } from '../utils/ApiMocks.js';
import { EditorUtils } from '../utils/EditorUtils.js';

export class YoutubePlugin {
    constructor(editor) {
        this.editor = editor;
        this.insertYoutubeBtn = document.getElementById('insertYoutube');
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        if (!this.insertYoutubeBtn) return;

        this.insertYoutubeBtn.addEventListener('mousedown', (e) => e.preventDefault());
        this.insertYoutubeBtn.addEventListener('click', async () => {
            if (this.editor.isSourceMode || !this.enabled) return;

            const selection = window.getSelection();
            const savedRange = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;

            const input = prompt('YouTube URL 또는 임베드 코드를 입력하세요:', 'https://www.youtube.com/watch?v=Jw8F2akj_T0');
            if (!input) return;

            const videoId = EditorUtils.extractYoutubeId(input.trim());
            if (videoId) {
                if (savedRange) {
                    selection.removeAllRanges();
                    selection.addRange(savedRange);
                }
                await this._insertYoutubeVideo(videoId, input.trim());
            } else {
                alert('올바른 YouTube URL이 아닙니다.');
            }
        });

        this.editor.el.addEventListener('paste', async (e) => {
            if (!this.enabled) return;
            const pastedText = (e.clipboardData || window.clipboardData).getData('text').trim();
            const videoId = EditorUtils.extractYoutubeId(pastedText);

            if (videoId) {
                e.preventDefault();
                await this._insertYoutubeVideo(videoId, pastedText);
            }
        });
    }

    async _insertYoutubeVideo(videoId, urlOrCode) {
        const originalIcon = this.insertYoutubeBtn.innerHTML;
        this.insertYoutubeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.insertYoutubeBtn.disabled = true;

        try {
            const metaData = await ApiMocks.fetchMockScrapData(urlOrCode);
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

            this.editor.insertNode(fragment);
        } catch (err) {
            console.error('Youtube embed failed:', err);
        } finally {
            this.insertYoutubeBtn.innerHTML = originalIcon;
            this.insertYoutubeBtn.disabled = false;
        }
    }

    disable(disabled) {
        if (this.insertYoutubeBtn) this.insertYoutubeBtn.disabled = disabled;
    }
}
