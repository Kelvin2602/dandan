import { useState, useCallback } from 'react';

/**
 * Custom hook để manage modal state và form operations
 * Reusable cho tất cả admin forms (Projects, News, etc.)
 */
export const useFormModal = <T>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = useCallback((item?: T) => {
    setEditingItem(item || null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingItem(null);
    setIsSubmitting(false);
  }, []);

  const handleSubmit = useCallback(async (
    submitFn: (data: any) => Promise<void>,
    data: any
  ) => {
    try {
      setIsSubmitting(true);
      await submitFn(data);
      closeModal();
    } catch (error) {
      console.error('Form submission failed:', error);
      throw error; // Re-throw để component có thể handle
    } finally {
      setIsSubmitting(false);
    }
  }, [closeModal]);

  return {
    isOpen,
    editingItem,
    isSubmitting,
    openModal,
    closeModal,
    handleSubmit
  };
};