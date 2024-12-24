class GitHubAPI {
    constructor(token) {
        this.token = token;
        this.owner = 'jyjyjyjyjy123';
        this.repo = 'criminal-list';
    }

    async updatePeople(people) {
        try {
            // 현재 파일 정보 가져오기
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/js/data.js`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // 파일이 없으면 새로 생성
                    await this.createFile(people);
                    return true;
                }
                throw new Error('Failed to get file');
            }

            const data = await response.json();
            
            // 파일 업데이트
            const content = `const people = ${JSON.stringify(people, null, 2)};`;
            const updateResponse = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/js/data.js`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: '데이터 업데이트',
                    content: btoa(content),
                    sha: data.sha
                })
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update file');
            }

            return true;
        } catch (error) {
            console.error('데이터 업데이트 실패:', error);
            return false;
        }
    }

    async createFile(people) {
        try {
            const content = `const people = ${JSON.stringify(people, null, 2)};`;
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/js/data.js`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: '초기 데이터 생성',
                    content: btoa(content)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create file');
            }

            return true;
        } catch (error) {
            console.error('파일 생성 실패:', error);
            return false;
        }
    }
}
