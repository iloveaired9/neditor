/**
 * ApiMocks.js
 */
export const ApiMocks = {
    simulateImageUpload(file) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const randomId = Math.floor(Math.random() * 1000);
                resolve(`https://picsum.photos/id/${randomId}/800/600`);
            }, 1000);
        });
    },

    fetchMockScrapData(url) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    resolve({
                        url,
                        title: "다항함물을 보는 눈이 완전히 바뀔 겁니다.",
                        description: "YouTube 비디오 콘텐츠",
                        image: "https://img.youtube.com/vi/Jw8F2akj_T0/maxresdefault.jpg"
                    });
                } else if (url.includes('daum.net')) {
                    resolve({
                        url,
                        title: "휴장에 소나기 피한 코스피…아시아 증시 '패닉'은 없었다",
                        description: "중동발 지정학적 리스크 관련 뉴스",
                        image: "https://img1.daumcdn.net/thumb/S1200x630/?fname=https://t1.daumcdn.net/news/202603/02/NEWS1/20260302155737944wuoe.jpg"
                    });
                } else {
                    resolve({
                        url,
                        title: "링크 미리보기",
                        description: "설명 문구입니다.",
                        image: "https://picsum.photos/400/300"
                    });
                }
            }, 1000);
        });
    },

    processAiCommand(command, text) {
        return new Promise((resolve) => {
            setTimeout(() => {
                switch (command) {
                    case 'summarize': resolve(`[AI 요약] ${text.substring(0, 50)}...`); break;
                    case 'fix': resolve(`[AI 교정] ${text}`); break;
                    case 'professional': resolve(`${text} (Professional)`); break;
                    case 'casual': resolve(`${text} (Casual) 😊`); break;
                    default: resolve(text);
                }
            }, 1500);
        });
    }
};
