const activityWatchBaseUrl =
  import.meta.env.VITE_ACTIVITYWATCH_BASE_URL || 'http://localhost:5600'

const config = {
  isDevelopment: import.meta.env.DEV,
  requireConsent: import.meta.env.VITE_TARGET_BROWSER === 'firefox',
  activityWatch: {
    baseUrl: activityWatchBaseUrl,
  },
  heartbeat: {
    alarmName: 'heartbeat',
    intervalInSeconds: 60,
  },
}

export default config
