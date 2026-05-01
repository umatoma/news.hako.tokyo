---
id: 5hj87eql12mxp07r
title: 宣言的スキーマ管理ツール pistachio を作成しました
url: 'https://zenn.dev/kanmu_dev/articles/16789ef1f4283a'
source: zenn
published_at: '2026-04-30T03:52:05.000Z'
collected_at: '2026-05-01T22:24:05.089Z'
summary: |-
  プラットフォームチームの菅原です。
  最近、pistachioという宣言的スキーマ管理ツールを作成し[1]、本番環境のDBマイグレーションに導入したので紹介させてください。

   pistachioについて
  https://github.com/winebarrel/pistachio
  「宣言的スキーマ管理」はTerraformのように「あるべきスキーマの状態」を記述し、差分を埋めるDDLを実行することでDBマイグレーションを行う方法です。
  同様のツールとしてはatlasやsqldef、拙作ですがRidgepole、最近のものだとpgschemaなどがあります。
  pistachioはPost...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--ogsDuajU--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E5%25AE%25A3%25E8%25A8%2580%25E7%259A%2584%25E3%2582%25B9%25E3%2582%25AD%25E3%2583%25BC%25E3%2583%259E%25E7%25AE%25A1%25E7%2590%2586%25E3%2583%2584%25E3%2583%25BC%25E3%2583%25AB%2520pistachio%2520%25E3%2582%2592%25E4%25BD%259C%25E6%2588%2590%25E3%2581%2597%25E3%2581%25BE%25E3%2581%2597%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_34:Genki%2520Sugawara%2Cx_220%2Cy_108/bo_3px_solid_rgb:d6e3ed%2Cg_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2U5ODcxNzk5NzMuanBlZw==%2Cr_20%2Cw_90%2Cx_92%2Cy_102/co_rgb:6e7b85%2Cg_south_west%2Cl_text:notosansjp-medium.otf_30:%25E6%25A0%25AA%25E5%25BC%258F%25E4%25BC%259A%25E7%25A4%25BE%25E3%2582%25AB%25E3%2583%25B3%25E3%2583%25A0%2Cx_220%2Cy_160/bo_4px_solid_white%2Cg_south_west%2Ch_50%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2h2bTMxTW9lSlNVVDY3MnBFN044VS1ueTE4dVFnTGFRT2toTEQ0PXM5Ni1j%2Cr_max%2Cw_50%2Cx_139%2Cy_84/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 宣言的スキーマ管理ツール pistachio を作成しました

プラットフォームチームの菅原です。
最近、pistachioという宣言的スキーマ管理ツールを作成し[1]、本番環境のDBマイグレーションに導入したので紹介させてください。

 pistachioについて
https://github.com/winebarrel/pistachio
「宣言的スキーマ管理」はTerraformのように「あるべきスキーマの状態」を記述し、差分を埋めるDDLを実行することでDBマイグレーションを行う方法です。
同様のツールとしてはatlasやsqldef、拙作ですがRidgepole、最近のものだとpgschemaなどがあります。
pistachioはPost...
