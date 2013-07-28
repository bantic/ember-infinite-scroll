(function(window, Ember, $){
  var InfiniteScroll = {
    PAGE:     1,  // default start page
    PER_PAGE: 25 // default per page
  };

  InfiniteScroll.RouteEvents = {
    // MUSt BE OVERRIDDEN
    getMore: function(){
      // throw new Error("The Route event `getMore` must be implemented");
      var controller = this.get('controller'),
          nextPage   = controller.get('page') + 1,
          perPage    = controller.get('perPage'),
          that       = this,
          items;

      // simulate latency
      Ember.run.later( function() {
        items = that.events.fetchPage(nextPage, perPage);
        controller.gotMore( items, nextPage);
      }, 1000);
    },
    fetchPage: function(page, perPage){
      // throw new Error("The Route event `fetchPage` must be implemented");
      var items = Em.A([]);
      var firstIndex = (page-1) * perPage;
      var lastIndex  = page * perPage;
      for (var i = firstIndex; i < lastIndex; i++) {
        items.pushObject({name:''+i});
      }

      return items;
    }
  };

  InfiniteScroll.ControllerMixin = Ember.Mixin.create({
    loadingMore: false,
    page: InfiniteScroll.PAGE,
    perPage: InfiniteScroll.PER_PAGE,

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
  });

  InfiniteScroll.ViewMixin = Ember.Mixin.create({
    setupInfiniteScrollListener: function(){
      $(window).on('scroll', $.proxy(this.didScroll, this));
    },
    teardownInfiniteScrollListener: function(){
      $(window).off('scroll', $.proxy(this.didScroll, this));
    },
    didScroll: function(){
      if (this.isScrolledToBottom()) {
        this.get('controller').send('getMore');
      }
    },
    isScrolledToBottom: function(){
      var distanceToViewportTop = (
        $(document).height() - $(window).height());
      var viewPortTop = $(document).scrollTop();

      if (viewPortTop === 0) {
        // if we are at the top of the page, don't do
        // the infinite scroll thing
        return false;
      }

      return (viewPortTop - distanceToViewportTop === 0);
    }
  });

  window.InfiniteScroll = InfiniteScroll;
})(this, Ember, jQuery);
