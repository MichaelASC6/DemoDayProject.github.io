let specialtyTextBox = document.getElementById("myInput");
let nameTextBox = document.getElementById("name_input");
let genderTextBox = document.getElementById("gender_input");
let locationTextBox = document.getElementById("location_input");
let rangeTextBox = document.getElementById("range_input");
let searchButton = document.getElementById("searchDoctor");
let resultsPage = document.getElementById("results_page");
let mainPage = document.getElementById("main_page");
let titlePage = document.getElementById("welcome");

searchButton.onclick = function(event) {
    event.preventDefault();

    //hide the main page and just leave the header
    mainPage.style.display = "none";

    //substitute the WELCOME with Results
    titlePage.innerHTML = "Based on the filters, these are the doctors near you:";


    //capture the user's input with the variable(value)
    let specialtyInput = specialtyTextBox.value.trim();
    let name = nameTextBox.value;
    let nameInput = 'name=' + name.trim().toLowerCase() + "&";
    let genderInput = genderTextBox.value.trim();
    let locationInput = locationTextBox.value.trim().split(",").join("%2C");
    let rangeInput = rangeTextBox.value.trim();
    let coordinates;
    specialtyInput = codeCountries[countries.indexOf(specialtyInput)]; // gets the information from the dropwDown Array
    let apiKey = '&key=AIzaSyBGUACjxXKKiD1TMdxRXtTX1vYoo6SDtxc';
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationInput + apiKey;

    fetch(url)
        .then(function(response) {

            console.log(response);
            return response.json();
        })

        .then(function(myJson) {
            console.log(myJson);

            //get the coordinates in lat and long from the geocode API
            coordinates = myJson.results[0].geometry.location.lat + " " + myJson.results[0].geometry.location.lng + " "; 
            
            let api_key = '26f16a5d43ff3ae3e9bb9242b7bceb2f'; // Get your API key at developer.betterdoctor.com
            let resource_url1 = 'https://api.betterdoctor.com/2016-03-01/doctors?' + nameInput + 'specialty_uid=' + specialtyInput + '&location=' + coordinates.split(" ").join('%2C')  + "%20" + rangeInput + '&gender=' + genderInput + "&skip=0&limit=3" + '&user_key=' + api_key;
            let resource_url2 = 'https://api.betterdoctor.com/2016-03-01/doctors?name=Elizabeth&specialty_uid=dentist&location=40.78306%2C-73.971249%2C%2050&gender=female&skip=0&limit=4&user_key=26f16a5d43ff3ae3e9bb9242b7bceb2f'
            
            console.log("Here is the URL location:", coordinates.split(' ').join('%2C') + "%20" + rangeInput);
            console.log(resource_url1);

            fetch(resource_url1) 
                .then(function(response) {
                    console.log(response);

                    //return the extracted JSON data
                    return response.json();
                })

                .then(function(myJson) {
                    console.log(myJson);

                    resultsPage.innerHTML = "";
                    let temp;
                    let tempHTML = ""
                    for(let i = 0; i < myJson.data.length; i++) {
                        if (myJson.data[i].ratings[0]) {
                            if (myJson.data[i].ratings[0].image_url_large || (myJson.data[i].ratings[1] && myJson.data[i].ratings[1].image_url_large )) {
                                temp = `<p class="npi"><img src="${myJson.data[i].ratings[(myJson.data[i].ratings[1]) ? 1 : 0].image_url_large}"></p>`;
                            }
                            else {
                                temp = `No Ratings`;
                            }
                        }
                    
                        else {
                            temp = `No Ratings`;
                        }

                        tempHTML += ` 
                        <div id="description">
                            <div class="image_number">
                                <div class="image">
                                    <img src=`
                                    
                            if(myJson.data[i].profile.image_url.includes("general")){
                                tempHTML += `"images/placeHolder.jpg"`;
                            }else{
                                tempHTML += myJson.data[i].profile.image_url;
                            }
                        tempHTML += ` width="160px" height="160px" style="border-radius: 50%;">
                                </div>
                    
                                <div class="number_website_location">
                                    <p class="name"><span class="name_span">${myJson.data[i].profile.first_name + " " + myJson.data[i].profile.last_name + " " + myJson.data[i].profile.title}</span></p>
                                    <p class="number">${"<span>Work Phone #:</span> " + myJson.data[i].practices[0].phones[0].number}</p>
                                    <p class="website"></p>
                                    <p class="location">${"<span>Work Address:</span> " + myJson.data[i].practices[0].visit_address.street + " " + myJson.data[i].practices[0].visit_address.city + " " + myJson.data[i].practices[0].visit_address.state + " " + myJson.data[i].practices[0].visit_address.zip}</p>
                                    ${temp}
                                </div>
                            </div>    
                        <div class="des_in_re">
                            <div class="doctor_des">
                                <h3 class="des_titles">Description</h3>
                                ${myJson.data[i].profile.bio}
                            </div> 
                            <div class="insurance">
                                <h3 class="des_titles insurance_title">Insurance</h3>`
                            if(myJson.data[i].insurances[0]){
                                tempHTML += myJson.data[i].insurances[0].insurance_provider.name
                            }else{
                                tempHTML += "No insurance provided";
                            }
                        tempHTML += `</div>
                        </div>`
                        resultsPage.innerHTML += tempHTML;
                        tempHTML = '';
                    }
                })
        })

}



function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
        }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
        }
        }
    });
    function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
    }
    function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
        }
    }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

/*An array containing all the country names in the world:*/
var countries = ["OBGYN", "Pediatrician", "Dentist", "Sports Physical Therapy", "Sports Vision", "Surgery Hospice and Palliative Medicine" , "Sleep Medicine" , "Therapeutic Radiology" , "Speech Therapy" , "Spinal Cord Injury Medicine" , "Legal Medicine" , "Chiropractic Medical Examiner" , "Psych/Mental Health Nurse Practitioner" , "MOHS-Micrographic Surgery" , "Neuropathology" , "Nuclear Cardiology" , "Nuclear Imaging & Therapy" , "Occupational Medicine" , "Critical Care Medicine OBGYN" , "Dental Therapist" , "Dermatology" , "Vision Therapy" , "Pain Medicine" , "Blood Banking & Transfusion Medicine" , "Otolaryngology" , "Pediatric Radiology" , "Chiropractic Rehabilitation" , "Psychiatry" , "Plastic Surgery" , "Physical Therapy", "Foot Surgery" , "Rehabilitation Counselor" , "Rheumatology" , "Acupuncture" , "Addiction Psychiatry" , "Cardiopulmonary Physical Therapy" , "Critical Care Medicine" , "Audiology & Hearing Aid Fitter" , "Internal Medicine" , "Nutrition Medicine"]; //NAME


let codeCountries = ["obgyn-nurse-practitioner", "pediatrician", "dentist", "sport-physical-therapist", "sports-vision-optometrist", "Surgery Hospice and Palliative Medicine", "sleep-medicine-doctor" , "therapeutic-radiologist" , "speech-therapist" , "spinal-cord-injury-physiatrist" , "legal-medicine" , "medical-examiner-chiropractor" , "mental-health-nurse-practitioner" , "micrographic-surgeon" , "neuropathologist" ,"nuclear-cardiologist" , "nuclear-imaging-doctor" , "occupational-medicine-doctor" , "critical-care-obgyn" , "dental-therapist" , "dermatologist" , "vision-therapy-optometrist" , "pain-management-doctor" , "blood-banking-transfusion-doctor" , "ear-nose-throat-doctor" , "pediatric-radiologist" , "rehabilitation-chiropractor" , "psychiatrist" , "plastic-surgery-specialist" , "physical-therapist" , "podiatry-foot-surgeon", "rehabilitation-counselor" , "rheumatologist" , "acupuncturist" , "addiction-psychiatrist" , "cardiopulmonary-physical-therapist" , "critical-care-doctor" , "hearing-aid-audiologist" , "internist" , "nutritionist"]; //UID

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countries);


// Our slide show starts here and not anywhere else

var slideIndex = 0;
showSlides();
function showSlides() {
 var i;
 var slides = document.getElementsByClassName("mySlides");
 for (i = 0; i < slides.length; i++) {
   slides[i].style.display = "none";
 }
 slideIndex++;
 if (slideIndex > slides.length) {slideIndex = 1}
 slides[slideIndex-1].style.display = "block";
 setTimeout(showSlides, 3500); // Change image every 2 seconds
}
