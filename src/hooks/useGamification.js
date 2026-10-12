/**
 * ==============================================================================
 * useGamification.js - إدارة الحالة المركزية لعناصر التحفيز ومنع سباق البيانات
 * مطابق لتوجيهات: Architectural Blueprint for EdTech Platforms (Google AI Studio -> Native)
 * ==============================================================================
 * يعتمد على نمط useReducer لمنع حالات التنافس (Race Conditions) أثناء النقرات المتكررة،
 * ويدعم التحديث التفاؤلي (Optimistic Updates) مع قابلية التراجع عند فشل المزامنة.
 */

import { useReducer, useCallback } from 'react';

// تعريف أنواع الإجراءات المحددة (Discrete Action Types)
export const GAMIFICATION_ACTIONS = {
  INCREMENT_XP: 'INCREMENT_XP',
  DECREMENT_HEART: 'DECREMENT_HEART',
  RESET_HEARTS: 'RESET_HEARTS',
  INCREMENT_STREAK: 'INCREMENT_STREAK',
  RESET_STREAK: 'RESET_STREAK',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  RECORD_CHECKPOINT: 'RECORD_CHECKPOINT',
  RESTORE_PREVIOUS_STATE: 'RESTORE_PREVIOUS_STATE',
};

// الحالة المبدئية لعناصر التحفيز
export const initialGamificationState = {
  xp: 140,
  hearts: 5,
  streak: 3,
  level: 'ممارس منهجي (3AS)',
  unlockedBadges: ['first_deduction', 'streak_3_days'],
  completedCheckpoints: [],
  lastActionTimestamp: Date.now(),
  previousStateSnapshot: null, // لدعم التراجع عند فشل المزامنة السحابية
};

// المعالج المركزي لحالات التعديل (Centralized Reducer)
export function gamificationReducer(state, action) {
  switch (action.type) {
    case GAMIFICATION_ACTIONS.INCREMENT_XP: {
      const addedXp = typeof action.payload === 'number' ? action.payload : 20;
      return {
        ...state,
        previousStateSnapshot: { xp: state.xp, hearts: state.hearts, streak: state.streak },
        xp: state.xp + addedXp,
        lastActionTimestamp: Date.now(),
      };
    }

    case GAMIFICATION_ACTIONS.DECREMENT_HEART: {
      const penalty = action.payload || 1;
      return {
        ...state,
        previousStateSnapshot: { xp: state.xp, hearts: state.hearts, streak: state.streak },
        hearts: Math.max(0, state.hearts - penalty),
        lastActionTimestamp: Date.now(),
      };
    }

    case GAMIFICATION_ACTIONS.RESET_HEARTS: {
      return {
        ...state,
        hearts: 5,
        lastActionTimestamp: Date.now(),
      };
    }

    case GAMIFICATION_ACTIONS.INCREMENT_STREAK: {
      return {
        ...state,
        streak: state.streak + 1,
        lastActionTimestamp: Date.now(),
      };
    }

    case GAMIFICATION_ACTIONS.RESET_STREAK: {
      return {
        ...state,
        streak: 0,
        lastActionTimestamp: Date.now(),
      };
    }

    case GAMIFICATION_ACTIONS.UNLOCK_BADGE: {
      if (state.unlockedBadges.includes(action.payload)) return state;
      return {
        ...state,
        unlockedBadges: [...state.unlockedBadges, action.payload],
        lastActionTimestamp: Date.now(),
      };
    }

    case GAMIFICATION_ACTIONS.RECORD_CHECKPOINT: {
      if (state.completedCheckpoints.includes(action.payload)) return state;
      return {
        ...state,
        completedCheckpoints: [...state.completedCheckpoints, action.payload],
        lastActionTimestamp: Date.now(),
      };
    }

    case GAMIFICATION_ACTIONS.RESTORE_PREVIOUS_STATE: {
      if (!state.previousStateSnapshot) return state;
      return {
        ...state,
        ...state.previousStateSnapshot,
        previousStateSnapshot: null,
      };
    }

    default:
      return state;
  }
}

// Hook مخصص للاستهلاك النظيف في واجهات React
export function useGamification(initialState = initialGamificationState) {
  const [state, dispatch] = useReducer(gamificationReducer, initialState);

  const addXP = useCallback((amount = 20) => {
    dispatch({ type: GAMIFICATION_ACTIONS.INCREMENT_XP, payload: amount });
  }, []);

  const deductHeart = useCallback((penalty = 1) => {
    dispatch({ type: GAMIFICATION_ACTIONS.DECREMENT_HEART, payload: penalty });
  }, []);

  const restoreHearts = useCallback(() => {
    dispatch({ type: GAMIFICATION_ACTIONS.RESET_HEARTS });
  }, []);

  const completeCheckpoint = useCallback((checkpointId) => {
    dispatch({ type: GAMIFICATION_ACTIONS.RECORD_CHECKPOINT, payload: checkpointId });
  }, []);

  const rollback = useCallback(() => {
    dispatch({ type: GAMIFICATION_ACTIONS.RESTORE_PREVIOUS_STATE });
  }, []);

  return {
    state,
    dispatch,
    addXP,
    deductHeart,
    restoreHearts,
    completeCheckpoint,
    rollback,
  };
}
