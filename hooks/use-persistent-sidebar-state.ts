"use client"

import * as React from "react"

const SIDEBAR_STORAGE_KEY = "ds-sidebar-open"
const SIDEBAR_STORAGE_EVENT = "ds-sidebar-open-change"

type UsePersistentSidebarStateOptions = {
  defaultOpen?: boolean
}

function usePersistentSidebarState({
  defaultOpen = true,
}: UsePersistentSidebarStateOptions = {}) {
  const getSnapshot = React.useCallback(() => {
    const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)

    if (storedValue === "true" || storedValue === "false") {
      return storedValue === "true"
    }

    return defaultOpen
  }, [defaultOpen])

  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SIDEBAR_STORAGE_KEY) {
        onStoreChange()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(SIDEBAR_STORAGE_EVENT, onStoreChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(SIDEBAR_STORAGE_EVENT, onStoreChange)
    }
  }, [])

  const open = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => defaultOpen
  )

  const setOpen = React.useCallback((nextOpen: boolean) => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextOpen))
    window.dispatchEvent(new Event(SIDEBAR_STORAGE_EVENT))
  }, [])

  return {
    open,
    setOpen,
    isLoaded: true,
  }
}

export { usePersistentSidebarState }
