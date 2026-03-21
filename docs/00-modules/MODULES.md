# Neditor 모듈 현황 문서

> **Version**: 1.1.0 | **작성일**: 2026-03-21 | **상태**: 완료 + v1.1 Enhancement
> **Last Updated**: 2026-03-21

## 📋 개요

Neditor는 **모듈식 플러그인 아키텍처**로 설계된 현대적 웹 에디터입니다.
각 기능은 독립적인 모듈로 구현되어 있으며, 핵심 시스템과 9개의 플러그인 모듈로 구성되어 있습니다.

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                   Neditor Core                       │
│         (Plugin System, Events, Common API)          │
├─────────────────────────────────────────────────────┤
│  Plugin 1   │  Plugin 2   │  Plugin 3   │ ... │      │
│ Toolbar     │  Image      │  Table      │     │      │
├─────────────────────────────────────────────────────┤
│              Utilities (EditorUtils, ApiMocks)       │
└─────────────────────────────────────────────────────┘
```

---

## 1️⃣ 핵심 시스템 (Core)

### 📁 `js/core/Neditor.js`
**상태**: ✅ **완료**
**용도**: 에디터의 중추 시스템

| 기능 | 설명 | 구현 |
|------|------|------|
| **플러그인 관리** | `registerPlugin()` 메서드로 플러그인 동적 로드 | ✅ |
| **이벤트 시스템** | `on()`, `emit()` 으로 플러그인 간 통신 | ✅ |
| **공통 API** | `execCommand()`, `insertNode()`, `getContent()`, `setContent()` | ✅ |
| **상태 관리** | `isSourceMode`, `plugins`, `events` 등 | ✅ |

---

## 2️⃣ 플러그인 모듈 (Plugins)

### 📁 `js/plugins/ToolbarPlugin.js`
**상태**: ✅ **완료**
**용도**: 기본 텍스트 서식 및 포맷팅

| 기능 | 상세 | 구현 |
|------|------|------|
| **서식 버튼** | Bold, Italic, Underline, Strikethrough | ✅ |
| **폰트 크기** | 드롭다운으로 폰트 크기 변경 | ✅ |
| **색상 선택** | 컬러 피커로 텍스트 색상 변경 | ✅ |
| **실행 취소/재실행** | Undo/Redo 기능 | ✅ |
| **정렬 & 목록** | Left/Center/Right 정렬, UL/OL | ✅ (execCommand 기반) |

---

### 📁 `js/plugins/ImagePlugin.js`
**상태**: ✅ **완료** (v1.1.0 개선)
**용도**: 이미지 삽입 및 크기 관리

| 기능 | 상세 | 구현 |
|------|------|------|
| **파일 선택** | `<input type="file">` 으로 이미지 선택 | ✅ |
| **드래그 앤 드롭** | 이미지를 드롭존에 끌어 놓으면 자동 추가 | ✅ |
| **다중 파일** | 여러 이미지 한 번에 추가 | ✅ |
| **메타데이터 표시** | 원본 크기 (가로/세로/파일명) 표시 | ✅ |
| **개발자 모드 디버그** | DevTools 열때 변환 후 크기도 함께 표시 | ✅ v1.1+ |
| **기본 크기 설정** | 기본 이미지 리사이즈 값 설정 (original/1200/1000/800/600px) | ✅ v1.1+ |
| **임시 업로드** | ApiMocks로 업로드 시뮬레이션 | ✅ |
| **자동 삽입** | 업로드 후 `<img>` 태그 자동 삽입 | ✅ |
| **오류 처리** | 지원하지 않는 파일 형식 감지 | ✅ |

---

### 📁 `js/plugins/TablePlugin.js`
**상태**: ✅ **완료**
**용도**: 표 삽입 및 선택 UI

| 기능 | 상세 | 구현 |
|------|------|------|
| **드래그 선택** | 마우스 드래그로 행/열 선택 (최대 10x10) | ✅ |
| **표 생성** | 선택된 크기로 동적 `<table>` 생성 | ✅ |
| **스타일링** | 테이블 셀에 기본 스타일 적용 | ✅ |

---

### 📁 `js/plugins/YoutubePlugin.js`
**상태**: ✅ **완료**
**용도**: YouTube 영상 임베드

| 기능 | 상세 | 구현 |
|------|------|------|
| **URL 파싱** | `watch?v=ID` / `youtu.be/ID` 형식 지원 | ✅ |
| **Iframe 생성** | 반응형 16:9 비율 컨테이너로 감싼 iframe | ✅ |
| **삽입** | 커서 위치에 비디오 자동 삽입 | ✅ |

---

### 📁 `js/plugins/ScrapPlugin.js`
**상태**: ✅ **완료**
**용도**: 링크 스크랩 박스 생성

| 기능 | 상세 | 구현 |
|------|------|------|
| **URL 입력** | 프롬프트 창으로 URL 입력받기 | ✅ |
| **메타데이터** | ApiMocks로 제목, 설명, 이미지 시뮬레이션 | ✅ |
| **박스 생성** | 스크랩 정보를 담은 `<div>` 자동 삽입 | ✅ |

---

### 📁 `js/plugins/AiPlugin.js`
**상태**: ✅ **완료**
**용도**: AI 기반 텍스트 편집 (시뮬레이션)

| 기능 | 상세 | 구현 |
|------|------|------|
| **AI 메뉴** | Correct, Shorten, Extend, Rephrase 옵션 | ✅ |
| **텍스트 선택** | 선택한 텍스트에 AI 명령 적용 | ✅ |
| **처리 시뮬레이션** | ApiMocks로 AI 응답 시뮬레이션 | ✅ |
| **결과 삽입** | 변환된 텍스트로 원본 대체 | ✅ |

---

### 📁 `js/plugins/TabPlugin.js`
**상태**: ✅ **완료** (최근 수정)
**용도**: Source/Editor 보기 전환

| 기능 | 상세 | 구현 |
|------|------|------|
| **탭 전환** | 에디터 ↔ HTML 소스 모드 전환 | ✅ |
| **동기화** | 두 영역 간 HTML 동기화 | ✅ |
| **모드 감지** | `isSourceMode` 플래그로 상태 관리 | ✅ |

---

### 📁 `js/plugins/StoragePlugin.js`
**상태**: ✅ **완료**
**용도**: LocalStorage 자동 저장

| 기능 | 상세 | 구현 |
|------|------|------|
| **자동 저장** | 입력 시 LocalStorage에 자동 저장 | ✅ |
| **복구** | 페이지 로드 시 저장된 내용 복원 | ✅ |
| **저장 간격** | 500ms 디바운싱으로 저장 빈도 최적화 | ✅ |

---

### 📁 `js/plugins/SettingsPlugin.js`
**상태**: ✅ **완료** (v1.1.0 개선)
**용도**: 개발자 설정 및 플러그인 제어

| 기능 | 상세 | 구현 |
|------|------|------|
| **플러그인 활성화/비활성화** | 각 플러그인의 `enabled` 토글 | ✅ |
| **툴바 표시/숨김** | 플러그인 기능은 유지하되 UI만 숨김 | ✅ |
| **설정 UI** | 톱니바퀴 아이콘 클릭으로 설정 패널 열기 | ✅ |
| **개발자 모드 플래그** | Settings 모달 활성화 시 `editor.isDevMode = true` | ✅ v1.1+ |
| **플러그인 상세 설정** | 각 플러그인별로 추가 설정 가능 (예: Image 기본 크기) | ✅ v1.1+ |
| **백엔드 상태 모니터링** | 5초마다 백엔드 서버 상태 확인 (Running/Offline) | ✅ |

---

## 3️⃣ 유틸리티 모듈 (Utilities)

### 📁 `js/utils/EditorUtils.js`
**상태**: ✅ **완료**
**용도**: DOM 조작 헬퍼 함수

| 함수 | 용도 |
|------|------|
| `insertNode(element, node)` | DOM에 노드 삽입 |
| `getSelection()` | 현재 선택 텍스트 범위 취득 |
| `restoreSelection(range)` | 선택 범위 복원 |

---

### 📁 `js/utils/ApiMocks.js`
**상태**: ✅ **완료**
**용도**: 백엔드 API 시뮬레이션

| API | 반환 데이터 | 용도 |
|-----|----------|------|
| `mockImageUpload()` | 이미지 URL | 이미지 플러그인에서 업로드 시뮬레이션 |
| `mockAiProcessing()` | 처리된 텍스트 | AI 플러그인에서 변환 시뮬레이션 |
| `mockScrapMetadata()` | 제목, 설명, 이미지 | 스크랩 플러그인에서 메타 데이터 시뮬레이션 |

---

## 4️⃣ PDCA 진행도

### 📋 Plan 단계
**문서**: `docs/01-plan/features/web-editor.plan.md`
**상태**: ✅ **완료**

- ✅ 10가지 목표 정의 (Goal 1~10)
- ✅ 범위(Scope) 명확화
- ✅ 성공 기준 수립
- ✅ 위험 요소 분석

### 📐 Design 단계
**문서**: `docs/02-design/features/web-editor.design.md`
**상태**: ✅ **완료**

- ✅ 아키텍처 설계
- ✅ 컴포넌트 정의
- ✅ 데이터 모델 설계
- ✅ UI 디자인 명세

### 💻 Do 단계
**상태**: ✅ **완료**

- ✅ 모든 9개 플러그인 구현
- ✅ 코어 시스템 구현
- ✅ 유틸리티 함수 작성
- ✅ HTML/CSS 스타일링

### 🔍 Analyze 단계
**문서**: `docs/03-analysis/web-editor.analysis.md`
**상태**: ✅ **완료**

- ✅ 설계-구현 갭 분석
- ✅ 기능 검증
- ✅ 성공 기준 검토

### 📊 Report 단계
**문서**: `docs/04-report/web-editor.report.md`
**상태**: ✅ **완료**

- ✅ **Match Rate**: 95%
- ✅ **Iterations**: 1
- ✅ 주요 성과 및 교훈 정리

---

## 5️⃣ 구현 현황 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| **Core System** | ✅ 완료 | 플러그인 시스템, 이벤트, 공통 API |
| **Plugin 1-9** | ✅ 완료 | 모든 기능 플러그인 구현됨 |
| **Utils** | ✅ 완료 | DOM 헬퍼, API 시뮬레이션 |
| **HTML/CSS** | ✅ 완료 | index.html, style.css |
| **Build 설정** | ✅ 완료 | Vite 설정 완료 |
| **Documentation** | ✅ 완료 | Plan/Design/Analysis/Report |
| **PDCA Cycle** | ✅ 완료 | 4단계 모두 완료, Match Rate 95% |

---

## 6️⃣ 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| **번들러** | Vite | 빠른 개발 환경, ES Modules 기본 지원 |
| **언어** | Vanilla JavaScript | 의존성 최소화, 가볍고 빠른 성능 |
| **UI 라이브러리** | Bootstrap Icons | 툴바 아이콘 |
| **저장소** | LocalStorage | 브라우저 기본 기능, 영구 저장 |
| **상태 관리** | Custom Event System | 경량 플러그인 간 통신 |

---

## 7️⃣ 주요 특징

### ✨ 모듈식 아키텍처
- 각 기능이 독립적인 플러그인으로 구현
- 플러그인 추가/제거 시 기타 모듈에 영향 없음
- 코어 시스템과 명확하게 분리

### 🔌 플러그인 시스템
- `registerPlugin()` 으로 동적 플러그인 로드
- `enabled`, `showInToolbar` 플래그로 런타임 제어
- 이벤트 기반 플러그인 간 통신

### ⚡ 경량 & 빠름
- 외부 라이브러리 최소화 (Vite + Bootstrap Icons만 사용)
- Vanilla JavaScript로 최고 성능 보장
- LocalStorage 기반 자동 저장으로 빠른 반응

### 🎨 현대적 개발 환경
- ES Modules + Vite 번들러
- Hot Module Replacement 지원
- 간단한 빌드 및 배포 프로세스

---

## 8️⃣ 다음 단계 (Future Roadmap)

| 우선순위 | 항목 | 설명 |
|---------|------|------|
| 🔴 High | AI 백엔드 연결 | ApiMocks 대신 실제 AI API 통합 |
| 🔴 High | 서버 저장소 연결 | LocalStorage 대신 데이터베이스 연동 |
| 🟡 Medium | 협업 편집 | 실시간 동시 편집 기능 |
| 🟡 Medium | 마크다운 지원 | 텍스트 입력 시 마크다운 렌더링 |
| 🟢 Low | 플러그인 마켓플레이스 | 커뮤니티 플러그인 공유 및 설치 |

---

## 📝 파일 구조

```
neditor/
├── js/
│   ├── core/
│   │   └── Neditor.js              (핵심 시스템)
│   ├── plugins/
│   │   ├── ToolbarPlugin.js        (서식)
│   │   ├── ImagePlugin.js          (이미지)
│   │   ├── TablePlugin.js          (표)
│   │   ├── YoutubePlugin.js        (영상)
│   │   ├── ScrapPlugin.js          (스크랩)
│   │   ├── AiPlugin.js             (AI 편집)
│   │   ├── StoragePlugin.js        (자동 저장)
│   │   ├── TabPlugin.js            (보기 전환)
│   │   └── SettingsPlugin.js       (설정)
│   └── utils/
│       ├── EditorUtils.js          (DOM 헬퍼)
│       └── ApiMocks.js             (API 시뮬레이션)
├── docs/
│   ├── 01-plan/
│   │   └── features/web-editor.plan.md
│   ├── 02-design/
│   │   └── features/web-editor.design.md
│   ├── 03-analysis/
│   │   └── web-editor.analysis.md
│   ├── 04-report/
│   │   └── web-editor.report.md
│   └── 00-modules/
│       └── MODULES.md              (👈 현재 문서)
├── index.html
├── style.css
├── script.js
├── package.json
├── vite.config.js
└── README.md
```

---

## 📞 문의 및 개선

이 문서는 정기적으로 업데이트됩니다. 새로운 모듈 추가 시 해당 섹션을 업데이트하시기 바랍니다.

**마지막 업데이트**: 2026-03-21 (v1.1.0 Enhancement)
**담당자**: Neditor Development Team
**최근 변경사항**: ImagePlugin/SettingsPlugin 상세 기능 추가, 개발자 모드 디버그 정보 구현
