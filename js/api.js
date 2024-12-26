// API handling class
class API {
    static cache = new Map();

    static async fetchRecords() {
        const cacheKey = 'all_records';
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return cachedData;
        }

        try {
            // For now, return static data
            // In production, this would be: const response = await fetch(`${CONFIG.API_URL}/records`);
            const data = await this.getStaticData();
            this.setInCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching records:', error);
            return [];
        }
    }

    static async getRecordActions(id) {
        const cacheKey = `actions_${id}`;
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return cachedData;
        }

        try {
            // For now, return static data
            // In production: const response = await fetch(`${CONFIG.API_URL}/records/${id}/actions`);
            const data = await this.getStaticActions(id);
            this.setInCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching record actions:', error);
            return '';
        }
    }

    static async updateRecordActions(id, actions) {
        try {
            // In production: await fetch(`${CONFIG.API_URL}/records/${id}/actions`, {
            //     method: 'PUT',
            //     body: JSON.stringify({ actions }),
            //     headers: { 'Content-Type': 'application/json' }
            // });
            
            // Update cache
            this.setInCache(`actions_${id}`, actions);
            return true;
        } catch (error) {
            console.error('Error updating record actions:', error);
            return false;
        }
    }

    static getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    static setInCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Temporary static data methods
    static async getStaticData() {
        return [
            {
                id: 1,
                name: "John Doe",
                role: "Military Officer",
                section: CONFIG.SECTIONS.MILITARY,
                image: CONFIG.DEFAULT_IMAGE
            },
            // Add more static records as needed
        ];
    }

    static async getStaticActions(id) {
        const actions = {
            1: "Sample actions for record #1",
            // Add more static actions as needed
        };
        return actions[id] || '';
    }
}
