/**
 * ApiService.js
 * Handles real API calls to the backend.
 */
export const ApiService = {
    BASE_URL: 'http://localhost:8000',

    /**
     * Upload an image file to the backend.
     * @param {File} file 
     * @returns {Promise<Object>} { url: string }
     */
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${this.BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Fetch metadata for a given URL for link scrapping.
     * @param {string} url 
     * @returns {Promise<Object>} { title, description, image, url }
     */
    async fetchMetadata(url) {
        const response = await fetch(`${this.BASE_URL}/metadata?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
            throw new Error(`Metadata fetch failed with status: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * List all uploaded files.
     * @returns {Promise<Array>} Array of file objects
     */
    async listFiles() {
        const response = await fetch(`${this.BASE_URL}/files`);
        if (!response.ok) {
            throw new Error(`Failed to list files: ${response.status}`);
        }
        return await response.json();
    },

    /**
     * Delete a specific file.
     * @param {string} filename 
     */
    async deleteFile(filename) {
        console.log(`ApiService.deleteFile called for: ${filename}`);
        const response = await fetch(`${this.BASE_URL}/files/${filename}`, {
            method: 'DELETE'
        });
        console.log(`ApiService.deleteFile response status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`Failed to delete file: ${response.status}`);
        }
        return await response.json();
    },

    /**
     * Simulated AI processing (can be replaced with real API later).
     */
    async processAiCommand(command, text) {
        // Keep this as mock for now unless backend provides it
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = {
                    summarize: "[요약] " + text.substring(0, 50) + "...",
                    fix: "[교정] " + text.replace(/ /g, " "),
                    professional: "[격식] " + text + " (정중한 표현)",
                    casual: "[일상] " + text + " (친근한 표현)"
                };
                resolve(results[command] || text);
            }, 1000);
        });
    }
};
