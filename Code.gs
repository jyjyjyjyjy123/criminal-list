// 스프레드시트 ID를 상수로 정의
const SPREADSHEET_ID = '1Z-VB2TD7rK5dLoaswoB4w753g_8MlmejSZ5bDb890io';

function getSheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  } catch (error) {
    console.error('스프레드시트 열기 실패:', error);
    throw new Error('스프레드시트에 접근할 수 없습니다.');
  }
}

function doGet(e) {
  try {
    return ContentService.createTextOutput(JSON.stringify(getActions()))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const params = e.parameter;
    const name = params.name;
    const actions = params.actions;
    
    if (!name || !actions) {
      throw new Error('이름과 행적을 모두 입력해주세요.');
    }
    
    const result = updateActions(name, actions);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getActions() {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const actions = {};
    
    // 첫 번째 행은 헤더이므로 건너뜀
    for (let i = 1; i < data.length; i++) {
      const name = data[i][0];
      const action = data[i][1];
      if (name) actions[name] = action;
    }
    
    return { success: true, data: actions };
  } catch (error) {
    console.error('행적 가져오기 실패:', error);
    throw error;
  }
}

function updateActions(name, actions) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    // 이름이 있는 행 찾기
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === name) {
        rowIndex = i + 1;
        break;
      }
    }
    
    // 새 행 추가 또는 기존 행 업데이트
    if (rowIndex === -1) {
      sheet.appendRow([name, actions]);
    } else {
      sheet.getRange(rowIndex, 2).setValue(actions);
    }
    
    return { success: true, message: '행적이 성공적으로 저장되었습니다.' };
  } catch (error) {
    console.error('행적 업데이트 실패:', error);
    throw error;
  }
}
