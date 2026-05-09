---
id: 3sgcehplwj1bg95g
title: Expo SDK 56ベータから読み解く、Expo・React Nativeの「ネイティブ志向」な進化
url: 'https://zenn.dev/tellernovel_inc/articles/fe4f4964b4f9e3'
source: zenn
published_at: '2026-05-08T07:03:33.000Z'
collected_at: '2026-05-09T22:22:03.353Z'
summary: >-
  こんにちは！テラーノベルでiOS/Android/Webとフロントエンド周りを担当している @kazutoyo です！

  5月6日にExpo SDK 56のベータが公開されました。

  https://expo.dev/changelog/sdk-56-beta

  毎回のSDKリリースを追いかけていますが、今回のSDK
  56は「ネイティブらしく振る舞うために準備してきたものが、いよいよ揃ってきた」という印象を強く受けました。

  例えば1年以上磨かれてきたExpo UIがついに安定版になり、expo-modules-coreはコンパイラレベルで書き直されて大幅に高速化されました。

  Expo Rout...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--_QAftYK2--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Expo%2520SDK%252056%25E3%2583%2599%25E3%2583%25BC%25E3%2582%25BF%25E3%2581%258B%25E3%2582%2589%25E8%25AA%25AD%25E3%2581%25BF%25E8%25A7%25A3%25E3%2581%258F%25E3%2580%2581Expo%25E3%2583%25BBReact%2520Native%25E3%2581%25AE%25E3%2580%258C%25E3%2583%258D%25E3%2582%25A4%25E3%2583%2586%25E3%2582%25A3%25E3%2583%2596%25E5%25BF%2597%25E5%2590%2591%25E3%2580%258D%25E3%2581%25AA%25E9%2580%25B2%25E5%258C%2596%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:kazutoyo%2540TellerNovel%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2Y2ZDBjOWE0YTEuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E3%2583%2586%25E3%2583%25A9%25E3%2583%25BC%25E3%2583%258E%25E3%2583%2599%25E3%2583%25AB%2520%25E3%2583%2586%25E3%2583%2583%25E3%2582%25AF%25E3%2583%2596%25E3%2583%25AD%25E3%2582%25B0%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzQ0OTFkZTE3MjUuanBlZw==%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Expo SDK 56ベータから読み解く、Expo・React Nativeの「ネイティブ志向」な進化

こんにちは！テラーノベルでiOS/Android/Webとフロントエンド周りを担当している @kazutoyo です！
5月6日にExpo SDK 56のベータが公開されました。
https://expo.dev/changelog/sdk-56-beta
毎回のSDKリリースを追いかけていますが、今回のSDK 56は「ネイティブらしく振る舞うために準備してきたものが、いよいよ揃ってきた」という印象を強く受けました。
例えば1年以上磨かれてきたExpo UIがついに安定版になり、expo-modules-coreはコンパイラレベルで書き直されて大幅に高速化されました。
Expo Rout...
