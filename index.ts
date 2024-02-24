import express from "express";
import rateLimit, { MemoryStore } from "express-rate-limit";

// レートリミットの設定
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  limit: 10, // 15分間に10リクエストまで許可
  standardHeaders: true, // 標準的なRateLimitヘッダーに関する情報を返す
  legacyHeaders: false, // 古い`X-RateLimit-*`ヘッダーを無効化
  keyGenerator: (req) => req.ip || "unknown", // カスタムキージェネレーター、ここではリクエストを行ったクライアントのIPアドレスに基づく
  handler: (req, res) => {
    // レートリミットが超過した場合のハンドラー
    res.status(429).json({
      error: "You have been rate limited.",
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
  },
  store: new MemoryStore(), // MemoryStoreを使用してリクエストカウントを記録
  skipFailedRequests: false, // 失敗したリクエストのカウントをスキップしない
  skipSuccessfulRequests: false, // 成功したリクエストのカウントをスキップしない
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
