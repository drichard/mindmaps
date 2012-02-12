/**
 * Creates a new FloatPanelFactory. This factory object can create new instances
 * of mindmaps.FloatPanel that are constrained inside the container.
 * 
 * @constructor
 * @param container
 */
mindmaps.FloatPanelFactory = function(container) {
  var $container = container.getContent();
  var dialogs = [];
  var paddingRight = 15;
  var paddingTop = 5;

  function setPosition(dialog) {
    // reposition dialog on window resize
    container.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function() {
      dialogs.forEach(function(dialog) {
        if (dialog.visible) {
          dialog.ensurePosition();
        }
      });
    });

    var ccw = $container.outerWidth();
    var hh = $container.offset().top;
    var dw = dialog.width();
    var dh = dialog.height();
    var heightOffset = dialogs.reduce(function(memo, dialog) {
      return memo + dialog.height() + paddingTop;
    }, 0);

    dialog.setPosition(ccw - dw - paddingRight, hh + paddingTop
        + heightOffset);
  }

  /**
   * Creates a new FloatPanel.
   * 
   * @param {String} caption the float panel title
   * @param {jQuery} $content the content as a jquery object
   * @returns {mindmaps.FloatPanel}
   */
  this.create = function(caption, $content) {
    var dialog = new mindmaps.FloatPanel(caption, $container, $content);
    setPosition(dialog);
    dialogs.push(dialog);
    return dialog;
  };
};

/**
 * A reusable, draggable panel gui element. The panel is contained within the
 * container. When a $hideTarget is set, the hide/show animations will show a
 * transfer effect.
 * 
 * @constructor
 * @param {String} caption the float panel title
 * @param {jQuery} $container the surrounding container jquery object
 * @param {jQuery} $content the content as a jquery object
 */
mindmaps.FloatPanel = function(caption, $container, $content) {
  var self = this;
  var animating = false;

  this.caption = caption;
  this.visible = false;
  this.animationDuration = 400;

  /**
   * Replaces the content in the panel.
   * 
   * @param {jQuery} $content
   */
  this.setContent = function($content) {
    this.clearContent();
    $("div.ui-dialog-content", this.$widget).append($content);
  };

  /**
   * Clears the content of the panel.
   */
  this.clearContent = function() {
    $("div.ui-dialog-content", this.$widget).children().detach();
  };

  /**
   * @private
   */
  this.$widget = (function() {
    var $panel = $("#template-float-panel").tmpl({
      title : caption
    });
    
    // hide button
    $panel.find(".ui-dialog-titlebar-close").click(function() {
      self.hide();
    });

    // add content panel
    if ($content) {
      $panel.find(".ui-dialog-content").append($content);
    }
    
    // make draggable, hide, append to container
    $panel.draggable({
      containment : "parent",
      handle : "div.ui-dialog-titlebar",
      opacity : 0.75
    }).hide().appendTo($container);
    
    return $panel;
  })();

  /**
   * Hides the panel. Will show transfer effect if $hideTarget is set.
   */
  this.hide = function() {
    if (!animating && this.visible) {
      this.visible = false;
      this.$widget.fadeOut(this.animationDuration * 1.5);

      // show transfer effect is hide target is set
      if (this.$hideTarget) {
        this.transfer(this.$widget, this.$hideTarget);
      }
    }
  };

  /**
   * Shows the panel. Will show transfer effect if $hideTarget is set.
   */
  this.show = function() {
    if (!animating && !this.visible) {
      this.visible = true;
      this.$widget.fadeIn(this.animationDuration * 1.5);
      this.ensurePosition();

      // show transfer effect is hide target is set
      if (this.$hideTarget) {
        this.transfer(this.$hideTarget, this.$widget);
      }
    }
  };

  /**
   * Shows or hides the panel.
   */
  this.toggle = function() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  };

  /**
   * Shows a transfer effect.
   * 
   * @private
   * @param {jQuery} $from
   * @param {jQuery} $to
   */
  this.transfer = function($from, $to) {
    animating = true;
    var endPosition = $to.offset(), animation = {
      top : endPosition.top,
      left : endPosition.left,
      height : $to.innerHeight(),
      width : $to.innerWidth()
    }, startPosition = $from.offset(), transfer = $(
        '<div class="ui-effects-transfer"></div>').appendTo(
        document.body).css({
      top : startPosition.top,
      left : startPosition.left,
      height : $from.innerHeight(),
      width : $from.innerWidth(),
      position : 'absolute'
    }).animate(animation, this.animationDuration, "linear", function() {
      // end
      transfer.remove();
      animating = false;
    });
  };

  /**
   * 
   * @returns {Number} the width.
   */
  this.width = function() {
    return this.$widget.outerWidth();
  };

  /**
   * 
   * @returns {Number} the height.
   */
  this.height = function() {
    return this.$widget.outerHeight();
  };

  /**
   * 
   * @returns {Object} the offset
   */
  this.offset = function() {
    return this.$widget.offset();
  };

  /**
   * Sets the position of the panel relative to the container.
   * 
   * @param {Number} x
   * @param {Number} y
   */
  this.setPosition = function(x, y) {
    this.$widget.offset({
      left : x,
      top : y
    });
  };

  /**
   * Moves panel into view port if position exceeds the bounds of the
   * container.
   * 
   * @private
   */
  this.ensurePosition = function() {
    var cw = $container.outerWidth();
    var ch = $container.outerHeight();
    var col = $container.offset().left;
    var cot = $container.offset().top;
    var dw = this.width();
    var dh = this.height();
    var dol = this.offset().left;
    var dot = this.offset().top;

    // window width is too small for current dialog position but bigger than
    // dialog width
    if (cw + col < dw + dol && cw >= dw) {
      this.setPosition(cw + col - dw, dot);
    }

    // window height is too small for current dialog position but bigger
    // than dialog height
    if (ch + cot < dh + dot && ch >= dh) {
      this.setPosition(dol, ch + cot - dh);
    }
  };

  /**
   * Sets the hide target for the panel.
   * 
   * @param {jQuery} $target
   */
  this.setHideTarget = function($target) {
    this.$hideTarget = $target;
  };
};
