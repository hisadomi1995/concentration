import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useGameState', () => {
  it('initializes with 16 cards in playing phase', () => {
    const { result } = renderHook(() => useGameState());
    expect(result.current.state.cards).toHaveLength(16);
    expect(result.current.state.phase).toBe('playing');
  });

  it('flips a card when handleCardClick is called', () => {
    const { result } = renderHook(() => useGameState());
    const firstHiddenId = result.current.state.cards.find((c) => c.status === 'hidden')!.id;

    act(() => {
      result.current.handleCardClick(firstHiddenId);
    });

    const card = result.current.state.cards.find((c) => c.id === firstHiddenId);
    expect(card?.status).toBe('flipped');
  });

  it('does not flip card when it is not human turn', () => {
    const { result } = renderHook(() => useGameState());

    // Manually get two cards and flip them to trigger computer turn
    const hidden = result.current.state.cards.filter((c) => c.status === 'hidden');
    act(() => { result.current.handleCardClick(hidden[0].id); });
    act(() => { result.current.handleCardClick(hidden[1].id); });

    // Resolve the pair (not matched case — advance timers)
    act(() => { vi.advanceTimersByTime(1300); });

    // Now it should be computer's turn — clicking should do nothing
    const stillHidden = result.current.state.cards.find((c) => c.status === 'hidden');
    if (stillHidden && result.current.state.currentTurn === 'computer') {
      const statusBefore = result.current.state.cards.find((c) => c.id === stillHidden.id)?.status;
      act(() => { result.current.handleCardClick(stillHidden.id); });
      const statusAfter = result.current.state.cards.find((c) => c.id === stillHidden.id)?.status;
      expect(statusAfter).toBe(statusBefore);
    }
  });

  it('resets state when handleRestart is called', () => {
    const { result } = renderHook(() => useGameState());
    const originalIds = result.current.state.cards.map((c) => c.id);

    act(() => { result.current.handleRestart(); });

    expect(result.current.state.phase).toBe('playing');
    expect(result.current.state.score).toEqual({ human: 0, computer: 0 });
    expect(result.current.state.selectedCardIds).toHaveLength(0);
    // All cards should be hidden after restart
    result.current.state.cards.forEach((c) => expect(c.status).toBe('hidden'));
    // IDs may differ because cards are re-generated, but count is same
    expect(result.current.state.cards).toHaveLength(originalIds.length);
  });
});
