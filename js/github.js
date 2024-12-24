async function updateGitHubFile(content, personName) {
    try {
        // 기존 파일 내용 가져오기
        const response = await fetch(`https://api.github.com/repos/${config.REPO_OWNER}/${config.REPO_NAME}/contents/${config.FILE_PATH}`, {
            headers: {
                'Authorization': `token ${config.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch file content');
        }
        
        const data = await response.json();
        const currentContent = JSON.parse(atob(data.sha ? data.content : '{}'));
        
        // 새로운 내용 추가/수정
        currentContent[personName] = content;
        
        // GitHub에 업데이트
        const updateResponse = await fetch(`https://api.github.com/repos/${config.REPO_OWNER}/${config.REPO_NAME}/contents/${config.FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${config.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Update actions for ${personName}`,
                content: btoa(JSON.stringify(currentContent, null, 2)),
                sha: data.sha
            })
        });
        
        if (!updateResponse.ok) {
            throw new Error('Failed to update file');
        }
        
        return true;
    } catch (error) {
        console.error('Error updating GitHub file:', error);
        return false;
    }
}

async function loadActionsData() {
    try {
        const response = await fetch(`https://api.github.com/repos/${config.REPO_OWNER}/${config.REPO_NAME}/contents/${config.FILE_PATH}`, {
            headers: {
                'Authorization': `token ${config.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch actions data');
        }
        
        const data = await response.json();
        return JSON.parse(atob(data.content));
    } catch (error) {
        console.error('Error loading actions data:', error);
        return {};
    }
}
