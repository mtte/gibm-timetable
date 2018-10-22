class Timetable {

    constructor(data) {
        this._days = this._groupBy(data, lesson => lesson.tafel_datum);
    }

    _createTable() {
        const table = $('<table />', {
            class: 'table table-bordered table-responsive-md text-center hide'
        });

        // Head
        const tableHead = $('<thead />', { class: 'thead-light' });
        tableHead.append(this._createHeaders());
        table.append(tableHead);

        // Rows
        const tableBody = $('<tbody />');
        this._createRows().forEach(row => tableBody.append(row));
        table.append(tableBody);

        return table;
    }

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
            const date = this._getDateOfDay(day);

            // Date
            head.append(date.toLocaleDateString());

            head.append('<br />');

            // Week day
            head.append(date.toLocaleDateString('de', { weekday: 'long' }));

            headerRow.append(head);
        });

        return headerRow;
    }

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

    _getAllLessons() {
        // For each day create all lessons
        return Array.from(this._days.values()).flatMap(day => {
            const date = this._getDateOfDay(day);
            // For each lesson create object that contains the date and the html
            return day.flatMap(lessonData => this._createLesson(lessonData))
                .map(lesson => { 
                    return { date: date, html: lesson };
                });
        });
    }

    _createLesson(lesson) {
        const html = `
            <td>
                <strong>${lesson.tafel_longfach}</strong><br>
                ${this._formatTime(lesson.tafel_von)}-${this._formatTime(lesson.tafel_bis)}<br>
                Lehrer: ${lesson.tafel_lehrer}<br>
                Raum: ${lesson.tafel_raum}
            </td>`;

        return html;
    }

    _formatTime(time) {
        const index = time.lastIndexOf(':');
        return time.substring(0, index);
    }

    _getDateOfDay(day) {
        // get the first lesson of this day to get the data for the day
        // this data is the same for each lesson of this day
        const firstLesson = day[0];
        return new Date(firstLesson.tafel_datum);
    }

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