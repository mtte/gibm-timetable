const Breadcrumb = (function() {
    'use strict';

    const chooseJobMessage = 'Wähle einen Beruf';
    const chooseClassMessage = 'Wähle eine Klasse';

    const $job = $('#breadcrumb-job');
    const $class = $('#breadcrumb-class');
    const $separator = $('#breadcrumb-separator');

    /**
     * Job link of the breadcrumb has been clicked. The job-selection will be shown.
     * @private
     */
    const _onJobClicked = function() {
        init();
        $(exports).trigger('showJobSelection');
    };

    /**
     * Class link of the breadcrumb has been clicked. All classes of the current job will be shown.
     * @private
     */
    const _onClassClicked = function() {
        $(exports).trigger('showClassSelection');
    };

    /**
     * Initial state of the breadcrumb.
     */
    const init = function() {
        $job.text(chooseJobMessage).removeClass('link');
        $class.hide();
        $separator.hide();
    };

    /**
     * Selects the given job.
     * @param jobId The id of the job.
     * @param jobName The display name of the job.
     */
    const selectJob = function(jobId, jobName) {
        $job.addClass('link').text(`Beruf: ${jobName}`);
        $separator.show();
        $class.removeClass('link').text(chooseClassMessage).show();
    };

    /**
     * Selects the given class.
     * @param classId The id of the class.
     * @param className The display name of the class.
     */
    const selectClass = function(classId, className) {
        $class.addClass('link').text(`Klasse: ${className}`);
    };

    // events
    $job.click(_onJobClicked);
    $class.click(_onClassClicked);

    const exports = {
        init: init,
        selectJob: selectJob,
        selectClass: selectClass
    };

    return exports;
})();