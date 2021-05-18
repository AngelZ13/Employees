$("form").submit(function (e) {
    e.preventDefault();
});

$("#EmployeeForm").hide();

$("#addbtn").click(function () {
    $("#EmployeeForm").slideToggle();
    $(this).text($(this).text() == "Open Add Employee Window" ? "Close Add Employee Window" : "Open Add Employee Window");
    $(this).toggleClass("btn-warning");
});

function Employee(id, name, salary) {
    this.id = id;
    this.name = name;
    this.salary = salary;
}

var e1 = new Employee(1, "Jason", 50000);
var e2 = new Employee(2, "Kate", 60000);
var e3 = new Employee(3, "David", 65000);


var employees = [e1, e2, e3];

$.each(employees, function (i, employee) {
    appendToEmployeeTable(employee);
});

function appendToEmployeeTable(employee) {
    $("table > tbody:last-child").append(`
                                <tr id="emp-${employee.id}">
                                    <td class="employeeData" name="id">${employee.id}</td>
                                    <td class="employeeData" name="name">${employee.name}</td>
                                    <td class="employeeData" name="salary">${employee.salary}</td>
                                    <td align="center">
                                        <div class="btn-group" role="group" aria-label="buttonGroup">
                                            <button class="btn btn-success form-control" onClick="editEmployee(${employee.id})" data-toggle="modal" data-target="#myModal">EDIT</button>
                                            <button class="btn btn-danger form-control" onClick="deleteEmployee(${employee.id})">DELETE</button>
                                        </div>
                                    </td>
                                /tr>
                                                 `);

}


$("form#EmployeeForm").submit(function () {
    var employee = {};
    var nameInput = $('input[name="name"]').val();
    var salaryInput = $('input[name="salary"]').val();

    employee["name"] = nameInput;
    employee["salary"] = salaryInput;
    employee.id = employees[employees.length - 1].id + 1;

    employees.push(employee);
    var msg = "Successfully Created Employee";
    flashMessage(msg);
    appendToEmployeeTable(employee);

    $('input[name="name"]').val('');
    $('input[name="salary"]').val('');
});


function deleteEmployee(id) {
    var action = confirm("Are you sure you want to delete this employee?");
    var msg = "Employee deleted successfully!";
    employees.forEach(function (emp, i) {
        if (emp.id == id && action) {
            employees.splice(i, 1);
            $("table #emp-" + emp.id).remove();
            flashMessage(msg);
        }
    })
}

function editEmployee(id) {

    employees.forEach(function (emp, i) {

        if (emp.id === id) {
            $(".modal").modal("toggle");

            $("#myModalLabel").text("Edit Employee: " + emp.name + " " + emp.salary);

            $(".modal-body").empty();
            $(".modal-body").append(`
                                                <form id="updateEmployee" action="" onsubmit="updateEmployee(${id}); return false;">
                                                    <label for="ModalName">Name</label>
                                                    <input id="ModalName" class="form-control" type="text" name="name" value="${emp.name}" placeholder="(Enter letters only (length between 2-15 characters)" required autocomplete="off" pattern="[A-Za-z]{2,15}" title="Only letters, between 2 and 20 characters." />
                                                    <label for="ModalSalary">Salary</label>
                                                    <input id="ModalSalary" class="form-control" type="number" name="salary" value="${emp.salary}" placeholder="Integer Number from 0 to 100000" min="0" max="100000" required autocomplete="off" />
                                           `);
            $(".modal-footer").empty().append(`
                                                            <button type="submit" form="updateEmployee" class="btn btn-primary">Save changes</button>
                                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                        </form>
                                                      `)
        };

    });
};

function updateEmployee(id) {
    var msg = "Employee updated successfully!";
    var employee = new Employee();
    employee.id = id;
    employees.forEach(function (employee, i) {
        if (employee.id == id) {
            $("#updateEmployee").children("input").each(function () {
                var value = $(this).val();
                var attr = $(this).attr("name");

                if (attr == "name") {
                    employee.name = value;
                }
                else if (attr == "salary") {
                    employee.salary = value;
                }
            });
            employees.splice(i, 1);
            employees.splice(employee.id - 1, 0, employee);

            $("tbody #emp-" + employee.id).children(".employeeData").each(function () {
                var attr = $(this).attr("name");

                if (attr == "name") {
                    $(this).text(employee.name);
                }
                else if (attr == "salary") {
                    $(this).text(employee.salary);
                }
            });
            $(".modal").modal("toggle");
            flashMessage(msg);
        }
    });
}


function flashMessage(msg) {
    $(".flashMsg").remove();
    $(".container").prepend(`
                                        <div class="col-sm-12 alert alert-dismissible alert-success" role="alert">
                                          ${msg}
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>
                                   `)
}