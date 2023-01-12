export interface MutationEventArgs<
  TInitial = unknown,
  TSuccess = TInitial
> {
  onError?: (error: unknown, data: TInitial) => unknown
  onMutate?: (data: TInitial) => unknown
  onSuccess?: (data: TSuccess) => unknown
}
