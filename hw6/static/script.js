const locURL = "https://maps.googleapis.com/maps/api/geocode/json?";
const ipinfoURL = "https://ipinfo.io/104.32.133.25?token=c845f4e5363eb2"
const searchEventsURL = "https://gqeggqesix.wl.r.appspot.com/eventSearch"
const eventsDetailURL = "https://gqeggqesix.wl.r.appspot.com/eventDetails"
const venueURL = "https://gqeggqesix.wl.r.appspot.com/venue"

const userInput = document.querySelectorAll(".input, .checkInput");
const locInput = document.getElementById("locInput");
const aotoLoc = document.getElementById("checkbox");
const postTemplate = document.querySelector("template");
const tablebody = document.querySelector("tbody")
const tablehead = document.querySelectorAll("th");

const searchBotton = document.querySelector(".searchButton");
const clearBotton = document.querySelector(".clearButton");
const recordMessage = document.getElementById("infoRecord");
const table = document.querySelector(".tableInitial");
const tableDetail = document.getElementById("tableDetail");
const arrow = document.querySelector(".diva");
const venueCard = document.querySelector(".container4");
const venuePic = document.getElementById("addPicture");

const formSet = document.querySelector("form");

async function getLocation() {
    let aoto = document.getElementById("checkbox").checked;
    if (aoto) {
        const response = await axios.get(ipinfoURL);
        const loc = await response.data.loc.split(",").map(function (item) {
            return parseFloat(item);
        });
        return loc;
    } else {
        const addressValue = document.getElementById("locInput").value;
        const params = {
            address: addressValue,
            key: 'AIzaSyAeoixfxRLynH9WKX3wsWhh9KOOWVxShJM'
        }
        const response = await axios.get(locURL, {params : params})
        if (response.data.status === "ZERO_RESULTS") {
            return null;
        } else {
            const locData = [
                                response.data.results[0].geometry.location.lat,
                                response.data.results[0].geometry.location.lng
                            ];
            return locData;           
        }
    }              
}



function makeMessageShowed() {
    recordMessage.classList.remove("noDisplay");
}
function makeMessageHide() {
    recordMessage.classList.add("noDisplay");
}

function makeTableShowed() {
    table.classList.remove("noDisplay");
}
function makeTableHide() {
    table.classList.add("noDisplay");
}
function makeTableDetailShowed() {
    tableDetail.classList.remove("noDisplay");
}
function makeTableDetailHide() {
    tableDetail.classList.add("noDisplay");
}
//Auto Detect getLocation
function makeLocationShowed() {
    locInput.classList.remove("noDisplay");
}
function makeLocationHide() {
    locInput.classList.add("noDisplay");
}
function makeArrowShowed() {
    arrow.classList.remove("noDisplay");
}
function makeArrowHide() {
    arrow.classList.add("noDisplay");
}
function makeVenueShowed() {
    venueCard.classList.remove("noDisplay");
}
function makeVenueHide() {
    venueCard.classList.add("noDisplay");
}

function autoDetectHandle() {
    var isChecked = document.getElementById("checkbox").checked;
    console.log(isChecked);
    if (isChecked) {
        makeLocationHide();
    } else {
        makeLocationShowed();
    }
}
//use to clear tablebody every time
function removeAllChildNodes(parent) {
  while (parent.children.length > 0) {
    parent.removeChild(parent.lastChild);
  }
}

async function searchBottonHandle() {
    removeAllChildNodes(tablebody)
    makeMessageHide();
    makeTableHide();
    makeTableDetailHide();
    makeArrowHide();
    makeVenueHide();
    const keyWord = userInput[0].value;
    console.log(keyWord);
    const location = userInput[4].value;
    console.log(location);
    let scope = userInput[1].value;
    console.log(scope);
    let isChecked = document.getElementById("checkbox").checked;
    const categoriesInput = userInput[2].value;
    let categories = "";
    console.log(categoriesInput)
    if (categoriesInput === "Music") {
        categories = "KZFzniwnSyZfZ7v7nJ";
    } else if (categoriesInput === "Sports") {
        categories = "KZFzniwnSyZfZ7v7nE";
    } else if (categoriesInput === "Arts & Theatre") {
        categories = "KZFzniwnSyZfZ7v7na";
    } else if (categoriesInput === "Film") {
        categories = "KZFzniwnSyZfZ7v7nn";
    } else if (categoriesInput === "Miscellaneous") {
        categories = "KZFzniwnSyZfZ7v7n1";
    }
    if (keyWord !== "" && (location !== "" || isChecked)) {
        try {
            const loc = await getLocation();
            console.log(loc)
            if (loc == null) {
                makeMessageShowed();
                makeTableHide();
                makeTableDetailHide();
                makeVenueHide();
            } else {
                const geohash = Geohash.encode(loc[0], loc[1], 7);
                console.log(geohash);                
                //params in API events search
                if (scope == "") {
                    scope = 10;
                }
                const params = {
                    apikey: 'FZGp2ugVvf6nEtONz0ufDrMgdjYPXgwA',
                    keyword: keyWord,
                    segmentId: categories,
                    radius: scope,
                    unit: 'miles',
                    geoPoint: geohash
                }
                const response = await axios.get(searchEventsURL, { params: params });
                console.log(response);
                if (response.data.page.totalElements == 0) {
                    makeMessageShowed();
                    makeTableHide();
                    makeTableDetailHide();
                    makeArrowHide();
                    makeVenueHide();
                } else {
                    makeMessageHide();
                    //sort method
                    for (let i = 2; i < tablehead.length; i++) {
                        (function(n){
                            var flag=false;
                            tablehead[n].onclick=function(){
                                // sortrows(table,n);
                                let rows = tablebody.querySelectorAll("tr");
                                rows=Array.prototype.slice.call(rows,0);

                                rows.sort(function(row1,row2){
                                    var cell1=row1.querySelectorAll("td")[n];
                                    var cell2=row2.querySelectorAll("td")[n];
                                    var val1= cell1.innerText;
                                    var val2= cell2.innerText;

                                    if(val1<val2){
                                        return -1;
                                    }else if(val1>val2){
                                        return 1;
                                    }else{
                                        return 0;
                                    }
                                });
                                if(flag){
                                    rows.reverse();
                                }
                                for(let i = 0; i < rows.length; i++){
                                    tablebody.appendChild(rows[i]);
                                }
                                flag=!flag;
                            }
                        }(i));
                    }
                    const listOfPost = response.data._embedded.events;
                    for (post of listOfPost) {
                        //date append
                        let postEl = document.importNode(postTemplate.content, true);
                        if (typeof post.dates.start.localTime == 'undefined') {
                            postEl.querySelector(".date").innerHTML = post.dates.start.localDate
                        } else {
                            postEl.querySelector(".date").innerHTML = post.dates.start.localDate + `<br>` + post.dates.start.localTime;
                        }
                        postEl.querySelector(".icon").innerHTML = `<img src=${post.images[0].url} alt='' class='imageContent'/>`;
                        //Event content append
                        const eventContent = postEl.querySelector(".event");
                        eventContent.innerHTML = `<a href="#tableDetail" style=":hover{color: darkorchid}">${post.name}</a>`;
                        const showId = post.id;
                        eventContent.addEventListener("click", ()=> eventDetailHandle(showId));
                        postEl.querySelector(".genre").textContent = post.classifications[0].segment.name;
                        postEl.querySelector(".venue").textContent = post._embedded.venues[0].name;
                        tablebody.append(postEl);
                    }
                    makeTableShowed();
                    makeTableDetailHide();
                    makeArrowHide();
                    makeVenueHide();
                    
                }
            }            
        } catch (error) {
            alert(error.message);
        }
    } else {
        makeTableHide();
        makeTableDetailHide();
        makeArrowHide();
        makeVenueHide();

    }
}
async function eventDetailHandle(id) {
    const params = {
        id: id,
        apikey: 'FZGp2ugVvf6nEtONz0ufDrMgdjYPXgwA'
    }
    const response = await axios.get(eventsDetailURL, {params: params});
    console.log(await axios.get(eventsDetailURL, {params: params}));
    tableDetail.querySelector(".detailName").innerHTML = response.data.name;
    if (typeof response.data.dates.start.localTime == 'undefined') {
        tableDetail.querySelector(".detailDate").innerHTML = response.data.dates.start.localDate;
    } else {
        tableDetail.querySelector(".detailDate").innerHTML = response.data.dates.start.localDate + `&nbsp` + response.data.dates.start.localTime;
    }
    

    //detailArtist
    if (typeof response.data._embedded.attractions == 'undefined') {
        tableDetail.querySelector("#art").classList.add("noDisplay")
    } else {
        const name = response.data._embedded.attractions;
        tableDetail.querySelector(".detailArtist").innerHTML = `<a href="${response.data._embedded.attractions[0].url}" class="hyperlink" target="_blank">${name[0].name}</a>`
        if (name.length > 1) {
            for (let i = 1; i < name.length; i++) {
                tableDetail.querySelector(".detailArtist").innerHTML +=  ` | <a href="${response.data._embedded.attractions[i].url}" class="hyperlink" target="_blank">${name[i].name}</a>`;
            }
        }
        tableDetail.querySelector("#art").classList.remove("noDisplay")
    }


    tableDetail.querySelector(".detailVenue").innerHTML = response.data._embedded.venues[0].name;

    //genre
    
    const genre = response.data.classifications[0];
    tableDetail.querySelector(".detailGenres").innerHTML = genre.segment.name;
    if (typeof genre.genre != 'undefined' && genre.genre.name != 'Undefined') {
        tableDetail.querySelector(".detailGenres").innerHTML += ` | ` + genre.genre.name;
    }
    if (typeof genre.subGenre != 'undefined' && genre.subGenre.name != 'Undefined') {
        tableDetail.querySelector(".detailGenres").innerHTML += ` | ` + genre.subGenre.name;
    }
    if (typeof genre.type != 'undefined' && genre.type.name != 'Undefined') {
        tableDetail.querySelector(".detailGenres").innerHTML += ` | ` + genre.type.name;
    }
    if (typeof genre.subType != 'undefined' && genre.subType.name != 'Undefined') {
        tableDetail.querySelector(".detailGenres").innerHTML += ` | ` + genre.subType.name;
    }


    //priceRange
    if (typeof response.data.priceRanges == 'undefined') {
        tableDetail.querySelector("#price").classList.add("noDisplay")
    } else {
        tableDetail.querySelector(".detailPrice").innerHTML = response.data.priceRanges[0].min + ` -` + response.data.priceRanges[0].max + ` ` + response.data.priceRanges[0].currency;
        tableDetail.querySelector("#price").classList.remove("noDisplay")
    }
    //status
    
    if (response.data.dates.status.code == 'onsale') {
        tableDetail.querySelector(".detailStatus").innerHTML = `<span class="status" style="background-color: green;">On Sale</span>`
    } else if(response.data.dates.status.code == 'cancelled') {
        tableDetail.querySelector(".detailStatus").innerHTML = `<span class="status" style="background-color: black;">Canceled</span>`
    } else if (response.data.dates.status.code == 'offsale') {
        tableDetail.querySelector(".detailStatus").innerHTML = `<span class="status" style="background-color: red;">Off Sale</span>`
    } else if (response.data.dates.status.code == 'postponed') {
        tableDetail.querySelector(".detailStatus").innerHTML = `<span class="status" style="background-color: orange;">Postponed</span>`
    } else if (response.data.dates.status.code == 'rescheduled') {
        tableDetail.querySelector(".detailStatus").innerHTML = `<span class="status" style="background-color: orange;">Rescheduled</span>`
    }

    //buy ticket
    tableDetail.querySelector(".detailLink").innerHTML = `<a href="${response.data.url}" class="hyperlink" target="_blank">Ticketmaster</a>`;
    if (typeof response.data.seatmap != 'undefined') {
            tableDetail.querySelector(".pic").innerHTML = `<img src="${response.data.seatmap.staticUrl}" alt="" style="height: 400px; object-fit: contain"></img>`
    } else {
         tableDetail.querySelector(".pic").innerHTML = "";
    }


    makeTableDetailShowed();
    // need to check if there is venueinfo
    makeArrowShowed();
    makeVenueHide();
    tableDetail.scrollIntoView({ behavior: "smooth" });
    showVenueHandle(response.data._embedded.venues[0].name);
}

function clearButtonHandler() {
    userInput[0].value = "";
    userInput[1].value = "";
    userInput[2].value = "Default";
    userInput[3].checked = false;
    userInput[4].value = "";
    userInput[4].classList.remove("disable_section");
    userInput[4].disabled = false;
    makeLocationShowed();
    makeMessageHide();
    makeTableHide();
    makeTableDetailHide();
    makeArrowHide();
    makeVenueHide();
}

async function showVenueHandle(name) {
    const response = await axios.get(venueURL, {params: {
        'apikey': 'FZGp2ugVvf6nEtONz0ufDrMgdjYPXgwA',
        'keyword': name
    }
    });
    console.log(response);
    if (typeof response.data._embedded == 'undefined') {
        makeArrowHide();
    } else {
        venueCard.querySelector("span").innerHTML = response.data._embedded.venues[0].name;
        if (typeof response.data._embedded.venues[0].images != 'undefined') {
            venuePic.classList.remove("noDisplay");
            venueCard.querySelector("#addPicture").innerHTML = `<img src="${response.data._embedded.venues[0].images[0].url}" alt="">`;
        } else {
            venuePic.classList.add("noDisplay");
        }
        venueCard.querySelector(".addr").innerHTML = response.data._embedded.venues[0].address.line1;
        if (typeof response.data._embedded.venues[0].state == 'undefined') {
            venueCard.querySelector(".city").innerHTML = response.data._embedded.venues[0].city.name;
        } else {
            venueCard.querySelector(".city").innerHTML = response.data._embedded.venues[0].city.name + ',&nbsp' + response.data._embedded.venues[0].state.stateCode;
        }
        
        venueCard.querySelector(".code").innerHTML = response.data._embedded.venues[0].postalCode;
        const conbination = response.data._embedded.venues[0].name + response.data._embedded.venues[0].address.line1 + response.data._embedded.venues[0].city.name;
        console.log(conbination)
        venueCard.querySelector("#googleMap").innerHTML = `<a href="https://www.google.com/maps/search/?api=1&query=${conbination}" class="hyperlink" target="_blank">Open in Google Maps</a>`
        
        venueCard.querySelector("#moreEvents").innerHTML = `<a href="${response.data._embedded.venues[0].url}" class="hyperlink" target="_blank">More events at this venue</a>`
    }
    
}

function showVenue() {
    //venuecard ！
    makeArrowHide();
    makeVenueShowed();
    venueCard.scrollIntoView({ behavior: "smooth" });
}


console.log(userInput);

aotoLoc.addEventListener("change", autoDetectHandle);
searchBotton.addEventListener("click", searchBottonHandle);
clearBotton.addEventListener("click", clearButtonHandler);
arrow.addEventListener("click", showVenue);
searchBotton.addEventListener("click", () => {
    formSet.reportValidity();
}, false)



const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'; // (geohash-specific) Base32 map


/**
 * Geohash: Gustavo Niemeyer’s geocoding system.
 */
class Geohash {

    /**
     * Encodes latitude/longitude to geohash, either to specified precision or to automatically
     * evaluated precision.
     *
     * @param   {number} lat - Latitude in degrees.
     * @param   {number} lon - Longitude in degrees.
     * @param   {number} [precision] - Number of characters in resulting geohash.
     * @returns {string} Geohash of supplied latitude/longitude.
     * @throws  Invalid geohash.
     *
     * @example
     *     const geohash = Geohash.encode(52.205, 0.119, 7); // => 'u120fxw'
     */
    static encode(lat, lon, precision) {
        // infer precision?
        if (typeof precision == 'undefined') {
            // refine geohash until it matches precision of supplied lat/lon
            for (let p=1; p<=12; p++) {
                const hash = Geohash.encode(lat, lon, p);
                const posn = Geohash.decode(hash);
                if (posn.lat==lat && posn.lon==lon) return hash;
            }
            precision = 12; // set to maximum
        }

        lat = Number(lat);
        lon = Number(lon);
        precision = Number(precision);

        if (isNaN(lat) || isNaN(lon) || isNaN(precision)) throw new Error('Invalid geohash');

        let idx = 0; // index into base32 map
        let bit = 0; // each char holds 5 bits
        let evenBit = true;
        let geohash = '';

        let latMin =  -90, latMax =  90;
        let lonMin = -180, lonMax = 180;

        while (geohash.length < precision) {
            if (evenBit) {
                // bisect E-W longitude
                const lonMid = (lonMin + lonMax) / 2;
                if (lon >= lonMid) {
                    idx = idx*2 + 1;
                    lonMin = lonMid;
                } else {
                    idx = idx*2;
                    lonMax = lonMid;
                }
            } else {
                // bisect N-S latitude
                const latMid = (latMin + latMax) / 2;
                if (lat >= latMid) {
                    idx = idx*2 + 1;
                    latMin = latMid;
                } else {
                    idx = idx*2;
                    latMax = latMid;
                }
            }
            evenBit = !evenBit;

            if (++bit == 5) {
                // 5 bits gives us a character: append it and start over
                geohash += base32.charAt(idx);
                bit = 0;
                idx = 0;
            }
        }

        return geohash;
    }
}