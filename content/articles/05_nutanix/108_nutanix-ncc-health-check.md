---
title: "NCCとは？NutanixのHealth Checkを理解しよう【NCA 7.5対策】"
slug: nutanix-ncc-health-check
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、NCC（Nutanix Cluster Check）とHealth Checkについて、PrismでのHealth確認やNCCによるCluster診断、障害調査の基本的な流れを初心者向けに解説します。"
description: "NCA 7.5対策として、NCC（Nutanix Cluster Check）とHealth Checkについて、PrismでのHealth確認やNCCによるCluster診断、障害調査の基本的な流れを初心者向けに解説します。"
---

# NCCとは？NutanixのHealth Checkを理解しよう【NCA 7.5対策】

## はじめに

これまでの記事では、

- Cluster
- VM
- Network
- Storage
- LCM
- License

など、Nutanix環境を構成・運用するための基本的な仕組みを学んできました。

では、実際にNutanix Clusterを運用しているとき、

**「Clusterは正常に動いているのか？」**

をどのように確認すればよいのでしょうか。

そこで重要になるのが、

**Health Check**

です。

そしてNutanixにはClusterの状態を確認するための、

**NCC（Nutanix Cluster Check）**

というツールがあります。

今回は、Nutanix環境を正常に運用するためのHealth Checkについて学んでいきましょう。

---

# Health Checkとは？

**Health Check**とは、システムが正常な状態で動作しているか確認することです。

Nutanix Clusterには、

- Node
- CVM
- Storage
- Network
- VM
- Nutanix Services

など、さまざまなコンポーネントがあります。

```text
Nutanix Cluster
      │
 ┌────┼────────┬────────┐
 ▼    ▼        ▼        ▼
Node  CVM    Storage   Network
```

どこかに問題が発生すると、Cluster全体やVMへ影響する可能性があります。

そのため、

> 問題が発生してから調べるだけではなく、Clusterの状態を継続的に確認する

ことが重要です。

---

# NCCとは？

NCCは、

**Nutanix Cluster Check**

の略です。

Nutanix Clusterに対してさまざまなチェックを実行し、構成やHealthに問題がないか確認するためのツールです。

簡単に表すと、

```text
NCC
 │
 ▼
Nutanix Cluster
 │
 ├─ Configuration
 ├─ Hardware
 ├─ Network
 ├─ Storage
 └─ Services
```

といったイメージです。

NCCを利用することで、Cluster内に問題が存在していないか確認できます。

---

# NCCは何のために使う？

NCCの目的を簡単に表すと、

**Clusterの問題を発見すること**

です。

たとえば、

「Clusterの設定に問題はないか？」

「Nodeは正常か？」

「Storageに問題はないか？」

「Networkに問題はないか？」

「NutanixのServiceは正常か？」

といった項目を確認します。

```text
Cluster
   │
   ▼
  NCC
   │
   ▼
問題がないかCheck
```

Nutanix環境のトラブルシューティングでも重要なツールです。

---

# NCCはどこで動く？

NCCを理解するときには、これまで何度も登場した、

**CVM（Controller Virtual Machine）**

との関係が重要です。

NCCはCVMから実行できます。

```text
Nutanix Node
      │
     CVM
      │
     NCC
      │
      ▼
Cluster Check
```

Nutanixの管理者はCVMへアクセスし、NCCのコマンドを利用してClusterの状態を確認できます。

---

# NCCの基本コマンド

NCCで代表的なのが、

```text
ncc health_checks run_all
```

です。

これは複数のHealth Checkを実行するためのコマンドです。

イメージすると、

```text
ncc health_checks run_all
          │
          ▼
 ┌────────┼────────┐
 ▼        ▼        ▼
Check A  Check B  Check C
```

のように、Clusterに対してさまざまなチェックを実行します。

NCA対策では、

> **NCCはClusterのHealth Checkに利用する**

という役割をまず理解しておきましょう。

---

# NCCの結果

NCCを実行すると、それぞれのチェック結果が表示されます。

結果では、

- PASS
- WARN
- FAIL
- INFO

などの状態を見ることがあります。

大まかなイメージとして、

| 結果 | 意味 |
|---|---|
| PASS | Checkに問題が見つからなかった |
| WARN | 注意が必要な状態 |
| FAIL | 問題が検出された |
| INFO | 情報として確認する内容 |

となります。

たとえば、

```text
Check A → PASS
Check B → PASS
Check C → WARN
Check D → FAIL
```

となっていれば、WARNやFAILになっている項目を詳しく確認します。

---

# PASSだから絶対に問題がない？

ここは注意が必要です。

NCCですべてPASSだったからといって、

**「Nutanix環境には絶対に何の問題もない」**

という意味ではありません。

NCCは、用意されているHealth Checkに基づいてClusterの状態を確認します。

そのためトラブルシューティングでは、

- NCC
- Prism
- Alert
- Event
- Performance
- Log

など、複数の情報を組み合わせて原因を調査することが重要です。

---

# PrismからHealthを確認する

Clusterの状態確認はNCCだけではありません。

**Prism**

からもHealth情報を確認できます。

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
    Health
      │
 ┌────┼─────────┐
 ▼    ▼         ▼
Node Storage  Service
```

Prismを利用することで、GUIからClusterの状態を確認できます。

つまり、

**Prism = GUIを中心とした日常的な監視**

**NCC = Clusterに対する詳細なHealth Check**

というイメージを持っておくと分かりやすいでしょう。

---

# Health Dashboard

Prismでは、ClusterのHealthに関する情報を確認できます。

たとえば、

```text
Cluster Health

├─ Hosts
├─ VMs
├─ Storage
├─ Network
└─ Services
```

などの状態を確認し、問題が発生しているコンポーネントを特定していきます。

すべての情報をコマンドだけで確認するのではなく、Prismを利用して視覚的に状態を把握できるのがポイントです。

---

# HealthとAlertの違い

ここから先の記事でも重要になるので、

**Health**

と

**Alert**

の違いも整理しておきましょう。

Healthは、

> **現在のシステムやコンポーネントがどのような状態なのか**

を表します。

一方、Alertは、

> **何らかの問題や注意すべき状態が検出されたことを管理者へ知らせる**

ためのものです。

```text
Health
↓
現在の状態


Alert
↓
問題・注意を通知
```

たとえば、

```text
Disk Health
↓
Problem

        ↓

Alert
↓
Diskに問題があります
```

という関係です。

Alertについては次の記事で詳しく学習します。

---

# NCCとLCMの関係

第9回で学習したLCMともHealth Checkは関係します。

LCMでSoftwareやFirmwareをUpdateするとき、

**Clusterが正常な状態であること**

が重要でした。

```text
LCM
 │
 ▼
Pre-Check
 │
 ▼
Cluster Health
 │
 ├─ OK → Update
 │
 └─ Problem → 確認
```

問題を抱えたままアップデートすると、作業中にさらに問題が発生する可能性があります。

そのため、アップデート前にもClusterのHealthを確認することが重要です。

---

# NCCとアップグレード

NCCは、アップグレードやメンテナンスの前後でも役立ちます。

たとえば、

```text
Health Check
     ↓
Maintenance / Upgrade
     ↓
Health Check
```

という流れです。

作業前に問題がないことを確認し、作業後にもClusterが正常な状態へ戻っているか確認します。

これはNutanixに限らず、インフラ運用では非常に重要な考え方です。

---

# HardwareのHealth

Nutanix Clusterは物理サーバー上で動作しています。

そのため、HardwareのHealthも重要です。

たとえば、

- Disk
- NIC
- Memory
- Power Supply
- Node

などです。

```text
Hardware Health

├─ Node
├─ Disk
├─ NIC
└─ Power
```

Hardwareに問題が発生すると、その上で動作するAHV・CVM・VMなどにも影響する可能性があります。

---

# StorageのHealth

NutanixではStorageが複数Nodeに分散されています。

そのため、

- Diskの状態
- Storage Capacity
- Data Resiliency
- Storage Service

なども確認する必要があります。

```text
Storage
  │
  ├─ Disk
  ├─ Capacity
  ├─ Performance
  └─ Resiliency
```

特に、以前学習したRFなどのデータ保護機能が正常に機能できる状態なのか確認することが重要です。

---

# NetworkのHealth

Networkに問題が発生すると、

- VM通信
- Node間通信
- CVM間通信
- Management通信

などへ影響する可能性があります。

```text
Network Problem
      │
      ├─ VM Communication
      ├─ CVM Communication
      └─ Cluster Communication
```

そのためHealth Checkでは、Networkも重要な確認対象です。

---

# ServiceのHealth

Nutanixでは、さまざまなServiceが動作しています。

そのため、

**Serviceが正常に動作しているか**

もCluster Healthを判断する重要な要素です。

```text
Nutanix Cluster
      │
      ▼
   Services
      │
 ┌────┼────┐
 ▼    ▼    ▼
OK    OK   Problem
```

Serviceに問題がある場合、関連するNutanix機能が正常に動作しなくなる可能性があります。

---

# 問題を発見したらどうする？

Health Checkで問題を発見した場合、

**いきなり設定を変更する**

のではなく、まず問題の内容を確認します。

基本的な流れとしては、

```text
① 問題を検出
      ↓
② Alert / Healthを確認
      ↓
③ NCCを実行
      ↓
④ Event / Logなどを確認
      ↓
⑤ 原因を特定
      ↓
⑥ 必要な対処
      ↓
⑦ 再度Health Check
```

という流れを意識するとよいでしょう。

---

# PrismとNCCを使い分ける

PrismとNCCは競合するものではありません。

両方を組み合わせて利用します。

たとえば、

```text
Prism
  │
  ▼
「Node 2に問題がありそう」
  │
  ▼
NCC
  │
  ▼
Clusterを詳しくCheck
```

という使い方です。

Prismで異常に気付き、NCCやLogなどを利用して詳しく調査する、という流れをイメージしておきましょう。

---

# トラブルシューティングの基本

Nutanixのトラブルシューティングでも、

**問題の範囲を絞る**

ことが重要です。

たとえばVMにアクセスできない場合、

いきなり、

「AHVが壊れた！」

と判断するのではなく、

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
```

というように、これまで学習した構成を順番に確認します。

Storageであれば、

```text
VM
↓
vDisk
↓
Storage Container
↓
DSF
↓
Physical Storage
```

と確認できます。

これまでの記事でNutanixの構造を理解してきたことが、トラブルシューティングでも役立ちます。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

複数店舗を運営しているとします。

毎朝、本部では、

「冷蔵庫は正常？」

「レジは正常？」

「在庫管理システムは正常？」

「ネットワークはつながっている？」

と確認します。

これが、

**Health Check**

です。

```text
はちみつ屋さん
      │
      ▼
Health Check
      │
 ┌────┼────┬────┐
 ▼    ▼    ▼    ▼
レジ 冷蔵庫 在庫 Network
```

そして、専門スタッフが各設備を詳しく点検する仕組みが、

**NCC**

のイメージです。

---

# NCCで問題が見つかったら？

たとえば、

```text
レジ       → PASS
冷蔵庫     → PASS
Network    → WARN
在庫System → FAIL
```

という結果だったとします。

この場合、

「お店全部が壊れている」

と判断するのではなく、

**WARNやFAILになっている場所を詳しく調べる**

必要があります。

Nutanixでも同じです。

NCCの結果を利用して問題のある場所を絞り込み、Prism・Alert・Event・Logなどの情報を組み合わせながら原因を調査します。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| NCC | Nutanix Cluster Check |
| Health Check | Clusterが正常か確認する |
| CVM | NCCを実行できる |
| PASS | Checkで問題が見つからなかった |
| WARN | 注意が必要 |
| FAIL | 問題が検出された |
| Prism | GUIからHealthを確認 |
| Alert | 問題や注意すべき状態を通知 |
| LCM | Update前のHealth確認も重要 |
| Log | 詳細な原因調査に利用 |
| Troubleshooting | 情報を組み合わせて原因を絞り込む |

特に、

```text
Prism
↓
Healthを確認
↓
問題を発見
↓
NCC
↓
詳しくCheck
↓
原因調査
```

という流れをイメージしておきましょう。

---

# ここまでの運用管理を整理

これまで学習してきたNutanixの運用機能を整理すると、

```text
                    Prism
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
      LCM          License         Health
       │                              │
Version / Update                      │
                                      ▼
                                     NCC
                                      │
                                Health Check
```

となります。

つまり、

**LCM = Version・Update**

**License = 利用権**

**Health / NCC = 正常性の確認**

という役割の違いがあります。

---

# まとめ

今回は、

**NCC（Nutanix Cluster Check）**

とHealth Checkについて学びました。

NCCは、Nutanix Clusterに対してさまざまなチェックを実行し、構成やHealthに問題がないか確認するためのツールです。

代表的なコマンドとして、

```text
ncc health_checks run_all
```

があり、複数のHealth Checkを実行できます。

また、日常的な監視ではPrismからClusterのHealthを確認することも重要です。

Nutanixのトラブルシューティングでは、

**Prismだけ**

**NCCだけ**

を見るのではなく、

- Health
- NCC
- Alert
- Event
- Performance
- Log

などの情報を組み合わせて問題を絞り込んでいきます。

NCA対策では、

**「NCC = Nutanix ClusterのHealth Check」**

という基本を押さえたうえで、

**どのような場面でHealth Checkが必要なのか**

まで理解しておきましょう。

次回は、Clusterで発生した問題を管理者へ知らせるための**AlertとEvent**について詳しく学んでいきます。