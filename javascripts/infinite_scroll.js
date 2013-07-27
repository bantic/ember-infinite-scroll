(function(window){
  var InfiniteScroll = {
    PAGE:     1,  // default start page
    PER_PAGE: 25 // default per page
  };

  InfiniteScroll.RouteEvents = {
    getMore: function(){
        var controller = this.get('controller'),
            nextPage = controller.get('page') + 1,
            perPage = controller.get('perPage'),
            that = this,
            items;

        Ember.run.later( function() {
          items = that.events.fetchPage(nextPage, perPage);
          controller.gotMore( items, nextPage);
        }, 1000);
    },
    fetchPage: function(page, perPage){
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
    boundedDidScroll: function() {
      if (this._boundedDidScroll) return this._boundedDidScroll;

      this._boundedDidScroll = $.proxy(this.didScroll, this);
      return this._boundedDidScroll;
    },
    setupInfiniteScrollListener: function(){
      $(window).bind('scroll', this.boundedDidScroll());
    },
    teardownInfiniteScrollListener: function(){
      $(window).unbind('scroll', this.boundedDidScroll());
    },
    didScroll: function(){
      if (this.isScrolledToBottom()) {
        this.get('controller').send('getMore');
      }
    },
    isScrolledToBottom: function(){
      var distanceToTop = $(document).height() - $(window).height(),
          top           = $(document).scrollTop();

      if (top == 0) {
        return false;
      }

      return (top - distanceToTop == 0);
    }
  });

  window.InfiniteScroll = InfiniteScroll;
})(this);
