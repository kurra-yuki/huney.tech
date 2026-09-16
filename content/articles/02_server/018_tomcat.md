---
title: Tomcatとは？Apacheとの違いを初心者向けに解説
slug: tomcat
description: >-
  Apache Tomcatとは何かを初心者向けに解説します。Servlet、JSP、Webコンテナ、Apache HTTP
  Serverとの違いや連携構成を学びます。
category: サーバー
draft: false
publishedAt: '2026-09-01'
---

# Tomcatとは？Apacheとの違いを初心者向けに解説

Apacheを学んだあとによく登場するのが**Tomcat（トムキャット）**です。

どちらにも「Apache」という名前が付くため、最初は同じものだと思いやすいですが、役割は異なります。

## Tomcatとは？

**Apache Tomcat**は、JavaのWebアプリケーションを実行するために利用されるオープンソースのソフトウェアです。

Apache Software Foundationによって開発されています。

Tomcatは、Java ServletやJakarta Server Pages（JSP）などの仕様を実装する**Servletコンテナ / Webコンテナ**として利用されます。

## Servletとは？

Servletは、JavaでWebリクエストを処理し、レスポンスを生成するための仕組みです。

概念的には、

```text
ブラウザ
   |
   | HTTPリクエスト
   v
 Tomcat
   |
   v
Servlet
   |
   | 処理
   v
レスポンス
```

という流れになります。

TomcatがWebリクエストを受け取り、JavaのWebアプリケーションを動作させます。

## 静的ページと動的ページ

単純なHTMLファイルは、基本的にファイルの内容をそのままクライアントへ返せます。

一方、ログインしている利用者によって表示内容を変えるなど、サーバー側で処理して結果を生成するWebアプリケーションもあります。

TomcatはJavaを使ったこうしたWebアプリケーションの実行環境として利用されます。

## Apache HTTP Serverとの違い

初心者が一番混乱しやすいところです。

| 項目 | Apache HTTP Server | Apache Tomcat |
|---|---|---|
| 主な役割 | Webサーバー | Java Webアプリケーションの実行 |
| HTTP通信 | 対応 | 対応 |
| 静的コンテンツ配信 | 得意 | 可能 |
| Java Servlet | 実行環境ではない | 実行できる |
| JSP | 実行環境ではない | 実行できる |

つまり、

```text
Apache HTTP Server
→ Webサーバー

Tomcat
→ Java Webアプリケーションを動かすWebコンテナ
```

という違いがあります。

## TomcatもHTTP通信できる？

はい。

TomcatにはHTTPリクエストを受け付ける機能があります。

そのため、小規模な構成や用途によってはTomcat単体でWebアプリケーションを提供することもできます。

「Tomcatを使うなら必ずApache HTTP Serverが必要」というわけではありません。

## Apache HTTP Serverと連携する理由

システムによってはApache HTTP Serverを前段に配置し、Tomcatと連携させます。

```text
インターネット
      |
      v
Apache HTTP Server
      |
      | リバースプロキシなど
      v
    Tomcat
      |
      v
Java Webアプリケーション
```

この構成では、

- Apache HTTP Serverが外部からのHTTP/HTTPS通信を受ける
- 必要なリクエストをTomcatへ転送する
- TomcatがJava Webアプリケーションを実行する

といった役割分担ができます。

実際に採用する構成はシステム要件によって異なります。

## Tomcatはアプリケーションサーバー？

Tomcatは「アプリケーションサーバー」と呼ばれることもありますが、より正確にはServletやJSPなどのWeb関連仕様を実装する**Servletコンテナ / Webコンテナ**として説明されることが多いです。

Jakarta EEのすべての機能を提供するフル機能のアプリケーションサーバーとは位置付けが異なります。

初心者の段階では、

**Tomcat = JavaのWebアプリケーションを動かすためのサーバーソフトウェア**

と理解したうえで、徐々にServletコンテナという言葉に慣れていけば大丈夫です。

## Linux・Apache・Tomcatの関係

ここまでのサーバー編をつなげてみましょう。

```text
サーバー
  |
  +-- OS
  |    |
  |   Linux
  |
  +-- Webサーバー
  |    |
  |   Apache HTTP Server
  |
  +-- Java Webコンテナ
       |
      Apache Tomcat
```

実際の構成では、

```text
Linux
  |
  +-- Apache HTTP Server
  |
  +-- Apache Tomcat
```

のように同じサーバー上で動作させる場合もあれば、別々のサーバーへ分離する場合もあります。

## Webシステム全体で見ると

Webシステムは複数の役割を組み合わせて作られます。

一例として、

```text
ブラウザ
   |
   v
Webサーバー
Apache HTTP Server
   |
   v
Webコンテナ
Apache Tomcat
   |
   v
Javaアプリケーション
   |
   v
データベース
```

のような構成があります。

これを見ると、「サーバー」という言葉が1種類の機械だけを意味するわけではないことも分かります。

## 🍯 はちみつメモ

> **今日覚えることは1つだけ！**
>
> **Tomcat = JavaのWebアプリケーションを動かすためのServletコンテナ / Webコンテナ**

## まとめ

- Apache TomcatはJava Webアプリケーションの実行に利用される
- ServletやJSPなどの仕様を実装する
- Apache HTTP Serverとは別のソフトウェア
- Tomcat自身もHTTPリクエストを受け付けられる
- Apache HTTP ServerとTomcatを連携させる構成もある
- Tomcatはフル機能のJakarta EEアプリケーションサーバーとは位置付けが異なる
- Linux、Apache HTTP Server、Tomcatはそれぞれ役割が違う

## 次におすすめ

サーバー編はここで一区切りです。

次は**「クラウドとは？」**からクラウド / AWS編を始めます。
