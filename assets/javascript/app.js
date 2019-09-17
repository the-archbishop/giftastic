// FUNCTIONS
function buttonCreate (topics) {
    // Empty the buttons div
    $('#buttons').empty();
    
    // Create favorite button
    favBtn = $('<button>');
    favBtn.attr('id', "favorites");
    favBtn.text("favorites");
    favBtn.addClass('btn btn-danger');
    $('#buttons').append(favBtn);

    // Create a button for each Pokemon in the array
    for (i = 0; i < topics.length; i++) {
        button = $('<button>');
        button.attr('id', topics[i]);
        button.text(topics[i]);
        button.addClass('btn btn-dark pokeBtns');
        $('#buttons').append(button);
    }
}

function generateImage (id, title, rating, staticImg, animatedImg) {   
    // Create empty div
    imageCol = $('<div>');
    imageCol.addClass('col-md-6');
    row.append(imageCol);

    // Add properties to image element
    image = $('<img>');
    image.attr('src', staticImg);
    image.attr('state', "static");
    image.attr('data-static', staticImg);
    image.attr('data-ani', animatedImg);
    imageCol.append(image);

    p = $('<p>');
    if (favorites.includes(id)) {
        p.html('<i id="' + id + '" class="fav fas fa-heart" style="color:#d11919;"></i><br>Title: ' + title + "<br>Rating: " + rating);
    } else {
        p.html('<i id="' + id + '" class="fav far fa-heart" style="color:#000000;"></i><br>Title: ' + title + "<br>Rating: " + rating);
    }
    p.addClass("h6")
    imageCol.append(p);

    $('#gifs').append(row);
}

// VARIABLES
var topics = ["bulbasaur","charmander","squirtle","pikachu","sandshrew","vulpix","jigglypuff","growlithe",
"slowpoke","gastly","haunter","gengar","cubone","ditto","eevee","mewtwo"];
var newPokemon = "";
// Define empty row to populate gif images
var row = $('<div>');
row.addClass('row');
// Initialize empty favorites array
var favorites = [];

// Generate default buttons
buttonCreate(topics);

// On click Submit, add new pokemon and re-generate buttons
$('#submit').click(function() {
    newPokemon = $('#toAdd').val();
    topics.push(newPokemon);
    buttonCreate(topics);
    $('#toAdd').val("");
});

// When a pokemon button is clicked
$("body").on("click", ".pokeBtns", function(){
    // Clear out old gifs
    row.empty();
    
    pokeGif = $(this).attr('id');
    queryURL = "https://api.giphy.com/v1/gifs/search?api_key=gaXrndLx7bcz1nxQ4vXX9mTzp5jW1jrs&limit=10&q=" + pokeGif;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var results = response.data;
        console.log(results);
        for(x = 0; x < results.length; x++) {
            // Get properties of each image
            imgID = results[x].id;
            title = results[x].title;
            rating = results[x].rating;
            staticImg = results[x].images.fixed_height_still.url;
            animatedImg = results[x].images.fixed_height.url;

            generateImage(imgID, title, rating, staticImg, animatedImg);
        }
    });
});

// When an image is clicked
$("body").on("click", "img", function(){
    // Check whether it is currently static or animated
    state = $(this).attr('state');
    // if static, switch the source to animated URL, else switch back to static URL
    if(state == "static"){
        $(this).attr('src', $(this).attr('data-ani'));
        $(this).attr('state', "animated");
    } else {
        $(this).attr('src', $(this).attr('data-static'));
        $(this).attr('state', "static");
    }
});

// When a heart is clicked to mark favorite
$("body").on("click", ".fav", function(){
    favState = $(this).attr('class');
    favID = $(this).attr('id');
    if(favState == "fav far fa-heart") {
        $(this).removeClass("fav far fa-heart")
        $(this).addClass("fav fas fa-heart")
        $(this).attr('style', "color:#d11919;");
        favorites.push(favID);
    } else {
        $(this).removeClass("fav fas fa-heart")
        $(this).addClass("fav far fa-heart")
        $(this).attr('style', "color:#000000;");
        favorites.pop(favID);
    }
    // localStorage.setItem("favorites", JSON.stringify(favorites));
});

// When the favorites button is clicked
$("body").on("click", "#favorites", function(){
    // Clear out old gifs
    row.empty();
    
    for(x = 0; x < favorites.length; x++) {
        gifID = favorites[x];
        queryURL = "https://api.giphy.com/v1/gifs/" + gifID + "?&api_key=gaXrndLx7bcz1nxQ4vXX9mTzp5jW1jrs"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var results = response.data;

             // Get properties of each image
             title = results.title;
             rating = results.rating;
             staticImg = results.images.fixed_height_still.url;
             animatedImg = results.images.fixed_height.url;
 
             generateImage(gifID, title, rating, staticImg, animatedImg);
        });
    }
});