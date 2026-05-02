---
id: 5f7tmfii8mt0xm6u
title: DGX Sparkに xrdp + Tailscale でリモートデスクトップ環境を構築する
url: 'https://zenn.dev/karaage0703/articles/ad960088e1b94f'
source: zenn
published_at: '2026-05-01T09:33:54.000Z'
collected_at: '2026-05-02T22:19:46.960Z'
summary: >-
  NVIDIA DGX Sparkに対してリモートデスクトップで接続したいと考えました。ローカルLAN
  内だけでなく、外出先からもGUIで操作できる環境がほしいという動機です。

  そこで本記事では、ARM64でも動作するxrdpとTailscaleを組み合わせて、ローカル
  LAN・外部の両方からアクセスできるリモートデスクトップ環境を構築する手順を紹介します。

   環境
  実際に確認した DGX Spark の環境は以下のとおりです。

  $ lsb_release -a

  Distributor ID: Ubuntu

  Description:    Ubuntu 24.04.3 LTS

  Relea...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--XtMpD4j8--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:DGX%2520Spark%25E3%2581%25AB%2520xrdp%2520%252B%2520Tailscale%2520%25E3%2581%25A7%25E3%2583%25AA%25E3%2583%25A2%25E3%2583%25BC%25E3%2583%2588%25E3%2583%2587%25E3%2582%25B9%25E3%2582%25AF%25E3%2583%2588%25E3%2583%2583%25E3%2583%2597%25E7%2592%25B0%25E5%25A2%2583%25E3%2582%2592%25E6%25A7%258B%25E7%25AF%2589%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2581%258B%25E3%2582%2589%25E3%2581%2582%25E3%2581%2592%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2hDZEtvakJfZXdDTjNCV1Z0WXIteFNIZ0hmRjlXZmt3QzI5c0Y0aXYwPXMyNTAtYw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# DGX Sparkに xrdp + Tailscale でリモートデスクトップ環境を構築する

NVIDIA DGX Sparkに対してリモートデスクトップで接続したいと考えました。ローカルLAN 内だけでなく、外出先からもGUIで操作できる環境がほしいという動機です。
そこで本記事では、ARM64でも動作するxrdpとTailscaleを組み合わせて、ローカル LAN・外部の両方からアクセスできるリモートデスクトップ環境を構築する手順を紹介します。

 環境
実際に確認した DGX Spark の環境は以下のとおりです。
$ lsb_release -a
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.3 LTS
Relea...
