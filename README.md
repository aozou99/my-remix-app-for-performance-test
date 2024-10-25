# Welcome to Remix + Cloudflare!

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)

## アプリケーションの目的

このアプリケーションは、Remix + Cloudflare Pages/Functionsの環境で以下の2つの主要な機能を検証することを目的としています：

1. **レンダリングパフォーマンス** (/test/render)
   - 大量のコンポーネントのレンダリング速度を測定
   - 単純なコンポーネントと複雑なコンポーネントの比較
   - URLパラメータによるコンポーネント数と複雑さの制御

2. **JSONの処理パフォーマンス** (/test/json)
   - 大規模なJSONオブジェクトの生成、シリアライズ、デシリアライズの速度を測定
   - オブジェクトサイズ、操作タイプ、繰り返し回数をURLパラメータで制御

これらのテストを通じて、Cloudflare Pages/Functions環境でのRemixアプリケーションのパフォーマンス特性を理解することができます。

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
