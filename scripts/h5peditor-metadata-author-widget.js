/*global H5P*/
var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

// TODO: This should be sent from the server
var MOCKED_SEMANTICS = [
  {
    label: "Author's name",
    name: "authorName",
    optional: true,
    type: "text"
  },
  {
    "name": "authorRole",
    "type": "select",
    "label": "Author's role",
    "options": [
      {
        "value": "Designer",
        "label": "Designer"
      },
      {
        "value": "Illustrator",
        "label": "Illustrator"
      },
      {
        "value": "Photographer",
        "label": "Photographer"
      }
    ],
    default: "Designer"
  }
];

// TODO: This will come from params.metdata.authors when the editor is initialized
var AUTHORS = [
  {
    name: 'Thomas Marstrander',
    role: 'Photographer'
  },
  {
    name: 'Frode Petterson',
    role: 'Illustrator'
  }
]

H5PEditor.metadataAuthorWidget = function (params, group, parent) {

  params.authors = AUTHORS;

  var widget = H5PEditor.$('<div class="h5p-metadata-author-widget"></div>');

  ns.processSemanticsChunk(MOCKED_SEMANTICS, {}, widget, parent);

  var button = H5PEditor.$('<div class="file authorList">' +
    '<a class="h5p-metadata-button h5p-add-author">' +
      '+ Add author' +
    '</a>' +
  '</div>')
  .click(function () {
    addAuthor();
  });

  widget.append(button);

  var authorListWrapper = H5PEditor.$('<div class="h5p-author-list-wrapper"><ul class="h5p-author-list"></ul></div>');
  widget.append(authorListWrapper);
  renderAuthorList();

  widget.appendTo(group.$group.find('.content'))

  function addAuthor() {
    var authorNameInput = (widget.find('.field-name-authorName')).find('input');
    var authorRoleInput = (widget.find('.field-name-authorRole')).find('select');

    // TODO serverside validation?
    if (authorNameInput.val().trim() == '') {
      return;
    }

    AUTHORS.push({
      name: authorNameInput.val(),
      role: authorRoleInput.val()
    })
    renderAuthorList();
    params.authors = AUTHORS;
    authorNameInput.val(' ');
    authorRoleInput.val(1);
  }

  function removeAuthor(author) {
    AUTHORS = AUTHORS.filter(function(e) {
      return e !== author
    })
    renderAuthorList();
    params.authors = AUTHORS;
  }

  function renderAuthorList() {
    var wrapper = widget.find('.h5p-author-list-wrapper');
    wrapper.empty();

    authorList = H5PEditor.$('<ul></ul>');
    AUTHORS.forEach(function(author) {
      var listItem = H5PEditor.$('<li>' + author.name + ' <span>' + author.role + '</span></li>').data('author', author);
      listItem.append('<button>x</button>').click(function() {
        removeAuthor(H5PEditor.$(this).data().author)
      })
      authorList.append(listItem);
    });

    wrapper.append(authorList);
  }
}
