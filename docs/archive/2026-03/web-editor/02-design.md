# web-editor Design Document

> Version: 1.0.0 | Created: 2026-03-01 | Status: Draft

## 1. Overview
사용자가 웹 브라우저 상에서 직접 텍스트를 입력하고 서식을 지정할 수 있는 에디터의 기술적 명세입니다. 툴바 영역과 편집 영역으로 나뉘며, Vanilla JavaScript를 통해 동작을 제어합니다.

## 2. Architecture
### System Diagram
- **UI (HTML/CSS)**: 에디터 구조 정의 및 스타일링
- **Editor Logic (JavaScript)**: 툴바 명령 처리, `contentEditable` 상태 제어
- **Browser API**: `document.execCommand` 활용 (또는 `Range/Selection` API)

### Components
- **Toolbar**: 서식 버튼들, 소스보기 탭, 이미지 버튼, 표 선택 그리드, 링크 스크랩, **YouTube 버튼**
- **Editor Area**: `contenteditable="true"` 영역
- **Source Area**: HTML 편집용 `textarea` 영역
- **Command Handler**: 툴바 명령 및 **YouTube 변환 로직**, 자동 저장 로직

## 3. Data Model
### YouTube 임베드 로직
1. 'YouTube' 버튼 클릭 시 URL 입력 프롬프트 표시
2. 입력된 URL에서 `v=` 파라미터 또는 단축 URL의 ID 추출
   - 예: `watch?v=ID` -> `embed/ID`
   - 예: `youtu.be/ID` -> `embed/ID`
3. 반응형 디자인을 위해 16:9 비율의 컨테이너로 감싼 `<iframe>` 생성
4. `Selection/Range API`를 사용하여 현재 커서 위치에 삽입

### 자동 저장 (LocalStorage)
1. 에디터 영역의 `input` 또는 `keyup` 이벤트 감지
2. `editor.innerHTML`을 `localStorage.setItem('web-editor-content', content)`으로 저장
3. 페이지 로드 시 `localStorage.getItem`을 통해 내용을 복구

### State 관리
- 현재 선택된 텍스트 범위 (`Selection`)
- 서식 상태 (활성화된 버튼 표시 등)
- **에디터 모드 (Normal / Source)**

## 4. Implementation Details
### HTML Structure
```html
<div class="editor-container">
  <div class="toolbar">
    <button data-command="bold"><b>B</b></button>
    <button data-command="italic"><i>I</i></button>
    <button data-command="underline"><u>U</u></button>
    <!-- 추가 버튼들 -->
  </div>
  <div class="editor-area" contenteditable="true">
    내용을 입력하세요...
  </div>
</div>
```

### CSS Styling
- `.editor-container`: 전체 에디터 외곽선 및 패딩
- `.toolbar`: 버튼 가로 배치 및 호버 효과
- `.editor-area`: 입력 영역 높이 지정 및 기본 서식 설정

### JavaScript Logic
- `document.querySelectorAll('.toolbar button')`을 통해 이벤트 리스너 등록
- `document.execCommand(command, false, null)`을 호출하여 서식 적용
- 폰트 크기나 색상 등 인자가 필요한 경우 처리 로직 추가

## 5. UI Design
- 깔끔하고 모던한 디자인 (그레이톤 툴바, 화이트 편집 영역)
- 버튼 클릭 시 시각적 피드백 제공 (배경색 변경 등)

## 6. Test Plan
| Test Case | Expected Result |
|-----------|-----------------|
| Bold 버튼 클릭 | 선택된 텍스트가 굵게 변경됨 |
| 정렬 버튼 클릭 | 텍스트가 지정된 방향으로 정렬됨 |
| 내용 입력 | `div` 내부에 텍스트가 정상적으로 입력됨 |
| 여러 서식 중첩 | Bold와 Italic이 동시에 적용 가능함 |
