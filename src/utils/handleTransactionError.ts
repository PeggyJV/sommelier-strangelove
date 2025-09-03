export type TransactionType =
  | "deposit"
  | "withdraw"
  | "approve"
  | "bond"
  | "claim"
  | "bridge"

export type TransactionErrorType =
  | "USER_REJECTED"
  | "GAS_LIMIT_ERROR"
  | "SPAM_FILTER_ERROR"
  | "OTHER"

export interface TransactionError {
  type: TransactionErrorType
  message: string
  originalError: Error
}

export interface TransactionErrorContext {
  vaultName: string
  tokenSymbol?: string
  transactionType: TransactionType
  value?: number
  chainId?: number
}

/**
 * Normalizes transaction errors to handle user rejections consistently
 */
export const handleTransactionError = (
  error: Error,
  context: TransactionErrorContext
): TransactionError => {
  // Check for user rejection patterns
  const anyErr: any = error as any
  const combined = [
    anyErr?.message,
    anyErr?.shortMessage,
    anyErr?.cause?.message,
    anyErr?.cause?.shortMessage,
    anyErr?.walk?.()?.message,
  ]
    .filter(Boolean)
    .join(" | ")

  const isUserRejected =
    anyErr?.code === 4001 ||
    combined.includes("User rejected") ||
    combined.includes("User denied") ||
    combined.includes("MetaMask Tx Signature: User denied") ||
    combined.includes("User rejected the request")

  if (isUserRejected) {
    return {
      type: "USER_REJECTED",
      message: "Transaction was rejected by user",
      originalError: error,
    }
  }

  // Check for spam filter errors
  if (
    error.message.includes("spam filter") ||
    error.message.includes("not been authorized")
  ) {
    return {
      type: "SPAM_FILTER_ERROR",
      message: "Transaction blocked by spam filter",
      originalError: error,
    }
  }

  // Check for gas limit errors
  if (error.message === "GAS_LIMIT_ERROR") {
    return {
      type: "GAS_LIMIT_ERROR",
      message: "Gas limit exceeded",
      originalError: error,
    }
  }

  // Default to other error
  return {
    type: "OTHER",
    message: error.message,
    originalError: error,
  }
}

/**
 * Generates consistent toast messages for transaction errors
 */
export const getTransactionErrorToast = (
  error: TransactionError,
  context: TransactionErrorContext
) => {
  const { vaultName, transactionType } = context

  switch (error.type) {
    case "USER_REJECTED":
      return {
        heading: `${vaultName} ${getTransactionTypeDisplay(
          transactionType
        )}`,
        body: `Transaction was rejected`,
        status: "info" as const,
        showPopupGuidance: true,
      }

    case "SPAM_FILTER_ERROR":
      return {
        heading: "Transaction Blocked",
        body: `Your transaction was blocked by MetaMask's spam filter. Please try:
• Clearing MetaMask activity data
• Waiting a few minutes before retrying
• Using a different amount`,
        status: "warning" as const,
      }

    case "GAS_LIMIT_ERROR":
      return {
        heading: "Transaction not submitted",
        body: `Your transaction has failed. If it does not work after waiting some time and retrying, please contact support.`,
        status: "info" as const,
      }

    default:
      return {
        heading: `${vaultName} ${getTransactionTypeDisplay(
          transactionType
        )}`,
        body: error.message,
        status: "error" as const,
      }
  }
}

/**
 * Converts transaction type to display format
 */
const getTransactionTypeDisplay = (type: TransactionType): string => {
  switch (type) {
    case "deposit":
      return "Deposit"
    case "withdraw":
      return "Withdraw"
    case "approve":
      return "Approval"
    case "bond":
      return "Bond"
    case "claim":
      return "Claim"
    case "bridge":
      return "Bridge"
    default:
      return "Transaction"
  }
}

/**
 * Generates analytics data for transaction errors
 */
export const getTransactionErrorAnalytics = (
  error: TransactionError,
  context: TransactionErrorContext
) => {
  return {
    vaultName: context.vaultName,
    tokenSymbol: context.tokenSymbol,
    transactionType: context.transactionType,
    value: context.value,
    chainId: context.chainId,
    message: error.type,
    errorMessage: error.message,
  }
}
