/**
 * TablePlugin.js
 */
export class TablePlugin {
    constructor(editor) {
        this.editor = editor;
        this.insertTableBtn = document.getElementById('insertTable');
        this.tablePicker = document.getElementById('tablePicker');
        this.tableGrid = document.getElementById('tableGrid');
        this.tableStatus = document.getElementById('tableStatus');

        // Table management toolbar
        this.toolbar = document.getElementById('tableToolbar');
        this.addRowBtn = document.getElementById('addRowBtn');
        this.delRowBtn = document.getElementById('delRowBtn');
        this.addColBtn = document.getElementById('addColBtn');
        this.delColBtn = document.getElementById('delColBtn');
        this.delTableBtn = document.getElementById('delTableBtn');

        this.activeTable = null;
        this.activeCell = null;
        this.lastRange = null;
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        if (!this.insertTableBtn || !this.tablePicker) return;

        this._createGrid();

        this.insertTableBtn.addEventListener('click', (e) => {
            if (this.editor.isSourceMode || !this.enabled) return;
            e.stopPropagation();
            this._saveSelection();
            this.tablePicker.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            if (this.tablePicker) this.tablePicker.classList.remove('active');
        });

        // Event delegation for table focus inside the editor
        this.editor.el.addEventListener('click', (e) => this._handleTableClick(e));
        this.editor.el.addEventListener('keyup', (e) => this._handleTableClick(e));
        this.editor.el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cell = e.target.closest('td, th');
                if (cell) {
                    // Check if it's the last cell of the last row
                    const tr = cell.closest('tr');
                    const table = tr.closest('table');
                    const isLastRow = tr === table.rows[table.rows.length - 1];
                    const isLastCell = cell === tr.cells[tr.cells.length - 1];

                    if (isLastRow && isLastCell) {
                        // Optional: Add new row on Enter at the end? 
                        // For now, just allow default or handle shift+enter
                    }

                    // Prevent default paragraph creation if we want strict single-line cells, 
                    // but usually rich editors allow multiple lines. 
                    // Let's at least ensure it doesn't break out.
                }
            }
        });

        // Toolbar Button Events
        this.addRowBtn.onclick = () => this._addRow();
        this.delRowBtn.onclick = () => this._removeRow();
        this.addColBtn.onclick = () => this._addColumn();
        this.delColBtn.onclick = () => this._removeColumn();
        this.delTableBtn.onclick = () => this._deleteTable();

        // Prevent toolbar from closing when clicking inside it
        this.toolbar.onclick = (e) => e.stopPropagation();

        // Global click to hide toolbar
        document.addEventListener('mousedown', (e) => {
            if (this.toolbar && !this.toolbar.contains(e.target) && !this.editor.el.contains(e.target)) {
                this.toolbar.classList.remove('active');
            }
        });
    }

    _handleTableClick(e) {
        const cell = e.target.closest('td, th');
        const table = e.target.closest('table');

        if (table) {
            this.activeTable = table;
            this.activeCell = cell;
            this._showToolbar();
        } else {
            this.activeTable = null;
            this.activeCell = null;
            this.toolbar.classList.remove('active');
        }
    }

    _showToolbar() {
        if (!this.activeTable) return;

        const rect = this.activeTable.getBoundingClientRect();
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

        this.toolbar.style.top = `${rect.top + scrollY - 45}px`;
        this.toolbar.style.left = `${rect.left + scrollX}px`;
        this.toolbar.classList.add('active');
    }

    _createGrid() {
        this.tableGrid.innerHTML = ''; // Clear existing
        for (let r = 1; r <= 10; r++) {
            for (let c = 1; c <= 10; c++) {
                const cell = document.createElement('div');
                cell.className = 'table-cell';
                cell.style.width = '24px'; // Larger cells
                cell.style.height = '24px';
                cell.dataset.row = r;
                cell.dataset.col = c;
                this.tableGrid.appendChild(cell);
                cell.addEventListener('mouseover', () => this._updateGridHighlight(r, c));
                cell.addEventListener('click', () => this._insertTable(r, c));
            }
        }
        // Update grid columns for larger cells
        this.tableGrid.style.gridTemplateColumns = 'repeat(10, 24px)';
    }

    _updateGridHighlight(row, col) {
        if (!this.enabled) return;
        const cells = this.tableGrid.querySelectorAll('.table-cell');
        cells.forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            cell.classList.toggle('selected', r <= row && c <= col);
        });
        this.tableStatus.innerText = `${row} x ${col}`;
    }

    _insertTable(rows, cols) {
        if (!this.enabled) return;
        this._restoreSelection();

        const table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement(i === 0 ? 'th' : 'td');
                cell.innerHTML = '<br>';
                tr.appendChild(cell);
            }
            table.appendChild(tr);
        }
        this.editor.insertNode(table);
        this.tablePicker.classList.remove('active');
    }

    _addRow() {
        if (!this.activeTable || !this.activeCell) return;
        const row = this.activeCell.closest('tr');
        const newRow = row.cloneNode(true);
        Array.from(newRow.cells).forEach(cell => cell.innerHTML = '<br>');
        row.parentNode.insertBefore(newRow, row.nextSibling);
        this.editor.emit('change');
        this._showToolbar();
    }

    _removeRow() {
        if (!this.activeTable || !this.activeCell) return;
        const row = this.activeCell.closest('tr');
        if (this.activeTable.rows.length <= 1) {
            this._deleteTable();
        } else {
            row.remove();
            this.toolbar.classList.remove('active');
            this.editor.emit('change');
        }
    }

    _addColumn() {
        if (!this.activeTable || !this.activeCell) return;
        const colIndex = this.activeCell.cellIndex;
        Array.from(this.activeTable.rows).forEach(row => {
            const cell = row.cells[colIndex];
            const newCell = cell.cloneNode(true);
            newCell.innerHTML = '<br>';
            row.insertBefore(newCell, cell.nextSibling);
        });
        this.editor.emit('change');
        this._showToolbar();
    }

    _removeColumn() {
        if (!this.activeTable || !this.activeCell) return;
        const colIndex = this.activeCell.cellIndex;
        const totalCols = this.activeTable.rows[0].cells.length;

        if (totalCols <= 1) {
            this._deleteTable();
        } else {
            Array.from(this.activeTable.rows).forEach(row => {
                row.deleteCell(colIndex);
            });
            this.toolbar.classList.remove('active');
            this.editor.emit('change');
        }
    }

    _deleteTable() {
        if (!this.activeTable) return;
        if (confirm('표를 전체 삭제하시겠습니까?')) {
            this.activeTable.remove();
            this.toolbar.classList.remove('active');
            this.editor.emit('change');
        }
    }

    _saveSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            this.lastRange = selection.getRangeAt(0);
        }
    }

    _restoreSelection() {
        if (this.lastRange) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(this.lastRange);
        }
    }

    disable(disabled) {
        this.enabled = !disabled;
        if (this.insertTableBtn) this.insertTableBtn.disabled = disabled;
    }
}
