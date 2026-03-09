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
                <div class="plugin-info">
                    <span class="plugin-name">${name}</span>
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
            `;
            list.appendChild(li);

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
