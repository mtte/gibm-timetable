$(function() {
    'use strict';

    const jobUrl = 'https://sandbox.gibm.ch/berufe.php';
    const classUrl = 'https://sandbox.gibm.ch/klassen.php';
    const timetableUrl = 'http://sandbox.gibm.ch/tafel.php';

    const $breadcrumb = $('#breadcrumb');
    const $jobList = $('#job-list');
    const $classList = $('#class-list');
    const $timetable = $('#timetable');

    const animationSpeed = 400;

    function populateJobList(data) {
        for (const job of data) {
            const html = `
                <a href="#" class="list-group-item list-group-item-action job" data-id="${job.beruf_id}">
                ${job.beruf_name}
                </a>`;
            $jobList.append(html);
        }
    }

    async function populateClassList(data) {
        await $.when($jobList.slideUp(animationSpeed));
        for (const classData of data) {
            const html = `
                <a href="#" class="list-group-item list-group-item-action class" data-id="${classData.klasse_id}">
                ${classData.klasse_longname}
                </a>`;
            $classList.append(html);
        }
        $classList.slideDown(animationSpeed);
    }

    async function showTable(data) {
        await $.when($classList.slideUp(animationSpeed));
        const tableBody = $timetable.find('#table-body');
        console.log(data);
        for (const lesson of data) {
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
        $timetable.slideDown(animationSpeed);
    }

    function showError() {
        console.error('error');
    }

    function onJobSelect(e) {
        e.preventDefault();
        const id = $(this).data('id');

        $.getJSON(classUrl, { beruf_id: id })
            .then(populateClassList)
            .catch(showError);
    }

    function onClassSelect(e) {
        e.preventDefault();
        let id = $(this).data('id');

        $.getJSON(timetableUrl, { klasse_id: id })
            .then(showTable)
            .catch(showError);
    }

    $.getJSON(jobUrl)
        .then(populateJobList)
        .catch(showError);


    $classList.hide();
    $timetable.hide();

    $jobList.on('click', '.job', onJobSelect);
    $classList.on('click', '.class', onClassSelect);

});