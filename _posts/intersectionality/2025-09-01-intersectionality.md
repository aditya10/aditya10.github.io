---
layout: post
title:  "Mitigate One, Skew Another? Tackling Intersectional Biases in Text-to-Image Models"
date:   2025-09-01 12:29:20 -0800
categories: projects
category: publication
authors: "Pushkar Shukla*, Aditya Chinchure*, Emily Diana, Alexander Tolbert, Kartik Hosanagar, Vineeth Balasubramanian, Leonid Sigal, Matthew Turk (*equal contribution)"
conference: "EMNLP 2025"
image: assets/posts/intersectionality/intersectionality.png
description: "The biases exhibited by text-to-image (TTI) models are often treated as independent, though in reality, they may be deeply interrelated. Fixing bias along one dimension can inadvertently affect another. We show measure and quantify such interactions, and propose InterMit, an intersectional bias mitigation algorithm that leverages these insights to achieves superior results with fewer steps."
---
The biases exhibited by text-to-image (TTI) models are often treated as independent, though in reality, they may be deeply interrelated. Addressing bias along one dimension—such as ethnicity or age—can inadvertently affect another, like gender, either mitigating or exacerbating existing disparities. Understanding these interdependencies is crucial for designing fairer generative models, yet measuring such effects quantitatively remains a challenge. To address this, we introduce BiasConnect, a novel tool for analyzing and quantifying bias interactions in TTI models. BiasConnect uses counterfactual interventions along different bias axes to reveal the underlying structure of these interactions and estimates the effect of mitigating one bias axis on another. These estimates show strong correlation (+0.65) with observed post-mitigation outcomes.Building on BiasConnect, we propose InterMit, an intersectional bias mitigation algorithm guided by user-defined target distributions and priority weights. InterMit achieves lower bias (0.33 vs. 0.52) with fewer mitigation steps (2.38 vs. 3.15 average steps), and yields superior image quality compared to traditional techniques. Although our implementation is training-free, InterMit is modular and can be integrated with many existing debiasing approaches for TTI models, making it a flexible and extensible solution.\
[arXiv](https://arxiv.org/abs/2505.17280) | [ACL Anthology](https://aclanthology.org/2025.findings-emnlp.665/)