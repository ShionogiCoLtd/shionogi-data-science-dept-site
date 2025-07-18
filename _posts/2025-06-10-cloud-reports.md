--- 
layout: post
title: 解析者の”やりたい”を止めない、統合解析環境の構築
thumbnail_image: /img/posts/cdm-5.png

---
# 解析者の”やりたい”を止めない、統合解析環境の構築

塩野義製薬株式会社DX推進本部データサイエンス部所属、データエンジニアの高市です。 データサイエンス部では、Central Data Management（以下CDM）構想の元、2023年度にデータ活用のための基盤を整えました。「データを貯めておく場所は？そこからデータを使うには？誰が使えるの？」といった視点の紹介記事はこちら に掲載しています。

---

2024年度以降は、この基盤を元に全社的なデータ活用のさらなる拡大を目指しています。本記事では、個人や組織が使いたいデータを活用するために、”データを解析する場所” として価値を発揮している、「統合解析環境」について紹介します。

<img src="{{ "/img/posts/cdm-4.png" | relative_url }}" alt="SHIONOGIデータアーキテクチャ" width="600" height="400">

図 1　 Central Data Management構想

# クラウド化による自由度の高い解析環境の実現
これまでデータサイエンス部が持っていた統合解析環境をより高度なものにするにあたり、従来の場（オンプレミス環境）からクラウドに移すことで、様々な解析に柔軟に対応できる解析環境を実現しました。クラウドは、必要な時に、自由な内容の計算資源が、即時に得られる場です。これによって、ヘルスケアやビジネスにおいて近年多様に進化・深化し続けるニーズに対し、タイムリーで高度な解析が可能になります。
解析者はこの場所で、Snowflakeにあるデータを参照し、SAS ViyaやAWSオンデマンド計算環境でデータの解析を行います
必要に応じてSpotfireでの可視化も可能です。解析における計算環境の性能や、そこで使用するソフトウェアも、解析者自身が自由に選択できます。こういった柔軟性が、解析の効率化やスピード向上に大きく寄与しています。

<img src="{{ "/img/posts/cdm-5.png" | relative_url }}" alt="SHIONOGIデータアーキテクチャ" width="600" height="400">

図 2　統合解析環境の構成図

---

# 「SHIONOGI協創型データエコシステム」の実現を目指して
クラウド化したシステムにより、他社クラウド環境との、”クラウド to クラウド”の円滑なデータの受け渡しも可能となりました。
クラウドの場ではデータの授受を、安全に、円滑に、場合によっては完全自動で行う、宅配ボックスのような仕組みも速やかに設けることができます。このような仕組みを活用することで、社外データ活用のハードルをさらに下げることができます。社外とのコラボレーションがより促進されれば、データ解析の幅も大きく広がっていくことが期待されます。
最終的には、SHIONOGIを核とした外部企業やアカデミアとの連携が生み出す、「SHIONOGI協創型データエコシステム」の実現を目指して、これからも時代の変化に適応し、日々進化を続けていきたいです。

### データエンジニアリング人材の募集
データサイエンス部では、
データエンジニアリング職の募集を行っています。

データ関連のスキルやご経験をヘルスケア領域の
データ基盤の構築・運用で活かしてみたい方は、
以下のリンクから募集内容の詳細を確認ください。
皆さまからのご応募をお待ちしております。