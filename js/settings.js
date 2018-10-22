class Settings {

    constructor() {
        this._date = new Date();
        this._job = Settings._getFromLocalStrorage('job');
        this._class = Settings._getFromLocalStrorage('class');
    }

    static _getFromLocalStrorage(key) {
        const asString = localStorage.getItem(key);
        return JSON.parse(asString);
    }

    static _saveToLocalStorage(key, data) {
        const asString = JSON.stringify(data);
        localStorage.setItem(key, asString);
    }

    reset() {
        localStorage.clear();
        this._job = null;
        this._class = null;
        this._date = new Date();
    }

    incrementWeek() {
        this._date.setDate(this._date.getDate() + 7);
    }

    decrementWeek() {
        this._date.setDate(this._date.getDate() - 7);
    }

    get week() {
        return this._date.getWeek();
    }

    get year() {
        return this._date.getWeekYear();
    }

    get job() {
        return this._job;
    }

    set job(theJob) {
        Settings._saveToLocalStorage('job', theJob);
        this._job = theJob;

        this._class = null;
        localStorage.removeItem('class');
    }

    get class() {
        return this._class;
    }

    set class(theClass) {
        Settings._saveToLocalStorage('class', theClass);
        this._class = theClass;
    }

}
