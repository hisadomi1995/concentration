# Requirements Document

## Introduction

本プロジェクトは、ブラウザ上で動作する神経衰弱（Concentration）ゲームをReact + TypeScriptで開発する。
対象ユーザーは、ブラウザ上で手軽にカードゲームを楽しみたい人であり、ユーザー対コンピューターの1対1対戦を提供する。

**前提条件:**
- カードは絵文字を使用し、8ペア（計16枚）固定とする
- コンピューターはAIとして自動でターンをこなす（一定の記憶能力を持つ）
- スコアは「獲得ペア数」で管理し、全ペアが揃った時点でゲーム終了・勝敗判定を行う
- バックエンド・データ永続化は不要。ゲーム状態はフロントエンドのみで管理する

---

## Requirements

### Requirement 1: カード生成

**User Story:** As a player, I want cards to be randomly generated at the start of each game, so that every game feels fresh and unpredictable.

#### Acceptance Criteria
1. ゲーム開始時に8種類の絵文字が選択され、それぞれ2枚ずつ計16枚のカードが生成される
2. 16枚のカードはゲーム開始時にランダムにシャッフルされ、グリッド上に配置される
3. すべてのカードは初期状態で裏向き（絵文字が非表示）になっている
4. 再ゲーム時も新たにシャッフルされた状態でカードが生成される

---

### Requirement 2: カード選択

**User Story:** As a player, I want to flip cards by clicking them, so that I can try to find matching pairs.

#### Acceptance Criteria
1. プレイヤーのターン中、裏向きのカードをクリックすると表向きになる（絵文字が表示される）
2. 1ターンに最大2枚までしかカードを選択できない
3. すでに表向き（選択中）のカードを再度クリックしても何も起きない
4. すでにペアが成立して確定済みのカードはクリックできない
5. コンピューターのターン中はプレイヤーのクリック操作を受け付けない

---

### Requirement 3: ペア判定

**User Story:** As a player, I want the game to automatically check if two selected cards match, so that I can know the result immediately.

#### Acceptance Criteria
1. 2枚目のカードが選択された直後に、2枚のカードの絵文字が一致しているか判定される
2. ペア成立の場合：
   - 2枚のカードは表向きのまま確定状態になる
   - そのプレイヤーのスコア（獲得ペア数）が1増加する
   - 同じプレイヤーのターンが継続する
3. ペア不成立の場合：
   - 一定時間（1〜2秒）後に2枚のカードが裏向きに戻る
   - ターンが相手プレイヤーに移る
4. 全16枚のカードがペア確定状態になった時点でゲームが終了する

---

### Requirement 4: 状態管理

**User Story:** As a player, I want the game to track scores and turns accurately, so that I always know the current game state.

#### Acceptance Criteria
1. 現在のターン（プレイヤー or コンピューター）が画面上に常に表示される
2. プレイヤーとコンピューターそれぞれの獲得ペア数がリアルタイムで表示される
3. 選択中（めくっている途中）のカード状態、確定済みのカード状態が正確に保持される
4. ゲーム終了時に勝敗結果（プレイヤーの勝ち / コンピューターの勝ち / 引き分け）が表示される
5. 「もう一度プレイ」ボタンを押すと、状態がリセットされて新しいゲームが始まる

---

### Requirement 5: コンピューターAI

**User Story:** As a player, I want the computer to play intelligently based on previously revealed cards, so that the game is challenging and fun.

#### Acceptance Criteria
1. コンピューターのターンになると、自動で2枚のカードを選択する
2. コンピューターは一度表になったカードの位置を記憶し、ペアが分かっている場合は確実に選択する
3. ペアが分からない場合はランダムにカードを選択する
4. コンピューターの操作は視覚的に確認できるよう、適切なディレイ（0.5〜1秒）を挟んで行われる

---

### Requirement 6: UI/UX

**User Story:** As a player, I want a clean and intuitive interface, so that I can focus on the game without confusion.

#### Acceptance Criteria
1. カードは4×4のグリッドレイアウトで表示される
2. カードのめくりは視覚的なフリップアニメーションで表現される
3. ゲームの状態（ターン・スコア）はカードグリッドの外側に常に表示される
4. モバイルブラウザでも操作可能なレスポンシブデザインとする
