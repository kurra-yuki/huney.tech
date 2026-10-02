---
title: "NutanixのVM管理とは？作成・Clone・Snapshot・基本操作を理解しよう【NCA 7.5対策】"
slug: nutanix-vm-management
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix AHV環境におけるVMの仕組みと、Prismを利用したVM作成、電源操作、Clone、Snapshotなどの基本的な管理操作を初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix AHV環境におけるVMの仕組みと、Prismを利用したVM作成、電源操作、Clone、Snapshotなどの基本的な管理操作を初心者向けに解説します。"
---

# NutanixのVM管理とは？作成・Clone・Snapshot・基本操作を理解しよう【NCA 7.5対策】

## はじめに

これまでの記事では、

- Nutanix / HCI
- AOS / CVM / DSF
- AHV
- Prism

について学んできました。

ここまでで、

**「Nutanix環境がどのような仕組みで動いているのか」**

が少しずつ見えてきました。

では、実際にNutanix環境を利用するときは何をするのでしょうか？

代表的なのが、

**Virtual Machine（VM：仮想マシン）の作成と管理**

です。

今回はNutanix AHV環境におけるVMについて、NCA対策として押さえておきたい基本操作を学んでいきましょう。

---

# NutanixにおけるVMとは？

VMは、

**Virtual Machine**

の略で、日本語では**仮想マシン**と呼ばれます。

1台の物理サーバーのCPUやメモリなどを仮想化し、複数の独立したコンピューターとして利用する仕組みです。

Nutanix AHV環境では、

```text
┌─────────────────────────┐
│          Node           │
│                         │
│ ┌──────┐ ┌──────┐      │
│ │ VM A │ │ VM B │      │
│ └──────┘ └──────┘      │
│                         │
│        ┌─────┐          │
│        │ CVM │          │
│        └─────┘          │
├─────────────────────────┤
│          AHV            │
├─────────────────────────┤
│ CPU / Memory / Storage  │
└─────────────────────────┘
```

のように、AHV上でVMが動作します。

前回までに登場した**CVMもVMの一種**ですが、通常の業務システムを動かすUser VMとは役割が異なります。

---

# VMを構成するもの

VMは単に「仮想的なサーバー」というだけではありません。

物理サーバーと同じように、さまざまなリソースが必要です。

代表的なのが、

- vCPU
- Memory
- Virtual Disk
- vNIC

です。

イメージすると、

```text
Virtual Machine
│
├─ vCPU
├─ Memory
├─ Virtual Disk
└─ vNIC
```

となります。

---

# vCPU

**vCPU（Virtual CPU）**は、VMに割り当てられる仮想CPUです。

たとえばVMに、

```text
VM A

vCPU：4
Memory：8GB
```

のようにリソースを設定します。

物理Nodeが持つCPUリソースをAHVが仮想化し、それぞれのVMから利用できるようにします。

---

# Memory

VMにはメモリも割り当てます。

たとえば、

```text
Node
Physical Memory：128GB

├─ VM A → 8GB
├─ VM B → 16GB
├─ VM C → 32GB
└─ その他
```

といった形です。

VMの用途に応じて必要なMemoryを設定します。

---

# Virtual Disk

OSやアプリケーション、データを保存するためにはDiskが必要です。

VMでは物理ディスクを直接利用するのではなく、**仮想ディスク**を利用します。

```text
VM
 │
 ├─ Disk 1
 │   └─ OS
 │
 └─ Disk 2
     └─ Data
```

Nutanixでは、これらのデータが分散ストレージ上に保存されます。

前の記事で登場した**DSF**が、ここでつながってきます。

---

# vNIC

VMがネットワーク通信するために利用するのが、

**vNIC（Virtual Network Interface Card）**

です。

```text
VM
 │
vNIC
 │
Virtual Network
 │
Physical Network
```

物理サーバーにNICがあるように、VMにも仮想的なNICがあります。

VMを作成するときには、どのNetworkへ接続するのかも設定します。

---

# PrismからVMを管理する

Nutanix環境では、PrismからVMを管理できます。

これまでの関係を整理すると、

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

となります。

つまり、

**Prism = 管理する場所**

**AHV = VMを動かす仮想化基盤**

**VM = 実際にOSやアプリケーションを動かす仮想マシン**

です。

---

# VMの作成

VMを利用するためには、まずVMを作成します。

作成時には、代表的に、

- VM Name
- vCPU
- Memory
- Disk
- Network

などを設定します。

たとえば、

```text
VM Name
WebServer01

vCPU
2

Memory
4GB

Disk
100GB

Network
Server-Network
```

のようなイメージです。

ただし、これだけではまだOSがインストールされていません。

WindowsやLinuxなどを利用する場合には、OSのインストールに必要なイメージなども準備します。

---

# Imageとは？

VMを作成するときに登場するのが、

**Image（イメージ）**

です。

たとえば、

- Windows Server ISO
- Linux ISO
- Disk Image

などをNutanix環境へ登録して利用できます。

```text
Image Service

├─ Windows Server ISO
├─ Ubuntu ISO
└─ Linux Disk Image
```

登録したImageを利用することで、VMへOSをインストールしたり、VMを展開したりできます。

---

# VMの電源操作

VMを作成した後は、さまざまな電源操作を行います。

代表的なのが、

- Power On
- Power Off
- Guest Shutdown
- Restart / Reboot

などです。

## Power On

VMを起動します。

物理サーバーの電源ボタンを押すイメージです。

```text
VM
OFF
 ↓
Power On
 ↓
ON
```

## Power Off

VMの電源を切ります。

強制的な電源操作になる場合があるため、OSを正常終了させる操作とは区別して考える必要があります。

## Guest Shutdown

Guest OS側へ正常なシャットダウンを要求します。

Windowsで、

「スタート → シャットダウン」

を行うイメージに近い操作です。

---

# VMのリソース変更

作成したVMのリソースを変更することもあります。

たとえば、

```text
変更前

vCPU：2
Memory：4GB

        ↓

変更後

vCPU：4
Memory：8GB
```

といった変更です。

アプリケーションの利用者が増えたり、処理負荷が高くなったりした場合に、VMへ割り当てるリソースを増やすことがあります。

ただし、変更するリソースやGuest OSの条件などによって、VMの停止が必要になる場合があります。

---

# Cloneとは？

VM管理で覚えておきたい機能が、

**Clone（クローン）**

です。

Cloneは、既存のVMをもとに新しいVMを作成する機能です。

たとえば、

```text
WebServer01
     │
     │ Clone
     ▼
WebServer02
```

という形です。

同じような構成のサーバーを複数用意したい場合、毎回最初からVMを作成するのは大変です。

そこで既存VMをCloneすることで、VM作成を効率化できます。

---

# Cloneはコピー

Cloneを簡単に考えると、

**VMのコピー**

です。

たとえば、

```text
Original VM
│
├─ OS
├─ Application
└─ Configuration

       ↓ Clone

New VM
├─ OS
├─ Application
└─ Configuration
```

のように、既存VMをベースとして別のVMを作成できます。

重要なのは、

**Clone後は別のVMとして扱える**

という点です。

---

# Snapshotとは？

Cloneと一緒に覚えておきたいのが、

**Snapshot（スナップショット）**

です。

Snapshotは、

**ある時点のVMの状態を保存する仕組み**

です。

たとえば、アプリケーションをアップデートするとします。

```text
現在のVM
   │
   ├─ Snapshot取得
   │
   ▼
アップデート
```

アップデート前の状態を記録しておくことで、変更前の状態を保持できます。

---

# Snapshotはバックアップ？

ここは注意が必要です。

Snapshotは便利ですが、

**Snapshot = 完全なバックアップ**

と考えるのは適切ではありません。

SnapshotはVMのある時点の状態を保持するための機能です。

一方、バックアップでは一般的に、障害やデータ損失などに備えて別の保護方法・保存先を用意します。

そのため、

```text
Snapshot
↓
VMのある時点の状態を保持


Backup
↓
データを保護・復旧するための仕組み
```

という違いを意識しておきましょう。

---

# CloneとSnapshotの違い

この2つは混同しやすいため整理しておきましょう。

| 機能 | 目的 |
|---|---|
| Clone | 既存VMから新しいVMを作る |
| Snapshot | VMのある時点の状態を保持する |

簡単に覚えるなら、

**Clone = 増やす**

**Snapshot = 残す**

です。

---

# VMを削除するときの注意

不要になったVMは削除できます。

ただし、VMを削除すると、そのVMに関連するデータも影響を受ける可能性があります。

そのため、

- 本当に不要なVMなのか
- 必要なデータが残っていないか
- Snapshotやバックアップが必要ではないか

などを確認してから削除することが重要です。

---

# VMはどのNodeで動く？

Nutanix Clusterには複数のNodeがあります。

```text
Cluster

├─ Node 1
├─ Node 2
└─ Node 3
```

そして、それぞれのNode上でVMを動作させます。

```text
Node 1
├─ VM A
└─ VM B

Node 2
├─ VM C
└─ VM D

Node 3
└─ VM E
```

VMはClusterのコンピュートリソースを利用して動作します。

Nutanixでは、こうした複数Nodeからなる環境をまとめて管理できることが大きな特徴です。

---

# VMとStorageの関係

ここまでの記事で学習したDSFともつなげてみましょう。

VMのDiskデータはNutanixの分散ストレージを利用します。

```text
VM
 │
Virtual Disk
 │
CVM
 │
DSF
 │
┌────────┬────────┬────────┐
Node 1   Node 2   Node 3
Storage  Storage  Storage
```

つまり、

**VMから見ると普通のDisk**

でも、その裏側ではNutanixの分散ストレージによってデータが管理されています。

ここがHCIを理解するうえで面白いポイントです。

---

# VMとNetworkの関係

VMにはvNICを設定し、Networkへ接続します。

```text
        VM
         │
       vNIC
         │
  Virtual Network
         │
        VLAN
         │
Physical Network
```

VMのNetwork設定については、次回の記事で詳しく扱います。

NCAでは仮想ネットワークについても理解する必要があるため、

**VMを作ったらDiskだけでなくNetworkも必要**

ということを覚えておきましょう。

---

# はちみつ屋さんで例えると？

Nutanix Clusterを、大きなはちみつ屋さんの施設だとします。

その中に、

- はちみつ販売店
- はちみつカフェ
- はちみつお菓子店

などがあります。

それぞれのお店が**VM**です。

お店を新しく作るときには、

「どれくらい広い店舗にする？」

「何人のスタッフを配置する？」

「倉庫はどれくらい必要？」

「どの通路につなげる？」

といったことを決めます。

これがVMの、

- vCPU
- Memory
- Disk
- Network

を設定するイメージです。

そして、

**同じ店舗をもう1店舗作りたい！**

となった場合に使うのが、

**Clone**

です。

```text
はちみつカフェ1号店
       │
       │ Clone
       ▼
はちみつカフェ2号店
```

一方、

**改装する前の状態を残しておきたい！**

というときに利用するのが、

**Snapshot**

です。

```text
現在のお店
    │
Snapshot
    │
    ▼
改装開始
```

このように考えると、CloneとSnapshotの違いも分かりやすくなります。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| VM | Virtual Machine |
| vCPU | VMに割り当てる仮想CPU |
| Memory | VMに割り当てるメモリ |
| Virtual Disk | VMが利用する仮想ディスク |
| vNIC | VMが利用する仮想NIC |
| Image | OSインストールやVM展開などに利用 |
| Clone | 既存VMをもとに新しいVMを作成 |
| Snapshot | VMのある時点の状態を保持 |
| Prism | VMの作成・管理などに利用 |
| AHV | VMを実際に動作させるハイパーバイザー |

特に、

```text
Clone
↓
新しいVMを作る


Snapshot
↓
ある時点の状態を残す
```

という違いは整理しておきましょう。

---

# これまでの知識をつなげよう

第1回から学習してきた内容をVMまでつなげると、

```text
Nutanix Cluster
       │
       ├─ Node
       │    │
       │   AHV
       │    │
       │   VM
       │    │
       │ Virtual Disk
       │    │
       │   CVM
       │    │
       └── DSF
       
管理
 ↓
Prism
```

となります。

つまり、

**AHVがVMを動かし**

**CVM・DSFがストレージを提供し**

**Prismから管理する**

というNutanixの基本的な関係が見えてきました。

---

# まとめ

今回はNutanixにおけるVM管理について学びました。

VMを作成するときには、

- vCPU
- Memory
- Disk
- Network

などを設定します。

そしてPrismを利用することで、

- VM作成
- 起動・停止
- リソース変更
- Clone
- Snapshot
- 削除

などの基本的な管理を行えます。

また、

**Cloneは既存VMから新しいVMを作る機能**

**SnapshotはVMのある時点の状態を保持する機能**

という違いも重要です。

Nutanixの仕組みを単語単位で覚えるのではなく、

**Prism → AHV → VM → CVM / DSF**

というつながりを意識して覚えていきましょう。

次回はVMを外部と通信させるために必要となる、**Nutanixの仮想ネットワーク**について学んでいきます。