---
title: "Nutanix LCMとは？Inventory・Pre-Check・アップデートを理解しよう【NCA 7.5対策】"
slug: nutanix-lcm
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix Life Cycle Manager（LCM）の役割と、Inventory・Pre-Check・ソフトウェア／ファームウェアアップデートの基本的な流れを初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix Life Cycle Manager（LCM）の役割と、Inventory・Pre-Check・ソフトウェア／ファームウェアアップデートの基本的な流れを初心者向けに解説します。"
---

# Nutanix LCMとは？Inventory・Pre-Check・アップデートを理解しよう【NCA 7.5対策】

## はじめに

前回は、Nutanix Clusterについて学びました。

Nutanix Clusterでは複数のNodeが連携し、

- AHV
- AOS
- CVM
- Storage
- Network

など、さまざまなコンポーネントが動作しています。

しかし、システムを構築したら終わりではありません。

長期間運用していくと、

「AOSを新しいバージョンにしたい」

「AHVをアップデートしたい」

「ファームウェアも更新したい」

といった作業が必要になります。

そこで登場するのが、

**LCM（Life Cycle Manager）**

です。

今回はNutanix環境のアップデートを管理するLCMについて学んでいきましょう。

---

# LCMとは？

LCMは、

**Life Cycle Manager**

の略です。

Nutanix環境のソフトウェアや対応するハードウェアファームウェアについて、

**現在のバージョンを把握し、アップデートを管理するための仕組み**

です。

簡単に表すと、

```text
Nutanix Cluster
      │
      ▼
     LCM
      │
 ┌────┴────┐
 ▼         ▼
確認      更新
```

というイメージです。

複数のコンポーネントを個別に確認して手作業でアップデートするのではなく、LCMを利用してライフサイクル管理を行います。

---

# なぜLCMが必要なの？

Nutanix環境にはさまざまなコンポーネントがあります。

たとえば、

```text
Nutanix Environment

├─ AOS
├─ AHV
├─ Prism
├─ NCC
├─ Foundation
├─ BIOS
├─ BMC
├─ NIC Firmware
└─ Storage Firmware
```

などです。

これらには、それぞれバージョンがあります。

管理者がすべてについて、

「今のバージョンは？」

「新しいバージョンは？」

「この組み合わせで更新して大丈夫？」

「どの順番で更新すればいい？」

と確認するのは大変です。

LCMは、こうしたアップデート作業を簡素化するために利用されます。

---

# LCMで管理できるもの

LCMでは、Nutanixのソフトウェアや対応するハードウェアファームウェアのライフサイクルを管理できます。

代表的なソフトウェアとして、

- AOS
- AHV
- Prism
- NCC
- Foundation

などがあります。

さらに対応する環境では、

- BIOS
- BMC
- NIC
- SSD / HDD
- HBA

などのファームウェアも対象になります。

つまりLCMは、

**Nutanixソフトウェアだけを更新する機能ではない**

という点が重要です。

---

# LCMの基本的な流れ

LCMを理解するときは、大きく、

```text
Inventory
    ↓
利用可能なUpdateを確認
    ↓
Pre-Check
    ↓
Update
    ↓
更新後の確認
```

という流れをイメージすると分かりやすいでしょう。

特にNCA対策では、

**Inventory**

が重要なキーワードです。

---

# Inventoryとは？

**Inventory**は、Nutanix環境に存在するコンポーネントと、そのバージョンなどを確認する処理です。

たとえば、

```text
Inventory

AOS        → Version A
AHV        → Version B
NCC        → Version C
BIOS       → Version D
BMC        → Version E
```

といった情報を収集します。

つまり、

> **現在のNutanix環境がどのような状態なのかを把握する**

ための処理です。

---

# Inventoryはアップデートではない

ここは非常に重要です。

**Inventoryを実行しただけでは、AOSやAHVがアップデートされるわけではありません。**

Inventoryは基本的に、

**現在の構成やバージョンを調査する処理**

です。

```text
Inventory
↓
調査・情報収集


Update
↓
実際にバージョンを更新
```

この違いをしっかり理解しておきましょう。

---

# Inventoryを実行すると何が分かる？

Inventoryを実行すると、LCMはCluster内の対応するコンポーネントを確認します。

その結果、

- 現在のVersion
- Component情報
- 利用可能なUpdate

などを判断するための情報が得られます。

イメージすると、

```text
LCM
 │
 │ Inventory
 ▼
Nutanix Cluster
 │
 ├─ AOS
 ├─ AHV
 ├─ NCC
 ├─ Firmware
 └─ Hardware
```

という形です。

その後、利用可能なアップデートを確認して、必要な更新を選択します。

---

# Updateとは？

Inventoryによって現在の状態を確認したら、必要に応じてコンポーネントをアップデートします。

たとえば、

```text
AOS

Current Version
      ↓
New Version
```

という処理です。

LCMでは管理者が選択したコンポーネントについてアップデートを実行できます。

---

# 依存関係も重要

Nutanix環境では、

「好きなコンポーネントを好きな順番で更新すればいい」

というわけではありません。

ソフトウェアやファームウェアには、

**Dependency（依存関係）**

があります。

たとえば、

```text
Component A
     ↓
Component B
     ↓
Component C
```

という関係がある場合、適切な順序でアップデートする必要があります。

LCMはコンポーネント間の依存関係や互換性を考慮し、アップデート処理をオーケストレーションします。

---

# Pre-Checkとは？

アップデートで重要なのが、

**Pre-Check**

です。

Pre-Checkは、

> **アップデートを実行する前に、Clusterが更新可能な状態であるか確認する処理**

です。

たとえば、

- ClusterのHealth
- 利用可能なCapacity
- Version
- 更新に影響する問題

などを事前に確認します。

```text
Update開始
    │
    ▼
 Pre-Check
    │
 ┌──┴──┐
 ▼     ▼
OK    Problem
 │       │
 ▼       ▼
続行    確認・対処
```

問題を抱えたままアップデートを開始するリスクを減らすための重要な処理です。

---

# なぜPre-Checkが重要なの？

アップデート中に問題が発生すると、ClusterやVMへ影響する可能性があります。

そのため、

```text
いきなりUpdate
      ×

状態確認
  ↓
Pre-Check
  ↓
Update
      ○
```

という流れが重要です。

NutanixのLCMでは、アップグレード前にヘルスチェックなどを行い、問題を事前に検出できるようになっています。

---

# LCMとNCCの関係

Pre-CheckやClusterのHealthを理解するときに登場するのが、

**NCC**

です。

NCCは、

**Nutanix Cluster Check**

の略です。

Nutanix Clusterの状態を確認するためのヘルスチェックツールです。

たとえば、

```text
NCC
 │
 ▼
Cluster Check
 │
 ├─ Configuration
 ├─ Services
 ├─ Hardware
 └─ Health
```

といった形でClusterの状態確認に利用されます。

LCMによるアップデートでも、Clusterが正常な状態であることを確認することが重要です。

NCCについては、後の記事で詳しく解説します。

---

# ソフトウェアアップデート

LCMではNutanixのさまざまなソフトウェアをアップデートできます。

代表例として、

```text
Software

├─ AOS
├─ AHV
├─ Prism
├─ NCC
└─ Foundation
```

などがあります。

Nutanix環境では複数のソフトウェアが連携しているため、LCMを利用して互換性や依存関係を考慮しながら更新します。

---

# Firmwareとは？

LCMを理解するときには、

**Firmware（ファームウェア）**

についても知っておきましょう。

Firmwareとは、ハードウェアを制御するためのソフトウェアです。

たとえば、

- BIOS
- BMC
- NIC
- SSD
- HDD
- HBA

などにはFirmwareがあります。

```text
Hardware
   │
   └─ Firmware
```

LCMは対応するハードウェアについて、こうしたFirmwareのアップデートにも利用できます。

---

# BMCとは？

ファームウェアの話で登場する、

**BMC**

についても簡単に覚えておきましょう。

BMCは、

**Baseboard Management Controller**

の略です。

サーバーのハードウェアを管理するためのコントローラーで、

- 電源
- Hardware Status
- Remote Management

などに利用されます。

Nutanixのハードウェア管理でも登場する用語なので覚えておきましょう。

---

# BIOSとは？

**BIOS**は、

**Basic Input/Output System**

の略です。

サーバーの起動時にハードウェアを初期化し、OSやHypervisorの起動につなげる重要なFirmwareです。

```text
Power ON
   ↓
BIOS
   ↓
Hardware Initialization
   ↓
AHV
   ↓
VM
```

Nutanix Clusterも物理サーバー上で動いているため、こうしたハードウェア側のFirmware管理も必要になります。

---

# アップデート時にNodeはどうなる？

複数Nodeで構成されたClusterでは、アップデート時にもサービスへの影響をできるだけ抑えることが重要です。

イメージすると、

```text
Cluster

Node 1 → Update
Node 2 → Running
Node 3 → Running
```

のように、Cluster全体を一度に停止させるのではなく、可用性を考慮しながら更新処理を進めます。

そのためにも、

**更新前にClusterが正常で、十分なリソースや耐障害性を確保できていること**

が重要になります。

---

# Rolling Upgradeという考え方

このように複数のNodeを順番に更新していく考え方を、

**Rolling Upgrade**

と呼びます。

イメージすると、

```text
Step 1

Node 1 → Update
Node 2 → Running
Node 3 → Running


Step 2

Node 1 → Running
Node 2 → Update
Node 3 → Running


Step 3

Node 1 → Running
Node 2 → Running
Node 3 → Update
```

という形です。

Cluster全体を同時に停止して更新するのではなく、Nodeを順番に処理することでサービスへの影響を抑えます。

---

# PrismとLCMの関係

LCMはNutanixの管理インターフェースであるPrismから利用します。

大まかには、

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
     LCM
      │
 ┌────┴────┐
 ▼         ▼
Inventory Update
```

という関係です。

つまり、

**Prism = Nutanix環境全体を管理するインターフェース**

**LCM = その中でライフサイクル管理を担当する機能**

と考えると分かりやすいでしょう。

---

# LCMとFoundationの違い

ここも名前を混同しやすいため整理しておきましょう。

**LCM**

は、

> 既存のNutanix環境のソフトウェアやFirmwareをライフサイクル管理する

ために利用します。

一方、

**Foundation**

は、Nutanix Nodeの初期展開などで利用されるツールです。

簡単に表すと、

```text
Foundation
↓
Nutanix環境を展開する


LCM
↓
展開後の環境を更新・維持する
```

と考えると分かりやすいでしょう。

なお、Foundation自体もLCMで更新対象となるNutanixソフトウェアの一つです。

---

# Dark Siteとは？

LCMについて勉強すると、

**Dark Site**

という言葉を見ることがあります。

Dark Siteとは、インターネットへ直接接続できない、または外部接続が厳しく制限された環境です。

```text
Internet
   ×
   │
Firewall
   │
Nutanix Environment
```

通常の環境ではインターネット経由で更新情報やパッケージを取得できますが、Dark Siteでは別の方法でアップデートファイルなどを準備する必要があります。

LCMには、こうしたインターネット接続が制限された環境でアップデートを行うための仕組みも用意されています。

---

# LCMの流れをもう一度整理

ここまでの内容をまとめると、

```text
① Inventory
      ↓
現在のVersion・Componentを確認

② Updates確認
      ↓
利用可能なUpdateを確認

③ Pre-Check
      ↓
Clusterが更新可能な状態か確認

④ Update
      ↓
Software / Firmwareを更新

⑤ 確認
      ↓
Cluster HealthやVersionを確認
```

となります。

NCA対策では、この流れを頭の中でイメージできるようにしておきましょう。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

複数店舗で使っている、

- レジ
- 冷蔵庫
- 在庫管理システム
- 注文システム

などがあります。

これらにも定期的なメンテナンスが必要です。

そこで本部が、

**「各店舗の設備が今どのバージョンなのか確認しよう」**

と調査します。

これが、

**Inventory**

です。

```text
Inventory

名古屋店
レジ Version 1

東京店
レジ Version 2

大阪店
レジ Version 1
```

次に、

**「新しいVersion 3が使える！」**

と分かりました。

しかし、いきなり全部更新するのは危険です。

そこで、

**「設備は正常？」**

**「更新するための条件は満たしている？」**

と事前確認します。

これが、

**Pre-Check**

です。

問題がなければ、

```text
名古屋店
 ↓
東京店
 ↓
大阪店
```

のように順番に更新していきます。

これがLCMによるライフサイクル管理のイメージです。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| LCM | Life Cycle Manager |
| Inventory | 現在のComponentやVersionを確認 |
| Update | Componentを実際に更新 |
| Pre-Check | Update前にCluster状態などを確認 |
| Dependency | Component間の依存関係 |
| NCC | Nutanix Cluster Check |
| Firmware | Hardwareを制御するSoftware |
| BMC | サーバーのHardware管理用Controller |
| Rolling Upgrade | Nodeなどを順番に更新する考え方 |
| Foundation | Nutanix環境の初期展開などに利用 |
| Dark Site | Internet接続がない・制限された環境 |

特に、

```text
Inventory
   ↓
Pre-Check
   ↓
Update
```

という基本的な流れを覚えておきましょう。

---

# ここまでのNutanix運用をつなげよう

これまでの内容を運用目線で整理すると、

```text
              Prism
                │
        ┌───────┼───────┐
        ▼       ▼       ▼
       VM     Health    LCM
                         │
                    Inventory
                         │
                    Pre-Check
                         │
                      Update
                         │
              ┌──────────┴─────────┐
              ▼                    ▼
           Software             Firmware
```

となります。

Nutanixでは、Prismから日常的なVM管理や監視を行い、LCMを利用してSoftwareやFirmwareのライフサイクルを管理していきます。

---

# まとめ

今回はNutanixの、

**LCM（Life Cycle Manager）**

について学びました。

LCMは、Nutanix環境のソフトウェアや対応するハードウェアFirmwareのバージョンを確認し、アップデートを管理するための仕組みです。

重要なのは、

**Inventory = 現在の状態を確認する**

**Pre-Check = 更新前に問題がないか確認する**

**Update = 実際に更新する**

という違いです。

またNutanix環境では、

- AOS
- AHV
- Prism
- NCC
- Foundation
- Hardware Firmware

など複数のコンポーネントが存在します。

LCMは、こうしたコンポーネントの依存関係や互換性を考慮しながらアップデートを管理します。

NCAでは単に、

**「LCM = アップデート機能」**

と覚えるのではなく、

**Inventory → Pre-Check → Update**

という実際の運用の流れとして理解しておきましょう。

次回は、Nutanix環境を利用するために必要となる**ライセンスとライセンス管理**について学んでいきます。