---
title: "NutanixのAlert・Eventとは？監視と障害対応の基本を理解しよう【NCA 7.5対策】"
slug: nutanix-alert-event
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix Prismで確認できるAlertとEventの違い、Severity、Acknowledgement、Resolve、障害調査での活用方法を初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix Prismで確認できるAlertとEventの違い、Severity、Acknowledgement、Resolve、障害調査での活用方法を初心者向けに解説します。"
---

# NutanixのAlert・Eventとは？監視と障害対応の基本を理解しよう【NCA 7.5対策】

## はじめに

前回は、

**NCC（Nutanix Cluster Check）**

とHealth Checkについて学びました。

Nutanix Clusterを安定して運用するためには、

- Node
- VM
- Storage
- Network
- Service

などが正常に動作しているか確認する必要があります。

しかし、管理者が24時間ずっとPrismを見続けるわけにはいきません。

そこで重要になるのが、

**Alert（アラート）**

と

**Event（イベント）**

です。

今回は、Nutanix環境で発生した問題や出来事をどのように確認するのか学んでいきましょう。

---

# Alertとは？

**Alert**は、Nutanix環境で問題や注意すべき状態が検出された場合に、管理者へ知らせるための仕組みです。

たとえば、

```text
Diskに問題が発生
       ↓
Nutanixが問題を検出
       ↓
     Alert
       ↓
管理者が確認
```

という流れです。

つまり、

> **Alert = 管理者が確認・対応すべき可能性がある状態を知らせるもの**

と考えると分かりやすいでしょう。

---

# どんなときにAlertが発生する？

Nutanix Clusterではさまざまな問題が考えられます。

たとえば、

- Nodeの問題
- Diskの問題
- Storage容量の問題
- Networkの問題
- Serviceの問題
- VMの問題
- Clusterの問題

などです。

```text
Nutanix Cluster
      │
 ┌────┼─────┬─────┐
 ▼    ▼     ▼     ▼
Node Disk Network Storage
 │    │     │      │
 └────┴──┬──┴──────┘
         ▼
       Alert
```

管理者はAlertを確認することで、Cluster内で問題が発生していることに気付けます。

---

# Eventとは？

次に、

**Event**

です。

Eventは、Nutanix環境内で発生した出来事を記録したものです。

たとえば、

- VMを作成した
- VMを削除した
- VMを起動した
- VMを停止した
- 設定を変更した
- Cluster上で何らかの操作が行われた

といった出来事です。

```text
Administrator
      │
      ▼
VMを作成
      │
      ▼
Eventとして記録
```

つまり、

> **Event = Nutanix環境で何が起きたのかを確認するための記録**

です。

---

# AlertとEventの違い

ここはNCA対策としてしっかり整理しておきましょう。

Alertは、

**問題や注意すべき状態を管理者へ知らせるもの**

です。

Eventは、

**環境内で発生した出来事を記録するもの**

です。

| 項目 | Alert | Event |
|---|---|---|
| 主な目的 | 問題・注意を知らせる | 出来事を記録する |
| 管理者の対応 | 必要になる場合がある | 必ずしも必要ではない |
| 例 | Disk障害 | VM作成 |
| 用途 | 監視・障害対応 | 操作履歴・原因調査 |

簡単に覚えるなら、

```text
Alert
↓
何か問題があるかも！


Event
↓
こんなことが起きました
```

です。

---

# すべてのEventがAlertになるわけではない

ここも重要です。

たとえば、管理者がVMを正常に起動したとします。

```text
VM Start
   ↓
Event
```

これは環境内で発生した出来事なので、Eventとして記録されます。

しかし正常な操作なので、

**必ずしもAlertが必要なわけではありません。**

つまり、

```text
Event
≠
必ずAlert
```

です。

Eventは正常な操作も含めた「出来事」の記録です。

一方Alertは、問題や注意が必要な状態を管理者へ知らせるために利用されます。

---

# PrismからAlertを確認する

AlertはPrismから確認できます。

イメージすると、

```text
Administrator
      │
      ▼
    Prism
      │
      ▼
    Alerts
      │
 ┌────┼────┐
 ▼    ▼    ▼
Alert Alert Alert
```

Alertの一覧から、

- 何が発生したのか
- どの対象で発生したのか
- どの程度重要なのか
- いつ発生したのか

などを確認して、必要な対応を判断します。

---

# Severityとは？

Alertを確認するときに重要なのが、

**Severity（重大度）**

です。

すべてのAlertが同じ重要度ではありません。

軽微な問題もあれば、サービスへ大きな影響を与える可能性がある問題もあります。

そのため、Severityを利用して問題の重要度を判断します。

代表的には、

- Info
- Warning
- Critical

などのレベルがあります。

```text
低い                   高い

Info → Warning → Critical
```

Alertを大量に確認するときには、

**どのAlertから優先して確認するべきか**

を判断する材料になります。

---

# Critical

**Critical**は、重大な問題が発生していることを示します。

たとえば、Clusterやサービスへ大きな影響を与える可能性がある状態です。

```text
Critical Alert
      ↓
影響範囲を確認
      ↓
原因を調査
      ↓
必要な対応
```

Criticalだからといって慌てて設定を変更するのではなく、まず内容と影響範囲を確認することが重要です。

---

# Warning

**Warning**は、注意が必要な状態を表します。

現時点でサービスが完全に停止していなくても、

**今後問題につながる可能性がある状態**

などで確認することがあります。

たとえば、

```text
Storage使用率上昇
      ↓
   Warning
      ↓
このまま増えると容量不足？
```

というように、問題が深刻化する前に確認するために役立ちます。

---

# Info

**Info**は、情報として確認するレベルです。

必ずしも障害を意味するものではありません。

したがって、

```text
Alertがある
↓
すべて重大障害！
```

と考えるのではなく、

**SeverityとAlertの内容を確認する**

ことが重要です。

---

# Acknowledgeとは？

Alert管理では、

**Acknowledge**

という操作も重要です。

Acknowledgeは、

> **管理者がそのAlertを確認したことを示す**

ための操作です。

たとえば、

```text
Alert発生
   ↓
管理者Aが確認
   ↓
Acknowledge
```

とします。

これによって、

**「このAlertは誰も見ていない状態ではない」**

ことを管理しやすくなります。

---

# Acknowledgeしたら問題は解決する？

ここは注意しましょう。

**Acknowledge = 問題解決**

ではありません。

Acknowledgeは、

**Alertを確認した**

という意味です。

```text
Alert
  ↓
Acknowledge
  ↓
確認済み

でも

原因が残っている可能性あり
```

たとえばDiskに障害が発生しているAlertをAcknowledgeしても、Disk自体が直るわけではありません。

---

# Resolveとは？

問題への対応が完了した場合には、

**Resolve**

という考え方も登場します。

Resolveは、

> 問題が解決したAlertを解決済みとして扱う

ためのものです。

整理すると、

```text
Alert発生
    ↓
Acknowledge
    ↓
原因調査
    ↓
問題対応
    ↓
Resolve
```

という流れをイメージできます。

---

# Alert対応の基本的な流れ

実際にAlertが発生した場合は、次のように考えます。

```text
① Alert発生
      ↓
② Severity確認
      ↓
③ 対象を確認
      ↓
④ 詳細を確認
      ↓
⑤ Acknowledge
      ↓
⑥ Event / Health / NCCなどを確認
      ↓
⑦ 原因を特定
      ↓
⑧ 問題へ対応
      ↓
⑨ Healthを再確認
```

Alertだけを見て原因を決めつけるのではなく、複数の情報を組み合わせて調査することが重要です。

---

# Eventはトラブルシューティングでも役立つ

Eventは単なる操作履歴ではありません。

障害調査でも非常に役立ちます。

たとえば、

**「昨日までは正常だったVMが今日から通信できない」**

という問題が発生したとします。

Eventを確認すると、

```text
10:00
VM Network設定変更

10:05
VM再起動

10:10
通信障害発生
```

という記録が見つかるかもしれません。

すると、

**「10時に行われたNetwork設定変更が関係しているのでは？」**

と調査範囲を絞れます。

---

# 時系列で考える

障害調査では、

**いつ何が起きたのか**

を整理することが非常に重要です。

そこでEventが役立ちます。

```text
09:00 Normal

09:30 Configuration Change

09:35 Warning

09:40 Critical Alert

09:45 Service Down
```

このように時系列で並べることで、

**障害発生前に何が変化したのか**

を調査できます。

---

# Alert・Event・Healthの関係

前回学習したHealthと組み合わせて整理してみましょう。

**Health**

は、

> 現在どのような状態なのか

を確認します。

**Alert**

は、

> 問題や注意すべき状態が検出された

ことを知らせます。

**Event**

は、

> 何が起きたのか

を記録します。

```text
Health
↓
今どうなっている？


Alert
↓
何か問題がある！


Event
↓
何が起きた？
```

この3つを組み合わせることで、Clusterの状態を把握しやすくなります。

---

# NCCとの関係

前回学習したNCCも組み合わせられます。

たとえば、

```text
Alert
↓
Nodeに問題あり
↓
PrismでHealth確認
↓
NCC実行
↓
詳細なHealth Check
↓
Event確認
↓
障害前の操作を確認
```

という流れです。

つまり、

- Alert
- Event
- Health
- NCC

は、それぞれ別々に覚えるのではなく、

**トラブルシューティングの一連の流れ**

として理解すると分かりやすくなります。

---

# Performanceとの関係

Alertの原因が必ずしもHardware Failureとは限りません。

たとえば、

「VMが遅い」

という問題があったとします。

この場合、

- CPU
- Memory
- IOPS
- Latency
- Throughput

などのPerformance情報を確認する必要があります。

```text
VMが遅い
   ↓
Alert確認
   ↓
Health確認
   ↓
Performance確認
   ↓
CPU？
Memory？
Storage？
Network？
```

このPerformance Monitoringについては次の記事で詳しく学習します。

---

# Emailなどによる通知

運用環境では、管理者が常にPrismの画面を開いているとは限りません。

そのため、Alertが発生したときに管理者へ通知できるよう、通知設定を利用します。

イメージすると、

```text
Nutanix Cluster
      │
問題を検出
      ↓
    Alert
      │
      ├─ Prismで確認
      │
      └─ Notification
             ↓
         Administrator
```

Alertを「Prismを開いたときに見るだけ」にするのではなく、適切な通知設計を行うことが運用では重要です。

---

# Alertを放置するとどうなる？

Warningだからといって、すべて放置してよいわけではありません。

たとえばStorage Capacityに関するWarningを放置すると、

```text
Storage Usage
70%
 ↓
80%
 ↓
90%
 ↓
95%
 ↓
Capacity不足
```

というように、後から重大な問題へ発展する可能性があります。

そのため、

**Criticalだけを見る**

のではなく、Warningも内容を確認し、必要に応じて早めに対応することが重要です。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

店舗に監視システムがあるとします。

冷蔵庫の温度が高くなりました。

```text
冷蔵庫
  ↓
温度上昇
  ↓
Warning Alert
```

さらに温度が上昇し、商品が傷む危険が高くなると、

```text
Critical Alert
```

になるかもしれません。

これが**Alert**です。

---

# Eventはお店の日誌

一方、Eventは、

**お店の日誌**

のようなものです。

```text
09:00 開店

10:00 冷蔵庫設定変更

10:15 温度上昇

10:20 Warning

10:30 Critical
```

と記録されていたとします。

この記録を見ることで、

**「10時の設定変更が原因かもしれない」**

と考えられます。

つまり、

**Alert = 異常を知らせる警報**

**Event = 何が起きたか記録する日誌**

と考えると分かりやすいでしょう。

---

# Acknowledgeをはちみつ屋さんで考える

冷蔵庫の警報が鳴りました。

店員Aさんが確認して、

**「この警報は私が確認しました」**

と記録します。

これが、

**Acknowledge**

です。

しかし、

```text
警報確認
↓
Acknowledge

≠

冷蔵庫修理完了
```

です。

警報を確認しただけなので、冷蔵庫の問題そのものは別途対応する必要があります。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| Alert | 問題や注意すべき状態を通知 |
| Event | 環境内で発生した出来事を記録 |
| Severity | Alertの重大度 |
| Critical | 重大な問題 |
| Warning | 注意が必要 |
| Info | 情報として確認 |
| Acknowledge | Alertを確認したことを示す |
| Resolve | 問題が解決したAlertを解決済みとして扱う |
| Health | 現在のシステム状態 |
| NCC | ClusterのHealth Check |
| Prism | Alert・Eventなどを確認する管理画面 |

特に、

```text
Health
↓
今どうなっている？


Alert
↓
問題はある？


Event
↓
何が起きた？
```

という違いを理解しておきましょう。

---

# 障害対応の流れを整理

これまで学習した内容を組み合わせると、Nutanixでの基本的な障害調査は、

```text
問題発生
   ↓
Alert
   ↓
Severity確認
   ↓
Health確認
   ↓
Event確認
   ↓
NCC
   ↓
Performance / Log
   ↓
原因特定
   ↓
対応
   ↓
再度Health確認
```

という流れで考えられます。

もちろん実際の対応手順は障害内容によって異なりますが、

**「1つの情報だけで判断しない」**

という考え方が非常に重要です。

---

# まとめ

今回は、

**Alert**

と

**Event**

について学びました。

Alertは、

**問題や注意すべき状態を管理者へ知らせるもの**

です。

一方Eventは、

**Nutanix環境内で発生した出来事を記録するもの**

です。

またAlertにはSeverityがあり、問題の重大度を判断する材料になります。

そして、

**Acknowledge = 確認した**

であって、

**Acknowledge = 問題が解決した**

ではないことも重要です。

Nutanixのトラブルシューティングでは、

- Alert
- Event
- Health
- NCC
- Performance
- Log

などを組み合わせて原因を調査します。

NCA対策ではAlertとEventを単なる用語として暗記するのではなく、

**「異常を検知したあと、管理者がどう調査していくのか」**

という運用の流れとして理解しておきましょう。

次回は、CPU・Memory・IOPS・Latencyなどを利用してNutanix環境の状態を確認する**Performance Monitoring**について学んでいきます。