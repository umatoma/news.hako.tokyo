---
id: ojj7emfm5a3257c1
title: ルールベースでファイルや URL を届ける Rust 製ディスパッチャ todoke を作った
url: 'https://zenn.dev/yukimemi/articles/2026-04-25-todoke'
source: zenn
published_at: '2026-04-25T16:10:58.000Z'
collected_at: '2026-04-26T12:53:12.690Z'
summary: >-
  自作のファイル・URL ディスパッチャ todoke (届け) を Claude Code と一緒に作りました。Rust
  製で、入力された引数（ファイルパス・URL・任意の文字列）を TOML で書いたルールに照らして、対応するエディタ・ブラウザ・スクリプトに引き渡す CLI
  です。名前のとおり、引数を然るべき相手に**「届け」**ます。

  ちなみに、漫画『君に届け』が好きです。

  https://github.com/yukimemi/todoke

   なぜ作ったのか
  きっかけは Neovim を $EDITOR にしたときの、ちょっとした困りごとが積み重なっていたことです。



  git...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--5SRdJe8s--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E3%2583%25AB%25E3%2583%25BC%25E3%2583%25AB%25E3%2583%2599%25E3%2583%25BC%25E3%2582%25B9%25E3%2581%25A7%25E3%2583%2595%25E3%2582%25A1%25E3%2582%25A4%25E3%2583%25AB%25E3%2582%2584%2520URL%2520%25E3%2582%2592%25E5%25B1%258A%25E3%2581%2591%25E3%2582%258B%2520Rust%2520%25E8%25A3%25BD%25E3%2583%2587%25E3%2582%25A3%25E3%2582%25B9%25E3%2583%2591%25E3%2583%2583%25E3%2583%2581%25E3%2583%25A3%2520todoke%2520%25E3%2582%2592%25E4%25BD%259C%25E3%2581%25A3%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:yukimemi%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2pzeElfNVdLakZIWG1BUVZuX0RZbVFGdWxPVjMwNjZfYmVNM0JHTW1BPXMyNTAtYw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# ルールベースでファイルや URL を届ける Rust 製ディスパッチャ todoke を作った

自作のファイル・URL ディスパッチャ todoke (届け) を Claude Code と一緒に作りました。Rust 製で、入力された引数（ファイルパス・URL・任意の文字列）を TOML で書いたルールに照らして、対応するエディタ・ブラウザ・スクリプトに引き渡す CLI です。名前のとおり、引数を然るべき相手に**「届け」**ます。
ちなみに、漫画『君に届け』が好きです。
https://github.com/yukimemi/todoke

 なぜ作ったのか
きっかけは Neovim を $EDITOR にしたときの、ちょっとした困りごとが積み重なっていたことです。


git...
