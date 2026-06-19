---
layout: post
title:  "Black Swan: Abductive and Defeasible Video Reasoning in Unpredictable Events"
date:   2025-06-01 12:29:20 -0800
categories: projects
category: publication
authors: "Aditya Chinchure*, Sahithya Ravi*, Raymond Ng, Vered Shwartz, Boyang Li, Leonid Sigal (*equal contribution)"
conference: "CVPR 2025"
image: assets/posts/black-swan/black-swan.png
description: "Black Swan is a benchmark for evaluating vision-language models' (VLMs) commonsense reasoning capabilities in videos, particularly in abductive and defeasible reasoning tasks. It focuses on atypical events, requiring models to reason about unexpected occurrences and adapt their hypotheses based on new information."
---
The commonsense reasoning capabilities of vision-language models (VLMs), especially in abductive reasoning and defeasible reasoning, remain poorly understood. Most benchmarks focus on typical visual scenarios, making it difficult to discern whether model performance stems from keen perception and reasoning skills, or reliance on pure statistical recall. We argue that by focusing on atypical events in videos, clearer insights can be gained on the core capabilities of VLMs. Explaining and understanding such out-of-distribution events requires models to extend beyond basic pattern recognition and regurgitation of their prior knowledge. To this end, we introduce BlackSwanSuite, a benchmark for evaluating VLMs' ability to reason about unexpected events through abductive and defeasible tasks. Our tasks artificially limit the amount of visual information provided to models while questioning them about hidden unexpected events, or provide new visual information that could change an existing hypothesis about the event. We curate a comprehensive benchmark suite comprising over 3,800 MCQ, 4,900 generative and 6,700 yes/no tasks, spanning 1,655 videos. After extensively evaluating various state-of-the-art VLMs, including GPT-4o and Gemini 1.5 Pro, as well as open-source VLMs such as LLaVA-Video, we find significant performance gaps of up to 32% from humans on these tasks. Our findings reveal key limitations in current VLMs, emphasizing the need for enhanced model architectures and training strategies.\
[arXiv](https://arxiv.org/abs/2412.05725) | [Website](https://blackswan.cs.ubc.ca)