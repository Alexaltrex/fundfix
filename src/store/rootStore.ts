import {useContext} from "react";
import {AppStore} from "./appStore";
import {StoreContext} from "../components/A0_App/AppContainer";
import {CryptoStore} from "./cryptoStore";

export class RootStore {
    appStore: AppStore
    cryptoStore: CryptoStore

    constructor() {
        this.appStore = new AppStore();
        this.cryptoStore = new CryptoStore();
    }
}

export const store = new RootStore()

export const useStore = (): RootStore => useContext(StoreContext)
