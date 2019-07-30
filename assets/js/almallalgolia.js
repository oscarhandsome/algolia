var search = instantsearch({
    appId: "ILID5M79BL",
    apiKey: "23b00503eb390305b04c8284315555e1",
    indexName: "almall_copy"
});

// initialize RefinementList
search.addWidget(
    instantsearch.widgets.refinementList({
        container: '#refinement-list',
        attributeName: 'categories',
    })
);

// initialize SearchBox
search.addWidget(
    instantsearch.widgets.searchBox({
        container: '#search-box',
        placeholder: 'Search for products'
    })
);


// initialize hits widget
search.addWidget(
    instantsearch.widgets.hits({
        container: '#hits',
        templates: {
            empty: 'No results',
            header: 'Header',
            // item: '<em>Hit {{objectID}}</em>: {{{_highlightResult.name.en.value}}}' +
            //       '<img src="https://cdn.mall.sayidaty.net/image/{{ image }}" alt="{{{_highlightResult.name.en.value}}}">'
             item: function(param) {
                if (param.options.en){
                 console.log(param.options.en);
                    if (param.options.en.value) {
                        console.log(param.options.en.values());
                    }
                }

                 return '<em>ProdName: ' + param.name.en + '</em>'+
                     '<img src="https://cdn.mall.sayidaty.net/image/'+ param.image +'" alt="' + param.name.en + '">';

            }
        },
        cssClasses: {
            root: 'my-searchbox',
            input: ['searchbox-input', 'input', 'form-element'],
        }
    })
);

search.start();