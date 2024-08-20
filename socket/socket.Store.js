export class Store {
    static #socketAsKey;
    static #credentialAsKey;
    static instance

    constructor() {
        if(!Store.instance){
            Store.#socketAsKey = new Map();
            Store.#credentialAsKey = new Map();
            Store.instance = this;
        }

        return Store.instance;
    }

    addSocket = ({ socketId, credential }) => {
        Store.#socketAsKey.set(socketId, credential);
        Store.#credentialAsKey.set(credential, socketId);
        return true;
    }

    showSocketStore(){
        return Store.#socketAsKey
    }

    showCredentialStore(){
        return Store.#credentialAsKey
    }

    removeSocket = (socketId) => {
        const credential = Store.#socketAsKey.get(socketId);
        Store.#socketAsKey.delete(socketId);
        Store.#credentialAsKey.delete(credential);
        return true
    }

    getSocket = (credential) => {
        return Store.#credentialAsKey.get(credential);
    }
}