---
id: 2ij0orodnuhsnjlp
title: あなたのClaude CodeのWebFetch、実はWebをちゃんと読んでいない
url: 'https://zenn.dev/zhizhiarv/articles/claude-code-webfetch-haiku-summary'
source: zenn
published_at: '2026-05-04T10:39:09.000Z'
collected_at: '2026-05-04T22:28:12.926Z'
summary: >-
  結論

  Claude Code
  はWebFetchツールを使う多くの場合、実はWebページの原文を読んでいません。先にHaikuが読んで要約・抽出した結果だけを、あなたのOpusやSonnetが読んで実装を進めています。そして、それは非常に気づきにくい構造となっています。

  !

  この記事はClaude Codeに内蔵されているWebFetchツールの挙動についてです。以下とは異なります。



  Claude API の Web fetch ツール：API経由で利用するWeb fetch機能はClaude Codeの WebFetch
  とは別の実装です

  Claude.ai（Web版・Desk...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--CURDvLBK--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E3%2581%2582%25E3%2581%25AA%25E3%2581%259F%25E3%2581%25AEClaude%2520Code%25E3%2581%25AEWebFetch%25E3%2580%2581%25E5%25AE%259F%25E3%2581%25AFWeb%25E3%2582%2592%25E3%2581%25A1%25E3%2582%2583%25E3%2582%2593%25E3%2581%25A8%25E8%25AA%25AD%25E3%2582%2593%25E3%2581%25A7%25E3%2581%2584%25E3%2581%25AA%25E3%2581%2584%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:sherry%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzhjYjM0YThjNTEuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# あなたのClaude CodeのWebFetch、実はWebをちゃんと読んでいない

結論
Claude Code はWebFetchツールを使う多くの場合、実はWebページの原文を読んでいません。先にHaikuが読んで要約・抽出した結果だけを、あなたのOpusやSonnetが読んで実装を進めています。そして、それは非常に気づきにくい構造となっています。
!
この記事はClaude Codeに内蔵されているWebFetchツールの挙動についてです。以下とは異なります。


Claude API の Web fetch ツール：API経由で利用するWeb fetch機能はClaude Codeの WebFetch とは別の実装です
Claude.ai（Web版・Desk...
