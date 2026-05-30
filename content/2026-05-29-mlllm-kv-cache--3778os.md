---
id: 3778os5w54zopdyp
title: MLエンジニアのための本質から理解するLLM推論 KV cache編
url: 'https://zenn.dev/kaz20/articles/c77f8a41cf2bf5'
source: zenn
published_at: '2026-05-29T13:53:59.000Z'
collected_at: '2026-05-30T12:23:11.935Z'
summary: >-
  はじめに

  東京科学大学 博士課程の藤井です。本記事では、LLM推論において非常に重要な役割を果たすKV cacheについてより深く理解するために 「Key,
  ValueだけcacheしてQueryをcacheしないのはなぜか？」
  という問いに皆さんが正確に答えられるようになることを目指して解説を行います。なお本記事では、「KV cacheとは何か？」や、KV
  cacheの低精度化などについては取り扱いません。関連する内容については、私が執筆している「MLエンジニアのための本質から理解するxxx」シリーズの記事を参照ください。執筆が完了した記事から順に公開していますので時期によっては、...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--OLR_42ro--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:ML%25E3%2582%25A8%25E3%2583%25B3%25E3%2582%25B8%25E3%2583%258B%25E3%2582%25A2%25E3%2581%25AE%25E3%2581%259F%25E3%2582%2581%25E3%2581%25AE%25E6%259C%25AC%25E8%25B3%25AA%25E3%2581%258B%25E3%2582%2589%25E7%2590%2586%25E8%25A7%25A3%25E3%2581%2599%25E3%2582%258BLLM%25E6%258E%25A8%25E8%25AB%2596%2520KV%2520cache%25E7%25B7%25A8%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:Kazuki%2520Fujii%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzE4NTI2ZGY5MjUuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACMTiGT
---
# MLエンジニアのための本質から理解するLLM推論 KV cache編

はじめに
東京科学大学 博士課程の藤井です。本記事では、LLM推論において非常に重要な役割を果たすKV cacheについてより深く理解するために 「Key, ValueだけcacheしてQueryをcacheしないのはなぜか？」 という問いに皆さんが正確に答えられるようになることを目指して解説を行います。なお本記事では、「KV cacheとは何か？」や、KV cacheの低精度化などについては取り扱いません。関連する内容については、私が執筆している「MLエンジニアのための本質から理解するxxx」シリーズの記事を参照ください。執筆が完了した記事から順に公開していますので時期によっては、...
