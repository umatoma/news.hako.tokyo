---
id: f6sfgfv5506p8bn1
title: Rate Limiting Strategies with Valkey/Redis
url: 'https://www.percona.com/blog/rate-limiting-strategies-with-valkey-redis/'
source: hatena
published_at: '2026-03-19T04:28:05.000Z'
collected_at: '2026-04-26T22:18:03.075Z'
summary: >-
  Rate limiting is one of those topics that looks simple until you’re actually
  doing it in production. Implement a counter with the INCR command and a TTL
  and away you go. But when you ask questions like “what happens at the
  boundary?”, “should I use a Valkey/Redis cluster?”, or “why are we getting...
tags: []
thumbnail_url: null
---
# Rate Limiting Strategies with Valkey/Redis

Rate limiting is one of those topics that looks simple until you’re actually doing it in production. Implement a counter with the INCR command and a TTL and away you go. But when you ask questions like “what happens at the boundary?”, “should I use a Valkey/Redis cluster?”, or “why are we getting...
