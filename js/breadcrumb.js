const Breadcrumb = (function() {
    'use strict';

    const chooseJobMessage = 'Wähle einen Beruf';
    const chooseClassMessage = 'Wähle eine Klasse';

    const $job = $('#breadcrumb-job');
    const $class = $('#breadcrumb-class');
    const $separator = $('#breadcrumb-separator');

    const _onJobClicked = function() {
        init();
        $(exports).trigger('showJobSelection');
    };

    const _onClassClicked = function() {
        const selectedJob = JSON.parse(localStorage.getItem('job'));
        selectJob(selectedJob.jobId, selectedJob.jobName);
        $(exports).trigger('showClassSelection', selectedJob);
    };

    const init = function() {
        $job.text(chooseJobMessage).removeClass('link');
        $class.hide();
        $separator.hide();
    };

    const selectJob = function(jobId, jobName) {
        $job.addClass('link').text(`Beruf: ${jobName}`);
        $separator.show();
        $class.removeClass('link').text(chooseClassMessage).show();
    };

    const selectClass = function(classId, className) {
        $class.addClass('link').text(`Klasse: ${className}`);
    };

    $job.click(_onJobClicked);
    $class.click(_onClassClicked);

    const exports = {
        init: init,
        selectJob: selectJob,
        selectClass: selectClass
    };

    return exports;
})();