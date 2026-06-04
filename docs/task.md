# Implementation Plan

## Phase 1: MVP (Minimum Viable Product)

- [x] 1. プロジェクト環境構築
  - `app/` ディレクトリに Vite + React + TypeScript プロジェクトを初期化する (`npm create vite@latest app -- --template react-ts`)
  - Vitest と React Testing Library をインストールする
  - `tsconfig.json` のパスエイリアスを設定する
  - `vite.config.ts` にテスト設定を追加する
  - _Requirements: Requirement 6_

- [x] 2. 型定義の実装 (`src/types/game.ts`)
  - `CardId`, `CardStatus`, `Card`, `Player`, `GamePhase`, `Score`, `GameState`, `GameAction` の各型・インターフェースを定義する
  - `design.md` の Core Interfaces をそのまま実装する
  - _Requirements: Requirement 4_

- [x] 3. CardGenerator の実装 (`src/game/cardGenerator.ts`)
  - 使用する絵文字リスト（20種以上）をハードコードで定義する
  - `generateCards(): Card[]` — 8種をランダム選択し16枚生成する
  - `shuffleCards(cards: Card[]): Card[]` — Fisher-Yatesアルゴリズムでシャッフルする
  - 単体テスト作成・実行（16枚生成・ペア数正確・シャッフル後も全ペア存在）
  - _Requirements: Requirement 1_

- [x] 4. GameEngine の実装 (`src/game/gameEngine.ts`)
  - `isPair(card1: Card, card2: Card): boolean` — pairId比較によるペア判定
  - `isGameOver(cards: Card[]): boolean` — 全カードがmatched状態か確認
  - `getWinner(score: Score): Player | 'draw'` — スコア比較で勝者返却
  - 単体テスト作成・実行
  - _Requirements: Requirement 3, Requirement 4_

- [x] 5. GameStateReducer の実装 (`src/game/reducer.ts`)
  - `GameAction` の各type (`START_GAME`, `FLIP_CARD`, `RESOLVE_PAIR`, `COMPUTER_FLIP`, `UPDATE_COMPUTER_MEMORY`, `END_GAME`, `RESET_GAME`) に対応するreducerを実装する
  - `START_GAME`: `generateCards()` を呼び出し初期stateを生成する
  - `FLIP_CARD` / `COMPUTER_FLIP`: 対象カードのstatusを `flipped` に更新し `selectedCardIds` に追加する
  - `RESOLVE_PAIR`: ペア成立なら `matched` に変更しスコア加算・ターン継続、不成立なら `hidden` に戻しターン交代する
  - 単体テスト作成・実行（各Actionに対して期待stateになること）
  - _Requirements: Requirement 3, Requirement 4_

- [x] 6. ComputerAI の実装 (`src/game/computerAI.ts`)
  - `selectCards(cards: Card[], memory: Record<CardId, string>): [CardId, CardId]` を実装する
  - 記憶にペアがある場合はその2枚を選択する
  - ペアが不明な場合はhiddenカードからランダムに2枚選択する
  - 単体テスト作成・実行（記憶ありペア選択・記憶なしランダム選択）
  - _Requirements: Requirement 5_

- [x] 7. useGameState フックの実装 (`src/hooks/useGameState.ts`)
  - `useReducer` で `GameState` を管理する
  - `handleCardClick(cardId: CardId): void` — phase・turn・statusを確認してdispatchする
  - `handleRestart(): void` — `RESET_GAME` をdispatchする
  - `useEffect` でコンピューターターンを検知し、AIロジックを `setTimeout`（0.8秒・1.5秒）でディレイ実行する
  - ペア判定後のカード戻し（不成立時）を1.5秒後に `RESOLVE_PAIR` dispatchで実装する
  - コンピューターがめくったカードを `UPDATE_COMPUTER_MEMORY` でメモリに記録する
  - _Requirements: Requirement 2, Requirement 3, Requirement 4, Requirement 5_

- [x] 8. Card コンポーネントの実装 (`src/components/Card/`)
  - `status` (`hidden` / `flipped` / `matched`) に応じて表裏を切り替えるUIを実装する
  - CSSによる3Dフリップアニメーションを実装する (`Card.css`)
  - `hidden` 状態かつプレイヤーターン時のみ `onClick` を有効にする
  - _Requirements: Requirement 2, Requirement 6_

- [x] 9. CardGrid コンポーネントの実装 (`src/components/CardGrid/`)
  - `cards: Card[]` を受け取り4×4グリッドで `Card` を並べる
  - CSS Gridによるレスポンシブレイアウトを実装する
  - _Requirements: Requirement 1, Requirement 6_

- [x] 10. ScorePanel コンポーネントの実装 (`src/components/ScorePanel/`)
  - 現在のターン（プレイヤー / コンピューター）を強調表示する
  - プレイヤーとコンピューターの獲得ペア数を表示する
  - _Requirements: Requirement 4_

- [x] 11. GameResult コンポーネントの実装 (`src/components/GameResult/`)
  - `getWinner()` の結果に基づき「あなたの勝ち」「コンピューターの勝ち」「引き分け」を表示する
  - 「もう一度プレイ」ボタンで `handleRestart()` を呼び出す
  - _Requirements: Requirement 4_

- [x] 12. GameBoard・App の組み立て
  - `GameBoard.tsx`: `ScorePanel` + `CardGrid` をまとめる
  - `App.tsx`: `useGameState` を呼び出し、`phase === 'finished'` なら `GameResult`、それ以外は `GameBoard` を表示する
  - ゲーム開始時に `START_GAME` をdispatchする
  - _Requirements: Requirement 1, Requirement 4, Requirement 6_

---

## Phase 2: UX改善

- [x] 13. アニメーション・視覚的フィードバックの強化
  - ペア成立時のハイライトエフェクト（緑枠点滅など）を追加する
  - コンピューターが選択中のカードを視覚的に強調する（枠色変化）
  - _Requirements: Requirement 6_

- [x] 14. レスポンシブ対応の確認・調整
  - モバイル（375px〜）・タブレット（768px〜）・PC（1024px〜）でのレイアウト確認
  - カードサイズ・グリッドギャップを画面サイズに合わせて調整する
  - _Requirements: Requirement 6_

- [x] 15. 結合テストの追加
  - `useGameState` + `GameBoard` の結合テストを実装する（カードクリック → UI反映）
  - ゲーム終了フローの結合テストを実装する（全ペア確定 → `GameResult` 表示 → リプレイ）
  - _Requirements: Requirement 3, Requirement 4_

---

## Phase 3: 品質・仕上げ

- [x] 16. アクセシビリティ対応
  - カードに `aria-label`（例：「カード 表：🐶」「カード 裏向き」）を付与する
  - キーボード操作（Tabキーでカード移動・Enterで選択）に対応する
  - _Requirements: Requirement 6_

- [x] 17. README の整備
  - セットアップ手順・ゲームルール・技術スタックを記述する
  - _Requirements: なし（開発者向け）_
