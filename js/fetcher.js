const Fetcher = (function() {
    'use strict';

    const jobUrl = 'https://sandbox.gibm.ch/berufe.php';
    const classUrl = 'https://sandbox.gibm.ch/klassen.php';
    const timetableUrl = 'http://sandbox.gibm.ch/tafel.php';

    /**
     * Fetch all jobs.
     * @returns {Promise} The data.
     */
    const fetchJobs = function() {
        return $.getJSON(jobUrl);
    };

    /**
     * Fetch all classes that belong to the given job.
     * @param jobId The id of the job.
     * @returns {Promise} The data.
     */
    const fetchClasses = function(jobId) {
        return $.getJSON(classUrl, {
            beruf_id: jobId
        });
    };

    /**
     * Fetch the timetable of the week by the given class.
     * @param classId The id of the class.
     * @param week The week number.
     * @param year The year.
     * @returns {Promise} The data.
     */
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