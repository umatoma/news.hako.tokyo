---
id: 22bencg9mmx2kaar
title: Hono × Inertia.js が作る新しい型貫通体験に触れてみた
url: 'https://zenn.dev/ashunar0/articles/d4a23d3579331a'
source: zenn
published_at: '2026-04-27T14:10:54.000Z'
collected_at: '2026-04-28T22:27:18.688Z'
summary: |-
  はじめに
  // サーバー側（Hono）
  app.get('/posts/:id', (c) => {
    const post = findPost(c.req.param('id'))
    return c.render('Posts/Show', { post })
  })
  // クライアント側（React）
  export default function Show({ post }: PageProps) {
    return {post.title}
  }
  post の型は Post として完...
tags: []
thumbnail_url: >-
  https://res.cloudinary.com/zenn/image/upload/s--LBP4m5lY--/c_fit%2Cg_north_west%2Cl_text:notosansjp-medium.otf_55:Hono%2520%25C3%2597%2520Inertia.js%2520%25E3%2581%258C%25E4%25BD%259C%25E3%2582%258B%25E6%2596%25B0%25E3%2581%2597%25E3%2581%2584%25E5%259E%258B%25E8%25B2%25AB%25E9%2580%259A%25E4%25BD%2593%25E9%25A8%2593%25E3%2581%25AB%25E8%25A7%25A6%25E3%2582%258C%25E3%2581%25A6%25E3%2581%25BF%25E3%2581%259F%2Cw_1010%2Cx_90%2Cy_100/g_south_west%2Cl_text:notosansjp-medium.otf_37:%25E3%2581%2582%25E3%2581%2595%25E3%2581%25B2%2Cx_203%2Cy_121/g_south_west%2Ch_90%2Cl_fetch:aHR0cHM6Ly9zdGF0aWMuemVubi5zdHVkaW8vdXNlci11cGxvYWQvYXZhdGFyLzZhN2JkYzMxMjIuanBlZw==%2Cr_max%2Cw_90%2Cx_87%2Cy_95/v1627283836/default/og-base-w1200-v2.png?_a=BACAGSGT
---
# Hono × Inertia.js が作る新しい型貫通体験に触れてみた

はじめに
// サーバー側（Hono）
app.get('/posts/:id', (c) => {
  const post = findPost(c.req.param('id'))
  return c.render('Posts/Show', { post })
})
// クライアント側（React）
export default function Show({ post }: PageProps) {
  return {post.title}
}
post の型は Post として完...
