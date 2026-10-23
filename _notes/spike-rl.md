---
sample: true # built from Aditya's own project write-up and news; replace with real content
title: "SPIKE-RL: Video-LLMs meet Bayesian Surprise"
short_title: SPIKE-RL
notebook: published-research
venue: ICLR 2026
date: 2025-09-01
updated: 2026-04-01
thread: surprise-in-video
cover: /assets/posts/spikerl/spikerl.png
tags: [video, surprise, video-llms, reinforcement-learning]
---
Real-world videos often contain routine activity punctuated by surprising moments, but standard Video-LLM inference commonly samples frames uniformly and can miss the moments that define a video's narrative.

SPIKE is an inference-time framework that measures Bayesian Surprise as the belief update triggered by new visual evidence, identifying when incoming frames conflict with prior beliefs. SPIKE-RL further improves these belief hypotheses with GRPO using rewards from video captions.

{% include fn/figure.html src="/assets/posts/spikerl/spikerl.png" alt="Eight frames of three people riding segways on a grassy path, comparing uniform frame sampling, SPIKE and SPIKE-RL. Each row shows the frames each method sampled, its surprise scores over time, belief hypotheses with prior and posterior probabilities, and its description of the video." %}

Together, SPIKE and SPIKE-RL enable query-agnostic, surprise-weighted frame sampling that allocates more visual context to important moments, improving performance across five downstream video benchmarks.

[arXiv](https://www.arxiv.org/abs/2509.23433)

<section class="addendum" markdown="1">
<span class="label">Addendum · 2026-04</span>

Attending ICLR 2026 in Rio de Janeiro, Brazil, to present SPIKE-RL.
</section>
