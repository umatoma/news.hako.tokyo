---
id: 1ioxwekg939flf2d
title: OWASP ZAP の finding を Rust/Axum の handler に戻して直す - じゃあ、おうちで学べる
url: 'https://syu-m-5151.hatenablog.com/entry/2026/04/23/195535'
source: hatena
published_at: '2026-04-26T01:33:01.000Z'
collected_at: '2026-04-26T11:38:41.767Z'
summary: >-
  はじめに vulnerable-app に ZAP の full scan を回すと、High finding が並びます。XSS、SQL
  Injection、Path Traversal。alert 名を眺めて、ふと気づく。これは「危険です」の一覧ではない。handler
  への差し戻し指示書だ。 OWASP ZAP を実行すると、HTML、Markdown、JSON のレポートが出ます。そこには Cross Site
  Sc...
tags: []
thumbnail_url: null
---
# OWASP ZAP の finding を Rust/Axum の handler に戻して直す - じゃあ、おうちで学べる

はじめに vulnerable-app に ZAP の full scan を回すと、High finding が並びます。XSS、SQL Injection、Path Traversal。alert 名を眺めて、ふと気づく。これは「危険です」の一覧ではない。handler への差し戻し指示書だ。 OWASP ZAP を実行すると、HTML、Markdown、JSON のレポートが出ます。そこには Cross Site Sc...
