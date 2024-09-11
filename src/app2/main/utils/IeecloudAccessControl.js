export default class IeecloudAccessControl {

    #userAccess;

    constructor() {
    }

    setUserAccess(userAccess) {
        this.#userAccess = userAccess;
    }

    getMappedUserAccess() {
        const mappedUserAccess = {}
        this.#userAccess.forEach(function(element){
            mappedUserAccess[element.module_code] = element.access;
        });
        return mappedUserAccess;
    }


}

