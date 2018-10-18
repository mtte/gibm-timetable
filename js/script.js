$(function() {

    const jobUrl = 'https://sandbox.gibm.ch/berufe.php';
    const classUrl = 'https://sandbox.gibm.ch/klassen.php';
    const timetableUrl = 'http://sandbox.gibm.ch/tafel.php';

    const $jobList = $('#job-list');
    const $classList = $('#class-list');
    const $timetable = $('#timetable');

    function populateJobList(data) {
        for (const job of data) {
            const html = `<a href="#" class="list-group-item list-group-item-action job" data-id="${job.beruf_id}">${job.beruf_name}</a>`;
            $jobList.append(html);
        }
    }

    function populateClassList(data) {
        $jobList.slideUp("slow", function() {
            for (const classData of data) {
                const html = `<a href="#" class="list-group-item list-group-item-action class" data-id="${classData.klasse_id}">${classData.klasse_longname}</a>`;
                $classList.append(html);
            }
            $classList.slideDown("slow");
        });
    }

    function showTable(data) {
        $classList.slideUp("slow", function() {
            for (const lesson of data) {
                // TODO
            }
        });
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