---
title: "AHVとは？Nutanixのハイパーバイザーを理解しよう【NCA 7.5対策】"
slug: nutanix-ahv
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、NutanixのハイパーバイザーであるAHVの役割やVMとの関係、Nutanix環境における仮想化の仕組みを初心者向けに解説します。"
description: "NCA 7.5対策として、NutanixのハイパーバイザーであるAHVの役割やVMとの関係、Nutanix環境における仮想化の仕組みを初心者向けに解説します。"
---

# AHVとは？Nutanixのハイパーバイザーを理解しよう【NCA 7.5対策】

## はじめに

前回はNutanixのアーキテクチャについて学びました。

Nutanixでは複数のNodeによってClusterを構成し、

- AOS
- CVM
- DSF

などの仕組みによってHCI環境を実現しています。

しかし、Nutanixを利用する大きな目的の一つは、

**仮想マシン（VM）を動かすこと**

です。

では、物理サーバーの上でどのように複数のVMを動かしているのでしょうか？

そこで登場するのが、

**AHV（Acropolis Hypervisor）**

です。

今回はNutanixの仮想化を支えるAHVについて学んでいきましょう。

---

# そもそも仮想化とは？

AHVを理解する前に、まずは**仮想化**について確認しましょう。

通常、1台の物理サーバーには、

- CPU
- メモリ
- ストレージ
- NIC

などのハードウェアが搭載されています。

従来は、

**1台の物理サーバーに1つのOS**

という構成が一般的でした。

```text
┌─────────────────┐
│   Application   │
├─────────────────┤
│       OS        │
├─────────────────┤
│ Physical Server │
└─────────────────┘
```

しかし、この構成ではサーバーのCPUやメモリを十分に使い切れない場合があります。

そこで、1台の物理サーバー上で複数の仮想的なコンピューターを動かす**サーバー仮想化**が利用されます。

```text
┌────────┐ ┌────────┐ ┌────────┐
│  VM 1  │ │  VM 2  │ │  VM 3  │
│Windows │ │ Linux  │ │ Linux  │
└────────┘ └────────┘ └────────┘
       ↓        ↓        ↓
┌────────────────────────────┐
│        Hypervisor          │
├────────────────────────────┤
│      Physical Server       │
└────────────────────────────┘
```

それぞれのVMは独立したコンピューターのように動作します。

---

# ハイパーバイザーとは？

物理サーバー上でVMを動作させるために利用するソフトウェアが、

**Hypervisor（ハイパーバイザー）**

です。

ハイパーバイザーは物理サーバーが持つ、

- CPU
- メモリ
- ストレージ
- ネットワーク

などのリソースを仮想化し、VMへ割り当てます。

たとえば物理サーバーに64GBのメモリが搭載されている場合、

```text
Physical Memory
64GB

├─ VM1 → 16GB
├─ VM2 → 8GB
├─ VM3 → 16GB
└─ その他
```

のように、複数のVMへリソースを割り当てられます。

つまりハイパーバイザーは、

> **物理ハードウェアとVMの間に入り、仮想化されたリソースを管理する存在**

です。

---

# AHVとは？

Nutanixが提供するハイパーバイザーが、

**AHV（Acropolis Hypervisor）**

です。

AHVはNutanix環境でVMを動作させるための仮想化基盤として利用できます。

構造を単純化すると、

```text
┌─────────────────────┐
│ VM │ VM │ VM │ CVM │
├─────────────────────┤
│        AHV          │
├─────────────────────┤
│ Physical Hardware   │
└─────────────────────┘
```

となります。

AHVが物理ハードウェアを仮想化し、その上でUser VMやCVMが動作します。

前回登場した**CVMも仮想マシン**なので、AHV環境ではAHV上で動作しているという関係になります。

---

# AHVはType 1ハイパーバイザー

ハイパーバイザーには、大きく分けて、

- Type 1
- Type 2

があります。

AHVは**Type 1（ベアメタル型）ハイパーバイザー**です。

Type 1では、物理ハードウェア上で直接ハイパーバイザーが動作します。

```text
VM
↓
Hypervisor
↓
Hardware
```

代表的なType 1ハイパーバイザーには、

- Nutanix AHV
- VMware ESXi
- Microsoft Hyper-V

などがあります。

一方、Type 2ではホストOSの上で仮想化ソフトウェアが動作します。

```text
VM
↓
Virtualization Software
↓
Host OS
↓
Hardware
```

個人PCなどで利用される仮想化ソフトウェアでは、このような構成が使われることがあります。

NCAでは、

**AHV = Type 1 Hypervisor**

と覚えておきましょう。

---

# AHVとKVM

AHVについて調べていると、

**KVM**

という言葉も登場します。

KVMは、

**Kernel-based Virtual Machine**

の略です。

Linuxカーネルに組み込まれている仮想化技術です。

AHVはこのKVMをベースとして構築されています。

ただし、

**AHVとKVMはまったく同じもの**

という意味ではありません。

NutanixはKVMを基盤として、Nutanix環境で利用するための仮想化機能や管理機能を統合しています。

NCAでは、

> **AHVはKVMをベースとしたNutanixのハイパーバイザー**

という関係を理解しておけばよいでしょう。

---

# AHVとCVMの関係

ここまで学んだ内容を組み合わせてみましょう。

1台のNutanix Nodeを簡略化すると、

```text
┌────────────────────────┐
│         Node           │
│                        │
│ ┌────┐ ┌────┐ ┌─────┐ │
│ │VM A│ │VM B│ │ CVM │ │
│ └────┘ └────┘ └─────┘ │
│                        │
├────────────────────────┤
│          AHV           │
├────────────────────────┤
│ CPU / Memory / Storage │
└────────────────────────┘
```

となります。

AHVはハードウェアを仮想化してVMを動かします。

一方、CVMはNutanixのストレージサービスなどを提供します。

つまり、

**AHV = VMを動かす仮想化基盤**

**CVM = Nutanixのサービスを提供するController VM**

です。

この違いはしっかり整理しておきましょう。

---

# Nutanix Cluster全体で見ると？

Nutanixでは複数のNodeによってClusterを構成します。

それぞれのNodeでAHVが動作します。

```text
              Nutanix Cluster

┌─────────────┐
│   Node 1    │
│ VM VM CVM   │
│     AHV     │
└─────────────┘

┌─────────────┐
│   Node 2    │
│ VM VM CVM   │
│     AHV     │
└─────────────┘

┌─────────────┐
│   Node 3    │
│ VM VM CVM   │
│     AHV     │
└─────────────┘
```

そのため、

**Cluster → Node → AHV → VM**

という関係をイメージすると分かりやすくなります。

---

# AHV上のVM

AHV上ではさまざまなOSを持つVMを動作させることができます。

たとえば、

```text
Nutanix Node

├─ Windows Server VM
├─ Linux VM
├─ Application Server VM
├─ Database Server VM
└─ CVM
```

といった構成です。

VMにはそれぞれ、

- vCPU
- Memory
- Disk
- NIC

などの仮想ハードウェアを割り当てます。

---

# vCPUとは？

VMへ割り当てる仮想CPUを、

**vCPU（Virtual CPU）**

と呼びます。

たとえば、

```text
Physical CPU
     ↓
    AHV
     ↓
┌──────────┐
│ VM A     │
│ 4 vCPU   │
└──────────┘
```

のように、物理CPUのリソースを仮想化してVMへ提供します。

VMから見ると、自分専用のCPUが存在しているように見えます。

---

# vNICとは？

VMがネットワーク通信するために利用する仮想的なNICを、

**vNIC（Virtual Network Interface Card）**

と呼びます。

物理サーバーではLANケーブルを接続するNICがありますが、VMでは仮想的なNICを利用します。

```text
VM
│
vNIC
│
Virtual Network
│
Physical NIC
│
Physical Network
```

AHV環境でもVMにvNICを設定してネットワークへ接続します。

Nutanixの仮想ネットワークについては別の記事で詳しく扱います。

---

# AHV上で行うVMの基本操作

NCAではVMの基本的な管理についても理解しておく必要があります。

代表的な操作として、

- VMの作成
- VMの起動
- VMの停止
- VMの再起動
- VMの削除
- CPU・メモリなどの設定
- Diskの設定
- NICの設定

などがあります。

ただし、管理者がAHVそのものを直接操作してすべて管理するわけではありません。

Nutanixでは、主に**Prism**を利用してVMを管理します。

```text
Administrator
      ↓
    Prism
      ↓
Nutanix Cluster
      ↓
     AHV
      ↓
      VM
```

管理者はPrismのGUIなどから操作し、AHV上のVMを管理できます。

---

# AHVとPrismの違い

ここも最初は混乱しやすいポイントです。

**AHVとPrismは役割が違います。**

| 技術 | 役割 |
|---|---|
| AHV | VMを動かすハイパーバイザー |
| Prism | Nutanix環境を管理するインターフェース |

たとえば、

**「VMを動かしているのは？」**

と聞かれたら、

**AHV**

です。

一方、

**「Nutanix環境を管理するために利用するのは？」**

と聞かれたら、

**Prism**

となります。

---

# AHVとVMware ESXi

仮想化を勉強したことがある人なら、

**VMware ESXi**

を聞いたことがあるかもしれません。

AHVとESXiは、どちらもType 1ハイパーバイザーとしてVMを動作させる役割を持ちます。

大まかに比較すると、

| 項目 | AHV | VMware ESXi |
|---|---|---|
| 提供 | Nutanix | VMware |
| 種類 | Type 1 | Type 1 |
| 主な役割 | VMの実行 | VMの実行 |
| 管理 | Prismと統合 | VMware管理製品と組み合わせて利用 |
| 基盤 | KVMベース | VMware独自 |

NCAでは細かな製品比較を暗記するより、

**AHVはNutanix環境に統合されたハイパーバイザー**

という特徴を理解することが重要です。

---

# はちみつ屋さんで例えると？

今回もはちみつ屋さんで考えてみましょう。

大きな建物が1つあります。

これが**Node**です。

建物の中には、

- はちみつ販売店
- カフェ
- お菓子屋さん

など、複数のお店があります。

これらが**VM**です。

しかし、建物のスペースや電気などのリソースを好き勝手に使わせるわけにはいきません。

そこで、

「カフェにはこのスペース」

「販売店にはこのスペース」

「お菓子屋さんにはこのスペース」

というように、建物のリソースを分配する管理者が必要になります。

この役割が**AHV**です。

```text
建物
(Node)

    ↓

スペースを管理
(AHV)

    ↓

┌──────┬──────┬──────┐
│店舗A │店舗B │店舗C │
│ VM   │ VM   │ VM   │
└──────┴──────┴──────┘
```

そして、その建物にはもう一人、

**倉庫や在庫システムを管理する特別な店員さん**

がいます。

これが前回登場した**CVM**です。

つまり、

**AHV = 建物のリソースをVMへ割り当てる**

**CVM = Nutanixのストレージなどを管理する**

という違いがあります。

---

# NCA対策として覚えておきたいポイント

今回特に押さえておきたい内容をまとめます。

| 用語 | ポイント |
|---|---|
| AHV | Acropolis Hypervisor |
| AHV | Nutanixが提供するハイパーバイザー |
| AHV | Type 1ハイパーバイザー |
| KVM | Kernel-based Virtual Machine |
| AHV | KVMをベースとしている |
| VM | 仮想マシン |
| vCPU | VMへ提供される仮想CPU |
| vNIC | VMが利用する仮想NIC |
| CVM | Nutanixサービスを提供するController VM |
| Prism | Nutanix環境を管理するインターフェース |

特に、

```text
Hardware
   ↓
  AHV
   ↓
VM / CVM
```

という位置関係を覚えておきましょう。

---

# ここまでのNutanix構成を整理

第1回から今回までの内容をつなげると、かなりNutanixの全体像が見えてきます。

```text
Nutanix Cluster
│
├─ Node 1
│   ├─ AHV
│   ├─ User VM
│   ├─ CVM
│   └─ Storage
│
├─ Node 2
│   ├─ AHV
│   ├─ User VM
│   ├─ CVM
│   └─ Storage
│
└─ Node 3
    ├─ AHV
    ├─ User VM
    ├─ CVM
    └─ Storage

各NodeのCVMが連携
        ↓
       DSF
        ↓
分散ストレージとして利用
```

最初の記事で登場したNodeやClusterと、前回のAOS・CVM・DSF、今回のAHVがここでつながります。

---

# まとめ

今回はNutanixのハイパーバイザーである**AHV**について学びました。

AHVは、

**Acropolis Hypervisor**

の略で、Nutanixが提供するType 1ハイパーバイザーです。

物理サーバーのCPUやメモリなどを仮想化し、その上で複数のVMを動作させます。

そしてNutanix環境では、

**AHVがVMを動かし、CVMがNutanixのストレージサービスなどを提供する**

という役割分担があります。

まずは、

```text
Node
 ↓
AHV
 ↓
VM / CVM
```

という関係をしっかり理解しておきましょう。

次回は、これまで登場してきたNutanix環境を実際に管理するための**Prism**について学んでいきます。