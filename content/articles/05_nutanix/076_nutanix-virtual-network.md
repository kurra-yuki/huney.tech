---
title: "Nutanixの仮想ネットワークとは？vNIC・Subnet・VLANを理解しよう【NCA 7.5対策】"
slug: nutanix-virtual-network
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix AHV環境における仮想ネットワークについて、vNIC・Subnet・VLAN・仮想スイッチの関係を初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix AHV環境における仮想ネットワークについて、vNIC・Subnet・VLAN・仮想スイッチの関係を初心者向けに解説します。"
---

# Nutanixの仮想ネットワークとは？vNIC・Subnet・VLANを理解しよう【NCA 7.5対策】

## はじめに

前回は、Nutanix AHV環境におけるVMの基本的な管理について学びました。

VMには、

- vCPU
- Memory
- Virtual Disk
- vNIC

などの仮想的なリソースを割り当てます。

では、作成したVMはどのようにしてほかのVMや外部ネットワークと通信するのでしょうか？

そこで重要になるのが、

**Nutanixの仮想ネットワーク**

です。

今回は、

- vNIC
- Subnet
- VLAN
- Virtual Switch

などの関係を整理しながら、AHV上のVMがどのようにネットワークへ接続されるのかを学んでいきましょう。

---

# VMにもNICが必要

物理サーバーをネットワークへ接続するときには、NICを利用します。

VMでも考え方は同じです。

ただし、VMでは物理NICではなく、

**vNIC（Virtual Network Interface Card）**

を利用します。

日本語では**仮想NIC**と呼ばれます。

```text
┌─────────────────┐
│       VM        │
│                 │
│     [vNIC]      │
└────────┬────────┘
         │
         ▼
 Virtual Network
```

つまり、

> **vNICはVMをネットワークへ接続するための仮想的なNIC**

です。

---

# Nutanixのネットワーク全体像

まずは大まかな構造を確認しましょう。

AHV環境では、VMから物理ネットワークまでを簡略化すると、

```text
VM
 │
vNIC
 │
Subnet
 │
Virtual Switch
 │
Physical NIC
 │
Physical Switch
 │
External Network
```

という流れになります。

VMから見るとネットワークへ普通に接続しているように見えますが、その裏側では仮想ネットワークと物理ネットワークが連携しています。

---

# Subnetとは？

Nutanix AHV環境で重要なのが、

**Subnet**

です。

一般的なネットワークでは「サブネット」というと、

```text
192.168.1.0/24
```

のようなIPアドレスの範囲をイメージするかもしれません。

しかし、AHVの管理上登場するSubnetは、**VMのvNICを接続する仮想ネットワークとして扱われるオブジェクト**です。

たとえば、

```text
Server-Network
VLAN ID：100
```

というSubnetを作成したとします。

VMを作成するときに、

```text
VM
 │
vNIC
 │
Server-Network
 │
VLAN 100
```

のように接続できます。

つまり、

> **VMをどの仮想ネットワークへ接続するのかを指定するためにSubnetを利用する**

と考えると分かりやすいでしょう。

---

# VLANとは？

**VLAN（Virtual LAN）**は、物理的には同じネットワーク機器を利用しながら、論理的にネットワークを分割する技術です。

たとえば、

```text
VLAN 100
Server Network

VLAN 200
Client Network

VLAN 300
Management Network
```

のようにネットワークを分離できます。

Nutanixでも、SubnetとVLAN IDを関連付けることでVMを適切なVLANへ接続できます。

---

# SubnetとVLANの関係

ここはNCAでも混乱しやすいところなので整理しておきましょう。

たとえばPrismで、

```text
Subnet Name：Web-Network
VLAN ID：100
```

というネットワークを設定したとします。

そしてVMのvNICをWeb-Networkへ接続します。

```text
VM
 │
vNIC
 │
Web-Network
 │
VLAN 100
 │
Physical Network
```

これによって、そのVMからの通信をVLAN 100へ接続できます。

簡単に考えるなら、

**Subnet = VMから見える接続先**

**VLAN ID = その通信を物理ネットワーク側で識別するための情報**

というイメージです。

---

# Prismからネットワークを管理する

NutanixではPrismから仮想ネットワークを管理できます。

これまでの記事とつなげると、

```text
Administrator
      │
      ▼
    Prism
      │
      ├─ VM
      ├─ Storage
      └─ Network
```

となります。

ネットワークについては、

- Subnetの作成
- VLAN IDの設定
- VMへのNetwork割り当て
- vNICの追加・削除

などの操作を行います。

---

# VM作成時のネットワーク設定

前回、VMを作成するときには、

- vCPU
- Memory
- Disk
- Network

などを設定すると説明しました。

Networkを設定するときには、VMのvNICをどのSubnetへ接続するかを選択します。

たとえば、

```text
WebServer01

vCPU：2
Memory：4GB
Disk：100GB

vNIC
  ↓
Web-Network
  ↓
VLAN 100
```

という構成です。

これによってWebServer01をWeb-Networkへ接続できます。

---

# 1台のVMに複数のvNICを設定できる

VMには必ず1つしかvNICを設定できないわけではありません。

用途によって複数のvNICを持たせることもできます。

たとえば、

```text
             VM
              │
       ┌──────┴──────┐
       ▼             ▼
    vNIC 1         vNIC 2
       │             │
Web-Network    Management-Network
       │             │
   VLAN 100       VLAN 200
```

のような構成です。

1台のVMを複数のネットワークへ接続する必要がある場合に利用できます。

---

# Virtual Switchとは？

VMの仮想ネットワークと物理NICの間には、

**Virtual Switch（仮想スイッチ）**

があります。

物理ネットワークでは、複数の端末を接続するためにL2 Switchを利用します。

仮想化環境では、それに近い役割をソフトウェアで実現します。

```text
VM A        VM B        VM C
 │           │           │
vNIC        vNIC        vNIC
 │           │           │
 └──────┬────┴────┬──────┘
        │
 Virtual Switch
        │
 Physical NIC
        │
 Physical Switch
```

AHVでは、このような仮想スイッチを通してVMの通信を物理ネットワークへ接続します。

---

# AHVとOpen vSwitch

AHVのネットワークを勉強すると、

**Open vSwitch（OVS）**

という名前が登場します。

Open vSwitchは、ソフトウェアで動作する仮想スイッチです。

AHVではOpen vSwitchをベースとした仮想ネットワーク機能が利用されています。

そのため、大まかな構造として、

```text
VM
 │
vNIC
 │
Subnet
 │
Open vSwitch
 │
Physical NIC
```

という関係をイメージできます。

NCAではまず、

> **AHVの仮想ネットワークではOpen vSwitchが利用される**

という点を覚えておきましょう。

---

# 物理NICとの関係

当然ながら、最終的に外部ネットワークと通信するためにはNodeの物理NICが必要です。

```text
┌───────────────────────────┐
│       Nutanix Node        │
│                           │
│ VM A              VM B    │
│  │                 │      │
│ vNIC              vNIC    │
│  └───────┬─────────┘      │
│          ▼                │
│    Virtual Switch         │
│          │                │
│     Physical NIC          │
└──────────┼────────────────┘
           │
           ▼
     Physical Switch
```

つまり、

**仮想ネットワークだけで外部通信が完結するわけではありません。**

最終的には物理ネットワークへ接続されます。

---

# Bondとは？

Nutanixのネットワークでは、

**Bond**

という言葉も登場します。

Bondは、複数の物理NICをまとめて利用する仕組みです。

たとえば、

```text
Physical NIC 1 ─┐
                ├─ Bond
Physical NIC 2 ─┘
```

のように構成します。

複数のNICを利用することで、

- 冗長性
- 可用性
- 通信経路の確保

などに役立ちます。

片方のNICや通信経路に問題が発生した場合でも、別のNICを利用できる構成を取ることができます。

---

# VM同士の通信

同じネットワークへ接続されたVM同士であれば、仮想ネットワークを利用して通信できます。

```text
VM A
 │
vNIC
 │
┌─────────────────┐
│   Subnet A      │
│   VLAN 100      │
└─────────────────┘
 │
vNIC
 │
VM B
```

一方、

```text
VM A → VLAN 100

VM B → VLAN 200
```

のように異なるVLANへ所属している場合、そのままL2通信できるわけではありません。

異なるネットワーク間で通信するには、ルーティングを行うL3の仕組みが必要になります。

これは通常のネットワークと同じ考え方です。

---

# VLAN ID 0

AHVのネットワークを学習すると、**VLAN ID 0**という設定を見ることがあります。

これは通常、

**VLANタグを付与しないネットワーク**

として扱われます。

つまり、

```text
VLAN ID：100
↓
VLAN 100として通信


VLAN ID：0
↓
Untagged Traffic
```

という違いがあります。

NCA対策として、VLAN ID 0が登場した場合には、

**Untagged**

というキーワードと結び付けて覚えておくとよいでしょう。

---

# IP Addressは誰が設定する？

ここも混乱しやすいところです。

Subnetを作成したからといって、必ずVMへ自動的にIPアドレスが設定されるわけではありません。

VMのGuest OS側で、

- Static IP
- DHCP

などを利用してIPアドレスを設定できます。

たとえば、

```text
VM
 │
Ubuntu
 │
IP Address
192.168.10.10
 │
vNIC
 │
Subnet
 │
VLAN 100
```

という形です。

つまり、

**vNIC・Subnet・VLANはネットワークへの接続**

**IPアドレスはGuest OS側のネットワーク設定**

という基本的な違いを理解しておきましょう。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

Nutanix Clusterの中に、

- 販売店
- カフェ
- 倉庫

があるとします。

それぞれが**VM**です。

各店舗には外へ出るためのドアがあります。

このドアが、

**vNIC**

です。

```text
はちみつカフェ
      │
     ドア
    (vNIC)
      │
```

しかし、ドアを開けた後にどの通路を使うのか決める必要があります。

たとえば、

```text
黄色の通路
↓
販売店用

青色の通路
↓
管理用
```

と分かれているとします。

この通路が**Subnet**です。

さらに、それぞれの通路をネットワーク上で識別する番号として、

```text
黄色 → VLAN 100
青色 → VLAN 200
```

という番号を付けます。

これが**VLAN ID**です。

そして複数の通路をまとめて、建物の外へつないでいる設備が**Virtual Switch**です。

つまり、

```text
お店
 ↓
ドア
 ↓
通路
 ↓
館内の交換設備
 ↓
建物の外

VM
 ↓
vNIC
 ↓
Subnet
 ↓
Virtual Switch
 ↓
Physical Network
```

というイメージになります。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| vNIC | VMが利用する仮想NIC |
| Subnet | VMのvNICを接続する仮想ネットワーク |
| VLAN | ネットワークを論理的に分割する仕組み |
| VLAN ID | VLANを識別する番号 |
| VLAN ID 0 | Untagged通信として扱う |
| Virtual Switch | VMの通信を扱う仮想スイッチ |
| Open vSwitch | AHVで利用される仮想スイッチ技術 |
| Physical NIC | Nodeを物理ネットワークへ接続 |
| Bond | 複数の物理NICをまとめて利用 |

特に、

```text
VM
 ↓
vNIC
 ↓
Subnet
 ↓
VLAN
 ↓
Virtual Switch
 ↓
Physical NIC
 ↓
Physical Network
```

という大まかな関係を理解しておきましょう。

---

# ここまでのNutanix構成

ここまで学習した内容をネットワークまで含めて整理すると、

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
            ┌──────┴──────┐
            │             │
           VM            CVM
            │
           vNIC
            │
          Subnet
            │
           VLAN
            │
      Virtual Switch
            │
       Physical NIC
            │
     Physical Network
```

となります。

さらにVMのDisk側を見ると、

```text
VM
 │
Virtual Disk
 │
CVM
 │
DSF
 │
Storage
```

という流れでした。

つまりVMには、

**ネットワーク側の仕組み**

と

**ストレージ側の仕組み**

の両方が存在しています。

---

# まとめ

今回はNutanix AHV環境における仮想ネットワークについて学びました。

VMは**vNIC**を利用して仮想ネットワークへ接続します。

そしてAHV環境では、VMの接続先として**Subnet**を利用します。

SubnetにはVLAN IDを関連付けることができ、

```text
VM
↓
vNIC
↓
Subnet
↓
VLAN
↓
Virtual Switch
↓
Physical Network
```

という形で、仮想マシンの通信が物理ネットワークへつながっていきます。

Nutanixだからといって、ネットワークの基本原理がまったく変わるわけではありません。

これまで学習してきた、

- NIC
- Switch
- VLAN
- IP Address

などのネットワーク知識の上に、**vNICやVirtual Switchといった仮想化の仕組みが追加されている**と考えると理解しやすくなります。

次回は、VMのもう一つの重要な要素である**Nutanixのストレージ**について詳しく学んでいきます。