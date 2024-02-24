import express from "express";
import rateLimit from "express-rate-limit";

// レートリミットの設定
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 15分間に100リクエストまで許可
  standardHeaders: true, // RateLimitヘッダーに関する情報を返す
  legacyHeaders: false, // 無効化されたRateLimitヘッダーを削除する
});

const app = express();

// APIルートにレートリミットを適用
app.use("/api/", apiLimiter);

// テスト用のAPIエンドポイント
app.get("/api/test", (req, res) => {
  res.json({ message: "Rate limit test API" });
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
