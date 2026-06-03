const DEMO_LOADING_DELAY_MS = 400

function waitForDemoLoading(delay = DEMO_LOADING_DELAY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, delay)
  })
}

export { DEMO_LOADING_DELAY_MS, waitForDemoLoading }
