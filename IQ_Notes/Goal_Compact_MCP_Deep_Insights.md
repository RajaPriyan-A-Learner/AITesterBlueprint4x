# 🧠 Deep Insights: `/goal`, `/compact`, and `/mcp` Commands

> **Author:** AI Tester Blueprint 4x — IQ Notes  
> **Date:** 2026-07-27  
> **Purpose:** Detailed research & reference guide for mastering agentic AI CLI slash commands

---

## 📑 Table of Contents

- [1. /goal — Autonomous Agentic Execution](#1-goal--autonomous-agentic-execution)
- [2. /compact (/compress) — Context Management](#2-compact-compress--context-management)
- [3. /mcp — Model Context Protocol](#3-mcp--model-context-protocol)
- [4. Comparison Matrix](#4-comparison-matrix)
- [5. Best Practices & Pro Tips](#5-best-practices--pro-tips)
- [6. Quick Reference Cheat Sheet](#6-quick-reference-cheat-sheet)
- [7. Cross-ADE Comparison — How Other IDEs Implement These Concepts](#7-cross-ade-comparison--how-other-ides-implement-these-concepts)

---

## 1. `/goal` — Autonomous Agentic Execution

### 🔍 What Is It?

The `/goal` command puts the AI agent into a **strict, autonomous, loop-driven execution mode**. Instead of responding to one prompt at a time, the agent enters a self-correcting loop — it keeps working until your target goal is fully achieved without errors.

> [!IMPORTANT]
> `/goal` is typically a **custom slash command** (not a default built-in). You create it by defining a `.toml` file that instructs the agent to operate in a relentless, self-correcting loop.

### 🏗️ How It Works — The Agentic Loop

The core execution flow follows a **Perceive → Reason → Plan → Act → Observe** cycle:

```
┌──────────────────────────────────────────┐
│           USER DEFINES GOAL              │
│    /goal build a REST API in Python      │
└────────────────┬─────────────────────────┘
                 ▼
┌──────────────────────────────────────────┐
│  Phase 1: EXECUTION & OBSERVATION        │
│  → Formulate actions / shell commands    │
│  → Execute and observe output            │
└────────────────┬─────────────────────────┘
                 ▼
┌──────────────────────────────────────────┐
│  Phase 2: ERROR ANALYSIS & ITERATION     │
│  → If errors: analyze logs, fix, re-test │
│  → DO NOT STOP — keep iterating          │
└────────────────┬─────────────────────────┘
                 ▼
┌──────────────────────────────────────────┐
│  Phase 3: COMPLETION VERIFICATION        │
│  → Confirm: "Goal achieved successfully" │
│  → Run verification commands             │
└──────────────────────────────────────────┘
```

### 🛠️ How to Set Up `/goal`

#### Step 1: Create the Command File

Create `goal.toml` in one of these locations:

| Scope | Path |
|:------|:-----|
| **Global** (all projects) | `~/.gemini/commands/goal.toml` |
| **Project** (current repo) | `.gemini/commands/goal.toml` |

#### Step 2: Define the Configuration

```toml
description = "Executes an autonomous code/task loop until the target goal is successfully achieved without errors."
prompt = """
You are executing under a strict, autonomous, loop-driven environment inside Gemini CLI.
Your objective is to achieve the user's specific target goal: {{args}}.

You must operationalize your execution flow into a self-correcting loop:
1. Phase 1: Execution & Observation. Formulate and execute the necessary actions or shell commands.
2. Phase 2: Error Analysis & Iteration. If errors occur, DO NOT stop. Analyze the logs, fix the issue, and re-test. Repeat until successful.
3. Phase 3: Completion Verification. Once error-free, confirm: "Status: Done. Goal achieved successfully without errors."
"""
```

#### Step 3: Use It

```bash
/goal build a snake game in python with unit tests
/goal refactor the auth module to use JWT tokens
/goal fix all failing tests in the project
```

### 🎯 Key Principles for Effective `/goal` Usage

| Principle | Description |
|:----------|:------------|
| **Objective** | Clearly state what needs to be achieved |
| **Context** | Reference relevant files, docs, or environment state |
| **Constraints** | Define guardrails — what NOT to touch or change |
| **Verification** | Provide a specific verifiable command (e.g., `npm test exits 0`) |
| **Stop Rules** | Define when the agent should halt and report instead of looping forever |

### ⚠️ Risks & Mitigations

| Risk | Mitigation |
|:-----|:-----------|
| Infinite looping | Set clear stop rules and turn/time budgets |
| Unexpected file changes | Use hooks (e.g., `BeforeTool`) to validate dangerous operations |
| High token consumption | Monitor token usage; use `/stats` to track spend |
| Runaway modifications | Run in sandboxed/containerized environments |

---

## 2. `/compact` (`/compress`) — Context Management

### 🔍 What Is It?

The `/compact` (more commonly known as **`/compress`**) command is a **context window management tool**. It replaces your current chat history with a condensed summary, freeing up tokens while retaining the essential context of your conversation.

> [!NOTE]
> In most AI CLI tools, the canonical command is **`/compress`**. The term "compact" may refer to:
> - `/compress` itself (as an alias in some environments)
> - The `ui.compactToolOutput` setting (which controls display density of tool outputs)

### 🏗️ How It Works

```
BEFORE /compress                          AFTER /compress
┌─────────────────────────┐              ┌─────────────────────────┐
│ Message 1 (500 tokens)  │              │                         │
│ Message 2 (800 tokens)  │              │   COMPRESSED SUMMARY    │
│ Message 3 (1200 tokens) │   ──────►    │     (~300 tokens)       │
│ Message 4 (600 tokens)  │              │                         │
│ Message 5 (900 tokens)  │              │  "Key decisions made,   │
│                         │              │   current state, and    │
│ Total: ~4000 tokens     │              │   relevant context"     │
└─────────────────────────┘              └─────────────────────────┘
```

### 🎯 When to Use `/compress`

| Scenario | Why It Helps |
|:---------|:-------------|
| **Long debugging sessions** | Frees tokens consumed by extensive error logs and back-and-forth |
| **Context window filling up** | Prevents hitting the model's token limit mid-task |
| **Pivoting to a new sub-task** | Retains relevant context while discarding irrelevant history |
| **Before complex operations** | Ensures maximum token budget for the agent's reasoning and output |

### 🔧 Related Setting: `compactToolOutput`

Separate from the `/compress` command, there's a display setting:

```json
{
  "ui": {
    "compactToolOutput": true
  }
}
```

| Setting Value | Behavior |
|:-------------|:---------|
| `true` | Tool outputs (file reads, directory listings) displayed in compressed format |
| `false` | Tool outputs displayed in full, verbose format |

### ✅ Best Practices

- **Use proactively**, not just when you hit token limits
- **Compress before switching tasks** within the same session
- **Pair with `/chat save`** — save your state before compressing, so you can resume the full history if needed
- **Don't compress too early** — you lose nuance from detailed conversation history

---

## 3. `/mcp` — Model Context Protocol

### 🔍 What Is It?

The `/mcp` command manages **Model Context Protocol (MCP)** server connections. MCP is an **open standard** (originally created by Anthropic) that provides a universal way for AI applications to connect with external tools, databases, APIs, and data sources.

> [!IMPORTANT]
> Think of MCP as the **"USB-C for AI"** — a single, universal protocol that replaces the need for N×M custom integrations between AI apps and external services.

### 🏗️ MCP Architecture — Deep Dive

```
┌───────────────────────────────────────────────────────────────┐
│                        MCP HOST                               │
│                  (AI Application / IDE)                        │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ MCP Client 1│  │ MCP Client 2│  │ MCP Client 3│          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
└─────────┼────────────────┼────────────────┼──────────────────┘
          │                │                │
     JSON-RPC 2.0     JSON-RPC 2.0     JSON-RPC 2.0
          │                │                │
┌─────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
│  MCP Server 1  │ │  MCP Server 2│ │  MCP Server 3│
│   (GitHub)     │ │  (Postgres)  │ │   (Slack)    │
└────────────────┘ └──────────────┘ └──────────────┘
```

#### The Three Layers

| Layer | Role | Example |
|:------|:-----|:--------|
| **MCP Host** | The AI application that manages user interactions and coordinates the AI model | Claude Desktop, Gemini CLI, an IDE extension |
| **MCP Client** | Lives within the Host; maintains a dedicated, stateful session with one MCP Server | Each server gets its own client instance |
| **MCP Server** | Lightweight process that connects to a specific data source/tool | GitHub MCP server, PostgreSQL MCP server |

### 🔌 MCP Primitives (The Three Capabilities)

MCP servers expose three types of capabilities:

#### 1. 🛠️ Tools (Actions)
Functions the AI model can **execute** to perform side effects.

```
Examples:
├── Send an email
├── Create a GitHub issue
├── Update a database record
├── Trigger a CI/CD pipeline
└── Execute a shell command
```

#### 2. 📦 Resources (Data)
References to data the AI model can **read** for context.

```
Examples:
├── File contents from a repository
├── Database query results
├── System logs and metrics
├── API response data
└── Configuration files
```

#### 3. 📝 Prompts (Templates)
Pre-defined prompt templates that guide user interactions.

```
Examples:
├── Code review template
├── Bug report generator
├── SQL query builder
└── Deployment checklist
```

### 🔧 `/mcp` Command Usage

| Command | Description |
|:--------|:------------|
| `/mcp list` | Show all configured MCP servers and their status |
| `/mcp reload` | Restart all MCP server connections |
| `gemini mcp add` | Register a new MCP server |
| `gemini mcp remove` | Disconnect/delete an existing server |
| `gemini mcp enable` | Enable a disabled server |
| `gemini mcp disable` | Disable a server without removing it |

### ⚙️ Configuration

MCP servers are configured in your `settings.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token-here"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

**Configuration file locations:**

| Scope | Path |
|:------|:-----|
| **Global** | `~/.gemini/settings.json` |
| **Project** | `.gemini/settings.json` |

### 🔄 MCP Lifecycle

```
1. INITIALIZATION & HANDSHAKE
   Host starts → Client connects → Server responds
   → Capability negotiation (what tools/resources/prompts are available)

2. DISCOVERY
   Host discovers available capabilities from the Server
   → Tools, Resources, and Prompts are registered

3. INTERACTION
   AI model determines it needs external context or action
   → Client sends request to Server → Server executes → Returns result

4. BIDIRECTIONAL COMMUNICATION
   Servers can send notifications back
   → Request additional user input (sampling)
   → Push real-time updates
```

### 🌐 Transport Protocols

| Transport | Use Case | Description |
|:----------|:---------|:------------|
| **STDIO** | Local tools | Communication via standard input/output streams |
| **Streamable HTTP** | Remote/production | HTTP-based transport for network deployments |

### 🧩 Popular MCP Servers

| Server | Purpose |
|:-------|:--------|
| `@modelcontextprotocol/server-github` | GitHub repo management, issues, PRs |
| `@modelcontextprotocol/server-filesystem` | Local file system access |
| `@modelcontextprotocol/server-postgres` | PostgreSQL database queries |
| `@modelcontextprotocol/server-slack` | Slack messaging integration |
| `@modelcontextprotocol/server-brave-search` | Web search via Brave |
| `@modelcontextprotocol/server-puppeteer` | Browser automation |
| Custom (FastMCP) | Build your own with Python |

---

## 4. Comparison Matrix

| Feature | `/goal` | `/compact` (`/compress`) | `/mcp` |
|:--------|:--------|:------------------------|:-------|
| **Category** | Execution Mode | Context Management | Integration Protocol |
| **Purpose** | Autonomous task completion | Token optimization | External tool connectivity |
| **Built-in?** | ❌ Custom (`.toml` file) | ✅ Yes (`/compress`) | ✅ Yes |
| **Scope** | Task-level | Session-level | System-level |
| **User Interaction** | Minimal (set & forget) | One-time command | Configuration + runtime |
| **Token Impact** | ⬆️ High consumption | ⬇️ Reduces usage | ➡️ Neutral (depends on tools) |
| **Risk Level** | ⚠️ Medium-High | 🟢 Low | 🟡 Medium |
| **Learning Curve** | Medium | Easy | Medium-High |
| **Key Benefit** | Hands-off task delegation | Longer sessions | Infinite extensibility |

---

## 5. Best Practices & Pro Tips

### 🎯 For `/goal`

1. **Always define a "Done" state** — Include a verifiable exit condition
2. **Use `GEMINI.md`** for persistent project context the agent can reference
3. **Implement Maker/Checker patterns** — One agent writes, another reviews
4. **Set budgets** — Limit token spend and iteration counts
5. **Use `/chat save` before launching** — Create a checkpoint you can resume from
6. **Run in sandboxes** — Protect your system from unintended modifications

### 📦 For `/compact` (`/compress`)

1. **Compress proactively** — Don't wait until you hit token limits
2. **Save before compressing** — Use `/chat save <tag>` first
3. **Compress when switching tasks** — Keep context relevant
4. **Enable `compactToolOutput`** — Reduce visual clutter in terminal

### 🔌 For `/mcp`

1. **Start with `/mcp list`** — Always verify your servers are connected
2. **Use environment variables** — Never hardcode secrets in config
3. **Test incrementally** — Add one server at a time, verify each
4. **Build custom servers** — Use FastMCP (Python) for specialized needs
5. **Monitor server health** — Use `/mcp reload` if connections drop

### 🔗 Combining All Three

```
Powerful Workflow:
1. Configure MCP servers for your project tools (GitHub, DB, etc.)
2. Set up a /goal command with verification steps
3. Launch: /goal implement user authentication with OAuth2
4. Use /compress midway if the session gets long
5. The agent autonomously codes, tests, and verifies using MCP tools
```

---

## 6. Quick Reference Cheat Sheet

### Essential Commands

```bash
# Goal (custom) — Autonomous execution
/goal <your objective here>

# Compress — Manage context window
/compress

# MCP — Manage integrations
/mcp list              # Show all servers
/mcp reload            # Restart connections
gemini mcp add <name>  # Add a new server

# Other useful commands
/chat save <tag>       # Save session checkpoint
/chat resume <tag>     # Resume from checkpoint
/stats                 # View token usage
/tools                 # List available tools
/help                  # Show all commands
/clear                 # Reset session
/copy                  # Copy last output to clipboard
```

### File Locations Quick Reference

```
~/.gemini/
├── commands/
│   └── goal.toml          # Custom /goal command
├── settings.json          # MCP server configuration
└── GEMINI.md              # Global agent instructions

.gemini/                   # Project-level (in repo root)
├── commands/
│   └── goal.toml          # Project-specific /goal
├── settings.json          # Project-specific MCP config
└── GEMINI.md              # Project-specific instructions
```

---

> [!TIP]
> **Remember:** The real power comes from combining these commands. Use `/mcp` to connect your tools, `/goal` to delegate complex tasks autonomously, and `/compress` to keep your sessions running efficiently. This is the core of **agentic AI-assisted development**.

---

## 7. Cross-ADE Comparison — How Other IDEs Implement These Concepts

The concepts behind `/goal`, `/compact`, and `/mcp` are not unique to Gemini CLI. Every major AI Development Environment (ADE) has its own implementation of **agentic execution**, **context management**, and **external tool integration**. Here's how each one does it.

---

### 🟣 7.1 Cursor IDE

**Type:** Standalone AI-native IDE (fork of VS Code)  
**Pricing:** Free tier + Pro ($20/mo) + Business ($40/mo)

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Agent Mode (Foreground)** | Built into the Chat panel. Describe a task and the agent autonomously plans, edits multi-file, runs terminal commands, and self-heals on errors |
| **Background/Cloud Agents** | Run on isolated cloud VMs. Handle long-running tasks asynchronously (e.g., feature implementation, large refactors). Submit a PR when done |
| **Plan Mode** | Outputs a structured plan (stored in `.cursor/plans/`) for review before granting execution permission |
| **Automations** | Trigger agents via GitHub issues, Slack messages, or webhooks for "always-on" workflows (e.g., BugBot) |
| **Multi-Agent Architecture** | Hierarchical planner-worker system: Planner decomposes tasks into a dependency graph; Workers execute subtasks in parallel |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **On-demand search** | Agent searches the codebase dynamically rather than pre-loading everything |
| **Context curation** | Users can include/exclude files to keep the context window focused |
| **No explicit `/compress`** | Context is managed via intelligent retrieval rather than manual compression |

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **Native MCP support** | Full MCP client built-in; agents can invoke MCP tools (Playwright, databases, CI/CD) |
| **Configuration** | Via `.cursor/mcp.json` or IDE settings |
| **Composer model** | Cursor's proprietary model optimized for managing multiple agents with MCP tools |

---

### 🟢 7.2 Windsurf (by Codeium)

**Type:** Standalone AI-native IDE  
**Pricing:** Free tier + Pro ($15/mo)

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Cascade (Agentic/Code Mode)** | Autonomous multi-step agent that creates/modifies files, runs terminal commands, and iterates with human-in-the-loop approval |
| **Chat Mode** | Conversational — for exploration, debugging, and architectural discussions |
| **Persistent Memory** | Auto-generated "Memories" persist across sessions, remembering project conventions and decisions |
| **Skills** | Reusable scripts/templates stored in `.windsurf/skills/` — invoked automatically when relevant |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **@-commands for context injection** | `@file`, `@codebase`, `@web`, `@docs`, `@terminal` — precise context control |
| **Codebase indexing** | Deep indexing for whole-project awareness |
| **No explicit compress command** | Context managed via selective injection rather than summarization |

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **MCP support** | Supports MCP servers for tool extensibility |
| **Custom AI Rules** | Project-specific constraints enforced automatically |

---

### 🔵 7.3 Cline (VS Code Extension)

**Type:** Open-source VS Code extension  
**Pricing:** Free (bring your own API key)

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Plan-and-Act Agent** | Creates a plan, executes it, monitors terminal/compiler output in real-time, and auto-adjusts on errors |
| **Auto-Approve Toggle** | Switch between manual approval per step or full autonomous execution |
| **Configurable Autonomy** | Choose exactly which operations (file edits, terminal, browser) can run without approval |
| **Checkpoints** | Tracks changes with rollback points — undo any action if the agent goes wrong |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **Auto Compact** | ✅ When conversation approaches token limits, Cline automatically summarizes history while preserving technical decisions and code patterns |
| **ContextManager** | Core component that tracks message modifications and file changes for granular optimization |
| **Checkpoints** | Roll back conversation state if summarization produces undesired results |

> [!TIP]
> Cline's "Auto Compact" is the closest equivalent to Gemini CLI's `/compress` — it triggers automatically rather than requiring a manual command.

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **Native MCP support** | Full support via `cline_mcp_settings.json` |
| **Extensibility** | Connect to databases, browser automation (Playwright), infrastructure APIs |
| **Marketplace** | Add MCP servers manually or via configured endpoints |

---

### ⚫ 7.4 GitHub Copilot

**Type:** IDE extension (VS Code, JetBrains, Eclipse, Xcode) + Web + CLI  
**Pricing:** Free tier + Pro ($10/mo) + Business ($19/mo) + Enterprise ($39/mo)

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Agent Mode (Foreground)** | In VS Code: describe a task → Copilot autonomously plans, edits multi-file, runs tests, iterates until done |
| **Coding Agent (Async)** | Assign a GitHub issue → Copilot works in a cloud sandbox → submits a draft PR. Works while you're offline |
| **Environment Interaction** | Can interact with IDE, terminal, debugger, and browser |
| **Spec-Driven Development** | Define intent → agent manages the full implementation cycle |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **Auto-compaction** | ✅ Automatically compacts context during long sessions |
| **`/compact` command** | ✅ Manual command available to compress chat history |
| **`/context` command** | Inspect token usage and verify which files the AI is focused on |

> [!IMPORTANT]
> GitHub Copilot is one of the few ADEs that has an explicit **`/compact`** command matching the exact naming convention.

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **Full MCP support** | Native MCP client in VS Code and CLI |
| **GitHub MCP Registry** | Official registry of verified MCP servers |
| **Configuration** | Via VS Code settings or `.github/copilot/mcp.json` |
| **Tool discovery** | `/tools` command shows active MCP tools |

---

### 🟠 7.5 Claude Code (by Anthropic)

**Type:** Terminal-based CLI agent  
**Pricing:** Usage-based (via Anthropic API) + Max plan

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Agentic Loop** | Autonomous cycle: gather context → take action → verify results |
| **Permission Modes** | Graduated control: full approval, selective auto-approve, or YOLO mode (skip all permissions) |
| **Custom Commands** | Create `.md` files in `.claude/commands/` for repeatable goal-oriented workflows |
| **Git-native** | Automatically creates commits, branches, and PRs |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **`/compact` command** | ✅ Exact same name — manually summarize conversation to free tokens |
| **Auto-compaction** | ✅ Triggers automatically when approaching context window limits |
| **Memory files** | Uses `CLAUDE.md` for persistent project context across sessions |

> [!NOTE]
> Claude Code's `/compact` command is the **most direct equivalent** to the concept — same name, same behavior. This is where the term likely originates for many developers.

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **Native MCP support** | Full support — Anthropic created the MCP standard |
| **Configuration** | Via `.claude/settings.json` or `~/.claude/settings.json` |
| **Tool ecosystem** | Broad ecosystem of first-party and community MCP servers |

---

### 🟤 7.6 Aider

**Type:** Open-source terminal-based AI pair programmer  
**Pricing:** Free (bring your own API key)

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Semi-autonomous** | Multi-file edits, test execution, auto Git commits — but user directs high-level tasks |
| **Git-first philosophy** | Every change is a trackable, reversible Git commit |
| **No full autonomous loop** | More "pair programmer" than "autonomous agent" — deliberate design choice for control |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **Repo-Map** | Uses `tree-sitter` to generate a semantic map of the entire codebase — compressed into the context window |
| **`/add` and `/drop`** | Manual context curation — add/remove files from chat context |
| **Prompt caching** | Reduces cost and latency in iterative sessions |
| **No explicit compress** | Context managed via semantic indexing rather than conversation summarization |

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **No native MCP** | Requires third-party wrappers (e.g., `mcpm-aider`) |
| **Can act as MCP server** | Other MCP clients can offload coding tasks to Aider |
| **Community-driven** | Active development toward native support |

---

### 🔴 7.7 Continue.dev

**Type:** Open-source IDE extension (VS Code + JetBrains)  
**Pricing:** Free (open-source, bring your own model)

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Agent Mode** | Multi-step autonomous execution: create files, edit code, run terminal commands |
| **Tool permissions** | Per-tool approval or set to "Automatic" for specific tools |
| **Custom slash commands** | Define in config or via prompt files with `invokable: true` |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **Manual context curation** | Users encouraged to start new sessions or manually curate context |
| **RAG integration** | Retrieval-Augmented Generation for intelligent context selection |
| **No auto-compact** | Context managed through selective retrieval rather than compression |

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **Native MCP support** | Full support — configured in `.continue/mcpServers/` |
| **Agent mode only** | MCP tools primarily available in Agent mode |
| **Extensible** | Connect to APIs, databases, version control systems |

---

### 🟡 7.8 Amazon Q Developer

**Type:** IDE extension (VS Code + JetBrains) + CLI  
**Pricing:** Free tier + Pro ($19/mo/user)

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Agent Mode** | Autonomous multi-step task execution with planning and verification |
| **Agent Personas** | Swap between specialized agent profiles (e.g., "Security Agent" vs. "Coding Agent") |
| **GitHub integration** | Can work from GitHub issues asynchronously |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **Resource retrieval via MCP** | Dynamically pulls only needed context (logs, configs, docs) |
| **Modular memory** | Structured state tracking across multi-turn conversations |
| **Agent personas** | Context scoping via persona-specific tool/file groups |

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **Native MCP support** | Full support — configured in `.aws/amazonq/agents/default.json` |
| **Background loading** | MCP servers load in background; tools become available progressively |
| **`/tools` command** | Check active MCP server status and available tools |

---

### 🔵 7.9 Augment Code

**Type:** IDE extension (VS Code + JetBrains) + Context Engine  
**Pricing:** Free tier + Teams ($30/mo)

#### Agentic Execution (≈ `/goal`)

| Feature | Details |
|:--------|:--------|
| **Agent Mode** | End-to-end autonomous execution: planning, coding, and testing |
| **Context Engine-powered** | Agent always works with the most relevant codebase context |
| **Intent-driven** | Moving toward autonomous orchestration from high-level intent |

#### Context Management (≈ `/compact`)

| Feature | Details |
|:--------|:--------|
| **Context Engine** | Specialized semantic search — indexes code, commits, docs, and "tribal knowledge" |
| **Local Mode** | Real-time indexing of your working directory via `auggie` CLI |
| **Remote Mode** | Cross-repo context for large-scale architectural understanding |
| **Token optimization** | Designed to reduce token waste by providing highly relevant context |

#### MCP Integration (≈ `/mcp`)

| Feature | Details |
|:--------|:--------|
| **MCP Client** | Connect to any MCP server (databases, web search, CI/CD) |
| **MCP Server (Context Engine)** | Augment's Context Engine is also available as an MCP server for other tools |
| **Easy MCP** | One-click integration with popular tools (no manual JSON config needed) |
| **Interoperable** | Shares command/protocol standards with Claude Code |

---

### 📊 7.10 Master Comparison Matrix — All ADEs

#### Agentic Execution (≈ `/goal`)

| ADE | Autonomous Loop | Background/Async Agents | Custom Goal Commands | Self-Healing |
|:----|:---:|:---:|:---:|:---:|
| **Gemini CLI** | ✅ (custom `.toml`) | ❌ | ✅ `.toml` files | ✅ |
| **Cursor** | ✅ Built-in | ✅ Cloud agents | ✅ Automations | ✅ |
| **Windsurf** | ✅ Cascade | ❌ | ✅ Skills | ✅ |
| **Cline** | ✅ Plan-and-Act | ❌ | ❌ | ✅ |
| **GitHub Copilot** | ✅ Agent Mode | ✅ Coding Agent | ❌ | ✅ |
| **Claude Code** | ✅ Agentic Loop | ❌ | ✅ `.md` commands | ✅ |
| **Aider** | ⚠️ Semi-auto | ❌ | ❌ | ⚠️ Limited |
| **Continue.dev** | ✅ Agent Mode | ❌ | ✅ Prompt files | ✅ |
| **Amazon Q** | ✅ Agent Mode | ✅ (GitHub) | ✅ Personas | ✅ |
| **Augment Code** | ✅ Agent Mode | ❌ | ❌ | ✅ |

#### Context Management (≈ `/compact`)

| ADE | Manual Compress | Auto-Compact | Semantic Indexing | Context Commands |
|:----|:---:|:---:|:---:|:---:|
| **Gemini CLI** | ✅ `/compress` | ❌ | ❌ | `/compress` |
| **Cursor** | ❌ | ❌ | ✅ On-demand search | ❌ |
| **Windsurf** | ❌ | ❌ | ✅ Codebase index | `@file`, `@codebase` |
| **Cline** | ❌ | ✅ Auto Compact | ✅ ContextManager | Auto |
| **GitHub Copilot** | ✅ `/compact` | ✅ Auto-compaction | ✅ | `/compact`, `/context` |
| **Claude Code** | ✅ `/compact` | ✅ Auto-compaction | ❌ | `/compact` |
| **Aider** | ❌ | ❌ | ✅ Repo-Map | `/add`, `/drop` |
| **Continue.dev** | ❌ | ❌ | ✅ RAG | ❌ |
| **Amazon Q** | ❌ | ❌ | ✅ MCP Resources | `/tools` |
| **Augment Code** | ❌ | ❌ | ✅ Context Engine | ❌ |

#### MCP Integration (≈ `/mcp`)

| ADE | Native MCP | MCP Server Role | Config Location | One-Click Setup |
|:----|:---:|:---:|:---|:---:|
| **Gemini CLI** | ✅ | ❌ | `~/.gemini/settings.json` | ❌ |
| **Cursor** | ✅ | ❌ | `.cursor/mcp.json` | ❌ |
| **Windsurf** | ✅ | ❌ | IDE settings | ❌ |
| **Cline** | ✅ | ❌ | `cline_mcp_settings.json` | ❌ |
| **GitHub Copilot** | ✅ | ❌ | VS Code settings / `.github/` | ✅ Registry |
| **Claude Code** | ✅ | ❌ | `.claude/settings.json` | ❌ |
| **Aider** | ⚠️ Community | ✅ (via wrappers) | CLI flags | ❌ |
| **Continue.dev** | ✅ | ❌ | `.continue/mcpServers/` | ❌ |
| **Amazon Q** | ✅ | ❌ | `.aws/amazonq/agents/` | ❌ |
| **Augment Code** | ✅ | ✅ Context Engine | IDE settings | ✅ Easy MCP |

---

### 🧭 7.11 Key Takeaways

#### Who Does `/goal` Best?
- **Cursor** leads with its hierarchical planner-worker multi-agent system and cloud background agents
- **Claude Code** and **Gemini CLI** offer the most customizable goal-loop definitions via file-based commands
- **GitHub Copilot** uniquely allows assigning GitHub issues for fully asynchronous agent execution

#### Who Does `/compact` Best?
- **Claude Code** coined the `/compact` command — auto-compaction + manual trigger
- **Cline** has the smartest auto-compact with its ContextManager preserving technical decisions
- **GitHub Copilot** matches Claude Code with both `/compact` and auto-compaction
- **Aider** takes a different approach with its `tree-sitter` Repo-Map — no compression needed

#### Who Does `/mcp` Best?
- **Claude Code / Anthropic** — they *created* the standard
- **Augment Code** — only major ADE acting as both MCP client AND server
- **GitHub Copilot** — official MCP Registry for one-click server discovery
- **Gemini CLI** — strong native support with simple JSON configuration

> [!TIP]
> **Industry trend:** MCP has become the de facto standard across all major ADEs. By mid-2026, every serious AI coding tool supports it. The differentiation is now in *how well* they implement it — ease of setup, reliability, and ecosystem breadth.

---

*📚 Sources: geminicli.com, modelcontextprotocol.io, anthropic.com, databricks.com, google.dev, explainx.ai, cursor.com, codeium.com, cline.bot, github.blog, continue.dev, aider.chat, aws.amazon.com, augmentcode.com, and various community guides*
