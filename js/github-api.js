class GitHubAPI {
    constructor(token) {
        this.token = token;
        this.owner = 'jyjyjyjyjy123';
        this.repo = 'criminal-list';
    }

    async getData() {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/data/criminals.json`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const data = await response.json();
            const content = atob(data.content);
            return JSON.parse(content);
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            return { criminals: [] };
        }
    }

    async updateData(newData) {
        try {
            // 현재 파일 정보 가져오기
            const currentFile = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/data/criminals.json`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }).then(res => res.json());

            // 파일 업데이트
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/data/criminals.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: '데이터 업데이트',
                    content: btoa(JSON.stringify(newData, null, 2)),
                    sha: currentFile.sha
                })
            });

            if (!response.ok) {
                throw new Error('업데이트 실패');
            }

            return true;
        } catch (error) {
            console.error('데이터 업데이트 실패:', error);
            return false;
        }
    }
}
