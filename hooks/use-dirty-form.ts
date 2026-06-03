"use client"

import * as React from "react"

function shallowEqualRecord<TValues extends Record<string, unknown>>(
  currentValues: TValues,
  baselineValues: TValues
) {
  return (Object.keys(baselineValues) as Array<keyof TValues>).every(
    (key) => currentValues[key] === baselineValues[key]
  )
}

type UseDirtyFormOptions<TValues extends Record<string, unknown>> = {
  initialValues: TValues
  values: TValues
  isEqual?: (currentValues: TValues, baselineValues: TValues) => boolean
}

function useDirtyForm<TValues extends Record<string, unknown>>({
  initialValues,
  values,
  isEqual = shallowEqualRecord,
}: UseDirtyFormOptions<TValues>) {
  const [baselineValues, setBaselineValues] =
    React.useState<TValues>(initialValues)
  const isDirty = !isEqual(values, baselineValues)

  const resetBaseline = React.useCallback((nextValues: TValues = values) => {
    setBaselineValues(nextValues)
  }, [values])

  const resetToInitial = React.useCallback(() => {
    setBaselineValues(initialValues)
  }, [initialValues])

  const hasChanged = React.useCallback(
    (nextValues: TValues) => !isEqual(nextValues, baselineValues),
    [baselineValues, isEqual]
  )

  return {
    baselineValues,
    hasChanged,
    isDirty,
    resetBaseline,
    resetToInitial,
  }
}

export { useDirtyForm }
export type { UseDirtyFormOptions }
