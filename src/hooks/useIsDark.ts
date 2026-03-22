import { useTheme } from './useTheme'

export function useIsDark() {
    const { theme } = useTheme()
    return theme === 'dark'
}
