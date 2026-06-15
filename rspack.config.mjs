import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import { tanstackRouter } from "@tanstack/router-plugin/rspack";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: {
    main: "./src/main.tsx",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: isProduction ? "js/[name].[contenthash].js" : "js/[name].js",
    chunkFilename: isProduction
      ? "js/[name].[contenthash].chunk.js"
      : "js/[name].chunk.js",
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: { syntax: "typescript", tsx: true },
              transform: { react: { runtime: "automatic" } },
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: "./index.html" }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: path.join(__dirname, "src/tanstack_routes"),
      generatedRouteTree: path.join(__dirname, "src/routeTree.gen.ts"),
    }),
  ],
  optimization: {
    splitChunks: { chunks: "all" },
    runtimeChunk: "single",
  },
  devServer: {
    historyApiFallback: true,
    port: 3333,
    hot: true,
  },
});
