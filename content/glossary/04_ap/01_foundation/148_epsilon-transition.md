---
title: ε遷移
slug: epsilon-transition
category: 基礎理論
type: glossary
draft: false
term: ε遷移
summary: >-
  ε遷移とは、入力記号を読み取らずに、ある状態から別の状態へ移動する状態遷移です。
---

# ε遷移

## 正式名称

**Epsilon Transition（イプシロン遷移）**

## 一言でいうと

**入力を読まずに別の状態へ移動する遷移**

## 初心者向け説明

ε遷移とは、入力文字を1文字も読み取らずに状態を移動する状態遷移です。

例えば、

```text
q0 --ε--> q1
```

なら、入力を消費せずにq0からq1へ移動できます。

主にNFAで利用される考え方です。

## ポイント

- 入力文字を消費しない
- NFAで利用される
- DFAでは使用しない

## 関連用語

- [NFA](/glossary/nfa)
- [DFA](/glossary/dfa)
- [状態遷移](/glossary/state-transition)

## 関連記事

- オートマトンとは？状態遷移図・有限オートマトン・DFAとNFAを基礎から理解しよう

## 🍯 はちみつメモ

> **ε遷移 = 入力を読まずに状態だけ移動する**

---

