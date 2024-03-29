---
title: Aditya Chinchure
permalink: /
layout: master
excerpt: 
comments: false
home: true
---

I’m a Computer Science student at the University of British Columbia, Vancouver. I work in the Computer Vision Lab with Dr. Leonid Sigal and Dr. Renjie Liao. My interests lie in multimodal vision-language models, time-series models, and commonsense reasoning. 

In addition, I am a photographer in the city. I enjoy doing landscape and product photography. My work has over 100 million views on Unsplash.

If you are reading this, I would love to talk to you! I am always looking for opportunities to collaborate on photography or computer science projects. Also, my inbox is open if you have any questions about student life at UBC or Vancouver. Message me on Instagram or send me an email anytime.


## 🎳 Projects

**Visual Commonsense Generation & its incorporation into a Multimodal Topic Modeling algorithm** | December 2022 \
The task of commonsense knowledge generation is largely limited to the language domain, with models such as COMET (for explicit knowledge) and GPT-3 (for implicit knowledge). Moreover, VisualCOMET, a commonsense generation model that utilizes the visual context, is limited to three people-centric relations. Since commonsense generation on entire scenes, or parts of a scene, can be helpful in several downstream multimodal tasks, including VQA and topic modeling, we propose a general-purpose visual commonsense generation model, VisualCOMET+, by extending VisualCOMET with four diverse inference relations. Using the clue-rationale pairs from a visual abductive reasoning dataset, we train our commonsense generation model by creating groundtruth structured commonsense triplets. Then, we show that we can get coherent and more diverse topics by incorporating generated commonsense inferences and visual features into a novel multimodal topic modeling algorithm, Multimodal CTM. \
[Report](https://drive.google.com/file/d/1_HxrSJzDZKj1uDm7irCx3_9KnXlT7My-/view?usp=sharing)

**Commonsense reasoning in Visual Question Answering (VQA)** \
Visual Question Answering with commonsense reasoning is a challenging task that requires models to understand of the image, the question, and contextualized commonsense knowledge to assist with the reasoning required to arrive at an answer. In our work, we propose extensions to the VLC-BERT, aimed at solving two drawbacks of the model by identifying potential words in the input sequence that may answer the question using a Pointer Generator, and incorporating additional image information in the form of object tags from an object detection model. Our evaluation shows that the Pointer Generator and object detection models help achieve higher scores on the OK-VQA dataset. Furthermore, we generate answers using GPT-3 and incorporate them into VLC-BERT. Our error analysis on GPT-3 and VLC-BERT models highlight that GPT-3 contains valuable implicit commonsense and factual knowledge that is beneficial to our model. \
[Report](https://drive.google.com/file/d/1eH1TtFI5QLS78mf7wWRcrUyZO6T3_N0a/view?usp=sharing)

**Graph-enhanced Transformers for Referring Expressions Comprehension** \
We explore a simple method to incorporate inter-token relationships in a Transformer before performing any training, using graphs with edge features. In VL-BERT-Graph, we generate a fully-connected graph of input tokens where the edges represent similarity between the tokens, obtained using GloVE and CLIP. We then use a message-passing GNN to incorporate these features into the input tokens or the output encoding of the model, and train the Transformer with edge-feature attention masks. \
[Report](https://lrjconan.github.io/UBC-EECE571F-DL-Structures/assets/sample_reports_2021_W2/report_05.pdf)

**Learning faster Genetic Algorithms with dynamic mutation power** \
Policy Gradient (PG) methods and Genetic Algorithms (GA) are used to train Reinforcement Learning agents to perform a particular task in an environment by maximizing the received reward. In the context of this assignment, both techniques aim to approximate a policy function that, given a state, produces a policy to pick the best action to maximize reward. Here, the policy function used is deep neural network model. In this project, I implement a PG method, REINFORCE, and a simple GA method to solve the Lunar Lander (LunarLander-v2) environment in OpenAI Gym. I propose two modifications to the GA method: an improved fitness function with which the GA can solve the task in about 50 generations, and a novel dynamic mutation power technique that helps the model solve the task in 30 generations. \
[Video](https://youtu.be/BmMubRYbuQM) | [Report](https://drive.google.com/file/d/1bsnn7sfDrHZSZhAxYsIKkBmPxyytd4Xk/view?usp=sharing)

**A Summary of Recent Text Summarization Techniques** \
In this project paper, we surveyed text summarization models by evaluating existing extractive and abstractive models. We studied the metrics and datasets used to evaluate the latest models and evaluated upcoming abstractive techniques. Finally, we highlighted future pathways for text summarization and suggested areas for improvement. \
[Report](https://drive.google.com/file/d/1ayX-OSNrvvJsNsnVA_16JzFIVmI0NnoB/view)

**Universal Machine Learning API** \
A powerful Python API template, built on Flask, for plug-and-play use with machine learning models. \
_Technologies used: Python, with the Flask API package_ \
[Blog](https://medium.com/technonerds/a-production-grade-machine-learning-api-using-flask-gunicorn-nginx-and-docker-part-1-49927238befb) | [Github](https://github.com/aditya10/flask-ml-api)

**BERT Transformer based Text Classifier using TensorFlow** \
A multi-class text classification example on the StackOverflow Questions dataset. \
_Technologies used: Python, with Pandas, TensorFlow_ \
[Blog](https://medium.com/technonerds/using-fastais-ulmfit-to-make-a-state-of-the-art-multi-label-text-classifier-bf54e2943e83)