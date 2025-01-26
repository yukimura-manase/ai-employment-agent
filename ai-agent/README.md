# FastAPI の Template Project

## 環境構築方法(初期 setup)

### 1. Docker Image を作成する

```bash
# Docker Image を作成する
docker compose build
```

---

### 2. poetry による Python 環境のセットアップ

- poetry は、Python のパッケージマネージャーです。

  - 参考情報: [pip を使い慣れた人に向けた poetry 入門](https://qiita.com/yamadax/items/fa07028a534de1f13a6e)

- poetry では pip が行わないパッケージ同士の依存関係の解決や、lock ファイルを利用したバージョン固定、Python の仮想環境管理など、より高機能でモダンなバージョン管理が行えます。

- 初回のプロジェクトでは、`poetry`において依存関係を管理する`pyproject.toml`が存在しません。

  - poetry を使って FastAPI をインストールし、`pyproject.toml`を作成していきましょう。

初回は、次のコマンドを実行して、`pyproject.toml`を作成します。

#### [ コマンド内容説明 ]

- Docker コンテナ（ai-agent）の中で、`poetry init`コマンドを実行しています。

- 引数として、`fastapi`と、ASGI サーバーである`uvicorn`をインストールする依存パッケージとして指定しています。

```bash
docker compose run \
  --entrypoint "poetry init \
    --name ai-agent \
    --dependency fastapi \
    --dependency uvicorn[standard]" \
  ai-agent
```

上記コマンドを実行すると、次のようにインタラクティブに質問が投げられます。

- Author のパートのみ`n`または著者名の入力が必要ですが、それ以外はすべて Enter で進めていけば問題ありません。

---

### 3. FastAPI などパッケージのインストール

次のコマンドで、依存パッケージのインストールを行います。

```bash
# 依存パッケージのインストールを実行する
docker compose run --entrypoint "poetry install --no-root" ai-agent
```

上記のインストールが完了した際に、プロジェクトディレクトリ直下に`poetry.lock`ファイルが作成されていることを確認します。

2 と 3 のコマンド実行により、`pyproject.toml`と`poetry.lock`ファイルが準備できました。

---

### 4. FastAPI のコンテナを立ち上げる

```bash
docker compose up
```

## Swagger API Doc

- FastAPI と Swagger UI は、インテグレーション(統合)済みなので、エンドポイントを増やせば、勝手に Swagger も増えます。

- なので、FastAPI は、スキーマ駆動開発を実践しやすいフレームワークだと言えます。

- Swagger UI(REST API Doc) の Link

http://localhost:8000/docs

## ディレクトリ構造

- `__init__.py`は、python モジュールであることを表す空ファイル

- スキーマ（Schemas）には、API のリクエストとレスポンスを、厳密な型と一緒に定義していきます。

## 使用ライブラリについて

- `pyproject.toml`ファイル(Node で言うところの`package.json`)を確認してください。

### ライブラリの追加方法

- `package-name`の箇所を追加したいライブラリ名に変更して、実行する。

```bash
docker compose exec ai-agent poetry add package-name
```

## 【参考・引用】

1. [FastAPI 入門](https://zenn.dev/sh0nk/books/537bb028709ab9)

2. [pip を使い慣れた人に向けた poetry 入門](https://qiita.com/yamadax/items/fa07028a534de1f13a6e)
