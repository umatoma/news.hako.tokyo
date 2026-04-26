# API Documentation

## REST APIs

現時点では、Next.js Route Handlers (`app/api/**/route.ts`) や Server Actions は **未定義** です。HTTP で公開されるエンドポイントは Next.js が自動的に提供するルートページ `/` のみです。

### `GET /`
- **Method**: GET
- **Path**: `/`
- **Purpose**: スキャフォールドのランディングページを返す。
- **Request**: なし
- **Response**: HTML (Next.js デフォルトテンプレート)

## Internal APIs

ドメイン固有の内部 API・公開関数は未定義です。

### `RootLayout({ children })` (`next/app/layout.tsx`)
- **Methods**: デフォルトエクスポートの React Server Component。
- **Parameters**:
  - `children: React.ReactNode` — レイアウト内に描画される子ノード。
- **Return Types**: `JSX.Element`

### `Home()` (`next/app/page.tsx`)
- **Methods**: デフォルトエクスポートの React Server Component。
- **Parameters**: なし
- **Return Types**: `JSX.Element`

## Data Models

ドメインデータモデルは未定義です。
