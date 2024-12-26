// Main application logic
class App {
    constructor() {
        this.records = [];
        this.currentFilter = null;
        this.setupEventListeners();
        this.init();
    }

    async init() {
        await this.loadRecords();
        this.renderRecords();
        this.setupSearch();
    }

    async loadRecords() {
        this.records = await API.fetchRecords();
    }

    renderRecords() {
        const container = document.getElementById('records-container');
        container.innerHTML = '';

        const recordsToShow = this.currentFilter
            ? this.records.filter(record => record.section === this.currentFilter)
            : this.records;

        recordsToShow.forEach(record => {
            const card = this.createRecordCard(record);
            container.appendChild(card);
        });
    }

    createRecordCard(record) {
        const card = document.createElement('div');
        card.className = 'record-card';
        card.innerHTML = `
            <img src="${record.image}" alt="${record.name}" class="record-image">
            <div class="record-info">
                <div class="record-name">${record.name}</div>
                <div class="record-role">${record.role}</div>
            </div>
        `;
        card.addEventListener('click', () => this.showModal(record));
        return card;
    }

    async showModal(record) {
        const modal = document.getElementById('recordModal');
        const modalImage = document.getElementById('modalImage');
        const modalName = document.getElementById('modalName');
        const modalRole = document.getElementById('modalRole');
        const modalActionsView = document.getElementById('modalActionsView');
        const modalActions = document.getElementById('modalActions');

        modalImage.src = record.image;
        modalName.textContent = record.name;
        modalRole.textContent = record.role;

        const actions = await API.getRecordActions(record.id);
        modalActionsView.textContent = actions;
        modalActions.value = actions;

        modal.style.display = 'block';
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.section;
                this.renderRecords();
            });
        });

        // Modal close button
        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('recordModal').style.display = 'none';
        });

        // Edit and Save buttons
        document.getElementById('editBtn').addEventListener('click', this.enableEditing.bind(this));
        document.getElementById('saveBtn').addEventListener('click', this.saveActions.bind(this));

        // Scroll to top button
        const scrollBtn = document.querySelector('.scroll-top-btn');
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Show/hide scroll button based on scroll position
        window.addEventListener('scroll', () => {
            scrollBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        let debounceTimeout;

        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                const searchTerm = searchInput.value.toLowerCase();
                if (searchTerm.length >= CONFIG.MIN_SEARCH_CHARS) {
                    this.performSearch(searchTerm);
                }
            }, CONFIG.SEARCH_DEBOUNCE_MS);
        });
    }

    performSearch(searchTerm) {
        const filteredRecords = this.records.filter(record => 
            record.name.toLowerCase().includes(searchTerm) ||
            record.role.toLowerCase().includes(searchTerm)
        );
        this.renderRecords(filteredRecords);
    }

    enableEditing() {
        const modalActionsView = document.getElementById('modalActionsView');
        const modalActions = document.getElementById('modalActions');
        const editBtn = document.getElementById('editBtn');
        const saveBtn = document.getElementById('saveBtn');

        modalActionsView.style.display = 'none';
        modalActions.style.display = 'block';
        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
    }

    async saveActions() {
        const modalActions = document.getElementById('modalActions');
        const currentRecord = this.records.find(r => r.name === document.getElementById('modalName').textContent);
        
        if (currentRecord) {
            const success = await API.updateRecordActions(currentRecord.id, modalActions.value);
            if (success) {
                this.showModal(currentRecord); // Refresh modal with saved data
            } else {
                alert('Failed to save changes. Please try again.');
            }
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
