---
id: 3t9nkujwic9oqk12
title: 'C#: 一度しか呼ばれないActionを自動でプールする'
url: 'https://zenn.dev/ruccho/articles/csharp-pooled-actions'
source: zenn
published_at: '2026-04-26T22:49:39.000Z'
collected_at: '2026-04-27T22:24:49.345Z'
summary: >-
  今回は C# のクロージャアロケーションを潰すときの頻出テクニックを紹介します。

   デリゲートのメモリ確保
  ラムダ式を使って Action や Func
  を作成する際、外部の変数にアクセスすると、その変数をキャプチャするためのクロージャがヒープに作成されます。これは GC
  対象のヒープアロケーションになるため、頻繁に実行されるコードパスでは GC プレッシャーが増し、パフォーマンスに影響を与える可能性があります。

  https://qiita.com/ruccho_vector/items/f6abd88ae8c3724fd2e6

  void M(int a)

  {
      Action a...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--UrS-QxDX--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:C%2523%253A%2520%25E4%25B8%2580%25E5%25BA%25A6%25E3%2581%2597%25E3%2581%258B%25E5%2591%25BC%25E3%2581%25B0%25E3%2582%258C%25E3%2581%25AA%25E3%2581%2584Action%25E3%2582%2592%25E8%2587%25AA%25E5%258B%2595%25E3%2581%25A7%25E3%2583%2597%25E3%2583%25BC%25E3%2583%25AB%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:ruccho%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzgzODFiODMwMjIuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# C#: 一度しか呼ばれないActionを自動でプールする

今回は C# のクロージャアロケーションを潰すときの頻出テクニックを紹介します。

 デリゲートのメモリ確保
ラムダ式を使って Action や Func を作成する際、外部の変数にアクセスすると、その変数をキャプチャするためのクロージャがヒープに作成されます。これは GC 対象のヒープアロケーションになるため、頻繁に実行されるコードパスでは GC プレッシャーが増し、パフォーマンスに影響を与える可能性があります。
https://qiita.com/ruccho_vector/items/f6abd88ae8c3724fd2e6
void M(int a)
{
    Action a...
