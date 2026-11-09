---
title: "The Meat Proxy Theory"
notebook: thoughts
date: 2026-11-08
cover: /assets/notes/meat-proxy-theory/meat-proxy-theory-01.png
tags: [agents, future-of-work, cognition]
---
For a long time, humans have been the individual contributors towards collective success. Large companies operate with deep hierarchy that often ends at the nodes of a large organizational tree, where the leaf nodes represent the people who actually do the ground work. In this hierarchy, the higher up the branches you climb, the more you focus on planning, operations, high level ideas. The lower you are in this tree, the more you focus on specific tasks and engineering. For decades, this general operating system for organizations has successfully led to the development of the human civilization.

Except, in 2025, it seems like most companies (and people) decided that engineering can be handed off to AI Agents. Suddenly, there is this new leaf node in the tree: the agents that actually write the code, read the long papers and reports, and do the dirty work. And with this change, people whose prior job was to do this work have now (1) become the “manager” of AI agents, often employing their skills in systems thinking for engineering to now manage AI Agents, or (2) have started losing their jobs.

Which brings me to the Meat Proxy Theory.

## Meat Proxy Theory

> I define the Meat Proxy Theory as a condition where humans essentially are work routers, much like AI agents. A work router’s job is to route work to either other humans (who in-turn can route further down the tree) or to AI Agents (each of which can be a collection of MoE models with model routers).

{% include fn/figure.html src="/assets/notes/meat-proxy-theory/meat-proxy-theory-01.png" alt="Tree diagram of an organization made of humans and AI agents. Circular nodes sit in four levels of two, three, four and five, with lines branching from each node to the two nodes below it. Blue nodes are people at laptops and brown nodes are robots: two people at the top, then a person, a robot and a person, then three robots and a person, and five robots at the bottom level." %}

This theory is interesting to me not only because it is a reflection of today’s organizations, but because it questions what the role of a work router really is, and more importantly, how it blurs the line between human and AI routers.

Think of a work router as any node in this tree that delegates work to its sub-nodes, plans, executes, and returns information to higher up nodes. In a human, this would be the role of a person who runs tasks using AI agents. In an AI agent, however, this can be the model router (deciding which expert in an MoE model to invoke for a given input) or a sub-agent manager model (e.g. Opus managing several Sonnet and Haiku agents). Fundamentally, the role is the same, whether your node is a human or AI router.

Here are a few implications of this theory:

1. **Task Sharing:** If a human router and an AI router are doing similar things, can one do the other’s tasks? More specifically, as we train models that are better high-level planners, do both humans and AI do the same kind of “planning” job, and if so, what can a human learn from an AI’s planning & routing job, and what can AI learn from human’s planning and routing job? These are important questions because they ask what connection lies between human cognition and agent cognition, and goes beyond work settings to multi-agent and agent-human collaboration, and social cognition.
2. **Compute vs. Education:** We are actively building out massive data centers, and it has become a hot topic for debate. Let’s say these data centres run a large swath of AI agents that are really great at managing their sub-agents. Then, if the human router and AI router is task sharing, would it be possible to reduce the number of AI agents if we teach humans to become better model routers? Here’s a simple example: we know that a single line code change doesn’t need a massive model like Opus, but we as human routers still use Opus anyways. But what if we as a human router chose better? We could potentially maintain productivity while reducing our AI usage.
3. **Societal Organization:** The biggest question this theory asks is what does a society look like where humans and AI agents co-exist and can do similar tasks, and how human oversight on AI agents has to be orchestrated. It begs the question of what societal role a human or an agent plays, in the context of work, laws, ownership and responsibilities.

## Why “Meat Proxy”?

{% include fn/margin.html label="Side note" text="[https://meatproxy.me](https://meatproxy.me)" %}
Humans that use AI for everything are called “meat proxy” because they act as a proxy between another human and an AI. Famously, this phrase became popular when this website became popular on X. The Meat Proxy Theory theorizes what it would look like if everyone was a meat proxy, and how it connects to the role of model routing and work planning.
