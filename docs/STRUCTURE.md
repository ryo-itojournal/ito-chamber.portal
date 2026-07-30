# 構成と移行メモ

4つのリポジトリを1つに統合した際の対応表と、残っている作業をまとめています。

## 1. 移行対応表

| 旧リポジトリ / パス | 新パス |
| --- | --- |
| ito-chamber.portal `/index.html` | `/index.html`（総合ハブとして全面改稿） |
| ito_digital_museum `/index.html` | `/museum/index.html` |
| ito_digital_museum `/iimono/index.html` | `/museum/rooms/iimono/index.html` |
| ito_digital_museum `/jizakana/index.html` | `/museum/rooms/jizakana/index.html` |
| ito_digital_museum `/okashi/index.html` | `/museum/rooms/okashi/index.html` |
| ito_digital_museum `/furusato/index.html` | `/museum/rooms/furusato/index.html` |
| ito_instagram `/index.html` | `/instagram/index.html` |
| ito_instagram `/group/<brand>/…` | `/instagram/<brand>/…`（group階層を削除） |
| ito_furusato.proto `/index.html` `/style.css` | `/furusato/index.html` `/furusato/style.css` |

## 2. 移行時に行った内部改良

- 4ブランドの外部リンク（Instagram・マップ・公式サイト・楽天）を `assets/data/brands.json` に集約。
  従来は3リポジトリに同じURLが重複しており、片方だけ古くなる状態でした。
- 色・書体・余白を `assets/css/tokens.css` に、共通コンポーネントを `assets/css/base.css` に切り出し。
- `ito_instagram` にあった `https://ryo-itojournal.github.io/...` の絶対URL直書きを、すべて相対パスに変更。
- 各ページに `description` とOGPを追加（従来はほぼ未設定）。
- 外部リンクの `target="_blank"` に `rel="noopener noreferrer"` を追加。
- 展示室（WebVR）に「戻る」導線がなかったため、左上に固定リンクを追加。
- Googleマップのリンクを編集用URL（`/maps/d/u/0/edit`）から閲覧用URL（`/maps/d/viewer`）に変更。
  ※編集用URLを公開ページに置くのは意図しない編集を招くおそれがあるため。
  公開設定によっては表示されない場合があるので、実際の表示を確認してください。

## 3. 残っている手作業（画像・大容量ファイル）

GitHubのWeb画面ではテキストファイルしか作成できないため、画像などのバイナリは手動での移設が必要です。

### 3-1. 画像の移設（ito_digital_museum から）

`assets/img/museum/` を作成し、次の名前で配置してください（日本語・スペースを含む名前は廃止）。

| 旧ファイル名 | 新ファイル名 |
| --- | --- |
| `ban_itobrand.jpg` | `assets/img/museum/photo-iimono.jpg` |
| `ban_jizakana.jpg` | `assets/img/museum/photo-jizakana.jpg` |
| `ban_okashi.jpg` | `assets/img/museum/photo-okashi.jpg` |
| `ChatGPT Image 2026年6月17日 13_29_35.png` | `assets/img/museum/photo-furusato.png` |
| `images.jpg` | `assets/img/museum/icon-instagram.jpg` |
| `ダウンロード.jpg` | `assets/img/museum/icon-map.jpg` |

`photo-furusato.png` は約2.1MBあります。WebPまたは長辺1600px程度のJPEGに変換してから配置すると、
表示速度が大きく改善します。

### 3-2. jupiter.html の移設

`ito_instagram/group/jizakana/jupiter.html` は約1.7MBあり、原因は画像のbase64埋め込みです。
次の手順で `instagram/jizakana/jupiter.html` として移設してください。

1. base64で埋め込まれている画像を書き出し、`assets/img/instagram/` に配置する
2. HTML内の `data:image/...;base64,...` を、配置した画像への相対パスに置き換える
3. 他ページと同様に、絶対URLを相対パスへ、`target="_blank"` に `rel="noopener noreferrer"` を追加する

これによりHTMLは10KB前後になります。移設が終わるまで `instagram/jizakana/index.html` からの
リンクは404になります。

## 4. 今後の改良候補

- `furusato/style.css` の配色を `tokens.css` のトークンへ統合する（現状は独自の青系パレットを維持）
- 展示室（A-Frame）の2Dフォールバックページを用意し、低スペック端末でも内容を見られるようにする
- `favicon`・OGP画像・`sitemap.xml`・`404.html` の追加
- 事業者ページのテンプレート共通化（現在は1事業者1HTMLで構造が重複）
- 旧4リポジトリはアーカイブ化し、READMEに移転先を明記する
