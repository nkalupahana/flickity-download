/*!
 * Flickity fullscreen v1.1.1
 * Enable fullscreen view for Flickity
 */

/*jshint browser: true, undef: true, unused: true, strict: true*/

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'flickity/js/index',
    ], factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('flickity')
    );
  } else {
    // browser global
    factory(
      window.Flickity
    );
  }

}( window, function factory( Flickity ) {

'use strict';

Flickity.createMethods.push('_createDownload');
var proto = Flickity.prototype;


proto._createDownload = function() {
  if ( !this.options.download ) {
    return;
  }
  // buttons
  this.downloadButton = new DownloadButton(this);

  this.on( 'activate', this._downloadImage );
  this.on( 'deactivate', this._downloadImage );
};

// ----- activation ----- //

proto._downloadImage = function() {
  let childMethod = this.isActive ? 'appendChild' : 'removeChild';
  this.element[ childMethod ]( this.downloadButton.element );
  // activate or deactivate buttons
  let activeMethod = this.isActive ? 'activate' : 'deactivate';
  this.downloadButton[ activeMethod ]();
};

// ----- FullscreenButton ----- //

proto.downloadImage = function(dataurl, flickity) {
  if (flickity.nativeDownload) {
    flickity.nativeDownload(dataurl);
  } else {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = "image.webp";
    link.click();
  }
};

function DownloadButton( flickity ) {
  this.createButton();
  this.createIcon();
  // events
  // trigger viewFullscreen or exitFullscreen on click
  this.onClick = function() {
    flickity["downloadImage"](flickity.selectedElement.querySelector('img').src, flickity);
  };
  this.clickHandler = this.onClick.bind( this );
}

DownloadButton.prototype.createButton = function() {
  var element = this.element = document.createElement('button');
  element.className = 'flickity-button flickity-download-button';
  // prevent button from submitting form
  element.setAttribute( 'type', 'button' );
  // set label
  let label = "Download image";
  element.setAttribute('aria-label', label);
  element.title = label;
};

var svgURI = 'http://www.w3.org/2000/svg';

DownloadButton.prototype.createIcon = function() {
  var svg = document.createElementNS( svgURI, 'svg');
  svg.setAttribute( 'class', 'flickity-button-icon' );
  svg.setAttribute( 'viewBox', '0 0 512 512' );
  // path & direction
  var path = document.createElementNS( svgURI, 'path');
  var direction = "M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03";
  path.setAttribute( 'd', direction );
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-width", "40");
  // put it together
  svg.appendChild( path );
  this.element.appendChild( svg );
};

DownloadButton.prototype.activate = function() {
  this.element.addEventListener( 'click', this.clickHandler );
};

DownloadButton.prototype.deactivate = function() {
  this.element.removeEventListener( 'click', this.clickHandler );
};

Flickity.DownloadButton = DownloadButton;

// ----- fin ----- //

return Flickity;

}));
