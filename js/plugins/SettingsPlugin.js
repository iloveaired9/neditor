/**
 * SettingsPlugin.js
 */
export class SettingsPlugin {
    constructor(editor) {
        this.editor = editor;
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = null;
    }

    init() {
        if (!this.settingsBtn) return;

        this._createModal();

        this.settingsBtn.addEventListener('click', () => {
            this._toggleModal();
        });

        document.addEventListener('click', (e) => {
            if (this.settingsModal &&
                !this.settingsModal.contains(e.target) &&
                e.target !== this.settingsBtn &&
                !this.settingsBtn.contains(e.target)) {
                this.settingsModal.classList.remove('active');
            }
        });
    }

    _createModal() {
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.id = 'settingsModal';
        modal.innerHTML = `
            <div class="settings-header">
                <h3><i class="fas fa-cog"></i> Developer Settings</h3>
                <button class="close-settings"><i class="fas fa-times"></i></button>
            </div>
            <div class="settings-body">
                <h4>Registered Plugins</h4>
                <ul id="pluginList" class="plugin-list"></ul>
            </div>
        `;
        document.body.appendChild(modal);
        this.settingsModal = modal;

        modal.querySelector('.close-settings').addEventListener('click', () => {
            this._toggleModal();
        });
    }

    _toggleModal() {
        const isActive = this.settingsModal.classList.toggle('active');
        if (isActive) {
            this._refreshPluginList();
        }
    }

    _refreshPluginList() {
        const list = this.settingsModal.querySelector('#pluginList');
        list.innerHTML = '';

        const plugins = this.editor.plugins;
        Object.keys(plugins).forEach(name => {
            if (name === 'settings') return;

            const plugin = plugins[name];
            const isEnabled = plugin.enabled !== false;
            const isVisible = plugin.showInToolbar !== false;

            const li = document.createElement('li');
            li.innerHTML = `
                <div class="plugin-info" style="cursor: pointer;" title="클릭하여 상세 설정 보기">
                    <span class="plugin-name">${name} <i class="fas fa-chevron-right" style="font-size: 10px; margin-left: 5px; color: #94a3b8;"></i></span>
                </div>
                <div class="plugin-actions">
                    <div class="action-group">
                        <span class="action-label">Enable</span>
                        <label class="switch">
                            <input type="checkbox" class="toggle-enable" ${isEnabled ? 'checked' : ''} data-plugin="${name}">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="action-group">
                        <span class="action-label">Show</span>
                        <label class="switch">
                            <input type="checkbox" class="toggle-visible" ${isVisible ? 'checked' : ''} data-plugin="${name}">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div class="plugin-details" id="details-${name}" style="display: none; width: 100%; margin-top: 10px; padding: 10px; background: #fff; border-top: 1px dashed #e2e8f0; border-radius: 4px;">
                    <!-- Detail settings will be injected here -->
                </div>
            `;
            list.appendChild(li);

            li.querySelector('.plugin-info').addEventListener('click', () => {
                this._togglePluginDetails(name);
            });

            li.querySelector('.toggle-enable').addEventListener('change', (e) => {
                this._togglePlugin(name, e.target.checked);
            });

            li.querySelector('.toggle-visible').addEventListener('change', (e) => {
                this._toggleVisibility(name, e.target.checked);
            });
        });

        // Add core info (Read-only)
        const liCore = document.createElement('li');
        liCore.innerHTML = `
            <div class="plugin-info">
                <span class="plugin-name">Neditor Core</span>
            </div>
            <div class="plugin-status active">Running</div>
        `;
        list.appendChild(liCore);
    }

    _togglePluginDetails(name) {
        const detailDiv = this.settingsModal.querySelector(`#details-${name}`);
        if (!detailDiv) return;

        const isVisible = detailDiv.style.display === 'block';

        // Close all other details first
        this.settingsModal.querySelectorAll('.plugin-details').forEach(el => el.style.display = 'none');
        this.settingsModal.querySelectorAll('.plugin-info i').forEach(ia => ia.className = 'fas fa-chevron-right');

        if (!isVisible) {
            detailDiv.style.display = 'block';
            this.settingsModal.querySelector(`.plugin-info i`).className = 'fas fa-chevron-down';
            this._renderPluginDetails(name, detailDiv);
        }
    }

    _renderPluginDetails(name, container) {
        const plugin = this.editor.plugins[name];
        container.innerHTML = '';

        if (name === 'scrap') {
            const rowDelete = document.createElement('div');
            rowDelete.className = 'detail-row';
            rowDelete.style.display = 'flex';
            rowDelete.style.justifyContent = 'space-between';
            rowDelete.style.alignItems = 'center';
            rowDelete.style.marginBottom = '8px';
            rowDelete.innerHTML = `
                <span style="font-size: 12px; color: #475569;">삭제 시 확인 메시지 표시</span>
                <label class="switch">
                    <input type="checkbox" id="scrap-confirm-delete" ${plugin.confirmDelete ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            `;
            container.appendChild(rowDelete);

            rowDelete.querySelector('#scrap-confirm-delete').addEventListener('change', (e) => {
                plugin.confirmDelete = e.target.checked;
            });

            const rowUrl = document.createElement('div');
            rowUrl.className = 'detail-row';
            rowUrl.style.display = 'flex';
            rowUrl.style.justifyContent = 'space-between';
            rowUrl.style.alignItems = 'center';
            rowUrl.innerHTML = `
                <span style="font-size: 12px; color: #475569;">스크랩 URL 표시</span>
                <label class="switch">
                    <input type="checkbox" id="scrap-show-url" ${plugin.showUrl ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            `;
            container.appendChild(rowUrl);

            rowUrl.querySelector('#scrap-show-url').addEventListener('change', (e) => {
                plugin.showUrl = e.target.checked;
                // Proactively update existing scrap links visibility if needed, 
                // but usually this applies to new ones. 
                // For a better UX, we could broadcast a change or find all .scrap_link_text
                this.editor.el.querySelectorAll('.scrap_link_text').forEach(link => {
                    link.style.display = plugin.showUrl ? 'block' : 'none';
                });
            });
        } else {
            container.innerHTML = `<span style="font-size: 11px; color: #94a3b8; font-style: italic;">상세 설정이 없습니다.</span>`;
        }
    }

    _togglePlugin(name, enabled) {
        const plugin = this.editor.plugins[name];
        if (plugin) {
            plugin.enabled = enabled;
            if (typeof plugin.disable === 'function') {
                plugin.disable(!enabled);
            }
            console.log(`Plugin ${name} ${enabled ? 'enabled' : 'disabled'}`);
            this.editor.emit('pluginStateChange', { name, enabled });
        }
    }

    _toggleVisibility(name, visible) {
        const plugin = this.editor.plugins[name];
        if (plugin) {
            plugin.showInToolbar = visible;
            if (typeof plugin.toggleVisibility === 'function') {
                plugin.toggleVisibility(visible);
            } else {
                // Generic fallback: look for common element names
                const el = plugin.insertImageBtn ||
                    plugin.insertTableBtn ||
                    plugin.insertScrapBtn ||
                    plugin.insertYoutubeBtn ||
                    plugin.aiEditBtn ||
                    (plugin.tabBtns ? plugin.tabBtns[0].parentNode : null);

                if (el) {
                    el.classList.toggle('hidden-toolbar', !visible);
                }
            }
            console.log(`Plugin ${name} toolbar visibility: ${visible}`);
        }
    }
}
