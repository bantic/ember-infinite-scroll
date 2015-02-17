(function(window, Ember, $){
  var InfiniteScroll = {
    PAGE:     1,  // default start page
    PER_PAGE: 25 // default per page
  };

  InfiniteScroll.ControllerMixin = Ember.Mixin.create({
    loadingMore: false,
    page: InfiniteScroll.PAGE,
    perPage: InfiniteScroll.PER_PAGE,

    actions: {
      getMore: function(){
        if (this.get('loadingMore')) return;

        this.set('loadingMore', true);
        this.get('target').send('getMore');
      },

      gotMore: function(items, nextPage){
        this.set('loadingMore', false);
        this.pushObjects(items);
        this.set('page', nextPage);
      }
    }
  });

  InfiniteScroll.RouteMixin = Ember.Mixin.create({
    actions: {
      getMore: function() {
        throw new Error("Must override Route action `getMore`.");
      },
      fetchPage: function() {
        throw new Error("Must override Route action `getMore`.");
      }
    }
  });

  InfiniteScroll.ViewMixin = Ember.Mixin.create({
    setupInfiniteScrollListener: function(){
      $('.inf-scroll-outer-container').on('scroll.infinite', Ember.run.bind(this, this.didScroll));
    },
    teardownInfiniteScrollListener: function(){
      $('.inf-scroll-outer-container').off('scroll.infinite');
    },
    didScroll: function(){
      if (this.isScrolledToRight() || this.isScrolledToBottom()) {
        this.get('controller').send('getMore');
      }
    },
    isScrolledToRight: function(){
      var distanceToViewportLeft = (
        $('.inf-scroll-inner-container').width() - $('.inf-scroll-outer-container').width());
      var viewPortLeft = $('.inf-scroll-outer-container').scrollLeft();

      if (viewPortLeft === 0) {
        // if we are at the left of the page, don't do
        // the infinite scroll thing
        return false;
      }

      return (viewPortLeft - distanceToViewportLeft);
    },
    isScrolledToBottom: function(){
      var distanceToViewportTop = (
        $('.inf-scroll-inner-container').height() - $('.inf-scroll-outer-container').height());
      var viewPortTop = $('.inf-scroll-outer-container').scrollTop();

      if (viewPortTop === 0) {
        // if we are at the top of the page, don't do
        // the infinite scroll thing
        return false;
      }

      return (viewPortTop >= distanceToViewportTop);
    }
  });

  window.InfiniteScroll = InfiniteScroll;
})(this, Ember, jQuery);
