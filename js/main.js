let tableData = JSON.parse(localStorage.getItem("tData"));
let modal = document.getElementById("addModal");
// localStorage.clear();
const getTableData = () => {
    fetch('json/details.json')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length) {
                localStorage.setItem("tData", JSON.stringify(data));
                listTables();
            }
            else {
                alert("no data");
            }
        })
        .catch(error => {
            let parent = document.querySelector(".tableSection");
            let div = document.createElement("div");
            let span = document.createElement("span");
            span.innerHTML = `Error.Data not found`;
            div.setAttribute("class", "errorDiv");
            div.appendChild(span)
            parent.appendChild(div);
        })
}


initData();

function initData() {
    if(!(localStorage.getItem("tData"))) {
        getTableData(); 
    }
    else {
        listTables();
    }
    footerData();
    addModal();
}

function listTables() {
    
    let parent = document.getElementById("tableOfEmployees");

    tableData.forEach((rowData) => {
        const tableRow = document.createElement("tr");
        const skillRow = document.createElement("td");
        const buttonRow = document.createElement("td");
        const buttonDiv = document.createElement("div");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        tableRow.innerHTML = `<td>${rowData.employeeId}</td>
        <td>${rowData.employeeName}</td>
        <td>${rowData.designation}</td>
        <td>${rowData.dateOfBirth}</td>
        <td>${rowData.emailId}</td>`;

        rowData.skills.forEach((skillData) => {
            const spanTag = document.createElement("span");
            const length = rowData.skills.length;

            (length - 1) == rowData.skills.indexOf(skillData) ?
                spanTag.innerHTML = skillData.skillName :
                spanTag.innerHTML = `${skillData.skillName},`;

            skillRow.appendChild(spanTag);
        })
        editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        buttonDiv.setAttribute("class", "buttonBox");
        editBtn.setAttribute("class", "editButton");
        editBtn.setAttribute("id", rowData.employeeId);
        deleteBtn.setAttribute("class", "deleteButton");
        deleteBtn.setAttribute("id", rowData.employeeId);

        tableRow.appendChild(skillRow);
        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(deleteBtn);
        buttonRow.appendChild(buttonDiv);
        tableRow.appendChild(buttonRow);
        parent.appendChild(tableRow);
    });
}

function footerData() {
    const parent = document.getElementById("footer");
    const date = new Date();
    const year = date.getFullYear();
    let pTag = document.createElement("p");
    pTag.innerHTML = `Copyright @ ${year} <span>HRM App</span>, All Rights Reserved`;
    pTag.setAttribute("class", "footerLogo");
    parent.appendChild(pTag);
}

function addModal() {
    
    let button = document.getElementById("addButton");
    let span = modal.querySelector(".close");
    let addModalBtn = document.getElementById("addModalButton");
    button.onclick = () => {
        modal.style.display = "block";
    }
    span.onclick = () => {
        modal.style.display = "none";
    }
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    })
    addModalBtn.onclick = () => {
        addEmployee();
    }

}

function addEmployee() {
   
    let empId = document.getElementById("empId").value;
    let empName = document.getElementById("empName").value;
    let dsgn = document.getElementById("dsgn").value;
    let dob = document.getElementById("dob").value;
    let mail = document.getElementById("mailid").value;
    let skills = document.getElementById("skills").value;

    if (empId === "" || empName === "" || dsgn === "" || dob === "" || mail === "" || skills === "") {
        alert("Enter all input fields");
    } 
    else {
        let value = mailValidation(mail);
        if (value) {
            let employee = {
                employeeId: empId,
                employeeName: empName,
                designation: dsgn,
                dateOfBirth: dob,
                emailId: mail,
                skills: [
                    {
                        skillName: skills,
                        skillId: ""
                    }
                ]
            }
            addEmployeeData(employee);
            modal.style.display = "none";
        }
    }
}

function addEmployeeData(rowData) {
    
    tableData.push(rowData);
    localStorage.setItem("tData", JSON.stringify(tableData));

    let parent = document.getElementById("tableOfEmployees");
    const tableRow = document.createElement("tr");
    const skillRow = document.createElement("td");
    const buttonRow = document.createElement("td");
    const buttonDiv = document.createElement("div");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    tableRow.innerHTML = `<td>${rowData.employeeId}</td>
        <td>${rowData.employeeName}</td>
        <td>${rowData.designation}</td>
        <td>${rowData.dateOfBirth}</td>
        <td>${rowData.emailId}</td>`;

    rowData.skills.forEach((skillData) => {
        const spanTag = document.createElement("span");
        const length = rowData.skills.length;
        (length - 1) == rowData.skills.indexOf(skillData) ?
            spanTag.innerHTML = skillData.skillName :
            spanTag.innerHTML = `${skillData.skillName},`;
        skillRow.appendChild(spanTag);
    })

    editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    buttonDiv.setAttribute("class", "buttonBox");
    editBtn.setAttribute("class", "editButton");
    editBtn.setAttribute("data-id", rowData.employeeId);
    deleteBtn.setAttribute("class", "deleteButton");
    deleteBtn.setAttribute("data-id", rowData.employeeId);

    tableRow.appendChild(skillRow);
    buttonDiv.appendChild(editBtn);
    buttonDiv.appendChild(deleteBtn);
    buttonRow.appendChild(buttonDiv);
    tableRow.appendChild(buttonRow);
    parent.appendChild(tableRow);
}

function mailValidation(mailVal) {

    let atSymbol = mailVal.indexOf("@");
    let dot = mailVal.indexOf(".");

    if (atSymbol < 1) {
        alert("Enter valid email id");
        return false;
    }
    else if (dot <= atSymbol + 2) {
        alert("Enter valid email id");
        return false;
    }
    else if (dot === mailVal.length - 1) {
        alert("Enter valid email id");
        return false;
    }
    else {
        return true;
    }
}

function updateButton() {
    let modal = document.getElementById("updateModal");
    let button = document.querySelectorAll(".editButton");
    console.log(button);
    let span = modal.querySelector(".close");
    let updateModalBtn = document.getElementById("updateModalButton");
    span.onclick = () => {
        modal.style.display = "none";
    }
    button.forEach((btn) => {
        btn.onclick = () => {
            modal.style.display = "block";
            console.log(btn.id);
            updateEmployee(btn.id);
        }
    })
    updateModalBtn.onclick = () => {
        modal.style.display = "none";
    }
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    })
}
updateButton();

function updateEmployee(id) {
    let updateBtn = document.getElementById("updateModalButton");
    let tableData = JSON.parse(localStorage.getItem("tData"));
    tableData.forEach((rowData) => {
        if (id == rowData.employeeId) {
            document.getElementById("empIdU").value = rowData.employeeId;
            document.getElementById("empNameU").value = rowData.employeeName;
            document.getElementById("dsgnU").value = rowData.designation;
            document.getElementById("dobU").value = rowData.dateOfBirth;
            document.getElementById("mailidU").value = rowData.emailId;
            let skill = '';
            rowData.skills.forEach((skillData) => {
                const length = rowData.skills.length;
                (length - 1) == rowData.skills.indexOf(skillData) ?
                    skill += skillData.skillName :
                    skill += `${skillData.skillName},`;
            })
            document.getElementById("skillsU").value = skill;
        }
        updateBtn.addEventListener("click", () => {
            let tableData = JSON.parse(localStorage.getItem("tData"));
            tableData.forEach((rowData => {
                if(id == rowData.employeeId) {
                    rowData.employeeId = document.getElementById("empIdU").value;
                    rowData.employeeName = document.getElementById("empNameU").value;
                    rowData.designation = document.getElementById("dsgnU").value;
                    rowData.dateOfBirth = document.getElementById("dobU").value;
                    rowData.emailId = document.getElementById("mailidU").value;
                    localStorage.setItem("tData", JSON.stringify(tableData));
                    window.location.reload();
                }
            }))
        })
    })
}