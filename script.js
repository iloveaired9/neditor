import { Neditor } from './js/core/Neditor.js';
import { ToolbarPlugin } from './js/plugins/ToolbarPlugin.js';
import { ImagePlugin } from './js/plugins/ImagePlugin.js';
import { TablePlugin } from './js/plugins/TablePlugin.js';
import { ScrapPlugin } from './js/plugins/ScrapPlugin.js';
import { YoutubePlugin } from './js/plugins/YoutubePlugin.js';
import { AiPlugin } from './js/plugins/AiPlugin.js';
import { TabPlugin } from './js/plugins/TabPlugin.js';
import { StoragePlugin } from './js/plugins/StoragePlugin.js';
import { SettingsPlugin } from './js/plugins/SettingsPlugin.js';
import { FileManagerPlugin } from './js/plugins/FileManagerPlugin.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Core
    const editor = new Neditor({ containerId: 'editor' });

    // 2. Register Plugins
    editor.registerPlugin('toolbar', ToolbarPlugin);
    editor.registerPlugin('tabs', TabPlugin);
    editor.registerPlugin('image', ImagePlugin);
    editor.registerPlugin('table', TablePlugin);
    editor.registerPlugin('scrap', ScrapPlugin);
    editor.registerPlugin('youtube', YoutubePlugin);
    editor.registerPlugin('ai', AiPlugin);
    editor.registerPlugin('storage', StoragePlugin);
    editor.registerPlugin('fileManager', FileManagerPlugin);
    editor.registerPlugin('settings', SettingsPlugin);

    console.log('Neditor modular ES system ready.');
});
