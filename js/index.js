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

// ===============================================================

function defangDatetime() {
  var currentDatetime = new Date();

  var formattedDatetime = currentDatetime
    .toISOString()
    .replace(/:/g, "_")
    .replace(/\./g, "-")
    .replace(/T/g, "__TIME-")
    .replace(/Z/g, "");
  return `_DATE-${formattedDatetime}`;
}

// used to download a TEXT file ***
function downloadFile(input, name, extension) {
  var blob = new Blob([input], { type: "text/plain;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  // link.download = 'output.txt'
  link.download = `${name}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// function used to create multiple files and add them to a zip to download
function downloadZip(files, textOrImage) {
  var zip = new JSZip();
  var current_time = defangDatetime();

  // add files to zip
  files.forEach((file) => {
    zip.file(`${file.name}.${file.extension}`, file.content);
  });

  // Generate the zip file and download it

  zip.generateAsync({ type: "blob" }).then(function (content) {
    var url = URL.createObjectURL(content);
    var link = document.createElement("a");
    link.href = url;
    link.download = `encrypted_${textOrImage}_${current_time}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
