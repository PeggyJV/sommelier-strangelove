/**
 * Full type definitions for all injected keplr related objects
 * @see https://github.com/chainapsis/keplr-wallet/tree/master/packages/types
 */
type KeplrWindow = import("@keplr-wallet/types/src/window").Window

declare interface Window extends KeplrWindow {
  // Entrypoint for overriding `window` types
  // Note: window.ethereum is already declared via `wagmi`
  //
  dataLayer: any
}
