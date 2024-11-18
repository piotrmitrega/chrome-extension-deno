export interface StaticFile {
  from: string;
  /**
   * Optional, defaults to `from` if not provided
   */
  to?: string;
}

export interface BuildConfig {
  isWatch: boolean;
  isProd: boolean;
  staticFiles: StaticFile[];
  entryPoints: Record<string, string>;
}
