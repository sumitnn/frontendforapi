
$(document).ready(function () {
    loadproject();
    // geturl data 
    function GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return decodeURIComponent(sParameterName[1]);
            }
        }
    }



    //get ajax project list
    function loadproject() {

        let id = GetURLParameter('data');

        let output = '';
        $.ajax({
            type: 'GET',
            url: `http://localhost:8000/api/projects/${id}/`,
            success: function (res) {

                output += `<tr>
                    <th scope="row">${res['project_id']}</th>
                    
                    <td>${res['name']}</td>

                       <td><img src="http://localhost:8000${res['image']}" class="img-fluid" height=100px width=100px /></td>
                       <td>${res['description']}</td>
                       <td><input type='button' value='🗑️' data-pid="${res['project_id']}" class="pbtndelete" />
                      <input type='button' value='Edit' data-pid="${res['project_id']}" id="btaccess" data-bs-target="#Mymodel1" onclick="fun()" data-bs-toggle="modal" data-status= class="pbtnedit" />
                      </td></tr>`;

                $("#ttbody").html(output);

            }

        });
    }

    // delete project
    $("#ttbody").on('click', '.pbtndelete', function () {

        let s = $(this).attr('data-pid');
        console.log(s);

        $.ajax({
            url: `http://localhost:8000/api/projects/${s}/`,
            type: "DELETE",
            success: function (res) {
                alert("delete");
                window.location.href = "http://127.0.0.1:5500/home.html?";

            }
        });

    });



});


function myfun1() {
    let formData = new FormData();

    formData.append('name', $('#ppname').val());
    formData.append('description', $('#ppdesc').val());
    formData.append('image', $('#ppimage')[0].files[0]);

    let id = document.getElementById("uuid").value;


    console.log(id);
    console.log(formData);


    $.ajax({
        url: `http://localhost:8000/api/projects/${id}/`,
        type: 'PUT',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data',
        success: function (res) {
            alert("update");
            location.reload();

        }
    });

}

function fun() {
    var btn = document.getElementById('btaccess');
    var id = btn.getAttribute('data-pid');
    let output = "";
    $.ajax({
        type: 'GET',
        url: `http://localhost:8000/api/projects/${id}`,
        success: function (res) {
            console.log(res);
            output += `
                
        <form id="updateprojectform" enctype="multipart/form-data">

            <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" id="ppname" value=${res['name']} class="form-control">

            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="ppdesc">
                ${res['description']} 
                </textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Image</label>
                <input type="file" id="ppimage" value=${res['image']}  class="form-control">
            </div>
             <input type="hidden" id="uuid" value=${res['project_id']} class="form-control">


            <input type="button" value='update Project' onclick="myfun1()"  class="btn btn-info">

        </form>  `;
            $("#mymodeldataa").html(output);

        }



    });
}