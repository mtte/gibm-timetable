/**
 * Handles the displaying of different views.
 */
class View {

    /**
     * Constructor.
     * @param animationSpeed The speed used to play the animations.
     * @param views All view elements.
     */
    constructor(animationSpeed, ...views) {
        this._animationSpeed = animationSpeed;

        this._elements = views;

        // initially hide all views
        this._elements.forEach(e => e.hide());
    }

    /**
     * Shows the given view. Previous views will slide up (hidden) and then this view will slide down (shown).
     * @param view The view element to show, has to be one of the elements.
     * @returns {Promise<void>} Resolved when the view is show.
     */
    async showView(view) {
        if (this._active === view) {
            // return if is already active
            return;
        }

        if (!this._elements.includes(view)) {
            // not a valid view
            return;
        }

        for (const element of this._elements) {
            // check if the view is currently shown
            if (element !== view && element.is(':visible')) {
                // wait for hide animation to finish
                await $.when(element.slideUp(this._animationSpeed));
            }
        }

        // wait for show animation to finish
        await $.when(view.slideDown(this._animationSpeed));

        this._active = view;
    }

}