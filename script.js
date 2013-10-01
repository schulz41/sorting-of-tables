'use strict';

var sortTable = function (selector) {
  var DSC_ORDER = false,
    ASC_ORDER = true,

    addArrow = function (e, top, content) {
      var span = document.createElement('span');

      span.style.color = '#888';
      span.style.position = 'absolute';
      span.style.right = '5px';
      span.style.top = '50%';
      span.style.marginTop = top;
      span.style.fontSize = '10px';
      span.className = 'generated-thead-element';
      span.innerHTML = content;

      e.appendChild(span);
    },

    removeArrows = function (e) {
      var arrows = e.querySelectorAll('.generated-thead-element'),
        len = arrows.length,
        i;

      for (i = 0; i < len; i++) {
        e.removeChild(arrows[i]);
      }
    },

    updateArrows = function(e, n) {
      var len = keys.length,
        i;

      len = keys.length;
      for (i = 0; i < len; i++) {
        removeArrows(keys[i]);
        if (i !== n) {
          addArrow(keys[i], '-12px', '▲');
          addArrow(keys[i], '0', '▼');
        }
      }

      if (e.order === ASC_ORDER) {
        addArrow(e, '-6px', '▲');
      } else {
        addArrow(e, '-6px', '▼');
      }
    },

    whatOrder = function (a) {
      var len = a.length,
        i;

      for (i = 1; i < len; i++) {
        if(a[i] < a[i - 1]) {
          return ASC_ORDER;
        }
      }

      return DSC_ORDER;
    },

    sortAbstract = function (n, e, a) {
      var nodesCopies = [],
        len = rows.length,
        tmp,
        i,
        j;

      if(typeof e.order === 'undefined') {
        e.order = whatOrder(a);
      }

      for (i = 0; i < len; i++) {
        nodesCopies.push(rows[i]);
      }

      // selection sort
      for (i = 1; i < len; i++) {
        for (j = i; j > 0 && (a[j-1] < a[j] ^ e.order); j--){
          tmp = a[j - 1];
          a[j - 1] = a[j];
          a[j] = tmp;
          tmp = nodesCopies[j - 1];
          nodesCopies[j - 1] = nodesCopies[j];
          nodesCopies[j] = tmp;
        }
      }

      tbody.innerHTML = '';
      for (i = 0; i < len; i++) {
        tbody.appendChild(nodesCopies[i]);
      }

      e.order = !e.order;
      updateArrows(e, n);
    },

    sortNumeric = function (n, e) {
      var a = [],
        len = rows.length,
        i;

      for (i = 0; i < len; i++) {
        a.push(parseFloat(rows[i].children[n].innerHTML));
      }

      sortAbstract(n, e, a);
    },

    sortAlphabetical = function (n, e) {
      var a = [],
        len = rows.length,
        i;

      for (i = 0; i < len; i++) {
        a.push(rows[i].children[n].innerHTML);
      }

      sortAbstract(n, e, a);
    },

    sortByDate = function(n, e) {

    },

    addEvent = function (number) {
      var isNumeric = (function () {
          var rowsCnt = rows.length;
          // chech is every value in this coll is numeric
          while (rowsCnt--) {
            if (isNaN(parseFloat(rows[rowsCnt].children[number].innerHTML))) {
              return false;
            }
          }
          return true;
        }()),

        isDate = (function () {
          var rowsCnt = rows.length,
            s;
          while (rowsCnt--) {
            s = rows[rowsCnt].children[number].innerHTML;
            if (!s.match(/\d{1,2}\.\d{2}\.\d{2,4}/) &&
                !s.match(/\d{1,2}\s+jan|fev|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)) {
              return false;
            }
          }
          return true;
        }());

      if (isNumeric) {
        keys[number].addEventListener('click', function () {
          sortNumeric(number, this);
        });
      } else {
        keys[number].addEventListener('click', function () {
          sortAlphabetical(number, this);
        });
      }
    },

    prepareTable = function () {
      var keysCnt,
        padding,
        style,
        span;

      for (keysCnt = 0; keysCnt < keysLen; keysCnt++) {
        addEvent(keysCnt);

        style = getComputedStyle(keys[keysCnt]);
        padding = style.paddingRight || 0;
        padding = parseInt(padding) + 15;
        keys[keysCnt].style.cursor = 'pointer';
        keys[keysCnt].style.paddingRight = padding + 'px';
        keys[keysCnt].style.position = 'relative';

        addArrow(keys[keysCnt], '-12px', '▲');
        addArrow(keys[keysCnt], '0', '▼');
      }
    },

    table = document.querySelector(selector),
    tbody, // TBODY element
    thead, // THEAD element
    rows, // tr elements in TBODY
    keys, // cells in THEAD element
    keysLen, // number of elements in THEAD
    keysCnt;

  // if there's no element with such selector or isn't table or there's no tbody element
  if (!table || table.tagName !== 'TABLE' || table.children.length < 2) {
    console.log('there\'s no data to sort'); // debug
    return;
  }

  thead = table.children[0]; 
  keys = thead.children[0].children;
  keysLen = keys.length;
  // if thead is empty
  if (!keysLen) {
    console.log('thead is empty'); // debug
    return;
  }

  tbody = table.children[1];
  rows = tbody.children;
  // if tbody is empty
  if (!rows.length) {
    console.log('tbody is empty'); // debug
    return;
  }

  prepareTable();
};

sortTable('table');