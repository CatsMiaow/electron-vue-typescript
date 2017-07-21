# electron-vue-typescript
Electron Vue.js Structure for TypeScript Example

#### Installation
```bash
$ npm install
$ cd ./app/ && npm install
```

#### Development
```bash
$ npm run dev:renderer #webpack-dev-server
$ npm run build:main
$ npm run dev:main
```

#### Build & Package
```bash
$ npm run build:renderer
$ npm run build:main
$ npm run package
```

#### Menu
```javascript
+-- View
|   +-- 홈(Home) // vue-material 정적 페이지
|   +-- 구글 // 구글 웹뷰
|   +-- 네이버 // 네이버 웹뷰
|   +-- 다음 // 다음 웹뷰
+-- Data
|   +-- Local // 로컬 저장소에 데이터 입출력
|   +-- API // 서버 저장소에 데이터 입출력
+-- Help
|   +-- 로그 폴더 열기 // winston 로그 파일
|   +-- 업데이트 확인... // API로 버전 체크
```
