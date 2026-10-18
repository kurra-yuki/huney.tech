---
title: "Nutanix Supportとは？Log Collection・Support Case・障害対応の流れを理解しよう【NCA 7.5対策】"
slug: nutanix-support-troubleshooting
publishedAt: "2026-10-02"
category: Nutanix
type: article
draft: false
summary: "NCA 7.5対策として、Nutanix Supportの利用方法とSupport Case、Log Collection、NCC、Prismを利用した基本的なトラブルシューティングの流れを初心者向けに解説します。"
description: "NCA 7.5対策として、Nutanix Supportの利用方法とSupport Case、Log Collection、NCC、Prismを利用した基本的なトラブルシューティングの流れを初心者向けに解説します。"
---

# Nutanix Supportとは？Log Collection・Support Case・障害対応の流れを理解しよう【NCA 7.5対策】

## はじめに

これまでの記事では、

- Prism
- Health
- NCC
- Alert
- Event
- Performance

など、Nutanix環境を監視・管理するための機能を学習してきました。

では、実際に問題が発生して、

**「自分たちだけでは原因が分からない」**

となった場合はどうすればよいのでしょうか。

そのようなときに利用するのが、

**Nutanix Support**

です。

NutanixではSupport PortalやSupport Caseなどを利用して、問題の調査や解決を進めることができます。

今回は、

**問題発生 → 調査 → 情報収集 → Support Case**

という実際の障害対応の流れを意識しながら学習していきましょう。

---

# トラブルシューティングとは？

まず、

**Troubleshooting（トラブルシューティング）**

とは、

> システムで発生した問題の原因を調査し、解決していくこと

です。

たとえば、

```text
ユーザー
「VMにアクセスできません！」
        ↓
何が原因？
        ↓
VM？
Network？
Storage？
Host？
Cluster？
        ↓
原因を調査
        ↓
問題を解決
```

という一連の作業がTroubleshootingです。

---

# いきなりSupportへ問い合わせる？

問題が発生したからといって、

**すぐにSupportへ問い合わせればよい**

とは限りません。

まずは、

```text
問題発生
   ↓
状況確認
   ↓
Alert / Health確認
   ↓
Event確認
   ↓
Performance確認
   ↓
NCCなどで確認
   ↓
原因を切り分け
```

という基本的な調査を行います。

これまで学習してきた機能が、ここでつながってきます。

---

# まず影響範囲を確認する

障害対応で最初に重要なのが、

**Impact（影響範囲）**

です。

たとえば、

**「VMにアクセスできない」**

という問題でも、

```text
VM 1台だけ？
     ↓
同じHostのVMも？
     ↓
同じNetworkのVMも？
     ↓
Cluster全体？
```

によって原因の候補が変わります。

---

# 1台のVMだけの場合

たとえば、

```text
VM A → NG
VM B → OK
VM C → OK
VM D → OK
```

なら、VM A固有の問題である可能性があります。

確認する対象として、

- VMのPower State
- vNIC
- IP設定
- Guest OS
- Application

などが考えられます。

---

# 複数VMで問題が発生している場合

一方、

```text
VM A → NG
VM B → NG
VM C → NG

すべてNode 2上
```

なら、

**Node 2側に問題があるのでは？**

と考えられます。

このように、

**共通点を探す**

ことで原因を絞り込んでいきます。

---

# Prismで状況を確認する

NutanixのTroubleshootingでは、まずPrismが重要です。

```text
Administrator
      │
      ▼
    Prism
      │
 ┌────┼─────┬─────┐
 ▼    ▼     ▼     ▼
Health Alert Event Performance
```

Prismからさまざまな情報を確認できます。

これまで学習してきた、

**Health・Alert・Event・Performance**

を組み合わせて調査します。

---

# Healthを確認する

まず、

**Clusterが正常な状態なのか**

を確認します。

```text
Cluster
   │
   ▼
 Health
   │
 ┌─┼────────┐
 ▼ ▼        ▼
Node Storage Network
```

問題が発生しているComponentがないか確認します。

---

# Alertを確認する

次に、

**Alert**

を確認します。

たとえば、

```text
Critical Alert
      ↓
Node 2で問題
```

というAlertがあれば、Node 2を中心に調査できます。

また、

**Severity**

を確認することで、問題の重大度を判断する材料になります。

---

# Eventを確認する

Eventでは、

**問題が発生する前に何が起きたのか**

を確認します。

たとえば、

```text
09:50 Network設定変更

09:55 VM再起動

10:00 通信障害発生
```

というEventがあれば、

**09:50のNetwork設定変更**

が関係している可能性があります。

障害調査では、

**時系列**

が非常に重要です。

---

# Performanceを確認する

「システムが遅い」という問題では、

**Performance**

も確認します。

たとえば、

```text
CPU      → Normal
Memory   → Normal
IOPS     → Normal
Latency  → High
```

なら、

**Storage Latencyが原因では？**

と調査範囲を絞れます。

---

# NCCを利用する

Cluster自体の状態を詳しく確認したい場合には、

**NCC（Nutanix Cluster Check）**

を利用できます。

```text
Cluster
   ↓
 NCC
   ↓
Health Checks
   ↓
問題を確認
```

NCCを利用することで、Clusterの構成やHealthに問題がないか確認できます。

---

# それでも原因が分からない場合

ここまで確認しても、

**原因が特定できない**

場合があります。

そこで、

**Nutanix Support**

を利用します。

```text
問題発生
   ↓
Prism
   ↓
Health / Alert
   ↓
Event
   ↓
Performance
   ↓
NCC
   ↓
原因不明
   ↓
Nutanix Support
```

---

# Nutanix Support Portalとは？

Nutanixには、Supportを利用するためのPortalがあります。

Support Portalでは、Support Caseの管理やKnowledge Baseなど、問題解決に必要な情報へアクセスできます。

イメージすると、

```text
Nutanix Support Portal
        │
   ┌────┼──────────┐
   ▼    ▼          ▼
  Case  KB       Software
```

Nutanix環境の運用では重要なSupport Resourceです。

---

# Knowledge Baseとは？

**Knowledge Base（KB）**

は、

> 過去の問題や技術情報、対処方法などを確認するための情報

です。

たとえば、

```text
Error Message
      ↓
Knowledge Base検索
      ↓
関連するArticle
      ↓
原因・対処方法を確認
```

という使い方ができます。

---

# Error Messageは重要

Troubleshootingでは、

**Error Messageを正確に確認する**

ことが重要です。

たとえば、

```text
なんかStorageでエラー
```

ではなく、

```text
いつ
どのComponentで
どのErrorが
どの操作中に発生したか
```

を整理します。

Supportへ問い合わせる場合でも、この情報が重要になります。

---

# Support Caseとは？

自分たちで問題を解決できない場合、

**Support Case**

を作成してNutanix Supportへ問い合わせます。

イメージすると、

```text
Administrator
      │
      ▼
Support Portal
      │
      ▼
Create Case
      │
      ▼
Nutanix Support
```

Support Caseには、問題調査に必要な情報を提供します。

---

# Support Caseで必要になる情報

問い合わせるときには、できるだけ具体的な情報を整理します。

たとえば、

- どのClusterで発生したか
- どのComponentで発生したか
- いつ発生したか
- どのような問題なのか
- どの程度影響しているか
- 何をしたら発生したか
- すでに何を確認したか
- Error Message
- 関連するLog

などです。

Support担当者からすると、

**「VMが遅いです」**

だけでは原因を調査するのが難しくなります。

---

# 良い問い合わせとは？

たとえば、

```text
10月1日 10:00頃から
VM AのDisk Latencyが上昇。

同じCluster上のVM B・Cでは
同様の問題は確認されていない。

PrismでCritical Alertなし。

Eventでは9:50頃に
VM Aの設定変更あり。

NCCを実行し、
Cluster全体に重大な問題は確認できていない。
```

という情報があれば、

**どこまで調査済みなのか**

が分かります。

Support側も調査を開始しやすくなります。

---

# Severityとは？

Support Caseでも、

**Severity**

という考え方が重要です。

Severityは、

**問題がBusinessやSystemへどの程度影響しているのか**

を表します。

たとえば、

```text
System Down
    ↓
影響：非常に大きい


一部機能の問題
    ↓
影響：限定的
```

というように、問題の影響度によって対応の優先度が変わります。

---

# Alert SeverityとSupport Case Severity

ここは少し注意しましょう。

前回学習したAlertにもSeverityがありました。

しかし、

**AlertのSeverity**

と

**Support CaseのSeverity**

は同じ意味で使われるとは限りません。

```text
Alert Severity
↓
検出された問題の重大度


Support Case Severity
↓
問い合わせている問題の影響度・緊急度
```

というように、対象が異なります。

---

# Logとは？

Troubleshootingで非常に重要なのが、

**Log**

です。

Logは、

> SystemやApplicationで発生した処理や状態などを記録した情報

です。

イメージすると、

```text
10:00 Service Start

10:05 Connection Error

10:06 Retry

10:07 Connection Error
```

のように、System内部で何が起きていたのかを調査する手掛かりになります。

---

# EventとLogは同じ？

EventとLogは似ていますが、完全に同じものとして考えないようにしましょう。

EventはPrismなどから、

**「環境内で何が起きたか」**

を確認するのに役立ちます。

Logは、

**より詳細なSystem内部の情報**

を調査するために利用します。

イメージすると、

```text
Event
↓
何が起きた？


Log
↓
内部で具体的に何が起きていた？
```

です。

---

# Log Collectionとは？

Supportへ問い合わせる場合、

**Log Collection**

が必要になることがあります。

Log Collectionとは、

> 問題調査に必要なLogを収集すること

です。

```text
Nutanix Cluster
      │
      ├─ CVM Log
      ├─ System Log
      ├─ Service Log
      └─ その他の診断情報
             │
             ▼
       Log Collection
```

収集した情報をSupportへ提供することで、より詳細な調査が可能になります。

---

# なぜLogが必要なの？

画面上では、

```text
Service Error
```

としか表示されていなくても、Logには、

```text
どのServiceで
何時何分に
どの処理を行い
どのErrorが発生したか
```

といった、より詳細な情報が記録されている場合があります。

そのため、

**原因が分からない問題ほどLogが重要**

になります。

---

# Logを勝手に削除・変更しない

障害調査中は、

**証拠となる情報を残す**

ことも重要です。

たとえば問題発生後に、

- Logを削除する
- 不要な設定変更を大量に行う
- 原因が分からないままServiceを変更する

と、原因調査が難しくなる可能性があります。

まず状況を記録し、必要な情報を確保してから対応することが重要です。

---

# 問題発生時刻を記録する

Log Collectionで特に重要なのが、

**問題が発生した時刻**

です。

大量のLogの中から問題を探す場合、

```text
「昨日くらい」
```

より、

```text
10月1日
10:05～10:10頃
```

と分かっていた方が調査しやすくなります。

そのため障害対応では、

**When（いつ）**

を必ず意識しましょう。

---

# 5W1Hで整理する

問題を整理するときは、

**5W1H**

を意識すると分かりやすくなります。

| 項目 | 確認すること |
|---|---|
| When | いつ発生した？ |
| Where | どこで発生した？ |
| Who | 誰・どの利用者に影響？ |
| What | 何が起きた？ |
| Why | 原因は分かっている？ |
| How | どの操作・状況で発生した？ |

Support Caseを作成するときにも役立つ考え方です。

---

# 再現性を確認する

問題が、

**再現するのか**

も重要です。

たとえば、

```text
特定操作
   ↓
毎回Error
```

なら再現性があります。

一方、

```text
昨日1回だけError
↓
現在は正常
```

という問題もあります。

再現性がある場合、原因を調査しやすくなることがあります。

---

# 問題発生前に何が変わった？

障害調査で非常に重要なのが、

**Change（変更）**

です。

たとえば、

```text
正常
 ↓
Network設定変更
 ↓
VM再起動
 ↓
通信障害
```

なら、

**Network設定変更**

が原因候補になります。

そのため、

> 問題発生直前に何か変更したか？

を確認することが重要です。

ここでもEventが役立ちます。

---

# Foundation・LCMとの関係

これまでの記事で、

**LCM**

についても学習しました。

たとえば、

```text
正常
 ↓
LCMでUpdate
 ↓
問題発生
```

という場合、

**Update前後で何が変わったのか**

を確認する必要があります。

Version情報もSupport Caseでは重要な情報になります。

---

# Version情報を確認する

Supportへ問い合わせる場合、

- AOS Version
- AHV Version
- NCC Version
- Firmware Version

など、問題に関係するVersion情報が重要になることがあります。

```text
Problem
   │
   ▼
どのVersion？
   │
   ▼
既知の問題？
```

特定Versionに関連する既知の問題である可能性もあるためです。

---

# Supportへ送る前に情報を整理

問い合わせ前には、

```text
Problem Summary
       ↓
Impact
       ↓
Occurrence Time
       ↓
Affected Component
       ↓
Version
       ↓
Alert / Event
       ↓
NCC Result
       ↓
Log
```

のように情報を整理すると分かりやすくなります。

---

# トラブルシューティング全体の流れ

ここまでをまとめます。

```text
① 問題発生
      ↓
② 影響範囲を確認
      ↓
③ PrismでHealth確認
      ↓
④ Alert確認
      ↓
⑤ Event確認
      ↓
⑥ Performance確認
      ↓
⑦ NCCなどでHealth Check
      ↓
⑧ Knowledge Baseを確認
      ↓
⑨ Logなどの情報を収集
      ↓
⑩ 必要ならSupport Case作成
      ↓
⑪ 原因調査・対応
      ↓
⑫ Healthを再確認
```

この流れはNCAだけでなく、実際のインフラ運用でも重要です。

---

# 問題解決後も終わりではない

問題が解決したら、

**「直った！終わり！」**

ではありません。

確認するべきことがあります。

```text
問題解決
   ↓
Health正常？
   ↓
Alert解消？
   ↓
VM正常？
   ↓
Performance正常？
```

問題が本当に解消されていることを確認します。

---

# Root Causeとは？

障害対応では、

**Root Cause（根本原因）**

という言葉もよく使われます。

Root Causeとは、

> 問題を発生させた根本的な原因

です。

たとえば、

```text
VMに接続できない
      ↓
Network通信不可
      ↓
VLAN設定間違い
```

なら、

**VLAN設定間違い**

がRoot Causeかもしれません。

---

# 症状と原因を区別する

ここは非常に重要です。

```text
VMに接続できない
```

は、

**症状**

です。

原因は、

```text
vNIC設定
VLAN設定
Physical Network
Guest OS Firewall
Application
```

など、別の場所にある可能性があります。

つまり、

**症状 = 原因**

とは限りません。

---

# はちみつ屋さんで例えると？

今回も、はちみつ屋さんで考えてみましょう。

ある日、

**「名古屋店で商品が販売できない！」**

という問題が発生しました。

まず確認します。

```text
名古屋店だけ？
↓
全店舗？
↓
特定の商品だけ？
↓
レジ？
↓
在庫？
↓
Network？
```

これが、

**影響範囲の切り分け**

です。

---

# Alertは警報

レジに、

**「Network Error」**

と表示されました。

これはAlertのようなものです。

```text
Network Error
      ↓
問題があることを通知
```

しかし、

**Network Error = 原因**

とは限りません。

---

# Eventは店舗の日誌

店舗の日誌を見ると、

```text
09:00 開店

09:30 Router設定変更

09:35 Network Error

09:40 レジ利用不可
```

と記録されていました。

すると、

**09:30のRouter設定変更が怪しい**

と考えられます。

これがEventを利用した調査です。

---

# Logは機械の詳細記録

さらにレジ内部の記録を見ると、

```text
09:35:01
Gateway Unreachable

09:35:03
Retry

09:35:05
Gateway Unreachable
```

と記録されていました。

これが、

**Log**

のイメージです。

Eventよりも詳細な情報を確認できます。

---

# Support Caseはメーカーへの問い合わせ

それでも原因が分からなければ、

**レジメーカーへ問い合わせる**

ことになります。

そのとき、

```text
「レジ壊れました」
```

だけでは情報が足りません。

代わりに、

```text
名古屋店で発生

09:35から利用不可

Network Error表示

09:30にRouter設定変更あり

他店舗は正常

再起動でも改善なし

Logを取得済み
```

と伝えれば、メーカー側も調査しやすくなります。

これがNutanixの、

**Support Case**

と同じ考え方です。

---

# NCA対策として覚えておきたいポイント

今回の重要ポイントを整理します。

| 用語 | ポイント |
|---|---|
| Troubleshooting | 問題の原因を調査・解決する |
| Nutanix Support | Nutanix製品の問題解決を支援 |
| Support Portal | Support情報へアクセスするPortal |
| Support Case | Nutanix Supportへの問い合わせ |
| Knowledge Base | 技術情報・既知問題などを確認 |
| Log | System内部の詳細な記録 |
| Log Collection | 調査に必要なLogを収集 |
| Severity | 問題の影響度・重大度 |
| Impact | 問題の影響範囲 |
| Root Cause | 問題の根本原因 |
| NCC | ClusterのHealth Check |
| Event | 何が起きたかを確認 |
| Alert | 問題・注意すべき状態を通知 |
| Performance | CPU・Memory・Storage性能などを確認 |

---

# NCAで特に意識したい考え方

単純な用語暗記だけでなく、

**「問題が発生したら次に何を確認する？」**

という流れを理解しておきましょう。

たとえば、

```text
VMが遅い
   ↓
Performance確認


問題発生前の操作を知りたい
   ↓
Event確認


ClusterのHealthを詳しく確認したい
   ↓
NCC


自分たちで解決できない
   ↓
Support Case
```

というように、

**目的 → 利用する機能**

を結び付けて覚えると整理しやすくなります。

---

# これまでの運用機能を整理

ここまで登場した機能をまとめると、

```text
                    Prism
                      │
       ┌──────────────┼───────────────┐
       ▼              ▼               ▼
     Health          Alert        Performance
       │              │               │
       ▼              ▼               ▼
      NCC           Event           Metrics
       │              │               │
       └──────────────┼───────────────┘
                      ▼
               Troubleshooting
                      │
              ┌───────┴───────┐
              ▼               ▼
       Knowledge Base       Logs
              │               │
              └───────┬───────┘
                      ▼
                Support Case
```

この全体像を理解できれば、Nutanixの基本的な運用・障害対応がかなり見えてきます。

---

# まとめ

今回は、

**Nutanix SupportとTroubleshooting**

について学びました。

問題が発生した場合、いきなりSupportへ問い合わせるのではなく、

- 影響範囲
- Health
- Alert
- Event
- Performance
- NCC

などを利用して状況を確認します。

そして、自分たちだけでは問題を解決できない場合には、

**Nutanix Support**

を利用します。

Support Caseを作成するときには、

- いつ発生したか
- どこで発生したか
- どのような症状か
- どの程度影響しているか
- 直前に何を変更したか
- 何を調査したか
- どのVersionなのか
- どのようなLogがあるか

といった情報を整理することが重要です。

また、

**症状とRoot Causeは同じとは限らない**

という考え方も重要です。

NCA対策では、

```text
Prism
↓
Health / Alert / Event / Performance
↓
NCC
↓
Knowledge Base / Log
↓
Support
```

というTroubleshootingの流れをイメージできるようにしておきましょう。

次回はいよいよNCA編の最終回です。

これまで学習してきたAOS・AHV・Prism・CVM・DSF・LCM・NCC・Volumesなどをつなげながら、**Nutanixの主要コンポーネントと管理機能を総復習**していきます。