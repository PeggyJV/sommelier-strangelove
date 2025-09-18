/*
  Analytics hook for UI interactions and tooltip tracking
  Tracks user interactions with tooltips, modals, and other UI elements
*/

import { useCallback } from 'react'
import { serverAnalytics } from '../utils/analytics-server'

interface UIAnalyticsProps {
  enabled?: boolean
  trackTooltips?: boolean
  trackModals?: boolean
  trackButtons?: boolean
  trackNavigation?: boolean
}

export function useAnalyticsUI({
  enabled = true,
  trackTooltips = true,
  trackModals = true,
  trackButtons = true,
  trackNavigation = true,
}: UIAnalyticsProps = {}) {
  
  // Track tooltip interactions
  const trackTooltipOpen = useCallback(async (tooltipId: string, trigger: 'hover' | 'click' | 'focus', context?: Record<string, any>) => {
    if (!enabled || !trackTooltips) return

    try {
      await serverAnalytics.tooltipOpened(tooltipId, {
        trigger,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track tooltip open:', error)
    }
  }, [enabled, trackTooltips])

  const trackTooltipClose = useCallback(async (tooltipId: string, reason: 'hover_out' | 'click_outside' | 'escape' | 'timeout', context?: Record<string, any>) => {
    if (!enabled || !trackTooltips) return

    try {
      await serverAnalytics.track('tooltip_closed', {
        tooltip_id: tooltipId,
        close_reason: reason,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track tooltip close:', error)
    }
  }, [enabled, trackTooltips])

  // Track modal interactions
  const trackModalOpen = useCallback(async (modalId: string, trigger: 'button' | 'link' | 'automatic', context?: Record<string, any>) => {
    if (!enabled || !trackModals) return

    try {
      await serverAnalytics.track('modal_opened', {
        modal_id: modalId,
        trigger,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track modal open:', error)
    }
  }, [enabled, trackModals])

  const trackModalClose = useCallback(async (modalId: string, reason: 'close_button' | 'backdrop' | 'escape' | 'success' | 'error', context?: Record<string, any>) => {
    if (!enabled || !trackModals) return

    try {
      await serverAnalytics.track('modal_closed', {
        modal_id: modalId,
        close_reason: reason,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track modal close:', error)
    }
  }, [enabled, trackModals])

  // Track button interactions
  const trackButtonClick = useCallback(async (buttonId: string, buttonType: 'primary' | 'secondary' | 'tertiary' | 'danger', context?: Record<string, any>) => {
    if (!enabled || !trackButtons) return

    try {
      await serverAnalytics.track('button_clicked', {
        button_id: buttonId,
        button_type: buttonType,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track button click:', error)
    }
  }, [enabled, trackButtons])

  // Track navigation interactions
  const trackNavigation = useCallback(async (fromPage: string, toPage: string, method: 'link' | 'button' | 'back' | 'forward', context?: Record<string, any>) => {
    if (!enabled || !trackNavigation) return

    try {
      await serverAnalytics.track('navigation', {
        from_page: fromPage,
        to_page: toPage,
        navigation_method: method,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track navigation:', error)
    }
  }, [enabled, trackNavigation])

  // Track accordion interactions
  const trackAccordionToggle = useCallback(async (accordionId: string, isOpen: boolean, context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('accordion_toggled', {
        accordion_id: accordionId,
        is_open: isOpen,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track accordion toggle:', error)
    }
  }, [enabled])

  // Track tab interactions
  const trackTabSwitch = useCallback(async (tabGroupId: string, fromTab: string, toTab: string, context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('tab_switched', {
        tab_group_id: tabGroupId,
        from_tab: fromTab,
        to_tab: toTab,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track tab switch:', error)
    }
  }, [enabled])

  // Track dropdown interactions
  const trackDropdownOpen = useCallback(async (dropdownId: string, trigger: 'click' | 'hover', context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('dropdown_opened', {
        dropdown_id: dropdownId,
        trigger,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track dropdown open:', error)
    }
  }, [enabled])

  const trackDropdownClose = useCallback(async (dropdownId: string, reason: 'selection' | 'click_outside' | 'escape', context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('dropdown_closed', {
        dropdown_id: dropdownId,
        close_reason: reason,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track dropdown close:', error)
    }
  }, [enabled])

  // Track copy to clipboard actions
  const trackCopyToClipboard = useCallback(async (contentType: 'address' | 'tx_hash' | 'amount' | 'text', content: string, context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('copy_to_clipboard', {
        content_type: contentType,
        content_length: content.length,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track copy to clipboard:', error)
    }
  }, [enabled])

  // Track scroll interactions
  const trackScroll = useCallback(async (scrollDirection: 'up' | 'down', scrollPosition: number, context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('scroll', {
        scroll_direction: scrollDirection,
        scroll_position: scrollPosition,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track scroll:', error)
    }
  }, [enabled])

  // Track viewport changes
  const trackViewportChange = useCallback(async (viewportSize: { width: number; height: number }, deviceType: 'mobile' | 'tablet' | 'desktop', context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('viewport_changed', {
        viewport_width: viewportSize.width,
        viewport_height: viewportSize.height,
        device_type: deviceType,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track viewport change:', error)
    }
  }, [enabled])

  // Track focus interactions
  const trackFocus = useCallback(async (elementId: string, elementType: 'input' | 'button' | 'link' | 'select', context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('element_focused', {
        element_id: elementId,
        element_type: elementType,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track focus:', error)
    }
  }, [enabled])

  // Track blur interactions
  const trackBlur = useCallback(async (elementId: string, elementType: 'input' | 'button' | 'link' | 'select', context?: Record<string, any>) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('element_blurred', {
        element_id: elementId,
        element_type: elementType,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track blur:', error)
    }
  }, [enabled])

  return {
    // Tooltip tracking
    trackTooltipOpen,
    trackTooltipClose,
    
    // Modal tracking
    trackModalOpen,
    trackModalClose,
    
    // Button tracking
    trackButtonClick,
    
    // Navigation tracking
    trackNavigation,
    
    // UI component tracking
    trackAccordionToggle,
    trackTabSwitch,
    trackDropdownOpen,
    trackDropdownClose,
    
    // User action tracking
    trackCopyToClipboard,
    trackScroll,
    trackViewportChange,
    trackFocus,
    trackBlur,
  }
}

// Hook for tracking page-specific UI interactions
export function useAnalyticsPageUI(pageId: string) {
  const trackPageInteraction = useCallback(async (interactionType: string, context?: Record<string, any>) => {
    try {
      await serverAnalytics.track('page_interaction', {
        page_id: pageId,
        interaction_type: interactionType,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track page interaction:', error)
    }
  }, [pageId])

  const trackPageSectionView = useCallback(async (sectionId: string, context?: Record<string, any>) => {
    try {
      await serverAnalytics.track('page_section_viewed', {
        page_id: pageId,
        section_id: sectionId,
        ...context,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track page section view:', error)
    }
  }, [pageId])

  return {
    trackPageInteraction,
    trackPageSectionView,
  }
}
