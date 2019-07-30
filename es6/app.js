console.log('script loaded');
// var algoliasearch = require('algoliasearch');
// var algoliasearch = require('algoliasearch/reactnative');
// var algoliasearch = require('algoliasearch/lite');
// import algoliasearch from 'algoliasearch';
//
// or just use algoliasearch if you are using a <script> tag
// if you are using AMD module loader, algoliasearch will not be defined in window,
// but in the AMD modules of the page

// var client = algoliasearch('ILID5M79BL', '23b00503eb390305b04c8284315555e1');
// console.log(client);
// var index = client.initIndex('getstarted_actors');
// console.log(index);
// var helper = algoliasearchHelper(client, index);
// console.log(helper);
//
// helper.on('result', function(content) {
//     renderHits(content);
// });
//
// function renderHits(content) {
//     $('#container').html(JSON.stringify(content, null, 2));
// }
//
// helper.search();


//Config
var applicationID = 'ILID5M79BL';
var apiKey = '23b00503eb390305b04c8284315555e1';
var indexName = 'getstarted_actors';

// var applicationID = 'latency';
// var apiKey = '249078a3d4337a8231f1665ec5a44966';
// var indexName = 'bestbuy';

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, indexName);
// var helper = algoliasearchHelper(client, indexName, {
//     facets: ['type']
// });

// function renderHits(content) {
//     $('#container').html(JSON.stringify(content, null, 2));
// }

helper.on('result', function(content) {
    renderHits(content);
});

function renderHits(content) {
    $('#container').html(function() {
        return $.map(content.hits, function(hit) {
            return '<li>' + hit._highlightResult.name.value + '<i>; Raiting: ' + hit.rating + '</i></li>';
        });
    });
}

helper.search();

$('#search-box').on('keyup', function() {
    helper.setQuery($(this).val())
        .search();
});


// $('#facet-list').on('click', 'input[type=checkbox]', function(e) {
//     var facetValue = $(this).data('facet');
//     helper.toggleFacetRefinement('type', facetValue)
//         .search();
// });
//
// function renderFacetList(content) {
//     $('#facet-list').html(function() {
//         return $.map(content.getFacetValues('type'), function(facet) {
//             var checkbox = $('<input type=checkbox>')
//                 .data('facet', facet.name)
//                 .attr('id', 'fl-' + facet.name);
//             if(facet.isRefined) checkbox.attr('checked', 'checked');
//             var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
//                 .attr('for', 'fl-' + facet.name);
//             return $('<li>').append(checkbox).append(label);
//         });
//     });
// }
//
// helper.on('result', function(content) {
//     renderFacetList(content);
//     renderHits(content);
// });


var search = instantsearch({
    appId: "ILID5M79BL",
    apiKey: "23b00503eb390305b04c8284315555e1",
    indexName: "getstarted_actors"
});

console.log(search);

search.addWidget(
    instantsearch.widgets.searchBox({
        container: "#search",
        placeholder: "Search for actors"
    })
);


search.addWidget(
    instantsearch.widgets.infiniteHits({
        container: "#hits-container",
        templates: {
            empty: "No results",
            item:
                '<div class="hit"><img src="http://image.tmdb.org/t/p/w300/{{image_path}}" /><div class="actor_name">{{name}}</div></div>'
        },
        escapeHits: true
    })
);

function customInfiniteHits(opts) {
    var container = opts.container;
    var escapeHits = opts.escapeHits;
    var transformItems = opts.transformItems;
    var containerNode = document.querySelector(container);

    var infiniteHitContext = {
        didRender: false,
        isLastPage: false
    };
    function render(renderingOptions, isFirstRendering) {
        if (isFirstRendering) {
            infiniteHitContext.observer = new IntersectionObserver(
                (entries, observer) =>
                entries.forEach(entry => {
                    if (
                        infiniteHitContext.didRender &&
                !infiniteHitContext.isLastPage &&
                entry.isIntersecting
        ) {
                observer.unobserve(entry.target);
                infiniteHitContext.didRender = false;
                renderingOptions.showMore();
            }
        })
        );
        }

        containerNode.innerText = "";
        // render the hits with vanilla JS
        renderingOptions.hits.forEach(function createHit(hit) {
            var el = document.createElement("div");
            el.className = "hit";

            var img = document.createElement("img");
            img.src = "https://image.tmdb.org/t/p/w300/" + hit.image_path;
            // fixed size because otherwise when the image is loading, it can make the sentinel visible
            // this can also be done in CSS
            img.style.height = "80px";
            el.appendChild(img);

            var name = document.createElement("div");
            name.className = "actor_name";
            name.innerHTML = hit.name;
            el.appendChild(name);

            containerNode.appendChild(el);
        });

        // this is an extra element to detect when to ask for new items
        var sentinel = document.createElement("div");
        containerNode.appendChild(sentinel);
        infiniteHitContext.observer.observe(sentinel);
        infiniteHitContext.didRender = true;
        infiniteHitContext.isLastPage = renderingOptions.isLastPage;
    }

    function unmount() {
        containerNode.innerText = "";
        if (infiniteHitContext.observer) {
            infiniteHitContext.observer.disconnect();
        }
    }

    var makeInfiniteHits = instantsearch.connectors.connectInfiniteHits(
        render,
        unmount
    );
    return makeInfiniteHits({ escapeHits, transformItems });
}


search.addWidget(
    customInfiniteHits({
        container: "#hits-container",
        escapeHits: true
    })
);
