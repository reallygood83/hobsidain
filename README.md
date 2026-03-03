# hobsidain - Obsidian HWPX Export Plugin

옵시디언 노트를 **HWPX (한글)** 문서로 내보내는 플러그인입니다.
AI가 서식(글자크기, 볼드, 표 배경색 등)을 자동으로 결정하여 전문적인 문서를 생성합니다.

## 기능

- **Markdown → HWPX 변환**: 제목, 본문, 표, 목록, 인용문, 페이지 나누기 지원
- **AI 서식 지원**: LLM이 문서 유형에 맞는 최적의 서식을 자동 결정
- **다중 노트 내보내기**: 여러 노트를 하나의 HWPX 문서로 합칠 수 있음
- **BYOK (Bring Your Own Key)**: OpenRouter, Anthropic, OpenAI 직접 지원
- **API 키 보안**: Obsidian Secret Storage (OS 키체인)에 저장

## 설치 (BRAT)

1. Obsidian에서 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 플러그인을 설치합니다
2. BRAT 설정 → "Add Beta plugin" → `reallygood83/hobsidain` 입력
3. 플러그인 활성화 후 설정에서 API 키를 등록합니다

## 사용법

### 기본 내보내기
1. 내보내려는 마크다운 노트를 엽니다
2. 명령어 팔레트 (Ctrl/Cmd+P) → "Export to HWPX" 실행
3. `HWPX-Exports/` 폴더에 .hwpx 파일이 생성됩니다

### AI 서식 내보내기
1. 명령어 팔레트 → "AI-assisted HWPX export" 실행
2. 내보낼 노트를 선택합니다
3. AI가 문서 유형을 분석하여 최적의 서식을 적용합니다

### 다중 노트 내보내기
1. 명령어 팔레트 → "Export multiple notes to HWPX" 실행
2. 노트를 하나씩 선택 (Enter), 완료 시 Esc

## 설정

| 항목 | 기본값 | 설명 |
|------|--------|------|
| 출력 폴더 | `HWPX-Exports` | 내보낸 파일 저장 위치 |
| 기본 폰트 | 맑은 고딕 | 문서 본문 폰트 |
| 글자 크기 | 11pt | 기본 글자 크기 |
| 줄간격 | 160% | 기본 줄간격 |
| 표 헤더 색 | #2B579A | 표 머리글 배경색 |
| LLM Provider | OpenRouter | AI 서비스 선택 |
| Model | claude-sonnet-4 | 사용할 AI 모델 |

## 요구사항

- Obsidian v1.11.0 이상 (Secret Storage API)
- 데스크탑 전용

## 라이선스

Apache License 2.0
