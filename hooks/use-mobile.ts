"use client"

import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const DEBOUNCE_DELAY = 150

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
  orientation: 'portrait' | 'landscape'
  screenWidth: number
  screenHeight: number
}

// Hook principal pour détecter le mobile
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    checkMobile()
    
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, DEBOUNCE_DELAY)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Pour éviter les erreurs d'hydratation, retourner false côté serveur
  if (!hasMounted) return false
  return isMobile
}

// Hook avec informations détaillées sur l'appareil
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    orientation: 'portrait',
    screenWidth: 0,
    screenHeight: 0,
  })
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)

    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      setDeviceInfo({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        isTouch: isTouchDevice,
        orientation: width > height ? 'landscape' : 'portrait',
        screenWidth: width,
        screenHeight: height,
      })
    }

    updateDeviceInfo()

    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDeviceInfo, DEBOUNCE_DELAY)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', updateDeviceInfo)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', updateDeviceInfo)
      clearTimeout(timeoutId)
    }
  }, [])

  if (!hasMounted) {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
      orientation: 'portrait',
      screenWidth: 0,
      screenHeight: 0,
    }
  }
  
  return deviceInfo
}

// Hook pour détecter la tablette
export function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = React.useState<boolean>(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    
    checkTablet()
    
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkTablet, DEBOUNCE_DELAY)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  if (!hasMounted) return false
  return isTablet
}

// Hook pour détecter l'orientation
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const updateOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    }
    
    updateOrientation()
    
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)
    
    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  if (!hasMounted) return 'portrait'
  return orientation
}

// Hook pour détecter les appareils tactiles
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = React.useState<boolean>(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouch(isTouchDevice)
  }, [])

  if (!hasMounted) return false
  return isTouch
}

// Hook pour obtenir la taille de l'écran
export function useScreenSize(): { width: number; height: number } {
  const [screenSize, setScreenSize] = React.useState({ width: 0, height: 0 })
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    
    updateScreenSize()
    
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateScreenSize, DEBOUNCE_DELAY)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  if (!hasMounted) return { width: 0, height: 0 }
  return screenSize
}

// Hook responsive avec breakpoints personnalisables
export function useBreakpoint(breakpoints?: { mobile?: number; tablet?: number; desktop?: number }) {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [hasMounted, setHasMounted] = React.useState(false)

  const config = {
    mobile: breakpoints?.mobile ?? MOBILE_BREAKPOINT,
    tablet: breakpoints?.tablet ?? TABLET_BREAKPOINT,
  }

  React.useEffect(() => {
    setHasMounted(true)
    
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width < config.mobile) {
        setBreakpoint('mobile')
      } else if (width < config.tablet) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }
    
    updateBreakpoint()
    
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateBreakpoint, DEBOUNCE_DELAY)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [config.mobile, config.tablet])

  if (!hasMounted) return 'desktop'
  return breakpoint
}

// Hook pour les media queries CSS
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)
    
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQuery.addEventListener('change', handler)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  if (!hasMounted) return false
  return matches
}

// Hook pour détecter la préférence de réduction de mouvement
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

// Hook pour détecter le thème système (dark/light)
export function usePrefersColorScheme(): 'light' | 'dark' | 'no-preference' {
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark' | 'no-preference'>('no-preference')
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)')
    
    const updateColorScheme = () => {
      if (darkModeQuery.matches) {
        setColorScheme('dark')
      } else if (lightModeQuery.matches) {
        setColorScheme('light')
      } else {
        setColorScheme('no-preference')
      }
    }
    
    updateColorScheme()
    
    darkModeQuery.addEventListener('change', updateColorScheme)
    lightModeQuery.addEventListener('change', updateColorScheme)
    
    return () => {
      darkModeQuery.removeEventListener('change', updateColorScheme)
      lightModeQuery.removeEventListener('change', updateColorScheme)
    }
  }, [])

  if (!hasMounted) return 'no-preference'
  return colorScheme
}

// Composant utilitaire pour le rendu conditionnel responsive
export function Responsive({
  mobile,
  tablet,
  desktop,
  children,
}: {
  mobile?: React.ReactNode
  tablet?: React.ReactNode
  desktop?: React.ReactNode
  children?: React.ReactNode
}) {
  const breakpoint = useBreakpoint()
  
  if (breakpoint === 'mobile' && mobile) return <>{mobile}</>
  if (breakpoint === 'tablet' && tablet) return <>{tablet}</>
  if (breakpoint === 'desktop' && desktop) return <>{desktop}</>
  
  return <>{children}</>
}

// Composant utilitaire pour afficher uniquement sur mobile
export function OnlyMobile({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  if (!isMobile) return null
  return <>{children}</>
}

// Composant utilitaire pour afficher uniquement sur desktop
export function OnlyDesktop({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  if (isMobile) return null
  return <>{children}</>
}

// Composant utilitaire pour afficher sur mobile et tablette
export function OnlyMobileOrTablet({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  if (!isMobile && !isTablet) return null
  return <>{children}</>
}

export default useIsMobile