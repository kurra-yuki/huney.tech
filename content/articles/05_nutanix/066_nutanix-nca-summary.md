---
title: "Nutanix総まとめ！主要コンポーネントと管理機能を総復習【NCA 7.5対策】"
slug: nutanix-nca-summary
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策の総まとめとして、HCI・AOS・AHV・CVM・DSF・Prism・LCM・NCC・Volumesなど、これまで学習したNutanixの主要コンポーネントと管理機能を横断的に整理します。"
description: "NCA 7.5対策の総まとめとして、HCI・AOS・AHV・CVM・DSF・Prism・LCM・NCC・Volumesなど、これまで学習したNutanixの主要コンポーネントと管理機能を横断的に整理します。"
---

# Nutanix総まとめ！主要コンポーネントと管理機能を総復習【NCA 7.5対策】

## はじめに

ここまでNCA対策として、Nutanixの基本的な仕組みを学習してきました。

最初は、

**「Nutanixって何？」**

というところから始まり、

- HCI
- AOS
- AHV
- CVM
- DSF
- Prism
- VM
- Network
- Storage
- Cluster
- LCM
- License
- NCC
- Alert / Event
- Performance
- Volumes
- Support

など、さまざまな用語が登場しました。

一つひとつを理解していても、

**「結局これらがどうつながっているの？」**

となってしまうことがあります。

そこで今回は、これまで学習してきた内容をつなげながら、

**Nutanix環境の全体像**

を総復習していきましょう。

---

# まずはNutanixとは？

Nutanixを理解するうえで、最初に登場したのが、

**HCI（Hyperconverged Infrastructure）**

です。

従来の3Tier Infrastructureでは、

```text
Compute
   │
Network
   │
Storage
```

のように、Server・Network・Storageをそれぞれ別の仕組みとして構築することが一般的でした。

Nutanixでは、

**ComputeとStorageなどをSoftwareによって統合的に扱うHCI**

という考え方を採用しています。

```text
┌─────────────────────┐
│   Nutanix Cluster   │
│                     │
│ Compute + Storage   │
│                     │
└─────────────────────┘
```

これによってInfrastructureをよりシンプルに管理できるようにします。

---

# NodeとCluster

Nutanix環境の基本単位となるのが、

**Node**

です。

Nodeは、簡単にいえばNutanix Clusterを構成するServerです。

```text
Node 1
Node 2
Node 3
```

複数のNodeをまとめることで、

**Cluster**

を構成します。

```text
Nutanix Cluster

┌────────┐
│ Node 1 │
├────────┤
│ Node 2 │
├────────┤
│ Node 3 │
└────────┘
```

各Nodeが持つComputeやStorage Resourceを組み合わせて利用します。

---

# Scale-Out

NutanixではResourceが必要になった場合、

**Nodeを追加してClusterを拡張する**

Scale-Outという考え方が重要です。

```text
3 Nodes

Node ─ Node ─ Node

        ↓

4 Nodes

Node ─ Node ─ Node ─ Node
```

Nodeを追加することで、ComputeやStorage Resourceを増やしていきます。

NCAでは、

**Nutanix = Scale-Out Architecture**

という基本を覚えておきましょう。

---

# AHVとは？

Node上でVMを動作させるために利用されるのが、

**AHV**

です。

AHVはNutanixが提供するHypervisorです。

```text
VM
VM
VM
 │
 ▼
AHV
 │
 ▼
Physical Node
```

Hypervisorは、Physical Server上で複数のVMを動作させるためのSoftwareです。

AHVはType 1 Hypervisorとして動作します。

---

# AHVとVM

AHV上では、

```text
VM A
VM B
VM C
```

などのVirtual Machineを動作させます。

VMには、

- vCPU
- Memory
- vDisk
- vNIC

などのVirtual Resourceを割り当てます。

```text
VM
│
├─ vCPU
├─ Memory
├─ vDisk
└─ vNIC
```

これらのResourceを利用してGuest OSやApplicationを動作させます。

---

# CVMとは？

Nutanix Architectureで非常に重要なのが、

**CVM（Controller Virtual Machine）**

です。

各NodeにはCVMが配置されます。

```text
Node 1
├─ AHV
└─ CVM

Node 2
├─ AHV
└─ CVM

Node 3
├─ AHV
└─ CVM
```

CVMはNutanixのStorageやCluster Serviceなどを支える重要なController VMです。

Nutanixを理解するときは、

**CVMは普通のApplication VMとは役割が違う**

ことを意識しましょう。

---

# AOSとは？

**AOS（Acropolis Operating System）**

は、Nutanix Infrastructureの中核となるSoftwareです。

Nutanix Clusterでは、

```text
Hardware
   │
   ▼
AHV / Virtualization
   │
   ▼
AOS / Nutanix Services
```

という形で、SoftwareによってInfrastructureを制御します。

AOSはNutanixの分散StorageやData Serviceなどを提供する中心的な存在です。

---

# DSFとは？

NutanixのStorage Architectureで重要なのが、

**DSF（Distributed Storage Fabric）**

です。

各Nodeに搭載されたStorageをまとめて、

**Cluster全体の分散Storage**

として利用します。

```text
Node 1 Storage ─┐
Node 2 Storage ─┼─→ DSF
Node 3 Storage ─┘
                    │
                    ▼
           Distributed Storage
```

これによって、複数NodeのStorage Resourceを統合的に利用できます。

---

# NutanixのStorage構造

通常のVM Storageでは、

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

という関係を学習しました。

特に、

**Storage Container**

と

**vDisk**

の違いを整理しておきましょう。

Storage Containerは、

> 論理的なStorage領域

です。

vDiskは、

> VMが利用するVirtual Disk

です。

---

# Data Locality

Nutanix Storageでは、

**Data Locality**

という考え方も重要です。

基本的な考え方は、

> VMが動作しているNodeに、そのVMが利用するDataをできるだけLocalに配置する

というものです。

```text
Node 1

VM A
 │
 ▼
Local Storage Data
```

Local Accessを活用することで、効率的なStorage Accessを実現します。

---

# RFとは？

Storage Dataを保護するために、

**RF（Replication Factor）**

という考え方があります。

たとえばRF2では、Dataを複数のFailure Domainに保持することで障害へ備えます。

```text
Data
 │
 ├─ Copy
 │
 └─ Copy
```

NCAでは、

**RF = Data Resiliencyに関係する**

と理解しておきましょう。

---

# Prismとは？

Nutanix環境を管理するためのInterfaceが、

**Prism**

です。

Prismから、

- VM
- Storage
- Network
- Health
- Alert
- Event
- Performance

などを管理・確認できます。

```text
Administrator
      │
      ▼
    Prism
      │
 ┌────┼─────┬─────┐
 ▼    ▼     ▼     ▼
VM  Storage Network Health
```

これまでの記事でも何度も登場しました。

Nutanixを管理するときの中心的なInterfaceです。

---

# Prism ElementとPrism Central

Prismには、

**Prism Element**

と

**Prism Central**

があります。

Prism Elementは、

> 個々のClusterを管理する

ために利用します。

```text
Prism Element
      │
      ▼
 Cluster A
```

Prism Centralは、

> 複数Clusterを集中管理する

ために利用します。

```text
          Prism Central
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
   Cluster A Cluster B Cluster C
```

つまり、

**PE = 個別Cluster**

**PC = 複数Clusterの集中管理**

と覚えましょう。

---

# VM管理

PrismからVMの基本操作を行えます。

たとえば、

- Create
- Start
- Stop
- Restart
- Clone
- Snapshot
- Delete

などです。

ここで特に覚えておきたいのが、

**Clone**

と

**Snapshot**

です。

Cloneは、

> VMを複製する

ために利用します。

Snapshotは、

> 特定時点の状態を保持する

ために利用します。

ただし、

**Snapshot = Backupそのもの**

ではないことに注意しましょう。

---

# NutanixのNetwork

VMは、

**vNIC**

を利用してNetworkへ接続します。

基本的な流れは、

```text
VM
 ↓
vNIC
 ↓
Subnet
 ↓
Virtual Switch
 ↓
Physical NIC
 ↓
Physical Switch
 ↓
External Network
```

です。

---

# SubnetとVLAN

AHV環境では、VMが接続するNetworkを、

**Subnet**

として管理します。

そしてVLAN Networkでは、

**VLAN ID**

によってNetworkを分離できます。

```text
VM A
 ↓
Subnet A
 ↓
VLAN 100


VM B
 ↓
Subnet B
 ↓
VLAN 200
```

異なるVLAN同士を通信させる場合には、L3 Routingが必要になります。

---

# StorageとNetworkをつなげて考える

VMは、

```text
             VM
          ┌──┴──┐
          ▼     ▼
        vDisk  vNIC
          │     │
          ▼     ▼
      Storage Network
```

というように、Computeだけで動いているわけではありません。

そのためVMの問題を調査するときには、

- Compute
- Storage
- Network

をまとめて考える必要があります。

---

# LCMとは？

Nutanix環境のSoftwareやFirmwareなどのLifecycleを管理するのが、

**LCM（Life Cycle Manager）**

です。

基本的な流れは、

```text
Inventory
   ↓
Update確認
   ↓
Pre-Check
   ↓
Update
   ↓
確認
```

です。

LCMを利用することで、Nutanix環境のLifecycle Managementを行います。

---

# LCMとNCCを混同しない

ここは整理しておきましょう。

**LCM**

は、

> SoftwareやFirmwareなどのLifecycle・Update管理

です。

**NCC**

は、

> ClusterのHealth Check

です。

```text
LCM
↓
Update / Lifecycle


NCC
↓
Health Check
```

役割がまったく違います。

---

# License

Nutanix Softwareを利用するためには、

**License**

も重要です。

これまで、

- Starter
- Pro
- Ultimate

などのEditionについて学習しました。

Licenseでは、

**利用する機能や環境に応じて適切なLicenseを管理する**

ことが重要です。

また、

```text
License
≠
Software Version
```

です。

LicenseとVersionは別の概念として整理しましょう。

---

# NCCとは？

**NCC（Nutanix Cluster Check）**

は、

Nutanix ClusterのHealthを確認するためのツールです。

```text
Cluster
   ↓
 NCC
   ↓
Health Checks
```

たとえば、

- Hardware
- Storage
- Network
- Configuration
- Services

などの状態確認に役立ちます。

---

# Healthとは？

Healthは、

> **現在のSystemやComponentがどのような状態なのか**

を確認するための情報です。

```text
Cluster Health

├─ Node
├─ VM
├─ Storage
├─ Network
└─ Services
```

PrismからHealthを確認し、必要に応じてNCCなどを利用して詳しく調査します。

---

# Alertとは？

**Alert**は、

> 問題や注意すべき状態を管理者へ知らせるもの

です。

```text
Problem
   ↓
 Alert
   ↓
Administrator
```

AlertではSeverityも重要です。

たとえば、

- Info
- Warning
- Critical

など、問題の重大度を判断する情報があります。

---

# Eventとは？

**Event**は、

> Nutanix環境内で何が起きたのかを記録するもの

です。

たとえば、

```text
09:00 VM Start

09:30 Network Change

09:35 VM Restart
```

といった出来事を確認できます。

障害調査では、

**問題発生前に何が変更されたのか**

を確認するためにも役立ちます。

---

# Health・Alert・Eventの違い

ここはNCA対策として整理しておきましょう。

```text
Health
↓
今どうなっている？


Alert
↓
問題・注意がある！


Event
↓
何が起きた？
```

この3つを混同しないようにしましょう。

---

# Performance Monitoring

「VMが遅い」といった問題では、

**Performance**

を確認します。

代表的な指標として、

- CPU
- Memory
- IOPS
- Latency
- Throughput

があります。

---

# IOPS・Latency・Throughput

Storage Performanceで特に重要なのが、この3つです。

| 指標 | 意味 |
|---|---|
| IOPS | 1秒間のI/O処理回数 |
| Latency | I/Oの応答時間 |
| Throughput | 単位時間あたりのData転送量 |

覚え方は、

```text
IOPS
↓
何回？


Latency
↓
どのくらい時間がかかった？


Throughput
↓
どのくらいの量？
```

です。

---

# Bottleneck

Performance問題では、

**Bottleneck**

を探します。

Bottleneckとは、

> System全体のPerformanceを制限している部分

です。

たとえば、

```text
CPU      → Normal
Memory   → Normal
Network  → Normal
Storage  → High Latency
```

なら、

**StorageがBottleneckになっている可能性**

があります。

---

# Nutanix Volumes

通常のVM Storageとは別に、

**Nutanix Volumes**

についても学習しました。

Volumesは、

> Nutanixの分散Storageを利用してBlock Storageを提供する機能

です。

```text
Server / VM
     │
     ▼
   iSCSI
     │
     ▼
Volume Group
     │
 ┌───┼───┐
 ▼   ▼   ▼
Vol Vol Vol
```

---

# Volume Group

**Volume Group**は、

複数のVolumeをまとめて管理するための単位です。

```text
Volume Group
     │
     ├─ Volume 1
     ├─ Volume 2
     └─ Volume 3
```

そしてVolumeは、Block Storageとして利用するStorage領域です。

---

# iSCSI

Volumesでは、

**iSCSI**

が重要です。

iSCSIは、

> IP Networkを利用してBlock Storageへアクセスする仕組み

です。

```text
Initiator
    │
    │ iSCSI
    ▼
 Target
    │
    ▼
Volume
```

---

# InitiatorとTarget

iSCSIでは、

**Initiator = Storageを利用する側**

**Target = Storageを提供する側**

です。

```text
Server
Initiator
   │
   ▼
iSCSI
   │
   ▼
Storage
Target
```

この関係を覚えておきましょう。

---

# vDiskとVolumeの違い

ここも復習しておきましょう。

通常のVM Storageは、

```text
VM
↓
vDisk
↓
Storage Container
```

です。

Volumesでは、

```text
Server / VM
↓
Volume Group
↓
Volume
```

となります。

つまり、

**vDisk = VMの通常のVirtual Disk**

**Volume = Block Storageとして提供されるStorage領域**

と整理できます。

---

# Nutanix Support

自分たちだけで問題を解決できない場合には、

**Nutanix Support**

を利用します。

```text
Problem
   ↓
Troubleshooting
   ↓
原因不明
   ↓
Support Case
```

Support Caseでは、問題の状況をできるだけ具体的に伝えることが重要です。

---

# Log

Troubleshootingでは、

**Log**

も重要です。

LogにはSystem内部で発生した処理やErrorなどの情報が記録されています。

```text
Event
↓
何が起きた？


Log
↓
内部で具体的に何が起きていた？
```

という違いを意識しましょう。

---

# Nutanix全体を1枚で整理

ここまでの内容をまとめてみましょう。

```text
                    Prism
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
         VM         Health     Management
          │           │           │
     ┌────┴────┐      │      ┌────┼────┐
     ▼         ▼      ▼      ▼    ▼    ▼
   vCPU      vNIC    NCC    LCM Alert Event
   Memory      │
   vDisk       ▼
     │       Subnet
     ▼         │
 Storage       ▼
Container     VLAN
     │
     ▼
    DSF
     │
     ▼
    CVM
     │
     ▼
   Cluster
     │
 ┌───┼─────────────┐
 ▼   ▼             ▼
Node Node          Node
 │
 ▼
AHV
 │
 ▼
VM
```

すべての用語を個別に覚えるのではなく、

**「どこに存在して、何を担当しているのか」**

を考えると理解しやすくなります。

---

# 「何を使う？」で覚える

NCA対策では、

**目的から機能を選べるようにする**

ことも重要です。

| やりたいこと | 主に確認・利用するもの |
|---|---|
| VMを作成したい | Prism |
| VMを複製したい | Clone |
| 特定時点の状態を保持したい | Snapshot |
| VMをNetworkへ接続したい | vNIC / Subnet |
| Networkを論理的に分離したい | VLAN |
| VMへDiskを提供したい | vDisk |
| Block Storageを提供したい | Volumes |
| 複数Volumeをまとめたい | Volume Group |
| IP経由でBlock Storageへ接続したい | iSCSI |
| ClusterのHealthを確認したい | Prism / NCC |
| 問題の通知を確認したい | Alert |
| 過去に何が起きたか確認したい | Event |
| VMが遅い原因を調査したい | Performance |
| Updateを管理したい | LCM |
| 複数Clusterを管理したい | Prism Central |
| 詳細な障害情報を確認したい | Log |
| 自分たちで解決できない | Nutanix Support |

この対応関係を理解できると、Scenario形式の問題にも対応しやすくなります。

---

# 「VMが遅い」と言われたら？

ここからは実践的に考えてみましょう。

ユーザーから、

**「VMが遅いです」**

と連絡が来ました。

まず、

```text
VMが遅い
   ↓
Prism
   ↓
Performance
```

を確認します。

そして、

```text
CPU？
Memory？
Storage？
Network？
```

と原因を切り分けます。

Storageが怪しい場合には、

```text
IOPS
Latency
Throughput
```

などを確認します。

---

# 「Clusterがおかしい」と言われたら？

Cluster全体に問題がありそうなら、

```text
Cluster Problem
      ↓
Prism
      ↓
Health / Alert
      ↓
NCC
```

と調査できます。

さらに、

```text
Event
↓
問題発生前に何が起きた？
```

を確認します。

---

# 「昨日からおかしい」と言われたら？

この場合は、

**Event**

が重要な手掛かりになります。

```text
昨日
 │
 ├─ Configuration Change
 ├─ VM Restart
 ├─ Update
 └─ Network Change
```

などを確認し、

**問題発生前に何が変化したのか**

を調査します。

---

# 「Updateしたい」と言われたら？

SoftwareやFirmwareなどをUpdateする場合には、

**LCM**

を考えます。

```text
Inventory
   ↓
Update確認
   ↓
Pre-Check
   ↓
Update
```

Update前後にはClusterのHealth確認も重要です。

---

# 「Block Storageが欲しい」と言われたら？

Block Storageを提供したい場合には、

**Nutanix Volumes**

です。

```text
Server
  ↓
iSCSI
  ↓
Volume Group
  ↓
Volume
```

通常のvDiskとの違いを意識しましょう。

---

# 「複数Clusterをまとめて管理したい」と言われたら？

この場合は、

**Prism Central**

です。

```text
Prism Central
      │
 ┌────┼────┐
 ▼    ▼    ▼
C1   C2   C3
```

個別Clusterを管理するPrism Elementとの違いを理解しておきましょう。

---

# トラブルシューティングの総復習

問題が発生した場合の基本的な流れも整理します。

```text
① Problem
     ↓
② Impact確認
     ↓
③ Prism
     ↓
④ Health / Alert
     ↓
⑤ Event
     ↓
⑥ Performance
     ↓
⑦ NCC
     ↓
⑧ Knowledge Base / Log
     ↓
⑨ Support Case
     ↓
⑩ 問題対応
     ↓
⑪ Health再確認
```

実際の手順は問題によって異なりますが、

**いきなり原因を決めつけず、情報を集めて範囲を絞る**

という考え方が重要です。

---

# はちみつ屋さんでNutanix全体を整理

最後に、これまでのNutanix環境をすべて、

**はちみつ屋さん**

で考えてみましょう。

---

## Clusterは店舗グループ

```text
はちみつ屋さんグループ
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
店舗A 店舗B 店舗C
```

店舗グループ全体が、

**Cluster**

です。

各店舗が、

**Node**

です。

---

## AHVは店舗スペースの管理人

各店舗には、複数の売り場があります。

```text
店舗A
 │
 ├─ 売り場1
 ├─ 売り場2
 └─ 売り場3
```

この売り場が、

**VM**

です。

売り場を配置・管理する仕組みが、

**AHV**

のイメージです。

---

## CVMは店舗運営スタッフ

各店舗には、

**店舗全体の仕組みを支える専門スタッフ**

がいます。

これが、

**CVM**

です。

```text
店舗
 │
 ├─ 売り場
 ├─ 売り場
 └─ 運営スタッフ
        ↓
       CVM
```

---

## DSFは共同倉庫

各店舗の倉庫を、

**グループ全体の巨大な共同倉庫**

として利用します。

```text
店舗A倉庫 ─┐
店舗B倉庫 ─┼─→ 巨大な共同倉庫
店舗C倉庫 ─┘
```

これが、

**DSF**

です。

---

## Prismは本部の管理画面

本部から、

- 店舗
- 売り場
- 倉庫
- Network
- 問題

などを確認する管理画面があります。

これが、

**Prism**

です。

---

## NCCは定期点検

各店舗が正常か、

```text
レジOK？
倉庫OK？
Network OK？
設備OK？
```

と点検します。

これが、

**NCC**

です。

---

## Alertは警報

冷蔵庫の温度が上がったら、

```text
ピーピー！
温度が高い！
```

と通知します。

これが、

**Alert**

です。

---

## Eventは店舗日誌

```text
09:00 開店
10:00 設定変更
11:00 冷蔵庫交換
```

という記録が、

**Event**

です。

---

## Performanceは店舗の処理能力

```text
店員は忙しい？
↓
CPU


作業場所は足りる？
↓
Memory


何回商品を出せる？
↓
IOPS


商品が届くまで何秒？
↓
Latency


何箱運べる？
↓
Throughput
```

これが、

**Performance Monitoring**

です。

---

## LCMは設備更新担当

店舗設備を、

```text
現在のVersion確認
↓
新しいVersion確認
↓
問題がないかCheck
↓
Update
```

する担当が、

**LCM**

です。

---

## Volumesは貸し倉庫サービス

共同倉庫のStorageを、

**外部のお店にもBlock Storageとして貸し出す**

仕組みが、

**Nutanix Volumes**

です。

```text
外部のお店
     ↓
   iSCSI
     ↓
貸し倉庫センター
     ↓
Volume Group
```

---

## Supportはメーカーサポート

どうしても自分たちで問題を解決できなければ、

**メーカーへ問い合わせます。**

これが、

**Nutanix Support**

です。

---

# 最重要用語まとめ

最後に、NCA対策として重要な用語をまとめます。

| 用語 | 一言でいうと |
|---|---|
| HCI | Compute・StorageなどをSoftwareで統合 |
| Node | Clusterを構成するServer |
| Cluster | 複数Nodeをまとめたもの |
| AHV | NutanixのHypervisor |
| VM | Virtual Machine |
| AOS | Nutanix Infrastructureの中核Software |
| CVM | 各NodeでNutanix Serviceを支えるController VM |
| DSF | 分散Storage |
| Storage Pool | Storage Resourceをまとめる |
| Storage Container | 論理Storage領域 |
| vDisk | VMのVirtual Disk |
| vNIC | VMのVirtual NIC |
| Subnet | AHVでVM Networkを管理するObject |
| VLAN | Networkを論理的に分離 |
| Prism Element | 個別Cluster管理 |
| Prism Central | 複数Clusterの集中管理 |
| LCM | Lifecycle / Update管理 |
| NCC | Cluster Health Check |
| Health | 現在の状態 |
| Alert | 問題・注意を通知 |
| Event | 発生した出来事の記録 |
| IOPS | 1秒間のI/O回数 |
| Latency | I/O応答時間 |
| Throughput | 単位時間あたりのData量 |
| Volumes | Block Storage Service |
| Volume Group | Volumeをまとめる単位 |
| iSCSI | IP Network経由でBlock Storageへ接続 |
| Initiator | Storageを利用する側 |
| Target | Storageを提供する側 |
| Support Case | Nutanix Supportへの問い合わせ |

---

# 最後に覚えておきたい関係

NCAでは単語だけではなく、

**用語同士の関係**

を理解することが重要です。

```text
Node
 ↓
Cluster


Physical Server
 ↓
AHV
 ↓
VM


VM
 ↓
vDisk
 ↓
Storage Container
 ↓
DSF


VM
 ↓
vNIC
 ↓
Subnet
 ↓
VLAN


Administrator
 ↓
Prism


Cluster Health
 ↓
NCC


問題発生
 ↓
Alert


何が起きた？
 ↓
Event


Performance
 ↓
CPU / Memory
IOPS / Latency / Throughput


Block Storage
 ↓
Volumes
 ↓
Volume Group
 ↓
Volume


Update
 ↓
LCM


解決できない問題
 ↓
Nutanix Support
```

この関係が頭の中でつながっていれば、NutanixのArchitectureや管理機能をかなり整理できています。

---

# まとめ

今回は、NCA対策として学習してきたNutanixの内容を総復習しました。

Nutanixでは、

**AHV**

がVMを動作させ、

**CVM・AOS・DSF**

がNutanix Infrastructureを支え、

**Prism**

から環境を管理します。

Storageでは、

**Storage Pool・Storage Container・vDisk**

を利用し、

Block Storageが必要な場合には、

**Nutanix Volumes・Volume Group・iSCSI**

を利用できます。

運用では、

**Health・Alert・Event・Performance・NCC**

を利用して環境を監視・調査します。

SoftwareやFirmwareなどのLifecycle Managementには、

**LCM**

を利用します。

そして、自分たちだけでは解決できない問題については、

**Nutanix Support**

を利用します。

最初は大量の用語が登場して難しく見えるNutanixですが、

```text
Virtualization
      │
      ├─ AHV
      └─ VM

Storage
      │
      ├─ DSF
      ├─ Container
      ├─ vDisk
      └─ Volumes

Management
      │
      ├─ Prism
      ├─ LCM
      └─ License

Monitoring
      │
      ├─ Health
      ├─ NCC
      ├─ Alert
      ├─ Event
      └─ Performance

Support
      │
      ├─ Log
      ├─ Knowledge Base
      └─ Support Case
```

というように役割ごとに分けると、全体像が見えてきます。

NCA対策では、

**「この用語は何か？」**

だけではなく、

**「何をしたいときに使うのか？」**

**「他の機能とどうつながっているのか？」**

まで意識して復習していきましょう。

これで、NCA 7.5対策として進めてきた**Nutanix基礎編は完結**です。