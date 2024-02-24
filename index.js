"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importStar(require("express-rate-limit"));
// レートリミットの設定
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15分
    limit: 10, // 15分間に10リクエストまで許可
    standardHeaders: true, // 標準的なRateLimitヘッダーに関する情報を返す
    legacyHeaders: false, // 古い`X-RateLimit-*`ヘッダーを無効化
    keyGenerator: (req) => req.ip || "unknown", // カスタムキージェネレーター、ここではリクエストを行ったクライアントのIPアドレスに基づく
    handler: (req, res) => {
        // レートリミットが超過した場合のハンドラー
        res.status(429).json({
            error: "You have been rate limited.",
            message: "Too many requests from this IP, please try again after 15 minutes",
        });
    },
    store: new express_rate_limit_1.MemoryStore(), // MemoryStoreを使用してリクエストカウントを記録
    skipFailedRequests: false, // 失敗したリクエストのカウントをスキップしない
    skipSuccessfulRequests: false, // 成功したリクエストのカウントをスキップしない
});
const app = (0, express_1.default)();
// APIルートにレートリミットを適用
app.use("/api/", apiLimiter);
// テスト用のAPIエンドポイント
app.get("/api/test", (req, res) => {
    res.json({ message: "Rate limit test API" });
});
// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
