---
title: "Nutanixのライセンスとは？NCIのエディションとライセンス管理を理解しよう【NCA 7.5対策】"
slug: nutanix-license
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix Cloud Infrastructure（NCI）のライセンスについて、Starter・Pro・Ultimateの違いやPrism Centralを利用したライセンス管理の基本を初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix Cloud Infrastructure（NCI）のライセンスについて、Starter・Pro・Ultimateの違いやPrism Centralを利用したライセンス管理の基本を初心者向けに解説します。"
---

# Nutanixのライセンスとは？NCIのエディションとライセンス管理を理解しよう【NCA 7.5対策】

## はじめに

前回は、

**LCM（Life Cycle Manager）**

について学びました。

LCMを利用することで、Nutanix環境のSoftwareやFirmwareについて、

```text
Inventory
    ↓
Pre-Check
    ↓
Update
```

という流れでライフサイクル管理を行えました。

今回は、Nutanix環境を利用するときにもう一つ重要となる、

**License（ライセンス）**

について学んでいきます。

Nutanixには利用する製品や機能に応じたライセンスがあり、契約しているライセンスによって利用できる機能が異なります。

NCA対策では、

**「どのライセンスでどの細かな機能が使えるか」**

をすべて暗記するよりも、

- Nutanixには複数のSoftware Editionがある
- Editionによって利用できる機能が異なる
- ライセンスはPrismなどから管理する
- Clusterを拡張した場合にはライセンスも意識する

といった基本的な考え方を理解しておきましょう。

---

# Nutanix Cloud Infrastructure（NCI）とは？

現在のNutanixを理解するときに重要なのが、

**NCI**

です。

NCIは、

**Nutanix Cloud Infrastructure**

の略です。

NCIは、Compute・Storage・Networkなどを統合して提供するNutanixのインフラストラクチャ向けソフトウェアです。

これまでの記事で学習してきた、

- AHV
- VM
- Storage
- Network
- Data Protection
- Cluster

などの機能と深く関係しています。

簡単にイメージすると、

```text
Nutanix Cloud Infrastructure
            │
     ┌──────┼──────┐
     ▼      ▼      ▼
  Compute Storage Network
```

という形です。

---

# NCIには複数のEditionがある

NCIには主に、

- Starter
- Pro
- Ultimate

というSoftware Editionがあります。

```text
NCI

├─ Starter
├─ Pro
└─ Ultimate
```

Editionによって利用できる機能の範囲が異なります。

大まかな考え方としては、

```text
Starter
   ↓
基本的な機能

Pro
   ↓
より高度なデータサービスや
管理・可用性機能

Ultimate
   ↓
より高度なインフラ要件に
対応する機能
```

という関係です。

---

# Starterとは？

**Starter**は、NCIの基本的なSoftware Editionです。

比較的小規模な環境や、必要な機能が限定されたワークロードなどを想定したEditionです。

基本的なNutanixインフラストラクチャ機能を利用できます。

イメージすると、

```text
Starter
  │
  └─ Nutanixの基本機能
```

です。

ただし、より高度な可用性やデータ効率化などの機能については、上位Editionが必要になる場合があります。

---

# Proとは？

**Pro**は、Starterより多くの機能を利用できるEditionです。

より大規模な環境や、複数のアプリケーションを運用する環境などで利用されます。

たとえばNCIの現行Software Optionでは、Starterよりも高度な、

- Data Service
- Resilience
- Management

などの機能が含まれます。

つまり、

```text
Starter
   ↓
基本的な環境

Pro
   ↓
より高度な運用・可用性
```

というイメージです。

---

# Ultimateとは？

**Ultimate**は、NCIのより高度な機能を利用できるEditionです。

複数サイトを利用する環境や、高度なセキュリティ要件など、より複雑なインフラストラクチャ要件を想定しています。

```text
Starter
   ↓
Pro
   ↓
Ultimate
```

と、利用できる機能の範囲が広がっていくイメージで覚えておきましょう。

---

# Editionによって何が変わる？

Editionによって違いが出る代表的な分野として、

- Cluster規模
- Resilience
- Data Protection
- Storage Efficiency
- Disaster Recovery
- Security

などがあります。

たとえば前の記事で登場した、

**Replication Factor**

についてもEditionによる違いがあります。

NCIの現行Software Optionでは、

```text
Starter
↓
RF2

Pro / Ultimate
↓
RF2 または RF3
```

という違いがあります。

つまり、以前学習した機能も、

**契約しているEditionによって利用可能な範囲が変わる**

ということです。

---

# ライセンスはなぜ必要？

NutanixのSoftwareを利用するためには、契約内容に応じたライセンスが必要です。

ライセンスによって、

**「この環境で、どの製品・機能を利用できるのか」**

が管理されます。

イメージすると、

```text
Nutanix Environment
        │
        ▼
     License
        │
        ▼
利用可能なSoftware / Feature
```

という関係です。

---

# ライセンス管理

Nutanixでは、ライセンスの状態を管理する仕組みが用意されています。

管理者はライセンス情報を確認し、

- どのLicenseが存在するか
- どの製品がLicenseされているか
- 現在のLicense Status
- Clusterで必要なLicense

などを管理します。

Nutanixのライセンス管理では、Prism Centralが重要な役割を持ちます。

---

# Prism Centralとライセンス

以前の記事で、

**Prism Central**

について学習しました。

Prism Centralは、

**複数のNutanix Clusterを集中管理するための仕組み**

でした。

ライセンスについても、Prism Centralから管理する仕組みがあります。

```text
Administrator
      │
      ▼
Prism Central
      │
      ▼
License Management
      │
 ┌────┼────┐
 ▼    ▼    ▼
Cluster A  Cluster B  Cluster C
```

複数Clusterを運用する環境でも、ライセンスを一元的に扱いやすくなります。

---

# License Managerとは？

Nutanixのライセンス管理では、

**License Manager**

という仕組みがあります。

License Managerは、Nutanix環境のライセンス管理を行うためのサービスです。

簡単に表すと、

```text
License Manager
      │
      ├─ License確認
      ├─ Status確認
      └─ License管理
```

という役割を持ちます。

ライセンス管理のための機能も、Nutanixの管理環境に統合されています。

---

# Nutanix Support Portalとの関係

ライセンス管理では、

**Nutanix Support Portal**

も関係します。

大まかなイメージとして、

```text
Nutanix Support Portal
          │
          ▼
    License Information
          │
          ▼
   Prism / License Manager
          │
          ▼
    Nutanix Cluster
```

という関係になります。

オンライン環境では、Nutanix Support Portalとの連携によってライセンス管理を行えます。

---

# Connected SiteとDark Site

前回のLCMでも、

**Dark Site**

が登場しました。

ライセンス管理でも、インターネットへ接続できる環境と、接続できない環境では手順が異なります。

## Connected Site

Internetへ接続可能な環境です。

```text
Nutanix Environment
        │
        ▼
     Internet
        │
        ▼
Nutanix Support Portal
```

オンラインでNutanixのサービスと連携できます。

## Dark Site

Internetへ直接接続できない、または外部接続が制限されている環境です。

```text
Nutanix Environment
        │
        ×
     Internet
```

この場合には、ファイルを利用するなどオフライン向けのライセンス操作が必要になる場合があります。

---

# Clusterを拡張したら？

前々回の記事では、

**Scale-Out**

について学びました。

Nutanixでは、

```text
Node 1
Node 2
Node 3

   ↓ Node追加

Node 1
Node 2
Node 3
Node 4
```

のようにNodeを追加してClusterを拡張できます。

ここで注意したいのがライセンスです。

Clusterのリソースを増やした場合、

**追加したリソースについて必要なライセンスを確認する**

必要があります。

つまり、

```text
Cluster拡張
    ↓
Resource増加
    ↓
License確認
```

という運用上のつながりがあります。

---

# Core-Based Licensing

NCIでは、物理CPU Core数を基準としたライセンスモデルが利用される製品があります。

たとえば、

```text
Node 1
16 Cores

Node 2
16 Cores

Node 3
16 Cores
```

という環境であれば、Cluster全体の対象となるCore Capacityを意識してライセンスを考えます。

そのためNodeを追加すると、

```text
Before

16 + 16 + 16
     ↓
48 Cores


After

16 + 16 + 16 + 16
        ↓
64 Cores
```

のように対象となるCore Capacityが増加します。

Cluster拡張とライセンス管理が関係する理由の一つです。

---

# LicenseとSoftware Versionは別物

ここも混同しないようにしましょう。

**License**

は、

> どのSoftwareや機能を利用する権利があるのか

に関係します。

一方、

**Software Version**

は、

> 現在どのVersionのSoftwareを利用しているのか

という情報です。

```text
License
↓
利用できる機能


Version
↓
Softwareの世代
```

つまり、

**License管理**

と

**LCMによるVersion管理**

は別のものです。

---

# LCMとの違い

前回の記事とつなげると分かりやすくなります。

LCMは、

```text
AOS
AHV
Firmware
など

↓
Version確認・Update
```

を行います。

一方、License Managerは、

```text
NCIなど
↓
License確認・管理
```

を行います。

整理すると、

| 機能 | 主な役割 |
|---|---|
| LCM | Software / Firmwareのライフサイクル管理 |
| License Manager | Licenseの管理 |
| Prism | Nutanix環境全体の管理インターフェース |

この違いを理解しておきましょう。

---

# EditionとVersionも違う

もう一つ注意したいのが、

**Edition**

と

**Version**

です。

たとえば、

```text
Edition
Starter
Pro
Ultimate
```

は、利用できる機能の範囲に関係します。

一方、

```text
Version
7.x
```

のようなVersionは、Softwareのリリース世代に関係します。

つまり、

```text
Edition
↓
どの機能を利用できるか


Version
↓
どの世代のSoftwareか
```

です。

NCAの問題を読むときも、この2つを混同しないようにしましょう。

---

# Starter・Pro・Ultimateを全部暗記する必要はある？

NCA対策としては、すべての機能差を丸暗記するより、

**Editionによって利用できる機能が異なる**

という考え方をまず理解することが重要です。

基本として、

```text
Starter
↓
基本的な機能


Pro
↓
より高度な機能


Ultimate
↓
さらに高度な機能
```

という関係を押さえます。

そのうえで、

- RF3
- Advanced Data Protection
- Security
- Multi-Site

など高度な機能について、Editionとの関係を確認していくと理解しやすくなります。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

お店で使う業務システムに、

**3種類の契約プラン**

があるとします。

```text
Starter Plan
↓
基本機能


Pro Plan
↓
基本機能 + 高度な機能


Ultimate Plan
↓
さらに多くの機能
```

これがNCIのEditionのイメージです。

Starterを契約しているのに、

「Ultimateの機能を使いたい！」

と言っても、その契約では利用できません。

つまり、

**License = どの機能を使える契約なのか**

を管理するものです。

---

# 店舗を増やしたら？

最初は3店舗だったとします。

```text
名古屋店
東京店
大阪店
```

その後、福岡店を追加しました。

```text
名古屋店
東京店
大阪店
福岡店 ← New
```

店舗が増えれば、利用するシステムの規模も大きくなります。

そのため、

**「新しい店舗分の契約は足りている？」**

と確認する必要があります。

これがNutanixでNodeを追加したときにライセンスを確認するイメージです。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| NCI | Nutanix Cloud Infrastructure |
| Starter | 基本的なNCI Edition |
| Pro | より高度な機能を提供 |
| Ultimate | より高度・複雑な要件に対応 |
| License | Softwareや機能の利用権を管理 |
| License Manager | NutanixのLicense管理機能 |
| Prism Central | License管理でも重要 |
| Nutanix Support Portal | License情報・操作に関係 |
| Connected Site | Internet接続可能な環境 |
| Dark Site | Internet接続がない・制限された環境 |
| Core-Based Licensing | CPU Core Capacityを基準とするライセンス方式 |
| LCM | Software / FirmwareのVersion・Update管理 |

特に、

```text
Edition
↓
利用できる機能


License
↓
利用する権利


Version
↓
Softwareの世代
```

という違いを整理しておきましょう。

---

# ここまでの運用管理を整理

Prismを中心に考えると、これまで学習した管理機能は次のようにつながります。

```text
                 Prism
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
       VM         LCM      License
                   │          │
              Version管理  利用権管理
                   │          │
               Update     Edition
```

さらにClusterの状態については、

```text
Prism
  │
  ▼
Health / Alert / Event
```

を利用して確認します。

つまり、Nutanixの運用では、

**構成を管理する**

だけでなく、

**Version**

**License**

**Health**

も管理する必要があります。

---

# まとめ

今回はNutanixのライセンスについて学びました。

現在のNutanix Cloud Infrastructureでは、

- Starter
- Pro
- Ultimate

という主なSoftware Editionがあり、Editionによって利用できる機能が異なります。

またライセンスは、Prism CentralやLicense Managerなどを利用して管理します。

ClusterへNodeを追加してリソースを増やした場合には、ライセンスについても確認する必要があります。

そして、

**License = 利用する権利**

**Edition = 利用できる機能の範囲**

**Version = Softwareの世代**

という違いを理解しておくことが重要です。

NCAでは細かなSKUを暗記するよりも、

**「Nutanixのライセンスがどのように管理され、Clusterの運用とどう関係するのか」**

という全体像を理解しておきましょう。

次回は、Nutanix Clusterが正常に動作しているか確認するための**NCC（Nutanix Cluster Check）とHealth Check**について学んでいきます。