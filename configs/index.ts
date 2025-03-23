import { Configs } from '../types/configs.d.ts'
import brewfile from './brewfile.ts'
import clashVergeRevConfig from './clash-verge-rev-config.ts'
import gitconfig from './gitconfig.ts'
import npmrc from './npmrc.ts'
import raycast from './raycast.ts'
import tabbyConfig from './tabby-config.ts'
import vimrc from './vimrc.ts'
import zshrc from './zshrc.ts'

const configs: Configs = [brewfile, vimrc, zshrc, tabbyConfig, raycast, npmrc, clashVergeRevConfig, gitconfig]
export default configs
