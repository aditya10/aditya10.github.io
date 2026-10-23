---
sample: true # built from Aditya's own project write-up and news; replace with real content
title: "Spotlight: Identifying and Localizing Video Generation Errors Using VLMs"
short_title: Spotlight
notebook: published-research
venue: ECCV 2026
date: 2025-11-01
updated: 2026-06-01
thread: surprise-in-video
cover: /assets/notes/spotlight/spotlight-cover.png
card_image: /assets/notes/spotlight/spotlight-cover.png
tags: [video, evaluation, vlms, generative-ai]
---
As text-to-video models become more realistic, their errors are increasingly subtle, fine-grained, and localized in space and time. Spotlight evaluates whether current vision-language models can detect, localize, and explain these nuanced video-generation errors.

The benchmark contains 600 videos from state-of-the-art T2V models including Veo3, Seedance, and LTX-2, with over 1,600 expert annotations spanning physics, semantics, and anatomy.

{% include fn/video.html src="https://spotlight-video.github.io/assets/video/spotlight.mp4" poster="/assets/posts/spotlight/spotlight.png" n="01" label="Spotlight project video. It opens on a generated video of a kangaroo with a joey in its pouch, with an annotated error showing the pouch looks like fabric rather than skin." caption="Spotlight is a benchmark for evaluating whether VLMs can detect, localize, and explain fine-grained errors in high-fidelity text-to-video generations, with 600 videos and over 1,600 annotated error localizations." %}

Our experiments show that VLMs still lag far behind humans, with human performance nearly doubling the strongest baselines, highlighting the need for more robust perception and hallucination mitigation in automated video evaluation.

[arXiv](https://arxiv.org/abs/2511.18102v1) · Paper, code and dataset: [spotlight-video.github.io](https://spotlight-video.github.io)

<section class="addendum" markdown="1">
<span class="label">Addendum · 2026-06</span>

My paper Spotlight: Identifying and Localizing Video Generation Errors Using VLMs is accepted at ECCV 2026!
</section>
