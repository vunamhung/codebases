// Changes here might require a server restart to take effect
module.exports = {
  environmentVariables: {
    "--categoryGroupWidth": 100,                // % width of a PLP "group"
    "--desktopLeftWidth": 65,                   // % width of PDP image container on desktop (currently not used?)
    "--desktopMinifiedHeaderBreakpoint": 47,    // px thershold for minifying the desktop header
    "--desktopPdpMultiImageWidth": 100,         // % width of an image of a multi-image PDP on desktop
    "--mobilePdpMultiImageWidth": 75,           // % width of an image of a multi-image PDP on mobile
    "--pdpSingleImageWidth": 100,               // % width of an image on a single image PDP
    "--plpMaxWidth": 1440,                      // px max width of PLP
    "--productTileMobileWidth": 49,             // % width of a product tile (and image) on mobile
    "--productTileTabletAndDesktopWidth": 32,   // % width of a product tile (and image) on tablet and desktop
    "--productWrapperHorizonalPadding": 2,      // % horizontal padding on PDPs
    "--productWrapperMaxWidth": 1440,           // px max width on PDPs
    "--thumbnailWidth": 48,                     // px width of a thumbnail image
  },
}