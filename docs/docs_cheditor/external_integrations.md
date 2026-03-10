# CHEditor 외부 연동 및 API 명세

이 문서는 `cheditor`에서 사용하는 외부 서비스 연동 URL 및 내부 API 엔드포인트에 대한 분석 결과입니다.

## 1. 외부 서비스 연동 (External Services)

### 지도 (Maps)
- **Google Maps API**: `https://maps.google.com/maps/api/js`
    - 지도 기능을 로드하기 위한 메인 API 스크립트입니다.
- **Street View**: `https://maps.googleapis.com/maps/api/streetview`
    - 특정 위치의 스트리트 뷰 이미지를 가져오는 데 사용됩니다.
- **Static Maps**: `https://maps.google.com/maps/api/staticmap`
    - 정적인 지도 이미지를 생성하여 본문에 삽입할 때 사용됩니다.

### 동영상 임베드 (Video Embeds)
에디터 내에서 외부 동영상 플랫폼의 영상을 삽입하기 위해 다음 URL 패턴을 사용합니다:
- **YouTube**: `https://www.youtube.com/embed/`
- **Kakao TV**: `https://play-tv.kakao.com/embed/player/cliplink/`
- **Naver TV**: `https://tv.naver.com/embed/`

### 에셋 및 폰트 (Assets & CDNs)
- **뽐뿌 전용 CDN**: `//cdn3.ppomppu.co.kr/cheditor/css/SourceCodePro.woff`
- **폰트 서버 (jsDelivr)**: `//cdn.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWebLight.eot`

### 레거시 지원 (Legacy Support)
- **Adobe Flash**: `http://www.adobe.com/go/getflashplayer`
- **Adobe Knowledgebase**: `http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75`

---

## 2. 내부 API 및 경로 (Internal API & Paths)

### 링크 스크랩 (Link Scraping)
- **Endpoint**: `/ajax/ajax_get_metas.php`
- **기능**: 사용자가 URL을 붙여넣었을 때, 해당 페이지의 메타데이터(제목, 설명, 대표 이미지)를 서버 측에서 추출하여 반환합니다.
- **호출 위치**: `jquery-cheditor.js` 내 `get_meta_make_thumb` 로직.

### 이미지 업로드 (Image Upload)
- **Upload Script**: `imageUpload/upload.php`
    - 사진 업로드를 처리하는 메인 PHP 스크립트입니다. `boardId` 파라미터를 통해 게시판별 업로드 권한을 관리합니다.
- **Preview Path**: `flash/ImagePreview`
    - 업로드 전 이미지 미리보기를 처리하기 위한 경로입니다.

### 정적 자원 (Static Assets)
- **G_STATIC_URL**: 뽐뿌 사이트의 정적 자원(이미지, 공통 JS 등)이 위치한 베이스 URL입니다. 에디터 내 아이콘 및 버튼 이미지 경로의 기반이 됩니다.
- **Icon Path**: `icons/imageUpload/add.gif` 등 툴바 및 팝업용 아이콘 경로.

---

## 3. Neditor 개발 참고 사항
- **API 전환**: 기존 PHP 기반의 `/ajax/ajax_get_metas.php`를 Neditor의 Python 기반 `/api/metadata` 엔드포인트로 대체하여 구현하였습니다.
- **이미지 업로드**: 기존 `upload.php` 로직을 참고하여 Neditor의 `/api/upload`와 연동을 최적화할 필요가 있습니다.
- **지도/동영상**: 구글 지도 API 키 관리 및 동영상 iframe 삽입 정책을 현대적인 보안 표준(Sandboxing 등)에 맞게 재정의해야 합니다.
