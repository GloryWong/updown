interface CommonOptions {
  /**
   * Updown root directory
   */
  root: string
  /**
   * OS home directory
   */
  home: string
}

interface GetFilePathOptions extends CommonOptions {
  //
}

type GetFilePath = (options: GetFilePathOptions) => Promise<string> | string

interface BeforeUploadOptions extends CommonOptions {
  /**
   * The uploaded file path
   */
  filePath: string
}

type BeforeUpload = (options: BeforeUploadOptions) => Promise<void> | void

export interface Config {
  /**
   * Unique file name in gist
   */
  name: string
  /**
   * Get the uploaded file path
   */
  getFilePath: GetFilePath
  /**
   * Hook: before upload
   */
  beforeUpload?: BeforeUpload
}

export type Configs = Config[]
