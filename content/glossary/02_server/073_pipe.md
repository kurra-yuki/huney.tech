---
title: パイプ
slug: pipe
category: サーバー
type: glossary
draft: false
term: パイプ
summary: >-
  「|」を使って複数のLinuxコマンドを組み合わせるための仕組みです。
---

# パイプ

## 正式名称

**Pipe**

## 一言でいうと

**左側のコマンドの出力を右側のコマンドへ渡す仕組み**

## 初心者向け説明

たとえばps aux | grep javaとすると、ps auxの出力をgrepへ渡し、javaを含む行だけを表示できます。小さなコマンドを組み合わせて処理できるLinuxらしい機能です。

## ポイント

- 左側のコマンドの出力を右側のコマンドへ渡す仕組み
- たとえばps aux | grep javaとすると、ps auxの出力をgrepへ渡し、javaを含む行だけを表示できます。小さなコマンドを組み合わせて処理できるLinuxらしい機能です。
- Linuxサーバーの構築・運用を理解するうえで重要な基礎用語

## 関連用語

- [grep](/glossary/grep)
- [リダイレクト](/glossary/redirection)
- [CLI](/glossary/cli)

## 関連記事

- Linuxでテキストを編集・検索しよう｜nano・vi・grep・findを初心者向けに解説

## 🍯 はちみつメモ

> **パイプ = 左側のコマンドの出力を右側のコマンドへ渡す仕組み**
