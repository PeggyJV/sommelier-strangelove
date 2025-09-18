/*
  Consent management banner for analytics and marketing pixels
  Provides GDPR/CCPA compliant consent collection and management
*/

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Link,
  useColorModeValue,
  Collapse,
  IconButton,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from '@chakra-ui/icons'

interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

interface ConsentBannerProps {
  onConsentChange: (preferences: ConsentPreferences) => void
  onAcceptAll: () => void
  onRejectAll: () => void
}

const CONSENT_STORAGE_KEY = 'somm_analytics_consent'
const CONSENT_VERSION = '1.0'

export function ConsentBanner({ onConsentChange, onAcceptAll, onRejectAll }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  })

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'gray.200')

  useEffect(() => {
    // Check if consent has already been given
    const existingConsent = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!existingConsent) {
      setIsVisible(true)
    }
  }, [])

  const handlePreferenceChange = (key: keyof ConsentPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
  }

  const handleSavePreferences = () => {
    const consentData = {
      preferences,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    }
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData))
    onConsentChange(preferences)
    setIsVisible(false)
  }

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    
    const consentData = {
      preferences: allAccepted,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    }
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData))
    onConsentChange(allAccepted)
    onAcceptAll()
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    
    const consentData = {
      preferences: onlyNecessary,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    }
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData))
    onConsentChange(onlyNecessary)
    onRejectAll()
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      p={4}
      zIndex={9999}
      boxShadow="lg"
    >
      <VStack spacing={4} align="stretch" maxW="4xl" mx="auto">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={2} flex={1}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Privacy & Analytics Preferences
            </Text>
            <Text fontSize="sm" color={textColor} opacity={0.8}>
              We use cookies and analytics to improve your experience. Choose your preferences below.
            </Text>
          </VStack>
          <IconButton
            aria-label={isExpanded ? 'Collapse preferences' : 'Expand preferences'}
            icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </HStack>

        {/* Expanded Preferences */}
        <Collapse in={isExpanded}>
          <VStack spacing={4} align="stretch" p={4} bg={useColorModeValue('gray.50', 'gray.700')} rounded="md">
            {/* Necessary Cookies */}
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <VStack align="start" spacing={1}>
                <FormLabel mb={0} fontWeight="semibold">
                  Necessary Cookies
                </FormLabel>
                <Text fontSize="sm" color={textColor} opacity={0.8}>
                  Required for basic website functionality
                </Text>
              </VStack>
              <Switch isChecked={preferences.necessary} isDisabled />
            </FormControl>

            {/* Analytics Cookies */}
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <VStack align="start" spacing={1}>
                <FormLabel mb={0} fontWeight="semibold">
                  Analytics Cookies
                </FormLabel>
                <Text fontSize="sm" color={textColor} opacity={0.8}>
                  Help us understand how you use our website
                </Text>
              </VStack>
              <Switch
                isChecked={preferences.analytics}
                onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
              />
            </FormControl>

            {/* Marketing Cookies */}
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <VStack align="start" spacing={1}>
                <FormLabel mb={0} fontWeight="semibold">
                  Marketing Cookies
                </FormLabel>
                <Text fontSize="sm" color={textColor} opacity={0.8}>
                  Used to show you relevant ads and measure campaign effectiveness
                </Text>
              </VStack>
              <Switch
                isChecked={preferences.marketing}
                onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
              />
            </FormControl>

            {/* Privacy Links */}
            <HStack spacing={4} pt={2}>
              <Link href="/privacy" fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Privacy Policy
              </Link>
              <Link href="/cookies" fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Cookie Policy
              </Link>
              <HStack spacing={1}>
                <InfoIcon boxSize={3} color="gray.500" />
                <Text fontSize="sm" color="gray.500">
                  You can change these preferences anytime in your browser settings
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Collapse>

        {/* Action Buttons */}
        <HStack spacing={3} justify="center">
          <Button variant="outline" size="sm" onClick={handleRejectAll}>
            Reject All
          </Button>
          <Button variant="outline" size="sm" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
          <Button colorScheme="blue" size="sm" onClick={handleAcceptAll}>
            Accept All
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

// Hook to get current consent preferences
export function useConsentPreferences(): ConsentPreferences | null {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null)

  useEffect(() => {
    const consentData = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (consentData) {
      try {
        const parsed = JSON.parse(consentData)
        setPreferences(parsed.preferences)
      } catch {
        setPreferences(null)
      }
    }
  }, [])

  return preferences
}

// Utility function to check if specific consent is given
export function hasConsent(type: keyof ConsentPreferences): boolean {
  const consentData = localStorage.getItem(CONSENT_STORAGE_KEY)
  if (!consentData) return false

  try {
    const parsed = JSON.parse(consentData)
    return parsed.preferences[type] === true
  } catch {
    return false
  }
}
