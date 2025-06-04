export interface MutationEventArgs<
  TInitial = unknown,
  TSuccess = TInitial
> {
  onError?:  (err: unknown, variables: unknown, context?: unknown) => Promise<void> | void
  onMutate?: (data: TInitial) => unknown
  onSuccess?: (data: TSuccess, variables: unknown, context: unknown) => Promise<void> | void
}
