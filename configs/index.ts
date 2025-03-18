import { Configs } from '../types/configs.d.ts'
import brewfile from './brewfile.ts'
import tabbyConfig from './tabby-config.ts'
import vimrc from './vimrc.ts'
import zshrc from './zshrc.ts'

const configs: Configs = [brewfile, vimrc, zshrc, tabbyConfig]
export default configs
