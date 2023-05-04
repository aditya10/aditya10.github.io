---
layout: post
title:  "Learning faster Genetic Algorithms with dynamic mutation power "
date:   2021-12-04 09:29:20 +0700
categories: projects
category: academic
image: /growing-agents/ga.png
description: This project introduces a modification to the GA algorithm to introduce dynamic mutation power, to solve the Lunar Lander evironment on OpenAI Gym in 30 generations.
---
Policy Gradient (PG) methods and Genetic Algorithms (GA) are used to train Reinforcement Learning agents to perform a particular task in an environment by maximizing the received reward. In the context of this assignment, both techniques aim to approximate a policy function that, given a state, produces a policy to pick the best action to maximize reward. Here, the policy function used is deep neural network model. In this project, I implement a PG method, REINFORCE, and a simple GA method to solve the Lunar Lander (LunarLander-v2) environment in OpenAI Gym. I propose two modifications to the GA method: an improved fitness function with which the GA can solve the task in about 50 generations, and a novel dynamic mutation power technique that helps the model solve the task in 30 generations. \
[Video](https://youtu.be/BmMubRYbuQM) | [Report](https://drive.google.com/file/d/1bsnn7sfDrHZSZhAxYsIKkBmPxyytd4Xk/view?usp=sharing)