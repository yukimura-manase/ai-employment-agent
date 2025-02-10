こんにちは、Web エンジニアのまさぴょんです！
今回、[AI Agent Hackathon with Google Cloud](https://zenn.dev/hackathons/2024-google-cloud-japan-ai-hackathon)に参加して、
就活・転職のサポートをしてくれる AI Agent を開発しましたので、ご紹介します 🐱

https://zenn.dev/hackathons/2024-google-cloud-japan-ai-hackathon

## ハッカソンのテーマは「生成 AI」

[AI Agent Hackathon with Google Cloud](https://zenn.dev/hackathons/2024-google-cloud-japan-ai-hackathon)という名前から想像できるとおり、
**テーマは「生成 AI」** のハッカソンになります 📝

また、開発プロジェクト条件として、

1. Google Cloud の AI プロダクトのうち、少なくとも 1 つを使用
2. Google Cloud コンピュート プロダクトのうち、少なくとも 1 つを使用

との条件があったので、そこも考慮しながら開発を進めました 💪

## 「生成 AI」で「就活・転職」の課題を解決する！

チームでブレストした結果、転職活動中のメンバーがいたり、私自身公務員からエンジニアに転職する際に苦労した経験などから、**時間のかかる就活・転職活動を AI Agent の力で自動化すること！**
を開発テーマとして決めました！

:::message

### 「就活・転職」は時間がかかる！

1. どういった方針で就活・転職活動すればいいのかなど、考えるのに時間がかかる。
2. エントリーシート, 職務経歴書など書類作成に時間がかかる。
3. 自分にマッチした求人を探すのに時間がかかる。
   :::

### 就活・転職者の課題を解決する機能の考案 🤔

そして、テーマを軸に議論した結果、次のような機能を提供するような **「AI 就活エージェント」** を考案しました 🤔

1. AI 就活エージェントとユーザーが音声会話できる機能
   - **できれば、WebSocket or WebRTC を使ったリアルタイムな音声会話**
2. 就活戦略の立案, 就活スケジュールの作成機能
3. 職務経歴書やエントリーシートの自動生成機能
4. 就職先のレコメンド・求人を検索する機能
   - ブラック度調査, 社員口コミ・チェックなどのスクリーニングも自動化したい！
5. 面接練習機能
   :::message
   主に「就活・転職者」にとって、手間が多い作業を AI で自動化することを主眼におきました 📝
   また、AI ならではの相談・壁打ちや、面接練習相手になってほしいなどの需要もありそうなどと考えました。
   :::

画像は、MTG 中に User 視点でのワークフローを整理したもの 📝
![](https://storage.googleapis.com/zenn-user-upload/0ae9e25ea79d-20250210.png)

### 今回実現できた機能と、AI Agent

今回のハッカソンでは次の 3 つの機能と、その AI Agent の開発まで進めることができました 🙌

1. **AI 就活エージェントとユーザーが音声会話できる機能(会話 AI Agent)**
   - 「SpeechToText -> LLM による文章回答 -> TextToSpeech」の処理フローで実装
   - WebSocket を使ったリアルタイムな音声会話は実装で苦戦して見送り 😭
2. **エントリーシートを自動生成する機能(エントリーシート作成 AI Agent)**
3. **求人検索機能(求人検索 AI Agent)**

:::message

### AI 活用の目的 📝

- 就活・転職活動の質の向上と工数(時間)削減が目的
  :::

## 『AI 就活エージェント』のプロダクト紹介デモ動画

サービスの実際の動作をご覧いただくために、デモ動画を用意しました。以下のリンクからご覧ください 👀✨

## 『AI 就活エージェント』の使い方

『AI 就活エージェント』の使い方はシンプルで、
**1. GoogleLogin する。**
**2. 就活プロフィールを入力する。**

までしたら、

- 求人検索機能
- エントリーシート作成機能
- AI 就活エージェントとの会話機能

のどの機能でも使ってもらって構いません 🙆‍♂️

:::message
就活プロフィールを入力しなくても他の機能は使えますが、LLM による判定の精度が落ちてしまいます 🙏
:::

### Top ページ

Top ページでは、 『AI 就活エージェント』の可愛いお姉さんが微笑んでいます 🥺

![](https://storage.googleapis.com/zenn-user-upload/0e205bd7f0d1-20250210.png)

### 就活プロフィール入力ページ

就活プロフィール情報の入力ページでは、

1. 現在の仕事内容
2. 希望する仕事内容

について入力して、登録することができます。

:::message
入力された就活プロフィール情報は、
AI 就活エージェントとの会話, エントリーシート作成, 求人検索の 3 つで使われる情報になります 📝
:::

![](https://storage.googleapis.com/zenn-user-upload/ca7caa5a703e-20250210.png)

### エントリーシート作成ページ

エントリーシート作成の実行ボタンを押すと、ユーザーのプロフィール情報をもとに、
エントリーシートが自動生成されます 📝

![](https://storage.googleapis.com/zenn-user-upload/680ae5640ff0-20250210.png)

### AI 就活エージェントとの会話ページ

AI 就活エージェントとは、音声入力で会話することができます 📝
ここは、「SpeechToText -> LLM による文章回答 -> TextToSpeech」の処理フローで実装しました。

![](https://storage.googleapis.com/zenn-user-upload/f1caa7eb5620-20250210.png)

ちなみに、SpeechToText は Web 標準の`SpeechRecognition`API を使用しています！
https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition

また、TextToSpeech には、VoiceVox を利用しています！
https://github.com/VOICEVOX

### 求人検索ページ

求人検索 🔍 ボタンを押すと、ユーザーのプロフィール情報をもとに、求人検索をすることができます！

![](https://storage.googleapis.com/zenn-user-upload/d5caa7cc2574-20250210.png)

## 参加メンバーと役割分担

今回は、次のような 3 人チームで挑みました 💪🥺🔥

1. 私：ハッカソン好きな Web エンジニア
2. N さん：AI 周りが得意なデータサイエンティスト
3. M さん：FastAPI 実装が得意な Python 使い 💪

### 役割分担 📝

それぞれの経験を活かして、次のような役割分担をしました。
:::message
チーム・リーダー： 私
FrontEnd：私
BackEnd： M さんと、私
AI Agent：N さんと、私
Infra：N さん
:::

## アーキテクチャと技術選定について

今回のプロダクトのアーキテクチャは、次のような構成になります 👀

![](https://storage.googleapis.com/zenn-user-upload/909b12d06717-20250210.png)

### 開発に使用した技術 📝

開発に使用した技術は、以下のとおりです 👀🌟

:::message

- FE
  - 言語：TypeScript
  - Framework：Next.js,React
  - CSS・UI 周り：TailwindCSS, shadcn/ui
  - Form 周り：zod, react-hook-form
  - State 管理：zustand
  - Markdown 表示：react-markdown, emark-gfm
- API
  - Hono: System 全体の API であり、会話 AI エージェントとの API
    - 言語：TypeScript
    - ORM：Prisma
  - FastAPI: 求人検索, エントリーシート生成 AI Agent の API
    - 言語：Python
  - VOICEVOX: 会話 AI エージェントからの回答文章の読み上げ(音声合成)API
- 生成 AI(LLM)系
  - Vertex AI: 求人検索とエントリーシート作成 AI Agent の Logic で使用。
  - Gemini & LangChain.js: 会話 AI Agent の Logic で使用。
- Auth
  - Google OAuth ✖️ Supabase
- DB
  - Supabase(PostgreSQL)
- Infra - Google Compute Engine - Docker
  :::

## 【まとめ】 ハッカソンを通しての学び・感想

最後に、3 人のハッカソンを通しての学び・感想について記載します 📝

### 私の参加してみての学び・感想

期間内に 3 つの AI Agent を搭載したプロダクトをリリースできてよかったです 🎉
ただ、プロダクトとしての改善点は多いため、その点を改修して世に出していけたらと思いました 💪

また、AI との会話の部分に WebSocket を使ったリアルタイムな音声会話を実装しようとしていましたが、Error 解決などが難航したため断念しました、、、悔しかったです 😭
ただ、提出期限に間に合わせるには必要な決断だと思いました！

### N さんの参加してみての学び・感想

今回 Gemini in VertexAI を使用して 1)求人検索 2)エントリーシート作成
の AI エージェントを作成しましたが、高機能で実装が直感的に行えたのがとても印象的でした。

今回は Google 検索をグラウンディングとして使用していますが、求人やその URL まで取得することができており、LLM と検索を組み合わせることの価値が計り知れないと思いました。

またテキストを使用したチャットだけでなく、音声対話まで実装することによって、気軽に相談できるコンサルタントができたと思います。

### M さんの参加してみての学び・感想

本来なら会話履歴をすべて参照して、検索のカギとなるキーワードを何らかのロジックで抜粋し、リクエストに必要なフィールドは…、と API 自体をソリッドに作らないと望んだ結果が得られなかったものに対しても、サマリーしておいた会話履歴を input として引っ張り出してくるだけで機能させられます。

さらに output を新たなサマリーにしてしまえばコンテキストも肥大化しません。
output のシンプルさや正確性も何よりですが、input が非常にシンプルな API で済んでしまうことに LLM の強みを感じました。

## 参考・引用

https://zenn.dev/hackathons/2024-google-cloud-japan-ai-hackathon

https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition
