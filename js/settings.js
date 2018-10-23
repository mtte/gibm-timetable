/**
 * Class to handle the settings of the timetable: job and class selection, current week.
 */
class Settings {

    /**
     * Initialized the settings, loads from local storage.
     */
    constructor() {
        this._date = new Date();
        this._job = Settings._getFromLocalStorage('job');
        this._class = Settings._getFromLocalStorage('class');
    }

    /**
     * Get an item from the local storage.
     * @param key The key of the item.
     * @returns {*} The item.
     * @private
     */
    static _getFromLocalStorage(key) {
        const asString = localStorage.getItem(key);
        return JSON.parse(asString);
    }

    /**
     * Save an item to the local storage.
     * @param key The key of the item.
     * @param data The item to save.
     * @private
     */
    static _saveToLocalStorage(key, data) {
        const asString = JSON.stringify(data);
        localStorage.setItem(key, asString);
    }

    /**
     * Reset the settings.
     */
    reset() {
        localStorage.clear();
        this._job = null;
        this._class = null;
        this._date = new Date();
    }

    /**
     * Increment current week by one.
     */
    incrementWeek() {
        this._date.setDate(this._date.getDate() + 7);
    }

    /**
     * Decrement current week by one.
     */
    decrementWeek() {
        this._date.setDate(this._date.getDate() - 7);
    }

    /**
     * Get the current week number.
     * @returns {number} The week number.
     */
    get week() {
        return this._date.getWeek();
    }

    /**
     * Get the year of the curent week number.
     * @returns {number} The year.
     */
    get year() {
        return this._date.getWeekYear();
    }

    /**
     * Get current job.
     * @returns {*} The currently selected job if there is one.
     */
    get job() {
        return this._job;
    }

    /**
     * Set the current selected job, resets class selection.
     * @param theJob The job object.
     */
    set job(theJob) {
        Settings._saveToLocalStorage('job', theJob);
        this._job = theJob;

        this._class = null;
        localStorage.removeItem('class');
    }

    /**
     * Get current class.
     * @returns {*} The currently selected class if there is one.
     */
    get class() {
        return this._class;
    }

    /**
     * Set the current selected class.
     * @param theClass The class object.
     */
    set class(theClass) {
        Settings._saveToLocalStorage('class', theClass);
        this._class = theClass;
    }

}
