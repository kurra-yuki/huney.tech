---
title: リダイレクト
slug: redirection
category: サーバー
type: glossary
draft: false
term: リダイレクト
summary: >-
  コマンドの実行結果を画面ではなくファイルへ保存するなど、入出力の向きを変更するときに利用します。
---

# リダイレクト

## 正式名称

**Redirection**

## 一言でいうと

**コマンドの入出力先を変更する仕組み**

## 初心者向け説明

「>」は出力先のファイルを上書きし、「>>」は既存内容の末尾へ追記します。たとえばgrep "ERROR" server.log > error.logのように検索結果をファイルへ保存できます。

## ポイント

- コマンドの入出力先を変更する仕組み
- 「>」は出力先のファイルを上書きし、「>>」は既存内容の末尾へ追記します。たとえばgrep "ERROR" server.log > error.logのように検索結果をファイルへ保存できます。
- Linuxサーバーの構築・運用を理解するうえで重要な基礎用語

## 関連用語

- [パイプ](/glossary/pipe)
- [grep](/glossary/grep)
- [CLI](/glossary/cli)

## 関連記事

- Linuxでテキストを編集・検索しよう｜nano・vi・grep・findを初心者向けに解説

## 🍯 はちみつメモ

> **リダイレクト = コマンドの入出力先を変更する仕組み**
