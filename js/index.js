// function tableSearchFunction() {
//     var input, filter, table, tr, td, i, txtValue;

//     input = document.getElementById("search-input");
//     filter = input.value.toUpperCase();
//     table = document.getElementById("issue-table");
//     tr = table.getElementsByTagName("tr");

//     for (i = 0; i < tr.length; i++) {
//       td = tr[i].getElementsByTagName("td")[0];
//       if (td) {
//         txtValue = td.textContent || td.innerText;
//         if (txtValue.toUpperCase().indexOf(filter) > -1) {
//           tr[i].style.display = "";
//         } else {
//           tr[i].style.display = "none";
//         }
//       }       
//     }
//   }


// get the modal
var modal = document.getElementById("warningModal");

// get teh button that closes the modal
var acceptButton = document.getElementById("acceptButton");

// when the user clicks on the button, close the modal
acceptButton.onclick = function() {
  modal.style.display = "none";
}

// show the modal when the page loads
window.onload = function() {
  modal.style.display = "block";
}