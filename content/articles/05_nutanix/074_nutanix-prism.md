---
title: "Nutanix Prismとは？Prism ElementとPrism Centralの違いを理解しよう【NCA 7.5対策】"
slug: nutanix-prism
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix環境を管理するPrismについて、Prism ElementとPrism Centralの違いや管理できる項目、基本的な使い方を初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix環境を管理するPrismについて、Prism ElementとPrism Centralの違いや管理できる項目、基本的な使い方を初心者向けに解説します。"
---

# Nutanix Prismとは？Prism ElementとPrism Centralの違いを理解しよう【NCA 7.5対策】

## はじめに

これまでの記事では、Nutanixの基本的な仕組みについて学んできました。

Nutanixでは複数のNodeによってClusterを構成し、AHV上でVMやCVMが動作します。

さらにCVMが連携することで、Nutanixの分散ストレージなどの機能が提供されています。

では、管理者はこれらをどのように管理するのでしょうか？

NutanixのNodeへ1台ずつログインして管理するのでしょうか？

そこで登場するのが、

**Prism**

です。

Prismを利用することで、Nutanix環境のさまざまな情報をGUIから確認・管理できます。

今回はNCAでも重要となるPrismについて学んでいきましょう。

---

# Prismとは？

**Prism**は、Nutanix環境を管理・監視するための管理インターフェースです。

Webブラウザからアクセスでき、Nutanix環境に対してさまざまな管理操作を行えます。

たとえば、

- Clusterの確認
- Nodeの確認
- VMの管理
- Storageの管理
- Networkの管理
- Alertの確認
- Eventの確認
- Performanceの監視

などです。

つまり、

> **Nutanix環境を管理するためのコントロールパネル**

と考えると分かりやすいでしょう。

---

# なぜPrismが必要なの？

ここまでNutanixの仕組みを勉強すると、

```text
Cluster
 ├─ Node
 │   ├─ AHV
 │   ├─ CVM
 │   ├─ VM
 │   └─ Storage
 │
 ├─ Node
 │   ├─ AHV
 │   ├─ CVM
 │   └─ VM
 │
 └─ Node
```

のように、さまざまなコンポーネントが存在することが分かります。

これらをそれぞれ個別に管理するのは大変です。

そこでPrismを利用します。

```text
        Administrator
              │
              ▼
           Prism
              │
     ┌────────┼────────┐
     ▼        ▼        ▼
    VM      Storage   Network
     │
     ▼
   Cluster
```

管理者はPrismを通してNutanix環境を管理できます。

Nutanixが目指している、

**インフラ管理のシンプル化**

を実現するうえで重要な存在です。

---

# Prismには大きく2つある

Prismを学ぶときに重要なのが、

- **Prism Element**
- **Prism Central**

の違いです。

名前が似ていますが、管理する範囲が異なります。

大まかには、

```text
Prism Element
      ↓
1つのClusterを管理


Prism Central
      ↓
複数のClusterをまとめて管理
```

と考えると分かりやすいでしょう。

---

# Prism Elementとは？

**Prism Element（PE）**は、個々のNutanix Clusterを管理するためのインターフェースです。

たとえば、Nutanix Cluster Aがある場合、

```text
Administrator
      │
      ▼
Prism Element
      │
      ▼
┌─────────────────┐
│    Cluster A    │
│                 │
│ Node 1          │
│ Node 2          │
│ Node 3          │
└─────────────────┘
```

というイメージです。

Prism Elementでは、そのClusterに関する、

- Cluster
- Hosts
- VM
- Storage
- Network
- Hardware
- Health
- Alerts

などを確認・管理できます。

つまり、

> **1つのClusterを直接管理するPrism**

がPrism Elementです。

---

# Prism Centralとは？

複数のNutanix Clusterを運用する環境では、それぞれのPrism Elementへアクセスして管理すると手間がかかります。

そこで利用されるのが、

**Prism Central（PC）**

です。

Prism Centralを利用すると、複数のNutanix Clusterを中央からまとめて管理できます。

```text
                 Administrator
                       │
                       ▼
                Prism Central
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Cluster A    Cluster B    Cluster C
```

たとえば東京・大阪・名古屋にそれぞれNutanix Clusterが存在している場合でも、Prism Centralを利用することで、それらを中央から統合的に管理できます。

---

# Prism ElementとPrism Centralの違い

ここはNCA対策として整理しておきましょう。

| 項目 | Prism Element | Prism Central |
|---|---|---|
| 略称 | PE | PC |
| 主な管理対象 | 個々のCluster | 複数Cluster |
| 管理範囲 | ローカル | 集中管理 |
| VM管理 | ○ | ○ |
| Cluster監視 | ○ | ○ |
| 複数Clusterの統合管理 | × | ○ |

最も重要なのは、

**PE = 1つのCluster**

**PC = 複数Clusterをまとめて管理**

という違いです。

---

# Prism Centralはどこで動いている？

Prism Centralについてもう少し詳しく見てみましょう。

Prism Centralは、単なるWebサイトではありません。

Nutanix環境上にデプロイして利用する管理用の仮想アプライアンスです。

イメージとしては、

```text
Nutanix Cluster

┌──────────────────────┐
│                      │
│ User VM              │
│ User VM              │
│                      │
│ Prism Central VM     │
│                      │
├──────────────────────┤
│         AHV          │
└──────────────────────┘
```

のようになります。

つまりPrism Central自体も、Nutanix環境上で動作するVMとして展開できます。

---

# PrismでVMを管理する

Prismの重要な用途の一つが**VM管理**です。

管理者はPrismから、

- VMの作成
- VMの起動
- VMの停止
- VMの再起動
- VMの削除
- CPUの設定
- Memoryの設定
- Diskの設定
- NICの設定

などを行えます。

前回学習したAHVとの関係は、

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
     AHV
      │
      ▼
      VM
```

と考えると分かりやすいでしょう。

**AHVはVMを動かす仕組み**

であり、

**PrismはVMを管理するために利用するインターフェース**

です。

---

# PrismでStorageを確認する

PrismではNutanixのStorageについても確認できます。

たとえば、

- Storage Container
- Storage Pool
- 容量
- 使用量
- 空き容量

などの情報を確認できます。

```text
Prism
  │
  ▼
Storage
  │
  ├─ Capacity
  ├─ Usage
  ├─ Storage Pool
  └─ Container
```

Storage PoolやContainerについては、ストレージの記事で詳しく解説します。

ここでは、

**PrismからNutanixのストレージ状態を確認・管理できる**

ことを覚えておきましょう。

---

# PrismでNetworkを管理する

PrismではVMが利用するNetworkについても管理できます。

たとえば、

- Networkの作成
- VMへのNetwork接続
- VLAN関連の設定

などです。

VMを作成しても、Networkへ接続しなければ他のシステムと通信できません。

そのため、

```text
VM
 │
vNIC
 │
Virtual Network
 │
Physical Network
```

というネットワーク構成についてもPrismから管理していきます。

NutanixのNetworkについても、後の記事で詳しく扱います。

---

# PrismでHealthを確認する

システムを運用するうえでは、

**正常に動いているか**

を確認することも重要です。

PrismではClusterやNodeなどのHealth情報を確認できます。

たとえば、

```text
Cluster
   │
   ├─ Node 1 → Healthy
   ├─ Node 2 → Healthy
   └─ Node 3 → 問題あり
```

といった状態を確認します。

問題が発生している場合には、詳細情報を確認して原因を調査します。

NCAでは、このような**Platform Health and Monitoring**も重要な学習範囲です。

---

# AlertとEvent

Prismでは、

**Alert**

と

**Event**

も確認できます。

## Alert

Alertは、

**管理者が対応する必要がある可能性のある問題や状態**

を知らせるものです。

たとえば、

- リソース不足
- ハードウェアの問題
- Clusterの問題

などが発生した場合にAlertとして通知されます。

## Event

Eventは、

**Nutanix環境で発生した出来事の記録**

です。

たとえば、

- VMを作成した
- VMを起動した
- 設定を変更した

といった操作やシステム上の出来事を確認できます。

大まかには、

```text
Alert
↓
問題・注意すべき状態


Event
↓
環境で発生した出来事
```

と整理しておくと分かりやすいでしょう。

---

# Performance Monitoring

Prismでは、Nutanix環境のパフォーマンスも確認できます。

代表的には、

- CPU使用率
- Memory使用量
- Storage I/O
- IOPS
- Latency

などです。

たとえば、

```text
VM A

CPU      30%
Memory   70%
IOPS     500
Latency  2ms
```

といった情報を確認し、

**「どこで負荷が高くなっているのか？」**

を調査できます。

単にVMを作るだけではなく、

**VMやClusterの状態を監視する**

こともPrismの重要な役割です。

---

# PrismとCVMの関係

Prism Elementは、Nutanix Clusterを構成するCVMと密接に関係しています。

ここで重要なのは、

**PrismとCVMを同じものだと思わないこと**

です。

それぞれの役割は、

| 技術 | 役割 |
|---|---|
| CVM | Nutanixのストレージサービスなどを提供するController VM |
| Prism | Nutanix環境を管理するインターフェース |

となります。

つまり、

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
Nutanix Services
      │
      ▼
     CVM
```

というイメージです。

---

# ここまで登場した技術を整理

Nutanixを勉強し始めると、

- AOS
- AHV
- CVM
- DSF
- Prism

など似たような単語が大量に登場します。

一度整理してみましょう。

| 用語 | 役割 |
|---|---|
| AOS | Nutanixの中核ソフトウェア |
| AHV | Nutanixのハイパーバイザー |
| CVM | 各NodeでNutanixサービスを提供するController VM |
| DSF | Nutanixの分散ストレージ |
| Prism Element | 個々のClusterを管理 |
| Prism Central | 複数Clusterを集中管理 |

全体をイメージすると、

```text
                Administrator
                      │
                      ▼
               Prism Central
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 Prism Element                Prism Element
        │                           │
        ▼                           ▼
   Cluster A                   Cluster B
        │
   ┌────┼────┐
   ▼    ▼    ▼
 Node Node Node
   │
  AHV
   │
VM / CVM
```

となります。

ここまで理解できれば、Nutanixの基本構成がかなり見えてきます。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

Nutanix Clusterを、

**1つのはちみつ屋さん**

だとします。

店舗の中には、

- 商品
- 倉庫
- 店員
- 設備

などがあります。

この店舗全体を管理するための、

**店舗管理室**

がPrism Elementです。

```text
はちみつ屋 名古屋店
      │
      ▼
店舗管理室
(Prism Element)
```

管理室では、

「在庫は大丈夫？」

「設備は正常？」

「お店は混んでいる？」

といった情報を確認できます。

では、

- 名古屋店
- 東京店
- 大阪店

の3店舗になったらどうでしょうか？

それぞれの店舗管理室を毎回確認するのは大変です。

そこで本社に、

**全店舗をまとめて管理する本部**

を作ります。

これが**Prism Central**です。

```text
            本社
     (Prism Central)
             │
     ┌───────┼───────┐
     ▼       ▼       ▼
   東京店   名古屋店   大阪店
    PE       PE       PE
```

つまり、

**Prism Element = 店舗管理室**

**Prism Central = 全店舗を管理する本社**

と考えると分かりやすいでしょう。

---

# NCA対策として覚えておきたいポイント

今回特に重要なのは次の内容です。

| 用語 | NCA対策ポイント |
|---|---|
| Prism | Nutanixの管理インターフェース |
| Prism Element | 個々のClusterを管理 |
| Prism Central | 複数Clusterを集中管理 |
| VM | Prismから基本操作を行える |
| Health | Clusterなどの正常性を確認 |
| Alert | 問題や注意すべき状態を確認 |
| Event | 環境内で発生した出来事を確認 |
| Performance | CPU・Memory・IOPS・Latencyなどを監視 |

特に、

```text
PE
↓
1 Cluster


PC
↓
Multiple Clusters
```

という違いは確実に理解しておきましょう。

---

# ここまでのNutanix学習

ここまでの記事をつなげると、

```text
① Nutanix / HCI
        ↓
② AOS / CVM / DSF
        ↓
③ AHV
        ↓
④ Prism
```

となりました。

Nutanixの、

**「何なのか」**

から始まり、

**「内部ではどう動くのか」**

**「VMをどう動かすのか」**

**「どう管理するのか」**

までつながったことになります。

---

# まとめ

今回はNutanix環境を管理する**Prism**について学びました。

Prismには、

**Prism Element**

と

**Prism Central**

があります。

Prism Elementは、

**個々のNutanix Clusterを管理するためのインターフェース**

です。

一方、Prism Centralは、

**複数のNutanix Clusterを中央から統合管理するための仕組み**

です。

Prismからは、

- VM
- Storage
- Network
- Health
- Alert
- Event
- Performance

など、Nutanix環境に関するさまざまな情報を確認・管理できます。

まずは、

**「PEは1つのCluster、PCは複数Cluster」**

という違いをしっかり覚えておきましょう。

次回は、Prismから実際に管理する対象でもある**NutanixのVMと基本操作**について、さらに詳しく学んでいきます。