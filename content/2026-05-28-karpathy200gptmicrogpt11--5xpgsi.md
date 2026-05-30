---
id: 5xpgsij03eo6mhyl
title: Karpathy氏の200行GPT「microGPT」を1行1行読み解く
url: 'https://zenn.dev/karaage0703/articles/1e7106add712d1'
source: zenn
published_at: '2026-05-28T16:08:17.000Z'
collected_at: '2026-05-30T12:23:11.935Z'
summary: >-
  2026年2月にAndrej
  Karpathy（アンドレ・カーパシー）氏が公開した「microGPT」。話題になったときに触っていて、途中まで記事を書きかけにしていたの、すっかり忘れていたので今頃公開してみます。

  https://x.com/karpathy/status/2021694437152157847

  https://gist.github.com/karpathy/8627fe009c40f57531cb18360106ce95

  200行の外部ライブラリを使わない（PyTorchもNumPyもないです）で、GPTを訓練・推論するという意欲的なコードです。

  この記事では、mic...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--OjZ5PwPr--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Karpathy%25E6%25B0%258F%25E3%2581%25AE200%25E8%25A1%258CGPT%25E3%2580%258CmicroGPT%25E3%2580%258D%25E3%2582%25921%25E8%25A1%258C1%25E8%25A1%258C%25E8%25AA%25AD%25E3%2581%25BF%25E8%25A7%25A3%25E3%2581%258F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2581%258B%25E3%2582%2589%25E3%2581%2582%25E3%2581%2592%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2hDZEtvakJfZXdDTjNCV1Z0WXIteFNIZ0hmRjlXZmt3QzI5c0Y0aXYwPXMyNTAtYw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACMTiGT
---
# Karpathy氏の200行GPT「microGPT」を1行1行読み解く

2026年2月にAndrej Karpathy（アンドレ・カーパシー）氏が公開した「microGPT」。話題になったときに触っていて、途中まで記事を書きかけにしていたの、すっかり忘れていたので今頃公開してみます。
https://x.com/karpathy/status/2021694437152157847
https://gist.github.com/karpathy/8627fe009c40f57531cb18360106ce95
200行の外部ライブラリを使わない（PyTorchもNumPyもないです）で、GPTを訓練・推論するという意欲的なコードです。
この記事では、mic...
