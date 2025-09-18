/*
  Privacy-compliant data handling pipeline
  Provides GDPR/CCPA compliant data processing, retention, and deletion
*/

import crypto from 'crypto'

// Data retention policies (in milliseconds)
export const RETENTION_POLICIES = {
  analytics_events: 90 * 24 * 60 * 60 * 1000, // 90 days
  attribution_data: 30 * 24 * 60 * 60 * 1000, // 30 days
  session_data: 7 * 24 * 60 * 60 * 1000, // 7 days
  error_logs: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const

// Data classification levels
export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}

// Privacy compliance frameworks
export enum ComplianceFramework {
  GDPR = 'gdpr',
  CCPA = 'ccpa',
  PIPEDA = 'pipeda',
  LGPD = 'lgpd',
}

interface DataProcessingRecord {
  id: string
  timestamp: number
  classification: DataClassification
  retention_period: number
  processing_purpose: string
  data_subject_id?: string // Hashed identifier
  compliance_framework: ComplianceFramework[]
  consent_given: boolean
  data_categories: string[]
}

interface DataDeletionRequest {
  id: string
  timestamp: number
  data_subject_id: string
  request_type: 'erasure' | 'portability' | 'rectification'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  reason?: string
}

class PrivacyPipeline {
  private processingRecords: Map<string, DataProcessingRecord> = new Map()
  private deletionRequests: Map<string, DataDeletionRequest> = new Map()
  private salt: string

  constructor(salt: string) {
    this.salt = salt
  }

  // Hash sensitive data for privacy protection
  hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data + this.salt).digest('hex')
  }

  // Record data processing activity
  recordDataProcessing(
    dataId: string,
    classification: DataClassification,
    processingPurpose: string,
    dataSubjectId?: string,
    dataCategories: string[] = [],
    complianceFrameworks: ComplianceFramework[] = [ComplianceFramework.GDPR]
  ): void {
    const record: DataProcessingRecord = {
      id: dataId,
      timestamp: Date.now(),
      classification,
      retention_period: this.getRetentionPeriod(classification),
      processing_purpose: processingPurpose,
      data_subject_id: dataSubjectId ? this.hashSensitiveData(dataSubjectId) : undefined,
      compliance_framework: complianceFrameworks,
      consent_given: this.checkConsent(dataSubjectId),
      data_categories: dataCategories,
    }

    this.processingRecords.set(dataId, record)
  }

  // Get retention period based on data classification
  private getRetentionPeriod(classification: DataClassification): number {
    switch (classification) {
      case DataClassification.PUBLIC:
        return RETENTION_POLICIES.analytics_events
      case DataClassification.INTERNAL:
        return RETENTION_POLICIES.session_data
      case DataClassification.CONFIDENTIAL:
        return RETENTION_POLICIES.attribution_data
      case DataClassification.RESTRICTED:
        return RETENTION_POLICIES.error_logs
      default:
        return RETENTION_POLICIES.analytics_events
    }
  }

  // Check if consent has been given for data processing
  private checkConsent(dataSubjectId?: string): boolean {
    if (!dataSubjectId) return false
    
    // In a real implementation, this would check against a consent database
    // For now, we'll assume consent is given if the user has interacted with the site
    return true
  }

  // Check if data should be retained based on retention policy
  shouldRetainData(dataId: string): boolean {
    const record = this.processingRecords.get(dataId)
    if (!record) return false

    const age = Date.now() - record.timestamp
    return age < record.retention_period
  }

  // Get data processing records for a specific data subject
  getDataSubjectRecords(dataSubjectId: string): DataProcessingRecord[] {
    const hashedId = this.hashSensitiveData(dataSubjectId)
    
    return Array.from(this.processingRecords.values()).filter(
      record => record.data_subject_id === hashedId
    )
  }

  // Request data deletion (GDPR Article 17 - Right to erasure)
  requestDataDeletion(
    dataSubjectId: string,
    requestType: 'erasure' | 'portability' | 'rectification' = 'erasure'
  ): string {
    const requestId = crypto.randomUUID()
    
    const request: DataDeletionRequest = {
      id: requestId,
      timestamp: Date.now(),
      data_subject_id: this.hashSensitiveData(dataSubjectId),
      request_type: requestType,
      status: 'pending',
    }

    this.deletionRequests.set(requestId, request)
    
    // In a real implementation, this would trigger an automated deletion process
    this.processDeletionRequest(requestId)
    
    return requestId
  }

  // Process data deletion request
  private async processDeletionRequest(requestId: string): Promise<void> {
    const request = this.deletionRequests.get(requestId)
    if (!request) return

    try {
      request.status = 'processing'
      
      // Find and delete all records for this data subject
      const records = this.getDataSubjectRecords(request.data_subject_id)
      
      for (const record of records) {
        // In a real implementation, this would delete from actual storage
        this.processingRecords.delete(record.id)
      }
      
      request.status = 'completed'
      console.log(`Data deletion completed for request ${requestId}`)
      
    } catch (error) {
      request.status = 'rejected'
      request.reason = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Data deletion failed for request ${requestId}:`, error)
    }
  }

  // Get data portability information (GDPR Article 20)
  getDataPortability(dataSubjectId: string): any {
    const records = this.getDataSubjectRecords(dataSubjectId)
    
    return {
      data_subject_id: this.hashSensitiveData(dataSubjectId),
      exported_at: new Date().toISOString(),
      records: records.map(record => ({
        id: record.id,
        timestamp: record.timestamp,
        processing_purpose: record.processing_purpose,
        data_categories: record.data_categories,
        // Note: Actual data would be exported here, but we only return metadata
        // for privacy reasons
      })),
    }
  }

  // Audit data processing activities
  auditDataProcessing(): {
    total_records: number
    records_by_classification: Record<DataClassification, number>
    records_by_purpose: Record<string, number>
    retention_compliance: number
  } {
    const records = Array.from(this.processingRecords.values())
    
    const recordsByClassification: Record<DataClassification, number> = {
      [DataClassification.PUBLIC]: 0,
      [DataClassification.INTERNAL]: 0,
      [DataClassification.CONFIDENTIAL]: 0,
      [DataClassification.RESTRICTED]: 0,
    }
    
    const recordsByPurpose: Record<string, number> = {}
    let retentionCompliant = 0
    
    records.forEach(record => {
      recordsByClassification[record.classification]++
      recordsByPurpose[record.processing_purpose] = 
        (recordsByPurpose[record.processing_purpose] || 0) + 1
      
      if (this.shouldRetainData(record.id)) {
        retentionCompliant++
      }
    })
    
    return {
      total_records: records.length,
      records_by_classification: recordsByClassification,
      records_by_purpose: recordsByPurpose,
      retention_compliance: records.length > 0 ? retentionCompliant / records.length : 1,
    }
  }

  // Clean up expired data
  cleanupExpiredData(): number {
    let cleanedCount = 0
    
    for (const [dataId, record] of this.processingRecords.entries()) {
      if (!this.shouldRetainData(dataId)) {
        this.processingRecords.delete(dataId)
        cleanedCount++
      }
    }
    
    return cleanedCount
  }

  // Get privacy compliance report
  getComplianceReport(): {
    framework_compliance: Record<ComplianceFramework, boolean>
    data_retention_compliance: number
    consent_compliance: number
    deletion_requests_processed: number
  } {
    const records = Array.from(this.processingRecords.values())
    const deletionRequests = Array.from(this.deletionRequests.values())
    
    // Check framework compliance
    const frameworkCompliance: Record<ComplianceFramework, boolean> = {
      [ComplianceFramework.GDPR]: records.every(r => r.compliance_framework.includes(ComplianceFramework.GDPR)),
      [ComplianceFramework.CCPA]: records.every(r => r.compliance_framework.includes(ComplianceFramework.CCPA)),
      [ComplianceFramework.PIPEDA]: records.every(r => r.compliance_framework.includes(ComplianceFramework.PIPEDA)),
      [ComplianceFramework.LGPD]: records.every(r => r.compliance_framework.includes(ComplianceFramework.LGPD)),
    }
    
    // Calculate retention compliance
    const retentionCompliant = records.filter(r => this.shouldRetainData(r.id)).length
    const dataRetentionCompliance = records.length > 0 ? retentionCompliant / records.length : 1
    
    // Calculate consent compliance
    const consentGiven = records.filter(r => r.consent_given).length
    const consentCompliance = records.length > 0 ? consentGiven / records.length : 1
    
    // Count processed deletion requests
    const processedDeletionRequests = deletionRequests.filter(r => r.status === 'completed').length
    
    return {
      framework_compliance: frameworkCompliance,
      data_retention_compliance: dataRetentionCompliance,
      consent_compliance: consentCompliance,
      deletion_requests_processed: processedDeletionRequests,
    }
  }
}

// Export singleton instance
export const privacyPipeline = new PrivacyPipeline(
  process.env.EVENTS_SALT || 'default-salt-change-in-production'
)

// Export types for use in components
export type { DataProcessingRecord, DataDeletionRequest }
