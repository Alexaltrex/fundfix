import {action, makeObservable, observable} from "mobx";
import {CelebsRefered} from "../components/C_Modals/CelebsRefered/CelebsRefered";
import {HowToPlay} from "../components/C_Modals/HowToPlay/HowToPlay";
import {favoriteSingles, IFavorite, IFavoriteFolder} from "../components/A2_Sidebar/data";
import {v4 as uuidv4} from 'uuid';
import {SpinAndWin} from "../components/C_Modals/SpinAndWin/SpinAndWin";

export enum ColorThemeEnum {
    dark = "dark",
    light = "light"
}

export enum ViewModeEnum {
    list = "list",
    grid = "grid"
}

export class AppStore {
    address = null as null | string
    twitter = null as null | string
    colorTheme = ColorThemeEnum.dark
    confirmed = false
    viewMode = ViewModeEnum.list
    showConnectWallet = false
    walletAddress = null as null | string
    menu = false
    shareModal = false
    celebsReferedModal = false
    howToPlayModal = false
    spinAndWinModal = true
    claimModal = false
    createNewTokenModal = false
    depositedSolana = false

    createFolderModal = false
    renameFolderModal = false
    deleteFolderModal = false
    favoriteSingles = favoriteSingles as IFavorite[]
    favoriteFolders = [] as IFavoriteFolder[]
    sourceFavorite = null as null | IFavorite
    targetFavorite = null as null | IFavorite
    folderToEdit = null as null | IFavoriteFolder
    win = false
    winValue = ""

    constructor() {
        makeObservable(this,
            {
                address: observable,
                twitter: observable,
                colorTheme: observable,
                confirmed: observable,
                viewMode: observable,
                showConnectWallet: observable,
                walletAddress: observable,
                menu: observable,
                shareModal: observable,
                celebsReferedModal: observable,
                howToPlayModal: observable,
                spinAndWinModal: observable,
                win: observable,
                winValue: observable,

                createFolderModal: observable,
                renameFolderModal: observable,
                deleteFolderModal: observable,
                favoriteSingles: observable,
                favoriteFolders: observable,
                sourceFavorite: observable,
                targetFavorite: observable,
                folderToEdit: observable,
                claimModal: observable,
                createNewTokenModal: observable,
                depositedSolana: observable,

                setAddress: action.bound,
                setTwitter: action.bound,
                setColorTheme: action.bound,
                setConfirmed: action.bound,
                setViewMode: action.bound,
                setShowConnectWallet: action.bound,
                setWalletAddress: action.bound,
                setMenu: action.bound,
                setShareModal: action.bound,
                setCelebsReferedModal: action.bound,
                setHowToPlayModal: action.bound,
                setSpinAndWinModal: action.bound,
                setClaimModal: action.bound,
                setCreateNewTokenModal: action.bound,
                setDepositedSolana: action.bound,

                setCreateFolderModal: action.bound,
                setRenameFolderModal: action.bound,
                setDeleteFolderModal: action.bound,
                moveToSingle: action.bound,
                setSourceFavorite: action.bound,
                setTargetFavorite: action.bound,
                setFolderToEdit: action.bound,
                moveSingleToFolder: action.bound,
                moveFolderItemToAnotherFolder: action.bound,
                renameFolder: action.bound,
                deleteFolder: action.bound,
                setWin: action.bound,
                setWinValue: action.bound,
            }
        )
    }

    setAddress(address: string) {
        this.address = address;
    }

    setTwitter(twitter: string) {
        this.twitter = twitter;
    }

    setColorTheme(colorTheme: ColorThemeEnum) {
        this.colorTheme = colorTheme;
    }

    setConfirmed(confirmed: boolean) {
        this.confirmed = confirmed;
    }

    setViewMode(viewMode: ViewModeEnum) {
        this.viewMode = viewMode
    }

    setShowConnectWallet(showConnectWallet: boolean) {
        this.showConnectWallet = showConnectWallet
    }

    setWalletAddress(walletAddress: string | null) {
        this.walletAddress = walletAddress
    }

    setMenu(menu: boolean) {
        this.menu = menu
    }

    setShareModal(shareModal: boolean) {
        this.shareModal = shareModal
    }

    setCelebsReferedModal(celebsReferedModal: boolean) {
        this.celebsReferedModal = celebsReferedModal
    }

    setHowToPlayModal(howToPlayModal: boolean) {
        this.howToPlayModal = howToPlayModal
    }

    setCreateFolderModal(createFolderModal: boolean) {
        this.createFolderModal = createFolderModal
    }

    setRenameFolderModal(renameFolderModal: boolean) {
        this.renameFolderModal = renameFolderModal
    }

    setDeleteFolderModal(deleteFolderModal: boolean) {
        this.deleteFolderModal = deleteFolderModal
    }

    setSourceFavorite(sourceFavorite: IFavorite) {
        this.sourceFavorite = sourceFavorite
    }

    setTargetFavorite(targetFavorite: IFavorite) {
        this.targetFavorite = targetFavorite
    }

    moveToSingle({
                     source,
                     target,
                     folderName
                 }: {
                     source: IFavorite
                     target: IFavorite
                     folderName: string
                 }
    ) {

        // create folder and add source to it
        const folderId = uuidv4();
        this.favoriteFolders.push({
            id: folderId,
            folderName,
            favorites: [
                {...source, folderId},
                {...target, folderId}
            ]
        })

        // remove target from this.favoriteSingles
        this.favoriteSingles = this.favoriteSingles.filter(({id}) => id !== target.id)

        // if source is single - remove from this.favoriteSingles
        if (!source.folderId) {
            const _favoriteSingles = this.favoriteSingles.filter(({id}) => id !== source.id)
            this.favoriteSingles = _favoriteSingles
        }

        // if source is folder item - remove from old folder and delete old folder if source is single item in old folder
        if (source.folderId) {
            const oldFolderIndex = this.favoriteFolders.findIndex(folder => folder.id === source.folderId)

            if (this.favoriteFolders[oldFolderIndex].favorites.length > 1) { // remove from old folder
                const _favoritesFromOldFolder = this.favoriteFolders[oldFolderIndex].favorites.filter(item => item.id !== source.id)
                this.favoriteFolders[oldFolderIndex].favorites = _favoritesFromOldFolder;
            } else { // delete old folder
                const _favoriteFolders = this.favoriteFolders.filter((folder, index) => index !== oldFolderIndex)
                this.favoriteFolders = _favoriteFolders;
            }
        }

    }

    moveSingleToFolder({
                           single,
                           folderId,
                       }: {
                           single: IFavorite
                           folderId: string
                       }
    ) {
        const _single = {...single, folderId}

        // remove single from this.favoriteSingles
        const _favoriteSingles = this.favoriteSingles.filter(({id}) => id !== single.id)
        this.favoriteSingles = _favoriteSingles;

        // add single to folder
        const folderIndex = this.favoriteFolders.findIndex(folder => folder.id === folderId)
        this.favoriteFolders[folderIndex].favorites.push(_single)
    }

    moveFolderItemToAnotherFolder({
                                      folderItem,
                                      folderId,
                                  }: {
                                      folderItem: IFavorite,
                                      folderId: string
                                  }
    ) {
        const _folderItem = {...folderItem, folderId}

        const oldFolderIndex = this.favoriteFolders.findIndex(folder => folder.id === folderItem.folderId)
        const newFolderIndex = this.favoriteFolders.findIndex(folder => folder.id === folderId)

        // remove folderItem from old folder
        const _favoritesFromOldFolder = this.favoriteFolders[oldFolderIndex].favorites.filter(item => item.id !== folderItem.id)
        this.favoriteFolders[oldFolderIndex].favorites = _favoritesFromOldFolder;

        // add folderItem to new folder
        this.favoriteFolders[newFolderIndex].favorites.push(_folderItem)

        // if folderItem is single in the old folder than delete old folder
        if (this.favoriteFolders[oldFolderIndex].favorites.length === 1) {
            const _favoriteFolders = this.favoriteFolders.filter((folder, index) => index !== oldFolderIndex)
            this.favoriteFolders = _favoriteFolders;
        }

    }

    setFolderToEdit(folderToEdit: IFavoriteFolder) {
        this.folderToEdit = folderToEdit
    }

    renameFolder({folderId, folderName}: {
        folderId: string
        folderName: string
    }) {
        const folderIndex = this.favoriteFolders.findIndex(folder => folder.id === folderId)
        this.favoriteFolders[folderIndex].folderName = folderName;
    }

    deleteFolder(folderId: string) {
        const _favoriteFolders = this.favoriteFolders.filter(folder => folder.id !== folderId)
        this.favoriteFolders = _favoriteFolders
    }

    setSpinAndWinModal(spinAndWinModal: boolean) {
        this.spinAndWinModal = spinAndWinModal
    }

    setWin(win: boolean) {
        this.win = win
    }

    setWinValue(winValue: string) {
        this.winValue = winValue
    }

    setClaimModal(claimModal: boolean) {
        this.claimModal = claimModal
    }

    setCreateNewTokenModal(createNewTokenModal: boolean) {
        this.createNewTokenModal = createNewTokenModal
    }

    setDepositedSolana(depositedSolana: boolean) {
        this.depositedSolana = depositedSolana
    }

}