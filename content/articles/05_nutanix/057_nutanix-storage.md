---
title: "Nutanixのストレージとは？Storage Pool・Container・RFを理解しよう【NCA 7.5対策】"
slug: nutanix-storage
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanixの分散ストレージの仕組みを、Storage Pool・Storage Container・vDisk・Replication Factor・データ効率化機能とともに初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanixの分散ストレージの仕組みを、Storage Pool・Storage Container・vDisk・Replication Factor・データ効率化機能とともに初心者向けに解説します。"
---

# Nutanixのストレージとは？Storage Pool・Container・RFを理解しよう【NCA 7.5対策】

## はじめに

前回は、Nutanix AHV環境における仮想ネットワークについて学びました。

VMは、

**vNIC → Subnet → VLAN**

という仕組みを利用してネットワークへ接続していました。

では、VMが利用するデータはどこに保存されているのでしょうか？

一般的な3Tier構成では、サーバーとは別にSANなどの共有ストレージを用意することがあります。

一方、Nutanixでは各Nodeに搭載されたストレージを利用し、ソフトウェアによって**分散ストレージ**を構成します。

今回は、

- DSF
- Storage Pool
- Storage Container
- vDisk
- Replication Factor
- Compression
- Deduplication
- Erasure Coding

など、Nutanixのストレージを理解するうえで重要な仕組みを学んでいきましょう。

---

# 従来の3Tier構成を振り返ろう

従来の仮想化環境では、

```text
Server
   │
Network
   │
Shared Storage
```

のように、サーバーと共有ストレージを分離する構成がよく利用されます。

複数のサーバーから共有ストレージへアクセスし、VMのデータなどを保存します。

一方、NutanixではHCIの考え方を採用しています。

各Nodeが、

- CPU
- Memory
- Storage

を持っています。

```text
Node 1        Node 2        Node 3
  │             │             │
Storage       Storage       Storage
```

これらをソフトウェアによってまとめて利用するのがNutanixの特徴です。

---

# DSFとは？

以前の記事でも登場したのが、

**DSF（Distributed Storage Fabric）**

です。

DSFは、Nutanixの分散ストレージ機能です。

各Nodeに搭載されたローカルストレージをまとめて、Cluster全体から利用できるストレージ基盤を提供します。

```text
Node 1        Node 2        Node 3
Storage       Storage       Storage
   ＼            │            ／
    ＼           │           ／
     ───────── DSF ─────────
              │
              ▼
      Distributed Storage
```

物理的には複数のNodeに分散しているディスクを、Nutanixのソフトウェアによって管理します。

---

# CVMがストレージを制御する

DSFを実現するうえで重要なのが、

**CVM（Controller Virtual Machine）**

です。

基本的に各NodeにはCVMが存在します。

```text
Node 1        Node 2        Node 3

[CVM] ←────→ [CVM] ←────→ [CVM]
  │             │             │
Storage       Storage       Storage
```

各CVMが連携することで、Cluster全体に分散したストレージを利用できるようにします。

つまり、

**CVM = ストレージサービスなどを提供するController VM**

**DSF = CVMなどによって実現される分散ストレージ**

と整理できます。

---

# Nutanixストレージの階層

Nutanixのストレージを理解するときは、次の階層を意識すると分かりやすくなります。

```text
Physical Disk
      ↓
 Storage Pool
      ↓
Storage Container
      ↓
    vDisk
      ↓
     VM
```

それぞれ詳しく見ていきましょう。

---

# Physical Disk

一番下にあるのが物理的なストレージデバイスです。

Nodeには、

- SSD
- NVMe
- HDD

などのストレージデバイスが搭載されます。

```text
Nutanix Node

├─ CPU
├─ Memory
└─ Storage
     ├─ SSD
     ├─ SSD
     └─ HDD
```

これらがNutanixの分散ストレージを構成する物理的な土台になります。

---

# Storage Poolとは？

物理ストレージを論理的にまとめたものが、

**Storage Pool**

です。

イメージとしては、

```text
Node 1 Disks ─┐
Node 2 Disks ─┼─→ Storage Pool
Node 3 Disks ─┘
```

となります。

つまりStorage Poolは、

> **Cluster内の物理ストレージリソースをまとめた領域**

です。

そのStorage Poolの上に、VMなどが利用する論理的な領域を作成します。

---

# Storage Containerとは？

Storage Poolの上に作成される論理的なストレージ領域が、

**Storage Container**

です。

```text
Storage Pool
      │
 ┌────┼────────┐
 ▼    ▼        ▼
Container A  Container B  Container C
```

Storage Containerは、VMの仮想ディスクなどを格納するために利用されます。

たとえば、

```text
Storage Pool

├─ Production-Container
├─ Development-Container
└─ Test-Container
```

のように用途ごとに分けることもできます。

---

# Storage PoolとStorage Containerの違い

この2つは名前が似ているため混同しやすいところです。

整理すると、

| 用語 | 役割 |
|---|---|
| Storage Pool | 物理ストレージリソースをまとめる |
| Storage Container | Storage Pool上に作る論理的なストレージ領域 |

簡単に覚えるなら、

```text
Physical Disk
     ↓
Storage Pool
     ↓
Storage Container
```

です。

**Poolの中にContainerがある**

とイメージすると分かりやすいでしょう。

---

# vDiskとは？

VMが利用する仮想ディスクが、

**vDisk（Virtual Disk）**

です。

VMから見ると、

```text
VM
│
├─ Disk 1：100GB
└─ Disk 2：500GB
```

のような普通のDiskに見えます。

しかし、その裏側ではNutanixの分散ストレージが利用されています。

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
 ↓
各NodeのStorage
```

VMを利用する管理者が、

「このデータはNode 1のSSDのこの場所に保存しよう」

と意識する必要はありません。

Nutanix側がデータの配置を管理します。

---

# Data Locality

Nutanixストレージの特徴として覚えておきたいのが、

**Data Locality（データローカリティ）**

です。

これは、

> VMが利用するデータを、可能な限りそのVMが動作しているNodeの近くで利用する

という考え方です。

たとえばVM AがNode 1で動いている場合、

```text
Node 1

┌──────────────┐
│    VM A      │
│      ↓       │
│     CVM      │
│      ↓       │
│ Local Data   │
└──────────────┘
```

とすることで、不要なネットワーク越しの読み込みを減らせます。

---

# データを1台のNodeだけに保存して大丈夫？

ここで疑問が出てきます。

> Node 1にデータを保存して、Node 1が故障したらどうなるの？

そのためNutanixでは、データの可用性を確保する仕組みが用意されています。

そこで登場するのが、

**Replication Factor（RF）**

です。

---

# Replication Factorとは？

Replication Factorは、Nutanixのデータ冗長性に関係する考え方です。

代表的なのが、

- RF2
- RF3

です。

---

# RF2

**RF2**では、障害に備えてデータのコピーを別のNodeにも保持します。

イメージすると、

```text
Node 1              Node 2

Data A ───────────→ Data A Copy
```

となります。

これによって、1つのNodeだけにデータが依存することを防ぎます。

RF2は、一般的に**1つの障害に耐えられる構成**として考えます。

---

# RF3

より高い耐障害性が必要な場合には、

**RF3**

があります。

```text
Node 1       Node 2       Node 3

Data A       Copy 1       Copy 2
```

複数のコピーを異なる障害ドメインへ保持することで、RF2より高い冗長性を実現します。

一般的には**同時に2つの障害へ耐えられる構成**として考えます。

ただし、その分だけデータを保持するために必要なストレージ容量も増加します。

---

# RF2とRF3の違い

整理すると、

| 項目 | RF2 | RF3 |
|---|---|---|
| データコピー | 2つ | 3つ |
| 耐障害性 | 1障害 | 2障害 |
| 必要容量 | 比較的少ない | 多い |
| 可用性 | 高い | より高い |

NCA対策として、

**RFが大きくなるほど耐障害性は高くなるが、必要なストレージ容量も増える**

という関係を理解しておきましょう。

---

# Compressionとは？

Nutanixではストレージ容量を効率的に利用するための機能があります。

その一つが、

**Compression（圧縮）**

です。

たとえば、

```text
元データ
100GB

   ↓ Compression

圧縮後
60GB
```

のように、データを圧縮して保存することで必要なストレージ容量を削減します。

実際の圧縮率はデータの種類などによって異なります。

---

# Deduplicationとは？

もう一つが、

**Deduplication（重複排除）**

です。

同じデータが複数存在する場合に、重複するデータを効率化します。

たとえば、

```text
Data A
Data A
Data A
Data B
```

というデータがあった場合、

```text
Data A × 1
Data B × 1
```

のように、重複しているデータを削減する考え方です。

特に似たデータを大量に持つ環境では、ストレージ容量の効率化につながる場合があります。

---

# Erasure Codingとは？

さらに覚えておきたいのが、

**Erasure Coding**

です。

Nutanixでは、ストレージ容量を効率的に利用しながらデータを保護するための仕組みとして利用されます。

単純なReplicationでは、同じデータを複数コピーします。

```text
Replication

Data A
Data A Copy
```

一方、Erasure Codingではデータを複数のデータ片とパリティ情報に分けて保持します。

イメージすると、

```text
Data
 ↓
┌────┬────┬────┬────────┐
│ A1 │ A2 │ A3 │ Parity │
└────┴────┴────┴────────┘
```

一部のデータが失われても、残ったデータとパリティ情報から復元できるようにします。

---

# ReplicationとErasure Codingの違い

非常に単純化すると、

**Replication**

は、

> 同じデータを複数持って守る

仕組みです。

一方、

**Erasure Coding**

は、

> データと復元用情報を分散して持つ

仕組みです。

```text
Replication
↓
コピーによって保護


Erasure Coding
↓
データ + Parityによって保護
```

Erasure Codingは、Replicationだけを利用する場合と比較してストレージ容量を効率化できる場合があります。

---

# Prismからストレージを確認する

NutanixのストレージもPrismから管理・監視できます。

たとえば、

- Storage Container
- 容量
- 使用量
- 空き容量
- Performance

などを確認できます。

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
   Storage
      │
 ┌────┼──────────┐
 ▼    ▼          ▼
容量  使用量  Performance
```

NCAでは単に用語を覚えるだけでなく、

**Prismのどこから何を確認できるのか**

という管理者目線も意識しておきましょう。

---

# IOPSとは？

ストレージのPerformanceを確認するときに登場するのが、

**IOPS**

です。

IOPSは、

**Input/Output Operations Per Second**

の略です。

1秒間に何回のI/O処理を行えるか、または行っているかを表す指標です。

たとえば、

```text
1000 IOPS
```

であれば、1秒間に1000回のI/O処理という意味になります。

ストレージの負荷や性能を確認するときに利用される重要な指標です。

---

# Latencyとは？

もう一つ重要なのが、

**Latency（レイテンシ）**

です。

Latencyは、

**I/O処理にどれくらい時間がかかったか**

を表します。

たとえば、

```text
VM
 │
 │ Read Request
 ▼
Storage
 │
 │ Response
 ▼
VM

← この処理にかかった時間 →
```

がLatencyです。

一般的にはLatencyが大きくなるほど、VMから見たストレージ応答が遅くなります。

---

# Throughputとは？

ストレージPerformanceでは、

**Throughput（スループット）**

も重要です。

Throughputは、

**一定時間にどれくらいのデータを転送できるか**

を表します。

たとえば、

```text
500 MB/s
```

のように表します。

整理すると、

| 指標 | 意味 |
|---|---|
| IOPS | 1秒間のI/O回数 |
| Latency | I/Oにかかった時間 |
| Throughput | 一定時間に転送したデータ量 |

となります。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

複数の店舗があり、それぞれに倉庫があります。

```text
名古屋店     東京店      大阪店

 倉庫          倉庫         倉庫
```

これらの倉庫をまとめて、

**会社全体の巨大な倉庫システム**

として管理します。

これが**DSF**です。

倉庫全体の保管スペースをまとめたものが、

**Storage Pool**

です。

さらに、

```text
はちみつ用エリア

お菓子用エリア

飲料用エリア
```

のように用途別の保管エリアを作ります。

これが**Storage Container**です。

そして、実際に置かれている商品がVMの**vDisk**に相当します。

---

# RFをはちみつ屋さんで考える

大事なはちみつを名古屋店だけに置いていたら、名古屋店でトラブルが起きたときに困ります。

そこで東京店にもコピーを置きます。

```text
名古屋店
はちみつA

     ↓ Copy

東京店
はちみつA
```

これがRF2のイメージです。

さらに高い耐障害性が必要なら、別の店舗にもコピーを保持します。

つまり、

**「大事なはちみつを複数の店舗に分散して守る」**

のがReplicationです。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| DSF | Nutanixの分散ストレージ機能 |
| CVM | ストレージサービスなどを提供 |
| Storage Pool | 物理ストレージリソースをまとめる |
| Storage Container | Pool上の論理的なストレージ領域 |
| vDisk | VMが利用する仮想ディスク |
| Data Locality | VMが利用するデータを可能な限り近くで利用 |
| RF2 | データを冗長化し、1障害への耐性を持たせる |
| RF3 | RF2より高い冗長性を持たせる |
| Compression | データを圧縮 |
| Deduplication | 重複データを削減 |
| Erasure Coding | データとパリティを利用して効率的に保護 |
| IOPS | 1秒間のI/O回数 |
| Latency | I/Oの応答時間 |
| Throughput | 一定時間に転送するデータ量 |

特にストレージの階層、

```text
Physical Disk
      ↓
Storage Pool
      ↓
Storage Container
      ↓
vDisk
      ↓
VM
```

はしっかり理解しておきましょう。

---

# ここまでの構成を全部つなげよう

これまで学んできた内容を組み合わせると、Nutanixの全体像がかなり見えてきます。

```text
                    Prism
                      │
                      ▼
              Nutanix Cluster
                      │
                     Node
                      │
                     AHV
                      │
                      VM
                 ┌────┴────┐
                 │         │
              Network    Storage
                 │         │
                vNIC      vDisk
                 │         │
               Subnet     CVM
                 │         │
                VLAN      DSF
                 │         │
          Physical NIC   Storage
```

つまりVMから見ると、

**ネットワーク側ではvNIC**

**ストレージ側ではvDisk**

を利用しています。

その裏側をAHV・CVM・DSFなどのNutanixの仕組みが支えています。

---

# まとめ

今回はNutanixのストレージについて学びました。

Nutanixでは各Nodeに搭載されたストレージを、DSFによって分散ストレージとして利用します。

そのストレージは、

**Physical Disk → Storage Pool → Storage Container → vDisk → VM**

という関係で理解できます。

また、

**Replication Factor**

によってデータの冗長性を確保し、

- Compression
- Deduplication
- Erasure Coding

などによってストレージ容量を効率的に利用する仕組みもあります。

NCA対策では個々の用語を暗記するだけではなく、

**「VMが使っているDiskの裏側で、Nutanixがどのようにデータを保存・保護しているのか」**

という流れを理解しておくことが重要です。

次回は、複数のNodeをまとめて動作させる**Nutanix Clusterの構成と管理**について詳しく学んでいきます。