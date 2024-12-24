let githubAPI;
let isAdmin = false;

async function init() {
    const token = config.GITHUB_TOKEN;
    githubAPI = new GitHubAPI(token);
    await loadData();
    setupEventListeners();
}

async function loadData() {
    const data = await githubAPI.getData();
    displayCriminals(data.criminals);
}

function displayCriminals(criminals) {
    const container = document.getElementById('criminals-container');
    container.innerHTML = '';

    criminals.forEach(criminal => {
        const element = document.createElement('div');
        element.className = 'criminal-card';
        element.innerHTML = `
            <h3>${criminal.name}</h3>
            <p>나이: ${criminal.age}</p>
            <p>죄목: ${criminal.crime}</p>
            ${isAdmin ? `
                <button onclick="editCriminal('${criminal.id}')">수정</button>
                <button onclick="deleteCriminal('${criminal.id}')">삭제</button>
            ` : ''}
        `;
        container.appendChild(element);
    });
}

async function login() {
    const password = prompt('관리자 비밀번호를 입력하세요:');
    if (password === 'admin123') { // 실제로는 더 안전한 인증 방식을 사용해야 합니다
        isAdmin = true;
        document.getElementById('admin-controls').style.display = 'block';
        await loadData();
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
}

async function addCriminal() {
    if (!isAdmin) return;

    const criminal = {
        id: Date.now().toString(),
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        crime: document.getElementById('crime').value
    };

    const data = await githubAPI.getData();
    data.criminals.push(criminal);
    
    const success = await githubAPI.updateData(data);
    if (success) {
        alert('추가되었습니다.');
        await loadData();
        clearForm();
    } else {
        alert('추가 실패');
    }
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('crime').value = '';
}

async function editCriminal(id) {
    if (!isAdmin) return;

    const data = await githubAPI.getData();
    const criminal = data.criminals.find(c => c.id === id);
    
    const name = prompt('이름:', criminal.name);
    const age = prompt('나이:', criminal.age);
    const crime = prompt('죄목:', criminal.crime);

    if (name && age && crime) {
        criminal.name = name;
        criminal.age = age;
        criminal.crime = crime;

        const success = await githubAPI.updateData(data);
        if (success) {
            alert('수정되었습니다.');
            await loadData();
        } else {
            alert('수정 실패');
        }
    }
}

async function deleteCriminal(id) {
    if (!isAdmin) return;

    if (confirm('정말 삭제하시겠습니까?')) {
        const data = await githubAPI.getData();
        data.criminals = data.criminals.filter(c => c.id !== id);

        const success = await githubAPI.updateData(data);
        if (success) {
            alert('삭제되었습니다.');
            await loadData();
        } else {
            alert('삭제 실패');
        }
    }
}

function setupEventListeners() {
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('add-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addCriminal();
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
