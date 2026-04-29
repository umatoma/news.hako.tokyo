---
id: 5p6cenzsnfsav0er
title: Claude Codeのルーチン機能で定期的にパフォーマンスチューニングをさせている
url: 'https://zenn.dev/yamadashy/articles/claude-code-routines-perf-tuning'
source: zenn
published_at: '2026-04-28T02:16:45.000Z'
collected_at: '2026-04-29T03:19:11.036Z'
summary: >-
  Claude Codeのルーチン（Routines）機能を、何に使うのが良いのかしばらく考えていました。

  クラウド上でプロンプトを定期実行できる便利な機能なのですが、定期的に動かして意味のあるタスクは何だろう、と。

  たどり着いたのが、パフォーマンスチューニングです。

  「速くなったか」は数値で判断できるので、ベンチマーク基盤さえあれば、あとはAIに任せられます。

  機能としてデグレしていないかもテストが充実していれば自動で確認できますし、ブランチを切って進めるので本流には影響しません。設計の創造性があまり要らないのもAIに任せやすいところですね。

  私が開発しているRepomixというCLIで...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--RnCO_FbC--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Claude%2520Code%25E3%2581%25AE%25E3%2583%25AB%25E3%2583%25BC%25E3%2583%2581%25E3%2583%25B3%25E6%25A9%259F%25E8%2583%25BD%25E3%2581%25A7%25E5%25AE%259A%25E6%259C%259F%25E7%259A%2584%25E3%2581%25AB%25E3%2583%2591%25E3%2583%2595%25E3%2582%25A9%25E3%2583%25BC%25E3%2583%259E%25E3%2583%25B3%25E3%2582%25B9%25E3%2583%2581%25E3%2583%25A5%25E3%2583%25BC%25E3%2583%258B%25E3%2583%25B3%25E3%2582%25B0%25E3%2582%2592%25E3%2581%2595%25E3%2581%259B%25E3%2581%25A6%25E3%2581%2584%25E3%2582%258B%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:yamadashy%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzU5NWQwZDY3ZjkuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Claude Codeのルーチン機能で定期的にパフォーマンスチューニングをさせている

Claude Codeのルーチン（Routines）機能を、何に使うのが良いのかしばらく考えていました。
クラウド上でプロンプトを定期実行できる便利な機能なのですが、定期的に動かして意味のあるタスクは何だろう、と。
たどり着いたのが、パフォーマンスチューニングです。
「速くなったか」は数値で判断できるので、ベンチマーク基盤さえあれば、あとはAIに任せられます。
機能としてデグレしていないかもテストが充実していれば自動で確認できますし、ブランチを切って進めるので本流には影響しません。設計の創造性があまり要らないのもAIに任せやすいところですね。
私が開発しているRepomixというCLIで...
