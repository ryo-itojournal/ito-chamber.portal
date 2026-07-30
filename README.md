# 伊東市ウェブ統合リポジトリ（ITO CITY WEB）

伊東市の4ブランド（いとうのいいもの / 地魚王国 / お菓子ぃ共和国 / ふるさと納税）に関する
静的サイトを、1リポジトリ・1公開サイトに統合したものです。ビルド不要の静的HTMLで構成しています。

## ディレクトリ構成

```
/
├── index.html        総合ハブ（事業者ポータル）
├── museum/           ITO PEOPLE MUSEUM（WebVR / A-Frame）
│   └── rooms/        iimono / jizakana / okashi / furusato の各展示室
├── instagram/        Instagram改善提案（ブランド別・事業者別）
├── furusato/         ふるさと納税 特集ページ
├── assets/
│   ├── css/          tokens.css（デザイントークン）/ base.css（共通スタイル）
│   ├── js/           共通スクリプト
│   ├── img/          画像（英数字 kebab-case で命名）
│   └── data/         brands.json（4ブランドの外部リンクを一元管理）
└── docs/             設計・移行・運用ドキュメント
```

## 統合前のリポジトリと移行先

| 旧リポジトリ | 移行先 |
| --- | --- |
| ito-chamber.portal | `/`（本リポジトリのトップページ） |
| ito_digital_museum | `/museum/` |
| ito_instagram | `/instagram/` |
| ito_furusato.proto | `/furusato/` |

## 編集ルール

1. 4ブランドのInstagram・マップ・公式サイトのURLは `assets/data/brands.json` に集約しています。
   リンクを変更するときは、このファイルだけを編集してください。
2. 色・フォント・余白は `assets/css/tokens.css` のCSS変数を使います。各ページに色コードを直接書きません。
3. 画像はHTMLに埋め込まず（base64は使わない）、`assets/img/` に置いて相対パスで参照します。
4. ファイル名は半角英数字とハイフンのみ。日本語・スペースは使いません。
5. ページ内リンクは相対パスで書きます（`https://ryo-itojournal.github.io/...` の直書きは禁止）。

## ローカル確認

```
python -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。
