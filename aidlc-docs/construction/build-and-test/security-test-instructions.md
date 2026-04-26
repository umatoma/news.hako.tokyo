# Security Test Instructions

**Project**: news.hako.tokyo
**Stage**: CONSTRUCTION — Build and Test
**Generated**: 2026-04-26

---

## Scope

Security Baseline 拡張機能は本プロジェクトでは **無効** (Q18=B、個人利用 / 静的サイト / 認証なし) のため、本ドキュメントは **NFR-03 / U1-NFR-SEC-* / U2-NFR-* で残した最低限のセキュリティ配慮** の検証手順を記載します。

---

## 1. Secrets 漏洩スキャン (gitleaks)

### 目的
コードに API キー / パスワード / Token 等が紛れ込んでいないことを確認 (AC-09 / U1-NFR-SEC-06)

### CI での自動実行
`.github/workflows/ci.yml` の `gitleaks` ジョブが PR + main push で自動実行。

### ローカル実行 (任意)

```bash
# 1. gitleaks をインストール
brew install gitleaks    # macOS
# または: https://github.com/gitleaks/gitleaks/releases から直接 DL

# 2. リポジトリルートで実行
cd /path/to/news.hako.tokyo
gitleaks detect --source . --verbose
```

**期待**: 0 leaks detected

**検出時の対処**:
1. 該当箇所を確認 (ファイル + 行番号)
2. ハードコードされた secret を環境変数 / GitHub Actions Secrets に置き換え
3. 既にコミット済みの場合は **Git 履歴から削除** (`git filter-repo` 等) + 該当 secret を **revoke / rotate**

---

## 2. 依存脆弱性スキャン (npm audit)

### 目的
依存ライブラリの既知脆弱性を検知 (U1-NFR-SEC-05、Q6=B により警告通知のみ)

### CI での自動実行
`.github/workflows/ci.yml` の `npm-audit` ジョブが PR + main push で実行 (`continue-on-error: true`)。

### ローカル実行

```bash
cd next
npm audit --audit-level=moderate
```

**現状の警告**: 7 moderate severity vulnerabilities (Next.js 16.2.4 系統の依存ツリー)
- 動作には影響なし (Q6=B によりビルドはブロックしない)
- 上位パッケージのアップデート時に解消することが期待される

**修正したい場合**:
```bash
npm audit fix              # 互換性のある自動修正
npm audit fix --force      # major アップデート許容 (慎重に、互換性確認必要)
```

---

## 3. HTTP セキュリティ確認

### `target="_blank"` リンクの安全性 (U2-BR-12)
- E2E テスト (`e2e/home.spec.ts`) で全記事リンクに `rel="noopener noreferrer"` が付与されていることを検証
- → CI の `e2e` ジョブで自動チェック

### CSP / HSTS 等のヘッダ
- 本プロジェクトでは追加設定なし (Vercel デフォルトで TLS 1.3 + HSTS が適用される)
- Security Baseline 拡張機能無効のため、CSP / X-Frame-Options 等の独自設定は **MVP では行わない**
- 将来的に必要になった場合は `vercel.json` の `headers` で追加可能

---

## 4. シークレット管理の確認

### 現状
- 採用 4 ソース (Zenn / Hatena / Google ニュース / Togetter) は **API キー不要**
- GitHub Actions Secrets / Vercel 環境変数の **設定不要**

### 将来 API キーを追加する場合のチェック
- [ ] コード内に API キーをハードコードしていない
- [ ] `process.env.{KEY_NAME}` で参照している
- [ ] GitHub Actions / Vercel に Encrypted で登録している
- [ ] `.env.local` が `.gitignore` 済み
- [ ] CI で gitleaks が緑

---

## 5. 認証・セッション

本プロジェクトは **認証なし** (Q7=A)、セッション機能なし、入力フォームなし。SECURITY-08 / SECURITY-12 等の認証系ルールは **論理的に該当なし**。

---

## 6. SEO / プライバシー

`next/public/robots.txt` で `Disallow: /` を設定し、検索エンジンインデックスから除外 (NFR-02 / U2-NFR-SEO-01)。

```bash
# 確認
cat next/public/robots.txt
# 期待: User-agent: * / Disallow: /
```

---

## Summary

| 項目 | 検証手段 | CI gate? |
|---|---|---|
| Secrets 漏洩 | gitleaks | ✅ Gate |
| 依存脆弱性 | npm audit | ⚠️ 警告のみ |
| target=_blank rel | E2E spec | ✅ Gate |
| robots.txt | 静的ファイル確認 | (ファイル存在のみ) |
| 認証・セッション | N/A | (該当なし) |
| HTTP セキュリティヘッダ | Vercel デフォルトに依存 | (MVP 範囲外) |
