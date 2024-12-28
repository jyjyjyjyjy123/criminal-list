// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCMN4o3bjh2tOLBs0VX4amemvthvGsWXS4",
    authDomain: "criminal-list.firebaseapp.com",
    databaseURL: "https://criminal-list-default-rtdb.firebaseio.com",
    projectId: "criminal-list",
    storageBucket: "criminal-list.appspot.com",
    messagingSenderId: "1042585776547",
    appId: "1:1042585776547:web:c5d4a4e5d8c8d5c4f8d8d5"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firebase 데이터베이스 참조
const db = firebase.database();

// 관리자 권한 체크 함수
async function checkAdminPermission(uid) {
    try {
        const snapshot = await db.ref('admins/' + uid).once('value');
        return snapshot.exists() && snapshot.val().approved === true;
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
}

// 기존 데이터 마이그레이션 함수
async function migrateExistingData() {
    try {
        // Firebase에서 기존 데이터 가져오기
        const snapshot = await db.ref('actions').once('value');
        const existingData = snapshot.val() || {};
        console.log('Existing data:', existingData);
        return existingData;
    } catch (error) {
        console.error('Migration error:', error);
        return {};
    }
}
