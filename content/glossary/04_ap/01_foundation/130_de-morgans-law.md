---
title: ド・モルガンの法則
slug: de-morgans-law
category: 基礎理論
type: glossary
draft: false
term: ド・モルガンの法則
summary: >-
  ド・モルガンの法則とは、ANDやORで結ばれた条件全体を否定すると、ANDとORが入れ替わり、それぞれの条件も否定されるという法則です。
---

# ド・モルガンの法則

## 正式名称

**De Morgan's Laws（ド・モルガンの法則）**

## 一言でいうと

**全体を否定するとANDとORが入れ替わる法則**

## 初心者向け説明

ド・モルガンの法則とは、ANDやORを含む論理式を否定したときに成り立つ関係です。

代表的な形は、

```text
NOT (A AND B)
=
(NOT A) OR (NOT B)
```

と、

```text
NOT (A OR B)
=
(NOT A) AND (NOT B)
```

です。

つまり、式全体を否定すると、

```text
AND ↔ OR
```

が入れ替わり、AとBにもそれぞれNOTが付きます。

この法則は論理演算だけでなく、集合の和集合・積集合・補集合でも成り立ちます。

## ポイント

- ANDを否定するとORに変わる
- ORを否定するとANDに変わる
- それぞれの条件にもNOTが付く

## 関連用語

- [AND](/glossary/and)
- [OR](/glossary/or)
- [NOT](/glossary/not)

## 関連記事

- 集合と論理とは？命題・逆裏対偶・論理演算を基礎から理解しよう

## 🍯 はちみつメモ

> **ド・モルガンの法則 = 全体を否定するとANDとORが入れ替わる**