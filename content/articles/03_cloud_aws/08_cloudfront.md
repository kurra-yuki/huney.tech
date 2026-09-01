---
title: Amazon CloudFrontとは？CDNの仕組みを初心者向けに解説
slug: cloudfront
description: Amazon CloudFrontについてIT初心者向けに基礎からやさしく解説します。
category: クラウド / AWS
draft: false
publishedAt: '2026-09-01'
---

# Amazon CloudFrontとは？CDNの仕組みを初心者向けに解説

Amazon CloudFrontはAWSが提供する**コンテンツ配信ネットワーク（CDN）サービス**です。

Webサイトの画像、動画、HTML、APIのレスポンスなどを、利用者に近い拠点から配信することで、低遅延なコンテンツ配信を支援します。

## CDNとは？

CDNは **Content Delivery Network** の略です。

元のサーバーだけからすべての利用者へデータを送るのではなく、各地の配信拠点を利用します。

```text
              ┌─ 利用者A
Origin → CloudFront
              ├─ 利用者B
              └─ 利用者C
```

## オリジンとは？

CloudFrontがコンテンツを取得する元の場所を**オリジン**と呼びます。

代表的なオリジンとして、

- Amazon S3
- Application Load Balancer
- EC2などのHTTPサーバー
- API Gateway

などを利用できます。

## エッジロケーション

CloudFrontは世界各地の**エッジロケーション**を利用してコンテンツを配信します。

利用者に近い場所からキャッシュ済みコンテンツを返すことで、オリジンまで毎回アクセスする必要を減らせます。

## キャッシュ

CloudFrontではオリジンから取得したコンテンツを一定期間キャッシュできます。

```text
1回目
利用者 → CloudFront → Origin

次回
利用者 → CloudFront
          └─ キャッシュから返却
```

ただし、何をどれくらいキャッシュするかは設定やレスポンスヘッダーなどによって決まります。

## S3との組み合わせ

S3とCloudFrontはよく組み合わせて利用されます。

```text
利用者
   |
CloudFront
   |
Amazon S3
```

S3をオリジンとして、画像やWebコンテンツなどをCloudFrontから配信できます。

S3バケットを直接一般公開せず、CloudFront経由のアクセスに制限する構成も可能です。

## CloudFrontはWebサーバー？

CloudFrontはApache HTTP Serverのような一般的なWebサーバーそのものではありません。

オリジンからコンテンツを取得し、エッジネットワークを使って利用者へ配信するCDNです。

## HTTPS

CloudFrontではHTTPSを利用したコンテンツ配信ができます。

独自ドメインを利用する場合にはAWS Certificate Manager（ACM）の証明書などと組み合わせる構成があります。

## 🍯 はちみつメモ

> **Amazon CloudFront = 世界各地のエッジ拠点を利用してコンテンツを効率よく配信するAWSのCDN**

## まとめ

- CloudFrontはAWSのCDNサービス
- CDNはContent Delivery Networkの略
- コンテンツの取得元をオリジンと呼ぶ
- エッジロケーションを利用してコンテンツを配信する
- キャッシュによりオリジンへのアクセスを減らせる
- S3などをオリジンとして利用できる
- HTTPSや独自ドメインにも対応できる

## 次におすすめ

これでクラウド / AWS基礎編は一区切りです。

次は各AWSサービスをさらに深掘りしたり、実際にAWS上で小さなシステムを構築したりして理解を深めていきましょう。
