import { useState, useCallback } from 'react';
import type { SelectionMode } from '@/types';

interface UseChipSelectionOptions<T> {
  initialSelected?: T[];
  mode?: SelectionMode;
}

interface UseChipSelectionReturn<T> {
  selected: T[];
  toggle: (value: T) => void;
  select: (value: T) => void;
  deselect: (value: T) => void;
  clear: () => void;
  setSelected: (values: T[]) => void;
  isSelected: (value: T) => boolean;
}

/**
 * useChipSelection - Manages single/multi chip selection state
 * 
 * @param options - Configuration options
 * @param options.initialSelected - Initial selected values
 * @param options.mode - 'single' or 'multiple' selection mode
 */
export function useChipSelection<T>({
  initialSelected = [],
  mode = 'multiple',
}: UseChipSelectionOptions<T> = {}): UseChipSelectionReturn<T> {
  const [selected, setSelectedState] = useState<T[]>(initialSelected);

  const toggle = useCallback((value: T) => {
    setSelectedState((prev) => {
      const isCurrentlySelected = prev.includes(value);
      
      if (mode === 'single') {
        return isCurrentlySelected ? [] : [value];
      }
      
      return isCurrentlySelected
        ? prev.filter((v) => v !== value)
        : [...prev, value];
    });
  }, [mode]);

  const select = useCallback((value: T) => {
    setSelectedState((prev) => {
      if (mode === 'single') {
        return [value];
      }
      return prev.includes(value) ? prev : [...prev, value];
    });
  }, [mode]);

  const deselect = useCallback((value: T) => {
    setSelectedState((prev) => prev.filter((v) => v !== value));
  }, []);

  const clear = useCallback(() => {
    setSelectedState([]);
  }, []);

  const setSelected = useCallback((values: T[]) => {
    if (mode === 'single' && values.length > 1) {
      setSelectedState([values[0]]);
    } else {
      setSelectedState(values);
    }
  }, [mode]);

  const isSelected = useCallback((value: T) => {
    return selected.includes(value);
  }, [selected]);

  return {
    selected,
    toggle,
    select,
    deselect,
    clear,
    setSelected,
    isSelected,
  };
}
