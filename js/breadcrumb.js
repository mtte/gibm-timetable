const Breadcrumb = (function() {
    'use strict';

    const chooseJobMessage = 'Wähle einene Beruf';
    const chooseClassMessage = 'Wähle eine Klasse';

    const $job = $('#breadcrumb-job');
    const $class = $('#breadcrumb-class');
    const $separator = $('#breadcrumb-separator');

    let selectedJob;

    const _onJobClicked = function() {
        init();
        $(exports).trigger('showJobSelection');
    };

    const _onClassClicked = function() {
        selectJob(selectedJob.jobId, selectedJob.jobName);
        $(exports).trigger('showClassSelection', selectedJob.jobId);
    };

    const init = function() {
        selectedJob = null;

        $job.text(chooseJobMessage).removeClass('link');
        $class.hide();
        $separator.hide();
    };

    const selectJob = function(jobId, jobName) {
        selectedJob = { jobId, jobName };

        $job.addClass('link').text(`Beruf: ${jobName}`);
        $separator.show();
        $class.removeClass('link').text(chooseClassMessage).show();
    };

    const selectClass = function(className) {
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