import { Configs } from '../types/configs.d.ts'
import brewfile from './brewfile.ts'
import vimrc from './vimrc.ts'
import zshrc from './zshrc.ts'

const configs: Configs = [brewfile, vimrc, zshrc]
export default configs
