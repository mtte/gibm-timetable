/**
 * The timetable component.
 */
class Timetable {

    /**
     * Initialized the timetable with the data.
     * @param data The timetable data.
     */
    constructor(data) {
        this._days = this._groupBy(data, lesson => lesson.tafel_datum);
    }

    /**
     * Create the table element.
     * @returns {jQuery.fn.init|jQuery|HTMLElement} The table.
     * @private
     */
    _createTable() {
        const table = $('<table />', {
            class: 'table table-bordered table-responsive-md text-center hide'
        });

        // Head
        const tableHead = $('<thead />', { class: 'thead-light' });
        tableHead.append(this._createHeaders());
        table.append(tableHead);

        // Body
        const tableBody = $('<tbody />');
        tableBody.append(this._createRows());
        table.append(tableBody);

        return table;
    }

    /**
     * Creates a header row with all headers. Each header corresponds to one day of the timetable.
     * @returns {jQuery.fn.init|jQuery|HTMLElement} The header row.
     * @private
     */
    _createHeaders() {
        const headerRow = $('<tr></tr>');

        // If there is no data inform the user
        if (this._days.size === 0) {
            headerRow.append('<th>Keine Daten vorhanden für diese Woche, eventuell sind Ferien.</th>');
            return headerRow;
        }

        // Create a <th /> for each day 
        this._days.forEach(day => {
            const head = $('<th />');
            const date = Timetable._getDateOfDay(day);

            // Date
            head.append(date.toLocaleDateString());

            head.append('<br />');

            // Week day
            head.append(date.toLocaleDateString('de', { weekday: 'long' }));

            headerRow.append(head);
        });

        return headerRow;
    }

    /**
     * Create all rows of the table.
     * @returns {Array} All rows.
     * @private
     */
    _createRows() {
        const rows = [];

        const groupedByDay = Array.from(this._groupBy(this._getAllLessons(), lesson => lesson.date).values());
        const maxLessonsPerDay = Math.max(...groupedByDay.map(d => d.length));

        for (let i = 0; i < maxLessonsPerDay; i++) {
            const row = $('<tr />');
            for (const lessonsOfDay of groupedByDay) {
                const lesson = lessonsOfDay[i];
                if (lesson) {
                    row.append(lesson.html);
                } else {
                    row.append($('<td />'));
                }
            }
            rows.push(row);
        } 

        return rows;
    }

    /**
     * Get all lessons.
     * @returns {{date, html: string}[]} Array containing the lessons.
     * @private
     */
    _getAllLessons() {
        // For each day create all lessons
        return Array.from(this._days.values()).flatMap(day => {
            const date = Timetable._getDateOfDay(day);
            // For each lesson create object that contains the date and the html
            return day.flatMap(lessonData => Timetable._createLesson(lessonData))
                .map(lesson => { 
                    return { date: date, html: lesson };
                });
        });
    }

    /**
     * Creates the html for a lesson.
     * @param lesson The lesson data.
     * @returns {string} A html string.
     * @private
     */
    static _createLesson(lesson) {
        return `
            <td>
                <strong>${lesson.tafel_longfach}</strong><br>
                ${Timetable._formatTime(lesson.tafel_von)}-${Timetable._formatTime(lesson.tafel_bis)}<br>
                Lehrer: ${lesson.tafel_lehrer}<br>
                Raum: ${lesson.tafel_raum}
            </td>`;
    }

    /**
     * Formats the time string.
     * @param time The time string.
     * @returns {string} The formatted string.
     * @private
     */
    static _formatTime(time) {
        const index = time.lastIndexOf(':');
        return time.substring(0, index);
    }

    /**
     * Get the date of a day.
     * @param day The data of the day.
     * @returns {Date} Returns the date of the day.
     * @private
     */
    static _getDateOfDay(day) {
        // get the first lesson of this day to get the data for the day
        // this data is the same for each lesson of this day
        const firstLesson = day[0];
        return new Date(firstLesson.tafel_datum);
    }

    /**
     * Returns the html table.
     * @returns {jQuery.fn.init|jQuery|HTMLElement|*} The table element.
     */
    getTable() {
        if (!this._table) {
            this._table = this._createTable();
        }
        return this._table;
    }

    /**
     * Groups a list by a property of each item that is retrieved by the key getter.
     * Source: https://stackoverflow.com/a/38327540/7130450
     */
    _groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

}