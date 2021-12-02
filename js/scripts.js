function validateForm() {
  console.log ("check1");
  var validity = true;
  var msg = "";
  var x = document.forms["firstForm"]["fullName"].value;
  if (validity==false)
      alert (msg);
  return validity;
};

function hamburger() {
  console.log("clicked");
  document.getElementById("myDropdown").classList.toggle("show");
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
function menu(){
  $( "#hum" ).click(function() {
   hamburger();
  });
}

function protestPage(){
$( "tr" ).click(function() {
  window.location = "protest_page.html?protestId=1"
});
}