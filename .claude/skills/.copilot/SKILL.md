---
name: copilot
description: Human-AI collaborative development workflow. Works with users to implement new features from planning to completion.
disable-model-invocation: true
---

# Copilot ワークフロー

人間と一緒に新機能を開発するための対話型ワークフロー。1つのタスクに集中する。

## 起動方法

引数は何でも受け付ける。意図を解釈して適切なフローに振り分ける。詳細は README.md を参照。

```bash
/.copilot                               # 引数なし: 現在の作業状況を確認
/.copilot issue 91                      # Issue 91 を実装
/.copilot task 1042                     # タスク 1042 を進める
/.copilot https://notion.so/...1042     # URL からタスクを取得
/.copilot ログイン履歴表示機能を追加    # 自然言語: 新規タスクを作成して実装
```

意図が不明な場合は AskUserQuestion で確認する。

## 前提条件

`.notion-task` スキルの前提条件に従う。必須環境変数が未設定の場合はスキルを中断する。任意環境変数は未設定でも確認せず続行する。

## 概要

人間と対話しながら機能の計画・実装を行うワークフロー。新機能の仕様計画から、Notion タスク・Issue の実装まで対応する。

全ての重要な判断は人間と対話して決定する。

## 必ず実行すること

### Notionタスクの更新

以下のタイミングで必ずステータスを更新する:

- **開始時**: 作業中_CLAUDE
- **PR作成時**: 作業確認待ち
- **マージ後**: 完了

### Issueの管理

- 実装前にIssueの説明を確認し、必要に応じて更新する
- 開発中に得られた知見（制約、注意点、決定事項）をIssueに追記する

### PRの管理

- **計画セクション**: 実装計画を詳細に記録する（実装の意図、背景、選択理由、手順）
- **動作確認**: 確認した内容をPR説明文に追記する
- **チェックボックス**: 動作確認完了後、PRのチェックボックスを更新する

動作確認は実際のブラウザ操作やAPI呼び出しで実施し、結果をPRに記録する。

## あなたが使うスキル

状況に応じて適切なスキルを使用する。

- `notion-task`: Notionタスクの作成・更新
- `gh-issue`: GitHub Issueの作成・更新（製品改善/実装タスク）
- `gh-pull-request`: PR作成（テンプレートに従う）
- `docs`: 仕様書の構造とルールを理解
- `copilot-notification`: 重要なイベントやステータス変更をユーザーに通知
- `superpowers:writing-plans`: 実装計画の作成

## teammateに指示するスキル

各 teammate には対応するスキルを展開するよう指示する:

- `copilot-issue`: Issue の実装（superpowers・pr-review-toolkit・commit-commands を含む）
- `copilot-task-planner`: 新機能の仕様計画
- `copilot-code-scan`: コードの不具合探し
- `copilot-docs-scan`: 仕様書の問題発見

## 基本的な流れ

### 引数なしの起動フロー

詳細は @references/no-args-flow.md を参照。

### 引数ありの起動フロー

引数の意図を解釈して適切に対応する:

- `issue 91` / `#91` などの Issue 指定: Issue を取得して実装
- `task 1042` / `#1042` などのタスク指定: タスクを取得してステータスを確認し、作業待ちなら実装・計画待ちなら計画
- Notion または GitHub の URL: 対象を取得して同上
- 自然言語の要件（「〜を実装したい」「〜を追加して」など）: `notion-task` で新規タスクを作成して実装

どれに当てはまるか不明な場合は AskUserQuestion で確認する。人間と対話しながら進める。

タスク管理・Notion 操作・teammate とのやりとりの詳細は @references/ を参照。

## Agent Teams

全ての作業は teammate に委任する。直接ファイルを読み書きしてはならない。

### チーム作成

起動時に `TeamCreate` でチームを作成する。

### Teammate 構成

**常駐 teammate**（自動モード時は全員を起動）:

- `task-planner` - 新機能の仕様計画を作成して報告する
- `debugger` - 既存製品の不具合を探して報告する
- `docs-debugger` - 仕様書の問題や矛盾を発見して報告する

**動的 teammate**（Issue ごとに起動）:

- `issue-{番号}` - Issue を実装してコミットまで完結する（PR は copilot が作成）

各 teammate との詳細なやりとりは @references/member-interactions.md を参照。

## 注意事項

- PRのマージは人間が行う（`gh pr merge` を実行しない）
- 計画を立て、ユーザーの承認を得てから実装する
- 直接ファイルを読み書きせず、Agent Teamsで作業を委任する
- Notionデータは随時変更される可能性がある（操作前に最新状態を確認）
- 環境変数は `.claude/settings.json` の `env` で管理する
