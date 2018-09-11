const UAOSRing = artifacts.require('UAOSRing')
const AnonymousIdentityRegistry = artifacts.require('AnonymousIdentityRegistry')

module.exports = (deployer) => {
  deployer.then(async () => {
    await deployer.deploy(UAOSRing)
    await deployer.link(UAOSRing, AnonymousIdentityRegistry)
    await deployer.deploy(AnonymousIdentityRegistry)
  })
}
