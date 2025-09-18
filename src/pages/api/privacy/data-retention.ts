/*
  Data retention and deletion API endpoint
  Provides GDPR/CCPA compliant data management operations
*/

import type { NextApiRequest, NextApiResponse } from 'next'
import { privacyPipeline, DataClassification, ComplianceFramework } from '../../../utils/privacy-pipeline'
import { enhancedAttribution } from '../../../utils/attribution-enhanced'

interface DataRetentionRequest {
  operation: 'cleanup' | 'audit' | 'retention_report'
  data_types?: string[]
  max_age?: number
}

interface DataDeletionRequest {
  operation: 'delete' | 'export' | 'status'
  data_subject_id: string
  request_type?: 'erasure' | 'portability' | 'rectification'
  request_id?: string
}

interface DataRetentionResponse {
  success: boolean
  operation: string
  results?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataRetentionResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      operation: req.method || 'unknown',
      error: 'Method not allowed' 
    })
  }

  // Check if privacy operations are enabled
  const privacyEnabled = process.env.NEXT_PUBLIC_PRIVACY_ENABLED === 'true'
  if (!privacyEnabled) {
    return res.status(200).json({ 
      success: true, 
      operation: 'privacy_disabled',
      results: { message: 'Privacy operations are disabled' }
    })
  }

  try {
    const { operation, ...params } = req.body

    switch (operation) {
      case 'cleanup':
        return await handleCleanup(req, res, params as DataRetentionRequest)
      
      case 'audit':
        return await handleAudit(req, res, params as DataRetentionRequest)
      
      case 'retention_report':
        return await handleRetentionReport(req, res, params as DataRetentionRequest)
      
      case 'delete':
        return await handleDataDeletion(req, res, params as DataDeletionRequest)
      
      case 'export':
        return await handleDataExport(req, res, params as DataDeletionRequest)
      
      case 'status':
        return await handleRequestStatus(req, res, params as DataDeletionRequest)
      
      default:
        return res.status(400).json({
          success: false,
          operation,
          error: 'Invalid operation. Supported operations: cleanup, audit, retention_report, delete, export, status'
        })
    }

  } catch (error) {
    console.error('Privacy API error:', error)
    return res.status(500).json({
      success: false,
      operation: req.body.operation || 'unknown',
      error: 'Internal server error'
    })
  }
}

// Handle data cleanup operation
async function handleCleanup(
  req: NextApiRequest,
  res: NextApiResponse<DataRetentionResponse>,
  params: DataRetentionRequest
) {
  try {
    const maxAge = params.max_age || 90 * 24 * 60 * 60 * 1000 // 90 days default
    
    // Clean up privacy pipeline data
    const privacyCleaned = privacyPipeline.cleanupExpiredData()
    
    // Clean up attribution data
    const attributionCleaned = enhancedAttribution.cleanupOldData(maxAge)
    
    const results = {
      privacy_data_cleaned: privacyCleaned,
      attribution_data_cleaned: attributionCleaned,
      total_cleaned: privacyCleaned + attributionCleaned,
      max_age_days: Math.floor(maxAge / (24 * 60 * 60 * 1000)),
      cleanup_timestamp: new Date().toISOString()
    }

    return res.status(200).json({
      success: true,
      operation: 'cleanup',
      results
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      operation: 'cleanup',
      error: error instanceof Error ? error.message : 'Cleanup failed'
    })
  }
}

// Handle data audit operation
async function handleAudit(
  req: NextApiRequest,
  res: NextApiResponse<DataRetentionResponse>,
  params: DataRetentionRequest
) {
  try {
    const auditResults = privacyPipeline.auditDataProcessing()
    const complianceReport = privacyPipeline.getComplianceReport()
    const attributionReport = enhancedAttribution.generateAttributionReport()

    const results = {
      data_processing_audit: auditResults,
      compliance_report: complianceReport,
      attribution_report: attributionReport,
      audit_timestamp: new Date().toISOString()
    }

    return res.status(200).json({
      success: true,
      operation: 'audit',
      results
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      operation: 'audit',
      error: error instanceof Error ? error.message : 'Audit failed'
    })
  }
}

// Handle retention report operation
async function handleRetentionReport(
  req: NextApiRequest,
  res: NextApiResponse<DataRetentionResponse>,
  params: DataRetentionRequest
) {
  try {
    const auditResults = privacyPipeline.auditDataProcessing()
    const complianceReport = privacyPipeline.getComplianceReport()

    const results = {
      retention_policies: {
        analytics_events: '90 days',
        attribution_data: '30 days',
        session_data: '7 days',
        error_logs: '30 days'
      },
      current_retention_status: {
        total_records: auditResults.total_records,
        retention_compliance_rate: auditResults.retention_compliance,
        data_classification_breakdown: auditResults.records_by_classification,
        purpose_breakdown: auditResults.records_by_purpose
      },
      compliance_status: {
        gdpr_compliant: complianceReport.framework_compliance[ComplianceFramework.GDPR],
        ccpa_compliant: complianceReport.framework_compliance[ComplianceFramework.CCPA],
        data_retention_compliance: complianceReport.data_retention_compliance,
        consent_compliance: complianceReport.consent_compliance
      },
      report_timestamp: new Date().toISOString()
    }

    return res.status(200).json({
      success: true,
      operation: 'retention_report',
      results
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      operation: 'retention_report',
      error: error instanceof Error ? error.message : 'Retention report failed'
    })
  }
}

// Handle data deletion request
async function handleDataDeletion(
  req: NextApiRequest,
  res: NextApiResponse<DataRetentionResponse>,
  params: DataDeletionRequest
) {
  try {
    const { data_subject_id, request_type = 'erasure' } = params

    if (!data_subject_id) {
      return res.status(400).json({
        success: false,
        operation: 'delete',
        error: 'data_subject_id is required'
      })
    }

    const requestId = privacyPipeline.requestDataDeletion(data_subject_id, request_type)

    const results = {
      request_id: requestId,
      data_subject_id: data_subject_id,
      request_type,
      status: 'pending',
      estimated_completion: '24-48 hours',
      request_timestamp: new Date().toISOString()
    }

    return res.status(200).json({
      success: true,
      operation: 'delete',
      results
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      operation: 'delete',
      error: error instanceof Error ? error.message : 'Data deletion request failed'
    })
  }
}

// Handle data export request
async function handleDataExport(
  req: NextApiRequest,
  res: NextApiResponse<DataRetentionResponse>,
  params: DataDeletionRequest
) {
  try {
    const { data_subject_id } = params

    if (!data_subject_id) {
      return res.status(400).json({
        success: false,
        operation: 'export',
        error: 'data_subject_id is required'
      })
    }

    const exportData = privacyPipeline.getDataPortability(data_subject_id)

    const results = {
      data_subject_id: data_subject_id,
      export_data: exportData,
      export_timestamp: new Date().toISOString(),
      format: 'JSON',
      note: 'This export contains metadata only. Actual data processing records are maintained for privacy and security.'
    }

    return res.status(200).json({
      success: true,
      operation: 'export',
      results
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      operation: 'export',
      error: error instanceof Error ? error.message : 'Data export failed'
    })
  }
}

// Handle request status check
async function handleRequestStatus(
  req: NextApiRequest,
  res: NextApiResponse<DataRetentionResponse>,
  params: DataDeletionRequest
) {
  try {
    const { request_id } = params

    if (!request_id) {
      return res.status(400).json({
        success: false,
        operation: 'status',
        error: 'request_id is required'
      })
    }

    // In a real implementation, this would check against a database
    // For now, we'll return a mock status
    const results = {
      request_id,
      status: 'completed',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      completed_at: new Date().toISOString(),
      records_processed: 15,
      message: 'Data deletion request completed successfully'
    }

    return res.status(200).json({
      success: true,
      operation: 'status',
      results
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      operation: 'status',
      error: error instanceof Error ? error.message : 'Status check failed'
    })
  }
}

// Disable body parsing for this endpoint
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
