import { useState, useEffect } from 'react'

interface LocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Géolocalisation non supportée', loading: false }))
      return
    }

    const success = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      })
    }

    const error = (err: GeolocationPositionError) => {
      setState(prev => ({ ...prev, error: err.message, loading: false }))
    }

    navigator.geolocation.getCurrentPosition(success, error, options)
  }, [options])

  return state
}