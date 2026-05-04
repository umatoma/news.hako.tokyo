---
id: 5zcotla59vcekkbh
title: Claude Codeの「Skill」で、自宅GPUサーバーからAIキャラ画像を自動生成する
url: 'https://zenn.dev/miraclest/articles/claude-code-comfyui-skill-intro'
source: zenn
published_at: '2026-05-03T20:44:47.000Z'
collected_at: '2026-05-04T22:28:12.926Z'
summary: |-
  この記事は誰のためか
  以下のすべてに心当たりがある人向けです。

  自宅にGPU搭載サーバーがある（あるいは、これから組む気満々の人）
  RunPodやNano BananaなどのクラウドGPUに月額課金するのはなんか違う。自分のマシンで回したい

  Claude Codeを日常的に使っていて、「テキストだけじゃなくて画像も出せたら」と思ったことがある
  逸般の誤家庭の住人、またはその予備軍…！？

  こんな人にも対応しています：

  「GPUはあるけどComfyUIは初めて」→ 後続記事で一から整理する予定です
  「Windowsのゲーミングで十分？」→ 十分でしょう、そこからでも始められま...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--18Vfol__--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%25E3%2581%25AE%25E3%2580%258CSkill%25E3%2580%258D%25E3%2581%25A7%25E3%2580%2581%25E8%2587%25AA%25E5%25AE%2585GPU%25E3%2582%25B5%25E3%2583%25BC%25E3%2583%2590%25E3%2583%25BC%25E3%2581%258B%25E3%2582%2589AI%25E3%2582%25AD%25E3%2583%25A3%25E3%2583%25A9%25E7%2594%25BB%25E5%2583%258F%25E3%2582%2592%25E8%2587%25AA%25E5%258B%2595%25E7%2594%259F%25E6%2588%2590%25E3%2581%2599%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:Miraclest%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyL2MxMmNiZGM4NjIuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Claude Codeの「Skill」で、自宅GPUサーバーからAIキャラ画像を自動生成する

この記事は誰のためか
以下のすべてに心当たりがある人向けです。

自宅にGPU搭載サーバーがある（あるいは、これから組む気満々の人）
RunPodやNano BananaなどのクラウドGPUに月額課金するのはなんか違う。自分のマシンで回したい

Claude Codeを日常的に使っていて、「テキストだけじゃなくて画像も出せたら」と思ったことがある
逸般の誤家庭の住人、またはその予備軍…！？

こんな人にも対応しています：

「GPUはあるけどComfyUIは初めて」→ 後続記事で一から整理する予定です
「Windowsのゲーミングで十分？」→ 十分でしょう、そこからでも始められま...
