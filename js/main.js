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
localStorage.getItem("tData") === null && getTableData();

function listTables() {
    const tableData = JSON.parse(localStorage.getItem("tData"));
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
        deleteBtn.setAttribute("class", "deleteButton");

        tableRow.appendChild(skillRow);
        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(deleteBtn);
        buttonRow.appendChild(buttonDiv);
        tableRow.appendChild(buttonRow);
        parent.appendChild(tableRow);
    });
}
listTables();
function footerData() {
    const parent = document.getElementById("footer");
    const date = new Date();
    const year = date.getFullYear();
    let pTag = document.createElement("p");
    pTag.innerHTML = `Copyright @ ${year} <span>HRM App</span>, All Rights Reserved`;
    pTag.setAttribute("class", "footerLogo");
    parent.appendChild(pTag);
}
footerData();

function addModal() {
    let modal = document.getElementById("addModal");
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
        modal.style.display = "none";
    }
}
addModal();

function addEmployee() {

    let addModalBtn = document.getElementById("addModalButton");
    addModalBtn.addEventListener("click", () => {
        let skills = document.getElementById("skills").value;
        let employee = {
            employeeId: document.getElementById("empId").value,
            employeeName: document.getElementById("empName").value,
            designation: document.getElementById("dsgn").value,
            dateOfBirth: document.getElementById("dob").value,
            emailId: document.getElementById("mailid").value,
            skills: [
                {
                    skillName: skills,
                    skillId: ""
                }
            ]
        }
        addEmployeeData(employee);
    })
}
addEmployee();

function addEmployeeData(rowData) {
    let tableData = JSON.parse(localStorage.getItem("tData"));
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
    deleteBtn.setAttribute("class", "deleteButton");
    tableRow.appendChild(skillRow);
    buttonDiv.appendChild(editBtn);
    buttonDiv.appendChild(deleteBtn);
    buttonRow.appendChild(buttonDiv);
    tableRow.appendChild(buttonRow);
    parent.appendChild(tableRow);
} 
