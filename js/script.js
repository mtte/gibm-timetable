$(function() {
    'use strict';

    const $jobList = $('#job-list');
    const $classList = $('#class-list');
    const $timetable = $('#timetable');
    const $tableContainer = $('#table-container');

    const view = new View(400, $jobList, $classList, $timetable);
    const settings = new Settings();

    /**
     * Shows the job selection list.
     */
    async function showJobList() {
        // reset all settings
        settings.reset();

        // get job data
        let data;
        try {
            data = await Fetcher.fetchJobs();
        } catch (error) {
            showFetchError(error);
            return;
        }

        $jobList.empty(); // clear before filling with new data

        for (const job of data) {
            // add list item for each job
            const html = `
                <a href="#" class="list-group-item list-group-item-action job" data-id="${job.beruf_id}">
                ${job.beruf_name}
                </a>`;
            $jobList.append(html);
        }

        await view.showView($jobList);
    }

    /**
     * Shows the class selection list. Listed are all classes of the given job.
     * @param jobId The id of the job of which to show the classes.
     * @param jobName The display name of the job.
     */
    async function showClassList(jobId, jobName) {
        // save job selection to settings
        settings.job = { jobId, jobName };

        // get class data
        let data;
        try {
            data = await Fetcher.fetchClasses(jobId);
        } catch (error) {
            showFetchError(error);
            return;
        }

        $classList.empty(); // clear before filling with new data

        if (data.length === 0) {
            // show info if no data available
            $classList.append(
                `<div class="list-group-item list-group-item-secondary">Keine Klassen verfügbar</div>`);
        }

        for (const classData of data) {
            // create list item for each class
            const html = `
                <a href="#" class="list-group-item list-group-item-action class" data-id="${classData.klasse_id}">
                ${classData.klasse_longname}
                </a>`;
            $classList.append(html);
        }

        await view.showView($classList);
    }

    /**
     * Show the timetable of the given class.
     * @param classId The id of the class.
     * @param className The display name of the class.
     */
    async function showTable(classId, className) {
        // save class selection to settings
        settings.class = { classId, className };

        // update week
        $('#week-number').text(settings.week);
        $('#week-year').text(settings.year);

        // get timetable data
        let data;
        try {
            data = await Fetcher.fetchTimetable(classId, settings.week, settings.year);
        } catch (error) {
            showFetchError(error);
            return;
        }
        
        $tableContainer.empty(); // remove previous table

        // create timetable and append it hidden
        const timetable = new Timetable(data);
        const table = timetable.getTable();
        $tableContainer.append(table);
        table.hide();

        // Sshow timetable view and then fade in the table
        await view.showView($timetable);
        table.fadeIn();
    }

    /**
     * Shows a error alert, that an ajax request failed.
     * @param error The actual error.
     */
    function showFetchError(error) {
        console.error(error);
        $('#fetch-alert').addClass('show').fadeIn('fast');
    }

    /**
     * Triggered when a job has been selected from the jobList.
     * @param event The click event.
     */
    function onJobSelect(event) {
        event.preventDefault();

        // get selected job
        const id = $(this).data('id');
        const name = $(this).text();

        Breadcrumb.selectJob(id, name);

        showClassList(id, name);
    }

    /**
     * Triggered when a class has been selected from the classList.
     * @param event The click event.
     */
    function onClassSelect(event) {
        event.preventDefault();

        // get selected class
        const id = $(this).data('id');
        const name = $(this).text();

        Breadcrumb.selectClass(id, name);

        showTable(id, name);
    }

    /**
     * Initialized the timetable application.
     */
    function init() {
        // if a previous job is present, pre-select the job
        if (settings.job) {
            Breadcrumb.selectJob(settings.job.jobId, settings.job.jobName);

            if (settings.class) {
                // if previous class is present, pre-select the class too
                Breadcrumb.selectClass(settings.class.classId, settings.class.className);
                showTable(settings.class.classId, settings.class.className);
                return;
            }

            showClassList(settings.job.jobId, settings.job.jobName);
            return;
        }

        // no previous data
        Breadcrumb.init();
        showJobList();
    }

    /**
     * Sets up all the alerts.
     */
    function setupAlerts() {
        $('#alerts .alert').hide();
        $('#alerts .alert .close').click(function() {
            $(this).removeClass('show').parent().fadeOut('fast');
        });
    }

    // Events
    $(Breadcrumb).on('showJobSelection', showJobList);
    $(Breadcrumb).on('showClassSelection', () => {
        Breadcrumb.selectJob(settings.job.jobId, settings.job.jobName);
        showClassList(settings.job.jobId, settings.job.jobName);
    });

    $jobList.on('click', '.job', onJobSelect);
    $classList.on('click', '.class', onClassSelect);

    $('#next').click(async () => {
        // Swipe current table to the left (only if there is one)
        await $.when($tableContainer.find('.table').animate(
            { right: $(window).width() },
            'slow'
        ));
        settings.incrementWeek();
        showTable(settings.class.classId, settings.class.className);
    });
    $('#back').click(async () => {
        // Swipe current table to the right (only if there is one)
        await $.when($tableContainer.find('.table').animate(
            { left: $(window).width() },
            'slow'
        ));
        settings.decrementWeek();
        showTable(settings.class.classId, settings.class.className);
    });

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();

    setupAlerts();

    init();
});