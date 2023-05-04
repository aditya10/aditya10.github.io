---
layout: post
title:  "VL-BERT-Graph: Graph-enhanced Transformers for Referring Expressions Comprehension"
date:   2022-04-29 09:29:20 +0700
categories: projects
category: academic
image: /vl-bert-graph/vl-bert-graph.png
description:  Incorporated Graph Neural Networks in a visual-linguistic Transformer
---
We explore a simple method to incorporate inter-token relationships in a Transformer before performing any training, using graphs with edge features. In VL-BERT-Graph, we generate a fully-connected graph of input tokens where the edges represent similarity between the tokens, obtained using GloVE and CLIP. We then use a message-passing GNN to incorporate these features into the input tokens or the output encoding of the model, and train the Transformer with edge-feature attention masks. \
[Report](https://lrjconan.github.io/UBC-EECE571F-DL-Structures/assets/sample_reports_2021_W2/report_05.pdf)