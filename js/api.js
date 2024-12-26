// API handling class
class API {
    static cache = new Map();
    static GITHUB_API_BASE = 'https://api.github.com';

    static async fetchRecords() {
        const cacheKey = 'all_records';
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            return cachedData;
        }

        try {
            const response = await fetch(`${this.GITHUB_API_BASE}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/data/records.json`, {
                headers: {
                    'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch records');
            }

            const fileData = await response.json();
            const content = atob(fileData.content);
            const data = JSON.parse(content);
            
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
            const response = await fetch(`${this.GITHUB_API_BASE}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/data/actions.json`, {
                headers: {
                    'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch actions');
            }

            const fileData = await response.json();
            const content = atob(fileData.content);
            const data = JSON.parse(content);
            
            this.setInCache(cacheKey, data[id]);
            return data[id] || '';
        } catch (error) {
            console.error('Error fetching record actions:', error);
            return '';
        }
    }

    static async updateRecordActions(id, actions) {
        try {
            // First, get the current file content and SHA
            const response = await fetch(`${this.GITHUB_API_BASE}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/data/actions.json`, {
                headers: {
                    'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch current actions');
            }

            const fileData = await response.json();
            const currentContent = JSON.parse(atob(fileData.content));
            
            // Update the actions for this ID
            currentContent[id] = actions;

            // Prepare the update
            const updateResponse = await fetch(`${this.GITHUB_API_BASE}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/data/actions.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    message: `Update actions for record ${id}`,
                    content: btoa(JSON.stringify(currentContent, null, 2)),
                    sha: fileData.sha
                })
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update actions');
            }

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
}
