# Neditor: Modular ES Edition

Neditor는 현대적인 웹 개발 환경에 맞춰 **Vite**와 **ES Modules**를 기반으로 재설계된 고기능 웹 에디터입니다.  
`teditor`와 유사한 플러그인 기반 아키텍처를 채택하여 각 기능을 독립적으로 관리하고 확장할 수 있습니다.

---

## 🏗 아키텍처 (Architecture)

### 1. Core System (`js/core/Neditor.js`)
에디터의 심장부로, 다음과 같은 역할을 수행합니다:
- **플러그인 등록 및 관리**: `registerPlugin` 메서드를 통해 기능을 동적으로 로드합니다.
- **이벤트 시스템**: `on`, `emit`을 통한 플러그인 간 통신 및 상태 변화 감지.
- **공통 API**: 선택 영역 제어, 노드 삽입, 커맨드 실행 등 상위 기능을 캡슐화하여 제공합니다.

### 2. Plugin System (`js/plugins/`)
모든 기능은 독립적인 클래스로 구현되어 있습니다:
- **기본 포맷팅**: `ToolbarPlugin`
- **콘텐츠 삽입**: `ImagePlugin`, `TablePlugin`, `YoutubePlugin`, `ScrapPlugin`
- **고급 기능**: `AiPlugin` (AI 기반 텍스트 편집), `StoragePlugin` (로컬 자동 저장), `TabPlugin` (Source/Editor 보기 전환)
- **개발자 도구**: `SettingsPlugin` (플러그인 활성화 및 툴바 가시성 제어)

### 3. Utility & API (`js/utils/`)
- `EditorUtils.js`: DOM 조작 및 데이터 추출 헬퍼 함수.
- `ApiMocks.js`: 실제 서버 연동 전 시뮬레이션을 위한 가상 API 모음.

---

---

## 🚀 실행 방법 (Execution Guide)

### 1. 한 번에 실행하기 (Unified Startup)
프론트엔드(Vite)와 백엔드(FastAPI)를 동시에 실행하려면 다음 명령어를 사용하세요:
```bash
npm run start:all
```
또는 Windows 사용자라면 루트 폴더의 `run_all.bat` 파일을 더블 클릭하여 간편하게 시작할 수 있습니다.

### 2. 개별 실행 방법
#### 의존성 설치
```bash
npm install
pip install -r backend/requirements.txt
```

#### 프론트엔드 시작 (Dev Mode)
```bash
npm run dev
```

#### 백엔드 시작
```bash
npm run backend
```

### 3. 프로덕션 빌드 (Build)
최적화된 정적 자산(Static Assets)을 생성합니다.
```bash
npm run build
```
결과물은 `./dist` 폴더에 생성됩니다.

### 4. 빌드 결과물 미리보기
```bash
npm run preview
```

---

## ⚙️ 개발자 설정 및 관리

에디터 상단 툴바의 **톱니바퀴 아이콘(⚙️)**을 통해 실시간으로 에디터 환경을 제어할 수 있습니다:
- **Enable**: 특정 플러그인의 로직을 완전히 켜거나 끌 수 있습니다.
- **Show in Toolbar**: 기능은 유지하되, 툴바에서 아이콘만 숨겨 UI를 간결하게 만듭니다.

---

## 📂 디렉토리 구조
```text
neditor/
├── dist/                # 빌드 결과물
├── js/
│   ├── core/            # 에디터 코어 클래스 (Neditor.js)
│   ├── plugins/         # 각 기능별 플러그인 모듈
│   └── utils/           # 공통 유틸리티 및 API Mocks
├── index.html           # 메인 페이지 및 UI 구조
├── style.css            # 에디터 및 플러그인 전체 스타일
├── script.js            # 메인 엔트리 (초기화 및 플러그인 등록)
├── vite.config.js       # Vite 설정 파일
└── package.json         # 의존성 및 스크립트 정보
```
