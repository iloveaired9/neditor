/**
 * ScrapPlugin.js
 */
import { ApiService } from '../utils/ApiService.js';
import { EditorUtils } from '../utils/EditorUtils.js';

export class ScrapPlugin {
    constructor(editor) {
        this.editor = editor;
        this.insertScrapBtn = document.getElementById('insertScrap');
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        if (!this.insertScrapBtn) return;

        this.insertScrapBtn.addEventListener('click', async () => {
            if (this.editor.isSourceMode || !this.enabled) return;
            const url = prompt('스크랩할 URL을 입력하세요:', 'https://v.daum.net/v/20260302155737320');
            if (!url) return;
            await this._createLinkScrap(url);
        });

        this.editor.el.addEventListener('paste', async (e) => {
            if (!this.enabled || this.editor.isSourceMode) return;
            const pastedText = (e.clipboardData || window.clipboardData).getData('text').trim();
            const urlRegex = /^(https?:\/\/[^\s]+)$/i;

            if (urlRegex.test(pastedText) && !EditorUtils.extractYoutubeId(pastedText)) {
                // Check if it's just a plain URL, if so, we might want to prevent default and scrap
                // But let's check if the user is intending to paste an image first (handled by ImagePlugin)
                // For now, if it's a URL, we scrap it.
                e.preventDefault();
                await this._createLinkScrap(pastedText);
            }
        });
    }

    async _createLinkScrap(url) {
        const linkId = 'link-' + Date.now();
        const initialHtml = `<a href="${url}" target="_blank" class="scrap_link_text" id="${linkId}">${url}</a>`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = initialHtml;
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) fragment.appendChild(tempDiv.firstChild);

        this.editor.insertNode(fragment);

        try {
            // Using real ApiService
            const scrapData = await ApiService.fetchMetadata(url);
            const insertedLink = this.editor.el.querySelector(`#${linkId}`);
            if (insertedLink) {
                const scrapDiv = document.createElement('div');
                scrapDiv.className = 'scrap_bx_container';
                scrapDiv.setAttribute('contenteditable', 'false');
                scrapDiv.innerHTML = `
                    <div class="scrap_del_btn" title="삭제"><i class="fas fa-times"></i></div>
                    <a class="scrap_bx_href" href="${scrapData.url}" target="_blank">
                        <div class="scrap_bx">
                            <span class="scrap_img" style="background-image: url(${scrapData.image || ''});"></span>
                            <ul>
                                <li><strong>${scrapData.title}</strong></li>
                                <li><small>${scrapData.description}</small></li>
                            </ul>
                        </div>
                    </a>
                `;

                insertedLink.parentNode.insertBefore(scrapDiv, insertedLink);

                const delBtn = scrapDiv.querySelector('.scrap_del_btn');
                delBtn.addEventListener('click', () => {
                    if (confirm('삭제하시겠습니까?')) {
                        const link = scrapDiv.nextElementSibling;
                        if (link && link.classList.contains('scrap_link_text')) {
                            link.remove();
                        }
                        scrapDiv.remove();
                        this.editor.emit('change');
                    }
                });

                insertedLink.removeAttribute('id');
            }
        } catch (error) {
            console.error('Scrap failed:', error);
        }
    }

    disable(disabled) {
        if (this.insertScrapBtn) this.insertScrapBtn.disabled = disabled;
    }

    toggleVisibility(visible) {
        this.showInToolbar = visible;
        if (this.insertScrapBtn) {
            this.insertScrapBtn.classList.toggle('hidden-toolbar', !visible);
        }
    }
}
