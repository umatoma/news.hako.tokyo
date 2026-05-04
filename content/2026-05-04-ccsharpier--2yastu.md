---
id: 2yastugx42pyobyg
title: 【C#】CSharpierのすすめ
url: 'https://zenn.dev/nuskey/articles/csharpier-is-good'
source: zenn
published_at: '2026-05-04T01:55:56.000Z'
collected_at: '2026-05-04T22:28:12.926Z'
summary: >-
  C#フォーマッタであるCSharpierがとても良かったので、そのおすすめ記事です。CSharpierはいいぞ。

  https://csharpier.com/

   dotnet-format
  当然ですが、C#にもデフォルトのフォーマッタであるdotnet-formatが用意されています。これはプロジェクトの.editorconfigをベースに動作するフォーマッタになっていて、VSCodeのC#拡張機能などではこれが使われています。

  これでもある程度は使えますが、そこまで強力ではありません。例えば以下のコードの場合。

  class Program{
      static void Main(...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--OT7yb4SK--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:%25E3%2580%2590C%2523%25E3%2580%2591CSharpier%25E3%2581%25AE%25E3%2581%2599%25E3%2581%2599%25E3%2582%2581%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:nuskey%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzZkZTM4NWZlYWQuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# 【C#】CSharpierのすすめ

C#フォーマッタであるCSharpierがとても良かったので、そのおすすめ記事です。CSharpierはいいぞ。
https://csharpier.com/

 dotnet-format
当然ですが、C#にもデフォルトのフォーマッタであるdotnet-formatが用意されています。これはプロジェクトの.editorconfigをベースに動作するフォーマッタになっていて、VSCodeのC#拡張機能などではこれが使われています。
これでもある程度は使えますが、そこまで強力ではありません。例えば以下のコードの場合。
class Program{
    static void Main(...
