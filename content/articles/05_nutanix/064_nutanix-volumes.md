---
title: "Nutanix Volumesとは？Volume Group・iSCSI・vDiskとの違いを理解しよう【NCA 7.5対策】"
slug: nutanix-volumes
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix Volumesについて、Volume・Volume Group・iSCSI・Storage Container・vDiskの違いと、ブロックストレージを提供する仕組みを初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix Volumesについて、Volume・Volume Group・iSCSI・Storage Container・vDiskの違いと、ブロックストレージを提供する仕組みを初心者向けに解説します。"
---

# Nutanix Volumesとは？Volume Group・iSCSI・vDiskとの違いを理解しよう【NCA 7.5対策】

## はじめに

以前の記事では、NutanixのStorageについて、

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

という基本的な構造を学びました。

Nutanixでは、複数NodeのStorageをDSFによって分散Storageとして利用し、その上にStorage Containerを作成してVMのDiskを保存します。

しかしNutanixには、もう一つ重要なStorage機能があります。

それが、

**Nutanix Volumes**

です。

Volumesを利用すると、Nutanix ClusterのStorageを、

**Block Storage**

としてクライアントへ提供できます。

ここでは、

- Volume
- Volume Group
- iSCSI
- vDisk
- Storage Container

など似た用語が一気に登場します。

今回はこれらの違いを整理しながら、Nutanix Volumesの仕組みを理解していきましょう。

---

# Nutanix Volumesとは？

**Nutanix Volumes**は、Nutanixの分散Storageを利用して、アプリケーションやサーバーへBlock Storageを提供する機能です。

簡単にすると、

```text
Nutanix Cluster
      │
      ▼
Nutanix Volumes
      │
      ▼
 Block Storage
      │
      ▼
Server / VM
```

という仕組みです。

Nutanix Clusterが持つStorageを、外部から利用可能なBlock Storageとして提供できます。

---

# Block Storageとは？

まず、

**Block Storage**

を理解しましょう。

Block Storageでは、Storage領域を、

**Block**

という単位で扱います。

```text
Storage

┌───────┐
│ Block │
├───────┤
│ Block │
├───────┤
│ Block │
├───────┤
│ Block │
└───────┘
```

サーバーから見ると、Block Storageは、

**「自分に接続されたDisk」**

のように扱えます。

たとえばOSから、

```text
Disk 1
Disk 2
Disk 3
```

のように認識して利用します。

---

# File Storageとの違い

Block Storageと比較されるものとして、

**File Storage**

があります。

File Storageでは、

```text
Folder
 ├─ photo.jpg
 ├─ document.pdf
 └─ data.csv
```

のようにFileやFolderという形でデータを扱います。

一方Block Storageでは、

```text
Block
Block
Block
Block
```

というStorage領域そのものをサーバーへ提供します。

整理すると、

| Storage | 提供するもの |
|---|---|
| Block Storage | DiskのようなStorage領域 |
| File Storage | File / Folder |
| Object Storage | Object |

Nutanix Volumesは、

**Block Storage**

を提供する機能です。

---

# Volumeとは？

Volumesを理解するうえで最初に覚えたいのが、

**Volume**

です。

Volumeは、

> **サーバーやVMからDiskとして利用するBlock Storage領域**

と考えると分かりやすいでしょう。

たとえば、

```text
Server
  │
  ├─ Volume 1 → 100 GB
  │
  └─ Volume 2 → 500 GB
```

のように利用できます。

OSから見ると、接続されたStorage Deviceとして扱えます。

---

# Volume Groupとは？

Nutanixでは、Volumeをまとめて管理するために、

**Volume Group**

を利用します。

名前のとおり、

> **複数のVolumeをまとめたグループ**

です。

たとえば、

```text
Volume Group
     │
     ├─ Volume 1
     │    100 GB
     │
     ├─ Volume 2
     │    500 GB
     │
     └─ Volume 3
          1 TB
```

という構成です。

Volume Groupを作成し、その中に必要なVolumeを作成して利用します。

---

# VolumeとVolume Groupの違い

ここはシンプルです。

```text
Volume Group
      │
      ├─ Volume
      ├─ Volume
      └─ Volume
```

つまり、

**Volume = 実際のStorage領域**

**Volume Group = Volumeをまとめる単位**

です。

名前が似ているので混同しないようにしましょう。

---

# Volume Groupは誰が利用する？

Volume Groupは、

- VM
- Physical Server
- Application Server

などから利用できます。

たとえば、

```text
Database Server
       │
       ▼
  Volume Group
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
Vol 1 Vol 2 Vol 3
```

のように、Database Serverへ複数のStorage領域を提供できます。

特にDatabaseなど、大容量・高性能なBlock Storageを必要とするWorkloadで利用できます。

---

# iSCSIとは？

Volumesを理解するときに重要なのが、

**iSCSI**

です。

iSCSIは、

**Internet Small Computer Systems Interface**

の略です。

簡単にいうと、

> **IP Networkを利用してBlock Storageへアクセスするための仕組み**

です。

通常のNetworkで利用するIP通信を使って、Storageへアクセスできます。

---

# iSCSIのイメージ

たとえば、

```text
Server
  │
  │ iSCSI
  │
  ▼
IP Network
  │
  ▼
Nutanix Volumes
  │
  ▼
Volume Group
```

という形です。

Serverから見るとNetworkの向こう側にStorageがあります。

しかしiSCSIを利用することで、そのStorageをBlock Deviceとして利用できます。

---

# SANとの関係

従来のシステムでは、

**SAN（Storage Area Network）**

を利用してBlock Storageを提供する構成があります。

たとえば、

```text
Server
  │
  ▼
SAN
  │
  ▼
Storage Array
```

という構成です。

Nutanixでは、Cluster内の分散Storageを利用してBlock Storage Serviceを提供できます。

```text
Server
  │
  │ iSCSI
  ▼
Nutanix Cluster
  │
  ▼
Nutanix Volumes
```

そのため、用途によっては専用Storage Arrayとは異なる形でBlock Storageを提供できます。

---

# iSCSI Initiatorとは？

iSCSIでは、

**Initiator**

と

**Target**

という用語が重要です。

Initiatorは、

> **Storageへ接続する側**

です。

たとえば、

```text
Application Server
Database Server
VM
```

などがInitiatorになります。

```text
iSCSI Initiator
       │
       │ 接続要求
       ▼
```

というイメージです。

---

# iSCSI Targetとは？

Targetは、

> **Storageを提供する側**

です。

```text
Initiator
    │
    │ iSCSI
    ▼
 Target
    │
    ▼
Storage
```

つまり、

```text
Initiator
↓
Storageを使う側


Target
↓
Storageを提供する側
```

と覚えましょう。

---

# IQNとは？

iSCSIでは、

**IQN**

という識別情報も登場します。

IQNは、

**iSCSI Qualified Name**

の略です。

iSCSI環境においてInitiatorやTargetを識別するために利用される名前です。

イメージとしては、

```text
Server A
↓
IQN A


Server B
↓
IQN B
```

のように、接続する対象を識別するために利用します。

NCA対策では、

**IQN = iSCSIで利用される識別名**

という基本を覚えておきましょう。

---

# Volume Groupへのアクセスを制御する

Block Storageを誰でも利用できてしまうと問題です。

そのため、

**どのInitiatorからVolume Groupへアクセスできるのか**

を管理する必要があります。

イメージすると、

```text
Server A
IQN A
   │
   │ Allowed
   ▼
Volume Group


Server B
IQN B
   │
   │ Not Allowed
   ×
Volume Group
```

という形です。

これによって、許可されたInitiatorからStorageへアクセスできるようにします。

---

# Volume GroupをVMへ直接接続する場合

AHV環境では、Volume GroupをVMへ関連付けて利用する構成もあります。

イメージすると、

```text
VM
 │
 ▼
Volume Group
 │
 ├─ Volume 1
 └─ Volume 2
```

となります。

このようにNutanix Volumesは、

**外部のPhysical Serverだけのための機能ではありません。**

VMのWorkloadでも利用できます。

---

# vDiskとは何が違う？

ここが今回一番混乱しやすいポイントです。

以前の記事では、

**vDisk**

が登場しました。

通常のNutanix VMでは、

```text
VM
 │
 ▼
vDisk
 │
 ▼
Storage Container
```

という形でDiskを利用します。

一方Volumesでは、

```text
Server / VM
     │
     ▼
Volume Group
     │
     ▼
Volume
```

という形でBlock Storageを利用します。

---

# vDiskとVolumeの違い

大まかに整理すると、

| 項目 | vDisk | Volume |
|---|---|---|
| 主な用途 | VMのVirtual Disk | Block Storageの提供 |
| 管理 | VMに関連付けて利用 | Volume Groupで管理 |
| 利用者 | Nutanix上のVM | VMやPhysical Serverなど |
| 接続 | AHV上のVirtual Disk | iSCSIなど |
| 管理単位 | vDisk | Volume / Volume Group |

つまり、

**vDiskはVMの通常のVirtual Disk**

で、

**VolumeはVolumesによって提供されるBlock Storage**

という違いがあります。

---

# Storage Containerとは何が違う？

これも非常に重要です。

Storage Containerは、

**Nutanixの分散Storage上に作成する論理的なStorage領域**

です。

```text
Storage Pool
     │
     ▼
Storage Container
     │
     ▼
   vDisk
```

一方Volume Groupは、

**Volumeをまとめて管理し、Block Storageとしてクライアントへ提供するための単位**

です。

```text
Volume Group
     │
     ├─ Volume
     └─ Volume
```

つまり、

**Storage ContainerとVolume Groupは同じものではありません。**

---

# Storage関連用語を全部整理

ここまで登場したStorage用語を整理してみましょう。

| 用語 | 意味 |
|---|---|
| Physical Disk | Node内の物理Storage |
| Storage Pool | Physical Storage Resourceをまとめたもの |
| Storage Container | 論理的なStorage領域 |
| vDisk | VMが利用するVirtual Disk |
| Nutanix Volumes | Block Storageを提供する機能 |
| Volume Group | Volumeをまとめて管理する単位 |
| Volume | Block Storageとして利用するStorage領域 |
| iSCSI | IP Network経由でBlock Storageを利用する仕組み |
| Initiator | iSCSI Storageを利用する側 |
| Target | iSCSI Storageを提供する側 |
| IQN | iSCSIで利用する識別名 |

ここはNCA対策でも整理して覚えておきたいところです。

---

# 通常のVM Storage

通常のVM Storageをもう一度確認すると、

```text
VM
 │
 ▼
vDisk
 │
 ▼
Storage Container
 │
 ▼
Storage Pool
 │
 ▼
DSF
 │
 ▼
Physical Storage
```

というイメージでした。

VMのVirtual DiskをNutanixの分散Storage上に配置します。

---

# Nutanix Volumesの場合

Volumesでは、

```text
Application / Server
        │
        ▼
      iSCSI
        │
        ▼
  Volume Group
        │
  ┌─────┼─────┐
  ▼     ▼     ▼
Volume Volume Volume
        │
        ▼
Nutanix Distributed Storage
```

という形でBlock Storageを提供します。

この2つの違いを図で理解しておきましょう。

---

# Data Services IPとは？

Nutanix Volumesを利用するときには、

**Data Services IP**

という用語も登場します。

Data Services IPは、Nutanix ClusterがStorageなどのData Serviceを提供するときに利用するIP Addressです。

Volumesでは、iSCSI ClientからNutanix ClusterのStorage Serviceへ接続する際に関係します。

イメージすると、

```text
iSCSI Initiator
      │
      ▼
Data Services IP
      │
      ▼
Nutanix Cluster
      │
      ▼
Volume Group
```

となります。

つまり、

**ClientがNutanixのData Serviceへアクセスするための入口**

のようなイメージです。

---

# Data Services IPとPrismのIPは違う

ここも注意しましょう。

Prismへアクセスするときに利用するManagement系のIP Addressと、

**Data Services IP**

は役割が異なります。

```text
Management
↓
Prismへのアクセス


Data Services IP
↓
Data Serviceへのアクセス
```

すべてのIP Addressを同じ役割だと思わないようにしましょう。

---

# Load Balancing

Volumesでは、StorageへのI/OをCluster内で適切に処理する必要があります。

Nutanixは分散アーキテクチャなので、

```text
       iSCSI Client
            │
            ▼
      Nutanix Cluster
            │
     ┌──────┼──────┐
     ▼      ▼      ▼
   Node 1 Node 2 Node 3
```

という複数Nodeの構成を利用できます。

これによって、Block Storage ServiceについてもClusterの分散アーキテクチャを活用できます。

---

# 高可用性

Nutanix VolumesもNutanix Cluster上で提供されるため、Nutanixの分散アーキテクチャを利用できます。

たとえば一部のNodeに問題が発生した場合でも、

```text
Node 1 → OK

Node 2 → Failure

Node 3 → OK
```

Cluster内の他のResourceを利用してサービス継続を図れるよう設計されています。

もちろん、

**「どんな障害でも絶対に無停止」**

という意味ではありません。

Cluster構成や障害内容などによって影響は異なります。

---

# VolumesのPerformance

VolumesもStorageなので、前回の記事で学習したPerformance指標が関係します。

特に、

- IOPS
- Latency
- Throughput

です。

```text
Volume
 │
 ├─ IOPS
 ├─ Latency
 └─ Throughput
```

DatabaseなどStorage I/Oの多いWorkloadでは、これらのPerformance情報が重要になります。

前回Performance Monitoringを先に学習したのは、ここにもつながります。

---

# どんなときにVolumesを使う？

たとえば、

**Database ServerへBlock Storageを提供したい**

とします。

```text
Database Server
      │
      ▼
    iSCSI
      │
      ▼
 Volume Group
      │
 ┌────┼────┐
 ▼    ▼    ▼
Data Log Backup
```

というように、

- Database Data
- Transaction Log
- その他のStorage領域

などを複数のVolumeとして提供できます。

---

# 複数Volumeをまとめられるメリット

Databaseなどでは、

```text
Volume 1
↓
Database Data


Volume 2
↓
Transaction Log


Volume 3
↓
その他のData
```

のように、用途ごとにStorageを分けることがあります。

これらを、

```text
Database-VolumeGroup
        │
        ├─ Data
        ├─ Log
        └─ Other
```

のようにまとめて管理できるのがVolume Groupです。

---

# Snapshotとの関係

VolumesでもData Protectionは重要です。

Volume GroupではSnapshotなどを利用して、特定時点の状態を保持する仕組みを活用できます。

イメージすると、

```text
Volume Group
     │
     ▼
  Snapshot
     │
     ▼
ある時点の状態
```

ただし以前のVMの記事と同様に、

**Snapshot = Backupそのもの**

と単純に考えないようにしましょう。

SnapshotはData Protectionを構成するための機能の一つです。

---

# Prismから管理する

VolumesやVolume GroupもPrismから管理できます。

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
   Volumes
      │
      ▼
Volume Groups
      │
      ▼
   Volumes
```

管理者は、

- Volume Group
- Volume
- Connection
- Capacity
- Performance

などを確認・管理します。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

通常のVM Storageは、

**各店舗専用の倉庫**

だと考えます。

```text
名古屋店
   │
   ▼
名古屋店専用倉庫
```

これが、

```text
VM
↓
vDisk
```

のイメージです。

---

# Volumesは貸し倉庫

一方Nutanix Volumesは、

**外部のお店にも貸し出せる巨大な倉庫サービス**

と考えてみましょう。

```text
はちみつ倉庫センター
        │
   ┌────┼────┐
   ▼    ▼    ▼
倉庫A  倉庫B  倉庫C
```

この倉庫センターが、

**Volume Group**

です。

その中の個別の倉庫が、

**Volume**

です。

---

# iSCSIは倉庫までの道路

外部のお店から倉庫へ商品を取りに行くためには、道路が必要です。

```text
お店
 │
 ▼
道路
 │
 ▼
倉庫センター
```

この道路が、

**iSCSI**

のイメージです。

実際にはIP Networkを利用してBlock Storageへアクセスします。

---

# InitiatorとTarget

お店側は、

**「倉庫を使いたい！」**

とアクセスします。

これが、

**Initiator**

です。

倉庫センター側は、

**「Storageを提供します！」**

という側です。

これが、

**Target**

です。

```text
お店
Initiator
    │
    │ iSCSI
    ▼
倉庫センター
Target
```

この関係を覚えておきましょう。

---

# vDiskとVolumeをはちみつ屋さんで比較

整理すると、

```text
vDisk

自分のお店専用の倉庫
↓
VM専用のVirtual Disk
```

一方、

```text
Volume

倉庫サービスとして
提供されるStorage領域
↓
Block Storage
```

というイメージです。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| Nutanix Volumes | Block Storageを提供する機能 |
| Volume | Block Storageとして利用するStorage領域 |
| Volume Group | 複数Volumeをまとめる単位 |
| Block Storage | DiskのようなStorage領域を提供 |
| iSCSI | IP Network経由でBlock Storageへアクセス |
| Initiator | iSCSI Storageを利用する側 |
| Target | iSCSI Storageを提供する側 |
| IQN | iSCSIで利用する識別名 |
| Data Services IP | Data ServiceへアクセスするためのIP |
| vDisk | Nutanix VMの通常のVirtual Disk |
| Storage Container | 分散Storage上の論理Storage領域 |
| IOPS | 1秒間のI/O処理回数 |
| Latency | I/Oの応答時間 |
| Throughput | 単位時間あたりのData転送量 |

特に、

```text
通常のVM Storage

VM
↓
vDisk
↓
Storage Container
```

と、

```text
Nutanix Volumes

Server / VM
↓
iSCSIなど
↓
Volume Group
↓
Volume
```

の違いを理解しておきましょう。

---

# これまでのStorageを整理

これまで学習してきたStorage関連の内容をまとめると、

```text
             Nutanix Cluster
                    │
                    ▼
                   DSF
                    │
                    ▼
              Storage Pool
                    │
                    ▼
            Storage Container
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
    VM向けStorage        Block Storage
          │                   │
        vDisk          Nutanix Volumes
                              │
                              ▼
                        Volume Group
                              │
                       ┌──────┼──────┐
                       ▼      ▼      ▼
                    Volume Volume Volume
```

と整理できます。

NutanixのStorageは、

**VMのVirtual Diskを保存するだけの仕組みではない**

ということが分かります。

---

# まとめ

今回は、

**Nutanix Volumes**

について学びました。

Nutanix Volumesは、

**Nutanixの分散Storageを利用してBlock Storageを提供する機能**

です。

その中心となるのが、

**Volume Group**

です。

Volume Groupには複数のVolumeを作成でき、それらをVMやPhysical Serverなどから利用できます。

また、

**iSCSI**

を利用することで、IP Network経由でBlock Storageへアクセスできます。

今回特に重要なのは、

**Storage Container**

**vDisk**

**Volume Group**

**Volume**

の違いです。

通常のVM Storageでは、

```text
VM
↓
vDisk
↓
Storage Container
```

という構成を利用します。

一方Volumesでは、

```text
Server / VM
↓
iSCSIなど
↓
Volume Group
↓
Volume
```

という形でBlock Storageを提供します。

NCA対策では、

**「Volumeとは何か」**

だけを覚えるのではなく、

**「通常のVM StorageとVolumesは何が違うのか」**

まで説明できるようにしておきましょう。

次回は、Nutanix環境で問題が発生したときに利用する**Nutanix SupportとLog Collection、Support Caseの基本**について学んでいきます。