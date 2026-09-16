---
title: 正解率
slug: accuracy
category: 基礎理論
type: glossary
draft: false
term: 正解率
summary: >-
  正解率とは、分類モデルによる全ての予測のうち、正しく予測できた割合です。
---

# 正解率

## 正式名称

**Accuracy**

## 一言でいうと

**予測全体のうち何割正解したか**

## 初心者向け説明

正解率は、

```text
Accuracy
=
(TP + TN)
/
(TP + FP + TN + FN)
```

で求めます。

例えば100件を予測して90件正解した場合、

```text
90 / 100 = 0.9
```

なので正解率は90%です。

## ポイント

- 分類モデルの評価指標
- 全予測に対する正解の割合
- データに偏りがある場合はAccuracyだけで判断しない

## 関連用語

- [混同行列](/glossary/confusion-matrix)
- [適合率](/glossary/precision)
- [再現率](/glossary/recall)

## 関連記事

- AI（人工知能）とは？機械学習・ディープラーニング・生成AIまで応用情報向けに理解しよう

## 🍯 はちみつメモ

> **Accuracy = 全部の予測のうち、どれだけ当たった？**

---

