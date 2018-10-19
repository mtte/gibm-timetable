const Fetcher = (function() {
    'use strict';

    const jobUrl = 'https://sandbox.gibm.ch/berufe.php';
    const classUrl = 'https://sandbox.gibm.ch/klassen.php';
    const timetableUrl = 'http://sandbox.gibm.ch/tafel.php';

    const fetchJobs = function() {
        return $.getJSON(jobUrl);
    };

    const fetchClasses = function(jobId) {
        return $.getJSON(classUrl, {
            beruf_id: jobId
        });
    };

    const fetchTimetable = function(classId, week, year) {
        return  $.getJSON(timetableUrl, {
            klasse_id: classId,
            woche: `${week}-${year}`
        });
    };

    return {
        fetchJobs: fetchJobs,
        fetchClasses: fetchClasses,
        fetchTimetable: fetchTimetable
    };
})();