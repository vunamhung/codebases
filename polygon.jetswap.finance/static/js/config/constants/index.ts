import farmsConfig from './farms'
import vaultsConfig from './vaults'

const communityFarms = farmsConfig.filter((farm) => farm.isCommunity).map((farm) => farm.token.symbol)
const communityVaults = vaultsConfig.filter((vault) => vault.isCommunity).map((vault) => vault.token.symbol)

export { farmsConfig, communityFarms }
export { vaultsConfig, communityVaults }
export { default as poolsConfig } from './pools'
export { default as ifosConfig } from './ifo'
