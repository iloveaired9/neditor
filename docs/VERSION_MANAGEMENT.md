# 버전 관리 가이드 (Version Management Guide)

> **Last Updated**: 2026-03-09
> **Project**: Neditor - Modular Web Editor
> **Strategy**: Git Tag + GitHub Release

---

## 📋 개요

Neditor 프로젝트는 **Git Tag + GitHub Release** 전략으로 버전을 관리합니다. 이를 통해 특정 버전으로 쉽게 복원하고 배포 이력을 추적할 수 있습니다.

---

## 🏷️ 현재 버전

### v1.0.0 (2026-03-09)

| 항목 | 내용 |
|------|------|
| **버전** | v1.0.0 |
| **상태** | ✅ Released |
| **출시일** | 2026-03-09 |
| **Git Tag** | `v1.0.0` |
| **커밋** | `2255dc2` |
| **Design Match Rate** | 95% |
| **Goals Achieved** | 10/10 |
| **Plugin Count** | 9 |

**Tag Message:**
```
Release v1.0.0: Neditor - Modular Web Editor

## Features
- Core Neditor engine with plugin system
- 9 feature plugins
- 100% goal achievement (10/10)
- 95% design compliance
- Complete PDCA documentation
```

---

## 📚 버전 관리 전략

### Git Tag 사용 이유

✅ **장점:**
- 특정 커밋에 영구적인 버전 번호 부여
- 가볍고 빠른 버전 표시
- GitHub와 자동 동기화
- 태그 기반 복원이 간단
- Semantic Versioning 지원

❌ **단점 (Branch와 비교):**
- 여러 버전을 동시에 유지보수하기 어려움
- 핫픽스가 필요할 경우 별도 관리 필요

### Semantic Versioning 규칙

Neditor는 **Semantic Versioning** (Major.Minor.Patch) 형식을 따릅니다:

```
v{Major}.{Minor}.{Patch}

예: v1.0.0
    ↑     ↑   ↑
    |     |   └─ Patch: 버그 수정 (e.g., v1.0.1)
    |     └───── Minor: 신기능 추가 (e.g., v1.1.0)
    └─────────── Major: 호환성 깨지는 변경 (e.g., v2.0.0)
```

**버전 예시:**
- v1.0.0 → v1.0.1: 버그 수정만 포함
- v1.0.0 → v1.1.0: 새로운 기능 추가 (역호환성 유지)
- v1.0.0 → v2.0.0: 대규모 재설계 또는 API 변경

---

## 🔄 버전 복원 방법

### 방법 1: 태그로 체크아웃 (임시 확인)

**특정 버전의 코드를 확인만 하고 싶을 때:**

```bash
# v1.0.0 버전의 코드를 확인
git checkout v1.0.0

# 현재 상태 확인
git log --oneline -1
# Output: 2255dc2 step1 feat: Archive web-editor PDCA...

# 다시 main 브랜치로 돌아오기
git checkout main
```

### 방법 2: 태그 기반 새 브랜치 생성 (유지보수)

**v1.0.0 버전에서 핫픽스 또는 유지보수가 필요할 때:**

```bash
# v1.0.0을 기반으로 새 브랜치 생성
git checkout -b hotfix/v1.0.1 v1.0.0

# 버그 수정 작업...
git add .
git commit -m "fix: Critical bug in v1.0.0"

# 테스트 후 완료되면 main에 merge
git checkout main
git merge hotfix/v1.0.1

# 새 태그 생성
git tag -a v1.0.1 -m "Release v1.0.1: Hotfix for critical bug"
git push origin v1.0.1
```

### 방법 3: 특정 버전의 코드를 새로운 폴더에 내보내기

**v1.0.0의 소스코드를 백업으로 보관하고 싶을 때:**

```bash
# v1.0.0 버전 압축
git archive v1.0.0 --format=zip --output=neditor-v1.0.0.zip

# 또는 tar 형식
git archive v1.0.0 --format=tar.gz --output=neditor-v1.0.0.tar.gz

# 폴더로 추출
mkdir -p ./backups
git archive v1.0.0 | tar -x -C ./backups/v1.0.0
```

### 방법 4: 버전 간 변경사항 비교

**v1.0.0과 현재 버전 간의 차이점 확인:**

```bash
# v1.0.0 이후 변경사항 보기
git log v1.0.0..main --oneline

# v1.0.0과 현재 버전의 파일 차이
git diff v1.0.0 main -- js/plugins/
```

---

## 📦 GitHub Release 생성 방법

### 자동 Release 생성 (권장)

GitHub 웹사이트에서 자동으로 Release를 생성할 수 있습니다:

1. **GitHub 저장소 접속**
   ```
   https://github.com/iloveaired9/neditor
   ```

2. **Releases 탭 클릭**
   - 화면 오른쪽 메뉴에서 "Releases" 찾기

3. **"Draft a new release" 클릭**
   - Tag version: `v1.0.0` 선택
   - Release title: `Neditor v1.0.0 - Modular Web Editor`
   - Description: 아래 내용 입력

### Release Description 템플릿

```markdown
## 🎉 Neditor v1.0.0 Released

### What's New

#### Core Features
- ✅ Modular plugin system with 9 plugins
- ✅ Rich text editing with formatting toolbar
- ✅ Image upload and embedding
- ✅ Dynamic table creation
- ✅ YouTube video integration
- ✅ Link scraping with previews
- ✅ AI-powered text enhancement
- ✅ LocalStorage auto-save
- ✅ HTML source editing

#### Technical Highlights
- Vanilla JavaScript (no heavy dependencies)
- Event-driven architecture
- Modular plugin design
- Comprehensive PDCA documentation

### Quality Metrics
- **Design Match Rate**: 95%
- **Goals Achieved**: 10/10 (100%)
- **Plugins Implemented**: 9/9
- **Iteration Cycles**: 1 (Highly efficient)

### PDCA Cycle
- Plan → Design → Do → Check → Report → Archive
- **Timeline**: 2026-03-01 to 2026-03-09 (9 days)
- **Status**: ✅ Complete

### Documentation
- 📖 [Module Documentation](docs/00-modules/MODULES.md)
- 📊 [Completion Report](docs/04-report/web-editor.report.md)
- 🗂️ [PDCA Archive](docs/archive/2026-03/web-editor/)

### Installation & Usage
```bash
# Clone and setup
git clone https://github.com/iloveaired9/neditor
cd neditor
npm install
npm run dev
```

### Files Changed in This Release
- Core: `js/core/Neditor.js`
- Plugins: `js/plugins/*.js` (9 plugins)
- Utilities: `js/utils/*.js`
- UI: `index.html`, `style.css`
- Documentation: Complete PDCA cycle documents

### Known Issues & Limitations
- `execCommand` API deprecated (migration planned for v1.1.0)
- Shadow DOM not implemented (deferred enhancement)
- Limited cross-browser testing

### Next Steps
- API migration to Selection/Range API
- Shadow DOM implementation
- Automated test suite (unit + E2E)
- Mobile responsiveness enhancement

---

**Release Date**: 2026-03-09
**Commit**: 2255dc2
**Contributors**: Claude PDCA Agent
```

---

## 📅 버전 히스토리 및 계획

### 출시 버전

| 버전 | 날짜 | 주요 기능 | 상태 |
|------|------|---------|------|
| **v1.0.0** | 2026-03-09 | Core + 9 Plugins, PDCA Complete | ✅ Released |

### 계획된 버전

| 버전 | 예상일 | 주요 변경사항 | 우선순위 |
|------|-------|-------------|---------|
| **v1.0.1** | TBD | 버그 수정 | Critical |
| **v1.1.0** | Q2 2026 | API 마이그레이션, Shadow DOM | High |
| **v1.2.0** | Q2 2026 | 자동화 테스트 추가 | High |
| **v1.3.0** | Q2 2026 | 모바일 반응형 개선 | Medium |
| **v2.0.0** | Q3 2026 | 대규모 재설계 (예정) | Low |

---

## 🛠️ 일상적인 버전 관리 작업

### 새 기능 개발 후 마이너 버전 올리기

```bash
# 1. 기능 개발 및 테스트 완료
git add .
git commit -m "feat: Add new feature X"

# 2. 버전 번호 업데이트 (선택적)
# package.json에서 version을 "1.1.0"으로 변경

# 3. 태그 생성
git tag -a v1.1.0 -m "Release v1.1.0: New feature X"

# 4. 푸시
git push origin main
git push origin v1.1.0

# 5. GitHub에서 Release 생성
# (위 과정 참고)
```

### 버그 수정 후 패치 버전 올리기

```bash
# 1. 긴급 버그 수정 (main 브랜치)
git add .
git commit -m "fix: Critical bug in feature Y"

# 2. 패치 버전 태그
git tag -a v1.0.1 -m "Release v1.0.1: Hotfix for critical bug"
git push origin v1.0.1
```

---

## 🔐 보안 및 안정성

### 태그 보호

중요한 버전 태그는 GitHub 설정에서 보호할 수 있습니다:

1. Repository Settings → Tags
2. "Create rule" 클릭
3. Pattern: `v*.*.*`
4. "Require review" 또는 "Admin only" 선택

### Release 자동 생성 (GitHub Actions)

자동으로 Release를 생성하는 워크플로우 (선택사항):

```yaml
# .github/workflows/release.yml
name: Create Release
on:
  push:
    tags:
      - 'v*.*.*'
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
```

---

## 📚 참고 자료

### 유용한 Git 명령어

```bash
# 모든 태그 보기
git tag -l

# 특정 태그의 상세 정보 보기
git show v1.0.0

# 태그를 포함한 로그 보기
git log --oneline --decorate

# 특정 버전 이후의 커밋 확인
git log v1.0.0..HEAD --oneline
```

### GitHub CLI 사용 (선택사항)

```bash
# GitHub CLI 설치 후
gh release create v1.0.0 \
  --title "Neditor v1.0.0" \
  --notes "Release notes here" \
  --draft=false
```

---

## ✅ 체크리스트: 새 버전 출시

다음 단계를 따라 새 버전을 출시합니다:

- [ ] 1. 기능 개발 및 테스트 완료
- [ ] 2. PDCA 사이클 완료 (Plan → Design → Do → Check → Report)
- [ ] 3. 모든 변경사항 커밋
- [ ] 4. README.md 또는 CHANGELOG.md 업데이트
- [ ] 5. `package.json` 버전 번호 업데이트 (선택)
- [ ] 6. Git 태그 생성: `git tag -a v1.X.X -m "..."`
- [ ] 7. 태그 푸시: `git push origin v1.X.X`
- [ ] 8. GitHub Release 생성
- [ ] 9. Release Notes 작성
- [ ] 10. npm publish (필요시)

---

## 📞 버전 관련 문제 해결

### 태그 실수했을 경우

```bash
# 로컬 태그 삭제
git tag -d v1.0.0

# 원격 태그 삭제
git push origin --delete v1.0.0

# 다시 생성
git tag -a v1.0.0 -m "..."
git push origin v1.0.0
```

### 이전 버전으로 완전히 복구하고 싶을 경우

⚠️ **주의**: 이 작업은 현재 변경사항을 삭제합니다!

```bash
# 로컬 코드를 v1.0.0으로 리셋
git reset --hard v1.0.0

# 원격에 반영 (강제 푸시 - 주의!)
git push origin main --force
```

---

**Last Updated**: 2026-03-09
**Maintained By**: Claude PDCA Agent
**Status**: ✅ Active
