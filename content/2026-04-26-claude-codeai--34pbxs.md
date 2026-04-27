---
id: 34pbxscd8l6tkd0n
title: Claude Codeと作ったAIオーケストレータを、私はなぜ使わなくなったのか
url: 'https://zenn.dev/yamk/articles/dark-part-time-job-orchestrator'
source: zenn
published_at: '2026-04-26T18:07:20.000Z'
collected_at: '2026-04-27T22:24:49.345Z'
summary: >-
  以前、私は Claude Code と一緒に dark-part-time-job というオーケストレーションシステムを作りました。

  これです。

  https://github.com/yamk12nfu/dark-part-time-job

  複数のAIエージェントを tmux
  上に並べ、親分・若頭・若衆のような役割分担で開発タスクを進めるための仕組みです。名前からしてだいぶ治安が悪いですが、やりたかったことは意外とまじめでした。

  親分がユーザーの指示を受け、若頭がタスクを分解し、若衆がそれぞれ実装します。ここで重要なのは、人間がworker一人ひとりに細かく指示を出すのではなく、タスク分...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--DJUvfZeB--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%25E3%2581%25A8%25E4%25BD%259C%25E3%2581%25A3%25E3%2581%259FAI%25E3%2582%25AA%25E3%2583%25BC%25E3%2582%25B1%25E3%2582%25B9%25E3%2583%2588%25E3%2583%25AC%25E3%2583%25BC%25E3%2582%25BF%25E3%2582%2592%25E3%2580%2581%25E7%25A7%2581%25E3%2581%25AF%25E3%2581%25AA%25E3%2581%259C%25E4%25BD%25BF%25E3%2582%258F%25E3%2581%25AA%25E3%2581%258F%25E3%2581%25AA%25E3%2581%25A3%25E3%2581%259F%25E3%2581%25AE%25E3%2581%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:yamk%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2hRcDBrUktkX05rN0p1WmtRaWQ3d252dnhMemVoSnpkSWFaWlhzZVE9czk2LWM=%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Claude Codeと作ったAIオーケストレータを、私はなぜ使わなくなったのか

以前、私は Claude Code と一緒に dark-part-time-job というオーケストレーションシステムを作りました。
これです。
https://github.com/yamk12nfu/dark-part-time-job
複数のAIエージェントを tmux 上に並べ、親分・若頭・若衆のような役割分担で開発タスクを進めるための仕組みです。名前からしてだいぶ治安が悪いですが、やりたかったことは意外とまじめでした。
親分がユーザーの指示を受け、若頭がタスクを分解し、若衆がそれぞれ実装します。ここで重要なのは、人間がworker一人ひとりに細かく指示を出すのではなく、タスク分...
