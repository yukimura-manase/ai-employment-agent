# python3.9のイメージをダウンロード
FROM python:3.9-buster

# Pythonの出力をバッファリングせず、リアルタイムで表示する(ホットリロード対応)
ENV PYTHONUNBUFFERED=1

WORKDIR /src

COPY . /src

RUN pip install poetry

# poetryでライブラリをインストール (pyproject.tomlが既にある場合)
RUN poetry config virtualenvs.in-project true
RUN if [ -f pyproject.toml ]; then poetry install --no-root; fi

# uvicornのサーバーを立ち上げる
ENTRYPOINT ["poetry", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--reload"]