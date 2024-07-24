import { useState, useCallback } from "react";

type StudentId = string;

function useSelected(initialState: StudentId[] = []): {
  selectedIds: StudentId[];
  toggleSelected: (id: StudentId) => void;
  clearSelected: () => void;
  appendAll: (students: { id: StudentId }[]) => void;
  isSelected: (id: StudentId) => boolean;
  selectedCount: () => number;
} {
  const [selectedIds, setSelectedIds] = useState<StudentId[]>(initialState);

  const toggleSelected = useCallback((id: StudentId) => {
    setSelectedIds((currentSelected) =>
      currentSelected.includes(id)
        ? currentSelected.filter((selectedId) => selectedId !== id)
        : [...currentSelected, id]
    );
  }, []);

  const clearSelected = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const appendAll = useCallback((students: { id: StudentId }[]) => {
    setSelectedIds(students.map((student) => student.id));
  }, []);

  const isSelected = useCallback(
    (id: StudentId) => {
      return selectedIds.includes(id);
    },
    [selectedIds]
  );

  const selectedCount = useCallback(() => {
    return selectedIds.length;
  }, [selectedIds]);

  return {
    selectedIds,
    toggleSelected,
    clearSelected,
    appendAll,
    isSelected,
    selectedCount,
  };
}

export default useSelected;
