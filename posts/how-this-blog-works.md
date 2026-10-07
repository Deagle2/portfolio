---
title: How this blog works
date: 2026-10-06
summary: Write markdown, push to GitHub, the site rebuilds itself.
tags: meta
---

Each post is a `.md` file in `posts/`. Push it and the GitHub Action regenerates the index and redeploys.

## Front matter

```
---
title: My post
date: 2026-10-06
summary: One line shown in the list.
draft: true   # optional, hides the post
---
```

Delete this sample post when you write a real one.
