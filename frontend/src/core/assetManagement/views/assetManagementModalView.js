// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {

	var Backbone = require('backbone');
	var Origin = require('coreJS/app/origin');
	var AssetModel = require('coreJS/assetManagement/models/assetModel');
	var AssetManagementCollectionView = require('coreJS/assetManagement/views/assetManagementCollectionView');
	var AssetManagementPreviewView = require('coreJS/assetManagement/views/assetManagementPreviewView');
	var AssetManagementView = require('coreJS/assetManagement/views/assetManagementView');
	var AssetManagementModalFiltersView = require('coreJS/assetManagement/views/assetManagementModalFiltersView');
	var AssetManagementModelAutofillView = require('coreJS/assetManagement/views/assetManagementModalAutofillView');

	var AssetManagementModalView = AssetManagementView.extend({

		preRender: function(options) {
			this.options = options;
			AssetManagementView.prototype.preRender.apply(this, arguments);
		},

		postRender: function() {
	        this.setupSubViews();
	        this.setupFilterAndSearchView();
	        if (this.options.assetType === "Asset:image" && Origin.scaffold.getCurrentModel().get('_component') === 'graphic') {
	        	this.setupImageAutofillButton();
	        }
	        this.resizeAssetPanels();
	    },

	    setupSubViews: function() {
	    	this.search = {};
	    	// Replace Asset and : so we can have both filtered and all asset types
	    	var assetType = this.options.assetType.replace('Asset', '').replace(':', '');
        
        if (assetType) {
          var filters = [assetType];
	    	  this.search.assetType = { $in: filters };  
        }
	    	
		    // Push collection through to collection view
		    this.$('.asset-management-assets-container-inner').append(new AssetManagementCollectionView({collection: this.collection, search: this.search}).$el);
		},

	    setupFilterAndSearchView: function() {
	    	new AssetManagementModalFiltersView(this.options);
	    },

	    setupImageAutofillButton: function() {
	    	new AssetManagementModelAutofillView({modalView: this});
	    },

	    resizeAssetPanels: function() {
	        var navigationHeight = $('.navigation').outerHeight();
	        var windowHeight = $(window).height();
	        var actualHeight = windowHeight - (navigationHeight);
	        this.$('.asset-management-assets-container').height(actualHeight);
	        this.$('.asset-management-preview-container').height(actualHeight);
	    },

	    onAssetClicked: function(model) {
	        this.$('.asset-management-no-preview').hide();
	        this.$('.asset-management-preview-container-inner').html(new AssetManagementPreviewView({
	            model: model
	        }).$el);

	        var filename = model.get('filename');
        	var selectedFileAlias = 'course/assets/' + filename;
        	var assetId = model.get('_id');
        	var assetObject = {
        		assetLink: selectedFileAlias,
        		assetId: assetId,
        		assetFilename: filename
        	}
	        this.data = assetObject;
	    },

	    getData: function() {
	    	return this.data;
	    }

	});

	return AssetManagementModalView;

});