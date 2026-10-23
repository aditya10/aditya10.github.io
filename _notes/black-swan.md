---
sample: true # built from Aditya's own project write-up and news; replace with real content
title: "Black Swan: Abductive and Defeasible Video Reasoning in Unpredictable Events"
short_title: Black Swan
notebook: published-research
venue: CVPR 2025
date: 2024-12-01
updated: 2025-02-01
thread: surprise-in-video
cover: /assets/posts/black-swan/black-swan.png
tags: [video, reasoning, vlms, benchmarks]
---
The commonsense reasoning capabilities of vision-language models (VLMs), especially in abductive reasoning and defeasible reasoning, remain poorly understood. Most benchmarks focus on typical visual scenarios, making it difficult to discern whether model performance stems from keen perception and reasoning skills, or reliance on pure statistical recall. We argue that by focusing on atypical events in videos, clearer insights can be gained on the core capabilities of VLMs.

Explaining and understanding such out-of-distribution events requires models to extend beyond basic pattern recognition and regurgitation of their prior knowledge. To this end, we introduce BlackSwanSuite, a benchmark for evaluating VLMs' ability to reason about unexpected events through abductive and defeasible tasks. Our tasks artificially limit the amount of visual information provided to models while questioning them about hidden unexpected events, or provide new visual information that could change an existing hypothesis about the event.

{% include fn/figure.html src="/assets/posts/black-swan/black-swan.png" alt="Diagram of the Black Swan tasks on a dashcam video split into pre-event, main event and post-event parts. The Forecaster sees only the pre-event, the Detective sees the pre- and post-event, and the Reporter sees the whole video and explains what happened." %}

We curate a comprehensive benchmark suite comprising over 3,800 MCQ, 4,900 generative and 6,700 yes/no tasks, spanning 1,655 videos. After extensively evaluating various state-of-the-art VLMs, including GPT-4o and Gemini 1.5 Pro, as well as open-source VLMs such as LLaVA-Video, we find significant performance gaps of up to 32% from humans on these tasks. Our findings reveal key limitations in current VLMs, emphasizing the need for enhanced model architectures and training strategies.

[arXiv](https://arxiv.org/abs/2412.05725) · [Website](https://blackswan.cs.ubc.ca)

<section class="addendum" markdown="1">
<span class="label">Addendum · 2025-02</span>

Our paper Black Swan: Abductive and Defeasible Video Reasoning in Unpredictable Events is accepted at CVPR 2025!
</section>
