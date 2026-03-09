# web-editor Plan Document

> Version: 1.0.0 | Created: 2026-03-01 | Status: Draft

## 1. Executive Summary
HTML, CSS, Vanilla JavaScript만을 사용하여 기본적인 텍스트 편집 기능을 제공하는 웹 에디터를 구현합니다. 별도의 라이브러리 없이 브라우저의 `contentEditable` 속성과 `document.execCommand` (또는 최신 대체 방식)를 활용하여 경량화된 에디터를 제작합니다.

## 2. Goals and Objectives
- **Goal 1**: 사용자 친화적인 툴바 UI 구현 (버튼 기반 서식 적용)
- **Goal 2**: 기본적인 텍스트 서식(Bold, Italic, Underline) 기능 제공
- **Goal 3**: 텍스트 정렬(Left, Center, Right) 및 리스트(UL, OL) 기능 구현
- **Goal 4**: 실시간 편집 및 미리보기 환경 제공
- **Goal 5**: HTML 소스 직접 보기 및 편집 기능 구현 (View Source)
- **Goal 6**: 이미지 첨부 및 백엔드 저장 시뮬레이션 구현
- **Goal 7**: 표(Table) 삽입 및 행/열 동적 선택 UI(Grid Selector) 구현
- **Goal 8**: LocalStorage를 활용한 실시간 자동 저장 기능 구현
- **Goal 9**: URL 입력을 통한 링크 스크랩 박스(Link Preview) 생성 기능 구현
- **Goal 10**: YouTube URL을 활용한 동영상(Iframe) 삽입 기능 구현

## 3. Scope
### In Scope
- HTML/CSS를 활용한 에디터 레이아웃 구성
- 텍스트 서식 적용 툴바 (Bold, Italic, Underline, Strikethrough)
- 텍스트 정렬 및 목록 생성 기능
- 폰트 크기 및 색상 변경 기능
- Vanilla JavaScript 기반의 명령 처리 로직
- HTML 소스 보기 모드 전환 및 실시간 동기화
- 이미지 업로드 및 에디터 내 자동 삽입 (Mockup Backend 연동)
- 드래그 방식의 표(Table) 행/열 선택 UI (최대 10x10)
- 입력 내용 실시간 LocalStorage 저장 및 페이지 로드 시 복구
- URL 입력 시 메타 데이터 기반 스크랩 박스 자동 생성 및 삽입
- **YouTube 링크 감지 및 반응형 Iframe 임베드 변환 삽입**


### Out of Scope
- 서버 사이드 데이터 저장 및 불러오기
- 이미지 업로드 (로컬 파일 선택 제외, URL 기반은 고려 가능)
- 고급 마크다운 변환 기능
- 협업 편집 기능

## 4. Success Criteria
| Criterion | Metric | Target |
|-----------|--------|--------|
| 서식 적용 | 버튼 클릭 시 선택 영역 서식 변경 | 100% 성공 |
| UI 응답성 | 툴바 및 편집 영역 반응 속도 | < 100ms |
| 브라우저 호환성 | 주요 브라우저(Chrome, Edge, Safari) 작동 여부 | 정상 작동 |

## 5. Timeline
| Milestone | Date | Description |
|-----------|------|-------------|
| Plan | 2026-03-01 | 기능 정의 및 범위 확정 |
| Design | 2026-03-01 | UI 구조 및 스크립트 로직 설계 |
| Implementation | 2026-03-01 | HTML/CSS/JS 코드 작성 및 통합 |
| QA & Analysis | 2026-03-01 | 기능 테스트 및 갭 분석 |

## 6. Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| `execCommand` 지원 중단 | 서식 적용 기능 마비 | `Selection` 및 `Range` API를 활용한 최신 방식으로 보완 고려 |
| 스타일 충돌 | 에디터 외부 스타일이 내부 서식에 영향 | Shadow DOM 또는 명확한 CSS 스코핑 적용 |
