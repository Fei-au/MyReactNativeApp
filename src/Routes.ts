export type Routes = {
    PermissionsPage: undefined
    CodeScannerPage: undefined | {getBarCode: (barcodes: string[])=>void}
    CameraPage: undefined
    Login: undefined
    Home: undefined
    ItemEditor: undefined | {itemInfo: object} | {itemInfo: object, isNew: boolean}

  }