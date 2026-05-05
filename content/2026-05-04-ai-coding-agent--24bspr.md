---
id: 24bsprjqnan2t1rr
title: AI coding agent を使い続けるために、自分の開発環境の権限棚卸しをした
url: 'https://zenn.dev/yamk/articles/ai-agent-permission-inventory'
source: zenn
published_at: '2026-05-04T17:43:32.000Z'
collected_at: '2026-05-05T22:27:46.009Z'
summary: >-
  Claude Code や Codex を毎日使うようになって、開発の速度はかなり上がりました。

  実装を頼む。テストを回してもらう。差分を見てもらう。commit して push して PR まで作ってもらう。

  かなり便利です。

  ただ、ふと考えるとこれは単なる補助ツールではありません。自分のローカル環境で shell を実行し、repository を書き換え、GitHub に
  push できる実行主体です。便利な相棒の顔をしていますが、鍵束を持って作業部屋に入ってきています。

  つまり、AI coding agent は「便利なチャット」ではなく、かなり強い権限を持った開発者プロセスとし...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--sPQjQxe---/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:AI%2520coding%2520agent%2520%25E3%2582%2592%25E4%25BD%25BF%25E3%2581%2584%25E7%25B6%259A%25E3%2581%2591%25E3%2582%258B%25E3%2581%259F%25E3%2582%2581%25E3%2581%25AB%25E3%2580%2581%25E8%2587%25AA%25E5%2588%2586%25E3%2581%25AE%25E9%2596%258B%25E7%2599%25BA%25E7%2592%25B0%25E5%25A2%2583%25E3%2581%25AE%25E6%25A8%25A9%25E9%2599%2590%25E6%25A3%259A%25E5%258D%25B8%25E3%2581%2597%25E3%2582%2592%25E3%2581%2597%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:yamk%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2hRcDBrUktkX05rN0p1WmtRaWQ3d252dnhMemVoSnpkSWFaWlhzZVE9czk2LWM=%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# AI coding agent を使い続けるために、自分の開発環境の権限棚卸しをした

Claude Code や Codex を毎日使うようになって、開発の速度はかなり上がりました。
実装を頼む。テストを回してもらう。差分を見てもらう。commit して push して PR まで作ってもらう。
かなり便利です。
ただ、ふと考えるとこれは単なる補助ツールではありません。自分のローカル環境で shell を実行し、repository を書き換え、GitHub に push できる実行主体です。便利な相棒の顔をしていますが、鍵束を持って作業部屋に入ってきています。
つまり、AI coding agent は「便利なチャット」ではなく、かなり強い権限を持った開発者プロセスとし...
