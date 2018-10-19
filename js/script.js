$(function() {
    'use strict';

    const $jobList = $('#job-list');
    const $classList = $('#class-list');
    const $timetable = $('#timetable');

    const view = new View(400, $jobList, $classList, $timetable);

    async function showJobList() {
        // clear local storage as this is the first view
        localStorage.clear();

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
        // store selection in local storage
        localStorage.setItem('job', JSON.stringify({ jobId, jobName }));
        // remove class selection as we are now selecting a new one
        localStorage.removeItem('class');

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
        // store selection in local storage
        localStorage.setItem('class', JSON.stringify({ classId, className }));

        let data;
        try {
            data = await Fetcher.fetchTimetable(classId);
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
        const previousJob = JSON.parse(localStorage.getItem('job'));
        const previousClass = JSON.parse(localStorage.getItem('class'));

        // if a previous job is present, pre-select the job
        if (previousJob) {
            Breadcrumb.selectJob(previousJob.jobId, previousJob.jobName);

            if (previousClass) {
                // if previous class is present, pre-select the class too
                Breadcrumb.selectClass(previousClass.classId, previousClass.className);
                showTable(previousClass.classId, previousClass.className);
                return;
            }

            showClassList(previousJob.jobId, previousJob.jobName);
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

    init();
});