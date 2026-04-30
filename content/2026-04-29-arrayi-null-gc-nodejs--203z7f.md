---
id: 203z7f9geqeby3hd
title: '"array[i++] = null; は本当に GC を促進するのか — Node.js で実測して確かめる'
url: 'https://zenn.dev/wakame_atsushi/articles/e9b754160d1469'
source: zenn
published_at: '2026-04-29T06:30:14.000Z'
collected_at: '2026-04-30T22:26:14.310Z'
summary: >-
  はじめに

  きっかけは React の内部ソースを読んでいて、こんなコードに出会ったことでした。

  // packages/react-reconciler/src/ReactFiberConcurrentUpdates.js（L65-L72, 一部抜粋
  / 日本語コメントは筆者）

  while (i < endIndex) {
    const fiber: Fiber = concurrentQueues[i];
    concurrentQueues[i++] = null; // ← これは何のため？
    const queue: ConcurrentQueue = concur...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--YxFy_qBy--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%2522array%255Bi%252B%252B%255D%2520%253D%2520null%253B%2520%25E3%2581%25AF%25E6%259C%25AC%25E5%25BD%2593%25E3%2581%25AB%2520GC%2520%25E3%2582%2592%25E4%25BF%2583%25E9%2580%25B2%25E3%2581%2599%25E3%2582%258B%25E3%2581%25AE%25E3%2581%258B%2520%25E2%2580%2594%2520Node.js%2520%25E3%2581%25A7%25E5%25AE%259F%25E6%25B8%25AC%25E3%2581%2597%25E3%2581%25A6%25E7%25A2%25BA%25E3%2581%258B%25E3%2582%2581%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2582%258F%25E3%2581%258B%25E3%2582%2581%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzI2NDI2MjM3MjguanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# "array[i++] = null; は本当に GC を促進するのか — Node.js で実測して確かめる

はじめに
きっかけは React の内部ソースを読んでいて、こんなコードに出会ったことでした。
// packages/react-reconciler/src/ReactFiberConcurrentUpdates.js（L65-L72, 一部抜粋 / 日本語コメントは筆者）
while (i < endIndex) {
  const fiber: Fiber = concurrentQueues[i];
  concurrentQueues[i++] = null; // ← これは何のため？
  const queue: ConcurrentQueue = concur...
