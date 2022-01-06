
$(document).ready(function () {
    let output = '';
    //call loadtodo
    loadproject();
    loadtask();

    //get ajax project list
    function loadproject() {
        output = '';
        $.ajax({
            type: 'GET',
            url: "http://localhost:8000/api/projects/",
            success: function (res) {

                $.each(res, function (index, value) {
                    output += `<div class="col-md-3 mb-4" id="textbody"  >
                    <div class="card" style="width: 20rem;">
                    <img src=${"http://localhost:8000" + value.image} class="card-img-top img-fluid" alt="image" height=500px >
                    <div class="card-body">
                    <h5 class="card-title">${value.name}</h5>
                    <p class="card-text">${value.description}</p> 
                     <div class="mt-3">
                    <a href="index2.html?data=${value.project_id}" class="card-link text-center">More Details...</a>
                    </div></div></div></div> `;
                });
                $("#projectbody").append(output);

            }

        });
    }

    // load task list
    function loadtask() {
        output1 = '';
        $.ajax({
            type: 'GET',
            url: "http://localhost:8000/api/task/",
            success: function (res) {

                $.each(res, function (index, value) {
                    output1 += `<tr><th scope="row">${index + 1}</th><td>${value.name}</td>
                       <td>${value.description}</td><td>${value.start_date}</td><td>${value.end_date}</td><td><input type='button' value='🗑️' data-tid="${value.id}" class="tbtndelete" />
                      <input type='button' value='Edit' data-tid="${value.id}" data-bs-target="#Mymodel" data-bs-toggle="modal"  class="tbtnedit" />
                      </td></tr>`;
                });
                $("#ttbody").html(output1);

            }

        });
    }

    //create project
    $("#addprojectform").on("submit", function (e) {
        let formData = new FormData();
        e.preventDefault();
        formData.append('name', $('#name').val());
        formData.append('description', $('#description').val());
        formData.append('image', $('#image')[0].files[0]);

        console.log(formData);
        console.log(formData.image);
        $.ajax({
            url: "http://localhost:8000/api/projects/",
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            success: function (res) {
                console.log(">>>>>>>>", res)
                if (res.status == 400) {
                    alert("All Fields Are Mandatory")
                    //call loadtodo 
                    // loadtodo();
                    $("#addprojectform")[0].reset();

                }
                else {
                    alert("Create Successfully!")
                    $("#addprojectform")[0].reset();
                    loadproject();
                    loadtask();

                }
            }
        });
    });

    // create task 
    $("#addtaskform").on("submit", function (e) {
        e.preventDefault();
        let name = $("#tname").val();
        let des = $("#tdesc").val();
        let sd = $("#tsd").val();
        let ed = $("#ted").val();
        let datad = {
            "name": name,
            "description": des,
            "start_date": sd,
            "end_date": ed
        };
        console.log(datad);


        $.ajax({
            url: "http://localhost:8000/api/task/",
            type: 'POST',
            dataType: "json",
            data: datad,
            success: function (res) {
                if (res.code == 1) {
                    alert("create task successfully!");
                    $("#addprojectform")[0].reset();

                    loadtask();
                }
                else {
                    alert("error");
                }

            }
        });
    });

    // delete task
    $("#ttbody").on('click', '.tbtndelete', function () {


        let s = $(this).attr('data-tid');
        console.log(s);

        $.ajax({
            url: `http://localhost:8000/api/task/${s}`,
            type: "DELETE",
            success: function (res) {
                alert("delete");
                loadtask();

            }
        });

    });

    // edit task
    // function load single data 
    function loadsingletask(id) {
        let output = "";
        $.ajax({
            type: 'GET',
            url: `http://localhost:8000/api/task/${id}`,
            success: function (res) {
                console.log(res);
                output += `
                
        <form id="updatetaskform">

            <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" id="uname" value=${res['name']} class="form-control">

            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="udesc">
                ${res['description']} 
                </textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Starting Date</label>
                <input type="date" id="usd" class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label">End Date</label>
                <input type="date" id="ued" class="form-control">
            </div>
             <input type="hidden" id="uuid" value=${res['id']} class="form-control">


            <input type="button" value='update Task' onclick="myfun()"  class="btn btn-info">

        </form>  `;
                $("#mymodeldata").html(output);

            }


        });
    }

    $("#ttbody").on('click', '.tbtnedit', function () {
        let result = "";
        let id = $(this).attr('data-tid');
        console.log(id);
        loadsingletask(id);

    });


});


function myfun() {
    let name = document.getElementById("uname").value;
    let des = document.getElementById("udesc").value;
    let date1 = document.getElementById("usd").value;
    let date = document.getElementById("ued").value;
    let id = document.getElementById("uuid").value;

    let datad = {
        "name": name,
        "description": des,
        "start_date": date1,
        "end_date": date
    };
    console.log(datad);


    $.ajax({
        url: `http://localhost:8000/api/task/${id}`,
        type: 'PUT',
        dataType: "json",
        data: datad,
        success: function (res) {
            alert("update");
            location.reload();

        }
    });

}
