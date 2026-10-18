---
title: "NutanixのPerformance Monitoringとは？CPU・Memory・IOPS・Latencyを理解しよう【NCA 7.5対策】"
slug: nutanix-performance-monitoring
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、NutanixのPerformance Monitoringについて、CPU・Memory・IOPS・Latency・Throughputなどの主要指標と、VMが遅いときの基本的な調査方法を初心者向けに解説します。"
description: "NCA 7.5対策として、NutanixのPerformance Monitoringについて、CPU・Memory・IOPS・Latency・Throughputなどの主要指標と、VMが遅いときの基本的な調査方法を初心者向けに解説します。"
---

# NutanixのPerformance Monitoringとは？CPU・Memory・IOPS・Latencyを理解しよう【NCA 7.5対策】

## はじめに

前回は、

**Alert**

と

**Event**

について学びました。

Nutanix環境で問題が発生した場合、

```text
Alert
  ↓
Health確認
  ↓
Event確認
  ↓
NCC
```

などを利用して原因を調査できます。

しかし、実際のシステム運用では、

**「障害は発生していないけれど、なんか遅い」**

という問題もよくあります。

たとえば、

- VMの動作が遅い
- アプリケーションの応答が遅い
- Storageへのアクセスが遅い
- CPU使用率が高い

といった問題です。

そこで重要になるのが、

**Performance Monitoring**

です。

今回はNutanix環境のPerformanceを確認するときに重要となる指標について学んでいきましょう。

---

# Performance Monitoringとは？

**Performance Monitoring**とは、

> システムのリソース使用状況や処理性能を継続的に確認すること

です。

Nutanix環境では、

```text
Nutanix Cluster
      │
 ┌────┼────────┐
 ▼    ▼        ▼
CPU  Memory  Storage
               │
          ┌────┼────┐
          ▼    ▼    ▼
        IOPS Latency Throughput
```

などのPerformance情報を確認します。

これによって、

**「どこがボトルネックになっているのか」**

を調査できます。

---

# PrismでPerformanceを確認する

Nutanixでは、

**Prism**

からPerformance情報を確認できます。

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
 Performance
      │
 ┌────┼─────┬─────┐
 ▼    ▼     ▼     ▼
CPU Memory IOPS Latency
```

これまでPrismは、

- VM管理
- Storage管理
- Network管理
- Health確認
- Alert確認

などで登場しました。

Performance MonitoringもPrismの重要な役割の一つです。

---

# Performanceを見る対象

Performanceを確認するときは、

**Cluster全体だけを見るわけではありません。**

たとえば、

```text
Cluster
  │
  ├─ Host / Node
  │
  ├─ VM
  │
  └─ Storage
```

など、さまざまな対象についてPerformanceを確認します。

「Cluster全体は正常そう」

という場合でも、

**特定のVMだけCPU使用率が高い**

という可能性があります。

そのため、

**どの範囲で問題が発生しているのか**

を絞り込むことが重要です。

---

# CPUとは？

まず確認したいのが、

**CPU**

です。

CPUはVMやアプリケーションの処理を実行するためのリソースです。

たとえば、

```text
VM
 │
 ▼
vCPU
 │
 ▼
Physical CPU
```

という関係があります。

VMには、

**vCPU（Virtual CPU）**

が割り当てられます。

---

# CPU Usage

Performance Monitoringでは、

**CPU Usage**

を確認します。

たとえば、

```text
VM A → CPU 20%

VM B → CPU 35%

VM C → CPU 95%
```

となっていた場合、

VM CでCPU負荷が高くなっていることが分かります。

VM Cが、

**「動作が遅い」**

という問題を抱えているなら、CPUが原因の候補になります。

---

# CPUが高い＝必ず問題？

ただし、

**CPU Usageが高い = 必ず障害**

ではありません。

たとえば大量の処理を実行している最中なら、一時的にCPU Usageが高くなるのは正常かもしれません。

重要なのは、

```text
CPUが高い
   ↓
すぐ障害と判断
```

ではなく、

```text
CPUが高い
   ↓
いつから？
   ↓
どのVM？
   ↓
どの程度続いている？
   ↓
アプリケーションに影響している？
```

と確認することです。

---

# Memoryとは？

次に、

**Memory**

です。

VMを作成するときには、Memoryを割り当てます。

たとえば、

```text
VM A
CPU    2 vCPU
Memory 4 GB
```

という構成です。

VMで大量のMemoryを使用すると、アプリケーションのPerformanceへ影響する場合があります。

---

# Memory Usage

Performance Monitoringでは、

**Memory Usage**

も確認します。

たとえば、

```text
VM A → 40%

VM B → 60%

VM C → 95%
```

となっている場合、VM CのMemory使用状況を詳しく確認します。

ただしCPUと同様に、

**Memory Usageが高いだけで障害と断定しない**

ことが重要です。

---

# CPUとMemoryを一緒に見る

VMが遅い場合、

CPUだけを見るのではなくMemoryも確認します。

```text
VMが遅い
   │
   ├─ CPU高負荷？
   │
   ├─ Memory不足？
   │
   ├─ Storageが遅い？
   │
   └─ Networkが遅い？
```

Performance問題では、

**1つの指標だけで原因を判断しない**

ことが重要です。

---

# Storage Performance

Nutanixでは分散Storageを利用しているため、

**Storage Performance**

も非常に重要です。

Storageでは特に、

- IOPS
- Latency
- Throughput

を覚えておきましょう。

この3つはNutanixだけでなく、Storage全般で非常によく登場するPerformance指標です。

---

# IOPSとは？

**IOPS**は、

**Input/Output Operations Per Second**

の略です。

簡単にいうと、

> **1秒間に何回のI/O処理を行えるか**

を表します。

たとえば、

```text
1秒間

Read
Write
Read
Read
Write
...

↓
IOPS
```

というイメージです。

---

# IOPSのイメージ

たとえばStorageが1秒間に、

```text
1000回
```

のI/O処理を行った場合、

おおまかには、

```text
1000 IOPS
```

と考えられます。

IOPSは特に、

**細かいRead / Writeが大量に発生する処理**

を考えるときに重要です。

---

# Latencyとは？

**Latency**は、

> **I/O処理にどのくらい時間がかかったか**

を表す指標です。

一般的には、

**ms（ミリ秒）**

などで確認します。

```text
VM
 │
 │ I/O Request
 ▼
Storage
 │
 │ Response
 ▼
VM

↑
この応答にかかる時間
= Latency
```

Latencyが大きくなると、Storageへのアクセスに時間がかかっていることを意味します。

---

# Latencyはかなり重要

たとえば、

「VMが遅い」

という問題が発生しているとします。

CPUもMemoryも問題ありません。

しかし、

```text
Storage Latency
      ↑
      ↑
      ↑
```

となっていた場合、Storageの応答遅延が原因かもしれません。

つまり、

**VMが遅い = CPU不足**

とは限りません。

Storage Latencyも重要な確認ポイントです。

---

# Throughputとは？

**Throughput**は、

> **一定時間にどのくらいのデータを転送できたか**

を表します。

たとえば、

```text
MB/s
GB/s
```

などの単位で表されます。

イメージすると、

```text
Storage
======================>
大量のData

1秒間に何MB送れる？
        ↓
   Throughput
```

です。

---

# IOPSとThroughputの違い

IOPSとThroughputは混同しやすいので注意しましょう。

IOPSは、

**何回処理できるか**

です。

Throughputは、

**どれくらいのデータ量を処理できるか**

です。

```text
IOPS
↓
回数


Throughput
↓
データ量
```

たとえば、

**小さなファイルを大量に処理する**

場合と、

**巨大なファイルを連続して転送する**

場合では、重要になる指標が異なる可能性があります。

---

# IOPS・Latency・Throughputを整理

3つをまとめると、

| 指標 | 意味 | イメージ |
|---|---|---|
| IOPS | 1秒間のI/O処理回数 | 何回？ |
| Latency | I/Oの応答時間 | 何秒かかった？ |
| Throughput | 単位時間あたりのデータ量 | 何MB送れた？ |

Storage Performanceでは、この3つをセットで覚えておきましょう。

---

# ReadとWrite

Storage Performanceでは、

**Read**

と

**Write**

も重要です。

Readは、

```text
Storage
   ↓
Dataを読み出す
   ↓
VM
```

です。

Writeは、

```text
VM
   ↓
Dataを書き込む
   ↓
Storage
```

です。

Performanceを見るときには、

**Readが多いのか**

**Writeが多いのか**

によっても状況が変わります。

---

# I/O Size

さらにStorageでは、

**I/O Size**

という考え方もあります。

たとえば同じ100 IOPSでも、

```text
4 KB × 100
```

と、

```text
1 MB × 100
```

では、実際に処理するデータ量が大きく異なります。

そのため、

**IOPSだけを見ればStorage Performanceがすべて分かる**

わけではありません。

---

# IOPSとThroughputの関係

単純化すると、

```text
Throughput
≒
IOPS × I/O Size
```

という関係があります。

たとえば、

```text
1000 IOPS
×
4 KB

≈ 4 MB/s
```

のように考えることができます。

実際のPerformanceではさまざまな要素が関係しますが、

**IOPSとThroughputはまったく無関係な数字ではない**

ということを理解しておきましょう。

---

# HostのPerformance

VMだけでなく、

**Host**

のPerformanceも重要です。

Nutanix AHV環境では、各NodeでAHVが動作しています。

```text
Node
 │
 ├─ VM A
 ├─ VM B
 ├─ VM C
 └─ CVM
```

同じNode上で複数VMがリソースを利用します。

そのためHost側のCPUやMemoryに余裕がない場合、複数VMへ影響する可能性があります。

---

# VMだけ見ると原因を見逃すことがある

たとえば、

```text
Node 1

VM A
VM B
VM C
VM D
```

があるとします。

VM Aが遅いのでVM Aだけ調べても、原因が分からない場合があります。

実際には、

```text
Node 1
CPU Usage 98%
```

となっているかもしれません。

つまり、

```text
VM
↓
Host
↓
Cluster
```

というように、視点を広げて確認することも重要です。

---

# Cluster全体を見る

Cluster全体のPerformanceも確認します。

```text
Nutanix Cluster

Node 1 → CPU 30%
Node 2 → CPU 35%
Node 3 → CPU 95%
```

この場合、

**Node 3だけ負荷が高い**

ことが分かります。

逆に、

```text
Node 1 → 90%
Node 2 → 92%
Node 3 → 95%
```

なら、

**Cluster全体でCPUリソースが不足している可能性**

も考えられます。

---

# 時系列で見ることが重要

Performance Monitoringでは、

**現在の値だけを見るのではなく、時間による変化を見る**

ことも重要です。

たとえば、

```text
CPU Usage

09:00  20%
10:00  25%
11:00  30%
12:00  95%
13:00  98%
```

なら、

**12時頃から何かが変化した**

ことが分かります。

ここで前回学習したEventが役立ちます。

---

# EventとPerformanceを組み合わせる

たとえば、

```text
11:55
VM設定変更

12:00
CPU Usage急上昇

12:05
Warning Alert

12:10
ユーザーから「遅い」と連絡
```

という情報があったとします。

この場合、

**11:55の設定変更が関係しているのでは？**

と調査できます。

つまり、

```text
Performance
+
Event
+
Alert
```

を組み合わせることで、原因を絞り込みやすくなります。

---

# Baselineという考え方

Performance Monitoringでは、

**Baseline**

という考え方も重要です。

Baselineとは、

> **普段どのくらいのPerformanceなのかという基準**

です。

たとえば普段のCPU Usageが、

```text
20～40%
```

だったとします。

それが突然、

```text
95%
```

になれば、

**いつもと違う**

と判断できます。

逆に、普段から80%程度利用するシステムなら、80%という数字だけで異常とは判断できません。

---

# 「正常値」は環境によって違う

Performanceを見るとき、

**CPUが○%を超えたら絶対に異常**

という単純な考え方は危険です。

システムによって、

- 用途
- Workload
- VM数
- 利用時間帯
- Storage構成
- Network構成

などが異なるからです。

そのため、

```text
現在値
+
過去の傾向
+
システムの用途
```

を組み合わせて判断します。

---

# VMが遅いときは何を見る？

ここまでの内容を実際のトラブルシューティングにつなげてみましょう。

ユーザーから、

**「VMが遅いです」**

と連絡が来ました。

まず、

```text
VMが遅い
   │
   ├─ CPU
   ├─ Memory
   ├─ Storage
   │    ├─ IOPS
   │    ├─ Latency
   │    └─ Throughput
   │
   └─ Network
```

などを確認します。

---

# Step 1：影響範囲を確認

最初に、

**どこまで影響しているのか**

を確認します。

```text
1 VMだけ？
    ↓

同じHostのVMも？
    ↓

Cluster全体？
```

これによって調査範囲を絞れます。

---

# Step 2：AlertとHealthを確認

次に、

```text
Prism
 │
 ├─ Alert
 └─ Health
```

を確認します。

Hardware Failureなど明確な問題が発生していないか調べます。

---

# Step 3：CPU・Memoryを確認

次にCompute Resourceを確認します。

```text
CPU
↓
高負荷？


Memory
↓
不足していない？
```

VMだけでなくHost側も確認します。

---

# Step 4：Storageを確認

CPUとMemoryに問題がなければ、Storage Performanceを確認します。

```text
Storage

IOPS
Latency
Throughput
```

特に、

**Latencyが大きくなっていないか**

は重要な確認ポイントです。

---

# Step 5：Eventを確認

Performanceが悪化した時間帯に、

**何か変更がなかったか**

を確認します。

```text
Performance低下
      │
      ▼
同じ時間帯のEvent
      │
      ▼
設定変更？
VM操作？
Cluster操作？
```

原因調査では時系列を意識しましょう。

---

# Step 6：必要に応じてNCCなどで調査

Cluster自体に問題がありそうなら、

**NCC**

などを利用してHealth Checkを行います。

```text
Performance Problem
        ↓
Alert / Health
        ↓
Performance Metrics
        ↓
Event
        ↓
NCC / Log
```

これまでの記事がここでつながってきます。

---

# ボトルネックとは？

Performance Monitoringでは、

**Bottleneck（ボトルネック）**

という言葉もよく使います。

Bottleneckとは、

> **システム全体のPerformanceを制限している部分**

です。

たとえば、

```text
CPU      → 余裕あり
Memory   → 余裕あり
Network  → 余裕あり
Storage  → Latency高い
```

なら、

**StorageがBottleneckになっている可能性**

があります。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

お店では注文を受けて、はちみつを倉庫から取り出し、お客さんへ渡します。

```text
お客さん
   ↓
注文
   ↓
店員
   ↓
倉庫
   ↓
商品
```

このお店が、

**「最近なんか遅い！」**

と言われるようになりました。

---

# CPUは店員

CPUは、

**注文を処理する店員**

のようなものです。

```text
店員1人
↓
注文100件
```

となれば、処理が追いつかない可能性があります。

これがCPU高負荷のイメージです。

---

# Memoryは作業スペース

Memoryは、

**店員が商品を一時的に置いて作業するスペース**

のようなものです。

```text
広い作業台
↓
作業しやすい


狭い作業台
↓
作業しにくい
```

作業スペースが不足すると、効率が悪くなる可能性があります。

---

# IOPSは何回商品を取り出せる？

IOPSは、

**1秒間に倉庫から何回商品を取り出せるか**

と考えられます。

```text
1秒間

はちみつA
はちみつB
はちみつC
はちみつD

↓
何回処理できた？
```

これがIOPSです。

---

# Latencyは商品が届くまでの時間

Latencyは、

**注文してから商品が届くまでの時間**

です。

```text
注文
 ↓
10秒
 ↓
商品到着
```

この時間が長くなるほど、お客さんは、

**「遅い！」**

と感じます。

---

# Throughputは運べる商品の量

Throughputは、

**1秒間にどれくらいの商品を運べるか**

です。

```text
細い通路
↓
10箱 / 秒


広い通路
↓
100箱 / 秒
```

というイメージです。

---

# 3つをはちみつ屋さんで整理

| 指標 | はちみつ屋さん |
|---|---|
| IOPS | 何回商品を取り出せる？ |
| Latency | 商品が届くまで何秒？ |
| Throughput | どれくらいの量を運べる？ |

この3つを混同しないようにしましょう。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| Performance Monitoring | システム性能を監視する |
| CPU Usage | CPUの使用状況 |
| Memory Usage | Memoryの使用状況 |
| IOPS | 1秒間のI/O処理回数 |
| Latency | I/Oの応答時間 |
| Throughput | 単位時間あたりのデータ転送量 |
| Read | StorageからDataを読み出す |
| Write | StorageへDataを書き込む |
| I/O Size | 1回のI/Oで扱うData量 |
| Baseline | 通常時のPerformance基準 |
| Bottleneck | Performanceを制限している部分 |
| Prism | Performance情報の確認に利用 |

特にStorageでは、

```text
IOPS
↓
何回？


Latency
↓
どのくらい時間がかかった？


Throughput
↓
どのくらいのデータ量？
```

という違いを覚えておきましょう。

---

# これまでの監視・障害対応を整理

ここまでの記事をつなげると、

```text
                 Prism
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
     Health       Alert     Performance
       │           │           │
       ▼           ▼           ▼
      NCC        Event      Metrics
       │           │           │
       └───────────┼───────────┘
                   ▼
             原因を絞り込む
                   │
                   ▼
                 対応
```

となります。

つまり、

**Health = 正常か**

**Alert = 問題が発生していないか**

**Event = 何が起きたか**

**Performance = どこが遅いのか**

**NCC = Clusterに問題がないか**

という役割があります。

---

# まとめ

今回は、

**Performance Monitoring**

について学びました。

NutanixではPrismを利用して、VM・Host・Cluster・StorageなどのPerformanceを確認できます。

特に覚えておきたいのが、

- CPU
- Memory
- IOPS
- Latency
- Throughput

です。

そしてPerformance問題では、

**1つのMetricだけを見て原因を決めつけない**

ことが重要です。

たとえばVMが遅い場合でも、

```text
CPU？
Memory？
Storage？
Network？
Host？
```

と複数の可能性があります。

さらに、

- Health
- Alert
- Event
- NCC
- Performance

を組み合わせることで、問題の原因を絞り込んでいきます。

NCA対策では各Performance Metricの意味を覚えるだけでなく、

**「VMが遅いとき、どの情報を確認すればよいのか」**

という運用目線でも理解しておきましょう。

次回はNutanixのStorageをさらに一歩進めて、**Nutanix Volumes・Volume Group・iSCSI**について学んでいきます。