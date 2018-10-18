$(function() {
    'use strict';

    const $jobList = $('#job-list');
    const $classList = $('#class-list');
    const $timetable = $('#timetable');

    const view = new View(400, $jobList, $classList, $timetable);

    async function showJobList() {
        try {
            const data = await Fetcher.fetchJobs();

            $jobList.empty(); // clear before filling with new data

            for (const job of data) {
                const html = `
                    <a href="#" class="list-group-item list-group-item-action job" data-id="${job.beruf_id}">
                    ${job.beruf_name}
                    </a>`;
                $jobList.append(html);
            }

            await view.showView($jobList);
        } catch (error) {
            showError(error);
        }
    }

    async function showClassList(jobId) {
        try {
            const data = await Fetcher.fetchClasses(jobId);

            $classList.empty(); // clear before filling with new data

            if (data.length === 0) {
                $classList.append(
                    `<div href="#" class="list-group-item list-group-item-warning">Keine Klassen verfügbar</div>`);
            }

            for (const classData of data) {
                const html = `
                    <a href="#" class="list-group-item list-group-item-action class" data-id="${classData.klasse_id}">
                    ${classData.klasse_longname}
                    </a>`;
                $classList.append(html);
            }

            await view.showView($classList);
        } catch (error) {
            console.log(error);
            showError(error);
        }
    }

    async function showTable(classId) {
        try {
            const data = await Fetcher.fetchTimetable(classId);

            const tableBody = $timetable.find('#table-body');
            tableBody.empty(); // clear before filling with new data
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

            await view.showView($timetable);
        } catch (error) {
            showError(error);
        }
    }

    function showError(error) {
        console.error(error);
    }

    function onJobSelect(event) {
        event.preventDefault();
        const id = $(this).data('id');
        const name = $(this).text();

        Breadcrumb.selectJob(id, name);

        showClassList(id);
    }

    function onClassSelect(event) {
        event.preventDefault();
        const id = $(this).data('id');
        const name = $(this).text();

        Breadcrumb.selectClass(name);

        showTable(id);
    }

    Breadcrumb.init();

    showJobList();

    $(Breadcrumb).on('showJobSelection', showJobList);
    $(Breadcrumb).on('showClassSelection', (event, id) => showClassList(id));

    $jobList.on('click', '.job', onJobSelect);
    $classList.on('click', '.class', onClassSelect);

});