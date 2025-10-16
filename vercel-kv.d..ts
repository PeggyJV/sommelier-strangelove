declare module "@vercel/kv" {
  export const kv: {
    // Basic
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<any>
    del?: (key: string) => Promise<any>
    delete: (key: string) => Promise<void>

    // Sets
    sadd: (key: string, member: string | number) => Promise<any>
    smembers: (key: string) => Promise<string[]>

    // Sorted sets
    zadd: (
      key: string,
      member:
        | { score: number; member: string | number }
        | Array<{ score: number; member: string | number }>
    ) => Promise<any>
    zrange: (
      key: string,
      start: number,
      stop: number,
      opts?: Record<string, any>
    ) => Promise<string[]>
    zrangebyscore?: (
      key: string,
      min: number | string,
      max: number | string,
      opts?: Record<string, any>
    ) => Promise<string[]>
    zrevrangebyscore?: (
      key: string,
      max: number | string,
      min: number | string,
      opts?: Record<string, any>
    ) => Promise<string[]>

    // Counters / expiry
    incr: (key: string) => Promise<number>
    expire: (key: string, seconds: number) => Promise<any>
  }
}
