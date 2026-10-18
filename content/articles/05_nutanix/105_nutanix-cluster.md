---
title: "Nutanix Clusterとは？Node・Block・Fault Toleranceを理解しよう【NCA 7.5対策】"
slug: nutanix-cluster
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix Clusterの基本構成をNode・Block・CVM・Fault Toleranceなどの重要用語とともに初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix Clusterの基本構成をNode・Block・CVM・Fault Toleranceなどの重要用語とともに初心者向けに解説します。"
---

# Nutanix Clusterとは？Node・Block・Fault Toleranceを理解しよう【NCA 7.5対策】

## はじめに

これまでの記事では、Nutanixを構成するさまざまな技術について学んできました。

特に何度も登場しているのが、

**Cluster（クラスタ）**

です。

Nutanixでは、複数のNodeをまとめてClusterを構成し、その上でVMを動作させたり、分散ストレージを利用したりします。

では、

- Nodeとは具体的に何なのか
- Blockとは何なのか
- なぜ複数NodeでClusterを構成するのか
- Nodeに障害が発生したらどうなるのか

といった部分を、今回は詳しく見ていきましょう。

---

# Nutanix Clusterとは？

**Cluster**とは、複数のNutanix Nodeをまとめて1つのシステムとして利用する構成です。

イメージすると、

```text
          Nutanix Cluster

┌─────────┐ ┌─────────┐ ┌─────────┐
│ Node 1  │ │ Node 2  │ │ Node 3  │
└─────────┘ └─────────┘ └─────────┘
```

となります。

各Nodeには、

- CPU
- Memory
- Storage
- Network Interface
- Hypervisor
- CVM

などがあります。

それぞれのNodeが持っているリソースを利用して、Cluster全体として仮想化環境を提供します。

---

# Nodeとは？

**Node**は、Nutanix Clusterを構成する1台のサーバーです。

たとえばAHV環境のNodeを簡略化すると、

```text
┌──────────────────────┐
│        Node          │
│                      │
│   VM    VM    CVM    │
│                      │
├──────────────────────┤
│        AHV           │
├──────────────────────┤
│ CPU / Memory         │
│ SSD / NVMe / HDD     │
│ Physical NIC         │
└──────────────────────┘
```

という構造になります。

つまりNodeは、

> **Nutanix Clusterを構成する基本単位となる物理サーバー**

です。

---

# ClusterとNodeの関係

Nutanixでは、複数のNodeが協力して動作します。

たとえば、

```text
Cluster

├─ Node 1
├─ Node 2
├─ Node 3
└─ Node 4
```

というClusterがあるとします。

それぞれのNodeで、

- VMを実行する
- ストレージを提供する
- CVMを動作させる

などの役割を担います。

そのため、1台の巨大なサーバーにすべてを集中させるのではなく、

**複数のNodeへリソースを分散させる**

のがNutanixの基本的な考え方です。

---

# Blockとは？

Nutanixのハードウェアについて学ぶと、

**Block（ブロック）**

という言葉も登場します。

Blockは、1台または複数のNodeを収容する**物理的なシャーシ単位**です。

イメージすると、

```text
Block

┌─────────────────────────┐
│ Node 1                  │
├─────────────────────────┤
│ Node 2                  │
├─────────────────────────┤
│ Node 3                  │
├─────────────────────────┤
│ Node 4                  │
└─────────────────────────┘
```

という形です。

ここで重要なのは、

**NodeとBlockは同じものではない**

ということです。

---

# Node・Block・Clusterの違い

整理すると、

| 用語 | 意味 |
|---|---|
| Node | Clusterを構成するサーバー |
| Block | Nodeを収容する物理シャーシ |
| Cluster | 複数Nodeをまとめた論理的なシステム |

イメージすると、

```text
Cluster
│
├─ Block 1
│   ├─ Node 1
│   ├─ Node 2
│   └─ Node 3
│
└─ Block 2
    ├─ Node 4
    ├─ Node 5
    └─ Node 6
```

となります。

NCAでは、この3つを混同しないようにしましょう。

---

# なぜ複数Nodeを利用するの？

複数のNodeでClusterを構成する理由はいくつかあります。

代表的なのが、

- リソースの集約
- 拡張性
- 可用性
- 障害への対応

です。

たとえばNode 1台だけですべてを動かしている場合、そのNodeに障害が発生すると大きな影響が出ます。

```text
Node 1
 │
障害
 │
 ▼
サービス停止
```

一方、複数Nodeを利用することで、障害の影響を分散できます。

---

# Scale-Out

Nutanixの特徴として重要なのが、

**Scale-Out（スケールアウト）**

です。

システムのリソースが不足してきた場合、Nodeを追加することでClusterを拡張できます。

```text
現在

[Node 1][Node 2][Node 3]

        ↓

リソース不足

        ↓

[Node 1][Node 2][Node 3][Node 4]
                           ↑
                          追加
```

Nodeを追加することで、

- CPU
- Memory
- Storage

などのリソースを増やしていくことができます。

---

# Scale-Upとの違い

Scale-Outと一緒に覚えておきたいのが、

**Scale-Up（スケールアップ）**

です。

Scale-Upでは、既存サーバー自体を高性能化します。

```text
Scale-Up

CPU 8 Core
Memory 64GB

     ↓

CPU 32 Core
Memory 256GB
```

一方、Scale-Outではサーバー自体を増やします。

```text
Scale-Out

Server × 3

    ↓

Server × 4
```

Nutanixでは、Nodeを追加してClusterを拡張していくScale-Outの考え方が重要です。

---

# CVMもClusterとして連携する

各Nodeには基本的にCVMがあります。

```text
Node 1        Node 2        Node 3

[CVM] ←────→ [CVM] ←────→ [CVM]
```

これらのCVMがCluster内で連携することで、Nutanixの各種サービスを提供します。

つまりCVMは、

**Node単体だけを見るためのVM**

ではなく、

**Cluster全体として連携して動作する**

という点が重要です。

---

# Clusterと分散ストレージ

前回学習したDSFもClusterを前提とした仕組みです。

各Nodeが持つStorageを、

```text
Node 1        Node 2        Node 3

Storage       Storage       Storage
   ＼            │            ／
    ＼           │           ／
            DSF
             │
             ▼
    Distributed Storage
```

のように分散ストレージとして利用します。

そのためNutanixでは、

**ComputeだけでなくStorageも複数Nodeに分散している**

という点が重要です。

---

# Fault Toleranceとは？

Clusterを利用する大きな理由の一つが、

**Fault Tolerance（耐障害性）**

です。

Faultは「障害」、Toleranceは「耐える」という意味があります。

つまり、

> **一部に障害が発生しても、システム全体としてサービスを継続できるようにする考え方**

です。

---

# Nodeに障害が発生したら？

たとえば3台のNodeでClusterを構成しているとします。

```text
Cluster

Node 1
Node 2
Node 3
```

ここでNode 2に障害が発生したとします。

```text
Node 1 → OK

Node 2 → Failure

Node 3 → OK
```

Nutanixでは複数NodeによってClusterを構成しているため、残ったNodeを利用してサービスを継続できるような仕組みが用意されています。

ただし、

**「Clusterならどんな障害でも必ず無停止になる」**

という意味ではありません。

Clusterの構成や障害の種類、利用できるリソースなどによって影響は異なります。

---

# VMとNode障害

Node上ではVMが動作しています。

たとえば、

```text
Node 1
├─ VM A
└─ VM B

Node 2
├─ VM C
└─ VM D

Node 3
├─ VM E
└─ VM F
```

という構成だったとします。

Node 2が完全に停止すると、そのNode上で動作していたVMも影響を受けます。

高可用性の仕組みが構成されていれば、利用可能な別Node上で対象VMを再起動することでサービス復旧を図ります。

そのためCluster全体には、障害時にVMを動作させるための十分なリソースが必要です。

---

# Storageの障害対策

Node障害ではVMだけでなく、Storageについても考える必要があります。

ここで前回登場した、

**Replication Factor（RF）**

がつながります。

たとえばRF2では、データを別の障害ドメインにも保持します。

```text
Node 1              Node 2

Data A ───────────→ Data A Copy
```

Node 1に障害が発生しても、別の場所に保持されているデータを利用できるようにします。

つまりNutanixでは、

**Compute側**

と

**Storage側**

の両方で障害を考える必要があります。

---

# Fault Domainとは？

障害対策を理解するうえで重要なのが、

**Fault Domain（障害ドメイン）**

という考え方です。

Fault Domainとは、

> **同じ障害の影響を受ける可能性がある範囲**

です。

たとえば、同じBlockに複数Nodeが存在する場合を考えてみます。

```text
Block 1

├─ Node 1
├─ Node 2
├─ Node 3
└─ Node 4
```

もしBlock全体に影響する障害が発生した場合、複数Nodeが同時に影響を受ける可能性があります。

そのためデータやリソースをどこへ配置するか考える際には、

**同じ障害でまとめて失われないようにする**

ことが重要です。

---

# Hardware Failure

Nutanix環境では、さまざまなハードウェア障害が考えられます。

たとえば、

- Disk Failure
- NIC Failure
- Node Failure
- Power Supply Failure

などです。

PrismではHardwareやHealth情報を確認し、こうした問題を把握できます。

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
Health / Hardware
      │
 ┌────┼─────┐
 ▼    ▼     ▼
Node  Disk  NIC
```

---

# Cluster Health

Clusterを運用するときには、

**Cluster Health**

を確認することが重要です。

Prismを利用することで、

- Nodeの状態
- Diskの状態
- Cluster Serviceの状態
- Alert
- Resource Usage

などを確認できます。

たとえば、

```text
Cluster Health

Node 1 → Healthy
Node 2 → Healthy
Node 3 → Warning
```

となっていれば、Node 3について詳しく確認します。

---

# Clusterを停止するとき

メンテナンスなどでClusterを停止する場合、

**単純にNodeの電源を全部切ればよい**

わけではありません。

Nutanixでは複数のCVMやサービスが連携しているため、適切な手順で停止する必要があります。

同様にClusterを起動するときも、Nutanixのサービスが正常に起動していることを確認します。

NCAでは、

> **Clusterのメンテナンスでは、NutanixのサービスやVMへの影響を考慮する必要がある**

という管理者視点も重要です。

---

# Nodeを追加するとどうなる？

Nutanix Clusterでは、Nodeを追加して拡張できます。

たとえば、

```text
Before

Node 1
Node 2
Node 3


After

Node 1
Node 2
Node 3
Node 4 ← New
```

Node 4をClusterへ追加することで、新しいComputeやStorageリソースを利用できるようになります。

これがNutanixにおけるScale-Outの基本的な考え方です。

---

# Nodeを削除するとき

反対に、ClusterからNodeを削除する場合もあります。

ただし、そのNodeには、

- VM
- Storage Data
- Nutanix Services

などが関係しています。

そのため、

**「NodeをClusterから抜くだけ」**

ではなく、VMやデータへの影響を考慮しながら適切な手順で処理する必要があります。

---

# ClusterとPrism

Cluster管理でもPrismが重要です。

これまでの関係を整理すると、

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
Nutanix Cluster
      │
 ┌────┼────┐
 ▼    ▼    ▼
Node Node Node
```

Prismから、

- Cluster状態
- Node状態
- VM
- Storage
- Network
- Health
- Alert
- Performance

などを確認できます。

つまりPrismは、Cluster運用の中心となる管理インターフェースです。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

1つの大きな「はちみつ屋チェーン」があります。

このチェーン全体が、

**Cluster**

です。

そして、

```text
名古屋店
東京店
大阪店
```

それぞれのお店が、

**Node**

です。

```text
はちみつ屋チェーン
     Cluster
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
名古屋店 東京店 大阪店
 Node    Node    Node
```

1店舗だけですべての商品を販売・保管するのではなく、複数店舗で協力してサービスを提供しています。

---

# Node障害をはちみつ屋さんで考える

名古屋店でトラブルが発生したとします。

```text
名古屋店
  ×

東京店
  ○

大阪店
  ○
```

名古屋店しか存在しなければ、営業できなくなってしまいます。

しかし複数店舗があれば、東京店や大阪店を利用してサービスを継続できる可能性があります。

さらに重要な商品については、

```text
名古屋店
はちみつA

東京店
はちみつA Copy
```

のように別店舗にも置いておきます。

これが前回学んだReplicationのイメージです。

つまり、

**複数店舗でサービスを分散する**

のがCluster、

**商品を複数店舗へ分散する**

のがStorageの冗長化、

という関係です。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| Cluster | 複数Nodeをまとめたシステム |
| Node | Clusterを構成する物理サーバー |
| Block | Nodeを収容する物理シャーシ |
| Scale-Out | Nodeを追加してClusterを拡張 |
| Scale-Up | 既存サーバー自体を高性能化 |
| Fault Tolerance | 障害が発生してもサービス継続を目指す仕組み・考え方 |
| Fault Domain | 同じ障害の影響を受ける範囲 |
| CVM | 各Nodeで動作しCluster内で連携 |
| RF | Storageデータの冗長性に関係 |
| Prism | ClusterやNodeの状態を管理・監視 |

特に、

```text
Cluster
  │
  ├─ Node
  │   └─ CVM
  │
  ├─ Node
  │   └─ CVM
  │
  └─ Node
      └─ CVM
```

という構造を理解しておきましょう。

---

# ここまでのNutanixを整理

ここまででNutanixの主要な構成がかなりつながってきました。

```text
                  Prism
                    │
                    ▼
             Nutanix Cluster
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
        Node      Node      Node
          │         │         │
         AHV       AHV       AHV
          │         │         │
       VM/CVM    VM/CVM    VM/CVM
          │         │         │
          └────── DSF ────────┘
                    │
            Distributed Storage
```

VMのネットワーク側では、

```text
VM
↓
vNIC
↓
Subnet
↓
VLAN
```

Storage側では、

```text
VM
↓
vDisk
↓
Storage Container
↓
Storage Pool
↓
DSF
```

という構成でした。

これらすべてがNutanix Cluster上で動作しています。

---

# まとめ

今回はNutanix Clusterについて学びました。

Nutanixでは、

**複数のNodeをまとめてClusterを構成**

します。

NodeにはCPU・Memory・Storageなどが存在し、AHVやCVMが動作します。

またNodeを追加することで、

**Scale-Out**

によるCluster拡張が可能です。

さらに複数Nodeを利用することで、障害発生時にもサービスを継続できるような高可用性の仕組みを構成できます。

今回特に覚えておきたいのは、

**Node = サーバー**

**Block = Nodeを収容する物理シャーシ**

**Cluster = 複数Nodeをまとめたシステム**

という違いです。

NCAでは、正常時の構成だけでなく、

**「NodeやDiskに問題が発生したときにClusterへどのような影響があるのか」**

という運用・障害対応の視点も意識して学習していきましょう。

次回は、構築したNutanix Clusterを安全に維持していくための**LCM（Life Cycle Manager）とソフトウェアアップデート**について学んでいきます。