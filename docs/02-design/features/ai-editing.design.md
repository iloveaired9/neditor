# ai-editing Design Document

> Version: 1.0.0 | Created: 2026-03-01 | Status: Draft

## 1. Overview
에디터 내 선택된 텍스트를 대상으로 AI 처리를 수행하는 인터페이스와 로직을 설계합니다. 사용자는 툴바의 AI 버튼을 통해 텍스트 요약, 교정, 톤 변경 등의 작업을 즉시 수행할 수 있습니다.

## 2. Architecture
### Components
- **AI Toolbar Button**: 툴바 내 별도의 AI 아이콘 버튼.
- **AI Dropdown Menu**: 클릭 시 나타나는 AI 명령 목록 (요약, 교정, 톤 변경 등).
- **Processing Overlay**: AI 처리 중임을 나타내는 에디터 내 로딩 인디케이터.
- **AI Engine (Mock)**: 브라우저 환경에서 LLM 응답을 시뮬레이션하는 비동기 함수.

### Logic Flow
1. 사용자가 텍스트를 선택 (Selection).
2. AI 버튼 클릭 후 원하는 명령 선택.
3. 현재 선택 영역(Range)의 텍스트 추출.
4. Mock API 호출 (로딩 애니메이션 시작).
5. 결과 수신 후 선택 영역을 새로운 텍스트로 대체 (Selection/Range API 활용).
6. 작업 완료 알림 및 자동 저장.

## 3. Implementation Details
### UI Design
- **Icon**: Magic wand (`fas fa-wand-magic-sparkles`) 사용.
- **Dropdown Styles**: 현대적이고 깔끔한 팝업 메뉴 스타일링.
- **Loading**: 선택 영역 주변이나 툴바 버튼에 스피너 표시.

### AI Commands
| Command | Description | Mock Logic |
|---------|-------------|------------|
| Summarize | 텍스트 핵심 요약 | 문장의 앞부분만 추출 + "..." |
| Fix Grammar | 문법 및 오타 교정 | 특정 키워드 변환 시뮬레이션 |
| Prof. Tone | 비즈니스 문체로 변경 | "입니다/합니다" 체로 강제 변환 |
| Casual Tone | 친근한 문체로 변경 | "해요/어" 체로 강제 변환 |

## 4. Test Plan
| Test Case | Expected Result |
|-----------|-----------------|
| 텍스트 선택 없이 AI 클릭 | "텍스트를 선택해주세요" 안내 표시 |
| 요약 명령 실행 | 선택된 텍스트가 요약된 내용으로 대체됨 |
| 처리 중 툴바 비활성화 | 중복 요청 방지를 위해 버튼 잠금 처리 |
| 실행 취소 (Undo) | AI가 수정한 내용을 이전 상태로 되돌릴 수 있음 |
