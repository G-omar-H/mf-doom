import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  successMessage?: string
  errorMessage?: string
}

export function useOptimisticUpdate<T extends { id: string }>(
  items: T[],
  setItems: React.Dispatch<React.SetStateAction<T[]>>
) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const updateItem = useCallback(
    async (
      itemId: string,
      updateFn: (item: T) => T,
      apiCall: () => Promise<any>,
      options: OptimisticUpdateOptions<T> = {}
    ) => {
      const { onSuccess, onError, successMessage, errorMessage } = options

      // Find the original item
      const originalItem = items.find(item => item.id === itemId)
      if (!originalItem) return

      // Optimistically update the UI
      const updatedItem = updateFn(originalItem)
      setItems(prevItems =>
        prevItems.map(item => (item.id === itemId ? updatedItem : item))
      )

      // Show success message immediately
      if (successMessage) {
        toast.success(successMessage)
      }

      setLoading(prev => ({ ...prev, [itemId]: true }))

      try {
        // Make the API call
        const result = await apiCall()
        
        // Handle success
        onSuccess?.(updatedItem)
        
        return result
      } catch (error) {
        // Revert the optimistic update on error
        setItems(prevItems =>
          prevItems.map(item => (item.id === itemId ? originalItem : item))
        )

        // Show error message
        const message = errorMessage || 'Operation failed'
        toast.error(message)
        
        onError?.(error)
        throw error
      } finally {
        setLoading(prev => ({ ...prev, [itemId]: false }))
      }
    },
    [items, setItems]
  )

  const deleteItem = useCallback(
    async (
      itemId: string,
      apiCall: () => Promise<any>,
      options: OptimisticUpdateOptions<T> = {}
    ) => {
      const { onSuccess, onError, successMessage = 'Item deleted successfully', errorMessage } = options

      // Find the original item
      const originalItem = items.find(item => item.id === itemId)
      if (!originalItem) return

      // Optimistically remove from UI
      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
      toast.success(successMessage)

      setLoading(prev => ({ ...prev, [itemId]: true }))

      try {
        // Make the API call
        const result = await apiCall()
        
        onSuccess?.(originalItem)
        return result
      } catch (error) {
        // Revert the deletion on error
        setItems(prevItems => [...prevItems, originalItem])

        const message = errorMessage || 'Delete failed'
        toast.error(message)
        
        onError?.(error)
        throw error
      } finally {
        setLoading(prev => ({ ...prev, [itemId]: false }))
      }
    },
    [items, setItems]
  )

  const addItem = useCallback(
    async (
      newItem: Omit<T, 'id'>,
      apiCall: () => Promise<{ id: string } & T>,
      options: OptimisticUpdateOptions<T> = {}
    ) => {
      const { onSuccess, onError, successMessage = 'Item added successfully', errorMessage } = options

      // Generate a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticItem = { ...newItem, id: tempId } as T

      // Optimistically add to UI
      setItems(prevItems => [optimisticItem, ...prevItems])
      toast.success(successMessage)

      setLoading(prev => ({ ...prev, [tempId]: true }))

      try {
        // Make the API call
        const result = await apiCall()
        
        // Replace the temporary item with the real one
        setItems(prevItems =>
          prevItems.map(item => (item.id === tempId ? result : item))
        )
        
        onSuccess?.(result)
        return result
      } catch (error) {
        // Remove the optimistic item on error
        setItems(prevItems => prevItems.filter(item => item.id !== tempId))

        const message = errorMessage || 'Add operation failed'
        toast.error(message)
        
        onError?.(error)
        throw error
      } finally {
        setLoading(prev => ({ ...prev, [tempId]: false }))
      }
    },
    [setItems]
  )

  const bulkUpdate = useCallback(
    async (
      itemIds: string[],
      updateFn: (item: T) => T,
      apiCall: () => Promise<any>,
      options: OptimisticUpdateOptions<T[]> = {}
    ) => {
      const { onSuccess, onError, successMessage, errorMessage } = options

      // Store original items for potential revert
      const originalItems = items.filter(item => itemIds.includes(item.id))
      
      // Optimistically update all items
      setItems(prevItems =>
        prevItems.map(item => 
          itemIds.includes(item.id) ? updateFn(item) : item
        )
      )

      if (successMessage) {
        toast.success(successMessage)
      }

      // Set loading state for all items
      const loadingStates = itemIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
      setLoading(prev => ({ ...prev, ...loadingStates }))

      try {
        const result = await apiCall()
        onSuccess?.(originalItems)
        return result
      } catch (error) {
        // Revert all changes on error
        setItems(prevItems =>
          prevItems.map(item => {
            const originalItem = originalItems.find(orig => orig.id === item.id)
            return originalItem || item
          })
        )

        const message = errorMessage || 'Bulk operation failed'
        toast.error(message)
        
        onError?.(error)
        throw error
      } finally {
        // Clear loading state for all items
        const clearedLoadingStates = itemIds.reduce((acc, id) => ({ ...acc, [id]: false }), {})
        setLoading(prev => ({ ...prev, ...clearedLoadingStates }))
      }
    },
    [items, setItems]
  )

  return {
    updateItem,
    deleteItem,
    addItem,
    bulkUpdate,
    loading
  }
} 