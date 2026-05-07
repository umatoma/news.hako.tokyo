---
id: 2a97svrnkvkue43q
title: OpenAPIという間接的な型共有をやめてoRPCを導入した話
url: 'https://zenn.dev/dress_code/articles/9040b2e3532693'
source: zenn
published_at: '2026-05-07T00:00:09.000Z'
collected_at: '2026-05-07T22:30:11.571Z'
summary: >-
  はじめに

  Dress Code 株式会社のかわうそです。

  今回は、フロントエンドとバックエンドの型共有に OpenAPI（コード生成）を使っていた構成から、oRPC を導入した話を紹介します。

  !

  この記事は「バックエンドの実装から OpenAPI スキーマを生成し、そこからフロントエンド用の型をコード生成する」という構成が前提です。OpenAPI
  自体を否定するものではなく、コントラクトファーストで OpenAPI を正として運用するアプローチなど、OpenAPI の活用方法は他にもあります。


   技術スタック
  この記事で登場する主な技術スタックです。




  レイヤー

  技術



  ...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--YfQAhb8C--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:OpenAPI%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E9%2596%2593%25E6%258E%25A5%25E7%259A%2584%25E3%2581%25AA%25E5%259E%258B%25E5%2585%25B1%25E6%259C%2589%25E3%2582%2592%25E3%2582%2584%25E3%2582%2581%25E3%2581%25A6oRPC%25E3%2582%2592%25E5%25B0%258E%25E5%2585%25A5%25E3%2581%2597%25E3%2581%259F%25E8%25A9%25B1%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:%25E3%2581%258B%25E3%2582%258F%25E3%2581%2586%25E3%2581%259D%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzRiOGMxZmU1MDUuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:DRESS%2520CODE%2520TECH%2520BLOG%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzg5OThmMTk2YzAuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# OpenAPIという間接的な型共有をやめてoRPCを導入した話

はじめに
Dress Code 株式会社のかわうそです。
今回は、フロントエンドとバックエンドの型共有に OpenAPI（コード生成）を使っていた構成から、oRPC を導入した話を紹介します。
!
この記事は「バックエンドの実装から OpenAPI スキーマを生成し、そこからフロントエンド用の型をコード生成する」という構成が前提です。OpenAPI 自体を否定するものではなく、コントラクトファーストで OpenAPI を正として運用するアプローチなど、OpenAPI の活用方法は他にもあります。


 技術スタック
この記事で登場する主な技術スタックです。



レイヤー
技術


...
