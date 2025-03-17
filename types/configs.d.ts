interface BeforeUploadOptions {
  /**
   * Updown root directory
   */
  root: string
}

type BeforeUpload = (options: { root: string }) => Promise<string> | string

export interface Config {
  name: string
  beforeUpload: BeforeUpload
}

export type Configs = Config[]
