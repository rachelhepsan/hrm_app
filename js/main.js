const getFromLocalStorage = (keyName) => {
    return localStorage.getItem(keyName);
}


let tableData = JSON.parse(getFromLocalStorage("tData"));
let skillData = JSON.parse(getFromLocalStorage("sData"));
let modal = document.getElementById("addModal");
let deleteModal = document.getElementById("deleteModal");
let updateModal = document.getElementById("updateModal");
let skillInput = document.getElementById("skills");
let updateSkill = document.getElementById("skillsU");
let autoSuggestion = document.getElementById("autoSuggestion");
let autoSuggestionUpdate = document.getElementById("autoSuggestionUpdate");
let skillInputBox = document.getElementById("skillInputBox");
let skillArray = [];


skillInput.addEventListener("input", (e) => {
    if (!(e.target.value === "")) {
        const similarSkill = skillData.filter(({ skill }) => skill.toLowerCase().startsWith(e.target.value.toLowerCase()));
        autoSuggestion.innerHTML = "";
        similarSkill.forEach(({ skill, skillId }) => {
            let div = document.createElement("div");
            div.innerHTML = skill;
            div.setAttribute("id", skillId);
            div.setAttribute("class", "option")
            div.onclick = (element) => {
                addEmployeeSkill(element);
            }
            autoSuggestion.appendChild(div);
        })
        autoSuggestion.style.display = "block";
    }
    else {
        autoSuggestion.style.display = "none";
    }
})

updateSkill.addEventListener("input", (e) => {
    if (e.target.value) {
        const similarSkill = skillData.filter(({ skill }) => skill.toLowerCase().startsWith(e.target.value.toLowerCase()));
        autoSuggestionUpdate.innerHTML = "";
        similarSkill.forEach(({ skill, skillId }) => {
            let div = document.createElement("div");
            div.innerHTML = skill;
            div.setAttribute("id", skillId);
            div.setAttribute("class", "option")
            div.onclick = (element) => {
                updateEmployeeSkill(element);
            }
            autoSuggestionUpdate.appendChild(div);
        })
        autoSuggestionUpdate.style.display = "block";
    }
})

function addEmployeeSkill(element) {
    skillArray.push(element.target.innerHTML);
    let spanSkill = document.createElement("span");
    let crossIcon = document.createElement("i");
    spanSkill.innerHTML = element.target.innerHTML;
    spanSkill.setAttribute("class", "addSkillSpan");
    crossIcon.setAttribute("class", "fa-solid fa-xmark");
    crossIcon.setAttribute("id", element.target.innerHTML);
    spanSkill.appendChild(crossIcon);
    crossIcon.addEventListener("click", () => {
        let skill = crossIcon.getAttribute("id");
        if (skillArray.includes(skill)) {
            let index = skillArray.indexOf(skill);
            skillArray.splice(index, 1);
            spanSkill.remove();
        }
    })
    skillInputBox.prepend(spanSkill);
    skillInput.value = "";
    autoSuggestion.style.display = "none";
}

function updateEmployeeSkill(element) {
    skillArray.push(element.target.innerHTML);
    let spanSkill = document.createElement("span");
    let crossIcon = document.createElement("i");
    spanSkill.innerHTML = element.target.innerHTML;
    spanSkill.setAttribute("class", "addSkillSpan");
    crossIcon.setAttribute("class", "fa-solid fa-xmark");
    crossIcon.setAttribute("id", element.target.innerHTML);
    spanSkill.appendChild(crossIcon);
    crossIcon.addEventListener("click", () => {
        let skill = crossIcon.getAttribute("id");
        if (skillArray.includes(skill)) {
            let index = skillArray.indexOf(skill);
            skillArray.splice(index, 1);
            spanSkill.remove();
        }
    })
    skillUpdateBox.prepend(spanSkill);
    updateSkill.value = "";
    autoSuggestionUpdate.style.display = "none";
}

function cross() {
    let crossMarks = document.querySelectorAll(".addSkillSpan i");
    console.log(crossMarks);
    crossMarks.forEach(cross => {
        console.log(cross);
    })
}


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
            let parent = document.getElementById("tableBody");
            let div = document.createElement("div");
            let span = document.createElement("span");
            span.innerHTML = `Error.Data not found`;
            div.setAttribute("class", "errorDiv");
            div.appendChild(span)
            parent.appendChild(div);
        })
}

const getSkillData = () => {
    fetch('json/skills.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("sData", JSON.stringify(data));
            skillSuggestion();
        })
}


initData();

function initData() {
    if (!(localStorage.getItem("tData"))) {
        getTableData();
    }
    else {
        listTables();
    }
    getSkillData();
    footerData();
    addModal();
    updateButton();
    deleteButton();
    sortTable();
    filter();
}

function listTables() {

    let parent = document.getElementById("tableBody");

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
            spanTag.setAttribute("class", "skillSpan");
            const length = rowData.skills.length;

            (length - 1) == rowData.skills.indexOf(skillData) ?
                spanTag.innerHTML = skillData.skillName :
                spanTag.innerHTML = `${skillData.skillName},`;

            skillRow.appendChild(spanTag);
        })
        editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square" id=edt-${rowData.employeeId}></i>`;
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash" id=del-${rowData.employeeId}></i>`;

        buttonDiv.setAttribute("class", "buttonBox");
        buttonDiv.addEventListener("click", (event) => {
            let action = event.target.id.split("-");
            if(action[0] === "edt") {
                updateEmployee(action[1]);
            }
            else {
                deleteEmployee(action[1]);
            }
        })
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

function footerData() {
    const parent = document.getElementById("footer");
    const date = new Date();
    const year = date.getFullYear();
    let pTag = document.createElement("p");
    pTag.innerHTML = `Copyright @ ${year} <span>HRM App</span>, All Rights Reserved`;
    pTag.setAttribute("class", "footerLogo");
    parent.appendChild(pTag);
}

function skillReset() {
    document.querySelectorAll(".addSkillSpan").forEach(span => {
        span.remove();
    })
}

function addModal() {

    let button = document.getElementById("addButton");
    let span = document.getElementById("addClose");
    let addModalBtn = document.getElementById("addModalButton");
    let addForm = document.getElementById("addForm");
    button.onclick = () => {
        modal.style.display = "block";
        cross();
    }
    span.onclick = () => {
        modal.style.display = "none";
        skillReset();
        addForm.reset();
    }
    modal.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    })
    addModalBtn.onclick = () => {
        addEmployee();
        addForm.reset();
        skillReset();
    }
}

function addEmployee() {

    let empId = document.getElementById("empId").value;
    let empName = document.getElementById("empName").value;
    let dsgn = document.getElementById("dsgn").value;
    let dob = document.getElementById("dob").value;
    let mail = document.getElementById("mailid").value;
    let modal = document.getElementById("addModal");

    if (empId === "" || empName === "" || dsgn === "" || dob === "" || mail === "") {
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
                skills: []
            }
            skillArray.forEach((skillElement) => {
                let skillObject = {
                    skillName: skillElement,
                    skillId: ""
                }
                employee.skills.push(skillObject);
            })
            modal.style.display = "none";
            addEmployeeData(employee);
        }
    }
}

function addEmployeeData(rowData) {

    tableData.push(rowData);
    localStorage.setItem("tData", JSON.stringify(tableData));

    let parent = document.getElementById("tableBody");
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
        spanTag.setAttribute("class", "skillSpan");
        const length = rowData.skills.length;
        (length - 1) == rowData.skills.indexOf(skillData) ?
            spanTag.innerHTML = skillData.skillName :
            spanTag.innerHTML = `${skillData.skillName},`;
        skillRow.appendChild(spanTag);
    })

    editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    buttonDiv.setAttribute("class", "buttonBox");
    buttonDiv.addEventListener("click", (event) => {
        let action = event.target.id.split("-");
        if(action[0] === "edt") {
            updateEmployee(action[1]);
        }
        else {
            deleteEmployee(action[1]);
        }
    })
    editBtn.setAttribute("class", "editButton");
    deleteBtn.setAttribute("class", "deleteButton");

    tableRow.appendChild(skillRow);
    buttonDiv.appendChild(editBtn);
    buttonDiv.appendChild(deleteBtn);
    buttonRow.appendChild(buttonDiv);
    tableRow.appendChild(buttonRow);
    parent.appendChild(tableRow);
    updateButton();
    deleteButton();
}

function mailValidation(mailVal) {

    let atSymbol = mailVal.indexOf("@");
    let dot = mailVal.lastIndexOf(".");

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
    let updateClose = document.getElementById("updateClose");
    updateClose.onclick = () => {
        modal.style.display = "none";
        skillReset();
    }
    modal.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    })
}


function updateEmployee(id) {
    let updateBtn = document.getElementById("updateModalButton");
    let skillUpdateBox = document.getElementById("skillUpdateBox");
    let empId, empName, dsgn, dob, mail;
    skillArray = [];
    tableData.forEach((rowData) => {
        if (id == rowData.employeeId) {
            document.getElementById("empIdU").value = rowData.employeeId;
            document.getElementById("empNameU").value = rowData.employeeName;
            document.getElementById("dsgnU").value = rowData.designation;
            document.getElementById("dobU").value = rowData.dateOfBirth;
            document.getElementById("mailidU").value = rowData.emailId;
            rowData.skills.forEach((skillData) => {
                skillArray.push(skillData.skillName);
            })
            skillArray.forEach(skillELement => {
                let spanSkill = document.createElement("span");
                let crossIcon = document.createElement("i");
                spanSkill.innerHTML = skillELement;
                spanSkill.setAttribute("class", "addSkillSpan");
                crossIcon.setAttribute("class", "fa-solid fa-xmark");
                crossIcon.setAttribute("id", skillELement);
                spanSkill.appendChild(crossIcon);
                crossIcon.addEventListener("click", () => {
                    let skill = crossIcon.getAttribute("id");
                    if (skillArray.includes(skill)) {
                        let index = skillArray.indexOf(skill);
                        skillArray.splice(index, 1);
                        spanSkill.remove();
                    }
                })
                skillUpdateBox.prepend(spanSkill);
            })
        }
    })

    updateBtn.addEventListener("click", () => {
        empId = document.getElementById("empIdU").value;
        empName = document.getElementById("empNameU").value;
        dsgn = document.getElementById("dsgnU").value;
        dob = document.getElementById("dobU").value;
        mail = document.getElementById("mailidU").value;

        if (empId === "" || empName === "" || dsgn === "" || dob === "" || mail === "") {
            alert("Enter all input fields");
        }
        else {
            let value = mailValidation(mail);
            if (value) {
                tableData.forEach((rowData => {
                    if (id == rowData.employeeId) {
                        rowData.employeeId = document.getElementById("empIdU").value;
                        rowData.employeeName = document.getElementById("empNameU").value;
                        rowData.designation = document.getElementById("dsgnU").value;
                        rowData.dateOfBirth = document.getElementById("dobU").value;
                        rowData.emailId = document.getElementById("mailidU").value;
                        rowData.skills = [];
                        skillArray.forEach((skillElement) => {
                            let skillObject = {
                                skillName: skillElement,
                                skillId: ""
                            }
                            rowData.skills.push(skillObject);
                        })
                        localStorage.setItem("tData", JSON.stringify(tableData));
                        modal.style.display = "none";
                        window.location.reload();
                    }
                }))
            }
        }
    })
    updateModal.style.display = "block";
}

function skillSuggestion() {
    const parent = document.getElementById("skillSuggestion");
    let skillNames = JSON.parse(localStorage.getItem("sData"));
    skillNames.forEach((skillObj) => {
        let options = document.createElement("option");
        options.innerHTML = skillObj.skill;
        options.setAttribute("id", skillObj.skillId);
        parent.appendChild(options);
    })
}

function deleteButton() {
    let modal = document.getElementById("deleteModal");
    let close = document.getElementById("deleteNo");
    let yesBtn = document.getElementById("deleteYes");
    let deleteClose = document.getElementById("deleteClose");

    deleteClose.onclick = () => {
        modal.style.display = "none";
    }
    close.onclick = () => {
        modal.style.display = "none";
    }
    yesBtn.onclick = () => {
        modal.style.display = "none";
    }
    modal.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    })
}

function deleteEmployee(id) {

    let deleteBtn = document.getElementById("deleteYes");

    deleteBtn.addEventListener("click", () => {
        tableData.forEach((rowData) => {
            if (id == rowData.employeeId) {
                const index = tableData.indexOf(rowData);
                tableData.splice(index, 1);
                localStorage.setItem("tData", JSON.stringify(tableData));
                listTables();
                window.location.reload();
            }
        });
    })
    deleteModal.style.display = "block";
}

function sortTable() {
    let sortSelect = document.getElementById("sortButton");
    let value;
    sortSelect.addEventListener("change", () => {
        value = sortSelect.value;
        value === "empIdSort" ? sortById() : sortByName();
        window.location.reload();
    })

}

function sortById() {
    let tableData = JSON.parse(localStorage.getItem("tData"));
    tableData.sort((a, b) => {
        return a.employeeId - b.employeeId;
    });
    localStorage.setItem("tData", JSON.stringify(tableData));
}

function sortByName() {
    let tableData = JSON.parse(localStorage.getItem("tData"));
    tableData.sort((a, b) => {
        let ea = a.employeeName.toLowerCase(),
            eb = b.employeeName.toLowerCase();
        if (ea < eb) {
            return -1;
        }
        if (ea > eb) {
            return 1;
        }
        return 0;
    });
    localStorage.setItem("tData", JSON.stringify(tableData));
}


function filter() {
    let filterButton = document.getElementById("filterButton");
    filterButton.addEventListener("keyup", () => {
        filterTable(filterButton.value);
    })
}

function filterTable(value) {
    let rows = document.querySelectorAll("#tableBody tr");
    console.log(rows);
    rows.forEach((row) => {
        let skillSpan = row.getElementsByClassName("skillSpan");
        let isAvailable = false;
        for(span of skillSpan) {
            span.textContent.toLowerCase().startsWith(value.toLowerCase()) && (isAvailable = true)
        }
        isAvailable ? (row.style.display = "") : (row.style.display = "none");
    })
}
