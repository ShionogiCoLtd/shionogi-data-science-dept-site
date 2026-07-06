---
layout: post
title: "社員の誰でも、使いたい分だけ使える個人専用環境、AWSオンデマンド設計の裏側"
thumbnail_image: /img/posts/aws-ondemand-personal-environment/01-architecture.png
---

# 社員の誰でも、使いたい分だけ使える個人専用環境、AWS オンデマンド設計の裏側

塩野義製薬株式会社 DX 推進本部 データサイエンス部 コンピュータサイエンスグループ所属の松下です。
データサイエンス部は、統計解析や機械学習など幅広いデータ活用技術を通じたソリューション創出や業務プロセスの変革を推進する立場にあります。その目的を達成するために、先進技術の活用を推進しつつ、データ解析をスムーズに実施できる環境の構築・運用を行うことは重要な要素の一つになります。
そのため、コンピュータサイエンスグループでは、データを集めて解析するまでを一気通貫で実施できる最先端の環境の整備と活用をミッションとしています。このミッションを達成するために、自身が積極的に先進技術に触れることはもちろんですが、部内外でのコラボレーションを通じて様々な業務内容を深く知ることで、より先進技術を最適な形で業務活用することができると考えています。具体的には、量子技術や AWS の最新技術などを積極的にキャッチアップしつつ、部内外のメンバーとのコミュニケーションの場などで、求められるニーズについてもタイムリーに把握することを意識して日々の活動に取り組んでいます。
本記事では、[「解析者の”やりたい”を止めない、統合解析環境の構築」](https://shionogicoltd.github.io/shionogi-data-science-dept-site/2025/06/10/cloud-reports.html)に掲載しているコンピュータサイエンスグループが構築した解析環境である AWS オンデマンド環境の設計の裏側について、一部のソースコードの解説とともにご紹介します。


---

## AWS オンデマンド環境の設計について
AWS オンデマンド環境の設計の詳細については、以下の AWS 社への寄稿ブログの記事をご参照ください。
[寄稿：塩野義製薬株式会社での、セルフサービスの解析環境払い出しの仕組み “オンデマンド計算環境” をご紹介 | Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/shionogi-self-service-on-demand-computing-environment/)

---

---


## ソースコードの開発方針について

AWS オンデマンド環境の構築において、IaC（Infrastructure as Code）の手法ですべて開発するという方針を取っています。IaC とは、通常手動で行うインフラの構築や設定をコードによって自動化する方法です。

IaC には多くのメリットがあります。例えば、インフラをコードとして扱うことにより、チーム間の情報共有が円滑になり、技術的な属人化を回避できることが挙げられます。また、解析環境のアップデートを行う際にも、容易に変更を反映させることが可能になります。このように様々なメリットがありますが、IaC でシステムを構築できるようになるためには、相応の学習時間や組織での教育コストが必要になります。ですが、自分の環境を自分で決定できる強力なデータサイエンス組織を目指し、完全に内製での開発を実施しました。

(実際に筆者が PJ に参画した際は、IaC だけでなく AWS の知識もほとんど 0 に近い状態でしたが、組織内の有識者による教育により、スムーズに開発に参画することができました)

さらに、IaC の採用に加えて、GitLab を活用したイシュー駆動型の開発を行いました。Git を活用することで、ソースコードの追加や変更の履歴をすべて記録することはもちろん、ソースコードの追加や変更の際にイシューを必ず立てて、意思決定の過程を記録することで、過去の思考プロセスを後からでも確認できる仕組みを実現しました。これにより、属人化を防ぎながら、システムの継続的な運用を支える仕組みを確立しています。

このような方針で開発を進めた結果、実際に運用担当者の交代があった際も、業務の引き継ぎは滞りなく行われ、日常業務に支障をきたすことなく、データサイエンス業務の基盤となる解析環境の運用を継続することができました。

![AWS オンデマンド環境の全体像]({{ site.baseurl }}/img/posts/aws-ondemand-personal-environment/01-architecture.png)

## AWS CloudFormation テンプレートを利用した解析環境の定義

前セクションで述べた通り、AWS オンデマンド環境では IaC ですべてのシステムを構築しています。AWS 上で IaC による構築・運用を実現するサービスは様々存在しますが、本開発では AWS CloudFormation を活用しています。

AWS オンデマンド環境のキーとなる以下のポイントについて、AWS CloudFormation のテンプレートとともに詳細を解説します。

1. 解析環境の製品としての定義
2. Lambda によるタグ付け戦略の自動化
3. ユーザーへの最小権限の付与

## 解析環境の製品としての定義

製品ごとに AWS CloudFormation テンプレートを作成しているため、ユーザーは利用したい製品を選択してパラメータを入力するだけで望みの解析環境を払い出すことが可能になります。

例えば、Python を実行したいユーザーであれば、インフラのセットアップをすることなく Python を実行できるように、製品ごとにテンプレートを定義して、AWS Service Catalog から払い出すことができるようにしています。

以下に JupyterLab 製品を例に AWS CloudFormation テンプレートの構成要素ごとに説明します。

### 【Parameters】

利用者が任意の性能の解析環境を払い出せるようにするために、インスタンスタイプやストレージ容量などを選択できるように設計しています。

また、コストやプロジェクトに関する情報などの入力欄を設けることで、その内容を自動的にタグ付けすることができ、効率的に利用実績データを蓄積することを可能にしています。これにより、ユーザーの利用状況をデータから正確に把握することで、「ユーザーの利用状況に即した継続的な環境の改善」や「従量課金制のクラウド環境において正確な利用コストの把握」に繋げることが可能になっています。

```yaml
Parameters:
  InstanceType:
    Description: Instance type of the obtained Jupyter Lab environment.
    Type: String
    AllowedValues:
      - # 複数のインスタンスタイプを記載
      -
      -
    Default: # デフォルトも設定

  VolumeSize:
    Description: EBS (SSD) disk volume size (GiB). Allowed Range is 30 to 16,384.
    Type: Number # Allowed Range: 1-16,384
    MinValue: 30
    MaxValue: 16384
    Default: 100

  Iops:
    Description: EBS IOPS. Allowed Range is 3,000 to 16,000.
    Type: Number # Allowed Range: 3,000-16,000
    MinValue: 3000
    MaxValue: 16000
    Default: 3000

  Throughput:
    Description: EBS Throughput (MiB/s). Allowed Range is 125 to 1,000.
    Type: Number # Allowed Range: 125-1,000
    MinValue: 125
    MaxValue: 1000
    Default: 125

  JupyterPassword:
    Description: Enter password (8 to 16 length alphanumeric characters) to login to the obtained Jupyter Lab environment.
    Type: String
    AllowedPattern: ^[0-9a-zA-Z]+$
    MinLength: 8
    MaxLength: 16
    NoEcho: True

  # コスト情報の入力欄
  XXXX:
    Description: XXXX
    Type: String
    AllowedPattern: '(^[A-Z0-9]+$|^SI-\d{4}$)'

  YYYY:
    Description: YYYYY
    Type: String
    Default: ''
    AllowedPattern: '^[A-Z0-9]*$'

  ZZZZ:
    Description: ZZZZ
    Type: String
    AllowedPattern: '^[A-Z0-9]+$'
    MinLength: 7
    MaxLength: 7
```

### 【Resources】

基本的には Amazon EC2 の UserData の項目を利用して自動セットアップを行っています。JupyterLab は事前に定義した docker image を ECR から pull するという動作が払い出し時に実行されるようにしています。このように Docker をベースとして解析環境を定義することにより、柔軟なアップデートを可能にしています。

```yaml
Resources:
  Ec2Instance:
    Type: AWS::EC2::Instance
    Properties:
      SubnetId: !FindInMap [EnvMapping, !Ref "AWS::AccountId", SubnetId]
      IamInstanceProfile: !Ref IAMInstanceProfileForLaunchedEC2Instance
      PropagateTagsToVolumeOnCreation: true
      LaunchTemplate:
        LaunchTemplateId: !Ref LaunchTemplate
        Version: 1

      # Parameters で入力された情報をタグとして付与する
      Tags:
        # 注: Name タグは Lamda 関数に作らせるので、ここでは作らない
        - Key: xxx
          Value: xxx

      UserData:
        Fn::Base64:
          !Sub
            - |
              Content-Type: multipart/mixed; boundary="//"
              MIME-Version: 1.0

              --//
              Content-Type: text/cloud-config; charset="us-ascii"
              MIME-Version: 1.0
              Content-Transfer-Encoding: 7bit
              Content-Disposition: attachment; filename="cloud-config.txt"

              #cloud-config
              cloud_final_modules:
                - [scripts-user, always]

              --//
              Content-Type: text/x-shellscript; charset="us-ascii"
              MIME-Version: 1.0
              Content-Transfer-Encoding: 7bit
              Content-Disposition: attachment; filename="userdata.txt"

              #!/bin/bash

              # Docker image name for run into variable
              image_name_jupyter=${AWS::AccountId}.dkr.ecr.${AWS::Region}.amazonaws.com/${ContainerRepositoryNameForJupyter}

              # This "if" statement is for the first time of the booting of EC2 instance,
              # i.e., for the case of docker image is not yet exist on this instance
              if [ -z "$(docker image ls -q $image_name_jupyter)" ]; then
                # Create workspace directry for user work
                mkdir /workdir

                # Yum updates and Docker installing
                yum update -y
                yum install -y docker
                systemctl enable docker
                service docker start

                # Create docker network for jupyter and mlflow
                docker network create jupyter-mlflow-network

                # Pulling docker image from Amazon ECR repository
                aws ecr get-login-password --region ${AWS::Region} | docker login -u AWS --password-stdin https://${AWS::AccountId}.dkr.ecr.${AWS::Region}.amazonaws.com
                docker pull $image_name_jupyter
                docker logout

              # This "else" statement is for other than the first time of the booting of EC2
              # i.e., for the case of docker image for run already existing on this instance
              else
                docker container rm -f "$(docker ps -q -a)"
              fi

              # Running docker container which gives JupyterLab server functionality
              docker run ...
```

### 【Outputs】

利用者が円滑に解析環境にアクセスできるように、JupyterLab の URL を出力するようにしています。これにより、利用者はスムーズに JupyterLab にアクセスし、Python を実行できます。

```yaml
Outputs:
  JupyterURL:
    Description: Jupyter URL
    Value: !Join [ "", [ "http://", {IP}, ":8888" ] ]
```

## Lambda によるタグ付け戦略の自動化

整然としたタグによる管理を実現するために、一部の処理については Lambda 関数を用いたイベント駆動の処理を実装しています。

具体的には、Cloud9 の AWS CloudFormation テンプレートでは、Parameters で入力した情報を EC2 や EBS にタグ付けすることが困難であるため、製品の払い出しというイベントをトリガーとして Lambda によるタグ付けを実行しています。

```yaml
LambdaFunctionToAutoAttachSGAndTagsToCloud9:
  Type: AWS::Lambda::Function
  Properties:
    Description: A Lambda function attached EventBridge that automatically attach tags to ebs from service catalog.
    FunctionName: XXX
    Handler: index.lambda_handler
    Role: XXX
    Runtime: python3.9
    Timeout: 6
    Code:
      ZipFile: |
        # modified from: https://aws.amazon.com/jp/blogs/desktop-and-application-streaming/automatically-attach-additional-security-groups-to-amazon-appstream-2-0-and-amazon-workspaces/
        import json
        import logging
        import boto3
        import re
        import os

        def lambda_handler(event, context):
            ec2 = boto3.resource('ec2')

            instance_id = event["detail"]["responseElements"]["instancesSet"]["items"][0]["instanceId"]
            instance = ec2.Instance(instance_id)

            tags = dict(
                [
                    (
                        tag['Key'],
                        tag['Value']
                    ) for tag in instance.tags
                ]
            )

            for tag in list(tags):
                if re.match('aws:', tag):
                    tags.pop(tag)

            volume_id = instance.block_device_mappings[0]['Ebs']['VolumeId']
            volume = ec2.Volume(volume_id)

            for key, value in tags.items():
                volume.create_tags(
                    Tags=[
                        {
                            'Key': key,
                            'Value': value
                        },
                    ]
                )
```

他にも利用者固有のメタデータ (誰が払い出した製品なのかなど) については、手動で入力するのではなく、API コールの情報を元に自動で付与するようなロジックを実装しています。

```yaml
EventBridgeRule:
  Type: AWS::Events::Rule
  Properties:
    Description: This is an EventBridge trigger to automatically add user tag to ec2 instance and ebs from Service Catalog.
    EventBusName: default
    EventPattern:
      source:
        - aws.ec2
      detail:
        awsRegion:
          - !Ref AWS::Region
        eventSource:
          - ec2.amazonaws.com
        eventName:
          - RunInstances
        responseElements:
          instancesSet:
            items:
              tagSet:
                items:
                  key:
                    - requestedBy
                  value:
                    - AWSServiceCatalog
```

## ユーザーへの最小権限の付与

意図しない課金が発生しないように、AWS Service Catalog を経由しない AWS サービスの作成は禁止するという方針を取っています。AWS Service Catalog の起動制約を利用することで、利用者が意図しない課金を発生させてしまう可能性を排除しつつ、望みの動作を実現できるようにしています。

```yaml
# Create Launch Constraings to each products in portfoilos.
LaunchConstraintsForJupyterLabCpuProduct:
  Type: AWS::ServiceCatalog::LaunchRoleConstraint
  Properties:
    AcceptLanguage: 'jp'
    Description: !Join
      - ''
      -
        - '次のように起動'
        - !GetAtt IAMRoleForLaunchConstraints.Arn
    LocalRoleName: # 事前に定義した IAM ロール
    PortfolioId: !Ref JupyetrLabServiceCatalog
    ProductId: !Ref JupyterLabCpuProduct

IAMRoleForLaunchConstraints:
  Type: AWS::IAM::Role
  Properties:
    Description: "IAM Role to attach Service Catalog as Launch Constraints"
    AssumeRolePolicyDocument:
      Version: "2012-10-17"
      Statement:
        -
          Sid: "ServiceCatalogTrustPolicy"
          Effect: Allow
          Principal:
            Service:
              - servicecatalog.amazonaws.com
          Action:
            - 'sts:AssumeRole'
    ManagedPolicyArns:
      - "arn:aws:iam::aws:policy/AWSCloudFormationFullAccess"
    Policies:
      -
        PolicyName: XXX
        PolicyDocument:
          Version: "2012-10-17"
          Statement:
            -
              Effect: Allow
              Action:
                - 'ec2:*'
                - 'iam:PassRole'
                - 'iam:PassRole'
                - 'iam:CreateRole'
                - 'iam:GetRole'
                - 'iam:TagRole'
                - 'iam:DeleteRole'
                - 'iam:GetRolePolicy'
                - 'iam:PutRolePolicy'
                - 'iam:AttachRolePolicy'
                - 'iam:DetachRolePolicy'
                - 'iam:DeleteRolePolicy'
                - 'iam:GetInstanceProfile'
                - 'iam:CreateInstanceProfile'
                - 'iam:AddRoleToInstanceProfile'
                - 'iam:RemoveRoleFromInstanceProfile'
                - 'iam:DeleteInstanceProfile'
                - 'cloudwatch:PutMetricAlarm'
                - 'cloudwatch:DeleteAlarms'
                - 'ssm:StartSession'
                - 'iam:CreateServiceLinkedRole'
                - 's3:CreateBucket'
                - 's3:DeleteBucket'
                - 's3:PutBucketTagging'
                - 's3:DeleteBucketTagging'
                - 's3:SetBucketEncryption'
                - 's3:DeleteBucketEncryption'
                - 's3:PutEncryptionConfiguration'
                - 's3:PutLifecycleConfiguration'
                - 's3:DeleteLifecycleConfiguration'
                - 's3:PutBucketVersioning'
                - 's3:PutBucketPolicy'
                - 's3:DeleteBucketPolicy'
              Resource: '*'

            # below statement from:
            # https://docs.aws.amazon.com/ja_jp/servicecatalog/latest/adminguide/constraints-launch.html
            -
              Effect: Allow
              Action: 's3:GetObject'
              Resource: '*'
              Condition:
                StringEquals:
                  s3:ExistingObjectTag/servicecatalog:provisioning: true
    RoleName: XXX
```

## おわりに

データサイエンス部が構築した統合解析環境の一部である AWS オンデマンド環境の設計の裏側について紹介いたしました。IaC の手法や GitLab でのイシュー駆動開発をベースに全体の開発を進めたことにより、継続性・安定性の高い運用・管理の実現につながりました。私としても、最新の技術をキャッチアップして導入していくことに注力しつつも、導入後に安定的に運用していくためにはどのような設計にすべきかという点を常に意識しています。スピード感を持って最新の技術を導入することも重要ですが、導入した後に如何に安定感を持って運用できるかを設計することもとても重要な要素であると考えています。

データ活用技術を用いたソリューション創出や業務プロセス変革を組織として推進していくために、どのような状況でも安定した土台となるような解析環境の構築を目指して、今後も業務に取り組んでいきたいと思います。


---

### データエンジニアリング人材の募集
データサイエンス部では、
データエンジニアリング職の募集を行っています。

データ関連のスキルやご経験をヘルスケア領域の
データ基盤の構築・運用で活かしてみたい方は、
以下のリンクから募集内容の詳細を確認ください。
皆さまからのご応募をお待ちしております。