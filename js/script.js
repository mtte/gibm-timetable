$(function() {
    'use strict';

    const $jobList = $('#job-list');
    const $classList = $('#class-list');
    const $timetable = $('#timetable');

    const view = new View(400, $jobList, $classList, $timetable);
    const settings = new Settings();

    async function showJobList() {
        settings.reset();

        let data;
        try {
            data = await Fetcher.fetchJobs();
        } catch (error) {
            showError(error);
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

    async function showClassList(jobId, jobName) {
        settings.job = { jobId, jobName };

        let data;
        try {
            data = await Fetcher.fetchClasses(jobId);
        } catch (error) {
            showError(error);
            return;
        }

        $classList.empty(); // clear before filling with new data

        if (data.length === 0) {
            // show info if no data available
            $classList.append(
                `<div class="list-group-item list-group-item-warning">Keine Klassen verfügbar</div>`);
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

    async function showTable(classId, className) {
        settings.class = { classId, className };

        $('#week-number').text(settings.week);
        $('#week-year').text(settings.year);

        let data;
        try {
            data = await Fetcher.fetchTimetable(classId, settings.week, settings.year);
        } catch (error) {
            showError(error);
            return;
        }

        const tableBody = $timetable.find('#table-body');
        tableBody.empty(); // clear before filling with new data
        for (const lesson of data) {
            // add a row to the table for each lesson
            const html = `
                <tr>
                    <td>${lesson.tafel_longfach}</td>
                    <td>${lesson.tafel_datum}</td>
                    <td>${lesson.tafel_von}</td>
                    <td>${lesson.tafel_bis}</td>
                    <td>${lesson.tafel_lehrer}</td>
                    <td>${lesson.tafel_raum}</td>
                </tr>`;
            tableBody.append(html);
        }

        await view.showView($timetable);
    }

    function showError(error) {
        console.error(error);
        $('#fetch-alert').addClass('show').fadeIn('fast');
    }

    function onJobSelect(event) {
        event.preventDefault();
        const id = $(this).data('id');
        const name = $(this).text();

        Breadcrumb.selectJob(id, name);

        showClassList(id, name);
    }

    function onClassSelect(event) {
        event.preventDefault();
        const id = $(this).data('id');
        const name = $(this).text();

        Breadcrumb.selectClass(id, name);

        showTable(id, name);
    }

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

        Breadcrumb.init();
        showJobList();
    }

    function setupAlerts() {
        $('#alerts .alert').hide();
        $('#alerts .alert .close').click(function() {
            $(this).removeClass('show').parent().fadeOut('fast');
        });
    }

    // Events
    $(Breadcrumb).on('showJobSelection', showJobList);
    $(Breadcrumb).on('showClassSelection', (event, job) => showClassList(job.jobId, job.jobName));

    $jobList.on('click', '.job', onJobSelect);
    $classList.on('click', '.class', onClassSelect);

    $('#next').click(() => {
        settings.incrementWeek();
        showTable(settings.class.classId, settings.class.className);
    });
    $('#back').click(() => {
        settings.decrementWeek();
        showTable(settings.class.classId, settings.class.className);
    });

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();

    setupAlerts();

    init();
});